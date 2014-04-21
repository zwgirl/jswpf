/**
 * DeferredSelectedIndexReference
 */

define(["dojo/_base/declare", "system/Type", "windows/DeferredReference"], 
		function(declare, Type, DeferredReference){
	var DeferredSelectedIndexReference = declare("DeferredSelectedIndexReference", DeferredReference,{
		constructor:function(/*Selector*/ selector) 
        {
            this._selector = selector;
        },
        
        // Does the real work to calculate the current SelectedIndexProperty value. 
//        internal override object 
        GetValue:function(/*BaseValueSourceInternal*/ valueSource) 
        {
            return this._selector.InternalSelectedIndex; 
        },
        
        // Gets the type of the value it represents
//        internal override Type 
        GetValueType:function() 
        {
            return Number.Type; //typeof(int); 
        } 
	});
	
	DeferredSelectedIndexReference.Type = new Type("DeferredSelectedIndexReference", 
			DeferredSelectedIndexReference, [DeferredReference.Type]);
	return DeferredSelectedIndexReference;
});

