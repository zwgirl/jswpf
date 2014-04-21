/**
 * DependencyObject
 */
define(["dojo/_base/declare", "threading/DispatcherObject", "windows/DependencyProperty", 
        "windows/UpdateResult", "windows/DependencyObjectType", "windows/RequestFlags", 
        "windows/DeferredReference", "windows/Expression", "windows/OperationType", "windows/EffectiveValueEntry",
        "windows/DependencyPropertyKey", "windows/DependencyPropertyChangedEventArgs",
        "windows/AlternativeExpressionStorageCallback", "windows/LocalValueEntry",
        "windows/LocalValueEnumerator", "windows/EntryIndex",
        "system/Type", "windows/BaseValueSourceInternal", "windows/FullValueSource", 
        "windows/UncommonField", "windows/PropertyMetadata",
        "windows/DependentList"], 
        function(declare ,DispatcherObject , DependencyProperty, 
		UpdateResult, DependencyObjectType, RequestFlags,
		DeferredReference, Expression, OperationType ,EffectiveValueEntry,
		DependencyPropertyKey, DependencyPropertyChangedEventArgs,
		AlternativeExpressionStorageCallback, LocalValueEntry,
		LocalValueEnumerator, EntryIndex, Type, BaseValueSourceInternal, FullValueSource,
		UncommonField, PropertyMetadata,
		DependentList){
	
//    private  static readonly UncommonField<EventHandler> 
	var InheritanceContextChangedHandlersField = new UncommonField/*<EventHandler>*/();
	
//	 private static AlternativeExpressionStorageCallback 
	var _getExpressionCore = null;
	
	var DependencyObject= declare("DependencyObject", DispatcherObject, {
        constructor:function(){
//        	private UInt32 
        	this._packedData = 0;
            this.CanBeInheritanceContext = true; 
            this.CanModifyEffectiveValues = true;
        },
        
        /// <summary>
        ///     Makes this object Read-Only state of this object; when in a Read-Only state, SetValue is not permitted,
        ///     though the effective value for a property may change. 
        /// </summary>
        Seal:function() 
        {
            // Currently DependencyObject.Seal() is semantically different than Freezable.Freeze().
            // Though freezing implies sealing the reverse isn't true.  The salient difference
            // here is that sealing a DependencyObject does not force all DPs on that object to 
            // also be sealed.  Thus, when we Seal(), we promote all cached values to locally set
            // so that the user can continue to modify them.  Freezable types instead strip off 
            // the promotion handler and freeze the cached default. Note that when / if we make 
            // Seal() == Freeze this code should go away in favor of the behavior used for Freezables.
            PropertyMetadata.PromoteAllCachedDefaultValues(this); 

            // Since Freeze doesn't call Seal the code below will also be duplicated in Freeze().

            // Since this object no longer changes it won't be able to notify dependents 
            DependencyObject.DependentListMapField.ClearValue(this);
 
            this.DO_Sealed = true; 
        },
        
 
        /// <summary>
        ///     Retrieve the value of a property 
        /// </summary> 
        /// <param name="dp">Dependency property</param>
        /// <returns>The computed value</returns> 
        GetValue:function(/*DependencyProperty*/ dp){
            // Do not allow foreign threads access.
            // (This is a noop if this object is not assigned to a Dispatcher.) 
            //
//            this.VerifyAccess(); 
 
            if (dp == null) { 
                throw new Error("ArgumentNullException('dp')");
            }

            // Call Forwarded 
            return this.GetValueEntry(
                    this.LookupEntry(dp.GlobalIndex), 
                    dp, 
                    null,
                    RequestFlags.FullyResolved).Value; 
        },

        /// <summary>
        ///     This overload of GetValue returns UnsetValue if the property doesn't 
        ///     have an entry in the _effectiveValues. This way we will avoid inheriting
        ///     the default value from the parent. 
        /// </summary> 
        GetValueEntry:function( 
            /*EntryIndex*/          entryIndex,
            /*DependencyProperty*/  dp,
            /*PropertyMetadata*/    metadata,
            /*RequestFlags*/        requests) {
            var entry; 
 
            if (dp.ReadOnly) { 
                if (metadata == null) {
                    metadata = dp.GetMetadata(this.DependencyObjectType);
                } 

                var getValueCallback = metadata.GetReadOnlyValueCallback; 
                if (getValueCallback != null) 
                {
                    var valueSource = null; 
                	var valueSourceObj = {"valueSource": valueSource};
                    entry = new EffectiveValueEntry(dp);
//                    entry.Value = getValueCallback(this, out valueSource);
                    
                    entry.Value = getValueCallback.Invoke(this, valueSourceObj);
                    valueSource = valueSourceObj.valueSource;
                    
                    entry.BaseValueSourceInternal = valueSource;
                    return entry; 
                }
            } 
 
            if (entryIndex.Found){ 
                if ((requests & RequestFlags.RawEntry) != 0){
                    entry = this._effectiveValues[entryIndex.Index];
                }else{ 
                    entry = this.GetEffectiveValue( 
                                entryIndex,
                                dp, 
                                requests);
                }
            } else {
                entry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Unknown); 
            } 

            if (entry.Value == DependencyProperty.UnsetValue) {
                if (dp.IsPotentiallyInherited) {
                    if (metadata == null)  {
                        metadata = dp.GetMetadata(this.DependencyObjectType); 
                    } 

                    if (metadata.IsInherited)  {
                        var inheritanceParent = this.InheritanceParent;
                        if (inheritanceParent != null)  { 
                            entryIndex = inheritanceParent.LookupEntry(dp.GlobalIndex);
 
                            if (entryIndex.Found)  {
                                entry = inheritanceParent.GetEffectiveValue( 
                                                entryIndex,
                                                dp,
                                                requests & RequestFlags.DeferredReferences);
                                entry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited; 
                            }
                        } 
                    } 

                    if (entry.Value != DependencyProperty.UnsetValue) {
                        return entry;
                    }
                } 

                if ((requests & RequestFlags.SkipDefault) == 0) { 
                    if (dp.IsPotentiallyUsingDefaultValueFactory) { 
                        if (metadata == null){
                            metadata = dp.GetMetadata(this.DependencyObjectType);
                        } 

                        if (((requests & (RequestFlags.DeferredReferences | RequestFlags.RawEntry)) != 0) && metadata.UsingDefaultValueFactory) { 
                            entry.BaseValueSourceInternal = BaseValueSourceInternal.Default;
 
                            entry.Value = new DeferredMutableDefaultReference(metadata, this, dp);
                            return entry;
                        }
                    } else if (!dp.IsDefaultValueChanged) { 
                        return EffectiveValueEntry.CreateDefaultValueEntry(dp, dp.DefaultMetadata.DefaultValue); 
                    }
 
                    if (metadata == null) {
                        metadata = dp.GetMetadata(this.DependencyObjectType);
                    } 

                    return EffectiveValueEntry.CreateDefaultValueEntry(dp, metadata.GetDefaultValue(this, dp)); 
                } 
            }
            return entry; 
        },

        /// <summary>
        ///     This overload of GetValue assumes that entryIndex is valid. 
        ///      It also does not do the check storage on the InheritanceParent.
        /// </summary> 
        GetEffectiveValue:function( 
            /*EntryIndex*/          entryIndex,
            /*DependencyProperty*/  dp, 
            /*RequestFlags*/        requests) {
            var entry = this._effectiveValues[entryIndex.Index];
            var effectiveEntry = entry.GetFlattenedEntry(requests); 

            if (((requests & (RequestFlags.DeferredReferences | RequestFlags.RawEntry)) != 0) || !effectiveEntry.IsDeferredReference) { 
                return effectiveEntry;
            } 

            if (!entry.HasModifiers) {
                if (!entry.HasExpressionMarker) {
                    // The value for this property was meant to come from a dictionary 
                    // and the creation of that value had been deferred until this
                    // time for better performance. Now is the time to actually instantiate
                    // this value by querying it from the dictionary. Once we have the
                    // value we can actually replace the deferred reference marker 
                    // with the actual value.
                    var reference = entry.Value; 
                    var value = reference.GetValue(entry.BaseValueSourceInternal); 

                    if (!dp.IsValidValue(value)) {
                        throw new Error("InvalidOperationException(SR.Get(SRID.InvalidPropertyValue, value, dp.Name)");
                    }
 
                    // Make sure the entryIndex is in [....] after
                    // the inflation of the deferred reference. 
                    entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex); 

                    entry.Value = value; 

                    this._effectiveValues[entryIndex.Index] = entry;
                    return entry;
                } 
            } else { 
                // The value for this property was meant to come from a dictionary
                // and the creation of that value had been deferred until this 
                // time for better performance. Now is the time to actually instantiate
                // this value by querying it from the dictionary. Once we have the
                // value we can actually replace the deferred reference marker
                // with the actual value. 

                var modifiedValue = entry.ModifiedValue; 
                var reference = null; 
                var referenceFromExpression = false;
 
                if (entry.IsCoercedWithCurrentValue) {
                    if (!entry.IsAnimated) { 
                        reference = modifiedValue.CoercedValue instanceof DeferredReference ? modifiedValue.CoercedValue : null;
                    } 
                } 

                if (reference == null && entry.IsExpression) {
                    if (!entry.IsAnimated && !entry.IsCoerced) {
                        reference = /*(DeferredReference)*/ modifiedValue.ExpressionValue; 
                        referenceFromExpression = true;
                    } 
                } 

                if (reference == null) {
                    return effectiveEntry;
                } 

                var value = reference.GetValue(entry.BaseValueSourceInternal); 
 
                if (!dp.IsValidValue(value)) { 
                    throw new Error("InvalidOperationException(SR.Get(SRID.InvalidPropertyValue, value, dp.Name)");
                }

                // Make sure the entryIndex is in [....] after 
                // the inflation of the deferred reference.
                entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex); 
 
                if (referenceFromExpression) { 
                    entry.SetExpressionValue(value, modifiedValue.BaseValue);
                } else { 
                    entry.SetCoercedValue(value, null, true /* skipBaseValueChecks */, entry.IsCoercedWithCurrentValue);
                } 
 
                this._effectiveValues[entryIndex.Index] = entry;
 
                effectiveEntry.Value = value;
            }
            return effectiveEntry;
        },
        
//        /// <summary> 
//        ///     Sets the local value of a property 
//        /// </summary>
//        public void SetValue(DependencyPropertyKey key, Object value) 
//        {
//            // Do not allow foreign threads access.
//            // (This is a noop if this Object is not assigned to a Dispatcher.)
//            // 
//            this.VerifyAccess();
//
//            DependencyProperty dp; 
//
//            // Cache the metadata Object this method needed to get anyway. 
//            PropertyMetadata metadata = SetupPropertyChange(key, /*out*/ dp);
//
//            // Do standard property set
//            SetValueCommon(dp, value, metadata, false /* coerceWithDeferredReference */, false /* coerceWithCurrentValue */, OperationType.Unknown, false /* isInternal */); 
//        }
//        
//        
//        /// <summary> 
//        ///     Sets the local value of a property 
//        /// </summary>
//        /// <param name="dp">Dependency property</param> 
//        /// <param name="value">New local value</param>
//        public void SetValue(DependencyProperty dp, Object value)
//        {
//            // Do not allow foreign threads access. 
//            // (This is a noop if this Object is not assigned to a Dispatcher.)
//            // 
//            this.VerifyAccess(); 
//
//            // Cache the metadata Object this method needed to get anyway. 
//            PropertyMetadata metadata = SetupPropertyChange(dp);
//
//            // Do standard property set
//            SetValueCommon(dp, value, metadata, false /* coerceWithDeferredReference */, 
//            		false /* coerceWithCurrentValue */, OperationType.Unknown, false /* isInternal */); 
//        }
        
		/// <summary> 
		///     Sets the local value of a property 
		/// </summary>
		/// <param name="dp">Dependency property</param> 
		/// <param name="value">New local value</param>
		SetValue:function(/*DependencyProperty*/ dp, /*object*/ value)
		{
			var metadata = null;
			if(dp instanceof DependencyPropertyKey){
				var dpOut = {
					"dp" : null
				};
				// Cache the metadata Object this method needed to get anyway. 
				metadata = this.SetupPropertyChange(dp, /*out*/ dpOut);
				dp = dpOut.dp;
			}else if(dp instanceof DependencyProperty){
				// Cache the metadata object this method needed to get anyway. 
				metadata = this.SetupPropertyChange(dp);
			}
	
			// Do standard property set
			this.SetValueCommon(dp, value, metadata, false /* coerceWithDeferredReference */, false /* coerceWithCurrentValue */, OperationType.Unknown, false /* isInternal */); 
		},
        
        /// <summary> 
        ///     Sets the value of a property without changing its value source.
        /// </summary> 
        /// <param name="dp">Dependency property</param>
        /// <param name="value">New value</param>
        /// <remarks>
        ///     This method is intended for use by a component that wants to 
        ///     programmatically set the value of one of its own properties, in a
        ///     way that does not disable an application's declared use of that property. 
        ///     SetCurrentValue changes the effective value of the property, but 
        ///     existing triggers, data-binding, styles, etc. will continue to
        ///     work. 
        /// </remarks>
        SetCurrentValue:function(/*DependencyProperty*/ dp, /*object*/ value) {
            // Cache the metadata object this method needed to get anyway.
        	var metadata = this.SetupPropertyChange(dp); 

            // Do standard property set
        	this.SetValueCommon(dp, value, metadata, false /* coerceWithDeferredReference */, true /* coerceWithCurrentValue */, OperationType.Unknown, false /* isInternal */);
        },

//        /// <summary> 
//        ///     Sets the local value of a property 
//        /// The purpose of this internal method is to reuse BooleanBoxes when setting boolean value
//        /// </summary> 
//        /// <param name="dp">Dependency property</param>
//        /// <param name="value">New local value</param>
//        SetValue:function(DependencyProperty dp, bool value) 
//        {
//            SetValue(dp, MS.Internal.KnownBoxes.BooleanBoxes.Box(value)); 
//        } 
//
//        /// <summary> 
//        ///     Sets the current value of a property
//        /// The purpose of this internal method is to reuse BooleanBoxes when setting boolean value
//        /// </summary>
//        /// <param name="dp">Dependency property</param> 
//        /// <param name="value">New local value</param>
//        internal void SetCurrentValue:function(DependencyProperty dp, bool value) 
//        {
//            SetCurrentValue(dp, MS.Internal.KnownBoxes.BooleanBoxes.Box(value)); 
//        }

        /// <summary>
        ///     Internal version of SetValue that bypasses type check in IsValidValue; 
        ///     This is used in property setters
        /// </summary> 
        /// <param name="dp">Dependency property</param> 
        /// <param name="value">New local value</param>
        SetValueInternal:function(/*DependencyProperty*/ dp, /*object*/ value) {
            // Cache the metadata object this method needed to get anyway.
        	var metadata = this.SetupPropertyChange(dp); 

            // Do standard property set
        	this.SetValueCommon(dp, value, metadata, false /* coerceWithDeferredReference */, false /* coerceWithCurrentValue */, OperationType.Unknown, true /* isInternal */);
        },

        /// <summary> 
        ///     Internal version of SetCurrentValue that bypasses type check in IsValidValue; 
        ///     This is used in property setters
        /// </summary> 
        /// <param name="dp">Dependency property</param>
        /// <param name="value">New local value</param>
        SetCurrentValueInternal:function(/*DependencyProperty*/ dp, /*object*/ value) {
            // Cache the metadata object this method needed to get anyway.
        	var metadata = this.SetupPropertyChange(dp);
 
            // Do standard property set
        	this.SetValueCommon(dp, value, metadata, false /* coerceWithDeferredReference */, true /* coerceWithCurrentValue */, OperationType.Unknown, true /* isInternal */); 
        },

        /// <summary> 
        /// Sets the local value of a property.
        /// </summary>
        SetDeferredValue:function(/*DependencyProperty*/ dp, /*DeferredReference*/ deferredReference) {
            // Cache the metadata object this method needed to get anyway. 
        	var metadata = this.SetupPropertyChange(dp); 

            // Do standard property set 
        	this.SetValueCommon(dp, deferredReference, metadata, true /* coerceWithDeferredReference */, false /* coerceWithCurrentValue */, OperationType.Unknown, false /* isInternal */);
        },

        /// <summary> 
        /// Sets the value of a property to a deferred reference, without changing the ValueSource.
        /// </summary> 
        SetCurrentDeferredValue:function(/*DependencyProperty*/ dp, /*DeferredReference*/ deferredReference) { 
            // Cache the metadata object this method needed to get anyway.
            var metadata = this.SetupPropertyChange(dp);

            // Do standard property set 
            this.SetValueCommon(dp, deferredReference, metadata, true /* coerceWithDeferredReference */, true /* coerceWithCurrentValue */, OperationType.Unknown, false /* isInternal */);
        },
 
        /// <summary>
        /// Sets the local value of a property with a mutable default value. 
        /// </summary>
        SetMutableDefaultValue:function(/*DependencyProperty*/ dp, /*object*/ value){ 
            // Cache the metadata object this method needed to get anyway.
            var metadata = this.SetupPropertyChange(dp); 
 
            // Do standard property set
            this.SetValueCommon(dp, value, metadata, false /* coerceWithDeferredReference */, false /* coerceWithCurrentValue */, OperationType.ChangeMutableDefaultValue, false /* isInternal */); 
        },
        
        /// <summary> 
        ///     Called by SetValue or ClearValue to verify that the property
        /// can be changed. 
        /// </summary>
        SetupPropertyChange:function(/*DependencyPropertyKey or DependencyProperty*/ key, /*out DependencyProperty dp*/dpOut)
        {
        	if(arguments.length == 1){
        		dp = key;

	            if ( dp != null ) {
	                if ( !dp.ReadOnly ) { 
	                    // Get type-specific metadata for this property
	                    return dp.GetMetadata(this.DependencyObjectType); 
	                } else {
	                    throw new Error("InvalidOperationException(SR.Get(SRID.ReadOnlyChangeNotAllowed, dp.Name)"); 
	                }
	            } else {
	                throw new Error("ArgumentNullException('dp')"); 
	            }
        	} else if(arguments.length == 2){
                if ( key != null ){
                	dpOut.dp = key.DependencyProperty;
//                    Debug.Assert(dp != null); 

                	dpOut.dp.VerifyReadOnlyKey(key); 
     
                    // Get type-specific metadata for this property
                    return dpOut.dp.GetMetadata(this.DependencyObjectType); 
                } else {
                    throw new Error("ArgumentNullException('key')"); 
                }
        	}
        },

        /// <summary>
        ///     The common code shared by all variants of SetValue 
        /// </summary>
        // Takes metadata from caller because most of them have already retrieved it
        //  for their own purposes, avoiding the duplicate GetMetadata call.
        SetValueCommon:function( 
            /*DependencyProperty*/  dp,
            /*object*/              value, 
            /*PropertyMetadata*/    metadata, 
            /*bool*/                coerceWithDeferredReference,
            /*bool*/                coerceWithCurrentValue, 
            /*OperationType*/       operationType,
            /*bool*/                isInternal) {
            if (this.IsSealed){
                throw new Error("InvalidOperationException(SR.Get(SRID.SetOnReadOnlyObjectNotAllowed, this)"); 
            } 

            var newExpr = null; 
            var newSources = null;

            var entryIndex = this.LookupEntry(dp.GlobalIndex);
 
            // Treat Unset as a Clear
            if( value == DependencyProperty.UnsetValue ) { 
                // Parameters should have already been validated, so we call 
                //  into the private method to avoid validating again.
            	this.ClearValueCommon(entryIndex, dp, metadata);
                return;
            } 

            // Validate the "value" against the DP. 
            var isDeferredReference = false; 
            var newValueHasExpressionMarker = (value == DependencyObject.ExpressionInAlternativeStore);
 
            // First try to validate the value; only after this validation fails should we
            // do the more expensive checks (type checks) for the less common scenarios
            if (!newValueHasExpressionMarker) { 
                var isValidValue = isInternal ? dp.IsValidValueInternal(value) : dp.IsValidValue(value);
 
                // for properties of type "object", we have to always check for expression & deferredreference 
                if (!isValidValue || dp.IsObjectType) { 
                    // 2nd most common is expression
                    newExpr = value instanceof Expression ? value : null;
                    if (newExpr != null) { 
                        // For Expressions, perform additional validation
                        // Make sure Expression is "attachable" 
                        if (!newExpr.Attachable) {
                            throw new Error("ArgumentException(SR.Get(SRID.SharingNonSharableExpression)"); 
                        }

                        // Check dispatchers of all Sources
                        // CALLBACK 
                        newSources = newExpr.GetSources();
//                        DependencyObject.ValidateSources(this, newSources, newExpr); 
                    } else { 
                        // and least common is DeferredReference
                        isDeferredReference = (value instanceof DeferredReference);
                        if (!isDeferredReference)
                        { 
                            if (!isValidValue)
                            { 
                                // it's not a valid value & it's not an expression, so throw 
                                throw new Error("ArgumentException(SR.Get(SRID.InvalidPropertyValue, value, dp.Name)");
                            } 
                        }
                    }
                }
            } 

            // Get old value 
            var oldEntry; 
            if (operationType == OperationType.ChangeMutableDefaultValue) { 
                oldEntry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Default);
                oldEntry.Value = value;
            } else {
                oldEntry = this.GetValueEntry(entryIndex, dp, metadata, RequestFlags.RawEntry); 
            } 

            // if there's an expression in some other store, fetch it now 
            var currentExpr =
                    (oldEntry.HasExpressionMarker)  ? _getExpressionCore.Call(this, dp, metadata)
                  : (oldEntry.IsExpression)         ? (oldEntry.LocalValue instanceof Expression ? oldEntry.LocalValue : null)
                  :                                   null; 

            // Allow expression to store value if new value is 
            // not an Expression, if applicable 

            var handled = false; 
            if ((currentExpr != null) && (newExpr == null))
            {
                // Resolve deferred references because we haven't modified
                // the expression code to work with DeferredReference yet. 
                if (isDeferredReference)
                { 
                    value = value.GetValue(BaseValueSourceInternal.Local); 
                }
 
                // CALLBACK
                handled = currentExpr.SetValue(this, dp, value);
                entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex);
            } 

            // Create the new effective value entry 
            var newEntry; 
            if (handled) { 
                // If expression handled set, then done
                if (entryIndex.Found) {
                    newEntry = this._effectiveValues[entryIndex.Index]; 
                } else  { 
                    // the expression.SetValue resulted in this value being removed from the table;
                    // use the default value. 
                    newEntry = EffectiveValueEntry.CreateDefaultValueEntry(dp, metadata.GetDefaultValue(this, dp));
                }

                coerceWithCurrentValue = false; // expression already handled the control-value 
            } else { 
                // allow a control-value to coerce an expression value, when the
                // expression didn't handle the value 
                if (coerceWithCurrentValue && currentExpr != null) {
                    currentExpr = null;
                } 

                newEntry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Local); 
 
                // detach the old expression, if applicable
                if (currentExpr != null) {
                    // CALLBACK
                    var currentSources = currentExpr.GetSources();
 
                    DependencyObject.UpdateSourceDependentLists(this, dp, currentSources, currentExpr, false);  // Remove
 
                    // CALLBACK 
                    currentExpr.OnDetach(this, dp);
                    currentExpr.MarkDetached(); 
                    entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex);
                }

                // attach the new expression, if applicable 
                if (newExpr == null) { 
                    // simple local value set 
                    newEntry.HasExpressionMarker = newValueHasExpressionMarker;
                    newEntry.Value = value; 
                } else {
                    // First put the expression in the effectivevalueentry table for this object; 
                    // this allows the expression to update the value accordingly in OnAttach 
                	this.SetEffectiveValue(entryIndex, dp, dp.GlobalIndex, metadata, newExpr, BaseValueSourceInternal.Local);
 
                    // Before the expression is attached it has default value
                    var defaultValue = metadata.GetDefaultValue(this, dp);
                    entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex);
                    this.SetExpressionValue(entryIndex, defaultValue, newExpr); 
                    DependencyObject.UpdateSourceDependentLists(this, dp, newSources, newExpr, true);  // Add
 
                    newExpr.MarkAttached(); 

                    // CALLBACK 
                    newExpr.OnAttach(this, dp);

                    // the attach may have added entries in the effective value table ...
                    // so, update the entryIndex accordingly. 
                    entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex);
 
                    newEntry = this.EvaluateExpression( 
                            entryIndex,
                            dp, 
                            newExpr,
                            metadata,
                            oldEntry,
                            this._effectiveValues[entryIndex.Index]); 

                    entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex); 
                } 
            }
            
            var newEntryRef = {"newEntry" : newEntry};
            this.UpdateEffectiveValue(
                entryIndex,
                dp,
                metadata, 
                oldEntry,
//                /*ref*/ newEntry, 
                newEntryRef,
                coerceWithDeferredReference, 
                coerceWithCurrentValue,
                operationType); 
            newEntry = newEntryRef.newEntry;
        },

//        //
//        //  This is a helper routine to set this DO as the inheritance context of another, 
//        //  which has been set as a DP value here.
//        // 
//        ProvideSelfAsInheritanceContext:function( /*object*/ value, /*DependencyProperty*/ dp ){ 
//            var doValue = value instanceof DependencyObject ? value : null;
//            if (doValue != null)
//            {
//                return ProvideSelfAsInheritanceContext(doValue, dp); 
//            }
//            else 
//            { 
//                return false;
//            } 
//        },
//
//        ProvideSelfAsInheritanceContext:function( /*DependencyObject*/ doValue, /*DependencyProperty*/ dp ){
//            // We have to call Freezable.AddInheritanceContext even if the request 
//            // for a new InheritanceContext is not allowed, because Freezable depends 
//            // on side-effects from setting the "Freezable context".  Freezable's
//            // implementation does its own checks of the conditions omitted here. 
//            //
//
//
//            if (doValue != null && 
//                this.ShouldProvideInheritanceContext(doValue, dp) &&
//                (doValue is Freezable || 
//                    (this.CanBeInheritanceContext && 
//                     !doValue.IsInheritanceContextSealed))) 
//            {
//                var oldInheritanceContext = doValue.InheritanceContext;
//                doValue.AddInheritanceContext(this, dp);
// 
//                // return true if the inheritance context actually changed to the new value
//                return (this == doValue.InheritanceContext && this != oldInheritanceContext); 
//            } 
//            else
//            { 
//                return false;
//            }
//        },
        
        //
        //  This is a helper routine to set this DO as the inheritance context of another, 
        //  which has been set as a DP value here.
        // 
        ProvideSelfAsInheritanceContext:function( /*object value, DependencyObject doValue*/ /*DependencyProperty dp*/ value, dp ){ 
            var doValue = value instanceof DependencyObject ? value : null;
            if (doValue == null) {
                return false;
            } 

            // We have to call Freezable.AddInheritanceContext even if the request 
            // for a new InheritanceContext is not allowed, because Freezable depends 
            // on side-effects from setting the "Freezable context".  Freezable's
            // implementation does its own checks of the conditions omitted here. 
            //

            if (doValue != null && 
                this.ShouldProvideInheritanceContext(doValue, dp) &&
                (doValue instanceof Freezable || 
                    (this.CanBeInheritanceContext && 
                     !doValue.IsInheritanceContextSealed))) 
            {
                var oldInheritanceContext = doValue.InheritanceContext;
                doValue.AddInheritanceContext(this, dp);
 
                // return true if the inheritance context actually changed to the new value
                return (this == doValue.InheritanceContext && this != oldInheritanceContext); 
            } 
 
            return false;
        },
 
//        //
//        //  This is a helper routine to remove this DO as the inheritance context of another. 
//        // 
//        RemoveSelfAsInheritanceContext:function( /*object*/ value, /*DependencyProperty*/ dp ){
//            var doValue = value as DependencyObject;
//            if (doValue != null)
//            { 
//                return RemoveSelfAsInheritanceContext(doValue, dp);
//            } 
//            else 
//            {
//                return false; 
//            }
//        },
//
//        RemoveSelfAsInheritanceContext:function( /*DependencyObject*/ doValue, /*DependencyProperty*/ dp ){ 
//            // We have to call Freezable.RemoveInheritanceContext even if the request 
//            // for a new InheritanceContext is not allowed, because Freezable depends
//            // on side-effects from setting the "Freezable context".  Freezable's 
//            // implementation does its own checks of the conditions omitted here.
//            //
// 
//            if (doValue != null &&
//                this.ShouldProvideInheritanceContext(doValue, dp) && 
//                (doValue is Freezable || 
//                    (this.CanBeInheritanceContext &&
//                     !doValue.IsInheritanceContextSealed))){
//                var oldInheritanceContext = doValue.InheritanceContext;
//                doValue.RemoveInheritanceContext(this, dp); 
//
//                // return true if the inheritance context actually changed to the new value 
//                return (this == oldInheritanceContext && doValue.InheritanceContext != oldInheritanceContext); 
//            } else {
//                return false;
//            }
//        } ,
 
        //
        //  This is a helper routine to remove this DO as the inheritance context of another. 
        // 
        RemoveSelfAsInheritanceContext:function( /*object*/ value, /*DependencyProperty*/ dp ){
            var doValue = arguments[0] instanceof DependencyObject ? arguments[0] : null;
            if (doValue != null) {
            	return false; 
            }
  
            // We have to call Freezable.RemoveInheritanceContext even if the request 
            // for a new InheritanceContext is not allowed, because Freezable depends
            // on side-effects from setting the "Freezable context".  Freezable's 
            // implementation does its own checks of the conditions omitted here.
            //
 
            if (doValue != null &&
                this.ShouldProvideInheritanceContext(doValue, dp) && 
                (doValue instanceof Freezable || 
                    (this.CanBeInheritanceContext &&
                     !doValue.IsInheritanceContextSealed))){
                var oldInheritanceContext = doValue.InheritanceContext;
                doValue.RemoveInheritanceContext(this, dp); 

                // return true if the inheritance context actually changed to the new value 
                return (this == oldInheritanceContext && doValue.InheritanceContext != oldInheritanceContext); 
            } 

            return false;
        } ,

        /// <summary> 
        ///     Clears the local value of a property
        /// </summary> 
        /// <param name="dp">Dependency property</param>
        ClearValue:function(/*DependencyProperty dp or DependencyPropertyKey key */){
            // Do not allow foreign threads to clear properties. 
            // (This is a noop if this object is not assigned to a Dispatcher.)
            // 
//            this.VerifyAccess(); 
        	var dp = null, key = null, metadata = null;
        	if(arguments[0] instanceof DependencyProperty){
        		dp = arguments[0];
        		metadata = this.SetupPropertyChange(dp);
        	}else if(arguments[0] instanceof DependencyPropertyKey){
        		key = arguments[0];
                // Cache the metadata object this method needed to get anyway.
        		var dpOut={"dp" : dp};
//                var metadata = SetupPropertyChange(key, out dp); 
        		metadata = this.SetupPropertyChange(key, dpOut); 
        		dp = dpOut.dp;
        	}

            var entryIndex = this.LookupEntry(dp.GlobalIndex);
 
            this.ClearValueCommon(entryIndex, dp, metadata);
        },
 
//        /// <summary> 
//        ///     Clears the local value of a property
//        /// </summary> 
//        /// <param name="dp">Dependency property</param>
//        ClearValue:function(/*DependencyProperty*/ dp){
//            // Do not allow foreign threads to clear properties. 
//            // (This is a noop if this object is not assigned to a Dispatcher.)
//            // 
////            this.VerifyAccess(); 
//
//            // Cache the metadata object this method needed to get anyway. 
//            var metadata = SetupPropertyChange(dp);
//
//            var entryIndex = LookupEntry(dp.GlobalIndex);
// 
//            ClearValueCommon(entryIndex, dp, metadata);
//        },
// 
//        /// <summary>
//        ///     Clears the local value of a property 
//        /// </summary>
//        ClearValue:function(/*DependencyPropertyKey*/ key)
//        {
//            // Do not allow foreign threads to clear properties. 
//            // (This is a noop if this object is not assigned to a Dispatcher.)
//            // 
////            this.VerifyAccess(); 
//
//            var dp; 
//
//            // Cache the metadata object this method needed to get anyway.
//            var metadata = SetupPropertyChange(key, out dp);
// 
//            var entryIndex = LookupEntry(dp.GlobalIndex);
// 
//            ClearValueCommon(entryIndex, dp, metadata); 
//        },
// 
        /// <summary>
        ///     The common code shared by all variants of ClearValue
        /// </summary>
        ClearValueCommon:function(/*EntryIndex*/ entryIndex, /*DependencyProperty*/ dp, /*PropertyMetadata*/ metadata) {
            if (this.IsSealed) { 
                throw new Error("InvalidOperationException(SR.Get(SRID.ClearOnReadOnlyObjectNotAllowed, this)");
            } 

            // Get old value
            var oldEntry = this.GetValueEntry(
                                        entryIndex, 
                                        dp,
                                        metadata, 
                                        RequestFlags.RawEntry); 

            // Get current local value 
            // (No need to go through read local callback, just checking
            // for presence of Expression)
            var current = oldEntry.LocalValue;
 
            // Get current expression
            var currentExpr = (oldEntry.IsExpression) ? (current instanceof Expression ? current : null) : null; 
 
            // Inform value expression of detachment, if applicable
            if (currentExpr != null) {
                // CALLBACK
                var currentSources = currentExpr.GetSources();
 
                DependencyObject.UpdateSourceDependentLists(this, dp, currentSources, currentExpr, false);  // Remove
 
                // CALLBACK 
                currentExpr.OnDetach(this, dp);
                currentExpr.MarkDetached(); 
                entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex);
            }

            // valuesource == Local && value == UnsetValue indicates that we are clearing the local value 
            var newEntry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Local);
 
            var newEntryObj = {"newEntry" : newEntry};
            // Property is now invalid 
            this.UpdateEffectiveValue(
                    entryIndex, 
                    dp,
                    metadata,
                    oldEntry,
//                    /*ref*/ newEntry, 
                    newEntryObj,
                    false /* coerceWithDeferredReference */,
                    false /* coerceWithCurrentValue */, 
                    OperationType.Unknown); 
            newEntry = newEntryObj.newEntry;
        },
 
        /// <summary>
        ///     This method is called by DependencyObjectPropertyDescriptor to determine
        ///     if a value is set for a given DP.
        /// </summary> 
        ContainsValue:function(/*DependencyProperty*/ dp) { 
            var entryIndex = this.LookupEntry(dp.GlobalIndex); 

            if (!entryIndex.Found) {
                return false;
            }
 
            var entry = this._effectiveValues[entryIndex.Index];
            var value = entry.IsCoercedWithCurrentValue ? entry.ModifiedValue.CoercedValue : entry.LocalValue; 
            return !(value === DependencyProperty.UnsetValue); 
        },
 

        /// <summary> 
        ///     Coerce a property value
        /// </summary>
        /// <param name="dp">Dependency property</param>
        CoerceValue:function(/*DependencyProperty*/ dp) {
            // Do not allow foreign threads access. 
            // (This is a noop if this object is not assigned to a Dispatcher.) 
            //
//            this.VerifyAccess(); 

            var entryIndex = this.LookupEntry(dp.GlobalIndex);
            var metadata = dp.GetMetadata(this.DependencyObjectType);
 
            // if the property has a coerced-with-control value, apply the coercion
            // to that value.  This is done by simply calling SetCurrentValue. 
            if (entryIndex.Found) {
                var entry = this.GetValueEntry(entryIndex, dp, metadata, RequestFlags.RawEntry); 
                if (entry.IsCoercedWithCurrentValue) {
                	this.SetCurrentValue(dp, entry.ModifiedValue.CoercedValue);
                    return; 
                }
            } 
 
            // IsCoerced == true && value == UnsetValue indicates that we need to re-coerce this value
            var newEntry = new EffectiveValueEntry(dp, FullValueSource.IsCoerced); 

            var newEntryObj = {"newEntry" : newEntry};
            this.UpdateEffectiveValue(
                    entryIndex,
                    dp, 
                    metadata,
                    new EffectiveValueEntry() /* oldEntry */, 
//                    /*ref*/ newEntry, 
                    newEntryObj,
                    false /* coerceWithDeferredReference */,
                    false /* coerceWithCurrentValue */, 
                    OperationType.Unknown);
            newEntry = newEntryObj.newEntry;
        },

        /// <summary> 
        ///     This is to enable some performance-motivated shortcuts in property
        /// invalidation.  When this is called, it means the caller knows the 
        /// value of the property is pointing to the same object instance as 
        /// before, but the meaning has changed because something within that
        /// object has changed. 
        /// </summary>
        /// <remarks>
        /// Clients who are unaware of this will still behave correctly, if not
        ///  particularly performant, by assuming that we have a new instance. 
        /// Since invalidation operations are synchronous, we can set a bit
        ///  to maintain this knowledge through the invalidation operation. 
        /// This would be problematic in cross-thread operations, but the only 
        ///  time DependencyObject can be used across thread in today's design
        ///  is when it is a Freezable object that has been Frozen.  Frozen 
        ///  means no more changes, which means no more invalidations.
        ///
        /// This is being done as an internal method to enable the performance
        ///  bug #1114409.  This is candidate for a public API but we can't 
        ///  do that kind of work at the moment.
        /// </remarks> 
        InvalidateSubProperty:function(/*DependencyProperty*/ dp) { 
            // when a sub property changes, send a Changed notification with old and new value being the same, and with
            // IsASubPropertyChange set to true
        	this.NotifyPropertyChange(
        			/*new DependencyPropertyChangedEventArgs(dp, dp.GetMetadata(this.DependencyObjectType), GetValue(dp))*/
        			DependencyPropertyChangedEventArgs.BuildPMO(dp, dp.GetMetadata(this.DependencyObjectType), this.GetValue(dp)));
        },

        /// <summary> 
        ///     Notify the current DependencyObject that a "sub-property" 
        /// change has occurred on the given DependencyProperty.
        /// </summary> 
        /// <remarks>
        /// This does the same work as InvalidateSubProperty, and in addition
        /// it raise the Freezable.Changed event if the current DependencyObject
        /// is a Freezable.  This method should be called whenever an 
        /// intermediate object is responsible for propagating the Freezable.Changed
        /// event (i.e. when the Freezable system doesn't propagate the event itself). 
        /// </remarks> 
        NotifySubPropertyChange:function(/*DependencyProperty*/ dp) {
            InvalidateSubProperty(dp);

            // if the target is a Freezable, call FireChanged to kick off 
            // notifications to the Freezable's parent chain.
            /*Freezable*/ freezable = this instanceof Freezable ? this : null; 
            if (freezable != null) 
            {
                freezable.FireChanged(); 
            }
        },

        /// <summary> 
        ///     Invalidates a property
        /// </summary> 
        /// <param name="dp">Dependency property</param> 
        InvalidateProperty:function(/*DependencyProperty*/ dp) {
            InvalidateProperty(dp, /*preserveCurrentValue:*/false);
        },
 
        // Invalidation, optionally preserving the current value if the base
        // value doesn't change. 
        //  The flag is set only by triggers, as a workaround for a missing API. 
        // When we added SetCurrentValue, we should have also added ClearCurrentValue
        // to give controls a way to remove the current value. Lacking that, controls use 
        // InvalidateProperty (VirtualizingStackPanel does this), relying on behavior
        // that should also have been different - an invalidation that doesn't change
        // the base value should preserve the current value.
        //  This matters for triggers (see Dev11 bug 72825).  When any input to a 
        // trigger condition changes, the trigger simply invalidates all the properties
        // mentioned in its setters.  These invalidations often discover no value change - 
        // (example:  Trigger condition is "IsVisible && HasErrors";  if IsVisible is false, 
        // changing input HasErrors won't change the condition value.   The dependent
        // properties are invalidated, but they don't actually change value.) 
        //  To fix the bug, we are putting in the "preserve current value" behavior, but
        // only for invalidations that come from triggers.
        InvalidateProperty:function(/*DependencyProperty*/ dp, /*bool*/ preserveCurrentValue) { 
            // Do not allow foreign threads access.
            // (This is a noop if this object is not assigned to a Dispatcher.) 
            // 
//            this.VerifyAccess();
 
            if (dp == null)
            {
                throw new Error("ArgumentNullException('dp')");;
            } 

            var newEntry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Unknown); 
            newEntry.IsCoercedWithCurrentValue = preserveCurrentValue; 

            var newEntryObj = {"newEntry" : newEntry};
            this.UpdateEffectiveValue( 
                    this.LookupEntry(dp.GlobalIndex),
                    dp,
                    dp.GetMetadata(this.DependencyObjectType),
                    new EffectiveValueEntry() /* oldEntry */, 
//                    /*ref*/ newEntry,
                    newEntryObj,
                    false /* coerceWithDeferredReference */, 
                    false /* coerceWithCurrentValue */, 
                    OperationType.Unknown);
            newEntry = newEntryObj.newEntry;
        },

        //
        //  This method
        //  1. Re-evaluates the effective value for the given property and fires the property changed notification 
        //  2. When this method is invoked with the coersion flag set to false it means that we will simply
        //     coerce and will not try to re-evaluate the base value for the property 
        // 
//        internal UpdateResult
        UpdateEffectiveValue:function( 
                /*EntryIndex*/          entryIndex,
                /*DependencyProperty*/  dp,
                /*PropertyMetadata*/    metadata,
                /*EffectiveValueEntry*/ oldEntry, 
//            /*ref*/ /*EffectiveValueEntry*/ newEntry, 
                newEntryRef,
                /*bool*/                coerceWithDeferredReference, 
                /*bool*/                coerceWithCurrentValue, 
                /*OperationType*/       operationType){ 
        	
            if (dp == null){
                throw new Error("ArgumentNullException('dp')");
            } 

            var targetIndex = dp.GlobalIndex;
 
            if (oldEntry.BaseValueSourceInternal == BaseValueSourceInternal.Unknown)
            { 
                // Do a full get value of the old entry if it isn't supplied. 
                // It isn't supplied in cases where we are *unsetting* a value
                // (e.g. ClearValue, style unapply, trigger unapply) 
                oldEntry = this.GetValueEntry(
                                    entryIndex,
                                    dp,
                                    metadata, 
                                    RequestFlags.RawEntry);
            } 
 
            var oldValue = oldEntry.GetFlattenedEntry(RequestFlags.FullyResolved).Value;
 
            // for control-value coercion, extract the desired control value, then 
            // reset the new entry to ask for a re-evaluation with coercion
            var controlValue = null; 
            if (coerceWithCurrentValue){
                controlValue = newEntryRef.newEntry.Value;
                newEntryRef.newEntry = new EffectiveValueEntry(dp, FullValueSource.IsCoerced); 
            }
 
            // check for early-out opportunities: 
            //  1) the new entry is of lower priority than the current entry
            if ((newEntryRef.newEntry.BaseValueSourceInternal != BaseValueSourceInternal.Unknown) && 
                (newEntryRef.newEntry.BaseValueSourceInternal < oldEntry.BaseValueSourceInternal)){
                return 0;
            } 

            var isReEvaluate = false; 
            var isCoerceValue = false; 
            var isClearValue = false;
 
            if (newEntryRef.newEntry.Value == DependencyProperty.UnsetValue){
                var fullValueSource = newEntryRef.newEntry.FullValueSource;
                isCoerceValue = (fullValueSource == FullValueSource.IsCoerced); 
                isReEvaluate = true;
 
                if (newEntryRef.newEntry.BaseValueSourceInternal == BaseValueSourceInternal.Local) {
                    isClearValue = true; 
                }
            }

            // if we're not in an animation update (caused by AnimationStorage.OnCurrentTimeInvalidated) 
            // then always force a re-evaluation if (a) there was an animation in play or (b) there's
            // an expression evaluation to be made 
            if (isReEvaluate || 
                (!newEntryRef.newEntry.IsAnimated &&
                 (oldEntry.IsAnimated || 
                 (oldEntry.IsExpression && newEntryRef.newEntry.IsExpression && (newEntryRef.newEntry.ModifiedValue.BaseValue == oldEntry.ModifiedValue.BaseValue))))) {
                // we have to compute the new value
                if (!isCoerceValue) {
                	newEntryRef.newEntry = this.EvaluateEffectiveValue(entryIndex, dp, metadata, oldEntry, newEntryRef.newEntry, operationType); 
 
                    // Make sure that the call out did not cause a change to entryIndex
                    entryIndex = this.CheckEntryIndex(entryIndex, targetIndex); 

                    var found = (newEntryRef.newEntry.Value != DependencyProperty.UnsetValue);
                    if (!found && metadata.IsInherited) { 
                        var inheritanceParent = InheritanceParent;
                        if (inheritanceParent != null) { 
                            // Fetch the IsDeferredValue flag from the InheritanceParent
                            var parentEntryIndex = inheritanceParent.LookupEntry(dp.GlobalIndex); 
                            if (parentEntryIndex.Found) {
                                found = true;
                                newEntryRef.newEntry = inheritanceParent._effectiveValues[parentEntryIndex.Index].GetFlattenedEntry(RequestFlags.FullyResolved); 
                                newEntryRef.newEntry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited;
                            } 
                        } 
                    }
 
                    // interesting that I just had to add this ... suggests that we are now overinvalidating
                    if (!found){
                    	newEntryRef.newEntry = EffectiveValueEntry.CreateDefaultValueEntry(dp, metadata.GetDefaultValue(this, dp)); 
                    }
                } else {
                    if (!oldEntry.HasModifiers) 
                    {
                    	newEntryRef.newEntry = oldEntry;
                    }
                    else 
                    {
                    	newEntryRef.newEntry = new EffectiveValueEntry(dp, oldEntry.BaseValueSourceInternal); 
                        var modifiedValue = oldEntry.ModifiedValue; 
                        var baseValue = modifiedValue.BaseValue;
                        newEntryRef.newEntry.Value = baseValue; 
                        newEntryRef.newEntry.HasExpressionMarker = oldEntry.HasExpressionMarker;

                        if (oldEntry.IsExpression) { 
                        	newEntryRef.newEntry.SetExpressionValue(modifiedValue.ExpressionValue, baseValue);
                        } 
 
                        if (oldEntry.IsAnimated) { 
                        	newEntryRef.newEntry.SetAnimatedValue(modifiedValue.AnimatedValue, baseValue);
                        }
                    }
                } 
            }
 
            // Coerce to current value 
            if (coerceWithCurrentValue){ 
                var baseValue = newEntryRef.newEntry.GetFlattenedEntry(RequestFlags.CoercionBaseValue).Value;
                
                var parOut={
                /*ref*/ entryIndex : entryIndex, 
                /*ref*/ targetIndex : targetIndex, 
                /*ref*/ newEntry : newEntryRef.newEntry,
                /*ref*/ oldEntry : oldEntry, 
                /*ref*/ oldValue : oldValue
                };

                this.ProcessCoerceValue(
                    dp, 
                    metadata,
//                    ref entryIndex, 
//                    ref targetIndex, 
//                    ref newEntry,
//                    ref oldEntry, 
//                    ref oldValue,
                    parOut,
                    
                    baseValue,
                    controlValue,
                    null /*coerceValueCallback */, 
                    coerceWithDeferredReference,
                    coerceWithCurrentValue, 
                    false /*skipBaseValueChecks*/); 
                
                entryIndex = parOut.entryIndex;
                targetIndex = parOut.targetIndex; 
                newEntryRef.newEntry = parOut.newEntry;
                oldEntry = parOut.oldEntry;
                oldValue = parOut.oldValue;

                // Make sure that the call out did not cause a change to entryIndex 
                entryIndex = this.CheckEntryIndex(entryIndex, targetIndex);
            }

            // Coerce Value 
            if (metadata.CoerceValueCallback != null &&
                !(isClearValue && newEntryRef.newEntry.FullValueSource == /*(FullValueSource)*/BaseValueSourceInternal.Default)) 
            { 
                // CALLBACK
                var baseValue = newEntryRef.newEntry.GetFlattenedEntry(RequestFlags.CoercionBaseValue).Value; 
                
                var parOut={
                        /*ref*/ entryIndex : entryIndex, 
                        /*ref*/ targetIndex : targetIndex, 
                        /*ref*/ newEntry : newEntryRef.newEntry,
                        /*ref*/ oldEntry : oldEntry, 
                        /*ref*/ oldValue : oldValue
                        };

                this.ProcessCoerceValue(
                    dp,
                    metadata, 
//                    ref entryIndex,
//                    ref targetIndex, 
//                    ref newEntry, 
//                    ref oldEntry,
//                    ref oldValue, 
                    parOut,
                    
                    baseValue,
                    null /* controlValue */,
                    metadata.CoerceValueCallback,
                    coerceWithDeferredReference, 
                    false /* coerceWithCurrentValue */,
                    false /*skipBaseValueChecks*/); 
                
                entryIndex = parOut.entryIndex;
                targetIndex = parOut.targetIndex; 
                newEntryRef.newEntry = parOut.newEntry;
                oldEntry = parOut.oldEntry;
                oldValue = parOut.oldValue;
 
                // Make sure that the call out did not cause a change to entryIndex
                entryIndex = this.CheckEntryIndex(entryIndex, targetIndex); 
            }

            // The main difference between this callback and the metadata.CoerceValueCallback is that
            // designers want to be able to coerce during all value changes including a change to the 
            // default value. Whereas metadata.CoerceValueCallback coerces all property values but the
            // default, because default values are meant to fit automatically fit into the coersion constraint. 
 
            if (dp.DesignerCoerceValueCallback != null)
            { 
                // During a DesignerCoerceValueCallback the value obtained is stored in the same
                // member as the metadata.CoerceValueCallback. In this case we do not store the
                // baseValue in the entry. Thus the baseValue checks will the violated. That is the
                // reason for skipping these checks in this one case. 

                // Also before invoking the DesignerCoerceValueCallback the baseValue must 
                // always be expanded if it is a DeferredReference 

                var parOut={
                        /*ref*/ entryIndex : entryIndex, 
                        /*ref*/ targetIndex : targetIndex, 
                        /*ref*/ newEntry : newEntryRef.newEntry,
                        /*ref*/ oldEntry : oldEntry, 
                        /*ref*/ oldValue : oldValue
                        };
                this.ProcessCoerceValue( 
                    dp,
                    metadata,
//                    ref entryIndex,
//                    ref targetIndex, 
//                    ref newEntry,
//                    ref oldEntry, 
//                    ref oldValue, 
                    newEntry.GetFlattenedEntry(RequestFlags.FullyResolved).Value,
                    null /*controlValue*/, 
                    dp.DesignerCoerceValueCallback,
                    false /*coerceWithDeferredReference*/,
                    false /*coerceWithCurrentValue*/,
                    true /*skipBaseValueChecks*/); 
                
                entryIndex = parOut.entryIndex;
                targetIndex = parOut.targetIndex; 
                newEntryRef.newEntry = parOut.newEntry;
                oldEntry = parOut.oldEntry;
                oldValue = parOut.oldValue;

                // Make sure that the call out did not cause a change to entryIndex 
                entryIndex = this.CheckEntryIndex(entryIndex, targetIndex); 
            }
 
            var result = 0;

            if (newEntryRef.newEntry.FullValueSource != /*(FullValueSource)*/ BaseValueSourceInternal.Default) { 
//                Debug.Assert(newEntry.BaseValueSourceInternal != BaseValueSourceInternal.Unknown, "Value source should be known at this point");
                var unsetValue = false; 
 
                if (newEntryRef.newEntry.BaseValueSourceInternal == BaseValueSourceInternal.Inherited) { 
                    if (DependencyObject.IsTreeWalkOperation(operationType) &&
                        (newEntryRef.newEntry.IsCoerced || newEntryRef.newEntry.IsAnimated)) {
                        // an inherited value has been coerced or animated.  This 
                        // should be treated as a new "set" of the property.
                        // The current tree walk should not continue into the subtree, 
                        // but rather a new tree walk should start. 

                        // this signals OnPropertyChanged to start a new tree walk 
                        // and mark the current node as SelfInheritanceParent
                        operationType = OperationType.Unknown;

                        // this signals the caller not to continue the current 
                        // tree walk into the subtree
                        result |= UpdateResult.InheritedValueOverridden; 
                    } else if (!this.IsSelfInheritanceParent) { 
                        // otherwise, just inherit the value from the InheritanceParent
                        unsetValue = true;
                    }
                } 

                if (unsetValue) { 
                    this.UnsetEffectiveValue(entryIndex, dp, metadata);
                } else {
                	this.SetEffectiveValue(entryIndex, dp, metadata, newEntryRef.newEntry, oldEntry);
                } 
            } else { 
            	this.UnsetEffectiveValue(entryIndex, dp, metadata);
            } 

            // Change notifications are fired when the value actually changed or in
            // the case of the Freezable mutable factories when the value source changes.
            // Try AvaCop without the second condition to repro this problem. 
            var isAValueChange = !this.Equals(dp, oldValue, newEntryRef.newEntry.GetFlattenedEntry(RequestFlags.FullyResolved).Value);
 
            if (isAValueChange) {
                result |= UpdateResult.ValueChanged; 
            }

            if (isAValueChange ||
                (operationType == OperationType.ChangeMutableDefaultValue && oldEntry.BaseValueSourceInternal != newEntryRef.newEntry.BaseValueSourceInternal) || 
                (metadata.IsInherited && oldEntry.BaseValueSourceInternal != newEntryRef.newEntry.BaseValueSourceInternal 
                		&& operationType != OperationType.AddChild && operationType != OperationType.RemoveChild && operationType != OperationType.Inherit)) { 
                result |= UpdateResult.NotificationSent; 

                try{
                // fire change notification
            	this.NotifyPropertyChange(
                        DependencyPropertyChangedEventArgs.Build6( 
                                dp,
                                metadata, 
                                isAValueChange, 
                                oldEntry,
                                newEntryRef.newEntry, 
                                operationType));
                }catch(e){
                	console.log(e);
                }
            } 
 
            // There are two cases in which we need to adjust inheritance contexts:
            // 
            //     1.  The value pointed to this DP has changed, in which case
            //         we need to move the context from the old value to the
            //         new value.
            // 
            //     2.  The value has not changed, but the ValueSource for the
            //         property has.  (For example, we've gone from being a local 
            //         value to the result of a binding expression that just 
            //         happens to return the same DO instance.)  In which case
            //         we may need to add or remove contexts even though we 
            //         did not raise change notifications.
            //
            // We don't want to provide an inheritance context if the entry is
            // animated, coerced, is an expression, is coming from a style or 
            // template, etc.  To avoid this, we explicitly check that the
            // FullValueSource is Local.  By checking FullValueSource rather than 
            // BaseValueSource we are implicitly filtering out any sources which 
            // have modifiers.  (e.g., IsExpression, IsAnimated, etc.)
 
            var oldEntryHadContext = oldEntry.FullValueSource == /*(FullValueSource)*/ BaseValueSourceInternal.Local;
            var newEntryNeedsContext = newEntryRef.newEntry.FullValueSource == /*(FullValueSource)*/ BaseValueSourceInternal.Local;

            // NOTE:  We use result rather than isAValueChange below so that we 
            //        pick up mutable default promotion, etc.
            if (result != 0 || (oldEntryHadContext != newEntryNeedsContext)) 
            { 
                if (oldEntryHadContext)
                { 
                    // RemoveSelfAsInheritanceContext no-ops null, non-DO values, etc.
                    this.RemoveSelfAsInheritanceContext(oldEntry.LocalValue, dp);
                }
 
                // Become the context for the new value. This is happens after
                // invalidation so that FE has a chance to hookup the logical 
                // tree first. This is done only if the current DependencyObject 
                // wants to be in the InheritanceContext tree.
                if (newEntryNeedsContext) 
                {
                    // ProvideSelfAsInheritanceContext no-ops null, non-DO values, etc.
                    this.ProvideSelfAsInheritanceContext(newEntryRef.newEntry.LocalValue, dp);
                } 

                // DANGER:  Callout might add/remove entries in the effective value table. 
                //          Uncomment the following if you need to use entryIndex post 
                //          context hookup.
                // 
                // entryIndex = CheckEntryIndex(entryIndex, dp.GlobalIndex);
            }

            return result; 
        },
 
        /*private void */ProcessCoerceValue:function( 
            /*DependencyProperty*/ dp,
            /*PropertyMetadata*/ metadata, 
//            ref EntryIndex entryIndex,
//            ref int targetIndex,
//            ref EffectiveValueEntry newEntry,
//            ref EffectiveValueEntry oldEntry, 
//            ref object oldValue,
            parOut,
            /*object*/ baseValue, 
            /*object*/ controlValue, 
            /*CoerceValueCallback*/ coerceValueCallback,
            /*bool*/ coerceWithDeferredReference, 
            /*bool*/ coerceWithCurrentValue,
            /*bool*/ skipBaseValueChecks)
        {
            if (parOut.newEntry.IsDeferredReference) {
//                Debug.Assert(!(newEntry.IsCoerced && !newEntry.IsCoercedWithCurrentValue) && 
//                    !newEntry.IsAnimated, "Coerced or Animated value cannot be a deferred reference"); 

                // Allow values to stay deferred through coercion callbacks in 
                // limited circumstances, when we know the listener is internal.
                // Since we never assign DeferredReference instances to
                // non-internal (non-friend assembly) classes, it's safe to skip
                // the dereference if the callback is to the DP owner (and not 
                // a derived type).  This is consistent with passing raw
                // DeferredReference instances to ValidateValue callbacks, which 
                // only ever go to the owner class. 
                if (!coerceWithDeferredReference ||
                    dp.OwnerType != metadata.CoerceValueCallback.Method.DeclaringType) // Need 2nd check to rule out derived class callback overrides. 
                {
                    // Resolve deferred references because we need the actual
                    // baseValue to evaluate the correct animated value. This is done
                    // by invoking GetValue for this property. 
                    var dr = /*(DeferredReference)*/ baseValue;
                    baseValue = dr.GetValue(parOut.newEntry.BaseValueSourceInternal); 
 
                    // Set the baseValue back into the entry
                    parOut.newEntry.SetCoersionBaseValue(baseValue); 

                    parOut.entryIndex = this.CheckEntryIndex(parOut.entryIndex, parOut.targetIndex);
                }
            } 

            var coercedValue = coerceWithCurrentValue ? controlValue : coerceValueCallback.Call(this, baseValue); 
 
            // Make sure that the call out did not cause a change to entryIndex
            parOut.entryIndex = this.CheckEntryIndex(parOut.entryIndex, parOut.targetIndex); 

            // Even if we used the controlValue in the coerce callback, we still want to compare against the original baseValue
            // to determine if we need to set a coerced value.
            if (!this.Equals(dp, coercedValue, baseValue)) {
                // returning DependencyProperty.UnsetValue from a Coercion callback means "don't do the set" ... 
                // or "use previous value" 
                if (coercedValue == DependencyProperty.UnsetValue) { 
                    if (parOut.oldEntry.IsDeferredReference) {
                        var reference = /*(DeferredReference)*/parOut.oldValue;
                        parOut.oldValue = reference.GetValue(parOut.oldEntry.BaseValueSourceInternal); 

                        parOut.entryIndex = this.CheckEntryIndex(parOut.entryIndex, parOut.targetIndex); 
                    } 

                    coercedValue = parOut.oldValue; 
                }

                // Note that we do not support the value being coerced to a
                // DeferredReference 
                if (!dp.IsValidValue(coercedValue)) { 
                    // well... unless it's the control's "current value" 
                    if (!(coerceWithCurrentValue && coercedValue instanceof DeferredReference))
                        throw new Error("ArgumentException(SR.Get(SRID.InvalidPropertyValue, coercedValue, dp.Name)"); 
                }

                // Set the coerced value here. All other values would
                // have been set during EvaluateEffectiveValue/GetValueCore. 

                parOut.newEntry.SetCoercedValue(coercedValue, baseValue, skipBaseValueChecks, coerceWithCurrentValue); 
            } 
        },
 
        /// <summary>
        /// This is a helper method that is used to fire the property change notification through
        /// the callbacks and to all the dependents of this property such as bindings etc.
        /// </summary> 
        NotifyPropertyChange:function(/*DependencyPropertyChangedEventArgs*/ args) { 
            // fire change notification
            this.OnPropertyChanged(args); 

            if (args.IsAValueChange || args.IsASubPropertyChange) {
                // Invalidate all Dependents of this Source invalidation due 
                // to Expression dependencies
 
                var dp = args.Property; 
                var objectDependentsListMap = DependencyObject.DependentListMapField.GetValue(this);
                if (objectDependentsListMap != null) {
                    /*FrugalMap*/var dependentListMap = /*(FrugalMap)*/objectDependentsListMap;
                    var dependentList = dependentListMap.Get(dp.GlobalIndex);
//                    Debug.Assert(dependentList != null, "dependentList should either be unset or non-null"); 

                    if (dependentList != DependencyProperty.UnsetValue) { 
                        // The list can "go empty" if the items it references "went away"
                        if (/*(DependentList)*/dependentList.IsEmpty) 
                            dependentListMap.Set(dp.GlobalIndex, DependencyProperty.UnsetValue);
                        else
                            /*((DependentList)*/dependentList.InvalidateDependents(this, args);
                    } 

                    // also notify "direct" dependents 
                    dp = DependencyObject.DirectDependencyProperty; 
                    dependentList = dependentListMap.Get(dp.GlobalIndex);
//                    Debug.Assert(dependentList != null, "dependentList should either be unset or non-null"); 

                    if (dependentList != DependencyProperty.UnsetValue) {
                        // The list can "go empty" if the items it references "went away" 
                        if (/*(DependentList)*/dependentList.IsEmpty)
                            dependentListMap.Set(dp.GlobalIndex, DependencyProperty.UnsetValue); 
                        else 
                            /*(DependentList)*/dependentList.InvalidateDependents(this, 
                            		/*new DependencyPropertyChangedEventArgs(dp, (PropertyMetadata)null, null)*/
                            		DependencyPropertyChangedEventArgs.BuildPMO(dp, null, null));
                    } 
                }
            }
        },
 

        /*private EffectiveValueEntry */EvaluateExpression:function( 
            /*EntryIndex*/ entryIndex, 
            /*DependencyProperty*/ dp,
            /*Expression*/ expr, 
            /*PropertyMetadata*/ metadata,
            /*EffectiveValueEntry*/ oldEntry,
            /*EffectiveValueEntry*/ newEntry) { 
            var value = expr.GetValue(this, dp);
            var isDeferredReference = false; 
 
            if (value != DependencyProperty.UnsetValue && value != Expression.NoValue) { 
                isDeferredReference = (value instanceof DeferredReference);
                if (!isDeferredReference && !dp.IsValidValue(value)) {
                    throw new Error("InvalidOperationException(SR.Get(SRID.InvalidPropertyValue, value, dp.Name)");
                } 
            }  else {
                if (value == Expression.NoValue) {
                    // The expression wants to "hide".  First set the 
                    // expression value to NoValue to indicate "hiding". 
                    newEntry.SetExpressionValue(Expression.NoValue, expr);
 
                    // Next, get the expression value some other way.
                    if (!dp.ReadOnly) {
                    	var newEntryRef = {
                    		"entry" : newEntry
                    	};
                        this.EvaluateBaseValueCore(dp, metadata, /*ref newEntry*/newEntryRef); 
                        newEntry = newEntryRef.entry;
                        
                        value = newEntry.GetFlattenedEntry(RequestFlags.FullyResolved).Value;
                    } else {
                        value = DependencyProperty.UnsetValue; 
                    }
                }

                // if there is still no value, use the default 
                if (value == DependencyProperty.UnsetValue){ 
                    value = metadata.GetDefaultValue(this, dp); 
                }
            } 

            // Set the expr and its evaluated value into
            // the _effectiveValues cache
            newEntry.SetExpressionValue(value, expr); 
            return newEntry;
        },
 
        //[CodeAnalysis("AptcaMethodsShouldOnlyCallAptcaMethods")] //Tracking Bug: 29647
        EvaluateEffectiveValue:function( 
            /*EntryIndex*/ entryIndex,
            /*DependencyProperty*/ dp,
            /*PropertyMetadata*/ metadata,
            /*EffectiveValueEntry*/ oldEntry, 
            /*EffectiveValueEntry*/ newEntry, // this is only used to recognize if this is a clear local value
            /*OperationType*/ operationType){ 

            var value = DependencyProperty.UnsetValue; 

            try  { 
                // Read local storage
                var isSetValue = (newEntry.BaseValueSourceInternal == BaseValueSourceInternal.Local); 
                var isClearLocalValue = isSetValue && (newEntry.Value == DependencyProperty.UnsetValue);
                var oldLocalIsExpression = false;
                var preserveCurrentValue;
 
                // honor request for "preserve current value" behaviour - see InvalidateProperty.
                if (newEntry.BaseValueSourceInternal == BaseValueSourceInternal.Unknown && 
                    newEntry.IsCoercedWithCurrentValue) {
                    preserveCurrentValue = true; 
                    newEntry.IsCoercedWithCurrentValue = false;     // clear flag only used for private communication
                } else { 
                    preserveCurrentValue = false;
                } 
 
                if (isClearLocalValue) { 
                    newEntry.BaseValueSourceInternal = BaseValueSourceInternal.Unknown;
                } else { 
                    // if we reached this on a re-evaluate of a setvalue, we need to make sure
                    // we don't lose track of the newly specified local value. 
                    // for all other cases, the oldEntry will have the local value we should 
                    // use.
                    value = isSetValue ? newEntry.LocalValue : oldEntry.LocalValue; 

                    if (value == DependencyObject.ExpressionInAlternativeStore) {
                        value = DependencyProperty.UnsetValue; 
                    } else { 
                        oldLocalIsExpression = isSetValue ? newEntry.IsExpression : oldEntry.IsExpression;
                    } 
                }

                // (If local storage not Unset and not an Expression, return)
                if (value != DependencyProperty.UnsetValue) {
                    newEntry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Local); 
                    newEntry.Value = value; 

                    // Check if an Expression is set 
                    if (oldLocalIsExpression) {
                        // CALLBACK
                        newEntry = this.EvaluateExpression( 
                            entryIndex,
                            dp, 
                            /*(Expression)*/ value, 
                            metadata,
                            oldEntry, 
                            newEntry);

                        entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex);
 
                        value = newEntry.ModifiedValue.ExpressionValue;
                    } 
                } 

                // Subclasses are not allowed to resolve/modify the value for read-only properties. 
                if( !dp.ReadOnly ) {
                    // Give subclasses a chance to resolve/modify the value
                	var newEntryRef = {
                		"entry" : newEntry
                	};
                    this.EvaluateBaseValueCore(dp, metadata, /*ref newEntry*/newEntryRef); 
                    newEntry = newEntryRef.entry;

                    // we need to have the default value in the entry before we do the animation check 
                    if (newEntry.BaseValueSourceInternal == BaseValueSourceInternal.Unknown) {
                        newEntry = EffectiveValueEntry.CreateDefaultValueEntry(dp, metadata.GetDefaultValue(this, dp)); 
                    }

                    value = newEntry.GetFlattenedEntry(RequestFlags.FullyResolved).Value;
 
                    // preserve a current value across invalidations that don't change
                    // the base value 
                    if (preserveCurrentValue && 
                        oldEntry.IsCoercedWithCurrentValue &&
                        oldEntry.BaseValueSourceInternal == newEntry.BaseValueSourceInternal && 
                        this.Equals(dp, oldEntry.ModifiedValue.BaseValue, value)) {
                        var currentValue = oldEntry.ModifiedValue.CoercedValue;
                        newEntry.SetCoercedValue(currentValue, value, /*skipBaseValueChecks:*/true, /*coerceWithCurrentValue:*/true); 
                        value = currentValue;
                    } 
 
                    entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex);
 
                    if (oldEntry.IsAnimated){
                        newEntry.ResetCoercedValue();
                        this.EvaluateAnimatedValueCore(dp, metadata, /*ref*/ newEntry); 
                        value = newEntry.GetFlattenedEntry(RequestFlags.FullyResolved).Value;
                    } 
                } 
            }
            finally 
            {
            }
 
            if (value == DependencyProperty.UnsetValue) { 
                newEntry = EffectiveValueEntry.CreateDefaultValueEntry(dp, metadata.GetDefaultValue(this, dp));
            } 

            return newEntry;
        },
 
        /// <summary>
        ///     Allows subclasses to participate in property base value computation 
        /// </summary> 
        EvaluateBaseValueCore:function(
                /*DependencyProperty*/  dp, 
                /*PropertyMetadata*/    metadata,
            /*ref EffectiveValueEntry*/ newEntryRef){},

        /// <summary> 
        ///     Allows subclasses to participate in property animated value computation 
        /// </summary>
        EvaluateAnimatedValueCore:function( 
                /*DependencyProperty*/  dp,
                /*PropertyMetadata*/    metadata,
            /*ref EffectiveValueEntry*/ newEntry){ 
        	;
        },
 
        /// <summary> 
        ///     Notification that a specified property has been changed
        /// </summary> 
        /// <param name="e">EventArgs that contains the property, metadata, old value, and new value for this change</param>
        OnPropertyChanged:function(/*DependencyPropertyChangedEventArgs*/ e) {
            // Do not call VerifyAccess because this is a virtual, and is used as a call-out. 

            if( e.Property == null ){ 
                throw new Error("ArgumentException(SR.Get(SRID.ReferenceIsNull, 'e.Property'), 'e')");
            } 

            if (e.IsAValueChange || e.IsASubPropertyChange || e.OperationType == OperationType.ChangeMutableDefaultValue) {
                // Inform per-type/property invalidation listener, if exists 
                var metadata = e.Metadata;
                if ((metadata != null) && (metadata.PropertyChangedCallback != null)) { 
                    metadata.PropertyChangedCallback.Invoke(this, e);
                } 
            }
        },

//        GetValueSource:function(/*DependencyProperty*/ dp, /*PropertyMetadata*/ metadata, out bool hasModifiers) { 
//            var isExpression, isAnimated, isCoerced, isCurrent; 
//            return GetValueSource(dp, metadata, out hasModifiers, out isExpression, out isAnimated, out isCoerced, out isCurrent);
//        }, 
        GetValueSource:function(/*DependencyProperty*/ dp, /*PropertyMetadata*/ metadata, /*out bool hasModifiers*/ parOut) { 
//
//        GetValueSource:function(/*DependencyProperty*/ dp, /*PropertyMetadata*/ metadata,
//                out bool hasModifiers, out bool isExpression, out bool isAnimated, out bool isCoerced, out bool isCurrent) {
            if (dp == null) { 
                throw new Error("ArgumentNullException('dp')");
            } 

            var entryIndex = this.LookupEntry(dp.GlobalIndex);

            if (entryIndex.Found) {
                var entry = this._effectiveValues[entryIndex.Index]; 
                parOut.hasModifiers = entry.HasModifiers; 
                parOut.isExpression = entry.IsExpression;
                parOut.isAnimated = entry.IsAnimated; 
                parOut.isCoerced = entry.IsCoerced;
                parOut.isCurrent = entry.IsCoercedWithCurrentValue;
                return entry.BaseValueSourceInternal;
            }  else  { 
            	parOut.isExpression = false; 
            	parOut.isAnimated = false;
            	parOut.isCoerced = false; 
            	parOut.isCurrent = false;

                if (dp.ReadOnly) { 
                    if (metadata == null) { 
                        metadata = dp.GetMetadata(this.DependencyObjectType); 
                    }
 
                    var callback = metadata.GetReadOnlyValueCallback;
                    if (callback != null) {
                        var source;
                    	var parSource = {"source" : source};
//                        callback(this, out source);
                        callback(this, parSource);
                        source = parSource.source;
                        parOut.hasModifiers = false; 
                        return source; 
                    }
                } 

                if (dp.IsPotentiallyInherited)  {
                    if (metadata == null) {
                        metadata = dp.GetMetadata(this.DependencyObjectType); 
                    } 

                    if (metadata.IsInherited) {
                        var inheritanceParent = this.InheritanceParent;
                        if (inheritanceParent != null && inheritanceParent.LookupEntry(dp.GlobalIndex).Found) { 
                        	parOut.hasModifiers = false;
                            return BaseValueSourceInternal.Inherited; 
                        } 
                    }
                } 
            }

            parOut.hasModifiers = false;
            return BaseValueSourceInternal.Default; 
        },
 
        /// <summary> 
        ///     Retrieve the local value of a property (if set)
        /// </summary> 
        /// <param name="dp">Dependency property</param>
        /// <returns>
        ///     The local value. DependencyProperty.UnsetValue if no local value was
        ///     set via <cref see="SetValue"/>. 
        /// </returns>
        ReadLocalValue:function(/*DependencyProperty*/ dp) { 
            if (dp == null) {
                throw new Error("ArgumentNullException('dp')"); 
            } 

            var entryIndex = this.LookupEntry(dp.GlobalIndex); 

            // Call Forwarded
            return this.ReadLocalValueEntry(entryIndex, dp, false /* allowDeferredReferences */);
        },

        /// <summary> 
        ///     Retrieve the local value of a property (if set) 
        /// </summary>
        /// <returns> 
        ///     The local value. DependencyProperty.UnsetValue if no local value was
        ///     set via <cref see="SetValue"/>.
        /// </returns>
        ReadLocalValueEntry:function(/*EntryIndex*/ entryIndex, /*DependencyProperty*/ dp, /*bool*/ allowDeferredReferences) {
            if (!entryIndex.Found) 
            { 
                return DependencyProperty.UnsetValue;
            } 

            var entry = this._effectiveValues[entryIndex.Index];
            var value = entry.IsCoercedWithCurrentValue ? entry.ModifiedValue.CoercedValue : entry.LocalValue;
 
            // convert a deferred reference into a real value
            if (!allowDeferredReferences && entry.IsDeferredReference) { 
                // localValue may still not be a DeferredReference, e.g.
                // if it is an expression whose value is a DeferredReference. 
                // So a little more work is needed before converting the value.
                var dr = value instanceof DeferredReference ? value : null;
                if (dr != null) { 
                    value = dr.GetValue(entry.BaseValueSourceInternal);
                } 
            } 

            // treat Expression marker as "unset" 
            if (value == DependencyObject.ExpressionInAlternativeStore) {
                value = DependencyProperty.UnsetValue;
            } 

            return value; 
        },

        /// <summary> 
        ///     Create a local value enumerator for this instance
        /// </summary>
        /// <returns>Local value enumerator (stack based)</returns>
        GetLocalValueEnumerator:function()  {
            var effectiveValuesCount = this.EffectiveValuesCount;
            /*LocalValueEntry[]*/var snapshot = []; //new Array[effectiveValuesCount];
            var count = 0; 

            // Iterate through the sorted effectiveValues 
            for (var i=0; i<effectiveValuesCount; i++){
                var dp = DependencyProperty.RegisteredPropertyList.List[this._effectiveValues[i].PropertyIndex]; 
                if (dp != null){
                    var localValue = this.ReadLocalValueEntry(new EntryIndex(i), dp, false /* allowDeferredReferences */);
                    if (localValue != DependencyProperty.UnsetValue){
                        snapshot[count++] = new LocalValueEntry(dp, localValue); 
                    } 
                }
            } 

            return new LocalValueEnumerator(snapshot, count);
        },
        

        /// <summary>
        /// Used to determine whether a DependencyObject has a value with an expression, such as a resource reference.
        /// </summary>
        /// <returns> 
        /// True if Dependency object has a value with an expression
        /// </returns> 
        HasAnyExpression:function() {
            var effectiveValues = this.EffectiveValues; 
            var numEffectiveValues = this.EffectiveValuesCount;
            var result = false;

            for (var i = 0; i < numEffectiveValues; i++) {
                var dp = DependencyProperty.RegisteredPropertyList.List[effectiveValues[i].PropertyIndex]; 

                if (dp != null) 
                {
                    var entryIndex = new EntryIndex(i);
                    // The expression check only needs to be done when isChecking is true
                    // because if we return false here the Freeze() call will fail. 
                    if (this.HasExpression(entryIndex, dp))
                    { 
                        result = true; 
                        break;
                    } 
                }
            }

            return result; 
        },
 
        /// <summary> 
        /// Return true iff the property has an expression applied to it.
        /// </summary> 
        HasExpression:function(/*EntryIndex*/ entryIndex, /*DependencyProperty*/ dp) {
            if (!entryIndex.Found) {
                return false; 
            } 

            var entry = this._effectiveValues[entryIndex.Index]; 

            var o = entry.LocalValue;

            var result = (entry.HasExpressionMarker || o instanceof Expression); 
            return result;
        },
        
 
//        SetEffectiveValue:function(/*EntryIndex*/ entryIndex, /*DependencyProperty*/ dp, /*PropertyMetadata*/ metadata, 
//        		/*EffectiveValueEntry*/ newEntry, /*EffectiveValueEntry*/ oldEntry) {
//            if (metadata != null &&
//                metadata.IsInherited && 
//                (newEntry.BaseValueSourceInternal != BaseValueSourceInternal.Inherited ||
//                    newEntry.IsCoerced || newEntry.IsAnimated) && 
//                !this.IsSelfInheritanceParent) {
//            	this.SetIsSelfInheritanceParent(); 
//                entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex);
//            }
//
//            var restoreMarker = false; 
//
//            if (oldEntry.HasExpressionMarker && !newEntry.HasExpressionMarker) { 
//                var valueSource = newEntry.BaseValueSourceInternal;
//                restoreMarker = (valueSource == BaseValueSourceInternal.ThemeStyle || 
//                                 valueSource == BaseValueSourceInternal.ThemeStyleTrigger ||
//                                 valueSource == BaseValueSourceInternal.Style ||
//                                 valueSource == BaseValueSourceInternal.TemplateTrigger ||
//                                 valueSource == BaseValueSourceInternal.StyleTrigger || 
//                                 valueSource == BaseValueSourceInternal.ParentTemplate ||
//                                 valueSource == BaseValueSourceInternal.ParentTemplateTrigger); 
//            } 
//
//            if (restoreMarker) {
//                newEntry.RestoreExpressionMarker();
//            } else if (oldEntry.IsExpression && oldEntry.ModifiedValue.ExpressionValue == Expression.NoValue) {
//                // we now have a value for an expression that is "hiding" - save it 
//                // as the expression value 
//                newEntry.SetExpressionValue(newEntry.Value, oldEntry.ModifiedValue.BaseValue);
//            } 
//
////#if DEBUG
////            object baseValue;
////            if (!newEntry.HasModifiers) 
////            {
////                baseValue = newEntry.Value; 
////            } 
////            else
////            { 
////                if (newEntry.IsCoercedWithCurrentValue)
////                {
////                    baseValue = newEntry.ModifiedValue.CoercedValue;
////                } 
////                else if (newEntry.IsExpression)
////                { 
////                    baseValue = newEntry.ModifiedValue.ExpressionValue; 
////                }
////                else 
////                {
////                    baseValue = newEntry.ModifiedValue.BaseValue;
////                }
////            } 
////
////            Debug.Assert(newEntry.IsDeferredReference == (baseValue is DeferredReference)); 
////#endif 
//
//            if (entryIndex.Found){
//            	this._effectiveValues[entryIndex.Index] = newEntry;
//            } else {
//            	this.InsertEntry(newEntry, entryIndex.Index); 
//                if (metadata != null && metadata.IsInherited) {
//                	this.InheritableEffectiveValuesCount++; 
//                }
//            }
//
////            Debug.Assert(dp == null || (dp.GlobalIndex == newEntry.PropertyIndex), "EffectiveValueEntry & DependencyProperty do not match"); 
//        },
// 
//        // 
//        //  This method
//        //  1. Create a new EffectiveValueEntry for the given DP and inserts it into the EffectiveValues list 
//        //
//        SetEffectiveValue:function(/*EntryIndex*/ entryIndex, 
//        		/*DependencyProperty*/ dp, /*int*/ targetIndex, /*PropertyMetadata*/ metadata, 
//        		/*object*/ value, /*BaseValueSourceInternal*/ valueSource){ 
////            Debug.Assert(value != DependencyProperty.UnsetValue, "Value to be set cannot be UnsetValue");
////            Debug.Assert(valueSource != BaseValueSourceInternal.Unknown, "ValueSource cannot be Unknown"); 
// 
//            // For thread-safety, sealed DOs can't modify _effectiveValues.
////            Debug.Assert(!DO_Sealed, "A Sealed DO cannot be modified"); 
//
//            if (metadata != null &&
//                metadata.IsInherited &&
//                valueSource != BaseValueSourceInternal.Inherited && 
//                !this.IsSelfInheritanceParent)
//            { 
//            	this.SetIsSelfInheritanceParent(); 
//                entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex);
//            } 
//
//            var entry;
//            if (entryIndex.Found) { 
//                entry = this._effectiveValues[entryIndex.Index];
//            }  else {
//                entry = new EffectiveValueEntry(); 
//                entry.PropertyIndex = targetIndex;
//                this.InsertEntry(entry, entryIndex.Index);
//                if (metadata != null && metadata.IsInherited) { 
//                	this.InheritableEffectiveValuesCount++;
//                } 
//            } 
//
//            var hasExpressionMarker = (value == DependencyObject.ExpressionInAlternativeStore); 
//
//            if (!hasExpressionMarker &&
//                entry.HasExpressionMarker &&
//                (valueSource == BaseValueSourceInternal.ThemeStyle || 
//                 valueSource == BaseValueSourceInternal.ThemeStyleTrigger ||
//                 valueSource == BaseValueSourceInternal.Style || 
//                 valueSource == BaseValueSourceInternal.TemplateTrigger || 
//                 valueSource == BaseValueSourceInternal.StyleTrigger ||
//                 valueSource == BaseValueSourceInternal.ParentTemplate || 
//                 valueSource == BaseValueSourceInternal.ParentTemplateTrigger))
//            {
//                entry.BaseValueSourceInternal = valueSource;
//                entry.SetExpressionValue(value, DependencyObject.ExpressionInAlternativeStore); 
//                entry.ResetAnimatedValue();
//                entry.ResetCoercedValue(); 
//            }  else if (entry.IsExpression && entry.ModifiedValue.ExpressionValue == Expression.NoValue)
//            { 
//                // we now have a value for an expression that is "hiding" - save it
//                // as the expression value
//                entry.SetExpressionValue(value, entry.ModifiedValue.BaseValue);
//            } else
//            { 
////                Debug.Assert(entry.BaseValueSourceInternal != BaseValueSourceInternal.Local || valueSource == BaseValueSourceInternal.Local, 
////                    "No one but another local value can stomp over an existing local value. The only way is to clear the entry");
// 
//                entry.BaseValueSourceInternal = valueSource;
//                entry.ResetValue(value, hasExpressionMarker);
//            }
// 
////            Debug.Assert(dp == null || (dp.GlobalIndex == entry.PropertyIndex), "EffectiveValueEntry & DependencyProperty do not match");
//            this._effectiveValues[entryIndex.Index] = entry; 
//        },
        
        SetEffectiveValue:function(/*EntryIndex*/ entryIndex, /*DependencyProperty*/ dp, /*PropertyMetadata*/ metadata, 
        		/*EffectiveValueEntry*/ newEntry, /*EffectiveValueEntry*/ oldEntry) {
        	if(arguments.length==5){
        		var entryIndex = arguments[0], dp = arguments[1], 
        			metadata = arguments[2], newEntry = arguments[3], oldEntry = arguments[4];
        		
        		if (metadata != null &&
	              metadata.IsInherited && 
	              (newEntry.BaseValueSourceInternal != BaseValueSourceInternal.Inherited ||
	                  newEntry.IsCoerced || newEntry.IsAnimated) && 
	              !this.IsSelfInheritanceParent) {
        			this.SetIsSelfInheritanceParent(); 
        			entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex);
        		}
	
        		var restoreMarker = false; 
			
        		if (oldEntry.HasExpressionMarker && !newEntry.HasExpressionMarker) { 
				      var valueSource = newEntry.BaseValueSourceInternal;
				      restoreMarker = (valueSource == BaseValueSourceInternal.ThemeStyle || 
				                       valueSource == BaseValueSourceInternal.ThemeStyleTrigger ||
				                       valueSource == BaseValueSourceInternal.Style ||
				                       valueSource == BaseValueSourceInternal.TemplateTrigger ||
				                       valueSource == BaseValueSourceInternal.StyleTrigger || 
				                       valueSource == BaseValueSourceInternal.ParentTemplate ||
				                       valueSource == BaseValueSourceInternal.ParentTemplateTrigger); 
        		} 
			
				if (restoreMarker) {
				      newEntry.RestoreExpressionMarker();
				} else if (oldEntry.IsExpression && oldEntry.ModifiedValue.ExpressionValue == Expression.NoValue) {
				      // we now have a value for an expression that is "hiding" - save it 
				  // as the expression value 
				      newEntry.SetExpressionValue(newEntry.Value, oldEntry.ModifiedValue.BaseValue);
				} 
			
			
				if (entryIndex.Found){
					this._effectiveValues[entryIndex.Index] = newEntry;
				} else {
					this.InsertEntry(newEntry, entryIndex.Index); 
					if (metadata != null && metadata.IsInherited) {
						this.InheritableEffectiveValuesCount++; 
					}
				}
        	}else if(arguments.length==6){
        		
        		var entryIndex = arguments[0], 
        		dp = arguments[1], targetIndex = arguments[2], metadata = arguments[3], 
        			value = arguments[4], valueSource = arguments[5];
                if (metadata != null &&
                        metadata.IsInherited &&
                        valueSource != BaseValueSourceInternal.Inherited && 
                        !this.IsSelfInheritanceParent)
                    { 
                    	this.SetIsSelfInheritanceParent(); 
                        entryIndex = this.CheckEntryIndex(entryIndex, dp.GlobalIndex);
                    } 

                    var entry;
                    if (entryIndex.Found) { 
                        entry = this._effectiveValues[entryIndex.Index];
                    }  else {
                        entry = new EffectiveValueEntry(); 
                        entry.PropertyIndex = targetIndex;
                        this.InsertEntry(entry, entryIndex.Index);
                        if (metadata != null && metadata.IsInherited) { 
                        	this.InheritableEffectiveValuesCount++;
                        } 
                    } 

                    var hasExpressionMarker = (value == DependencyObject.ExpressionInAlternativeStore); 

                    if (!hasExpressionMarker &&
                        entry.HasExpressionMarker &&
                        (valueSource == BaseValueSourceInternal.ThemeStyle || 
                         valueSource == BaseValueSourceInternal.ThemeStyleTrigger ||
                         valueSource == BaseValueSourceInternal.Style || 
                         valueSource == BaseValueSourceInternal.TemplateTrigger || 
                         valueSource == BaseValueSourceInternal.StyleTrigger ||
                         valueSource == BaseValueSourceInternal.ParentTemplate || 
                         valueSource == BaseValueSourceInternal.ParentTemplateTrigger))
                    {
                        entry.BaseValueSourceInternal = valueSource;
                        entry.SetExpressionValue(value, DependencyObject.ExpressionInAlternativeStore); 
                        entry.ResetAnimatedValue();
                        entry.ResetCoercedValue(); 
                    }  else if (entry.IsExpression && entry.ModifiedValue.ExpressionValue == Expression.NoValue)
                    { 
                        // we now have a value for an expression that is "hiding" - save it
                        // as the expression value
                        entry.SetExpressionValue(value, entry.ModifiedValue.BaseValue);
                    } else
                    { 
         
                        entry.BaseValueSourceInternal = valueSource;
                        entry.ResetValue(value, hasExpressionMarker);
                    }
         
                    this._effectiveValues[entryIndex.Index] = entry; 
        	}
        },
 
        //
        //  This method
        //  1. Removes the entry if there is one with valueSource >= the specified
        // 
        UnsetEffectiveValue:function(/*EntryIndex*/ entryIndex, /*DependencyProperty*/ dp, /*PropertyMetadata*/ metadata){ 
            if (entryIndex.Found){
                this.RemoveEntry(entryIndex.Index, dp); 
                if (metadata != null && metadata.IsInherited){
                	this.InheritableEffectiveValuesCount--;
                } 
            }
        }, 
 
        //
        //  This method 
        //  1. Sets the expression on a ModifiedValue entry
        //
        SetExpressionValue:function(/*EntryIndex*/ entryIndex, /*object*/ value, /*object*/ baseValue){ 
            var entry = this._effectiveValues[entryIndex.Index];
 
            entry.SetExpressionValue(value, baseValue);
            entry.ResetAnimatedValue(); 
            entry.ResetCoercedValue(); 
            this._effectiveValues[entryIndex.Index] = entry;
        },

        /// <summary>
        ///     Helper method to compare two DP values
        /// </summary> 
        Equals:function(/*DependencyProperty*/ dp, /*object*/ value1, /*object*/ value2){ 
            if (dp.IsValueType || dp.IsStringType) {
                // Use Object.Equals for Strings and ValueTypes 
                return value1 == value2;
            } else { 
                // Use Object.ReferenceEquals for all other ReferenceTypes
                return value1 === value2; 
            } 
        },
        
        
        /// <summary> 
        ///     You have a new InheritanceContext
        /// </summary> 
        /// <remarks>
        ///     This method is equivalent to OnNewParent of
        ///     the yesteryears on an element. Note that the
        ///     implementation may choose to ignore this new 
        ///     context, e.g. in the case of a Freezable that
        ///     is being shared. 
        ///     <p/> 
        ///     Do not call this method directly.  Instead call
        ///     ProvideSelfAsInheritanceContext, which checks various 
        ///     preconditions and then calls AddInheritanceContext for you.
        /// </remarks>
        AddInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property){ 
        	;
        },
 
        /// <summary> 
        ///     You have lost an InheritanceContext
        /// </summary> 
        /// <remarks>
        ///     <p/>
        ///     Do not call this method directly.  Instead call
        ///     RemoveSelfAsInheritanceContext, which checks various 
        ///     preconditions and then calls RemoveInheritanceContext for you.
        /// </remarks> 
        RemoveInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property) {
        	;
        }, 

        /// <summary>
        ///     You are about to provided as the InheritanceContext for the target.
        ///     You can choose to allow this or not. 
        /// </summary>
        ShouldProvideInheritanceContext:function(/*DependencyObject*/ target, /*DependencyProperty*/ property){ 
            return true;
        },

        /// <summary>
        ///     The InheritanceContext for an ancestor
        ///     has changed 
        /// </summary>
        /// <remarks> 
        ///     This is the equivalent of OnAncestorChanged 
        ///     for an element
        /// </remarks> 
        OnInheritanceContextChanged:function(/*EventArgs*/ args) {
            // Fire the event that BindingExpression and 
            // ResourceReferenceExpression will be listening to.
            /*EventHandler*/var handlers = InheritanceContextChangedHandlersField.GetValue(this); 
            if (handlers != null) {
                handlers(this, args); 
            }

            this.CanModifyEffectiveValues = false;
            try 
            {
                // Notify all those DO that the current instance is a 
                // context for (we will call these inheritanceChildren) about the 
                // change in the context. This is like a recursive tree walk.
                // Iterate through the sorted effectiveValues 
                var effectiveValuesCount = this.EffectiveValuesCount;
                for (var i=0; i<effectiveValuesCount; i++)
                {
                    var dp = DependencyProperty.RegisteredPropertyList.List[this._effectiveValues[i].PropertyIndex]; 
                    if (dp != null) { 
                        var localValue = this.ReadLocalValueEntry(new EntryIndex(i), dp, true /* allowDeferredReferences */); 
                        if (localValue != DependencyProperty.UnsetValue) { 
                            var inheritanceChild = localValue instanceof DependencyObject ? localValue : null;
                            if (inheritanceChild!= null && inheritanceChild.InheritanceContext == this) {
                                inheritanceChild.OnInheritanceContextChanged(args); 
                            }
                        } 
                    } 
                }
            } finally
            {
//                Debug.Assert(CanModifyEffectiveValues == false, "We do not expect re-entrancy here.");
            	this.CanModifyEffectiveValues = true; 
            }
 
            // Let sub-classes do their own thing 
            this.OnInheritanceContextChangedCore(args);
        },

        /// <summary>
        ///     This is a means for subclasses to get notification
        ///     of InheritanceContext changes and then they can do 
        ///     their own thing.
        /// </summary> 
        OnInheritanceContextChangedCore:function(/*EventArgs*/ args){ 
        	;
        },
        
//        // A DependencyObject calls this method to indicate to the property
//        // system that a bunch of property sets are about to happen; the 
//        // property system responds by elevating the growth rate of the
//        // EffectiveValues cache, to speed up initialization by requiring
//        // fewer reallocations
//        BeginPropertyInitialization:function()
//        { 
//        	this.IsInPropertyInitialization = true; 
//        },
// 
//        // A DependencyObject calls this method to indicate to the property
//        // system that it is now done with the bunch of property sets that
//        // accompanied the initialization of this element; the property
//        // system responds by returning the growth rate of the 
//        // EffectiveValues cache to its normal rate, and then trimming
//        // the cache to get rid of any excess bloat incurred by the 
//        // aggressive growth rate during initialization mode. 
//        EndPropertyInitialization:function() 
//        {
//        	this.IsInPropertyInitialization = false;
//
//            if (this._effectiveValues != null) 
//            {
//                var effectiveValuesCount = EffectiveValuesCount; 
//                if (effectiveValuesCount != 0) 
//                {
//                    var endLength = effectiveValuesCount; 
//                    if (( endLength / this._effectiveValues.length) < 0.8)
//                    {
//                        // For thread-safety, sealed DOs can't modify _effectiveValues.
////                        Debug.Assert(!DO_Sealed, "A Sealed DO cannot be modified"); 
//
//                        var destEntries = new EffectiveValueEntry[endLength]; 
//                        Array.Copy(_effectiveValues, 0, destEntries, 0, effectiveValuesCount); 
//                        this._effectiveValues = destEntries;
//                    } 
//                }
//            }
//        },
        
        SetInheritanceParent:function(/*DependencyObject*/ newParent) {
//            Debug.Assert((_packedData & 0x3E000000) == 0, "InheritanceParent should not be set in a Freezable, which manages its own inheritance context.");

            // For thread-safety, sealed DOs can't modify _contextStorage 
//            Debug.Assert(!DO_Sealed, "A Sealed DO cannot be modified");
 
            if (this._contextStorage != null)  {
                this._contextStorage = newParent;
            } else  {
                if (newParent != null)  { 
                    // Merge all the inheritable properties on the inheritanceParent into the EffectiveValues
                    // store on the current node because someone had set an effective value for an 
                    // inheritable property on this node.
                    if (this.IsSelfInheritanceParent) {
                    	this.MergeInheritableProperties(newParent); 
                    }  else  { 
                    	this._contextStorage = newParent;
                    } 
                }  else  {
                    // Do nothing because before and after values are both null 
                }
            } 
        },
        

        // Currently we only have support for turning this flag on. Once set this flag never goes false after that.
        SetIsSelfInheritanceParent:function()
        {
            // Merge all the inheritable properties on the inheritanceParent into the EffectiveValues
            // store on the current node because someone tried to set an effective value for an 
            // inheritable property on this node.
            var inheritanceParent = this.InheritanceParent; 
            if (inheritanceParent != null) 
            {
            	this.MergeInheritableProperties(inheritanceParent); 

                // Get rid of the InheritanceParent since we won't need it anymore for
                // having cached all the inheritable properties on self
                this.SetInheritanceParent(null); 
            }
 
            this._packedData |= 0x00100000; 
        },

        //
        //  This method 
        //  1. Recalculates the InheritanceParent with respect to the given FrameworkParent
        //  2. Is called from [FE/FCE].OnAncestorChangedInternal 
        // 
        SynchronizeInheritanceParent:function(/*DependencyObject*/ parent)  {
            // If this flag is true it indicates that all the inheritable properties for this node
            // are cached on itself and hence we will not need the InheritanceParent pointer at all.
            if (!this.IsSelfInheritanceParent) {
                if (parent != null)  { 
                    if (!parent.IsSelfInheritanceParent) { 
                        this.SetInheritanceParent(parent.InheritanceParent);
                    } else { 
                    	this.SetInheritanceParent(parent);
                    } 
                }  else  { 
                	this.SetInheritanceParent(null);
                }
            }
        },

        // 
        //  This method 
        //  1. Merges the inheritable properties from the parent into the EffectiveValues store on self
        // 
        MergeInheritableProperties:function(/*DependencyObject*/ inheritanceParent) {

            var parentEffectiveValues = inheritanceParent.EffectiveValues; 
            var parentEffectiveValuesCount = inheritanceParent.EffectiveValuesCount; 

            for (var i=0; i<parentEffectiveValuesCount; i++) {
                var entry = parentEffectiveValues[i];
                var dp = DependencyProperty.RegisteredPropertyList.List[entry.PropertyIndex];
 
                // There are UncommonFields also stored in the EffectiveValues cache. We need to exclude those.
                if (dp != null)  { 
                    var metadata = dp.GetMetadata(this.DependencyObjectType);
                    if (metadata.IsInherited) {
                        var value = inheritanceParent.GetValueEntry(
                                            new EntryIndex(i),
                                            dp, 
                                            metadata,
                                            RequestFlags.SkipDefault | RequestFlags.DeferredReferences).Value; 
                        if (value != DependencyProperty.UnsetValue)  {
                            var entryIndex = this.LookupEntry(dp.GlobalIndex); 

                            this.SetEffectiveValue(entryIndex, dp, dp.GlobalIndex, metadata, value, BaseValueSourceInternal.Inherited);
                        }
                    } 
                }
            } 
        }, 

        // 
        //  This method
        //  1. Is used to check if the given entryIndex needs any change. It
        //  could happen that we have made a call out and thereby caused changes
        //  to the _effectiveValues store on the current element. In that case 
        //  we would need to aquire new value for the index.
        // 
        CheckEntryIndex:function(/*EntryIndex*/ entryIndex, /*int*/ targetIndex) {
            var effectiveValuesCount = this.EffectiveValuesCount; 
            if (effectiveValuesCount > 0 && this._effectiveValues.Length > entryIndex.Index)
            {
                var entry = this._effectiveValues[entryIndex.Index];
                if (entry.PropertyIndex == targetIndex) 
                {
                    return new EntryIndex(entryIndex.Index); 
                } 
            }
 
            return this.LookupEntry(targetIndex);
        },

        // look for an entry that matches the given dp 
        // return value has Found set to true if an entry is found
        // return value has Index set to the index of the found entry (if Found is true) 
        //            or  the location to insert an entry for this dp (if Found is false) 
        //internal EntryIndex
        LookupEntry:function(/*int*/ targetIndex) {
            var checkIndex;
            var iLo = 0;
            var iHi = this.EffectiveValuesCount; 

            if (iHi <= 0) { 
                return new EntryIndex(0, false /* Found */);
            } 

            // Do a binary search to find the value
            while (iHi - iLo > 3) { 
                var iPv = Math.floor((iHi + iLo) / 2);
                checkIndex = this._effectiveValues[iPv].PropertyIndex; 
                if (targetIndex == checkIndex) {
                    return new EntryIndex(iPv); 
                }
                if (targetIndex <= checkIndex) {
                    iHi = iPv; 
                } else { 
                    iLo = iPv + 1;
                } 
            }

            // Now we only have three values to search; switch to a linear search
            do {
                checkIndex = this._effectiveValues[iLo].PropertyIndex; 
                
                if (checkIndex == targetIndex) { 
                    return new EntryIndex(iLo);
                }

                if (checkIndex > targetIndex) {
                    // we've gone past the targetIndex - return not found 
                    break; 
                }
 
                iLo++;
            }
            while (iLo < iHi);
 
            return new EntryIndex(iLo, false /* Found */);
        },
 
        // insert the given entry at the given index
        // this function assumes that entryIndex is at the right 
        // location such that the resulting list remains sorted by EffectiveValueEntry.PropertyIndex
        InsertEntry:function(/*EffectiveValueEntry*/ entry, /*uint*/ entryIndex) {
 
            if (this.CanModifyEffectiveValues == false) { 
                throw new Error("InvalidOperationException(SR.Get(SRID.LocalValueEnumerationInvalidated)");
            } 
 
            if (this._effectiveValues == null) { 
                this._effectiveValues = [];
            } 
            
            this._effectiveValues.splice(entryIndex, 0, entry);
            this.EffectiveValuesCount++;
        },
        
        // remove the entry at the given index 
        RemoveEntry:function(/*uint*/ entryIndex, /*DependencyProperty*/ dp) {

            if (this.CanModifyEffectiveValues == false){ 
                throw new Error("InvalidOperationException(SR.Get(SRID.LocalValueEnumerationInvalidated)");
            } 
 
            this._effectiveValues.splice(entryIndex, 1); 
            this.EffectiveValuesCount--;

        }
		
	});
	
//	DependencyObject.ExpressionInAlternativeStore = {"name" : "ExpressionInAlternativeStore"};
	DependencyObject.ExpressionInAlternativeStore = Type.ExpressionInAlternativeStore;
	
    DependencyObject.IsTreeWalkOperation = function(/*OperationType*/ operation) { 
        return   operation == OperationType.AddChild ||
                 operation == OperationType.RemoveChild || 
                 operation == OperationType.Inherit;
    };

    //
    // Changes the sources of an existing Expression
    //
	DependencyObject.ChangeExpressionSources = function(/*Expression*/ expr, /*DependencyObject*/ d, 
			/*DependencyProperty*/ dp, /*DependencySource[]*/ newSources) {
        if (!expr.ForwardsInvalidations) 
        { 
            // Get current local value (should be provided Expression)
            // (No need to go through read local callback, just checking 
            // for presence of Expression)
            var entryIndex = d.LookupEntry(dp.GlobalIndex);

            if (!entryIndex.Found || (d._effectiveValues[entryIndex.Index].LocalValue != expr)) 
            {
                throw new Error("ArgumentException(SR.Get(SRID.SourceChangeExpressionMismatch)"); 
            } 
        }

        // Get current sources
        // CALLBACK
        var currentSources = expr.GetSources();

        // Remove old
        if (currentSources != null) 
        { 
        	DependencyObject.UpdateSourceDependentLists(d, dp, currentSources, expr, false);  // Remove
        } 

        // Add new
        if (newSources != null)
        { 
        	DependencyObject.UpdateSourceDependentLists(d, dp, newSources, expr, true);  // Add
        } 
    };
	
    // internal DP used for direct dependencies (should never appear in an effective value table) 
    //
    // A direct dependency can arise from WPF data binding in a situation like this: 
    //      <Border Background="{Binding Path=Brush}"/>
    // when the Brush property on the source object is not a DP, but just a regular CLR property.
    // If a property on the brush changes, the border should be notified so that
    // it can repaint its background. The brush is notified of the change, and 
    // propagtes the notification (as a SubPropertyChange) to all its customers that
    // use the brush via a DP, but this isn't enough for the current scenario. 
    // To overcome this, the binding registers itself as a "direct" dependent of the brush 
    // (using the following DP as the key).  The property engine will forward
    // notifications to direct dependents, the binding will hear about the change, 
    // and will forward a sub-property change to the Border.
    /*static internal readonly DependencyProperty */
    
	Object.defineProperties(DependencyObject,{
		DirectDependencyProperty:
		{
			get:function(){
				if(this._DirectDependencyProperty === undefined){
					this._DirectDependencyProperty = DependencyProperty.Register("__Direct",
							Object.Type, DependencyProperty.Type); 
				}
				return this._DirectDependencyProperty;
			},
			
		}
	});
	
//    DependencyObject.DirectDependencyProperty =
//        DependencyProperty.Register("__Direct", new Type(),/*typeof(object),*/ new Type()/*typeof(DependencyProperty)*/); 

    DependencyObject.UpdateSourceDependentLists=function(/*DependencyObject*/ d, /*DependencyProperty*/ dp, 
    		/*DependencySource[]*/ sources, /*Expression*/ expr, /*bool*/ add) { 
        // Sources already validated to be on the same thread as Dependent (d)

        if (sources != null){
            // don't hold a reference on the dependent if the expression is doing
            // the invalidations.  This helps avoid memory leaks (bug 871139) 
            if (expr.ForwardsInvalidations){ 
                d = null; 
                dp = null;
            } 

            for (var i = 0; i < sources.length; i++){
                var source = sources[i]; 

                // A Sealed DependencyObject does not have a Dependents list 
                // so don't bother updating it (or attempt to add one). 
                if (!source.DependencyObject.IsSealed){ 
                    // Retrieve the DependentListMap for this source
                    // The list of dependents to invalidate is stored using a special negative key 

                    /*FrugalMap*/var dependentListMap;
                    var value = DependencyObject.DependentListMapField.GetValue(source.DependencyObject); 
                    if (value != null){
                        dependentListMap = /*(FrugalMap)*/value;
                    }else{ 
                        dependentListMap = new FrugalMap(); 
                    }

                    // Get list of DependentList off of ID map of Source
                    var dependentListObj = dependentListMap.Get(source.DependencyProperty.GlobalIndex);
                    // Add/Remove new Dependent (this) to Source's list
                    if (add) { 
                        var dependentList;
                        if (dependentListObj == DependencyProperty.UnsetValue) {
                            dependentListMap.Set(source.DependencyProperty.GlobalIndex, dependentList = new DependentList());
                        } else  {
                            dependentList = /*(DependentList)*/dependentListObj; 
                        } 

                        dependentList.Add(d, dp, expr); 
                    } else {
                        if (dependentListObj != DependencyProperty.UnsetValue) {
                            var dependentList = /*(DependentList)*/dependentListObj; 

                            dependentList.Remove(d, dp, expr);

                            if (dependentList.IsEmpty) {
                                // No more dependencies for this property; reclaim the space if we can.
                                dependentListMap.Set(source.DependencyProperty.GlobalIndex, DependencyProperty.UnsetValue); 
                            }
                        } 
                    } 

                    // Set the updated struct back into the source's _localStore. 
                    DependencyObject.DependentListMapField.SetValue(source.DependencyObject, dependentListMap);
                }
            }
        } 
    };


    /// <summary> 
    /// Register the two callbacks that are used to implement the "alternative 
    /// Expression storage" feature, and return the two methods used to access
    /// the feature. 
    /// </summary>
    /// <remarks>
    /// This method should only be called (once) from the Framework.  It should
    /// not be called directly by users. 
    /// </remarks>
    DependencyObject.RegisterForAlternativeExpressionStorage = function( 
                        /*AlternativeExpressionStorageCallback*/ getExpressionCore,
                        /*out*/ /*AlternativeExpressionStorageCallback getExpression*/getExpressionOut) {
        _getExpressionCore = getExpressionCore;

        getExpressionOut.getExpression = new AlternativeExpressionStorageCallback(null, GetExpression); 
    };
    

    /// <summary>
    /// Return the Expression (if any) currently in effect for the given property. 
    /// </summary>
    function GetExpression(/*DependencyObject*/ d, /*DependencyProperty*/ dp, /*PropertyMetadata*/ metadata) {
        var entryIndex = d.LookupEntry(dp.GlobalIndex); 

        if (!entryIndex.Found) { 
            return null;
        } 

        var entry = d._effectiveValues[entryIndex.Index];

        if (entry.HasExpressionMarker) {
            if (_getExpressionCore != null) { 
                return _getExpressionCore.Call(d, dp, metadata);
            } 

            return null;
        }

        // no expression marker -- check local value itself
        if (entry.IsExpression) { 
            return  entry.LocalValue;
        } 

        return null;
    }

    // Optimization, to avoid calling FromSystemType too often 
//    DependencyObject.DType = DependencyObjectType.FromSystemTypeInternal(DependencyObject.Type);

	
	Object.defineProperties(DependencyObject.prototype, {
		 
        /// <summary>Returns the DType that represents the CLR type of this instance</summary> 
        DependencyObjectType:
        { 
            get:function()
            {
                if (this._dType === undefined)
                { 
                    // Specialized type identification
                	this._dType = DependencyObjectType.FromSystemTypeInternal(this.GetType()); 
                } 

                // Do not call VerifyAccess because this method is trivial. 
                return this._dType;
            }
        },
        
        /// <summary>
        ///     Indicates whether or not this object is in a Read-Only state; when in a Read-Only state, SetValue is not permitted,
        ///     though the effective value for a property may change.
        /// </summary> 
        IsSealed:
        { 
            get:function() 
            {
                return this.DO_Sealed; 
            }
        },
        
        /// <summary>
        ///     This is how we track if someone is enumerating the _effectiveValues 
        ///     cache. This flag should be set to false before doing that. 
        /// </summary>
        CanModifyEffectiveValues: 
        {
            get:function() { return (this._packedData & 0x00080000) != 0; },

            set:function(value) 
            {
//                Debug.Assert(!DO_Sealed, "A Sealed DO cannot be modified"); 
 
                if (value)
                { 
                	this._packedData |= 0x00080000;
                }
                else
                { 
                	this._packedData &= 0xFFF7FFFF;
                } 
            } 
        },
 
        IsInheritanceContextSealed:
        {
            get:function() { return (this._packedData & 0x01000000) != 0; },
            set:function(value)
            { 
                if (value) 
                {
                	this._packedData |= 0x01000000; 
                }
                else
                {
                	this._packedData &= 0xFEFFFFFF; 
                }
            } 
        },

        DO_Sealed: 
        {
            get:function() { return (this._packedData & 0x00400000) != 0; },
            set:function(value) { if (value) { this._packedData |= 0x00400000; } else { this._packedData &= 0xFFBFFFFF; } }
        }, 

        // Freezable State stored here for size optimization: 
        // Freezable is immutable 
        Freezable_Frozen:
        { 
            // uses the same bit as Sealed ... even though they are not quite synonymous
            // Since Frozen implies Sealed, and calling Seal() is disallowed on Freezable,
            // this is ok.
            get:function() { return this.DO_Sealed; }, 
            set:function(value) { this.DO_Sealed = value; }
        }, 
 
        // Freezable State stored here for size optimization:
        // Freezable is being referenced in multiple places and hence cannot have a single InheritanceContext 
        Freezable_HasMultipleInheritanceContexts:
        {
            get:function() { return (this._packedData & 0x02000000) != 0; },
            set:function(value) { if (value) { this._packedData |= 0x02000000; } else { this._packedData &= 0xFDFFFFFF; } } 
        },
 
        // Freezable State stored here for size optimization: 
        // Handlers stored in a dictionary
        Freezable_UsingHandlerList: 
        {
            get:function() { return (this._packedData & 0x04000000) != 0; },
            set:function(value) { if (value) { this._packedData |= 0x04000000; } else { this._packedData &= 0xFBFFFFFF; } }
        }, 

        // Freezable State stored here for size optimization: 
        // Context stored in a dictionary 
        Freezable_UsingContextList:
        { 
            get:function() { return (this._packedData & 0x08000000) != 0; },
            set:function(value) { if (value) { this._packedData |= 0x08000000; } else { this._packedData &= 0xF7FFFFFF; } }
        },
 
        // Freezable State stored here for size optimization:
        // Freezable has a single handler 
        Freezable_UsingSingletonHandler :
        {
            get:function() { return (this._packedData & 0x10000000) != 0; }, 
            set:function(value) { if (value) { this._packedData |= 0x10000000; } else { this._packedData &= 0xEFFFFFFF; } }
        },

        // Freezable State stored here for size optimization: 
        // Freezable has a single context
        Freezable_UsingSingletonContext :
        { 
            get:function() { return (this._packedData & 0x20000000) != 0; },
            set:function(value) { if (value) { this._packedData |= 0x20000000; } else { this._packedData &= 0xDFFFFFFF; } } 
        },


        // Animatable State stored here for size optimization: 
        //
        Animatable_IsResourceInvalidationNecessary :
        { 
            get:function() { return (this._packedData & 0x40000000) != 0; }, 
            set:function(value) { if (value) { this._packedData |= 0x40000000; } else { this._packedData &= 0xBFFFFFFF; } }
        },
 
        // IAnimatable State stored here for size optimization:
        // Returns true if this IAnimatable implemention has animations on its properties 
        // but doesn't check the sub-properties for animations. 
        IAnimatable_HasAnimatedProperties:
        { 
            get:function() { return (this._packedData & 0x80000000) != 0; },
            set:function(value) { if (value) { this._packedData |= 0x80000000; } else { this._packedData &= 0x7FFFFFFF; } } 
        },
        
        /// <summary> 
        ///     InheritanceContext
        /// </summary> 
        /*DependencyObject*/ InheritanceContext:
        {
            get:function() { return null; } 
        },
        
        // The rest of DependencyObject is its EffectiveValues cache
        
        // The cache of effective (aka "computed" aka "resolved") property 
        // values for this DO.  If a DP does not have an entry in this array
        // it means one of two things: 
        //  1) if it's an inheritable property, then its value may come from
        //     this DO's InheritanceParent
        //  2) if it's not an inheritable property (or this DO's InheritanceParent
        //     doesn't have an entry for this DP either), then the value for 
        //     that DP on this DO is the default value.
        // Otherwise, the DP will have an entry in this array describing the 
        // current value of the DP, where this value came from, and how it 
        // has been modified
        EffectiveValues :
        {
            get:function() { return this._effectiveValues; }
        }, 

        // The total number of entries in the above EffectiveValues cache 
        EffectiveValuesCount :
        {
            get:function() { return this._packedData & 0x000003FF; },
            /*private*/ set:function(value) { this._packedData = (this._packedData & 0xFFFFFC00) | (value & 0x000003FF); }
        },
 
        // The number of entries in the above EffectiveValues cache that
        // correspond to DPs that are inheritable on this DO; this count 
        // helps us during "tree change" invalidations to know how big 
        // of a "working change list" we have to construct.
        InheritableEffectiveValuesCount :
        {
            get:function() { return (this._packedData >> 10) & 0x1FF; },
            set:function(value) 
            {
                this._packedData = ((value & 0x1FF) << 10) | (this._packedData & 0xFFF803FF); 
            }
        }, 

//        // This flag indicates whether or not we are in "Property Initialization
//        // Mode".  This is an opt-in mode: a DO starts out *not* in Property
//        // Initialization Mode.  In this mode, the EffectiveValues cache grows 
//        // at a more liberal (2.0) rate.  Normally, outside of this mode, the
//        // cache grows at a much stingier (1.2) rate. 
//        // Internal customers (currently only UIElement) access this mode 
//        // through the BeginPropertyInitialization/EndPropertyInitialization
//        // methods below 
//        IsInPropertyInitialization:
//        {
//            get:function() { return (this._packedData & 0x00800000) != 0; },
//            set:function(value) 
//            {
//                if (value) 
//                { 
//                	this._packedData |= 0x00800000;
//                } 
//                else
//                {
//                	this._packedData &= 0xFF7FFFFF;
//                } 
//            }
//        },
        

        /// <summary>
        ///     Event for InheritanceContextChanged. This is 
        ///     the event that BindingExpression and
        ///     ResourceReferenceExpressions will be listening to. 
        /// </summary> 
        /// <remarks>
        ///     make this pay-for-play by storing handlers 
        ///     in an uncommon field
        /// </remarks>
        /*internal event EventHandler */InheritanceContextChanged:
        { 
//            add 
//            { 
//                // Get existing event hanlders
//                var handlers = InheritanceContextChangedHandlersField.GetValue(this); 
//                if (handlers != null)
//                {
//                    // combine to a multicast delegate
//                    handlers = Delegate.Combine(handlers, value); 
//                }
//                else 
//                { 
//                    handlers = value;
//                } 
//                // Set the delegate as an uncommon field
//                InheritanceContextChangedHandlersField.SetValue(this, handlers);
//            }
// 
//            remove 
//            { 
//                // Get existing event hanlders
//                var handlers = InheritanceContextChangedHandlersField.GetValue(this); 
//                if (handlers != null)
//                {
//                    // Remove the given handler
//                    handlers = Delegate.Remove(handlers, value); 
//                    if (handlers == null)
//                    { 
//                        // Clear the value for the uncommon field 
//                        // cause there are no more handlers
//                        InheritanceContextChangedHandlersField.ClearValue(this); 
//                    }
//                    else
//                    {
//                        // Set the remaining handlers as an uncommon field 
//                        InheritanceContextChangedHandlersField.SetValue(this, handlers);
//                    } 
//                } 
//            }
        },


        
        /// <summary>
        ///     By default this is false since it doesn't have a context
        /// </summary> 
        HasMultipleInheritanceContexts:
        { 
            get:function() { return false; } 
        },
 
        /// <summary>
        ///     By default this is true since every DependencyObject can be an InheritanceContext
        /// </summary>
        CanBeInheritanceContext :
        {
            get:function() { return (this._packedData & 0x00200000) != 0; },

            set:function(value)
            {
                if (value)
                { 
                	this._packedData |= 0x00200000;
                } 
                else 
                {
                	this._packedData &= 0xFFDFFFFF; 
                }
            }
        },
        
        

        InheritanceParent :
        { 
            get:function() 
            {
                if ((this._packedData & 0x3E100000) == 0)
                {
                    return  this._contextStorage; 
                }
 
                // return null if this DO has any of the following set: 
                //    IsSelfInheritanceParent
                //    Freezable_HasMultipleInheritanceContexts 
                //    Freezable_UsingHandlerList
                //    Freezable_UsingContextList
                //    Freezable_UsingSingletonHandler
                //    Freezable_UsingSingletonContext 
                return null;
            } 
        },
        
        IsSelfInheritanceParent:
        {
            get:function() { return (this._packedData & 0x00100000) != 0; }
        } 

 
	});
	

    Object.defineProperties(DependencyObject, {
//  	  // This uncommon field is used to store the handlers for the InheritanceContextChanged event 
//    	InheritanceContextChangedHandlersField:
//    	{
//    		get:function(){
//	    		if(DependencyObject._InheritanceContextChangedHandlersField ===undefined){
//	    			DependencyObject._InheritanceContextChangedHandlersField = new UncommonField();
//	    		}
//	    		
//	    		return DependencyObject._InheritanceContextChangedHandlersField;
//    		}
//    	},
    	
        // This field stores the list of dependents in a FrugalMap.
        // The field is of type object for two reasons: 
        // 1) FrugalMap is a struct, and generics over value types have perf issues
        // 2) so that we can have the default value of "null" mean Unset. 
    	DependentListMapField:{
    		get:function(){
    			if(DependencyObject._DependentListMapField === undefined){
    				DependencyObject._DependentListMapField = new UncommonField();
    			}
    			
    			return DependencyObject._DependentListMapField;
    		}
    	},
    	
//    	/*internal*/ public static DependencyObjectType 
    	DType:
    	{
    		get:function(){
	    		if(DependencyObject._DType === undefined){
	    			DependencyObject._DType = DependencyObjectType.FromSystemTypeInternal(DependencyObject.Type);
	    		}
	    		
	    		return DependencyObject._DType;
    		}
    	}
    });
	
	DependencyObject.Type = new Type("DependencyObject", DependencyObject, [DispatcherObject.Type]);
	return DependencyObject;
});
