package org.summer.view.widget;




//[FriendAccessAllowed] // Built into Base, also used by Core & Framework.
/*internal*/public class ModifiedValue
{
//    #region InternalProperties 

    /*internal*/ Object BaseValue 
    { 
        get
        { 
            BaseValueWeakReference wr = _baseValue as BaseValueWeakReference;
            return (wr != null) ? wr.Target : _baseValue;
        }
        set { _baseValue = value; } 
    }

    /*internal*/ public Object ExpressionValue 
    {
        get { return _expressionValue; } 
        set { _expressionValue = value; }
    }

    /*internal*/ Object AnimatedValue 
    {
        get { return _animatedValue; } 
        set { _animatedValue = value; } 
    }

    /*internal*/ Object CoercedValue
    {
        get { return _coercedValue; }
        set { _coercedValue = value; } 
    }

    /*internal*/ void SetBaseValue(Object value, boolean useWeakReference) 
    {
        _baseValue = (useWeakReference && !value.GetType().IsValueType) 
                    ? new BaseValueWeakReference(value)
                    : value;
    }

//    #endregion InternalProperties
//
//    #region Data 

    private Object _baseValue; 
    private Object _expressionValue;
    private Object _animatedValue;
    private Object _coercedValue;



//    #endregion Data
} 