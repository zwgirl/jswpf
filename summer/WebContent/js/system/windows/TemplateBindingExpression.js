/**
 * TemplateBindingExpression
 */

define(["dojo/_base/declare", "system/Type", "windows/Expression", ], function(declare, Type, Expression){
	var TemplateBindingExpression = declare("TemplateBindingExpression", Expression,{
		constructor:function(/*TemplateBindingExtension*/ templateBindingExtension )
        { 
            this._templateBindingExtension = templateBindingExtension; 
        },
        
        /// <summary>
        ///     Called to evaluate the Expression value
        /// </summary> 
        /// <param name="d">DependencyObject being queried</param>
        /// <param name="dp">Property being queried</param> 
        /// <returns>Computed value. Default (of the target) if unavailable.</returns> 
//        internal override object 
        GetValue:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp)
        { 
            return dp.GetDefaultValue(d.DependencyObjectType);
        }
	});
	
	Object.defineProperties(TemplateBindingExpression.prototype,{
        /// <summary>
        /// Constructor for TemplateBindingExpression
        /// </summary> 
//        public TemplateBindingExtension 
        TemplateBindingExtension:
        { 
            get:function() { return this._templateBindingExtension; } 
        }
	});
	
	TemplateBindingExpression.Type = new Type("TemplateBindingExpression", TemplateBindingExpression, [Expression.Type]);
	return TemplateBindingExpression;
});
