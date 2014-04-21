package org.summer.view.widget;

import org.summer.view.widget.model.ITypeDescriptorContext;
import org.summer.view.widget.model.TypeConverter;

/// <summary> 
///     Class for converting a given DependencyProperty to and from a string
/// </summary>
public /*sealed*/ class SetterTriggerConditionValueConverter extends TypeConverter
{ 
//    #region Public Methods

    /// <summary> 
    ///     CanConvertFrom()
    /// </summary> 
    /// <param name="context">ITypeDescriptorContext</param>
    /// <param name="sourceType">type to convert from</param>
    /// <returns>true if the given type can be converted, false otherwise</returns>
    public /*override*/ boolean CanConvertFrom(ITypeDescriptorContext context, Type sourceType) 
    {
        // We can only convert from a string and that too only if we have all the contextual information 
        // Note: Sometimes even the serializer calls CanConvertFrom in order 
        // to determine if it is a valid converter to use for serialization.
        if (sourceType == typeof(string) || sourceType == typeof(byte[])) 
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
        return SetterTriggerConditionValueConverter.ResolveValue(context, null, culture, source);
    }
    //

    /// <summary>
    ///     ConvertTo() - Serialization purposes, returns the string from Command.Name by adding ownerType.FullName 
    /// </summary> 
    /// <param name="context">ITypeDescriptorContext</param>
    /// <param name="culture">CultureInfo</param> 
    /// <param name="value">the	Object to convert from</param>
    /// <param name="destinationType">the type to convert to</param>
    /// <returns>string Object, if the destination type is string</returns>
    public /*override*/ Object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, Object value, Type destinationType) 
    {
        throw GetConvertToException(value, destinationType); 
    } 

//    #endregion Public Methods 

    /*internal*/ public static Object ResolveValue(ITypeDescriptorContext serviceProvider,
        DependencyProperty property, CultureInfo culture, Object source)
    { 
        if (serviceProvider == null)
        { 
            throw new ArgumentNullException("serviceProvider"); 
        }
        if (source == null) 
        {
            throw new ArgumentNullException("source");
        }

        // Only need to type convert strings and byte[]
        if (!(source is byte[] || source is String || source is Stream)) 
        { 
            return source;
        } 

        IXamlSchemaContextProvider ixsc = (serviceProvider.GetService(typeof(IXamlSchemaContextProvider))
            as IXamlSchemaContextProvider);
        if (ixsc == null) 
        {
            throw new NotSupportedException(SR.Get(SRID.ParserCannotConvertPropertyValue, "Value", typeof(Object).FullName)); 
        } 
        XamlSchemaContext schemaContext = ixsc.SchemaContext;

        if (property != null)
        {
            //Get XamlMember from dp
            System.Xaml.XamlMember xamlProperty = 
                schemaContext.GetXamlType(property.OwnerType).GetMember(property.Name);
            if (xamlProperty == null) 
                xamlProperty = 
                    schemaContext.GetXamlType(property.OwnerType).GetAttachableMember(property.Name);

            System.Xaml.Schema.XamlValueConverter<TypeConverter> typeConverter = null;

            if (xamlProperty != null)
            { 
                // If we have a Baml2006SchemaContext and the property is of type Enum, we already know that the
                // type converter must be the EnumConverter. 
                if (xamlProperty.Type.UnderlyingType.IsEnum && schemaContext is Baml2006.Baml2006SchemaContext) 
                {
                    typeConverter = XamlReader.BamlSharedSchemaContext.GetTypeConverter(xamlProperty.Type.UnderlyingType); 
                }
                else
                {
                    typeConverter = xamlProperty.TypeConverter; 

                    if (typeConverter == null) 
                    { 
                        typeConverter = xamlProperty.Type.TypeConverter;
                    } 
                }
            }
            else
            { 
                typeConverter = schemaContext.GetXamlType(property.PropertyType).TypeConverter;
            } 


            // No Type converter case... 
            if (typeConverter.ConverterType == null)
            {
                return source;
            } 

            TypeConverter converter = null; 

            if (xamlProperty != null && xamlProperty.Type.UnderlyingType == typeof(Boolean))
            { 
                if (source is String)
                {
                    converter = new BooleanConverter();
                } 
                else if (source is byte[])
                { 
                    byte[] bytes = source as byte[]; 
                    if (bytes != null && bytes.Length == 1)
                    { 
                        return (bytes[0] != 0);
                    }
                    else
                    { 
                        throw new NotSupportedException(SR.Get(SRID.ParserCannotConvertPropertyValue, "Value", typeof(Object).FullName));
                    } 
                } 
                else
                { 
                    throw new NotSupportedException(SR.Get(SRID.ParserCannotConvertPropertyValue, "Value", typeof(Object).FullName));
                }
            }
            else 
            {
                converter = (TypeConverter)typeConverter.ConverterInstance; 
            } 

            return converter.ConvertFrom(serviceProvider, culture, source); 
        }
        else
        {
            return source; 
        }

    } 
}