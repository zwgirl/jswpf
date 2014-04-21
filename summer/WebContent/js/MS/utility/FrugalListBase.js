/**
 * FrugalListBase
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	
	 // basic implementation - compacts in-place
//    internal class 
	var Compacter = declare(null, {
        constructor:function(/*FrugalListBase<T>*/ store, /*int*/ newCount)
        {
            this._store = store; 
            this._newCount = newCount;

//            protected int 
            thius._validItemCount = 0;
//            protected int 
            this._previousEnd = 0; 
        }, 

//        public void 
        Include:function(/*int*/ start, /*int*/ end)
        { 
//            Debug.Assert(start >= _previousEnd, "Arguments out of order during Compact");
//            Debug.Assert(_validItemCount + end - start <= _newCount, "Too many items copied during Compact");

            this.IncludeOverride(start, end); 

            this._previousEnd = end; 
        },

//        protected virtual void 
        IncludeOverride:function(/*int*/ start, /*int*/ end) 
        {
            // item-by-item move
            for (var i=start; i<end; ++i)
            { 
                this._store.SetAt(this._validItemCount++, this._store.EntryAt(i));
            } 
        },

//        public virtual FrugalListBase<T> 
        Finish:function() 
        {
            // clear out vacated entries
            var filler = null; //default(T);
            for (var i=this._validItemCount, n=this._store._count; i<n; ++i) 
            {
            	this._store.SetAt(i, filler); 
            } 

            this._store._count = this._validItemCount; 
            return this._store;
        }

    });
    
	var FrugalListBase = declare("FrugalListBase", Object,{
		constructor:function(){
			// The number of items in the list. 
//	        protected int 
			this._count = 0;
		},
		
	     // for use only by trusted callers - e.g. FrugalObjectList.Compacter 
//        internal void 
		TrustedSetCount:function(/*int*/ newCount)
        {
            this._count = newCount;
        },
//        public virtual Compacter 
		NewCompacter:function(/*int*/ newCount)
        { 
            return new Compacter(this, newCount);
        }
	});
	
	Object.defineProperties(FrugalListBase.prototype,{
        /// <summary> 
        /// Number of entries in this store 
        /// </summary>
        // Number of entries in this store 
//        public int 
		Count:
        {
            get:function()
            { 
                return this._count;
            } 
        } 
	});
	
	FrugalListBase.Type = new Type("FrugalListBase", FrugalListBase, [Object.Type]);
	
	FrugalListBase.Compacter = Compacter;
	return FrugalListBase;
}); 

    

