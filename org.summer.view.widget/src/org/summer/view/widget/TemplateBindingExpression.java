package org.summer.view.widget;

import org.summer.view.widget.data.Expression;
import org.summer.view.widget.TemplateBindingExtension;
/// <summary>
/// A TemplateBinding is used in templates (e.g. ControlTemplate).  When the content of
/// a template is instantiated for inspection, the template bindings are represented with 
///  a TemplateBindingExpression.  (In this case, the expression returns the property's default
/// value.) 
/// </summary> 

//[TypeConverter(typeof(TemplateBindingExpressionConverter))] 
public class TemplateBindingExpression extends Expression
{
    private TemplateBindingExtension _templateBindingExtension;

    /*internal*/ public TemplateBindingExpression( TemplateBindingExtension templateBindingExtension )
    { 
        _templateBindingExtension = templateBindingExtension; 
    }


    /// <summary>
    /// Constructor for TemplateBindingExpression
    /// </summary> 
    public TemplateBindingExtension TemplateBindingExtension
    { 
        get { return _templateBindingExtension; } 
    }


    /// <summary>
    ///     Called to evaluate the Expression value
    /// </summary> 
    /// <param name="d">DependencyObject being queried</param>
    /// <param name="dp">Property being queried</param> 
    /// <returns>Computed value. Default (of the target) if unavailable.</returns> 
    /*internal*/ public /*override*/ Object GetValue(DependencyObject d, DependencyProperty dp)
    { 
        return dp.GetDefaultValue(d.DependencyObjectType);
    }


}