/**
 * DeferredThemeResourceReference
 */

define(["dojo/_base/declare", "system/Type", "windows/DeferredResourceReference", "windows/SystemResources"], 
		function(declare, Type, DeferredResourceReference, SystemResources){
	var DeferredThemeResourceReference = declare("DeferredThemeResourceReference", DeferredResourceReference,{
		constructor:function(/*ResourceDictionary*/ dictionary, /*object*/ resourceKey, /*bool*/ canCacheAsThemeResource){
//			:base(dictionary, resourceKey) 
	        this._canCacheAsThemeResource = canCacheAsThemeResource; 
		},
//		 internal override object 
		GetValue:function(/*BaseValueSourceInternal*/ valueSource) 
        {
//            lock (SystemResources.ThemeDictionaryLock) 
//            {
                // If the value cache is invalid fetch the value from
                // the dictionary else just retun the cached value
                if (this.Dictionary != null) 
                {
                    var canCache = false; 
                    var key = Key; 
                    var value;
 
                    SystemResources.IsSystemResourcesParsing = true;

                    try
                    { 
                    	var canCacheOut = {"canCache" : canCache};
                        value = Dictionary.GetValue(key, /*out canCache*/canCacheOut);
                        canCache = canCacheOut.canCache;
                        if (canCache) 
                        { 
                            // Note that we are replacing the _keyorValue field
                            // with the value and nuking the _dictionary field. 
                            this.Value = value;
                            this.Dictionary = null;
                        }
                    } 
                    finally
                    { 
                        SystemResources.IsSystemResourcesParsing = false; 
                    }
 
                    // Only cache keys that would be located by FindResourceInternal
                    if ((key instanceof Type || key instanceof ResourceKey) && this._canCacheAsThemeResource && canCache)
                    {
                        SystemResources.CacheResource(key, value, false /*isTraceEnabled*/); 
                    }
 
                    return value; 
                }
 
                return Value;
//            }
        },
 
        // Gets the type of the value it represents
//        internal override Type 
//        GetValueType:function() 
//        { 
//            lock (SystemResources.ThemeDictionaryLock)
//            { 
//                return base.GetValueType();
//            }
//        }
 
        // remove this DeferredResourceReference from its ResourceDictionary
//        internal override void 
        RemoveFromDictionary:function() 
        { 
            // DeferredThemeResourceReferences are never added to the dictionary's
            // list of deferred references, so they don't need to be removed. 
        }
	});
	
	DeferredThemeResourceReference.Type = new Type("DeferredThemeResourceReference", DeferredThemeResourceReference, 
			[DeferredResourceReference.Type]);
	return DeferredThemeResourceReference;
});
