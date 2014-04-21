package org.summer.view.widget.data;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.UncommonField;
/// <summary> 
/// An UncommonField whose type is BindingExpression.
/// </summary> 
/*internal*/public class BindingExpressionUncommonField extends UncommonField<BindingExpression>
{
	/*internal*/public /*new*/ void SetValue(DependencyObject instance, BindingExpression bindingExpr)
    { 
        super.SetValue(instance, bindingExpr);
        bindingExpr.Attach(instance); 
    } 

	/*internal*/public /*new*/ void ClearValue(DependencyObject instance) 
    {
        BindingExpression bindingExpr = GetValue(instance);
        if (bindingExpr != null)
        { 
            bindingExpr.Detach();
        } 
        super.ClearValue(instance); 
    }
} 