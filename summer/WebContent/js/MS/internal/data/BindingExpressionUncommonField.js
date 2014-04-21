/**
 * BindingExpressionUncommonField
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var BindingExpressionUncommonField = declare("BindingExpressionUncommonField", UncommonField,{
//		internal new void 
		SetValue:function(/*DependencyObject*/ instance, /*BindingExpression*/ bindingExpr)
        { 
			UncommonField.prototype.SetValue.call(this, instance, bindingExpr);
            bindingExpr.Attach(instance); 
        }, 

//        internal new void 
        ClearValue:function(/*DependencyObject*/ instance) 
        {
            /*BindingExpression*/var bindingExpr = this.GetValue(instance);
            if (bindingExpr != null)
            { 
                bindingExpr.Detach();
            } 
            UncommonField.prototype.ClearValue.call(this, instance); 
        }
	});
	
	BindingExpressionUncommonField.Type = new Type("BindingExpressionUncommonField", 
			BindingExpressionUncommonField, [UncommonField.Type]);
	return BindingExpressionUncommonField;
});


