/**
 * Menu
 */

define(["dojo/_base/declare", "system/Type", "primitives/MenuBase"], 
		function(declare, Type, MenuBase){
//    private static DependencyObjectType 
	var _dType = null;
	var Menu = declare("Menu", MenuBase,{
		constructor:function(){
//			private KeyboardNavigation.EnterMenuModeEventHandler 
			this._enterMenuModeHandler = null; 
		},
		
        /// <summary>
        ///     This virtual method in called when IsInitialized is set to true and it raises an Initialized event 
        /// </summary> 
//        protected override void 
		OnInitialized:function(/*EventArgs*/ e)
        { 
			MenuBase.prototype.OnInitialized.call(this, e);
            if (this.IsMainMenu)
            {
            	this.SetupMainMenu(); 
            }
        },
      /// <SecurityNote>
        ///    Critical: This sets up a handler for entering menu mode which will recieve a presentationsource 
        ///    TreatAsSafe: The function that it hooks is safe to expose since it does not expose the source
        /// </SecurityNote>
//        private void 
        SetupMainMenu:function() 
        {
            if (this._enterMenuModeHandler == null) 
            { 
            	this._enterMenuModeHandler = new KeyboardNavigation.EnterMenuModeEventHandler(this.OnEnterMenuMode);
//                (new UIPermission(UIPermissionWindow.AllWindows)).Assert(); //Blessed Assert 
                try
                {
                   KeyboardNavigation.Current.EnterMenuMode.Combine(this._enterMenuModeHandler);
                } 
                finally
                { 
//                    UIPermission.RevertAssert(); 
                }
           } 
       },

//        private void 
       CleanupMainMenu:function()
       { 
    	   if (this._enterMenuModeHandler != null)
    	   { 
    		   KeyboardNavigation.Current.EnterMenuMode.Remove(this._enterMenuModeHandler); 
    	   }
       },
       /// <summary> 
       /// Prepare the element to display the item.  This may involve 
       /// applying styles, setting bindings, etc.
       /// </summary> 
//       protected override void 
       PrepareContainerForItemOverride:function(/*DependencyObject*/ element, /*object*/ item)
       {
           base.PrepareContainerForItemOverride(element, item);

           MenuItem.PrepareMenuItem(element, item);
       }, 

       /// <summary>
       ///     This is the method that responds to the KeyDown event. 
       /// </summary>
       /// <param name="e">Event arguments</param>
//       protected override void 
       OnKeyDown:function(/*KeyEventArgs*/ e)
       { 
           base.OnKeyDown(e);
           if (e.Handled) return; 

           var key = e.Key;
           switch (key) 
           {
               case Key.Down:
               case Key.Up:
                   if (CurrentSelection != null) 
                   {
                       // Only for non vertical layout Up/Down open the submenu 
                       /*Panel*/var itemsHost = ItemsHost; 
                       var isVertical = itemsHost != null && itemsHost.HasLogicalOrientation && itemsHost.LogicalOrientation == Orientation.Vertical;
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
                       /*Panel*/var itemsHost = ItemsHost;
                       var isVertical = itemsHost != null && itemsHost.HasLogicalOrientation && itemsHost.LogicalOrientation == Orientation.Vertical; 
                       if (isVertical)
                       { 
                           CurrentSelection.OpenSubmenuWithKeyboard(); 
                           e.Handled = true;
                       } 
                   }
                   break;
           }
       }, 

       /// <summary> 
       ///     This is the method that responds to the TextInput event. 
       /// </summary>
       /// <param name="e">Event arguments</param> 
       /// <SecurityNote>
       ///     Critical: accesses ShowSystemMenu & CriticalFromVisual
       ///     TreatAsSafe: limited to only UserInitiated input.
       /// </SecurityNote> 
//       protected override void 
       OnTextInput:function(/*TextCompositionEventArgs*/ e) 
       { 
           base.OnTextInput(e);
           if (e.Handled) return; 

           // We don't use win32 menu's, so we need to emulate the win32
           // behavior for hitting Space while in menu mode.  Alt+Space
           // will be handled as a SysKey by the DefaultWindowProc, but 
           // Alt, then Space needs to be special cased here because we prevent win32.
           // from entering menu mode.  In WPF the equiv. of win32 menu mode is having 
           // a main menu with focus and no menu items opened. 
           if (e.UserInitiated &&
               e.Text == " " && 
               this.IsMainMenu &&
               (CurrentSelection == null || !this.CurrentSelection.IsSubmenuOpen))
           {
               // We need to exit menu mode because it holds capture and prevents 
               // the system menu from showing.
               this.IsMenuMode = false; 
               /*System.Windows.Interop.HwndSource*/var source = PresentationSource.CriticalFromVisual(this);
               source = source instanceof System.Windows.Interop.HwndSource ? source : null; 
               if (source != null)
               { 
                   source.ShowSystemMenu();
                   e.Handled = true;
               }
           } 
       },

       /// <summary> 
       ///     Called when any mouse button is pressed or released on this subtree
       /// </summary> 
       /// <param name="e">Event arguments.</param>
//       protected override void 
       HandleMouseButton:function(/*MouseButtonEventArgs*/ e)
       {
           base.HandleMouseButton(e); 

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
               /*FrameworkElement*/var element = e.OriginalSource instanceof FrameworkElement ? e.OriginalSource : null;

               if ((element != null && (element == this || element.TemplatedParent == this)))
               { 
                   this.IsMenuMode = false; 
                   e.Handled = true;
               } 
           }
       },

//       internal override bool 
       FocusItem:function(/*ItemInfo*/ info, /*ItemNavigateArgs*/ itemNavigateArgs) 
       {
           var returnValue = base.FocusItem(info, itemNavigateArgs); 
           // Trying to navigate from the current menuitem (this) to an adjacent menuitem. 

           if (itemNavigateArgs.DeviceUsed instanceof KeyboardDevice) 
           {
               // If the item is a TopLevelHeader then when you navigate onto it, the submenu will open
               // and we should select the first item in the submenu.  The parent MenuItem will take care
               // of opening the submenu but doesn't know whether focus changed because of a mouse action 
               // or a keyboard action.  Help out by focusing the first thing in the new submenu.

               // Assume that KeyboardNavigation.Current.Navigate moved focus onto the element onto which 
               // it navigated.
               /*MenuItem*/var newSelection = info.Container instanceof MenuItem ? info.Container : null; 
               if (newSelection != null
                   && newSelection.Role == MenuItemRole.TopLevelHeader
                   && newSelection.IsSubmenuOpen)
               { 
                   newSelection.NavigateToStart(itemNavigateArgs);
               } 
           } 
           return returnValue;
       },
       
     /// <SecurityNote> 
       /// Critical - as this calls PresentationSource.CriticalFromVisual() .
       /// Safe - as this doesn't return PresentationSource thus obtained. 
       /// </SecurityNote> 
//       private bool 
       OnEnterMenuMode:function(/*object*/ sender, /*EventArgs*/ e) 
       {
           // Don't enter menu mode if someone has capture
           if (Mouse.Captured != null)
               return false; 

           // Need to check that ALT/F10 happened in our source. 
           /*PresentationSource*/var source = sender instanceof PresentationSource ? sender : null; 
           /*PresentationSource*/var mySource = null;

           mySource = PresentationSource.CriticalFromVisual(this);
           if (source == mySource)
           {
               // Give focus to the first possible element in the ItemsControl 
               for (var i = 0; i < Items.Count; i++)
               { 
                   /*MenuItem*/var menuItem = ItemContainerGenerator.ContainerFromIndex(i);
                   menuItem = menuItem instanceof MenuItem ? menuItem : null; 

                   if (menuItem != null && !(this.Items.Get(i) instanceof Separator)) 
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

	});
	
	Object.defineProperties(Menu.prototype,{
        /// <summary>
        ///     True if this menu will participate in main menu activation notification. 
        ///     If there are multiple menus on a page, menus that do not wish to receive ALT or F10
        ///     key notification should set this property to false.
        /// </summary>
        /// <value></value> 
//        public bool 
		IsMainMenu:
        { 
            get:function() { return this.GetValue(Menu.IsMainMenuProperty); },
            set:function() { this.SetValue(Menu.IsMainMenuProperty, value); }
        },
        
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will override this method to return approriate types. 
//        internal override DependencyObjectType 
        DTypeThemeStyleKey:
        { 
            get:function() { return _dType; } 
        }
	});
	
	Object.defineProperties(Menu,{
        /// <summary>
        ///     DependencyProperty for the IsMainMenuProperty 
        /// </summary> 
//        public static readonly DependencyProperty 
		IsMainMenuProperty:
        {
        	get:function(){
        		if(Menu._SelectionModeProperty === undefined){
        			Menu._SelectionModeProperty =
                        DependencyProperty.Register( 
                                "IsMainMenu",
                                Boolean.Type,
                                Menu.Type,
                                /*new FrameworkPropertyMetadata( 
                                        true,
                                        new PropertyChangedCallback(null, OnIsMainMenuChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                                        true,
                                        new PropertyChangedCallback(null, OnIsMainMenuChanged)));  
        		}
        		
        		return Menu._SelectionModeProperty;
        	}
        }   
	});
	
//	private static ItemsPanelTemplate 
	function GetDefaultPanel() 
    { 
        /*FrameworkElementFactory*/var panel = new FrameworkElementFactory(WrapPanel.Type);
        /*ItemsPanelTemplate*/var template = new ItemsPanelTemplate(panel); 
        template.Seal();
        return template;
    }
	

//    private static void 
	function OnIsMainMenuChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        Menu menu = d as Menu; 
        if (/*(bool)*/ e.NewValue)
        { 
            d.SetupMainMenu(); 
        }
        else 
        {
            d.CleanupMainMenu();
        }
    } 
	
//    private static object 
	function OnGetIsMainMenu(/*DependencyObject*/ d)
    {
        return d.IsMainMenu; 
    }
//	private static void 
	function OnAccessKeyPressed(/*object*/ sender, /*AccessKeyPressedEventArgs*/ e)
    { 
        // If ALT is down, then blend our scope into the one above. Maybe bad, but only if Menu is not top-level.
        if (!(Keyboard.IsKeyDown(Key.LeftAlt) || Keyboard.IsKeyDown(Key.RightAlt))) 
        { 
            e.Scope = sender;
            e.Handled = true; 
        }
    }
	
//	static Menu()
	function Initialize()
    {
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(Menu.Type, 
        		/*new FrameworkPropertyMetadata(Menu.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(Menu.Type));
        _dType = DependencyObjectType.FromSystemTypeInternal(Menu.Type); 

        ItemsControl.ItemsPanelProperty.OverrideMetadata(Menu.Type, 
        		/*new FrameworkPropertyMetadata(GetDefaultPanel())*/
        		FrameworkPropertyMetadata.BuildWithDV(GetDefaultPanel())); 
        KeyboardNavigation.IsTabStopProperty.OverrideMetadata(Menu.Type, /*new FrameworkPropertyMetadata(false)*/
        		FrameworkPropertyMetadata.BuildWithDV(false)); 

        KeyboardNavigation.ControlTabNavigationProperty.OverrideMetadata(Menu.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Once)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Once)); 
        
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(Menu.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Cycle)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Cycle));

        EventManager.RegisterClassHandler(Menu.Type, AccessKeyManager.AccessKeyPressedEvent, 
        		new AccessKeyPressedEventHandler(null, OnAccessKeyPressed));
    }
	
	Menu.Type = new Type("Menu", Menu, [MenuBase.Type]);
	Initialize();
	
	return Menu;
});
