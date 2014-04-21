package org.summer.view.widget.internal;

import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.Type;
import org.summer.view.widget.data.DataBindEngine;
import org.summer.view.widget.data.IValueConverter;
import org.summer.view.widget.model.TypeConverter;

/*internal*/ public class SourceDefaultValueConverter extends DefaultValueConverter implements IValueConverter
{ 
    //----------------------------------------------------- 
    //
    //  Constructors 
    //
    //-----------------------------------------------------

    public SourceDefaultValueConverter(TypeConverter typeConverter, Type sourceType, Type targetType, 
                                       boolean shouldConvertFrom, boolean shouldConvertTo, DataBindEngine engine)
       
    { 
    	 super(typeConverter, sourceType, targetType, shouldConvertFrom, shouldConvertTo, engine) ;
    }

    //-----------------------------------------------------
    //
    //  Interfaces (IValueConverter)
    // 
    //------------------------------------------------------


    public Object Convert(boolean o, Type type, Object parameter, CultureInfo culture)
    { 
        return ConvertTo(o, _targetType, parameter as DependencyObject, culture);
    }

    public Object ConvertBack(Object o, Type type, Object parameter, CultureInfo culture) 
    {
        return ConvertFrom(o, _sourceType, parameter as DependencyObject, culture); 
    } 
}
 
