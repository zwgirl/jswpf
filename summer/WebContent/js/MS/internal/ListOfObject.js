/**
 * ListOfObject
 */

define(["dojo/_base/declare", "system/Type", "collections/IList"], 
		function(declare, Type, IList){
//    class 
	var ObjectEnumerator =declare(IEnumerator,{
        constructor:function(/*IList*/ list)
        { 
            this._ie = list.GetEnumerator();
        }, 

//        void IDisposable.
        Dispose:function()
        {
        	this._ie = null;
        }, 

//        bool IEnumerator.
        MoveNext:function() 
        { 
            return this._ie.MoveNext();
        }, 

//        void IEnumerator.
        Reset:function()
        {
        	this._ie.Reset(); 
        }

    });
	
	Object.defineProperties(ObjectEnumerator.prototype, {
//        object IEnumerator.
		Current:
        {
            get:function() { return this._ie.Current; }
        } 
	});
    
	var ListOfObject = declare("ListOfObject", IList,{
		constructor:function(/*IList*/ list) 
        {
            if (list == null) 
                throw new ArgumentNullException("list"); 
            this._list = list;
        } ,
		
//        int IList<object>.
        IndexOf:function(/*object*/ item) 
        {
            return this._list.IndexOf(item); 
        }, 

//        void IList<object>.
        Insert:function(/*int*/ index, /*object*/ item) 
        {
            throw new NotImplementedException();
        },
 
//        void IList<object>.
        RemoveAt:function(/*int*/ index)
        { 
            throw new NotImplementedException(); 
        },
 
        Get:function(index)
        { 
            return this._list.Get(index);
        }, 
        Set:function(index, value)
        {
            throw new NotImplementedException(); 
        },
 
//        void ICollection<object>.
        Add:function(/*object*/ item)
        { 
            throw new NotImplementedException();
        },

//        void ICollection<object>.
        Clear:function() 
        {
            throw new NotImplementedException(); 
        }, 

//        bool ICollection<object>.
        Contains:function(/*object*/ item) 
        {
            return _list.Contains(item);
        },
 
//        void ICollection<object>.
        CopyTo:function(/*object[]*/ array, /*int*/ arrayIndex)
        { 
            this._list.CopyTo(array, arrayIndex); 
        },
 
//        bool ICollection<object>.
        Remove:function(/*object*/ item)
        {
            throw new NotImplementedException(); 
        },

//        IEnumerator<object> IEnumerable<object>.
        GetEnumerator:function()
        {
            return new ObjectEnumerator(this._list); 
        }
	});
	
	Object.defineProperties(ListOfObject.prototype,{
//        int ICollection<object>.
		Count:
        {
            get:function() { return this._list.Count; }
        }, 

//        bool ICollection<object>.
        IsReadOnly: 
        { 
            get:function() { return true; }
        }   
	});
	
	Object.defineProperties(ListOfObject,{
		  
	});
	
	ListOfObject.Type = new Type("ListOfObject", ListOfObject, [IList.Type]);
	return ListOfObject;
});

        
 


