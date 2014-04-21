package org.summer.view.widget;
// 
//  This is a data-structure used to prevent threading issues while setting 
//  BindingValueType and ValueAsBindingValueType as separate members.
// 
/*internal*/ public  class BindingValueCache
{
    /*internal*/ public  BindingValueCache(Type bindingValueType, Object valueAsBindingValueType)
    { 
        BindingValueType = bindingValueType;
        ValueAsBindingValueType = valueAsBindingValueType; 
    } 

    /*internal*/ public  final Type   BindingValueType; 
    /*internal*/ public  final Object ValueAsBindingValueType;
}