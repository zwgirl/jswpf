package org.summer.view.widget.markup;
/// <summary>
    /// MarkupExtension parsing helper that provides things like namespace lookups 
    /// and type resolution services.  This is implemented by classes like XamlReaderHelper
    /// and BamlWriter.
    /// </summary>
    /*internal*/ public interface IParserHelper 
    {
        String LookupNamespace(String prefix); 
 
        boolean GetElementType(
                boolean    extensionFirst, 
                String  localName,
                String  namespaceURI,
            /*ref*/ String  assemblyName,
            /*ref*/ String  typeFullName, 
            /*ref*/ Type    baseType,
            /*ref*/ Type    serializerType); 
 
        boolean CanResolveLocalAssemblies();
    } 


