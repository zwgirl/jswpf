package org.summer.view.widget.controls.primitives;

import java.awt.Point;
import java.beans.EventHandler;

import javax.swing.FocusManager;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.CollectionViewSource;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.DependencyPropertyKey;
import org.summer.view.widget.EffectiveValueEntry;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.EventManager;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.FrameworkPropertyMetadataOptions;
import org.summer.view.widget.IDisposable;
import org.summer.view.widget.IEqualityComparer;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.NotifyCollectionChangedEventHandler;
import org.summer.view.widget.PropertyChangedCallback;
import org.summer.view.widget.PropertyPath;
import org.summer.view.widget.RoutedEvent;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.RoutingStrategy;
import org.summer.view.widget.Type;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.UncommonField;
import org.summer.view.widget.collection.Dictionary;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.collection.NotifyCollectionChangedAction;
import org.summer.view.widget.collection.NotifyCollectionChangedEventArgs;
import org.summer.view.widget.collection.ObservableCollection;
import org.summer.view.widget.controls.DeferredSelectedIndexReference;
import org.summer.view.widget.controls.IGeneratorHost;
import org.summer.view.widget.controls.ItemInfo;
import org.summer.view.widget.controls.ItemsControl;
import org.summer.view.widget.controls.ListBox;
import org.summer.view.widget.controls.SelectedItemCollection;
import org.summer.view.widget.controls.SelectionChangedEventArgs;
import org.summer.view.widget.controls.SelectionMode;
import org.summer.view.widget.controls.Separator;
import org.summer.view.widget.data.Binding;
import org.summer.view.widget.data.BindingExpression;
import org.summer.view.widget.data.BindingExpressionUncommonField;
import org.summer.view.widget.data.DynamicValueConverter;
import org.summer.view.widget.input.Keyboard;
import org.summer.view.widget.input.Mouse;
import org.summer.view.widget.internal.SystemXmlHelper;
/// <summary> 
/// The base class for controls that select items from among their children
/// </summary> 
//[DefaultEvent("SelectionChanged"), DefaultProperty("SelectedIndex")]
//[Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] // cannot be read & localized as String
public abstract class Selector extends ItemsControl
{ 
    //-------------------------------------------------------------------
    // 
    //  Constructors 
    //
    //------------------------------------------------------------------- 

//    #region Constructors

    /// <summary> 
    ///     Default Selector constructor.
    /// </summary> 
    protected Selector()
    {
    	 super();
        Items.CurrentChanged += new EventHandler(OnCurrentChanged); 
        ItemContainerGenerator.StatusChanged += new EventHandler(OnGeneratorStatusChanged);

        _focusEnterMainFocusScopeEventHandler = new EventHandler(OnFocusEnterMainFocusScope);
        KeyboardNavigation.Current.FocusEnterMainFocusScope += _focusEnterMainFocusScopeEventHandler; 

        ObservableCollection<Object> selectedItems = new SelectedItemCollection(this); 
        SetValue(SelectedItemsPropertyKey, selectedItems); 
        selectedItems.CollectionChanged += new NotifyCollectionChangedEventHandler(OnSelectedItemsCollectionChanged);

        // to prevent this inherited property from bleeding into nested selectors, set this locally to
        // false at construction time
        SetValue(IsSelectionActivePropertyKey, false);
    } 

    static //Selector() 
    { 
        EventManager.RegisterClassHandler(typeof(Selector), Selector.SelectedEvent, new RoutedEventHandler(Selector.OnSelected));
        EventManager.RegisterClassHandler(typeof(Selector), Selector.UnselectedEvent, new RoutedEventHandler(Selector.OnUnselected)); 
    }

//    #endregion

    //--------------------------------------------------------------------
    // 
    //  Public Events 
    //
    //------------------------------------------------------------------- 

//    #region Public Events

    /// <summary> 
    ///     An event fired when the selection changes.
    /// </summary> 
    public static final RoutedEvent SelectionChangedEvent = EventManager.RegisterRoutedEvent( 
        "SelectionChanged", RoutingStrategy.Bubble, typeof(SelectionChangedEventHandler), typeof(Selector));

    /// <summary>
    ///     An event fired when the selection changes.
    /// </summary>
//    [Category("Behavior")] 
    public /*event*/ SelectionChangedEventHandler SelectionChanged
    { 
        add { AddHandler(SelectionChangedEvent, value); } 
        remove { RemoveHandler(SelectionChangedEvent, value); }
    } 

    /// <summary>
    ///     An event fired by UI children when the IsSelected property changes to true.
    ///     For listening to selection state changes use <see cref="SelectionChangedEvent" /> instead. 
    /// </summary>
    public static final RoutedEvent SelectedEvent = EventManager.RegisterRoutedEvent( 
        "Selected", RoutingStrategy.Bubble, typeof(RoutedEventHandler), typeof(Selector)); 

    /// <summary> 
    ///     Adds a handler for the SelectedEvent attached event
    ///     For listening to selection state changes use <see cref="SelectionChangedEvent" /> instead.
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
    public static void AddSelectedHandler(DependencyObject element, RoutedEventHandler handler) 
    { 
        FrameworkElement.AddHandler(element, SelectedEvent, handler);
    } 

    /// <summary>
    ///     Removes a handler for the SelectedEvent attached event
    ///     For listening to selection state changes use <see cref="SelectionChangedEvent" /> instead. 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param> 
    public static void RemoveSelectedHandler(DependencyObject element, RoutedEventHandler handler)
    { 
        FrameworkElement.RemoveHandler(element, SelectedEvent, handler);
    }

    /// <summary> 
    ///     An event fired by UI children when the IsSelected property changes to false.
    ///     For listening to selection state changes use <see cref="SelectionChangedEvent" /> instead. 
    /// </summary> 
    public static final RoutedEvent UnselectedEvent = EventManager.RegisterRoutedEvent(
        "Unselected", RoutingStrategy.Bubble, typeof(RoutedEventHandler), typeof(Selector)); 

    /// <summary>
    ///     Adds a handler for the UnselectedEvent attached event
    ///     For listening to selection state changes use <see cref="SelectionChangedEvent" /> instead. 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param> 
    public static void AddUnselectedHandler(DependencyObject element, RoutedEventHandler handler)
    { 
        FrameworkElement.AddHandler(element, UnselectedEvent, handler);
    }

    /// <summary> 
    ///     Removes a handler for the UnselectedEvent attached event
    ///     For listening to selection state changes use <see cref="SelectionChangedEvent" /> instead. 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
    public static void RemoveUnselectedHandler(DependencyObject element, RoutedEventHandler handler)
    {
        FrameworkElement.RemoveHandler(element, UnselectedEvent, handler);
    } 

//    #endregion 

    //--------------------------------------------------------------------
    // 
    //  Public Properties
    //
    //--------------------------------------------------------------------

//    #region Public Properties

    // ----------------------------------------------------------------- 
    //  Attached Properties
    // ------------------------------------------------------------------ 

    /// <summary>
    ///     Property key for IsSelectionActiveProperty.
    /// </summary> 
    /*internal*/ static final DependencyPropertyKey IsSelectionActivePropertyKey =
            DependencyProperty.RegisterAttachedReadOnly( 
                    "IsSelectionActive", 
                    typeof(Boolean),
                    typeof(Selector), 
                    new FrameworkPropertyMetadata(false, FrameworkPropertyMetadataOptions.Inherits));

    /// <summary>
    ///     Indicates whether the keyboard focus is within the Selector. 
    /// In case when focus goes to Menu/Toolbar then selection is active too.
    /// </summary> 
    public static final DependencyProperty IsSelectionActiveProperty = 
        IsSelectionActivePropertyKey.DependencyProperty;

    /// <summary>
    ///     Get IsSelectionActive property
    /// </summary>
    /// <param name="element"></param> 
    /// <returns></returns>
    public static boolean GetIsSelectionActive(DependencyObject element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }
        return (boolean) element.GetValue(IsSelectionActiveProperty);
    } 

    /// <summary> 
    ///     Specifies whether a UI container for an item in a Selector should appear selected. 
    /// </summary>
    public static final DependencyProperty IsSelectedProperty = 
            DependencyProperty.RegisterAttached(
                    "IsSelected",
                    typeof(Boolean),
                    typeof(Selector), 
                    new FrameworkPropertyMetadata(
                            false, 
                            FrameworkPropertyMetadataOptions.BindsTwoWayByDefault)); 

    /// <summary> 
    ///     Retrieves the value of the attached property.
    /// </summary>
    /// <param name="element">The DependencyObject on which to query the property.</param>
    /// <returns>The value of the attached property.</returns> 
//    [AttachedPropertyBrowsableForChildren()]
    public static boolean GetIsSelected(DependencyObject element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }

        return (boolean) element.GetValue(IsSelectedProperty); 
    }


    /// <summary>
    ///     Sets the value of the attached property. 
    /// </summary>
    /// <param name="element">The DependencyObject on which to set the property.</param>
    /// <param name="isSelected">The new value of the attached property.</param>
    public static void SetIsSelected(DependencyObject element, boolean isSelected) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        element.SetValue(IsSelectedProperty, isSelected);
    }

    // -----------------------------------------------------------------
    //  Direct Properties 
    // ----------------------------------------------------------------- 

    /// <summary> 
    /// Whether this Selector should keep SelectedItem in [....] with the ItemCollection's current item.
    /// </summary>
    public static final DependencyProperty IsSynchronizedWithCurrentItemProperty =
            DependencyProperty.Register( 
                    "IsSynchronizedWithCurrentItem",
                    typeof(Boolean), 
                    typeof(Selector), 
                    new FrameworkPropertyMetadata(
                            (boolean/*?*/)null, 
                            new PropertyChangedCallback(OnIsSynchronizedWithCurrentItemChanged)));

    /// <summary>
    /// Whether this Selector should keep SelectedItem in [....] with the ItemCollection's current item. 
    /// </summary>
//    [Bindable(true), Category("Behavior")] 
//    [TypeConverter("System.Windows.NullableBoolConverter, PresentationFramework, Version=" + BuildInfo.WCP_VERSION + ", Culture=neutral, PublicKeyToken=" + BuildInfo.WCP_PUBLIC_KEY_TOKEN + ", Custom=null")] 
//    [Localizability(LocalizationCategory.NeverLocalize)] // not localizable
    public boolean/*?*/ IsSynchronizedWithCurrentItem 
    {
        get { return (boolean?) GetValue(IsSynchronizedWithCurrentItemProperty); }
        set { SetValue(IsSynchronizedWithCurrentItemProperty, value); }
    } 

    private static void OnIsSynchronizedWithCurrentItemChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    { 
        Selector s = (Selector)d;
        s.SetSynchronizationWithCurrentItem(); 
    }

    private void SetSynchronizationWithCurrentItem()
    { 
        boolean/*?*/ isSynchronizedWithCurrentItem = IsSynchronizedWithCurrentItem;
        boolean oldSync = IsSynchronizedWithCurrentItemPrivate; 
        boolean newSync; 

        if (isSynchronizedWithCurrentItem.HasValue) 
        {
            // if there's a value, use it
            newSync = isSynchronizedWithCurrentItem.Value;
        } 
        else
        { 
            // don't do the default logic until the end of initialization. 
            // This reduces the dependence on the order of property-setting.
            if (!IsInitialized) 
                return;

            // when the value is null, synchronize iff selection mode is Single
            // and there's a non-default view. 
            SelectionMode mode = (SelectionMode)GetValue(ListBox.SelectionModeProperty);
            newSync = (mode == SelectionMode.Single) && 
                        !CollectionViewSource.IsDefaultView(Items.CollectionView); 
        }

        IsSynchronizedWithCurrentItemPrivate = newSync;

        if (!oldSync && newSync)
        { 
            // if the selection has already been set, honor it and bring currency
            // into [....].  (Typical case:  <ListBox SelectedItem=x IsSync=true/>) 
            // Otherwise, bring selection into [....] with currency. 
            if (SelectedItem != null)
            { 
                SetCurrentToSelected();
            }
            else
            { 
                SetSelectedToCurrent();
            } 
        } 
    }

    /// <summary>
    ///     SelectedIndex DependencyProperty
    /// </summary>
    public static final DependencyProperty SelectedIndexProperty = 
            DependencyProperty.Register(
                    "SelectedIndex", 
                    typeof(Integer), 
                    typeof(Selector),
                    new FrameworkPropertyMetadata( 
                            -1,
                            FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal,
                            new PropertyChangedCallback(OnSelectedIndexChanged),
                            new CoerceValueCallback(CoerceSelectedIndex)), 
                    new ValidateValueCallback(ValidateSelectedIndex));

    /// <summary> 
    ///     The index of the first item in the current selection or -1 if the selection is empty.
    /// </summary> 
//    [Bindable(true), Category("Appearance"), DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
//    [Localizability(LocalizationCategory.NeverLocalize)] // not localizable
    public int SelectedIndex
    { 
        get { return (int) GetValue(SelectedIndexProperty); }
        set { SetValue(SelectedIndexProperty, value); } 
    } 

    private static void OnSelectedIndexChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        Selector s = (Selector) d;

        // If we're in the middle of a selection change, ignore all changes 
        if (!s.SelectionChange.IsActive)
        { 
            int newIndex = (int) e.NewValue; 
            s.SelectionChange.SelectJustThisItem(s.ItemInfoFromIndex(newIndex), true /* assumeInItemsCollection */);
        } 
    }

    private static boolean ValidateSelectedIndex(Object o)
    { 
        return ((int) o) >= -1;
    } 

    private static Object CoerceSelectedIndex(DependencyObject d, Object value)
    { 
        Selector s = (Selector) d;
        if ((value instanceof Integer) && (int) value >= s.Items.Count)
        {
            return DependencyProperty.UnsetValue; 
        }

        return value; 
    }

    /// <summary>
    ///     SelectedItem DependencyProperty 
    /// </summary>
    public static final DependencyProperty SelectedItemProperty = 
            DependencyProperty.Register( 
                    "SelectedItem",
                    typeof(Object), 
                    typeof(Selector),
                    new FrameworkPropertyMetadata(
                            null,
                            FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
                            new PropertyChangedCallback(OnSelectedItemChanged),
                            new CoerceValueCallback(CoerceSelectedItem))); 

    /// <summary>
    ///  The first item in the current selection, or null if the selection is empty. 
    /// </summary>
//    [Bindable(true), Category("Appearance"), DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
    public Object SelectedItem
    { 
        get { return GetValue(SelectedItemProperty); }
        set { SetValue(SelectedItemProperty, value); } 
    } 

    private static void OnSelectedItemChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        Selector s = (Selector) d;

        if (!s.SelectionChange.IsActive) 
        {
            s.SelectionChange.SelectJustThisItem(s.NewItemInfo(e.NewValue), false /* assumeInItemsCollection */); 
        } 
    }

    private static Object CoerceSelectedItem(DependencyObject d, Object value)
    {
        Selector s = (Selector) d;
        if (value == null || s.SkipCoerceSelectedItemCheck) 
             return value;

        int selectedIndex = s.SelectedIndex; 

        if ( (selectedIndex > -1 && selectedIndex < s.Items.Count && s.Items[selectedIndex] == value) 
            || s.Items.Contains(value))
        {
            return value;
        } 

        return DependencyProperty.UnsetValue; 
    } 



    /// <summary>
    ///     SelectedValue DependencyProperty
    /// </summary> 
    public static final DependencyProperty SelectedValueProperty =
            DependencyProperty.Register( 
                    "SelectedValue", 
                    typeof(Object),
                    typeof(Selector), 
                    new FrameworkPropertyMetadata(
                            null,
                            FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                            new PropertyChangedCallback(OnSelectedValueChanged), 
                            new CoerceValueCallback(CoerceSelectedValue)));

    /// <summary> 
    ///  The value of the SelectedItem, obtained using the SelectedValuePath.
    /// </summary> 
    /// <remarks>
    /// <p>Setting SelectedValue to some value x attempts to select an item whose
    /// "value" evaluates to x, using the current setting of <seealso cref="SelectedValuePath"/>.
    /// If no such item can be found, the selection is cleared.</p> 
    ///
    /// <p>Getting the value of SelectedValue returns the "value" of the <seealso cref="SelectedItem"/>, 
    /// using the current setting of <seealso cref="SelectedValuePath"/>, or null 
    /// if there is no selection.</p>
    /// 
    /// <p>Note that these rules imply that getting SelectedValue immediately after
    /// setting it to x will not necessarily return x.  It might return null,
    /// if no item with value x can be found.</p>
    /// </remarks> 
//    [Bindable(true), Category("Appearance"), DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
//    [Localizability(LocalizationCategory.NeverLocalize)] // not localizable 
    public Object SelectedValue 
    {
        get { return GetValue(SelectedValueProperty); } 
        set { SetValue(SelectedValueProperty, value); }
    }

    /// <summary> 
    /// This could happen when SelectedValuePath has changed,
    /// SelectedItem has changed, or someone is setting SelectedValue. 
    /// </summary> 
    private static void OnSelectedValueChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
    }

    // Select an item whose value matches the given value
    private Object SelectItemWithValue(Object value) 
    {
        _cacheValid[(int)CacheBits.SelectedValueDrivesSelection] = true; 

        Object item;

        // look through the items for one whose value matches the given value
        if (HasItems)
        {
            int index; 
            item = FindItemWithValue(value, /*out*/ index);

            // We can assume it's in the collection because we just searched 
            // through the collection to find it.
            SelectionChange.SelectJustThisItem(NewItemInfo(item, null, index), true /* assumeInItemsCollection */); 
        }
        else
        {
            // if there are no items, protect SelectedValue from being overwritten 
            // until items show up.  This enables a SelectedValue set from markup
            // to set the initial selection when the items eventually appear. 
            item = DependencyProperty.UnsetValue; 
            _cacheValid[(int)CacheBits.SelectedValueWaitsForItems] = true;
        } 

        _cacheValid[(int)CacheBits.SelectedValueDrivesSelection] = false;
        return item;
    } 

    private Object FindItemWithValue(Object value, /*out*/ int index) 
    { 
        index = -1;

        if (!HasItems)
            return DependencyProperty.UnsetValue;

        // use a representative item to determine which kind of binding to use (XML vs. CLR) 
        BindingExpression bindingExpr = PrepareItemValueBinding(Items.GetRepresentativeItem());

        if (bindingExpr == null) 
            return DependencyProperty.UnsetValue;   // no suitable item found

        // optimize for case where there is no SelectedValuePath (meaning
        // that the value of the item is the item itself, or the InnerText
        // of the item)
        if (String.IsNullOrEmpty(SelectedValuePath)) 
        {
            // when there's no SelectedValuePath, the binding's Path 
            // is either empty (CLR) or "/InnerText" (XML) 
            String path = bindingExpr.ParentBinding.Path.Path;
//            Debug.Assert(String.IsNullOrEmpty(path) || path == "/InnerText"); 
            if (String.IsNullOrEmpty(path))
            {
                // CLR - item is its own selected value
                index = Items.IndexOf(value); 
                if (index >= 0)
                    return value; 
                else 
                    return DependencyProperty.UnsetValue;
            } 
            else
            {
                // XML - use the InnerText as the selected value
                return SystemXmlHelper.FindXmlNodeWithInnerText(Items, value, out index); 
            }
        } 

        Type selectedType = (value != null) ?  value.GetType() : null;
        Object selectedValue = value; 
        DynamicValueConverter converter = new DynamicValueConverter(false);

        index = 0;
        for/*each*/ (Object current : Items) 
        {
            bindingExpr.Activate(current); 
            Object itemValue = bindingExpr.Value; 
            if (VerifyEqual(value, selectedType, itemValue, converter))
            { 
                bindingExpr.Deactivate();
                return current;
            }
            ++index; 
        }
        bindingExpr.Deactivate(); 

        index = -1;
        return DependencyProperty.UnsetValue; 
    }

    private boolean VerifyEqual(Object knownValue, Type knownType, Object itemValue, DynamicValueConverter converter)
    { 
        Object tempValue = knownValue;

        if (knownType != null && itemValue != null) 
        {
            Type itemType = itemValue.GetType(); 

            // determine if selectedValue is comparable to itemValue, convert if necessary
            // using a DefaultValueConverter
            if (!knownType.IsAssignableFrom(itemType)) 
            {
                tempValue = converter.Convert(knownValue, itemType); 
                if (tempValue == DependencyProperty.UnsetValue) 
                {
                    // can't convert, keep original value for the following Object comparison 
                    tempValue = knownValue;
                }
            }
        } 

        return Object.Equals(tempValue, itemValue); 
    } 


    private static Object CoerceSelectedValue(DependencyObject d, Object value)
    {
        Selector s = (Selector)d;

        if (s.SelectionChange.IsActive)
        { 
            // If we're in the middle of a selection change, accept the value 
            s._cacheValid[(int)CacheBits.SelectedValueDrivesSelection] = false;
        } 
        else
        {
            // Otherwise, this is a user-initiated change to SelectedValue.
            // Find the corresponding item. 
            Object item = s.SelectItemWithValue(value);

            // if the search fails, coerce the value to null.  Unless there 
            // are no items at all, in which case wait for the items to appear
            // and search again. 
            if (item == DependencyProperty.UnsetValue && s.HasItems)
            {
                value = null;
            } 
        }

        return value; 
    }


    /// <summary>
    ///     SelectedValuePath DependencyProperty
    /// </summary> 
    public static final DependencyProperty SelectedValuePathProperty =
            DependencyProperty.Register( 
                    "SelectedValuePath", 
                    typeof(String),
                    typeof(Selector), 
                    new FrameworkPropertyMetadata(
                            String.Empty,
                            new PropertyChangedCallback(OnSelectedValuePathChanged)));

    /// <summary>
    ///  The path used to retrieve the SelectedValue from the SelectedItem 
    /// </summary> 
//    [Bindable(true), Category("Appearance")]
//    [Localizability(LocalizationCategory.NeverLocalize)] // not localizable 
    public String SelectedValuePath
    {
        get { return (String) GetValue(SelectedValuePathProperty); }
        set { SetValue(SelectedValuePathProperty, value); } 
    }

    private static void OnSelectedValuePathChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        Selector s = (Selector)d; 
        // discard the current ItemValue binding
        ItemValueBindingExpression.ClearValue(s);

        // select the corresponding item 
        EffectiveValueEntry entry = s.GetValueEntry(
                    s.LookupEntry(SelectedValueProperty.GlobalIndex), 
                    SelectedValueProperty, 
                    null,
                    RequestFlags.RawEntry); 
        if (entry.IsCoerced || s.SelectedValue != null)
        {
            // Coercing SelectedValue will retry a previously-set value that had
            // been coerced to null.  (Dev10 513711) 
            s.CoerceValue(SelectedValueProperty);
        } 
    } 

    /// <summary> 
    /// Prepare the binding on the ItemValue property, creating it if necessary.
    /// Use the item to decide what kind of binding (XML vs. CLR) to use.
    /// </summary>
    /// <param name="item"></param> 
    private BindingExpression PrepareItemValueBinding(Object item)
    { 
        if (item == null) 
            return null;

        Binding binding;
        boolean useXml = SystemXmlHelper.IsXmlNode(item);

        BindingExpression bindingExpr = ItemValueBindingExpression.GetValue(this); 

        // replace existing binding if it's the wrong kind 
        if (bindingExpr != null) 
        {
            binding = bindingExpr.ParentBinding; 
            boolean usesXml = (binding.XPath != null);
            if ((!usesXml && useXml) || (usesXml && !useXml))
            {
                ItemValueBindingExpression.ClearValue(this); 
                bindingExpr = null;
            } 
        } 

        if (bindingExpr == null) 
        {
            // create the binding
            binding = new Binding();

            // Set source to null so binding does not use ambient DataContext
            binding.Source = null; 

            if (useXml)
            { 
                binding.XPath = SelectedValuePath;
                binding.Path = new PropertyPath("/InnerText");
            }
            else 
            {
                binding.Path = new PropertyPath(SelectedValuePath); 
            } 

            bindingExpr = (BindingExpression)BindingExpression.CreateUntargetedBindingExpression(this, binding); 
            ItemValueBindingExpression.SetValue(this, bindingExpr);
        }

        return bindingExpr; 
    }



    /// <summary> 
    ///     The key needed set a read-only property.
    /// </summary>
    private static final DependencyPropertyKey SelectedItemsPropertyKey =
            DependencyProperty.RegisterReadOnly( 
                    "SelectedItems",
                    typeof(IList), 
                    typeof(Selector), 
                    new FrameworkPropertyMetadata(
                            (IList) null)); 


    /// <summary>
    /// A read-only IList containing the currently selected items 
    /// </summary>
    /*internal*/ static final DependencyProperty SelectedItemsImplProperty = 
            SelectedItemsPropertyKey.DependencyProperty; 


    /// <summary>
    /// The currently selected items.
    /// </summary>
    /*internal*/public IList SelectedItemsImpl 
    {
        get { return (IList)GetValue(SelectedItemsImplProperty); } 
    } 


    /// <summary>
    /// Select multiple items.
    /// </summary>
    /// <param name="selectedItems">Collection of items to be selected.</param> 
    /// <returns>true if all items have been selected.</returns>
    /*internal*/public boolean SetSelectedItemsImpl(IEnumerable selectedItems) 
    { 
        boolean succeeded = false;

        if (!SelectionChange.IsActive)
        {
            SelectionChange.Begin();
            SelectionChange.CleanupDeferSelection(); 
            ObservableCollection<Object> oldSelectedItems = (ObservableCollection<Object>) GetValue(SelectedItemsImplProperty);

            try 
            {
                // Unselect everything in oldSelectedItems. 
                if (oldSelectedItems != null)
                {
                    foreach (Object currentlySelectedItem in oldSelectedItems)
                    { 
                        SelectionChange.Unselect(NewUnresolvedItemInfo(currentlySelectedItem));
                    } 
                } 

                if (selectedItems != null) 
                {
                    // Make sure that we can select every items.
                    foreach (Object item in selectedItems)
                    { 
                        if (!SelectionChange.Select(NewUnresolvedItemInfo(item), false /* assumeInItemsCollection */))
                        { 
                            SelectionChange.Cancel(); 
                            return false;
                        } 
                    }
                }

                SelectionChange.End(); 
                succeeded = true;
            } 
            finally 
            {
                if (!succeeded) 
                {
                    SelectionChange.Cancel();
                }
            } 
        }

        return succeeded; 
    }

    private void OnSelectedItemsCollectionChanged(Object sender, NotifyCollectionChangedEventArgs e)
    {
        // Ignore selection changes we're causing.
        if (SelectionChange.IsActive) 
        {
            return; 
        } 

        if (!CanSelectMultiple) 
        {
            throw new InvalidOperationException(SR.Get(SRID.ChangingCollectionNotSupported));
        }

        SelectionChange.Begin();
        boolean succeeded=false; 
        try 
        {
            switch (e.Action) 
            {
                case NotifyCollectionChangedAction.Add:
                    if (e.NewItems.Count != 1)
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported)); 

                    SelectionChange.Select(NewUnresolvedItemInfo(e.NewItems[0]), false /* assumeInItemsCollection */); 
                    break; 

                case NotifyCollectionChangedAction.Remove: 
                    if (e.OldItems.Count != 1)
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported));

                    SelectionChange.Unselect(NewUnresolvedItemInfo(e.OldItems[0])); 
                    break;

                case NotifyCollectionChangedAction.Reset: 
                    SelectionChange.CleanupDeferSelection();
                    for (int i = 0; i < _selectedItems.Count; i++) 
                    {
                        SelectionChange.Unselect(_selectedItems[i]);
                    }

                    ObservableCollection<Object> userSelectedItems = (ObservableCollection<Object>)sender;

                    for (int i = 0; i < userSelectedItems.Count; i++) 
                    {
                        SelectionChange.Select(NewUnresolvedItemInfo(userSelectedItems[i]), false /* assumeInItemsCollection */); 
                    }
                    break;

                case NotifyCollectionChangedAction.Replace: 
                    if (e.NewItems.Count != 1 || e.OldItems.Count != 1)
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported)); 

                    SelectionChange.Unselect(NewUnresolvedItemInfo(e.OldItems[0]));
                    SelectionChange.Select(NewUnresolvedItemInfo(e.NewItems[0]), false /* assumeInItemsCollection */); 
                    break;

                case NotifyCollectionChangedAction.Move:
                    break;  // order within SelectedItems doesn't matter 

                default: 
                    throw new NotSupportedException(SR.Get(SRID.UnexpectedCollectionChangeAction, e.Action)); 
            }

            SelectionChange.End();
            succeeded = true;
        }
        finally 
        {
            if (!succeeded) 
            { 
                SelectionChange.Cancel();
            } 
        }
    }

//    #endregion 


    //------------------------------------------------------------------- 
    //
    //  Internal Properties 
    //
    //--------------------------------------------------------------------

//    #region Internal Properties 

    /// <summary> 
    /// Whether this Selector can select more than one item at once 
    /// </summary>
    /*internal*/ boolean CanSelectMultiple 
    {
        get { return _cacheValid[(int)CacheBits.CanSelectMultiple]; }
        set
        { 
            if (_cacheValid[(int)CacheBits.CanSelectMultiple] != value)
            { 
                _cacheValid[(int)CacheBits.CanSelectMultiple] = value; 
                if (!value && (_selectedItems.Count > 1))
                { 
                    SelectionChange.Validate();
                }
            }
        } 
    }

//    #endregion 

    //------------------------------------------------------------------- 
    //
    //  Internal Methods
    //
    //-------------------------------------------------------------------- 

//    #region Internal Methods 

    /// <summary>
    /// Clear the IsSelected property from containers that are no longer used.  This is done for container recycling; 
    /// If we ever reuse a container with a stale IsSelected value the UI will incorrectly display it as selected.
    /// </summary>
    protected /*override*/ void ClearContainerForItemOverride(DependencyObject element, Object item)
    { 
        super.ClearContainerForItemOverride(element, item);

        //This check ensures that selection is cleared only for generated containers. 
        if ( !((IGeneratorHost)this).IsItemItsOwnContainer(item) )
        { 
            try
            {
                _clearingContainer = element;
                element.ClearValue(IsSelectedProperty); 
            }
            finally 
            { 
                _clearingContainer = null;
            } 
        }
    }

    /*internal*/ void RaiseIsSelectedChangedAutomationEvent(DependencyObject container, boolean isSelected) 
    {
        SelectorAutomationPeer selectorPeer = UIElementAutomationPeer.FromElement(this) as SelectorAutomationPeer; 
        if (selectorPeer != null && selectorPeer.ItemPeers != null) 
        {
            Object item = GetItemOrContainerFromContainer(container); 
            if (item != null)
            {
                SelectorItemAutomationPeer itemPeer = selectorPeer.ItemPeers[item] as SelectorItemAutomationPeer;
                if (itemPeer != null) 
                    itemPeer.RaiseAutomationIsSelectedChanged(isSelected);
            } 
        } 
    }

    /*internal*/ void SetInitialMousePosition()
    {
        _lastMousePosition = Mouse.GetPosition(this);
    } 

    // Tracks mouse movement. 
    // Returns true if the mouse moved from the last time this method was called. 
    /*internal*/ boolean DidMouseMove()
    { 
        Point newPosition = Mouse.GetPosition(this);
        if (newPosition != _lastMousePosition)
        {
            _lastMousePosition = newPosition; 
            return true;
        } 

        return false;
    } 

    /*internal*/ void ResetLastMousePosition()
    {
        _lastMousePosition = new Point(); 
    }

    /// <summary> 
    /// Select all items in the collection.
    /// Assumes that CanSelectMultiple is true 
    /// </summary>
    /*internal*/ /*virtual*/public void SelectAllImpl()
    {
        Debug.Assert(CanSelectMultiple, "CanSelectMultiple should be true when calling SelectAllImpl"); 

        SelectionChange.Begin(); 
        SelectionChange.CleanupDeferSelection(); 
        try
        { 
            int index = 0;
            for/*each*/ (Object current : Items)
            {
                ItemInfo info = NewItemInfo(current, null, index++); 
                SelectionChange.Select(info, true /* assumeInItemsCollection */);
            } 
        } 
        finally
        { 
            SelectionChange.End();
        }
    }

    /// <summary>
    /// Unselect all items in the collection. 
    /// </summary> 
    /*internal*/ /*virtual*/public void UnselectAllImpl()
    { 
        SelectionChange.Begin();
        SelectionChange.CleanupDeferSelection();
        try
        { 
            Object selectedItem = InternalSelectedItem;

            for/*each*/ (ItemInfo info : _selectedItems) 
            {
                SelectionChange.Unselect(info); 
            }
        }
        finally
        { 
            SelectionChange.End();
        } 
    } 

//    #endregion 

    //--------------------------------------------------------------------
    //
    //  Protected Methods 
    //
    //------------------------------------------------------------------- 

//    #region Protected Methods

    /// <summary>
    /// Updates the current selection when Items has changed
    /// </summary>
    /// <param name="e">Information about what has changed</param> 
    protected /*override*/ void OnItemsChanged(NotifyCollectionChangedEventArgs e)
    { 
        // When items become available, reevaluate the choice of algorithm 
        // used by _selectedItems.
        if (e.Action == NotifyCollectionChangedAction.Reset || 
            (e.Action == NotifyCollectionChangedAction.Add &&
             e.NewStartingIndex == 0))
        {
            ResetSelectedItemsAlgorithm(); 
        }

        super.OnItemsChanged(e); 

        // Do not coerce the SelectedIndexProperty if it holds a DeferredSelectedIndexReference 
        // because this deferred reference Object is guaranteed to produce a pre-coerced value.
        // Also if you did coerce it then you will lose the attempted performance optimization
        // because it will get dereferenced immediately in order to supply a baseValue for coersion.

        EffectiveValueEntry entry = GetValueEntry(
                    LookupEntry(SelectedIndexProperty.GlobalIndex), 
                    SelectedIndexProperty, 
                    null,
                    RequestFlags.DeferredReferences); 

        if (!entry.IsDeferredReference ||
            !(entry.Value instanceof DeferredSelectedIndexReference))
        { 
            CoerceValue(SelectedIndexProperty);
        } 

        CoerceValue(SelectedItemProperty);

        if (_cacheValid[(int)CacheBits.SelectedValueWaitsForItems] &&
            !Object.Equals(SelectedValue, InternalSelectedValue))
        {
            // This sets the selection from SelectedValue when SelectedValue 
            // was set prior to the arrival of any items to select, provided
            // that SelectedIndex or SelectedItem didn't already do it. 
            SelectItemWithValue(SelectedValue); 
        }

        switch (e.Action)
        {
            case NotifyCollectionChangedAction.Add:
            { 
                SelectionChange.Begin();
                try 
                { 
                    ItemInfo info = NewItemInfo(e.NewItems[0], null, e.NewStartingIndex);
                    // If we added something, see if it was set be selected and [....]. 
                    if (InfoGetIsSelected(info))
                    {
                        SelectionChange.Select(info, true /* assumeInItemsCollection */);
                    } 
                }
                finally 
                { 
                    SelectionChange.End();
                } 
                break;
            }

            case NotifyCollectionChangedAction.Replace: 
            {
                // RemoveFromSelection works, with one wrinkle.  If the 
                // replaced item was selected, the old item is in _selectedItems, 
                // but its container now holds the new item.  The Remove code will
                // update _selectedItems correctly, except for the step that 
                // sets container.IsSelected=false.   We do that here as a special case.
                ItemSetIsSelected(ItemInfoFromIndex(e.NewStartingIndex), false);
                RemoveFromSelection(e);
                break; 
            }

            case NotifyCollectionChangedAction.Remove: 
            {
                RemoveFromSelection(e); 
                break;
            }

            case NotifyCollectionChangedAction.Move: 
            {
                SelectionChange.Validate(); 
                break; 
            }

            case NotifyCollectionChangedAction.Reset:
            {
                // catastrophic update -- need to resynchronize everything.

                // If we remove all the items we clear the deferred selection
                if (Items.IsEmpty) 
                    SelectionChange.CleanupDeferSelection(); 

                // This is to support the MasterDetail scenario. 
                // When the Items is refreshed, Items.Current could be the old selection for this view.
                if (Items.CurrentItem != null && IsSynchronizedWithCurrentItemPrivate == true)
                {
                    // 

                    SetSelectedToCurrent(); 
                } 
                else
                { 
                    SelectionChange.Begin();
                    try
                    {
                        // Find where previously selected items have moved to 
                        LocateSelectedItems(deselectMissingItems:true);

                        // Select everything in Items that is selected but isn't in the _selectedItems. 
                        if (ItemsSource == null)
                        { 
                            for (int i = 0; i < Items.Count; i++)
                            {
                                ItemInfo info = ItemInfoFromIndex(i);

                                // This only works for items that know they're selected:
                                // items that are UI elements or items that have had their UI generated. 
                                if (InfoGetIsSelected(info)) 
                                {
                                    if (!_selectedItems.Contains(info)) 
                                    {
                                        SelectionChange.Select(info, true /* assumeInItemsCollection */);
                                    }
                                } 
                            }
                        } 
                    } 
                    finally
                    { 
                        SelectionChange.End();
                    }
                }
                break; 
            }
            default: 
                throw new NotSupportedException(SR.Get(SRID.UnexpectedCollectionChangeAction, e.Action)); 
        }
    } 

    /// <summary>
    ///     Adjust ItemInfos when the Items property changes.
    /// </summary> 
    /*internal*/ /*override*/ void AdjustItemInfoOverride(NotifyCollectionChangedEventArgs e)
    { 
        AdjustItemInfos(e, _selectedItems); 
        super.AdjustItemInfoOverride(e);
    } 

    void RemoveFromSelection(NotifyCollectionChangedEventArgs e)
    {
        SelectionChange.Begin(); 
        try
        { 
            // if they removed something in a selection, remove it. 
            // When End() commits the changes it will update SelectedIndex.
            ItemInfo info = NewItemInfo(e.OldItems[0], ItemInfo.SentinelContainer, e.OldStartingIndex); 

            if (_selectedItems.Contains(info))
            {
                SelectionChange.Unselect(info); 
            }
        } 
        finally 
        {
            // Here SelectedIndex will be fixed to point to the first thing in _selectedItems, so 
            // the case of removing something before SelectedIndex is taken care of.
            SelectionChange.End();
        }
    } 

    /// <summary> 
    /// A virtual function that is called when the selection is changed. Default behavior 
    /// is to raise a SelectionChangedEvent
    /// </summary> 
    /// <param name="e">The inputs for this event. Can be raised (default behavior) or processed
    ///   in some other way.</param>
    protected /*virtual*/ void OnSelectionChanged(SelectionChangedEventArgs e)
    { 
        RaiseEvent(e);
    } 

    /// <summary>
    ///     An event reporting that the IsKeyboardFocusWithin property changed. 
    /// </summary>
    protected /*override*/ void OnIsKeyboardFocusWithinChanged(DependencyPropertyChangedEventArgs e)
    {
        super.OnIsKeyboardFocusWithinChanged(e); 

        // When focus within changes we need to update the value of IsSelectionActive property. 
        // In case focus is within the selector then IsSelectionActive is true. 
        // In case focus is within the current visual root but in a different FocusScope
        // (e.g. Menu, Toolbar, ContextMenu) then IsSelectionActive is true. 
        // In all other cases IsSelectionActive is false.
        boolean isSelectionActive = false;
        if ((boolean)e.NewValue)
        { 
            isSelectionActive = true;
        } 
        else 
        {
            DependencyObject currentFocus = Keyboard.FocusedElement as DependencyObject; 
            if (currentFocus != null)
            {
                UIElement root = KeyboardNavigation.GetVisualRoot(this) as UIElement;
                if (root != null && root.IsKeyboardFocusWithin) 
                {
                    if (FocusManager.GetFocusScope(currentFocus) != FocusManager.GetFocusScope(this)) 
                    { 
                        isSelectionActive = true;
                    } 
                }
            }
        }

        if (isSelectionActive)
        { 
            SetValue(IsSelectionActivePropertyKey, BooleanBoxes.TrueBox); 
        }
        else 
        {
            SetValue(IsSelectionActivePropertyKey, BooleanBoxes.FalseBox);
        }
    } 

    private void OnFocusEnterMainFocusScope(Object sender, EventArgs e) 
    { 
        // When KeyboardFocus comes back to the main focus scope and the Selector does not have focus within - clear IsSelectionActivePrivateProperty
        if (!IsKeyboardFocusWithin) 
        {
            ClearValue(IsSelectionActivePropertyKey);
        }
    } 

    /// <summary> 
    /// Called when the value of ItemsSource changes. 
    /// </summary>
    protected /*override*/ void OnItemsSourceChanged(IEnumerable oldValue, IEnumerable newValue) 
    {
        SetSynchronizationWithCurrentItem();
    }

    /// <summary>
    /// Prepare the element to display the item.  This may involve 
    /// applying styles, setting bindings, etc. 
    /// </summary>
    protected /*override*/ void PrepareContainerForItemOverride(DependencyObject element, Object item) 
    {
        super.PrepareContainerForItemOverride(element, item);

        // In some cases, the current TabOnceActiveElement will be pointing to an orphaned container. 
        // This causes problems with restoring focus, so to work around this we'll reset it whenever
        // the selected item is prepared. 
        if (item == SelectedItem) 
        {
            KeyboardNavigation.Current.UpdateActiveElement(this, element); 
        }

        // when grouping, all new containers go through this codepath, while only
        // the top-level containers are covered by the OnGeneratorStatusChanged 
        // codepath.   In either case, we potentially need to adjust selection
        // properties and ItemInfos involving the new containers. 
        OnNewContainer(); 
    }

    // when initialization is complete (so that all properties from markup have
    // been set), act on IsSynchronized
    protected /*override*/ void OnInitialized(EventArgs e)
    { 
        super.OnInitialized(e);
        SetSynchronizationWithCurrentItem(); 
    } 


//    #endregion

    //--------------------------------------------------------------------
    // 
    //  Implementation
    // 
    //------------------------------------------------------------------- 

//    #region Implementation 

    // used to retrieve the value of an item, according to the SelectedValuePath
    private static final BindingExpressionUncommonField ItemValueBindingExpression = new BindingExpressionUncommonField();

    // True if we're really synchronizing selection and current item
    private boolean IsSynchronizedWithCurrentItemPrivate 
    { 
        get { return _cacheValid[(int)CacheBits.IsSynchronizedWithCurrentItem]; }
        set { _cacheValid[(int)CacheBits.IsSynchronizedWithCurrentItem] = value; } 
    }

    private boolean SkipCoerceSelectedItemCheck
    { 
        get { return _cacheValid[(int)CacheBits.SkipCoerceSelectedItemCheck]; }
        set { _cacheValid[(int)CacheBits.SkipCoerceSelectedItemCheck] = value; } 
    } 


//    #endregion

//    #region Private Methods

    /// <summary>
    /// Adds/Removes the given item to the collection.  Assumes the item is in the collection. 
    /// </summary> 
    private void SetSelectedHelper(Object item, FrameworkElement UI, boolean selected)
    { 
//        Debug.Assert(!SelectionChange.IsActive, "SelectionChange is already active -- use SelectionChange.Select or Unselect");

        boolean selectable;

        selectable = ItemGetIsSelectable(item);

        if (selectable == false && selected) 
        {
            throw new InvalidOperationException(/*SR.Get(SRID.CannotSelectNotSelectableItem)*/); 
        }

        SelectionChange.Begin();
        try 
        {
            ItemInfo info = NewItemInfo(item, UI); 

            if (selected)
            { 
                SelectionChange.Select(info, true /* assumeInItemsCollection */);
            }
            else
            { 
                SelectionChange.Unselect(info);
            } 
        } 
        finally
        { 
            SelectionChange.End();
        }
    }

    private void OnCurrentChanged(Object sender, EventArgs e)
    { 
        // 
        if (IsSynchronizedWithCurrentItemPrivate)
            SetSelectedToCurrent(); 
    }

    // when new containers arrive, schedule work for LayoutUpdated time.
    // (we might actually do it sooner - see OnGeneratorStatusChanged). 
    private void OnNewContainer()
    { 
        if (_cacheValid[(int)CacheBits.NewContainersArePending]) 
            return;

        _cacheValid[(int)CacheBits.NewContainersArePending] = true;
        this.LayoutUpdated += OnLayoutUpdated;
    }

    private void OnLayoutUpdated(Object sender, EventArgs e)
    { 
        AdjustNewContainers(); 
    }

    private void OnGeneratorStatusChanged(Object sender, EventArgs e)
    {
        if (ItemContainerGenerator.Status == GeneratorStatus.ContainersGenerated)
        { 
            AdjustNewContainers();
        } 
    } 

    private void AdjustNewContainers() 
    {
        // remove the LayoutUpdate handler, if we'd set one earlier
        if (_cacheValid[(int)CacheBits.NewContainersArePending])
        { 
            this.LayoutUpdated -= OnLayoutUpdated;
            _cacheValid[(int)CacheBits.NewContainersArePending] = false; 
        } 

        AdjustItemInfosAfterGeneratorChangeOverride(); 

        if (HasItems)
        {
            Debug.Assert(!((SelectedIndex >= 0) && (_selectedItems.Count == 0)), "SelectedIndex >= 0 implies _selectedItems nonempty"); 

            SelectionChange.Begin(); 
            try 
            {
                // Things could have been added to _selectedItems before the containers were generated, so now push 
                // the IsSelected state down onto those items.
                for (int i = 0; i < _selectedItems.Count; i++)
                {
                    // This could send messages back from the children, but we will ignore them b/c the selectionchange is active. 
                    ItemSetIsSelected(_selectedItems[i], true);
                } 

            }
            finally 
            {
                SelectionChange.Cancel();
            }
        } 
    }

    /*internal*/public /*virtual*/ void AdjustItemInfosAfterGeneratorChangeOverride() 
    {
        AdjustItemInfosAfterGeneratorChange(_selectedItems, claimUniqueContainer:true); 
    }

    private void SetSelectedToCurrent()
    { 
        Debug.Assert(IsSynchronizedWithCurrentItemPrivate);
        if (!_cacheValid[(int)CacheBits.SyncingSelectionAndCurrency]) 
        { 
            _cacheValid[(int)CacheBits.SyncingSelectionAndCurrency] = true;

            try
            {
                Object item = Items.CurrentItem;

                if (item != null && ItemGetIsSelectable(item))
                { 
                    SelectionChange.SelectJustThisItem(NewItemInfo(item, null, Items.CurrentPosition), true /* assumeInItemsCollection */); 
                }
                else 
                {
                    // Select nothing if Currency is not set.
                    SelectionChange.SelectJustThisItem(null, false);
                } 
            }
            finally 
            { 
                _cacheValid[(int)CacheBits.SyncingSelectionAndCurrency] = false;
            } 
        }
    }

    private void SetCurrentToSelected() 
    {
        Debug.Assert(IsSynchronizedWithCurrentItemPrivate); 
        if (!_cacheValid[(int)CacheBits.SyncingSelectionAndCurrency]) 
        {
            _cacheValid[(int)CacheBits.SyncingSelectionAndCurrency] = true; 

            try
            {
                if (_selectedItems.Count == 0) 
                {
                    // this avoid treating null as an item 
                    Items.MoveCurrentToPosition(-1); 
                }
                else 
                {
                    int index = _selectedItems[0].Index;
                    if (index >= 0)
                    { 
                        // use the index if we have it, to disambiguate duplicates
                        Items.MoveCurrentToPosition(index); 
                    } 
                    else
                    { 
                        Items.MoveCurrentTo(InternalSelectedItem);
                    }
                }
            } 
            finally
            { 
                _cacheValid[(int)CacheBits.SyncingSelectionAndCurrency] = false; 
            }
        } 
    }


    private void UpdateSelectedItems() 
    {
        // Update SelectedItems.  We don't want to invalidate the property 
        // because that defeats the ability of bindings to be able to listen 
        // for collection changes on that collection.  Instead we just want
        // to add all the items which are not already in the collection. 

        // Note: This is currently only called from SelectionChanger where SC.IsActive will be true.
        // If this is ever called from another location, ensure that SC.IsActive is true.
        Debug.Assert(SelectionChange.IsActive, "SelectionChange.IsActive should be true"); 

        SelectedItemCollection userSelectedItems = (SelectedItemCollection)SelectedItemsImpl; 
        if (userSelectedItems != null) 
        {
            InternalSelectedItemsStorage toAdd = new InternalSelectedItemsStorage(0, MatchExplicitEqualityComparer); 
            InternalSelectedItemsStorage toRemove = new InternalSelectedItemsStorage(userSelectedItems.Count, MatchExplicitEqualityComparer);
            toAdd.UsesItemHashCodes = _selectedItems.UsesItemHashCodes;
            toRemove.UsesItemHashCodes = _selectedItems.UsesItemHashCodes;

            // copy the current SelectedItems list into a fast table, attaching
            // the 1's-complement of the index to each item.  The sentinel 
            // container ensures that these are treated as separate items 
            for (int i=0; i < userSelectedItems.Count; ++i)
            { 
                toRemove.Add(userSelectedItems[i], ItemInfo.SentinelContainer, ~i);
            }

            // for each entry in _selectedItems, see if it's already in SelectedItems 
            /*using (*/toRemove.DeferRemove(); //)  //cym comment
            { 
                ItemInfo itemInfo = new ItemInfo(null, null, -1); 
                foreach (ItemInfo e in _selectedItems)
                { 
                    itemInfo.Reset(e.Item);
                    if (toRemove.Contains(itemInfo))
                    {
                        // already present - don't remove it 
                        toRemove.Remove(itemInfo);
                    } 
                    else 
                    {
                        // not present - mark it to be added 
                        toAdd.Add(e);
                    }
                }
            } 

            // Now make the changes, if any 
            if (toAdd.Count > 0 || toRemove.Count > 0) 
            {
                // if SelectedItems is in the midst of an app-initiated change, 
                // wait for the outer change to finish, then make the inner change.
                // Otherwise, do it now.
                if (userSelectedItems.IsChanging)
                { 
                    ChangeInfoField.SetValue(this, new ChangeInfo(toAdd, toRemove));
                } 
                else 
                {
                    UpdateSelectedItems(toAdd, toRemove); 
                }
            }
        }
    } 

    // called by SelectedItemsCollection after every change event 
    /*internal*/ void FinishSelectedItemsChange() 
    {
        // if we've deferred an inner change, do it now 
        ChangeInfo changeInfo = ChangeInfoField.GetValue(this);
        if (changeInfo != null)
        {
            // make sure the selection change is active 
            boolean inSelectionChange = SelectionChange.IsActive;

            if (!inSelectionChange) 
            {
                SelectionChange.Begin(); 
            }

            UpdateSelectedItems(changeInfo.ToAdd, changeInfo.ToRemove);

            if (!inSelectionChange)
            { 
                SelectionChange.End(); 
            }
        } 
    }

    private void UpdateSelectedItems(InternalSelectedItemsStorage toAdd, InternalSelectedItemsStorage toRemove)
    { 
        Debug.Assert(SelectionChange.IsActive, "SelectionChange.IsActive should be true");
        IList userSelectedItems = SelectedItemsImpl; 

        ChangeInfoField.ClearValue(this);

        // Do the adds first, to avoid a transient empty state
        for (int i=0; i<toAdd.Count; ++i)
        {
            userSelectedItems.Add(toAdd[i].Item); 
        }

        // Now do the removals in reverse order, so that the indices we saved are valid 
        for (int i=toRemove.Count-1; i>=0; --i)
        { 
            userSelectedItems.RemoveAt(~toRemove[i].Index);
        }
    }

    // called by SelectionChanger
    /*internal*/public void UpdatePublicSelectionProperties() 
    { 
        EffectiveValueEntry entry = GetValueEntry(
                    LookupEntry(SelectedIndexProperty.GlobalIndex), 
                    SelectedIndexProperty,
                    null,
                    RequestFlags.DeferredReferences);

        if (!entry.IsDeferredReference)
        { 
            // these are important checks to make before calling SetValue -- they 
            // ensure that we are not going to clobber a coerced value
            int selectedIndex = (int)entry.Value; 
            if ((selectedIndex > Items.Count - 1)
                || (selectedIndex == -1 && _selectedItems.Count > 0)
                || (selectedIndex > -1
                    && (_selectedItems.Count == 0 || selectedIndex != _selectedItems[0].Index))) 
            {
                // Use a DeferredSelectedIndexReference instead of calculating the new 
                // value now for better performance.  Most of the time no 
                // one cares what the new is, and calculating InternalSelectedIndex
                // be expensive because of the Items.IndexOf call 
                SetCurrentDeferredValue(SelectedIndexProperty, new DeferredSelectedIndexReference(this));
            }
        }

        if (SelectedItem != InternalSelectedItem)
        { 
            try 
            {
                // We know that InternalSelectedItem is a correct value for SelectedItemProperty and 
                // should skip the coerce callback because it is expensive to call IndexOf and Contains
                SkipCoerceSelectedItemCheck = true;
                SetCurrentValueInternal(SelectedItemProperty, InternalSelectedItem);
            } 
            finally
            { 
                SkipCoerceSelectedItemCheck = false; 
            }
        } 

        if (_selectedItems.Count > 0)
        {
            // an item has been selected, so turn off the delayed 
            // selection by SelectedValue (bug 452619)
            _cacheValid[(int)CacheBits.SelectedValueWaitsForItems] = false; 
        } 

        if (!_cacheValid[(int)CacheBits.SelectedValueDrivesSelection] && 
            !_cacheValid[(int)CacheBits.SelectedValueWaitsForItems])
        {
            Object desiredSelectedValue = InternalSelectedValue;
            if (desiredSelectedValue == DependencyProperty.UnsetValue) 
            {
                desiredSelectedValue = null; 
            } 

            if (!Object.Equals(SelectedValue, desiredSelectedValue)) 
            {
                SetCurrentValueInternal(SelectedValueProperty, desiredSelectedValue);
            }
        } 

        UpdateSelectedItems(); 
    } 

    /// <summary> 
    /// Raise the SelectionChanged event.
    /// </summary>
    private void InvokeSelectionChanged(List<ItemInfo> unselectedInfos, List<ItemInfo> selectedInfos)
    { 
        SelectionChangedEventArgs selectionChanged = new SelectionChangedEventArgs(unselectedInfos, selectedInfos);

        selectionChanged.Source=this; 

        OnSelectionChanged(selectionChanged); 
    }

    /// <summary>
    /// Returns true if FrameworkElement (container) representing the item 
    /// has Selector.IsSelectedProperty set to true.
    /// </summary> 
    /// <param name="container"></param> 
    /// <param name="item"></param>
    /// <returns></returns> 
    private boolean InfoGetIsSelected(ItemInfo info)
    {
        DependencyObject container = info.Container;
        if (container != null) 
        {
            return (boolean)container.GetValue(Selector.IsSelectedProperty); 
        } 

        // In the case where the elements added *are* the containers, read it off the item could work too 
        //
        if (IsItemItsOwnContainerOverride(info.Item))
        {
            DependencyObject element = info.Item as DependencyObject; 

            if (element != null) 
            { 
                return (boolean)element.GetValue(Selector.IsSelectedProperty);
            } 
        }

        return false;
    } 

    private void ItemSetIsSelected(ItemInfo info, boolean value) 
    { 
        if (info == null) return;

        DependencyObject container = info.Container;

        if (container != null)
        { 
            // First check that the value is different and then set it.
            if (GetIsSelected(container) != value) 
            { 
                container.SetCurrentValueInternal(Selector.IsSelectedProperty, value);
            } 
        }
        else
        {
            // In the case where the elements added *are* the containers, set it on the item instead of doing nothing 
            //
            Object item = info.Item; 
            if (IsItemItsOwnContainerOverride(item)) 
            {
                DependencyObject element = item as DependencyObject; 

                if (element != null)
                {
                    if (GetIsSelected(element) != value) 
                    {
                        element.SetCurrentValueInternal(Selector.IsSelectedProperty, value); 
                    } 
                }
            } 
        }
    }

    /// <summary> 
    /// Returns false if FrameworkElement representing this item has Selector.SelectableProperty set to false.  True otherwise.
    /// </summary> 
    /// <param name="item"></param> 
    /// <returns></returns>
    /*internal*/ static boolean ItemGetIsSelectable(Object item) 
    {
        if (item != null)
        {
            return !(item instanceof Separator); 
        }

        return false; 
    }

    /*internal*/ static boolean UiGetIsSelectable(DependencyObject o)
    {
        if (o != null)
        { 
            if (!ItemGetIsSelectable(o))
            { 
                return false; 
            }
            else 
            {
                // Check the data item
                ItemsControl itemsControl = ItemsControl.ItemsControlFromItemContainer(o);
                if (itemsControl != null) 
                {
                    Object data = itemsControl.ItemContainerGenerator.ItemFromContainer(o); 
                    if (data != o) 
                    {
                        return ItemGetIsSelectable(data); 
                    }
                    else
                    {
                        return true; 
                    }
                } 
            } 
        }

        return false;
    }

    private static void OnSelected(Object sender, RoutedEventArgs e) 
    {
        ((Selector)sender).NotifyIsSelectedChanged(e.OriginalSource as FrameworkElement, true, e); 
    } 

    private static void OnUnselected(Object sender, RoutedEventArgs e) 
    {
        ((Selector)sender).NotifyIsSelectedChanged(e.OriginalSource as FrameworkElement, false, e);
    }

    /// <summary>
    /// Called by handlers of Selected/Unselected or CheckedChanged events to indicate that the selection state 
    /// on the item has changed and selector needs to update accordingly. 
    /// </summary>
    /// <param name="container"></param> 
    /// <param name="selected"></param>
    /// <param name="e"></param>
    /// <returns></returns>
    /*internal*/public void NotifyIsSelectedChanged(FrameworkElement container, boolean selected, RoutedEventArgs e) 
    {
        // The selectionchanged event will fire at the end of the selection change. 
        // We are here because this change was requested within the SelectionChange. 
        // If there isn't a selection change going on now, we should do a SelectionChange.
        if (SelectionChange.IsActive || container == _clearingContainer) 
        {
            // We cause this property to change, so mark it as handled
            e.Handled = true;
        } 
        else
        { 
            if (container != null) 
            {
                Object item = GetItemOrContainerFromContainer(container); 
                if (item != DependencyProperty.UnsetValue)
                {
                    SetSelectedHelper(item, container, selected);
                    e.Handled = true; 
                }
            } 
        } 
    }

    /// <summary>
    /// Allows batch processing of selection changes so that only one SelectionChanged event is fired and
    /// SelectedIndex is changed only once (if necessary).
    /// </summary> 
    /*internal*/public SelectionChanger SelectionChange
    { 
        get 
        {
            if (_selectionChangeInstance == null) 
            {
                _selectionChangeInstance = new SelectionChanger(this);
            }

            return _selectionChangeInstance;
        } 
    } 

    // use the first item to decide whether items support hashing correctly. 
    // Reset the algorithm used by _selectedItems accordingly.
    void ResetSelectedItemsAlgorithm()
    {
        if (!Items.IsEmpty) 
        {
            _selectedItems.UsesItemHashCodes = Items.CollectionView.HasReliableHashCodes(); 
        } 
    }

    // Locate the selected items - i.e. assign an index to each ItemInfo in _selectedItems.
    // (This is called after a Reset event from the Items collection.)
    // If the caller provides a list, fill it with ranges describing the selection;
    // each range has the form <offset, length>. 
    // Optionally remove from _selectedItems any entry for which no index can be found
    /*internal*/ void LocateSelectedItems(List<Tuple<Integer,Integer>> ranges /*= null*/, boolean deselectMissingItems/*=false*/) 
    { 
        List<Integer> knownIndices = new List<Integer>(_selectedItems.Count);
        int unknownCount = 0; 
        int knownCount;

        // Step 1.  Find the known indices.
        for/*each*/ (ItemInfo info : _selectedItems) 
        {
            if (info.Index < 0) 
            { 
                ++ unknownCount;
            } 
            else
            {
                knownIndices.Add(info.Index);
            } 
        }

        // sort the list, and remember its size.   We'll be adding more to the 
        // list, but we only need to search up to its current size.
        knownCount = knownIndices.Count; 
        knownIndices.Sort();

        // Step 2. Walk through the Items collection, to fill in the unknown indices.
        ItemInfo key = new ItemInfo(null, ItemInfo.KeyContainer, -1); 
        for (int i=0; unknownCount > 0 && i<Items.Count; ++i)
        { 
            // skip items whose index is already known 
            if (knownIndices.BinarySearch(0, knownCount, i, null) >= 0)
            { 
                continue;
            }

            // see if the current item appears in _selectedItems 
            key.Reset(Items[i]);
            key.Index = i; 
            ItemInfo info = _selectedItems.FindMatch(key); 

            if (info != null) 
            {
                // record the match
                info.Index = i;
                knownIndices.Add(i); 
                --unknownCount;
            } 
        } 

        // Step 3. Report the selection as a list of ranges 
        if (ranges != null)
        {
            ranges.Clear();
            knownIndices.Sort(); 
            knownIndices.Add(-1);   // sentinel, to emit the last range
            int startRange = -1, endRange = -2; 

            for/*each*/ (int index : knownIndices)
            { 
                if (index == endRange + 1)
                {
                    // extend the current range
                    endRange = index; 
                }
                else 
                { 
                    // emit the current range
                    if (startRange >= 0) 
                    {
                        ranges.Add(new Tuple<int, int>(startRange, endRange-startRange+1));
                    }

                    // start a new range
                    startRange = endRange = index; 
                } 
            }
        } 

        // Step 4.  Remove missing items from _selectedItems
        if (deselectMissingItems)
        { 
            // Note: This is currently only called from SelectionChanger where SC.IsActive will be true.
            // If this is ever called from another location, ensure that SC.IsActive is true. 
            Debug.Assert(SelectionChange.IsActive, "SelectionChange.IsActive should be true"); 

            for/*each*/ (ItemInfo info : _selectedItems) 
            {
                if (info.Index < 0)
                {
                    SelectionChange.Unselect(info); 
                }
            } 
        } 
    }

//    #region Private Properties

//

/*
    // Journaling the selection state is more complex than just a property. 
    // For one thing, the selection properties may never be referenced, and 
    // thus they might not have a value in the local store.  Second, one
    // property might not be sufficient (say, SelectedIndex) and another might 
    // fail serialization (i.e. SelectedItems).  With a DP that has a
    // ReadLocalValueOverride, it will be enumerated by the LocalValueEnumerator
    // and the value can have custom serialization logic.

    private static final DependencyProperty PrivateJournaledSelectionProperty =
        DependencyProperty.Register("PrivateJournaledSelection", typeof(Object), typeof(Selector), 
                                    PrivateJournaledSelectionPropertyMetadata); 

    private static FrameworkPropertyMetadata PrivateJournaledSelectionPropertyMetadata 
    {
        get
        {
            FrameworkPropertyMetadata fpm = new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.Journal); 

            fpm.ReadLocalValueOverride = new ReadLocalValueOverride(ReadPrivateJournaledSelection); 
            fpm.WriteLocalValueOverride = new WriteLocalValueOverride(WritePrivateJournaledSelection); 

            return fpm; 
        }
    }

    private static Object ReadPrivateJournaledSelection(DependencyObject d) 
    {
        // For now, just do what we were doing before -- journal SelectedIndex 
        return ((Selector)d).InternalSelectedIndex; 
    }

    private static void WritePrivateJournaledSelection(DependencyObject d, Object value)
    {
        Selector s = (Selector)d;
        // Issue: This could throw an exception if things aren't set up in time. 
        s.SelectedIndex = (int)value;
    } 
*/ 
//    #endregion

    //-------------------------------------------------------------------
    //
    //  Data
    // 
    //-------------------------------------------------------------------

//    #region Private Members 

    // The selected items that we interact with.  Most of the time when SelectedItems 
    // is in use, this is identical to the value of the SelectedItems property, but
    // differs in type, and will differ in content in the case where you set or modify
    // SelectedItems and we need to switch our selection to what was just provided.
    // This is our /*internal*/ representation of the selection and generally should be modified 
    // only by SelectionChanger.  Internal classes may read this for efficiency's sake
    // to avoid putting SelectedItems "in use" but we can't really expose this externally. 
    /*internal*/ InternalSelectedItemsStorage _selectedItems = new InternalSelectedItemsStorage(1, MatchExplicitEqualityComparer); 

    // Gets the selected item but doesn't use SelectedItem (avoids putting it "in use") 
    /*internal*/ Object InternalSelectedItem
    {
        get
        { 
            return (_selectedItems.Count == 0) ? null : _selectedItems[0].Item;
        } 
    } 

    /*internal*/public ItemInfo InternalSelectedInfo 
    {
        get { return (_selectedItems.Count == 0) ? null : _selectedItems[0]; }
    }

    /// <summary>
    /// Index of the first item in SelectedItems or (-1) if SelectedItems is empty. 
    /// </summary> 
    /// <value></value>
    /*internal*/public int InternalSelectedIndex 
    {
        get
        {
            if (_selectedItems.Count == 0) 
                return -1;

            int index = _selectedItems[0].Index; 
            if (index < 0)
            { 
                index = Items.IndexOf(_selectedItems[0].Item);
                _selectedItems[0].Index = index;
            }

            return index;
        } 
    } 

    private Object InternalSelectedValue 
    {
        get
        {
            Object item = InternalSelectedItem; 
            Object selectedValue;

            if (item != null) 
            {
                BindingExpression bindingExpr = PrepareItemValueBinding(item); 

                if (String.IsNullOrEmpty(SelectedValuePath))
                {
                    // when there's no SelectedValuePath, the binding's Path 
                    // is either empty (CLR) or "/InnerText" (XML)
                    String path = bindingExpr.ParentBinding.Path.Path; 
//                    Debug.Assert(String.IsNullOrEmpty(path) || path == "/InnerText"); 

                    if (String.IsNullOrEmpty(path)) 
                    {
                        selectedValue = item;   // CLR - the item is its own selected value
                    }
                    else 
                    {
                        selectedValue = SystemXmlHelper.GetInnerText(item); // XML - use the InnerText as the selected value 
                    } 
                }
                else 
                {
                    // apply the SelectedValuePath to the item
                    bindingExpr.Activate(item);
                    selectedValue = bindingExpr.Value; 
                    bindingExpr.Deactivate();
                } 
            } 
            else
            { 
                // no selected item - use UnsetValue (to distinguish from null, a legitimate value for the SVP)
                selectedValue = DependencyProperty.UnsetValue;
            }

            return selectedValue;
        } 
    } 

    // Used by ListBox and ComboBox to determine if the mouse actually entered the 
    // List/ComboBoxItem before it focus which calls BringIntoView
    private Point _lastMousePosition = new Point();

    // see comment on SelectionChange property 
    private SelectionChanger _selectionChangeInstance;

    // Condense boolean bits.  Constructor takes the default value, and will resize to access up to 32 bits. 
    private BitVector32 _cacheValid = new BitVector32((int)CacheBits.CanSelectMultiple);

//    [Flags]
    /*private*/ enum CacheBits
    {
        // This flag is true while syncing the selection and the currency.  It 
        // is used to avoid reentrancy:  e.g. when the currency changes we want
        // to change the selection accordingly, but that selection change should 
        // not try to change currency. 
        SyncingSelectionAndCurrency    ,//= 0x00000001,
        CanSelectMultiple              ,//= 0x00000002, 
        IsSynchronizedWithCurrentItem  ,//= 0x00000004,
        SkipCoerceSelectedItemCheck    ,//= 0x00000008,
        SelectedValueDrivesSelection   ,//= 0x00000010,
        SelectedValueWaitsForItems     ,//= 0x00000020, 
        NewContainersArePending        ,//= 0x00000040,
    } 

    private EventHandler _focusEnterMainFocusScopeEventHandler;

    // the container that is being cleared.   It doesn't require much action.
    private DependencyObject _clearingContainer;

//    #endregion 
//
//    #region Helper Classes 
//
//    #region SelectionChanger

    /// <summary>
    /// Helper class for selection change batching.
    /// </summary>
    /*internal*/ class SelectionChanger 
    {
        /// <summary> 
        /// Create a new SelectionChangeHelper -- there should only be one instance per Selector. 
        /// </summary>
        /// <param name="s"></param> 
        /*internal*/ SelectionChanger(Selector s)
        {
            _owner = s;
            _active = false; 
            _toSelect = new InternalSelectedItemsStorage(1, MatchUnresolvedEqualityComparer);
            _toUnselect = new InternalSelectedItemsStorage(1, MatchUnresolvedEqualityComparer); 
            _toDeferSelect = new InternalSelectedItemsStorage(1, MatchUnresolvedEqualityComparer); 
        }

        /// <summary>
        /// True if there is a SelectionChange currently in progress.
        /// </summary>
        /*internal*/ boolean IsActive 
        {
            get { return _active; } 
        } 

        /// <summary> 
        /// Begin tracking selection changes.
        /// </summary>
        /*internal*/ void Begin()
        { 
//            Debug.Assert(_owner.CheckAccess());
//            Debug.Assert(!_active, SR.Get(SRID.SelectionChangeActive)); 

            _active = true;
            _toSelect.Clear(); 
            _toUnselect.Clear();
        }

        /// <summary> 
        /// Commit selection changes.
        /// </summary> 
        /*internal*/ void End() 
        {
//            Debug.Assert(_owner.CheckAccess()); 
//            Debug.Assert(_active, "There must be a selection change active when you call SelectionChange.End()");

            List<ItemInfo> unselected = new List<ItemInfo>();
            List<ItemInfo> selected = new List<ItemInfo>(); 

            // We might have been asked to make changes that will put us in an invalid state.  Correct for this. 
            try 
            {
                ApplyCanSelectMultiple(); 

                CreateDeltaSelectionChange(unselected, selected);

                _owner.UpdatePublicSelectionProperties(); 
            }
            finally 
            { 
                // End the selection change -- IsActive will be false after this
                Cleanup(); 
            }

            // only raise the event if there were actually any changes applied
            if (unselected.Count > 0 || selected.Count > 0) 
            {
                // see bug 1459509: update Current AFTER selection change and before raising event 
                if (_owner.IsSynchronizedWithCurrentItemPrivate) 
                    _owner.SetCurrentToSelected();
                _owner.InvokeSelectionChanged(unselected, selected); 
            }
        }

        private void ApplyCanSelectMultiple() 
        {
            if (!_owner.CanSelectMultiple) 
            { 
//                Debug.Assert(_toSelect.Count <= 1, "_toSelect.Count was > 1");

                if (_toSelect.Count == 1) // this is all that should be selected, unselect _selectedItems
                {
                    _toUnselect = new InternalSelectedItemsStorage(_owner._selectedItems, null);
                } 
                else // _toSelect.Count == 0, and unselect all but one of _selectedItems
                { 
                    // This is when CanSelectMultiple changes from true to false. 
                    if (_owner._selectedItems.Count > 1 && _owner._selectedItems.Count != _toUnselect.Count + 1)
                    { 
                        // they didn't deselect enough; force deselection
                        ItemInfo selectedItem = _owner._selectedItems[0];

                        _toUnselect.Clear(); 
                        for/*each*/ (ItemInfo info : _owner._selectedItems)
                        { 
                            if (info != selectedItem) 
                            {
                                _toUnselect.Add(info); 
                            }
                        }
                    }
                } 
            }
        } 

        private void CreateDeltaSelectionChange(List<ItemInfo> unselectedItems, List<ItemInfo> selectedItems)
        { 
            for (int i = 0; i < _toDeferSelect.Count; i++)
            {
                ItemInfo info = _toDeferSelect[i];
                // If defered selected item exists in Items - move it to _toSelect 
                if (_owner.Items.Contains(info.Item))
                { 
                    _toSelect.Add(info); 
                    _toDeferSelect.Remove(info);
                    i--; 
                }
            }

            if (_toUnselect.Count > 0 || _toSelect.Count > 0) 
            {
                // Step 1:  process the items to be unselected 
                // 1a:  handle the resolved items first. 
                /*using (*/_owner._selectedItems.DeferRemove(); //)  //cym comment
                { 
                    if (_toUnselect.ResolvedCount > 0)
                    {
                        for/*each*/ (ItemInfo info : _toUnselect)
                        { 
                            if (info.IsResolved)
                            { 
                                _owner.ItemSetIsSelected(info, false); 
                                if (_owner._selectedItems.Remove(info))
                                { 
                                    unselectedItems.Add(info);
                                }
                            }
                        } 
                    }

                    // 1b: handle unresolved items second, so they don't steal items 
                    // from _selectedItems that belong to resolved items
                    if (_toUnselect.UnresolvedCount > 0) 
                    {
                        for/*each*/ (ItemInfo info : _toUnselect)
                        {
                            if (!info.IsResolved) 
                            {
                                ItemInfo match = _owner._selectedItems.FindMatch(ItemInfo.Key(info)); 
                                if (match != null) 
                                {
                                    _owner.ItemSetIsSelected(match, false); 
                                    _owner._selectedItems.Remove(match);
                                    unselectedItems.Add(match);
                                }
                            } 
                        }
                    } 
                } 

                // Step 2:  process items to be selected 
                /*using (*/_toSelect.DeferRemove(); //)
                {
                    // 2a: handle the resolved items first
                    if (_toSelect.ResolvedCount > 0) 
                    {
                        List<ItemInfo> toRemove = (_toSelect.UnresolvedCount > 0) 
                            ? new List<ItemInfo>() : null; 

                        for/*each*/ (ItemInfo info : _toSelect) 
                        {
                            if (info.IsResolved)
                            {
                                _owner.ItemSetIsSelected(info, true); 
                                if (!_owner._selectedItems.Contains(info))
                                { 
                                    _owner._selectedItems.Add(info); 
                                    selectedItems.Add(info);
                                } 

                                if (toRemove != null)
                                    toRemove.Add(info);
                            } 
                        }

                        // remove the resolved items from _toSelect, so that 
                        // it contains only unresolved items for step 2b
                        if (toRemove != null) 
                        {
                            for/*each*/ (ItemInfo info : toRemove)
                            {
                                _toSelect.Remove(info); 
                            }
                        } 
                    } 

                    // 2b: handle unresolved items second, so they select different 
                    // items than the ones belonging to resolved items
                    if (_toSelect.UnresolvedCount > 0)
                    {
                        // At this point, _toSelect contains only unresolved items, 
                        // each of which should be resolved to an item that is not
                        // already selected.  We do this by iterating through each 
                        // item (from Items);  any item that matches something in 
                        // _toSelect and is not already selected becomes selected.
                        for (int index = 0; index < _owner.Items.Count; ++index) 
                        {
                            ItemInfo info = _owner.NewItemInfo(_owner.Items[index], null, index);
                            ItemInfo key = new ItemInfo(info.Item, ItemInfo.KeyContainer, -1);
                            if (_toSelect.Contains(key) && !_owner._selectedItems.Contains(info)) 
                            {
                                _owner.ItemSetIsSelected(info, true); 
                                _owner._selectedItems.Add(info); 
                                selectedItems.Add(info);
                                _toSelect.Remove(key); 
                            }
                        }

                        // after the loop, _toSelect may still contain leftover items. 
                        // These are just abandoned;  they correspond to attempts to select
                        // (say) 5 instances of some item when Items only contains 3. 
                    } 
                }
            } 
        }

//#if never
        private void SynchronizeSelectedIndexToSelectedItem() 
        {
            if (_owner._selectedItems.Count == 0) 
            { 
                _owner.SelectedIndex = -1;
            } 
            else
            {
                Object selectedItem = _owner.SelectedItem;
                Object firstSelection = _owner._selectedItems[0]; 

                // This check is only just to slightly improve perf by checking if it's in selected items before doing a reverse lookup 
                if (selectedItem == null || firstSelection != selectedItem) 
                {
                    _owner.SelectedIndex = _owner.Items.IndexOf(firstSelection); 
                }
            }
        }
//#endif 

        /// <summary> 
        /// Queue something to be added to the selection.  Does nothing if the item is already selected. 
        /// </summary>
        /// <param name="o"></param> 
        /// <param name="assumeInItemsCollection"></param>
        /// <returns>true if the Selection was queued</returns>
        /*internal*/public boolean Select(ItemInfo info, boolean assumeInItemsCollection)
        { 
//            Debug.Assert(_owner.CheckAccess());
//            Debug.Assert(_active, SR.Get(SRID.SelectionChangeNotActive)); 
//            Debug.Assert(info != null, "parameter info should not be null"); 

            // Disallow selecting !IsSelectable things 
            if (!ItemGetIsSelectable(info)) return false;

            // Disallow selecting things not in Items.FlatView
            if (!assumeInItemsCollection) 
            {
                if (!_owner.Items.Contains(info.Item)) 
                { 
                    // If user selected item is not in the Items yet - defer the selection
                    if (!_toDeferSelect.Contains(info)) 
                        _toDeferSelect.Add(info);
                    return false;
                }
            } 

            ItemInfo key = ItemInfo.Key(info); 

            // To support Unselect(o) / Select(o) where o is already selected.
            if (_toUnselect.Remove(key)) 
            {
                return true;
            }

            // Ignore if the item is already selected
            if (_owner._selectedItems.Contains(info)) return false; 

            // Ignore if the item has already been requested to be selected.
            if (!key.IsKey && _toSelect.Contains(key)) return false; 

            // enforce that we only select one thing in the CanSelectMultiple=false case.
            if (!_owner.CanSelectMultiple && _toSelect.Count > 0)
            { 
                // If it was the item telling us this, turn around and set IsSelected = false
                // This will basically only happen in a Refresh situation where multiple items in the collection were selected but 
                // CanSelectMultiple = false. 
                for/*each*/ (ItemInfo item : _toSelect)
                { 
                    _owner.ItemSetIsSelected(item, false);
                }
                _toSelect.Clear();
            } 

            _toSelect.Add(info); 
            return true; 
        }

        /// <summary>
        /// Queue something to be removed from the selection.  Does nothing if the item is not already selected.
        /// </summary>
        /// <param name="o"></param> 
        /// <returns>true if the item was queued for unselection.</returns>
        /*internal*/public boolean Unselect(ItemInfo info) 
        { 
//            Debug.Assert(_owner.CheckAccess());
//            Debug.Assert(_active, SR.Get(SRID.SelectionChangeNotActive)); 
//            Debug.Assert(info != null, "info should not be null");

            ItemInfo key = ItemInfo.Key(info);

            _toDeferSelect.Remove(info);

            // To support Select(o) / Unselect(o) where o is not already selected. 
            if (_toSelect.Remove(key))
            { 
                return true;
            }

            // Ignore if the item is not already selected 
            if (!_owner._selectedItems.Contains(key)) return false;

            // Ignore if the item has already been queued for unselection. 
            if (_toUnselect.Contains(info)) return false;

            _toUnselect.Add(info);
            return true;
        }

        /// <summary>
        /// Makes sure that the current selection is valid; Performs a SelectionChange it if it's not. 
        /// </summary> 
        /*internal*/public void Validate()
        { 
            Begin();
            End();
        }

        /// <summary>
        /// Cancels the currently active SelectionChange. 
        /// </summary> 
        /*internal*/public void Cancel()
        { 
//            Debug.Assert(_owner.CheckAccess());

            Cleanup(); 
        }

        /*internal*/public void CleanupDeferSelection() 
        {
            if (_toDeferSelect.Count > 0) 
            {
                _toDeferSelect.Clear();
            }
        } 

        /*internal*/public void Cleanup() 
        { 
            _active = false;
            if (_toSelect.Count > 0) 
            {
                _toSelect.Clear();
            }
            if (_toUnselect.Count > 0) 
            {
                _toUnselect.Clear(); 
            } 
        }

        /// <summary>
        /// Select just this item; all other items in SelectedItems will be removed.
        /// </summary>
        /// <param name="item"></param> 
        /// <param name="assumeInItemsCollection"></param>
        /*internal*/public void SelectJustThisItem(ItemInfo info, boolean assumeInItemsCollection) 
        { 
            Begin();
            CleanupDeferSelection(); 

            try
            {
                // was this item already in the selection? 
                boolean isSelected = false;

                // go backwards in case a selection is rejected; then they'll still have the same SelectedItem 
                for (int i = _owner._selectedItems.Count - 1; i >= 0; i--)
                { 
                    if (info != _owner._selectedItems[i])
                    {
                        Unselect(_owner._selectedItems[i]);
                    } 
                    else
                    { 
                        isSelected = true; 
                    }
                } 

                if (!isSelected && info != null && info.Item != DependencyProperty.UnsetValue)
                {
                    Select(info, assumeInItemsCollection); 
                }
            } 
            finally 
            {
                End(); 
            }
        }

        private Selector _owner; 
        private InternalSelectedItemsStorage _toSelect;
        private InternalSelectedItemsStorage _toUnselect; 
        private InternalSelectedItemsStorage _toDeferSelect; // Keep the items that cannot be selected because they are not in _owner.Items 
        private boolean _active;
    } 

//    #endregion

//    #region InternalSelectedItemsStorage 

    /*internal*/ class InternalSelectedItemsStorage implements IEnumerable<ItemInfo> 
    { 

        /*internal*/ InternalSelectedItemsStorage(int capacity, IEqualityComparer<ItemInfo> equalityComparer) 
        {
            _equalityComparer = equalityComparer;
            _list = new List<ItemInfo>(capacity);
            _set = new Dictionary<ItemInfo, ItemInfo>(capacity, equalityComparer); 
        }

        /*internal*/public InternalSelectedItemsStorage(InternalSelectedItemsStorage collection, IEqualityComparer<ItemInfo> equalityComparer/*=null*/) 
        {
            _equalityComparer = equalityComparer ?? collection._equalityComparer; 

            _list = new List<ItemInfo>(collection._list);

            if (collection.UsesItemHashCodes) 
            {
                _set = new Dictionary<ItemInfo, ItemInfo>(collection._set, _equalityComparer); 
            } 

            _resolvedCount = collection._resolvedCount; 
            _unresolvedCount = collection._unresolvedCount;
        }

        public void Add(Object item, DependencyObject container, int index) 
        {
            Add(new ItemInfo(item, container, index)); 
        } 

        public void Add(ItemInfo info) 
        {
            if (_set != null)
            {
                _set.Add(info, info); 
            }
            _list.Add(info); 

            if (info.IsResolved)    ++_resolvedCount;
            else                    ++_unresolvedCount; 
        }

        public boolean Remove(ItemInfo e)
        { 
            boolean removed = false;
            if (_set != null) 
            { 
                ItemInfo realInfo;
                if (_set.TryGetValue(e, /*out*/ realInfo)) 
                {
                    removed = true;
                    _set.Remove(e);     // remove from hash table

                    if (RemoveIsDeferred)
                    { 
                        // mark as removed - the real removal comes later 
                        realInfo.Container = ItemInfo.RemovedContainer;
                        ++ _batchRemove.RemovedCount; 
                    }
                    else
                    {
                        RemoveFromList(e); 
                    }
                } 
            } 
            else
            { 
                removed = RemoveFromList(e);
            }

            if (removed) 
            {
                if (e.IsResolved)   --_resolvedCount; 
                else                --_unresolvedCount; 
            }

            return removed;
        }

        private boolean RemoveFromList(ItemInfo e) 
        {
            boolean removed = false; 
            int index = LastIndexInList(e); // removals tend to happen from the end of the list 
            if (index >= 0)
            { 
                _list.RemoveAt(index);
                removed = true;
            }
            return removed; 
        }

        public boolean Contains(ItemInfo e) 
        {
            if (_set != null) 
            {
                return _set.ContainsKey(e);
            }
            else 
            {
                return (IndexInList(e) >= 0); 
            } 
        }

        public ItemInfo this[int index]
        {
            get
            { 
                return _list[index];
            } 
        } 

        public void Clear() 
        {
            _list.Clear();
            if (_set != null)
            { 
                _set.Clear();
            } 

            _resolvedCount = _unresolvedCount = 0;
        } 

        public int Count
        {
            get 
            {
                return _list.Count; 
            } 
        }

        public boolean RemoveIsDeferred { get { return _batchRemove != null && _batchRemove.IsActive; } }

        // using (storage.DeferRemove()) {...} defers the actual removal
        // of entries from _list until leaving the scope.   At that point, 
        // the removal can be done more efficiently.
        public IDisposable DeferRemove() 
        { 
            if (_batchRemove == null)
            { 
                _batchRemove = new BatchRemoveHelper(this);
            }

            _batchRemove.Enter(); 
            return _batchRemove;
        } 

        // do the actual removal of entries marked as Removed
        private void DoBatchRemove() 
        {
            int j=0, n=_list.Count;

            // copy the surviving entries to the front of the list 
            for (int i=0; i<n; ++i)
            { 
                ItemInfo info = _list[i]; 
                if (!info.IsRemoved)
                { 
                    if (j < i)
                    {
                        _list[j] = _list[i];
                    } 
                    ++j;
                } 
            } 

            // remove the remaining unneeded entries 
            _list.RemoveRange(j, n-j);
        }

        public int ResolvedCount { get { return _resolvedCount; } } 
        public int UnresolvedCount { get { return _unresolvedCount; } }

        public IEnumerator<ItemInfo> /*IEnumerable<ItemInfo>.*/GetEnumerator() 
        {
            return _list.GetEnumerator(); 
        }

//        IEnumerator IEnumerable.GetEnumerator()
//        { 
//            return _list.GetEnumerator();
//        } 

        // If the underlying items don't implement GetHashCode according to
        // guidelines (i.e. if an item's hashcode can change during the item's 
        // lifetime) we can't use any hash-based data structures like Dictionary,
        // Hashtable, etc.  The principal offender is DataRowView.  (bug 1583080)
        public boolean UsesItemHashCodes
        { 
            get { return _set != null; }
            set 
            { 
                if (value == true && _set == null)
                { 
                    _set = new Dictionary<ItemInfo, ItemInfo>(_list.Count);
                    for (int i=0; i<_list.Count; ++i)
                    {
                        _set.Add(_list[i], _list[i]); 
                    }
                } 
                else if (value == false) 
                {
                    _set = null; 
                }
            }
        }

        public ItemInfo FindMatch(ItemInfo info)
        { 
            ItemInfo result; 

            if (_set != null) 
            {
                if (!_set.TryGetValue(info, /*out*/ result))
                {
                    result = null; 
                }
            } 
            else 
            {
                int index = IndexInList(info); 
                result = (index < 0) ? null : _list[index];
            }

            return result; 
        }

        // like IndexOf, but uses the equality comparer 
        private int IndexInList(ItemInfo info)
        { 
            return _list.FindIndex( /*cym comment (ItemInfo x) => { return _equalityComparer.Equals(info, x); }*/ );
        }

        // like LastIndexOf, but uses the equality comparer 
        private int LastIndexInList(ItemInfo info)
        { 
            return _list.FindLastIndex( /*cym comment  (ItemInfo x) => { return _equalityComparer.Equals(info, x); }*/ ); 
        }

        private List<ItemInfo> _list;
        private Dictionary<ItemInfo, ItemInfo> _set;
        private IEqualityComparer<ItemInfo> _equalityComparer;
        private int _resolvedCount, _unresolvedCount; 
        private BatchRemoveHelper _batchRemove;

        private class BatchRemoveHelper implements IDisposable 
        {
            public BatchRemoveHelper(InternalSelectedItemsStorage owner) 
            {
                _owner = owner;
            }

            public boolean IsActive ;//{ get { return _level > 0; } }
            public int RemovedCount;// { get; set; } 

            public void Enter()
            { 
                ++ _level;
            }

            public void Leave() 
            {
                if (_level > 0) 
                { 
                    if (--_level == 0 && RemovedCount > 0)
                    { 
                        _owner.DoBatchRemove();
                        RemovedCount = 0;
                    }
                } 
            }

            public void Dispose() 
            {
                Leave(); 
            }

            InternalSelectedItemsStorage _owner;
            int _level; 
        }
    } 

//    #endregion InternalSelectedItemsStorage
//
//    #region Equality Comparers

    private class ItemInfoEqualityComparer implements IEqualityComparer<ItemInfo>
    { 
        public ItemInfoEqualityComparer(boolean matchUnresolved)
        { 
            _matchUnresolved = matchUnresolved; 
        }

        public boolean /*IEqualityComparer<ItemInfo>.*/Equals(ItemInfo x, ItemInfo y)
        {
            if (Object.ReferenceEquals(x, y))
                return true; 
            return (x == null) ? (y == null) : x.Equals(y, _matchUnresolved);
        } 

        public int /*IEqualityComparer<ItemInfo>.*/GetHashCode(ItemInfo x)
        { 
            return x.GetHashCode();
        }

        boolean _matchUnresolved; 
    }

    private static final ItemInfoEqualityComparer MatchExplicitEqualityComparer = new ItemInfoEqualityComparer(false); 
    private static final ItemInfoEqualityComparer MatchUnresolvedEqualityComparer = new ItemInfoEqualityComparer(true);

//    #endregion Equality Comparers
//
//    #region ChangeInfo

    private class ChangeInfo
    { 
        public ChangeInfo(InternalSelectedItemsStorage toAdd, InternalSelectedItemsStorage toRemove) 
        {
            ToAdd = toAdd; 
            ToRemove = toRemove;
        }

        public InternalSelectedItemsStorage ToAdd ;//{ get; private set; } 
        public InternalSelectedItemsStorage ToRemove; // { get; private set; }
    } 

    private static final UncommonField<ChangeInfo> ChangeInfoField = new UncommonField<ChangeInfo>();

//    #endregion ChangeInfo
//
//    #endregion
//
//    #endregion

}