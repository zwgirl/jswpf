package org.summer.view.widget.xaml;

import javax.sql.rowset.spi.XmlReader;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.collection.Stack;
import org.summer.view.widget.data.BindingFlags;
import org.summer.view.widget.markup.INameScope;
import org.summer.view.widget.markup.MarkupExtension;
import org.summer.view.widget.markup.TypeExtension;
import org.summer.view.widget.markup.XData;
import org.summer.view.widget.markup.XamlSetValueEventArgs;
import org.summer.view.widget.xaml.XamlWriter;
import org.summer.view.widget.model.ISupportInitialize;
import org.summer.view.widget.reflection.EventInfo;
import org.summer.view.widget.reflection.MethodInfo;
import org.summer.view.widget.xaml.schema.XamlTypeName;
import org.summer.view.widget.xml.serialization.IXmlSerializable;

public class XamlObjectWriter extends XamlWriter implements IXamlLineInfoConsumer
{
	public XamlObjectWriter (XamlSchemaContext schemaContext)
	{
		this (schemaContext, null);
	}

	public XamlObjectWriter (XamlSchemaContext schemaContext, XamlObjectWriterSettings settings)
	{
		if (schemaContext == null)
			throw new ArgumentNullException ("schemaContext");
		this.sctx = schemaContext;
		this.settings = settings ?? new XamlObjectWriterSettings ();
		var manager = new XamlWriterStateManager<XamlObjectWriterException, XamlObjectWriterException> (false);
		intl = new XamlObjectWriterInternal (this, sctx, manager);
	}

	XamlSchemaContext sctx;
	XamlObjectWriterSettings settings;

	XamlObjectWriterInternal intl;

	//int line, column;
	boolean lineinfo_was_given;

	/*internal*/ public XamlObjectWriterSettings Settings {
		get { return settings; }
	}

	public /*virtual*/ Object Result {
		get { return intl.Result; }
	}

	public INameScope RootNameScope {
		get { return intl.NameScope; }
	}

	public /*override*/ XamlSchemaContext SchemaContext {
		get { return sctx; }
	}

	public boolean ShouldProvideLineInfo {
		get { return lineinfo_was_given; }
	}

	public void SetLineInfo (int lineNumber, int linePosition)
	{
//		line = lineNumber;
//		column = linePosition;
		lineinfo_was_given = true;
	}

	public void Clear ()
	{
		throw new NotImplementedException ();
	}

	protected /*override*/ void Dispose (boolean disposing)
	{
		if (!disposing)
			return;

		intl.CloseAll ();
	}

	protected /*internal*/ /*virtual*/ void OnAfterBeginInit (Object value)
	{
		if (settings.AfterBeginInitHandler != null)
			settings.AfterBeginInitHandler (this, new XamlObjectEventArgs (value));
	}

	protected /*internal*/ /*virtual*/ void OnAfterEndInit (Object value)
	{
		if (settings.AfterEndInitHandler != null)
			settings.AfterEndInitHandler (this, new XamlObjectEventArgs (value));
	}

	protected /*internal*/ /*virtual*/ void OnAfterProperties (Object value)
	{
		if (settings.AfterPropertiesHandler != null)
			settings.AfterPropertiesHandler (this, new XamlObjectEventArgs (value));
	}

	protected /*internal*/ /*virtual*/ void OnBeforeProperties (Object value)
	{
		if (settings.BeforePropertiesHandler != null)
			settings.BeforePropertiesHandler (this, new XamlObjectEventArgs (value));
	}

	protected /*internal*/ /*virtual*/ boolean OnSetValue (Object eventSender, XamlMember member, Object value)
	{
		if (settings.XamlSetValueHandler != null) {
			XamlSetValueEventArgs args = new XamlSetValueEventArgs (member, value);
			settings.XamlSetValueHandler (eventSender, args);
			return args.Handled;
		}
		return false;
	}

	public /*override*/ void WriteGetObject ()
	{
		intl.WriteGetObject ();
	}

	public /*override*/ void WriteNamespace (NamespaceDeclaration namespaceDeclaration)
	{
		intl.WriteNamespace (namespaceDeclaration);
	}

	public /*override*/ void WriteStartObject (XamlType xamlType)
	{
		intl.WriteStartObject (xamlType);
	}

	public /*override*/ void WriteValue (Object value)
	{
		intl.WriteValue (value);
	}

	public /*override*/ void WriteStartMember (XamlMember property)
	{
		intl.WriteStartMember (property);
	}

	public /*override*/ void WriteEndObject ()
	{
		intl.WriteEndObject ();
	}

	public /*override*/ void WriteEndMember ()
	{
		intl.WriteEndMember ();
	}
}

// specific implementation
class XamlObjectWriterInternal extends XamlWriterInternalBase
{
	static final /*const*/ String Xmlns2000Namespace = "http://www.w3.org/2000/xmlns/";

	public XamlObjectWriterInternal (XamlObjectWriter source, XamlSchemaContext schemaContext, XamlWriterStateManager manager)
	{
		super (schemaContext, manager);
		this.source = source;
		this.sctx = schemaContext;
		INameScope ext = source.Settings.ExternalNameScope;
		name_scope = ext != null && source.Settings.RegisterNamesOnExternalNamescope ? ext : new NameScope (ext);
	}

	XamlObjectWriter source;
	XamlSchemaContext sctx;
	INameScope name_scope;
	List<NameFixupRequired> pending_name_references = new List<NameFixupRequired> ();
	AmbientProvider ambient_provider = new AmbientProvider ();

	public INameScope NameScope {
		get { return name_scope; }
	}

	public Object Result { get; set; }

	protected /*override*/ void OnWriteStartObject ()
	{
		ObjectState state = object_states.Pop ();
		if (object_states.Count > 0) {
			ObjectState pstate = object_states.Peek ();
			if (CurrentMemberState.Value != null)
				throw new XamlDuplicateMemberException (String.format ("Member '{0}' is already written to current type '{1}'", CurrentMember, pstate.Type));
		} else {
			Object obj = source.Settings.RootObjectInstance;
			if (obj != null) {
				if (state.Type.UnderlyingType != null && !state.Type.UnderlyingType.IsAssignableFrom (obj.GetType ()))
					throw new XamlObjectWriterException (String.Format ("RootObjectInstance type '{0}' is not assignable to '{1}'", obj.GetType (), state.Type));
				state.Value = obj;
				state.IsInstantiated = true;
			}
			root_state = state;
		}
		object_states.Push (state);
		if (!state.Type.IsContentValue (service_provider))
			InitializeObjectIfRequired (true);

		state.IsXamlWriterCreated = true;
		source.OnBeforeProperties (state.Value);
	}

	protected /*override*/ void OnWriteGetObject ()
	{
		ObjectState state = object_states.Pop ();
		XamlMember xm = CurrentMember;
		Object instance = xm.Invoker.GetValue (object_states.Peek ().Value);
		if (instance == null)
			throw new XamlObjectWriterException (String.format ("The value  for '{0}' property is null", xm.Name));
		state.Value = instance;
		state.IsInstantiated = true;
		object_states.Push (state);
	}

	protected /*override*/ void OnWriteEndObject ()
	{
		InitializeObjectIfRequired (false); // this is required for such case that there was no StartMember call.

		ObjectState state = object_states.Pop ();
		Object obj = state.Value;

		if (obj instanceof MarkupExtension) {
			try {
				obj = ((MarkupExtension) obj).ProvideValue (service_provider);
			} catch (XamlObjectWriterException e) {
				throw e;
			} catch (Exception ex) {
				throw new XamlObjectWriterException ("An error occured on getting provided value", ex);
			}
		}

		// call this (possibly) before the Object is added to parent collection. (bug #3003 also expects this)
		if (state.IsXamlWriterCreated)
			source.OnAfterProperties (obj);

		NameFixupRequired nfr = obj as NameFixupRequired;
		if (nfr != null && object_states.Count > 0) { // IF the root Object to be written is x:Reference, then the Result property will become the NameFixupRequired. That's what .NET also does.
			// actually .NET seems to seek "parent" Object in its own IXamlNameResolver implementation.
			ObjectState pstate = object_states.Peek ();
			nfr.ParentType = pstate.Type;
			nfr.ParentMember = CurrentMember; // Note that it is a member of the pstate.
			nfr.ParentValue = pstate.Value;
			pending_name_references.Add ((NameFixupRequired) obj);
		}
		else
			StoreAppropriatelyTypedValue (obj, state.KeyValue);

		if (state.Type.IsAmbient)
			ambient_provider.Pop ();
		else
			HandleEndInit (obj);

		object_states.Push (state);
		if (object_states.Count == 1) {
			Result = obj;
			ResolvePendingReferences ();
		}
	}

	Stack<Object> escaped_objects = new Stack<Object> ();

	protected /*override*/ void OnWriteStartMember (XamlMember property)
	{
		if (property == XamlLanguage.PositionalParameters ||
		    property == XamlLanguage.Arguments) {
			ObjectState state = object_states.Peek ();
			escaped_objects.Push (state.Value);
			state.Value = new List<Object> ();
		}

		// FIXME: this condition needs to be examined. What is known to be prevented are: PositionalParameters, Initialization and Base (the last one sort of indicates there's a lot more).
		else if (!(property instanceof XamlDirective))
			InitializeObjectIfRequired (false);
	}

	static final BindingFlags static_flags = BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static;

	protected /*override*/ void OnWriteEndMember ()
	{
		XamlMember xm = CurrentMember;
		ObjectState state = object_states.Peek ();

		if (xm == XamlLanguage.PositionalParameters) {
			List<Object> l = (List<Object>) state.Value;
			state.Value = escaped_objects.Pop ();
			state.IsInstantiated = true;
			PopulateObject (true, l);
			return;
		} else if (xm == XamlLanguage.Arguments) {
			if (state.FactoryMethod != null) {
				Object contents = (List<Object>) state.Value;
				MethodInfo mi = state.Type.UnderlyingType.GetMethods (static_flags).FirstOrDefault (mii => mii.Name == state.FactoryMethod && mii.GetParameters ().Length == contents.Count);
				if (mi == null)
					throw new XamlObjectWriterException (String.format ("Specified static factory method '{0}' for type '{1}' was not found", state.FactoryMethod, state.Type));
				state.Value = mi.Invoke (null, contents.ToArray ());
			}
			else
				PopulateObject (false, (List<Object>) state.Value);
			state.IsInstantiated = true;
			escaped_objects.Pop ();
		} else if (xm == XamlLanguage.Initialization) {
			// ... and no need to do anything. The Object value to pop *is* the return value.
		} else if (xm == XamlLanguage.Name || xm == state.Type.GetAliasedProperty (XamlLanguage.Name)) {
			String name = (String) CurrentMemberState.Value;
			name_scope.RegisterName (name, state.Value);
		} else {
			if (xm.IsEvent)
				SetEvent (xm, (String) CurrentMemberState.Value);
			else if (!xm.IsReadOnly) // exclude read-only Object such as collection item.
				SetValue (xm, CurrentMemberState.Value);
		}
	}

	void SetEvent (XamlMember member, String value)
	{
		if (member.UnderlyingMember == null)
			throw new XamlObjectWriterException (String.format ("Event {0} has no underlying member to attach event", member));

		int idx = value.lastIndexOf ('.');
		var xt = idx < 0 ? root_state.Type : ResolveTypeFromName (value.substring (0, idx));
		if (xt == null)
			throw new XamlObjectWriterException (String.format ("Referenced type {0} in event {1} was not found", value, member));
		if (xt.UnderlyingType == null)
			throw new XamlObjectWriterException (String.format ("Referenced type {0} in event {1} has no underlying type", value, member));
		String mn = idx < 0 ? value : value.substring (idx + 1);
		EventInfo ev = (EventInfo) member.UnderlyingMember;
		// get an appropriate MethodInfo overload whose signature matches the event's handler type.
		// FIXME: this may need more strict match. RuntimeBinder may be useful here.
		var eventMethodParams = ev.EventHandlerType.GetMethod ("Invoke").GetParameters ();

		Object target = root_state.Value;
		MethodInfo mi = target.GetType().GetMethod (mn, BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public, null, (from pi in eventMethodParams select pi.ParameterType).ToArray (), null);
		if (mi == null)
			throw new XamlObjectWriterException (String.Format ("Referenced value method {0} in type {1} indicated by event {2} was not found", mn, value, member));
		var obj = object_states.Peek ().Value;
		ev.AddEventHandler (obj, Delegate.CreateDelegate (ev.EventHandlerType, target, mi));
	}

	void SetValue (XamlMember member, Object value)
	{
		if (member == XamlLanguage.FactoryMethod)
			object_states.Peek ().FactoryMethod = (String) value;
		else if (member.IsDirective)
			return;
		else
			SetValue (member, object_states.Peek ().Value, value);
	}

	void SetValue (XamlMember member, Object target, Object value)
	{
		if (!source.OnSetValue (target, member, value))
			member.Invoker.SetValue (target, value);
	}

	void PopulateObject (boolean considerPositionalParameters, IList<Object> contents)
	{
		ObjectState state = object_states.Peek ();

		var args = state.Type.GetSortedConstructorArguments ().ToArray ();
		var argt = args != null ? (IList<XamlType>) (from arg in args select arg.Type).ToArray () : considerPositionalParameters ? state.Type.GetPositionalParameters (contents.Count) : null;

		var argv = new Object [argt.Count];
		for (int i = 0; i < argv.Length; i++)
			argv [i] = GetCorrectlyTypedValue (args [i], argt [i], contents [i]);
		state.Value = state.Type.Invoker.CreateInstance (argv);
		state.IsInstantiated = true;
		if (state.Type.IsAmbient)
			ambient_provider.Push (new AmbientPropertyValue (CurrentMember, state.Value));
		HandleBeginInit (state.Value);
	}

	protected /*override*/ void OnWriteValue (Object value)
	{
		if (CurrentMemberState.Value != null)
			throw new XamlDuplicateMemberException (String.format ("Member '{0}' is already written to current type '{1}'", CurrentMember, object_states.Peek ().Type));
		StoreAppropriatelyTypedValue (value, null);
	}

	protected /*override*/ void OnWriteNamespace (NamespaceDeclaration nd)
	{
		// nothing to do here.
	}

	void StoreAppropriatelyTypedValue (Object obj, Object keyObj)
	{
		MemberAndValue ms = CurrentMemberState; // note that this retrieves parent's current property for EndObject.
		if (ms != null) {
			ObjectState state = object_states.Peek ();
			Object parent = state.Value;
			XamlType xt = state.Type;
			XamlMember xm = ms.Member;
			if (xm == XamlLanguage.Initialization) {
				state.Value = GetCorrectlyTypedValue (null, xt, obj);
				state.IsInstantiated = true;
			} else if (xm.IsEvent) {
				ms.Value = (String) obj; // save name of value delegate (method).
				state.IsInstantiated = true;
			} else if (xm.Type.IsXData) {
				XData xdata = (XData) obj;
				IXmlSerializable ixser = xm.Invoker.GetValue (state.Value) as IXmlSerializable;
				if (ixser != null)
					ixser.ReadXml ((XmlReader) xdata.XmlReader);
			}
			else if (xm == XamlLanguage.Base)
				ms.Value = GetCorrectlyTypedValue (null, xm.Type, obj);
			else if (xm == XamlLanguage.Name || xm == xt.GetAliasedProperty (XamlLanguage.Name))
				ms.Value = GetCorrectlyTypedValue (xm, XamlLanguage.String, obj);
			else if (xm == XamlLanguage.Key)
				state.KeyValue = GetCorrectlyTypedValue (null, xt.KeyType, obj);
			else {
				if (!AddToCollectionIfAppropriate (xt, xm, parent, obj, keyObj)) {
					if (!xm.IsReadOnly)
						ms.Value = GetCorrectlyTypedValue (xm, xm.Type, obj);
				}
			}
		}
	}

	boolean AddToCollectionIfAppropriate (XamlType xt, XamlMember xm, Object parent, Object obj, Object keyObj)
	{
		XamlType mt = xm.Type;
		if (xm == XamlLanguage.Items ||
		    xm == XamlLanguage.PositionalParameters ||
		    xm == XamlLanguage.Arguments) {
			if (xt.IsDictionary)
				mt.Invoker.AddToDictionary (parent, GetCorrectlyTypedValue (null, xt.KeyType, keyObj), GetCorrectlyTypedValue (null, xt.ItemType, obj));
			else // collection. Note that state.Type isn't usable for PositionalParameters to identify collection kind.
				mt.Invoker.AddToCollection (parent, GetCorrectlyTypedValue (null, xt.ItemType, obj));
			return true;
		}
		else
			return false;
	}

	Object GetCorrectlyTypedValue (XamlMember xm, XamlType xt, Object value)
	{
		try {
			return DoGetCorrectlyTypedValue (xm, xt, value);
		} catch (XamlObjectWriterException e) {
			throw e;
		} catch (Exception ex) {
			// For + ex.Message, the runtime should print InnerException message like .NET does.
			throw new XamlObjectWriterException (String.format ("Could not convert Object \'{0}' (of type {1}) to {2}: ", value, value != null ? (Object) value.GetType () : "(null)", xt)  + ex.Message, ex);
		}
	}

	// It expects that it is not invoked when there is no value to 
	// assign.
	// When it is passed null, then it returns a default instance.
	// For example, passing null as Int32 results in 0.
	// But do not immediately try to instantiate with the type, since the type might be abstract.
	Object DoGetCorrectlyTypedValue (XamlMember xm, XamlType xt, Object value)
	{
		if (value == null) {
			if (xt.IsContentValue (service_provider)) // it is for collection/dictionary key and item
				return null;
			else
				return xt.IsNullable ? null : xt.Invoker.CreateInstance (new Object [0]);
		}
		if (xt == null)
			return value;

		// Not sure if this is really required though...
		XamlType  vt = sctx.GetXamlType (value.GetType ());
		if (vt.CanAssignTo (xt))
			return value;

		// FIXME: this could be generalized by some means, but I cannot find any.
		if (xt.UnderlyingType == typeof (XamlType) && value is String)
			value = ResolveTypeFromName ((String) value);

		// FIXME: this could be generalized by some means, but I cannot find any.
		if (xt.UnderlyingType == typeof (Type))
			value = new TypeExtension ((String) value).ProvideValue (service_provider);
		if (xt == XamlLanguage.Type && value is String)
			value = new TypeExtension ((String) value);

		if (IsAllowedType (xt, value))
			return value;

		var xtc = (xm != null ? xm.TypeConverter : null) ?? xt.TypeConverter;
		if (xtc != null && value != null) {
			var tc = xtc.ConverterInstance;
			if (tc != null && tc.CanConvertFrom (value.GetType ()))
				value = tc.ConvertFrom (value);
			return value;
		}

		throw new XamlObjectWriterException (String.Format ("Value '{0}' (of type {1}) is not of or convertible to type {0} (member {3})", value, value != null ? (Object) value.GetType () : "(null)", xt, xm));
	}

	XamlType ResolveTypeFromName (String name)
	{
		IXamlNamespaceResolver nsr = (IXamlNamespaceResolver) service_provider.GetService (typeof (IXamlNamespaceResolver));
		return sctx.GetXamlType (XamlTypeName.Parse (name, nsr));
	}

	boolean IsAllowedType (XamlType xt, Object value)
	{
		return  xt == null ||
			xt.UnderlyingType == null ||
			xt.UnderlyingType.IsInstanceOfType (value) ||
			value == null && xt == XamlLanguage.Null ||
			xt.IsMarkupExtension && IsAllowedType (xt.MarkupExtensionReturnType, value);
	}

	void InitializeObjectIfRequired (boolean waitForParameters)
	{
		ObjectState state = object_states.Peek ();
		if (state.IsInstantiated)
			return;

		if (waitForParameters && (state.Type.ConstructionRequiresArguments || state.Type.HasPositionalParameters (service_provider)))
			return;

		// FIXME: "The default techniques in absence of a factory method are to attempt to find a default constructor, then attempt to find an identified type converter on type, member, or destination type."
		// http://msdn.microsoft.com/en-us/library/system.xaml.xamllanguage.factorymethod%28VS.100%29.aspx
		Object obj;
		if (state.FactoryMethod != null) // FIXME: it must be implemented and verified with tests.
			throw new NotImplementedException ();
		else
			obj = state.Type.Invoker.CreateInstance (null);
		state.Value = obj;
		state.IsInstantiated = true;
		if (state.Type.IsAmbient)
			ambient_provider.Push (new AmbientPropertyValue (CurrentMember, obj));
		else
			HandleBeginInit (obj);
	}

	/*internal*/ public IXamlNameResolver name_resolver {
		get { return (IXamlNameResolver) service_provider.GetService (typeof (IXamlNameResolver)); }
	}

	/*internal*/ public /*override*/ IAmbientProvider AmbientProvider {
		get { return ambient_provider; }
	}

	void ResolvePendingReferences ()
	{
		for/*each*/ (var fixup : pending_name_references) {
			for/*each*/ (var name : fixup.Names) {
				boolean isFullyInitialized;
				// FIXME: sort out relationship between name_scope and name_resolver. (unify to name_resolver, probably)
				Object obj = name_scope.FindName (name) ?? name_resolver.Resolve (name, /*out*/ isFullyInitialized);
				if (obj == null)
					throw new XamlObjectWriterException (String.Format ("Unresolved Object reference '{0}' was found", name));
				if (!AddToCollectionIfAppropriate (fixup.ParentType, fixup.ParentMember, fixup.ParentValue, obj, null)) // FIXME: is keyObj always null?
					SetValue (fixup.ParentMember, fixup.ParentValue, obj);
			}
		}
	}

	void HandleBeginInit (Object value)
	{
		ISupportInitialize si = value as ISupportInitialize;
		if (si == null)
			return;
		si.BeginInit ();
		source.OnAfterBeginInit (value);
	}

	void HandleEndInit (Object value)
	{
		ISupportInitialize si = value as ISupportInitialize;
		if (si == null)
			return;
		si.EndInit ();
		source.OnAfterEndInit (value);
	}
}