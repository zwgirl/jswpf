/**
 * UncommonField.js
 */

define(["dojo/_base/declare","system/Type", "windows/BaseValueSourceInternal"], 
		function(declare, Type, BaseValueSourceInternal){
	
	var DependencyProperty = null;
	
	function EnsureDependencyProperty(){
		if(DependencyProperty == null){
			DependencyProperty = using("windows/DependencyProperty");
		}
		
		return DependencyProperty;

	}
	
	var UncommonField= declare("UncommonField", Object, {
	    constructor:function(defaultValue)
	    {
			if(defaultValue ===undefined){
				defaultValue = null;
			}
			
			this._defaultValue = defaultValue;

			this._hasBeenSet = false;
			
			EnsureDependencyProperty();
			 
			this._globalIndex = DependencyProperty.GetUniqueGlobalIndex(null, null); 
			DependencyProperty.RegisteredPropertyList.Add();
			
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
            			EnsureDependencyProperty();
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
	
	UncommonField.Type = new Type("UncommonField", UncommonField, [Object]);
	
	return UncommonField;
});

