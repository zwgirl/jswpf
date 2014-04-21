/**
 * FrameworkTemplate
 */

define(["dojo/_base/declare", "system/Type", "threading/DispatcherObject", "windows/NameScope", "generic/Dictionary",
        "utility/FrugalStructList", "generic/List", "utility/FrugalMap", "windows/EventHandlersStore",
        "windows/TemplateBindingExpression", "windows/TemplateBindingExtension", "windows/ResourceReferenceExpression",
        "windows/DependencyObject", "markup/MarkupExtension", "utility/ItemStructList", "specialized/HybridDictionary",
        "windows/ChildEventDependent"], 
		function(declare, Type, DispatcherObject, NameScope, Dictionary, 
				FrugalStructList, List, FrugalMap, EventHandlersStore,
				TemplateBindingExpression, TemplateBindingExtension, ResourceReferenceExpression,
				DependencyObject, MarkupExtension, ItemStructList, HybridDictionary,
				ChildEventDependent){
	
	var StyleHelper = null;
	
	function EnsureStyleHelper(){
		if(StyleHelper == null){
			StyleHelper = using("windows/StyleHelper");
		}
		
		return StyleHelper;
	}
	
	var FrameworkContentElement = null;
	
	function EnsureFrameworkContentElement(){
		if(FrameworkContentElement == null){
			FrameworkContentElement = using("windows/FrameworkContentElement");
		}
		
		return FrameworkContentElement;
	}
	
    var InternalFlags=declare("InternalFlags", null,{ 
    });	
    
  //Sealed                          = 0x00000001, 
  //HasInstanceValues               = 0x00000002,
    InternalFlags.CanBuildVisualTree = 0x00000004; 
    InternalFlags.HasLoadedChangeHandler = 0x00000008;
    InternalFlags.HasContainerResourceReferences = 0x00000010;
    InternalFlags.HasChildResourceReferences = 0x00000020;
    
    // Keep track of the template children elements for which the template has a Loaded 
    // or Unloaded listener.
    var TemplateChildLoadedFlags=declare("TemplateChildLoadedFlags", null,{ 
    });	
    
    Object.defineProperties(TemplateChildLoadedFlags.prototype, {
    	HasLoadedChangedHandler:
    	{
    		get:function(){
    			return this._HasLoadedChangedHandler;
    		},
    		set:function(value){
    			this._HasLoadedChangedHandler = value;
    		}
    	},
    	HasUnloadedChangedHandler:
    	{
    		get:function(){
    			return this._HasUnloadedChangedHandler;
    		},
    		set:function(value){
    			this._HasUnloadedChangedHandler = value;
    		}
    	}
    });
	
	var FrameworkTemplate = declare("FrameworkTemplate", DispatcherObject,{
		constructor:function(){
//			private NameScope 
		    this._nameScope = new NameScope();
		    
//	        private InternalFlags 
	        this._flags = 0;
//	        private bool 
	        this._sealed = false;    // passed by ref, so cannot use flags 
//	        internal bool 
	        this._hasInstanceValues = false; // passed by ref, so cannot use flags 

	        // If we're a FEF-based template, we'll have a _templateRoot. 

//	        private FrameworkElementFactory 
	        this._templateRoot = null; 
	        //
	        //  Used to generate childIndex for each TemplateNode
	        //
//	        private HybridDictionary 
	        this._childIndexFromChildName = new HybridDictionary(); 
//	        private Dictionary<int, Type> 
	        this._childTypeFromChildIndex = new Dictionary();
//	        private int 
	        this._lastChildIndex = 1; // 0 means "self" (container), no instance ever has index 0 
//	        private List<String> 
	        this._childNames = new List(); 

	        // 
	        // Resource dictionary associated with this template.
	        //
//	        internal ResourceDictionary 
	        this._resources = null;
	        
	        //
	        //  Used by EventTrigger: Maps a RoutedEventID to a set of TriggerAction objects 
	        //  to be performed. 
	        //
//	        internal HybridDictionary 
	        this._triggerActions = new HybridDictionary();
	        

	        //
	        // Shared tables used during GetValue
	        // 
//	        internal FrugalStructList<ChildRecord> 
	        this.ChildRecordFromChildIndex = new FrugalStructList(); // Indexed by Child.ChildIndex
	 
	        // 
	        // Shared tables used during OnTriggerSourcePropertyInvalidated
	        // 
//	        internal FrugalStructList<ItemStructMap<TriggerSourceRecord>> 
	        this.TriggerSourceRecordFromChildIndex = new FrugalStructList();

	        // Dictionary of property triggers that have TriggerActions, keyed via DP.GlobalIndex affecting those triggers.
	        //  Each trigger can be listed multiple times, if they are dependent on multiple properties. 
//	        internal FrugalMap 
	        this.PropertyTriggersWithActions = new FrugalMap();
	 
	        // 
	        // Shared tables used during OnStyleInvalidated/OnTemplateInvalidated/InvalidateTree
	        // 

	        // Properties driven on the container (by the Style) that should be
	        // invalidated when the style gets applied/unapplied. These properties
	        // could have been set via Style.SetValue or VisualTrigger.SetValue 
//	        internal FrugalStructList<ContainerDependent> 
	        this.ContainerDependents = new FrugalStructList();
	 
	        // Properties driven by a resource that should be invalidated 
	        // when a resource dictionary changes or when the tree changes
	        // or when a Style is Invalidated 
//	        internal FrugalStructList<ChildPropertyDependent> 
	        this.ResourceDependents = new FrugalStructList();

	        // Data trigger information.  An entry for each Binding that appears in a
	        // condition of a data trigger. 
	        // Synchronized: Covered by Style instance
//	        internal HybridDictionary 
	        this._dataTriggerRecordFromBinding = new HybridDictionary(); 
	 
	        // An entry for each Binding that appears in a DataTrigger with EnterAction or ExitAction
	        //  This overlaps but should not be the same as _dataTriggerRecordFromBinding above: 
	        //   A DataTrigger can have Setters but no EnterAction/ExitAction.  (The reverse can also be true.)
//	        internal HybridDictionary 
	        this.DataTriggersWithActions = new HybridDictionary();

	        // It is possible for trigger events to occur before template expansion has 
	        //  taken place.  In these cases, we cannot resolve the appropriate target name
	        //  at that time.  We defer invoking these actions until template expansion 
	        //  is complete. 
	        // The key to the dictionary are the individual object instances that this
	        //  template applies to.  (We might be holding deferred actions for multiple 
	        //  objects.)
	        // The value of the dictionary is the trigger object and one of its action
	        //  lists stored in the struct DeferredAction.
//	        internal ConditionalWeakTable<DependencyObject,List<DeferredAction>> 
	        this.DeferredActions = null; 
	 
//	        internal HybridDictionary 
	        this._TemplateChildLoadedDictionary = new HybridDictionary(); 

	        //
	        // Shared tables used during Event Routing
	        //
	 
	        // Events driven by a this style. An entry for every childIndex that has associated events.
	        // childIndex '0' is used to represent events set ont he style's TargetType. This data-structure 
	        // will be frequently looked up during event routing. 
//	        internal ItemStructList<ChildEventDependent> 
	        this.EventDependents = new ItemStructList/*<ChildEventDependent>*/(1, ChildEventDependent);
	 
	        // Used to store a private delegate that called back during event
	        // routing so we can process EventTriggers
//	        private EventHandlersStore 
	        this._eventHandlersStore = new EventHandlersStore();
	 
	        // Prefetched values for StaticResources
//	        private object[] 
	        this._staticResourceValues = null; 
		},
		
		   /// <summary>
        ///     Tries to find a Reosurce for the given resourceKey in the current 
        ///     template's ResourceDictionary. 
        /// </summary>
//        internal object 
        FindResource:function(/*object*/ resourceKey, /*bool*/ allowDeferredResourceReference, 
        		/*bool*/ mustReturnDeferredResourceReference) 
        {
            if ((this._resources != null) && this._resources.Contains(resourceKey))
            {
//                bool canCache; 
                return this._resources.FetchResource(resourceKey, allowDeferredResourceReference, 
                		mustReturnDeferredResourceReference, {"canCache": null}/*out canCache*/);
            } 
            return DependencyProperty.UnsetValue; 
        },

        /// <summary> 
        /// FindName - Finds the element associated with the id defined under this control template.
        ///          Context of the FrameworkElement where this template is applied will be passed
        ///          as parameter.
        /// </summary> 
        /// <param name="name">string name</param>
        /// <param name="templatedParent">context where this template is applied</param> 
        /// <returns>the element associated with the Name</returns> 
//        public Object 
        FindName:function(/*string*/ name, /*FrameworkElement*/ templatedParent)
        { 

            if (templatedParent == null) 
            {
                throw new Error('ArgumentNullException("templatedParent")'); 
            } 

            if (this != templatedParent.TemplateInternal) 
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.TemplateFindNameInInvalidElement)');
            }
 
            return EnsureStyleHelper().FindNameInTemplateContent(templatedParent, name, this);
        },
 
        /// <summary> 
        /// Registers the name - Context combination
        /// </summary> 
        /// <param name="name">Name to register</param> 
        /// <param name="scopedElement">Element where name is defined</param>
//        public void 
        RegisterName:function(/*string*/ name, /*object*/ scopedElement) 
        {
            this._nameScope.RegisterName(name, scopedElement);
        },
 
        /// <summary>
        /// Unregisters the name - element combination 
        /// </summary>
        /// <param name="name">Name of the element</param>
//        public void 
        UnregisterName:function(/*string*/ name)
        { 
            this._nameScope.UnregisterName(name);
        },
 
        // Validate against the following rules
        // 1. The VisualTree's root must be a FrameworkElement.
//        private void 
        ValidateVisualTree:function(/*FrameworkElementFactory*/ templateRoot)
        { 
            // The VisualTree's root must be a FrameworkElement.
            if (templateRoot != null && 
            		EnsureFrameworkContentElement().Type.IsAssignableFrom(templateRoot.Type)) 
            {
                throw new Error('ArgumentException(SR.Get(SRID.VisualTreeRootIsFrameworkElement,typeof(FrameworkElement).Name, templateRoot.Type.Name)');
            }
        },
 
//        internal virtual void 
        ProcessTemplateBeforeSeal:function()
        {
        }, 

 
 
        /// <summary>
        /// Seal this FrameworkTemplate 
        /// </summary>
//        public void 
        Seal:function()
        {
        	var sealRef = {
        		"isSealed" : this._sealed	
        	};
        	
        	var hasInstanceValuesRef = {
        		"hasInstanceValues" : this._hasInstanceValues
        	};
            EnsureStyleHelper().SealTemplate( 
                this,
                /*ref _sealed*/sealRef, 
                this._templateRoot,
                this.TriggersInternal,
                this._resources,
                this.ChildIndexFromChildName, 
                /*ref*/ this.ChildRecordFromChildIndex,
                /*ref*/ this.TriggerSourceRecordFromChildIndex, 
                /*ref*/ this.ContainerDependents, 
                /*ref*/ this.ResourceDependents,
                /*ref*/ this.EventDependents, 
                /*ref*/ this._triggerActions,
                /*ref*/ this._dataTriggerRecordFromBinding,
                /*ref _hasInstanceValues*/hasInstanceValuesRef,
                /*ref*/ this._eventHandlersStore); 
            
            this._sealed = sealRef.isSealed;
            this._hasInstanceValues = hasInstanceValuesRef.hasInstanceValues;

        },
 
        // Subclasses need to call this method before any changes to their state.
//        internal void 
        CheckSealed:function() 
        { 
            if (this._sealed)
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "Template")');
            }
        },
 
        // compute and cache the flags for ResourceReferences
//        internal void 
        SetResourceReferenceState:function() 
        { 
            EnsureStyleHelper().SortResourceDependents(/*ref*/ this.ResourceDependents);

            for (var i = 0; i < this.ResourceDependents.Count; ++i)
            { 
                if (this.ResourceDependents.Get(i).ChildIndex == 0)
                { 
                	this.WriteInternalFlag(InternalFlags.HasContainerResourceReferences, true); 
                }
                else 
                {
                	this.WriteInternalFlag(InternalFlags.HasChildResourceReferences, true);
                }
            } 
        },
 
        // 
        //  This method
        //  Creates the VisualTree 
        //
//        internal bool 
        ApplyTemplateContent:function(
            /*UncommonField<HybridDictionary[]>*/ templateDataField, 
            /*FrameworkElement*/ container)
        { 

            this.ValidateTemplatedParent(container);
 
            /*bool*/
            var visualsCreated = EnsureStyleHelper().ApplyTemplateContent(templateDataField, container,
                this._templateRoot, this._lastChildIndex, 
                this.ChildIndexFromChildName, this); 

            return visualsCreated; 
        },
 
        //+-----------------------------------------------------------------------------------------------------
        // 
        //  LoadContent
        // 
        //  Load the content of a template, returning the root element of the content.  The second version 
        //  loads the template content for use on an FE (i.e. under FrameworkElement.ApplyTemplate).  The
        //  first version is used by the Content property for serialization, no optimization is 
        //  performed, and TemplateBinding's show up as TemplateBindingExpression's.  So it's just a normal
        //  tree.
        //
        //+------------------------------------------------------------------------------------------------------ 

        /// <summary> 
        /// Load the content of a template as an instance of an object.  Calling this multiple times 
        /// will return separate instances.
        /// </summary> 
//        public DependencyObject 
        LoadContent:function()
        {
            if (VisualTree != null) 
            { 
                /*FrameworkObject*/
            	var frameworkObject = VisualTree.InstantiateUnoptimizedTree();
                return frameworkObject.DO; 
            }
        },
 
 
        // The v3 main parser didn't treat ResourceDictionary as a NameScope, so
        // GetXamlType(typeof(ResourceDictionary).IsNameScope returns false. However, 
        // the v3 template parser did treat RD as a NameScope. So we need to special-case it.
//        internal static bool 
        IsNameScope:function(/*XamlType*/ type)
        {
            if (typeof(ResourceDictionary).IsAssignableFrom(type.UnderlyingType)) 
            {
                return true; 
            } 
            return type.IsNameScope;
        }, 


        // 
        //  This method
        //  1. Is an alternative approach to building a visual tree from a FEF
        //  2. Is used by ContentPresenter and Hyperlink to host their content
        // 
        //CASRemoval:[StrongNameIdentityPermissionAttribute(SecurityAction.InheritanceDemand, PublicKey=Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)]
//        internal virtual bool 
        BuildVisualTree:function(/*FrameworkElement*/ container) 
        { 
            return false;
        },


 
        // Extracts the required flag and returns 
        // bool to indicate if it is set or unset
//        private bool 
        ReadInternalFlag:function(/*InternalFlags*/ reqFlag) 
        {
            return (this._flags & reqFlag) != 0;
        },
 
        // Sets or Unsets the required flag based on
        // the bool argument 
//        private void 
        WriteInternalFlag:function(/*InternalFlags*/ reqFlag, /*bool*/ set) 
        {
            if (set) 
            {
            	this._flags |= reqFlag;
            }
            else 
            {
            	this._flags &= (~reqFlag); 
            } 
        },
        // Subclasses must provide a way for the parser to directly set the 
        // target type.
//        internal abstract void 
        SetTargetTypeInternal:function(/*Type*/ targetType){},
        /// <summary>
        ///     Subclasses must override this method if they need to 
        ///     impose additional rules for the TemplatedParent 
        /// </summary>
//        protected virtual void 
        ValidateTemplatedParent:function(/*FrameworkElement*/ templatedParent) 
        {
//            Debug.Assert(templatedParent != null,
//                "Must have a non-null FE TemplatedParent.");
        }      
	       

	});

	
	Object.defineProperties(FrameworkTemplate.prototype,{

        /// <summary>
        ///     Says if this template has been sealed
        /// </summary>
//        public bool 
        IsSealed: 
        {
            get:function()
            { 
                return this._sealed;
            }
        }, 

        /// <summary> 
        ///     Root node of the template 
        /// </summary>
//        public FrameworkElementFactory 
        VisualTree: 
        {
            get:function()
            {
                return this._templateRoot; 
            },
            set:function(value) 
            {
            	this.CheckSealed();
            	this.ValidateVisualTree(value); 
 
                this._templateRoot = value;
 
            }
        },
        //
        //  TargetType for ControlTemplate
        //
//        internal virtual Type 
        TargetTypeInternal: 
        {
            get:function() { return null; } 
        }, 

        // 
        //  DataType for DataTemplate
        // 
//        internal virtual object 
        DataTypeInternal: 
        {
            get:function() { return null; } 
        },

        /// <summary>
        /// Can this template be sealed 
        /// </summary> 
//        bool ISealable.
        CanSeal:
        { 
            get:function() { return true; }
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

                if ( this._resources == null ) 
                {
                	this._resources = new ResourceDictionary();

                    // A Template ResourceDictionary can be accessed across threads 
                	this._resources.CanBeAccessedAcrossThreads = true;
                } 
 
                if ( this.IsSealed )
                { 
                	this._resources.IsReadOnly = true;
                }

                return this._resources; 
            },
            set:function(value)
            { 
                if ( IsSealed )
                {
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "Template")); 
                }
 
                this._resources = value; 

                if (this._resources != null) 
                {
                    // A Template ResourceDictionary can be accessed across threads
                	this._resources.CanBeAccessedAcrossThreads = true;
                } 
            }
        }, 

        // 
        //  Collection of Triggers for a ControlTemplate
        // 
//        internal virtual TriggerCollection 
        TriggersInternal: 
        {
            get:function() { return null; } 
        },

        //
        //  Says if this template contains any resource references 
        //
//        internal bool 
        HasResourceReferences: 
        { 
            get:function() { return this.ResourceDependents.Count > 0; }
        }, 

        //
        //  Says if this template contains any resource references for properties on the container
        // 
//        internal bool 
        HasContainerResourceReferences:
        { 
            get:function() { return this.ReadInternalFlag(InternalFlags.HasContainerResourceReferences); } 
        },
 
        //
        //  Says if this template contains any resource references for properties on children
        //
//        internal bool 
        HasChildResourceReferences: 
        {
            get:function() { return this.ReadInternalFlag(InternalFlags.HasChildResourceReferences); } 
        }, 

        // 
        //  Says if this template contains any event handlers
        //
//        internal bool 
        HasEventDependents:
        { 
            get:function() { return (this.EventDependents.Count > 0); }
        }, 
 
        //
        //  Says if this template contains any per-instance values 
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
            get:function() { return this.ReadInternalFlag(InternalFlags.HasLoadedChangeHandler); }, 
            set:function(value) { this.WriteInternalFlag(InternalFlags.HasLoadedChangeHandler, value); }
        }, 
 
        //
        //  Store all the event handlers for this Style TargetType 
        // 
//        internal EventHandlersStore 
        EventHandlersStore:
        { 
            get:function() { return this._eventHandlersStore; }
        },
        //
        // Prefetched values for static resources
        // 
//        internal object[] 
        StaticResourceValues:
        { 
            get:function() { return this._staticResourceValues; },
            set:function(value) { this._staticResourceValues = value; }
        },
 
//        internal HybridDictionary 
        ChildIndexFromChildName: 
        {
            get:function() { return this._childIndexFromChildName; } 
        },

//        internal Dictionary<int, Type> 
        ChildTypeFromChildIndex:
        { 
            get:function() { return this._childTypeFromChildIndex; }
        }, 
 
//        internal int 
        LastChildIndex:
        { 
            get:function() { return this._lastChildIndex; },
            set:function(value) { this._lastChildIndex = value; }
        },
 
//        internal List<String> 
        ChildNames:
        { 
            get:function() { return this._childNames; } 
        },
        
        //
        //  This property
        //  1. Says if this Template is meant to use BuildVisualTree mechanism 
        //     to generate a visual tree.
        //  2. Is used in the following scenario. 
        //     We need to preserve the treeState cache on a container node 
        //     even after all its logical children have been added. This is so that
        //     construction of the style visual tree nodes can consume the cache. 
        //     This method helps us know whether we should retain the cache for
        //     special scenarios when the visual tree is being built via BuildVisualTree
        //
//        internal bool 
        CanBuildVisualTree: 
        {
            get:function() { return this.ReadInternalFlag(InternalFlags.CanBuildVisualTree); }, 
            set:function(value) { this.WriteInternalFlag(InternalFlags.CanBuildVisualTree, value); } 
        }
 

	});
	
    //+--------------------------------------------------------------------------------------------------------------- 
    //
    //  SetTemplateParentValues
    //
    //  This method takes the "template parent values" (those that look like local values in the template), which 
    //  are ordinarily shared, and sets them as local values on the FE/FCE that was just created.  This is used
    //  during serialization. 
    // 
    //+----------------------------------------------------------------------------------------------------------------

//    internal static void 
    FrameworkTemplate.SetTemplateParentValues = function(
                                                      /*string*/ name,
                                                      /*object*/ element,
                                                      /*FrameworkTemplate*/ frameworkTemplate, 
                                                      /*ref ProvideValueServiceProvider*/ provideValueServiceProvider)
    { 
        var childIndex; 

        // Loop through the shared values, and set them onto the element. 

        /*FrugalStructList<ChildRecord>*/var childRecordFromChildIndex;
        /*HybridDictionary*/var childIndexFromChildName;

        // Seal the template, and get the name->index and index->ChildRecord mappings

        if (!frameworkTemplate.IsSealed) 
        {
            frameworkTemplate.Seal(); 
        }

        childIndexFromChildName = frameworkTemplate.ChildIndexFromChildName;
        childRecordFromChildIndex = frameworkTemplate.ChildRecordFromChildIndex; 


        // Calculate the child index 

        childIndex = EnsureStyleHelper().QueryChildIndexFromChildName(name, childIndexFromChildName); 

        // Do we have a ChildRecord for this index (i.e., there's some property set on it)?

        if (childIndex < childRecordFromChildIndex.Count) 
        {
            // Yes, get the record. 

            /*ChildRecord*/var child = childRecordFromChildIndex[childIndex];

            // Loop through the properties which are in some way set on this child

            for (var i = 0; i < child.ValueLookupListFromProperty.Count; i++)
            { 
                // And for each of those properties, loop through the potential values specified in the template
                // for that property on that child. 

                for (var j = 0; j < child.ValueLookupListFromProperty.Entries[i].Value.Count; j++)
                { 
                    // Get this value (in valueLookup)

                    /*ChildValueLookup*/var valueLookup;
                    valueLookup = child.ValueLookupListFromProperty.Entries[i].Value.List[j]; 

                    // See if this value is one that is considered to be locally set on the child element 

                    if (valueLookup.LookupType == ValueLookupType.Simple
                        || 
                        valueLookup.LookupType == ValueLookupType.Resource
                        ||
                        valueLookup.LookupType == ValueLookupType.TemplateBinding)
                    { 

                        // This shared value is for this element, so we'll set it. 

                        /*object*/var value = valueLookup.Value;

                        // If this is a TemplateBinding, put on an expression for it, so that it can
                        // be represented correctly (e.g. for serialization).  Otherwise, keep it as an ME.

                        if (valueLookup.LookupType == ValueLookupType.TemplateBinding) 
                        {
                            value = new TemplateBindingExpression(value instanceof TemplateBindingExtension ? value : null); 

                        }

                        // Dynamic resources need to be converted to an expression also.

                        else if (valueLookup.LookupType == ValueLookupType.Resource)
                        { 
                            value = new ResourceReferenceExpression(value);
                        } 

                        // Bindings are handled as just an ME

                        // Set the value directly onto the element.

                        /*MarkupExtension*/var me = value instanceof MarkupExtension ? value : null;

                        if (me != null)
                        { 
                            // This is provided for completeness, but really there's only a few 
                            // MEs that survive TemplateBamlRecordReader.  E.g. NullExtension would
                            // have been converted to a null by now.  There's only a few MEs that 
                            // are preserved, e.g. Binding and DynamicResource.  Other MEs, such as
                            // StaticResource, wouldn't be able to ProvideValue here, because we don't
                            // have a ParserContext.

                            if (provideValueServiceProvider == null)
                            { 
                                provideValueServiceProvider = new ProvideValueServiceProvider(); 
                            }

                            provideValueServiceProvider.SetData(element, valueLookup.Property);
                            value = me.ProvideValue(provideValueServiceProvider);
                            provideValueServiceProvider.ClearData();
                        } 

                        (element instanceof DependencyObject ? element : null).SetValue(valueLookup.Property, value); //sharedDp.Dp, value ); 

                    }
                } 
            }
        }
    };
    
    FrameworkTemplate.TemplateChildLoadedFlags = TemplateChildLoadedFlags;
    
	FrameworkTemplate.Type = new Type("FrameworkTemplate", FrameworkTemplate, [DispatcherObject.Type]);
	return FrameworkTemplate;
});

//    /// <summary>
//    ///     A generic class that allow instantiation of a 
//    ///     tree of Framework[Content]Elements.
//    /// </summary>
//
//    // The ContentProperty really isn't VisualTree in WPF4 and later.  Right now, we continue to lie for compat with Cider. 
//    public abstract class FrameworkTemplate : DispatcherObject, INameScope, ISealable, IHaveResources, IQueryAmbient 
//    {
// 
//        /// <summary>
//        /// </summary>
//        protected FrameworkTemplate()
//        { 
//        }
// 

