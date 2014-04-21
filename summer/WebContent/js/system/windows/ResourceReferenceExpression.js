/**
 * ResourceReferenceExpression
 */

define(["dojo/_base/declare", "system/Type", "windows/Expression", "internal/Helper", "windows/DeferredResourceReference"], 
		function(declare, Type, Expression, Helper, DeferredResourceReference ){
	

    /// <summary> 
    /// This enum represents the internal state of the RRE.
    /// Additional bools should be coalesced into this enum. 
    /// </summary>
    var InternalState = declare("InternalState", null,{});
    
	InternalState.Default                       = 0x00;
	InternalState.HasCachedResourceValue        = 0x01; 
	InternalState.IsMentorCacheValid            = 0x02; 
	InternalState.DisableThrowOnResourceFailure = 0x04;
	InternalState.IsListeningForFreezableChanges= 0x08; 
	InternalState.IsListeningForInflated        = 0x10;
	

    /// <summary>
    ///     These EventArgs are used to pass additional
    ///     information during a ResourcesChanged event 
    /// </summary>
    var ResourcesChangedEventArgs = declare("ResourcesChangedEventArgs", EventArgs,{
    	constructor:function(/*ResourcesChangeInfo*/ info)
        { 
            this._info = info;
        }
    });
    
    Object.defineProperties(ResourcesChangedEventArgs.prototype, {
//        internal ResourcesChangeInfo 
        Info: 
        {
            get:function() { return this._info; } 
        } 
    });

	
	var ResourceReferenceExpression = declare("ResourceReferenceExpression", Expression,{
		constructor:function(/*object*/ resourceKey) 
        {
            this._resourceKey = resourceKey; 
            
            // Cached value and a dirty bit.  See GetValue. 
//            private object 
            this._cachedResourceValue = null;

            // Used to find the value for this expression when it is set on a non-FE/FCE.
            // The mentor is the FE/FCE that the FindResource method is invoked on. 
//            private DependencyObject 
            this._mentorCache = null;
     
            // Used by the change listener to fire invalidation. 
//            private DependencyObject 
            this._targetObject = null;
//            private DependencyProperty 
            this._targetProperty = null; 

            // Bit Fields used to store boolean flags
//            private InternalState 
            this._state = InternalState.Default;  // this is a byte (see def'n)
     
//            private ResourceReferenceExpressionWeakContainer 
            this._weakContainerRRE = null;
		},
		
        /// <summary> 
        ///     List of sources of the ResourceReferenceExpression
        /// </summary>
        /// <returns>Sources list</returns>
//        internal override DependencySource[] 
		GetSources:function() 
        {
            return null; 
        },
        /// <summary> 
        ///     Called to evaluate the ResourceReferenceExpression value
        /// </summary>
        /// <param name="d">DependencyObject being queried</param>
        /// <param name="dp">Property being queried</param> 
        /// <returns>Computed value. Unset if unavailable.</returns>
//        internal override object 
        GetValue:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp) 
        { 
            if (d == null)
            { 
                throw new ArgumentNullException("d");
            }
            if (dp == null)
            { 
                throw new ArgumentNullException("dp");
            } 
 
            // If the cached value is valid then return it
            if (this.ReadInternalState(InternalState.HasCachedResourceValue) == true) 
                return this._cachedResourceValue;

//            object source;
            return this.GetRawValue(d, /*out source*/{"source" : null}, dp); 
        },
        
        /// <summary> 
        ///     Called to evaluate the ResourceReferenceExpression value 
        /// </summary>
        /// <param name="d">DependencyObject being queried</param> 
        /// <param name="source">Source object that the resource is found on</param>
        /// <param name="dp">DependencyProperty</param>
        /// <returns>Computed value. Unset if unavailable.</returns>
        /// <remarks> 
        /// This routine has been separated from the above GetValue call because it is
        /// invoked by the ResourceReferenceExpressionConverter during serialization. 
        /// </remarks> 
//        internal object 
        GetRawValue:function(/*DependencyObject*/ d, /*out object source*/sourceOut, /*DependencyProperty*/ dp)
        { 
            // Find the mentor node to invoke FindResource on. For example
            // <Button>
            //   <Button.Background>
            //     <SolidColorBrush Color="{DynamicResource MyColor}" /> 
            //   </Button.Background>
            // </Button 
            // Button is the mentor for the ResourceReference on SolidColorBrush 
            if (this.ReadInternalState(InternalState.IsMentorCacheValid) == false)
            { 
                // Find the mentor by walking up the InheritanceContext
                // links and update the cache
                this._mentorCache = Helper.FindMentor(d);
                this.WriteInternalState(InternalState.IsMentorCacheValid, true); 

                // If the mentor is different from the targetObject as will be the case 
                // in the example described above, make sure you listen for ResourcesChanged 
                // event on the mentor. That way you will be notified of ResourceDictionary
                // changes as well as logical tree changes 
                if (this._mentorCache != null && this._mentorCache != this._targetObject)
                {
//                    Debug.Assert(_targetObject == d, "TargetObject that this expression is attached to must be the same as the one on which its value is being queried");
 
                    /*FrameworkElement*/var mentorFE;
                    /*FrameworkContentElement*/var mentorFCE; 
                    var mentorFEOut = {
                    	"fe" : mentorFE	
                    };
                    
                    var mentorFCE = {
                    	"fce" : mentorFCE	
                    };
                    
                    Helper.DowncastToFEorFCE(_mentorCache, /*out mentorFE*/mentorFEOut, /*out mentorFCE*/mentorFCEOut, true); 
                    mentorFE = mentorFEOut.mentorFE;
                    mentorFCE = mentorFCEOut.mentorFCE;

                    if (mentorFE != null) 
                    {
                        mentorFE.ResourcesChanged += new EventHandler(InvalidateExpressionValue);
                    }
                    else 
                    {
                        mentorFCE.ResourcesChanged += new EventHandler(InvalidateExpressionValue); 
                    } 
                }
            } 

            var resource;
            if (this._mentorCache != null)
            { 
                /*FrameworkElement*/var fe;
                /*FrameworkContentElement*/var fce; 
                var feOut = {
                	"fe" : fe	
                };
                    
                var fceOut = {
                	"fce" : fce	
                };
                Helper.DowncastToFEorFCE(this._mentorCache, /*out fe*/feOut, /*out fce*/fceOut, true /*throwIfNeither*/);
                fe = feOut.fe;
                fce=fceOut.fce;

                // If there is a mentor do a FindResource call starting at that node 
                resource = FrameworkElement.FindResourceInternal(fe,
                                                                 fce,
                                                                 dp,
                                                                 this._resourceKey, 
                                                                 null,  // unlinkedParent
                                                                 true,  // allowDeferredResourceReference 
                                                                 false, // mustReturnDeferredResourceReference 
                                                                 null,  // boundaryElement
                                                                 false, // disableThrowOnResourceFailure 
                                                                 /*out source*/sourceOut);
            }
            else
            { 
                // If there is no mentor then simply search the App and the Themes for the right resource
                resource = FrameworkElement.FindResourceFromAppOrSystem(this._resourceKey, 
                                                                        /*out source*/sourceOut, 
                                                                        false, // disableThrowOnResourceFailure
                                                                        true,  // allowDeferredResourceReference 
                                                                        false  /* mustReturnDeferredResourceReference*/);
            }

            if (resource == null) 
            {
                // Assuming that null means the value doesn't exist in the resources section 
                resource = Type.UnsetValue; 
            }
 
            // Update the cached values with this resource instance
            this._cachedResourceValue = resource;
            this.WriteInternalState(InternalState.HasCachedResourceValue, true);
 
            /*object*/
            var effectiveResource = resource;
            /*DeferredResourceReference*/
            var deferredResourceReference = resource instanceof DeferredResourceReference ? resource : null; 
            if (deferredResourceReference != null) 
            {
                if (deferredResourceReference.IsInflated) 
                {
                    // use the inflated value in the Freezable test below
                    effectiveResource = deferredResourceReference.Value instanceof Freezable ? deferredResourceReference.Value : null;
                } 
                else
                { 
                    // listen for inflation, so we can do the Freezable test then 
                    if (!this.ReadInternalState(InternalState.IsListeningForInflated))
                    { 
                        deferredResourceReference.AddInflatedListener(this);
                        this.WriteInternalState(InternalState.IsListeningForInflated, true);
                    }
                } 
            }
 
            this.ListenForFreezableChanges(effectiveResource); 

            // Return the resource 
            return resource;
        },

        /// <summary> 
        ///     Allows ResourceReferenceExpression to store set values
        /// </summary> 
        /// <param name="d">DependencyObject being set</param> 
        /// <param name="dp">Property being set</param>
        /// <param name="value">Value being set</param> 
        /// <returns>true if ResourceReferenceExpression handled storing of the value</returns>
//        internal override bool 
        SetValue:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp, /*object*/ value)
        {
            return false; 
        },
 
        /// <summary> 
        ///     Notification that the ResourceReferenceExpression has been set as a property's value
        /// </summary> 
        /// <param name="d">DependencyObject being set</param>
        /// <param name="dp">Property being set</param>
//        internal override void 
        OnAttach:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp)
        { 
            this._targetObject = d;
            this._targetProperty = dp; 
 
            /*FrameworkObject*/ fo = new FrameworkObject(this._targetObject);
 
            fo.HasResourceReference = true;

            if (!fo.IsValid)
            { 
                // Listen for the InheritanceContextChanged event on the target node,
                // so that if this context hierarchy changes we can re-evaluate this expression. 
            	this._targetObject.InheritanceContextChanged += new EventHandler(InvalidateExpressionValue); 
            }
        },

        /// <summary>
        ///     Notification that the ResourceReferenceExpression has been removed as a property's value
        /// </summary> 
        /// <param name="d">DependencyObject being cleared</param>
        /// <param name="dp">Property being cleared</param> 
//        internal override void 
        OnDetach:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp) 
        {
            // Invalidate all the caches 
            this.InvalidateMentorCache();

            if (!(this._targetObject instanceof FrameworkElement) && !(this._targetObject instanceof FrameworkContentElement))
            { 
                // Stop listening for the InheritanceContextChanged event on the target node
            	this._targetObject.InheritanceContextChanged -= new EventHandler(InvalidateExpressionValue); 
            } 

            this._targetObject = null; 
            this._targetProperty = null;
            // RemoveChangedHandler will have already been called via InvalidateMentorCache().
            this._weakContainerRRE = null;
        }, 


 
        /// <summary>
        /// This method is called when the cached value of the resource has 
        /// been invalidated.  E.g. after a new Resources property is set somewhere 
        /// in the ancestory.
        /// </summary> 
//        private void 
        InvalidateCacheValue:function()
        {
            /*object*/var resource = this._cachedResourceValue;
 
            // If the old value was a DeferredResourceReference, it should be
            // removed from its Dictionary's list to avoid a leak (bug 1624666). 
            /*DeferredResourceReference*/
            var deferredResourceReference = this._cachedResourceValue instanceof DeferredResourceReference ? this._cachedResourceValue : null; 
            if (deferredResourceReference != null)
            { 
                if (deferredResourceReference.IsInflated)
                {
                    // use the inflated value for the Freezable test below
                    resource = deferredResourceReference.Value; 
                }
                else 
                { 
                    // stop listening for the Inflated event
                    if (this.ReadInternalState(InternalState.IsListeningForInflated)) 
                    {
                        deferredResourceReference.RemoveInflatedListener(this);
                        this.WriteInternalState(InternalState.IsListeningForInflated, false);
                    } 
                }
 
                deferredResourceReference.RemoveFromDictionary(); 
            }
 
            this.StopListeningForFreezableChanges(resource);

            this._cachedResourceValue = null;
            this.WriteInternalState(InternalState.HasCachedResourceValue, false); 
        },
 
        /// <summary> 
        ///     This method is called to invalidate all the cached values held in
        ///     this expression. This is called under the following 3 scenarios 
        ///     1. InheritanceContext changes
        ///     2. Logical tree changes
        ///     3. ResourceDictionary changes
        ///     This call is more pervasive than the InvalidateCacheValue method 
        /// </summary>
//        private void 
        InvalidateMentorCache:function() 
        { 
            if (this.ReadInternalState(InternalState.IsMentorCacheValid) == true)
            { 
                if (this._mentorCache != null)
                {
                    if (this._mentorCache != this._targetObject)
                    { 
                        /*FrameworkElement*/var mentorFE;
                        /*FrameworkContentElement*/var mentorFCE; 
                        var mentorFEOut = {
                        	"fe" : mentorFE	
                        };
                        
                        var mentorFCE = {
                        	"fce" : mentorFCE	
                        };
                        
                        Helper.DowncastToFEorFCE(_mentorCache, /*out mentorFE*/mentorFEOut, /*out mentorFCE*/mentorFCEOut, true); 
                        mentorFE = mentorFEOut.mentorFE;
                        mentorFCE = mentorFCEOut.mentorFCE;

                        // Your mentor is about to change, make sure you detach handlers for 
                        // the events that you were listening on the old mentor
                        if (mentorFE != null)
                        {
                            mentorFE.ResourcesChanged -= new EventHandler(InvalidateExpressionValue); 
                        }
                        else 
                        { 
                            mentorFCE.ResourcesChanged -= new EventHandler(InvalidateExpressionValue);
                        } 
                    }

                    // Drop the mentor cache
                    this._mentorCache = null; 
                }
 
                // Mark the cache invalid 
                this.WriteInternalState(InternalState.IsMentorCacheValid, false);
            } 

            // Invalidate the cached value of the expression
            this.InvalidateCacheValue();
        },

        /// <summary> 
        ///     This event handler is called to invalidate the cached value held in 
        ///     this expression. This is called under the following 3 scenarios
        ///     1. InheritanceContext changes 
        ///     2. Logical tree changes
        ///     3. ResourceDictionary changes
        /// </summary>
//        internal void 
        InvalidateExpressionValue:function(/*object*/ sender, /*EventArgs*/ e) 
        {
            // VS has a scenario where a TreeWalk invalidates all reference expressions on a DependencyObject. 
            // If there is a dependency between RRE's, 
            // invalidating one RRE could cause _targetObject to be null on the other RRE. Hence this check.
            if (this._targetObject == null) 
            {
                return;
            }
 
            /*ResourcesChangedEventArgs*/var args = e instanceof ResourcesChangedEventArgs ? e : null;
            if (args != null) 
            { 
                /*ResourcesChangeInfo*/var info = args.Info;
                if (!info.IsTreeChange) 
                {
                    // This will happen when
                    // 1. Theme changes
                    // 2. Entire ResourceDictionary in the ancestry changes 
                    // 3. Single entry in a ResourceDictionary in the ancestry is changed
                    // In all of the above cases it is sufficient to re-evaluate the cache 
                    // value alone. The mentor relation ships stay the same. 
                    this.InvalidateCacheValue();
                } 
                else
                {
                    // This is the case of a logical tree change and hence we need to
                    // re-evaluate both the mentor and the cached value. 
                	this.InvalidateMentorCache();
                } 
            } 
            else
            { 
                // There is no information provided by the EventArgs. Hence we
                // pessimistically invalidate both the mentor and the cached value.
                // This code path will execute when the InheritanceContext changes.
            	this.InvalidateMentorCache(); 
            }
 
            this.InvalidateTargetProperty(sender, e); 
        },
 
//        private void 
        InvalidateTargetProperty:function(/*object*/ sender, /*EventArgs*/ e)
        {
        	this._targetObject.InvalidateProperty(this._targetProperty);
        },

//        private void 
        InvalidateTargetSubProperty:function(/*object*/ sender, /*EventArgs*/ e) 
        { 
        	this._targetObject.NotifySubPropertyChange(this._targetProperty);
        },

//        private void 
        ListenForFreezableChanges:function(/*object*/ resource)
        {
            if (!this.ReadInternalState(InternalState.IsListeningForFreezableChanges)) 
            {
                // If this value is an unfrozen Freezable object, we need 
                //  to listen to its changed event in order to properly update 
                //  the cache.
                /*Freezable*/var resourceAsFreezable = resource instanceof Freezable ? resource : null; 
                if( resourceAsFreezable != null && !resourceAsFreezable.IsFrozen )
                {
                    if (this._weakContainerRRE == null)
                    { 
                    	this._weakContainerRRE = new ResourceReferenceExpressionWeakContainer(this);
                    } 
 
                    // Hook up the event to the weak container to prevent memory leaks (Bug436021)
                    this._weakContainerRRE.AddChangedHandler(resourceAsFreezable); 
                    WriteInternalState(InternalState.IsListeningForFreezableChanges, true);
                }
            }
        },

//        private void 
        StopListeningForFreezableChanges:function(/*object*/ resource) 
        { 
            if (this.ReadInternalState(InternalState.IsListeningForFreezableChanges))
            { 
                // If the old value was an unfrozen Freezable object, we need
                //  to stop listening to its changed event.  If the old value wasn't
                //  frozen (hence we attached an listener) but has been frozen
                //  since then, the change handler we had attached was already 
                //  discarded during the freeze so we don't care here.
                /*Freezable*/var resourceAsFreezable = resource instanceof Freezable ? resource : null; 
                if (resourceAsFreezable != null && this._weakContainerRRE != null) 
                {
                    if (!resourceAsFreezable.IsFrozen) 
                    {
                        this._weakContainerRRE.RemoveChangedHandler();
                    }
                    else 
                    {
                        // Resource is frozen so we can discard the weak reference. 
                    	this._weakContainerRRE = null; 
                    }
                } 

                // It is possible that a freezable was unfrozen during the call to ListForFreezableChanges
                // but was frozen before the call to StopListeningForFreezableChanges
                this.WriteInternalState(InternalState.IsListeningForFreezableChanges, false); 
            }
        },
 
        // when a deferred resource reference is inflated, the value may need extra
        // work 
//        internal void 
        OnDeferredResourceInflated:function(/*DeferredResourceReference*/ deferredResourceReference)
        {
            if (this.ReadInternalState(InternalState.IsListeningForInflated))
            { 
                // once the value is inflated, stop listening for the event
                deferredResourceReference.RemoveInflatedListener(this); 
                this.WriteInternalState(InternalState.IsListeningForInflated, false); 
            }
 
            this.ListenForFreezableChanges(deferredResourceReference.Value);
        },

        // Extracts the required flag and returns 
        // bool to indicate if it is set or unset
//        private bool 
        ReadInternalState:function(/*InternalState*/ reqFlag) 
        { 
            return (this._state & reqFlag) != 0;
        },

        // Sets or Unsets the required flag based on
        // the bool argument
//        private void 
        WriteInternalState:function(/*InternalState*/ reqFlag, /*bool*/ set) 
        {
            if (set) 
            { 
            	this._state |= reqFlag;
            } 
            else
            {
            	this._state &= (~reqFlag);
            } 
        }

	});
	
	Object.defineProperties(ResourceReferenceExpression.prototype,{
        /// <summary> 
        ///     Key used to lookup the resource 
        /// </summary>
//        public object 
        ResourceKey: 
        {
            get:function() { return this._resourceKey; }
        }
	});
	
	ResourceReferenceExpression.Type = new Type("ResourceReferenceExpression", ResourceReferenceExpression, [Expression.Type]);
	return ResourceReferenceExpression;
});
 
