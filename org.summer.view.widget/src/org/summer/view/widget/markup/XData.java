package org.summer.view.widget.markup;

import java.io.StringReader;

import org.summer.view.widget.xml.XmlReader;
//[ContentProperty ("Text")]
	public /*sealed*/ class XData
	{
		String text;
		XmlReader reader;

		public String Text {
			get { return text; }
			set {
				if (value == null) {
					text = null;
					reader = null;
				}
				else
					text = value;
			}
		}

		public Object XmlReader {
			get {
				if (reader == null)
					reader = /*System.Xml.*/XmlReader.Create (new StringReader (text));
				return reader;
			}
			set {
				// silly? yes, it's also a hack in .NET - who cares?
				reader = value as XmlReader;
				text = null;
			}
		}
	}