/**
 * Freezable
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyObject", "windows/ISealable",
        "windows/EntryIndex", "windows/DependencyProperty"], 
		function(declare, Type, DependencyObject, ISealable,
				EntryIndex, DependencyProperty){
	
	  //
    // A simple class that is used to cache the event handlers that are gathered during a call
    // to FireChanged.  Using this cache cuts down on the amount of managed allocations, which
    // improves the performance of Freezables. 
    //
//    private class 
    var EventStorage  = declare("EventStorage", [DependencyObject, ISealable], {
    	constructor:function(initialSize)
        { 
            // check just in case
            if (initialSize <= 0) initialSize = 1;

            this._events = []; //new EventHandler[initialSize]; 
            for(var i=0; i<initialSize; i++){
            	this._events[i] = new EventHandler();
            }
            
         
            this._logSize = 0;
            this._physSize = initialSize; 
            this._inUse = false; 
            
//            EventHandler[] _events;         // list of events
//            int _logSize;                   // the logical size of the list 
//            int _physSize;                  // the allocated buffer size 
//            bool _inUse;
        },
        
        Get:function(idx) 
        {
            return this._events[idx]; 
        },

        Set:function(idx, value) 
        {
            this._events[idx] = value;
        },
        
        //
        //  Adds a new EventHandler to the storage.  In the case that more memory is needed, the cache
        //  size is doubled.
        // 
//        public void 
        Add:function(/*EventHandler*/ e)
        { 
//            if (this._logSize == this._physSize) { 
//            	this._physSize *= 2;
//                /*EventHandler[]*/
//            	var temp = []; //new EventHandler[this._physSize]; 
//
//                for (var i = 0; i < this._logSize; i++) {
//                    temp[i] = this._events[i];
//                } 
//
//                this._events = temp; 
//            } 

//            this._events[_logSize] = e; 
        	this._events.push(e);
//            this._logSize++;
//        	this._events
        },

        // 
        // Clears the list but does not free the memory so that future uses of the
        // class can reuse the space and not take an allocation performance hit. 
        // 
//        public void 
        Clear:function()
        { 
//        	this._logSize = 0;
        	this._events.length=0;
        },
        
    });

    Object.defineProperties(EventStorage.prototype, {
//    	public int 
    	Count: 
        {
            get:function()
            { 
                return this._events.length; //this._logSize;
            } 
        },

//        public int 
        PhysicalSize:
        { 
            get:function()
            { 
                return this._physSize; 
            }
        }, 

        // 
        //  So that it's possible to reuse EventStorage classes, and so that if one is being used, another 
        //  person does not overwrite the contents (i.e. FireChanged causes someone else call their FireChanged),
        //  an InUse flag is set to indicate whether someone is currently using this class. 
        //
//        public bool 
        InUse:
        {
            get:function() 
            {
                return this._inUse; 
            },
            set:function(value)
            { 
            	this._inUse = value;
            }
        }
    });
    
    
    // 
    // A simple class that is used when the Freezable needs to store both handlers and context info.
    // The _handlerStorage and _contextStorage fields can store either a list or a direct
    // reference to the object - Freezable's Freezable_* flags (actually added to DependencyObject.cs)
    // can be used to test for which one to use. 
    //
//    private class 
    var HandlerContextStorage = declare("HandlerContextStorage", null, {
    	
    });
    
    Object.defineProperties(HandlerContextStorage.prototype, {
//        public object 
        _handlerStorage:
        {
        	get:function(){
        		return this.__handlerStorage;
        	},
        	set:function(value){
        		this.__handlerStorage = value;
        	}
        },
//        public object 
        _contextStorage:
        {
        	get:function(){
        		return this.__contextStorage;
        	},
        	set:function(value){
        		this.__contextStorage = value;
        	}
        }
    });

    //
    // A simple struct that stores a weak ref to a dependency object and a corresponding property 
    // of that object.
    // 
//    private struct 
    var FreezableContextPair = declare("FreezableContextPair", null, {
    	constructor:function(/*DependencyObject*/ dependObject, /*DependencyProperty*/ dependProperty) 
        {
            this.Owner = dependObject;
            this.Property = dependProperty;
        }
    }); 
    
    Object.defineProperties(FreezableContextPair.prototype, {
//      public object 
    	Owner:
    	{
	      	get:function(){
	      		return this._owner;
	      	},
	      	set:function(value){
	      		this._owner = value;
	      	}
    	},
//      public object 
    	Property:
    	{
	      	get:function(){
	      		return this._property;
	      	},
	      	set:function(value){
	      		this._property = value;
	      	}
    	}
    });    
    
    // initial size to make the EventStorage cache
//    private const int 
    var INITIAL_EVENTSTORAGE_SIZE = 4;
	
	var Freezable = declare("Freezable", [DependencyObject, ISealable],{
		constructor:function(){
	        // to store the DependencyProperty that goes with the single context. 
//	        private DependencyProperty 
	        this._property = null;
		},
		
	      /// <summary> 
        /// Makes a mutable deep base value clone of this Freezable.
        /// 
        /// Caveat: Frozen default values will still be frozen afterwards
        /// </summary>
        /// <returns>A clone of the Freezable.</returns>
//        public Freezable 
        Clone:function() 
        {
        	this.ReadPreamble(); 
 
            /*Freezable*/var clone = this.CreateInstance();
 
            clone.CloneCore(this);

            return clone; 
        },
 
        /// <summary> 
        /// Makes a mutable current value clone of this Freezable.
        /// 
        /// Caveat: Frozen default values will still be frozen afterwards
        /// </summary>
        /// <returns>
        /// Returns a mutable deep copy of this Freezable that represents 
        /// its current state.
        /// </returns> 
//        public Freezable 
        CloneCurrentValue:function() 
        {
        	this.ReadPreamble(); 

            /*Freezable*/var clone = this.CreateInstance();

            clone.CloneCurrentValueCore(this); 


            return clone;
        },
 
        /// <summary>
        ///     Semantically equivalent to Freezable.Clone().Freeze() except that 
        ///     GetAsFrozen avoids a copying any portions of the Freezable graph 
        ///     which are already frozen.
        /// </summary> 
//        public Freezable 
        GetAsFrozen:function()
        {
        	this.ReadPreamble();
 
            if (this.IsFrozenInternal)
            { 
                return this; 
            }
 
            /*Freezable*/var clone = this.CreateInstance();

            clone.GetAsFrozenCore(this);

            clone.Freeze(); 
 
            return clone;
        }, 


        /// <summary>
        ///     Semantically equivalent to Freezable.CloneCurrentValue().Freeze() except that 
        ///     GetCurrentValueAsFrozen avoids a copying any portions of the Freezable graph
        ///     which are already frozen. 
        /// </summary> 
//        public Freezable 
        GetCurrentValueAsFrozen:function()
        { 
        	this.ReadPreamble();

            if (this.IsFrozenInternal)
            { 
                return this;
            } 
 
            /*Freezable*/var clone = this.CreateInstance();
 
            clone.GetCurrentValueAsFrozenCore(this);

            clone.Freeze(); 

            return clone; 
        }, 



        /// <summary>
        /// Does an in-place modification to make the object frozen. It is legal to
        /// call this on values that are already frozen. 
        /// </summary>
        /// <exception cref="System.InvalidOperationException">This exception 
        /// will be thrown if this Freezable can't be frozen. Use 
        /// the CanFreeze property to detect this in advance.</exception>
//        public void 
        Freeze:function() 
        {
            // Check up front that the operation will succeed before we begin.
            if (!this.CanFreeze)
            { 
                throw new InvalidOperationException(SR.Get(SRID.Freezable_CantFreeze));
            } 
 
            this.Freeze(/* isChecking = */ false);
        },
        /// Override OnPropertyChanged so that we can fire the Freezable's Changed 
        /// handler in response to a DP changing.
        /// </remarks> 
//        protected override void 
        OnPropertyChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        {
//            base.OnPropertyChanged(e);
            DependencyObject.prototype.OnPropertyChanged.call(this, e);
 
            // The property system will call us back when a SetValue is performed
            // on a Freezable.  The Freezable then walks it's contexts and causes 
            // a subproperty invalidation on each context and fires any changed 
            // handlers that have been registered.
 
            // When a default value is being promoted to a local value the sub property
            // change that caused the promotion is being merged with the value promotion
            // change. This fix was implemented for DevDivBug#108642. It is required to
            // detect this case specially and propagate subproperty invalidations for it. 

            if (!e.IsASubPropertyChange || e.OperationType == OperationType.ChangeMutableDefaultValue) 
            { 
            	this.WritePostscript();
            } 

        },
 
 
        /// <summary>
        /// Create a default instance of a Freezable object. Actual allocation 
        /// will occur in CreateInstanceCore.
        /// </summary>
        /// <returns>A new instance of the class</returns>
//        protected Freezable 
        CreateInstance:function() 
        {
            /*Freezable*/var newFreezable = this.CreateInstanceCore(); 
 
            return newFreezable;
        },

        // 
        /// <summary>
        /// Subclasses must implement this to create instances of themselves. 
        /// See the Freezable documentation for examples. 
        /// </summary>
        /// <returns>A new instance of the class</returns> 
//        protected abstract Freezable 
        CreateInstanceCore:function(){
        	
        },

        /// <summary>
        /// If you derive from Freezable you may need to override this method. Reasons 
        /// to override include:
        ///    1) Your subclass has data that is not exposed via DPs 
        ///    2) Your subclass has to perform extra work during construction. For 
        ///       example, your subclass implements ISupportInitialize.
        /// 
        /// The default implementation makes deep clones of all writable, locally set
        /// properties including expressions. The property's base value is copied -- not the
        /// current value. It skips read only DPs.
        /// 
        /// If you do override this method, you MUST call the base implementation.
        /// 
        /// This is called by Clone(). 
        /// </summary>
        /// <param name="sourceFreezable">The Freezable to clone information from</param> 
//        protected virtual void 
        CloneCore:function(/*Freezable*/ sourceFreezable)
        {
        	this.CloneCoreCommon(sourceFreezable,
                /* useCurrentValue = */ false, 
                /* cloneFrozenValues = */ true);
        }, 
 
        /// <summary>
        /// If you derive from Freezable you may need to override this method. Reasons 
        /// to override include:
        ///    1) Your subclass has data that is not exposed via DPs
        ///    2) Your subclass has to perform extra work during construction. For
        ///       example, your subclass implements ISupportInitialize. 
        ///
        /// The default implementation goes through all DPs making copies of their 
        /// current values. It skips read only and default DPs 
        ///
        /// If you do override this method, you MUST call the base implementation. 
        ///
        /// This is called by CloneCurrentValue().
        /// </summary>
        /// <param name="sourceFreezable">The Freezable to copy info from</param> 
//        protected virtual void 
        CloneCurrentValueCore:function(/*Freezable*/ sourceFreezable)
        { 
        	this.CloneCoreCommon(sourceFreezable, 
                /* useCurrentValue = */ true,
                /* cloneFrozenValues = */ true); 
        },

        /// <summary>
        /// If you derive from Freezable you may need to override this method. Reasons 
        /// to override include:
        ///    1) Your subclass has data that is not exposed via DPs 
        ///    2) Your subclass has to perform extra work during construction. For 
        ///       example, your subclass implements ISupportInitialize.
        /// 
        /// The default implementation makes clones of all writable, unfrozen, locally set
        /// properties including expressions. The property's base value is copied -- not the
        /// current value. It skips read only DPs and any values which are already frozen.
        /// 
        /// If you do override this method, you MUST call the base implementation.
        /// 
        /// You do not need to Freeze values as they are copied.  The result will be 
        /// frozen by GetAsFrozen() before being returned.
        /// 
        /// This is called by GetAsFrozen().
        /// </summary>
        /// <param name="sourceFreezable">The Freezable to clone information from</param>
//        protected virtual void 
        GetAsFrozenCore:function(/*Freezable*/ sourceFreezable) 
        {
        	this.CloneCoreCommon(sourceFreezable, 
                /* useCurrentValue = */ false, 
                /* cloneFrozenValues = */ false);
        }, 

        /// <summary>
        /// If you derive from Freezable you may need to override this method. Reasons
        /// to override include: 
        ///    1) Your subclass has data that is not exposed via DPs
        ///    2) Your subclass has to perform extra work during construction. For 
        ///       example, your subclass implements ISupportInitialize. 
        ///
        /// The default implementation goes through all DPs making copies of their 
        /// current values. It skips read only DPs and any values which are already frozen.
        ///
        /// If you do override this method, you MUST call the base implementation.
        /// 
        /// You do not need to Freeze values as they are copied.  The result will be
        /// frozen by GetCurrentValueAsFrozen() before being returned. 
        /// 
        /// This is called by GetCurrentValueAsFrozen().
        /// </summary> 
        /// <param name="sourceFreezable">The Freezable to clone information from</param>
//        protected virtual void 
        GetCurrentValueAsFrozenCore:function(/*Freezable*/ sourceFreezable)
        {
        	this.CloneCoreCommon(sourceFreezable, 
                /* useCurrentValue = */ true,
                /* cloneFrozenValues = */ false); 
        }, 

        /// <summary> 
        /// If you derive from Freezable you will need to override this if your subclass
        /// has data that is not exposed via DPs.
        ///
        /// The default implementation goes through all DPs and returns false 
        /// if any DP has an expression or if any Freezable DP cannot freeze.
        /// 
        /// If you do override this method, you MUST call the base implementation. 
        ///
        /// This is called by Freeze(). 
        /// </summary>
        /// <param name="isChecking">If this is true, the method will just check
        /// to see that the object can be frozen, but won't actually freeze it.
        /// </param> 
        /// <returns>True if the Freezable is or can be frozen.</returns>
//        protected virtual bool 
        FreezeCore:function(/*bool*/ isChecking) 
        { 
            /*EffectiveValueEntry[]*/var effectiveValues = this.EffectiveValues;
            var numEffectiveValues = this.EffectiveValuesCount; 

            // Loop through all DPs and call their FreezeValueCallback.
            for (var i = 0; i < numEffectiveValues; i++)
            { 
                /*DependencyProperty*/var dp =
                    DependencyProperty.RegisteredPropertyList.List[effectiveValues[i].PropertyIndex]; 
 
                if (dp != null)
                { 
                    /*EntryIndex*/var entryIndex = new EntryIndex(i);
                    /*PropertyMetadata*/var metadata = dp.GetMetadata(this.DependencyObjectType);

                    /*FreezeValueCallback*/var freezeValueCallback = metadata.FreezeValueCallback; 
                    if(!freezeValueCallback.Call(this, dp, entryIndex, metadata, isChecking))
                    { 
                        return false; 
                    }
                } 
            }

            return true;
        }, 


 
        /// <summary> 
        /// Gets an EventStorage object to be used to cache event handlers and sets it to be
        /// in use. 
        /// </summary>
        /// <returns>
        /// An EventStorage object to be used to cache event handlers that is set
        /// to be in use. 
        /// </returns>
//        private EventStorage 
        GetEventStorage:function() 
        { 
            /*EventStorage*/var eventStorage = this.CachedEventStorage;
 
            // if we reach a case where EventStorage is being used - meaning FireChanged called
            // a handler that in turn called FireChanged which is probably a bad thing to have
            // happen - just allocate a new one that won't be cached.
            if (eventStorage.InUse) 
            {
                // use the cached EventStorage's physical size as an estimate of how big we 
                // need to be in order to avoid growing the newly created EventStorage 
                var cachedPhysicalSize = eventStorage.PhysicalSize;
                eventStorage = new EventStorage(cachedPhysicalSize); 
            }

            eventStorage.InUse = true;
 
            return eventStorage;
        }, 
 
        /// <summary>
        /// This method is called when a modification happens to the Freezable object. 
        /// </summary>
//        protected virtual void 
        OnChanged:function()
        {
        }, 

 
        /// <summary> 
        /// This method walks up the context graph recursively, gathering all change handlers that
        /// exist at or above the current node, placing them in calledHandlers.  While 
        /// performing the walk it will also call OnChanged and InvalidateSubProperty on all
        /// DO/DP pairs encountered on the walk.
        /// </summary>
//        private void 
        GetChangeHandlersAndInvalidateSubProperties:function(/*ref EventStorage calledHandlers*/calledHandlersRef) 
        {
            this.OnChanged(); 
 
            /*Freezable*/var contextAsFreezable;
 
            if (this.Freezable_UsingSingletonContext)
            {
                /*DependencyObject*/var context = this.SingletonContext;
 
                contextAsFreezable = context instanceof Freezable ? context : null;
                if (contextAsFreezable != null) 
                { 
                    contextAsFreezable.GetChangeHandlersAndInvalidateSubProperties(/*ref calledHandlers*/calledHandlersRef);
                } 

                if (SingletonContextProperty != null)
                {
                    context.InvalidateSubProperty(SingletonContextProperty); 
                }
            } 
            else if (this.Freezable_UsingContextList) 
            {
                /*FrugalObjectList<FreezableContextPair>*/var contextList = this.ContextList; 

                /*DependencyObject*/var lastDO = null;

                var deadRefs = 0; 
                for (var i = 0, count = contextList.Count; i < count; i++)
                { 
                    /*FreezableContextPair*/var currentContext = contextList[i]; 

                    /*DependencyObject*/var currentDO = currentContext.Owner.Target; 
                    if (currentDO != null)
                    {
                        // we only want to grab change handlers once per context reference - so skip
                        // until we find a new one 
                        if (currentDO != lastDO)
                        { 
                            contextAsFreezable = currentDO instanceof Freezable ? currentDO : null; 
                            if (contextAsFreezable != null)
                            { 
                                contextAsFreezable.GetChangeHandlersAndInvalidateSubProperties(/*ref calledHandlers*/calledHandlersRef);
                            }

                            lastDO = currentDO; 
                        }
 
                        if (currentContext.Property != null) 
                        {
                            currentDO.InvalidateSubProperty(currentContext.Property); 
                        }
                    }
                    else
                    { 
                        ++deadRefs;
                    } 
                } 

                this.PruneContexts(contextList, deadRefs); 
            }


            this.GetHandlers(/*ref calledHandlers*/calledHandlersRef); 
        },
 
 
        /// <summary>
        /// Extenders of Freezable must call this method at the beginning of any 
        /// public API which reads the state of the object.  (e.g., a proprety getter.)
        /// This ensures that the object is being accessed from a valid thread.
        /// </summary>
//        protected void 
        ReadPreamble:function() 
        {
        }, 

        /// <summary> 
        /// Extenders of Freezable must call this method prior to changing the state
        /// of the object (e.g. the beginning of a property setter.)  This ensures that
        /// the object is not frozen and is being accessed from a valid thread.
        /// </summary> 
//        protected void 
        WritePreamble:function()
        { 

            if (this.IsFrozenInternal) 
            {
                throw new InvalidOperationException(
                    SR.Get(SRID.Freezable_CantBeFrozen,GetType().FullName));
            } 
        },
 
        /// <summary> 
        /// Extenders of Freezable must call this method at the end of an API which
        /// changed the state of the object (e.g., at the end of a property setter) to 
        /// raise the Changed event.  Multiple state changes within a method or
        /// property may be "batched" into a single call to WritePostscript().
        /// </summary>
//        protected void 
        WritePostscript:function() 
        {
        	this.FireChanged(); 
        }, 

        /// <summary> 
        /// Extenders of Freezable call this to set in a new value for internal
        /// properties or other embedded values that themselves are DependencyObjects.
        /// This method insures that the appropriate context pointers are set up for
        ///  the old and the new Dependency objects. 
        ///
        /// In this version the property is set to be null since 
        /// it is not explicitly specified. 
        ///
        /// </summary> 
        /// <param name="oldValue">The previous value of the property.</param>
        /// <param name="newValue">The new value to set into the property</param>
//        protected void 
        OnFreezablePropertyChanged:function(
            /*DependencyObject*/ oldValue, 
            /*DependencyObject*/ newValue
            ) 
        { 
        	this.OnFreezablePropertyChanged(oldValue, newValue, null);
        }, 

        /// <summary>
        /// Extenders of Freezable call this to set in a new value for internal
        /// properties or other embedded values that themselves are DependencyObjects. 
        /// This method insures that the appropriate context pointers are set up for
        /// the old and the new DependencyObject objects. 
        /// </summary> 
        /// <param name="oldValue">The previous value of the property.</param>
        /// <param name="newValue">The new value to set into the property</param> 
        /// <param name="property">The property that is being changed or null if none</param>
//        protected void 
        OnFreezablePropertyChanged:function(
            /*DependencyObject*/ oldValue,
            /*DependencyObject*/ newValue, 
            /*DependencyProperty*/ property
            ) 
        { 
            // NTRAID#Longhorn-1023842 -4/27/2005-[....]
            // 
            //    We should ensure dispatchers are consistent *before* modifying
            //    changed handlers, otherwise we will leave the freezable in an
            //    inconsistent state.
            // 
            if (newValue != null)
            { 
//            	this.EnsureConsistentDispatchers(this, newValue); 
            }
 
            if (oldValue != null)
            {
            	this.RemoveSelfAsInheritanceContext(oldValue, property);
            } 

            if (newValue != null) 
            { 
            	this.ProvideSelfAsInheritanceContext(newValue, property);
            } 
        },
        
        /// <summary>
        /// Seal this freezable 
        /// </summary> 
//        void ISealable.
        Seal:function()
        { 
        	this.Freeze();
        },
 
        /// <summary>
        /// Clears off the context storage and all Changed event handlers 
        /// </summary>
//        internal void 
        ClearContextAndHandlers:function()
        {
        	this.Freezable_UsingHandlerList = false; 
        	this.Freezable_UsingContextList = false;
        	this.Freezable_UsingSingletonHandler = false; 
        	this.Freezable_UsingSingletonContext = false; 
        	this._contextStorage = null;
        	this._property = null; 
        },


        /// <summary> 
        /// Raises changed notifications for this Freezable.  This includes
        /// calling the OnChanged virtual, invalidating sub properties, and 
        /// raising the Changed event. 
        /// </summary>
//        internal void 
        FireChanged:function() 
        {
            // to avoid access costs, we start with calledHandlers at null and then
            // set it the first time we encounter change handlers that need to be stored.
            /*EventStorage*/var calledHandlers = null; 
            var calledHandlersRef = {
            	"calledHandlers" : calledHandlers	
            };

            this.GetChangeHandlersAndInvalidateSubProperties(/*ref calledHandlers*/calledHandlersRef); 
            calledHandlers = calledHandlersRef.calledHandlers;
 
            // Fire all of the change handlers
            if (calledHandlers != null) 
            {
                for (var i = 0, count = calledHandlers.Count; i < count; i++)
                {
                    // Note: there is a known issue here where if one of these handlers 
                    // throws an exception, then we effectively will no longer be able to
                    // use the EventStorage cache since it will not be possible to set its InUse flag 
                    // to false, and we will also keep any memory it was pointing to alive. 
                    // Everything will continue to function normally, however, we will be allocating
                    // a new EventStorage each time rather than using the one stored in the cache. 
                    // Catching the exception and clearing the flag (and nulling
                    // out the contents) will solve it, but due to Task #45099 on the exception
                    // strategy for the property engine, this has not yet been implemented.
                    // 
                    // call the function and then set to null to avoid hanging on to any
                    // references. 
                    calledHandlers.Get(i).Invoke(this, EventArgs.Empty); 
                    calledHandlers.Set(i, null);
                } 

                // we no longer need the EventStorage object - clear its contents and set
                // it to not be in use.
                calledHandlers.Clear(); 
                calledHandlers.InUse = false;
            } 
        }, 

//        /// <summary> 
//        /// Calling DependencyObject.Seal() on a Freezable will leave it in a weird
//        /// state - it won't be free-threaded, but since Seal and Freeze use the
//        /// same bit, the Freezable will think it is Frozen.  We therefore disallow
//        /// calling Seal() on a Freezable. 
//        /// </summary>
////        internal override void 
//        Seal:function() 
//        { 
//            Invariant.Assert(false);
//        }, 

//        internal bool 
        Freeze:function(/*bool*/ isChecking) 
        { 
            if (isChecking)
            { 
            	this.ReadPreamble();

                return this.FreezeCore(true);
            } 
            else if (!this.IsFrozenInternal)
            { 
            	this.WritePreamble(); 

                // Check with derived classes to see how they feel about this. 
                // If our caller didn't check CanFreeze this may throw
                // an exception.
                this.FreezeCore(false);
 
                // Any cached default values created using the FreezableDefaultValueFactory
                // must be removed and frozen. Leaving them alone is not an option since they will 
                // attempt to promote themselves to locally-set if the user modifies them - 
                // at that point this object will be sealed and the SetValue call will throw an
                // exception. For Freezables we're required to freeze all DPs, so for performance 
                // we simply toss out the cache and return the frozen default prototype, which has
                // exactly the same state as the cached default (see PropertyMetadata.GetDefaultValue()).
                PropertyMetadata.RemoveAllCachedDefaultValues(this);
 
                // Since this object no longer changes it won't be able to notify dependents
                DependencyObject.DependentListMapField.ClearValue(this); 
 
                // The heart of Freeze.  IsFrozen will now return
                // true, we keep the handler status bits since we haven't changed our 
                // handler storage yet.
                this.Freezable_Frozen = true;

//                this.DetachFromDispatcher(); 

                // We do notify now, since we're "changing" to frozen.  But not 
                // until after everything below us is frozen. 
                this.FireChanged();
 
                this.ClearContextAndHandlers(); 

                this.WritePostscript(); 
            }

            return true;
        }, 

        // Makes a deep clone of a Freezable.  Helper method for 
        // CloneCore(), CloneCurrentValueCore() and GetAsFrozenCore() 
        //
        // If useCurrentValue is true it calls GetValue on each of the sourceFreezable's DPs; if false 
        // it uses ReadLocalValue.
//        private void 
        CloneCoreCommon:function(/*Freezable*/ sourceFreezable, /*bool*/ useCurrentValue, /*bool*/ cloneFrozenValues)
        {
            /*EffectiveValueEntry[]*/var srcEffectiveValues = sourceFreezable.EffectiveValues; 
            /*uint*/var srcEffectiveValueCount = sourceFreezable.EffectiveValuesCount;
 
            // Iterate through the effective values array.  Note that default values aren't 
            // stored here so the only defaults we'll come across are modified defaults,
            // which useCurrentValue = true uses and useCurrentValue = false ignores. 
            for (var i = 0; i < srcEffectiveValueCount; i++)
            {
                /*EffectiveValueEntry*/var srcEntry = srcEffectiveValues[i];
 
                /*DependencyProperty*/var dp = DependencyProperty.RegisteredPropertyList.List[srcEntry.PropertyIndex];
 
                // We need to skip ReadOnly properties otherwise SetValue will fail 
                if ((dp != null) && !dp.ReadOnly)
                { 
                    /*object*/var sourceValue;

                    /*EntryIndex*/var entryIndex = new EntryIndex(i);
 
                    if (useCurrentValue)
                    { 
                        sourceValue = sourceFreezable.GetValueEntry(
                                            entryIndex,
                                            dp, 
                                            null,
                                            RequestFlags.FullyResolved).Value; 
 
                    }
                    else // use base values
                    {
                        // If the local value has modifiers, ReadLocalValue will return the base 
                        // value, which is what we want.  A modified default will return UnsetValue,
                        // which will be ignored at the call to SetValue 
                        sourceValue = sourceFreezable.ReadLocalValueEntry(entryIndex, dp, true /* allowDeferredReferences */); 

                        // For the useCurrentValue = false case we ignore any UnsetValues. 
                        if (sourceValue == Type.UnsetValue)
                        {
                            continue;
                        } 

                        // If the DP is an expression ReadLocalValue will return the actual expression. 
                        // In this case we need to copy it. 
                        if (srcEntry.IsExpression)
                        { 
                            sourceValue = /*((Expression)sourceValue)*/sourceValue.Copy(this, dp);
                        }
                    }
 
                    //
                    // If the value of the current DP is a Freezable 
                    // we need to recurse and call the appropriate Clone method in 
                    // order to do a deep copy.
                    // 
 
                    /*Freezable*/var valueAsFreezable = sourceValue instanceof Freezable ? sourceValue : null;
 
                    if (valueAsFreezable != null) 
                    {
                        /*Freezable*/var valueAsFreezableClone; 

                        //
                        // Choose between the four possible ways of
                        // cloning a Freezable 
                        //
                        if (cloneFrozenValues) //CloneCore and CloneCurrentValueCore 
                        { 
                            valueAsFreezableClone = valueAsFreezable.CreateInstanceCore();
 
                            if (useCurrentValue)
                            {
                                // CloneCurrentValueCore implementation.  We clone even if the
                                // Freezable is frozen by recursing into CloneCurrentValueCore. 
                                valueAsFreezableClone.CloneCurrentValueCore(valueAsFreezable);
                            } 
                            else 
                            {
                                // CloneCore implementation.  We clone even if the Freezable is 
                                // frozen by recursing into CloneCore.
                                valueAsFreezableClone.CloneCore(valueAsFreezable);
                            }
 
                            sourceValue = valueAsFreezableClone;
                        } 
                        else // skip cloning frozen values
                        { 

                            if (!valueAsFreezable.IsFrozen)
                            {
                                valueAsFreezableClone = valueAsFreezable.CreateInstanceCore(); 

                                if (useCurrentValue) 
                                { 
                                    // GetCurrentValueAsFrozenCore implementation.  Only clone if the
                                    // Freezable is mutable by recursing into GetCurrentValueAsFrozenCore. 
                                    valueAsFreezableClone.GetCurrentValueAsFrozenCore(valueAsFreezable);
                                }
                                else
                                { 
                                    // GetAsFrozenCore implementation.  Only clone if the Freezable is
                                    // mutable by recursing into GetAsFrozenCore. 
                                    valueAsFreezableClone.GetAsFrozenCore(valueAsFreezable); 
                                }
 
                                sourceValue = valueAsFreezableClone;
                            }
                        } 
                    }
 
                    this.SetValue(dp, sourceValue); 
                }
            } 
        },
        
        // These methods provide an abstraction for managing Freezable context
        // information - the context information being DO/DP pairs that the Freezable maps to. 
        //
        // The methods will attempt to use as little memory as possible to store this information. 
        // When there is only one context it will store the information directly, otherwise it will 
        // place it within a list.  When using a list, these methods place the DO/DP pairs so
        // that DOs are grouped together.  This is done so that when walking the graph, it 
        // is easier to track which DO's change handlers have already been gathered.
        //

        /// <summary> 
        /// Removes the context information for a Freezable.
        /// <param name="context">The DependencyObject to remove that references this Freezable.</param> 
        /// <param name="property">The property of the DependencyObject this object maps to or null if none.</param> 
        /// </summary>
//        private void 
        RemoveContextInformation:function(/*DependencyObject*/ context, /*DependencyProperty*/ property) 
        {
            var failed = true; 

            if (this.Freezable_UsingSingletonContext) 
            { 
                if (this.SingletonContext == context && SingletonContextProperty == property)
                { 
                	this.RemoveSingletonContext();
                    failed = false;
                }
            } 
            else if (Freezable_UsingContextList)
            { 
                /*FrugalObjectList<FreezableContextPair>*/var list = this.ContextList; 

                var deadRefs = 0; 
                var index = -1;
                var count = list.Count;

                for (var i = 0; i < count; i++) 
                {
                    /*FreezableContextPair*/var entry = list[i]; 
 
                    /*object*/var owner = entry.Owner.Target;
                    if (owner != null) 
                    {
                        if (failed && entry.Property == property && owner == context)
                        {
                            index = i; 
                            failed = false;
                        } 
                    } 
                    else
                    { 
                        ++deadRefs;
                    }
                }
 
                if (index != -1)
                { 
                    list.RemoveAt(index); 
                }

                this.PruneContexts(list, deadRefs);
            } 

            // Make sure we actually removed something - if not throw an exception 
            if (failed) 
            {
                throw new ArgumentException(SR.Get(SRID.Freezable_NotAContext), "context"); 
            }
        },

        /// <summary> 
        /// Removes the single piece of contextual information that we have and updates all flags
        /// accordingly. 
        /// </summary> 
//        private void 
        RemoveSingletonContext:function()
        { 
            if (this.HasHandlers) 
            {
            	this._contextStorage = this._contextStorage._handlerStorage; 
            } 
            else
            { 
            	this._contextStorage = null;
            }

            this.Freezable_UsingSingletonContext = false; 
        },
 
        /// <summary> 
        /// Removes the context list and updates all flags accordingly.
        /// </summary> 
//        private void 
        RemoveContextList:function()
        {
            if (this.HasHandlers)
            { 
            	this._contextStorage = this._contextStorage._handlerStorage; 
            }
            else 
            {
            	this._contextStorage = null;
            }
 
            this.Freezable_UsingContextList = false;
        }, 
 

        /// <summary> 
        /// Helper function to add context information to a Freezable.
        /// </summary>
        /// <param name="context">The DependencyObject to add that references this Freezable.</param>
        /// <param name="property">The property of the DependencyObject this object maps to or null if none.</param> 
//        internal override void 
        AddInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property)
        { 

            if (!this.IsFrozenInternal) 
            {
                /*DependencyObject*/var oldInheritanceContext = this.InheritanceContext; 
 
                this.AddContextInformation(context, property);
 
                // Check if the context has changed
                // If we are frozen, or we already had multiple contexts, the context has not changed
                if (oldInheritanceContext != this.InheritanceContext)
                { 
                	this.OnInheritanceContextChanged(EventArgs.Empty);
                } 
            } 
        },
 
        /// <summary>
        /// Helper function to remove context information from a Freezable.
        /// </summary>
        /// <param name="context">The DependencyObject that references this Freezable.</param> 
        /// <param name="property">The property of the DependencyObject this object maps to or null if none.</param>
//        internal override void 
        RemoveInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property) 
        { 
            if (!this.IsFrozenInternal)
            {
                /*DependencyObject*/var oldInheritanceContext = this.InheritanceContext;
 
                this.RemoveContextInformation(context, property);
 
                // Check if the context has changed 
                // If we are frozen, or we already had multiple contexts, the context has not changed
                if (oldInheritanceContext != this.InheritanceContext) 
                {
                	this.OnInheritanceContextChanged(EventArgs.Empty);
                }
            } 
        },
 
        /// <summary> 
        /// Adds context information to a Freezable.
        /// <param name="context">The DependencyObject to add that references this Freezable.</param> 
        /// <param name="property">The property of the DependencyObject this object maps to or null if none.</param>
        /// </summary>
//        internal void 
        AddContextInformation:function(/*DependencyObject*/ context, /*DependencyProperty*/ property)
        { 
 
            if (this.Freezable_UsingSingletonContext) 
            {
            	this.ConvertToContextList(); 
            }

            if (this.Freezable_UsingContextList)
            { 
            	this.AddContextToList(context, property);
            } 
            else 
            {
            	this.AddSingletonContext(context, property); 
            }
        },

        /// <summary> 
        /// Helper function to convert to using a list to store context information.
        /// The SingletonContext is inserted into the list. 
        /// </summary> 
//        private void 
        ConvertToContextList:function()
        { 
            // The list is initialized with capacity for 2 entries since we
            // know we have a 2nd context to insert, hence the conversion 
            // from the singleton context state.
            /*FrugalObjectList<FreezableContextPair>*/
        	var list = new FrugalObjectList/*<FreezableContextPair>*/(2); 
 
            // Note: This converts the SingletonContext from a strong reference to a WeakReference
            list.Add(new FreezableContextPair(this.SingletonContext, SingletonContextProperty)); 

            if (this.HasHandlers)
            {
            	this._contextStorage._contextStorage = list; 
            }
            else 
            { 
            	this._contextStorage = list;
            } 

            this.Freezable_UsingContextList = true;
            this.Freezable_UsingSingletonContext = false;
 
            // clear the singleton context property
            this._property = null; 
        }, 

        /// <summary> 
        /// Helper function to add a singleton context to the Freezable's storage
        /// <param name="context">The DependencyObject to add that references this Freezable.</param>
        /// <param name="property">The property of the DependencyObject this object maps to or null if none.</param>
        /// </summary> 
//        private void 
        AddSingletonContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property)
        { 
            if (this.HasHandlers)
            {
                /*HandlerContextStorage*/var hps = new HandlerContextStorage();
 
                hps._handlerStorage = this._contextStorage;
                hps._contextStorage = context; 
 
                this._contextStorage = hps;
            } 
            else
            {
            	this._contextStorage = context;
            } 

            // set the singleton context property 
            this._property = property; 

            this.Freezable_UsingSingletonContext = true; 
        },

        /// <summary>
        /// Adds the context information to the context list.  It does this by inserting the 
        /// new context information in a location so that all context information referring
        /// to the same DO are grouped together. 
        /// </summary> 
        /// <param name="context">The DependencyObject to add that references this Freezable.</param>
        /// <param name="property">The property of the DependencyObject this object maps to or null if none.</param> 
//        private void 
        AddContextToList:function(/*DependencyObject*/ context, /*DependencyProperty*/ property)
        {
            /*FrugalObjectList<FreezableContextPair>*/var list = ContextList;
            var count = list.Count; 
            var insertIndx = count;        // insert at the end by default 
            var deadRefs = 0;
 
            /*DependencyObject*/var lastContext = null;
            var multipleInheritanceContextsFound = this.HasMultipleInheritanceContexts;  // We can never leave this state once there

            // 
            var newInheritanceContext = context.CanBeInheritanceContext && !this.IsInheritanceContextSealed;  // becomes false if we find context on the list

            for (var i = 0; i < count; i++)
            { 
                /*DependencyObject*/var currentContext = list[i].Owner.Target;
                if (currentContext != null) 
                { 
                    if (currentContext == context)
                    { 
                        // insert after the last matching context
                        insertIndx = i + 1;
                        newInheritanceContext = false;
                    } 

                    if (newInheritanceContext && !multipleInheritanceContextsFound) 
                    { 
                        if (currentContext != lastContext && currentContext.CanBeInheritanceContext)  // Count remaining inheritance contexts
                        { 
                            // We already found a previous inheritance context, so we have multiple ones
                            multipleInheritanceContextsFound = true;
                            this.Freezable_HasMultipleInheritanceContexts = true;
                        } 
                        lastContext = currentContext;
                    } 
                } 
                else
                { 
                    ++deadRefs;
                }
            }
 
            list.Insert(insertIndx, new FreezableContextPair(context, property));
 
            this.PruneContexts(list, deadRefs); 
        },
 

//        private void 
        PruneContexts:function(/*FrugalObjectList<FreezableContextPair>*/ oldList, /*int*/ numDead)
        {
            var count = oldList.Count; 

            if (count - numDead == 0) 
            { 
            	this.RemoveContextList();
            } 
            else if (numDead > 0)
            {
                /*FrugalObjectList<FreezableContextPair>*/
            	var newList =
                    new FrugalObjectList/*<FreezableContextPair>*/(count - numDead); 

                for (var i = 0; i < count; i++) 
                { 
                    if (oldList[i].Owner.IsAlive)
                    { 
                        newList.Add(oldList[i]);
                    }
                }
 
                this.ContextList = newList;
            } 
        }, 

        /// <summary> 
        /// Helper function to get all of the event handlers for the Freezable and
        /// place them in the calledHandlers list.
        /// <param name="calledHandlers"> Where to place the change handlers for the Freezable. </param>
        /// </summary> 
//        private void 
        GetHandlers:function(/*ref EventStorage calledHandlers*/calledHandlersRef)
        { 
            if (this.Freezable_UsingSingletonHandler) 
            {
                if (calledHandlersRef.calledHandlers == null) 
                {
                	calledHandlersRef.calledHandlers = this.GetEventStorage();
                }
 
                calledHandlersRef.calledHandlers.Add(SingletonHandler);
            } 
            else if (this.Freezable_UsingHandlerList) 
            {
                if (calledHandlersRef.calledHandlers == null) 
                {
                	calledHandlersRef.calledHandlers = this.GetEventStorage();
                }
 
                /*FrugalObjectList<EventHandler>*/
                var handlers = this.HandlerList;
 
                for (var i = 0, count = handlers.Count; i < count; i++) 
                {
                	calledHandlersRef.calledHandlers.Add(handlers[i]); 
                }
            }
        },
 
        /// <summary>
        /// Add the specified EventHandler 
        /// </summary> 
        /// <param name="handler">Handler to add</param>
//        private void 
        HandlerAdd:function(/*EventHandler*/ handler) 
        {
            if (this.Freezable_UsingSingletonHandler) 
            {
            	this.ConvertToHandlerList(); 
            } 

            if (this.Freezable_UsingHandlerList) 
            {
            	this.HandlerList.Add(handler);
            }
            else 
            {
            	this.AddSingletonHandler(handler); 
            } 
        },
 
        /// <summary>
        /// Remove the specified EventHandler
        /// </summary>
        /// <param name="handler">Handler to remove</param> 
//        private void 
        HandlerRemove:function(/*EventHandler*/ handler)
        { 
            var failed = true; 

            if (this.Freezable_UsingSingletonHandler)
            {
                if (this.SingletonHandler == handler) 
                {
                	this.RemoveSingletonHandler(); 
                    failed = false; 
                }
            } 
            else if (this.Freezable_UsingHandlerList)
            {
                /*FrugalObjectList<EventHandler>*/var handlers = HandlerList;
                var index = handlers.IndexOf(handler); 

                if (index >= 0) 
                { 
                    handlers.RemoveAt(index);
                    failed = false; 
                }

                if (handlers.Count == 0)
                { 
                	this.RemoveHandlerList();
                } 
            } 

            if (failed) 
            {
                throw new ArgumentException(SR.Get(SRID.Freezable_UnregisteredHandler), "handler");
            }
        },

        // 
        //  Removes the singleton handler the Freezable is storing and resets 
        //  any state indicating this.
        // 
//        private void 
        RemoveSingletonHandler:function()
        {
            if (this.HasContextInformation)
            { 
            	this._contextStorage = this._contextStorage._contextStorage; 
            }
            else 
            {
            	this._contextStorage = null;
            }
 
            this.Freezable_UsingSingletonHandler = false;
        },
 
        //
        //  Removes the handler list the Freezable is storing and resets 
        //  any state indicating this.
        //
//        private void 
        RemoveHandlerList:function()
        { 
            if (this.HasContextInformation) 
            {
            	this._contextStorage = /*((HandlerContextStorage)*/this._contextStorage._contextStorage; 
            }
            else
            {
            	this._contextStorage = null; 
            }
 
            this.Freezable_UsingHandlerList = false; 
        },
 
        /// <summary>
        /// Helper function to convert to using a list to store context information.
        /// The SingletonContext is inserted into the list.
        /// </summary> 
//        private void 
        ConvertToHandlerList:function()
        { 
            /*EventHandler*/
        	var singletonHandler = this.SingletonHandler; 

            // The list is initialized with capacity for 2 entries since we
            // know we have a 2nd handler to insert, hence the conversion
            // from the singleton handler state. 
            /*FrugalObjectList<EventHandler>*/
            var list = new FrugalObjectList/*<EventHandler>*/(2);
 
            list.Add(singletonHandler); 

            if (this.HasContextInformation) 
            {
                /*((HandlerContextStorage)*/this._contextStorage._handlerStorage = list;
            }
            else 
            {
            	this._contextStorage = list; 
            } 

            this.Freezable_UsingHandlerList = true; 
            this.Freezable_UsingSingletonHandler = false;
        },

        // 
        // helper function to add a singleton handler.  The passed in handler parameter
        // will be stored as the singleton handler. 
        // 
//        private void 
        AddSingletonHandler:function(/*EventHandler*/ handler)
        { 
            if (this.HasContextInformation) 
            {
                /*HandlerContextStorage*/
            	var hps = new HandlerContextStorage(); 
 
                hps._contextStorage = this._contextStorage;
                hps._handlerStorage = handler; 

                this._contextStorage = hps;
            }
            else 
            {
            	this._contextStorage = handler; 
            } 

            this.Freezable_UsingSingletonHandler = true; 
        },
        
        /// <summary>
        /// The Changed event is raised whenever something on this 
        /// Freezable is modified.  Note that it is illegal to
        /// add or remove event handlers from a value with
        /// IsFrozen.
        /// </summary> 
        /// <exception cref="System.InvalidOperationException">
        /// An attempt was made to modify the Changed handler of 
        /// a value with IsFrozen == true. 
        /// </exception>
        
        AddChangedHandler:function(value)
        {
            this.WritePreamble(); 

            if (value != null) 
            { 
                this.ChangedInternal.Combine(value);
            } 

        },
        
        RemoveChangeHandler:function(value)
        { 
            this.WritePreamble();

            if (value != null) 
            {
                this.ChangedInternal.Remove(value); 
            }
        },
 

	});
	
    // 
    // _eventStorage is used as a performance/memory speedup when firing change handlers. 
    // It exists once per thread for thread safety, and is used to store the list of change
    // handlers that are gathered by GetChangeHandlersAndInvalidateSubProperties.  Reusing the 
    // same EventStorage gives gains because it doesn't need to be reallocated each time
    // FireChanged occurs.
    //
//    static private EventStorage 
    var _eventStorage = null;
	Object.defineProperties(Freezable.prototype,{
        /// <summary> 
        /// True if this Freezable can be frozen (by calling Freeze())
        /// </summary>
//        public bool 
        CanFreeze:
        { 
            get:function()
            { 
                return this.IsFrozenInternal || this.FreezeCore(/* isChecking = */ true); 
            }
        },
        
        /// <summary>
        /// Returns whether or not the Freezable is modifiable.  Attempts 
        /// to set properties on an IsFrozen value result
        /// in exceptions being raised. 
        /// </summary> 
//        public bool 
        IsFrozen:
        { 
            get:function()
            {
            	this.ReadPreamble();
 
                return this.IsFrozenInternal;
            } 
        },

//        internal bool 
        IsFrozenInternal: 
        {
            get:function()
            {
                return this.Freezable_Frozen; 
            }
        },
        
        /// <summary> 
        /// Property to access and intialize the thread static _eventStorage variable.
        /// </summary> 
//        private EventStorage 
        CachedEventStorage:
        {
            get:function()
            { 
                // make sure _eventStorage is not null - with ThreadStatic it appears that the second
                // thread to access the variable will set this to null 
                if (_eventStorage == null) 
                {
                    _eventStorage = new EventStorage(INITIAL_EVENTSTORAGE_SIZE); 
                }

                return _eventStorage;
            } 
        },
        
        /// <summary> 
        /// Can this freezable be sealed
        /// </summary> 
//        bool ISealable.
        CanSeal:
        {
            get:function() { return this.CanFreeze; }
        },

        /// <summary> 
        /// Is this freezable sealed 
        /// </summary>
//        bool ISealable.
        IsSealed: 
        {
            get:function() { return this.IsFrozen; }
        },
        
        // 
        // The below properties help at getting the singleton/list for the context or change handlers.
        // In all cases, if the other object exists (i.e. we want context, and there are also stored handlers), 
        // then _contextStorage is HandlerContextStorage, so we need to get the data we want from that class. 
        //
 
        /// <summary>
        /// Returns the context list the Freezable has.  This function assumes
        /// that UsingContextList is true before being called.
        /// </summary> 
//        private FrugalObjectList<FreezableContextPair> 
        ContextList:
        { 
            get:function() 
            {
                if (this.HasHandlers)
                { 
                    /*HandlerContextStorage*/var ptrStorage = this._contextStorage;
 
                    return ptrStorage._contextStorage; 
                }
                else 
                {
                    return this._contextStorage;
                }
            }, 

            set:function(value)
            { 
                if (this.HasHandlers)
                {
                	this._contextStorage._contextStorage = value; 
                }
                else 
                { 
                	this._contextStorage = value;
                } 
            }
        },

        /// <summary> 
        /// Returns the handler list the Freezable has.  This function assumes
        /// the handlers for the Freezable are stored in a list. 
        /// </summary> 
//        private FrugalObjectList<EventHandler> 
        HandlerList:
        { 
            get:function()
            {
                if (this.HasContextInformation) 
                { 
                    /*HandlerContextStorage*/var ptrStorage = this._contextStorage;
 
                    return ptrStorage._handlerStorage;
                }
                else
                { 
                    return this._contextStorage;
                } 
            } 
        },
 
        /// <summary>
        /// Returns the singleton handler the Freezable has.  This function assumes
        /// that UsingSingletonHandler is true before being called.
        /// </summary> 
//        private EventHandler 
        SingletonHandler:
        { 
            get:function() 
            {
                if (this.HasContextInformation)
                { 
                    /*HandlerContextStorage*/var ptrStorage = this._contextStorage;
 
                    return ptrStorage._handlerStorage; 

                } 
                else
                {
                    return this._contextStorage;
 
                }
            } 
        }, 

        /// <summary> 
        /// Returns the singleton context the Freezable has.  This function assumes
        /// that UsingSingletonContext is true before being called.
        /// </summary>
//        private DependencyObject 
        SingletonContext: 
        {
            get:function() 
            { 
                if (this.HasHandlers)
                {
                    /*HandlerContextStorage*/var ptrStorage = this._contextStorage; 

                    return ptrStorage._contextStorage; 
                } 
                else
                { 
                    return this._contextStorage;
                }
            }
        }, 

        /// <summary> 
        /// Returns/sets the singleton context property of the Freezable.  This 
        /// function assumes that UsingSingletonContext is true before being called.
        /// </summary> 
//        private DependencyProperty 
        SingletonContextProperty:
        {
            get:function()
            { 
 
                return this._property;
            } 
        },

        /// <summary>
        /// Whether the Freezable has event handlers. 
        /// </summary>
//        private bool 
        HasHandlers: 
        { 
            get:function()
            { 
                return (this.Freezable_UsingHandlerList || this.Freezable_UsingSingletonHandler);
            }
        },
 
        /// <summary>
        /// Whether the Freezable has context information. 
        /// </summary> 
//        private bool 
        HasContextInformation:
        { 
            get:function()
            {
                return (this.Freezable_UsingContextList || this.Freezable_UsingSingletonContext);
            } 
        },
 
        /// <summary>
        ///     InheritanceContext
        /// </summary> 
//        internal override DependencyObject 
        InheritanceContext:
        { 
            get:function()
            { 
                if (!this.Freezable_HasMultipleInheritanceContexts)
                {
                    if (this.Freezable_UsingSingletonContext)  // We have exactly one Freezable context
                    { 
                        /*DependencyObject*/var singletonContext = this.SingletonContext;
                        if (singletonContext.CanBeInheritanceContext) 
                        { 
                            return singletonContext;
                        } 
                    }
                    else if (this.Freezable_UsingContextList)
                    {
                        // We have multiple Freezable contexts, but at most one context is valid 
                        /*FrugalObjectList<FreezableContextPair>*/var list = ContextList;
                        var count = list.Count; 
 
                        for (var i = 0; i < count; i++)
                        { 
                            /*DependencyObject*/var currentContext = list.Get(i).Owner.Target;

                            if (currentContext != null && currentContext.CanBeInheritanceContext)
                            { 
                                // This is the first and only valid inheritance context we should find
                                return currentContext; 
                            } 
                        }
                    } 
                }

                return null;  // If we have gotten here, we have either multiple or no valid contexts
            } 
        },
 
        /// <summary> 
        ///     HasMultipleInheritanceContexts
        /// </summary> 
//        internal override bool 
        HasMultipleInheritanceContexts:
        {
            get:function() { return this.Freezable_HasMultipleInheritanceContexts; } 
        },
        
        /// <summary>
        /// The Changed event is raised whenever something on this 
        /// Freezable is modified.  Note that it is illegal to
        /// add or remove event handlers from a value with
        /// IsFrozen.
        /// </summary> 
        /// <exception cref="System.InvalidOperationException">
        /// An attempt was made to modify the Changed handler of 
        /// a value with IsFrozen == true. 
        /// </exception>
//        public event EventHandler 
        Changed:
        {
        	get:function(){
        		return this.ChangedInternal;
        	}
        },
 
//        internal event EventHandler 
        ChangedInternal:
        {
        	get:function(){
        		if(this._ChangedInternal === undefined){
        			this._ChangedInternal = new EventHandler();
        		}
        		
        		return this._ChangedInternal;
        	}
        }
        
	});
	
    /// <summary>
    /// Helper method that just invokes Freeze on provided 
    /// Freezable if it's not null.  Otherwise it doesn't do anything.
    /// </summary> 
    /// <param name="freezable">Freezable to freeze.</param> 
    /// <param name="isChecking">If this is true, the method will just check
    /// to see that the object can be frozen, but won't actually freeze it. 
    /// </param>
    /// <returns>True if the Freezable was or can be frozen.
    /// False if isChecking was true and the Freezable can't be frozen.
    /// </returns> 
    /// <exception cref="System.InvalidOperationException">This exception
    /// will be thrown if isChecking is passed in as false and this 
    /// Freezable can't be frozen.</exception> 
    //

//    static protected internal bool 
	Freezable.Freeze = function(/*Freezable*/ freezable, /*bool*/ isChecking)
    {
        if (freezable != null)
        { 
            return freezable.Freeze(isChecking);
        } 

        // <mcalkins> I guess something that's null is always frozen.
        return true; 
    };

////    private static void 
//    function EnsureConsistentDispatchers(/*DependencyObject*/ owner, /*DependencyObject*/ child) 
//    {
//        // It is illegal to set a DependencyObject from one Dispatcher into a owner 
//        // being serviced by a different Dispatcher (i.e., they need to be on
//        // the same thread or be context free (Dispatcher == null))
//        if (owner.Dispatcher != null &&
//            child.Dispatcher != null && 
//            owner.Dispatcher != child.Dispatcher)
//        { 
//            throw new InvalidOperationException( 
//                SR.Get(SRID.Freezable_AttemptToUseInnerValueWithDifferentThread));
//        } 
//    }
	
	Freezable.Type = new Type("Freezable", Freezable, [DependencyObject.Type, ISealable.Type]);
	return Freezable;
});



