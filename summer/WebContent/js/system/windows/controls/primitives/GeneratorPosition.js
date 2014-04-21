/**
 * from IItemContainerGenerator
 * 
 * GeneratorPosition
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var GeneratorPosition = declare("GeneratorPosition", null,{

        /// <summary> Constructor </summary>
        constructor:function(/*int*/ index, /*int*/ offset)
        { 
            this._index = index;
            this._offset = offset; 
        }, 

        /// <summary> Return a hash code </summary> 
        // This is required by FxCop.
//        public override int 
        GetHashCode:function()
        {
            return this._index.GetHashCode() + this._offset.GetHashCode(); 
        },
 
        /// <summary>Returns a string representation of the GeneratorPosition</summary> 
//        public override string 
        ToString:function()
        { 
            return String.Concat("GeneratorPosition (", _index.ToString(TypeConverterHelper.InvariantEnglishUS), ",", _offset.ToString(TypeConverterHelper.InvariantEnglishUS), ")");
        },

 
        // The remaining methods are present only because they are required by FxCop.
 
        /// <summary> Equality test </summary> 
        // This is required by FxCop.
//        public override bool 
        Equals:function(/*object*/ o) 
        {
            if (o instanceof GeneratorPosition)
            {
                return  this._index == o._index &&
                        this._offset == o._offset; 
            } 
            return false;
        } 
	});
	
	Object.defineProperties(GeneratorPosition.prototype,{
	       /// <summary>
        /// Index, with respect to realized elements.  The special value -1 
        /// refers to a fictitious element at the beginning or end of the 
        /// the list.
        /// </summary> 
//        public int 
        Index:  { get:function() { return this._index; },  set:function(value) { this._index = value; } },

        /// <summary>
        /// Offset, with respect to unrealized items near the indexed element. 
        /// An offset of 0 refers to the indexed element itself, an offset
        /// of 1 refers to the next (unrealized) item, and an offset of -1 
        /// refers to the previous item. 
        /// </summary>
//        public int 
        Offset: { get:function() { return this._offset; }, set:function(value) { this._offset = value; } } 
	});
	
	GeneratorPosition.Type = new Type("GeneratorPosition", GeneratorPosition, [Object.Type]);
	return GeneratorPosition;
});
