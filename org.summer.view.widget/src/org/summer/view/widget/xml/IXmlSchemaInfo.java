package org.summer.view.widget.xml;

import javax.xml.bind.annotation.XmlSchemaType;

import org.summer.view.widget.xml.schema.XmlSchemaSimpleType;

public interface IXmlSchemaInfo
{
	boolean IsDefault { get; }

	boolean IsNil { get; }

	XmlSchemaSimpleType MemberType { get; }

	XmlSchemaAttribute SchemaAttribute { get; }

	XmlSchemaElement SchemaElement { get; }

	XmlSchemaType SchemaType { get; }

	XmlSchemaValidity Validity { get; }
}