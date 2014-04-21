/**
 * ReadOnlyObservableCollection
 */

define(["dojo/_base/declare", "system/Type", "objectmodel/ReadOnlyCollection", "specialized/INotifyCollectionChanged", 
        "specialized/NotifyCollectionChangedEventHandler", "componentmodel/PropertyChangedEventHandler", 
        "componentmodel/INotifyPropertyChanged"], 
		function(declare, Type, ReadOnlyCollection, INotifyCollectionChanged,
				NotifyCollectionChangedEventHandler, PropertyChangedEventHandler, 
				INotifyPropertyChanged){
	var ReadOnlyObservableCollection = declare("ReadOnlyObservableCollection", 
			[ReadOnlyCollection, INotifyCollectionChanged, INotifyPropertyChanged],{
		constructor:function(/*ObservableCollection<T>*/ list) 
	    { 
//			ReadOnlyCollection.prototype.constructor.call(this, list);
	        this.Items.CollectionChanged.Combine(
	        		new NotifyCollectionChangedEventHandler(this, this.HandleCollectionChanged)); 
	        this.Items.PropertyChanged.Combine(new PropertyChangedEventHandler(this, this.HandlePropertyChanged));
	    },
	    
	    /// <summary>
        /// raise CollectionChanged event to any listeners 
        /// </summary> 
//        protected virtual void 
	    OnCollectionChanged:function(/*NotifyCollectionChangedEventArgs*/ args)
        { 
            if (this.CollectionChanged != null)
            {
            	this.CollectionChanged.Invoke(this, args);
            } 
        },
        
        /// <summary>
        /// raise PropertyChanged event to any listeners
        /// </summary> 
//        protected virtual void 
        OnPropertyChanged:function(/*PropertyChangedEventArgs*/ args)
        { 
            if (this.PropertyChanged != null) 
            {
            	this.PropertyChanged.Invoke(this, args); 
            }
        },
 
        // forward CollectionChanged events from the base list to our listeners 
//        void 
        HandleCollectionChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        { 
            this.OnCollectionChanged(e);
        },

        // forward PropertyChanged events from the base list to our listeners 
//        void 
        HandlePropertyChanged:function(/*object*/ sender, /*PropertyChangedEventArgs*/ e)
        { 
            this.OnPropertyChanged(e); 
        },
	
	});
	
	Object.defineProperties(ReadOnlyObservableCollection.prototype,{
        /// <summary>
        /// Occurs when the collection changes, either by adding or removing an item. 
        /// </summary> 
        /// <remarks>
        /// see <seealso cref="INotifyCollectionChanged"/> 
        /// </remarks>
//        protected virtual event NotifyCollectionChangedEventHandler 
		CollectionChanged:{
			get:function(){
				if(this._CollectionChanged === undefined){
					this._CollectionChanged = new NotifyCollectionChangedEventHandler();
				}
				
				return this._CollectionChanged;
			}

		}, 
        
        /// <summary>
        /// Occurs when a property changes.
        /// </summary> 
        /// <remarks>
        /// see <seealso cref="INotifyPropertyChanged"/> 
        /// </remarks> 
//        protected virtual event PropertyChangedEventHandler 
		PropertyChanged:{
			get:function(){
				if(this._PropertyChanged === undefined){
					this._PropertyChanged = new PropertyChangedEventHandler();
				}
				
				return this._PropertyChanged;
			}
		} 
	});
	
	Object.defineProperties(ReadOnlyObservableCollection,{
		  
	});
	
	ReadOnlyObservableCollection.Type = new Type("ReadOnlyObservableCollection", ReadOnlyObservableCollection,
			[ReadOnlyCollection.Type, INotifyCollectionChanged.Type, INotifyPropertyChanged.Type]);
	return ReadOnlyObservableCollection;
});





 
