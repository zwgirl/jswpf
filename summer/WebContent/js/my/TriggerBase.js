/**
 * TriggerBase
 */

define(["dojo/_base/declare", "system/Type",
        "windows/DependencyObject", "windows/DependencyProperty", "windows/FrameworkElement",
        "windows/TriggerCondition", "windows/PropertyValue", "windows/PropertyValueType"], 
        function(declare, Type,
        		DependencyObject, DependencyProperty, FrameworkElement,
        		TriggerCondition, PropertyValue, PropertyValueType){
	var TriggerBase = declare(DependencyObject, {
		constructor:function(){
	        // Conditions 
//	        TriggerCondition[] 
	        this._triggerConditions = null;

	        // Fields to implement DO's inheritance context
//	        private DependencyObject 
	        this._inheritanceContext = null; 
//	        private bool 
	        this._hasMultipleInheritanceContexts = false;
	 
	        // Fields to handle enter/exit actions. 
//	        private TriggerActionCollection 
	        this._enterActions = null;
//	        private TriggerActionCollection 
	        this._exitActions = null; 
		},
		
        ///     Parameter validation work common to the SetXXXX methods that deal
        /// with the container node of the Style/Template.
//        internal void 
        ProcessParametersContainer:function(/*DependencyProperty*/ dp) 
        {
            // Not allowed to use Style to affect the StyleProperty. 
            if (dp == FrameworkElement.StyleProperty) 
            {
                throw new Error('ArgumentException(SR.Get(SRID.StylePropertyInStyleNotAllowed)'); 
            }
        },

        ///     Parameter validation work common to the SetXXXX methods that deal
        /// with visual tree child nodes. 
//        internal string 
        ProcessParametersVisualTreeChild:function(/*DependencyProperty*/ dp, /*string*/ target)
        { 
            if (target == null)
            {
                throw new Error('ArgumentNullException("target")');
            } 

            if (target.Length == 0) 
            { 
                throw new Error('ArgumentException(SR.Get(SRID.ChildNameMustBeNonEmpty)');
            } 

//            return String.Intern(target);
            return target;
        },
 
        ///     After the parameters have been validated, store it in the 
        /// PropertyValues collection. 
        /// <remarks> 
        ///     All these will be looked at again (and processed into runtime
        /// data structures) by Style.Seal(). We keep them around even after
        /// that point should we need to serialize this data back out.
        /// </remarks> 
//        internal void 
        AddToPropertyValues:function(/*string*/ childName, /*DependencyProperty*/ dp, /*object*/ value, /*PropertyValueType*/ valueType)
        { 
            // Store original data 
            /*PropertyValue*/var propertyValue = new PropertyValue();
            propertyValue.ValueType = valueType; 
            propertyValue.Conditions = null;  // Delayed - derived class is responsible for this item.
            propertyValue.ChildName = childName;
            propertyValue.Property = dp;
            propertyValue.ValueInternal = value; 

            this.PropertyValues.Add(propertyValue); 
        }, 

        //CASRemoval:[StrongNameIdentityPermission(SecurityAction.InheritanceDemand, PublicKey = Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)] 
//        internal override void 
        Seal:function()
        {
            DependencyObject.prototype.Seal.call(this); 
 
            // Super classes have added all delayed conditions
 
            // Track Dependent/Source relationship for prediction
            for (var i = 0; i < this.PropertyValues.Count; i++)
            {
                /*PropertyValue*/var propertyValue = PropertyValues[i]; 

                /*DependencyProperty*/var dependent = propertyValue.Property; 
 
                for (var j = 0; j < propertyValue.Conditions.Length; j++)
                { 
                    /*DependencyProperty*/
                	var source = propertyValue.Conditions[j].Property;

                    // Check for obvious cycles.  Don't test for cycles if we have
                    // something other than self as the target, since this means that 
                    // the templatedParent is presumably not the target.  See windows bug
                    // 984916 for details. 
                    if (source == dependent && propertyValue.ChildName == StyleHelper.SelfName) 
                    {
                        throw new Error('InvalidOperationException(SR.Get(SRID.PropertyTriggerCycleDetected, source.Name)'); 
                    }
                }
            }
 
            if( this._enterActions != null )
            { 
            	this._enterActions.Seal(this); 
            }
            if( this._exitActions != null ) 
            {
            	this._exitActions.Seal(this);
            }
        }, 

        // This will transfer information in the _setters collection to PropertyValues array. 
//        internal void 
        ProcessSettersCollection:function(/*SetterBaseCollection*/ setters)
        {
            // Add information in Setters collection to PropertyValues array.
            if( setters != null ) 
            {
                // Seal Setters 
                setters.Seal(); 

                for (var i = 0; i < setters.Count; i++ ) 
                {
                    /*Setter*/var setter = setters[i];
                    if( setter != null )
                    { 
                        /*DependencyProperty*/var dp = setter.Property;
                        /*object*/var value          = setter.ValueInternal; 
                        /*string*/var target         = setter.TargetName; 

                        if( target == null ) 
                        {
                            this.ProcessParametersContainer(dp);

                            target = StyleHelper.SelfName; 
                        }
                        else 
                        { 
                            target = this.ProcessParametersVisualTreeChild(dp, target); // name string will get interned
                        } 

                        /*DynamicResourceExtension*/var dynamicResource = value instanceof DynamicResourceExtension ? value : null;
                        if (dynamicResource == null)
                        { 
                            this.AddToPropertyValues(target, dp, value, PropertyValueType.Trigger);
                        } 
                        else 
                        {
                            this.AddToPropertyValues(target, dp, dynamicResource.ResourceKey, PropertyValueType.PropertyTriggerResource); 
                        }
                    }
                    else
                    { 
                        throw new Error('InvalidOperationException(SR.Get(SRID.VisualTriggerSettersIncludeUnsupportedSetterType, setter.GetType().Name)');
                    } 
                } 
            }
        },

 
        // Receive a new inheritance context (this will be a FE/FCE) 
//        internal override void 
        AddInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property)
        {
        	var parObj = {
        		"hasMultipleInheritanceContexts":this._hasMultipleInheritanceContexts,
        		"inheritanceContext":this.inheritanceContext
        	};
            InheritanceContextHelper.AddInheritanceContext(context,
                                                              this, 
                                                              parObj
                                                              /*ref _hasMultipleInheritanceContexts,
                                                              ref _inheritanceContext*/); 
            this._hasMultipleInheritanceContexts = parObj.hasMultipleInheritanceContexts;
            this.inheritanceContext = parObj.inheritanceContext
        },

        // Remove an inheritance context (this will be a FE/FCE) 
//        internal override void 
        RemoveInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property)
        {
        	var parObj = {
            		"hasMultipleInheritanceContexts":this._hasMultipleInheritanceContexts,
            		"inheritanceContext":this.inheritanceContext
            	};
            InheritanceContextHelper.RemoveInheritanceContext(context,
                                                                  this, 
                                                                  parObj
                                                                  /*ref _hasMultipleInheritanceContexts,
                                                                  ref _inheritanceContext*/);
            this._hasMultipleInheritanceContexts = parObj.hasMultipleInheritanceContexts;
            this.inheritanceContext = parObj.inheritanceContext
        },
        

        // Set self rank to current number, increment global static. 
//        internal void 
        EstablishLayer:function() 
        {
            if( this._globalLayerRank == 0 ) 
            {
                this._globalLayerRank = _nextGlobalLayerRank++; 
            }
        },
 
	});
	
	Object.defineProperties(TriggerBase.prototype,{

        ///     A collection of trigger actions to perform when this trigger 
        /// object becomes active.
//        public TriggerActionCollection 
        EnterActions:
        {
            get:function() 
            {
                if( this._enterActions == null ) 
                {
                	this._enterActions = new TriggerActionCollection();
                    if( IsSealed )
                    { 
                        // This collection might receive its first query after
                        //  the containing trigger had already been sealed 
                        v_enterActions.Seal(this); 
                    }
                } 
                return this._enterActions;
            }
        },
 
        // Internal way to check without triggering a pointless allocation
//        internal bool 
        HasEnterActions: { get:function() { return this._enterActions != null && this._enterActions.Count > 0; } }, 
 
        /// <summary>
        ///     A collection of trigger actions to perform when this trigger 
        /// object becomes inactive.
        /// </summary>
//        public TriggerActionCollection 
        ExitActions:
        {
            get:function() 
            { 
                if( this._exitActions == null )
                {
                	this._exitActions = new TriggerActionCollection(); 
                    if( this.IsSealed )
                    { 
                        // This collection might receive its first query after 
                        //  the containing trigger had already been sealed
                    	this._exitActions.Seal(this); 
                    }
                }
                return this._exitActions;
            } 
        },
 
        // Internal way to check without triggering a pointless allocation 
//        internal bool 
        HasExitActions: { get:function() { return this._exitActions != null && this._exitActions.Count > 0; } },
 
//  Here's the internal version that does what Robby thinks it should do.
//        internal bool 
        ExecuteEnterActionsOnApply:
        {
            get:function() 
            {
                return true; 
            } 
        },
 
//        internal bool 
        ExecuteExitActionsOnApply:
        {
            get:function()
            { 
                return false;
            } 
        },
        

        // Says if the current instance has multiple InheritanceContexts 

//        internal override bool 
        HasMultipleInheritanceContexts:
        {
            get:function() { return this._hasMultipleInheritanceContexts; } 
        },
 
        // This ranking is used when trigger needs to be sorted relative to 
        //  the ordering, as when determining precedence for enter/exit
        //  animation composition.  Otherwise, it stays at default value of zero. 
//        internal Int64 
        Layer:
        {
            get:function() { return this._globalLayerRank; }
        },
        
        // Collection of TriggerConditions
//        internal TriggerCondition[] 
        TriggerConditions: 
        { 
            get:function() { return this._triggerConditions; },
            set:function(value) { this._triggerConditions = value; } 
        },
        
        // Define the DO's inheritance context

//        internal override DependencyObject 
        InheritanceContext: 
        {
            get:function() { return this._inheritanceContext; } 
        },
        
//        /* property */ internal FrugalStructList<System.Windows.PropertyValue> 
        PropertyValues:
        {
        	get:function(){
	        	if(this._PropertyValues == undefined){
	        		this._PropertyValues = new List(); 
	        	}
	        	
	        	return this._PropertyValues;
        	}
        }

	});
	
	TriggerBase.Type = new Type("TriggerBase", TriggerBase, [DependencyObject.Type]);
	return TriggerBase;
});
