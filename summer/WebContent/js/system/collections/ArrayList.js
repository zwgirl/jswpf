/**
 * ArrayList
 */

define(["dojo/_base/declare", "system/Type", "collections/IList", "collections/IEnumerator"], 
		function(declare, Type, IList, IEnumerator){
	
	// Implements an enumerator for a ArrayList. The enumerator uses the
    // internal version number of the list to ensure that no modifications are
    // made to the list while an enumeration is in progress.
//    private sealed class 
    var ArrayListEnumerator = declare("ArrayListEnumerator", IEnumerator, {
    	constructor:function(/*ArrayList*/ list, /*int*/ index, /*int*/ count) {
            this.list = list; 
            startIndex = index; 
            this.index = index - 1;
            endIndex = this.index + count;  // last valid index 
            version = list._version;
            currentElement = null;
    	},
    	
//        public bool 
        MoveNext:function() { 
            if (version != list._version) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumFailedVersion));
            if (index < endIndex) {
                currentElement = list[++index];
                return true; 
            }
            else { 
                index = endIndex + 1; 
            }

            return false;
        },
//        public void 
        Reset:function() { 
            if (version != list._version) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumFailedVersion)); 
            index = startIndex - 1;
        }
        
    });
    
    Object.defineProperties(ArrayListEnumerator.prototype, {
//        public Object 
        Current: { 
            get:function() {
                if (this.index < this.startIndex) 
                    throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumNotStarted)); 
                else if (this.index > this.endIndex) {
                    throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumEnded)); 
                }
                return this.currentElement;
            }
        } 
    });
    
//  static Object 
    var dummyObject = {};
    
//    private sealed class 
    var ArrayListEnumeratorSimple =declare([IEnumerator], {
//        private ArrayList list;
//        private int index; 
//        private int version;
//        private Object currentElement; 
//        private bool isArrayList;
//        // this object is used to indicate enumeration has not started or has terminated 


        constructor:function(/*ArrayList*/ list) {
            this.list = list; 
            this.index = -1;
            this.version = list._version; 
            this.isArrayList = (list.GetType() == ArrayList.Type); 
            this.currentElement = dummyObject;
        },

//        public bool 
        MoveNext:function() { 
            if (this.version != this.list._version) { 
                throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumFailedVersion));
            } 

            if( this.isArrayList) {  // avoid calling virtual methods if we are operating on ArrayList to improve performance
                if (this.index < this.list.Count - 1) {
                	this.currentElement = this.list._items[++this.index]; 
                    return true;
                } 
                else { 
                	this.currentElement = dummyObject;
                	this.index =this.list.Count; 
                    return false;
                }
            }
            else { 
                if (this.index < this.list.Count - 1) {
                	this.currentElement = this.list[++this.index]; 
                    return true; 
                }
                else { 
                	this.index = list.Count;
                	this.currentElement = dummyObject;
                    return false;
                } 
            }
        },

//        public void 
        Reset:function() { 
            if (version != list._version) { 
                throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumFailedVersion));
            } 

            this.currentElement = dummyObject;
            this.index = -1;
        } 
    });
    
    Object.defineProperties(ArrayListEnumeratorSimple.prototype, {
//	    public Object 
    	Current: {
            get:function() { 
                var temp = this.currentElement;
                if(dummyObject == temp) { // check if enumeration has not started or has terminated
                    if (index == -1) {
                        throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumNotStarted)); 
                    }
                    else { 
                        throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumEnded)); 
                    }
                } 

                return temp;
            }
        } 
    });
    
    ArrayListEnumeratorSimple.Type = new Type("ArrayListEnumeratorSimple", ArrayListEnumeratorSimple, [IEnumerator.Type]);
    
	var ArrayList = declare("ArrayList", IList,{
		constructor:function(/*ICollection*/ c) {
            this._items = [];
            
            if (c !== undefined) {
                var count = c.Count;
                if (count > 0) 
                {
                    this.AddRange(c); 
                } 
            }
            
            this._version = 0;
		},
		
        Get:function(index) { 
            if (index < 0 || index >= this._items.length) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index")); 
            return this._items[index]; 
        },
        
        Set:function(index, value) {
            if (index < 0 || index >= this._items.length) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            this._items[index] = value;
            this._version++; 
        },
		

		
        // Returns an enumerator for this list with the given
        // permission for removal of elements. If modifications made to the list
        // while an enumeration is in progress, the MoveNext and
        // GetObject methods of the enumerator will throw an exception. 
        //
//        public virtual IEnumerator 
        GetEnumerator:function(/*int*/ index, /*int*/ count) { 
        	if(arguments.length ==0 ){
                return new ArrayListEnumeratorSimple(this);
        	}

            if (index < 0)
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum")); 
            if (count < 0) 
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (this._items.length - index < count) 
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
 
            return new ArrayListEnumerator(this, index, count);
        },
 
        // Returns the index of the first occurrence of a given value in a range of
        // this list. The list is searched forwards, starting at index 
        // startIndex and upto count number of elements. The 
        // elements of the list are compared to the given value using the
        // Object.Equals method. 
        //
        // This method uses the Array.IndexOf method to perform the
        // search.
        // 
//        public virtual int 
        IndexOf:function(/*Object*/ value, /*int*/ startIndex/*, int count*/) {
        	if(startIndex === undefined){
        		startIndex = 0;
        	}
            if (startIndex > this._items.length) 
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index")); 
            if (/*count <0 || */startIndex > this._items.length/* - count*/) throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_Count"));
            return this._items.indexOf(value, startIndex);
        },
 
        // Inserts an element into this list at a given index. The size of the list
        // is increased by one. If required, the capacity of the list is doubled 
        // before inserting the new element. 
        //
//        public virtual void 
        Insert:function(/*int*/ index, /*Object*/ value) { 
            // Note that insertions at the end are legal.
            if (index < 0 || index > this._items.length) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_ArrayListInsert"));

            this._items.splice(index, 0, value);
            this._size++;
            this._version++;
        }, 

        // Inserts the elements of the given collection at a given index. If 
        // required, the capacity of the list is increased to twice the previous 
        // capacity or the new size, whichever is larger.  Ranges may be added
        // to the end of the list by setting index to the ArrayList's size. 
        //
//        public virtual void 
        InsertRange:function(/*int*/ index, /*ICollection*/ c) {
            if (c==null)
                throw new ArgumentNullException("c", Environment.GetResourceString("ArgumentNull_Collection")); 
            if (index < 0 || index > this._items.length) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));

            var count = c.Count; 
            if (count > 0) {
                for(var i=0; i< count; i++){
                	this._items.push(c.Get(i));
                }
                
                this._version ++;
            } 
        },
 

        // Returns the index of the last occurrence of a given value in a range of
        // this list. The list is searched backwards, starting at index 
        // startIndex and upto count elements. The elements of
        // the list are compared to the given value using the Object.Equals 
        // method. 
        //
        // This method uses the Array.LastIndexOf method to perform the 
        // search.
        //
//        public virtual int 
        LastIndexOf:function(/*Object*/ value, /*int*/ startIndex/*, int count*/) {
        	if(startIndex === undefined){
        		startIndex = this._items.length - 1;
        	}
        	
            if (/*this.Count != 0 && (*/startIndex < 0 /*|| count < 0)*/) 
                throw new ArgumentOutOfRangeException((startIndex<0 ? "startIndex" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));

            if (this._items.length == 0)  // Special case for an empty list 
                return -1;

            if (startIndex >= this._items.length /*|| count > startIndex + 1*/)
                throw new ArgumentOutOfRangeException((startIndex>=this._items.length ? "startIndex" : "count"), Environment.GetResourceString("ArgumentOutOfRange_BiggerThanCollection")); 

            return this._items.lastIndexOf(value, startIndex);
        },
        
        // Adds the given object to the end of this list. The size of the list is
        // increased by one. If required, the capacity of the list is doubled 
        // before adding the new element.
        //
//        public /*virtual*/ int 
        Add:function(/*Object*/ value) {
            this._items.push(value); //[_size] = value; 
            this._version++; 
            return this._items.length;
        },
        
        // Clears the contents of ArrayList. 
//        public /*virtual*/ void 
        Clear:function() { 
        	this._items.length=0;
            this._version++; 
        },
        
        // Contains returns true if the specified element is in the ArrayList.
        // It does a linear, O(n) search.  Equality is determined by calling 
        // item.Equals().
        // 
//        public virtual bool 
        Contains:function(/*Object*/ item) { 
        	this._items.indexOf(item) != -1;
        },
        
        // Removes the element at the given index. The size of the list is
        // decreased by one.
        // 
//        public virtual void 
        Remove:function(/*Object*/ obj) {
            var index = this.IndexOf(obj);
            if (index >=0) 
                this.RemoveAt(index);
        }, 
 
        // Removes the element at the given index. The size of the list is
        // decreased by one. 
        //
//        public virtual void 
        RemoveAt:function(/*int*/ index) {
            if (index < 0 || index >= this._items.length) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
 
            this._items.splice(index, 1);
            this._version++; 
        },
 
        // Removes a range of elements from this list. 
        //
//        public virtual void 
        RemoveRange:function(/*int*/ index, /*int*/ count) { 
            if (index < 0)
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (count < 0)
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum")); 
            if (this._items.length - index < count)
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen")); 

            if (count > 0) {
                this._items.splice(index, count);
                this._version++; 
            }
        },
        
        // Reverses the elements in a range of this list. Following a call to this
        // method, an element in the range given by index and count 
        // which was previously located at index i will now be located at 
        // index index + (index + count - i - 1).
        // 
        // This method uses the Array.Reverse method to reverse the
        // elements.
        //
//        public virtual void 
        Reverse:function(/*int*/ index, /*int*/ count) { 
        	if(index === undefined){
        		index = 0;
        	}
        	
        	if(count === undefined){
        		count = this.Count;
        	}
        	
            if (index < 0)
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum")); 
            if (count < 0) 
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (this._items.length - index < count) 
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            this._items.reverse(index, count);
            this._version++; 
        },
 
        // Sets the elements starting at the given index to the elements of the 
        // given collection.
        // 
//        public virtual void 
        SetRange:function(/*int*/ index, /*ICollection*/ c) {
            if (c==null) throw new ArgumentNullException("c", Environment.GetResourceString("ArgumentNull_Collection"));
            var count = c.Count; 
            if (index < 0 || index > this._items.length - count) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
 
            if (count > 0) { 
                for(var i=0; i<count; i++){
                	this._items.splice(index, 0 ,c.Get(i));
                }
                this._version++; 
            }
        },
 
        // ToArray returns a new Object array containing the contents of the ArrayList.
        // This requires copying the ArrayList, which is an O(n) operation. 
//        public virtual Object[] 
        ToArray:function() {
            return this._items.slice(0, this._items.length);
        } 

	});
	
	Object.defineProperties(ArrayList.prototype,{
        // Read-only property describing how many elements are in the List. 
//        public virtual int 
        Count: 
        { 
            get:function() {
                return this._items.length;
            }
        },
 
//        public virtual bool 
        IsFixedSize: {
            get:function() { return false; } 
        }, 

 
        // Is this ArrayList read-only?
//        public virtual bool 
        IsReadOnly: {
            get:function() { return false; }
        } 

	});
	
	ArrayList.Type = new Type("ArrayList", ArrayList, [IList.Type]);
	return ArrayList;
});
