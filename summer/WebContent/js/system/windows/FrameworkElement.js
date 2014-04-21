/**
 * FrameworkElement
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyObjectType", "windows/UIElement" , "media/Visual" ,
        "windows/DependencyProperty", "windows/Style", "windows/FrameworkPropertyMetadata",
        "windows/FrameworkPropertyMetadataOptions", "windows/PropertyChangedCallback",
        "windows/Application", "windows/EventHandlersStore", /*"controls/Control",*/ "windows/InternalFlags", 
        "windows/InternalFlags2", "windows/EventTrigger",
        "system/EventArgs", "windows/BaseValueSourceInternal", "windows/StyleHelper", "internal/FrameworkObject",
        "animation/Storyboard"/*, "controls/ContextMenuService"*/, "controls/ToolTipService", "controls/PopupControlService", 
        "windows/EventPrivateKey", "windows/BroadcastEventHelper", "windows/TreeWalkHelper", "windows/ContentElement",
        "windows/InheritanceBehavior", "media/VisualTreeHelper", "markup/NameValidationHelper", "controls/ContextMenuService",
        "windows/IInputElement", "windows/IFrameworkInputElement",
        "componentmodel/ISupportInitialize", "windows/ResourceDictionary",
        "windows/DataTemplateKey", "controls/ItemContainerTemplateKey", "controls/ItemContainerTemplate",
        "internal/InheritedPropertyChangedEventArgs", "windows/HorizontalAlignment", "windows/VerticalAlignment"], 
		function(declare, Type, DependencyObjectType, UIElement, Visual,
				DependencyProperty, Style, FrameworkPropertyMetadata,
				FrameworkPropertyMetadataOptions, PropertyChangedCallback,
				Application, EventHandlersStore, /*Control, */InternalFlags, 
				InternalFlags2, EventTrigger,
				EventArgs, BaseValueSourceInternal, StyleHelper, FrameworkObject,
				Storyboard/*, ContextMenuService*/, ToolTipService, PopupControlService, 
				EventPrivateKey, BroadcastEventHelper, TreeWalkHelper, ContentElement,
				InheritanceBehavior, VisualTreeHelper, NameValidationHelper, ContextMenuService, 
				IInputElement, IFrameworkInputElement, 
				ISupportInitialize, ResourceDictionary,
				DataTemplateKey, ItemContainerTemplateKey, ItemContainerTemplate,
				InheritedPropertyChangedEventArgs, HorizontalAlignment, VerticalAlignment){
	
	var KeyboardNavigation = null;
	function EnsureKeyboardNavigation(){
		if(KeyboardNavigation == null){
			KeyboardNavigation = using("input/KeyboardNavigation");
		}
		
		return KeyboardNavigation;
	}
    
    
    // This is part of an optimization to avoid accessing thread local storage
    // and thread apartment state multiple times. 
    var FrameworkServices = declare("FrameworkServices", null,{
    	constructor:function(){
    		this.__keyboardNavigation = new (EnsureKeyboardNavigation())(); 
    		this.__popupControlService = new PopupControlService(); 
    	}
	});
    
    Object.defineProperties(FrameworkServices.prototype, {
//        internal KeyboardNavigation 
        _keyboardNavigation:{
        	get:function(){
            	return this.__keyboardNavigation;
        	}
        },
//        internal PopupControlService 
        _popupControlService:{
        	get:function(){
            	return this.__popupControlService;
        	}
        }
    });
    
//    private class FrameworkServices
//    {
//        internal FrameworkServices()
//        { 
//            // STA Requirement are checked in InputManager cctor where InputManager.Current is used in KeyboardNavigation cctor
//            _keyboardNavigation = new KeyboardNavigation(); 
//            _popupControlService = new PopupControlService(); 
//        }
//
//        internal KeyboardNavigation _keyboardNavigation;
//        internal PopupControlService _popupControlService;
//    }
    
    var Control = null;
    function EnsureControl(){
    	if(Control == null){
    		Control = using("controls/Control");
    	}
    	return Control;
    }
    
	var FrameworkElement = declare("FrameworkElement", [UIElement, IFrameworkInputElement, IInputElement, ISupportInitialize/*, IQueryAmbient*/], {
		constructor:function( ){
            // Initialize the _styleCache to the default value for StyleProperty.
            // If the default value is non-null then wire it to the current instance. 
            /*PropertyMetadata*/
			var metadata = FrameworkElement.StyleProperty.GetMetadata(FrameworkElement.DType/*this.DependencyObjectType*/);
            /*Style*/
			var defaultValue = /*(Style)*/ metadata.DefaultValue; 
            if (defaultValue != null) 
            {
                this.OnStyleChanged(this, /*new DependencyPropertyChangedEventArgs(FrameworkElement.StyleProperty, metadata, null, defaultValue)*/
                		DependencyPropertyChangedEventArgs.BuildPMOO(FrameworkElement.StyleProperty, metadata, null, defaultValue)); 
            }

 
            // Set the ShouldLookupImplicitStyles flag to true if App.Resources has implicit styles.
            /*Application*/var app = Application.Current; 
            if (app != null && app.HasImplicitStylesInResources)
            {
                this.ShouldLookupImplicitStyles = true;
            } 

            EnsureFrameworkServices(); 
            

            this._themeStyleCache = null;
            this._styleCache = null;
   
            this._templatedParent = null;    // Non-null if this object was created as a result of a Template.VisualTree
            this._templateChild = null;                // Non-null if this FE has a child that was created as part of a template. 

            this._flags3     = 0; // Stores Flags (see Flags enum)
//            this._flags2    = InternalFlags2.Default; // Stores Flags (see Flags enum)
            this._flags4    = InternalFlags2.Default; // Stores Flags (see Flags enum)
            
            this._parent1 = null;
		},
		
		SetUpStyle:function(){
        	UIElement.prototype.SetUpStyle.call(this);
        	
        	var width = this.Width;
        	if(width != null){
        		this._dom.style.setProperty("width", width, "");
        	}
        	
           	var height = this.Height;
        	if(height != null){
        		this._dom.style.setProperty("height", height, "");
        	}
        	
           	var cursor = this.Cursor;
        	if(cursor != null){
        		this._dom.style.setProperty("cursor", cursor, "");
        	}
        	
        },

		/// <summary>
        /// Registers the name - element combination from the
        /// NameScope that the current element belongs to.
        /// </summary> 
        /// <param name="name">Name of the element</param>
        /// <param name="scopedElement">Element where name is defined</param> 
//        public void 
        RegisterName:function(/*string*/ name, /*object*/ scopedElement) 
        {
            /*INameScope*/var nameScope = FrameworkElement.FindScope(this); 
            if (nameScope != null)
            {
                nameScope.RegisterName(name, scopedElement);
            } 
            else
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.NameScopeNotFound, name, "register")'); 
            }
        }, 

        /// <summary>
        /// Unregisters the name - element combination from the
        /// NameScope that the current element belongs to. 
        /// </summary>
        /// <param name="name">Name of the element</param> 
//        public void 
        UnregisterName:function(/*string*/ name) 
        {
            /*INameScope*/var nameScope = FrameworkElement.FindScope(this); 
            if (nameScope != null)
            {
                nameScope.UnregisterName(name);
            } 
            else
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.NameScopeNotFound, name, "unregister")'); 
            }
        } ,

//        /// <summary>
//        /// Find the object with given name in the
//        /// NameScope that the current element belongs to. 
//        /// </summary>
//        /// <param name="name">string name to index</param> 
//        /// <returns>context if found, else null</returns> 
////        public object 
//        FindName:function(/*string*/ name)
//        { 
//            return FindName(name, {"scopeOwner" : null}/*out scopeOwner*/);
//        },
 
        // internal version of FindName that returns the scope owner
//        internal object 
        FindName:function(/*string*/ name, scopeOwnerOut/*out DependencyObject scopeOwner*/) 
        { 
        	if(scopeOwnerOut === undefined){
        		scopeOwner = {"scopeOwner" : null};
        	}
            /*INameScope*/var nameScope = FrameworkElement.FindScope(this, scopeOwnerOut/*out scopeOwner*/);
            if (nameScope != null) 
            {
                return nameScope.FindName(name);
            }
 
            return null;
        }, 
 
        /// <summary>
        /// Elements that arent connected to the tree do not receive theme change notifications. 
        /// We leave it upto the app author to listen for such changes and invoke this method on
        /// elements that they know that arent connected to the tree. This method will update the
        /// DefaultStyle for the subtree starting at the current instance.
        /// </summary> 
//        public void 
        UpdateDefaultStyle:function()
        { 
            TreeWalkHelper.InvalidateOnResourcesChange(/* fe = */ this, /* fce = */ null, ResourcesChangeInfo.ThemeChangeInfo); 
        },

        /// <summary>
        ///     Tries to find a Resource for the given resourceKey in the current 
        ///     element's ResourceDictionary.
        /// </summary> 
//        internal object 
        FindResourceOnSelf:function(/*object*/ resourceKey, /*bool*/ allowDeferredResourceReference, /*bool*/ mustReturnDeferredResourceReference) 
        {
            /*ResourceDictionary*/
        	var resources = FrameworkElement.ResourcesField.GetValue(this); 
            if ((resources != null) && resources.Contains(resourceKey))
            {
                return resources.FetchResource(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference, {"canCache" : null}/*out canCache*/); 
            }
 
            return DependencyProperty.UnsetValue; 
        },
 
//        internal DependencyObject 
        ContextVerifiedGetParent:function()
        {
            return this._parent1;
        },

//        protected internal void 
        AddLogicalChild:function(/*object*/ child)
        { 
            if (child != null)
            { 
                // It is invalid to modify the children collection that we 
                // might be iterating during a property invalidation tree walk.
                if (this.IsLogicalChildrenIterationInProgress) 
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotModifyLogicalChildrenDuringTreeWalk)');
                }
 
                // Now that the child is going to be added, the FE/FCE construction is considered finished,
                // so we do not expect a change of InheritanceBehavior property, 
                // so we can pick up properties from styles and resources. 
                this.TryFireInitialized();
 
                this.HasLogicalChildren = true; 

                // Child is present; reparent him to this element 
                /*FrameworkObject*/
//                var fo = new FrameworkObject(child instanceof DependencyObject ? child : null); 
//                fo.ChangeLogicalParent(this);
                if(child.ChangeLogicalParent !== undefined){
                	child.ChangeLogicalParent(this); 
                }
                

                exceptionThrown = false; 
            }
        }, 

//        protected internal void 
        RemoveLogicalChild:function(/*object*/ child) 
        { 
            if (child != null)
            { 
                // It is invalid to modify the children collection that we
                // might be iterating during a property invalidation tree walk.
                if (this.IsLogicalChildrenIterationInProgress)
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotModifyLogicalChildrenDuringTreeWalk)');
                } 
 
                // Child is present
                /*FrameworkObject*/
                var fo = new FrameworkObject(child instanceof DependencyObject ? child : null); 
                if (fo.Parent == this)
                {
                    fo.ChangeLogicalParent(null);
                } 

                // This could have been the last child, so check if we have any more children 
                /*IEnumerator*/
                var children = this.LogicalChildren; 

                // if null, there are no children. 
                if (children == null)
                {
                    this.HasLogicalChildren = false;
                } 
                else
                { 
                    // If we can move next, there is at least one child 
                    this.HasLogicalChildren = children.MoveNext();
                } 
            }
        },

        /// <summary> 
        ///     Invoked when logical parent is changed.  This just
        ///     sets the parent pointer. 
        /// </summary> 
        /// <remarks>
        ///     A parent change is considered catastrohpic and results in a large 
        ///     amount of invalidations and tree traversals. <cref see="DependencyFastBuild"/>
        ///     is recommended to reduce the work necessary to build a tree
        /// </remarks>
        /// <param name="newParent"> 
        ///     New parent that was set
        /// </param> 
//        internal void 
        ChangeLogicalParent:function(/*DependencyObject*/ newParent) 
        {
            /////////////////// 
            // OnNewParent:
            ///////////////////
 
            // Logical Parent must first be dropped before you are attached to a newParent
            // This mitigates illegal tree state caused by logical child stealing as illustrated in bug 970706
            if (this._parent1 != null && newParent != null && this._parent1 != newParent)
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.HasLogicalParent)');
            } 
 
            // Trivial check to avoid loops
            if (newParent == this) 
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.CannotBeSelfParent)');
            }
 
            // Logical Parent implies no InheritanceContext
            if (newParent != null) 
            { 
                this.ClearInheritanceContext();
            } 

            this.IsParentAnFE = newParent instanceof FrameworkElement;

            /*DependencyObject*/var oldParent = this._parent1; 
            this.OnNewParent(newParent);
 
            // Update Has[Loaded/Unloaded]Handler Flags 
            BroadcastEventHelper.AddOrRemoveHasLoadedChangeHandlerFlag(this, oldParent, newParent);


            ///////////////////
            // OnParentChanged: 
            ///////////////////
 
            // Invalidate relevant properties for this subtree 
            /*DependencyObject*/var parent = (newParent != null) ? newParent : oldParent;
            TreeWalkHelper.InvalidateOnTreeChange(/* fe = */ this, /* fce = */ null, parent, (newParent != null)); 

            // If no one has called BeginInit then mark the element initialized and fire Initialized event
            // (non-parser programmatic tree building scenario)
            this.TryFireInitialized(); 
        },
 
        /// <summary> 
        ///     Called before the parent is chanded to the new value.
        /// </summary> 
//        internal virtual void 
        OnNewParent:function(/*DependencyObject*/ newParent)
        {
            //
            // This API is only here for compatability with the old 
            // behavior.  Note that FrameworkElement does not have
            // this virtual, so why do we need it here? 
            // 

            /*DependencyObject*/var oldParent = this._parent1; 
            this._parent1 = newParent;


 
            // Synchronize ForceInherit properties
            if(this._parent1 != null && this._parent1 instanceof ContentElement) 
            { 
                UIElement.SynchronizeForceInheritProperties(this, null, null, this._parent1);
            } 
            else if(oldParent instanceof ContentElement)
            {
                UIElement.SynchronizeForceInheritProperties(this, null, null, oldParent);
            } 

 
            // Synchronize ReverseInheritProperty Flags 
            //
            // NOTE: do this AFTER synchronizing force-inherited flags, since 
            // they often effect focusability and such.
            this.SynchronizeReverseInheritPropertyFlags(oldParent, false);
        },
 
        // OnAncestorChangedInternal variant when we know what type (FE/FCE) the
        //  tree node is. 
        /// <SecurityNote> 
        ///     Critical: This code calls into PresentationSource.OnAncestorChanged which is link demand protected
        ///     it does so only for content elements and not for FEs. But if called externally and configured 
        ///     inappropriately it can be used to change the tree
        ///     TreatAsSafe: This does not let you get at the presentationsource which is what we do not want to expose
        /// </SecurityNote>
//        internal void 
        OnAncestorChangedInternal:function(/*TreeChangeInfo*/ parentTreeState)
        { 
            // Cache the IsSelfInheritanceParent flag 
            var isSelfInheritanceParent = this.IsSelfInheritanceParent;
 
            if (parentTreeState.Root != this)
            {
                // Clear the HasStyleChanged flag
                this.HasStyleChanged = false; 
                this.HasStyleInvalidated = false;
                this.HasTemplateChanged = false; 
            } 

            // If this is a tree add operation update the ShouldLookupImplicitStyles 
            // flag with respect to your parent.
            if (parentTreeState.IsAddOperation)
            {
                /*FrameworkObject*/var fo = 
                    new FrameworkObject(this, null);
 
                fo.SetShouldLookupImplicitStyles(); 
            }
 
            // Invalidate ResourceReference properties
            if (this.HasResourceReference)
            {
                // This operation may cause a style change and hence should be done before the call to 
                // InvalidateTreeDependents as it relies on the HasStyleChanged flag
                TreeWalkHelper.OnResourcesChanged(this, ResourcesChangeInfo.TreeChangeInfo, false); 
            } 

            // If parent is a FrameworkElement 
            // This is also an operation that could change the style
            /*FrugalObjectList<DependencyProperty>*/
            var currentInheritableProperties =
            	this.InvalidateTreeDependentProperties(parentTreeState, isSelfInheritanceParent);
 
            // we have inherited properties that changes as a result of the above;
            // invalidation; push that list of inherited properties on the stack 
            // for the children to use 
            parentTreeState.InheritablePropertiesStack.Push(currentInheritableProperties);
 


            // Call OnAncestorChanged
            this.OnAncestorChanged(); 

            // Notify mentees if they exist 
            if (this.PotentiallyHasMentees) 
            {
                // Raise the ResourcesChanged Event so that ResourceReferenceExpressions 
                // on non-[FE/FCE] listening for this can then update their values
            	this.RaiseClrEvent(FrameworkElement.ResourcesChangedKey, EventArgs.Empty);
            }
        }, 

        // Invalidate all the properties that may have changed as a result of 
        //  changing this element's parent in the logical (and sometimes visual tree.) 
//        internal FrugalObjectList<DependencyProperty> 
        InvalidateTreeDependentProperties:function(/*TreeChangeInfo*/ parentTreeState, /*bool*/ isSelfInheritanceParent)
        { 
        	this.AncestorChangeInProgress = true;

        	this.InVisibilityCollapsedTree = false;  // False == we don't know whether we're in a visibility collapsed tree.
 
            if (parentTreeState.TopmostCollapsedParentNode == null)
            { 
                // There is no ancestor node with Visibility=Collapsed. 
                //  See if "fe" is the root of a collapsed subtree.
                if (this.Visibility == Visibility.Collapsed) 
                {
                    // This is indeed the root of a collapsed subtree.
                    //  remember this information as we proceed on the tree walk.
                    parentTreeState.TopmostCollapsedParentNode = this; 

                    // Yes, this FE node is in a visibility collapsed subtree. 
                    this.InVisibilityCollapsedTree = true; 
                }
            } 
            else
            {
                // There is an ancestor node somewhere above us with
                //  Visibility=Collapsed.  We're in a visibility collapsed subtree. 
            	this.InVisibilityCollapsedTree = true;
            } 
 

            try 
            {
                // Style property is a special case of a non-inherited property that needs
                // invalidation for parent changes. Invalidate StyleProperty if it hasn't been
                // locally set because local value takes precedence over implicit references 
                if (this.IsInitialized && !this.HasLocalStyle && (this != parentTreeState.Root))
                { 
                	this.UpdateStyleProperty(); 
                }
 
                /*Style*/var selfStyle = null;
                /*Style*/var selfThemeStyle = null;
                /*DependencyObject*/var templatedParent = null;
 
                var childIndex = -1;
                /*ChildRecord*/var childRecord = new ChildRecord(); 
                var isChildRecordValid = false; 

                selfStyle = this.Style; 
                selfThemeStyle = this.ThemeStyle;
                templatedParent = this.TemplatedParent;
                childIndex = this.TemplateChildIndex;
 
                // StyleProperty could have changed during invalidation of ResourceReferenceExpressions if it
                // were locally set or during the invalidation of unresolved implicitly referenced style 
                var hasStyleChanged = this.HasStyleChanged; 

                var childRecordOut={
                	"childRecord" : childRecord	
                };
                
                var isChildRecordValidOut = {
                	"isChildRecordValid" : isChildRecordValid	
                };
                // Fetch selfStyle, hasStyleChanged and childIndex for the current node 
                FrameworkElement.GetTemplatedParentChildRecord(templatedParent, childIndex, 
                		childRecordOut/*out childRecord*/, isChildRecordValidOut/*out isChildRecordValid*/);
                childRecord = childRecordOut.childRecord;
                isChildRecordValid = isChildRecordValidOut.isChildRecordValid;
                

                var parentFEOut={
                	"feParent" : null
                };
                var parentFCEOut ={
                	"fceParent" : null	
                };
                var hasParent = FrameworkElement.GetFrameworkParent1(this, parentFEOut/*out parentFE*/, parentFCEOut/*out parentFCE*/);
                /*FrameworkElement*/var parentFE = parentFEOut.feParent;
                /*FrameworkContentElement*/var parentFCE = parentFCEOut.fceParent; 
                
                /*DependencyObject*/var parent = null; 
                /*InheritanceBehavior*/var parentInheritanceBehavior = InheritanceBehavior.Default;
                if (hasParent) 
                {
                    if (parentFE != null)
                    {
                        parent = parentFE; 
                        parentInheritanceBehavior = parentFE.InheritanceBehavior;
                    } 
                    else 
                    {
                        parent = parentFCE; 
                        parentInheritanceBehavior = parentFCE.InheritanceBehavior;
                    }
                }
 
                if (!TreeWalkHelper.SkipNext(this.InheritanceBehavior) && !TreeWalkHelper.SkipNow(parentInheritanceBehavior))
                { 
                    // Synchronize InheritanceParent 
                    this.SynchronizeInheritanceParent(parent);
                } 
                else if (!this.IsSelfInheritanceParent)
                {
                    // Set IsSelfInheritanceParet on the root node at a tree boundary
                    // so that all inheritable properties are cached on it. 
                	this.SetIsSelfInheritanceParent();
                } 
 
                // Loop through all cached inheritable properties for the parent to see if they should be invalidated.
                return TreeWalkHelper.InvalidateTreeDependentProperties(parentTreeState, /* fe = */ this, /* fce = */ null, 
                		selfStyle, selfThemeStyle, 
                    /*ref childRecord*/childRecordOut, isChildRecordValid, hasStyleChanged, isSelfInheritanceParent);
            }
            finally
            { 
            	this.AncestorChangeInProgress = false;
            	this.InVisibilityCollapsedTree = false;  // 'false' just means 'we don't know' - see comment at definition of the flag. 
            } 
        },
 

        /// <summary> 
        ///     This method causes the StyleProperty to be re-evaluated 
        /// </summary>
//        internal void 
        UpdateStyleProperty:function() 
        {
            if (!this.HasStyleInvalidated)
            {
                if (this.IsStyleUpdateInProgress == false) 
                {
                	this.IsStyleUpdateInProgress = true; 
                    try 
                    {
                    	this.InvalidateProperty(FrameworkElement.StyleProperty); 
                    	this.HasStyleInvalidated = true;
                    }
                    finally
                    { 
                    	this.IsStyleUpdateInProgress = false;
                    } 
                } 
                else
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.CyclicStyleReferenceDetected, this)');
                }
            }
        }, 

        /// <summary> 
        ///     This method causes the ThemeStyleProperty to be re-evaluated 
        /// </summary>
//        internal void 
        UpdateThemeStyleProperty:function() 
        {
            if (this.IsThemeStyleUpdateInProgress == false)
            {
            	this.IsThemeStyleUpdateInProgress = true; 
                try
                { 
                    StyleHelper.GetThemeStyle(/* fe = */ this, /* fce = */ null); 

                    // Update the ContextMenu and ToolTips separately because they aren't in the tree 
                    /*ContextMenu*/
                    var contextMenu =
                            this.GetValueEntry(
                                    this.LookupEntry(FrameworkElement.ContextMenuProperty.GlobalIndex),
                                    FrameworkElement.ContextMenuProperty, 
                                    null,
                                    RequestFlags.DeferredReferences).Value;
                    contextMenu = contextMenu instanceof ContextMenu ? contextMenu : null; 
                    if (contextMenu != null) 
                    {
                        TreeWalkHelper.InvalidateOnResourcesChange(contextMenu, null, ResourcesChangeInfo.ThemeChangeInfo); 
                    }

                    /*DependencyObject*/
                    var toolTip =
                            this.GetValueEntry( 
                            		this.LookupEntry(FrameworkElement.ToolTipProperty.GlobalIndex),
                            		FrameworkElement.ToolTipProperty, 
                                    null, 
                                    RequestFlags.DeferredReferences).Value;
                    toolTip =toolTip instanceof DependencyObject ? toolTip : null;
 
                    if (toolTip != null)
                    {
                        /*FrameworkObject*/var toolTipFO = new FrameworkObject(toolTip);
                        if (toolTipFO.IsValid) 
                        {
                            TreeWalkHelper.InvalidateOnResourcesChange(toolTipFO.FE, toolTipFO.FCE, ResourcesChangeInfo.ThemeChangeInfo); 
                        } 
                    }
 
                    this.OnThemeChanged();
                }
                finally
                { 
                	this.IsThemeStyleUpdateInProgress = false;
                } 
            } 
            else
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.CyclicThemeStyleReferenceDetected, this)');
            }
        },
 
        // Called when the theme changes so resources not in the tree can be updated by subclasses
//        internal virtual void 
        OnThemeChanged:function() 
        { 
        },
 
        ///<summary>
        ///     Initiate the processing for Loaded event broadcast starting at this node
        /// </summary>
        /// <remarks> 
        ///     This method is to allow firing Loaded event from a Helper class since the override is protected
        /// </remarks> 
//        internal void 
        FireLoadedOnDescendentsInternal:function() 
        {
            // This is to prevent duplicate Broadcasts for the Loaded event 
            if (this.LoadedPending == null)
            {
                /*DependencyObject*/var parent = Parent;
 
                if (parent == null)
                { 
                    parent = VisualTreeHelper.GetParent(this); 
                }
 

                // Check if this Loaded cancels against a previously queued Unloaded event
                // Note that if the Loaded and the Unloaded do not change the position of
                // the node within the loagical tree they are considered to cancel each other out. 
                /*object[]*/var unloadedPending = this.UnloadedPending;
                if (unloadedPending == null || unloadedPending[2] != parent) 
                { 
                    // Add a callback to the MediaContext which will be called
                    // before the first render after this point 
                    BroadcastEventHelper.AddLoadedCallback(this, parent);
                }
                else
                { 
                    // Dequeue Unloaded
                    BroadcastEventHelper.RemoveUnloadedCallback(this, unloadedPending); 
                } 
            }
        }, 

        ///<summary>
        ///     Broadcast Unloaded event starting at this node
        /// </summary> 
//        internal void 
        FireUnloadedOnDescendentsInternal:function()
        { 
            // This is to prevent duplicate Broadcasts for the Unloaded event 
            if (this.UnloadedPending == null)
            { 
                /*DependencyObject*/var parent = this.Parent;

                if (parent == null)
                { 
                    parent = VisualTreeHelper.GetParent(this);
                } 
 

                // Check if this Unloaded cancels against a previously queued Loaded event 
                // Note that if the Loaded and the Unloaded do not change the position of
                // the node within the loagical tree they are considered to cancel each other out.
               /* object[]*/ loadedPending = this.LoadedPending;
                if (this.loadedPending == null) 
                {
                    // Add a callback to the MediaContext which will be called 
                    // before the first render after this point 
                    BroadcastEventHelper.AddUnloadedCallback(this, parent);
                } 
                else
                {
                    // Dequeue Loaded
                    BroadcastEventHelper.RemoveLoadedCallback(this, loadedPending); 
                }
            } 
        }, 

        /// <summary> 
        ///     You are about to provided as the InheritanceContext for the target.
        ///     You can choose to allow this or not.
        /// </summary>
//        internal override bool 
        ShouldProvideInheritanceContext:function(/*DependencyObject*/ target, /*DependencyProperty*/ property) 
        {
            // return true if the target is neither a FE or FCE 
            /*FrameworkObject*/var fo = new FrameworkObject(target); 
            return !fo.IsValid;
        }, 
 
        /// <summary>
        ///     You have a new InheritanceContext 
        /// </summary>
        /// <remarks>
        ///     This is to solve the case of programmatically creating a VisualBrush or BitmapCacheBrush
        ///     with an element in it and the element not getting Initialized. 
        /// </remarks>
//        internal override void 
        AddInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property) 
        { 
            base.AddInheritanceContext(context, property);
 
            // Initialize, if not already done
            this.TryFireInitialized();

            // accept the new inheritance context provided that 
            // a) the requested link uses VisualBrush.Visual or BitmapCacheBrush.TargetProperty
            // b) this element has no visual or logical parent 
            // c) the context does not introduce a cycle 
            if ((property == VisualBrush.VisualProperty || property == BitmapCacheBrush.TargetProperty)
                && FrameworkElement.GetFrameworkParent(this) == null 
                 //!FrameworkObject.IsEffectiveAncestor(this, context, property))
                && !FrameworkObject.IsEffectiveAncestor(this, context))
            {
                //FrameworkObject.Log("+ {0}", FrameworkObject.LogIC(context, property, this)); 
                if (!this.HasMultipleInheritanceContexts && this.InheritanceContext == null)
                { 
                    // first request - accept the new inheritance context 
                    FrameworkElement.InheritanceContextField.SetValue(this, context);
                    this.OnInheritanceContextChanged(EventArgs.Empty); 
                }
                else if (InheritanceContext != null)
                {
                    // second request - remove all context and enter "shared" mode 
                	FrameworkElement.InheritanceContextField.ClearValue(this);
                    this.WriteInternalFlag2(InternalFlags2.HasMultipleInheritanceContexts, true); 
                    this.OnInheritanceContextChanged(EventArgs.Empty); 
                }
                // else already in shared mode - ignore the request 
            }
        },

        // Remove an inheritance context 
//        internal override void 
        RemoveInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property)
        { 
            if (this.InheritanceContext == context) 
            {
                //FrameworkObject.Log("- {0}", FrameworkObject.LogIC(context, property, this)); 
            	FrameworkElement.InheritanceContextField.ClearValue(this);
            	this.OnInheritanceContextChanged(EventArgs.Empty);
            }
 
            base.RemoveInheritanceContext(context, property);
        },
 
        // Clear the inheritance context (called when the element
        // gets a real parent 
//        private void 
        ClearInheritanceContext:function()
        {
            if (this.InheritanceContext != null)
            { 
            	FrameworkElement.InheritanceContextField.ClearValue(this);
                this.OnInheritanceContextChanged(EventArgs.Empty); 
            } 
        },
 
        /// <summary>
        ///     This is a means for subclasses to get notification
        ///     of InheritanceContext changes and then they can do
        ///     their own thing. 
        /// </summary>
//        internal override void 
        OnInheritanceContextChangedCore:function(/*EventArgs*/ args) 
        { 
            /*DependencyObject*/var oldMentor = MentorField.GetValue(this);
            /*DependencyObject*/var newMentor = Helper.FindMentor(this.InheritanceContext); 

            if (oldMentor != newMentor)
            {
            	FrameworkElement.MentorField.SetValue(this, newMentor); 

                if (oldMentor != null) 
                { 
                    this.DisconnectMentor(oldMentor);
                } 
                if (newMentor != null)
                {
                    this.ConnectMentor(newMentor);
                } 
            }
        }, 
 
        // connect to a new mentor
//        void 
        ConnectMentor:function(/*DependencyObject*/ mentor) 
        {
            /*FrameworkObject*/var foMentor = new FrameworkObject(mentor);

            // register for InheritedPropertyChanged events 
            foMentor.InheritedPropertyChanged += new InheritedPropertyChangedEventHandler(OnMentorInheritedPropertyChanged);
 
            // register for ResourcesChanged events 
            foMentor.ResourcesChanged += new EventHandler(OnMentorResourcesChanged);
 
            // invalidate the mentee's tree
            TreeWalkHelper.InvalidateOnTreeChange(
                    this, null,
 
                    foMentor.DO,
                    true /* isAddOperation */ 
                    ); 

            // register for Loaded/Unloaded events. 
            // Do this last so the tree is ready when Loaded is raised.
            if (this.SubtreeHasLoadedChangeHandler)
            {
                /*bool*/var isLoaded = foMentor.IsLoaded; 

                this.ConnectLoadedEvents({"foMentor" : foMentor}, isLoaded); 
 
                if (isLoaded)
                { 
                    this.FireLoadedOnDescendentsInternal();
                }
            }
        }, 

        // disconnect from an old mentor 
//        void 
        DisconnectMentor:function(/*DependencyObject*/ mentor) 
        {
            /*FrameworkObject*/var foMentor = new FrameworkObject(mentor); 

            // unregister for InheritedPropertyChanged events
            foMentor.InheritedPropertyChanged -= new InheritedPropertyChangedEventHandler(OnMentorInheritedPropertyChanged);
 
            // unregister for ResourcesChanged events
            foMentor.ResourcesChanged -= new EventHandler(OnMentorResourcesChanged); 
 
            // invalidate the mentee's tree
            TreeWalkHelper.InvalidateOnTreeChange( 
                    this, null,

                    foMentor.DO,
                    false /* isAddOperation */ 
                    );
 
            // unregister for Loaded/Unloaded events 
            if (this.SubtreeHasLoadedChangeHandler)
            { 
                var isLoaded = foMentor.IsLoaded;

                var foMentorRef ={
                	"foMentor" : foMentor	
                };
                this.DisconnectLoadedEvents(/*ref foMentor*/foMentorRef, isLoaded);
                foMentor = foMentorRef.foMentor;
 
                if (foMentor.IsLoaded)
                { 
                    this.FireUnloadedOnDescendentsInternal(); 
                }
            } 
        },

        // called by BroadcastEventHelper when the SubtreeHasLoadedChangedHandler
        // flag changes on a mentored FE/FCE 
//        internal void 
        ChangeSubtreeHasLoadedChangedHandler:function(/*DependencyObject*/ mentor)
        { 
            /*FrameworkObject*/
        	var foMentor = new FrameworkObject(mentor); 
            var isLoaded = foMentor.IsLoaded;
 
            var foMentorRef ={
                	"foMentor" : foMentor	
                };
            if (this.SubtreeHasLoadedChangeHandler)
            {
                this.ConnectLoadedEvents(foMentorRef, isLoaded);
            } 
            else
            { 
                this.DisconnectLoadedEvents(foMentorRef, isLoaded); 
            }
        }, 

        // handle the Loaded event from the mentor
//        void
        OnMentorLoaded:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        { 
            /*FrameworkObject*/var foMentor = new FrameworkObject(sender);
 
            // stop listening for Loaded, start listening for Unloaded 
            foMentor.Loaded -= new RoutedEventHandler(OnMentorLoaded);
            foMentor.Unloaded += new RoutedEventHandler(OnMentorUnloaded); 

            // broadcast the Loaded event to my framework subtree
            //FireLoadedOnDescendentsInternal();
            BroadcastEventHelper.BroadcastLoadedSynchronously(this, this.IsLoaded); 
        },
 
        // handle the Unloaded event from the mentor 
//        void 
        OnMentorUnloaded:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        { 
            /*FrameworkObject*/var foMentor = new FrameworkObject(sender);

            // stop listening for Unloaded, start listening for Loaded
            foMentor.Unloaded -= new RoutedEventHandler(OnMentorUnloaded); 
            foMentor.Loaded += new RoutedEventHandler(OnMentorLoaded);
 
            // broadcast the Unloaded event to my framework subtree 
            //FireUnloadedOnDescendentsInternal();
            BroadcastEventHelper.BroadcastUnloadedSynchronously(this, IsLoaded); 
        },

//        void 
        ConnectLoadedEvents:function(/*ref FrameworkObject foMentor*/foMentorRef, /*bool*/ isLoaded)
        { 
            if (foMentorRef.foMentor.IsValid)
            { 
                if (isLoaded) 
                {
                	foMentorRef.foMentor.Unloaded += new RoutedEventHandler(OnMentorUnloaded); 
                }
                else
                {
                	foMentorRef.foMentor.Loaded += new RoutedEventHandler(OnMentorLoaded); 
                }
            } 
        }, 

//        void 
        DisconnectLoadedEvents:function(/*ref FrameworkObject foMentor*/foMentorRef, /*bool*/ isLoaded) 
        {
            if (foMentorRef.foMentor.IsValid)
            {
                if (isLoaded) 
                {
                	foMentorRef.foMentor.Unloaded -= new RoutedEventHandler(OnMentorUnloaded); 
                } 
                else
                { 
                	foMentorRef.foMentor.Loaded -= new RoutedEventHandler(OnMentorLoaded);
                }
            }
        }, 

        // handle the InheritedPropertyChanged event from the mentor 
//        void 
        OnMentorInheritedPropertyChanged:function(/*object*/ sender, /*InheritedPropertyChangedEventArgs*/ e) 
        {
            TreeWalkHelper.InvalidateOnInheritablePropertyChange( 
                    this, null,

                    e.Info, false /*skipStartNode*/);
        }, 

        // handle the ResourcesChanged event from the mentor 
//        void 
        OnMentorResourcesChanged:function(/*object*/ sender, /*EventArgs*/ e) 
        {
            TreeWalkHelper.InvalidateOnResourcesChange( 
                    this, null,

                    ResourcesChangeInfo.CatastrophicDictionaryChangeInfo);
        }, 

        // Helper method to retrieve and fire the InheritedPropertyChanged event 
//        internal void 
        RaiseInheritedPropertyChangedEvent:function(/*ref InheritablePropertyChangeInfo*/ info) 
        {
            /*EventHandlersStore*/var store = this.EventHandlersStore; 
            if (store != null)
            {
                /*Delegate*/var handler = store.Get(FrameworkElement.InheritedPropertyChangedKey);
                if (handler != null) 
                {
                    /*InheritedPropertyChangedEventArgs*/var args = new InheritedPropertyChangedEventArgs(/*ref*/ info); 
                    handler.Invoke(this, args); 
                }
            } 
        },

        // Internal so that StyleHelper could uniformly call the TemplateChanged 
        // virtual on any templated parent
//        internal virtual void 
        OnTemplateChangedInternal:function( 
            /*FrameworkTemplate*/ oldTemplate, 
            /*FrameworkTemplate*/ newTemplate)
        { 
            this.HasTemplateChanged = true;
        },

        /// <summary> 
        ///     Style has changed
        /// </summary> 
        /// <param name="oldStyle">The old Style</param> 
        /// <param name="newStyle">The new Style</param>
//        protected internal virtual void 
        OnStyleChanged:function(/*Style*/ oldStyle, /*Style*/ newStyle) 
        {
            this.HasStyleChanged = true;
        },
 
        /// <summary>
        /// This method is called from during property invalidation time. If the FrameworkElement has a child on which 
        /// some property was invalidated and the property was marked as AffectsParentMeasure or AffectsParentArrange 
        /// during registration, this method is invoked to let a FrameworkElement know which particualr child must be
        /// remeasured if the FrameworkElement wants to do partial (incremental) update of layout. 
        /// <para/>
        /// Olny advanced FrameworkElement, which implement incremental update should override this method. Since
        /// Panel always gets InvalidateMeasure or InvalidateArrange called in this situation, it ensures that
        /// the FrameworkElement will be re-measured and/or re-arranged. Only if the FrameworkElement wants to implement a performance 
        /// optimization and avoid calling Measure/Arrange on all children, it should override this method and
        /// store the info about invalidated children, to use subsequently in the FrameworkElement's MeasureOverride/ArrangeOverride 
        /// implementations. 
        /// <para/>
        /// Note: to listen for added/removed children, Panel should provide its derived version of 
        /// <see cref="UIElementCollection"/>.
        /// </summary>
        ///<param name="child">Reference to a child UIElement that had AffectsParentMeasure/AffectsParentArrange property invalidated.</param>
//        protected internal virtual void 
        ParentLayoutInvalidated:function(/*UIElement*/ child) 
        {
        }, 
 
        /// <summary>
        /// ApplyTemplate is called on every Measure 
        /// </summary>
        /// <remarks>
        /// Used by subclassers as a notification to delay fault-in their Visuals
        /// Used by application authors ensure an Elements Visual tree is completely built 
        /// </remarks>
        /// <returns>Whether Visuals were added to the tree</returns> 
//        public bool 
        ApplyTemplate:function() 
        {
            // Notify the ContentPresenter/ItemsPresenter that we are about to generate the 
            // template tree and allow them to choose the right template to be applied.
            this.OnPreApplyTemplate();

            var visualsCreated = false; 

//            UncommonField<HybridDictionary[]>  
            var dataField = StyleHelper.TemplateDataField; 
            /*FrameworkTemplate*/var template = this.TemplateInternal; 

            // The Template may change in OnApplyTemplate so we'll retry in this case. 
            // We dont want to get stuck in a loop doing this, so limit the number of
            // template changes before we bail out.
            var retryCount = 2;
            for (var i = 0; template != null && i < retryCount; i++) 
            {
                // VisualTree application never clears existing trees. Trees 
                // will be conditionally cleared on Template invalidation 
                if (!this.HasTemplateGeneratedSubTree)
                { 

                    // Create a VisualTree using the given template
                    visualsCreated = template.ApplyTemplateContent(dataField, this);
                    if (visualsCreated) 
                    {
                        // This VisualTree was created via a Template 
                        this.HasTemplateGeneratedSubTree =  true; 

                        // We may have had trigger actions that had to wait until the 
                        //  template subtree has been created.  Invoke them now.
                        StyleHelper.InvokeDeferredActions(this, template);

                        // Notify sub-classes when the template tree has been created 
                        this.OnApplyTemplate();
                    } 
 
                    if (template != this.TemplateInternal)
                    { 
                        template = this.TemplateInternal;
                        continue;
                    }
                } 

                break; 
            } 

            this.OnPostApplyTemplate(); 

            return visualsCreated;
        },
 
        /// <summary>
        /// This virtual is called by FE.ApplyTemplate before it does work to generate the template tree. 
        /// </summary> 
        /// <remarks>
        /// This virtual is overridden for the following three reasons 
        /// 1. By ContentPresenter/ItemsPresenter to choose the template to be applied in this case.
        /// 2. By RowPresenter/ColumnHeaderPresenter/InkCanvas to build custom visual trees
        /// 3. By ScrollViewer/TickBar/ToolBarPanel/Track to hookup bindings to their TemplateParent
        /// </remarks> 
//        internal virtual void 
        OnPreApplyTemplate:function()
        { 
        }, 

        /// <summary> 
        ///     This is the virtual that sub-classes must override if they wish to get
        ///     notified that the template tree has been created.
        /// </summary>
        /// <remarks> 
        ///     This virtual is called after the template tree has been generated and it is invoked only
        ///     if the call to ApplyTemplate actually caused the template tree to be generated. 
        /// </remarks> 
//        public virtual void 
        OnApplyTemplate:function()
        { 
        },

        /// <summary>
        /// This virtual is called by FE.ApplyTemplate after it generates the template tree. 
        /// </summary>
        /// <remarks> 
        /// This is overrideen by Control to update the visual states 
        /// </remarks>
//        internal virtual void 
        OnPostApplyTemplate:function() 
        {

        },
 
        /// <summary>
        ///     Begins the given Storyboard as a Storyboard with the given handoff 
        /// policy, and with the specified state for controllability. 
        /// </summary>
//        public void 
        BeginStoryboard:function(/*Storyboard*/ storyboard, /*HandoffBehavior*/ handoffBehavior, /*bool*/ isControllable) 
        {
            if( storyboard == null )
            {
                throw new ArgumentNullException("storyboard"); 
            }
            
            if(handoffBehavior === undefined){
            	handoffBehavior = HandoffBehavior.SnapshotAndReplace;
            }
            
            if(isControllable === undefined){
            	isControllable = false;
            }
 
            // Storyboard.Begin is a public API and needs to be validating handoffBehavior anyway. 

            storyboard.Begin( this, handoffBehavior, isControllable ); 
        },

        // This should be called when the FrameworkElement tree is built up,
        //  at this point we can process all the setter-related information
        //  because now we'll be able to resolve "Target" references in setters. 
//        private void 
        PrivateInitialized:function()
        { 
            // Process Trigger information when this object is loaded. 
            EventTrigger.ProcessTriggerCollection(this);
        }, 

        /// <summary>
        /// Gets the Visual child at the specified index. 
        /// </summary>
        /// <remarks> 
        /// Derived classes that provide a custom children collection must override this method 
        /// and return the child at the specified index.
        /// </remarks> 
//        protected override Visual 
        GetVisualChild:function(/*int*/ index)
        {
            if (this._templateChild == null)
            { 
                throw new Error('ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)');
            } 
            if (index != 0) 
            {
                throw new Error('ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)'); 
            }
            return this._templateChild;
        },
 
////        bool IQueryAmbient.
//        IsAmbientPropertyAvailable:function(/*string*/ propertyName)
//        { 
//            // We want to make sure that StaticResource resolution checks the .Resources 
//            // Ie.  The Ambient search should look at Resources if it is set.
//            // Even if it wasn't set from XAML (eg. the Ctor (or derived Ctor) added stuff) 
//            return (propertyName != "Resources" || this.HasResources);
//        },

        /// <summary>
        ///     Retrieves the element in the VisualTree of thie element that corresponds to 
        ///     the element with the given childName in this element's style definition
        /// </summary> 
        /// <param name="childName">the Name to find the matching element for</param> 
        /// <returns>The Named element.  Null if no element has this Name.</returns>
//        protected internal DependencyObject 
        GetTemplateChild:function(/*string*/ childName) 
        {
            /*FrameworkTemplate*/var template = this.TemplateInternal;
            /* Calling this before getting a style/template is not a bug.
            Debug.Assert(template != null, 
                "The VisualTree should have been created from a Template");
            */ 
 
            if (template == null)
            { 
                return null;
            }

            var result = StyleHelper.FindNameInTemplateContent(this, childName, template);
            return result instanceof DependencyObject ? result : null; 
        },
 
        /// <summary> 
        ///     Searches for a resource with the passed resourceKey and returns it.
        ///     Throws an exception if the resource was not found. 
        /// </summary>
        /// <remarks>
        ///     If the sources is not found on the called Element, the parent
        ///     chain is searched, using the logical tree. 
        /// </remarks>
        /// <param name="resourceKey">Name of the resource</param> 
        /// <returns>The found resource.</returns> 
//        public object 
        FindResource:function(/*object*/ resourceKey)
        { 
            // Verify Context Access
            // VerifyAccess();

            if (resourceKey == null) 
            {
                throw new Error('ArgumentNullException("resourceKey")'); 
            } 

            /*object*/var resource = FrameworkElement.FindResourceInternal(this, null /* fce */, resourceKey); 

            if (resource == DependencyProperty.UnsetValue)
            {
                // Resource not found in parent chain, app or system 
                Helper.ResourceFailureThrow(resourceKey);
            } 
 
            return resource;
        }, 


        /// <summary>
        ///     Searches for a resource with the passed resourceKey and returns it 
        /// </summary>
        /// <remarks> 
        ///     If the sources is not found on the called Element, the parent 
        ///     chain is searched, using the logical tree.
        /// </remarks> 
        /// <param name="resourceKey">Name of the resource</param>
        /// <returns>The found resource.  Null if not found.</returns>
//        public object 
        TryFindResource:function(/*object*/ resourceKey)
        { 
            // Verify Context Access
            // VerifyAccess(); 
 
            if (resourceKey == null)
            { 
                throw new Error('ArgumentNullException("resourceKey")');
            }

            /*object*/var resource = FrameworkElement.FindResourceInternal(this, null /* fce */, resourceKey); 

            if (resource == DependencyProperty.UnsetValue) 
            { 
                // Resource not found in parent chain, app or system
                // This is where we translate DependencyProperty.UnsetValue to a null 
                resource = null;
            }

            return resource; 
        },
 
        // return true if there is a local or style-supplied value for the dp
//        internal bool 
        HasNonDefaultValue:function(/*DependencyProperty*/ dp) 
        { 
            return !Helper.HasDefaultValue(this, dp);
        }, 

        /// <summary>
        ///     Searches for a resource called name and sets up a resource reference 
        ///     to it for the passed property.
        /// </summary> 
        /// <param name="dp">Property to which the resource is bound</param> 
        /// <param name="name">Name of the resource</param>
//        public void 
        SetResourceReference:function( 
            /*DependencyProperty*/ dp,
            /*object*/             name)
        {
            // Set the value of the property to a ResourceReferenceExpression 
            this.SetValue(dp, new ResourceReferenceExpression(name));
 
            // Set flag indicating that the current FrameworkElement instance 
            // has a property value set to a resource reference and hence must
            // be invalidated on parent changed or resource property change events 
            this.HasResourceReference = true;
        },

 
        /// <summary>
        ///     Allows subclasses to participate in property base value computation 
        /// </summary> 
        /// <param name="dp">Dependency property</param>
        /// <param name="metadata">Type metadata of the property for the type</param> 
        /// <param name="newEntry">entry computed by base</param>
//        internal sealed override void 
        EvaluateBaseValueCore:function(
            /*DependencyProperty*/  dp,
            /*PropertyMetadata*/    metadata, 
            /*ref EffectiveValueEntry*/ newEntryRef)
        { 
            if (dp == FrameworkElement.StyleProperty) 
            {
                // If this is the first time that the StyleProperty 
                // is being fetched then mark it such
            	this.HasStyleEverBeenFetched = true;

                // Clear the flags associated with the StyleProperty 
            	this.HasImplicitStyleFromResources = false;
            	this.IsStyleSetFromGenerator = false; 
            } 

            this.GetRawValue(dp, metadata, /*ref*/ newEntryRef); 
            Storyboard.GetComplexPathValue(this, dp, /*ref*/ newEntryRef, metadata);
        },

//        internal void 
        GetRawValue:function(/*DependencyProperty*/ dp, /*PropertyMetadata*/ metadata, /*ref EffectiveValueEntry*/ entryRef) 
        {
            // Queries to FrameworkElement will automatically fault in the Style 
 
            // If a value was resolved by base, return that.
            if ((entryRef.entry.BaseValueSourceInternal == BaseValueSourceInternal.Local) && 
                (entryRef.entry.GetFlattenedEntry(RequestFlags.FullyResolved).Value != DependencyProperty.UnsetValue))
            {
                return;
            } 

            // 
            // Try for container Style driven value 
            //
            if (this.TemplateChildIndex != -1) 
            {
                // This instance is in the template child chain of a Template.VisualTree,
                //  so we need to see if the Style has an applicable value.
                // 
                // If the parent element's style is changing, this instance is
                // in a visual tree that is being removed, and the value request 
                // is simply a result of tearing down some information in that 
                // tree (e.g. a BindingExpression).  If so, just pretend there is no style (bug 991395).
 
                if (this.GetValueFromTemplatedParent(dp, /*ref entry*/entryRef.entry))
                {
                    return;
                } 
            }
 
 
            //
            // Try for Styled value 
            // (Style already initialized by ParentChainStyleInitialization above)
            //

            // Here are some of the implicit rules used by GetRawValue, 
            // while querying properties on the container.
            // 1. Style property cannot be specified in a Style 
            // 2. Style property cannot be specified in a ThemeStyle 
            // 3. Style property cannot be specified in a Template
            // 4. DefaultStyleKey property cannot be specified in a ThemeStyle 
            // 5. DefaultStyleKey property cannot be specified in a Template
            // 6. Template property cannot be specified in a Template

            if (dp != FrameworkElement.StyleProperty) 
            {
                if (StyleHelper.GetValueFromStyleOrTemplate(new FrameworkObject(this, null), dp, /*ref*/ entryRef.entry)) 
                { 
                    return;
                } 
            }
            else
            {
                /*object*/var source; 
                var sourceOut = {
                	"source" : source
                };
                
                /*object*/var implicitValue = FrameworkElement.FindImplicitStyleResource(this, this.GetType(), /*out source*/sourceOut);
                source = sourceOut.source;
                
                if (implicitValue != DependencyProperty.UnsetValue) 
                { 
                    // Commented this because the implicit fetch could also return a DeferredDictionaryReference
                    // if (!(implicitValue is Style)) 
                    // {
                    //     throw new InvalidOperationException(SR.Get(SRID.InvalidImplicitStyleResource, this.GetType().Name, implicitValue));
                    // }
 
                    // This style has been fetched from resources
                	this.HasImplicitStyleFromResources = true; 
 
                	entryRef.entry.BaseValueSourceInternal = BaseValueSourceInternal.ImplicitReference;
                	entryRef.entry.Value = implicitValue; 
                    return;
                }
            }
 
            //
            // Try for Inherited value 
            // 
            /*FrameworkPropertyMetadata*/
            var fmetadata = metadata instanceof FrameworkPropertyMetadata ? metadata : null;
 
            // Metadata must exist specifically stating to group or inherit
            // Note that for inheritable properties that override the default value a parent can impart
            // its default value to the child even though the property may not have been set locally or
            // via a style or template (ie. IsUsed flag would be false). 
            if (fmetadata != null)
            { 
                if (fmetadata.Inherits) 
                {
                    /*object*/var value = this.GetInheritableValue(dp, fmetadata); 

                    if( value != DependencyProperty.UnsetValue)
                    {
                    	entryRef.entry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited; 
                    	entryRef.entry.Value = value;
                        return; 
                    } 
                }
            } 

//            // No value found.
//            Debug.Assert(entry.Value == DependencyProperty.UnsetValue,"FrameworkElement.GetRawValue should never fall through with a value != DependencyProperty.UnsetValue.  We're supposed to return as soon as we found something.");
        }, 

 
 
        // This FrameworkElement has been established to be a Template.VisualTree
        //  node of a parent object.  Ask the TemplatedParent's Style object if 
        //  they have a value for us.

//        private bool 
        GetValueFromTemplatedParent:function(/*DependencyProperty*/ dp, /*ref EffectiveValueEntry*/ entry)
        { 
            /*FrameworkTemplate*/var frameworkTemplate = null;
//            Debug.Assert( IsTemplatedParentAnFE ); 
 
            /*FrameworkElement*/var feTemplatedParent = this._templatedParent;
            frameworkTemplate = feTemplatedParent.TemplateInternal; 

            if (frameworkTemplate != null)
            {
                return StyleHelper.GetValueFromTemplatedParent( 
                		this._templatedParent,
                		this.TemplateChildIndex, 
                        new FrameworkObject(this, null), 
                        dp,
                    /*ref*/ frameworkTemplate.ChildRecordFromChildIndex,
                        frameworkTemplate.VisualTree,
                    /*ref*/ entry);
            }
            return false; 
        },
 
        // Climb the framework tree hierarchy and see if we can pick up an 
        //  inheritable property value somewhere in that parent chain.
//        private object 
        GetInheritableValue:function(/*DependencyProperty*/ dp, /*FrameworkPropertyMetadata*/ fmetadata)
        {
            //
            // Inheritance 
            //
 
            if (!TreeWalkHelper.SkipNext(InheritanceBehavior) || fmetadata.OverridesInheritanceBehavior == true) 
            {
                // Used to terminate tree walk if a tree boundary is hit 
                /*InheritanceBehavior*/var inheritanceBehavior = InheritanceBehavior.Default;

                var parentFEOut={
                	"feParent" : null	
                };
                
                var parentFCEOut = {
                	"fceParent" : null
                };
                
                var hasParent = FrameworkElement.GetFrameworkParent1(this, /*out parentFE*/parentFEOut, /*out parentFCE*/parentFCEOut);
                /*FrameworkContentElement*/var parentFCE = parentFCEOut.fceParent;
                /*FrameworkElement*/var parentFE = parentFEOut.feParent; 
                while (hasParent) 
                { 
                    /*bool*/var inheritanceNode;
                	var inheritanceBehaviorOut = {
                		"inheritanceBehavior" : null
                	}
                    if (parentFE != null) 
                    {
                        inheritanceNode = TreeWalkHelper.IsInheritanceNode(parentFE, dp, /*out inheritanceBehavior*/inheritanceBehaviorOut);
                    }
                    else // (parentFCE != null) 
                    {
                        inheritanceNode = TreeWalkHelper.IsInheritanceNode(parentFCE, dp, /*out inheritanceBehavior*/inheritanceBehaviorOut); 
                    } 
                    
                	inheritanceBehavior = inheritanceBehaviorOut.inheritanceBehavior;

                    // If the current node has SkipNow semantics then we do 
                    // not need to lookup the inheritable value on it.
                    if (TreeWalkHelper.SkipNow(inheritanceBehavior))
                    {
                        break; 
                    }
 
                    // Check if node is an inheritance node, if so, query it 
                    if (inheritanceNode)
                    { 
                        /*DependencyObject*/var parentDO = parentFE;
                        if (parentDO == null)
                        { 
                            parentDO = parentFCE;
                        } 
 
                        /*EntryIndex*/var entryIndex = parentDO.LookupEntry(dp.GlobalIndex);
 
                        return parentDO.GetValueEntry(
                                        entryIndex,
                                        dp,
                                        fmetadata, 
                                        RequestFlags.SkipDefault | RequestFlags.DeferredReferences).Value;
                    } 
 
                    // If the current node has SkipNext semantics then we do
                    // not need to lookup the inheritable value on its parent. 
                    if (TreeWalkHelper.SkipNext(inheritanceBehavior))
                    {
                        break;
                    } 

                    // No boundary or inheritance node found, continue search 
                    if (parentFE != null) 
                    {
                        hasParent = FrameworkElement.GetFrameworkParent1(parentFE, /*out parentFE*/parentFEOut, /*out parentFCE*/parentFCEOut); 
                    }
                    else
                    {
                        hasParent = FrameworkElement.GetFrameworkParent1(parentFCE, /*out parentFE*/parentFEOut, /*out parentFCE*/parentFCEOut); 
                    }
                } 
            } 

            // Didn't find this value anywhere in the framework tree parent chain, 
            //  or search was aborted when we hit a tree boundary node.
            return DependencyProperty.UnsetValue;
        },
 
        // Like GetValueCore, except it returns the expression (if any) instead of its value
//        internal Expression 
        GetExpressionCore:function(/*DependencyProperty*/ dp, /*PropertyMetadata*/ metadata) 
        { 
            this.IsRequestingExpression = true;
            /*EffectiveValueEntry*/var entry = new EffectiveValueEntry(dp); 
            entry.Value = DependencyProperty.UnsetValue;
            
            var entryRef = {
            	"entry" : entry	
            };
            this.EvaluateBaseValueCore(dp, metadata, /*ref entry*/entryRef);
            entry = entryRef.entry;
            this.IsRequestingExpression = false;
 
            return entry.Value instanceof Expression ? entry.Value : null;
        }, 
 
        /// <summary>
        ///     Notification that a specified property has been changed 
        /// </summary>
        /// <param name="e">EventArgs that contains the property, metadata, old value, and new value for this change</param>
//        protected override void 
        OnPropertyChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
            /*DependencyProperty*/var dp = e.Property;
 
//            base.OnPropertyChanged(e); 
            UIElement.prototype.OnPropertyChanged.call(this, e); 

            if (e.IsAValueChange || e.IsASubPropertyChange) 
            {
                //
                // Try to fire the Loaded event on the root of the tree
                // because for this case the OnParentChanged will not 
                // have a chance to fire the Loaded event.
                // 
                if (dp != null /*&& dp.OwnerType == typeof(PresentationSource)*/ && dp.Name == "RootSource") 
                {
                    this.TryFireInitialized(); 
                }

//                if (dp == FrameworkElement.NameProperty &&
//                    EventTrace.IsEnabled(EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose)) 
//                {
//                    EventTrace.EventProvider.TraceEvent(EventTrace.Event.PerfElementIDName, EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose, 
//                            PerfService.GetPerfElementID(this), GetType().Name, GetValue(dp)); 
//                }
 
                //
                // Invalidation propagation for Styles
                //
 
                // Regardless of metadata, the Style/Template/DefaultStyleKey properties are never a trigger drivers
//                if (dp != FrameworkElement.StyleProperty && dp != Control.TemplateProperty &&
//                		dp != FrameworkElement.DefaultStyleKeyProperty) 
//                { 
                if (dp != FrameworkElement.StyleProperty && dp != EnsureControl().TemplateProperty &&
                		dp != FrameworkElement.DefaultStyleKeyProperty) 
                { 
                    // Note even properties on non-container nodes within a template could be driving a trigger
                    if (this.TemplatedParent != null) 
                    {
//                        FrameworkElement 
                        var feTemplatedParent = this.TemplatedParent instanceof FrameworkElement ? this.TemplatedParent : null;

                        /*FrameworkTemplate*/
                        var frameworkTemplate = feTemplatedParent.TemplateInternal; 
                        if (frameworkTemplate != null)
                        { 
                        	StyleHelper.OnTriggerSourcePropertyInvalidated(null, frameworkTemplate, this.TemplatedParent, dp, e, false /*invalidateOnlyContainer*/, 
                                /*ref*/ frameworkTemplate.TriggerSourceRecordFromChildIndex, 
                                /*ref*/ frameworkTemplate.PropertyTriggersWithActions,
                            		 this.TemplateChildIndex /*sourceChildIndex*/);
                        } 
                    }

                    // Do not validate Style during an invalidation if the Style was
                    // never used before (dependents do not need invalidation) 
                    if (this.Style != null)
                    { 
                    	StyleHelper.OnTriggerSourcePropertyInvalidated(this.Style, null, this, dp, e, true /*invalidateOnlyContainer*/, 
                            /*ref*/ this.Style.TriggerSourceRecordFromChildIndex, 
                            /*ref*/this.Style.PropertyTriggersWithActions,
                        		 0 /*sourceChildIndex*/); // Style can only have triggers that are driven by properties on the container
                    } 

                    // Do not validate Template during an invalidation if the Template was
                    // never used before (dependents do not need invalidation)
                    if (this.TemplateInternal != null) 
                    {
                    	StyleHelper.OnTriggerSourcePropertyInvalidated(null, this.TemplateInternal, this, dp, e, !this.HasTemplateGeneratedSubTree /*invalidateOnlyContainer*/, 
                            /*ref*/ this.TemplateInternal.TriggerSourceRecordFromChildIndex, 
                            /*ref*/ this.TemplateInternal.PropertyTriggersWithActions, 
                            0 /*sourceChildIndex*/); // These are driven by the container 
                    }
 
                    // There may be container dependents in the ThemeStyle. Invalidate them.
                    if (this.ThemeStyle != null && this.Style != this.ThemeStyle)
                    {
                    	StyleHelper.OnTriggerSourcePropertyInvalidated(this.ThemeStyle, null, this, dp, e, true /*invalidateOnlyContainer*/, 
                            /*ref*/ this.ThemeStyle.TriggerSourceRecordFromChildIndex,
                            /*ref*/ this.ThemeStyle.PropertyTriggersWithActions, 
                            0 /*sourceChildIndex*/); // ThemeStyle can only have triggers that are driven by properties on the container
                    }
                } 
            }
 
            /*FrameworkPropertyMetadata*/ 
            var fmetadata = e.Metadata instanceof FrameworkPropertyMetadata ? e.Metadata : null;

            //
            // Invalidation propagation for Groups and Inheritance 
            //
 
            // Metadata must exist specifically stating propagate invalidation 
            // due to group or inheritance
            if (fmetadata != null) 
            {
                //
                // Inheritance
                // 
                if (fmetadata.Inherits) 
                { 
                    // Invalidate Inheritable descendents only if instance is not a TreeSeparator
                    // or fmetadata.OverridesInheritanceBehavior is set to override separated tree behavior 
                    if ((this.InheritanceBehavior == InheritanceBehavior.Default || fmetadata.OverridesInheritanceBehavior) &&
                        (!DependencyObject.IsTreeWalkOperation(e.OperationType) || this.PotentiallyHasMentees))
                    {
                        /*EffectiveValueEntry*/
                    	var newEntry = e.NewEntry; 
                        /*EffectiveValueEntry*/
                        var oldEntry = e.OldEntry;
                        if (oldEntry.BaseValueSourceInternal > newEntry.BaseValueSourceInternal) 
                        { 
                            // valuesource == Inherited && value == UnsetValue indicates that we are clearing the inherited value
                            newEntry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Inherited); 
                        }
                        else
                        {
                            newEntry = newEntry.GetFlattenedEntry(RequestFlags.FullyResolved); 
                            newEntry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited;
                        } 
 
                        if (oldEntry.BaseValueSourceInternal != BaseValueSourceInternal.Default || oldEntry.HasModifiers)
                        { 
                            oldEntry = oldEntry.GetFlattenedEntry(RequestFlags.FullyResolved);
                            oldEntry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited;
                        }
                        else 
                        {
                            // we use an empty EffectiveValueEntry as a signal that the old entry was the default value 
                            oldEntry = new EffectiveValueEntry(); 
                        }
 
                        /*InheritablePropertyChangeInfo*/
                        var info =
                                new InheritablePropertyChangeInfo(
                                        this,
                                        dp, 
                                        oldEntry,
                                        newEntry); 
 
                        // Don't InvalidateTree if we're in the middle of doing it.
                        if (!DependencyObject.IsTreeWalkOperation(e.OperationType)) 
                        {
                            TreeWalkHelper.InvalidateOnInheritablePropertyChange(this, null, info, true);
                        }
 
                        // Notify mentees if they exist
                        if (this.PotentiallyHasMentees) 
                        { 
                            TreeWalkHelper.OnInheritedPropertyChanged(this, info/*ref info*/, InheritanceBehavior);
                        } 
                    }
                }

                if (e.IsAValueChange || e.IsASubPropertyChange) 
                {
                    // 
                    // Layout invalidation 
                    //
 
                    // Skip if we're traversing an Visibility=Collapsed subtree while
                    //  in the middle of an invalidation storm due to ancestor change
                    if( !(this.AncestorChangeInProgress && this.InVisibilityCollapsedTree) )
                    { 
                        /*UIElement*/var layoutParent = null;
 
                        /*bool*/var affectsParentMeasure = fmetadata.AffectsParentMeasure; 
                        /*bool*/var affectsParentArrange = fmetadata.AffectsParentArrange;
                        /*bool*/var affectsMeasure = fmetadata.AffectsMeasure; 
                        /*bool*/var affectsArrange = fmetadata.AffectsArrange;
                        if (affectsMeasure || affectsArrange || affectsParentArrange || affectsParentMeasure)
                        {
                        	var v = VisualTreeHelper.GetParent(this);
                            // Locate nearest Layout parent 
                            for (/*Visual*/ v instanceof Visual ? v : null;
                                 v != null; 
                                 v = VisualTreeHelper.GetParent(v)/* as Visual*/) 
                            {
                                layoutParent = v instanceof UIElement ? v : null; 
                                if (layoutParent != null)
                                {
                                    //let incrementally-updating FrameworkElements to mark the vicinity of the affected child
                                    //to perform partial update. 
                                    if(FrameworkElement.DType.IsInstanceOfType(layoutParent))
                                        layoutParent.ParentLayoutInvalidated(this); 
 
                                    if (affectsParentMeasure)
                                    { 
                                        layoutParent.InvalidateMeasure();
                                    }

                                    if (affectsParentArrange) 
                                    {
                                        layoutParent.InvalidateArrange(); 
                                    } 

                                    break; 
                                }
                            }
                        }
 
                        if (fmetadata.AffectsMeasure)
                        { 
                            // 
                            if (!this.BypassLayoutPolicies || !((dp == FrameworkElement.WidthProperty) || (dp == FrameworkElement.HeightProperty)))
                            {
                            	this.InvalidateMeasure(); 
                            }
                        } 
 
                        if (fmetadata.AffectsArrange)
                        { 
                        	this.InvalidateArrange();
                        	
                            //cym added
                        	if(!String.IsNullOrEmpty(e.NewValue)){
                        		this._dom.setAttribute(dp._domProp, e.NewValue);
                        	}else{
                        		this._dom.removeAttribute(dp._domProp);
                        	}
                        }

                        if (fmetadata.AffectsRender && 
                            (e.IsAValueChange || !fmetadata.SubPropertiesDoNotAffectRender))
                        { 
                        	this.InvalidateVisual(); 
                        	
                            //cym added
                        	if(!String.IsNullOrEmpty(e.NewValue)){
                        		this._dom.style.setProperty(dp._cssName, e.NewValue);
                        	}else{
                        		this._dom.style.setProperty(dp._cssName, "");
                        	}
                        }
                    } 
                }
            }
        },
 
        /// <summary>
        ///     Return the text that represents this object, from the User's perspective. 
        /// </summary>
        /// <returns></returns>
//        internal virtual string 
        GetPlainText:function()
        { 
            return null;
        }, 

//        internal virtual void 
        pushTextRenderingMode:function()
        {
            // 
            // TextRenderingMode is inherited both in the UIElement tree and the graphics tree.
            // This means we don't need to set VisualTextRenderingMode on every single node, we only 
            // want to set it on a Visual when it is explicitly set, or set in a manner other than inheritance. 
            // The sole exception to this is PopupRoot, which needs to propagate the value to its Visual, because
            // the graphics tree does not inherit across CompositionTarget boundaries. 
            //
            /*System.Windows.ValueSource*/
        	var vs = DependencyPropertyHelper.GetValueSource(this, TextOptions.TextRenderingModeProperty);
            if (vs.BaseValueSource > BaseValueSource.Inherited)
            { 
                base.VisualTextRenderingMode = TextOptions.GetTextRenderingMode(this);
            } 
        }, 

        /// <summary> 
        ///     Invoked when ancestor is changed.  This is invoked after 
        ///     the ancestor has changed, and the purpose is to allow elements to
        ///     perform actions based on the changed ancestor. 
        /// </summary>
        //CASRemoval:[StrongNameIdentityPermissionAttribute(SecurityAction.InheritanceDemand, PublicKey=Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)]
//        internal virtual void 
        OnAncestorChanged:function()
        { 
        },
 
        /// <summary> 
        /// OnVisualParentChanged is called when the parent of the Visual is changed.
        /// </summary> 
        /// <param name="oldParent">Old parent or null if the Visual did not have a parent before.</param>
//        protected internal override void 
        OnVisualParentChanged:function(/*DependencyObject*/ oldParent)
        {
            /*DependencyObject*/var newParent = VisualTreeHelper.GetParentInternal(this); 

            // Visual parent implies no InheritanceContext 
            if (newParent != null) 
            {
                this.ClearInheritanceContext(); 
            }

            // Update HasLoadedChangeHandler Flag
            BroadcastEventHelper.AddOrRemoveHasLoadedChangeHandlerFlag(this, oldParent, newParent); 

            // Fire Loaded and Unloaded Events 
            BroadcastEventHelper.BroadcastLoadedOrUnloadedEvent(this, oldParent, newParent); 

            if (newParent != null && (newParent instanceof FrameworkElement) == false) 
            {
                // If you are being connected to a non-FE parent then start listening for VisualAncestor
                // changes because otherwise you won't know about changes happening above you
                /*Visual*/var newParentAsVisual = newParent instanceof Visual ? newParent : null; 
                if (newParentAsVisual != null)
                { 
                    newParentAsVisual.VisualAncestorChanged += new AncestorChangedEventHandler(OnVisualAncestorChanged); 
                }
            } 
            else if (oldParent != null && (oldParent instanceof FrameworkElement) == false)
            { 
                // If you are being disconnected from a non-FE parent then stop listening for 
                // VisualAncestor changes
                /*Visual*/var oldParentAsVisual = oldParent instanceof Visual ? oldParent : null; 
                if (oldParentAsVisual != null)
                {
                    oldParentAsVisual.VisualAncestorChanged -= new AncestorChangedEventHandler(OnVisualAncestorChanged);
                } 
            } 

            // Do it only if you do not have a logical parent
            if (this.Parent == null)
            { 
                // Invalidate relevant properties for this subtree
                /*DependencyObject*/var parent = (newParent != null) ? newParent : oldParent; 
                TreeWalkHelper.InvalidateOnTreeChange(this, null, parent, (newParent != null)); 
            }
 
            // Initialize, if not already done.

            // Note that it is for performance reasons that we TryFireInitialize after
            // we have done InvalidateOnTreeChange. This is because InvalidateOnTreeChange 
            // invalidates the style property conditionally if the object has been initialized.
            // And OnInitialized also invalidates the style property. If we were to do these 
            // operations in the reverse order we would be invalidating the style property twice. 
            // Whereas now we do it only once.
 
            this.TryFireInitialized();

            UIElement.prototype.OnVisualParentChanged.call(this, oldParent);
        }, 

//        internal new void 
        OnVisualAncestorChanged:function(/*object*/ sender, /*AncestorChangedEventArgs*/ e) 
        { 
            // NOTE:
            // 
            // We are forced to listen to AncestorChanged events because a FrameworkElement
            // may have raw Visuals/UIElements between it and its nearest FrameworkElement
            // parent.  We only care about changes that happen to the visual tree BETWEEN
            // this FrameworkElement and its nearest FrameworkElement parent.  This is 
            // because we can rely on our nearest FrameworkElement parent to notify us
            // when its loaded state changes. 
 

        	var feParentOut = {
        		"fe" : null
        	};
        	
           	var fceParentOut = {
            		"fce" : null
            	};
            // Find our nearest FrameworkElement parent.
            FrameworkElement.GetContainingFrameworkElement(VisualTreeHelper.GetParent(this), feParentOut/*out feParent*/, fceParentOut/*out fceParent*/);
//            Debug.Assert(fceParent == null, "Nearest framework parent via the visual tree has to be an FE. It cannot be an FCE"); 
            /*FrameworkElement*/var feParent = feParentOut.fe;
            /*FrameworkContentElement*/var fceParent = fceParentOut.fce; 

            if(e.OldParent == null) 
            { 
                // We were plugged into something.
 
                // See if this parent is a child of the ancestor who's parent changed.
                // If so, we don't care about changes that happen above us.
                if(feParent == null || !VisualTreeHelper.IsAncestorOf(e.Ancestor, feParent))
                { 
                    // Update HasLoadedChangeHandler Flag
                    BroadcastEventHelper.AddOrRemoveHasLoadedChangeHandlerFlag(this, null, VisualTreeHelper.GetParent(e.Ancestor)); 
 
                    // Fire Loaded and Unloaded Events
                    BroadcastEventHelper.BroadcastLoadedOrUnloadedEvent(this, null, VisualTreeHelper.GetParent(e.Ancestor)); 
                }
            }
            else
            { 
                // we were unplugged from something.
 
                // If we found a FrameworkElement parent in our subtree, the 
                // break in the visual tree must have been above it,
                // so we don't need to respond. 

                if(feParent == null)
                {
                    // There was no FrameworkElement parent in our subtree, so we 
                    // may be detaching from some FrameworkElement parent above
                    // the break point in the tree. 
                    FrameworkElement.GetContainingFrameworkElement(e.OldParent, feParentOut/*out feParent*/, fceParentOut/*out fceParent*/); 
                    feParent = feParentOut.fe;
                    fceParent = fceParentOut.fce; 
                    if(feParent != null) 
                    {
                        // Update HasLoadedChangeHandler Flag
                        BroadcastEventHelper.AddOrRemoveHasLoadedChangeHandlerFlag(this, feParent, null);
 
                        // Fire Loaded and Unloaded Events
                        BroadcastEventHelper.BroadcastLoadedOrUnloadedEvent(this, feParent, null); 
                    } 
                }
            } 
        },
 

        /// <summary> 
        /// Get the BindingExpression for the given property
        /// </summary>
        /// <param name="dp">DependencyProperty that represents the property</param>
        /// <returns> BindingExpression if property is data-bound, null if it is not</returns> 
//        public BindingExpression 
        GetBindingExpression:function(/*DependencyProperty*/ dp)
        { 
            return BindingOperations.GetBindingExpression(this, dp); 
        },
 
//        /// <summary>
//        /// Attach a data Binding to the property
//        /// </summary>
//        /// <param name="dp">DependencyProperty that represents the property</param> 
//        /// <param name="binding">description of Binding to attach</param>
////        public BindingExpressionBase 
//        SetBinding:function(/*DependencyProperty*/ dp, /*BindingBase*/ binding) 
//        { 
//            return BindingOperations.SetBinding(this, dp, binding);
//        }, 
//
//        /// <summary>
//        /// Convenience method.  Create a BindingExpression and attach it.
//        /// Most fields of the BindingExpression get default values. 
//        /// </summary>
//        /// <param name="dp">DependencyProperty that represents the property</param> 
//        /// <param name="path">source path</param> 
////        public BindingExpression 
//        SetBinding:function(/*DependencyProperty*/ dp, /*string*/ path)
//        { 
//            return (BindingExpression)SetBinding(dp, new Binding(path));
//        },
        
        SetBinding:function(/*DependencyProperty*/ dp, obj/*BindingBase binding or string path*/) 
        { 
        	if((typeof obj) == "string"){
        		obj = new Binding(path);
        	}
            return BindingOperations.SetBinding(this, dp, obj);
        }, 

        /// <returns>
        ///     Returns a non-null value when some framework implementation 
        ///     of this method has a non-visual parent connection,
        /// </returns> 
//        protected internal override DependencyObject 
        GetUIParentCore:function() 
        {
            // Note: this only follows one logical link. 
            return this._parent1;
        },

        /// <summary> 
        ///     Allows adjustment to the event source
        /// </summary> 
        /// <remarks> 
        ///     Subclasses must override this method
        ///     to be able to adjust the source during 
        ///     route invocation <para/>
        ///
        ///     NOTE: Expected to return null when no
        ///     change is made to source 
        /// </remarks>
        /// <param name="args"> 
        ///     Routed Event Args 
        /// </param>
        /// <returns> 
        ///     Returns new source
        /// </returns>
//        internal override object 
        AdjustEventSource:function(/*RoutedEventArgs*/ args)
        { 
            /*object*/var source = null;
 
            // As part of routing events through logical trees, we have 
            // to be careful about events that come to us from "foreign"
            // trees.  For example, the event could come from an element 
            // in our "implementation" visual tree, or from an element
            // in a different logical tree all together.
            //
            // Note that we consider ourselves to be part of a logical tree 
            // if we have either a logical parent, or any logical children.
            // 
            // 

            if(this._parent1 != null || this.HasLogicalChildren) 
            {
                /*DependencyObject*/var logicalSource = args.Source instanceof DependencyObject ? args.Source : null;
                if(logicalSource == null || !this.IsLogicalDescendent(logicalSource))
                { 
                    args.Source=this;
                    source = this; 
                } 
            }
 
            return source;
        },

        // Allows adjustments to the branch source popped off the stack 
//        internal virtual void 
        AdjustBranchSource:function(/*RoutedEventArgs*/ args)
        { 
        }, 

        /// <summary> 
        ///     Allows FrameworkElement to augment the
        ///     <see cref="EventRoute"/>
        /// </summary>
        /// <remarks> 
        ///     NOTE: If this instance does not have a
        ///     visualParent but has a model parent 
        ///     then route is built through the model 
        ///     parent
        /// </remarks> 
        /// <param name="route">
        ///     The <see cref="EventRoute"/> to be
        ///     augmented
        /// </param> 
        /// <param name="args">
        ///     <see cref="RoutedEventArgs"/> for the 
        ///     RoutedEvent to be raised post building 
        ///     the route
        /// </param> 
        /// <returns>
        ///     Whether or not the route should continue past the visual tree.
        ///     If this is true, and there are no more visual parents, the route
        ///     building code will call the GetUIParentCore method to find the 
        ///     next non-visual parent.
        /// </returns> 
//        internal override bool 
        BuildRouteCore:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args) 
        {
            return this.BuildRouteCoreHelper(route, args, true); 
        },
//        internal bool 
        BuildRouteCoreHelper:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args, /*bool*/ shouldAddIntermediateElementsToRoute)
        {
            var continuePastCoreTree = false; 

            /*DependencyObject*/var visualParent = VisualTreeHelper.GetParent(this); 
            /*DependencyObject*/var modelParent = this.GetUIParentCore(); 

            // FrameworkElement extends the basic event routing strategy by 
            // introducing the concept of a logical tree.  When an event
            // passes through an element in a logical tree, the source of
            // the event needs to change to the leaf-most node in the same
            // logical tree that is in the route. 

            // Check the route to see if we are returning into a logical tree 
            // that we left before.  If so, restore the source of the event to 
            // be the source that it was when we left the logical tree.
            /*DependencyObject*/var branchNode = route.PeekBranchNode() instanceof DependencyObject ? route.PeekBranchNode() : null; 
            if (branchNode != null && this.IsLogicalDescendent(branchNode))
            {
                // We keep the most recent source in the event args.  Note that
                // this is only for our consumption.  Once the event is raised, 
                // it will use the source information in the route.
                args.Source=route.PeekBranchSource(); 
 
                this.AdjustBranchSource(args);
 
                route.AddSource(args.Source);

                // By popping the branch node we will also be setting the source
                // in the event route. 
                route.PopBranchNode();
 
                // Add intermediate ContentElements to the route 
                if (shouldAddIntermediateElementsToRoute)
                { 
                    FrameworkElement.AddIntermediateElementsToRoute(this, route, args, LogicalTreeHelper.GetParent(branchNode));
                }
            }
 

            // Check if the next element in the route is in a different 
            // logical tree. 

            if (!this.IgnoreModelParentBuildRoute(args)) 
            {
                // If there is no visual parent, route via the model tree.
                if (visualParent == null)
                { 
                    continuePastCoreTree = modelParent != null;
                } 
                else if(modelParent != null) 
                {
                    var visualParentAsVisual = visualParent instanceof Visual ? visualParent : null; 
                    if (visualParentAsVisual != null)
                    {
                        if (visualParentAsVisual.CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot))
                        { 
                            continuePastCoreTree = true;
                        } 
                    } 
 
                    // If there is a model parent, record the branch node. 
                    route.PushBranchNode(this, args.Source);
 
                    // The source is going to be the visual parent, which
                    // could live in a different logical tree.
                    args.Source=visualParent;
                } 
            }
 
            return continuePastCoreTree; 
        },
 
        /// <summary>
        ///     Add Style TargetType and FEF EventHandlers to the EventRoute
        /// </summary>
//        internal override void 
        AddToEventRouteCore:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args) 
        {
        	FrameworkElement.AddStyleHandlersToEventRoute(this, null, route, args); 
        }, 
 
        //CASRemoval:[StrongNameIdentityPermissionAttribute(SecurityAction.InheritanceDemand, PublicKey=Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)]
//        internal virtual bool 
        IgnoreModelParentBuildRoute:function(/*RoutedEventArgs*/ args) 
        {
            return false;
        },
 
//        internal override bool 
        InvalidateAutomationAncestorsCore:function(/*Stack<DependencyObject> */branchNodeStack, continuePastCoreTreeOut/*out bool continuePastCoreTree*/)
        { 
            var shouldInvalidateIntermediateElements = true; 
            return InvalidateAutomationAncestorsCoreHelper(branchNodeStack, 
            		continuePastCoreTreeOut/*out continuePastCoreTree*/, shouldInvalidateIntermediateElements);
        }, 

//        internal bool 
        InvalidateAutomationAncestorsCoreHelper:function(/*Stack<DependencyObject>*/ branchNodeStack, 
        		/*out bool continuePastCoreTree*/continuePastCoreTreeOut, /*bool*/ shouldInvalidateIntermediateElements)
        {
            var continueInvalidation = true; 
            continuePastCoreTreeOut.continuePastCoreTree = false;
 
            /*DependencyObject*/var visualParent = VisualTreeHelper.GetParent(this); 
            /*DependencyObject*/var modelParent = GetUIParentCore();
 
            /*DependencyObject*/var branchNode = branchNodeStack.Count > 0 ? branchNodeStack.Peek() : null;
            if (branchNode != null && this.IsLogicalDescendent(branchNode))
            {
                branchNodeStack.Pop(); 

                if (shouldInvalidateIntermediateElements) 
                { 
                    continueInvalidation = FrameworkElement.InvalidateAutomationIntermediateElements(this, LogicalTreeHelper.GetParent(branchNode));
                } 
            }

            // If there is no visual parent, route via the model tree.
            if (visualParent == null) 
            {
            	continuePastCoreTreeOut.continuePastCoreTree = modelParent != null; 
            } 
            else if(modelParent != null)
            { 
                var visualParentAsVisual = visualParent instanceof Visual ? visualParent : null;
                if (visualParentAsVisual != null)
                {
                    if (visualParentAsVisual.CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot)) 
                    {
                    	continuePastCoreTreeOut.continuePastCoreTree = true; 
                    } 
                }
 
                // If there is a model parent, record the branch node.
                branchNodeStack.Push(this); 
            }

            return continueInvalidation;
        }, 

        /// <summary> 
        /// Attempts to bring this element into view by originating a RequestBringIntoView event.
        /// </summary> 
////        public void 
//        BringIntoView:function() 
//        {
//            //dmitryt, bug 1126518. On new/updated elements RenderSize isn't yet computed 
//            //so we need to postpone the rect computation until layout is done.
//            //this is accomplished by passing Empty rect here and then asking for RenderSize
//            //in IScrollInfo when it actually executes an async MakeVisible command.
//            this.BringIntoView( /*RenderSize*/ Rect.Empty); 
//        },
 
        /// <summary> 
        /// Attempts to bring the given rectangle of this element into view by originating a RequestBringIntoView event.
        /// </summary> 
//        public void 
        BringIntoView:function(/*Rect*/ targetRectangle)
        {
        	if(targetRectangle === undefined){
        		targetRectangle = Rect.Empty;
        	}
            /*RequestBringIntoViewEventArgs*/
        	var args = new RequestBringIntoViewEventArgs(this, targetRectangle);
            args.RoutedEvent=RequestBringIntoViewEvent; 
            this.RaiseEvent(args);
        }, 

        /// <summary> 
        /// Override for <seealso cref="UIElement.MeasureCore" />.
        /// </summary> 
//        protected sealed override Size 
        MeasureCore:function() 
        {
            //build the visual tree from styles first
            this.ApplyTemplate(); 
            return  this.MeasureOverride();
        },

        /// <summary>
        /// Override for <seealso cref="UIElement.ArrangeCore" />. 
        /// </summary>
//        protected sealed override void 
        ArrangeCore:function(/*DOMElement*/ parent) 
        { 
            this.ArrangeOverride(parent); 
        },

        /// <summary>
        /// Measurement override. Implement your size-to-content logic here. 
        /// </summary>
        /// <remarks>
        /// MeasureOverride is designed to be the main customizability point for size control of layout.
        /// Element authors should override this method, call Measure on each child element, 
        /// and compute their desired size based upon the measurement of the children.
        /// The return value should be the desired size.<para/> 
        /// Note: It is required that a parent element calls Measure on each child or they won't be sized/arranged. 
        /// Typical override follows a pattern roughly like this (pseudo-code):
        /// <example> 
        ///     <code lang="C#">
        /// <![CDATA[
        ///
        /// protected override Size MeasureOverride(Size availableSize) 
        /// {
        ///     foreach (UIElement child in VisualChildren) 
        ///     { 
        ///         child.Measure(availableSize);
        ///         availableSize.Deflate(child.DesiredSize); 
        ///     }
        ///
        ///     Size desired = ... compute sum of children's DesiredSize ...;
        ///     return desired; 
        /// }
        /// ]]> 
        ///     </code> 
        /// </example>
        /// The key aspects of this snippet are: 
        ///     <list type="bullet">
        /// <item>You must call Measure on each child element</item>
        /// <item>It is common to cache measurement information between the MeasureOverride and ArrangeOverride method calls</item>
        /// <item>Calling base.MeasureOverride is not required.</item> 
        /// <item>Calls to Measure on children are passing either the same availableSize as the parent, or a subset of the area depending
        /// on the type of layout the parent will perform (for example, it would be valid to remove the area 
        /// for some border or padding).</item> 
        ///     </list>
        /// </remarks> 
        /// <param name="availableSize">Available size that parent can give to the child. May be infinity (when parent wants to
        /// measure to content). This is soft constraint. Child can return bigger size to indicate that it wants bigger space and hope
        /// that parent can throw in scrolling...</param>
        /// <returns>Desired Size of the control, given available size passed as parameter.</returns> 
//        protected virtual Size 
        MeasureOverride:function()
        { 
        },
 
        /// <summary>
        /// ArrangeOverride allows for the customization of the positioning of children.
        /// </summary>
        /// <remarks> 
        /// Element authors should override this method, call Arrange on each visible child element,
        /// passing final size for each child element via finalSize parameter. 
        /// Note: It is required that a parent element calls Arrange on each child or they won't be rendered. 
        /// Typical override follows a pattern roughly like this (pseudo-code):
        /// </remarks> 
        /// <param name="finalSize">The final size that element should use to arrange itself and its children.</param>
        /// <returns>The size that element actually is going to use for rendering. If this size is not the same as finalSize 
        /// input parameter, the AlignmentX/AlignmentY properties will position the ink rect of the element
        /// appropriately.</returns>
//        protected virtual Size 
        ArrangeOverride:function()
        { 
        }, 
        // Keyboard 
 
        /// <summary>
        ///     Request to move the focus from this element to another element 
        /// </summary>
        /// <param name="request">
        ///     The direction that focus is to move.
        /// </param> 
        /// <returns> Returns true if focus is moved successfully. Returns false if there is no next element</returns>
//        public sealed override bool 
        MoveFocus:function(/*TraversalRequest*/ request) 
        { 
            if (request == null)
            { 
                throw new Error('ArgumentNullException("request")');
            }

            return KeyboardNavigation.Current.Navigate(this, request); 
        },
 
        /// <summary> 
        ///     Request to predict the element that should receive focus relative to this element for a
        /// given direction, without actually moving focus to it. 
        /// </summary>
        /// <param name="direction">The direction for which focus should be predicted</param>
        /// <returns>
        ///     Returns the next element that focus should move to for a given FocusNavigationDirection. 
        /// Returns null if focus cannot be moved relative to this element.
        /// </returns> 
//        public sealed override DependencyObject 
        PredictFocus:function(/*FocusNavigationDirection*/ direction) 
        {
            return KeyboardNavigation.Current.PredictFocusedElement(this, direction); 
        },

        /// <summary>
        ///     This method is invoked when the IsFocused property changes to true
        /// </summary> 
        /// <param name="e">RoutedEventArgs</param>
//        protected override void 
        OnGotFocus:function(/*RoutedEventArgs*/ e) 
        { 
            if (this.IsKeyboardFocused)
            	this.BringIntoView(); 

            UIElement.prototype.OnGotFocus.call(this, e);
        },
 
        /// <summary> 
        ///     Initialization of this element is about to begin
        /// </summary>
//        public virtual void 
        BeginInit:function()
        { 
            // Nested BeginInits on the same instance aren't permittedEvent:function(EventPrivateKey key, EventArgs args)
            if (this.ReadInternalFlag(InternalFlags.InitPending)) 
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.NestedBeginInitNotSupported)');
            } 

            // Mark the element as pending initialization
            this.WriteInternalFlag(InternalFlags.InitPending, true);
        }, 

        /// <summary> 
        ///     Initialization of this element has completed 
        /// </summary>
//        public virtual void 
        EndInit:function() 
        {
            // Every EndInit must be preceeded by a BeginInit
            if (!this.ReadInternalFlag(InternalFlags.InitPending))
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.EndInitWithoutBeginInitNotSupported)');
            } 
 
            // Reset the pending flag
            this.WriteInternalFlag(InternalFlags.InitPending, false); 

            // Mark the element initialized and fire Initialized event
            // (eg. tree building via parser)
            this.TryFireInitialized(); 
        },

        /// <summary> 
        ///     This virtual method in called when IsInitialized is set to true and it raises an Initialized event
        /// </summary>
//        protected virtual void 
        OnInitialized:function(/*EventArgs*/ e)
        { 
            // Need to update the StyleProperty so that we can pickup
            // the implicit style if it hasn't already been fetched 
            if (!this.HasStyleEverBeenFetched) 
            {
            	this.UpdateStyleProperty(); 
            }

            // Need to update the ThemeStyleProperty so that we can pickup
            // the implicit style if it hasn't already been fetched 
            if (!this.HasThemeStyleEverBeenFetched)
            { 
            	this.UpdateThemeStyleProperty(); 
            }
 
            this.RaiseInitialized(FrameworkElement.InitializedKey, e);
        },

        // Helper method that tries to set IsInitialized to true 
        // and Fire the Initialized event
        // This method can be invoked from two locations 
        //      1> EndInit 
        //      2> OnParentChanged
//        private void 
        TryFireInitialized:function() 
        {
            if (!this.ReadInternalFlag(InternalFlags.InitPending) &&
                !this.ReadInternalFlag(InternalFlags.IsInitialized))
            { 
                this.WriteInternalFlag(InternalFlags.IsInitialized, true);
 
                // Do instance initialization outside of the OnInitialized virtual 
                // to make sure that:
                // 1) We avoid attaching instance handlers to FrameworkElement 
                //    (instance handlers are expensive).
                // 2) If a derived class forgets to call base OnInitialized,
                //    this work will still happen.
                this.PrivateInitialized(); 

                this.OnInitialized(EventArgs.Empty); 
            } 
        },
 
        // Helper method to retrieve and fire Clr Event handlers for Initialized event
//        private void 
        RaiseInitialized:function(/*EventPrivateKey*/ key, /*EventArgs*/ e)
        {
            /*EventHandlersStore*/var store = this.EventHandlersStore; 
            if (store != null)
            { 
                /*Delegate*/var handler = store.Get(key); 
                if (handler != null)
                { 
                    handler.Invoke(this, e);
                }
            }
        }, 


        /// <summary>
        ///     Notifies subclass of a new routed event handler.  Note that this is
        ///     called once for each handler added, but OnRemoveHandler is only called 
        ///     on the last removal.
        /// </summary> 
//        internal override void 
        OnAddHandler:function( 
            /*RoutedEvent*/ routedEvent,
            /*Delegate*/ handler) 
        {
//            base.OnAddHandler(routedEvent, handler);

            UIElement.prototype.OnAddHandler.call(this, routedEvent, handler);
            
            if (routedEvent == FrameworkElement.LoadedEvent || routedEvent == FrameworkElement.UnloadedEvent) 
            {
                BroadcastEventHelper.AddHasLoadedChangeHandlerFlagInAncestry(this); 
            } 
        },
 

        /// <summary>
        ///     Notifies subclass of an event for which a handler has been removed.
        /// </summary> 
//        internal override void 
        OnRemoveHandler:function(
            /*RoutedEvent*/ routedEvent, 
            /*Delegate*/ handler) 
        {
//            base.OnRemoveHandler(routedEvent, handler); 
        	UIElement.prototype.OnRemoveHandler.call(this, routedEvent, handler);

            // We only care about Loaded & Unloaded events
            if (routedEvent != FrameworkElement.LoadedEvent && routedEvent != FrameworkElement.UnloadedEvent)
                return; 

            if (!this.ThisHasLoadedChangeEventHandler) 
            { 
                BroadcastEventHelper.RemoveHasLoadedChangeHandlerFlagInAncestry(this);
            } 
        },


        /// <summary> 
        ///     Helper that will set the IsLoaded flag and Raise the Loaded event
        /// </summary> 
//        internal void 
        OnLoaded:function(/*RoutedEventArgs*/ args) 
        {
        	this.RaiseEvent(args); 
        },
        /// <summary>
        ///     Helper that will reset the IsLoaded flag and Raise the Unloaded event 
        /// </summary> 
//        internal void 
        OnUnloaded:function(/*RoutedEventArgs*/ args)
        { 
        	this.RaiseEvent(args);
        },

 
        // Add synchronized input handler for templated parent.
//        internal override void 
        AddSynchronizedInputPreOpportunityHandlerCore:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args) 
        { 
//            /*UIElement*/var uiElement = this._templatedParent instanceof UIElement;
            if (this._templatedParent instanceof  UIElement) 
            {
            	this._templatedParent.AddSynchronizedInputPreOpportunityHandler(route, args);
            }
 
        },
 
 
        // Helper method to retrieve and fire Clr Event handlers
//        internal void 
        RaiseClrEvent:function(/*EventPrivateKey*/ key, /*EventArgs*/ args) 
        {
            /*EventHandlersStore*/var store = this.EventHandlersStore;
            if (store != null)
            { 
                /*Delegate*/var handler = store.Get(key);
                if (handler != null) 
                { 
                	handler.Invoke(this, args);
                } 
            }
        },

        /// <summary> 
        ///     Called when the ToolTipOpening event fires. 
        ///     Allows subclasses to add functionality without having to attach
        ///     an individual handler. 
        /// </summary>
        /// <param name="e">Event arguments</param>
//        protected virtual void 
        OnToolTipOpening:function(/*ToolTipEventArgs*/ e)
        { 
        },

        /// <summary>
        ///     Called when the ToolTipClosing event fires.
        ///     Allows subclasses to add functionality without having to attach 
        ///     an individual handler.
        /// </summary> 
        /// <param name="e">Event arguments</param> 
//        protected virtual void 
        OnToolTipClosing:function(/*ToolTipEventArgs*/ e)
        { 
        },
 
        /// <summary>
        ///     Called when ContextMenuOpening is raised on this element. 
        /// </summary>
        /// <param name="e">Event arguments</param>
//        protected virtual void 
        OnContextMenuOpening:function(/*ContextMenuEventArgs*/ e)
        { 
        },
 
        /// <summary>
        ///     Called when ContextMenuClosing is raised on this element. 
        /// </summary>
        /// <param name="e">Event arguments</param>
//        protected virtual void 
        OnContextMenuClosing:function(/*ContextMenuEventArgs*/ e)
        { 
        },
 
        // Helper method to retrieve and fire Clr Event handlers for DependencyPropertyChanged event
//        private void 
        RaiseDependencyPropertyChanged:function(/*EventPrivateKey*/ key, /*DependencyPropertyChangedEventArgs*/ args)
        { 
            /*EventHandlersStore*/var store = this.EventHandlersStore;
            if (store != null) 
            { 
                /*Delegate*/var handler = store.Get(key);
                if (handler != null) 
                {
                	handler.Invoke(this, args);
                }
            } 
        },

        // Returns if the given child instance is a logical descendent 
//        private bool 
        IsLogicalDescendent:function(/*DependencyObject*/ child)
        { 
            while (child != null) 
            {
                if (child == this) 
                {
                    return true;
                }
 
                child = LogicalTreeHelper.GetParent(child);
            } 
 
            return false;
        }, 

//        internal void 
        EventHandlersStoreAdd:function(/*EventPrivateKey*/ key, /*Delegate*/ handler)
        {
            this.EnsureEventHandlersStore(); 
            this.EventHandlersStore.Add(key, handler);
        }, 
 
//        internal void 
        EventHandlersStoreRemove:function(/*EventPrivateKey*/ key, /*Delegate*/ handler)
        { 
            /*EventHandlersStore*/var store = this.EventHandlersStore;
            if (store != null)
            {
                store.Remove(key, handler); 
            }
        }, 

        // Extracts the required flag and returns
        // bool to indicate if it is set or unset
//        internal bool 
        ReadInternalFlag:function(/*InternalFlags*/ reqFlag) 
        {
            return (this._flags3 & reqFlag) != 0; 
        }, 

//        internal bool 
        ReadInternalFlag2:function(/*InternalFlags2*/ reqFlag) 
        {
            return (this._flags4 & reqFlag) != 0;
        },
 
        // Sets or Unsets the required flag based on
        // the bool argument 
//        internal void 
        WriteInternalFlag:function(/*InternalFlags*/ reqFlag, /*bool*/ set) 
        {
            if (set) 
            {
            	this._flags3 |= reqFlag;
            }
            else 
            {
            	this._flags3 &= (~reqFlag); 
            } 
        },
 
//        internal void 
        WriteInternalFlag2:function(/*InternalFlags2*/ reqFlag, /*bool*/ set)
        {
            if (set)
            { 
            	this._flags4 |= reqFlag;
            } 
            else 
            {
            	this._flags4 &= (~reqFlag); 
            }
        },
        
        /// <summary>
        ///     ResourceReferenceExpressions on non-[FE/FCE] add listeners to this 
        ///     event so they can get notified when there is a ResourcesChange 
        /// </summary>
        /// <remarks> 
        ///     make this pay-for-play by storing handlers
        ///     in EventHandlersStore
        /// </remarks>
//        internal event EventHandler 
//        ResourcesChanged:
//        {
//            add 
//            { 
//                PotentiallyHasMentees = true;
//                EventHandlersStoreAdd(FrameworkElement.ResourcesChangedKey, value); 
//            }
//            remove { EventHandlersStoreRemove(FrameworkElement.ResourcesChangedKey, value); }
//        },
        
        AddResourcesChangedHandler:function(){ 
        	this.PotentiallyHasMentees = true;
        	this.EventHandlersStoreAdd(FrameworkElement.ResourcesChangedKey, value); 
        },
        RemoveResourcesChangedHandler:function(){ 
        	this.EventHandlersStoreRemove(FrameworkElement.ResourcesChangedKey, value); 
        },
        
        /// <summary>
        ///     Mentees add listeners to this 
        ///     event so they can get notified when there is a InheritedPropertyChange
        /// </summary> 
        /// <remarks> 
        ///     make this pay-for-play by storing handlers
        ///     in EventHandlersStore 
        /// </remarks>
//      internal event InheritedPropertyChangedEventHandler 
//      InheritedPropertyChanged:
//        {
//            add 
//            {
//                PotentiallyHasMentees = true; 
//                EventHandlersStoreAdd(FrameworkElement.InheritedPropertyChangedKey, value); 
//            }
//            remove { EventHandlersStoreRemove(FrameworkElement.InheritedPropertyChangedKey, value); } 
//        },
        
        AddInheritedPropertyChangedHandler:function(value){
        	this.PotentiallyHasMentees = true; 
        	this.EventHandlersStoreAdd(FrameworkElement.InheritedPropertyChangedKey, value); 
        },
        RemoveInheritedPropertyChangedHandler:function(value) { 
        	this.EventHandlersStoreRemove(FrameworkElement.InheritedPropertyChangedKey, value); 
        }, 
        
        
        /// <summary> 
        /// Add / Remove TargetUpdatedEvent handler
        /// </summary> 
//        public event EventHandler<DataTransferEventArgs> 
//        TargetUpdated
//        {
//            add     { AddHandler(Binding.TargetUpdatedEvent, value); }
//            remove  { RemoveHandler(Binding.TargetUpdatedEvent, value); } 
//        }
        
        AddTargetUpdatedHanlder:function(value) { this.AddHandler(Binding.TargetUpdatedEvent, value); },
        RemoveTargetUpdatedHanlder:function(value) { this.RemoveHandler(Binding.TargetUpdatedEvent, value); },
 
 
        /// <summary>
        /// Add / Remove SourceUpdatedEvent handler 
        /// </summary>
//        public event EventHandler<DataTransferEventArgs> 
//        SourceUpdated:
//        {
//            add     { AddHandler(Binding.SourceUpdatedEvent, value); } 
//            remove  { RemoveHandler(Binding.SourceUpdatedEvent, value); }
//        }
        
        AddSourceUpdatedHandler:function(value) { this.AddHandler(Binding.SourceUpdatedEvent, value); }, 
        RemoveSourceUpdatedHandler:function(value) { this.RemoveHandler(Binding.SourceUpdatedEvent, value); },
        
        /// <summary> 
        ///     DataContextChanged event
        /// </summary> 
        /// <remarks>
        ///     When an element's DataContext changes, all data-bound properties
        ///     (on this element or any other element) whose Bindings use this
        ///     DataContext will change to reflect the new value.  There is no 
        ///     guarantee made about the order of these changes relative to the
        ///     raising of the DataContextChanged event.  The changes can happen 
        ///     before the event, after the event, or in any mixture. 
        /// </remarks>
//        public /*event*/ DependencyPropertyChangedEventHandler DataContextChanged 
//        {
//            add { EventHandlersStoreAdd(DataContextChangedKey, value); }
//            remove { EventHandlersStoreRemove(DataContextChangedKey, value); }
//        } 
        
        AddDataContextChangedHandler:function(value) { this.EventHandlersStoreAdd(FrameworkElement.DataContextChangedKey, value); },
        RemoveDataContextChangedHandler:function(value) { this.EventHandlersStoreRemove(FrameworkElement.DataContextChangedKey, value); },
        
//        /// <summary> 
//        /// Handler registration for RequestBringIntoView event.
//        /// </summary> 
//        public event RequestBringIntoViewEventHandler RequestBringIntoView 
//        {
//            add { AddHandler(RequestBringIntoViewEvent, value, false); } 
//            remove { RemoveHandler(RequestBringIntoViewEvent, value); }
//        }
        
        AddRequestBringIntoViewHandler:function(value) { this.AddHandler(FrameworkElement.RequestBringIntoViewEvent, value, false); }, 
        RemoveRequestBringIntoViewHandler:function(value) { this.RemoveHandler(FrameworkElement.RequestBringIntoViewEvent, value); },
        
        /// <summary>
        /// SizeChanged event. It is fired when ActualWidth or ActualHeight (or both) changed. 
        /// <see cref="SizeChangedEventArgs">SizeChangedEventArgs</see> parameter contains new and 
        /// old sizes, and flags indicating whether Width or Height actually changed. <para/>
        /// These flags are provided to avoid common mistake of comparing new and old values 
        /// since simple compare of double-precision numbers can yield "not equal" when size in fact
        /// didn't change (round off errors accumulated during input processing and layout calculations
        /// may result in very small differencies that are considered "the same layout").
        /// </summary> 
//        public event SizeChangedEventHandler SizeChanged
//        { 
//            add {this.AddHandler(FrameworkElement.SizeChangedEvent, value, false);} 
//            remove {this.RemoveHandler(FrameworkElement.SizeChangedEvent, value);}
//        } 
        
        AddSizeChangedHandler:function(value) {this.AddHandler(FrameworkElement.SizeChangedEvent, value, false);}, 
        RemoveSizeChangedHandler:function(value) {this.RemoveHandler(FrameworkElement.SizeChangedEvent, value);},
        
        /// <summary> 
        ///     This clr event is fired when 
        ///     <see cref="IsInitialized"/>
        ///     becomes true 
        /// </summary>
//        public event EventHandler Initialized
//        { 
//            add { this.EventHandlersStoreAdd(FrameworkElement.InitializedKey, value); }
//            remove { this.EventHandlersStoreRemove(FrameworkElement.InitializedKey, value); } 
//        }
        AddInitializedHandler:function(value) { this.EventHandlersStoreAdd(FrameworkElement.InitializedKey, value); },
        RemoveInitializedHandler:function(value) { this.EventHandlersStoreRemove(FrameworkElement.InitializedKey, value); }, 
        
        /// <summary>
        ///     This event is fired when the element is laid out, rendered and ready for interaction 
        /// </summary> 
//        public event RoutedEventHandler Loaded
//        { 
//            add
//            {
//            	this.AddHandler(FrameworkElement.LoadedEvent, value, false);
//            } 
//            remove
//            { 
//            	this.RemoveHandler(FrameworkElement.LoadedEvent, value); 
//            }
//        }
        AddLoadedHandler:function(value)
        {
        	this.AddHandler(FrameworkElement.LoadedEvent, value, false);
        }, 
        RemoveLoadedHandler:function(value)
        { 
        	this.RemoveHandler(FrameworkElement.LoadedEvent, value); 
        },
        
        /// <summary>
        ///     This clr event is fired when this element is detached form a loaded tree 
        /// </summary>
//        public event RoutedEventHandler Unloaded
//        {
//            add 
//            {
//            	this.AddHandler(FrameworkElement.UnloadedEvent, value, false); 
//            } 
//            remove
//            { 
//            	this.RemoveHandler(FrameworkElement.UnloadedEvent, value);
//            }
//        }
        AddUnloadedHandler:function(value) 
        {
        	this.AddHandler(FrameworkElement.UnloadedEvent, value, false); 
        }, 
        RemoveUnloadedHandler:function(value)
        { 
        	this.RemoveHandler(FrameworkElement.UnloadedEvent, value);
        },
        
        /// <summary>
        ///     An event that fires just before a ToolTip should be opened.
        ///     This event does not fire if the value of ToolTip is null or unset.
        /// 
        ///     To manually open and close ToolTips, set the value of ToolTip to a non-null value
        ///     and then mark this event as handled. 
        /// 
        ///     To delay loading the actual ToolTip value, set the value of the ToolTip property to
        ///     any value (you can also use it as a tag) and then set the value to the actual value 
        ///     in a handler for this event. Do not mark the event as handled if the system provided
        ///     functionality for showing or hiding the ToolTip is desired.
        /// </summary>
//        public event ToolTipEventHandler ToolTipOpening 
//        {
//            add { this.AddHandler(FrameworkElement.ToolTipOpeningEvent, value); } 
//            remove { this.RemoveHandler(FrameworkElement.ToolTipOpeningEvent, value); } 
//        }
        AddToolTipOpeningHandler:function(value) { this.AddHandler(FrameworkElement.ToolTipOpeningEvent, value); }, 
        RemoveToolTipOpeningHandler:function(value) { this.RemoveHandler(FrameworkElement.ToolTipOpeningEvent, value); }, 
        
        /// <summary>
        ///     An event that fires just before a ToolTip should be closed. 
        ///     This event will only fire if there was a preceding ToolTipOpening event.
        /// 
        ///     To manually close a ToolTip and not use the system behavior, mark this event as handled. 
        /// </summary>
//        public event ToolTipEventHandler ToolTipClosing 
//        {
//            add { this.AddHandler(FrameworkElement.ToolTipClosingEvent, value); }
//            remove { this.RemoveHandler(FrameworkElement.ToolTipClosingEvent, value); }
//        }
        AddToolTipClosingHandler:function(value) { this.AddHandler(FrameworkElement.ToolTipClosingEvent, value); },
        RemoveToolTipClosingHandler:function(value) { this.RemoveHandler(FrameworkElement.ToolTipClosingEvent, value); },
        
        /// <summary>
        ///     An event that fires just before a ContextMenu should be opened. 
        ///
        ///     To manually open and close ContextMenus, mark this event as handled.
        ///     Otherwise, the value of the the ContextMenu property will be used
        ///     to automatically open a ContextMenu. 
        /// </summary>
//        public event ContextMenuEventHandler ContextMenuOpening 
//        { 
//            add { this.AddHandler(FrameworkElement.ContextMenuOpeningEvent, value); }
//            remove { this.RemoveHandler(FrameworkElement.ContextMenuOpeningEvent, value); } 
//        }
        
        AddContextMenuOpeningHandler:function(value) { this.AddHandler(FrameworkElement.ContextMenuOpeningEvent, value); },
        RemoveContextMenuOpeningHandler:function(value) { this.RemoveHandler(FrameworkElement.ContextMenuOpeningEvent, value); },
        
        /// <summary>
        ///     An event that fires just as a ContextMenu closes. 
        /// </summary>
//        public event ContextMenuEventHandler ContextMenuClosing 
//        { 
//            add { this.AddHandler(FrameworkElement.ContextMenuClosingEvent, value); }
//            remove { this.RemoveHandler(FrameworkElement.ContextMenuClosingEvent, value); } 
//        }
        
        AddContextMenuClosingHandler:function(value) { this.AddHandler(FrameworkElement.ContextMenuClosingEvent, value); },
        RemoveContextMenuClosingHandler:function(value) { this.RemoveHandler(FrameworkElement.ContextMenuClosingEvent, value); }, 

	});
	
    var inheritanceBehaviorMask = 
        InternalFlags.InheritanceBehavior0 + 
        InternalFlags.InheritanceBehavior1 +
        InternalFlags.InheritanceBehavior2; 
	
	Object.defineProperties(FrameworkElement.prototype,{
        /// <summary>
        ///     Returns logical parent 
        /// </summary> 
//        public DependencyObject 
        Parent:
        { 
            get:function()
            {
                // Verify Context Access
                // VerifyAccess(); 

                return this.ContextVerifiedGetParent(); 
            } 
        },

        /// <summary>
        ///     Returns enumerator to logical children 
        /// </summary>
//        protected internal virtual IEnumerator 
        LogicalChildren: 
        { 
            get:function() { return null; }
        } ,

 
        /// <summary>
        ///    Check if the current element has a Loaded/Unloaded Change Handler.
        /// </summary>
        /// <remarks> 
        ///    This is called this when a loaded handler element is removed.
        ///  We need to check if the parent should clear or maintain the 
        ///  SubtreeHasLoadedChangeHandler bit.   For example the parent may also 
        ///  have a handler.
        ///    This could be more efficent if it were a bit on the element, 
        ///  set and cleared when the handler or templates state changes.  I expect
        ///  Event Handler state changes less often than element parentage.
        /// </remarks>
//        internal bool 
        ThisHasLoadedChangeEventHandler: 
        {
            get:function() 
            { 
                    if (null != this.EventHandlersStore)
                    { 
                        if (this.EventHandlersStore.Contains(LoadedEvent) || this.EventHandlersStore.Contains(UnloadedEvent))
                        {
                            return true;
                        } 
                    }
                    if(null != this.Style && this.Style.HasLoadedChangeHandler) 
                    { 
                        return true;
                    } 
                    if(null != this.ThemeStyle && this.ThemeStyle.HasLoadedChangeHandler)
                    {
                        return true;
                    } 

                    if(null != this.TemplateInternal && this.TemplateInternal.HasLoadedChangeHandler) 
                    { 
                        return true;
                    } 

                    if(this.HasFefLoadedChangeHandler)
                    {
                        return true; 
                    }
                    return false; 
                } 
        },
 
//        internal bool 
        HasFefLoadedChangeHandler:
        {
            get:function()
            { 
                if(null == this.TemplatedParent)
                { 
                    return false; 
                }
                /*FrameworkElementFactory*/var fefRoot = BroadcastEventHelper.GetFEFTreeRoot(TemplatedParent); 
                if(null == fefRoot)
                {
                    return false;
                } 
                /*FrameworkElementFactory*/var fef = StyleHelper.FindFEF(fefRoot, TemplateChildIndex);
                if(null == fef) 
                { 
                    return false;
                } 
                return fef.HasLoadedChangeHandler;
            }
        },

        // Define the DO's inheritance context
//        internal override DependencyObject 
        InheritanceContext:
        { 
            get:function() { return FrameworkElement.InheritanceContextField.GetValue(this); }
        }, 


        // Indicates if the Style is being re-evaluated 
//        internal bool 
        IsStyleUpdateInProgress:
        { 
            get:function() { return this.ReadInternalFlag(InternalFlags.IsStyleUpdateInProgress); }, 
            set:function(value) { this.WriteInternalFlag(InternalFlags.IsStyleUpdateInProgress, value); }
        }, 

        // Indicates if the ThemeStyle is being re-evaluated
//        internal bool 
        IsThemeStyleUpdateInProgress:
        { 
            get:function() { return this.ReadInternalFlag(InternalFlags.IsThemeStyleUpdateInProgress); },
            set:function(value) { this.WriteInternalFlag(InternalFlags.IsThemeStyleUpdateInProgress, value); } 
        } ,

        // Indicates that we are storing "container template" provided values 
        // on this element -- see StyleHelper.ParentTemplateValuesField
//        internal bool 
        StoresParentTemplateValues:
        {
            get:function() { return this.ReadInternalFlag(InternalFlags.StoresParentTemplateValues); } ,
            set:function(value) { this.WriteInternalFlag(InternalFlags.StoresParentTemplateValues, value); }
        }, 
 
        // Indicates if this instance has had NumberSubstitutionChanged on it
//        internal bool 
        HasNumberSubstitutionChanged:
        {
            get:function() { return this.ReadInternalFlag(InternalFlags.HasNumberSubstitutionChanged); },
            set:function(value) { this.WriteInternalFlag(InternalFlags.HasNumberSubstitutionChanged, value); }
        }, 

        // Indicates if this instance has a tree that 
        // was generated via a Template 
//        internal bool 
        HasTemplateGeneratedSubTree:
        { 
            get:function() { return this.ReadInternalFlag(InternalFlags.HasTemplateGeneratedSubTree); },
            set:function(value) { this.WriteInternalFlag(InternalFlags.HasTemplateGeneratedSubTree, value); }
        },
 
        // Indicates if this instance has an implicit style
//        internal bool 
        HasImplicitStyleFromResources:
        { 
            get:function() { return this.ReadInternalFlag(InternalFlags.HasImplicitStyleFromResources); },
            set:function(value) { this.WriteInternalFlag(InternalFlags.HasImplicitStyleFromResources, value); } 
        },

        // Indicates if there are any implicit styles in the ancestry
//        internal bool 
        ShouldLookupImplicitStyles: 
        {
            get:function() { return this.ReadInternalFlag(InternalFlags.ShouldLookupImplicitStyles); }, 
            set:function(value) { this.WriteInternalFlag(InternalFlags.ShouldLookupImplicitStyles, value); } 
        },
 
        // Indicates if this instance has a style set by a generator
//        internal bool 
        IsStyleSetFromGenerator:
        {
            get:function() { return this.ReadInternalFlag2(InternalFlags2.IsStyleSetFromGenerator); }, 
            set:function(value) { this.WriteInternalFlag2(InternalFlags2.IsStyleSetFromGenerator, value); }
        }, 
 
        // Indicates if the StyleProperty has changed following a UpdateStyleProperty
        // call in OnAncestorChangedInternal 
//        internal bool 
        HasStyleChanged:
        {
            get:function() { return this.ReadInternalFlag2(InternalFlags2.HasStyleChanged); },
            set:function(value) { this.WriteInternalFlag2(InternalFlags2.HasStyleChanged, value); } 
        },
 
 
        // Indicates if the TemplateProperty has changed during a tree walk
//        internal bool 
        HasTemplateChanged: 
        {
            get:function() { return this.ReadInternalFlag2(InternalFlags2.HasTemplateChanged); },
            set:function(value) { this.WriteInternalFlag2(InternalFlags2.HasTemplateChanged, value); }
        }, 

 
        // Indicates if the StyleProperty has been invalidated during a tree walk 
//        internal bool 
        HasStyleInvalidated:
        { 
            get:function() { return this.ReadInternalFlag2(InternalFlags2.HasStyleInvalidated); },
            set:function(value) { this.WriteInternalFlag2(InternalFlags2.HasStyleInvalidated, value); }
        },
 
        // Indicates that the StyleProperty full fetch has been
        // performed atleast once on this node 
//        internal bool 
        HasStyleEverBeenFetched: 
        {
            get:function() { return this.ReadInternalFlag(InternalFlags.HasStyleEverBeenFetched); }, 
            set:function(value) { this.WriteInternalFlag(InternalFlags.HasStyleEverBeenFetched, value); }
        },

        // Indicates that the StyleProperty has been set locally on this element 
//        internal bool 
        HasLocalStyle:
        { 
            get:function() { return this.ReadInternalFlag(InternalFlags.HasLocalStyle); }, 
            set:function(value) { this.WriteInternalFlag(InternalFlags.HasLocalStyle, value); }
        }, 

        // Indicates that the ThemeStyleProperty full fetch has been
        // performed atleast once on this node
//        internal bool 
        HasThemeStyleEverBeenFetched: 
        {
            get:function() { return this.ReadInternalFlag(InternalFlags.HasThemeStyleEverBeenFetched); }, 
            set:function(value) { this.WriteInternalFlag(InternalFlags.HasThemeStyleEverBeenFetched, value); } 
        },
 
        // Indicates that an ancestor change tree walk is progressing
        // through the given node
//        internal bool 
        AncestorChangeInProgress:
        { 
            get:function() { return this.ReadInternalFlag(InternalFlags.AncestorChangeInProgress); },
            set:function(value) { this.WriteInternalFlag(InternalFlags.AncestorChangeInProgress, value); } 
        }, 

        // Stores the inheritable properties that will need to invalidated on the children of this 
        // node.This is a transient cache that is active only during an AncestorChange operation.
//        internal FrugalObjectList<DependencyProperty> 
        InheritableProperties:
        {
            get:function() { return this._inheritableProperties; }, 
            set:function(value) { this._inheritableProperties = value; }
        }, 
 
        // Says if there is a loaded event pending
//        internal object[] 
        LoadedPending:
        {
            get:function() { return  this.GetValue(FrameworkElement.LoadedPendingProperty); }
        },
 
        // Says if there is an unloaded event pending
//        internal object[] 
        UnloadedPending: 
        { 
            get:function() { return this.GetValue(FrameworkElement.UnloadedPendingProperty); }
        }, 

        // Indicates if this instance has multiple inheritance contexts
//        internal override bool 
        HasMultipleInheritanceContexts:
        { 
            get:function() { return this.ReadInternalFlag2(InternalFlags2.HasMultipleInheritanceContexts); }
        }, 
 
        // Indicates if the current element has or had mentees at some point.
//        internal bool 
        PotentiallyHasMentees:
        {
            get:function() { return this.ReadInternalFlag(InternalFlags.PotentiallyHasMentees); },
            set:function(value)
            { 
//                Debug.Assert(value == true,
//                    "This flag is set to true when a mentee attaches a listeners to either the " + 
//                    "InheritedPropertyChanged event or the ResourcesChanged event. It never goes " + 
//                    "back to being false because this would involve counting the remaining listeners " +
//                    "for either of the aforementioned events. This seems like an overkill for the perf " + 
//                    "optimization we are trying to achieve here.");

                this.WriteInternalFlag(InternalFlags.PotentiallyHasMentees, value);
            } 
        },

        /// <summary>
        ///     Style property 
        /// </summary>
//        public Style 
        Style: 
        { 
            get:function() { return this._styleCache; },
            set:function(value) { this.SetValue(FrameworkElement.StyleProperty, value); } 
        },

        /// <summary> 
        ///     This specifies that the current style ignores all 
        ///     properties from the Theme Style
        /// </summary> 
//        public bool 
        OverridesDefaultStyle:
        {
            get:function() { return this.GetValue(FrameworkElement.OverridesDefaultStyleProperty); },
            set:function(value) { this.SetValue(FrameworkElement.OverridesDefaultStyleProperty, value); } 
        },

        /// <summary>
        /// Gets or sets a value indicating whether layout rounding should be applied to this element's size and position during
        /// Measure and Arrange so that it aligns to pixel boundaries. This property is inherited by children. 
        /// </summary>
//        public bool 
        UseLayoutRounding: 
        { 
            get:function() { return this.GetValue(FrameworkElement.UseLayoutRoundingProperty); },
            set:function(value) { this.SetValue(FrameworkElement.UseLayoutRoundingProperty, value); } 
        },

        /// <summary>
        ///     This specifies the key to use to find
        ///     a style in a theme for this control 
        /// </summary>
//        protected internal object 
        DefaultStyleKey: 
        { 
            get:function() { return this.GetValue(FrameworkElement.DefaultStyleKeyProperty); },
            set:function(value) { this.SetValue(FrameworkElement.DefaultStyleKeyProperty, value); } 
        },


        // Cache the ThemeStyle for the current instance if there is a DefaultStyleKey specified for it
//        internal Style 
        ThemeStyle: 
        {
            get:function() { return this._themeStyleCache; } 
        }, 

        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types.
//        internal virtual DependencyObjectType 
        DTypeThemeStyleKey:
        {
            get:function() { return null; } 
        },

        // Internal helper so the FrameworkElement could see the
        // ControlTemplate/DataTemplate set on the 
        // Control/Page/PageFunction/ContentPresenter 
//        internal virtual FrameworkTemplate 
        TemplateInternal:
        { 
            get:function() { return null; }
        },

        // Internal helper so the FrameworkElement could see the 
        // ControlTemplate/DataTemplate set on the
        // Control/Page/PageFunction/ContentPresenter 
//        internal virtual FrameworkTemplate 
        TemplateCache: 
        {
            get:function() { return null; }, 
            set:function(value) {}
        },
 
        /// <summary> 
        ///     Triggers associated with this object.  Both the triggering condition
        /// and the trigger effect may be on this object or on its tree child 
        /// objects.
        /// </summary>
//        public TriggerCollection 
        Triggers: 
        {
            get:function() 
            { 
                /*TriggerCollection*/var triggerCollection = EventTrigger.TriggerCollectionField.GetValue(this);
                if (triggerCollection == null) 
                {
                    // Give the TriggerCollectiona back-link so that it can update
                    // 'this' on Add/Remove.
                    triggerCollection = new TriggerCollection(this); 

                    EventTrigger.TriggerCollectionField.SetValue(this, triggerCollection); 
                } 

                return triggerCollection; 
            }
        },

        /// <summary>
        ///     Reference to the style parent of this node, if any.
        /// </summary> 
        /// <returns>
        ///     Reference to FrameworkElement or FrameworkContentElement 
        ///     whose Template.VisualTree caused this element to be created, 
        ///     null if this does not apply.
        /// </returns> 
//        public DependencyObject 
        TemplatedParent:
        {
            get:function()
            { 
                return this._templatedParent;
            } 
        }, 

        /// <summary> 
        ///     Returns true if this FrameworkElement was created as the root
        ///     node of a Template.VisualTree or if it were the root node of a template.
        /// </summary>
        //     Most people can get this information by comparing this.TemplatedParent 
        // against this.Parent.  However, layout has a need to know this when
        // the tree is not yet hooked up and/or just disconnected. 
        //     This function uses esoteric knowledge of FrameworkElementFactory 
        // and how it is actually used to build visual trees from style.
        // Exposing this property is easier than explaining the ChildIndex magic. 
//        internal bool 
        IsTemplateRoot:
        {
            get:function()
            { 
                return (this.TemplateChildIndex==1);
            } 
        }, 

 
        /// <summary>
        /// Gets or sets the template child of the FrameworkElement.
        /// </summary>
//        virtual internal UIElement 
        TemplateChild: 
        {
            get:function() 
            { 
                return this._templateChild;
            },
            set:function(value)
            {
                if (value != this._templateChild)
                { 
                	this.RemoveVisualChild(this._templateChild);
                	this._templateChild = value; 
                	this.AddVisualChild(value); 
                }
            } 
        },

        /// <summary>
        /// Gets the element that should be used as the StateGroupRoot for VisualStateMangager.GoToState calls 
        /// </summary>
//        internal virtual FrameworkElement 
        StateGroupsRoot: 
        { 
            get:function()
            { 
                return this._templateChild instanceof FrameworkElement ? this._templateChild : null;
            }
        },
 
        /// <summary>
        /// Gets the number of Visual children of this FrameworkElement. 
        /// </summary> 
        /// <remarks>
        /// Derived classes override this property getter to provide the children count 
        /// of their custom children collection.
        /// </remarks>
//        protected override int 
        VisualChildrenCount:
        { 
            get:function()
            { 
                return (this._templateChild == null) ? 0 : 1; 
            }
        }, 
        /// <summary>
        ///     Check if resource is not empty. 
        ///     Call HasResources before accessing resources every time you need 
        ///     to query for a resource.
        /// </summary> 
//        internal bool 
        HasResources:
        {
            get:function()
            { 
                /*ResourceDictionary*/var resources = FrameworkElement.ResourcesField.GetValue(this);
                return (resources != null && 
                        ((resources.Count > 0) || (resources.MergedDictionaries.Count > 0))); 
            }
        }, 

        /// <summary>
        ///     Current locally defined Resources
        /// </summary> 
//        public ResourceDictionary 
        Resources: 
        { 
            get:function()
            { 
                /*ResourceDictionary*/var resources = FrameworkElement.ResourcesField.GetValue(this);
                if (resources == null)
                {
                    resources = new ResourceDictionary(); 
                    resources.AddOwner(this);
                    FrameworkElement.ResourcesField.SetValue(this, resources); 
                }
 
                return resources;

            },
            set:function(value) 
            {
                /*ResourceDictionary*/var oldValue = FrameworkElement.ResourcesField.GetValue(this); 
                FrameworkElement.ResourcesField.SetValue(this, value); 

                if (oldValue != null)
                {
                    // This element is no longer an owner for the old RD 
                    oldValue.RemoveOwner(this);
                } 
 
                if (value != null)
                { 
                    if (!value.ContainsOwner(this))
                    {
                        // This element is an owner for the new RD
                        value.AddOwner(this); 
                    }
                } 
 
                // Invalidate ResourceReference properties for this subtree
                // 
                if (oldValue != value) 
                { 
                    TreeWalkHelper.InvalidateOnResourcesChange(this, null, new ResourcesChangeInfo(oldValue, value));
                } 
            }
        }, 

        /// <summary>
        ///     Indicates the current mode of lookup for both inheritance and resources. 
        /// </summary>
        /// <remarks> 
        ///     Used in property inheritance and reverse 
        ///     inheritance and resource lookup to stop at
        ///     logical tree boundaries 
        ///
        ///     It is also used by designers such as Sparkle to
        ///     skip past the app resources directly to the theme.
        ///     They are expected to merge in the client's app 
        ///     resources via the MergedDictionaries feature on
        ///     root element of the tree. 
        /// 
        ///     NOTE: Property can be set only when the
        ///     instance is not yet hooked to the tree. This 
        ///     is to encourage setting it at construction time.
        ///     If we didn't restrict it to (roughly) construction
        ///     time, we would have to take the complexity of
        ///     firing property invalidations when the flag was 
        ///     changed.
        /// </remarks> 
//        protected internal InheritanceBehavior 
        InheritanceBehavior: 
        {
            get:function()
            {
                var inheritanceBehavior = (this._flags3 & inheritanceBehaviorMask) >> 3;
                return inheritanceBehavior;
            }, 

            set :function(value)
            { 
                if (!this.IsInitialized)
                { 
                    if (value < 0 ||
                        value > InheritanceBehavior.SkipAllNext)
                    {
                        throw new Error('InvalidEnumArgumentException("value", (int)value, typeof(InheritanceBehavior)'); 
                    }
 
                    var inheritanceBehavior = value << 3; 

                    this._flags3 = ((inheritanceBehavior & inheritanceBehaviorMask) | ((this._flags) & ~inheritanceBehaviorMask)); 

                    if (this._parent1 != null)
                    {
                        // This means that we are in the process of xaml parsing: 
                        // an instance of FE has been created and added to a parent,
                        // but no children yet added to it (otherwise it would be initialized already 
                        // and we would not be allowed to change InheritanceBehavior). 
                        // So we need to re-calculate properties accounting for the new
                        // inheritance behavior. 
                        // This must have no performance effect as the subtree of this
                        // element is empty (no children yet added).
                        TreeWalkHelper.InvalidateOnTreeChange(/*fe:*/this, /*fce:*/null, this._parent1, true);
                    } 
                }
                else 
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.Illegal_InheritanceBehaviorSettor)');
                } 
            }
        },

 
        /// <summary> 
        ///     DataContext Property 
        /// </summary>
//        public object 
        DataContext:
        {
            get:function() { return this.GetValue(FrameworkElement.DataContextProperty); }, 
            set:function(value) { this.SetValue(FrameworkElement.DataContextProperty, value); }
        }, 
        /// <summary> 
        ///     BindingGroup Property
        /// </summary> 
//        public BindingGroup 
        BindingGroup:
        { 
            get:function() { return this.GetValue(FrameworkElement.BindingGroupProperty); },
            set:function(value) { this.SetValue(FrameworkElement.BindingGroupProperty, value); } 
        }, 
 
        /// <summary>
        ///     Name property. 
        /// </summary>
//        public string 
        Name:
        { 
            get:function() { return this.GetValue(FrameworkElement.NameProperty); }, 
            set:function(value) { this.SetValue(FrameworkElement.NameProperty, value);  }
        }, 

        /// <summary>
        ///     Tag property. 
        /// </summary>
//        public object 
        Tag: 
        {
            get:function() { return this.GetValue(FrameworkElement.TagProperty); },
            set:function(value) { this.SetValue(FrameworkElement.TagProperty, value); }
        },
        /// <summary> 
        ///     InputScope Property accessor 
        /// </summary>
//        public InputScope 
        InputScope: 
        {
            get:function() { return this.GetValue(FrameworkElement.InputScopeProperty); },
            set:function(value) { this.SetValue(FrameworkElement.InputScopeProperty, value); }
        }, 
 
//        /// <summary>
//        /// The ActualWidth CLR property - wrapper for ActualWidthProperty. 
//        /// Result in 1/96th inch. ("device-independent pixel")
//        /// </summary>
////        public double 
//        ActualWidth:
//        { 
//            get:function()
//            { 
//                return this.RenderSize.Width; 
//            }
//        }, 
//        /// <summary>
//        /// The ActualHeight CLR property - wrapper for ActualHeightProperty. 
//        /// Result in 1/96th inch. ("device-independent pixel")
//        /// </summary>
////        public double 
//        ActualHeight:
//        { 
//            get:function()
//            { 
//                return this.RenderSize.Height; 
//            }
//        }, 
// 
//        /// <summary>
//        /// Width Property
//        /// </summary>
////        public double 
//        Width: 
//        { 
//            get:function() { return this.GetValue(FrameworkElement.WidthProperty); },
//            set:function(value) { this.SetValue(FrameworkElement.WidthProperty, value); } 
//        },
//
//        /// <summary> 
//        /// MinWidth Property
//        /// </summary>
////        public double 
//        MinWidth:
//        { 
//            get:function() { return this.GetValue(FrameworkElement.MinWidthProperty); }, 
//            set:function(value) { this.SetValue(FrameworkElement.MinWidthProperty, value); }
//        }, 
//
//        /// <summary> 
//        /// MaxWidth Property
//        /// </summary>
////        public double 
//        MaxWidth:
//        { 
//            get:function() { return this.GetValue(FrameworkElement.MaxWidthProperty); }, 
//            set:function(value) { this.SetValue(FrameworkElement.MaxWidthProperty, value); }
//        }, 
// 
//        /// <summary>
//        /// Height Property 
//        /// </summary>
////        public double 
//        Height: 
//        {
//            get:function() { return this.GetValue(FrameworkElement.HeightProperty); },
//            set:function(value) { this.SetValue(FrameworkElement.HeightProperty, value); } 
//        },
//        /// <summary> 
//        /// MinHeight Property
//        /// </summary> 
////        public double 
//        MinHeight:
//        { 
//            get:function() { return this.GetValue(FrameworkElement.MinHeightProperty); },
//            set:function(value) { this.SetValue(FrameworkElement.MinHeightProperty, value); } 
//        }, 
//
//        /// <summary> 
//        /// MaxHeight Property 
//        /// </summary>
////        public double 
//        MaxHeight:
//        {
//            get:function() { return this.GetValue(FrameworkElement.MaxHeightProperty); }, 
//            set:function(value) { this.SetValue(FrameworkElement.MaxHeightProperty, value); }
//        },
// 
//        /// <summary>
//        /// Margin Property 
//        /// </summary> 
////        public Thickness 
//        Margin:
//        { 
//            get:function() { return this.GetValue(FrameworkElement.MarginProperty); },
//            set:function(value) { this.SetValue(FrameworkElement.MarginProperty, value); }
//        },
 
        /// <summary>
        /// HorizontalAlignment Property. 
        /// </summary> 
//        public HorizontalAlignment 
        HorizontalAlignment:
        { 
            get:function() { return this.GetValue(FrameworkElement.HorizontalAlignmentProperty); },
            set:function(value) { this.SetValue(FrameworkElement.HorizontalAlignmentProperty, value); }
        },
 
        /// <summary>
        /// VerticalAlignment Property.
        /// </summary>
//        public VerticalAlignment 
        VerticalAlignment: 
        {
            get:function() { return this.GetValue(FrameworkElement.VerticalAlignmentProperty); }, 
            set:function(value) { this.SetValue(FrameworkElement.VerticalAlignmentProperty, value); } 
        },

        /// <summary>
        /// FocusVisualStyle Property 
        /// </summary> 
//        public Style 
        FocusVisualStyle:
        { 
            get:function() { return this.GetValue(FrameworkElement.FocusVisualStyleProperty); },
            set:function(value) { this.SetValue(FrameworkElement.FocusVisualStyleProperty, value); }
        },

//        /// <summary> 
//        /// Cursor Property
//        /// </summary>
////        public System.Windows.Input.Cursor 
//        Cursor:
//        { 
//            get:function() { return this.GetValue(FrameworkElement.CursorProperty); },
//            set:function(value) { this.SetValue(FrameworkElement.CursorProperty, value); } 
//        }, 
//
//        /// <summary>
//        ///     ForceCursor Property 
//        /// </summary>
////        public bool 
//        ForceCursor:
//        {
//            get:function() { return this.GetValue(FrameworkElement.ForceCursorProperty); }, 
//            set:function(value) { this.SetValue(FrameworkElement.ForceCursorProperty, value); }
//        }, 
 
        /// <summary> 
        ///     Has this element been initialized
        /// </summary> 
        /// <remarks>
        ///     True if either EndInit or OnParentChanged were called
        /// </remarks>
//        public bool 
        IsInitialized:
        { 
            get:function() { return this.ReadInternalFlag(InternalFlags.IsInitialized); } 
        },

        /// <summary>
        ///     Turns true when this element is attached to a tree and is laid out and rendered. 
        ///     Turns false when the element gets detached from a loaded tree
        /// </summary> 
//        public bool 
        IsLoaded: 
        {
            get:function() 
            {
                /*object[]*/var loadedPending = this.LoadedPending;
                /*object[]*/var unloadedPending = this.UnloadedPending;
 
                if (loadedPending == null && unloadedPending == null)
                { 
                    // The HasHandler flags are used for validation of the IsLoaded flag 
                    if (this.SubtreeHasLoadedChangeHandler)
                    { 
                        // The IsLoaded flag is valid
                        return this.IsLoadedCache;
                    }
                    else 
                    {
                        // IsLoaded flag isn't valid 
                        return BroadcastEventHelper.IsParentLoaded(this); 
                    }
                } 
                else
                {
                    // This is the case where we might be
                    // 1. Pending Unloaded only 
                    //    In this case we are already Loaded
                    // 2. Pending Loaded only 
                    //    In this case we are not Loaded yet 
                    // 3. Pending both Loaded and Unloaded
                    //    We can get to this state only when Unloaded operation preceeds Loaded. 
                    //    If Loaded preceeded Unloaded then it is sure to have been cancelled
                    //    out by the latter.

                    return (unloadedPending != null); 
                }
            } 
        }, 
 
//        internal static PopupControlService 
        PopupControlService:
        { 
            get:function() 
            {
                return EnsureFrameworkServices()._popupControlService; 
            }
        },

 
//        internal static KeyboardNavigation 
        KeyboardNavigation:
        { 
            get:function() 
            {
                return EnsureFrameworkServices()._keyboardNavigation; 
            }
        },

        /// <summary>
        ///     The ToolTip for the element. 
        ///     If the value is of type ToolTip, then that is the ToolTip that will be used.
        ///     If the value is of any other type, then that value will be used 
        ///     as the content for a ToolTip provided by the system. Refer to ToolTipService 
        ///     for attached properties to customize the ToolTip.
        /// </summary> 
//        public object 
        ToolTip:
        { 
            get:function()
            { 
                return ToolTipService.GetToolTip(this); 
            },
 
            set:function(value)
            {
                ToolTipService.SetToolTip(this, value);
            } 
        },
 
        /// <summary> 
        /// The ContextMenu data set on this element. Can be any type that can be converted to a UIElement.
        /// </summary> 
//        public ContextMenu 
        ContextMenu:
        {
            get:function()
            { 
            	var result =this.GetValue(FrameworkElement.ContextMenuProperty);
                return  result instanceof ContextMenu ? result : null;
            },
 
            set:function(value)
            { 
                this.SetValue(FrameworkElement.ContextMenuProperty, value);
            }
        },
 
        // Gettor and Settor for flag that indicates if this
        // instance has some property values that are 
        // set to a resource reference
//        internal bool 
        HasResourceReference:
        {
            get:function() { return this.ReadInternalFlag(InternalFlags.HasResourceReferences); }, 
            set:function(value) { this.WriteInternalFlag(InternalFlags.HasResourceReferences, value); }
        }, 
 
//        internal bool 
        IsLogicalChildrenIterationInProgress:
        { 
            get:function() { return this.ReadInternalFlag(InternalFlags.IsLogicalChildrenIterationInProgress); },
            set:function(value) { this.WriteInternalFlag(InternalFlags.IsLogicalChildrenIterationInProgress, value); }
        },
 
//        internal bool 
        InVisibilityCollapsedTree:
        { 
            get:function() { return this.ReadInternalFlag(InternalFlags.InVisibilityCollapsedTree); }, 
            set:function(value) { this.WriteInternalFlag(InternalFlags.InVisibilityCollapsedTree, value); }
        }, 

//        internal bool 
        SubtreeHasLoadedChangeHandler:
        {
            get:function() { return this.ReadInternalFlag2(InternalFlags2.TreeHasLoadedChangeHandler); }, 
            set:function(value) { this.WriteInternalFlag2(InternalFlags2.TreeHasLoadedChangeHandler, value); }
        }, 
 
//        internal bool 
        IsLoadedCache:
        { 
            get:function() { return this.ReadInternalFlag2(InternalFlags2.IsLoadedCache); },
            set:function(value) { this.WriteInternalFlag2(InternalFlags2.IsLoadedCache, value); }
        },
 
//        internal bool 
        IsParentAnFE:
        { 
            get:function() { return this.ReadInternalFlag2(InternalFlags2.IsParentAnFE); },
            set:function(value) { this.WriteInternalFlag2(InternalFlags2.IsParentAnFE, value); }
        }, 

//        internal bool 
        IsTemplatedParentAnFE:
        {
            get:function() { return this.ReadInternalFlag2(InternalFlags2.IsTemplatedParentAnFE); }, 
            set:function(value) { this.WriteInternalFlag2(InternalFlags2.IsTemplatedParentAnFE, value); }
        }, 
 
//        internal bool 
        HasLogicalChildren:
        { 
            get:function() { return this.ReadInternalFlag(InternalFlags.HasLogicalChildren); },
            set:function(value) { this.WriteInternalFlag(InternalFlags.HasLogicalChildren, value); }
        },


        // Root node of VisualTree is the first FrameworkElementFactory
        //  to be created.  -1 means "not involved in Style", 0 means 
        //  "I am the object that has a Style with VisualTree", and 1
        //  means "I am the root of the VisualTree".  All following 
        //  numbers are labeled in the order of a depth-first traversal 
        //  of the visual tree built from Style.VisualTree.
        // NOTE: Nodes that Style is not interested in (no properties, no 
        //  bindings, etc.) have a TemplateChildIndex of -1 because they are "not
        //  involved" in Styles but they are in the chain.  They're at the end,
        //  behind all the nodes with TemplateChildIndex values, kept around so we
        //  remember to clean them up. 
        // NOTE: TemplateChildIndex is stored in the low bits of _flags4
//        internal int 
        TemplateChildIndex: 
        { 
            get:function()
            { 
                var childIndex = this._flags4 & 0xFFFF;
                if (childIndex == 0xFFFF)
                {
                    return -1; 
                }
                else 
                { 
                    return childIndex;
                } 
            },
            set:function(value)
            {
                // We store TemplateChildIndex as a 16-bit integer with 0xFFFF meaning "-1". 
                // Thus we support any indices in the range [-1, 65535).
                if (value < -1 || value >= 0xFFFF) 
                { 
                    throw new Error('ArgumentOutOfRangeException("value", SR.Get(SRID.TemplateChildIndexOutOfRange)');
                } 

                var childIndex = (value == -1) ? 0xFFFF : value;

                this._flags4 = childIndex | ((this._flags4) & 0xFFFF0000); 
            }
        }, 
 
//        internal bool 
        IsRequestingExpression:
        { 
            get:function() { return this.ReadInternalFlag2(InternalFlags2.IsRequestingExpression); },
            set:function(value) { this.WriteInternalFlag2(InternalFlags2.IsRequestingExpression, value); }
        },
 
//        internal bool 
        BypassLayoutPolicies:
        { 
            get:function() { return this.ReadInternalFlag2(InternalFlags2.BypassLayoutPolicies); }, 
            set:function(value) { this.WriteInternalFlag2(InternalFlags2.BypassLayoutPolicies, value); }
        },

	});
	
	Object.defineProperties(FrameworkElement, {
 
 
        /// <summary>
        ///     ResourcesChanged private key 
        /// </summary>
//        internal static readonly EventPrivateKey 
        ResourcesChangedKey:
        {
        	get:function(){
        		if(FrameworkElement._ResourcesChangedKey === undefined){
        			FrameworkElement._ResourcesChangedKey = new EventPrivateKey();
        		}
        		
        		return FrameworkElement._ResourcesChangedKey;
        	}
        },
       
        /// <summary> 
        ///     InheritedPropertyChanged private key 
        /// </summary>
//        internal static readonly EventPrivateKey 
        InheritedPropertyChangedKey:
        {
        	get:function(){
        		if(FrameworkElement._InheritedPropertyChangedKey === undefined){
        			FrameworkElement._InheritedPropertyChangedKey  = new EventPrivateKey(); 
        		}
        		
        		return FrameworkElement._InheritedPropertyChangedKey;
        	}
        },
 
        // Optimization, to avoid calling FromSystemType too often
//        internal new static DependencyObjectType 
        DType:
        {
        	get:function(){
        		if(FrameworkElement._DType === undefined){
        			FrameworkElement._DType = DependencyObjectType.FromSystemTypeInternal(FrameworkElement.Type); 

        		}
        		
        		return FrameworkElement._DType;
        	}
        },

//        private static readonly UncommonField<DependencyObject> 
        InheritanceContextField:
        {
        	get:function(){
        		if(FrameworkElement._InheritanceContextField === undefined){
        			FrameworkElement._InheritanceContextField = new UncommonField();
        		}
        		
        		return FrameworkElement._InheritanceContextField;
        	}
        },  
//        private static readonly UncommonField<DependencyObject> 
        MentorField:
        {
        	get:function(){
        		if(FrameworkElement._MentorField === undefined){
        			FrameworkElement._MentorField = new UncommonField();
        		}
        		
        		return FrameworkElement._MentorField;
        	}
        }, 
 
        /// <summary>Style Dependency Property</summary> 
//        public static readonly DependencyProperty 
        StyleProperty:
        {
        	get:function(){
        		if(FrameworkElement._StyleProperty === undefined){
        			FrameworkElement._StyleProperty  =
                        DependencyProperty.Register(
                                "Style", 
                                /*typeof(Style)*/Style.Type,
                                FrameworkElement.Type, 
                                /*new FrameworkPropertyMetadata( 
                                        null,   // default value
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(OnStyleChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB( 
                                        null,   // default value
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(FrameworkElement, OnStyleChanged)));
        		}
        		
        		return FrameworkElement._StyleProperty;
        	}
        },

        /// <summary> 
        /// OverridesDefaultStyleProperty
        /// </summary> 
//        public static readonly DependencyProperty 
        OverridesDefaultStyleProperty:
        {
        	get:function(){
        		if(FrameworkElement._OverridesDefaultStyleProperty === undefined){
        			FrameworkElement._OverridesDefaultStyleProperty = DependencyProperty.Register("OverridesDefaultStyle", 
        					Boolean.Type, FrameworkElement.Type,
                            /*new FrameworkPropertyMetadata( 
                                    false,   // default value
                                    FrameworkPropertyMetadataOptions.AffectsMeasure,
                                    new PropertyChangedCallback(OnThemeStyleKeyChanged))*/
        					FrameworkPropertyMetadata.Build3PCCB( 
                                    false,   // default value
                                    FrameworkPropertyMetadataOptions.AffectsMeasure,
                                    new PropertyChangedCallback(FrameworkElement, OnThemeStyleKeyChanged)));
        		}
        		
        		return FrameworkElement._OverridesDefaultStyleProperty;
        	}
        }, 
            
 
 
        ///     The UseLayoutRounding property. 
        /// </summary>
//        public static readonly DependencyProperty 
        UseLayoutRoundingProperty:
        {
        	get:function(){
        		if(FrameworkElement._UseLayoutRoundingProperty === undefined){
        			FrameworkElement._UseLayoutRoundingProperty  = 
                        DependencyProperty.Register(
                                "UseLayoutRounding",
                                Boolean.Type,
                                FrameworkElement.Type, 
                                /*new FrameworkPropertyMetadata(
                                    false, 
                                    FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                    new PropertyChangedCallback(OnUseLayoutRoundingChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                		false, 
                                    FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                    new PropertyChangedCallback(FrameworkElement, OnUseLayoutRoundingChanged))
                                ); 
        		}
        		
        		return FrameworkElement._UseLayoutRoundingProperty;
        	}
        },

        /// <summary>
        /// DefaultStyleKeyProperty
        /// </summary>
//        protected internal static readonly DependencyProperty 
        DefaultStyleKeyProperty:
        {
        	get:function(){
        		if(FrameworkElement._DefaultStyleKeyProperty === undefined){
        			FrameworkElement._DefaultStyleKeyProperty = DependencyProperty.Register("DefaultStyleKey", 
        					Object.Type, FrameworkElement.Type,
                            /*new FrameworkPropertyMetadata( 
                                    null,   // default value 
                                    FrameworkPropertyMetadataOptions.AffectsMeasure,
                                    new PropertyChangedCallback(OnThemeStyleKeyChanged))*/
        					FrameworkPropertyMetadata.Build3PCCB( 
                                    null,   // default value 
                                    FrameworkPropertyMetadataOptions.AffectsMeasure,
                                    new PropertyChangedCallback(FrameworkElement, OnThemeStyleKeyChanged)));
        		}
        		
        		return FrameworkElement._DefaultStyleKeyProperty;
        	}
        }, 
             

//        internal static readonly NumberSubstitution 
        DefaultNumberSubstitution:
        {
        	get:function(){
        		if(FrameworkElement._DefaultNumberSubstitution === undefined){
        			FrameworkElement._DefaultNumberSubstitution  = new NumberSubstitution( 
        		            NumberCultureSource.User,           // number substitution in UI defaults to user culture
        		            null,                               // culture override
        		            NumberSubstitutionMethod.AsCulture
        		            ); 
        		}
        		
        		return FrameworkElement._DefaultNumberSubstitution;
        	}
        },

        /// <summary>
        ///     DataContext DependencyProperty 
        /// </summary>
//        public static readonly DependencyProperty 
        DataContextProperty:
        {
        	get:function(){
        		if(FrameworkElement._DataContextProperty === undefined){
        			FrameworkElement._DataContextProperty =
                    DependencyProperty.Register(
                                "DataContext", 
                                Object.Type,
                                FrameworkElement.Type, 
                                /*new FrameworkPropertyMetadata(
                                		null, 
                                        FrameworkPropertyMetadataOptions.Inherits,
                                        new PropertyChangedCallback(OnDataContextChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                		null, 
                                        FrameworkPropertyMetadataOptions.Inherits,
                                        new PropertyChangedCallback(FrameworkElement, OnDataContextChanged))); 
        		}
        		
        		return FrameworkElement._DataContextProperty;
        	}
        }, 

        /// <summary>
        ///     DataContextChanged private key
        /// </summary> 
//        internal static readonly EventPrivateKey 
        DataContextChangedKey:
        {
        	get:function(){
        		if(FrameworkElement._DataContextChangedKey === undefined){
        			FrameworkElement._DataContextChangedKey = new EventPrivateKey();
        		}
        		
        		return FrameworkElement._DataContextChangedKey;
        	}
        }, 
 

 
        /// <summary>
        ///     BindingGroup DependencyProperty 
        /// </summary> 
//        public static readonly DependencyProperty 
        BindingGroupProperty:
        {
        	get:function(){
        		if(FrameworkElement._BindingGroupProperty === undefined){
        			FrameworkElement._BindingGroupProperty  =
                    DependencyProperty.Register( 
                                "BindingGroup",
                                /*typeof(BindingGroup)*/BindingGroup.Type,
                                FrameworkElement.Type,
                                /*new FrameworkPropertyMetadata(null, 
                                        FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(null, 
                                        FrameworkPropertyMetadataOptions.Inherits));
        		}
        		
        		return FrameworkElement._BindingGroupProperty;
        	}
        },

        /// <summary> 
        ///     The DependencyProperty for the Name property.
        /// </summary>
//        public static readonly DependencyProperty 
        NameProperty:
        {
        	get:function(){
        		if(FrameworkElement._NameProperty === undefined){
        			FrameworkElement._NameProperty = 
                    DependencyProperty.Register(
                                "Name", 
                                String.Type, 
                                FrameworkElement.Type,
                                /*new FrameworkPropertyMetadata( 
                                    String.Empty,                           // defaultValue
                                    FrameworkPropertyMetadataOptions.None,  // flags
                                    null,                                   // propertyChangedCallback
                                    null,                                   // coerceValueCallback 
                                    true)*/                                  // isAnimationProhibited
                                FrameworkPropertyMetadata.Build5(String.Empty,                           // defaultValue
                                        FrameworkPropertyMetadataOptions.None,  // flags
                                        null,                                   // propertyChangedCallback
                                        null,                                   // coerceValueCallback 
                                        true),    								// isAnimationProhibited
                                new ValidateValueCallback(NameValidationHelper.NameValidationCallback)); 
        		}
        		
        		return FrameworkElement._NameProperty;
        	}
        }, 
 
        /// <summary>
        ///     The DependencyProperty for the Tag property.
        /// </summary> 
//        public static readonly DependencyProperty 
        TagProperty:
        {
        	get:function(){
        		if(FrameworkElement._TagProperty === undefined){
        			FrameworkElement._TagProperty =
                    DependencyProperty.Register( 
                                "Tag", 
                                Object.Type,
                                FrameworkElement.Type, 
                                /*new FrameworkPropertyMetadata((object) null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null));
        		}
        		
        		return FrameworkElement._TagProperty;
        	}
        },

        /// <summary> 
        ///     InputScope DependencyProperty 
        ///     this is originally registered on InputMethod class
        /// </summary> 
//        public static readonly DependencyProperty 
        InputScopeProperty:
        {
        	get:function(){
        		if(FrameworkElement._InputScopeProperty === undefined){
        			FrameworkElement._InputScopeProperty =
                    InputMethod.InputScopeProperty.AddOwner(FrameworkElement.Type,
                                /*new FrameworkPropertyMetadata((InputScope)null, // default value
                                            FrameworkPropertyMetadataOptions.Inherits)*/
                    		FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.Inherits)
                    		); 
        		}
        		
        		return FrameworkElement._InputScopeProperty;
        	}
        }, 

        /// <summary>
        /// RequestBringIntoView Event 
        /// </summary>
//        public static readonly RoutedEvent 
        RequestBringIntoViewEvent:
        {
        	get:function(){
        		if(FrameworkElement._RequestBringIntoViewEvent === undefined){
        			FrameworkElement._RequestBringIntoViewEvent = EventManager.RegisterRoutedEvent("RequestBringIntoView", RoutingStrategy.Bubble, 
        					RequestBringIntoViewEventHandler.Type, FrameworkElement.Type);
        		}
        		
        		return FrameworkElement._RequestBringIntoViewEvent;
        	}
        }, 


////        private static PropertyMetadata 
//        _actualWidthMetadata:
//        {
//        	get:function(){
//        		if(FrameworkElement.__actualWidthMetadata === undefined){
//        			FrameworkElement.__actualWidthMetadata = 
//        				new ReadOnlyFrameworkPropertyMetadata(0, new GetReadOnlyValueCallback(GetActualWidth));
//        		}
//        		
//        		return FrameworkElement.__actualWidthMetadata;
//        	}
//        }, 
//
//        /// <summary> 
//        ///     The key needed set a read-only property.
//        /// </summary> 
////        private static readonly DependencyPropertyKey 
//        ActualWidthPropertyKey:
//        {
//        	get:function(){
//        		if(FrameworkElement._ActualWidthPropertyKey === undefined){
//        			FrameworkElement._ActualWidthPropertyKey = 
//                        DependencyProperty.RegisterReadOnly(
//                                "ActualWidth", 
//                                Number.Type,
//                                FrameworkElement.Type,
//                                FrameworkElement._actualWidthMetadata);
//        		}
//        		
//        		return FrameworkElement._ActualWidthPropertyKey;
//        	}
//        }, 
// 
//        /// <summary>
//        /// The ActualWidth dynamic property.
//        /// </summary> 
////        public static readonly DependencyProperty 
//        ActualWidthProperty:
//        {
//        	get:function(){
//        		if(FrameworkElement._ActualWidthProperty === undefined){
//        			FrameworkElement._ActualWidthProperty =
//                        ActualWidthPropertyKey.DependencyProperty; 
//        		}
//        		
//        		return FrameworkElement._ActualWidthProperty;
//        	}
//        }, 
// 
////        private static PropertyMetadata 
//        _actualHeightMetadata:
//        {
//        	get:function(){
//        		if(FrameworkElement.__actualHeightMetadata === undefined){
//        			FrameworkElement.__actualHeightMetadata = 
//        				new ReadOnlyFrameworkPropertyMetadata(0, new GetReadOnlyValueCallback(GetActualHeight));
//        		}
//        		
//        		return FrameworkElement.__actualHeightMetadata;
//        	}
//        }, 
//
//        /// <summary> 
//        ///     The key needed set a read-only property.
//        /// </summary> 
////        private static readonly DependencyPropertyKey 
//        ActualHeightPropertyKey:
//        {
//        	get:function(){
//        		if(FrameworkElement._ActualHeightPropertyKey === undefined){
//        			FrameworkElement._ActualHeightPropertyKey = 
//                        DependencyProperty.RegisterReadOnly(
//                                "ActualHeight", 
//                                Number.Type,
//                                FrameworkElement.Type,
//                                FrameworkElement._actualHeightMetadata);
//        		}
//        		
//        		return FrameworkElement._ActualHeightPropertyKey;
//        	}
//        }, 
// 
//        /// <summary>
//        /// The ActualHeight dynamic property.
//        /// </summary> 
////        public static readonly DependencyProperty 
//        ActualHeightProperty:
//        {
//        	get:function(){
//        		if(FrameworkElement._ActualHeightProperty === undefined){
//        			FrameworkElement._ActualHeightProperty =
//                        ActualHeightPropertyKey.DependencyProperty; 
//        		}
//        		
//        		return FrameworkElement._ActualHeightProperty;
//        	}
//        }, 
// 
//        /// <summary> 
//        /// Width Dependency Property
//        /// </summary> 
////        public static readonly DependencyProperty 
//        WidthProperty:
//        {
//        	get:function(){
//        		if(FrameworkElement._WidthProperty === undefined){
//        			FrameworkElement._WidthProperty  =
//                    DependencyProperty.Register( 
//                                "Width",
//                                Number.Type,
//                                FrameworkElement.Type,
//                                /*new FrameworkPropertyMetadata( 
//                                        NaN,
//                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
//                                        new PropertyChangedCallback(OnTransformDirty))*/
//                                FrameworkPropertyMetadata.Build3PCCB(Number.NaN,
//                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
//                                        new PropertyChangedCallback(FrameworkElement, OnTransformDirty)), 
//                                new ValidateValueCallback(FrameworkElement, IsWidthHeightValid));
//        		}
//        		
//        		return FrameworkElement._WidthProperty;
//        	}
//        },
// 
//
//        /// <summary>
//        /// MinWidth Dependency Property 
//        /// </summary>
////        public static readonly DependencyProperty 
//        MinWidthProperty:
//        {
//        	get:function(){
//        		if(FrameworkElement._MinWidthProperty === undefined){
//        			FrameworkElement._MinWidthProperty = 
//                    DependencyProperty.Register(
//                                "MinWidth", 
//                                Number.Type,
//                                FrameworkElement.Type,
//                                /*new FrameworkPropertyMetadata(
//                                        0, 
//                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
//                                        new PropertyChangedCallback(OnTransformDirty))*/
//                                FrameworkPropertyMetadata.Build3PCCB(0, 
//                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
//                                        new PropertyChangedCallback(FrameworkElement, OnTransformDirty)), 
//                                new ValidateValueCallback(FrameworkElement, IsMinWidthHeightValid)); 
//        		}
//        		
//        		return FrameworkElement._MinWidthProperty;
//        	}
//        }, 
//
//        /// <summary>
//        /// MaxWidth Dependency Property
//        /// </summary> 
////        public static readonly DependencyProperty 
//        MaxWidthProperty:
//        {
//        	get:function(){
//        		if(FrameworkElement._MaxWidthProperty === undefined){
//        			FrameworkElement._MaxWidthProperty = 
//                    DependencyProperty.Register( 
//                                "MaxWidth",
//                                Number.Type, 
//                                FrameworkElement.Type,
//                                /*new FrameworkPropertyMetadata(
//                                        Double.PositiveInfinity,
//                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
//                                        new PropertyChangedCallback(OnTransformDirty))*/
//                                FrameworkPropertyMetadata.Build3CVCB(
//                                		Number.PositiveInfinity,
//                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
//                                        new PropertyChangedCallback(FrameworkElement, OnTransformDirty)),
//                                new ValidateValueCallback(FrameworkElement, IsMaxWidthHeightValid)); 
//        		}
//        		
//        		return FrameworkElement._MaxWidthProperty;
//        	}
//        }, 
// 
//        /// <summary>
//        /// Height Dependency Property
//        /// </summary> 
////        public static readonly DependencyProperty 
//        HeightProperty:
//        {
//        	get:function(){
//        		if(FrameworkElement._HeightProperty === undefined){
//        			FrameworkElement._HeightProperty = 
//                    DependencyProperty.Register( 
//                                "Height",
//                                Number.Type, 
//                                FrameworkElement.Type,
//                                /*new FrameworkPropertyMetadata(
//                                		Number.NaN,
//                                    FrameworkPropertyMetadataOptions.AffectsMeasure, 
//                                    new PropertyChangedCallback(OnTransformDirty))*/
//                                FrameworkPropertyMetadata.Build3PCCB(
//                                		Number.NaN,
//                                    FrameworkPropertyMetadataOptions.AffectsMeasure, 
//                                    new PropertyChangedCallback(FrameworkElement, OnTransformDirty)),
//                                new ValidateValueCallback(FrameworkElement, IsWidthHeightValid)); 
//        		}
//        		
//        		return FrameworkElement._HeightProperty;
//        	}
//        }, 
// 
//        /// <summary>
//        /// MinHeight Dependency Property
//        /// </summary>
////        public static readonly DependencyProperty 
//        MinHeightProperty:
//        {
//        	get:function(){
//        		if(FrameworkElement._MinHeightProperty === undefined){
//        			FrameworkElement._MinHeightProperty =
//                    DependencyProperty.Register( 
//                                "MinHeight", 
//                                Number.Type,
//                                FrameworkElement.Type, 
//                                /*new FrameworkPropertyMetadata(
//                                        0,
//                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
//                                        new PropertyChangedCallback(OnTransformDirty))*/
//                                FrameworkPropertyMetadata.Build3PCCB(
//                                        0,
//                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
//                                        new PropertyChangedCallback(FrameworkElement, OnTransformDirty)), 
//                                new ValidateValueCallback(FrameworkElement, IsMinWidthHeightValid));
//        		}
//        		
//        		return FrameworkElement._MinHeightProperty;
//        	}
//        }, 
// 
//        /// <summary> 
//        /// MaxHeight Dependency Property
//        /// </summary>
////        public static readonly DependencyProperty 
//        MaxHeightProperty:
//        {
//        	get:function(){
//        		if(FrameworkElement._MaxHeightProperty === undefined){
//        			FrameworkElement._MaxHeightProperty = 
//                    DependencyProperty.Register(
//                                "MaxHeight", 
//                                Number.Type, 
//                                FrameworkElement.Type,
//                                /*new FrameworkPropertyMetadata( 
//                                        Double.PositiveInfinity,
//                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
//                                        new PropertyChangedCallback(FrameworkElement, OnTransformDirty))*/
//                                FrameworkPropertyMetadata.Build3PCCB(Number.PositiveInfinity,
//                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
//                                        new PropertyChangedCallback(FrameworkElement, OnTransformDirty)),
//                                new ValidateValueCallback(FrameworkElement, IsMaxWidthHeightValid));
//        		}
//        		
//        		return FrameworkElement._MaxHeightProperty;
//        	}
//        },  
// 
//        /// <summary>
//        /// MarginProperty 
//        /// </summary> 
////        public static readonly DependencyProperty 
//        MarginProperty:
//        {
//        	get:function(){
//        		if(FrameworkElement._MarginProperty === undefined){
//        			FrameworkElement._MarginProperty = DependencyProperty.Register("Margin", 
//        					Thickness.Type, FrameworkElement.Type,
//                            /*new FrameworkPropertyMetadata(
//                                    new Thickness(),
//                                    FrameworkPropertyMetadataOptions.AffectsMeasure)*/
//        					FrameworkPropertyMetadata.BuildWithDVandPCCB(
//                                    new Thickness(),
//                                    FrameworkPropertyMetadataOptions.AffectsMeasure), 
//                              new ValidateValueCallback(FrameworkElement, IsMarginValid));
//        		}
//        		
//        		return FrameworkElement._MarginProperty;
//        	}
//        }, 

        /// <summary> 
        /// HorizontalAlignment Dependency Property.
        /// </summary>
//        public static readonly DependencyProperty 
        HorizontalAlignmentProperty:
        {
        	get:function(){
        		if(FrameworkElement._HorizontalAlignmentProperty === undefined){
        			FrameworkElement._HorizontalAlignmentProperty = 
                    DependencyProperty.Register(
                                "HorizontalAlignment", 
                                /*typeof(HorizontalAlignment)*/Number.Type, 
                                FrameworkElement.Type,
                                /*new FrameworkPropertyMetadata( 
                                            HorizontalAlignment.Stretch,
                                            FrameworkPropertyMetadataOptions.AffectsArrange)*/
                                FrameworkPropertyMetadata.Build2(HorizontalAlignment.Stretch,
                                            FrameworkPropertyMetadataOptions.AffectsArrange),
                                new ValidateValueCallback(FrameworkElement, FrameworkElement.ValidateHorizontalAlignmentValue));
        		}
        		
        		return FrameworkElement._HorizontalAlignmentProperty;
        	}
        }, 
 
        /// <summary>
        /// VerticalAlignment Dependency Property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        VerticalAlignmentProperty:
        {
        	get:function(){
        		if(FrameworkElement._VerticalAlignmentProperty === undefined){
        			FrameworkElement._VerticalAlignmentProperty = 
                    DependencyProperty.Register(
                                "VerticalAlignment",
                                /*typeof(VerticalAlignment)*/Number.Type,
                                FrameworkElement.Type, 
                                /*new FrameworkPropertyMetadata(
                                            VerticalAlignment.Stretch, 
                                            FrameworkPropertyMetadataOptions.AffectsArrange)*/
                                FrameworkPropertyMetadata.Build2(
                                            VerticalAlignment.Stretch, 
                                            FrameworkPropertyMetadataOptions.AffectsArrange), 
                                new ValidateValueCallback(FrameworkElement, FrameworkElement.ValidateVerticalAlignmentValue));
        		}
        		
        		return FrameworkElement._VerticalAlignmentProperty;
        	}
        }, 
 
        /// <summary>
        /// FocusVisualStyleProperty 
        /// </summary>
//        public static readonly DependencyProperty 
        FocusVisualStyleProperty:
        {
        	get:function(){
        		if(FrameworkElement._FocusVisualStyleProperty === undefined){
        			FrameworkElement._FocusVisualStyleProperty  = 
                    DependencyProperty.Register( 
                                "FocusVisualStyle",
                                /*typeof(Style)*/Style.Type, 
                                FrameworkElement.Type,
                                /*new FrameworkPropertyMetadata(FrameworkElement.DefaultFocusVisualStyle)*/
                                FrameworkPropertyMetadata.BuildWithDV(FrameworkElement.DefaultFocusVisualStyle));
        		}
        		
        		return FrameworkElement._FocusVisualStyleProperty;
        	}
        },

 
//        /// <summary>
//        /// CursorProperty 
//        /// </summary> 
////        public static readonly DependencyProperty 
//        CursorProperty:
//        {
//        	get:function(){
//        		if(FrameworkElement._CursorProperty === undefined){
//        			FrameworkElement._CursorProperty =
//                    DependencyProperty.Register( 
//                                "Cursor",
//                                Object.Type,
//                                FrameworkElement.Type,
//                                /*new FrameworkPropertyMetadata( 
//                                    (object) null, // default value
//                                    0, 
//                                    new PropertyChangedCallback(FrameworkElement, OnCursorChanged))*/
//                                FrameworkPropertyMetadata.Build3PCCB( 
//                                    null, // default value
//                                    0, 
//                                    new PropertyChangedCallback(null, OnCursorChanged))); 
//        		}
//        		
//        		return FrameworkElement._CursorProperty;
//        	}
//        }, 
//
//        /// <summary>
//        ///     ForceCursorProperty 
//        /// </summary>
////        public static readonly DependencyProperty 
//        ForceCursorProperty:
//        {
//        	get:function(){
//        		if(FrameworkElement._ForceCursorProperty === undefined){
//        			FrameworkElement._ForceCursorProperty  = 
//                    DependencyProperty.Register( 
//                                "ForceCursor",
//                                Boolean.Type, 
//                                FrameworkElement.Type,
//                                /*new FrameworkPropertyMetadata(
//                                    false, // default value
//                                    0, 
//                                    new PropertyChangedCallback(FrameworkElement, OnForceCursorChanged))*/
//                                FrameworkPropertyMetadata.Build3PCCB(false, // default value
//                                    0, 
//                                    new PropertyChangedCallback(FrameworkElement, OnForceCursorChanged)));
//        		}
//        		
//        		return FrameworkElement._ForceCursorProperty;
//        	}
//        },
 
        /// <summary>
        ///     Initialized private key
        /// </summary>
//        internal static readonly EventPrivateKey 
        InitializedKey:
        {
        	get:function(){
        		if(FrameworkElement._InitializedKey === undefined){
        			FrameworkElement._InitializedKey = new EventPrivateKey(); 
        		}
        		
        		return FrameworkElement._InitializedKey;
        	}
        }, 

        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary> 
//        internal static readonly DependencyPropertyKey 
        LoadedPendingPropertyKey:
        {
        	get:function(){
        		if(FrameworkElement._LoadedPendingPropertyKey === undefined){
        			FrameworkElement._LoadedPendingPropertyKey =
                    DependencyProperty.RegisterReadOnly( 
                                "LoadedPending",
                                Array.Type,
                                FrameworkElement.Type,
                                new PropertyMetadata(null)); // default value 
        		}
        		
        		return FrameworkElement._LoadedPendingPropertyKey;
        	}
        }, 

        /// <summary> 
        ///     This DP is set on the root of a sub-tree that is about to receive a broadcast Loaded event 
        ///     This DP is cleared when the Loaded event is either fired or cancelled for some reason
        /// </summary> 
//        internal static readonly DependencyProperty 
        LoadedPendingProperty:
        {
        	get:function(){
        		if(FrameworkElement._LoadedPendingProperty === undefined){
        			FrameworkElement._LoadedPendingProperty =
        				FrameworkElement.LoadedPendingPropertyKey.DependencyProperty;
        		}
        		
        		return FrameworkElement._LoadedPendingProperty;
        	}
        }, 

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
//        internal static readonly DependencyPropertyKey 
        UnloadedPendingPropertyKey:
        {
        	get:function(){
        		if(FrameworkElement._UnloadedPendingPropertyKey === undefined){
        			FrameworkElement._UnloadedPendingPropertyKey = 
                    DependencyProperty.RegisterReadOnly(
                                "UnloadedPending", 
                                /*typeof(object[])*/Array.Type,
                                FrameworkElement.Type,
                                /*new PropertyMetadata(null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null)); // default value
        		}
        		
        		return FrameworkElement._UnloadedPendingPropertyKey;
        	}
        }, 
 
        /// <summary>
        ///     This DP is set on the root of a sub-tree that is about to receive a broadcast Unloaded event 
        ///     This DP is cleared when the Unloaded event is either fired or cancelled for some reason 
        /// </summary>
//        internal static readonly DependencyProperty 
        UnloadedPendingProperty:
        {
        	get:function(){
        		if(FrameworkElement._UnloadedPendingProperty === undefined){
        			FrameworkElement._UnloadedPendingProperty  = 
        				FrameworkElement.UnloadedPendingPropertyKey.DependencyProperty;
        		}
        		
        		return FrameworkElement._UnloadedPendingProperty;
        	}
        },

        /// <summary> 
        ///     Loaded RoutedEvent
        /// </summary>
//        public static readonly RoutedEvent 
        LoadedEvent:
        {
        	get:function(){
        		if(FrameworkElement._LoadedEvent === undefined){
        			FrameworkElement._LoadedEvent = EventManager.RegisterRoutedEvent("Loaded", RoutingStrategy.Direct, 
        					RoutedEventHandler.Type, FrameworkElement.Type);
        		}
        		
        		return FrameworkElement._LoadedEvent;
        	}
        }, 
 
        /// <summary>
        ///     Unloaded private key 
        /// </summary>
//        public static readonly RoutedEvent 
        UnloadedEvent:
        {
        	get:function(){
        		if(FrameworkElement._UnloadedEvent === undefined){
        			FrameworkElement._UnloadedEvent = EventManager.RegisterRoutedEvent("Unloaded", RoutingStrategy.Direct,
        					RoutedEventHandler.Type, FrameworkElement.Type); 
        		}
        		
        		return FrameworkElement._UnloadedEvent;
        	}
        }, 
 
 
//        internal static PopupControlService 
        PopupControlService:
        { 
            get:function()
            {
                return EnsureFrameworkServices()._popupControlService; 
            }
        },

 
//        internal static KeyboardNavigation 
        KeyboardNavigation:
        { 
            get:function() 
            {
                return EnsureFrameworkServices()._keyboardNavigation; 
            }
        },

        /// <summary> 
        ///     The DependencyProperty for the ToolTip property 
        /// </summary>
//        public static readonly DependencyProperty 
        ToolTipProperty:
        {
        	get:function(){
        		if(FrameworkElement._ToolTipProperty === undefined){
        			FrameworkElement._ToolTipProperty = 
        	            ToolTipService.ToolTipProperty.AddOwner(FrameworkElement.Type);
        		}
        		
        		return FrameworkElement._ToolTipProperty;
        	}
        }, 

        /// <summary>
        /// The DependencyProperty for the Contextmenu property 
        /// </summary>
//        public static readonly DependencyProperty 
        ContextMenuProperty:
        {
        	get:function(){
        		if(FrameworkElement._ContextMenuProperty === undefined){
        			FrameworkElement._ContextMenuProperty =
        	            ContextMenuService.ContextMenuProperty.AddOwner(
                                FrameworkElement.Type, 
                                /*new FrameworkPropertyMetadata( null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null));
        		}
        		
        		return FrameworkElement._ContextMenuProperty;
        	}
        }, 
 
        /// <summary>
        ///     The RoutedEvent for the ToolTipOpening event. 
        /// </summary> 
//        public static readonly RoutedEvent 
        ToolTipOpeningEvent:
        {
        	get:function(){
        		if(FrameworkElement._ToolTipOpeningEvent === undefined){
        			FrameworkElement._ToolTipOpeningEvent = ToolTipService.ToolTipOpeningEvent.AddOwner(FrameworkElement.Type);
        		}
        		
        		return FrameworkElement._ToolTipOpeningEvent;
        	}
        }, 
 
        /// <summary> 
        ///     The RoutedEvent for the ToolTipClosing event.
        /// </summary> 
//        public static readonly RoutedEvent 
        ToolTipClosingEvent:
        {
        	get:function(){
        		if(FrameworkElement._ToolTipClosingEvent === undefined){
        			FrameworkElement._ToolTipClosingEvent = ToolTipService.ToolTipClosingEvent.AddOwner(FrameworkElement.Type);
        		}
        		
        		return FrameworkElement._ToolTipClosingEvent;
        	}
        }, 

        /// <summary>
        ///     RoutedEvent for the ContextMenuOpening event. 
        /// </summary>
//        public static readonly RoutedEvent 
        ContextMenuOpeningEvent:
        {
        	get:function(){
        		if(FrameworkElement._ContextMenuOpeningEvent === undefined){
        			FrameworkElement._ContextMenuOpeningEvent = ContextMenuService.ContextMenuOpeningEvent.AddOwner(FrameworkElement.Type); 
        		}
        		
        		return FrameworkElement._ContextMenuOpeningEvent;
        	}
        }, 
 
        /// <summary> 
        ///     RoutedEvent for the ContextMenuClosing event.
        /// </summary> 
//        public static readonly RoutedEvent 
        ContextMenuClosingEvent:
        {
        	get:function(){
        		if(FrameworkElement._ContextMenuClosingEvent === undefined){
        			FrameworkElement._ContextMenuClosingEvent = ContextMenuService.ContextMenuClosingEvent.AddOwner(FrameworkElement.Type);
        		}
        		
        		return FrameworkElement._ContextMenuClosingEvent;
        	}
        }, 

//        private static DependencyObjectType 
        ControlDType:
        {
            get:function() 
            { 
                if (FrameworkElement._controlDType == null)
                { 
                	FrameworkElement._controlDType = DependencyObjectType.FromSystemTypeInternal(EnsureControl().Type);
                }

                return FrameworkElement._controlDType; 
            }
        }, 
 
//        private static DependencyObjectType 
        ContentPresenterDType:
        { 
            get:function()
            {
                if (FrameworkElement._contentPresenterDType == null)
                { 
                	FrameworkElement._contentPresenterDType = DependencyObjectType.FromSystemTypeInternal(ContentPresenter.Type);
                } 
 
                return FrameworkElement._contentPresenterDType;
            } 
        },

//        private static DependencyObjectType 
        PageDType:
        { 
            get:function()
            { 
                if (FrameworkElement._pageDType == null) 
                {
                	FrameworkElement._pageDType = DependencyObjectType.FromSystemTypeInternal(Page.Type); 
                }

                return FrameworkElement._pageDType;
            } 
        },
 
//        private static DependencyObjectType 
        PageFunctionBaseDType:
        {
            get:function() 
            {
                if (FrameworkElement._pageFunctionBaseDType == null)
                {
                	FrameworkElement._pageFunctionBaseDType = DependencyObjectType.FromSystemTypeInternal(typeof(PageFunctionBase)); 
                }
 
                return FrameworkElement._pageFunctionBaseDType; 
            }
        },
        
        

//      internal static Style 
        DefaultFocusVisualStyle: 
        { 
	          get:function()
	          { 
	              if (FrameworkElement._defaultFocusVisualStyle == null)
	              {
	                  /*Style*/var defaultFocusVisualStyle = new Style();
	                  defaultFocusVisualStyle.Seal(); 
	                  FrameworkElement._defaultFocusVisualStyle = defaultFocusVisualStyle;
	              } 
	
	              return FrameworkElement._defaultFocusVisualStyle;
	          } 
        },
      
//    // Resources dictionary
//    internal static readonly UncommonField<ResourceDictionary> 
      ResourcesField: 
      { 
          get:function()
          { 
              if (FrameworkElement._ResourcesField === undefined)
              {
                  FrameworkElement._ResourcesField = new UncommonField/*<ResourceDictionary>*/(); 
              } 

              return FrameworkElement._ResourcesField;
          } 
      } 
	});

    // Invoked when the Style property is changed
//    private static void 
    function OnStyleChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        FrameworkElement fe = (FrameworkElement) d;
        d.HasLocalStyle = (e.NewEntry.BaseValueSourceInternal == BaseValueSourceInternal.Local); 
        
//        var styleCacheRef = {
//        	"styleCache" : 	d._styleCache
//        };
        d._styleCache = e.NewValue;   //cym add
        StyleHelper.UpdateStyleCache(d, null, e.OldValue, e.NewValue/*, styleCacheRef*//*ref d._styleCache*/);
//        d._styleCache = styleCacheRef.styleCache;
    }


//    private static void 
    function OnUseLayoutRoundingChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        FrameworkElement fe = (FrameworkElement)d;
//        var newValue = /*(bool)*/e.NewValue; 
        d.SetFlags(e.NewValue, VisualFlags.UseLayoutRounding); 
    }

    // This function is called when ThemeStyleKey or OverridesThemeStyle properties change
//    private static void 
    function OnThemeStyleKeyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        // Re-evaluate ThemeStyle because it is 
        // a factor of the ThemeStyleKey property 
        /*((FrameworkElement)d)*/d.UpdateThemeStyleProperty();
    } 

    // Invoked when the ThemeStyle property is changed 
//    internal static void 
    FrameworkElement.OnThemeStyleChanged = function(/*DependencyObject*/ d, /*object*/ oldValue, /*object*/ newValue)
    { 
//        FrameworkElement fe = (FrameworkElement) d;
    	StyleHelper.UpdateThemeStyleCache(d, null, oldValue, newValue, d._themeStyleCache/*ref d._themeStyleCache*/);
    };

    // Given a FrameworkElement and a name string, this routine will try to find
    //  a node with Name property set to the given name.  It will search all 
    //  the child logical tree nodes of the given starting element.
    // If the name string is null or an empty string, the given starting element 
    //  is returned. 
    // If the name is found on a FrameworkContentElement, an exception is thrown
    // If the name is not found attached to anything, an exception is thrown 
//    internal static FrameworkElement
    FrameworkElement.FindNamedFrameworkElement = function( /*FrameworkElement*/ startElement, /*string*/ targetName )
    {
        /*FrameworkElement*/var targetFE = null;

        if( targetName == null || targetName.length == 0 )
        { 
            targetFE = startElement; 
        }
        else 
        {
            /*DependencyObject*/var targetObject = null;

            targetObject = LogicalTreeHelper.FindLogicalNode( startElement, targetName ); 

            if( targetObject == null ) 
            { 
                throw new Error('ArgumentException( SR.Get(SRID.TargetNameNotFound, targetName)');
            } 

            /*FrameworkObject*/var fo = new FrameworkObject(targetObject);
            if( fo.IsFE )
            { 
                targetFE = fo.FE;
            } 
            else 
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.NamedObjectMustBeFrameworkElement, targetName)'); 
            }
        }

        return targetFE; 
    };
    
    FrameworkElement.FindImplicitStyleResource = function(/*FrameworkElement or FrameworkContentElement*/ element, /*object*/ resourceKey, sourceOut/*out object source*/){
    	if(element instanceof FrameworkElement){
            // Do a FindResource call only if someone in the ancestry has
            // implicit styles. This is a performance optimization.

            if (element.ShouldLookupImplicitStyles)
            { 
                /*object*/var unlinkedParent = null; 
                /*bool*/var allowDeferredResourceReference = false;
                /*bool*/var mustReturnDeferredResourceReference = false; 

                // Implicit style lookup must stop at the app.
                /*bool*/var isImplicitStyleLookup = true;

                // For non-controls the implicit StyleResource lookup must stop at
                // the templated parent. Look at task 25606 for further details. 
                /*DependencyObject*/var boundaryElement = null; 
                var Control = EnsureControl();
                if (!(element instanceof Control))
                { 
                    boundaryElement = element.TemplatedParent;
                }

                /*object*/var implicitStyle = FrameworkElement.FindResourceInternal(element, 
                                                            null,                            // fce
                                                            FrameworkElement.StyleProperty,  // dp 
                                                            resourceKey, 
                                                            unlinkedParent,
                                                            allowDeferredResourceReference, 
                                                            mustReturnDeferredResourceReference,
                                                            boundaryElement,
                                                            isImplicitStyleLookup,
                                                            /*out source*/sourceOut); 

                // The reason this assert is commented is because there are specific scenarios when we can reach 
                // here even before the ShouldLookupImplicitStyles flag is updated. But this is still acceptable 
                // because the flag does get updated and the style property gets re-fetched soon after.

                // Look at AccessText.GetVisualChild implementation for example and
                // consider the following sequence of operations.

                // 1. contentPresenter.AddVisualChild(accessText) 
                // 1.1. accessText._parent1 = contentPresenter
                // 1.2. accessText.GetVisualChild(...) 
                // 1.2.1  accessText.AddVisualChild(textBlock) 
                // 1.2.1.1 textBlock.OnVisualParentChanged()
                // 1.2.1.1.1 FindImplicitStyleResource(textBlock) 
                // .
                // .
                // .
                // 1.3 accessText.OnVisualParentChanged 
                // 1.3.1 Set accessText.ShouldLookupImplicitStyle
                // 1.3.2 FindImplicitStyleResource(accessText) 
                // 1.3.3 Set textBlock.ShouldLookupImplicitStyle 
                // 1.3.4 FindImplicitStyleResource(textBlock)

                // Notice how we end up calling FindImplicitStyleResource on the textBlock before we have set the
                // ShouldLookupImplicitStyle flag on either accessText or textBlock. However this is still acceptable
                // because we eventually going to synchronize the flag and the style property value on both these objects.

                // Debug.Assert(!(implicitStyle != DependencyProperty.UnsetValue && fe.ShouldLookupImplicitStyles == false),
                //     "ShouldLookupImplicitStyles is false even while there exists an implicit style in the lookup path. To be precise at source " + source); 

                return implicitStyle;
            } 

            sourceOut.source = null;
            return DependencyProperty.UnsetValue;
    	}else {
    		// Do a FindResource call only if someone in the ancestry has 
            // implicit styles. This is a performance optimization.

            if (element.ShouldLookupImplicitStyles)
            { 
                /*object*/var unlinkedParent = null;
                /*bool*/var allowDeferredResourceReference = false; 
                /*bool*/var mustReturnDeferredResourceReference = false; 

                // Implicit style lookup must stop at the app. 
                /*bool*/var isImplicitStyleLookup = true;

                // For non-controls the implicit StyleResource lookup must stop at
                // the templated parent. Look at task 25606 for further details. 
                /*DependencyObject*/var boundaryElement = element.TemplatedParent;

                /*object*/
                var implicitStyle = FrameworkElement.FindResourceInternal(null, element, /*FrameworkContentElement.StyleProperty*/FrameworkElement.StyleProperty, 
                		resourceKey, unlinkedParent, allowDeferredResourceReference, mustReturnDeferredResourceReference, 
                		boundaryElement, isImplicitStyleLookup, sourceOut/*out source*/); 

                // Look at comments on the FE version of this method. 

                // Debug.Assert(!(implicitStyle != DependencyProperty.UnsetValue && fce.ShouldLookupImplicitStyles == false),
                //     "ShouldLookupImplicitStyles is false even while there exists an implicit style in the lookup path. To be precise at source " + source);

                return implicitStyle;
            } 

            sourceOut.source = null;
            return DependencyProperty.UnsetValue; 
    	}
    };

//    // FindImplicitSytle(fe) : Default: unlinkedParent, deferReference
////    internal static object 
//    FrameworkElement.FindImplicitStyleResource = function(/*FrameworkElement*/ fe, /*object*/ resourceKey, sourceOut/*out object source*/) 
//    {
//        // Do a FindResource call only if someone in the ancestry has
//        // implicit styles. This is a performance optimization.
//
//        if (fe.ShouldLookupImplicitStyles)
//        { 
//            /*object*/var unlinkedParent = null; 
//            /*bool*/var allowDeferredResourceReference = false;
//            /*bool*/var mustReturnDeferredResourceReference = false; 
//
//            // Implicit style lookup must stop at the app.
//            /*bool*/var isImplicitStyleLookup = true;
//
//            // For non-controls the implicit StyleResource lookup must stop at
//            // the templated parent. Look at task 25606 for further details. 
//            /*DependencyObject*/var boundaryElement = null; 
//            var Control = EnsureControl();
//            if (!(fe instanceof Control))
//            { 
//                boundaryElement = fe.TemplatedParent;
//            }
//
//            /*object*/var implicitStyle = FrameworkElement.FindResourceInternal(fe, 
//                                                        null,                            // fce
//                                                        FrameworkElement.StyleProperty,  // dp 
//                                                        resourceKey, 
//                                                        unlinkedParent,
//                                                        allowDeferredResourceReference, 
//                                                        mustReturnDeferredResourceReference,
//                                                        boundaryElement,
//                                                        isImplicitStyleLookup,
//                                                        /*out source*/sourceOut); 
//
//            // The reason this assert is commented is because there are specific scenarios when we can reach 
//            // here even before the ShouldLookupImplicitStyles flag is updated. But this is still acceptable 
//            // because the flag does get updated and the style property gets re-fetched soon after.
//
//            // Look at AccessText.GetVisualChild implementation for example and
//            // consider the following sequence of operations.
//
//            // 1. contentPresenter.AddVisualChild(accessText) 
//            // 1.1. accessText._parent1 = contentPresenter
//            // 1.2. accessText.GetVisualChild(...) 
//            // 1.2.1  accessText.AddVisualChild(textBlock) 
//            // 1.2.1.1 textBlock.OnVisualParentChanged()
//            // 1.2.1.1.1 FindImplicitStyleResource(textBlock) 
//            // .
//            // .
//            // .
//            // 1.3 accessText.OnVisualParentChanged 
//            // 1.3.1 Set accessText.ShouldLookupImplicitStyle
//            // 1.3.2 FindImplicitStyleResource(accessText) 
//            // 1.3.3 Set textBlock.ShouldLookupImplicitStyle 
//            // 1.3.4 FindImplicitStyleResource(textBlock)
//
//            // Notice how we end up calling FindImplicitStyleResource on the textBlock before we have set the
//            // ShouldLookupImplicitStyle flag on either accessText or textBlock. However this is still acceptable
//            // because we eventually going to synchronize the flag and the style property value on both these objects.
//
//            // Debug.Assert(!(implicitStyle != DependencyProperty.UnsetValue && fe.ShouldLookupImplicitStyles == false),
//            //     "ShouldLookupImplicitStyles is false even while there exists an implicit style in the lookup path. To be precise at source " + source); 
//
//            return implicitStyle;
//        } 
//
//        sourceOut.source = null;
//        return DependencyProperty.UnsetValue;
//    };
//
//    // FindImplicitSytle(fce) : Default: unlinkedParent, deferReference 
////    internal static object 
//    FrameworkElement.FindImplicitStyleResource = function(/*FrameworkContentElement*/ fce, /*object*/ resourceKey, sourceOut/*out object source*/) 
//    {
//        // Do a FindResource call only if someone in the ancestry has 
//        // implicit styles. This is a performance optimization.
//
//        if (fce.ShouldLookupImplicitStyles)
//        { 
//            /*object*/var unlinkedParent = null;
//            /*bool*/var allowDeferredResourceReference = false; 
//            /*bool*/var mustReturnDeferredResourceReference = false; 
//
//            // Implicit style lookup must stop at the app. 
//            /*bool*/var isImplicitStyleLookup = true;
//
//            // For non-controls the implicit StyleResource lookup must stop at
//            // the templated parent. Look at task 25606 for further details. 
//            /*DependencyObject*/var boundaryElement = fce.TemplatedParent;
//
//            /*object*/
//            var implicitStyle = FrameworkElement.FindResourceInternal(null, fce, /*FrameworkContentElement.StyleProperty*/FrameworkElement.StyleProperty, 
//            		resourceKey, unlinkedParent, allowDeferredResourceReference, mustReturnDeferredResourceReference, 
//            		boundaryElement, isImplicitStyleLookup, sourceOut/*out source*/); 
//
//            // Look at comments on the FE version of this method. 
//
//            // Debug.Assert(!(implicitStyle != DependencyProperty.UnsetValue && fce.ShouldLookupImplicitStyles == false),
//            //     "ShouldLookupImplicitStyles is false even while there exists an implicit style in the lookup path. To be precise at source " + source);
//
//            return implicitStyle;
//        } 
//
//        sourceOut.source = null;
//        return DependencyProperty.UnsetValue; 
//    };

    // Internal method for Parser to find a resource when
    // the instance is not yet hooked to the logical tree 
    // This method returns DependencyProperty.UnsetValue when
    // resource is not found. Otherwise it returns the value 
    // found. NOTE: Value resource found could be null 
    // FindResource(fe/fce)  Default: dp, unlinkedParent, deferReference, boundaryElement, source, isImplicitStyleLookup
//    internal static object 
//    FrameworkElement.FindResourceInternal = function(/*FrameworkElement*/ fe, /*FrameworkContentElement*/ fce, /*object*/ resourceKey) 
//    {
////        object source;
//
//        return FindResourceInternal(fe, 
//                                    fce,
//                                    null,   // dp, 
//                                    resourceKey, 
//                                    null,   // unlinkedParent,
//                                    false,  // allowDeferredResourceReference, 
//                                    false,  // mustReturnDeferredResourceReference,
//                                    null,   // boundaryElement,
//                                    false,  // isImplicitStyleLookup,
//                                    {"source" : null}/*out source*/); 
//    };
    
    // FindResourceInternal(fe/fce)  Defaults: none
//  internal static object 
    FrameworkElement.FindResourceInternal = function( 
      /*FrameworkElement*/        fe, 
      /*FrameworkContentElement*/ fce,
      /*DependencyProperty*/      dp, 
      /*object*/                  resourceKey,
      /*object*/                  unlinkedParent,
      /*bool*/                    allowDeferredResourceReference,
      /*bool*/                    mustReturnDeferredResourceReference, 
      /*DependencyObject*/        boundaryElement,
      /*bool*/                    isImplicitStyleLookup, 
      /*out object              source*/sourceOut) 
     {
    	if(arguments.length == 3){
//    		return FindResourceInternal(fe, 
//                    fce,
//                    null,   // dp, 
//                    dp, //resourceKey, 
//                    null,   // unlinkedParent,
//                    false,  // allowDeferredResourceReference, 
//                    false,  // mustReturnDeferredResourceReference,
//                    null,   // boundaryElement,
//                    false,  // isImplicitStyleLookup,
//                    {"source" : null}/*out source*/); 
    		resourceKey = dp;
    		dp = null;
    		unlinkedParent = null;
    		allowDeferredResourceReference = false;
    		mustReturnDeferredResourceReference = false;
    		boundaryElement = null;
    		isImplicitStyleLookup = false;
    		sourceOut = {"source" : null}; 
    	}
    	
    	/*object*/var value; 
    	/*InheritanceBehavior*/var inheritanceBehavior = InheritanceBehavior.Default;

      	try
      	{ 

          	// First try to find the resource in the tree
          	if (fe != null || fce != null || unlinkedParent != null) 
          	{
          		var inheritanceBehaviorOut = {
          			"inheritanceBehavior" :inheritanceBehavior 
          		};
          		
              	value = FrameworkElement.FindResourceInTree(fe, fce, dp, resourceKey, unlinkedParent, allowDeferredResourceReference, 
              		mustReturnDeferredResourceReference, boundaryElement,
                                /*out inheritanceBehavior*/inheritanceBehaviorOut, /*out source*/sourceOut);
              	inheritanceBehavior = inheritanceBehaviorOut.inheritanceBehavior;
              	
              	if (value != DependencyProperty.UnsetValue) 
              	{
                  	return value; 
              	} 

          	} 

          	// Then we try to find the resource in the App's Resources
          	/*Application*/var app = Application.Current;
          	if (app != null && 
          			(inheritanceBehavior == InheritanceBehavior.Default ||
          					inheritanceBehavior == InheritanceBehavior.SkipToAppNow || 
          					inheritanceBehavior == InheritanceBehavior.SkipToAppNext)) 
          	{
              	value = app.FindResourceInternal(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference); 
              	if (value != null)
              	{
              		sourceOut.source = app;

                  	return value; 
              	}
          	} 

          	// Then we try to find the resource in the SystemResources but that is only if we aren't
          	// doing an implicit style lookup. Implicit style lookup will stop at the app. 
          	if (!isImplicitStyleLookup &&
          			inheritanceBehavior != InheritanceBehavior.SkipAllNow &&
          			inheritanceBehavior != InheritanceBehavior.SkipAllNext)
          	{ 
              	value = SystemResources.FindResourceInternal(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference);
              	if (value != null) 
              	{ 
              		sourceOut.source = SystemResourceHost.Instance;


                  	return value;
              	}
          	} 
      	}
      	finally 
      	{ 
      	} 

      	sourceOut.source = null; 
      	return DependencyProperty.UnsetValue;
  	};

    // This method is used during serialization of ResourceReferenceExpressions 
    // to find out if we are indeed serializing the source application that holds the
    // resource we are refering to in the expression. 
    // The method will return the resource if found and also its corresponding
    // source application in the same scenario. Source is null when resource is
    // not found or when the resource is fetched from SystemResources
//    internal static object 
    FrameworkElement.FindResourceFromAppOrSystem = function( 
        /*object*/ resourceKey,
        /*out object source*/ sourceOut, 
        /*bool*/ disableThrowOnResourceNotFound, 
        /*bool*/ allowDeferredResourceReference,
        /*bool*/ mustReturnDeferredResourceReference) 
    {
        return FrameworkElement.FindResourceInternal(null,  // fe
                                                     null,  // fce
                                                     null,  // dp 
                                                     resourceKey,
                                                     null,  // unlinkedParent 
                                                     allowDeferredResourceReference, 
                                                     mustReturnDeferredResourceReference,
                                                     null,  // boundaryElement 
                                                     disableThrowOnResourceNotFound,
                                                     /*out source*/sourceOut);
    };


    // FindResourceInTree(fe/fce)  Defaults: none
//    internal static object 
    FrameworkElement.FindResourceInTree = function( 
        /*FrameworkElement*/        feStart,
        /*FrameworkContentElement*/ fceStart,
        /*DependencyProperty*/      dp,
        /*object*/                  resourceKey, 
        /*object*/                  unlinkedParent,
        /*bool*/                    allowDeferredResourceReference, 
        /*bool*/                    mustReturnDeferredResourceReference, 
        /*DependencyObject*/        boundaryElement,
        /*out InheritanceBehavior inheritanceBehavior*/InheritanceBehaviorOut, 
       /* out object              source*/sourceOut)
    {
        /*FrameworkObject*/var startNode = new FrameworkObject(feStart, fceStart);
        /*FrameworkObject*/var fo = startNode; 
        /*object*/var value;
        /*Style*/var style; 
        /*FrameworkTemplate*/var frameworkTemplate; 
        /*Style*/var themeStyle;
        /*int*/var loopCount = 0; 
        /*bool*/var hasParent = true;
        InheritanceBehaviorOut.inheritanceBehavior = InheritanceBehavior.Default;

        while (hasParent) 
        {
//            Debug.Assert(startNode.IsValid || unlinkedParent != null, 
//                          "Don't call FindResource with a null fe/fce and unlinkedParent"); 

//            if (loopCount > ContextLayoutManager.s_LayoutRecursionLimit) 
//            {
//                // We suspect a loop here because the loop count
//                // has exceeded the MAX_TREE_DEPTH expected
//                throw new InvalidOperationException(SR.Get(SRID.LogicalTreeLoop)); 
//            }
//            else 
//            { 
//                loopCount++;
//            } 

            // -------------------------------------------
            //  Lookup ResourceDictionary on the current instance
            // ------------------------------------------- 

            style = null; 
            frameworkTemplate = null; 
            themeStyle = null;

            if (fo.IsFE)
            {
                /*FrameworkElement*/var fe = fo.FE;

                value = fe.FindResourceOnSelf(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference);
                if (value != DependencyProperty.UnsetValue) 
                { 
                	sourceOut.source = fe;

                    return value;
                }

                if ((fe != startNode.FE) || StyleHelper.ShouldGetValueFromStyle(dp)) 
                {
                    style = fe.Style; 
                } 
                // Fetch the Template
                if ((fe != startNode.FE) || StyleHelper.ShouldGetValueFromTemplate(dp)) 
                {
                    frameworkTemplate = fe.TemplateInternal;
                }
                // Fetch the ThemeStyle 
                if ((fe != startNode.FE) || StyleHelper.ShouldGetValueFromThemeStyle(dp))
                { 
                    themeStyle = fe.ThemeStyle; 
                }
            } 
            else if (fo.IsFCE)
            {
                /*FrameworkContentElement*/var fce = fo.FCE;

                value = fce.FindResourceOnSelf(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference);
                if (value != DependencyProperty.UnsetValue) 
                { 
                	sourceOut.source = fce;

                    return value;
                }

                if ((fce != startNode.FCE) || StyleHelper.ShouldGetValueFromStyle(dp)) 
                {
                    style = fce.Style; 
                } 
                // Fetch the ThemeStyle
                if ((fce != startNode.FCE) || StyleHelper.ShouldGetValueFromThemeStyle(dp)) 
                {
                    themeStyle = fce.ThemeStyle;
                }
            } 

            if (style != null) 
            { 
                value = style.FindResource(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference);
                if (value != DependencyProperty.UnsetValue) 
                {
                	sourceOut.source = style;

                    return value; 
                } 
            }
            if (frameworkTemplate != null) 
            {
                value = frameworkTemplate.FindResource(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference);
                if (value != DependencyProperty.UnsetValue)
                { 
                	sourceOut.source = frameworkTemplate;

                    return value; 
                }
            }

            if (themeStyle != null) 
            {
                value = themeStyle.FindResource(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference); 
                if (value != DependencyProperty.UnsetValue) 
                {
                	sourceOut.source = themeStyle; 

                    return value; 
                }
            } 


            // If the current element that has been searched is the boundary element 
            // then we need to progress no further
            if (boundaryElement != null && (fo.DO == boundaryElement))
            {
                break; 
            }

            // If the current element for resource lookup is marked such 
            // then skip to the Application and/or System resources
            if (fo.IsValid && TreeWalkHelper.SkipNext(fo.InheritanceBehavior)) 
            {
            	inheritanceBehaviorOut.inheritanceBehavior = fo.InheritanceBehavior;
                break;
            } 

            // ------------------------------------------- 
            //  Find the next parent instance to lookup 
            // -------------------------------------------

            if (unlinkedParent != null)
            {
                // This is for the special case when the parser tries to fetch
                // a resource on an element even before it is hooked to the 
                // tree. In this case the parser passes us the unlinkedParent
                // to use it for resource lookup. 
                /*DependencyObject*/var unlinkedParentAsDO = unlinkedParent instanceof DependencyObject ? unlinkedParent : null; 
                if (unlinkedParentAsDO != null)
                { 
                    fo.Reset(unlinkedParentAsDO);
                    if (fo.IsValid)
                    {
                        hasParent = true; 
                    }
                    else 
                    { 
                        /*DependencyObject*/var doParent = FrameworkElement.GetFrameworkParent(unlinkedParent);
                        if (doParent != null) 
                        {
                            fo.Reset(doParent);
                            hasParent = true;
                        } 
                        else
                        { 
                            hasParent = false; 
                        }
                    } 
                }
                else
                {
                    hasParent = false; 
                }
                unlinkedParent = null; 
            } 
            else
            { 
//                Debug.Assert(fo.IsValid,
//                              "The current node being processed should be an FE/FCE");

                fo = fo.FrameworkParent; 

                hasParent = fo.IsValid; 
            } 

            // If the current element for resource lookup is marked such 
            // then skip to the Application and/or System resources
            if (fo.IsValid && TreeWalkHelper.SkipNow(fo.InheritanceBehavior))
            {
            	inheritanceBehaviorOut.inheritanceBehavior = fo.InheritanceBehavior; 
                break;
            } 
        } 

        // No matching resource was found in the tree 
        sourceOut.source = null;
        return DependencyProperty.UnsetValue;
    };


    // Searches through resource dictionaries to find a [Data|Table|ItemContainer]Template 
    //  that matches the type of the 'item' parameter.  Failing an exact 
    //  match of the type, return something that matches one of its parent
    //  types. 
//    internal static object 
    FrameworkElement.FindTemplateResourceInternal = function(/*DependencyObject*/ target, /*object*/ item, /*Type*/ templateType)
    {
        // Data styling doesn't apply to UIElement (bug 1007133).
        if (item == null || (item instanceof UIElement)) 
        {
            return null; 
        } 

        var typeOut = {
        	"type" : null
        };
        /*object*/var dataType = ContentPresenter.DataTypeForItem(item, target, typeOut/*out type*/);
        /*Type*/var type = typeOut.type;

        /*ArrayList*/var keys = new ArrayList();

        // construct the list of acceptable keys, in priority order
        var exactMatch = -1;    // number of entries that count as an exact match 

        // add compound keys for the dataType and all its base types
        while (dataType != null) 
        {
            /*object*/var key = null;
            if (templateType == ItemContainerTemplate.Type)
                key = new ItemContainerTemplateKey(dataType); 
            else if (templateType == DataTemplate.Type)
                key = new DataTemplateKey(dataType); 

            if (key != null)
                keys.Add(key); 

            // all keys added for the given item type itself count as an exact match
            if (exactMatch == -1)
                exactMatch = keys.Count; 

            if (type != null) 
            { 
                type = type.BaseType;
                if (type == Object.Type)     // don't search for Object - perf 
                    type = null;
            }

            dataType = type; 
        }

        /*int*/var bestMatch = keys.Count; // index of best match so far 
        var bestMatchRef = {
        	"bestMatch" : bestMatch	
        };
        // Search the parent chain 
        /*object*/var resource = FindTemplateResourceInTree(target, keys, exactMatch, bestMatchRef/*ref bestMatch*/);
        bestMatch = bestMatchRef.bestMatch;

        if (bestMatch >= exactMatch)
        { 
            // Exact match not found in the parent chain.  Try App and System Resources.
            /*object*/var appResource = Helper.FindTemplateResourceFromAppOrSystem(target, keys, exactMatch, bestMatchRef /*ref bestMatch*/); 

            if (appResource != null)
                resource = appResource; 
        }

        return resource;
    }; 

    // Search the parent chain for a [Data|Table]Template in a ResourceDictionary. 
//    private static object 
    function FindTemplateResourceInTree(/*DependencyObject*/ target, /*ArrayList*/ keys, /*int*/ exactMatch, bestMatchRef/*ref int bestMatch*/) 
    {
//        Debug.Assert(target != null, "Don't call FindTemplateResource with a null target object"); 

        /*ResourceDictionary*/var table;
        /*object*/var resource = null;

        /*FrameworkObject*/var fo = new FrameworkObject(target);
//        Debug.Assert(fo.IsValid, "Don't call FindTemplateResource with a target object that is neither a FrameworkElement nor a FrameworkContentElement"); 

        while (fo.IsValid)
        { 
            /*object*/var candidate;

            // -------------------------------------------
            //  Lookup ResourceDictionary on the current instance 
            // -------------------------------------------

            // Fetch the ResourceDictionary 
            // for the given target element
            table = GetInstanceResourceDictionary(fo.FE, fo.FCE); 
            if( table != null )
            {
                candidate = FindBestMatchInResourceDictionary( table, keys, exactMatch, bestMatchRef/*ref bestMatch*/ );
                if (candidate != null) 
                {
                    resource = candidate; 
                    if (bestMatchRef.bestMatch < exactMatch) 
                    {
                        // Exact match found, stop here. 
                        return resource;
                    }
                }
            } 

            // ------------------------------------------- 
            //  Lookup ResourceDictionary on the current instance's Style, if one exists. 
            // -------------------------------------------

            table = GetStyleResourceDictionary(fo.FE, fo.FCE);
            if( table != null )
            {
                candidate = FindBestMatchInResourceDictionary( table, keys, exactMatch, bestMatchRef/*ref bestMatch*/ ); 
                if (candidate != null)
                { 
                    resource = candidate; 
                    if (bestMatchRef.bestMatch < exactMatch)
                    { 
                        // Exact match found, stop here.
                        return resource;
                    }
                } 
            }

            // ------------------------------------------- 
            //  Lookup ResourceDictionary on the current instance's Theme Style, if one exists.
            // ------------------------------------------- 

            table = GetThemeStyleResourceDictionary(fo.FE, fo.FCE);
            if( table != null )
            { 
                candidate = FindBestMatchInResourceDictionary( table, keys, exactMatch, bestMatchRef/*ref bestMatch*/ );
                if (candidate != null) 
                { 
                    resource = candidate;
                    if (bestMatchRef.bestMatch < exactMatch) 
                    {
                        // Exact match found, stop here.
                        return resource;
                    } 
                }
            } 

            // -------------------------------------------
            //  Lookup ResourceDictionary on the current instance's Template, if one exists. 
            // -------------------------------------------

            table = GetTemplateResourceDictionary(fo.FE, fo.FCE);
            if( table != null ) 
            {
                candidate = FindBestMatchInResourceDictionary( table, keys, exactMatch, bestMatchRef/*ref bestMatch*/ ); 
                if (candidate != null) 
                {
                    resource = candidate; 
                    if (bestMatchRef.bestMatch < exactMatch)
                    {
                        // Exact match found, stop here.
                        return resource; 
                    }
                } 
            } 

            // If the current element for resource lookup is marked such then abort 
            // lookup because resource lookup does not span tree boundaries
            if (fo.IsValid && TreeWalkHelper.SkipNext(fo.InheritanceBehavior))
            {
                break; 
            }

            // ------------------------------------------- 
            //  Find the next parent instance to lookup
            // ------------------------------------------- 

            // Get Framework Parent
            fo = fo.FrameworkParent;

            // If the next parent for resource lookup is marked such then abort
            // lookup because resource lookup does not span tree boundaries 
            if (fo.IsValid && TreeWalkHelper.SkipNext(fo.InheritanceBehavior)) 
            {
                break; 
            }
        }

        return resource; 
    }

    // Given a ResourceDictionary and a set of keys, try to find the best 
    //  match in the resource dictionary.
//    private static object 
    function FindBestMatchInResourceDictionary( 
        /*ResourceDictionary*/ table, /*ArrayList*/ keys, /*int*/ exactMatch, bestMatchRef/*ref int bestMatch*/)
    {
        var resource = null;
        var k; 

        // Search target element's ResourceDictionary for the resource 
        if (table != null) 
        {
            for (k = 0;  k < bestMatchRef.bestMatch;  ++k) 
            {
                /*object*/var candidate = table.Get(keys.Get(k));
                if (candidate != null)
                { 
                    resource = candidate;
                    bestMatchRef.bestMatch = k; 

                    // if we found an exact match, no need to continue
                    if (bestMatchRef.bestMatch < exactMatch) 
                        return resource;
                }
            }
        } 

        return resource; 
    } 

    // Return a reference to the ResourceDictionary set on the instance of 
    //  the given Framework(Content)Element, if such a ResourceDictionary exists.
//    private static ResourceDictionary 
    function GetInstanceResourceDictionary(/*FrameworkElement*/ fe, /*FrameworkContentElement*/ fce)
    {
        /*ResourceDictionary*/var table = null; 

        if (fe != null) 
        { 
            if (fe.HasResources)
            { 
                table = fe.Resources;
            }
        }
        else // (fce != null) 
        {
            if (fce.HasResources) 
            { 
                table = fce.Resources;
            } 
        }

        return table;
    } 

    // Return a reference to the ResourceDictionary attached to the Style of 
    //  the given Framework(Content)Element, if such a ResourceDictionary exists. 
//    private static ResourceDictionary 
    function GetStyleResourceDictionary(/*FrameworkElement*/ fe, /*FrameworkContentElement*/ fce)
    { 
        /*ResourceDictionary*/var table = null;

        if (fe != null)
        { 
            if( fe.Style != null && 
                fe.Style._resources != null )
            {
                table = fe.Style._resources;
            } 
        }
        else // (fce != null) 
        {
            if( fce.Style != null && 
                fce.Style._resources != null ) 
            {
                table = fce.Style._resources; 
            }
        }

        return table; 
    }

    // Return a reference to the ResourceDictionary attached to the Theme Style of
    //  the given Framework(Content)Element, if such a ResourceDictionary exists.
//    private static ResourceDictionary 
    function GetThemeStyleResourceDictionary(/*FrameworkElement*/ fe, /*FrameworkContentElement*/ fce)
    { 
        /*ResourceDictionary*/var table = null;

        if (fe != null) 
        {
            if( fe.ThemeStyle != null && 
                fe.ThemeStyle._resources != null )
            { 
                table = fe.ThemeStyle._resources; 
            }
        }
        else // (fce != null) 
        {
            if( fce.ThemeStyle != null &&
                fce.ThemeStyle._resources != null )
            {
                table = fce.ThemeStyle._resources; 
            }
        } 

        return table;
    }

    // Return a reference to the ResourceDictionary attached to the Template of
    //  the given Framework(Content)Element, if such a ResourceDictionary exists. 
//    private static ResourceDictionary 
    function GetTemplateResourceDictionary(/*FrameworkElement*/ fe, /*FrameworkContentElement*/ fce) 
    {
        /*ResourceDictionary*/var table = null; 

        if (fe != null)
        {
            if( fe.TemplateInternal != null && 
                fe.TemplateInternal._resources != null )
            { 
                table = fe.TemplateInternal._resources; 
            }
        } 

        return table;
    }

//    // Finds the nearest NameScope by walking up the logical tree
////    internal static INameScope 
//    FrameworkElement.FindScope(/*DependencyObject*/ d)
//    { 
////        DependencyObject scopeOwner;
//        return FindScope(d, {"scopeOwner" : null}/*out scopeOwner*/); 
//    };

    // Finds the nearest NameScope by walking up the logical tree 
//    internal static INameScope 
    FrameworkElement.FindScope = function(/*DependencyObject*/ d, scopeOwnerOut/*out DependencyObject scopeOwner*/)
    {
    	if(scopeOwnerOut === undefined){
    		scopeOwnerOut = {"scopeOwner" : null};
    	}
    	
        while (d != null)
        { 
            /*INameScope*/
        	var nameScope = NameScope.NameScopeFromObject(d);
            if (nameScope != null) 
            { 
            	scopeOwnerOut.scopeOwner = d;
                return nameScope; 
            }

            /*DependencyObject*/
            var parent = LogicalTreeHelper.GetParent(d);

            d = (parent != null) ? parent : Helper.FindMentor(d.InheritanceContext);
        } 

        scopeOwnerOut.scopeOwner = null;
        return null; 
    };

    //
    // Get the closest Framework type up the logical or physical tree 
    // 
    // (Shared between FrameworkElement and FrameworkContentElement)
    // 
//    internal static DependencyObject 
    FrameworkElement.GetFrameworkParent = function(/*object*/ current)
    {
        /*FrameworkObject*/var fo = new FrameworkObject(current instanceof DependencyObject ? current : null);

        fo = fo.FrameworkParent;

        return fo.DO; 
    };

//    internal static bool 
    FrameworkElement.GetFrameworkParent1 = function(/*FrameworkElement*/ current, 
    		feParentOut,/*out FrameworkElement feParent*/ 
    		fceParentOut/*out FrameworkContentElement fceParent*/)
    {
    	/*FrameworkObject*/var fo = new FrameworkObject(current, null);

        fo = fo.FrameworkParent;

        feParentOut.feParent = fo.FE; 
        fceParentOut.fceParent = fo.FCE;

        return fo.IsValid;
    };


//    internal static bool 
    FrameworkElement.GetFrameworkParent2 = function(/*FrameworkContentElement*/ current, 
    		/*out FrameworkElement feParent*/feParentOut,
    		/*out FrameworkContentElement fceParent*/fceParentOut)
    { 
        var fo = new FrameworkObject(null, current); 

        fo = fo.FrameworkParent; 

        feParentOut.feParent = fo.FE;
        feParentOut.fceParent = fo.FCE;

        return fo.IsValid;
    };
    

//    internal static bool 
    FrameworkElement.GetContainingFrameworkElement = function(/*DependencyObject*/ current, 
    		/*out FrameworkElement fe*/feOut, 
    		/*out FrameworkContentElement fce*/fceOut)
    { 
        /*FrameworkObject*/var fo = FrameworkObject.GetContainingFrameworkElement(current);

        if (fo.IsValid)
        { 
        	feOut.fe = fo.FE;
        	fceOut.fce = fo.FCE; 
            return true; 
        }
        else 
        {
        	feOut.fe = null;
        	fceOut.fce = null;
            return false; 
        }
    }; 


    // Fetchs the specified childRecord for the given template.  Returns true if successful. 
//    internal static void 
    FrameworkElement.GetTemplatedParentChildRecord = function(
        /*DependencyObject*/ templatedParent,
        /*int*/ childIndex,
        /*out ChildRecord childRecord*/childRecordOut, 
        /*out bool isChildRecordValid*/isChildRecordValidOut)
    { 
        /*FrameworkTemplate*/var templatedParentTemplate = null; 
        isChildRecordValidOut.isChildRecordValid = false;
        childRecordOut.childRecord = new ChildRecord();    // CS0177 

        if (templatedParent != null)
        {
            /*FrameworkObject*/var foTemplatedParent = new FrameworkObject(templatedParent, true); 

//            Debug.Assert( foTemplatedParent.IsFE ); 

            // This node is the result of a style expansion

            // Pick the owner for the VisualTree that generated this node
            templatedParentTemplate = foTemplatedParent.FE.TemplateInternal;

//            Debug.Assert(templatedParentTemplate != null , 
//                "If this node is the result of a VisualTree expansion then it should have a parent template");

            // Check if this Child Index is represented in FrameworkTemplate 
            if (templatedParentTemplate != null && ((0 <= childIndex) && (childIndex < templatedParentTemplate.ChildRecordFromChildIndex.Count)))
            { 
            	childRecordOut.childRecord = templatedParentTemplate.ChildRecordFromChildIndex[childIndex];
            	isChildRecordValidOut.isChildRecordValid = true;
            }

        }
    };

    

//    private static void 
    function TextRenderingMode_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        FrameworkElement fe = (FrameworkElement) d; 
        d.pushTextRenderingMode();
    } 

//    private static void 
    function OnDataContextChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        if (e.NewValue == BindingExpressionBase.DisconnectedItem)
            return;

        /*((FrameworkElement) d)*/d.RaiseDependencyPropertyChanged(FrameworkElement.DataContextChangedKey, e);
    } 

    // Add Style TargetType and FEF EventHandlers to the EventRoute 
//    internal static void 
    FrameworkElement.AddStyleHandlersToEventRoute = function(
        /*FrameworkElement*/ fe,
        /*FrameworkContentElement*/ fce,
        /*EventRoute*/ route, 
        /*RoutedEventArgs*/ args)
    { 
//        Debug.Assert(fe != null || fce != null); 

        /*DependencyObject*/var source = (fe != null) ? fe : fce; 
        /*Style*/var selfStyle = null;
        /*FrameworkTemplate*/var selfFrameworkTemplate = null;
        /*DependencyObject*/var templatedParent = null;
        /*int*/var templateChildIndex = -1; 

        // Fetch selfStyle, TemplatedParent and TemplateChildIndex 
        if (fe != null) 
        {
            selfStyle = fe.Style; 
            selfFrameworkTemplate = fe.TemplateInternal;
            templatedParent = fe.TemplatedParent;
            templateChildIndex = fe.TemplateChildIndex;
        } 
        else
        { 
            selfStyle = fce.Style; 
            templatedParent = fce.TemplatedParent;
            templateChildIndex = fce.TemplateChildIndex; 
        }

        // Add TargetType EventHandlers to the route. Notice that ThemeStyle
        // cannot have EventHandlers and hence are ignored here. 
        /*RoutedEventHandlerInfo[]*/var handlers = null;
        if (selfStyle != null && selfStyle.EventHandlersStore != null) 
        { 
            handlers = selfStyle.EventHandlersStore.GetRoutedEventHandlers(args.RoutedEvent);
            AddStyleHandlersToEventRoute(route, source, handlers); 
        }
        if (selfFrameworkTemplate != null && selfFrameworkTemplate.EventHandlersStore != null)
        {
            handlers = selfFrameworkTemplate.EventHandlersStore.GetRoutedEventHandlers(args.RoutedEvent); 
            AddStyleHandlersToEventRoute(route, source, handlers);
        } 

        if (templatedParent != null)
        { 
            /*FrameworkTemplate*/var templatedParentTemplate = null;

            /*FrameworkElement*/var feTemplatedParent = templatedParent instanceof FrameworkElement ? templatedParent : null;
//            Debug.Assert( feTemplatedParent != null ); 

            templatedParentTemplate = feTemplatedParent.TemplateInternal; 

            // Fetch handlers from either the parent style or template
            handlers = null; 
            if (templatedParentTemplate != null && templatedParentTemplate.HasEventDependents)
            {
                handlers = StyleHelper.GetChildRoutedEventHandlers(templateChildIndex, args.RoutedEvent, /*ref*/ templatedParentTemplate.EventDependents);
            } 

            // Add FEF EventHandlers to the route 
            AddStyleHandlersToEventRoute(route, source, handlers); 
        }
    };

    // This is a helper that will facilitate adding a given array of handlers to the route
//    private static void 
    function AddStyleHandlersToEventRoute(
        /*EventRoute*/ route, 
        /*DependencyObject*/ source,
        /*RoutedEventHandlerInfo[]*/ handlers) 
    { 
        if (handlers != null)
        { 
            for (var i=0; i<handlers.length; i++)
            {
                route.Add(source, handlers[i].Handler, handlers[i].InvokeHandledEventsToo);
            } 
        }
    };

//    internal static bool 
    FrameworkElement.InvalidateAutomationIntermediateElements = function( 
        /*DependencyObject*/ mergePoint, 
        /*DependencyObject*/ modelTreeNode)
    { 
        while (modelTreeNode != null && modelTreeNode != mergePoint)
        { 
            // Get model parent
            modelTreeNode = LogicalTreeHelper.GetParent(modelTreeNode); 
        }

        return true; 
    };

//    private static object 
    function GetActualWidth(/*DependencyObject*/ d, /*out BaseValueSourceInternal source*/sourceOut)
    { 
        if (d.HasWidthEverChanged)
        { 
        	sourceOut.source = BaseValueSourceInternal.Local;
            return d.RenderSize.Width;
        }
        else 
        {
        	sourceOut.source = BaseValueSourceInternal.Default; 
            return 0; 
        }
    } 

//    private static object 
    function GetActualHeight(/*DependencyObject*/ d, sourceOut/*out BaseValueSourceInternal source*/)
   { 
        if (d.HasHeightEverChanged)
        { 
        	sourceOut.source = BaseValueSourceInternal.Local;
            return d.RenderSize.Height;
        }
        else 
        {
        	sourceOut.source = BaseValueSourceInternal.Default; 
            return 0; 
        }
    } 

//    private static bool 
    function IsWidthHeightValid(/*object*/ value) 
    { 
    	return true;
    }

//    private static bool 
    function IsMinWidthHeightValid(/*object*/ value)
    { 
    	return true;
    } 

//    private static bool 
    function IsMaxWidthHeightValid(/*object*/ value) 
    {
    	return true;
    } 

//    private static FrameworkServices 
    function EnsureFrameworkServices() 
    {
        if (FrameworkElement._frameworkServices == null) 
        { 
            // Enable KeyboardNavigation, ContextMenu, and ToolTip services.
        	FrameworkElement._frameworkServices = new FrameworkServices(); 
        }

        return FrameworkElement._frameworkServices;
    } 


//    private static bool 
    function IsMarginValid(/*object*/ value) 
    {
//        Thickness m = (Thickness)value; 
        return m.IsValid(true, false, true, false);
    }

//    internal static bool 
    FrameworkElement.ValidateHorizontalAlignmentValue = function(/*object*/ value)
    { 
        return (    value == HorizontalAlignment.Left
                ||  value == HorizontalAlignment.Center 
                ||  value == HorizontalAlignment.Right
                ||  value == HorizontalAlignment.Stretch   );
    };

//    internal static bool 
    FrameworkElement.ValidateVerticalAlignmentValue = function(/*object*/ value)
    {
        return (    value == VerticalAlignment.Top 
                ||  value == VerticalAlignment.Center
                ||  value == VerticalAlignment.Bottom 
                ||  value == VerticalAlignment.Stretch); 
    };

    // If the cursor is changed, we may need to set the actual cursor. 
//    static private void 
    function OnCursorChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        if(d.IsMouseOver)
        { 
            Mouse.UpdateCursor(); 
        }
    } 

    // If the ForceCursor property changed, we may need to set the actual cursor.
//    static private void 
    function OnForceCursorChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        if(d.IsMouseOver) 
        {
            Mouse.UpdateCursor(); 
        } 
    }

//    private static void 
    function OnQueryCursorOverride(/*object*/ sender, /*QueryCursorEventArgs*/ e)
    {
        // We respond to querying the cursor by specifying the cursor set
        // as a property on this element. 
        /*Cursor*/var cursor = sender.Cursor; 

        if(cursor != null) 
        {
            // We specify the cursor if the QueryCursor event is not
            // handled by the time it gets to us, or if we are configured
            // to force our cursor anyways.  Since the QueryCursor event 
            // bubbles, this has the effect of overriding whatever cursor
            // a child of ours specified. 
            if(!e.Handled || sender.ForceCursor) 
            {
                e.Cursor = cursor; 
                e.Handled = true;
            }
        }
    } 

//    private static void 
    function OnPreviewGotKeyboardFocus(/*object*/ sender, /*KeyboardFocusChangedEventArgs*/ e)
    { 
        if (e.OriginalSource == sender)
        { 
            /*FrameworkElement*/var fe = sender; 

            // If element has an FocusedElement we need to delegate focus to it 
            // and handle the event if focus successfully delegated
            /*IInputElement*/var activeElement = FocusManager.GetFocusedElement(fe, true);
            if (activeElement != null && activeElement != sender && Keyboard.IsFocusable(activeElement instanceof DependencyObject ? activeElement : null))
            { 
                /*IInputElement*/var oldFocus = Keyboard.FocusedElement;
                activeElement.Focus(); 
                // If focus is set to activeElement or delegated - handle the event 
                if (Keyboard.FocusedElement == activeElement || Keyboard.FocusedElement != oldFocus)
                { 
                    e.Handled = true;
                    return;
                }
            } 
        }
    } 

//    private static void 
    function OnGotKeyboardFocus(/*object*/ sender, /*KeyboardFocusChangedEventArgs*/ e)
    { 
        // This static class handler will get hit each time anybody gets hit with a tunnel that someone is getting focused.
        // We're only interested when the element is getting focused is processing the event.
        // NB: This will not do the right thing if the element rejects focus or does not want to be scrolled into view.
        if (sender == e.OriginalSource) 
        {
            /*FrameworkElement*/var fe = sender; 
            KeyboardNavigation.UpdateFocusedElement(fe); 

            /*KeyboardNavigation*/var keyNav = KeyboardNavigation.Current; 
            KeyboardNavigation.ShowFocusVisual();
            keyNav.NotifyFocusChanged(fe, e);
            keyNav.UpdateActiveElement(fe);
        } 
    }

//    private static void 
    function OnLostKeyboardFocus(/*object*/ sender, /*KeyboardFocusChangedEventArgs*/ e) 
    {
        if (sender == e.OriginalSource) 
        {
            KeyboardNavigation.Current.HideFocusVisual();

            if (e.NewFocus == null) 
            {
                KeyboardNavigation.Current.NotifyFocusChanged(sender, e); 
            } 
        }
    } 

//    private static void 
    function NumberSubstitutionChanged(/*DependencyObject*/ o, /*DependencyPropertyChangedEventArgs*/ e)
    {
        /*((FrameworkElement) o)*/o.HasNumberSubstitutionChanged = true;
    } 

    // Returns true when the coerce callback should return the current system metric 
//    private static bool 
    function ShouldUseSystemFont(/*FrameworkElement*/ fe, /*DependencyProperty*/ dp) 
    {
//        bool hasModifiers; 

        // Return the current system font when (changing the system theme OR creating an element and the default is outdated)
        // AND the element is a root AND the element has not had a value set on it by the user
        return  (SystemResources.SystemResourcesAreChanging || (fe.ReadInternalFlag(InternalFlags.CreatingRoot) && SystemResources.SystemResourcesHaveChanged)) && 
                 fe._parent1 == null && VisualTreeHelper.GetParent(fe) == null &&
                 fe.GetValueSource(dp, null, {"hasModifiers" : null}/*out hasModifiers*/) == BaseValueSourceInternal.Default; 
    } 

    // Coerce Font properties on root elements when created or System resources change 
//    private static object 
    function CoerceFontFamily(/*DependencyObject*/ o, /*object*/ value)
    {
        // For root elements with default values, return current system metric if local value has not been set
        if (ShouldUseSystemFont(o, TextElement.FontFamilyProperty)) 
        {
            return SystemFonts.MessageFontFamily; 
        } 

        return value; 
    }

//    private static object 
    function CoerceFontSize(/*DependencyObject*/ o, /*object*/ value)
    { 
        // For root elements with default values, return current system metric if local value has not been set
        if (ShouldUseSystemFont(o, TextElement.FontSizeProperty)) 
        { 
            return SystemFonts.MessageFontSize;
        } 

        return value;
    }

//    private static object 
    function CoerceFontStyle(/*DependencyObject*/ o, /*object*/ value)
    { 
        // For root elements with default values, return current system metric if local value has not been set 
        if (ShouldUseSystemFont(o, TextElement.FontStyleProperty))
        { 
            return SystemFonts.MessageFontStyle;
        }

        return value; 
    }

//    private static object 
    function CoerceFontWeight(/*DependencyObject*/ o, /*object*/ value) 
    {
        // For root elements with default values, return current system metric if local value has not been set 
        if (ShouldUseSystemFont(o, TextElement.FontWeightProperty))
        {
            return SystemFonts.MessageFontWeight;
        } 

        return value; 
    } 

//    private static void 
    function OnToolTipOpeningThunk(/*object*/ sender, /*ToolTipEventArgs*/ e)
    {
    	sender.OnToolTipOpening(e);
    } 

//    private static void 
    function OnToolTipClosingThunk(/*object*/ sender, /*ToolTipEventArgs*/ e) 
    { 
        sender.OnToolTipClosing(e);
    } 

//    private static void 
    function OnContextMenuOpeningThunk(/*object*/ sender, /*ContextMenuEventArgs*/ e)
    { 
        sender.OnContextMenuOpening(e);
    } 

//    private static void 
    function OnContextMenuClosingThunk(/*object*/ sender, /*ContextMenuEventArgs*/ e)
    { 
        sender.OnContextMenuClosing(e);
    } 


//    internal static void 
    FrameworkElement.AddIntermediateElementsToRoute = function( 
        /*DependencyObject*/ mergePoint,
        /*EventRoute*/ route, 
        /*RoutedEventArgs*/ args,
        /*DependencyObject*/ modelTreeNode)
    {
        while (modelTreeNode != null && modelTreeNode != mergePoint) 
        {
            /*UIElement*/
        	var uiElement = modelTreeNode instanceof UIElement ? modelTreeNode : null; 
            /*ContentElement*/
        	var contentElement = modelTreeNode instanceof ContentElement ? modelTreeNode : null; 

            if(uiElement != null)
            {
                uiElement.AddToEventRoute(route, args);

                /*FrameworkElement*/var fe = uiElement instanceof FrameworkElement ? uiElement : null;
                if (fe != null) 
                { 
                	FrameworkElement.AddStyleHandlersToEventRoute(fe, null, route, args);
                } 
            }
            else if (contentElement != null)
            {
                contentElement.AddToEventRoute(route, args); 

                /*FrameworkContentElement*/var fce = contentElement instanceof FrameworkContentElement ? contentElement : null; 
                if (fce != null) 
                {
                	FrameworkElement.AddStyleHandlersToEventRoute(null, fce, route, args); 
                }
            }

            // Get model parent
            modelTreeNode = LogicalTreeHelper.GetParent(modelTreeNode); 
        }
    };
    
//    private static void 
    function OnTransformDirty(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        // Callback for MinWidth, MaxWidth, Width, MinHeight, MaxHeight, Height, and RenderTransformOffset
//        FrameworkElement fe = (FrameworkElement)d; 
        d.AreTransformsClean = false;
    }
    
//    static FrameworkElement() 
    function Initialize()
    {
//        SnapsToDevicePixelsProperty.OverrideMetadata(FrameworkElement.Type, new FrameworkPropertyMetadata(BooleanBoxes.FalseBox, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsArrange));

        EventManager.RegisterClassHandler(FrameworkElement.Type, Mouse.QueryCursorEvent, new QueryCursorEventHandler(FrameworkElement.OnQueryCursorOverride), true); 

        EventManager.RegisterClassHandler(FrameworkElement.Type, Keyboard.PreviewGotKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(null, OnPreviewGotKeyboardFocus)); 
        EventManager.RegisterClassHandler(FrameworkElement.Type, Keyboard.GotKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(null, OnGotKeyboardFocus)); 
        EventManager.RegisterClassHandler(FrameworkElement.Type, Keyboard.LostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(null, OnLostKeyboardFocus));

//        AllowDropProperty.OverrideMetadata(FrameworkElement.Type, new FrameworkPropertyMetadata(BooleanBoxes.FalseBox, FrameworkPropertyMetadataOptions.Inherits));

//        Stylus.IsPressAndHoldEnabledProperty.AddOwner(FrameworkElement.Type, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits));
//        Stylus.IsFlicksEnabledProperty.AddOwner(FrameworkElement.Type, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits)); 
//        Stylus.IsTapFeedbackEnabledProperty.AddOwner(FrameworkElement.Type, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits));
//        Stylus.IsTouchFeedbackEnabledProperty.AddOwner(FrameworkElement.Type, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits)); 

//        PropertyChangedCallback numberSubstitutionChanged = new PropertyChangedCallback(NumberSubstitutionChanged);
//        NumberSubstitution.CultureSourceProperty.OverrideMetadata(FrameworkElement.Type, new FrameworkPropertyMetadata(NumberCultureSource.User, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, numberSubstitutionChanged)); 
//        NumberSubstitution.CultureOverrideProperty.OverrideMetadata(FrameworkElement.Type, new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, numberSubstitutionChanged));
//        NumberSubstitution.SubstitutionProperty.OverrideMetadata(FrameworkElement.Type, new FrameworkPropertyMetadata(NumberSubstitutionMethod.AsCulture, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, numberSubstitutionChanged));

        // Exposing these events in protected virtual methods 
        EventManager.RegisterClassHandler(FrameworkElement.Type, FrameworkElement.ToolTipOpeningEvent, new ToolTipEventHandler(null, OnToolTipOpeningThunk));
        EventManager.RegisterClassHandler(FrameworkElement.Type, FrameworkElement.ToolTipClosingEvent, new ToolTipEventHandler(null, OnToolTipClosingThunk)); 
        EventManager.RegisterClassHandler(FrameworkElement.Type, FrameworkElement.ContextMenuOpeningEvent, new ContextMenuEventHandler(null, OnContextMenuOpeningThunk)); 
        EventManager.RegisterClassHandler(FrameworkElement.Type, FrameworkElement.ContextMenuClosingEvent, new ContextMenuEventHandler(null, OnContextMenuClosingThunk));

//        // Coerce Callback for font properties for responding to system themes
//        TextElement.FontFamilyProperty.OverrideMetadata(FrameworkElement.Type, 
//        		new FrameworkPropertyMetadata(SystemFonts.MessageFontFamily, FrameworkPropertyMetadataOptions.Inherits, null, new CoerceValueCallback(CoerceFontFamily)));
//        TextElement.FontSizeProperty.OverrideMetadata(FrameworkElement.Type, 
//        		new FrameworkPropertyMetadata(SystemFonts.MessageFontSize, FrameworkPropertyMetadataOptions.Inherits, null, new CoerceValueCallback(CoerceFontSize)));
//        TextElement.FontStyleProperty.OverrideMetadata(FrameworkElement.Type,
//        		new FrameworkPropertyMetadata(SystemFonts.MessageFontStyle, FrameworkPropertyMetadataOptions.Inherits, null, new CoerceValueCallback(CoerceFontStyle))); 
//        TextElement.FontWeightProperty.OverrideMetadata(FrameworkElement.Type, 
//        		new FrameworkPropertyMetadata(SystemFonts.MessageFontWeight, FrameworkPropertyMetadataOptions.Inherits, null, new CoerceValueCallback(CoerceFontWeight)));
//
//        TextOptions.TextRenderingModeProperty.OverrideMetadata( 
//        		FrameworkElement.Type,
//            new FrameworkPropertyMetadata( 
//                new PropertyChangedCallback(TextRenderingMode_Changed)));

    };
	
	FrameworkElement.Type = new Type("FrameworkElement", FrameworkElement, 
			[UIElement.Type, IFrameworkInputElement.Type, IInputElement.Type, ISupportInitialize.Type]);
	return FrameworkElement;
});


//        // ThemeStyle used only when a ThemeStyleKey is specified (per-instance data in ThemeStyleDataField) 
//        private Style _themeStyleCache;
// 
//        // Layout 
//        private static readonly UncommonField<SizeBox> UnclippedDesiredSizeField = new UncommonField<SizeBox>();
//        private static readonly UncommonField<LayoutTransformData> LayoutTransformDataField = new UncommonField<LayoutTransformData>(); 
//
//        // Style/Template state (internals maintained by Style, per-instance data in StyleDataField)
//        private  Style       _styleCache;
// 

// 
//        internal DependencyObject _templatedParent;    // Non-null if this object was created as a result of a Template.VisualTree
//        private UIElement _templateChild;                // Non-null if this FE has a child that was created as part of a template. 
//
//        private InternalFlags       _flags     = 0; // Stores Flags (see Flags enum)
//        private InternalFlags2      _flags2    = InternalFlags2.Default; // Stores Flags (see Flags enum)
// 
//        // Optimization, to avoid calling FromSystemType too often
//        internal static DependencyObjectType UIElementDType = DependencyObjectType.FromSystemTypeInternal(typeof(UIElement)); 
//        private static DependencyObjectType _controlDType = null; 
//        private static DependencyObjectType _contentPresenterDType = null;
//        private static DependencyObjectType _pageFunctionBaseDType = null; 
//        private static DependencyObjectType _pageDType = null;
//
//        // KeyboardNavigation, ContextMenu, and ToolTip
//        private static FrameworkServices _frameworkServices;
//    }
// 
//    // LayoutDoubleUtil, uses fixed eps unlike DoubleUtil which uses relative one. 
//    // This is more suitable for some layout comparisons because the computation
//    // paths in layout may easily be quite long so DoubleUtil method gives a lot of false 
//    // results, while bigger absolute deviation is normally harmless in layout.
//    // Note that FP noise is a big problem and using any of these compare methods is
//    // not a complete solution, but rather the way to reduce the probability
//    // of the dramatically bad-looking results. 
//    internal static class LayoutDoubleUtil
//    { 
//        private const double eps = 0.00000153; //more or less random more or less small number 
//
//        internal static bool AreClose(double value1, double value2) 
//        {
//            if(value1 == value2) return true;
//
//            double diff = value1 - value2; 
//            return (diff < eps) && (diff > -eps);
//        } 
// 
//        internal static bool LessThan(double value1, double value2)
//        { 
//            return (value1 < value2) && !AreClose(value1, value2);
//        }
//    }
// 
//    internal enum InternalFlags : uint
//    { 
//        // Does the instance have ResourceReference properties 
//        HasResourceReferences       = 0x00000001,
// 
//        HasNumberSubstitutionChanged = 0x00000002,
//
//        // Is the style for this instance obtained from a
//        // typed-style declared in the Resources 
//        HasImplicitStyleFromResources   = 0x00000004,
//        InheritanceBehavior0            = 0x00000008, 
//        InheritanceBehavior1            = 0x00000010, 
//        InheritanceBehavior2            = 0x00000020,
// 
//        IsStyleUpdateInProgress         = 0x00000040,
//        IsThemeStyleUpdateInProgress    = 0x00000080,
//        StoresParentTemplateValues     = 0x00000100,
// 
//        // free bit = 0x00000200,
//        NeedsClipBounds             = 0x00000400, 
// 
//        HasWidthEverChanged        = 0x00000800,
//        HasHeightEverChanged        = 0x00001000, 
//        // free bit = 0x00002000,
//        // free bit = 0x00004000,
//
//        // Has this instance been initialized 
//        IsInitialized               = 0x00008000,
// 
//        // Set on BeginInit and reset on EndInit 
//        InitPending                 = 0x00010000,
// 
//        IsResourceParentValid       = 0x00020000,
//        // free bit                     0x00040000,
//
//        // This flag is set to true when this FrameworkElement is in the middle 
//        //  of an invalidation storm caused by InvalidateTree for ancestor change,
//        //  so we know not to trigger another one. 
//        AncestorChangeInProgress    = 0x00080000, 
//
//        // This is used when we know that we're in a subtree whose visibility 
//        //  is collapsed.  A false here does not indicate otherwise.  A false
//        //  merely indicates "we don't know".
//        InVisibilityCollapsedTree   = 0x00100000,
// 
//        HasStyleEverBeenFetched         = 0x00200000,
//        HasThemeStyleEverBeenFetched    = 0x00400000, 
// 
//        HasLocalStyle                    = 0x00800000,
// 
//        // This instance's Visual or logical Tree was generated by a Template
//        HasTemplateGeneratedSubTree    = 0x01000000,
//
//        // free bit   = 0x02000000, 
//
//        HasLogicalChildren                    = 0x04000000, 
// 
//        // Are we in the process of iterating the logical children.
//        // This flag is set during a descendents walk, for property invalidation. 
//        IsLogicalChildrenIterationInProgress   = 0x08000000,
//
//        //Are we creating a new root after system metrics have changed?
//        CreatingRoot                 = 0x10000000, 
//
//        // FlowDirection is set to RightToLeft (0 == LeftToRight, 1 == RightToLeft) 
//        // This is an optimization to speed reading the FlowDirection property 
//        IsRightToLeft               = 0x20000000,
// 
//        ShouldLookupImplicitStyles  = 0x40000000,
//
//        // This flag is set to true there are mentees listening to either the
//        // InheritedPropertyChanged event or the ResourcesChanged event. Once 
//        // this flag is set to true it does not get reset after that.
// 
//        PotentiallyHasMentees        = 0x80000000, 
//    }
// 
//    [Flags]
//    internal enum InternalFlags2 : uint
//    {
//        // RESERVED: Bits 0-15  (0x0000FFFF): TemplateChildIndex 
//        R0                          = 0x00000001,
//        R1                          = 0x00000002, 
//        R2                          = 0x00000004, 
//        R3                          = 0x00000008,
//        R4                          = 0x00000010, 
//        R5                          = 0x00000020,
//        R6                          = 0x00000040,
//        R7                          = 0x00000080,
//        R8                          = 0x00000100, 
//        R9                          = 0x00000200,
//        RA                          = 0x00000400, 
//        RB                          = 0x00000800, 
//        RC                          = 0x00001000,
//        RD                          = 0x00002000, 
//        RE                          = 0x00004000,
//        RF                          = 0x00008000,
//
//        // free bit                 = 0x00010000, 
//        // free bit                 = 0x00020000,
//        // free bit                 = 0x00040000, 
//        // free bit                 = 0x00080000, 
//
//        TreeHasLoadedChangeHandler  = 0x00100000, 
//        IsLoadedCache               = 0x00200000,
//        IsStyleSetFromGenerator     = 0x00400000,
//        IsParentAnFE                = 0x00800000,
//        IsTemplatedParentAnFE       = 0x01000000, 
//        HasStyleChanged             = 0x02000000,
//        HasTemplateChanged          = 0x04000000, 
//        HasStyleInvalidated         = 0x08000000, 
//        IsRequestingExpression      = 0x10000000,
//        HasMultipleInheritanceContexts = 0x20000000, 
//
//        // free bit                 = 0x40000000,
//        BypassLayoutPolicies        = 0x80000000,
// 
//        // Default is so that the default value of TemplateChildIndex
//        // (which is stored in the low 16 bits) can be 0xFFFF (interpreted to be -1). 
//        Default                     = 0x0000FFFF, 
//
//    } 
//}
