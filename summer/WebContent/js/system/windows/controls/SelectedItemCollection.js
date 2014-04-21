/**
 * Second pass 12-06
 * SelectedItemCollection
 */

define(["dojo/_base/declare", "system/Type", "objectmodel/ObservableCollection", "system/IDisposable",
        "controls/ItemInfo"], 
		function(declare, Type, ObservableCollection, IDisposable,
				ItemInfo){
	
//	private class 
	var Changer = declare(IDisposable,{ 
        constructor:function(/*SelectedItemCollection*/ owner)
        { 
            this._owner = owner;
        },

//        public void 
        Dispose:function() 
        {
        	this._owner.FinishChange(); 
        } 
    });
    
	var SelectedItemCollection = declare("SelectedItemCollection", ObservableCollection,{
		constructor:function(/*Selector*/ selector) 
        { 
			ObservableCollection.prototype.constructor.call(this, null);

            this._selector = selector;
            this._changer = new Changer(this); 
//	        int 
			this._changeCount = 0;
//          // We need a flag for indicating user bulk selection mode. We cannot re-use SelectionChange.IsActive because there are cases when SelectionChange.IsActive==true and SelectedItems.Add is called internally (End()) to update the collection
//          // When EndUpdateSelectedItems() is called we first reset this flag to allow SelectedItems.Add to change the collection 
//          private bool 
            this._updatingSelectedItems = false;
        },
        /// <summary> 
        /// Clear all items from the selection. This method modifies the behavior of IList.Clear() 
        /// </summary>
//        protected override void 
        ClearItems:function() 
        {
            if (this._updatingSelectedItems)
            {
                for/*each*/ (/*ItemsControl.ItemInfo*/var i= 0; i<this._selector._selectedItems.Count; i++) 
                {
                    this._selector.SelectionChange.Unselect(this._selector._selectedItems.Get(i)); 
                } 
            }
            else 
            {
//            	using
//            	{
            	var dispose= this.ChangeSelectedItems();
                ObservableCollection.prototype.ClearItems.call(this); 
                dispose.Dispose();
//            	}
            } 
        }, 

        /// <summary> 
        /// Removes an item from the selection. This method modifies the behavior of IList.Remove() and IList.RemoveAt()
        /// </summary>
//        protected override void 
        RemoveItem:function(/*int*/ index)
        { 
            if (this._updatingSelectedItems)
            { 
            	this._selector.SelectionChange.Unselect(this._selector.NewItemInfo(this.Get(index))); 
            }
            else 
            {
                var dispose= this.ChangeSelectedItems();
                ObservableCollection.prototype.RemoveItem.call(this, index);
                dispose.Dispose();
                
            } 
        },

        /// <summary> 
        /// Inserts an item in the selection
        /// </summary>
//        protected override void 
        InsertItem:function(/*int*/ index, /*object*/ item)
        { 
            if (this._updatingSelectedItems)
            { 
                // For defered selection we should allow only Add method 
                if (index == this.Count)
                { 
                	this._selector.SelectionChange.Select(this._selector.NewItemInfo(item), true /* assumeInItemsCollection */);
                }
                else
                { 
                    throw new InvalidOperationException(SR.Get(SRID.InsertInDeferSelectionActive));
                } 
            } 
            else
            { 
                var dispose = this.ChangeSelectedItems();
                ObservableCollection.prototype.InsertItem.call(this, index, item);
                dispose.Dispose();
            }
        },

 
        /// <summary>
        /// Sets an item on specified index 
        /// </summary>
//        protected override void 
        SetItem:function(/*int*/ index, /*object*/ item)
        {
            if (this._updatingSelectedItems) 
            {
                throw new InvalidOperationException(SR.Get(SRID.SetInDeferSelectionActive)); 
            } 
            else
            { 
            	var dispose= this.ChangeSelectedItems();
            	ObservableCollection.prototype.SetItem.call(this, index, item);
                dispose.Dispose();
            }
        }, 
 
        /// <summary>
        /// Movea an item from one position to another 
        /// </summary>
        /// <param name="oldIndex">index of the column which is being moved</param>
        /// <param name="newIndex">index of the column to be move to</param>
//        protected override void 
        MoveItem:function(/*int*/ oldIndex, /*int*/ newIndex) 
        {
            if (oldIndex != newIndex) 
            { 
                if (this._updatingSelectedItems)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.MoveInDeferSelectionActive));
                }
                else
                { 
                	var dispose= this.ChangeSelectedItems();
                	ObservableCollection.prototype.MoveItem.call(this, oldIndex, newIndex); 
                    dispose.Dispose();
                } 
            }
        },
        
//        private IDisposable 
        ChangeSelectedItems:function()
        {
            ++this._changeCount;
            return this._changer; 
        },
 
//        private void 
        FinishChange:function() 
        {
            if (--this._changeCount == 0) 
            {
            	this._selector.FinishSelectedItemsChange();
            }
        }, 

        
        /// <summary>
        /// Begin tracking selection changes. SelectedItems.Add/Remove will queue up the changes but not commit them until EndUpdateSelecteditems is called.
        /// </summary>
//        internal void 
        BeginUpdateSelectedItems:function() 
        {
            if (this._selector.SelectionChange.IsActive || this._updatingSelectedItems) 
            { 
                throw new InvalidOperationException(SR.Get(SRID.DeferSelectionActive));
            } 
            this._updatingSelectedItems = true;
            this._selector.SelectionChange.Begin();
        },
 
        /// <summary>
        /// Commit selection changes. 
        /// </summary> 
//        internal void 
        EndUpdateSelectedItems:function()
        { 
            if (!this._selector.SelectionChange.IsActive || !this._updatingSelectedItems)
            {
                throw new InvalidOperationException(SR.Get(SRID.DeferSelectionNotActive));
            } 
            this._updatingSelectedItems = false;
            this._selector.SelectionChange.End(); 
        },
        /// <summary>
        /// Add an ItemInfo to the deferred selection
        /// </summary> 
//        internal void 
        Add:function(/*ItemsControl.ItemInfo*/ info)
        { 
//            if (!this._selector.SelectionChange.IsActive || !this._updatingSelectedItems) 
//            {
//                throw new InvalidOperationException(SR.Get(SRID.DeferSelectionNotActive)); 
//            }
//
//            this._selector.SelectionChange.Select(info, true /* assumeInItemsCollection */);
            //cym modified, override base method
        	if(info instanceof ItemInfo){
                if (!this._selector.SelectionChange.IsActive || !this._updatingSelectedItems) 
                {
                    throw new InvalidOperationException(SR.Get(SRID.DeferSelectionNotActive)); 
                }

                this._selector.SelectionChange.Select(info, true /* assumeInItemsCollection */);
        	}else{
        		ObservableCollection.prototype.Add.call(this, info);
        	}
        }, 

        /// <summary> 
        /// Remove an ItemInfo from the deferred selection 
        /// </summary>
//        internal void 
        Remove:function(/*ItemsControl.ItemInfo*/ info) 
        {
//            if (!this._selector.SelectionChange.IsActive || !this._updatingSelectedItems)
//            {
//                throw new InvalidOperationException(SR.Get(SRID.DeferSelectionNotActive)); 
//            }
// 
//            this._selector.SelectionChange.Unselect(info); 
        	
        	//cym modified, override base method
        	if(info instanceof ItemInfo){
                if (!this._selector.SelectionChange.IsActive || !this._updatingSelectedItems)
                {
                    throw new InvalidOperationException(SR.Get(SRID.DeferSelectionNotActive)); 
                }
     
                this._selector.SelectionChange.Unselect(info); 
        	}else{
        		ObservableCollection.prototype.Remove.call(this, info);
        	}
        }
        
	});
	
	Object.defineProperties(SelectedItemCollection.prototype,{
//		internal bool 
		IsChanging:{ get:function() { return (this._changeCount > 0); } },
        /// <summary> 
        /// Returns true after BeginUpdateSelectedItems is called
        /// </summary>
//        internal bool 
        IsUpdatingSelectedItems:
        { 
            get:function()
            { 
                return this._selector.SelectionChange.IsActive || this._updatingSelectedItems; 
            }
        }
		
	});
	
	SelectedItemCollection.Type = new Type("SelectedItemCollection", SelectedItemCollection, [ObservableCollection.Type]);
	return SelectedItemCollection;
});

 
//        int _changeCount;
//        Changer _changer; 
//
//
//
// 
//        // Keep a reference for Selector owner
//        private Selector _selector; 
// 
//        // We need a flag for indicating user bulk selection mode. We cannot re-use SelectionChange.IsActive because there are cases when SelectionChange.IsActive==true and SelectedItems.Add is called internally (End()) to update the collection
//        // When EndUpdateSelectedItems() is called we first reset this flag to allow SelectedItems.Add to change the collection 
//        private bool _updatingSelectedItems;




