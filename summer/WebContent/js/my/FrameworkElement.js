/**
 * FrameworkElement
 */

define(["dojo/_base/declare", "system/Type"/*, "windows/UIElement"*/], function(declare, Type/*, UIElement*/){
	var FrameworkElement = declare(null,{
		constructor:function( ){
            // Initialize the _styleCache to the default value for StyleProperty.
            // If the default value is non-null then wire it to the current instance. 
            PropertyMetadata metadata = StyleProperty.GetMetadata(DependencyObjectType);
            Style defaultValue = (Style) metadata.DefaultValue; 
            if (defaultValue != null) 
            {
                OnStyleChanged(this, new DependencyPropertyChangedEventArgs(StyleProperty, metadata, null, defaultValue)); 
            }

            if (((FlowDirection)FlowDirectionProperty.GetDefaultValue(DependencyObjectType)) == FlowDirection.RightToLeft)
            { 
                IsRightToLeft = true;
            } 
 
            // Set the ShouldLookupImplicitStyles flag to true if App.Resources has implicit styles.
            Application app = Application.Current; 
            if (app != null && app.HasImplicitStylesInResources)
            {
                ShouldLookupImplicitStyles = true;
            } 

            FrameworkElement.EnsureFrameworkServices(); 
		},

		/// <summary>
        /// Registers the name - element combination from the
        /// NameScope that the current element belongs to.
        /// </summary> 
        /// <param name="name">Name of the element</param>
        /// <param name="scopedElement">Element where name is defined</param> 
        public void RegisterName(string name, object scopedElement) 
        {
            INameScope nameScope = FrameworkElement.FindScope(this); 
            if (nameScope != null)
            {
                nameScope.RegisterName(name, scopedElement);
            } 
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.NameScopeNotFound, name, "register")); 
            }
        } 

        /// <summary>
        /// Unregisters the name - element combination from the
        /// NameScope that the current element belongs to. 
        /// </summary>
        /// <param name="name">Name of the element</param> 
        public void UnregisterName(string name) 
        {
            INameScope nameScope = FrameworkElement.FindScope(this); 
            if (nameScope != null)
            {
                nameScope.UnregisterName(name);
            } 
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.NameScopeNotFound, name, "unregister")); 
            }
        } 

        /// <summary>
        /// Find the object with given name in the
        /// NameScope that the current element belongs to. 
        /// </summary>
        /// <param name="name">string name to index</param> 
        /// <returns>context if found, else null</returns> 
        public object FindName(string name)
        { 
            DependencyObject scopeOwner;
            return FindName(name, out scopeOwner);
        }
 
        // internal version of FindName that returns the scope owner
        internal object FindName(string name, out DependencyObject scopeOwner) 
        { 
            INameScope nameScope = FrameworkElement.FindScope(this, out scopeOwner);
            if (nameScope != null) 
            {
                return nameScope.FindName(name);
            }
 
            return null;
        } 
 
        /// <summary>
        /// Elements that arent connected to the tree do not receive theme change notifications. 
        /// We leave it upto the app author to listen for such changes and invoke this method on
        /// elements that they know that arent connected to the tree. This method will update the
        /// DefaultStyle for the subtree starting at the current instance.
        /// </summary> 
        public void UpdateDefaultStyle()
        { 
            TreeWalkHelper.InvalidateOnResourcesChange(/* fe = */ this, /* fce = */ null, ResourcesChangeInfo.ThemeChangeInfo); 
        }

        /// <summary>
        ///     Tries to find a Resource for the given resourceKey in the current 
        ///     element's ResourceDictionary.
        /// </summary> 
        internal object FindResourceOnSelf(object resourceKey, bool allowDeferredResourceReference, bool mustReturnDeferredResourceReference) 
        {
            ResourceDictionary resources = ResourcesField.GetValue(this); 
            if ((resources != null) && resources.Contains(resourceKey))
            {
                bool canCache;
                return resources.FetchResource(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference, out canCache); 
            }
 
            return DependencyProperty.UnsetValue; 
        }
 
        internal DependencyObject ContextVerifiedGetParent()
        {
            return _parent;
        } 

        protected internal void AddLogicalChild(object child)
        { 
            if (child != null)
            { 
                // It is invalid to modify the children collection that we 
                // might be iterating during a property invalidation tree walk.
                if (IsLogicalChildrenIterationInProgress) 
                {
                    throw new InvalidOperationException(SR.Get(SRID.CannotModifyLogicalChildrenDuringTreeWalk));
                }
 
                // Now that the child is going to be added, the FE/FCE construction is considered finished,
                // so we do not expect a change of InheritanceBehavior property, 
                // so we can pick up properties from styles and resources. 
                TryFireInitialized();
 
                bool exceptionThrown = true;
                try
                {
                    HasLogicalChildren = true; 

                    // Child is present; reparent him to this element 
                    FrameworkObject fo = new FrameworkObject(child as DependencyObject); 
                    fo.ChangeLogicalParent(this);
 
                    exceptionThrown = false;
                }
                finally
                { 
                    if (exceptionThrown)
                    { 
                        // 

 
                        // Consider doing this...
                        //RemoveLogicalChild(child);
                    }
                } 
            }
        } 

        protected internal void RemoveLogicalChild(object child) 
        { 
            if (child != null)
            { 
                // It is invalid to modify the children collection that we
                // might be iterating during a property invalidation tree walk.
                if (IsLogicalChildrenIterationInProgress)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.CannotModifyLogicalChildrenDuringTreeWalk));
                } 
 
                // Child is present
                FrameworkObject fo = new FrameworkObject(child as DependencyObject); 
                if (fo.Parent == this)
                {
                    fo.ChangeLogicalParent(null);
                } 

                // This could have been the last child, so check if we have any more children 
                IEnumerator children = LogicalChildren; 

                // if null, there are no children. 
                if (children == null)
                {
                    HasLogicalChildren = false;
                } 
                else
                { 
                    // If we can move next, there is at least one child 
                    HasLogicalChildren = children.MoveNext();
                } 
            }
        }

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
        internal void ChangeLogicalParent(DependencyObject newParent) 
        {
            /////////////////// 
            // OnNewParent:
            ///////////////////

            // 
            // -- Approved By The Core Team --
            // 
            // Do not allow foreign threads to change the tree. 
            // (This is a noop if this object is not assigned to a Dispatcher.)
            // 
            // We also need to ensure that the tree is homogenous with respect
            // to the dispatchers that the elements belong to.
            //
            this.VerifyAccess(); 
            if(newParent != null)
            { 
                newParent.VerifyAccess(); 
            }
 
            // Logical Parent must first be dropped before you are attached to a newParent
            // This mitigates illegal tree state caused by logical child stealing as illustrated in bug 970706
            if (_parent != null && newParent != null && _parent != newParent)
            { 
                throw new System.InvalidOperationException(SR.Get(SRID.HasLogicalParent));
            } 
 
            // Trivial check to avoid loops
            if (newParent == this) 
            {
                throw new System.InvalidOperationException(SR.Get(SRID.CannotBeSelfParent));
            }
 
            // Logical Parent implies no InheritanceContext
            if (newParent != null) 
            { 
                ClearInheritanceContext();
            } 

            IsParentAnFE = newParent is FrameworkElement;

            DependencyObject oldParent = _parent; 
            OnNewParent(newParent);
 
            // Update Has[Loaded/Unloaded]Handler Flags 
            BroadcastEventHelper.AddOrRemoveHasLoadedChangeHandlerFlag(this, oldParent, newParent);
 


            ///////////////////
            // OnParentChanged: 
            ///////////////////
 
            // Invalidate relevant properties for this subtree 
            DependencyObject parent = (newParent != null) ? newParent : oldParent;
            TreeWalkHelper.InvalidateOnTreeChange(/* fe = */ this, /* fce = */ null, parent, (newParent != null)); 

            // If no one has called BeginInit then mark the element initialized and fire Initialized event
            // (non-parser programmatic tree building scenario)
            TryFireInitialized(); 
        }
 
        /// <summary> 
        ///     Called before the parent is chanded to the new value.
        /// </summary> 
        internal virtual void OnNewParent(DependencyObject newParent)
        {
            //
            // This API is only here for compatability with the old 
            // behavior.  Note that FrameworkElement does not have
            // this virtual, so why do we need it here? 
            // 

            DependencyObject oldParent = _parent; 
            _parent = newParent;


 
            // Synchronize ForceInherit properties
            if(_parent != null && _parent is ContentElement) 
            { 
                UIElement.SynchronizeForceInheritProperties(this, null, null, _parent);
            } 
            else if(oldParent is ContentElement)
            {
                UIElement.SynchronizeForceInheritProperties(this, null, null, oldParent);
            } 

 
            // Synchronize ReverseInheritProperty Flags 
            //
            // NOTE: do this AFTER synchronizing force-inherited flags, since 
            // they often effect focusability and such.
            this.SynchronizeReverseInheritPropertyFlags(oldParent, false);
        }
 
        // OnAncestorChangedInternal variant when we know what type (FE/FCE) the
        //  tree node is. 
        /// <SecurityNote> 
        ///     Critical: This code calls into PresentationSource.OnAncestorChanged which is link demand protected
        ///     it does so only for content elements and not for FEs. But if called externally and configured 
        ///     inappropriately it can be used to change the tree
        ///     TreatAsSafe: This does not let you get at the presentationsource which is what we do not want to expose
        /// </SecurityNote>
        internal void OnAncestorChangedInternal(TreeChangeInfo parentTreeState)
        { 
            // Cache the IsSelfInheritanceParent flag 
            bool isSelfInheritanceParent = IsSelfInheritanceParent;
 
            if (parentTreeState.Root != this)
            {
                // Clear the HasStyleChanged flag
                HasStyleChanged = false; 
                HasStyleInvalidated = false;
                HasTemplateChanged = false; 
            } 

            // If this is a tree add operation update the ShouldLookupImplicitStyles 
            // flag with respect to your parent.
            if (parentTreeState.IsAddOperation)
            {
                FrameworkObject fo = 
                    new FrameworkObject(this, null);
 
                fo.SetShouldLookupImplicitStyles(); 
            }
 
            // Invalidate ResourceReference properties
            if (HasResourceReference)
            {
                // This operation may cause a style change and hence should be done before the call to 
                // InvalidateTreeDependents as it relies on the HasStyleChanged flag
                TreeWalkHelper.OnResourcesChanged(this, ResourcesChangeInfo.TreeChangeInfo, false); 
            } 

            // If parent is a FrameworkElement 
            // This is also an operation that could change the style
            FrugalObjectList<DependencyProperty> currentInheritableProperties =
            InvalidateTreeDependentProperties(parentTreeState, isSelfInheritanceParent);
 
            // we have inherited properties that changes as a result of the above;
            // invalidation; push that list of inherited properties on the stack 
            // for the children to use 
            parentTreeState.InheritablePropertiesStack.Push(currentInheritableProperties);
 


            // Call OnAncestorChanged
            OnAncestorChanged(); 

            // Notify mentees if they exist 
            if (PotentiallyHasMentees) 
            {
                // Raise the ResourcesChanged Event so that ResourceReferenceExpressions 
                // on non-[FE/FCE] listening for this can then update their values
                RaiseClrEvent(FrameworkElement.ResourcesChangedKey, EventArgs.Empty);
            }
        } 

        // Invalidate all the properties that may have changed as a result of 
        //  changing this element's parent in the logical (and sometimes visual tree.) 
        internal FrugalObjectList<DependencyProperty> InvalidateTreeDependentProperties(TreeChangeInfo parentTreeState, bool isSelfInheritanceParent)
        { 
            AncestorChangeInProgress = true;

            InVisibilityCollapsedTree = false;  // False == we don't know whether we're in a visibility collapsed tree.
 
            if (parentTreeState.TopmostCollapsedParentNode == null)
            { 
                // There is no ancestor node with Visibility=Collapsed. 
                //  See if "fe" is the root of a collapsed subtree.
                if (Visibility == Visibility.Collapsed) 
                {
                    // This is indeed the root of a collapsed subtree.
                    //  remember this information as we proceed on the tree walk.
                    parentTreeState.TopmostCollapsedParentNode = this; 

                    // Yes, this FE node is in a visibility collapsed subtree. 
                    InVisibilityCollapsedTree = true; 
                }
            } 
            else
            {
                // There is an ancestor node somewhere above us with
                //  Visibility=Collapsed.  We're in a visibility collapsed subtree. 
                InVisibilityCollapsedTree = true;
            } 
 

            try 
            {
                // Style property is a special case of a non-inherited property that needs
                // invalidation for parent changes. Invalidate StyleProperty if it hasn't been
                // locally set because local value takes precedence over implicit references 
                if (IsInitialized && !HasLocalStyle && (this != parentTreeState.Root))
                { 
                    UpdateStyleProperty(); 
                }
 
                Style selfStyle = null;
                Style selfThemeStyle = null;
                DependencyObject templatedParent = null;
 
                int childIndex = -1;
                ChildRecord childRecord = new ChildRecord(); 
                bool isChildRecordValid = false; 

                selfStyle = Style; 
                selfThemeStyle = ThemeStyle;
                templatedParent = TemplatedParent;
                childIndex = TemplateChildIndex;
 
                // StyleProperty could have changed during invalidation of ResourceReferenceExpressions if it
                // were locally set or during the invalidation of unresolved implicitly referenced style 
                bool hasStyleChanged = HasStyleChanged; 

                // Fetch selfStyle, hasStyleChanged and childIndex for the current node 
                FrameworkElement.GetTemplatedParentChildRecord(templatedParent, childIndex, out childRecord, out isChildRecordValid);

                FrameworkElement parentFE;
                FrameworkContentElement parentFCE; 
                bool hasParent = FrameworkElement.GetFrameworkParent(this, out parentFE, out parentFCE);
 
                DependencyObject parent = null; 
                InheritanceBehavior parentInheritanceBehavior = InheritanceBehavior.Default;
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
 
                if (!TreeWalkHelper.SkipNext(InheritanceBehavior) && !TreeWalkHelper.SkipNow(parentInheritanceBehavior))
                { 
                    // Synchronize InheritanceParent 
                    this.SynchronizeInheritanceParent(parent);
                } 
                else if (!IsSelfInheritanceParent)
                {
                    // Set IsSelfInheritanceParet on the root node at a tree boundary
                    // so that all inheritable properties are cached on it. 
                    SetIsSelfInheritanceParent();
                } 
 
                // Loop through all cached inheritable properties for the parent to see if they should be invalidated.
                return TreeWalkHelper.InvalidateTreeDependentProperties(parentTreeState, /* fe = */ this, /* fce = */ null, selfStyle, selfThemeStyle, 
                    ref childRecord, isChildRecordValid, hasStyleChanged, isSelfInheritanceParent);
            }
            finally
            { 
                AncestorChangeInProgress = false;
                InVisibilityCollapsedTree = false;  // 'false' just means 'we don't know' - see comment at definition of the flag. 
            } 
        }
 

        /// <summary> 
        ///     This method causes the StyleProperty to be re-evaluated 
        /// </summary>
        internal void UpdateStyleProperty() 
        {
            if (!HasStyleInvalidated)
            {
                if (IsStyleUpdateInProgress == false) 
                {
                    IsStyleUpdateInProgress = true; 
                    try 
                    {
                        InvalidateProperty(StyleProperty); 
                        HasStyleInvalidated = true;
                    }
                    finally
                    { 
                        IsStyleUpdateInProgress = false;
                    } 
                } 
                else
                { 
                    throw new InvalidOperationException(SR.Get(SRID.CyclicStyleReferenceDetected, this));
                }
            }
        } 

        /// <summary> 
        ///     This method causes the ThemeStyleProperty to be re-evaluated 
        /// </summary>
        internal void UpdateThemeStyleProperty() 
        {
            if (IsThemeStyleUpdateInProgress == false)
            {
                IsThemeStyleUpdateInProgress = true; 
                try
                { 
                    StyleHelper.GetThemeStyle(/* fe = */ this, /* fce = */ null); 

                    // Update the ContextMenu and ToolTips separately because they aren't in the tree 
                    ContextMenu contextMenu =
                            GetValueEntry(
                                    LookupEntry(ContextMenuProperty.GlobalIndex),
                                    ContextMenuProperty, 
                                    null,
                                    RequestFlags.DeferredReferences).Value as ContextMenu; 
                    if (contextMenu != null) 
                    {
                        TreeWalkHelper.InvalidateOnResourcesChange(contextMenu, null, ResourcesChangeInfo.ThemeChangeInfo); 
                    }

                    DependencyObject toolTip =
                            GetValueEntry( 
                                    LookupEntry(ToolTipProperty.GlobalIndex),
                                    ToolTipProperty, 
                                    null, 
                                    RequestFlags.DeferredReferences).Value as DependencyObject;
 
                    if (toolTip != null)
                    {
                        FrameworkObject toolTipFO = new FrameworkObject(toolTip);
                        if (toolTipFO.IsValid) 
                        {
                            TreeWalkHelper.InvalidateOnResourcesChange(toolTipFO.FE, toolTipFO.FCE, ResourcesChangeInfo.ThemeChangeInfo); 
                        } 
                    }
 
                    OnThemeChanged();
                }
                finally
                { 
                    IsThemeStyleUpdateInProgress = false;
                } 
            } 
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.CyclicThemeStyleReferenceDetected, this));
            }
        }
 
        // Called when the theme changes so resources not in the tree can be updated by subclasses
        internal virtual void OnThemeChanged() 
        { 
        }
 
        ///<summary>
        ///     Initiate the processing for Loaded event broadcast starting at this node
        /// </summary>
        /// <remarks> 
        ///     This method is to allow firing Loaded event from a Helper class since the override is protected
        /// </remarks> 
        internal void FireLoadedOnDescendentsInternal() 
        {
            // This is to prevent duplicate Broadcasts for the Loaded event 
            if (LoadedPending == null)
            {
                DependencyObject parent = Parent;
 
                if (parent == null)
                { 
                    parent = VisualTreeHelper.GetParent(this); 
                }
 

                // Check if this Loaded cancels against a previously queued Unloaded event
                // Note that if the Loaded and the Unloaded do not change the position of
                // the node within the loagical tree they are considered to cancel each other out. 
                object[] unloadedPending = UnloadedPending;
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
        } 

        ///<summary>
        ///     Broadcast Unloaded event starting at this node
        /// </summary> 
        internal void FireUnloadedOnDescendentsInternal()
        { 
            // This is to prevent duplicate Broadcasts for the Unloaded event 
            if (UnloadedPending == null)
            { 
                DependencyObject parent = Parent;

                if (parent == null)
                { 
                    parent = VisualTreeHelper.GetParent(this);
                } 
 

                // Check if this Unloaded cancels against a previously queued Loaded event 
                // Note that if the Loaded and the Unloaded do not change the position of
                // the node within the loagical tree they are considered to cancel each other out.
                object[] loadedPending = LoadedPending;
                if (loadedPending == null) 
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
        } 

        /// <summary> 
        ///     You are about to provided as the InheritanceContext for the target.
        ///     You can choose to allow this or not.
        /// </summary>
        internal override bool ShouldProvideInheritanceContext(DependencyObject target, DependencyProperty property) 
        {
            // return true if the target is neither a FE or FCE 
            FrameworkObject fo = new FrameworkObject(target); 
            return !fo.IsValid;
        } 
 
        /// <summary>
        ///     You have a new InheritanceContext 
        /// </summary>
        /// <remarks>
        ///     This is to solve the case of programmatically creating a VisualBrush or BitmapCacheBrush
        ///     with an element in it and the element not getting Initialized. 
        /// </remarks>
        internal override void AddInheritanceContext(DependencyObject context, DependencyProperty property) 
        { 
            base.AddInheritanceContext(context, property);
 
            // Initialize, if not already done
            TryFireInitialized();

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
                if (!HasMultipleInheritanceContexts && InheritanceContext == null)
                { 
                    // first request - accept the new inheritance context 
                    InheritanceContextField.SetValue(this, context);
                    OnInheritanceContextChanged(EventArgs.Empty); 
                }
                else if (InheritanceContext != null)
                {
                    // second request - remove all context and enter "shared" mode 
                    InheritanceContextField.ClearValue(this);
                    WriteInternalFlag2(InternalFlags2.HasMultipleInheritanceContexts, true); 
                    OnInheritanceContextChanged(EventArgs.Empty); 
                }
                // else already in shared mode - ignore the request 
            }
        }

        // Remove an inheritance context 
        internal override void RemoveInheritanceContext(DependencyObject context, DependencyProperty property)
        { 
            if (InheritanceContext == context) 
            {
                //FrameworkObject.Log("- {0}", FrameworkObject.LogIC(context, property, this)); 
                InheritanceContextField.ClearValue(this);
                OnInheritanceContextChanged(EventArgs.Empty);
            }
 
            base.RemoveInheritanceContext(context, property);
        } 
 
        // Clear the inheritance context (called when the element
        // gets a real parent 
        private void ClearInheritanceContext()
        {
            if (InheritanceContext != null)
            { 
                InheritanceContextField.ClearValue(this);
                OnInheritanceContextChanged(EventArgs.Empty); 
            } 
        }
 
        /// <summary>
        ///     This is a means for subclasses to get notification
        ///     of InheritanceContext changes and then they can do
        ///     their own thing. 
        /// </summary>
        internal override void OnInheritanceContextChangedCore(EventArgs args) 
        { 
            DependencyObject oldMentor = MentorField.GetValue(this);
            DependencyObject newMentor = Helper.FindMentor(InheritanceContext); 

            if (oldMentor != newMentor)
            {
                MentorField.SetValue(this, newMentor); 

                if (oldMentor != null) 
                { 
                    DisconnectMentor(oldMentor);
                } 
                if (newMentor != null)
                {
                    ConnectMentor(newMentor);
                } 
            }
        } 
 
        // connect to a new mentor
        void ConnectMentor(DependencyObject mentor) 
        {
            FrameworkObject foMentor = new FrameworkObject(mentor);

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
                bool isLoaded = foMentor.IsLoaded; 

                ConnectLoadedEvents(ref foMentor, isLoaded); 
 
                if (isLoaded)
                { 
                    this.FireLoadedOnDescendentsInternal();
                }
            }
        } 

        // disconnect from an old mentor 
        void DisconnectMentor(DependencyObject mentor) 
        {
            FrameworkObject foMentor = new FrameworkObject(mentor); 

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
                bool isLoaded = foMentor.IsLoaded;

                DisconnectLoadedEvents(ref foMentor, isLoaded);
 
                if (foMentor.IsLoaded)
                { 
                    this.FireUnloadedOnDescendentsInternal(); 
                }
            } 
        }

        // called by BroadcastEventHelper when the SubtreeHasLoadedChangedHandler
        // flag changes on a mentored FE/FCE 
        internal void ChangeSubtreeHasLoadedChangedHandler(DependencyObject mentor)
        { 
            FrameworkObject foMentor = new FrameworkObject(mentor); 
            bool isLoaded = foMentor.IsLoaded;
 
            if (this.SubtreeHasLoadedChangeHandler)
            {
                ConnectLoadedEvents(ref foMentor, isLoaded);
            } 
            else
            { 
                DisconnectLoadedEvents(ref foMentor, isLoaded); 
            }
        } 

        // handle the Loaded event from the mentor
        void OnMentorLoaded(object sender, RoutedEventArgs e)
        { 
            FrameworkObject foMentor = new FrameworkObject((DependencyObject)sender);
 
            // stop listening for Loaded, start listening for Unloaded 
            foMentor.Loaded -= new RoutedEventHandler(OnMentorLoaded);
            foMentor.Unloaded += new RoutedEventHandler(OnMentorUnloaded); 

            // broadcast the Loaded event to my framework subtree
            //FireLoadedOnDescendentsInternal();
            BroadcastEventHelper.BroadcastLoadedSynchronously(this, IsLoaded); 
        }
 
        // handle the Unloaded event from the mentor 
        void OnMentorUnloaded(object sender, RoutedEventArgs e)
        { 
            FrameworkObject foMentor = new FrameworkObject((DependencyObject)sender);

            // stop listening for Unloaded, start listening for Loaded
            foMentor.Unloaded -= new RoutedEventHandler(OnMentorUnloaded); 
            foMentor.Loaded += new RoutedEventHandler(OnMentorLoaded);
 
            // broadcast the Unloaded event to my framework subtree 
            //FireUnloadedOnDescendentsInternal();
            BroadcastEventHelper.BroadcastUnloadedSynchronously(this, IsLoaded); 
        }

        void ConnectLoadedEvents(ref FrameworkObject foMentor, bool isLoaded)
        { 
            if (foMentor.IsValid)
            { 
                if (isLoaded) 
                {
                    foMentor.Unloaded += new RoutedEventHandler(OnMentorUnloaded); 
                }
                else
                {
                    foMentor.Loaded += new RoutedEventHandler(OnMentorLoaded); 
                }
            } 
        } 

        void DisconnectLoadedEvents(ref FrameworkObject foMentor, bool isLoaded) 
        {
            if (foMentor.IsValid)
            {
                if (isLoaded) 
                {
                    foMentor.Unloaded -= new RoutedEventHandler(OnMentorUnloaded); 
                } 
                else
                { 
                    foMentor.Loaded -= new RoutedEventHandler(OnMentorLoaded);
                }
            }
        } 

        // handle the InheritedPropertyChanged event from the mentor 
        void OnMentorInheritedPropertyChanged(object sender, InheritedPropertyChangedEventArgs e) 
        {
            TreeWalkHelper.InvalidateOnInheritablePropertyChange( 
                    this, null,

                    e.Info, false /*skipStartNode*/);
        } 

        // handle the ResourcesChanged event from the mentor 
        void OnMentorResourcesChanged(object sender, EventArgs e) 
        {
            TreeWalkHelper.InvalidateOnResourcesChange( 
                    this, null,

                    ResourcesChangeInfo.CatastrophicDictionaryChangeInfo);
        } 

        // Helper method to retrieve and fire the InheritedPropertyChanged event 
        internal void RaiseInheritedPropertyChangedEvent(ref InheritablePropertyChangeInfo info) 
        {
            EventHandlersStore store = EventHandlersStore; 
            if (store != null)
            {
                Delegate handler = store.Get(FrameworkElement.InheritedPropertyChangedKey);
                if (handler != null) 
                {
                    InheritedPropertyChangedEventArgs args = new InheritedPropertyChangedEventArgs(ref info); 
                    ((InheritedPropertyChangedEventHandler)handler)(this, args); 
                }
            } 
        }

        /// <summary>
        ///     Style property 
        /// </summary>
        public Style Style 
        { 
            get { return _styleCache; }
            set { SetValue(StyleProperty, value); } 
        }
 

        // Internal so that StyleHelper could uniformly call the TemplateChanged 
        // virtual on any templated parent
        internal virtual void OnTemplateChangedInternal( 
            FrameworkTemplate oldTemplate, 
            FrameworkTemplate newTemplate)
        { 
            HasTemplateChanged = true;
        }

        /// <summary> 
        ///     Style has changed
        /// </summary> 
        /// <param name="oldStyle">The old Style</param> 
        /// <param name="newStyle">The new Style</param>
        protected internal virtual void OnStyleChanged(Style oldStyle, Style newStyle) 
        {
            HasStyleChanged = true;
        }
 
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
        protected internal virtual void ParentLayoutInvalidated(UIElement child) 
        {
        } 
 
        /// <summary>
        /// ApplyTemplate is called on every Measure 
        /// </summary>
        /// <remarks>
        /// Used by subclassers as a notification to delay fault-in their Visuals
        /// Used by application authors ensure an Elements Visual tree is completely built 
        /// </remarks>
        /// <returns>Whether Visuals were added to the tree</returns> 
        public bool ApplyTemplate() 
        {
            // Notify the ContentPresenter/ItemsPresenter that we are about to generate the 
            // template tree and allow them to choose the right template to be applied.
            OnPreApplyTemplate();

            bool visualsCreated = false; 

            UncommonField<HybridDictionary[]>  dataField = StyleHelper.TemplateDataField; 
            FrameworkTemplate           template = TemplateInternal; 

            // The Template may change in OnApplyTemplate so we'll retry in this case. 
            // We dont want to get stuck in a loop doing this, so limit the number of
            // template changes before we bail out.
            int retryCount = 2;
            for (int i = 0; template != null && i < retryCount; i++) 
            {
                // VisualTree application never clears existing trees. Trees 
                // will be conditionally cleared on Template invalidation 
                if (!HasTemplateGeneratedSubTree)
                { 

                    // Create a VisualTree using the given template
                    visualsCreated = template.ApplyTemplateContent(dataField, this);
                    if (visualsCreated) 
                    {
                        // This VisualTree was created via a Template 
                        HasTemplateGeneratedSubTree =  true; 

                        // We may have had trigger actions that had to wait until the 
                        //  template subtree has been created.  Invoke them now.
                        StyleHelper.InvokeDeferredActions(this, template);

                        // Notify sub-classes when the template tree has been created 
                        OnApplyTemplate();
                    } 
 
                    if (template != TemplateInternal)
                    { 
                        template = TemplateInternal;
                        continue;
                    }
                } 

                break; 
            } 

            OnPostApplyTemplate(); 

            return visualsCreated;
        }
 
        /// <summary>
        /// This virtual is called by FE.ApplyTemplate before it does work to generate the template tree. 
        /// </summary> 
        /// <remarks>
        /// This virtual is overridden for the following three reasons 
        /// 1. By ContentPresenter/ItemsPresenter to choose the template to be applied in this case.
        /// 2. By RowPresenter/ColumnHeaderPresenter/InkCanvas to build custom visual trees
        /// 3. By ScrollViewer/TickBar/ToolBarPanel/Track to hookup bindings to their TemplateParent
        /// </remarks> 
        internal virtual void OnPreApplyTemplate()
        { 
        } 

        /// <summary> 
        ///     This is the virtual that sub-classes must override if they wish to get
        ///     notified that the template tree has been created.
        /// </summary>
        /// <remarks> 
        ///     This virtual is called after the template tree has been generated and it is invoked only
        ///     if the call to ApplyTemplate actually caused the template tree to be generated. 
        /// </remarks> 
        public virtual void OnApplyTemplate()
        { 
        }

        /// <summary>
        /// This virtual is called by FE.ApplyTemplate after it generates the template tree. 
        /// </summary>
        /// <remarks> 
        /// This is overrideen by Control to update the visual states 
        /// </remarks>
        internal virtual void OnPostApplyTemplate() 
        {

        }
 
        /// <summary>
        ///     Begins the given Storyboard as a non-controllable Storyboard and 
        /// the default handoff policy. 
        /// </summary>
        public void BeginStoryboard(Storyboard storyboard) 
        {
            BeginStoryboard(storyboard, HandoffBehavior.SnapshotAndReplace, false);
        }
 
        /// <summary>
        ///     Begins the given Storyboard as a non-controllable Storyboard but 
        /// with the given handoff policy. 
        /// </summary>
        public void BeginStoryboard(Storyboard storyboard, HandoffBehavior handoffBehavior) 
        {
            BeginStoryboard(storyboard, handoffBehavior, false);
        }
 
        /// <summary>
        ///     Begins the given Storyboard as a Storyboard with the given handoff 
        /// policy, and with the specified state for controllability. 
        /// </summary>
        public void BeginStoryboard(Storyboard storyboard, HandoffBehavior handoffBehavior, bool isControllable) 
        {
            if( storyboard == null )
            {
                throw new ArgumentNullException("storyboard"); 
            }
 
            // Storyboard.Begin is a public API and needs to be validating handoffBehavior anyway. 

            storyboard.Begin( this, handoffBehavior, isControllable ); 
        }

        // This should be called when the FrameworkElement tree is built up,
        //  at this point we can process all the setter-related information
        //  because now we'll be able to resolve "Target" references in setters. 
        private void PrivateInitialized()
        { 
            // Process Trigger information when this object is loaded. 
            EventTrigger.ProcessTriggerCollection(this);
        } 

        /// <summary>
        /// Gets the Visual child at the specified index. 
        /// </summary>
        /// <remarks> 
        /// Derived classes that provide a custom children collection must override this method 
        /// and return the child at the specified index.
        /// </remarks> 
        protected override Visual GetVisualChild(int index)
        {
            if (_templateChild == null)
            { 
                throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange));
            } 
            if (index != 0) 
            {
                throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)); 
            }
            return _templateChild;
        }
 
        bool IQueryAmbient.IsAmbientPropertyAvailable(string propertyName)
        { 
            // We want to make sure that StaticResource resolution checks the .Resources 
            // Ie.  The Ambient search should look at Resources if it is set.
            // Even if it wasn't set from XAML (eg. the Ctor (or derived Ctor) added stuff) 
            return (propertyName != "Resources" || HasResources);
        }

        /// <summary>
        ///     Retrieves the element in the VisualTree of thie element that corresponds to 
        ///     the element with the given childName in this element's style definition
        /// </summary> 
        /// <param name="childName">the Name to find the matching element for</param> 
        /// <returns>The Named element.  Null if no element has this Name.</returns>
        protected internal DependencyObject GetTemplateChild(string childName) 
        {
            FrameworkTemplate template = TemplateInternal;
            /* Calling this before getting a style/template is not a bug.
            Debug.Assert(template != null, 
                "The VisualTree should have been created from a Template");
            */ 
 
            if (template == null)
            { 
                return null;
            }

            return StyleHelper.FindNameInTemplateContent(this, childName, template) as DependencyObject; 
        }
 
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
        public object FindResource(object resourceKey)
        { 
            // Verify Context Access
            // VerifyAccess();

            if (resourceKey == null) 
            {
                throw new ArgumentNullException("resourceKey"); 
            } 

            object resource = FrameworkElement.FindResourceInternal(this, null /* fce */, resourceKey); 

            if (resource == DependencyProperty.UnsetValue)
            {
                // Resource not found in parent chain, app or system 
                Helper.ResourceFailureThrow(resourceKey);
            } 
 
            return resource;
        } 


        /// <summary>
        ///     Searches for a resource with the passed resourceKey and returns it 
        /// </summary>
        /// <remarks> 
        ///     If the sources is not found on the called Element, the parent 
        ///     chain is searched, using the logical tree.
        /// </remarks> 
        /// <param name="resourceKey">Name of the resource</param>
        /// <returns>The found resource.  Null if not found.</returns>
        public object TryFindResource(object resourceKey)
        { 
            // Verify Context Access
            // VerifyAccess(); 
 
            if (resourceKey == null)
            { 
                throw new ArgumentNullException("resourceKey");
            }

            object resource = FrameworkElement.FindResourceInternal(this, null /* fce */, resourceKey); 

            if (resource == DependencyProperty.UnsetValue) 
            { 
                // Resource not found in parent chain, app or system
                // This is where we translate DependencyProperty.UnsetValue to a null 
                resource = null;
            }

            return resource; 
        }
 
        // return true if there is a local or style-supplied value for the dp
        internal bool HasNonDefaultValue(DependencyProperty dp) 
        { 
            return !Helper.HasDefaultValue(this, dp);
        } 

        /// <summary>
        ///     Searches for a resource called name and sets up a resource reference 
        ///     to it for the passed property.
        /// </summary> 
        /// <param name="dp">Property to which the resource is bound</param> 
        /// <param name="name">Name of the resource</param>
        public void SetResourceReference( 
            DependencyProperty dp,
            object             name)
        {
            // Set the value of the property to a ResourceReferenceExpression 
            SetValue(dp, new ResourceReferenceExpression(name));
 
            // Set flag indicating that the current FrameworkElement instance 
            // has a property value set to a resource reference and hence must
            // be invalidated on parent changed or resource property change events 
            HasResourceReference = true;
        }

 
        /// <summary>
        ///     Allows subclasses to participate in property base value computation 
        /// </summary> 
        /// <param name="dp">Dependency property</param>
        /// <param name="metadata">Type metadata of the property for the type</param> 
        /// <param name="newEntry">entry computed by base</param>
        internal sealed override void EvaluateBaseValueCore(
            DependencyProperty  dp,
            PropertyMetadata    metadata, 
            ref EffectiveValueEntry newEntry)
        { 
            if (dp == StyleProperty) 
            {
                // If this is the first time that the StyleProperty 
                // is being fetched then mark it such
                HasStyleEverBeenFetched = true;

                // Clear the flags associated with the StyleProperty 
                HasImplicitStyleFromResources = false;
                IsStyleSetFromGenerator = false; 
            } 

            GetRawValue(dp, metadata, ref newEntry); 
            Storyboard.GetComplexPathValue(this, dp, ref newEntry, metadata);
        }

        internal void GetRawValue(DependencyProperty dp, PropertyMetadata metadata, ref EffectiveValueEntry entry) 
        {
            // Queries to FrameworkElement will automatically fault in the Style 
 
            // If a value was resolved by base, return that.
            if ((entry.BaseValueSourceInternal == BaseValueSourceInternal.Local) && 
                (entry.GetFlattenedEntry(RequestFlags.FullyResolved).Value != DependencyProperty.UnsetValue))
            {
                return;
            } 

            // 
            // Try for container Style driven value 
            //
            if (TemplateChildIndex != -1) 
            {
                // This instance is in the template child chain of a Template.VisualTree,
                //  so we need to see if the Style has an applicable value.
                // 
                // If the parent element's style is changing, this instance is
                // in a visual tree that is being removed, and the value request 
                // is simply a result of tearing down some information in that 
                // tree (e.g. a BindingExpression).  If so, just pretend there is no style (bug 991395).
 
                if (GetValueFromTemplatedParent(dp, ref entry))
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

            if (dp != StyleProperty) 
            {
                if (StyleHelper.GetValueFromStyleOrTemplate(new FrameworkObject(this, null), dp, ref entry)) 
                { 
                    return;
                } 
            }
            else
            {
                object source; 
                object implicitValue = FrameworkElement.FindImplicitStyleResource(this, this.GetType(), out source);
                if (implicitValue != DependencyProperty.UnsetValue) 
                { 
                    // Commented this because the implicit fetch could also return a DeferredDictionaryReference
                    // if (!(implicitValue is Style)) 
                    // {
                    //     throw new InvalidOperationException(SR.Get(SRID.InvalidImplicitStyleResource, this.GetType().Name, implicitValue));
                    // }
 
                    // This style has been fetched from resources
                    HasImplicitStyleFromResources = true; 
 
                    entry.BaseValueSourceInternal = BaseValueSourceInternal.ImplicitReference;
                    entry.Value = implicitValue; 
                    return;
                }
            }
 
            //
            // Try for Inherited value 
            // 
            FrameworkPropertyMetadata fmetadata = metadata as FrameworkPropertyMetadata;
 
            // Metadata must exist specifically stating to group or inherit
            // Note that for inheritable properties that override the default value a parent can impart
            // its default value to the child even though the property may not have been set locally or
            // via a style or template (ie. IsUsed flag would be false). 
            if (fmetadata != null)
            { 
                if (fmetadata.Inherits) 
                {
                    object value = GetInheritableValue(dp, fmetadata); 

                    if( value != DependencyProperty.UnsetValue)
                    {
                        entry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited; 
                        entry.Value = value;
                        return; 
                    } 
                }
            } 

            // No value found.
            Debug.Assert(entry.Value == DependencyProperty.UnsetValue,"FrameworkElement.GetRawValue should never fall through with a value != DependencyProperty.UnsetValue.  We're supposed to return as soon as we found something.");
        } 

 
 
        // This FrameworkElement has been established to be a Template.VisualTree
        //  node of a parent object.  Ask the TemplatedParent's Style object if 
        //  they have a value for us.

        private bool GetValueFromTemplatedParent(DependencyProperty dp, ref EffectiveValueEntry entry)
        { 
            FrameworkTemplate frameworkTemplate = null;
            Debug.Assert( IsTemplatedParentAnFE ); 
 
            FrameworkElement feTemplatedParent = (FrameworkElement)_templatedParent;
            frameworkTemplate = feTemplatedParent.TemplateInternal; 

            if (frameworkTemplate != null)
            {
                return StyleHelper.GetValueFromTemplatedParent( 
                        _templatedParent,
                        TemplateChildIndex, 
                        new FrameworkObject(this, null), 
                        dp,
                    ref frameworkTemplate.ChildRecordFromChildIndex, 
                        frameworkTemplate.VisualTree,
                    ref entry);
            }
            return false; 
        }
 
        // Climb the framework tree hierarchy and see if we can pick up an 
        //  inheritable property value somewhere in that parent chain.
        //[CodeAnalysis("AptcaMethodsShouldOnlyCallAptcaMethods")] //Tracking Bug: 29647 
        private object GetInheritableValue(DependencyProperty dp, FrameworkPropertyMetadata fmetadata)
        {
            //
            // Inheritance 
            //
 
            if (!TreeWalkHelper.SkipNext(InheritanceBehavior) || fmetadata.OverridesInheritanceBehavior == true) 
            {
                // Used to terminate tree walk if a tree boundary is hit 
                InheritanceBehavior inheritanceBehavior = InheritanceBehavior.Default;

                FrameworkContentElement parentFCE;
                FrameworkElement parentFE; 
                bool hasParent = GetFrameworkParent(this, out parentFE, out parentFCE);
                while (hasParent) 
                { 
                    bool inheritanceNode;
                    if (parentFE != null) 
                    {
                        inheritanceNode = TreeWalkHelper.IsInheritanceNode(parentFE, dp, out inheritanceBehavior);
                    }
                    else // (parentFCE != null) 
                    {
                        inheritanceNode = TreeWalkHelper.IsInheritanceNode(parentFCE, dp, out inheritanceBehavior); 
                    } 

                    // If the current node has SkipNow semantics then we do 
                    // not need to lookup the inheritable value on it.
                    if (TreeWalkHelper.SkipNow(inheritanceBehavior))
                    {
                        break; 
                    }
 
                    // Check if node is an inheritance node, if so, query it 
                    if (inheritanceNode)
                    { 
                        DependencyObject parentDO = parentFE;
                        if (parentDO == null)
                        { 
                            parentDO = parentFCE;
                        } 
 
                        EntryIndex entryIndex = parentDO.LookupEntry(dp.GlobalIndex);
 
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
                        hasParent = GetFrameworkParent(parentFE, out parentFE, out parentFCE); 
                    }
                    else
                    {
                        hasParent = GetFrameworkParent(parentFCE, out parentFE, out parentFCE); 
                    }
                } 
            } 

            // Didn't find this value anywhere in the framework tree parent chain, 
            //  or search was aborted when we hit a tree boundary node.
            return DependencyProperty.UnsetValue;
        }
 
        // Like GetValueCore, except it returns the expression (if any) instead of its value
        internal Expression GetExpressionCore(DependencyProperty dp, PropertyMetadata metadata) 
        { 
            this.IsRequestingExpression = true;
            EffectiveValueEntry entry = new EffectiveValueEntry(dp); 
            entry.Value = DependencyProperty.UnsetValue;
            this.EvaluateBaseValueCore(dp, metadata, ref entry);
            this.IsRequestingExpression = false;
 
            return entry.Value as Expression;
        } 
 
        /// <summary>
        ///     Notification that a specified property has been changed 
        /// </summary>
        /// <param name="e">EventArgs that contains the property, metadata, old value, and new value for this change</param>
        protected override void OnPropertyChanged(DependencyPropertyChangedEventArgs e)
        { 
            DependencyProperty dp = e.Property;
 
            base.OnPropertyChanged(e); 

            if (e.IsAValueChange || e.IsASubPropertyChange) 
            {
                //
                // Try to fire the Loaded event on the root of the tree
                // because for this case the OnParentChanged will not 
                // have a chance to fire the Loaded event.
                // 
                if (dp != null && dp.OwnerType == typeof(PresentationSource) && dp.Name == "RootSource") 
                {
                    TryFireInitialized(); 
                }

                if (dp == FrameworkElement.NameProperty &&
                    EventTrace.IsEnabled(EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose)) 
                {
                    EventTrace.EventProvider.TraceEvent(EventTrace.Event.PerfElementIDName, EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose, 
                            PerfService.GetPerfElementID(this), GetType().Name, GetValue(dp)); 
                }
 
                //
                // Invalidation propagation for Styles
                //
 
                // Regardless of metadata, the Style/Template/DefaultStyleKey properties are never a trigger drivers
                if (dp != StyleProperty && dp != Control.TemplateProperty && dp != DefaultStyleKeyProperty) 
                { 
                    // Note even properties on non-container nodes within a template could be driving a trigger
                    if (TemplatedParent != null) 
                    {
                        FrameworkElement feTemplatedParent = TemplatedParent as FrameworkElement;

                        FrameworkTemplate frameworkTemplate = feTemplatedParent.TemplateInternal; 
                        if (frameworkTemplate != null)
                        { 
                            StyleHelper.OnTriggerSourcePropertyInvalidated(null, frameworkTemplate, TemplatedParent, dp, e, false /*invalidateOnlyContainer*/, 
                                ref frameworkTemplate.TriggerSourceRecordFromChildIndex, ref frameworkTemplate.PropertyTriggersWithActions, TemplateChildIndex /*sourceChildIndex*/);
                        } 
                    }

                    // Do not validate Style during an invalidation if the Style was
                    // never used before (dependents do not need invalidation) 
                    if (Style != null)
                    { 
                        StyleHelper.OnTriggerSourcePropertyInvalidated(Style, null, this, dp, e, true /*invalidateOnlyContainer*/, 
                            ref Style.TriggerSourceRecordFromChildIndex, ref Style.PropertyTriggersWithActions, 0 /*sourceChildIndex*/); // Style can only have triggers that are driven by properties on the container
                    } 

                    // Do not validate Template during an invalidation if the Template was
                    // never used before (dependents do not need invalidation)
                    if (TemplateInternal != null) 
                    {
                        StyleHelper.OnTriggerSourcePropertyInvalidated(null, TemplateInternal, this, dp, e, !HasTemplateGeneratedSubTree /*invalidateOnlyContainer*/, 
                            ref TemplateInternal.TriggerSourceRecordFromChildIndex, ref TemplateInternal.PropertyTriggersWithActions, 0 /*sourceChildIndex*/); // These are driven by the container 
                    }
 
                    // There may be container dependents in the ThemeStyle. Invalidate them.
                    if (ThemeStyle != null && Style != ThemeStyle)
                    {
                        StyleHelper.OnTriggerSourcePropertyInvalidated(ThemeStyle, null, this, dp, e, true /*invalidateOnlyContainer*/, 
                            ref ThemeStyle.TriggerSourceRecordFromChildIndex, ref ThemeStyle.PropertyTriggersWithActions, 0 /*sourceChildIndex*/); // ThemeStyle can only have triggers that are driven by properties on the container
                    } 
                } 
            }
 
            FrameworkPropertyMetadata fmetadata = e.Metadata as FrameworkPropertyMetadata;

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
                    if ((InheritanceBehavior == InheritanceBehavior.Default || fmetadata.OverridesInheritanceBehavior) &&
                        (!DependencyObject.IsTreeWalkOperation(e.OperationType) || PotentiallyHasMentees))
                    {
                        EffectiveValueEntry newEntry = e.NewEntry; 
                        EffectiveValueEntry oldEntry = e.OldEntry;
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
 
                        InheritablePropertyChangeInfo info =
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
                        if (PotentiallyHasMentees) 
                        { 
                            TreeWalkHelper.OnInheritedPropertyChanged(this, ref info, InheritanceBehavior);
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
                    if( !(AncestorChangeInProgress && InVisibilityCollapsedTree) )
                    { 
                        UIElement layoutParent = null;
 
                        bool affectsParentMeasure = fmetadata.AffectsParentMeasure; 
                        bool affectsParentArrange = fmetadata.AffectsParentArrange;
                        bool affectsMeasure = fmetadata.AffectsMeasure; 
                        bool affectsArrange = fmetadata.AffectsArrange;
                        if (affectsMeasure || affectsArrange || affectsParentArrange || affectsParentMeasure)
                        {
                            // Locate nearest Layout parent 
                            for (Visual v = VisualTreeHelper.GetParent(this) as Visual;
                                 v != null; 
                                 v = VisualTreeHelper.GetParent(v) as Visual) 
                            {
                                layoutParent = v as UIElement; 
                                if (layoutParent != null)
                                {
                                    //let incrementally-updating FrameworkElements to mark the vicinity of the affected child
                                    //to perform partial update. 
                                    if(FrameworkElement.DType.IsInstanceOfType(layoutParent))
                                        ((FrameworkElement)layoutParent).ParentLayoutInvalidated(this); 
 
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

 

                            if (!BypassLayoutPolicies || !((dp == WidthProperty) || (dp == HeightProperty)))
                            {
                                InvalidateMeasure(); 
                            }
                        } 
 
                        if (fmetadata.AffectsArrange)
                        { 
                            InvalidateArrange();
                        }

                        if (fmetadata.AffectsRender && 
                            (e.IsAValueChange || !fmetadata.SubPropertiesDoNotAffectRender))
                        { 
                            InvalidateVisual(); 
                        }
                    } 
                }
            }
        }
 
        /// <summary>
        ///     Return the text that represents this object, from the User's perspective. 
        /// </summary>
        /// <returns></returns>
        internal virtual string GetPlainText()
        { 
            return null;
        } 

        internal virtual void pushTextRenderingMode()
        {
            // 
            // TextRenderingMode is inherited both in the UIElement tree and the graphics tree.
            // This means we don't need to set VisualTextRenderingMode on every single node, we only 
            // want to set it on a Visual when it is explicitly set, or set in a manner other than inheritance. 
            // The sole exception to this is PopupRoot, which needs to propagate the value to its Visual, because
            // the graphics tree does not inherit across CompositionTarget boundaries. 
            //
            System.Windows.ValueSource vs = DependencyPropertyHelper.GetValueSource(this, TextOptions.TextRenderingModeProperty);
            if (vs.BaseValueSource > BaseValueSource.Inherited)
            { 
                base.VisualTextRenderingMode = TextOptions.GetTextRenderingMode(this);
            } 
        } 

        /// <summary> 
        ///     Invoked when ancestor is changed.  This is invoked after 
        ///     the ancestor has changed, and the purpose is to allow elements to
        ///     perform actions based on the changed ancestor. 
        /// </summary>
        //CASRemoval:[StrongNameIdentityPermissionAttribute(SecurityAction.InheritanceDemand, PublicKey=Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)]
        internal virtual void OnAncestorChanged()
        { 
        }
 
        /// <summary> 
        /// OnVisualParentChanged is called when the parent of the Visual is changed.
        /// </summary> 
        /// <param name="oldParent">Old parent or null if the Visual did not have a parent before.</param>
        protected internal override void OnVisualParentChanged(DependencyObject oldParent)
        {
            DependencyObject newParent = VisualTreeHelper.GetParentInternal(this); 

            // Visual parent implies no InheritanceContext 
            if (newParent != null) 
            {
                ClearInheritanceContext(); 
            }

            // Update HasLoadedChangeHandler Flag
            BroadcastEventHelper.AddOrRemoveHasLoadedChangeHandlerFlag(this, oldParent, newParent); 

            // Fire Loaded and Unloaded Events 
            BroadcastEventHelper.BroadcastLoadedOrUnloadedEvent(this, oldParent, newParent); 

            if (newParent != null && (newParent is FrameworkElement) == false) 
            {
                // If you are being connected to a non-FE parent then start listening for VisualAncestor
                // changes because otherwise you won't know about changes happening above you
                Visual newParentAsVisual = newParent as Visual; 
                if (newParentAsVisual != null)
                { 
                    newParentAsVisual.VisualAncestorChanged += new AncestorChangedEventHandler(OnVisualAncestorChanged); 
                }
                else if (newParent is Visual3D) 
                {
                    ((Visual3D)newParent).VisualAncestorChanged += new Visual.AncestorChangedEventHandler(OnVisualAncestorChanged);
                }
            } 
            else if (oldParent != null && (oldParent is FrameworkElement) == false)
            { 
                // If you are being disconnected from a non-FE parent then stop listening for 
                // VisualAncestor changes
                Visual oldParentAsVisual = oldParent as Visual; 
                if (oldParentAsVisual != null)
                {
                    oldParentAsVisual.VisualAncestorChanged -= new AncestorChangedEventHandler(OnVisualAncestorChanged);
                } 
                else if (oldParent is Visual3D)
                { 
                    ((Visual3D)oldParent).VisualAncestorChanged -= new Visual.AncestorChangedEventHandler(OnVisualAncestorChanged); 
                }
            } 

            // Do it only if you do not have a logical parent
            if (Parent == null)
            { 
                // Invalidate relevant properties for this subtree
                DependencyObject parent = (newParent != null) ? newParent : oldParent; 
                TreeWalkHelper.InvalidateOnTreeChange(this, null, parent, (newParent != null)); 
            }
 
            // Initialize, if not already done.

            // Note that it is for performance reasons that we TryFireInitialize after
            // we have done InvalidateOnTreeChange. This is because InvalidateOnTreeChange 
            // invalidates the style property conditionally if the object has been initialized.
            // And OnInitialized also invalidates the style property. If we were to do these 
            // operations in the reverse order we would be invalidating the style property twice. 
            // Whereas now we do it only once.
 
            TryFireInitialized();

            base.OnVisualParentChanged(oldParent);
        } 

        internal new void OnVisualAncestorChanged(object sender, AncestorChangedEventArgs e) 
        { 
            // NOTE:
            // 
            // We are forced to listen to AncestorChanged events because a FrameworkElement
            // may have raw Visuals/UIElements between it and its nearest FrameworkElement
            // parent.  We only care about changes that happen to the visual tree BETWEEN
            // this FrameworkElement and its nearest FrameworkElement parent.  This is 
            // because we can rely on our nearest FrameworkElement parent to notify us
            // when its loaded state changes. 
 
            FrameworkElement feParent = null;
            FrameworkContentElement fceParent = null; 

            // Find our nearest FrameworkElement parent.
            FrameworkElement.GetContainingFrameworkElement(VisualTreeHelper.GetParent(this), out feParent, out fceParent);
            Debug.Assert(fceParent == null, "Nearest framework parent via the visual tree has to be an FE. It cannot be an FCE"); 

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
                    FrameworkElement.GetContainingFrameworkElement(e.OldParent, out feParent, out fceParent); 

                    if(feParent != null) 
                    {
                        // Update HasLoadedChangeHandler Flag
                        BroadcastEventHelper.AddOrRemoveHasLoadedChangeHandlerFlag(this, feParent, null);
 
                        // Fire Loaded and Unloaded Events
                        BroadcastEventHelper.BroadcastLoadedOrUnloadedEvent(this, feParent, null); 
                    } 
                }
            } 
        }
 

        /// <summary> 
        /// Get the BindingExpression for the given property
        /// </summary>
        /// <param name="dp">DependencyProperty that represents the property</param>
        /// <returns> BindingExpression if property is data-bound, null if it is not</returns> 
        public BindingExpression GetBindingExpression(DependencyProperty dp)
        { 
            return BindingOperations.GetBindingExpression(this, dp); 
        }
 
        /// <summary>
        /// Attach a data Binding to the property
        /// </summary>
        /// <param name="dp">DependencyProperty that represents the property</param> 
        /// <param name="binding">description of Binding to attach</param>
        public BindingExpressionBase SetBinding(DependencyProperty dp, BindingBase binding) 
        { 
            return BindingOperations.SetBinding(this, dp, binding);
        } 

        /// <summary>
        /// Convenience method.  Create a BindingExpression and attach it.
        /// Most fields of the BindingExpression get default values. 
        /// </summary>
        /// <param name="dp">DependencyProperty that represents the property</param> 
        /// <param name="path">source path</param> 
        public BindingExpression SetBinding(DependencyProperty dp, string path)
        { 
            return (BindingExpression)SetBinding(dp, new Binding(path));
        }

        /// <returns>
        ///     Returns a non-null value when some framework implementation 
        ///     of this method has a non-visual parent connection,
        /// </returns> 
        protected internal override DependencyObject GetUIParentCore() 
        {
            // Note: this only follows one logical link. 
            return this._parent;
        }

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
        internal override object AdjustEventSource(RoutedEventArgs args)
        { 
            object source = null;
 
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

            if(_parent != null || HasLogicalChildren) 
            {
                DependencyObject logicalSource = args.Source as DependencyObject;
                if(logicalSource == null || !IsLogicalDescendent(logicalSource))
                { 
                    args.Source=this;
                    source = this; 
                } 
            }
 
            return source;
        }

        // Allows adjustments to the branch source popped off the stack 
        internal virtual void AdjustBranchSource(RoutedEventArgs args)
        { 
        } 

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
        internal override bool BuildRouteCore(EventRoute route, RoutedEventArgs args) 
        {
            return BuildRouteCoreHelper(route, args, true); 
        }
        internal bool BuildRouteCoreHelper(EventRoute route, RoutedEventArgs args, bool shouldAddIntermediateElementsToRoute)
        {
            bool continuePastCoreTree = false; 

            DependencyObject visualParent = VisualTreeHelper.GetParent(this); 
            DependencyObject modelParent = GetUIParentCore(); 

            // FrameworkElement extends the basic event routing strategy by 
            // introducing the concept of a logical tree.  When an event
            // passes through an element in a logical tree, the source of
            // the event needs to change to the leaf-most node in the same
            // logical tree that is in the route. 

            // Check the route to see if we are returning into a logical tree 
            // that we left before.  If so, restore the source of the event to 
            // be the source that it was when we left the logical tree.
            DependencyObject branchNode = route.PeekBranchNode() as DependencyObject; 
            if (branchNode != null && IsLogicalDescendent(branchNode))
            {
                // We keep the most recent source in the event args.  Note that
                // this is only for our consumption.  Once the event is raised, 
                // it will use the source information in the route.
                args.Source=route.PeekBranchSource(); 
 
                AdjustBranchSource(args);
 
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

            if (!IgnoreModelParentBuildRoute(args)) 
            {
                // If there is no visual parent, route via the model tree.
                if (visualParent == null)
                { 
                    continuePastCoreTree = modelParent != null;
                } 
                else if(modelParent != null) 
                {
                    Visual visualParentAsVisual = visualParent as Visual; 
                    if (visualParentAsVisual != null)
                    {
                        if (visualParentAsVisual.CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot))
                        { 
                            continuePastCoreTree = true;
                        } 
                    } 
                    else
                    { 
                        if (((Visual3D)visualParent).CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot))
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
        }
 
        /// <summary>
        ///     Add Style TargetType and FEF EventHandlers to the EventRoute
        /// </summary>
        internal override void AddToEventRouteCore(EventRoute route, RoutedEventArgs args) 
        {
            AddStyleHandlersToEventRoute(this, null, route, args); 
        } 
 
        //CASRemoval:[StrongNameIdentityPermissionAttribute(SecurityAction.InheritanceDemand, PublicKey=Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)]
        internal virtual bool IgnoreModelParentBuildRoute(RoutedEventArgs args) 
        {
            return false;
        }
 
        internal override bool InvalidateAutomationAncestorsCore(Stack<DependencyObject> branchNodeStack, out bool continuePastCoreTree)
        { 
            bool shouldInvalidateIntermediateElements = true; 
            return InvalidateAutomationAncestorsCoreHelper(branchNodeStack, out continuePastCoreTree, shouldInvalidateIntermediateElements);
        } 

        internal bool InvalidateAutomationAncestorsCoreHelper(Stack<DependencyObject> branchNodeStack, out bool continuePastCoreTree, bool shouldInvalidateIntermediateElements)
        {
            bool continueInvalidation = true; 
            continuePastCoreTree = false;
 
            DependencyObject visualParent = VisualTreeHelper.GetParent(this); 
            DependencyObject modelParent = GetUIParentCore();
 
            DependencyObject branchNode = branchNodeStack.Count > 0 ? branchNodeStack.Peek() : null;
            if (branchNode != null && IsLogicalDescendent(branchNode))
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
                continuePastCoreTree = modelParent != null; 
            } 
            else if(modelParent != null)
            { 
                Visual visualParentAsVisual = visualParent as Visual;
                if (visualParentAsVisual != null)
                {
                    if (visualParentAsVisual.CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot)) 
                    {
                        continuePastCoreTree = true; 
                    } 
                }
                else 
                {
                    if (((Visual3D)visualParent).CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot))
                    {
                        continuePastCoreTree = true; 
                    }
                } 
 
                // If there is a model parent, record the branch node.
                branchNodeStack.Push(this); 
            }

            return continueInvalidation;
        } 

        /// <summary> 
        /// Attempts to bring this element into view by originating a RequestBringIntoView event.
        /// </summary> 
        public void BringIntoView() 
        {
            //dmitryt, bug 1126518. On new/updated elements RenderSize isn't yet computed 
            //so we need to postpone the rect computation until layout is done.
            //this is accomplished by passing Empty rect here and then asking for RenderSize
            //in IScrollInfo when it actually executes an async MakeVisible command.
            BringIntoView( /*RenderSize*/ Rect.Empty); 
        }
 
        /// <summary> 
        /// Attempts to bring the given rectangle of this element into view by originating a RequestBringIntoView event.
        /// </summary> 
        public void BringIntoView(Rect targetRectangle)
        {
            RequestBringIntoViewEventArgs args = new RequestBringIntoViewEventArgs(this, targetRectangle);
            args.RoutedEvent=RequestBringIntoViewEvent; 
            RaiseEvent(args);
        } 

        /// <summary> 
        /// Override for <seealso cref="UIElement.MeasureCore" />.
        /// </summary> 
        protected sealed override Size MeasureCore(Size availableSize) 
        {
        }

        /// <summary>
        /// Override for <seealso cref="UIElement.ArrangeCore" />. 
        /// </summary>
        protected sealed override void ArrangeCore(Rect finalRect) 
        { 
        }

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
        protected virtual Size MeasureOverride(Size availableSize)
        { 
            return new Size(0,0); 
        }
 
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
        protected virtual Size ArrangeOverride(Size finalSize)
        { 
            return finalSize;
        } 
        // Keyboard 
 
        /// <summary>
        ///     Request to move the focus from this element to another element 
        /// </summary>
        /// <param name="request">
        ///     The direction that focus is to move.
        /// </param> 
        /// <returns> Returns true if focus is moved successfully. Returns false if there is no next element</returns>
        public sealed override bool MoveFocus(TraversalRequest request) 
        { 
            if (request == null)
            { 
                throw new ArgumentNullException("request");
            }

            return KeyboardNavigation.Current.Navigate(this, request); 
        }
 
        /// <summary> 
        ///     Request to predict the element that should receive focus relative to this element for a
        /// given direction, without actually moving focus to it. 
        /// </summary>
        /// <param name="direction">The direction for which focus should be predicted</param>
        /// <returns>
        ///     Returns the next element that focus should move to for a given FocusNavigationDirection. 
        /// Returns null if focus cannot be moved relative to this element.
        /// </returns> 
        public sealed override DependencyObject PredictFocus(FocusNavigationDirection direction) 
        {
            return KeyboardNavigation.Current.PredictFocusedElement(this, direction); 
        }

        /// <summary>
        ///     This method is invoked when the IsFocused property changes to true
        /// </summary> 
        /// <param name="e">RoutedEventArgs</param>
        protected override void OnGotFocus(RoutedEventArgs e) 
        { 
            if (IsKeyboardFocused)
                BringIntoView(); 

            base.OnGotFocus(e);
        }
 
        /// <summary> 
        ///     Initialization of this element is about to begin
        /// </summary>
        public virtual void BeginInit()
        { 
            // Nested BeginInits on the same instance aren't permitted
            if (ReadInternalFlag(InternalFlags.InitPending)) 
            { 
                throw new InvalidOperationException(SR.Get(SRID.NestedBeginInitNotSupported));
            } 

            // Mark the element as pending initialization
            WriteInternalFlag(InternalFlags.InitPending, true);
        } 

        /// <summary> 
        ///     Initialization of this element has completed 
        /// </summary>
        public virtual void EndInit() 
        {
            // Every EndInit must be preceeded by a BeginInit
            if (!ReadInternalFlag(InternalFlags.InitPending))
            { 
                throw new InvalidOperationException(SR.Get(SRID.EndInitWithoutBeginInitNotSupported));
            } 
 
            // Reset the pending flag
            WriteInternalFlag(InternalFlags.InitPending, false); 

            // Mark the element initialized and fire Initialized event
            // (eg. tree building via parser)
            TryFireInitialized(); 
        }

        /// <summary>
        ///     Initialized private key
        /// </summary>
        internal static readonly EventPrivateKey InitializedKey = new EventPrivateKey(); 


        /// <summary> 
        ///     This virtual method in called when IsInitialized is set to true and it raises an Initialized event
        /// </summary>
        protected virtual void OnInitialized(EventArgs e)
        { 
            // Need to update the StyleProperty so that we can pickup
            // the implicit style if it hasn't already been fetched 
            if (!HasStyleEverBeenFetched) 
            {
                UpdateStyleProperty(); 
            }

            // Need to update the ThemeStyleProperty so that we can pickup
            // the implicit style if it hasn't already been fetched 
            if (!HasThemeStyleEverBeenFetched)
            { 
                UpdateThemeStyleProperty(); 
            }
 
            RaiseInitialized(InitializedKey, e);
        }

        // Helper method that tries to set IsInitialized to true 
        // and Fire the Initialized event
        // This method can be invoked from two locations 
        //      1> EndInit 
        //      2> OnParentChanged
        private void TryFireInitialized() 
        {
            if (!ReadInternalFlag(InternalFlags.InitPending) &&
                !ReadInternalFlag(InternalFlags.IsInitialized))
            { 
                WriteInternalFlag(InternalFlags.IsInitialized, true);
 
                // Do instance initialization outside of the OnInitialized virtual 
                // to make sure that:
                // 1) We avoid attaching instance handlers to FrameworkElement 
                //    (instance handlers are expensive).
                // 2) If a derived class forgets to call base OnInitialized,
                //    this work will still happen.
                PrivateInitialized(); 

                OnInitialized(EventArgs.Empty); 
            } 
        }
 
        // Helper method to retrieve and fire Clr Event handlers for Initialized event
        private void RaiseInitialized(EventPrivateKey key, EventArgs e)
        {
            EventHandlersStore store = EventHandlersStore; 
            if (store != null)
            { 
                Delegate handler = store.Get(key); 
                if (handler != null)
                { 
                    ((EventHandler)handler)(this, e);
                }
            }
        } 


        /// <summary>
        ///     Notifies subclass of a new routed event handler.  Note that this is
        ///     called once for each handler added, but OnRemoveHandler is only called 
        ///     on the last removal.
        /// </summary> 
        internal override void OnAddHandler( 
            RoutedEvent routedEvent,
            Delegate handler) 
        {
            base.OnAddHandler(routedEvent, handler);

            if (routedEvent == LoadedEvent || routedEvent == UnloadedEvent) 
            {
                BroadcastEventHelper.AddHasLoadedChangeHandlerFlagInAncestry(this); 
            } 
        }
 

        /// <summary>
        ///     Notifies subclass of an event for which a handler has been removed.
        /// </summary> 
        internal override void OnRemoveHandler(
            RoutedEvent routedEvent, 
            Delegate handler) 
        {
            base.OnRemoveHandler(routedEvent, handler); 

            // We only care about Loaded & Unloaded events
            if (routedEvent != LoadedEvent && routedEvent != UnloadedEvent)
                return; 

            if (!ThisHasLoadedChangeEventHandler) 
            { 
                BroadcastEventHelper.RemoveHasLoadedChangeHandlerFlagInAncestry(this);
            } 
        }


        /// <summary> 
        ///     Helper that will set the IsLoaded flag and Raise the Loaded event
        /// </summary> 
        internal void OnLoaded(RoutedEventArgs args) 
        {
            RaiseEvent(args); 
        }
        /// <summary>
        ///     Helper that will reset the IsLoaded flag and Raise the Unloaded event 
        /// </summary> 
        internal void OnUnloaded(RoutedEventArgs args)
        { 
            RaiseEvent(args);
        }

 
        // Add synchronized input handler for templated parent.
        internal override void AddSynchronizedInputPreOpportunityHandlerCore(EventRoute route, RoutedEventArgs args) 
        { 
            UIElement uiElement = this._templatedParent as UIElement;
            if (uiElement != null) 
            {
                uiElement.AddSynchronizedInputPreOpportunityHandler(route, args);
            }
 
        }
 
 
        // Helper method to retrieve and fire Clr Event handlers
        internal void RaiseClrEvent(EventPrivateKey key, EventArgs args) 
        {
            EventHandlersStore store = EventHandlersStore;
            if (store != null)
            { 
                Delegate handler = store.Get(key);
                if (handler != null) 
                { 
                    ((EventHandler)handler)(this, args);
                } 
            }
        }

        /// <summary> 
        ///     Called when the ToolTipOpening event fires. 
        ///     Allows subclasses to add functionality without having to attach
        ///     an individual handler. 
        /// </summary>
        /// <param name="e">Event arguments</param>
        protected virtual void OnToolTipOpening(ToolTipEventArgs e)
        { 
        }

        /// <summary>
        ///     Called when the ToolTipClosing event fires.
        ///     Allows subclasses to add functionality without having to attach 
        ///     an individual handler.
        /// </summary> 
        /// <param name="e">Event arguments</param> 
        protected virtual void OnToolTipClosing(ToolTipEventArgs e)
        { 
        }
 
        /// <summary>
        ///     Called when ContextMenuOpening is raised on this element. 
        /// </summary>
        /// <param name="e">Event arguments</param>
        protected virtual void OnContextMenuOpening(ContextMenuEventArgs e)
        { 
        }
 
        /// <summary>
        ///     Called when ContextMenuClosing is raised on this element. 
        /// </summary>
        /// <param name="e">Event arguments</param>
        protected virtual void OnContextMenuClosing(ContextMenuEventArgs e)
        { 
        }
 
        // Helper method to retrieve and fire Clr Event handlers for DependencyPropertyChanged event
        private void RaiseDependencyPropertyChanged(EventPrivateKey key, DependencyPropertyChangedEventArgs args)
        { 
            EventHandlersStore store = EventHandlersStore;
            if (store != null) 
            { 
                Delegate handler = store.Get(key);
                if (handler != null) 
                {
                    ((DependencyPropertyChangedEventHandler)handler)(this, args);
                }
            } 
        }

        // Returns if the given child instance is a logical descendent 
        private bool IsLogicalDescendent(DependencyObject child)
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
        } 

        internal void EventHandlersStoreAdd(EventPrivateKey key, Delegate handler)
        {
            EnsureEventHandlersStore(); 
            EventHandlersStore.Add(key, handler);
        } 
 
        internal void EventHandlersStoreRemove(EventPrivateKey key, Delegate handler)
        { 
            EventHandlersStore store = EventHandlersStore;
            if (store != null)
            {
                store.Remove(key, handler); 
            }
        } 

        // Extracts the required flag and returns
        // bool to indicate if it is set or unset
        internal bool ReadInternalFlag(InternalFlags reqFlag) 
        {
            return (_flags & reqFlag) != 0; 
        } 

        internal bool ReadInternalFlag2(InternalFlags2 reqFlag) 
        {
            return (_flags2 & reqFlag) != 0;
        }
 
        // Sets or Unsets the required flag based on
        // the bool argument 
        internal void WriteInternalFlag(InternalFlags reqFlag, bool set) 
        {
            if (set) 
            {
                _flags |= reqFlag;
            }
            else 
            {
                _flags &= (~reqFlag); 
            } 
        }
 
        internal void WriteInternalFlag2(InternalFlags2 reqFlag, bool set)
        {
            if (set)
            { 
                _flags2 |= reqFlag;
            } 
            else 
            {
                _flags2 &= (~reqFlag); 
            }
        }

	});
	
	Object.defineProperties(FrameworkElement.prototype,{
        /// <summary>
        ///     Returns logical parent 
        /// </summary> 
        public DependencyObject Parent
        { 
            get
            {
                // Verify Context Access
                // VerifyAccess(); 

                return ContextVerifiedGetParent(); 
            } 
        }

        /// <summary>
        ///     Returns enumerator to logical children 
        /// </summary>
        protected internal virtual IEnumerator LogicalChildren 
        { 
            get { return null; }
        } 

 
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
        internal bool ThisHasLoadedChangeEventHandler 
        {
            get 
            { 
                    if (null != EventHandlersStore)
                    { 
                        if (EventHandlersStore.Contains(LoadedEvent) || EventHandlersStore.Contains(UnloadedEvent))
                        {
                            return true;
                        } 
                    }
                    if(null != Style && Style.HasLoadedChangeHandler) 
                    { 
                        return true;
                    } 
                    if(null != ThemeStyle && ThemeStyle.HasLoadedChangeHandler)
                    {
                        return true;
                    } 

                    if(null != TemplateInternal && TemplateInternal.HasLoadedChangeHandler) 
                    { 
                        return true;
                    } 

                    if(HasFefLoadedChangeHandler)
                    {
                        return true; 
                    }
                    return false; 
                } 
        }
 
        internal bool HasFefLoadedChangeHandler
        {
            get
            { 
                if(null == TemplatedParent)
                { 
                    return false; 
                }
                FrameworkElementFactory fefRoot = BroadcastEventHelper.GetFEFTreeRoot(TemplatedParent); 
                if(null == fefRoot)
                {
                    return false;
                } 
                FrameworkElementFactory fef = StyleHelper.FindFEF(fefRoot, TemplateChildIndex);
                if(null == fef) 
                { 
                    return false;
                } 
                return fef.HasLoadedChangeHandler;
            }
        }

        // Define the DO's inheritance context
        internal override DependencyObject InheritanceContext
        { 
            get { return InheritanceContextField.GetValue(this); }
        } 


        // Indicates if the Style is being re-evaluated 
        internal bool IsStyleUpdateInProgress
        { 
            get { return ReadInternalFlag(InternalFlags.IsStyleUpdateInProgress); } 
            set { WriteInternalFlag(InternalFlags.IsStyleUpdateInProgress, value); }
        } 

        // Indicates if the ThemeStyle is being re-evaluated
        internal bool IsThemeStyleUpdateInProgress
        { 
            get { return ReadInternalFlag(InternalFlags.IsThemeStyleUpdateInProgress); }
            set { WriteInternalFlag(InternalFlags.IsThemeStyleUpdateInProgress, value); } 
        } 

        // Indicates that we are storing "container template" provided values 
        // on this element -- see StyleHelper.ParentTemplateValuesField
        internal bool StoresParentTemplateValues
        {
            get { return ReadInternalFlag(InternalFlags.StoresParentTemplateValues); } 
            set { WriteInternalFlag(InternalFlags.StoresParentTemplateValues, value); }
        } 
 
        // Indicates if this instance has had NumberSubstitutionChanged on it
        internal bool HasNumberSubstitutionChanged 
        {
            get { return ReadInternalFlag(InternalFlags.HasNumberSubstitutionChanged); }
            set { WriteInternalFlag(InternalFlags.HasNumberSubstitutionChanged, value); }
        } 

        // Indicates if this instance has a tree that 
        // was generated via a Template 
        internal bool HasTemplateGeneratedSubTree
        { 
            get { return ReadInternalFlag(InternalFlags.HasTemplateGeneratedSubTree); }
            set { WriteInternalFlag(InternalFlags.HasTemplateGeneratedSubTree, value); }
        }
 
        // Indicates if this instance has an implicit style
        internal bool HasImplicitStyleFromResources 
        { 
            get { return ReadInternalFlag(InternalFlags.HasImplicitStyleFromResources); }
            set { WriteInternalFlag(InternalFlags.HasImplicitStyleFromResources, value); } 
        }

        // Indicates if there are any implicit styles in the ancestry
        internal bool ShouldLookupImplicitStyles 
        {
            get { return ReadInternalFlag(InternalFlags.ShouldLookupImplicitStyles); } 
            set { WriteInternalFlag(InternalFlags.ShouldLookupImplicitStyles, value); } 
        }
 
        // Indicates if this instance has a style set by a generator
        internal bool IsStyleSetFromGenerator
        {
            get { return ReadInternalFlag2(InternalFlags2.IsStyleSetFromGenerator); } 
            set { WriteInternalFlag2(InternalFlags2.IsStyleSetFromGenerator, value); }
        } 
 
        // Indicates if the StyleProperty has changed following a UpdateStyleProperty
        // call in OnAncestorChangedInternal 
        internal bool HasStyleChanged
        {
            get { return ReadInternalFlag2(InternalFlags2.HasStyleChanged); }
            set { WriteInternalFlag2(InternalFlags2.HasStyleChanged, value); } 
        }
 
 
        // Indicates if the TemplateProperty has changed during a tree walk
        internal bool HasTemplateChanged 
        {
            get { return ReadInternalFlag2(InternalFlags2.HasTemplateChanged); }
            set { WriteInternalFlag2(InternalFlags2.HasTemplateChanged, value); }
        } 

 
        // Indicates if the StyleProperty has been invalidated during a tree walk 
        internal bool HasStyleInvalidated
        { 
            get { return ReadInternalFlag2(InternalFlags2.HasStyleInvalidated); }
            set { WriteInternalFlag2(InternalFlags2.HasStyleInvalidated, value); }
        }
 
        // Indicates that the StyleProperty full fetch has been
        // performed atleast once on this node 
        internal bool HasStyleEverBeenFetched 
        {
            get { return ReadInternalFlag(InternalFlags.HasStyleEverBeenFetched); } 
            set { WriteInternalFlag(InternalFlags.HasStyleEverBeenFetched, value); }
        }

        // Indicates that the StyleProperty has been set locally on this element 
        internal bool HasLocalStyle
        { 
            get { return ReadInternalFlag(InternalFlags.HasLocalStyle); } 
            set { WriteInternalFlag(InternalFlags.HasLocalStyle, value); }
        } 

        // Indicates that the ThemeStyleProperty full fetch has been
        // performed atleast once on this node
        internal bool HasThemeStyleEverBeenFetched 
        {
            get { return ReadInternalFlag(InternalFlags.HasThemeStyleEverBeenFetched); } 
            set { WriteInternalFlag(InternalFlags.HasThemeStyleEverBeenFetched, value); } 
        }
 
        // Indicates that an ancestor change tree walk is progressing
        // through the given node
        internal bool AncestorChangeInProgress
        { 
            get { return ReadInternalFlag(InternalFlags.AncestorChangeInProgress); }
            set { WriteInternalFlag(InternalFlags.AncestorChangeInProgress, value); } 
        } 

        // Stores the inheritable properties that will need to invalidated on the children of this 
        // node.This is a transient cache that is active only during an AncestorChange operation.
        internal FrugalObjectList<DependencyProperty> InheritableProperties
        {
            get { return _inheritableProperties; } 
            set { _inheritableProperties = value; }
        } 
 
        // Says if there is a loaded event pending
        internal object[] LoadedPending 
        {
            get { return (object[]) GetValue(LoadedPendingProperty); }
        }
 
        // Says if there is an unloaded event pending
        internal object[] UnloadedPending 
        { 
            get { return (object[]) GetValue(UnloadedPendingProperty); }
        } 

        // Indicates if this instance has multiple inheritance contexts
        internal override bool HasMultipleInheritanceContexts
        { 
            get { return ReadInternalFlag2(InternalFlags2.HasMultipleInheritanceContexts); }
        } 
 
        // Indicates if the current element has or had mentees at some point.
        internal bool PotentiallyHasMentees 
        {
            get { return ReadInternalFlag(InternalFlags.PotentiallyHasMentees); }
            set
            { 
                Debug.Assert(value == true,
                    "This flag is set to true when a mentee attaches a listeners to either the " + 
                    "InheritedPropertyChanged event or the ResourcesChanged event. It never goes " + 
                    "back to being false because this would involve counting the remaining listeners " +
                    "for either of the aforementioned events. This seems like an overkill for the perf " + 
                    "optimization we are trying to achieve here.");

                WriteInternalFlag(InternalFlags.PotentiallyHasMentees, value);
            } 
        }

        /// <summary>
        ///     Style property 
        /// </summary>
        public Style Style 
        { 
            get { return _styleCache; }
            set { SetValue(StyleProperty, value); } 
        }

        /// <summary> 
        ///     This specifies that the current style ignores all 
        ///     properties from the Theme Style
        /// </summary> 
        public bool OverridesDefaultStyle
        {
            get { return (bool)GetValue(OverridesDefaultStyleProperty); }
            set { SetValue(OverridesDefaultStyleProperty, BooleanBoxes.Box(value)); } 
        }

        /// <summary>
        /// Gets or sets a value indicating whether layout rounding should be applied to this element's size and position during
        /// Measure and Arrange so that it aligns to pixel boundaries. This property is inherited by children. 
        /// </summary>
        public bool UseLayoutRounding 
        { 
            get { return (bool)GetValue(UseLayoutRoundingProperty); }
            set { SetValue(UseLayoutRoundingProperty, BooleanBoxes.Box(value)); } 
        }

        /// <summary>
        ///     This specifies the key to use to find
        ///     a style in a theme for this control 
        /// </summary>
        protected internal object DefaultStyleKey 
        { 
            get { return GetValue(DefaultStyleKeyProperty); }
            set { SetValue(DefaultStyleKeyProperty, value); } 
        }


        // Cache the ThemeStyle for the current instance if there is a DefaultStyleKey specified for it
        internal Style ThemeStyle 
        {
            get { return _themeStyleCache; } 
        } 

        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types.
        internal virtual DependencyObjectType DTypeThemeStyleKey
        {
            get { return null; } 
        }

        // Internal helper so the FrameworkElement could see the
        // ControlTemplate/DataTemplate set on the 
        // Control/Page/PageFunction/ContentPresenter 
        internal virtual FrameworkTemplate TemplateInternal
        { 
            get { return null; }
        }

        // Internal helper so the FrameworkElement could see the 
        // ControlTemplate/DataTemplate set on the
        // Control/Page/PageFunction/ContentPresenter 
        internal virtual FrameworkTemplate TemplateCache 
        {
            get { return null; } 
            set {}
        }
 
        /// <summary> 
        ///     Triggers associated with this object.  Both the triggering condition
        /// and the trigger effect may be on this object or on its tree child 
        /// objects.
        /// </summary>
        public TriggerCollection Triggers 
        {
            get 
            { 
                TriggerCollection triggerCollection = EventTrigger.TriggerCollectionField.GetValue(this);
                if (triggerCollection == null) 
                {
                    // Give the TriggerCollectiona back-link so that it can update
                    // 'this' on Add/Remove.
                    triggerCollection = new TriggerCollection(this); 

                    EventTrigger.TriggerCollectionField.SetValue(this, triggerCollection); 
                } 

                return triggerCollection; 
            }
        }

        /// <summary>
        ///     Reference to the style parent of this node, if any.
        /// </summary> 
        /// <returns>
        ///     Reference to FrameworkElement or FrameworkContentElement 
        ///     whose Template.VisualTree caused this element to be created, 
        ///     null if this does not apply.
        /// </returns> 
        public DependencyObject TemplatedParent
        {
            get
            { 
                return _templatedParent;
            } 
        } 

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
        internal bool IsTemplateRoot
        {
            get
            { 
                return (TemplateChildIndex==1);
            } 
        } 

 
        /// <summary>
        /// Gets or sets the template child of the FrameworkElement.
        /// </summary>
        virtual internal UIElement TemplateChild 
        {
            get 
            { 
                return _templateChild;
            } 
            set
            {
                if (value != _templateChild)
                { 
                    RemoveVisualChild(_templateChild);
                    _templateChild = value; 
                    AddVisualChild(value); 
                }
            } 
        }

        /// <summary>
        /// Gets the element that should be used as the StateGroupRoot for VisualStateMangager.GoToState calls 
        /// </summary>
        internal virtual FrameworkElement StateGroupsRoot 
        { 
            get
            { 
                return _templateChild as FrameworkElement;
            }
        }
 
        /// <summary>
        /// Gets the number of Visual children of this FrameworkElement. 
        /// </summary> 
        /// <remarks>
        /// Derived classes override this property getter to provide the children count 
        /// of their custom children collection.
        /// </remarks>
        protected override int VisualChildrenCount
        { 
            get
            { 
                return (_templateChild == null) ? 0 : 1; 
            }
        } 
        /// <summary>
        ///     Check if resource is not empty. 
        ///     Call HasResources before accessing resources every time you need 
        ///     to query for a resource.
        /// </summary> 
        internal bool HasResources
        {
            get
            { 
                ResourceDictionary resources = ResourcesField.GetValue(this);
                return (resources != null && 
                        ((resources.Count > 0) || (resources.MergedDictionaries.Count > 0))); 
            }
        } 

        /// <summary>
        ///     Current locally defined Resources
        /// </summary> 
        public ResourceDictionary Resources 
        { 
            get
            { 
                ResourceDictionary resources = ResourcesField.GetValue(this);
                if (resources == null)
                {
                    resources = new ResourceDictionary(); 
                    resources.AddOwner(this);
                    ResourcesField.SetValue(this, resources); 
 
                    if( TraceResourceDictionary.IsEnabled )
                    { 
                        TraceResourceDictionary.TraceActivityItem(
                                TraceResourceDictionary.NewResourceDictionary,
                                this,
                                0, 
                                resources );
                    } 
 
                }
 
                return resources;

            }
            set 
            {
                ResourceDictionary oldValue = ResourcesField.GetValue(this); 
                ResourcesField.SetValue(this, value); 

                if( TraceResourceDictionary.IsEnabled ) 
                {
                    TraceResourceDictionary.Trace(
                            TraceEventType.Start,
                            TraceResourceDictionary.NewResourceDictionary, 
                            this,
                            oldValue, 
                            value ); 
                }
 

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


                if( TraceResourceDictionary.IsEnabled )
                { 
                    TraceResourceDictionary.Trace(
                            TraceEventType.Stop, 
                            TraceResourceDictionary.NewResourceDictionary, 
                            this,
                            oldValue, 
                            value );
                }

 
            }
        } 
 
        ResourceDictionary IHaveResources.Resources
        { 
            get { return Resources; }
            set { Resources = value; }
        }

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
        protected internal InheritanceBehavior InheritanceBehavior 
        {
            get 
            {
                Debug.Assert((uint)InternalFlags.InheritanceBehavior0 == 0x08);
                Debug.Assert((uint)InternalFlags.InheritanceBehavior1 == 0x10);
                Debug.Assert((uint)InternalFlags.InheritanceBehavior2 == 0x20); 

                const uint inheritanceBehaviorMask = 
                    (uint)InternalFlags.InheritanceBehavior0 + 
                    (uint)InternalFlags.InheritanceBehavior1 +
                    (uint)InternalFlags.InheritanceBehavior2; 

                uint inheritanceBehavior = ((uint)_flags & inheritanceBehaviorMask) >> 3;
                return (InheritanceBehavior)inheritanceBehavior;
            } 

            set 
            { 
                Debug.Assert((uint)InternalFlags.InheritanceBehavior0 == 0x08);
                Debug.Assert((uint)InternalFlags.InheritanceBehavior1 == 0x10); 
                Debug.Assert((uint)InternalFlags.InheritanceBehavior2 == 0x20);

                const uint inheritanceBehaviorMask =
                    (uint)InternalFlags.InheritanceBehavior0 + 
                    (uint)InternalFlags.InheritanceBehavior1 +
                    (uint)InternalFlags.InheritanceBehavior2; 
 
                if (!this.IsInitialized)
                { 
                    if ((uint)value < 0 ||
                        (uint)value > (uint)InheritanceBehavior.SkipAllNext)
                    {
                        throw new InvalidEnumArgumentException("value", (int)value, typeof(InheritanceBehavior)); 
                    }
 
                    uint inheritanceBehavior = (uint)value << 3; 

                    _flags = (InternalFlags)((inheritanceBehavior & inheritanceBehaviorMask) | (((uint)_flags) & ~inheritanceBehaviorMask)); 

                    if (_parent != null)
                    {
                        // This means that we are in the process of xaml parsing: 
                        // an instance of FE has been created and added to a parent,
                        // but no children yet added to it (otherwise it would be initialized already 
                        // and we would not be allowed to change InheritanceBehavior). 
                        // So we need to re-calculate properties accounting for the new
                        // inheritance behavior. 
                        // This must have no performance effect as the subtree of this
                        // element is empty (no children yet added).
                        TreeWalkHelper.InvalidateOnTreeChange(/*fe:*/this, /*fce:*/null, _parent, true);
                    } 
                }
                else 
                { 
                    throw new InvalidOperationException(SR.Get(SRID.Illegal_InheritanceBehaviorSettor));
                } 
            }
        }

 
        /// <summary> 
        ///     DataContext Property 
        /// </summary>
        public object DataContext
        {
            get { return GetValue(DataContextProperty); } 
            set { SetValue(DataContextProperty, value); }
        } 
        /// <summary> 
        ///     BindingGroup Property
        /// </summary> 
        public BindingGroup BindingGroup
        { 
            get { return (BindingGroup)GetValue(BindingGroupProperty); }
            set { SetValue(BindingGroupProperty, value); } 
        } 
        /// <summary> 
        /// Language can be specified in xaml at any point using the xml language attribute xml:lang. 
        /// This will make the culture pertain to the scope of the element where it is applied.  The
        /// XmlLanguage names follow the RFC 3066 standard. For example, U.S. English is "en-US". 
        /// </summary>
        public XmlLanguage Language
        {
            get { return (XmlLanguage) GetValue(LanguageProperty); } 
            set { SetValue(LanguageProperty, value); }
        } 
 
        /// <summary>
        ///     Name property. 
        /// </summary>
        public string Name
        { 
            get { return (string) GetValue(NameProperty); } 
            set { SetValue(NameProperty, value);  }
        } 

        /// <summary>
        ///     Tag property. 
        /// </summary>
        public object Tag 
        {
            get { return GetValue(TagProperty); } 
            set { SetValue(TagProperty, value); }
        }
        /// <summary> 
        ///     InputScope Property accessor 
        /// </summary>
        public InputScope InputScope 
        {
            get { return (InputScope) GetValue(InputScopeProperty); }
            set { SetValue(InputScopeProperty, value); }
        } 
 
        /// <summary>
        /// The ActualWidth CLR property - wrapper for ActualWidthProperty. 
        /// Result in 1/96th inch. ("device-independent pixel")
        /// </summary>
        public double ActualWidth
        { 
            get
            { 
                return RenderSize.Width; 
            }
        } 
        /// <summary>
        /// The ActualHeight CLR property - wrapper for ActualHeightProperty. 
        /// Result in 1/96th inch. ("device-independent pixel")
        /// </summary>
        public double ActualHeight
        { 
            get
            { 
                return RenderSize.Height; 
            }
        } 
 
        /// <summary>
        /// Width Property
        /// </summary>
        public double Width 
        { 
            get { return (double) GetValue(WidthProperty); }
            set { SetValue(WidthProperty, value); } 
        }

        /// <summary> 
        /// MinWidth Property
        /// </summary>
        public double MinWidth
        { 
            get { return (double) GetValue(MinWidthProperty); } 
            set { SetValue(MinWidthProperty, value); }
        } 

        /// <summary> 
        /// MaxWidth Property
        /// </summary>
        public double MaxWidth
        { 
            get { return (double) GetValue(MaxWidthProperty); } 
            set { SetValue(MaxWidthProperty, value); }
        } 
 
        /// <summary>
        /// Height Property 
        /// </summary>
        public double Height 
        {
            get { return (double) GetValue(HeightProperty); } 
            set { SetValue(HeightProperty, value); } 
        }
        /// <summary> 
        /// MinHeight Property
        /// </summary> 
        public double MinHeight
        { 
            get { return (double) GetValue(MinHeightProperty); }
            set { SetValue(MinHeightProperty, value); } 
        } 

        /// <summary> 
        /// MaxHeight Property 
        /// </summary>
        public double MaxHeight
        {
            get { return (double) GetValue(MaxHeightProperty); } 
            set { SetValue(MaxHeightProperty, value); }
        } 
 

        /// <summary>
        /// FlowDirection Property
        /// </summary> 
        public FlowDirection FlowDirection 
        { 
            get { return IsRightToLeft ? FlowDirection.RightToLeft : FlowDirection.LeftToRight; }
            set { SetValue(FlowDirectionProperty, value); } 
        }


 
        /// <summary>
        /// Margin Property 
        /// </summary> 
        public Thickness Margin
        { 
            get { return (Thickness) GetValue(MarginProperty); }
            set { SetValue(MarginProperty, value); }
        }
 
        /// <summary>
        /// HorizontalAlignment Property. 
        /// </summary> 
        public HorizontalAlignment HorizontalAlignment
        { 
            get { return (HorizontalAlignment) GetValue(HorizontalAlignmentProperty); }
            set { SetValue(HorizontalAlignmentProperty, value); }
        }
 
        /// <summary>
        /// VerticalAlignment Property.
        /// </summary>
        public VerticalAlignment VerticalAlignment 
        {
            get { return (VerticalAlignment) GetValue(VerticalAlignmentProperty); } 
            set { SetValue(VerticalAlignmentProperty, value); } 
        }
 

        internal static Style DefaultFocusVisualStyle 
        { 
            get
            { 
                if (_defaultFocusVisualStyle == null)
                {
                    Style defaultFocusVisualStyle = new Style();
                    defaultFocusVisualStyle.Seal(); 
                    _defaultFocusVisualStyle = defaultFocusVisualStyle;
                } 
 
                return _defaultFocusVisualStyle;
            } 
        }
        /// <summary>
        /// FocusVisualStyle Property 
        /// </summary> 
        public Style FocusVisualStyle
        { 
            get { return (Style) GetValue(FocusVisualStyleProperty); }
            set { SetValue(FocusVisualStyleProperty, value); }
        }

        /// <summary> 
        /// Cursor Property
        /// </summary>
        public System.Windows.Input.Cursor Cursor
        { 
            get { return (System.Windows.Input.Cursor) GetValue(CursorProperty); }
            set { SetValue(CursorProperty, value); } 
        } 

        /// <summary>
        ///     ForceCursor Property 
        /// </summary>
        public bool ForceCursor
        {
            get { return (bool) GetValue(ForceCursorProperty); } 
            set { SetValue(ForceCursorProperty, BooleanBoxes.Box(value)); }
        } 
 
        /// <summary> 
        ///     Has this element been initialized
        /// </summary> 
        /// <remarks>
        ///     True if either EndInit or OnParentChanged were called
        /// </remarks>
        public bool IsInitialized
        { 
            get { return ReadInternalFlag(InternalFlags.IsInitialized); } 
        }

        /// <summary>
        ///     Turns true when this element is attached to a tree and is laid out and rendered. 
        ///     Turns false when the element gets detached from a loaded tree
        /// </summary> 
        public bool IsLoaded 
        {
            get 
            {
                object[] loadedPending = LoadedPending;
                object[] unloadedPending = UnloadedPending;
 
                if (loadedPending == null && unloadedPending == null)
                { 
                    // The HasHandler flags are used for validation of the IsLoaded flag 
                    if (SubtreeHasLoadedChangeHandler)
                    { 
                        // The IsLoaded flag is valid
                        return IsLoadedCache;
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
        } 
 
        internal static PopupControlService PopupControlService
        { 
            get 
            {
                return EnsureFrameworkServices()._popupControlService; 
            }
        }

 
        internal static KeyboardNavigation KeyboardNavigation
        { 
            get 
            {
                return EnsureFrameworkServices()._keyboardNavigation; 
            }
        }

        /// <summary>
        ///     The ToolTip for the element. 
        ///     If the value is of type ToolTip, then that is the ToolTip that will be used.
        ///     If the value is of any other type, then that value will be used 
        ///     as the content for a ToolTip provided by the system. Refer to ToolTipService 
        ///     for attached properties to customize the ToolTip.
        /// </summary> 
        public object ToolTip
        { 
            get
            { 
                return ToolTipService.GetToolTip(this); 
            }
 
            set
            {
                ToolTipService.SetToolTip(this, value);
            } 
        }
 
        /// <summary> 
        /// The ContextMenu data set on this element. Can be any type that can be converted to a UIElement.
        /// </summary> 
        public ContextMenu ContextMenu
        {
            get
            { 
                return GetValue(ContextMenuProperty) as ContextMenu;
            } 
 
            set
            { 
                SetValue(ContextMenuProperty, value);
            }
        }
 
        // Gettor and Settor for flag that indicates if this
        // instance has some property values that are 
        // set to a resource reference
        internal bool HasResourceReference
        {
            get { return ReadInternalFlag(InternalFlags.HasResourceReferences); } 
            set { WriteInternalFlag(InternalFlags.HasResourceReferences, value); }
        } 
 
        internal bool IsLogicalChildrenIterationInProgress
        { 
            get { return ReadInternalFlag(InternalFlags.IsLogicalChildrenIterationInProgress); }
            set { WriteInternalFlag(InternalFlags.IsLogicalChildrenIterationInProgress, value); }
        }
 
        internal bool InVisibilityCollapsedTree
        { 
            get { return ReadInternalFlag(InternalFlags.InVisibilityCollapsedTree); } 
            set { WriteInternalFlag(InternalFlags.InVisibilityCollapsedTree, value); }
        } 

        internal bool SubtreeHasLoadedChangeHandler
        {
            get { return ReadInternalFlag2(InternalFlags2.TreeHasLoadedChangeHandler); } 
            set { WriteInternalFlag2(InternalFlags2.TreeHasLoadedChangeHandler, value); }
        } 
 
        internal bool IsLoadedCache
        { 
            get { return ReadInternalFlag2(InternalFlags2.IsLoadedCache); }
            set { WriteInternalFlag2(InternalFlags2.IsLoadedCache, value); }
        }
 
        internal bool IsParentAnFE
        { 
            get { return ReadInternalFlag2(InternalFlags2.IsParentAnFE); } 
            set { WriteInternalFlag2(InternalFlags2.IsParentAnFE, value); }
        } 

        internal bool IsTemplatedParentAnFE
        {
            get { return ReadInternalFlag2(InternalFlags2.IsTemplatedParentAnFE); } 
            set { WriteInternalFlag2(InternalFlags2.IsTemplatedParentAnFE, value); }
        } 
 
        internal bool HasLogicalChildren
        { 
            get { return ReadInternalFlag(InternalFlags.HasLogicalChildren); }
            set { WriteInternalFlag(InternalFlags.HasLogicalChildren, value); }
        }


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
        // NOTE: TemplateChildIndex is stored in the low bits of _flags2
        internal int TemplateChildIndex 
        { 
            get
            { 
                uint childIndex = (((uint)_flags2) & 0xFFFF);
                if (childIndex == 0xFFFF)
                {
                    return -1; 
                }
                else 
                { 
                    return (int)childIndex;
                } 
            }
            set
            {
                // We store TemplateChildIndex as a 16-bit integer with 0xFFFF meaning "-1". 
                // Thus we support any indices in the range [-1, 65535).
                if (value < -1 || value >= 0xFFFF) 
                { 
                    throw new ArgumentOutOfRangeException("value", SR.Get(SRID.TemplateChildIndexOutOfRange));
                } 

                uint childIndex = (value == -1) ? 0xFFFF : (uint)value;

                _flags2 = (InternalFlags2)(childIndex | (((uint)_flags2) & 0xFFFF0000)); 
            }
        } 
 
        internal bool IsRequestingExpression
        { 
            get { return ReadInternalFlag2(InternalFlags2.IsRequestingExpression); }
            set { WriteInternalFlag2(InternalFlags2.IsRequestingExpression, value); }
        }
 
        internal bool BypassLayoutPolicies
        { 
            get { return ReadInternalFlag2(InternalFlags2.BypassLayoutPolicies); } 
            set { WriteInternalFlag2(InternalFlags2.BypassLayoutPolicies, value); }
        } 

        private static DependencyObjectType ControlDType 
        {
            get 
            { 
                if (_controlDType == null)
                { 
                    _controlDType = DependencyObjectType.FromSystemTypeInternal(typeof(Control));
                }

                return _controlDType; 
            }
        } 
 
        private static DependencyObjectType ContentPresenterDType
        { 
            get
            {
                if (_contentPresenterDType == null)
                { 
                    _contentPresenterDType = DependencyObjectType.FromSystemTypeInternal(typeof(ContentPresenter));
                } 
 
                return _contentPresenterDType;
            } 
        }

        private static DependencyObjectType PageDType
        { 
            get
            { 
                if (_pageDType == null) 
                {
                    _pageDType = DependencyObjectType.FromSystemTypeInternal(typeof(Page)); 
                }

                return _pageDType;
            } 
        }
 
        private static DependencyObjectType PageFunctionBaseDType 
        {
            get 
            {
                if (_pageFunctionBaseDType == null)
                {
                    _pageFunctionBaseDType = DependencyObjectType.FromSystemTypeInternal(typeof(PageFunctionBase)); 
                }
 
                return _pageFunctionBaseDType; 
            }
        } 

        //
        //  This property
        //  1. Finds the correct initial size for the _effectiveValues store on the current DependencyObject 
        //  2. This is a performance optimization
        // 
        internal override int EffectiveValuesInitialSize 
        {
            get { return 7; } 
        }

        // Ratio of screen to layout DPI in x dimension
        internal static double DpiScaleX 
        {
            get 
            { 
                if (SystemParameters.DpiX != 96)
                { 
                    return (double)SystemParameters.DpiX / 96.0;
                }
                return 1.0;
            } 
        }
 
        // Ratio of screen to layout DPI in y dimension 
        internal static double DpiScaleY
        { 
            get
            {
                if (SystemParameters.Dpi != 96)
                { 
                    return (double)SystemParameters.Dpi / 96.0;
                } 
                return 1.0; 
            }
        } 
	});
	
	Object.defineProperties(FrameworkElement, {
 
 
        /// <summary>
        ///     ResourcesChanged private key 
        /// </summary>
        internal static readonly EventPrivateKey ResourcesChangedKey = new EventPrivateKey();

 
        /// <summary>
        ///     ResourceReferenceExpressions on non-[FE/FCE] add listeners to this 
        ///     event so they can get notified when there is a ResourcesChange 
        /// </summary>
        /// <remarks> 
        ///     make this pay-for-play by storing handlers
        ///     in EventHandlersStore
        /// </remarks>
        internal event EventHandler ResourcesChanged 
        {
            add 
            { 
                PotentiallyHasMentees = true;
                EventHandlersStoreAdd(FrameworkElement.ResourcesChangedKey, value); 
            }
            remove { EventHandlersStoreRemove(FrameworkElement.ResourcesChangedKey, value); }
        }
 

        /// <summary> 
        ///     InheritedPropertyChanged private key 
        /// </summary>
        internal static readonly EventPrivateKey InheritedPropertyChangedKey = new EventPrivateKey(); 


        /// <summary>
        ///     Mentees add listeners to this 
        ///     event so they can get notified when there is a InheritedPropertyChange
        /// </summary> 
        /// <remarks> 
        ///     make this pay-for-play by storing handlers
        ///     in EventHandlersStore 
        /// </remarks>
        internal event InheritedPropertyChangedEventHandler InheritedPropertyChanged
        {
            add 
            {
                PotentiallyHasMentees = true; 
                EventHandlersStoreAdd(FrameworkElement.InheritedPropertyChangedKey, value); 
            }
            remove { EventHandlersStoreRemove(FrameworkElement.InheritedPropertyChangedKey, value); } 
        }

 
        // Optimization, to avoid calling FromSystemType too often
        internal new static DependencyObjectType DType = DependencyObjectType.FromSystemTypeInternal(typeof(FrameworkElement)); 


        private static readonly UncommonField<DependencyObject> InheritanceContextField = new UncommonField<DependencyObject>(); 
        private static readonly UncommonField<DependencyObject> MentorField = new UncommonField<DependencyObject>();
 
        /// <summary>Style Dependency Property</summary> 
        public static readonly DependencyProperty StyleProperty =
                DependencyProperty.Register(
                        "Style", 
                        typeof(Style),
                        _typeofThis, 
                        new FrameworkPropertyMetadata( 
                                (Style) null,   // default value
                                FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                new PropertyChangedCallback(OnStyleChanged)));

        /// <summary> 
        /// OverridesDefaultStyleProperty
        /// </summary> 
        public static readonly DependencyProperty OverridesDefaultStyleProperty 
            = DependencyProperty.Register("OverridesDefaultStyle", typeof(bool), _typeofThis,
                                            new FrameworkPropertyMetadata( 
                                                        BooleanBoxes.FalseBox,   // default value
                                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                                        new PropertyChangedCallback(OnThemeStyleKeyChanged)));
 
 
        ///     The UseLayoutRounding property. 
        /// </summary>
        public static readonly DependencyProperty UseLayoutRoundingProperty = 
                DependencyProperty.Register(
                        "UseLayoutRounding",
                        typeof(bool),
                        typeof(FrameworkElement), 
                        new FrameworkPropertyMetadata(
                            false, 
                            FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure, 
                            new PropertyChangedCallback(OnUseLayoutRoundingChanged)
                            )); 

        /// <summary>
        /// DefaultStyleKeyProperty
        /// </summary>
        protected internal static readonly DependencyProperty DefaultStyleKeyProperty 
            = DependencyProperty.Register("DefaultStyleKey", typeof(object), _typeofThis,
                                            new FrameworkPropertyMetadata( 
                                                        null,   // default value 
                                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                                        new PropertyChangedCallback(OnThemeStyleKeyChanged))); 

        internal static readonly NumberSubstitution DefaultNumberSubstitution = new NumberSubstitution( 
            NumberCultureSource.User,           // number substitution in UI defaults to user culture
            null,                               // culture override
            NumberSubstitutionMethod.AsCulture
            ); 

 
        /// <summary> 
        /// Add / Remove TargetUpdatedEvent handler
        /// </summary> 
        public event EventHandler<DataTransferEventArgs> TargetUpdated
        {
            add     { AddHandler(Binding.TargetUpdatedEvent, value); }
            remove  { RemoveHandler(Binding.TargetUpdatedEvent, value); } 
        }
 
 
        /// <summary>
        /// Add / Remove SourceUpdatedEvent handler 
        /// </summary>
        public event EventHandler<DataTransferEventArgs> SourceUpdated
        {
            add     { AddHandler(Binding.SourceUpdatedEvent, value); } 
            remove  { RemoveHandler(Binding.SourceUpdatedEvent, value); }
        } 
 
        /// <summary>
        ///     DataContext DependencyProperty 
        /// </summary>
        public static readonly DependencyProperty DataContextProperty =
                    DependencyProperty.Register(
                                "DataContext", 
                                typeof(object),
                                _typeofThis, 
                                new FrameworkPropertyMetadata(null, 
                                        FrameworkPropertyMetadataOptions.Inherits,
                                        new PropertyChangedCallback(OnDataContextChanged))); 

        /// <summary>
        ///     DataContextChanged private key
        /// </summary> 
        internal static readonly EventPrivateKey DataContextChangedKey = new EventPrivateKey();
 

 
        /// <summary>
        ///     BindingGroup DependencyProperty 
        /// </summary> 
        public static readonly DependencyProperty BindingGroupProperty =
                    DependencyProperty.Register( 
                                "BindingGroup",
                                typeof(BindingGroup),
                                _typeofThis,
                                new FrameworkPropertyMetadata(null, 
                                        FrameworkPropertyMetadataOptions.Inherits));
 
        /// <summary>
        /// Language can be specified in xaml at any point using the xml language attribute xml:lang.
        /// This will make the culture pertain to the scope of the element where it is applied.  The 
        /// XmlLanguage names follow the RFC 3066 standard. For example, U.S. English is "en-US".
        /// </summary> 
        static public readonly DependencyProperty LanguageProperty = 
                    DependencyProperty.RegisterAttached(
                                "Language", 
                                typeof(XmlLanguage),
                                _typeofThis,
                                new FrameworkPropertyMetadata(
                                        XmlLanguage.GetLanguage("en-US"), 
                                        FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure));

        /// <summary> 
        ///     The DependencyProperty for the Name property.
        /// </summary>
        public static readonly DependencyProperty NameProperty = 
                    DependencyProperty.Register(
                                "Name", 
                                typeof(string), 
                                _typeofThis,
                                new FrameworkPropertyMetadata( 
                                    string.Empty,                           // defaultValue
                                    FrameworkPropertyMetadataOptions.None,  // flags
                                    null,                                   // propertyChangedCallback
                                    null,                                   // coerceValueCallback 
                                    true),                                  // isAnimationProhibited
                                new ValidateValueCallback(System.Windows.Markup.NameValidationHelper.NameValidationCallback)); 
 
        /// <summary>
        ///     The DependencyProperty for the Tag property.
        /// </summary> 
        public static readonly DependencyProperty TagProperty =
                    DependencyProperty.Register( 
                                "Tag", 
                                typeof(object),
                                _typeofThis, 
                                new FrameworkPropertyMetadata((object) null));

        /// <summary> 
        ///     InputScope DependencyProperty 
        ///     this is originally registered on InputMethod class
        /// </summary> 
        public static readonly DependencyProperty InputScopeProperty =
                    InputMethod.InputScopeProperty.AddOwner(_typeofThis,
                                new FrameworkPropertyMetadata((InputScope)null, // default value
                                            FrameworkPropertyMetadataOptions.Inherits)); 

        /// <summary>
        /// RequestBringIntoView Event 
        /// </summary>
        public static readonly RoutedEvent RequestBringIntoViewEvent = EventManager.RegisterRoutedEvent("RequestBringIntoView", RoutingStrategy.Bubble, typeof(RequestBringIntoViewEventHandler), _typeofThis);


        private static PropertyMetadata _actualWidthMetadata = new ReadOnlyFrameworkPropertyMetadata(0d, new GetReadOnlyValueCallback(GetActualWidth));

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
        private static readonly DependencyPropertyKey ActualWidthPropertyKey = 
                DependencyProperty.RegisterReadOnly(
                        "ActualWidth", 
                        typeof(double),
                        _typeofThis,
                        _actualWidthMetadata);
 
        /// <summary>
        /// The ActualWidth dynamic property.
        /// </summary> 
        public static readonly DependencyProperty ActualWidthProperty =
                ActualWidthPropertyKey.DependencyProperty; 
 
        private static PropertyMetadata _actualHeightMetadata = new ReadOnlyFrameworkPropertyMetadata(0d, new GetReadOnlyValueCallback(GetActualHeight));

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
        private static readonly DependencyPropertyKey ActualHeightPropertyKey = 
                DependencyProperty.RegisterReadOnly(
                        "ActualHeight", 
                        typeof(double),
                        _typeofThis,
                        _actualHeightMetadata);
 
        /// <summary>
        /// The ActualHeight dynamic property.
        /// </summary> 
        public static readonly DependencyProperty ActualHeightProperty =
                ActualHeightPropertyKey.DependencyProperty; 
 
        /// <summary> 
        /// Width Dependency Property
        /// </summary> 
        public static readonly DependencyProperty WidthProperty =
                    DependencyProperty.Register( 
                                "Width",
                                typeof(double),
                                _typeofThis,
                                new FrameworkPropertyMetadata( 
                                        Double.NaN,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(OnTransformDirty)), 
                                new ValidateValueCallback(IsWidthHeightValid));
 

        /// <summary>
        /// MinWidth Dependency Property 
        /// </summary>
        public static readonly DependencyProperty MinWidthProperty = 
                    DependencyProperty.Register(
                                "MinWidth", 
                                typeof(double),
                                _typeofThis,
                                new FrameworkPropertyMetadata(
                                        0d, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(OnTransformDirty)), 
                                new ValidateValueCallback(IsMinWidthHeightValid)); 

        /// <summary>
        /// MaxWidth Dependency Property
        /// </summary> 
        public static readonly DependencyProperty MaxWidthProperty = 
                    DependencyProperty.Register( 
                                "MaxWidth",
                                typeof(double), 
                                _typeofThis,
                                new FrameworkPropertyMetadata(
                                        Double.PositiveInfinity,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(OnTransformDirty)),
                                new ValidateValueCallback(IsMaxWidthHeightValid)); 
 
        /// <summary>
        /// Height Dependency Property
        /// </summary> 
        public static readonly DependencyProperty HeightProperty = 
                    DependencyProperty.Register( 
                                "Height",
                                typeof(double), 
                                _typeofThis,
                                new FrameworkPropertyMetadata(
                                    Double.NaN,
                                    FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                    new PropertyChangedCallback(OnTransformDirty)),
                                new ValidateValueCallback(IsWidthHeightValid)); 
 
        /// <summary>
        /// MinHeight Dependency Property
        /// </summary>
        public static readonly DependencyProperty MinHeightProperty =
                    DependencyProperty.Register( 
                                "MinHeight", 
                                typeof(double),
                                _typeofThis, 
                                new FrameworkPropertyMetadata(
                                        0d,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(OnTransformDirty)), 
                                new ValidateValueCallback(IsMinWidthHeightValid));
 
        /// <summary> 
        /// MaxHeight Dependency Property
        /// </summary>
        public static readonly DependencyProperty MaxHeightProperty = 
                    DependencyProperty.Register(
                                "MaxHeight", 
                                typeof(double), 
                                _typeofThis,
                                new FrameworkPropertyMetadata( 
                                        Double.PositiveInfinity,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(OnTransformDirty)),
                                new ValidateValueCallback(IsMaxWidthHeightValid)); 

        /// <summary>
        /// FlowDirectionProperty 
        /// </summary>
        public static readonly DependencyProperty FlowDirectionProperty =
                    DependencyProperty.RegisterAttached( 
                                "FlowDirection",
                                typeof(FlowDirection), 
                                _typeofThis, 
                                new FrameworkPropertyMetadata(
                                            System.Windows.FlowDirection.LeftToRight, // default value 
                                            FrameworkPropertyMetadataOptions.Inherits
                                          | FrameworkPropertyMetadataOptions.AffectsParentArrange,
                                            new PropertyChangedCallback(OnFlowDirectionChanged),
                                            new CoerceValueCallback(CoerceFlowDirectionProperty)), 
                                new ValidateValueCallback(IsValidFlowDirection));
 
        /// <summary>
        /// MarginProperty 
        /// </summary> 
        public static readonly DependencyProperty MarginProperty 
            = DependencyProperty.Register("Margin", typeof(Thickness), _typeofThis,
                                          new FrameworkPropertyMetadata(
                                                new Thickness(),
                                                FrameworkPropertyMetadataOptions.AffectsMeasure), 
                                          new ValidateValueCallback(IsMarginValid));
 

        /// <summary> 
        /// HorizontalAlignment Dependency Property.
        /// </summary>
        public static readonly DependencyProperty HorizontalAlignmentProperty = 
                    DependencyProperty.Register(
                                "HorizontalAlignment", 
                                typeof(HorizontalAlignment), 
                                _typeofThis,
                                new FrameworkPropertyMetadata( 
                                            HorizontalAlignment.Stretch,
                                            FrameworkPropertyMetadataOptions.AffectsArrange),
                                new ValidateValueCallback(ValidateHorizontalAlignmentValue));
 
        /// <summary>
        /// VerticalAlignment Dependency Property. 
        /// </summary> 
        public static readonly DependencyProperty VerticalAlignmentProperty = 
                    DependencyProperty.Register(
                                "VerticalAlignment",
                                typeof(VerticalAlignment),
                                _typeofThis, 
                                new FrameworkPropertyMetadata(
                                            VerticalAlignment.Stretch, 
                                            FrameworkPropertyMetadataOptions.AffectsArrange), 
                                new ValidateValueCallback(ValidateVerticalAlignmentValue));
 
        /// <summary>
        /// FocusVisualStyleProperty 
        /// </summary>
        public static readonly DependencyProperty FocusVisualStyleProperty = 
                    DependencyProperty.Register( 
                                "FocusVisualStyle",
                                typeof(Style), 
                                _typeofThis,
                                new FrameworkPropertyMetadata(DefaultFocusVisualStyle));

 
        /// <summary>
        /// CursorProperty 
        /// </summary> 
        public static readonly DependencyProperty CursorProperty =
                    DependencyProperty.Register( 
                                "Cursor",
                                typeof(Cursor),
                                _typeofThis,
                                new FrameworkPropertyMetadata( 
                                            (object) null, // default value
                                            0, 
                                            new PropertyChangedCallback(OnCursorChanged))); 

        /// <summary>
        ///     ForceCursorProperty 
        /// </summary>
        public static readonly DependencyProperty ForceCursorProperty = 
                    DependencyProperty.Register( 
                                "ForceCursor",
                                typeof(bool), 
                                _typeofThis,
                                new FrameworkPropertyMetadata(
                                            BooleanBoxes.FalseBox, // default value
                                            0, 
                                            new PropertyChangedCallback(OnForceCursorChanged)));
 
        /// <summary>
        ///     Initialized private key
        /// </summary>
        internal static readonly EventPrivateKey InitializedKey = new EventPrivateKey(); 

        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary> 
        internal static readonly DependencyPropertyKey LoadedPendingPropertyKey =
                    DependencyProperty.RegisterReadOnly( 
                                "LoadedPending",
                                typeof(object[]),
                                _typeofThis,
                                new PropertyMetadata(null)); // default value 

        /// <summary> 
        ///     This DP is set on the root of a sub-tree that is about to receive a broadcast Loaded event 
        ///     This DP is cleared when the Loaded event is either fired or cancelled for some reason
        /// </summary> 
        internal static readonly DependencyProperty LoadedPendingProperty =
            LoadedPendingPropertyKey.DependencyProperty;

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
        internal static readonly DependencyPropertyKey UnloadedPendingPropertyKey = 
                    DependencyProperty.RegisterReadOnly(
                                "UnloadedPending", 
                                typeof(object[]),
                                _typeofThis,
                                new PropertyMetadata(null)); // default value
 
        /// <summary>
        ///     This DP is set on the root of a sub-tree that is about to receive a broadcast Unloaded event 
        ///     This DP is cleared when the Unloaded event is either fired or cancelled for some reason 
        /// </summary>
        internal static readonly DependencyProperty UnloadedPendingProperty = 
            UnloadedPendingPropertyKey.DependencyProperty;

        /// <summary> 
        ///     Loaded RoutedEvent
        /// </summary>
        public static readonly RoutedEvent LoadedEvent = EventManager.RegisterRoutedEvent("Loaded", RoutingStrategy.Direct, typeof(RoutedEventHandler), _typeofThis);
 
        /// <summary>
        ///     Unloaded private key 
        /// </summary>
        public static readonly RoutedEvent UnloadedEvent = EventManager.RegisterRoutedEvent("Unloaded", RoutingStrategy.Direct, typeof(RoutedEventHandler), _typeofThis); 
 
 
        internal static PopupControlService PopupControlService
        { 
            get 
            {
                return EnsureFrameworkServices()._popupControlService; 
            }
        }

 
        internal static KeyboardNavigation KeyboardNavigation
        { 
            get 
            {
                return EnsureFrameworkServices()._keyboardNavigation; 
            }
        }

        private static FrameworkServices EnsureFrameworkServices() 
        {
            if ((_frameworkServices == null)) 
            { 
                // Enable KeyboardNavigation, ContextMenu, and ToolTip services.
                 _frameworkServices = new FrameworkServices(); 
            }

            return _frameworkServices;
        } 

        /// <summary> 
        ///     The DependencyProperty for the ToolTip property 
        /// </summary>
        public static readonly DependencyProperty ToolTipProperty = 
            ToolTipService.ToolTipProperty.AddOwner(_typeofThis);

        /// <summary>
        /// The DependencyProperty for the Contextmenu property 
        /// </summary>
        public static readonly DependencyProperty ContextMenuProperty =
            ContextMenuService.ContextMenuProperty.AddOwner(
                        _typeofThis, 
                        new FrameworkPropertyMetadata((ContextMenu) null));
 
        /// <summary>
        ///     The RoutedEvent for the ToolTipOpening event. 
        /// </summary> 
        public static readonly RoutedEvent ToolTipOpeningEvent = ToolTipService.ToolTipOpeningEvent.AddOwner(_typeofThis);
 
        /// <summary> 
        ///     The RoutedEvent for the ToolTipClosing event.
        /// </summary> 
        public static readonly RoutedEvent ToolTipClosingEvent = ToolTipService.ToolTipClosingEvent.AddOwner(_typeofThis);

        /// <summary>
        ///     RoutedEvent for the ContextMenuOpening event. 
        /// </summary>
        public static readonly RoutedEvent ContextMenuOpeningEvent = ContextMenuService.ContextMenuOpeningEvent.AddOwner(_typeofThis); 
 
        /// <summary> 
        ///     RoutedEvent for the ContextMenuClosing event.
        /// </summary> 
        public static readonly RoutedEvent ContextMenuClosingEvent = ContextMenuService.ContextMenuClosingEvent.AddOwner(_typeofThis);

        private static DependencyObjectType ControlDType 
        {
            get 
            { 
                if (_controlDType == null)
                { 
                    _controlDType = DependencyObjectType.FromSystemTypeInternal(typeof(Control));
                }

                return _controlDType; 
            }
        } 
 
        private static DependencyObjectType ContentPresenterDType
        { 
            get
            {
                if (_contentPresenterDType == null)
                { 
                    _contentPresenterDType = DependencyObjectType.FromSystemTypeInternal(typeof(ContentPresenter));
                } 
 
                return _contentPresenterDType;
            } 
        }

        private static DependencyObjectType PageDType
        { 
            get
            { 
                if (_pageDType == null) 
                {
                    _pageDType = DependencyObjectType.FromSystemTypeInternal(typeof(Page)); 
                }

                return _pageDType;
            } 
        }
 
        private static DependencyObjectType PageFunctionBaseDType 
        {
            get 
            {
                if (_pageFunctionBaseDType == null)
                {
                    _pageFunctionBaseDType = DependencyObjectType.FromSystemTypeInternal(typeof(PageFunctionBase)); 
                }
 
                return _pageFunctionBaseDType; 
            }
        } 

        // Ratio of screen to layout DPI in x dimension
        internal static double DpiScaleX 
        {
            get 
            { 
                if (SystemParameters.DpiX != 96)
                { 
                    return (double)SystemParameters.DpiX / 96.0;
                }
                return 1.0;
            } 
        }
 
        // Ratio of screen to layout DPI in y dimension 
        internal static double DpiScaleY
        { 
            get
            {
                if (SystemParameters.Dpi != 96)
                { 
                    return (double)SystemParameters.Dpi / 96.0;
                } 
                return 1.0; 
            }
        } 
	});

    // Invoked when the Style property is changed
    private static void OnStyleChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    { 
        FrameworkElement fe = (FrameworkElement) d;
        fe.HasLocalStyle = (e.NewEntry.BaseValueSourceInternal == BaseValueSourceInternal.Local); 
        StyleHelper.UpdateStyleCache(fe, null, (Style) e.OldValue, (Style) e.NewValue, ref fe._styleCache);
    }


    private static void OnUseLayoutRoundingChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
        FrameworkElement fe = (FrameworkElement)d;
        bool newValue = (bool)e.NewValue; 
        fe.SetFlags(newValue, VisualFlags.UseLayoutRounding); 
    }

    // This function is called when ThemeStyleKey or OverridesThemeStyle properties change
    private static void OnThemeStyleKeyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        // Re-evaluate ThemeStyle because it is 
        // a factor of the ThemeStyleKey property 
        ((FrameworkElement)d).UpdateThemeStyleProperty();
    } 

    // Invoked when the ThemeStyle property is changed 
    internal static void OnThemeStyleChanged(DependencyObject d, object oldValue, object newValue)
    { 
        FrameworkElement fe = (FrameworkElement) d;
        StyleHelper.UpdateThemeStyleCache(fe, null, (Style) oldValue, (Style) newValue, ref fe._themeStyleCache);
    }

    // Given a FrameworkElement and a name string, this routine will try to find
    //  a node with Name property set to the given name.  It will search all 
    //  the child logical tree nodes of the given starting element.
    // If the name string is null or an empty string, the given starting element 
    //  is returned. 
    // If the name is found on a FrameworkContentElement, an exception is thrown
    // If the name is not found attached to anything, an exception is thrown 
    internal static FrameworkElement FindNamedFrameworkElement( FrameworkElement startElement, string targetName )
    {
        FrameworkElement targetFE = null;

        if( targetName == null || targetName.Length == 0 )
        { 
            targetFE = startElement; 
        }
        else 
        {
            DependencyObject targetObject = null;

            targetObject = LogicalTreeHelper.FindLogicalNode( startElement, targetName ); 

            if( targetObject == null ) 
            { 
                throw new ArgumentException( SR.Get(SRID.TargetNameNotFound, targetName));
            } 

            FrameworkObject fo = new FrameworkObject(targetObject);
            if( fo.IsFE )
            { 
                targetFE = fo.FE;
            } 
            else 
            {
                throw new InvalidOperationException(SR.Get(SRID.NamedObjectMustBeFrameworkElement, targetName)); 
            }
        }

        return targetFE; 
    }

    // FindImplicitSytle(fe) : Default: unlinkedParent, deferReference
    internal static object FindImplicitStyleResource(FrameworkElement fe, object resourceKey, out object source) 
    {
        // Do a FindResource call only if someone in the ancestry has
        // implicit styles. This is a performance optimization.

        if (fe.ShouldLookupImplicitStyles)
        { 
            object unlinkedParent = null; 
            bool allowDeferredResourceReference = false;
            bool mustReturnDeferredResourceReference = false; 

            // Implicit style lookup must stop at the app.
            bool isImplicitStyleLookup = true;

            // For non-controls the implicit StyleResource lookup must stop at
            // the templated parent. Look at task 25606 for further details. 
            DependencyObject boundaryElement = null; 
            if (!(fe is Control))
            { 
                boundaryElement = fe.TemplatedParent;
            }

            object implicitStyle = FindResourceInternal(fe, 
                                                        null,                            // fce
                                                        FrameworkElement.StyleProperty,  // dp 
                                                        resourceKey, 
                                                        unlinkedParent,
                                                        allowDeferredResourceReference, 
                                                        mustReturnDeferredResourceReference,
                                                        boundaryElement,
                                                        isImplicitStyleLookup,
                                                        out source); 

            // The reason this assert is commented is because there are specific scenarios when we can reach 
            // here even before the ShouldLookupImplicitStyles flag is updated. But this is still acceptable 
            // because the flag does get updated and the style property gets re-fetched soon after.

            // Look at AccessText.GetVisualChild implementation for example and
            // consider the following sequence of operations.

            // 1. contentPresenter.AddVisualChild(accessText) 
            // 1.1. accessText._parent = contentPresenter
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

        source = null;
        return DependencyProperty.UnsetValue;
    } 

    // FindImplicitSytle(fce) : Default: unlinkedParent, deferReference 
    internal static object FindImplicitStyleResource(FrameworkContentElement fce, object resourceKey, out object source) 
    {
        // Do a FindResource call only if someone in the ancestry has 
        // implicit styles. This is a performance optimization.

        if (fce.ShouldLookupImplicitStyles)
        { 
            object unlinkedParent = null;
            bool allowDeferredResourceReference = false; 
            bool mustReturnDeferredResourceReference = false; 

            // Implicit style lookup must stop at the app. 
            bool isImplicitStyleLookup = true;

            // For non-controls the implicit StyleResource lookup must stop at
            // the templated parent. Look at task 25606 for further details. 
            DependencyObject boundaryElement = fce.TemplatedParent;

            object implicitStyle = FindResourceInternal(null, fce, FrameworkContentElement.StyleProperty, resourceKey, unlinkedParent, allowDeferredResourceReference, mustReturnDeferredResourceReference, boundaryElement, isImplicitStyleLookup, out source); 

            // Look at comments on the FE version of this method. 

            // Debug.Assert(!(implicitStyle != DependencyProperty.UnsetValue && fce.ShouldLookupImplicitStyles == false),
            //     "ShouldLookupImplicitStyles is false even while there exists an implicit style in the lookup path. To be precise at source " + source);

            return implicitStyle;
        } 

        source = null;
        return DependencyProperty.UnsetValue; 
    }

    // Internal method for Parser to find a resource when
    // the instance is not yet hooked to the logical tree 
    // This method returns DependencyProperty.UnsetValue when
    // resource is not found. Otherwise it returns the value 
    // found. NOTE: Value resource found could be null 
    // FindResource(fe/fce)  Default: dp, unlinkedParent, deferReference, boundaryElement, source, isImplicitStyleLookup
    internal static object FindResourceInternal(FrameworkElement fe, FrameworkContentElement fce, object resourceKey) 
    {
        object source;

        return FindResourceInternal(fe, 
                                    fce,
                                    null,   // dp, 
                                    resourceKey, 
                                    null,   // unlinkedParent,
                                    false,  // allowDeferredResourceReference, 
                                    false,  // mustReturnDeferredResourceReference,
                                    null,   // boundaryElement,
                                    false,  // isImplicitStyleLookup,
                                    out source); 
    }

    // This method is used during serialization of ResourceReferenceExpressions 
    // to find out if we are indeed serializing the source application that holds the
    // resource we are refering to in the expression. 
    // The method will return the resource if found and also its corresponding
    // source application in the same scenario. Source is null when resource is
    // not found or when the resource is fetched from SystemResources
    internal static object FindResourceFromAppOrSystem( 
        object resourceKey,
        out object source, 
        bool disableThrowOnResourceNotFound, 
        bool allowDeferredResourceReference,
        bool mustReturnDeferredResourceReference) 
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
                                                     out source);
    }

    // FindResourceInternal(fe/fce)  Defaults: none
    internal static object FindResourceInternal( 
        FrameworkElement        fe, 
        FrameworkContentElement fce,
        DependencyProperty      dp, 
        object                  resourceKey,
        object                  unlinkedParent,
        bool                    allowDeferredResourceReference,
        bool                    mustReturnDeferredResourceReference, 
        DependencyObject        boundaryElement,
        bool                    isImplicitStyleLookup, 
        out object              source) 
    {
        object value; 
        InheritanceBehavior inheritanceBehavior = InheritanceBehavior.Default;

        if( TraceResourceDictionary.IsEnabled )
        { 
            FrameworkObject element = new FrameworkObject(fe, fce);

            TraceResourceDictionary.Trace( 
                TraceEventType.Start,
                TraceResourceDictionary.FindResource, 
                 element.DO,
                 resourceKey );
        }

        try
        { 

            // First try to find the resource in the tree
            if (fe != null || fce != null || unlinkedParent != null) 
            {
                value = FindResourceInTree(fe, fce, dp, resourceKey, unlinkedParent, allowDeferredResourceReference, mustReturnDeferredResourceReference, boundaryElement,
                                            out inheritanceBehavior, out source);
                if (value != DependencyProperty.UnsetValue) 
                {
                    return value; 
                } 

            } 

            // Then we try to find the resource in the App's Resources
            Application app = Application.Current;
            if (app != null && 
                (inheritanceBehavior == InheritanceBehavior.Default ||
                 inheritanceBehavior == InheritanceBehavior.SkipToAppNow || 
                 inheritanceBehavior == InheritanceBehavior.SkipToAppNext)) 
            {
                value = app.FindResourceInternal(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference); 
                if (value != null)
                {
                    source = app;

                    if( TraceResourceDictionary.IsEnabled )
                    { 
                        TraceResourceDictionary.TraceActivityItem( 
                            TraceResourceDictionary.FoundResourceInApplication,
                             resourceKey, 
                            value );
                    }

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
                    source = SystemResourceHost.Instance;

                    if( TraceResourceDictionary.IsEnabled )
                    {
                        TraceResourceDictionary.TraceActivityItem(
                            TraceResourceDictionary.FoundResourceInTheme, 
                            source,
                            resourceKey, 
                            value ); 
                    }


                    return value;
                }
            } 
        }
        finally 
        { 
            if( TraceResourceDictionary.IsEnabled )
            { 
                FrameworkObject element = new FrameworkObject(fe, fce);

                TraceResourceDictionary.Trace(
                    TraceEventType.Stop, 
                    TraceResourceDictionary.FindResource,
                     element.DO, 
                     resourceKey ); 
            }
        } 

        // We haven't found the resource.  Trace a message to the debugger.
        //
        // Only trace if this isn't an implicit 
        // style lookup and the element has been loaded
        if (TraceResourceDictionary.IsEnabledOverride && !isImplicitStyleLookup) 
        { 
            if ((fe != null && fe.IsLoaded) || (fce != null && fce.IsLoaded))
            { 
                TraceResourceDictionary.Trace( TraceEventType.Warning,
                        TraceResourceDictionary.ResourceNotFound,
                        resourceKey );
            } 
            else if( TraceResourceDictionary.IsEnabled )
            { 
                TraceResourceDictionary.TraceActivityItem( 
                        TraceResourceDictionary.ResourceNotFound,
                        resourceKey ); 
            }
        }

        source = null; 
        return DependencyProperty.UnsetValue;
    } 

    // FindResourceInTree(fe/fce)  Defaults: none
    internal static object FindResourceInTree( 
        FrameworkElement        feStart,
        FrameworkContentElement fceStart,
        DependencyProperty      dp,
        object                  resourceKey, 
        object                  unlinkedParent,
        bool                    allowDeferredResourceReference, 
        bool                    mustReturnDeferredResourceReference, 
        DependencyObject        boundaryElement,
        out InheritanceBehavior inheritanceBehavior, 
        out object              source)
    {
        FrameworkObject startNode = new FrameworkObject(feStart, fceStart);
        FrameworkObject fo = startNode; 
        object value;
        Style style; 
        FrameworkTemplate frameworkTemplate; 
        Style themeStyle;
        int loopCount = 0; 
        bool hasParent = true;
        inheritanceBehavior = InheritanceBehavior.Default;

        while (hasParent) 
        {
            Debug.Assert(startNode.IsValid || unlinkedParent != null, 
                          "Don't call FindResource with a null fe/fce and unlinkedParent"); 

            if (loopCount > ContextLayoutManager.s_LayoutRecursionLimit) 
            {
                // We suspect a loop here because the loop count
                // has exceeded the MAX_TREE_DEPTH expected
                throw new InvalidOperationException(SR.Get(SRID.LogicalTreeLoop)); 
            }
            else 
            { 
                loopCount++;
            } 

            // -------------------------------------------
            //  Lookup ResourceDictionary on the current instance
            // ------------------------------------------- 

            style = null; 
            frameworkTemplate = null; 
            themeStyle = null;

            if (fo.IsFE)
            {
                FrameworkElement fe = fo.FE;

                value = fe.FindResourceOnSelf(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference);
                if (value != DependencyProperty.UnsetValue) 
                { 
                    source = fe;

                    if( TraceResourceDictionary.IsEnabled )
                    {
                        TraceResourceDictionary.TraceActivityItem(
                            TraceResourceDictionary.FoundResourceOnElement, 
                            source,
                            resourceKey, 
                            value ); 
                    }

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
                FrameworkContentElement fce = fo.FCE;

                value = fce.FindResourceOnSelf(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference);
                if (value != DependencyProperty.UnsetValue) 
                { 
                    source = fce;

                    if( TraceResourceDictionary.IsEnabled )
                    {
                        TraceResourceDictionary.TraceActivityItem(
                            TraceResourceDictionary.FoundResourceOnElement, 
                            source,
                            resourceKey, 
                            value ); 
                    }

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
                    source = style;

                    if( TraceResourceDictionary.IsEnabled ) 
                    {
                        TraceResourceDictionary.TraceActivityItem( 
                            TraceResourceDictionary.FoundResourceInStyle, 
                            style.Resources,
                            resourceKey, 
                            style,
                            fo.DO,
                            value );
                    } 

                    return value; 
                } 
            }
            if (frameworkTemplate != null) 
            {
                value = frameworkTemplate.FindResource(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference);
                if (value != DependencyProperty.UnsetValue)
                { 
                    source = frameworkTemplate;

                    if( TraceResourceDictionary.IsEnabled ) 
                    {
                        TraceResourceDictionary.TraceActivityItem( 
                            TraceResourceDictionary.FoundResourceInTemplate,
                            frameworkTemplate.Resources,
                            resourceKey,
                            frameworkTemplate, 
                            fo.DO,
                            value ); 
                    } 

                    return value; 
                }
            }

            if (themeStyle != null) 
            {
                value = themeStyle.FindResource(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference); 
                if (value != DependencyProperty.UnsetValue) 
                {
                    source = themeStyle; 

                    if( TraceResourceDictionary.IsEnabled )
                    {
                        TraceResourceDictionary.TraceActivityItem( 
                            TraceResourceDictionary.FoundResourceInThemeStyle,
                            themeStyle.Resources, 
                            resourceKey, 
                            themeStyle,
                            fo.DO, 
                            value );
                    }

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
                inheritanceBehavior = fo.InheritanceBehavior;
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
                DependencyObject unlinkedParentAsDO = unlinkedParent as DependencyObject; 
                if (unlinkedParentAsDO != null)
                { 
                    fo.Reset(unlinkedParentAsDO);
                    if (fo.IsValid)
                    {
                        hasParent = true; 
                    }
                    else 
                    { 
                        DependencyObject doParent = GetFrameworkParent(unlinkedParent);
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
                Debug.Assert(fo.IsValid,
                              "The current node being processed should be an FE/FCE");

                fo = fo.FrameworkParent; 

                hasParent = fo.IsValid; 
            } 

            // If the current element for resource lookup is marked such 
            // then skip to the Application and/or System resources
            if (fo.IsValid && TreeWalkHelper.SkipNow(fo.InheritanceBehavior))
            {
                inheritanceBehavior = fo.InheritanceBehavior; 
                break;
            } 
        } 

        // No matching resource was found in the tree 
        source = null;
        return DependencyProperty.UnsetValue;
    }


    // Searches through resource dictionaries to find a [Data|Table|ItemContainer]Template 
    //  that matches the type of the 'item' parameter.  Failing an exact 
    //  match of the type, return something that matches one of its parent
    //  types. 
    internal static object FindTemplateResourceInternal(DependencyObject target, object item, Type templateType)
    {
        // Data styling doesn't apply to UIElement (bug 1007133).
        if (item == null || (item is UIElement)) 
        {
            return null; 
        } 

        Type type; 
        object dataType = ContentPresenter.DataTypeForItem(item, target, out type);

        ArrayList keys = new ArrayList();

        // construct the list of acceptable keys, in priority order
        int exactMatch = -1;    // number of entries that count as an exact match 

        // add compound keys for the dataType and all its base types
        while (dataType != null) 
        {
            object key = null;
            if (templateType == typeof(ItemContainerTemplate))
                key = new ItemContainerTemplateKey(dataType); 
            else if (templateType == typeof(DataTemplate))
                key = new DataTemplateKey(dataType); 

            if (key != null)
                keys.Add(key); 

            // all keys added for the given item type itself count as an exact match
            if (exactMatch == -1)
                exactMatch = keys.Count; 

            if (type != null) 
            { 
                type = type.BaseType;
                if (type == typeof(Object))     // don't search for Object - perf 
                    type = null;
            }

            dataType = type; 
        }

        int bestMatch = keys.Count; // index of best match so far 

        // Search the parent chain 
        object resource = FindTemplateResourceInTree(target, keys, exactMatch, ref bestMatch);

        if (bestMatch >= exactMatch)
        { 
            // Exact match not found in the parent chain.  Try App and System Resources.
            object appResource = Helper.FindTemplateResourceFromAppOrSystem(target, keys, exactMatch, ref bestMatch); 

            if (appResource != null)
                resource = appResource; 
        }

        return resource;
    } 

    // Search the parent chain for a [Data|Table]Template in a ResourceDictionary. 
    private static object FindTemplateResourceInTree(DependencyObject target, ArrayList keys, int exactMatch, ref int bestMatch) 
    {
        Debug.Assert(target != null, "Don't call FindTemplateResource with a null target object"); 

        ResourceDictionary table;
        object resource = null;

        FrameworkObject fo = new FrameworkObject(target);
        Debug.Assert(fo.IsValid, "Don't call FindTemplateResource with a target object that is neither a FrameworkElement nor a FrameworkContentElement"); 

        while (fo.IsValid)
        { 
            object candidate;

            // -------------------------------------------
            //  Lookup ResourceDictionary on the current instance 
            // -------------------------------------------

            // Fetch the ResourceDictionary 
            // for the given target element
            table = GetInstanceResourceDictionary(fo.FE, fo.FCE); 
            if( table != null )
            {
                candidate = FindBestMatchInResourceDictionary( table, keys, exactMatch, ref bestMatch );
                if (candidate != null) 
                {
                    resource = candidate; 
                    if (bestMatch < exactMatch) 
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
                candidate = FindBestMatchInResourceDictionary( table, keys, exactMatch, ref bestMatch ); 
                if (candidate != null)
                { 
                    resource = candidate; 
                    if (bestMatch < exactMatch)
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
                candidate = FindBestMatchInResourceDictionary( table, keys, exactMatch, ref bestMatch );
                if (candidate != null) 
                { 
                    resource = candidate;
                    if (bestMatch < exactMatch) 
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
                candidate = FindBestMatchInResourceDictionary( table, keys, exactMatch, ref bestMatch ); 
                if (candidate != null) 
                {
                    resource = candidate; 
                    if (bestMatch < exactMatch)
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
    private static object FindBestMatchInResourceDictionary( 
        ResourceDictionary table, ArrayList keys, int exactMatch, ref int bestMatch)
    {
        object resource = null;
        int k; 

        // Search target element's ResourceDictionary for the resource 
        if (table != null) 
        {
            for (k = 0;  k < bestMatch;  ++k) 
            {
                object candidate = table[keys[k]];
                if (candidate != null)
                { 
                    resource = candidate;
                    bestMatch = k; 

                    // if we found an exact match, no need to continue
                    if (bestMatch < exactMatch) 
                        return resource;
                }
            }
        } 

        return resource; 
    } 

    // Return a reference to the ResourceDictionary set on the instance of 
    //  the given Framework(Content)Element, if such a ResourceDictionary exists.
    private static ResourceDictionary GetInstanceResourceDictionary(FrameworkElement fe, FrameworkContentElement fce)
    {
        ResourceDictionary table = null; 

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
    private static ResourceDictionary GetStyleResourceDictionary(FrameworkElement fe, FrameworkContentElement fce)
    { 
        ResourceDictionary table = null;

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
    private static ResourceDictionary GetThemeStyleResourceDictionary(FrameworkElement fe, FrameworkContentElement fce)
    { 
        ResourceDictionary table = null;

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
    private static ResourceDictionary GetTemplateResourceDictionary(FrameworkElement fe, FrameworkContentElement fce) 
    {
        ResourceDictionary table = null; 

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

    // Finds the nearest NameScope by walking up the logical tree
    internal static INameScope FindScope(DependencyObject d)
    { 
        DependencyObject scopeOwner;
        return FindScope(d, out scopeOwner); 
    } 

    // Finds the nearest NameScope by walking up the logical tree 
    internal static INameScope FindScope(DependencyObject d, out DependencyObject scopeOwner)
    {
        while (d != null)
        { 
            INameScope nameScope = NameScope.NameScopeFromObject(d);
            if (nameScope != null) 
            { 
                scopeOwner = d;
                return nameScope; 
            }

            DependencyObject parent = LogicalTreeHelper.GetParent(d);

            d = (parent != null) ? parent : Helper.FindMentor(d.InheritanceContext);
        } 

        scopeOwner = null;
        return null; 
    }

    //
    // Get the closest Framework type up the logical or physical tree 
    // 
    // (Shared between FrameworkElement and FrameworkContentElement)
    // 
    internal static DependencyObject GetFrameworkParent(object current)
    {
        FrameworkObject fo = new FrameworkObject(current as DependencyObject);

        fo = fo.FrameworkParent;

        return fo.DO; 
    }

    internal static bool GetFrameworkParent(FrameworkElement current, out FrameworkElement feParent, out FrameworkContentElement fceParent)
    {
        FrameworkObject fo = new FrameworkObject(current, null);

        fo = fo.FrameworkParent;

        feParent = fo.FE; 
        fceParent = fo.FCE;

        return fo.IsValid;
    }


    internal static bool GetFrameworkParent(FrameworkContentElement current, out FrameworkElement feParent, out FrameworkContentElement fceParent)
    { 
        FrameworkObject fo = new FrameworkObject(null, current); 

        fo = fo.FrameworkParent; 

        feParent = fo.FE;
        fceParent = fo.FCE;

        return fo.IsValid;
    } 

    internal static bool GetContainingFrameworkElement(DependencyObject current, out FrameworkElement fe, out FrameworkContentElement fce)
    { 
        FrameworkObject fo = FrameworkObject.GetContainingFrameworkElement(current);

        if (fo.IsValid)
        { 
            fe = fo.FE;
            fce = fo.FCE; 
            return true; 
        }
        else 
        {
            fe = null;
            fce = null;
            return false; 
        }
    } 


    // Fetchs the specified childRecord for the given template.  Returns true if successful. 
    internal static void GetTemplatedParentChildRecord(
        DependencyObject templatedParent,
        int childIndex,
        out ChildRecord childRecord, 
        out bool isChildRecordValid)
    { 
        FrameworkTemplate templatedParentTemplate = null; 
        isChildRecordValid = false;
        childRecord = new ChildRecord();    // CS0177 

        if (templatedParent != null)
        {
            FrameworkObject foTemplatedParent = new FrameworkObject(templatedParent, true); 

            Debug.Assert( foTemplatedParent.IsFE ); 

            // This node is the result of a style expansion

            // Pick the owner for the VisualTree that generated this node
            templatedParentTemplate = foTemplatedParent.FE.TemplateInternal;

            Debug.Assert(templatedParentTemplate != null , 
                "If this node is the result of a VisualTree expansion then it should have a parent template");

            // Check if this Child Index is represented in FrameworkTemplate 
            if (templatedParentTemplate != null && ((0 <= childIndex) && (childIndex < templatedParentTemplate.ChildRecordFromChildIndex.Count)))
            { 
                childRecord = templatedParentTemplate.ChildRecordFromChildIndex[childIndex];
                isChildRecordValid = true;
            }

        }
    } 

    static FrameworkElement() 
    {
        SnapsToDevicePixelsProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(BooleanBoxes.FalseBox, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsArrange));

        EventManager.RegisterClassHandler(_typeofThis, Mouse.QueryCursorEvent, new QueryCursorEventHandler(FrameworkElement.OnQueryCursorOverride), true); 

        EventManager.RegisterClassHandler(_typeofThis, Keyboard.PreviewGotKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(OnPreviewGotKeyboardFocus)); 
        EventManager.RegisterClassHandler(_typeofThis, Keyboard.GotKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(OnGotKeyboardFocus)); 
        EventManager.RegisterClassHandler(_typeofThis, Keyboard.LostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(OnLostKeyboardFocus));

        AllowDropProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(BooleanBoxes.FalseBox, FrameworkPropertyMetadataOptions.Inherits));

        Stylus.IsPressAndHoldEnabledProperty.AddOwner(_typeofThis, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits));
        Stylus.IsFlicksEnabledProperty.AddOwner(_typeofThis, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits)); 
        Stylus.IsTapFeedbackEnabledProperty.AddOwner(_typeofThis, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits));
        Stylus.IsTouchFeedbackEnabledProperty.AddOwner(_typeofThis, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits)); 

        PropertyChangedCallback numberSubstitutionChanged = new PropertyChangedCallback(NumberSubstitutionChanged);
        NumberSubstitution.CultureSourceProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(NumberCultureSource.User, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, numberSubstitutionChanged)); 
        NumberSubstitution.CultureOverrideProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, numberSubstitutionChanged));
        NumberSubstitution.SubstitutionProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(NumberSubstitutionMethod.AsCulture, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, numberSubstitutionChanged));

        // Exposing these events in protected virtual methods 
        EventManager.RegisterClassHandler(_typeofThis, ToolTipOpeningEvent, new ToolTipEventHandler(OnToolTipOpeningThunk));
        EventManager.RegisterClassHandler(_typeofThis, ToolTipClosingEvent, new ToolTipEventHandler(OnToolTipClosingThunk)); 
        EventManager.RegisterClassHandler(_typeofThis, ContextMenuOpeningEvent, new ContextMenuEventHandler(OnContextMenuOpeningThunk)); 
        EventManager.RegisterClassHandler(_typeofThis, ContextMenuClosingEvent, new ContextMenuEventHandler(OnContextMenuClosingThunk));

        // Coerce Callback for font properties for responding to system themes
        TextElement.FontFamilyProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(SystemFonts.MessageFontFamily, FrameworkPropertyMetadataOptions.Inherits, null, new CoerceValueCallback(CoerceFontFamily)));
        TextElement.FontSizeProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(SystemFonts.MessageFontSize, FrameworkPropertyMetadataOptions.Inherits, null, new CoerceValueCallback(CoerceFontSize)));
        TextElement.FontStyleProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(SystemFonts.MessageFontStyle, FrameworkPropertyMetadataOptions.Inherits, null, new CoerceValueCallback(CoerceFontStyle))); 
        TextElement.FontWeightProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(SystemFonts.MessageFontWeight, FrameworkPropertyMetadataOptions.Inherits, null, new CoerceValueCallback(CoerceFontWeight)));

        TextOptions.TextRenderingModeProperty.OverrideMetadata( 
            typeof(FrameworkElement),
            new FrameworkPropertyMetadata( 
                new PropertyChangedCallback(TextRenderingMode_Changed)));

    }

    private static void TextRenderingMode_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
        FrameworkElement fe = (FrameworkElement) d; 
        fe.pushTextRenderingMode();
    } 

    internal static readonly NumberSubstitution DefaultNumberSubstitution = new NumberSubstitution( 
        NumberCultureSource.User,           // number substitution in UI defaults to user culture
        null,                               // culture override
        NumberSubstitutionMethod.AsCulture
        ); 


    private static void OnDataContextChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        if (e.NewValue == BindingExpressionBase.DisconnectedItem)
            return;

        ((FrameworkElement) d).RaiseDependencyPropertyChanged(DataContextChangedKey, e);
    } 

    // Add Style TargetType and FEF EventHandlers to the EventRoute 
    internal static void AddStyleHandlersToEventRoute(
        FrameworkElement fe,
        FrameworkContentElement fce,
        EventRoute route, 
        RoutedEventArgs args)
    { 
        Debug.Assert(fe != null || fce != null); 

        DependencyObject source = (fe != null) ? (DependencyObject)fe : (DependencyObject)fce; 
        Style selfStyle = null;
        FrameworkTemplate selfFrameworkTemplate = null;
        DependencyObject templatedParent = null;
        int templateChildIndex = -1; 

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
        RoutedEventHandlerInfo[] handlers = null;
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
            FrameworkTemplate templatedParentTemplate = null;

            FrameworkElement feTemplatedParent = templatedParent as FrameworkElement;
            Debug.Assert( feTemplatedParent != null ); 

            templatedParentTemplate = feTemplatedParent.TemplateInternal; 

            // Fetch handlers from either the parent style or template
            handlers = null; 
            if (templatedParentTemplate != null && templatedParentTemplate.HasEventDependents)
            {
                handlers = StyleHelper.GetChildRoutedEventHandlers(templateChildIndex, args.RoutedEvent, ref templatedParentTemplate.EventDependents);
            } 

            // Add FEF EventHandlers to the route 
            AddStyleHandlersToEventRoute(route, source, handlers); 
        }
    } 

    // This is a helper that will facilitate adding a given array of handlers to the route
    private static void AddStyleHandlersToEventRoute(
        EventRoute route, 
        DependencyObject source,
        RoutedEventHandlerInfo[] handlers) 
    { 
        if (handlers != null)
        { 
            for (int i=0; i<handlers.Length; i++)
            {
                route.Add(source, handlers[i].Handler, handlers[i].InvokeHandledEventsToo);
            } 
        }
    } 

    internal static bool InvalidateAutomationIntermediateElements( 
        DependencyObject mergePoint, 
        DependencyObject modelTreeNode)
    { 
        UIElement e = null;
        ContentElement ce = null;
        UIElement3D e3d = null;

        while (modelTreeNode != null && modelTreeNode != mergePoint)
        { 
            if (!UIElementHelper.InvalidateAutomationPeer(modelTreeNode, out e, out ce, out e3d)) 
            {
                return false; 
            }

            // Get model parent
            modelTreeNode = LogicalTreeHelper.GetParent(modelTreeNode); 
        }

        return true; 
    }

    private static object GetActualWidth(DependencyObject d, out BaseValueSourceInternal source)
    { 
        FrameworkElement fe = (FrameworkElement) d; 
        if (fe.HasWidthEverChanged)
        { 
            source = BaseValueSourceInternal.Local;
            return fe.RenderSize.Width;
        }
        else 
        {
            source = BaseValueSourceInternal.Default; 
            return 0d; 
        }
    } 

    private static object GetActualHeight(DependencyObject d, out BaseValueSourceInternal source)
    { 
        FrameworkElement fe = (FrameworkElement) d; 
        if (fe.HasHeightEverChanged)
        { 
            source = BaseValueSourceInternal.Local;
            return fe.RenderSize.Height;
        }
        else 
        {
            source = BaseValueSourceInternal.Default; 
            return 0d; 
        }
    } 

    private static bool IsWidthHeightValid(object value) 
    { 
        double v = (double)value;
        return (DoubleUtil.IsNaN(v)) || (v >= 0.0d && !Double.IsPositiveInfinity(v)); 
    }

    private static bool IsMinWidthHeightValid(object value)
    { 
        double v = (double)value;
        return (!DoubleUtil.IsNaN(v) && v >= 0.0d && !Double.IsPositiveInfinity(v)); 
    } 

    private static bool IsMaxWidthHeightValid(object value) 
    {
        double v = (double)value;
        return (!DoubleUtil.IsNaN(v) && v >= 0.0d);
    } 

    //  Since layout applies mirroring based on pair-wise flow direction property value comparison 
    //  of an element and its visual parent and since this does not exactly match property engine's
    //  notion of dirty-ness, the following measures are taken: 
    //  1.  FlowDirectionProperty is made force inherited property.
    //  2.  Invalidation happens during coercion (which is called always unlike behaviour of
    //      flags set in metadata).
    private static object CoerceFlowDirectionProperty(DependencyObject d, object value) 
    {
        FrameworkElement fe = d as FrameworkElement; 
        if (fe != null) 
        {
            fe.InvalidateArrange(); 
            fe.InvalidateVisual();
            fe.AreTransformsClean = false;
        }
        return value; 
    }

    private static void OnFlowDirectionChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        // Check that d is a FrameworkElement since the property inherits and this can be called 
        // on non-FEs.
        FrameworkElement fe = d as FrameworkElement;
        if (fe != null)
        { 
            // Cache the new value as a bit to optimize accessing the FlowDirection property's CLR accessor
            fe.IsRightToLeft = ((FlowDirection)e.NewValue) == FlowDirection.RightToLeft; 
            fe.AreTransformsClean = false; 
        }
    } 

    /// <summary>
    /// Queries the attached property FlowDirection from the given element. 
    /// </summary>
    /// <seealso cref="DockPanel.DockProperty" /> 
    public static FlowDirection GetFlowDirection(DependencyObject element) 
    {
        if (element == null) { throw new ArgumentNullException("element"); } 
        return (FlowDirection)element.GetValue(FlowDirectionProperty);
    }

    /// <summary> 
    /// Writes the attached property FlowDirection to the given element.
    /// </summary> 
    /// <seealso cref="DockPanel.DockProperty" /> 
    public static void SetFlowDirection(DependencyObject element, FlowDirection value)
    { 
        if (element == null) { throw new ArgumentNullException("element"); }
        element.SetValue(FlowDirectionProperty, value);
    }

    /// <summary>
    /// Validates the flow direction property values 
    /// </summary> 
    private static bool IsValidFlowDirection(object o)
    { 
        FlowDirection value = (FlowDirection)o;
        return value == FlowDirection.LeftToRight || value == FlowDirection.RightToLeft;
    }

    private static bool IsMarginValid(object value) 
    {
        Thickness m = (Thickness)value; 
        return m.IsValid(true, false, true, false);
    }

    internal static bool ValidateHorizontalAlignmentValue(object value)
    { 
        HorizontalAlignment ha = (HorizontalAlignment)value; 
        return (    ha == HorizontalAlignment.Left
                ||  ha == HorizontalAlignment.Center 
                ||  ha == HorizontalAlignment.Right
                ||  ha == HorizontalAlignment.Stretch   );
    }

    internal static bool ValidateVerticalAlignmentValue(object value)
    {
        VerticalAlignment va = (VerticalAlignment)value;
        return (    va == VerticalAlignment.Top 
                ||  va == VerticalAlignment.Center
                ||  va == VerticalAlignment.Bottom 
                ||  va == VerticalAlignment.Stretch); 
    }

    // Need a special value here until bug 1016350 is fixed.  KeyboardNavigation
    // treats this as the value to indicate that it should do a resource lookup
    // to find the "real" default value.
    private static Style _defaultFocusVisualStyle = null; 

    // If the cursor is changed, we may need to set the actual cursor. 
    static private void OnCursorChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        FrameworkElement fe = ((FrameworkElement)d);

        if(fe.IsMouseOver)
        { 
            Mouse.UpdateCursor(); 
        }
    } 

    // If the ForceCursor property changed, we may need to set the actual cursor.
    static private void OnForceCursorChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        FrameworkElement fe = ((FrameworkElement)d);

        if(fe.IsMouseOver) 
        {
            Mouse.UpdateCursor(); 
        } 
    }

    private static void OnQueryCursorOverride(object sender, QueryCursorEventArgs e)
    {
        FrameworkElement fe = (FrameworkElement) sender;

        // We respond to querying the cursor by specifying the cursor set
        // as a property on this element. 
        Cursor cursor = fe.Cursor; 

        if(cursor != null) 
        {
            // We specify the cursor if the QueryCursor event is not
            // handled by the time it gets to us, or if we are configured
            // to force our cursor anyways.  Since the QueryCursor event 
            // bubbles, this has the effect of overriding whatever cursor
            // a child of ours specified. 
            if(!e.Handled || fe.ForceCursor) 
            {
                e.Cursor = cursor; 
                e.Handled = true;
            }
        }
    } 


    /// <summary> 
    /// Helper method to read and return flow direction property value for a given visual. 
    /// </summary>
    /// <param name="visual">Visual to get flow direction for.</param> 
    /// <returns>Flow direction property value.</returns>
    private static FlowDirection GetFlowDirectionFromVisual(DependencyObject visual)
    {
        FlowDirection flowDirection = FlowDirection.LeftToRight; 

        for (DependencyObject v = visual; v != null; v = VisualTreeHelper.GetParent(v)) 
        { 
            FrameworkElement fe = v as FrameworkElement;
            if (fe != null) 
            {
                flowDirection = fe.FlowDirection;
                break;
            } 
            else
            { 
                // Try to get value from Visual. 
                // ContentHost, when processing ContentElements with changing FlowDirection
                // property value, will create a Visual and set FlowDirectionProperty on it. 
                // For this reason need to take into account Visuals with local value set
                // for FlowDirectionProperty.
                object flowDirectionValue = v.ReadLocalValue(FlowDirectionProperty);
                if (flowDirectionValue != DependencyProperty.UnsetValue) 
                {
                    flowDirection = (FlowDirection)flowDirectionValue; 
                    break; 
                }
            } 
        }

        return (flowDirection);
    } 

    private static void OnPreviewGotKeyboardFocus(object sender, KeyboardFocusChangedEventArgs e)
    { 
        if (e.OriginalSource == sender)
        { 
            FrameworkElement fe = (FrameworkElement)sender; 

            // If element has an FocusedElement we need to delegate focus to it 
            // and handle the event if focus successfully delegated
            IInputElement activeElement = FocusManager.GetFocusedElement(fe, true);
            if (activeElement != null && activeElement != sender && Keyboard.IsFocusable(activeElement as DependencyObject))
            { 
                IInputElement oldFocus = Keyboard.FocusedElement;
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

    private static void OnGotKeyboardFocus(object sender, KeyboardFocusChangedEventArgs e)
    { 
        // This static class handler will get hit each time anybody gets hit with a tunnel that someone is getting focused.
        // We're only interested when the element is getting focused is processing the event.
        // NB: This will not do the right thing if the element rejects focus or does not want to be scrolled into view.
        if (sender == e.OriginalSource) 
        {
            FrameworkElement fe = (FrameworkElement)sender; 
            KeyboardNavigation.UpdateFocusedElement(fe); 

            KeyboardNavigation keyNav = KeyboardNavigation.Current; 
            KeyboardNavigation.ShowFocusVisual();
            keyNav.NotifyFocusChanged(fe, e);
            keyNav.UpdateActiveElement(fe);
        } 
    }

    private static void OnLostKeyboardFocus(object sender, KeyboardFocusChangedEventArgs e) 
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

    /// <summary>
    ///     Initialized private key
    /// </summary>
    internal static readonly EventPrivateKey InitializedKey = new EventPrivateKey(); 

    private static void NumberSubstitutionChanged(DependencyObject o, DependencyPropertyChangedEventArgs e)
    {
        ((FrameworkElement) o).HasNumberSubstitutionChanged = true;
    } 

    // Returns true when the coerce callback should return the current system metric 
    private static bool ShouldUseSystemFont(FrameworkElement fe, DependencyProperty dp) 
    {
        bool hasModifiers; 

        // Return the current system font when (changing the system theme OR creating an element and the default is outdated)
        // AND the element is a root AND the element has not had a value set on it by the user
        return  (SystemResources.SystemResourcesAreChanging || (fe.ReadInternalFlag(InternalFlags.CreatingRoot) && SystemResources.SystemResourcesHaveChanged)) && 
                 fe._parent == null && VisualTreeHelper.GetParent(fe) == null &&
                 fe.GetValueSource(dp, null, out hasModifiers) == BaseValueSourceInternal.Default; 
    } 

    // Coerce Font properties on root elements when created or System resources change 
    private static object CoerceFontFamily(DependencyObject o, object value)
    {
        // For root elements with default values, return current system metric if local value has not been set
        if (ShouldUseSystemFont((FrameworkElement)o, TextElement.FontFamilyProperty)) 
        {
            return SystemFonts.MessageFontFamily; 
        } 

        return value; 
    }

    private static object CoerceFontSize(DependencyObject o, object value)
    { 
        // For root elements with default values, return current system metric if local value has not been set
        if (ShouldUseSystemFont((FrameworkElement)o, TextElement.FontSizeProperty)) 
        { 
            return SystemFonts.MessageFontSize;
        } 

        return value;
    }

    private static object CoerceFontStyle(DependencyObject o, object value)
    { 
        // For root elements with default values, return current system metric if local value has not been set 
        if (ShouldUseSystemFont((FrameworkElement)o, TextElement.FontStyleProperty))
        { 
            return SystemFonts.MessageFontStyle;
        }

        return value; 
    }

    private static object CoerceFontWeight(DependencyObject o, object value) 
    {
        // For root elements with default values, return current system metric if local value has not been set 
        if (ShouldUseSystemFont((FrameworkElement)o, TextElement.FontWeightProperty))
        {
            return SystemFonts.MessageFontWeight;
        } 

        return value; 
    } 

    private static void OnToolTipOpeningThunk(object sender, ToolTipEventArgs e)
    {
        ((FrameworkElement)sender).OnToolTipOpening(e);
    } 

    private static void OnToolTipClosingThunk(object sender, ToolTipEventArgs e) 
    { 
        ((FrameworkElement)sender).OnToolTipClosing(e);
    } 

    private static void OnContextMenuOpeningThunk(object sender, ContextMenuEventArgs e)
    { 
        ((FrameworkElement)sender).OnContextMenuOpening(e);
    } 

    private static void OnContextMenuClosingThunk(object sender, ContextMenuEventArgs e)
    { 
        ((FrameworkElement)sender).OnContextMenuClosing(e);
    } 


    internal static void AddIntermediateElementsToRoute( 
        DependencyObject mergePoint,
        EventRoute route, 
        RoutedEventArgs args,
        DependencyObject modelTreeNode)
    {
        while (modelTreeNode != null && modelTreeNode != mergePoint) 
        {
            UIElement uiElement = modelTreeNode as UIElement; 
            ContentElement contentElement = modelTreeNode as ContentElement; 
            UIElement3D uiElement3D = modelTreeNode as UIElement3D;

            if(uiElement != null)
            {
                uiElement.AddToEventRoute(route, args);

                FrameworkElement fe = uiElement as FrameworkElement;
                if (fe != null) 
                { 
                    AddStyleHandlersToEventRoute(fe, null, route, args);
                } 
            }
            else if (contentElement != null)
            {
                contentElement.AddToEventRoute(route, args); 

                FrameworkContentElement fce = contentElement as FrameworkContentElement; 
                if (fce != null) 
                {
                    AddStyleHandlersToEventRoute(null, fce, route, args); 
                }
            }
            else if (uiElement3D != null)
            { 
                uiElement3D.AddToEventRoute(route, args);
            } 

            // Get model parent
            modelTreeNode = LogicalTreeHelper.GetParent(modelTreeNode); 
        }
    }
	
	FrameworkElement.Type = new Type("FrameworkElement", FrameworkElement, [Object.Type]);
	return FrameworkElement;
});

    public partial class FrameworkElement : UIElement, IFrameworkInputElement, ISupportInitialize, IHaveResources, IQueryAmbient
    { 
        static private readonly Type _typeofThis = typeof(FrameworkElement);
   
        /// <summary>
        ///     Returns logical parent 
        /// </summary> 
        public DependencyObject Parent
        { 
            get
            {
                // Verify Context Access
                // VerifyAccess(); 

                return ContextVerifiedGetParent(); 
            } 
        }
 
        /// <summary>
        /// Registers the name - element combination from the
        /// NameScope that the current element belongs to.
        /// </summary> 
        /// <param name="name">Name of the element</param>
        /// <param name="scopedElement">Element where name is defined</param> 
        public void RegisterName(string name, object scopedElement) 
        {
            INameScope nameScope = FrameworkElement.FindScope(this); 
            if (nameScope != null)
            {
                nameScope.RegisterName(name, scopedElement);
            } 
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.NameScopeNotFound, name, "register")); 
            }
        } 

        /// <summary>
        /// Unregisters the name - element combination from the
        /// NameScope that the current element belongs to. 
        /// </summary>
        /// <param name="name">Name of the element</param> 
        public void UnregisterName(string name) 
        {
            INameScope nameScope = FrameworkElement.FindScope(this); 
            if (nameScope != null)
            {
                nameScope.UnregisterName(name);
            } 
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.NameScopeNotFound, name, "unregister")); 
            }
        } 

        /// <summary>
        /// Find the object with given name in the
        /// NameScope that the current element belongs to. 
        /// </summary>
        /// <param name="name">string name to index</param> 
        /// <returns>context if found, else null</returns> 
        public object FindName(string name)
        { 
            DependencyObject scopeOwner;
            return FindName(name, out scopeOwner);
        }
 
        // internal version of FindName that returns the scope owner
        internal object FindName(string name, out DependencyObject scopeOwner) 
        { 
            INameScope nameScope = FrameworkElement.FindScope(this, out scopeOwner);
            if (nameScope != null) 
            {
                return nameScope.FindName(name);
            }
 
            return null;
        } 
 
        /// <summary>
        /// Elements that arent connected to the tree do not receive theme change notifications. 
        /// We leave it upto the app author to listen for such changes and invoke this method on
        /// elements that they know that arent connected to the tree. This method will update the
        /// DefaultStyle for the subtree starting at the current instance.
        /// </summary> 
        public void UpdateDefaultStyle()
        { 
            TreeWalkHelper.InvalidateOnResourcesChange(/* fe = */ this, /* fce = */ null, ResourcesChangeInfo.ThemeChangeInfo); 
        }

        /// <summary>
        ///     Returns enumerator to logical children 
        /// </summary>
        protected internal virtual IEnumerator LogicalChildren 
        { 
            get { return null; }
        } 

        /// <summary>
        ///     Tries to find a Resource for the given resourceKey in the current 
        ///     element's ResourceDictionary.
        /// </summary> 
        internal object FindResourceOnSelf(object resourceKey, bool allowDeferredResourceReference, bool mustReturnDeferredResourceReference) 
        {
            ResourceDictionary resources = ResourcesField.GetValue(this); 
            if ((resources != null) && resources.Contains(resourceKey))
            {
                bool canCache;
                return resources.FetchResource(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference, out canCache); 
            }
 
            return DependencyProperty.UnsetValue; 
        }
 
        internal DependencyObject ContextVerifiedGetParent()
        {
            return _parent;
        } 

        protected internal void AddLogicalChild(object child)
        { 
            if (child != null)
            { 
                // It is invalid to modify the children collection that we 
                // might be iterating during a property invalidation tree walk.
                if (IsLogicalChildrenIterationInProgress) 
                {
                    throw new InvalidOperationException(SR.Get(SRID.CannotModifyLogicalChildrenDuringTreeWalk));
                }
 
                // Now that the child is going to be added, the FE/FCE construction is considered finished,
                // so we do not expect a change of InheritanceBehavior property, 
                // so we can pick up properties from styles and resources. 
                TryFireInitialized();
 
                bool exceptionThrown = true;
                try
                {
                    HasLogicalChildren = true; 

                    // Child is present; reparent him to this element 
                    FrameworkObject fo = new FrameworkObject(child as DependencyObject); 
                    fo.ChangeLogicalParent(this);
 
                    exceptionThrown = false;
                }
                finally
                { 
                    if (exceptionThrown)
                    { 
                        // 

 
                        // Consider doing this...
                        //RemoveLogicalChild(child);
                    }
                } 
            }
        } 

        protected internal void RemoveLogicalChild(object child) 
        { 
            if (child != null)
            { 
                // It is invalid to modify the children collection that we
                // might be iterating during a property invalidation tree walk.
                if (IsLogicalChildrenIterationInProgress)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.CannotModifyLogicalChildrenDuringTreeWalk));
                } 
 
                // Child is present
                FrameworkObject fo = new FrameworkObject(child as DependencyObject); 
                if (fo.Parent == this)
                {
                    fo.ChangeLogicalParent(null);
                } 

                // This could have been the last child, so check if we have any more children 
                IEnumerator children = LogicalChildren; 

                // if null, there are no children. 
                if (children == null)
                {
                    HasLogicalChildren = false;
                } 
                else
                { 
                    // If we can move next, there is at least one child 
                    HasLogicalChildren = children.MoveNext();
                } 
            }
        }

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
        internal void ChangeLogicalParent(DependencyObject newParent) 
        {
            /////////////////// 
            // OnNewParent:
            ///////////////////

            // 
            // -- Approved By The Core Team --
            // 
            // Do not allow foreign threads to change the tree. 
            // (This is a noop if this object is not assigned to a Dispatcher.)
            // 
            // We also need to ensure that the tree is homogenous with respect
            // to the dispatchers that the elements belong to.
            //
            this.VerifyAccess(); 
            if(newParent != null)
            { 
                newParent.VerifyAccess(); 
            }
 
            // Logical Parent must first be dropped before you are attached to a newParent
            // This mitigates illegal tree state caused by logical child stealing as illustrated in bug 970706
            if (_parent != null && newParent != null && _parent != newParent)
            { 
                throw new System.InvalidOperationException(SR.Get(SRID.HasLogicalParent));
            } 
 
            // Trivial check to avoid loops
            if (newParent == this) 
            {
                throw new System.InvalidOperationException(SR.Get(SRID.CannotBeSelfParent));
            }
 
            // Logical Parent implies no InheritanceContext
            if (newParent != null) 
            { 
                ClearInheritanceContext();
            } 

            IsParentAnFE = newParent is FrameworkElement;

            DependencyObject oldParent = _parent; 
            OnNewParent(newParent);
 
            // Update Has[Loaded/Unloaded]Handler Flags 
            BroadcastEventHelper.AddOrRemoveHasLoadedChangeHandlerFlag(this, oldParent, newParent);
 


            ///////////////////
            // OnParentChanged: 
            ///////////////////
 
            // Invalidate relevant properties for this subtree 
            DependencyObject parent = (newParent != null) ? newParent : oldParent;
            TreeWalkHelper.InvalidateOnTreeChange(/* fe = */ this, /* fce = */ null, parent, (newParent != null)); 

            // If no one has called BeginInit then mark the element initialized and fire Initialized event
            // (non-parser programmatic tree building scenario)
            TryFireInitialized(); 
        }
 
        /// <summary> 
        ///     Called before the parent is chanded to the new value.
        /// </summary> 
        internal virtual void OnNewParent(DependencyObject newParent)
        {
            //
            // This API is only here for compatability with the old 
            // behavior.  Note that FrameworkElement does not have
            // this virtual, so why do we need it here? 
            // 

            DependencyObject oldParent = _parent; 
            _parent = newParent;


 
            // Synchronize ForceInherit properties
            if(_parent != null && _parent is ContentElement) 
            { 
                UIElement.SynchronizeForceInheritProperties(this, null, null, _parent);
            } 
            else if(oldParent is ContentElement)
            {
                UIElement.SynchronizeForceInheritProperties(this, null, null, oldParent);
            } 

 
            // Synchronize ReverseInheritProperty Flags 
            //
            // NOTE: do this AFTER synchronizing force-inherited flags, since 
            // they often effect focusability and such.
            this.SynchronizeReverseInheritPropertyFlags(oldParent, false);
        }
 
        // OnAncestorChangedInternal variant when we know what type (FE/FCE) the
        //  tree node is. 
        /// <SecurityNote> 
        ///     Critical: This code calls into PresentationSource.OnAncestorChanged which is link demand protected
        ///     it does so only for content elements and not for FEs. But if called externally and configured 
        ///     inappropriately it can be used to change the tree
        ///     TreatAsSafe: This does not let you get at the presentationsource which is what we do not want to expose
        /// </SecurityNote>
        internal void OnAncestorChangedInternal(TreeChangeInfo parentTreeState)
        { 
            // Cache the IsSelfInheritanceParent flag 
            bool isSelfInheritanceParent = IsSelfInheritanceParent;
 
            if (parentTreeState.Root != this)
            {
                // Clear the HasStyleChanged flag
                HasStyleChanged = false; 
                HasStyleInvalidated = false;
                HasTemplateChanged = false; 
            } 

            // If this is a tree add operation update the ShouldLookupImplicitStyles 
            // flag with respect to your parent.
            if (parentTreeState.IsAddOperation)
            {
                FrameworkObject fo = 
                    new FrameworkObject(this, null);
 
                fo.SetShouldLookupImplicitStyles(); 
            }
 
            // Invalidate ResourceReference properties
            if (HasResourceReference)
            {
                // This operation may cause a style change and hence should be done before the call to 
                // InvalidateTreeDependents as it relies on the HasStyleChanged flag
                TreeWalkHelper.OnResourcesChanged(this, ResourcesChangeInfo.TreeChangeInfo, false); 
            } 

            // If parent is a FrameworkElement 
            // This is also an operation that could change the style
            FrugalObjectList<DependencyProperty> currentInheritableProperties =
            InvalidateTreeDependentProperties(parentTreeState, isSelfInheritanceParent);
 
            // we have inherited properties that changes as a result of the above;
            // invalidation; push that list of inherited properties on the stack 
            // for the children to use 
            parentTreeState.InheritablePropertiesStack.Push(currentInheritableProperties);
 


            // Call OnAncestorChanged
            OnAncestorChanged(); 

            // Notify mentees if they exist 
            if (PotentiallyHasMentees) 
            {
                // Raise the ResourcesChanged Event so that ResourceReferenceExpressions 
                // on non-[FE/FCE] listening for this can then update their values
                RaiseClrEvent(FrameworkElement.ResourcesChangedKey, EventArgs.Empty);
            }
        } 

        // Invalidate all the properties that may have changed as a result of 
        //  changing this element's parent in the logical (and sometimes visual tree.) 
        internal FrugalObjectList<DependencyProperty> InvalidateTreeDependentProperties(TreeChangeInfo parentTreeState, bool isSelfInheritanceParent)
        { 
            AncestorChangeInProgress = true;

            InVisibilityCollapsedTree = false;  // False == we don't know whether we're in a visibility collapsed tree.
 
            if (parentTreeState.TopmostCollapsedParentNode == null)
            { 
                // There is no ancestor node with Visibility=Collapsed. 
                //  See if "fe" is the root of a collapsed subtree.
                if (Visibility == Visibility.Collapsed) 
                {
                    // This is indeed the root of a collapsed subtree.
                    //  remember this information as we proceed on the tree walk.
                    parentTreeState.TopmostCollapsedParentNode = this; 

                    // Yes, this FE node is in a visibility collapsed subtree. 
                    InVisibilityCollapsedTree = true; 
                }
            } 
            else
            {
                // There is an ancestor node somewhere above us with
                //  Visibility=Collapsed.  We're in a visibility collapsed subtree. 
                InVisibilityCollapsedTree = true;
            } 
 

            try 
            {
                // Style property is a special case of a non-inherited property that needs
                // invalidation for parent changes. Invalidate StyleProperty if it hasn't been
                // locally set because local value takes precedence over implicit references 
                if (IsInitialized && !HasLocalStyle && (this != parentTreeState.Root))
                { 
                    UpdateStyleProperty(); 
                }
 
                Style selfStyle = null;
                Style selfThemeStyle = null;
                DependencyObject templatedParent = null;
 
                int childIndex = -1;
                ChildRecord childRecord = new ChildRecord(); 
                bool isChildRecordValid = false; 

                selfStyle = Style; 
                selfThemeStyle = ThemeStyle;
                templatedParent = TemplatedParent;
                childIndex = TemplateChildIndex;
 
                // StyleProperty could have changed during invalidation of ResourceReferenceExpressions if it
                // were locally set or during the invalidation of unresolved implicitly referenced style 
                bool hasStyleChanged = HasStyleChanged; 

                // Fetch selfStyle, hasStyleChanged and childIndex for the current node 
                FrameworkElement.GetTemplatedParentChildRecord(templatedParent, childIndex, out childRecord, out isChildRecordValid);

                FrameworkElement parentFE;
                FrameworkContentElement parentFCE; 
                bool hasParent = FrameworkElement.GetFrameworkParent(this, out parentFE, out parentFCE);
 
                DependencyObject parent = null; 
                InheritanceBehavior parentInheritanceBehavior = InheritanceBehavior.Default;
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
 
                if (!TreeWalkHelper.SkipNext(InheritanceBehavior) && !TreeWalkHelper.SkipNow(parentInheritanceBehavior))
                { 
                    // Synchronize InheritanceParent 
                    this.SynchronizeInheritanceParent(parent);
                } 
                else if (!IsSelfInheritanceParent)
                {
                    // Set IsSelfInheritanceParet on the root node at a tree boundary
                    // so that all inheritable properties are cached on it. 
                    SetIsSelfInheritanceParent();
                } 
 
                // Loop through all cached inheritable properties for the parent to see if they should be invalidated.
                return TreeWalkHelper.InvalidateTreeDependentProperties(parentTreeState, /* fe = */ this, /* fce = */ null, selfStyle, selfThemeStyle, 
                    ref childRecord, isChildRecordValid, hasStyleChanged, isSelfInheritanceParent);
            }
            finally
            { 
                AncestorChangeInProgress = false;
                InVisibilityCollapsedTree = false;  // 'false' just means 'we don't know' - see comment at definition of the flag. 
            } 
        }
 
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
        internal bool ThisHasLoadedChangeEventHandler 
        {
            get 
            { 
                    if (null != EventHandlersStore)
                    { 
                        if (EventHandlersStore.Contains(LoadedEvent) || EventHandlersStore.Contains(UnloadedEvent))
                        {
                            return true;
                        } 
                    }
                    if(null != Style && Style.HasLoadedChangeHandler) 
                    { 
                        return true;
                    } 
                    if(null != ThemeStyle && ThemeStyle.HasLoadedChangeHandler)
                    {
                        return true;
                    } 

                    if(null != TemplateInternal && TemplateInternal.HasLoadedChangeHandler) 
                    { 
                        return true;
                    } 

                    if(HasFefLoadedChangeHandler)
                    {
                        return true; 
                    }
                    return false; 
                } 
        }
 
        internal bool HasFefLoadedChangeHandler
        {
            get
            { 
                if(null == TemplatedParent)
                { 
                    return false; 
                }
                FrameworkElementFactory fefRoot = BroadcastEventHelper.GetFEFTreeRoot(TemplatedParent); 
                if(null == fefRoot)
                {
                    return false;
                } 
                FrameworkElementFactory fef = StyleHelper.FindFEF(fefRoot, TemplateChildIndex);
                if(null == fef) 
                { 
                    return false;
                } 
                return fef.HasLoadedChangeHandler;
            }
        }
 

        /// <summary> 
        ///     This method causes the StyleProperty to be re-evaluated 
        /// </summary>
        internal void UpdateStyleProperty() 
        {
            if (!HasStyleInvalidated)
            {
                if (IsStyleUpdateInProgress == false) 
                {
                    IsStyleUpdateInProgress = true; 
                    try 
                    {
                        InvalidateProperty(StyleProperty); 
                        HasStyleInvalidated = true;
                    }
                    finally
                    { 
                        IsStyleUpdateInProgress = false;
                    } 
                } 
                else
                { 
                    throw new InvalidOperationException(SR.Get(SRID.CyclicStyleReferenceDetected, this));
                }
            }
        } 

        /// <summary> 
        ///     This method causes the ThemeStyleProperty to be re-evaluated 
        /// </summary>
        internal void UpdateThemeStyleProperty() 
        {
            if (IsThemeStyleUpdateInProgress == false)
            {
                IsThemeStyleUpdateInProgress = true; 
                try
                { 
                    StyleHelper.GetThemeStyle(/* fe = */ this, /* fce = */ null); 

                    // Update the ContextMenu and ToolTips separately because they aren't in the tree 
                    ContextMenu contextMenu =
                            GetValueEntry(
                                    LookupEntry(ContextMenuProperty.GlobalIndex),
                                    ContextMenuProperty, 
                                    null,
                                    RequestFlags.DeferredReferences).Value as ContextMenu; 
                    if (contextMenu != null) 
                    {
                        TreeWalkHelper.InvalidateOnResourcesChange(contextMenu, null, ResourcesChangeInfo.ThemeChangeInfo); 
                    }

                    DependencyObject toolTip =
                            GetValueEntry( 
                                    LookupEntry(ToolTipProperty.GlobalIndex),
                                    ToolTipProperty, 
                                    null, 
                                    RequestFlags.DeferredReferences).Value as DependencyObject;
 
                    if (toolTip != null)
                    {
                        FrameworkObject toolTipFO = new FrameworkObject(toolTip);
                        if (toolTipFO.IsValid) 
                        {
                            TreeWalkHelper.InvalidateOnResourcesChange(toolTipFO.FE, toolTipFO.FCE, ResourcesChangeInfo.ThemeChangeInfo); 
                        } 
                    }
 
                    OnThemeChanged();
                }
                finally
                { 
                    IsThemeStyleUpdateInProgress = false;
                } 
            } 
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.CyclicThemeStyleReferenceDetected, this));
            }
        }
 
        // Called when the theme changes so resources not in the tree can be updated by subclasses
        internal virtual void OnThemeChanged() 
        { 
        }
 
        ///<summary>
        ///     Initiate the processing for Loaded event broadcast starting at this node
        /// </summary>
        /// <remarks> 
        ///     This method is to allow firing Loaded event from a Helper class since the override is protected
        /// </remarks> 
        internal void FireLoadedOnDescendentsInternal() 
        {
            // This is to prevent duplicate Broadcasts for the Loaded event 
            if (LoadedPending == null)
            {
                DependencyObject parent = Parent;
 
                if (parent == null)
                { 
                    parent = VisualTreeHelper.GetParent(this); 
                }
 

                // Check if this Loaded cancels against a previously queued Unloaded event
                // Note that if the Loaded and the Unloaded do not change the position of
                // the node within the loagical tree they are considered to cancel each other out. 
                object[] unloadedPending = UnloadedPending;
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
        } 

        ///<summary>
        ///     Broadcast Unloaded event starting at this node
        /// </summary> 
        internal void FireUnloadedOnDescendentsInternal()
        { 
            // This is to prevent duplicate Broadcasts for the Unloaded event 
            if (UnloadedPending == null)
            { 
                DependencyObject parent = Parent;

                if (parent == null)
                { 
                    parent = VisualTreeHelper.GetParent(this);
                } 
 

                // Check if this Unloaded cancels against a previously queued Loaded event 
                // Note that if the Loaded and the Unloaded do not change the position of
                // the node within the loagical tree they are considered to cancel each other out.
                object[] loadedPending = LoadedPending;
                if (loadedPending == null) 
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
        } 

        /// <summary> 
        ///     You are about to provided as the InheritanceContext for the target.
        ///     You can choose to allow this or not.
        /// </summary>
        internal override bool ShouldProvideInheritanceContext(DependencyObject target, DependencyProperty property) 
        {
            // return true if the target is neither a FE or FCE 
            FrameworkObject fo = new FrameworkObject(target); 
            return !fo.IsValid;
        } 

        // Define the DO's inheritance context
        internal override DependencyObject InheritanceContext
        { 
            get { return InheritanceContextField.GetValue(this); }
        } 
 
        /// <summary>
        ///     You have a new InheritanceContext 
        /// </summary>
        /// <remarks>
        ///     This is to solve the case of programmatically creating a VisualBrush or BitmapCacheBrush
        ///     with an element in it and the element not getting Initialized. 
        /// </remarks>
        internal override void AddInheritanceContext(DependencyObject context, DependencyProperty property) 
        { 
            base.AddInheritanceContext(context, property);
 
            // Initialize, if not already done
            TryFireInitialized();

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
                if (!HasMultipleInheritanceContexts && InheritanceContext == null)
                { 
                    // first request - accept the new inheritance context 
                    InheritanceContextField.SetValue(this, context);
                    OnInheritanceContextChanged(EventArgs.Empty); 
                }
                else if (InheritanceContext != null)
                {
                    // second request - remove all context and enter "shared" mode 
                    InheritanceContextField.ClearValue(this);
                    WriteInternalFlag2(InternalFlags2.HasMultipleInheritanceContexts, true); 
                    OnInheritanceContextChanged(EventArgs.Empty); 
                }
                // else already in shared mode - ignore the request 
            }
        }

        // Remove an inheritance context 
        internal override void RemoveInheritanceContext(DependencyObject context, DependencyProperty property)
        { 
            if (InheritanceContext == context) 
            {
                //FrameworkObject.Log("- {0}", FrameworkObject.LogIC(context, property, this)); 
                InheritanceContextField.ClearValue(this);
                OnInheritanceContextChanged(EventArgs.Empty);
            }
 
            base.RemoveInheritanceContext(context, property);
        } 
 
        // Clear the inheritance context (called when the element
        // gets a real parent 
        private void ClearInheritanceContext()
        {
            if (InheritanceContext != null)
            { 
                InheritanceContextField.ClearValue(this);
                OnInheritanceContextChanged(EventArgs.Empty); 
            } 
        }
 
        /// <summary>
        ///     This is a means for subclasses to get notification
        ///     of InheritanceContext changes and then they can do
        ///     their own thing. 
        /// </summary>
        internal override void OnInheritanceContextChangedCore(EventArgs args) 
        { 
            DependencyObject oldMentor = MentorField.GetValue(this);
            DependencyObject newMentor = Helper.FindMentor(InheritanceContext); 

            if (oldMentor != newMentor)
            {
                MentorField.SetValue(this, newMentor); 

                if (oldMentor != null) 
                { 
                    DisconnectMentor(oldMentor);
                } 
                if (newMentor != null)
                {
                    ConnectMentor(newMentor);
                } 
            }
        } 
 
        // connect to a new mentor
        void ConnectMentor(DependencyObject mentor) 
        {
            FrameworkObject foMentor = new FrameworkObject(mentor);

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
                bool isLoaded = foMentor.IsLoaded; 

                ConnectLoadedEvents(ref foMentor, isLoaded); 
 
                if (isLoaded)
                { 
                    this.FireLoadedOnDescendentsInternal();
                }
            }
        } 

        // disconnect from an old mentor 
        void DisconnectMentor(DependencyObject mentor) 
        {
            FrameworkObject foMentor = new FrameworkObject(mentor); 

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
                bool isLoaded = foMentor.IsLoaded;

                DisconnectLoadedEvents(ref foMentor, isLoaded);
 
                if (foMentor.IsLoaded)
                { 
                    this.FireUnloadedOnDescendentsInternal(); 
                }
            } 
        }

        // called by BroadcastEventHelper when the SubtreeHasLoadedChangedHandler
        // flag changes on a mentored FE/FCE 
        internal void ChangeSubtreeHasLoadedChangedHandler(DependencyObject mentor)
        { 
            FrameworkObject foMentor = new FrameworkObject(mentor); 
            bool isLoaded = foMentor.IsLoaded;
 
            if (this.SubtreeHasLoadedChangeHandler)
            {
                ConnectLoadedEvents(ref foMentor, isLoaded);
            } 
            else
            { 
                DisconnectLoadedEvents(ref foMentor, isLoaded); 
            }
        } 

        // handle the Loaded event from the mentor
        void OnMentorLoaded(object sender, RoutedEventArgs e)
        { 
            FrameworkObject foMentor = new FrameworkObject((DependencyObject)sender);
 
            // stop listening for Loaded, start listening for Unloaded 
            foMentor.Loaded -= new RoutedEventHandler(OnMentorLoaded);
            foMentor.Unloaded += new RoutedEventHandler(OnMentorUnloaded); 

            // broadcast the Loaded event to my framework subtree
            //FireLoadedOnDescendentsInternal();
            BroadcastEventHelper.BroadcastLoadedSynchronously(this, IsLoaded); 
        }
 
        // handle the Unloaded event from the mentor 
        void OnMentorUnloaded(object sender, RoutedEventArgs e)
        { 
            FrameworkObject foMentor = new FrameworkObject((DependencyObject)sender);

            // stop listening for Unloaded, start listening for Loaded
            foMentor.Unloaded -= new RoutedEventHandler(OnMentorUnloaded); 
            foMentor.Loaded += new RoutedEventHandler(OnMentorLoaded);
 
            // broadcast the Unloaded event to my framework subtree 
            //FireUnloadedOnDescendentsInternal();
            BroadcastEventHelper.BroadcastUnloadedSynchronously(this, IsLoaded); 
        }

        void ConnectLoadedEvents(ref FrameworkObject foMentor, bool isLoaded)
        { 
            if (foMentor.IsValid)
            { 
                if (isLoaded) 
                {
                    foMentor.Unloaded += new RoutedEventHandler(OnMentorUnloaded); 
                }
                else
                {
                    foMentor.Loaded += new RoutedEventHandler(OnMentorLoaded); 
                }
            } 
        } 

        void DisconnectLoadedEvents(ref FrameworkObject foMentor, bool isLoaded) 
        {
            if (foMentor.IsValid)
            {
                if (isLoaded) 
                {
                    foMentor.Unloaded -= new RoutedEventHandler(OnMentorUnloaded); 
                } 
                else
                { 
                    foMentor.Loaded -= new RoutedEventHandler(OnMentorLoaded);
                }
            }
        } 

        // handle the InheritedPropertyChanged event from the mentor 
        void OnMentorInheritedPropertyChanged(object sender, InheritedPropertyChangedEventArgs e) 
        {
            TreeWalkHelper.InvalidateOnInheritablePropertyChange( 
                    this, null,

                    e.Info, false /*skipStartNode*/);
        } 

        // handle the ResourcesChanged event from the mentor 
        void OnMentorResourcesChanged(object sender, EventArgs e) 
        {
            TreeWalkHelper.InvalidateOnResourcesChange( 
                    this, null,

                    ResourcesChangeInfo.CatastrophicDictionaryChangeInfo);
        } 

        // Helper method to retrieve and fire the InheritedPropertyChanged event 
        internal void RaiseInheritedPropertyChangedEvent(ref InheritablePropertyChangeInfo info) 
        {
            EventHandlersStore store = EventHandlersStore; 
            if (store != null)
            {
                Delegate handler = store.Get(FrameworkElement.InheritedPropertyChangedKey);
                if (handler != null) 
                {
                    InheritedPropertyChangedEventArgs args = new InheritedPropertyChangedEventArgs(ref info); 
                    ((InheritedPropertyChangedEventHandler)handler)(this, args); 
                }
            } 
        }


        // Indicates if the Style is being re-evaluated 
        internal bool IsStyleUpdateInProgress
        { 
            get { return ReadInternalFlag(InternalFlags.IsStyleUpdateInProgress); } 
            set { WriteInternalFlag(InternalFlags.IsStyleUpdateInProgress, value); }
        } 

        // Indicates if the ThemeStyle is being re-evaluated
        internal bool IsThemeStyleUpdateInProgress
        { 
            get { return ReadInternalFlag(InternalFlags.IsThemeStyleUpdateInProgress); }
            set { WriteInternalFlag(InternalFlags.IsThemeStyleUpdateInProgress, value); } 
        } 

        // Indicates that we are storing "container template" provided values 
        // on this element -- see StyleHelper.ParentTemplateValuesField
        internal bool StoresParentTemplateValues
        {
            get { return ReadInternalFlag(InternalFlags.StoresParentTemplateValues); } 
            set { WriteInternalFlag(InternalFlags.StoresParentTemplateValues, value); }
        } 
 
        // Indicates if this instance has had NumberSubstitutionChanged on it
        internal bool HasNumberSubstitutionChanged 
        {
            get { return ReadInternalFlag(InternalFlags.HasNumberSubstitutionChanged); }
            set { WriteInternalFlag(InternalFlags.HasNumberSubstitutionChanged, value); }
        } 

        // Indicates if this instance has a tree that 
        // was generated via a Template 
        internal bool HasTemplateGeneratedSubTree
        { 
            get { return ReadInternalFlag(InternalFlags.HasTemplateGeneratedSubTree); }
            set { WriteInternalFlag(InternalFlags.HasTemplateGeneratedSubTree, value); }
        }
 
        // Indicates if this instance has an implicit style
        internal bool HasImplicitStyleFromResources 
        { 
            get { return ReadInternalFlag(InternalFlags.HasImplicitStyleFromResources); }
            set { WriteInternalFlag(InternalFlags.HasImplicitStyleFromResources, value); } 
        }

        // Indicates if there are any implicit styles in the ancestry
        internal bool ShouldLookupImplicitStyles 
        {
            get { return ReadInternalFlag(InternalFlags.ShouldLookupImplicitStyles); } 
            set { WriteInternalFlag(InternalFlags.ShouldLookupImplicitStyles, value); } 
        }
 
        // Indicates if this instance has a style set by a generator
        internal bool IsStyleSetFromGenerator
        {
            get { return ReadInternalFlag2(InternalFlags2.IsStyleSetFromGenerator); } 
            set { WriteInternalFlag2(InternalFlags2.IsStyleSetFromGenerator, value); }
        } 
 
        // Indicates if the StyleProperty has changed following a UpdateStyleProperty
        // call in OnAncestorChangedInternal 
        internal bool HasStyleChanged
        {
            get { return ReadInternalFlag2(InternalFlags2.HasStyleChanged); }
            set { WriteInternalFlag2(InternalFlags2.HasStyleChanged, value); } 
        }
 
 
        // Indicates if the TemplateProperty has changed during a tree walk
        internal bool HasTemplateChanged 
        {
            get { return ReadInternalFlag2(InternalFlags2.HasTemplateChanged); }
            set { WriteInternalFlag2(InternalFlags2.HasTemplateChanged, value); }
        } 

 
        // Indicates if the StyleProperty has been invalidated during a tree walk 
        internal bool HasStyleInvalidated
        { 
            get { return ReadInternalFlag2(InternalFlags2.HasStyleInvalidated); }
            set { WriteInternalFlag2(InternalFlags2.HasStyleInvalidated, value); }
        }
 
        // Indicates that the StyleProperty full fetch has been
        // performed atleast once on this node 
        internal bool HasStyleEverBeenFetched 
        {
            get { return ReadInternalFlag(InternalFlags.HasStyleEverBeenFetched); } 
            set { WriteInternalFlag(InternalFlags.HasStyleEverBeenFetched, value); }
        }

        // Indicates that the StyleProperty has been set locally on this element 
        internal bool HasLocalStyle
        { 
            get { return ReadInternalFlag(InternalFlags.HasLocalStyle); } 
            set { WriteInternalFlag(InternalFlags.HasLocalStyle, value); }
        } 

        // Indicates that the ThemeStyleProperty full fetch has been
        // performed atleast once on this node
        internal bool HasThemeStyleEverBeenFetched 
        {
            get { return ReadInternalFlag(InternalFlags.HasThemeStyleEverBeenFetched); } 
            set { WriteInternalFlag(InternalFlags.HasThemeStyleEverBeenFetched, value); } 
        }
 
        // Indicates that an ancestor change tree walk is progressing
        // through the given node
        internal bool AncestorChangeInProgress
        { 
            get { return ReadInternalFlag(InternalFlags.AncestorChangeInProgress); }
            set { WriteInternalFlag(InternalFlags.AncestorChangeInProgress, value); } 
        } 

        // Stores the inheritable properties that will need to invalidated on the children of this 
        // node.This is a transient cache that is active only during an AncestorChange operation.
        internal FrugalObjectList<DependencyProperty> InheritableProperties
        {
            get { return _inheritableProperties; } 
            set { _inheritableProperties = value; }
        } 
 
        // Says if there is a loaded event pending
        internal object[] LoadedPending 
        {
            get { return (object[]) GetValue(LoadedPendingProperty); }
        }
 
        // Says if there is an unloaded event pending
        internal object[] UnloadedPending 
        { 
            get { return (object[]) GetValue(UnloadedPendingProperty); }
        } 

        // Indicates if this instance has multiple inheritance contexts
        internal override bool HasMultipleInheritanceContexts
        { 
            get { return ReadInternalFlag2(InternalFlags2.HasMultipleInheritanceContexts); }
        } 
 
        // Indicates if the current element has or had mentees at some point.
        internal bool PotentiallyHasMentees 
        {
            get { return ReadInternalFlag(InternalFlags.PotentiallyHasMentees); }
            set
            { 
                Debug.Assert(value == true,
                    "This flag is set to true when a mentee attaches a listeners to either the " + 
                    "InheritedPropertyChanged event or the ResourcesChanged event. It never goes " + 
                    "back to being false because this would involve counting the remaining listeners " +
                    "for either of the aforementioned events. This seems like an overkill for the perf " + 
                    "optimization we are trying to achieve here.");

                WriteInternalFlag(InternalFlags.PotentiallyHasMentees, value);
            } 
        }
 
 
        /// <summary>
        ///     ResourcesChanged private key 
        /// </summary>
        internal static readonly EventPrivateKey ResourcesChangedKey = new EventPrivateKey();

 
        /// <summary>
        ///     ResourceReferenceExpressions on non-[FE/FCE] add listeners to this 
        ///     event so they can get notified when there is a ResourcesChange 
        /// </summary>
        /// <remarks> 
        ///     make this pay-for-play by storing handlers
        ///     in EventHandlersStore
        /// </remarks>
        internal event EventHandler ResourcesChanged 
        {
            add 
            { 
                PotentiallyHasMentees = true;
                EventHandlersStoreAdd(FrameworkElement.ResourcesChangedKey, value); 
            }
            remove { EventHandlersStoreRemove(FrameworkElement.ResourcesChangedKey, value); }
        }
 

        /// <summary> 
        ///     InheritedPropertyChanged private key 
        /// </summary>
        internal static readonly EventPrivateKey InheritedPropertyChangedKey = new EventPrivateKey(); 


        /// <summary>
        ///     Mentees add listeners to this 
        ///     event so they can get notified when there is a InheritedPropertyChange
        /// </summary> 
        /// <remarks> 
        ///     make this pay-for-play by storing handlers
        ///     in EventHandlersStore 
        /// </remarks>
        internal event InheritedPropertyChangedEventHandler InheritedPropertyChanged
        {
            add 
            {
                PotentiallyHasMentees = true; 
                EventHandlersStoreAdd(FrameworkElement.InheritedPropertyChangedKey, value); 
            }
            remove { EventHandlersStoreRemove(FrameworkElement.InheritedPropertyChangedKey, value); } 
        }

 
        // Optimization, to avoid calling FromSystemType too often
        internal new static DependencyObjectType DType = DependencyObjectType.FromSystemTypeInternal(typeof(FrameworkElement)); 


        // The parent element in logical tree. 
        private new DependencyObject _parent;
        private FrugalObjectList<DependencyProperty> _inheritableProperties;

        private static readonly UncommonField<DependencyObject> InheritanceContextField = new UncommonField<DependencyObject>(); 
        private static readonly UncommonField<DependencyObject> MentorField = new UncommonField<DependencyObject>();
 
        /// <summary>Style Dependency Property</summary> 
        public static readonly DependencyProperty StyleProperty =
                DependencyProperty.Register(
                        "Style", 
                        typeof(Style),
                        _typeofThis, 
                        new FrameworkPropertyMetadata( 
                                (Style) null,   // default value
                                FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                new PropertyChangedCallback(OnStyleChanged)));

        /// <summary>
        ///     Style property 
        /// </summary>
        public Style Style 
        { 
            get { return _styleCache; }
            set { SetValue(StyleProperty, value); } 
        }
 
        // Invoked when the Style property is changed
        private static void OnStyleChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        { 
            FrameworkElement fe = (FrameworkElement) d;
            fe.HasLocalStyle = (e.NewEntry.BaseValueSourceInternal == BaseValueSourceInternal.Local); 
            StyleHelper.UpdateStyleCache(fe, null, (Style) e.OldValue, (Style) e.NewValue, ref fe._styleCache);
        }

        /// <summary> 
        /// OverridesDefaultStyleProperty
        /// </summary> 
        public static readonly DependencyProperty OverridesDefaultStyleProperty 
            = DependencyProperty.Register("OverridesDefaultStyle", typeof(bool), _typeofThis,
                                            new FrameworkPropertyMetadata( 
                                                        BooleanBoxes.FalseBox,   // default value
                                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                                        new PropertyChangedCallback(OnThemeStyleKeyChanged)));
 

        /// <summary> 
        ///     This specifies that the current style ignores all 
        ///     properties from the Theme Style
        /// </summary> 
        public bool OverridesDefaultStyle
        {
            get { return (bool)GetValue(OverridesDefaultStyleProperty); }
            set { SetValue(OverridesDefaultStyleProperty, BooleanBoxes.Box(value)); } 
        }
 
        ///     The UseLayoutRounding property. 
        /// </summary>
        public static readonly DependencyProperty UseLayoutRoundingProperty = 
                DependencyProperty.Register(
                        "UseLayoutRounding",
                        typeof(bool),
                        typeof(FrameworkElement), 
                        new FrameworkPropertyMetadata(
                            false, 
                            FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure, 
                            new PropertyChangedCallback(OnUseLayoutRoundingChanged)
                            )); 

        /// <summary>
        /// Gets or sets a value indicating whether layout rounding should be applied to this element's size and position during
        /// Measure and Arrange so that it aligns to pixel boundaries. This property is inherited by children. 
        /// </summary>
        public bool UseLayoutRounding 
        { 
            get { return (bool)GetValue(UseLayoutRoundingProperty); }
            set { SetValue(UseLayoutRoundingProperty, BooleanBoxes.Box(value)); } 
        }

        private static void OnUseLayoutRoundingChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            FrameworkElement fe = (FrameworkElement)d;
            bool newValue = (bool)e.NewValue; 
            fe.SetFlags(newValue, VisualFlags.UseLayoutRounding); 
        }
 
        /// <summary>
        /// DefaultStyleKeyProperty
        /// </summary>
        protected internal static readonly DependencyProperty DefaultStyleKeyProperty 
            = DependencyProperty.Register("DefaultStyleKey", typeof(object), _typeofThis,
                                            new FrameworkPropertyMetadata( 
                                                        null,   // default value 
                                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                                        new PropertyChangedCallback(OnThemeStyleKeyChanged))); 

        /// <summary>
        ///     This specifies the key to use to find
        ///     a style in a theme for this control 
        /// </summary>
        protected internal object DefaultStyleKey 
        { 
            get { return GetValue(DefaultStyleKeyProperty); }
            set { SetValue(DefaultStyleKeyProperty, value); } 
        }

        // This function is called when ThemeStyleKey or OverridesThemeStyle properties change
        private static void OnThemeStyleKeyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            // Re-evaluate ThemeStyle because it is 
            // a factor of the ThemeStyleKey property 
            ((FrameworkElement)d).UpdateThemeStyleProperty();
        } 


        // Cache the ThemeStyle for the current instance if there is a DefaultStyleKey specified for it
        internal Style ThemeStyle 
        {
            get { return _themeStyleCache; } 
        } 

        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types.
        internal virtual DependencyObjectType DTypeThemeStyleKey
        {
            get { return null; } 
        }
 
        // Invoked when the ThemeStyle property is changed 
        internal static void OnThemeStyleChanged(DependencyObject d, object oldValue, object newValue)
        { 
            FrameworkElement fe = (FrameworkElement) d;
            StyleHelper.UpdateThemeStyleCache(fe, null, (Style) oldValue, (Style) newValue, ref fe._themeStyleCache);
        }
 
        // Internal helper so the FrameworkElement could see the
        // ControlTemplate/DataTemplate set on the 
        // Control/Page/PageFunction/ContentPresenter 
        internal virtual FrameworkTemplate TemplateInternal
        { 
            get { return null; }
        }

        // Internal helper so the FrameworkElement could see the 
        // ControlTemplate/DataTemplate set on the
        // Control/Page/PageFunction/ContentPresenter 
        internal virtual FrameworkTemplate TemplateCache 
        {
            get { return null; } 
            set {}
        }

        // Internal so that StyleHelper could uniformly call the TemplateChanged 
        // virtual on any templated parent
        internal virtual void OnTemplateChangedInternal( 
            FrameworkTemplate oldTemplate, 
            FrameworkTemplate newTemplate)
        { 
            HasTemplateChanged = true;
        }

        /// <summary> 
        ///     Style has changed
        /// </summary> 
        /// <param name="oldStyle">The old Style</param> 
        /// <param name="newStyle">The new Style</param>
        protected internal virtual void OnStyleChanged(Style oldStyle, Style newStyle) 
        {
            HasStyleChanged = true;
        }
 
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
        protected internal virtual void ParentLayoutInvalidated(UIElement child) 
        {
        } 
 
        /// <summary>
        /// ApplyTemplate is called on every Measure 
        /// </summary>
        /// <remarks>
        /// Used by subclassers as a notification to delay fault-in their Visuals
        /// Used by application authors ensure an Elements Visual tree is completely built 
        /// </remarks>
        /// <returns>Whether Visuals were added to the tree</returns> 
        public bool ApplyTemplate() 
        {
            // Notify the ContentPresenter/ItemsPresenter that we are about to generate the 
            // template tree and allow them to choose the right template to be applied.
            OnPreApplyTemplate();

            bool visualsCreated = false; 

            UncommonField<HybridDictionary[]>  dataField = StyleHelper.TemplateDataField; 
            FrameworkTemplate           template = TemplateInternal; 

            // The Template may change in OnApplyTemplate so we'll retry in this case. 
            // We dont want to get stuck in a loop doing this, so limit the number of
            // template changes before we bail out.
            int retryCount = 2;
            for (int i = 0; template != null && i < retryCount; i++) 
            {
                // VisualTree application never clears existing trees. Trees 
                // will be conditionally cleared on Template invalidation 
                if (!HasTemplateGeneratedSubTree)
                { 

                    // Create a VisualTree using the given template
                    visualsCreated = template.ApplyTemplateContent(dataField, this);
                    if (visualsCreated) 
                    {
                        // This VisualTree was created via a Template 
                        HasTemplateGeneratedSubTree =  true; 

                        // We may have had trigger actions that had to wait until the 
                        //  template subtree has been created.  Invoke them now.
                        StyleHelper.InvokeDeferredActions(this, template);

                        // Notify sub-classes when the template tree has been created 
                        OnApplyTemplate();
                    } 
 
                    if (template != TemplateInternal)
                    { 
                        template = TemplateInternal;
                        continue;
                    }
                } 

                break; 
            } 

            OnPostApplyTemplate(); 

            return visualsCreated;
        }
 
        /// <summary>
        /// This virtual is called by FE.ApplyTemplate before it does work to generate the template tree. 
        /// </summary> 
        /// <remarks>
        /// This virtual is overridden for the following three reasons 
        /// 1. By ContentPresenter/ItemsPresenter to choose the template to be applied in this case.
        /// 2. By RowPresenter/ColumnHeaderPresenter/InkCanvas to build custom visual trees
        /// 3. By ScrollViewer/TickBar/ToolBarPanel/Track to hookup bindings to their TemplateParent
        /// </remarks> 
        internal virtual void OnPreApplyTemplate()
        { 
        } 

        /// <summary> 
        ///     This is the virtual that sub-classes must override if they wish to get
        ///     notified that the template tree has been created.
        /// </summary>
        /// <remarks> 
        ///     This virtual is called after the template tree has been generated and it is invoked only
        ///     if the call to ApplyTemplate actually caused the template tree to be generated. 
        /// </remarks> 
        public virtual void OnApplyTemplate()
        { 
        }

        /// <summary>
        /// This virtual is called by FE.ApplyTemplate after it generates the template tree. 
        /// </summary>
        /// <remarks> 
        /// This is overrideen by Control to update the visual states 
        /// </remarks>
        internal virtual void OnPostApplyTemplate() 
        {

        }
 
        /// <summary>
        ///     Begins the given Storyboard as a non-controllable Storyboard and 
        /// the default handoff policy. 
        /// </summary>
        public void BeginStoryboard(Storyboard storyboard) 
        {
            BeginStoryboard(storyboard, HandoffBehavior.SnapshotAndReplace, false);
        }
 
        /// <summary>
        ///     Begins the given Storyboard as a non-controllable Storyboard but 
        /// with the given handoff policy. 
        /// </summary>
        public void BeginStoryboard(Storyboard storyboard, HandoffBehavior handoffBehavior) 
        {
            BeginStoryboard(storyboard, handoffBehavior, false);
        }
 
        /// <summary>
        ///     Begins the given Storyboard as a Storyboard with the given handoff 
        /// policy, and with the specified state for controllability. 
        /// </summary>
        public void BeginStoryboard(Storyboard storyboard, HandoffBehavior handoffBehavior, bool isControllable) 
        {
            if( storyboard == null )
            {
                throw new ArgumentNullException("storyboard"); 
            }
 
            // Storyboard.Begin is a public API and needs to be validating handoffBehavior anyway. 

            storyboard.Begin( this, handoffBehavior, isControllable ); 
        }

        // Given a FrameworkElement and a name string, this routine will try to find
        //  a node with Name property set to the given name.  It will search all 
        //  the child logical tree nodes of the given starting element.
        // If the name string is null or an empty string, the given starting element 
        //  is returned. 
        // If the name is found on a FrameworkContentElement, an exception is thrown
        // If the name is not found attached to anything, an exception is thrown 
        internal static FrameworkElement FindNamedFrameworkElement( FrameworkElement startElement, string targetName )
        {
            FrameworkElement targetFE = null;
 
            if( targetName == null || targetName.Length == 0 )
            { 
                targetFE = startElement; 
            }
            else 
            {
                DependencyObject targetObject = null;

                targetObject = LogicalTreeHelper.FindLogicalNode( startElement, targetName ); 

                if( targetObject == null ) 
                { 
                    throw new ArgumentException( SR.Get(SRID.TargetNameNotFound, targetName));
                } 

                FrameworkObject fo = new FrameworkObject(targetObject);
                if( fo.IsFE )
                { 
                    targetFE = fo.FE;
                } 
                else 
                {
                    throw new InvalidOperationException(SR.Get(SRID.NamedObjectMustBeFrameworkElement, targetName)); 
                }
            }

            return targetFE; 
        }
 
        /// <summary> 
        ///     Triggers associated with this object.  Both the triggering condition
        /// and the trigger effect may be on this object or on its tree child 
        /// objects.
        /// </summary>
        public TriggerCollection Triggers 
        {
            get 
            { 
                TriggerCollection triggerCollection = EventTrigger.TriggerCollectionField.GetValue(this);
                if (triggerCollection == null) 
                {
                    // Give the TriggerCollectiona back-link so that it can update
                    // 'this' on Add/Remove.
                    triggerCollection = new TriggerCollection(this); 

                    EventTrigger.TriggerCollectionField.SetValue(this, triggerCollection); 
                } 

                return triggerCollection; 
            }
        }

        // This should be called when the FrameworkElement tree is built up,
        //  at this point we can process all the setter-related information
        //  because now we'll be able to resolve "Target" references in setters. 
        private void PrivateInitialized()
        { 
            // Process Trigger information when this object is loaded. 
            EventTrigger.ProcessTriggerCollection(this);
        } 

        /// <summary>
        ///     Reference to the style parent of this node, if any.
        /// </summary> 
        /// <returns>
        ///     Reference to FrameworkElement or FrameworkContentElement 
        ///     whose Template.VisualTree caused this element to be created, 
        ///     null if this does not apply.
        /// </returns> 
        public DependencyObject TemplatedParent
        {
            get
            { 
                return _templatedParent;
            } 
        } 

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
        internal bool IsTemplateRoot
        {
            get
            { 
                return (TemplateChildIndex==1);
            } 
        } 

 
        /// <summary>
        /// Gets or sets the template child of the FrameworkElement.
        /// </summary>
        virtual internal UIElement TemplateChild 
        {
            get 
            { 
                return _templateChild;
            } 
            set
            {
                if (value != _templateChild)
                { 
                    RemoveVisualChild(_templateChild);
                    _templateChild = value; 
                    AddVisualChild(value); 
                }
            } 
        }

        /// <summary>
        /// Gets the element that should be used as the StateGroupRoot for VisualStateMangager.GoToState calls 
        /// </summary>
        internal virtual FrameworkElement StateGroupsRoot 
        { 
            get
            { 
                return _templateChild as FrameworkElement;
            }
        }
 
        /// <summary>
        /// Gets the number of Visual children of this FrameworkElement. 
        /// </summary> 
        /// <remarks>
        /// Derived classes override this property getter to provide the children count 
        /// of their custom children collection.
        /// </remarks>
        protected override int VisualChildrenCount
        { 
            get
            { 
                return (_templateChild == null) ? 0 : 1; 
            }
        } 


        /// <summary>
        /// Gets the Visual child at the specified index. 
        /// </summary>
        /// <remarks> 
        /// Derived classes that provide a custom children collection must override this method 
        /// and return the child at the specified index.
        /// </remarks> 
        protected override Visual GetVisualChild(int index)
        {
            if (_templateChild == null)
            { 
                throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange));
            } 
            if (index != 0) 
            {
                throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)); 
            }
            return _templateChild;
        }
 
        /// <summary>
        ///     Check if resource is not empty. 
        ///     Call HasResources before accessing resources every time you need 
        ///     to query for a resource.
        /// </summary> 
        internal bool HasResources
        {
            get
            { 
                ResourceDictionary resources = ResourcesField.GetValue(this);
                return (resources != null && 
                        ((resources.Count > 0) || (resources.MergedDictionaries.Count > 0))); 
            }
        } 

        /// <summary>
        ///     Current locally defined Resources
        /// </summary> 
        public ResourceDictionary Resources 
        { 
            get
            { 
                ResourceDictionary resources = ResourcesField.GetValue(this);
                if (resources == null)
                {
                    resources = new ResourceDictionary(); 
                    resources.AddOwner(this);
                    ResourcesField.SetValue(this, resources); 
 
                    if( TraceResourceDictionary.IsEnabled )
                    { 
                        TraceResourceDictionary.TraceActivityItem(
                                TraceResourceDictionary.NewResourceDictionary,
                                this,
                                0, 
                                resources );
                    } 
 
                }
 
                return resources;

            }
            set 
            {
                ResourceDictionary oldValue = ResourcesField.GetValue(this); 
                ResourcesField.SetValue(this, value); 

                if( TraceResourceDictionary.IsEnabled ) 
                {
                    TraceResourceDictionary.Trace(
                            TraceEventType.Start,
                            TraceResourceDictionary.NewResourceDictionary, 
                            this,
                            oldValue, 
                            value ); 
                }
 

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


                if( TraceResourceDictionary.IsEnabled )
                { 
                    TraceResourceDictionary.Trace(
                            TraceEventType.Stop, 
                            TraceResourceDictionary.NewResourceDictionary, 
                            this,
                            oldValue, 
                            value );
                }

 
            }
        } 
 
        ResourceDictionary IHaveResources.Resources
        { 
            get { return Resources; }
            set { Resources = value; }
        }
 
        bool IQueryAmbient.IsAmbientPropertyAvailable(string propertyName)
        { 
            // We want to make sure that StaticResource resolution checks the .Resources 
            // Ie.  The Ambient search should look at Resources if it is set.
            // Even if it wasn't set from XAML (eg. the Ctor (or derived Ctor) added stuff) 
            return (propertyName != "Resources" || HasResources);
        }

        /// <summary>
        ///     Retrieves the element in the VisualTree of thie element that corresponds to 
        ///     the element with the given childName in this element's style definition
        /// </summary> 
        /// <param name="childName">the Name to find the matching element for</param> 
        /// <returns>The Named element.  Null if no element has this Name.</returns>
        protected internal DependencyObject GetTemplateChild(string childName) 
        {
            FrameworkTemplate template = TemplateInternal;
            /* Calling this before getting a style/template is not a bug.
            Debug.Assert(template != null, 
                "The VisualTree should have been created from a Template");
            */ 
 
            if (template == null)
            { 
                return null;
            }

            return StyleHelper.FindNameInTemplateContent(this, childName, template) as DependencyObject; 
        }
 
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
        public object FindResource(object resourceKey)
        { 
            // Verify Context Access
            // VerifyAccess();

            if (resourceKey == null) 
            {
                throw new ArgumentNullException("resourceKey"); 
            } 

            object resource = FrameworkElement.FindResourceInternal(this, null /* fce */, resourceKey); 

            if (resource == DependencyProperty.UnsetValue)
            {
                // Resource not found in parent chain, app or system 
                Helper.ResourceFailureThrow(resourceKey);
            } 
 
            return resource;
        } 


        /// <summary>
        ///     Searches for a resource with the passed resourceKey and returns it 
        /// </summary>
        /// <remarks> 
        ///     If the sources is not found on the called Element, the parent 
        ///     chain is searched, using the logical tree.
        /// </remarks> 
        /// <param name="resourceKey">Name of the resource</param>
        /// <returns>The found resource.  Null if not found.</returns>
        public object TryFindResource(object resourceKey)
        { 
            // Verify Context Access
            // VerifyAccess(); 
 
            if (resourceKey == null)
            { 
                throw new ArgumentNullException("resourceKey");
            }

            object resource = FrameworkElement.FindResourceInternal(this, null /* fce */, resourceKey); 

            if (resource == DependencyProperty.UnsetValue) 
            { 
                // Resource not found in parent chain, app or system
                // This is where we translate DependencyProperty.UnsetValue to a null 
                resource = null;
            }

            return resource; 
        }
 
 
        // FindImplicitSytle(fe) : Default: unlinkedParent, deferReference
        internal static object FindImplicitStyleResource(FrameworkElement fe, object resourceKey, out object source) 
        {
            // Do a FindResource call only if someone in the ancestry has
            // implicit styles. This is a performance optimization.
 
            if (fe.ShouldLookupImplicitStyles)
            { 
                object unlinkedParent = null; 
                bool allowDeferredResourceReference = false;
                bool mustReturnDeferredResourceReference = false; 

                // Implicit style lookup must stop at the app.
                bool isImplicitStyleLookup = true;
 
                // For non-controls the implicit StyleResource lookup must stop at
                // the templated parent. Look at task 25606 for further details. 
                DependencyObject boundaryElement = null; 
                if (!(fe is Control))
                { 
                    boundaryElement = fe.TemplatedParent;
                }

                object implicitStyle = FindResourceInternal(fe, 
                                                            null,                            // fce
                                                            FrameworkElement.StyleProperty,  // dp 
                                                            resourceKey, 
                                                            unlinkedParent,
                                                            allowDeferredResourceReference, 
                                                            mustReturnDeferredResourceReference,
                                                            boundaryElement,
                                                            isImplicitStyleLookup,
                                                            out source); 

                // The reason this assert is commented is because there are specific scenarios when we can reach 
                // here even before the ShouldLookupImplicitStyles flag is updated. But this is still acceptable 
                // because the flag does get updated and the style property gets re-fetched soon after.
 
                // Look at AccessText.GetVisualChild implementation for example and
                // consider the following sequence of operations.

                // 1. contentPresenter.AddVisualChild(accessText) 
                // 1.1. accessText._parent = contentPresenter
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

            source = null;
            return DependencyProperty.UnsetValue;
        } 

        // FindImplicitSytle(fce) : Default: unlinkedParent, deferReference 
        internal static object FindImplicitStyleResource(FrameworkContentElement fce, object resourceKey, out object source) 
        {
            // Do a FindResource call only if someone in the ancestry has 
            // implicit styles. This is a performance optimization.

            if (fce.ShouldLookupImplicitStyles)
            { 
                object unlinkedParent = null;
                bool allowDeferredResourceReference = false; 
                bool mustReturnDeferredResourceReference = false; 

                // Implicit style lookup must stop at the app. 
                bool isImplicitStyleLookup = true;

                // For non-controls the implicit StyleResource lookup must stop at
                // the templated parent. Look at task 25606 for further details. 
                DependencyObject boundaryElement = fce.TemplatedParent;
 
                object implicitStyle = FindResourceInternal(null, fce, FrameworkContentElement.StyleProperty, resourceKey, unlinkedParent, allowDeferredResourceReference, mustReturnDeferredResourceReference, boundaryElement, isImplicitStyleLookup, out source); 

                // Look at comments on the FE version of this method. 

                // Debug.Assert(!(implicitStyle != DependencyProperty.UnsetValue && fce.ShouldLookupImplicitStyles == false),
                //     "ShouldLookupImplicitStyles is false even while there exists an implicit style in the lookup path. To be precise at source " + source);
 
                return implicitStyle;
            } 
 
            source = null;
            return DependencyProperty.UnsetValue; 
        }

        // Internal method for Parser to find a resource when
        // the instance is not yet hooked to the logical tree 
        // This method returns DependencyProperty.UnsetValue when
        // resource is not found. Otherwise it returns the value 
        // found. NOTE: Value resource found could be null 
        // FindResource(fe/fce)  Default: dp, unlinkedParent, deferReference, boundaryElement, source, isImplicitStyleLookup
        internal static object FindResourceInternal(FrameworkElement fe, FrameworkContentElement fce, object resourceKey) 
        {
            object source;

            return FindResourceInternal(fe, 
                                        fce,
                                        null,   // dp, 
                                        resourceKey, 
                                        null,   // unlinkedParent,
                                        false,  // allowDeferredResourceReference, 
                                        false,  // mustReturnDeferredResourceReference,
                                        null,   // boundaryElement,
                                        false,  // isImplicitStyleLookup,
                                        out source); 
        }
 
        // This method is used during serialization of ResourceReferenceExpressions 
        // to find out if we are indeed serializing the source application that holds the
        // resource we are refering to in the expression. 
        // The method will return the resource if found and also its corresponding
        // source application in the same scenario. Source is null when resource is
        // not found or when the resource is fetched from SystemResources
        internal static object FindResourceFromAppOrSystem( 
            object resourceKey,
            out object source, 
            bool disableThrowOnResourceNotFound, 
            bool allowDeferredResourceReference,
            bool mustReturnDeferredResourceReference) 
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
                                                         out source);
        }
 
        // FindResourceInternal(fe/fce)  Defaults: none
        internal static object FindResourceInternal( 
            FrameworkElement        fe, 
            FrameworkContentElement fce,
            DependencyProperty      dp, 
            object                  resourceKey,
            object                  unlinkedParent,
            bool                    allowDeferredResourceReference,
            bool                    mustReturnDeferredResourceReference, 
            DependencyObject        boundaryElement,
            bool                    isImplicitStyleLookup, 
            out object              source) 
        {
            object value; 
            InheritanceBehavior inheritanceBehavior = InheritanceBehavior.Default;

            if( TraceResourceDictionary.IsEnabled )
            { 
                FrameworkObject element = new FrameworkObject(fe, fce);
 
                TraceResourceDictionary.Trace( 
                    TraceEventType.Start,
                    TraceResourceDictionary.FindResource, 
                     element.DO,
                     resourceKey );
            }
 
            try
            { 
 
                // First try to find the resource in the tree
                if (fe != null || fce != null || unlinkedParent != null) 
                {
                    value = FindResourceInTree(fe, fce, dp, resourceKey, unlinkedParent, allowDeferredResourceReference, mustReturnDeferredResourceReference, boundaryElement,
                                                out inheritanceBehavior, out source);
                    if (value != DependencyProperty.UnsetValue) 
                    {
                        return value; 
                    } 

                } 

                // Then we try to find the resource in the App's Resources
                Application app = Application.Current;
                if (app != null && 
                    (inheritanceBehavior == InheritanceBehavior.Default ||
                     inheritanceBehavior == InheritanceBehavior.SkipToAppNow || 
                     inheritanceBehavior == InheritanceBehavior.SkipToAppNext)) 
                {
                    value = app.FindResourceInternal(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference); 
                    if (value != null)
                    {
                        source = app;
 
                        if( TraceResourceDictionary.IsEnabled )
                        { 
                            TraceResourceDictionary.TraceActivityItem( 
                                TraceResourceDictionary.FoundResourceInApplication,
                                 resourceKey, 
                                value );
                        }

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
                        source = SystemResourceHost.Instance;
 
                        if( TraceResourceDictionary.IsEnabled )
                        {
                            TraceResourceDictionary.TraceActivityItem(
                                TraceResourceDictionary.FoundResourceInTheme, 
                                source,
                                resourceKey, 
                                value ); 
                        }
 

                        return value;
                    }
                } 
            }
            finally 
            { 
                if( TraceResourceDictionary.IsEnabled )
                { 
                    FrameworkObject element = new FrameworkObject(fe, fce);

                    TraceResourceDictionary.Trace(
                        TraceEventType.Stop, 
                        TraceResourceDictionary.FindResource,
                         element.DO, 
                         resourceKey ); 
                }
            } 

            // We haven't found the resource.  Trace a message to the debugger.
            //
            // Only trace if this isn't an implicit 
            // style lookup and the element has been loaded
            if (TraceResourceDictionary.IsEnabledOverride && !isImplicitStyleLookup) 
            { 
                if ((fe != null && fe.IsLoaded) || (fce != null && fce.IsLoaded))
                { 
                    TraceResourceDictionary.Trace( TraceEventType.Warning,
                            TraceResourceDictionary.ResourceNotFound,
                            resourceKey );
                } 
                else if( TraceResourceDictionary.IsEnabled )
                { 
                    TraceResourceDictionary.TraceActivityItem( 
                            TraceResourceDictionary.ResourceNotFound,
                            resourceKey ); 
                }
            }

            source = null; 
            return DependencyProperty.UnsetValue;
        } 
 
        // FindResourceInTree(fe/fce)  Defaults: none
        internal static object FindResourceInTree( 
            FrameworkElement        feStart,
            FrameworkContentElement fceStart,
            DependencyProperty      dp,
            object                  resourceKey, 
            object                  unlinkedParent,
            bool                    allowDeferredResourceReference, 
            bool                    mustReturnDeferredResourceReference, 
            DependencyObject        boundaryElement,
            out InheritanceBehavior inheritanceBehavior, 
            out object              source)
        {
            FrameworkObject startNode = new FrameworkObject(feStart, fceStart);
            FrameworkObject fo = startNode; 
            object value;
            Style style; 
            FrameworkTemplate frameworkTemplate; 
            Style themeStyle;
            int loopCount = 0; 
            bool hasParent = true;
            inheritanceBehavior = InheritanceBehavior.Default;

            while (hasParent) 
            {
                Debug.Assert(startNode.IsValid || unlinkedParent != null, 
                              "Don't call FindResource with a null fe/fce and unlinkedParent"); 

                if (loopCount > ContextLayoutManager.s_LayoutRecursionLimit) 
                {
                    // We suspect a loop here because the loop count
                    // has exceeded the MAX_TREE_DEPTH expected
                    throw new InvalidOperationException(SR.Get(SRID.LogicalTreeLoop)); 
                }
                else 
                { 
                    loopCount++;
                } 

                // -------------------------------------------
                //  Lookup ResourceDictionary on the current instance
                // ------------------------------------------- 

                style = null; 
                frameworkTemplate = null; 
                themeStyle = null;
 
                if (fo.IsFE)
                {
                    FrameworkElement fe = fo.FE;
 
                    value = fe.FindResourceOnSelf(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference);
                    if (value != DependencyProperty.UnsetValue) 
                    { 
                        source = fe;
 
                        if( TraceResourceDictionary.IsEnabled )
                        {
                            TraceResourceDictionary.TraceActivityItem(
                                TraceResourceDictionary.FoundResourceOnElement, 
                                source,
                                resourceKey, 
                                value ); 
                        }
 
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
                    FrameworkContentElement fce = fo.FCE;
 
                    value = fce.FindResourceOnSelf(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference);
                    if (value != DependencyProperty.UnsetValue) 
                    { 
                        source = fce;
 
                        if( TraceResourceDictionary.IsEnabled )
                        {
                            TraceResourceDictionary.TraceActivityItem(
                                TraceResourceDictionary.FoundResourceOnElement, 
                                source,
                                resourceKey, 
                                value ); 
                        }
 
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
                        source = style;

                        if( TraceResourceDictionary.IsEnabled ) 
                        {
                            TraceResourceDictionary.TraceActivityItem( 
                                TraceResourceDictionary.FoundResourceInStyle, 
                                style.Resources,
                                resourceKey, 
                                style,
                                fo.DO,
                                value );
                        } 

                        return value; 
                    } 
                }
                if (frameworkTemplate != null) 
                {
                    value = frameworkTemplate.FindResource(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference);
                    if (value != DependencyProperty.UnsetValue)
                    { 
                        source = frameworkTemplate;
 
                        if( TraceResourceDictionary.IsEnabled ) 
                        {
                            TraceResourceDictionary.TraceActivityItem( 
                                TraceResourceDictionary.FoundResourceInTemplate,
                                frameworkTemplate.Resources,
                                resourceKey,
                                frameworkTemplate, 
                                fo.DO,
                                value ); 
                        } 

                        return value; 
                    }
                }

                if (themeStyle != null) 
                {
                    value = themeStyle.FindResource(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference); 
                    if (value != DependencyProperty.UnsetValue) 
                    {
                        source = themeStyle; 

                        if( TraceResourceDictionary.IsEnabled )
                        {
                            TraceResourceDictionary.TraceActivityItem( 
                                TraceResourceDictionary.FoundResourceInThemeStyle,
                                themeStyle.Resources, 
                                resourceKey, 
                                themeStyle,
                                fo.DO, 
                                value );
                        }

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
                    inheritanceBehavior = fo.InheritanceBehavior;
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
                    DependencyObject unlinkedParentAsDO = unlinkedParent as DependencyObject; 
                    if (unlinkedParentAsDO != null)
                    { 
                        fo.Reset(unlinkedParentAsDO);
                        if (fo.IsValid)
                        {
                            hasParent = true; 
                        }
                        else 
                        { 
                            DependencyObject doParent = GetFrameworkParent(unlinkedParent);
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
                    Debug.Assert(fo.IsValid,
                                  "The current node being processed should be an FE/FCE");

                    fo = fo.FrameworkParent; 

                    hasParent = fo.IsValid; 
                } 

                // If the current element for resource lookup is marked such 
                // then skip to the Application and/or System resources
                if (fo.IsValid && TreeWalkHelper.SkipNow(fo.InheritanceBehavior))
                {
                    inheritanceBehavior = fo.InheritanceBehavior; 
                    break;
                } 
            } 

            // No matching resource was found in the tree 
            source = null;
            return DependencyProperty.UnsetValue;
        }
 

        // Searches through resource dictionaries to find a [Data|Table|ItemContainer]Template 
        //  that matches the type of the 'item' parameter.  Failing an exact 
        //  match of the type, return something that matches one of its parent
        //  types. 
        internal static object FindTemplateResourceInternal(DependencyObject target, object item, Type templateType)
        {
            // Data styling doesn't apply to UIElement (bug 1007133).
            if (item == null || (item is UIElement)) 
            {
                return null; 
            } 

            Type type; 
            object dataType = ContentPresenter.DataTypeForItem(item, target, out type);

            ArrayList keys = new ArrayList();
 
            // construct the list of acceptable keys, in priority order
            int exactMatch = -1;    // number of entries that count as an exact match 
 
            // add compound keys for the dataType and all its base types
            while (dataType != null) 
            {
                object key = null;
                if (templateType == typeof(ItemContainerTemplate))
                    key = new ItemContainerTemplateKey(dataType); 
                else if (templateType == typeof(DataTemplate))
                    key = new DataTemplateKey(dataType); 
 
                if (key != null)
                    keys.Add(key); 

                // all keys added for the given item type itself count as an exact match
                if (exactMatch == -1)
                    exactMatch = keys.Count; 

                if (type != null) 
                { 
                    type = type.BaseType;
                    if (type == typeof(Object))     // don't search for Object - perf 
                        type = null;
                }

                dataType = type; 
            }
 
            int bestMatch = keys.Count; // index of best match so far 

            // Search the parent chain 
            object resource = FindTemplateResourceInTree(target, keys, exactMatch, ref bestMatch);

            if (bestMatch >= exactMatch)
            { 
                // Exact match not found in the parent chain.  Try App and System Resources.
                object appResource = Helper.FindTemplateResourceFromAppOrSystem(target, keys, exactMatch, ref bestMatch); 
 
                if (appResource != null)
                    resource = appResource; 
            }

            return resource;
        } 

        // Search the parent chain for a [Data|Table]Template in a ResourceDictionary. 
        private static object FindTemplateResourceInTree(DependencyObject target, ArrayList keys, int exactMatch, ref int bestMatch) 
        {
            Debug.Assert(target != null, "Don't call FindTemplateResource with a null target object"); 

            ResourceDictionary table;
            object resource = null;
 
            FrameworkObject fo = new FrameworkObject(target);
            Debug.Assert(fo.IsValid, "Don't call FindTemplateResource with a target object that is neither a FrameworkElement nor a FrameworkContentElement"); 
 
            while (fo.IsValid)
            { 
                object candidate;

                // -------------------------------------------
                //  Lookup ResourceDictionary on the current instance 
                // -------------------------------------------
 
                // Fetch the ResourceDictionary 
                // for the given target element
                table = GetInstanceResourceDictionary(fo.FE, fo.FCE); 
                if( table != null )
                {
                    candidate = FindBestMatchInResourceDictionary( table, keys, exactMatch, ref bestMatch );
                    if (candidate != null) 
                    {
                        resource = candidate; 
                        if (bestMatch < exactMatch) 
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
                    candidate = FindBestMatchInResourceDictionary( table, keys, exactMatch, ref bestMatch ); 
                    if (candidate != null)
                    { 
                        resource = candidate; 
                        if (bestMatch < exactMatch)
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
                    candidate = FindBestMatchInResourceDictionary( table, keys, exactMatch, ref bestMatch );
                    if (candidate != null) 
                    { 
                        resource = candidate;
                        if (bestMatch < exactMatch) 
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
                    candidate = FindBestMatchInResourceDictionary( table, keys, exactMatch, ref bestMatch ); 
                    if (candidate != null) 
                    {
                        resource = candidate; 
                        if (bestMatch < exactMatch)
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
        private static object FindBestMatchInResourceDictionary( 
            ResourceDictionary table, ArrayList keys, int exactMatch, ref int bestMatch)
        {
            object resource = null;
            int k; 

            // Search target element's ResourceDictionary for the resource 
            if (table != null) 
            {
                for (k = 0;  k < bestMatch;  ++k) 
                {
                    object candidate = table[keys[k]];
                    if (candidate != null)
                    { 
                        resource = candidate;
                        bestMatch = k; 
 
                        // if we found an exact match, no need to continue
                        if (bestMatch < exactMatch) 
                            return resource;
                    }
                }
            } 

            return resource; 
        } 

        // Return a reference to the ResourceDictionary set on the instance of 
        //  the given Framework(Content)Element, if such a ResourceDictionary exists.
        private static ResourceDictionary GetInstanceResourceDictionary(FrameworkElement fe, FrameworkContentElement fce)
        {
            ResourceDictionary table = null; 

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
        private static ResourceDictionary GetStyleResourceDictionary(FrameworkElement fe, FrameworkContentElement fce)
        { 
            ResourceDictionary table = null;

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
        private static ResourceDictionary GetThemeStyleResourceDictionary(FrameworkElement fe, FrameworkContentElement fce)
        { 
            ResourceDictionary table = null;
 
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
        private static ResourceDictionary GetTemplateResourceDictionary(FrameworkElement fe, FrameworkContentElement fce) 
        {
            ResourceDictionary table = null; 

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
 
        // return true if there is a local or style-supplied value for the dp
        internal bool HasNonDefaultValue(DependencyProperty dp) 
        { 
            return !Helper.HasDefaultValue(this, dp);
        } 

        // Finds the nearest NameScope by walking up the logical tree
        internal static INameScope FindScope(DependencyObject d)
        { 
            DependencyObject scopeOwner;
            return FindScope(d, out scopeOwner); 
        } 

        // Finds the nearest NameScope by walking up the logical tree 
        internal static INameScope FindScope(DependencyObject d, out DependencyObject scopeOwner)
        {
            while (d != null)
            { 
                INameScope nameScope = NameScope.NameScopeFromObject(d);
                if (nameScope != null) 
                { 
                    scopeOwner = d;
                    return nameScope; 
                }

                DependencyObject parent = LogicalTreeHelper.GetParent(d);
 
                d = (parent != null) ? parent : Helper.FindMentor(d.InheritanceContext);
            } 
 
            scopeOwner = null;
            return null; 
        }

        /// <summary>
        ///     Searches for a resource called name and sets up a resource reference 
        ///     to it for the passed property.
        /// </summary> 
        /// <param name="dp">Property to which the resource is bound</param> 
        /// <param name="name">Name of the resource</param>
        public void SetResourceReference( 
            DependencyProperty dp,
            object             name)
        {
            // Set the value of the property to a ResourceReferenceExpression 
            SetValue(dp, new ResourceReferenceExpression(name));
 
            // Set flag indicating that the current FrameworkElement instance 
            // has a property value set to a resource reference and hence must
            // be invalidated on parent changed or resource property change events 
            HasResourceReference = true;
        }

 
        /// <summary>
        ///     Allows subclasses to participate in property base value computation 
        /// </summary> 
        /// <param name="dp">Dependency property</param>
        /// <param name="metadata">Type metadata of the property for the type</param> 
        /// <param name="newEntry">entry computed by base</param>
        internal sealed override void EvaluateBaseValueCore(
            DependencyProperty  dp,
            PropertyMetadata    metadata, 
            ref EffectiveValueEntry newEntry)
        { 
            if (dp == StyleProperty) 
            {
                // If this is the first time that the StyleProperty 
                // is being fetched then mark it such
                HasStyleEverBeenFetched = true;

                // Clear the flags associated with the StyleProperty 
                HasImplicitStyleFromResources = false;
                IsStyleSetFromGenerator = false; 
            } 

            GetRawValue(dp, metadata, ref newEntry); 
            Storyboard.GetComplexPathValue(this, dp, ref newEntry, metadata);
        }

        internal void GetRawValue(DependencyProperty dp, PropertyMetadata metadata, ref EffectiveValueEntry entry) 
        {
            // Queries to FrameworkElement will automatically fault in the Style 
 
            // If a value was resolved by base, return that.
            if ((entry.BaseValueSourceInternal == BaseValueSourceInternal.Local) && 
                (entry.GetFlattenedEntry(RequestFlags.FullyResolved).Value != DependencyProperty.UnsetValue))
            {
                return;
            } 

            // 
            // Try for container Style driven value 
            //
            if (TemplateChildIndex != -1) 
            {
                // This instance is in the template child chain of a Template.VisualTree,
                //  so we need to see if the Style has an applicable value.
                // 
                // If the parent element's style is changing, this instance is
                // in a visual tree that is being removed, and the value request 
                // is simply a result of tearing down some information in that 
                // tree (e.g. a BindingExpression).  If so, just pretend there is no style (bug 991395).
 
                if (GetValueFromTemplatedParent(dp, ref entry))
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

            if (dp != StyleProperty) 
            {
                if (StyleHelper.GetValueFromStyleOrTemplate(new FrameworkObject(this, null), dp, ref entry)) 
                { 
                    return;
                } 
            }
            else
            {
                object source; 
                object implicitValue = FrameworkElement.FindImplicitStyleResource(this, this.GetType(), out source);
                if (implicitValue != DependencyProperty.UnsetValue) 
                { 
                    // Commented this because the implicit fetch could also return a DeferredDictionaryReference
                    // if (!(implicitValue is Style)) 
                    // {
                    //     throw new InvalidOperationException(SR.Get(SRID.InvalidImplicitStyleResource, this.GetType().Name, implicitValue));
                    // }
 
                    // This style has been fetched from resources
                    HasImplicitStyleFromResources = true; 
 
                    entry.BaseValueSourceInternal = BaseValueSourceInternal.ImplicitReference;
                    entry.Value = implicitValue; 
                    return;
                }
            }
 
            //
            // Try for Inherited value 
            // 
            FrameworkPropertyMetadata fmetadata = metadata as FrameworkPropertyMetadata;
 
            // Metadata must exist specifically stating to group or inherit
            // Note that for inheritable properties that override the default value a parent can impart
            // its default value to the child even though the property may not have been set locally or
            // via a style or template (ie. IsUsed flag would be false). 
            if (fmetadata != null)
            { 
                if (fmetadata.Inherits) 
                {
                    object value = GetInheritableValue(dp, fmetadata); 

                    if( value != DependencyProperty.UnsetValue)
                    {
                        entry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited; 
                        entry.Value = value;
                        return; 
                    } 
                }
            } 

            // No value found.
            Debug.Assert(entry.Value == DependencyProperty.UnsetValue,"FrameworkElement.GetRawValue should never fall through with a value != DependencyProperty.UnsetValue.  We're supposed to return as soon as we found something.");
        } 

 
 
        // This FrameworkElement has been established to be a Template.VisualTree
        //  node of a parent object.  Ask the TemplatedParent's Style object if 
        //  they have a value for us.

        private bool GetValueFromTemplatedParent(DependencyProperty dp, ref EffectiveValueEntry entry)
        { 
            FrameworkTemplate frameworkTemplate = null;
            Debug.Assert( IsTemplatedParentAnFE ); 
 
            FrameworkElement feTemplatedParent = (FrameworkElement)_templatedParent;
            frameworkTemplate = feTemplatedParent.TemplateInternal; 

            if (frameworkTemplate != null)
            {
                return StyleHelper.GetValueFromTemplatedParent( 
                        _templatedParent,
                        TemplateChildIndex, 
                        new FrameworkObject(this, null), 
                        dp,
                    ref frameworkTemplate.ChildRecordFromChildIndex, 
                        frameworkTemplate.VisualTree,
                    ref entry);
            }
            return false; 
        }
 
        // Climb the framework tree hierarchy and see if we can pick up an 
        //  inheritable property value somewhere in that parent chain.
        //[CodeAnalysis("AptcaMethodsShouldOnlyCallAptcaMethods")] //Tracking Bug: 29647 
        private object GetInheritableValue(DependencyProperty dp, FrameworkPropertyMetadata fmetadata)
        {
            //
            // Inheritance 
            //
 
            if (!TreeWalkHelper.SkipNext(InheritanceBehavior) || fmetadata.OverridesInheritanceBehavior == true) 
            {
                // Used to terminate tree walk if a tree boundary is hit 
                InheritanceBehavior inheritanceBehavior = InheritanceBehavior.Default;

                FrameworkContentElement parentFCE;
                FrameworkElement parentFE; 
                bool hasParent = GetFrameworkParent(this, out parentFE, out parentFCE);
                while (hasParent) 
                { 
                    bool inheritanceNode;
                    if (parentFE != null) 
                    {
                        inheritanceNode = TreeWalkHelper.IsInheritanceNode(parentFE, dp, out inheritanceBehavior);
                    }
                    else // (parentFCE != null) 
                    {
                        inheritanceNode = TreeWalkHelper.IsInheritanceNode(parentFCE, dp, out inheritanceBehavior); 
                    } 

                    // If the current node has SkipNow semantics then we do 
                    // not need to lookup the inheritable value on it.
                    if (TreeWalkHelper.SkipNow(inheritanceBehavior))
                    {
                        break; 
                    }
 
                    // Check if node is an inheritance node, if so, query it 
                    if (inheritanceNode)
                    { 
                        DependencyObject parentDO = parentFE;
                        if (parentDO == null)
                        { 
                            parentDO = parentFCE;
                        } 
 
                        EntryIndex entryIndex = parentDO.LookupEntry(dp.GlobalIndex);
 
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
                        hasParent = GetFrameworkParent(parentFE, out parentFE, out parentFCE); 
                    }
                    else
                    {
                        hasParent = GetFrameworkParent(parentFCE, out parentFE, out parentFCE); 
                    }
                } 
            } 

            // Didn't find this value anywhere in the framework tree parent chain, 
            //  or search was aborted when we hit a tree boundary node.
            return DependencyProperty.UnsetValue;
        }
 
        // Like GetValueCore, except it returns the expression (if any) instead of its value
        internal Expression GetExpressionCore(DependencyProperty dp, PropertyMetadata metadata) 
        { 
            this.IsRequestingExpression = true;
            EffectiveValueEntry entry = new EffectiveValueEntry(dp); 
            entry.Value = DependencyProperty.UnsetValue;
            this.EvaluateBaseValueCore(dp, metadata, ref entry);
            this.IsRequestingExpression = false;
 
            return entry.Value as Expression;
        } 
 
        /// <summary>
        ///     Notification that a specified property has been changed 
        /// </summary>
        /// <param name="e">EventArgs that contains the property, metadata, old value, and new value for this change</param>
        protected override void OnPropertyChanged(DependencyPropertyChangedEventArgs e)
        { 
            DependencyProperty dp = e.Property;
 
            base.OnPropertyChanged(e); 

            if (e.IsAValueChange || e.IsASubPropertyChange) 
            {
                //
                // Try to fire the Loaded event on the root of the tree
                // because for this case the OnParentChanged will not 
                // have a chance to fire the Loaded event.
                // 
                if (dp != null && dp.OwnerType == typeof(PresentationSource) && dp.Name == "RootSource") 
                {
                    TryFireInitialized(); 
                }

                if (dp == FrameworkElement.NameProperty &&
                    EventTrace.IsEnabled(EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose)) 
                {
                    EventTrace.EventProvider.TraceEvent(EventTrace.Event.PerfElementIDName, EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose, 
                            PerfService.GetPerfElementID(this), GetType().Name, GetValue(dp)); 
                }
 
                //
                // Invalidation propagation for Styles
                //
 
                // Regardless of metadata, the Style/Template/DefaultStyleKey properties are never a trigger drivers
                if (dp != StyleProperty && dp != Control.TemplateProperty && dp != DefaultStyleKeyProperty) 
                { 
                    // Note even properties on non-container nodes within a template could be driving a trigger
                    if (TemplatedParent != null) 
                    {
                        FrameworkElement feTemplatedParent = TemplatedParent as FrameworkElement;

                        FrameworkTemplate frameworkTemplate = feTemplatedParent.TemplateInternal; 
                        if (frameworkTemplate != null)
                        { 
                            StyleHelper.OnTriggerSourcePropertyInvalidated(null, frameworkTemplate, TemplatedParent, dp, e, false /*invalidateOnlyContainer*/, 
                                ref frameworkTemplate.TriggerSourceRecordFromChildIndex, ref frameworkTemplate.PropertyTriggersWithActions, TemplateChildIndex /*sourceChildIndex*/);
                        } 
                    }

                    // Do not validate Style during an invalidation if the Style was
                    // never used before (dependents do not need invalidation) 
                    if (Style != null)
                    { 
                        StyleHelper.OnTriggerSourcePropertyInvalidated(Style, null, this, dp, e, true /*invalidateOnlyContainer*/, 
                            ref Style.TriggerSourceRecordFromChildIndex, ref Style.PropertyTriggersWithActions, 0 /*sourceChildIndex*/); // Style can only have triggers that are driven by properties on the container
                    } 

                    // Do not validate Template during an invalidation if the Template was
                    // never used before (dependents do not need invalidation)
                    if (TemplateInternal != null) 
                    {
                        StyleHelper.OnTriggerSourcePropertyInvalidated(null, TemplateInternal, this, dp, e, !HasTemplateGeneratedSubTree /*invalidateOnlyContainer*/, 
                            ref TemplateInternal.TriggerSourceRecordFromChildIndex, ref TemplateInternal.PropertyTriggersWithActions, 0 /*sourceChildIndex*/); // These are driven by the container 
                    }
 
                    // There may be container dependents in the ThemeStyle. Invalidate them.
                    if (ThemeStyle != null && Style != ThemeStyle)
                    {
                        StyleHelper.OnTriggerSourcePropertyInvalidated(ThemeStyle, null, this, dp, e, true /*invalidateOnlyContainer*/, 
                            ref ThemeStyle.TriggerSourceRecordFromChildIndex, ref ThemeStyle.PropertyTriggersWithActions, 0 /*sourceChildIndex*/); // ThemeStyle can only have triggers that are driven by properties on the container
                    } 
                } 
            }
 
            FrameworkPropertyMetadata fmetadata = e.Metadata as FrameworkPropertyMetadata;

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
                    if ((InheritanceBehavior == InheritanceBehavior.Default || fmetadata.OverridesInheritanceBehavior) &&
                        (!DependencyObject.IsTreeWalkOperation(e.OperationType) || PotentiallyHasMentees))
                    {
                        EffectiveValueEntry newEntry = e.NewEntry; 
                        EffectiveValueEntry oldEntry = e.OldEntry;
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
 
                        InheritablePropertyChangeInfo info =
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
                        if (PotentiallyHasMentees) 
                        { 
                            TreeWalkHelper.OnInheritedPropertyChanged(this, ref info, InheritanceBehavior);
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
                    if( !(AncestorChangeInProgress && InVisibilityCollapsedTree) )
                    { 
                        UIElement layoutParent = null;
 
                        bool affectsParentMeasure = fmetadata.AffectsParentMeasure; 
                        bool affectsParentArrange = fmetadata.AffectsParentArrange;
                        bool affectsMeasure = fmetadata.AffectsMeasure; 
                        bool affectsArrange = fmetadata.AffectsArrange;
                        if (affectsMeasure || affectsArrange || affectsParentArrange || affectsParentMeasure)
                        {
                            // Locate nearest Layout parent 
                            for (Visual v = VisualTreeHelper.GetParent(this) as Visual;
                                 v != null; 
                                 v = VisualTreeHelper.GetParent(v) as Visual) 
                            {
                                layoutParent = v as UIElement; 
                                if (layoutParent != null)
                                {
                                    //let incrementally-updating FrameworkElements to mark the vicinity of the affected child
                                    //to perform partial update. 
                                    if(FrameworkElement.DType.IsInstanceOfType(layoutParent))
                                        ((FrameworkElement)layoutParent).ParentLayoutInvalidated(this); 
 
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

 

                            if (!BypassLayoutPolicies || !((dp == WidthProperty) || (dp == HeightProperty)))
                            {
                                InvalidateMeasure(); 
                            }
                        } 
 
                        if (fmetadata.AffectsArrange)
                        { 
                            InvalidateArrange();
                        }

                        if (fmetadata.AffectsRender && 
                            (e.IsAValueChange || !fmetadata.SubPropertiesDoNotAffectRender))
                        { 
                            InvalidateVisual(); 
                        }
                    } 
                }
            }
        }
 
        //
        // Get the closest Framework type up the logical or physical tree 
        // 
        // (Shared between FrameworkElement and FrameworkContentElement)
        // 
        internal static DependencyObject GetFrameworkParent(object current)
        {
            FrameworkObject fo = new FrameworkObject(current as DependencyObject);
 
            fo = fo.FrameworkParent;
 
            return fo.DO; 
        }
 
        internal static bool GetFrameworkParent(FrameworkElement current, out FrameworkElement feParent, out FrameworkContentElement fceParent)
        {
            FrameworkObject fo = new FrameworkObject(current, null);
 
            fo = fo.FrameworkParent;
 
            feParent = fo.FE; 
            fceParent = fo.FCE;
 
            return fo.IsValid;
        }

 
        internal static bool GetFrameworkParent(FrameworkContentElement current, out FrameworkElement feParent, out FrameworkContentElement fceParent)
        { 
            FrameworkObject fo = new FrameworkObject(null, current); 

            fo = fo.FrameworkParent; 

            feParent = fo.FE;
            fceParent = fo.FCE;
 
            return fo.IsValid;
        } 
 
        internal static bool GetContainingFrameworkElement(DependencyObject current, out FrameworkElement fe, out FrameworkContentElement fce)
        { 
            FrameworkObject fo = FrameworkObject.GetContainingFrameworkElement(current);

            if (fo.IsValid)
            { 
                fe = fo.FE;
                fce = fo.FCE; 
                return true; 
            }
            else 
            {
                fe = null;
                fce = null;
                return false; 
            }
        } 
 

        // Fetchs the specified childRecord for the given template.  Returns true if successful. 
        internal static void GetTemplatedParentChildRecord(
            DependencyObject templatedParent,
            int childIndex,
            out ChildRecord childRecord, 
            out bool isChildRecordValid)
        { 
            FrameworkTemplate templatedParentTemplate = null; 
            isChildRecordValid = false;
            childRecord = new ChildRecord();    // CS0177 

            if (templatedParent != null)
            {
                FrameworkObject foTemplatedParent = new FrameworkObject(templatedParent, true); 

                Debug.Assert( foTemplatedParent.IsFE ); 
 
                // This node is the result of a style expansion
 
                // Pick the owner for the VisualTree that generated this node
                templatedParentTemplate = foTemplatedParent.FE.TemplateInternal;

                Debug.Assert(templatedParentTemplate != null , 
                    "If this node is the result of a VisualTree expansion then it should have a parent template");
 
                // Check if this Child Index is represented in FrameworkTemplate 
                if (templatedParentTemplate != null && ((0 <= childIndex) && (childIndex < templatedParentTemplate.ChildRecordFromChildIndex.Count)))
                { 
                    childRecord = templatedParentTemplate.ChildRecordFromChildIndex[childIndex];
                    isChildRecordValid = true;
                }
 
            }
        } 
 
        /// <summary>
        ///     Return the text that represents this object, from the User's perspective. 
        /// </summary>
        /// <returns></returns>
        internal virtual string GetPlainText()
        { 
            return null;
        } 
 

        static FrameworkElement() 
        {
            SnapsToDevicePixelsProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(BooleanBoxes.FalseBox, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsArrange));

            EventManager.RegisterClassHandler(_typeofThis, Mouse.QueryCursorEvent, new QueryCursorEventHandler(FrameworkElement.OnQueryCursorOverride), true); 

            EventManager.RegisterClassHandler(_typeofThis, Keyboard.PreviewGotKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(OnPreviewGotKeyboardFocus)); 
            EventManager.RegisterClassHandler(_typeofThis, Keyboard.GotKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(OnGotKeyboardFocus)); 
            EventManager.RegisterClassHandler(_typeofThis, Keyboard.LostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(OnLostKeyboardFocus));
 
            AllowDropProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(BooleanBoxes.FalseBox, FrameworkPropertyMetadataOptions.Inherits));

            Stylus.IsPressAndHoldEnabledProperty.AddOwner(_typeofThis, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits));
            Stylus.IsFlicksEnabledProperty.AddOwner(_typeofThis, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits)); 
            Stylus.IsTapFeedbackEnabledProperty.AddOwner(_typeofThis, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits));
            Stylus.IsTouchFeedbackEnabledProperty.AddOwner(_typeofThis, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits)); 
 
            PropertyChangedCallback numberSubstitutionChanged = new PropertyChangedCallback(NumberSubstitutionChanged);
            NumberSubstitution.CultureSourceProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(NumberCultureSource.User, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, numberSubstitutionChanged)); 
            NumberSubstitution.CultureOverrideProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, numberSubstitutionChanged));
            NumberSubstitution.SubstitutionProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(NumberSubstitutionMethod.AsCulture, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, numberSubstitutionChanged));

            // Exposing these events in protected virtual methods 
            EventManager.RegisterClassHandler(_typeofThis, ToolTipOpeningEvent, new ToolTipEventHandler(OnToolTipOpeningThunk));
            EventManager.RegisterClassHandler(_typeofThis, ToolTipClosingEvent, new ToolTipEventHandler(OnToolTipClosingThunk)); 
            EventManager.RegisterClassHandler(_typeofThis, ContextMenuOpeningEvent, new ContextMenuEventHandler(OnContextMenuOpeningThunk)); 
            EventManager.RegisterClassHandler(_typeofThis, ContextMenuClosingEvent, new ContextMenuEventHandler(OnContextMenuClosingThunk));
 
            // Coerce Callback for font properties for responding to system themes
            TextElement.FontFamilyProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(SystemFonts.MessageFontFamily, FrameworkPropertyMetadataOptions.Inherits, null, new CoerceValueCallback(CoerceFontFamily)));
            TextElement.FontSizeProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(SystemFonts.MessageFontSize, FrameworkPropertyMetadataOptions.Inherits, null, new CoerceValueCallback(CoerceFontSize)));
            TextElement.FontStyleProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(SystemFonts.MessageFontStyle, FrameworkPropertyMetadataOptions.Inherits, null, new CoerceValueCallback(CoerceFontStyle))); 
            TextElement.FontWeightProperty.OverrideMetadata(_typeofThis, new FrameworkPropertyMetadata(SystemFonts.MessageFontWeight, FrameworkPropertyMetadataOptions.Inherits, null, new CoerceValueCallback(CoerceFontWeight)));
 
            TextOptions.TextRenderingModeProperty.OverrideMetadata( 
                typeof(FrameworkElement),
                new FrameworkPropertyMetadata( 
                    new PropertyChangedCallback(TextRenderingMode_Changed)));

        }
 
        private static void TextRenderingMode_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            FrameworkElement fe = (FrameworkElement) d; 
            fe.pushTextRenderingMode();
        } 

        internal virtual void pushTextRenderingMode()
        {
            // 
            // TextRenderingMode is inherited both in the UIElement tree and the graphics tree.
            // This means we don't need to set VisualTextRenderingMode on every single node, we only 
            // want to set it on a Visual when it is explicitly set, or set in a manner other than inheritance. 
            // The sole exception to this is PopupRoot, which needs to propagate the value to its Visual, because
            // the graphics tree does not inherit across CompositionTarget boundaries. 
            //
            System.Windows.ValueSource vs = DependencyPropertyHelper.GetValueSource(this, TextOptions.TextRenderingModeProperty);
            if (vs.BaseValueSource > BaseValueSource.Inherited)
            { 
                base.VisualTextRenderingMode = TextOptions.GetTextRenderingMode(this);
            } 
        } 

        internal static readonly NumberSubstitution DefaultNumberSubstitution = new NumberSubstitution( 
            NumberCultureSource.User,           // number substitution in UI defaults to user culture
            null,                               // culture override
            NumberSubstitutionMethod.AsCulture
            ); 

        /// <summary> 
        ///     Invoked when ancestor is changed.  This is invoked after 
        ///     the ancestor has changed, and the purpose is to allow elements to
        ///     perform actions based on the changed ancestor. 
        /// </summary>
        //CASRemoval:[StrongNameIdentityPermissionAttribute(SecurityAction.InheritanceDemand, PublicKey=Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)]
        internal virtual void OnAncestorChanged()
        { 
        }
 
        /// <summary> 
        /// OnVisualParentChanged is called when the parent of the Visual is changed.
        /// </summary> 
        /// <param name="oldParent">Old parent or null if the Visual did not have a parent before.</param>
        protected internal override void OnVisualParentChanged(DependencyObject oldParent)
        {
            DependencyObject newParent = VisualTreeHelper.GetParentInternal(this); 

            // Visual parent implies no InheritanceContext 
            if (newParent != null) 
            {
                ClearInheritanceContext(); 
            }

            // Update HasLoadedChangeHandler Flag
            BroadcastEventHelper.AddOrRemoveHasLoadedChangeHandlerFlag(this, oldParent, newParent); 

            // Fire Loaded and Unloaded Events 
            BroadcastEventHelper.BroadcastLoadedOrUnloadedEvent(this, oldParent, newParent); 

            if (newParent != null && (newParent is FrameworkElement) == false) 
            {
                // If you are being connected to a non-FE parent then start listening for VisualAncestor
                // changes because otherwise you won't know about changes happening above you
                Visual newParentAsVisual = newParent as Visual; 
                if (newParentAsVisual != null)
                { 
                    newParentAsVisual.VisualAncestorChanged += new AncestorChangedEventHandler(OnVisualAncestorChanged); 
                }
                else if (newParent is Visual3D) 
                {
                    ((Visual3D)newParent).VisualAncestorChanged += new Visual.AncestorChangedEventHandler(OnVisualAncestorChanged);
                }
            } 
            else if (oldParent != null && (oldParent is FrameworkElement) == false)
            { 
                // If you are being disconnected from a non-FE parent then stop listening for 
                // VisualAncestor changes
                Visual oldParentAsVisual = oldParent as Visual; 
                if (oldParentAsVisual != null)
                {
                    oldParentAsVisual.VisualAncestorChanged -= new AncestorChangedEventHandler(OnVisualAncestorChanged);
                } 
                else if (oldParent is Visual3D)
                { 
                    ((Visual3D)oldParent).VisualAncestorChanged -= new Visual.AncestorChangedEventHandler(OnVisualAncestorChanged); 
                }
            } 

            // Do it only if you do not have a logical parent
            if (Parent == null)
            { 
                // Invalidate relevant properties for this subtree
                DependencyObject parent = (newParent != null) ? newParent : oldParent; 
                TreeWalkHelper.InvalidateOnTreeChange(this, null, parent, (newParent != null)); 
            }
 
            // Initialize, if not already done.

            // Note that it is for performance reasons that we TryFireInitialize after
            // we have done InvalidateOnTreeChange. This is because InvalidateOnTreeChange 
            // invalidates the style property conditionally if the object has been initialized.
            // And OnInitialized also invalidates the style property. If we were to do these 
            // operations in the reverse order we would be invalidating the style property twice. 
            // Whereas now we do it only once.
 
            TryFireInitialized();

            base.OnVisualParentChanged(oldParent);
        } 

        internal new void OnVisualAncestorChanged(object sender, AncestorChangedEventArgs e) 
        { 
            // NOTE:
            // 
            // We are forced to listen to AncestorChanged events because a FrameworkElement
            // may have raw Visuals/UIElements between it and its nearest FrameworkElement
            // parent.  We only care about changes that happen to the visual tree BETWEEN
            // this FrameworkElement and its nearest FrameworkElement parent.  This is 
            // because we can rely on our nearest FrameworkElement parent to notify us
            // when its loaded state changes. 
 
            FrameworkElement feParent = null;
            FrameworkContentElement fceParent = null; 

            // Find our nearest FrameworkElement parent.
            FrameworkElement.GetContainingFrameworkElement(VisualTreeHelper.GetParent(this), out feParent, out fceParent);
            Debug.Assert(fceParent == null, "Nearest framework parent via the visual tree has to be an FE. It cannot be an FCE"); 

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
                    FrameworkElement.GetContainingFrameworkElement(e.OldParent, out feParent, out fceParent); 

                    if(feParent != null) 
                    {
                        // Update HasLoadedChangeHandler Flag
                        BroadcastEventHelper.AddOrRemoveHasLoadedChangeHandlerFlag(this, feParent, null);
 
                        // Fire Loaded and Unloaded Events
                        BroadcastEventHelper.BroadcastLoadedOrUnloadedEvent(this, feParent, null); 
                    } 
                }
            } 
        }

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
        protected internal InheritanceBehavior InheritanceBehavior 
        {
            get 
            {
                Debug.Assert((uint)InternalFlags.InheritanceBehavior0 == 0x08);
                Debug.Assert((uint)InternalFlags.InheritanceBehavior1 == 0x10);
                Debug.Assert((uint)InternalFlags.InheritanceBehavior2 == 0x20); 

                const uint inheritanceBehaviorMask = 
                    (uint)InternalFlags.InheritanceBehavior0 + 
                    (uint)InternalFlags.InheritanceBehavior1 +
                    (uint)InternalFlags.InheritanceBehavior2; 

                uint inheritanceBehavior = ((uint)_flags & inheritanceBehaviorMask) >> 3;
                return (InheritanceBehavior)inheritanceBehavior;
            } 

            set 
            { 
                Debug.Assert((uint)InternalFlags.InheritanceBehavior0 == 0x08);
                Debug.Assert((uint)InternalFlags.InheritanceBehavior1 == 0x10); 
                Debug.Assert((uint)InternalFlags.InheritanceBehavior2 == 0x20);

                const uint inheritanceBehaviorMask =
                    (uint)InternalFlags.InheritanceBehavior0 + 
                    (uint)InternalFlags.InheritanceBehavior1 +
                    (uint)InternalFlags.InheritanceBehavior2; 
 
                if (!this.IsInitialized)
                { 
                    if ((uint)value < 0 ||
                        (uint)value > (uint)InheritanceBehavior.SkipAllNext)
                    {
                        throw new InvalidEnumArgumentException("value", (int)value, typeof(InheritanceBehavior)); 
                    }
 
                    uint inheritanceBehavior = (uint)value << 3; 

                    _flags = (InternalFlags)((inheritanceBehavior & inheritanceBehaviorMask) | (((uint)_flags) & ~inheritanceBehaviorMask)); 

                    if (_parent != null)
                    {
                        // This means that we are in the process of xaml parsing: 
                        // an instance of FE has been created and added to a parent,
                        // but no children yet added to it (otherwise it would be initialized already 
                        // and we would not be allowed to change InheritanceBehavior). 
                        // So we need to re-calculate properties accounting for the new
                        // inheritance behavior. 
                        // This must have no performance effect as the subtree of this
                        // element is empty (no children yet added).
                        TreeWalkHelper.InvalidateOnTreeChange(/*fe:*/this, /*fce:*/null, _parent, true);
                    } 
                }
                else 
                { 
                    throw new InvalidOperationException(SR.Get(SRID.Illegal_InheritanceBehaviorSettor));
                } 
            }
        }

 
        #region Data binding
 
        /// <summary> 
        /// Add / Remove TargetUpdatedEvent handler
        /// </summary> 
        public event EventHandler<DataTransferEventArgs> TargetUpdated
        {
            add     { AddHandler(Binding.TargetUpdatedEvent, value); }
            remove  { RemoveHandler(Binding.TargetUpdatedEvent, value); } 
        }
 
 
        /// <summary>
        /// Add / Remove SourceUpdatedEvent handler 
        /// </summary>
        public event EventHandler<DataTransferEventArgs> SourceUpdated
        {
            add     { AddHandler(Binding.SourceUpdatedEvent, value); } 
            remove  { RemoveHandler(Binding.SourceUpdatedEvent, value); }
        } 
 
        /// <summary>
        ///     DataContext DependencyProperty 
        /// </summary>
        public static readonly DependencyProperty DataContextProperty =
                    DependencyProperty.Register(
                                "DataContext", 
                                typeof(object),
                                _typeofThis, 
                                new FrameworkPropertyMetadata(null, 
                                        FrameworkPropertyMetadataOptions.Inherits,
                                        new PropertyChangedCallback(OnDataContextChanged))); 

        /// <summary>
        ///     DataContextChanged private key
        /// </summary> 
        internal static readonly EventPrivateKey DataContextChangedKey = new EventPrivateKey();
 
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
        public event DependencyPropertyChangedEventHandler DataContextChanged 
        {
            add { EventHandlersStoreAdd(DataContextChangedKey, value); }
            remove { EventHandlersStoreRemove(DataContextChangedKey, value); }
        } 

        /// <summary> 
        ///     DataContext Property 
        /// </summary>
        public object DataContext
        {
            get { return GetValue(DataContextProperty); } 
            set { SetValue(DataContextProperty, value); }
        } 
 

        private static void OnDataContextChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            if (e.NewValue == BindingExpressionBase.DisconnectedItem)
                return;
 
            ((FrameworkElement) d).RaiseDependencyPropertyChanged(DataContextChangedKey, e);
        } 
 

        /// <summary> 
        /// Get the BindingExpression for the given property
        /// </summary>
        /// <param name="dp">DependencyProperty that represents the property</param>
        /// <returns> BindingExpression if property is data-bound, null if it is not</returns> 
        public BindingExpression GetBindingExpression(DependencyProperty dp)
        { 
            return BindingOperations.GetBindingExpression(this, dp); 
        }
 
        /// <summary>
        /// Attach a data Binding to the property
        /// </summary>
        /// <param name="dp">DependencyProperty that represents the property</param> 
        /// <param name="binding">description of Binding to attach</param>
        public BindingExpressionBase SetBinding(DependencyProperty dp, BindingBase binding) 
        { 
            return BindingOperations.SetBinding(this, dp, binding);
        } 

        /// <summary>
        /// Convenience method.  Create a BindingExpression and attach it.
        /// Most fields of the BindingExpression get default values. 
        /// </summary>
        /// <param name="dp">DependencyProperty that represents the property</param> 
        /// <param name="path">source path</param> 
        public BindingExpression SetBinding(DependencyProperty dp, string path)
        { 
            return (BindingExpression)SetBinding(dp, new Binding(path));
        }

 
        /// <summary>
        ///     BindingGroup DependencyProperty 
        /// </summary> 
        public static readonly DependencyProperty BindingGroupProperty =
                    DependencyProperty.Register( 
                                "BindingGroup",
                                typeof(BindingGroup),
                                _typeofThis,
                                new FrameworkPropertyMetadata(null, 
                                        FrameworkPropertyMetadataOptions.Inherits));
 
        /// <summary> 
        ///     BindingGroup Property
        /// </summary> 
        public BindingGroup BindingGroup
        { 
            get { return (BindingGroup)GetValue(BindingGroupProperty); }
            set { SetValue(BindingGroupProperty, value); } 
        } 

        /// <returns>
        ///     Returns a non-null value when some framework implementation 
        ///     of this method has a non-visual parent connection,
        /// </returns> 
        protected internal override DependencyObject GetUIParentCore() 
        {
            // Note: this only follows one logical link. 
            return this._parent;
        }

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
        internal override object AdjustEventSource(RoutedEventArgs args)
        { 
            object source = null;
 
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

            if(_parent != null || HasLogicalChildren) 
            {
                DependencyObject logicalSource = args.Source as DependencyObject;
                if(logicalSource == null || !IsLogicalDescendent(logicalSource))
                { 
                    args.Source=this;
                    source = this; 
                } 
            }
 
            return source;
        }

        // Allows adjustments to the branch source popped off the stack 
        internal virtual void AdjustBranchSource(RoutedEventArgs args)
        { 
        } 

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
        internal override bool BuildRouteCore(EventRoute route, RoutedEventArgs args) 
        {
            return BuildRouteCoreHelper(route, args, true); 
        }
        internal bool BuildRouteCoreHelper(EventRoute route, RoutedEventArgs args, bool shouldAddIntermediateElementsToRoute)
        {
            bool continuePastCoreTree = false; 

            DependencyObject visualParent = VisualTreeHelper.GetParent(this); 
            DependencyObject modelParent = GetUIParentCore(); 

            // FrameworkElement extends the basic event routing strategy by 
            // introducing the concept of a logical tree.  When an event
            // passes through an element in a logical tree, the source of
            // the event needs to change to the leaf-most node in the same
            // logical tree that is in the route. 

            // Check the route to see if we are returning into a logical tree 
            // that we left before.  If so, restore the source of the event to 
            // be the source that it was when we left the logical tree.
            DependencyObject branchNode = route.PeekBranchNode() as DependencyObject; 
            if (branchNode != null && IsLogicalDescendent(branchNode))
            {
                // We keep the most recent source in the event args.  Note that
                // this is only for our consumption.  Once the event is raised, 
                // it will use the source information in the route.
                args.Source=route.PeekBranchSource(); 
 
                AdjustBranchSource(args);
 
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

            if (!IgnoreModelParentBuildRoute(args)) 
            {
                // If there is no visual parent, route via the model tree.
                if (visualParent == null)
                { 
                    continuePastCoreTree = modelParent != null;
                } 
                else if(modelParent != null) 
                {
                    Visual visualParentAsVisual = visualParent as Visual; 
                    if (visualParentAsVisual != null)
                    {
                        if (visualParentAsVisual.CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot))
                        { 
                            continuePastCoreTree = true;
                        } 
                    } 
                    else
                    { 
                        if (((Visual3D)visualParent).CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot))
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
        }
 
        /// <summary>
        ///     Add Style TargetType and FEF EventHandlers to the EventRoute
        /// </summary>
        internal override void AddToEventRouteCore(EventRoute route, RoutedEventArgs args) 
        {
            AddStyleHandlersToEventRoute(this, null, route, args); 
        } 

        // Add Style TargetType and FEF EventHandlers to the EventRoute 
        internal static void AddStyleHandlersToEventRoute(
            FrameworkElement fe,
            FrameworkContentElement fce,
            EventRoute route, 
            RoutedEventArgs args)
        { 
            Debug.Assert(fe != null || fce != null); 

            DependencyObject source = (fe != null) ? (DependencyObject)fe : (DependencyObject)fce; 
            Style selfStyle = null;
            FrameworkTemplate selfFrameworkTemplate = null;
            DependencyObject templatedParent = null;
            int templateChildIndex = -1; 

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
            RoutedEventHandlerInfo[] handlers = null;
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
                FrameworkTemplate templatedParentTemplate = null;

                FrameworkElement feTemplatedParent = templatedParent as FrameworkElement;
                Debug.Assert( feTemplatedParent != null ); 

                templatedParentTemplate = feTemplatedParent.TemplateInternal; 
 
                // Fetch handlers from either the parent style or template
                handlers = null; 
                if (templatedParentTemplate != null && templatedParentTemplate.HasEventDependents)
                {
                    handlers = StyleHelper.GetChildRoutedEventHandlers(templateChildIndex, args.RoutedEvent, ref templatedParentTemplate.EventDependents);
                } 

                // Add FEF EventHandlers to the route 
                AddStyleHandlersToEventRoute(route, source, handlers); 
            }
        } 

        // This is a helper that will facilitate adding a given array of handlers to the route
        private static void AddStyleHandlersToEventRoute(
            EventRoute route, 
            DependencyObject source,
            RoutedEventHandlerInfo[] handlers) 
        { 
            if (handlers != null)
            { 
                for (int i=0; i<handlers.Length; i++)
                {
                    route.Add(source, handlers[i].Handler, handlers[i].InvokeHandledEventsToo);
                } 
            }
        } 
 
        //CASRemoval:[StrongNameIdentityPermissionAttribute(SecurityAction.InheritanceDemand, PublicKey=Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)]
        internal virtual bool IgnoreModelParentBuildRoute(RoutedEventArgs args) 
        {
            return false;
        }
 
        internal override bool InvalidateAutomationAncestorsCore(Stack<DependencyObject> branchNodeStack, out bool continuePastCoreTree)
        { 
            bool shouldInvalidateIntermediateElements = true; 
            return InvalidateAutomationAncestorsCoreHelper(branchNodeStack, out continuePastCoreTree, shouldInvalidateIntermediateElements);
        } 

        internal bool InvalidateAutomationAncestorsCoreHelper(Stack<DependencyObject> branchNodeStack, out bool continuePastCoreTree, bool shouldInvalidateIntermediateElements)
        {
            bool continueInvalidation = true; 
            continuePastCoreTree = false;
 
            DependencyObject visualParent = VisualTreeHelper.GetParent(this); 
            DependencyObject modelParent = GetUIParentCore();
 
            DependencyObject branchNode = branchNodeStack.Count > 0 ? branchNodeStack.Peek() : null;
            if (branchNode != null && IsLogicalDescendent(branchNode))
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
                continuePastCoreTree = modelParent != null; 
            } 
            else if(modelParent != null)
            { 
                Visual visualParentAsVisual = visualParent as Visual;
                if (visualParentAsVisual != null)
                {
                    if (visualParentAsVisual.CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot)) 
                    {
                        continuePastCoreTree = true; 
                    } 
                }
                else 
                {
                    if (((Visual3D)visualParent).CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot))
                    {
                        continuePastCoreTree = true; 
                    }
                } 
 
                // If there is a model parent, record the branch node.
                branchNodeStack.Push(this); 
            }

            return continueInvalidation;
        } 

        internal static bool InvalidateAutomationIntermediateElements( 
            DependencyObject mergePoint, 
            DependencyObject modelTreeNode)
        { 
            UIElement e = null;
            ContentElement ce = null;
            UIElement3D e3d = null;
 
            while (modelTreeNode != null && modelTreeNode != mergePoint)
            { 
                if (!UIElementHelper.InvalidateAutomationPeer(modelTreeNode, out e, out ce, out e3d)) 
                {
                    return false; 
                }

                // Get model parent
                modelTreeNode = LogicalTreeHelper.GetParent(modelTreeNode); 
            }
 
            return true; 
        }
 
        /// <summary>
        /// Language can be specified in xaml at any point using the xml language attribute xml:lang.
        /// This will make the culture pertain to the scope of the element where it is applied.  The 
        /// XmlLanguage names follow the RFC 3066 standard. For example, U.S. English is "en-US".
        /// </summary> 
        static public readonly DependencyProperty LanguageProperty = 
                    DependencyProperty.RegisterAttached(
                                "Language", 
                                typeof(XmlLanguage),
                                _typeofThis,
                                new FrameworkPropertyMetadata(
                                        XmlLanguage.GetLanguage("en-US"), 
                                        FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure));
        /// <summary> 
        /// Language can be specified in xaml at any point using the xml language attribute xml:lang. 
        /// This will make the culture pertain to the scope of the element where it is applied.  The
        /// XmlLanguage names follow the RFC 3066 standard. For example, U.S. English is "en-US". 
        /// </summary>
        public XmlLanguage Language
        {
            get { return (XmlLanguage) GetValue(LanguageProperty); } 
            set { SetValue(LanguageProperty, value); }
        } 

        /// <summary> 
        ///     The DependencyProperty for the Name property.
        /// </summary>
        public static readonly DependencyProperty NameProperty = 
                    DependencyProperty.Register(
                                "Name", 
                                typeof(string), 
                                _typeofThis,
                                new FrameworkPropertyMetadata( 
                                    string.Empty,                           // defaultValue
                                    FrameworkPropertyMetadataOptions.None,  // flags
                                    null,                                   // propertyChangedCallback
                                    null,                                   // coerceValueCallback 
                                    true),                                  // isAnimationProhibited
                                new ValidateValueCallback(System.Windows.Markup.NameValidationHelper.NameValidationCallback)); 
 
        /// <summary>
        ///     Name property. 
        /// </summary>
        public string Name
        { 
            get { return (string) GetValue(NameProperty); } 
            set { SetValue(NameProperty, value);  }
        } 

        /// <summary>
        ///     The DependencyProperty for the Tag property.
        /// </summary> 
        public static readonly DependencyProperty TagProperty =
                    DependencyProperty.Register( 
                                "Tag", 
                                typeof(object),
                                _typeofThis, 
                                new FrameworkPropertyMetadata((object) null));

        /// <summary>
        ///     Tag property. 
        /// </summary>
        public object Tag 
        {
            get { return GetValue(TagProperty); } 
            set { SetValue(TagProperty, value); }
        }

        #region InputScope 

        /// <summary> 
        ///     InputScope DependencyProperty 
        ///     this is originally registered on InputMethod class
        /// </summary> 
        public static readonly DependencyProperty InputScopeProperty =
                    InputMethod.InputScopeProperty.AddOwner(_typeofThis,
                                new FrameworkPropertyMetadata((InputScope)null, // default value
                                            FrameworkPropertyMetadataOptions.Inherits)); 

        /// <summary> 
        ///     InputScope Property accessor 
        /// </summary>
        public InputScope InputScope 
        {
            get { return (InputScope) GetValue(InputScopeProperty); }
            set { SetValue(InputScopeProperty, value); }
        } 

        /// <summary>
        /// RequestBringIntoView Event 
        /// </summary>
        public static readonly RoutedEvent RequestBringIntoViewEvent = EventManager.RegisterRoutedEvent("RequestBringIntoView", RoutingStrategy.Bubble, typeof(RequestBringIntoViewEventHandler), _typeofThis);

        /// <summary> 
        /// Handler registration for RequestBringIntoView event.
        /// </summary> 
        public event RequestBringIntoViewEventHandler RequestBringIntoView 
        {
            add { AddHandler(RequestBringIntoViewEvent, value, false); } 
            remove { RemoveHandler(RequestBringIntoViewEvent, value); }
        }

        /// <summary> 
        /// Attempts to bring this element into view by originating a RequestBringIntoView event.
        /// </summary> 
        public void BringIntoView() 
        {
            //dmitryt, bug 1126518. On new/updated elements RenderSize isn't yet computed 
            //so we need to postpone the rect computation until layout is done.
            //this is accomplished by passing Empty rect here and then asking for RenderSize
            //in IScrollInfo when it actually executes an async MakeVisible command.
            BringIntoView( /*RenderSize*/ Rect.Empty); 
        }
 
        /// <summary> 
        /// Attempts to bring the given rectangle of this element into view by originating a RequestBringIntoView event.
        /// </summary> 
        public void BringIntoView(Rect targetRectangle)
        {
            RequestBringIntoViewEventArgs args = new RequestBringIntoViewEventArgs(this, targetRectangle);
            args.RoutedEvent=RequestBringIntoViewEvent; 
            RaiseEvent(args);
        } 
 

        /// <summary> 
        /// SizeChanged event
        /// </summary>
        public static readonly RoutedEvent SizeChangedEvent = EventManager.RegisterRoutedEvent("SizeChanged", RoutingStrategy.Direct, typeof(SizeChangedEventHandler), _typeofThis);
 
        /// <summary>
        /// SizeChanged event. It is fired when ActualWidth or ActualHeight (or both) changed. 
        /// <see cref="SizeChangedEventArgs">SizeChangedEventArgs</see> parameter contains new and 
        /// old sizes, and flags indicating whether Width or Height actually changed. <para/>
        /// These flags are provided to avoid common mistake of comparing new and old values 
        /// since simple compare of double-precision numbers can yield "not equal" when size in fact
        /// didn't change (round off errors accumulated during input processing and layout calculations
        /// may result in very small differencies that are considered "the same layout").
        /// </summary> 
        public event SizeChangedEventHandler SizeChanged
        { 
            add {AddHandler(SizeChangedEvent, value, false);} 
            remove {RemoveHandler(SizeChangedEvent, value);}
        } 

        private static PropertyMetadata _actualWidthMetadata = new ReadOnlyFrameworkPropertyMetadata(0d, new GetReadOnlyValueCallback(GetActualWidth));

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
        private static readonly DependencyPropertyKey ActualWidthPropertyKey = 
                DependencyProperty.RegisterReadOnly(
                        "ActualWidth", 
                        typeof(double),
                        _typeofThis,
                        _actualWidthMetadata);
 
        private static object GetActualWidth(DependencyObject d, out BaseValueSourceInternal source)
        { 
            FrameworkElement fe = (FrameworkElement) d; 
            if (fe.HasWidthEverChanged)
            { 
                source = BaseValueSourceInternal.Local;
                return fe.RenderSize.Width;
            }
            else 
            {
                source = BaseValueSourceInternal.Default; 
                return 0d; 
            }
        } 

        /// <summary>
        /// The ActualWidth dynamic property.
        /// </summary> 
        public static readonly DependencyProperty ActualWidthProperty =
                ActualWidthPropertyKey.DependencyProperty; 
 
        /// <summary>
        /// The ActualWidth CLR property - wrapper for ActualWidthProperty. 
        /// Result in 1/96th inch. ("device-independent pixel")
        /// </summary>
        public double ActualWidth
        { 
            get
            { 
                return RenderSize.Width; 
            }
        } 

        private static PropertyMetadata _actualHeightMetadata = new ReadOnlyFrameworkPropertyMetadata(0d, new GetReadOnlyValueCallback(GetActualHeight));

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
        private static readonly DependencyPropertyKey ActualHeightPropertyKey = 
                DependencyProperty.RegisterReadOnly(
                        "ActualHeight", 
                        typeof(double),
                        _typeofThis,
                        _actualHeightMetadata);
 
        private static object GetActualHeight(DependencyObject d, out BaseValueSourceInternal source)
        { 
            FrameworkElement fe = (FrameworkElement) d; 
            if (fe.HasHeightEverChanged)
            { 
                source = BaseValueSourceInternal.Local;
                return fe.RenderSize.Height;
            }
            else 
            {
                source = BaseValueSourceInternal.Default; 
                return 0d; 
            }
        } 

        /// <summary>
        /// The ActualHeight dynamic property.
        /// </summary> 
        public static readonly DependencyProperty ActualHeightProperty =
                ActualHeightPropertyKey.DependencyProperty; 
 
        /// <summary>
        /// The ActualHeight CLR property - wrapper for ActualHeightProperty. 
        /// Result in 1/96th inch. ("device-independent pixel")
        /// </summary>
        public double ActualHeight
        { 
            get
            { 
                return RenderSize.Height; 
            }
        } 


        private static bool IsWidthHeightValid(object value) 
        { 
            double v = (double)value;
            return (DoubleUtil.IsNaN(v)) || (v >= 0.0d && !Double.IsPositiveInfinity(v)); 
        }

        private static bool IsMinWidthHeightValid(object value)
        { 
            double v = (double)value;
            return (!DoubleUtil.IsNaN(v) && v >= 0.0d && !Double.IsPositiveInfinity(v)); 
        } 

        private static bool IsMaxWidthHeightValid(object value) 
        {
            double v = (double)value;
            return (!DoubleUtil.IsNaN(v) && v >= 0.0d);
        } 

        /// <summary> 
        /// Width Dependency Property
        /// </summary> 
        public static readonly DependencyProperty WidthProperty =
                    DependencyProperty.Register( 
                                "Width",
                                typeof(double),
                                _typeofThis,
                                new FrameworkPropertyMetadata( 
                                        Double.NaN,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(OnTransformDirty)), 
                                new ValidateValueCallback(IsWidthHeightValid));
 
        /// <summary>
        /// Width Property
        /// </summary>
        public double Width 
        { 
            get { return (double) GetValue(WidthProperty); }
            set { SetValue(WidthProperty, value); } 
        }

        /// <summary>
        /// MinWidth Dependency Property 
        /// </summary>
        public static readonly DependencyProperty MinWidthProperty = 
                    DependencyProperty.Register(
                                "MinWidth", 
                                typeof(double),
                                _typeofThis,
                                new FrameworkPropertyMetadata(
                                        0d, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(OnTransformDirty)), 
                                new ValidateValueCallback(IsMinWidthHeightValid)); 

        /// <summary> 
        /// MinWidth Property
        /// </summary>
        public double MinWidth
        { 
            get { return (double) GetValue(MinWidthProperty); } 
            set { SetValue(MinWidthProperty, value); }
        } 

        /// <summary>
        /// MaxWidth Dependency Property
        /// </summary> 
        public static readonly DependencyProperty MaxWidthProperty = 
                    DependencyProperty.Register( 
                                "MaxWidth",
                                typeof(double), 
                                _typeofThis,
                                new FrameworkPropertyMetadata(
                                        Double.PositiveInfinity,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(OnTransformDirty)),
                                new ValidateValueCallback(IsMaxWidthHeightValid)); 
 

        /// <summary> 
        /// MaxWidth Property
        /// </summary>
        public double MaxWidth
        { 
            get { return (double) GetValue(MaxWidthProperty); } 
            set { SetValue(MaxWidthProperty, value); }
        } 

        /// <summary>
        /// Height Dependency Property
        /// </summary> 
        public static readonly DependencyProperty HeightProperty = 
                    DependencyProperty.Register( 
                                "Height",
                                typeof(double), 
                                _typeofThis,
                                new FrameworkPropertyMetadata(
                                    Double.NaN,
                                    FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                    new PropertyChangedCallback(OnTransformDirty)),
                                new ValidateValueCallback(IsWidthHeightValid)); 
 
        /// <summary>
        /// Height Property 
        /// </summary>
        public double Height 
        {
            get { return (double) GetValue(HeightProperty); } 
            set { SetValue(HeightProperty, value); } 
        }
 
        /// <summary>
        /// MinHeight Dependency Property
        /// </summary>
        public static readonly DependencyProperty MinHeightProperty =
                    DependencyProperty.Register( 
                                "MinHeight", 
                                typeof(double),
                                _typeofThis, 
                                new FrameworkPropertyMetadata(
                                        0d,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(OnTransformDirty)), 
                                new ValidateValueCallback(IsMinWidthHeightValid));
 
        /// <summary> 
        /// MinHeight Property
        /// </summary> 
        public double MinHeight
        { 
            get { return (double) GetValue(MinHeightProperty); }
            set { SetValue(MinHeightProperty, value); } 
        } 

        /// <summary> 
        /// MaxHeight Dependency Property
        /// </summary>
        public static readonly DependencyProperty MaxHeightProperty = 
                    DependencyProperty.Register(
                                "MaxHeight", 
                                typeof(double), 
                                _typeofThis,
                                new FrameworkPropertyMetadata( 
                                        Double.PositiveInfinity,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(OnTransformDirty)),
                                new ValidateValueCallback(IsMaxWidthHeightValid)); 

        /// <summary> 
        /// MaxHeight Property 
        /// </summary>
        public double MaxHeight
        {
            get { return (double) GetValue(MaxHeightProperty); } 
            set { SetValue(MaxHeightProperty, value); }
        } 
 
        /// <summary>
        /// FlowDirectionProperty 
        /// </summary>
        public static readonly DependencyProperty FlowDirectionProperty =
                    DependencyProperty.RegisterAttached( 
                                "FlowDirection",
                                typeof(FlowDirection), 
                                _typeofThis, 
                                new FrameworkPropertyMetadata(
                                            System.Windows.FlowDirection.LeftToRight, // default value 
                                            FrameworkPropertyMetadataOptions.Inherits
                                          | FrameworkPropertyMetadataOptions.AffectsParentArrange,
                                            new PropertyChangedCallback(OnFlowDirectionChanged),
                                            new CoerceValueCallback(CoerceFlowDirectionProperty)), 
                                new ValidateValueCallback(IsValidFlowDirection));
 
        //  Since layout applies mirroring based on pair-wise flow direction property value comparison 
        //  of an element and its visual parent and since this does not exactly match property engine's
        //  notion of dirty-ness, the following measures are taken: 
        //  1.  FlowDirectionProperty is made force inherited property.
        //  2.  Invalidation happens during coercion (which is called always unlike behaviour of
        //      flags set in metadata).
        private static object CoerceFlowDirectionProperty(DependencyObject d, object value) 
        {
            FrameworkElement fe = d as FrameworkElement; 
            if (fe != null) 
            {
                fe.InvalidateArrange(); 
                fe.InvalidateVisual();
                fe.AreTransformsClean = false;
            }
            return value; 
        }
 
        private static void OnFlowDirectionChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            // Check that d is a FrameworkElement since the property inherits and this can be called 
            // on non-FEs.
            FrameworkElement fe = d as FrameworkElement;
            if (fe != null)
            { 
                // Cache the new value as a bit to optimize accessing the FlowDirection property's CLR accessor
                fe.IsRightToLeft = ((FlowDirection)e.NewValue) == FlowDirection.RightToLeft; 
                fe.AreTransformsClean = false; 
            }
        } 

        /// <summary>
        /// FlowDirection Property
        /// </summary> 
        public FlowDirection FlowDirection 
        { 
            get { return IsRightToLeft ? FlowDirection.RightToLeft : FlowDirection.LeftToRight; }
            set { SetValue(FlowDirectionProperty, value); } 
        }

        /// <summary>
        /// Queries the attached property FlowDirection from the given element. 
        /// </summary>
        /// <seealso cref="DockPanel.DockProperty" /> 
        public static FlowDirection GetFlowDirection(DependencyObject element) 
        {
            if (element == null) { throw new ArgumentNullException("element"); } 
            return (FlowDirection)element.GetValue(FlowDirectionProperty);
        }

        /// <summary> 
        /// Writes the attached property FlowDirection to the given element.
        /// </summary> 
        /// <seealso cref="DockPanel.DockProperty" /> 
        public static void SetFlowDirection(DependencyObject element, FlowDirection value)
        { 
            if (element == null) { throw new ArgumentNullException("element"); }
            element.SetValue(FlowDirectionProperty, value);
        }
 
        /// <summary>
        /// Validates the flow direction property values 
        /// </summary> 
        private static bool IsValidFlowDirection(object o)
        { 
            FlowDirection value = (FlowDirection)o;
            return value == FlowDirection.LeftToRight || value == FlowDirection.RightToLeft;
        }
 
        /// <summary>
        /// MarginProperty 
        /// </summary> 
        public static readonly DependencyProperty MarginProperty 
            = DependencyProperty.Register("Margin", typeof(Thickness), _typeofThis,
                                          new FrameworkPropertyMetadata(
                                                new Thickness(),
                                                FrameworkPropertyMetadataOptions.AffectsMeasure), 
                                          new ValidateValueCallback(IsMarginValid));
 
        private static bool IsMarginValid(object value) 
        {
            Thickness m = (Thickness)value; 
            return m.IsValid(true, false, true, false);
        }

 
        /// <summary>
        /// Margin Property 
        /// </summary> 
        public Thickness Margin
        { 
            get { return (Thickness) GetValue(MarginProperty); }
            set { SetValue(MarginProperty, value); }
        }
 
        //
        //  Properties overrides are needed only to discourage usage in old layout. 
        // 

        /// <summary> 
        /// HorizontalAlignment Dependency Property.
        /// </summary>
        public static readonly DependencyProperty HorizontalAlignmentProperty = 
                    DependencyProperty.Register(
                                "HorizontalAlignment", 
                                typeof(HorizontalAlignment), 
                                _typeofThis,
                                new FrameworkPropertyMetadata( 
                                            HorizontalAlignment.Stretch,
                                            FrameworkPropertyMetadataOptions.AffectsArrange),
                                new ValidateValueCallback(ValidateHorizontalAlignmentValue));
 
        internal static bool ValidateHorizontalAlignmentValue(object value)
        { 
            HorizontalAlignment ha = (HorizontalAlignment)value; 
            return (    ha == HorizontalAlignment.Left
                    ||  ha == HorizontalAlignment.Center 
                    ||  ha == HorizontalAlignment.Right
                    ||  ha == HorizontalAlignment.Stretch   );
        }
 
        /// <summary>
        /// HorizontalAlignment Property. 
        /// </summary> 
        public HorizontalAlignment HorizontalAlignment
        { 
            get { return (HorizontalAlignment) GetValue(HorizontalAlignmentProperty); }
            set { SetValue(HorizontalAlignmentProperty, value); }
        }
 
        /// <summary>
        /// VerticalAlignment Dependency Property. 
        /// </summary> 
        public static readonly DependencyProperty VerticalAlignmentProperty = 
                    DependencyProperty.Register(
                                "VerticalAlignment",
                                typeof(VerticalAlignment),
                                _typeofThis, 
                                new FrameworkPropertyMetadata(
                                            VerticalAlignment.Stretch, 
                                            FrameworkPropertyMetadataOptions.AffectsArrange), 
                                new ValidateValueCallback(ValidateVerticalAlignmentValue));
 
        internal static bool ValidateVerticalAlignmentValue(object value)
        {
            VerticalAlignment va = (VerticalAlignment)value;
            return (    va == VerticalAlignment.Top 
                    ||  va == VerticalAlignment.Center
                    ||  va == VerticalAlignment.Bottom 
                    ||  va == VerticalAlignment.Stretch); 
        }
 
        /// <summary>
        /// VerticalAlignment Property.
        /// </summary>
        public VerticalAlignment VerticalAlignment 
        {
            get { return (VerticalAlignment) GetValue(VerticalAlignmentProperty); } 
            set { SetValue(VerticalAlignmentProperty, value); } 
        }
 
        // Need a special value here until bug 1016350 is fixed.  KeyboardNavigation
        // treats this as the value to indicate that it should do a resource lookup
        // to find the "real" default value.
        private static Style _defaultFocusVisualStyle = null; 

        internal static Style DefaultFocusVisualStyle 
        { 
            get
            { 
                if (_defaultFocusVisualStyle == null)
                {
                    Style defaultFocusVisualStyle = new Style();
                    defaultFocusVisualStyle.Seal(); 
                    _defaultFocusVisualStyle = defaultFocusVisualStyle;
                } 
 
                return _defaultFocusVisualStyle;
            } 
        }

        /// <summary>
        /// FocusVisualStyleProperty 
        /// </summary>
        public static readonly DependencyProperty FocusVisualStyleProperty = 
                    DependencyProperty.Register( 
                                "FocusVisualStyle",
                                typeof(Style), 
                                _typeofThis,
                                new FrameworkPropertyMetadata(DefaultFocusVisualStyle));

 
        /// <summary>
        /// FocusVisualStyle Property 
        /// </summary> 
        public Style FocusVisualStyle
        { 
            get { return (Style) GetValue(FocusVisualStyleProperty); }
            set { SetValue(FocusVisualStyleProperty, value); }
        }
 
        /// <summary>
        /// CursorProperty 
        /// </summary> 
        public static readonly DependencyProperty CursorProperty =
                    DependencyProperty.Register( 
                                "Cursor",
                                typeof(Cursor),
                                _typeofThis,
                                new FrameworkPropertyMetadata( 
                                            (object) null, // default value
                                            0, 
                                            new PropertyChangedCallback(OnCursorChanged))); 

        /// <summary> 
        /// Cursor Property
        /// </summary>
        public System.Windows.Input.Cursor Cursor
        { 
            get { return (System.Windows.Input.Cursor) GetValue(CursorProperty); }
            set { SetValue(CursorProperty, value); } 
        } 

        // If the cursor is changed, we may need to set the actual cursor. 
        static private void OnCursorChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            FrameworkElement fe = ((FrameworkElement)d);
 
            if(fe.IsMouseOver)
            { 
                Mouse.UpdateCursor(); 
            }
        } 


        /// <summary>
        ///     ForceCursorProperty 
        /// </summary>
        public static readonly DependencyProperty ForceCursorProperty = 
                    DependencyProperty.Register( 
                                "ForceCursor",
                                typeof(bool), 
                                _typeofThis,
                                new FrameworkPropertyMetadata(
                                            BooleanBoxes.FalseBox, // default value
                                            0, 
                                            new PropertyChangedCallback(OnForceCursorChanged)));
 
 
        /// <summary>
        ///     ForceCursor Property 
        /// </summary>
        public bool ForceCursor
        {
            get { return (bool) GetValue(ForceCursorProperty); } 
            set { SetValue(ForceCursorProperty, BooleanBoxes.Box(value)); }
        } 
 
        // If the ForceCursor property changed, we may need to set the actual cursor.
        static private void OnForceCursorChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            FrameworkElement fe = ((FrameworkElement)d);

            if(fe.IsMouseOver) 
            {
                Mouse.UpdateCursor(); 
            } 
        }
 
        private static void OnQueryCursorOverride(object sender, QueryCursorEventArgs e)
        {
            FrameworkElement fe = (FrameworkElement) sender;
 
            // We respond to querying the cursor by specifying the cursor set
            // as a property on this element. 
            Cursor cursor = fe.Cursor; 

            if(cursor != null) 
            {
                // We specify the cursor if the QueryCursor event is not
                // handled by the time it gets to us, or if we are configured
                // to force our cursor anyways.  Since the QueryCursor event 
                // bubbles, this has the effect of overriding whatever cursor
                // a child of ours specified. 
                if(!e.Handled || fe.ForceCursor) 
                {
                    e.Cursor = cursor; 
                    e.Handled = true;
                }
            }
        } 


        /// <summary> 
        /// Helper method to read and return flow direction property value for a given visual. 
        /// </summary>
        /// <param name="visual">Visual to get flow direction for.</param> 
        /// <returns>Flow direction property value.</returns>
        private static FlowDirection GetFlowDirectionFromVisual(DependencyObject visual)
        {
            FlowDirection flowDirection = FlowDirection.LeftToRight; 

            for (DependencyObject v = visual; v != null; v = VisualTreeHelper.GetParent(v)) 
            { 
                FrameworkElement fe = v as FrameworkElement;
                if (fe != null) 
                {
                    flowDirection = fe.FlowDirection;
                    break;
                } 
                else
                { 
                    // Try to get value from Visual. 
                    // ContentHost, when processing ContentElements with changing FlowDirection
                    // property value, will create a Visual and set FlowDirectionProperty on it. 
                    // For this reason need to take into account Visuals with local value set
                    // for FlowDirectionProperty.
                    object flowDirectionValue = v.ReadLocalValue(FlowDirectionProperty);
                    if (flowDirectionValue != DependencyProperty.UnsetValue) 
                    {
                        flowDirection = (FlowDirection)flowDirectionValue; 
                        break; 
                    }
                } 
            }

            return (flowDirection);
        } 

        /// <summary> 
        /// Override for <seealso cref="UIElement.MeasureCore" />.
        /// </summary> 
        protected sealed override Size MeasureCore(Size availableSize) 
        {
        }

        /// <summary>
        /// Override for <seealso cref="UIElement.ArrangeCore" />. 
        /// </summary>
        protected sealed override void ArrangeCore(Rect finalRect) 
        { 
        }

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
        protected virtual Size MeasureOverride(Size availableSize)
        { 
            return new Size(0,0); 
        }
 
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
        protected virtual Size ArrangeOverride(Size finalSize)
        { 
            return finalSize;
        } 
        // Keyboard 
 
        /// <summary>
        ///     Request to move the focus from this element to another element 
        /// </summary>
        /// <param name="request">
        ///     The direction that focus is to move.
        /// </param> 
        /// <returns> Returns true if focus is moved successfully. Returns false if there is no next element</returns>
        public sealed override bool MoveFocus(TraversalRequest request) 
        { 
            if (request == null)
            { 
                throw new ArgumentNullException("request");
            }

            return KeyboardNavigation.Current.Navigate(this, request); 
        }
 
        /// <summary> 
        ///     Request to predict the element that should receive focus relative to this element for a
        /// given direction, without actually moving focus to it. 
        /// </summary>
        /// <param name="direction">The direction for which focus should be predicted</param>
        /// <returns>
        ///     Returns the next element that focus should move to for a given FocusNavigationDirection. 
        /// Returns null if focus cannot be moved relative to this element.
        /// </returns> 
        public sealed override DependencyObject PredictFocus(FocusNavigationDirection direction) 
        {
            return KeyboardNavigation.Current.PredictFocusedElement(this, direction); 
        }

        private static void OnPreviewGotKeyboardFocus(object sender, KeyboardFocusChangedEventArgs e)
        { 
            if (e.OriginalSource == sender)
            { 
                FrameworkElement fe = (FrameworkElement)sender; 

                // If element has an FocusedElement we need to delegate focus to it 
                // and handle the event if focus successfully delegated
                IInputElement activeElement = FocusManager.GetFocusedElement(fe, true);
                if (activeElement != null && activeElement != sender && Keyboard.IsFocusable(activeElement as DependencyObject))
                { 
                    IInputElement oldFocus = Keyboard.FocusedElement;
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
 
        private static void OnGotKeyboardFocus(object sender, KeyboardFocusChangedEventArgs e)
        { 
            // This static class handler will get hit each time anybody gets hit with a tunnel that someone is getting focused.
            // We're only interested when the element is getting focused is processing the event.
            // NB: This will not do the right thing if the element rejects focus or does not want to be scrolled into view.
            if (sender == e.OriginalSource) 
            {
                FrameworkElement fe = (FrameworkElement)sender; 
                KeyboardNavigation.UpdateFocusedElement(fe); 

                KeyboardNavigation keyNav = KeyboardNavigation.Current; 
                KeyboardNavigation.ShowFocusVisual();
                keyNav.NotifyFocusChanged(fe, e);
                keyNav.UpdateActiveElement(fe);
            } 
        }
 
        private static void OnLostKeyboardFocus(object sender, KeyboardFocusChangedEventArgs e) 
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

        /// <summary>
        ///     This method is invoked when the IsFocused property changes to true
        /// </summary> 
        /// <param name="e">RoutedEventArgs</param>
        protected override void OnGotFocus(RoutedEventArgs e) 
        { 
            if (IsKeyboardFocused)
                BringIntoView(); 

            base.OnGotFocus(e);
        }
 
        /// <summary> 
        ///     Initialization of this element is about to begin
        /// </summary>
        public virtual void BeginInit()
        { 
            // Nested BeginInits on the same instance aren't permitted
            if (ReadInternalFlag(InternalFlags.InitPending)) 
            { 
                throw new InvalidOperationException(SR.Get(SRID.NestedBeginInitNotSupported));
            } 

            // Mark the element as pending initialization
            WriteInternalFlag(InternalFlags.InitPending, true);
        } 

        /// <summary> 
        ///     Initialization of this element has completed 
        /// </summary>
        public virtual void EndInit() 
        {
            // Every EndInit must be preceeded by a BeginInit
            if (!ReadInternalFlag(InternalFlags.InitPending))
            { 
                throw new InvalidOperationException(SR.Get(SRID.EndInitWithoutBeginInitNotSupported));
            } 
 
            // Reset the pending flag
            WriteInternalFlag(InternalFlags.InitPending, false); 

            // Mark the element initialized and fire Initialized event
            // (eg. tree building via parser)
            TryFireInitialized(); 
        }
 
        /// <summary> 
        ///     Has this element been initialized
        /// </summary> 
        /// <remarks>
        ///     True if either EndInit or OnParentChanged were called
        /// </remarks>
        public bool IsInitialized
        { 
            get { return ReadInternalFlag(InternalFlags.IsInitialized); } 
        }
 
        /// <summary>
        ///     Initialized private key
        /// </summary>
        internal static readonly EventPrivateKey InitializedKey = new EventPrivateKey(); 

        /// <summary> 
        ///     This clr event is fired when 
        ///     <see cref="IsInitialized"/>
        ///     becomes true 
        /// </summary>
        public event EventHandler Initialized
        { 
            add { EventHandlersStoreAdd(InitializedKey, value); }
            remove { EventHandlersStoreRemove(InitializedKey, value); } 
        } 

        /// <summary> 
        ///     This virtual method in called when IsInitialized is set to true and it raises an Initialized event
        /// </summary>
        protected virtual void OnInitialized(EventArgs e)
        { 
            // Need to update the StyleProperty so that we can pickup
            // the implicit style if it hasn't already been fetched 
            if (!HasStyleEverBeenFetched) 
            {
                UpdateStyleProperty(); 
            }

            // Need to update the ThemeStyleProperty so that we can pickup
            // the implicit style if it hasn't already been fetched 
            if (!HasThemeStyleEverBeenFetched)
            { 
                UpdateThemeStyleProperty(); 
            }
 
            RaiseInitialized(InitializedKey, e);
        }

        // Helper method that tries to set IsInitialized to true 
        // and Fire the Initialized event
        // This method can be invoked from two locations 
        //      1> EndInit 
        //      2> OnParentChanged
        private void TryFireInitialized() 
        {
            if (!ReadInternalFlag(InternalFlags.InitPending) &&
                !ReadInternalFlag(InternalFlags.IsInitialized))
            { 
                WriteInternalFlag(InternalFlags.IsInitialized, true);
 
                // Do instance initialization outside of the OnInitialized virtual 
                // to make sure that:
                // 1) We avoid attaching instance handlers to FrameworkElement 
                //    (instance handlers are expensive).
                // 2) If a derived class forgets to call base OnInitialized,
                //    this work will still happen.
                PrivateInitialized(); 

                OnInitialized(EventArgs.Empty); 
            } 
        }
 
        // Helper method to retrieve and fire Clr Event handlers for Initialized event
        private void RaiseInitialized(EventPrivateKey key, EventArgs e)
        {
            EventHandlersStore store = EventHandlersStore; 
            if (store != null)
            { 
                Delegate handler = store.Get(key); 
                if (handler != null)
                { 
                    ((EventHandler)handler)(this, e);
                }
            }
        } 

 
        private static void NumberSubstitutionChanged(DependencyObject o, DependencyPropertyChangedEventArgs e)
        {
            ((FrameworkElement) o).HasNumberSubstitutionChanged = true;
        } 

        // Returns true when the coerce callback should return the current system metric 
        private static bool ShouldUseSystemFont(FrameworkElement fe, DependencyProperty dp) 
        {
            bool hasModifiers; 

            // Return the current system font when (changing the system theme OR creating an element and the default is outdated)
            // AND the element is a root AND the element has not had a value set on it by the user
            return  (SystemResources.SystemResourcesAreChanging || (fe.ReadInternalFlag(InternalFlags.CreatingRoot) && SystemResources.SystemResourcesHaveChanged)) && 
                     fe._parent == null && VisualTreeHelper.GetParent(fe) == null &&
                     fe.GetValueSource(dp, null, out hasModifiers) == BaseValueSourceInternal.Default; 
        } 

        // Coerce Font properties on root elements when created or System resources change 
        private static object CoerceFontFamily(DependencyObject o, object value)
        {
            // For root elements with default values, return current system metric if local value has not been set
            if (ShouldUseSystemFont((FrameworkElement)o, TextElement.FontFamilyProperty)) 
            {
                return SystemFonts.MessageFontFamily; 
            } 

            return value; 
        }

        private static object CoerceFontSize(DependencyObject o, object value)
        { 
            // For root elements with default values, return current system metric if local value has not been set
            if (ShouldUseSystemFont((FrameworkElement)o, TextElement.FontSizeProperty)) 
            { 
                return SystemFonts.MessageFontSize;
            } 

            return value;
        }
 
        private static object CoerceFontStyle(DependencyObject o, object value)
        { 
            // For root elements with default values, return current system metric if local value has not been set 
            if (ShouldUseSystemFont((FrameworkElement)o, TextElement.FontStyleProperty))
            { 
                return SystemFonts.MessageFontStyle;
            }

            return value; 
        }
 
        private static object CoerceFontWeight(DependencyObject o, object value) 
        {
            // For root elements with default values, return current system metric if local value has not been set 
            if (ShouldUseSystemFont((FrameworkElement)o, TextElement.FontWeightProperty))
            {
                return SystemFonts.MessageFontWeight;
            } 

            return value; 
        } 

 
        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary> 
        internal static readonly DependencyPropertyKey LoadedPendingPropertyKey =
                    DependencyProperty.RegisterReadOnly( 
                                "LoadedPending",
                                typeof(object[]),
                                _typeofThis,
                                new PropertyMetadata(null)); // default value 

        /// <summary> 
        ///     This DP is set on the root of a sub-tree that is about to receive a broadcast Loaded event 
        ///     This DP is cleared when the Loaded event is either fired or cancelled for some reason
        /// </summary> 
        internal static readonly DependencyProperty LoadedPendingProperty =
            LoadedPendingPropertyKey.DependencyProperty;

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
        internal static readonly DependencyPropertyKey UnloadedPendingPropertyKey = 
                    DependencyProperty.RegisterReadOnly(
                                "UnloadedPending", 
                                typeof(object[]),
                                _typeofThis,
                                new PropertyMetadata(null)); // default value
 
        /// <summary>
        ///     This DP is set on the root of a sub-tree that is about to receive a broadcast Unloaded event 
        ///     This DP is cleared when the Unloaded event is either fired or cancelled for some reason 
        /// </summary>
        internal static readonly DependencyProperty UnloadedPendingProperty = 
            UnloadedPendingPropertyKey.DependencyProperty;

        /// <summary>
        ///     Turns true when this element is attached to a tree and is laid out and rendered. 
        ///     Turns false when the element gets detached from a loaded tree
        /// </summary> 
        public bool IsLoaded 
        {
            get 
            {
                object[] loadedPending = LoadedPending;
                object[] unloadedPending = UnloadedPending;
 
                if (loadedPending == null && unloadedPending == null)
                { 
                    // The HasHandler flags are used for validation of the IsLoaded flag 
                    if (SubtreeHasLoadedChangeHandler)
                    { 
                        // The IsLoaded flag is valid
                        return IsLoadedCache;
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
        } 

        /// <summary> 
        ///     Loaded RoutedEvent
        /// </summary>
        public static readonly RoutedEvent LoadedEvent = EventManager.RegisterRoutedEvent("Loaded", RoutingStrategy.Direct, typeof(RoutedEventHandler), _typeofThis);
 
        /// <summary>
        ///     This event is fired when the element is laid out, rendered and ready for interaction 
        /// </summary> 
        public event RoutedEventHandler Loaded
        { 
            add
            {
                AddHandler(LoadedEvent, value, false);
            } 
            remove
            { 
                RemoveHandler(LoadedEvent, value); 
            }
        } 

        /// <summary>
        ///     Notifies subclass of a new routed event handler.  Note that this is
        ///     called once for each handler added, but OnRemoveHandler is only called 
        ///     on the last removal.
        /// </summary> 
        internal override void OnAddHandler( 
            RoutedEvent routedEvent,
            Delegate handler) 
        {
            base.OnAddHandler(routedEvent, handler);

            if (routedEvent == LoadedEvent || routedEvent == UnloadedEvent) 
            {
                BroadcastEventHelper.AddHasLoadedChangeHandlerFlagInAncestry(this); 
            } 
        }
 

        /// <summary>
        ///     Notifies subclass of an event for which a handler has been removed.
        /// </summary> 
        internal override void OnRemoveHandler(
            RoutedEvent routedEvent, 
            Delegate handler) 
        {
            base.OnRemoveHandler(routedEvent, handler); 

            // We only care about Loaded & Unloaded events
            if (routedEvent != LoadedEvent && routedEvent != UnloadedEvent)
                return; 

            if (!ThisHasLoadedChangeEventHandler) 
            { 
                BroadcastEventHelper.RemoveHasLoadedChangeHandlerFlagInAncestry(this);
            } 
        }


        /// <summary> 
        ///     Helper that will set the IsLoaded flag and Raise the Loaded event
        /// </summary> 
        internal void OnLoaded(RoutedEventArgs args) 
        {
            RaiseEvent(args); 
        }

        /// <summary>
        ///     Unloaded private key 
        /// </summary>
        public static readonly RoutedEvent UnloadedEvent = EventManager.RegisterRoutedEvent("Unloaded", RoutingStrategy.Direct, typeof(RoutedEventHandler), _typeofThis); 
 
        /// <summary>
        ///     This clr event is fired when this element is detached form a loaded tree 
        /// </summary>
        public event RoutedEventHandler Unloaded
        {
            add 
            {
                AddHandler(UnloadedEvent, value, false); 
            } 
            remove
            { 
                RemoveHandler(UnloadedEvent, value);
            }
        }
 
        /// <summary>
        ///     Helper that will reset the IsLoaded flag and Raise the Unloaded event 
        /// </summary> 
        internal void OnUnloaded(RoutedEventArgs args)
        { 
            RaiseEvent(args);
        }

 
        // Add synchronized input handler for templated parent.
        internal override void AddSynchronizedInputPreOpportunityHandlerCore(EventRoute route, RoutedEventArgs args) 
        { 
            UIElement uiElement = this._templatedParent as UIElement;
            if (uiElement != null) 
            {
                uiElement.AddSynchronizedInputPreOpportunityHandler(route, args);
            }
 
        }
 
 
        // Helper method to retrieve and fire Clr Event handlers
        internal void RaiseClrEvent(EventPrivateKey key, EventArgs args) 
        {
            EventHandlersStore store = EventHandlersStore;
            if (store != null)
            { 
                Delegate handler = store.Get(key);
                if (handler != null) 
                { 
                    ((EventHandler)handler)(this, args);
                } 
            }
        }

        // This is part of an optimization to avoid accessing thread local storage
        // and thread apartment state multiple times. 
        private class FrameworkServices
        {
            internal FrameworkServices()
            { 
                // STA Requirement are checked in InputManager cctor where InputManager.Current is used in KeyboardNavigation cctor
                _keyboardNavigation = new KeyboardNavigation(); 
                _popupControlService = new PopupControlService(); 
            }
 
            internal KeyboardNavigation _keyboardNavigation;
            internal PopupControlService _popupControlService;
        }
 
        internal static PopupControlService PopupControlService
        { 
            get 
            {
                return EnsureFrameworkServices()._popupControlService; 
            }
        }

 
        internal static KeyboardNavigation KeyboardNavigation
        { 
            get 
            {
                return EnsureFrameworkServices()._keyboardNavigation; 
            }
        }

        private static FrameworkServices EnsureFrameworkServices() 
        {
            if ((_frameworkServices == null)) 
            { 
                // Enable KeyboardNavigation, ContextMenu, and ToolTip services.
                 _frameworkServices = new FrameworkServices(); 
            }

            return _frameworkServices;
        } 

        /// <summary> 
        ///     The DependencyProperty for the ToolTip property 
        /// </summary>
        public static readonly DependencyProperty ToolTipProperty = 
            ToolTipService.ToolTipProperty.AddOwner(_typeofThis);

        /// <summary>
        ///     The ToolTip for the element. 
        ///     If the value is of type ToolTip, then that is the ToolTip that will be used.
        ///     If the value is of any other type, then that value will be used 
        ///     as the content for a ToolTip provided by the system. Refer to ToolTipService 
        ///     for attached properties to customize the ToolTip.
        /// </summary> 
        public object ToolTip
        { 
            get
            { 
                return ToolTipService.GetToolTip(this); 
            }
 
            set
            {
                ToolTipService.SetToolTip(this, value);
            } 
        }
 
 
        /// <summary>
        /// The DependencyProperty for the Contextmenu property 
        /// </summary>
        public static readonly DependencyProperty ContextMenuProperty =
            ContextMenuService.ContextMenuProperty.AddOwner(
                        _typeofThis, 
                        new FrameworkPropertyMetadata((ContextMenu) null));
 
        /// <summary> 
        /// The ContextMenu data set on this element. Can be any type that can be converted to a UIElement.
        /// </summary> 
        public ContextMenu ContextMenu
        {
            get
            { 
                return GetValue(ContextMenuProperty) as ContextMenu;
            } 
 
            set
            { 
                SetValue(ContextMenuProperty, value);
            }
        }
 
        /// <summary>
        ///     The RoutedEvent for the ToolTipOpening event. 
        /// </summary> 
        public static readonly RoutedEvent ToolTipOpeningEvent = ToolTipService.ToolTipOpeningEvent.AddOwner(_typeofThis);
 
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
        public event ToolTipEventHandler ToolTipOpening 
        {
            add { AddHandler(ToolTipOpeningEvent, value); } 
            remove { RemoveHandler(ToolTipOpeningEvent, value); } 
        }
 
        private static void OnToolTipOpeningThunk(object sender, ToolTipEventArgs e)
        {
            ((FrameworkElement)sender).OnToolTipOpening(e);
        } 

        /// <summary> 
        ///     Called when the ToolTipOpening event fires. 
        ///     Allows subclasses to add functionality without having to attach
        ///     an individual handler. 
        /// </summary>
        /// <param name="e">Event arguments</param>
        protected virtual void OnToolTipOpening(ToolTipEventArgs e)
        { 
        }
 
        /// <summary> 
        ///     The RoutedEvent for the ToolTipClosing event.
        /// </summary> 
        public static readonly RoutedEvent ToolTipClosingEvent = ToolTipService.ToolTipClosingEvent.AddOwner(_typeofThis);

        /// <summary>
        ///     An event that fires just before a ToolTip should be closed. 
        ///     This event will only fire if there was a preceding ToolTipOpening event.
        /// 
        ///     To manually close a ToolTip and not use the system behavior, mark this event as handled. 
        /// </summary>
        public event ToolTipEventHandler ToolTipClosing 
        {
            add { AddHandler(ToolTipClosingEvent, value); }
            remove { RemoveHandler(ToolTipClosingEvent, value); }
        } 

        private static void OnToolTipClosingThunk(object sender, ToolTipEventArgs e) 
        { 
            ((FrameworkElement)sender).OnToolTipClosing(e);
        } 

        /// <summary>
        ///     Called when the ToolTipClosing event fires.
        ///     Allows subclasses to add functionality without having to attach 
        ///     an individual handler.
        /// </summary> 
        /// <param name="e">Event arguments</param> 
        protected virtual void OnToolTipClosing(ToolTipEventArgs e)
        { 
        }

        /// <summary>
        ///     RoutedEvent for the ContextMenuOpening event. 
        /// </summary>
        public static readonly RoutedEvent ContextMenuOpeningEvent = ContextMenuService.ContextMenuOpeningEvent.AddOwner(_typeofThis); 
 
        /// <summary>
        ///     An event that fires just before a ContextMenu should be opened. 
        ///
        ///     To manually open and close ContextMenus, mark this event as handled.
        ///     Otherwise, the value of the the ContextMenu property will be used
        ///     to automatically open a ContextMenu. 
        /// </summary>
        public event ContextMenuEventHandler ContextMenuOpening 
        { 
            add { AddHandler(ContextMenuOpeningEvent, value); }
            remove { RemoveHandler(ContextMenuOpeningEvent, value); } 
        }

        private static void OnContextMenuOpeningThunk(object sender, ContextMenuEventArgs e)
        { 
            ((FrameworkElement)sender).OnContextMenuOpening(e);
        } 
 
        /// <summary>
        ///     Called when ContextMenuOpening is raised on this element. 
        /// </summary>
        /// <param name="e">Event arguments</param>
        protected virtual void OnContextMenuOpening(ContextMenuEventArgs e)
        { 
        }
 
        /// <summary> 
        ///     RoutedEvent for the ContextMenuClosing event.
        /// </summary> 
        public static readonly RoutedEvent ContextMenuClosingEvent = ContextMenuService.ContextMenuClosingEvent.AddOwner(_typeofThis);

        /// <summary>
        ///     An event that fires just as a ContextMenu closes. 
        /// </summary>
        public event ContextMenuEventHandler ContextMenuClosing 
        { 
            add { AddHandler(ContextMenuClosingEvent, value); }
            remove { RemoveHandler(ContextMenuClosingEvent, value); } 
        }

        private static void OnContextMenuClosingThunk(object sender, ContextMenuEventArgs e)
        { 
            ((FrameworkElement)sender).OnContextMenuClosing(e);
        } 
 
        /// <summary>
        ///     Called when ContextMenuClosing is raised on this element. 
        /// </summary>
        /// <param name="e">Event arguments</param>
        protected virtual void OnContextMenuClosing(ContextMenuEventArgs e)
        { 
        }
 
        // Helper method to retrieve and fire Clr Event handlers for DependencyPropertyChanged event
        private void RaiseDependencyPropertyChanged(EventPrivateKey key, DependencyPropertyChangedEventArgs args)
        { 
            EventHandlersStore store = EventHandlersStore;
            if (store != null) 
            { 
                Delegate handler = store.Get(key);
                if (handler != null) 
                {
                    ((DependencyPropertyChangedEventHandler)handler)(this, args);
                }
            } 
        }
 
        internal static void AddIntermediateElementsToRoute( 
            DependencyObject mergePoint,
            EventRoute route, 
            RoutedEventArgs args,
            DependencyObject modelTreeNode)
        {
            while (modelTreeNode != null && modelTreeNode != mergePoint) 
            {
                UIElement uiElement = modelTreeNode as UIElement; 
                ContentElement contentElement = modelTreeNode as ContentElement; 
                UIElement3D uiElement3D = modelTreeNode as UIElement3D;
 
                if(uiElement != null)
                {
                    uiElement.AddToEventRoute(route, args);
 
                    FrameworkElement fe = uiElement as FrameworkElement;
                    if (fe != null) 
                    { 
                        AddStyleHandlersToEventRoute(fe, null, route, args);
                    } 
                }
                else if (contentElement != null)
                {
                    contentElement.AddToEventRoute(route, args); 

                    FrameworkContentElement fce = contentElement as FrameworkContentElement; 
                    if (fce != null) 
                    {
                        AddStyleHandlersToEventRoute(null, fce, route, args); 
                    }
                }
                else if (uiElement3D != null)
                { 
                    uiElement3D.AddToEventRoute(route, args);
                } 
 
                // Get model parent
                modelTreeNode = LogicalTreeHelper.GetParent(modelTreeNode); 
            }
        }

        // Returns if the given child instance is a logical descendent 
        private bool IsLogicalDescendent(DependencyObject child)
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
        } 

        internal void EventHandlersStoreAdd(EventPrivateKey key, Delegate handler)
        {
            EnsureEventHandlersStore(); 
            EventHandlersStore.Add(key, handler);
        } 
 
        internal void EventHandlersStoreRemove(EventPrivateKey key, Delegate handler)
        { 
            EventHandlersStore store = EventHandlersStore;
            if (store != null)
            {
                store.Remove(key, handler); 
            }
        } 
 
        // Gettor and Settor for flag that indicates if this
        // instance has some property values that are 
        // set to a resource reference
        internal bool HasResourceReference
        {
            get { return ReadInternalFlag(InternalFlags.HasResourceReferences); } 
            set { WriteInternalFlag(InternalFlags.HasResourceReferences, value); }
        } 
 
        internal bool IsLogicalChildrenIterationInProgress
        { 
            get { return ReadInternalFlag(InternalFlags.IsLogicalChildrenIterationInProgress); }
            set { WriteInternalFlag(InternalFlags.IsLogicalChildrenIterationInProgress, value); }
        }
 
        internal bool InVisibilityCollapsedTree
        { 
            get { return ReadInternalFlag(InternalFlags.InVisibilityCollapsedTree); } 
            set { WriteInternalFlag(InternalFlags.InVisibilityCollapsedTree, value); }
        } 

        internal bool SubtreeHasLoadedChangeHandler
        {
            get { return ReadInternalFlag2(InternalFlags2.TreeHasLoadedChangeHandler); } 
            set { WriteInternalFlag2(InternalFlags2.TreeHasLoadedChangeHandler, value); }
        } 
 
        internal bool IsLoadedCache
        { 
            get { return ReadInternalFlag2(InternalFlags2.IsLoadedCache); }
            set { WriteInternalFlag2(InternalFlags2.IsLoadedCache, value); }
        }
 
        internal bool IsParentAnFE
        { 
            get { return ReadInternalFlag2(InternalFlags2.IsParentAnFE); } 
            set { WriteInternalFlag2(InternalFlags2.IsParentAnFE, value); }
        } 

        internal bool IsTemplatedParentAnFE
        {
            get { return ReadInternalFlag2(InternalFlags2.IsTemplatedParentAnFE); } 
            set { WriteInternalFlag2(InternalFlags2.IsTemplatedParentAnFE, value); }
        } 
 
        internal bool HasLogicalChildren
        { 
            get { return ReadInternalFlag(InternalFlags.HasLogicalChildren); }
            set { WriteInternalFlag(InternalFlags.HasLogicalChildren, value); }
        }


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
        // NOTE: TemplateChildIndex is stored in the low bits of _flags2
        internal int TemplateChildIndex 
        { 
            get
            { 
                uint childIndex = (((uint)_flags2) & 0xFFFF);
                if (childIndex == 0xFFFF)
                {
                    return -1; 
                }
                else 
                { 
                    return (int)childIndex;
                } 
            }
            set
            {
                // We store TemplateChildIndex as a 16-bit integer with 0xFFFF meaning "-1". 
                // Thus we support any indices in the range [-1, 65535).
                if (value < -1 || value >= 0xFFFF) 
                { 
                    throw new ArgumentOutOfRangeException("value", SR.Get(SRID.TemplateChildIndexOutOfRange));
                } 

                uint childIndex = (value == -1) ? 0xFFFF : (uint)value;

                _flags2 = (InternalFlags2)(childIndex | (((uint)_flags2) & 0xFFFF0000)); 
            }
        } 
 
        internal bool IsRequestingExpression
        { 
            get { return ReadInternalFlag2(InternalFlags2.IsRequestingExpression); }
            set { WriteInternalFlag2(InternalFlags2.IsRequestingExpression, value); }
        }
 
        internal bool BypassLayoutPolicies
        { 
            get { return ReadInternalFlag2(InternalFlags2.BypassLayoutPolicies); } 
            set { WriteInternalFlag2(InternalFlags2.BypassLayoutPolicies, value); }
        } 

        // Extracts the required flag and returns
        // bool to indicate if it is set or unset
        internal bool ReadInternalFlag(InternalFlags reqFlag) 
        {
            return (_flags & reqFlag) != 0; 
        } 

        internal bool ReadInternalFlag2(InternalFlags2 reqFlag) 
        {
            return (_flags2 & reqFlag) != 0;
        }
 
        // Sets or Unsets the required flag based on
        // the bool argument 
        internal void WriteInternalFlag(InternalFlags reqFlag, bool set) 
        {
            if (set) 
            {
                _flags |= reqFlag;
            }
            else 
            {
                _flags &= (~reqFlag); 
            } 
        }
 
        internal void WriteInternalFlag2(InternalFlags2 reqFlag, bool set)
        {
            if (set)
            { 
                _flags2 |= reqFlag;
            } 
            else 
            {
                _flags2 &= (~reqFlag); 
            }
        }

        private static DependencyObjectType ControlDType 
        {
            get 
            { 
                if (_controlDType == null)
                { 
                    _controlDType = DependencyObjectType.FromSystemTypeInternal(typeof(Control));
                }

                return _controlDType; 
            }
        } 
 
        private static DependencyObjectType ContentPresenterDType
        { 
            get
            {
                if (_contentPresenterDType == null)
                { 
                    _contentPresenterDType = DependencyObjectType.FromSystemTypeInternal(typeof(ContentPresenter));
                } 
 
                return _contentPresenterDType;
            } 
        }

        private static DependencyObjectType PageDType
        { 
            get
            { 
                if (_pageDType == null) 
                {
                    _pageDType = DependencyObjectType.FromSystemTypeInternal(typeof(Page)); 
                }

                return _pageDType;
            } 
        }
 
        private static DependencyObjectType PageFunctionBaseDType 
        {
            get 
            {
                if (_pageFunctionBaseDType == null)
                {
                    _pageFunctionBaseDType = DependencyObjectType.FromSystemTypeInternal(typeof(PageFunctionBase)); 
                }
 
                return _pageFunctionBaseDType; 
            }
        } 

        //
        //  This property
        //  1. Finds the correct initial size for the _effectiveValues store on the current DependencyObject 
        //  2. This is a performance optimization
        // 
        internal override int EffectiveValuesInitialSize 
        {
            get { return 7; } 
        }

        // Ratio of screen to layout DPI in x dimension
        internal static double DpiScaleX 
        {
            get 
            { 
                if (SystemParameters.DpiX != 96)
                { 
                    return (double)SystemParameters.DpiX / 96.0;
                }
                return 1.0;
            } 
        }
 
        // Ratio of screen to layout DPI in y dimension 
        internal static double DpiScaleY
        { 
            get
            {
                if (SystemParameters.Dpi != 96)
                { 
                    return (double)SystemParameters.Dpi / 96.0;
                } 
                return 1.0; 
            }
        } 

        // ThemeStyle used only when a ThemeStyleKey is specified (per-instance data in ThemeStyleDataField) 
        private Style _themeStyleCache;
 
        // Layout 
        private static readonly UncommonField<SizeBox> UnclippedDesiredSizeField = new UncommonField<SizeBox>();
        private static readonly UncommonField<LayoutTransformData> LayoutTransformDataField = new UncommonField<LayoutTransformData>(); 

        // Style/Template state (internals maintained by Style, per-instance data in StyleDataField)
        private  Style       _styleCache;
 
        // Resources dictionary
        internal static readonly UncommonField<ResourceDictionary> ResourcesField = new UncommonField<ResourceDictionary>(); 
 
        internal DependencyObject _templatedParent;    // Non-null if this object was created as a result of a Template.VisualTree
        private UIElement _templateChild;                // Non-null if this FE has a child that was created as part of a template. 

        private InternalFlags       _flags     = 0; // Stores Flags (see Flags enum)
        private InternalFlags2      _flags2    = InternalFlags2.Default; // Stores Flags (see Flags enum)
 
        // Optimization, to avoid calling FromSystemType too often
        internal static DependencyObjectType UIElementDType = DependencyObjectType.FromSystemTypeInternal(typeof(UIElement)); 
        private static DependencyObjectType _controlDType = null; 
        private static DependencyObjectType _contentPresenterDType = null;
        private static DependencyObjectType _pageFunctionBaseDType = null; 
        private static DependencyObjectType _pageDType = null;

        // KeyboardNavigation, ContextMenu, and ToolTip
        private static FrameworkServices _frameworkServices;
    }
 
    // LayoutDoubleUtil, uses fixed eps unlike DoubleUtil which uses relative one. 
    // This is more suitable for some layout comparisons because the computation
    // paths in layout may easily be quite long so DoubleUtil method gives a lot of false 
    // results, while bigger absolute deviation is normally harmless in layout.
    // Note that FP noise is a big problem and using any of these compare methods is
    // not a complete solution, but rather the way to reduce the probability
    // of the dramatically bad-looking results. 
    internal static class LayoutDoubleUtil
    { 
        private const double eps = 0.00000153; //more or less random more or less small number 

        internal static bool AreClose(double value1, double value2) 
        {
            if(value1 == value2) return true;

            double diff = value1 - value2; 
            return (diff < eps) && (diff > -eps);
        } 
 
        internal static bool LessThan(double value1, double value2)
        { 
            return (value1 < value2) && !AreClose(value1, value2);
        }
    }
 
    internal enum InternalFlags : uint
    { 
        // Does the instance have ResourceReference properties 
        HasResourceReferences       = 0x00000001,
 
        HasNumberSubstitutionChanged = 0x00000002,

        // Is the style for this instance obtained from a
        // typed-style declared in the Resources 
        HasImplicitStyleFromResources   = 0x00000004,
        InheritanceBehavior0            = 0x00000008, 
        InheritanceBehavior1            = 0x00000010, 
        InheritanceBehavior2            = 0x00000020,
 
        IsStyleUpdateInProgress         = 0x00000040,
        IsThemeStyleUpdateInProgress    = 0x00000080,
        StoresParentTemplateValues     = 0x00000100,
 
        // free bit = 0x00000200,
        NeedsClipBounds             = 0x00000400, 
 
        HasWidthEverChanged        = 0x00000800,
        HasHeightEverChanged        = 0x00001000, 
        // free bit = 0x00002000,
        // free bit = 0x00004000,

        // Has this instance been initialized 
        IsInitialized               = 0x00008000,
 
        // Set on BeginInit and reset on EndInit 
        InitPending                 = 0x00010000,
 
        IsResourceParentValid       = 0x00020000,
        // free bit                     0x00040000,

        // This flag is set to true when this FrameworkElement is in the middle 
        //  of an invalidation storm caused by InvalidateTree for ancestor change,
        //  so we know not to trigger another one. 
        AncestorChangeInProgress    = 0x00080000, 

        // This is used when we know that we're in a subtree whose visibility 
        //  is collapsed.  A false here does not indicate otherwise.  A false
        //  merely indicates "we don't know".
        InVisibilityCollapsedTree   = 0x00100000,
 
        HasStyleEverBeenFetched         = 0x00200000,
        HasThemeStyleEverBeenFetched    = 0x00400000, 
 
        HasLocalStyle                    = 0x00800000,
 
        // This instance's Visual or logical Tree was generated by a Template
        HasTemplateGeneratedSubTree    = 0x01000000,

        // free bit   = 0x02000000, 

        HasLogicalChildren                    = 0x04000000, 
 
        // Are we in the process of iterating the logical children.
        // This flag is set during a descendents walk, for property invalidation. 
        IsLogicalChildrenIterationInProgress   = 0x08000000,

        //Are we creating a new root after system metrics have changed?
        CreatingRoot                 = 0x10000000, 

        // FlowDirection is set to RightToLeft (0 == LeftToRight, 1 == RightToLeft) 
        // This is an optimization to speed reading the FlowDirection property 
        IsRightToLeft               = 0x20000000,
 
        ShouldLookupImplicitStyles  = 0x40000000,

        // This flag is set to true there are mentees listening to either the
        // InheritedPropertyChanged event or the ResourcesChanged event. Once 
        // this flag is set to true it does not get reset after that.
 
        PotentiallyHasMentees        = 0x80000000, 
    }
 
    [Flags]
    internal enum InternalFlags2 : uint
    {
        // RESERVED: Bits 0-15  (0x0000FFFF): TemplateChildIndex 
        R0                          = 0x00000001,
        R1                          = 0x00000002, 
        R2                          = 0x00000004, 
        R3                          = 0x00000008,
        R4                          = 0x00000010, 
        R5                          = 0x00000020,
        R6                          = 0x00000040,
        R7                          = 0x00000080,
        R8                          = 0x00000100, 
        R9                          = 0x00000200,
        RA                          = 0x00000400, 
        RB                          = 0x00000800, 
        RC                          = 0x00001000,
        RD                          = 0x00002000, 
        RE                          = 0x00004000,
        RF                          = 0x00008000,

        // free bit                 = 0x00010000, 
        // free bit                 = 0x00020000,
        // free bit                 = 0x00040000, 
        // free bit                 = 0x00080000, 

        TreeHasLoadedChangeHandler  = 0x00100000, 
        IsLoadedCache               = 0x00200000,
        IsStyleSetFromGenerator     = 0x00400000,
        IsParentAnFE                = 0x00800000,
        IsTemplatedParentAnFE       = 0x01000000, 
        HasStyleChanged             = 0x02000000,
        HasTemplateChanged          = 0x04000000, 
        HasStyleInvalidated         = 0x08000000, 
        IsRequestingExpression      = 0x10000000,
        HasMultipleInheritanceContexts = 0x20000000, 

        // free bit                 = 0x40000000,
        BypassLayoutPolicies        = 0x80000000,
 
        // Default is so that the default value of TemplateChildIndex
        // (which is stored in the low 16 bits) can be 0xFFFF (interpreted to be -1). 
        Default                     = 0x0000FFFF, 

    } 
}
