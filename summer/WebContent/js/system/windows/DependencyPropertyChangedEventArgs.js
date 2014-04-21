/**
 * Second check 2013-13-15
 * DependencyPropertyChangedEventArgs
 */
/// <summary>
///     Provides data for the various property changed events. 
/// </summary> 
define(["dojo/_base/declare", "windows/OperationType", "windows/EffectiveValueEntry", 
        "windows/RequestFlags", "windows/PropertyMetadata", "system/Type" , "windows/OperationType"], 
		function(declare, OperationType, EffectiveValueEntry,
				RequestFlags, PropertyMetadata, Type, OperationType){
    var PrivateFlags = 
    {
        IsAValueChange        : 0x01,
        IsASubPropertyChange  : 0x02,
    };
	
	var DependencyPropertyChangedEventArgs = declare("DependencyPropertyChangedEventArgs", null,{
		constructor:function(){
	
		},
		
		/// <summary>
        /// </summary> 
//        public override int 
		GetHashCode:function()
        { 
            return Object.prototype.GetHashCode.call(this); 
        },
 
        /// <summary>
        /// </summary>
//        public override bool 
        Equals:function(/*object*/ obj)
        { 
        	if(!(obj instanceof DependencyPropertyChangedEventArgs)){
        		return false;
        	}
        	
            return (this._property == obj._property &&
            		this._metadata == obj._metadata && 
            		this._oldEntry.Value == obj._oldEntry.Value &&
            		this._newEntry.Value == obj._newEntry.Value && 
            		this._flags == obj._flags && 
            		this._oldEntry.BaseValueSourceInternal == obj._oldEntry.BaseValueSourceInternal &&
            		this._newEntry.BaseValueSourceInternal == obj._newEntry.BaseValueSourceInternal && 
            		this._oldEntry.HasModifiers == obj._oldEntry.HasModifiers &&
            		this._newEntry.HasModifiers == obj._newEntry.HasModifiers &&
            		this._oldEntry.IsDeferredReference == obj._oldEntry.IsDeferredReference &&
            		this._newEntry.IsDeferredReference == obj._newEntry.IsDeferredReference && 
            		this._operationType == obj._operationType);
        }, 
		
        WritePrivateFlag:function(/*PrivateFlags*/ bit, /*bool*/ value) 
        { 
            if (value) { 
                this._flags |= bit;
            } else { 
            	this._flags &= ~bit;
            } 
        },

        ReadPrivateFlag:function(/*PrivateFlags*/ bit) {
            return (this._flags & bit) != 0;
        }
	});
	
	Object.defineProperties(DependencyPropertyChangedEventArgs.prototype,{
		  
	       /// <summary> 
        ///     The property whose value changed.
        /// </summary> 
        Property:
        {
            get:function() { return this._property; }
        },

        /// <summary> 
        ///     Whether or not this change indicates a change to the property value 
        /// </summary>
        IsAValueChange:
        {
            get:function() { return this.ReadPrivateFlag(PrivateFlags.IsAValueChange); },
            set:function(value) { this.WritePrivateFlag(PrivateFlags.IsAValueChange, value); } 
        },
 
        /// <summary> 
        ///     Whether or not this change indicates a change to the subproperty
        /// </summary> 
        IsASubPropertyChange:
        {
            get:function() { return this.ReadPrivateFlag(PrivateFlags.IsASubPropertyChange); },
            set:function(value) { this.WritePrivateFlag(PrivateFlags.IsASubPropertyChange, value); }
        }, 
 
        /// <summary>
        ///     Metadata for the property 
        /// </summary>
        Metadata:
        { 
            get:function() { return this._metadata; }
        }, 
 
        /// <summary>
        ///     Says what operation caused this property change 
        /// </summary>
        OperationType:
        { 
            get:function() { return this._operationType; }
        },

        /// <summary> 
        ///     The old value of the property.
        /// </summary>
        OldValue:
        { 
            get:function()
            { 
                var oldEntry = this.OldEntry.GetFlattenedEntry(RequestFlags.FullyResolved); 
                if (oldEntry.IsDeferredReference)
                { 
                    // The value for this property was meant to come from a dictionary
                    // and the creation of that value had been deferred until this
                    // time for better performance. Now is the time to actually instantiate
                    // this value by querying it from the dictionary. Once we have the 
                    // value we can actually replace the deferred reference marker
                    // with the actual value. 
                    oldEntry.Value = oldEntry.Value.GetValue(oldEntry.BaseValueSourceInternal); 
                }
 
                return oldEntry.Value;
            }
        },
 
        /// <summary>
        ///     The entry for the old value (contains value and all modifier info) 
        /// </summary> 
        OldEntry:
        {
            get:function() { return this._oldEntry; }
        },
 
        /// <summary>
        ///     The source of the old value 
        /// </summary> 
        OldValueSource:
        {
            get:function() { return this._oldEntry.BaseValueSourceInternal; }
        },

        /// <summary>
        ///     Says if the old value was a modified value (coerced, animated, expression) 
        /// </summary> 
        IsOldValueModified:
        {
            get:function() { return this._oldEntry.HasModifiers; }
        },
 
        /// <summary>
        ///     Says if the old value was a deferred value 
        /// </summary> 
        IsOldValueDeferred: 
        {
            get:function() { return this._oldEntry.IsDeferredReference; }
        },
 
        /// <summary>
        ///     The new value of the property. 
        /// </summary> 
        NewValue:
        { 
            get:function()
            {
                var newEntry = this.NewEntry.GetFlattenedEntry(RequestFlags.FullyResolved);
                if (newEntry.IsDeferredReference) 
                {
                    // The value for this property was meant to come from a dictionary 
                    // and the creation of that value had been deferred until this 
                    // time for better performance. Now is the time to actually instantiate
                    // this value by querying it from the dictionary. Once we have the 
                    // value we can actually replace the deferred reference marker
                    // with the actual value.
                    newEntry.Value = newEntry.Value.GetValue(newEntry.BaseValueSourceInternal);
                } 

                return newEntry.Value; 
            } 
        },

        /// <summary>
        ///     The entry for the new value (contains value and all modifier info)
        /// </summary>
        NewEntry:
        { 
            get:function() { return this._newEntry; } 
        },
 
        /// <summary>
        ///     The source of the new value
        /// </summary>
        NewValueSource:
        { 
            get:function() { return this._newEntry.BaseValueSourceInternal; } 
        },
 
        /// <summary>
        ///     Says if the new value was a modified value (coerced, animated, expression)
        /// </summary>
        IsNewValueModified:
        { 
            get:function() { return this._newEntry.HasModifiers; } 
        },
 
        /// <summary>
        ///     Says if the new value was a deferred value
        /// </summary>
        IsNewValueDeferred:
        { 
            get:function() { return this._newEntry.IsDeferredReference; } 
        }
 
	});
	
	DependencyPropertyChangedEventArgs.BuildPOO = function(/*DependencyProperty*/ property, /*Object*/ oldValue, /*Object*/ newValue) 
    { 
		var result = new DependencyPropertyChangedEventArgs();
		result._property = property;
		result._metadata = null; 
		result._oldEntry = new EffectiveValueEntry(property);
		result._newEntry = result._oldEntry;
		result._oldEntry.Value = oldValue;
		result._newEntry.Value = newValue; 

		result._flags = 0; 
		result._operationType = OperationType.Unknown; 
		result.IsAValueChange = true;
		return result;
    };

    DependencyPropertyChangedEventArgs.BuildPMOO = function(/*DependencyProperty*/ property, 
    		/*PropertyMetadata*/ metadata, /*Object*/ oldValue, /*Object*/ newValue)
    { 
    	var result = new DependencyPropertyChangedEventArgs();
    	result._property = property;
    	result._metadata = metadata; 
    	result._oldEntry = new EffectiveValueEntry(property); 
    	result._newEntry = result._oldEntry;
    	result._oldEntry.Value = oldValue; 
    	result._newEntry.Value = newValue;

    	result._flags = 0;
    	result._operationType = OperationType.Unknown; 
    	result.IsAValueChange        = true;
		return result;
    };

    DependencyPropertyChangedEventArgs.BuildPMO = function(/*DependencyProperty*/ property, 
    		/*PropertyMetadata*/ metadata, /*Object*/ value)
    { 
    	var result = new DependencyPropertyChangedEventArgs();
    	result._property = property;
    	result._metadata = metadata;
    	result._oldEntry = new EffectiveValueEntry(property);
    	result._oldEntry.Value = value; 
    	result._newEntry = result._oldEntry;

    	result._flags = 0; 
    	result._operationType = OperationType.Unknown;
        result.IsASubPropertyChange = true; 
		return result;
    };

    DependencyPropertyChangedEventArgs.Build6 = function(
        /*DependencyProperty*/  property, 
        /*PropertyMetadata*/    metadata,
        /*boolean*/                isAValueChange, 
        /*EffectiveValueEntry*/ oldEntry, 
        /*EffectiveValueEntry*/ newEntry,
        /*OperationType*/       operationType) 
    {
    	var result = new DependencyPropertyChangedEventArgs();
    	result._property             = property;
    	result._metadata             = metadata;
    	result._oldEntry             = oldEntry; 
    	result._newEntry             = newEntry;

    	result._flags = 0; 
        result._operationType        = operationType;
        result.IsAValueChange        = isAValueChange; 

        // This is when a mutable default is promoted to a local value. On this operation mutable default
        // value acquires a freezable context. However this value promotion operation is triggered
        // whenever there has been a sub property change to the mutable default. Eg. Adding a TextEffect 
        // to a TextEffectCollection instance which is the mutable default. Since we missed the sub property
        // change due to this add, we flip the IsASubPropertyChange bit on the following change caused by 
        // the value promotion to coalesce these operations. 
        result.IsASubPropertyChange = (operationType == OperationType.ChangeMutableDefaultValue);
		return result;
    };
	
	DependencyPropertyChangedEventArgs.Type = new Type("DependencyPropertyChangedEventArgs", 
			DependencyPropertyChangedEventArgs, [Object.Type]);
	return DependencyPropertyChangedEventArgs;
});

