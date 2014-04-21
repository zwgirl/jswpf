package org.summer.view.widget;
// 
//  Property Values set on either Style or a TemplateNode or a 
//  Trigger are stored in structures of this type
// 
/*internal*/ public  class PropertyValue
{
    /*internal*/ public  PropertyValueType  ValueType;
    /*internal*/ public  TriggerCondition[] Conditions; 
    /*internal*/ public  String             ChildName;
    /*internal*/ public  DependencyProperty Property; 
    /*internal*/ public  Object             ValueInternal; 

    /// <summary> 
    /// Sparkle uses this to query values on a FEF
    /// </summary>
    /*internal*/ public  Object Value
    { 
        get
        { 
            // Inflate the deferred reference if the value is one of those. 
            DeferredReference deferredReference = ValueInternal as DeferredReference;
            if (deferredReference != null) 
            {
                ValueInternal = deferredReference.GetValue(BaseValueSourceInternal.Unknown);
            }

            return ValueInternal;
        } 
    } 
}