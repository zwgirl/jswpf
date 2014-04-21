/**
 */
package org.summer.view.widget.controls;

import java.beans.EventHandler;

import org.summer.view.widget.ContentElement;
import org.summer.view.widget.ContentOperations;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.DependencyPropertyKey;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.FrameworkContentElement;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.IInputElement;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.PropertyChangedCallback;
import org.summer.view.widget.PropertyPath;
import org.summer.view.widget.RoutedEvent;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.collection.NotifyCollectionChangedAction;
import org.summer.view.widget.collection.NotifyCollectionChangedEventArgs;
import org.summer.view.widget.controls.primitives.Selector;
import org.summer.view.widget.data.Binding;
import org.summer.view.widget.data.BindingExpression;
import org.summer.view.widget.input.FocusManager;
import org.summer.view.widget.input.FocusNavigationDirection;
import org.summer.view.widget.input.Key;
import org.summer.view.widget.input.KeyEventArgs;
import org.summer.view.widget.input.Keyboard;
import org.summer.view.widget.input.KeyboardNavigationMode;
import org.summer.view.widget.input.ModifierKeys;
import org.summer.view.widget.input.TraversalRequest;
import org.summer.view.widget.internal.SystemXmlHelper;
import org.summer.view.widget.media.Visual;
import org.summer.view.widget.media.VisualTreeHelper;
import org.summer.view.window.DoubleUtil;
import org.summer.view.window.automation.peer.AutomationEvents;
import org.summer.view.window.automation.peer.AutomationPeer;


/// <summary> 
    ///     A control that presents items in a tree structure. 
    /// </summary>
//    [StyleTypedProperty(Property = "ItemContainerStyle", StyleTargetType = typeof(TreeViewItem))] 
    public class TreeView extends ItemsControl
    {
//        #region Constructors
 
        static //TreeView()
        { 
            DefaultStyleKeyProperty.OverrideMetadata(typeof(TreeView), new FrameworkPropertyMetadata(typeof(TreeView))); 
            VirtualizingPanel.IsVirtualizingProperty.OverrideMetadata(typeof(TreeView), new FrameworkPropertyMetadata(BooleanBoxes.FalseBox));
            _dType = DependencyObjectType.FromSystemTypeInternal(typeof(TreeView)); 

            KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(typeof(TreeView), new FrameworkPropertyMetadata(KeyboardNavigationMode.Contained));
            KeyboardNavigation.TabNavigationProperty.OverrideMetadata(typeof(TreeView), new FrameworkPropertyMetadata(KeyboardNavigationMode.None));
            VirtualizingStackPanel.ScrollUnitProperty.OverrideMetadata(typeof(TreeView), new FrameworkPropertyMetadata(ScrollUnit.Pixel)); 
        }
 
        /// <summary> 
        ///     Creates an instance of this control.
        /// </summary> 
        public TreeView()
        {
            _focusEnterMainFocusScopeEventHandler = new EventHandler(OnFocusEnterMainFocusScope);
            KeyboardNavigation.Current.FocusEnterMainFocusScope += _focusEnterMainFocusScopeEventHandler; 
        }
 
//        #endregion 

//        #region Public Properties 

        private static final DependencyPropertyKey SelectedItemPropertyKey =
            DependencyProperty.RegisterReadOnly("SelectedItem", typeof(Object), typeof(TreeView), new FrameworkPropertyMetadata((Object)null));
 
        /// <summary>
        ///     The DependencyProperty for the <see cref="SelectedItem"/> property. 
        ///     Default Value: null 
        /// </summary>
        public static final DependencyProperty SelectedItemProperty = SelectedItemPropertyKey.DependencyProperty; 

        /// <summary>
        ///     Specifies the selected item.
        /// </summary> 
//        [Bindable(true), Category("Appearance"), ReadOnly(true), DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Object SelectedItem 
        { 
            get
            { 
                return GetValue(SelectedItemProperty);
            }
        }
 
        private void SetSelectedItem(Object data)
        { 
            if (SelectedItem != data) 
            {
                SetValue(SelectedItemPropertyKey, data); 
            }
        }

        private static final DependencyPropertyKey SelectedValuePropertyKey = 
            DependencyProperty.RegisterReadOnly("SelectedValue", typeof(Object), typeof(TreeView), new FrameworkPropertyMetadata((Object)null));
 
        /// <summary> 
        ///     The DependencyProperty for the <see cref="SelectedValue"/> property.
        ///     Default Value: null 
        /// </summary>
        public static final DependencyProperty SelectedValueProperty = SelectedValuePropertyKey.DependencyProperty;

        /// <summary> 
        ///     Specifies the a value on the selected item as defined by <see cref="SelectedValuePath" />.
        /// </summary> 
//        [Bindable(true), Category("Appearance"), ReadOnly(true), DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)] 
        public Object SelectedValue
        { 
            get
            {
                return GetValue(SelectedValueProperty);
            } 
        }
 
        private void SetSelectedValue(Object data) 
        {
            if (SelectedValue != data) 
            {
                SetValue(SelectedValuePropertyKey, data);
            }
        } 

        /// <summary> 
        ///     The DependencyProperty for the <see cref="SelectedValuePath"/> property. 
        ///     Default Value: String.Empty
        /// </summary> 
        public static final DependencyProperty SelectedValuePathProperty =
            DependencyProperty.Register(
                    "SelectedValuePath",
                    typeof(String), 
                    typeof(TreeView),
                    new FrameworkPropertyMetadata( 
                            String.Empty, 
                            new PropertyChangedCallback(OnSelectedValuePathChanged)));
 
        /// <summary>
        ///     Specifies the path to query on <see cref="SelectedItem" /> to calculate <see cref="SelectedValue" />.
        /// </summary>
//        [Bindable(true), Category("Appearance")] 
        public String SelectedValuePath
        { 
            get { return (String) GetValue(SelectedValuePathProperty); } 
            set { SetValue(SelectedValuePathProperty, value); }
        } 

        private static void OnSelectedValuePathChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            TreeView tree = (TreeView)d; 
            SelectedValuePathBindingExpression.ClearValue(tree);
            tree.UpdateSelectedValue(tree.SelectedItem); 
        } 

//        #endregion 

//        #region Public Events

        /// <summary> 
        ///     Event fired when <see cref="SelectedItem"/> changes.
        /// </summary> 
        public static final RoutedEvent SelectedItemChangedEvent = EventManager.RegisterRoutedEvent("SelectedItemChanged", RoutingStrategy.Bubble, 
        		typeof(RoutedPropertyChangedEventHandler<Object>), typeof(TreeView)); 

        /// <summary> 
        ///     Event fired when <see cref="SelectedItem"/> changes.
        /// </summary>
//        [Category("Behavior")]
        public /*event*/ RoutedPropertyChangedEventHandler<Object> SelectedItemChanged 
        {
            add 
            { 
                AddHandler(SelectedItemChangedEvent, value);
            } 

            remove
            {
                RemoveHandler(SelectedItemChangedEvent, value); 
            }
        } 
 
        /// <summary>
        ///     Called when <see cref="SelectedItem"/> changes. 
        ///     Default implementation fires the <see cref="SelectedItemChanged"/> event.
        /// </summary>
        /// <param name="e">Event arguments.</param>
        protected /*virtual*/ void OnSelectedItemChanged(RoutedPropertyChangedEventArgs<Object> e) 
        {
            // 
            RaiseEvent(e); 
        }
 
//        #endregion

//        #region Implementation
 
//        #region Selection
 
        /*internal*/ public void ChangeSelection(Object data, TreeViewItem container, boolean selected) 
        {
            if (IsSelectionChangeActive) 
            {
                return;
            }
 
            Object oldValue = null;
            Object newValue = null; 
            boolean changed = false; 
            TreeViewItem oldContainer = _selectedContainer; // Saved for the automation event
 
            IsSelectionChangeActive = true;

            try
            { 
                if (selected)
                { 
                    if (container != _selectedContainer) 
                    {
                        oldValue = SelectedItem; 
                        newValue = data;

                        if (_selectedContainer != null)
                        { 
                            _selectedContainer.IsSelected = false;
                            _selectedContainer.UpdateContainsSelection(false); 
                        } 
                        _selectedContainer = container;
                        _selectedContainer.UpdateContainsSelection(true); 
                        SetSelectedItem(data);
                        UpdateSelectedValue(data);
                        changed = true;
                    } 
                }
                else 
                { 
                    if (container == _selectedContainer)
                    { 
                        _selectedContainer.UpdateContainsSelection(false);
                        _selectedContainer = null;
                        SetSelectedItem(null);
 
                        oldValue = data;
                        changed = true; 
                    } 
                }
 
                if (container.IsSelected != selected)
                {
                    container.IsSelected = selected;
                } 
            }
            finally 
            { 
                IsSelectionChangeActive = false;
            } 

            if (changed)
            {
                if (    _selectedContainer != null 
                    &&  AutomationPeer.ListenerExists(AutomationEvents.SelectionItemPatternOnElementSelected)   )
                { 
                    TreeViewItemAutomationPeer peer = UIElementAutomationPeer.CreatePeerForElement(_selectedContainer) as TreeViewItemAutomationPeer; 
                    if (peer != null)
                        peer.RaiseAutomationSelectionEvent(AutomationEvents.SelectionItemPatternOnElementSelected); 
                }

                if (    oldContainer != null
                    &&  AutomationPeer.ListenerExists(AutomationEvents.SelectionItemPatternOnElementRemovedFromSelection)   ) 
                {
                    TreeViewItemAutomationPeer peer = UIElementAutomationPeer.CreatePeerForElement(oldContainer) as TreeViewItemAutomationPeer; 
                    if (peer != null) 
                        peer.RaiseAutomationSelectionEvent(AutomationEvents.SelectionItemPatternOnElementRemovedFromSelection);
                } 

                RoutedPropertyChangedEventArgs<Object> e = new RoutedPropertyChangedEventArgs<Object>(oldValue, newValue, SelectedItemChangedEvent);
                OnSelectedItemChanged(e);
            } 
        }
 
        /*internal*/ public boolean IsSelectionChangeActive 
        {
            get { return _bits[(int)Bits.IsSelectionChangeActive]; } 
            set { _bits[(int)Bits.IsSelectionChangeActive] = value; }
        }

        private void UpdateSelectedValue(Object selectedItem) 
        {
            BindingExpression expression = PrepareSelectedValuePathBindingExpression(selectedItem); 
 
            if (expression != null)
            { 
                expression.Activate(selectedItem);
                Object selectedValue = expression.Value;
                expression.Deactivate();
 
                SetValue(SelectedValuePropertyKey, selectedValue);
            } 
            else 
            {
                ClearValue(SelectedValuePropertyKey); 
            }
        }

        private BindingExpression PrepareSelectedValuePathBindingExpression(Object item) 
        {
            if (item == null) 
            { 
                return null;
            } 

            Binding binding;
            boolean useXml = SystemXmlHelper.IsXmlNode(item);
 
            BindingExpression bindingExpr = SelectedValuePathBindingExpression.GetValue(this);
 
            // replace existing binding if it's the wrong kind 
            if (bindingExpr != null)
            { 
                binding = bindingExpr.ParentBinding;
                boolean usesXml = (binding.XPath != null);
                if (usesXml != useXml)
                { 
                    bindingExpr = null;
                } 
            } 

            if (bindingExpr == null) 
            {
                // create the binding
                binding = new Binding();
                binding.Source = item; 

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
                SelectedValuePathBindingExpression.SetValue(this, bindingExpr);
            } 

            return bindingExpr;
        }
 
        /*internal*/ public void HandleSelectionAndCollapsed(TreeViewItem collapsed)
        { 
            if ((_selectedContainer != null) && (_selectedContainer != collapsed)) 
            {
                // Check if current selection is under the collapsed element 
                TreeViewItem current = _selectedContainer;
                do
                {
                    current = current.ParentTreeViewItem; 
                    if (current == collapsed)
                    { 
                        TreeViewItem oldContainer = _selectedContainer; 

                        ChangeSelection(collapsed.ParentItemsControl.ItemContainerGenerator.ItemFromContainer(collapsed), collapsed, true); 

                        if (oldContainer.IsKeyboardFocusWithin)
                        {
                            // If the oldContainer had focus then move focus to the newContainer instead 
                            _selectedContainer.Focus();
                        } 
 
                        break;
                    } 
                }
                while (current != null);
            }
        } 

        // This method is called when MouseButonDown on TreeViewItem and also listen for handled events too 
        // The purpose is to restore focus on TreeView when mouse is clicked and focus was outside the TreeView 
        // Focus goes either to selected item (if any) or treeview itself
        /*internal*/ public void HandleMouseButtonDown() 
        {
            if (!this.IsKeyboardFocusWithin)
            {
                if (_selectedContainer != null) 
                {
                    if (!_selectedContainer.IsKeyboardFocused) 
                        _selectedContainer.Focus(); 
                }
                else 
                {
                    // If we don't have a selection - just focus the treeview
                    this.Focus();
                } 
            }
        } 
 
//        #endregion
 
//        #region Containers

        /// <summary>
        ///     Returns true if the item is or should be its own container. 
        /// </summary>
        /// <param name="item">The item to test.</param> 
        /// <returns>true if its type matches the container type.</returns> 
        protected /*override*/ boolean IsItemItsOwnContainerOverride(Object item)
        { 
            return item instanceof TreeViewItem;
        }

        /// <summary> 
        ///     Create or identify the element used to display the given item.
        /// </summary> 
        /// <returns>The container.</returns> 
        protected /*override*/ DependencyObject GetContainerForItemOverride()
        { 
            return new TreeViewItem();
        }

        /// <summary> 
        ///     This method is invoked when the Items property changes.
        /// </summary> 
        protected /*override*/ void OnItemsChanged(NotifyCollectionChangedEventArgs e) 
        {
            switch (e.Action) 
            {
                case /*NotifyCollectionChangedAction.*/Remove:
                case /*NotifyCollectionChangedAction.*/Reset:
                    if ((SelectedItem != null) && !IsSelectedContainerHookedUp) 
                    {
                        SelectFirstItem(); 
                    } 
                    break;
 
                case /*NotifyCollectionChangedAction.*/Replace:
                    {
                        // If old item is selected - remove the selection
                        // Revisit the condition when we support duplicate items in Items collection: if e.OldItems[0] is the same as selected items we will unselect the selected item 
                        Object selectedItem = SelectedItem;
                        if ((selectedItem != null) && selectedItem.Equals(e.OldItems[0])) 
                        { 
                            ChangeSelection(selectedItem, _selectedContainer, false);
                        } 
                    }
                    break;

                case /*NotifyCollectionChangedAction.*/Add: 
                case /*NotifyCollectionChangedAction.*/Move:
                    break; 
 
                default:
                    throw new NotSupportedException(/*SR.Get(SRID.UnexpectedCollectionChangeAction, e.Action)*/); 
            }
        }

        private void SelectFirstItem() 
        {
            Object item; 
            TreeViewItem container; 
            boolean selected = GetFirstItem(/*out*/ item, /*out*/ container);
            if (!selected) 
            {
                item = SelectedItem;
                container = _selectedContainer;
            } 

            ChangeSelection(item, container, selected); 
        } 

        private boolean GetFirstItem(/*out*/ Object item, /*out*/ TreeViewItem container) 
        {
            if (HasItems)
            {
                item = Items[0]; 
                container = ItemContainerGenerator.ContainerFromIndex(0) as TreeViewItem;
                return ((item != null) && (container != null)); 
            } 
            else
            { 
                item = null;
                container = null;
                return false;
            } 
        }
 
        /*internal*/ public boolean IsSelectedContainerHookedUp 
        {
            get 
            {
                return (_selectedContainer != null) && (_selectedContainer.ParentTreeView == this);
            }
        } 

        /*internal*/ public TreeViewItem SelectedContainer 
        { 
            get
            { 
                return _selectedContainer;
            }
        }
 
//        #endregion
 
//        #region Input 

        /// <summary> 
        ///     If control has a scrollviewer in its style and has a custom keyboard scrolling behavior when HandlesScrolling should return true.
        /// Then ScrollViewer will not handle keyboard input and leave it up to the control.
        /// </summary>
        protected /*internal*/ public /*override*/ boolean HandlesScrolling 
        {
            get { return true; } 
        } 

        /// <summary> 
        ///     Called when a keyboard key is pressed down.
        /// </summary>
        /// <param name="e">Event Arguments</param>
        protected /*override*/ void OnKeyDown(KeyEventArgs e) 
        {
            super.OnKeyDown(e); 
            if (!e.Handled) 
            {
                if (IsControlKeyDown) 
                {
                    switch (e.Key)
                    {
                        case /*Key.*/Up: 
                        case /*Key.*/Down:
                        case /*Key.*/Left: 
                        case /*Key.*/Right: 
                        case /*Key.*/Home:
                        case /*Key.*/End: 
                        case /*Key.*/PageUp:
                        case /*Key.*/PageDown:
                            if (HandleScrollKeys(e.Key))
                            { 
                                e.Handled = true;
                            } 
                            break; 
                    }
                } 
                else
                {
                    switch (e.Key)
                    { 
                        case /*Key.*/Up:
                        case /*Key.*/Down: 
                            if ((_selectedContainer == null) && FocusFirstItem()) 
                            {
                                e.Handled = true; 
                            }
                            break;

                        case /*Key.*/Home: 
                            if (FocusFirstItem())
                            { 
                                e.Handled = true; 
                            }
                            break; 

                        case /*Key.*/End:
                            if (FocusLastItem())
                            { 
                                e.Handled = true;
                            } 
                            break; 

                        case /*Key.*/PageUp: 
                        case /*Key.*/PageDown:
                            if (_selectedContainer == null)
                            {
                                if (FocusFirstItem()) 
                                {
                                    e.Handled = true; 
                                } 
                            }
                            else if (HandleScrollByPage(e)) 
                            {
                                e.Handled = true;
                            }
                            break; 

                        case /*Key.*/Tab: 
                            if (IsShiftKeyDown && IsKeyboardFocusWithin) 
                            {
                                // SHIFT-TAB behavior for KeyboardNavigation needs to happen at the TreeView level 
                                if (MoveFocus(new TraversalRequest(FocusNavigationDirection.Previous)))
                                {
                                    e.Handled = true;
                                } 
                            }
                            break; 
 
                        case /*Key.*/Multiply:
                            if (ExpandSubtree(_selectedContainer)) 
                            {
                                e.Handled = true;
                            }
                            break; 
                    }
                } 
            } 
        }
 
        private static boolean IsControlKeyDown
        {
            get
            { 
                return ((Keyboard.Modifiers & ModifierKeys.Control) == (ModifierKeys.Control));
            } 
        } 

        private static boolean IsShiftKeyDown 
        {
            get
            {
                return ((Keyboard.Modifiers & ModifierKeys.Shift) == (ModifierKeys.Shift)); 
            }
        } 
 
        private boolean FocusFirstItem()
        { 
            FrameworkElement container;
            return NavigateToStartInternal(new ItemNavigateArgs(Keyboard.PrimaryDevice, Keyboard.Modifiers), true /*shouldFocus*/, /*out*/ container);
        }
 

        private boolean FocusLastItem() 
        { 
            FrameworkElement container;
            return NavigateToEndInternal(new ItemNavigateArgs(Keyboard.PrimaryDevice, Keyboard.Modifiers), true /*shouldFocus*/, /*out*/ container); 
        }

        private boolean HandleScrollKeys(Key key)
        { 
            ScrollViewer scroller = ScrollHost;
            if (scroller != null) 
            { 
                boolean invert = (FlowDirection == FlowDirection.RightToLeft);
                switch (key) 
                {
                    case /*Key.*/Up:
                        scroller.LineUp();
                        return true; 

                    case /*Key.*/Down: 
                        scroller.LineDown(); 
                        return true;
 
                    case /*Key.*/Left:
                        if (invert)
                        {
                            scroller.LineRight(); 
                        }
                        else 
                        { 
                            scroller.LineLeft();
                        } 
                        return true;

                    case /*Key.*/Right:
                        if (invert) 
                        {
                            scroller.LineLeft(); 
                        } 
                        else
                        { 
                            scroller.LineRight();
                        }
                        return true;
 
                    case /*Key.*/Home:
                        scroller.ScrollToTop(); 
                        return true; 

                    case /*Key.*/End: 
                        scroller.ScrollToBottom();
                        return true;

                    case /*Key.*/PageUp: 
                        //if vertically scrollable - go vertical, otherwise horizontal
                        if(DoubleUtil.GreaterThan(scroller.ExtentHeight, scroller.ViewportHeight)) 
                        { 
                            scroller.PageUp();
                        } 
                        else
                        {
                            scroller.PageLeft();
                        } 
                        return true;
 
                    case /*Key.*/PageDown: 
                        //if vertically scrollable - go vertical, otherwise horizontal
                        if(DoubleUtil.GreaterThan(scroller.ExtentHeight, scroller.ViewportHeight)) 
                        {
                            scroller.PageDown();
                        }
                        else 
                        {
                            scroller.PageRight(); 
                        } 
                        return true;
 
                }
            }

            return false; 
        }
 
        private boolean HandleScrollByPage(KeyEventArgs e) 
        {
            IInputElement originalFocusedElement = Keyboard.FocusedElement; 
            ItemsControl parentItemsControl = ItemsControl.ItemsControlFromItemContainer(_selectedContainer);
            ItemInfo startingInfo = (parentItemsControl != null)
                ? parentItemsControl.ItemInfoFromContainer(_selectedContainer)
                : null; 

            FrameworkElement startingContainer = _selectedContainer.HeaderElement; 
            if (startingContainer == null) 
            {
                startingContainer = _selectedContainer; 
            }

            return NavigateByPage(startingInfo,
                startingContainer, 
                (e.Key == Key.PageUp ? FocusNavigationDirection.Up : FocusNavigationDirection.Down),
                new ItemNavigateArgs(e.Device, Keyboard.Modifiers)); 
        } 

        /// <summary> 
        /// Recursively expands all the nodes under the given item.
        /// </summary>
        /// <returns>true if the subtree was expanded, false otherwise.</returns>
        /// <remarks>This can be overriden to modify/disable the numpad-* behavior.</remarks> 
        protected /*virtual*/ boolean ExpandSubtree(TreeViewItem container)
        { 
            if (container != null) 
            {
                container.ExpandSubtree(); 
                return true;
            }

            return false; 
        }
 
//        #endregion 

//        #region IsSelectionActive 

        /// <summary>
        ///     An event reporting that the IsKeyboardFocusWithin property changed.
        /// </summary> 
        protected /*override*/ void OnIsKeyboardFocusWithinChanged(DependencyPropertyChangedEventArgs e)
        { 
            super.OnIsKeyboardFocusWithinChanged(e); 

            // When focus within changes we need to update the value of IsSelectionActive. 
            boolean isSelectionActive = false;
            boolean isKeyboardFocusWithin = IsKeyboardFocusWithin;
            if (isKeyboardFocusWithin)
            { 
                // Keyboard focus is within the control, selection should appear active.
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
                        if (FocusManager.GetFocusScope(currentFocus) != root) 
                        {
                            isSelectionActive = true; 
                        }
                    }
                }
            } 

            if ((boolean)GetValue(Selector.IsSelectionActiveProperty) != isSelectionActive) 
            { 
                // The value changed, set the new value.
                SetValue(Selector.IsSelectionActivePropertyKey, BooleanBoxes.Box(isSelectionActive)); 
            }

            if (isKeyboardFocusWithin && IsKeyboardFocused && (_selectedContainer != null) && !_selectedContainer.IsKeyboardFocusWithin)
            { 
                _selectedContainer.Focus();
            } 
        } 

        /// <summary> 
        ///     Polymorphic method which gets called when control gets focus.
        ///     Passes on the focus to an inner TreeViewItem if necessary.
        /// </summary>
        protected /*override*/ void OnGotFocus(RoutedEventArgs e) 
        {
            super.OnGotFocus(e); 
 
            // Pass on the focus to selecteContainer if TreeView recieves focus
            // but its IsKeyboardFocusWithin doesnt change. 
            if (IsKeyboardFocusWithin && IsKeyboardFocused && (_selectedContainer != null) && !_selectedContainer.IsKeyboardFocusWithin)
            {
                _selectedContainer.Focus();
            } 
        }
 
        private void OnFocusEnterMainFocusScope(Object sender, EventArgs e) 
        {
            // When KeyboardFocus comes back to the main focus scope and the TreeView does not have focus within- clear IsSelectionActivePrivateProperty 
            if (!IsKeyboardFocusWithin)
            {
                ClearValue(Selector.IsSelectionActivePropertyKey);
            } 
        }
 
        private static DependencyObject FindParent(DependencyObject o) 
        {
            Visual v = o as Visual; 
            ContentElement ce = (v == null) ? o as ContentElement : null;

            if (ce != null)
            { 
                o = ContentOperations.GetParent(ce);
                if (o != null) 
                { 
                    return o;
                } 
                else
                {
                    FrameworkContentElement fce = ce as FrameworkContentElement;
                    if (fce != null) 
                    {
                        return fce.Parent; 
                    } 
                }
            } 
            else if (v != null)
            {
                return VisualTreeHelper.GetParent(v);
            } 

            return null; 
        } 

//        #endregion 

//        #region Automation

        /// <summary> 
        /// Creates AutomationPeer (<see cref="UIElement.OnCreateAutomationPeer"/>)
        /// </summary> 
        protected /*override*/ AutomationPeer OnCreateAutomationPeer() 
        {
            return new TreeViewAutomationPeer(this); 
        }

//        #endregion
 
//        #region DTypeThemeStyleKey
 
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will /*override*/ this method to return approriate types.
        /*internal*/ public /*override*/ DependencyObjectType DTypeThemeStyleKey 
        {
            get { return _dType; }
        }
 
        private static DependencyObjectType _dType;
 
//        #endregion DTypeThemeStyleKey 

 
//        #endregion

//        #region Data
 
        private enum Bits
        { 
            IsSelectionChangeActive    ,// = 0x1, 
        }
 
        // Packed boolean information
        private BitVector32 _bits = new BitVector32(0);

        private TreeViewItem _selectedContainer; 

        // Used to retrieve the value of an item, according to the SelectedValuePath 
        private static final BindingExpressionUncommonField SelectedValuePathBindingExpression = new BindingExpressionUncommonField(); 
        private EventHandler _focusEnterMainFocusScopeEventHandler;
 
//        #endregion
    }