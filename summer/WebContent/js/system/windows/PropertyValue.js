/**
 * from StyleHelper
 */
/**
 * PropertyValue
 */

define(["dojo/_base/declare", "system/Type", "windows/BaseValueSourceInternal", "windows/DeferredReference"], 
		function(declare, Type, BaseValueSourceInternal, DeferredReference){
	var PropertyValue = declare("PropertyValue", null,{
		constructor:function(){

		}
	});
	
	Object.defineProperties(PropertyValue.prototype,{
//        internal PropertyValueType  
        ValueType:
        {
        	get:function(){
        		return this._valueType;
        	},
        	set:function(value)
        	{
        		this._valueType = value;
        	}
        },
//        internal TriggerCondition[] 
        Conditions: 
        {
        	get:function(){
        		return this._conditions;
        	},
        	set:function(value)
        	{
        		this._conditions = value;
        	}
        },
//        internal string             
        ChildName:
        {
        	get:function(){
        		return this._childName;
        	},
        	set:function(value)
        	{
        		this._childName = value;
        	}
        },
//        internal DependencyProperty 
        Property: 
        {
        	get:function(){
        		return this._property;
        	},
        	set:function(value)
        	{
        		this._property = value;
        	}
        },
//        internal object             
        ValueInternal:
        {
        	get:function(){
        		return this._valueInternal;
        	},
        	set:function(value)
        	{
        		this._valueInternal = value;
        	}
        },
        
        /// <summary> 
        /// Sparkle uses this to query values on a FEF
        /// </summary>
//        internal object 
        Value:
        { 
            get:function()
            { 
                // Inflate the deferred reference if the value is one of those. 
                /*DeferredReference*/
            	var deferredReference = this.ValueInternal instanceof DeferredReference ? this.ValueInternal : null;
                if (deferredReference != null) 
                {
                    this.ValueInternal = deferredReference.GetValue(BaseValueSourceInternal.Unknown);
                }
 
                return this.ValueInternal;
            } 
        } 
	});
	
	PropertyValue.Type = new Type("PropertyValue", PropertyValue, [Object.Type]);
	return PropertyValue;
});

//// 
////  Property Values set on either Style or a TemplateNode or a 
////  Trigger are stored in structures of this type
//// 
//internal struct PropertyValue
//{
//    internal PropertyValueType  ValueType;
//    internal TriggerCondition[] Conditions; 
//    internal string             ChildName;
//    internal DependencyProperty Property; 
//    internal object             ValueInternal; 
//
//    /// <summary> 
//    /// Sparkle uses this to query values on a FEF
//    /// </summary>
//    internal object Value
//    { 
//        get
//        { 
//            // Inflate the deferred reference if the value is one of those. 
//            DeferredReference deferredReference = ValueInternal as DeferredReference;
//            if (deferredReference != null) 
//            {
//                ValueInternal = deferredReference.GetValue(BaseValueSourceInternal.Unknown);
//            }
//
//            return ValueInternal;
//        } 
//    } 
//}
