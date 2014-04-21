package org.summer.view.widget.markup;

import org.summer.view.Attribute;

public /*sealed*/ class XmlnsDefinitionAttribute extends Attribute
	{
		public XmlnsDefinitionAttribute (String xmlNamespace, String clrNamespace)
		{
			this.xmlNamespace = xmlNamespace;
			this.clrNamespace = clrNamespace;
		}

		public String AssemblyName {
			get { return assemblyName; }
			set { assemblyName = value; }
		}

		public String ClrNamespace {
			get { return clrNamespace; }
		}

		public String XmlNamespace {
			get { return xmlNamespace; }
		}

		String xmlNamespace;
		String clrNamespace;
		String assemblyName;
	}