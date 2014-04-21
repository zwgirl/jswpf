package org.summer.view.widget.xaml;
public class XamlXmlReaderSettings extends XamlReaderSettings
	{
		public XamlXmlReaderSettings ()
		{
		}

		public XamlXmlReaderSettings (XamlXmlReaderSettings settings)
		{
			super (settings);
			XamlXmlReaderSettings s = settings;
			if (s == null)
				return;
			CloseInput = s.CloseInput;
			SkipXmlCompatibilityProcessing = s.SkipXmlCompatibilityProcessing;
			XmlLang = s.XmlLang;
			XmlSpacePreserve = s.XmlSpacePreserve;
		}

		public boolean CloseInput { get; set; }
		public boolean SkipXmlCompatibilityProcessing { get; set; }
		public String XmlLang { get; set; }
		public boolean XmlSpacePreserve { get; set; }
	}