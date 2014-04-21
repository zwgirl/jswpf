/**
 * HeaderedContentModelTreeEnumerator
 */

define(["dojo/_base/declare", "system/Type", "controls/ModelTreeEnumerator"], function(declare, Type, ModelTreeEnumerator){
	var HeaderedContentModelTreeEnumerator = declare("HeaderedContentModelTreeEnumerator", ModelTreeEnumerator,{
   	 	"-chains-": {
	      constructor: "manual"
	    },
		constructor:function(/*HeaderedContentControl*/ headeredContentControl, /*object*/ content, /*object*/ header) 
        {
			ModelTreeEnumerator.prototype.constructor.call(this, header);
//            Debug.Assert(headeredContentControl != null, "headeredContentControl should be non-null."); 
//            Debug.Assert(header != null, "Header should be non-null. If Header was null, the base ContentControl enumerator should have been used.");

            this._owner = headeredContentControl;
            this._content = content; 
        },
        
//        protected override bool 
        MoveNext:function()
        {
            if (this._content != null) 
            {
                if (this.Index == 0) 
                { 
                    // Moving from the header to content
                	this.Index++; 
                	this.VerifyUnchanged();
                    return true;
                }
                else if (this.Index == 1) 
                {
                    // Going from content to the end 
                	this.Index++; 
                    return false;
                } 
            }

            return ModelTreeEnumerator.prototype.MoveNext.call(this);
        } 
	});
	
	Object.defineProperties(HeaderedContentModelTreeEnumerator.prototype,{
//        protected override object 
		Current: 
        {
            get:function() 
            {
                if ((this.Index == 1) && (this._content != null))
                {
                    return this._content; 
                }
 
                return ModelTreeEnumerator.prototype.Current; 
            }
        }, 
        
//        protected override bool 
        IsUnchanged:
        { 
            get:function()
            { 
                var header = this.Content;    // Header was passed to the base so that it would appear in index 0
                return Object.ReferenceEquals(header, this._owner.Header) &&
                       Object.ReferenceEquals(this._content, this._owner.Content);
            } 
        }
	});
	
	HeaderedContentModelTreeEnumerator.Type = new Type("HeaderedContentModelTreeEnumerator", 
			HeaderedContentModelTreeEnumerator, [ModelTreeEnumerator.Type]);
	return HeaderedContentModelTreeEnumerator;
});
