package org.summer.view.widget.xaml;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.model.TypeConverter;
import org.summer.view.widget.reflection.MethodInfo;

public class XamlDirective extends XamlMember
	{
		class DirectiveMemberInvoker extends XamlMemberInvoker
		{
			public DirectiveMemberInvoker (XamlDirective directive)
			{
				base (directive);
			}
		}

		public XamlDirective (String xamlNamespace, String name)
		{
			this (new String [] {xamlNamespace}, name, new XamlType (typeof (object), new XamlSchemaContext (new XamlSchemaContextSettings ())), null, AllowedMemberLocations.Any);
			if (xamlNamespace == null)
				throw new ArgumentNullException ("xamlNamespace");
			is_unknown = true;
		}

		public XamlDirective (IEnumerable<String> xamlNamespaces, String name, XamlType xamlType, XamlValueConverter<TypeConverter> typeConverter, AllowedMemberLocations allowedLocation)
		{
			super (true, xamlNamespaces != null ? xamlNamespaces.FirstOrDefault () : null, name);
			if (xamlNamespaces == null)
				throw new ArgumentNullException ("xamlNamespaces");
			if (xamlType == null)
				throw new ArgumentNullException ("xamlType");

			type = xamlType;
			xaml_namespaces = new List<String> (xamlNamespaces);
			AllowedLocation = allowedLocation;
			type_converter = typeConverter;

			invoker = new DirectiveMemberInvoker (this);
		}

		public AllowedMemberLocations AllowedLocation { get; private set; }
		XamlValueConverter<TypeConverter> type_converter;
		XamlType type;
		XamlMemberInvoker invoker;
		boolean is_unknown;
		IList<String> xaml_namespaces;

		// this is for XamlLanguage.UnknownContent
		internal boolean InternalIsUnknown {
			set { is_unknown = value; }
		}

		public /*override*/ int GetHashCode ()
		{
			return ToString ().GetHashCode ();
		}

		public /*override*/ IList<String> GetXamlNamespaces ()
		{
			return xaml_namespaces;
		}

		protected /*override*/ /*sealed*/ ICustomAttributeProvider LookupCustomAttributeProvider ()
		{
			return null; // as documented.
		}

		protected /*override*/ /*sealed*/ XamlValueConverter<XamlDeferringLoader> LookupDeferringLoader ()
		{
			return null; // as documented.
		}

		protected /*override*/ /*sealed*/ IList<XamlMember> LookupDependsOn ()
		{
			return null; // as documented.
		}

		protected /*override*/ /*sealed*/ XamlMemberInvoker LookupInvoker ()
		{
			return invoker;
		}

		protected /*override*/ /*sealed*/ boolean LookupIsAmbient ()
		{
			return false;
		}

		protected /*override*/ /*sealed*/ boolean LookupIsEvent ()
		{
			return false;
		}

		protected /*override*/ /*sealed*/ boolean LookupIsReadOnly ()
		{
			return false;
		}

		protected /*override*/ /*sealed*/ boolean LookupIsReadPublic ()
		{
			return true;
		}

		protected /*override*/ /*sealed*/ boolean LookupIsUnknown ()
		{
			return is_unknown;
		}

		protected /*override*/ /*sealed*/ boolean LookupIsWriteOnly ()
		{
			return false;
		}

		protected /*override*/ /*sealed*/ boolean LookupIsWritePublic ()
		{
			return true;
		}

		protected /*override*/ /*sealed*/ XamlType LookupTargetType ()
		{
			return null;
		}

		protected /*override*/ /*sealed*/ XamlType LookupType ()
		{
			return type;
		}

		protected /*override*/ /*sealed*/ XamlValueConverter<TypeConverter> LookupTypeConverter ()
		{
			if (type_converter == null)
				type_converter = base.LookupTypeConverter ();
			return type_converter;
		}

		protected /*override*/ /*sealed*/ MethodInfo LookupUnderlyingGetter ()
		{
			return null;
		}

		protected /*override*/ /*sealed*/ MemberInfo LookupUnderlyingMember ()
		{
			return null;
		}

		protected /*override*/ /*sealed*/ MethodInfo LookupUnderlyingSetter ()
		{
			return null;
		}

		public /*override*/ String ToString ()
		{
			return String.IsNullOrEmpty (PreferredXamlNamespace) ? Name : String.Concat ("{", PreferredXamlNamespace, "}", Name);
		}
	}