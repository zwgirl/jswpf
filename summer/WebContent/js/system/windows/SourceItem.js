/**
 * SourceItem
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var SourceItem = declare("SourceItem", null,{
		constructor:function(/*int*/ startIndex, /*object*/ source)
        {
            this._startIndex = startIndex;
            this._source = source; 
        },
 
        /// <summary>
        ///     Is the given SourceItem equals the current 
        /// </summary>
//        public bool 
        Equals:function(/*SourceItem*/ sourceItem)
        {
            return ( 
                sourceItem._startIndex == this._startIndex &&
                sourceItem._source == this._source); 
        }

	});
	
	Object.defineProperties(SourceItem.prototype,{
	       // Gettor for StartIndex
//        internal int 
        StartIndex:
        { 
            get:function() { return this._startIndex; }
        },
 
        // Gettor for Source
//        internal object 
        Source: 
        {
            get:function() { return this._source; }
        }
	});
	
	SourceItem.Type = new Type("SourceItem", SourceItem, [Object.Type]);
	return SourceItem;
});

