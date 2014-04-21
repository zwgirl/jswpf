/**
 * LocalValueEntry
 */

/**
 * EntryIndex
 */

/**
 * EntryIndex
 */

define(["dojo/_base/declare"], function(declare){
	var LocalValueEntry = declare("LocalValueEntry", null,{
		constructor:function(/*DependencyProperty*/ dp, /*object*/ value){
            this._dp = dp; 
            this._value = value;
		}
	});
	
	Object.defineProperties(LocalValueEntry.prototype,{
		  
        /// <summary> 
        ///     Dependency property
        /// </summary> 
        Property: 
        {
            get:function() { return this._dp; } 
        },

        /// <summary>
        ///     Value of the property 
        /// </summary>
        Value:
        { 
            get:function() { return this._value; }
        } 


	});
	
	return LocalValueEntry;
});
//
//    /// <summary>
//    ///     Represents a Property-Value pair for local value enumeration 
//    /// </summary>
//    public struct LocalValueEntry
//    {
//        /// <summary> 
//        /// Overrides Object.GetHashCode
//        /// </summary> 
//        /// <returns>An integer that represents the hashcode for this object</returns> 
//        public override int GetHashCode()
//        { 
//            return base.GetHashCode();
//        }
//
//        /// <summary> 
//        ///     Determine equality
//        /// </summary> 
//        public override bool Equals(object obj) 
//        {
//            LocalValueEntry other = (LocalValueEntry) obj; 
//
//            return (_dp == other._dp &&
//                    _value == other._value);
//        } 
//
//        /// <summary> 
//        ///     Determine equality 
//        /// </summary>
//        public static bool operator ==(LocalValueEntry obj1, LocalValueEntry obj2) 
//        {
//          return obj1.Equals(obj2);
//        }
// 
//        /// <summary>
//        ///     Determine inequality 
//        /// </summary> 
//        public static bool operator !=(LocalValueEntry obj1, LocalValueEntry obj2)
//        { 
//          return !(obj1 == obj2);
//        }
//
//        /// <summary> 
//        ///     Dependency property
//        /// </summary> 
//        public DependencyProperty Property 
//        {
//            get { return _dp; } 
//        }
//
//        /// <summary>
//        ///     Value of the property 
//        /// </summary>
//        public object Value 
//        { 
//            get { return _value; }
//        } 
//
//        internal LocalValueEntry(DependencyProperty dp, object value)
//        {
//            _dp = dp; 
//            _value = value;
//        } 
// 
//        // Internal here because we need to change these around when building
//        //  the snapshot for the LocalValueEnumerator, and we can't make internal 
//        //  setters when we have public getters.
//        internal DependencyProperty _dp;
//        internal object _value;
//    } 