package org.summer.view.widget.xaml;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.collection.Stack;
import org.summer.view.widget.markup.IValueSerializerContext;
import org.summer.view.widget.xaml.schema.XamlValueConverter;

/*internal*/public abstract class XamlWriterInternalBase
	{
		public XamlWriterInternalBase (XamlSchemaContext schemaContext, XamlWriterStateManager manager)
		{
			this.sctx = schemaContext;
			this.manager = manager;
			var p = new PrefixLookup (sctx) { IsCollectingNamespaces = true }; // it does not raise unknown namespace error.
			service_provider = new ValueSerializerContext (p, schemaContext, AmbientProvider);
		}

		XamlSchemaContext sctx;
		XamlWriterStateManager manager;

		/*internal*/public IValueSerializerContext service_provider;

		/*internal*/public ObjectState root_state;
		/*internal*/public Stack<ObjectState> object_states = new Stack<ObjectState> ();
		/*internal*/public PrefixLookup prefix_lookup {
			get { return (PrefixLookup) service_provider.GetService (typeof (INamespacePrefixLookup)); }
		}

		List<NamespaceDeclaration> namespaces {
			get { return prefix_lookup.Namespaces; }
		}

		/*internal*/public /*virtual*/ IAmbientProvider AmbientProvider {
			get { return null; }
		}

		/*internal*/public class ObjectState
		{
			public XamlType Type;
			public boolean IsGetObject;
			public int PositionalParameterIndex = -1;

			public String FactoryMethod;
			public Object Value;
			public Object KeyValue;
			public List<MemberAndValue> WrittenProperties = new List<MemberAndValue> ();
			public boolean IsInstantiated;
			public boolean IsXamlWriterCreated; // affects AfterProperties() calls.
		}

		/*internal*/public class MemberAndValue
		{
			public MemberAndValue (XamlMember xm)
			{
				Member = xm;
			}

			public XamlMember Member;
			public Object Value;
			public AllowedMemberLocations OccuredAs = AllowedMemberLocations.None;
		}

		public void CloseAll ()
		{
			while (object_states.Count > 0) {
				switch (manager.State) {
				case XamlWriteState.MemberDone:
				case XamlWriteState.ObjectStarted: // StartObject without member
					WriteEndObject ();
					break;
				case XamlWriteState.ValueWritten:
				case XamlWriteState.ObjectWritten:
				case XamlWriteState.MemberStarted: // StartMember without content
					manager.OnClosingItem ();
					WriteEndMember ();
					break;
				default:
					throw new NotImplementedException (manager.State.ToString ()); // there shouldn't be anything though
				}
			}
		}

		/*internal*/public String GetPrefix (String ns)
		{
			for/*each*/ (NamespaceDeclaration nd : namespaces)
				if (nd.Namespace == ns)
					return nd.Prefix;
			return null;
		}

		protected MemberAndValue CurrentMemberState {
			get { return object_states.Count > 0 ? object_states.Peek ().WrittenProperties.LastOrDefault () : null; }
		}

		protected XamlMember CurrentMember {
			get {
				MemberAndValue mv = CurrentMemberState;
				return mv != null ? mv.Member : null;
			}
		}

		public void WriteGetObject ()
		{
			manager.GetObject ();

			XamlMember xm = CurrentMember;

			ObjectState state = new ObjectState () {Type = xm.Type, IsGetObject = true};

			object_states.Push (state);

			OnWriteGetObject ();
		}

		public void WriteNamespace (NamespaceDeclaration namespaceDeclaration)
		{
			if (namespaceDeclaration == null)
				throw new ArgumentNullException ("namespaceDeclaration");

			manager.Namespace ();

			namespaces.Add (namespaceDeclaration);
			OnWriteNamespace (namespaceDeclaration);
		}

		public void WriteStartObject (XamlType xamlType)
		{
			if (xamlType == null)
				throw new ArgumentNullException ("xamlType");

			manager.StartObject ();

			ObjectState cstate = new ObjectState () {Type = xamlType};
			object_states.Push (cstate);

			OnWriteStartObject ();
		}

		public void WriteValue (Object value)
		{
			manager.Value ();

			OnWriteValue (value);
		}

		public void WriteStartMember (XamlMember property)
		{
			if (property == null)
				throw new ArgumentNullException ("property");

			manager.StartMember ();
			if (property == XamlLanguage.PositionalParameters)
				// this is an exception that indicates the state manager to accept more than values within this member.
				manager.AcceptMultipleValues = true;

			ObjectState state = object_states.Peek ();
			List<MemberAndValue> wpl = state.WrittenProperties;
			if (wpl.Any (wp => wp.Member == property))
				throw new XamlDuplicateMemberException (String.Format ("Property '{0}' is already set to this '{1}' Object", property, object_states.Peek ().Type));
			wpl.Add (new MemberAndValue (property));
			if (property == XamlLanguage.PositionalParameters)
				state.PositionalParameterIndex = 0;

			OnWriteStartMember (property);
		}

		public void WriteEndObject ()
		{
			manager.EndObject (object_states.Count > 1);

			OnWriteEndObject ();

			object_states.Pop ();
		}

		public void WriteEndMember ()
		{
			manager.EndMember ();

			OnWriteEndMember ();

			ObjectState state = object_states.Peek ();
			if (CurrentMember == XamlLanguage.PositionalParameters) {
				manager.AcceptMultipleValues = false;
				state.PositionalParameterIndex = -1;
			}
		}

		protected abstract void OnWriteEndObject ();

		protected abstract void OnWriteEndMember ();

		protected abstract void OnWriteStartObject ();

		protected abstract void OnWriteGetObject ();

		protected abstract void OnWriteStartMember (XamlMember xm);

		protected abstract void OnWriteValue (Object value);

		protected abstract void OnWriteNamespace (NamespaceDeclaration nd);

		protected String GetValueString (XamlMember xm, Object value)
		{
			// change XamlXmlReader too if we change here.
			if ((value as String) == String.Empty) // FIXME: there could be some escape syntax.
				return "\"\"";

			XamlType xt = value == null ? XamlLanguage.Null : sctx.GetXamlType (value.GetType ());
			XamlValueConverter vs = xm.ValueSerializer ?? xt.ValueSerializer;
			if (vs != null)
				return vs.ConverterInstance.ConvertToString (value, service_provider);
			else
				throw new XamlXmlWriterException (String.Format ("Value type is '{0}' but it must be either String or any type that is convertible to String indicated by TypeConverterAttribute.", value != null ? value.GetType () : null));
		}
	}