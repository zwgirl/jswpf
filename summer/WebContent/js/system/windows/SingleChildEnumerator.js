/**
 * SingleChildEnumerator
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerator"], function(declare, Type, IEnumerator){
	var SingleChildEnumerator = declare("SingleChildEnumerator", IEnumerator,{
		constructor:function(/*object*/ Child)
        {
            this._child = Child; 
            this._count = Child == null ? 0 : 1;
            this._index = -1;
        },
        
//        bool IEnumerator.
        MoveNext:function() 
        {
            this._index++; 
            return this._index < this._count; 
        },
 
//        void IEnumerator.
        Reset:function()
        {
            this._index = -1;
        } 
	});
	
	Object.defineProperties(SingleChildEnumerator.prototype,{
//        object IEnumerator.
        Current:
        { 
            get:function() { return (this._index == 0) ? this._child : null; }
        }
	});
	
	SingleChildEnumerator.Type = new Type("SingleChildEnumerator", SingleChildEnumerator, [IEnumerator.Type]);
	return SingleChildEnumerator;
});
