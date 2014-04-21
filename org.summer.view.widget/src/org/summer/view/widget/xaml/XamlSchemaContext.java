package org.summer.view.widget.xaml;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.Dictionary;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.controls.FormatException;
import org.summer.view.widget.markup.XmlnsCompatibleWithAttribute;
import org.summer.view.widget.markup.XmlnsDefinitionAttribute;
import org.summer.view.widget.markup.XmlnsPrefixAttribute;
import org.summer.view.widget.reflection.Assembly;
import org.summer.view.widget.xaml.schema.XamlTypeName;

// This type caches assembly attribute search results. To do this,
	// it registers AssemblyLoaded event on CurrentDomain when it should
	// reflect dynamic in-scope asemblies.
	// It should be released at finalizer.
	public class XamlSchemaContext
	{
		public XamlSchemaContext ()
		{
			this (null, null);
		}

		public XamlSchemaContext (IEnumerable<Assembly> referenceAssemblies)
		{
			this (referenceAssemblies, null);
		}

		public XamlSchemaContext (XamlSchemaContextSettings settings)
		{
			this (null, settings);
		}

		public XamlSchemaContext (IEnumerable<Assembly> referenceAssemblies, XamlSchemaContextSettings settings)
		{
			if (referenceAssemblies != null)
				reference_assemblies = new List<Assembly> (referenceAssemblies);
//#if !NET_2_1
			else
				AppDomain.CurrentDomain.AssemblyLoad += OnAssemblyLoaded;
//#endif

			if (settings == null)
				return;

			FullyQualifyAssemblyNamesInClrNamespaces = settings.FullyQualifyAssemblyNamesInClrNamespaces;
			SupportMarkupExtensionsWithDuplicateArity = settings.SupportMarkupExtensionsWithDuplicateArity;
		}

//#if !NET_2_1
//		~XamlSchemaContext ()
//		{
//			if (reference_assemblies == null)
//				AppDomain.CurrentDomain.AssemblyLoad -= OnAssemblyLoaded;
//		}
//#endif

		IList<Assembly> reference_assemblies;

		// assembly attribute caches
		Dictionary<String,String> xaml_nss;
		Dictionary<String,String> prefixes;
		Dictionary<String,String> compat_nss;
		Dictionary<String,List<XamlType>> all_xaml_types;
		XamlType [] empty_xaml_types = new XamlType [0];
		List<XamlType> run_time_types = new List<XamlType> ();

		public boolean FullyQualifyAssemblyNamesInClrNamespaces { get; private set; }

		public IList<Assembly> ReferenceAssemblies {
			get { return reference_assemblies; }
		}

		IEnumerable<Assembly> AssembliesInScope {
			get { return reference_assemblies ?? AppDomain.CurrentDomain.GetAssemblies (); }
		}

		public boolean SupportMarkupExtensionsWithDuplicateArity { get; private set; }

		/*internal*/public String GetXamlNamespace (String clrNamespace)
		{
			if (clrNamespace == null) // could happen on nested generic type (see bug #680385-comment#4). Not sure if null is correct though.
				return null;
			if (xaml_nss == null) // fill it first
				GetAllXamlNamespaces ();
			String ret;
			return xaml_nss.TryGetValue (clrNamespace, out ret) ? ret : null;
		}

		public /*virtual*/ IEnumerable<String> GetAllXamlNamespaces ()
		{
			if (xaml_nss == null) {
				xaml_nss = new Dictionary<String,String> ();
				for/*each*/ (Assembly ass : AssembliesInScope)
					FillXamlNamespaces (ass);
			}
			return xaml_nss.Values.Distinct ();
		}

		public /*virtual*/ ICollection<XamlType> GetAllXamlTypes (String xamlNamespace)
		{
			if (xamlNamespace == null)
				throw new ArgumentNullException ("xamlNamespace");
			if (all_xaml_types == null) {
				all_xaml_types = new Dictionary<String,List<XamlType>> ();
				for/*each*/ (Assembly ass : AssembliesInScope)
					FillAllXamlTypes (ass);
			}

			List<XamlType> l;
			if (all_xaml_types.TryGetValue (xamlNamespace, /*out*/ l))
				return l;
			else
				return empty_xaml_types;
		}

		public /*virtual*/ String GetPreferredPrefix (String xmlns)
		{
			if (xmlns == null)
				throw new ArgumentNullException ("xmlns");
			if (xmlns == XamlLanguage.Xaml2006Namespace)
				return "x";
			if (prefixes == null) {
				prefixes = new Dictionary<String,String> ();
				foreach (var ass in AssembliesInScope)
					FillPrefixes (ass);
			}
			String ret;
			return prefixes.TryGetValue (xmlns, out ret) ? ret : "p"; // default
		}

		protected /*internal*/ XamlValueConverter<TConverterBase> GetValueConverter<TConverterBase> (Type converterType, XamlType targetType)
			//where TConverterBase : class
		{
			return new XamlValueConverter<TConverterBase> (converterType, targetType);
		}

		Dictionary<Pair,XamlDirective> xaml_directives = new Dictionary<Pair,XamlDirective> ();

		public /*virtual*/ XamlDirective GetXamlDirective (String xamlNamespace, String name)
		{
			XamlDirective t;
			var p = new Pair (xamlNamespace, name);
			if (!xaml_directives.TryGetValue (p, out t)) {
				t = new XamlDirective (xamlNamespace, name);
				xaml_directives.Add (p, t);
			}
			return t;
		}

		public /*virtual*/ XamlType GetXamlType (Type type)
		{
			XamlType xt = run_time_types.FirstOrDefault (t => t.UnderlyingType == type);
			if (xt == null)
				for/*each*/ (String ns : GetAllXamlNamespaces ())
					if ((xt = GetAllXamlTypes (ns).FirstOrDefault (t => t.UnderlyingType == type)) != null)
						break;
			if (xt == null) {
				xt = new XamlType (type, this);
				run_time_types.Add (xt);
			}
			return xt;
		}

		public XamlType GetXamlType (XamlTypeName xamlTypeName)
		{
			if (xamlTypeName == null)
				throw new ArgumentNullException ("xamlTypeName");

			var n = xamlTypeName;
			if (n.TypeArguments.Count == 0) // non-generic
				return GetXamlType (n.Namespace, n.Name);

			// generic
			XamlType [] typeArgs = new XamlType [n.TypeArguments.Count];
			for (int i = 0; i < typeArgs.length; i++)
				typeArgs [i] = GetXamlType (n.TypeArguments [i]);
			return GetXamlType (n.Namespace, n.Name, typeArgs);
		}

		protected /*internal*/ /*virtual*/ XamlType GetXamlType (String xamlNamespace, String name, /*params*/ XamlType [] typeArguments)
		{
			String dummy;
			if (TryGetCompatibleXamlNamespace (xamlNamespace, /*out*/ dummy))
				xamlNamespace = dummy;

			XamlType ret;
			if (xamlNamespace == XamlLanguage.Xaml2006Namespace) {
				ret = XamlLanguage.SpecialNames.Find (name, xamlNamespace);
				if (ret == null)
					ret = XamlLanguage.AllTypes.FirstOrDefault (t => TypeMatches (t, xamlNamespace, name, typeArguments));
				if (ret != null)
					return ret;
			}
			ret = run_time_types.FirstOrDefault (t => TypeMatches (t, xamlNamespace, name, typeArguments));
			if (ret == null)
				ret = GetAllXamlTypes (xamlNamespace).FirstOrDefault (t => TypeMatches (t, xamlNamespace, name, typeArguments));

			if (reference_assemblies == null) {
				var type = ResolveXamlTypeName (xamlNamespace, name, typeArguments);
				if (type != null)
					ret = GetXamlType (type);
			}

			// If the type was not found, it just returns null.
			return ret;
		}

		boolean TypeMatches (XamlType t, String ns, String name, XamlType [] typeArgs)
		{
			if (t.PreferredXamlNamespace == ns && t.Name == name && t.TypeArguments.ListEquals (typeArgs))
				return true;
			if (t.IsMarkupExtension)
				return t.PreferredXamlNamespace == ns && t.Name.Substring (0, t.Name.length - 9) == name && t.TypeArguments.ListEquals (typeArgs);
			else
				return false;
		}

		protected /*internal*/ /*virtual*/ Assembly OnAssemblyResolve (String assemblyName)
		{
			return Assembly.LoadWithPartialName (assemblyName);
		}

		public /*virtual*/ boolean TryGetCompatibleXamlNamespace (String xamlNamespace, /*out*/ String compatibleNamespace)
		{
			if (xamlNamespace == null)
				throw new ArgumentNullException ("xamlNamespace");
			if (compat_nss == null) {
				compat_nss = new Dictionary<String,String> ();
				for/*each*/ (Assembly ass : AssembliesInScope)
					FillCompatibilities (ass);
			}
			return compat_nss.TryGetValue (xamlNamespace, /*out*/ compatibleNamespace);
		}

//#if !NET_2_1
		void OnAssemblyLoaded (Object o, AssemblyLoadEventArgs e)
		{
			if (reference_assemblies != null)
				return; // do nothing

			if (xaml_nss != null)
				FillXamlNamespaces (e.LoadedAssembly);
			if (prefixes != null)
				FillPrefixes (e.LoadedAssembly);
			if (compat_nss != null)
				FillCompatibilities (e.LoadedAssembly);
			if (all_xaml_types != null)
				FillAllXamlTypes (e.LoadedAssembly);
		}
//#endif

		// cache updater methods
		void FillXamlNamespaces (Assembly ass)
		{
			for/*each*/ (XmlnsDefinitionAttribute xda : ass.GetCustomAttributes (typeof (XmlnsDefinitionAttribute), false))
				xaml_nss.Add (xda.ClrNamespace, xda.XmlNamespace);
		}

		void FillPrefixes (Assembly ass)
		{
			for/*each*/ (XmlnsPrefixAttribute xpa : ass.GetCustomAttributes (typeof (XmlnsPrefixAttribute), false))
				prefixes.Add (xpa.XmlNamespace, xpa.Prefix);
		}

		void FillCompatibilities (Assembly ass)
		{
			for/*each*/ (XmlnsCompatibleWithAttribute xca : ass.GetCustomAttributes (typeof (XmlnsCompatibleWithAttribute), false))
				compat_nss.Add (xca.OldNamespace, xca.NewNamespace);
		}

		void FillAllXamlTypes (Assembly ass)
		{
			for/*each*/ (XmlnsDefinitionAttribute xda : ass.GetCustomAttributes (typeof (XmlnsDefinitionAttribute), false)) {
				var l = all_xaml_types.FirstOrDefault (p => p.Key == xda.XmlNamespace).Value;
				if (l == null) {
					l = new List<XamlType> ();
					all_xaml_types.Add (xda.XmlNamespace, l);
				}
				for/*each*/ (Type t : ass.GetTypes ())
					if (t.Namespace == xda.ClrNamespace)
						l.Add (GetXamlType (t));
			}
		}

		// XamlTypeName -> Type resolution

		static final int clr_ns_len = "clr-namespace:".length();
		static final int clr_ass_len = "assembly=".length();

		Type ResolveXamlTypeName (String xmlNamespace, String xmlLocalName, IList<XamlType> typeArguments)
		{
			String ns = xmlNamespace;
			String name = xmlLocalName;

			if (ns == XamlLanguage.Xaml2006Namespace) {
				XamlType xt = XamlLanguage.SpecialNames.Find (name, ns);
				if (xt == null)
					xt = XamlLanguage.AllTypes.FirstOrDefault (t => t.Name == xmlLocalName);
				if (xt == null)
					throw new FormatException (String.format ("There is no type '{0}' in XAML namespace", name));
				return xt.UnderlyingType;
			}
			else if (!ns.StartsWith ("clr-namespace:", StringComparison.Ordinal))
				return null;

			Type [] genArgs = null;
			if (typeArguments != null && typeArguments.Count > 0) {
				genArgs = (from t in typeArguments select t.UnderlyingType).ToArray ();
				if (genArgs.Any (t => t == null))
					return null;
			}

			// convert xml namespace to clr namespace and assembly
			String [] split = ns.split (';');
			if (split.length != 2 || split [0].length() < clr_ns_len || split [1].length() <= clr_ass_len)
				throw new XamlParseException (String.format ("Cannot resolve runtime namespace from XML namespace '{0}'", ns));
			String tns = split [0].substring (clr_ns_len);
			String aname = split [1].substring (clr_ass_len);

			String taqn = GetTypeName (tns, name, genArgs);
			Assembly ass = OnAssemblyResolve (aname);
			// MarkupExtension type could omit "Extension" part in XML name.
			Type ret = ass == null ? null : ass.GetType (taqn) ?? ass.GetType (GetTypeName (tns, name + "Extension", genArgs));
			if (ret == null)
				throw new XamlParseException (String.Format ("Cannot resolve runtime type from XML namespace '{0}', local name '{1}' with {2} type arguments ({3})", ns, name, typeArguments !=null ? typeArguments.Count : 0, taqn));
			return genArgs == null ? ret : ret.MakeGenericType (genArgs);
		}

		static String GetTypeName (String tns, String name, Type [] genArgs)
		{
			String tfn = tns.length() > 0 ? tns + '.' + name : name;
			if (genArgs != null)
				tfn += "`" + genArgs.length;
			return tfn;
		}
	}