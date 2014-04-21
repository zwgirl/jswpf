package org.summer.view.widget.xaml;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.collection.Dictionary;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.xaml.schema.XamlTypeName;

/*internal*/public class ParsedMarkupExtensionInfo
	{
		Dictionary<XamlMember,Object> args = new Dictionary<XamlMember,Object> ();
		public Dictionary<XamlMember,Object> Arguments {
			get { return args; }
		}

		public XamlType Type { get; set; }

		public static ParsedMarkupExtensionInfo Parse (String raw, IXamlNamespaceResolver nsResolver, XamlSchemaContext sctx)
		{
			if (raw == null)
				throw new ArgumentNullException ("raw");
			if (raw.length() == 0 || raw [0] != '{')
				throw Error ("Invalid markup extension attribute. It should begin with '{{', but was {0}", new Object[]{raw});
			ParsedMarkupExtensionInfo ret = new ParsedMarkupExtensionInfo ();
			int idx = raw.indexOf ('}');
			if (idx < 0)
				throw Error ("Expected '}}' in the markup extension attribute: '{0}'", new Object[]{raw});
			raw = raw.substring (1, idx - 1);
			idx = raw.indexOf (' ');
			String name = idx < 0 ? raw : raw.substring (0, idx);

			XamlTypeName xtn;
			if (!XamlTypeName.TryParse (name, nsResolver, /*out*/ xtn))
				throw Error ("Failed to parse type name '{0}'",new Object[]{ name});
			XamlType xt = sctx.GetXamlType (xtn);
			ret.Type = xt;

			if (idx < 0)
				return ret;

			String [] vpairs = raw.substring (idx + 1, raw.length() - idx - 1).split (',');
			List<String> posPrms = null;
			for/*each*/ (String vpair : vpairs) {
				idx = vpair.IndexOf ('=');
				// FIXME: unescape String (e.g. comma)
				if (idx < 0) {
					if (posPrms == null) {
						posPrms = new List<String> ();
						ret.Arguments.Add (XamlLanguage.PositionalParameters, posPrms);
					}
					posPrms.Add (UnescapeValue (vpair.Trim ()));
				} else {
					String key = vpair.Substring (0, idx).Trim ();
					// FIXME: is unknown member always isAttacheable = false?
					XamlMember xm = xt.GetMember (key) ?? new XamlMember (key, xt, false);
					ret.Arguments.Add (xm, UnescapeValue (vpair.Substring (idx + 1).Trim ()));
				}
			}
			return ret;
		}

		static String UnescapeValue (String s)
		{
			// change XamlXmlWriter too if we change here.
			if (s == "\"\"") // FIXME: there could be some escape syntax.
				return String.Empty;
			else
				return s;
		}

		static Exception Error (String format, /*params*/ Object [] args)
		{
			return new XamlParseException (String.format (format, args));
		}
	}