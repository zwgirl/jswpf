/**
 * ReadOnlyCollection
 */

define(["dojo/_base/declare", "system/Type", "collections/IList"], function(declare, Type, IList){
	var ReadOnlyCollection = declare("ReadOnlyCollection", IList,{
		constructor:function(/*IList<T>*/ list) {
            if (list == null) { 
                ThrowHelper.ThrowArgumentNullException(ExceptionArgument.list);
            }
            this.list = list;
        },
        
//        public T this[int index] { 
//            get { return list[index]; }
//        } 
        
        Get:function(index){
        	return this.list.Get(index);
        },
        
        Set:function(index, value) { 
            ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ReadOnlyCollection);
        },

//        public bool 
        Contains:function(/*T*/ value) {
            return this.list.Contains(value); 
        }, 

//        public void 
        CopyTo:function(/*T[]*/ array, /*int*/ index) { 
            this.list.CopyTo(array, index);
        },

//        public IEnumerator<T> 
        GetEnumerator:function() { 
            return this.list.GetEnumerator();
        }, 

//        public int 
        IndexOf:function(/*T*/ value) {
            return this.list.IndexOf(value);
        },
 
//        void ICollection<T>.
        Add:function(/*T*/ value) {
            ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ReadOnlyCollection); 
        }, 

//        void ICollection<T>.
        Clear:function() { 
            ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ReadOnlyCollection);
        },

//        void IList<T>.
        Insert:function(/*int*/ index, /*T*/ value) { 
            ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ReadOnlyCollection);
        },
 
//        bool ICollection<T>.
        Remove:function(/*T*/ value) {
            ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ReadOnlyCollection); 
            return false;
        },

//        void IList<T>.
        RemoveAt:function(/*int*/ index) { 
            ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ReadOnlyCollection);
        }, 
 
	});
	
	Object.defineProperties(ReadOnlyCollection.prototype,{
//	    public int 
	    Count: { 
	        get:function() { return this.list.Count; }
	    },
	    
//	    protected IList<T> 
	    Items: { 
	    	get:function() { 
	    		return this.list;
	        } 
	    },

//	    bool ICollection<T>.
	    IsReadOnly: {
	    	get:function() { return true; } 
	    },
	    
//        bool IList.
        IsFixedSize: { 
            get:function() { return true; }
        } 
	});
	
	Object.defineProperties(ReadOnlyCollection,{
		  
	});
	
	ReadOnlyCollection.Type = new Type("ReadOnlyCollection", ReadOnlyCollection, [IList.Type]);
	return ReadOnlyCollection;
});
 

  

 
