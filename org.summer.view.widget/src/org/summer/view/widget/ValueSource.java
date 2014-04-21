package org.summer.view.widget;
/// <summary>
/// This struct contains the information returned from
/// DependencyPropertyHelper.GetValueSource.
/// </summary>
public class ValueSource
{
     ValueSource(BaseValueSourceInternal source, boolean isExpression, boolean isAnimated, boolean isCoerced, boolean isCurrent)
    {
        // this cast is justified because the public BaseValueSource enum
        // values agree with the internal BaseValueSourceInternal enum values.
        _baseValueSource = (BaseValueSource)source;

        _isExpression = isExpression;
        _isAnimated = isAnimated;
        _isCoerced = isCoerced;
        _isCurrent = isCurrent;
    }

    /// <summary>
    /// The base value source.
    /// </summary>
    public BaseValueSource BaseValueSource
    {
        get { return _baseValueSource; }
    }

    /// <summary>
    /// True if the value came from an Expression.
    /// </summary>
    public boolean IsExpression
    {
        get { return _isExpression; }
    }

    /// <summary>
    /// True if the value came from an animation.
    /// </summary>
    public boolean IsAnimated
    {
        get { return _isAnimated; }
    }

    /// <summary>
    /// True if the value was coerced.
    /// </summary>
    public boolean IsCoerced
    {
        get { return _isCoerced; }
    }

    /// <summary>
    /// True if the value was set by SetCurrentValue.
    /// </summary>
    public boolean IsCurrent
    {
        get { return _isCurrent; }
    }

//    #region Object overrides - required by FxCop

    /// <summary>
    /// Return the hash code for this ValueSource.
    /// </summary>
    public int GetHashCode()
    {
        return _baseValueSource.GetHashCode();
    }

    /// <summary>
    /// True if this ValueSource equals the argument.
    /// </summary>
    public boolean Equals(Object o)
    {
        if (o is ValueSource)
        {
            ValueSource that = (ValueSource)o;

            return  this._baseValueSource == that._baseValueSource &&
                    this._isExpression == that._isExpression &&
                    this._isAnimated == that._isAnimated &&
                    this._isCoerced == that._isCoerced;
        }
        else
        {
            return false;
        }
    }

    /// <summary>
    /// True if the two arguments are equal.
    /// </summary>
    public static boolean operator==(ValueSource vs1, ValueSource vs2)
    {
        return vs1.Equals(vs2);
    }

    /// <summary>
    /// True if the two arguments are unequal.
    /// </summary>
    public static boolean operator!=(ValueSource vs1, ValueSource vs2)
    {
        return !vs1.Equals(vs2);
    }

//    #endregion Object overrides - required by FxCop

    BaseValueSource _baseValueSource;
    boolean            _isExpression;
    boolean            _isAnimated;
    boolean            _isCoerced;
    boolean            _isCurrent;
}

    