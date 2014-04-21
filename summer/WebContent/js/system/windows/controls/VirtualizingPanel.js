/**
 * VirtualizingPanel
 */

define(["dojo/_base/declare", "system/Type", "controls/Panel", "windows/FrameworkPropertyMetadata", "windows/PropertyChangedCallback", 
        "windows/FrameworkPropertyMetadataOptions", "controls/ScrollUnit", "controls/VirtualizationCacheLengthUnit"], 
		function(declare, Type, Panel, FrameworkPropertyMetadata, PropertyChangedCallback,
				FrameworkPropertyMetadataOptions, ScrollUnit, VirtualizationCacheLengthUnit){
	var VirtualizingPanel = declare("VirtualizingPanel", Panel,{
		constructor:function(/*int*/ index, /*boolean*/ found){

		},
 
//        public double 
        GetItemOffset:function(/*UIElement*/ child)
        { 
            return this.GetItemOffsetCore(child); 
        },
 
        /// <summary>
        ///     Fetch the logical/item offset for this child with respect to the top of the
        ///     panel. This is similar to a TransformToAncestor operation. Just works
        ///     in logical units. 
        /// </summary>
//        protected virtual double 
        GetItemOffsetCore:function(/*UIElement*/ child) 
        { 
            return 0;
        }, 

//        internal override void 
        GenerateChildren:function()
        {
            // Do nothing. Subclasses will use the exposed generator to generate children. 
        },
 
        /// <summary> 
        ///     Adds a child to the InternalChildren collection.
        ///     This method is meant to be used when a virtualizing panel 
        ///     generates a new child. This method circumvents some validation
        ///     that occurs in UIElementCollection.Add.
        /// </summary>
        /// <param name="child">Child to add.</param> 
//        protected void 
        AddInternalChild:function(/*UIElement*/ child)
        { 
        	this.AddInternalChild(this.InternalChildren, child); 
        },
 
        /// <summary>
        ///     Inserts a child into the InternalChildren collection.
        ///     This method is meant to be used when a virtualizing panel
        ///     generates a new child. This method circumvents some validation 
        ///     that occurs in UIElementCollection.Insert.
        /// </summary> 
        /// <param name="index">The index at which to insert the child.</param> 
        /// <param name="child">Child to insert.</param>
//        protected void 
        InsertInternalChild:function(/*int*/ index, /*UIElement*/ child) 
        {
        	this.InsertInternalChild(this.InternalChildren, index, child);
        },
 
        /// <summary>
        ///     Removes a child from the InternalChildren collection. 
        ///     This method is meant to be used when a virtualizing panel 
        ///     re-virtualizes a new child. This method circumvents some validation
        ///     that occurs in UIElementCollection.RemoveRange. 
        /// </summary>
        /// <param name="index"></param>
        /// <param name="range"></param>
//        protected void 
        RemoveInternalChildRange:function(/*int*/ index, /*int*/ range) 
        {
        	this.RemoveInternalChildRange(this.InternalChildren, index, range); 
        }, 
        /// <summary>
        ///     Called when the Items collection associated with the containing ItemsControl changes.
        /// </summary>
        /// <param name="sender">sender</param> 
        /// <param name="args">Event arguments</param>
//        protected virtual void 
        OnItemsChanged:function(/*object*/ sender, /*ItemsChangedEventArgs*/ args) 
        { 
        },
 
//        public bool 
        ShouldItemsChangeAffectLayout:function(/*bool*/ areItemChangesLocal, /*ItemsChangedEventArgs*/ args)
        {
            return this.ShouldItemsChangeAffectLayoutCore(areItemChangesLocal, args);
        }, 

        /// <summary> 
        ///     Returns whether an Items collection change affects layout for this panel. 
        /// </summary>
        /// <param name="args">Event arguments</param> 
        /// <param name="areItemChangesLocal">Says if this notification represents a direct change to this Panel's collection</param>
//        protected virtual bool 
        ShouldItemsChangeAffectLayoutCore:function(/*bool*/ areItemChangesLocal, /*ItemsChangedEventArgs*/ args)
        {
            return true; 
        },
 
        /// <summary> 
        ///     Called when the UI collection of children is cleared by the base Panel class.
        /// </summary> 
//        protected virtual void 
        OnClearChildren:function()
        {
        },
 
        /// <summary>
        ///     This is the public accessor for protected method BringIndexIntoView. 
        /// </summary> 
//        public void 
        BringIndexIntoViewPublic:function(/*int*/ index)
        { 
        	this.BringIndexIntoView(index);
        },

        /// <summary> 
        /// Generates the item at the specified index and calls BringIntoView on it.
        /// </summary> 
        /// <param name="index">Specify the item index that should become visible</param> 
//        protected internal virtual void 
        BringIndexIntoView:function(/*int*/ index)
        { 
        },

        // This method returns a bool to indicate if or not the panel layout is affected by this collection change
//        internal override bool 
        OnItemsChangedInternal:function(/*object*/ sender, /*ItemsChangedEventArgs*/ args) 
        {
            switch (args.Action) 
            { 
                case NotifyCollectionChangedAction.Add:
                case NotifyCollectionChangedAction.Remove: 
                case NotifyCollectionChangedAction.Replace:
                case NotifyCollectionChangedAction.Move:
                    // Don't allow Panel's code to run for add/remove/replace/move
                    break; 

                default: 
//                    base.OnItemsChangedInternal(sender, args); 
                	Panel.prototype.OnItemsChangedInternal.call(this, sender, args); 
                    break;
            } 

            this.OnItemsChanged(sender, args);

            return this.ShouldItemsChangeAffectLayout(true /*areItemChangesLocal*/, args); 
        },
 
//        internal override void 
        OnClearChildrenInternal:function() 
        {
        	this.OnClearChildren(); 
        }
	});
	
	Object.defineProperties(VirtualizingPanel.prototype, {
//        public bool 
        CanHierarchicallyScrollAndVirtualize: 
        {
            get:function() { return this.CanHierarchicallyScrollAndVirtualizeCore; } 
        },

//        protected virtual bool 
        CanHierarchicallyScrollAndVirtualizeCore: 
        {
            get:function() { return false; }
        },

        /// <summary> 
        ///     The generator associated with this panel.
        /// </summary>
//        public IItemContainerGenerator 
        ItemContainerGenerator:
        { 
            get:function()
            { 
                return this.Generator; 
            }
        } 
 
	});
	
	Object.defineProperties(VirtualizingPanel, {
        /// <summary>
        ///     Attached property for use on the ItemsControl that is the host for the items being
        ///     presented by this panel. Use this property to turn virtualization on/off. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsVirtualizingProperty:
        {
        	get:function(){
        		if(VirtualizingPanel._IsVirtualizingProperty === undefined){
        			VirtualizingPanel._IsVirtualizingProperty = 
        	            DependencyProperty.RegisterAttached("IsVirtualizing", Boolean.Type, VirtualizingPanel.Type, 
        	                    new FrameworkPropertyMetadata(true, FrameworkPropertyMetadataOptions.AffectsMeasure, 
        	                    		new PropertyChangedCallback(OnVirtualizationPropertyChanged)));
        		}
        		
        		return VirtualizingPanel._IsVirtualizingProperty;
        	}
        },
 
        /// <summary> 
        ///     Attached property for use on the ItemsControl that is the host for the items being
        ///     presented by this panel. Use this property to modify the virtualization mode. 
        /// 
        ///     Note that this property can only be set before the panel has been initialized
        /// </summary> 
//        public static readonly DependencyProperty 
        VirtualizationModeProperty:
        {
        	get:function(){
        		if(VirtualizingPanel._VirtualizationModeProperty === undefined){
        			VirtualizingPanel._VirtualizationModeProperty =
        	            DependencyProperty.RegisterAttached("VirtualizationMode", Number.Type/*typeof(VirtualizationMode)*/, VirtualizingPanel.Type,
        	                    new FrameworkPropertyMetadata(VirtualizationMode.Standard, FrameworkPropertyMetadataOptions.AffectsMeasure, 
        	                    		new PropertyChangedCallback(OnVirtualizationPropertyChanged)));
        		}
        		
        		return VirtualizingPanel._VirtualizationModeProperty;
        	}
        }, 
 
        /// <summary>
        ///     Attached property for use on the ItemsControl that is the host for the items being 
        ///     presented by this panel. Use this property to turn virtualization on/off when grouping.
        /// </summary>
//        public static readonly DependencyProperty 
        IsVirtualizingWhenGroupingProperty:
        {
        	get:function(){
        		if(VirtualizingPanel._IsVirtualizingWhenGroupingProperty === undefined){
        			VirtualizingPanel._IsVirtualizingWhenGroupingProperty =
        	            DependencyProperty.RegisterAttached("IsVirtualizingWhenGrouping", Boolean.Type, VirtualizingPanel.Type, 
        	                    new FrameworkPropertyMetadata(false, FrameworkPropertyMetadataOptions.AffectsMeasure, 
        	                    		new PropertyChangedCallback(OnVirtualizationPropertyChanged), 
        	                    		new CoerceValueCallback(CoerceIsVirtualizingWhenGrouping)));
        		}
        		
        		return VirtualizingPanel._IsVirtualizingWhenGroupingProperty;
        	}
        }, 
 
        /// <summary>
        ///     Attached property for use on the ItemsControl that is the host for the items being
        ///     presented by this panel. Use this property to switch between pixel and item scrolling.
        /// </summary> 
//        public static readonly DependencyProperty 
        ScrollUnitProperty:
        {
        	get:function(){
        		if(VirtualizingPanel._ScrollUnitProperty === undefined){
        			VirtualizingPanel._ScrollUnitProperty =
        	            DependencyProperty.RegisterAttached("ScrollUnit", /*typeof(ScrollUnit)*/Number.Type, VirtualizingPanel.Type, 
        	                    new FrameworkPropertyMetadata(ScrollUnit.Item, FrameworkPropertyMetadataOptions.AffectsMeasure, 
        	                    		new PropertyChangedCallback(OnVirtualizationPropertyChanged)));
        		}
        		
        		return VirtualizingPanel._ScrollUnitProperty;
        	}
        },  

        /// <summary>
        ///     Attached property for use on the ItemsControl that is the host for the items being
        ///     presented by this panel. Use this property to configure the dimensions of the cache 
        ///     before and after the viewport when virtualizing. Please note that the unit of these dimensions
        ///     is determined by the value of the <see cref="CacheLengthUnitProperty"/>. 
        /// </summary> 
//        public static readonly DependencyProperty 
        CacheLengthProperty:
        {
        	get:function(){
        		if(VirtualizingPanel._CacheLengthProperty === undefined){
        			VirtualizingPanel._CacheLengthProperty =
        	            DependencyProperty.RegisterAttached("CacheLength", /*typeof(VirtualizationCacheLength)*/VirtualizationCacheLength.Type, VirtualizingPanel.Type, 
        	                    new FrameworkPropertyMetadata(new VirtualizationCacheLength(1.0), 
        	                    		FrameworkPropertyMetadataOptions.AffectsMeasure, 
        	                    		new PropertyChangedCallback(OnVirtualizationPropertyChanged)), 
        	                    		new ValidateValueCallback(ValidateCacheSizeBeforeOrAfterViewport));
        		}
        		
        		return VirtualizingPanel._CacheLengthProperty;
        	}
        }, 

        /// <summary>
        ///     Attached property for use on the ItemsControl that is the host for the items being 
        ///     presented by this panel. Use this property to configure the unit portion of the before
        ///     and after cache sizes.
        /// </summary>
//        public static readonly DependencyProperty 
        CacheLengthUnitProperty:
        {
        	get:function(){
        		if(VirtualizingPanel._CacheLengthUnitProperty === undefined){
        			VirtualizingPanel._CacheLengthUnitProperty = 
        	            DependencyProperty.RegisterAttached("CacheLengthUnit", 
        	            		/*typeof(VirtualizationCacheLengthUnit)*/Number.Type,  
        	            		VirtualizingPanel.Type,
        	                    new FrameworkPropertyMetadata(VirtualizationCacheLengthUnit.Page, 
        	                    		FrameworkPropertyMetadataOptions.AffectsMeasure, 
        	                    		new PropertyChangedCallback(OnVirtualizationPropertyChanged))); 
        		}
        		
        		return VirtualizingPanel._CacheLengthUnitProperty;
        	}
        }, 
        
        /// <summary>
        ///     Attached property for use on a container being presented by this panel. The parent panel
        ///     is expected to honor this property and not virtualize containers that are designated non-virtualizable. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsContainerVirtualizableProperty:
        {
        	get:function(){
        		if(VirtualizingPanel._IsContainerVirtualizableProperty === undefined){
        			VirtualizingPanel._IsContainerVirtualizableProperty = 
        	            DependencyProperty.RegisterAttached("IsContainerVirtualizable", Boolean.Type, VirtualizingPanel.Type, 
        	                    new FrameworkPropertyMetadata(true));
        		}
        		
        		return VirtualizingPanel._IsContainerVirtualizableProperty;
        	}
        }, 
 
        /// <summary> 
        ///     Attached property for use on a container being presented by this panel. The parent panel
        ///     is expected to honor this property and not cache container sizes that are designated such. 
        /// </summary> 
//        internal static readonly DependencyProperty 
        ShouldCacheContainerSizeProperty:
        {
        	get:function(){
        		if(VirtualizingPanel._ShouldCacheContainerSizeProperty === undefined){
        			VirtualizingPanel._ShouldCacheContainerSizeProperty =
        	            DependencyProperty.RegisterAttached("ShouldCacheContainerSize", Boolean.Type, VirtualizingPanel.Type, 
        	                    new FrameworkPropertyMetadata(true));
        		}
        		
        		return VirtualizingPanel._ShouldCacheContainerSizeProperty;
        	}
        }, 

	});

    /// <summary>
    ///     Retrieves the value for <see cref="IsVirtualizingProperty" />.
    /// </summary>
    /// <param name="element">The element on which to query the value.</param> 
    /// <returns>True if virtualizing, false otherwise.</returns>
//    public static bool 
	VirtualizingPanel.GetIsVirtualizing = function(/*DependencyObject*/ element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }

        return element.GetValue(VirtualizingPanel.IsVirtualizingProperty); 
    };

    /// <summary> 
    ///     Sets the value for <see cref="IsVirtualizingProperty" />.
    /// </summary> 
    /// <param name="element">The element on which to set the value.</param>
    /// <param name="value">True if virtualizing, false otherwise.</param>
//    public static void 
    VirtualizingPanel.SetIsVirtualizing = function(/*DependencyObject*/ element, /*bool*/ value)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(VirtualizingPanel.IsVirtualizingProperty, value);
    };

    /// <summary>
    ///     Retrieves the value for <see cref="VirtualizationModeProperty" />. 
    /// </summary> 
    /// <param name="o">The object on which to query the value.</param>
    /// <returns>The current virtualization mode.</returns> 
//    public static VirtualizationMode 
    VirtualizingPanel.GetVirtualizationMode = function(/*DependencyObject*/ element)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 

        return /*(VirtualizationMode)*/element.GetValue(VirtualizingPanel.VirtualizationModeProperty);
    }; 

    /// <summary>
    ///     Sets the value for <see cref="VirtualizationModeProperty" />.
    /// </summary> 
    /// <param name="element">The element on which to set the value.</param>
    /// <param name="value">The desired virtualization mode.</param> 
//    public static void 
    VirtualizingPanel.SetVirtualizationMode = function(/*DependencyObject*/ element, /*VirtualizationMode*/ value) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }

        element.SetValue(VirtualizingPanel.VirtualizationModeProperty, value);
    }; 

    /// <summary> 
    ///     Retrieves the value for <see cref="IsVirtualizingWhenGroupingProperty" />.
    /// </summary> 
    /// <param name="element">The object on which to query the value.</param>
    /// <returns>True if virtualizing, false otherwise.</returns>
//    public static bool 
    VirtualizingPanel.GetIsVirtualizingWhenGrouping = function(/*DependencyObject*/ element)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }

        return element.GetValue(VirtualizingPanel.IsVirtualizingWhenGroupingProperty);
    };

    /// <summary> 
    ///     Sets the value for <see cref="IsVirtualizingWhenGroupingProperty" />.
    /// </summary> 
    /// <param name="element">The element on which to set the value.</param> 
    /// <param name="value">True if virtualizing, false otherwise.</param>
//    public static void 
    VirtualizingPanel.SetIsVirtualizingWhenGrouping = function(/*DependencyObject*/ element, /*bool*/ value) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(VirtualizingPanel.IsVirtualizingWhenGroupingProperty, value); 
    };

    /// <summary> 
    ///     Retrieves the value for <see cref="ScrollUnitProperty" />.
    /// </summary>
    /// <param name="element">The object on which to query the value.</param>
//    public static ScrollUnit 
    VirtualizingPanel.GetScrollUnit = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        return /*(ScrollUnit)*/element.GetValue(VirtualizingPanel.ScrollUnitProperty);
    };

    /// <summary>
    ///     Sets the value for <see cref="ScrollUnitProperty" />. 
    /// </summary> 
    /// <param name="element">The element on which to set the value.</param>
//    public static void 
    VirtualizingPanel.SetScrollUnit = function(/*DependencyObject*/ element, /*ScrollUnit*/ value) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(VirtualizingPanel.ScrollUnitProperty, value); 
    };

    /// <summary>
    ///     Retrieves the value for <see cref="CacheLengthProperty" />. 
    /// </summary>
    /// <param name="element">The object on which to query the value.</param> 
    /// <returns>VirtualCacheLength representing the dimensions of the cache before and after the 
    /// viewport.</returns>
//    public static VirtualizationCacheLength 
    VirtualizingPanel.GetCacheLength = function(/*DependencyObject*/ element) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }

        return /*(VirtualizationCacheLength)*/element.GetValue(VirtualizingPanel.CacheLengthProperty); 
    };

    /// <summary>
    ///     Sets the value for <see cref="CacheLengthProperty" />.
    /// </summary>
    /// <param name="element">The element on which to set the value.</param> 
    /// <param name="value">VirtualCacheLength representing the dimensions of the cache before and after the
    /// viewport.</param> 
//    public static void 
    VirtualizingPanel.SetCacheLength = function(/*DependencyObject*/ element, /*VirtualizationCacheLength*/ value) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }

        element.SetValue(VirtualizingPanel.CacheLengthProperty, value);
    }; 

    /// <summary>
    ///     Retrieves the value for <see cref="CacheLengthUnitProperty" />. 
    /// </summary>
    /// <param name="element">The object on which to query the value.</param>
    /// <returns>The CacheLenghtUnit for the matching CacheLength property.</returns>
//    public static VirtualizationCacheLengthUnit 
    VirtualizingPanel.GetCacheLengthUnit = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        return /*(VirtualizationCacheLengthUnit)*/element.GetValue(VirtualizingPanel.CacheLengthUnitProperty);
    };

    /// <summary>
    ///     Sets the value for <see cref="CacheLengthUnitProperty" />. 
    /// </summary> 
    /// <param name="element">The element on which to set the value.</param>
    /// <param name="value">The CacheLenghtUnit for the matching CacheLength property.</param> 
//    public static void 
    VirtualizingPanel.SetCacheLengthUnit = function(/*DependencyObject*/ element, /*VirtualizationCacheLengthUnit*/ value)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 

        element.SetValue(VirtualizingPanel.CacheLengthUnitProperty, value);
    }; 

    /// <summary>
    ///     Retrieves the value for <see cref="IsContainerVirtualizableProperty" />.
    /// </summary>
    /// <param name="element">The object on which to query the value.</param> 
    /// <returns>True if the container is virtualizable, false otherwise.</returns>
//    public static bool 
    VirtualizingPanel.GetIsContainerVirtualizable = function(/*DependencyObject*/ element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }

        return element.GetValue(VirtualizingPanel.IsContainerVirtualizableProperty); 
    };

    /// <summary> 
    ///     Sets the value for <see cref="IsContainerVirtualizableProperty" />.
    /// </summary> 
    /// <param name="element">The element on which to set the value.</param>
    /// <param name="value">True if container is virtualizable, false otherwise.</param>
//    public static void 
    VirtualizingPanel.SetIsContainerVirtualizable = function(/*DependencyObject*/ element, /*bool*/ value)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(VirtualizingPanel.IsContainerVirtualizableProperty, value);
    };

    /// <summary>
    ///     Retrieves the value for <see cref="ShouldCacheContainerSizeProperty" />. 
    /// </summary>
    /// <param name="element">The object on which to query the value.</param> 
    /// <returns>True if the container size should be cached, false otherwise.</returns> 
//    internal static bool 
    VirtualizingPanel.GetShouldCacheContainerSize = function(/*DependencyObject*/ element)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 

        return element.GetValue(VirtualizingPanel.ShouldCacheContainerSizeProperty); 
    };

//    private static bool 
    function ValidateCacheSizeBeforeOrAfterViewport(/*object*/ value) 
    {
        /*VirtualizationCacheLength*/var cacheLength = /*(VirtualizationCacheLength)*/value;
        return DoubleUtil.GreaterThanOrClose(cacheLength.CacheBeforeViewport, 0.0) &&
            DoubleUtil.GreaterThanOrClose(cacheLength.CacheAfterViewport, 0.0); 
    }

//    private static object 
    function CoerceIsVirtualizingWhenGrouping(/*DependencyObject*/ d, /*object*/ baseValue) 
    {
        var isVirtualizing = GetIsVirtualizing(d); 
        return isVirtualizing && baseValue;
    }

//    internal static void 
    function OnVirtualizationPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        /*ItemsControl*/var ic = d instanceof ItemsControl ? d : null; 
        if (ic != null) 
        {
            /*Panel*/var p = ic.ItemsHost; 
            if (p != null)
            {
                p.InvalidateMeasure();
                /*ItemsPresenter*/var itemsPresenter = VisualTreeHelper.GetParent(p);
                itemsPresenter = itemsPresenter instanceof ItemsPresenter ? itemsPresenter : null; 
                if (itemsPresenter != null)
                { 
                    itemsPresenter.InvalidateMeasure(); 
                }

                if (d instanceof TreeView)
                {
                    /*DependencyProperty*/var dp = e.Property;
                    if (dp == VirtualizingStackPanel.IsVirtualizingProperty || 
                        dp == VirtualizingPanel.IsVirtualizingWhenGroupingProperty ||
                        dp == VirtualizingStackPanel.VirtualizationModeProperty || 
                        dp == VirtualizingPanel.ScrollUnitProperty) 
                    {
                        VirtualizationPropertyChangePropagationRecursive(ic, p); 
                    }
                }
            }
        } 
    }

//    private static void 
    function VirtualizationPropertyChangePropagationRecursive(/*DependencyObject*/ parent, /*Panel*/ itemsHost) 
    {
        /*UIElementCollection*/var children = itemsHost.InternalChildren; 
        var childrenCount = children.Count;
        for (var i=0; i<childrenCount; i++)
        {
            /*IHierarchicalVirtualizationAndScrollInfo*/var virtualizingChild = children[i];
            virtualizingChild = virtualizingChild instanceof IHierarchicalVirtualizationAndScrollInfo ? virtualizingChild : null; 
            if (virtualizingChild != null)
            { 
                TreeViewItem.IsVirtualizingPropagationHelper(parent, virtualizingChild); 

                /*Panel*/var childItemsHost = virtualizingChild.ItemsHost; 
                if (childItemsHost != null)
                {
                    VirtualizationPropertyChangePropagationRecursive(virtualizingChild, childItemsHost);
                } 
            }
        } 
    } 

    // This is internal as an optimization for VirtualizingStackPanel (so it doesn't need to re-query InternalChildren repeatedly) 
//    internal static void 
    VirtualizingPanel.AddInternalChild = function(/*UIElementCollection*/ children, /*UIElement*/ child)
    {
        children.AddInternal(child);
    }; 

    // This is internal as an optimization for VirtualizingStackPanel (so it doesn't need to re-query InternalChildren repeatedly) 
//    internal static void 
    VirtualizingPanel.InsertInternalChild = function(/*UIElementCollection*/ children, /*int*/ index, /*UIElement*/ child) 
    {
        children.InsertInternal(index, child); 
    };

    // This is internal as an optimization for VirtualizingStackPanel (so it doesn't need to re-query InternalChildren repeatedly)
//    internal static void 
    VirtualizingPanel.RemoveInternalChildRange = function(/*UIElementCollection*/ children, /*int*/ index, /*int*/ range) 
    {
        children.RemoveRangeInternal(index, range); 
    }; 
	
	VirtualizingPanel.Type = new Type("VirtualizingPanel", VirtualizingPanel, [Panel.Type]);
	return VirtualizingPanel;
});




