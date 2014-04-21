package org.summer.view.widget.controls;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.FrameworkPropertyMetadataOptions;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.collection.NotifyCollectionChangedAction;
import org.summer.view.widget.controls.primitives.IItemContainerGenerator;
import org.summer.view.widget.controls.primitives.ItemsChangedEventArgs;
import org.summer.view.widget.media.VisualTreeHelper;
import org.summer.view.window.DoubleUtil;

/// <summary>
///     A base class that provides access to information that is useful for panels that with to implement virtualization.
/// </summary>
public abstract class VirtualizingPanel extends Panel 
{
    /// <summary> 
    ///     The default constructor. 
    /// </summary>
    protected VirtualizingPanel() 
    {
    	super();
    }

    public boolean CanHierarchicallyScrollAndVirtualize 
    {
        get { return CanHierarchicallyScrollAndVirtualizeCore; } 
    } 

    protected /*virtual*/ boolean CanHierarchicallyScrollAndVirtualizeCore 
    {
        get { return false; }
    }

    public double GetItemOffset(UIElement child)
    { 
        return GetItemOffsetCore(child); 
    }

    /// <summary>
    ///     Fetch the logical/item offset for this child with respect to the top of the
    ///     panel. This is similar to a TransformToAncestor operation. Just works
    ///     in logical units. 
    /// </summary>
    protected /*virtual*/ double GetItemOffsetCore(UIElement child) 
    { 
        return 0;
    } 

    /// <summary>
    ///     Attached property for use on the ItemsControl that is the host for the items being
    ///     presented by this panel. Use this property to turn virtualization on/off. 
    /// </summary>
    public static final DependencyProperty IsVirtualizingProperty = 
        DependencyProperty.RegisterAttached("IsVirtualizing", typeof(Boolean), typeof(VirtualizingPanel), 
            new FrameworkPropertyMetadata(true, FrameworkPropertyMetadataOptions.AffectsMeasure, new PropertyChangedCallback(OnVirtualizationPropertyChanged)));

    /// <summary>
    ///     Retrieves the value for <see cref="IsVirtualizingProperty" />.
    /// </summary>
    /// <param name="element">The element on which to query the value.</param> 
    /// <returns>True if virtualizing, false otherwise.</returns>
    public static boolean GetIsVirtualizing(DependencyObject element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }

        return (boolean)element.GetValue(IsVirtualizingProperty); 
    }

    /// <summary> 
    ///     Sets the value for <see cref="IsVirtualizingProperty" />.
    /// </summary> 
    /// <param name="element">The element on which to set the value.</param>
    /// <param name="value">True if virtualizing, false otherwise.</param>
    public static void SetIsVirtualizing(DependencyObject element, boolean value)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(IsVirtualizingProperty, value);
    }

    /// <summary> 
    ///     Attached property for use on the ItemsControl that is the host for the items being
    ///     presented by this panel. Use this property to modify the virtualization mode. 
    /// 
    ///     Note that this property can only be set before the panel has been initialized
    /// </summary> 
    public static final DependencyProperty VirtualizationModeProperty =
        DependencyProperty.RegisterAttached("VirtualizationMode", typeof(VirtualizationMode), typeof(VirtualizingPanel),
            new FrameworkPropertyMetadata(VirtualizationMode.Standard, FrameworkPropertyMetadataOptions.AffectsMeasure, new PropertyChangedCallback(OnVirtualizationPropertyChanged)));

    /// <summary>
    ///     Retrieves the value for <see cref="VirtualizationModeProperty" />. 
    /// </summary> 
    /// <param name="o">The Object on which to query the value.</param>
    /// <returns>The current virtualization mode.</returns> 
    public static VirtualizationMode GetVirtualizationMode(DependencyObject element)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 

        return (VirtualizationMode)element.GetValue(VirtualizationModeProperty);
    } 

    /// <summary>
    ///     Sets the value for <see cref="VirtualizationModeProperty" />.
    /// </summary> 
    /// <param name="element">The element on which to set the value.</param>
    /// <param name="value">The desired virtualization mode.</param> 
    public static void SetVirtualizationMode(DependencyObject element, VirtualizationMode value) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }

        element.SetValue(VirtualizationModeProperty, value);
    } 

    /// <summary>
    ///     Attached property for use on the ItemsControl that is the host for the items being 
    ///     presented by this panel. Use this property to turn virtualization on/off when grouping.
    /// </summary>
    public static final DependencyProperty IsVirtualizingWhenGroupingProperty =
        DependencyProperty.RegisterAttached("IsVirtualizingWhenGrouping", typeof(Boolean), typeof(VirtualizingPanel), 
            new FrameworkPropertyMetadata(false, FrameworkPropertyMetadataOptions.AffectsMeasure, new PropertyChangedCallback(OnVirtualizationPropertyChanged), new CoerceValueCallback(CoerceIsVirtualizingWhenGrouping)));

    /// <summary> 
    ///     Retrieves the value for <see cref="IsVirtualizingWhenGroupingProperty" />.
    /// </summary> 
    /// <param name="element">The Object on which to query the value.</param>
    /// <returns>True if virtualizing, false otherwise.</returns>
    public static boolean GetIsVirtualizingWhenGrouping(DependencyObject element)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }

        return (boolean)element.GetValue(IsVirtualizingWhenGroupingProperty);
    }

    /// <summary> 
    ///     Sets the value for <see cref="IsVirtualizingWhenGroupingProperty" />.
    /// </summary> 
    /// <param name="element">The element on which to set the value.</param> 
    /// <param name="value">True if virtualizing, false otherwise.</param>
    public static void SetIsVirtualizingWhenGrouping(DependencyObject element, boolean value) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(IsVirtualizingWhenGroupingProperty, value); 
    }

    /// <summary>
    ///     Attached property for use on the ItemsControl that is the host for the items being
    ///     presented by this panel. Use this property to switch between pixel and item scrolling.
    /// </summary> 
    public static final DependencyProperty ScrollUnitProperty =
        DependencyProperty.RegisterAttached("ScrollUnit", typeof(ScrollUnit), typeof(VirtualizingPanel), 
            new FrameworkPropertyMetadata(ScrollUnit.Item, FrameworkPropertyMetadataOptions.AffectsMeasure, new PropertyChangedCallback(OnVirtualizationPropertyChanged))); 

    /// <summary> 
    ///     Retrieves the value for <see cref="ScrollUnitProperty" />.
    /// </summary>
    /// <param name="element">The Object on which to query the value.</param>
    public static ScrollUnit GetScrollUnit(DependencyObject element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        return (ScrollUnit)element.GetValue(ScrollUnitProperty);
    }

    /// <summary>
    ///     Sets the value for <see cref="ScrollUnitProperty" />. 
    /// </summary> 
    /// <param name="element">The element on which to set the value.</param>
    public static void SetScrollUnit(DependencyObject element, ScrollUnit value) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(ScrollUnitProperty, value); 
    }


    /// <summary>
    ///     Attached property for use on the ItemsControl that is the host for the items being
    ///     presented by this panel. Use this property to configure the dimensions of the cache 
    ///     before and after the viewport when virtualizing. Please note that the unit of these dimensions
    ///     is determined by the value of the <see cref="CacheLengthUnitProperty"/>. 
    /// </summary> 
    public static final DependencyProperty CacheLengthProperty =
        DependencyProperty.RegisterAttached("CacheLength", typeof(VirtualizationCacheLength), typeof(VirtualizingPanel), 
            new FrameworkPropertyMetadata(new VirtualizationCacheLength(1.0), FrameworkPropertyMetadataOptions.AffectsMeasure, new PropertyChangedCallback(OnVirtualizationPropertyChanged)), new ValidateValueCallback(ValidateCacheSizeBeforeOrAfterViewport));

    /// <summary>
    ///     Retrieves the value for <see cref="CacheLengthProperty" />. 
    /// </summary>
    /// <param name="element">The Object on which to query the value.</param> 
    /// <returns>VirtualCacheLength representing the dimensions of the cache before and after the 
    /// viewport.</returns>
    public static VirtualizationCacheLength GetCacheLength(DependencyObject element) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }

        return (VirtualizationCacheLength)element.GetValue(CacheLengthProperty); 
    }

    /// <summary>
    ///     Sets the value for <see cref="CacheLengthProperty" />.
    /// </summary>
    /// <param name="element">The element on which to set the value.</param> 
    /// <param name="value">VirtualCacheLength representing the dimensions of the cache before and after the
    /// viewport.</param> 
    public static void SetCacheLength(DependencyObject element, VirtualizationCacheLength value) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }

        element.SetValue(CacheLengthProperty, value);
    } 

    /// <summary>
    ///     Attached property for use on the ItemsControl that is the host for the items being 
    ///     presented by this panel. Use this property to configure the unit portion of the before
    ///     and after cache sizes.
    /// </summary>
    public static final DependencyProperty CacheLengthUnitProperty = 
        DependencyProperty.RegisterAttached("CacheLengthUnit", typeof(VirtualizationCacheLengthUnit), typeof(VirtualizingPanel),
            new FrameworkPropertyMetadata(VirtualizationCacheLengthUnit.Page, FrameworkPropertyMetadataOptions.AffectsMeasure, new PropertyChangedCallback(OnVirtualizationPropertyChanged))); 

    /// <summary>
    ///     Retrieves the value for <see cref="CacheLengthUnitProperty" />. 
    /// </summary>
    /// <param name="element">The Object on which to query the value.</param>
    /// <returns>The CacheLenghtUnit for the matching CacheLength property.</returns>
    public static VirtualizationCacheLengthUnit GetCacheLengthUnit(DependencyObject element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        return (VirtualizationCacheLengthUnit)element.GetValue(CacheLengthUnitProperty);
    }

    /// <summary>
    ///     Sets the value for <see cref="CacheLengthUnitProperty" />. 
    /// </summary> 
    /// <param name="element">The element on which to set the value.</param>
    /// <param name="value">The CacheLenghtUnit for the matching CacheLength property.</param> 
    public static void SetCacheLengthUnit(DependencyObject element, VirtualizationCacheLengthUnit value)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 

        element.SetValue(CacheLengthUnitProperty, value);
    } 

    /// <summary>
    ///     Attached property for use on a container being presented by this panel. The parent panel
    ///     is expected to honor this property and not virtualize containers that are designated non-virtualizable. 
    /// </summary>
    public static final DependencyProperty IsContainerVirtualizableProperty = 
        DependencyProperty.RegisterAttached("IsContainerVirtualizable", typeof(Boolean), typeof(VirtualizingPanel), 
            new FrameworkPropertyMetadata(true));

    /// <summary>
    ///     Retrieves the value for <see cref="IsContainerVirtualizableProperty" />.
    /// </summary>
    /// <param name="element">The Object on which to query the value.</param> 
    /// <returns>True if the container is virtualizable, false otherwise.</returns>
    public static boolean GetIsContainerVirtualizable(DependencyObject element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }

        return (boolean)element.GetValue(IsContainerVirtualizableProperty); 
    }

    /// <summary> 
    ///     Sets the value for <see cref="IsContainerVirtualizableProperty" />.
    /// </summary> 
    /// <param name="element">The element on which to set the value.</param>
    /// <param name="value">True if container is virtualizable, false otherwise.</param>
    public static void SetIsContainerVirtualizable(DependencyObject element, boolean value)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(IsContainerVirtualizableProperty, value);
    }

    /// <summary> 
    ///     Attached property for use on a container being presented by this panel. The parent panel
    ///     is expected to honor this property and not cache container sizes that are designated such. 
    /// </summary> 
    /*internal*/ public static final DependencyProperty ShouldCacheContainerSizeProperty =
        DependencyProperty.RegisterAttached("ShouldCacheContainerSize", typeof(Boolean), typeof(VirtualizingPanel), 
            new FrameworkPropertyMetadata(true));

    /// <summary>
    ///     Retrieves the value for <see cref="ShouldCacheContainerSizeProperty" />. 
    /// </summary>
    /// <param name="element">The Object on which to query the value.</param> 
    /// <returns>True if the container size should be cached, false otherwise.</returns> 
    /*internal*/ public static boolean GetShouldCacheContainerSize(DependencyObject element)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 

        return (boolean)element.GetValue(ShouldCacheContainerSizeProperty); 
    } 

    private static boolean ValidateCacheSizeBeforeOrAfterViewport(Object value) 
    {
        VirtualizationCacheLength cacheLength = (VirtualizationCacheLength)value;
        return DoubleUtil.GreaterThanOrClose(cacheLength.CacheBeforeViewport, 0.0) &&
            DoubleUtil.GreaterThanOrClose(cacheLength.CacheAfterViewport, 0.0); 
    }

    private static Object CoerceIsVirtualizingWhenGrouping(DependencyObject d, Object baseValue) 
    {
        boolean isVirtualizing = GetIsVirtualizing(d); 
        return isVirtualizing && (boolean)baseValue;
    }

    /*internal*/ public static void OnVirtualizationPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        ItemsControl ic = d as ItemsControl; 
        if (ic != null) 
        {
            Panel p = ic.ItemsHost; 
            if (p != null)
            {
                p.InvalidateMeasure();
                ItemsPresenter itemsPresenter = VisualTreeHelper.GetParent(p) as ItemsPresenter; 
                if (itemsPresenter != null)
                { 
                    itemsPresenter.InvalidateMeasure(); 
                }

                if (d instanceof TreeView)
                {
                    DependencyProperty dp = e.Property;
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

    private static void VirtualizationPropertyChangePropagationRecursive(DependencyObject parent, Panel itemsHost) 
    {
        UIElementCollection children = itemsHost.InternalChildren; 
        int childrenCount = children.Count;
        for (int i=0; i<childrenCount; i++)
        {
            IHierarchicalVirtualizationAndScrollInfo virtualizingChild = children[i] as IHierarchicalVirtualizationAndScrollInfo; 
            if (virtualizingChild != null)
            { 
                TreeViewItem.IsVirtualizingPropagationHelper(parent, (DependencyObject)virtualizingChild); 

                Panel childItemsHost = virtualizingChild.ItemsHost; 
                if (childItemsHost != null)
                {
                    VirtualizationPropertyChangePropagationRecursive((DependencyObject)virtualizingChild, childItemsHost);
                } 
            }
        } 
    } 

    /// <summary> 
    ///     The generator associated with this panel.
    /// </summary>
    public IItemContainerGenerator ItemContainerGenerator
    { 
        get
        { 
            return Generator; 
        }
    } 

    /*internal*/ public /*override*/ void GenerateChildren()
    {
        // Do nothing. Subclasses will use the exposed generator to generate children. 
    }

    /// <summary> 
    ///     Adds a child to the InternalChildren collection.
    ///     This method is meant to be used when a virtualizing panel 
    ///     generates a new child. This method circumvents some validation
    ///     that occurs in UIElementCollection.Add.
    /// </summary>
    /// <param name="child">Child to add.</param> 
    protected void AddInternalChild(UIElement child)
    { 
        AddInternalChild(InternalChildren, child); 
    }

    /// <summary>
    ///     Inserts a child into the InternalChildren collection.
    ///     This method is meant to be used when a virtualizing panel
    ///     generates a new child. This method circumvents some validation 
    ///     that occurs in UIElementCollection.Insert.
    /// </summary> 
    /// <param name="index">The index at which to insert the child.</param> 
    /// <param name="child">Child to insert.</param>
    protected void InsertInternalChild(int index, UIElement child) 
    {
        InsertInternalChild(InternalChildren, index, child);
    }

    /// <summary>
    ///     Removes a child from the InternalChildren collection. 
    ///     This method is meant to be used when a virtualizing panel 
    ///     re-virtualizes a new child. This method circumvents some validation
    ///     that occurs in UIElementCollection.RemoveRange. 
    /// </summary>
    /// <param name="index"></param>
    /// <param name="range"></param>
    protected void RemoveInternalChildRange(int index, int range) 
    {
        RemoveInternalChildRange(InternalChildren, index, range); 
    } 

    // This is /*internal*/ public as an optimization for VirtualizingStackPanel (so it doesn't need to re-query InternalChildren repeatedly) 
    /*internal*/ public static void AddInternalChild(UIElementCollection children, UIElement child)
    {
        children.AddInternal(child);
    } 

    // This is /*internal*/ public as an optimization for VirtualizingStackPanel (so it doesn't need to re-query InternalChildren repeatedly) 
    /*internal*/ public static void InsertInternalChild(UIElementCollection children, int index, UIElement child) 
    {
        children.InsertInternal(index, child); 
    }

    // This is /*internal*/ public as an optimization for VirtualizingStackPanel (so it doesn't need to re-query InternalChildren repeatedly)
    /*internal*/ public static void RemoveInternalChildRange(UIElementCollection children, int index, int range) 
    {
        children.RemoveRangeInternal(index, range); 
    } 


    /// <summary>
    ///     Called when the Items collection associated with the containing ItemsControl changes.
    /// </summary>
    /// <param name="sender">sender</param> 
    /// <param name="args">Event arguments</param>
    protected /*virtual*/ void OnItemsChanged(Object sender, ItemsChangedEventArgs args) 
    { 
    }

    public boolean ShouldItemsChangeAffectLayout(boolean areItemChangesLocal, ItemsChangedEventArgs args)
    {
        return ShouldItemsChangeAffectLayoutCore(areItemChangesLocal, args);
    } 

    /// <summary> 
    ///     Returns whether an Items collection change affects layout for this panel. 
    /// </summary>
    /// <param name="args">Event arguments</param> 
    /// <param name="areItemChangesLocal">Says if this notification represents a direct change to this Panel's collection</param>
    protected /*virtual*/ boolean ShouldItemsChangeAffectLayoutCore(boolean areItemChangesLocal, ItemsChangedEventArgs args)
    {
        return true; 
    }

    /// <summary> 
    ///     Called when the UI collection of children is cleared by the base Panel class.
    /// </summary> 
    protected /*virtual*/ void OnClearChildren()
    {
    }

    /// <summary>
    ///     This is the public accessor for protected method BringIndexIntoView. 
    /// </summary> 
    public void BringIndexIntoViewPublic(int index)
    { 
        BringIndexIntoView(index);
    }

    /// <summary> 
    /// Generates the item at the specified index and calls BringIntoView on it.
    /// </summary> 
    /// <param name="index">Specify the item index that should become visible</param> 
    protected /*internal*/  /*virtual*/ void BringIndexIntoView(int index)
    { 
    }

    // This method returns a boolean to indicate if or not the panel layout is affected by this collection change
    /*internal*/ public /*override*/ boolean OnItemsChangedInternal(Object sender, ItemsChangedEventArgs args) 
    {
        switch (args.Action) 
        { 
            case /*NotifyCollectionChangedAction.*/Add:
            case /*NotifyCollectionChangedAction.*/Remove: 
            case /*NotifyCollectionChangedAction.*/Replace:
            case /*NotifyCollectionChangedAction.*/Move:
                // Don't allow Panel's code to run for add/remove/replace/move
                break; 

            default: 
                super.OnItemsChangedInternal(sender, args); 
                break;
        } 

        OnItemsChanged(sender, args);

        return ShouldItemsChangeAffectLayout(true /*areItemChangesLocal*/, args); 
    }

    /*internal*/ public /*override*/ void OnClearChildrenInternal() 
    {
        OnClearChildren(); 
    }
}