/**
 * FrameworkContextData
 */

define(["dojo/_base/declare", "system/Type", "generic/List"], function(declare, Type, List){
	
//    private struct
    var WalkerEntry = declare(null, {
    	
    });
    Object.defineProperties(WalkerEntry.prototype, { 
//        public object 
        Data:
        {
        	get:function(){
        		return this._data;
        	},
        	set:function(value) {
        		this._data = value;
        	}
        }, // either the inheritable DP being invalidated, or the AncestorChangedDelegate, or the ResourceChangedDelegate
//        public DescendentsWalkerBase 
        Walker:
        {
        	get:function(){
        		return this._walker;
        	},
        	set:function(value) {
        		this._walker = value;
        	}
        } 
    });
    
	var FrameworkContextData = declare("FrameworkContextData", null,{
		constructor:function(){
			this._currentWalkers = new List/*<WalkerEntry>*/();
		},
		// 
        // Property Invalidation of Inheritable Properties
        // 
        // At the context level, we need to keep track of all inheritable property invalidations currently 
        // in action.  The reason that there can be multiple invalidations going on at the same time is because
        // an invalidation of one property can cause an invalidation of a different property.  The result is that 
        // the first invalidation *pauses* while the second invalidation is delivered to the tree.
        //
        // We keep track of these invalidations to be able to optimize a recursion of the same property
        // invalidation from an element to that element's children.  FrameworkElement.InvalidateTree will 
        // check the stack of walkers here and, if it finds a match, will conclude that a new DescendentsWalker
        // need not be spun up.  And there was much rejoicing. 
        // 

//        public void 
        AddWalker:function(/*object*/ data, /*DescendentsWalkerBase*/ walker) 
        {
            // push a new walker on the top of the stack
            /*WalkerEntry*/var walkerEntry = new WalkerEntry();
            walkerEntry.Data = data; 
            walkerEntry.Walker = walker;
 
            this._currentWalkers.Add(walkerEntry); 
        },
 
//        public void 
        RemoveWalker:function(/*object*/ data, /*DescendentsWalkerBase*/ walker)
        {
            // pop the walker off the top of the stack
            var last = this._currentWalkers.Count - 1; 
            this._currentWalkers.RemoveAt(last);
        },
 
//        public bool 
        WasNodeVisited:function(/*DependencyObject*/ d, /*object*/ data)
        { 
            // check to see if the given property on the given object is going to be visited by the 
            // DescendentsWalker on the top of the stack
            if (this._currentWalkers.Count > 0) 
            {
                var last = this._currentWalkers.Count - 1;

                var walkerEntry = this._currentWalkers.Get(last); 

                if (walkerEntry.Data == data) 
                { 
                    return walkerEntry.Walker.WasVisited(d);
                } 
            }

            return false;
        } 
	});
	
	Object.defineProperties(FrameworkContextData.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	var data = FrameworkContextData();
	
//	public static FrameworkContextData 
	FrameworkContextData.From = function(/*Dispatcher*/ context) 
    {
//        /*FrameworkContextData*/var data = context.Reserved2; 
//
//        if (data == null)
//        { 
//            data = new FrameworkContextData();
//            context.Reserved2 = data;
//        }

        return data;
    };
	
	FrameworkContextData.Type = new Type("FrameworkContextData", FrameworkContextData, [Object.Type]);
	return FrameworkContextData;
});
 


