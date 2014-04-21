package org.summer.view.widget.data;
/*internal*/ public class SourceDefaultValueConverter extends DefaultValueConverter implements IValueConverter
{ 
    //----------------------------------------------------- 
    //
    //  Constructors 
    //
    //-----------------------------------------------------

    public SourceDefaultValueConverter(TypeConverter typeConverter, Type sourceType, Type targetType, 
                                       boolean shouldConvertFrom, boolean shouldConvertTo, DataBindEngine engine)
        : base(typeConverter, sourceType, targetType, shouldConvertFrom, shouldConvertTo, engine) 
    { 
    }

    //-----------------------------------------------------
    //
    //  Interfaces (IValueConverter)
    // 
    //------------------------------------------------------


    public Object Convert(Object o, Type type, Object parameter, CultureInfo culture)
    { 
        return ConvertTo(o, _targetType, parameter as DependencyObject, culture);
    }

    public Object ConvertBack(Object o, Type type, Object parameter, CultureInfo culture) 
    {
        return ConvertFrom(o, _sourceType, parameter as DependencyObject, culture); 
    } 
}