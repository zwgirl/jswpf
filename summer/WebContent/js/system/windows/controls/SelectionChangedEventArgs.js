/**
 * SelectionChangedEventArgs
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutedEventArgs"], 
		function(declare, Type, RoutedEventArgs){
	var SelectionChangedEventArgs = declare("SelectionChangedEventArgs", RoutedEventArgs,{
		constructor:function(
	            /*RoutedEvent*/ id,
	            /*IList*/ removedItems, 
	            /*IList*/ addedItems)

        { 
			if(arguments.length == 3){
	            if (id == null) 
	                throw new ArgumentNullException("id");
	            if (removedItems == null) 
	                throw new ArgumentNullException("removedItems");
	            if (addedItems == null)
	                throw new ArgumentNullException("addedItems");
	 
	            this.RoutedEvent = id;
	 
	            this._removedItems = []; //new object[removedItems.Count]; 
	            removedItems.CopyTo(this._removedItems, 0);
	 
	            this._addedItems = []; //new object[addedItems.Count];
	            addedItems.CopyTo(this._addedItems, 0);
			}else{
				/*List<ItemsControl.ItemInfo>*/var unselectedInfos = id, /*List<ItemsControl.ItemInfo>*/ selectedInfos = removedItems;
		        { 
		            this.RoutedEvent = Selector.SelectionChangedEvent; 

		            this._removedItems = []; //new object[unselectedInfos.Count]; 
		            for (var i=0; i<unselectedInfos.Count; ++i)
		            {
		                this._removedItems[i] = unselectedInfos.Get(i).Item;
		            } 

		            this._addedItems = []; // new object[selectedInfos.Count]; 
		            for (var i=0; i<selectedInfos.Count; ++i) 
		            {
		                this._addedItems[i] = selectedInfos.Get(i).Item; 
		            }

		            this._removedInfos = unselectedInfos;
		            this._addedInfos = selectedInfos; 
		        }
			}
        },
		
        /// <summary> 
        /// This method is used to perform the proper type casting in order to 
        /// call the type-safe SelectionChangedEventHandler delegate for the SelectionChangedEvent event.
        /// </summary> 
        /// <param name="genericHandler">The handler to invoke.</param>
        /// <param name="genericTarget">The current object along the event's route.</param>
//        protected override void 
		InvokeEventHandler:function(/*Delegate*/ genericHandler, /*object*/ genericTarget)
        { 
            /*SelectionChangedEventHandler*/var handler = genericHandler;
 
            handler.Invoke(genericTarget, this); 
        }
	});
	
	Object.defineProperties(SelectionChangedEventArgs.prototype,{
		  
	});
	
	Object.defineProperties(SelectionChangedEventArgs,{

        /// <summary>
        /// An IList containing the items that were unselected during this event
        /// </summary> 
//        public IList 
		RemovedItems:
        { 
            get:function() { return this._removedItems; } 
        },
 
        /// <summary>
        /// An IList containing the items that were selected during this event
        /// </summary>
//        public IList 
        AddedItems: 
        {
            get:function() { return this._addedItems; } 
        }, 

        /// <summary> 
        /// A list containing the ItemInfos that were unselected during this event
        /// </summary> 
//        internal List<ItemsControl.ItemInfo> 
        RemovedInfos:
        {
            get:function() { return this._removedInfos; } 
        },

        /// <summary>
        /// A list containing the ItemInfos that were selected during this event 
        /// </summary>
//        internal List<ItemsControl.ItemInfo> 
        AddedInfos: 
        { 
            get:function() { return this._addedInfos; }
        } 	  
	});
	
	SelectionChangedEventArgs.Type = new Type("SelectionChangedEventArgs", 
			SelectionChangedEventArgs, [RoutedEventArgs.Type]);
	return SelectionChangedEventArgs;
});

//
//    /// <summary> 
//    /// The delegate type for handling a selection changed event
//    /// </summary>
//    public delegate void SelectionChangedEventHandler(
//        object sender, 
//        SelectionChangedEventArgs e);
//        private object[] _addedItems;
//        private object[] _removedItems; 
//        private List<ItemsControl.ItemInfo> _addedInfos; 
//        private List<ItemsControl.ItemInfo> _removedInfos;
