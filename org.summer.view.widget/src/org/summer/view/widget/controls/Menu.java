/**
 */
package org.summer.view.widget.controls;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.EventManager;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.FrameworkElementFactory;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.PresentationSource;
import org.summer.view.widget.controls.primitives.MenuBase;
import org.summer.view.widget.input.AccessKeyManager;
import org.summer.view.widget.input.AccessKeyPressedEventArgs;
import org.summer.view.widget.input.Key;
import org.summer.view.widget.input.KeyEventArgs;
import org.summer.view.widget.input.Keyboard;
import org.summer.view.widget.input.KeyboardNavigation;
import org.summer.view.widget.input.KeyboardNavigationMode;
import org.summer.view.widget.input.Mouse;
import org.summer.view.widget.input.MouseButton;
import org.summer.view.widget.input.MouseButtonEventArgs;
import org.summer.view.widget.input.TextCompositionEventArgs;

/// <summary>
    ///     Control that defines a menu of choices for users to invoke.
    /// </summary>
//#if OLD_AUTOMATION 
//    [Automation(AccessibilityControlType = "Menu")]
//#endif 
    public class Menu extends MenuBase 
    {
        //------------------------------------------------------------------- 
        //
        //  Constructors
        //
        //------------------------------------------------------------------- 

//        #region Constructors 
 
        /// <summary>
        ///     Default DependencyObject constructor 
        /// </summary>
        /// <remarks>
        ///     Automatic determination of current Dispatcher. Use alternative constructor
        ///     that accepts a Dispatcher for best performance. 
        /// </remarks>
        public Menu() 
        { 
        	super();
        }
 
        static //Menu()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(Menu), new FrameworkPropertyMetadata(typeof(Menu)));
            _dType = DependencyObjectType.FromSystemTypeInternal(typeof(Menu)); 

            ItemsPanelProperty.OverrideMetadata(typeof(Menu), new FrameworkPropertyMetadata(GetDefaultPanel())); 
            IsTabStopProperty.OverrideMetadata(typeof(Menu), new FrameworkPropertyMetadata(false)); 

            KeyboardNavigation.ControlTabNavigationProperty.OverrideMetadata(typeof(Menu), new FrameworkPropertyMetadata(KeyboardNavigationMode.Once)); 
            KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(typeof(Menu), new FrameworkPropertyMetadata(KeyboardNavigationMode.Cycle));

            EventManager.RegisterClassHandler(typeof(Menu), AccessKeyManager.AccessKeyPressedEvent, new AccessKeyPressedEventHandler(OnAccessKeyPressed));
        } 

        private static ItemsPanelTemplate GetDefaultPanel() 
        { 
            FrameworkElementFactory panel = new FrameworkElementFactory(typeof(WrapPanel));
            ItemsPanelTemplate template = new ItemsPanelTemplate(panel); 
            template.Seal();
            return template;
        }
 
//        #endregion
 
 
        //--------------------------------------------------------------------
        // 
        //  Public Methods
        //
        //-------------------------------------------------------------------
 
        /// <summary>
        ///     DependencyProperty for the IsMainMenuProperty 
        /// </summary> 
        public static final DependencyProperty IsMainMenuProperty =
                DependencyProperty.Register( 
                        "IsMainMenu",
                        typeof(boolean),
                        typeof(Menu),
                        new FrameworkPropertyMetadata( 
                                BooleanBoxes.TrueBox,
                                new PropertyChangedCallback(OnIsMainMenuChanged))); 
 
        /// <summary>
        ///     True if this menu will participate in main menu activation notification. 
        ///     If there are multiple menus on a page, menus that do not wish to receive ALT or F10
        ///     key notification should set this property to false.
        /// </summary>
        /// <value></value> 
        public boolean IsMainMenu
        { 
            get { return (boolean) GetValue(IsMainMenuProperty); } 
            set { SetValue(IsMainMenuProperty, BooleanBoxes.Box(value)); }
        } 

        private static void OnIsMainMenuChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            Menu menu = d as Menu; 
            if ((boolean) e.NewValue)
            { 
                menu.SetupMainMenu(); 
            }
            else 
            {
                menu.CleanupMainMenu();
            }
        } 

        /// <summary> 
        /// Creates AutomationPeer (<see cref="UIElement.OnCreateAutomationPeer"/>) 
        /// </summary>
        protected /*override*/ System.Windows.Automation.Peers.AutomationPeer OnCreateAutomationPeer() 
        {
            return new System.Windows.Automation.Peers.MenuAutomationPeer(this);
        }
 
        /// <summary>
        ///     This virtual method in called when IsInitialized is set to true and it raises an Initialized event 
        /// </summary> 
        protected /*override*/ void OnInitialized(EventArgs e)
        { 
        	super.OnInitialized(e);
            if (IsMainMenu)
            {
                SetupMainMenu(); 
            }
        } 
 
        /// <SecurityNote>
        ///    Critical: This sets up a handler for entering menu mode which will recieve a presentationsource 
        ///    TreatAsSafe: The function that it hooks is safe to expose since it does not expose the source
        /// </SecurityNote>
//        [SecurityCritical,SecurityTreatAsSafe]
        private void SetupMainMenu() 
        {
            if (_enterMenuModeHandler == null) 
            { 
                _enterMenuModeHandler = new KeyboardNavigation.EnterMenuModeEventHandler(OnEnterMenuMode);
                (new UIPermission(UIPermissionWindow.AllWindows)).Assert(); //Blessed Assert 
                try
                {
                   KeyboardNavigation.Current.EnterMenuMode += _enterMenuModeHandler;
                } 
                finally
                { 
                    UIPermission.RevertAssert(); 
                }
           } 
       }

        private void CleanupMainMenu()
        { 
            if (_enterMenuModeHandler != null)
            { 
                KeyboardNavigation.Current.EnterMenuMode -= _enterMenuModeHandler; 
            }
        } 

        private static Object OnGetIsMainMenu(DependencyObject d)
        {
            return BooleanBoxes.Box(((Menu)d).IsMainMenu); 
        }
 
        //-------------------------------------------------------------------- 
        //
        //  Protected Methods 
        //
        //--------------------------------------------------------------------

//        #region Protected Methods 

        /// <summary> 
        /// Prepare the element to display the item.  This may involve 
        /// applying styles, setting bindings, etc.
        /// </summary> 
        protected /*override*/ void PrepareContainerForItemOverride(DependencyObject element, Object item)
        {
        	super.PrepareContainerForItemOverride(element, item);
 
            MenuItem.PrepareMenuItem(element, item);
        } 
 
        /// <summary>
        ///     This is the method that responds to the KeyDown event. 
        /// </summary>
        /// <param name="e">Event arguments</param>
        protected /*override*/ void OnKeyDown(KeyEventArgs e)
        { 
        	super.OnKeyDown(e);
            if (e.Handled) return; 
 
            Key key = e.Key;
            switch (key) 
            {
                case Key.Down:
                case Key.Up:
                    if (CurrentSelection != null) 
                    {
                        // Only for non vertical layout Up/Down open the submenu 
                        Panel itemsHost = ItemsHost; 
                        boolean isVertical = itemsHost != null && itemsHost.HasLogicalOrientation && itemsHost.LogicalOrientation == Orientation.Vertical;
                        if (!isVertical) 
                        {
                            CurrentSelection.OpenSubmenuWithKeyboard();
                            e.Handled = true;
                        } 
                    }
                    break; 
                case Key.Left: 
                case Key.Right:
                    if (CurrentSelection != null) 
                    {
                        // Only for vertical layout Left/Right open the submenu
                        Panel itemsHost = ItemsHost;
                        boolean isVertical = itemsHost != null && itemsHost.HasLogicalOrientation && itemsHost.LogicalOrientation == Orientation.Vertical; 
                        if (isVertical)
                        { 
                            CurrentSelection.OpenSubmenuWithKeyboard(); 
                            e.Handled = true;
                        } 
                    }
                    break;
            }
        } 

        /// <summary> 
        ///     This is the method that responds to the TextInput event. 
        /// </summary>
        /// <param name="e">Event arguments</param> 
        /// <SecurityNote>
        ///     Critical: accesses ShowSystemMenu & CriticalFromVisual
        ///     TreatAsSafe: limited to only UserInitiated input.
        /// </SecurityNote> 
//        [SecurityCritical, SecurityTreatAsSafe]
        protected /*override*/ void OnTextInput(TextCompositionEventArgs e) 
        { 
        	super.OnTextInput(e);
            if (e.Handled) return; 

            // We don't use win32 menu's, so we need to emulate the win32
            // behavior for hitting Space while in menu mode.  Alt+Space
            // will be handled as a SysKey by the DefaultWindowProc, but 
            // Alt, then Space needs to be special cased here because we prevent win32.
            // from entering menu mode.  In WPF the equiv. of win32 menu mode is having 
            // a main menu with focus and no menu items opened. 
            if (e.UserInitiated &&
                e.Text == " " && 
                IsMainMenu &&
                (CurrentSelection == null || !CurrentSelection.IsSubmenuOpen))
            {
                // We need to exit menu mode because it holds capture and prevents 
                // the system menu from showing.
                IsMenuMode = false; 
                System.Windows.Interop.HwndSource source = PresentationSource.CriticalFromVisual(this) as System.Windows.Interop.HwndSource; 
                if (source != null)
                { 
                    source.ShowSystemMenu();
                    e.Handled = true;
                }
            } 
        }
 
        /// <summary> 
        ///     Called when any mouse button is pressed or released on this subtree
        /// </summary> 
        /// <param name="e">Event arguments.</param>
        protected /*override*/ void HandleMouseButton(MouseButtonEventArgs e)
        {
            super.HandleMouseButton(e); 

            if (e.Handled) 
            { 
                return;
            } 

            if (e.ChangedButton != MouseButton.Left && e.ChangedButton != MouseButton.Right)
            {
                return; 
            }
 
            // We want to dismiss when someone clicks on the menu bar, so 
            // really we're interested in clicks that bubble up from an
            // element whose TemplatedParent is the Menu. 
            if (IsMenuMode)
            {
                FrameworkElement element = e.OriginalSource as FrameworkElement;
 
                if ((element != null && (element == this || element.TemplatedParent == this)))
                { 
                    IsMenuMode = false; 
                    e.Handled = true;
                } 
            }
        }

        /*internal*/ public /*override*/ boolean FocusItem(ItemInfo info, ItemNavigateArgs itemNavigateArgs) 
        {
            boolean returnValue = super.FocusItem(info, itemNavigateArgs); 
            // Trying to navigate from the current menuitem (this) to an adjacent menuitem. 

            if (itemNavigateArgs.DeviceUsed instanceof KeyboardDevice) 
            {
                // If the item is a TopLevelHeader then when you navigate onto it, the submenu will open
                // and we should select the first item in the submenu.  The parent MenuItem will take care
                // of opening the submenu but doesn't know whether focus changed because of a mouse action 
                // or a keyboard action.  Help out by focusing the first thing in the new submenu.
 
                // Assume that KeyboardNavigation.Current.Navigate moved focus onto the element onto which 
                // it navigated.
                MenuItem newSelection = info.Container as MenuItem; 
                if (newSelection != null
                    && newSelection.Role == MenuItemRole.TopLevelHeader
                    && newSelection.IsSubmenuOpen)
                { 
                    newSelection.NavigateToStart(itemNavigateArgs);
                } 
            } 
            return returnValue;
        } 

//        #endregion

        //------------------------------------------------------------------- 
        //
        //  Private Methods 
        // 
        //--------------------------------------------------------------------
 
//        #region Private Methods

        private static void OnAccessKeyPressed(Object sender, AccessKeyPressedEventArgs e)
        { 
            // If ALT is down, then blend our scope into the one above. Maybe bad, but only if Menu is not top-level.
            if (!(Keyboard.IsKeyDown(Key.LeftAlt) || Keyboard.IsKeyDown(Key.RightAlt))) 
            { 
                e.Scope = sender;
                e.Handled = true; 
            }
        }

        /// <SecurityNote> 
        /// Critical - as this calls PresentationSource.CriticalFromVisual() .
        /// Safe - as this doesn't return PresentationSource thus obtained. 
        /// </SecurityNote> 
//        [SecurityCritical, SecurityTreatAsSafe]
        private boolean OnEnterMenuMode(Object sender, EventArgs e) 
        {
            // Don't enter menu mode if someone has capture
            if (Mouse.Captured != null)
                return false; 

            // Need to check that ALT/F10 happened in our source. 
            PresentationSource source = sender as PresentationSource; 
            PresentationSource mySource = null;
 
            mySource = PresentationSource.CriticalFromVisual(this);
            if (source == mySource)
            {
                // Give focus to the first possible element in the ItemsControl 
                for (int i = 0; i < Items.Count; i++)
                { 
                    MenuItem menuItem = ItemContainerGenerator.ContainerFromIndex(i) as MenuItem; 

                    if (menuItem != null && !(Items[i] is Separator)) 
                    {
                        if (menuItem.Focus())
                        {
                            return true; 
                        }
                    } 
                } 
            }
 
            return false;
        }

        // 
        //  This property
        //  1. Finds the correct initial size for the _effectiveValues store on the current DependencyObject 
        //  2. This is a performance optimization 
        //
        /*internal*/ public /*override*/ int EffectiveValuesInitialSize 
        {
            get { return 28; }
        }
 
//        #endregion
 
        //------------------------------------------------------------------- 
        //
        //  Private Fields 
        //
        //-------------------------------------------------------------------

//        #region Private Fields 

        private KeyboardNavigation.EnterMenuModeEventHandler _enterMenuModeHandler; 
 
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
    } 
