/**
 * ReverseInheritProperty
 */

define(["dojo/_base/declare", "system/Type", "internal/DeferredElementTreeState", "windows/CoreFlags"], 
		function(declare, Type, DeferredElementTreeState, CoreFlags){
	var ReverseInheritProperty = declare("ReverseInheritProperty", Object,{
//		internal ReverseInheritProperty(
//            DependencyPropertyKey flagKey,
//            CoreFlags flagCache, 
//            CoreFlags flagChanged)
//            : this(flagKey, flagCache, flagChanged, CoreFlags.None, CoreFlags.None) 
//        { 
//        }
 
        constructor:function(
            /*DependencyPropertyKey*/ flagKey,
            /*CoreFlags*/ flagCache,
            /*CoreFlags*/ flagChanged, 
            /*CoreFlags*/ flagOldOriginCache,
            /*CoreFlags*/ flagNewOriginCache) 
        { 
        	if(flagOldOriginCache === undefined){
        		flagOldOriginCache = CoreFlags.None;
        	}
        	
        	if(flagNewOriginCache === undefined){
        		flagNewOriginCache = CoreFlags.None;
        	}
        	
            this.FlagKey = flagKey;
            this.FlagCache = flagCache; 
            this.FlagChanged = flagChanged;
            this.FlagOldOriginCache = flagOldOriginCache;
            this.FlagNewOriginCache = flagNewOriginCache;
        },
        
//        internal void OnOriginValueChanged(DependencyObject oldOrigin, DependencyObject newOrigin, ref DeferredElementTreeState oldTreeState)
//        { 
//            OnOriginValueChanged(oldOrigin, newOrigin, null, ref oldTreeState, null);
//        }

//        internal void 
        OnOriginValueChanged:function(/*DependencyObject*/ oldOrigin, 
            /*DependencyObject*/ newOrigin,
            /*IList<DependencyObject>*/ otherOrigins, 
            /*ref DeferredElementTreeState oldTreeState*/oldTreeStateRef, 
            /*Action<DependencyObject, bool>*/ originChangedAction)
        { 
        	if(arguments.length == 3){
        		return this.OnOriginValueChanged(oldOrigin, newOrigin, null, otherOrigins/*ref oldTreeState*/, null);
        	}
        	
            /*DeferredElementTreeState*/var treeStateLocalCopy = oldTreeStateRef.oldTreeState;
            oldTreeStateRef.oldTreeState = null;

            // Determine if one needs to raise notifications of elements 
            // affected by the origin change irrespective of other origins
            var setOriginCacheFlag = ((originChangedAction != null) && 
                                       (this.FlagOldOriginCache != CoreFlags.None) && 
                                       (this.FlagNewOriginCache != CoreFlags.None));
 
            // Step #1
            // Update the cache flags for all elements in the ancestry
            // of the element that got turned off and record the changed nodes
            if (oldOrigin != null) 
            {
                this.SetCacheFlagInAncestry(oldOrigin, false, treeStateLocalCopy, true, setOriginCacheFlag); 
            } 

            // Step #2 
            // Update the cache flags for all elements in the ancestry
            // of the element that got turned on and record the changed nodes
            if (newOrigin != null)
            { 
            	this.SetCacheFlagInAncestry(newOrigin, true, null, true, setOriginCacheFlag);
            } 
            var otherCount = (otherOrigins != null) ? otherOrigins.Count : 0; 
            for (var i = 0; i < otherCount; i++)
            { 
                // setOriginCacheFlag is false, because these flags should not be affected by other origins
                this.SetCacheFlagInAncestry(otherOrigins.Get(i), true, null, false, /*setOriginCacheFlag*/ false);
            }
 
            // Step #3
            // Fire value changed on elements in the ancestry of the element that got turned off. 
            if (oldOrigin != null) 
            {
            	this.FirePropertyChangeInAncestry(oldOrigin, true /* oldValue */, treeStateLocalCopy, originChangedAction); 
            }

            // Step #4
            // Fire value changed on elements in the ancestry of the element that got turned on. 
            if (newOrigin != null)
            { 
            	this.FirePropertyChangeInAncestry(newOrigin, false /* oldValue */, null, originChangedAction); 
            }
 
            if (oldTreeStateRef.oldTreeState == null && treeStateLocalCopy != null)
            {
                // Now that we have applied the old tree state, throw it away.
                treeStateLocalCopy.Clear(); 
                oldTreeStateRef.oldTreeState = treeStateLocalCopy;
            } 
        },

//        private void 
        SetCacheFlagInAncestry:function(/*DependencyObject*/ element, 
            /*bool*/ newValue,
            /*DeferredElementTreeState*/ treeState,
            /*bool*/ shortCircuit,
            /*bool*/ setOriginCacheFlag) 
        {
            var isFlagSet = IsFlagSet(element, this.FlagCache);
            var isFlagOriginCacheSet = (setOriginCacheFlag ? IsFlagSet(element, (newValue ? this.FlagNewOriginCache : this.FlagOldOriginCache)) : false);
 
            // If the cache flag value is undergoing change, record it and
            // propagate the change to the ancestors. 
            if ((newValue != isFlagSet) || 
                (setOriginCacheFlag && !isFlagOriginCacheSet) ||
                !shortCircuit) 
            {
                if (newValue != isFlagSet)
                {
                    SetFlag(element, this.FlagCache, newValue); 

                    // NOTE: we toggle the changed flag instead of setting it so that that way common 
                    // ancestors show resultant unchanged and do not receive any change notification. 
                    SetFlag(element, this.FlagChanged, !IsFlagSet(element, this.FlagChanged));
                } 

                if (setOriginCacheFlag && !isFlagOriginCacheSet)
                {
                    SetFlag(element, (newValue ? this.FlagNewOriginCache : this.FlagOldOriginCache), true); 
                }
 
                // Check for block reverse inheritance flag, elements like popup want to set this. 
                if (BlockReverseInheritance(element))
                { 
                    return;
                }

                // Propagate the flag up the visual and logical trees.  Note our 
                // minimal optimization check to avoid walking both the core
                // and logical parents if they are the same. 
                { 
                    /*DependencyObject*/var coreParent = DeferredElementTreeState.GetInputElementParent(element, treeState);
                    /*DependencyObject*/var logicalParent = DeferredElementTreeState.GetLogicalParent(element, treeState); 

                    if (coreParent != null)
                    {
                        this.SetCacheFlagInAncestry(coreParent, newValue, treeState, shortCircuit, setOriginCacheFlag); 
                    }
                    if (logicalParent != null && logicalParent != coreParent) 
                    { 
                    	this.SetCacheFlagInAncestry(logicalParent, newValue, treeState, shortCircuit, setOriginCacheFlag);
                    } 
                }
            }
        },
 
//        private void 
        FirePropertyChangeInAncestry:function(/*DependencyObject*/ element,
            /*bool*/ oldValue, 
            /*DeferredElementTreeState*/ treeState, 
            /*Action<DependencyObject, bool>*/ originChangedAction)
        { 
            var flagChanged = IsFlagSet(element, this.FlagChanged); 
            var isFlagOldOriginCacheSet = ((this.FlagOldOriginCache == CoreFlags.None) ? false : IsFlagSet(element, this.FlagOldOriginCache)); 
            var isFlagNewOriginCacheSet = ((this.FlagNewOriginCache == CoreFlags.None) ? false : IsFlagSet(element, this.FlagNewOriginCache));
 
            if (flagChanged || isFlagOldOriginCacheSet || isFlagNewOriginCacheSet)
            {
                if (flagChanged)
                { 
                    // if FlagChanged bit is set, then the value has changed effectively
                    // after considering all the origins. Hence change the property value 
                    // and fire notifications. 
                    SetFlag(element, this.FlagChanged, false);
 
                    if (oldValue)
                    {
                        element.ClearValue(this.FlagKey);
                    } 
                    else
                    { 
                        element.SetValue(this.FlagKey, true); 
                    }
 
                    this.FireNotifications(element, oldValue);
                }

                if (isFlagOldOriginCacheSet || isFlagNewOriginCacheSet) 
                {
                	SetFlag(element, this.FlagOldOriginCache, false); 
                	SetFlag(element, this.FlagNewOriginCache, false); 
                    if (isFlagOldOriginCacheSet != isFlagNewOriginCacheSet)
                    { 
                        // if either FlagOldOriginCache or FlagNewOriginCache
                        // are set, then the origin change has affected this node
                        // and hence originChangedAction should be executed.
//                        Debug.Assert(originChangedAction != null); 
                        originChangedAction(element, oldValue);
                    } 
                } 

                // Check for block reverse inheritance flag, elements like popup want to set this. 
                if (BlockReverseInheritance(element))
                {
                    return;
                } 

                // Call FirePropertyChange up the visual and logical trees. 
                // Note our minimal optimization check to avoid walking both 
                // the core and logical parents if they are the same.
                { 
                    /*DependencyObject*/var coreParent = DeferredElementTreeState.GetInputElementParent(element, treeState);
                    /*DependencyObject*/var logicalParent = DeferredElementTreeState.GetLogicalParent(element, treeState);

                    if (coreParent != null) 
                    {
                        this.FirePropertyChangeInAncestry(coreParent, oldValue, treeState, originChangedAction); 
                    } 
                    if (logicalParent != null && logicalParent != coreParent)
                    { 
                        this.FirePropertyChangeInAncestry(logicalParent, oldValue, treeState, originChangedAction);
                    }
                }
            } 
        },
        

	});
	
//    private static bool 
	function BlockReverseInheritance(element) 
    {
		return element.BlockReverseInheritance(); 
    } 

    ///////////////////////////////////////////////////////////////////// 

//    private static void 
	function SetFlag(element, /*CoreFlags*/ flag, /*bool*/ value)
    {
		element.WriteFlag(flag, value); 
    } 

    ///////////////////////////////////////////////////////////////////// 

//    private static bool 
	function IsFlagSet(element, /*CoreFlags*/ flag)
    {
		return element.ReadFlag(flag); 
    } 
	
	ReverseInheritProperty.Type = new Type("ReverseInheritProperty", ReverseInheritProperty, [Object.Type]);
	return ReverseInheritProperty;
});

		
//        internal abstract void FireNotifications(UIElement uie, ContentElement ce, UIElement3D uie3D, bool oldValue); 
//
//        protected DependencyPropertyKey FlagKey; 
//        protected CoreFlags FlagCache;
//        protected CoreFlags FlagChanged; 
//        protected CoreFlags FlagOldOriginCache; // Flag to keep track of elements in the path of old origin 
//        protected CoreFlags FlagNewOriginCache; // Flag to keep track of elements in the path of new origin


