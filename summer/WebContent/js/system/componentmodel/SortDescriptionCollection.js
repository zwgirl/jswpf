/**
 * Second Check 12-10
 * SortDescriptionCollection
 */

define(["dojo/_base/declare", "system/Type", "objectmodel/Collection", "specialized/INotifyCollectionChanged",
        "collections/IList", "specialized/NotifyCollectionChangedEventArgs"], 
		function(declare, Type, Collection, INotifyCollectionChanged, 
				IList, NotifyCollectionChangedEventArgs){
	var SortDescriptionCollection = declare("SortDescriptionCollection", [Collection, INotifyCollectionChanged],{
		constructor:function(){

		},
		
	      /// <summary> 
        /// called by base class Collection&lt;T&gt; when the list is being cleared;
        /// raises a CollectionChanged event to any listeners
        /// </summary>
//        protected override void 
        ClearItems:function() 
        {
        	Collection.prototype.ClearItems.call(this); 
            this.OnCollectionChanged(NotifyCollectionChangedAction.Reset); 
        },
 
        /// <summary>
        /// called by base class Collection&lt;T&gt; when an item is removed from list;
        /// raises a CollectionChanged event to any listeners
        /// </summary> 
//        protected override void 
        RemoveItem:function(/*int*/ index)
        { 
            /*SortDescription*/var removedItem = this.Get(index); //[index]; 
            Collection.prototype.RemoveItem.call(this, index);
            this.OnCollectionChanged(NotifyCollectionChangedAction.Remove, removedItem, index); 
        },

        /// <summary>
        /// called by base class Collection&lt;T&gt; when an item is added to list; 
        /// raises a CollectionChanged event to any listeners
        /// </summary> 
//        protected override void 
        InsertItem:function(/*int*/ index, /*SortDescription*/ item) 
        {
            item.Seal(); 
            Collection.prototype.InsertItem.call(this, index, item);
            this.OnCollectionChanged(NotifyCollectionChangedAction.Add, item, index);
        },
 
        /// <summary>
        /// called by base class Collection&lt;T&gt; when an item is set in the list; 
        /// raises a CollectionChanged event to any listeners 
        /// </summary>
//        protected override void 
        SetItem:function(/*int*/ index, /*SortDescription*/ item) 
        {
            item.Seal();
            /*SortDescription*/var originalItem = this.Get(index); //[index];
            Collection.prototype.SetItem.call(this, index, item); 
            OnCollectionChanged(NotifyCollectionChangedAction.Remove, originalItem, index);
            OnCollectionChanged(NotifyCollectionChangedAction.Add, item, index); 
        }, 

        /// <summary> 
        /// raise CollectionChanged event to any listeners
        /// </summary>
//        private void 
        OnCollectionChanged:function(/*NotifyCollectionChangedAction*/ action, /*object*/ item, /*int*/ index)
        { 
        	var args = null;
        	if(arguments.length == 1){
        		args = NotifyCollectionChangedEventArgs.BuildWithA(action);
        	}else if(arguments.length === 3){
        		args = NotifyCollectionChangedEventArgs.BuildWithAOI(action, item, index);
        	}
        	
            if (this.CollectionChanged != null)
            { 
                this.CollectionChanged.Invoke(this, args); 
            }
        },
//        // raise CollectionChanged event to any listeners
//        void OnCollectionChanged(NotifyCollectionChangedAction action)
//        {
//            if (this.CollectionChanged != null) 
//            {
//                this.CollectionChanged(this, new NotifyCollectionChangedEventArgs(action)); 
//            } 
//        }
	});
	
	Object.defineProperties(SortDescriptionCollection.prototype,{
//        protected event NotifyCollectionChangedEventHandler 
        CollectionChanged:
        {
        	get:function(){
        		if(this._CollectionChanged === undefined){
        			this._CollectionChanged = new Delegate();
        		}
        		
        		return this._CollectionChanged;
        	}
        }

	});
	
	SortDescriptionCollection.Type = new Type("SortDescriptionCollection",
			SortDescriptionCollection, [Collection.Type, INotifyCollectionChanged.Type]);

	
	var EmptySortDescriptionCollection = declare([SortDescriptionCollection, IList], {
		/// <summary> 
        /// called by base class Collection&lt;T&gt; when the list is being cleared;
        /// raises a CollectionChanged event to any listeners 
        /// </summary>
//        protected override void 
        ClearItems:function()
        {
            throw new NotSupportedException(); 
        },

        /// <summary> 
        /// called by base class Collection&lt;T&gt; when an item is removed from list;
        /// raises a CollectionChanged event to any listeners 
        /// </summary>
//        protected override void 
        RemoveItem:function(/*int*/ index)
        {
            throw new NotSupportedException(); 
        },

        /// <summary> 
        /// called by base class Collection&lt;T&gt; when an item is added to list;
        /// raises a CollectionChanged event to any listeners 
        /// </summary>
//        protected override void 
        InsertItem:function(/*int*/ index, /*SortDescription*/ item)
        {
            throw new NotSupportedException(); 
        },

        /// <summary> 
        /// called by base class Collection&lt;T&gt; when an item is set in list;
        /// raises a CollectionChanged event to any listeners 
        /// </summary>
//        protected override void 
        SetItem:function(/*int*/ index, /*SortDescription*/ item)
        {
            throw new NotSupportedException(); 
        }
	});
	
	Object.defineProperties(EmptySortDescriptionCollection.prototype,{
//      bool IList.
        IsFixedSize: 
        {
              get:function() { return true; } 
        },

//        bool IList.
        IsReadOnly: 
        {
              get:function() { return true; }
        }

	});
	
	EmptySortDescriptionCollection.Type =new Type("EmptySortDescriptionCollection", 
			EmptySortDescriptionCollection, [SortDescriptionCollection.Type, IList.Type]);
	
	/// <summary>
    /// returns an empty and non-modifiable SortDescriptionCollection 
    /// </summary>
//    public static readonly SortDescriptionCollection 
	SortDescriptionCollection.Empty = new EmptySortDescriptionCollection();

	return SortDescriptionCollection;
});

        
 
        
 
        

 