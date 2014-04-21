package org.summer.view.widget.data;

import org.summer.view.widget.Type;
/*internal*/ public /*sealed*/ class AccessorInfo
    {
        /*internal*/ public AccessorInfo(Object accessor, Type propertyType, Object[] args)
        { 
            _accessor = accessor;
            _propertyType = propertyType; 
            _args = args; 
        }
 
        /*internal*/ public Object     Accessor        { get { return _accessor; } }
        /*internal*/ public Type       PropertyType    { get { return _propertyType; } }
        /*internal*/ public Object[]   Args            { get { return _args; } }
 
        /*internal*/ public int Generation { get { return _generation; } set { _generation = value; } }
 
        Object      _accessor;          // DP, PD, or PI 
        Type        _propertyType;      // type of the property
        Object[]    _args;              // args for indexed property 
        int         _generation;        // used for discarding aged entries
    }
