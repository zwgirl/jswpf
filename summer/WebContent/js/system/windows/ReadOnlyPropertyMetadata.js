/**
 * ReadOnlyPropertyMetadata
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ReadOnlyPropertyMetadata = declare("ReadOnlyPropertyMetadata", PropertyMetadata,{
		constructor:function(/*object*/ defaultValue, 
                /*GetReadOnlyValueCallback*/ getValueCallback, 
                /*PropertyChangedCallback*/ propertyChangedCallback) 
//                base(defaultValue, propertyChangedCallback) 
		{
			this._getValueCallback = getValueCallback;
			PropertyMetadata.prototype.InitWithDVandPCCB.call(this, defaultValue, propertyChangedCallback);
		}
	});
	
	Object.defineProperties(ReadOnlyPropertyMetadata.prototype,{
//        internal override GetReadOnlyValueCallback 
        GetReadOnlyValueCallback:
        { 
            get:function() 
            {
                return this._getValueCallback; 
            }
        }
	});
	
	ReadOnlyPropertyMetadata.Type = new Type("ReadOnlyPropertyMetadata", ReadOnlyPropertyMetadata, [PropertyMetadata.Type]);
	return ReadOnlyPropertyMetadata;
});
 

