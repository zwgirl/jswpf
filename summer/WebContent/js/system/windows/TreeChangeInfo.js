/**
 * TreeChangeInfo
 */

define(["dojo/_base/declare", "system/Type", "windows/BaseValueSourceInternal", "windows/EffectiveValueEntry",
        "windows/RequestFlags", "collections/Stack", "utility/FrugalObjectList", "windows/InheritablePropertyChangeInfo"], 
		function(declare, Type, BaseValueSourceInternal, EffectiveValueEntry,
				RequestFlags, Stack, FrugalObjectList, InheritablePropertyChangeInfo){
	
	//struct
	var TreeChangeInfo = declare("TreeChangeInfo", Object,{
		constructor:function(/*DependencyObject*/ root, /*DependencyObject*/ parent, /*bool*/ isAddOperation) 
        {
            this._rootOfChange = root; 
            this._isAddOperation = isAddOperation; 
            this._topmostCollapsedParentNode = null;
            this._rootInheritableValues = null; 
            this._inheritablePropertiesStack = null;
            this._valueIndexer = 0;

            // Create the InheritableProperties cache for the parent 
            // and push it to start the stack ... we don't need to
            // pop this when we're done because we'll be throing the 
            // stack away at that point. 
            this.InheritablePropertiesStack.Push(this.CreateParentInheritableProperties(root, parent, isAddOperation));
        },
        
        //
        //  This method
        //  1. Is called from AncestorChange InvalidateTree. 
        //  2. It is used to create the InheritableProperties on the given node.
        //  3. It also accumulates oldValues for the inheritable properties that are about to be invalidated 
        // 
//        internal FrugalObjectList<DependencyProperty> 
        CreateParentInheritableProperties:function(
            /*DependencyObject*/ d, 
            /*DependencyObject*/ parent,
            /*bool*/  isAddOperation)
        {
//            Debug.Assert(d != null, "Must have non-null current node"); 

            if (parent == null) 
            { 
                return new FrugalObjectList/*<DependencyProperty>*/(0);
            } 

            /*DependencyObjectType*/var treeObjDOT = d.DependencyObjectType;

            // See if we have a cached value. 
            /*EffectiveValueEntry[]*/var parentEffectiveValues = null;
            var parentEffectiveValuesCount = 0; 
            var inheritablePropertiesCount = 0; 

            // If inheritable properties aren't cached on you then use the effective 
            // values cache on the parent to discover those inherited properties that
            // may need to be invalidated on the children nodes.
            if (!parent.IsSelfInheritanceParent)
            { 
                /*DependencyObject*/var inheritanceParent = parent.InheritanceParent;
                if (inheritanceParent != null) 
                { 
                    parentEffectiveValues = inheritanceParent.EffectiveValues;
                    parentEffectiveValuesCount = inheritanceParent.EffectiveValuesCount; 
                    inheritablePropertiesCount = inheritanceParent.InheritableEffectiveValuesCount;
                }
            }
            else 
            {
                parentEffectiveValues = parent.EffectiveValues; 
                parentEffectiveValuesCount = parent.EffectiveValuesCount; 
                inheritablePropertiesCount = parent.InheritableEffectiveValuesCount;
            } 

            /*FrugalObjectList<DependencyProperty>*/
            var inheritableProperties = new FrugalObjectList/*<DependencyProperty>*/(inheritablePropertiesCount);

            if (inheritablePropertiesCount == 0) 
            {
                return inheritableProperties; 
            } 

            this._rootInheritableValues = []; //new InheritablePropertyChangeInfo[inheritablePropertiesCount]; 
            for(var i = 0; i<inheritablePropertiesCount; i++){
            	this._rootInheritableValues[i] = new InheritablePropertyChangeInfo();
            }
            var inheritableIndex = 0;

            /*FrameworkObject*/var foParent = new FrameworkObject(parent);
 
            for (var i=0; i<parentEffectiveValuesCount; i++)
            { 
                // Add all the inheritable properties from the effectiveValues 
                // cache to the TreeStateCache on the parent
                /*EffectiveValueEntry*/
            	var entry = parentEffectiveValues[i]; 
                /*DependencyProperty*/
            	var dp = DependencyProperty.RegisteredPropertyList.List[entry.PropertyIndex];

                // There are UncommonFields also stored in the EffectiveValues cache. We need to exclude those.
                if ((dp != null) && dp.IsPotentiallyInherited) 
                {
                    /*PropertyMetadata*/
                	var metadata = dp.GetMetadata(parent.DependencyObjectType); 
                    if (metadata != null && metadata.IsInherited) 
                    {
//                        Debug.Assert(!inheritableProperties.Contains(dp), "EffectiveValues cache must not contains duplicate entries for the same DP"); 

                        /*FrameworkPropertyMetadata*/
                    	var fMetadata = /*(FrameworkPropertyMetadata)*/metadata;

                        // Children do not need to inherit properties across a tree boundary 
                        // unless the property is set to override this behavior.
 
                        if (!TreeWalkHelper.SkipNow(foParent.InheritanceBehavior) || fMetadata.OverridesInheritanceBehavior) 
                        {
                            inheritableProperties.Add(dp); 

                            /*EffectiveValueEntry*/var oldEntry;
                            /*EffectiveValueEntry*/var newEntry;
 
                            oldEntry = d.GetValueEntry(
                                        d.LookupEntry(dp.GlobalIndex), 
                                        dp, 
                                        dp.GetMetadata(treeObjDOT),
                                        RequestFlags.DeferredReferences); 

                            if (isAddOperation)
                            {
                                // set up the new value 
                                newEntry = entry;
 
                                if ((newEntry.BaseValueSourceInternal != BaseValueSourceInternal.Default) || newEntry.HasModifiers) 
                                {
                                    newEntry = newEntry.GetFlattenedEntry(RequestFlags.FullyResolved); 
                                    newEntry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited;
                                }
                            }
                            else 
                            {
                                newEntry = new EffectiveValueEntry(); 
                            } 

 
                            this._rootInheritableValues[inheritableIndex++] =
                                        new InheritablePropertyChangeInfo(d, dp, oldEntry, newEntry);

                            if (inheritablePropertiesCount == inheritableIndex) 
                            {
                                // no more inheritable properties, bail early 
                                break; 
                            }
                        } 
                    }
                }
            }
 
            return inheritableProperties;
        },
        
        // This is called by TreeWalker.InvalidateTreeDependentProperties before looping through
        // all of the items in the InheritablesPropertiesStack 
//        internal void 
        ResetInheritableValueIndexer:function()
        {
            this._valueIndexer = 0;
        },

        // This is called by TreeWalker.InvalidateTreeDependentProperty. 
        // _valueIndexer is an optimization because we know (a) that the last DP list pushed on the 
        // InheritablePropertiesStack is a subset of the first DP list pushed on this stack;
        // (b) the first DP list pushed on the stack has the same # (and order) of entries as the 
        // RootInheritableValues list; and (c) the last DP list pushed on the stack will have its
        // DPs in the same order as those DPs appear in the first DP list pushed on the stack.  This
        // allows us to simply increment _valueIndexer until we find a match; and on subsequent
        // calls to GetRootInheritableValue just continue our incrementing from where we left off 
        // the last time.
//        internal InheritablePropertyChangeInfo 
        GetRootInheritableValue:function(/*DependencyProperty*/ dp) 
        { 
            /*InheritablePropertyChangeInfo*/
        	var info;
            do 
            {
                info = this._rootInheritableValues[this._valueIndexer++];
            }
            while (info.Property != dp); 
            return info;
        } 
	});
	
	Object.defineProperties(TreeChangeInfo.prototype,{
	       /// <summary>
        ///     This is a stack that is used during an AncestorChange operation. 
        ///     I holds the InheritableProperties cache on the parent nodes in
        ///     the tree in the order of traversal. The top of the stack holds
        ///     the cache for the immediate parent node.
        /// </summary> 
//        internal Stack<FrugalObjectList<DependencyProperty>> 
        InheritablePropertiesStack:
        { 
            get:function() 
            {
                if (this._inheritablePropertiesStack == null) 
                {
                	this._inheritablePropertiesStack = new Stack/*<FrugalObjectList<DependencyProperty>>*/();
                }
 
                return this._inheritablePropertiesStack;
            } 
        }, 

        /// <summary> 
        ///     When we enter a Visibility=Collapsed subtree, we remember that node
        ///     using this property. As we process the children of this collapsed
        ///     node, we see this property as non-null and know we're collapsed.
        ///     As we exit the subtree, this reference is nulled out which means 
        ///     we don't know whether we're in a collapsed tree and the optimizations
        ///     based on Visibility=Collapsed are not valid and should not be used. 
        /// </summary> 
//        internal object 
        TopmostCollapsedParentNode:
        { 
            get:function() { return this._topmostCollapsedParentNode; },
            set:function(value) { this._topmostCollapsedParentNode = value; }
        },
 
        // Indicates if this is a add child tree operation
//        internal bool 
        IsAddOperation: 
        { 
            get:function() { return this._isAddOperation; }
        },

        // This is the element at the root of the sub-tree that had a parent change.
//        internal DependencyObject 
        Root:
        { 
            get:function() { return this._rootOfChange; }
        } 
	});
	
	TreeChangeInfo.Type = new Type("TreeChangeInfo", TreeChangeInfo, [Object.Type]);
	return TreeChangeInfo;
});

