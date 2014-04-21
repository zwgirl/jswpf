/**
 * LocalValueEnumerator
 */

define(["dojo/_base/declare"], function(declare){
	var LocalValueEnumerator = declare("LocalValueEnumerator", null,{
		constructor:function(/*LocalValueEntry[]*/ snapshot, /*int*/ count){
            this._index = -1; 
            this._count = count; 
            this._snapshot = snapshot;
		},
		

        /// <summary> 
        ///     Move to the next item in the enumerator
        /// </summary> 
        /// <returns>Success of the method</returns> 
        MoveNext:function()
        { 
            this._index++;

            return this._index < this.Count;
        },

        /// <summary> 
        ///     Reset enumeration 
        /// </summary>
        Reset:function() 
        {
            this._index = -1;
        }
	});
	
	Object.defineProperties(LocalValueEnumerator.prototype,{
		  

        /// <summary> 
        ///     Get current entry
        /// </summary>
        Current:
        { 
            get:function()
            { 
                if(this._index == -1 ) 
                {
//                    #pragma warning suppress 6503 // IEnumerator.Current is documented to throw this exception 
                    throw new Error("InvalidOperationException(SR.Get(SRID.LocalValueEnumerationReset)");
                }

                if(this._index >= this.Count ) 
                {
//                    #pragma warning suppress 6503 // IEnumerator.Current is documented to throw this exception 
                    throw new Error("InvalidOperationException(SR.Get(SRID.LocalValueEnumerationOutOfBounds)"); 
                }
 
                return this._snapshot[this._index];
            }
        },
        /// <summary>
        ///     Return number of items represented in the collection 
        /// </summary> 
        Count:
        { 
            get:function() { return this._count; }
        }
	});
	
	return LocalValueEnumerator;
});

//using System; 
//using System.Collections;
//using System.Diagnostics;
//using MS.Internal.WindowsBase;
// 
//#pragma warning disable 1634, 1691  // suppressing PreSharp warnings
// 
//namespace System.Windows 
//{
//    /// <summary> 
//    ///     Local value enumeration object
//    /// </summary>
//    /// <remarks>
//    ///     Modifying local values (via SetValue or ClearValue) during enumeration 
//    ///     is unsupported
//    /// </remarks> 
//    public struct LocalValueEnumerator : IEnumerator 
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
//            if(obj is LocalValueEnumerator)
//            { 
//                LocalValueEnumerator other = (LocalValueEnumerator) obj; 
//
//                return (_count == other._count && 
//                        _index == other._index &&
//                        _snapshot == other._snapshot);
//            }
//            else 
//            {
//                // being compared against something that isn't a LocalValueEnumerator. 
//                return false; 
//            }
//        } 
//
//        /// <summary>
//        ///     Determine equality
//        /// </summary> 
//        public static bool operator ==(LocalValueEnumerator obj1, LocalValueEnumerator obj2)
//        { 
//          return obj1.Equals(obj2); 
//        }
// 
//        /// <summary>
//        ///     Determine inequality
//        /// </summary>
//        public static bool operator !=(LocalValueEnumerator obj1, LocalValueEnumerator obj2) 
//        {
//          return !(obj1 == obj2); 
//        } 
//
//        /// <summary> 
//        ///     Get current entry
//        /// </summary>
//        public LocalValueEntry Current
//        { 
//            get
//            { 
//                if(_index == -1 ) 
//                {
//                    #pragma warning suppress 6503 // IEnumerator.Current is documented to throw this exception 
//                    throw new InvalidOperationException(SR.Get(SRID.LocalValueEnumerationReset));
//                }
//
//                if(_index >= Count ) 
//                {
//                    #pragma warning suppress 6503 // IEnumerator.Current is documented to throw this exception 
//                    throw new InvalidOperationException(SR.Get(SRID.LocalValueEnumerationOutOfBounds)); 
//                }
// 
//                return _snapshot[_index];
//            }
//        }
// 
//        /// <summary>
//        ///     Get current entry (object reference based) 
//        /// </summary> 
//        object IEnumerator.Current
//        { 
//            get { return Current; }
//        }
//
//        /// <summary> 
//        ///     Move to the next item in the enumerator
//        /// </summary> 
//        /// <returns>Success of the method</returns> 
//        public bool MoveNext()
//        { 
//            _index++;
//
//            return _index < Count;
//        } 
//
//        /// <summary> 
//        ///     Reset enumeration 
//        /// </summary>
//        public void Reset() 
//        {
//            _index = -1;
//        }
// 
//        /// <summary>
//        ///     Return number of items represented in the collection 
//        /// </summary> 
//        public int Count
//        { 
//            get { return _count; }
//        }
//
//        internal LocalValueEnumerator(LocalValueEntry[] snapshot, int count) 
//        {
//            _index = -1; 
//            _count = count; 
//            _snapshot = snapshot;
//        } 
//
//        private int                     _index;
//        private LocalValueEntry[]       _snapshot;
//        private int                     _count; 
//    }
// 
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
//}