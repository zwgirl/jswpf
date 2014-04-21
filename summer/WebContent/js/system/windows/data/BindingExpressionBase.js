/**
 * BindingExpressionBase
 */
/// <summary>
/// Base class for Binding Expressions. 
/// </summary>
define(["dojo/_base/declare", "system/Type", "windows/Expression", 
        "internal/UncommonValueTable", "controls/DataErrorValidationRule" , "controls/ExceptionValidationRule",
        "data/PrivateFlags", "data/BindingMode", "data/UpdateSourceTrigger", "data/BindingBase", "internal.data/DataBindEngine",
        "internal/FrameworkObject","windows/DependencyProperty", "windows/DependencyObject",
        "data/BindingStatusInternal", "windows/RequestFlags", "controls/ValidationStep",
        "internal.data/BindingValueChangedEventArgs"], 
        function(declare, Type, Expression, 
        		UncommonValueTable, DataErrorValidationRule, ExceptionValidationRule, 
        		PrivateFlags, BindingMode, UpdateSourceTrigger, BindingBase, DataBindEngine,
        		FrameworkObject, DependencyProperty, DependencyObject,
        		BindingStatusInternal, RequestFlags, ValidationStep,
        		BindingValueChangedEventArgs){
	
	var TextBoxBase = null;
	function EnsureTextBoxBase(){
		if(TextBoxBase == null) {
			TextBoxBase = using("primitives/TextBoxBase");
		}
		
		return TextBoxBase;
	}
	
    var Feature =
    {
        // BindingExressionBase 
        ParentBindingExpressionBase:0, 
        ValidationError:1,
        NotifyDataErrors:2, 
        EffectiveStringFormat:3,
        EffectiveTargetNullValue:4,
        BindingGroup:5,
        Timer:6, 
        UpdateTargetOperation:7,

        // BindingExpression 
        Converter:8,
        SourceType:9, 
        DataProvider:10,
        CollectionViewSource:11,
        DynamicConverter:12,
        DataErrorValue:13, 

        // MultiBindingExpression 

        // PriorityBindingExpression

        // Sentinel, for error checking.   Must be last.
        LastFeatureId:14
    };
    
//    // Flags indicating run-time properties of a BindingExpression 
//    [Flags]
//    internal enum BindingFlags : uint
//    {
//        // names used by Binding 
//
//        OneWay                  = PrivateFlags.iSourceToTarget, 
//        TwoWay                  = PrivateFlags.iSourceToTarget | PrivateFlags.iTargetToSource, 
//        OneWayToSource          = PrivateFlags.iTargetToSource,
//        OneTime                 = 0, 
//        PropDefault             = PrivateFlags.iPropDefault,
//        NotifyOnTargetUpdated   = PrivateFlags.iNotifyOnTargetUpdated,
//        NotifyOnSourceUpdated   = PrivateFlags.iNotifyOnSourceUpdated,
//        NotifyOnValidationError = PrivateFlags.iNotifyOnValidationError, 
//        UpdateOnPropertyChanged = 0,
//        UpdateOnLostFocus       = PrivateFlags.iUpdateOnLostFocus, 
//        UpdateExplicitly        = PrivateFlags.iUpdateExplicitly, 
//        UpdateDefault           = PrivateFlags.iUpdateDefault,
//        PathGeneratedInternally = PrivateFlags.iPathGeneratedInternally, 
//        ValidatesOnExceptions   = PrivateFlags.iValidatesOnExceptions,
//        ValidatesOnDataErrors   = PrivateFlags.iValidatesOnDataErrors,
//        ValidatesOnNotifyDataErrors = PrivateFlags.iValidatesOnNotifyDataErrors,
//
//        Default                 = PropDefault | UpdateDefault,
//
//        /// <summary> Error value, returned by FlagsFrom to indicate faulty input</summary> 
//        IllegalInput                = PrivateFlags.iIllegalInput,
//
//        PropagationMask = OneWay | TwoWay | OneWayToSource | OneTime | PropDefault,
//        UpdateMask      = UpdateOnPropertyChanged | UpdateOnLostFocus | UpdateExplicitly | UpdateDefault,
//    }
//
//    [Flags]
//    private enum PrivateFlags : uint 
//    { 
//        // internal use
//
//        iSourceToTarget             = 0x00000001,
//        iTargetToSource             = 0x00000002,
//        iPropDefault                = 0x00000004,
//        iNotifyOnTargetUpdated      = 0x00000008, 
//        iDefaultValueConverter      = 0x00000010,
//        iInTransfer                 = 0x00000020, 
//        iInUpdate                   = 0x00000040, 
//        iTransferPending            = 0x00000080,
//        iNeedDataTransfer           = 0x00000100, 
//        iTransferDeferred           = 0x00000200,   // used by MultiBindingExpression
//        iUpdateOnLostFocus          = 0x00000400,
//        iUpdateExplicitly           = 0x00000800,
//        iUpdateDefault              = iUpdateExplicitly | iUpdateOnLostFocus, 
//        iNeedsUpdate                = 0x00001000,
//        iPathGeneratedInternally    = 0x00002000, 
//        iUsingMentor                = 0x00004000, 
//        iResolveNamesInTemplate     = 0x00008000,
//        iDetaching                  = 0x00010000, 
//        iNeedsCollectionView        = 0x00020000,
//        iInPriorityBindingExpression= 0x00040000,
//        iInMultiBindingExpression   = 0x00080000,
//        iUsingFallbackValue         = 0x00100000, 
//        iNotifyOnValidationError    = 0x00200000,
//        iAttaching                  = 0x00400000, 
//        iNotifyOnSourceUpdated      = 0x00800000, 
//        iValidatesOnExceptions      = 0x01000000,
//        iValidatesOnDataErrors      = 0x02000000, 
//        iIllegalInput               = 0x04000000,
//        iNeedsValidation            = 0x08000000,
//        iTargetWantsXTNotification  = 0x10000000,
//        iValidatesOnNotifyDataErrors= 0x20000000, 
//        iDataErrorsChangedPending   = 0x40000000,
//        iDeferUpdateForComposition  = 0x80000000, 
//
//        iPropagationMask = iSourceToTarget | iTargetToSource | iPropDefault,
//        iUpdateMask      = iUpdateOnLostFocus | iUpdateExplicitly, 
//        iAdoptionMask    = iSourceToTarget | iTargetToSource | iNeedsUpdate | iNeedsValidation,
//    }

    var ExpressionMode = Expression.ExpressionMode;
	
	var ProposedValue = declare("ProposedValue", Object ,{
		constructor:function(/*BindingExpression*/ bindingExpression, /*object*/ rawValue, /*object*/ convertedValue) 
        {
            this._bindingExpression = bindingExpression; 
            this._rawValue = rawValue;
            this._convertedValue = convertedValue; 
        }
	});
	
	Object.defineProperties(ProposedValue.prototype, {
//        internal BindingExpression 
        BindingExpression: { get:function() { return this._bindingExpression; } }, 
//        internal object 
        RawValue: { get:function() { return this._rawValue; } },
//        internal object 
        ConvertedValue: { get:function() { return this._convertedValue; } },
	});
	
	ProposedValue.Type = new Type("ProposedValue", ProposedValue, [Object.Type]);

	var BindingExpressionBase = declare("BindingExpressionBase", Expression ,{
		constructor:function(/*BindingBase*/ binding, /*BindingExpressionBase*/ parent) 
        {
			//base(ExpressionMode.SupportsUnboundSources) 
			Expression.prototype.constructor.call(this, ExpressionMode.SupportsUnboundSources);

			this._values = new UncommonValueTable();
			
			if (binding == null) 
				throw new ArgumentNullException("binding");

            this._binding = binding;
            this.SetValue(Feature.ParentBindingExpressionBase, parent, null); 

            this._flags = binding.Flags; 
 
            if (parent != null)
            { 
            	this.ResolveNamesInTemplate = parent.ResolveNamesInTemplate;

                var type = parent.GetType();
                if (type == MultiBindingExpression.Type) 
                	this.ChangeFlag(PrivateFlags.iInMultiBindingExpression, true);
                else if (type == PriorityBindingExpression.Type) 
                	this.ChangeFlag(PrivateFlags.iInPriorityBindingExpression, true); 
            }

            if (this.LookupValidationRule(ExceptionValidationRule.Type) != null)
            {
            	this.ChangeFlag(PrivateFlags.iValidatesOnExceptions, true); 
            }
 
            if (this.LookupValidationRule(DataErrorValidationRule.Type) != null) 
            {
            	this.ChangeFlag(PrivateFlags.iValidatesOnDataErrors, true); 
            }
            
            
//            object              
            this._value = BindingExpressionBase.DefaultValueObject; 
//            BindingStatusInternal 
            this._status = 0;
//            WeakDependencySource[]  _sources; 
     
//            object                  
            this._culture = BindingExpressionBase.DefaultValueObject;
		},

        /// <summary> Force a data transfer from source to target </summary>
//        public virtual void 
        UpdateTarget:function() 
        {
        },

        /// <summary> Send the current value back to the source </summary> 
        /// <remarks> Does nothing when binding's Mode is not TwoWay or OneWayToSource </remarks>
//        public virtual void 
        UpdateSource:function() 
        { 
        },
 
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
//        public bool 
        ValidateWithoutUpdate:function() 
        {
            if (!this.NeedsValidation)
                return true;
 
            /*Collection<ProposedValue>*/
            var valuesOut = {"values":null};
            return this.ValidateAndConvertProposedValue(/*out values*/valuesOut); 
        }, 

        /// <summary>
        ///     Notification that the Expression has been set as a property's value
        /// </summary> 
        /// <remarks>
        ///     Subclasses should not override OnAttach(), but must override Attach() 
        /// </remarks> 
        /// <param name="d">DependencyObject being set</param>
        /// <param name="dp">Property being set</param> 
//        internal sealed override void 
        OnAttach:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp)
        {
            if (d == null)
                throw new Error('ArgumentNullException("d")'); 
            if (dp == null)
                throw new Error('ArgumentNullException("dp")'); 
 
            this.Attach(d, dp);
        }, 
        /// <summary>
        ///     Notification that the Expression has been removed as a property's value
        /// </summary> 
        /// <remarks>
        ///     Subclasses should not override OnDetach(), but must override DetachOverride() 
        /// </remarks> 
        /// <param name="d">DependencyObject being cleared</param>
        /// <param name="dp">Property being cleared</param> 
//        internal sealed override void 
        OnDetach:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp)
        {
            this.Detach();
        }, 

        /// <summary> 
        ///     Called to evaluate the Expression value 
        /// </summary>
        /// <param name="d">DependencyObject being queried</param> 
        /// <param name="dp">Property being queried</param>
        /// <returns>Computed value. Unset if unavailable.</returns>
//        internal override object 
        GetValue:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp)
        { 
            return this.Value;
        }, 
 
        /// <summary>
        ///     Allows Expression to store set values 
        /// </summary>
        /// <param name="d">DependencyObject being set</param>
        /// <param name="dp">Property being set</param>
        /// <param name="value">Value being set</param> 
        /// <returns>true if Expression handled storing of the value</returns>
//        internal override bool 
        SetValue:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp, /*object*/ value) 
        { 
            if (this.IsReflective)
            { 
                this.Value = value;
                return true;
            }
            else 
            {
                // if the binding doesn't push values back to the source, allow 
                // SetValue to overwrite the binding with a local value 
                return false;
            } 
        },

        /// <summary>
        ///     Notification that a Dependent that this Expression established has 
        ///     been invalidated as a result of a Source invalidation
        /// </summary> 
        /// <param name="d">DependencyObject that was invalidated</param> 
        /// <param name="args">Changed event args for the property that was invalidated</param>
//        internal override void 
        OnPropertyInvalidation:function(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ args) 
        {
            // It's possible to receive this notification after we've unsubscribed to it.
            // This can happen if the sender raises the notification to a list of
            // clients and one of the earlier clients causes a later client to 
            // unsubscribe.  The sender uses a copy of the list, so the later client
            // will still get the notification.  (See Dev10 bug 715390) 
            // If this happens, simply ignore the notification. 
            if (this.IsDetached)
                return; 

            this.IsTransferPending = true;

//            // if the notification arrived on the right Dispatcher, handle it now. 
//            if (Dispatcher.Thread == Thread.CurrentThread)
//            { 
//                this.HandlePropertyInvalidation(d, args); 
//            }
//            else    // Otherwise, marshal it to the right Dispatcher. 
//            {
//                Engine.Marshal(
//                    new DispatcherOperationCallback(HandlePropertyInvalidationOperation),
//                    new object[]{d, args}); 
//            }
            
            this.HandlePropertyInvalidation(d, args); 
        },
        
 
        /// <summary>
        ///     List of sources of the Expression 
        /// </summary>
        /// <returns>Sources list</returns>
//        internal override DependencySource[] 
        GetSources:function()
        { 
//          int j, k;
//          int n = (_sources != null) ? _sources.Length : 0; 
//          if (n == 0) 
//              return null;
//
//          DependencySource[] result = new DependencySource[n];
//
//          // convert the weak references into strong ones
//          for (j=0, k=0; k<n; ++k) 
//          {
//              DependencyObject d = _sources[k].DependencyObject; 
//              if (d != null) 
//              {
//                  result[j++] = new DependencySource(d, _sources[k].DependencyProperty); 
//              }
//          }
//
//          // if any of the references died, return a shortened list 
//          if (j < n)
//          { 
//              DependencySource[] temp = result; 
//              result = new DependencySource[j];
//              Array.Copy(temp, 0, result, 0, j); 
//          }
//
//          return result;
            return this._sources;
        }, 
        

        // We need this Clone method to copy a binding during Freezable.Copy.  We shouldn't be taking 
        // the target object/dp parameters here, but Binding.ProvideValue requires it.  (Binding 
        // could probably be re-factored so that we don't need this).
//        internal override Expression 
        Copy:function( /*DependencyObject*/ targetObject, /*DependencyProperty*/ targetDP ) 
        {
            return this.ParentBindingBase.CreateBindingExpression(targetObject, targetDP);
        },
 
        /// <summary> 
        /// Handle events from the centralized event table
        /// </summary> 
//        bool IWeakEventListener.
        ReceiveWeakEvent:function(/*Type*/ managerType, /*object*/ sender, /*EventArgs*/ e)
        {
            return ReceiveWeakEvent(managerType, sender, e);
        }, 
 
        /// <summary> Attach the BindingExpression to its target element </summary> 
        /// <remarks>
        /// This method must be called once during the initialization. 
        /// </remarks> 
        /// <param name="d">The target element </param>
//        internal void 
//        Attach:function(/*DependencyObject*/ d) 
//        {
//            this.Attach(d, NoTargetProperty);
//        },
        
        /// <summary>
        /// Attach the binding expression to the given target object and property. 
        /// </summary>
//        internal void 
        Attach:function(/*DependencyObject*/ target, /*DependencyProperty*/ dp) 
        { 
        	if(dp === undefined){
        		dp = BindingExpressionBase.NoTargetProperty;
        	}
 
            this.IsAttaching = true;
            this.AttachOverride(target, dp); 
            this.IsAttaching = false; 
        },
        /// <summary>
        /// Detach the binding expression from its target object and property.
        /// </summary>
//        internal void 
        Detach:function() 
        {
            if (this.IsDetached || this.IsDetaching) 
                return; 

            this.IsDetaching = true; 

            // leave the binding group before doing anything else, so as to preserve
            // a proposed value (if any).
            this.LeaveBindingGroup(); 

            // remove from CommitManager 
            this.NotifyCommitManager(); 

            this.DetachOverride(); 
            this.IsDetaching = false;
        },

        // disconnect from sources, and update the target property as cheaply as possible 
//        internal virtual void 
        Disconnect:function()
        { 
            // determine the new value (if any) to expose 
            var newValue = Type.UnsetValue;    // usually none
            var targetDP = this.TargetProperty; 

            if (targetDP == ContentControl.ContentProperty ||
                targetDP == ContentPresenter.ContentProperty ||
                targetDP == HeaderedItemsControl.HeaderProperty || 
                targetDP == HeaderedContentControl.HeaderProperty)
            { 
                // pass DisconnectedItem through content-like properties, so 
                // that their descendent bindings can disconnect
                newValue = BindingExpressionBase.DisconnectedItem; 
            }

            if (targetDP.PropertyType == IEnumerable.Type) //typeof(System.Collections.IEnumerable))
            { 
                // set IEnumerable properties (e.g. ItemsSource) to null, so that
                // the control can disconnect from the individual items 
                newValue = null; 
            }
 
            // notify the target property about the new value (cheaply)
            if (newValue != Type.UnsetValue)
            {
                this.ChangeValue(newValue, false); 
                this.Invalidate(false);
            } 
        }, 

//        internal void 
        SetStatus:function(/*BindingStatusInternal*/ status) 
        {
            if (this.IsDetached && status != this._status)
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.BindingExpressionStatusChanged, _status, status)'); 
            }
 
            this._status = status; 
        },
        
        /// <summary> 
        /// Attach the binding expression to the given target object and property.
        /// Derived classes should call base.AttachOverride before doing their work, 
        /// and should continue only if it returns true.
        /// </summary>
//        internal virtual bool 
        AttachOverride:function(/*DependencyObject*/ target, /*DependencyProperty*/ dp)
        { 
            this._targetElement = target;
            this._targetProperty = dp; 
 
            // get the engine
            var engine = DataBindEngine.CurrentDataBindEngine; 
            if (engine == null || engine.IsShutDown)
            {
                return false;   // don't even think about doing any work if the DBE is shut down
 
                // we do this after setting TargetElement and TargetProperty so that
                // an app that (rather futilely) creates a binding after shutdown 
                // will at least see the default value.   This avoids the assert in 
                // EffectiveValueEntry.SetExpressionValue.
            } 
            this._engine = engine;

            this.DetermineEffectiveStringFormat();
            this.DetermineEffectiveTargetNullValue(); 
            this.DetermineEffectiveUpdateBehavior();
            this.DetermineEffectiveValidatesOnNotifyDataErrors(); 
 
// cym comment
//            // root bindings on TextBox.Text need to listen for IME composition events
//            if (dp == TextBox.TextProperty && this.IsReflective && !this.IsInBindingExpressionCollection) 
//            {
//                var tbb = target instanceof TextBoxBase ? target : null;
//                if (tbb != null)
//                { 
//                    tbb.PreviewTextInput += OnPreviewTextInput;
//                } 
//            } 
 
            return true;
        }, 

        /// <summary>
        /// Detach the binding expression from its target object and property.
        /// Derived classes should call base.DetachOverride after doing their work. 
        /// </summary>
//        internal virtual void 
        DetachOverride:function() 
        { 
            this.UpdateValidationError(null);
            this.UpdateNotifyDataErrorValidationErrors(null); 
            
//cym comment
//            // root bindings on TextBox.Text need to stop listening for IME composition events
//            if (this.TargetProperty == TextBox.TextProperty && this.IsReflective && !this.IsInBindingExpressionCollection)
//            { 
//                var tbb = this.TargetElement instanceof TextBoxBase ? this.TargetElement : null;
//                if (tbb != null) 
//                { 
//                    tbb.PreviewTextInput -= OnPreviewTextInput;
//                } 
//            }

            this._engine = null;
            this._targetElement = null; 
            this._targetProperty = null;
            this.SetStatus(BindingStatusInternal.Detached); 
        },
 
        /// <summary> 
        /// Invalidate the given child expression.
        /// </summary> 
//        internal abstract void 
        InvalidateChild:function(/*BindingExpressionBase*/ bindingExpression){
        	
        },

        /// <summary>
        /// Change the dependency sources for the given child expression. 
        /// </summary>
//        internal abstract void 
        ChangeSourcesForChild:function(/*BindingExpressionBase*/ bindingExpression, /*WeakDependencySource[]*/ newSources){
        	
        }, 
 
        /// <summary>
        /// Replace the given child expression with a new one. 
        /// </summary>
//        internal abstract void 
        ReplaceChild:function(/*BindingExpressionBase*/ bindingExpression){
        	
        },

//        internal abstract void 
        HandlePropertyInvalidation:function(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ args){
        	
        },

//        private object 
        HandlePropertyInvalidationOperation:function(/*object*/ o) 
        { 
            // This is the case where the source of the Binding belonged to a different Dispatcher
            // than the target. For this scenario the source marshals off the invalidation information 
            // onto the target's Dispatcher queue. This is where we unpack the marshalled information
            // to fire the invalidation on the target object.

            /*object[]*/var args = /*(object[])*/o; 
            this.HandlePropertyInvalidation(/*(DependencyObject)*/args[0], /*(DependencyPropertyChangedEventArgs)*/args[1]);
            return null; 
        }, 

        // handle joining or leaving a binding group 
//        internal void 
        OnBindingGroupChanged:function(/*bool*/ joining)
        {
            if (joining)
            { 
                // joining a binding group:
                // update Explicitly, unless declared otherwise 
                if (this.IsParentBindingUpdateTriggerDefault) 
                {
                    if (this.IsUpdateOnLostFocus) 
                    {
                    	this.LostFocusEventManager.RemoveHandler(this.TargetElement, OnLostFocus);
                    }
 
                    this.SetUpdateSourceTrigger(UpdateSourceTrigger.Explicit);
                } 
            } 
            else
            { 
                // leaving a binding group:
                // restore update trigger
                if (this.IsParentBindingUpdateTriggerDefault)
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
        }, 
 
//        object 
        RestoreUpdateTriggerOperation:function(/*object*/ arg)
        { 
            var target = this.TargetElement;
            if (!this.IsDetached && target != null)
            {
            	var temp = this.TargetProperty.GetMetadata(target.DependencyObjectType);
                var fwMetaData =  temp instanceof FrameworkPropertyMetadata ? temp : null; 

                var ust = GetDefaultUpdateSourceTrigger(fwMetaData); 
                this.SetUpdateSourceTrigger(ust); 

                if (this.IsUpdateOnLostFocus) 
                {
                    LostFocusEventManager.AddHandler(target, OnLostFocus);
                }
            } 

            return null; 
        }, 

        // register the leaf bindings with the binding group 
//        internal abstract void 
        UpdateBindingGroup:function(/*BindingGroup*/ bg){
        	
        },

        // transfer a value from target to source
//        internal bool 
        UpdateValue:function() 
        {
            var oldValidationError = this.BaseValidationError; 
 
            if (this.StatusInternal == BindingStatusInternal.UpdateSourceError)
            	this.SetStatus(BindingStatusInternal.Active); 

            var value = this.GetRawProposedValue();
            if (!this.Validate(value, ValidationStep.RawProposedValue))
                return false; 

            value = this.ConvertProposedValue(value); 
            if (!this.Validate(value, ValidationStep.ConvertedProposedValue)) 
                return false;
 
            value = this.UpdateSource(value);
            if (!this.Validate(value, ValidationStep.UpdatedValue))
                return false;
 
            value = this.CommitSource(value);
            if (!this.Validate(value, ValidationStep.CommittedValue)) 
                return false; 

            if (this.BaseValidationError == oldValidationError) 
            {
                // the binding is now valid - remove the old error
            	this.UpdateValidationError(null);
            } 

            this.EndSourceUpdate(); 
            this.NotifyCommitManager(); 

            return !this.HasValue(Feature.ValidationError); 
        },

        /// <summary>
        /// Get the raw proposed value 
        /// <summary>
//        internal virtual object 
        GetRawProposedValue:function() 
        { 
            var value = this.Value;
 
            // TargetNullValue is the UI representation of a "null" value.  Use null internally.
            if (Object.Equals(value, this.EffectiveTargetNullValue))
            {
                value = null; 
            }
 
            return value; 
        },
 
        /// <summary>
        /// Get the converted proposed value
        /// <summary>
//        internal abstract object 
        ConvertProposedValue:function(/*object*/ rawValue){
        	
        },

        /// <summary> 
        /// Get the converted proposed value and inform the binding group 
        /// <summary>
//        internal abstract bool 
        ObtainConvertedProposedValue:function(/*BindingGroup*/ bindingGroup){
        	
        },

//        /// <summary>
//        /// Update the source value
//        /// <summary> 
////        internal abstract object 
//        UpdateSource:function(/*object*/ convertedValue){
//        	
//        },
 
        /// <summary> 
        /// Update the source value and inform the binding group
        /// <summary> 
//        internal abstract bool 
        UpdateSource:function(/*BindingGroup or object*/ bindingGroup){
        	
        },

        /// <summary>
        /// Commit the source value 
        /// <summary>
//        internal virtual object 
        CommitSource:function(/*object*/ value) 
        { 
            return value;
        }, 

        /// <summary>
        /// Store the value in the binding group
        /// </summary> 
//        internal abstract void 
        StoreValueInBindingGroup:function(/*object*/ value, /*BindingGroup*/ bindingGroup){
        	
        },
 
        /// <summary> 
        /// Run validation rules for the given step
        /// <summary> 
//        internal virtual bool 
        Validate:function(/*object*/ value, /*ValidationStep*/ validationStep)
        {
            if (value == Type.DoNothing)
                return true; 

            if (value == Type.UnsetValue) 
            { 
                this.SetStatus(BindingStatusInternal.UpdateSourceError);
                return false; 
            }

            // get old errors from this step - we're about to reevaluate those rules.
            var oldValidationError = this.GetValidationErrors(validationStep); 

            // ignore an error from the implicit DataError rule - this is checked 
            // separately (in BindingExpression.Validate).  [Dev10 575988] 
            if (oldValidationError != null &&
                oldValidationError.RuleInError == DataErrorValidationRule.Instance) 
            {
                oldValidationError = null;
            }
 
            /*Collection<ValidationRule>*/ var validationRules = this.ParentBindingBase.ValidationRulesInternal;
 
            if (validationRules != null) 
            {
                /*CultureInfo*/var culture = this.GetCulture(); 

                for/*each*/ (var i =0; i<validationRules.Count; i++)
                {
                	var validationRule = validationRules.Get(i);
                    if (validationRule.ValidationStep == validationStep) 
                    {
                        var validationResult = validationRule.Validate(value, culture, this); 
 
                        if (!validationResult.IsValid)
                        { 
                            this.UpdateValidationError( new ValidationError(validationRule, this, validationResult.ErrorContent, null)); 
                            return false; // kenlai:
                        }
                    }
                } 
            }
 
            // this step is now valid - clear the old error (if any) 
            if (oldValidationError != null && oldValidationError == this.GetValidationErrors(validationStep))
            { 
                this.UpdateValidationError(null);
            }

            return true; 
        },
 
        /// <summary> 
        /// Run validation rules for the given step, and inform the binding group
        /// <summary> 
//        internal abstract bool 
        CheckValidationRules:function(/*BindingGroup*/ bindingGroup, /*ValidationStep*/ validationStep){
        	
        },

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
//        internal abstract bool 
        ValidateAndConvertProposedValue:function(/*out Collection<ProposedValue> values*/){
        	
        },

        /// <summary> 
        /// Compute the culture, either from the parent Binding, or from the target element.
        /// </summary>
//        internal CultureInfo 
        GetCulture:function()
        { 
            // lazy initialization, to let the target element acquire all its properties
            if (this._culture == BindingExpressionBase.DefaultValueObject) 
            { 
                // explicit culture set in Binding
            	this._culture = this.ParentBindingBase.ConverterCultureInternal; 

                // if that doesn't work, use target element's xml:lang property
                if (this._culture == null)
                { 
                    var target = this.TargetElement;
                    if (target != null) 
                    { 
                        if (this.IsInTransfer && (this.TargetProperty == FrameworkElement.LanguageProperty))
                        { 
                            throw new Error('InvalidOperationException(SR.Get(SRID.RequiresExplicitCulture, TargetProperty.Name)'); 
                        }

                        // cache CultureInfo since requerying an inheritable property on every Transfer/Update can be quite expensive
                        // CultureInfo DP rarely changes once a XAML document is loaded. 
                        // To be 100% correct, changes to the CultureInfo attached DP should be tracked
                        // and cause a re-evaluation of this binding. 
                        this._culture = (/*(XmlLanguage)*/ target.GetValue(FrameworkElement.LanguageProperty)).GetSpecificCulture(); 
                    }
                } 
            }
            return this._culture;
        },
 
        /// <summary> Culture has changed.  Re-fetch the value with the new culture. </summary>
//        internal void 
        InvalidateCulture:function() 
        { 
        	this._culture = BindingExpressionBase.DefaultValueObject;
        }, 

        /// <summary> Begin a source update </summary>
//        internal void 
        BeginSourceUpdate:function()
        { 
        	this.ChangeFlag(PrivateFlags.iInUpdate, true);
        }, 
 
        /// <summary> End a source update </summary>
//        internal void 
        EndSourceUpdate:function() 
        {
            if (this.IsInUpdate && this.IsDynamic && this.StatusInternal == BindingStatusInternal.Active)
            {
                // After a successful source update, always re-transfer the source value. 
                // This picks up changes that the source item may make in the setter,
                // and applies the converter (if any) to the value.  This fixes 
                // the so-called "$10 bug". 

            	//cym comment
//                // When the target is a TextBox with a composition in effect, 
//                // do this asynchronously, to avoid confusing the composition's Undo stack
//                var tbb = this.Target instanceof TextBoxBase ? this.Target : null;
//                /*MS.Internal.Documents.UndoManager*/var undoManager = (tbb == null) ? null :
//                    tbb.TextContainer.UndoManager; 
//                if (undoManager != null &&
//                    undoManager.OpenedUnit != null && 
//                    undoManager.OpenedUnit.GetType() != typeof(System.Windows.Documents.TextParentUndoUnit)) 
//                {
//                    if (!this.HasValue(Feature.UpdateTargetOperation)) 
//                    {
//                        /*DispatcherOperation*/var op = Dispatcher.BeginInvoke(DispatcherPriority.Send,
//                            new DispatcherOperationCallback(UpdateTargetCallback),
//                            null); 
//                        this.SetFeatureValue(Feature.UpdateTargetOperation, op);
//                    } 
//                } 
//                else
//                { 
//                	this.UpdateTarget();
//                }
            	
            	EnsureTextBoxBase();
            	var tbb = null; 
            	if(TextBoxBase != null){
            		tbb = this.Target instanceof TextBoxBase ? this.Target : null;
            	}
//                // When the target is a TextBox with a composition in effect, 
//                // do this asynchronously, to avoid confusing the composition's Undo stack
                /*MS.Internal.Documents.UndoManager*/var undoManager = (tbb == null) ? null :
                    tbb.TextContainer.UndoManager; 
                if (undoManager != null &&
                    undoManager.OpenedUnit != null && 
                    undoManager.OpenedUnit.GetType() != typeof(System.Windows.Documents.TextParentUndoUnit)) 
                {
                    if (!this.HasValue(Feature.UpdateTargetOperation)) 
                    {
                        /*DispatcherOperation*/var op = Dispatcher.BeginInvoke(DispatcherPriority.Send,
                            new DispatcherOperationCallback(UpdateTargetCallback),
                            null); 
                        this.SetFeatureValue(Feature.UpdateTargetOperation, op);
                    } 
                } 
                else
                { 
                	this.UpdateTarget();
                }
            }
 
            this.ChangeFlag(PrivateFlags.iInUpdate | PrivateFlags.iNeedsUpdate, false);
        }, 
 
//        object 
        UpdateTargetCallback:function(/*object*/ unused)
        { 
            this.ClearValue(Feature.UpdateTargetOperation);
            this.IsInUpdate = true;      // pretend to be in an update - as when this callback was posted
            this.UpdateTarget();
            this.IsInUpdate = false; 
            return null;
        },
 
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
//        internal bool 
        ShouldUpdateWithCurrentValue:function(/*DependencyObject*/ target, /*out object currentValue*/parObj) 
        {
            if (this.IsReflective)
            {
                // the bad situation only arises during initialization. After that, 
                // the order of property assignments is determined by the app's
                // normal control flow.  Unfortunately, we can only detect 
                // initialization for framework elements;  fortunately, this covers 
                // all the known cases of the bad situation
                var fo = new FrameworkObject(target); 
                if (!fo.IsInitialized)
                {
                    // if the target property (B) already has a changed value (y),
                    // we're in the bad situation and should propagate y back to 
                    // the data source
                    var dp = this.TargetProperty; 
                    var entryIndex = target.LookupEntry(dp.GlobalIndex); 
                    if (entryIndex.Found)
                    { 
                        var entry = target.GetValueEntry(entryIndex, dp, null, RequestFlags.RawEntry);
                        if (entry.IsCoercedWithCurrentValue)
                        {
                            parObj.currentValue = entry.GetFlattenedEntry(RequestFlags.FullyResolved).Value; 
                            if (entry.IsDeferredReference)
                            { 
                                var deferredReference = parObj.currentValue; 
                                parObj.currentValue = deferredReference.GetValue(entry.BaseValueSourceInternal);
                            } 
                            return true;
                        }
                    }
                } 
            }
 
            currentValue = null; 
            return false;
        },


        /// <summary> change the value to the new value, and notify listeners </summary>
//        internal void 
        ChangeValue:function(/*object*/ newValue, /*bool*/ notify) 
        {
            var oldValue = (this._value != BindingExpressionBase.DefaultValueObject) ? this._value : Type.UnsetValue; 
 
            this._value = newValue;
 
            if (notify && this.ValueChanged != null)
            {
            	this.ValueChanged.Invoke(this, new BindingValueChangedEventArgs(oldValue, newValue));
            } 
        },
 
        // after a successful transfer, mark the binding clean 
//        internal void 
        Clean:function()
        { 
            if (this.NeedsUpdate)
            {
                this.NeedsUpdate = false;
            } 

            if (!this.IsInUpdate) 
            { 
            	this.NeedsValidation = false;
            	this.NotifyCommitManager(); 
            }
        },

        /// <summary> the target value has changed - the source needs to be updated </summary> 
//        internal void 
        Dirty:function()
        { 
            if (!this.IsInTransfer && this.IsAttached)    // Dev11 377333:  don't react if the binding isn't attached 
            {
            	this.NeedsUpdate = true; 

                if (!this.HasValue(Feature.Timer))
                {
                	this.ProcessDirty(); 
                }
 
                this.NotifyCommitManager();
            } 
        },

//        private void 
        ProcessDirty:function() 
        {
            if (this.IsUpdateOnPropertyChanged)
            {
//                if (Helper.IsComposing(this.Target, this.TargetProperty)) 
//                {
//                    // wait for the IME composition to complete 
//                	this.IsUpdateDeferredForComposition = true; 
//                }
//                else 
//                {
                    // no composition, so update now
                	this.Update();
//                } 
            }
        },
 
//        void 
        OnTimerTick:function(/*object*/ sender, /*EventArgs*/ e)
        { 
            this.ProcessDirty();
        },

//        void 
        OnPreviewTextInput:function(/*object*/ sender, /*System.Windows.Input.TextCompositionEventArgs*/ e) 
        {
            // if the IME composition we're waiting for completes, update the source. 
            if (this.IsUpdateDeferredForComposition && e.TextComposition.Source == TargetElement && e.TextComposition.Stage == System.Windows.Input.TextCompositionStage.Done) 
            {
            	this.IsUpdateDeferredForComposition = false; 
            	this.Dirty();
            }
        },
 
        // invalidate the target property
//        internal void 
        Invalidate:function(/*bool*/ isASubPropertyChange) 
        { 
            // don't invalidate during Attach.  The property engine does it
            // already, and it would interfere with the on-demand activation 
            // of style-defined BindingExpressions.
            if (this.IsAttaching)
                return;
 
            var target = this.TargetElement;
            if (target != null) 
            { 
                if (this.IsInBindingExpressionCollection)
                	this.ParentBindingExpressionBase.InvalidateChild(this); 
                else
                {
                    if (this.TargetProperty != BindingExpressionBase.NoTargetProperty)
                    { 
                        // recompute expression
                        if (!isASubPropertyChange) 
                        { 
                            target.InvalidateProperty(this.TargetProperty);
                        } 
                        else
                        {
                            target.NotifySubPropertyChange(this.TargetProperty);
                        } 
                    }
                } 
            } 
        },
        
        /// <summary> use the Fallback or Default value, called when a real value is not available </summary>
//        internal object 
        UseFallbackValue:function()
        {
            var value = this.FallbackValue; 

            // if there's a problem with the fallback, use Default instead 
            if (value == BindingExpressionBase.DefaultValueObject) 
            {
                value = Type.UnsetValue; 
            }

            // OneWayToSource bindings should initialize to the Fallback/Default
            // value without error 
            if (value == Type.UnsetValue && this.IsOneWayToSource)
            { 
                value = this.DefaultValue; 
            }
 
            if (value != Type.UnsetValue)
            {
                this.UsingFallbackValue = true;
            } 
            else
            { 
                // if fallback isn't available, use Default (except when in a binding collection) 
                if (this.StatusInternal == BindingStatusInternal.Active)
                    this.SetStatus(BindingStatusInternal.UpdateTargetError); 

                if (!this.IsInBindingExpressionCollection)
                {
                    value = this.DefaultValue; 
                }
            }

            return value; 
        },
        // determine if the given value is "null" (in a general sense) 
//        internal static bool 
        IsNullValue:function(/*object*/ value)
        { 
            if (value == null)
                return true;

//            if (this.Convert.IsDBNull(value)) 
//                return true;
 
//            if (SystemDataHelper.IsSqlNull(value)) 
//                return true;
 
            return false;
        },

        // determine a "null" value appropriate for the given type 
//        internal object 
        NullValueForType:function(/*Type*/ type)
        { 
            if (type == null) 
                return null;
            
//            if (SystemDataHelper.IsSqlNullableType(type))
//                return SystemDataHelper.NullValueForSqlNullableType(type);
 
            if (!type.IsValueType) 
                return null;
            
//            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>)) 
//                return null;
 
 
            return Type.UnsetValue;
        },
//        internal ValidationRule 
        LookupValidationRule:function(/*Type*/ type)
        { 
            var result = this.ParentBindingBase.GetValidationRule(type); 

            if (result == null && this.HasValue(Feature.ParentBindingExpressionBase)) 
            {
                result = this.ParentBindingExpressionBase.LookupValidationRule(type);
            }
 
            return result;
        },
 

        // remove the binding from its group
//        internal void 
        LeaveBindingGroup:function()
        { 
            var root = this.RootBindingExpression;
            var bg = root.BindingGroup; 
            if (bg != null) 
            {
                bg.BindingExpressions.Remove(root); 
                root.ClearValue(Feature.BindingGroup);
            }
        },
 
        // reevaluate which binding group this binding should join, and perform
        // the change if required 
//        internal void 
        RejoinBindingGroup:function(/*bool*/ isReflective, /*DependencyObject*/ contextElement) 
        {
            var root = this.RootBindingExpression; 
            var oldBindingGroup = root.BindingGroup;

            // discover the binding group, as if this were the first time
            var newBindingGroup; 
            var oldBindingGroup = root.GetFeatureValue(Feature.BindingGroup, null);
            root.SetFeatureValue(Feature.BindingGroup, null, oldBindingGroup);   // not ClearValue, as we'll reset it soon 
            try 
            {
                newBindingGroup = root.FindBindingGroup(isReflective, contextElement); 
            }
            finally
            {
                root.SetFeatureValue(Feature.BindingGroup, oldBindingGroup, null); 
            }
 
            // if it's different from the current binding group, move 
            if (oldBindingGroup != newBindingGroup)
            { 
                root.LeaveBindingGroup();
                if (newBindingGroup != null)
                {
                    this.JoinBindingGroup(newBindingGroup, /*explicit*/false); 
                }
            } 
        }, 

        // discover the binding group (if any) that this root binding should join. 
//        internal BindingGroup 
        FindBindingGroup:function(/*bool*/ isReflective, /*DependencyObject*/ contextElement)
        {
            // if we've already joined (or failed to join) a group, just return the result
            if (this.GetFeatureValue(Feature.BindingGroup, null) != null) 
            { 
                return this.BindingGroup;
            } 

            var bg;
            var groupName = this.ParentBindingBase.BindingGroupName;
 
            // a null group name means "don't join any group".
            if (groupName == null) 
            { 
                this.MarkAsNonGrouped();
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
                bg = /*(BindingGroup)*/contextElement.GetValue(FrameworkElement.BindingGroupProperty); 
                if (bg == null)
                { 
                    this.MarkAsNonGrouped();
                    return null;
                }
 
                // the context element must share data context with the group
                var dataContextDP = FrameworkElement.DataContextProperty; 
                var groupContextElement = bg.InheritanceContext; 
                if (groupContextElement == null ||
                    !Object.Equals( contextElement.GetValue(dataContextDP), 
                                    groupContextElement.GetValue(dataContextDP)))
                {
                    this.MarkAsNonGrouped();
                    return null; 
                }
 
                // if the binding survives the gauntlet, return the group 
                return bg;
            } 

            // a non-empty group name means join by name
            else
            { 
                // walk up the tree, looking for a matching binding group
                var bindingGroupDP = FrameworkElement.BindingGroupProperty; 
                var fo = new FrameworkObject(Helper.FindMentor(TargetElement)); 
                while (fo.DO != null)
                { 
                    var bgCandidate = /*(BindingGroup)*/fo.DO.GetValue(bindingGroupDP);
                    if (bgCandidate == null)
                    {
                        this.arkAsNonGrouped(); 
                        return null;
                    } 
 
                    if (bgCandidate.Name == groupName)
                    { 
//                        if (bgCandidate.SharesProposedValues && TraceData.IsEnabled)
//                        {
//                            TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.SharesProposedValuesRequriesImplicitBindingGroup( 
//                                            TraceData.Identify(this),
//                                            groupName, 
//                                            TraceData.Identify(bgCandidate))); 
//                        }
 
                        // return the matching group
                        return bgCandidate;
                    }
 
                    fo = fo.FrameworkParent;
                } 
 
//                // no match - report an error
//                if (TraceData.IsEnabled) 
//                {
//                    TraceData.Trace(TraceEventType.Error,
//                            TraceData.BindingGroupNameMatchFailed(groupName),
//                            this); 
//                }
 
                this.MarkAsNonGrouped(); 
                return null;
            } 
        },
        
        // discover the binding group (if any) that this binding should join,
        // and join it.  More precisely, cause the root binding to join. 
//        internal void 
        JoinAnyBindingGroup:function(/*bool*/ isReflective, /*DependencyObject*/ contextElement)
        {
            var bindingGroup = this.RootBindingExpression.FindBindingGroup(isReflective, contextElement);
 
            if (bindingGroup != null)
            { 
                this.JoinBindingGroup(bindingGroup, /*explicit*/false); 
            }
        }, 

        // add a binding to the given binding group
//        internal void 
        JoinBindingGroup:function(/*BindingGroup*/ bg, /*bool*/ explicitJoin) 
        {
            var root = null;  // set to non-null by the next loop 
 
            for ( var bindingExpr = this;
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
                root.SetFeatureValue(Feature.BindingGroup, bg); 

                // when the group is implicitly discovered, always add the root binding to the group's collection. 
                // When the binding is added explicitly - via BindingGroup.BindingExpressions.Add() -
                // check first to see if it has already been added
                var addToGroup = explicitJoin ? !bg.BindingExpressions.Contains(root) : true;
                if (addToGroup) 
                {
                    bg.BindingExpressions.Add(root); 
                } 

                // in the explicit case, register its items and values with the binding group 
                // (the implicit case does this when the bindings activate)
                if (explicitJoin)
                {
                    root.UpdateBindingGroup(bg); 
                }
            } 
            else 
            {
                if (root.BindingGroup != bg) 
                    throw new Error('InvalidOperationException(SR.Get(SRID.BindingGroup_CannotChangeGroups)');
            }
        },
 
        // mark a binding as non-grouped, so that we avoid doing the discovery again
//        void 
        MarkAsNonGrouped:function() 
        { 
            // Leaf bindings only get asked once, so there's no need to add a mark
            if (!(this instanceof BindingExpression)) 
            {
            	this.SetFeatureValue(Feature.BindingGroup, null);
            }
        },

        // add to, or remove from, the CommitManager's set of dirty/invalid bindings 
//        internal void 
        NotifyCommitManager:function() 
        {
            if (this.IsReflective && !this.IsDetached && !this.Engine.IsShutDown) 
            {
                var shouldStore = this.IsEligibleForCommit && (this.IsDirty || this.HasValidationError);
                var root = this.RootBindingExpression;
                var bg = root.BindingGroup; 

                root.UpdateCommitState(); 
 
                if (bg == null)
                { 
                    if (root != this && !shouldStore)
                    {
                        shouldStore = root.IsEligibleForCommit && (root.IsDirty || root.HasValidationError);
                    } 

                    if (shouldStore) 
                    { 
                    	this.Engine.CommitManager.AddBinding(root);
                    } 
                    else
                    {
                    	this.Engine.CommitManager.RemoveBinding(root);
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
                    	this.Engine.CommitManager.AddBindingGroup(bg); 
                    } 
                    else
                    { 
                    	this.Engine.CommitManager.RemoveBindingGroup(bg);
                    }
                }
            } 
        },
 
//        internal virtual void 
        UpdateCommitState:function() 
        {
            // for most bindings, the state is already current 
        },

        // adopt the properties of another binding.   Called by PriorityBindingExpression
        // when its active binding changes.   (Implemented here to get access to private flags.) 
//        internal void 
        AdoptProperties:function(/*BindingExpressionBase*/ bb)
        { 
            var newFlags = (bb != null) ? bb._flags : /*(PrivateFlags)*/0x0; 
            this._flags = (this._flags & ~PrivateFlags.iAdoptionMask) | (newFlags & PrivateFlags.iAdoptionMask);
        }, 

        /// <summary>
        /// Handle events from the centralized event table
        /// </summary> 
//        internal virtual bool 
        ReceiveWeakEvent:function(/*Type*/ managerType, /*object*/ sender, /*EventArgs*/ e)
        { 
            return false;       // unrecognized event 
        },
 
//        internal virtual void 
        OnLostFocus:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        {
        },
 
        // Return the object from which the given value was obtained, if possible
//        internal abstract object 
        GetSourceItem:function(/*object*/ newValue){
        	
        },
 
//        private bool 
        TestFlag:function(/*PrivateFlags*/ flag)
        { 
            return (this._flags & flag) != 0;
        },

//        private void 
        ChangeFlag:function(/*PrivateFlags*/ flag, /*bool*/ value) 
        {
            if (value)  this._flags |=  flag; 
            else        this._flags &= ~flag; 
        },
        
//        internal bool      
        HasValue:function(/*Feature*/ id) 
        { 
        	return this._values.HasValue(id); 
        },

        //        internal object    
        GetFeatureValue:function(/*Feature*/ id, /*object*/ defaultValue) 
        { 
        	return this._values.GetValue(id, defaultValue); 
        }, 

//        //        internal void      
//        SetValue:function(/*Feature*/ id, /*object*/ value) {
//        	this._values.SetValue(id, value); 
//        }, 

        //        internal void      
        SetFeatureValue:function(/*Feature*/ id, /*object*/ value, /*object*/ defaultValue) { 
        	if(defaultValue === undefined){
        		this._values.SetValue(id, value); 
        		return;
        	}
        	
        	if (Object.Equals(value, defaultValue)){
        		this._values.ClearValue(id); 
        	}
        	else this._values.SetValue(id, value); 
        },
        
//        internal void      
        ClearValue:function(/*Feature*/ id) 
        { 
        	this._values.ClearValue(id); 
        },
        
//        internal void 
        AddValidationError:function(/*ValidationError*/ validationError, /*bool*/ skipBindingGroup/*=false*/) 
        { 
        	if(skipBindingGroup === undefined){
        		skipBindingGroup = false;
        	}
            // add the error to the target element
            Validation.AddValidationError(validationError, this.TargetElement, this.NotifyOnValidationError); 

            // add the error to the binding group's target element
            if (!skipBindingGroup)
            { 
                var bindingGroup = this.BindingGroup;
                if (bindingGroup != null) 
                { 
                    bindingGroup.AddValidationError(validationError);
                } 
            }
        },

//        internal void 
        RemoveValidationError:function(/*ValidationError*/ validationError, /*bool*/ skipBindingGroup/*=false*/) 
        {
            // remove the error from the target element 
            Validation.RemoveValidationError(validationError, this.TargetElement, this.NotifyOnValidationError); 

            // remove the error from the binding group's target element 
            if (!skipBindingGroup)
            {
                var bindingGroup = this.BindingGroup;
                if (bindingGroup != null) 
                {
                    bindingGroup.RemoveValidationError(validationError); 
                } 
            }
        }, 

        // get all errors raised at the given step, in preparation for running
        // the rules at that step
//        internal ValidationError 
        GetValidationErrors:function(/*ValidationStep*/ validationStep) 
        {
            var validationError = this.BaseValidationError; 
            if (validationError == null || validationError.RuleInError.ValidationStep != validationStep) 
                return null;
 
            return validationError;
        },

//        internal void 
        ChangeSources:function(/*WeakDependencySource[]*/ newSources) 
        {
//            if (this.IsInBindingExpressionCollection) 
//            	this.ParentBindingExpressionBase.ChangeSourcesForChild(this, newSources); 
//            else
//            	this.ChangeSources(this.TargetElement, this.TargetProperty, newSources); 
        	
            if (this.IsInBindingExpressionCollection) 
            	this.ParentBindingExpressionBase.ChangeSourcesForChild(this, newSources); 
            else
            	this.ChangeSourcesInternal(this.TargetElement, this.TargetProperty, newSources); 
            	
            // store the sources with weak refs, so they don't cause memory leaks (bug 980041)
            this._sources = newSources;
        },
        
        
        //cym add from ChangeSources in expression and rename 
        /// <summary> 
        ///     Dynamically change this Expression sources (availiable only for NonShareable
        ///     Expressions) 
        /// </summary>
        /// <remarks>
        ///     Expression must be in use on provided DependencyObject/DependencyProperty.
        ///     GetSources must reflect the old sources to be replaced by the provided newSources. 
        /// </remarks>
        /// <param name="d">DependencyObject whose sources are to be updated</param> 
        /// <param name="dp">The property that the Expression is set to</param> 
        /// <param name="newSources">New sources</param>
        /*internal void */
        ChangeSourcesInternal:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp, /*DependencySource[]*/ newSources) 
        {
            if (d == null && !this.ForwardsInvalidations)
            {
                throw new Error("ArgumentNullException('d')"); 
            }
 
            if (dp == null && !this.ForwardsInvalidations) 
            {
                throw new Error("ArgumentNullException('dp')"); 
            }

            if (this.Shareable)
            { 
                throw new Error("InvalidOperationException(SR.Get(SRID.ShareableExpressionsCannotChangeSources)");
            } 
 
//            DependencyObject.ValidateSources(d, newSources, this);
 
            // Additional validation in callee
            if (this.ForwardsInvalidations)
            {
                DependencyObject.ChangeExpressionSources(this, null, null, newSources); 
                
            }
            else 
            { 
                DependencyObject.ChangeExpressionSources(this, d, dp, newSources);
            } 
        },
        
        
//        internal void 
        ResolvePropertyDefaultSettings:function(/*BindingMode*/ mode, /*UpdateSourceTrigger*/ updateTrigger, /*FrameworkPropertyMetadata*/ fwMetaData) 
        {
            // resolve "property-default" dataflow
            if (mode == BindingMode.Default)
            { 
                var f = BindingFlags.OneWay;
                if (fwMetaData != null && fwMetaData.BindsTwoWayByDefault) 
                { 
                    f = BindingFlags.TwoWay;
                } 

                this.ChangeFlag(PrivateFlags.iPropagationMask, false);
                this.ChangeFlag(/*(PrivateFlags)*/f, true);
 
            }
 
            // resolve "property-default" update trigger
            if (updateTrigger == UpdateSourceTrigger.Default) 
            {
                var ust = this.GetDefaultUpdateSourceTrigger(fwMetaData);

                this.SetUpdateSourceTrigger(ust); 
            } 
        },
        
 
        // return the effective update trigger, used when binding doesn't set one explicitly
//        internal UpdateSourceTrigger 
        GetDefaultUpdateSourceTrigger:function(/*FrameworkPropertyMetadata*/ fwMetaData)
        {
            var ust = 
                this.IsInMultiBindingExpression ? UpdateSourceTrigger.Explicit :
                (fwMetaData != null) ? fwMetaData.DefaultUpdateSourceTrigger : 
                                    UpdateSourceTrigger.PropertyChanged; 
            return ust;
        }, 

//        internal void 
        SetUpdateSourceTrigger:function(/*UpdateSourceTrigger*/ ust)
        {
            this.ChangeFlag(PrivateFlags.iUpdateMask, false); 
            this.ChangeFlag(/*(PrivateFlags)*/BindingBase.FlagsFromUpdateSourceTrigger(ust), true);
        }, 
 
//        internal Type 
        GetEffectiveTargetType:function()
        { 
            var targetType = this.TargetProperty.PropertyType;
            var be = this.ParentBindingExpressionBase;

            while (be != null) 
            {
                if (be instanceof MultiBindingExpression) 
                { 
                    // for descendants of a MultiBinding, the effective target
                    // type is Object. 
                    targetType = Object.Type; //typeof(Object);
                    break;
                }
 
                be = be.ParentBindingExpressionBase;
            } 
 
            return targetType;
        },

//        internal void 
        DetermineEffectiveStringFormat:function()
        {
            var targetType = this.TargetProperty.PropertyType; 
            if (targetType != String.Type /*typeof(String)*/)
            { 
                // if the target type isn't String, we don't need a string format 
                return; // _effectiveStringFormat is already null
            } 

            // determine the effective target type and the declared string format
            // by looking up the tree of binding expressions
            var stringFormat = this.ParentBindingBase.StringFormat; 
            var be = this.ParentBindingExpressionBase;
 
            while (be != null) 
            {
                if (be instanceof MultiBindingExpression) 
                {
                    // MultiBindings should receive object values, not string
                    targetType = Object.Type; //typeof(Object);
                    break; 
                }
                else if (stringFormat == null && be instanceof PriorityBindingExpression) 
                { 
                    // use a PriorityBinding's string format, unless we already
                    // have a more specific one 
                    stringFormat = be.ParentBindingBase.StringFormat;
                }

                be = be.ParentBindingExpressionBase; 
            }
 
//            // if we need a string format, cache it 
//            if (targetType == String.Type) //typeof(String))
//            { 
////                #if NotToday
//                // special case: when these conditions all apply
//                //      a) target element belongs to a DataTemplate
//                //      b) template was found by implicit (type-based) lookup 
//                //      c) container (ContentPresenter) has a string format
//                //      d) binding has no effective string format 
//                // then use the CP's string format.  This enables scenarios like 
//                //      <DataTemplate DataType="{x:Type Customer}">
//                //          <TextBlock Text="{Binding Path=AmountPayable}" 
//                //      </DataTemplate>
//                //      <ContentControl Content="{StaticResource MyCustomer}" ContentStringFormat="C2"/>
//                // where you'd like to control the format at the point of use,
//                // rather than at the point of template declaration.  This is 
//                // especially useful when the template is declared in a global place
//                // like app resources or a theme file.  In particular it makes the 
//                // GroupStyle.HeaderStringFormat property work;  the template for 
//                // GroupItem is defined in the theme, but needs to pick up formatting
//                // from the app's markup. 
//
//                if (stringFormat == null)   // (d)
//                {
//                    var fo = new FrameworkObject(Helper.FindMentor(TargetElement)); 
//                    var cp = fo.TemplatedParent instanceof ContentPresenter ? fo.TemplatedParent : null;
//                    if (cp != null &&                       // (a) 
//                        cp.ContentStringFormat != null)     // (c) 
//                    {
//                        var dt = cp.TemplateInternal instanceof DataTemplate ? cp.TemplateInternal : null; 
//                        if (dt != null &&                   // (a)
//                            dt.DataType != null)            // (b)
//                        {
//                            stringFormat = cp.ContentStringFormat; 
//                        }
//                    } 
//                } 
////                #endif
// 
//                if (!String.IsNullOrEmpty(stringFormat))
//                {
//                    this.SetValue(Feature.EffectiveStringFormat, Helper.GetEffectiveStringFormat(stringFormat), null);
//                } 
//              }
            },
            


//            internal virtual void 
            Activate:function() 
            {
            },
     
//            internal virtual void 
            Deactivate:function()
            { 
            },

//            internal bool 
            Update:function()
            { 
//                if (this.HasValue(Feature.Timer))
//                { 
//                    DispatcherTimer timer = (DispatcherTimer)GetValue(Feature.Timer, null); 
//                    timer.Stop();
//                } 

                return this.UpdateOverride();
            },
     
//            internal virtual bool 
            UpdateOverride:function()
            { 
                return true; 
            },
     
//            internal void 
            UpdateValidationError:function(/*ValidationError*/ validationError, /*bool*/ skipBindingGroup/*=false*/)
            {
            	if(skipBindingGroup === undefined){
            		skipBindingGroup = false;
            	}
                // the steps are carefully ordered to avoid going through a "no error"
                // state while replacing one error with another 
                var oldValidationError = this.BaseValidationError;
     
                this.SetFeatureValue(Feature.ValidationError, validationError, null); 

                if (validationError != null) 
                {
                    this.AddValidationError(validationError, skipBindingGroup);
                }
     
                if (oldValidationError != null)
                { 
                    this.RemoveValidationError(oldValidationError, skipBindingGroup); 
                }
            }, 

//            internal void 
            UpdateNotifyDataErrorValidationErrors:function(/*List<object>*/ errors)
            {

                var parObject = {"toAdd" : null, "toRemove" : null};
//                this.GetValidationDelta(NotifyDataErrors, errors, out toAdd, out toRemove); 
                BindingExpressionBase.GetValidationDelta(this.NotifyDataErrors, errors, parObject); 

                /*List<object>*/var toAdd = parObject.toAdd; 
                /*List<ValidationError>*/var toRemove = parObject.toRemove;
                // add the new errors, then remove the old ones - this avoid a transient 
                // "no error" state
                if (parObject.toAdd != null && toAdd.Count > 0)
                {
                    var rule = NotifyDataErrorValidationRule.Instance; 
                    var notifyDataErrors = this.NotifyDataErrors;
     
                    if (notifyDataErrors == null) 
                    {
                        notifyDataErrors = new List(); 
                        this.SetFeatureValue(Feature.NotifyDataErrors, notifyDataErrors);
                    }

                    for (var i=0; i<toAdd.Count; i++) 
                    {
                        var veAdd = new ValidationError(rule, this, toAdd.Get(i), null); 
                        this.notifyDataErrors.Add(veAdd); 
                        this.AddValidationError(veAdd);
                    } 
                }

                if (toRemove != null && toRemove.Count > 0)
                { 
                    var notifyDataErrors = this.NotifyDataErrors;
                    for(var i=0; i<toRemove.Count; i++) 
                    { 
                    	var veRemove = toRemove.Get(i);
                        notifyDataErrors.Remove(veRemove);
                        this.RemoveValidationError(veRemove); 
                    }

                    if (notifyDataErrors.Count == 0)
                        this.ClearValue(Feature.NotifyDataErrors); 
                }
            },
 
//        internal void 
        DetermineEffectiveTargetNullValue:function()
        { 
            var targetType = this.TargetProperty.PropertyType;

            // determine the effective target type and the declared TargetNullValue
            // by looking up the tree of binding expressions 
            var targetNullValue = this.ParentBindingBase.TargetNullValue;
            var be = this.ParentBindingExpressionBase; 
 
            while (be != null)
            { 
                if (be instanceof MultiBindingExpression)
                {
                    // MultiBindings should receive object values
                    targetType = Object.Type; //typeof(Object); 
                    break;
                } 
                else if (targetNullValue == Type.UnsetValue && be instanceof PriorityBindingExpression) 
                {
                    // use a PriorityBinding's TargetNullValue, unless we already 
                    // have a more specific one
                    targetNullValue = be.ParentBindingBase.TargetNullValue;
                }
 
                be = be.ParentBindingExpressionBase;
            } 
 
            // if user declared a TargetNullValue, make sure it has the right type.
            if (targetNullValue != Type.UnsetValue) 
            {
                targetNullValue = this.ConvertTargetNullValue(targetNullValue, TargetProperty, this);
                if (targetNullValue == BindingExpressionBase.DefaultValueObject)
                { 
                    // if not, ignore it (having logged a trace message)
                    targetNullValue = Type.UnsetValue; 
                } 
            }
 
            // for back-compat, don't turn on TargetNullValue unless user explicitly
            // asks for it.  This means users have to add TargetNullValue to get
            // pretty basic scenarios to work (e.g. binding a TextBox to a database
            // string field that supports DBNull).  It's painful, but can't be 
            // helped.
//            #if TargetNullValueBC //BreakingChange 
            // if no declared (or poorly declared) value, make one up 
            if (targetNullValue == Type.UnsetValue)
            { 
                targetNullValue = this.NullValueForType(targetType);
            }
//            #endif
 
            this.SetFeatureValue(Feature.EffectiveTargetNullValue, targetNullValue, Type.UnsetValue);
        },
 
//        void 
        DetermineEffectiveUpdateBehavior:function()
        { 
            // only need to honor update behavior when the binding does updates,
            // and isn't governed by a multibinding (which drives the updates)
            if (!this.IsReflective)
                return; 
            for (var ancestor = this.ParentBindingExpressionBase;
                    ancestor != null;  ancestor = ancestor.ParentBindingExpressionBase) 
            { 
                if (ancestor instanceof MultiBindingExpression)
                    return; 
            }

//            // get the update behavior (delay, validation, preview) from the Binding
//            var delay = ParentBindingBase.Delay; 
//
//            if (delay > 0 && (this.IsUpdateOnPropertyChanged)) 
//            { 
//                DispatcherTimer timer = new DispatcherTimer();
//                SetValue(Feature.Timer, timer); 
//                timer.Interval = TimeSpan.FromMilliseconds(delay);
//                timer.Tick += new EventHandler(OnTimerTick);
//            }
        },

//        internal void 
        DetermineEffectiveValidatesOnNotifyDataErrors:function() 
        { 
            var result = this.ParentBindingBase.ValidatesOnNotifyDataErrorsInternal;
            var beb = this.ParentBindingExpressionBase; 
            while (result && beb != null)
            {
                result = beb.ValidatesOnNotifyDataErrors;
                beb = beb.ParentBindingExpressionBase; 
            }
            this.ChangeFlag(PrivateFlags.iValidatesOnNotifyDataErrors, result); 
        },
        
        //cym add from SubClass TargetElement
        GetTargetElement:function(){
        	
        }
		
	});
	
	Object.defineProperties(BindingExpressionBase.prototype, {
 
	       /// <summary> The element to which this BindingExpression is attached </summary>
//        public DependencyObject 
        Target: { get:function() { return this.TargetElement; } },

        /// <summary> The property to which this BindingExpression is attached </summary> 
//        public DependencyProperty 
        TargetProperty: { get:function() { return this._targetProperty; } },
 
        /// <summary> Binding from which this BindingExpression was created </summary> 
//        public BindingBase  
        ParentBindingBase:  { get:function() { return this._binding; } },
 
        /// <summary> The BindingGroup to which this BindingExpression belongs (or null) </summary>
//        public BindingGroup 
        BindingGroup:
        {
            get:function() 
            {
//                BindingExpressionBase root = RootBindingExpression; 
//                WeakReference<BindingGroup> wr = (WeakReference<BindingGroup>)root.GetValue(Feature.BindingGroup, null); 
//                if (wr == null)
//                    return null; 
//                else
//                {
//                    BindingGroup bg;
//                    return (wr.TryGetTarget(out bg)) ? bg : null; 
//                }
//                
                return this.RootBindingExpression.GetFeatureValue(Feature.BindingGroup, null); 
            } 
        }, 

        /// <summary>Status of the BindingExpression</summary> 
//        public BindingStatus 
        Status: { get:function() { return /*(BindingStatus)*/this._status; } },

//        internal BindingStatusInternal 
        StatusInternal: { get:function() { return this._status; } },
 
        /// <summary>
        ///     The ValidationError that caused this 
        ///     BindingExpression to be invalid. 
        /// </summary>
//        public virtual ValidationError 
        ValidationError: 
        {
            get:function() { return this.BaseValidationError; }
        },
 
//        internal ValidationError 
        BaseValidationError:
        { 
            get:function() { return /*(ValidationError)*/this.GetFeatureValue(Feature.ValidationError, null); } 
        },
 
//        internal List<ValidationError> 
        NotifyDataErrors:
        {
            get:function() { return /*(List<ValidationError>)*/this.GetFeatureValue(Feature.NotifyDataErrors, null); }
        },

        /// <summary> 
        ///     HasError returns true if any of the ValidationRules 
        ///     in the ParentBinding failed its validation rule.
        /// </summary> 
//        public virtual bool 
        HasError:
        {
            get:function() { return this.HasValidationError; }
        },

        /// <summary> 
        ///     HasValidationError returns true if any of the ValidationRules 
        ///     in the ParentBinding failed its validation rule.
        /// </summary> 
//        public virtual bool 
        HasValidationError:
        {
            get:function()
            { 
                return this.HasValue(Feature.ValidationError) || this.HasValue(Feature.NotifyDataErrors);
            } 
        },

        /// <summary> 
        ///     IsDirty returns true if the target property has a new value that
        ///     has not yet been written to the source property.   (This applies
        ///     only to bindings that are TwoWay or OneWayToSource.)
        /// </summary> 
//        public bool 
        IsDirty:
        { 
            get:function() { return this.NeedsUpdate; } 
        },
 
        /// <summary>
        ///     ValidationErrors returns the validation errors currently
        ///     arising from this binding, or null if there are no errors.
        /// </summary> 
//        public virtual ReadOnlyCollection<ValidationError> 
        ValidationErrors:
        { 
            get:function() 
            {
                if (this.HasError) 
                {
                    /*List<ValidationError>*/var list;

                    if (!this.HasValue(Feature.ValidationError)) 
                    {
                        list = this.NotifyDataErrors; 
                    } 
                    else
                    { 

                        if (this.NotifyDataErrors == null)
                        {
                            list = new List/*<ValidationError>*/(); 
                        }
                        else 
                        { 
                            list = new List/*<ValidationError>*/(this.NotifyDataErrors);
                        } 
                        list.Insert(0, this.BaseValidationError);
                    }

                    return new ReadOnlyCollection/*<ValidationError>*/(list); 
                }
                else 
                    return null; 
            }
        },
        
        /// <summary> This event is raised when the BindingExpression's value changes </summary>
    	//internal event EventHandler<BindingValueChangedEventArgs> ValueChanged; 
    	ValueChanged:
    	{
    		get:function(){
    			if(BindingExpressionBase._ValueChanged === undefined){
    				BindingExpressionBase._ValueChanged = new EventHandler();
    			}
    			
    			return BindingExpressionBase._ValueChanged;
    		}
    	},

        /// <summary> True if this binding expression is attaching </summary> 
//        internal bool 
        IsAttaching:
        {
            get:function() { return this.TestFlag(PrivateFlags.iAttaching); },
            set:function(value) { this.ChangeFlag(PrivateFlags.iAttaching, value); } 
        },
 
        /// <summary> True if this binding expression is detaching </summary> 
//        internal bool 
        IsDetaching:
        { 
            get:function() { return this.TestFlag(PrivateFlags.iDetaching); },
            set:function(value) { this.ChangeFlag(PrivateFlags.iDetaching, value); }
        },
 
        /// <summary> True if this binding expression is detached </summary>
//        internal bool 
        IsDetached: 
        { 
            get:function() { return (this._status == BindingStatusInternal.Detached); }
        },

//        private bool 
        IsAttached:
        {
            get:function() { return (this._status != BindingStatusInternal.Unattached && 
            		this._status != BindingStatusInternal.Detached &&
                        !this.IsDetaching); } 
        }, 

        /// <summary> True if this binding expression updates the target </summary> 
//        internal bool 
        IsDynamic:
        {
            get:function()
            { 
                return (    this.TestFlag(PrivateFlags.iSourceToTarget)
                        &&  (!this.IsInMultiBindingExpression || ParentMultiBindingExpression.IsDynamic)); 
            } 
        },
 
        /// <summary> True if this binding expression updates the source </summary>
//        internal bool 
        IsReflective:
        {
            get:function()
            {
                return (    this.TestFlag(PrivateFlags.iTargetToSource) 
                        &&  (!this.IsInMultiBindingExpression || ParentMultiBindingExpression.IsReflective)); 
            },
            set:function(value) { this.ChangeFlag(PrivateFlags.iTargetToSource, value); } 
        },

        /// <summary> True if this binding expression uses a default ValueConverter </summary>
//        internal bool 
        UseDefaultValueConverter: 
        {
            get:function() { return this.TestFlag(PrivateFlags.iDefaultValueConverter); }, 
            set:function(value) { this.ChangeFlag(PrivateFlags.iDefaultValueConverter, value); } 
        },
 
        /// <summary> True if this binding expression is OneWayToSource </summary>
//        internal bool 
        IsOneWayToSource:
        {
            get:function() { return (this._flags & PrivateFlags.iPropagationMask) == PrivateFlags.iTargetToSource; } 
        },
 
        /// <summary> True if this binding expression updates on PropertyChanged </summary> 
//        internal bool 
        IsUpdateOnPropertyChanged:
        { 
            get:function() { return (this._flags & PrivateFlags.iUpdateMask) == 0; }
        },

        /// <summary> True if this binding expression updates on LostFocus </summary> 
//        internal bool 
        IsUpdateOnLostFocus:
        { 
            get:function() { return this.TestFlag(PrivateFlags.iUpdateOnLostFocus); } 
        },
 
        /// <summary> True if this binding expression has a pending target update </summary>
//        internal bool 
        IsTransferPending:
        {
            get:function() { return this.TestFlag(PrivateFlags.iTransferPending); }, 
            set:function(value) { this.ChangeFlag(PrivateFlags.iTransferPending, value); }
        }, 
 
        /// <summary> True if this binding expression is deferring a target update </summary>
//        internal bool 
        TransferIsDeferred:
        {
            get:function() { return this.TestFlag(PrivateFlags.iTransferDeferred); },
            set:function(value) { this.ChangeFlag(PrivateFlags.iTransferDeferred, value); }
        }, 

        /// <summary> True if this binding expression is updating the target </summary> 
//        internal bool 
        IsInTransfer: 
        {
            get:function() { return this.TestFlag(PrivateFlags.iInTransfer); }, 
            set:function(value) { this.ChangeFlag(PrivateFlags.iInTransfer, value); }
        },

        /// <summary> True if this binding expression is updating the source </summary> 
//        internal bool 
        IsInUpdate:
        { 
            get:function() { return this.TestFlag(PrivateFlags.iInUpdate); },
            set:function(value) { this.ChangeFlag(PrivateFlags.iInUpdate, value); }
        }, 

        /// <summary> True if this binding expression is using the fallback value </summary>
//        internal bool 
        UsingFallbackValue:
        { 
            get:function() { return this.TestFlag(PrivateFlags.iUsingFallbackValue); },
            set:function(value) { this.ChangeFlag(PrivateFlags.iUsingFallbackValue, value); } 
        },

        /// <summary> True if this binding expression uses the mentor of the target element </summary> 
//        internal bool 
        UsingMentor: 
        {
            get:function() { return this.TestFlag(PrivateFlags.iUsingMentor); },
            set:function(value) { this.ChangeFlag(PrivateFlags.iUsingMentor, value); }         },
 
        /// <summary> True if this binding expression should resolve ElementName within the template of the target element </summary> 
//        internal bool 
        ResolveNamesInTemplate:
        { 
            get:function() { return this.TestFlag(PrivateFlags.iResolveNamesInTemplate); },
            set:function(value) { this.ChangeFlag(PrivateFlags.iResolveNamesInTemplate, value); }        },
 
        /// <summary> True if this binding expression has a pending target update </summary>
//        internal bool 
        NeedsDaaTransfer: 
        { 
            get:function() { return this.TestFlag(PrivateFlags.iNeedDataTransfer); },
            set:function(value) { this.ChangeFlag(PrivateFlags.iNeedDataTransfer, value); } 
        },

        /// <summary> True if this binding expression has a pending source update </summary>
//        internal bool 
        NeedsUpdate:
        {
            get:function() { return this.TestFlag(PrivateFlags.iNeedsUpdate); }, 
            set:function(value) 
            {
            	this.ChangeFlag(PrivateFlags.iNeedsUpdate, value); 
                if (value)
                {
                	this.NeedsValidation = true;
                } 
            }
        }, 
 
        /// <summary> True if this binding expression needs validation </summary>
//        internal bool 
        NeedsValidation:
        {
            get:function() { return this.TestFlag(PrivateFlags.iNeedsValidation) || HasValue(Feature.ValidationError); },
            set:function(value) { this.ChangeFlag(PrivateFlags.iNeedsValidation, value); }
        }, 

        /// <summary> True if this binding expression should raise the TargetUpdated event </summary> 
//        internal bool 
        NotifyOnTargetUpdated: 
        {
            get:function() { return this.TestFlag(PrivateFlags.iNotifyOnTargetUpdated); }, 
            set:function(value) { this.ChangeFlag(PrivateFlags.iNotifyOnTargetUpdated, value); }
        },

        /// <summary> True if this binding expression should raise the SourceUpdated event </summary> 
//        internal bool 
        NotifyOnSourceUpdated:
        { 
            get:function() { return this.TestFlag(PrivateFlags.iNotifyOnSourceUpdated); }, 
            set:function(value) { this.ChangeFlag(PrivateFlags.iNotifyOnSourceUpdated, value); }
        }, 

        /// <summary> True if this binding expression should raise the ValidationError event </summary>
//        internal bool 
        NotifyOnValidationError:
        { 
            get:function() { return this.TestFlag(PrivateFlags.iNotifyOnValidationError); },
            set:function(value) { this.ChangeFlag(PrivateFlags.iNotifyOnValidationError, value); } 
        }, 

        /// <summary> True if this binding expression belongs to a PriorityBinding </summary> 
//        internal bool 
        IsInPriorityBindingExpression:
        {
            get:function() { return this.TestFlag(PrivateFlags.iInPriorityBindingExpression); }
        }, 

        /// <summary> True if this binding expression belongs to a MultiBinding </summary> 
//        internal bool 
        IsInMultiBindingExpression: 
        {
            get:function() { return this.TestFlag(PrivateFlags.iInMultiBindingExpression); } 
        },

        /// <summary> True if this binding expression belongs to a PriorityBinding or MultiBinding </summary>
//        internal bool 
        IsInBindingExpressionCollection: 
        {
            get:function() { return this.TestFlag(PrivateFlags.iInPriorityBindingExpression | PrivateFlags.iInMultiBindingExpression); } 
        }, 

        /// <summary> True if this binding expression validates on exceptions </summary> 
//        internal bool 
        ValidatesOnExceptions:
        {
            get:function() { return this.TestFlag(PrivateFlags.iValidatesOnExceptions); }
        }, 

        /// <summary> True if this binding expression validates on data errors </summary> 
//        internal bool 
        ValidatesOnDataErrors: 
        {
            get:function() { return this.TestFlag(PrivateFlags.iValidatesOnDataErrors); } 
        },

        /// <summary> True if the target wants to hear about cross-thread property changes immediately </summary>
//        internal bool 
        TargetWantsCrossThreadNotifications: 
        {
            get:function() { return this.TestFlag(PrivateFlags.iTargetWantsXTNotification); }, 
            set:function(value) { this.ChangeFlag(PrivateFlags.iTargetWantsXTNotification, value); } 
        },
 
        /// <summary> True if this binding expression has a pending DataErrorsChanged notification </summary>
//        internal bool 
        IsDataErrorsChangedPending:
        {
            get:function() { return this.TestFlag(PrivateFlags.iDataErrorsChangedPending); },
            set:function(value) { this.ChangeFlag(PrivateFlags.iDataErrorsChangedPending, value); }
        }, 
 
        /// <summary> True if this binding expression is waiting for an IME composition to complete before updating its source </summary>
//        internal bool 
        IsUpdateDeferredForComposition: 
        {
            get:function() { return this.TestFlag(PrivateFlags.iDeferUpdateForComposition); },
            set:function(value) { this.ChangeFlag(PrivateFlags.iDeferUpdateForComposition, value); }
        },

        /// <summary> True if this binding expression validates on notify data errors </summary> 
//        internal bool 
        ValidatesOnNotifyDataErrors: 
        {
            get:function() { return this.TestFlag(PrivateFlags.iValidatesOnNotifyDataErrors); } 
        },

        /// <summary> The parent MultiBindingExpression (if any) </summary>
//        internal MultiBindingExpression 
        ParentMultiBindingExpression: 
        {
            get:function() { 
            	var temp = this.GetFeatureValue(Feature.ParentBindingExpressionBase, null) ;
            	return temp instanceof MultiBindingExpression ? temp : null; } 
        }, 

        /// <summary> The parent PriorityBindingExpression (if any) </summary> 
//        internal PriorityBindingExpression 
        ParentPriorityBindingExpression:
        {
            get:function() { 
            	var temp = this.GetFeatureValue(Feature.ParentBindingExpressionBase, null);
            	return temp instanceof PriorityBindingExpression ? temp : null; }
        }, 

        /// <summary> The parent PriorityBindingExpression or MultiBindingExpression (if any) </summary> 
//        internal BindingExpressionBase 
        ParentBindingExpressionBase:
        {
            get:function() { return this.GetFeatureValue(Feature.ParentBindingExpressionBase, null); } 
        },

        /// <summary> The FallbackValue (from the parent Binding), possibly converted
        /// to a type suitable for the target property.</summary> 
//        internal object 
        FallbackValue:
        { 
            // perf note: we recompute the value every time it's needed.  This is 
            // a good decision if we seldom need the value.  Alternatively we could
            // cache it.  Wait until we know what the perf impact really is. 
            get:function() { return BindingExpressionBase.ConvertFallbackValue(this.ParentBindingBase.FallbackValue, this.TargetProperty, this); }
        },

        /// <summary> The default value of the target property </summary> 
//        internal object 
        DefaultValue:
        { 
            // perf note: we recompute the value every time it's needed.  This is 
            // a good decision if we seldom need the value.  Alternatively we could
            // cache it.  Wait until we know what the perf impact really is. 
            get:function()
            {
                /*DependencyObject*/var target = this.TargetElement;
                if (target != null) 
                {
                    return this.TargetProperty.GetDefaultValue(target.DependencyObjectType); 
                } 
                return Type.UnsetValue;
            } 
        },

        /// <summary> The effective string format, taking into account the target
        /// property, parent bindings, convenience syntax, etc. </summary> 
//        internal string 
        EffectiveStringFormat:
        { 
            get:function() { return /*(string)*/this.GetFeatureValue(Feature.EffectiveStringFormat, null); } 
        },
 
        /// <summary> The effective TargetNullValue, taking into account the target
        /// property, parent bindings, etc. </summary>
//        internal object 
        EffectiveTargetNullValue:
        { 
            get:function() { return this.GetFeatureValue(Feature.EffectiveTargetNullValue, Type.UnsetValue); }
        }, 
 
        /// <summary> return the root of the tree of {Multi/Priority}BindingExpressions</summary>
//        internal BindingExpressionBase 
        RootBindingExpression: 
        {
            get:function()
            {
                /*BindingExpressionBase*/var child = this; 
                /*BindingExpressionBase*/var parent = this.ParentBindingExpressionBase;
                while (parent != null) 
                { 
                    child = parent;
                    parent = child.ParentBindingExpressionBase; 
                }
                return child;
            }
        }, 

//        internal virtual bool 
        IsParentBindingUpdateTriggerDefault:
        { 
            get:function() { return false; }
        }, 

//        internal bool 
        UsesLanguage:
        {
            get:function() { return (this.ParentBindingBase.ConverterCultureInternal == null); } 
        },
 
//        internal bool 
        IsEligibleForCommit:
        {
            get:function() 
            {
                if (this.IsDetaching)
                    return false;
 
                switch (this.StatusInternal)
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
        },
        
        
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
//        internal DependencyObject 
        TargetElement:
        { 
            get:function()
            { 
                if (this._targetElement != null)
                {
                    var result = this._targetElement instanceof DependencyObject ? this._targetElement : null;
                    if (result != null) 
                        return result;
 
                    // target has been GC'd, sever all connections 
                    this._targetElement = null;      // prevents re-entry from Detach()
                    this.Detach(); 
                    
                }

                return null;
            } 
        },
 
//        internal WeakReference 
        TargetElementReference: 
        {
            get:function() { return this._targetElement; } 
        },

//        internal DataBindEngine 
        Engine:
        { 
            get:function() { return this._engine; }
        }, 
 
//        internal Dispatcher 
        Dispatcher:
        { 
            get:function() { return (this._engine != null) ? this._engine.Dispatcher : null; }
        },

//        internal object 
        Value:
        {
            get:function() 
            { 
                if (this._value === BindingExpressionBase.DefaultValueObject)
                { 
                    // don't notify listeners.  This isn't a real value change.
                	this.ChangeValue(this.UseFallbackValue(), false /*notify*/);
                }
                return this._value; 
            },
            set:function(value) 
            { 
            	this.ChangeValue(value, true);
                this.Dirty(); 
            }
        },

//        internal WeakDependencySource[] 
        WeakSources: 
        {
            get:function() { return this._sources; } 
        },

        // queried by MultiBindings.  Only implemented today by BindingExpression. 
        // If we ever support nested MultiBindings, implement this in MultiBinding
        // as well.
//        internal virtual bool 
        IsDisconnected:
        { 
            get:function() { return false; }
        },

	});
	
	 

    Object.defineProperties(BindingExpressionBase, {
    	 
        /// <summary>
        ///     NoTarget DependencyProperty, a placeholder used by BindingExpressions with no target property 
        /// </summary>
        NoTargetProperty:
        {
        	get:function(){
        		if(BindingExpressionBase._NoTargetProperty==null){
        			BindingExpressionBase._NoTargetProperty=DependencyProperty.RegisterAttached("NoTarget", Object.Type, 
        					BindingExpressionBase.Type,
        					FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.None)); 
        		}
        		
        		return BindingExpressionBase._NoTargetProperty;
        	}
        }  
    });
    
    /// <summary> Sentinel meaning "field has its default value" </summary>
//    internal static readonly object 
    BindingExpressionBase.DefaultValueObject = {name:"DefaultValue"};

    // sentinel value meaning "unhook from previous item's events, but do not 
    // change values (except for special cases)"
//    internal static readonly object 
    BindingExpressionBase.DisconnectedItem = {name:"DisconnectedItem"}; 
    
    /// <summary> Create an untargeted BindingExpression </summary> 
//  internal static BindingExpressionBase 
    BindingExpressionBase.CreateUntargetedBindingExpression = function(/*DependencyObject*/ d, /*BindingBase*/ binding)
    { 
    	return binding.CreateBindingExpression(d, BindingExpressionBase.NoTargetProperty);
    };
    
    // convert a user-supplied fallback value to a usable equivalent
    //  returns:    UnsetValue          if user did not supply a fallback value
    //              value               if fallback value is legal
    //              DefaultValueObject  otherwise 
//    internal static object 
    BindingExpressionBase.ConvertFallbackValue = function(/*object*/ value, /*DependencyProperty*/ dp, /*object*/ sender)
    { 
//        /*Exception*/var e; 
        var eObj = {"e":null};
        var result = BindingExpressionBase.ConvertValue(value, dp, /*out e*/eObj);

        return result; 
    };

    // convert a user-supplied TargetNullValue to a usable equivalent 
    //  returns:    UnsetValue          if user did not supply a fallback value
    //              value               if fallback value is legal
    //              DefaultValueObject  otherwise
//    internal static object 
    ConvertTargetNullValue = function(/*object*/ value, /*DependencyProperty*/ dp, /*object*/ sender) 
    {
//        /*Exception*/var e; 
        var parObj = {"e":null};
        var result = BindingExpressionBase.ConvertValue(value, dp, /*out e*/parObj); 

        return result;
    };

//    static object 
    BindingExpressionBase.ConvertValue = function(/*object*/ value, /*DependencyProperty*/ dp, /*out Exception e*/parObj)
    { 
        var result;
        e = null;

        if (value == Type.UnsetValue || dp.IsValidValue(value)) 
        {
            result = value; 
        } 
        else
        { 
            result = null;  // placeholder to keep compiler happy
            // if value isn't the right type, use a type converter to get a better value
            var success = false;
            /*TypeConverter*/var converter = DefaultValueConverter.GetConverter(dp.PropertyType); 
            if (converter != null && converter.CanConvertFrom(value.GetType()))
            { 
                // PreSharp uses message numbers that the C# compiler doesn't know about. 
                // Disable the C# complaints, per the PreSharp documentation.

                // PreSharp complains about catching NullReference (and other) exceptions.
                // It doesn't recognize that IsCriticalException() handles these correctly.

                try 
                { 
                    result = converter.ConvertFrom(null, CultureInfo.InvariantCulture, value);
                    success = dp.IsValidValue(result); 
                }

                // Catch all exceptions.  If we can't convert the fallback value, it doesn't
                // matter why not;  we should always use the default value instead. 
                // (See bug 1853628 for an example of a converter that throws
                // an exception not mentioned in the documentation for ConvertFrom.) 
                catch (ex) 
                {
                	parObj.e = ex; 
                }

            }

            if (!success)
            {
                // if can't convert it, don't use it
                result = BindingExpressionBase.DefaultValueObject; 
            }
        } 

        return result;
    };
    

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
//    internal static WeakDependencySource[] 
    CombineSources = function(/*int*/ index, 
                                    /*Collection<BindingExpressionBase>*/ bindingExpressions,
                                    /*int*/ count, 
                                    /*WeakDependencySource[]*/ newSources,
                                    /*WeakDependencySource[]*/ commonSources/* = null*/)
    {
        if (index == count) 
        {
            // Be sure to include newSources if they are being appended 
            count++; 
        }

        /*Collection<WeakDependencySource>*/var tempList = new Collection/*<WeakDependencySource>*/();

        if (commonSources != null)
        { 
            for (var i=0; i < commonSources.length; ++i)
            { 
                tempList.Add(commonSources[i]); 
            }
        } 

        for (var i = 0; i < count; ++i)
        {
            var bindExpr = bindingExpressions.Get(i);
			var sources = (i == index) ? newSources
					: (bindExpr != null) ? bindExpr.WeakSources : null;
			var m = (sources == null) ? 0 : sources.length;
			for ( var j = 0; j < m; ++j) {
				var candidate = sources[j];

				// don't add duplicate source
				for ( var k = 0; k < tempList.Count; ++k) {
					var prior = tempList.Get(k);
					if (candidate.DependencyObject == prior.DependencyObject
							&& candidate.DependencyProperty == prior.DependencyProperty) {
						candidate = null;
						break;
					}
				}

				if (candidate != null)
					tempList.Add(candidate);
			} 
        }

        /* WeakDependencySource[] */var result;
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
    };

//    internal static void 
    BindingExpressionBase.GetValidationDelta = function(/*List<ValidationError>*/ previousErrors, 
    		/*List<object>*/ errors, /*out List<object> toAdd, out List<ValidationError> toRemove*/parObject)
    { 
        // determine the errors to add and the validation results to remove,
        // taking duplicates into account
        if (previousErrors == null || previousErrors.Count == 0)
        { 
        	parObject.toAdd = errors;
        	parObject.toRemove = null; 
        } 
        else if (errors == null || errors.Count == 0)
        { 
        	parObject.toAdd = null;
        	parObjecttoRemove = new List/*<ValidationError>*/(previousErrors);
        }
        else 
        {
        	parObject.toAdd = new List/*<object>*/(); 
        	parObject.toRemove = new List/*<ValidationError>*/(previousErrors); 

            for (var i=errors.Count-1; i>=0; --i) 
            {
                var errorContent = errors.Get(i);

                var j; 
                for (j=parObject.toRemove.Count-1; j>=0; --j)
                { 
                    if (Object.Equals(toRemove.Get(j).ErrorContent, errorContent)) 
                    {
                        // this error appears on both lists - remove it from toRemove 
                    	parObject.toRemove.RemoveAt(j);
                        break;
                    }
                } 

                if (j<0) 
                { 
                    // this error didn't appear on toRemove - add it to toAdd
                	parObject.toAdd.Add(errorContent); 
                }
            }
        }
    }; 


    BindingExpressionBase.Feature = Feature;
	BindingExpressionBase.Type = new Type("BindingExpressionBase", BindingExpressionBase, [Expression.Type, IWeakEventListener.Type]);
	
	return BindingExpressionBase;
});
 

        

//        // To prevent memory leaks, we store WeakReferences to certain objects 
//        // in various places:  _dataItem, _sources, worker fields.  The logic
//        // for this is centralized in these two static methods.  (See bug 940041)
//
//        internal static object CreateReference(object item) 
//        {
//            // One source of leaks is the reference cycle formed when a BindingExpression's 
//            // source item contains a reference chain to the target element: 
//            //      target -> BindingExpression -> source item -> target
//            // 
//            // Making the second link into a WeakReference incurs some cost,
//            // so it should be avoided if we know the third link never exists.
//            // We definitely can't avoid this when the item is a DependencyObject,
//            // since it's reasonably common for the third link to occur (e.g. 
//            // a ContextMenu contains a link to its Popup, which has a property
//            // bound back to the ContextMenu). 
//            // 
//            // For safety, we choose to use WeakRef all the time, unless the item is null.
//            // Exception (bug 1124954):  Keep a strong reference to 
//            // BindingListCollectionView - this keeps the underlying DataView
//            // alive, when nobody else will.
//            // Exception (bug 1970505):  Don't allocate a WeakRef for the common
//            // case of the NullDataItem 
//
//            if (item != null && 
//                !(item is BindingListCollectionView) && 
//                !(item == BindingExpression.NullDataItem) &&
//                !(item == DisconnectedItem)) 
//            {
//                item = new WeakReference(item);
//            }
//
//            return item; 
//        }
//
//        // like CreateReference, but use an existing WeakReference
//        internal static object CreateReference(WeakReference item) 
//        {
//            object result = item; 
//            return result;
//        }
//
//        // like CreateReference, except re-target the old WeakReference (if any) 
//        internal static object ReplaceReference(object oldReference, object item)
//        { 
//            if (item != null && 
//                !(item is BindingListCollectionView) &&
//                !(item == BindingExpression.NullDataItem) && 
//                !(item == DisconnectedItem))
//            {
//                WeakReference wr = oldReference as WeakReference;
//                if (wr != null) 
//                {
//                    wr.Target = item;
//                    item = wr;
//                } 
//                else
//                { 
//                    item = new WeakReference(item); 
//                }
//            } 
//
//            return item; 
//        } 
//
//        internal static object GetReference(object reference) 
//        {
//            if (reference == null)
//                return null;
// 
//            WeakReference wr = reference as WeakReference;
//            if (wr != null)
//                return wr.Target; 
//            else
//                return reference; 
//        } 
//
//        internal static void InitializeTracing(BindingExpressionBase expr, DependencyObject d, DependencyProperty dp) 
//        {
//            BindingBase parent = expr.ParentBindingBase;
//        }
        
 

 
        // sentinel value meaning "no binding group"
//        static readonly WeakReference<BindingGroup> NullBindingGroupReference = new WeakReference<BindingGroup>(null); 
 

 

