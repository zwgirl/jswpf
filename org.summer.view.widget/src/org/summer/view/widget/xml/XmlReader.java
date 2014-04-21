package org.summer.view.widget.xml;

import java.io.File;
import java.io.StringWriter;
import java.nio.file.Path;
import java.sql.Ref;
import java.util.stream.Stream;

import javax.sql.rowset.spi.XmlWriter;

import org.eclipse.osgi.framework.debug.Debug;
import org.omg.IOP.Encoding;
import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.IDisposable;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.Type;
import org.summer.view.widget.controls.FormatException;
import org.summer.view.widget.utils.ArgumentOutOfRangeException;

// Represents a reader that provides fast, non-cached forward only stream access to XML data.
//#if !SILVERLIGHT // This is used for displaying the state of the XmlReader in Watch/Locals windows in the Visual Studio during debugging 
//    [DebuggerDisplay("{debuggerDisplayProxy}")]
//#endif
public abstract /*partial*/ class XmlReader implements IDisposable {
	 
    static private int IsTextualNodeBitmap = 0x6018; // 00 0110 0000 0001 1000
    // 0 None, 
    // 0 Element, 
    // 0 Attribute,
    // 1 Text, 
    // 1 CDATA,
    // 0 EntityReference,
    // 0 Entity,
    // 0 ProcessingInstruction, 
    // 0 Comment,
    // 0 Document, 
    // 0 DocumentType, 
    // 0 DocumentFragment,
    // 0 Notation, 
    // 1 Whitespace,
    // 1 SignificantWhitespace,
    // 0 EndElement,
    // 0 EndEntity, 
    // 0 XmlDeclaration

    static private int CanReadContentAsBitmap = 0x1E1BC; // 01 1110 0001 1011 1100 
    // 0 None,
    // 0 Element, 
    // 1 Attribute,
    // 1 Text,
    // 1 CDATA,
    // 1 EntityReference, 
    // 0 Entity,
    // 1 ProcessingInstruction, 
    // 1 Comment, 
    // 0 Document,
    // 0 DocumentType, 
    // 0 DocumentFragment,
    // 0 Notation,
    // 1 Whitespace,
    // 1 SignificantWhitespace, 
    // 1 EndElement,
    // 1 EndEntity, 
    // 0 XmlDeclaration 

    static private int HasValueBitmap = 0x2659C; // 10 0110 0101 1001 1100 
    // 0 None,
    // 0 Element,
    // 1 Attribute,
    // 1 Text, 
    // 1 CDATA,
    // 0 EntityReference, 
    // 0 Entity, 
    // 1 ProcessingInstruction,
    // 1 Comment, 
    // 0 Document,
    // 1 DocumentType,
    // 0 DocumentFragment,
    // 0 Notation, 
    // 1 Whitespace,
    // 1 SignificantWhitespace, 
    // 0 EndElement, 
    // 0 EndEntity,
    // 1 XmlDeclaration 

    //
    // Constants
    // 
    /*internal*/ public /*const*/ static final int DefaultBufferSize = 4096;
    /*internal*/ public /*const*/ static final int BiggerBufferSize = 8192; 
    /*internal*/ public /*const*/ static final int MaxStreamLengthForDefaultBufferSize = 64 * 1024; // 64kB 

    /*internal*/ public /*const*/ static final int AsyncBufferSize = 64 * 1024; //64KB 

    // Settings
    public /*virtual*/ XmlReaderSettings Settings {
        get { 
            return null;
        } 
    } 

    // Node Properties 
    // Get the type of the current node.
    public abstract XmlNodeType NodeType { get; }

    // Gets the name of the current node, including the namespace prefix. 
    public /*virtual*/ String Name {
        get { 
            if (Prefix.Length == 0) { 
                return LocalName;
            } 
            else {
                return NameTable.Add(String.Concat(Prefix, ":", LocalName));
            }
        } 
    }

    // Gets the name of the current node without the namespace prefix. 
    public abstract String LocalName { get; }

    // Gets the namespace URN (as defined in the W3C Namespace Specification) of the current namespace scope.
    public abstract String NamespaceURI { get; }

    // Gets the namespace prefix associated with the current node. 
    public abstract String Prefix { get; }

    // Gets a value indicating whether 
    public /*virtual*/ boolean HasValue {
        get { 
            return HasValueInternal(this.NodeType);
        }
    }

    // Gets the text value of the current node.
    public abstract String Value { get; } 

    // Gets the depth of the current node in the XML element stack.
    public abstract int Depth { get; } 

    // Gets the base URI of the current node.
    public abstract String BaseURI { get; }

    // Gets a value indicating whether the current node is an empty element (for example, <MyElement/>).
    public abstract boolean IsEmptyElement { get; } 

    // Gets a value indicating whether the current node is an attribute that was generated from the default value defined
    // in the DTD or schema. 
    public /*virtual*/ boolean IsDefault {
        get {
            return false;
        } 
    }

//#if !SILVERLIGHT 
    // Gets the quotation mark character used to enclose the value of an attribute node.
    public /*virtual*/ char QuoteChar { 
        get {
            return '"';
        }
    } 
//#endif

    // Gets the current xml:space scope. 
    public /*virtual*/ XmlSpace XmlSpace {
        get { 
            return XmlSpace.None;
        }
    }

    // Gets the current xml:lang scope.
    public /*virtual*/ String XmlLang { 
        get { 
            return String.Empty;
        } 
    }

//#if !SILVERLIGHT // Removing dependency on XmlSchema
    // returns the schema info interface of the reader 
    public /*virtual*/ IXmlSchemaInfo SchemaInfo {
        get { 
            return this as IXmlSchemaInfo; 
        }
    } 
//#endif

    // returns the type of the current node
    public /*virtual*/ Type ValueType { 
        get {
            return typeof(String); 
        } 
    }

    // Concatenates values of textual nodes of the current content, ignoring comments and PIs, expanding entity references,
    // and returns the content as the most appropriate type (by default as String). Stops at start tags and end tags.
    public /*virtual*/  Object  ReadContentAsObject() {
        if (!CanReadContentAs()) { 
            throw CreateReadContentAsException("ReadContentAsObject");
        } 
        return InternalReadContentAsString(); 
    }

    // Concatenates values of textual nodes of the current content, ignoring comments and PIs, expanding entity references,
    // and converts the content to a boolean. Stops at start tags and end tags.
    public /*virtual*/  boolean  ReadContentAsBoolean() {
        if (!CanReadContentAs()) { 
            throw CreateReadContentAsException("ReadContentAsBoolean");
        } 
        try { 
            return XmlConvert.ToBoolean(InternalReadContentAsString());
        } 
        catch (FormatException e) {
            throw new XmlException(Res.Xml_ReadContentAsFormatException, "Boolean", e, this as IXmlLineInfo);
        }
    } 

    // Concatenates values of textual nodes of the current content, ignoring comments and PIs, expanding entity references, 
    // and converts the content to a DateTime. Stops at start tags and end tags. 
    public /*virtual*/  DateTime  ReadContentAsDateTime() {
        if (!CanReadContentAs()) { 
            throw CreateReadContentAsException("ReadContentAsDateTime");
        }
        try {
            return XmlConvert.ToDateTime(InternalReadContentAsString(), XmlDateTimeSerializationMode.RoundtripKind); 
        }
        catch (FormatException e) { 
            throw new XmlException(Res.Xml_ReadContentAsFormatException, "DateTime", e, this as IXmlLineInfo); 
        }
    } 

    // Concatenates values of textual nodes of the current content, ignoring comments and PIs, expanding entity references,
    // and converts the content to a DateTimeOffset. Stops at start tags and end tags.
    public /*virtual*/ DateTimeOffset ReadContentAsDateTimeOffset() { 
        if (!CanReadContentAs()) {
            throw CreateReadContentAsException("ReadContentAsDateTimeOffset"); 
        } 
        try {
            return XmlConvert.ToDateTimeOffset(InternalReadContentAsString()); 
        }
        catch (FormatException e) {
            throw new XmlException(Res.Xml_ReadContentAsFormatException, "DateTimeOffset", e, this as IXmlLineInfo);
        } 
    }

    // Concatenates values of textual nodes of the current content, ignoring comments and PIs, expanding entity references, 
    // and converts the content to a double. Stops at start tags and end tags.
    public /*virtual*/  double  ReadContentAsDouble() { 
        if (!CanReadContentAs()) {
            throw CreateReadContentAsException("ReadContentAsDouble");
        }
        try { 
            return XmlConvert.ToDouble(InternalReadContentAsString());
        } 
        catch (FormatException e) { 
            throw new XmlException(Res.Xml_ReadContentAsFormatException, "Double", e, this as IXmlLineInfo);
        } 
    }

    // Concatenates values of textual nodes of the current content, ignoring comments and PIs, expanding entity references,
    // and converts the content to a float. Stops at start tags and end tags. 
    public /*virtual*/  float  ReadContentAsFloat() {
        if (!CanReadContentAs()) { 
            throw CreateReadContentAsException("ReadContentAsFloat"); 
        }
        try { 
            return XmlConvert.ToSingle(InternalReadContentAsString());
        }
        catch (FormatException e) {
            throw new XmlException(Res.Xml_ReadContentAsFormatException, "Float", e, this as IXmlLineInfo); 
        }
    } 

    // Concatenates values of textual nodes of the current content, ignoring comments and PIs, expanding entity references,
    // and converts the content to a decimal. Stops at start tags and end tags. 
    public /*virtual*/  float  ReadContentAsDecimal() {
        if (!CanReadContentAs()) {
            throw CreateReadContentAsException("ReadContentAsDecimal");
        } 
        try {
            return XmlConvert.ToDecimal(InternalReadContentAsString()); 
        } 
        catch (FormatException e) {
            throw new XmlException(Res.Xml_ReadContentAsFormatException, "Decimal", e, this as IXmlLineInfo); 
        }
    }

    // Concatenates values of textual nodes of the current content, ignoring comments and PIs, expanding entity references, 
    // and converts the content to an int. Stops at start tags and end tags.
    public /*virtual*/  int  ReadContentAsInt() { 
        if (!CanReadContentAs()) { 
            throw CreateReadContentAsException("ReadContentAsInt");
        } 
        try {
            return XmlConvert.ToInt32(InternalReadContentAsString());
        }
        catch (FormatException e) { 
            throw new XmlException(Res.Xml_ReadContentAsFormatException, "Int", e, this as IXmlLineInfo);
        } 
    } 

    // Concatenates values of textual nodes of the current content, ignoring comments and PIs, expanding entity references, 
    // and converts the content to a long. Stops at start tags and end tags.
    public /*virtual*/  long  ReadContentAsLong() {
        if (!CanReadContentAs()) {
            throw CreateReadContentAsException("ReadContentAsLong"); 
        }
        try { 
            return XmlConvert.ToInt64(InternalReadContentAsString()); 
        }
        catch (FormatException e) { 
            throw new XmlException(Res.Xml_ReadContentAsFormatException, "Long", e, this as IXmlLineInfo);
        }
    }

    // Concatenates values of textual nodes of the current content, ignoring comments and PIs, expanding entity references,
    // and returns the content as a String. Stops at start tags and end tags. 
    public /*virtual*/  String  ReadContentAsString() { 
        if (!CanReadContentAs()) {
            throw CreateReadContentAsException("ReadContentAsString"); 
        }
        return InternalReadContentAsString();
    }

    // Concatenates values of textual nodes of the current content, ignoring comments and PIs, expanding entity references,
    // and converts the content to the requested type. Stops at start tags and end tags. 
    public /*virtual*/  Object  ReadContentAs(Type returnType, IXmlNamespaceResolver namespaceResolver) { 
        if (!CanReadContentAs()) {
            throw CreateReadContentAsException("ReadContentAs"); 
        }

        String strContentValue = InternalReadContentAsString();
        if (returnType == typeof(String)) { 
            return strContentValue;
        } 
        else { 
            try {
//#if SILVERLIGHT 
//                return XmlUntypedStringConverter.Instance.FromString(strContentValue, returnType, (namespaceResolver == null ? this as IXmlNamespaceResolver : namespaceResolver));
//#else
                return XmlUntypedConverter.Untyped.ChangeType(strContentValue, returnType, (namespaceResolver == null ? this as IXmlNamespaceResolver : namespaceResolver));
//#endif 
            }
            catch (FormatException e) { 
                throw new XmlException(Res.Xml_ReadContentAsFormatException, returnType.ToString(), e, this as IXmlLineInfo); 
            }
            catch (InvalidCastException e) { 
                throw new XmlException(Res.Xml_ReadContentAsFormatException, returnType.ToString(), e, this as IXmlLineInfo);
            }
        }
    } 

    // Returns the content of the current element as the most appropriate type. Moves to the node following the element's end tag. 
    public /*virtual*/  Object  ReadElementContentAsObject() { 
        if (SetupReadElementContentAsXxx("ReadElementContentAsObject")) {
            Object value = ReadContentAsObject(); 
            FinishReadElementContentAsXxx();
            return value;
        }
        return String.Empty; 
    }

    // Checks local name and namespace of the current element and returns its content as the most appropriate type. Moves to the node following the element's end tag. 
    public /*virtual*/  Object  ReadElementContentAsObject(String localName, String namespaceURI) {
        CheckElement(localName, namespaceURI); 
        return ReadElementContentAsObject();
    }

    // Returns the content of the current element as a boolean. Moves to the node following the element's end tag. 
    public /*virtual*/  boolean  ReadElementContentAsBoolean() {
        if (SetupReadElementContentAsXxx("ReadElementContentAsBoolean")) { 
            boolean value = ReadContentAsBoolean(); 
            FinishReadElementContentAsXxx();
            return value; 
        }
        return XmlConvert.ToBoolean(String.Empty);
    }

    // Checks local name and namespace of the current element and returns its content as a boolean. Moves to the node following the element's end tag.
    public /*virtual*/  boolean  ReadElementContentAsBoolean(String localName, String namespaceURI) { 
        CheckElement(localName, namespaceURI); 
        return ReadElementContentAsBoolean();
    } 

    // Returns the content of the current element as a DateTime. Moves to the node following the element's end tag.
    public /*virtual*/  DateTime  ReadElementContentAsDateTime() {
        if (SetupReadElementContentAsXxx("ReadElementContentAsDateTime")) { 
            DateTime value = ReadContentAsDateTime();
            FinishReadElementContentAsXxx(); 
            return value; 
        }
        return XmlConvert.ToDateTime(String.Empty, XmlDateTimeSerializationMode.RoundtripKind); 
    }

    // Checks local name and namespace of the current element and returns its content as a DateTime.
    // Moves to the node following the element's end tag. 
    public /*virtual*/  DateTime  ReadElementContentAsDateTime(String localName, String namespaceURI) {
        CheckElement(localName, namespaceURI); 
        return ReadElementContentAsDateTime(); 
    }

    // Returns the content of the current element as a double. Moves to the node following the element's end tag.
    public /*virtual*/  double  ReadElementContentAsDouble() {
        if (SetupReadElementContentAsXxx("ReadElementContentAsDouble")) {
            double value = ReadContentAsDouble(); 
            FinishReadElementContentAsXxx();
            return value; 
        } 
        return XmlConvert.ToDouble(String.Empty);
    } 

    // Checks local name and namespace of the current element and returns its content as a double.
    // Moves to the node following the element's end tag.
    public /*virtual*/  double  ReadElementContentAsDouble(String localName, String namespaceURI) { 
        CheckElement(localName, namespaceURI);
        return ReadElementContentAsDouble(); 
    } 

    // Returns the content of the current element as a float. Moves to the node following the element's end tag. 
    public /*virtual*/  float  ReadElementContentAsFloat() {
        if (SetupReadElementContentAsXxx("ReadElementContentAsFloat")) {
            float value = ReadContentAsFloat();
            FinishReadElementContentAsXxx(); 
            return value;
        } 
        return XmlConvert.ToSingle(String.Empty); 
    }

    // Checks local name and namespace of the current element and returns its content as a float.
    // Moves to the node following the element's end tag.
    public /*virtual*/  float  ReadElementContentAsFloat(String localName, String namespaceURI) {
        CheckElement(localName, namespaceURI); 
        return ReadElementContentAsFloat();
    } 

    // Returns the content of the current element as a decimal. Moves to the node following the element's end tag.
    public /*virtual*/  decimal  ReadElementContentAsDecimal() { 
        if (SetupReadElementContentAsXxx("ReadElementContentAsDecimal")) {
            decimal value = ReadContentAsDecimal();
            FinishReadElementContentAsXxx();
            return value; 
        }
        return XmlConvert.ToDecimal(String.Empty); 
    } 

    // Checks local name and namespace of the current element and returns its content as a decimal. 
    // Moves to the node following the element's end tag.
    public /*virtual*/  decimal  ReadElementContentAsDecimal(String localName, String namespaceURI) {
        CheckElement(localName, namespaceURI);
        return ReadElementContentAsDecimal(); 
    }

    // Returns the content of the current element as an int. Moves to the node following the element's end tag. 
    public /*virtual*/  int  ReadElementContentAsInt() {
        if (SetupReadElementContentAsXxx("ReadElementContentAsInt")) { 
            int value = ReadContentAsInt();
            FinishReadElementContentAsXxx();
            return value;
        } 
        return XmlConvert.ToInt32(String.Empty);
    } 

    // Checks local name and namespace of the current element and returns its content as an int.
    // Moves to the node following the element's end tag. 
    public /*virtual*/  int  ReadElementContentAsInt(String localName, String namespaceURI) {
        CheckElement(localName, namespaceURI);
        return ReadElementContentAsInt();
    } 

    // Returns the content of the current element as a long. Moves to the node following the element's end tag. 
    public /*virtual*/  long  ReadElementContentAsLong() { 
        if (SetupReadElementContentAsXxx("ReadElementContentAsLong")) {
            long value = ReadContentAsLong(); 
            FinishReadElementContentAsXxx();
            return value;
        }
        return XmlConvert.ToInt64(String.Empty); 
    }

    // Checks local name and namespace of the current element and returns its content as a long. 
    // Moves to the node following the element's end tag.
    public /*virtual*/  long  ReadElementContentAsLong(String localName, String namespaceURI) { 
        CheckElement(localName, namespaceURI);
        return ReadElementContentAsLong();
    }

    // Returns the content of the current element as a String. Moves to the node following the element's end tag.
    public /*virtual*/  String  ReadElementContentAsString() { 
        if (SetupReadElementContentAsXxx("ReadElementContentAsString")) { 
            String value = ReadContentAsString();
            FinishReadElementContentAsXxx(); 
            return value;
        }
        return String.Empty;
    } 

    // Checks local name and namespace of the current element and returns its content as a String. 
    // Moves to the node following the element's end tag. 
    public /*virtual*/  String  ReadElementContentAsString(String localName, String namespaceURI) {
        CheckElement(localName, namespaceURI); 
        return ReadElementContentAsString();
    }

    // Returns the content of the current element as the requested type. Moves to the node following the element's end tag. 
    public /*virtual*/  Object  ReadElementContentAs(Type returnType, IXmlNamespaceResolver namespaceResolver) {
        if (SetupReadElementContentAsXxx("ReadElementContentAs")) { 
            Object value = ReadContentAs(returnType, namespaceResolver); 
            FinishReadElementContentAsXxx();
            return value; 
        }
//#if SILVERLIGHT
//        return (returnType == typeof(String)) ? String.Empty : XmlUntypedStringConverter.Instance.FromString(String.Empty, returnType, namespaceResolver);
//#else 
        return (returnType == typeof(String)) ? String.Empty : XmlUntypedConverter.Untyped.ChangeType(String.Empty, returnType, namespaceResolver);
//#endif 
    } 

    // Checks local name and namespace of the current element and returns its content as the requested type. 
    // Moves to the node following the element's end tag.
    public /*virtual*/  Object  ReadElementContentAs(Type returnType, IXmlNamespaceResolver namespaceResolver, String localName, String namespaceURI) {
        CheckElement(localName, namespaceURI);
        return ReadElementContentAs(returnType, namespaceResolver); 
    }

    // Attribute Accessors 
    // The number of attributes on the current node.
    public abstract int AttributeCount { get; } 

    // Gets the value of the attribute with the specified Name
    public abstract String GetAttribute(String name);

    // Gets the value of the attribute with the LocalName and NamespaceURI
    public abstract String GetAttribute(String name, String namespaceURI); 

    // Gets the value of the attribute with the specified index.
    public abstract String GetAttribute(int i); 

    // Gets the value of the attribute with the specified index.
    public /*virtual*/ String this[int i] {
        get { 
            return GetAttribute(i);
        } 
    } 

    // Gets the value of the attribute with the specified Name. 
    public /*virtual*/ String this[String name] {
        get {
            return GetAttribute(name);
        } 
    }

    // Gets the value of the attribute with the LocalName and NamespaceURI 
    public /*virtual*/ String this[String name, String namespaceURI] {
        get { 
            return GetAttribute(name, namespaceURI);
        }
    }

    // Moves to the attribute with the specified Name.
    public abstract boolean MoveToAttribute(String name); 

    // Moves to the attribute with the specified LocalName and NamespaceURI.
    public abstract boolean MoveToAttribute(String name, String ns); 

    // Moves to the attribute with the specified index.
    public /*virtual*/ void MoveToAttribute(int i) {
        if (i < 0 || i >= AttributeCount) { 
            throw new ArgumentOutOfRangeException("i");
        } 
        MoveToElement(); 
        MoveToFirstAttribute();
        int j = 0; 
        while (j < i) {
            MoveToNextAttribute();
            j++;
        } 
    }

    // Moves to the first attribute of the current node. 
    public abstract boolean MoveToFirstAttribute();

    // Moves to the next attribute.
    public abstract boolean MoveToNextAttribute();

    // Moves to the element that contains the current attribute node. 
    public abstract boolean MoveToElement();

    // Parses the attribute value into one or more Text and/or EntityReference node types. 

    public abstract  boolean  ReadAttributeValue(); 

    // Moving through the Stream
    // Reads the next node from the stream.

    public abstract  boolean  Read();

    // Returns true when the XmlReader is positioned at the end of the stream. 
    public abstract boolean EOF { get; }

    // Closes the stream/TextReader (if CloseInput==true), changes the ReadState to Closed, and sets all the properties back to zero/empty String.
    public /*virtual*/ void Close() { }

    // Returns the read state of the XmlReader. 
    public abstract ReadState ReadState { get; }

    // Skips to the end tag of the current element. 
    public /*virtual*/ void Skip() {
        if (ReadState != ReadState.Interactive) { 

            return;

        } 
        SkipSubtree();
    } 

    // Gets the XmlNameTable associated with the XmlReader.
    public abstract XmlNameTable NameTable { get; } 

    // Resolves a namespace prefix in the current element's scope.
    public abstract String LookupNamespace(String prefix);

    // Returns true if the XmlReader can expand general entities.
    public /*virtual*/ boolean CanResolveEntity { 
        get { 
            return false;
        } 
    }

    // Resolves the entity reference for nodes of NodeType EntityReference.
    public abstract void ResolveEntity(); 

    // Binary content access methods 
    // Returns true if the reader supports call to ReadContentAsBase64, ReadElementContentAsBase64, ReadContentAsBinHex and ReadElementContentAsBinHex. 
    public /*virtual*/ boolean CanReadBinaryContent {
        get { 
            return false;
        }
    }

    // Returns decoded bytes of the current base64 text content. Call this methods until it returns 0 to get all the data.
    public /*virtual*/  int  ReadContentAsBase64(byte[] buffer, int index, int count) { 
        throw new NotSupportedException(/*Res.GetString(Res.Xml_ReadBinaryContentNotSupported, "ReadContentAsBase64")*/); 
    }

    // Returns decoded bytes of the current base64 element content. Call this methods until it returns 0 to get all the data.
    public /*virtual*/  int  ReadElementContentAsBase64(byte[] buffer, int index, int count) {
        throw new NotSupportedException(/*Res.GetString(Res.Xml_ReadBinaryContentNotSupported, "ReadElementContentAsBase64")*/);
    } 

    // Returns decoded bytes of the current binhex text content. Call this methods until it returns 0 to get all the data. 
    public /*virtual*/  int  ReadContentAsBinHex(byte[] buffer, int index, int count) { 
        throw new NotSupportedException(/*Res.GetString(Res.Xml_ReadBinaryContentNotSupported, "ReadContentAsBinHex")*/);
    } 

    // Returns decoded bytes of the current binhex element content. Call this methods until it returns 0 to get all the data.
    public /*virtual*/  int  ReadElementContentAsBinHex(byte[] buffer, int index, int count) {
        throw new NotSupportedException(/*Res.GetString(Res.Xml_ReadBinaryContentNotSupported, "ReadElementContentAsBinHex")*/); 
    }

    // Text streaming methods 

    // Returns true if the XmlReader supports calls to ReadValueChunk. 
    public /*virtual*/ boolean CanReadValueChunk {
        get {
            return false;
        } 
    }

    // Returns a chunk of the value of the current node. Call this method in a loop to get all the data. 
    // Use this method to get a streaming access to the value of the current node.
    public /*virtual*/  int  ReadValueChunk(char[] buffer, int index, int count) { 
        throw new NotSupportedException(/*Res.GetString(Res.Xml_ReadValueChunkNotSupported)*/);
    }

//#if !SILVERLIGHT 
    // Virtual helper methods
    // Reads the contents of an element as a String. Stops of comments, PIs or entity references. 
//    [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)] 
    public /*virtual*/  String  ReadString() {
        if (this.ReadState != ReadState.Interactive) { 
            return String.Empty;
        }
        this.MoveToElement();
        if (this.NodeType == XmlNodeType.Element) { 
            if (this.IsEmptyElement) {
                return String.Empty; 
            } 
            else if (!this.Read()) {
                throw new InvalidOperationException(Res.GetString(Res.Xml_InvalidOperation)); 
            }
            if (this.NodeType == XmlNodeType.EndElement) {
                return String.Empty;
            } 
        }
        String result = String.Empty; 
        while (IsTextualNode(this.NodeType)) { 
            result += this.Value;
            if (!this.Read()) { 
                break;
            }
        }
        return result; 
    }
//#endif 

    // Checks whether the current node is a content (non-whitespace text, CDATA, Element, EndElement, EntityReference
    // or EndEntity) node. If the node is not a content node, then the method skips ahead to the next content node or 
    // end of file. Skips over nodes of type ProcessingInstruction, DocumentType, Comment, Whitespace and SignificantWhitespace.
    public /*virtual*/  XmlNodeType  MoveToContent() {
        do {
            switch (this.NodeType) { 
                case /*XmlNodeType.*/Attribute:
                    MoveToElement(); 
//                    goto case /*XmlNodeType.*/Element; //cym comment
                case /*XmlNodeType.*/Element:
                case /*XmlNodeType.*/EndElement: 
                case /*XmlNodeType.*/CDATA:
                case /*XmlNodeType.*/Text:
                case /*XmlNodeType.*/EntityReference:
                case /*XmlNodeType.*/EndEntity: 
                    return this.NodeType;
            } 
        } while (Read()); 
        return this.NodeType;
    } 

    // Checks that the current node is an element and advances the reader to the next node.
    public /*virtual*/ void ReadStartElement() {
        if (MoveToContent() != XmlNodeType.Element) { 
            throw new XmlException(/*Res.Xml_InvalidNodeType, this.NodeType.ToString(), this as IXmlLineInfo*/);
        } 
        Read(); 
    }

    // Checks that the current content node is an element with the given Name and advances the reader to the next node.
    public /*virtual*/ void ReadStartElement(String name) {
        if (MoveToContent() != XmlNodeType.Element) {
            throw new XmlException(/*Res.Xml_InvalidNodeType, this.NodeType.ToString(), this as IXmlLineInfo*/); 
        }
        if (this.Name == name) { 
            Read(); 
        }
        else { 
            throw new XmlException(/*Res.Xml_ElementNotFound, name, this as IXmlLineInfo*/);
        }
    }

    // Checks that the current content node is an element with the given LocalName and NamespaceURI
    // and advances the reader to the next node. 
    public /*virtual*/ void ReadStartElement(String localname, String ns) { 
        if (MoveToContent() != XmlNodeType.Element) {
            throw new XmlException(/*Res.Xml_InvalidNodeType, this.NodeType.ToString(), this as IXmlLineInfo*/); 
        }
        if (this.LocalName == localname && this.NamespaceURI == ns) {
            Read();
        } 
        else {
            throw new XmlException(/*Res.Xml_ElementNotFoundNs, new String[2] { localname, ns }, this as IXmlLineInfo*/); 
        } 
    }

//#if !SILVERLIGHT
    // Reads a text-only element.
//    [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]
    public /*virtual*/  String  ReadElementString() { 
        String result = String.Empty;

        if (MoveToContent() != XmlNodeType.Element) { 
            throw new XmlException(/*Res.Xml_InvalidNodeType, this.NodeType.ToString(), this as IXmlLineInfo*/);
        } 
        if (!this.IsEmptyElement) {
            Read();
            result = ReadString();
            if (this.NodeType != XmlNodeType.EndElement) { 
                throw new XmlException(/*Res.Xml_UnexpectedNodeInSimpleContent, new String[] { this.NodeType.ToString(), "ReadElementString" }, this as IXmlLineInfo*/);
            } 
            Read(); 
        }
        else { 
            Read();
        }
        return result;
    } 

    // Checks that the Name property of the element found matches the given String before reading a text-only element. 
//    [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)] 
    public /*virtual*/  String  ReadElementString(String name) {
        String result = String.Empty; 

        if (MoveToContent() != XmlNodeType.Element) {
            throw new XmlException(/*Res.Xml_InvalidNodeType, this.NodeType.ToString(), this as IXmlLineInfo*/);
        } 
        if (this.Name != name) {
            throw new XmlException(/*Res.Xml_ElementNotFound, name, this as IXmlLineInfo*/); 
        } 

        if (!this.IsEmptyElement) { 
            //Read();
            result = ReadString();
            if (this.NodeType != XmlNodeType.EndElement) {
                throw new XmlException(/*Res.Xml_InvalidNodeType, this.NodeType.ToString(), this as IXmlLineInfo*/); 
            }
            Read(); 
        } 
        else {
            Read(); 
        }
        return result;
    }

    // Checks that the LocalName and NamespaceURI properties of the element found matches the given strings
    // before reading a text-only element. 
//    [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)] 
    public /*virtual*/  String  ReadElementString(String localname, String ns) {
        String result = String.Empty; 
        if (MoveToContent() != XmlNodeType.Element) {
            throw new XmlException(/*Res.Xml_InvalidNodeType, this.NodeType.ToString(), this as IXmlLineInfo*/);
        }
        if (this.LocalName != localname || this.NamespaceURI != ns) { 
            throw new XmlException(/*Res.Xml_ElementNotFoundNs, new String[2] { localname, ns }, this as IXmlLineInfo*/);
        } 

        if (!this.IsEmptyElement) {
            //Read(); 
            result = ReadString();
            if (this.NodeType != XmlNodeType.EndElement) {
                throw new XmlException(/*Res.Xml_InvalidNodeType, this.NodeType.ToString(), this as IXmlLineInfo*/);
            } 
            Read();
        } 
        else { 
            Read();
        } 

        return result;
    }
//#endif 
    // Checks that the current content node is an end tag and advances the reader to the next node.
    public /*virtual*/ void ReadEndElement() { 
        if (MoveToContent() != XmlNodeType.EndElement) { 
            throw new XmlException(/*Res.Xml_InvalidNodeType, this.NodeType.ToString(), this as IXmlLineInfo*/);
        } 
        Read();
    }

    // Calls MoveToContent and tests if the current content node is a start tag or empty element tag (XmlNodeType.Element). 
    public /*virtual*/ boolean IsStartElement() {
        return MoveToContent() == XmlNodeType.Element; 
    } 

    // Calls MoveToContentand tests if the current content node is a start tag or empty element tag (XmlNodeType.Element) and if the 
    // Name property of the element found matches the given argument.
    public /*virtual*/ boolean IsStartElement(String name) {
        return (MoveToContent() == XmlNodeType.Element) &&
               (this.Name == name); 
    }

    // Calls MoveToContent and tests if the current content node is a start tag or empty element tag (XmlNodeType.Element) and if 
    // the LocalName and NamespaceURI properties of the element found match the given strings.
    public /*virtual*/ boolean IsStartElement(String localname, String ns) { 
        return (MoveToContent() == XmlNodeType.Element) &&
               (this.LocalName == localname && this.NamespaceURI == ns);
    }

    // Reads to the following element with the given Name.
    public /*virtual*/  boolean  ReadToFollowing(String name) { 
        if (name == null || name.length() == 0) { 
            throw XmlConvert.CreateInvalidNameArgumentException(name, "name");
        } 
        // atomize name
        name = NameTable.Add(name);

        // find following element with that name 
        while (Read()) {
            if (NodeType == XmlNodeType.Element && Ref.Equal(name, Name)) { 
                return true; 
            }
        } 
        return false;
    }

    // Reads to the following element with the given LocalName and NamespaceURI. 
    public /*virtual*/  boolean  ReadToFollowing(String localName, String namespaceURI) {
        if (localName == null || localName.length() == 0) { 
            throw XmlConvert.CreateInvalidNameArgumentException(localName, "localName"); 
        }
        if (namespaceURI == null) { 
            throw new ArgumentNullException("namespaceURI");
        }

        // atomize local name and namespace 
        localName = NameTable.Add(localName);
        namespaceURI = NameTable.Add(namespaceURI); 

        // find following element with that name
        while (Read()) { 
            if (NodeType == XmlNodeType.Element && Ref.Equal(localName, LocalName) && Ref.Equal(namespaceURI, NamespaceURI)) {
                return true;
            }
        } 
        return false;
    } 

    // Reads to the first descendant of the current element with the given Name.
    public /*virtual*/  boolean  ReadToDescendant(String name) { 
        if (name == null || name.length() == 0) {
            throw XmlConvert.CreateInvalidNameArgumentException(name, "name");
        }
        // save the element or root depth 
        int parentDepth = Depth;
        if (NodeType != XmlNodeType.Element) { 
            // adjust the depth if we are on root node 
            if (ReadState == ReadState.Initial) {
//                Debug.Assert(parentDepth == 0); 
                parentDepth--;
            }
            else {
                return false; 
            }
        } 
        else if (IsEmptyElement) { 
            return false;
        } 

        // atomize name
        name = NameTable.Add(name);

        // find the descendant
        while (Read() && Depth > parentDepth) { 
            if (NodeType == XmlNodeType.Element && Ref.Equal(name, Name)) { 
                return true;
            } 
        }
//        Debug.Assert(NodeType == XmlNodeType.EndElement || NodeType == XmlNodeType.None || ReadState == ReadState.Error);
        return false;
    } 

    // Reads to the first descendant of the current element with the given LocalName and NamespaceURI. 
    public /*virtual*/  boolean  ReadToDescendant(String localName, String namespaceURI) { 
        if (localName == null || localName.Length == 0) {
            throw XmlConvert.CreateInvalidNameArgumentException(localName, "localName"); 
        }
        if (namespaceURI == null) {
            throw new ArgumentNullException("namespaceURI");
        } 
        // save the element or root depth
        int parentDepth = Depth; 
        if (NodeType != XmlNodeType.Element) { 
            // adjust the depth if we are on root node
            if (ReadState == ReadState.Initial) { 
//                Debug.Assert(parentDepth == 0);
                parentDepth--;
            }
            else { 
                return false;
            } 
        } 
        else if (IsEmptyElement) {
            return false; 
        }

        // atomize local name and namespace
        localName = NameTable.Add(localName); 
        namespaceURI = NameTable.Add(namespaceURI);

        // find the descendant 
        while (Read() && Depth > parentDepth) {
            if (NodeType == XmlNodeType.Element && Ref.Equal(localName, LocalName) && Ref.Equal(namespaceURI, NamespaceURI)) { 
                return true;
            }
        }
//        Debug.Assert(NodeType == XmlNodeType.EndElement); 
        return false;
    } 

    // Reads to the next sibling of the current element with the given Name.
    public /*virtual*/  boolean  ReadToNextSibling(String name) { 
        if (name == null || name.Length == 0) {
            throw XmlConvert.CreateInvalidNameArgumentException(name, "name");
        }

        // atomize name
        name = NameTable.Add(name); 

        // find the next sibling
        XmlNodeType nt; 
        do {
            if (!SkipSubtree()) {
                break;
            } 
            nt = NodeType;
            if (nt == XmlNodeType.Element && Ref.Equal(name, Name)) { 
                return true; 
            }
        } while (nt != XmlNodeType.EndElement && !EOF); 
        return false;
    }

    // Reads to the next sibling of the current element with the given LocalName and NamespaceURI. 
    public /*virtual*/  boolean  ReadToNextSibling(String localName, String namespaceURI) {
        if (localName == null || localName.Length == 0) { 
            throw XmlConvert.CreateInvalidNameArgumentException(localName, "localName"); 
        }
        if (namespaceURI == null) { 
            throw new ArgumentNullException("namespaceURI");
        }

        // atomize local name and namespace 
        localName = NameTable.Add(localName);
        namespaceURI = NameTable.Add(namespaceURI); 

        // find the next sibling
        XmlNodeType nt; 
        do {
            if (!SkipSubtree()) {
                break;
            } 
            nt = NodeType;
            if (nt == XmlNodeType.Element && Ref.Equal(localName, LocalName) && Ref.Equal(namespaceURI, NamespaceURI)) { 
                return true; 
            }
        } while (nt != XmlNodeType.EndElement && !EOF); 
        return false;
    }

    // Returns true if the given argument is a valid Name. 
    public static boolean IsName(String str) {
        if (str == null) { 
            throw new NullReferenceException(); 
        }
        return ValidateNames.IsNameNoNamespaces(str); 
    }

    // Returns true if the given argument is a valid NmToken.
    public static boolean IsNameToken(String str) { 
        if (str == null) {
            throw new NullReferenceException(); 
        } 
        return ValidateNames.IsNmtokenNoNamespaces(str);
    } 

    // Returns the inner content (including markup) of an element or attribute as a String.
    public /*virtual*/  String  ReadInnerXml() {
        if (ReadState != ReadState.Interactive) { 
            return String.Empty;
        } 
        if ((this.NodeType != XmlNodeType.Attribute) && (this.NodeType != XmlNodeType.Element)) { 
            Read();
            return String.Empty; 
        }

        StringWriter sw = new StringWriter(CultureInfo.InvariantCulture);
        XmlWriter xtw = CreateWriterForInnerOuterXml(sw); 

        try { 
            if (this.NodeType == XmlNodeType.Attribute) { 
//#if !SILVERLIGHT // Removing dependency on XmlTextWriter
                ((XmlTextWriter)xtw).QuoteChar = this.QuoteChar; 
//#endif
                WriteAttributeValue(xtw);
            }
            if (this.NodeType == XmlNodeType.Element) { 
                this.WriteNode(xtw, false);
            } 
        } 
        finally {
            xtw.Close(); 
        }
        return sw.ToString();
    }

    // Writes the content (inner XML) of the current node into the provided XmlWriter.
    private void WriteNode(XmlWriter xtw, boolean defattr) { 
//#if !SILVERLIGHT 
        Debug.Assert(xtw is XmlTextWriter);
//#endif 
        int d = this.NodeType == XmlNodeType.None ? -1 : this.Depth;
        while (this.Read() && (d < this.Depth)) {
            switch (this.NodeType) {
                case XmlNodeType.Element: 
                    xtw.WriteStartElement(this.Prefix, this.LocalName, this.NamespaceURI);
//#if !SILVERLIGHT // Removing dependency on XmlTextWriter 
                    ((XmlTextWriter)xtw).QuoteChar = this.QuoteChar; 
//#endif
                    xtw.WriteAttributes(this, defattr); 
                    if (this.IsEmptyElement) {
                        xtw.WriteEndElement();
                    }
                    break; 
                case XmlNodeType.Text:
                    xtw.WriteString(this.Value); 
                    break; 
                case XmlNodeType.Whitespace:
                case XmlNodeType.SignificantWhitespace: 
                    xtw.WriteWhitespace(this.Value);
                    break;
                case XmlNodeType.CDATA:
                    xtw.WriteCData(this.Value); 
                    break;
                case XmlNodeType.EntityReference: 
                    xtw.WriteEntityRef(this.Name); 
                    break;
                case XmlNodeType.XmlDeclaration: 
                case XmlNodeType.ProcessingInstruction:
                    xtw.WriteProcessingInstruction(this.Name, this.Value);
                    break;
                case XmlNodeType.DocumentType: 
                    xtw.WriteDocType(this.Name, this.GetAttribute("PUBLIC"), this.GetAttribute("SYSTEM"), this.Value);
                    break; 
                case XmlNodeType.Comment: 
                    xtw.WriteComment(this.Value);
                    break; 
                case XmlNodeType.EndElement:
                    xtw.WriteFullEndElement();
                    break;
            } 
        }
        if (d == this.Depth && this.NodeType == XmlNodeType.EndElement) { 
            Read(); 
        }
    } 

    // Writes the attribute into the provided XmlWriter.
    private void WriteAttributeValue(XmlWriter xtw) {
        String attrName = this.Name; 
        while (ReadAttributeValue()) {
            if (this.NodeType == XmlNodeType.EntityReference) { 
                xtw.WriteEntityRef(this.Name); 
            }
            else { 
                xtw.WriteString(this.Value);
            }
        }
        this.MoveToAttribute(attrName); 
    }

    // Returns the current element and its descendants or an attribute as a String. 
    public /*virtual*/  String  ReadOuterXml() {
        if (ReadState != ReadState.Interactive) { 
            return String.Empty;
        }
        if ((this.NodeType != XmlNodeType.Attribute) && (this.NodeType != XmlNodeType.Element)) {
            Read(); 
            return String.Empty;
        } 

        StringWriter sw = new StringWriter(CultureInfo.InvariantCulture);
        XmlWriter xtw = CreateWriterForInnerOuterXml(sw); 

        try {
            if (this.NodeType == XmlNodeType.Attribute) {
                xtw.WriteStartAttribute(this.Prefix, this.LocalName, this.NamespaceURI); 
                WriteAttributeValue(xtw);
                xtw.WriteEndAttribute(); 
            } 
            else {
                xtw.WriteNode(this, false); 
            }
        }
        finally {
            xtw.Close(); 
        }
        return sw.ToString(); 
    } 

    private XmlWriter CreateWriterForInnerOuterXml(StringWriter sw) { 
//#if SILVERLIGHT // Removing dependency on XmlTextWriter
//        XmlWriterSettings writerSettings = new XmlWriterSettings();
//        writerSettings.OmitXmlDeclaration = true;
//        writerSettings.ConformanceLevel = ConformanceLevel.Fragment; 
//        writerSettings.CheckCharacters = false;
//        writerSettings.NewLineHandling = NewLineHandling.None; 
//        XmlWriter w = XmlWriter.Create(sw, writerSettings); 
//#else
        XmlTextWriter w = new XmlTextWriter(sw); 
        // This is a V1 hack; we can put a custom implementation of ReadOuterXml on XmlTextReader/XmlValidatingReader
        SetNamespacesFlag(w);
//#endif
        return w; 
    }

//#if !SILVERLIGHT // Removing dependency on XmlTextWriter 
    void SetNamespacesFlag(XmlTextWriter xtw) {
        XmlTextReader tr = this as XmlTextReader; 
        if (tr != null) {
            xtw.Namespaces = tr.Namespaces;
        }
        else { 
//#pragma warning disable 618
            XmlValidatingReader vr = this as XmlValidatingReader; 
            if (vr != null) { 
                xtw.Namespaces = vr.Namespaces;
            } 
        }
//#pragma warning restore 618
    }
//#endif 

    // Returns an XmlReader that will read only the current element and its descendants and then go to EOF state. 
    public /*virtual*/  XmlReader  ReadSubtree() { 
        if (NodeType != XmlNodeType.Element) {
            throw new InvalidOperationException(Res.GetString(Res.Xml_ReadSubtreeNotOnElement)); 
        }
        return new XmlSubtreeReader(this);
    }

    // Returns true when the current node has any attributes.
    public /*virtual*/ boolean HasAttributes { 
        get { 
            return AttributeCount > 0;
        } 
    }

    //
    // IDisposable interface 
    //
    public void Dispose() { 
        Dispose(true); 
    }

    protected /*virtual*/ void Dispose(boolean disposing) { //the boolean flag may be used by subclasses to differentiate between disposing and finalizing
        if (disposing && ReadState != ReadState.Closed) {
            Close();
        } 
    }

    // 
    // Internal methods
    // 
    // Validation support
//#if !SILVERLIGHT
    /*internal*/ public /*virtual*/ XmlNamespaceManager NamespaceManager {
        get { 
            return null;
        } 
    } 
//#endif

    static /*internal*/ public boolean IsTextualNode(XmlNodeType nodeType) {
//#if DEBUG
//        // This code verifies IsTextualNodeBitmap mapping of XmlNodeType to a boolean specifying
//        // whether the node is 'textual' = Text, CDATA, Whitespace or SignificantWhitespace. 
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.None)));
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.Element))); 
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.Attribute))); 
//        Debug.Assert(0 != (IsTextualNodeBitmap & (1 << (int)XmlNodeType.Text)));
//        Debug.Assert(0 != (IsTextualNodeBitmap & (1 << (int)XmlNodeType.CDATA))); 
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.EntityReference)));
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.Entity)));
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.ProcessingInstruction)));
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.Comment))); 
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.Document)));
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.DocumentType))); 
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.DocumentFragment))); 
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.Notation)));
//        Debug.Assert(0 != (IsTextualNodeBitmap & (1 << (int)XmlNodeType.Whitespace))); 
//        Debug.Assert(0 != (IsTextualNodeBitmap & (1 << (int)XmlNodeType.SignificantWhitespace)));
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.EndElement)));
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.EndEntity)));
//        Debug.Assert(0 == (IsTextualNodeBitmap & (1 << (int)XmlNodeType.XmlDeclaration))); 
//#endif
        return 0 != (IsTextualNodeBitmap & (1 << (int)nodeType)); 
    } 

    static /*internal*/ public boolean CanReadContentAs(XmlNodeType nodeType) { 
//#if DEBUG
//        // This code verifies IsTextualNodeBitmap mapping of XmlNodeType to a boolean specifying
//        // whether ReadContentAsXxx calls are allowed on his node type
//        Debug.Assert(0 == (CanReadContentAsBitmap & (1 << (int)XmlNodeType.None))); 
//        Debug.Assert(0 == (CanReadContentAsBitmap & (1 << (int)XmlNodeType.Element)));
//        Debug.Assert(0 != (CanReadContentAsBitmap & (1 << (int)XmlNodeType.Attribute))); 
//        Debug.Assert(0 != (CanReadContentAsBitmap & (1 << (int)XmlNodeType.Text))); 
//        Debug.Assert(0 != (CanReadContentAsBitmap & (1 << (int)XmlNodeType.CDATA)));
//        Debug.Assert(0 != (CanReadContentAsBitmap & (1 << (int)XmlNodeType.EntityReference))); 
//        Debug.Assert(0 == (CanReadContentAsBitmap & (1 << (int)XmlNodeType.Entity)));
//        Debug.Assert(0 != (CanReadContentAsBitmap & (1 << (int)XmlNodeType.ProcessingInstruction)));
//        Debug.Assert(0 != (CanReadContentAsBitmap & (1 << (int)XmlNodeType.Comment)));
//        Debug.Assert(0 == (CanReadContentAsBitmap & (1 << (int)XmlNodeType.Document))); 
//        Debug.Assert(0 == (CanReadContentAsBitmap & (1 << (int)XmlNodeType.DocumentType)));
//        Debug.Assert(0 == (CanReadContentAsBitmap & (1 << (int)XmlNodeType.DocumentFragment))); 
//        Debug.Assert(0 == (CanReadContentAsBitmap & (1 << (int)XmlNodeType.Notation))); 
//        Debug.Assert(0 != (CanReadContentAsBitmap & (1 << (int)XmlNodeType.Whitespace)));
//        Debug.Assert(0 != (CanReadContentAsBitmap & (1 << (int)XmlNodeType.SignificantWhitespace))); 
//        Debug.Assert(0 != (CanReadContentAsBitmap & (1 << (int)XmlNodeType.EndElement)));
//        Debug.Assert(0 != (CanReadContentAsBitmap & (1 << (int)XmlNodeType.EndEntity)));
//        Debug.Assert(0 == (CanReadContentAsBitmap & (1 << (int)XmlNodeType.XmlDeclaration)));
//#endif 
        return 0 != (CanReadContentAsBitmap & (1 << (int)nodeType));
    } 

    static /*internal*/ public boolean HasValueInternal(XmlNodeType nodeType) {
//#if DEBUG 
//        // This code verifies HasValueBitmap mapping of XmlNodeType to a boolean specifying
//        // whether the node can have a non-empty Value
//        Debug.Assert(0 == (HasValueBitmap & (1 << (int)XmlNodeType.None)));
//        Debug.Assert(0 == (HasValueBitmap & (1 << (int)XmlNodeType.Element))); 
//        Debug.Assert(0 != (HasValueBitmap & (1 << (int)XmlNodeType.Attribute)));
//        Debug.Assert(0 != (HasValueBitmap & (1 << (int)XmlNodeType.Text))); 
//        Debug.Assert(0 != (HasValueBitmap & (1 << (int)XmlNodeType.CDATA))); 
//        Debug.Assert(0 == (HasValueBitmap & (1 << (int)XmlNodeType.EntityReference)));
//        Debug.Assert(0 == (HasValueBitmap & (1 << (int)XmlNodeType.Entity))); 
//        Debug.Assert(0 != (HasValueBitmap & (1 << (int)XmlNodeType.ProcessingInstruction)));
//        Debug.Assert(0 != (HasValueBitmap & (1 << (int)XmlNodeType.Comment)));
//        Debug.Assert(0 == (HasValueBitmap & (1 << (int)XmlNodeType.Document)));
//        Debug.Assert(0 != (HasValueBitmap & (1 << (int)XmlNodeType.DocumentType))); 
//        Debug.Assert(0 == (HasValueBitmap & (1 << (int)XmlNodeType.DocumentFragment)));
//        Debug.Assert(0 == (HasValueBitmap & (1 << (int)XmlNodeType.Notation))); 
//        Debug.Assert(0 != (HasValueBitmap & (1 << (int)XmlNodeType.Whitespace))); 
//        Debug.Assert(0 != (HasValueBitmap & (1 << (int)XmlNodeType.SignificantWhitespace)));
//        Debug.Assert(0 == (HasValueBitmap & (1 << (int)XmlNodeType.EndElement))); 
//        Debug.Assert(0 == (HasValueBitmap & (1 << (int)XmlNodeType.EndEntity)));
//        Debug.Assert(0 != (HasValueBitmap & (1 << (int)XmlNodeType.XmlDeclaration)));
//#endif
        return 0 != (HasValueBitmap & (1 << (int)nodeType)); 
    }

    // 
    // Private methods
    // 
    //SkipSubTree is called whenever validation of the skipped subtree is required on a reader with XsdValidation
    private  boolean  SkipSubtree() {
        MoveToElement();
        if (NodeType == XmlNodeType.Element && !IsEmptyElement) { 
            int depth = Depth;

            while (Read() && depth < Depth) { 
                // Nothing, just read on
            } 

            // consume end tag
            if (NodeType == XmlNodeType.EndElement)
                return Read(); 
        }
        else { 
            return Read(); 
        }

        return false;
    }

    /*internal*/ public void CheckElement(String localName, String namespaceURI) { 
        if (localName == null || localName.Length == 0) {
            throw XmlConvert.CreateInvalidNameArgumentException(localName, "localName"); 
        } 
        if (namespaceURI == null) {
            throw new ArgumentNullException("namespaceURI"); 
        }
        if (NodeType != XmlNodeType.Element) {
            throw new XmlException(Res.Xml_InvalidNodeType, this.NodeType.ToString(), this as IXmlLineInfo);
        } 
        if (LocalName != localName || NamespaceURI != namespaceURI) {
            throw new XmlException(Res.Xml_ElementNotFoundNs, new String[2] { localName, namespaceURI }, this as IXmlLineInfo); 
        } 
    }

    /*internal*/ public Exception CreateReadContentAsException(String methodName) {
        return CreateReadContentAsException(methodName, NodeType, this as IXmlLineInfo);
    }

    /*internal*/ public Exception CreateReadElementContentAsException(String methodName) {
        return CreateReadElementContentAsException(methodName, NodeType, this as IXmlLineInfo); 
    } 

    /*internal*/ public boolean CanReadContentAs() { 
        return CanReadContentAs(this.NodeType);
    }

    static /*internal*/ public Exception CreateReadContentAsException(String methodName, XmlNodeType nodeType, IXmlLineInfo lineInfo) { 
        return new InvalidOperationException(AddLineInfo(Res.GetString(Res.Xml_InvalidReadContentAs, new String[] { methodName, nodeType.ToString() }), lineInfo));
    } 

    static /*internal*/ public Exception CreateReadElementContentAsException(String methodName, XmlNodeType nodeType, IXmlLineInfo lineInfo) {
        return new InvalidOperationException(AddLineInfo(Res.GetString(Res.Xml_InvalidReadElementContentAs, new String[] { methodName, nodeType.ToString() }), lineInfo)); 
    }

    static String AddLineInfo(String message, IXmlLineInfo lineInfo) {
        if (lineInfo != null) { 
            String[] lineArgs = new String[2];
            lineArgs[0] = lineInfo.LineNumber.ToString(CultureInfo.InvariantCulture); 
            lineArgs[1] = lineInfo.LinePosition.ToString(CultureInfo.InvariantCulture); 
            message += " " + Res.GetString(Res.Xml_ErrorPosition, lineArgs);
        } 
        return message;
    }

    /*internal*/ public  String  InternalReadContentAsString() { 
        String value = String.Empty;
        BufferBuilder sb = null; 
        do { 
            switch (this.NodeType) {
                case XmlNodeType.Attribute: 
                    return this.Value;
                case XmlNodeType.Text:
                case XmlNodeType.Whitespace:
                case XmlNodeType.SignificantWhitespace: 
                case XmlNodeType.CDATA:
                    // merge text content 
                    if (value.Length == 0) { 
                        value = this.Value;
                    } 
                    else {
                        if (sb == null) {
                            sb = new BufferBuilder();
                            sb.Append(value); 
                        }
                        sb.Append(this.Value); 
                    } 
                    break;
                case XmlNodeType.ProcessingInstruction: 
                case XmlNodeType.Comment:
                case XmlNodeType.EndEntity:
                    // skip comments, pis and end entity nodes
                    break; 
                case XmlNodeType.EntityReference:
                    if (this.CanResolveEntity) { 
                        this.ResolveEntity(); 
                        break;
                    } 
                    goto default;
                case XmlNodeType.EndElement:
                default:
                    goto ReturnContent; 
            }
        } while ((this.AttributeCount != 0) ? this.ReadAttributeValue() : this.Read()); 

    ReturnContent:
        return (sb == null) ? value : sb.ToString(); 
    }

    private  boolean  SetupReadElementContentAsXxx(String methodName) {
        if (this.NodeType != XmlNodeType.Element) { 
            throw CreateReadElementContentAsException(methodName);
        } 

        boolean isEmptyElement = this.IsEmptyElement;

        // move to content or beyond the empty element
        this.Read();

        if (isEmptyElement) { 
            return false;
        } 

        XmlNodeType nodeType = this.NodeType;
        if (nodeType == XmlNodeType.EndElement) { 
            this.Read();
            return false;
        }
        else if (nodeType == XmlNodeType.Element) { 
            throw new XmlException(Res.Xml_MixedReadElementContentAs, String.Empty, this as IXmlLineInfo);
        } 
        return true; 
    }

    private void FinishReadElementContentAsXxx() {
        if (this.NodeType != XmlNodeType.EndElement) {
            throw new XmlException(Res.Xml_InvalidNodeType, this.NodeType.ToString());
        } 
        this.Read();
    } 

    /*internal*/ public boolean IsDefaultInternal {
        get { 
//#if SILVERLIGHT // Removing dependency on XmlSchema
            return this.IsDefault;
//#else
            if (this.IsDefault) { 
                return true;
            } 
            IXmlSchemaInfo schemaInfo = this.SchemaInfo; 
            if (schemaInfo != null && schemaInfo.IsDefault) {
                return true; 
            }
            return false;
//#endif
        } 
    }

//#if !SILVERLIGHT 
    /*internal*/ public /*virtual*/ IDtdInfo DtdInfo {
        get { 
            return null;
        }
    }
//#endif 

//#if !SILVERLIGHT // Needed only for XmlTextReader or XmlValidatingReader 
    /*internal*/ public static Encoding GetEncoding(XmlReader reader) { 
        XmlTextReaderImpl tri = GetXmlTextReaderImpl(reader);
        return tri != null ? tri.Encoding : null; 
    }

    /*internal*/ public static ConformanceLevel GetV1ConformanceLevel(XmlReader reader) {
        XmlTextReaderImpl tri = GetXmlTextReaderImpl(reader); 
        return tri != null ? tri.V1ComformanceLevel : ConformanceLevel.Document;
    } 

    private static XmlTextReaderImpl GetXmlTextReaderImpl(XmlReader reader) {
        XmlTextReaderImpl tri = reader as XmlTextReaderImpl; 
        if (tri != null) {
            return tri;
        }
        XmlTextReader tr = reader as XmlTextReader; 
        if (tr != null) {
            return tr.Impl; 
        } 
        XmlValidatingReaderImpl vri = reader as XmlValidatingReaderImpl;
        if (vri != null) { 
            return vri.ReaderImpl;
        }
//#pragma warning disable 618
        XmlValidatingReader vr = reader as XmlValidatingReader; 
//#pragma warning restore 618
        if (vr != null) { 
            return vr.Impl.ReaderImpl; 
        }
        return null; 
    }
//#endif

    // 
    // Static methods for creating readers
    // 

    // Creates an XmlReader for parsing XML from the given Uri.
//#if !SILVERLIGHT 
//    [ResourceConsumption(ResourceScope.Machine)]
//    [ResourceExposure(ResourceScope.Machine)]
//#endif
    public static XmlReader Create(String inputUri) { 
        return XmlReader.Create(inputUri, (XmlReaderSettings)null, (XmlParserContext)null);
    } 

    // Creates an XmlReader according to the settings for parsing XML from the given Uri.
//#if !SILVERLIGHT 
//    [ResourceConsumption(ResourceScope.Machine)]
//    [ResourceExposure(ResourceScope.Machine)]
//#endif
    public static XmlReader Create(String inputUri, XmlReaderSettings settings) { 
        return XmlReader.Create(inputUri, settings, (XmlParserContext)null);
    } 

    // Creates an XmlReader according to the settings and parser context for parsing XML from the given Uri.
//#if !SILVERLIGHT 
//    [ResourceConsumption(ResourceScope.Machine)]
//    [ResourceExposure(ResourceScope.Machine)]
//#endif
    public static XmlReader Create(String inputUri, XmlReaderSettings settings, XmlParserContext inputContext) { 
        if (settings == null) {
            settings = new XmlReaderSettings(); 
        } 
        return settings.CreateReader(inputUri, inputContext);
    } 

    // Creates an XmlReader according for parsing XML from the given stream.
    public static XmlReader Create(Stream input) {
        return Create(input, (XmlReaderSettings)null, (String)String.Empty); 
    }

    // Creates an XmlReader according to the settings for parsing XML from the given stream. 
    public static XmlReader Create(Stream input, XmlReaderSettings settings) {
        return Create(input, settings, String.Empty); 
    }

    // Creates an XmlReader according to the settings and base Uri for parsing XML from the given stream.
    public static XmlReader Create(Stream input, XmlReaderSettings settings, String baseUri) { 
        if (settings == null) {
            settings = new XmlReaderSettings(); 
        } 
        return settings.CreateReader(input, null, (String)baseUri, null);
    } 

    // Creates an XmlReader according to the settings and parser context for parsing XML from the given stream.
    public static XmlReader Create(Stream input, XmlReaderSettings settings, XmlParserContext inputContext) {
        if (settings == null) { 
            settings = new XmlReaderSettings();
        } 
        return settings.CreateReader(input, null, (String)String.Empty, inputContext); 
    }

    // Creates an XmlReader according for parsing XML from the given TextReader.
    public static XmlReader Create(TextReader input) {
        return Create(input, (XmlReaderSettings)null, (String)String.Empty);
    } 

    // Creates an XmlReader according to the settings for parsing XML from the given TextReader. 
    public static XmlReader Create(TextReader input, XmlReaderSettings settings) { 
        return Create(input, settings, String.Empty);
    } 

    // Creates an XmlReader according to the settings and baseUri for parsing XML from the given TextReader.
    public static XmlReader Create(TextReader input, XmlReaderSettings settings, String baseUri) {
        if (settings == null) { 
            settings = new XmlReaderSettings();
        } 
        return settings.CreateReader(input, baseUri, null); 
    }

    // Creates an XmlReader according to the settings and parser context for parsing XML from the given TextReader.
    public static XmlReader Create(TextReader input, XmlReaderSettings settings, XmlParserContext inputContext) {
        if (settings == null) {
            settings = new XmlReaderSettings(); 
        }
        return settings.CreateReader(input, String.Empty, inputContext); 
    } 

    // Creates an XmlReader according to the settings wrapped over the given reader. 
    public static XmlReader Create(XmlReader reader, XmlReaderSettings settings) {
        if (settings == null) {
            settings = new XmlReaderSettings();
        } 
        return settings.CreateReader(reader);
    } 

//#if !SILVERLIGHT
    // !!!!!! 
    // NOTE: This method is called via reflection from System.Data.dll and from Analysis Services in Yukon.
    // Do not change its signature without notifying the appropriate teams!
    // !!!!!!
    /*internal*/ public static XmlReader CreateSqlReader(Stream input, XmlReaderSettings settings, XmlParserContext inputContext) { 
        if (input == null) {
            throw new ArgumentNullException("input"); 
        } 
        if (settings == null) {
            settings = new XmlReaderSettings(); 
        }

        XmlReader reader;

        // allocate byte buffer
        byte[] bytes = new byte[CalcBufferSize(input)]; 

//#if false
        { 
            // catch the binary XML input and dump it into a local file (for debugging and testing purposes)

            // create dump file name
            String dumpFileNameBase = "~CreateSqlReaderInputDump"; 
            String dumpFileName;
            int i = 0; 
            do { 
                i++;
                dumpFileName = Path.GetFullPath(String.Concat(dumpFileNameBase, i.ToString(), ".bmx")); 
            } while (File.Exists(dumpFileName));

            // dump the input into the file
            FileStream fs = new FileStream(dumpFileName, FileMode.Create, FileAccess.ReadWrite); 
            byte[] buffer = new byte[4096];
            int bytesRead; 
            while ((bytesRead = input.Read(buffer, 0, buffer.Length)) > 0) { 
                fs.Write(buffer, 0, bytesRead);
            } 
            fs.Seek(0, SeekOrigin.Begin);

            // make sure it will get closed
            if (settings.CloseInput) { 
                input.Close();
            } 
            input = fs; 
            settings = settings.Clone();
            settings.CloseInput = true; 
        }
//#endif
        int byteCount = 0;
        int read; 
        do {
            read = input.Read(bytes, byteCount, bytes.Length - byteCount); 
            byteCount += read; 
        } while (read > 0 && byteCount < 2);

        // create text or binary XML reader depenting on the stream first 2 bytes
        if (byteCount >= 2 && (bytes[0] == 0xdf && bytes[1] == 0xff)) {
            if ( inputContext != null )
                throw new ArgumentException(Res.GetString(Res.XmlBinary_NoParserContext), "inputContext"); 
            reader = new XmlSqlBinaryReader(input, bytes, byteCount, String.Empty, settings.CloseInput, settings);
        } 
        else { 
            reader = new XmlTextReaderImpl(input, bytes, byteCount, settings, null, String.Empty, inputContext, settings.CloseInput);
        } 

        // wrap with validating reader
        if ( settings.ValidationType != ValidationType.None ) {
            reader = settings.AddValidation( reader ); 
        }

        if (settings.Async) { 
            reader = XmlAsyncCheckReader.CreateAsyncCheckWrapper(reader);
        } 

        return reader;
    }
//#endif 

    /*internal*/ public static int CalcBufferSize(Stream input) { 
        // determine the size of byte buffer 
        int bufferSize = DefaultBufferSize;
        if (input.CanSeek) { 
            long len = input.Length;
            if (len < bufferSize) {
                bufferSize = checked((int)len);
            } 
            else if (len > MaxStreamLengthForDefaultBufferSize) {
                bufferSize = BiggerBufferSize; 
            } 
        }

        // return the byte buffer size
        return bufferSize;
    }

//#if !SILVERLIGHT // This is used for displaying the state of the XmlReader in Watch/Locals windows in the Visual Studio during debugging
    private Object debuggerDisplayProxy { get { return new XmlReaderDebuggerDisplayProxy(this); } } 

//    [DebuggerDisplay("{ToString()}")]
    class XmlReaderDebuggerDisplayProxy { 
        XmlReader reader;

        /*internal*/ public XmlReaderDebuggerDisplayProxy( XmlReader reader ) {
            this.reader = reader; 
        }

        public /*override*/ String ToString() { 
            XmlNodeType nt = reader.NodeType;
            String result = nt.ToString(); 
            switch ( nt ) {
                case XmlNodeType.Element:
                case XmlNodeType.EndElement:
                case XmlNodeType.EntityReference: 
                case XmlNodeType.EndEntity:
                    result += ", Name=\"" + reader.Name + '"'; 
                    break; 
                case XmlNodeType.Attribute:
                case XmlNodeType.ProcessingInstruction: 
                    result += ", Name=\"" + reader.Name + "\", Value=\"" + XmlConvert.EscapeValueForDebuggerDisplay( reader.Value ) + '"';
                    break;
                case XmlNodeType.Text:
                case XmlNodeType.Whitespace: 
                case XmlNodeType.SignificantWhitespace:
                case XmlNodeType.Comment: 
                case XmlNodeType.XmlDeclaration: 
                case XmlNodeType.CDATA:
                    result += ", Value=\"" + XmlConvert.EscapeValueForDebuggerDisplay( reader.Value ) + '"'; 
                    break;
                case XmlNodeType.DocumentType:
                    result += ", Name=\"" + reader.Name + "'";
                    result += ", SYSTEM=\"" + reader.GetAttribute( "SYSTEM" ) + '"'; 
                    result += ", PUBLIC=\"" + reader.GetAttribute( "PUBLIC" ) + '"';
                    result += ", Value=\"" + XmlConvert.EscapeValueForDebuggerDisplay( reader.Value ) + '"'; 
                    break; 
            }
            return result; 
        }
    }
//#endif

}