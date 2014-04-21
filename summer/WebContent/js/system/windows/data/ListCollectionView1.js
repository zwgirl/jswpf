/**
 * ListCollectionView
 */

define(["dojo/_base/declare", "system/Type", "data/CollectionView", "data/CollectionViewGroupRoot", 
        "specialized/NotifyCollectionChangedEventArgs", "componentmodel/IEditableCollectionViewAddNewItem",
        "componentmodel/IItemProperties", "specialized/NotifyCollectionChangedAction", "collections/IList",
        "system/EventHandler", "specialized/NotifyCollectionChangedEventHandler",
        "componentmodel/ISupportInitialize", "collections/ArrayList",
        "componentmodel/NewItemPlaceholderPosition", "internal.data/LiveShapingList"], 
		function(declare, Type, CollectionView, CollectionViewGroupRoot, 
				NotifyCollectionChangedEventArgs, IEditableCollectionViewAddNewItem,
				IItemProperties, NotifyCollectionChangedAction, IList,
				EventHandler, NotifyCollectionChangedEventHandler,
				ISupportInitialize, ArrayList,
				NewItemPlaceholderPosition, LiveShapingList){
	
//  private const int           
	var _unknownIndex = -1;
	var ListCollectionView = declare("ListCollectionView", 
			[CollectionView, IEditableCollectionViewAddNewItem, IItemProperties],{
		"-chains-": 
		{
		      constructor: "manual"
		},
		constructor:function(/*IList*/ list) 
        {
//            base(list);
			CollectionView.prototype.constructor.call(this, list);
            
//          private bool                
            this._isGrouping = false;
//          private IComparer           
            this._activeComparer = null; 
//          private Predicate<object>   
            this._activeFilter = null; 
//          private SortDescriptionCollection  
            this._sort = null;
//          private IComparer           
            this._customSort = null; 
//          private ArrayList           
            this._shadowCollection = null;
//          private bool                
            this._applyChangeToShadow = false;
//          private bool                
            this._currentElementWasRemoved = false;  // true if we need to MoveCurrencyOffDeletedElement
//          private object              
            this._newItem = CollectionView.NoNewItem; 
//          private object              
            this._editItem;
//          private int                 
            this._newItemIndex = 0;  // position _newItem in the source collection 
//          private NewItemPlaceholderPosition 
            this._newItemPlaceholderPosition = 0; 
//          private bool                
            this._isItemConstructorValid = false;
//          private ConstructorInfo     
            this._itemConstructor = null; 
            
            this._internalList = list; 

            if (this.InternalList.Count == 0)    // don't call virtual IsEmpty in ctor
            {
            	this.SetCurrent(null, -1, 0); 
            }else 
            { 
            	this.SetCurrent(this.InternalList.Get(0), 0, 1);
            } 

            this._group = new CollectionViewGroupRoot(this);
            this._group.GroupDescriptionChanged.Combine(new EventHandler(this, this.OnGroupDescriptionChanged));
            this._group.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnGroupChanged)); 
            this._group.GroupDescriptions.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnGroupByChanged));

        },
        
        /// <summary>
        /// Re-create the view over the associated IList 
        /// </summary>
        /// <remarks> 
        /// Any sorting and filtering will take effect during Refresh. 
        /// </remarks>
//        protected override void 
        RefreshOverride:function() 
        {
            this.ClearChangeLog(); 
            if (this.UpdatedOutsideDispatcher)
            { 
            	this.ShadowCollection = new ArrayList(this.SourceCollection); 
            }

            var oldCurrentItem = this.CurrentItem;
            var oldCurrentPosition = this.IsEmpty ? -1 : this.CurrentPosition;
            var oldIsCurrentAfterLast = this.IsCurrentAfterLast; 
            var oldIsCurrentBeforeFirst = this.IsCurrentBeforeFirst;
 
            // force currency off the collection (gives user a chance to save dirty information) 
            this.OnCurrentChanging();
 
            /*IList*/var list = this.UpdatedOutsideDispatcher ? this.ShadowCollection : 
            	(this.SourceCollection instanceof IList ? this.SourceCollection : null);
            this.PrepareSortAndFilter(list);

            // if there's no sort/filter, just use the collection's array 
            if (!this.UsesLocalArray)
            { 
            	this._internalList = list; 
            }else{
            	this._internalList = this.PrepareLocalArray(list);
            }
 
            this.PrepareGroups();
 
            if (oldIsCurrentBeforeFirst || this.IsEmpty) 
            {
            	this.SetCurrent(null, -1); 
            }else if (oldIsCurrentAfterLast){
            	this.SetCurrent(null, this.InternalCount); 
            }else { // set currency back to old current item  
                // oldCurrentItem may be null
 
                // if there are duplicates, use the position of the first matching item
                var newPosition = this.InternalIndexOf(oldCurrentItem);

                if (newPosition < 0) 
                {
                    // oldCurrentItem not found: move to first item 
                    var newItem; 
                    newPosition = (this.NewItemPlaceholderPosition == this.NewItemPlaceholderPosition.AtBeginning) ?
                                1 : 0; 
                    if (newPosition < this.InternalCount && (newItem = this.InternalItemAt(newPosition)) != this.NewItemPlaceholder)
                    {
                    	this.SetCurrent(newItem, newPosition);
                    }else{ 
                    	this.SetCurrent(null, -1); 
                    }
                }else{
                	this.SetCurrent(oldCurrentItem, newPosition);
                } 
            }
 
            // tell listeners everything has changed 
            this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithA(NotifyCollectionChangedAction.Reset));
 
            this.OnCurrentChanged();

            if (this.IsCurrentAfterLast != oldIsCurrentAfterLast)
            	this.OnPropertyChanged(this.IsCurrentAfterLastPropertyName); 

            if (this.IsCurrentBeforeFirst != oldIsCurrentBeforeFirst) 
            	this.OnPropertyChanged(this.IsCurrentBeforeFirstPropertyName); 

            if (oldCurrentPosition != this.CurrentPosition) 
            	this.OnPropertyChanged(this.CurrentPositionPropertyName);

            if (oldCurrentItem != this.CurrentItem)
            	this.OnPropertyChanged(this.CurrentItemPropertyName); 

        }, 
        
        /// <summary>
        /// Return true if the item belongs to this view.  No assumptions are 
        /// made about the item. This method will behave similarly to IList.Contains()
        /// and will do an exhaustive search through all items in this view.
        /// If the caller knows that the item belongs to the
        /// underlying collection, it is more efficient to call PassesFilter. 
        /// </summary>
//        public override bool 
        Contains:function(/*object*/ item) 
        { 
        	this.VerifyRefreshNotDeferred();
 
            return this.InternalContains(item);
        },

        /// <summary> 
        /// Move <seealso cref="CurrentItem"/> to the item at the given index.
        /// </summary> 
        /// <param name="position">Move CurrentItem to this index</param> 
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns>
//        public override bool 
        MoveCurrentToPosition:function(/*int*/ position) 
        {
        	this.VerifyRefreshNotDeferred();

            if (position < -1 || position > this.InternalCount) 
                throw new ArgumentOutOfRangeException("position");
 
 
            if (position != this.CurrentPosition || !this.IsCurrentInSync)
            { 
                var proposedCurrentItem = (0 <= position && position < this.InternalCount) ? this.InternalItemAt(position) : null;

                // ignore moves to the placeholder
                if (proposedCurrentItem != this.NewItemPlaceholder) 
                {
                    if (this.OKToChangeCurrent()) 
                    { 
                        var oldIsCurrentAfterLast = this.IsCurrentAfterLast;
                        var oldIsCurrentBeforeFirst = this.IsCurrentBeforeFirst; 

                        this.SetCurrent(proposedCurrentItem, position);

                        this.OnCurrentChanged(); 

                        // notify that the properties have changed. 
                        if (this.IsCurrentAfterLast != oldIsCurrentAfterLast) 
                        	this.OnPropertyChanged(this.IsCurrentAfterLastPropertyName);
 
                        if (this.IsCurrentBeforeFirst != oldIsCurrentBeforeFirst)
                        	this.OnPropertyChanged(this.IsCurrentBeforeFirstPropertyName);

                        this.OnPropertyChanged(this.CurrentPositionPropertyName); 
                        this.OnPropertyChanged(this.CurrentItemPropertyName);
                    } 
                } 
            }
 
            return this.IsCurrentInView;
        },
        
        /// <summary> 
        /// Return true if the item belongs to this view.  The item is assumed to belong to the 
        /// underlying DataCollection;  this method merely takes filters into account.
        /// It is commonly used during collection-changed notifications to determine if the added/removed 
        /// item requires processing.
        /// Returns true if no filter is set on collection view.
        /// </summary>
//        public override bool 
        PassesFilter:function(/*object*/ item) 
        {
            return this.ActiveFilter == null || this.ActiveFilter(item); 
        },

        /// <summary> Return the index where the given item belongs, or -1 if this index is unknown. 
        /// </summary>
        /// <remarks>
        /// If this method returns an index other than -1, it must always be true that
        /// view[index-1] &lt; item &lt;= view[index], where the comparisons are done via 
        /// the view's IComparer.Compare method (if any).
        /// (This method is used by a listener's (e.g. System.Windows.Controls.ItemsControl) 
        /// CollectionChanged event handler to speed up its reaction to insertion and deletion of items. 
        /// If IndexOf is  not implemented, a listener does a binary search using IComparer.Compare.)
        /// </remarks> 
        /// <param name="item">data item</param>
//        public override int 
        IndexOf:function(/*object*/ item)
        {
        	this.VerifyRefreshNotDeferred(); 

            return this.InternalIndexOf(item); 
        },

        /// <summary> 
        /// Retrieve item at the given zero-based index in this CollectionView.
        /// </summary>
        /// <remarks>
        /// <p>The index is evaluated with any SortDescriptions or Filter being set on this CollectionView.</p> 
        /// </remarks>
        /// <exception cref="ArgumentOutOfRangeException"> 
        /// Thrown if index is out of range 
        /// </exception>
//        public override object 
        GetItemAt:function(/*int*/ index) 
        {
        	this.VerifyRefreshNotDeferred();

            return this.InternalItemAt(index); 
        },
 
        /// <summary> Return -, 0, or +, according to whether o1 occurs before, at, or after o2 (respectively)
        /// </summary> 
        /// <param name="o1">first object</param> 
        /// <param name="o2">second object</param>
        /// <remarks> 
        /// Compares items by their resp. index in the IList.
        /// </remarks>
//        protected virtual int 
        Compare:function(/*object*/ o1, /*object*/ o2)
        { 
            if (!this.IsGrouping)
            { 
                if (this.ActiveComparer != null) 
                    return this.ActiveComparer.Compare(o1, o2);
 
                var i1 = this.InternalList.IndexOf(o1);
                var i2 = this.InternalList.IndexOf(o2);
                return (i1 - i2);
            } 
            else
            { 
                var i1 = this.InternalIndexOf(o1); 
                var i2 = this.InternalIndexOf(o2);
                return (i1 - i2); 
            }
        },

        /// Implementation of IEnumerable.GetEnumerator(). 
        /// This provides a way to enumerate the members of the collection
        /// without changing the currency. 
        /// </summary>
//        protected override IEnumerator 
        GetEnumerator:function()
        {
        	this.VerifyRefreshNotDeferred(); 

            return this.InternalGetEnumerator(); 
        },
        
//        void 
        EnsureItemConstructor:function()
        { 
            if (!this._isItemConstructorValid) 
            {
                var itemType = this.GetItemType(true); 
                if (itemType != null)
                {
                	this._itemConstructor = itemType.GetConstructor(Type.EmptyTypes);
                	this._isItemConstructorValid = true; 
                }
            } 
        }, 

        /// <summary> 
        /// Add a new item to the underlying collection.  Returns the new item.
        /// After calling AddNew and changing the new item as desired, either
        /// <seealso cref="CommitNew"/> or <seealso cref="CancelNew"/> should be
        /// called to complete the transaction. 
        /// </summary>
//        public object 
        AddNew:function() 
        { 
        	this.VerifyRefreshNotDeferred();
 
            if (this.IsEditingItem)
            {
            	this.CommitEdit();   // implicitly close a previous EditItem
            } 

            this.CommitNew();        // implicitly close a previous AddNew 
 
            if (!this.CanAddNew)
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "AddNew")); 

            return this.AddNewCommon(this._itemConstructor.Invoke(null));
        },
 
        /// <summary>
        /// Add a new item to the underlying collection.  Returns the new item. 
        /// After calling AddNewItem and changing the new item as desired, either 
        /// <seealso cref="CommitNew"/> or <seealso cref="CancelNew"/> should be
        /// called to complete the transaction. 
        /// </summary>
//        public object 
        AddNewItem:function(/*object*/ newItem)
        {
        	this.VerifyRefreshNotDeferred(); 

            if (this.IsEditingItem) 
            { 
            	this.CommitEdit();   // implicitly close a previous EditItem
            } 

            this.CommitNew();        // implicitly close a previous AddNew

            if (!this.CanAddNewItem) 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "AddNewItem"));
 
            return this.AddNewCommon(newItem); 
        },
 
//        object 
        AddNewCommon:function(/*object*/ newItem)
        {
        	this._newItemIndex = -2; // this is a signal that the next Add event comes from AddNew
            var index = this.SourceList.Add(newItem); 

            // if the source doesn't raise collection change events, fake one 
            if (!(this.SourceList instanceof INotifyCollectionChanged)) 
            {
                // the index returned by IList.Add isn't always reliable 
                if (!Object.Equals(newItem, this.SourceList.Get(index)))
                {
                    index = this.SourceList.IndexOf(newItem);
                } 

                this.BeginAddNew(newItem, index); 
            } 

            this.MoveCurrentTo(newItem);

            /*ISupportInitialize*/var isi = newItem instanceof ISupportInitialize ? newItem : null; 
            if (isi != null)
            { 
                isi.BeginInit(); 
            }
 
            /*IEditableObject*/var ieo = newItem instanceof IEditableObject ? newItem : null;
            if (ieo != null)
            {
                ieo.BeginEdit(); 
            }
 
            return newItem; 
        },
 
        // Calling IList.Add() will raise an ItemAdded event.  We handle this specially
        // to adjust the position of the new item in the view (it should be adjacent
        // to the placeholder), and cache the new item for use by the other APIs
        // related to AddNew.  This method is called from ProcessCollectionChanged. 
//        void 
        BeginAddNew:function(/*object*/ newItem, /*int*/ index)
        { 
//            Debug.Assert(_newItemIndex == -2 && _newItem == NoNewItem, "unexpected call to BeginAddNew"); 

            // remember the new item and its position in the underlying list 
        	this.SetNewItem(newItem);
        	this._newItemIndex = index;

            // adjust the position of the new item 
            var position = -1;
            switch (this.NewItemPlaceholderPosition) 
            { 
                case NewItemPlaceholderPosition.None:
                    position = this.UsesLocalArray ? this.InternalCount - 1 : this._newItemIndex; 
                    break;
                case NewItemPlaceholderPosition.AtBeginning:
                    position = 1;
                    break; 
                case NewItemPlaceholderPosition.AtEnd:
                    position = this.InternalCount - 2; 
                    break; 
            }
 
            // raise events as if the new item appeared in the adjusted position
            this.ProcessCollectionChangedWithAdjustedIndex(
                /*new NotifyCollectionChangedEventArgs(
                        NotifyCollectionChangedAction.Add, 
                        newItem,
                        position)*/
        		NotifyCollectionChangedEventArgs.BuildWithAOI(
        				NotifyCollectionChangedAction.Add, 
                        newItem,
                        position), 
                -1, position); 
        },
 
        /// <summary>
        /// Complete the transaction started by <seealso cref="AddNew"/>.  The new
        /// item remains in the collection, and the view's sort, filter, and grouping
        /// specifications (if any) are applied to the new item. 
        /// </summary>
//        public void 
        CommitNew:function() 
        { 
            if (this.IsEditingItem)
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringTransaction, "CommitNew", "EditItem")); 
            VerifyRefreshNotDeferred();

            if (this._newItem == CollectionView.NoNewItem)
                return; 

            // grouping works differently 
            if (this.IsGrouping) 
            {
            	this.CommitNewForGrouping(); 
                return;
            }

            // from the POV of view clients, the new item is moving from its 
            // position adjacent to the placeholder to its real position.
            // Remember its current position (have to do this before calling EndNew, 
            // because InternalCount depends on "adding-new" mode). 
            var fromIndex = 0;
            switch (this.NewItemPlaceholderPosition) 
            {
                case NewItemPlaceholderPosition.None:
                    fromIndex = this.UsesLocalArray ? this.InternalCount - 1 : this._newItemIndex;
                    break; 
                case NewItemPlaceholderPosition.AtBeginning:
                    fromIndex = 1; 
                    break; 
                case NewItemPlaceholderPosition.AtEnd:
                    fromIndex = this.InternalCount - 2; 
                    break;
            }

            // End the AddNew transaction 
            var newItem = this.EndAddNew(false);
 
            // Tell the view clients what happened to the new item 
            var toIndex = this.AdjustBefore(NotifyCollectionChangedAction.Add, newItem, this._newItemIndex);
 
            if (toIndex < 0)
            {
                // item is effectively removed (due to filter), raise a Remove event
            	this.ProcessCollectionChangedWithAdjustedIndex( 
                            /*new NotifyCollectionChangedEventArgs(
                                                NotifyCollectionChangedAction.Remove, 
                                                newItem, 
                                                fromIndex)*/
            			NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, 
                                newItem, 
                                fromIndex),
                            fromIndex, -1); 
            }
            else if (fromIndex == toIndex)
            {
                // item isn't moving, so no events are needed.  But the item does need 
                // to be added to the local array.
                if (this.UsesLocalArray) 
                { 
                    if (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning)
                    { 
                        --toIndex;
                    }
                    this.InternalList.Insert(toIndex, newItem);
                } 
            }
            else 
            { 
                // item is moving
            	this.ProcessCollectionChangedWithAdjustedIndex( 
                            /*new NotifyCollectionChangedEventArgs(
                                                NotifyCollectionChangedAction.Move,
                                                newItem,
                                                toIndex, fromIndex)*/
            			NotifyCollectionChangedEventArgs.BuildWithAOII(
            					NotifyCollectionChangedAction.Move,
                                newItem,
                                toIndex, fromIndex), 
                            fromIndex, toIndex);
            } 
        },

//        void 
        CommitNewForGrouping:function() 
        {
            // for grouping we cannot pretend that the new item moves to a different position,
            // since it may actually appear in several new positions (belonging to several groups).
            // Instead, we remove the item from its temporary position, then add it to the groups 
            // as if it had just been added to the underlying collection.
            var index; 
            switch (NewItemPlaceholderPosition) 
            {
                case NewItemPlaceholderPosition.None: 
                default:
                    index = this._group.Items.Count - 1;
                    break;
                case NewItemPlaceholderPosition.AtBeginning: 
                    index = 1;
                    break; 
                case NewItemPlaceholderPosition.AtEnd: 
                    index = this._group.Items.Count - 2;
                    break; 
            }

            // End the AddNew transaction
            var newItemIndex = this._newItemIndex; 
            var newItem = this.EndAddNew(false);
 
            // remove item from its temporary position 
            this._group.RemoveSpecialItem(index, newItem, false /*loading*/);
 
            // now pretend it just got added to the collection.  This will add it
            // to the internal list with sort/filter, and to the groups
            this.ProcessCollectionChanged(
                    /*new NotifyCollectionChangedEventArgs( 
                                NotifyCollectionChangedAction.Add,
                                newItem, 
                                newItemIndex)*/
            		NotifyCollectionChangedEventArgs.BuildWithAOI(
            				NotifyCollectionChangedAction.Add,
                            newItem, 
                            newItemIndex)); 
        },
 
        /// <summary>
        /// Complete the transaction started by <seealso cref="AddNew"/>.  The new
        /// item is removed from the collection.
        /// </summary> 
//        public void 
        CancelNew:function()
        { 
            if (this.IsEditingItem) 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringTransaction, "CancelNew", "EditItem"));
            this.VerifyRefreshNotDeferred(); 

            if (this._newItem == CollectionView.NoNewItem)
                return;
 
            // remove the new item from the underlying collection.  Normally the
            // collection will raise a Remove event, which we'll handle by calling 
            // EndNew to leave AddNew mode. 
            this.SourceList.RemoveAt(this._newItemIndex);
 
            // if the collection doesn't raise events, do the work explicitly on its behalf
            if (this._newItem != CollectionView.NoNewItem)
            {
                var index = this.AdjustBefore(NotifyCollectionChangedAction.Remove, this._newItem, this._newItemIndex); 
                var newItem = this.EndAddNew(true);
 
                this.ProcessCollectionChangedWithAdjustedIndex( 
                            /*new NotifyCollectionChangedEventArgs(
                                                NotifyCollectionChangedAction.Remove, 
                                                newItem,
                                                index)*/
                		NotifyCollectionChangedEventArgs.BuildWithAOI(
                				NotifyCollectionChangedAction.Remove, 
                                newItem,
                                index),
                            index, -1);
            } 
        },
 
        // Common functionality used by CommitNew, CancelNew, and when the 
        // new item is removed by Remove or Refresh.
//        object 
        EndAddNew:function(/*bool*/ cancel) 
        {
            var newItem = this._newItem;

            this.SetNewItem(CollectionView.NoNewItem);  // leave "adding-new" mode 

            /*IEditableObject*/var ieo = newItem instanceof IEditableObject ? newItem : null; 
            if (ieo != null) 
            {
                if (cancel) 
                {
                    ieo.CancelEdit();
                }
                else 
                {
                    ieo.EndEdit(); 
                } 
            }
 
            /*ISupportInitialize*/var isi = newItem instanceof ISupportInitialize ? newItem : null;
            if (isi != null)
            {
                isi.EndInit(); 
            }
 
            return newItem; 
        },
        

//      void 
        SetNewItem:function(/*object*/ item) 
        {
        	if (!Object.Equals(item, this._newItem))
        	{
        		this._newItem = item; 

        		this.OnPropertyChanged("CurrentAddItem"); 
        		this.OnPropertyChanged("IsAddingNew"); 
        		this.OnPropertyChanged("CanRemove");
        	} 
        },
        
        /// <summary> 
        /// Remove the item at the given index from the underlying collection.
        /// The index is interpreted with respect to the view (not with respect to 
        /// the underlying collection).
        /// </summary>
//        public void 
        RemoveAt:function(/*int*/ index)
        { 
            if (IsEditingItem || this.IsAddingNew)
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "RemoveAt")); 
            this.VerifyRefreshNotDeferred(); 

            // convert the index from "view-relative" to "list-relative" 
            var delta = (this.NewItemPlaceholderPosition == this.NewItemPlaceholderPosition.AtBeginning) ? 1 : 0;
            var item = this.GetItemAt(index);
            if (item == this.CollectionView.NewItemPlaceholder)
                throw new InvalidOperationException(SR.Get(SRID.RemovingPlaceholder)); 

            var listIndex = index - delta; 
            var raiseEvent = !(this.SourceList.isInstanceOf(INotifyCollectionChanged)); 

            // remove the item from the list 
            if (this.UsesLocalArray || this.IsGrouping)
            {
                if (raiseEvent)
                { 
                    listIndex = this.SourceList.IndexOf(item);
                    this.SourceList.RemoveAt(listIndex); 
                } 
                else
                { 
                	this.SourceList.Remove(item);
                }
            }
            else 
            {
            	this.SourceList.RemoveAt(listIndex); 
            } 

            // if the list doesn't raise CollectionChanged events, fake one 
            if (raiseEvent)
            {
            	this.ProcessCollectionChanged(/*new NotifyCollectionChangedEventArgs(
                                            NotifyCollectionChangedAction.Remove, 
                                            item,
                                            listIndex)*/
            			NotifyCollectionChangedEventArgs.BuildWithAOI(
            					NotifyCollectionChangedAction.Remove, 
                                item,
                                listIndex)); 
            } 
        },
 
        /// <summary>
        /// Remove the given item from the underlying collection.
        /// </summary>
//        public void 
        Remove:function(/*object*/ item) 
        {
            var index = this.InternalIndexOf(item); 
            if (index >= 0) 
            {
            	this.RemoveAt(index); 
            }
        },
 
        /// <summary>
        /// Begins an editing transaction on the given item.  The transaction is 
        /// completed by calling either <seealso cref="CommitEdit"/> or
        /// <seealso cref="CancelEdit"/>.  Any changes made to the item during
        /// the transaction are considered "pending", provided that the view supports
        /// the notion of "pending changes" for the given item. 
        /// </summary>
//        public void 
        EditItem:function(/*object*/ item) 
        { 
        	this.VerifyRefreshNotDeferred();
 
            if (item == this.NewItemPlaceholder)
                throw new ArgumentException(SR.Get(SRID.CannotEditPlaceholder), "item");

            if (this.IsAddingNew) 
            {
                if (Object.Equals(item, this._newItem)) 
                    return;     // EditItem(newItem) is a no-op 

                this.CommitNew();    // implicitly close a previous AddNew 
            }

            this.CommitEdit();   // implicitly close a previous EditItem transaction
 
            this.SetEditItem(item);
 
            /*IEditableObject*/var ieo = item instanceof IEditableObject ? item : null; 
            if (ieo != null)
            { 
                ieo.BeginEdit();
            }
        },
 
        /// <summary>
        /// Complete the transaction started by <seealso cref="EditItem"/>. 
        /// The pending changes (if any) to the item are committed. 
        /// </summary>
//        public void 
        CommitEdit:function() 
        {
            if (this.IsAddingNew)
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringTransaction, "CommitEdit", "AddNew"));
            this.VerifyRefreshNotDeferred(); 

            if (this._editItem == null) 
                return; 

            var editItem = this._editItem; 
            /*IEditableObject*/var ieo = this._editItem instanceof IEditableObject ? this._editItem : null;
            this.SetEditItem(null);

            if (ieo != null) 
            {
                ieo.EndEdit(); 
            } 

            // see if the item is entering or leaving the view 
            var fromIndex = this.InternalIndexOf(editItem);
            var wasInView = (fromIndex >= 0);
            var isInView = wasInView ? this.PassesFilter(editItem)
                                    : this.SourceList.Contains(editItem) && this.PassesFilter(editItem); 

            // editing may change the item's group names (and we can't tell whether 
            // it really did).  The best we can do is remove the item and re-insert 
            // it.
            if (this.IsGrouping) 
            {
                if (wasInView)
                {
                	this.RemoveItemFromGroups(editItem); 
                }
                if (isInView) 
                { 
                	this.AddItemToGroups(editItem);
                } 
                return;
            }

            // the edit may cause the item to move.  If so, report it. 
            if (this.UsesLocalArray)
            { 
                /*ArrayList*/var list = this.InternalList; 
                var delta = (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) ? 1 : 0;
                var toIndex = -1; 

                if (wasInView)
                {
                    if (!isInView) 
                    {
                        // the item has been effectively removed 
                    	this.ProcessCollectionChangedWithAdjustedIndex( 
                                    /*new NotifyCollectionChangedEventArgs(
                                                        NotifyCollectionChangedAction.Remove, 
                                                        editItem,
                                                        fromIndex)*/
                    			NotifyCollectionChangedEventArgs.BuildWithAOI(
                    					NotifyCollectionChangedAction.Remove, 
                                        editItem,
                                        fromIndex),
                                                        
                                    fromIndex, -1);
                    } 
                    else if (this.ActiveComparer != null)
                    { 
                        // the item may have moved within the view 
                        var localIndex = fromIndex - delta;
                        if (localIndex > 0 && ActiveComparer.Compare(list[localIndex-1], editItem) > 0) 
                        {
                            // the item has moved toward the front of the list
                            toIndex = list.BinarySearch(0, localIndex, editItem, ActiveComparer);
                            if (toIndex < 0) 
                                toIndex = ~toIndex;
                        } 
                        else if (localIndex < list.Count - 1 && ActiveComparer.Compare(editItem, list[localIndex+1]) > 0) 
                        {
                            // the item has moved toward the back of the list 
                            toIndex = list.BinarySearch(localIndex+1, list.Count-localIndex-1, editItem, ActiveComparer);
                            if (toIndex < 0)
                                toIndex = ~toIndex;
                            --toIndex;      // because the item is leaving its old position 
                        }
 
                        if (toIndex >= 0) 
                        {
                            // the item has effectively moved 
                        	this.ProcessCollectionChangedWithAdjustedIndex(
                                        /*new NotifyCollectionChangedEventArgs(
                                                            NotifyCollectionChangedAction.Move,
                                                            editItem, 
                                                            toIndex+delta, fromIndex)*/
                        			NotifyCollectionChangedEventArgs.BuildWithAOII(
                        					NotifyCollectionChangedAction.Move,
                                            editItem, 
                                            toIndex+delta, fromIndex),
                                        fromIndex, toIndex+delta); 
                        } 
                    }
                } 
                else if (isInView)
                {
                    // the item has effectively been added
                    toIndex = AdjustBefore(NotifyCollectionChangedAction.Add, editItem, this.SourceList.IndexOf(editItem)); 
                    ProcessCollectionChangedWithAdjustedIndex(
                                /*new NotifyCollectionChangedEventArgs( 
                                            NotifyCollectionChangedAction.Add, 
                                            editItem,
                                            toIndex+delta)*/
                    		NotifyCollectionChangedEventArgs.BuildWithAOI(
                    				NotifyCollectionChangedAction.Add, 
                                    editItem,
                                    toIndex+delta), 
                                -1, toIndex+delta);
                }
            }
        }, 

        /// <summary> 
        /// Complete the transaction started by <seealso cref="EditItem"/>. 
        /// The pending changes (if any) to the item are discarded.
        /// </summary> 
//        public void 
        CancelEdit:function()
        {
            if (this.IsAddingNew)
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringTransaction, "CancelEdit", "AddNew")); 
            this.VerifyRefreshNotDeferred();
 
            if (this._editItem == null) 
                return;
 
            var ieo = this._editItem instanceof IEditableObject ? this._editItem : null;
            this.SetEditItem(null);

            if (ieo != null) 
            {
                ieo.CancelEdit(); 
            } 
            else
                throw new InvalidOperationException(SR.Get(SRID.CancelEditNotSupported)); 
        },

//        private void 
        ImplicitlyCancelEdit:function()
        { 
            var ieo = this._editItem instanceof IEditableObject ? this._editItem : null;
            this.SetEditItem(null); 
 
            if (ieo != null)
            { 
                ieo.CancelEdit();
            }
        },
        
//        void 
        SetEditItem:function(/*object*/ item)
        { 
            if (!Object.Equals(item, this._editItem))
            {
            	this._editItem = item;
 
            	this.OnPropertyChanged("CurrentEditItem");
            	this.OnPropertyChanged("IsEditingItem"); 
            	this.OnPropertyChanged("CanCancelEdit"); 
            	this.OnPropertyChanged("CanAddNew");
            	this.OnPropertyChanged("CanAddNewItem"); 
            	this.OnPropertyChanged("CanRemove");
            }
        },

        /// <summary> 
        ///     Called by the the base class to notify derived class that
        ///     a CollectionChange has been posted to the message queue. 
        ///     The purpose of this notification is to allow CollectionViews to
        ///     take a snapshot of whatever information is needed at the time
        ///     of the Post (most likely the state of the Data Collection).
        /// </summary> 
        /// <param name="args">
        ///     The NotifyCollectionChangedEventArgs that is added to the change log 
        /// </param> 
//        protected override void 
        OnBeginChangeLogging:function(/*NotifyCollectionChangedEventArgs*/ args)
        { 
            if (args == null)
                throw new ArgumentNullException("args");

            if (this.ShadowCollection == null || args.Action == NotifyCollectionChangedAction.Reset) 
            {
            	this.ShadowCollection = new ArrayList(this.SourceCollection); 
 
                if (!this.UsesLocalArray)
                { 
                	this._internalList = this.ShadowCollection;
                }

                // the first change processed in ProcessChangeLog does 
                // not need to be applied to the ShadowCollection in
                // ProcessChangeLog because the change will already be 
                // reflected as a result of copying the Collection. 
                this._applyChangeToShadow = false;
            } 
        },

        /// <summary>
        /// Handle CollectionChange events 
        /// </summary>
//        protected override void 
        ProcessCollectionChanged:function(/*NotifyCollectionChangedEventArgs*/ args) 
        { 
            if (args == null)
                throw new ArgumentNullException("args"); 

            this.ValidateCollectionChangedEventArgs(args);

            // adding or replacing an item can change CanAddNew, by providing a 
            // non-null representative
            if (!this._isItemConstructorValid) 
            { 
                switch (args.Action)
                { 
                    case NotifyCollectionChangedAction.Reset:
                    case NotifyCollectionChangedAction.Add:
                    case NotifyCollectionChangedAction.Replace:
                        OnPropertyChanged("CanAddNew"); 
                        break;
                } 
            } 

            var adjustedOldIndex = -1; 
            var adjustedNewIndex = -1;

            // apply the change to the shadow copy
            if (this.UpdatedOutsideDispatcher) 
            {
                if (this._applyChangeToShadow) 
                { 
                    if (args.Action != NotifyCollectionChangedAction.Reset)
                    { 
                        if (args.Action != NotifyCollectionChangedAction.Remove && args.NewStartingIndex < 0
                            || args.Action != NotifyCollectionChangedAction.Add && args.OldStartingIndex < 0)
                        {
//                            Debug.Assert(false, "Cannot update collection view from outside UIContext without index in event args"); 
                            return;     //
                        } 
                        else 
                        {
                        	this.AdjustShadowCopy(args); 
                        }
                    }
                }
                this._applyChangeToShadow = true; 
            }
 
            // If the Action is Reset then we do a Refresh. 
            if (args.Action == NotifyCollectionChangedAction.Reset)
            { 
                // implicitly cancel EditItem transactions
                if (this.IsEditingItem)
                {
                	this.ImplicitlyCancelEdit(); 
                }
 
                // adjust AddNew transactions, depending on whether the new item 
                // survived the Reset
                if (this.IsAddingNew) 
                {
                	this._newItemIndex = this.SourceList.IndexOf(this._newItem);
                    if (this._newItemIndex < 0)
                    { 
                    	this.EndAddNew(true);
                    } 
                } 

                this.RefreshOrDefer(); 
                return; // the Refresh raises collection change event, so there's nothing left to do
            }

            if (args.Action == NotifyCollectionChangedAction.Add && this._newItemIndex == -2) 
            {
                // The Add event came from AddNew. 
            	this.BeginAddNew(args.NewItems[0], args.NewStartingIndex); 
                return;
            } 

            // If the Action is one that can be expected to have a valid NewItems[0] and NewStartingIndex then
            // adjust the index for filtering and sorting.
            if (args.Action != NotifyCollectionChangedAction.Remove) 
            {
                adjustedNewIndex =this. AdjustBefore(NotifyCollectionChangedAction.Add, args.NewItems[0], args.NewStartingIndex); 
            } 

            // If the Action is one that can be expected to have a valid OldItems[0] and OldStartingIndex then 
            // adjust the index for filtering and sorting.
            if (args.Action != NotifyCollectionChangedAction.Add)
            {
                adjustedOldIndex = this.AdjustBefore(NotifyCollectionChangedAction.Remove, args.OldItems[0], args.OldStartingIndex); 

                // the new index needs further adjustment if the action removes (or moves) 
                // something before it 
                if (this.UsesLocalArray && adjustedOldIndex >= 0 && adjustedOldIndex < adjustedNewIndex)
                { 
                    -- adjustedNewIndex;
                }
            }
 
            // handle interaction with AddNew and EditItem
            switch (args.Action) 
            { 
                case NotifyCollectionChangedAction.Add:
                    if (args.NewStartingIndex <= this._newItemIndex) 
                    {
                        ++ this._newItemIndex;
                    }
                    break; 

                case NotifyCollectionChangedAction.Remove: 
                    if (args.OldStartingIndex < this._newItemIndex) 
                    {
                        -- this._newItemIndex; 
                    }

                    // implicitly cancel AddNew and/or EditItem transactions if the relevant item is removed
                    var item = args.OldItems[0]; 

                    if (item == this.CurrentEditItem) 
                    { 
                    	this.ImplicitlyCancelEdit();
                    } 
                    else if (item == this.CurrentAddItem)
                    {
                    	this.EndAddNew(true);
                    } 
                    break;
 
                case NotifyCollectionChangedAction.Move: 
                    if (args.OldStartingIndex < this._newItemIndex && this._newItemIndex < args.NewStartingIndex)
                    { 
                        -- this._newItemIndex;
                    }
                    else if (args.NewStartingIndex <= this._newItemIndex && this._newItemIndex < args.OldStartingIndex)
                    { 
                        ++ this._newItemIndex;
                    } 
                    break; 
            }
 
            this.ProcessCollectionChangedWithAdjustedIndex(args, adjustedOldIndex, adjustedNewIndex);
        },

//        void 
        ProcessCollectionChangedWithAdjustedIndex:function(/*NotifyCollectionChangedEventArgs*/ args, 
        		/*int*/ adjustedOldIndex, /*int*/ adjustedNewIndex) 
        {
            // Finding out the effective Action after filtering and sorting. 
            // 
            /*NotifyCollectionChangedAction*/var effectiveAction = args.Action;
            if (adjustedOldIndex == adjustedNewIndex && adjustedOldIndex >= 0) 
            {
                effectiveAction = NotifyCollectionChangedAction.Replace;
            }
            else if (adjustedOldIndex == -1) // old index is unknown 
            {
                // we weren't told the old index, but it may have been in the view. 
                if (adjustedNewIndex < 0) 
                {
                    // The new item will not be in the filtered view, 
                    // so an Add is a no-op and anything else is a Remove.
                    if (args.Action == NotifyCollectionChangedAction.Add)
                        return;
                    effectiveAction = NotifyCollectionChangedAction.Remove; 
                }
            } 
            else if (adjustedOldIndex < -1) // old item is known to be NOT in filtered view 
            {
                if (adjustedNewIndex < 0) 
                {
                    // since the old item wasn't in the filtered view, and the new
                    // item would not be in the filtered view, this is a no-op.
                    return; 
                }
                else 
                { 
                    effectiveAction = NotifyCollectionChangedAction.Add;
                } 
            }
            else // old item was in view
            {
                if (adjustedNewIndex < 0) 
                {
                    effectiveAction = NotifyCollectionChangedAction.Remove; 
                } 
                else
                { 
                    effectiveAction = NotifyCollectionChangedAction.Move;
                }
            }
 
            var delta = this.IsGrouping ? 0 :
                        (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) ? 
                        (this.IsAddingNew ? 2 : 1) : 0; 

            var originalCurrentPosition = this.CurrentPosition; 
            var oldCurrentPosition = this.CurrentPosition;
            var oldCurrentItem = this.CurrentItem;
            var oldIsCurrentAfterLast = this.IsCurrentAfterLast;
            var oldIsCurrentBeforeFirst = this.IsCurrentBeforeFirst; 

            // in the case of a replace that has a new adjustedPosition 
            // (likely caused by sorting), the only way to effectively communicate 
            // this change is through raising Remove followed by Insert.
            /*NotifyCollectionChangedEventArgs*/var args2 = null; 

            switch (effectiveAction)
            {
                case NotifyCollectionChangedAction.Add: 
                    // insert into private view
                    // (unless it's a special item - placeholder or new item) 
                    if (this.UsesLocalArray && this.NewItemPlaceholder != args.NewItems[0] && 
                            (!this.IsAddingNew || !Object.Equals(_newItem, args.NewItems[0])))
                    { 
                    	this.InternalList.Insert(adjustedNewIndex - delta, args.NewItems[0]);
                    }

                    if (!this.IsGrouping) 
                    {
                    	this.AdjustCurrencyForAdd(adjustedNewIndex); 
                        args = /*new NotifyCollectionChangedEventArgs(effectiveAction, args.NewItems[0], adjustedNewIndex)*/
                        	NotifyCollectionChangedEventArgs.BuildWithAOI(effectiveAction, args.NewItems[0], adjustedNewIndex); 
                    }
                    else 
                    {
                    	this.AddItemToGroups(args.NewItems[0]);
                    }
 
                    break;
 
                case NotifyCollectionChangedAction.Remove: 
                    // remove from private view, unless it's not there to start with
                    // (e.g. when CommitNew is applied to an item that fails the filter) 
                    if (this.UsesLocalArray)
                    {
                        var localOldIndex = adjustedOldIndex - delta;
 
                        if (localOldIndex < InternalList.Count &&
                            Object.Equals(InternalList[localOldIndex], args.OldItems[0])) 
                        { 
                        	this.InternalList.RemoveAt(localOldIndex);
                        } 
                    }

                    if (!this.IsGrouping)
                    { 
                    	this.AdjustCurrencyForRemove(adjustedOldIndex);
                        args = /*new NotifyCollectionChangedEventArgs(effectiveAction, args.OldItems[0], adjustedOldIndex)*/
                        	NotifyCollectionChangedEventArgs.BuildWithAOI(effectiveAction, args.OldItems[0], adjustedOldIndex); 
                    } 
                    else
                    { 
                    	this.RemoveItemFromGroups(args.OldItems[0]);
                    }

                    break; 
                case NotifyCollectionChangedAction.Replace:
                    // replace item in private view 
                    if (this.UsesLocalArray) 
                    {
                    	this.InternalList.Set(adjustedOldIndex - delta,args.NewItems[0]); 
                    }

                    if (!this.IsGrouping)
                    { 
                    	this.AdjustCurrencyForReplace(adjustedOldIndex);
                        args = /*new NotifyCollectionChangedEventArgs(effectiveAction, args.NewItems[0], args.OldItems[0], adjustedOldIndex)*/
                        	NotifyCollectionChangedEventArgs.BuildWithAOOI(effectiveAction, args.NewItems[0], args.OldItems[0], adjustedOldIndex); 
                    } 
                    else
                    { 
                    	this.RemoveItemFromGroups(args.OldItems[0]);
                    	this.AddItemToGroups(args.NewItems[0]);
                    }
 
                    break;
 
                case NotifyCollectionChangedAction.Move: 
                    // remove from private view
 
                    var simpleMove = args.OldItems[0] == args.NewItems[0];

                    if (this.UsesLocalArray)
                    { 
                        var localOldIndex = adjustedOldIndex - delta;
                        var localNewIndex = adjustedNewIndex - delta; 
 
                        // remove the item from its old position, unless it's not there
                        // (which happens when the item is the object of CommitNew) 
                        if (localOldIndex < this.InternalList.Count &&
                            Object.Equals(this.InternalList.Get(localOldIndex), args.OldItems[0]))
                        {
                        	this.InternalList.RemoveAt(localOldIndex); 
                        }
 
                        // put the item into its new position, unless it's special 
                        if (this.NewItemPlaceholder != args.NewItems[0])
                        { 
                        	this.InternalList.Insert(localNewIndex, args.NewItems[0]);
                        }
                    }
 
                    if (!this.IsGrouping)
                    { 
                    	this.AdjustCurrencyForMove(adjustedOldIndex, adjustedNewIndex); 

                        if (simpleMove) 
                        {
                            // simple move
                            args = /*new NotifyCollectionChangedEventArgs(effectiveAction, args.OldItems[0], adjustedNewIndex, adjustedOldIndex)*/
                            	NotifyCollectionChangedEventArgs.BuildWithAOII(effectiveAction, args.OldItems[0], adjustedNewIndex, adjustedOldIndex);
                        } 
                        else
                        { 
                            // move/replace 
                            args2 = /*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Add, args.NewItems, adjustedNewIndex)*/
                            	NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add, args.NewItems, adjustedNewIndex);
                            args = /*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Remove, args.OldItems, adjustedOldIndex)*/
                            	NotifyCollectionChangedEventArgs.BuildWithALI(NotifyCollectionChangedAction.Remove, args.OldItems, adjustedOldIndex); 
                        }
                    }
                    else
                    { 
                        if (!simpleMove)
                        { 
                        	this.RemoveItemFromGroups(args.OldItems[0]); 
                        	this.AddItemToGroups(args.NewItems[0]);
                        } 
                    }
                    break;
                default:
//                    Invariant.Assert(false, SR.Get(SRID.UnexpectedCollectionChangeAction, effectiveAction)); 
                    break;
            } 
 
            // remember whether scalar properties of the view have changed.
            // They may change again during the collection change event, so we 
            // need to do the test before raising that event.
            var afterLastHasChanged = (this.IsCurrentAfterLast != oldIsCurrentAfterLast);
            var beforeFirstHasChanged = (this.IsCurrentBeforeFirst != oldIsCurrentBeforeFirst);
            var currentPositionHasChanged = (this.CurrentPosition != oldCurrentPosition); 
            var currentItemHasChanged = (this.CurrentItem != oldCurrentItem);
 
            // take a new snapshot of the scalar properties, so that we can detect 
            // changes made during the collection change event
            oldIsCurrentAfterLast = this.IsCurrentAfterLast; 
            oldIsCurrentBeforeFirst = this.IsCurrentBeforeFirst;
            oldCurrentPosition = this.CurrentPosition;
            oldCurrentItem = this.CurrentItem;
 
            // base class will raise an event to our listeners
            if (!this.IsGrouping) 
            { 
                // we've already returned if (args.Action == NotifyCollectionChangedAction.Reset) above
            	this.OnCollectionChanged(args); 
                if (args2 != null)
                	this.OnCollectionChanged(args2);

                // Any scalar properties that changed don't need a further notification, 
                // but do need a new snapshot
                if (this.IsCurrentAfterLast != oldIsCurrentAfterLast) 
                { 
                    afterLastHasChanged = false;
                    oldIsCurrentAfterLast = this.IsCurrentAfterLast; 
                }
                if (this.IsCurrentBeforeFirst != oldIsCurrentBeforeFirst)
                {
                    beforeFirstHasChanged = false; 
                    oldIsCurrentBeforeFirst = this.IsCurrentBeforeFirst;
                } 
                if (CurrentPosition != oldCurrentPosition) 
                {
                    currentPositionHasChanged = false; 
                    oldCurrentPosition = this.CurrentPosition;
                }
                if (this.CurrentItem != oldCurrentItem)
                { 
                    currentItemHasChanged = false;
                    oldCurrentItem = this.CurrentItem; 
                } 

            } 

            // currency has to change after firing the deletion event,
            // so event handlers have the right picture
            if (this._currentElementWasRemoved) 
            {
            	this.MoveCurrencyOffDeletedElement(originalCurrentPosition); 
 
                // changes to the scalar properties need notification
                afterLastHasChanged = afterLastHasChanged || (this.IsCurrentAfterLast != oldIsCurrentAfterLast); 
                beforeFirstHasChanged = beforeFirstHasChanged || (this.IsCurrentBeforeFirst != oldIsCurrentBeforeFirst);
                currentPositionHasChanged = currentPositionHasChanged || (this.CurrentPosition != oldCurrentPosition);
                currentItemHasChanged = currentItemHasChanged || (this.CurrentItem != oldCurrentItem);
            } 

            // notify that the properties have changed.  We may end up doing 
            // double notification for properties that change during the collection 
            // change event, but that's not harmful.  Detecting the double change
            // is more trouble than it's worth. 
            if (afterLastHasChanged)
            	this.OnPropertyChanged(IsCurrentAfterLastPropertyName);

            if (beforeFirstHasChanged) 
            	this.OnPropertyChanged(IsCurrentBeforeFirstPropertyName);
 
            if (currentPositionHasChanged) 
            	this.OnPropertyChanged(CurrentPositionPropertyName);
 
            if (currentItemHasChanged)
            	this.OnPropertyChanged(CurrentItemPropertyName);

        },

        /// <summary> 
        /// Return index of item in the internal list. 
        /// </summary>
//        protected int 
        InternalIndexOf:function(/*object*/ item) 
        {
            if (this.IsGrouping)
            {
                return this._group.LeafIndexOf(item); 
            }
 
            if (item == this.NewItemPlaceholder) 
            {
                switch (this.NewItemPlaceholderPosition) 
                {
                    case NewItemPlaceholderPosition.None:
                        return -1;
 
                    case NewItemPlaceholderPosition.AtBeginning:
                        return 0; 
 
                    case NewItemPlaceholderPosition.AtEnd:
                        return InternalCount - 1; 
                }
            }
            else if (this.IsAddingNew && Object.Equals(item, this._newItem))
            { 
                switch (this.NewItemPlaceholderPosition)
                { 
                    case NewItemPlaceholderPosition.None: 
                        if (this.UsesLocalArray)
                        { 
                            return InternalCount - 1;
                        }
                        break;
 
                    case NewItemPlaceholderPosition.AtBeginning:
                        return 1; 
 
                    case NewItemPlaceholderPosition.AtEnd:
                        return this.InternalCount - 2; 
                }
            }

            var index = InternalList.IndexOf(item); 

            if (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning && index >= 0) 
            { 
                index += this.IsAddingNew ? 2 : 1;
            } 

            return index;
        },
 
        /// <summary>
        /// Return item at the given index in the internal list. 
        /// </summary> 
//        protected object 
        InternalItemAt:function(/*int*/ index)
        { 
            if (this.IsGrouping)
            {
                return this._group.LeafAt(index);
            } 

            switch (this.NewItemPlaceholderPosition) 
            { 
                case NewItemPlaceholderPosition.None:
                    if (this.IsAddingNew && this.UsesLocalArray) 
                    {
                        if (index == this.InternalCount - 1)
                            return this._newItem;
                    } 
                    break;
 
                case NewItemPlaceholderPosition.AtBeginning: 
                    if (index == 0)
                        return this.NewItemPlaceholder; 
                    --index;

                    if (IsAddingNew)
                    { 
                        if (index == 0)
                            return _newItem; 
 
                        if (this.UsesLocalArray || index <= this._newItemIndex)
                        { 
                            --index;
                        }
                    }
                    break; 

                case NewItemPlaceholderPosition.AtEnd: 
                    if (index == this.InternalCount - 1) 
                        return this.NewItemPlaceholder;
                    if (IsAddingNew) 
                    {
                        if (index == this.InternalCount-2)
                            return _newItem;
                        if (!this.UsesLocalArray && index >= this._newItemIndex) 
                            ++index;
                    } 
                    break; 
            }
 
            return this.InternalList.Get(index);
        },

        /// <summary> 
        /// Return true if internal list contains the item.
        /// </summary> 
//        protected bool 
        InternalContains:function(/*object*/ item) 
        {
            if (item == this.NewItemPlaceholder) 
                return (this.NewItemPlaceholderPosition != NewItemPlaceholderPosition.None);

            return (!this.IsGrouping) ? this.InternalList.Contains(item) : (this._group.LeafIndexOf(item) >= 0);
        }, 

        /// <summary> 
        /// Return an enumerator for the internal list. 
        /// </summary>
//        protected IEnumerator 
        InternalGetEnumerator:function() 
        {
            if (!this.IsGrouping)
            {
                return new PlaceholderAwareEnumerator(this, this.InternalList.GetEnumerator(), this.NewItemPlaceholderPosition, this._newItem); 
            }
            else 
            { 
                return this._group.GetLeafEnumerator();
            } 
        },
        
//        internal void 
        AdjustShadowCopy:function(/*NotifyCollectionChangedEventArgs*/ e) 
        {
            var tempIndex;

            switch (e.Action) 
            {
                case NotifyCollectionChangedAction.Add: 
                    if (e.NewStartingIndex > _unknownIndex) 
                    {
                    	this.ShadowCollection.Insert(e.NewStartingIndex, e.NewItems[0]); 
                    }
                    else
                    {
                    	this.ShadowCollection.Add(e.NewItems[0]); 
                    }
                    break; 
                case NotifyCollectionChangedAction.Remove: 
                    if (e.OldStartingIndex > _unknownIndex)
                    { 
                    	this.ShadowCollection.RemoveAt(e.OldStartingIndex);
                    }
                    else
                    { 
                    	this.ShadowCollection.Remove(e.OldItems[0]);
                    } 
                    break; 
                case NotifyCollectionChangedAction.Replace:
                    if (e.OldStartingIndex > _unknownIndex) 
                    {
                    	this.ShadowCollection[e.OldStartingIndex] = e.NewItems[0];
                    }
                    else 
                    {
                        // allow the ShadowCollection to throw the IndexOutOfRangeException 
                        // if the item is not found. 
                        tempIndex = this.ShadowCollection.IndexOf(e.OldItems[0]);
                        this.ShadowCollection[e.OldStartingIndex] = e.NewItems[0]; 
                    }
                    break;
                case NotifyCollectionChangedAction.Move:
                    if (e.OldStartingIndex > _unknownIndex) 
                    {
                    	this.ShadowCollection.RemoveAt(e.OldStartingIndex); 
                    } 
                    else
                    { 
                    	this.ShadowCollection.Remove(e.OldItems[0]);
                    	this.ShadowCollection.Insert(e.NewStartingIndex, e.NewItems[0]);
                    }
                    break; 

                default: 
                    throw new NotSupportedException(SR.Get(SRID.UnexpectedCollectionChangeAction, e.Action)); 

            } 
        },
 
//        private void 
        ValidateCollectionChangedEventArgs:function(/*NotifyCollectionChangedEventArgs*/ e) 
        {

            switch (e.Action)
            { 
                case NotifyCollectionChangedAction.Add:
                    if (e.NewItems.Count != 1) 
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported)); 
                    break;
 
                case NotifyCollectionChangedAction.Remove:
                    if (e.OldItems.Count != 1)
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported));
                    break; 

                case NotifyCollectionChangedAction.Replace: 
                    if (e.NewItems.Count != 1 || e.OldItems.Count != 1) 
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported));
                    break; 

                case NotifyCollectionChangedAction.Move:
                    if (e.NewItems.Count != 1)
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported)); 
                    if (e.NewStartingIndex < 0)
                        throw new InvalidOperationException(SR.Get(SRID.CannotMoveToUnknownPosition)); 
                    break; 

                case NotifyCollectionChangedAction.Reset: 
                    break;

                default:
                    throw new NotSupportedException(SR.Get(SRID.UnexpectedCollectionChangeAction, e.Action)); 
            }
        },
 

        /// <summary> 
        /// Create, filter and sort the local index array.
        /// called from Refresh(), override in derived classes as needed.
        /// </summary>
        /// <param name="list">new ILIst to associate this view with</param> 
        /// <returns>new local array to use for this view</returns>
//        private IList 
        PrepareLocalArray:function(/*IList*/ list) 
        { 
            if (list == null)
                throw new ArgumentNullException("list"); 

            // filter the collection's array into the local array
            /*ArrayList*/var al;
 
            if (this.ActiveFilter == null)
            { 
                al = new ArrayList(list); 

                if (this.IsAddingNew) 
                {
                    al.RemoveAt(this._newItemIndex);
                }
            } 
            else
            { 
                al = new ArrayList(list.Count);       // 
                for (var k = 0; k < list.Count; ++k)
                { 
                    if (this.ActiveFilter(list.Get(k)) && !(this.IsAddingNew && k == this._newItemIndex))
                        al.Add(list.Get(k));
                }
            } 

            // sort the local array 
            if (this.ActiveComparer != null) 
            {
                SortFieldComparer.SortHelper(al, this.ActiveComparer); 
            }

            return al;
        }, 

//        private void 
        MoveCurrencyOffDeletedElement:function(/*int*/ oldCurrentPosition) 
        { 
            var lastPosition = this.InternalCount - 1;   // OK if last is -1
            // if position falls beyond last position, move back to last position 
            var newPosition = (oldCurrentPosition < lastPosition) ? oldCurrentPosition : lastPosition;

            // reset this to false before raising events to avoid problems in re-entrancy
            this._currentElementWasRemoved = false; 

            this.OnCurrentChanging(); 
 
            if (newPosition < 0)
            	this.SetCurrent(null, newPosition); 
            else
            	this.SetCurrent(this.InternalItemAt(newPosition), newPosition);

            this.OnCurrentChanged(); 
        },
 
        // Convert the collection's index to an index into the view. 
        // Return -1 if the index is unknown or moot (Reset events).
        // Return -2 if the event doesn't apply to this view. 
//        private int 
        AdjustBefore:function (/*NotifyCollectionChangedAction*/ action, /*object*/ item, /*int*/ index)
        {
            // index is not relevant to Reset events
            if (action == NotifyCollectionChangedAction.Reset) 
                return -1;
 
            if (item == this.NewItemPlaceholder) 
            {
                return (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) 
                        ? 0 : InternalCount - 1;
            }
            else if (this.IsAddingNew && this.NewItemPlaceholderPosition != NewItemPlaceholderPosition.None &&
                        Object.Equals(item, this._newItem)) 
            {
                // we should only get here when removing the AddNew item - i.e. from CancelNew - 
                // and only when the placeholder is active. 
                // In that case the item's index in the view is 1 when the placeholder
                // is AtBeginning, and just before the placeholder when it's AtEnd. 
                // The numerical value for the latter case dependds on whether there's
                // a sort/filter or not, i.e. whether we're using a local array.  That's
                // because the item has already been removed from the collection, but
                // not from the local array.  (DDB 201860) 
                return (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning)
                        ? 1 : this.UsesLocalArray ? this.InternalCount - 2 : index; 
            } 

            var delta = this.IsGrouping ? 0 : 
                        (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning)
                        ? (this.IsAddingNew ? 2 : 1) : 0;
            /*IList*/var ilFull = (this.UpdatedOutsideDispatcher ? this.ShadowCollection : this.SourceCollection);
            ilFull = ilFull instanceof IList ? ilFull : null;
 
            // validate input
            if (index < -1 || index > ilFull.Count) 
                throw new InvalidOperationException(SR.Get(SRID.CollectionChangeIndexOutOfRange, index, ilFull.Count)); 

            if (action == NotifyCollectionChangedAction.Add) 
            {
                if (index >= 0)
                {
                    if (!Object.Equals(item, ilFull.Get(index))) 
                        throw new InvalidOperationException(SR.Get(SRID.AddedItemNotAtIndex, index));
                } 
                else 
                {
                    // event didn't specify index - determine it the hard way 
                    index = ilFull.IndexOf(item);
                    if (index < 0)
                        throw new InvalidOperationException(SR.Get(SRID.AddedItemNotInCollection));
                } 
            }
 
            // if there's no sort or filter, use the index into the full array 
            if (!this.UsesLocalArray)
            { 
                if (this.IsAddingNew)
                {
                    if (index > this._newItemIndex)
                    { 
                        --index;        // the new item has been artificially moved elsewhere
                    } 
                } 

                return index + delta; 
            }

            if (action == NotifyCollectionChangedAction.Add)
            { 
                // if the item isn't in the filter, return -2
                if (!this.PassesFilter(item)) 
                    return -2; 

                // search the local array 
                var al = this.InternalList instanceof ArrayList ? this.InternalList : null;
                if (al == null)
                {
                    index = -1; 
                }
                else if (this.ActiveComparer != null) 
                { 
                    // if there's a sort order, use binary search
                    index = al.BinarySearch(item, this.ActiveComparer); 
                    if (index < 0)
                        index = ~index;
                }
                else 
                {
                    // otherwise, do a linear search of the full array, advancing 
                    // localIndex past elements that appear in the local array, 
                    // until either (a) reaching the position of the item in the
                    // full array, or (b) falling off the end of the local array. 
                    // localIndex is now the desired index.
                    // One small wrinkle:  we have to ignore the target item in
                    // the local array (this arises in a Move event).
                    var fullIndex=0, localIndex=0; 

                    while (fullIndex < index && localIndex < al.Count) 
                    { 
                        if (Object.Equals(ilFull[fullIndex], al.Get(localIndex)))
                        { 
                            // match - current item passes filter.  Skip it.
                            ++fullIndex;
                            ++localIndex;
                        } 
                        else if (Object.Equals(item, al.Get(localIndex)))
                        { 
                            // skip over an unmatched copy of the target item 
                            // (this arises in a Move event)
                            ++localIndex; 
                        }
                        else
                        {
                            // no match - current item fails filter.  Ignore it. 
                            ++fullIndex;
                        } 
                    } 

                    index = localIndex; 
                }
            }
            else if (action == NotifyCollectionChangedAction.Remove)
            { 
                if (!this.IsAddingNew || item != this._newItem)
                { 
                    // a deleted item should already be in the local array 
                    index = this.InternalList.IndexOf(item);
 
                    // but may not be, if it was already filtered out (can't use
                    // PassesFilter here, because the item could have changed
                    // while it was out of our sight)
                    if (index < 0) 
                        return -2;
                } 
                else 
                {
                    // the new item is in a special position 
                    switch (NewItemPlaceholderPosition)
                    {
                        case NewItemPlaceholderPosition.None:
                            return this.InternalCount - 1; 
                        case NewItemPlaceholderPosition.AtBeginning:
                            return 1; 
                        case NewItemPlaceholderPosition.AtEnd: 
                            return this.InternalCount - 2;
                    } 
                }
            }
            else
            { 
                index = -1;
            } 
 
            return (index < 0 ) ? index : index + delta;
        }, 

        // fix up CurrentPosition and CurrentItem after a collection change
//        private void 
        AdjustCurrencyForAdd:function(/*int*/ index)
        { 
            if (this.InternalCount == 1)
            { 
                // added first item; set current at BeforeFirst 
            	this.SetCurrent(null, -1);
            } 
            else if (index <= this.CurrentPosition)  // adjust current index if insertion is earlier
            {
                var newPosition = this.CurrentPosition + 1;
                if (newPosition < this.InternalCount) 
                {
                    // CurrentItem might be out of [....] if underlying list is not INCC 
                    // or if this Add is the result of a Replace (Rem + Add) 
                	this.SetCurrent(this.GetItemAt(newPosition), newPosition);
                } 
                else
                {
                	this.SetCurrent(null, this.InternalCount);
                } 
            }
        },
 
        // fix up CurrentPosition and CurrentItem after a collection change
//        private void 
        AdjustCurrencyForRemove:function(/*int*/ index) 
        {
            // adjust current index if deletion is earlier
            if (index < this.CurrentPosition)
            { 
            	this.SetCurrent(this.CurrentItem, this.CurrentPosition - 1);
            } 
            // remember to move currency off the deleted element 
            else if (index == this.CurrentPosition)
            { 
            	this._currentElementWasRemoved = true;
            }
        },
 
        // fix up CurrentPosition and CurrentItem after a collection change
//        private void 
        AdjustCurrencyForMove:function(/*int*/ oldIndex, /*int*/ newIndex) 
        { 
            if (oldIndex == this.CurrentPosition)
            { 
                // moving the current item - currency moves with the item (bug 1942184)
            	this.SetCurrent(this.GetItemAt(newIndex), newIndex);
            }
            else if (oldIndex < this.CurrentPosition && this.CurrentPosition <= newIndex) 
            {
                // moving an item from before current position to after - 
                // current item shifts back one position 
            	this.SetCurrent(this.CurrentItem, this.CurrentPosition - 1);
            } 
            else if (newIndex <= this.CurrentPosition && this.CurrentPosition < oldIndex)
            {
                // moving an item from after current position to before -
                // current item shifts ahead one position 
            	this.SetCurrent(this.CurrentItem, this.CurrentPosition + 1);
            } 
            // else no change necessary 
        },
 
        // fix up CurrentPosition and CurrentItem after a collection change
//        private void 
        AdjustCurrencyForReplace:function(/*int*/ index)
        {
            // remember to move currency off the deleted element 
            if (index == this.CurrentPosition)
            { 
            	this._currentElementWasRemoved = true; 
            }
        },

        // build the sort and filter information from the relevant properties
//        private void 
        PrepareSortAndFilter:function(/*IList*/ list)
        { 
            // sort:  prepare the comparer
            if (this._customSort != null) 
            { 
            	this.ActiveComparer = this._customSort;
            } 
            else if (this._sort != null && this._sort.Count > 0)
            {
                var xmlComparer;
                if (AssemblyHelper.IsLoaded(UncommonAssembly.System_Xml) && 
                    (xmlComparer = PrepareXmlComparer(SourceCollection)) != null)
                { 
                	this.ActiveComparer = xmlComparer; 
                }
                else 
                {
                	this.ActiveComparer = new SortFieldComparer(_sort, Culture);
                }
            } 
            else
            { 
            	this.ActiveComparer = null; 
            }
 
            // filter:  prepare the Predicate<object> filter
            this.ActiveFilter = this.Filter;
        },
 
        // set up the Xml comparer - code is isolated here to avoid loading System.Xml
//        private IComparer 
        PrepareXmlComparer:function(/*IEnumerable*/ collection) 
        {
            /*XmlDataCollection*/var xdc = this.SourceCollection instanceof XmlDataCollection ? this.SourceCollection : null; 
            if (xdc != null)
            {
//                Invariant.Assert(_sort != null);
                return new XmlNodeComparer(this._sort, xdc.XmlNamespaceManager, this.Culture); 
            }
            return null; 
        },

        // set new SortDescription collection; rehook collection change notification handler 
//        private void 
        SetSortDescriptions:function(/*SortDescriptionCollection*/ descriptions)
        {
            if (this._sort != null)
            { 
            	this._sort.CollectionChanged -= new NotifyCollectionChangedEventHandler(this.SortDescriptionsChanged);
            } 
 
            this._sort = descriptions;
 
            if (this._sort != null)
            {
//                Invariant.Assert(_sort.Count == 0, "must be empty SortDescription collection");
            	this._sort.CollectionChanged += new NotifyCollectionChangedEventHandler(this.SortDescriptionsChanged); 
            }
        },
 
        // SortDescription was added/removed, refresh CollectionView
//        private void 
        SortDescriptionsChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        {
            if (this.IsAddingNew || this.IsEditingItem)
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "Sorting"));
 
            // adding to SortDescriptions overrides custom sort
            if (_sort.Count > 0) 
            { 
            	this._customSort = null;
            } 

            this.RefreshOrDefer();
        },
 
        // divide the data items into groups 
//        void 
        PrepareGroups:function()
        { 
            // discard old groups
        	this._group.Clear();

            // initialize the synthetic top level group 
        	this._group.Initialize();
 
            // if there's no grouping, there's nothing to do 
        	this._isGrouping = (this._group.GroupBy != null);
            if (!this._isGrouping) 
                return;

            // reset the grouping comparer
            /*IComparer*/var comparer = this.ActiveComparer; 
            if (comparer != null)
            { 
            	this._group.ActiveComparer = comparer; 
            }
            else 
            {
                /*CollectionViewGroupInternal.IListComparer*/var ilc = this._group.ActiveComparer;
                ilc = ilc instanceof CollectionViewGroupInternal.IListComparer ? ilc: null;
                if (ilc != null)
                { 
                    ilc.ResetList(this.InternalList);
                } 
                else 
                {
                	this._group.ActiveComparer = new CollectionViewGroupInternal.IListComparer(this.InternalList); 
                }
            }

            // loop through the sorted/filtered list of items, dividing them 
            // into groups (with special cases for placeholder and new item)
            if (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) 
            { 
            	this._group.InsertSpecialItem(0, this.NewItemPlaceholder, true /*loading*/);
                if (this.IsAddingNew) 
                {
                	this._group.InsertSpecialItem(1, this._newItem, true /*loading*/);
                }
            } 

            for (var k=0, n=this.InternalList.Count;  k<n;  ++k) 
            { 
                var item = this.InternalList.Get(k);
                if (!this.IsAddingNew || !Object.Equals(this._newItem, item)) 
                {
                	this._group.AddToSubgroups(item, true /*loading*/);
                }
            } 

            if (this.IsAddingNew && this.NewItemPlaceholderPosition != NewItemPlaceholderPosition.AtBeginning) 
            { 
            	this._group.InsertSpecialItem(this._group.Items.Count, this._newItem, true /*loading*/);
            } 
            if (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtEnd)
            {
            	this._group.InsertSpecialItem(this._group.Items.Count, this.NewItemPlaceholder, true /*loading*/);
            } 
        },
     
 
        // For the Group to report collection changed
//        void 
        OnGroupChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        {
            if (e.Action == NotifyCollectionChangedAction.Add)
            {
            	this.AdjustCurrencyForAdd(e.NewStartingIndex); 
            }
            else if (e.Action == NotifyCollectionChangedAction.Remove) 
            { 
            	this.AdjustCurrencyForRemove(e.OldStartingIndex);
            } 
            this.OnCollectionChanged(e);
        },

        // The GroupDescriptions collection changed 
//        void 
        OnGroupByChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        { 
            if (this.IsAddingNew || this.IsEditingItem) 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "Grouping"));
 
            // This is a huge change.  Just refresh the view.
            this.RefreshOrDefer();
        },
 
        // A group description for one of the subgroups changed
//        void 
        OnGroupDescriptionChanged:function(/*object*/ sender, /*EventArgs*/ e) 
        { 
            if (this.IsAddingNew || this.IsEditingItem)
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "Grouping")); 

            // This is a huge change.  Just refresh the view.
            this.RefreshOrDefer();
        }, 

        // An item was inserted into the collection.  Update the groups. 
//        void 
        AddItemToGroups:function(/*object*/ item) 
        {
            if (this.IsAddingNew && item == this._newItem) 
            {
                var index;
                switch (this.NewItemPlaceholderPosition)
                { 
                    case NewItemPlaceholderPosition.None:
                    default: 
                        index = this._group.Items.Count; 
                        break;
                    case NewItemPlaceholderPosition.AtBeginning: 
                        index = 1;
                        break;
                    case NewItemPlaceholderPosition.AtEnd:
                        index = this._group.Items.Count - 1; 
                        break;
                } 
 
                this._group.InsertSpecialItem(index, item, false /*loading*/);
            } 
            else
            {
            	this._group.AddToSubgroups(item, false /*loading*/);
            } 
        },
 
        // An item was removed from the collection.  Update the groups. 
//        void 
        RemoveItemFromGroups:function(/*object*/ item)
        { 
            if (this.CanGroupNamesChange || this._group.RemoveFromSubgroups(item))
            {
                // the item didn't appear where we expected it to.
            	this._group.RemoveItemFromSubgroupsByExhaustiveSearch(item); 
            }
        }, 
 
        /// <summary>
        /// Helper to raise a PropertyChanged event  />).
        /// </summary>
//        private void 
        OnPropertyChanged:function(/*string*/ propertyName) 
        {
        	CollectionView.prototype.OnPropertyChanged.call(this, new PropertyChangedEventArgs(propertyName)); 
        }
        
	});
	
	Object.defineProperties(ListCollectionView.prototype,{
        /// <summary> 
        /// Returns true if this view really supports grouping.
        /// When this returns false, the rest of the interface is ignored. 
        /// </summary> 
//        public override bool 
        CanGroup:
        { 
            get:function() { return true; }
        },
        
        /// <summary> 
        /// The description of grouping, indexed by level.
        /// </summary> 
//        public override ObservableCollection<GroupDescription> 
        GroupDescriptions: 
        {
            get:function() { return this._group.GroupDescriptions; } 
        },

        /// <summary>
        /// The top-level groups, constructed according to the descriptions 
        /// given in GroupDescriptions and/or GroupBySelector.
        /// </summary> 
//        public override ReadOnlyObservableCollection<object> 
        Groups: 
        {
            get:function() { return (this.IsGrouping) ? this._group.Items : null; } 
        },

        /// <summary>
        /// Collection of Sort criteria to sort items in this view over the SourceCollection. 
        /// </summary> 
        /// <remarks>
        /// <p> 
        /// One or more sort criteria in form of <seealso cref="SortDescription"/>
        /// can be added, each specifying a property and direction to sort by.
        /// </p>
        /// </remarks> 
//        public override SortDescriptionCollection 
        SortDescriptions:
        { 
            get:function() 
            {
                if (this._sort == null) 
                	this.SetSortDescriptions(new SortDescriptionCollection());
                return this._sort;
            }
        }, 

        /// <summary> 
        /// Test if this ICollectionView supports sorting before adding 
        /// to <seealso cref="SortDescriptions"/>.
        /// </summary> 
        /// <remarks>
        /// ListCollectionView does implement an IComparer based sorting.
        /// </remarks>
//        public override bool 
        CanSort: 
        {
            get:function() { return true; } 
        }, 

        /// <summary> 
        /// Test if this ICollectionView supports filtering before assigning
        /// a filter callback to <seealso cref="Filter"/>.
        /// </summary>
//        public override bool 
        CanFilter: 
        {
            get:function() { return true; } 
        }, 
		
        /// <summary> 
        /// Filter is a callback set by the consumer of the ICollectionView
        /// and used by the implementation of the ICollectionView to determine if an
        /// item is suitable for inclusion in the view.
        /// </summary> 
        /// <exception cref="NotSupportedException">
        /// Simpler implementations do not support filtering and will throw a NotSupportedException. 
        /// Use <seealso cref="CanFilter"/> property to test if filtering is supported before 
        /// assigning a non-null value.
        /// </exception> 
//        public override Predicate<object> 
        Filter:
        {
            get:function()
            { 
                //return base.Filter;
                return this._filter;
            },
            set:function(value) 
            {
                if (this.IsAddingNew || this.IsEditingItem) 
                    throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "Filter"));
//                base.Filter = value;
                this._filter = value;
            }
        }, 
        /// Set a custom comparer to sort items using an object that implements IComparer. 
        /// </summary>
        /// <remarks>
        /// Setting the Sort criteria has no immediate effect,
        /// an explicit <seealso cref="Refresh"/> call by the app is required. 
        /// Note: Setting the custom comparer object will clear previously set <seealso cref="SortDescriptions"/>.
        /// </remarks> 
//        public IComparer 
        CustomSort: 
        {
            get:function() { return this._customSort; },
            set:function(value)
            {
                if (this.IsAddingNew || this.IsEditingItem)
                    throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "CustomSort")); 
                this._customSort = value;
                this.SetSortDescriptions(null); 
 
                this.RefreshOrDefer();
            } 
        },

        /// <summary>
        /// A delegate to select the group description as a function of the 
        /// parent group and its level.
        /// </summary> 
//        public virtual GroupDescriptionSelectorCallback 
        GroupBySelector:
        { 
            get:function() { return this._group.GroupBySelector; },
            set:function(value)
            {
                if (!this.CanGroup) 
                    throw new NotSupportedException();
                if (this.IsAddingNew || this.IsEditingItem) 
                    throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "Grouping")); 

                this._group.GroupBySelector = value; 

                this.RefreshOrDefer();
            }
        }, 

        /// <summary> 
        /// Return the estimated number of records (or -1, meaning "don't know"). 
        /// </summary>
//        public override int 
        Count: 
        {
            get:function()
            {
            	this.VerifyRefreshNotDeferred(); 

                return this.InternalCount; 
            } 
        },
    
        /// <summary>
        /// Returns true if the resulting (filtered) view is emtpy.
        /// </summary>
//        public override bool 
        IsEmpty: 
        {
            get:function() { return (this.InternalCount == 0); } 
        },

        /// <summary> 
        /// Setting this to true informs the view that the list of items
        /// (after applying the sort and filter, if any) is already in the
        /// correct order for grouping.  This allows the view to use a more
        /// efficient algorithm to build the groups. 
        /// </summary>
//        public bool 
        IsDataInGroupOrder:
        { 
            get:function() { return this._group.IsDataInGroupOrder; },
            set:function(value) { this._group.IsDataInGroupOrder = value; } 
        },

        /// <summary> 
        /// Indicates whether to include a placeholder for a new item, and if so,
        /// where to put it.
        /// </summary>
//        public NewItemPlaceholderPosition 
        NewItemPlaceholderPosition: 
        {
            get:function() { return this._newItemPlaceholderPosition; },
            set:function(value) 
            {
            	this.VerifyRefreshNotDeferred(); 

                if (value != this._newItemPlaceholderPosition && this.IsAddingNew)
                    throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringTransaction, "NewItemPlaceholderPosition", "AddNew"));
 
                /*NotifyCollectionChangedEventArgs*/var args = null;
                var oldIndex=-1, newIndex=-1; 
                
//				base.VerifyRefreshNotDeferred();
//				if (value != this._newItemPlaceholderPosition && this.IsAddingNew)
//				{
//					throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringTransaction", new object[]
//					{
//						"NewItemPlaceholderPosition",
//						"AddNew"
//					}));
//				}
//				if (value != this._newItemPlaceholderPosition && this._isRemoving)
//				{
//					this.DeferAction(delegate
//					{
//						this.NewItemPlaceholderPosition = value;
//					});
//					return;
//				}
 
                // we're adding, removing, or moving the placeholder.
                // Determine the appropriate events. 
                switch (value)
                {
                    case NewItemPlaceholderPosition.None:
                        switch (this._newItemPlaceholderPosition) 
                        {
                            case NewItemPlaceholderPosition.None: 
                                break; 
                            case NewItemPlaceholderPosition.AtBeginning:
                                oldIndex = 0; 
                                args = /*new NotifyCollectionChangedEventArgs(
                                                NotifyCollectionChangedAction.Remove,
                                                this.NewItemPlaceholder,
                                                oldIndex)*/
                                	NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove,
                                                this.NewItemPlaceholder,
                                                oldIndex); 
                                break;
                            case NewItemPlaceholderPosition.AtEnd: 
                                oldIndex = this.InternalCount - 1; 
                                args = /*new NotifyCollectionChangedEventArgs(
                                                NotifyCollectionChangedAction.Remove, 
                                                this.NewItemPlaceholder,
                                                oldIndex)*/
                                	NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, 
                                            this.NewItemPlaceholder,
                                            oldIndex);
                                break;
                        } 
                        break;
 
                    case NewItemPlaceholderPosition.AtBeginning: 
                        switch (this._newItemPlaceholderPosition)
                        { 
                            case NewItemPlaceholderPosition.None:
                                newIndex = 0;
                                args = /*new NotifyCollectionChangedEventArgs(
                                                NotifyCollectionChangedAction.Add, 
                                                this.NewItemPlaceholder,
                                                newIndex)*/
                                	NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add, 
                                                this.NewItemPlaceholder,
                                                newIndex); 
                                break; 
                            case NewItemPlaceholderPosition.AtBeginning:
                                break; 
                            case NewItemPlaceholderPosition.AtEnd:
                                oldIndex = this.InternalCount - 1;
                                newIndex = 0;
                                args = /*new NotifyCollectionChangedEventArgs( 
                                                NotifyCollectionChangedAction.Move,
                                                this.NewItemPlaceholder, 
                                                newIndex, 
                                                oldIndex)*/
                                	NotifyCollectionChangedEventArgs.BuildWithAOII(NotifyCollectionChangedAction.Move,
                                                this.NewItemPlaceholder, 
                                                newIndex, 
                                                oldIndex);
                                break; 
                        }
                        break;

                    case NewItemPlaceholderPosition.AtEnd: 
                        switch (this._newItemPlaceholderPosition)
                        { 
                            case NewItemPlaceholderPosition.None: 
                                newIndex = InternalCount;
                                args = /*new NotifyCollectionChangedEventArgs( 
                                                NotifyCollectionChangedAction.Add,
                                                this.NewItemPlaceholder,
                                                newIndex)*/
                                	NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add,
                                                this.NewItemPlaceholder,
                                                newIndex);
                                break; 
                            case NewItemPlaceholderPosition.AtBeginning:
                                oldIndex = 0; 
                                newIndex = InternalCount - 1; 
                                args = /*new NotifyCollectionChangedEventArgs(
                                                NotifyCollectionChangedAction.Move, 
                                                this.NewItemPlaceholder,
                                                newIndex,
                                                oldIndex)*/
                                	NotifyCollectionChangedEventArgs.BuildAOII(NotifyCollectionChangedAction.Move, 
                                            this.NewItemPlaceholder,
                                            newIndex,
                                            oldIndex);
                                break; 
                            case NewItemPlaceholderPosition.AtEnd:
                                break; 
                        } 
                        break;
                } 

                // now make the change and raise the events
                if (args != null)
                { 
                	this._newItemPlaceholderPosition = value;
 
                    if (!this.IsGrouping) 
                    {
                    	this.ProcessCollectionChangedWithAdjustedIndex(args, oldIndex, newIndex); 
                    }
                    else
                    {
                        if (oldIndex >= 0) 
                        {
                            var index = (oldIndex == 0) ? 0 : this._group.Items.Count - 1; 
                            this._group.RemoveSpecialItem(index, this.NewItemPlaceholder, false /*loading*/); 
                        }
                        if (newIndex >= 0) 
                        {
                            var index = (newIndex == 0) ? 0 : this._group.Items.Count;
                            this._group.InsertSpecialItem(index, this.NewItemPlaceholder, false /*loading*/);
                        } 
                    }
 
                    this.OnPropertyChanged("NewItemPlaceholderPosition"); 
                }
            } 
        },
		
		
//		public bool? 
        IsLiveGrouping:
		{
			get:function()
			{
				return this._isLiveGrouping;
			},
			set:function(value)
			{
				if (!value.HasValue)
				{
					throw new ArgumentNullException("value");
				}
				if (value != this._isLiveGrouping)
				{
					this._isLiveGrouping = value;
					this.RebuildLocalArray();
					this.OnPropertyChanged("IsLiveGrouping");
				}
			}
		},
//		private bool 
		IsLiveShaping:
		{
			get:function()
			{
				return this.IsLiveSorting == true || this.IsLiveFiltering == true || this.IsLiveGrouping == true;
			}
		},
//		public ObservableCollection<string> 
		LiveSortingProperties:
		{
			get:function()
			{
				if (this._liveSortingProperties == null)
				{
					this._liveSortingProperties = new ObservableCollection/*<string>*/();
					this._liveSortingProperties.CollectionChanged += new NotifyCollectionChangedEventHandler(this.OnLivePropertyListChanged);
				}
				return this._liveSortingProperties;
			}
		},
//		public ObservableCollection<string> 
		LiveFilteringProperties:
		{
			get:function()
			{
				if (this._liveFilteringProperties == null)
				{
					this._liveFilteringProperties = new ObservableCollection/*<string>*/();
					this._liveFilteringProperties.CollectionChanged += new NotifyCollectionChangedEventHandler(this.OnLivePropertyListChanged);
				}
				return this._liveFilteringProperties;
			}
		},
//		public ObservableCollection<string> 
		LiveGroupingProperties:
		{
			get:function()
			{
				if (this._liveGroupingProperties == null)
				{
					this._liveGroupingProperties = new ObservableCollection/*<string>*/();
					this._liveGroupingProperties.CollectionChanged += new NotifyCollectionChangedEventHandler(this.OnLivePropertyListChanged);
				}
				return this._liveGroupingProperties;
			}
		},
//		protected IComparer 
		ActiveComparer:
		{
			get:function()
			{
				return this._activeComparer;
			},
			set:function(value)
			{
				this._activeComparer = value;
			}
		},
        /// <summary>
        /// Return true if the view supports <seealso cref="AddNew"/>. 
        /// </summary>
//        public bool 
        CanAddNew: 
        { 
            get:function() { return !this.IsEditingItem && !this.SourceList.IsFixedSize && this.CanConstructItem; }
        }, 

        /// <summary>
        /// Return true if the view supports <seealso cref="AddNewItem"/>.
        /// </summary> 
//        public bool 
        CanAddNewItem:
        { 
            get:function() { return !this.IsEditingItem && !this.SourceList.IsFixedSize; } 
        },

//        bool 
        CanConstructItem:
        {
            get:function()
            { 
                if (!this._isItemConstructorValid)
                { 
                	this.EnsureItemConstructor(); 
                }
 
                return (this._itemConstructor != null);
            }
        },

        /// <summary>
        /// Returns true if an </seealso cref="AddNew"> transaction is in progress.
        /// </summary>
//        public bool 
        IsAddingNew: 
        {
            get:function() { return (this._newItem != CollectionView.NoNewItem); } 
        }, 

        /// <summary> 
        /// When an </seealso cref="AddNew"> transaction is in progress, this property
        /// returns the new item.  Otherwise it returns null.
        /// </summary>
//        public object 
        CurrentAddItem: 
        {
            get:function() { return this.IsAddingNew ? this._newItem : null; } 
        }, 

        /// <summary> 
        /// Return true if the view supports <seealso cref="Remove"/> and
        /// <seealso cref="RemoveAt"/>. 
        /// </summary>
//        public bool 
        CanRemove:
        {
            get:function() { return !this.IsEditingItem && !this.IsAddingNew && !this.SourceList.IsFixedSize; } 
        },
        /// <summary>
        /// Returns true if the view supports the notion of "pending changes" on the 
        /// current edit item.  This may vary, depending on the view and the particular 
        /// item.  For example, a view might return true if the current edit item
        /// implements <seealso cref="IEditableObject"/>, or if the view has special 
        /// knowledge about the item that it can use to support rollback of pending
        /// changes.
        /// </summary>
//        public bool 
        CanCancelEdit: 
        {
            get:function() { return (this._editItem instanceof IEditableObject); } 
        }, 

        /// <summary> 
        /// Returns true if an </seealso cref="EditItem"> transaction is in progress.
        /// </summary>
//        public bool 
        IsEditingItem:
        { 
            get:function() { return (this._editItem != null); }
        }, 

        /// <summary>
        /// When an </seealso cref="EditItem"> transaction is in progress, this property 
        /// returns the affected item.  Otherwise it returns null.
        /// </summary>
//        public object 
        CurrentEditItem:
        { 
            get:function() { return this._editItem; }
        },
        
        /// <summary>
        /// Returns information about the properties available on items in the
        /// underlying collection.  This information may come from a schema, from 
        /// a type descriptor, from a representative item, or from some other source
        /// known to the view. 
        /// </summary> 
//        public ReadOnlyCollection<ItemPropertyInfo> 
        ItemProperties:
        { 
            get:function() { return this.GetItemProperties(); }
        },
        /// <summary>
        /// True if a private copy of the data is needed for sorting and filtering 
        /// </summary>
//        protected bool 
        UsesLocalArray: 
        { 
            get:function() { return this.ActiveComparer != null || this.ActiveFilter != null; }
        }, 
	
        /// <summary>
        /// Protected accessor to private _internalList field.
        /// </summary> 
//        protected IList 
        InternalList:
        { 
            get:function() { return this._internalList; } 
        },
 
        /// <summary>
        /// Protected accessor to private _activeComparer field.
        /// </summary>
//        protected IComparer 
        ActiveComparer :
        {
            get:function() { return this._activeComparer; },
            set:function(value) 
            {
            	this._activeComparer = value; 
            }
        },

        /// <summary> 
        /// Protected accessor to private _activeFilter field.
        /// </summary> 
//        protected Predicate<object> 
        ActiveFilter: 
        {
            get:function() { return this._activeFilter; },
            set:function(value) { this._activeFilter = value; }
        },

        /// <summary> 
        /// Protected accessor to _isGrouping field.
        /// </summary> 
//        protected bool 
        IsGrouping: 
        {
            get:function() { return this._isGrouping; } 
        },

        /// <summary>
        /// Protected accessor to private count. 
        /// </summary>
//        protected int 
        InternalCount: 
        { 
            get:function()
            { 
                if (this.IsGrouping)
                    return this._group.ItemCount;

                var delta = (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.None) ? 0 : 1; 
                if (this.UsesLocalArray && this.IsAddingNew)
                    ++delta; 
 
                return delta + this.InternalList.Count;
            } 
        },

        /// <summary> 
        ///     Contains a snapshot of the ICollectionView.SourceCollection
        ///     at the time that a change notification is posted. 
        ///     This is done in OnBeginChangeLogging. 
        /// </summary>
//        internal ArrayList 
        ShadowCollection: 
        {
            get:function() { return this._shadowCollection; },
            set:function(value) { this._shadowCollection = value; }
        }, 
 
        // returns true if this ListCollectionView has sort descriptions,
        // without tripping off lazy creation of .SortDescriptions collection 
//        internal bool 
        HasSortDescriptions:
        { 
            get:function() { return ((this._sort != null) && (this._sort.Count > 0)); } 
        },

        // true if CurrentPosition points to item within view
//        private bool 
        IsCurrentInView: 
        {
            get:function() { return (0 <= this.CurrentPosition && this.CurrentPosition < this.InternalCount); } 
        }, 

        // can the group name(s) for an item change after we've grouped the item? 
//        private bool 
        CanGroupNamesChange:
        {
            // There's no way we can deduce this - the app has to tell us.
            // If this is true, removing a grouped item is quite difficult. 
            // We cannot rely on its group names to tell us which group we inserted
            // it into (they may have been different at insertion time), so we 
            // have to do a linear search. 
            get:function() { return true; }
        }, 

//        private IList 
        SourceList:
        {
            get:function() { return this.SourceCollection instanceof IList ? this.SourceCollection : null; } 
        },
        
        
 
        
	});
	
	ListCollectionView.Type = new Type("ListCollectionView", ListCollectionView,
			[CollectionView.Type, IEditableCollectionViewAddNewItem.Type, IItemProperties.Type]);
	return ListCollectionView;
});


       


//        private IList               _internalList;
//        private CollectionViewGroupRoot _group; 
//        private bool                _isGrouping;
//        private IComparer           _activeComparer; 
//        private Predicate<object>   _activeFilter; 
//        private SortDescriptionCollection  _sort;
//        private IComparer           _customSort; 
//        private ArrayList           _shadowCollection;
//        private bool                _applyChangeToShadow = false;
//        private bool                _currentElementWasRemoved;  // true if we need to MoveCurrencyOffDeletedElement
//        private object              _newItem = NoNewItem; 
//        private object              _editItem;
//        private int                 _newItemIndex;  // position _newItem in the source collection 
//        private NewItemPlaceholderPosition _newItemPlaceholderPosition; 
//        private bool                _isItemConstructorValid;
//        private ConstructorInfo     _itemConstructor; 
//
//        private const int           _unknownIndex = -1;
//
//    }
// 
//    /// <summary> 
//    /// A delegate to select the group description as a function of the
//    /// parent group and its level. 
//    /// </summary>
//    public delegate GroupDescription GroupDescriptionSelectorCallback(CollectionViewGroup group, int level);


