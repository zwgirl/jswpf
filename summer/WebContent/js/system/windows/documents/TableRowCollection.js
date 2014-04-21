/**
 * TableRowCollection
 */

define(["dojo/_base/declare", "system/Type", "collections/IList"], 
		function(declare, Type, IList){
	var TableRowCollection = declare("TableRowCollection", IList,{
		constructor:function(/*TableRowGroup*/ owner) 
        {
            this._rowCollectionInternal = new TableTextElementCollectionInternal/*<TableRowGroup, TableRow>*/(owner); 
        },
        
        /// <summary>
        /// Strongly typed version of ICollection.CopyTo. 
        /// </summary> 
        /// <exception cref="ArgumentNullException">
        /// <see cref="ICollection.CopyTo"/> 
        /// </exception>
        /// <exception cref="ArgumentException">
        /// <see cref="ICollection.CopyTo"/>
        /// </exception> 
        /// <exception cref="ArgumentOutOfRangeException">
        /// <see cref="ICollection.CopyTo"/> 
        /// </exception> 
        /// <param name="array"><see cref="ICollection.CopyTo"/></param>
        /// <param name="index"><see cref="ICollection.CopyTo"/></param> 
        /// <remarks>
        /// <see cref="ICollection.CopyTo"/>
        /// </remarks>
//        public void 
        CopyTo:function(/*TableRow[] */array, /*int*/ index) 
        {
            this._rowCollectionInternal.CopyTo(array, index); 
        }, 

        /// <summary> 
        ///     <see cref="IEnumerable.GetEnumerator"/>
        /// </summary>
//        IEnumerator IEnumerable.
        GetEnumerator:function()
        { 
            return this._rowCollectionInternal.GetEnumerator();
        }, 
 
 
        /// <summary> 
        /// Appends a TableRow to the end of the TableRowCollection.
        /// </summary> 
        /// <param name="item">The TableRow to be added to the end of the TableRowCollection.</param>
        /// <returns>The TableRowCollection index at which the TableRow has been added.</returns>
        /// <remarks>Adding a null is prohibited.</remarks>
        /// <exception cref="ArgumentNullException"> 
        /// If the <c>item</c> value is null.
        /// </exception> 
        /// <exception cref="ArgumentException"> 
        /// If the new child already has a parent.
        /// </exception> 
//        public void 
        Add:function(/*TableRow*/ item)
        {
            this._rowCollectionInternal.Add(item);
        }, 

        /// <summary> 
        /// Removes all elements from the TableRowCollection. 
        /// </summary>
        /// <remarks> 
        /// Count is set to zero. Capacity remains unchanged.
        /// To reset the capacity of the TableRowCollection, call TrimToSize
        /// or set the Capacity property directly.
        /// </remarks> 
//        public void 
        Clear:function()
        { 
            this._rowCollectionInternal.Clear(); 
        },
 
        /// <summary>
        /// Determines whether a TableRow is in the TableRowCollection.
        /// </summary>
        /// <param name="item">The TableRow to locate in the TableRowCollection. 
        /// The value can be a null reference.</param>
        /// <returns>true if TableRow is found in the TableRowCollection; 
        /// otherwise, false.</returns> 
//        public bool 
        Contains:function(/*TableRow*/ item)
        { 
            return this._rowCollectionInternal.Contains(item);
        },

        /// <summary> 
        /// Returns the zero-based index of the TableRow. If the TableRow is not
        /// in the TableRowCollection, -1 is returned. 
        /// </summary> 
        /// <param name="item">The TableRow to locate in the TableRowCollection.</param>
//        public int 
        IndexOf:function(/*TableRow*/ item) 
        {
            return this._rowCollectionInternal.IndexOf(item);
        },
 
        /// <summary>
        /// Inserts a TableRow into the TableRowCollection at the specified index. 
        /// </summary> 
        /// <param name="index">The zero-based index at which value should be inserted.</param>
        /// <param name="item">The TableRow to insert. </param> 
        /// <exception cref="ArgumentOutOfRangeException">
        /// <c>index</c>c> is less than zero.
        /// -or-
        /// <c>index</c> is greater than Count. 
        /// </exception>
        /// <exception cref="ArgumentNullException"> 
        /// If the <c>item</c> value is null. 
        /// </exception>
        /// <remarks> 
        /// If Count already equals Capacity, the capacity of the
        /// TableRowCollection is increased before the new TableRow is inserted.
        ///
        /// If index is equal to Count, TableRow is added to the 
        /// end of TableRowCollection.
        /// 
        /// The TableRows that follow the insertion point move down to 
        /// accommodate the new TableRow. The indexes of the TableRows that are
        /// moved are also updated. 
        /// </remarks>
//        public void 
        Insert:function(/*int*/ index, /*TableRow*/ item)
        {
            this._rowCollectionInternal.Insert(index, item); 
        },
 
        /// <summary> 
        /// Removes the specified TableRow from the TableRowCollection.
        /// </summary> 
        /// <param name="item">The TableRow to remove from the TableRowCollection.</param>
        /// <exception cref="ArgumentNullException">
        /// If the <c>item</c> value is null.
        /// </exception> 
        /// <exception cref="ArgumentException">
        /// If the specified TableRow is not in this collection. 
        /// </exception> 
        /// <remarks>
        /// The TableRows that follow the removed TableRow move up to occupy 
        /// the vacated spot. The indices of the TableRows that are moved
        /// also updated.
        /// </remarks>
//        public bool 
        Remove:function(/*TableRow*/ item) 
        {
            return this._rowCollectionInternal.Remove(item); 
        },

        /// <summary> 
        /// Removes the TableRow at the specified index.
        /// </summary>
        /// <param name="index">The zero-based index of the TableRow to remove.</param>
        /// <exception cref="ArgumentOutOfRangeException"> 
        /// <c>index</c> is less than zero
        /// - or - 
        /// <c>index</c> is equal or greater than count. 
        /// </exception>
        /// <remarks> 
        /// The TableRows that follow the removed TableRow move up to occupy
        /// the vacated spot. The indices of the TableRows that are moved
        /// also updated.
        /// </remarks> 
//        public void 
        RemoveAt:function(/*int*/ index)
        { 
            _rowCollectionInternal.RemoveAt(index); 
        },
 

        /// <summary>
        /// Removes a range of TableRows from the TableRowCollection.
        /// </summary> 
        /// <param name="index">The zero-based index of the range
        /// of TableRows to remove</param> 
        /// <param name="count">The number of TableRows to remove.</param> 
        /// <exception cref="ArgumentOutOfRangeException">
        /// <c>index</c> is less than zero. 
        /// -or-
        /// <c>count</c> is less than zero.
        /// </exception>
        /// <exception cref="ArgumentException"> 
        /// <c>index</c> and <c>count</c> do not denote a valid range of TableRows in the TableRowCollection.
        /// </exception> 
        /// <remarks> 
        /// The TableRows that follow the removed TableRows move up to occupy
        /// the vacated spot. The indices of the TableRows that are moved are 
        /// also updated.
        /// </remarks>
//        public void 
        RemoveRange:function(/*int*/ index, /*int*/ count)
        { 
            _rowCollectionInternal.RemoveRange(index, count);
        }, 
 
        /// <summary>
        /// Sets the capacity to the actual number of elements in the TableRowCollection. 
        /// </summary>
        /// <remarks>
        /// This method can be used to minimize a TableRowCollection's memory overhead
        /// if no new elements will be added to the collection. 
        ///
        /// To completely clear all elements in a TableRowCollection, call the Clear method 
        /// before calling TrimToSize. 
        /// </remarks>
//        public void 
        TrimToSize:function() 
        {
            this._rowCollectionInternal.TrimToSize();
        },

        /// <summary> 
        /// Indexer for the TableRowCollection. Gets the TableRow stored at the 
        /// zero-based index of the TableRowCollection.
        /// </summary> 
        /// <remarks>This property provides the ability to access a specific TableRow in the
        /// TableRowCollection by using the following systax: <c>TableRow myTableRow = myTableRowCollection[index]</c>.
        /// </remarks>
        /// <exception cref="ArgumentOutOfRangeException"> 
        /// <c>index</c> is less than zero -or- <c>index</c> is equal to or greater than Count.
        /// </exception> 
        Get:function(index) 
        {
            return this._rowCollectionInternal.Get(index);
        },
        Set:function(index,value) 
        {
        	this._rowCollectionInternal.Set(index, value); 
        }, 
 
        /// <summary>
        /// Performs the actual work of adding the item into the array, and notifying it when it is connected 
        /// </summary> 
//        internal void 
        InternalAdd:function(/*TableRow*/ item)
        { 
        	this._rowCollectionInternal.InternalAdd(item);
        },

        /// <summary> 
        /// Performs the actual work of notifying item it is leaving the array, and disconnecting it.
        /// </summary> 
//        internal void 
        InternalRemove:function(/*TableRow*/ item) 
        {
        	this._rowCollectionInternal.InternalRemove(item); 
        },

        /// <summary> 
        /// Ensures that the capacity of this list is at least the given minimum
        /// value. If the currect capacity of the list is less than min, the 
        /// capacity is increased to min. 
        /// </summary>
//        private void 
        EnsureCapacity:function(/*int*/ min) 
        {
        	this._rowCollectionInternal.EnsureCapacity(min);
        },
 
        /// <summary>
        /// Sets the specified TableRow at the specified index; 
        /// Connects the item to the model tree; 
        /// Notifies the TableRow about the event.
        /// </summary> 
        /// <exception cref="ArgumentException">
        /// If the new item has already a parent or if the slot at the specified index is not null.
        /// </exception>
        /// <remarks> 
        /// Note that the function requires that _item[index] == null and
        /// it also requires that the passed in item is not included into another TableRowCollection. 
        /// </remarks> 
//        private void 
        PrivateConnectChild:function(/*int*/ index, /*TableRow*/ item)
        { 
            this._rowCollectionInternal.PrivateConnectChild(index, item);
        },

        /// <summary>
        /// Removes specified TableRow from the TableRowCollection. 
        /// </summary> 
        /// <param name="item">TableRow to remove.</param>
//        private void 
        PrivateDisconnectChild:function(/*TableRow*/ item) 
        {
        	this._rowCollectionInternal.PrivateDisconnectChild(item);
        },
 
        // helper method: return true if the item belongs to the collection's owner
//        private bool 
        BelongsToOwner:function(/*TableRow*/ item) 
        { 
            return this._rowCollectionInternal.BelongsToOwner(item);
        }, 

        // Helper method - Searches the children collection for the index an item currently exists at -
        // NOTE - ITEM MUST BE IN TEXT TREE WHEN THIS IS CALLED.
//        private int 
        FindInsertionIndex:function(/*TableRow*/ item) 
        {
            return this._rowCollectionInternal.FindInsertionIndex(item); 
        } 
        
        
	});
	
	Object.defineProperties(TableRowCollection.prototype,{
//		bool IList.
		IsFixedSize: 
        {
            get:function() 
            { 
                return this._rowCollectionInternal.IsFixedSize;
            } 
        },
        
        /// <summary> 
        /// <see cref="ICollection.Count"/>
        /// </summary>
//        public int 
        Count:
        { 
            get:function()
            { 
                return this._rowCollectionInternal.Count; 
            }
        }, 

        /// <summary>
        ///     <see cref="IList.IsReadOnly"/>
        /// </summary> 
//        public bool 
        IsReadOnly:
        { 
            get:function() 
            {
                return this._rowCollectionInternal.IsReadOnly; 
            }
        },
        
        /// <summary>
        /// Gets or sets the number of elements that the TableRowCollection can contain.
        /// </summary> 
        /// <value>
        /// The number of elements that the TableRowCollection can contain. 
        /// </value> 
        /// <remarks>
        /// Capacity is the number of elements that the TableRowCollection is capable of storing. 
        /// Count is the number of Visuals that are actually in the TableRowCollection.
        ///
        /// Capacity is always greater than or equal to Count. If Count exceeds
        /// Capacity while adding elements, the capacity of the TableRowCollection is increased. 
        ///
        /// By default the capacity is 8. 
        /// </remarks> 
        /// <exception cref="ArgumentOutOfRangeException">
        /// Capacity is set to a value that is less than Count. 
        /// </exception>
        /// <ExternalAPI/>
//        public int 
        Capacity:
        { 
            get:function()
            { 
                return _rowCollectionInternal.Capacity; 
            },
            set:function(value) 
            {
                this._rowCollectionInternal.Capacity = value;
            }
        },
        
        /// <summary>
        /// PrivateCapacity sets/gets the Capacity of the collection.
        /// </summary> 
//        private int 
        PrivateCapacity:
        { 
            get:function() 
            {
                return _rowCollectionInternal.PrivateCapacity; 
            },
            set:function(value)
            {
                this._rowCollectionInternal.PrivateCapacity = value; 
            }
        } 
        
	});
	
	Object.defineProperties(TableRowCollection,{
		  
	});
	
	TableRowCollection.Type = new Type("TableRowCollection", TableRowCollection, [IList.Type]);
	return TableRowCollection;
});


