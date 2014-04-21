package org.summer.view.widget.data;

import java.lang.reflect.Array;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DataTemplate;
import org.summer.view.widget.DeferredReference;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.RequestFlags;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.DependencySource;
import org.summer.view.widget.EffectiveValueEntry;
import org.summer.view.widget.EntryIndex;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.FrameworkObject;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.FrameworkPropertyMetadataOptions;
import org.summer.view.widget.IWeakEventListener;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.Type;
import org.summer.view.widget.WeakReference;
import org.summer.view.widget.collection.Collection;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.collection.ReadOnlyCollection;
import org.summer.view.widget.controls.ContentControl;
import org.summer.view.widget.controls.ContentPresenter;
import org.summer.view.widget.controls.DataErrorValidationRule;
import org.summer.view.widget.controls.HeaderedContentControl;
import org.summer.view.widget.controls.HeaderedItemsControl;
import org.summer.view.widget.controls.NotifyDataErrorValidationRule;
import org.summer.view.widget.controls.TextBox;
import org.summer.view.widget.controls.Validation;
import org.summer.view.widget.controls.ValidationError;
import org.summer.view.widget.controls.ValidationResult;
import org.summer.view.widget.controls.ValidationRule;
import org.summer.view.widget.controls.ValidationStep;
import org.summer.view.widget.controls.primitives.TextBoxBase;
import org.summer.view.widget.input.TextCompositionEventArgs;
import org.summer.view.widget.internal.DefaultValueConverter;
import org.summer.view.widget.internal.EventHandler;
import org.summer.view.widget.internal.Helper;
import org.summer.view.widget.internal.NamedObject;
import org.summer.view.widget.internal.SystemDataHelper;
import org.summer.view.widget.internal.UncommonValueTable;
import org.summer.view.widget.markup.XmlLanguage;
import org.summer.view.widget.model.TypeConverter;
import org.summer.view.widget.threading.Dispatcher;
import org.summer.view.widget.threading.DispatcherOperation;
import org.summer.view.widget.threading.DispatcherTimer;


/// <summary>
/// Base class for Binding Expressions. 
/// </summary>
public abstract class BindingExpressionBase extends Expression implements IWeakEventListener 
{ 


    //----------------------------------------------------- 
    //
    //  Constructors 
    // 
    //-----------------------------------------------------

    static //BindingExpressionBase()
    {
//        Debug.Assert((int)Feature.LastFeatureId <= 32, "UncommonValueTable supports only 32 Ids");
    } 

    /// <summary> Constructor </summary> 
    /*internal*/ public BindingExpressionBase(BindingBase binding, BindingExpressionBase parent) 
    {
    	super(ExpressionMode.SupportsUnboundSources) ;
        if (binding == null) 
            throw new ArgumentNullException("binding");

        _binding = binding;
        SetValue(Feature.ParentBindingExpressionBase, parent, null); 

        _flags = (PrivateFlags)binding.Flags; 

        if (parent != null)
        { 
            ResolveNamesInTemplate = parent.ResolveNamesInTemplate;

            Type type = parent.GetType();
            if (type == typeof(MultiBindingExpression)) 
                ChangeFlag(PrivateFlags.iInMultiBindingExpression, true);
            else if (type == typeof(PriorityBindingExpression)) 
                ChangeFlag(PrivateFlags.iInPriorityBindingExpression, true); 
        }

        // initialize tracing information
//        PresentationTraceLevel traceLevel = PresentationTraceSources.GetTraceLevel(binding);

//        if (traceLevel > 0) 
//        {
//            // copy TraceLevel from parent BindingBase - it can be changed later 
//            PresentationTraceSources.SetTraceLevel(this, traceLevel); 
//        }

//        if (TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.CreateExpression))
//        {
//            if (parent == null)
//            { 
//                TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.CreatedExpression( 
//                                        TraceData.Identify(this), 
//                                        TraceData.Identify(binding)));
//            } 
//            else
//            {
//                TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.CreatedExpressionInParent( 
//                                        TraceData.Identify(this),
//                                        TraceData.Identify(binding), 
//                                        TraceData.Identify(parent))); 
//            }
//        } 

        if (LookupValidationRule(typeof(ExceptionValidationRule)) != null)
        {
            ChangeFlag(PrivateFlags.iValidatesOnExceptions, true); 
        }

        if (LookupValidationRule(typeof(DataErrorValidationRule)) != null) 
        {
            ChangeFlag(PrivateFlags.iValidatesOnDataErrors, true); 
        }
    }

    //------------------------------------------------------ 
    //
    //  Public Properties 
    // 
    //-----------------------------------------------------

    /// <summary> The element to which this BindingExpression is attached </summary>
    public DependencyObject Target { get { return TargetElement; } }

    /// <summary> The property to which this BindingExpression is attached </summary> 
    public DependencyProperty TargetProperty { get { return _targetProperty; } }

    /// <summary> Binding from which this BindingExpression was created </summary> 
    public BindingBase  ParentBindingBase  { get { return _binding; } }

    /// <summary> The BindingGroup to which this BindingExpression belongs (or null) </summary>
    public BindingGroup BindingGroup
    {
        get 
        {
            BindingExpressionBase root = RootBindingExpression; 
            WeakReference<BindingGroup> wr = (WeakReference<BindingGroup>)root.GetValue(Feature.BindingGroup, null); 
            if (wr == null)
                return null; 
            else
            {
                BindingGroup bg;
                return (wr.TryGetTarget(/*out*/ bg)) ? bg : null; 
            }
        } 
    } 

    /// <summary>Status of the BindingExpression</summary> 
    public BindingStatus Status { get { return (BindingStatus)_status; } }

    /*internal*/ public BindingStatusInternal StatusInternal { get { return _status; } }

    /// <summary>
    ///     The ValidationError that caused this 
    ///     BindingExpression to be invalid. 
    /// </summary>
    public /*virtual*/ ValidationError ValidationError 
    {
        get { return BaseValidationError; }
    }

    /*internal*/ public ValidationError BaseValidationError
    { 
        get { return (ValidationError)GetValue(Feature.ValidationError, null); } 
    }

    /*internal*/ public List<ValidationError> NotifyDataErrors
    {
        get { return (List<ValidationError>)GetValue(Feature.NotifyDataErrors, null); }
    } 

    /// <summary> 
    ///     HasError returns true if any of the ValidationRules 
    ///     in the ParentBinding failed its validation rule.
    /// </summary> 
    public /*virtual*/ boolean HasError
    {
        get { return HasValidationError; }
    } 

    /// <summary> 
    ///     HasValidationError returns true if any of the ValidationRules 
    ///     in the ParentBinding failed its validation rule.
    /// </summary> 
    public /*virtual*/ boolean HasValidationError
    {
        get
        { 
            return HasValue(Feature.ValidationError) || HasValue(Feature.NotifyDataErrors);
        } 
    } 

    /// <summary> 
    ///     IsDirty returns true if the target property has a new value that
    ///     has not yet been written to the source property.   (This applies
    ///     only to bindings that are TwoWay or OneWayToSource.)
    /// </summary> 
    public boolean IsDirty
    { 
        get { return NeedsUpdate; } 
    }

    /// <summary>
    ///     ValidationErrors returns the validation errors currently
    ///     arising from this binding, or null if there are no errors.
    /// </summary> 
    public /*virtual*/ ReadOnlyCollection<ValidationError> ValidationErrors
    { 
        get 
        {
            if (HasError) 
            {
                List<ValidationError> list;

                if (!HasValue(Feature.ValidationError)) 
                {
                    list = NotifyDataErrors; 
                } 
                else
                { 

                    if (NotifyDataErrors == null)
                    {
                        list = new List<ValidationError>(); 
                    }
                    else 
                    { 
                        list = new List<ValidationError>(NotifyDataErrors);
                    } 
                    list.Insert(0, BaseValidationError);
                }

                return new ReadOnlyCollection<ValidationError>(list); 
            }
            else 
                return null; 
        }
    } 

    //------------------------------------------------------
    //
    //  Public Methods 
    //
    //------------------------------------------------------ 

    /**
     * Force a data transfer from source to target 
     */
    public /*virtual*/ void UpdateTarget() 
    {
    }

    /**
     * Send the current value back to the source 
     * Does nothing when binding's Mode is not TwoWay or OneWayToSource
     */
    public /*virtual*/ void UpdateSource() 
    { 
    }

    /// <summary>
    ///     Run UI-side validation rules on the proposed value held by this
    ///     binding expression, but do not write the proposed value back to
    ///     the source, or run source-side validation rules. 
    /// </summary>
    /// <returns> 
    ///     True, if the validation rules all pass, or if there is no proposed 
    ///     value to check.   False, otherwise.
    /// </returns> 
    /// <remarks>
    ///     "UI-side" validation rules are those whose validation step is
    ///     RawProposedValue or ConvertedProposedValue.  Previous validation
    ///     errors for these rules are cleared, and new errors discovered for 
    ///     these rules are added to the Validation.Errors collections.  The
    ///     Validation.HasError property, validation adorner feedback, and 
    ///     validation error events are updated appropriately. 
    /// </remarks>
    public boolean ValidateWithoutUpdate() 
    {
        if (!NeedsValidation)
            return true;

        Collection<ProposedValue> values;
        return ValidateAndConvertProposedValue(/*out*/ values); 
    } 

//#region Expression overrides 

    /**
     * Notification that the Expression has been set as a property's value
     * Subclasses should not override OnAttach(), but must override Attach() 
     */
    /// <param name="d">DependencyObject being set</param>
    /// <param name="dp">Property being set</param> 
    /*internal*/ public /*sealed*/ /*override*/ void OnAttach(DependencyObject d, DependencyProperty dp)
    {
        if (d == null)
            throw new ArgumentNullException("d"); 
        if (dp == null)
            throw new ArgumentNullException("dp"); 

        Attach(d, dp);
    } 

    /// <summary>
    ///     Notification that the Expression has been removed as a property's value
    /// </summary> 
    /// <remarks>
    ///     Subclasses should not override OnDetach(), but must override DetachOverride() 
    /// </remarks> 
    /// <param name="d">DependencyObject being cleared</param>
    /// <param name="dp">Property being cleared</param> 
    /*internal*/ public /*sealed*/ /*override*/ void OnDetach(DependencyObject d, DependencyProperty dp)
    {
        Detach();
    } 

    /// <summary> 
    ///     Called to evaluate the Expression value 
    /// </summary>
    /// <param name="d">DependencyObject being queried</param> 
    /// <param name="dp">Property being queried</param>
    /// <returns>Computed value. Unset if unavailable.</returns>
    /*internal*/ public /*override*/ Object GetValue(DependencyObject d, DependencyProperty dp)
    { 
        return Value;
    } 

    /**
     * Allows Expression to store set values 
     */
    /// <param name="d">DependencyObject being set</param>
    /// <param name="dp">Property being set</param>
    /// <param name="value">Value being set</param> 
    /// <returns>true if Expression handled storing of the value</returns>
    /*internal*/ public /*override*/ boolean SetValue(DependencyObject d, DependencyProperty dp, Object value) 
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

    /**
     * Notification that a Dependent that this Expression established has 
     * been invalidated as a result of a Source invalidation
     */
    /// <param name="d">DependencyObject that was invalidated</param> 
    /// <param name="args">Changed event args for the property that was invalidated</param>
    /*internal*/ public /*override*/ void OnPropertyInvalidation(DependencyObject d, DependencyPropertyChangedEventArgs args) 
    {
        // It's possible to receive this notification after we've unsubscribed to it.
        // This can happen if the sender raises the notification to a list of
        // clients and one of the earlier clients causes a later client to 
        // unsubscribe.  The sender uses a copy of the list, so the later client
        // will still get the notification.  (See Dev10 bug 715390) 
        // If this happens, simply ignore the notification. 
        if (IsDetached)
            return; 

        IsTransferPending = true;

        // if the notification arrived on the right Dispatcher, handle it now. 
        if (Dispatcher.Thread == Thread.CurrentThread)
        { 
            HandlePropertyInvalidation(d, args); 
        }
        else    // Otherwise, marshal it to the right Dispatcher. 
        {
            Engine.Marshal(
                new DispatcherOperationCallback(HandlePropertyInvalidationOperation),
                new Object[]{d, args}); 
        }
    } 

    /**
     * List of sources of the Expression 
     */
    /// <returns>Sources list</returns>
    /*internal*/ public /*override*/ DependencySource[] GetSources()
    { 
        int j, k;
        int n = (_sources != null) ? _sources.length : 0; 
        if (n == 0) 
            return null;

        DependencySource[] result = new DependencySource[n];

        // convert the weak references into strong ones
        for (j=0, k=0; k<n; ++k) 
        {
            DependencyObject d = _sources[k].DependencyObject; 
            if (d != null) 
            {
                result[j++] = new DependencySource(d, _sources[k].DependencyProperty); 
            }
        }

        // if any of the references died, return a shortened list 
        if (j < n)
        { 
            DependencySource[] temp = result; 
            result = new DependencySource[j];
            Array.Copy(temp, 0, result, 0, j); 
        }

        return result;
    } 

    // We need this Clone method to copy a binding during Freezable.Copy.  We shouldn't be taking 
    // the target Object/dp parameters here, but Binding.ProvideValue requires it.  (Binding 
    // could probably be re-factored so that we don't need this).
    /*internal*/ public /*override*/ Expression Copy( DependencyObject targetObject, DependencyProperty targetDP ) 
    {
        return ParentBindingBase.CreateBindingExpression(targetObject, targetDP);
    }

//#endregion  Expression overrides

    /// <summary> 
    /// Handle events from the centralized event table
    /// </summary> 
//    public boolean /*IWeakEventListener.*/ReceiveWeakEvent(Type managerType, Object sender, EventArgs e)
//    {
//        return ReceiveWeakEvent(managerType, sender, e);
//    } 

//#region BindingExpressions with no target DP 

    //-----------------------------------------------------
    // 
    //  API for BindingExpressions with no target DP (task 20769)
    //  This is /*internal*/ public for now, until we review whether we wish to
    //  make it public
    // 
    //------------------------------------------------------

    /// <summary> Create an untargeted BindingExpression </summary> 
    /*internal*/ public static BindingExpressionBase CreateUntargetedBindingExpression(DependencyObject d, BindingBase binding)
    { 
        return binding.CreateBindingExpression(d, NoTargetProperty);
    }

    /// <summary> Attach the BindingExpression to its target element </summary> 
    /// <remarks>
    /// This method must be called once during the initialization. 
    /// </remarks> 
    /// <param name="d">The target element </param>
    /*internal*/ public void Attach(DependencyObject d) 
    {
        Attach(d, NoTargetProperty);
    }

    /// <summary> This event is raised when the BindingExpression's value changes </summary>
    /*internal*/ public /*event*/ EventHandler<BindingValueChangedEventArgs> ValueChanged; 

    /* The following APIs are also needed for untargeted bindings, but they already exist
    for other reasons. 

    /// <summary> The current value of the BindingExpression </summary>
    internal Object Value { get; set; }

    /// <summary> Activate the BindingExpression, using the given item as its root item. </summary>
    internal void Activate(Object item) {} 

    /// <summary> Deactivate the BindingExpression. </summary>
    internal
    /// <summary> Detach the BindingExpression from its target element </summary>
    /// <remarks>
    /// This method must be called once when the BindingExpression is no longer needed. 
    /// </remarks>
    internal void Detach() {} 

    */

//#endregion BindingExpressions with no target DP

    //-----------------------------------------------------
    // 
    //  Protected Properties
    // 
    //----------------------------------------------------- 

    /// <summary> True if this binding expression is attaching </summary> 
    /*internal*/ public boolean IsAttaching
    {
        get { return TestFlag(PrivateFlags.iAttaching); }
        set { ChangeFlag(PrivateFlags.iAttaching, value); } 
    }

    /// <summary> True if this binding expression is detaching </summary> 
    /*internal*/ public boolean IsDetaching
    { 
        get { return TestFlag(PrivateFlags.iDetaching); }
        set { ChangeFlag(PrivateFlags.iDetaching, value); }
    }

    /// <summary> True if this binding expression is detached </summary>
    /*internal*/ public boolean IsDetached 
    { 
        get { return (_status == BindingStatusInternal.Detached); }
    } 

    private boolean IsAttached
    {
        get { return (_status != BindingStatusInternal.Unattached && 
                    _status != BindingStatusInternal.Detached &&
                    !IsDetaching); } 
    } 

    /// <summary> True if this binding expression updates the target </summary> 
    /*internal*/ public boolean IsDynamic
    {
        get
        { 
            return (    TestFlag(PrivateFlags.iSourceToTarget)
                    &&  (!IsInMultiBindingExpression || ParentMultiBindingExpression.IsDynamic)); 
        } 
    }

    /// <summary> True if this binding expression updates the source </summary>
    /*internal*/ public boolean IsReflective
    {
        get 
        {
            return (    TestFlag(PrivateFlags.iTargetToSource) 
                    &&  (!IsInMultiBindingExpression || ParentMultiBindingExpression.IsReflective)); 
        }
        set { ChangeFlag(PrivateFlags.iTargetToSource, value); } 
    }

    /// <summary> True if this binding expression uses a default ValueConverter </summary>
    /*internal*/ public boolean UseDefaultValueConverter 
    {
        get { return TestFlag(PrivateFlags.iDefaultValueConverter); } 
        set { ChangeFlag(PrivateFlags.iDefaultValueConverter, value); } 
    }

    /// <summary> True if this binding expression is OneWayToSource </summary>
    /*internal*/ public boolean IsOneWayToSource
    {
        get { return (_flags & PrivateFlags.iPropagationMask) == PrivateFlags.iTargetToSource; } 
    }

    /// <summary> True if this binding expression updates on PropertyChanged </summary> 
    /*internal*/ public boolean IsUpdateOnPropertyChanged
    { 
        get { return (_flags & PrivateFlags.iUpdateMask) == 0; }
    }

    /// <summary> True if this binding expression updates on LostFocus </summary> 
    /*internal*/ public boolean IsUpdateOnLostFocus
    { 
        get { return TestFlag(PrivateFlags.iUpdateOnLostFocus); } 
    }

    /// <summary> True if this binding expression has a pending target update </summary>
    /*internal*/ public boolean IsTransferPending
    {
        get { return TestFlag(PrivateFlags.iTransferPending); } 
        set { ChangeFlag(PrivateFlags.iTransferPending, value); }
    } 

    /// <summary> True if this binding expression is deferring a target update </summary>
    /*internal*/ public boolean TransferIsDeferred 
    {
        get { return TestFlag(PrivateFlags.iTransferDeferred); }
        set { ChangeFlag(PrivateFlags.iTransferDeferred, value); }
    } 

    /// <summary> True if this binding expression is updating the target </summary> 
    /*internal*/ public boolean IsInTransfer 
    {
        get { return TestFlag(PrivateFlags.iInTransfer); } 
        set { ChangeFlag(PrivateFlags.iInTransfer, value); }
    }

    /// <summary> True if this binding expression is updating the source </summary> 
    /*internal*/ public boolean IsInUpdate
    { 
        get { return TestFlag(PrivateFlags.iInUpdate); } 
        set { ChangeFlag(PrivateFlags.iInUpdate, value); }
    } 

    /// <summary> True if this binding expression is using the fallback value </summary>
    /*internal*/ public boolean UsingFallbackValue
    { 
        get { return TestFlag(PrivateFlags.iUsingFallbackValue); }
        set { ChangeFlag(PrivateFlags.iUsingFallbackValue, value); } 
    } 

    /// <summary> True if this binding expression uses the mentor of the target element </summary> 
    /*internal*/ public boolean UsingMentor
    {
        get { return TestFlag(PrivateFlags.iUsingMentor); }
        set { ChangeFlag(PrivateFlags.iUsingMentor, value); } 
    }

    /// <summary> True if this binding expression should resolve ElementName within the template of the target element </summary> 
    /*internal*/ public boolean ResolveNamesInTemplate
    { 
        get { return TestFlag(PrivateFlags.iResolveNamesInTemplate); }
        set { ChangeFlag(PrivateFlags.iResolveNamesInTemplate, value); }
    }

    /// <summary> True if this binding expression has a pending target update </summary>
    /*internal*/ public boolean NeedsDataTransfer 
    { 
        get { return TestFlag(PrivateFlags.iNeedDataTransfer); }
        set { ChangeFlag(PrivateFlags.iNeedDataTransfer, value); } 
    }

    /// <summary> True if this binding expression has a pending source update </summary>
    /*internal*/ public boolean NeedsUpdate 
    {
        get { return TestFlag(PrivateFlags.iNeedsUpdate); } 
        set 
        {
            ChangeFlag(PrivateFlags.iNeedsUpdate, value); 
            if (value)
            {
                NeedsValidation = true;
            } 
        }
    } 

    /// <summary> True if this binding expression needs validation </summary>
    /*internal*/ public boolean NeedsValidation 
    {
        get { return TestFlag(PrivateFlags.iNeedsValidation) || HasValue(Feature.ValidationError); }
        set { ChangeFlag(PrivateFlags.iNeedsValidation, value); }
    } 

    /// <summary> True if this binding expression should raise the TargetUpdated event </summary> 
    /*internal*/ public boolean NotifyOnTargetUpdated 
    {
        get { return TestFlag(PrivateFlags.iNotifyOnTargetUpdated); } 
        set { ChangeFlag(PrivateFlags.iNotifyOnTargetUpdated, value); }
    }

    /// <summary> True if this binding expression should raise the SourceUpdated event </summary> 
    /*internal*/ public boolean NotifyOnSourceUpdated
    { 
        get { return TestFlag(PrivateFlags.iNotifyOnSourceUpdated); } 
        set { ChangeFlag(PrivateFlags.iNotifyOnSourceUpdated, value); }
    } 

    /// <summary> True if this binding expression should raise the ValidationError event </summary>
    /*internal*/ public boolean NotifyOnValidationError
    { 
        get { return TestFlag(PrivateFlags.iNotifyOnValidationError); }
        set { ChangeFlag(PrivateFlags.iNotifyOnValidationError, value); } 
    } 

    /// <summary> True if this binding expression belongs to a PriorityBinding </summary> 
    /*internal*/ public boolean IsInPriorityBindingExpression
    {
        get { return TestFlag(PrivateFlags.iInPriorityBindingExpression); }
    } 

    /// <summary> True if this binding expression belongs to a MultiBinding </summary> 
    /*internal*/ public boolean IsInMultiBindingExpression 
    {
        get { return TestFlag(PrivateFlags.iInMultiBindingExpression); } 
    }

    /// <summary> True if this binding expression belongs to a PriorityBinding or MultiBinding </summary>
    /*internal*/ public boolean IsInBindingExpressionCollection 
    {
        get { return TestFlag(PrivateFlags.iInPriorityBindingExpression | PrivateFlags.iInMultiBindingExpression); } 
    } 

    /// <summary> True if this binding expression validates on exceptions </summary> 
    /*internal*/ public boolean ValidatesOnExceptions
    {
        get { return TestFlag(PrivateFlags.iValidatesOnExceptions); }
    } 

    /// <summary> True if this binding expression validates on data errors </summary> 
    /*internal*/ public boolean ValidatesOnDataErrors 
    {
        get { return TestFlag(PrivateFlags.iValidatesOnDataErrors); } 
    }

    /// <summary> True if the target wants to hear about cross-thread property changes immediately </summary>
    /*internal*/ public boolean TargetWantsCrossThreadNotifications 
    {
        get { return TestFlag(PrivateFlags.iTargetWantsXTNotification); } 
        set { ChangeFlag(PrivateFlags.iTargetWantsXTNotification, value); } 
    }

    /// <summary> True if this binding expression has a pending DataErrorsChanged notification </summary>
    /*internal*/ public boolean IsDataErrorsChangedPending
    {
        get { return TestFlag(PrivateFlags.iDataErrorsChangedPending); } 
        set { ChangeFlag(PrivateFlags.iDataErrorsChangedPending, value); }
    } 

    /// <summary> True if this binding expression is waiting for an IME composition to complete before updating its source </summary>
    /*internal*/ public boolean IsUpdateDeferredForComposition 
    {
        get { return TestFlag(PrivateFlags.iDeferUpdateForComposition); }
        set { ChangeFlag(PrivateFlags.iDeferUpdateForComposition, value); }
    } 

    /// <summary> True if this binding expression validates on notify data errors </summary> 
    /*internal*/ public boolean ValidatesOnNotifyDataErrors 
    {
        get { return TestFlag(PrivateFlags.iValidatesOnNotifyDataErrors); } 
    }

    /// <summary> The parent MultiBindingExpression (if any) </summary>
    /*internal*/ public MultiBindingExpression ParentMultiBindingExpression 
    {
        get { return GetValue(Feature.ParentBindingExpressionBase, null) as MultiBindingExpression; } 
    } 

    /// <summary> The parent PriorityBindingExpression (if any) </summary> 
    /*internal*/ public PriorityBindingExpression ParentPriorityBindingExpression
    {
        get { return GetValue(Feature.ParentBindingExpressionBase, null) as PriorityBindingExpression; }
    } 

    /// <summary> The parent PriorityBindingExpression or MultiBindingExpression (if any) </summary> 
    /*internal*/ public BindingExpressionBase ParentBindingExpressionBase 
    {
        get { return (BindingExpressionBase)GetValue(Feature.ParentBindingExpressionBase, null); } 
    }

    /// <summary> The FallbackValue (from the parent Binding), possibly converted
    /// to a type suitable for the target property.</summary> 
    /*internal*/ public Object FallbackValue
    { 
        // perf note: we recompute the value every time it's needed.  This is 
        // a good decision if we seldom need the value.  Alternatively we could
        // cache it.  Wait until we know what the perf impact really is. 
        get { return ConvertFallbackValue(ParentBindingBase.FallbackValue, TargetProperty, this); }
    }

    /// <summary> The default value of the target property </summary> 
    /*internal*/ public Object DefaultValue
    { 
        // perf note: we recompute the value every time it's needed.  This is 
        // a good decision if we seldom need the value.  Alternatively we could
        // cache it.  Wait until we know what the perf impact really is. 
        get
        {
            DependencyObject target = TargetElement;
            if (target != null) 
            {
                return TargetProperty.GetDefaultValue(target.DependencyObjectType); 
            } 
            return DependencyProperty.UnsetValue;
        } 
    }

    /// <summary> The effective String format, taking into account the target
    /// property, parent bindings, convenience syntax, etc. </summary> 
    /*internal*/ public String EffectiveStringFormat
    { 
        get { return (String)GetValue(Feature.EffectiveStringFormat, null); } 
    }

    /// <summary> The effective TargetNullValue, taking into account the target
    /// property, parent bindings, etc. </summary>
    /*internal*/ public Object EffectiveTargetNullValue
    { 
        get { return GetValue(Feature.EffectiveTargetNullValue, DependencyProperty.UnsetValue); }
    } 

    /// <summary> return the root of the tree of {Multi/Priority}BindingExpressions</summary>
    /*internal*/ public BindingExpressionBase RootBindingExpression 
    {
        get
        {
            BindingExpressionBase child = this; 
            BindingExpressionBase parent = this.ParentBindingExpressionBase;
            while (parent != null) 
            { 
                child = parent;
                parent = child.ParentBindingExpressionBase; 
            }
            return child;
        }
    } 

    /*internal*/ public /*virtual*/ boolean IsParentBindingUpdateTriggerDefault 
    { 
        get { return false; }
    } 

    /*internal*/ public boolean UsesLanguage
    {
        get { return (ParentBindingBase.ConverterCultureInternal == null); } 
    }

    /*internal*/ public boolean IsEligibleForCommit 
    {
        get 
        {
            if (IsDetaching)
                return false;

            switch (StatusInternal)
            { 
                case BindingStatusInternal.Unattached: 
                case BindingStatusInternal.Inactive:
                case BindingStatusInternal.Detached: 
                case BindingStatusInternal.PathError:
                    return false;

                default: 
                    return true;
            } 
        } 
    }

    //-----------------------------------------------------
    //
    //  Protected Methods
    // 
    //------------------------------------------------------

    /// <summary> 
    /// Attach the binding expression to the given target Object and property.
    /// Derived classes should call base.AttachOverride before doing their work, 
    /// and should continue only if it returns true.
    /// </summary>
    /*internal*/ public /*virtual*/ boolean AttachOverride(DependencyObject target, DependencyProperty dp)
    { 
        _targetElement = new WeakReference(target);
        _targetProperty = dp; 

        // get the engine
        DataBindEngine engine = DataBindEngine.CurrentDataBindEngine; 
        if (engine == null || engine.IsShutDown)
        {
            return false;   // don't even think about doing any work if the DBE is shut down

            // we do this after setting TargetElement and TargetProperty so that
            // an app that (rather futilely) creates a binding after shutdown 
            // will at least see the default value.   This avoids the assert in 
            // EffectiveValueEntry.SetExpressionValue.
        } 
        _engine = engine;

        DetermineEffectiveStringFormat();
        DetermineEffectiveTargetNullValue(); 
        DetermineEffectiveUpdateBehavior();
        DetermineEffectiveValidatesOnNotifyDataErrors(); 

        // root bindings on TextBox.Text need to listen for IME composition events
        if (dp == /*System.Windows.Controls.*/TextBox.TextProperty && IsReflective && !IsInBindingExpressionCollection) 
        {
            /*System.Windows.Controls.Primitives.*/TextBoxBase tbb = target as /*System.Windows.Controls.Primitives.*/TextBoxBase;
            if (tbb != null)
            { 
                tbb.PreviewTextInput += OnPreviewTextInput;
            } 
        } 

//        if (TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.Attach)) 
//        {
//            TraceData.Trace(TraceEventType.Warning,
//                                TraceData.AttachExpression(
//                                    TraceData.Identify(this), 
//                                    target.GetType().FullName, dp.Name, AvTrace.GetHashCodeHelper(target)));
//        } 

        return true;
    } 

    /// <summary>
    /// Detach the binding expression from its target Object and property.
    /// Derived classes should call base.DetachOverride after doing their work. 
    /// </summary>
    /*internal*/ public /*virtual*/ void DetachOverride() 
    { 
        UpdateValidationError(null, false);
        UpdateNotifyDataErrorValidationErrors(null); 

        // root bindings on TextBox.Text need to stop listening for IME composition events
        if (TargetProperty == /*System.Windows.Controls.*/TextBox.TextProperty && IsReflective && !IsInBindingExpressionCollection)
        { 
            /*System.Windows.Controls.Primitives.*/TextBoxBase tbb = TargetElement as /*System.Windows.Controls.Primitives.*/TextBoxBase;
            if (tbb != null) 
            { 
                tbb.PreviewTextInput -= OnPreviewTextInput;
            } 
        }

        _engine = null;
        _targetElement = null; 
        _targetProperty = null;
        SetStatus(BindingStatusInternal.Detached); 

//        if (TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.Attach))
//        { 
//            TraceData.Trace(TraceEventType.Warning,
//                                TraceData.DetachExpression(
//                                    TraceData.Identify(this)));
//        } 
    }

    /// <summary> 
    /// Invalidate the given child expression.
    /// </summary> 
    /*internal*/ public abstract void InvalidateChild(BindingExpressionBase bindingExpression);

    /// <summary>
    /// Change the dependency sources for the given child expression. 
    /// </summary>
    /*internal*/ public abstract void ChangeSourcesForChild(BindingExpressionBase bindingExpression, WeakDependencySource[] newSources); 

    /// <summary>
    /// Replace the given child expression with a new one. 
    /// </summary>
    /*internal*/ public abstract void ReplaceChild(BindingExpressionBase bindingExpression);

    /*internal*/ public abstract void HandlePropertyInvalidation(DependencyObject d, DependencyPropertyChangedEventArgs args); 

    private Object HandlePropertyInvalidationOperation(Object o) 
    { 
        // This is the case where the source of the Binding belonged to a different Dispatcher
        // than the target. For this scenario the source marshals off the invalidation information 
        // onto the target's Dispatcher queue. This is where we unpack the marshalled information
        // to fire the invalidation on the target Object.

        Object[] args = (Object[])o; 
        HandlePropertyInvalidation((DependencyObject)args[0], (DependencyPropertyChangedEventArgs)args[1]);
        return null; 
    } 

    // handle joining or leaving a binding group 
    /*internal*/ public void OnBindingGroupChanged(boolean joining)
    {
        if (joining)
        { 
            // joining a binding group:
            // update Explicitly, unless declared otherwise 
            if (IsParentBindingUpdateTriggerDefault) 
            {
                if (IsUpdateOnLostFocus) 
                {
                    LostFocusEventManager.RemoveHandler(TargetElement, OnLostFocus);
                }

                SetUpdateSourceTrigger(UpdateSourceTrigger.Explicit);
            } 
        } 
        else
        { 
            // leaving a binding group:
            // restore update trigger
            if (IsParentBindingUpdateTriggerDefault)
            { 
                // do this asynchronously, to avoid event-leapfrogging.
                // In the template-swapping scenario (common in DataGrid) it's 
                // common to leave a binding group because you've lost focus. 
                // We don't want that focus-loss to cause an update.
                Dispatcher.BeginInvoke( 
                    DispatcherPriority.Loaded,
                    new DispatcherOperationCallback(RestoreUpdateTriggerOperation),
                    null);
            } 
        }
    } 

    Object RestoreUpdateTriggerOperation(Object arg)
    { 
        DependencyObject target = TargetElement;
        if (!IsDetached && target != null)
        {
            FrameworkPropertyMetadata fwMetaData = TargetProperty.GetMetadata(target.DependencyObjectType) as FrameworkPropertyMetadata; 

            UpdateSourceTrigger ust = GetDefaultUpdateSourceTrigger(fwMetaData); 
            SetUpdateSourceTrigger(ust); 

            if (IsUpdateOnLostFocus) 
            {
                LostFocusEventManager.AddHandler(target, OnLostFocus);
            }
        } 

        return null; 
    } 

    // register the leaf bindings with the binding group 
    /*internal*/ public abstract void UpdateBindingGroup(BindingGroup bg);

    /**
     * transfer a value from target to source
     * @return
     */
    /*internal*/ public boolean UpdateValue() 
    {
        ValidationError oldValidationError = BaseValidationError; 

        if (StatusInternal == BindingStatusInternal.UpdateSourceError)
            SetStatus(BindingStatusInternal.Active); 

        Object value = GetRawProposedValue();
        if (!Validate(value, ValidationStep.RawProposedValue))
            return false; 

        value = ConvertProposedValue(value); 
        if (!Validate(value, ValidationStep.ConvertedProposedValue)) 
            return false;

        value = UpdateSource(value);
        if (!Validate(value, ValidationStep.UpdatedValue))
            return false;

        value = CommitSource(value);
        if (!Validate(value, ValidationStep.CommittedValue)) 
            return false; 

        if (BaseValidationError == oldValidationError) 
        {
            // the binding is now valid - remove the old error
            UpdateValidationError(null, false);
        } 

        EndSourceUpdate(); 
        NotifyCommitManager(); 

        return !HasValue(Feature.ValidationError); 
    }

    /// <summary>
    /// Get the raw proposed value 
    /// <summary>
    /*internal*/ public /*virtual*/ Object GetRawProposedValue() 
    { 
        Object value = Value;

        // TargetNullValue is the UI representation of a "null" value.  Use null internally.
        if (Object.Equals(value, EffectiveTargetNullValue))
        {
            value = null; 
        }

        return value; 
    }

    /// <summary>
    /// Get the converted proposed value
    /// <summary>
    /*internal*/ public abstract Object ConvertProposedValue(Object rawValue); 

    /// <summary> 
    /// Get the converted proposed value and inform the binding group 
    /// <summary>
    /*internal*/ public abstract boolean ObtainConvertedProposedValue(BindingGroup bindingGroup); 

    /// <summary>
    /// Update the source value
    /// <summary> 
    /*internal*/ public abstract Object UpdateSource(Object convertedValue);

    /// <summary> 
    /// Update the source value and inform the binding group
    /// <summary> 
    /*internal*/ public abstract boolean UpdateSource(BindingGroup bindingGroup);

    /// <summary>
    /// Commit the source value 
    /// <summary>
    /*internal*/ public /*virtual*/ Object CommitSource(Object value) 
    { 
        return value;
    } 

    /// <summary>
    /// Store the value in the binding group
    /// </summary> 
    /*internal*/ public abstract void StoreValueInBindingGroup(Object value, BindingGroup bindingGroup);

    /**
     * Run validation rules for the given step
     * @param value
     * @param validationStep
     * @return
     */
    /*internal*/ public /*virtual*/ boolean Validate(Object value, ValidationStep validationStep)
    {
        if (value == Binding.DoNothing)
            return true; 

        if (value == DependencyProperty.UnsetValue) 
        { 
            SetStatus(BindingStatusInternal.UpdateSourceError);
            return false; 
        }

        // get old errors from this step - we're about to reevaluate those rules.
        ValidationError oldValidationError = GetValidationErrors(validationStep); 

        // ignore an error from the implicit DataError rule - this is checked 
        // separately (in BindingExpression.Validate).  [Dev10 575988] 
        if (oldValidationError != null &&
            oldValidationError.RuleInError == DataErrorValidationRule.Instance) 
        {
            oldValidationError = null;
        }

        Collection<ValidationRule> validationRules = ParentBindingBase.ValidationRulesInternal;

        if (validationRules != null) 
        {
            CultureInfo culture = GetCulture(); 

            for/*each*/ (ValidationRule validationRule : validationRules)
            {
                if (validationRule.ValidationStep == validationStep) 
                {
                    ValidationResult validationResult = validationRule.Validate(value, culture, this); 

                    if (!validationResult.IsValid)
                    { 
//                        if (TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.Update))
//                        {
//                            TraceData.Trace(TraceEventType.Warning,
//                                                TraceData.ValidationRuleFailed( 
//                                                    TraceData.Identify(this),
//                                                    TraceData.Identify(validationRule))); 
//                        } 

                        UpdateValidationError( new ValidationError(validationRule, this, validationResult.ErrorContent, null), false); 
                        return false; // kenlai:
                    }
                }
            } 
        }

        // this step is now valid - clear the old error (if any) 
        if (oldValidationError != null && oldValidationError == GetValidationErrors(validationStep))
        { 
            UpdateValidationError(null, false);
        }

        return true; 
    }

    /// <summary> 
    /// Run validation rules for the given step, and inform the binding group
    /// <summary> 
    /*internal*/ public abstract boolean CheckValidationRules(BindingGroup bindingGroup, ValidationStep validationStep);

    /// <summary>
    /// Get the proposed value(s) that would be written to the source(s), applying 
    /// conversion and checking UI-side validation rules.
    /// </summary> 
    /// <returns> 
    /// if binding is not dirty:  return true, (values = null)
    /// if conversion and validation succeed:  return true 
    /// if conversion or validation fails:  return false
    /// In the last two cases, values is set to a list of ProposedValue records
    /// describing the proposed values.  Each entry hold a BindingExpression
    /// and a value - the value is UnsetValue if the conversion or validation 
    /// failed.
    /// </returns> 
    /*internal*/ public abstract boolean ValidateAndConvertProposedValue(/*out*/ Collection<ProposedValue> values); 

    /*internal*/ public class ProposedValue 
    {
        /*internal*/ public ProposedValue(BindingExpression bindingExpression, Object rawValue, Object convertedValue)
        {
            _bindingExpression = bindingExpression; 
            _rawValue = rawValue;
            _convertedValue = convertedValue; 
        } 

        /*internal*/ public BindingExpression BindingExpression { get { return _bindingExpression; } } 
        /*internal*/ public Object RawValue { get { return _rawValue; } }
        /*internal*/ public Object ConvertedValue { get { return _convertedValue; } }

        BindingExpression   _bindingExpression; 
        Object              _rawValue;
        Object              _convertedValue; 
    } 

    /// <summary> 
    /// Compute the culture, either from the parent Binding, or from the target element.
    /// </summary>
    /*internal*/ public CultureInfo GetCulture()
    { 
        // lazy initialization, to let the target element acquire all its properties
        if (_culture == DefaultValueObject) 
        { 
            // explicit culture set in Binding
            _culture = ParentBindingBase.ConverterCultureInternal; 

            // if that doesn't work, use target element's xml:lang property
            if (_culture == null)
            { 
                DependencyObject target = TargetElement;
                if (target != null) 
                { 
                    if (IsInTransfer && (TargetProperty == FrameworkElement.LanguageProperty))
                    { 
                        // A binding for the Language property needs the value
                        // of the Language property.  This circularity is not
                        // supported (bug 1274874).
//                        if (TraceData.IsEnabled) 
//                        {
//                            TraceData.Trace(TraceEventType.Critical, TraceData.RequiresExplicitCulture, TargetProperty.Name, this); 
//                        } 

                        throw new InvalidOperationException(/*SR.Get(SRID.RequiresExplicitCulture, TargetProperty.Name)*/); 
                    }

                    // cache CultureInfo since requerying an inheritable property on every Transfer/Update can be quite expensive
                    // CultureInfo DP rarely changes once a XAML document is loaded. 
                    // To be 100% correct, changes to the CultureInfo attached DP should be tracked
                    // and cause a re-evaluation of this binding. 
                    _culture = ((XmlLanguage) target.GetValue(FrameworkElement.LanguageProperty)).GetSpecificCulture(); 
                }
            } 
        }
        return (CultureInfo)_culture;
    }

    /// <summary> Culture has changed.  Re-fetch the value with the new culture. </summary>
    /*internal*/ public void InvalidateCulture() 
    { 
        _culture = DefaultValueObject;
    } 

    /// <summary> Begin a source update </summary>
    /*internal*/ public void BeginSourceUpdate()
    { 
        ChangeFlag(PrivateFlags.iInUpdate, true);
    } 

    /// <summary> End a source update </summary>
    /*internal*/ public void EndSourceUpdate() 
    {
        if (IsInUpdate && IsDynamic && StatusInternal == BindingStatusInternal.Active)
        {
            // After a successful source update, always re-transfer the source value. 
            // This picks up changes that the source item may make in the setter,
            // and applies the converter (if any) to the value.  This fixes 
            // the so-called "$10 bug". 

            // When the target is a TextBox with a composition in effect, 
            // do this asynchronously, to avoid confusing the composition's Undo stack
            /*System.Windows.Controls.Primitives.*/TextBoxBase tbb = Target as /*System.Windows.Controls.Primitives.*/TextBoxBase;
            /*MS.Internal.Documents.*/UndoManager undoManager = (tbb == null) ? null :
                tbb.TextContainer.UndoManager; 
            if (undoManager != null &&
                undoManager.OpenedUnit != null && 
                undoManager.OpenedUnit.GetType() != typeof(/*System.Windows.Documents.*/TextParentUndoUnit)) 
            {
                if (!HasValue(Feature.UpdateTargetOperation)) 
                {
                    DispatcherOperation op = Dispatcher.BeginInvoke(DispatcherPriority.Send,
                        new DispatcherOperationCallback(UpdateTargetCallback),
                        null); 
                    SetValue(Feature.UpdateTargetOperation, op);
                } 
            } 
            else
            { 
                UpdateTarget();
            }
        }

        ChangeFlag(PrivateFlags.iInUpdate | PrivateFlags.iNeedsUpdate, false);
    } 

    Object UpdateTargetCallback(Object unused)
    { 
        ClearValue(Feature.UpdateTargetOperation);
        IsInUpdate = true;      // pretend to be in an update - as when this callback was posted
        UpdateTarget();
        IsInUpdate = false; 
        return null;
    } 

    // Consider the markup <Element A="x" B="{Binding...}"/>, and suppose
    // that setting A (to x) causes the element to assign a new value y for B. 
    // (Lots of examples of this:  e.g. setting Selector.SelectedIndex causes
    // Selector to assign a new value to Selector.SelectedItem.)  The end
    // result depends on what order the assignments are done.  If A=x happens
    // first, it assigns y to B but that is later overwritten by the 
    // data-bound value z;  if B happens first, the binding is installed and
    // produces the value z, then the assignment A=x sends the value y through 
    // the binding (if it's two-way) to the data source.  In other words, you 
    // end up with z in the first case, but y in the second, and only the
    // second case changes the data source. 
    //
    // The order of assignment (during initialization) is out of the user's
    // control, especially when the element is part of a template instance.
    // It can depend on the order in which static constructors are called, 
    // which can vary depending on which elements appear first in the markup.
    // To mitigate this mysterious behavior, the following code attempts to 
    // detect the situation and make it appear as if the binding always 
    // happened first.
    /*internal*/ public boolean ShouldUpdateWithCurrentValue(DependencyObject target, /*out*/ Object currentValue) 
    {
        if (IsReflective)
        {
            // the bad situation only arises during initialization. After that, 
            // the order of property assignments is determined by the app's
            // normal control flow.  Unfortunately, we can only detect 
            // initialization for framework elements;  fortunately, this covers 
            // all the known cases of the bad situation
            FrameworkObject fo = new FrameworkObject(target); 
            if (!fo.IsInitialized)
            {
                // if the target property (B) already has a changed value (y),
                // we're in the bad situation and should propagate y back to 
                // the data source
                DependencyProperty dp = TargetProperty; 
                EntryIndex entryIndex = target.LookupEntry(dp.GlobalIndex); 
                if (entryIndex.Found)
                { 
                    EffectiveValueEntry entry = target.GetValueEntry(entryIndex, dp, null, RequestFlags.RawEntry);
                    if (entry.IsCoercedWithCurrentValue)
                    {
                        currentValue = entry.GetFlattenedEntry(RequestFlags.FullyResolved).Value; 
                        if (entry.IsDeferredReference)
                        { 
                            DeferredReference deferredReference = (DeferredReference)currentValue; 
                            currentValue = deferredReference.GetValue(entry.BaseValueSourceInternal);
                        } 
                        return true;
                    }
                }
            } 
        }

        currentValue = null; 
        return false;
    } 


    /// <summary> change the value to the new value, and notify listeners </summary>
    /*internal*/ public void ChangeValue(Object newValue, boolean notify) 
    {
        Object oldValue = (_value != DefaultValueObject) ? _value : DependencyProperty.UnsetValue; 

        _value = newValue;

        if (notify && ValueChanged != null)
        {
            ValueChanged(this, new BindingValueChangedEventArgs(oldValue, newValue));
        } 
    }

    // after a successful transfer, mark the binding clean 
    /*internal*/ public void Clean()
    { 
        if (NeedsUpdate)
        {
            NeedsUpdate = false;
        } 

        if (!IsInUpdate) 
        { 
            NeedsValidation = false;
            NotifyCommitManager(); 
        }
    }

    /// <summary> the target value has changed - the source needs to be updated </summary> 
    /*internal*/ public void Dirty()
    { 
        if (!IsInTransfer && IsAttached)    // Dev11 377333:  don't react if the binding isn't attached 
        {
            NeedsUpdate = true; 

            if (!HasValue(Feature.Timer))
            {
                ProcessDirty(); 
            }
            else 
            { 
                // restart the timer
                DispatcherTimer timer = (DispatcherTimer)GetValue(Feature.Timer, null); 
                timer.Stop();
                timer.Start();
            }

            NotifyCommitManager();
        } 
    } 

    private void ProcessDirty() 
    {
        if (IsUpdateOnPropertyChanged)
        {
            if (Helper.IsComposing(Target, TargetProperty)) 
            {
                // wait for the IME composition to complete 
                IsUpdateDeferredForComposition = true; 
            }
            else 
            {
                // no composition, so update now
                Update();
            } 
        }
    } 

    void OnTimerTick(Object sender, EventArgs e)
    { 
        ProcessDirty();
    }

    void OnPreviewTextInput(Object sender, /*System.Windows.Input.*/TextCompositionEventArgs e) 
    {
        // if the IME composition we're waiting for completes, update the source. 
        if (IsUpdateDeferredForComposition && e.TextComposition.Source == TargetElement && e.TextComposition.Stage == /*System.Windows.Input.*/TextCompositionStage.Done) 
        {
            IsUpdateDeferredForComposition = false; 
            Dirty();
        }
    }

    // invalidate the target property
    /*internal*/ public void Invalidate(boolean isASubPropertyChange) 
    { 
        // don't invalidate during Attach.  The property engine does it
        // already, and it would interfere with the on-demand activation 
        // of style-defined BindingExpressions.
        if (IsAttaching)
            return;

        DependencyObject target = TargetElement;
        if (target != null) 
        { 
            if (IsInBindingExpressionCollection)
                ParentBindingExpressionBase.InvalidateChild(this); 
            else
            {
                if (TargetProperty != NoTargetProperty)
                { 
                    // recompute expression
                    if (!isASubPropertyChange) 
                    { 
                        target.InvalidateProperty(TargetProperty);
                    } 
                    else
                    {
                        target.NotifySubPropertyChange(TargetProperty);
                    } 
                }
            } 
        } 
    }

    /// <summary> use the Fallback or Default value, called when a real value is not available </summary>
    /*internal*/ public Object UseFallbackValue()
    {
        Object value = FallbackValue; 

        // if there's a problem with the fallback, use Default instead 
        if (value == DefaultValueObject) 
        {
            value = DependencyProperty.UnsetValue; 
        }

        // OneWayToSource bindings should initialize to the Fallback/Default
        // value without error 
        if (value == DependencyProperty.UnsetValue && IsOneWayToSource)
        { 
            value = DefaultValue; 
        }

        if (value != DependencyProperty.UnsetValue)
        {
            UsingFallbackValue = true;
        } 
        else
        { 
            // if fallback isn't available, use Default (except when in a binding collection) 
            if (StatusInternal == BindingStatusInternal.Active)
                SetStatus(BindingStatusInternal.UpdateTargetError); 

            if (!IsInBindingExpressionCollection)
            {
                value = DefaultValue; 

//                if (TraceData.IsEnabled) 
//                { 
//                    TraceData.Trace(TraceEventType.Information, TraceData.NoValueToTransfer, this);
//                } 
            }
        }

        return value; 
    }

    // determine if the given value is "null" (in a general sense) 
    /*internal*/ public static boolean IsNullValue(Object value)
    { 
        if (value == null)
            return true;

        if (Convert.IsDBNull(value)) 
            return true;

        if (SystemDataHelper.IsSqlNull(value)) 
            return true;

        return false;
    }

    // determine a "null" value appropriate for the given type 
    /*internal*/ public Object NullValueForType(Type type)
    { 
        if (type == null) 
            return null;

        if (SystemDataHelper.IsSqlNullableType(type))
            return SystemDataHelper.NullValueForSqlNullableType(type);

        if (!type.IsValueType) 
            return null;

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>)) 
            return null;

        return DependencyProperty.UnsetValue;
    }


    /*internal*/ public ValidationRule LookupValidationRule(Type type)
    { 
        ValidationRule result = ParentBindingBase.GetValidationRule(type); 

        if (result == null && HasValue(Feature.ParentBindingExpressionBase)) 
        {
            result = ParentBindingExpressionBase.LookupValidationRule(type);
        }

        return result;
    } 

    // discover the binding group (if any) that this binding should join,
    // and join it.  More precisely, cause the root binding to join. 
    /*internal*/ public void JoinBindingGroup(boolean isReflective, DependencyObject contextElement)
    {
        BindingGroup bindingGroup = RootBindingExpression.FindBindingGroup(isReflective, contextElement);

        if (bindingGroup != null)
        { 
            JoinBindingGroup(bindingGroup, /*explicit*/false); 
        }
    } 

    // remove the binding from its group
    /*internal*/ public void LeaveBindingGroup()
    { 
        BindingExpressionBase root = RootBindingExpression;
        BindingGroup bg = root.BindingGroup; 
        if (bg != null) 
        {
            bg.BindingExpressions.Remove(root); 
            root.ClearValue(Feature.BindingGroup);
        }
    }

    // reevaluate which binding group this binding should join, and perform
    // the change if required 
    /*internal*/ public void RejoinBindingGroup(boolean isReflective, DependencyObject contextElement) 
    {
        BindingExpressionBase root = RootBindingExpression; 
        BindingGroup oldBindingGroup = root.BindingGroup;

        // discover the binding group, as if this were the first time
        BindingGroup newBindingGroup; 
        WeakReference<BindingGroup> oldBindingGroupWR = (WeakReference<BindingGroup>)root.GetValue(Feature.BindingGroup, null);
        root.SetValue(Feature.BindingGroup, null, oldBindingGroupWR);   // not ClearValue, as we'll reset it soon 
        try 
        {
            newBindingGroup = root.FindBindingGroup(isReflective, contextElement); 
        }
        finally
        {
            root.SetValue(Feature.BindingGroup, oldBindingGroupWR, null); 
        }

        // if it's different from the current binding group, move 
        if (oldBindingGroup != newBindingGroup)
        { 
            root.LeaveBindingGroup();
            if (newBindingGroup != null)
            {
                JoinBindingGroup(newBindingGroup, /*explicit*/false); 
            }
        } 
    } 

    // discover the binding group (if any) that this root binding should join. 
    /*internal*/ public BindingGroup FindBindingGroup(boolean isReflective, DependencyObject contextElement)
    {
//        Debug.Assert(RootBindingExpression == this, "Only call this with a root binding");

        // if we've already joined (or failed to join) a group, just return the result
        if ((WeakReference<BindingGroup>)GetValue(Feature.BindingGroup, null) != null) 
        { 
            return BindingGroup;
        } 

        BindingGroup bg;
        String groupName = ParentBindingBase.BindingGroupName;

        // a null group name means "don't join any group".
        if (groupName == null) 
        { 
            MarkAsNonGrouped();
            return null; 
        }

        // an empty group name means join by DataContext
        if (String.IsNullOrEmpty(groupName)) 
        {
            // check further preconditions: 
            if (!isReflective ||                // must have target-to-source data flow 
                contextElement == null)         // must use data context
            { 
                // later child bindings might pass this test, so don't mark
                // this root binding as non-grouped yet
                return null;
            } 

            // only the innermost binding group is eligible 
            bg = (BindingGroup)contextElement.GetValue(FrameworkElement.BindingGroupProperty); 
            if (bg == null)
            { 
                MarkAsNonGrouped();
                return null;
            }

            // the context element must share data context with the group
            DependencyProperty dataContextDP = FrameworkElement.DataContextProperty; 
            DependencyObject groupContextElement = bg.InheritanceContext; 
            if (groupContextElement == null ||
                !Object.Equals( contextElement.GetValue(dataContextDP), 
                                groupContextElement.GetValue(dataContextDP)))
            {
                MarkAsNonGrouped();
                return null; 
            }

            // if the binding survives the gauntlet, return the group 
            return bg;
        } 

        // a non-empty group name means join by name
        else
        { 
            // walk up the tree, looking for a matching binding group
            DependencyProperty bindingGroupDP = FrameworkElement.BindingGroupProperty; 
            FrameworkObject fo = new FrameworkObject(Helper.FindMentor(TargetElement)); 
            while (fo.DO != null)
            { 
                BindingGroup bgCandidate = (BindingGroup)fo.DO.GetValue(bindingGroupDP);
                if (bgCandidate == null)
                {
                    MarkAsNonGrouped(); 
                    return null;
                } 

                if (bgCandidate.Name == groupName)
                { 
//                    if (bgCandidate.SharesProposedValues && TraceData.IsEnabled)
//                    {
//                        TraceData.Trace(TraceEventType.Warning,
//                                TraceData.SharesProposedValuesRequriesImplicitBindingGroup( 
//                                        TraceData.Identify(this),
//                                        groupName, 
//                                        TraceData.Identify(bgCandidate))); 
//                    }

                    // return the matching group
                    return bgCandidate;
                }

                fo = fo.FrameworkParent;
            } 

            // no match - report an error
//            if (TraceData.IsEnabled) 
//            {
//                TraceData.Trace(TraceEventType.Error,
//                        TraceData.BindingGroupNameMatchFailed(groupName),
//                        this); 
//            }

            MarkAsNonGrouped(); 
            return null;
        } 
    }

    // add a binding to the given binding group
    /*internal*/ public void JoinBindingGroup(BindingGroup bg, boolean explicitJoin) 
    {
        BindingExpressionBase root = null;  // set to non-null by the next loop 

        for (   BindingExpressionBase bindingExpr = this;
                bindingExpr != null; 
                bindingExpr = bindingExpr.ParentBindingExpressionBase)
        {
            root = bindingExpr;

            // bindings in a group update Explicitly, unless declared otherwise
            bindingExpr.OnBindingGroupChanged(/*joining*/true); 

            bg.AddToValueTable(bindingExpr);
        } 

        // add the root binding to the group
        if (!root.HasValue(Feature.BindingGroup))
        { 
            // use WeakReference because the BindingGroup contains a strong reference
            // to the visual tree (via InheritanceContext) 
            root.SetValue(Feature.BindingGroup, new WeakReference<BindingGroup>(bg)); 

            // when the group is implicitly discovered, always add the root binding to the group's collection. 
            // When the binding is added explicitly - via BindingGroup.BindingExpressions.Add() -
            // check first to see if it has already been added
            boolean addToGroup = explicitJoin ? !bg.BindingExpressions.Contains(root) : true;
            if (addToGroup) 
            {
                bg.BindingExpressions.Add(root); 
            } 

            // in the explicit case, register its items and values with the binding group 
            // (the implicit case does this when the bindings activate)
            if (explicitJoin)
            {
                root.UpdateBindingGroup(bg); 

//                if (bg.SharesProposedValues && TraceData.IsEnabled) 
//                { 
//                    TraceData.Trace(TraceEventType.Warning,
//                            TraceData.SharesProposedValuesRequriesImplicitBindingGroup( 
//                                    TraceData.Identify(root),
//                                    root.ParentBindingBase.BindingGroupName,
//                                    TraceData.Identify(bg)));
//                } 
            }
        } 
        else 
        {
            if (root.BindingGroup != bg) 
                throw new InvalidOperationException(/*SR.Get(SRID.BindingGroup_CannotChangeGroups)*/);
        }
    }

    // mark a binding as non-grouped, so that we avoid doing the discovery again
    void MarkAsNonGrouped() 
    { 
        // Leaf bindings only get asked once, so there's no need to add a mark
        if (!(this instanceof BindingExpression)) 
        {
            SetValue(Feature.BindingGroup, NullBindingGroupReference);
        }
    } 

    // add to, or remove from, the CommitManager's set of dirty/invalid bindings 
    /*internal*/ public void NotifyCommitManager() 
    {
        if (IsReflective && !IsDetached && !Engine.IsShutDown) 
        {
            boolean shouldStore = IsEligibleForCommit && (IsDirty || HasValidationError);
            BindingExpressionBase root = RootBindingExpression;
            BindingGroup bg = root.BindingGroup; 

            root.UpdateCommitState(); 

            if (bg == null)
            { 
                if (root != this && !shouldStore)
                {
                    shouldStore = root.IsEligibleForCommit && (root.IsDirty || root.HasValidationError);
                } 

                if (shouldStore) 
                { 
                    Engine.CommitManager.AddBinding(root);
                } 
                else
                {
                    Engine.CommitManager.RemoveBinding(root);
                } 
            }
            else 
            { 
                if (!shouldStore)
                { 
                    shouldStore = (bg.Owner != null) && (bg.IsDirty || bg.HasValidationError);
                }

                if (shouldStore) 
                {
                    Engine.CommitManager.AddBindingGroup(bg); 
                } 
                else
                { 
                    Engine.CommitManager.RemoveBindingGroup(bg);
                }
            }
        } 
    }

    /*internal*/ public /*virtual*/ void UpdateCommitState() 
    {
        // for most bindings, the state is already current 
    }

    // adopt the properties of another binding.   Called by PriorityBindingExpression
    // when its active binding changes.   (Implemented here to get access to private flags.) 
    /*internal*/ public void AdoptProperties(BindingExpressionBase bb)
    { 
        PrivateFlags newFlags = (bb != null) ? bb._flags : (PrivateFlags)0x0; 
        _flags = (_flags & ~PrivateFlags.iAdoptionMask) | (newFlags & PrivateFlags.iAdoptionMask);
    } 

    /// <summary>
    /// Handle events from the centralized event table
    /// </summary> 
    /*internal*/ public /*virtual*/ boolean ReceiveWeakEvent(Type managerType, Object sender, EventArgs e)
    { 
        return false;       // unrecognized event 
    }

    /*internal*/ public /*virtual*/ void OnLostFocus(Object sender, RoutedEventArgs e)
    {
    }

    // Return the Object from which the given value was obtained, if possible
    /*internal*/ public abstract Object GetSourceItem(Object newValue); 

    private boolean TestFlag(PrivateFlags flag)
    { 
        return (_flags & flag) != 0;
    }

    private void ChangeFlag(PrivateFlags flag, boolean value) 
    {
        if (value)  _flags |=  flag; 
        else        _flags &= ~flag; 
    }

    //-----------------------------------------------------
    //
    //  Internal Properties
    // 
    //------------------------------------------------------

    // A BindingExpression cannot hold a strong reference to the target element - this 
    // leads to memory leaks (bug 871139).  The problem is that BindingExpression and its workers
    // register for events from the data item, creating a reference from 
    // the data item to the BindingExpression.  The data item typically has a long lifetime,
    // so if the BindingExpression held a SR to the target, the target element would
    // also stay alive forever.
    //      Instead, BindingExpression holds a WeakReference to the target.  This means we 
    // have to check it before dereferencing (here), and cope when the
    // reference fails (in callers to this property).  Requests for the TargetElement 
    // are not trivial, so callers should request it once and cache the result 
    // in a local variable.  They should not save it in a global or instance
    // variable of course;  that would defeat the purpose of the WR. 
    //      This allows the target element to be GC'd when it's no longer in
    // use by the tree or application.  The next time the BindingExpression asks for
    // its TargetElement, the WR will fail.  At this point, the BindingExpression is no
    // longer useful, so it can sever all connections to the outside world (i.e. 
    // stop listening for events).  This allows the BindingExpression itself to be GC'd.
    /*internal*/ public DependencyObject TargetElement 
    { 
        get
        { 
            if (_targetElement != null)
            {
                DependencyObject result = _targetElement.Target as DependencyObject;
                if (result != null) 
                    return result;

                // target has been GC'd, sever all connections 
                _targetElement = null;      // prevents re-entry from Detach()
                Detach(); 
            }

            return null;
        } 
    }

    /*internal*/ public WeakReference TargetElementReference 
    {
        get { return _targetElement; } 
    }

    /*internal*/ public DataBindEngine Engine
    { 
        get { return _engine; }
    } 

    /*internal*/ public Dispatcher Dispatcher
    { 
        get { return (_engine != null) ? _engine.Dispatcher : null; }
    }

    /*internal*/ public Object Value 
    {
        get 
        { 
            if (_value == DefaultValueObject)
            { 
                // don't notify listeners.  This isn't a real value change.
                ChangeValue(UseFallbackValue(), false /*notify*/);
            }
            return _value; 
        }
        set 
        { 
            ChangeValue(value, true);
            Dirty(); 
        }
    }

    /*internal*/ public WeakDependencySource[] WeakSources 
    {
        get { return _sources; } 
    } 

    // queried by MultiBindings.  Only implemented today by BindingExpression. 
    // If we ever support nested MultiBindings, implement this in MultiBinding
    // as well.
    /*internal*/ public /*virtual*/ boolean IsDisconnected
    { 
        get { return false; }
    } 

    /// <summary>
    ///     NoTarget DependencyProperty, a placeholder used by BindingExpressions with no target property 
    /// </summary>
    /*internal*/ public static final DependencyProperty NoTargetProperty =
            DependencyProperty.RegisterAttached("NoTarget", typeof(Object), typeof(BindingExpressionBase),
                                        new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.None)); 

    //------------------------------------------------------ 
    // 
    //  Internal Methods
    // 
    //-----------------------------------------------------

    /// <summary>
    /// Attach the binding expression to the given target Object and property. 
    /// </summary>
    /*internal*/ public void Attach(DependencyObject target, DependencyProperty dp) 
    { 
        // make sure we're on the right thread to access the target
        if (target != null) 
        {
            target.VerifyAccess();
        }

        IsAttaching = true;
        AttachOverride(target, dp); 
        IsAttaching = false; 
    }

    /// <summary>
    /// Detach the binding expression from its target Object and property.
    /// </summary>
    /*internal*/ public void Detach() 
    {
        if (IsDetached || IsDetaching) 
            return; 

        IsDetaching = true; 

        // leave the binding group before doing anything else, so as to preserve
        // a proposed value (if any).
        LeaveBindingGroup(); 

        // remove from CommitManager 
        NotifyCommitManager(); 

        DetachOverride(); 
        IsDetaching = false;
    }

    // disconnect from sources, and update the target property as cheaply as possible 
    /*internal*/ public /*virtual*/ void Disconnect()
    { 
        // determine the new value (if any) to expose 
        Object newValue = DependencyProperty.UnsetValue;    // usually none
        DependencyProperty targetDP = TargetProperty; 

        if (targetDP == ContentControl.ContentProperty ||
            targetDP == ContentPresenter.ContentProperty ||
            targetDP == HeaderedItemsControl.HeaderProperty || 
            targetDP == HeaderedContentControl.HeaderProperty)
        { 
            // pass DisconnectedItem through content-like properties, so 
            // that their descendent bindings can disconnect
            newValue = DisconnectedItem; 
        }

        if (targetDP.PropertyType == typeof(/*System.Collections.*/IEnumerable))
        { 
            // set IEnumerable properties (e.g. ItemsSource) to null, so that
            // the control can disconnect from the individual items 
            newValue = null; 
        }

        // notify the target property about the new value (cheaply)
        if (newValue != DependencyProperty.UnsetValue)
        {
            ChangeValue(newValue, false); 
            Invalidate(false);
        } 
    } 

    /*internal*/ public void SetStatus(BindingStatusInternal status) 
    {
        if (IsDetached && status != _status)
        {
            throw new InvalidOperationException(/*SR.Get(SRID.BindingExpressionStatusChanged, _status, status)*/); 
        }

        _status = status; 
    }

    // convert a user-supplied fallback value to a usable equivalent
    //  returns:    UnsetValue          if user did not supply a fallback value
    //              value               if fallback value is legal
    //              DefaultValueObject  otherwise 
    /*internal*/ public static Object ConvertFallbackValue(Object value, DependencyProperty dp, Object sender)
    { 
        Exception e; 
        Object result = ConvertValue(value, dp, /*out*/ e);

        if (result == DefaultValueObject)
        {
//            if (TraceData.IsEnabled)
//            { 
//                TraceData.Trace(TraceEventType.Error,
//                        TraceData.FallbackConversionFailed( 
//                            AvTrace.ToStringHelper(value), 
//                            AvTrace.TypeName(value),
//                            dp.Name, 
//                            dp.PropertyType.Name),
//                        sender, e);
//            }
        } 

        return result; 
    } 

    // convert a user-supplied TargetNullValue to a usable equivalent 
    //  returns:    UnsetValue          if user did not supply a fallback value
    //              value               if fallback value is legal
    //              DefaultValueObject  otherwise
    /*internal*/ public static Object ConvertTargetNullValue(Object value, DependencyProperty dp, Object sender) 
    {
        Exception e; 
        Object result = ConvertValue(value, dp, /*out*/ e); 

        if (result == DefaultValueObject) 
        {
//            if (TraceData.IsEnabled)
//            {
//                TraceData.Trace(TraceEventType.Error, 
//                        TraceData.TargetNullValueConversionFailed(
//                            AvTrace.ToStringHelper(value), 
//                            AvTrace.TypeName(value), 
//                            dp.Name,
//                            dp.PropertyType.Name), 
//                        sender, e);
//            }
        }

        return result;
    } 

    static Object ConvertValue(Object value, DependencyProperty dp, /*out*/ Exception e)
    { 
        Object result;
        e = null;

        if (value == DependencyProperty.UnsetValue || dp.IsValidValue(value)) 
        {
            result = value; 
        } 
        else
        { 
            result = null;  // placeholder to keep compiler happy
            // if value isn't the right type, use a type converter to get a better value
            boolean success = false;
            TypeConverter converter = DefaultValueConverter.GetConverter(dp.PropertyType); 
            if (converter != null && converter.CanConvertFrom(value.GetType()))
            { 
                // PreSharp uses message numbers that the C# compiler doesn't know about. 
                // Disable the C# complaints, per the PreSharp documentation.
//                #pragma warning disable 1634, 1691 

                // PreSharp complains about catching NullReference (and other) exceptions.
                // It doesn't recognize that IsCriticalException() handles these correctly.
//                #pragma warning disable 56500 

                try 
                { 
                    result = converter.ConvertFrom(null, CultureInfo.InvariantCulture, value);
                    success = dp.IsValidValue(result); 
                }

                // Catch all exceptions.  If we can't convert the fallback value, it doesn't
                // matter why not;  we should always use the default value instead. 
                // (See bug 1853628 for an example of a converter that throws
                // an exception not mentioned in the documentation for ConvertFrom.) 
                catch (Exception ex) 
                {
                    e = ex; 
                }
                catch // non CLS compliant exception
                {
                } 

//                #pragma warning restore 56500 
//                #pragma warning restore 1634, 1691 
            }

            if (!success)
            {
                // if can't convert it, don't use it
                result = DefaultValueObject; 
            }
        } 

        return result;
    } 

    // Certain trace reports should be marked as 'error' unless the binding
    // is prepared to handle it in some way (e.g. FallbackValue), in which
    // case 'warning'. 
    /*internal*/ public TraceEventType TraceLevel
    { 
        get 
        {
            // FallbackValue is present 
            if (ParentBindingBase.FallbackValue != DependencyProperty.UnsetValue)
                return TraceEventType.Warning;

            // Binding is a member of MultiBinding or PriorityBinding 
            if (IsInBindingExpressionCollection)
                return TraceEventType.Warning; 

            // all other cases - error
            return TraceEventType.Error; 
        }
    }

    /*internal*/ public /*virtual*/ void Activate() 
    {
    } 

    /*internal*/ public /*virtual*/ void Deactivate()
    { 
    }

    /*internal*/ public boolean Update()
    { 
        if (HasValue(Feature.Timer))
        { 
            DispatcherTimer timer = (DispatcherTimer)GetValue(Feature.Timer, null); 
            timer.Stop();
        } 

        return UpdateOverride();
    }

    /*internal*/ public /*virtual*/ boolean UpdateOverride()
    { 
        return true; 
    }

    /*internal*/ public void UpdateValidationError(ValidationError validationError, boolean skipBindingGroup/*=false*/)
    {
        // the steps are carefully ordered to avoid going through a "no error"
        // state while replacing one error with another 
        ValidationError oldValidationError = BaseValidationError;

        SetValue(Feature.ValidationError, validationError, null); 

        if (validationError != null) 
        {
            AddValidationError(validationError, skipBindingGroup);
        }

        if (oldValidationError != null)
        { 
            RemoveValidationError(oldValidationError, skipBindingGroup); 
        }
    } 

    /*internal*/ public void UpdateNotifyDataErrorValidationErrors(List<Object> errors)
    {
        List<Object> toAdd; 
        List<ValidationError> toRemove;

        GetValidationDelta(NotifyDataErrors, errors, /*out*/ toAdd, /*out*/ toRemove); 

        // add the new errors, then remove the old ones - this avoid a transient 
        // "no error" state
        if (toAdd != null && toAdd.Count > 0)
        {
            ValidationRule rule = NotifyDataErrorValidationRule.Instance; 
            List<ValidationError> notifyDataErrors = NotifyDataErrors;

            if (notifyDataErrors == null) 
            {
                notifyDataErrors = new List<ValidationError>(); 
                SetValue(Feature.NotifyDataErrors, notifyDataErrors);
            }

            for/*each*/ (Object o : toAdd) 
            {
                ValidationError veAdd = new ValidationError(rule, this, o, null); 
                notifyDataErrors.Add(veAdd); 
                AddValidationError(veAdd);
            } 
        }

        if (toRemove != null && toRemove.Count > 0)
        { 
            List<ValidationError> notifyDataErrors = NotifyDataErrors;
            for/*each*/ (ValidationError veRemove : toRemove) 
            { 
                notifyDataErrors.Remove(veRemove);
                RemoveValidationError(veRemove); 
            }

            if (notifyDataErrors.Count == 0)
                ClearValue(Feature.NotifyDataErrors); 
        }
    } 

    /*internal*/ public static void GetValidationDelta(List<ValidationError> previousErrors, List<Object> errors, /*out*/ List<Object> toAdd, /*out*/ List<ValidationError> toRemove)
    { 
        // determine the errors to add and the validation results to remove,
        // taking duplicates into account
        if (previousErrors == null || previousErrors.Count == 0)
        { 
            toAdd = errors;
            toRemove = null; 
        } 
        else if (errors == null || errors.Count == 0)
        { 
            toAdd = null;
            toRemove = new List<ValidationError>(previousErrors);
        }
        else 
        {
            toAdd = new List<Object>(); 
            toRemove = new List<ValidationError>(previousErrors); 

            for (int i=errors.Count-1; i>=0; --i) 
            {
                Object errorContent = errors[i];

                int j; 
                for (j=toRemove.Count-1; j>=0; --j)
                { 
                    if (Object.Equals(toRemove[j].ErrorContent, errorContent)) 
                    {
                        // this error appears on both lists - remove it from toRemove 
                        toRemove.RemoveAt(j);
                        break;
                    }
                } 

                if (j<0) 
                { 
                    // this error didn't appear on toRemove - add it to toAdd
                    toAdd.Add(errorContent); 
                }
            }
        }
    } 

    /*internal*/ public void AddValidationError(ValidationError validationError, boolean skipBindingGroup/*=false*/) 
    { 
        // add the error to the target element
        Validation.AddValidationError(validationError, TargetElement, NotifyOnValidationError); 

        // add the error to the binding group's target element
        if (!skipBindingGroup)
        { 
            BindingGroup bindingGroup = BindingGroup;
            if (bindingGroup != null) 
            { 
                bindingGroup.AddValidationError(validationError);
            } 
        }
    }

    /*internal*/ public void RemoveValidationError(ValidationError validationError, boolean skipBindingGroup/*=false*/) 
    {
        // remove the error from the target element 
        Validation.RemoveValidationError(validationError, TargetElement, NotifyOnValidationError); 

        // remove the error from the binding group's target element 
        if (!skipBindingGroup)
        {
            BindingGroup bindingGroup = BindingGroup;
            if (bindingGroup != null) 
            {
                bindingGroup.RemoveValidationError(validationError); 
            } 
        }
    } 

    // get all errors raised at the given step, in preparation for running
    // the rules at that step
    /*internal*/ public ValidationError GetValidationErrors(ValidationStep validationStep) 
    {
        ValidationError validationError = BaseValidationError; 
        if (validationError == null || validationError.RuleInError.ValidationStep != validationStep) 
            return null;

        return validationError;
    }

    /*internal*/ public void ChangeSources(WeakDependencySource[] newSources) 
    {
        if (IsInBindingExpressionCollection) 
            ParentBindingExpressionBase.ChangeSourcesForChild(this, newSources); 
        else
            ChangeSources(TargetElement, TargetProperty, newSources); 

        // store the sources with weak refs, so they don't cause memory leaks (bug 980041)
        _sources = newSources;
    } 

    /// <summary> 
    /// combine the sources of BindingExpressions, using new sources for 
    /// the BindingExpression at the given index
    /// </summary> 
    /// <param name="index">-1 to indicate new sources</param>
    /// <param name="bindingExpressions">collection of child binding expressions </param>
    /// <param name="count">how many child expressions to include</param>
    /// <param name="newSources">use null when no new sources</param> 
    /// <param name="commonSources">sources not tied to any of the binding expressions</param>
    /// <returns></returns> 
    /*internal*/ public static WeakDependencySource[] CombineSources(int index, 
                                    Collection<BindingExpressionBase> bindingExpressions,
                                    int count, 
                                    WeakDependencySource[] newSources,
                                    WeakDependencySource[] commonSources /*= null*/)
    {
        if (index == count) 
        {
            // Be sure to include newSources if they are being appended 
            count++; 
        }

        Collection<WeakDependencySource> tempList = new Collection<WeakDependencySource>();

        if (commonSources != null)
        { 
            for (int i=0; i < commonSources.length; ++i)
            { 
                tempList.Add(commonSources[i]); 
            }
        } 

        for (int i = 0; i < count; ++i)
        {
            BindingExpressionBase bindExpr = bindingExpressions[i]; 
            WeakDependencySource[] sources = (i==index) ? newSources :
                                        (bindExpr != null) ? bindExpr.WeakSources : 
                                        null; 
            int m = (sources == null) ? 0 : sources.length;
            for (int j = 0; j < m; ++j) 
            {
                WeakDependencySource candidate = sources[j];

                // don't add duplicate source 
                for (int k = 0; k < tempList.Count; ++k)
                { 
                    WeakDependencySource prior = tempList[k]; 
                    if (candidate.DependencyObject == prior.DependencyObject &&
                        candidate.DependencyProperty == prior.DependencyProperty) 
                    {
                        candidate = null;
                        break;
                    } 
                }

                if (candidate != null) 
                    tempList.Add(candidate);
            } 
        }

        WeakDependencySource[] result;
        if (tempList.Count > 0) 
        {
            result = new WeakDependencySource[tempList.Count]; 
            tempList.CopyTo(result, 0); 
            tempList.Clear();
        } 
        else
        {
            result = null;
        } 

        return result; 
    } 

    /*internal*/ public void ResolvePropertyDefaultSettings(BindingMode mode, UpdateSourceTrigger updateTrigger, FrameworkPropertyMetadata fwMetaData) 
    {
        // resolve "property-default" dataflow
        if (mode == BindingMode.Default)
        { 
            BindingFlags f = BindingFlags.OneWay;
            if (fwMetaData != null && fwMetaData.BindsTwoWayByDefault) 
            { 
                f = BindingFlags.TwoWay;
            } 

            ChangeFlag(PrivateFlags.iPropagationMask, false);
            ChangeFlag((PrivateFlags)f, true);

//            if (TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.ResolveDefaults))
//            { 
//                TraceData.Trace(TraceEventType.Warning, 
//                                    TraceData.ResolveDefaultMode(
//                                        TraceData.Identify(this), 
//                                        (f == BindingFlags.OneWay) ? BindingMode.OneWay : BindingMode.TwoWay));
//            }
        }

//        Debug.Assert((_flags & PrivateFlags.iPropagationMask) != PrivateFlags.iPropDefault,
//            "BindingExpression should not have Default propagation"); 

        // resolve "property-default" update trigger
        if (updateTrigger == UpdateSourceTrigger.Default) 
        {
            UpdateSourceTrigger ust = GetDefaultUpdateSourceTrigger(fwMetaData);

            SetUpdateSourceTrigger(ust); 

//            if (TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.ResolveDefaults)) 
//            { 
//                TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.ResolveDefaultUpdate( 
//                                        TraceData.Identify(this),
//                                        ust));
//            }
        } 

//        Invariant.Assert((_flags & PrivateFlags.iUpdateMask) != PrivateFlags.iUpdateDefault, 
//            "BindingExpression should not have Default update trigger"); 
    }

    // return the effective update trigger, used when binding doesn't set one explicitly
    /*internal*/ public UpdateSourceTrigger GetDefaultUpdateSourceTrigger(FrameworkPropertyMetadata fwMetaData)
    {
        UpdateSourceTrigger ust = 
            IsInMultiBindingExpression ? UpdateSourceTrigger.Explicit :
            (fwMetaData != null) ? fwMetaData.DefaultUpdateSourceTrigger : 
                                UpdateSourceTrigger.PropertyChanged; 
        return ust;
    } 

    /*internal*/ public void SetUpdateSourceTrigger(UpdateSourceTrigger ust)
    {
        ChangeFlag(PrivateFlags.iUpdateMask, false); 
        ChangeFlag((PrivateFlags)BindingBase.FlagsFrom(ust), true);
    } 

    /*internal*/ public Type GetEffectiveTargetType()
    { 
        Type targetType = TargetProperty.PropertyType;
        BindingExpressionBase be = this.ParentBindingExpressionBase;

        while (be != null) 
        {
            if (be instanceof MultiBindingExpression) 
            { 
                // for descendants of a MultiBinding, the effective target
                // type is Object. 
                targetType = typeof(Object);
                break;
            }

            be = be.ParentBindingExpressionBase;
        } 

        return targetType;
    } 

    /*internal*/ public void DetermineEffectiveStringFormat()
    {
        Type targetType = TargetProperty.PropertyType; 
        if (targetType != typeof(String))
        { 
            // if the target type isn't String, we don't need a String format 
            return; // _effectiveStringFormat is already null
        } 

        // determine the effective target type and the declared String format
        // by looking up the tree of binding expressions
        String stringFormat = ParentBindingBase.StringFormat; 
        BindingExpressionBase be = this.ParentBindingExpressionBase;

        while (be != null) 
        {
            if (be instanceof MultiBindingExpression) 
            {
                // MultiBindings should receive Object values, not String
                targetType = typeof(Object);
                break; 
            }
            else if (stringFormat == null && be is PriorityBindingExpression) 
            { 
                // use a PriorityBinding's String format, unless we already
                // have a more specific one 
                stringFormat = be.ParentBindingBase.StringFormat;
            }

            be = be.ParentBindingExpressionBase; 
        }

        // if we need a String format, cache it 
        if (targetType == typeof(String))
        { 
//            #if NotToday
            // special case: when these conditions all apply
            //      a) target element belongs to a DataTemplate
            //      b) template was found by implicit (type-based) lookup 
            //      c) container (ContentPresenter) has a String format
            //      d) binding has no effective String format 
            // then use the CP's String format.  This enables scenarios like 
            //      <DataTemplate DataType="{x:Type Customer}">
            //          <TextBlock Text="{Binding Path=AmountPayable}" 
            //      </DataTemplate>
            //      <ContentControl Content="{StaticResource MyCustomer}" ContentStringFormat="C2"/>
            // where you'd like to control the format at the point of use,
            // rather than at the point of template declaration.  This is 
            // especially useful when the template is declared in a global place
            // like app resources or a theme file.  In particular it makes the 
            // GroupStyle.HeaderStringFormat property work;  the template for 
            // GroupItem is defined in the theme, but needs to pick up formatting
            // from the app's markup. 

            if (stringFormat == null)   // (d)
            {
                FrameworkObject fo = new FrameworkObject(Helper.FindMentor(TargetElement)); 
                ContentPresenter cp = fo.TemplatedParent as ContentPresenter;
                if (cp != null &&                       // (a) 
                    cp.ContentStringFormat != null)     // (c) 
                {
                    DataTemplate dt = cp.TemplateInternal as DataTemplate; 
                    if (dt != null &&                   // (a)
                        dt.DataType != null)            // (b)
                    {
                        stringFormat = cp.ContentStringFormat; 
                    }
                } 
            } 
//            #endif

            if (!String.IsNullOrEmpty(stringFormat))
            {
                SetValue(Feature.EffectiveStringFormat, Helper.GetEffectiveStringFormat(stringFormat), null);
            } 
        }
    } 

    /*internal*/ public void DetermineEffectiveTargetNullValue()
    { 
        Type targetType = TargetProperty.PropertyType;

        // determine the effective target type and the declared TargetNullValue
        // by looking up the tree of binding expressions 
        Object targetNullValue = ParentBindingBase.TargetNullValue;
        BindingExpressionBase be = this.ParentBindingExpressionBase; 

        while (be != null)
        { 
            if (be instanceof MultiBindingExpression)
            {
                // MultiBindings should receive Object values
                targetType = typeof(Object); 
                break;
            } 
            else if (targetNullValue == DependencyProperty.UnsetValue && be instanceof PriorityBindingExpression) 
            {
                // use a PriorityBinding's TargetNullValue, unless we already 
                // have a more specific one
                targetNullValue = be.ParentBindingBase.TargetNullValue;
            }

            be = be.ParentBindingExpressionBase;
        } 

        // if user declared a TargetNullValue, make sure it has the right type.
        if (targetNullValue != DependencyProperty.UnsetValue) 
        {
            targetNullValue = ConvertTargetNullValue(targetNullValue, TargetProperty, this);
            if (targetNullValue == DefaultValueObject)
            { 
                // if not, ignore it (having logged a trace message)
                targetNullValue = DependencyProperty.UnsetValue; 
            } 
        }

        // for back-compat, don't turn on TargetNullValue unless user explicitly
        // asks for it.  This means users have to add TargetNullValue to get
        // pretty basic scenarios to work (e.g. binding a TextBox to a database
        // String field that supports DBNull).  It's painful, but can't be 
        // helped.
//        #if TargetNullValueBC //BreakingChange 
        // if no declared (or poorly declared) value, make one up 
        if (targetNullValue == DependencyProperty.UnsetValue)
        { 
            targetNullValue = NullValueForType(targetType);
        }
//        #endif

        SetValue(Feature.EffectiveTargetNullValue, targetNullValue, DependencyProperty.UnsetValue);
    } 

    void DetermineEffectiveUpdateBehavior()
    { 
        // only need to honor update behavior when the binding does updates,
        // and isn't governed by a multibinding (which drives the updates)
        if (!IsReflective)
            return; 
        for (BindingExpressionBase ancestor = ParentBindingExpressionBase;
                ancestor != null;  ancestor = ancestor.ParentBindingExpressionBase) 
        { 
            if (ancestor instanceof MultiBindingExpression)
                return; 
        }

        // get the update behavior (delay, validation, preview) from the Binding
        int delay = ParentBindingBase.Delay; 

        if (delay > 0 && (IsUpdateOnPropertyChanged)) 
        { 
            DispatcherTimer timer = new DispatcherTimer();
            SetValue(Feature.Timer, timer); 
            timer.Interval = TimeSpan.FromMilliseconds(delay);
            timer.Tick += new EventHandler(OnTimerTick);
        }
    } 

    /*internal*/ public void DetermineEffectiveValidatesOnNotifyDataErrors() 
    { 
        boolean result = ParentBindingBase.ValidatesOnNotifyDataErrorsInternal;
        BindingExpressionBase beb = ParentBindingExpressionBase; 
        while (result && beb != null)
        {
            result = beb.ValidatesOnNotifyDataErrors;
            beb = beb.ParentBindingExpressionBase; 
        }
        ChangeFlag(PrivateFlags.iValidatesOnNotifyDataErrors, result); 
    } 

    // To prevent memory leaks, we store WeakReferences to certain objects 
    // in various places:  _dataItem, _sources, worker fields.  The logic
    // for this is centralized in these two static methods.  (See bug 940041)

    /*internal*/ public static Object CreateReference(Object item) 
    {
        // One source of leaks is the reference cycle formed when a BindingExpression's 
        // source item contains a reference chain to the target element: 
        //      target -> BindingExpression -> source item -> target
        // 
        // Making the second link into a WeakReference incurs some cost,
        // so it should be avoided if we know the third link never exists.
        // We definitely can't avoid this when the item is a DependencyObject,
        // since it's reasonably common for the third link to occur (e.g. 
        // a ContextMenu contains a link to its Popup, which has a property
        // bound back to the ContextMenu). 
        // 
        // For safety, we choose to use WeakRef all the time, unless the item is null.
        // Exception (bug 1124954):  Keep a strong reference to 
        // BindingListCollectionView - this keeps the underlying DataView
        // alive, when nobody else will.
        // Exception (bug 1970505):  Don't allocate a WeakRef for the common
        // case of the NullDataItem 

        if (item != null && 
            !(item instanceof BindingListCollectionView) && 
            !(item == BindingExpression.NullDataItem) &&
            !(item == DisconnectedItem)) 
        {
            item = new WeakReference(item);
        }

//#if USE_ITEM_REFERENCE
//        item = new ItemReference(item); 
//#endif 

        return item; 
    }

    // like CreateReference, but use an existing WeakReference
    /*internal*/ public static Object CreateReference(WeakReference item) 
    {
        Object result = item; 
//#if USE_ITEM_REFERENCE 
//        result = new ItemReference(item);
//#endif 
        return result;
    }

    // like CreateReference, except re-target the old WeakReference (if any) 
    /*internal*/ public static Object ReplaceReference(Object oldReference, Object item)
    { 
        if (item != null && 
            !(item instanceof BindingListCollectionView) &&
            !(item == BindingExpression.NullDataItem) && 
            !(item == DisconnectedItem))
        {
//#if USE_ITEM_REFERENCE
            // if this cast fails, it's because you have done a direct assignment of an 
            // item to some field instead of assigning the result of CreateReference.
//            oldReference = ((ItemReference)oldReference).Item; 
//#endif 
            WeakReference wr = oldReference as WeakReference;
            if (wr != null) 
            {
                wr.Target = item;
                item = wr;
            } 
            else
            { 
                item = new WeakReference(item); 
            }
        } 

//#if USE_ITEM_REFERENCE
//        item = new ItemReference(item);
//#endif 

        return item; 
    } 

    /*internal*/ public static Object GetReference(Object reference) 
    {
        if (reference == null)
            return null;

//#if USE_ITEM_REFERENCE
        // if this cast fails, it's because you have done a direct assignment of an 
        // item to some field instead of assigning the result of CreateReference. 
//        reference = ((ItemReference)reference).Item;
//#endif 

        WeakReference wr = reference as WeakReference;
        if (wr != null)
            return wr.Target; 
        else
            return reference; 
    } 

    /*internal*/ public static void InitializeTracing(BindingExpressionBase expr, DependencyObject d, DependencyProperty dp) 
    {
        BindingBase parent = expr.ParentBindingBase;
    }

    //------------------------------------------------------
    // 
    //  Private Methods 
    //
    //----------------------------------------------------- 

//#if USE_ITEM_REFERENCE

//    private class ItemReference 
//    {
//        /*internal*/ public ItemReference(Object item) 
//        { 
//            _item = item;
//        } 
//
//        /*internal*/ public Object Item { get { return _item; } }
//
//        Object _item; 
//    }

//#endif 

    // change WeakDependencySources to (strong) DependencySources, and notify 
    // the property engine about the new sources
    void ChangeSources(DependencyObject target, DependencyProperty dp, WeakDependencySource[] newSources)
    {
        DependencySource[] sources; 

        if (newSources != null) 
        { 
            // convert weak reference to strong
            sources = new DependencySource[newSources.length]; 
            int n = 0;
            for (int i = 0; i < newSources.length; ++i)
            {
                DependencyObject sourceDO = newSources[i].DependencyObject; 
                if (sourceDO != null)
                { 
                    // only include sources that are still alive 
                    sources[n++] = new DependencySource(sourceDO, newSources[i].DependencyProperty);
                } 
            }

            // if any of the sources were no longer alive, trim the array
            if (n < newSources.length) 
            {
                DependencySource[] temp; 
                if (n > 0) 
                {
                    temp = new DependencySource[n]; 
                    Array.Copy(sources, 0, temp, 0, n);
                }
                else
                { 
                    temp = null;
                } 

                sources = temp;
            } 
        }
        else
        {
            sources = null; 
        }

        // notify property engine 
        ChangeSources(target, dp, sources);
    } 

    //-----------------------------------------------------
    //
    //  Private Fields 
    //
    //----------------------------------------------------- 

    BindingBase         _binding;
    WeakReference       _targetElement; 
    DependencyProperty  _targetProperty;
    DataBindEngine      _engine;
    PrivateFlags        _flags;
    Object              _value = DefaultValueObject; 
    BindingStatusInternal _status;
    WeakDependencySource[]  _sources; 

    Object                  _culture = DefaultValueObject;

    /// <summary> Sentinel meaning "field has its default value" </summary>
    /*internal*/ public static final Object DefaultValueObject = new NamedObject("DefaultValue");

    // sentinel value meaning "unhook from previous item's events, but do not 
    // change values (except for special cases)"
    /*internal*/ public static final Object DisconnectedItem = new NamedObject("DisconnectedItem"); 

    // sentinel value meaning "no binding group"
    static final WeakReference<BindingGroup> NullBindingGroupReference = new WeakReference<BindingGroup>(null); 

//    #region Uncommon Values

    /*internal*/ public enum Feature 
    {
        // BindingExressionBase 
        ParentBindingExpressionBase, 
        ValidationError,
        NotifyDataErrors, 
        EffectiveStringFormat,
        EffectiveTargetNullValue,
        BindingGroup,
        Timer, 
        UpdateTargetOperation,

        // BindingExpression 
        Converter,
        SourceType, 
        DataProvider,
        CollectionViewSource,
        DynamicConverter,
        DataErrorValue, 

        // MultiBindingExpression 

        // PriorityBindingExpression

        // Sentinel, for error checking.   Must be last.
        LastFeatureId
    }

    /*internal*/ public boolean      HasValue(Feature id) 
    { 
    	return _values.HasValue((int)id); 
    }
    /*internal*/ public Object    GetValue(Feature id, Object defaultValue) 
    { 
    	return _values.GetValue((int)id, defaultValue); 
    } 
    /*internal*/ public void      SetValue(Feature id, Object value) 
    { 
    	_values.SetValue((int)id, value); 
    }
    
    /*internal*/ public void      SetValue(Feature id, Object value, Object defaultValue) 
    { 
    	if (Object.Equals(value, defaultValue)) 
    		_values.ClearValue((int)id); else _values.SetValue((int)id, value); 
    }
    /*internal*/ public void      ClearValue(Feature id) 
    { 
    	_values.ClearValue((int)id); 
    } 
    UncommonValueTable  _values;

//    #endregion Uncommon Values
} 
