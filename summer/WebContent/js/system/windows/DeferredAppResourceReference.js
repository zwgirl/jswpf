/**
 * DeferredAppResourceReference
 */

define(["dojo/_base/declare", "system/Type", "windows/DeferredResourceReference"], 
		function(declare, Type, DeferredResourceReference){
	var DeferredAppResourceReference = declare("DeferredAppResourceReference", DeferredResourceReference,{
		constructor:function(/*ResourceDictionary*/ dictionary, /*object*/ resourceKey){
//			: base(dictionary, resourceKey)
		},
//	    internal override object 
//		GetValue:function(/*BaseValueSourceInternal*/ valueSource) 
//	    {
//	        lock (((ICollection)Application.Current.Resources).SyncRoot)
//	        {
//	            return base.GetValue(valueSource); 
//	        }
//	    }, 

	    // Gets the type of the value it represents
//	    internal override Type 
//	    GetValueType() 
//	    {
//	        lock (((ICollection)Application.Current.Resources).SyncRoot)
//	        {
//	            return base.GetValueType(); 
//	        }
//	    } 
	});
	
	DeferredAppResourceReference.Type = new Type("DeferredAppResourceReference", DeferredAppResourceReference, 
			[DeferredResourceReference.Type]);
	return DeferredAppResourceReference;
});


	