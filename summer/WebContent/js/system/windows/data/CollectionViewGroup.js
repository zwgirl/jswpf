/**
 * Second Check 12-10
 * CollectionViewGroup
 */

define(["dojo/_base/declare", "system/Type", "componentmodel/INotifyPropertyChanged", "objectmodel/ObservableCollection",
        "objectmodel/ReadOnlyObservableCollection"], 
		function(declare, Type, INotifyPropertyChanged, ObservableCollection,
				ReadOnlyObservableCollection){
	var CollectionViewGroup = declare("CollectionViewGroup", INotifyPropertyChanged,{
   	 	"-chains-": {
  	      constructor: "manual"
  	    },
  	    
		constructor:function(/*object*/ name) 
        {
            this._name = name; 
            this._itemsRW = new ObservableCollection/*<object>*/();
            this._itemsRO = new ReadOnlyObservableCollection/*<object>*/(this._itemsRW);
            
            this._itemCount = 0;
        },

        /// <summary> 
        /// Raises a PropertyChanged event (per <see cref="INotifyPropertyChanged" />).
        /// </summary> 
//        protected virtual void 
        OnPropertyChanged:function(/*PropertyChangedEventArgs*/ e) 
        {
            if (this.PropertyChanged != null) 
            {
                this.PropertyChanged.Invoke(this, e);
            }
        } 
	});
	
	Object.defineProperties(CollectionViewGroup.prototype,{
	      /// <summary> 
        /// The name of the group, i.e. the common value of the 
        /// property used to divide data items into groups.
        /// </summary> 
//        public object 
        Name:
        {
            get:function() { return this._name; }
        }, 

        /// <summary> 
        /// The immediate children of the group. 
        /// These may be data items (leaves) or subgroups.
        /// </summary> 
//        public ReadOnlyObservableCollection<object> 
        Items:
        {
            get:function() { return this._itemsRO; }
        }, 

        /// <summary> 
        /// The number of data items (leaves) in the subtree under this group. 
        /// </summary>
//        public int 
        ItemCount: 
        {
            get:function() { return this._itemCount; }
        },
 
        /// <summary>
        /// Is this group at the bottom level (not further subgrouped). 
        /// </summary> 
//        public abstract bool 
        IsBottomLevel:
        { 
            get:function(){}
        },
 
        /// <summary>
        /// PropertyChanged event (per <see cref="INotifyPropertyChanged" />). 
        /// </summary>
//        protected virtual event PropertyChangedEventHandler 
        PropertyChanged:
        {
        	get:function(){
            	if(this._PropertyChanged === undefined){
            		this._PropertyChanged = new Delegate();
            	}
            	
            	return this._PropertyChanged;
        	}
        },

        /// <summary> 
        /// The items of the group.
        /// Derived classes can add or remove items using this property; 
        /// the changes will be reflected in the public Items property.
        /// </summary>
//        protected ObservableCollection<object> 
        ProtectedItems:
        { 
            get:function() { return this._itemsRW; }
        }, 
 
        /// <summary>
        /// The number of data items (leaves) in the subtree under this group. 
        /// Derived classes can change the count using this property;
        /// the changes will be reflected in the public ItemCount property.
        /// </summary>
//        protected int 
        ProtectedItemCount: 
        {
            get:function() { return this._itemCount; }, 
            set:function(value) 
            {
            	this._itemCount = value; 
            	this.OnPropertyChanged(new PropertyChangedEventArgs("ItemCount"));
            }
        }
	});
	
	CollectionViewGroup.Type = new Type("CollectionViewGroup", CollectionViewGroup, [INotifyPropertyChanged.Type]);
	return CollectionViewGroup;
});