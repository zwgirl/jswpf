package org.summer.view.widget.data;
/*internal*/ public class InterfaceConverter implements IValueConverter
{ 
    //----------------------------------------------------- 
    //
    //  Constructors 
    //
    //------------------------------------------------------

    /*internal*/ public InterfaceConverter(Type sourceType, Type targetType) 
    {
        _sourceType = sourceType; 
        _targetType = targetType; 
    }

    //-----------------------------------------------------
    //
    //  Interfaces (IValueConverter)
    // 
    //------------------------------------------------------

    public Object Convert(Object o, Type type, Object parameter, CultureInfo culture) 
    {
        return ConvertTo(o, _targetType); 
    }

    public Object ConvertBack(Object o, Type type, Object parameter, CultureInfo culture)
    { 
        return ConvertTo(o, _sourceType);
    } 

    private Object ConvertTo(Object o, Type type)
    { 
        return type.IsInstanceOfType(o) ? o : null;
    }

    Type _sourceType; 
    Type _targetType;
}