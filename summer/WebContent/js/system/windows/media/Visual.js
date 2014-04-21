/**
 * Visual
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyObject", "media/VisualFlags", "media/AncestorChangedEventArgs",
        "windows/UncommonField"], 
		function(declare, Type, DependencyObject, VisualFlags, AncestorChangedEventArgs,
				UncommonField){
	var Visual = declare("Visual", DependencyObject,{
		constructor:function( ){
			this._parent = null;
		},

        /// <summary>
        ///   Derived class must implement to support Visual children. The method must return
        ///    the child at the specified index. Index must be between 0 and GetVisualChildrenCount-1. 
        ///
        ///    By default a Visual does not have any children. 
        /// 
        ///  Remark:
        ///       Need to lock down Visual tree during the callbacks. 
        ///       During this virtual call it is not valid to modify the Visual tree.
        ///
        ///       It is okay to type this protected API to the 2D Visual.  The only 2D Visual with
        ///       3D childern is the Viewport3DVisual which is sealed.  -- [....] 01/17/06 
        /// </summary>
//        protected virtual Visual 
        GetVisualChild:function(/*int*/ index) 
        { 
           throw new Error('ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)');
        },
        
        /// <summary>
        /// Returns the 2D child at index "index". This will fail for Visuals
        /// whose children are Visual3Ds. 
        /// </summary>
//        internal Visual 
        InternalGetVisualChild:function(/*int*/ index) 
        { 
            // Call the right /*virtual*/ method.
            return this.GetVisualChild(index); 
        },
 
        /// <summary> 
        /// Helper method to provide access to AddVisualChild for the VisualCollection.
        /// </summary> 
//        internal void 
        InternalAddVisualChild:function(/*Visual*/ child)
        {
            this.AddVisualChild(child);
        }, 

        /// <summary> 
        /// Helper method to provide access to RemoveVisualChild for the VisualCollection. 
        /// </summary>
//        internal void 
        InternalRemoveVisualChild:function(/*Visual*/ child) 
        {
            this.RemoveVisualChild(child);
        },
 
        /// <summary>
        /// AttachChild 
        /// 
        ///    Derived classes must call this method to notify the Visual layer that a new
        ///    child appeard in the children collection. The Visual layer will then call the GetVisualChild 
        ///    method to find out where the child was added.
        ///
        ///  Remark: To move a Visual child in a collection it must be first disconnected and then connected
        ///    again. (Moving forward we might want to add a special optimization there so that we do not 
        ///    unmarshal our composition resources).
        /// 
        ///    It is okay to type this protected API to the 2D Visual.  The only 2D Visual with 
        ///    3D childern is the Viewport3DVisual which is sealed.  -- [....] 01/17/06
        /// </summary> 
//        protected void 
        AddVisualChild:function(/*Visual*/ child)
        {
            if (child == null)
            { 
                return;
            } 
 
            if (child._parent != null)
            { 
                throw new Error('ArgumentException(SR.Get(SRID.Visual_HasParent)');
            }

            this.SetFlags(true, VisualFlags.HasChildren); 

            // Set the parent pointer. 
 
            child._parent = this;
 
//            // 
//            // Resume layout.
//            // 
//            UIElement.PropagateResumeLayout(this, child);

            // Fire notifications
            this.OnVisualChildrenChanged(child, null /* no removed child */); 
            child.FireOnVisualParentChanged(null);
        },
 
        /// <summary>
        /// DisconnectChild 
        ///
        ///    Derived classes must call this method to notify the Visual layer that a
        ///    child was removed from the children collection. The Visual layer will then call
        ///    GetChildren to find out which child has been removed. 
        ///
        /// </summary> 
//        protected void 
        RemoveVisualChild:function(/*Visual*/ child) 
        {
            if (child == null || child._parent == null) 
            {
                return;
            }
 
            if (child._parent != this)
            { 
                throw new Error('ArgumentException(SR.Get(SRID.Visual_NotChild)'); 
            }
 
            if(this.InternalVisualChildrenCount == 0)
            {
                this.SetFlags(false, VisualFlags.HasChildren);
            } 
            
            // 
            // Remove the child on all channels its current parent is marshalled to. 
            //

//            for (int i = 0; i < _proxy.Count; i++)
//            {
//                DUCE.Channel channel = _proxy.GetChannel(i);
//
//                if (child.CheckFlagsAnd(channel, VisualProxyFlags.IsConnectedToParent))
//                { 
//                    child.SetFlags(channel, false, VisualProxyFlags.IsConnectedToParent); 
//                    DUCE.IResource childResource = (DUCE.IResource)child;
//                    childResource.RemoveChildFromParent(this, channel); 
//                    childResource.ReleaseOnChannel(channel);
//                }
//            }
            
            this._dom.removeChild(child._dom);

            // Set the parent pointer to null.
 
            child._parent = null; 

//            Visual.PropagateFlags( 
//                    this,
//                    VisualFlags.IsSubtreeDirtyForPrecompute,
//                    VisualProxyFlags.IsSubtreeDirtyForRender);

//            UIElement.PropagateSuspendLayout(child);
 
            // Fire notifications 
            child.FireOnVisualParentChanged(this);
            this.OnVisualChildrenChanged(null /* no child added */, child); 
        },
        
        // -------------------------------------------------------------------- 
        //
        //   Visual Ancestry Relations
        //
        // -------------------------------------------------------------------- 
        /// <summary>
        /// This is called when the parent link of the Visual is changed. 
        /// This method executes important base functionality before calling the
        /// overridable virtual.
        /// </summary>
        /// <param name="oldParent">Old parent or null if the Visual did not have a parent before.</param> 
//        internal virtual void 
        FireOnVisualParentChanged:function(/*DependencyObject*/ oldParent)
        { 
            // Call the ParentChanged virtual before firing the Ancestor Changed Event 
            this.OnVisualParentChanged(oldParent);

            // Fire the Ancestor changed Event on the nodes.
            /*AncestorChangedEventArgs*/var args = new AncestorChangedEventArgs(this, oldParent); 
            Visual.ProcessAncestorChangedNotificationRecursive(this, args);
        },
 

        /// <summary> 
        /// OnVisualParentChanged is called when the parent of the Visual is changed.
        /// </summary>
        /// <param name="oldParent">Old parent or null if the Visual did not have a parent before.</param>
//        protected internal virtual void 
        OnVisualParentChanged:function(/*DependencyObject*/ oldParent) 
        {
        },
 
        /// <summary>
        /// OnVisualChildrenChanged is called when the VisualCollection of the Visual is edited. 
        /// </summary>
//        protected internal virtual void 
        OnVisualChildrenChanged:function(
            /*DependencyObject*/ visualAdded,
            /*DependencyObject*/ visualRemoved) 
        {
        }, 
 
        /// <summary> 
        /// Returns true if the specified ancestor (this) is really the ancestor of the
        /// given descendant (argument). 
        /// </summary>
//        public bool 
        IsAncestorOf:function(/*DependencyObject*/ descendant)
        {
            var visual; 
            var visual3D;
            var visualOut = {"visual" :visual};
            var visual3DOut = {"visual3D" : visual3D};

            VisualTreeUtils.AsNonNullVisual(descendant, /*out*/ visualOut, /*out*/ visual3DOut); 
            
            visual = visualOut.visual;
            visual3D = visual3DOut.visual3D;
            // x86 branch prediction skips the branch on first encounter.  We favor 2D. 
            if(visual3D != null)
            {
                return visual3D.IsDescendantOf(this);
            } 

            return visual.IsDescendantOf(this); 
        },

        /// <summary> 
        /// Returns true if the refernece Visual (this) is a descendant of the argument Visual.
        /// </summary>
//        public bool 
        IsDescendantOf:function(/*DependencyObject*/ ancestor)
        { 
            if (ancestor == null)
            { 
                throw new Error('ArgumentNullException("ancestor")'); 
            }
 
            VisualTreeUtils.EnsureVisual(ancestor);

            // Walk up the parent chain of the descendant until we run out
            // of 2D parents or we find the ancestor. 
            /*DependencyObject*/var current = this;
 
            while ((current != null) && (current != ancestor)) 
            {
                /*Visual*/var currentAsVisual = current instanceof Visual ? current : null; 

                if (currentAsVisual != null)
                {
                    current = currentAsVisual._parent; 
                }
                else 
                { 
                	 current = null; 
                } 
            }

            return current == ancestor;
        },

 
        /// <summary> 
        ///     Walks up the Visual tree setting or clearing the given flags.  Unlike
        ///     PropagateFlags this does not terminate when it reaches node with 
        ///     the flags already set.  It always walks all the way to the root.
        /// </summary>
//        internal void 
        SetFlagsToRoot:function(/*bool*/ value, /*VisualFlags*/ flag)
        { 
            var current = this;
 
            do 
            {
                current.SetFlags(value, flag); 

                var currentParent = current._parent instanceof Visual ? current._parent : null;
 
                current = currentParent; 
            }
            while (current != null); 
        },

 
        /// <summary>
        ///     Finds the first ancestor of the given element which has the given
        ///     flags set.
        /// </summary> 
//        internal DependencyObject 
        FindFirstAncestorWithFlagsAnd:function(/*VisualFlags*/ flag)
        { 
            /*Visual*/var current = this; 

            do 
            {
                if (current.CheckFlagsAnd(flag))
                {
                    // The other Visual crossed through this Visual's parent chain. Hence this is our 
                    // common ancestor.
                    return current; 
                } 

                /*DependencyObject*/var parent = current._parent; 

                // first attempt to see if parent is a Visual, in which case we continue the loop.
                // Otherwise see if it's a Visual3D, and call the similar method on it.
                current = parent instanceof Visual ? parent : null; 
            } 
            while (current != null);
 
            return null; 
        },
 

        /// <summary>
        /// Finds the common ancestor of two Visuals.
        /// </summary> 
        /// <returns>Returns the common ancestor if the Visuals have one or otherwise null.</returns>
        /// <exception cref="ArgumentNullException">If the argument is null.</exception> 
//        public DependencyObject 
        FindCommonVisualAncestor:function(/*DependencyObject*/ otherVisual) 
        {
            if (otherVisual == null)
            {
                throw new Error('ArgumentNullException("otherVisual")'); 
            }
 
            // Since we can't rely on code running in the CLR, we need to first make sure 
            // that the FindCommonAncestor flag is not set. It is enought to ensure this
            // on one path to the root Visual. 

            //
 
            this.SetFlagsToRoot(false, VisualFlags.FindCommonAncestor); 

            // Walk up the other visual's parent chain and set the FindCommonAncestor flag. 
            VisualTreeUtils.SetFlagsToRoot(otherVisual, true, VisualFlags.FindCommonAncestor);

            // Now see if the other Visual's parent chain crosses our parent chain.
            return this.FindFirstAncestorWithFlagsAnd(VisualFlags.FindCommonAncestor); 
        },
        
        /// <summary>
        /// SetFlags is used to set or unset one or multiple node flags on the node. 
        /// </summary>
//        /*internal*/ protected void 
        SetFlags:function(/*boolean*/ value, /*VisualFlags*/ flags)
        {
        	this._flags = value ? (this._flags | flags) : (this._flags & (~flags)); 
        },
        
        /// <summary>
        /// CheckFlagsAnd returns true if all flags in the bitmask flags are set on the node. 
        /// </summary>
        /// <remarks>If there aren't any bits set on the specified flags the method 
        /// returns true</remarks> 
//        /*internal*/public boolean 
        CheckFlagsAnd:function(/*VisualFlags*/ flags)
        { 
            return (this._flags & flags) == flags;
        },

 

	});
	

    /// <summary> 
    ///     Walks down in the tree for nodes that have AncestorChanged Handlers
    ///     registered and calls them. 
    ///     It uses Flag bits that help it prune the walk.  This should go
    ///     straight to the relevent nodes.
    /// </summary>
//    internal static void 
    Visual.ProcessAncestorChangedNotificationRecursive=function(/*DependencyObject*/ e, /*AncestorChangedEventArgs*/ args) 
    {
        /*Visual*/var eAsVisual = e instanceof Visual ? e : null;

        // If there is a handler on this node, then fire it.
        /*AncestorChangedEventHandler*/
        var handler = Visual.AncestorChangedEventField.GetValue(eAsVisual);

        if(handler != null)
        { 
            handler(eAsVisual, args); 
        }

            // Decend into the children.
        var count = eAsVisual.InternalVisualChildrenCount;

        for (var i = 0; i < count; i++) 
        {
            /*DependencyObject*/
        	var childVisual = eAsVisual.InternalGetVisualChild(i); 
            if (childVisual != null) 
            {
            	Visual.ProcessAncestorChangedNotificationRecursive(childVisual, args); 
            }
        }
    };
	
	Object.defineProperties(Visual.prototype,{
	      /// <summary>
        /// Returns the parent of this Visual.  Parent may be either a Visual or Visual3D.
        /// </summary> 
//        protected DependencyObject 
        VisualParent:
        { 
            get:function() 
            {
                return this.InternalVisualParent;
            }
        }, 

        /// <summary> 
        /// Identical to VisualParent, except that skips verify access for perf. 
        /// </summary>
//        internal DependencyObject 
        InternalVisualParent:
        {
            get:function()
            {
                return this._parent; 
            }
        },
        
        /// <summary>
        ///  Derived classes override this property to enable the Visual code to enumerate
        ///  the Visual children. Derived classes need to return the number of children 
        ///  from this method.
        /// 
        ///    By default a Visual does not have any children. 
        ///
        ///  Remark: During this virtual method the Visual tree must not be modified. 
        /// </summary>
//        protected virtual int 
        VisualChildrenCount:
        {
            get:function() { return 0; } 
        },
 
        /// <summary> 
        /// Returns the number of 2D children. This returns 0 for visuals
        /// whose children are Visual3Ds. 
        /// </summary>
//        internal int 
        InternalVisualChildrenCount:
        {
            get:function() 
            {
                // Call the right virtual method. 
                return this.VisualChildrenCount; 
            }
        },

        ///<Summary> 
        ///Flag to check if this visual has any children
        ///</Summary>
//        internal bool 
        HasVisualChildren:
        { 
            get:function()
            { 
                return ((this._flags & VisualFlags.HasChildren) != 0); 
            }
        },
        
        /// <summary> 
        /// The CompositionTarget marks the root element. The root element is responsible
        /// for posting renders. 
        /// </summary>
        /// <remarks>
        /// The property getter is also used to ensure that the Visual is
        /// not used in multiple CompositionTargets. 
        /// </remarks>
//        /*internal*/ boolean 
        IsRootElement: 
        { 
            get:function()
            { 
                return this.CheckFlagsAnd(VisualFlags.ShouldPostRender);
            },

            set:function(value) 
            {
            	this.SetFlags(value, VisualFlags.ShouldPostRender); 
            } 
        },
        
        /// <summary> 
        ///   Add removed delegates to the VisualAncenstorChanged Event.
        /// </summary>
        /// <remarks>
        ///     This also sets/clears the tree-searching bit up the tree 
        /// </remarks>
//        internal event AncestorChangedEventHandler 
        VisualAncestorChanged:
        { 
//            add
//            { 
//                AncestorChangedEventHandler newHandler = AncestorChangedEventField.GetValue(this);
//
//                if (newHandler == null)
//                { 
//                    newHandler = value;
//                } 
//                else 
//                {
//                    newHandler += value; 
//                }
//
//                AncestorChangedEventField.SetValue(this, newHandler);
// 
//                SetTreeBits(
//                    this, 
//                    VisualFlags.SubTreeHoldsAncestorChanged, 
//                    VisualFlags.RegisteredForAncestorChanged);
//            } 
//
//            remove
//            {
//                // check that we are Disabling a node that was previously Enabled 
//                if(CheckFlagsAnd(VisualFlags.SubTreeHoldsAncestorChanged))
//                { 
//                    ClearTreeBits( 
//                        this,
//                        VisualFlags.SubTreeHoldsAncestorChanged, 
//                        VisualFlags.RegisteredForAncestorChanged);
//                }
//
//                // if we are Disabling a Visual that was not Enabled then this 
//                // search should fail.  But it is safe to check.
//                AncestorChangedEventHandler newHandler = AncestorChangedEventField.GetValue(this); 
// 
//                if (newHandler != null)
//                { 
//                    newHandler -= value;
//
//                    if(newHandler == null)
//                    { 
//                        AncestorChangedEventField.ClearValue(this);
//                    } 
//                    else 
//                    {
//                        AncestorChangedEventField.SetValue(this, newHandler); 
//                    }
//                }
//            }
        },
	});
	
	Object.defineProperties(Visual, {
//	    private static final UncommonField<AncestorChangedEventHandler> 
	    AncestorChangedEventField:
	    {
	    	get:function(){
	    		if(Visual._AncestorChangedEventField === undefined){
	    			Visual._AncestorChangedEventField = new UncommonField(); 
	    		}
	    		return Visual._AncestorChangedEventField;
	    	}
	    }
//        
			
	});
	
	Visual.Type = new Type("Visual", Visual, [DependencyObject.Type]);
	return Visual;
});


