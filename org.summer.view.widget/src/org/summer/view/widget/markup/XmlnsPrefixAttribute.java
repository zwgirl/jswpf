package org.summer.view.widget.markup;

import org.summer.view.Attribute;

public /*sealed*/ class XmlnsPrefixAttribute extends Attribute
	{
		public XmlnsPrefixAttribute (String xmlNamespace, String prefix)
		{
			this.xmlNamespace = xmlNamespace;
			this.prefix = prefix;
		}

		public String Prefix {
			get { return prefix; }
		}

		public String XmlNamespace {
			get { return xmlNamespace; }
		}

		String prefix;
		String xmlNamespace;
	}