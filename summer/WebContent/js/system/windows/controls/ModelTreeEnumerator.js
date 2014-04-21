/**
 * ModelTreeEnumerator
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerator"], function(declare, Type, IEnumerator){
	var ModelTreeEnumerator = declare("ModelTreeEnumerator", IEnumerator,{
		constructor:function(/*object*/ content) 
        {
            this._content = content; 
            this._index = -1; 
        }, 
        
//        protected virtual bool 
        MoveNext:function()
        { 
            if (this._index < 1) 
            {
                // Singular content, can move next to 0 and that's it. 
            	this._index++;

                if (this._index == 0)
                { 
                    // don't call VerifyUnchanged if we're returning false anyway.
                    // This permits users to change the Content after enumerating 
                    // the content (e.g. in the invalidation callback of an inherited 
                    // property).  See bug 955389.
 
                	this.VerifyUnchanged();
                    return true;
                }
            } 

            return false; 
        },

//        protected virtual void 
        Reset:function() 
        {
        	this.VerifyUnchanged();
        	this._index = -1;
        }, 

//        protected void 
        VerifyUnchanged:function()
        {
            // If the content has changed, then throw an exception 
            if (!this.IsUnchanged)
            { 
                throw new InvalidOperationException(SR.Get(SRID.EnumeratorVersionChanged)); 
            }
        } 
	});
	
	Object.defineProperties(ModelTreeEnumerator.prototype,{
//        protected object 
		Content: 
        { 
            get:function()
            { 
                return this._content;
            }
        },
 
//        protected int 
        Index:
        { 
            get:function() 
            {
                return this._index; 
            },

            set:function(value)
            { 
            	this._index = value;
            } 
        }, 

//        protected virtual object 
        Current:
        {
            get:function()
            {
                // Don't VerifyUnchanged(); According to MSDN: 
                //     If the collection is modified between MoveNext and Current,
                //     Current will return the element that it is set to, even if 
                //     the enumerator is already invalidated. 

                if (this._index == 0) 
                {
                    return this._content;
                }
 
                // Fall through -- can't enumerate (before beginning or after end) 
                throw new InvalidOperationException(SR.Get(SRID.EnumeratorInvalidOperation));
                // above exception is part of the IEnumerator.Current contract when moving beyond begin/end 
            }
        },
        
//        protected abstract bool 
        IsUnchanged: 
        { 
            get:function(){}
        } 
	});
	
	ModelTreeEnumerator.Type = new Type("ModelTreeEnumerator", ModelTreeEnumerator, [IEnumerator.Type]);
	return ModelTreeEnumerator;
});
