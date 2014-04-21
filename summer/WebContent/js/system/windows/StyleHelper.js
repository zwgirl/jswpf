/**
 * StyleHelper
 */

define(["dojo/_base/declare", "system/Type",  "windows/EffectiveValueEntry", "windows/UncommonField", "windows/ISealable",
        "windows/ValueLookupType", "windows/ChildEventDependent", 
        "windows/DeferredReference", "markup/MarkupExtension", "windows/Freezable", "windows/ChildRecord", "utility/ItemStructList",
        "windows/ChildValueLookup", "windows/ContainerDependent", "generic/List",
        "windows/TriggerSourceRecord", "windows/ChildPropertyDependent", "windows/SystemResources",
        "windows/InstanceStyleData", "markup/ProvideValueServiceProvider", "windows/MultiTrigger", "windows/DataTriggerRecord",
        "data/BindingExpressionBase"], 
		function(declare, Type,  EffectiveValueEntry, UncommonField, ISealable,
				ValueLookupType, ChildEventDependent, 
				DeferredReference, MarkupExtension, Freezable, ChildRecord, ItemStructList,
				ChildValueLookup, ContainerDependent, List,
				TriggerSourceRecord, ChildPropertyDependent, SystemResources,
				InstanceStyleData, ProvideValueServiceProvider, MultiTrigger, DataTriggerRecord,
				BindingExpressionBase){
	
    // 
    //  When an unshareable value appears in the property value list, we store the 
    //  corresponding "instance value" in per-instance StyleData.  More precisely,
    //  the instance value is stored in a hash table, using the following class 
    //  as the key (so we know where the value came from).
    //
//    internal class 
	var InstanceValueKey = declare(null, { 
 
        constructor:function(/*int*/ childIndex, /*int*/ dpIndex, /*int*/ index) 
        {
            this._childIndex = childIndex; 
            this._dpIndex = dpIndex;
            this._index = index;
        },
 
 
//        public override bool 
        Equals:function(/*object*/ o) 
        {
            if(!(o instanceof InstanceValueKey))
            	return false; 
            
            return (this._childIndex == o._childIndex) && (this._dpIndex == o._dpIndex) && (this._index == o._index);
        },
 
//        public override int 
        GetHashCode:function() 
        {
            return (20000*this._childIndex + 20*this._dpIndex + this._index); 
        }


    });
	
	Object.defineProperties(InstanceValueKey, {
        // the origin of the instance value in the container's style:
//        int 
		_childIndex:// the childIndex of the target element 
		{
			get:function(){return this.__childIndex;},
			set:function(value){this.__childIndex = value;}
		},    
//        int 
		_dpIndex:       // the global index of the target DP
		{
			get:function(){return this.__dpIndex;},
			set:function(value){this.__dpIndex = value;}
		},
//        int 
		_index:         // the index in the ItemStructList<ChildValueLookup> 
		{
			get:function(){return this.__index;},
			set:function(value){this.__index = value;}
		}
	});
	
    
    // 
    //  The property engine's API for the "alternative Expression storage" 
    //  feature are set in the static ctor.
//    private static AlternativeExpressionStorageCallback 
    var _getExpression = null; 

	var StyleHelper = declare("StyleHelper", null,{
	});
	
	var Control = null;
	function EnsureControl(){
		if(Control == null){
			Control = using("controls/Control");
		}
		return Control;
	}
	
	var FrameworkElement = null;
	function EnsureFrameworkElement(){
		if(FrameworkElement == null){
			FrameworkElement = using("windows/FrameworkElement");
		}
		return FrameworkElement;
	}
	
	var ContentPresenter = null;
	function EnsureContentPresenter(){
		if(ContentPresenter == null){
			ContentPresenter = using("controls/ContentPresenter");
		}
		return ContentPresenter;
	}
	
	Object.defineProperties(StyleHelper,{
//	    internal static readonly UncommonField<HybridDictionary[]> 
	    StyleDataField:
	    {
	    	get:function(){
	    		if(StyleHelper._StyleDataField === undefined){
	    			StyleHelper._StyleDataField = new UncommonField();
	    		}
	    		return StyleHelper._StyleDataField;
	    	}
	    },

	    //
	    //  Stores instance state of a template 
	    // 
//	    internal static readonly UncommonField<HybridDictionary[]> 
	    TemplateDataField:
	    {
	    	get:function(){
	    		if(StyleHelper._TemplateDataField === undefined){
	    			StyleHelper._TemplateDataField = new UncommonField();
	    		}
	    		return StyleHelper._TemplateDataField;
	    	}
	    },

	    //
	    //  Stores per-instance template property values.  E.g. this is used for a template child value
	    //  if it's a Freezable within a DynamicResource inside (and thus can't be shared).
	    // 
//	    internal static readonly UncommonField<HybridDictionary> 
	    ParentTemplateValuesField:
	    {
	    	get:function(){
	    		if(StyleHelper._ParentTemplateValuesField === undefined){
	    			StyleHelper._ParentTemplateValuesField = new UncommonField();
	    		}
	    		return StyleHelper._ParentTemplateValuesField;
	    	}
	    }, 

	    // 
	    //  Stores instance state of a theme style
	    // 
//	    internal static readonly UncommonField<HybridDictionary[]> 
	    ThemeStyleDataField:
	    {
	    	get:function(){
	    		if(StyleHelper._ThemeStyleDataField === undefined){
	    			StyleHelper._ThemeStyleDataField = new UncommonField();
	    		}
	    		return StyleHelper._ThemeStyleDataField;
	    	}
	    },

	    //
	    //  A list of all children created from the Style/Template that is an FE/FCE. This list is built 
	    //  such that all elements with non-negative child indices come first.Once
	    //  you see a child with TemplateChildIndex = -1 there are no more "interesting" 
	    //  children after that. 
	    //
//	    internal static readonly UncommonField<List<DependencyObject>> 
	    TemplatedFeChildrenField:
	    {
	    	get:function(){
	    		if(StyleHelper._TemplatedFeChildrenField === undefined){
	    			StyleHelper._TemplatedFeChildrenField = new UncommonField();
	    		}
	    		return StyleHelper._TemplatedFeChildrenField;
	    	}
	    }, 

	    //
	    //  A list of all named objects created from the Template that is *not* an FE/FCE.
	    // 

//	    internal static readonly UncommonField<Hashtable> 
	    TemplatedNonFeChildrenField:
	    {
	    	get:function(){
	    		if(StyleHelper._TemplatedNonFeChildrenField === undefined){
	    			StyleHelper._TemplatedNonFeChildrenField = new UncommonField();
	    		}
	    		return StyleHelper._TemplatedNonFeChildrenField;
	    	}
	    }, 

	    //  "Self" ChildName, maps to ChildIndex 0 to represent
	    //  the Container for a Style/Template 
	    //
//	    internal const string 
	    SelfName:{
	    	get:function(){
	    		return "~Self";
	    	}
	    },

	    //
	    //  Delegate used for performing the actions associated with
	    //  an event trigger.  [Style/Template].ProcessEventTrigger will add this to the 
	    //  list of delegates to be consulted, and FrameworkElement.AddStyleHandlersToEventRoute
	    //  is the one that takes the list and add to the actual event route. 
	    // 
//	    internal static RoutedEventHandler 
	    EventTriggerHandlerOnContainer:
	    {
	    	get:function(){
	    		if(StyleHelper._EventTriggerHandlerOnContainer === undefined){
	    			StyleHelper._EventTriggerHandlerOnContainer = new RoutedEventHandler(null, ExecuteEventTriggerActionsOnContainer);
	    		}
	    		
	    		return StyleHelper._EventTriggerHandlerOnContainer;
	    	}
	    },
//	    internal static RoutedEventHandler 
	    EventTriggerHandlerOnChild:
	    {
	    	get:function(){
	    		if(StyleHelper._EventTriggerHandlerOnChild === undefined){
	    			StyleHelper._EventTriggerHandlerOnChild = new RoutedEventHandler(null, ExecuteEventTriggerActionsOnChild);
	    		}
	    		
	    		return StyleHelper._EventTriggerHandlerOnChild;
	    	}
	    },
	    
	    // 
	    // Used to pass an empty stucture reference when the parent style/template is null
	    // 
//	    internal static FrugalStructList<ContainerDependent>  
	    EmptyContainerDependents:
	    {
	    	get:function(){
	    		if(StyleHelper._EmptyContainerDependents == undefined){
	    			StyleHelper._EmptyContainerDependents = new FrugalStructList();
	    		}
	    		
	    		return StyleHelper._EmptyContainerDependents;
	    	}
	    }
	    
	});
	
//    internal const int 
    StyleHelper.UnsharedTemplateContentPropertyIndex = -1; 
    
    // 
    // Certain instance values are "applied" only on demand.  This value indicates that
    // the demand hasn't happened yet.
    //
//    internal static readonly object 
    StyleHelper.NotYetApplied = {"name" : "NotYetApplied"}; 
    

    //  This method 
    //  1. Updates the style cache for the given fe/fce
    // 
//    internal static void 
    StyleHelper.UpdateStyleCache = function( 
        /*FrameworkElement*/        fe,
        /*FrameworkContentElement*/ fce, 
        /*Style*/                   oldStyle,
        /*Style*/                   newStyle,
        /*ref Style               styleCache*/styleCacheRef)
    { 
        if (newStyle != null) 
        {
            // We have a new style.  Make sure it's targeting the right 
            // type, and then seal it.

            /*DependencyObject*/var d = fe;
            if (d == null) 
            {
                d = fce; 
            } 
            newStyle.CheckTargetType(d);
            newStyle.Seal(); 
        }

//        styleCacheRef.styleCache = newStyle;   //cym comment

        // Do style property invalidations. Note that some of the invalidations may be callouts
        // that could turn around and query the style property on this node. Hence it is essential 
        // to update the style cache before we do this operation. 
        StyleHelper.DoStyleInvalidations(fe, fce, oldStyle, newStyle);

        // Now look for triggers that might want their EnterActions or ExitActions
        //  to run immediately.
        ExecuteOnApplyEnterExitActions(fe, fce, newStyle, StyleHelper.StyleDataField);
    };

    // 
    //  This method 
    //  1. Updates the theme style cache for the given fe/fce
    // 
//    internal static void 
    StyleHelper.UpdateThemeStyleCache = function(
        /*FrameworkElement*/        fe,
        /*FrameworkContentElement*/ fce,
        /*Style*/                   oldThemeStyle, 
        /*Style*/                   newThemeStyle,
        /*ref Style               themeStyleCache*/themeStyleCacheRef) 
    { 
        if (newThemeStyle != null)
        {
            /*DependencyObject*/var d = fe;
            if (d == null) 
            {
                d = fce; 
            } 
            newThemeStyle.CheckTargetType(d);
            newThemeStyle.Seal(); 

            // Check if the theme style has the OverridesDefaultStyle  property set on the target tag or any of its
            // visual triggers. It is an error to specify the OverridesDefaultStyle  in your own ThemeStyle. 
            if (StyleHelper.IsSetOnContainer(EnsureFrameworkElement().OverridesDefaultStyleProperty, /*ref*/ newThemeStyle.ContainerDependents, true))
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.CannotHaveOverridesDefaultStyleInThemeStyle)'); 
            }
            // Check if the theme style has EventHandlers set on the target tag or int its setter collection. 
            // We do not support EventHandlers in a ThemeStyle
            if (newThemeStyle.HasEventSetters)
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.CannotHaveEventHandlersInThemeStyle)'); 
            }
        } 

        themeStyleCacheRef.themeStyleCache = newThemeStyle; 

        /*Style*/var style = null;

        if (fe != null) 
        {
            if(ShouldGetValueFromStyle(EnsureFrameworkElement().DefaultStyleKeyProperty ) ) 
            { 
                style = fe.Style;
            } 
        }
        else
        {
            if(ShouldGetValueFromStyle(FrameworkContentElement.DefaultStyleKeyProperty ) ) 
            {
                style = fce.Style; 
            } 
        }

        // Do theme style property invalidations. Note that some of the invalidations may be callouts
        // that could turn around and query the theme style property on this node. Hence it is essential
        // to update the theme style cache before we do this operation.
        StyleHelper.DoThemeStyleInvalidations(fe, fce, oldThemeStyle, newThemeStyle, style); 

        // Now look for triggers that might want their EnterActions or ExitActions 
        //  to run immediately. 
        ExecuteOnApplyEnterExitActions(fe, fce, newThemeStyle, StyleHelper.ThemeStyleDataField);
    };

    //
    //  This method
    //  1. Find the ThemeStyle for the given Framework[Content]Element 
    //  2. Checks for a self-reference, but does not check for loops.
    //     The caller (Seal() or anybody else) is expected to call 
    //     CheckForCircularBasedOnReferences() to check for this condition. 
    //
//    internal static Style 
    StyleHelper.GetThemeStyle = function(/*FrameworkElement*/ fe, /*FrameworkContentElement*/ fce) 
    {
        // Fetch the DefaultStyleKey and the self Style for 
        // the given Framework[Content]Element
        /*object*/var themeStyleKey = null; 
        /*Style*/var selfStyle = null; 
        /*Style*/var oldThemeStyle = null;
        /*Style*/var newThemeStyle = null; 
        /*bool*/var overridesDefaultStyle;
        if (fe != null)
        {
            // If this is the first time that the ThemeStyleProperty 
            // is being fetched then mark it such
            fe.HasThemeStyleEverBeenFetched = true; 

            themeStyleKey = fe.DefaultStyleKey;
            overridesDefaultStyle = fe.OverridesDefaultStyle; 
            if(ShouldGetValueFromStyle(EnsureFrameworkElement().DefaultStyleKeyProperty))
            {
                selfStyle = fe.Style;
            } 
            oldThemeStyle = fe.ThemeStyle;
        } 
        else 
        {
            // If this is the first time that the ThemeStyleProperty 
            // is being fetched then mark it such
            fce.HasThemeStyleEverBeenFetched = true;

            themeStyleKey = fce.DefaultStyleKey; 
            overridesDefaultStyle = fce.OverridesDefaultStyle;
            if(ShouldGetValueFromStyle ( FrameworkContentElement.DefaultStyleKeyProperty) ) 
            { 
                selfStyle = fce.Style;
            } 
            oldThemeStyle = fce.ThemeStyle;
        }

        // Don't lookup properties from the themes if user has specified OverridesDefaultStyle 
        // or DefaultStyleKey = null
        if (themeStyleKey != null && !overridesDefaultStyle) 
        { 
            // Fetch the DependencyObjectType for the ThemeStyleKey
            /*DependencyObjectType*/var dTypeKey; 
            if (fe != null)
            {
                dTypeKey = fe.DTypeThemeStyleKey;
            } 
            else
            { 
                dTypeKey = fce.DTypeThemeStyleKey; 
            }

            // First look for an applicable style in system resources
            /*object*/var styleLookup;
            if (dTypeKey != null && dTypeKey.SystemType != null && dTypeKey.SystemType.Equals(themeStyleKey))
            { 
                // Optimized lookup based on the DependencyObjectType for the DefaultStyleKey
                styleLookup = SystemResources.FindThemeStyle(dTypeKey); 
            } 
            else
            { 
                // Regular lookup based on the DefaultStyleKey. Involves locking and Hashtable lookup
                styleLookup = SystemResources.FindResourceInternal(themeStyleKey);
            }

            if( styleLookup != null )
            { 
                if( styleLookup instanceof Style ) 
                {
                    // We have found an applicable Style in system resources 
                    //  let's us use that as second stop to find property values.
                    newThemeStyle = /*(Style)*/styleLookup;
                }
                else 
                {
                    // We found something keyed to the ThemeStyleKey, but it's not 
                    //  a style.  This is a problem, throw an exception here. 
                    throw new Error('InvalidOperationException(SR.Get(SRID.SystemResourceForTypeIsNotStyle, themeStyleKey)'); 
                }
            }

            if (newThemeStyle == null) 
            {
                // No style in system resources, try to retrieve the default 
                //  style for the target type. 
                /*Type*/
            	var themeStyleTypeKey = themeStyleKey instanceof Type ? themeStyleKey : null;
                if (themeStyleTypeKey != null) 
                {
                    /*PropertyMetadata*/
                	var styleMetadata =
                		EnsureFrameworkElement().StyleProperty.GetMetadata(themeStyleTypeKey);

                    if( styleMetadata != null )
                    { 
                        // Have a metadata object, get the default style (if any) 
                        newThemeStyle = styleMetadata.DefaultValue instanceof Style ? styleMetadata.DefaultValue : null;
                    } 
                }
            }

        } 

        // Propagate change notification 
        if (oldThemeStyle != newThemeStyle) 
        {
            if (fe != null) 
            {
            	EnsureFrameworkElement().OnThemeStyleChanged(fe, oldThemeStyle, newThemeStyle);
            }
            else 
            {
                FrameworkContentElement.OnThemeStyleChanged(fce, oldThemeStyle, newThemeStyle); 
            } 
        }

        return newThemeStyle;
    };



    // 
    //  This method 
    //  1. Updates the template cache for the given fe/fce
    // 
//    internal static void 
    StyleHelper.UpdateTemplateCache = function(
        /*FrameworkElement*/        fe,
        /*FrameworkTemplate*/       oldTemplate,
        /*FrameworkTemplate*/       newTemplate, 
        /*DependencyProperty*/      templateProperty)
    { 
        /*DependencyObject*/
    	var d = fe; 

        if (newTemplate != null) 
        {
            newTemplate.Seal();

        } 

        // Update the template cache
        fe.TemplateCache = newTemplate;

        // Do template property invalidations. Note that some of the invalidations may be callouts
        // that could turn around and query the template property on this node. Hence it is essential 
        // to update the template cache before we do this operation. 
        StyleHelper.DoTemplateInvalidations(fe, oldTemplate);

        // Now look for triggers that might want their EnterActions or ExitActions
        //  to run immediately.
        ExecuteOnApplyEnterExitActions(fe, null, newTemplate);
    };

    //
    //  This method 
    //  1. Seals a template 
    //
//    internal static void 
    StyleHelper.SealTemplate = function( 
        /*FrameworkTemplate*/                                           frameworkTemplate,
        /*ref bool                                                    isSealed*/
        isSealedRef,
        /*FrameworkElementFactory*/                                     templateRoot,
        /*TriggerCollection*/                                           triggers, 
        /*ResourceDictionary*/                                          resources,
        /*HybridDictionary*/                                            childIndexFromChildID, 
        /*ref FrugalStructList<ChildRecord>*/                           childRecordFromChildIndex, 
       /* ref FrugalStructList<ItemStructMap<TriggerSourceRecord>>*/    triggerSourceRecordFromChildIndex,
        /*ref FrugalStructList<ContainerDependent>*/                    containerDependents, 
        /*ref FrugalStructList<ChildPropertyDependent>*/                resourceDependents,
        /*ref ItemStructList<ChildEventDependent>*/                     eventDependents,
        /*ref HybridDictionary*/                                        triggerActions,
        /*ref HybridDictionary*/                                        dataTriggerRecordFromBinding, 
        /*ref bool                                                    hasInstanceValues*/
        hasInstanceValuesRef,
        /*ref EventHandlersStore*/                                      eventHandlersStore) 
    { 
        // This template has already been sealed.
        // There is no more to do.
        if (isSealedRef.isSealed)
        { 
            return;
        } 

        // Seal template nodes (if exists)


        if (frameworkTemplate != null)
        {
            frameworkTemplate.ProcessTemplateBeforeSeal(); 
        }


        if (templateRoot != null)
        { 
            //frameworkTemplate.ProcessTemplateBeforeSeal(); 
            templateRoot.Seal(frameworkTemplate); 
        }

        // Seal triggers
        if (triggers != null)
        {
            triggers.Seal(); 
        }

        // Seal Resource Dictionary 
        if (resources != null)
        { 
            resources.IsReadOnly = true;
        }

        //  Build shared tables 

        if (templateRoot != null) 
        { 
            // This is a FEF-style template.  Process the root node, and it will
            // recurse through the rest of the FEF tree. 

            StyleHelper.ProcessTemplateContentFromFEF(
                            templateRoot,
                            /*ref*/ childRecordFromChildIndex, 
                            /*ref*/ triggerSourceRecordFromChildIndex,
                            /*ref*/ resourceDependents, 
                            /*ref*/ eventDependents, 
                            /*ref*/ dataTriggerRecordFromBinding,
                            childIndexFromChildID, 
                            /*ref*/ hasInstanceValuesRef);
        }

        // Process Triggers. (Trigger PropertyValues are inserted 
        // last into the Style/Template GetValue chain because they
        // are the highest priority) 

        /*bool*/var hasHandler = false;

        var hasHandlerRef = {
        	"hasHandler" : hasHandler
        }; 
        ProcessTemplateTriggers(
            triggers, 
            frameworkTemplate,
            /*ref*/ childRecordFromChildIndex, 
            /*ref*/ triggerSourceRecordFromChildIndex, /*ref*/ containerDependents, /*ref*/ resourceDependents, /*ref*/ eventDependents, 
            /*ref*/ dataTriggerRecordFromBinding, childIndexFromChildID, /*ref*/ hasInstanceValuesRef,
            /*ref*/ triggerActions, templateRoot, /*ref*/ eventHandlersStore, 
            /*ref*/ frameworkTemplate.PropertyTriggersWithActions,
            /*ref*/ frameworkTemplate.DataTriggersWithActions,
            /*ref hasHandler*/hasHandlerRef );
        
        hasHandler = hasHandlerRef.hasHandler;

        frameworkTemplate.HasLoadedChangeHandler = hasHandler;

        frameworkTemplate.SetResourceReferenceState(); 

        // All done, seal self and call it a day. 
        isSealedRef.isSealed = true;

        // Remove thread affinity so it can be accessed across threads
//        frameworkTemplate.DetachFromDispatcher(); 

        // Check if the template has the Template property set on the container via its visual triggers. 
        // It is an error to specify the TemplateProperty in your own Template. 
        if (StyleHelper.IsSetOnContainer(EnsureControl().TemplateProperty, /*ref*/ containerDependents, true) ||
            StyleHelper.IsSetOnContainer(EnsureContentPresenter().TemplateProperty, /*ref*/ containerDependents, true)) 
        {
            throw new InvalidOperationException(SR.Get(SRID.CannotHavePropertyInTemplate, Control.TemplateProperty.Name));
        }

        // Check if the template has the Style property set on the container via its visual triggers.
        // It is an error to specify the StyleProperty in your own Template. 
        if (StyleHelper.IsSetOnContainer(EnsureFrameworkElement().StyleProperty, /*ref*/ containerDependents, true)) 
        {
            throw new InvalidOperationException(SR.Get(SRID.CannotHavePropertyInTemplate, FrameworkElement.StyleProperty.Name)); 
        }

        // Check if the template has the DefaultStyleKey property set on the container via its visual triggers.
        // It is an error to specify the DefaultStyleKeyProperty in your own Template. 
        if (StyleHelper.IsSetOnContainer(EnsureFrameworkElement().DefaultStyleKeyProperty, /*ref*/ containerDependents, true))
        { 
            throw new InvalidOperationException(SR.Get(SRID.CannotHavePropertyInTemplate, FrameworkElement.DefaultStyleKeyProperty.Name)); 
        }

        // Check if the template has the OverridesDefaultStyle property set on the container via its visual triggers.
        // It is an error to specify the OverridesDefaultStyleProperty in your own Template.
        if (StyleHelper.IsSetOnContainer(EnsureFrameworkElement().OverridesDefaultStyleProperty, /*ref*/ containerDependents, true))
        { 
            throw new InvalidOperationException(SR.Get(SRID.CannotHavePropertyInTemplate, FrameworkElement.OverridesDefaultStyleProperty.Name));
        } 

        // Check if the template has the Name property set on the container via its visual triggers.
        // It is an error to specify the Name in your own Template. 
        if (StyleHelper.IsSetOnContainer(EnsureFrameworkElement().NameProperty, /*ref*/ containerDependents, true))
        {
            throw new InvalidOperationException(SR.Get(SRID.CannotHavePropertyInTemplate, FrameworkElement.NameProperty.Name));
        } 
    };



    // 
    //  All table datastructures read-lock-free/write-lock
    //  UpdateTables writes the datastructures, locks set by callers
    //
    //  This method 
    //  1. Adds a ChildValueLookup entry to the given ChildRecord.
    //     This is used in value computation. 
    //  2. Optionally adds a ChildPropertyDependent entry to the given 
    //     ContainerRecordFromProperty list. This is used to invalidate
    //     container dependents. 
    //  3. Optionally adds a ChildPropertyDependent entry to the given
    //     ResourceDependents list. This is used when invalidating resource
    //     references
    // 
//    internal static void 
    StyleHelper.UpdateTables = function(
        /*ref PropertyValue*/                                           propertyValue, 
        /*ref FrugalStructList<ChildRecord>*/                           childRecordFromChildIndex, 
        /*ref FrugalStructList<ItemStructMap<TriggerSourceRecord>>*/    triggerSourceRecordFromChildIndex,
        /*ref FrugalStructList<ChildPropertyDependent>*/                resourceDependents, 
       /* ref HybridDictionary*/                                        dataTriggerRecordFromBinding,
        /*HybridDictionary*/                                            childIndexFromChildName,
/*        ref bool                                                    hasInstanceValues*/
        hasInstanceValuesRef)
    { 
        //
        //  Record instructions for Child/Self value computation 
        // 

        // Query for child index (may be 0 if "self") 
        var childIndex = StyleHelper.QueryChildIndexFromChildName(propertyValue.ChildName, childIndexFromChildName);
        if (childIndex == -1)
        {
            throw new Error('InvalidOperationException(SR.Get(SRID.NameNotFound, propertyValue.ChildName)'); 
        }

        /*object*/
        var value = propertyValue.ValueInternal; 
        var valueRef = {
        	"value" : value	
        };
        /*bool*/var requiresInstanceStorage = StyleHelper.RequiresInstanceStorage(/*ref value*/valueRef);
        value = valueRef.value;
        propertyValue.ValueInternal = value; 

        childRecordFromChildIndex.EnsureIndex(childIndex, ChildRecord);
        /*ChildRecord*/
        var childRecord = childRecordFromChildIndex.Get(childIndex);

        /*int*/
        var mapIndex = childRecord.ValueLookupListFromProperty.EnsureEntry(propertyValue.Property.GlobalIndex, 
        		new ItemStructList(1, ChildValueLookup));

        /*ChildValueLookup*/
        var valueLookup = new ChildValueLookup(); 
        valueLookup.LookupType = propertyValue.ValueType; // Maps directly to ValueLookupType for applicable values
        valueLookup.Conditions = propertyValue.Conditions; 
        valueLookup.Property = propertyValue.Property;
        valueLookup.Value = propertyValue.ValueInternal;

        childRecord.ValueLookupListFromProperty.Entries[mapIndex].Value.Add(/*ref*/ valueLookup); 

        // Put back modified struct 
        childRecordFromChildIndex.Set(childIndex, childRecord); 

        // 
        //  Container property invalidation
        //

        switch (/*(ValueLookupType)*/propertyValue.ValueType) 
        {
        case ValueLookupType.Simple: 
            { 
        	hasInstanceValuesRef.hasInstanceValues |= requiresInstanceStorage;
            } 
            break;

        case ValueLookupType.Trigger:
        case ValueLookupType.PropertyTriggerResource: 
            {
                if( propertyValue.Conditions != null ) 
                { 
                    // Record the current property as a dependent to each on of the
                    // properties in the condition. This is to facilitate the invalidation 
                    // of the current property in the event that any one of the properties
                    // in the condition change. This will allow the current property to get
                    // re-evaluated.
                    for (var i = 0; i < propertyValue.Conditions.length; i++) 
                    {
                        var sourceChildIndex = propertyValue.Conditions[i].SourceChildIndex; 
                        triggerSourceRecordFromChildIndex.EnsureIndex(sourceChildIndex, ItemStructMap); 
                        /*ItemStructMap<TriggerSourceRecord>*/
                        var triggerSourceRecordMap = triggerSourceRecordFromChildIndex.Get(sourceChildIndex);

                        if (propertyValue.Conditions[i].Property == null)
                        {
                            throw new Error('InvalidOperationException(SR.Get(SRID.MissingTriggerProperty)');
                        } 
                        var index = triggerSourceRecordMap.EnsureEntry(propertyValue.Conditions[i].Property.GlobalIndex, new TriggerSourceRecord());
                        AddPropertyDependent(childIndex, propertyValue.Property, 
                            /*ref*/ triggerSourceRecordMap.Entries[index].Value.ChildPropertyDependents); 

                        // Store the triggerSourceRecordMap back into the list after it has been updated 
                        triggerSourceRecordFromChildIndex.Set(sourceChildIndex, triggerSourceRecordMap);
                    }

                    // If value is a resource reference, add dependent on resource changes 
                    if (/*(ValueLookupType)*/propertyValue.ValueType == ValueLookupType.PropertyTriggerResource)
                    { 
                    	AddResourceDependent(childIndex, propertyValue.Property, 
                    			propertyValue.ValueInternal, /*ref*/ resourceDependents); 
                    }
                } 

                // values in a Trigger may require per-instance storage
                if (/*(ValueLookupType)*/propertyValue.ValueType != ValueLookupType.PropertyTriggerResource)
                { 
                	hasInstanceValuesRef.hasInstanceValues |= requiresInstanceStorage;
                } 
            } 
            break;

        case ValueLookupType.DataTrigger:
        case ValueLookupType.DataTriggerResource:
            {
                if( propertyValue.Conditions != null ) 
                {
                    if (dataTriggerRecordFromBinding == null) 
                    { 
                        dataTriggerRecordFromBinding = new HybridDictionary();
                    } 

                    // Record container conditional child property dependents
                    for (var i = 0; i < propertyValue.Conditions.length; i++)
                    { 
                        /*DataTriggerRecord*/
                    	var record = dataTriggerRecordFromBinding.Get(propertyValue.Conditions[i].Binding);
                        if (record == null) 
                        { 
                            record = new DataTriggerRecord();
                            dataTriggerRecordFromBinding.Set(propertyValue.Conditions[i].Binding, record); 
                        }

                        // Add dependent on trigger
                        AddPropertyDependent(childIndex, propertyValue.Property, 
                            /*ref*/ record.Dependents);
                    } 

                    // If value is a resource reference, add dependent on resource changes
                    if (/*(ValueLookupType)*/propertyValue.ValueType == ValueLookupType.DataTriggerResource) 
                    {
                    	AddResourceDependent(childIndex, propertyValue.Property, 
                    			propertyValue.ValueInternal, /*ref*/ resourceDependents);
                    }
                } 

                // values in a DataTrigger may require per-instance storage 
                if (/*(ValueLookupType)*/propertyValue.ValueType != ValueLookupType.DataTriggerResource) 
                {
                	hasInstanceValuesRef.hasInstanceValues |= requiresInstanceStorage; 
                }
            }
            break;

        case ValueLookupType.TemplateBinding:
            { 
                /*TemplateBindingExtension*/
        	var templateBinding = propertyValue.ValueInternal; 
                /*DependencyProperty*/
        	var destinationProperty = propertyValue.Property; // Child
                /*DependencyProperty*/
        	var sourceProperty = templateBinding.Property; // Container 

                // Record the current property as a dependent to the aliased
                // property on the container. This is to facilitate the
                // invalidation of the current property in the event that the 
                // aliased container property changes. This will allow the current
                // property to get re-evaluated. 
                var sourceChildIndex = 0; // TemplateBinding is always sourced off of the container 
                triggerSourceRecordFromChildIndex.EnsureIndex(sourceChildIndex, ItemStructMap);
                /*ItemStructMap<TriggerSourceRecord>*/
                var triggerSourceRecordMap = triggerSourceRecordFromChildIndex.Get(sourceChildIndex); 

                var index = triggerSourceRecordMap.EnsureEntry(sourceProperty.GlobalIndex, new TriggerSourceRecord());
                AddPropertyDependent(childIndex, destinationProperty, 
                		/*ref*/ triggerSourceRecordMap.Entries[index].Value.ChildPropertyDependents);

                // Store the triggerSourceRecordMap back into the list after it has been updated
                triggerSourceRecordFromChildIndex.Set(sourceChildIndex, triggerSourceRecordMap); 
            } 
            break;

        case ValueLookupType.Resource:
            {
        		AddResourceDependent(childIndex, propertyValue.Property, 
        				propertyValue.ValueInternal, /*ref*/ resourceDependents);
            } 
            break;
        } 
    };

    // 
    //  1. Seal a property value before entering it into the ValueLookup table.
    //  2. Determine If the value requires per-instance storage.
    //
//    private static bool 
    StyleHelper.RequiresInstanceStorage = function(/*ref object value*/valueRef) 
    {
        /*DeferredReference*/var deferredReference = null; 
        /*MarkupExtension*/var markupExtension     = null; 
        /*Freezable*/var freezable                 = null;

        if ((deferredReference = valueRef.value instanceof DeferredReference ? valueRef.value : null) != null)
        {
            /*Type*/var valueType = deferredReference.GetValueType();
            if (valueType != null) 
            {
                if (MarkupExtension.Type.IsAssignableFrom(valueType)) 
                { 
                	valueRef.value = deferredReference.GetValue(BaseValueSourceInternal.Style);
                    if ((markupExtension = valueRef.value instanceof MarkupExtension) == null) 
                    {
                        freezable = valueRef.value instanceof Freezable ? valueRef.value : null;
                    }
                } 
                else if (Freezable.Type.IsAssignableFrom(valueType))
                { 
                    freezable = deferredReference.GetValue(BaseValueSourceInternal.Style); 
                }
            } 

        }
        else if ((markupExtension = valueRef.value instanceof MarkupExtension ? valueRef.value : null) == null)
        { 
            freezable = valueRef.value instanceof Freezable ? valueRef.value : null;
        } 

        var requiresInstanceStorage = false;

        // MarkupExtensions use per-instance storage for the "provided" value
        if (markupExtension != null)
        {
        	valueRef.value = markupExtension; 
            requiresInstanceStorage = true;
        } 

        // Freezables should be frozen, if possible.  Otherwise, they use
        // per-instance storage for a clone. 
        else if (freezable != null)
        {
        	valueRef.value = freezable;

            if (!freezable.CanFreeze)
            { 
                requiresInstanceStorage = true; 
            }
        } 

        return requiresInstanceStorage; 
    };

    // 
    //  All table datastructures read-lock-free/write-lock
    //  AddContainerDependent writes the datastructures, locks set by callers
    //
    //  This method 
    //  1. Adds a ContainerDependent to the ContainerDependents list if not
    //     already present. This is used to invalidate container dependents. 
    // 
//    internal static void 
    StyleHelper.AddContainerDependent = function(
        /*DependencyProperty*/                          dp, 
        /*bool*/                                        fromVisualTrigger,
        /*ref FrugalStructList<ContainerDependent>*/    containerDependents)
    {
        /*ContainerDependent*/var dependent; 

        for (var i = 0; i < containerDependents.Count; i++) 
        { 
            dependent = containerDependents.Get(i);

            if (dp == dependent.Property)
            {
                // If the dp is set on targetType tag and can be set via TriggerBase it is recorded as coming
                // from TriggerBase because that way we are pessimistic in invalidating and always invalidate. 
                dependent.FromVisualTrigger |= fromVisualTrigger;
                return; 
            } 
        }

        dependent = new ContainerDependent();
        dependent.Property = dp;
        dependent.FromVisualTrigger = fromVisualTrigger;
        containerDependents.Add(dependent); 
    };

    // 
    //  All table datastructures read-lock-free/write-lock
    //  AddEventDependent writes the datastructures, locks set by callers 
    //
    //  This method
    //  1. Adds an EventDependent to the EventDependents list. This is used
    //     to lookup events in styles during event routing. 
    //
//    internal static void 
    StyleHelper.AddEventDependent = function( 
        /*int*/                                     childIndex, 
        /*EventHandlersStore*/                      eventHandlersStore,
        /*ref ItemStructList<ChildEventDependent>*/ eventDependents) 
    {
        if (eventHandlersStore != null)
        {
            /*ChildEventDependent*/var dependent = new ChildEventDependent(); 
            dependent.ChildIndex = childIndex; 
            dependent.EventHandlersStore = eventHandlersStore;

            eventDependents.Add(/*ref*/ dependent);
        }
    };

    //
    //  This method 
    //  1. Adds a ChildPropertyDependent entry to the given 
    //     PropertyDependents list. This is used when invalidating
    //     properties dependent upon a certain property on the container. 
    //     The dependent properties could have originated from a Trigger
    //     or from a property alias on a TemplateNode.
    //
//    private static void 
    function AddPropertyDependent( 
        /*int*/                                             childIndex,
        /*DependencyProperty*/                              dp, 
        /*ref FrugalStructList<ChildPropertyDependent>*/    propertyDependents) 
    {
        /*ChildPropertyDependent*/var dependent = new ChildPropertyDependent(); 
        dependent.ChildIndex = childIndex;
        dependent.Property = dp;

        propertyDependents.Add(dependent); 
    }

    // 
    //  This method
    //  1. Adds a ChildPropertyDependent entry to the given 
    //     ResourceDependents list. This is used when invalidating
    //     resource references
    //
//    private static void 
    function AddResourceDependent( 
        /*int*/                                             childIndex,
        /*DependencyProperty*/                              dp, 
        /*object*/                                          name, 
        /*ref FrugalStructList<ChildPropertyDependent>*/    resourceDependents)
    { 
        var add = true;

        for (var i = 0; i < resourceDependents.Count; i++)
        { 
            // Check for duplicate entry
            /*ChildPropertyDependent*/var resourceDependent = resourceDependents.Get(i); 
            if ((resourceDependent.ChildIndex == childIndex) && 
                (resourceDependent.Property == dp) &&
                (resourceDependent.Name == name)) 
            {
                add = false;
                break;
            } 
        }

        if (add) 
        {
            // Since there isn't a duplicate entry, 
            // create and add a new one
            /*ChildPropertyDependent*/var resourceDependent = new ChildPropertyDependent();
            resourceDependent.ChildIndex = childIndex;
            resourceDependent.Property = dp; 
            resourceDependent.Name = name;

            resourceDependents.Add(resourceDependent); 
        }
    } 

    //+---------------------------------------------------------------------------------------------
    //
    //  ProcessTemplateContentFromFEF 
    //
    //  This method walks the FEF tree and builds the shared tables from the property values 
    //  in the FEF. 
    //
    //  For the Baml templates (non-FEF), see the ProcessTemplateContent routine. 
    //
    //+----------------------------------------------------------------------------------------------

//    internal static void 
    StyleHelper.ProcessTemplateContentFromFEF = function( 
        /*FrameworkElementFactory*/                                     factory,
        /*ref FrugalStructList<ChildRecord>*/                           childRecordFromChildIndex, 
        /*ref FrugalStructList<ItemStructMap<TriggerSourceRecord>>*/    triggerSourceRecordFromChildIndex, 
        /*ref FrugalStructList<ChildPropertyDependent>*/                resourceDependents,
        /*ref ItemStructList<ChildEventDependent>*/                     eventDependents, 
        /*ref HybridDictionary*/                                        dataTriggerRecordFromBinding,
        /*HybridDictionary*/                                            childIndexFromChildID,
        /*ref bool                                                    hasInstanceValues*/
        hasInstanceValuesRef)
    { 
        // Process the PropertyValues on the current node
        for (var i = 0; i < factory.PropertyValues.Count; i++) 
        { 
            /*PropertyValue*/var propertyValue = factory.PropertyValues.Get(i);
            StyleHelper.UpdateTables(/*ref*/ propertyValue, /*ref*/ childRecordFromChildIndex, 
                /*ref*/ triggerSourceRecordFromChildIndex, /*ref*/ resourceDependents, /*ref*/ dataTriggerRecordFromBinding,
                childIndexFromChildID, /*ref hasInstanceValues*/hasInstanceValuesRef);
        }

        // Add an entry in the EventDependents list for
        // the current TemplateNode's EventHandlersStore. 
        StyleHelper.AddEventDependent(factory._childIndex, factory.EventHandlersStore, 
            /*ref*/ eventDependents);

        // Traverse the children of this TemplateNode
        factory = factory.FirstChild;
        while (factory != null)
        { 
        	StyleHelper.ProcessTemplateContentFromFEF(factory, /*ref*/ childRecordFromChildIndex, /*ref*/ triggerSourceRecordFromChildIndex, 
            		/*ref*/ resourceDependents,
                /*ref*/ eventDependents, /*ref*/ dataTriggerRecordFromBinding, childIndexFromChildID, hasInstanceValuesRef/*ref hasInstanceValues*/); 

            factory = factory.NextSibling;
        } 
    };

    //
    //  This method 
    //  1. Adds shared table entries for property values set via Triggers
    // 
//    private static void 
    function ProcessTemplateTriggers( 
        /*TriggerCollection*/                                           triggers,
        /*FrameworkTemplate*/                                           frameworkTemplate, 
        /*ref FrugalStructList<ChildRecord>*/                           childRecordFromChildIndex,
        /*ref FrugalStructList<ItemStructMap<TriggerSourceRecord>>*/    triggerSourceRecordFromChildIndex,
        /*ref FrugalStructList<ContainerDependent> */                   containerDependents,
        /*ref FrugalStructList<ChildPropertyDependent> */               resourceDependents, 
        /*ref ItemStructList<ChildEventDependent> */                    eventDependents,
        /*ref HybridDictionary */                                       dataTriggerRecordFromBinding, 
        /*HybridDictionary*/                                            childIndexFromChildID, 
        /*ref bool                                                    hasInstanceValues*/ hasInstanceValuesRef,
        /*ref HybridDictionary*/                                        triggerActions, 
        /*FrameworkElementFactory*/                                     templateRoot,
        /*ref EventHandlersStore*/                                      eventHandlersStore,
        /*ref FrugalMap*/                                               propertyTriggersWithActions,
        /*ref HybridDictionary*/                                        dataTriggersWithActions, 
        /*ref bool                                                    hasLoadedChangeHandler*/ hasLoadedChangeHandlerRef)
    { 
        if (triggers != null) 
        {
            var triggerCount = triggers.Count; 
            for (var i = 0; i < triggerCount; i++)
            {
                /*TriggerBase*/var triggerBase = triggers.Get(i);

                /*Trigger*/var trigger;
                /*MultiTrigger*/var multiTrigger; 
                /*DataTrigger*/var dataTrigger; 
                /*MultiDataTrigger*/var multiDataTrigger;
                /*EventTrigger*/var eventTrigger; 

                var triggerOut = {
                	"trigger" : trigger
                };
                
                var multiTriggerOut = {
                	"multiTrigger" : multiTrigger
                };
                
                var dataTriggerOut = {
                	"dataTrigger" : dataTrigger
                };
                
                var multiDataTriggerOut = {
                    "multiDataTrigger" : multiDataTrigger
                };
                
                var eventTriggerOut = {
                	"eventTrigger" : eventTrigger	
                };
                DetermineTriggerType( triggerBase, /*out trigger*/triggerOut, /*out multiTrigger*/multiTriggerOut, /*out dataTrigger*/dataTriggerOut, 
                		/*out multiDataTrigger*/multiDataTriggerOut, /*out eventTrigger*/eventTriggerOut );
                
                trigger = triggerOut.trigger;
                multiTrigger = multiTriggerOut.multiTrigger;
                dataTrigger = dataTriggerOut.dataTrigger;
                multiDataTrigger = multiDataTriggerOut.multiDataTrigger;
                eventTrigger = eventTriggerOut.eventTrigger;
                
                if ( trigger != null || multiTrigger != null|| 
                    dataTrigger != null || multiDataTrigger != null )
                { 
                    // Update the SourceChildIndex for each of the conditions for this trigger 
                    /*TriggerCondition[]*/var conditions = triggerBase.TriggerConditions;
                    for (var k=0; k<conditions.length; k++) 
                    {
                        conditions[k].SourceChildIndex = StyleHelper.QueryChildIndexFromChildName(conditions[k].SourceName, childIndexFromChildID);
                    }

                    // Set things up to handle Setter values
                    for (var j = 0; j < triggerBase.PropertyValues.Count; j++) 
                    { 
                        /*PropertyValue*/var propertyValue = triggerBase.PropertyValues.Get(j);

                        // Check for trigger rules that act on template children
                        if (propertyValue.ChildName == StyleHelper.SelfName)
                        {
                            // "Self" (container) trigger 

                            // Track properties on the container that are being driven by 
                            // the Template so that they can be invalidated during Template changes 
                            StyleHelper.AddContainerDependent(propertyValue.Property, true /*fromVisualTrigger*/, /*ref*/ containerDependents);
                        } 

                        StyleHelper.UpdateTables(/*ref*/ propertyValue, /*ref*/ childRecordFromChildIndex,
                            /*ref*/ triggerSourceRecordFromChildIndex, /*ref*/ resourceDependents, /*ref*/ dataTriggerRecordFromBinding,
                            childIndexFromChildID, /*ref hasInstanceValues*/hasInstanceValuesRef); 
                    }

                    // Set things up to handle TriggerActions 
                    if( triggerBase.HasEnterActions || triggerBase.HasExitActions )
                    { 
                        if( trigger != null )
                        {
                            StyleHelper.AddPropertyTriggerWithAction( triggerBase, trigger.Property, /*ref*/ propertyTriggersWithActions );
                        } 
                        else if( multiTrigger != null )
                        { 
                            for( var k = 0; k < multiTrigger.Conditions.Count; k++ ) 
                            {
                                /*Condition*/var triggerCondition = multiTrigger.Conditions[k]; 

                                StyleHelper.AddPropertyTriggerWithAction( triggerBase, triggerCondition.Property, /*ref*/ propertyTriggersWithActions );
                            }
                        } 
                        else if( dataTrigger != null )
                        { 
                            StyleHelper.AddDataTriggerWithAction( triggerBase, dataTrigger.Binding, /*ref*/ dataTriggersWithActions ); 
                        }
                        else if( multiDataTrigger != null ) 
                        {
                            for( var k = 0; k < multiDataTrigger.Conditions.Count; k++ )
                            {
                                /*Condition*/var dataCondition = multiDataTrigger.Conditions[k]; 

                                StyleHelper.AddDataTriggerWithAction( triggerBase, dataCondition.Binding, /*ref*/ dataTriggersWithActions ); 
                            } 
                        }
                        else 
                        {
                            throw new InvalidOperationException(SR.Get(SRID.UnsupportedTriggerInTemplate, triggerBase.GetType().Name));
                        }
                    } 
                }
                else if( eventTrigger != null ) 
                { 
                    StyleHelper.ProcessEventTrigger(eventTrigger,
                                                    childIndexFromChildID, 
                                                    /*ref*/ triggerActions,
                                                    /*ref*/ eventDependents,
                                                    templateRoot,
                                                    frameworkTemplate, 
                                                    /*ref*/ eventHandlersStore,
                                                    /*ref hasLoadedChangeHandler*/hasLoadedChangeHandlerRef); 
                } 
                else
                { 
                    throw new InvalidOperationException(SR.Get(SRID.UnsupportedTriggerInTemplate, triggerBase.GetType().Name));
                }
            }
        } 
    }

    // This block of code attempts to minimize the number of 
    //  type operations and assignments involved in figuring out what
    //  trigger type we're dealing here. 
    // Attempted casts are done in the order of decreasing expected frequency.
    //  rearrange as expectations change.
//    private static void 
    function DetermineTriggerType( /*TriggerBase*/ triggerBase,
        /*out Trigger trigger*/triggerOut, /*out MultiTrigger multiTrigger*/multiTriggerOut, 
        /*out DataTrigger dataTrigger*/dataTriggerOut, /*out MultiDataTrigger multiDataTrigger*/ multiDataTriggerOut,
        /*out EventTrigger eventTrigger*/eventTriggerOut ) 
    { 
        if( (triggerOut.trigger = (triggerBase instanceof Trigger ? triggerBase : null)) != null )
        { 
        	multiTriggerOut.multiTrigger = null;
        	dataTriggerOut.dataTrigger = null;
        	multiDataTriggerOut.multiDataTrigger = null;
        	eventTriggerOut.eventTrigger = null; 
        }
        else if( (multiTriggerOut.multiTrigger = (triggerBase instanceof MultiTrigger ? triggerBase : null)) != null ) 
        { 
        	dataTriggerOut.dataTrigger = null;
        	multiDataTriggerOut.multiDataTrigger = null; 
        	eventTriggerOut.eventTrigger = null;
        }
        else if( (dataTriggerOut.dataTrigger = (triggerBase instanceof DataTrigger ? triggerBase : null)) != null )
        { 
        	multiDataTriggerOut.multiDataTrigger = null;
        	eventTriggerOut.eventTrigger = null; 
        } 
        else if( (multiDataTriggerOut.multiDataTrigger = (triggerBase instanceof MultiDataTrigger ? triggerBase : null)) != null )
        { 
        	eventTriggerOut.eventTrigger = null;
        }
        else if( (eventTriggerOut.eventTrigger = (triggerBase instanceof EventTrigger ? triggerBase : null)) != null )
        { 
            ; // Do nothing - eventTrigger is now non-null, and everything else has been set to null.
        } 
        else 
        {
            // None of the above - the caller is expected to throw an exception 
            //  stating that the trigger type is not supported.
        }
    }

    //
    //  This method 
    //  1. Adds the trigger information to the data structure that will be 
    //     used when it's time to add the delegate to the event route.
    // 
//    internal static void 
    StyleHelper.ProcessEventTrigger  = function(
        /*EventTrigger*/                            eventTrigger,
        /*HybridDictionary*/                        childIndexFromChildName,
        /*ref HybridDictionary*/                    triggerActions, 
        /*ref ItemStructList<ChildEventDependent>*/ eventDependents,
        /*FrameworkElementFactory*/                 templateRoot, 
        /*FrameworkTemplate*/                       frameworkTemplate, 
        /*ref EventHandlersStore*/                  eventHandlersStore,
        /*ref bool                                hasLoadedChangeHandler*/
        hasLoadedChangeHandlerRef) 
    {
        if( eventTrigger == null )
        {
            return; 
        }

        // The list of actions associated with the event of this EventTrigger. 
        /*List<TriggerAction>*/var actionsList = null;
        /*bool*/ var               actionsListExisted = true; 
        /*bool*/var                actionsListChanged = false;
        /*TriggerAction*/var       action = null;

        /*FrameworkElementFactory*/var childFef = null; 

        // Find a ChildID for the EventTrigger. 
        if( eventTrigger.SourceName == null ) 
        {
            eventTrigger.TriggerChildIndex = 0; 
        }
        else
        {
            var childIndex = StyleHelper.QueryChildIndexFromChildName(eventTrigger.SourceName, childIndexFromChildName); 

            if( childIndex == -1 ) 
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.EventTriggerTargetNameUnresolvable, eventTrigger.SourceName)');
            } 

            eventTrigger.TriggerChildIndex = childIndex;
        }

        // We have at least one EventTrigger - will need triggerActions
        // if it doesn't already exist 
        if (triggerActions == null) 
        {
            triggerActions = new HybridDictionary(); 
        }
        else
        {
            actionsList = triggerActions.Get(eventTrigger.RoutedEvent);
            actionsList = actionsList instanceof List/*<TriggerAction>*/ ? actionsList : null; 
        }

        // Set up TriggerAction list if one doesn't already exist 
        if (actionsList == null)
        { 
            actionsListExisted = false;
            actionsList = new List/*<TriggerAction>*/();
        }

        for (var i = 0; i < eventTrigger.Actions.Count; i++)
        { 
            action = eventTrigger.Actions.Get(i); 

            // Any reason we shouldn't use this TriggerAction?  Check here. 
            if( false /* No reason not to use it right now */ )
            {
                // continue;
            } 

            // Looks good, add to list. 
//            Debug.Assert(action.IsSealed, "TriggerAction should have already been sealed by this point."); 
            actionsList.Add(action);
            actionsListChanged = true; 
        }

        if (actionsListChanged && !actionsListExisted)
        { 
            triggerActions.Set(eventTrigger.RoutedEvent, actionsList);
        } 


        // Add a special delegate to listen for this event and 
        // fire the trigger.

        if( templateRoot != null || eventTrigger.TriggerChildIndex == 0 )
        { 
            // This is a FEF-style template, or the trigger is keying off of
            // the templated parent. 

            // Get the FEF that is referenced by this trigger.

            if (eventTrigger.TriggerChildIndex != 0)
            {
                childFef = StyleHelper.FindFEF(templateRoot, eventTrigger.TriggerChildIndex);
            } 

            // If this trigger needs the loaded/unloaded events, set the optimization 
            // flag. 

            if (  (eventTrigger.RoutedEvent == EnsureFrameworkElement().LoadedEvent) 
                ||(eventTrigger.RoutedEvent == EnsureFrameworkElement().UnloadedEvent))
            {
                if (eventTrigger.TriggerChildIndex == 0)
                { 
                    // Mark the template to show it has a loaded or unloaded handler

                	hasLoadedChangeHandlerRef.hasLoadedChangeHandler  = true; 
                }
                else 
                {
                    // Mark the FEF to show it has a loaded or unloaded handler

                    childFef.HasLoadedChangeHandler  = true; 
                }
            } 


            // Add a delegate that'll come back and fire these actions. 
            //  This information will be used by FrameworkElement.AddStyleHandlersToEventRoute

            AddDelegateToFireTrigger(eventTrigger.RoutedEvent,
                                                 eventTrigger.TriggerChildIndex, 
                                                 templateRoot,
                                                 childFef, 
                                                 /*ref*/ eventDependents, 
                                                 /*ref*/ eventHandlersStore);
        } 
        else
        {
            // This is a baml-style template.

            // If this trigger needs the loaded/unloaded events, set the optimization
            // flag. 

            if (eventTrigger.RoutedEvent == EnsureFrameworkElement().LoadedEvent
                || 
                eventTrigger.RoutedEvent == EnsureFrameworkElement().UnloadedEvent )
            {
//                FrameworkTemplate.TemplateChildLoadedFlags 
                var templateChildLoadedFlags
                    = frameworkTemplate._TemplateChildLoadedDictionary.Get( eventTrigger.TriggerChildIndex );
                templateChildLoadedFlags = templateChildLoadedFlags instanceof FrameworkTemplate.TemplateChildLoadedFlags ? templateChildLoadedFlags : null; 

                if( templateChildLoadedFlags == null ) 
                { 
                    templateChildLoadedFlags = new FrameworkTemplate.TemplateChildLoadedFlags();
                    frameworkTemplate._TemplateChildLoadedDictionary[ eventTrigger.TriggerChildIndex ] = templateChildLoadedFlags; 
                }

                if( eventTrigger.RoutedEvent == EnsureFrameworkElement().LoadedEvent )
                { 
                    templateChildLoadedFlags.HasLoadedChangedHandler = true;
                } 
                else 
                {
                    templateChildLoadedFlags.HasUnloadedChangedHandler = true; 
                }
            }


            // Add a delegate that'll come back and fire these actions.

            AddDelegateToFireTrigger(eventTrigger.RoutedEvent, 
                                                 eventTrigger.TriggerChildIndex,
                                                 /*ref*/ eventDependents, 
                                                 /*ref*/ eventHandlersStore);
        }
    };

    //
    //  This method 
    //  1. Adds a delegate that will get called during event routing and 
    //     will allow us to invoke the TriggerActions
    // 
//    private static void 
    function AddDelegateToFireTrigger(
        /*RoutedEvent*/                             routedEvent,
        /*int*/                                     childIndex,
        /*FrameworkElementFactory*/                 templateRoot, 
        /*FrameworkElementFactory*/                 childFef,
        /*ref ItemStructList<ChildEventDependent>*/ eventDependents, 
        /*ref EventHandlersStore*/                  eventHandlersStore) 
    {
        if (childIndex == 0) 
        {
            if (eventHandlersStore == null)
            {
                eventHandlersStore = new EventHandlersStore(); 

                // Add an entry in the EventDependents list for 
                // the TargetType's EventHandlersStore. Notice 
                // that the childIndex is 0.
                StyleHelper.AddEventDependent(0, eventHandlersStore, /*ref*/ eventDependents); 
            }
            eventHandlersStore.AddRoutedEventHandler(routedEvent, StyleHelper.EventTriggerHandlerOnContainer, false/* HandledEventsToo */);
        }
        else 
        {
            //FrameworkElementFactory fef = StyleHelper.FindFEF(templateRoot, childIndex); 
            if (childFef.EventHandlersStore == null) 
            {
                childFef.EventHandlersStore = new EventHandlersStore(); 

                // Add an entry in the EventDependents list for
                // the current FEF's EventHandlersStore.
                StyleHelper.AddEventDependent(childIndex, childFef.EventHandlersStore, /*ref*/ eventDependents); 
            }
            childFef.EventHandlersStore.AddRoutedEventHandler(routedEvent, StyleHelper.EventTriggerHandlerOnChild, false/* HandledEventsToo */); 
        } 
    }


    //+----------------------------------------------------------------------------------------
    //
    //  AddDelegateToFireTrigger 
    //
    //  Add the EventTriggerHandlerOnChild to listen for an event, like the above overload 
    //  except this is for baml-style templates, rather than FEF-style. 
    //
    //+--------------------------------------------------------------------------------------- 

//    private static void 
    function AddDelegateToFireTrigger(
        /*RoutedEvent*/                             routedEvent,
        /*int*/                                     childIndex, 
        /*ref ItemStructList<ChildEventDependent>*/ eventDependents,
        /*ref EventHandlersStore*/                  eventHandlersStore) 
    { 
//        Debug.Assert( childIndex != 0 ); // This should go to the other AddDelegateToFireTrigger overload


        if (eventHandlersStore == null)
        {
            eventHandlersStore = new EventHandlersStore(); 
        }

        StyleHelper.AddEventDependent( childIndex, 
                                       eventHandlersStore,
                                       /*ref*/ eventDependents ); 
        eventHandlersStore.AddRoutedEventHandler(routedEvent, StyleHelper.EventTriggerHandlerOnChild,
        		false/* HandledEventsToo */);

    }

    //
    //  This method 
    //  1. If the value is an ISealable and it is not sealed 
    //     and can be sealed, seal it now.
    //  2. Else it returns the value as is. 
    //
//    internal static void 
    StyleHelper.SealIfSealable = function(/*object*/ value)
    {
        // If the value is an ISealable and it is not sealed 
        // and can be sealed, seal it now.
//        /*ISealable*/var sealable = value instanceof ISealable ? value : null; 
    	/*ISealable*/var sealable = ISealable.Type.IsInstanceOfType(value)/* instanceof ISealable*/ ? value : null; 
        if (sealable != null && !sealable.IsSealed && sealable.CanSeal) 
        {
            sealable.Seal(); 
        }
    };

    // 
    //  This method 
    //  1. Is called whenever a Style/Template is [un]applied to an FE/FCE
    //  2. It updates the per-instance StyleData/TemplateData 
    //
//    internal static void 
    StyleHelper.UpdateInstanceData = function(
        /*UncommonField<HybridDictionary[]>*/ dataField,
        /*FrameworkElement*/           fe, 
        /*FrameworkContentElement*/    fce,
        /*Style*/                      oldStyle, 
        /*Style*/                      newStyle, 
        /*FrameworkTemplate*/          oldFrameworkTemplate,
        /*FrameworkTemplate*/          newFrameworkTemplate, 
        /*InternalFlags*/              hasGeneratedSubTreeFlag)
    {
//        Debug.Assert((fe != null && fce == null) || (fe == null && fce != null));

        /*DependencyObject*/var container = (fe != null) ? /*(DependencyObject)*/fe : /*(DependencyObject)*/fce;

        if (oldStyle != null || oldFrameworkTemplate != null ) 
        {
        	StyleHelper.ReleaseInstanceData(dataField, container, fe, fce, oldStyle, oldFrameworkTemplate, hasGeneratedSubTreeFlag); 
        }

        if (newStyle != null || newFrameworkTemplate != null )
        { 
        	StyleHelper.CreateInstanceData(dataField, container, fe, fce, newStyle, newFrameworkTemplate );
        } 
        else 
        {
            dataField.ClearValue(container); 
        }
    };

    // 
    //  This method
    //  1. Is called whenever a new Style/Template is applied to an FE/FCE 
    //  2. It adds per-instance StyleData/TemplateData for the new Style/Template 
    //
//    internal static void 
    StyleHelper.CreateInstanceData = function( 
        /*UncommonField<HybridDictionary[]>*/ dataField,
        /*DependencyObject*/            container,
        /*FrameworkElement*/            fe,
        /*FrameworkContentElement*/     fce, 
        /*Style*/                       newStyle,
        /*FrameworkTemplate*/           newFrameworkTemplate ) 
    { 
//        Debug.Assert((fe != null && fce == null) || (fe == null && fce != null));
//        Debug.Assert((fe != null && fe == container) || (fce != null && fce == container)); 
//        Debug.Assert(newStyle != null || newFrameworkTemplate != null );

        if (newStyle != null)
        { 
            if (newStyle.HasInstanceValues)
            { 
                /*HybridDictionary*/var instanceValues = StyleHelper.EnsureInstanceData(dataField, container, InstanceStyleData.InstanceValues); 
                ProcessInstanceValuesForChild(
                    container, container, 0, instanceValues, true, 
                    /*ref*/ newStyle.ChildRecordFromChildIndex);
            }
        }
        else if (newFrameworkTemplate != null) 
        {
            if (newFrameworkTemplate.HasInstanceValues) 
            { 
                /*HybridDictionary*/var instanceValues = StyleHelper.EnsureInstanceData(dataField, container, InstanceStyleData.InstanceValues);
                ProcessInstanceValuesForChild( 
                    container, container, 0, instanceValues, true,
                    /*ref*/ newFrameworkTemplate.ChildRecordFromChildIndex);
            }
        } 
    };

    // 
    //  This method
    //  1. Adds the new TemplateNode's information to the container's per-instance 
    //     StyleData/TemplateData. (This only makes sense for children created via
    //     FrameworkElementFactory. Children acquired via BuildVisualTree don't use
    //     any property-related funtionality of the Style/Template.)
    // 
//    internal static void 
    StyleHelper.CreateInstanceDataForChild = function(
        /*UncommonField<HybridDictionary[]>*/   dataField, 
        /*DependencyObject*/                    container, 
        /*DependencyObject*/                    child,
        /*int*/                                 childIndex, 
        /*bool*/                                hasInstanceValues,
        /*ref FrugalStructList<ChildRecord>*/   childRecordFromChildIndex)
    {
        if (hasInstanceValues) 
        {
            /*HybridDictionary*/
        	var instanceValues = StyleHelper.EnsureInstanceData(dataField, container, InstanceStyleData.InstanceValues); 
            ProcessInstanceValuesForChild( 
                container, child, childIndex, instanceValues, true,
                /*ref*/ childRecordFromChildIndex); 
        }
    };

    // 
    //  This method
    //  1. Is called whenever a new Style/Template is upapplied from an FE/FCE 
    //  2. It removes per-instance StyleData/TemplateData for the old Style/Template 
    //
//    internal static void 
    StyleHelper.ReleaseInstanceData = function( 
        /*UncommonField<HybridDictionary[]>*/  dataField,
        /*DependencyObject*/            container,
        /*FrameworkElement*/            fe,
        /*FrameworkContentElement*/     fce, 
        /*Style*/                       oldStyle,
        /*FrameworkTemplate*/           oldFrameworkTemplate, 
        /*InternalFlags*/               hasGeneratedSubTreeFlag) 
    {
//        Debug.Assert((fe != null && fce == null) || (fe == null && fce != null)); 
//        Debug.Assert((fe != null && fe == container) || (fce != null && fce == container));
//        Debug.Assert(oldStyle != null || oldFrameworkTemplate != null );

        // Fetch the per-instance data field value 
        /*HybridDictionary[]*/var styleData = dataField.GetValue(container);

        if (oldStyle != null) 
        {
            /*HybridDictionary*/var instanceValues = (styleData != null) ? styleData[InstanceStyleData.InstanceValues] : null; 
            ReleaseInstanceDataForDataTriggers(dataField, instanceValues, oldStyle, oldFrameworkTemplate );
            if (oldStyle.HasInstanceValues)
            {
                ProcessInstanceValuesForChild( 
                    container, container, 0, instanceValues, false,
                    /*ref*/ oldStyle.ChildRecordFromChildIndex); 
            } 
        }
        else if (oldFrameworkTemplate != null) 
        {
            /*HybridDictionary*/var instanceValues = (styleData != null) ? styleData[InstanceStyleData.InstanceValues] : null;
            ReleaseInstanceDataForDataTriggers(dataField, instanceValues, oldStyle, oldFrameworkTemplate );
            if (oldFrameworkTemplate.HasInstanceValues) 
            {
                ProcessInstanceValuesForChild( 
                    container, container, 0, instanceValues, false, 
                    /*ref*/ oldFrameworkTemplate.ChildRecordFromChildIndex);
            } 
        }
        else
        {
            /*HybridDictionary*/var instanceValues = (styleData != null) ? styleData[InstanceStyleData.InstanceValues] : null; 
            ReleaseInstanceDataForDataTriggers(dataField, instanceValues, oldStyle, oldFrameworkTemplate );
        } 
    }; 

    // 
    //  This method
    //  1. Ensures that the desired per-instance storage
    //     for Style/Template exists
    // 
//    internal static HybridDictionary 
//    StyleHelper.EnsureInstanceData = function(
//        /*UncommonField<HybridDictionary[]>*/  dataField, 
//        /*DependencyObject*/            container, 
//        /*InstanceStyleData*/           dataType)
//    { 
//        return EnsureInstanceData(dataField, container, dataType, -1);
//    };

    // 
    //  This method
    //  1. Ensures that the desired per-instance storage 
    //     for Style/Template exists 
    //  2. Also allows you to specify initial capacity
    // 
//    internal static HybridDictionary 
    StyleHelper.EnsureInstanceData = function(
        /*UncommonField<HybridDictionary[]>*/  dataField,
        /*DependencyObject*/            container,
        /*InstanceStyleData*/           dataType, 
        /*int*/                         initialSize)
    { 
//        Debug.Assert((container is FrameworkElement) || (container is FrameworkContentElement), "Caller has queried with non-framework element.  Bad caller, bad!"); 
//        Debug.Assert(dataType < InstanceStyleData.ArraySize, "Caller has queried using a value outside the range of the Enum.  Bad caller, bad!");

    	if(initialSize === undefined){
    		initialSize = -1;
    	}
    	
        /*HybridDictionary[]*/
    	var data = dataField.GetValue(container);

        if (data == null)
        { 
            data = []; //new HybridDictionary[InstanceStyleData.ArraySize];
            for(var i=0; i<InstanceStyleData.ArraySize; i++){
            	data[i] = new HybridDictionary();
            }
            dataField.SetValue(container, data); 
        } 

        if (data[dataType] == null ) 
        {
            if( initialSize < 0 )
            {
                data[dataType] = new HybridDictionary(); 
            }
            else 
            { 
                data[dataType] = new HybridDictionary(initialSize);
            } 
        }

        return /*(HybridDictionary)*/data[dataType];
    }; 

    // 
    //  This method 
    //  1. Adds or removes per-instance state on the container/child (push model)
    //  2. Processes values that need per-instance storage 
    //
//    private static void 
    function ProcessInstanceValuesForChild(
        /*DependencyObject*/                    container,
        /*DependencyObject*/                    child, 
        /*int*/                                 childIndex,
        /*HybridDictionary*/                    instanceValues, 
        /*bool*/                                apply, 
        /*ref FrugalStructList<ChildRecord>*/   childRecordFromChildIndex)
    { 
        // If childIndex has not been provided,
        // fetch it from the given child node
        if (childIndex == -1)
        { 
            var feChildOut = {
            	"fe" : null	
            };
            
            var fceChildOut = {
            	"fce" : null
            };
            
            Helper.DowncastToFEorFCE(child, /*out feChild*/feChildOut, /*out fceChild*/fceChildOut, false); 
            /*FrameworkElement*/var feChild = feChildOut.fe;
            /*FrameworkContentElement*/var fceChild = fceChildOut.fce;

            childIndex = (feChild != null) ? feChild.TemplateChildIndex 
                        : (fceChild != null) ? fceChild.TemplateChildIndex : -1;
        }

        // Check if this Child Index/Property is represented in style 
        if ((0 <= childIndex) && (childIndex < childRecordFromChildIndex.Count))
        { 
            var n = childRecordFromChildIndex.Get(childIndex).ValueLookupListFromProperty.Count; 
            for (var i = 0; i < n; ++i)
            { 
                ProcessInstanceValuesHelper(
                    /*ref*/ childRecordFromChildIndex.Get(childIndex).ValueLookupListFromProperty.Entries[i].Value,
                    child, childIndex, instanceValues, apply);
            } 
        }
    } 

    //
    //  This method 
    //  1. Adds or removes per-instance state on the container/child (push model)
    //  2. Processes values that need per-instance storage
    //
//    private static void 
    function ProcessInstanceValuesHelper( 
        /*ref ItemStructList<ChildValueLookup>*/ valueLookupList,
        /*DependencyObject*/                     target, 
        /*int*/                                  childIndex, 
        /*HybridDictionary*/                     instanceValues,
        /*bool*/                                 apply) 
    {
        // update all properties whose value needs per-instance storage
        for (var i = valueLookupList.Count - 1;  i >= 0;  --i)
        { 
            switch (valueLookupList.List[i].LookupType)
            { 
            case ValueLookupType.Simple: 
            case ValueLookupType.Trigger:
            case ValueLookupType.DataTrigger: 
                /*Freezable*/
            	var freezable;

                /*DependencyProperty*/
                var dp = valueLookupList.List[i].Property;
                /*object*/
                var o = valueLookupList.List[i].Value; 

                if (o instanceof MarkupExtension) 
                { 
                	StyleHelper.ProcessInstanceValue(target, childIndex, instanceValues, dp, i, apply);
                } 
                else if ((freezable = o instanceof Freezable ? o : null) != null)
                {
//                    if (freezable.CheckAccess())
//                    { 
                        if (!freezable.IsFrozen)
                        { 
                        	StyleHelper.ProcessInstanceValue(target, childIndex, instanceValues, dp, i, apply); 
                        }
//                    } 
//                    else
//                    {
////                        Debug.Assert(!freezable.CanFreeze, "If a freezable could have been frozen it would have been done by now.");
//                        throw new Error('InvalidOperationException(SR.Get(SRID.CrossThreadAccessOfUnshareableFreezable, freezable.GetType().FullName)'); 
//                    }
                } 

                break;
            } 
        }
    }

    // 
    //  This method
    //  1. Adds or removes per-instance state on the container/child (push model) 
    //  2. Processes a single value that needs per-instance storage 
    //
//    internal static void 
    StyleHelper.ProcessInstanceValue = function( 
        /*DependencyObject*/    target,
        /*int*/                 childIndex,
        /*HybridDictionary*/    instanceValues,
        /*DependencyProperty*/  dp, 
        /*int*/                 i,
        /*bool*/                apply) 
    { 
        // If we get this far, it's because there's a value
        // in the property value list of an active style that requires 
        // per-instance storage.  The initialization (CreateInstaceData)
        // should have created the InstanceValues hashtable by now.
//        Debug.Assert(instanceValues != null, "InstanceValues hashtable should have been created at initialization time.");

        /*InstanceValueKey*/
    	var key = new InstanceValueKey(childIndex, dp.GlobalIndex, i);

        if (apply) 
        {
            // Store a sentinel value in per-instance StyleData. 
            // The actual value is created only on demand.
            instanceValues.Set(key, StyleHelper.NotYetApplied);
        }
        else 
        {
            // Remove the instance value from the table 
            /*object*/
        	var value = instanceValues.Get(key); 
            instanceValues.Remove(key);

            /*Expression*/var expr;
            /*Freezable*/var freezable;

            if ((expr = value instanceof Expression ? value : null)!= null) 
            {
                // if the instance value is an expression, detach it 
                expr.OnDetach(target, dp); 
            }
            else if ((freezable = value instanceof Freezable ? value : null)!= null) 
            {
                // if the instance value is a Freezable, remove its
                // inheritance context
                target.RemoveSelfAsInheritanceContext(freezable, dp); 
            }
        } 
    };

    // 
    //  This method
    //  1. Is called when a style/template is removed from a container.
    //  2. It is meant to release its data trigger information.
    // 
//    private static void 
    function ReleaseInstanceDataForDataTriggers(
        /*UncommonField<HybridDictionary[]>*/ dataField, 
        /*HybridDictionary*/            instanceValues, 
        /*Style*/                       oldStyle,
        /*FrameworkTemplate*/           oldFrameworkTemplate) 
    {
//        Debug.Assert(oldStyle != null || oldFrameworkTemplate != null );

        if (instanceValues == null) 
            return;

        // the event handler depends only on whether the instance data 
        // applies to Style, Template, or ThemeStyle
        /*EventHandler<BindingValueChangedEventArgs>*/var handler; 
        if (dataField == StyleHelper.StyleDataField)
        {
            handler = new EventHandler/*<BindingValueChangedEventArgs>*/(null, OnBindingValueInStyleChanged);
        } 
        else if (dataField == StyleHelper.TemplateDataField)
        { 
            handler = new EventHandler/*<BindingValueChangedEventArgs>*/(null, OnBindingValueInTemplateChanged); 
        }
        else 
        {
//            Debug.Assert(dataField == ThemeStyleDataField);
            handler = new EventHandler/*<BindingValueChangedEventArgs>*/(null, OnBindingValueInThemeStyleChanged);
        } 

        // clean up triggers with setters 
        /*HybridDictionary*/var dataTriggerRecordFromBinding = null; 
        if (oldStyle != null)
        { 
            dataTriggerRecordFromBinding = oldStyle._dataTriggerRecordFromBinding;
        }
        else if (oldFrameworkTemplate != null)
        { 
            dataTriggerRecordFromBinding = oldFrameworkTemplate._dataTriggerRecordFromBinding;
        } 

        if (dataTriggerRecordFromBinding != null)
        { 
//            foreach (object o in dataTriggerRecordFromBinding.Keys)
//            {
//                /*BindingBase*/var binding = o;
//                ReleaseInstanceDataForTriggerBinding(binding, instanceValues, handler); 
//            }
        	
            for (var i = 0; i< dataTriggerRecordFromBinding.Keys.Count; i++)
            {
                /*BindingBase*/
            	var binding = dataTriggerRecordFromBinding.Keys.Get(i);
                ReleaseInstanceDataForTriggerBinding(binding, instanceValues, handler); 
            }
        } 

        // clean up triggers with actions
        /*HybridDictionary*/var dataTriggersWithActions = null; 
        if (oldStyle != null)
        {
            dataTriggersWithActions = oldStyle.DataTriggersWithActions;
        } 
        else if (oldFrameworkTemplate != null)
        { 
            dataTriggersWithActions = oldFrameworkTemplate.DataTriggersWithActions; 
        }

        if (dataTriggersWithActions != null)
        {
//            foreach (object o in dataTriggersWithActions.Keys)
//            { 
//                /*BindingBase*/var binding = o;
//                ReleaseInstanceDataForTriggerBinding(binding, instanceValues, handler); 
//            } 
        	
            for (var  i =0; i < dataTriggersWithActions.Keys.Count; i++)
            { 
                /*BindingBase*/
            	var binding = dataTriggersWithActions.Keys.Get(i);
                ReleaseInstanceDataForTriggerBinding(binding, instanceValues, handler); 
            } 
        }
    } 

//    private static void 
    function ReleaseInstanceDataForTriggerBinding(
        /*BindingBase*/                                 binding,
        /*HybridDictionary*/                            instanceValues, 
        /*EventHandler<BindingValueChangedEventArgs>*/  handler)
    { 
        /*BindingExpressionBase*/
    	var bindingExpr = instanceValues[binding]; 

        if (bindingExpr != null) 
        {
            bindingExpr.ValueChanged.Remove(handler);
            bindingExpr.Detach();
            instanceValues.Remove(binding); 
        }
    } 


    //+---------------------------------------------------------------------------------
    //
    //  ApplyTemplateContent 
    //
    //  Instantiate the content of the template (either from FEFs or from Baml). 
    //  This is done for every element to which this template is attached. 
    //
    //+--------------------------------------------------------------------------------- 

//    internal static bool 
    StyleHelper.ApplyTemplateContent = function( 
        /*UncommonField<HybridDictionary[]>*/  dataField,
        /*DependencyObject*/            container, 
        /*FrameworkElementFactory*/     templateRoot, 
        /*int*/                         lastChildIndex,
        /*HybridDictionary*/            childIndexFromChildID, 
        /*FrameworkTemplate*/           frameworkTemplate)
    {
//        Debug.Assert(frameworkTemplate != null );

        /*bool*/
    	var visualsCreated = false;

        /*FrameworkElement*/
    	var feContainer = container instanceof EnsureFrameworkElement() ? container : null; 

        // Is this a FEF-style template? 

        if (templateRoot != null)
        {
            // Yes, we'll instantiate from a FEF tree. 

//            EventTrace.EasyTraceEvent(EventTrace.Keyword.KeywordXamlBaml, EventTrace.Level.Verbose, EventTrace.Event.WClientParseInstVisTreeBegin); 

            CheckForCircularReferencesInTemplateTree(container, frameworkTemplate );

            // Container is considered ChildIndex '0' (Self), but,
            // Container.ChildIndex isn't set
            /*List<DependencyObject>*/
            var affectedChildren = new List/*<DependencyObject>*/(lastChildIndex);

            // Assign affectedChildren to container
            StyleHelper.TemplatedFeChildrenField.SetValue(container, affectedChildren); 

            // When building the template children chain, we keep a chain of
            // nodes that don't need to be in the chain for property invalidation 
            // or lookup purposes.  (And hence not assigned a TemplateChildIndex)
            // We only need them in order to clean up their _templatedParent
            // references (see FrameworkElement.ClearTemplateChain)
            /*List<DependencyObject>*/var noChildIndexChildren = null; 

            // Instantiate template 
            // Setup container's reference to first child in chain 
            // and add to tree
            /*DependencyObject*/var treeRoot = templateRoot.InstantiateTree( 
                dataField,
                container,
                container,
                affectedChildren, 
                /*ref*/ noChildIndexChildren,
                /*ref*/ frameworkTemplate.ResourceDependents); 

//            Debug.Assert(treeRoot is FrameworkElement || treeRoot is FrameworkContentElement,
//                "Root node of tree must be a FrameworkElement or FrameworkContentElement.  This should have been caught by set_VisualTree" ); 

            // From childFirst to childLast is the chain of child nodes with
            //  childIndex.  Append that chain with the chain of child nodes
            //  with no childIndex assigned. 
            if( noChildIndexChildren != null )
            { 
                affectedChildren.AddRange(noChildIndexChildren); 
            }

            visualsCreated = true;
        }

        // No template was supplied.  Allow subclasses to provide the template. 
        // This is currently only implemented for FrameworkElement's.

        else
        { 
            if (feContainer != null)
            { 
                // This template will not be driven by the Style in any way. 
                // Rather, it will be built and initialized by the callee

                // CALLBACK

//                Debug.Assert(frameworkTemplate != null, "Only FrameworkTemplate has the ability to build a VisualTree by this means");
                visualsCreated = frameworkTemplate.BuildVisualTree(feContainer);

            }
        }

        return visualsCreated; 
    };

    // This logic used to be in Style.InstantiateSubTree, but now we're 
    //  requiring derived classes to add the root of the tree they're
    //  creating in BuildVisualTree.  They need to call this as soon as 
    //  they've created the root, before building the rest of the tree.
    // Building this tree "in place" means we won't have to do a tree
    //  invalidation after BuildVisualTree completes.
//    internal static void 
    StyleHelper.AddCustomTemplateRoot = function( /*FrameworkElement*/ container, /*UIElement*/ child ) 
    {
        AddCustomTemplateRoot( container, child, true, false); 
    };

    // The boolean parameter allows us to bypass a possibly expensive call 
    //  to VisualTreeHelper.GetParent if we're sure it's unnecessary.
//    internal static void 
    StyleHelper.AddCustomTemplateRoot = function(
        /*FrameworkElement*/ container,
        /*UIElement*/ child, 
        /*bool*/ checkVisualParent, //
        /*bool*/ mustCacheTreeStateOnChild) 
    { 

        // child==null can happen if a ContentPresenter is presenting content 
        // that claims to be type-convertible to UIElement, but the type converter 
        // actually returns null.  Not a likely situation, but still have to check.
        if (child != null) 
        {
            if( checkVisualParent )
            {
                // Need to disconnect the template root from it's previous parent. 
                /*FrameworkElement*/var parent = VisualTreeHelper.GetParent(child);
                parent = parent instanceof EnsureFrameworkElement() ? parent : null;
                if (parent != null) 
                { 
                    parent.TemplateChild = null;
                    parent.InvalidateMeasure(); 
                }
            }
//            else
//            { 
//                Debug.Assert( null == VisualTreeHelper.GetParent(child),
//                    "The caller was positive that 'child' doesn't have a visual parent, bad call."); 
//            } 
        }

        container.TemplateChild = child;
    };

    /// <summary>
    ///     Look for circumstances where one or more Style's template trees
    /// result in a circular reference chain. 
    /// </summary>
    /// <remarks> 
    ///     We are about to instantiate a template tree for a node.  Check 
    /// the node to see if it is, in turn, created from another template tree.
    /// Keep following this chain until: 
    ///     (1) We hit a node that wasn't a template-created node.  (GOOD)
    ///     (2) We hit a node that was created by "this" Style and is same
    ///             type as container. (BAD)
    /// 
    ///     We care about the chain of template-created nodes because that
    /// is an automated process and once we have a cycle it'll go on forever. 
    /// If we hit a non-template-created node (case 1 above) then we can 
    /// hope that there's logic to break the chain.
    /// 
    ///     We check for same Style *and type* because the Style object may
    /// be applied to a subclass.  In that case it's not necessarily a cycle
    /// just yet, since the template-created object won't be the same as
    /// what the Style is applied on.  If there's actually a cycle later on 
    /// we will catch it then.
    /// 
    /// Sample markup of things we will catch: 
    ///
    ///     <Style> 
    ///         <Button />
    ///         <Style.VisualTree>
    ///             <Button />
    ///         </Style.VisualTree> 
    ///     </Style>
    /// 
    ///     The reason we have to do this from InstantiateSubTree instead of 
    /// a self-check in Seal() (Which might catch the above) is that the
    /// cycle may be spread across multiple Style objects.  For example, if 
    /// both of the following exist:
    ///
    ///     <Style>
    ///         <Button /> 
    ///         <Style.VisualTree>
    ///             <TextBox /> 
    ///         </Style.VisualTree> 
    ///     </Style>
    /// 
    ///     <Style>
    ///         <TextBox />
    ///         <Style.VisualTree>
    ///             <Button /> 
    ///         </Style.VisualTree>
    ///     </Style> 
    /// 
    ///     We won't realize this if we're just looking at the individual
    /// Style objects. 
    ///
    /// </remarks>
//    private static void 
    function CheckForCircularReferencesInTemplateTree(
        /*DependencyObject*/    container, 
        /*FrameworkTemplate*/   frameworkTemplate)
    { 
        // Get set up to handle the FE/FCE duality 
        /*DependencyObject*/var walkNode = container;
        /*DependencyObject*/var nextParent = null;
        /*FrameworkElement*/var feWalkNode;
        /*FrameworkContentElement*/var fceWalkNode; 
        /*bool*/var walkNodeIsFE;
        
        var fceWalkNodeOut = {
        	"fce" : fceWalkNode	
        };
        
        var feWalkNodeOut = {
            	"fe" : feWalkNode	
            };

        while( walkNode != null ) 
        {
            // Figure out whether the node is a FE or FCE 
            Helper.DowncastToFEorFCE(walkNode, /*out feWalkNode*/feWalkNodeOut, /*out fceWalkNode*/fceWalkNodeOut, false);
            feWalkNode = feWalkNodeOut.fe;
            fceWalkNode = fceWalkNodeOut.fce;
            
            walkNodeIsFE = (feWalkNode != null);
            if( walkNodeIsFE )
            { 
                nextParent = feWalkNode.TemplatedParent; 
            }
            else 
            {
                nextParent = fceWalkNode.TemplatedParent;
            }

            // If we're beyond "this" container, check for identical Style & type
            //  because that indicates a cycle.  If so, stop the train. 
            if( walkNode != container && nextParent != null ) // Only interested in nodes that are "Not me" and not auto-generated (== no TemplatedParent) 
            {
                // Do the cheaper comparison first - the Style reference should be cached 
                if ((frameworkTemplate != null && walkNodeIsFE == true && feWalkNode.TemplateInternal == frameworkTemplate) )
                {
                    // Then the expensive one - pulling in reflection to check if they're also the same types.
                    if( walkNode.GetType() == container.GetType() ) 
                    {
                        /*string*/var name = (walkNodeIsFE) ? feWalkNode.Name : fceWalkNode.Name; 

                        // Same Style, Same type, on a chain of Style-created nodes.
                        //  This is bad news since this chain will continue indefinitely. 
                        throw new Error('InvalidOperationException(SR.Get(SRID.TemplateCircularReferenceFound, name, walkNode.GetType())');
                    }
                } 
            }

            // If the container is, in turn, created from another Style, 
            //  keep walking up that chain.  Exception:  do not walk up from a
            //  ContentPresenter;  this avoids false positives involving a 
            //  ContentControl whose effective ContentTemplate contains another
            //  instance of the same type of ContentControl, for example:
            //          <Button Content="A">
            //              <Button.ContentTemplate> 
            //                  <DataTemplate>
            //                      <Button Content="B"/> 
            //                  </DataTemplate> 
            //              </Button.ContentTemplate>
            //          </Button> 
            //  Both Buttons have the same ControlTemplate, which would be flagged
            //  by this loop.  But they have different ContentTemplates, so there
            //  isn't a cycle.  Stopping the loop after checking a ContentPresenter
            //  allows cases like the one illustrated here, while catching real 
            //  cycles involving ContentPresenter - they're caught when this method
            //  is called with container = ContentPresenter. 
            walkNode = (walkNode instanceof EnsureContentPresenter()) ? null: nextParent; 
        }
    } 


    //  ============================================================================ 
    //  These methods are invoked when a Template's
    //  VisualTree is destroyed 
    //  =========================================================================== 

    //
    //  This method
    //  1. Wipes out all child references to this Templated container. 
    //  2. Invalidates all properties that came from FrameworkElementFactory.SetValue
    // 
//    internal static void 
    StyleHelper.ClearGeneratedSubTree = function( 
        /*HybridDictionary[]*/          instanceData,
        /*FrameworkElement*/            feContainer, 
        /*FrameworkContentElement*/     fceContainer,
        /*FrameworkTemplate*/           oldFrameworkTemplate)
    {
        // Forget about the templatedChildren chain 
        /*List<DependencyObject>*/var templatedChildren;
        if (feContainer != null) 
        {
            templatedChildren = StyleHelper.TemplatedFeChildrenField.GetValue(feContainer);
            StyleHelper.TemplatedFeChildrenField.ClearValue(feContainer);
        } 
        else
        { 
            templatedChildren = StyleHelper.TemplatedFeChildrenField.GetValue(fceContainer); 
            StyleHelper.TemplatedFeChildrenField.ClearValue(fceContainer);
        } 

        /*DependencyObject*/var rootNode = null;
        if (templatedChildren != null)
        { 

            // Fetch the rootNode of the template generated tree
            rootNode = templatedChildren[0]; 

            if (oldFrameworkTemplate != null )
            {
                // Style/Template has built the tree via FrameworkElementFactories 
                ClearTemplateChain(instanceData, feContainer, fceContainer, templatedChildren, oldFrameworkTemplate );
            } 
        } 

        // Clear the NameMap property on the root of the generated subtree 
        if (rootNode != null)
        {
            rootNode.ClearValue(NameScope.NameScopeProperty);
        } 

        // Detach the generated tree from the conatiner 
        DetachGeneratedSubTree(feContainer, fceContainer); 
    };

    //
    //  This method
    //  1. Detaches the generated sub-tree from this container
    //  2. Invalidates all properties that came from FrameworkElementFactory.SetValue 
    //
//    private static void 
    function DetachGeneratedSubTree( 
        /*FrameworkElement*/            feContainer, 
        /*FrameworkContentElement*/     fceContainer)
    { 
//        Debug.Assert(feContainer != null || fceContainer != null);

        if (feContainer != null)
        { 
            feContainer.TemplateChild = null;
            // VisualTree has been cleared 
            // Style.FrameworkElementFactory or Style.BuildVisualTree 
            // will recreate on next ApplyTemplate
            feContainer.HasTemplateGeneratedSubTree = false; 
        }
        else
        {
            // GeneratedTree has been cleared 
            // Style.FrameworkElementFactory or Style.BuildVisualTree
            // will recreate on next EnsureLogical 
            fceContainer.HasTemplateGeneratedSubTree = false; 

            // there is no corresponding method for a logical templated subtree; 
            // each container must do this on its own, since logical trees are
            // attached in different ways for different containers.
        }
    } 

    // 
    //  This method 
    //  1. Wipes out all Visual child references to this Templated container.
    //  2. Invalidates all properties that came from FrameworkElementFactory.SetValue 
    //
//    private static void 
    function ClearTemplateChain(
        /*HybridDictionary[] */     instanceData,
        /*FrameworkElement*/        feContainer, 
        /*FrameworkContentElement*/ fceContainer,
        /*List<DependencyObject>*/  templateChain, 
        /*FrameworkTemplate*/       oldFrameworkTemplate) 
    {
//        Debug.Assert(oldFrameworkTemplate != null ); 

        /*FrameworkObject*/
    	var container = new FrameworkObject(feContainer, fceContainer);

        /*HybridDictionary*/
    	var instanceValues = (instanceData != null) ? instanceData[InstanceStyleData.InstanceValues] : null; 
        /*int[]*/
    	var childIndices = [];

        // Assumes that styleChain[0] is the root of the templated subtree 
        // structure.  This comes from Template.Seal() where it sets
        // FrameworkElementFactory.IsTemplatedTreeRoot = true. 
        // (HasGeneratedSubTree tells us if we have one, but it
        // doesn't tell us who it is.)
        for (var i=0; i< templateChain.Count; i++)
        { 
            /*DependencyObject*/var walk = templateChain.Get(i);

            // Visual child longer longer refers to container 
            var feOut = {"fe" : null	 };
            
            var fceOut = {"fce" : null};
            StyleHelper.SpecialDowncastToFEorFCE(walk, /*out fe*/feOut, /*out fce*/fceOut, true); // Doesn't throw for Visual3D
            /*FrameworkElement*/var fe = feOut.fe;
            /*FrameworkContentElement*/var fce= fceOut.fce; 

            if (fe != null)
            { 
                childIndices[i] = fe.TemplateChildIndex;
                fe._templatedParent = null; 
                fe.TemplateChildIndex = -1; 
            }
            else if (fce != null) // walk is FrameworkContentElement 
            {
                childIndices[i] = fce.TemplateChildIndex;
                fce._templatedParent = null;
                fce.TemplateChildIndex = -1; 
            }
        } 

        // Invalidate all the properties on the visual tree node that
        // have been set on the corresponding FEF. NOTE: We do not do 
        // the two operations of nuking members and invalidating properties
        // in the same loop because, any property invalidation involves a
        // call out, which may end up reaching a node that hasn't had its
        // TemplateChildIndex and TemplatedParent dropped. Hence we use two 
        // separate loops to do these two operations so one does not
        // interfere with the other. 
        for (var i=0; i< templateChain.Count; i++) 
        {
            /*DependencyObject*/var walk = templateChain.Get(i); 
            /*FrameworkObject*/var foWalk = new FrameworkObject(walk);
            var childIndex = childIndices[i];

//            Debug.Assert( oldFrameworkTemplate != null ); 

            // Unapply the style's InstanceValues on the subtree node. 
            ProcessInstanceValuesForChild( 
                feContainer, walk, childIndices[i], instanceValues, false,
                /*ref*/ oldFrameworkTemplate.ChildRecordFromChildIndex); 

            // And now we'll also need to invalidate any properties that
            // came from FrameworkElementFactory.SetValue or VisulaTrigger.SetValue
            // so that they can get cleared. When tearing down a template visual 
            // tree we do not want to invalidate the inheritable properties along
            // with the other template properties. This is so because soon after 
            // detaching the VisualTree from the container we will be firing an 
            // InvalidateTree call and all inheritable properties will get invalidated
            // then. Note that we will also be skipping the Style property along with 
            // all other inheritable properties because Style is really a psuedo
            // inheritable property and gets automagically invalidated during an
            // invalidation storm.
            StyleHelper.InvalidatePropertiesOnTemplateNode( 
                    container.DO,
                    foWalk, 
                    childIndices[i], 
                    /*ref*/ oldFrameworkTemplate.ChildRecordFromChildIndex,
                    true /*isDetach*/, 
                    oldFrameworkTemplate.VisualTree);

            // Unapply unshared instance values on the current node

            if (foWalk.StoresParentTemplateValues)
            { 
                /*HybridDictionary*/var parentTemplateValues = StyleHelper.ParentTemplateValuesField.GetValue(walk); 

                StyleHelper.ParentTemplateValuesField.ClearValue(walk); 
                foWalk.StoresParentTemplateValues = false;

//                foreach (/*DictionaryEntry*/var entry in parentTemplateValues)
//                { 
//                    /*DependencyProperty*/var dp = entry.Key;
//
//                    if (entry.Value instanceof MarkupExtension) 
//                    {
//                        // Clear the entry for this unshared value in the per-instance store for MarkupExtensions 
//
//                        StyleHelper.ProcessInstanceValue(walk, childIndex, instanceValues, dp, -1, false /*apply*/);
//                    }
//
//                    // Invalidate this property so that we no longer use the template applied value
//
//                    walk.InvalidateProperty(dp); 
//                }
                var keys = parentTemplateValues.Keys;
                for (var i=0; i<keys.Count; i++) ///*DictionaryEntry*/var prop in parentTemplateValues)
                { 
                	var prop = Keys.Get(i);
                	var  entry = parentTemplateValues.Get(prop);
                    /*DependencyProperty*/
                	var dp = entry.Key;

                    if (entry.Value instanceof MarkupExtension) 
                    {
                        // Clear the entry for this unshared value in the per-instance store for MarkupExtensions 
                        StyleHelper.ProcessInstanceValue(walk, childIndex, instanceValues, dp, -1, false /*apply*/);
                    }

                    // Invalidate this property so that we no longer use the template applied value
                    walk.InvalidateProperty(dp); 
                }
            } 
        }
    }



    // This is a special version of DowncastToFEorFCE, for use by ClearTemplateChain, 
    // to handle Visual3D (workaround for PDC) 

//    internal static void 
    StyleHelper.SpecialDowncastToFEorFCE = function(/*DependencyObject*/ d, 
                                /*out FrameworkElement fe*/feOut, /*out FrameworkContentElement fce*/fceOut,
                                /*bool*/ throwIfNeither)
    {
        if (EnsureFrameworkElement().DType.IsInstanceOfType(d)) 
        {
        	feOut.fe = /*(FrameworkElement)*/d; 
        	fceOut.fce = null; 
        }
        else if (FrameworkContentElement.DType.IsInstanceOfType(d)) 
        {
        	feOut.fe = null;
        	fceOut.fce = /*(FrameworkContentElement)*/d;
        } 
        else 
        {
        	feOut.fe = null;
        	fceOut.fce = null;
        } 
    };


    //  ============================================================================
    //  These methods are invoked when an Event
    //  is routed through a tree
    //  ============================================================================ 

    //
    //  This method 
    //  1. Is invoked when Sealing a style/template
    //  2. It is used to add a handler to all those nodes that are targeted by EventTriggers
    //
    //  Note that this is a recursive routine 
    //
//    internal static FrameworkElementFactory
    StyleHelper.FindFEF = function(/*FrameworkElementFactory*/ root, /*int*/ childIndex) 
    { 
        if (root._childIndex == childIndex)
        { 
            return root;
        }

        /*FrameworkElementFactory*/var child = root.FirstChild; 
        /*FrameworkElementFactory*/var match = null;
        while (child != null) 
        { 
            match = FindFEF(child, childIndex);
            if (match != null) return match; 

            child = child.NextSibling;
        }

        return null;
    };

    //
    //  This method 
    //  1. Invokes the TriggerActions as the corresponding event is being
    //     routed through the tree
    //
//    private static void 
    function ExecuteEventTriggerActionsOnContainer (/*object*/ sender, /*RoutedEventArgs*/ e) 
    {
        /*FrameworkElement*/
    	var fe; 
        /*FrameworkContentElement*/
    	var fce;
    	var feOut = {
    		"fe" : fe
    	};
    	
    	var fceOut = {
    		"fce" : fce
    	};
        Helper.DowncastToFEorFCE(/*(DependencyObject)*/sender, /*out fe*/feOut, /*out fce*/fceOut, false);
        fe = feOut.fe;
        fce = fceOut.fce;

        /*Style*/var selfStyle; 
        /*Style*/var selfThemeStyle;
        /*FrameworkTemplate*/var selfFrameworkTemplate = null; 

        if (fe != null)
        { 
            selfStyle = fe.Style;
            selfThemeStyle = fe.ThemeStyle;

            // An FE might have a template 
            selfFrameworkTemplate = fe.TemplateInternal;
        } 
        else 
        {
            selfStyle = fce.Style; 
            selfThemeStyle = fce.ThemeStyle;
        }

        // Invoke trigger actions on selfStyle
        if (selfStyle != null && selfStyle.EventHandlersStore != null) 
        { 
            InvokeEventTriggerActions(fe, fce, selfStyle, null, 0, e.RoutedEvent);
        } 

        // Invoke trigger actions on theme style
        if (selfThemeStyle != null && selfThemeStyle.EventHandlersStore != null)
        { 
            InvokeEventTriggerActions(fe, fce, selfThemeStyle, null, 0, e.RoutedEvent);
        } 

        // Invokte trigger actions on the template or table template. 
        if (selfFrameworkTemplate != null && selfFrameworkTemplate.EventHandlersStore != null)
        {
            InvokeEventTriggerActions(fe, fce, null /*style*/, selfFrameworkTemplate, 0, e.RoutedEvent);
        } 
    } 

    // 
    //  This method
    //  1. Invokes the TriggerActions as the corresponding event is being
    //     routed through the tree
    // 
//    private static void 
    function ExecuteEventTriggerActionsOnChild (/*object*/ sender, /*RoutedEventArgs*/ e)
    { 
        /*FrameworkElement*/var fe;
        /*FrameworkContentElement*/var fce;
       	var feOut = {
        		"fe" : fe
        	};
        	
        	var fceOut = {
        		"fce" : fce
        	};
        Helper.DowncastToFEorFCE(/*(DependencyObject)*/sender, /*out fe*/feOut, /*out fce*/fceOut, false);
        fe = feOut.fe;
        fce = fceOut.fce;
        
        /*DependencyObject*/var templatedParent;
        var templateChildIndex; 

        if (fe != null)
        { 
            templatedParent = fe.TemplatedParent;
            templateChildIndex = fe.TemplateChildIndex;
        }
        else 
        {
            templatedParent = fce.TemplatedParent; 
            templateChildIndex = fce.TemplateChildIndex; 
        }

        if (templatedParent != null)
        {
            // This node is the result of a Style/Template's VisualTree expansion
            var fceTemplatedParentOut = {"fce":null};
            
            var feTemplatedParentOut = {"fe":null};
            
            Helper.DowncastToFEorFCE(templatedParent, /*out feTemplatedParent*/feTemplatedParentOut, /*out fceTemplatedParent*/fceTemplatedParentOut, false); 
            /*FrameworkElement*/var feTemplatedParent = feTemplatedParentOut.fe;
            /*FrameworkContentElement*/var fceTemplatedParent = fceTemplatedParentOut.fce;

            /*FrameworkTemplate*/var templatedParentTemplate = null; 

//            Debug.Assert( feTemplatedParent != null );
            templatedParentTemplate = feTemplatedParent.TemplateInternal;

            // Invoke the trigger action on the Template 
            // for the templated parent.
            InvokeEventTriggerActions(feTemplatedParent, fceTemplatedParent, null /*templatedParentStyle*/, templatedParentTemplate, templateChildIndex, e.RoutedEvent); 
        }
    }

    //
    //  This method 
    //  1. Invokes the trigger actions on either the given ownerStyle or the ownerTemplate 
    //
//    private static void 
    function InvokeEventTriggerActions( 
        /*FrameworkElement*/        fe,
        /*FrameworkContentElement*/ fce,
        /*Style*/                   ownerStyle,
        /*FrameworkTemplate*/       frameworkTemplate, 
        /*int*/                     childIndex,
        /*RoutedEvent*/           Event) 
    { 
        /*List<TriggerAction>*/var actionsList;

        if (ownerStyle != null)
        { 
            actionsList = (ownerStyle._triggerActions != null)
                            ? (ownerStyle._triggerActions[Event] instanceof List/*<TriggerAction>*/ ? ownerStyle._triggerActions[Event] : null) 
                            : null; 
        }
        else 
        {
//            Debug.Assert( frameworkTemplate != null );
            actionsList = (frameworkTemplate._triggerActions != null)
                            ? (frameworkTemplate._triggerActions[Event] instanceof List/*<TriggerAction>*/ ? frameworkTemplate._triggerActions[Event] : null)
                            : null;
        } 

        if (actionsList != null)
        { 
            for (var i = 0; i < actionsList.Count; i++)
            {
                /*TriggerAction*/var action = actionsList[i];

                var triggerIndex = /*((EventTrigger)action.ContainingTrigger)*/action.ContainingTrigger.TriggerChildIndex;

                if (childIndex == triggerIndex)
                {
                    action.Invoke(fe, fce, ownerStyle, frameworkTemplate, Storyboard.Layers.StyleOrTemplateEventTrigger);
                } 
            }
        } 
    } 

    // 
    //  This method
    //  1. Computes the value of a template child
    //     (Index is '0' when the styled container is asking)
    // 
//    internal static object 
    StyleHelper.GetChildValue = function(
        /*UncommonField<HybridDictionary[]>*/   dataField, 
        /*DependencyObject*/                    container, 
        /*int*/                                 childIndex,
        /*FrameworkObject*/                     child, 
        /*DependencyProperty*/                  dp,
        /*ref FrugalStructList<ChildRecord>*/   childRecordFromChildIndex,
        /*ref EffectiveValueEntry             entry*/entry,
        /*out ValueLookupType                 sourceType*/sourceTypeOut, 
        /*FrameworkElementFactory*/             templateRoot)
    { 
        /*object*/var value = DependencyProperty.UnsetValue; 
        sourceTypeOut.sourceType = ValueLookupType.Simple;

        // Check if this Child Index is represented in given data-structure
        if ((0 <= childIndex) && (childIndex < childRecordFromChildIndex.Count))
        {
            // Fetch the childRecord for the given childIndex 
            /*ChildRecord*/
        	var childRecord = childRecordFromChildIndex.Get(childIndex);

            // Check if this Property is represented in the childRecord 
            var mapIndex = childRecord.ValueLookupListFromProperty.Search(dp.GlobalIndex);
            if (mapIndex >= 0) 
            {
                if (childRecord.ValueLookupListFromProperty.Entries[mapIndex].Value.Count > 0)
                {
                    // Child Index/Property are both represented in this style/template, 
                    // continue with value computation

                    // Pass into helper so ValueLookup struct can be accessed by ref 
                    value = GetChildValueHelper(
                        dataField, 
                        /*ref*/ childRecord.ValueLookupListFromProperty.Entries[mapIndex].Value,
                        dp,
                        container,
                        child, 
                        childIndex,
                        true, 
                        /*ref entry*/entry, 
                        /*out sourceType*/sourceTypeOut,
                        templateRoot); 
                }
            }
        }

        return value;
    };

    //
    //  This method 
    //  1. Computes the property value given the ChildLookupValue list for it
    //
//    private static object 
    function GetChildValueHelper(
        /*UncommonField<HybridDictionary[]>*/       dataField, 
        /*ref ItemStructList<ChildValueLookup> */   valueLookupList,
        /*DependencyProperty*/                      dp, 
        /*DependencyObject*/                        container, 
        /*FrameworkObject*/                         child,
        /*int*/                                     childIndex, 
        /*bool*/                                    styleLookup,
        /*ref EffectiveValueEntry                 entry*/entry,
        /*out ValueLookupType                     sourceType*/sourceTypeOut,
        /*FrameworkElementFactory*/                 templateRoot) 
    {
//        Debug.Assert(child.IsValid, "child should either be an FE or an FCE"); 

        var value = DependencyProperty.UnsetValue;
        sourceTypeOut.sourceType = ValueLookupType.Simple; 

        // Walk list backwards since highest priority lookup items are inserted last
        for (var i = valueLookupList.Count - 1; i >= 0; i--)
        { 
        	sourceTypeOut.sourceType = valueLookupList.List[i].LookupType;

            // Lookup logic is determined by lookup type. "Trigger" 
            // is misleading right now because today it's also being used
            // for Storyboard timeline lookups. 
            switch (valueLookupList.List[i].LookupType)
            {
            case ValueLookupType.Simple:
                { 
                    // Simple value
                    value = valueLookupList.List[i].Value; 
                } 
                break;

            case ValueLookupType.Trigger:
            case ValueLookupType.PropertyTriggerResource:
            case ValueLookupType.DataTrigger:
            case ValueLookupType.DataTriggerResource: 
                {
                    // Conditional value based on Container state 
                    /*bool*/var triggerMatch = true; 

                    if( valueLookupList.List[i].Conditions != null ) 
                    {
                        // Check whether the trigger applies.  All conditions must match,
                        // so the loop can terminate as soon as it finds a condition
                        // that doesn't match. 
                        for (var j = 0; triggerMatch && j < valueLookupList.List[i].Conditions.length; j++)
                        { 
                            /*object*/var state; 

                            switch (valueLookupList.List[i].LookupType) 
                            {
                            case ValueLookupType.Trigger:
                            case ValueLookupType.PropertyTriggerResource:
                                // Find the source node 
                                /*DependencyObject*/var sourceNode;
                                var sourceChildIndex = valueLookupList.List[i].Conditions[j].SourceChildIndex; 
                                if (sourceChildIndex == 0) 
                                {
                                    sourceNode = container; 
                                }
                                else
                                {
                                    sourceNode = StyleHelper.GetChild(container, sourceChildIndex); 
                                }

                                // Note that the sourceNode could be null when the source 
                                // property for this trigger is on a node that hasn't been
                                // instantiated yet. 
                                /*DependencyProperty*/var sourceProperty = valueLookupList.List[i].Conditions[j].Property;
                                if (sourceNode != null)
                                {
                                    state = sourceNode.GetValue(sourceProperty); 
                                }
                                else 
                                { 
                                    /*Type*/var sourceNodeType;

                                    if( templateRoot != null )
                                    {
                                        sourceNodeType = FindFEF(templateRoot, sourceChildIndex).Type;
                                    } 
                                    else
                                    { 
                                        sourceNodeType = (container instanceof EnsureFrameworkElement() ? container : null).TemplateInternal.ChildTypeFromChildIndex[sourceChildIndex]; 
                                    }

                                    state = sourceProperty.GetDefaultValue(sourceNodeType);
                                }

                                triggerMatch = valueLookupList.List[i].Conditions[j].Match(state); 

                                break; 

                            case ValueLookupType.DataTrigger:
                            case ValueLookupType.DataTriggerResource: 
                            default:    // this cannot happen - but make the compiler happy

                                state = StyleHelper.GetDataTriggerValue(dataField, container, valueLookupList.List[i].Conditions[j].Binding);
                                triggerMatch = valueLookupList.List[i].Conditions[j].ConvertAndMatch(state); 

                                break; 
                            } 
                        }
                    } 

                    if (triggerMatch)
                    {
                        // Conditionals matched, use the value 

                        if (valueLookupList.List[i].LookupType == ValueLookupType.PropertyTriggerResource || 
                            valueLookupList.List[i].LookupType == ValueLookupType.DataTriggerResource) 
                        {
                            // Resource lookup 
//                            /*object*/var source;
                            value = EnsureFrameworkElement().FindResourceInternal(child.FE,
                                                                          child.FCE,
                                                                          dp, 
                                                                          valueLookupList.List[i].Value,  // resourceKey
                                                                          null,  // unlinkedParent 
                                                                          true,  // allowDeferredResourceReference 
                                                                          false, // mustReturnDeferredResourceReference
                                                                          null,  // boundaryElement 
                                                                          false, // disableThrowOnResourceNotFound
                                                                          /*out source*/{"source" : null});

                            // Try to freeze the value 
                            StyleHelper.SealIfSealable(value);
                        } 
                        else 
                        {
                            value = valueLookupList.List[i].Value; 
                        }
                    }
                }
                break; 

            case ValueLookupType.TemplateBinding: 
                { 
                    /*TemplateBindingExtension*/
            	var templateBinding = valueLookupList.List[i].Value;
                    /*DependencyProperty*/
            	var sourceProperty = templateBinding.Property; 

                    // Direct binding of Child property to Container
                    value = container.GetValue(sourceProperty);

                    // Apply the converter, if any
                    if (templateBinding.Converter != null) 
                    { 
                        /*DependencyProperty*/
                    	var targetProperty = valueLookupList.List[i].Property;
//                        System.Globalization.CultureInfo culture = child.Language.GetCompatibleCulture(); 

                        value = templateBinding.Converter.Convert(
                                            value,
                                            targetProperty.PropertyType, 
                                            templateBinding.ConverterParameter/*,
                                            culture*/); 
                    } 

                    // if the binding returns an invalid value, fallback to default value 
                    if ((value != DependencyProperty.UnsetValue) && !dp.IsValidValue(value))
                    {
                        value = DependencyProperty.UnsetValue;
                    } 
                }
                break; 

            case ValueLookupType.Resource:
                { 
                    // Resource lookup
//                    /*object*/var source;
                    value = EnsureFrameworkElement().FindResourceInternal(
                                    child.FE, 
                                    child.FCE,
                                    dp, 
                                    valueLookupList.List[i].Value,  // resourceKey 
                                    null,  // unlinkedParent
                                    true,  // allowDeferredResourceReference 
                                    false, // mustReturnDeferredResourceReference
                                    null,  // boundaryElement
                                    false, // disableThrowOnResourceNotFound
                                    /*out source*/{"source" : null}); 

                    // Try to freeze the value 
                    StyleHelper.SealIfSealable(value); 
                }
                break; 
            }

            // See if value needs per-instance storage
            if (value != DependencyProperty.UnsetValue) 
            {
            	entry.Value = value; 
                // When the value requires per-instance storage (and comes from this style), 
                // get the real value from per-instance data.
                switch (valueLookupList.List[i].LookupType) 
                {
                case ValueLookupType.Simple:
                case ValueLookupType.Trigger:
                case ValueLookupType.DataTrigger: 
                    {
                        /*MarkupExtension*/var me; 
                        /*Freezable*/var freezable; 

                        if ((me = value instanceof MarkupExtension ? value : null) != null) 
                        {
                            value = StyleHelper.GetInstanceValue(
                                            dataField,
                                            container, 
                                            child.FE,
                                            child.FCE, 
                                            childIndex, 
                                            valueLookupList.List[i].Property,
                                            i, 
                                            /*ref entry*/entry);
                        }
                        else if ((freezable = value instanceof Freezable ? value : null) != null && !freezable.IsFrozen)
                        { 
                            value = StyleHelper.GetInstanceValue(
                                            dataField, 
                                            container, 
                                            child.FE,
                                            child.FCE, 
                                            childIndex,
                                            valueLookupList.List[i].Property,
                                            i,
                                            /*ref entry*/entry); 
                        }
                    } 
                    break; 

                default: 
                    break;
                }
            }

            if (value != DependencyProperty.UnsetValue)
            { 
                // Found a value, break out of the for() loop. 
                break;
            } 
        }

        return value;
    } 


    // 
    //  This method
    //  1. Retrieves a value from a binding in the condition of a data trigger 
    //
//    internal static object 
    StyleHelper.GetDataTriggerValue = function(
        /*UncommonField<HybridDictionary[]>*/  dataField,
        /*DependencyObject*/            container, 
        /*BindingBase*/                 binding)
    { 
        // get the container's instance value list - the bindings are stored there 
        /*HybridDictionary[]*/var data = dataField.GetValue(container);
        /*HybridDictionary*/var instanceValues = StyleHelper.EnsureInstanceData(dataField, container, InstanceStyleData.InstanceValues); 

        // get the binding, creating it if necessary
        /*BindingExpressionBase*/var bindingExpr = instanceValues.Get(binding);
        if (bindingExpr == null) 
        {
            bindingExpr = BindingExpressionBase.CreateUntargetedBindingExpression(container, binding); 
            instanceValues.Set(binding, bindingExpr); 

            if (dataField == StyleHelper.StyleDataField) 
            {
                bindingExpr.ValueChanged.Combine(new EventHandler/*<BindingValueChangedEventArgs>*/(null, OnBindingValueInStyleChanged));
            }
            else if (dataField == StyleHelper.TemplateDataField) 
            {
                bindingExpr.ResolveNamesInTemplate = true; 
                bindingExpr.ValueChanged.Combine(new EventHandler/*<BindingValueChangedEventArgs>*/(null, OnBindingValueInTemplateChanged)); 
            }
            else 
            {
//                Debug.Assert(dataField == ThemeStyleDataField);
                bindingExpr.ValueChanged.Combine(new EventHandler/*<BindingValueChangedEventArgs>*/(null, OnBindingValueInThemeStyleChanged));
            } 
            bindingExpr.Attach(container);
        } 

        // get the value
        return bindingExpr.Value; 
    };

    //
    //  This method 
    //  1. Retrieves an instance value from per-instance StyleData.
    //  2. Creates the StyleData if this is the first request. 
    // 
//    internal static object 
    StyleHelper.GetInstanceValue = function(
        /*UncommonField<HybridDictionary []>*/  dataField, 
        /*DependencyObject*/            container,
        /*FrameworkElement*/            feChild,
        /*FrameworkContentElement*/     fceChild,
        /*int*/                         childIndex, 
        /*DependencyProperty*/          dp,
        /*int*/                         i, 
        /*ref EffectiveValueEntry     entry*/entry) 
    {
        /*object*/var rawValue = entry.Value; 
        /*DependencyObject*/var child = null;

        var feContainerOut = {
        	"fe" : null
        };
        
        var fceContainerOut = {
        	"fce" : null
        }
        Helper.DowncastToFEorFCE(container, /*out feContainer*/feContainerOut, /*out fceContainer*/fceContainerOut, true);
        /*FrameworkElement*/var feContainer = feContainerOut.fe;
        /*FrameworkContentElement*/var fceContainer = fceContainerOut.fce

        /*HybridDictionary[]*/var styleData = (dataField != null) ? dataField.GetValue(container) : null; 
        /*HybridDictionary*/var instanceValues = (styleData != null) ? styleData[InstanceStyleData.InstanceValues] : null;
        /*InstanceValueKey*/var key = new InstanceValueKey(childIndex, dp.GlobalIndex, i); 

        /*object*/var value = (instanceValues != null)? instanceValues.Get(key) : null;
        /*bool*/var isRequestingExpression = (feChild != null) ? feChild.IsRequestingExpression : fceChild.IsRequestingExpression;

        if (value == null)
        { 
            value = StyleHelper.NotYetApplied; 
        }

        // if the value is a detached expression, replace it with a new one
        /*Expression*/var expr = value instanceof Expression ? value : null;
        if (expr != null && expr.HasBeenDetached)
        { 
            value = StyleHelper.NotYetApplied;
        } 

        // if this is the first request, create the value
        if (value == StyleHelper.NotYetApplied) 
        {
            child = feChild;
            if (child == null)
                child = fceChild; 

            /*MarkupExtension*/var me; 
            /*Freezable*/var freezable; 

            if ((me = rawValue instanceof MarkupExtension ? rawValue : null) != null) 
            {
                // exception:  if the child is not yet initialized and the request
                // is for an expression, don't create the value.  This gives the parser
                // a chance to set local values, to override the style-defined values. 
                if (isRequestingExpression)
                { 
                    /*bool*/var isInitialized = (feChild != null) ? feChild.IsInitialized : fceChild.IsInitialized; 
                    if (!isInitialized)
                    { 
                        return DependencyProperty.UnsetValue;
                    }
                }

                /*ProvideValueServiceProvider*/
                var provideValueServiceProvider = new ProvideValueServiceProvider();
                provideValueServiceProvider.SetData( child, dp ); 
                value = me.ProvideValue(provideValueServiceProvider); 
            }
            else if ((freezable = rawValue instanceof Freezable ? rawValue : null) != null) 
            {
                value = freezable.Clone();
                child.ProvideSelfAsInheritanceContext(value, dp);
            } 

            // store it in per-instance StyleData (even if it's DependencyProperty.UnsetValue) 
            instanceValues.Set(key, value);

            if (value != DependencyProperty.UnsetValue)
            {
                expr = value instanceof Expression ? value : null;
                // if the instance value is an expression, attach it 
                if (expr != null)
                { 
                    expr.OnAttach(child, dp); 
                }
            } 
        }

        // if the value is an Expression (and we're being asked for the real value),
        // delegate to the expression. 
        if (expr != null)
        { 
            if (!isRequestingExpression) 
            {
                if (child == null) 
                {
                    child = feChild;
                    if (child == null)
                        child = fceChild; 
                }

                entry.ResetValue(DependencyObject.ExpressionInAlternativeStore, true); 
                entry.SetExpressionValue(expr.GetValue(child, dp), DependencyObject.ExpressionInAlternativeStore);
            } 
            else
            {
                entry.Value = value;
            } 
        }
        else 
        { 
            entry.Value = value;
        } 

        return value;
    };


    function ShouldGetValueFromStyle(/*DependencyProperty*/ dp)
    { 
        return (dp != EnsureFrameworkElement().StyleProperty); 
    };
    
    //
    //  This method 
    //  1. Says if [FE/FCE].GetRawValue should look for a value on the self style.
    //  2. It establishes the rule that any dependency property other than the
    //     StyleProperty are stylable on the self style
    // 
//    internal static bool 
    StyleHelper.ShouldGetValueFromStyle  = ShouldGetValueFromStyle;
    
//    //
//    //  This method 
//    //  1. Says if [FE/FCE].GetRawValue should look for a value on the self style.
//    //  2. It establishes the rule that any dependency property other than the
//    //     StyleProperty are stylable on the self style
//    // 
////    internal static bool 
//    StyleHelper.ShouldGetValueFromStyle  = function(/*DependencyProperty*/ dp)
//    { 
//        return (dp != FrameworkElement.StyleProperty); 
//    };

    //
    //  This method
    //  1. Says if [FE/FCE].GetRawValue should look for a value on the self themestyle.
    //  2. It establishes the rule that any dependency property other than the 
    //     StyleProperty, OverridesDefaultStyleProperty and DefaultStyleKeyProperty
    //     are stylable on the self themestyle 
    // 
//    internal static bool 
    StyleHelper.ShouldGetValueFromThemeStyle  = function(/*DependencyProperty*/ dp)
    { 
        return (dp != EnsureFrameworkElement().StyleProperty &&
                dp != EnsureFrameworkElement().DefaultStyleKeyProperty &&
                dp != EnsureFrameworkElement().OverridesDefaultStyleProperty);
    }; 

    // 
    //  This method 
    //  1. Says if [FE/FCE].GetRawValue should look for a value on the self template.
    //  2. It establishes the rule that any dependency property other than the 
    //     StyleProperty, OverridesDefaulStyleProperty, DefaultStyleKeyProperty and
    //     TemplateProperty are stylable on the self template.
    //
//    internal static bool 
    StyleHelper.ShouldGetValueFromTemplate = function( 
        /*DependencyProperty*/ dp)
    { 
        return (dp != EnsureFrameworkElement().StyleProperty && 
                dp != EnsureFrameworkElement().DefaultStyleKeyProperty &&
                dp != EnsureFrameworkElement().OverridesDefaultStyleProperty && 
                dp != EnsureControl().TemplateProperty &&
                dp != EnsureContentPresenter().TemplateProperty);
    };

    //  =========================================================================== 
    //  These methods are invoked when a Property is being
    //  invalidated via a Style/Template 
    //  ===========================================================================

    //
    //  This method 
    //  1. Is invoked when the StyleProperty is invalidated on a FrameworkElement or 
    //     FrameworkContentElement or a sub-class thereof.
    // 
//    internal static void 
    StyleHelper.DoStyleInvalidations = function(
        /*FrameworkElement*/ fe,
        /*FrameworkContentElement*/ fce,
        /*Style*/ oldStyle, 
        /*Style*/ newStyle)
    { 

        if (oldStyle != newStyle) 
        {
            //
            // Style is changing
            // 
        	
            /*DependencyObject*/var container = (fe != null) ? fe : fce; 

            // If the style wants to watch for the Loaded and/or Unloaded events, set the
            // flag that says we want to receive it.  Otherwise, if it was set in the old style, clear it. 
            StyleHelper.UpdateLoadedFlag( container, oldStyle, newStyle );

            // Set up any per-instance state relating to the new Style
            // We do this here instead of OnStyleInvalidated because 
            //  this needs to happen for the *first* Style.
            StyleHelper.UpdateInstanceData( 
                StyleHelper.StyleDataField, 
                fe, fce,
                oldStyle, newStyle, 
                null /* oldFrameworkTemplate */, null /* newFrameworkTemplate */,
                /*(InternalFlags)*/0);

            // If this new style has resource references (either for the container 
            // or for children in the visual tree), then, mark it so that it will
            // not be ignored during resource change invalidations 
            if ((newStyle != null) && (newStyle.HasResourceReferences)) 
            {
                if (fe != null) 
                {
                    fe.HasResourceReference = true;
                }
                else 
                {
                    fce.HasResourceReference = true; 
                } 
            }

            /*FrugalStructList<ContainerDependent>*/
            var oldContainerDependents =
                oldStyle != null ? oldStyle.ContainerDependents : StyleHelper.EmptyContainerDependents;

            /*FrugalStructList<ContainerDependent>*/
            var newContainerDependents = 
                newStyle != null ? newStyle.ContainerDependents : StyleHelper.EmptyContainerDependents;

            // Propagate invalidation for Style dependents 
            /*FrugalStructList<ContainerDependent>*/
            var exclusionContainerDependents = new FrugalStructList(); 
            StyleHelper.InvalidateContainerDependents(container,
                /*ref*/ exclusionContainerDependents,
                /*ref*/ oldContainerDependents,
                /*ref*/ newContainerDependents); 

            // Propagate invalidation for resource references that may be 
            // picking stuff from the style's ResourceDictionary 
            StyleHelper.DoStyleResourcesInvalidations(container, fe, fce, oldStyle, newStyle);

            // Notify Style has changed
            // CALLBACK
            if (fe != null)
            { 
                fe.OnStyleChanged(oldStyle, newStyle);
            } 
            else 
            {
                fce.OnStyleChanged(oldStyle, newStyle); 
            }
        }
    };

    //
    //  This method 
    //  1. Is invoked when the ThemeStyleProperty is invalidated on a FrameworkElement or 
    //     FrameworkContentElement or a sub-class thereof.
    // 
//    internal static void 
    StyleHelper.DoThemeStyleInvalidations = function(
        /*FrameworkElement*/ fe,
        /*FrameworkContentElement*/ fce,
        /*Style*/ oldThemeStyle, 
        /*Style*/ newThemeStyle,
        /*Style*/ style) 
    { 
        if (oldThemeStyle != newThemeStyle && newThemeStyle != style)
        {
            //
            // Style is changing 
            //

            /*DependencyObject*/var container = (fe != null) ? fe : fce; 

            // If the them style wants to watch for the Loaded and/or Unloaded events, set the 
            // flag that says we want to receive it.  Otherwise, if it was set in the old style, clear it.
            StyleHelper.UpdateLoadedFlag( container, oldThemeStyle, newThemeStyle );

            // Set up any per-instance state relating to the new Style 
            // We do this here instead of OnStyleInvalidated because
            // this needs to happen for the *first* Style. 
            StyleHelper.UpdateInstanceData( 
                StyleHelper.ThemeStyleDataField,
                fe, fce, 
                oldThemeStyle, newThemeStyle,
                null /* oldFrameworkTemplate */, null /* newFrameworkTemplate */,
                /*(InternalFlags)*/0);

            // If this new style has resource references (either for the container
            // or for children in the visual tree), then, mark it so that it will 
            // not be ignored during resource change invalidations 
            if ((newThemeStyle != null) && (newThemeStyle.HasResourceReferences))
            { 
                if (fe != null)
                {
                    fe.HasResourceReference = true;
                } 
                else
                { 
                    fce.HasResourceReference = true; 
                }
            } 

            /*FrugalStructList<ContainerDependent> */var oldContainerDependents =
                oldThemeStyle != null ? oldThemeStyle.ContainerDependents : StyleHelper.EmptyContainerDependents;

            /*FrugalStructList<ContainerDependent>*/var newContainerDependents =
                newThemeStyle != null ? newThemeStyle.ContainerDependents : StyleHelper.EmptyContainerDependents; 

            // Propagate invalidation for ThemeStyle dependents
            // Note that we are using the properties in the style's ContainerDependents as the exclusion list. 
            // This is so because GetValue logica gives precedence to a style value over a theme style value.
            // So there should be no need to invalidate those properties when the theme style changes.
            /*FrugalStructList<ContainerDependent> */
            var exclusionContainerDependents = (style != null) ? style.ContainerDependents : new FrugalStructList(); 
            StyleHelper.InvalidateContainerDependents(container,
                /*ref*/ exclusionContainerDependents, 
                /*ref*/ oldContainerDependents, 
                /*ref*/ newContainerDependents);


            // Propagate invalidation for resource references that may be
            // picking stuff from the style's ResourceDictionary
            StyleHelper.DoStyleResourcesInvalidations(container, fe, fce, oldThemeStyle, newThemeStyle); 
        }
    };

    //
    //  This method 
    //  1. Is invoked when the TemplateProperty is invalidated on a Control,
    //     Page, PageFunctionBase, ContentPresenter, or a sub-class thereof.
    //
//    internal static void 
    StyleHelper.DoTemplateInvalidations = function( 
        /*FrameworkElement*/            feContainer,
        /*FrameworkTemplate*/           oldFrameworkTemplate) 
    { 
//        Debug.Assert(feContainer != null);

        /*DependencyObject*/var    container;
        /*HybridDictionary[]*/var  oldTemplateData;
        /*FrameworkTemplate*/var   newFrameworkTemplate = null;
        /*object*/var              oldTemplate; 
        /*object*/var              newTemplate;
        /*bool*/var                newTemplateHasResourceReferences; 

//        Debug.Assert(feContainer != null);

        // Fetch the per-instance data before it goes away (during Template_get)
        oldTemplateData = StyleHelper.TemplateDataField.GetValue(feContainer);

        // Do immediate pull of Template to refresh the value since the 
        // new Template needs to be known at this time to do accurate
        // invalidations 
        newFrameworkTemplate = feContainer.TemplateInternal; 

        container = feContainer; 
        oldTemplate = oldFrameworkTemplate;
        newTemplate = newFrameworkTemplate;
        newTemplateHasResourceReferences = (newFrameworkTemplate != null) ? newFrameworkTemplate.HasResourceReferences : false;

        // If the template wants to watch for the Loaded and/or Unloaded events, set the
        // flag that says we want to receive it.  Otherwise, if it was set in the old template, clear it. 
        StyleHelper.UpdateLoadedFlag( container, oldFrameworkTemplate, newFrameworkTemplate ); 

        if (oldTemplate != newTemplate) 
        {
            //
            // Template is changing
            // 

            // Set up any per-instance state relating to the new Template 
            // We do this here instead of OnTemplateInvalidated because 
            // this needs to happen for the *first* Template.
            StyleHelper.UpdateInstanceData( 
                StyleHelper.TemplateDataField,
                feContainer /* fe */, null /* fce */,
                null /*oldStyle */, null /* newStyle */,
                oldFrameworkTemplate, newFrameworkTemplate, 
                InternalFlags.HasTemplateGeneratedSubTree);

            // If this new template has resource references (either for the container 
            // or for children in the visual tree), then, mark it so that it will
            // not be ignored during resource change invalidations 
            if (newTemplate != null && newTemplateHasResourceReferences)
            {
                Debug.Assert(feContainer != null);
                feContainer.HasResourceReference = true; 
            }

            // If the template wants to watch for the Loaded and/or Unloaded events, set the 
            // flag that says we want to receive it.  Otherwise, if it was set in the old template, clear it.

            StyleHelper.UpdateLoadedFlag( container, oldFrameworkTemplate, newFrameworkTemplate );


            // Wipe out VisualTree only if VisualTree factories 
            // are changing
            // 
            // If the factories are null for both new and old, then, the Template 
            // has the opportunity to supply the VisualTree using the "BuildVisualTree"
            // virtual. 
            /*FrameworkElementFactory*/ var             oldFactory;
            /*FrameworkElementFactory*/ var             newFactory;
            /*bool*/var                            canBuildVisualTree;
            /*bool*/var                                hasTemplateGeneratedSubTree; 
            /*FrugalStructList<ContainerDependent>*/var oldContainerDependents;
            /*FrugalStructList<ContainerDependent>*/var newContainerDependents; 

            oldFactory = (oldFrameworkTemplate != null) ? oldFrameworkTemplate.VisualTree : null; 
            newFactory = (newFrameworkTemplate != null) ? newFrameworkTemplate.VisualTree : null;

            canBuildVisualTree = (oldFrameworkTemplate != null) ? oldFrameworkTemplate.CanBuildVisualTree : false;
            hasTemplateGeneratedSubTree = feContainer.HasTemplateGeneratedSubTree; 
            oldContainerDependents = (oldFrameworkTemplate != null) ? oldFrameworkTemplate.ContainerDependents : StyleHelper.EmptyContainerDependents;
            newContainerDependents = (newFrameworkTemplate != null) ? newFrameworkTemplate.ContainerDependents : StyleHelper.EmptyContainerDependents; 

            if (hasTemplateGeneratedSubTree)
            { 
                StyleHelper.ClearGeneratedSubTree(oldTemplateData,
                    feContainer /* fe */, null /* fce */,
                    oldFrameworkTemplate );
            } 

            // Propagate invalidation for template dependents 
            /*FrugalStructList<ContainerDependent>*/var exclusionContainerDependents = new FrugalStructList();
            StyleHelper.InvalidateContainerDependents(container, 
                /*ref*/ exclusionContainerDependents,
                /*ref*/ oldContainerDependents,
                /*ref*/ newContainerDependents);

            // Propagate invalidation for resource references that may be
            // picking stuff from the style's ResourceDictionary 
            StyleHelper.DoTemplateResourcesInvalidations(container, feContainer, null /*fce*/, oldTemplate, newTemplate); 

            feContainer.OnTemplateChangedInternal(oldFrameworkTemplate, newFrameworkTemplate);
        }
        else
        { 
            //
            // Template is not changing 
            // 

            // Template was invalidated but didn't change. If the Template created the 
            // VisualTree via an override of BuildVisualTree, then, it is
            // wiped out now so that it may be conditionally rebuilt by the
            // custom Template
            if (newFrameworkTemplate != null) 
            {
                if (feContainer.HasTemplateGeneratedSubTree 
                    && newFrameworkTemplate.VisualTree == null 
                    && !newFrameworkTemplate.HasXamlNodeContent )
                { 
                    StyleHelper.ClearGeneratedSubTree(oldTemplateData, feContainer /* fe */, null /* fce */,
                        oldFrameworkTemplate);

                    // Nothing guarantees that ApplyTemplate actually gets 
                    // called, so ask for it explicitly (bug 963163).
                    feContainer.InvalidateMeasure(); 
                } 
            }
        } 
    };

    //
    // DoStyleResourcesInvalidation 
    //
    // This method is called to propagate invalidations for a Style.Resources 
    // change so all the ResourcesReferences in the sub-tree of the container 
    // gets invalidated.
    // 
//    internal static void 
    StyleHelper.DoStyleResourcesInvalidations = function(
        /*DependencyObject*/        container,
        /*FrameworkElement*/        fe,
        /*FrameworkContentElement*/ fce, 
        /*Style*/                   oldStyle,
        /*Style*/                   newStyle) 
    { 
        // Propagate invalidation for resource references that may be
        // picking stuff from the style's ResourceDictionary. This
        // invalidation needs to happen only if the style change is 
        // not the result of a tree change. If it is then the
        // ResourceReferences are already being wiped out by the 
        // InvalidateTree called for the tree change operation and so 
        // we do not need to repeat it here.
        /*bool*/var isAncestorChangedInProgress = (fe != null) ? fe.AncestorChangeInProgress : fce.AncestorChangeInProgress; 
        if (!isAncestorChangedInProgress)
        {
            /*List<ResourceDictionary>*/var oldStyleTables = GetResourceDictionariesFromStyle(oldStyle);
            /*List<ResourceDictionary>*/var newStyleTables = GetResourceDictionariesFromStyle(newStyle); 

            if ((oldStyleTables != null && oldStyleTables.Count > 0) || 
                (newStyleTables != null && newStyleTables.Count > 0)) 
            {
                // Set the ShouldLookupImplicitStyles flag if the given style's Resources has implicit styles. 
                SetShouldLookupImplicitStyles(new FrameworkObject(fe, fce), newStyleTables);

                TreeWalkHelper.InvalidateOnResourcesChange(fe, fce, new ResourcesChangeInfo(oldStyleTables, newStyleTables, true /*isStyleResourcesChange*/, false /*isTemplateResourcesChange*/, container));
            } 
        }
    }; 

    //
    // DoTemplateResourcesInvalidation 
    //
    // This method is called to propagate invalidations for a Template.Resources
    // change so all the ResourcesReferences in the sub-tree of the container
    // gets invalidated. 
    //
//    internal static void 
    StyleHelper.DoTemplateResourcesInvalidations = function( 
        /*DependencyObject*/        container, 
        /*FrameworkElement*/        fe,
        /*FrameworkContentElement*/ fce, 
        /*object*/                  oldTemplate,
        /*object*/                  newTemplate)
    {
        // Propagate invalidation for resource references that may be
        // picking stuff from the template's ResourceDictionary. This 
        // invalidation needs to happen only if the template change is 
        // not the result of a tree change. If it is then the
        // ResourceReferences are already being wiped out by the 
        // InvalidateTree called for the tree change operation and so
        // we do not need to repeat it here.
        var isAncestorChangedInProgress = (fe != null) ? fe.AncestorChangeInProgress : fce.AncestorChangeInProgress;
        if (!isAncestorChangedInProgress) 
        {
            /*List<ResourceDictionary>*/var oldResourceTable = GetResourceDictionaryFromTemplate(oldTemplate); 
            /*List<ResourceDictionary>*/var newResourceTable = GetResourceDictionaryFromTemplate(newTemplate); 

            if (oldResourceTable != newResourceTable) 
            {
                // Set the ShouldLookupImplicitStyles flag if the given template's Resources has implicit styles.
                SetShouldLookupImplicitStyles(new FrameworkObject(fe, fce), newResourceTable);

                TreeWalkHelper.InvalidateOnResourcesChange(fe, fce, new ResourcesChangeInfo(oldResourceTable, newResourceTable, false /*isStyleResourcesChange*/, true /*isTemplateResourcesChange*/, container));
            } 
        } 
    };

    // Sets the ShouldLookupImplicitStyles flag on the given element if the given style/template's
    // ResourceDictionary has implicit styles.
//    private static void 
    function SetShouldLookupImplicitStyles(/*FrameworkObject*/ fo, /*List<ResourceDictionary>*/ dictionaries)
    { 
        if (dictionaries != null && dictionaries.Count > 0 && !fo.ShouldLookupImplicitStyles)
        { 
            for (var i=0; i<dictionaries.Count; i++) 
            {
                if (dictionaries.Get(i).HasImplicitStyles) 
                {
                    fo.ShouldLookupImplicitStyles = true;
                    break;
                } 
            }
        } 
    } 

    // Given an object (that might be a Style or ThemeStyle) 
    // get its and basedOn Style's ResourceDictionary.  Null
    // is returned if all the dictionaries turn out to be empty.
//    private static List<ResourceDictionary> 
    function GetResourceDictionariesFromStyle(/*Style*/ style)
    { 
        /*List<ResourceDictionary>*/var dictionaries = null;

        while (style != null) 
        {
            if (style._resources != null) 
            {
                if (dictionaries == null)
                {
                    dictionaries = new List/*<ResourceDictionary>*/(1); 
                }

                dictionaries.Add(style._resources); 
            }

            style = style.BasedOn;
        }

        return dictionaries; 
    }

    // Given an object (that might be a FrameworkTemplate) 
    //  get its ResourceDictionary.  Null is returned if the dictionary
    //  turns out to be empty. 
//    private static List<ResourceDictionary> 
    function GetResourceDictionaryFromTemplate( /*object*/ template )
    {
        /*ResourceDictionary*/var resources = null;

        if( template instanceof FrameworkTemplate )
        { 
            resources = (/*(FrameworkTemplate)*/template)._resources; 
        }

        if (resources != null)
        {
            /*List<ResourceDictionary>*/var table = new List/*<ResourceDictionary>*/(1);
            table.Add(resources); 
            return table;
        } 

        return null;
    } 

    //
    // UpdateLoadedFlags
    // 
    // These methods are called to update the Loaded/Unloaded
    // optimization flags on an FE or FCE, when a style or template 
    // affecting that element has changed. 
    // If HasLoadedChangeHandler was through an Interface we could Template this.

//    internal static void 
    StyleHelper.UpdateLoadedFlag = function( /*DependencyObject*/ d,
            /*Style*/ oldStyle, /*Style*/ newStyle)
    {
        if((oldStyle==null || !oldStyle.HasLoadedChangeHandler) 
            && (newStyle != null && newStyle.HasLoadedChangeHandler)) 
        {
            BroadcastEventHelper.AddHasLoadedChangeHandlerFlagInAncestry(d); 
        }
        else if((oldStyle != null && oldStyle.HasLoadedChangeHandler)
            && (newStyle==null || !newStyle.HasLoadedChangeHandler))
        { 
            BroadcastEventHelper.RemoveHasLoadedChangeHandlerFlagInAncestry(d);
        } 
    };

//    internal static void 
    StyleHelper.UpdateLoadedFlag = function( /*DependencyObject*/ d, 
            /*FrameworkTemplate*/ oldFrameworkTemplate, /*FrameworkTemplate*/ newFrameworkTemplate)
    {
        // We've seen a case where the XAML designer in VS uses DeferredThemeResourceReference
        // for the Template, but the old value evaluates to null and the new value is null because the 
        // element was being removed from the tree.  In such cases, just no-op, instead of the old
        // Invariant.Assert. 
        // Invariant.Assert(null != oldFrameworkTemplate || null != newFrameworkTemplate); 

        if((oldFrameworkTemplate==null || !oldFrameworkTemplate.HasLoadedChangeHandler) 
            && (newFrameworkTemplate != null && newFrameworkTemplate.HasLoadedChangeHandler))
        {
            BroadcastEventHelper.AddHasLoadedChangeHandlerFlagInAncestry(d);
        } 
        else if((oldFrameworkTemplate != null && oldFrameworkTemplate.HasLoadedChangeHandler)
            && (newFrameworkTemplate==null || !newFrameworkTemplate.HasLoadedChangeHandler)) 
        { 
            BroadcastEventHelper.RemoveHasLoadedChangeHandlerFlagInAncestry(d);
        } 
    };

     //
    //  This method 
    //  1. Invalidates all the properties set on the container's style.
    //     The value could have been set directly on the Style or via Trigger. 
    // 
//    internal static void 
    StyleHelper.InvalidateContainerDependents = function(
        /*DependencyObject*/                         container, 
        /*ref FrugalStructList<ContainerDependent>*/ exclusionContainerDependents,
        /*ref FrugalStructList<ContainerDependent>*/ oldContainerDependents,
        /*ref FrugalStructList<ContainerDependent>*/ newContainerDependents)
    { 
        // Invalidate all properties on the container that were being driven via the oldStyle
        var count = oldContainerDependents.Count; 
        for (var i = 0; i < count; i++) 
        {
            /*DependencyProperty*/var dp = oldContainerDependents.Get(i).Property; 

            // Invalidate the property only if it is not locally set
            if (!StyleHelper.IsSetOnContainer(dp, /*ref*/ exclusionContainerDependents, false /*alsoFromTriggers*/))
            { 
                // call GetValueCore to get value from Style/Template
                container.InvalidateProperty(dp); 
            } 
        }

        // Invalidate all properties on the container that will be driven via the newStyle
        count = newContainerDependents.Count;
        if (count > 0)
        { 
            /*FrameworkObject*/var fo = new FrameworkObject(container);

            for (var i = 0; i < count; i++) 
            {
                /*DependencyProperty*/var dp = newContainerDependents.Get(i).Property; 

                // Invalidate the property only if it
                // - is not a part of oldContainerDependents and
                // - is not locally set 
                if (!StyleHelper.IsSetOnContainer(dp, /*ref*/ exclusionContainerDependents, false /*alsoFromTriggers*/) &&
                    !StyleHelper.IsSetOnContainer(dp, /*ref*/ oldContainerDependents, false /*alsoFromTriggers*/)) 
                { 
                	StyleHelper.ApplyStyleOrTemplateValue(fo, dp);
                } 
            }
        }
    };

//    internal static void 
    StyleHelper.ApplyTemplatedParentValue = function(
            /*DependencyObject*/                container, 
            /*FrameworkObject*/                 child, 
            /*int*/                             childIndex,
        /*ref FrugalStructList<ChildRecord>*/   childRecordFromChildIndex, 
            /*DependencyProperty*/              dp,
            /*FrameworkElementFactory*/         templateRoot)
    {
        /*EffectiveValueEntry*/
    	var newEntry = new EffectiveValueEntry(dp); 
        newEntry.Value = DependencyProperty.UnsetValue;
        
        var newEntryRef = {
        	"newEntry" : newEntry
        };
        
        var r = StyleHelper.GetValueFromTemplatedParent( 
                container, 
                childIndex,
                child, 
                dp,
            /*ref*/ childRecordFromChildIndex,
                templateRoot,
            /*ref newEntry*/newEntryRef.newEntry);
            
        if (r) 
        { 
            /*DependencyObject*/var target = child.DO; 
            target.UpdateEffectiveValue(
                    target.LookupEntry(dp.GlobalIndex), 
                    dp,
                    dp.GetMetadata(target.DependencyObjectType),
                    new EffectiveValueEntry() /* oldEntry */,
                /*ref newEntry*/newEntryRef, 
                    false /* coerceWithDeferredReference */,
                    false /* coerceWithCurrentValue */, 
                    OperationType.Unknown); 
        }
    };


//    internal static bool 
    StyleHelper.GetValueFromTemplatedParent = function(
            /*DependencyObject*/                container, 
            /*int*/                             childIndex,
            /*FrameworkObject*/                 child, 
            /*DependencyProperty*/              dp, 
        /*ref FrugalStructList<ChildRecord>*/   childRecordFromChildIndex,
            /*FrameworkElementFactory*/         templateRoot, 
        /*ref EffectiveValueEntry             entry*/entry)
    {
        /*ValueLookupType*/
    	var sourceType = ValueLookupType.Simple;
        // entry will be updated to hold the value -- we only need to set the value source 
        
        var sourceTypeOut = {
        	"sourceType" : sourceType
        };
        /*object*/
        var value = StyleHelper.GetChildValue(
            StyleHelper.TemplateDataField, 
            container, 
            childIndex,
            child, 
            dp,
            /*ref*/ childRecordFromChildIndex,
            /*ref entry*/entry,
            /*out sourceType*/sourceTypeOut, 
            templateRoot);
        
        sourceType =sourceTypeOut.sourceType;

        if (value != DependencyProperty.UnsetValue) 
        {
            if (sourceType == ValueLookupType.Trigger || 
                sourceType == ValueLookupType.PropertyTriggerResource ||
                sourceType == ValueLookupType.DataTrigger ||
                sourceType == ValueLookupType.DataTriggerResource)
            { 
            	entry.BaseValueSourceInternal = BaseValueSourceInternal.ParentTemplateTrigger;
            } 
            else 
            {
            	entry.BaseValueSourceInternal = BaseValueSourceInternal.ParentTemplate; 
            }

            return true;
        } 
        else
        { 
            // If we didn't get a value from GetValueFromTemplatedParent, we know that 
            // the template isn't offering a value from a trigger or from its shared
            // value table.  But we could still have a value from the template, stored 
            // in per-instance storage (e.g. a Freezable with an embedded dynamic binding).

            if (child.StoresParentTemplateValues)
            { 
                /*HybridDictionary*/
            	var parentTemplateValues = StyleHelper.ParentTemplateValuesField.GetValue(child.DO);
                if(parentTemplateValues.Contains(dp)) 
                { 
                	entry.BaseValueSourceInternal = BaseValueSourceInternal.ParentTemplate;
                    value = parentTemplateValues.Get(dp); 
                    entry.Value = value;

                    if (value instanceof MarkupExtension)
                    { 
                        // entry will be updated to hold the value
                        StyleHelper.GetInstanceValue( 
                                    StyleHelper.TemplateDataField, 
                                    container,
                                    child.FE, 
                                    child.FCE,
                                    childIndex,
                                    dp,
                                    StyleHelper.UnsharedTemplateContentPropertyIndex, 
                                    /*ref entry*/entry);
                    } 

                    return true;
                } 
            }
        }

        return false; 
    };

//    internal static void 
    StyleHelper.ApplyStyleOrTemplateValue = function( 
            /*FrameworkObject*/ fo,
            /*DependencyProperty*/ dp) 
    {
        /*EffectiveValueEntry*/var newEntry = new EffectiveValueEntry(dp);
        newEntry.Value = DependencyProperty.UnsetValue;
        
        var newEntryRef = {
        	"entry" : newEntry
        };
        
        if (StyleHelper.GetValueFromStyleOrTemplate(fo, dp, /*ref*/ newEntry)) 
        {
        	newEntryRef = {
        		"newEntry" : newEntryRef.entry 
        	};
            /*DependencyObject*/
        	var target = fo.DO; 
            target.UpdateEffectiveValue( 
                  target.LookupEntry(dp.GlobalIndex),
                  dp, 
                  dp.GetMetadata(target.DependencyObjectType),
                  new EffectiveValueEntry() /* oldEntry */,
                  /*ref newEntry*/newEntryRef,
                  false /* coerceWithDeferredReference */, 
                  false /* coerceWithCurrentValue */,
                  OperationType.Unknown); 
        } 
    };

//    internal static bool 
    StyleHelper.GetValueFromStyleOrTemplate = function(
            /*FrameworkObject*/ fo,
            /*DependencyProperty*/ dp,
        /*ref EffectiveValueEntry*/ entry) 
    {
        /*ValueLookupType*/
    	var sourceType = ValueLookupType.Simple; 

        // setterValue & setterEntry are used to record the result of a style setter,
        // so that if a higher-priority template trigger does not apply, we can use 
        // this value
        /*object*/
    	var setterValue = Type.UnsetValue;
        /*EffectiveValueEntry*/
    	var setterEntry = entry;
        /*object*/
    	var value; 

        // Regardless of metadata, the Style property is never stylable on "Self" 
        /*Style*/
    	var style = fo.Style; 
        if ((style != null) && StyleHelper.ShouldGetValueFromStyle(dp))
        { 
        	var sourceTypeOut = {
        		"sourceType" : sourceType	
        	};
            // Get value from Style Triggers/Storyboards

            // This is a styled container, check for style-driven value
            // Container's use child index '0' (meaning "self") 

            // This is the 'container' and the 'child' 
            // entry will be updated to hold the value -- we only need to set the value source 
            value = StyleHelper.GetChildValue(
                StyleHelper.StyleDataField, 
                fo.DO,
                0,
                fo,
                dp, 
                /*ref*/ style.ChildRecordFromChildIndex,
                /*ref setterEntry*/setterEntry, 
                /*out sourceType*/sourceTypeOut, 
                null);
            
            sourceType = sourceTypeOut.sourceType;

            if (value != DependencyProperty.UnsetValue)
            {
                if (sourceType == ValueLookupType.Trigger ||
                    sourceType == ValueLookupType.PropertyTriggerResource || 
                    sourceType == ValueLookupType.DataTrigger ||
                    sourceType == ValueLookupType.DataTriggerResource) 
                { 
                	entry = setterEntry;
                	entry.BaseValueSourceInternal = BaseValueSourceInternal.StyleTrigger; 
                    return true;
                }
                else
                { 
//                    Debug.Assert(sourceType == ValueLookupType.Simple ||
//                                 sourceType == ValueLookupType.Resource); 
                    setterValue = value; 
                }
            } 
        }

        // Get value from Template Triggers/Storyboards
        if (StyleHelper.ShouldGetValueFromTemplate(dp)) 
        {
            /*FrameworkTemplate*/var template = fo.TemplateInternal; 
            if (template != null) 
            {
            	
            	var sourceTypeOut = {
                		"sourceType" : sourceType	
                	};
                // This is a templated container, check for template-driven value 
                // Container's use child index '0' (meaning "self")

                // This is the 'container' and the 'child'
                // entry will be updated to hold the value -- we only need to set the value source 
                value = StyleHelper.GetChildValue(
                    StyleHelper.TemplateDataField, 
                    fo.DO, 
                    0,
                    fo, 
                    dp,
                    /*ref*/ template.ChildRecordFromChildIndex,
                    /*ref entry*/entry,
                    /*out sourceType*/sourceTypeOut, 
                    template.VisualTree);
                sourceType = sourceTypeOut.sourceType;
                if (value != DependencyProperty.UnsetValue) 
                { 
//                    Debug.Assert(sourceType == ValueLookupType.Trigger ||
//                                 sourceType == ValueLookupType.PropertyTriggerResource || 
//                                 sourceType == ValueLookupType.DataTrigger ||
//                                 sourceType == ValueLookupType.DataTriggerResource);

                    entry.BaseValueSourceInternal = BaseValueSourceInternal.TemplateTrigger; 
                    return true;
                } 
            } 
        }

        // Get value from Style Setters
        if (setterValue != Type.UnsetValue)
        {
            entry = setterEntry; 
            entry.BaseValueSourceInternal = BaseValueSourceInternal.Style;
            return true; 
        } 

        // Get value from ThemeStyle Triggers/Storyboards/Setters 
        // Note that this condition assumes that DefaultStyleKey cannot be set on a ThemeStyle
        if (StyleHelper.ShouldGetValueFromThemeStyle(dp))
        {
            /*Style*/var themeStyle = fo.ThemeStyle; 

            if (themeStyle != null) 
            { 
            	var sourceTypeOut = {
                		"sourceType" : sourceType	
                	};
                // The desired property value could not be found in the self style,
                // check if the theme style has a value for it 
                // Container's use child index '0' (meaning "self")

                // This is the 'container' and the 'child'
                // entry will be updated to hold the value -- we only need to set the value source 
                value = StyleHelper.GetChildValue(
                    StyleHelper.ThemeStyleDataField, 
                    fo.DO, 
                    0,
                    fo, 
                    dp,
                    /*ref*/ themeStyle.ChildRecordFromChildIndex,
                    /*ref entry*/entry,
                    /*out sourceType*/sourceTypeOut, 
                    null);
                sourceType = sourceTypeOut.sourceType;
                if (value != DependencyProperty.UnsetValue) 
                { 
                    if (sourceType == ValueLookupType.Trigger ||
                        sourceType == ValueLookupType.PropertyTriggerResource || 
                        sourceType == ValueLookupType.DataTrigger ||
                        sourceType == ValueLookupType.DataTriggerResource)
                    {
                        entry.BaseValueSourceInternal = BaseValueSourceInternal.ThemeStyleTrigger; 
                    }
                    else 
                    { 
//                        Debug.Assert(sourceType == ValueLookupType.Simple ||
//                                     sourceType == ValueLookupType.Resource); 
                        entry.BaseValueSourceInternal = BaseValueSourceInternal.ThemeStyle;
                    }

                    return true; 
                }
            } 
        } 
        return false;
    };



    // 
    //  This method
    //  1. Sorts a resource dependent list by (childIndex, dp.GlobalIndex). 
    //  This helps to avoid duplicate invalidation. 
    //
//    internal static void 
    StyleHelper.SortResourceDependents = function( 
        /*ref FrugalStructList<ChildPropertyDependent>*/ resourceDependents)
    {
        // Ideally this would be done by having the ChildPropertyDependent
        // struct implement IComparable<ChildPropertyDependent>, and just 
        // calling resourceDependents.Sort().  Unfortunately, this causes
        // an unwelcome JIT of mscorlib, to load internal methods 
        // GenericArraySortHelper<T>.Sort and GenericArraySortHelper<T>.QuickSort. 
        //
        // Instead we implement sort directly.  The resource dependent lists 
        // are short and nearly-sorted in practice, so insertion sort is good
        // enough.

        var n = resourceDependents.Count; 
        for (var i=1; i<n; ++i)
        { 
            /*ChildPropertyDependent*/
        	var current = resourceDependents[i]; 
            var childIndex = current.ChildIndex;
            var dpIndex = current.Property.GlobalIndex; 

            var j;
            for (j=i-1;  j>=0;  --j)
            { 
                if (childIndex < resourceDependents[j].ChildIndex ||
                    (childIndex == resourceDependents[j].ChildIndex && 
                     dpIndex < resourceDependents[j].Property.GlobalIndex)) 
                {
                    resourceDependents[j+1] = resourceDependents[j]; 
                }
                else
                {
                    break; 
                }
            } 

            if (j < i-1)
            { 
                resourceDependents[j+1] = current;
            }
        }
    };

    // 
    //  This method 
    //  1. Invalidates all the resource references set on a style or a template.
    // 
    //  Note: In the case that the visualtree was not generated from the particular
    //  style in question we will skip past those resource references that haven't
    //  been set on the container. This condition is described by the
    //  invalidateVisualTreeToo flag being false. 
    //
//    internal static void 
    StyleHelper.InvalidateResourceDependents = function( 
        /*DependencyObject*/                             container, 
        /*ResourcesChangeInfo*/                          info,
        /*ref FrugalStructList<ChildPropertyDependent>*/ resourceDependents, 
        /*bool*/                                         invalidateVisualTreeToo)
    {
        /*List<DependencyObject>*/var styledChildren = TemplatedFeChildrenField.GetValue(container);

        // Invalidate all properties on this container and its children that
        // are being driven via a resource reference in a style 
        for (var i = 0; i < resourceDependents.Count; i++) 
        {
            // Invalidate property 
            //  1. If nothing is known about the data or
            //  2. If the data tells us the key in the dictionary that was modified and this property is refering to it or
            //  3. If it tells us info about the changed dictionaries and this property was refering to one of their entries
            //  4. If this a theme change 
            if (info.Contains(resourceDependents.Get(i).Name, false /*isImplicitStyleKey*/))
            { 
                /*DependencyObject*/var child = null; 
                /*DependencyProperty*/var invalidProperty = resourceDependents.Get(i).Property;

                var childIndex = resourceDependents.Get(i).ChildIndex;
                if (childIndex == 0)
                {
                    // Index '0' means 'self' (container) 
                    child = container;
                } 
                else if (invalidateVisualTreeToo) 
                {
//                    Debug.Assert(styledChildren != null, "Should reach here only if the template tree has already been created"); 

                    // Locate child to invalidate
                    child = StyleHelper.GetChild(styledChildren, childIndex);

                    if (child == null)
                    { 
                        throw new Error('InvalidOperationException(SR.Get(SRID.ChildTemplateInstanceDoesNotExist)'); 
                    }
                } 

                if (child != null)
                {
                    // Invalidate property on child 
                    child.InvalidateProperty(invalidProperty);

                    // skip remaining dependents for the same property - we only 
                    // need to invalidate once.  The list is sorted, so we just need
                    // to skip until we find a new property. 
                    var dpIndex = invalidProperty.GlobalIndex;
                    while (++i < resourceDependents.Count)
                    {
                        if (resourceDependents.Get(i).ChildIndex != childIndex || 
                            resourceDependents.Get(i).Property.GlobalIndex != dpIndex)
                        { 
                            break; 
                        }
                    } 
                    --i;    // back up to let the for-loop do its normal increment
                }
            }
        } 
    };

    // 
    //  This method
    //  1. Invalidates all the resource references set on a template for a given child. 
    //  2. Returns true if any were found
    //
//    internal static void 
    StyleHelper.InvalidateResourceDependentsForChild = function(
            /*DependencyObject*/                            container, 
            /*DependencyObject*/                            child,
            /*int*/                                         childIndex, 
            /*ResourcesChangeInfo*/                         info, 
            /*FrameworkTemplate*/                           parentTemplate)
    { 
        /*FrugalStructList<ChildPropertyDependent>*/var resourceDependents = parentTemplate.ResourceDependents;
        var count = resourceDependents.Count;

        // Invalidate all properties on the given child that 
        // are being driven via a resource reference in a template
        for (var i = 0; i < count; i++) 
        { 
            if (resourceDependents[i].ChildIndex == childIndex &&
                info.Contains(resourceDependents.Get(i).Name, false /*isImplicitStyleKey*/)) 
            {
                /*DependencyProperty*/var dp = resourceDependents.Get(i).Property;
                // Update property on child
                child.InvalidateProperty(dp); 

                // skip remaining dependents for the same property - we only 
                // need to invalidate once.  The list is sorted, so we just need 
                // to skip until we find a new property.
                var dpIndex = dp.GlobalIndex; 
                while (++i < resourceDependents.Count)
                {
                    if (resourceDependents.Get(i).ChildIndex != childIndex ||
                        resourceDependents.Get(i).Property.GlobalIndex != dpIndex) 
                    {
                        break; 
                    } 
                }
                --i;    // back up to let the for-loop do its normal increment 
            }
        }
    };

    //
    //  This method 
    //  1. Returns true if any resource references are set on a template for a given child. 
    //
//    internal static bool 
    StyleHelper.HasResourceDependentsForChild = function( 
        /*int*/                                          childIndex,
        /*ref FrugalStructList<ChildPropertyDependent>*/ resourceDependents)
    {
        // Look for properties on the given child that 
        // are being driven via a resource reference in a template
        for (var i = 0; i < resourceDependents.Count; i++) 
        { 
            if (resourceDependents.Get(i).ChildIndex == childIndex)
            { 
                return true;
            }
        }

        return false;
    }; 

    //
    //  This method 
    //  1. Invalidates properties set on a TemplateNode directly or via a Trigger
    //
//    internal static void 
    StyleHelper.InvalidatePropertiesOnTemplateNode = function(
            /*DependencyObject*/                container, 
            /*FrameworkObject*/                 child,
            /*int*/                             childIndex, 
        /*ref FrugalStructList<ChildRecord>*/   childRecordFromChildIndex, 
            /*bool*/                            isDetach,
            /*FrameworkElementFactory*/         templateRoot) 
    {
        // Check if this Child Index is represented in given data-structure 
        if ((0 <= childIndex) && (childIndex < childRecordFromChildIndex.Count))
        { 
            // Fetch the childRecord for the given childIndex 
            /*ChildRecord*/var childRecord = childRecordFromChildIndex.Get(childIndex);
            var count = childRecord.ValueLookupListFromProperty.Count; 
            if (count > 0)
            {
                // Iterate through all the properties set on the given childRecord
                for (var i=0; i< count; i++) 
                {
                    // NOTE: Every entry in the ValueLookupListFromProperty corresponds to 
                    // one DependencyProperty. All the items in Entries[i].Value.List 
                    // represent values for the same DependencyProperty that might have
                    // originated from different sources such as a direct property set or a 
                    // Trigger or a Storyboard value.
                	
                    /*DependencyProperty*/
                	var dp = childRecord.ValueLookupListFromProperty.Entries[i].Value.List[0].Property;
//                  Debug.Assert(dp != null, "dp must not be null");

                    if (!isDetach)
                    { 
                    	StyleHelper.ApplyTemplatedParentValue( 
                                container,
                                child, 
                                childIndex,
                            /*ref*/ childRecordFromChildIndex,
                                dp,
                                templateRoot); 
                    }
                    else 
                    { 
                        // for the detach case, we can skip inherited properties
                        // see comment in ClearTemplateChain 

                        // Invalidate only the non-inherited, non-style properties.
                        // Note that I say non-style because StyleProperty is really
                        // a psuedo inherited property, which gets specially handled 
                        // during an InvalidateTree call.
                        if (dp != EnsureFrameworkElement().StyleProperty) 
                        { 
                            var invalidate = true;

                            if (dp.IsPotentiallyInherited)
                            {
                                /*PropertyMetadata*/var metadata = dp.GetMetadata(child.DO.DependencyObjectType);
                                if ((metadata != null) && metadata.IsInherited) 
                                {
                                    invalidate = false; 
                                } 
                            }

                            if (invalidate)
                            {
                                child.DO.InvalidateProperty(dp);
                            } 
                        }
                    } 
                } 
            }
        } 
    };

    //
    //  This method 
    //  1. Says if the given DP a part of the given ContainerDependents
    //  2. Is used to skip properties while invalidating the inherited properties for an 
    //     ancestor change. If this method returns true the invalidation will be skipped. 
    //     If this DP has been set on the container this value will take precedence over the inherited
    //     value. Hence there is no need to invalidate this property as part of ancestor change processing. 
    //
    //  Ancestor changed invalidation for this DP can be skipped if it
    //  - Is in the give ContainerDependents list but
    //  - Is not the result of visual trigger 
    //  NOTE: If the style has changed all container dependents including the ones originating
    //  from visual triggers would have been invalidated. Hence they can all be skipped. 
    // 
//    internal static bool 
    StyleHelper.IsSetOnContainer = function(
        /*DependencyProperty*/                       dp, 
        /*ref FrugalStructList<ContainerDependent>*/ containerDependents,
        /*bool*/                                     alsoFromTriggers)
    {
        for (var i = 0; i < containerDependents.Count; i++) 
        {
            if (dp == containerDependents.Get(i).Property) 
            { 
                return alsoFromTriggers || !containerDependents.Get(i).FromVisualTrigger;
            } 
        }
        return false;
    };

    //
    //  This method 
    //  1. Is invoked when Styled/Templated container property invalidation 
    //     is propagated to its dependent properties from Style/Template.
    // 
//    internal static void 
    StyleHelper.OnTriggerSourcePropertyInvalidated = function(
        /*Style*/                                                       ownerStyle,
        /*FrameworkTemplate*/                                           frameworkTemplate,
        /*DependencyObject*/                                            container, 
        /*DependencyProperty*/                                          dp,
        /*DependencyPropertyChangedEventArgs*/                          changedArgs, 
        /*bool*/                                                        invalidateOnlyContainer, 
        /*ref FrugalStructList<ItemStructMap<TriggerSourceRecord>>*/    triggerSourceRecordFromChildIndex,
        /*ref FrugalMap*/                                               propertyTriggersWithActions, 
        /*int*/                                                         sourceChildIndex)
    {
        ///////////////////////////////////////////////////////////////////
        // Update all values affected by property trigger Setters 

        // Check if this Child Index is represented in given data-structure
        if ((0 <= sourceChildIndex) && (sourceChildIndex < triggerSourceRecordFromChildIndex.Count)) 
        {
            // Fetch the triggerSourceRecordMap for the given childIndex
            /*ItemStructMap<TriggerSourceRecord>*/
        	var triggerSourceRecordMap = triggerSourceRecordFromChildIndex.Get(sourceChildIndex);

            // Check if this Container property is represented in style
            var mapIndex = triggerSourceRecordMap.Search(dp.GlobalIndex); 
            if (mapIndex >= 0) 
            {
                // Container's property is represented in style 
                /*TriggerSourceRecord*/
            	var record = triggerSourceRecordMap.Entries[mapIndex].Value;

                // Invalidate all Self/Child-Index/Property dependents
                InvalidateDependents(ownerStyle, frameworkTemplate, container, dp, 
                    /*ref*/ record.ChildPropertyDependents, invalidateOnlyContainer);
            } 
        } 

        /////////////////////////////////////////////////////////////////// 
        // Find all TriggerActions that may need to execute in response to
        //  the property change.
        var candidateTrigger = propertyTriggersWithActions.Get(dp.GlobalIndex);

        if( candidateTrigger != Type.UnsetValue )
        { 
            // One or more trigger objects need to be evaluated.  The candidateTrigger 
            //  object may be a single trigger or a collection of them.

            /*TriggerBase*/var triggerBase = candidateTrigger instanceof TriggerBase ? candidateTrigger : null;
            if( triggerBase != null )
            {
                InvokePropertyTriggerActions( triggerBase, container, dp, changedArgs, sourceChildIndex, 
                    ownerStyle, frameworkTemplate );
            } 
            else 
            {
                /*List<TriggerBase>*/var triggerList = candidateTrigger; 

                for( var i = 0; i < triggerList.Count; i++ ) 
                { 
                    InvokePropertyTriggerActions( triggerList.Get(i), container, dp, changedArgs, sourceChildIndex,
                        ownerStyle, frameworkTemplate ); 
                }
            }
        }
    } 


    // 
    //  This method
    //  1. Is common code to invalidate a list of dependents of a property trigger 
    //     or data trigger. Returns true if any of the dependents could not
    //     be invalidated because they don't exist yet.
    //
//    private static void 
    function InvalidateDependents( 
            /*Style*/                                    ownerStyle,
            /*FrameworkTemplate*/                        frameworkTemplate, 
            /*DependencyObject*/                         container, 
            /*DependencyProperty*/                       dp,
        /*ref FrugalStructList<ChildPropertyDependent>*/ dependents, 
            /*bool*/                                     invalidateOnlyContainer)
    {
//        Debug.Assert(ownerStyle != null || frameworkTemplate != null );

        for (var i = 0; i < dependents.Count; i++)
        { 
            /*DependencyObject*/var child = null; 

            var childIndex = dependents.Get(i).ChildIndex; 
            if (childIndex == 0)
            {
                // Index '0' means 'self' (container)
                child = container; 
            }
            else if (!invalidateOnlyContainer) 
            { 
                // Locate child to invalidate

                // This assumes that at least one node in the
                //  Style.VisualTree is in the child chain, to guarantee
                //  this, the root node is always in the child chain.
                /*List<DependencyObject>*/var styledChildren = StyleHelper.TemplatedFeChildrenField.GetValue(container); 
                if ((styledChildren != null) && (childIndex <= styledChildren.Count))
                { 
                    child = StyleHelper.GetChild(styledChildren, childIndex); 

                    // Notice that we allow GetChildValue to return null because it 
                    // could so happen that the dependent properties for the current
                    // trigger source are on nodes that haven't been instantiated yet.
                    // We do not have to bother about deferring these invalidations
                    // because InvalidatePropertiesOnTemplateNode will take care of 
                    // these invalidations when the node is instantiated via
                    // FrameworkElementFactory.InstantiateTree. 
                } 
            }

            // Invalidate property on child
            /*DependencyProperty*/ var invalidProperty = dependents.Get(i).Property;

            // Invalidate only if the property is not locally set because local value 
            // has precedence over style acquired value.
//            var hasModifiers; 
            if (child != null && 
                child.GetValueSource(invalidProperty, null, /*out hasModifiers*/{"hasModifiers" : null }) != BaseValueSourceInternal.Local)
            { 
                child.InvalidateProperty(invalidProperty, /*preserveCurrentValue:*/true);
//                ApplyStyleOrTemplateValue(new FrameworkObject(child), invalidProperty);
            }
        } 
    }

    // This is expected to be called when a Binding for a DataTrigger has 
    //   changed and we need to look for true/false transitions.  If found,
    //   invoke EnterAction (or ExitAction) as needed. 
//    private static void 
    function InvokeDataTriggerActions( /*TriggerBase*/ triggerBase,
        /*DependencyObject*/ triggerContainer, /*BindingBase*/ binding, /*BindingValueChangedEventArgs*/ bindingChangedArgs,
        /*Style*/ style, /*FrameworkTemplate*/ frameworkTemplate,
        /*UncommonField<HybridDictionary[]>*/ dataField) 
    {
        /*bool*/var oldState; 
        /*bool*/var newState; 
        var oldStateOut = {
        	"oldState" : oldState
        };
        
        var newStateOut = {
        	"newState" : newState
        };

        /*DataTrigger*/var dataTrigger = triggerBase instanceof DataTrigger ? triggerBase : null; 

        if( dataTrigger != null )
        {
            EvaluateOldNewStates( dataTrigger, triggerContainer, 
                binding, bindingChangedArgs, dataField,
                style, frameworkTemplate, 
                /*out oldState*/oldStateOut, /*out newState*/newStateOut ); 
            oldState = oldStateOut.oldState;
            newState = newStateOut.newState;
        }
        else 
        {
            EvaluateOldNewStates(triggerBase, triggerContainer,
                binding, bindingChangedArgs, dataField, 
                style, frameworkTemplate, 
                /*out oldState*/oldStateOut, /*out newState*/newStateOut );
            oldState = oldStateOut.oldState;
            newState = newStateOut.newState;
        } 

        InvokeEnterOrExitActions( triggerBase, oldState, newState, triggerContainer,
            style, frameworkTemplate  );
    } 

    // This is expected to be called when a property value has changed and that 
    //  property is specified as a condition in a trigger. 
    // We're given the trigger here, the property changed, and the before/after state.
    // Evaluate the Trigger, and see if we need to invoke any of the TriggerAction 
    //  objects associated with the given trigger.
//    private static void 
    function InvokePropertyTriggerActions( /*TriggerBase*/ triggerBase,
        /*DependencyObject*/ triggerContainer, /*DependencyProperty*/ changedProperty,
        /*DependencyPropertyChangedEventArgs*/ changedArgs, /*int*/ sourceChildIndex, 
        /*Style*/ style, /*FrameworkTemplate*/ frameworkTemplate )
    { 
        /*bool*/var oldState; 
        /*bool*/var newState;

        var oldStateOut = {
            	"oldState" : oldState
            };
            
        var newStateOut = {
        	"newState" : newState
        };
            
        /*Trigger*/var trigger = triggerBase instanceof Trigger ? triggerBase : null;

        if( trigger != null )
        { 
            EvaluateOldNewStates( trigger, triggerContainer, changedProperty, changedArgs,
                sourceChildIndex, style, frameworkTemplate, 
                /*out oldState*/oldStateOut, /*out newState*/newStateOut ); 
            oldState = oldStateOut.oldState;
            newState = newStateOut.newState;
        }
        else 
        {
            EvaluateOldNewStates(triggerBase, triggerContainer, changedProperty, changedArgs,
                sourceChildIndex, style, frameworkTemplate, 
                /*out oldState*/oldStateOut, /*out newState*/newStateOut ); 
            oldState = oldStateOut.oldState;
            newState = newStateOut.newState;
        }

        InvokeEnterOrExitActions( triggerBase, oldState, newState, triggerContainer,
            style, frameworkTemplate );
    }

    // Called from UpdateStyleCache - When an object's Style changes, some of
    //  the triggers contain EnterActions and they want to be run immediately 
    //  if the trigger condition evaluates to true. 
    // Usually these EnterActions are to be run when there's a False->True
    //  transition.  This code treats "true at time Style is applied" as 
    //  a False->True transition even though it's possible no transition ever
    //  took place.
//    private static void 
    function ExecuteOnApplyEnterExitActions( /*FrameworkElement*/ fe,
        /*FrameworkContentElement*/ fce, /*Style*/ style, /*UncommonField<HybridDictionary[]>*/ dataField ) 
    {
    	if(arguments.length ==3){
    		var ft = style;
            // If the "Template Change" is a template being set to null - exit.
            if( ft == null ) 
            {
                return;
            }
            // Note: PropertyTriggersWithActions is a FrugalMap, so its count is checked against zero. 
            //  DataTriggersWithActions is a HybridDictionary allocated on demand, so it's checked against null.
            if( ft != null && ft.PropertyTriggersWithActions.Count == 0 && (ft.DataTriggersWithActions == null || ft.DataTriggersWithActions.Count==0)) 
            { 
                // FrameworkTemplate has no trigger actions at all, exit.
                return; 
            }

            /*TriggerCollection*/var triggers = ft.TriggersInternal; 
            /*DependencyObject*/var triggerContainer = (fe != null) ? fe : fce;

            ExecuteOnApplyEnterExitActionsLoop( triggerContainer, triggers, null, ft, StyleHelper.TemplateDataField ); 
    	}else if(arguments.length ==4){
            // If the "Style Change" is the style being set to null - exit. 
            if( style == null ) 
            {
                return; 
            }
            // Note: PropertyTriggersWithActions is a FrugalMap, so its count is checked against zero.
            //  DataTriggersWithActions is a HybridDictionary allocated on demand, so it's checked against null.
            if( style.PropertyTriggersWithActions.Count == 0 && (style.DataTriggersWithActions == null || style.DataTriggersWithActions.Count==0)) 
            {
                // Style has no trigger actions at all, exit. 
                return; 
            }

            /*TriggerCollection*/var triggers = style.Triggers;
            /*DependencyObject*/var triggerContainer = (fe != null) ? fe : fce;

            ExecuteOnApplyEnterExitActionsLoop( triggerContainer, triggers, style, null, dataField ); 
    	}

    }

//    // Called from UpdateStyleCache - When an object's Template changes, some of 
//    //  the triggers contain EnterActions and they want to be run immediately
//    //  if the trigger condition evaluates to true. 
//    // Usually these EnterActions are to be run when there's a False->True
//    //  transition.  This code treats "true at time Template is applied" as
//    //  a False->True transition even though it's possible no transition ever
//    //  took place. 
////    private static void 
//    function ExecuteOnApplyEnterExitActions( /*FrameworkElement*/ fe, /*FrameworkContentElement*/ fce,
//        /*FrameworkTemplate*/ ft ) 
//    { 
//        // If the "Template Change" is a template being set to null - exit.
//        if( ft == null ) 
//        {
//            return;
//        }
//        // Note: PropertyTriggersWithActions is a FrugalMap, so its count is checked against zero. 
//        //  DataTriggersWithActions is a HybridDictionary allocated on demand, so it's checked against null.
//        if( ft != null && ft.PropertyTriggersWithActions.Count == 0 && ft.DataTriggersWithActions == null ) 
//        { 
//            // FrameworkTemplate has no trigger actions at all, exit.
//            return; 
//        }
//
//        /*TriggerCollection*/var triggers = ft.TriggersInternal; 
//        /*DependencyObject*/var triggerContainer = (fe != null) ? fe : fce;
//
//        ExecuteOnApplyEnterExitActionsLoop( triggerContainer, triggers, null, ft, TemplateDataField ); 
//    }

    // Called from either the Style-specific ExecuteOnApplyEnterActions or the
    //  Template-specific version.  This section is the common code for both that
    //  walks through the trigger collection and execute applicable actions.
//    private static void 
    function ExecuteOnApplyEnterExitActionsLoop( /*DependencyObject*/ triggerContainer, /*TriggerCollection*/ triggers, 
        /*Style*/ style, /*FrameworkTemplate*/ ft, /*UncommonField<HybridDictionary[]>*/ dataField )
    { 
        /*TriggerBase*/var triggerBase; 
        /*bool*/var triggerState;
        for( var i = 0; i < triggers.Count; i++ ) 
        {
            triggerBase = triggers.Get(i);
            if( (!triggerBase.HasEnterActions) && (!triggerBase.HasExitActions) )
            { 
                ; // Trigger has neither enter nor exit actions.  There's nothing to run anyway, so skip.
            } 
            else if( triggerBase.ExecuteEnterActionsOnApply || 
                triggerBase.ExecuteExitActionsOnApply )
            { 
                // Look for any SourceName in the condition
                if( NoSourceNameInTrigger( triggerBase ) )
                {
                    // Evaluate the current state of the trigger. 
                    triggerState = triggerBase.GetCurrentState( triggerContainer, dataField );

                    if( triggerState && triggerBase.ExecuteEnterActionsOnApply ) 
                    {
                        // Trigger is true, and Trigger wants EnterActions to be executed on Style/Template application. 
                        InvokeActions( triggerBase.EnterActions, triggerBase, triggerContainer,
                            style, ft );
                    }
                    else if( !triggerState && triggerBase.ExecuteExitActionsOnApply ) 
                    {
                        // Trigger is false, and Trigger wants ExitActions to be executed on Style/Template application. 
                        InvokeActions( triggerBase.ExitActions, triggerBase, triggerContainer, 
                            style, ft );
                    } 
                }
                else
                {
                    // If one or more conditions are dependent on a template 
                    //  child, then it can't possibly apply immediately.
                } 
            } 
        }
    } 

    // Used by ExecuteOnApplyEnterExitActionsLoop to determine whether the
    //  particular trigger is dependent on any child nodes, by checking for
    //  a SourceName string in the trigger. 
    // We only check the two property trigger types here, data triggers
    //  do not support being dependent on child nodes. 
//    private static bool 
    function NoSourceNameInTrigger( /*TriggerBase*/ triggerBase ) 
    {
        /*Trigger*/var trigger = triggerBase instanceof Trigger ? triggerBase : null; 
        if( trigger != null )
        {
            if( trigger.SourceName == null )
            { 
                return true;
            } 
            else 
            {
                return false; 
            }
        }
        else
        { 
            /*MultiTrigger*/var multiTrigger = triggerBase instanceof MultiTrigger ? triggerBase : null;
            if( multiTrigger != null ) 
            { 
                for( var i = 0; i < multiTrigger.Conditions.Count; i++ )
                { 
                    if( multiTrigger.Conditions[i].SourceName != null )
                    {
                        return false;
                    } 
                }

                // Ran through all the conditions - not a single SourceName was found. 
                return true;
            } 
        }

        // DataTrigger and MultiDataTrigger doesn't allow SourceName - so it's true that they have no SourceName.
        return true; 
    }

    // Helper method shared between property trigger and data trigger.  After 
    //  the trigger's old and new states are evaluated, look at them and see
    //  if we should invoke the associated EnterActions or ExitActions. 
//    private static void 
    function InvokeEnterOrExitActions( /*TriggerBase*/ triggerBase,
        /*bool*/ oldState, /*bool*/ newState, /*DependencyObject*/ triggerContainer,
        /*Style*/ style, /*FrameworkTemplate*/ frameworkTemplate)
    { 
        /*TriggerActionCollection*/var actions;

        if( !oldState && newState ) 
        {
            // False -> True transition.  Execute EnterActions. 
            actions = triggerBase.EnterActions;
        }
        else if( oldState && !newState )
        { 
            // True -> False transition.  Execute ExitActions.
            actions = triggerBase.ExitActions; 
        } 
        else
        { 
            actions = null;
        }

        InvokeActions( actions, triggerBase, triggerContainer, style, frameworkTemplate ); 
    }

    // Called from InvokeEnterOrExitActions in response to a changed event, or 
    //  from ExecuteOnApplyEnterExitActionsLoop when Style/Template is initially
    //  applied. 
    // At this point we've decided that the given set of trigger action collections
    //  should be run now.  This method checks to see if that's actually possible
    //  and either invokes immediately or saves enough information to invoke later.
//    private static void 
    function InvokeActions( /*TriggerActionCollection*/ actions, 
        /*TriggerBase*/ triggerBase, /*DependencyObject*/ triggerContainer,
        /*Style*/ style, /*FrameworkTemplate*/ frameworkTemplate ) 
    { 
        if( actions != null )
        { 
            // See CanInvokeActionsNow for all the (known) reasons why we might not be able to
            //  invoke immediately.
            if( CanInvokeActionsNow( triggerContainer, frameworkTemplate ) )
            { 
                InvokeActions( triggerBase, triggerContainer, actions,
                    style, frameworkTemplate ); 
            } 
            else
            { 
                DeferActions( triggerBase, triggerContainer, actions,
                    style, frameworkTemplate );
            }
        } 
    }

    // This function holds the knowledge about whether InvokeEnterOrExitActions 
    //  should do an immediate invoke of the applicable actions.

    // We check against HasTemplatedGeneratedSubTree instead of TemplatedChildrenField
    //  because the TemplatedChildrenField is non-null when the child nodes have
    //  been generated - but their EffectiveValues cache haven't necessarily picked
    //  up all their templated values yet.  HasTemplatedGeneratedSubTree is set 
    //  to true only after all the property values have been updated.
//    private static bool 
    function CanInvokeActionsNow( /*DependencyObject*/ container, 
        /*FrameworkTemplate*/ frameworkTemplate) 
    {
        var result; 

        if( frameworkTemplate != null )
        {
            /*FrameworkElement*/var fe = container; 
            if( fe.HasTemplateGeneratedSubTree )
            { 
                /*ContentPresenter*/var cp = container instanceof EnsureContentPresenter() ? container : null; 

                if( cp != null && !cp.TemplateIsCurrent ) 
                {
                    // The containing ContentPresenter does not have an
                    //  up-to-date template.  If we run now we'll run
                    //  against the wrong thing, so we need to hold off. 
                    result = false;
                } 
                else 
                {
                    // The containing element has the template sub tree ready to go. 
                    //  we can launch the action now.
                    result = true;
                }
            } 
            else
            { 
                // The template generated sub tree isn't ready yet.  Hold off. 
                result = false;
            } 
        }
        else
        {
            // Today there is no reason why we can't invoke actions 
            //  immediately if we're not dealing with a template.
            result = true; 
        } 

        return result; 
    }

    // In the event that we can't do an immediate invoke of the collection
    //  of actions, add this to the list of deferred actions that is stored 
    //  on the template object.  Because each template can be applicable to
    //  multiple objects, the storage of deferred actions is keyed by the 
    //  triggerContainer instance. 
//    private static void 
    function DeferActions( /*TriggerBase*/ triggerBase,
        /*DependencyObject*/ triggerContainer, /*TriggerActionCollection*/ actions, 
        /*Style*/ style, /*FrameworkTemplate*/ frameworkTemplate)

    {
        /*ConditionalWeakTable<DependencyObject, List<DeferredAction>>*/var deferredActions; 
        /*DeferredAction*/var deferredAction; // struct
        deferredAction.TriggerBase = triggerBase; 
        deferredAction.TriggerActionCollection = actions; 

        if( frameworkTemplate != null ) 
        {
            deferredActions = frameworkTemplate.DeferredActions;

            if( deferredActions == null ) 
            {
                deferredActions = new ConditionalWeakTable/*<DependencyObject, List<DeferredAction>>*/(); 
                frameworkTemplate.DeferredActions = deferredActions; 
            }
        } 
        else
        {
            // Nothing - deferring actions only happen for FrameworkTemplate
            //  scenarios, so deferred actions is empty. 
            deferredActions = null;
        } 

        if( deferredActions != null )
        { 
            /*List<DeferredAction>*/var actionList;

            var actionListOut = {
            	"actionList" : actionList
            };
            
            var result = deferredActions.TryGetValue(triggerContainer, /*out actionList*/actionListOut);
            actionList = actionListOut.actionList;
            if( !result )
            { 
                actionList = new List/*<DeferredAction>*/();
                deferredActions.Add(/* key */triggerContainer,/* value */actionList); 
            } 

            actionList.Add(deferredAction); 
        }
    }

    // Execute any actions we stored away in the method DeferActions, and 
    //  clear out the store for these actions.
//    internal static void 
    StyleHelper.InvokeDeferredActions = function( /*DependencyObject*/ triggerContainer, 
        /*FrameworkTemplate*/ frameworkTemplate ) 
    {
        // See if we have a list of deferred actions to execute. 
        if (frameworkTemplate != null && frameworkTemplate.DeferredActions != null)
        {
            /*List<DeferredAction>*/var actionList;
            var actionListOut = {
                	"actionList" : actionList
                };
            if (frameworkTemplate.DeferredActions.TryGetValue(triggerContainer, /*out actionList*/actionListOut)) 
            {
            	actionList = actionListOut.actionList;
                // Execute any actions found. 
                for (var i = 0; i < actionList.Count; i++) 
                {
                    InvokeActions(actionList.Get(i).TriggerBase, 
                        triggerContainer, actionList.Get(i).TriggerActionCollection,
                        null, frameworkTemplate);
                }

                // Now that we've run them, remove the list of deferred actions.
                frameworkTemplate.DeferredActions.Remove(triggerContainer); 
            } 
        }
    };

    // Given a list of action collection, invoke all individual TriggerAction
    //  in that collection using the rest of the information given.
//    internal static void 
    StyleHelper.InvokeActions = function( /*TriggerBase*/ triggerBase, 
        /*DependencyObject*/ triggerContainer, /*TriggerActionCollection*/ actions,
        /*Style*/ style, /*FrameworkTemplate*/ frameworkTemplate) 
    { 
        for (var i = 0; i < actions.Count; i++)
        { 
            /*TriggerAction*/var action = actions.Get(i);

            action.Invoke(triggerContainer instanceof EnsureFrameworkElement() ? triggerContainer : null, 
            		triggerContainer instanceof FrameworkContentElement ? triggerContainer : null, 
                style, frameworkTemplate, triggerBase.Layer); 
        }
    }; 

    // Given a single property trigger and associated context information,
    //  evaluate the old and new states of the trigger.
//    private static void 
    function EvaluateOldNewStates( /*Trigger*/ trigger, 
        /*DependencyObject*/ triggerContainer, /*DependencyProperty*/ changedProperty, /*DependencyPropertyChangedEventArgs*/ changedArgs,
        /*int*/ sourceChildIndex, /*Style*/ style, /*FrameworkTemplate*/ frameworkTemplate, 
        /*out bool oldState*/oldStateOut, /*out bool newState*/newStateOut ) 
    {

        var triggerChildId = 0; 

        if( trigger.SourceName != null ) 
        { 
            triggerChildId = QueryChildIndexFromChildName(trigger.SourceName, frameworkTemplate.ChildIndexFromChildName);
        }

        if( triggerChildId == sourceChildIndex ) 
        {
            /*TriggerCondition[]*/var conditions = trigger.TriggerConditions; 

            oldStateOut.oldState = conditions[0].Match(changedArgs.OldValue);
            newStateOut.newState = conditions[0].Match(changedArgs.NewValue);
        }
        else 
        {
            // Property change did not occur on an object we care about - 
            //  skip evaluation of property values.  The state values here 
            //  are bogus.  This is OK today since we just care about transition
            //  states but if later on it actually matters what the values are 
            //  then we need to evaluate state on the actual triggerChildId.
            // (The old/new values would be the same, naturally.)
        	oldStateOut.oldState = false;
            newStateOut.newState = false; 
        }

        return; 
    }

    // Given a single data trigger and associated context information,
    //  evaluate the old and new states of the trigger.
//    private static void 
    function EvaluateOldNewStates( /*DataTrigger*/ dataTrigger,
        /*DependencyObject*/ triggerContainer, 
        /*BindingBase*/ binding, /*BindingValueChangedEventArgs*/ bindingChangedArgs, /*UncommonField<HybridDictionary[]>*/ dataField,
        /*Style*/ style, /*FrameworkTemplate*/ frameworkTemplate, 
        /*out bool oldState*/oldStateOut, /*out bool newState*/newStateOut ) 
    {
        /*TriggerCondition[]*/var conditions = dataTrigger.TriggerConditions; 

        oldStateOut.oldState = conditions[0].ConvertAndMatch(bindingChangedArgs.OldValue); 
        newStateOut.newState = conditions[0].ConvertAndMatch(bindingChangedArgs.NewValue);
    } 

    // Given a multi property trigger and associated context information,
    //  evaluate the old and new states of the trigger. 

    // Note that we can only have a transition only if every property other
    //  than the changed property is true.  If any of the other properties
    //  are false, then the state is false and we can't have a false->true 
    //  transition.
    // Hence this evaluation short-circuits if any property evaluation 
    //  (other than the one being compared) turns out false. 
//    private static void 
    function EvaluateOldNewStates( /*MultiTrigger*/ multiTrigger,
        /*DependencyObject*/ triggerContainer, /*DependencyProperty*/ changedProperty, /*DependencyPropertyChangedEventArgs*/ changedArgs, 
        /*int*/ sourceChildIndex, /*Style*/ style, /*FrameworkTemplate*/ frameworkTemplate,
        /*out bool oldState*/oldStateOut, /*out bool newState*/newStateOut )
    {
        var triggerChildId = 0; 
        /*DependencyObject*/var evaluationNode = null;
        /*TriggerCondition[]*/var conditions = multiTrigger.TriggerConditions; 

        // Set up the default condition: A trigger with no conditions will never evaluate to true.
        oldStateOut.oldState = false; 
        newStateOut.newState = false;

        for( var i = 0; i < conditions.length; i++ )
        { 
            if( conditions[i].SourceChildIndex != 0 )
            { 
                triggerChildId = conditions[i].SourceChildIndex; 
                evaluationNode = StyleHelper.GetChild(triggerContainer, triggerChildId);
            }
            else
            { 
                triggerChildId = 0;
                evaluationNode = triggerContainer; 
            } 


            if( conditions[i].Property == changedProperty && triggerChildId == sourceChildIndex )
            { 
                // This is the property that changed, and on the object we
                //  care about.  Evaluate states.- see if the condition 
            	oldStateOut.oldState = conditions[i].Match(changedArgs.OldValue); 
                newStateOut.newState = conditions[i].Match(changedArgs.NewValue);

                if( oldStateOut.oldState == newStateOut.newState )
                {
                    // There couldn't possibly be a transition here, abort.  The
                    //  returned values here aren't necessarily the state of the 
                    //  triggers, but we only care about a transition today.  If
                    //  we care about actual values, we'll need to continue evaluation. 
                    return; 
                }
            } 
            else
            {
                /*object*/var evaluationValue = evaluationNode.GetValue( conditions[i].Property );
                if( !conditions[i].Match(evaluationValue) ) 
                {
                    // A condition other than the one changed has evaluated to false. 
                    // There couldn't possibly be a transition here, short-circuit and abort. 
                	oldStateOut.oldState = false;
                    newStateOut.newState = false; 
                    return;
                }
            }
        } 

        // We should only get this far only if every property change causes 
        //  a true->false (or vice versa) transition in one of the conditions, 
        // AND that every other condition evaluated to true.
        return; 
    }

    // Given a multi data trigger and associated context information,
    //  evaluate the old and new states of the trigger. 

    // The short-circuit logic of multi property trigger applies here too. 
    //  we bail if any of the "other" conditions evaluate to false. 
//    private static void 
    function EvaluateOldNewStates( /*MultiDataTrigger*/ multiDataTrigger,
        /*DependencyObject*/ triggerContainer, 
        /*BindingBase*/ binding, /*BindingValueChangedEventArgs*/ changedArgs, /*UncommonField<HybridDictionary[]>*/ dataField,
        /*Style*/ style, /*FrameworkTemplate*/ frameworkTemplate,
        /*out bool oldState*/oldStateOut, /*out bool newState*/newStateOut )
    { 
        /*BindingBase*/var evaluationBinding = null;
        /*object*/var  evaluationValue = null; 
        /*TriggerCondition[]*/var conditions = multiDataTrigger.TriggerConditions; 

        // Set up the default condition: A trigger with no conditions will never evaluate to true. 
        oldStateOut.oldState = false;
        newStateOut.newState = false;

        for( var i = 0; i < multiDataTrigger.Conditions.Count; i++ ) 
        {
            evaluationBinding = conditions[i].Binding; 


            if( evaluationBinding == binding )
            {
                // The binding that changed belonged to the current condition. 
            	oldStateOut.oldState = conditions[i].ConvertAndMatch(changedArgs.OldValue);
                newStateOut.newState = conditions[i].ConvertAndMatch(changedArgs.NewValue); 

                if( oldStateOut.oldState == newStateOut.newState )
                { 
                    // There couldn't possibly be a transition here, abort.  The
                    //  returned values here aren't necessarily the state of the
                    //  triggers, but we only care about a transition today.  If
                    //  we care about actual values, we'll need to continue evaluation. 
                    return;
                } 
            } 
            else
            { 
                evaluationValue = StyleHelper.GetDataTriggerValue(dataField, triggerContainer, evaluationBinding);
                if( !conditions[i].ConvertAndMatch(evaluationValue) )
                {
                    // A condition other than the one changed has evaluated to false. 
                    // There couldn't possibly be a transition here, short-circuit and abort.
                	oldStateOut.oldState = false; 
                    newStateOut.newState = false; 
                    return;
                } 
            }
        }

        // We should only get this far only if the binding change causes 
        //  a true->false (or vice versa) transition in one of the conditions,
        // AND that every other condition evaluated to true. 
        return; 
    }


    // Called during Style/Template Seal when encountering a property trigger that
    //  has associated TriggerActions.
//    internal static void 
    StyleHelper.AddPropertyTriggerWithAction = function(/*TriggerBase*/ triggerBase, 
        /*DependencyProperty*/ property, /*ref FrugalMap*/ triggersWithActions)
    { 
        /*object*/var existing = triggersWithActions.Get(property.GlobalIndex); 

        if( existing == Type.UnsetValue ) 
        {
            // No existing trigger, we put given trigger as entry.
            triggersWithActions.Set(property.GlobalIndex, triggerBase);
        } 
        else
        { 
            /*TriggerBase*/var existingTriggerBase = existing instanceof TriggerBase ? existing : null; 
            if( existingTriggerBase != null )
            { 
                /*List<TriggerBase>*/var newList = new List/*<TriggerBase>*/();

                newList.Add(existingTriggerBase);
                newList.Add(triggerBase); 

                triggersWithActions.Set(property.GlobalIndex, newList); 
            } 
            else
            { 

                /*List<TriggerBase>*/var existingList = existing; 

                existingList.Add(triggerBase); 
            } 
        }

        // Note the order in which we processed this trigger.
        triggerBase.EstablishLayer();
    }

    // Called during Style/Template Seal when encountering a data trigger that
    //  has associated TriggerActions. 
//    internal static void 
    StyleHelper.AddDataTriggerWithAction = function(/*TriggerBase*/ triggerBase, 
        /*BindingBase*/ binding, /*ref HybridDictionary*/ dataTriggersWithActions )
    { 
        if( dataTriggersWithActions == null )
        {
            dataTriggersWithActions = new HybridDictionary();
        } 

        /*object*/var existing = dataTriggersWithActions.Get(binding); 

        if( existing == null )
        { 
            // No existing trigger, we put given trigger as entry.
            dataTriggersWithActions.Set(binding, triggerBase);
        }
        else 
        {
            /*TriggerBase*/var existingTriggerBase = existing instanceof TriggerBase ? existing : null; 
            if( existingTriggerBase != null ) 
            {
                // Up-convert to list and replace. 

                /*List<TriggerBase>*/var newList = new List();

                newList.Add(existingTriggerBase); 
                newList.Add(triggerBase);

                dataTriggersWithActions.Set(binding, newList); 
            }
            else 
            {

                /*List<TriggerBase>*/var existingList = existing;

                existingList.Add(triggerBase); 
            }
        } 

        // Note the order in which we processed this trigger.
        triggerBase.EstablishLayer();
    } 

    // 
    //  This method 
    //  1. Is Invoked when a binding in a condition of a data trigger changes its value.
    //  2. When this happens we must invalidate all its dependents 
    //
//    private static void 
    function OnBindingValueInStyleChanged(/*object*/ sender, /*BindingValueChangedEventArgs*/  e)
    {
        /*BindingExpressionBase*/var bindingExpr = sender; 
        /*BindingBase*/var binding = bindingExpr.ParentBindingBase;
        /*DependencyObject*/var container = bindingExpr.TargetElement; 

        var feOut = {"fe" : null};
        
        var fceOut = {"fce" : null};
        
        Helper.DowncastToFEorFCE(container, /*out fe*/feOut, /*out fce*/fceOut, false);
        /*FrameworkElement*/var fe = feOut.fe;;
        /*FrameworkContentElement*/var fce = fceOut.fce; 
        /*Style*/var style = (fe != null) ? fe.Style : fce.Style;

        // Look for data trigger Setter information - invalidate the associated 
        //  properties if found.
        /*HybridDictionary*/var dataTriggerRecordFromBinding = style._dataTriggerRecordFromBinding; 
        if( dataTriggerRecordFromBinding != null && 
            !bindingExpr.IsAttaching ) // Don't invalidate in the middle of attaching - effective value will be updated elsewhere in Style application code.
        { 
            /*DataTriggerRecord*/var record = dataTriggerRecordFromBinding.Get(binding);
            if (record != null)         // triggers with no setters (only actions) don't appear in the table
            {
                InvalidateDependents(style, null, container, null, /*ref*/ record.Dependents, false); 
            }
        } 

        // Look for any applicable trigger EnterAction or ExitAction
        InvokeApplicableDataTriggerActions(style, null, container, binding, e, StyleHelper.StyleDataField); 
    }

    //
    //  This method 
    //  1. Is Invoked when a binding in a condition of a data trigger changes its value.
    //  2. When this happens we must invalidate all its dependents 
    // 
//    private static void 
    function OnBindingValueInTemplateChanged(/*object*/ sender, /*BindingValueChangedEventArgs*/  e)
    { 
        /*BindingExpressionBase*/var bindingExpr = sender;
        /*BindingBase*/var binding = bindingExpr.ParentBindingBase;
        /*DependencyObject*/var container = bindingExpr.TargetElement;

        
        var feOut = {
            	"fe" : null
            };
            
        var fceOut = {
            	"fce" : null
            };
        Helper.DowncastToFEorFCE(container, /*out fe*/feOut, /*out fce*/fceOut, false);
        /*FrameworkElement*/var fe = feOut.fe;
        /*FrameworkContentElement*/var fce = fceOut.fce;

        /*FrameworkTemplate*/var ft = fe.TemplateInternal; 

        // Look for data trigger Setter information - invalidate the associated
        //  properties if found.
        /*HybridDictionary*/var dataTriggerRecordFromBinding = null; 
        if (ft != null)
        { 
            dataTriggerRecordFromBinding = ft._dataTriggerRecordFromBinding; 
        }

        if( dataTriggerRecordFromBinding != null &&
            !bindingExpr.IsAttaching ) // Don't invalidate in the middle of attaching - effective value will be updated elsewhere in Template application code.
        {
            /*DataTriggerRecord*/var record = dataTriggerRecordFromBinding.Get(binding); 
            if (record != null)         // triggers with no setters (only actions) don't appear in the table
            { 
                InvalidateDependents(null, ft, container, null, /*ref*/ record.Dependents, false); 
            }
        } 

        // Look for any applicable trigger EnterAction or ExitAction
        InvokeApplicableDataTriggerActions(null, ft, container, binding, e, StyleHelper.TemplateDataField);
    } 

    // 
    //  This method 
    //  1. Is Invoked when a binding in a condition of a data trigger changes its value.
    //  2. When this happens we must invalidate all its dependents 
    //
//    private static void 
    function OnBindingValueInThemeStyleChanged(/*object*/ sender, /*BindingValueChangedEventArgs*/ e)
    {
        /*BindingExpressionBase*/var bindingExpr = sender; 
        /*BindingBase*/var binding = bindingExpr.ParentBindingBase;
        /*DependencyObject*/var container = bindingExpr.TargetElement; 

        /*FrameworkElement*/var fe;
        /*FrameworkContentElement*/var fce; 
        
        var feOut = {
            	"fe" : fe
            };
            
        var fceOut = {
            	"fce" : fce
            };
        Helper.DowncastToFEorFCE(container, /*out fe*/feOut, /*out fce*/fceOut, false);
        fe = feOut.fe;
        fce = fceOut.fce;
        
        /*Style*/var style = (fe != null) ? fe.ThemeStyle : fce.ThemeStyle;

        // Look for data trigger Setter information - invalidate the associated 
        //  properties if found.
        /*HybridDictionary*/var dataTriggerRecordFromBinding = style._dataTriggerRecordFromBinding; 

        if( dataTriggerRecordFromBinding != null &&
            !bindingExpr.IsAttaching ) // Don't invalidate in the middle of attaching - effective value will be updated elsewhere in Style application code. 
        {
            /*DataTriggerRecord*/var record = dataTriggerRecordFromBinding.Get(binding);
            if (record != null)         // triggers with no setters (only actions) don't appear in the table
            { 
                InvalidateDependents(style, null, container, null, /*ref*/ record.Dependents, false);
            } 
        } 

        // Look for any applicable trigger EnterAction or ExitAction 
        InvokeApplicableDataTriggerActions(style, null, container, binding, e, StyleHelper.ThemeStyleDataField);
    }

    // Given a Style/Template and a Binding whose value has changed, look for 
    //  any data triggers that have trigger actions (EnterAction/ExitAction)
    //  and see if any of those actions need to run as a response to this change. 
//    private static void 
    function InvokeApplicableDataTriggerActions( 
        /*Style*/                               style,
        /*FrameworkTemplate*/                   frameworkTemplate, 
        /*DependencyObject*/                    container,
        /*BindingBase*/                         binding,
        /*BindingValueChangedEventArgs*/        e,
        /*UncommonField<HybridDictionary[]>*/   dataField) 
    {
        /*HybridDictionary*/var dataTriggersWithActions; 

        if( style != null )
        { 
            dataTriggersWithActions = style.DataTriggersWithActions;
        }
        else if( frameworkTemplate != null )
        { 
            dataTriggersWithActions = frameworkTemplate.DataTriggersWithActions;
        } 
        else 
        {
            dataTriggersWithActions = null; 
        }

        if( dataTriggersWithActions != null )
        { 
            /*object*/var candidateTrigger = dataTriggersWithActions.Get(binding);

            if( candidateTrigger != null ) 
            {
                // One or more trigger objects need to be evaluated.  The candidateTrigger 
                //  object may be a single trigger or a collection of them.
                /*TriggerBase*/var triggerBase = candidateTrigger instanceof TriggerBase ? candidateTrigger : null;
                if( triggerBase != null )
                { 
                    InvokeDataTriggerActions( triggerBase, container, binding, e,
                        style, frameworkTemplate, dataField); 
                } 
                else
                { 
                    /*List<TriggerBase>*/var triggerList = candidateTrigger;

                    for( var i = 0; i < triggerList.Count; i++ ) 
                    {
                        InvokeDataTriggerActions( triggerList.Get(i), container, binding, e, 
                            style, frameworkTemplate, dataField);
                    }
                }
            } 
        }
    } 

    //  ===========================================================================
    //  These methods read some of per-instane Style/Template data
    //  ============================================================================

    // 
    //  This method
    //  1. Creates the ChildIndex for the given ChildName. If there is an 
    //     existing childIndex it throws an exception for a duplicate name
    //
//    internal static int 
    StyleHelper.CreateChildIndexFromChildName = function(
        /*string*/              childName, 
        /*FrameworkTemplate*/   frameworkTemplate)
    { 
        /*HybridDictionary*/
    	var childIndexFromChildName;

        childIndexFromChildName = frameworkTemplate.ChildIndexFromChildName; 

        if (childIndexFromChildName.Contains(childName))
        {
            throw new ArgumentException(SR.Get(SRID.NameScopeDuplicateNamesNotAllowed, childName));
        } 

        var value = frameworkTemplate.LastChildIndex;
        childIndexFromChildName.Set(childName, value); 

        // Normal templated child check 
        // If we're about to give out an index that we can't support, throw. 
        if (value >= 0xFFFF)
        { 
            throw new InvalidOperationException(SR.Get(SRID.StyleHasTooManyElements));
        }
        
        frameworkTemplate.LastChildIndex ++; // = lastChildIndex;

        return value;
    };

    //
    //  This method 
    //  1. Returns the ChildIndex for the given ChildName. If there isn't an
    //     existing childIndex it return -1
    //
//    internal static int 
    StyleHelper.QueryChildIndexFromChildName = function( 
        /*string*/           childName,
        /*HybridDictionary*/ childIndexFromChildName) 
    { 
        // "Self" check
        if (childName == StyleHelper.SelfName) 
        {
            return 0;
        }

        // Normal templated child check
        /*object*/var value = childIndexFromChildName.Get(childName); 
        if (value == null) 
        {
            return -1; 
        }

        return value;
    };

    //+----------------------------------------------------------------------------------- 
    // 
    //  FindNameInTemplateContent
    // 
    //  Find the object in the template content with the specified name.  This looks
    //  both for children both that are optimized FE/FCE tyes, or any other type.
    //
    //+------------------------------------------------------------------------------------ 

//    internal static Object 
    StyleHelper.FindNameInTemplateContent = function( 
        /*DependencyObject*/    container, 
        /*string*/              childName,
        /*FrameworkTemplate*/   frameworkTemplate) 
    {
//        Debug.Assert(frameworkTemplate != null );

        // First, look in the list of optimized FE/FCEs in this template for this name. 

        var index; 
//        Debug.Assert(frameworkTemplate != null); 
        index = StyleHelper.QueryChildIndexFromChildName(childName, frameworkTemplate.ChildIndexFromChildName);

        // Did we find it?
        if (index == -1)
        {
            // No, we didn't find it, look at the rest of the named elements in the template content. 

            /*Hashtable*/var hashtable = StyleHelper.TemplatedNonFeChildrenField.GetValue(container); 
            if( hashtable != null ) 
            {
                return hashtable.Get(childName); 
            }

            return null;
        } 
        else
        { 
            // Yes, we found the FE/FCE, return it. 

            return StyleHelper.GetChild(container, index); 
        }
    };

    // 
    //  This method
    //  1. Finds the child corresponding to the given childIndex 
    // 
//    internal static DependencyObject 
//    StyleHelper.GetChild = function(/*DependencyObject*/ container, /*int*/ childIndex)
//    { 
//        return GetChild(StyleHelper.TemplatedFeChildrenField.GetValue(container), childIndex);
//    };

    // 
    //  This method
    //  1. Finds the child corresponding to the given childIndex 
    // 
//    internal static DependencyObject 
    StyleHelper.GetChild = function(/*List<DependencyObject> or DependencyObject*/ styledChildren, /*int*/ childIndex)
    { 
    	if(!(styledChildren instanceof List)){
    		styledChildren = StyleHelper.TemplatedFeChildrenField.GetValue(styledChildren); 
    	}
    	
        // Notice that if we are requesting a childIndex that hasn't been
        // instantiated yet we return null. This could happen when we are
        // invalidating the dependents for a property on a TemplateNode and
        // the dependent properties are meant to be on template nodes that 
        // haven't been instantiated yet.
        if (styledChildren == null || childIndex > styledChildren.Count) 
        { 
            return null;
        } 

        if (childIndex < 0)
        {
            throw new ArgumentOutOfRangeException("childIndex"); 
        }

        /*DependencyObject*/var child = styledChildren.Get(childIndex - 1); 

//        Debug.Assert( 
//            child is FrameworkElement && ((FrameworkElement)child).TemplateChildIndex == childIndex ||
//            child is FrameworkContentElement && ((FrameworkContentElement)child).TemplateChildIndex == childIndex);

        return child; 
    };

    //  ============================================================================ 
    //  These methods are used to manipulate alternative expression storage
    //  ===========================================================================

    // 
    //  This method 
    //  1. Registers for the "alternative Expression storage" feature, since
    //     we store Expressions in per-instance StyleData. 
    //
//    internal static void 
    StyleHelper.RegisterAlternateExpressionStorage = function()
    {
    	var _getExpressionOut={
    		"getExpression" : _getExpression
    	};
    	
        DependencyObject.RegisterForAlternativeExpressionStorage( 
                            new AlternativeExpressionStorageCallback(null, GetExpressionCore),
                            /*out _getExpression*/_getExpressionOut); 
        _getExpression = _getExpressionOut.getExpression;
    }; 

//    private static Expression 
    function GetExpressionCore( 
        /*DependencyObject*/ d,
        /*DependencyProperty*/ dp,
        /*PropertyMetadata*/ metadata)
    { 
    	
        /*FrameworkElement*/var fe;
        /*FrameworkContentElement*/var fce;
        var feOut = {
            	"fe" : fe
            };
            
        var fceOut = {
            	"fce" : fce
            };
        Helper.DowncastToFEorFCE(d, /*out fe*/feOut, /*out fce*/fceOut, false);
        fe = feOut.fe;
        fce = fceOut.fce;


        if (fe != null) 
        {
            return fe.GetExpressionCore(dp, metadata);
        }

        if (fce != null)
        { 
            return fce.GetExpressionCore(dp, metadata); 
        }

        return null;
    }

    // 
    //  This method
    //  1. Is a wrapper for property engine's GetExpression method 
    // 
//    internal static Expression 
    StyleHelper.GetExpression = function(
        /*DependencyObject*/ d, 
        /*DependencyProperty*/ dp)
    {
        /*FrameworkElement*/var fe;
        /*FrameworkContentElement*/var fce;
        var feOut = {
            	"fe" : fe
            };
            
        var fceOut = {
            	"fce" : fce
            };
        Helper.DowncastToFEorFCE(d, /*out fe*/feOut, /*out fce*/fceOut, false);
        fe = feOut.fe;
        fce = fceOut.fce;

        // temporarily mark the element as "initialized", so that we always get 
        // the desired expression (see GetInstanceValue).
        /*bool*/var isInitialized = (fe != null) ? fe.IsInitialized : (fce != null) ? fce.IsInitialized : true; 
        if (!isInitialized)
        {
            if (fe != null)
                fe.WriteInternalFlag(InternalFlags.IsInitialized, true); 
            else if (fce != null)
                fce.WriteInternalFlag(InternalFlags.IsInitialized, true); 
        } 

        // get the desired expression 
        /*Expression*/var result = _getExpression.Call(d, dp, dp.GetMetadata(d.DependencyObjectType));

        // restore the initialized flag
        if (!isInitialized) 
        {
            if (fe != null) 
                fe.WriteInternalFlag(InternalFlags.IsInitialized, false); 
            else if (fce != null)
                fce.WriteInternalFlag(InternalFlags.IsInitialized, false); 
        }

        return result;
    };


    //  ============================================================================
    //  These methods are used to query Style/Template 
    //  eventhandlers during event routing
    //  ===========================================================================

    // 
    //  This method 
    //  Gets the handlers of a template child
    //  (Index is '0' when the styled container is asking) 
    //
//    internal static RoutedEventHandlerInfo[] 
    StyleHelper.GetChildRoutedEventHandlers = function(
        /*int*/                                     childIndex,
        /*RoutedEvent*/                           routedEvent, 
        /*ref ItemStructList<ChildEventDependent>*/ eventDependents)
    { 
//        Debug.Assert(routedEvent != null); 

        if (childIndex > 0) 
        {
            // Find the EventHandlersStore that matches the given childIndex
            /*EventHandlersStore*/var eventHandlersStore = null;
            for (var i=0; i<eventDependents.Count; i++) 
            {
                if (eventDependents.List[i].ChildIndex == childIndex) 
                { 
                    eventHandlersStore = eventDependents.List[i].EventHandlersStore;
                    break; 
                }
            }

            if (eventHandlersStore != null) 
            {
                return eventHandlersStore.GetRoutedEventHandlers(routedEvent); 
            } 
        }

        return null;
    };

    //  ===========================================================================
    //  These are some Style/Template helper methods 
    //  ===========================================================================

    //
    //  This method 
    //  1. Says if styling this property involve styling the logical tree 
    //
//    internal static bool 
    StyleHelper.IsStylingLogicalTree= function(/*DependencyProperty*/ dp, /*object*/ value) 
    {
        // some properties are known not to affect the logical tree
        if (dp == ItemsControl.ItemsPanelProperty || dp == EnsureFrameworkElement().ContextMenuProperty 
        		|| dp == EnsureFrameworkElement().ToolTipProperty)
            return false; 

        return (value instanceof Visual) || (value instanceof ContentElement); 
    };
	
	StyleHelper.Type = new Type("StyleHelper", StyleHelper, [Object.Type]);
	return StyleHelper;
});


