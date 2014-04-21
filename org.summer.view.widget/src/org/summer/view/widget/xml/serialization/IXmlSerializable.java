package org.summer.view.widget.xml.serialization;

import javax.sql.rowset.spi.XmlWriter;
import javax.xml.bind.annotation.XmlSchema;

import org.summer.view.widget.xml.XmlReader;

public interface IXmlSerializable {

		XmlSchema GetSchema ();
		void ReadXml (XmlReader reader);
		void WriteXml (XmlWriter writer);
	}