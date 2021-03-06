package org.summer.view.widget.data;
/*internal*/ public class ObjectTargetConverter : DefaultValueConverter, IValueConverter 
{
    //------------------------------------------------------ 
    //
    //  Constructors
    //
    //----------------------------------------------------- 

    public ObjectTargetConverter(Type sourceType, DataBindEngine engine) : 
        base(null, sourceType, typeof(Object), 
             true /* shouldConvertFrom */, false /* shouldConvertTo */, engine)
    { 
    }

    //-----------------------------------------------------
    // 
    //  Interfaces (IValueConverter)
    // 
    //----------------------------------------------------- 

    public Object Convert(Object o, Type type, Object parameter, CultureInfo culture) 
    {
        // conversion from any type to Object is easy
        return o;
    } 

    public Object ConvertBack(Object o, Type type, Object parameter, CultureInfo culture) 
    { 
        // if types are compatible, just pass the value through
        if (o == null && !_sourceType.IsValueType) 
            return o;

        if (o != null && _sourceType.IsAssignableFrom(o.GetType()))
            return o; 

        // if source type is string, use String.Format (string's type converter doesn't 
        // do it for us - boo!) 
        if (_sourceType == typeof(String))
            return String.Format(culture, "{0}", o); 

        // otherwise, use system converter
        EnsureConverter(_sourceType);
        return ConvertFrom(o, _sourceType, parameter as DependencyObject, culture); 
    }
} 