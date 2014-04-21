/**
 * ObservableCollection
 */
/// <summary>
/// Implementation of a dynamic data collection based on generic Collection&lt;T&gt;, 
/// implementing INotifyCollectionChanged to notify listeners
/// when items get added, removed or the whole list is refreshed.
/// </summary>
define(["dojo/_base/declare", "system/Type", "objectmodel/Collection",
        "specialized/INotifyCollectionChanged", "componentmodel/INotifyPropertyChanged",
        "specialized/NotifyCollectionChangedAction", "specialized/NotifyCollectionChangedEventArgs",
        "generic/List", "componentmodel/PropertyChangedEventArgs", "specialized/NotifyCollectionChangedEventHandler",
        "componentmodel/PropertyChangedEventHandler"], 
        function(declare, Type, Collection,
        		INotifyCollectionChanged, INotifyPropertyChanged,
        		NotifyCollectionChangedAction, NotifyCollectionChangedEventArgs,
        		List, PropertyChangedEventArgs, NotifyCollectionChangedEventHandler,
        		PropertyChangedEventHandler){
	
//    private const string 
	var CountString = "Count"; 

    // This must agree with Binding.IndexerName.  It is declared separately 
    // here so as to avoid a dependency on PresentationFramework.dll. 
//    private const string 
	var IndexerName = "Item[]";
    
	var ObservableCollection = declare("ObservableCollection", Collection/*[Collection, INotifyCollectionChanged, INotifyPropertyChanged]*/,{
   	 	"-chains-": {
  	      constructor: "manual"
  	    },
  	    
		constructor:function( list){
			
			if(list === undefined){
				list=null;
			}
			
			Collection.prototype.constructor.call(this, list);
			
			if(list!=null){
				 this.CopyFrom(list);
			}
		},
		
        CopyFrom:function(/*IEnumerable<T>*/ collection) 
        { 
            var items = this.Items;
            if (collection != null && items != null) 
            {
                var enumerator = collection.GetEnumerator();
                while (enumerator.MoveNext()) 
                {
                    items.Add(enumerator.Current); 
                } 
            } 
        },
 
        /// <summary>
        /// Move item at oldIndex to newIndex. 
        /// </summary> 
//        public void 
        Move:function(/*int*/ oldIndex, /*int*/ newIndex)
        { 
            this.MoveItem(oldIndex, newIndex);
        },

        /// <summary>
        /// Called by base class Collection&lt;T&gt; when the list is being cleared;
        /// raises a CollectionChanged event to any listeners. 
        /// </summary>
        ClearItems:function() 
        { 
//            this.CheckReentrancy();
            Collection.prototype.ClearItems.call(this); 
            this.OnPropertyChanged(CountString);
            this.OnPropertyChanged(IndexerName);
            this.OnCollectionReset();
        }, 
        /// <summary> 
        /// Called by base class Collection&lt;T&gt; when an item is removed from list; 
        /// raises a CollectionChanged event to any listeners.
        /// </summary> 
        RemoveItem:function(/*int*/ index)
        {
//            this.CheckReentrancy();
            var removedItem  = this.Get(index); 

//            base.RemoveItem(index); 
            Collection.prototype.RemoveItem.call(this, index);
 
            this.OnPropertyChanged(CountString);
            this.OnPropertyChanged(IndexerName); 
            this.OnCollectionChanged(NotifyCollectionChangedAction.Remove, removedItem, index);
//            this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, removedItem, index));
        },
        /// <summary> 
        /// Called by base class Collection&lt;T&gt; when an item is added to list;
        /// raises a CollectionChanged event to any listeners. 
        /// </summary> 
        InsertItem:function(/*int*/ index, /*T*/ item)
        { 
//            this.CheckReentrancy();
//            base.InsertItem(index, item);
            Collection.prototype.InsertItem.call(this, index, item);

            this.OnPropertyChanged(CountString); 
            this.OnPropertyChanged(IndexerName);
            this.OnCollectionChanged(NotifyCollectionChangedAction.Add, item, index); 
//            this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add, item, index));
        }, 
        /// <summary> 
        /// Called by base class Collection&lt;T&gt; when an item is set in list;
        /// raises a CollectionChanged event to any listeners.
        /// </summary>
//        protected override void 
        SetItem:function(/*int*/ index, /*T*/ item) 
        {
//            this.CheckReentrancy(); 
            var originalItem = this.Get(index); 
//            base.SetItem(index, item);
            Collection.prototype.SetItem.call(this, index, item);
 
            this.OnPropertyChanged(IndexerName);
            this.OnCollectionChanged(NotifyCollectionChangedAction.Replace, originalItem, item, index);
//            this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOOI(NotifyCollectionChangedAction.Replace, originalItem, item, index));
        },
        /// <summary>
        /// Called by base class ObservableCollection&lt;T&gt; when an item is to be moved within the list; 
        /// raises a CollectionChanged event to any listeners. 
        /// </summary>
//        protected virtual void 
        MoveItem:function(/*int*/ oldIndex, /*int*/ newIndex) 
        {
//            this.CheckReentrancy();

            var removedItem = this.Get(oldIndex); //[oldIndex]; 

//            base.RemoveItem(oldIndex); 
            Collection.prototype.RemoveItem.call(this, oldIndex);
            
//            base.InsertItem(newIndex, removedItem);
            Collection.prototype.InsertItem.call(this, newIndex, removedItem);

            this.OnPropertyChanged(IndexerName); 
            this.OnCollectionChanged(NotifyCollectionChangedAction.Move, removedItem, newIndex, oldIndex);
//            this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOII(NotifyCollectionChangedAction.Move, removedItem, newIndex, oldIndex));
        },

 
        /// <summary>
        /// Raises a PropertyChanged event (per <see cref="INotifyPropertyChanged" />). 
        /// </summary> 
        OnPropertyChanged:function(/*PropertyChangedEventArgs e or string propertyName*/ par)
        { 
        	var e = par;
        	if(typeof par =="string"){
        		e = new PropertyChangedEventArgs(par);
        	}
        	
            if (this.PropertyChanged != null)
            {
                this.PropertyChanged.Invoke(this, e);
            } 
        },
        /// <summary> 
        /// Raise CollectionChanged event to any listeners.
        /// Properties/methods modifying this ObservableCollection will raise 
        /// a collection changed event through this virtual method. 
        /// </summary>
        /// <remarks> 
        /// When overriding this method, either call its base implementation
        /// or call <see cref="BlockReentrancy"/> to guard against reentrant collection changes.
        /// </remarks>
        OnCollectionChanged:function(/*NotifyCollectionChangedEventArgs e*/) 
        {
        	var e = null;
        	if(arguments.length==1){
        		e=arguments[0];
        	}else if(arguments.length==3){
        		e=NotifyCollectionChangedEventArgs.BuildWithAOI(arguments[0], arguments[1], arguments[2]);
//        		new NotifyCollectionChangedEventArgs(arguments[0], arguments[1], arguments[2]);
        	}else if(arguments.length==4){
        		if(typeof(arguments[2]) =="number") {
        			e=NotifyCollectionChangedEventArgs.BuildWithAOII(arguments[0], arguments[1], arguments[2], arguments[3]);
        		}else{
        			e=NotifyCollectionChangedEventArgs.BuildWithAOOI(arguments[0], arguments[1], arguments[2], arguments[3]);
        		}
        	}
        	
            if (this.CollectionChanged != null) 
            { 
            	this.CollectionChanged.Invoke(this, e);
            }
        },

//        /// <summary> 
//        /// Raise CollectionChanged event to any listeners.
//        /// Properties/methods modifying this ObservableCollection will raise 
//        /// a collection changed event through this virtual method. 
//        /// </summary>
//        /// <remarks> 
//        /// When overriding this method, either call its base implementation
//        /// or call <see cref="BlockReentrancy"/> to guard against reentrant collection changes.
//        /// </remarks>
//        protected virtual void OnCollectionChanged(NotifyCollectionChangedEventArgs e) 
//        {
//            if (CollectionChanged != null) 
//            { 
//                using (BlockReentrancy())
//                { 
//                    CollectionChanged(this, e);
//                }
//            }
//        } 
//        /// <summary>
//        /// Helper to raise CollectionChanged event to any listeners 
//        /// </summary> 
//        private void OnCollectionChanged(NotifyCollectionChangedAction action, object item, int index)
//        { 
//            OnCollectionChanged(new NotifyCollectionChangedEventArgs(action, item, index));
//        }
//
//        /// <summary> 
//        /// Helper to raise CollectionChanged event to any listeners
//        /// </summary> 
//        private void OnCollectionChanged(NotifyCollectionChangedAction action, object item, int index, int oldIndex) 
//        {
//            OnCollectionChanged(new NotifyCollectionChangedEventArgs(action, item, index, oldIndex)); 
//        }
//
//        /// <summary>
//        /// Helper to raise CollectionChanged event to any listeners 
//        /// </summary>
//        private void OnCollectionChanged(NotifyCollectionChangedAction action, object oldItem, object newItem, int index) 
//        { 
//            OnCollectionChanged(new NotifyCollectionChangedEventArgs(action, newItem, oldItem, index));
//        }  

        /// <summary>
        /// Helper to raise CollectionChanged event with action == Reset to any listeners
        /// </summary> 
//        private void 
        OnCollectionReset:function()
        { 
            this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithA(NotifyCollectionChangedAction.Reset)); 
        }
        
	});
	
	Object.defineProperties(ObservableCollection.prototype,{

        /// <summary> 
        /// PropertyChanged event (per <see cref="INotifyPropertyChanged" />).
        /// </summary>
//        event PropertyChangedEventHandler INotifyPropertyChanged.
        PropertyChanged:
        { 
            get:function()
            { 
                if(this._propertyChanged===undefined){
                	this._propertyChanged = new PropertyChangedEventHandler();
                }
                
                return this._propertyChanged; 
            }
        },
        
        //------------------------------------------------------
        /// <summary> 
        /// Occurs when the collection changes, either by adding or removing an item.
        /// </summary>
        /// <remarks>
        /// see <seealso cref="INotifyCollectionChanged"/> 
        /// </remarks>
        CollectionChanged:
        {
        	get:function(){
        		if(this._collectionChanged===undefined){
        			this._collectionChanged  = new NotifyCollectionChangedEventHandler();
        		}
        		
        		return this._collectionChanged;
        	}
        } 

	});
	
	ObservableCollection.Type = new Type("ObservableCollection", ObservableCollection, 
			[Collection.Type, INotifyCollectionChanged.Type, INotifyPropertyChanged.Type]);
	return ObservableCollection;
});
