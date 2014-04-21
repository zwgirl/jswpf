package org.summer.view.widget.data;

import java.lang.reflect.Array;

import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.DependencySource;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.Collection;
import org.summer.view.widget.collection.ReadOnlyCollection;
import org.summer.view.widget.controls.FormatException;
import org.summer.view.widget.controls.Validation;
import org.summer.view.widget.controls.ValidationError;
import org.summer.view.widget.controls.ValidationStep;

/// <summary>
///  Describes a collection of BindingExpressions attached to a single property. 
///     The inner BindingExpressions contribute their values to the MultiBindingExpression, 
///     which combines/converts them into a resultant final value.
///     In the reverse direction, the target value is tranlated to 
///     a set of values that are fed back into the inner BindingExpressions.
/// </summary>
public /*sealed*/ class MultiBindingExpression extends BindingExpressionBase implements IDataBindEngineClient
{ 

    //----------------------------------------------------- 
    // 
    //  Constructors
    // 
    //-----------------------------------------------------

    /// <summary> Constructor </summary>
    private MultiBindingExpression(MultiBinding binding, BindingExpressionBase owner) 
    { 
    	super(binding, owner);
        int count = binding.Bindings.Count; 

        // reduce repeated allocations 
        _tempValues = new Object[count];
        _tempTypes = new Type[count];
    }
 
    //------------------------------------------------------
    // 
    //  Interfaces 
    //
    //----------------------------------------------------- 
//
//    void IDataBindEngineClient.TransferValue()
//    {
//        TransferValue(); 
//    }
// 
//    void IDataBindEngineClient.UpdateValue() 
//    {
//        UpdateValue(); 
//    }

//    boolean IDataBindEngineClient.AttachToContext(boolean lastChance)
//    { 
//        AttachToContext(lastChance);
//        return !TransferIsDeferred; 
//    } 
//
//    void IDataBindEngineClient.VerifySourceReference(boolean lastChance) 
//    {
//    }
//
//    void IDataBindEngineClient.OnTargetUpdated() 
//    {
//        OnTargetUpdated(); 
//    } 

    public DependencyObject /*IDataBindEngineClient.*/TargetElement 
    {
        get { return TargetElement; }
    }
 
    //------------------------------------------------------
    // 
    //  Public Properties 
    //
    //------------------------------------------------------ 

    /// <summary> Binding from which this expression was created </summary>
    public MultiBinding ParentMultiBinding { get { return (MultiBinding)ParentBindingBase; } }
 
    /// <summary> List of inner BindingExpression </summary>
    public ReadOnlyCollection<BindingExpressionBase>   BindingExpressions 
    { 
        get { return new ReadOnlyCollection<BindingExpressionBase>(MutableBindingExpressions); }
    } 

    //-----------------------------------------------------
    //
    //  Public Methods 
    //
    //------------------------------------------------------ 
 
    /// <summary> Send the current value back to the source(s) </summary>
    /// <remarks> Does nothing when binding's Mode is not TwoWay or OneWayToSource </remarks> 
    public /*override*/ void UpdateSource()
    {
        // ultimately, what would be better would be to have a status flag that
        // indicates that this MultiBindingExpression has been Detached, as opposed to a 
        // MultiBindingExpression that doesn't have anything in its BindingExpressions collection
        // in the first place.  Added to which, there should be distinct error 
        // messages for both of these error conditions. 
        if (MutableBindingExpressions.Count == 0)
            throw new InvalidOperationException(/*SR.Get(SRID.BindingExpressionIsDetached)*/); 

        NeedsUpdate = true;     // force update
        Update(true);           // update synchronously
    } 

    /// <summary> Force a data transfer from sources to target </summary> 
    /// <remarks> Will transfer data even if binding's Mode is OneWay </remarks> 
    public /*override*/ void UpdateTarget()
    { 
        // ultimately, what would be better would be to have a status flag that
        // indicates that this MultiBindingExpression has been Detached, as opposed to a
        // MultiBindingExpression that doesn't have anything in its BindingExpressions collection
        // in the first place.  Added to which, there should be distinct error 
        // messages for both of these error conditions.
        if (MutableBindingExpressions.Count == 0) 
            throw new InvalidOperationException(/*SR.Get(SRID.BindingExpressionIsDetached)*/); 

        UpdateTarget(true); 
    }

//#region Expression overrides
 
    /// <summary>
    ///     Called to evaluate the Expression value 
    /// </summary> 
    /// <param name="d">DependencyObject being queried</param>
    /// <param name="dp">Property being queried</param> 
    /// <returns>Computed value. Unset if unavailable.</returns>
    /*internal*/ /*override*/ public Object GetValue(DependencyObject d, DependencyProperty dp)
    {
        return Value; 
    }
 
    /// <summary> 
    ///     Allows Expression to store set values
    /// </summary> 
    /// <param name="d">DependencyObject being set</param>
    /// <param name="dp">Property being set</param>
    /// <param name="value">Value being set</param>
    /// <returns>true if Expression handled storing of the value</returns> 
    /*internal*/ /*override*/ public boolean SetValue(DependencyObject d, DependencyProperty dp, Object value)
    { 
            if (IsReflective) 
            {
                Value = value; 
                return true;
            }
            else
            { 
                // if the binding doesn't push values back to the source, allow
                // SetValue to overwrite the binding with a local value 
                return false; 
            }
    } 

//#endregion  Expression overrides

    //----------------------------------------------------- 
    //
    //  Internal Properties 
    // 
    //-----------------------------------------------------
 
    /*internal*/public /*override*/ boolean IsParentBindingUpdateTriggerDefault
    {
        get { return (ParentMultiBinding.UpdateSourceTrigger == UpdateSourceTrigger.Default); }
    } 

    //----------------------------------------------------- 
    // 
    //  Internal Methods
    // 
    //------------------------------------------------------

    // Create a new BindingExpression from the given Binding description
    /*internal*/public static MultiBindingExpression CreateBindingExpression(DependencyObject d, DependencyProperty dp, MultiBinding binding, BindingExpressionBase owner) 
    {
        FrameworkPropertyMetadata fwMetaData = dp.GetMetadata(d.DependencyObjectType) as FrameworkPropertyMetadata; 
 
        if ((fwMetaData != null && !fwMetaData.IsDataBindingAllowed) || dp.ReadOnly)
            throw new ArgumentException(/*SR.Get(SRID.PropertyNotBindable, dp.Name), */"dp"); 

        // create the BindingExpression
        MultiBindingExpression bindExpr = new MultiBindingExpression(binding, owner);
 
        bindExpr.ResolvePropertyDefaultSettings(binding.Mode, binding.UpdateSourceTrigger, fwMetaData);
 
        return bindExpr; 
    }
 
    // Attach to things that may require tree context (parent, root, etc.)
    void AttachToContext(boolean lastChance)
    {
        DependencyObject target = TargetElement; 
        if (target == null)
            return; 
 
//        Debug.Assert(ParentMultiBinding.Converter != null || !String.IsNullOrEmpty(EffectiveStringFormat),
//                "MultiBindingExpression should not exist if its bind does not have a valid converter."); 

//        boolean isExtendedTraceEnabled = TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.AttachToContext);

        _converter = ParentMultiBinding.Converter; 
//        if (_converter == null && String.IsNullOrEmpty(EffectiveStringFormat))
//        { 
//            TraceData.Trace(TraceEventType.Error, TraceData.MultiBindingHasNoConverter, ParentMultiBinding); 
//        }
 
//        if (isExtendedTraceEnabled)
//        {
//            TraceData.Trace(TraceEventType.Warning,
//                                TraceData.AttachToContext( 
//                                    TraceData.Identify(this),
//                                    lastChance ? " (last chance)" : String.Empty)); 
//        } 

        TransferIsDeferred = true; 
        boolean attached = true;       // true if all child bindings have attached
        int count = MutableBindingExpressions.Count;
        for (int i = 0; i < count; ++i)
        { 
            if (MutableBindingExpressions[i].Status == BindingStatus.Unattached)
                attached = false; 
        } 

        // if the child bindings aren't ready yet, try again later.  Leave 
        // TransferIsDeferred set, to indicate we're not ready yet.
        if (!attached && !lastChance)
        {
//            if (isExtendedTraceEnabled) 
//            {
//                TraceData.Trace(TraceEventType.Warning, 
//                                    TraceData.ChildNotAttached( 
//                                        TraceData.Identify(this)));
//            } 

            return;
        }
 
        // initial transfer
        boolean initialTransferIsUpdate = IsOneWayToSource; 
        Object currentValue; 
        if (ShouldUpdateWithCurrentValue(target, /*out*/ currentValue))
        { 
            initialTransferIsUpdate = true;
            ChangeValue(currentValue, /*notify*/false);
            NeedsUpdate = true;
        } 

        SetStatus(BindingStatus.Active); 
 
        if (!initialTransferIsUpdate)
        { 
            UpdateTarget(false);
        }
        else
        { 
            UpdateValue();
        } 
    } 

 
    //-----------------------------------------------------
    //
    //  Public Properties
    // 
    //------------------------------------------------------
 
    /// <summary> 
    ///     The ValidationError that caused this
    ///     BindingExpression to be invalid. 
    /// </summary>
    public /*override*/ ValidationError ValidationError
    {
        get 
        {
            ValidationError validationError = base.ValidationError; 
 
            if (validationError == null)
            { 
                for ( int i = 0; i < MutableBindingExpressions.Count; i++ )
                {
                    validationError = MutableBindingExpressions[i].ValidationError;
                    if (validationError != null) 
                        break;
                } 
            } 

            return validationError; 
        }
    }

    /// <summary> 
    ///     HasError returns true if any of the ValidationRules
    ///     of any of its inner bindings failed its validation rule 
    ///     or the Multi-/PriorityBinding itself has a failing validation rule. 
    /// </summary>
    public /*override*/ boolean HasError 
    {
        get
        {
            boolean hasError = base.HasError; 

            if (!hasError) 
            { 
                for ( int i = 0; i < MutableBindingExpressions.Count; i++ )
                { 
                    if (MutableBindingExpressions[i].HasError)
                        return true;
                }
            } 

            return hasError; 
        } 
    }
 
    //------------------------------------------------------
    //
    //  Protected Internal Methods
    // 
    //-----------------------------------------------------
 
    /// <summary> 
    ///     Attach a BindingExpression to the given target (element, property)
    /// </summary> 
    /// <param name="d">DependencyObject being set</param>
    /// <param name="dp">Property being set</param>
    /*internal*/public /*override*/ boolean AttachOverride(DependencyObject d, DependencyProperty dp)
    { 
        if (!super.AttachOverride(d, dp))
            return false; 
 
        DependencyObject target = TargetElement;
        if (target == null) 
            return false;

        // listen for lost focus
        if (IsUpdateOnLostFocus) 
        {
            LostFocusEventManager.AddListener(target, this); 
        } 

        TransferIsDeferred = true;          // Defer data transfer until after we activate all the BindingExpressions 
        int count = ParentMultiBinding.Bindings.Count;
        for (int i = 0; i < count; ++i)
        {
            // ISSUE: It may be possible to have _attachedBindingExpressions be non-zero 
            // at the end of Detach if the conditions for the increment on Attach
            // and the decrement on Detach are not precisely the same. 
            AttachBindingExpression(i, false); // create new binding and have it added to end 
        }
 
        // attach to things that need tree context.  Do it synchronously
        // if possible, otherwise post a task.  This gives the parser et al.
        // a chance to assemble the tree before we start walking it.
        AttachToContext(false /* lastChance */); 
        if (TransferIsDeferred)
        { 
            Engine.AddTask(this, TaskOps.AttachToContext); 

//            if (TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.AttachToContext)) 
//            {
//                TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.DeferAttachToContext(
//                                        TraceData.Identify(this))); 
//            }
        } 
 
        return true;
    } 

    /// <summary> sever all connections </summary>
    /*internal*/public /*override*/ void DetachOverride()
    { 
        DependencyObject target = TargetElement;
        if (target != null && IsUpdateOnLostFocus) 
        { 
            LostFocusEventManager.RemoveListener(target, this);
        } 

        // Theoretically, we only need to detach number of AttentiveBindingExpressions,
        // but we'll traverse the whole list anyway and do aggressive clean-up.
        int count = MutableBindingExpressions.Count; 

        for (int i = count - 1; i >= 0; i--) 
        { 
            BindingExpressionBase b = MutableBindingExpressions[i];
 
            if (b != null)
            {
                b.Detach();
                MutableBindingExpressions.RemoveAt(i); 
            }
        } 
 
        ChangeSources(null);
 
        super.DetachOverride();
    }

    /// <summary> 
    /// Invalidate the given child expression.
    /// </summary> 
    /*internal*/public /*override*/ void InvalidateChild(BindingExpressionBase bindingExpression) 
    {
        int index = MutableBindingExpressions.IndexOf(bindingExpression); 

        // do a sanity check that we care about this BindingExpression
        if (0 <= index && IsDynamic)
        { 
            NeedsDataTransfer = true;
            Transfer();                 // this will Invalidate target property. 
        } 
    }
 
    /// <summary>
    /// Change the dependency sources for the given child expression.
    /// </summary>
    /*internal*/public /*override*/ void ChangeSourcesForChild(BindingExpressionBase bindingExpression, WeakDependencySource[] newSources) 
    {
        int index = MutableBindingExpressions.IndexOf(bindingExpression); 
 
        if (index >= 0)
        { 
            WeakDependencySource[] combinedSources = CombineSources(index, MutableBindingExpressions, MutableBindingExpressions.Count, newSources);
            ChangeSources(combinedSources);
        }
    } 

    /// <summary> 
    /// Replace the given child expression with a new one. 
    /// </summary>
    /*internal*/public /*override*/ void ReplaceChild(BindingExpressionBase bindingExpression) 
    {
        int index = MutableBindingExpressions.IndexOf(bindingExpression);
        DependencyObject target = TargetElement;
 
        if (index >= 0 && target != null)
        { 
            // detach and clean up the old binding 
            bindingExpression.Detach();
 
            // replace BindingExpression
            AttachBindingExpression(index, true);
        }
    } 

    // register the leaf bindings with the binding group 
    /*internal*/public /*override*/ void UpdateBindingGroup(BindingGroup bg) 
    {
        for (int i=0, n=MutableBindingExpressions.Count-1; i<n; ++i) 
        {
            MutableBindingExpressions[i].UpdateBindingGroup(bg);
        }
    } 

    /// <summary> 
    /// Get the converted proposed value 
    /// <summary>
    /*internal*/public /*override*/ Object ConvertProposedValue(Object value) 
    {
        Object result;
        boolean success = ConvertProposedValueImpl(value, /*out*/ result);
 
        // if the conversion failed, signal a validation error
        if (!success) 
        { 
            result = DependencyProperty.UnsetValue;
            ValidationError validationError = new ValidationError(ConversionValidationRule.Instance, this, SR.Get(SRID.Validation_ConversionFailed, value), null); 
            UpdateValidationError(validationError, false);
        }

        return result; 
    }
 
    private boolean ConvertProposedValueImpl(Object value, /*out*/ Object result) 
    {
        DependencyObject target = TargetElement; 
        if (target == null)
        {
            result = DependencyProperty.UnsetValue;
            return false; 
        }
 
        result = GetValuesForChildBindings(value); 
        if (result == DependencyProperty.UnsetValue)
        { 
            SetStatus(BindingStatus.UpdateSourceError);

            return false;
        } 

        Object[] values = (Object[])result; 
        if (values == null) 
        {
//            if (TraceData.IsEnabled) 
//            {
//                TraceData.Trace(TraceEventType.Error,
//                    TraceData.BadMultiConverterForUpdate(
//                        Converter.GetType().Name, 
//                        AvTrace.ToStringHelper(value),
//                        AvTrace.TypeName(value)), 
//                    this); 
//            }
 
            result = DependencyProperty.UnsetValue;
            return false;
        }
 
//        if (TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.Update))
//        { 
//            for (int i=0; i<values.Length; ++i) 
//            {
//                TraceData.Trace(TraceEventType.Warning, 
//                                    TraceData.UserConvertBackMulti(
//                                        TraceData.Identify(this),
//                                        i,
//                                        TraceData.Identify(values[i]))); 
//            }
//        } 
 
        // if lengths are mismatched, show warning
        int count = MutableBindingExpressions.Count; 
//        if (values.Length != count && TraceData.IsEnabled)
//        {
//            TraceData.Trace(TraceEventType.Information, TraceData.MultiValueConverterMismatch,
//                    Converter.GetType().Name, count, values.Length, 
//                    TraceData.DescribeTarget(target, TargetProperty));
//        } 
 
        // use the smaller count
        if (values.length < count) 
            count = values.length;

        // using the result of ConvertBack as the raw value, run each child binding
        // through the first two steps of the update/validate process 
        boolean success = true;
        for (int i = 0; i < count; ++i) 
        { 
            value = values[i];
 
            if (value != Binding.DoNothing && value != DependencyProperty.UnsetValue)
            {
                BindingExpressionBase bindExpr = MutableBindingExpressions[i];
 
                bindExpr.SetValue(target, TargetProperty, value);   // could pass (null, null, values[i])
 
                value = bindExpr.GetRawProposedValue(); 
                if (!bindExpr.Validate(value, ValidationStep.RawProposedValue))
                    value = DependencyProperty.UnsetValue; 

                value = bindExpr.ConvertProposedValue(value);
            }
            else if (value == DependencyProperty.UnsetValue && TraceData.IsEnabled) 
            {
//                TraceData.Trace(TraceEventType.Information, 
//                    TraceData.UnsetValueInMultiBindingExpressionUpdate( 
//                        Converter.GetType().Name,
//                        AvTrace.ToStringHelper(value), 
//                        i,
//                        _tempTypes[i]
//                    ),
//                    this); 
            }
 
            if (value == DependencyProperty.UnsetValue) 
            {
                success = false; 
            }

            values[i] = value;
        } 

        Array.Clear(_tempTypes, 0, _tempTypes.length); 
        result = values; 
        return success;
    } 

    Object GetValuesForChildBindings(Object rawValue)
    {
        if (Converter == null) 
        {
//            if (TraceData.IsEnabled) 
//            { 
//                TraceData.Trace(TraceEventType.Error, TraceData.MultiValueConverterMissingForUpdate, this);
//            } 

            return DependencyProperty.UnsetValue;
        }
 
        CultureInfo culture = GetCulture();
        int count = MutableBindingExpressions.Count; 
 
        for (int i = 0; i < count; ++i)
        { 
            BindingExpressionBase bindExpr = MutableBindingExpressions[i];
            BindingExpression be = bindExpr as BindingExpression;

            if (be != null && be.UseDefaultValueConverter) 
                _tempTypes[i] = be.ConverterSourceType;
            else 
                _tempTypes[i] = TargetProperty.PropertyType; 
        }
 
        // MultiValueConverters are always user-defined, so don't catch exceptions (bug 992237)
        return Converter.ConvertBack(rawValue, _tempTypes, ParentMultiBinding.ConverterParameter, culture);
    }
 
    /// <summary>
    /// Get the converted proposed value and inform the binding group 
    /// <summary> 
    /*internal*/public /*override*/ boolean ObtainConvertedProposedValue(BindingGroup bindingGroup)
    { 
        boolean result = true;
        if (NeedsUpdate)
        {
            Object value = bindingGroup.GetValue(this); 
            if (value != DependencyProperty.UnsetValue)
            { 
                Object[] values; 
                value = ConvertProposedValue(value);
 
                if (value == DependencyProperty.UnsetValue)
                {
                    result = false;
                } 
                else if ((values = value as Object[]) != null)
                { 
                    for (int i=0; i<values.length; ++i) 
                    {
                        if (values[i] == DependencyProperty.UnsetValue) 
                        {
                            result = false;
                        }
                    } 
                }
            } 
            StoreValueInBindingGroup(value, bindingGroup); 
        }
        else 
        {
            bindingGroup.UseSourceValue(this);
        }
 
        return result;
    } 
 
    /// <summary>
    /// Update the source value 
    /// <summary>
    /*internal*/public /*override*/ Object UpdateSource(Object convertedValue)
    {
        if (convertedValue == DependencyProperty.UnsetValue) 
        {
            SetStatus(BindingStatus.UpdateSourceError); 
            return convertedValue; 
        }
 
        Object[] values = convertedValue as Object[];
        int count = MutableBindingExpressions.Count;
        if (values.length < count)
            count = values.length; 

        BeginSourceUpdate(); 
        for (int i = 0; i < count; ++i) 
        {
            Object value = values[i]; 

            if (value != Binding.DoNothing)
            {
                BindingExpressionBase bindExpr = MutableBindingExpressions[i]; 

                bindExpr.UpdateSource(value); 
 
                if (bindExpr.Status == BindingStatus.UpdateSourceError)
                { 
                    SetStatus(BindingStatus.UpdateSourceError);
                }
            }
        } 

        EndSourceUpdate(); 
 
        OnSourceUpdated();
 
        return convertedValue;
    }

    /// <summary> 
    /// Update the source value and inform the binding group
    /// <summary> 
    /*internal*/public /*override*/ boolean UpdateSource(BindingGroup bindingGroup) 
    {
        boolean result = true; 
        if (NeedsUpdate)
        {
            Object value = bindingGroup.GetValue(this);
            UpdateSource(value); 
            if (value == DependencyProperty.UnsetValue)
            { 
                result = false; 
            }
        } 
        return result;
    }

    /// <summary> 
    /// Store the value in the binding group
    /// </summary> 
    /*internal*/public /*override*/ void StoreValueInBindingGroup(Object value, BindingGroup bindingGroup) 
    {
        bindingGroup.SetValue(this, value); 

        Object[] values = value as Object[];
        if (values != null)
        { 
            int count = MutableBindingExpressions.Count;
            if (values.length < count) 
                count = values.length; 

            for (int i=0; i<count; ++i) 
            {
                MutableBindingExpressions[i].StoreValueInBindingGroup(values[i], bindingGroup);
            }
        } 
        else
        { 
            for (int i=MutableBindingExpressions.Count-1; i>=0; --i) 
            {
                MutableBindingExpressions[i].StoreValueInBindingGroup(DependencyProperty.UnsetValue, bindingGroup); 
            }
        }
    }
 
    /// <summary>
    /// Run validation rules for the given step 
    /// <summary> 
    /*internal*/public /*override*/ boolean Validate(Object value, ValidationStep validationStep)
    { 
        if (value == Binding.DoNothing)
            return true;

        if (value == DependencyProperty.UnsetValue) 
        {
            SetStatus(BindingStatus.UpdateSourceError); 
            return false; 
        }
 
        // run rules attached to this multibinding
        boolean result = base.Validate(value, validationStep);

        // run rules attached to the child bindings 
        switch (validationStep)
        { 
            case ValidationStep.RawProposedValue: 
                // the child bindings don't get raw values until the Convert step
                break; 

            default:
                Object[] values = value as Object[];
                int count = MutableBindingExpressions.Count; 
                if (values.length < count)
                    count = values.length; 
 
                for (int i=0; i<count; ++i)
                { 
                    value = values[i];
                    if (value == DependencyProperty.UnsetValue)
                    {
                        // an unset value means the binding failed validation at an earlier step, 
                        // typically at Raw step, evaluated during the MultiBinding's ConvertValue
 
                        //result = false; 
                        // COMPAT: This should mean the MultiBinding as a whole fails validation, but
                        // in 3.5 this didn't happen.  Instead the process continued, writing back 
                        // values to child bindings that succeeded, and simply not writing back
                        // to child bindings that didn't.
                    }
                    else if (value != Binding.DoNothing) 
                    {
                        if (!MutableBindingExpressions[i].Validate(value, validationStep)) 
                        { 
                            //result = false;
                            // COMPAT: as above, preserve v3.5 behavior by not failing when a 
                            // child binding fails to validate
                        }
                    }
                } 
                break;
        } 
 
        return result;
    } 

    /// <summary>
    /// Run validation rules for the given step, and inform the binding group
    /// <summary> 
    /*internal*/public /*override*/ boolean CheckValidationRules(BindingGroup bindingGroup, ValidationStep validationStep)
    { 
        if (!NeedsValidation) 
            return true;
 
        Object value;
        switch (validationStep)
        {
            case ValidationStep.RawProposedValue: 
            case ValidationStep.ConvertedProposedValue:
            case ValidationStep.UpdatedValue: 
            case ValidationStep.CommittedValue: 
                value = bindingGroup.GetValue(this);
                break; 
            default:
                throw new InvalidOperationException(SR.Get(SRID.ValidationRule_UnknownStep, validationStep, bindingGroup));
        }
 
        boolean result = Validate(value, validationStep);
 
        if (result && validationStep == ValidationStep.CommittedValue) 
        {
            NeedsValidation = false; 
        }

        return result;
    } 

    /// <summary> 
    /// Get the proposed value(s) that would be written to the source(s), applying 
    /// conversion and checking UI-side validation rules.
    /// </summary> 
    /*internal*/public /*override*/ boolean ValidateAndConvertProposedValue(/*out*/ Collection<ProposedValue> values)
    {
//        Debug.Assert(NeedsValidation, "check NeedsValidation before calling this");
        values = null; 

        // validate raw proposed value 
        Object rawValue = GetRawProposedValue(); 
        boolean isValid = Validate(rawValue, ValidationStep.RawProposedValue);
        if (!isValid) 
        {
            return false;
        }
 
        // apply conversion
        Object conversionResult = GetValuesForChildBindings(rawValue); 
        if (conversionResult == DependencyProperty.UnsetValue || conversionResult == null) 
        {
            return false; 
        }

        int count = MutableBindingExpressions.Count;
        Object[] convertedValues = (Object[])conversionResult; 
        if (convertedValues.length < count)
            count = convertedValues.length; 
 
        values = new Collection<ProposedValue>();
        boolean result = true; 

        // validate child bindings
        for (int i = 0; i < count; ++i)
        { 
            Object value = convertedValues[i];
            if (value == Binding.DoNothing) 
            { 
            }
            else if (value == DependencyProperty.UnsetValue) 
            {
                // conversion failure
                result = false;
            } 
            else
            { 
                // send converted value to child binding 
                BindingExpressionBase bindExpr = MutableBindingExpressions[i];
                bindExpr.Value = value; 

                // validate child binding
                if (bindExpr.NeedsValidation)
                { 
                    Collection<ProposedValue> childValues;
                    boolean childResult = bindExpr.ValidateAndConvertProposedValue(/*out*/ childValues); 
 
                    // append child's values to our values
                    if (childValues != null) 
                    {
                        for (int k=0, n=childValues.Count; k<n; ++k)
                        {
                            values.Add(childValues[k]); 
                        }
                    } 
 
                    // merge child's result
                    result = result && childResult; 
                }
            }
        }
 
        return result;
    } 
 

    //------------------------------------------------------ 
    //
    //  Private Properties
    //
    //----------------------------------------------------- 

    /// <summary> 
    /// expose a mutable version of the list of all BindingExpressions; 
    /// derived /*internal*/ classes need to be able to populate this list
    /// </summary> 
    private Collection<BindingExpressionBase> MutableBindingExpressions
    {
        get { return _list; }
    } 

    IMultiValueConverter Converter 
    { 
        get { return _converter; }
        set { _converter = value; } 
    }

    //-----------------------------------------------------
    // 
    //  Private Methods
    // 
    //----------------------------------------------------- 

    // Create a BindingExpression for position i 
    BindingExpressionBase AttachBindingExpression(int i, boolean replaceExisting)
    {
        DependencyObject target = TargetElement;
        if (target == null) 
            return null;
 
        BindingBase binding = ParentMultiBinding.Bindings[i]; 

        // Check if replacement bindings have the correct UpdateSourceTrigger 
        MultiBinding.CheckTrigger(binding);

        BindingExpressionBase bindExpr = binding.CreateBindingExpression(target, TargetProperty, this);
        if (replaceExisting) // replace exisiting or add as new binding? 
            MutableBindingExpressions[i] = bindExpr;
        else 
            MutableBindingExpressions.Add(bindExpr); 

        bindExpr.Attach(target, TargetProperty); 
        return bindExpr;
    }

    /*internal*/public /*override*/ void HandlePropertyInvalidation(DependencyObject d, DependencyPropertyChangedEventArgs args) 
    {
        DependencyProperty dp = args.Property; 
        int n = MutableBindingExpressions.Count; 

//        if (TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.Events)) 
//        {
//            TraceData.Trace(TraceEventType.Warning,
//                                TraceData.GotPropertyChanged(
//                                    TraceData.Identify(this), 
//                                    TraceData.Identify(d),
//                                    dp.Name)); 
//        } 

        boolean isConnected = true; 
        TransferIsDeferred = true;

        for (int i = 0; i < n; ++i)
        { 
            BindingExpressionBase bindExpr = MutableBindingExpressions[i];
            if (bindExpr != null) 
            { 
                DependencySource[] sources = bindExpr.GetSources();
 
                if (sources != null)
                {
                    for (int j = 0; j < sources.length; ++j)
                    { 
                        DependencySource source = sources[j];
 
                        if (source.DependencyObject == d && source.DependencyProperty == dp) 
                        {
                            bindExpr.OnPropertyInvalidation(d, args); 
                            break;
                        }
                    }
                } 

                if (bindExpr.IsDisconnected) 
                { 
                    isConnected = false;
                } 
            }
        }

        TransferIsDeferred = false; 

        if (isConnected) 
        { 
            Transfer();                 // Transfer if inner BindingExpressions have called Invalidate(binding)
        } 
        else
        {
            Disconnect();
        } 
    }
 
    /// <summary> 
    /// Handle events from the centralized event table
    /// </summary> 
    /*internal*/public /*override*/ boolean ReceiveWeakEvent(Type managerType, Object sender, EventArgs e)
    {
//        if (TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.Events))
//        { 
//            TraceData.Trace(TraceEventType.Warning,
//                                TraceData.GotEvent( 
//                                    TraceData.Identify(this), 
//                                    TraceData.IdentifyWeakEvent(managerType),
//                                    TraceData.Identify(sender))); 
//        }

        if (managerType == typeof(LostFocusEventManager))
        { 
            Update(true);
        } 
        else 
        {
            return super.ReceiveWeakEvent(managerType, sender, e); 
        }

        return true;
    } 

//#region Value 
 
    /// <summary> Force a data transfer from source(s) to target </summary>
    /// <param name="includeInnerBindings"> 
    ///     use true to propagate UpdateTarget call to all inner BindingExpressions;
    ///     use false to avoid forcing data re-transfer from one-time inner BindingExpressions
    /// </param>
    void UpdateTarget(boolean includeInnerBindings) 
    {
        TransferIsDeferred = true; 
 
        if (includeInnerBindings)
        { 
            for/*each*/ (BindingExpressionBase b : MutableBindingExpressions)
            {
                b.UpdateTarget();
            } 
        }
 
        TransferIsDeferred = false; 
        NeedsDataTransfer = true;   // force data transfer
        Transfer(); 
    }

    // transfer a value from the source to the target
    void Transfer() 
    {
        // required state for transfer 
        if (    NeedsDataTransfer       // Transfer is needed 
            &&  Status != BindingStatus.Unattached  // All bindings are attached
            &&  !TransferIsDeferred)    // Not aggregating transfers 
        {
            TransferValue();
        }
    } 

    // transfer a value from the source to the target 
    public void TransferValue() 
    {
        IsInTransfer = true; 
        NeedsDataTransfer = false;

        DependencyObject target = TargetElement;
        if (target == null) 
            goto Done;
 
//        boolean isExtendedTraceEnabled = TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.Transfer); 

        Object value = DependencyProperty.UnsetValue; 
        Object preFormattedValue = _tempValues;
        CultureInfo culture = GetCulture();

        // gather values from inner BindingExpressions 
        int count = MutableBindingExpressions.Count;
        for (int i = 0; i < count; ++i) 
        { 
            _tempValues[i] = MutableBindingExpressions[i].GetValue(target, TargetProperty); // could pass (null, null)
 
//            if (isExtendedTraceEnabled)
//            {
//                TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.GetRawValueMulti( 
//                                        TraceData.Identify(this),
//                                        i, 
//                                        TraceData.Identify(_tempValues[i]))); 
//            }
        } 

        // apply the converter
        if (Converter != null)
        { 
            // MultiValueConverters are always user-defined, so don't catch exceptions (bug 992237)
            preFormattedValue = Converter.Convert(_tempValues, TargetProperty.PropertyType, ParentMultiBinding.ConverterParameter, culture); 
 
//            if (isExtendedTraceEnabled)
//            { 
//                TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.UserConverter(
//                                        TraceData.Identify(this),
//                                        TraceData.Identify(preFormattedValue))); 
//            }
        } 
        else if (EffectiveStringFormat != null) 
        {
            // preFormattedValue = _tempValues; 
            // But check for child binding conversion errors
            for (int i=0; i<_tempValues.length; ++i)
            {
                if (_tempValues[i] == DependencyProperty.UnsetValue) 
                {
                    preFormattedValue = DependencyProperty.UnsetValue; 
                    break; 
                }
            } 
        }
        else    // no converter (perhaps user specified it in error)
        {
//            if (TraceData.IsEnabled) 
//            {
//                TraceData.Trace(TraceEventType.Error, TraceData.MultiValueConverterMissingForTransfer, this); 
//            } 

            goto Done; 
        }

        // apply string formatting
        if (EffectiveStringFormat == null || preFormattedValue == Binding.DoNothing || preFormattedValue == DependencyProperty.UnsetValue) 
        {
            value = preFormattedValue; 
        } 
        else
        { 
            try
            {
                // we call String.Format either with multiple values (obtained from
                // the child bindings) or a single value (as produced by the converter). 
                // The if-test is needed to avoid wrapping _tempValues inside another Object[].
                if (preFormattedValue == _tempValues) 
                { 
                    value = String.Format(culture, EffectiveStringFormat, _tempValues);
                } 
                else
                {
                    value = String.Format(culture, EffectiveStringFormat, preFormattedValue);
                } 

//                if (isExtendedTraceEnabled) 
//                { 
//                    TraceData.Trace(TraceEventType.Warning,
//                                        TraceData.FormattedValue( 
//                                            TraceData.Identify(this),
//                                            TraceData.Identify(value)));
//                }
            } 
            catch (FormatException ex)
            { 
                // formatting didn't work 
                value = DependencyProperty.UnsetValue;
 
//                if (isExtendedTraceEnabled)
//                {
//                    TraceData.Trace(TraceEventType.Warning,
//                                        TraceData.FormattingFailed( 
//                                            TraceData.Identify(this),
//                                            EffectiveStringFormat)); 
//                } 
            }
        } 

        Array.Clear(_tempValues, 0, _tempValues.length);

        // the special value DoNothing means no error, but no data transfer 
        if (value == Binding.DoNothing)
            goto Done; 
 
        // ultimately, TargetNullValue should get assigned implicitly,
        // even if the user doesn't declare it.  We can't do this yet because 
        // of back-compat.  I wrote it both ways, and #if'd out the breaking
        // change.
//    #if TargetNullValueBC   //BreakingChange
//        if (IsNullValue(value)) 
//    #else
        if (EffectiveTargetNullValue != DependencyProperty.UnsetValue && 
            IsNullValue(value)) 
//    #endif
        { 
            value = EffectiveTargetNullValue;

//            if (isExtendedTraceEnabled)
//            { 
//                TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.NullConverter( 
//                                        TraceData.Identify(this), 
//                                        TraceData.Identify(value)));
//            } 
        }

        // if the value isn't acceptable to the target property, don't use it
        if (value != DependencyProperty.UnsetValue && !TargetProperty.IsValidValue(value)) 
        {
//            if (TraceData.IsEnabled) 
//            { 
//                TraceData.Trace(TraceLevel, TraceData.BadValueAtTransfer, value, this);
//            } 
//
//            if (isExtendedTraceEnabled)
//            {
//                TraceData.Trace(TraceEventType.Warning, 
//                                    TraceData.BadValueAtTransferExtended(
//                                        TraceData.Identify(this), 
//                                        TraceData.Identify(value))); 
//            }
 
            value = DependencyProperty.UnsetValue;
        }

        // if we can't obtain a value, try the fallback value. 
        if (value == DependencyProperty.UnsetValue)
        { 
            value = UseFallbackValue(); 

//            if (isExtendedTraceEnabled) 
//            {
//                TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.UseFallback(
//                                        TraceData.Identify(this), 
//                                        TraceData.Identify(value)));
//            } 
        } 

//        if (isExtendedTraceEnabled) 
//        {
//            TraceData.Trace(TraceEventType.Warning,
//                                TraceData.TransferValue(
//                                    TraceData.Identify(this), 
//                                    TraceData.Identify(value)));
//        } 
 
        // if this is a re-transfer after a source update and the value
        // hasn't changed, don't do any more work. 
        if (IsInUpdate && Object.Equals(value, Value))
        {
            goto Done;
        } 

        // update the cached value 
        ChangeValue(value, true); 
        Invalidate(false);
 
        OnTargetUpdated();
        Validation.ClearInvalid(this);

    Done: 
        IsInTransfer = false;
    } 
 
    public void OnTargetUpdated()
    { 
        if (NotifyOnTargetUpdated)
        {
            DependencyObject target = TargetElement;
            if (target != null) 
            {
                // while attaching a normal (not style-defined) BindingExpression, 
                // we must defer raising the event until after the 
                // property has been invalidated, so that the event handler
                // gets the right value if it asks (bug 1036862) 
                if (IsAttaching && this == target.ReadLocalValue(TargetProperty))
                {
                    Engine.AddTask(this, TaskOps.RaiseTargetUpdatedEvent);
                } 
                else
                { 
                    BindingExpression.OnTargetUpdated(target, TargetProperty); 
                }
            } 
        }
    }

    void OnSourceUpdated() 
    {
        if (NotifyOnSourceUpdated) 
        { 
            DependencyObject target = TargetElement;
            if (target != null) 
            {
                BindingExpression.OnSourceUpdated(target, TargetProperty);
            }
        } 
    }
 
    // transfer a value from the target to the source 
    /*internal*/ /*override*/ void Update(boolean synchronous)
    { 
        // various reasons not to update:
        if (   !NeedsUpdate                     // nothing to do
            || !IsReflective                    // no update desired
            || IsInTransfer                     // in a transfer 
            || Status == BindingStatus.Unattached // not ready yet
            ) 
            return; 

        if (synchronous) 
        {
            UpdateValue();
        }
        else 
        {
            Engine.AddTask(this, TaskOps.UpdateValue); 
        } 
    }
 
//#endregion Value

    //------------------------------------------------------
    // 
    //  Private Fields
    // 
    //----------------------------------------------------- 

    Collection<BindingExpressionBase>  _list = new Collection<BindingExpressionBase>(); 
    IMultiValueConverter    _converter;
    Object[]                _tempValues;
    Type[]                  _tempTypes;
} 