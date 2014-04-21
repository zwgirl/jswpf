package org.summer.view.widget;
/// <summary>
///     Represents a Property-Value pair for local value enumeration 
/// </summary>
public class LocalValueEntry
{
    /// <summary> 
    /// Overrides Object.GetHashCode
    /// </summary> 
    /// <returns>An integer that represents the hashcode for this Object</returns> 
    public /*override*/ int GetHashCode()
    { 
        return super.GetHashCode();
    }

    /// <summary> 
    ///     Determine equality
    /// </summary> 
    public /*override*/ boolean Equals(Object obj) 
    {
        LocalValueEntry other = (LocalValueEntry) obj; 

        return (_dp == other._dp &&
                _value == other._value);
    } 

    /// <summary> 
    ///     Determine equality 
    /// </summary>
    public static boolean operator ==(LocalValueEntry obj1, LocalValueEntry obj2) 
    {
      return obj1.Equals(obj2);
    }

    /// <summary>
    ///     Determine inequality 
    /// </summary> 
    public static boolean operator !=(LocalValueEntry obj1, LocalValueEntry obj2)
    { 
      return !(obj1 == obj2);
    }

    /// <summary> 
    ///     Dependency property
    /// </summary> 
    public DependencyProperty Property 
    {
        get { return _dp; } 
    }

    /// <summary>
    ///     Value of the property 
    /// </summary>
    public Object Value 
    { 
        get { return _value; }
    } 

    /*internal*/ LocalValueEntry(DependencyProperty dp, Object value)
    {
        _dp = dp; 
        _value = value;
    } 

    // Internal here because we need to change these around when building
    //  the snapshot for the LocalValueEnumerator, and we can't make /*internal*/ 
    //  setters when we have public getters.
    /*internal*/ DependencyProperty _dp;
    /*internal*/ Object _value;
} 