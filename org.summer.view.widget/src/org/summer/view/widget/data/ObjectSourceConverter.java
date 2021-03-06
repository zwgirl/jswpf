package org.summer.view.widget.data;
//
/*internal*/ public class ObjectSourceConverter : DefaultValueConverter, IValueConverter 
{
    //------------------------------------------------------
    //
    //  Constructors 
    //
    //----------------------------------------------------- 

    public ObjectSourceConverter(Type targetType, DataBindEngine engine) :
        base(null, typeof(Object), targetType, 
             true /* shouldConvertFrom */, false /* shouldConvertTo */, engine)
    {
    }

    //------------------------------------------------------
    // 
    //  Interfaces (IValueConverter) 
    //
    //------------------------------------------------------ 

    public Object Convert(Object o, Type type, Object parameter, CultureInfo culture)
    {
        // if types are compatible, just pass the value through 
        if ((o != null && _targetType.IsAssignableFrom(o.GetType())) ||
            (o == null && !_targetType.IsValueType)) 
            return o; 

        // if target type is string, use String.Format (string's type converter doesn't 
        // do it for us - boo!)
        if (_targetType == typeof(String))
            return String.Format(culture, "{0}", o);

        // otherwise, use system converter
        EnsureConverter(_targetType); 
        return ConvertFrom(o, _targetType, parameter as DependencyObject, culture); 
    }

    public Object ConvertBack(Object o, Type type, Object parameter, CultureInfo culture)
    {
        // conversion from any type to Object is easy
        return o; 
    }
}