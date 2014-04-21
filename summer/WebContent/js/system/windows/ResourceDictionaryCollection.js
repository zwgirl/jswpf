/**
 * ResourceDictionaryCollection
 */

define(["dojo/_base/declare", "system/Type", "objectmodel/ObservableCollection"], 
		function(declare, Type, ObservableCollection){
	var ResourceDictionaryCollection = declare("ResourceDictionaryCollection", ObservableCollection,{
		constructor:function(/*ResourceDictionary*/ owner)
        {
            this._owner = owner; 
        },
        
        /// <summary> 
        /// Called by base class Collection&lt;T&gt; when the list is being cleared;
        /// raises a CollectionChanged event to any listeners. 
        /// </summary> 
//        protected override void 
        ClearItems:function()
        { 
            for (var i=0; i<Count; i++)
            {
                this._owner.RemoveParentOwners(this.Get(i));
            } 

//            base.ClearItems(); 
            ObservableCollection.prototype.ClearItems.call(this);
        }, 

        /// <summary> 
        /// Called by base class Collection&lt;T&gt; when an item is added to list;
        /// raises a CollectionChanged event to any listeners.
        /// </summary>
//        protected override void 
        InsertItem:function(/*int*/ index, /*ResourceDictionary*/ item) 
        {
            if (item == null) 
            { 
                throw new ArgumentNullException("item");
            } 

//            base.InsertItem(index, item);
            ObservableCollection.prototype.InsertItem.call(this, index, item);
        },
 
        /// <summary>
        /// Called by base class Collection&lt;T&gt; when an item is set in list; 
        /// raises a CollectionChanged event to any listeners. 
        /// </summary>
//        protected override void 
        SetItem:function(/*int*/ index, /*ResourceDictionary*/ item) 
        {
            if (item == null)
            {
                throw new ArgumentNullException("item"); 
            }
 
//            base.SetItem(index, item); 
            ObservableCollection.prototype.SetItem.call(this, index, item); 
        },
	});
	
	ResourceDictionaryCollection.Type = new Type("ResourceDictionaryCollection", ResourceDictionaryCollection, 
			[ObservableCollection.Type]);
	return ResourceDictionaryCollection;
});
