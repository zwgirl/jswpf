package org.summer.view.widget.controls;

import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.data.IValueConverter;

///<summary>
/// AlternationConverter is intended to be used by a binding to the
/// ItemsControl.AlternationIndex attached property.  It converts an integer
/// into the corresponding item in Values list. 
/// </summary>
//[ContentProperty("Values")] 
public class AlternationConverter implements IValueConverter 
{
    ///<summary> 
    /// A list of values.
    ///<summary>
    public IList Values
    { 
        get { return _values; }
    } 

    ///<summary>
    /// Convert an integer to the corresponding value from the Values list. 
    ///</summary>
    public Object Convert (Object o, Type targetType, Object parameter, CultureInfo culture)
    {
        if (_values.Count > 0 && o instanceof Integer) 
        {
            int index = ((int)o) % _values.Count; 
            if (index < 0)  // Adjust for incorrect definition of the %-operator for negative arguments. 
                index += _values.Count;
            return _values[index]; 
        }

        return DependencyProperty.UnsetValue;
    } 

    ///<summary> 
    /// Convert an Object to the index in the Values list at which that Object appears. 
    /// If the Object is not in the Values list, return -1.
    ///</summary> 
    public Object ConvertBack(Object o, Type targetType, Object parameter, CultureInfo culture)
    {
        return _values.IndexOf(o);
    } 

    List<Object> _values = new List<Object>(); 
}