package org.summer.view.widget.data;
public enum Feature 
{
    // BindingExressionBase 
    ParentBindingExpressionBase, 
    ValidationError,
    NotifyDataErrors, 
    EffectiveStringFormat,
    EffectiveTargetNullValue,
    BindingGroup,
    Timer, 
    UpdateTargetOperation,

    // BindingExpression 
    Converter,
    SourceType, 
    DataProvider,
    CollectionViewSource,
    DynamicConverter,
    DataErrorValue, 

    // MultiBindingExpression 

    // PriorityBindingExpression

    // Sentinel, for error checking.   Must be last.
    LastFeatureId
}