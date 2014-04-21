/**
 * UncommonField.js
 */

define(["dojo/_base/declare", "windows/DependencyProperty","windows/EntryIndex", /*"windows/DependencyObject",*/
        "windows/BaseValueSourceInternal"], 
		function(declare, DependencyProperty, EntryIndex, /*DependencyObject,*/
				BaseValueSourceInternal){
	
	var UncommonField= declare(null, {
	    constructor:function(defaultValue)
	    {
			if(defaultValue ===undefined){
				defaultValue = null;
			}
			
			this._defaultValue = defaultValue;

			this._hasBeenSet = false;
			 
			this._globalIndex = DependencyProperty.GetUniqueGlobalIndex(null, null); 
//			
			DependencyProperty.RegisteredPropertyList.Add();
			
//			this._globalIndex = -1;
	    },
	    
	       /// <summary>
        ///     Write the given value onto a DependencyObject instance. 
        /// </summary>
        /// <param name="instance">The DependencyObject on which to set the value.</param> 
        /// <param name="value">The value to set.</param> 
        SetValue:function(/*DependencyObject*/ instance, /*T*/ value)
        { 
            if (instance != null)
            {
                var entryIndex = instance.LookupEntry(this._globalIndex);
 
                // Set the value if it's not the default, otherwise remove the value.
                //if (!object.ReferenceEquals(value, _defaultValue)) 
                if (!(value=== this._defaultValue)) 
                { 
                    instance.SetEffectiveValue(entryIndex, null /* dp */, this._globalIndex, null /* metadata */, value, BaseValueSourceInternal.Local);
                    this._hasBeenSet = true; 
                }
                else
                {
                    instance.UnsetEffectiveValue(entryIndex, null /* dp */, null /* metadata */); 
                }
            } 
            else 
            {
                throw new Error("ArgumentNullException"); 
            }
        },

        /// <summary> 
        ///     Read the value of this field on a DependencyObject instance.
        /// </summary> 
        /// <param name="instance">The DependencyObject from which to get the value.</param> 
        /// <returns></returns>
        GetValue:function(/*DependencyObject*/ instance) 
        {
            if (instance != null)
            {
                if (this._hasBeenSet) 
                {
                    var entryIndex = instance.LookupEntry(this._globalIndex); 
 
                    if (entryIndex.Found)
                    { 
                        var value = instance.EffectiveValues[entryIndex.Index].LocalValue;

                        if (value != DependencyProperty.UnsetValue)
                        { 
                            return value;
                        } 
                    } 
                    return this._defaultValue;
                } 
                else
                {
                    return this._defaultValue;
                } 
            }
            else 
            { 
                throw new Error("ArgumentNullException"); 
            } 
        },


        /// <summary> 
        ///     Clear this field from the given DependencyObject instance.
        /// </summary> 
        /// <param name="instance"></param> 
        ClearValue:function(/*DependencyObject*/ instance)
        { 
            if (instance != null)
            {
                var entryIndex = instance.LookupEntry(this._globalIndex);
 
                instance.UnsetEffectiveValue(entryIndex, null /* dp */, null /* metadata */);
            } 
            else 
            {
                throw new Error("ArgumentNullException"); 
            }
        }

	    
	});
	
	Object.defineProperties(UncommonField.prototype, {
	
		GlobalIndex : {
			get : function() {
//				if(_globalIndex < 0){
//					this._globalIndex = DependencyProperty.GetUniqueGlobalIndex(null, null); 
//					
//					DependencyProperty.RegisteredPropertyList.Add();
//				}
				
				return this._globalIndex;
			},
		},
		DefaultValue:{
			get:function(){
				return this._defaultValue;
			},
			set:function(value){
				this._defaultValue=value;
			}
		}
	});
	
	return UncommonField;
});

//using System; 
//using System.Diagnostics;
//using System.Security.Permissions;
//
//using MS.Internal.WindowsBase;  // for FriendAccessAllowed 
//
//namespace System.Windows 
//{ 
//    /// <summary>
//    /// 
//    /// </summary>
//    //CASRemoval:[StrongNameIdentityPermissionAttribute(SecurityAction.InheritanceDemand, PublicKey=Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)]
//    [FriendAccessAllowed] // Built into Base, used by Core and Framework
//    internal class UncommonField<T> 
//    {
//        /// <summary> 
//        ///     Create a new UncommonField. 
//        /// </summary>
//        public UncommonField() : this(default(T)) 
//        {
//        }
//
//        /// <summary> 
//        ///     Create a new UncommonField.
//        /// </summary> 
//        /// <param name="defaultValue">The default value of the field.</param> 
//        public UncommonField(T defaultValue)
//        { 
//            _defaultValue = defaultValue;
//            _hasBeenSet = false;
//
//            lock (DependencyProperty.Synchronized) 
//            {
//                _globalIndex = DependencyProperty.GetUniqueGlobalIndex(null, null); 
// 
//                DependencyProperty.RegisteredPropertyList.Add();
//            } 
//        }
//
////        /// <summary>
////        ///     Write the given value onto a DependencyObject instance. 
////        /// </summary>
////        /// <param name="instance">The DependencyObject on which to set the value.</param> 
////        /// <param name="value">The value to set.</param> 
////        public void SetValue(DependencyObject instance, T value)
////        { 
////            if (instance != null)
////            {
////                EntryIndex entryIndex = instance.LookupEntry(_globalIndex);
//// 
////                // Set the value if it's not the default, otherwise remove the value.
////                if (!object.ReferenceEquals(value, _defaultValue)) 
////                { 
////                    instance.SetEffectiveValue(entryIndex, null /* dp */, _globalIndex, null /* metadata */, value, BaseValueSourceInternal.Local);
////                    _hasBeenSet = true; 
////                }
////                else
////                {
////                    instance.UnsetEffectiveValue(entryIndex, null /* dp */, null /* metadata */); 
////                }
////            } 
////            else 
////            {
////                throw new ArgumentNullException("instance"); 
////            }
////        }
////
////        /// <summary> 
////        ///     Read the value of this field on a DependencyObject instance.
////        /// </summary> 
////        /// <param name="instance">The DependencyObject from which to get the value.</param> 
////        /// <returns></returns>
////        public T GetValue(DependencyObject instance) 
////        {
////            if (instance != null)
////            {
////                if (_hasBeenSet) 
////                {
////                    EntryIndex entryIndex = instance.LookupEntry(_globalIndex); 
//// 
////                    if (entryIndex.Found)
////                    { 
////                        object value = instance.EffectiveValues[entryIndex.Index].LocalValue;
////
////                        if (value != DependencyProperty.UnsetValue)
////                        { 
////                            return (T)value;
////                        } 
////                    } 
////                    return _defaultValue;
////                } 
////                else
////                {
////                    return _defaultValue;
////                } 
////            }
////            else 
////            { 
////                throw new ArgumentNullException("instance");
////            } 
////        }
////
////
////        /// <summary> 
////        ///     Clear this field from the given DependencyObject instance.
////        /// </summary> 
////        /// <param name="instance"></param> 
////        public void ClearValue(DependencyObject instance)
////        { 
////            if (instance != null)
////            {
////                EntryIndex entryIndex = instance.LookupEntry(_globalIndex);
//// 
////                instance.UnsetEffectiveValue(entryIndex, null /* dp */, null /* metadata */);
////            } 
////            else 
////            {
////                throw new ArgumentNullException("instance"); 
////            }
////        }
////
////        internal int GlobalIndex 
////        {
////            get 
////            { 
////                return _globalIndex;
////            } 
////        }
//
//        #region Private Fields
// 
//        private T _defaultValue;
//        private int _globalIndex; 
//        private bool _hasBeenSet; 
//
//        #endregion 
//    }
//}