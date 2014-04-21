package org.summer.view.widget;

import org.summer.view.widget.DependencyObject.RequestFlags;

//[FriendAccessAllowed] // Built into Base, also used by Core & Framework.
/*internal*/public class EffectiveValueEntry 
{
//    #region InternalMethods

    /*internal*/ static EffectiveValueEntry CreateDefaultValueEntry(DependencyProperty dp, Object value) 
    {
        EffectiveValueEntry entry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Default); 
        entry.Value = value; 
        return entry;

    }

    /*internal*/ EffectiveValueEntry(DependencyProperty dp)
    { 
        _propertyIndex = (short) dp.GlobalIndex;
        _value = null; 
        _source = (FullValueSource) BaseValueSourceInternal.Unknown; 
    }

    /*internal*/ EffectiveValueEntry(DependencyProperty dp, BaseValueSourceInternal valueSource)
    {
        _propertyIndex = (short) dp.GlobalIndex;
        _value = DependencyProperty.UnsetValue; 
        _source = (FullValueSource) valueSource;
    } 

    /*internal*/ EffectiveValueEntry(DependencyProperty dp, FullValueSource fullValueSource)
    { 
        _propertyIndex = (short) dp.GlobalIndex;
        _value = DependencyProperty.UnsetValue;
        _source = fullValueSource;
    } 

    /*internal*/ public EffectiveValueEntry() {
		// TODO Auto-generated constructor stub
	}

	void SetExpressionValue(Object value, Object baseValue) 
    { 
//        Debug.Assert(value != DependencyProperty.UnsetValue);

        ModifiedValue modifiedValue = EnsureModifiedValue(false);
        modifiedValue.ExpressionValue = value;
        IsExpression = true;
        IsDeferredReference = value instanceof DeferredReference; 

//        Debug.Assert(Object.Equals(modifiedValue.BaseValue, baseValue)); 
//        Debug.Assert(!(baseValue is DeferredReference)); 
//        Debug.Assert(IsDeferredReference == (value is DeferredReference));
    } 

    /*internal*/public void SetAnimatedValue(Object value, Object baseValue)
    {
//        Debug.Assert((value != DependencyProperty.UnsetValue) && 
//                     !(value is DeferredReference));

        ModifiedValue modifiedValue = EnsureModifiedValue(false); 
        modifiedValue.AnimatedValue = value;
        IsAnimated = true; 

        // Animated values should never be deferred
        IsDeferredReference = false;

//        Debug.Assert(!(modifiedValue.AnimatedValue is DeferredReference));
//        Debug.Assert(Object.Equals(modifiedValue.BaseValue, baseValue) || 
//                     Object.Equals(modifiedValue.ExpressionValue, baseValue)); 
//        Debug.Assert(!(baseValue is DeferredReference) &&
//                     ! (modifiedValue.BaseValue is DeferredReference) && 
//                     ! (modifiedValue.ExpressionValue is DeferredReference));
    }

    /*internal*/public void SetCoercedValue(Object value, Object baseValue, boolean skipBaseValueChecks, boolean coerceWithCurrentValue) 
    {
//        Debug.Assert(value != DependencyProperty.UnsetValue && 
//                     !((value is DeferredReference) && !coerceWithCurrentValue)); 

        // if this is already a CoercedWithControlValue entry, we are applying a 
        // second coercion (e.g. from the CoerceValueCallback).  The baseValue
        // passed in is the result of the control-value coercion, but for the
        // purposes of this method we should use the original base value instead.
        if (IsCoercedWithCurrentValue) 
        {
            baseValue = ModifiedValue.BaseValue; 
        } 

        ModifiedValue modifiedValue = EnsureModifiedValue(coerceWithCurrentValue); 
        modifiedValue.CoercedValue = value;
        IsCoerced = true;
        IsCoercedWithCurrentValue = coerceWithCurrentValue;

        // The only CoercedValues that can be deferred are Control values.
        if (coerceWithCurrentValue) 
        { 
            IsDeferredReference = (value instanceof DeferredReference);
        } 
        else
        {
            IsDeferredReference = false;
        } 


//        Debug.Assert(skipBaseValueChecks || 
//                     Object.Equals(modifiedValue.BaseValue, baseValue) ||
//                     Object.Equals(modifiedValue.ExpressionValue, baseValue) || 
//                     Object.Equals(modifiedValue.AnimatedValue, baseValue));
//        Debug.Assert(!(baseValue is DeferredReference) &&
//                     ! (modifiedValue.BaseValue is DeferredReference) &&
//                     ! (modifiedValue.ExpressionValue is DeferredReference) && 
//                     ! (modifiedValue.AnimatedValue is DeferredReference));
    } 

    /*internal*/public void ResetAnimatedValue()
    { 
        if (IsAnimated)
        {
            ModifiedValue modifiedValue = ModifiedValue;
            modifiedValue.AnimatedValue = null; 
            IsAnimated = false;

            if (!HasModifiers) 
            {
                Value = modifiedValue.BaseValue; 
            }
            else
            {
                // The setter takes care of the IsDeferred flag no need to compute it twice. 
                ComputeIsDeferred();
            } 
        } 
    }

    /*internal*/public void ResetCoercedValue()
    {
        if (IsCoerced)
        { 
            ModifiedValue modifiedValue = ModifiedValue;
            modifiedValue.CoercedValue = null; 
            IsCoerced = false; 

            if (!HasModifiers) 
            {
                Value = modifiedValue.BaseValue;
            }
            else 
            {
                ComputeIsDeferred(); 
            } 
        }
    } 

    // remove all modifiers, retain value source, and set value to supplied value
    /*internal*/public void ResetValue(Object value, boolean hasExpressionMarker)
    { 
        _source &= FullValueSource.ValueSourceMask;
        _value = value; 
        if (hasExpressionMarker) 
        {
            HasExpressionMarker = true; 
        }
        else
        {
            ComputeIsDeferred(); 
        }
//        Debug.Assert(hasExpressionMarker == (value == DependencyObject.ExpressionInAlternativeStore), "hasExpressionMarker flag must match value"); 
    } 

    // add an expression marker back as the base value for an expression value 
    /*internal*/public void RestoreExpressionMarker()
    {
        if (HasModifiers)
        { 
            ModifiedValue entry = ModifiedValue;
            entry.ExpressionValue = entry.BaseValue; 
            entry.BaseValue = DependencyObject.ExpressionInAlternativeStore; 
            _source |= FullValueSource.IsExpression | FullValueSource.HasExpressionMarker;

            //recompute the isDeferredReference flag as it may have changed
            ComputeIsDeferred();
        }
        else 
        {
            Object value = Value; 
            Value = DependencyObject.ExpressionInAlternativeStore; 
            SetExpressionValue(value, DependencyObject.ExpressionInAlternativeStore);
            _source |= FullValueSource.HasExpressionMarker; 
        }


    } 

    // Computes and set the IsDeferred hint flag. 
    // This take into account all flags and should only be used sparingly. 
    private void ComputeIsDeferred()
    { 
        boolean isDeferredReference = false;
        if (!HasModifiers)
        {
            isDeferredReference = Value instanceof DeferredReference; 
        }
        else if (ModifiedValue != null) 
        { 
            if (IsCoercedWithCurrentValue)
            { 
                isDeferredReference = ModifiedValue.CoercedValue instanceof DeferredReference;
            }
            else if (IsExpression)
            { 
                isDeferredReference = ModifiedValue.ExpressionValue instanceof DeferredReference;
            } 

            // For animated values isDeferred will always be false.
        } 

        IsDeferredReference = isDeferredReference;
    }


//    #endregion InternalMethods 

//    #region InternalProperties

    public int PropertyIndex
    {
        get { return _propertyIndex; }
        set { _propertyIndex = (short)value; } 
    }

    /// <summary> 
    ///     If HasModifiers is true then it holds the value
    ///     else it holds the modified value instance 
    /// </summary>
    /*internal*/ public Object Value
    {
        get { return _value; } 
        set {
            _value = value; 
            IsDeferredReference = value instanceof DeferredReference; 
//            Debug.Assert(value is DeferredReference == IsDeferredReference);
        } 
    }

    /*internal*/ public BaseValueSourceInternal BaseValueSourceInternal
    { 
        get { return (BaseValueSourceInternal)(_source & FullValueSource.ValueSourceMask); }
        set { _source = (_source & ~FullValueSource.ValueSourceMask) | (FullValueSource)value; } 
    } 

    /*internal*/ public boolean IsDeferredReference 
    {
        get
        {
            // When this flag is true we treat it as a hint rather than a guarantee and update 
            // it if is out of [....]. When the flag is false, however we expect it to guarantee
            // that the value isn't a DeferredReference. 

            boolean isDeferredReference = ReadPrivateFlag(FullValueSource.IsPotentiallyADeferredReference);
            if (isDeferredReference) 
            {
                // Check if the value is really a deferred reference
                ComputeIsDeferred();
                isDeferredReference = ReadPrivateFlag(FullValueSource.IsPotentiallyADeferredReference); 
            }

            return isDeferredReference; 
        }

        private set { WritePrivateFlag(FullValueSource.IsPotentiallyADeferredReference, value); }
    }

    /*internal*/ public boolean IsExpression 
    {
        get { return ReadPrivateFlag(FullValueSource.IsExpression); } 
        private set { WritePrivateFlag(FullValueSource.IsExpression, value); } 
    }

    /*internal*/ boolean IsAnimated
    {
        get { return ReadPrivateFlag(FullValueSource.IsAnimated); }
        private set { WritePrivateFlag(FullValueSource.IsAnimated, value); } 
    }

    /*internal*/ boolean IsCoerced 
    {
        get { return ReadPrivateFlag(FullValueSource.IsCoerced); } 
        private set { WritePrivateFlag(FullValueSource.IsCoerced, value); }
    }

    /*internal*/ public boolean HasModifiers 
    {
        get { return (_source & FullValueSource.ModifiersMask) != 0; } 
    } 

    /*internal*/public FullValueSource FullValueSource 
    {
        get { return _source; }
    }


    /*internal*/public boolean HasExpressionMarker 
    { 
        get { return ReadPrivateFlag(FullValueSource.HasExpressionMarker); }
        set { WritePrivateFlag(FullValueSource.HasExpressionMarker, value); } 
    }

    /*internal*/ public boolean IsCoercedWithCurrentValue
    { 
        get { return ReadPrivateFlag(FullValueSource.IsCoercedWithCurrentValue); }
        set { WritePrivateFlag(FullValueSource.IsCoercedWithCurrentValue, value); } 
    } 

    /*internal*/ public EffectiveValueEntry GetFlattenedEntry(RequestFlags requests) 
    {
        if ((_source & (FullValueSource.ModifiersMask | FullValueSource.HasExpressionMarker)) == 0)
        {
            // If the property does not have any modifiers 
            // then just return the base value.
            return this; 
        } 

        if (!HasModifiers) 
        {
//            Debug.Assert(HasExpressionMarker);

            // This is the case when some one stuck an expression into 
            // an alternate store such as a style or a template but the
            // new value for the expression has not been evaluated yet. 
            // In the intermediate we need to return the default value 
            // for the property. This problem was manifested in DRTDocumentViewer.
            EffectiveValueEntry unsetEntry = new EffectiveValueEntry(); 
            unsetEntry.BaseValueSourceInternal = BaseValueSourceInternal;
            unsetEntry.PropertyIndex = PropertyIndex;
            return unsetEntry;
        } 

        // else entry has modifiers 
        EffectiveValueEntry entry = new EffectiveValueEntry(); 
        entry.BaseValueSourceInternal = BaseValueSourceInternal;
        entry.PropertyIndex = PropertyIndex; 
        entry.IsDeferredReference = IsDeferredReference;

        // If the property has a modifier return the modified value
//        Debug.Assert(ModifiedValue != null); 

        // outside of DO, we flatten modified value 
        ModifiedValue modifiedValue = ModifiedValue; 

        // Note that the modified values have an order of precedence 
        // 1. Coerced Value (including Current value)
        // 2. Animated Value
        // 3. Expression Value
        // Also note that we support any arbitrary combinations of these 
        // modifiers and will yet the precedence metioned above.
        if (IsCoerced) 
        { 
            if ((requests & RequestFlags.CoercionBaseValue) == 0)
            { 
                entry.Value = modifiedValue.CoercedValue;
            }
            else
            { 
                // This is the case when CoerceValue tries to query
                // the old base value for the property 
                if (IsCoercedWithCurrentValue) 
                {
                    entry.Value = modifiedValue.CoercedValue; 
                }
                else if (IsAnimated && ((requests & RequestFlags.AnimationBaseValue) == 0))
                {
                    entry.Value = modifiedValue.AnimatedValue; 
                }
                else if (IsExpression) 
                { 
                    entry.Value = modifiedValue.ExpressionValue;
                } 
                else
                {
                    entry.Value = modifiedValue.BaseValue;
                } 
            }
        } 
        else if (IsAnimated) 
        {
            if ((requests & RequestFlags.AnimationBaseValue) == 0) 
            {
                entry.Value = modifiedValue.AnimatedValue;
            }
            else 
            {
                // This is the case when [UI/Content]Element are 
                // requesting the base value of an animation. 
                if (IsExpression)
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
//            Debug.Assert(IsExpression == true);

            Object expressionValue = modifiedValue.ExpressionValue; 

            entry.Value = expressionValue; 
        } 

//        Debug.Assert(entry.IsDeferredReference == (entry.Value is DeferredReference), "Value and DeferredReference flag should be in [....]; hitting this may mean that it's time to divide the DeferredReference flag into a set of flags, one for each modifier"); 

        return entry;
    }

    /*internal*/ void SetAnimationBaseValue(Object animationBaseValue)
    { 
        if (!HasModifiers) 
        {
            Value = animationBaseValue; 
        }
        else
        {
            ModifiedValue modifiedValue = ModifiedValue; 

            if (IsExpression) 
            { 
                modifiedValue.ExpressionValue = animationBaseValue;
            } 
            else
            {
                modifiedValue.BaseValue = animationBaseValue;
            } 

            //the modified value may be a deferred reference so recompute this flag. 
            ComputeIsDeferred(); 
        }
    } 

    /*internal*/ void SetCoersionBaseValue(Object coersionBaseValue)
    {
        if (!HasModifiers) 
        {
            Value = coersionBaseValue; 
        } 
        else
        { 
            ModifiedValue modifiedValue = ModifiedValue;

            if (IsAnimated)
            { 
                modifiedValue.AnimatedValue = coersionBaseValue;
            } 
            else if (IsExpression) 
            {
                modifiedValue.ExpressionValue = coersionBaseValue; 
            }
            else
            {
                modifiedValue.BaseValue = coersionBaseValue; 
            }
            //the modified value may be a deferred reference so recompute this flag. 
            ComputeIsDeferred(); 
        }
    } 

    /*internal*/ Object LocalValue
    {
        get 
        {
            if (BaseValueSourceInternal == BaseValueSourceInternal.Local) 
            { 
                if (!HasModifiers)
                { 
//                    Debug.Assert(Value != DependencyProperty.UnsetValue);
                    return Value;
                }
                else 
                {
//                    Debug.Assert(ModifiedValue != null && ModifiedValue.BaseValue != DependencyProperty.UnsetValue); 
                    return ModifiedValue.BaseValue; 
                }
            } 
            else
            {
                return DependencyProperty.UnsetValue;
            } 
        }

        set 
        {
//            Debug.Assert(BaseValueSourceInternal == BaseValueSourceInternal.Local, "This can happen only on an entry already having a local value"); 

            if (!HasModifiers)
            {
//                Debug.Assert(Value != DependencyProperty.UnsetValue); 
                Value = value;
            } 
            else 
            {
//                Debug.Assert(ModifiedValue != null && ModifiedValue.BaseValue != DependencyProperty.UnsetValue); 
                ModifiedValue.BaseValue = value;
            }
        }
    } 

    /*internal*/ public ModifiedValue ModifiedValue 
    { 
        get
        { 
            if (_value != null)
            {
                return _value as ModifiedValue;
            } 
            return null;
        } 
    } 

    private ModifiedValue EnsureModifiedValue(boolean useWeakReferenceForBaseValue/*=false*/) 
    {
        ModifiedValue modifiedValue = null;
        if (_value == null)
        { 
            _value = modifiedValue = new ModifiedValue();
        } 
        else 
        {
            modifiedValue = _value as ModifiedValue; 
            if (modifiedValue == null)
            {
                modifiedValue = new ModifiedValue();
                modifiedValue.SetBaseValue(_value, useWeakReferenceForBaseValue); 
                _value = modifiedValue;
            } 
        } 
        return modifiedValue;
    } 

    /*internal*/ void Clear()
    {
        _propertyIndex = -1; 
        _value = null;
        _source = 0; 
    } 

//    #endregion InternalProperties 
//
//    #region PrivateMethods

    private void WritePrivateFlag(FullValueSource bit, boolean value) 
    {
        if (value) 
        { 
            _source |= bit;
        } 
        else
        {
            _source &= ~bit;
        } 
    }

    private boolean ReadPrivateFlag(FullValueSource bit) 
    {
        return (_source & bit) != 0; 
    }

//    #endregion PrivateMethods
//
//    #region Data

    private Object                      _value; 
    private short                       _propertyIndex;
    private FullValueSource             _source; 

//    #endregion Data
}

