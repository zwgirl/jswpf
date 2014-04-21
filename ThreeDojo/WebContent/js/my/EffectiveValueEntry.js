define([ "dojo/_base/declare", "dojo/_base/lang" ], function(declare, lang) { 
//    class BaseValueWeakReference : WeakReference
//    { 
//        public BaseValueWeakReference(object target) : base(target) {} 
//    }
	

//    [FriendAccessAllowed] // Built into Base, also used by Core & Framework. 
    /*internal enum */var FullValueSource = //: short 
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

    // Note that these enum values are arranged in the reverse order of 
    // precendence for these sources. Local value has highest 
    // precedence and Default value has the least. Note that we do not
    // store default values in the _effectiveValues cache unless it is 
    // being coerced/animated.
//    [FriendAccessAllowed] // Built into Base, also used by Core & Framework.
    /*internal enum */ var BaseValueSourceInternal = //: short
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
	
//	internal class ModifiedValue
    var ModifiedValue = declare(null, {

        
 
        /*internal void */SetBaseValue:function(/*object*/ value, /*bool*/ useWeakReference) 
        {
            this._baseValue = (useWeakReference && !value.GetType().IsValueType) 
                        ? new BaseValueWeakReference(value)
                        : value;
        }

//        private object _baseValue; 
//        private object _expressionValue;
//        private object _animatedValue;
//        private object _coercedValue;
 


    });
    
    Object.defineProperties(ModifiedValue.prototype, {
    	/*internal object */BaseValue:
        { 
            get:function()
            { 
                BaseValueWeakReference wr = this._baseValue instanceof BaseValueWeakReference ? this._baseValue : null;
                return (wr != null) ? wr.Target : this._baseValue;
            },
            set:function(value) { this._baseValue = value; }
        },
 
        /*internal object */ExpressionValue :
        {
            get:function() { return this._expressionValue; } ,
            set:function(value) { this._expressionValue = value; }
        },

        /*internal object */AnimatedValue:
        {
            get:function() { return this._animatedValue; } ,
            set:function(value) { this._animatedValue = value; } 
        },
 
        /*internal object */CoercedValue:
        {
            get:function() { return this._coercedValue; },
            set:function(value) { this._coercedValue = value; } 
        }
    });
	
//	[FriendAccessAllowed] // Built into Base, also used by Core & Framework.
    /*internal struct*/ var EffectiveValueEntry = declare(null, {
//        #region InternalMethods


//
//        internal EffectiveValueEntry(DependencyProperty dp)
//        { 
//            _propertyIndex = (short) dp.GlobalIndex;
//            _value = null; 
//            _source = (FullValueSource) BaseValueSourceInternal.Unknown; 
//        }
// 
//        internal EffectiveValueEntry(DependencyProperty dp, BaseValueSourceInternal valueSource)
//        {
//            _propertyIndex = (short) dp.GlobalIndex;
//            _value = DependencyProperty.UnsetValue; 
//            _source = (FullValueSource) valueSource;
//        } 
// 
//        internal EffectiveValueEntry(DependencyProperty dp, FullValueSource fullValueSource)
//        { 
//            _propertyIndex = (short) dp.GlobalIndex;
//            _value = DependencyProperty.UnsetValue;
//            _source = fullValueSource;
//        } 
        
        constructor:function(){
        	if(arguments.length==1){
        		this._propertyIndex = arguments[0].GlobalIndex;
        		this._value = null; 
        		this._source = (FullValueSource) BaseValueSourceInternal.Unknown; 	
        	}else if(arguments.length==2){
        		this._propertyIndex = arguments[0].GlobalIndex;
        		this._value = DependencyProperty.UnsetValue;
        		this._source = arguments[1].fullValueSource;
        	}
        },

        /*internal void */SetExpressionValue:function(/*object*/ value, /*object*/ baseValue) 
        { 
//            Debug.Assert(value != DependencyProperty.UnsetValue);
 
            /*ModifiedValue*/var modifiedValue = this.EnsureModifiedValue();
            modifiedValue.ExpressionValue = value;
            this.IsExpression = true;
            this.IsDeferredReference = value instanceof DeferredReference; 
//
//            Debug.Assert(Object.Equals(modifiedValue.BaseValue, baseValue)); 
//            Debug.Assert(!(baseValue is DeferredReference)); 
//            Debug.Assert(IsDeferredReference == (value is DeferredReference));
        } ,

        /*internal void */SetAnimatedValue:function(/*object*/ value, /*object*/ baseValue)
        {
//            Debug.Assert((value != DependencyProperty.UnsetValue) && 
//                         !(value is DeferredReference));
 
            /*ModifiedValue*/ var modifiedValue = EnsureModifiedValue(); 
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

        /*internal void */SetCoercedValue:function(/*object*/ value, /*object*/ baseValue, /*bool*/ skipBaseValueChecks, /*bool*/ coerceWithCurrentValue) 
        {
//            Debug.Assert(value != DependencyProperty.UnsetValue && 
//                         !((value is DeferredReference) && !coerceWithCurrentValue)); 

            // if this is already a CoercedWithControlValue entry, we are applying a 
            // second coercion (e.g. from the CoerceValueCallback).  The baseValue
            // passed in is the result of the control-value coercion, but for the
            // purposes of this method we should use the original base value instead.
            if (this.IsCoercedWithCurrentValue) 
            {
                this.baseValue = ModifiedValue.BaseValue; 
            } 

            /*ModifiedValue*/ var modifiedValue = this.EnsureModifiedValue(coerceWithCurrentValue); 
            modifiedValue.CoercedValue = value;
            this.IsCoerced = true;
            this.IsCoercedWithCurrentValue = coerceWithCurrentValue;
 
            // The only CoercedValues that can be deferred are Control values.
            if (coerceWithCurrentValue) 
            { 
                this.IsDeferredReference = (value instanceof DeferredReference);
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
        } ,
 
        /*internal void */ResetAnimatedValue:function()
        { 
            if (this.IsAnimated)
            {
                /*ModifiedValue*/ var modifiedValue = this.ModifiedValue;
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
 
        /*internal void */ResetCoercedValue:function()
        {
            if (this.IsCoerced)
            { 
                /*ModifiedValue*/var modifiedValue = ModifiedValue;
                modifiedValue.CoercedValue = null; 
                this.IsCoerced = false; 

                if (!HasModifiers) 
                {
                	this.Value = modifiedValue.BaseValue;
                }
                else 
                {
                	this.ComputeIsDeferred(); 
                } 
            }
        } ,

        // remove all modifiers, retain value source, and set value to supplied value
        /*internal void */ResetValue:function(/*object*/ value, /*bool*/ hasExpressionMarker)
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
        /*internal void */RestoreExpressionMarker:function()
        {
            if (this.HasModifiers)
            { 
                /*ModifiedValue*/var entry = ModifiedValue;
                entry.ExpressionValue = entry.BaseValue; 
                entry.BaseValue = DependencyObject.ExpressionInAlternativeStore; 
                this._source |= FullValueSource.IsExpression | FullValueSource.HasExpressionMarker;
 
                //recompute the isDeferredReference flag as it may have changed
                this.ComputeIsDeferred();
            }
            else 
            {
                /*object*/var value = Value; 
                this.Value = DependencyObject.ExpressionInAlternativeStore; 
                this.SetExpressionValue(value, DependencyObject.ExpressionInAlternativeStore);
                this._source |= FullValueSource.HasExpressionMarker; 
            }


        } ,

        // Computes and set the IsDeferred hint flag. 
        // This take into account all flags and should only be used sparingly. 
        /*private void */ComputeIsDeferred:function()
        { 
            /*bool*/ var isDeferredReference = false;
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
 


        /*internal EffectiveValueEntry */GetFlattenedEntry:function(/*RequestFlags*/ requests) 
        {
            if ((this._source & (FullValueSource.ModifiersMask | FullValueSource.HasExpressionMarker)) == 0)
            {
                // If the property does not have any modifiers 
                // then just return the base value.
                return this; 
            } 

            if (!this.HasModifiers) 
            {
//                Debug.Assert(HasExpressionMarker);

                // This is the case when some one stuck an expression into 
                // an alternate store such as a style or a template but the
                // new value for the expression has not been evaluated yet. 
                // In the intermediate we need to return the default value 
                // for the property. This problem was manifested in DRTDocumentViewer.
                /*EffectiveValueEntry*/ var unsetEntry = new EffectiveValueEntry(); 
                unsetEntry.BaseValueSourceInternal = BaseValueSourceInternal;
                unsetEntry.PropertyIndex = PropertyIndex;
                return unsetEntry;
            } 

            // else entry has modifiers 
            /*EffectiveValueEntry*/var  entry = new EffectiveValueEntry(); 
            entry.BaseValueSourceInternal = BaseValueSourceInternal;
            entry.PropertyIndex = PropertyIndex; 
            entry.IsDeferredReference = IsDeferredReference;

            // If the property has a modifier return the modified value
//            Debug.Assert(ModifiedValue != null); 

            // outside of DO, we flatten modified value 
            /*ModifiedValue*/var modifiedValue = ModifiedValue; 

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

                /*object*/var expressionValue = modifiedValue.ExpressionValue; 

                entry.Value = expressionValue; 
            } 

//            Debug.Assert(entry.IsDeferredReference == (entry.Value is DeferredReference), "Value and DeferredReference flag should be in [....]; hitting this may mean that it's time to divide the DeferredReference flag into a set of flags, one for each modifier"); 

            return entry;
        },
 
        /*internal void */SetAnimationBaseValue:function(/*object*/ animationBaseValue)
        { 
            if (!this.HasModifiers) 
            {
            	this.Value = animationBaseValue; 
            }
            else
            {
                /*ModifiedValue*/var modifiedValue = ModifiedValue; 

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

        /*internal void */SetCoersionBaseValue:function(/*object*/ coersionBaseValue)
        {
            if (!this.HasModifiers) 
            {
            	this.Value = coersionBaseValue; 
            } 
            else
            { 
                /*ModifiedValue*/var modifiedValue = ModifiedValue;

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
        },
        
         

        /*private ModifiedValue */EnsureModifiedValue:function(/*bool*/ useWeakReferenceForBaseValue/*=false*/) 
        {
            /*ModifiedValue*/ var modifiedValue = null;
            if (this._value == null)
            { 
            	this._value = modifiedValue = new ModifiedValue();
            } 
            else 
            {
                modifiedValue = this._value instanceof ModifiedValue ? this._value : null; 
                if (modifiedValue == null)
                {
                    modifiedValue = new ModifiedValue();
                    modifiedValue.SetBaseValue(this._value, useWeakReferenceForBaseValue); 
                    this._value = modifiedValue;
                } 
            } 
            return modifiedValue;
        } ,

/*        internal void */Clear:function()
        {
			this._propertyIndex = -1; 
            this._value = null;
            this._source = 0; 
        }, 


        /*private void */WritePrivateFlag:function(/*FullValueSource*/ bit, /*bool*/ value) 
        {
            if (value) 
            { 
            	this._source |= bit;
            } 
            else
            {
            	this._source &= ~bit;
            } 
        },
 
        /*private bool */ReadPrivateFlag:function(/*FullValueSource*/ bit) 
        {
            return (this._source & bit) != 0; 
        }

//        #endregion PrivateMethods
// 
//        #region Data
 
//        private object                      _value; 
//        private short                       _propertyIndex;
//        private FullValueSource             _source; 
//
//        #endregion Data
    });
    
    Object.defineProperties(EffectiveValueEntry.prototype, {
    	/*public int */PropertyIndex:
        {
            get:function() { return this._propertyIndex; },
            set:function(value) { this._propertyIndex = /*(short)*/value; } 
        },
 
        /// <summary> 
        ///     If HasModifiers is true then it holds the value
        ///     else it holds the modified value instance 
        /// </summary>
        /*internal object */Value:
        {
            get:function() { return this._value; } ,
            set:function(value) {
            	this._value = value; 
                this.IsDeferredReference = value instanceof DeferredReference; 
//                Debug.Assert(value is DeferredReference == IsDeferredReference);
            } 
        },

        /*internal BaseValueSourceInternal */BaseValueSourceInternal:
        { 
            get:function() { return (BaseValueSourceInternal)(this._source & FullValueSource.ValueSourceMask); },
            set:function(value) { this._source = (this._source & ~FullValueSource.ValueSourceMask) | (FullValueSource)value; } 
        } ,

        /*internal bool */IsDeferredReference :
        {
            get:function()
            {
                // When this flag is true we treat it as a hint rather than a guarantee and update 
                // it if is out of [....]. When the flag is false, however we expect it to guarantee
                // that the value isn't a DeferredReference. 
 
                /*bool*/ var isDeferredReference = this.ReadPrivateFlag(FullValueSource.IsPotentiallyADeferredReference);
                if (isDeferredReference) 
                {
                    // Check if the value is really a deferred reference
                	this.ComputeIsDeferred();
                    isDeferredReference = this.ReadPrivateFlag(FullValueSource.IsPotentiallyADeferredReference); 
                }
 
                return isDeferredReference; 
            },
 
            /*private */set:function(value) { this.WritePrivateFlag(FullValueSource.IsPotentiallyADeferredReference, value); }
        },

        /*internal bool */IsExpression :
        {
            get:function() { return this.ReadPrivateFlag(FullValueSource.IsExpression); } ,
            /*private*/ set:function(value) { this.WritePrivateFlag(FullValueSource.IsExpression, value); } 
        },
 
        /*internal bool */IsAnimated:
        {
            get:function() { return this.ReadPrivateFlag(FullValueSource.IsAnimated); },
            /*private*/ set:function(value) { this.WritePrivateFlag(FullValueSource.IsAnimated, value); } 
        },
 
        /*internal bool */IsCoerced :
        {
            get:function() { return this.ReadPrivateFlag(FullValueSource.IsCoerced); } ,
            /*private*/ set:function(value) { this.WritePrivateFlag(FullValueSource.IsCoerced, value); }
        },

        /*internal bool */HasModifiers :
        {
            get:function() { return (this._source & FullValueSource.ModifiersMask) != 0; } 
        }, 

        /*internal FullValueSource */FullValueSource :
        {
            get:function() { return this._source; }
        },
 

        /*internal bool */HasExpressionMarker:
        { 
            get:function() { return this.ReadPrivateFlag(FullValueSource.HasExpressionMarker); },
            set:function(value) { this.WritePrivateFlag(FullValueSource.HasExpressionMarker, value); } 
        },

        /*internal bool */IsCoercedWithCurrentValue:
        { 
            get:function() { return this.ReadPrivateFlag(FullValueSource.IsCoercedWithCurrentValue); },
            set:function(value) { this.WritePrivateFlag(FullValueSource.IsCoercedWithCurrentValue, value); } 
        } ,

        /*internal object */LocalValue:
        {
            get:function() 
            {
                if (BaseValueSourceInternal == BaseValueSourceInternal.Local) 
                { 
                    if (!this.HasModifiers)
                    { 
//                        Debug.Assert(Value != DependencyProperty.UnsetValue);
                        return this.Value;
                    }
                    else 
                    {
//                        Debug.Assert(ModifiedValue != null && ModifiedValue.BaseValue != DependencyProperty.UnsetValue); 
                        return this.ModifiedValue.BaseValue; 
                    }
                } 
                else
                {
                    return DependencyProperty.UnsetValue;
                } 
            },
 
            set:function(value) 
            {
//                Debug.Assert(BaseValueSourceInternal == BaseValueSourceInternal.Local, "This can happen only on an entry already having a local value"); 

                if (!this.HasModifiers)
                {
//                    Debug.Assert(Value != DependencyProperty.UnsetValue); 
                	this.Value = value;
                } 
                else 
                {
//                    Debug.Assert(ModifiedValue != null && ModifiedValue.BaseValue != DependencyProperty.UnsetValue); 
                	this.ModifiedValue.BaseValue = value;
                }
            }
        } ,

        /*internal ModifiedValue */ModifiedValue:
        { 
            get:function()
            { 
                if (_value != null)
                {
                    return _value instanceof ModifiedValue ? this._value : null;
                } 
                return null;
            } 
        }
    });
    
//  internal static EffectiveValueEntry CreateDefaultValueEntry(DependencyProperty dp, object value) 
    EffectiveValueEntry.CreateDefaultValueEntry=function(dp, value) 
	{
		/*EffectiveValueEntry*/var entry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Default); 
		entry.Value = value; 
		return entry;
	
	}
 

    return EffectiveValueEntry;
   
    

});


 
