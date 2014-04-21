/**
 * ValidationRuleCollection
 */

define(["dojo/_base/declare", "system/Type", "objectmodel/Collection"], 
		function(declare, Type, Collection){
	var ValidationRuleCollection = declare("ValidationRuleCollection", Collection,{
		constructor:function(){
		},
		
	    /// <summary>
	    /// called by base class Collection&lt;T&gt; when an item is added to list; 
	    /// raises a CollectionChanged event to any listeners
	    /// </summary>
//	    protected override void 
		InsertItem:function(/*int*/ index, /*ValidationRule*/ item)
	    { 
	        if (item == null)
	            throw new ArgumentNullException("item"); 
	        Collection.prototype.InsertItem.call(this, index, item); 
	    },
	 
	    /// <summary>
	    /// called by base class Collection&lt;T&gt; when an item is added to list;
	    /// raises a CollectionChanged event to any listeners
	    /// </summary> 
//	    protected override void 
		SetItem:function(/*int*/ index, /*ValidationRule*/ item)
	    { 
	        if (item == null) 
	            throw new ArgumentNullException("item");
	        Collection.prototype.SetItem.call(this, index, item); 
	    }
	});
	
	ValidationRuleCollection.Type = new Type("ValidationRuleCollection", ValidationRuleCollection, [Collection.Type]);
	return ValidationRuleCollection;
});

 

