/**
 * Second Check 12-20
 * GroupItem
 */
/// <summary> 
///     A GroupItem appears as the root of the visual subtree generated for a CollectionViewGroup.
/// </summary>
define(["dojo/_base/declare", "system/Type", "controls/ContentControl", "primitives/IHierarchicalVirtualizationAndScrollInfo", 
        "primitives/IContainItemStorage", "internal/Helper", "windows/FrameworkElement", "windows/RoutedEventHandler",
        "windows/DependencyObjectType", "controls/Control", "controls/Expander"], 
		function(declare, Type, ContentControl, IHierarchicalVirtualizationAndScrollInfo, 
				IContainItemStorage, Helper, FrameworkElement, RoutedEventHandler,
				DependencyObjectType, Control, Expander){
//  private const string 
    var ExpanderHeaderPartName = "HeaderSite";
    
//  private static DependencyObjectType 
    var _dType = null;
    
	var GroupItem = declare("GroupItem", ContentControl
			/*[ContentControl, IHierarchicalVirtualizationAndScrollInfo, IContainItemStorage]*/, {
		constructor:function(){
//		    ItemContainerGenerator 
			this._generator = null;
//	        private Panel 
			this._itemsHost = null;
//	        FrameworkElement 
			this._header = null;
//	        Expander 
			this._expander = null;


	        this._dom = window.document.createElement("div");
//	        this._dom.style.setProperty("border", "thin dotted #FF0000");
			this._dom._source = this;
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
//	    public override void 
	    OnApplyTemplate:function()
        { 
	    	ContentControl.prototype.OnApplyTemplate.call(this); 

            this._header = this.GetTemplateChild("PART_Header");
            this._header = this._header instanceof FrameworkElement ? this._header : null; 

            // GroupItem is generally re-templated to have an Expander.
            // Look for an Expander and store its Header size.g
            this._expander = Helper.FindTemplatedDescendant/*<Expander>*/(this, this, Expander); 

            // 
            // ItemValueStorage:  restore saved values for this item onto the new container 
            //
            if (this._expander != null) 
            {
                /*ItemsControl*/var itemsControl = this.ParentItemsControl;
                if (itemsControl != null && VirtualizingPanel.GetIsVirtualizingWhenGrouping(itemsControl))
                { 
                    Helper.SetItemValuesOnContainer(itemsControl, this._expander, itemsControl.ItemContainerGenerator.ItemFromContainer(this));
                } 
 
                this._expander.Expanded.Combine(new RoutedEventHandler(this, this.OnExpanded));
            } 
        },

//        internal override void 
        OnTemplateChangedInternal:function(/*FrameworkTemplate*/ oldTemplate,/*FrameworkTemplate*/ newTemplate)
        { 
        	ContentControl.prototype.OnTemplateChangedInternal.call(this, oldTemplate, newTemplate);

            if (this._expander != null)
            { 
            	this._expander.Expanded.Remove(new RoutedEventHandler(this, this.OnExpanded));
            	this._expander = null; 
            } 

            this._itemsHost = null; 
        },

//        protected override Size 
        ArrangeOverride:function()
        { 
            ContentControl.prototype.ArrangeOverride.call(this);
 
            Helper.ComputeCorrectionFactor(this.ParentItemsControl, this, this.ItemsHost, this.HeaderElement); 
        },

        /// <summary>
        ///     Gives a string representation of this object. 
        /// </summary>
        /// <returns></returns> 
//        internal override string 
        GetPlainText:function() 
        {
            /*CollectionViewGroup*/var cvg = this.Content instanceof CollectionViewGroup ? this.Content : null; 
            if (cvg != null && cvg.Name != null)
            {
                return cvg.Name.ToString();
            } 

            return ContentControl.prototype.GetPlainText.Call(this); 
        }, 

//        internal void 
        PrepareItemContainer:function(/*object*/ item, /*ItemsControl*/ parentItemsControl) 
        {
            if (this.Generator == null)
                return;     // user-declared GroupItem - ignore (bug 108423)
 
            // If a GroupItem is being recycled set back IsItemsHost
            if (this._itemsHost != null) 
            { 
            	this._itemsHost.IsItemsHost = true;
            } 

            var isVirtualizingWhenGrouping = (parentItemsControl != null && VirtualizingPanel.GetIsVirtualizingWhenGrouping(parentItemsControl));

            // Release any previous containers. Also ensures Items and GroupStyle are hooked up correctly 
            if (this.Generator != null)
            { 
                if (!isVirtualizingWhenGrouping) 
                {
                    this.Generator.Release(); 
                }
                else
                {
                	this.Generator.RemoveAllInternal(true /*saveRecycleQueue*/); 
                }
            } 
 
            /*ItemContainerGenerator*/var generator = this.Generator.Parent;
            /*GroupStyle*/var groupStyle = generator.GroupStyle; 

            // apply the container style
            /*Style*/var style = groupStyle.ContainerStyle;
 
            // no ContainerStyle set, try ContainerStyleSelector
            if (style == null) 
            { 
                if (groupStyle.ContainerStyleSelector != null)
                { 
                    style = groupStyle.ContainerStyleSelector.SelectStyle(item, this);
                }
            }
 
            // apply the style, if found
            if (style != null) 
            { 
                // verify style is appropriate before applying it
                if (!style.TargetType.IsInstanceOfType(this)) 
                    throw new InvalidOperationException(SR.Get(SRID.StyleForWrongType, style.TargetType.Name, this.GetType().Name));

                this.Style = style;
                this.WriteInternalFlag2(InternalFlags2.IsStyleSetFromGenerator, true); 
            }
 
            // forward the header template information 
            if (!this.HasNonDefaultValue(ContentControl.ContentProperty))
                this.Content = item; 
            if (!this.HasNonDefaultValue(ContentControl.ContentTemplateProperty))
                this.ContentTemplate = groupStyle.HeaderTemplate;
            if (!this.HasNonDefaultValue(ContentControl.ContentTemplateSelectorProperty))
                this.ContentTemplateSelector = groupStyle.HeaderTemplateSelector; 
            if (!this.HasNonDefaultValue(ContentControl.ContentStringFormatProperty))
                this.ContentStringFormat = groupStyle.HeaderStringFormat; 
 
            //
            // Clear previously cached items sizes 
            //
            Helper.ClearVirtualizingElement(this);

            // 
            // ItemValueStorage:  restore saved values for this item onto the new container
            // 
            if (isVirtualizingWhenGrouping) 
            {
                Helper.SetItemValuesOnContainer(parentItemsControl, this, item); 

                if (this._expander != null)
                {
                    Helper.SetItemValuesOnContainer(parentItemsControl, this._expander, item); 
                }
            } 
        }, 
	
//        internal void 
        ClearItemContainer:function(/*object*/ item, /*ItemsControl*/ parentItemsControl) 
        {
            if (this.Generator == null)
                return;     // user-declared GroupItem - ignore (bug 108423)
 
            /*ItemContainerGenerator*/var generator = this.Generator.Parent;
            /*GroupStyle*/var groupStyle = generator.GroupStyle; 
 
            if (Object.Equals(this.Content, item))
            	this.ClearValue(ContentControl.ContentProperty); 
            if (this.ContentTemplate == groupStyle.HeaderTemplate)
            	this.ClearValue(ContentControl.ContentTemplateProperty);
            if (this.ContentTemplateSelector == groupStyle.HeaderTemplateSelector)
            	this.ClearValue(ContentControl.ContentTemplateSelectorProperty); 
            if (this.ContentStringFormat == groupStyle.HeaderStringFormat)
            	this.ClearValue(ContentControl.ContentStringFormatProperty); 
 
            //
            // ItemValueStorage:  save off values for this container if we're a virtualizing Group. 
            //
            if (parentItemsControl != null && VirtualizingPanel.GetIsVirtualizingWhenGrouping(parentItemsControl))
            {
                Helper.StoreItemValues(parentItemsControl, this, item); 

                if (this._expander != null) 
                { 
                    Helper.StoreItemValues(parentItemsControl, this._expander, item);
                } 

                // Tell the panel to clear off all its containers.  This will cause this method to be called
                // recursively down the tree, allowing all descendent data to be stored before we save off
                // the ItemValueStorage DP for this container. 

                /*VirtualizingPanel*/var vp = this._itemsHost instanceof VirtualizingPanel ? this._itemsHost : null; 
                if (vp != null) 
                {
                    vp.OnClearChildrenInternal(); 
                }

                this.Generator.RemoveAllInternal(true /*saveRecycleQueue*/);
            } 
            else
            { 
            	this.Generator.Release(); 
            }
        }, 

//        object IContainItemStorage.
        ReadItemValue:function(/*object*/ item, /*DependencyProperty*/ dp)
        {
            return Helper.ReadItemValue(this, item, dp.GlobalIndex); 
        },
 
 
//        void IContainItemStorage.
        StoreItemValue:function(/*object*/ item, /*DependencyProperty*/ dp, /*object*/ value)
        { 
            Helper.StoreItemValue(this, item, dp.GlobalIndex, value);
        },
//        void IContainItemStorage.
        ClearItemValue:function(/*object*/ item, /*DependencyProperty*/ dp) 
        {
            Helper.ClearItemValue(this, item, dp.GlobalIndex); 
        }, 

//        void IContainItemStorage.
        ClearValue:function(/*DependencyProperty*/ dp) 
        {
            Helper.ClearItemValueStorage(this, [dp.GlobalIndex]);
        },
 
//        void IContainItemStorage.
        Clear:function()
        { 
            Helper.ClearItemValueStorage(this); 
        },
 
	});
	
	Object.defineProperties(GroupItem.prototype,{

//        internal ItemContainerGenerator 
        Generator: 
        { 
            get:function() { return this._generator; },
            set:function(value) { this._generator = value; } 
        },

//        HierarchicalVirtualizationConstraints IHierarchicalVirtualizationAndScrollInfo.
        Constraints: 
        {
            get:function() { return GroupItem.HierarchicalVirtualizationConstraintsField.GetValue(this); },
            set:function(value) 
            {
                if (value.CacheLengthUnit == VirtualizationCacheLengthUnit.Page) 
                {
                    throw new InvalidOperationException(SR.Get(SRID.PageCacheSizeNotAllowed));
                }
                GroupItem.HierarchicalVirtualizationConstraintsField.SetValue(this, value); 
            }
        }, 
 
//        HierarchicalVirtualizationHeaderDesiredSizes IHierarchicalVirtualizationAndScrollInfo.
        HeaderDesiredSizes:
        { 
            get:function()
            {
                /*FrameworkElement*/var headerElement = this.HeaderElement;
                /*Size*/var pixelHeaderSize = new Size(); 

                if (this.IsVisible && headerElement != null) 
                { 
                    pixelHeaderSize = headerElement.DesiredSize;
                    Helper.ApplyCorrectionFactorToPixelHeaderSize(this.ParentItemsControl, this, this._itemsHost, /*ref*/ pixelHeaderSize); 
                }

                /*Size*/var logicalHeaderSize = new Size(DoubleUtil.GreaterThan(pixelHeaderSize.Width, 0) ? 1 : 0,
                                DoubleUtil.GreaterThan(pixelHeaderSize.Height, 0) ? 1 : 0); 

                return new HierarchicalVirtualizationHeaderDesiredSizes(logicalHeaderSize, pixelHeaderSize); 
            } 
        },
//        HierarchicalVirtualizationItemDesiredSizes IHierarchicalVirtualizationAndScrollInfo.
        ItemDesiredSizes: 
        {
            get:function()
            { 
                return Helper.ApplyCorrectionFactorToItemDesiredSizes(this, this._itemsHost);
            }, 
            set:function(value) 
            {
                HierarchicalVirtualizationItemDesiredSizesField.SetValue(this, value); 
            }
        },

//        bool IHierarchicalVirtualizationAndScrollInfo.
        MustDisableVirtualization:
        { 
            get:function() { return GroupItem.MustDisableVirtualizationField.GetValue(this); },
            set:function(value) { GroupItem.MustDisableVirtualizationField.SetValue(this, value); } 
        }, 

//        bool IHierarchicalVirtualizationAndScrollInfo.
        InBackgroundLayout: 
        {
            get:function() { return GroupItem.InBackgroundLayoutField.GetValue(this); },
            set:function(value) { GroupItem.InBackgroundLayoutField.SetValue(this, value); }
        }, 

//        private ItemsControl 
        ParentItemsControl:
        { 
            get:function()
            { 
                /*DependencyObject*/var parent = this; 
                do
                { 
                    parent = VisualTreeHelper.GetParent(parent);
                    /*ItemsControl*/var parentItemsControl = parent instanceof ItemsControl ? parent : null;
                    if (parentItemsControl != null)
                    { 
                        return parentItemsControl;
                    } 
                } while (parent != null); 

                return null; 
            }
        },

//        internal IContainItemStorage 
        ParentItemStorageProvider:
        {
            get:function() 
            { 
                /*DependencyObject*/var parentPanel = VisualTreeHelper.GetParent(this);
                if (parentPanel != null) 
                {
                    /*DependencyObject*/var owner = ItemsControl.GetItemsOwnerInternal(parentPanel);
                    return owner instanceof IContainItemStorage ? owner : null;
                } 

                return null; 
            } 
        },
 
//        internal Panel 
        ItemsHost:
        {
            get:function()
            { 
                return this._itemsHost;
            }, 
            set:function(value) { this._itemsHost = value; } 
        },
 
//        private ItemsPresenter 
        ItemsHostPresenter:
        {
            get:function()
            { 
                if (this._expander != null)
                { 
                    return Helper.FindTemplatedDescendant/*<ItemsPresenter>*/(this._expander, this._expander, ItemsPresenter.Type); 
                }
                else 
                {
                    return Helper.FindTemplatedDescendant/*<ItemsPresenter>*/(this, this, ItemsPresenter.Type);
                }
            } 
        },
 
//        internal Expander 
        Expander: { get:function() { return this._expander; } }, 

//        private FrameworkElement 
        ExpanderHeader: 
        {
            get:function()
            {
                if (this._expander != null) 
                {
                    var result = this._expander.GetTemplateChild(ExpanderHeaderPartName);
                    return result instanceof FrameworkElement ? result : null; 
                } 

                return null; 
            }
        },

//        private FrameworkElement 
        HeaderElement: 
        {
            get:function() 
            { 
                /*FrameworkElement*/var headerElement = null;
                if (this._header != null) 
                {
                    headerElement = this._header;
                }
                else if (this._expander != null) 
                {
                    // Look for Expander. We special case for Expander since its a very common usage of grouping. 
                    headerElement = this.ExpanderHeader; 
                }
                return headerElement; 
            }
        },
        
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will override this method to return approriate types.
//        internal override DependencyObjectType 
        DTypeThemeStyleKey: 
        {
            get:function() { return _dType; } 
        } 
	});
	
	Object.defineProperties(GroupItem,{
//        internal static readonly UncommonField<bool> 
        MustDisableVirtualizationField:
        {
        	get:function(){
        		if(GroupItem._MustDisableVirtualizationField === undefined){
        			GroupItem._MustDisableVirtualizationField = new UncommonField/*<bool>*/(); 
        		}
        		
        		return GroupItem._MustDisableVirtualizationField;
        	}
        },
//        internal static readonly UncommonField<bool> 
        InBackgroundLayoutField:
        {
        	get:function(){
        		if(GroupItem._InBackgroundLayoutField === undefined){
        			GroupItem._InBackgroundLayoutField = new UncommonField/*<bool>*/();  
        		}
        		
        		return GroupItem._InBackgroundLayoutField;
        	}
        }, 
//        internal static readonly UncommonField<Thickness> 
        DesiredPixelItemsSizeCorrectionFactorField:
        {
        	get:function(){
        		if(GroupItem._DesiredPixelItemsSizeCorrectionFactorField === undefined){
        			GroupItem._DesiredPixelItemsSizeCorrectionFactorField = new UncommonField/*<Thickness>*/();  
        		}
        		
        		return GroupItem._DesiredPixelItemsSizeCorrectionFactorField;
        	}
        }, 
//        internal static readonly UncommonField<HierarchicalVirtualizationConstraints> 
        HierarchicalVirtualizationConstraintsField:
        {
        	get:function(){
        		if(GroupItem._HierarchicalVirtualizationConstraintsField === undefined){
        			GroupItem._MustDisableVirtualizationField =
        	            new UncommonField/*<HierarchicalVirtualizationConstraints>*/();
        		}
        		
        		return GroupItem._MustDisableVirtualizationField;
        	}
        }, 
//        internal static readonly UncommonField<HierarchicalVirtualizationHeaderDesiredSizes> 
        HierarchicalVirtualizationHeaderDesiredSizesField:
        {
        	get:function(){
        		if(GroupItem._HierarchicalVirtualizationHeaderDesiredSizesField === undefined){
        			GroupItem._HierarchicalVirtualizationHeaderDesiredSizesField = 
        	            new UncommonField/*<HierarchicalVirtualizationHeaderDesiredSizes>*/(); 
        		}
        		
        		return GroupItem._HierarchicalVirtualizationHeaderDesiredSizesField;
        	}
        }, 
//        internal static readonly UncommonField<HierarchicalVirtualizationItemDesiredSizes> 
        HierarchicalVirtualizationItemDesiredSizesField:
        {
        	get:function(){
        		if(GroupItem._HierarchicalVirtualizationItemDesiredSizesField === undefined){
        			GroupItem._HierarchicalVirtualizationItemDesiredSizesField  = 
        	            new UncommonField/*<HierarchicalVirtualizationItemDesiredSizes>*/(); 
        		}
        		
        		return GroupItem._HierarchicalVirtualizationItemDesiredSizesField;
        	}
        },

	});
	
//    private static void 
    function OnExpanded(/*object*/ sender, /*RoutedEventArgs*/ e)
    { 
        /*GroupItem*/var groupItem = sender instanceof GroupItem ? sender : null;
        if (groupItem != null && groupItem._expander != null && groupItem._expander.IsExpanded) 
        { 
            /*ItemsControl*/var itemsControl = groupItem.ParentItemsControl;
            if (itemsControl != null && VirtualizingPanel.GetIsVirtualizing(itemsControl) && 
            		VirtualizingPanel.GetVirtualizationMode(itemsControl) == VirtualizationMode.Recycling) 
            {
                /*ItemsPresenter*/var itemsHostPresenter = groupItem.ItemsHostPresenter;
                if (itemsHostPresenter != null)
                { 
                    // In case a GroupItem that wasn't previously expanded is now
                    // recycled to represent an entity that is expanded, we face a situation 
                    // where the ItemsHost isn't connected yet but we do need to synchronously 
                    // remeasure the sub tree through the ItemsPresenter leading up to the
                    // ItemsHost panel. If we didnt do this the offsets could get skewed. 
                    groupItem.InvalidateMeasure();
                    Helper.InvalidateMeasureOnPath(itemsHostPresenter, groupItem, false /*duringMeasure*/);
                }
            } 
        }
    } 

//    static GroupItem()
    function Initialize(){ 
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(GroupItem.Type, 
        		/*new FrameworkPropertyMetadata(GroupItem.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(GroupItem.Type)); 
        _dType = DependencyObjectType.FromSystemTypeInternal(GroupItem.Type);

        // GroupItems should not be focusable by default
        UIElement.FocusableProperty.OverrideMetadata(GroupItem.Type, 
        		/*new FrameworkPropertyMetadata(false)*/
        		FrameworkPropertyMetadata.BuildWithDV(false));
//        AutomationProperties.IsOffscreenBehaviorProperty.OverrideMetadata(GroupItem.Type, new FrameworkPropertyMetadata(IsOffscreenBehavior.FromClip));
    }
	
	GroupItem.Type = new Type("GroupItem", GroupItem, [ContentControl.Type, IHierarchicalVirtualizationAndScrollInfo.Type, IContainItemStorage.Type]);
	Initialize();
	
	return GroupItem;
});
