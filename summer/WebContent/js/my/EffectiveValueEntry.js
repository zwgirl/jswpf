/**
 * EffectiveValueEntry.js
 */

define(["dojo/_base/declare", "windows/DependencyProperty",
        "windows/FullValueSource", "windows/BaseValueSourceInternal",
        "windows/DependencyObject", "windows/DeferredReference",
        "windows/RequestFlags"], 
        function(declare, DependencyProperty,
        		FullValueSource, BaseValueSourceInternal,
        		DependencyObject ,DeferredReference,
        		RequestFlags){
	
 
	
	var ModifiedValue= declare(null, {
		constructor : function() {
		},
		SetBaseValue : function(/* object */value, /* bool */ useWeakReference) {
//			_baseValue = (useWeakReference && !value.GetType().IsValueType) ? new BaseValueWeakReference(
//					value)
//					: value;
			this._baseValue=value;
		}
	});
	
	Object.defineProperties(ModifiedValue.prototype, {
	
	    BaseValue:
	        { 
	            get:function()
	            { 
	                return this._baseValue;
	            },
	            set:function(value) { this._baseValue = value; } 
	        },
	 
	   ExpressionValue:
	        {
	            get:function() { return this._expressionValue; },
	            set:function(value){ this._expressionValue = value; }
	        },

	   AnimatedValue:
	        {
	            get:function(){ return this._animatedValue; },
	            set:function(value) { this._animatedValue = value; } 
	        },
	 
	  CoercedValue:
	        {
	            get:function() { return this._coercedValue; },
	            set:function(value) { this._coercedValue = value; } 
	        }
	 
	});

	
	var EffectiveValueEntry= declare(null, {
        constructor:function(/*DependencyProperty*/ dp, /*BaseValueSourceInternal*/ valueSource)
        {
        	if(arguments.length==0){
        		
        	}
        	else if(arguments.length==1){
        		this._propertyIndex = dp.GlobalIndex;
                this._value = null; 
                this._source = BaseValueSourceInternal.Unknown; 	
        	}else{
                this._propertyIndex = dp.GlobalIndex;
                this._value = DependencyProperty.UnsetValue;
                this._source = valueSource; 
        	}
        },


        SetExpressionValue:function(/*object*/ value, /*object*/ baseValue) 
        { 
//            Debug.Assert(value != DependencyProperty.UnsetValue);
 
            var modifiedValue = this.EnsureModifiedValue();
            modifiedValue.ExpressionValue = value;
            this.IsExpression = true;
            this.IsDeferredReference = value instanceof DeferredReference; 

//            Debug.Assert(Object.Equals(modifiedValue.BaseValue, baseValue)); 
//            Debug.Assert(!(baseValue is DeferredReference)); 
//            Debug.Assert(IsDeferredReference == (value is DeferredReference));
        }, 

        SetAnimatedValue:function(/*object*/ value, /*object*/ baseValue)
        {
//            Debug.Assert((value != DependencyProperty.UnsetValue) && 
//                         !(value is DeferredReference));
 
            var modifiedValue = this.EnsureModifiedValue(); 
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

        SetCoercedValue:function(/*object*/ value, /*object*/ baseValue, /*bool*/ skipBaseValueChecks, /*bool*/ coerceWithCurrentValue) 
        {
//            Debug.Assert(value != DependencyProperty.UnsetValue && 
//                         !((value is DeferredReference) && !coerceWithCurrentValue)); 

            // if this is already a CoercedWithControlValue entry, we are applying a 
            // second coercion (e.g. from the CoerceValueCallback).  The baseValue
            // passed in is the result of the control-value coercion, but for the
            // purposes of this method we should use the original base value instead.
            if (this.IsCoercedWithCurrentValue) 
            {
                baseValue = this.ModifiedValue.BaseValue; 
            } 

            var modifiedValue = this.EnsureModifiedValue(coerceWithCurrentValue); 
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
                var modifiedValue = this.ModifiedValue;
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
        ResetValue:function(/*object*/ value, /*bool*/ hasExpressionMarker)
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
        },

        // add an expression marker back as the base value for an expression value 
        RestoreExpressionMarker:function()
        {
            if (this.HasModifiers)
            { 
                var entry = this.ModifiedValue;
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


        },

        // Computes and set the IsDeferred hint flag. 
        // This take into account all flags and should only be used sparingly. 
        ComputeIsDeferred:function()
        { 
            var isDeferredReference = false;
            if (!this.HasModifiers)
            {
                isDeferredReference = this.Value instanceof DeferredReference; 
            }
            else if (this.ModifiedValue != null) 
            { 
                if (this.IsCoercedWithCurrentValue)
                { 
                    isDeferredReference = this.ModifiedValue.CoercedValue instanceof DeferredReference;
                }
                else if (this.IsExpression)
                { 
                    isDeferredReference = this.ModifiedValue.ExpressionValue instanceof DeferredReference;
                } 
 
                // For animated values isDeferred will always be false.
            } 

            this.IsDeferredReference = isDeferredReference;
        },
 

        EnsureModifiedValue:function(/*bool*/ useWeakReferenceForBaseValue/*=false*/) 
        {
        	if(useWeakReferenceForBaseValue===undefined){
        		var useWeakReferenceForBaseValue=false;
        	}
        	
            var modifiedValue = null;
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
        },

        Clear:function()
        {
            this._propertyIndex = -1; 
            this._value = null;
            this._source = 0; 
        },


        WritePrivateFlag:function(/*FullValueSource*/ bit, /*bool*/ value) 
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
 
        ReadPrivateFlag:function(/*FullValueSource*/ bit) 
        {
            return (this._source & bit) != 0; 
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
            var modifiedValue = this.ModifiedValue; 

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
 
        SetAnimationBaseValue:function(/*object*/ animationBaseValue)
        { 
            if (!this.HasModifiers) 
            {
            	this.Value = animationBaseValue; 
            }
            else
            {
                var modifiedValue = this.ModifiedValue; 

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
        },

        SetCoersionBaseValue:function(/*object*/ coersionBaseValue)
        {
            if (!this.HasModifiers) 
            {
                this.Value = coersionBaseValue; 
            } 
            else
            { 
                var modifiedValue = this.ModifiedValue;

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
        } 


	});

	
    /*internal static */EffectiveValueEntry.CreateDefaultValueEntry=function(/*DependencyProperty*/ dp, /*object*/ value) 
    {
        var entry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Default); 
        entry.Value = value; 
        return entry;

    };

    Object.defineProperties(EffectiveValueEntry.prototype, {
        PropertyIndex:
        {
            get:function() { return this._propertyIndex; },
            set:function(value) { this._propertyIndex = value; } 
        },
 
        /// <summary> 
        ///     If HasModifiers is true then it holds the value
        ///     else it holds the modified value instance 
        /// </summary>
        Value:
        {
            get:function() { return this._value; }, 
            set:function(value) {
            	this._value = value; 
                this.IsDeferredReference = value instanceof DeferredReference; 
//                Debug.Assert(value is DeferredReference == IsDeferredReference);
            } 
        },

        BaseValueSourceInternal:
        { 
            get:function() { return this._source & FullValueSource.ValueSourceMask; },
            set:function(value) { this._source = (this._source & ~FullValueSource.ValueSourceMask) | value; } 
        }, 

        IsDeferredReference: 
        {
            get:function()
            {
                // When this flag is true we treat it as a hint rather than a guarantee and update 
                // it if is out of [....]. When the flag is false, however we expect it to guarantee
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
 
            /*private*/ set:function(value) { this.WritePrivateFlag(FullValueSource.IsPotentiallyADeferredReference, value); }
        },

        IsExpression: 
        {
            get:function() { return this.ReadPrivateFlag(FullValueSource.IsExpression); }, 
            /*private*/ set:function(value) { this.WritePrivateFlag(FullValueSource.IsExpression, value); } 
        },
 
        IsAnimated:
        {
            get:function() { return this.ReadPrivateFlag(FullValueSource.IsAnimated); },
            /*private*/ set:function(value) { this.WritePrivateFlag(FullValueSource.IsAnimated, value); } 
        },
 
        intIsCoerced: 
        {
            get:function() { return this.ReadPrivateFlag(FullValueSource.IsCoerced); }, 
            /*private*/ set:function(value) { this.WritePrivateFlag(FullValueSource.IsCoerced, value); }
        },

        HasModifiers: 
        {
            get:function() { return (this._source & FullValueSource.ModifiersMask) != 0; } 
        }, 

        FullValueSource :
        {
            get:function() { return this._source; }
        },
 

        HasExpressionMarker: 
        { 
            get:function() { return this.ReadPrivateFlag(FullValueSource.HasExpressionMarker); },
            set:function(value) { this.WritePrivateFlag(FullValueSource.HasExpressionMarker, value); } 
        },

        IsCoercedWithCurrentValue:
        { 
            get:function() { return this.ReadPrivateFlag(FullValueSource.IsCoercedWithCurrentValue); },
            set:function(value) { this.WritePrivateFlag(FullValueSource.IsCoercedWithCurrentValue, value); } 
        },
        
        /*internal object */LocalValue:
        {
            get:function() 
            {
                if (this.BaseValueSourceInternal == BaseValueSourceInternal.Local) 
                { 
                    if (!this.HasModifiers)
                    { 
                        return this.Value;
                    }
                    else 
                    {
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
                if (!this.HasModifiers)
                {
                	this.Value = value;
                } 
                else 
                {
                	this.ModifiedValue.BaseValue = value;
                }
            }
        },

        ModifiedValue: 
        { 
            get:function()
            { 
                if (this._value != null)
                {
                    return this._value instanceof ModifiedValue ? this._value : null;
                } 
                return null;
            } 
        } 

    });
	
	return EffectiveValueEntry;
});
	

///****************************************************************************\ 
//*
//* File: EffectiveValueEntry.cs
//*
//*  This file describes an entry in the EffectiveValues list held by a 
//*  DependencyObject.
//* 
//* Copyright (C) 2005 by Microsoft Corporation.  All rights reserved. 
//*
//\***************************************************************************/ 
//
//using MS.Internal.WindowsBase;  // FriendAccessAllowed
//using System.Collections;       // IDictionary
//using System.Diagnostics;       // Debug.Assert 
//
//namespace System.Windows 
//{ 
//    [FriendAccessAllowed] // Built into Base, also used by Core & Framework.
//    internal struct EffectiveValueEntry 
//    {
//        #region InternalMethods
//
//        internal static EffectiveValueEntry CreateDefaultValueEntry(DependencyProperty dp, object value) 
//        {
//            EffectiveValueEntry entry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Default); 
//            entry.Value = value; 
//            return entry;
// 
//        }
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
//
//        internal void SetExpressionValue(object value, object baseValue) 
//        { 
//            Debug.Assert(value != DependencyProperty.UnsetValue);
// 
//            ModifiedValue modifiedValue = EnsureModifiedValue();
//            modifiedValue.ExpressionValue = value;
//            IsExpression = true;
//            IsDeferredReference = value is DeferredReference; 
//
//            Debug.Assert(Object.Equals(modifiedValue.BaseValue, baseValue)); 
//            Debug.Assert(!(baseValue is DeferredReference)); 
//            Debug.Assert(IsDeferredReference == (value is DeferredReference));
//        } 
//
//        internal void SetAnimatedValue(object value, object baseValue)
//        {
//            Debug.Assert((value != DependencyProperty.UnsetValue) && 
//                         !(value is DeferredReference));
// 
//            ModifiedValue modifiedValue = EnsureModifiedValue(); 
//            modifiedValue.AnimatedValue = value;
//            IsAnimated = true; 
//
//            // Animated values should never be deferred
//            IsDeferredReference = false;
// 
//            Debug.Assert(!(modifiedValue.AnimatedValue is DeferredReference));
//            Debug.Assert(Object.Equals(modifiedValue.BaseValue, baseValue) || 
//                         Object.Equals(modifiedValue.ExpressionValue, baseValue)); 
//            Debug.Assert(!(baseValue is DeferredReference) &&
//                         ! (modifiedValue.BaseValue is DeferredReference) && 
//                         ! (modifiedValue.ExpressionValue is DeferredReference));
//        }
//
//        internal void SetCoercedValue(object value, object baseValue, bool skipBaseValueChecks, bool coerceWithCurrentValue) 
//        {
//            Debug.Assert(value != DependencyProperty.UnsetValue && 
//                         !((value is DeferredReference) && !coerceWithCurrentValue)); 
//
//            // if this is already a CoercedWithControlValue entry, we are applying a 
//            // second coercion (e.g. from the CoerceValueCallback).  The baseValue
//            // passed in is the result of the control-value coercion, but for the
//            // purposes of this method we should use the original base value instead.
//            if (IsCoercedWithCurrentValue) 
//            {
//                baseValue = ModifiedValue.BaseValue; 
//            } 
//
//            ModifiedValue modifiedValue = EnsureModifiedValue(coerceWithCurrentValue); 
//            modifiedValue.CoercedValue = value;
//            IsCoerced = true;
//            IsCoercedWithCurrentValue = coerceWithCurrentValue;
// 
//            // The only CoercedValues that can be deferred are Control values.
//            if (coerceWithCurrentValue) 
//            { 
//                IsDeferredReference = (value is DeferredReference);
//            } 
//            else
//            {
//                IsDeferredReference = false;
//            } 
//
// 
//            Debug.Assert(skipBaseValueChecks || 
//                         Object.Equals(modifiedValue.BaseValue, baseValue) ||
//                         Object.Equals(modifiedValue.ExpressionValue, baseValue) || 
//                         Object.Equals(modifiedValue.AnimatedValue, baseValue));
//            Debug.Assert(!(baseValue is DeferredReference) &&
//                         ! (modifiedValue.BaseValue is DeferredReference) &&
//                         ! (modifiedValue.ExpressionValue is DeferredReference) && 
//                         ! (modifiedValue.AnimatedValue is DeferredReference));
//        } 
// 
//        internal void ResetAnimatedValue()
//        { 
//            if (IsAnimated)
//            {
//                ModifiedValue modifiedValue = ModifiedValue;
//                modifiedValue.AnimatedValue = null; 
//                IsAnimated = false;
// 
//                if (!HasModifiers) 
//                {
//                    Value = modifiedValue.BaseValue; 
//                }
//                else
//                {
//                    // The setter takes care of the IsDeferred flag no need to compute it twice. 
//                    ComputeIsDeferred();
//                } 
//            } 
//        }
// 
//        internal void ResetCoercedValue()
//        {
//            if (IsCoerced)
//            { 
//                ModifiedValue modifiedValue = ModifiedValue;
//                modifiedValue.CoercedValue = null; 
//                IsCoerced = false; 
//
//                if (!HasModifiers) 
//                {
//                    Value = modifiedValue.BaseValue;
//                }
//                else 
//                {
//                    ComputeIsDeferred(); 
//                } 
//            }
//        } 
//
//        // remove all modifiers, retain value source, and set value to supplied value
//        internal void ResetValue(object value, bool hasExpressionMarker)
//        { 
//            _source &= FullValueSource.ValueSourceMask;
//            _value = value; 
//            if (hasExpressionMarker) 
//            {
//                HasExpressionMarker = true; 
//            }
//            else
//            {
//                ComputeIsDeferred(); 
//            }
//            Debug.Assert(hasExpressionMarker == (value == DependencyObject.ExpressionInAlternativeStore), "hasExpressionMarker flag must match value"); 
//        } 
//
//        // add an expression marker back as the base value for an expression value 
//        internal void RestoreExpressionMarker()
//        {
//            if (HasModifiers)
//            { 
//                ModifiedValue entry = ModifiedValue;
//                entry.ExpressionValue = entry.BaseValue; 
//                entry.BaseValue = DependencyObject.ExpressionInAlternativeStore; 
//                _source |= FullValueSource.IsExpression | FullValueSource.HasExpressionMarker;
// 
//                //recompute the isDeferredReference flag as it may have changed
//                ComputeIsDeferred();
//            }
//            else 
//            {
//                object value = Value; 
//                Value = DependencyObject.ExpressionInAlternativeStore; 
//                SetExpressionValue(value, DependencyObject.ExpressionInAlternativeStore);
//                _source |= FullValueSource.HasExpressionMarker; 
//            }
//
//
//        } 
//
//        // Computes and set the IsDeferred hint flag. 
//        // This take into account all flags and should only be used sparingly. 
//        private void ComputeIsDeferred()
//        { 
//            bool isDeferredReference = false;
//            if (!HasModifiers)
//            {
//                isDeferredReference = Value is DeferredReference; 
//            }
//            else if (ModifiedValue != null) 
//            { 
//                if (IsCoercedWithCurrentValue)
//                { 
//                    isDeferredReference = ModifiedValue.CoercedValue is DeferredReference;
//                }
//                else if (IsExpression)
//                { 
//                    isDeferredReference = ModifiedValue.ExpressionValue is DeferredReference;
//                } 
// 
//                // For animated values isDeferred will always be false.
//            } 
//
//            IsDeferredReference = isDeferredReference;
//        }
// 
//
//        #endregion InternalMethods 
// 
//        #region InternalProperties
// 
//        public int PropertyIndex
//        {
//            get { return _propertyIndex; }
//            set { _propertyIndex = (short)value; } 
//        }
// 
//        /// <summary> 
//        ///     If HasModifiers is true then it holds the value
//        ///     else it holds the modified value instance 
//        /// </summary>
//        internal object Value
//        {
//            get { return _value; } 
//            set {
//                _value = value; 
//                IsDeferredReference = value is DeferredReference; 
//                Debug.Assert(value is DeferredReference == IsDeferredReference);
//            } 
//        }
//
//        internal BaseValueSourceInternal BaseValueSourceInternal
//        { 
//            get { return (BaseValueSourceInternal)(_source & FullValueSource.ValueSourceMask); }
//            set { _source = (_source & ~FullValueSource.ValueSourceMask) | (FullValueSource)value; } 
//        } 
//
//        internal bool IsDeferredReference 
//        {
//            get
//            {
//                // When this flag is true we treat it as a hint rather than a guarantee and update 
//                // it if is out of [....]. When the flag is false, however we expect it to guarantee
//                // that the value isn't a DeferredReference. 
// 
//                bool isDeferredReference = ReadPrivateFlag(FullValueSource.IsPotentiallyADeferredReference);
//                if (isDeferredReference) 
//                {
//                    // Check if the value is really a deferred reference
//                    ComputeIsDeferred();
//                    isDeferredReference = ReadPrivateFlag(FullValueSource.IsPotentiallyADeferredReference); 
//                }
// 
//                return isDeferredReference; 
//            }
// 
//            private set { WritePrivateFlag(FullValueSource.IsPotentiallyADeferredReference, value); }
//        }
//
//        internal bool IsExpression 
//        {
//            get { return ReadPrivateFlag(FullValueSource.IsExpression); } 
//            private set { WritePrivateFlag(FullValueSource.IsExpression, value); } 
//        }
// 
//        internal bool IsAnimated
//        {
//            get { return ReadPrivateFlag(FullValueSource.IsAnimated); }
//            private set { WritePrivateFlag(FullValueSource.IsAnimated, value); } 
//        }
// 
//        internal bool IsCoerced 
//        {
//            get { return ReadPrivateFlag(FullValueSource.IsCoerced); } 
//            private set { WritePrivateFlag(FullValueSource.IsCoerced, value); }
//        }
//
//        internal bool HasModifiers 
//        {
//            get { return (_source & FullValueSource.ModifiersMask) != 0; } 
//        } 
//
//        internal FullValueSource FullValueSource 
//        {
//            get { return _source; }
//        }
// 
//
//        internal bool HasExpressionMarker 
//        { 
//            get { return ReadPrivateFlag(FullValueSource.HasExpressionMarker); }
//            set { WritePrivateFlag(FullValueSource.HasExpressionMarker, value); } 
//        }
//
//        internal bool IsCoercedWithCurrentValue
//        { 
//            get { return ReadPrivateFlag(FullValueSource.IsCoercedWithCurrentValue); }
//            set { WritePrivateFlag(FullValueSource.IsCoercedWithCurrentValue, value); } 
//        } 
//
//        internal EffectiveValueEntry GetFlattenedEntry(RequestFlags requests) 
//        {
//            if ((_source & (FullValueSource.ModifiersMask | FullValueSource.HasExpressionMarker)) == 0)
//            {
//                // If the property does not have any modifiers 
//                // then just return the base value.
//                return this; 
//            } 
//
//            if (!HasModifiers) 
//            {
//                Debug.Assert(HasExpressionMarker);
//
//                // This is the case when some one stuck an expression into 
//                // an alternate store such as a style or a template but the
//                // new value for the expression has not been evaluated yet. 
//                // In the intermediate we need to return the default value 
//                // for the property. This problem was manifested in DRTDocumentViewer.
//                EffectiveValueEntry unsetEntry = new EffectiveValueEntry(); 
//                unsetEntry.BaseValueSourceInternal = BaseValueSourceInternal;
//                unsetEntry.PropertyIndex = PropertyIndex;
//                return unsetEntry;
//            } 
//
//            // else entry has modifiers 
//            EffectiveValueEntry entry = new EffectiveValueEntry(); 
//            entry.BaseValueSourceInternal = BaseValueSourceInternal;
//            entry.PropertyIndex = PropertyIndex; 
//            entry.IsDeferredReference = IsDeferredReference;
//
//            // If the property has a modifier return the modified value
//            Debug.Assert(ModifiedValue != null); 
//
//            // outside of DO, we flatten modified value 
//            ModifiedValue modifiedValue = ModifiedValue; 
//
//            // Note that the modified values have an order of precedence 
//            // 1. Coerced Value (including Current value)
//            // 2. Animated Value
//            // 3. Expression Value
//            // Also note that we support any arbitrary combinations of these 
//            // modifiers and will yet the precedence metioned above.
//            if (IsCoerced) 
//            { 
//                if ((requests & RequestFlags.CoercionBaseValue) == 0)
//                { 
//                    entry.Value = modifiedValue.CoercedValue;
//                }
//                else
//                { 
//                    // This is the case when CoerceValue tries to query
//                    // the old base value for the property 
//                    if (IsCoercedWithCurrentValue) 
//                    {
//                        entry.Value = modifiedValue.CoercedValue; 
//                    }
//                    else if (IsAnimated && ((requests & RequestFlags.AnimationBaseValue) == 0))
//                    {
//                        entry.Value = modifiedValue.AnimatedValue; 
//                    }
//                    else if (IsExpression) 
//                    { 
//                        entry.Value = modifiedValue.ExpressionValue;
//                    } 
//                    else
//                    {
//                        entry.Value = modifiedValue.BaseValue;
//                    } 
//                }
//            } 
//            else if (IsAnimated) 
//            {
//                if ((requests & RequestFlags.AnimationBaseValue) == 0) 
//                {
//                    entry.Value = modifiedValue.AnimatedValue;
//                }
//                else 
//                {
//                    // This is the case when [UI/Content]Element are 
//                    // requesting the base value of an animation. 
//                    if (IsExpression)
//                    { 
//                        entry.Value = modifiedValue.ExpressionValue;
//                    }
//                    else
//                    { 
//                        entry.Value = modifiedValue.BaseValue;
//                     } 
//                } 
//            }
//            else 
//            {
//                Debug.Assert(IsExpression == true);
//
//                object expressionValue = modifiedValue.ExpressionValue; 
//
//                entry.Value = expressionValue; 
//            } 
//
//            Debug.Assert(entry.IsDeferredReference == (entry.Value is DeferredReference), "Value and DeferredReference flag should be in [....]; hitting this may mean that it's time to divide the DeferredReference flag into a set of flags, one for each modifier"); 
//
//            return entry;
//        }
// 
//        internal void SetAnimationBaseValue(object animationBaseValue)
//        { 
//            if (!HasModifiers) 
//            {
//                Value = animationBaseValue; 
//            }
//            else
//            {
//                ModifiedValue modifiedValue = ModifiedValue; 
//
//                if (IsExpression) 
//                { 
//                    modifiedValue.ExpressionValue = animationBaseValue;
//                } 
//                else
//                {
//                    modifiedValue.BaseValue = animationBaseValue;
//                } 
//
//                //the modified value may be a deferred reference so recompute this flag. 
//                ComputeIsDeferred(); 
//            }
//        } 
//
//        internal void SetCoersionBaseValue(object coersionBaseValue)
//        {
//            if (!HasModifiers) 
//            {
//                Value = coersionBaseValue; 
//            } 
//            else
//            { 
//                ModifiedValue modifiedValue = ModifiedValue;
//
//                if (IsAnimated)
//                { 
//                    modifiedValue.AnimatedValue = coersionBaseValue;
//                } 
//                else if (IsExpression) 
//                {
//                    modifiedValue.ExpressionValue = coersionBaseValue; 
//                }
//                else
//                {
//                    modifiedValue.BaseValue = coersionBaseValue; 
//                }
//                //the modified value may be a deferred reference so recompute this flag. 
//                ComputeIsDeferred(); 
//            }
//        } 
//
//        internal object LocalValue
//        {
//            get 
//            {
//                if (BaseValueSourceInternal == BaseValueSourceInternal.Local) 
//                { 
//                    if (!HasModifiers)
//                    { 
//                        Debug.Assert(Value != DependencyProperty.UnsetValue);
//                        return Value;
//                    }
//                    else 
//                    {
//                        Debug.Assert(ModifiedValue != null && ModifiedValue.BaseValue != DependencyProperty.UnsetValue); 
//                        return ModifiedValue.BaseValue; 
//                    }
//                } 
//                else
//                {
//                    return DependencyProperty.UnsetValue;
//                } 
//            }
// 
//            set 
//            {
//                Debug.Assert(BaseValueSourceInternal == BaseValueSourceInternal.Local, "This can happen only on an entry already having a local value"); 
//
//                if (!HasModifiers)
//                {
//                    Debug.Assert(Value != DependencyProperty.UnsetValue); 
//                    Value = value;
//                } 
//                else 
//                {
//                    Debug.Assert(ModifiedValue != null && ModifiedValue.BaseValue != DependencyProperty.UnsetValue); 
//                    ModifiedValue.BaseValue = value;
//                }
//            }
//        } 
//
//        internal ModifiedValue ModifiedValue 
//        { 
//            get
//            { 
//                if (_value != null)
//                {
//                    return _value as ModifiedValue;
//                } 
//                return null;
//            } 
//        } 
//
//        private ModifiedValue EnsureModifiedValue(bool useWeakReferenceForBaseValue=false) 
//        {
//            ModifiedValue modifiedValue = null;
//            if (_value == null)
//            { 
//                _value = modifiedValue = new ModifiedValue();
//            } 
//            else 
//            {
//                modifiedValue = _value as ModifiedValue; 
//                if (modifiedValue == null)
//                {
//                    modifiedValue = new ModifiedValue();
//                    modifiedValue.SetBaseValue(_value, useWeakReferenceForBaseValue); 
//                    _value = modifiedValue;
//                } 
//            } 
//            return modifiedValue;
//        } 
//
//        internal void Clear()
//        {
//            _propertyIndex = -1; 
//            _value = null;
//            _source = 0; 
//        } 
//
//        #endregion InternalProperties 
//
//        #region PrivateMethods
//
//        private void WritePrivateFlag(FullValueSource bit, bool value) 
//        {
//            if (value) 
//            { 
//                _source |= bit;
//            } 
//            else
//            {
//                _source &= ~bit;
//            } 
//        }
// 
//        private bool ReadPrivateFlag(FullValueSource bit) 
//        {
//            return (_source & bit) != 0; 
//        }

//        #endregion PrivateMethods
// 
//        #region Data
// 
//        private object                      _value; 
//        private short                       _propertyIndex;
//        private FullValueSource             _source; 
//
//        #endregion Data
//    }
// 
//
//    [FriendAccessAllowed] // Built into Base, also used by Core & Framework. 
//    internal enum FullValueSource : short 
//    {
//        // Bit used to store BaseValueSourceInternal = 0x01 
//        // Bit used to store BaseValueSourceInternal = 0x02
//        // Bit used to store BaseValueSourceInternal = 0x04
//        // Bit used to store BaseValueSourceInternal = 0x08
// 
//        ValueSourceMask     = 0x000F,
//        ModifiersMask       = 0x0070, 
//        IsExpression        = 0x0010, 
//        IsAnimated          = 0x0020,
//        IsCoerced           = 0x0040, 
//        IsPotentiallyADeferredReference = 0x0080,
//        HasExpressionMarker = 0x0100,
//        IsCoercedWithCurrentValue = 0x200,
//    } 
//
//    // Note that these enum values are arranged in the reverse order of 
//    // precendence for these sources. Local value has highest 
//    // precedence and Default value has the least. Note that we do not
//    // store default values in the _effectiveValues cache unless it is 
//    // being coerced/animated.
//    [FriendAccessAllowed] // Built into Base, also used by Core & Framework.
//    internal enum BaseValueSourceInternal : short
//    { 
//        Unknown                 = 0,
//        Default                 = 1, 
//        Inherited               = 2, 
//        ThemeStyle              = 3,
//        ThemeStyleTrigger       = 4, 
//        Style                   = 5,
//        TemplateTrigger         = 6,
//        StyleTrigger            = 7,
//        ImplicitReference       = 8, 
//        ParentTemplate          = 9,
//        ParentTemplateTrigger   = 10, 
//        Local                   = 11, 
//    }
// 
//    [FriendAccessAllowed] // Built into Base, also used by Core & Framework.
//    internal class ModifiedValue
//    {
//        #region InternalProperties 
//
//        internal object BaseValue 
//        { 
//            get
//            { 
//                BaseValueWeakReference wr = _baseValue as BaseValueWeakReference;
//                return (wr != null) ? wr.Target : _baseValue;
//            }
//            set { _baseValue = value; } 
//        }
// 
//        internal object ExpressionValue 
//        {
//            get { return _expressionValue; } 
//            set { _expressionValue = value; }
//        }
//
//        internal object AnimatedValue 
//        {
//            get { return _animatedValue; } 
//            set { _animatedValue = value; } 
//        }
// 
//        internal object CoercedValue
//        {
//            get { return _coercedValue; }
//            set { _coercedValue = value; } 
//        }
// 
//        internal void SetBaseValue(object value, bool useWeakReference) 
//        {
//            _baseValue = (useWeakReference && !value.GetType().IsValueType) 
//                        ? new BaseValueWeakReference(value)
//                        : value;
//        }
// 
//        #endregion InternalProperties
// 
//        #region Data 
//
//        private object _baseValue; 
//        private object _expressionValue;
//        private object _animatedValue;
//        private object _coercedValue;
// 
//        class BaseValueWeakReference : WeakReference
//        { 
//            public BaseValueWeakReference(object target) : base(target) {} 
//        }
// 
//        #endregion Data
//    }
//}