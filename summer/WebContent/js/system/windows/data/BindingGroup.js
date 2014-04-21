/**
 * BindingGroup
 */

define(["dojo/_base/declare", "system/Type","windows/DependencyObject", "controls/DataErrorValidationRule",
        "objectmodel/ObservableCollection"], 
		function(declare, Type, DependencyObject, DataErrorValidationRule,
				ObservableCollection){
	
	   // to support GetValue, we maintain an associative array of all the bindings, 
    // items, and property names that affect a binding group.
//    private class 
	var GetValueTable = declare(null, {
		constructor:function(){
//			Collection<GetValueTableEntry> 
			this._table = new Collection/*<GetValueTableEntry>*/();
		},
        Get:function(/*object*/ item, /*string*/ propertyName)
        { 
        	if(arguments.length == 2){
                for (var i=this._table.Count-1; i >= 0; --i) 
                {
                    /*GetValueTableEntry*/var entry = this._table.Get(i); 
                    if (propertyName == entry.PropertyName &&
                        Object.Equals(item, entry.Item))
                    {
                        return entry; 
                    }
                } 

                return null;
        	}else if(arguments.length == 1){
                for (var i=this._table.Count-1; i >= 0; --i)
                { 
                    /*GetValueTableEntry*/var entry = this._table.Get(i);
                    if (arguments[0] == entry.BindingExpressionBase)
                    {
                        return entry; 
                    }
                } 

                return null;
        	}

        },
//        // lookup by item and propertyName
//        public GetValueTableEntry this[object item, string propertyName]
//        { 
//
//        }

//        // lookup by binding
//        public GetValueTableEntry this[BindingExpressionBase bindingExpressionBase] 
//        {
//            get 
//            { 
//                for (int i=_table.Count-1; i >= 0; --i)
//                { 
//                    GetValueTableEntry entry = _table[i];
//                    if (bindingExpressionBase == entry.BindingExpressionBase)
//                    {
//                        return entry; 
//                    }
//                } 
//
//                return null;
//            } 
//        }

        // ensure an entry for the given binding
//        public void 
        EnsureEntry:function(/*BindingExpressionBase*/ bindingExpressionBase) 
        {
            /*GetValueTableEntry*/var entry = this.Get(bindingExpressionBase); 
            if (entry == null) 
            {
                this._table.Add(new GetValueTableEntry(bindingExpressionBase)); 
            }
        },

        // update (or add) the entry for the given leaf binding 
//        public bool 
        Update:function(/*BindingExpression*/ bindingExpression)
        { 
            /*GetValueTableEntry*/var entry = this.Get(bindingExpression); 
            var newEntry = (entry == null);

            if (newEntry)
            {
                this._table.Add(new GetValueTableEntry(bindingExpression));
            } 
            else
            { 
                entry.Update(bindingExpression); 
            }

            return newEntry;
        },

        // remove all the entries for the given root binding.  Return the list of expressions. 
//        public List<BindingExpressionBase> 
        RemoveRootBinding:function(/*BindingExpressionBase*/ rootBindingExpression)
        { 
            /*List<BindingExpressionBase>*/var result = new List/*<BindingExpressionBase>*/(); 

            for (var i= this._table.Count-1; i >= 0; --i) 
            {
                var expr = this._table.Get(i).BindingExpressionBase;
                if (expr.RootBindingExpression == rootBindingExpression)
                { 
                    result.Add(expr);
                    this._table.RemoveAt(i); 
                } 
            }

            return result;
        },

        // append to a list of the unique items (wrapped in WeakReferences) 
//        public void 
        AddUniqueItems:function(/*IList<WeakReference>*/ list)
        { 
            for (var i=this._table.Count-1; i >= 0; --i) 
            {
                // don't include bindings that couldn't resolve 
                if (this._table.Get(i).BindingExpressionBase.StatusInternal == BindingStatusInternal.PathError)
                    continue;

                var itemWR = _table.Get(i).ItemReference; 
                if (itemWR != null && BindingGroup.FindIndexOf(itemWR, list) < 0)
                { 
                    list.Add(itemWR); 
                }
            } 
        },

        // get the value for a binding expression
//        public object 
        GetValue:function(/*BindingExpressionBase*/ bindingExpressionBase) 
        {
            /*GetValueTableEntry*/var entry = this.Get(bindingExpressionBase); 
            return (entry != null) ? entry.Value : DependencyProperty.UnsetValue; 
        },

        // set the value for a binding expression
//        public void 
        SetValue:function(/*BindingExpressionBase*/ bindingExpressionBase, /*object*/ value)
        {
            /*GetValueTableEntry*/var entry = this.Get(bindingExpressionBase); 
            if (entry != null)
            { 
                entry.Value = value; 
            }
        },

        // reset values to "raw"
//        public void 
        ResetValues:function()
        { 
            for (var i=this._table.Count-1; i>=0; --i)
            { 
            	this._table.Get(i).Value = BindingGroup.DeferredTargetValue; 
            }
        }, 

        // set values to "source" for all bindings under the given root
//        public void 
        UseSourceValue:function(/*BindingExpressionBase*/ rootBindingExpression)
        { 
            for (var i=this._table.Count-1; i>=0; --i)
            { 
                if (this._table.Get(i).BindingExpressionBase.RootBindingExpression == rootBindingExpression) 
                {
                	this._table.Get(i).Value = BindingGroup.DeferredSourceValue; 
                }
            }
        },

        // return the first entry in the table (or null)
//        public GetValueTableEntry 
        GetFirstEntry:function() 
        { 
            return (this._table.Count > 0) ? this._table.Get(0) : null;
        } 
        
    });

    // a single entry in the GetValueTable
//    private class 
	var GetValueTableEntry = declare(null, { 
        constructor:function(/*BindingExpressionBase*/ bindingExpressionBase)
        { 
            this._bindingExpressionBase = bindingExpressionBase;
        },

//        public void 
        Update:function(/*BindingExpression*/ bindingExpression) 
        {
            var item = bindingExpression.SourceItem; 
            if (item == null) 
            {
                this._itemWR = null; 
            }
            else if (this._itemWR == null)
            {
            	this._itemWR = new WeakReference(item);  // WR to avoid leaks 
            }
            else 
            { 
            	this._itemWR.Target = bindingExpression.SourceItem;
            } 

            this._propertyName = bindingExpression.SourcePropertyName;
        },

      

//        BindingExpressionBase   _bindingExpressionBase; 
//        WeakReference   _itemWR;
//        string          _propertyName;
//        object          _value = BindingGroup.DeferredTargetValue;
    });
	
	Object.defineProperties(GetValueTableEntry.prototype, {
//		public object 
		Item:
        { 
            get:function() { return this._itemWR.Target; } 
        },

//        public WeakReference 
        ItemReference:
        {
            get:function() { return this._itemWR; }
        }, 

//        public string 
        PropertyName: 
        { 
            get:function() { return this._propertyName; }
        }, 

//        public BindingExpressionBase 
        BindingExpressionBase:
        {
            get:function() { return this._bindingExpressionBase; } 
        },

//        public object 
        Value: 
        {
            get:function() 
            {
                if (_value == BindingGroup.DeferredTargetValue)
                {
                    _value = this._bindingExpressionBase.RootBindingExpression.GetRawProposedValue(); 
                }
                else if (_value == BindingGroup.DeferredSourceValue) 
                { 
                    var bindingExpression = this._bindingExpressionBase instanceof BindingExpression ? 
                    		this._bindingExpressionBase : null;
                    this._value = (bindingExpression != null) ? bindingExpression.SourceValue : DependencyProperty.UnsetValue;
                }

                return _value; 
            },
            set:function(value) { this._value = value; } 
        }		  	 
	});


    // to support sharing of proposed values, we maintain an associative array 
    // of <item, propertyName, rawProposedValue, convertedProposedValue, validation rules>
//    private class 
	var ProposedValueTable = declare(null, {
        // add an entry, based on the ProposedValue structure returned by validation
//        public void 
		Add:function(/*BindingExpressionBase.ProposedValue*/ proposedValue)
        { 
			var bindExpr = proposedValue.BindingExpression;
            var item = bindExpr.SourceItem; 
            var propertyName = bindExpr.SourcePropertyName; 
            var rawValue = proposedValue.RawValue;
            var convertedValue = proposedValue.ConvertedValue; 

            // at most one proposed value per <item, propertyName>
            this.Remove(item, propertyName);

            // add the new entry
            this._table.Add(new ProposedValueEntry(item, propertyName, rawValue, convertedValue, bindExpr)); 
        }, 

        // remove an entry 
//        public void 
        Remove:function(/*object*/ item, /*string*/ propertyName)
        {
            var index = this.IndexOf(item, propertyName);
            if (index >= 0) 
            {
                this._table.RemoveAt(index); 
            } 
        },

        // remove an entry corresponding to a binding
//        public void 
        Remove:function(/*BindingExpression*/ bindExpr)
        {
            if (this._table.Count > 0) 
            {
                this.Remove(bindExpr.SourceItem, bindExpr.SourcePropertyName); 
            } 
        },

        // remove an entry
//        public void 
        Remove:function(/*ProposedValueEntry*/ entry)
        {
            this._table.Remove(entry); 
        },

        // remove all entries 
//        public void 
        Clear:function()
        { 
            this._table.Clear();
        },
    	// lookup by item and propertyName 
    	
		Get:function(item, propertyName)
		{
			if(arguments.length == 2){
				var index = this.IndexOf(item, propertyName);
				return (index < 0) ? null : this._table.Get(index);
			}else if(arguments.length == 1){
				if(typeof(arguments[0]) == "number"){
					return this._table.Get(index); 
				}else{
					this.Get(arguments[0].SourceItem, arguments[0].SourcePropertyName);
				}
			}
		},

        // append to a list of unique items
//        public void 
		AddUniqueItems:function(/*IList<WeakReference>*/ list)
        {
            for (var i=_table.Count-1; i >= 0; --i) 
            {
                var itemWR = this._table.Get(i).ItemReference; 
                if (itemWR != null && BindingGroup.FindIndexOf(itemWR, list) < 0) 
                {
                    list.Add(itemWR); 
                }
            }
        },

        // call UpdateTarget on all dependents
//        public void 
        UpdateDependents:function() 
        { 
            for (var i=_table.Count-1; i>=0; --i)
            { 
                /*Collection<BindingExpressionBase>*/var dependents = this._table.Get(i).Dependents;
                if (dependents != null)
                {
                    for (var j=dependents.Count-1; j>=0; --j) 
                    {
                        var beb = dependents.Get(j); 
                        if (!beb.IsDetached) 
                        {
                            dependents.Get(j).UpdateTarget(); 
                        }
                    }
                }
            } 
        },

//        public bool 
        HasValidationError:function(/*ValidationError*/ validationError) 
        {
            for (var i=this._table.Count-1; i>=0; --i) 
            {
                if (validationError == this._table.Get(i).ValidationError)
                    return true;
            } 
            return false;
        }, 

        // return the index of the entry with given key (or -1)
//        private int 
        IndexOf:function(/*object*/ item, /*string*/ propertyName) 
        {
            for (var i=this._table.Count-1; i >= 0; --i)
            {
                var entry = this._table[i]; 
                if (propertyName == entry.PropertyName &&
                    Object.Equals(item, entry.Item)) 
                { 
                    return i;
                } 
            }

            return -1;
        } 

//        Collection<ProposedValueEntry> _table = new Collection<ProposedValueEntry>(); 
    });
    	
    Object.defineProperties(ProposedValueTable.prototype, {
//    	public int 
    	Count: { get:function() { return this._table.Count; } }, 
    });

    // a single entry in the ProposedValueTable 
//    internal class 
    var ProposedValueEntry= declare(null, {
        constructor:function(/*object*/ item,
                                /*string*/ propertyName, 
                                /*object*/ rawValue,
                                /*object*/ convertedValue, 
                                /*BindingExpression*/ bindExpr) 
        {
            this._itemReference = new WeakReference(item); 
            this._propertyName = propertyName;
            this._rawValue = rawValue;
            this._convertedValue = convertedValue;
            this._error = bindExpr.ValidationError; 
            this._binding = bindExpr.ParentBinding;
        }, 



//        public void 
        AddDependent:function(/*BindingExpressionBase*/ dependent)
        { 
            if (this._dependents == null)
            {
            	this._dependents = new Collection/*<BindingExpressionBase>*/();
            } 
            this._dependents.Add(dependent);
        },

//        WeakReference _itemReference;
//        string _propertyName; 
//        object _rawValue;
//        object _convertedValue;
//        ValidationError _error;
//        Binding _binding; 
//        Collection<BindingExpressionBase> _dependents;
    });
    
    Object.defineProperties(ProposedValueEntry.prototype, {
//        public object 
    	Item:                      { get:function() { return this._itemReference.Target; } },
//        public string 
    	PropertyName:              { get:function() { return this._propertyName; } }, 
//        public object 
    	RawValue:                  { get:function() { return this._rawValue; } },
//        public object 
    	ConvertedValue:            { get:function() { return this._convertedValue; } },
//        public ValidationError 
    	ValidationError:  { get:function() { return this._error; } },
//        public Binding 
    	Binding:                  { get:function() { return this._binding; } }, 
//        public WeakReference 
    	ItemReference:      { get:function() { return this._itemReference; } },
//        public Collection<BindingExpressionBase> 
    	Dependents: { get:function() { return this._dependents; } }, 
    });

    // add some error-checking to ObservableCollection
//    class 
    var BindingExpressionCollection =declare(ObservableCollection/*<BindingExpressionBase>*/, {
    	constructor:function(){
    		ObservableCollection.prototype.constructor.call(this);
    	},
    	
        /// <summary>
        /// Called by base class Collection&lt;T&gt; when an item is added to list;
        /// raises a CollectionChanged event to any listeners. 
        /// </summary>
//        protected override void 
    	InsertItem:function(/*int*/ index, /*BindingExpressionBase*/ item) 
        { 
            if (item == null)
            { 
                throw new ArgumentNullException("item");
            }

            ObservableCollection.prototype.InsertItem.call(this, index, item); 
        },

        /// <summary> 
        /// Called by base class Collection&lt;T&gt; when an item is set in list;
        /// raises a CollectionChanged event to any listeners. 
        /// </summary>
//        protected override void 
        SetItem:function(/*int*/ index, /*BindingExpressionBase*/ item)
        {
            if (item == null) 
            {
                throw new ArgumentNullException("item"); 
            } 

            ObservableCollection.prototype.SetItem.call(this, index, item); 
        }
    });
    
    
	var BindingGroup = declare("BindingGroup", DependencyObject,{
		constructor:function(/*BindingGroup*/ master ){
			if(arguments.length == 0){
				this._validationRules = new ValidationRuleCollection();
			}else{
	            this._validationRules = master._validationRules;
	            this._name = master._name;
	            this._notifyOnValidationError = master._notifyOnValidationError;
	            this._sharesProposedValues = master._sharesProposedValues; 
	            this._validatesOnNotifyDataError = master._validatesOnNotifyDataError;
			}
            this.Initialize();
		},

//        void 
		Initialize:function() 
        {
            this._engine = DataBindEngine.CurrentDataBindEngine;
            this._bindingExpressions = new BindingExpressionCollection();
            this._bindingExpressions.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnBindingsChanged)); 

            this._itemsRW = new Collection/*<WeakReference>*/(); 
            this._items = new WeakReadOnlyCollection/*<object>*/(this._itemsRW); 
        },
        
        // get the validation errors associated with this BindingGroup.
        // If there are none, return false.    Otherwise return a superset of the 
        // errors, and set isPure to true if the superset contains no errors from
        // any other source.  (This avoids allocations in the 90% case.) 
//        bool 
        GetValidationErrors:function(/*out ValidationErrorCollection superset*/supersetOut, /*out bool isPure*/isPureOut) 
        {
        	supersetOut.superset = null; 
        	isPureOut.isPure = true;

            var mentor = Helper.FindMentor(this);
            if (mentor == null) 
                return false;
 
            supersetOut.superset = Validation.GetErrorsInternal(mentor); 
            if (supersetOut.superset == null || supersetOut.superset.Count == 0)
                return false; 

            for (var i=supersetOut.superset.Count-1; i>=0; --i)
            {
                var validationError = supersetOut.superset.Get(i); 
                if (!this.Belongs(validationError))
                { 
                	isPureOut.isPure = false; 
                    break;
                } 
            }

            return true;
        }, 

//        bool 
        Belongs:function(/*ValidationError*/ error) 
        { 
            var bb;
            return (error.BindingInError == this || 
            		this._proposedValueTable.HasValidationError(error) ||
                    (  (bb = error.BindingInError instanceof BindingExpressionBase ? error.BindingInError : null) != null &&
                        bb.BindingGroup == this)
                    ); 
        },
        
        /// <summary>
        /// Begin an editing transaction.  For each source that supports it,
        /// the binding group asks the source to save its state, for possible
        /// restoration during <see cref="CancelEdit"/>. 
        /// </summary>
//        public void 
        BeginEdit:function() 
        { 
            if (!this.IsEditing)
            { 
                var items = this.Items;
                for (var i=items.Count-1; i>=0; --i)
                {
                    var ieo = items.Get(i);
                    ieo = ieo instanceof IEditableObject ? ieo : null; 
                    if (ieo != null)
                    { 
                        ieo.BeginEdit(); 
                    }
                } 

                this.IsEditing = true;
            }
        }, 

        /// <summary> 
        /// End an editing transaction.  The binding group attempts to update all 
        /// its sources with the proposed new values held in the target UI elements.
        /// All validation rules are run, at the times requested by the rules. 
        /// </summary>
        /// <returns>
        /// True, if all validation rules succeed and no errors arise.
        /// False, otherwise. 
        /// </returns>
//        public bool 
        CommitEdit:function() 
        { 
            var result = this.UpdateAndValidate(ValidationStep.CommittedValue);
            this.IsEditing = this.IsEditing && !result; 
            return result;
        },

        /// <summary> 
        /// Cancel an editing transaction.  For each source that supports it,
        /// the binding group asks the source to restore itself to the state saved 
        /// at the most recent <see cref="BeginEdit"/>.  Then the binding group 
        /// updates all targets with values from their respective sources, discarding
        /// any "dirty" values held in the targets. 
        /// </summary>
//        public void 
        CancelEdit:function()
        {
            // remove validation errors affiliated with the group (errors for 
            // individual bindings will be removed during UpdateTarget)
            this.ClearValidationErrors(); 
 
            // restore values
            var items = this.Items; 
            for (var i=items.Count-1; i>=0; --i)
            {
                var ieo = items.Get(i);
                ieo = ieo instanceof IEditableObject ? ieo : null;
                if (ieo != null) 
                {
                    ieo.CancelEdit(); 
                } 
            }
 
            // update targets
            for (var i=_bindingExpressions.Count - 1; i>=0; --i)
            {
            	this._bindingExpressions.Get(i).UpdateTarget(); 
            }
 
            // also update dependent targets.  These are one-way bindings that 
            // were initialized with a proposed value, and now need to re-fetch
            // the data from their sources 
            this._proposedValueTable.UpdateDependents();

            // remove proposed values
            this._proposedValueTable.Clear(); 

            this.IsEditing = false; 
        }, 

        /// <summary> 
        /// Run the validation process up to the ConvertedProposedValue step.
        /// This runs all validation rules marked as RawProposedValue or
        /// ConvertedProposedValue, but does not update any sources with new values.
        /// </summary> 
        /// <returns>
        /// True, if all validation rules succeed and no errors arise. 
        /// False, otherwise. 
        /// </returns>
//        public bool 
        ValidateWithoutUpdate:function() 
        {
            return this.UpdateAndValidate(ValidationStep.ConvertedProposedValue);
        },
 
        /// <summary>
        /// Run the validation process up to the UpdatedValue step. 
        /// This runs all validation rules marked as RawProposedValue or 
        /// ConvertedProposedValue, updates the sources with new values, and
        /// runs rules marked as Updatedvalue. 
        /// </summary>
        /// <returns>
        /// True, if all validation rules succeed and no errors arise.
        /// False, otherwise. 
        /// </returns>
//        public bool 
        UpdateSources:function() 
        { 
            return this.UpdateAndValidate(ValidationStep.UpdatedValue);
        }, 

        /// <summary>
        /// Find the binding that uses the given item and property, and return
        /// the value appropriate to the current validation step. 
        /// </summary>
        /// <exception cref="InvalidOperationException"> 
        /// the binding group does not contain a binding corresponding to the 
        /// given item and property.
        /// </exception> 
        /// <exception cref="ValueUnavailableException">
        /// the value is not available.  This could be because an earlier validation
        /// rule deemed the value invalid, or because the value could not be produced
        /// for some reason, such as conversion failure. 
        /// </exception>
        /// <Remarks> 
        /// This method is intended to be called from a validation rule, during 
        /// its Validate method.
        /// </Remarks> 
//        public object 
        GetValue:function(/*object*/ item, /*string*/ propertyName)
        {
            var value;
            var valueOut = {
            	"value" : value
            };
            
            var r = this.TryGetValueImpl(item, propertyName, /*out value*/valueOut);
            value = valueOut.value;
            if (r)
            { 
                return value; 
            }
 
            if (value == Binding.DoNothing)
                throw new ValueUnavailableException(SR.Get(SRID.BindingGroup_NoEntry, item, propertyName));
            else
                throw new ValueUnavailableException(SR.Get(SRID.BindingGroup_ValueUnavailable, item, propertyName)); 
        },
 
        /// <summary> 
        /// Find the binding that uses the given item and property, and return
        /// the value appropriate to the current validation step. 
        /// </summary>
        /// <returns>
        /// The method normally returns true and sets 'value' to the requested value.
        /// If the value is not available, the method returns false and sets 'value' 
        /// to DependencyProperty.UnsetValue.
        /// </returns> 
        /// <Remarks> 
        /// This method is intended to be called from a validation rule, during
        /// its Validate method. 
        /// </Remarks>
//        public bool 
        TryGetValue:function(/*object*/ item, /*string*/ propertyName, /*out object value*/valueOut)
        {
            var result = TryGetValueImpl(item, propertyName, /*out value*/valueOut); 

            // TryGetValueImpl sets value to DoNothing to signal "no entry". 
            // TryGetValue should treat this as just another unavailable value. 
            if (valueOut.value == Binding.DoNothing)
            { 
            	valueOut.value = DependencyProperty.UnsetValue;
            }

            return result; 
        },
 
//        bool 
        TryGetValueImpl:function(/*object*/ item, /*string*/ propertyName, /*out object value*/valueOut) 
        {
            var entry = this._getValueTable.Get(item, propertyName); 
            if (entry == null)
            {
                var proposedValueEntry = this._proposedValueTable.Get(item, propertyName);
                if (proposedValueEntry != null) 
                {
                    // return the proposed value (raw or converted, depending on step) 
                    switch (this._validationStep) 
                    {
                        case ValidationStep.RawProposedValue: 
                        	valueOut.value = proposedValueEntry.RawValue;
                            return true;
                        case ValidationStep.ConvertedProposedValue:
                        case ValidationStep.UpdatedValue: 
                        case ValidationStep.CommittedValue:
                        	valueOut.value = proposedValueEntry.ConvertedValue; 
                            return (valueOut.value != DependencyProperty.UnsetValue); 
                    }
                } 

                value = Binding.DoNothing;   // signal "no entry"
                return false;
            } 

            switch (this._validationStep) 
            { 
                case ValidationStep.RawProposedValue:
                case ValidationStep.ConvertedProposedValue: 
                case ValidationStep.UpdatedValue:
                case ValidationStep.CommittedValue:
                	valueOut.value = entry.Value;
                    break; 

                // outside of validation process, use the raw value 
                default: 
                	valueOut.value = entry.BindingExpressionBase.RootBindingExpression.GetRawProposedValue();
                    break; 
            }

            if (valueOut.value == Binding.DoNothing)
            { 
                // a converter has indicated that no value should be written to the source object.
                // Therefore the source's value is the one to return to the validation rule. 
                var bindingExpression = entry.BindingExpressionBase; 
                valueOut.value = bindingExpression.SourceValue;
            } 

            return (valueOut.value != DependencyProperty.UnsetValue);
        },

        // Receive a new inheritance context (this will be a FE/FCE)
//        internal override void 
        AddInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property)
        { 
            var inheritanceContext; 
            var inheritanceContextOut = {
            	"inheritanceContext" : inheritanceContext
            };
            
            this._inheritanceContext.TryGetTarget(/*out inheritanceContext*/inheritanceContextOut);
            inheritanceContext = inheritanceContextOut.inheritanceContext;
            
            
            var hasMultipleInheritanceContextsRef={
        		"hasMultipleInheritanceContexts" : this._hasMultipleInheritanceContexts
        	};
        	
        	var inheritanceContextRef = {
        		"inheritanceContext" : this._inheritanceContext	
        	};
            InheritanceContextHelper.AddInheritanceContext(context,
                                                                  this,
                                                                  /*ref _hasMultipleInheritanceContexts*/hasMultipleInheritanceContextsRef, 
                                                                  /*ref _inheritanceContext*/inheritanceContextRef);
            this._hasMultipleInheritanceContexts =hasMultipleInheritanceContextsRef.hasMultipleInheritanceContexts;
            this._inheritanceContext =inheritanceContextRef.inheritanceContext;    		
            
//            InheritanceContextHelper.AddInheritanceContext(context, 
//                                                              this, 
//                                                              ref _hasMultipleInheritanceContexts,
//                                                              ref inheritanceContext ); 
            this.CheckDetach(inheritanceContext);
            this._inheritanceContext = (inheritanceContext == null) ? NullInheritanceContext : new WeakReference/*<DependencyObject>*/(inheritanceContext);

            // if there's a validation rule that should run on data transfer, schedule it to run 
            if (property == FrameworkElement.BindingGroupProperty &&
                !this._hasMultipleInheritanceContexts && 
                (ValidatesOnDataTransfer || ValidatesOnNotifyDataError)) 
            {
                var layoutElement = Helper.FindMentor(this);
                layoutElement = layoutElement instanceof UIElement ? layoutElement : null; 
                if (layoutElement != null)
                {
                    // do the validation at the end of the current layout pass, to allow
                    // bindings to join the group 
                    layoutElement.LayoutUpdated += new EventHandler(OnLayoutUpdated);
                } 
            } 

        },

        // Remove an inheritance context (this will be a FE/FCE)
//        internal override void 
        RemoveInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property) 
        {
            var inheritanceContext; 
            var inheritanceContextOut = {
            	"inheritanceContext" : inheritanceContext
            };
            
            this._inheritanceContext.TryGetTarget(/*out inheritanceContext*/inheritanceContextOut);
            inheritanceContext = inheritanceContextOut.inheritanceContext;
                                                                  
            var hasMultipleInheritanceContextsRef={
                "hasMultipleInheritanceContexts" : this._hasMultipleInheritanceContexts
            };
        	
            var inheritanceContextRef = {
                "inheritanceContext" : this._inheritanceContext	
            };
            InheritanceContextHelper.AddInheritanceContext(context,
                                                                  this,
                                                                  /*ref _hasMultipleInheritanceContexts*/hasMultipleInheritanceContextsRef, 
                                                                  /*ref _inheritanceContext*/inheritanceContextRef);
            this._hasMultipleInheritanceContexts =hasMultipleInheritanceContextsRef.hasMultipleInheritanceContexts;
            this._inheritanceContext =inheritanceContextRef.inheritanceContext; 
            
            this.CheckDetach(inheritanceContext);
            this._inheritanceContext = (inheritanceContext == null) ? NullInheritanceContext : new WeakReference/*<DependencyObject>*/(inheritanceContext); 
        },
        
        // check whether we've been detached from the owner 
//        void 
        CheckDetach:function(/*DependencyObject*/ newOwner)
        { 
            if (newOwner != null || this._inheritanceContext == NullInheritanceContext) 
                return;
 
            // if so, remove references to this binding group from global tables
            Engine.CommitManager.RemoveBindingGroup(this);
        },

        // called when a leaf binding changes its source item 
//        internal void 
        UpdateTable:function(/*BindingExpression*/ bindingExpression)
        { 
            var newEntry = this._getValueTable.Update(bindingExpression); 

            if (newEntry) 
            {
                // once we get an active binding, we no longer need a proposed
                // value for its source property.
            	this._proposedValueTable.Remove(bindingExpression); 
            }
 
            this.IsItemsValid = false; 
        },
 
        // add an entry to the value table for the given binding
//        internal void 
        AddToValueTable:function(/*BindingExpressionBase*/ bindingExpressionBase)
        {
        	this._getValueTable.EnsureEntry(bindingExpressionBase); 
        },
 
        // get the value for the given binding 
//        internal object 
        GetValue:function(/*BindingExpressionBase*/ bindingExpressionBase)
        { 
            return this._getValueTable.GetValue(bindingExpressionBase);
        },

        // set the value for the given binding 
//        internal void 
        SetValue:function(/*BindingExpressionBase*/ bindingExpressionBase, /*object*/ value)
        { 
        	this._getValueTable.SetValue(bindingExpressionBase, value); 
        },
 
        // set values to "source" for all bindings under the given root
//        internal void 
        UseSourceValue:function(/*BindingExpressionBase*/ bindingExpressionBase)
        {
            this._getValueTable.UseSourceValue(bindingExpressionBase); 
        },
 
        // get the proposed value for the given <item, propertyName> 
//        internal ProposedValueEntry 
        GetProposedValueEntry:function(/*object*/ item, /*string*/ propertyName)
        { 
            return this._proposedValueTable.Get(item, propertyName);
        },

        // remove a proposed value entry 
//        internal void 
        RemoveProposedValueEntry:function(/*ProposedValueEntry*/ entry)
        { 
        	this._proposedValueTable.Remove(entry); 
        },
 
        // add a dependent on a proposed value
//        internal void 
        AddBindingForProposedValue:function(/*BindingExpressionBase*/ dependent, /*object*/ item, /*string*/ propertyName)
        {
            var entry = this._proposedValueTable.Get(item, propertyName); 
            if (entry != null)
            { 
                entry.AddDependent(dependent); 
            }
        }, 

        // add a validation error to the mentor's list
//        internal void 
        AddValidationError:function(/*ValidationError*/ validationError)
        { 
            var mentor = Helper.FindMentor(this);
            if (mentor == null) 
                return; 

            Validation.AddValidationError(validationError, mentor, this.NotifyOnValidationError); 
        },

        // remove a validation error from the mentor's list
//        internal void 
        RemoveValidationError:function(/*ValidationError*/ validationError) 
        {
            var mentor = Helper.FindMentor(this); 
            if (mentor == null) 
                return;
 
            Validation.RemoveValidationError(validationError, mentor, this.NotifyOnValidationError);
        },

        // remove all errors raised at the given step, in preparation for running 
        // the rules at that step
//        void 
        ClearValidationErrors:function(/*ValidationStep*/ validationStep) 
        { 
            this.ClearValidationErrorsImpl(validationStep, false);
        }, 

        // remove all errors affiliated with the BindingGroup
//        void 
        ClearValidationErrors:function()
        { 
            this.ClearValidationErrorsImpl(ValidationStep.RawProposedValue, true);
        }, 
 
        // remove validation errors - the real work
//        void 
        ClearValidationErrorsImpl:function(/*ValidationStep*/ validationStep, /*bool*/ allSteps) 
        {
            var mentor = Helper.FindMentor(this);
            if (mentor == null)
                return; 

            var validationErrors = Validation.GetErrorsInternal(mentor); 
            if (validationErrors == null) 
                return;
 
            for (var i=validationErrors.Count-1; i>=0; --i)
            {
                var validationError = validationErrors.Get(i);
                if (allSteps || validationError.RuleInError.ValidationStep == validationStep) 
                {
                    if (validationError.BindingInError == this || 
                    		this._proposedValueTable.HasValidationError(validationError)) 
                    {
                    	this.RemoveValidationError(validationError); 
                    }
                }
            }
        }, 
 
        // rebuild the Items collection, if necessary 
//        void 
        EnsureItems:function()
        { 
            if (this.IsItemsValid)
                return;

            // find the new set of items 
            var newItems = new Collection/*<WeakReference>*/();
 
            // always include the DataContext item.  This is necessary for 
            // scenarios when there is an item-level validation rule (e.g. DataError)
            // but no edits pending on the item and no two-way bindings.  This 
            // arises in DataGrid.
            var mentor = Helper.FindMentor(this);
            if (mentor != null)
            { 
                var dataContextItem = mentor.GetValue(FrameworkElement.DataContextProperty);
                if (dataContextItem != null && 
                    dataContextItem != CollectionView.NewItemPlaceholder && 
                    dataContextItem != BindingExpressionBase.DisconnectedItem)
                { 
                    var itemReference = this._itemsRW.Count > 0 ? _itemsRW[0] : null;
                    // 90% case:  the first entry in _itemsRW already points to the item,
                    // so just re-use it.  Otherwise create a new reference.
                    if (itemReference == null || 
                        !Object.Equals(dataContextItem, itemReference.Target))
                    { 
                        itemReference = new WeakReference(dataContextItem); 
                    }
 
                    newItems.Add(itemReference);
                }
            }
 
            // include items from active two-way bindings and from proposed values
            this._getValueTable.AddUniqueItems(newItems); 
            this._proposedValueTable.AddUniqueItems(newItems); 

            // modify the Items collection to match the new set 
            // First, remove items that no longer appear
            /*INotifyDataErrorInfo*/var indei;
            for (var i=_itemsRW.Count-1;  i >= 0;  --i)
            { 
                var index = FindIndexOf(this._itemsRW.Get(i), newItems);
                if (index >= 0) 
                {   // common item, don't add it later 
                    newItems.RemoveAt(index);
                } 
                else
                {   // item no longer appears, remove it now
                    if (ValidatesOnNotifyDataError)
                    { 
                        indei = this._itemsRW.Get(i).Target;
                        indei = indei instanceof INotifyDataErrorInfo ? indei : null;
                        if (indei != null) 
                            ErrorsChangedEventManager.RemoveHandler(indei, OnErrorsChanged); 
                    }
 
                    this._itemsRW.RemoveAt(i);
                }
            }
 
            // then add items that are really new
            for (var i=newItems.Count-1;  i>=0;  --i) 
            { 
                this._itemsRW.Add(newItems.Get(i));
 
                // the new item may need BeginEdit
                if (IsEditing)
                {
                    var ieo = newItems.Get(i).Target;
                    ieo = ieo instanceof IEditableObject ? ieo : null; 
                    if (ieo != null)
                    { 
                        ieo.BeginEdit(); 
                    }
                } 

                // the item may implement INotifyDataErrorInfo
                if (this.ValidatesOnNotifyDataError)
                { 
                    indei = newItems.Get(i).Target;
                    indei = indei instanceof INotifyDataErrorInfo ? indei : null;
                    if (indei != null) 
                    { 
                        ErrorsChangedEventManager.AddHandler(indei, OnErrorsChanged);
                        this.UpdateNotifyDataErrors(indei, newItems[i]); 
                    }
                }
            }
 
            this.IsItemsValid = true;
        },
     // at the first LayoutUpdated event, set up the data-transfer validation process
//        private void 
        OnLayoutUpdated:function(/*object*/ sender, /*EventArgs*/ e) 
        {
            /*DependencyObject*/var mentor = Helper.FindMentor(this);

            // only do this once 
            var layoutElement = mentor instanceof UIElement ? mentor : null;
            if (layoutElement != null) 
            { 
                layoutElement.LayoutUpdated -= new EventHandler(OnLayoutUpdated);
            } 

            // do the validation every time the DataContext changes
            var fe;
            var fce; 
            var feOut = {
            	"fe" : fe
            };
            
            var fceOut = {
            	"fce" : fce
            };           
            Helper.DowncastToFEorFCE(mentor, /*out fe*/feOut, /*out fce*/fceOut, false);
            fe = feOut.fe;
            fce= fceOut.fce;
            if (fe != null) 
            { 
                fe.DataContextChanged += new DependencyPropertyChangedEventHandler(OnDataContextChanged);
            } 
            else if (fce != null)
            {
                fce.DataContextChanged += new DependencyPropertyChangedEventHandler(OnDataContextChanged);
            } 

            // do the initial validation 
            this.ValidateOnDataTransfer(); 
        },
 
//        void 
        OnDataContextChanged:function(/*object*/ sender, /*DependencyPropertyChangedEventArgs*/ e)
        {
            if (e.NewValue == BindingExpressionBase.DisconnectedItem)
                return; 

            this.IsItemsValid = false; 
            this.ValidateOnDataTransfer(); 
        },
 
        // run the data-transfer validation rules
//        void 
        ValidateOnDataTransfer:function()
        {
            if (!this.ValidatesOnDataTransfer) 
                return;
            /*DependencyObject*/var mentor = Helper.FindMentor(this); 
            if (mentor == null || this.ValidationRules.Count == 0) 
                return;
 
            // get the current validation errors associated with the rules to be run.
            // Eventually we will remove these.
            /*Collection<ValidationError>*/var oldErrors;
            if (!Validation.GetHasError(mentor)) 
            {
                // usually there aren't any errors at all 
                oldErrors = null; 
            }
            else 
            {
                // pick out the errors that come from data-transfer rules associated with this BindingGroup
                oldErrors = new Collection/*<ValidationError>*/();
                /*ReadOnlyCollection<ValidationError>*/var errors = Validation.GetErrors(mentor); 
                for (var i=0, n=errors.Count; i<n; ++i)
                { 
                    var error = errors.Get(i); 
                    if (error.RuleInError.ValidatesOnTargetUpdated && error.BindingInError == this)
                    { 
                        oldErrors.Add(error);
                    }
                }
            } 

            // run the data-transfer rules, accumulate new errors 
            var culture = GetCulture(); 
            for (var i=0, n=ValidationRules.Count; i<n; ++i)
            { 
                var rule = this.ValidationRules.Get(i);
                if (rule.ValidatesOnTargetUpdated)
                {
                    try 
                    {
                        var validationResult = rule.Validate(DependencyProperty.UnsetValue, culture, this); 
                        if (!validationResult.IsValid) 
                        {
                        	this.AddValidationError(new ValidationError(rule, this, validationResult.ErrorContent, null)); 
                        }
                    }
                    catch (/*ValueUnavailableException*/ vue)
                    { 
                    	this.AddValidationError(new ValidationError(rule, this, vue.Message, vue));
                    } 
                } 
            }
 
            // remove the old errors (do this last to avoid passing through a transient
            // "no error" state)
            if (oldErrors != null)
            { 
                for (var i=0, n=oldErrors.Count; i<n; ++i)
                { 
                	this.RemoveValidationError(oldErrors.Get(i)); 
                }
            } 
        },

        // run the validation process up to the indicated step
//        bool 
        UpdateAndValidate:function(/*ValidationStep*/ validationStep) 
        {
            // if the group is attached to a container tied to the 
            // NewItemPlaceholder, don't do anything.  Bindings and validation 
            // rules aren't usually relevant in this case.
            var mentor = Helper.FindMentor(this); 
            if (mentor != null &&
                mentor.GetValue(FrameworkElement.DataContextProperty) == CollectionView.NewItemPlaceholder)
            {
                return true; 
            }
 
            this.PrepareProposedValuesForUpdate(mentor, (validationStep >= ValidationStep.UpdatedValue)); 

            var result = true; 

            for (this._validationStep = ValidationStep.RawProposedValue;
            	this._validationStep <= validationStep && result;
                    ++ this._validationStep) 
            {
                switch (this._validationStep) 
                { 
                    case ValidationStep.RawProposedValue:
                    	this._getValueTable.ResetValues(); 
                        break;
                    case ValidationStep.ConvertedProposedValue:
                        result = this.ObtainConvertedProposedValues();
                        break; 
                    case ValidationStep.UpdatedValue:
                        result = this.UpdateValues(); 
                        break; 
                    case ValidationStep.CommittedValue:
                        result = this.CommitValues(); 
                        break;
                }

                if (!this.CheckValidationRules()) 
                {
                    result = false; 
                } 
            }
 
            this.ResetProposedValuesAfterUpdate(mentor, result && validationStep == ValidationStep.CommittedValue);

            this._validationStep = (-1);
            this._getValueTable.ResetValues(); 

            this.NotifyCommitManager(); 
 
            return result;
        },

        // update the item-level validation errors arising from INotifyDataErrorInfo items
//        void 
        UpdateNotifyDataErrors:function(/*INotifyDataErrorInfo*/ indei, /*WeakReference*/ itemWR)
        { 
            // get the key for the item (its WeakReference from _itemsRW)
            if (itemWR == null) 
            { 
                var index = this.FindIndexOf(indei, this._itemsRW);
                if (index < 0) 
                    return;     // ignore events from items we no longer own
                itemWR = this._itemsRW.Get(index);
            }
 
            // fetch the errors from the item
            /*List<object>*/var errors; 
            try 
            {
                errors = BindingExpression.GetDataErrors(indei, String.Empty); 
            }
            catch (/*Exception*/ ex)
            {
                // if there are non-critical exceptions, leave the previous errors intact 
                if (CriticalExceptions.IsCriticalApplicationException(ex))
                    throw ex; 
                return; 
            }
 
            this.UpdateNotifyDataErrorValidationErrors(itemWR, errors);
        },

        // replace the validation errors for the given item with a set that matches the errors list 
//        void 
        UpdateNotifyDataErrorValidationErrors:function(/*WeakReference*/ itemWR, /*List<object>*/ errors)
        { 
            // get the previous errors for this item 
            /*List<ValidationError>*/var itemErrors;
            var itemErrorsOut ={
            	"itemErrors" : itemErrors
            };
            
            var r = this._notifyDataErrors.TryGetValue(itemWR, /*out itemErrors*/itemErrorsOut);
            itemErrors = itemErrorsOut.itemErrors;
            if (!this._notifyDataErrors.TryGetValue(itemWR, /*out itemErrors*/itemErrorsOut)) 
                itemErrors = null;

            /*List<object>*/var toAdd;
            /*List<ValidationError>*/var toRemove; 
            
            var toRemoveOut = {
            	"toRemove" : toRemove
            };
            
            var toAddOut = {
            	"toAdd" : toAdd
            };

            BindingExpressionBase.GetValidationDelta(itemErrors, errors, /*out toAdd*/toAddOut, /*out toRemove*/toRemoveOut);
            toAdd = toAddOut.toAdd;
            toRemove = toRemoveOut.toRemove;
 
            // add the new errors, then remove the old ones - this avoid a transient
            // "no error" state 
            if (toAdd != null && toAdd.Count > 0)
            {
                var rule = NotifyDataErrorValidationRule.Instance;
 
                if (itemErrors == null)
                    itemErrors = new List/*<ValidationError>*/(); 
 
                for/*each*/ (var i=0 ; i<toAdd.Count ; i++) //object o in toAdd)
                { 
                	var o = toAdd.Get(i);
                    var veAdd = new ValidationError(rule, this, o, null);
                    itemErrors.Add(veAdd);
                    this.AddValidationError(veAdd);
                } 
            }
 
            if (toRemove != null && toRemove.Count > 0) 
            {
                for/*each*/ (var i=0; i<toRemove.Count ; i++) //ValidationError veRemove in toRemove) 
                {
                	var veRemove = toRemove.Get(i)
                    itemErrors.Remove(veRemove);
                    this.RemoveValidationError(veRemove);
                } 

                if (itemErrors.Count == 0) 
                    itemErrors = null; 
            }
 
            // update the cached list of errors for this item
            if (itemErrors == null)
            {
            	this._notifyDataErrors.Remove(itemWR); 
            }
            else 
            { 
            	this._notifyDataErrors.Set(itemWR, itemErrors);
            } 
        },

        // apply conversions to each binding in the group
//        bool 
        ObtainConvertedProposedValues:function() 
        {
            var result = true; 
            for (var i=this._bindingExpressions.Count-1; i>=0; --i) 
            {
                result = this._bindingExpressions.Get(i).ObtainConvertedProposedValue(this) && result; 
            }

            return result;
        }, 

        // update the source value of each binding in the group 
//        bool 
        UpdateValues:function() 
        {
            var result = true; 

            for (var i=this._bindingExpressions.Count-1; i>=0; --i)
            {
                result = this._bindingExpressions.Get(i).UpdateSource(this) && result; 
            }
 
            if (this._proposedValueBindingExpressions != null) 
            {
                for (var i=this._proposedValueBindingExpressions.length-1; i>=0; --i) 
                {
                    var bindExpr = this._proposedValueBindingExpressions.Get(i);
                    var proposedValueEntry = this._proposedValueTable[bindExpr];
                    result = (bindExpr.UpdateSource(proposedValueEntry.ConvertedValue) != DependencyProperty.UnsetValue) 
                                && result;
                } 
            } 

            return result; 
        },

        // check the validation rules for the current step
//        bool 
        CheckValidationRules:function() 
        {
            var result = true; 
 
            // clear old errors arising from this step
            this.ClearValidationErrors(this._validationStep); 

            // check rules attached to the bindings
            for (var i=this._bindingExpressions.Count-1; i>=0; --i)
            { 
                if (!this._bindingExpressions.Get(i).CheckValidationRules(this, this._validationStep))
                { 
                    result = false; 
                }
            } 

            // include the bindings for proposed values, for the last two steps
            if (this._validationStep >= ValidationStep.UpdatedValue &&
            		this._proposedValueBindingExpressions != null) 
            {
                for (var i=this._proposedValueBindingExpressions.length-1; i>=0; --i) 
                { 
                    if (!this._proposedValueBindingExpressions.Get(i).CheckValidationRules(this, this._validationStep))
                    { 
                        result = false;
                    }
                }
            } 

            // check rules attached to the binding group 
            var culture = this.GetCulture(); 
            for (var i=0, n=this._validationRules.Count; i<n; ++i)
            { 
                var rule = this._validationRules.Get(i);
                if (rule.ValidationStep == this._validationStep)
                {
                    try 
                    {
                        var validationResult = rule.Validate(DependencyProperty.UnsetValue, culture, this); 
                        if (!validationResult.IsValid) 
                        {
                        	this.AddValidationError(new ValidationError(rule, this, validationResult.ErrorContent, null)); 
                            result = false;
                        }
                    }
                    catch (/*ValueUnavailableException*/ vue) 
                    {
                    	this. AddValidationError(new ValidationError(rule, this, vue.Message, vue)); 
                        result = false; 
                    }
                } 
            }

            return result;
        },

        // commit all the source values 
//        bool 
        CommitValues:function() 
        {
            var result = true; 
            var items = this.Items;
            for (var i=items.Count-1; i>=0; --i)
            {
                var ieo = items.Get(i);
                ieo = ieo instanceof IEditableObject ? ieo : null; 
                if (ieo != null)
                { 
                    // PreSharp uses message numbers that the C# compiler doesn't know about. 
                    // Disable the C# complaints, per the PreSharp documentation.
                    // PreSharp complains about catching NullReference (and other) exceptions.
                    // It doesn't recognize that IsCritical[Application]Exception() handles these correctly.
                    try 
                    { 
                        ieo.EndEdit();
                    } 
                    catch (/*Exception*/ ex)
                    {
                        if (CriticalExceptions.IsCriticalApplicationException(ex))
                            throw ed; 

                        var error = new ValidationError(ExceptionValidationRule.Instance, this, ex.Message, ex); 
                        this.AddValidationError(error); 
                        result = false;
                    } 
                } 
            }
            return result; 
        }, 
 
        // get the culture of the binding group's mentor
//        CultureInfo 
        GetCulture:function() 
        { 
            if (this._culture == null)
            { 
                var mentor = Helper.FindMentor(this);
                if (mentor != null)
                {
                	this._culture = ( mentor.GetValue(FrameworkElement.LanguageProperty)).GetSpecificCulture(); 
                }
            } 
 
            return this._culture;
        }, 

        // handle changes to the collection of binding expressions
//        void 
        OnBindingsChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        { 
            var bindingExpr;
 
            switch (e.Action) 
            {
                case NotifyCollectionChangedAction.Add: 
                    bindingExpr = e.NewItems.Get(0);
                    bindingExpr = bindingExpr instanceof BindingExpressionBase ? bindingExpr : null;
                    bindingExpr.JoinBindingGroup(this, /*explicit*/ true);
                    break;
                case NotifyCollectionChangedAction.Remove: 
                    bindingExpr = e.OldItems.Get(0);
                    bindingExpr = bindingExpr instanceof BindingExpressionBase ? bindingExpr : null;
                    this.RemoveBindingExpression(bindingExpr); 
                    break; 
                case NotifyCollectionChangedAction.Move:
                    break;  // nothing to do - order within the collection doesn't matter 
                case NotifyCollectionChangedAction.Replace:
                    bindingExpr = e.OldItems.Get(0);
                    bindingExpr = bindingExpr instanceof BindingExpressionBase ? bindingExpr : null;
                    this.RemoveBindingExpression(bindingExpr);
                    bindingExpr = e.NewItems.Get(0);
                    bindingExpr = bindingExpr instanceof BindingExpressionBase ? bindingExpr : null; 
                    bindingExpr.JoinBindingGroup(this, /*explicit*/ true);
                    break; 
                case NotifyCollectionChangedAction.Reset: 
                    // the only way this collection can raise Reset is due to Clear()
//                    Debug.Assert(_bindingExpressions.Count == 0, "Unexpected Reset event"); 
                    this.RemoveAllBindingExpressions();
                    break;  // nothing to do - order within the collection doesn't matter
                default:
//                    Debug.Assert(false, "Unexpected change event"); 
                    break;
            } 
 
            this.IsItemsValid = false;      // all changes potentially affect Items
        }, 

        // explicitly remove a binding expression from the group
//        void 
        RemoveBindingExpression:function(/*BindingExpressionBase*/ exprBase)
        { 
            // we actually remove all expressions belonging to the same root
            var root = exprBase.RootBindingExpression; 
 
            // preserve proposed values
            if (this.SharesProposedValues && root.NeedsValidation) 
            {
                var proposedValues;
                var proposedValuesOut = {
                	"proposedValues" : proposedValues
                };
                
                root.ValidateAndConvertProposedValue(/*out proposedValues*/proposedValuesOut);
                proposedValues = proposedValuesOut.proposedValues;
                PreserveProposedValues(proposedValues); 
            }
 
            // remove the binding expressions from the value table 
            var list = this._getValueTable.RemoveRootBinding(root);
 
            // tell each expression it is leaving the group
            for/*each*/ (var i=0; i<list.Count; i++) // BindingExpressionBase expr in list)
            {
            	var expr = list.Get(i);
                expr.OnBindingGroupChanged(/*joining*/ false); 

                // also remove the expression from our collection.  Normally this is 
                // a no-op, as we only get here after the expression has been removed, 
                // and implicit membership only adds root expressions to the collection.
                // But an app (through confusion or malice) could explicitly add two 
                // or more expressions with the same root.  We handle that case here.
                this._bindingExpressions.Remove(expr);
            }
 
            // cut the root's link to the group
            root.LeaveBindingGroup(); 
        }, 

        // remove all binding expressions from the group 
//        void 
        RemoveAllBindingExpressions:function()
        {
            // we can't use the BindingExpressions collection - it has already
            // been cleared.  Instead, find the expressions that need work by 
            // looking in the GetValue table.
            var entry; 
            while ((entry = this._getValueTable.GetFirstEntry()) != null) 
            {
            	this.RemoveBindingExpression(entry.BindingExpressionBase); 
            }
        },

        // preserve proposed values 
//        void 
        PreserveProposedValues:function(/*Collection<BindingExpressionBase.ProposedValue>*/ proposedValues)
        { 
            if (proposedValues == null) 
                return;
 
            for (var i=0, n=proposedValues.Count; i<n; ++i)
            {
                this._proposedValueTable.Add(proposedValues.Get(i));
            } 
        },
 
        // before beginning a validate/update pass, enable the proposed values 
        // to participate
//        void 
        PrepareProposedValuesForUpdate:function(/*DependencyObject*/ mentor, /*bool*/ isUpdating) 
        {
            var count = _proposedValueTable.Count;
            if (count == 0)
                return; 

            if (isUpdating) 
            { 
                // create a shadow binding for each proposed value
            	this._proposedValueBindingExpressions = new BindingExpression[count]; 
                for (var i=0; i<count; ++i)
                {
                    var entry = this._proposedValueTable[i];
                    var originalBinding = entry.Binding; 

                    var binding = new Binding(); 
                    binding.Source = entry.Item; 
                    binding.Mode = BindingMode.TwoWay;
                    binding.Path = new PropertyPath(entry.PropertyName, originalBinding.Path.PathParameters); 

                    binding.ValidatesOnDataErrors = originalBinding.ValidatesOnDataErrors;
                    binding.ValidatesOnNotifyDataErrors = originalBinding.ValidatesOnNotifyDataErrors;
                    binding.ValidatesOnExceptions = originalBinding.ValidatesOnExceptions; 

                    var rules = originalBinding.ValidationRulesInternal; 
                    if (rules != null) 
                    {
                        for (var j=0, n=rules.Count; j<n; ++j) 
                        {
                            binding.ValidationRules.Add(rules[j]);
                        }
                    } 

                    var bindExpr = BindingExpression.CreateUntargetedBindingExpression(mentor, binding); 
                    bindExpr.Attach(mentor); 
                    bindExpr.NeedsUpdate = true;
 
                    this._proposedValueBindingExpressions.Set(i, bindExpr);
                }
            }
        }, 

        // after a validate/update pass, reset the proposed values and related state 
//        void 
        ResetProposedValuesAfterUpdate:function(/*DependencyObject*/ mentor, /*bool*/ isFullUpdate) 
        {
            if (this._proposedValueBindingExpressions != null) 
            {
                for (var i=0, n=this._proposedValueBindingExpressions.length; i<n; ++i)
                {
                    var bindExpr = this._proposedValueBindingExpressions[i]; 
                    var validationError = bindExpr.ValidationError;
 
                    bindExpr.Detach(); 

                    // reattach the validation error (Detach removes it) 
                    if (validationError != null)
                    {
                        // reassign error's owner to this BindingGroup
                        var newError = new ValidationError( 
                                        validationError.RuleInError,
                                        this,   /* bindingInError */ 
                                        validationError.ErrorContent, 
                                        validationError.Exception);
                        this.AddValidationError(newError); 
                    }
                }

                this._proposedValueBindingExpressions = null; 
            }
 
            if (isFullUpdate) 
            {
            	this._proposedValueTable.Clear(); 
            }
        },

//        void 
        NotifyCommitManager:function() 
        {
            if (Engine.IsShutDown) 
                return; 

            var shouldStore = Owner != null && (IsDirty || HasValidationError); 

            if (shouldStore)
            {
                Engine.CommitManager.AddBindingGroup(this); 
            }
            else 
            { 
                Engine.CommitManager.RemoveBindingGroup(this);
            } 
        },
 
//        void 
        OnErrorsChanged:function(/*object*/ sender, /*DataErrorsChangedEventArgs*/ e)
        { 
            // if notification was on the right thread, just do the work (normal case)
//            if (Dispatcher.Thread == Thread.CurrentThread)
//            {
                this.UpdateNotifyDataErrors(/*(INotifyDataErrorInfo)*/sender, null); 
//            }
//            else 
//            { 
//                // otherwise invoke an operation to do the work on the right context
//                Engine.Marshal( 
//                    (arg) => {  UpdateNotifyDataErrors((INotifyDataErrorInfo)arg, null);
//                                 return null; }, sender);
//            }
        }
	});
	
	Object.defineProperties(BindingGroup.prototype,{
	      /// <summary>
        /// The DependencyObject that owns this BindingGroup 
        /// </summary>
//        public DependencyObject 
		Owner: 
        { 
            get:function() { return this.InheritanceContext; }
        },

        /// <summary>
        /// The validation rules belonging to a BindingGroup are run during the
        /// process of updating the source values of the bindings.  Each rule 
        /// indicates where in that process it should run.
        /// </summary> 
//        public Collection<ValidationRule> 
        ValidationRules: 
        {
            get:function() { return this._validationRules; } 
        },

        /// <summary>
        /// The collection of binding expressions belonging to this BindingGroup. 
        /// </summary>
//        public Collection<BindingExpressionBase> 
        BindingExpressions: 
        { 
            get:function() { return this._bindingExpressions; }
        }, 

        /// <summary>
        /// The name of this BindingGroup.  A binding can elect to join this group
        /// by declaring its BindingGroupName to match the name of the group. 
        /// </summary>
//        public string 
        Name: 
        { 
            get:function() { return this._name; },
            set:function(value) { this._name = value; } 
        },

        /// <summary>
        /// When NotifyOnValidationError is set to True, the binding group will 
        /// raise a Validation.ValidationError event when its validation state changes.
        /// </summary> 
//        public bool 
        NotifyOnValidationError: 
        {
            get:function() { return this._notifyOnValidationError; }, 
            set:function(value) { this._notifyOnValidationError = value; }
        },

        /// <summary> 
        /// When ValidatesOnNotifyDataError is true, the binding group will listen
        /// to the ErrorsChanged event on each item that implements INotifyDataErrorInfo 
        /// and report entity-level validation errors. 
        /// </summary>
//        public bool 
        ValidatesOnNotifyDataError: 
        {
            get:function() { return this._validatesOnNotifyDataError; },
            set:function(value) { this._validatesOnNotifyDataError = value; }
        }, 

        /// <summary> 
        /// Enables (or disables) the sharing of proposed values. 
        /// </summary>
        /// <remarks> 
        /// Some UI designs edit multiple properties of a given data item using two
        /// templates for each property - a "display template" that shows the current
        /// proposed value in non-editable controls, and an "editing template" that
        /// holds the proposed value in editable controls and allows the user to edit 
        /// the value.  As the user moves from one property to another, the templates
        /// are swapped so that the first property uses its display template while the 
        /// second uses its editing template.  The proposed value in the first property's 
        /// departing editing template should be preserved ("shared") so that (a) it
        /// can be displayed in the arriving display template, and (b) it can be 
        /// eventually written out to the data item at CommitEdit time.  The BindingGroup
        /// will implement this when SharesProposedValues is true.
        /// </remarks>
//        public bool 
        SharesProposedValues: 
        {
            get:function() { return this._sharesProposedValues; }, 
            set:function(value) 
            {
                if (this._sharesProposedValues != value) 
                {
                	this._proposedValueTable.Clear();
                	this._sharesProposedValues = value;
                } 
            }
        }, 
 
        /// <summary>
        /// CanRestoreValues returns True if the binding group can restore 
        /// each of its sources (during <see cref="CancelEdit"/>) to the state
        /// they had at the time of the most recent <see cref="BeginEdit"/>.
        /// This depends on whether the current sources provide a suitable
        /// mechanism to implement the rollback, such as <seealso cref="IEditableObject"/>. 
        /// </summary>
//        public bool 
        CanRestoreValues:
        { 
            get:function()
            { 
                var items = this.Items;
                for (var i=items.Count-1; i>=0; --i)
                {
                    if (!(items.Get(i) instanceof IEditableObject ? items.Get(i) : null)) 
                    {
                        return false; 
                    } 
                }
 
                return true;
            }
        },
 
        /// <summary>
        /// The collection of items used as sources in the bindings owned by 
        /// this BindingGroup.  Each item appears only once, even if it is used 
        /// by several bindings.
        /// </summary> 
        /// <remarks>
        /// The Items property returns a snapshot collection, reflecting the state
        /// of the BindingGroup at the time of the call.  As bindings in the group
        /// change to use different source items, the changes are not immediately 
        /// visible in the collection.  They become visible only when the property is
        /// queried again. 
        /// </remarks> 
//        public IList 
        Items:
        { 
            get:function()
            {
            	this.EnsureItems();
                return this._items; 
            }
        }, 
 
        /// <summary>
        /// Return true if the BindingGroup has proposed values that have not yet 
        /// been written to their respective source properties.
        /// </summary>
//        public bool 
        IsDirty:
        { 
            get:function()
            { 
                if (this._proposedValueTable.Count > 0) 
                    return true;
 
                for/*each*/ (var i =0 ;i<this._bindingExpressions.Count; i++) //BindingExpressionBase bb in _bindingExpressions)
                {
                	var bb =this._bindingExpressions.Get(i);
                    if (bb.IsDirty)
                        return true; 
                }
 
                return false; 
            }
        }, 

        /// <summary>
        /// Return true if the BindingGroup has any validation errors.
        /// </summary> 
//        public bool 
        HasValidationError:
        { 
            get:function() 
            {
                /*ValidationErrorCollection*/var superset; 
                var isPure;
                return GetValidationErrors(/*out superset*/{"superset" : superset}, /*out isPure*/{"isPure" : isPure});
            }
        }, 

        /// <summary> 
        ///     ValidationErrors returns the validation errors currently 
        ///     arising from this binding group, or null if there are no errors.
        /// </summary> 
//        public ReadOnlyCollection<ValidationError> 
        ValidationErrors:
        {
            get:function()
            { 
                /*ValidationErrorCollection*/var superset;
                var isPure; 
                var supersetOut = {
                	"superset" : superset
                };
                
                var isPureOut = {
                	"isPure" : isPure
                };
                
                if (GetValidationErrors(/*out superset*/supersetOut, /*out isPure*/isPureOut)) 
                {
                	isPure = isPureOut.isPure;
                	superset = supersetOut.superset;
                	
                    if (isPure) 
                        return new ReadOnlyCollection/*<ValidationError>*/(superset);

                    // 1% case - the validation errors attached to the mentor include
                    // some that don't belong to this binding group.   Filter them out. 
                    var errors = new List/*<ValidationError>*/();
                    for/*each*/ (var i = 0; i <superset.Count; i++) //ValidationError error in superset) 
                    { 
                    	var error = superset.Get(i);
                        if (this.Belongs(error))
                        { 
                            errors.Add(error);
                        }
                    }
 
                    return new ReadOnlyCollection/*<ValidationError>*/(errors);
                } 
 
                return null;
            } 
        },
        
//        DataBindEngine 
        Engine: { get:function() { return this._engine; } },
        
        // Define the DO's inheritance context 
//        internal override DependencyObject 
        InheritanceContext: 
        {
            get:function() 
            {
                var inheritanceContext;
                var inheritanceContextOut = {
                	"inheritanceContext" : inheritanceContext
                };
                var r = this._inheritanceContext.TryGetTarget(/*out inheritanceContext*/inheritanceContextOut);
                inheritanceContext = inheritanceContextOut.inheritanceContext;
                if (!r)
                { 
                    this.CheckDetach(inheritanceContext);
                } 
                return inheritanceContext; 
            }
        }, 
 
        // Says if the current instance has multiple InheritanceContexts 
//        internal override bool 
        HasMultipleInheritanceContexts:
        { 
            get:function() { return this._hasMultipleInheritanceContexts; }
        },
        
//        bool 
        IsEditing: { get:function(){return this._IsEditing;}, set:function(value){this._IsEditing = value;} },
        
//        bool 
        IsItemsValid: 
        {
            get:function() { return this._isItemsValid; },
            set:function(value)
            {
            	this._isItemsValid = value;
                if (!value && (this.IsEditing || this.ValidatesOnNotifyDataError)) 
                {
                    // re-evaluate items, in case new items need BeginEdit or INDEI listener 
                	this.EnsureItems(); 
                }
            } 
        },
        
        // true if there is a validation rule that runs on data transfer
//        bool 
        ValidatesOnDataTransfer: 
        {
            get:function()
            {
                if (this.ValidationRules != null) 
                {
                    for (var i=ValidationRules.Count-1; i>=0; --i) 
                    { 
                        if (this.ValidationRules.Get(i).ValidatesOnTargetUpdated)
                            return true; 
                    }
                }

                return false; 
            }
        }
        
	});
	
	Object.defineProperties(BindingGroup,{

	});
	

    // find the index of an item in a list, where both the item and 
    // the list use WeakReferences
//    static int 
	BindingGroup.FindIndexOf = function(/*WeakReference*/ wr, /*IList<WeakReference>*/ list)
    {
        var item = wr.Target; 
        if (item == null)
            return -1; 
        return this.FindIndexOf(item, list); 
    }

//    static int 
	BindingGroup.FindIndexOf = function(/*object*/ item, /*IList<WeakReference>*/ list)
    {
        for (var i=0, n=list.Count; i<n; ++i)
        { 
            if (Object.Equals(item, list.Get(i).Target))
            { 
                return i; 
            }
        } 

        return -1;
    }
	
	BindingGroup.Type = new Type("BindingGroup", BindingGroup, [DependencyObject.Type]);
	return BindingGroup;
});


 
         
 
//        ValidationRuleCollection    _validationRules; 
//        string                      _name;
//        bool                        _notifyOnValidationError; 
//        bool                        _sharesProposedValues;
//        bool                        _validatesOnNotifyDataError = true;
//
//        DataBindEngine              _engine; 
//        BindingExpressionCollection _bindingExpressions;
//        bool                        _isItemsValid; 
//        ValidationStep              _validationStep = (ValidationStep)(-1); 
//        GetValueTable               _getValueTable = new GetValueTable();
//        ProposedValueTable          _proposedValueTable = new ProposedValueTable(); 
//        BindingExpression[]         _proposedValueBindingExpressions;
//        Collection<WeakReference>   _itemsRW;
//        WeakReadOnlyCollection<object> _items;
//        CultureInfo                 _culture; 
//        Dictionary<WeakReference, List<ValidationError>> _notifyDataErrors = new Dictionary<WeakReference, List<ValidationError>>();
// 
//        internal static readonly object DeferredTargetValue = new NamedObject("DeferredTargetValue"); 
//        internal static readonly object DeferredSourceValue = new NamedObject("DeferredSourceValue");
// 
//        // Fields to implement DO's inheritance context
//        static WeakReference<DependencyObject> NullInheritanceContext = new WeakReference<DependencyObject>(null);
//        WeakReference<DependencyObject> _inheritanceContext = NullInheritanceContext;
//        bool                            _hasMultipleInheritanceContexts; 
 
     

