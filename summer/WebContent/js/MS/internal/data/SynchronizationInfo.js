/**
 * SynchronizationInfo
 */
//internal struct SynchronizationInfo 
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var SynchronizationInfo = declare("SynchronizationInfo", null,{
		constructor:function(/*object*/ context, /*CollectionSynchronizationCallback*/ callback)
	    {
	        if (callback == null) 
	        {
	            // 80% case:  no callback - use the context as target of lock(). 
	            // For this case, just store the context directly - we ask people 
	            // not to use a lock object that hold references.
	            this._context = context; 
	            this._callbackMethod = null;
	            this._callbackTarget = null;
	        }
	        else 
	        {
	            // General case: invoke the callback to gain access. 
	            // In this case, both the context and the callback's target 
	            // belong to the app and should not be kept alive by WPF.
	        	this._context = context; 
	        	this._callbackMethod = callback.Method;

	            // distinguish static methods (target = null) from methods whose
	            // target gets GC'd 
	            var target = callback.Target;
	            this._callbackTarget = (target != null)? target : ViewManager.StaticWeakRef; 
	        } 
	    },
	    
//	    public void 
	    AccessCollection:function(/*IEnumerable*/ collection, /*Action*/ accessMethod, /*bool*/ writeAccess) 
	    { 
	        if (this._callbackMethod != null)
	        { 
	            // make sure the callback's target is still available
	            var target = this._callbackTarget.Target;
	            if (target == null)
	                throw new InvalidOperationException(SR.Get(SRID.CollectionView_MissingSynchronizationCallback, collection)); 

	            // invoke the callback 
	            if (this._callbackTarget == ViewManager.StaticWeakRef) 
	                target = null;          // static method

	            var context = this._context;
	            this._callbackMethod.Invoke(target, [collection, context, accessMethod, writeAccess]);
	        } 
	        else
	        { 
	            accessMethod(collection);
	        } 
	    } 
	});
	
	Object.defineProperties(SynchronizationInfo.prototype,{
//	    public bool 
	    IsSynchronized:
	    {
	        get:function() { return this._context != null || this._callbackMethod != null; }
	    },
	    
//	    public bool 
	    IsAlive: 
	    {
	        get:function()
	        {
	            return (this._callbackMethod != null && this._callbackTarget.IsAlive) || 
	                    (this._callbackMethod == null && this._context != null);
	        } 
	    } 
	});
	
//  public static readonly SynchronizationInfo 
	SynchronizationInfo.None = new SynchronizationInfo(null, null);
	
	SynchronizationInfo.Type = new Type("SynchronizationInfo", SynchronizationInfo, [Object.Type]);
	return SynchronizationInfo;
});
