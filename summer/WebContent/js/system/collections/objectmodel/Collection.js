/**
 * Collection
 */

define(["dojo/_base/declare", "system/Type", "collections/IList", "generic/List"], 
		function(declare, Type, IList, List){
	var Collection = declare("Collection", IList,{
//   	 	"-chains-": {
//	      constructor: "manual"
//	    },
	    
		constructor:function(list ){
			if(list===undefined || list == null){
				this.items = new List();
			}else{
	            this.items = list;
			}

		},
		
        Get:function(index) { return this.items.Get(index); },
        
        Set:function(index, value) {
        	this.SetItem(index, value);
        },
        

        Add:function(/*T*/ item) { 

            var index = this.items.Count;
            this.InsertItem(index, item);
        },

//        public void 
        Clear:function() { 
            this.ClearItems();
        }, 
 
//        public void 
        CopyTo:function(/*T[]*/ array, /*int*/ index) {
            this.items.CopyTo(array, index);
        },

//        public bool 
        Contains:function(/*T*/ item) { 
            return this.items.Contains(item);
        },

//        public IEnumerator<T> 
        GetEnumerator:function() { 
            return this.items.GetEnumerator();
        }, 
 
//        public int 
        IndexOf:function(/*T*/ item) {
            return this.items.IndexOf(item);
        },

//        public void 
        Insert:function(/*int*/ index, /*T*/ item) { 
            this.InsertItem(index, item); 
        }, 

//        public bool 
        Remove:function(/*T*/ item) { 
 
            var index = this.items.IndexOf(item);
            if (index < 0) return false; 
            this.RemoveItem(index); 
            return true;
        },

//        public void 
        RemoveAt:function(/*int*/ index) {

            this.RemoveItem(index);
        },
        
        
        ClearItems:function() {
        	this.items.Clear(); 
        },


        InsertItem:function(/*int*/ index, /*T*/ item) { 
        	this.items.Insert(index, item); 
        },
         
        RemoveItem:function(/*int*/ index) { 
        	this.items.RemoveAt(index);
        }, 
 
        SetItem:function(/*int*/ index, /*T*/ item) {
        	this.items.Set(index, item); 
        }

	});
	
	Object.defineProperties(Collection.prototype,{

//        public int 
        Count: { 
            get:function() { return this.items.Count; }
        }, 

//        protected IList<T> 
        Items: {
            get:function() { return this.items; }
        }, 
        
//        bool ICollection<T>.
        IsReadOnly:
        {
            get:function() { 
                return this.items.IsReadOnly;
            } 
        },
        

        IsFixedSize:
        { 
            get:function() {
                // There is no IList<T>.IsFixedSize, so we must assume that only 
                // readonly collections are fixed size, if our internal item 
                // collection does not implement IList.  Note that Array implements
                // IList, and therefore T[] and U[] will be fixed-size. 
                var list = this.items instanceof IList ? this.items: null;
                if(list != null)
                {
                    return list.IsFixedSize; 
                }
                return this.items.IsReadOnly; 
            } 
        }


	});
	
	Collection.Type = new Type("Collection", Collection, [IList.Type]);
	return Collection;
});

