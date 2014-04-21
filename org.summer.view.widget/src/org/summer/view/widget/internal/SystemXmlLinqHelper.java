package org.summer.view.widget.internal;

import org.summer.view.widget.model.PropertyDescriptor;

/*internal*/ public /*static*/ class SystemXmlLinqHelper 
{ 
    // return true if the item is an XElement
    /*internal*/ public static boolean IsXElement(Object item) 
    {
        SystemXmlLinqExtensionMethods extensions = AssemblyHelper.ExtensionsForSystemXmlLinq();
        return (extensions != null) ? extensions.IsXElement(item) : false;
    } 

    // return a string of the form "{http://my.namespace}TagName" 
    /*internal*/ public static string GetXElementTagName(Object item) 
    {
        SystemXmlLinqExtensionMethods extensions = AssemblyHelper.ExtensionsForSystemXmlLinq(); 
        return (extensions != null) ? extensions.GetXElementTagName(item) : null;
    }

    // XLinq exposes two synthetic properties - Elements and Descendants - 
    // on XElement that return IEnumerable<XElement>.  We handle these specially
    // to work around problems involving identity and change notifications 
    /*internal*/ public static boolean IsXLinqCollectionProperty(PropertyDescriptor pd) 
    {
        SystemXmlLinqExtensionMethods extensions = AssemblyHelper.ExtensionsForSystemXmlLinq(); 
        return (extensions != null) ? extensions.IsXLinqCollectionProperty(pd) : false;
    }

    // XLinq exposes several properties on XElement that create new objects 
    // every time the getter is called.
    /*internal*/ public static boolean IsXLinqNonIdempotentProperty(PropertyDescriptor pd) 
    { 
        SystemXmlLinqExtensionMethods extensions = AssemblyHelper.ExtensionsForSystemXmlLinq();
        return (extensions != null) ? extensions.IsXLinqNonIdempotentProperty(pd) : false; 
    }
}