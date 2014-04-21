package org.summer.view.widget.internal;

/*internal*/ public class SecurityCriticalDataForSet<T>
{
    /// <SecurityNote>
    ///    Critical - "by definition" - this class is intended only for data that's 
    ///               Critical for setting.
    /// </SecurityNote> 
    /*internal*/ public SecurityCriticalDataForSet(T value)
    { 
        _value = value;
    }

    /// <SecurityNote> 
    ///    Critical - Setter is Critical "by definition" - this class is intended only
    ///               for data that's Critical for setting. 
    ///     Safe - get is safe by definition. 
    ///     Not Safe - set is not safe by definition.
    /// </SecurityNote> 
    /*internal*/ public T Value
    {
        get 
        {
            return _value; 
        }

        set 
        {
            _value = value; 
        }
    }

    /// <SecurityNote> 
    /// Critical - by definition as this data is Critical for set.
    /// </SecurityNote>> 
    private T _value;
}

