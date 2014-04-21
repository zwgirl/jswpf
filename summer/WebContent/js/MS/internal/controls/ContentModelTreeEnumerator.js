/**
 * ContentModelTreeEnumerator
 */

define(["dojo/_base/declare", "system/Type", "internal/ModelTreeEnumerator"], function(declare, Type, ModelTreeEnumerator ){
	var ContentModelTreeEnumerator = declare("ContentModelTreeEnumerator", ModelTreeEnumerator,{
		constructor:function(/*ContentControl*/ contentControl, /*object*/ content)
        { 
//            Debug.Assert(contentControl != null, "contentControl should be non-null."); 
			ModelTreeEnumerator.prototype.constructor.call
            this._owner = contentControl; 
        }
	});
	
	Object.defineProperties(ContentModelTreeEnumerator.prototype,{
//	       protected override bool 
       IsUnchanged:
        { 
            get:function()
            { 
                return Object.ReferenceEquals(Content, this._owner.Content); 
            }
        }
	});
	
	ContentModelTreeEnumerator.Type = new Type("ContentModelTreeEnumerator", ContentModelTreeEnumerator, [ModelTreeEnumerator.Type]);
	return ContentModelTreeEnumerator;
});

