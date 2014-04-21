/**
 * UIPropertyMetadata
 */

define(["dojo/_base/declare", "system/Type", "windows/PropertyMetadata"], 
		function(declare, Type, PropertyMetadata){
	
	var MetadataFlags = PropertyMetadata.MetadataFlags;

	
	var UIPropertyMetadata = declare("UIPropertyMetadata", PropertyMetadata,{
		constructor:function(){

		},
		
		  /// <summary>
		  ///     UI metadata construction 
		  /// </summary> 
//		  public 
		  Init:function()
		  {
			  PropertyMetadata.prototype.Init.call(this);
		  },
		
		  /// <summary> 
		  ///     UI metadata construction
		  /// </summary> 
		  /// <param name="defaultValue">Default value of property</param> 
//		  public 
		  InitWithDV:function(/*object*/ defaultValue) 
		  {
			  PropertyMetadata.prototype.InitWithDefaultValue.call(this, defaultValue);
		  },
		
		  /// <summary> 
		  ///     UI metadata construction
		  /// </summary> 
		  /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
//		  public 
		  InitWithPCCB:function(/*PropertyChangedCallback*/ propertyChangedCallback)
		  {
			  PropertyMetadata.prototype.InitWithPCCB.call(this, propertyChangedCallback);
		  },
		
		  /// <summary> 
		  ///     UI metadata construction
		  /// </summary> 
		  /// <param name="defaultValue">Default value of property</param> 
		  /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//		  public 
		  InitWithDVandPCCB:function(/*object*/ defaultValue, 
		                            /*PropertyChangedCallback*/ propertyChangedCallback) 
		  {
			  PropertyMetadata.prototype.InitWithDVandPCCB.call(this, defaultValue, propertyChangedCallback);
		  },
		
		  /// <summary> 
		  ///     UI metadata construction 
		  /// </summary>
		  /// <param name="defaultValue">Default value of property</param> 
		  /// <param name="propertyChangedCallback">Called when the property has been changed</param>
		  /// <param name="coerceValueCallback">Called on update of value</param>
//		  public 
		  InitWithDVandPCCBandCVCB:function(/*object*/ defaultValue,
		                          /*PropertyChangedCallback*/ propertyChangedCallback, 
		                          /*CoerceValueCallback*/ coerceValueCallback) 
		  { 
			  PropertyMetadata.prototype.InitWithDVandPCCBandCVCB.call(this, defaultValue, propertyChangedCallback, coerceValueCallback);
		  },
		
		  /// <summary>
		  ///     UI metadata construction
		  /// </summary>
		  /// <param name="defaultValue">Default value of property</param> 
		  /// <param name="propertyChangedCallback">Called when the property has been changed</param>
		  /// <param name="coerceValueCallback">Called on update of value</param> 
		  /// <param name="isAnimationProhibited">Should animation be prohibited?</param> 
//		  public 
		  InitWithDVandPCCBandCVCB:function(/*object*/ defaultValue,
		                          /*PropertyChangedCallback*/ propertyChangedCallback, 
		                          /*CoerceValueCallback*/ coerceValueCallback,
		                          /*bool*/ isAnimationProhibited) 
		  { 
			  PropertyMetadata.prototype.InitWithDVandPCCBandCVCB.call(this, defaultValue, propertyChangedCallback, coerceValueCallback);
			  this.WriteFlag(MetadataFlags.UI_IsAnimationProhibitedID, isAnimationProhibited);
		  },	 

        /// <summary> 
        ///     Creates a new instance of this property metadata.  This method is used
        ///     when metadata needs to be cloned.  After CreateInstance is called the
        ///     framework will call Merge to merge metadata into the new instance.
        ///     Deriving classes must override this and return a new instance of 
        ///     themselves.
        /// </summary> 
        CreateInstance:function() { 
            return new UIPropertyMetadata();
        },

	});
	
	Object.defineProperties(UIPropertyMetadata.prototype,{
        /// <summary>
        /// Set this to true for a property for which animation should be
        /// prohibited. This should not be set unless there are very strong 
        /// technical reasons why a property can not be animated. In the
        /// vast majority of cases, a property that can not be properly 
        /// animated means that the property implementation contains a bug. 
        /// </summary>
        IsAnimationProhibited:
        {
            get:function()
            {
                return ReadFlag(MetadataFlags.UI_IsAnimationProhibitedID); 
            },
            set:function(value)
            { 
                if (Sealed)
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)');
                }

                WriteFlag(MetadataFlags.UI_IsAnimationProhibitedID, value); 
            }
        } 
	});
	
	  /// <summary>
	  ///     UI metadata construction 
	  /// </summary> 
//	  public 
	  UIPropertyMetadata.Build = function()
	  {
		  var result = new UIPropertyMetadata();
		  PropertyMetadata.prototype.Init.call(result);
		  return result;
	  };
	
	  /// <summary> 
	  ///     UI metadata construction
	  /// </summary> 
	  /// <param name="defaultValue">Default value of property</param> 
//	  public 
	  UIPropertyMetadata.BuildWithDV = function(/*object*/ defaultValue) 
	  {
		  var result = new UIPropertyMetadata();
		  PropertyMetadata.prototype.InitWithDefaultValue.call(result, defaultValue);
		  return result;
	  };
	
	  /// <summary> 
	  ///     UI metadata construction
	  /// </summary> 
	  /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
//	  public 
	  UIPropertyMetadata.BuildWithPCCB = function(/*PropertyChangedCallback*/ propertyChangedCallback)
	  {
		  var result = new UIPropertyMetadata();
		  PropertyMetadata.prototype.InitWithPCCB.call(result, propertyChangedCallback);
		  return result;
	  };
	
	  /// <summary> 
	  ///     UI metadata construction
	  /// </summary> 
	  /// <param name="defaultValue">Default value of property</param> 
	  /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//	  public 
	  UIPropertyMetadata.BuildWithDVandPCCB = function(/*object*/ defaultValue, 
	                            /*PropertyChangedCallback*/ propertyChangedCallback) 
	  {
		  var result = new UIPropertyMetadata();
		  PropertyMetadata.prototype.InitWithDVandPCCB.call(result, defaultValue, propertyChangedCallback);
		  return result;
	  }; 
	
	  /// <summary> 
	  ///     UI metadata construction 
	  /// </summary>
	  /// <param name="defaultValue">Default value of property</param> 
	  /// <param name="propertyChangedCallback">Called when the property has been changed</param>
	  /// <param name="coerceValueCallback">Called on update of value</param>
//	  public 
	  UIPropertyMetadata.BuildWithDVandPCCBandCVCB = function(/*object*/ defaultValue,
	                          /*PropertyChangedCallback*/ propertyChangedCallback, 
	                          /*CoerceValueCallback*/ coerceValueCallback) 
	  { 
		  var result = new UIPropertyMetadata();
		  PropertyMetadata.prototype.InitWithDVandPCCBandCVCB.call(result, defaultValue, propertyChangedCallback, coerceValueCallback);
		  return result;
	  };
	
	  /// <summary>
	  ///     UI metadata construction
	  /// </summary>
	  /// <param name="defaultValue">Default value of property</param> 
	  /// <param name="propertyChangedCallback">Called when the property has been changed</param>
	  /// <param name="coerceValueCallback">Called on update of value</param> 
	  /// <param name="isAnimationProhibited">Should animation be prohibited?</param> 
//	  public 
	  UIPropertyMetadata.BuildWithDVandPCCBandCVCB = function(/*object*/ defaultValue,
	                          /*PropertyChangedCallback*/ propertyChangedCallback, 
	                          /*CoerceValueCallback*/ coerceValueCallback,
	                          /*bool*/ isAnimationProhibited) 
	  { 
		  var result = new UIPropertyMetadata();
		  PropertyMetadata.prototype.InitWithDVandPCCBandCVCB.call(result, defaultValue, propertyChangedCallback, coerceValueCallback);
		  result.WriteFlag(MetadataFlags.UI_IsAnimationProhibitedID, isAnimationProhibited);
		  return result;
	  };
	
	UIPropertyMetadata.Type = new Type("UIPropertyMetadata", UIPropertyMetadata, [PropertyMetadata.Type]);
	
	UIPropertyMetadata.MetadataFlags = PropertyMetadata.MetadataFlags;
	
	return UIPropertyMetadata;
});

//using MS.Utility; 
//using System;
//using System.Collections.Generic;
//
//using SR=MS.Internal.PresentationCore.SR; 
//using SRID=MS.Internal.PresentationCore.SRID;
// 
//namespace System.Windows 
//{
//    /// <summary> 
//    ///     Metadata for supported UI features
//    /// </summary>
//    public class UIPropertyMetadata : PropertyMetadata
//    { 
//        /// <summary>
//        ///     UI metadata construction 
//        /// </summary> 
//        public UIPropertyMetadata() :
//            base() 
//        {
//        }
//
//        /// <summary> 
//        ///     UI metadata construction
//        /// </summary> 
//        /// <param name="defaultValue">Default value of property</param> 
//        public UIPropertyMetadata(object defaultValue) :
//            base(defaultValue) 
//        {
//        }
//
//        /// <summary> 
//        ///     UI metadata construction
//        /// </summary> 
//        /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
//        public UIPropertyMetadata(PropertyChangedCallback propertyChangedCallback) :
//            base(propertyChangedCallback) 
//        {
//        }
//
//        /// <summary> 
//        ///     UI metadata construction
//        /// </summary> 
//        /// <param name="defaultValue">Default value of property</param> 
//        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//        public UIPropertyMetadata(object defaultValue, 
//                                  PropertyChangedCallback propertyChangedCallback) :
//            base(defaultValue, propertyChangedCallback)
//        {
//        } 
//
//        /// <summary> 
//        ///     UI metadata construction 
//        /// </summary>
//        /// <param name="defaultValue">Default value of property</param> 
//        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//        /// <param name="coerceValueCallback">Called on update of value</param>
//        public UIPropertyMetadata(object defaultValue,
//                                PropertyChangedCallback propertyChangedCallback, 
//                                CoerceValueCallback coerceValueCallback) :
//            base(defaultValue, propertyChangedCallback, coerceValueCallback) 
//        { 
//        }
// 
//        /// <summary>
//        ///     UI metadata construction
//        /// </summary>
//        /// <param name="defaultValue">Default value of property</param> 
//        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//        /// <param name="coerceValueCallback">Called on update of value</param> 
//        /// <param name="isAnimationProhibited">Should animation be prohibited?</param> 
//        public UIPropertyMetadata(object defaultValue,
//                                PropertyChangedCallback propertyChangedCallback, 
//                                CoerceValueCallback coerceValueCallback,
//                                bool isAnimationProhibited) :
//            base(defaultValue, propertyChangedCallback, coerceValueCallback)
//        { 
//            WriteFlag(MetadataFlags.UI_IsAnimationProhibitedID, isAnimationProhibited);
//        } 
// 
//
//        /// <summary> 
//        ///     Creates a new instance of this property metadata.  This method is used
//        ///     when metadata needs to be cloned.  After CreateInstance is called the
//        ///     framework will call Merge to merge metadata into the new instance.
//        ///     Deriving classes must override this and return a new instance of 
//        ///     themselves.
//        /// </summary> 
//        internal override PropertyMetadata CreateInstance() { 
//            return new UIPropertyMetadata();
//        } 
//
//        /// <summary>
//        /// Set this to true for a property for which animation should be
//        /// prohibited. This should not be set unless there are very strong 
//        /// technical reasons why a property can not be animated. In the
//        /// vast majority of cases, a property that can not be properly 
//        /// animated means that the property implementation contains a bug. 
//        /// </summary>
//        public bool IsAnimationProhibited 
//        {
//            get
//            {
//                return ReadFlag(MetadataFlags.UI_IsAnimationProhibitedID); 
//            }
//            set 
//            { 
//                if (Sealed)
//                { 
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
//                }
//
//                WriteFlag(MetadataFlags.UI_IsAnimationProhibitedID, value); 
//            }
//        } 
//    } 
//}

