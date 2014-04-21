/**
 * ListCollectionView
 */

define(["dojo/_base/declare", "system/Type", "data/CollectionView",
        "collections/IComparer", "componentmodel/IEditableCollectionViewAddNewItem",
        "componentmodel/IEditableCollectionView", "componentmodel/ICollectionViewLiveShaping", "componentmodel/IItemProperties",
        "specialized/NotifyCollectionChangedAction", "collections/IList",
        "system/EventHandler", "specialized/NotifyCollectionChangedEventHandler",
        "componentmodel/ISupportInitialize", "collections/ArrayList",
        "componentmodel/NewItemPlaceholderPosition", "data/CollectionViewGroupRoot",
        "internal.data/LiveShapingList"], 
		function(declare, Type, CollectionView, 
				IComparer, IEditableCollectionViewAddNewItem, 
		        IEditableCollectionView,ICollectionViewLiveShaping, IItemProperties,
		        NotifyCollectionChangedAction, IList,
				EventHandler, NotifyCollectionChangedEventHandler,
				ISupportInitialize, ArrayList,
				NewItemPlaceholderPosition, CollectionViewGroupRoot,
				LiveShapingList){
	
//	private const double 
	var LiveSortingDensityThreshold = 0.8;
//	private const int 
	var _unknownIndex = -1;
	
	var ListCollectionView = declare("ListCollectionView", CollectionView,{
		constructor:function(/*IList*/ list)
		{
			CollectionView.prototype.constructor.call(this, list);
			if (this.AllowsCrossThreadChanges)
			{
				BindingOperations.AccessCollection(list, /*delegate*/function()
				{
					this.ClearPendingChanges();
					this.ShadowCollection = new ArrayList(this.SourceCollection);
					this._internalList = this.ShadowCollection;
				}, false);
			}
			else
			{
				this._internalList = list;
			}
			if (this.InternalList.Count == 0)
			{
				this.SetCurrent(null, -1, 0);
			}
			else
			{
				this.SetCurrent(this.InternalList.Get(0), 0, 1);
			}
			this._group = new CollectionViewGroupRoot(this);
			this._group.GroupDescriptionChanged.Combine(new EventHandler(this, this.OnGroupDescriptionChanged));
			this._group.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnGroupChanged));
			this._group.GroupDescriptions.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnGroupByChanged));
			
			
//			private bool 
			_isGrouping = false;
//			private IComparer 
			this._activeComparer = null;
//			private Predicate<object> 
			this._activeFilter;
//			private SortDescriptionCollection 
			this._sort;
//			private IComparer 
			this._customSort;
//			private ArrayList 
			this._shadowCollection;
//			private bool 
			this._currentElementWasRemoved = false;
//			private object 
			this._newItem = CollectionView.NoNewItem;
//			private object 
			this._editItem;
//			private int 
			this._newItemIndex = 0;
//			private NewItemPlaceholderPosition 
			this._newItemPlaceholderPosition = 0; //NewItemPlaceholderPosition.None
//			private bool 
			this._isItemConstructorValid = false;
//			private ConstructorInfo 
			this._itemConstructor;
//			private List<Action> 
			this._deferredActions;
//			private ObservableCollection<string> 
			this._liveSortingProperties;
//			private ObservableCollection<string> 
			this._liveFilteringProperties;
//			private ObservableCollection<string> 
			this._liveGroupingProperties;
//			private bool? 
			this._isLiveSorting = false; //new bool?(false);
//			private bool? 
			this._isLiveFiltering =  false; //new bool?(false);
//			private bool? 
			this._isLiveGrouping =  false; //new bool?(false);
//			private bool 
			this._isLiveShapingDirty = false;
//			private bool 
			this._isRemoving = false;

		},
		
//		protected override void 
		RefreshOverride:function()
		{
			if (this.AllowsCrossThreadChanges)
			{
				BindingOperations.AccessCollection(this.SourceCollection, /*delegate*/function()
				{
//					lock (base.SyncRoot)
//					{
						this.ClearPendingChanges();
						this.ShadowCollection = new ArrayList(this.SourceCollection);
//					}
				}, false);
			}
			var currentItem = this.CurrentItem;
			var num = this.IsEmpty ? -1 : this.CurrentPosition;
			var isCurrentAfterLast = this.IsCurrentAfterLast;
			var isCurrentBeforeFirst = this.IsCurrentBeforeFirst;
			this.OnCurrentChanging();
			this.PrepareLocalArray();
			if (isCurrentBeforeFirst || this.IsEmpty)
			{
				this.SetCurrent(null, -1);
			}
			else
			{
				if (isCurrentAfterLast)
				{
					this.SetCurrent(null, this.InternalCount);
				}
				else
				{
					var num2 = this.InternalIndexOf(currentItem);
					if (num2 < 0)
					{
						num2 = ((this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) ? 1 : 0);
						var newItem;
						if (num2 < this.InternalCount && (newItem = this.InternalItemAt(num2)) != CollectionView.NewItemPlaceholder)
						{
							this.SetCurrent(newItem, num2);
						}
						else
						{
							this.SetCurrent(null, -1);
						}
					}
					else
					{
						this.SetCurrent(currentItem, num2);
					}
				}
			}
			this.OnCollectionChanged(/*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset)*/
					NotifyCollectionChangedEventArgs.BuildWithA(NotifyCollectionChangedAction.Reset));
			this.OnCurrentChanged();
			if (this.IsCurrentAfterLast != isCurrentAfterLast)
			{
				this.OnPropertyChanged("IsCurrentAfterLast");
			}
			if (this.IsCurrentBeforeFirst != isCurrentBeforeFirst)
			{
				this.OnPropertyChanged("IsCurrentBeforeFirst");
			}
			if (num != this.CurrentPosition)
			{
				this.OnPropertyChanged("CurrentPosition");
			}
			if (currentItem != this.CurrentItem)
			{
				this.OnPropertyChanged("CurrentItem");
			}
		},
//		public override bool 
		Contains:function(/*object*/ item)
		{
			this.VerifyRefreshNotDeferred();
			return this.InternalContains(item);
		},
//		public override bool 
		MoveCurrentToPosition:function(/*int*/ position)
		{
			this.VerifyRefreshNotDeferred();
			if (position < _unknownIndex || position > this.InternalCount)
			{
				throw new ArgumentOutOfRangeException("position");
			}
			if (position != this.CurrentPosition || !this.IsCurrentInSync)
			{
				var obj = (0 <= position && position < this.InternalCount) ? this.InternalItemAt(position) : null;
				if (obj != CollectionView.NewItemPlaceholder && this.OKToChangeCurrent())
				{
					var isCurrentAfterLast = this.IsCurrentAfterLast;
					var isCurrentBeforeFirst = this.IsCurrentBeforeFirst;
					this.SetCurrent(obj, position);
					this.OnCurrentChanged();
					if (this.IsCurrentAfterLast != isCurrentAfterLast)
					{
						this.OnPropertyChanged("IsCurrentAfterLast");
					}
					if (this.IsCurrentBeforeFirst != isCurrentBeforeFirst)
					{
						this.OnPropertyChanged("IsCurrentBeforeFirst");
					}
					this.OnPropertyChanged("CurrentPosition");
					this.OnPropertyChanged("CurrentItem");
				}
			}
			return this.IsCurrentInView;
		},
//		public override bool 
		PassesFilter:function(/*object*/ item)
		{
			return this.ActiveFilter == null || this.ActiveFilter(item);
		},
//		public override int
		IndexOf:function(/*object*/ item)
		{
			this.VerifyRefreshNotDeferred();
			return this.InternalIndexOf(item);
		},
//		public override object 
		GetItemAt:function(/*int*/ index)
		{
			this.VerifyRefreshNotDeferred();
			return this.InternalItemAt(index);
		},
//		protected virtual int 
		Compare:function(/*object*/ o1, /*object*/ o2)
		{
			if (this.IsGrouping)
			{
				var num = this.InternalIndexOf(o1);
				var num2 = this.InternalIndexOf(o2);
				return num - num2;
			}
			if (this.ActiveComparer != null)
			{
				return this.ActiveComparer.Compare(o1, o2);
			}
			var num3 = this.InternalList.IndexOf(o1);
			var num4 = this.InternalList.IndexOf(o2);
			return num3 - num4;
		},
//		protected override IEnumerator 
		GetEnumerator:function()
		{
			this.VerifyRefreshNotDeferred();
			return this.InternalGetEnumerator();
		},
//		public object 
		AddNew:function()
		{
			this.VerifyRefreshNotDeferred();
			if (this.IsEditingItem)
			{
				this.CommitEdit();
			}
			this.CommitNew();
			if (!this.CanAddNew)
			{
				throw new InvalidOperationException(SR.Get("MemberNotAllowedForView", ["AddNew"]));
			}
			return this.AddNewCommon(this._itemConstructor.Invoke(null));
		},
//		public object 
		AddNewItem:function(/*object*/ newItem)
		{
			this.VerifyRefreshNotDeferred();
			if (this.IsEditingItem)
			{
				this.CommitEdit();
			}
			this.CommitNew();
			if (!this.CanAddNewItem)
			{
				throw new InvalidOperationException(SR.Get("MemberNotAllowedForView", ["AddNewItem"]));
			}
			return this.AddNewCommon(newItem);
		},
//		public void 
		CommitNew:function()
		{
			if (this.IsEditingItem)
			{
				throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringTransaction", ["CommitNew",
			                                                                       					"EditItem"]));
			}
			this.VerifyRefreshNotDeferred();
			if (this._newItem == CollectionView.NoNewItem)
			{
				return;
			}
			if (this.IsGrouping)
			{
				this.CommitNewForGrouping();
				return;
			}
			var num = 0;
			switch (this.NewItemPlaceholderPosition)
			{
			case NewItemPlaceholderPosition.None:
				num = (this.UsesLocalArray ? (this.InternalCount - 1) : this._newItemIndex);
				break;
			case NewItemPlaceholderPosition.AtBeginning:
				num = 1;
				break;
			case NewItemPlaceholderPosition.AtEnd:
				num = this.InternalCount - 2;
				break;
			}
			var obj = this.EndAddNew(false);
			var num2 = this.AdjustBefore(NotifyCollectionChangedAction.Add, obj, this._newItemIndex);
			if (num2 < 0)
			{
				this.ProcessCollectionChangedWithAdjustedIndex(
						/*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Remove, obj, num)*/
						NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, obj, num), num, -1);
				return;
			}
			if (num == num2)
			{
				if (this.UsesLocalArray)
				{
					if (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning)
					{
						num2--;
					}
					this.InternalList.Insert(num2, obj);
					return;
				}
			}
			else
			{
				this.ProcessCollectionChangedWithAdjustedIndex(
						/*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Move, obj, num2, num)*/
						NotifyCollectionChangedEventArgs.BuildWithAOII(NotifyCollectionChangedAction.Move, obj, num2, num), num, num2);
			}
		},
//		public void 
		CancelNew:function()
		{
			if (this.IsEditingItem)
			{
				throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringTransaction", ["CancelNew",
			                                                                       					"EditItem"]));
			}
			this.VerifyRefreshNotDeferred();
			if (this._newItem == CollectionView.NoNewItem)
			{
				return;
			}
			BindingOperations.AccessCollection(this.SourceList, /*delegate*/function()
			{
				this.ProcessPendingChanges();
				this.SourceList.RemoveAt(this._newItemIndex);
				if (this._newItem != CollectionView.NoNewItem)
				{
					var num = this.AdjustBefore(NotifyCollectionChangedAction.Remove, this._newItem, this._newItemIndex);
					var changedItem = this.EndAddNew(true);
					this.ProcessCollectionChangedWithAdjustedIndex(
							/*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Remove, changedItem, num)*/
							NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, changedItem, num), num, -1);
				}
			}, true);
		},
//		public void 
		RemoveAt:function(/*int*/ index)
		{
			if (this.IsEditingItem || this.IsAddingNew)
			{
				throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringAddOrEdit", ["RemoveAt"]));
			}
			this.VerifyRefreshNotDeferred();
			this.RemoveImpl(this.GetItemAt(index), index);
		},
//		public void 
		Remove:function(/*object*/ item)
		{
			if (this.IsEditingItem || this.IsAddingNew)
			{
				throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringAddOrEdit", ["Remove"]));
			}
			this.VerifyRefreshNotDeferred();
			var num = this.InternalIndexOf(item);
			if (num >= 0)
			{
				this.RemoveImpl(item, num);
			}
		},
//		public void 
		EditItem:function(/*object*/ item)
		{
			this.VerifyRefreshNotDeferred();
			if (item == CollectionView.NewItemPlaceholder)
			{
				throw new ArgumentException(SR.Get("CannotEditPlaceholder"), "item");
			}
			if (this.IsAddingNew)
			{
				if (Object.Equals(item, this._newItem))
				{
					return;
				}
				this.CommitNew();
			}
			this.CommitEdit();
			this.SetEditItem(item);
			/*IEditableObject*/ editableObject = item instanceof IEditableObject ? item : null;
			if (editableObject != null)
			{
				editableObject.BeginEdit();
			}
		},
//		public void 
		CommitEdit:function()
		{
			if (this.IsAddingNew)
			{
				throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringTransaction", ["CommitEdit",
			                                                                       					"AddNew"]));
			}
			this.VerifyRefreshNotDeferred();
			if (this._editItem == null)
			{
				return;
			}
			var editItem = this._editItem;
			/*IEditableObject*/var editableObject = this._editItem instanceof IEditableObject ? this._editItem : null;
			this.SetEditItem(null);
			if (editableObject != null)
			{
				editableObject.EndEdit();
			}
			var num = this.InternalIndexOf(editItem);
			var flag = num >= 0;
			var flag2 = flag ? this.PassesFilter(editItem) : (this.SourceList.Contains(editItem) && this.PassesFilter(editItem));
			if (this.IsGrouping)
			{
				if (flag)
				{
					this.RemoveItemFromGroups(editItem);
				}
				if (flag2)
				{
					/*LiveShapingList*/var liveShapingList = this.InternalList instanceof LiveShapingList ? this.InternalList : null;
					/*LiveShapingItem*/var lsi = (liveShapingList == null) ? null : liveShapingList.ItemAt(liveShapingList.IndexOf(editItem));
					this.AddItemToGroups(editItem, lsi);
				}
				return;
			}
			if (this.UsesLocalArray)
			{
				/*IList*/var internalList = this.InternalList;
				var num2 = (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) ? 1 : 0;
				var num3 = -1;
				if (flag)
				{
					if (!flag2)
					{
						this.ProcessCollectionChangedWithAdjustedIndex(
								/*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Remove, editItem, num)*/
								NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, editItem, num), num, -1);
						return;
					}
					if (this.ActiveComparer != null)
					{
						var num4 = num - num2;
						if (num4 > 0 && this.ActiveComparer.Compare(internalList.Get(num4 - 1), editItem) > 0)
						{
							num3 = internalList.Search(0, num4, editItem, this.ActiveComparer);
							if (num3 < 0)
							{
								num3 = ~num3;
							}
						}
						else
						{
							if (num4 < internalList.Count - 1 && this.ActiveComparer.Compare(editItem, internalList.Get(num4 + 1)) > 0)
							{
								num3 = internalList.Search(num4 + 1, internalList.Count - num4 - 1, editItem, this.ActiveComparer);
								if (num3 < 0)
								{
									num3 = ~num3;
								}
								num3--;
							}
						}
						if (num3 >= 0)
						{
							this.ProcessCollectionChangedWithAdjustedIndex(
									/*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Move, editItem, num3 + num2, num)*/
									NotifyCollectionChangedEventArgs.BuildWithAOII(NotifyCollectionChangedAction.Move, editItem, num3 + num2, num), num, num3 + num2);
							return;
						}
					}
				}
				else
				{
					if (flag2)
					{
						num3 = this.AdjustBefore(NotifyCollectionChangedAction.Add, editItem, this.SourceList.IndexOf(editItem));
						this.ProcessCollectionChangedWithAdjustedIndex(
								/*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Add, editItem, num3 + num2)*/
								NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add, editItem, num3 + num2), -1, num3 + num2);
					}
				}
			}
		},
//		public void 
		CancelEdit:function()
		{
			if (this.IsAddingNew)
			{
				throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringTransaction", ["CancelEdit",
			                                                                       					"AddNew"]));
			}
			this.VerifyRefreshNotDeferred();
			if (this._editItem == null)
			{
				return;
			}
			/*IEditableObject*/var editableObject = this._editItem instanceof IEditableObject ? this._editItem : null;
			this.SetEditItem(null);
			if (editableObject != null)
			{
				editableObject.CancelEdit();
				return;
			}
			throw new InvalidOperationException(SR.Get("CancelEditNotSupported"));
		},
//		protected override void 
		OnAllowsCrossThreadChangesChanged:function()
		{
			if (this.AllowsCrossThreadChanges)
			{
				BindingOperations.AccessCollection(this.SourceCollection, /*delegate*/function()
				{
//					lock (this.SyncRoot)
//					{
						this.ClearPendingChanges();
						this.ShadowCollection = new ArrayList(this.SourceCollection);
						if (!this.UsesLocalArray)
						{
							this._internalList = this.ShadowCollection;
						}
//					}
				}, false);
				return;
			}
			this.ShadowCollection = null;
			if (!this.UsesLocalArray)
			{
				this._internalList = this.SourceList;
			}
		},
//		protected override void 
		OnBeginChangeLogging:function(/*NotifyCollectionChangedEventArgs*/ args)
		{
		},
//		protected override void 
		ProcessCollectionChanged:function(/*NotifyCollectionChangedEventArgs*/ args)
		{
			if (args == null)
			{
				throw new ArgumentNullException("args");
			}
			this.ValidateCollectionChangedEventArgs(args);
			if (!this._isItemConstructorValid)
			{
				switch (args.Action)
				{
				case NotifyCollectionChangedAction.Add:
				case NotifyCollectionChangedAction.Replace:
				case NotifyCollectionChangedAction.Reset:
					this.OnPropertyChanged("CanAddNew");
					break;
				}
			}
			var num = -1;
			var num2 = -1;
			if (this.AllowsCrossThreadChanges && args.Action != NotifyCollectionChangedAction.Reset)
			{
				if ((args.Action != NotifyCollectionChangedAction.Remove && args.NewStartingIndex < 0) || (args.Action != NotifyCollectionChangedAction.Add && args.OldStartingIndex < 0))
				{
					return;
				}
				this.AdjustShadowCopy(args);
			}
			if (args.Action == NotifyCollectionChangedAction.Reset)
			{
				if (this.IsEditingItem)
				{
					this.ImplicitlyCancelEdit();
				}
				if (this.IsAddingNew)
				{
					this._newItemIndex = this.SourceList.IndexOf(this._newItem);
					if (this._newItemIndex < 0)
					{
						this.EndAddNew(true);
					}
				}
				this.RefreshOrDefer();
				return;
			}
			if (args.Action == NotifyCollectionChangedAction.Add && this._newItemIndex == -2)
			{
				this.BeginAddNew(args.NewItems.Get(0), args.NewStartingIndex);
				return;
			}
			if (args.Action != NotifyCollectionChangedAction.Remove)
			{
				num2 = this.AdjustBefore(NotifyCollectionChangedAction.Add, args.NewItems.Get(0), args.NewStartingIndex);
			}
			if (args.Action != NotifyCollectionChangedAction.Add)
			{
				num = this.AdjustBefore(NotifyCollectionChangedAction.Remove, args.OldItems.Get(0), args.OldStartingIndex);
				if (this.UsesLocalArray && num >= 0 && num < num2)
				{
					num2--;
				}
			}
			switch (args.Action)
			{
			case NotifyCollectionChangedAction.Add:
				if (this.IsAddingNew && args.NewStartingIndex <= this._newItemIndex)
				{
					this._newItemIndex++;
				}
				break;
			case NotifyCollectionChangedAction.Remove:
			{
				if (this.IsAddingNew && args.OldStartingIndex < this._newItemIndex)
				{
					this._newItemIndex--;
				}
				var obj = args.OldItems.Get(0);
				if (obj == this.CurrentEditItem)
				{
					this.ImplicitlyCancelEdit();
				}
				else
				{
					if (obj == this.CurrentAddItem)
					{
						this.EndAddNew(true);
					}
				}
				break;
			}
			case NotifyCollectionChangedAction.Move:
				if (this.IsAddingNew)
				{
					if (args.OldStartingIndex == this._newItemIndex)
					{
						this._newItemIndex = args.NewStartingIndex;
					}
					else
					{
						if (args.OldStartingIndex < this._newItemIndex && this._newItemIndex <= args.NewStartingIndex)
						{
							this._newItemIndex--;
						}
						else
						{
							if (args.NewStartingIndex <= this._newItemIndex && this._newItemIndex < args.OldStartingIndex)
							{
								this._newItemIndex++;
							}
						}
					}
				}
				if (this.ActiveComparer != null && num == num2)
				{
					return;
				}
				break;
			}
			this.ProcessCollectionChangedWithAdjustedIndex(args, num, num2);
		},
//		protected int 
		InternalIndexOf:function(/*object*/ item)
		{
			if (this.IsGrouping)
			{
				return this._group.LeafIndexOf(item);
			}
			if (item == CollectionView.NewItemPlaceholder)
			{
				switch (this.NewItemPlaceholderPosition)
				{
				case NewItemPlaceholderPosition.None:
					return -1;
				case NewItemPlaceholderPosition.AtBeginning:
					return 0;
				case NewItemPlaceholderPosition.AtEnd:
					return this.InternalCount - 1;
				}
			}
			else
			{
				if (this.IsAddingNew && object.Equals(item, this._newItem))
				{
					switch (this.NewItemPlaceholderPosition)
					{
					case NewItemPlaceholderPosition.None:
						if (this.UsesLocalArray)
						{
							return this.InternalCount - 1;
						}
						break;
					case NewItemPlaceholderPosition.AtBeginning:
						return 1;
					case NewItemPlaceholderPosition.AtEnd:
						return this.InternalCount - 2;
					}
				}
			}
			var num = this.InternalList.IndexOf(item);
			if (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning && num >= 0)
			{
				num += (this.IsAddingNew ? 2 : 1);
			}
			return num;
		},
//		protected object 
		InternalItemAt:function(/*int*/ index)
		{
			if (this.IsGrouping)
			{
				return this._group.LeafAt(index);
			}
			switch (this.NewItemPlaceholderPosition)
			{
			case NewItemPlaceholderPosition.None:
				if (this.IsAddingNew && this.UsesLocalArray && index == this.InternalCount - 1)
				{
					return this._newItem;
				}
				break;
			case NewItemPlaceholderPosition.AtBeginning:
				if (index == 0)
				{
					return CollectionView.NewItemPlaceholder;
				}
				index--;
				if (this.IsAddingNew)
				{
					if (index == 0)
					{
						return this._newItem;
					}
					if (this.UsesLocalArray || index <= this._newItemIndex)
					{
						index--;
					}
				}
				break;
			case NewItemPlaceholderPosition.AtEnd:
				if (index == this.InternalCount - 1)
				{
					return CollectionView.NewItemPlaceholder;
				}
				if (this.IsAddingNew)
				{
					if (index == this.InternalCount - 2)
					{
						return this._newItem;
					}
					if (!this.UsesLocalArray && index >= this._newItemIndex)
					{
						index++;
					}
				}
				break;
			}
			return this.InternalList.Get(index);
		},
//		protected bool 
		InternalContains:function(/*object*/ item)
		{
			if (item == CollectionView.NewItemPlaceholder)
			{
				return this.NewItemPlaceholderPosition != NewItemPlaceholderPosition.None;
			}
			if (this.IsGrouping)
			{
				return this._group.LeafIndexOf(item) >= 0;
			}
			return this.InternalList.Contains(item);
		},
//		protected IEnumerator 
		InternalGetEnumerator:function()
		{
			if (!this.IsGrouping)
			{
				return new CollectionView.PlaceholderAwareEnumerator(this, this.InternalList.GetEnumerator(), 
						this.NewItemPlaceholderPosition, this._newItem);
			}
			return this._group.GetLeafEnumerator();
		},
//		internal void 
		AdjustShadowCopy:function(/*NotifyCollectionChangedEventArgs*/ e)
		{
			switch (e.Action)
			{
			case NotifyCollectionChangedAction.Add:
				if (e.NewStartingIndex > -1)
				{
					this.ShadowCollection.Insert(e.NewStartingIndex, e.NewItems.Get(0));
					return;
				}
				this.ShadowCollection.Add(e.NewItems.Get(0));
				return;
			case NotifyCollectionChangedAction.Remove:
				if (e.OldStartingIndex > -1)
				{
					this.ShadowCollection.RemoveAt(e.OldStartingIndex);
					return;
				}
				this.ShadowCollection.Remove(e.OldItems.Get(0));
				return;
			case NotifyCollectionChangedAction.Replace:
			{
				if (e.OldStartingIndex > -1)
				{
					this.ShadowCollection.Set(e.OldStartingIndex, e.NewItems.Get(0));
					return;
				}
				var num = this.ShadowCollection.IndexOf(e.OldItems.Get(0));
				this.ShadowCollection.Set(num, e.NewItems.Get(0));
				return;
			}
			case NotifyCollectionChangedAction.Move:
			{
				var num = e.OldStartingIndex;
				if (num < 0)
				{
					num = this.ShadowCollection.IndexOf(e.NewItems.Get(0));
				}
				this.ShadowCollection.RemoveAt(num);
				this.ShadowCollection.Insert(e.NewStartingIndex, e.NewItems.Get(0));
				return;
			}
			default:
				throw new NotSupportedException(SR.Get("UnexpectedCollectionChangeAction", [e.Action]));
			}
		},
//		internal void 
		RestoreLiveShaping:function()
		{
			/*LiveShapingList*/var liveShapingList = this.InternalList;
			liveShapingList = liveShapingList instanceof LiveShapingList ? liveShapingList : null;
			if (liveShapingList == null)
			{
				return;
			}
			if (this.ActiveComparer != null)
			{
				var num = liveShapingList.SortDirtyItems.Count / (liveShapingList.Count + 1);
				if (num < LiveSortingDensityThreshold)
				{
//					using (List<LiveShapingItem>.Enumerator enumerator = liveShapingList.SortDirtyItems.GetEnumerator())
					enumerator = liveShapingList.SortDirtyItems.GetEnumerator();
					{
						while (enumerator.MoveNext())
						{
							/*LiveShapingItem*/var current = enumerator.Current;
							if (current.IsSortDirty && !current.IsDeleted && current.ForwardChanges)
							{
								current.IsSortDirty = false;
								current.IsSortPendingClean = false;
			
								var num2Out = {"num2" : 0};
								var num3Out = {"num3" : 0};
								liveShapingList.FindPosition(current, /*out num2*/num2Out, /*out num3*/num3Out);
								var num2 = num2Out.num2;
								var num3 = num3Out.num3;
								if (num2 != num3)
								{
									if (num2 < num3)
									{
										num3--;
									}
									this.ProcessCollectionChangedWithAdjustedIndex(
											/*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Move, current.Item, num2, num3)*/
											NotifyCollectionChangedEventArgs.BuildWithAOII(NotifyCollectionChangedAction.Move, current.Item, num2, num3), num2, num3);
								}
							}
						}
//						goto IL_DE;
					}
				}else   //cym added
					liveShapingList.RestoreLiveSortingByInsertionSort(new Action/*<NotifyCollectionChangedEventArgs, int, int>*/(this.ProcessCollectionChangedWithAdjustedIndex));
			}
//			IL_DE:
			liveShapingList.SortDirtyItems.Clear();
			if (this.ActiveFilter != null)
			{
				for(var i=0; i<liveShapingList.FilterDirtyItems.Count; i++) //foreach (LiveShapingItem current2 in liveShapingList.FilterDirtyItems)
				{
					current2 = liveShapingList.FilterDirtyItems.Get(i);
					if (current2.IsFilterDirty && current2.ForwardChanges)
					{
						var item = current2.Item;
						var failsFilter = current2.FailsFilter;
						var flag = !this.PassesFilter(item);
						if (failsFilter != flag)
						{
							if (flag)
							{
								var num4 = liveShapingList.IndexOf(current2);
								this.ProcessCollectionChangedWithAdjustedIndex(
										/*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Remove, item, num4)*/
										NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, item, num4), num4, -1);
								liveShapingList.AddFilteredItem(current2);
							}
							else
							{
								liveShapingList.RemoveFilteredItem(current2);
								var num4;
								if (this.ActiveComparer != null)
								{
									num4 = liveShapingList.Search(0, liveShapingList.Count, item);
									if (num4 < 0)
									{
										num4 = ~num4;
									}
								}
								else
								{
									var list = (this.AllowsCrossThreadChanges ? this.ShadowCollection : this.SourceCollection);
									list = list instanceof IList ? list : null;
									num4 = current2.GetAndClearStartingIndex();
									while (num4 < list.Count && !Object.Equals(item, list.Get(num4)))
									{
										num4++;
									}
									liveShapingList.SetStartingIndexForFilteredItem(item, num4 + 1);
									num4 = this.MatchingSearch(item, num4, list, liveShapingList);
								}
								this.ProcessCollectionChangedWithAdjustedIndex(
										/*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Add, item, num4)*/
										NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add, item, num4), -1, num4);
							}
						}
						current2.IsFilterDirty = false;
					}
				}
			}
			liveShapingList.FilterDirtyItems.Clear();
			if (this.IsGrouping)
			{
				/*List<AbandonedGroupItem>*/var deleteList = new List/*<AbandonedGroupItem>*/();
				for(var i=0; i<liveShapingList.GroupDirtyItems.Count; i++) //foreach (LiveShapingItem current3 in liveShapingList.GroupDirtyItems)
				{
					var current3 = liveShapingList.GroupDirtyItems.Get(i);
					if (current3.IsGroupDirty && !current3.IsDeleted && current3.ForwardChanges)
					{
						this._group.RestoreGrouping(current3, deleteList);
						current3.IsGroupDirty = false;
					}
				}
				this._group.DeleteAbandonedGroupItems(deleteList);
			}
			liveShapingList.GroupDirtyItems.Clear();
			this.IsLiveShapingDirty = false;
		},
//		private void 
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
		
//      void 
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
		
//		private object 
		EndAddNew:function(/*bool*/ cancel)
		{
			/*object*/var newItem = this._newItem;
			this.SetNewItem(CollectionView.NoNewItem);
			/*IEditableObject*/var editableObject = newItem instanceof IEditableObject ? newItem : null;
			if (editableObject != null)
			{
				if (cancel)
				{
					editableObject.CancelEdit();
				}
				else
				{
					editableObject.EndEdit();
				}
			}
			/*ISupportInitialize*/var supportInitialize = newItem instanceof ISupportInitialize ? newItem : null;
			if (supportInitialize != null)
			{
				supportInitialize.EndInit();
			}
			return newItem;
		},
//		private void 
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
//		private void 
		RemoveImpl:function(/*object*/ item, /*int*/ index)
		{
			if (item == CollectionView.NewItemPlaceholder)
			{
				throw new InvalidOperationException(SR.Get("RemovingPlaceholder"));
			}
			BindingOperations.AccessCollection(this.SourceList, /*delegate*/function()
			{
				this.ProcessPendingChanges();
				if (index >= this.InternalList.Count || !Object.Equals(item, this.GetItemAt(index)))
				{
					index = this.InternalList.IndexOf(item);
					if (index < 0)
					{
						return;
					}
				}
				var num = (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) ? 1 : 0;
				var index2 = index - num;
				var flag = !(this.SourceList instanceof INotifyCollectionChanged);
				try
				{
					this._isRemoving = true;
					if (this.UsesLocalArray || this.IsGrouping)
					{
						if (flag)
						{
							index2 = this.SourceList.IndexOf(item);
							this.SourceList.RemoveAt(index2);
						}
						else
						{
							this.SourceList.Remove(item);
						}
					}
					else
					{
						this.SourceList.RemoveAt(index2);
					}
					if (flag)
					{
						this.ProcessCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, item, index2));
					}
				}
				finally
				{
					this._isRemoving = false;
					this.DoDeferredActions();
				}
			}, true);
		},
//		private void 
		ImplicitlyCancelEdit:function()
		{
			/*IEditableObject*/var editableObject = this._editItem;
			editableObject = editableObject instanceof IEditableObject ? editableObject : null;
			this.SetEditItem(null);
			if (editableObject != null)
			{
				editableObject.CancelEdit();
			}
		},
//		private void 
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
//		private void 
		OnLivePropertyListChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
		{
			if (this.IsLiveShaping)
			{
				this.RebuildLocalArray();
			}
		},
//		private void 
		ProcessCollectionChangedWithAdjustedIndex:function(/*NotifyCollectionChangedEventArgs*/ args, /*int*/ adjustedOldIndex, /*int*/ adjustedNewIndex)
		{
			/*NotifyCollectionChangedAction*/var notifyCollectionChangedAction = args.Action;
			if (adjustedOldIndex == adjustedNewIndex && adjustedOldIndex >= 0)
			{
				notifyCollectionChangedAction = NotifyCollectionChangedAction.Replace;
			}
			else
			{
				if (adjustedOldIndex == -1)
				{
					if (adjustedNewIndex < 0 && args.Action != NotifyCollectionChangedAction.Add)
					{
						notifyCollectionChangedAction = NotifyCollectionChangedAction.Remove;
					}
				}
				else
				{
					if (adjustedOldIndex < -1)
					{
						if (adjustedNewIndex >= 0)
						{
							notifyCollectionChangedAction = NotifyCollectionChangedAction.Add;
						}
						else
						{
							if (notifyCollectionChangedAction == NotifyCollectionChangedAction.Move)
							{
								return;
							}
						}
					}
					else
					{
						if (adjustedNewIndex < 0)
						{
							notifyCollectionChangedAction = NotifyCollectionChangedAction.Remove;
						}
						else
						{
							notifyCollectionChangedAction = NotifyCollectionChangedAction.Move;
						}
					}
				}
			}
			var num = this.IsGrouping ? 0 : ((this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) ? (this.IsAddingNew ? 2 : 1) : 0);
			var currentPosition = this.CurrentPosition;
			var currentPosition2 = this.CurrentPosition;
			var currentItem = this.CurrentItem;
			var isCurrentAfterLast = this.IsCurrentAfterLast;
			var isCurrentBeforeFirst = this.IsCurrentBeforeFirst;
			var obj = (args.OldItems != null && args.OldItems.Count > 0) ? args.OldItems.Get(0) : null;
			var obj2 = (args.NewItems != null && args.NewItems.Count > 0) ? args.NewItems.Get(0) : null;
			/*LiveShapingList*/var liveShapingList = this.InternalList instanceof LiveShapingList ? this.InternalList : null;
			/*NotifyCollectionChangedEventArgs*/var notifyCollectionChangedEventArgs = null;
			switch (notifyCollectionChangedAction)
			{
			case NotifyCollectionChangedAction.Add:
			{
				if (adjustedNewIndex == -2)
				{
					if (liveShapingList != null && this.IsLiveFiltering == true)
					{
						liveShapingList.AddFilteredItem(obj2);
					}
					return;
				}
				var flag = obj2 == CollectionView.NewItemPlaceholder || (this.IsAddingNew && object.Equals(this._newItem, obj2));
				if (this.UsesLocalArray && !flag)
				{
					this.InternalList.Insert(adjustedNewIndex - num, obj2);
				}
				if (!this.IsGrouping)
				{
					this.AdjustCurrencyForAdd(adjustedNewIndex);
					args = /*new NotifyCollectionChangedEventArgs(notifyCollectionChangedAction, obj2, adjustedNewIndex)*/
						NotifyCollectionChangedEventArgs.BuildWithAOI(notifyCollectionChangedAction, obj2, adjustedNewIndex);
				}
				else
				{
					/*LiveShapingItem*/var lsi = (liveShapingList == null || flag) ? null : liveShapingList.ItemAt(adjustedNewIndex - num);
					this.AddItemToGroups(obj2, lsi);
				}
				break;
			}
			case NotifyCollectionChangedAction.Remove:
				if (adjustedOldIndex == -2)
				{
					if (liveShapingList != null && this.IsLiveFiltering == true)
					{
						liveShapingList.RemoveFilteredItem(obj);
					}
					return;
				}
				if (this.UsesLocalArray)
				{
					var num2 = adjustedOldIndex - num;
					if (num2 < this.InternalList.Count && Object.Equals(this.ItemFrom(this.InternalList.Get(num2)), obj))
					{
						this.InternalList.RemoveAt(num2);
					}
				}
				if (!this.IsGrouping)
				{
					this.AdjustCurrencyForRemove(adjustedOldIndex);
					args = /*new NotifyCollectionChangedEventArgs(notifyCollectionChangedAction, args.OldItems.Get(0), adjustedOldIndex)*/
						NotifyCollectionChangedEventArgs.BuildWithAOI(notifyCollectionChangedAction, args.OldItems.Get(0), adjustedOldIndex);
				}
				else
				{
					this.RemoveItemFromGroups(obj);
				}
				break;
			case NotifyCollectionChangedAction.Replace:
				if (adjustedOldIndex == -2)
				{
					if (liveShapingList != null && this.IsLiveFiltering == true)
					{
						liveShapingList.ReplaceFilteredItem(obj, obj2);
					}
					return;
				}
				if (this.UsesLocalArray)
				{
					this.InternalList.Set(adjustedOldIndex - num, obj2);
				}
				if (!this.IsGrouping)
				{
					this.AdjustCurrencyForReplace(adjustedOldIndex);
					args = /*new NotifyCollectionChangedEventArgs(notifyCollectionChangedAction, args.NewItems.Get(0), args.OldItems.Get(0), adjustedOldIndex)*/
						NotifyCollectionChangedEventArgs.BuildWithAOOI(notifyCollectionChangedAction, args.NewItems.Get(0), args.OldItems.Get(0), adjustedOldIndex);
				}
				else
				{
					/*LiveShapingItem*/var lsi = (liveShapingList == null) ? null : liveShapingList.ItemAt(adjustedNewIndex - num);
					this.RemoveItemFromGroups(obj);
					this.AddItemToGroups(obj2, lsi);
				}
				break;
			case NotifyCollectionChangedAction.Move:
			{
				var flag2 = Object.Equals(obj, obj2);
				if (this.UsesLocalArray && (liveShapingList == null || !liveShapingList.IsRestoringLiveSorting))
				{
					var num3 = adjustedOldIndex - num;
					var num4 = adjustedNewIndex - num;
					if (num3 < this.InternalList.Count && object.Equals(this.InternalList.Get(num3), obj))
					{
						if (CollectionView.NewItemPlaceholder != obj2)
						{
							this.InternalList.Move(num3, num4);
							if (!flag2)
							{
								this.InternalList.Set(num4, obj2);
							}
						}
						else
						{
							this.InternalList.RemoveAt(num3);
						}
					}
					else
					{
						if (CollectionView.NewItemPlaceholder != obj2)
						{
							this.InternalList.Insert(num4, obj2);
						}
					}
				}
				if (!this.IsGrouping)
				{
					this.AdjustCurrencyForMove(adjustedOldIndex, adjustedNewIndex);
					if (flag2)
					{
						args = /*new NotifyCollectionChangedEventArgs(notifyCollectionChangedAction, args.OldItems.Get(0), adjustedNewIndex, adjustedOldIndex)*/
							NotifyCollectionChangedEventArgs.BuildWithAOII(notifyCollectionChangedAction, args.OldItems.Get(0), adjustedNewIndex, adjustedOldIndex);
					}
					else
					{
						notifyCollectionChangedEventArgs = /*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Add, args.NewItems, adjustedNewIndex)*/
							NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add, args.NewItems, adjustedNewIndex);
						args = /*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Remove, args.OldItems, adjustedOldIndex)*/
							NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, args.OldItems, adjustedOldIndex);
					}
				}
				else
				{
					/*LiveShapingItem*/var lsi = (liveShapingList == null) ? null : liveShapingList.ItemAt(adjustedNewIndex);
					if (flag2)
					{
						this.MoveItemWithinGroups(obj, lsi, adjustedOldIndex, adjustedNewIndex);
					}
					else
					{
						this.RemoveItemFromGroups(obj);
						this.AddItemToGroups(obj2, lsi);
					}
				}
				break;
			}
			default:
				Invariant.Assert(false, SR.Get("UnexpectedCollectionChangeAction", [notifyCollectionChangedAction]));
				break;
			}
			var flag3 = this.IsCurrentAfterLast != isCurrentAfterLast;
			var flag4 = this.IsCurrentBeforeFirst != isCurrentBeforeFirst;
			var flag5 = this.CurrentPosition != currentPosition2;
			var flag6 = this.CurrentItem != currentItem;
			isCurrentAfterLast = this.IsCurrentAfterLast;
			isCurrentBeforeFirst = this.IsCurrentBeforeFirst;
			currentPosition2 = this.CurrentPosition;
			currentItem = this.CurrentItem;
			if (!this.IsGrouping)
			{
				this.OnCollectionChanged(args);
				if (notifyCollectionChangedEventArgs != null)
				{
					this.OnCollectionChanged(notifyCollectionChangedEventArgs);
				}
				if (this.IsCurrentAfterLast != isCurrentAfterLast)
				{
					flag3 = false;
					isCurrentAfterLast = this.IsCurrentAfterLast;
				}
				if (this.IsCurrentBeforeFirst != isCurrentBeforeFirst)
				{
					flag4 = false;
					isCurrentBeforeFirst = this.IsCurrentBeforeFirst;
				}
				if (this.CurrentPosition != currentPosition2)
				{
					flag5 = false;
					currentPosition2 = this.CurrentPosition;
				}
				if (this.CurrentItem != currentItem)
				{
					flag6 = false;
					currentItem = this.CurrentItem;
				}
			}
			if (this._currentElementWasRemoved)
			{
				this.MoveCurrencyOffDeletedElement(currentPosition);
				flag3 = (flag3 || this.IsCurrentAfterLast != isCurrentAfterLast);
				flag4 = (flag4 || this.IsCurrentBeforeFirst != isCurrentBeforeFirst);
				flag5 = (flag5 || this.CurrentPosition != currentPosition2);
				flag6 = (flag6 || this.CurrentItem != currentItem);
			}
			if (flag3)
			{
				this.OnPropertyChanged("IsCurrentAfterLast");
			}
			if (flag4)
			{
				this.OnPropertyChanged("IsCurrentBeforeFirst");
			}
			if (flag5)
			{
				this.OnPropertyChanged("CurrentPosition");
			}
			if (flag6)
			{
				this.OnPropertyChanged("CurrentItem");
			}
		},
//		private void 
		ValidateCollectionChangedEventArgs:function(/*NotifyCollectionChangedEventArgs*/ e)
		{
			switch (e.Action)
			{
			case NotifyCollectionChangedAction.Add:
				if (e.NewItems.Count != 1)
				{
					throw new NotSupportedException(SR.Get("RangeActionsNotSupported"));
				}
				break;
			case NotifyCollectionChangedAction.Remove:
				if (e.OldItems.Count != 1)
				{
					throw new NotSupportedException(SR.Get("RangeActionsNotSupported"));
				}
				break;
			case NotifyCollectionChangedAction.Replace:
				if (e.NewItems.Count != 1 || e.OldItems.Count != 1)
				{
					throw new NotSupportedException(SR.Get("RangeActionsNotSupported"));
				}
				break;
			case NotifyCollectionChangedAction.Move:
				if (e.NewItems.Count != 1)
				{
					throw new NotSupportedException(SR.Get("RangeActionsNotSupported"));
				}
				if (e.NewStartingIndex < 0)
				{
					throw new InvalidOperationException(SR.Get("CannotMoveToUnknownPosition"));
				}
				break;
			case NotifyCollectionChangedAction.Reset:
				break;
			default:
				throw new NotSupportedException(SR.Get("UnexpectedCollectionChangeAction", [e.Action]));
			}
		},
//		private void 
		PrepareLocalArray:function()
		{
			this.PrepareShaping();
			/*LiveShapingList*/var liveShapingList = this._internalList;
			liveShapingList = liveShapingList instanceof LiveShapingList ? liveShapingList : null;
			if (liveShapingList != null)
			{
				liveShapingList.LiveShapingDirty.Remove(new EventHandler(this, this.OnLiveShapingDirty));
				liveShapingList.Clear();
			}
			/*IList*/var list = this.AllowsCrossThreadChanges ? this.ShadowCollection : (this.SourceCollection instanceof IList ? this.SourceCollection : null);
			if (!this.UsesLocalArray)
			{
				this._internalList = list;
			}
			else
			{
				var count = list.Count;
				/*IList*/var arg_8A_0;
				if (!this.IsLiveShaping)
				{
					/*IList*/var list2 = new ArrayList(count);
					arg_8A_0 = list2;
				}
				else
				{
					arg_8A_0 = new LiveShapingList(this, this.GetLiveShapingFlags(), this.ActiveComparer);
				}
				/*IList*/var list3 = arg_8A_0;
				liveShapingList = (list3 instanceof LiveShapingList ? list3 : null);
				for (var i = 0; i < count; i++)
				{
					if (!this.IsAddingNew || i != this._newItemIndex)
					{
						/*object*/var obj = list.Get(i);
						if (this.ActiveFilter == null || this.ActiveFilter(obj))
						{
							list3.Add(obj);
						}
						else
						{
							if (this.IsLiveFiltering == true)
							{
								liveShapingList.AddFilteredItem(obj);
							}
						}
					}
				}
				if (this.ActiveComparer != null)
				{
					list3.Sort(this.ActiveComparer);
				}
				if (liveShapingList != null)
				{
					liveShapingList.LiveShapingDirty.Combine(new EventHandler(this, this.OnLiveShapingDirty));
				}
				this._internalList = list3;
			}
			this.PrepareGroups();
		},
//		private void 
		OnLiveShapingDirty:function(/*object*/ sender, /*EventArgs*/ e)
		{
			this.IsLiveShapingDirty = true;
		},
//		private void 
		RebuildLocalArray:function()
		{
			if (this.IsRefreshDeferred)
			{
				this.RefreshOrDefer();
				return;
			}
			this.PrepareLocalArray();
		},
//		private void 
		MoveCurrencyOffDeletedElement:function(/*int*/ oldCurrentPosition)
		{
			var num = this.InternalCount - 1;
			var num2 = (oldCurrentPosition < num) ? oldCurrentPosition : num;
			this._currentElementWasRemoved = false;
			this.OnCurrentChanging();
			if (num2 < 0)
			{
				this.SetCurrent(null, num2);
			}
			else
			{
				this.SetCurrent(this.InternalItemAt(num2), num2);
			}
			this.OnCurrentChanged();
		},
//		private int 
		AdjustBefore:function(/*NotifyCollectionChangedAction*/ action, /*object*/ item, /*int*/ index)
		{
			if (action == NotifyCollectionChangedAction.Reset)
			{
				return -1;
			}
			if (item == CollectionView.NewItemPlaceholder)
			{
				if (this.NewItemPlaceholderPosition != NewItemPlaceholderPosition.AtBeginning)
				{
					return this.InternalCount - 1;
				}
				return 0;
			}
			else
			{
				if (this.IsAddingNew && this.NewItemPlaceholderPosition != NewItemPlaceholderPosition.None && object.Equals(item, this._newItem))
				{
					if (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning)
					{
						return 1;
					}
					if (!this.UsesLocalArray)
					{
						return index;
					}
					return this.InternalCount - 2;
				}
				else
				{
					var num = this.IsGrouping ? 0 : ((this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) ? (this.IsAddingNew ? 2 : 1) : 0);
					/*IList*/var list = (this.AllowsCrossThreadChanges ? this.ShadowCollection : this.SourceCollection);
					list = list instanceof IList ? list : null;
					if (index < -1 || index > list.Count)
					{
						throw new InvalidOperationException(SR.Get("CollectionChangeIndexOutOfRange", [index,
				                                                             							list.Count]));
					}
					if (action == NotifyCollectionChangedAction.Add)
					{
						if (index >= 0)
						{
							if (!object.Equals(item, list.Get(index)))
							{
								throw new InvalidOperationException(SR.Get("AddedItemNotAtIndex", [index]));
							}
						}
						else
						{
							index = list.IndexOf(item);
							if (index < 0)
							{
								throw new InvalidOperationException(SR.Get("AddedItemNotInCollection"));
							}
						}
					}
					if (!this.UsesLocalArray)
					{
						if (this.IsAddingNew && this.NewItemPlaceholderPosition != NewItemPlaceholderPosition.None && index > this._newItemIndex)
						{
							index--;
						}
						if (index >= 0)
						{
							return index + num;
						}
						return index;
					}
					else
					{
						if (action == NotifyCollectionChangedAction.Add)
						{
							if (!this.PassesFilter(item))
							{
								return -2;
							}
							if (!this.UsesLocalArray)
							{
								index = -1;
							}
							else
							{
								if (this.ActiveComparer != null)
								{
									index = this.InternalList.Search(item, this.ActiveComparer);
									if (index < 0)
									{
										index = ~index;
									}
								}
								else
								{
									index = this.MatchingSearch(item, index, list, this.InternalList);
								}
							}
						}
						else
						{
							if (action == NotifyCollectionChangedAction.Remove)
							{
								if (!this.IsAddingNew || item != this._newItem)
								{
									index = this.InternalList.IndexOf(item);
									if (index < 0)
									{
										return -2;
									}
								}
								else
								{
									switch (this.NewItemPlaceholderPosition)
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
						}
						if (index >= 0)
						{
							return index + num;
						}
						return index;
					}
				}
			}
		},
//		private int 
		MatchingSearch:function(/*object*/ item, /*int*/ index, /*IList*/ ilFull, /*IList*/ ilPartial)
		{
			var num = 0;
			var num2 = 0;
			while (num < index && num2 < this.InternalList.Count)
			{
				if (Object.Equals(ilFull.Get(num), ilPartial.Get(num2)))
				{
					num++;
					num2++;
				}
				else
				{
					if (Object.Equals(item, ilPartial.Get(num2)))
					{
						num2++;
					}
					else
					{
						num++;
					}
				}
			}
			return num2;
		},
//		private void 
		AdjustCurrencyForAdd:function(/*int*/ index)
		{
			if (this.InternalCount == 1)
			{
				this.SetCurrent(null, -1);
				return;
			}
			if (index <= this.CurrentPosition)
			{
				var num = this.CurrentPosition + 1;
				if (num < this.InternalCount)
				{
					this.SetCurrent(this.GetItemAt(num), num);
					return;
				}
				this.SetCurrent(null, this.InternalCount);
			}
		},
//		private void 
		AdjustCurrencyForRemove:function(/*int*/ index)
		{
			if (index < this.CurrentPosition)
			{
				this.SetCurrent(this.CurrentItem, this.CurrentPosition - 1);
				return;
			}
			if (index == this.CurrentPosition)
			{
				this._currentElementWasRemoved = true;
			}
		},
//		private void 
		AdjustCurrencyForMove:function(/*int*/ oldIndex, /*int*/ newIndex)
		{
			if (oldIndex == this.CurrentPosition)
			{
				this.SetCurrent(this.GetItemAt(newIndex), newIndex);
				return;
			}
			if (oldIndex < this.CurrentPosition && this.CurrentPosition <= newIndex)
			{
				this.SetCurrent(this.CurrentItem, this.CurrentPosition - 1);
				return;
			}
			if (newIndex <= this.CurrentPosition && this.CurrentPosition < oldIndex)
			{
				this.SetCurrent(this.CurrentItem, this.CurrentPosition + 1);
			}
		},
//		private void 
		AdjustCurrencyForReplace:function(/*int*/ index)
		{
			if (index == this.CurrentPosition)
			{
				this._currentElementWasRemoved = true;
			}
		},
//		private void 
		PrepareShaping:function()
		{
			if (this._customSort != null)
			{
				this.ActiveComparer = this._customSort;
			}
			else
			{
				if (this._sort != null && this._sort.Count > 0)
				{
					/*IComparer*/var comparer = SystemXmlHelper.PrepareXmlComparer(this.SourceCollection, this._sort, this.Culture);
					if (comparer != null)
					{
						this.ActiveComparer = comparer;
					}
					else
					{
						this.ActiveComparer = new SortFieldComparer(this._sort, this.Culture);
					}
				}
				else
				{
					this.ActiveComparer = null;
				}
			}
			this.ActiveFilter = this.Filter;
			this._group.Clear();
			this._group.Initialize();
			this._isGrouping = (this._group.GroupBy != null);
		},
//		private void 
		SetSortDescriptions:function(/*SortDescriptionCollection*/ descriptions)
		{
			if (this._sort != null)
			{
				this._sort.CollectionChanged.Remove(new NotifyCollectionChangedEventHandler(this, this.SortDescriptionsChanged));
			}
			this._sort = descriptions;
			if (this._sort != null)
			{
//				Invariant.Assert(this._sort.Count == 0, "must be empty SortDescription collection");
				this._sort.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.SortDescriptionsChanged));
			}
		},
//		private void 
		SortDescriptionsChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
		{
			if (this.IsAddingNew || this.IsEditingItem)
			{
				throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringAddOrEdit", ["Sorting"]));
			}
			if (this._sort.Count > 0)
			{
				this._customSort = null;
			}
			this.RefreshOrDefer();
		},
//		private void 
		PrepareGroups:function()
		{
			if (!this._isGrouping)
			{
				return;
			}
			/*IComparer*/var activeComparer = this.ActiveComparer;
			if (activeComparer != null)
			{
				this._group.ActiveComparer = activeComparer;
			}
			else
			{
				/*CollectionViewGroupInternal.IListComparer*/var listComparer = this._group.ActiveComparer;
				listComparer = listComparer instanceof CollectionViewGroupInternal.IListComparer ? listComparer : null;
				if (listComparer != null)
				{
					listComparer.ResetList(this.InternalList);
				}
				else
				{
					this._group.ActiveComparer = new CollectionViewGroupInternal.IListComparer(this.InternalList);
				}
			}
			if (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning)
			{
				this._group.InsertSpecialItem(0, CollectionView.NewItemPlaceholder, true);
				if (this.IsAddingNew)
				{
					this._group.InsertSpecialItem(1, this._newItem, true);
				}
			}
//			var isLiveGrouping = this.IsLiveGrouping;
//			if (isLiveGrouping.GetValueOrDefault())
//			{
//				var arg_A7_0 = isLiveGrouping.HasValue;
//			}
			/*LiveShapingList*/var liveShapingList = this.InternalList instanceof LiveShapingList ? this.InternalList : null;
			var i = 0;
			var count = this.InternalList.Count;
			while (i < count)
			{
				var obj = this.InternalList.Get(i);
				/*LiveShapingItem*/var lsi = (liveShapingList != null) ? liveShapingList.ItemAt(i) : null;
				if (!this.IsAddingNew || !object.Equals(this._newItem, obj))
				{
					this._group.AddToSubgroups(obj, lsi, true);
				}
				i++;
			}
			if (this.IsAddingNew && this.NewItemPlaceholderPosition != NewItemPlaceholderPosition.AtBeginning)
			{
				this._group.InsertSpecialItem(this._group.Items.Count, this._newItem, true);
			}
			if (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtEnd)
			{
				this._group.InsertSpecialItem(this._group.Items.Count, CollectionView.NewItemPlaceholder, true);
			}
		},
//		private void 
		OnGroupChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
		{
			if (e.Action == NotifyCollectionChangedAction.Add)
			{
				this.AdjustCurrencyForAdd(e.NewStartingIndex);
			}
			else
			{
				if (e.Action == NotifyCollectionChangedAction.Remove)
				{
					this.AdjustCurrencyForRemove(e.OldStartingIndex);
				}
			}
			this.OnCollectionChanged(e);
		},
//		private void 
		OnGroupByChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
		{
			if (this.IsAddingNew || this.IsEditingItem)
			{
				throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringAddOrEdit", ["Grouping"]));
			}
			this.RefreshOrDefer();
		},
//		private void 
		OnGroupDescriptionChanged:function(/*object*/ sender, /*EventArgs*/ e)
		{
			if (this.IsAddingNew || this.IsEditingItem)
			{
				throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringAddOrEdit", ["Grouping"]));
			}
			this.RefreshOrDefer();
		},
		
        // An item was inserted into the collection.  Update the groups. 
//      void 
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
		
//		private void 
		RemoveItemFromGroups:function(/*object*/ item)
		{
			if (this.CanGroupNamesChange || this._group.RemoveFromSubgroups(item))
			{
				this._group.RemoveItemFromSubgroupsByExhaustiveSearch(item);
			}
		},
//		private void 
		MoveItemWithinGroups:function(/*object*/ item, /*LiveShapingItem*/ lsi, /*int*/ oldIndex, /*int*/ newIndex)
		{
			this._group.MoveWithinSubgroups(item, lsi, this.InternalList, oldIndex, newIndex);
		},
//		private LiveShapingFlags 
		GetLiveShapingFlags:function()
		{
			/*LiveShapingFlags*/var liveShapingFlags = LiveShapingFlags.Sorting;
			if (this.IsLiveSorting == true)
			{
				liveShapingFlags |= LiveShapingFlags.Sorting;
			}
			if (this.IsLiveFiltering == true)
			{
				liveShapingFlags |= LiveShapingFlags.Filtering;
			}
			if (this.IsLiveGrouping == true)
			{
				liveShapingFlags |= LiveShapingFlags.Grouping;
			}
			return liveShapingFlags;
		},
//		private object 
		ItemFrom:function(/*object*/ o)
		{
			/*LiveShapingItem*/var liveShapingItem = o instanceof LiveShapingItem ? o : null;
			if (liveShapingItem != null)
			{
				return liveShapingItem.Item;
			}
			return o;
		},
//		private void 
		OnPropertyChanged:function(/*string*/ propertyName)
		{
			CollectionView.prototype.OnPropertyChanged.call(this, new PropertyChangedEventArgs(propertyName));
		},
//		private void 
		DeferAction:function(/*Action*/ action)
		{
			if (this._deferredActions == null)
			{
				this._deferredActions = new List/*<Action>*/();
			}
			this._deferredActions.Add(action);
		},
//		private void 
		DoDeferredActions:function()
		{
			if (this._deferredActions != null)
			{
				/*List<Action>*/var deferredActions = this._deferredActions;
				this._deferredActions = null;
				for(var i=0; i<deferredActions.Count; i++) //foreach (Action current in deferredActions)
				{
					var current = deferredActions.Get(i);
					current();
				}
			}
		}
	});
	
	Object.defineProperties(ListCollectionView.prototype,{
//		public override bool 
		CanGroup:
		{
			get:function()
			{
				return true;
			}
		},
//		public override ObservableCollection<GroupDescription> 
		GroupDescriptions:
		{
			get:function()
			{
				return this._group.GroupDescriptions;
			}
		},
//		public override ReadOnlyObservableCollection<object> 
		Groups:
		{
			get:function()
			{
				if (!this.IsGrouping)
				{
					return null;
				}
				return this._group.Items;
			}
		},
//		public override SortDescriptionCollection 
		SortDescriptions:
		{
			get:function()
			{
				if (this._sort == null)
				{
					this.SetSortDescriptions(new SortDescriptionCollection());
				}
				return this._sort;
			}
		},
//		public override bool 
		CanSort:
		{
			get:function()
			{
				return true;
			}
		},
//		public override bool 
		CanFilter:
		{
			get:function()
			{
				return true;
			}
		},
//		public override Predicate<object> 
		Filter:
		{
			get:function()
			{
//				return base.Filter;
				return this._filter;
			},
			set:function(value)
			{
//				if (this.AllowsCrossThreadChanges)
//				{
//					this.VerifyAccess();
//				}
				if (this.IsAddingNew || this.IsEditingItem)
				{
					throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringAddOrEdit", ["Filter"]));
				}
//				base.Filter = value;
				this._filter = value;
			}
		},
//		public IComparer 
		CustomSort:
		{
			get:function()
			{
				return this._customSort;
			},
			set:function(value)
			{
//				if (this.AllowsCrossThreadChanges)
//				{
//					this.VerifyAccess();
//				}
				if (this.IsAddingNew || this.IsEditingItem)
				{
					throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringAddOrEdit", ["CustomSort"]));
				}
				this._customSort = value;
				this.SetSortDescriptions(null);
				this.RefreshOrDefer();
			}
		},
//		public virtual GroupDescriptionSelectorCallback 
		GroupBySelector:
		{
			get:function()
			{
				return this._group.GroupBySelector;
			},
			set:function(value)
			{
				if (!this.CanGroup)
				{
					throw new NotSupportedException();
				}
				if (this.IsAddingNew || this.IsEditingItem)
				{
					throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringAddOrEdit", ["Grouping"]));
				}
				this._group.GroupBySelector = value;
				this.RefreshOrDefer();
			}
		},
//		public override int
		Count:
		{
			get:function()
			{
				this.VerifyRefreshNotDeferred();
				return this.InternalCount;
			}
		},
//		public override bool 
		IsEmpty:
		{
			get:function()
			{
				return this.InternalCount == 0;
			}
		},
//		public bool 
		IsDataInGroupOrder:
		{
			get:function()
			{
				return this._group.IsDataInGroupOrder;
			},
			set:function(value)
			{
				this._group.IsDataInGroupOrder = value;
			}
		},
//		public NewItemPlaceholderPosition 
		NewItemPlaceholderPosition:
		{
			get:function()
			{
				return this._newItemPlaceholderPosition;
			},
			set:function(value)
			{
				this.VerifyRefreshNotDeferred();
				if (value != this._newItemPlaceholderPosition && this.IsAddingNew)
				{
					throw new InvalidOperationException(SR.Get("MemberNotAllowedDuringTransaction", ["NewItemPlaceholderPosition",
					                                                         						"AddNew"]));
				}
				if (value != this._newItemPlaceholderPosition && this._isRemoving)
				{
					this.DeferAction(/*delegate*/function()
					{
						this.NewItemPlaceholderPosition = value;
					});
					return;
				}
				/*NotifyCollectionChangedEventArgs*/var notifyCollectionChangedEventArgs = null;
				var num = -1;
				var num2 = -1;
				switch (value)
				{
				case NewItemPlaceholderPosition.None:
					switch (this._newItemPlaceholderPosition)
					{
					case NewItemPlaceholderPosition.AtBeginning:
						num = 0;
						notifyCollectionChangedEventArgs = /*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Remove, CollectionView.NewItemPlaceholder, num)*/
							NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, CollectionView.NewItemPlaceholder, num);
						break;
					case NewItemPlaceholderPosition.AtEnd:
						num = this.InternalCount - 1;
						notifyCollectionChangedEventArgs = /*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Remove, CollectionView.NewItemPlaceholder, num)*/
							NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, CollectionView.NewItemPlaceholder, num);
						break;
					}
					break;
				case NewItemPlaceholderPosition.AtBeginning:
					switch (this._newItemPlaceholderPosition)
					{
					case NewItemPlaceholderPosition.None:
						num2 = 0;
						notifyCollectionChangedEventArgs = /*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Add, CollectionView.NewItemPlaceholder, num2)*/
							NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add, CollectionView.NewItemPlaceholder, num2);
						break;
					case NewItemPlaceholderPosition.AtEnd:
						num = this.InternalCount - 1;
						num2 = 0;
						notifyCollectionChangedEventArgs = /*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Move, CollectionView.NewItemPlaceholder, num2, num)*/
							NotifyCollectionChangedEventArgs.BuildWithAOII(NotifyCollectionChangedAction.Move, CollectionView.NewItemPlaceholder, num2, num);
						break;
					}
					break;
				case NewItemPlaceholderPosition.AtEnd:
					switch (this._newItemPlaceholderPosition)
					{
					case NewItemPlaceholderPosition.None:
						num2 = this.InternalCount;
						notifyCollectionChangedEventArgs = /*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Add, CollectionView.NewItemPlaceholder, num2)*/
							NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add, CollectionView.NewItemPlaceholder, num2);
						break;
					case NewItemPlaceholderPosition.AtBeginning:
						num = 0;
						num2 = this.InternalCount - 1;
						notifyCollectionChangedEventArgs = /*new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Move, CollectionView.NewItemPlaceholder, num2, num)*/
							NotifyCollectionChangedEventArgs.BuildWithAOII(NotifyCollectionChangedAction.Move, CollectionView.NewItemPlaceholder, num2, num);
						break;
					}
					break;
				}
				if (notifyCollectionChangedEventArgs != null)
				{
					this._newItemPlaceholderPosition = value;
					if (!this.IsGrouping)
					{
						this.ProcessCollectionChangedWithAdjustedIndex(notifyCollectionChangedEventArgs, num, num2);
					}
					else
					{
						if (num >= 0)
						{
							var index = (num == 0) ? 0 : (this._group.Items.Count - 1);
							this._group.RemoveSpecialItem(index, CollectionView.NewItemPlaceholder, false);
						}
						if (num2 >= 0)
						{
							var index2 = (num2 == 0) ? 0 : this._group.Items.Count;
							this._group.InsertSpecialItem(index2, CollectionView.NewItemPlaceholder, false);
						}
					}
					this.OnPropertyChanged("NewItemPlaceholderPosition");
				}
			}
		},
//		public bool 
		CanAddNew:
		{
			get:function()
			{
				return !this.IsEditingItem && !this.SourceList.IsFixedSize && this.CanConstructItem;
			}
		},
//		public bool 
		CanAddNewItem:
		{
			get:function()
			{
				return !this.IsEditingItem && !this.SourceList.IsFixedSize;
			}
		},
//		private bool 
		CanConstructItem:
		{
			get:function()
			{
				if (!this._isItemConstructorValid)
				{
					this.EnsureItemConstructor();
				}
				return this._itemConstructor != null;
			}
		},
//		public bool 
		IsAddingNew:
		{
			get:function()
			{
				return this._newItem != CollectionView.NoNewItem;
			}
		},
//		public object 
		CurrentAddItem:
		{
			get:function()
			{
				if (!this.IsAddingNew)
				{
					return null;
				}
				return this._newItem;
			}
		},
//		public bool 
		CanRemove:
		{
			get:function()
			{
				return !this.IsEditingItem && !this.IsAddingNew && !this.SourceList.IsFixedSize;
			}
		},
//		public bool 
		CanCancelEdit:
		{
			get:function()
			{
				return this._editItem instanceof IEditableObject;
			}
		},
//		public bool 
		IsEditingItem:
		{
			get:function()
			{
				return this._editItem != null;
			}
		},
//		public object 
		CurrentEditItem:
		{
			get:function()
			{
				return this._editItem;
			}
		},
//		public bool 
		CanChangeLiveSorting:
		{
			get:function()
			{
				return true;
			}
		},
//		public bool 
		CanChangeLiveFiltering:
		{
			get:function()
			{
				return true;
			}
		},
//		public bool 
		CanChangeLiveGrouping:
		{
			get:function()
			{
				return true;
			}
		},
//		public bool? 
		IsLiveSorting:
		{
			get:function()
			{
				return this._isLiveSorting;
			},
			set:function(value)
			{
//				if (!value.HasValue)
//				{
//					throw new ArgumentNullException("value");
//				}
				if (value != this._isLiveSorting)
				{
					this._isLiveSorting = value;
					this.RebuildLocalArray();
					this.OnPropertyChanged("IsLiveSorting");
				}
			}
		},
//		public bool? 
		IsLiveFiltering:
		{
			get:function()
			{
				return this._isLiveFiltering;
			},
			set:function(value)
			{
//				if (!value.HasValue)
//				{
//					throw new ArgumentNullException("value");
//				}
				if (value != this._isLiveFiltering)
				{
					this._isLiveFiltering = value;
					this.RebuildLocalArray();
					this.OnPropertyChanged("IsLiveFiltering");
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
//				if (!value.HasValue)
//				{
//					throw new ArgumentNullException("value");
//				}
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
					this._liveSortingProperties.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnLivePropertyListChanged));
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
					this._liveFilteringProperties.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnLivePropertyListChanged));
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
					this._liveGroupingProperties.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnLivePropertyListChanged));
				}
				return this._liveGroupingProperties;
			}
		},
//		public ReadOnlyCollection<ItemPropertyInfo> 
		ItemProperties:
		{
			get:function()
			{
				return this.GetItemProperties();
			}
		},
//		protected bool 
		UsesLocalArray:
		{
			get:function()
			{
				return this.ActiveComparer != null || this.ActiveFilter != null || (this.IsGrouping && this.IsLiveGrouping == true);
			}
		},
//		protected IList 
		InternalList:
		{
			get:function()
			{
				return this._internalList;
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
//		protected Predicate<object> 
		ActiveFilter:
		{
			get:function()
			{
				return this._activeFilter;
			},
			set:function(value)
			{
				this._activeFilter = value;
			}
		},
//		protected bool 
		IsGrouping:
		{
			get:function()
			{
				return this._isGrouping;
			}
		},
//		protected int 
		InternalCount:
		{
			get:function()
			{
				if (this.IsGrouping)
				{
					return this._group.ItemCount;
				}
				var num = (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.None) ? 0 : 1;
				if (this.UsesLocalArray && this.IsAddingNew)
				{
					num++;
				}
				return num + this.InternalList.Count;
			}
		},
//		internal ArrayList 
		ShadowCollection:
		{
			get:function()
			{
				return this._shadowCollection;
			},
			set:function(value)
			{
				this._shadowCollection = value;
			}
		},
//		internal bool 
		HasSortDescriptions:
		{
			get:function()
			{
				return this._sort != null && this._sort.Count > 0;
			}
		},
//		private bool 
		IsCurrentInView:
		{
			get:function()
			{
				return 0 <= this.CurrentPosition && this.CurrentPosition < this.InternalCount;
			}
		},
//		private bool 
		CanGroupNamesChange:
		{
			get:function()
			{
				return true;
			}
		},
//		private IList 
		SourceList:
		{
			get:function()
			{
				return this.SourceCollection instanceof IList ? this.SourceCollection : null;
			}
		},
//		internal bool 
		IsLiveShapingDirty:
		{
			get:function()
			{
				return this._isLiveShapingDirty;
			},
			set:function(value)
			{
				if (value == this._isLiveShapingDirty)
				{
					return;
				}
				this._isLiveShapingDirty = value;
				if (value)
				{
					this.Dispatcher.BeginInvoke(DispatcherPriority.DataBind, new Action(this.RestoreLiveShaping));
				}
			}
		}  
	});
	
	Object.defineProperties(ListCollectionView,{
		  
	});
	
	ListCollectionView.Type = new Type("ListCollectionView", ListCollectionView, [CollectionView.Type, IComparer.Type, 
	                                                                              IEditableCollectionViewAddNewItem.Type, 
	                                                                              IEditableCollectionView.Type, 
	                                                                              ICollectionViewLiveShaping.Type, IItemProperties.Type]);
	return ListCollectionView;
});

