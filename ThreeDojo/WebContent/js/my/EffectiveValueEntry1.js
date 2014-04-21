define([ "dojo/_base/declare", "dojo/_base/lang" ], function(declare, lang) { 
    var EffectiveValueEntry = 
    {
        // Bit used to store BaseValueSourceInternal = 0x01 
        // Bit used to store BaseValueSourceInternal = 0x02
        // Bit used to store BaseValueSourceInternal = 0x04
        // Bit used to store BaseValueSourceInternal = 0x08
 
        ValueSourceMask     : 0x000F,
        ModifiersMask       : 0x0070, 
        IsExpression        : 0x0010, 
        IsAnimated          : 0x0020,
        IsCoerced           : 0x0040, 
        IsPotentiallyADeferredReference : 0x0080,
        HasExpressionMarker : 0x0100,
        IsCoercedWithCurrentValue : 0x200,
    } ;

     var BaseValueSourceInternal =
    { 
        Unknown                 : 0,
        Default                 : 1, 
        Inherited               : 2, 
        ThemeStyle              : 3,
        ThemeStyleTrigger       : 4, 
        Style                   : 5,
        TemplateTrigger         : 6,
        StyleTrigger            : 7,
        ImplicitReference       : 8, 
        ParentTemplate          : 9,
        ParentTemplateTrigger   : 10, 
        Local                   : 11, 
    };
     
 	var ModifiedValue = declare(null, {

    });
 	
 	Object.defineProperties(ModifiedValue.prototype, {
 		BaseValue :{ 
 			get:function(){
 				return this._baseValue;
 			},
 			set:function(value){
 	      		this._baseValue=value;
 			}
 	 	},
 	 	ExpressionValue : { 
 	 		get:function(){
 	 			return this._expressionValue;
 	 		},
 	 		set:function(value){
 	 			this._expressionValue=value;
 	 		}
 	 	},
 	 	AnimatedValue : { 
 	 		get:function(){
 	 			return this._animatedValue;
 	 		},
 	 		set:function(value){
 	      		this._animatedValue=value;
 	 		}
 	 	},
 	 	CoercedValue : { 
 	 		get:function(){
 	 			return this._coercedValue;
 	 		},
 	 		set:function(value){
 	 			this._coercedValue=value;
 	 		}
 	 	},
 	});
 	
 	var EffectiveValueEntry = declare(null, {

        constructor:function(dp, valueSource)
        { 
            this._propertyIndex = dp.GlobalIndex;
            this._value = DependencyProperty.UnsetValue; 
            if(valueSource==null){
            	this._source = BaseValueSourceInternal.Unknown; 
            }
        },

        SetExpressionValue:function(/*Object*/ value, /*Object*/ baseValue) 
        { 
//            Debug.Assert(value != DependencyProperty.UnsetValue);
 
            var modifiedValue = EnsureModifiedValue();
            modifiedValue.ExpressionValue = value;
            this.IsExpression = true;
            
            this.IsDeferredReference = value instanceof DeferredReference ? value : null; 

//            Debug.Assert(Object.Equals(modifiedValue.BaseValue, baseValue)); 
//            Debug.Assert(!(baseValue is DeferredReference)); 
//            Debug.Assert(IsDeferredReference == (value is DeferredReference));
        } ,

        SetAnimatedValue:function(/*Object*/ value, /*Object*/ baseValue)
        {
//            Debug.Assert((value != DependencyProperty.UnsetValue) && 
//                         !(value is DeferredReference));
 
            var modifiedValue = EnsureModifiedValue(); 
            modifiedValue.AnimatedValue = value;
            this.IsAnimated = true; 

            // Animated values should never be deferred
            this.IsDeferredReference = false;
 
//            Debug.Assert(!(modifiedValue.AnimatedValue is DeferredReference));
//            Debug.Assert(Object.Equals(modifiedValue.BaseValue, baseValue) || 
//                         Object.Equals(modifiedValue.ExpressionValue, baseValue)); 
//            Debug.Assert(!(baseValue is DeferredReference) &&
//                         ! (modifiedValue.BaseValue is DeferredReference) && 
//                         ! (modifiedValue.ExpressionValue is DeferredReference));
        },

        SetCoercedValue:function(/*Object*/ value, /*Object*/ baseValue, /*boolean*/ skipBaseValueChecks, /*boolean*/ coerceWithCurrentValue) 
        {
//            Debug.Assert(value != DependencyProperty.UnsetValue && 
//                         !((value is DeferredReference) && !coerceWithCurrentValue)); 

            // if this is already a CoercedWithControlValue entry, we are applying a 
            // second coercion (e.g. from the CoerceValueCallback).  The baseValue
            // passed in is the result of the control-value coercion, but for the
            // purposes of this method we should use the original base value instead.
            if (this.IsCoercedWithCurrentValue) 
            {
                baseValue = ModifiedValue.BaseValue; 
            } 

            var modifiedValue = EnsureModifiedValue(); 
            modifiedValue.CoercedValue = value;
            this.IsCoerced = true;
            this.IsCoercedWithCurrentValue = coerceWithCurrentValue;
 
            // The only CoercedValues that can be deferred are Control values.
            if (coerceWithCurrentValue) 
            { 
                this.IsDeferredReference = (value instanceof DeferredReference) ? value : null;
            } 
            else
            {
                this.IsDeferredReference = false;
            } 

 
//            Debug.Assert(skipBaseValueChecks || 
//                         Object.Equals(modifiedValue.BaseValue, baseValue) ||
//                         Object.Equals(modifiedValue.ExpressionValue, baseValue) || 
//                         Object.Equals(modifiedValue.AnimatedValue, baseValue));
//            Debug.Assert(!(baseValue is DeferredReference) &&
//                         ! (modifiedValue.BaseValue is DeferredReference) &&
//                         ! (modifiedValue.ExpressionValue is DeferredReference) && 
//                         ! (modifiedValue.AnimatedValue is DeferredReference));
        }, 
 
        ResetAnimatedValue:function()
        { 
            if (this.IsAnimated)
            {
                var modifiedValue = ModifiedValue;
                modifiedValue.AnimatedValue = null; 
                this.IsAnimated = false;
 
                if (!this.HasModifiers) 
                {
                    this.Value = modifiedValue.BaseValue; 
                }
                else
                {
                    // The setter takes care of the IsDeferred flag no need to compute it twice. 
                    this.ComputeIsDeferred();
                } 
            } 
        },
 
        ResetCoercedValue:function()
        {
            if (this.IsCoerced)
            { 
                var modifiedValue = ModifiedValue;
                modifiedValue.CoercedValue = null; 
                this.IsCoerced = false; 

                if (!this.HasModifiers) 
                {
                	this.Value = modifiedValue.BaseValue;
                }
                else 
                {
                	this.ComputeIsDeferred(); 
                } 
            }
        }, 

        // remove all modifiers, retain value source, and set value to supplied value
        ResetValue:function(/*Object*/ value, /*boolean*/ hasExpressionMarker)
        { 
        	this._source &= FullValueSource.ValueSourceMask;
        	this._value = value; 
            if (hasExpressionMarker) 
            {
            	this.HasExpressionMarker = true; 
            }
            else
            {
            	this.ComputeIsDeferred(); 
            }
//            Debug.Assert(hasExpressionMarker == (value == DependencyObject.ExpressionInAlternativeStore), "hasExpressionMarker flag must match value"); 
        } ,

        // add an expression marker back as the base value for an expression value 
        RestoreExpressionMarker:function()
        {
            if (this.HasModifiers)
            { 
                var entry = ModifiedValue;
                entry.ExpressionValue = entry.BaseValue; 
                entry.BaseValue = DependencyObject.ExpressionInAlternativeStore; 
                this._source |= FullValueSource.IsExpression | FullValueSource.HasExpressionMarker;
 
                //recompute the isDeferredReference flag as it may have changed
                this.ComputeIsDeferred();
            }
            else 
            {
                var value = this.Value; 
                this.Value = DependencyObject.ExpressionInAlternativeStore; 
                this.SetExpressionValue(value, DependencyObject.ExpressionInAlternativeStore);
                this._source |= FullValueSource.HasExpressionMarker; 
            }
        } ,

        // Computes and set the IsDeferred hint flag. 
        // This take into account all flags and should only be used sparingly. 
        ComputeIsDeferred:function()
        { 
            var isDeferredReference = false;
            if (!this.HasModifiers)
            {
                isDeferredReference = Value instanceof DeferredReference; 
            }
            else if (this.ModifiedValue != null) 
            { 
                if (this.IsCoercedWithCurrentValue)
                { 
                    isDeferredReference = ModifiedValue.CoercedValue instanceof DeferredReference;
                }
                else if (this.IsExpression)
                { 
                    isDeferredReference = ModifiedValue.ExpressionValue instanceof DeferredReference;
                } 
 
                // For animated values isDeferred will always be false.
            } 

            this.IsDeferredReference = isDeferredReference;
        },
        
        GetFlattenedEntry:function(/*RequestFlags*/ requests) 
        {
            if ((this._source & (FullValueSource.ModifiersMask | FullValueSource.HasExpressionMarker)) == 0)
            {
                // If the property does not have any modifiers 
                // then just return the base value.
                return this; 
            } 

            if (!this.HasModifiers) 
            {
                Debug.Assert(HasExpressionMarker);

                // This is the case when some one stuck an expression into 
                // an alternate store such as a style or a template but the
                // new value for the expression has not been evaluated yet. 
                // In the intermediate we need to return the default value 
                // for the property. This problem was manifested in DRTDocumentViewer.
                var unsetEntry = new EffectiveValueEntry(); 
                unsetEntry.BaseValueSourceInternal = this.BaseValueSourceInternal;
                unsetEntry.PropertyIndex = this.PropertyIndex;
                return unsetEntry;
            } 

            // else entry has modifiers 
            var entry = new EffectiveValueEntry(); 
            entry.BaseValueSourceInternal = this.BaseValueSourceInternal;
            entry.PropertyIndex = this.PropertyIndex; 
            entry.IsDeferredReference = this.IsDeferredReference;

            // If the property has a modifier return the modified value
//            Debug.Assert(ModifiedValue != null); 

            // outside of DO, we flatten modified value 
            var modifiedValue = ModifiedValue; 

            // Note that the modified values have an order of precedence 
            // 1. Coerced Value (including Current value)
            // 2. Animated Value
            // 3. Expression Value
            // Also note that we support any arbitrary combinations of these 
            // modifiers and will yet the precedence metioned above.
            if (this.IsCoerced) 
            { 
                if ((requests & RequestFlags.CoercionBaseValue) == 0)
                { 
                    entry.Value = modifiedValue.CoercedValue;
                }
                else
                { 
                    // This is the case when CoerceValue tries to query
                    // the old base value for the property 
                    if (this.IsCoercedWithCurrentValue) 
                    {
                        entry.Value = modifiedValue.CoercedValue; 
                    }
                    else if (this.IsAnimated && ((requests & RequestFlags.AnimationBaseValue) == 0))
                    {
                        entry.Value = modifiedValue.AnimatedValue; 
                    }
                    else if (this.IsExpression) 
                    { 
                        entry.Value = modifiedValue.ExpressionValue;
                    } 
                    else
                    {
                        entry.Value = modifiedValue.BaseValue;
                    } 
                }
            } 
            else if (this.IsAnimated) 
            {
                if ((requests & RequestFlags.AnimationBaseValue) == 0) 
                {
                    entry.Value = modifiedValue.AnimatedValue;
                }
                else 
                {
                    // This is the case when [UI/Content]Element are 
                    // requesting the base value of an animation. 
                    if (this.IsExpression)
                    { 
                        entry.Value = modifiedValue.ExpressionValue;
                    }
                    else
                    { 
                        entry.Value = modifiedValue.BaseValue;
                     } 
                } 
            }
            else 
            {
//                Debug.Assert(IsExpression == true);

                var expressionValue = modifiedValue.ExpressionValue; 

                entry.Value = expressionValue; 
            } 

//            Debug.Assert(entry.IsDeferredReference == (entry.Value is DeferredReference), "Value and DeferredReference flag should be in [....]; hitting this may mean that it's time to divide the DeferredReference flag into a set of flags, one for each modifier"); 

            return entry;
        },
 
        SetAnimationBaseValue:function(/*Object*/ animationBaseValue)
        { 
            if (!this.HasModifiers) 
            {
            	this.Value = animationBaseValue; 
            }
            else
            {
                var modifiedValue = ModifiedValue; 

                if (this.IsExpression) 
                { 
                    modifiedValue.ExpressionValue = animationBaseValue;
                } 
                else
                {
                    modifiedValue.BaseValue = animationBaseValue;
                } 

                //the modified value may be a deferred reference so recompute this flag. 
                this.ComputeIsDeferred(); 
            }
        } ,

        SetCoersionBaseValue:function(/*Object*/ coersionBaseValue)
        {
            if (!this.HasModifiers) 
            {
            	this.Value = coersionBaseValue; 
            } 
            else
            { 
                var modifiedValue = ModifiedValue;

                if (this.IsAnimated)
                { 
                    modifiedValue.AnimatedValue = coersionBaseValue;
                } 
                else if (this.IsExpression) 
                {
                    modifiedValue.ExpressionValue = coersionBaseValue; 
                }
                else
                {
                    modifiedValue.BaseValue = coersionBaseValue; 
                }
                //the modified value may be a deferred reference so recompute this flag. 
                this.ComputeIsDeferred(); 
            }
        } ,

        

        EnsureModifiedValue:function() 
        {
            var modifiedValue = null;
            if (this._value == null){ 
                this._value = modifiedValue = new ModifiedValue();
            } else {
                modifiedValue = this._value; 
                if (modifiedValue == null){
                    modifiedValue = new ModifiedValue();
                    modifiedValue.BaseValue = this._value; 
                    this._value = modifiedValue;
                } 
            } 
            return modifiedValue;
        } ,

        Clear:function()
        {
        	this._propertyIndex = -1; 
        	this._value = null;
        	this._source = 0; 
        } ,


        WritePrivateFlag:function(/*FullValueSource*/ bit, /*boolean*/ value) 
        {
            if (value) { 
                this._source |= bit;
            } else  {
                this._source &= ~bit;
            } 
        },
 
        ReadPrivateFlag:function(/*FullValueSource*/ bit) 
        {
            return (this._source & bit) != 0; 
        }

    });
 	
 	function CreateDefaultValueEntry(/*DependencyProperty*/ dp, /*Object*/ value) 
    {
        var entry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Default); 
        entry.Value = value; 
        return entry;

    }

 	
 	Object.defineProperties(EffectiveValueEntry.prototype,{
  
 		PropertyIndex :{
	        get: function()  { return this._propertyIndex; },
	        set: function(value){ this._propertyIndex = value; }
 		},
 		
 		Value:{
 			get: function(){ return _value; } ,
 			set: function(value){
                 this._value = value; 
 			}
 		},

 		BaseValueSourceInternal:{
 			get: function(){ return this._source & FullValueSource.ValueSourceMask; },
 			set: function(value){ this._source = (this._source & ~FullValueSource.ValueSourceMask) | (FullValueSource)value; }
 		},
 		
 		IsDeferredReference:{
 			get: function() {
	            // When this flag is true we treat it as a hint rather than 
				// guarantee and update
	            // it if is out of [....]. When the flag is false, however we expect
				// it to guarantee
	            // that the value isn't a DeferredReference.
	            var isDeferredReference = this.ReadPrivateFlag(FullValueSource.IsPotentiallyADeferredReference);
	            if (isDeferredReference) 
	            {
	                // Check if the value is really a deferred reference
	                this.ComputeIsDeferred();
	                isDeferredReference = this.ReadPrivateFlag(FullValueSource.IsPotentiallyADeferredReference); 
	            }
	  
	            return isDeferredReference; 
 			},
  
 			set: function(value){ this.WritePrivateFlag(FullValueSource.IsPotentiallyADeferredReference, value); }
 		},

 		IsExpression:{
 			get: function(){ return this.ReadPrivateFlag(FullValueSource.IsExpression); } ,
 			set: function(value){ this.WritePrivateFlag(FullValueSource.IsExpression, value); }
 		},
        
 		IsAnimated:{
 			get: function(){ return this.ReadPrivateFlag(FullValueSource.IsAnimated); },
 			set: function(value){ this.WritePrivateFlag(FullValueSource.IsAnimated, value); }
 		},
         
 		IsCoerced:{
 			get: function(){ return this.ReadPrivateFlag(FullValueSource.IsCoerced); } ,
 			set: function(value){ this.WritePrivateFlag(FullValueSource.IsCoerced, value); }
 		},
          
 		HasModifiers:{
 			get: function(){ return (this._source & FullValueSource.ModifiersMask) != 0; }
 		},
 		
 		FullValueSource:{
 			get: function(){ return this._source; }
 		},
 		
 		HasExpressionMarker:{
 			get: function(){ return this.ReadPrivateFlag(FullValueSource.HasExpressionMarker); },
 			set: function(value){ this.WritePrivateFlag(FullValueSource.HasExpressionMarker, value); }
 		},
 		
 		IsCoercedWithCurrentValue:{
         get: function(){ return this.ReadPrivateFlag(FullValueSource.IsCoercedWithCurrentValue); },
         set: function(value){ this.WritePrivateFlag(FullValueSource.IsCoercedWithCurrentValue, value); }
 		} ,
 		
 		LocalValue:{
 			get: function(){
 				if (BaseValueSourceInternal == BaseValueSourceInternal.Local){ 
 					if (!HasModifiers) { 
// 						Debug.Assert(Value != DependencyProperty.UnsetValue);
 						return Value;
 					} else {
// 						Debug.Assert(ModifiedValue != null && ModifiedValue.BaseValue != DependencyProperty.UnsetValue); 
 						return ModifiedValue.BaseValue; 
 					}
 				}else{
 					return DependencyProperty.UnsetValue;
 				}
 			},
 			set: function(value) {
// 				Debug.Assert(BaseValueSourceInternal == BaseValueSourceInternal.Local, "This can happen only on an entry already having a local value"); 

 				if (!HasModifiers) {
// 					Debug.Assert(Value != DependencyProperty.UnsetValue); 
 					Value = value;
 				} else  {
// 					Debug.Assert(ModifiedValue != null && ModifiedValue.BaseValue != DependencyProperty.UnsetValue); 
 					ModifiedValue.BaseValue = value;
 				}
 			}
 		},

 		ModifiedValue:{
 			get :function(){ 
 				if (_value != null && value instanceof ModifiedValue){
 					return _value;
 				} 
 				return null;
 			} 
 		},
 	});
 	
 	return EffectiveValueEntry;

});


 
