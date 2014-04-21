/**
 * HeaderedItemsModelTreeEnumerator
 */

define(["dojo/_base/declare", "system/Type", "internal.controls/ModelTreeEnumerator"], function(declare, Type, ModelTreeEnumerator){
	var HeaderedItemsModelTreeEnumerator = declare("HeaderedItemsModelTreeEnumerator", ModelTreeEnumerator,{
   	 	"-chains-": {
   	 		constructor: "manual"
	    },
		constructor:function(/*HeaderedItemsControl*/ headeredItemsControl, 
				/*IEnumerator*/ items, /*object*/ header) //: base(header) 
        {
			ModelTreeEnumerator.prototype.constructor.call(this, header);
//            Debug.Assert(headeredItemsControl != null, "headeredItemsControl should be non-null."); 
//            Debug.Assert(items != null, "items should be non-null."); 
//            Debug.Assert(header != null, "header should be non-null. If Header was null, the base ItemsControl enumerator should have been used.");
 
			this._owner = headeredItemsControl;
            this._items = items;
        },
        

//        protected override bool 
        MoveNext:function() 
        {
            if (this.Index >= 0)
            {
            	this.Index++; 
                return this._items.MoveNext();
            } 
 
            return ModelTreeEnumerator.prototype.MoveNext.call(this);
        },

//        protected override void 
        Reset:function()
        {
        	ModelTreeEnumerator.prototype.Reset.call(this); 
            this._items.Reset();
        }
	});
	
	Object.defineProperties(HeaderedItemsModelTreeEnumerator.prototype,{
//        protected override object 
        Current:
        { 
            get:function() 
            {
                if (this.Index > 0) 
                {
                    return this._items.Current;
                }
 
//                return ModelTreeEnumerator.prototype.Current;
                
                if (this._index == 0) 
                {
                    return this._content;
                }
            } 
        },
        
        
//        protected override bool 
        IsUnchanged:
        { 
            get:function()
            {
                /*object*/var header = this.Content;    // Header was passed to the base so that it would appear in index 0
                return Object.ReferenceEquals(header, this._owner.Header); 
            }
        } 
	});
	
	HeaderedItemsModelTreeEnumerator.Type = new Type("HeaderedItemsModelTreeEnumerator", HeaderedItemsModelTreeEnumerator, [ModelTreeEnumerator.Type]);
	return HeaderedItemsModelTreeEnumerator;
});
