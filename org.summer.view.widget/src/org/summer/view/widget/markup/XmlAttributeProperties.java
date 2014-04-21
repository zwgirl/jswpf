package org.summer.view.widget.markup;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.FrameworkPropertyMetadataOptions;
import org.summer.view.widget.LogicalTreeHelper;
import org.summer.view.widget.data.BindingFlags;
import org.summer.view.widget.reflection.MethodInfo;
/// <summary> 
/// A class to encapsulate XML-specific attributes of a DependencyObject 
/// </summary>
//#if PBTCOMPILER 
///*internal*/ public sealed class XmlAttributeProperties
//#else
public /*sealed*/ class XmlAttributeProperties
//#endif 
{
#if !PBTCOMPILER 
#region Public Methods 

    // This is a dummy contructor to prevent people 
    // from being able to instantiate this class
    private XmlAttributeProperties()
    {
    } 

    static //XmlAttributeProperties() 
    { 
        XmlSpaceProperty =
            DependencyProperty.RegisterAttached("XmlSpace", typeof(String), typeof(XmlAttributeProperties), 
                                        new FrameworkPropertyMetadata("default"));

        XmlnsDictionaryProperty =
            DependencyProperty.RegisterAttached("XmlnsDictionary", typeof(XmlnsDictionary), typeof(XmlAttributeProperties), 
                                        new FrameworkPropertyMetadata((object)null, FrameworkPropertyMetadataOptions.Inherits));

        XmlnsDefinitionProperty = 
            DependencyProperty.RegisterAttached("XmlnsDefinition", typeof(String), typeof(XmlAttributeProperties),
                                        new FrameworkPropertyMetadata(XamlReaderHelper.DefinitionNamespaceURI, 
                                                                      FrameworkPropertyMetadataOptions.Inherits));

        XmlNamespaceMapsProperty =
            DependencyProperty.RegisterAttached("XmlNamespaceMaps", typeof(Hashtable), typeof(XmlAttributeProperties), 
                                        new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.Inherits));

    } 

//#if Lookups 
    /// <summary>
    /// Looks up the namespace corresponding to an XML namespace prefix
    /// </summary>
    /// <param name="elem">The DependencyObject containing the namespace mappings to be 
    ///  used in the lookup</param>
    /// <param name="prefix">The XML namespace prefix to look up</param> 
    /// <returns>The namespace corresponding to the given prefix if it exists, 
    /// null otherwise</returns>
    public static String LookupNamespace(DependencyObject elem, String prefix) 
    {
        if (elem == null)
        {
            throw new ArgumentNullException( "elem" ); 
        }
        if (prefix == null) 
        { 
            throw new ArgumentNullException( "prefix" );
        } 

        // Walk up the parent chain until one of the parents has the passed prefix in
        // its xmlns dictionary, or until a null parent is reached.
        XmlnsDictionary d = GetXmlnsDictionary(elem); 
        while ((null == d || null == d[prefix]) && null != elem)
        { 
            elem = LogicalTreeHelper.GetParent(elem); 
            if (elem != null)
            { 
                d = GetXmlnsDictionary(elem);
            }
        }

        if (null != d)
        { 
            return d[prefix]; 
        }
        else 
        {
            return null;
        }
    } 

    /// <summary> 
    /// Looks up the XML prefix corresponding to a namespaceUri 
    /// </summary>
    /// <param name="elem">The DependencyObject containing the namespace mappings to 
    ///  be used in the lookup</param>
    /// <param name="uri">The namespaceUri to look up</param>
    /// <returns>
    /// String.Empty if the given namespace corresponds to the default namespace; otherwise, 
    /// the XML prefix corresponding to the given namespace, or null if none exists
    /// </returns> 
    public static String LookupPrefix(DependencyObject elem, String uri) 
    {
        DependencyObject oldElem = elem; 
        if (elem == null)
        {
            throw new ArgumentNullException( "elem" );
        } 
        if (uri == null)
        { 
            throw new ArgumentNullException( "uri" ); 
        }

        // Following the letter of the specification, the default namespace should take
        // precedence in the case of redundancy, so we check that first.
        if (DefaultNamespace(elem) == uri)
            return String.Empty; 

        while (null != elem) 
        { 
            XmlnsDictionary d = GetXmlnsDictionary(elem);
            if (null != d) 
            {
                // Search through all key/value pairs in the dictionary
                foreach (DictionaryEntry e in d)
                { 
                    if ((String)e.Value == uri && LookupNamespace(oldElem, (String)e.Key) == uri)
                    { 
                        return (String)e.Key; 
                    }
                } 
            }
            elem = LogicalTreeHelper.GetParent(elem);
        }
        return null; 
    }

    // Get the Default Namespace same as LookupNamespace(e,String.Empty); 
    /// <summary>
    /// Returns the default namespaceUri for the given DependencyObject 
    /// </summary>
    /// <param name="e">The element containing the namespace mappings to use in the lookup</param>
    /// <returns>The default namespaceUri for the given Element</returns>
    public static String DefaultNamespace(DependencyObject e) 
    {
        return LookupNamespace(e, String.Empty); 
    } 
//#endif

//#endregion Public Methods

//#region AttachedProperties

    /// <summary>
    /// xml:space Element property 
    /// </summary> 
//    [Browsable(false)]
//    [Localizability(LocalizationCategory.NeverLocalize)] 
    public static final DependencyProperty XmlSpaceProperty ;

    /// <summary>
    /// Return value of xml:space on the passed DependencyObject 
    /// </summary>
//    [DesignerSerializationOptions(DesignerSerializationOptions.SerializeAsAttribute)] 
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))] 
    public static String GetXmlSpace(DependencyObject dependencyObject)
    { 
        if (dependencyObject == null)
        {
            throw new ArgumentNullException( "dependencyObject" );
        } 

        return (String)dependencyObject.GetValue(XmlSpaceProperty); 
    } 

    /// <summary> 
    /// Set value of xml:space on the passed DependencyObject
    /// </summary>
    public static void SetXmlSpace(DependencyObject dependencyObject, String value)
    { 
        if (dependencyObject == null)
        { 
            throw new ArgumentNullException( "dependencyObject" ); 
        }

        dependencyObject.SetValue(XmlSpaceProperty, value);
    }

    /// <summary> 
    /// XmlnsDictionary Element property
    /// </summary> 
//    [Browsable(false)] 
    public static final DependencyProperty XmlnsDictionaryProperty ;

    /// <summary>
    /// Return value of XmlnsDictionary on the passed DependencyObject
    /// </summary>
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)] 
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))]
    public static XmlnsDictionary GetXmlnsDictionary(DependencyObject dependencyObject) 
    { 
        if (dependencyObject == null)
        { 
            throw new ArgumentNullException( "dependencyObject" );
        }

        return (XmlnsDictionary)dependencyObject.GetValue(XmlnsDictionaryProperty); 
    }

    /// <summary> 
    /// Set value of XmlnsDictionary on the passed DependencyObject
    /// </summary> 
    public static void SetXmlnsDictionary(DependencyObject dependencyObject, XmlnsDictionary value)
    {
        if (dependencyObject == null)
        { 
            throw new ArgumentNullException( "dependencyObject" );
        } 

        if (dependencyObject.IsSealed == false)
        { 
            dependencyObject.SetValue(XmlnsDictionaryProperty, value);
        }
    }

    /// <summary>
    /// XmlnsDefinition Directory property 
    /// </summary> 
//    [Browsable(false)]
    public static final DependencyProperty XmlnsDefinitionProperty ; 

    /// <summary>
    /// Return value of xmlns definition directory on the passed DependencyObject
    /// </summary> 
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
//    [DesignerSerializationOptions(DesignerSerializationOptions.SerializeAsAttribute)] 
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))] 
    public static String GetXmlnsDefinition(DependencyObject dependencyObject)
    { 
        if (dependencyObject == null)
        {
            throw new ArgumentNullException( "dependencyObject" );
        } 

        return (String)dependencyObject.GetValue(XmlnsDefinitionProperty); 
    } 

    /// <summary> 
    /// Set value of xmlns definition directory on the passed DependencyObject
    /// </summary>
    public static void SetXmlnsDefinition(DependencyObject dependencyObject, String value)
    { 
        if (dependencyObject == null)
        { 
            throw new ArgumentNullException( "dependencyObject" ); 
        }

        dependencyObject.SetValue(XmlnsDefinitionProperty, value);
    }

    /// <summary> 
    /// XmlNamespaceMaps that map xml namespace uri to assembly/clr namespaces
    /// </summary> 
//    [Browsable(false)] 
    public static final DependencyProperty XmlNamespaceMapsProperty ;

    /// <summary>
    /// Return value of XmlNamespaceMaps on the passed DependencyObject
    /// </summary>
    /// <remarks> 
    /// XmlNamespaceMaps map xml namespace uri to Assembly/CLR namespaces
    /// </remarks> 
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)] 
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))]
    public static String GetXmlNamespaceMaps(DependencyObject dependencyObject) 
    {
        if (dependencyObject == null)
        {
            throw new ArgumentNullException( "dependencyObject" ); 
        }

        return (String)dependencyObject.GetValue(XmlNamespaceMapsProperty); 
    }

    /// <summary>
    /// Set value of XmlNamespaceMaps on the passed DependencyObject
    /// </summary>
    /// <remarks> 
    /// XmlNamespaceMaps map xml namespace uri to Assembly/CLR namespaces
    /// </remarks> 
    public static void SetXmlNamespaceMaps(DependencyObject dependencyObject, String value) 
    {
        if (dependencyObject == null) 
        {
            throw new ArgumentNullException( "dependencyObject" );
        }

        dependencyObject.SetValue(XmlNamespaceMapsProperty, value);
    } 

//#endregion AttachedProperties

//#else
//    private XmlAttributeProperties()
//    {
//    } 

//#endif   // temporal PBT 

//#region Internal

    // Return the setter method info for XmlSpace
    /*internal*/ public static MethodInfo XmlSpaceSetter
    {
        get 
        {
            if (_xmlSpaceSetter == null) 
            { 
                _xmlSpaceSetter = typeof(XmlAttributeProperties).GetMethod("SetXmlSpace",
                                                 BindingFlags.Public | BindingFlags.Static); 
            }
            return _xmlSpaceSetter;
        }
    } 

    // These are special attributes that aren't mapped like other properties 
    /*internal*/ public static final String XmlSpaceString = "xml:space"; 
    /*internal*/ public static final String XmlLangString  = "xml:lang";
    /*internal*/ public static final String XmlnsDefinitionString = "xmlns"; 
    private static MethodInfo _xmlSpaceSetter = null;
//#endregion Internal
}