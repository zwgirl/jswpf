/**
 * From SystemResources
 * DeferredResourceReference
 */

define(["dojo/_base/declare", "system/Type", "windows/DeferredReference"], 
		function(declare, Type, DeferredReference){
	var DeferredResourceReference = declare("DeferredResourceReference", DeferredReference,{
		constructor:function(/*ResourceDictionary*/ dictionary, /*object*/ key) 
	    { 
	        this._dictionary = dictionary;
	        this._keyOrValue = key;
	        
//	        private WeakReferenceList 
	        this._inflatedList = null; 
		},
		
//		internal override object 
		GetValue:function(/*BaseValueSourceInternal*/ valueSource) 
	    {
	        // If the _value cache is invalid fetch the value from 
	        // the dictionary else just retun the cached value
	        if (this._dictionary != null)
	        {
	            var canCache; 
	            var canCacheOut = {"canCache" : null};
	            var value  = this._dictionary.GetValue(_keyOrValue, /*out canCache*/canCacheOut);
	            canCache = canCacheOut.canCache;
	            if (canCache) 
	            { 
	                // Note that we are replacing the _keyorValue field
	                // with the value and nuking the _dictionary field. 
	            	this._keyOrValue = value;
	            	this.RemoveFromDictionary();
	            }

	            // Freeze if this value originated from a style or template
	            var freezeIfPossible = 
	                valueSource == BaseValueSourceInternal.ThemeStyle || 
	                valueSource == BaseValueSourceInternal.ThemeStyleTrigger ||
	                valueSource == BaseValueSourceInternal.Style || 
	                valueSource == BaseValueSourceInternal.TemplateTrigger ||
	                valueSource == BaseValueSourceInternal.StyleTrigger ||
	                valueSource == BaseValueSourceInternal.ParentTemplate ||
	                valueSource == BaseValueSourceInternal.ParentTemplateTrigger; 

	            // This is to freeze values produced by deferred 
	            // references within styles and templates 
	            if (freezeIfPossible)
	            { 
	                StyleHelper.SealIfSealable(value);
	            }

	            // tell any listeners (e.g. ResourceReferenceExpressions) 
	            // that the value has been inflated
	            this.OnInflated(); 

	            return value;
	        } 

	        return this._keyOrValue;
	    },

	    // Tell the listeners that we're inflated.
//	    private void 
	    OnInflated:function() 
	    { 
	        if (this._inflatedList != null)
	        { 
	            for(var i=0; i<this._inflatedList.Count; i++) //foreach (ResourceReferenceExpression listener in _inflatedList)
	            {
	                listener.OnDeferredResourceInflated(this);
	            } 
	        }
	    }, 

	    // Gets the type of the value it represents
//	    internal override Type 
	    GetValueType:function() 
	    {
	        if (this._dictionary != null)
	        {
	            // Take a peek at the element type of the ElementStartRecord 
	            // within the ResourceDictionary's deferred content.
	            var foundOut = {"found" : null};
	            return this._dictionary.GetValueType(this._keyOrValue, /*out found*/foundOut); 
	        }
	        else 
	        {
	            return this._keyOrValue != null ? this._keyOrValue.GetType() : null;
	        }
	    },

	    // remove this DeferredResourceReference from its ResourceDictionary 
//	    internal virtual void 
	    RemoveFromDictionary:function() 
	    {
	        if (this._dictionary != null) 
	        {
	        	this._dictionary.DeferredResourceReferences.Remove(this);
	        	this._dictionary = null;
	        } 
	    },

//	    internal virtual void 
	    AddInflatedListener:function(/*ResourceReferenceExpression*/ listener) 
	    {
	        if (this._inflatedList == null) 
	        {
	        	this._inflatedList = new WeakReferenceList(this);
	        }
	        this._inflatedList.Add(listener); 
	    },

//	    internal virtual void 
	    RemoveInflatedListener:function(/*ResourceReferenceExpression*/ listener) 
	    {
//	        Debug.Assert(_inflatedList != null); 

	        if (this._inflatedList != null)
	        {
	        	this._inflatedList.Remove(listener); 
	        }
	    } 
	});
	
	Object.defineProperties(DeferredResourceReference.prototype,{
//		internal virtual object 
		Key:
	    { 
	        get:function() { return this._keyOrValue; }
	    }, 

//	    internal ResourceDictionary 
	    Dictionary:
	    { 
	        get:function() { return _dictionary; },
	        set:function(value) { this._dictionary = value; }
	    },

//	    internal virtual object 
	    Value:
	    { 
	        get:function() { return this._keyOrValue; },
	        set:function(value) { this._keyOrValue = value; }
	    }, 

//	    internal virtual bool 
	    IsUnset:
	    {
	        get:function() { return false; } 
	    },

//	    internal bool 
	    IsInflated: 
	    {
	        get:function() { return (this._dictionary == null); } 
	    }  
	});
	
	Object.defineProperties(DeferredResourceReference,{
		  
	});
	
	DeferredResourceReference.Type = new Type("DeferredResourceReference", DeferredResourceReference, [DeferredReference.Type]);
	return DeferredResourceReference;
});
