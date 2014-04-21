package org.summer.view.widget.xaml.schema;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.controls.FormatException;
import org.summer.view.widget.xaml.INamespacePrefixLookup;
import org.summer.view.widget.xaml.IXamlNamespaceResolver;
import org.summer.view.widget.xaml.XamlLanguage;
import org.summer.view.widget.xaml.XamlType;

public class XamlTypeName
	{
		public static XamlTypeName Parse (String typeName, IXamlNamespaceResolver namespaceResolver)
		{
			XamlTypeName n;
			if (!TryParse (typeName, namespaceResolver, /*out*/ n))
				throw new FormatException (String.format ("Invalid typeName: '{0}'", typeName));
			return n;
		}

		public static boolean TryParse (String typeName, IXamlNamespaceResolver namespaceResolver, /*out*/ XamlTypeName result)
		{
			if (typeName == null)
				throw new ArgumentNullException ("typeName");
			if (namespaceResolver == null)
				throw new ArgumentNullException ("namespaceResolver");

			result = null;
			IList<XamlTypeName> args = null;
			int nArray = 0;
			int idx;

			if (typeName.length() > 2 && typeName [typeName.Length - 1] == ']') {
				idx = typeName.lastIndexOf ('[');
				if (idx < 0)
					return false; // mismatch brace
				nArray = 1;
				for (int i = idx + 1; i < typeName.length() - 1; i++) {
					if (typeName [i] != ',')
						return false; // only ',' is expected
					nArray++;
				}
				if (!TryParse (typeName.substring (0, idx), namespaceResolver, /*out*/ result))
					return false;
				// Weird result, but Name ends with '[]'
				result = new XamlTypeName (result.Namespace, result.Name + '[' + new String (',', nArray - 1) + ']', result.TypeArguments);
				return true;
			}

			idx = typeName.indexOf ('(');
			if (idx >= 0) {
				if (typeName [typeName.Length - 1] != ')')
					return false;
				if (!TryParseList (typeName.substring (idx + 1, typeName.length() - idx - 2), namespaceResolver, /*out*/ args))
					return false;
				typeName = typeName.substring (0, idx);
			}

			idx = typeName.indexOf (':');
			String prefix, local;
			if (idx < 0) {
				prefix = String.Empty;
				local = typeName;
			} else {
				prefix = typeName.substring (0, idx);
				local = typeName.substring (idx + 1);
				if (!XamlLanguage.IsValidXamlName (prefix))
					return false;
			}
			if (!XamlLanguage.IsValidXamlName (local))
				return false;
			String ns = namespaceResolver.GetNamespace (prefix);
			if (ns == null)
				return false;

			result = new XamlTypeName (ns, local, args);
			return true;
		}

		public static IList<XamlTypeName> ParseList (String typeNameList, IXamlNamespaceResolver namespaceResolver)
		{
			IList<XamlTypeName> list;
			if (!TryParseList (typeNameList, namespaceResolver, /*out*/ list))
				throw new FormatException (String.format ("Invalid type name list: '{0}'", typeNameList));
			return list;
		}

		static final char [] comma_or_parens = new char [] {',', '(', ')'};

		public static boolean TryParseList (String typeNameList, IXamlNamespaceResolver namespaceResolver, /*out*/ IList<XamlTypeName> list)
		{
			if (typeNameList == null)
				throw new ArgumentNullException ("typeNameList");
			if (namespaceResolver == null)
				throw new ArgumentNullException ("namespaceResolver");

			list = null;
			int idx = 0;
			int parens = 0;
			XamlTypeName tn;

			List<String> l = new List<String> ();
			int lastToken = 0;
			while (true) {
				int i = typeNameList.IndexOfAny (comma_or_parens, idx);
				if (i < 0) {
					l.Add (typeNameList.substring (lastToken));
					break;
				}

				switch (typeNameList [i]) {
				case ',':
					if (parens != 0)
						break;
					l.Add (typeNameList.substring (idx, i - idx));
					break;
				case '(':
					parens++;
					break;
				case ')':
					parens--;
					break;
				}
				idx = i + 1;
				while (idx < typeNameList.length() && typeNameList [idx] == ' ')
					idx++;
				if (parens == 0 && typeNameList [i] == ',')
					lastToken = idx;
			}

			List<XamlTypeName> ret = new List<XamlTypeName> ();
		 	for/*each*/ (String s : l) {
				if (!TryParse (s, namespaceResolver, /*out*/ tn))
					return false;
				ret.Add (tn);
			}

			list = ret;
			return true;
		}

		public static String ToString (IList<XamlTypeName> typeNameList, INamespacePrefixLookup prefixLookup)
		{
			if (typeNameList == null)
				throw new ArgumentNullException ("typeNameList");
			if (prefixLookup == null)
				throw new ArgumentNullException ("prefixLookup");

			return DoToString (typeNameList, prefixLookup);
		}

		static String DoToString (IList<XamlTypeName> typeNameList, INamespacePrefixLookup prefixLookup)
		{
			boolean comma = false;
			String ret = "";
			for/*each*/ (XamlTypeName ta : typeNameList) {
				if (comma)
					ret += ", ";
				else
					comma = true;
				ret += ta.ToString (prefixLookup);
			}
			return ret;
		}

		// instance members

		public XamlTypeName ()
		{
			TypeArguments = empty_type_args;
		}

		static final XamlTypeName [] empty_type_args = new XamlTypeName [0];

		public XamlTypeName (XamlType xamlType)
		{
			super();
			
			if (xamlType == null)
				throw new ArgumentNullException ("xamlType");
			Namespace = xamlType.PreferredXamlNamespace;
			Name = xamlType.Name;
			if (xamlType.TypeArguments != null && xamlType.TypeArguments.Count > 0) {
				List<XamlTypeName> l = new List<XamlTypeName> ();
				l.AddRange (from x in xamlType.TypeArguments.AsQueryable () select new XamlTypeName (x));
				TypeArguments = l;
			}
		}

		public XamlTypeName (String xamlNamespace, String name)
		{
			this (xamlNamespace, name, null);
		}

		public XamlTypeName (String xamlNamespace, String name, IEnumerable<XamlTypeName> typeArguments)
		{
			super();
			
			Namespace = xamlNamespace;
			Name = name;
			if (typeArguments != null) {
				if (typeArguments.Any (t => t == null))
					throw new ArgumentNullException ("typeArguments", "typeArguments array contains one or more null XamlTypeName");
				List<XamlTypeName> l = new List<XamlTypeName> ();
				l.AddRange (typeArguments);
				TypeArguments = l;
			}
		}

		public String Name { get; set; }
		public String Namespace { get; set; }
		public IList<XamlTypeName> TypeArguments { get; private set; }

		public /*override*/ String ToString ()
		{
			return ToString (null);
		}

		public String ToString (INamespacePrefixLookup prefixLookup)
		{
			if (Namespace == null)
				throw new InvalidOperationException ("Namespace must be set before calling ToString method.");
			if (Name == null)
				throw new InvalidOperationException ("Name must be set before calling ToString method.");

			String ret;
			if (prefixLookup == null)
				ret = String.Concat ("{", Namespace, "}", Name);
			else {
				String p = prefixLookup.LookupPrefix (Namespace);
				if (p == null)
					throw new InvalidOperationException (String.format ("Could not lookup prefix for namespace '{0}'", Namespace));
				ret = p.length() == 0 ? Name : p + ":" + Name;
			}
			String arr = null;
			if (ret [ret.length() - 1] == ']') {
				int idx = ret.lastIndexOf ('[');
				arr = ret.substring (idx);
				ret = ret.substring (0, idx);
			}

			if (TypeArguments.Count > 0)
				ret += String.Concat ("(", DoToString (TypeArguments, prefixLookup), ")");

			return ret + arr;
		}
	}