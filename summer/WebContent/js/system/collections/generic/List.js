/**
 * List
 */
//Implements a variable-size List that uses an array of objects to store the
// elements. A List has a capacity, which is the allocated length 
// of the internal array. As elements are added to a List, the capacity
// of the List is automatically increased as required by reallocating the
// internal array.
// 
define(["dojo/_base/declare", "system/Type", "collections/IList", "collections/IEnumerable", 
        "collections/IEnumerator"], 
		function(declare, Type, IList, IEnumerable,
				IEnumerator){
	
    var Enumerator = declare("Enumerator", IEnumerator,{
    	 "-chains-": {
    	      constructor: "manual"
    	    },
    	constructor:function(list) { 
            this.list = list;
            this.index = 0; 
            this.version = list._version;
            this.current = null;
    		
    	},

//        public void 
    	Dispose:function() {
        }, 

//        public bool 
        MoveNext:function() {

            var localList = this.list; 

            if (this.version == localList._version && (this.index < localList._size)) 
            { 
                current = localList._items[index];
                this.index++; 
                return true;
            }
            return this.MoveNextRare();
        }, 
//        private bool 
        MoveNextRare:function() 
        { 
            if (this.version != this.list._version) {
                throw new Error('InvalidOperationException'); 
            }

            this.index = this.list._size + 1;
            this.current = null; 
            return false;
        },


        Reset:function() {
            if (this.version != this.list._version) { 
                throw new Error('InvalidOperationException'); 
            }

            this.index = 0;
            this.current = null;
        }
        
    });
    
    Object.defineProperties(Enumerator ,{
//      public T 
        Current:
        {
            get:function() { 
                if( this.index == 0 || this.index == this.list._size + 1) { 
                    ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumOpCantHappen);
               } 
                return this.current;
            }
        }
    });
    
    Enumerator.Type = new Type("Enumerator", Enumerator, [IEnumerator.Type]);
    
//    private const int 
    var _defaultCapacity = 4;

	var List = declare("List", IList,{
		constructor:function(/*IEnumerable<T> or int*/ arg ){
			this._items = [];
			this._size = 0;
			this._version = 0;
			if(arguments.length ==1){
				if(arg instanceof IEnumerable){
		            var c = arg instanceof ICollection ?arg : null;
		            if( c != null) {
		            	this._size = c.Count; 
		            	for(var i=0; i<this._size; i++){
		            		this._items[i] = c.Get(i);
		            	}
		            } else { 
		                var en = arg.GetEnumerator();
		                while(en.MoveNext()) {
		                	this.Add(en.Current); 
		                }
		            } 
				}else{
					this._items.length = arg;
				}
			}
		},

        Get:function(/*int*/ index) {
            // Following trick can reduce the range check by one 
            if (index >=this._size) {
                throw new Error("ThrowArgumentOutOfRangeException()"); 
            } 
            return this._items[index]; 
        },
        
        
        Get:function(/*int*/ index) {
            // Following trick can reduce the range check by one 
            if (this.index >= this._size) {
                ThrowHelper.ThrowArgumentOutOfRangeException(); 
            } 
            return this._items[index]; 
        },

        Set:function(index, value) { 
            if (index >= this._size) { 
                ThrowHelper.ThrowArgumentOutOfRangeException();
            } 
            this._items[index] = value;
            this._version++;
        }, 
        
        // Adds the given object to the end of this list. The size of the list is
        // increased by one. If required, the capacity of the list is doubled
        // before adding the new element. 
        //
//        public void
        Add:function(/*T*/ item) { 
           	if(item == null || item === undefined){
        		throw new Error("item may not be null!");
        	}
           	
            if (this._size == this._items.length) this.EnsureCapacity(this._size + 1); 
            this._items[this._size++] = item;
            this._version++; 
            
            return this.Count - 1;
        },

        // Adds the elements of the given collection to the end of this list. If 
        // required, the capacity of the list is increased to twice the previous
        // capacity or the new size, whichever is larger.
        //
//        public void 
        AddRange:function(/*IEnumerable<T>*/ collection) { 
            this.InsertRange(this._size, collection); 
        },

//        public ReadOnlyCollection<T> 
        AsReadOnly:function() {
            return new ReadOnlyCollection/*<T>*/(this);
        }, 
        
     // Searches a section of the list for a given element using a binary search 
        // algorithm. Elements of the list are compared to the search value using 
        // the given IComparer interface. If comparer is null, elements of
        // the list are compared to the search value using the IComparable 
        // interface, which in that case must be implemented by all elements of the
        // list and the given search value. This method assumes that the given
        // section of the list is already sorted; if this is not the case, the
        // result will be incorrect. 
        //
        // The method returns the index of the given value in the list. If the 
        // list does not contain the given value, the method returns a negative 
        // integer. The bitwise complement operator (~) can be applied to a
        // negative result to produce the index of the first element (if any) that 
        // is larger than the given search value. This is also the index at which
        // the search value should be inserted into the list in order for the list
        // to remain sorted.
        // 
        // The method uses the Array.BinarySearch method to perform the
        // search. 
        // 
//        public int 
        BinarySearch:function(/*int*/ index, /*int*/ count, /*T*/ item, /*IComparer<T>*/ comparer) {
            if (index < 0) 
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
            if (count < 0)
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.count, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
            if (this._size - index < count) 
                ThrowHelper.ThrowArgumentException(ExceptionResource.Argument_InvalidOffLen);

//            return Array.BinarySearch<T>(_items, index, count, item, comparer); 
        },

     // Clears the contents of List. 
//        public void 
        Clear:function() {
            if (this._size > 0) 
            {
//                Array.Clear(this._items, 0, this._size); // Don't need to doc this but we clear the elements so that the gc can reclaim the references.
            	this._items.length = 0;
            	this._size = 0;
            } 
            this._version++;
        }, 
        
//        public List<TOutput> 
        ConvertAll/*<TOutput>*/:function(/*Converter<T,TOutput>*/ converter) { 
            if( converter == null) {
                ThrowHelper.ThrowArgumentNullException(ExceptionArgument.converter);
            }
            // @ 

            /*List<TOutput>*/var list = new List/*<TOutput>*/(this._size); 
            for( var i = 0; i< this._size; i++) {
                list._items[i] = converter(this._items[i]);
            }
            list._size = this._size; 
            return list;
        },

        // Contains returns true if the specified element is in the List.
        // It does a linear, O(n) search.  Equality is determined by calling 
        // item.Equals().
        //
//        public bool 
        Contains:function(/*T*/ item) {
            if (item == null) { 
                for(var i=0; i<this._size; i++)
                    if (this._items[i] == null) 
                        return true; 
                return false;
            } else {
//            	/*EqualityComparer<T>*/var c = EqualityComparer.Default;
                for(var i=0; i<this._size; i++) {
                    if (this._items[i]==item) return true; 
                }
                return false; 
            } 
        },
 
        // Copies this List into array, which must be of a
        // compatible array type. 
        //
//        public void 
        CopyTo:function(/*T[]*/ array, /*int*/ arrayIndex, count) {
        	if(array == null || array ===undefined){
        		throw new Error('array may not be null!');
        	}
        	var index= (arrayIndex ===undefined ? 0 : arrayIndex);
        	var cou = count === undefined ? this._items.length : count;
        	for(var i =0, j=index ;i<cou; i++, j++){
        		array[j] = this._items[i];
        	}
        }, 
        
        // Ensures that the capacity of this list is at least the given minimum 
        // value. If the currect capacity of the list is less than min, the
        // capacity is increased to twice the current capacity or to min, 
        // whichever is larger. 
//        private void 
        EnsureCapacity:function(/*int*/ min) {
            if (this._items.length < min) { 
                var newCapacity = this._items.length == 0? _defaultCapacity : this._items.length * 2;
                // Allow the list to grow to maximum possible capacity (~2G elements) before encountering overflow.
                // Note that this check works even when _items.Length overflowed thanks to the (uint) cast
                if (newCapacity < min) newCapacity = min;
                this.Capacity = newCapacity; 
            } 
        },

//        public bool 
        Exists:function( match) {
            return this.FindIndex(match) != -1;
        },

//        public T 
        Find:function(/*Predicate<T>*/ match) { 
            if( match == null) { 
                throw new Error('match may notbe null!');
            } 

            for(var i = 0 ; i < this._size; i++) {
                if(match.call(this, this._items[i]))  
                    return this._items[i];
            } 
            return null;
        },

//        public List<T> 
        FindAll:function(/*Predicate<T>*/ match) {
            if( match == null) { 
                throw new Error('match may notbe null!');
            } 
 
            var list = new List();
            for(var i = 0 ; i < this._size; i++) { 
            	var item = this._items[i];
                if(match( item )) 
                    list.Add(this._items[i]);
                
            } 
            return list;
        },
//        public int FindIndex(Predicate<t> match) {
//            return FindIndex(0, _size, match);
//        }
//
//        public int FindIndex(int startIndex, Predicate<t> match) {
//           return FindIndex( startIndex, _size - startIndex, match);
//        }
        
//        public int 
        FindIndex:function() {
        	var startIndex = 0,  count = 0, match = null;
        	if(arguments.length ==1){
        		startIndex = 0;
        		count = this._size;
        		match = arguments[0];
        	}else if(arguments.length ==2){
        		startIndex = arguments[0];
        		count = this._size - startIndex;
        		match = arguments[0];
        	}else if(arguments.length ==3){
        		startIndex = arguments[0];
        		count = arguments[1];
        		match = arguments[2];
        	}
            var endIndex = startIndex + count; 
            for( var i = startIndex; i < endIndex; i++) {
            	var item = this._items[i];
                if(match( item )) {
                	return i;
                }
            }
            return -1;
        },
 
        
//        public T 
        FindLast:function(/*Predicate<T>*/ match) { 
            if( match == null) { 
                throw new Error('match may notbe null!');
            } 

            for(var i = this._size - 1 ; i >= 0; i--) { 
                if(match(this._items[i])) 
                    return this._items[i]; 
            }
            return null; 
        },
        
//        public int FindLastIndex(Predicate<t> match) {
//            return FindLastIndex( _size - 1, _size, match);
//        }
//
//        public int FindLastIndex(int startIndex, Predicate<t> match) {
//           return FindLastIndex( startIndex, startIndex + 1, match);
//        }
//        
//        public int FindLastIndex(int startIndex, int count, Predicate<t> match) {

//        public int 
        FindLastIndex:function() {
        	var startIndex = 0,  count = 0, match = null;
        	if(arguments.length ==1){
        		startIndex = this._size - 1;
        		count = this._size;
        		match = arguments[0];
        	}else if(arguments.length ==2){
        		startIndex = arguments[0];
        		count = startIndex + 1;
        		match = arguments[1];
        	}else if(arguments.length ==3){
        		startIndex = arguments[0];
        		count = arguments[1];
        		match = arguments[2];
        	}
        	
            if( match == null) { 
                throw new Error('match may notbe null!');
            }  
 
            if(this._size == 0) {
                // Special case for 0 length List 
                if( startIndex != -1)  
                    throw new Error('ThrowHelper.ThrowArgumentOutOfRangeException');
            }else {
                // Make sure we're not out of range
                if ( startIndex >= this._size) 
                	throw new Error('ThrowHelper.ThrowArgumentOutOfRangeException');
            } 

            // 2nd have of this also catches when startIndex == MAXINT, so MAXINT - 0 + 1 == -1, which is < 0. 
            if (count < 0 || startIndex - count + 1 < 0) {
            	throw new Error('ThrowHelper.ThrowArgumentOutOfRangeException');
            }
 
            var endIndex = startIndex - count;
            for( var i = startIndex; i > endIndex; i--) { 
                if( match.call(this, this._items[i]))
                    return i;
            }
            return -1;
        },
        
//        public void 
        ForEach:function(/*Action<T> */action) { 
            if( action == null) { 
                throw new Error("action may not be null!");
            } 

            for(var i = 0 ; i < this._size; i++) {
                action(this._items[i]); 
            }
        },
        // Returns an enumerator for this list with the given 
        // permission for removal of elements. If modifications made to the list
        // while an enumeration is in progress, the MoveNext and 
        // GetObject methods of the enumerator will throw an exception.
        //
//        public Enumerator 
        GetEnumerator:function() { 
            return new Enumerator(this); 
        },
        
        
//        public List<T> 
        GetRange:function(/*int*/ index, /*int*/ count) { 
            if (index < 0) {
                throw new Error('ArgumentOutOfRangeException'); 
            }

            if (count < 0) {
                throw new Error('ArgumentOutOfRangeException'); 
            }
 
            if (this._size - index < count) { 
            	throw new Error('Argument_InvalidOffLen'); 
            } 

            var list = new List(count); 
            list._items = this._items.slice(index, index+count);
            list._size = count;
            return list; 
        },
        // Returns the index of the first occurrence of a given value in a range of
        // this list. The list is searched forwards, starting at index 
        // index and upto count number of elements. The
        // elements of the list are compared to the given value using the 
        // Object.Equals method. 
        //
        // This method uses the Array.IndexOf method to perform the 
        // search.
        //
//        public int 
        IndexOf:function(/*T*/ item, /*int*/ index, /*int*/ count) {
        	if(arguments.length==1){
        		return this._items.indexOf(item);
        	}else if(arguments.length==2){
	            if (index > this._size) 
	                throw new Error('ArgumentOutOfRangeException');
	            return this._items.indexOf(item,index);
        	}else if(arguments.length ==3){
	            if (index > this._size) 
	                throw new Error('ArgumentOutOfRangeException');
                if (count <0 || index > this._size - count) 
               	 	throw new Error('ArgumentOutOfRangeException');
                
                this._items.slice(index,index+count).indexOf(item);
        	}
        },

        // Inserts an element into this list at a given index. The size of the list 
        // is increased by one. If required, the capacity of the list is doubled 
        // before inserting the new element.
        // 
//        public void 
        Insert:function(/*int*/ index, /*T*/ item) {
            // Note that insertions at the end are legal.
            if ( index > this._size) {
                throw new Error('ArgumentOutOfRangeException'); 
            }

            this._items.splice(index, 0, item);
            this._size++;
            this._version++; 
        },
 
 
        // Inserts the elements of the given collection at a given index. If
        // required, the capacity of the list is increased to twice the previous
        // capacity or the new size, whichever is larger.  Ranges may be added
        // to the end of the list by setting index to the List's size. 
        //
//        public void 
        InsertRange:function(/*int*/ index, /*IEnumerable<T>*/ collection) { 
            if (collection==null) { 
                throw new Error('collection may not be null!');
            } 

            if (index > this._size) {
            	throw new Error('ArgumentOutOfRangeException');
            } 
 
           	var c = collection instanceof ICollection ? collection : null; 
            if( c != null ) {    // if collection is ICollection<T>
                var count = c.Count; 
                if (count > 0) {
                	for(var i=0; i<count; i++){
                    	this._items.splice(index, 0, collection.Get[i]);
                	}

                    this._size += count;
                }
            }
            else { 
                var en = collection.GetEnumerator();
                while(en.MoveNext()) { 
                    this.Insert(index++, en.Current); 
                }
            }
            this._version++;
        },
        // Removes the element at the given index. The size of the list is
        // decreased by one. 
        //
//        public bool 
        Remove:function(/*T*/ item) {
            var index = this.IndexOf(item); 
            if (index >= 0) { 
                this.RemoveAt(index);
                return true; 
            }

            return false;
        }, 

        // This method removes all items which matches the predicate. 
        // The complexity is O(n).
//        public int 
        RemoveAll:function(/*Predicate<T>*/ match) { 
            if( match == null) { 
                throw new Error('match may not be null!');
            } 
 
            var freeIndex = 0;   // the first free slot in items array
 
            // Find the first item which needs to be removed. 
            while( freeIndex < this._size && !match(this._items[freeIndex])) freeIndex++;
            if( freeIndex >= this._size) return 0; 

            var current = freeIndex + 1;
            while( current < this._size) {
                // Find the first item which needs to be kept. 
                while( current < this._size && match(this._items[current])) current++;
 
                if( current < this._size) { 
                    // copy item to the free slot.
                	this._items[freeIndex++] = this._items[current++]; 
                }
            }

            Array.Clear(_items, freeIndex, _size - freeIndex); 
            var result = _size - freeIndex;
            _size = freeIndex; 
            _version++; 
            return result;
        },

        // Removes the element at the given index. The size of the list is
        // decreased by one.
        // 
//        public void 
        RemoveAt:function(/*int*/ index) {
            if (index >= this._size) { 
                throw new Error('ArgumentOutOfRangeException'); 
            }
            this._size--;
            if (index < this._size) {
               this._items.splice(index,1);
            } 

            this._version++; 
        }, 

        // Removes a range of elements from this list. 
        //
//        public void 
        RemoveRange:function(/*int*/ index, /*int*/ count) {
            if (index < 0) {
            	throw new Error('ArgumentOutOfRangeException');
            }
 
            if (count < 0) { 
            	throw new Error('ArgumentOutOfRangeException');
            } 

            if (this._size - index < count)
            	throw new Error('Argument_InvalidOffLen');

            if (count > 0) { 
//                var i = this._size; 
                this._size -= count;
                if (index < _size) { 
                    this._items.splice(index, count);
                }
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
//        public void 
        Reverse:function() {
        	this._items.reverse(); 
        	this._version++; 
        },
        
        // Sorts the elements in this list.  Uses Array.Sort with the
        // provided comparer. 
//        public void 
        Sort:function(/*IComparer<T>*/ comparer)
        {
        	if(arguments.length==0){
        		this._items.sort();
        	}else{
        		this._items.sort(comparer);
        	}
        }
	});
	
	Object.defineProperties(List.prototype,{
 
		// Gets and sets the capacity of this list.  The capacity is the size of
        // the internal array used to hold items.  When set, the internal 
        // array of the list is reallocated to the given capacity.
        // 
//        public int 
        Capacity: { 
            get:function() {
                return this._items.length; 
            },
            set:function(value) { 
                if (value < this._size) { 
                    ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.value, ExceptionResource.ArgumentOutOfRange_SmallCapacity);
                } 
                if (value != this._items.length) {
                    if (value > 0) { 
                        /*T[]*/var newItems = []; //new T[value];
                        if (this._size > 0) { 
//                            Array.Copy(_items, 0, newItems, 0, _size); 
                            for(var i=0; i<this._size; i++){
                            	newItems[i] = this._items[i];
                            }
                            for(var i=this._size; i<value; i++){
                            	newItems[i] = null;
                            }
                        }
                        this._items = newItems; 
   
                    }
                    else {
                    	this._items = _emptyArray;
                    } 
                }
            } 
        }, 

        // Read-only property describing how many elements are in the List. 
//        public int 
        Count: {
            get:function() {
                return this._size; 
            }
        }, 
//        bool System.Collections.IList.
        IsFixedSize:
        {
            get:function() { return false; } 
        },


        // Is this List read-only? 
//        bool ICollection<T>.
        IsReadOnly: {
            get:function() { return false; } 
        }
	});
	
	List.Type = new Type("List", List, [IList.Type]);
	return List;
});



    




