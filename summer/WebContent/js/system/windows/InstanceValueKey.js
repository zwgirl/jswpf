/**
 * from StyleHelper
 */

/**
 * InstanceValueKey
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var InstanceValueKey = declare("InstanceValueKey", null,{
		constructor:function(/*int*/ childIndex, /*int*/ dpIndex, /*int*/ index) 
        {
            this._childIndex = childIndex; 
            this._dpIndex = dpIndex;
            this._index = index;
		},
		
//        public override bool 
		Equals:function(/*object*/ o) 
        {
            var key = o instanceof InstanceValueKey ? o : null; 
            if (key != null)
                return (this._childIndex == key._childIndex) && (this._dpIndex == key._dpIndex) && (this._index == key._index);
            else
                return false; 
        },
 
//        public override int 
		GetHashCode:function() 
        {
            return (20000*this._childIndex + 20*this._dpIndex + this._index); 
        }
		
	});
	
	InstanceValueKey.Type = new Type("InstanceValueKey", InstanceValueKey, [Object.Type]);
	return InstanceValueKey;
});

//    // 
//    //  When an unshareable value appears in the property value list, we store the 
//    //  corresponding "instance value" in per-instance StyleData.  More precisely,
//    //  the instance value is stored in a hash table, using the following class 
//    //  as the key (so we know where the value came from).
//    //
//    internal class InstanceValueKey
//    { 
//        #region Construction
// 
//        internal InstanceValueKey(int childIndex, int dpIndex, int index) 
//        {
//            _childIndex = childIndex; 
//            _dpIndex = dpIndex;
//            _index = index;
//        }
// 
//        #endregion Construction
// 
//        public override bool Equals(object o) 
//        {
//            InstanceValueKey key = o as InstanceValueKey; 
//            if (key != null)
//                return (_childIndex == key._childIndex) && (_dpIndex == key._dpIndex) && (_index == key._index);
//            else
//                return false; 
//        }
// 
//        public override int GetHashCode() 
//        {
//            return (20000*_childIndex + 20*_dpIndex + _index); 
//        }
//
//        // the origin of the instance value in the container's style:
//        int _childIndex;    // the childIndex of the target element 
//        int _dpIndex;       // the global index of the target DP
//        int _index;         // the index in the ItemStructList<ChildValueLookup> 
//    } 
