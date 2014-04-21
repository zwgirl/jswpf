package org.summer.view.widget.markup;

import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.IServiceProvider;

/// <summary>
///     Class for converting a given DependencyProperty to and from a String
/// </summary>
public /*sealed*/ class DependencyPropertyConverter extends TypeConverter 
{
//    #region Public Methods 

    /// <summary>
    ///     CanConvertFrom() 
    /// </summary>
    /// <param name="context">ITypeDescriptorContext</param>
    /// <param name="sourceType">type to convert from</param>
    /// <returns>true if the given type can be converted, flase otherwise</returns> 
    public /*override*/ boolean CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
    { 
        // We can only convert from a String and that too only if we have all the contextual information 
        // Note: Sometimes even the serializer calls CanConvertFrom in order
        // to determine if it is a valid converter to use for serialization. 
        if (sourceType == typeof(String) || sourceType == typeof(byte[]))
        {
            return true;
        } 

        return false; 
    } 

    /// <summary> 
    ///     TypeConverter method /*override*/.
    /// </summary>
    /// <param name="context">ITypeDescriptorContext</param>
    /// <param name="destinationType">Type to convert to</param> 
    /// <returns>true if conversion is possible</returns>
    public /*override*/ boolean CanConvertTo(ITypeDescriptorContext context, Type destinationType) 
    { 
        return false;
    } 

    /// <summary>
    ///     ConvertFrom() -TypeConverter method /*override*/. using the givein name to return DependencyProperty
    /// </summary> 
    /// <param name="context">ITypeDescriptorContext</param>
    /// <param name="culture">CultureInfo</param> 
    /// <param name="source">Object to convert from</param> 
    /// <returns>instance of Command</returns>
    public /*override*/ Object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, Object source) 
    {
        if (context == null)
        {
            throw new ArgumentNullException("context"); 
        }

        if (source == null) 
        {
            throw new ArgumentNullException("source"); 
        }

        DependencyProperty property = ResolveProperty(context, null, source);

        if (property != null)
        { 
            return property; 
        }
        else 
        {
            throw GetConvertFromException(source);
        }
    } 

    /// <summary> 
    ///     ConvertTo() - Serialization purposes, returns the String from Command.Name by adding ownerType.FullName 
    /// </summary>
    /// <param name="context">ITypeDescriptorContext</param> 
    /// <param name="culture">CultureInfo</param>
    /// <param name="value">the	Object to convert from</param>
    /// <param name="destinationType">the type to convert to</param>
    /// <returns>String Object, if the destination type is String</returns> 
    public /*override*/ Object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, Object value, Type destinationType)
    { 
        throw GetConvertToException(value, destinationType); 
    }

//    #endregion Public Methods

    /*internal*/ public  static DependencyProperty ResolveProperty(IServiceProvider serviceProvider,
        String targetName, Object source) 
    {
        Type type = null; 
        String property = null; 

        DependencyProperty dProperty = source as DependencyProperty; 
        byte[] bytes;
        String value;
        if (dProperty != null)
        { 
            return dProperty;
        } 
        // If it's a byte[] we got it from BAML.  Let's resolve it using the schema context 
        else if ((bytes = source as byte[]) != null)
        { 
            Baml2006SchemaContext schemaContext = (serviceProvider.GetService(typeof(IXamlSchemaContextProvider))
                as IXamlSchemaContextProvider).SchemaContext as Baml2006SchemaContext;

            // Array with length of 2 means its an ID for a 
            // DependencyProperty in the Baml2006SchemaContext
            if (bytes.Length == 2) 
            { 
                short propId = (short)(bytes[0] | (bytes[1] << 8));

                return schemaContext.GetDependencyProperty(propId);
            }
            else
            { 
                // Otherwise it's a String with a TypeId encoded in front
                using (BinaryReader reader = new BinaryReader(new MemoryStream(bytes))) 
                { 
                    type = schemaContext.GetXamlType(reader.ReadInt16()).UnderlyingType;
                    property = reader.ReadString(); 
                }
            }
        }
        else if ((value = source as String) != null) 
        {
            value = value.Trim(); 
            // If it contains a . it means that it is a full name with type and property. 
            if (value.Contains("."))
            { 
                // Prefixes could have .'s so we take the last one and do a type resolve against that
                int lastIndex = value.LastIndexOf('.');
                String typeName = value.Substring(0, lastIndex);
                property = value.Substring(lastIndex + 1); 

                IXamlTypeResolver resolver = serviceProvider.GetService(typeof(IXamlTypeResolver)) 
                    as IXamlTypeResolver; 
                type = resolver.Resolve(typeName);
            } 
            else
            {
                // Only have the property name
                // Strip prefixes if there are any, v3 essentially discards the prefix in this case 
                int lastIndex = value.LastIndexOf(':');
                property = value.Substring(lastIndex + 1); 
            } 
        }
        else 
        {
            throw new NotSupportedException(SR.Get(SRID.ParserCannotConvertPropertyValue, "Property", typeof(DependencyProperty).FullName));
        }

        // We got additional info from either Trigger.SourceName or Setter.TargetName
        if (type == null && targetName != null) 
        { 
            IAmbientProvider ambientProvider = serviceProvider.GetService(typeof(IAmbientProvider))
                as System.Xaml.IAmbientProvider; 
            XamlSchemaContext schemaContext = (serviceProvider.GetService(typeof(IXamlSchemaContextProvider))
                as IXamlSchemaContextProvider).SchemaContext;

            type = GetTypeFromName(schemaContext, 
                ambientProvider, targetName);
        } 

        // Still don't have a Type so we need to loop up the chain and grab either Style.TargetType,
        // DataTemplate.DataType, or ControlTemplate.TargetType 
        if (type == null)
        {
            IXamlSchemaContextProvider ixscp = (serviceProvider.GetService(typeof(IXamlSchemaContextProvider))
                as IXamlSchemaContextProvider); 
            if (ixscp == null)
            { 
                throw new NotSupportedException(SR.Get(SRID.ParserCannotConvertPropertyValue, "Property", typeof(DependencyProperty).FullName)); 
            }
            XamlSchemaContext schemaContext = ixscp.SchemaContext; 

            XamlType styleXType = schemaContext.GetXamlType(typeof(Style));
            XamlType frameworkTemplateXType = schemaContext.GetXamlType(typeof(FrameworkTemplate));
            XamlType dataTemplateXType = schemaContext.GetXamlType(typeof(DataTemplate)); 
            XamlType controlTemplateXType = schemaContext.GetXamlType(typeof(ControlTemplate));

            List<XamlType> ceilingTypes = new List<XamlType>(); 
            ceilingTypes.Add(styleXType);
            ceilingTypes.Add(frameworkTemplateXType); 
            ceilingTypes.Add(dataTemplateXType);
            ceilingTypes.Add(controlTemplateXType);

            // We don't look for DataTemplate's DataType since we want to use the TargetTypeInternal instead 
            XamlMember styleTargetType = styleXType.GetMember("TargetType");
            XamlMember templateProperty = frameworkTemplateXType.GetMember("Template"); 
            XamlMember controlTemplateTargetType = controlTemplateXType.GetMember("TargetType"); 

            IAmbientProvider ambientProvider = serviceProvider.GetService(typeof(IAmbientProvider)) 
                as System.Xaml.IAmbientProvider;
            if (ambientProvider == null)
            {
                throw new NotSupportedException(SR.Get(SRID.ParserCannotConvertPropertyValue, "Property", typeof(DependencyProperty).FullName)); 
            }
            AmbientPropertyValue firstAmbientValue = ambientProvider.GetFirstAmbientValue(ceilingTypes, styleTargetType, 
                templateProperty, controlTemplateTargetType); 

            if (firstAmbientValue != null) 
            {
                if (firstAmbientValue.Value is Type)
                {
                    type = (Type)firstAmbientValue.Value; 
                }
                else if (firstAmbientValue.Value is TemplateContent) 
                { 
                    TemplateContent tempContent = firstAmbientValue.Value
                        as TemplateContent; 

                    type = tempContent.OwnerTemplate.TargetTypeInternal;
                }
                else 
                {
                    throw new NotSupportedException(SR.Get(SRID.ParserCannotConvertPropertyValue, "Property", typeof(DependencyProperty).FullName)); 
                } 
            }
        } 

        if (type != null && property != null)
        {
            return DependencyProperty.FromName(property, type); 
        }

        throw new NotSupportedException(SR.Get(SRID.ParserCannotConvertPropertyValue, "Property", typeof(DependencyProperty).FullName)); 
    }

    // Setters and triggers may have a sourceName which we need to resolve
    // This only works in templates and it works by looking up the mapping between
    // name and type in the template.  We use ambient lookup to find the Template property
    // and then query it for the type. 
    private static Type GetTypeFromName(XamlSchemaContext schemaContext,
        IAmbientProvider ambientProvider, 
        String target) 
    {
        XamlType frameworkTemplateXType = schemaContext.GetXamlType(typeof(FrameworkTemplate)); 
        XamlMember templateProperty = frameworkTemplateXType.GetMember("Template");

        AmbientPropertyValue ambientValue =
            ambientProvider.GetFirstAmbientValue(new XamlType[] { frameworkTemplateXType }, templateProperty); 
        TemplateContent templateHolder =
            ambientValue.Value as System.Windows.TemplateContent; 

        if (templateHolder != null)
        { 
            return templateHolder.GetTypeForName(target).UnderlyingType;
        }
        return null;
    } 
}