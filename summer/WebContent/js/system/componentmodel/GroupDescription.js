/**
 * Second heck 12-10
 * GroupDescription
 */

define(["dojo/_base/declare", "system/Type", "componentmodel/INotifyPropertyChanged"], function(declare, Type, INotifyPropertyChanged){
	var GroupDescription = declare("GroupDescription", INotifyPropertyChanged,{
		constructor:function(){
			this._explicitGroupNames = new ObservableCollection/*<object>*/();
			this._explicitGroupNames.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnGroupNamesChanged)); 
		},
		
        /// <summary> 
        /// A subclass can call this method to raise the PropertyChanged event.
        /// </summary> 
//        protected virtual void 
        OnPropertyChanged:function(/*PropertyChangedEventArgs*/ e) 
        {
            if (this.PropertyChanged != null) 
            {
            	this.PropertyChanged.Invoke(this, e);
            }
        }, 

        /// <summary>
        /// Return the group name(s) for the given item
        /// </summary>
//        public abstract object 
        GroupNameFromItem:function(/*object*/ item, /*int*/ level, /*CultureInfo*/ culture){},

        /// <summary> 
        /// Return true if the names match (i.e the item should belong to the group). 
        /// </summary>
//        public virtual bool 
        NamesMatch:function(/*object*/ groupName, /*object*/ itemName) 
        {
            return Object.Equals(groupName, itemName);
        },
 
//        void 
        OnGroupNamesChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        { 
            OnPropertyChanged(new PropertyChangedEventArgs("GroupNames"));
        } 
	});
	
	Object.defineProperties(GroupDescription.prototype,{
 
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
        /// This list of names is used to initialize a group with a set of
        /// subgroups with the given names.  (Additional subgroups may be 
        /// added later, if there are items that don't match any of the names.)
        /// </summary>
//        public ObservableCollection<object> 
        GroupNames:
        { 
            get:function() { return this._explicitGroupNames; }
        } 
	});
	
	GroupDescription.Type = new Type("GroupDescription", GroupDescription, [INotifyPropertyChanged.Type]);
	return GroupDescription;
});


 
