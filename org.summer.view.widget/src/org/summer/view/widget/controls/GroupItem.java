package org.summer.view.widget.controls;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.FrameworkTemplate;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.Size;
import org.summer.view.widget.Style;
import org.summer.view.widget.UncommonField;
import org.summer.view.widget.controls.primitives.IContainItemStorage;
import org.summer.view.widget.data.CollectionViewGroup;
import org.summer.view.widget.internal.Helper;
import org.summer.view.widget.media.VisualTreeHelper;
import org.summer.view.window.Thickness;
import org.summer.view.window.automation.peer.AutomationPeer;

/// <summary> 
///     A GroupItem appears as the root of the visual subtree generated for a CollectionViewGroup.
// / </summary>
public class GroupItem extends ContentControl implements IHierarchicalVirtualizationAndScrollInfo, IContainItemStorage
{ 
    static //GroupItem()
    { 
        DefaultStyleKeyProperty.OverrideMetadata(typeof(GroupItem), new FrameworkPropertyMetadata(typeof(GroupItem))); 
        _dType = DependencyObjectType.FromSystemTypeInternal(typeof(GroupItem));

        // GroupItems should not be focusable by default
        FocusableProperty.OverrideMetadata(typeof(GroupItem), new FrameworkPropertyMetadata(false));
        AutomationProperties.IsOffscreenBehaviorProperty.OverrideMetadata(typeof(GroupItem), new FrameworkPropertyMetadata(IsOffscreenBehavior.FromClip));
    } 

    /// <summary> 
    /// Creates AutomationPeer (<see cref="UIElement.OnCreateAutomationPeer"/>) 
    /// </summary>
    protected /*override*/ /*System.Windows.Automation.Peers.*/AutomationPeer OnCreateAutomationPeer() 
    {
        return new /*System.Windows.Automation.Peers.*/GroupItemAutomationPeer(this);
    }

    public /*override*/ void OnApplyTemplate()
    { 
        super.OnApplyTemplate(); 

        _header = this.GetTemplateChild("PART_Header") as FrameworkElement; 

        // GroupItem is generally re-templated to have an Expander.
        // Look for an Expander and store its Header size.g
        _expander = Helper.FindTemplatedDescendant<Expander>(this, this); 

        // 
        // ItemValueStorage:  restore saved values for this item onto the new container 
        //
        if (_expander != null) 
        {
            ItemsControl itemsControl = ParentItemsControl;
            if (itemsControl != null && VirtualizingPanel.GetIsVirtualizingWhenGrouping(itemsControl))
            { 
                Helper.SetItemValuesOnContainer(itemsControl, _expander, itemsControl.ItemContainerGenerator.ItemFromContainer(this));
            } 

            _expander.Expanded += new RoutedEventHandler(OnExpanded);
        } 
    }

    private static void OnExpanded(Object sender, RoutedEventArgs e)
    { 
        GroupItem groupItem = sender as GroupItem;
        if (groupItem != null && groupItem._expander != null && groupItem._expander.IsExpanded) 
        { 
            ItemsControl itemsControl = groupItem.ParentItemsControl;
            if (itemsControl != null && VirtualizingPanel.GetIsVirtualizing(itemsControl) && VirtualizingPanel.GetVirtualizationMode(itemsControl) == VirtualizationMode.Recycling) 
            {
                ItemsPresenter itemsHostPresenter = groupItem.ItemsHostPresenter;
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

    /*internal*/ /*override*/ void OnTemplateChangedInternal(FrameworkTemplate oldTemplate,FrameworkTemplate newTemplate)
    { 
        super.OnTemplateChangedInternal(oldTemplate, newTemplate);

        if (_expander != null)
        { 
            _expander.Expanded -= new RoutedEventHandler(OnExpanded);
            _expander = null; 
        } 

        _itemsHost = null; 
    }

    protected /*override*/ Size ArrangeOverride(Size arrangeSize)
    { 
        arrangeSize = super.ArrangeOverride(arrangeSize);

        Helper.ComputeCorrectionFactor(ParentItemsControl, this, ItemsHost, HeaderElement); 

        return arrangeSize; 
    }

    /// <summary>
    ///     Gives a String representation of this Object. 
    /// </summary>
    /// <returns></returns> 
    /*internal*/ /*override*/ String GetPlainText() 
    {
        /*System.Windows.Data.*/CollectionViewGroup cvg = Content as /*System.Windows.Data.*/CollectionViewGroup; 
        if (cvg != null && cvg.Name != null)
        {
            return cvg.Name.ToString();
        } 

        return super.GetPlainText(); 
    } 

    //----------------------------------------------------- 
    //
    // Internal Properties
    //
    //----------------------------------------------------- 

    /*internal*/public ItemContainerGenerator Generator 
    { 
        get { return _generator; }
        set { _generator = value; } 
    }

    //------------------------------------------------------
    // 
    // Internal Methods
    // 
    //----------------------------------------------------- 

    /*internal*/public void PrepareItemContainer(Object item, ItemsControl parentItemsControl) 
    {
        if (Generator == null)
            return;     // user-declared GroupItem - ignore (bug 108423)

        // If a GroupItem is being recycled set back IsItemsHost
        if (_itemsHost != null) 
        { 
            _itemsHost.IsItemsHost = true;
        } 

        boolean isVirtualizingWhenGrouping = (parentItemsControl != null && VirtualizingPanel.GetIsVirtualizingWhenGrouping(parentItemsControl));

        // Release any previous containers. Also ensures Items and GroupStyle are hooked up correctly 
        if (Generator != null)
        { 
            if (!isVirtualizingWhenGrouping) 
            {
                Generator.Release(); 
            }
            else
            {
                Generator.RemoveAllInternal(true /*saveRecycleQueue*/); 
            }
        } 

        ItemContainerGenerator generator = Generator.Parent;
        GroupStyle groupStyle = generator.GroupStyle; 

        // apply the container style
        Style style = groupStyle.ContainerStyle;

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
                throw new InvalidOperationException(/*SR.Get(SRID.StyleForWrongType, style.TargetType.Name, this.GetType().Name)*/);

            this.Style = style;
            this.WriteInternalFlag2(InternalFlags2.IsStyleSetFromGenerator, true); 
        }

        // forward the header template information 
        if (!HasNonDefaultValue(ContentProperty))
            this.Content = item; 
        if (!HasNonDefaultValue(ContentTemplateProperty))
            this.ContentTemplate = groupStyle.HeaderTemplate;
        if (!HasNonDefaultValue(ContentTemplateSelectorProperty))
            this.ContentTemplateSelector = groupStyle.HeaderTemplateSelector; 
        if (!HasNonDefaultValue(ContentStringFormatProperty))
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

            if (_expander != null)
            {
                Helper.SetItemValuesOnContainer(parentItemsControl, _expander, item); 
            }
        } 
    } 

    /*internal*/public void ClearItemContainer(Object item, ItemsControl parentItemsControl) 
    {
        if (Generator == null)
            return;     // user-declared GroupItem - ignore (bug 108423)

        ItemContainerGenerator generator = Generator.Parent;
        GroupStyle groupStyle = generator.GroupStyle; 

        if (Object.Equals(this.Content, item))
            ClearValue(ContentProperty); 
        if (this.ContentTemplate == groupStyle.HeaderTemplate)
            ClearValue(ContentTemplateProperty);
        if (this.ContentTemplateSelector == groupStyle.HeaderTemplateSelector)
            ClearValue(ContentTemplateSelectorProperty); 
        if (this.ContentStringFormat == groupStyle.HeaderStringFormat)
            ClearValue(ContentStringFormatProperty); 

        //
        // ItemValueStorage:  save off values for this container if we're a virtualizing Group. 
        //
        if (parentItemsControl != null && VirtualizingPanel.GetIsVirtualizingWhenGrouping(parentItemsControl))
        {
            Helper.StoreItemValues((IContainItemStorage)parentItemsControl, this, item); 

            if (_expander != null) 
            { 
                Helper.StoreItemValues((IContainItemStorage)parentItemsControl, _expander, item);
            } 

            // Tell the panel to clear off all its containers.  This will cause this method to be called
            // recursively down the tree, allowing all descendent data to be stored before we save off
            // the ItemValueStorage DP for this container. 

            VirtualizingPanel vp = _itemsHost as VirtualizingPanel; 
            if (vp != null) 
            {
                vp.OnClearChildrenInternal(); 
            }

            Generator.RemoveAllInternal(true /*saveRecycleQueue*/);
        } 
        else
        { 
            Generator.Release(); 
        }
    } 

//    #region IHierarchicalVirtualizationAndScrollInfo

    public HierarchicalVirtualizationConstraints /*IHierarchicalVirtualizationAndScrollInfo.*/Constraints 
    {
        get { return HierarchicalVirtualizationConstraintsField.GetValue(this); } 
        set 
        {
            if (value.CacheLengthUnit == VirtualizationCacheLengthUnit.Page) 
            {
                throw new InvalidOperationException(SR.Get(SRID.PageCacheSizeNotAllowed));
            }
            HierarchicalVirtualizationConstraintsField.SetValue(this, value); 
        }
    } 

    public HierarchicalVirtualizationHeaderDesiredSizes /*IHierarchicalVirtualizationAndScrollInfo.*/HeaderDesiredSizes
    { 
        get
        {
            FrameworkElement headerElement = HeaderElement;
            Size pixelHeaderSize = new Size(); 

            if (this.IsVisible && headerElement != null) 
            { 
                pixelHeaderSize = headerElement.DesiredSize;
                Helper.ApplyCorrectionFactorToPixelHeaderSize(ParentItemsControl, this, _itemsHost, ref pixelHeaderSize); 
            }

            Size logicalHeaderSize = new Size(DoubleUtil.GreaterThan(pixelHeaderSize.Width, 0) ? 1 : 0,
                            DoubleUtil.GreaterThan(pixelHeaderSize.Height, 0) ? 1 : 0); 

            return new HierarchicalVirtualizationHeaderDesiredSizes(logicalHeaderSize, pixelHeaderSize); 
        } 
    }

    public HierarchicalVirtualizationItemDesiredSizes /*IHierarchicalVirtualizationAndScrollInfo.*/ItemDesiredSizes
    {
        get
        { 
            return Helper.ApplyCorrectionFactorToItemDesiredSizes(this, _itemsHost);
        } 
        set 
        {
            HierarchicalVirtualizationItemDesiredSizesField.SetValue(this, value); 
        }
    }

    public Panel /*IHierarchicalVirtualizationAndScrollInfo.*/ItemsHost 
    {
        get 
        { 
            return _itemsHost;
        } 
    }

    public boolean /*IHierarchicalVirtualizationAndScrollInfo.*/MustDisableVirtualization
    { 
        get { return MustDisableVirtualizationField.GetValue(this); }
        set { MustDisableVirtualizationField.SetValue(this, value); } 
    } 

    public boolean /*IHierarchicalVirtualizationAndScrollInfo.*/InBackgroundLayout 
    {
        get { return InBackgroundLayoutField.GetValue(this); }
        set { InBackgroundLayoutField.SetValue(this, value); }
    } 

//    #endregion 

//    #region ItemValueStorage


    public Object /*IContainItemStorage.*/ReadItemValue(Object item, DependencyProperty dp)
    {
        return Helper.ReadItemValue(this, item, dp.GlobalIndex); 
    }


    public void /*IContainItemStorage.*/StoreItemValue(Object item, DependencyProperty dp, Object value)
    { 
        Helper.StoreItemValue(this, item, dp.GlobalIndex, value);
    }

    public void /*IContainItemStorage.*/ClearItemValue(Object item, DependencyProperty dp) 
    {
        Helper.ClearItemValue(this, item, dp.GlobalIndex); 
    } 

    public void /*IContainItemStorage.*/ClearValue(DependencyProperty dp) 
    {
        Helper.ClearItemValueStorage(this, new int[] {dp.GlobalIndex});
    }

    public void /*IContainItemStorage.*/Clear()
    { 
        Helper.ClearItemValueStorage(this); 
    }

//    #endregion

    private ItemsControl ParentItemsControl
    { 
        get
        { 
            DependencyObject parent = this; 
            do
            { 
                parent = VisualTreeHelper.GetParent(parent);
                ItemsControl parentItemsControl = parent as ItemsControl;
                if (parentItemsControl != null)
                { 
                    return parentItemsControl;
                } 
            } while (parent != null); 

            return null; 
        }
    }

    /*internal*/public IContainItemStorage ParentItemStorageProvider 
    {
        get 
        { 
            DependencyObject parentPanel = VisualTreeHelper.GetParent(this);
            if (parentPanel != null) 
            {
                DependencyObject owner = ItemsControl.GetItemsOwnerInternal(parentPanel);
                return owner as IContainItemStorage;
            } 

            return null; 
        } 
    }

    /*internal*/public Panel ItemsHost
    {
        get
        { 
            return _itemsHost;
        } 
        set { _itemsHost = value; } 
    }

    private ItemsPresenter ItemsHostPresenter
    {
        get
        { 
            if (_expander != null)
            { 
                return Helper.FindTemplatedDescendant<ItemsPresenter>(_expander, _expander); 
            }
            else 
            {
                return Helper.FindTemplatedDescendant<ItemsPresenter>(this, this);
            }
        } 
    }

    /*internal*/public Expander Expander { get { return _expander; } } 

    private FrameworkElement ExpanderHeader 
    {
        get
        {
            if (_expander != null) 
            {
                return _expander.GetTemplateChild(ExpanderHeaderPartName) as FrameworkElement; 
            } 

            return null; 
        }
    }

    private FrameworkElement HeaderElement 
    {
        get 
        { 
            FrameworkElement headerElement = null;
            if (_header != null) 
            {
                headerElement = _header;
            }
            else if (_expander != null) 
            {
                // Look for Expander. We special case for Expander since its a very common usage of grouping. 
                headerElement = ExpanderHeader; 
            }
            return headerElement; 
        }
    }

    //------------------------------------------------------ 
    //
    // Private Fields 
    // 
    //------------------------------------------------------

    ItemContainerGenerator _generator;
    private Panel _itemsHost;
    FrameworkElement _header;
    Expander _expander; 

    /*internal*/public static final UncommonField<Boolean> MustDisableVirtualizationField = new UncommonField<Boolean>(); 
    /*internal*/public static final UncommonField<Boolean> InBackgroundLayoutField = new UncommonField<Boolean>(); 

    /*internal*/ public static final UncommonField<Thickness> DesiredPixelItemsSizeCorrectionFactorField = new UncommonField<Thickness>(); 

    /*internal*/public static final UncommonField<HierarchicalVirtualizationConstraints> HierarchicalVirtualizationConstraintsField =
        new UncommonField<HierarchicalVirtualizationConstraints>();
    /*internal*/public static final UncommonField<HierarchicalVirtualizationHeaderDesiredSizes> HierarchicalVirtualizationHeaderDesiredSizesField = 
        new UncommonField<HierarchicalVirtualizationHeaderDesiredSizes>();
    /*internal*/public static final UncommonField<HierarchicalVirtualizationItemDesiredSizes> HierarchicalVirtualizationItemDesiredSizesField = 
        new UncommonField<HierarchicalVirtualizationItemDesiredSizes>(); 

//    #region DTypeThemeStyleKey 

    // Returns the DependencyObjectType for the registered ThemeStyleKey's default
    // value. Controls will /*override*/ this method to return approriate types.
    /*internal*/ /*override*/public DependencyObjectType DTypeThemeStyleKey 
    {
        get { return _dType; } 
    } 

    private static DependencyObjectType _dType; 

    private final String ExpanderHeaderPartName = "HeaderSite";

//    #endregion DTypeThemeStyleKey 
}