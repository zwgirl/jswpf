package org.summer.view.widget.xaml;

import java.util.List;

import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.ReadOnlyCollection;
import org.summer.view.widget.reflection.Assembly;

public /*static*/ class XamlLanguage
	{
		public /*const*/ static final String Xaml2006Namespace = "http://schemas.microsoft.com/winfx/2006/xaml";
		public /*const*/ static final String Xml1998Namespace = "http://www.w3.org/XML/1998/namespace";
		/*internal*/ public /*const*/ static final String Xmlns2000Namespace = "http://www.w3.org/2000/xmlns/";

		// FIXME: I'm not sure if these "special names" should be resolved like this. I couldn't find any rule so far.
		/*internal*/ public static final SpecialTypeNameList SpecialNames;

		/*internal*/ public class SpecialTypeNameList implements List<SpecialTypeName>
		{
			/*internal*/ public SpecialTypeNameList ()
			{
				Add (new SpecialTypeName ("Member", XamlLanguage.Member));
				Add (new SpecialTypeName ("Property", XamlLanguage.Property));
			}

			public XamlType Find (String name, String ns)
			{
				if (ns != XamlLanguage.Xaml2006Namespace)
					return null;
				var stn = this.FirstOrDefault (s => s.Name == name);
				return stn != null ? stn.Type : null;
			}
		}

		/*internal*/ public class SpecialTypeName
		{
			public SpecialTypeName (String name, XamlType type)
			{
				Name = name;
				Type = type;
			}

			public String Name { get; private set; }
			public XamlType Type { get; private set; }
		}

		static final XamlSchemaContext sctx = new XamlSchemaContext (new Assembly [] {typeof (XamlType).Assembly});

		static  XamlType XT<T> ()
		{
			return sctx.GetXamlType (typeof (T));
		}

		/*internal*/ public static final boolean InitializingDirectives;
		/*internal*/ public static final boolean InitializingTypes;

		static //XamlLanguage ()
		{
			InitializingTypes = true;

			// types

			Array = XT<ArrayExtension> ();
			Boolean = XT<Boolean> ();
			Byte = XT<Byte> ();
			Char = XT<Character> ();
			Decimal = XT<Decimal> ();
			Double = XT<Double> ();
			Int16 = XT<Short> ();
			Int32 = XT<Integer> ();
			Int64 = XT<Long> ();
			Member = XT<MemberDefinition> ();
			Null = XT<NullExtension> ();
			Object = XT<object> ();
			Property = XT<PropertyDefinition> ();
			Reference = XT<Reference> ();
			Single = XT<Float> ();
			Static = XT<StaticExtension> ();
			String = XT<String> ();
			TimeSpan = XT<TimeSpan> ();
			Type = XT<TypeExtension> ();
			Uri = XT<Uri> ();
			XData = XT<XData> ();

			InitializingTypes = false;

			AllTypes = new ReadOnlyCollection<XamlType> (new XamlType [] {Array, Boolean, Byte, Char, Decimal, Double, Int16, Int32, Int64, Member, Null, Object, Property, Reference, Single, Static, String, TimeSpan, Type, Uri, XData});

			// directives

			// Looks like predefined XamlDirectives have no ValueSerializer. 
			// To handle this situation, differentiate them from non-primitive XamlMembers.
			InitializingDirectives = true;

			String [] nss = new String [] {XamlLanguage.Xaml2006Namespace};
			String [] nssXml = new String [] {XamlLanguage.Xml1998Namespace};

			Arguments = new XamlDirective (nss, "Arguments", XT<List<object>> (), null, AllowedMemberLocations.Any);
			AsyncRecords = new XamlDirective (nss, "AsyncRecords", XT<String> (), null, AllowedMemberLocations.Attribute);
			Base = new XamlDirective (nssXml, "base", XT<String> (), null, AllowedMemberLocations.Attribute);
			Class = new XamlDirective (nss, "Class", XT<String> (), null, AllowedMemberLocations.Attribute);
			ClassAttributes = new XamlDirective (nss, "ClassAttributes", XT<List<Attribute>> (), null, AllowedMemberLocations.MemberElement);
			ClassModifier = new XamlDirective (nss, "ClassModifier", XT<String> (), null, AllowedMemberLocations.Attribute);
			Code = new XamlDirective (nss, "Code", XT<String> (), null, AllowedMemberLocations.Attribute);
			ConnectionId = new XamlDirective (nss, "ConnectionId", XT<String> (), null, AllowedMemberLocations.Any);
			FactoryMethod = new XamlDirective (nss, "FactoryMethod", XT<String> (), null, AllowedMemberLocations.Any);
			FieldModifier = new XamlDirective (nss, "FieldModifier", XT<String> (), null, AllowedMemberLocations.Attribute);
			Initialization = new XamlDirective (nss, "_Initialization", XT<object> (), null, AllowedMemberLocations.Any);
			Items = new XamlDirective (nss, "_Items", XT<List<object>> (), null, AllowedMemberLocations.Any);
			Key = new XamlDirective (nss, "Key", XT<object> (), null, AllowedMemberLocations.Any);
			Lang = new XamlDirective (nssXml, "lang", XT<String> (), null, AllowedMemberLocations.Attribute);
			Members = new XamlDirective (nss, "Members", XT<List<MemberDefinition>> (), null, AllowedMemberLocations.MemberElement);
			Name = new XamlDirective (nss, "Name", XT<String> (), null, AllowedMemberLocations.Attribute);
			PositionalParameters = new XamlDirective (nss, "_PositionalParameters", XT<List<object>> (), null, AllowedMemberLocations.Any);
			Space = new XamlDirective (nssXml, "space", XT<String> (), null, AllowedMemberLocations.Attribute);
			Subclass = new XamlDirective (nss, "Subclass", XT<String> (), null, AllowedMemberLocations.Attribute);
			SynchronousMode = new XamlDirective (nss, "SynchronousMode", XT<String> (), null, AllowedMemberLocations.Attribute);
			Shared = new XamlDirective (nss, "Shared", XT<String> (), null, AllowedMemberLocations.Attribute);
			TypeArguments = new XamlDirective (nss, "TypeArguments", XT<String> (), null, AllowedMemberLocations.Attribute);
			Uid = new XamlDirective (nss, "Uid", XT<String> (), null, AllowedMemberLocations.Attribute);
			UnknownContent = new XamlDirective (nss, "_UnknownContent", XT<object> (), null, AllowedMemberLocations.MemberElement) { InternalIsUnknown = true };

			AllDirectives = new ReadOnlyCollection<XamlDirective> (new XamlDirective [] {Arguments, AsyncRecords, Base, Class, ClassAttributes, ClassModifier, Code, ConnectionId, FactoryMethod, FieldModifier, Initialization, Items, Key, Lang, Members, Name, PositionalParameters, Space, Subclass, SynchronousMode, Shared, TypeArguments, Uid, UnknownContent});

			InitializingDirectives = false;

			SpecialNames = new SpecialTypeNameList ();
		}

		static final String [] xaml_nss = new String [] {Xaml2006Namespace};

		public static IList<String> XamlNamespaces {
			get { return xaml_nss; }
		}

		static final String [] xml_nss = new String [] {Xml1998Namespace};

		public static IList<String> XmlNamespaces {
			get { return xml_nss; }
		}

		public static ReadOnlyCollection<XamlDirective> AllDirectives { get; private set; }

		public static XamlDirective Arguments { get; private set; }
		public static XamlDirective AsyncRecords { get; private set; }
		public static XamlDirective Base { get; private set; }
		public static XamlDirective Class { get; private set; }
		public static XamlDirective ClassAttributes { get; private set; }
		public static XamlDirective ClassModifier { get; private set; }
		public static XamlDirective Code { get; private set; }
		public static XamlDirective ConnectionId { get; private set; }
		public static XamlDirective FactoryMethod { get; private set; }
		public static XamlDirective FieldModifier { get; private set; }
		public static XamlDirective Initialization { get; private set; }
		public static XamlDirective Items { get; private set; }
		public static XamlDirective Key { get; private set; }
		public static XamlDirective Lang { get; private set; }
		public static XamlDirective Members { get; private set; }
		public static XamlDirective Name { get; private set; }
		public static XamlDirective PositionalParameters { get; private set; }
		public static XamlDirective Subclass { get; private set; }
		public static XamlDirective SynchronousMode { get; private set; }
		public static XamlDirective Shared { get; private set; }
		public static XamlDirective Space { get; private set; }
		public static XamlDirective TypeArguments { get; private set; }
		public static XamlDirective Uid { get; private set; }
		public static XamlDirective UnknownContent { get; private set; }

		public static ReadOnlyCollection<XamlType> AllTypes { get; private set; }

		public static XamlType Array { get; private set; }
		public static XamlType Boolean { get; private set; }
		public static XamlType Byte { get; private set; }
		public static XamlType Char { get; private set; }
		public static XamlType Decimal { get; private set; }
		public static XamlType Double { get; private set; }
		public static XamlType Int16 { get; private set; }
		public static XamlType Int32 { get; private set; }
		public static XamlType Int64 { get; private set; }
		public static XamlType Member { get; private set; }
		public static XamlType Null { get; private set; }
		public static XamlType Object { get; private set; }
		public static XamlType Property { get; private set; }
		public static XamlType Reference { get; private set; }
		public static XamlType Single { get; private set; }
		public static XamlType Static { get; private set; }
		public static XamlType String { get; private set; }
		public static XamlType TimeSpan { get; private set; }
		public static XamlType Type { get; private set; }
		public static XamlType Uri { get; private set; }
		public static XamlType XData { get; private set; }

		/*internal*/ public static boolean IsValidXamlName (String name)
		{
			if (String.IsNullOrEmpty (name))
				return false;
			if (!IsValidXamlName (name [0], true))
				return false;
			for/*each*/ (char c : name)
				if (!IsValidXamlName (c, false))
					return false;
			return true;
		}

		static boolean IsValidXamlName (char c, boolean first)
		{
			if (c == '_')
				return true;
			switch (Character.GetUnicodeCategory (c)) {
			case UnicodeCategory.LowercaseLetter:
			case UnicodeCategory.UppercaseLetter:
			case UnicodeCategory.TitlecaseLetter:
			case UnicodeCategory.OtherLetter:
			case UnicodeCategory.LetterNumber:
				return true;
			case UnicodeCategory.NonSpacingMark:
			case UnicodeCategory.DecimalDigitNumber:
			case UnicodeCategory.SpacingCombiningMark:
			case UnicodeCategory.ModifierLetter:
				return !first;
			default:
				return false;
			}
		}
	}