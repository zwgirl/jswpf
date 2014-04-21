package org.summer.view.widget.internal;
/*internal*/ public /*static*/ class SystemXmlHelper
{
    // return true if the item is an XmlNode
    /*internal*/ public static boolean IsXmlNode(Object item) 
    {
        SystemXmlExtensionMethods extensions = AssemblyHelper.ExtensionsForSystemXml(); 
        return (extensions != null) ? extensions.IsXmlNode(item) : false; 
    }

    // return true if the item is an XmlNamespaceManager
    /*internal*/ public static boolean IsXmlNamespaceManager(Object item)
    {
        SystemXmlExtensionMethods extensions = AssemblyHelper.ExtensionsForSystemXml(); 
        return (extensions != null) ? extensions.IsXmlNamespaceManager(item) : false;
    } 

    // if the item is an XmlNode, get the value corresponding to the given name
    /*internal*/ public static boolean TryGetValueFromXmlNode(Object item, String name, out Object value) 
    {
        SystemXmlExtensionMethods extensions = AssemblyHelper.ExtensionsForSystemXml();
        if (extensions != null)
        { 
            return extensions.TryGetValueFromXmlNode(item, name, out value);
        } 

        value = null;
        return false; 
    }

    // create a comparer for an Xml collection (if applicable)
    /*internal*/ public static IComparer PrepareXmlComparer(IEnumerable collection, SortDescriptionCollection sort, CultureInfo culture) 
    {
        SystemXmlExtensionMethods extensions = AssemblyHelper.ExtensionsForSystemXml(); 
        if (extensions != null) 
        {
            return extensions.PrepareXmlComparer(collection, sort, culture); 
        }

        return null;
    } 

    // return true if parent is an empty XmlDataCollection. 
    /*internal*/ public static boolean IsEmptyXmlDataCollection(Object parent) 
    {
        SystemXmlExtensionMethods extensions = AssemblyHelper.ExtensionsForSystemXml(); 
        return (extensions != null) ? extensions.IsEmptyXmlDataCollection(parent) : false;
    }

    // when item is an XmlNode, get its tag name (using the target DO as context 
    // for namespace lookups)
    /*internal*/ public static String GetXmlTagName(Object item, DependencyObject target) 
    { 
        SystemXmlExtensionMethods extensions = AssemblyHelper.ExtensionsForSystemXml();
        return (extensions != null) ? extensions.GetXmlTagName(item, target) : null; 
    }

    // find a node with the given String as its InnerText
    /*internal*/ public static Object FindXmlNodeWithInnerText(IEnumerable items, Object innerText, out int index) 
    {
        index = -1; 
        SystemXmlExtensionMethods extensions = AssemblyHelper.ExtensionsForSystemXml(); 
        return (extensions != null) ? extensions.FindXmlNodeWithInnerText(items, innerText, out index) : DependencyProperty.UnsetValue;
    } 

    // get the InnerText of the given node
    /*internal*/ public static Object GetInnerText(Object item)
    { 
        SystemXmlExtensionMethods extensions = AssemblyHelper.ExtensionsForSystemXml();
        return (extensions != null) ? extensions.GetInnerText(item) : null; 
    } 
}