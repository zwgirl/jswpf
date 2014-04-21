/**
 * DeferredResourceReferenceHolder
 */
/// <summary>
/// This signifies a DeferredResourceReference that is used as a place holder 
/// for the front loaded StaticResource within a deferred content section.
/// </summary>
define(["dojo/_base/declare", "system/Type", "windows/DeferredResourceReference"], 
		function(declare, Type, DeferredResourceReference){
	var DeferredResourceReferenceHolder = declare("DeferredResourceReferenceHolder", DeferredResourceReference,{
   	 	"-chains-": {
	      constructor: "manual"
	    },
		constructor:function(/*object*/ resourceKey, /*object*/ value) 
        { 
//			:base(null, null);
			DeferredResourceReference.prototype.constructor.call(this, null, null);
	
            this._keyOrValue = /*new object[]{*/[resourceKey, value];
        },
//        internal override object 
        GetValue:function(/*BaseValueSourceInternal*/ valueSource)
        { 
            return this.Value;
        },

        // Gets the type of the value it represents 
//        internal override Type 
        GetValueType:function()
        { 
            var value = this.Value; 
            return value != null ? value.GetType() : null;
        }
	});
	
	Object.defineProperties(DeferredResourceReferenceHolder.prototype,{
//		internal override object 
		Key: 
        { 
            get:function() { return /*((object[])*/this._keyOrValue[0]; }
        }, 

//        internal override object 
		Value:
        {
            get:function() { return /*((object[])*/this._keyOrValue[1]; },
            set:function(value) { /*((object[])*/this._keyOrValue[1] = value; }
        }, 
 
//        internal override bool 
		IsUnset:
        { 
            get:function() { return this.Value == Type.UnsetValue; }
        }  
	});
	
	DeferredResourceReferenceHolder.Type = new Type("DeferredResourceReferenceHolder", DeferredResourceReferenceHolder, 
			[DeferredResourceReference.Type]);
	return DeferredResourceReferenceHolder;
});
