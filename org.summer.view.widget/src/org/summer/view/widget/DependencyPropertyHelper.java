package org.summer.view.widget;


/// <summary>
/// Helper class for miscellaneous framework-level features related 
/// to DependencyProperties.
/// </summary>
public class DependencyPropertyHelper
{ 
    /// <summary>
    /// Return the source of the value for the given property. 
    /// </summary> 
    public static ValueSource GetValueSource(DependencyObject dependencyObject, DependencyProperty dependencyProperty)
    { 
        if (dependencyObject == null)
            throw new ArgumentNullException("dependencyObject");
        if (dependencyProperty == null)
            throw new ArgumentNullException("dependencyProperty"); 

        dependencyObject.VerifyAccess(); 

        boolean hasModifiers, isExpression, isAnimated, isCoerced, isCurrent;
        BaseValueSourceInternal source = dependencyObject.GetValueSource(dependencyProperty, null, /*out*/ hasModifiers, /*out*/ isExpression, /*out*/ isAnimated, /*out*/ isCoerced, /*out*/ isCurrent); 

        return new ValueSource(source, isExpression, isAnimated, isCoerced, isCurrent);
    }
} 