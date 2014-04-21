/**
 * Second Check 12-09
 * Three Check 12-11
 * VisualCollection
 */

define(["dojo/_base/declare", "system/Type", "collections/ICollection", "media/VisualTreeHelper"], 
		function(declare, Type, ICollection, VisualTreeHelper){
	/// <summary>
	/// This is a simple VisualCollection enumerator that is based on 
	/// the ArrayListEnumeratorSimple that is used for ArrayLists. 
	///
	/// The following comment is from the CLR people: 
	///   For a straightforward enumeration of the entire ArrayList,
	///   this is faster, because it's smaller.  Benchmarks showed
	///   this.
	/// </summary> 
	var Enumerator = declare(IEnumerator, {
		constructor:function(/*VisualCollection*/ collection)
        { 
			this._collection = collection;
			this._index = -1; // not started. 
            this._version = this._collection.Version; 
            this._currentElement = null;
        },

        /// <summary>
        /// Advances the enumerator to the next element of the collection.
        /// </summary> 
//        public bool 
        MoveNext:function()
        { 
//        	this._collection.VerifyAPIReadOnly(); 

            if (this._version == this._collection.Version) 
            {
                if ((this._index > -2) && (this._index < (this._collection.InternalCount - 1)))
                {
                	this._index++; 
                	this. _currentElement = this._collection._items[this._index];
                    return true; 
                } 
                else
                { 
                	this._currentElement = null;
                	this._index = -2; // -2 <=> reached the end.
                    return false;
                } 
            }
            else 
            { 
                throw new InvalidOperationException(SR.Get(SRID.Enumerator_CollectionChanged));
            } 
        },

        /// <summary>
        /// Sets the enumerator to its initial position, which is before the first element in the collection.
        /// </summary> 
//        public void 
        Reset:function()
        { 
//        	this._collection.VerifyAPIReadOnly(); 

            if (this._version != this._collection.Version) 
                throw new InvalidOperationException(SR.Get(SRID.Enumerator_CollectionChanged));
            this._index = -1; // not started.
        }
        
	});
	
//    private const int 
//    var c_defaultCapacity = 4;
//    private const float 
    var c_growFactor = 1.5; 
	
	Object.defineProperties(Enumerator.prototype, {
        /// <summary>
        /// Gets the current Visual. 
        /// </summary> 
//        public Visual 
        Current:
        { 
            get:function()
            {
                // Disable PREsharp warning about throwing exceptions in property
                // get methods; see Windows OS Bugs #1035349 for an explanation. 
                if (this._index < 0)
                { 
                    if (this._index == -1)
                    {
                        // Not started.
                        throw new InvalidOperationException(SR.Get(SRID.Enumerator_NotStarted)); 
                    }
                    else 
                    { 
                        // Reached the end.
                        throw new InvalidOperationException(SR.Get(SRID.Enumerator_ReachedEnd));
                    }
                }
                return this._currentElement; 
            } 
        }		
	});
	
	var VisualCollection = declare("VisualCollection", ICollection,{
		constructor:function(/*Visual*/ parent){
	        if (parent == null || parent === undefined)
	        { 
	            throw new ArgumentNullException("parent"); 
	        }
	        
//		    private Visual 
		    this._owner = parent; 
//			private Visual[] 
			this._items = []; 
//		    private int 
		    this._size = 0;

		    // We reserve bit 1 to keep track of readonly state.  Bits
		    // 32..2 are used for our version counter.
		    // 
		    //              Version                RO
		    // +----------------------------------+---+ 
		    // |        bit 32..2                 | 1 | 
		    // +----------------------------------+---+
		    // 
//		    private uint 
		    this._data = 0;

		},
		
	       /// <summary>
        /// Indexer for the VisualCollection. Gets or sets the Visual stored at the 
        /// zero-based index of the VisualCollection. 
        /// </summary>
        /// <remarks>This property provides the ability to access a specific Visual in the 
        /// VisualCollection by using the following systax: <c>myVisualCollection[index]</c>.</remarks>
        /// <exception cref="ArgumentOutOfRangeException"><c>index</c> is less than zero -or- <c>index</c> is equal to or greater than Count.</exception>
        /// <exception cref="ArgumentException">If the new child has already a parent or if the slot a the specified index is not null.</exception>
        Get:function(index)
        { 
            // ([....]) I think we should skip the context checks here for performance reasons.
            //     MediaSystem.VerifyContext(_owner); The guy who gets the Visual won't be able to access the context 
            //     the Visual anyway if he is in the wrong context.

            // Disable PREsharp warning about throwing exceptions in property
            // get methods; see Windows OS Bugs #1035349 for an explanation. 

            if (index < 0 || index >= this._size) throw new ArgumentOutOfRangeException("index"); 
            return this._items[index];
        },
        
        Set:function(index, value)
        {
//            this.VerifyAPIReadWrite(value); 

            if (index < 0 || index >= this._size) throw new ArgumentOutOfRangeException("index"); 

            /*Visual*/var child = this._items[index];

            if ((value == null) && (child != null))
            {
                this.DisconnectChild(index);
            } 
            else if (value != null)
            { 
                if (child != null) 
                {
                    throw new ArgumentException(SR.Get(SRID.VisualCollection_EntryInUse)); 
                }
                if ((value._parent != null) // Only a visual that isn't a visual parent or
                    || value.IsRootElement) // are a root node of a visual target can be set into the collection.
                { 
                    throw new System.ArgumentException(SR.Get(SRID.VisualCollection_VisualHasParent));
                } 

                this.ConnectChild(index, value);
            } 
        },
        
////        internal void 
//        VerifyAPIReadOnly:function()
//        { 
////            Debug.Assert(_owner != null);
//            this._owner.VerifyAPIReadOnly(); 
//        }, 
//
////        internal void 
//        VerifyAPIReadOnly:function(/*Visual*/ other) 
//        {
////            Debug.Assert(_owner != null);
//        	this._owner.VerifyAPIReadOnly(other);
//        }, 
//
////        internal void 
//        VerifyAPIReadWrite:function() 
//        { 
////            Debug.Assert(_owner != null);
//            this._owner.VerifyAPIReadWrite(); 
//            this.VerifyNotReadOnly();
//        },
//
////        internal void 
//        VerifyAPIReadWrite:function(/*Visual*/ other) 
//        {
////            Debug.Assert(_owner != null); 
//            this._owner.VerifyAPIReadWrite(other); 
//            this.VerifyNotReadOnly();
//        },
//
////        internal void 
//        VerifyNotReadOnly:function()
//        {
//            if (this.IsReadOnlyInternal) 
//            {
//                throw new InvalidOperationException(SR.Get(SRID.VisualCollection_ReadOnly)); 
//            } 
//        },
// 
//
// 
//        /// <summary>
//        /// Copies the Visual collection to the specified array starting at the specified index. 
//        /// </summary>
//        public void CopyTo(Array array, int index)
//        {
//            VerifyAPIReadOnly(); 
//
//            if (array == null) 
//            { 
//                throw new ArgumentNullException("array");
//            } 
//
//            if (array.Rank != 1)
//            {
//                throw new ArgumentException(SR.Get(SRID.Collection_BadRank)); 
//            }
// 
//            if ((index < 0) || 
//                (array.Length - index < _size))
//            { 
//                throw new ArgumentOutOfRangeException("index");
//            }
//
//            // System.Array does not have a CopyTo method that takes a count. Therefore 
//            // the loop is programmed here out.
//            for (var i=0; i < this._size; i++) 
//            { 
//                array.SetValue(this._items[i], i+index);
//            } 
//
//        },

        /// <summary> 
        /// Copies the Visual collection to the specified array starting at the specified index.
        /// </summary> 
//        public void 
        CopyTo:function(/*Visual[]*/ array, /*int*/ index) 
        {
            // Remark: This is the strongly typed version of the ICollection.CopyTo method. 
            // FXCop requires us to implement this method.

//        	this.VerifyAPIReadOnly();
 
            if (array == null)
            { 
                throw new ArgumentNullException("array"); 
            }
 
            if ((index < 0))
            {
                throw new ArgumentOutOfRangeException("index"); 
            }
 
            // System.Array does not have a CopyTo method that takes a count. Therefore 
            // the loop is programmed here out.
            for (var i=0; i < this._size; i++) 
            {
                array[i+index] = this._items[i];
            }
        }, 
        

        /// <summary>
        /// Ensures that the capacity of this list is at least the given minimum 
        /// value. If the currect capacity of the list is less than min, the
        /// capacity is increased to min. 
        /// </summary> 
//        private void 
        EnsureCapacity:function(/*int*/ min)
        { 
            if (this.InternalCapacity < min)
            {
            	this.InternalCapacity = Math.max(min, (Math.floor(this.InternalCapacity * c_growFactor)));
            } 
        },

        /// <summary> 
        /// Sets the specified visual at the specified index into the child
        /// collection. It also corrects the parent. 
        /// Note that the function requires that _item[index] == null and it 
        /// also requires that the passed in child is not connected to another Visual.
        /// </summary> 
        /// <exception cref="ArgumentException">If the new child has already a parent or if the slot a the specified index is not null.</exception>
//        private void 
        ConnectChild:function(/*int*/ index, /*Visual*/ value)
        {
            // 
            // -- Approved By The Core Team --
            // 
            // Do not allow foreign threads to change the tree. 
            // (This is a noop if this object is not assigned to a Dispatcher.)
            // 
            // We also need to ensure that the tree is homogenous with respect
            // to the dispatchers that the elements belong to.
            //
//        	this._owner.VerifyAccess(); 
//            value.VerifyAccess();
 
            // It is invalid to modify the children collection that we 
            // might be iterating during a property invalidation tree walk.
            if (this._owner.IsVisualChildrenIterationInProgress) 
            {
                throw new InvalidOperationException(SR.Get(SRID.CannotModifyVisualChildrenDuringTreeWalk));
            }
 
//            Debug.Assert(value != null);
//            Debug.Assert(_items[index] == null); 
//            Debug.Assert(value._parent == null); 
//            Debug.Assert(!value.IsRootElement);
 
            value._parentIndex = index;
            this._items[index] = value;
            this.IncrementVersion();
 
            // Notify the Visual tree about the children changes.
            this._owner.InternalAddVisualChild(value); 
        },

        /// <summary> 
        /// Disconnects a child.
        /// </summary>
//        private void 
        DisconnectChild:function(/*int*/ index)
        { 
//            Debug.Assert(_items[index] != null);
 
            /*Visual*/
        	var child = this._items[index]; 

            // 
            // -- Approved By The Core Team --
            //
            // Do not allow foreign threads to change the tree.
            // (This is a noop if this object is not assigned to a Dispatcher.) 
            //
//            child.VerifyAccess(); 
 
            /*Visual*/
            var oldParent = VisualTreeHelper.GetContainingVisual2D(child._parent);
//            var oldParentIndex = child._parentIndex; 

            // It is invalid to modify the children collection that we
            // might be iterating during a property invalidation tree walk.
            if (oldParent.IsVisualChildrenIterationInProgress) 
            {
                throw new InvalidOperationException(SR.Get(SRID.CannotModifyVisualChildrenDuringTreeWalk)); 
            } 

            this._items[index] = null; 
            
//            #if DEBUG
//            child._parentIndex = -1;
//            #endif 

            this.IncrementVersion();
 
            this._owner.InternalRemoveVisualChild(child); 
        },
 
        /// <summary>
        /// Appends a Visual to the end of the VisualCollection.
        /// </summary>
        /// <param name="visual">The Visual to be added to the end of the VisualCollection.</param> 
        /// <returns>The VisualCollection index at which the Visual has been added.</returns>
        /// <remarks>Adding a null is allowed.</remarks> 
        /// <exception cref="ArgumentException">If the new child has already a parent.</exception> 
//        public int 
        Add:function(/*Visual*/ visual)
        { 
//        	this.VerifyAPIReadWrite(visual);

            if ((visual != null) &&
                ((visual._parent != null)   // Only visuals that are not connected to another tree 
                 || visual.IsRootElement))  // or a visual target can be added.
            { 
                throw new ArgumentException(SR.Get(SRID.VisualCollection_VisualHasParent)); 
            }
 

            if ((this._items == null) || (this._size == this._items.length))
            {
            	this.EnsureCapacity(this._size+1); 
            }
            var addedPosition = this._size++; 
//            Debug.Assert(_items[addedPosition] == null); 
            if (visual != null)
            { 
            	this.ConnectChild(addedPosition, visual);
            }
            this.IncrementVersion();
            return addedPosition; 
        },
    
        /// <summary> 
        /// Returns the zero-based index of the Visual. If the Visual is not
        /// in the VisualCollection -1 is returned. If null is passed to the method, the index 
        /// of the first entry with null is returned. If there is no null entry -1 is returned.
        /// </summary>
        /// <param name="visual">The Visual to locate in the VisualCollection.</param>
        /// <remark>Runtime of this method is constant if the argument is not null. If the argument is 
        /// null, the runtime of this method is linear in the size of the collection.
        /// </remark> 
//        public int 
        IndexOf:function(/*Visual*/ visual) 
        {
//        	this.VerifyAPIReadOnly(); 

            if (visual == null)
            {
                // If the passed in argument is null, we find the first index with a null 
                // entry and return it.
                for (var i = 0; i < this._size; i++) 
                { 
                    if (this._items[i] == null)
                    { 
                        return i;
                    }
                }
                // No null entry found, return -1. 
                return -1;
            } 
            else if (visual._parent != this._owner) 
            {
                return -1; 
            }
            else
            {
                return visual._parentIndex; 
            }
        }, 
 
        /// <summary>
        /// Removes the specified visual from the VisualCollection. 
        /// </summary>
        /// <param name="visual">The Visual to remove from the VisualCollection.</param>
        /// <remarks>
        /// The Visuals that follow the removed Visuals move up to occupy 
        /// the vacated spot. The indexes of the Visuals that are moved are
        /// also updated. 
        /// 
        /// If visual is null then the first null entry is removed. Note that removing
        /// a null entry is linear in the size of the collection. 
        /// </remarks>
//        public void 
        Remove:function(/*Visual*/ visual)
        {
//        	this.VerifyAPIReadWrite(visual); 

        	this.InternalRemove(visual); 
        }, 

//        private void 
        InternalRemove:function(/*Visual*/ visual) 
        {
            var indexToRemove = -1;

            if (visual != null) 
            {
                if (visual._parent != this._owner) 
                { 
                    // If the Visual is not in this collection we silently return without
                    // failing. This is the same behavior that ArrayList implements. See 
                    // also Windows OS Bug #1100006.
                    return;
                }
 
//                Debug.Assert(visual._parent != null);
 
                indexToRemove = visual._parentIndex; 
                this.DisconnectChild(indexToRemove);
            } 
            else
            {
                // This is the case where visual == null. We then remove the first null
                // entry. 
                for (var i = 0; i < this._size; i++)
                { 
                    if (this._items[i] == null) 
                    {
                        indexToRemove = i; 
                        break;
                    }
                }
            } 

            if (indexToRemove != -1) 
            { 
//                --this._size;
 
                for (var i = indexToRemove; i < this._size; i++)
                {
                    /*Visual*/
                	var  child = this._items[i+1];
                    if (child != null) 
                    {
                        child._parentIndex = i; 
                    } 
                    this._items[i] = child;
                } 

                this._items[this._size] = null;
            }
        },
        
//        private void 
        IncrementVersion:function() 
        {
            // += 2 because bit 1 is our read-only flag.  Explicitly unchecked 
            // because we expect this number to "roll over" after 2 billion calls.
            // See comments on _data field.
         	this._data += 2;
        }, 



        // Puts the collection into a ReadOnly state.  Viewport3DVisual does this 
        // on construction to prevent the addition of 2D children.
//        internal void 
        SetReadOnly:function()
        {
            // Bit 1 is our read-only flag.  See comments on the _data field. 
        	this._data |= 0x01;
        }, 
 
        /// <summary>
        /// Determines whether a visual is in the VisualCollection. 
        /// </summary>
//        public bool 
        Contains:function(/*Visual*/ visual)
        {
//        	this.VerifyAPIReadOnly(visual); 

            if (visual == null) 
            { 
                for (var i=0; i < this._size; i++)
                { 
                    if (this._items[i] == null)
                    {
                        return true;
                    } 
                }
                return false; 
            } 
            else
            { 
                return (visual._parent == this._owner);
            }
        },
 
        /// <summary>
        /// Removes all elements from the VisualCollection. 
        /// </summary> 
        /// <remarks>
        /// Count is set to zero. Capacity remains unchanged. 
        /// To reset the capacity of the VisualCollection,
        /// set the Capacity property directly.
        /// </remarks>
//        public void 
        Clear:function() 
        {
//        	this.VerifyAPIReadWrite(); 
 
            for (var i=0; i < this._size; i++)
            { 
                if (this._items[i] != null)
                {
//                    Debug.Assert(_items[i]._parent == _owner);
                	this.DisconnectChild(i); 
                }
                this._items[i] = null; 
            } 
            
            this._size = 0;
            this.IncrementVersion(); 
        },

        /// <summary>
        /// Inserts an element into the VisualCollection at the specified index. 
        /// </summary>
        /// <param name="index">The zero-based index at which value should be inserted.</param> 
        /// <param name="visual">The Visual to insert. </param> 
        /// <exception cref="ArgumentOutOfRangeException">
        /// index is less than zero. 
        ///
        /// -or-
        ///
        /// index is greater than Count. 
        /// </exception>
        /// <remarks> 
        /// If Count already equals Capacity, the capacity of the 
        /// VisualCollection is increased before the new Visual
        /// is inserted. 
        ///
        /// If index is equal to Count, value is added to the
        /// end of VisualCollection.
        /// 
        /// The Visuals that follow the insertion point move down to
        /// accommodate the new Visual. The indexes of the Visuals that are 
        /// moved are also updated. 
        /// </remarks>
//        public void 
        Insert:function(/*int*/ index, /*Visual*/ visual) 
        {
//        	this.VerifyAPIReadWrite(visual);

            if (index < 0 || index > this._size) 
            {
                throw new ArgumentOutOfRangeException("index"); 
            } 

            if ((visual != null) && 
                ((visual._parent != null)   // Only visuals that are not connected to another tree
                 || visual.IsRootElement))  // or a visual target can be added.
            {
                throw new ArgumentException(SR.Get(SRID.VisualCollection_VisualHasParent)); 
            }
 
            if ((this._items == null) || (this._size == this._items.length)) 
            {
            	this.EnsureCapacity(this._size + 1); 
            }

            for (var i = this._size-1; i >= index; i--)
            { 
                /*Visual*/var child = this._items[i];
                if (child != null) 
                { 
                    child._parentIndex = i+1;
                } 
                this._items[i+1] = child;
            }
            this._items[index] = null;
 
            this._size++;
            if (visual != null) 
            { 
            	this.ConnectChild(index, visual);
            } 
            // Note SetVisual that increments the version to ensure proper enumerator
            // functionality.
        },
 
        /// <summary>
        /// Removes the Visual at the specified index. 
        /// </summary> 
        /// <param name="index">The zero-based index of the visual to remove.</param>
        /// <exception cref="ArgumentOutOfRangeException">index is less than zero 
        /// - or - index is equal or greater than count.</exception>
        /// <remarks>
        /// The Visuals that follow the removed Visuals move up to occupy
        /// the vacated spot. The indexes of the Visuals that are moved are 
        /// also updated.
        /// </remarks> 
//        public void 
        RemoveAt:function(/*int*/ index) 
        {
//        	this.VerifyAPIReadWrite(); 

            if (index < 0 || index >= this._size)
            {
                throw new ArgumentOutOfRangeException("index"); 
            }
 
            this.InternalRemove(this._items[index]); 
        },

        /// <summary>
        /// Removes a range of Visuals from the VisualCollection.
        /// </summary> 
        /// <param name="index">The zero-based index of the range
        /// of elements to remove</param> 
        /// <param name="count">The number of elements to remove.</param> 
        /// <exception cref="ArgumentOutOfRangeException">
        /// index is less than zero. 
        /// -or-
        /// count is less than zero.
        /// </exception>
        /// <exception cref="ArgumentException"> 
        /// index and count do not denote a valid range of elements in the VisualCollection.
        /// </exception> 
        /// <remarks> 
        /// The Visuals that follow the removed Visuals move up to occupy
        /// the vacated spot. The indexes of the Visuals that are moved are 
        /// also updated.
        /// </remarks>
//        public void 
        RemoveRange:function(/*int*/ index, /*int*/ count)
        { 
//        	this.VerifyAPIReadWrite();
 
            // ([....]) Do I need this extra check index >= _size. 
            if (index < 0)
            { 
                throw new ArgumentOutOfRangeException("index");
            }
            if (count < 0)
            { 
                throw new ArgumentOutOfRangeException("count");
            } 
            if (this._size - index < count) 
            {
                throw new ArgumentOutOfRangeException("index"); 
            }

            if (count > 0)
            { 
                for (var i = index; i < index + count; i++)
                { 
                    if (this._items[i] != null) 
                    {
                    	this.DisconnectChild(i); 
                        this._items[i] = null;
                    }
                }
 
                this._size -= count;
                for (var i = index; i < this._size; i++) 
                { 
                    /*Visual*/var child = this._items[i + count];
                    if (child != null) 
                    {
                        child._parentIndex = i;
                    }
                    this._items[i] = child; 
                    this._items[i + count] = null;
                } 
                this.IncrementVersion(); // Incrementing version number here to be consistent with the ArrayList 
                            // implementation.
            } 
        },
   

        /// <summary>
        /// Moves a child inside this collection to right before the given sibling.  Avoids unparenting / reparenting costs. 
        /// This is a dangerous internal method as it moves children positions without notifying any external code.
        /// If the given sibling is null it moves the item to the end of the collection. 
        /// </summary> 
        /// <param name="visual"></param>
        /// <param name="destination"></param> 
//        internal void 
        Move:function(/*Visual*/ visual, /*Visual*/ destination)
        {
            var newIndex;
            var oldIndex; 

//            Invariant.Assert(visual != null, "we don't support moving a null visual"); 
 
            if (visual._parent == this._owner)
            { 
                oldIndex = visual._parentIndex;
                newIndex = destination != null ? destination._parentIndex : this._size;

//                Debug.Assert(visual._parent != null); 
//                Debug.Assert(destination == null || destination._parent == visual._parent);
//                Debug.Assert(newIndex >= 0 && newIndex <= _size, "New index is invalid"); 
 
                if (oldIndex != newIndex)
                { 
                    if (oldIndex < newIndex)
                    {
                        // move items left to right
                        // source Visual will get the index of one before the destination Visual 
                        newIndex--;
 
                        for (var i = oldIndex; i < newIndex; i++) 
                        {
                            /*Visual*/var child = this._items[i + 1]; 
                            if (child != null)
                            {
                                child._parentIndex = i;
                            } 
                            this._items[i] = child;
                        } 
                    } 
                    else
                    { 
                        // move items right to left
                        // source visual will get the index of the destination Visual, which will in turn
                        // be pushed to the right.
 
                        for (var i = oldIndex; i > newIndex; i--)
                        { 
                            /*Visual*/var child = this._items[i - 1]; 
                            if (child != null)
                            { 
                                child._parentIndex = i;
                            }
                            this._items[i] = child;
                        } 
                    }
 
                    visual._parentIndex = newIndex; 
                    this._items[newIndex] = visual;
                } 
            }

            return;
        },
   
        /// <summary>
        /// Returns an enumerator that can iterate through the VisualCollection. 
        /// </summary>
        /// <returns>Enumerator that enumerates the VisualCollection in order.</returns> 
//        public Enumerator 
        GetEnumerator:function() 
        {
//            VerifyAPIReadOnly(); 

            return new Enumerator(this);
        }
        
	});
	
	Object.defineProperties(VisualCollection.prototype,{
		  
//		internal int 
		InternalCount:
		{ get:function() { return this._size; } }, 
		 
        /// <summary>
        /// Returns a reference to the internal Visual children array. 
        /// </summary>
        /// <remarks>
        /// This array should never given out.
        /// It is only used for internal code 
        /// to enumerate through the children.
        /// </remarks> 
//        internal Visual[] 
		InternalArray: { get:function() { return this._items; } },
		
        /// <summary>
        /// Gets the number of elements in the collection.
        /// </summary>
//        public int 
        Count: 
        {
            get:function()
            { 
//                VerifyAPIReadOnly();
 
                return this.InternalCount;
            }
        },
 
        /// <summary>
        /// True if the collection allows modifications, otherwise false. 
        /// </summary> 
//        public bool 
        IsReadOnly:
        { 
            get:function()
            {
//                VerifyAPIReadOnly();
 
                return this.IsReadOnlyInternal;
            } 
        },
        /// <summary> 
        /// InternalCapacity sets/gets the Capacity of the collection.
        /// </summary> 
//        internal int 
        InternalCapacity:
        {
            get:function()
            { 
                return this._items != null ? this._items.length : 0;
            },
            set:function(value)
            {
                var currentCapacity = this._items != null ? this._items.length : 0; 
                if (value != currentCapacity)
                {
                    if (value < this._size)
                    { 
                        throw new ArgumentOutOfRangeException("value", SR.Get(SRID.VisualCollection_NotEnoughCapacity));
                    } 
                    if (value > 0) 
                    {
                        /*Visual[]*/var newItems = []; //new Visual[value];
                        newItems.length = value;
                        if (this._size > 0)
                        {
//                            Debug.Assert(_items != null);
//                            Array.Copy(_items, 0, newItems, 0, _size); 
                            for(var i=0; i<this._size; i++){
                            	newItems[i] = this._items[i];
                            }
                        }
                        this._items = newItems; 
                    } 
                    else
                    { 
//                        Debug.Assert(value == 0, "There shouldn't be a case where value != 0.");
//                        Debug.Assert(_size == 0, "Size must be 0 here.");
                    	this._items = null;
                    } 
                }
            } 
        }, 
        
          
        /// <summary> 
        /// Gets or sets the number of elements that the VisualCollection can contain.
        /// </summary>
        /// <value>
        /// The number of elements that the VisualCollection can contain. 
        /// </value>
        /// <remarks> 
        /// Capacity is the number of elements that the VisualCollection is capable of storing. 
        /// Count is the number of Visuals that are actually in the VisualCollection.
        /// 
        /// Capacity is always greater than or equal to Count. If Count exceeds
        /// Capacity while adding elements, the capacity of the VisualCollection is increased.
        ///
        /// By default the capacity is 0. 
        /// </remarks>
        /// <exception cref="ArgumentOutOfRangeException">Capacity is set to a value that is less than Count.</exception> 
//        public int 
        Capacity: 
        {
            get:function() 
            {
//                VerifyAPIReadOnly();

                return InternalCapacity; 
            },
            set:function(value)
            { 
//                VerifyAPIReadWrite();
 
                InternalCapacity = value;
            }
        },
      
        
//        private uint 
        Version: 
        { 
            get:function()
            { 
                // >> 1 because bit 1 is our read-only flag.  See comments
                // on the _data field.
                return this._data >> 1;
            } 
        },
        
//        private bool 
        IsReadOnlyInternal: 
        {
            get:function()
            {
                // Bit 1 is our read-only flag.  See comments on the _data field. 
                return (this._data & 0x01) == 0x01;
            } 
        } 
		
	});
	
	VisualCollection.Type = new Type("VisualCollection", VisualCollection, [ICollection.Type]);
	return VisualCollection;
});


 

        




       
 
        
 

 
 

       
 

 

        

        



