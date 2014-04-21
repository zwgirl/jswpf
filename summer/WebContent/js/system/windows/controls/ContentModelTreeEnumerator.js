/**
 * ContentModelTreeEnumerator
 */

define(["dojo/_base/declare", "system/Type", "controls/ModelTreeEnumerator"], function(declare, Type, ModelTreeEnumerator){
	var ContentModelTreeEnumerator = declare("ContentModelTreeEnumerator", ModelTreeEnumerator,{
   	 	"-chains-": {
	      constructor: "manual"
	    },
		constructor:function(/*ContentControl*/ contentControl, /*object*/ content) 
        { 
			ModelTreeEnumerator.prototype.constructor.call(this, content);
//            Debug.Assert(contentControl != null, "contentControl should be non-null."); 

            this._owner = contentControl; 
        }
	});
	
	Object.defineProperties(ContentModelTreeEnumerator.prototype,{
//        protected override bool 
		IsUnchanged:
        { 
            get:function()
            { 
                return Object.ReferenceEquals(this.Content, this._owner.Content); 
            }
        }
	});
	
	ContentModelTreeEnumerator.Type = new Type("ContentModelTreeEnumerator", 
			ContentModelTreeEnumerator, [ModelTreeEnumerator.Type]);
	return ContentModelTreeEnumerator;
});
