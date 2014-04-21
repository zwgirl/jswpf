package org.summer.view.widget.markup;

import java.io.StringWriter;
import java.util.stream.Stream;

import javax.sql.rowset.spi.XmlWriter;

import org.summer.view.widget.ArgumentNullException;

/// <summary> 
/// Parsing class used to create an Windows Presentation Platform Tree
/// </summary> 
public /*static*/ class XamlWriter 
{
//#region Public Methods 

    /// <summary>
    ///     Save gets the xml respresentation
    ///     for the given Object instance 
    /// </summary>
    /// <param name="obj"> 
    ///     Object instance 
    /// </param>
    /// <returns> 
    ///     XAML String representing Object instance
    /// </returns>
    /// <SecurityNote>
    ///     Critcal: We only allow Serialization in partial trust.  Although we would throw an exception later anyways, 
    ///     we throw one here so we know where to expect the exception.  (





//    [SecuritySafeCritical]
    public static String Save(Object obj)
    { 
        // Must be in full trust
        SecurityHelper.DemandUnmanagedCode(); 

        // Validate input arguments
        if (obj == null) 
        {
            throw new ArgumentNullException("obj");
        }

        // Create TextWriter
        StringBuilder sb = new StringBuilder(); 
        TextWriter writer = new StringWriter(sb, TypeConverterHelper.InvariantEnglishUS); 

        try 
        {
            Save(obj, writer);
        }
        finally 
        {
            // Close writer 
            writer.Close(); 
        }

        return sb.ToString();
    }

    /// <summary> 
    ///     Save writes the xml respresentation
    ///     for the given Object instance using the given writer 
    /// </summary> 
    /// <param name="obj">
    ///     Object instance 
    /// </param>
    /// <param name="writer">
    ///     Text Writer
    /// </param> 
    /// <SecurityNote>
    ///     Critcal: We only allow Serialization in full trust.  Although we would throw an exception later anyways, 
    ///     we throw one here so we know where to expect the exception.  ( 





//    [SecuritySafeCritical] 
    public static void Save(Object obj, TextWriter writer)
    { 
        // Must be in full trust 
        SecurityHelper.DemandUnmanagedCode();

        // Validate input arguments
        if (obj == null)
        {
            throw new ArgumentNullException("obj"); 
        }
        if (writer == null) 
        { 
            throw new ArgumentNullException("writer");
        } 

        // Create XmlTextWriter
        XmlTextWriter xmlWriter = new XmlTextWriter(writer);

        MarkupWriter.SaveAsXml(xmlWriter, obj);
    } 

    /// <summary>
    ///     Save writes the xml respresentation 
    ///     for the given Object instance to the given stream
    /// </summary>
    /// <param name="obj">
    ///     Object instance 
    /// </param>
    /// <param name="stream"> 
    ///     Stream 
    /// </param>
    /// <SecurityNote> 
    ///     Critcal: We only allow Serialization in full trust.  Although we would throw an exception later anyways,
    ///     we throw one here so we know where to expect the exception.  (





//    [SecuritySafeCritical]
    public static void Save(Object obj, Stream stream) 
    {
        // Must be in full trust
        SecurityHelper.DemandUnmanagedCode();

        // Validate input arguments
        if (obj == null) 
        { 
            throw new ArgumentNullException("obj");
        } 
        if (stream == null)
        {
            throw new ArgumentNullException("stream");
        } 

        // Create XmlTextWriter 
        XmlTextWriter xmlWriter = new XmlTextWriter(stream, null); 

        MarkupWriter.SaveAsXml(xmlWriter, obj); 
    }

    /// <summary>
    ///     Save writes the xml respresentation 
    ///     for the given Object instance using the given
    ///     writer. In addition it also allows the designer 
    ///     to participate in this conversion. 
    /// </summary>
    /// <param name="obj"> 
    ///     Object instance
    /// </param>
    /// <param name="xmlWriter">
    ///     XmlWriter 
    /// </param>
    /// <SecurityNote> 
    ///     Critcal: We only allow Serialization in full trust.  Although we would throw an exception later anyways, 
    ///     we throw one here so we know where to expect the exception.  (





//    [SecuritySafeCritical]
    public static void Save(Object obj, XmlWriter xmlWriter) 
    { 
        // Must be in full trust
        SecurityHelper.DemandUnmanagedCode(); 

        // Validate input arguments
        if (obj == null)
        { 
            throw new ArgumentNullException("obj");
        } 
        if (xmlWriter == null) 
        {
            throw new ArgumentNullException("xmlWriter"); 
        }

        try
        { 
            MarkupWriter.SaveAsXml(xmlWriter, obj);
        } 
        finally 
        {
            xmlWriter.Flush(); 
        }
    }

    /// <summary> 
    ///     Save writes the xml respresentation
    ///     for the given Object instance using the 
    ///     given XmlTextWriter embedded in the manager. 
    /// </summary>
    /// <param name="obj"> 
    ///     Object instance
    /// </param>
    /// <param name="manager">
    ///     Serialization Manager 
    /// </param>
    /// <SecurityNote> 
    ///     Critcal: We only allow Serialization in full trust.  Although we would throw an exception later anyways, 
    ///     we throw one here so we know where to expect the exception.  (





//    [SecuritySafeCritical]
    public static void Save(Object obj, XamlDesignerSerializationManager manager) 
    { 
        // Must be in full trust
        SecurityHelper.DemandUnmanagedCode(); 

        // Validate input arguments
        if (obj == null)
        { 
            throw new ArgumentNullException("obj");
        } 
        if (manager == null) 
        {
            throw new ArgumentNullException("manager"); 
        }

        MarkupWriter.SaveAsXml(manager.XmlWriter, obj, manager);
    } 

//#endregion Public Methods 
} 