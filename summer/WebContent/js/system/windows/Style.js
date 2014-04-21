/**
 * Style
 */ 

define(["dojo/_base/declare", "system/Type", "threading/DispatcherObject",
        "windows/NameScope", "windows/EventHandlersStore", "utility/ItemStructList", "windows/SetterBaseCollection",
        "windows/TriggerCollection", "utility/FrugalStructList", "utility/FrugalMap", "generic/Dictionary", "windows/Setter",
        "windows/DynamicResourceExtension", "windows/PropertyValueType", "windows/PropertyValue", "windows/StyleHelper",
        "windows/EventTrigger", "markup/INameScope", "markup/IAddChild", "windows/ISealable", 
        "markup/IHaveResources", "markup/IQueryAmbient", "windows/IFrameworkInputElement",
        "windows/ChildEventDependent"], 
		function(declare, Type, DispatcherObject,
				NameScope, EventHandlersStore, ItemStructList, SetterBaseCollection, 
				TriggerCollection, FrugalStructList, FrugalMap, Dictionary, Setter,
				DynamicResourceExtension, PropertyValueType, PropertyValue, StyleHelper,
				EventTrigger, INameScope, IAddChild, ISealable, 
				IHaveResources, IQueryAmbient, IFrameworkInputElement,
				ChildEventDependent
				){
	
	var FrameworkElement = null;
	function EnsureFrameworkElement(){
		if(FrameworkElement == null){
			FrameworkElement = using("windows/FrameworkElement");
		}
		
		return FrameworkElement;
	}
	
	var FrameworkContentElement = null;
	
	function EnsureFrameworkContentElement(){
		if(FrameworkContentElement == null){
			FrameworkContentElement = using("windows/FrameworkContentElement");
		}
		
		return FrameworkContentElement;
	}
	
    // Unique index for every instance of Style 
    // Synchronized: Covered by Style.Synchronized
//    private static int 
    var StyleInstanceCount = 0; 

//    private const int 
    var TargetTypeID = 0x01;
//    internal const int 
    var BasedOnID    = 0x02;

    // Using the modified flags to note whether we have an EventSetter.
//    private const int 
    var HasEventSetter = 0x10; 
    
//    internal static readonly Type 
    var DefaultTargetType = IFrameworkInputElement.Type;
    
	var Style = declare("Style", [DispatcherObject, INameScope, IAddChild, ISealable, IHaveResources, IQueryAmbient],{
		constructor:function(/*Type*/ targetType, /*Style*/ basedOn)
        { 
			this._targetType = DefaultTargetType;
			this._basedOn = null;
			
			if(targetType === undefined){
				targetType = null;
			}
			
			if(basedOn === undefined){
				basedOn = null;
			}
			
			if(targetType != null){
	            this.TargetType = targetType;
			}

			if(basedOn !=null){
				this.BasedOn = basedOn;
			}

            this.GetUniqueGlobalIndex(); 
            
//            private NameScope 
            this._nameScope = new NameScope(); 
            
//            private EventHandlersStore 
            this._eventHandlersStore = new EventHandlersStore(); 
            
//            private bool 
            this._sealed = false;
//            private bool 
            this._hasInstanceValues = null; 

//            private bool 
            this._hasLoadedChangeHandler = false; 

//            private Type 
//            this._targetType = DefaultTargetType = null; 
//            private Style 
//            this._basedOn = null; 

//            private TriggerCollection 
            this._visualTriggers = null; 

//            private SetterBaseCollection 
            this._setters = null;

            // Holds resources that are applicable to the container 
            // of this style and its sub-tree.
//            internal ResourceDictionary 
            this._resources = null; 
     
//            /* property */ internal int 
            this.GlobalIndex = 0;
     
            // Style tables
//            internal FrugalStructList<ChildRecord> 
            this.ChildRecordFromChildIndex = new FrugalStructList(); // Indexed by Child.ChildIndex

            // 
            // Shared tables used during OnTriggerSourcePropertyInvalidated 
            //
//            internal FrugalStructList<ItemStructMap<TriggerSourceRecord>> 
            this.TriggerSourceRecordFromChildIndex = new FrugalStructList(); 
            // Dictionary of property triggers that have TriggerActions, keyed via DP.GlobalIndex affecting those triggers.
            //  Each trigger can be listed multiple times, if they are dependent on multiple properties.
//            internal FrugalMap 
            this.PropertyTriggersWithActions = new FrugalMap();
     
            // Original Style data (not including based-on data)
//            internal FrugalStructList<PropertyValue> 
            this.PropertyValues = new FrugalStructList(); 

            // Properties driven on the container (by the Style) that should be 
            // invalidated when the style gets applied/unapplied. These properties
            // could have been set via Style.SetValue or TriggerBase.SetValue
//            internal FrugalStructList<ContainerDependent> 
            this.ContainerDependents = new FrugalStructList(); 

            // Properties driven by a resource that should be invalidated 
            // when a resource dictionary changes 
//            internal FrugalStructList<ChildPropertyDependent> 
            this.ResourceDependents = new FrugalStructList(); 

            // Events driven by a this style. An entry for every childIndex that has associated events.
            // childIndex '0' is used to represent events set on the style's TargetType. This data-structure
            // will be frequently looked up during event routing. 
//            internal ItemStructList<ChildEventDependent> 
            this.EventDependents = new ItemStructList(1, ChildEventDependent); 
     
            // Used by EventTrigger: Maps a RoutedEventID to a set of TriggerAction objects
            //  to be performed. 
//            internal HybridDictionary 
            this._triggerActions = new Dictionary(); //new HybridDictionary();

            // Data trigger information.  An entry for each Binding that appears in a
            // condition of a data trigger. 
//            internal HybridDictionary 
            this._dataTriggerRecordFromBinding = new Dictionary(); //new HybridDictionary(); 
     
            // An entry for each Binding that appears in a DataTrigger with EnterAction or ExitAction
            //  This overlaps but should not be the same as _dataTriggerRecordFromBinding above: 
            //   A DataTrigger can have Setters but no EnterAction/ExitAction.  (The reverse can also be true.)
//            internal HybridDictionary 
            this.DataTriggersWithActions = new Dictionary(); //new HybridDictionary();
            
//            private int 
            this._modified = 0;
		},
		
        /// <summary>
        /// Registers the name - Context combination 
        /// </summary>
        /// <param name="name">Name to register</param>
        /// <param name="scopedElement">Element where name is defined</param>
//        public void 
        RegisterName:function(/*string*/ name, /*object*/ scopedElement) 
        {
            _nameScope.RegisterName(name, scopedElement); 
        },

        /// <summary>
        /// Unregisters the name - element combination 
        /// </summary>
        /// <param name="name">Name of the element</param> 
//        public void 
        UnregisterName:function(/*string*/ name) 
        {
            _nameScope.UnregisterName(name);
        }, 

        /// <summary> 
        /// Find the element given name 
        /// </summary>
        /// <param name="name">Name of the element</param> 
//        object INameScope.
        FindName:function(/*string*/ name)
        {
            return _nameScope.FindName(name); 
        },
        
        /// <summary>
        /// Each Style gets its own unique index used for Style.GetHashCode 
        /// </summary>
//        private void 
        GetUniqueGlobalIndex:function() 
        { 
            // Setup unqiue global index
            StyleInstanceCount++;
            this.GlobalIndex = StyleInstanceCount;
        },
 
        /// <summary>
        ///     Tries to find a Reosurce for the given resourceKey in the current 
        ///     style's ResourceDictionary or the basedOn style's ResourceDictionary
        ///     in that order. 
        /// </summary> 
//        internal object 
        FindResource:function(/*object*/ resourceKey, /*bool*/ allowDeferredResourceReference, /*bool*/ mustReturnDeferredResourceReference)
        { 
            if ((this._resources != null) && this._resources.Contains(resourceKey))
            {
                return this._resources.FetchResource(resourceKey, allowDeferredResourceReference, 
                		mustReturnDeferredResourceReference, {"canCache" : null }/*out canCache*/); 
            }
            if (this._basedOn != null) 
            { 
                return this._basedOn.FindResource(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference);
            } 
            return DependencyProperty.UnsetValue;
        },

//        internal ResourceDictionary 
        FindResourceDictionary:function(/*object*/ resourceKey) 
        {
            if (this._resources != null && this._resources.Contains(resourceKey)) 
            {
                return _resources; 
            }
            if (this._basedOn != null)
            {
                return this._basedOn.FindResourceDictionary(resourceKey); 
            }
            return null; 
        }, 
//
////        bool IQueryAmbient.
//        IsAmbientPropertyAvailable:function(/*string*/ propertyName) 
//        {
//            // We want to make sure that StaticResource resolution checks the .Resources
//            // Ie.  The Ambient search should look at Resources if it is set.
//            // Even if it wasn't set from XAML (eg. the Ctor (or derived Ctor) added stuff) 
//            switch (propertyName)
//            { 
//                case "Resources": 
//                    if (this._resources == null)
//                    { 
//                        return false;
//                    }
//                    break;
//                case "BasedOn": 
//                    if (this._basedOn == null)
//                    { 
//                        return false; 
//                    }
//                    break; 
//            }
//            return true;
//        },
 
        ///<summary>
        /// This method is called to Add a Setter object as a child of the Style. 
        /// This method is used primarily by the parser to set style properties and events. 
        ///</summary>
        ///<param name="value"> 
        /// The object to add as a child; it must be a SetterBase subclass.
        ///</param>
//        void IAddChild.
        AddChild :function(/*Object*/ value)
        { 
            if (value == null)
            { 
                throw new Error('ArgumentNullException("value")');
            }

            /*SetterBase*/
            var sb = value instanceof SetterBase ? value : null; 

            if (sb == null) 
            { 
                throw new Error('ArgumentException(SR.Get(SRID.UnexpectedParameterType, value.GetType(), typeof(SetterBase)), "value")');
            } 

            this.Setters.Add(sb);
        },
 
        ///<summary>
        /// This method is called by the parser when text appears under the tag in markup. 
        /// As default Styles do not support text, calling this method has no effect. 
        ///</summary>
        ///<param name="text"> 
        /// Text to add as a child.
        ///</param>
//        void IAddChild.
        AddText:function (/*string*/ text)
        { 
            XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this);
        }, 

        /// <summary>
        ///     Given a set of values for the PropertyValue struct, put that in
        /// to the PropertyValueList, overwriting any existing entry. 
        /// </summary>
//        private void 
        UpdatePropertyValueList:function( 
            /*DependencyProperty*/ dp, 
            /*PropertyValueType*/ valueType,
            /*object*/ value) 
        {
            // Check for existing value on dp
            var existingIndex = -1;
            for( var i = 0; i < this.PropertyValues.Count; i++ ) 
            {
                if( this.PropertyValues.Get(i).Property == dp ) 
                { 
                    existingIndex = i;
                    break; 
                }
            }

            if( existingIndex >= 0 ) 
            {
                // Overwrite existing value for dp 
                var propertyValue = this.PropertyValues.Get(existingIndex); 
                propertyValue.ValueType = valueType;
                propertyValue.ValueInternal = value; 
                // Put back modified struct
                this.PropertyValues.Set(existingIndex, propertyValue);
            }
            else 
            {
                // Store original data 
            	var propertyValue = new PropertyValue(); 
                propertyValue.ValueType = valueType;
                propertyValue.ChildName = StyleHelper.SelfName; 
                propertyValue.Property = dp;
                propertyValue.ValueInternal = value;

                this.PropertyValues.Add(propertyValue); 
            }
        },
 
//        internal void 
        CheckTargetType:function(/*object*/ element)
        { 
            // In the most common case TargetType is Default
            // and we can avoid a call to IsAssignableFrom() who's performance is unknown.
            if(Style.DefaultTargetType == this.TargetType)
                return; 

            var elementType = element.GetType(); 
            if(!this.TargetType.IsAssignableFrom(elementType)) 
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.StyleTargetTypeMismatchWithElement, this.TargetType.Name, elementType.Name)');
            }
        }, 

        /// <summary> 
        /// This Style and all factories/triggers are now immutable 
        /// </summary>
//        public void 
        Seal:function() 
        {
            // 99% case - Style is already sealed.
            if (this._sealed) 
            { 
                return;
            } 

            // Most parameter checking is done as "upstream" as possible, but some
            //  can't be checked until Style is sealed.
            if (this._targetType == null) 
            {
                throw new InvalidOperationException(SR.Get(SRID.NullPropertyIllegal, "TargetType")); 
            } 

            if (this._basedOn != null) 
            {
                if(Style.DefaultTargetType != this._basedOn.TargetType &&
                    !this._basedOn.TargetType.IsAssignableFrom(this._targetType))
                { 
                    throw new InvalidOperationException(SR.Get(SRID.MustBaseOnStyleOfABaseType, _targetType.Name));
                } 
            } 

            // Seal setters 
            if (this._setters != null)
            {
            	this._setters.Seal();
            } 

            // Seal triggers 
            if (this._visualTriggers != null) 
            {
            	this._visualTriggers.Seal(); 
            }

            // Will throw InvalidOperationException if we find a loop of
            //  BasedOn references.  (A.BasedOn = B, B.BasedOn = C, C.BasedOn = A) 
            this.CheckForCircularBasedOnReferences();
 
            // Seal BasedOn Style chain 
            if (this._basedOn != null)
            { 
            	this._basedOn.Seal();
            }

            // Seal the ResourceDictionary 
            if (this._resources != null)
            { 
            	this._resources.IsReadOnly = true; 
            }
 
            //
            // Build shared tables
            //
 
            // Process all Setters set on the selfStyle. This stores all the property
            // setters on the current styles into PropertyValues list, so it can be used 
            // by ProcessSelfStyle in the next step. The EventSetters for the current 
            // and all the basedOn styles are merged into the EventHandlersStore on the
            // current style. 
            this.ProcessSetters(this);

            // Add an entry in the EventDependents list for
            // the TargetType's EventHandlersStore. Notice 
            // that the childIndex is 0.
            StyleHelper.AddEventDependent(0, this.EventHandlersStore, /*ref*/ this.EventDependents); 
 
            // Process all PropertyValues (all are "Self") in the Style
            // chain (base added first) 
            this.ProcessSelfStyles(this);

            // Process all TriggerBase PropertyValues ("Self" triggers
            // and child triggers) in the Style chain last (highest priority) 
            this.ProcessVisualTriggers(this);
 
            // Sort the ResourceDependents, to help avoid duplicate invalidations 
            StyleHelper.SortResourceDependents(/*ref*/ this.ResourceDependents);
 
            // All done, seal self and call it a day.
            this._sealed = true;

//            // Remove thread affinity so it can be accessed across threads 
//            this.DetachFromDispatcher();
        },
 
        /// <summary>
        ///     This method checks to see if the BasedOn hierarchy contains 
        /// a loop in the chain of references.
        /// </summary>
        /// <remarks>
        /// Classic "when did we enter the cycle" problem where we don't know 
        ///  what to start remembering and what to check against.  Brute-
        ///  force approach here is to remember everything with a stack 
        ///  and do a linear comparison through everything.  Since the Style 
        ///  BasedOn hierarchy is not expected to be large, this should be OK.
        /// </remarks> 
//        private void 
        CheckForCircularBasedOnReferences:function()
        {
            var basedOnHierarchy = []; //new Stack(10);  // 10 because that's the default value (see MSDN) and the perf team wants us to specify something.
            var latestBasedOn = this; 

            while( latestBasedOn != null ) 
            { 
                if( basedOnHierarchy.indexOf( latestBasedOn )!=-1 )
                { 
                    // Uh-oh.  We've seen this Style before.  This means
                    //  the BasedOn hierarchy contains a loop.
                    throw new Error('InvalidOperationException(SR.Get(SRID.StyleBasedOnHasLoop)'); 

                    // Debugging note: If we stop here, the basedOnHierarchy 
                    //  object is still alive and we can browse through it to 
                    //  see what we've explored.  (This does not apply if
                    //  somebody catches this exception and re-throws.) 
                }

                // Haven't seen it, push on stack and go to next level.
                basedOnHierarchy.push( latestBasedOn ); 
                latestBasedOn = latestBasedOn.BasedOn;
            } 
 
            return;
        },

        // Iterates through the setters collection and adds the EventSetter information into
        // an EventHandlersStore for easy and fast retrieval during event routing. Also adds
        // an entry in the EventDependents list for EventhandlersStore holding the TargetType's 
        // events.
//        private void 
        ProcessSetters:function(/*Style*/ style) 
        { 
            // Walk down to bottom of based-on chain
            if (style == null) 
            {
                return;
            }
 
            style.Setters.Seal(); // Does not mark individual setters as sealed, that's up to the loop below.
 
 
            // On-demand create the PropertyValues list, so that we can specify the right size.
 
            if(this.PropertyValues.Count == 0)
            {
            	this.PropertyValues = new FrugalStructList/*<System.Windows.PropertyValue>*/(style.Setters.Count);
            } 

            // Add EventSetters to local EventHandlersStore 
            for (var i = 0; i < style.Setters.Count; i++) 
            {
                var setterBase = style.Setters.Get(i); 

                // Setters are folded into the PropertyValues table only for the current style. The
                // processing of BasedOn Style properties will occur in subsequent call to ProcessSelfStyle 
                /*Setter*/var setter = setterBase instanceof Setter ? setterBase : null;
                if (setter != null) 
                { 
                    // Style Setters are not allowed to have a child target name - since there are no child nodes in a Style.
                    if( setter.TargetName != null ) 
                    {
                        throw new Error('InvalidOperationException(SR.Get(SRID.SetterOnStyleNotAllowedToHaveTarget, setter.TargetName)');
                    }
 
                    if (style == this)
                    { 
                        /*DynamicResourceExtension*/var dynamicResource 
                        	= setter.ValueInternal instanceof DynamicResourceExtension ? setter.ValueInternal : null; 
                        if (dynamicResource == null)
                        { 
                            this.UpdatePropertyValueList( setter.Property, PropertyValueType.Set, setter.ValueInternal );
                        }
                        else
                        { 
                        	this.UpdatePropertyValueList( setter.Property, PropertyValueType.Resource, dynamicResource.ResourceKey );
                        } 
                    } 
                }
                else 
                {
                    // Add this to the _eventHandlersStore 
 
                    /*EventSetter*/
                	var eventSetter = setterBase;
                    if (this._eventHandlersStore == null) 
                    {
                    	this._eventHandlersStore = new EventHandlersStore();
                    }
                    this._eventHandlersStore.AddRoutedEventHandler(eventSetter.Event, eventSetter.Handler, eventSetter.HandledEventsToo); 

                    this.SetModified(HasEventSetter); 
 
                    // If this event setter watches the loaded/unloaded events, set the optimization
                    // flag. 

                    if (eventSetter.Event == EnsureFrameworkElement().LoadedEvent || eventSetter.Event == EnsureFrameworkElement().UnloadedEvent)
                    {
                    	this._hasLoadedChangeHandler = true; 
                    }
                }
            } 

            // Process EventSetters on based on style so they get merged
            // into the EventHandlersStore for the current style.
            this.ProcessSetters(style._basedOn); 
        },
 
//        private void 
        ProcessSelfStyles:function(/*Style*/ style) 
        {
            // Walk down to bottom of based-on chain 
            if (style == null)
            {
                return;
            } 

            this.ProcessSelfStyles(style._basedOn); 
 
            // Merge in "self" PropertyValues while walking back up the tree
            // "Based-on" style "self" rules are always added first (lower priority) 
            for (var i = 0; i < style.PropertyValues.Count; i++)
            {
                var propertyValue = style.PropertyValues.Get(i);
 
                var dataTriggerRecordFromBindingRef ={
                		
                };
                
                var hasInstanceValuesRef = {
                	"hasInstanceValues" : this._hasInstanceValues
                };
                
                StyleHelper.UpdateTables(/*ref*/ propertyValue, /*ref*/ this.ChildRecordFromChildIndex,
                    /*ref*/ this.TriggerSourceRecordFromChildIndex, /*ref*/ this.ResourceDependents, /*ref*/ this._dataTriggerRecordFromBinding, 
                    null /*_childIndexFromChildID*/, hasInstanceValuesRef/*ref _hasInstanceValues*/); 
                this._hasInstanceValues = hasInstanceValuesRef.hasInstanceValues;

                // Track properties on the container that are being driven by 
                // the Style so that they can be invalidated during style changes
                StyleHelper.AddContainerDependent(propertyValue.Property, false /*fromVisualTrigger*/, /*ref*/ this.ContainerDependents);
            }
        }, 

//        private void 
        ProcessVisualTriggers:function(/*Style*/ style) 
        { 
            // Walk down to bottom of based-on chain
            if (style == null) 
            {
                return;
            }
 
            this.ProcessVisualTriggers(style._basedOn);
 
            if (style._visualTriggers != null) 
            {
                // Merge in "self" and child TriggerBase PropertyValues while walking 
                // back up the tree. "Based-on" style rules are always added first
                // (lower priority)
                var triggerCount = style._visualTriggers.Count;
                for (var i = 0; i < triggerCount; i++) 
                {
                    var trigger = style._visualTriggers.Get(i); 
 
                    // Set things up to handle Setter values
                    for (var j = 0; j < trigger.PropertyValues.Count; j++) 
                    {
                        var propertyValue = trigger.PropertyValues.Get(j);

                        // Check for trigger rules that act on container 
                        if (propertyValue.ChildName != StyleHelper.SelfName)
                        { 
                            throw new Error('InvalidOperationException(SR.Get(SRID.StyleTriggersCannotTargetTheTemplate)'); 
                        }
 
                        var conditions = propertyValue.Conditions;
                        for (var k=0; k<conditions.Length; k++)
                        {
                            if( conditions[k].SourceName != StyleHelper.SelfName ) 
                            {
                                throw new Error('InvalidOperationException(SR.Get(SRID.TriggerOnStyleNotAllowedToHaveSource, conditions[k].SourceName)'); 
                            } 
                        }
 
                        // Track properties on the container that are being driven by
                        // the Style so that they can be invalidated during style changes
                        StyleHelper.AddContainerDependent(propertyValue.Property, true /*fromVisualTrigger*/, /*ref*/ this.ContainerDependents);
 
                        var hasInstanceValuesRef = {
                            	"hasInstanceValues" : this._hasInstanceValues
                            };
                        StyleHelper.UpdateTables(/*ref*/ propertyValue, /*ref*/ this.ChildRecordFromChildIndex,
                            /*ref*/ this.TriggerSourceRecordFromChildIndex, /*ref*/ this.ResourceDependents, /*ref*/ this._dataTriggerRecordFromBinding, 
                            null /*_childIndexFromChildID*/, hasInstanceValuesRef/*ref _hasInstanceValues*/); 
                        this._hasInstanceValues = hasInstanceValuesRef.hasInstanceValues;
                    }
 
                    // Set things up to handle TriggerActions
                    if( trigger.HasEnterActions || trigger.HasExitActions )
                    {
                        if( trigger instanceof Trigger ) 
                        {
                            StyleHelper.AddPropertyTriggerWithAction( trigger, trigger.Property, /*ref*/ this.PropertyTriggersWithActions ); 
                        } 
                        else if( trigger instanceof MultiTrigger )
                        { 
                            var multiTrigger = trigger;
                            for( var k = 0; k < multiTrigger.Conditions.Count; k++ )
                            {
                                var triggerCondition = multiTrigger.Conditions[k]; 

                                StyleHelper.AddPropertyTriggerWithAction( trigger, triggerCondition.Property, /*ref*/ this.PropertyTriggersWithActions ); 
                            } 
                        }
                        else if( trigger instanceof DataTrigger ) 
                        {
                            StyleHelper.AddDataTriggerWithAction( trigger, trigger.Binding, /*ref*/ this.DataTriggersWithActions );
                        }
                        else if( trigger instanceof MultiDataTrigger ) 
                        {
                            var multiDataTrigger = trigger; 
                            for( var k = 0; k < multiDataTrigger.Conditions.Count; k++ ) 
                            {
                                var dataCondition = multiDataTrigger.Conditions[k]; 

                                StyleHelper.AddDataTriggerWithAction( trigger, dataCondition.Binding, /*ref*/ this.DataTriggersWithActions );
                            }
                        } 
                        else
                        { 
                            throw new InvalidOperationException(SR.Get(SRID.UnsupportedTriggerInStyle, trigger.GetType().Name)); 
                        }
                    } 

                    // Set things up to handle EventTrigger
                    var eventTrigger = trigger instanceof EventTrigger ? trigger : null;
                    if( eventTrigger != null ) 
                    {
                        if( eventTrigger.SourceName != null && eventTrigger.SourceName.Length > 0 ) 
                        { 
                            throw new Error('InvalidOperationException(SR.Get(SRID.EventTriggerOnStyleNotAllowedToHaveTarget, eventTrigger.SourceName)');
                        } 

                        var hasLoadedChangeHandlerRef = {
                        	"hasLoadedChangeHandler" : this._hasLoadedChangeHandler
                        };
                        StyleHelper.ProcessEventTrigger(eventTrigger,
                                                        null /*_childIndexFromChildID*/,
                                                        /*ref*/ this._triggerActions, 
                                                        /*ref*/ this.EventDependents,
                                                        null /*_templateFactoryRoot*/, 
                                                        null, 
                                                        /*ref*/ this._eventHandlersStore,
                                                        /*ref*/ _hasLoadedChangeHandler); 
                        this._hasLoadedChangeHandler = hasLoadedChangeHandlerRef.hasLoadedChangeHandler;
                    }
                }
            }
        },
        
//        private void 
        SetModified:function(/*int*/ id) { this._modified |= id; },
//        internal bool 
        IsModified:function(/*int*/ id) { return (id & this._modified) != 0; }

	});
	
	Object.defineProperties(Style.prototype, {
	      /// <summary> 
        ///     Style mutability state
        /// </summary> 
        /// <remarks>
        ///     A style is sealed when another style is basing on it, or,
        ///     when it's applied
        /// </remarks> 
//        public bool 
        IsSealed:
        { 
            get:function() 
            {
                return this._sealed;
            } 
        },
        
        /// <summary>
        /// Can this style be sealed 
        /// </summary>
//        bool ISealable.
        CanSeal: 
        { 
            get:function() { return true; }
        },

        /// <summary>
        ///     Type that this style is intended 
        /// </summary>
        /// <remarks>
        ///     By default, the target type is FrameworkElement
        /// </remarks> 
//        public Type 
        TargetType: 
        {
            get:function() 
            {
                return this._targetType;
            }, 
 
            set:function(value)
            { 
                if (this._sealed) 
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "Style")'); 
                } 

                if( value == null ) 
                {
                    throw new Error('ArgumentNullException("value")');
                }
 
                if (!EnsureFrameworkElement().Type.IsAssignableFrom(value) &&
                    !EnsureFrameworkContentElement().Type.IsAssignableFrom(value) && 
                    !(Style.DefaultTargetType == value)) 
                {
                    throw new Error('ArgumentException(SR.Get(SRID.MustBeFrameworkDerived, value.Name)');
                }

                this._targetType = value; 

                this.SetModified(this.TargetTypeID); 
            } 
        },
 
        /// <summary>
        ///     Style to base on
        /// </summary>
//        public Style 
        BasedOn: 
        { 
            get:function()
            { 
                return this._basedOn; 
            },
            set:function(value) 
            { 
                if (this._sealed)
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "Style")'); 
                }
 
                if( value == this ) 
                {
                    // Basing on self is not allowed.  This is a degenerate case 
                    //  of circular reference chain, the full check for circular
                    //  reference is done in Seal().
                    throw new Error('ArgumentException(SR.Get(SRID.StyleCannotBeBasedOnSelf)');
                } 

                this._basedOn = value; 
 
                this.SetModified(BasedOnID);
            } 
        },


        /// <summary> 
        ///     Visual triggers
        /// </summary> 
//        public TriggerCollection 
        Triggers:
        { 
            get:function()
            {
                if (this._visualTriggers == null) 
                { 
                	this._visualTriggers = new TriggerCollection();
 
                    // If the style has been sealed prior to this the newly
                    // created TriggerCollection also needs to be sealed
                    if (this._sealed)
                    { 
                    	this._visualTriggers.Seal();
                    } 
                } 
                return this._visualTriggers;
            } 
        },

        /// <summary>
        ///     The collection of property setters for the target type 
        /// </summary>
 
//        public SetterBaseCollection 
        Setters:
        { 
            get:function()
            {
                if( this._setters == null ) 
                { 
                	this._setters = new SetterBaseCollection();
 
                    // If the style has been sealed prior to this the newly
                    // created SetterBaseCollection also needs to be sealed
                    if (this._sealed)
                    { 
                    	this._setters.Seal();
                    } 
                } 
                return this._setters;
            } 
        },

        /// <summary>
        ///     The collection of resources that can be 
        ///     consumed by the container and its sub-tree.
        /// </summary> 
//        public ResourceDictionary 
        Resources:
        { 
            get:function()
            {
                if( this._resources == null ) 
                { 
                	this._resources = new ResourceDictionary();
 
                    // A Style ResourceDictionary can be accessed across threads
                	this._resources.CanBeAccessedAcrossThreads = true;

                    // If the style has been sealed prior to this the newly 
                    // created ResourceDictionary also needs to be sealed
                    if (this._sealed) 
                    { 
                    	this._resources.IsReadOnly = true;
                    } 
                }
                return this._resources;
            },
            set:function(value) 
            {
                if( this._sealed ) 
                {
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "Style"));
                }
 
                this._resources = value;
 
                if (this._resources != null) 
                {
                    // A Style ResourceDictionary can be accessed across threads 
                	this._resources.CanBeAccessedAcrossThreads = true;
                }
            }
        }, 

//        internal bool 
        HasResourceReferences:
        {
            get:function() 
            {
                return this.ResourceDependents.Count > 0; 
            } 
        },
 
        /// <summary>
        ///     Store all the event handlers for this Style TargetType
        /// </summary>
//        internal EventHandlersStore 
        EventHandlersStore:
        {
            get:function() { return this._eventHandlersStore; } 
        },

        /// <summary> 
        ///     Does the current style or any of its template children
        ///     have any event setters OR event triggers
        /// </summary>
//        internal bool 
        HasEventDependents: 
        {
            get:function() 
            { 
                return (this.EventDependents.Count > 0);
            } 
        },

        /// <summary>
        ///     Does the current style or any of its template children 
        ///     have event setters, ignoring event triggers.
        /// </summary> 
//        internal bool 
        HasEventSetters: 
        {
            get:function() 
            {
                return this.IsModified(HasEventSetter);
            }
        }, 

        // 
        //  Says if this style contains any per-instance values 
        //
//        internal bool 
        HasInstanceValues: 
        {
            get:function() { return this._hasInstanceValues; }
        },
 
        //
        // Says if we have anything listening for the Loaded or Unloaded 
        // event (used for an optimization in FrameworkElement). 
        //
 
//        internal bool 
        HasLoadedChangeHandler:
        {
            get:function() { return this._hasLoadedChangeHandler; },
            set:function(value) { this._hasLoadedChangeHandler = value; } 
        },
        
//        internal bool 
        IsBasedOnModified: { get:function() { return this.IsModified(BasedOnID); } },
	});
	
	Object.defineProperties(Style, {
//		internal static readonly Type 
		DefaultTargetType:
		{
			get:function(){
				if(Style._DefaultTargetType === undefined){
					Style._DefaultTargetType =IFrameworkInputElement.Type; 
				}
				
				return Style._DefaultTargetType;
			}
		}
	});
	
//    static Style() 
	function Initialize()
    {
        // Register for the "alternative Expression storage" feature, since 
        // we store Expressions in per-instance StyleData. 
        StyleHelper.RegisterAlternateExpressionStorage();
    }
	
	Style.Type = new Type("Style", Style, 
			[DispatcherObject.Type, INameScope.Type, IAddChild.Type, ISealable.Type, IHaveResources.Type, IQueryAmbient.Type]);   //INameScope, IAddChild, ISealable
	Initialize();
	
	return Style;
});

