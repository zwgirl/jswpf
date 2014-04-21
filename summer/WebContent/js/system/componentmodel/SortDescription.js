/**
 * SecondCheck 12-10
 * SortDescription
 */

define(["dojo/_base/declare", "system/Type", "componentModel/ListSortDirection"], function(declare, Type, ListSortDirection){
	var SortDescription = declare("SortDescription", null,{
		constructor:function(/*string*/ propertyName, /*ListSortDirection*/ direction) 
        { 
            if (direction != ListSortDirection.Ascending && direction != ListSortDirection.Descending)
                throw new InvalidEnumArgumentException("direction", direction, typeof(ListSortDirection)); 

            this._propertyName = propertyName;
            this._direction = direction;
            this._sealed = false; 
        },
        
        /// <summary> Override of Object.Equals </summary> 
//        public override bool 
        Equals:function(/*object*/ obj) 
        {
            return (obj instanceof SortDescription) ? (this == obj) : false; 
        },
 
        /// <summary> Override of Object.GetHashCode </summary> 
//        public override int 
        GetHashCode:function()
        { 
            var result = this.Direction.GetHashCode();
            if (this.PropertyName != null)
            {
                result = this.PropertyName.GetHashCode() + result;
            }
            return result; 
        }, 
 
//        internal void 
        Seal:function()
        {
            this._sealed = true;
        } 
	});
	
	Object.defineProperties(SortDescription.prototype,{
		/// <summary> 
        /// Property name to sort by.
        /// </summary>
//        public string 
        PropertyName:
        { 
            get:function() { return this._propertyName; },
            set:function(value) 
            { 
                if (this._sealed)
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "SortDescription")); 

                this._propertyName = value;
            }
        },

        /// <summary> 
        /// Sort direction. 
        /// </summary>
//        public ListSortDirection 
        Direction: 
        {
            get:function() { return this._direction; },
            set:function(value)
            { 
                if (_sealed)
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "SortDescription")); 
 
                if (value < ListSortDirection.Ascending || value > ListSortDirection.Descending)
                    throw new InvalidEnumArgumentException("value", value, typeof(ListSortDirection)); 

                this._direction = value;
            }
        }, 

        /// <summary> 
        /// Returns true if the SortDescription is in use (sealed). 
        /// </summary>
//        public bool 
        IsSealed: 
        {
            get:function() { return this._sealed; }
        }
	});
	
	SortDescription.Type = new Type("SortDescription", SortDescription, [Object.Type]);
	return SortDescription;
});





