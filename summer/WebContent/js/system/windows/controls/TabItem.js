/**
 * TabItem
 */

define(["dojo/_base/declare", "system/Type", "controls/HeaderedContentControl", "windows/FrameworkPropertyMetadata",
        "windows/DependencyProperty", "controls/Dock", "windows/FrameworkElement",
        "controls/Control", "windows/UIElement", "windows/UIPropertyMetadata","data/Binding",
        "data/BindingOperations", "input/TraversalRequest"], 
		function(declare, Type, HeaderedContentControl, FrameworkPropertyMetadata,
				DependencyProperty, Dock, FrameworkElement,
				Control, UIElement, UIPropertyMetadata, Binding,
				BindingOperations, TraversalRequest){
	
//  private static DependencyObjectType 
    var _dType = null;
    	
//    private enum 
    var BoolField = declare(null, {});
    BoolField.SetFocusOnContent      = 0x10; // This flag determine if we want to set focus on active TabItem content 
    BoolField.SettingFocus           = 0x20; // This flag indicates that the TabItem is in the process of setting focus 

    // By default ListBoxItem is selectable 
    BoolField.DefaultValue = 0;
    
	var TabItem = declare("TabItem", HeaderedContentControl,{
		constructor:function(){
			this._dom = window.document.createElement('div');
			this._dom._source = this;
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
        /// <summary> 
        ///     Event indicating that the IsSelected property is now true. 
        /// </summary>
        /// <param name="e">Event arguments</param> 
//        protected virtual void 
        OnSelected:function(/*RoutedEventArgs*/ e)
        {
            this.HandleIsSelectedChanged(true, e);
        }, 

        /// <summary> 
        ///     Event indicating that the IsSelected property is now false. 
        /// </summary>
        /// <param name="e">Event arguments</param> 
//        protected virtual void 
		OnUnselected:function(/*RoutedEventArgs*/ e)
        {
			this.HandleIsSelectedChanged(false, e);
        }, 

//        private void 
        HandleIsSelectedChanged:function(/*bool*/ newValue, /*RoutedEventArgs*/ e) 
        { 
        	this.RaiseEvent(e); 
        }, 

//        internal override void 
        OnAncestorChanged:function() 
        {
            // TabStripPlacement depends on the logical parent -- so invalidate it when that changes
        	this.CoerceValue(TabItem.TabStripPlacementProperty);
        }, 

//        internal override void 
        ChangeVisualState:function(/*bool*/ useTransitions) 
        {
            if (!this.IsEnabled)
            {
                VisualStateManager.GoToState(this, VisualStates.StateDisabled, useTransitions); 
            }
            else if (this.IsMouseOver) 
            { 
                VisualStateManager.GoToState(this, VisualStates.StateMouseOver, useTransitions);
            } 
            else
            {
                VisualStateManager.GoToState(this, VisualStates.StateNormal, useTransitions);
            } 

            // Update the SelectionStates group 
            if (this.IsSelected) 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateSelected, VisualStates.StateUnselected); 
            }
            else
            {
                VisualStateManager.GoToState(this, VisualStates.StateUnselected, useTransitions); 
            }
 
            if (this.IsKeyboardFocused) 
            {
                VisualStateManager.GoToState(this, VisualStates.StateFocused, useTransitions); 
            }
            else
            {
                VisualStateManager.GoToState(this, VisualStates.StateUnfocused, useTransitions); 
            }
 
            HeaderedContentControl.prototype.ChangeVisualState.call(this, useTransitions); 
        },
 
        /// <summary> 
        /// This is the method that responds to the MouseLeftButtonDownEvent event.
        /// </summary>
        /// <param name="e"></param>
//        protected override void 
        OnMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e) 
        {
            // We should process only the direct events in case TabItem is the selected one 
            // otherwise we are getting this event when we click on TabItem content because it is in the logical subtree 
            if (e.Source == this || !this.IsSelected)
            { 
                if (this.SetFocus())
                    e.Handled = true;
            }
            HeaderedContentControl.prototype.OnMouseLeftButtonDown.call(this, e); 
        },
 
        /// <summary> 
        /// Focus event handler
        /// </summary> 
        /// <param name="e"></param>
//        protected override void 
        OnPreviewGotKeyboardFocus:function(/*KeyboardFocusChangedEventArgs*/ e)
        {
        	HeaderedContentControl.prototype.OnPreviewGotKeyboardFocus.call(this, e); 
            if (!e.Handled && e.NewFocus == this)
            { 
                if (!this.IsSelected && TabControlParent != null) 
                {
                	this.SetCurrentValueInternal(IsSelectedProperty, true); 
                    // If focus moved in result of selection - handle the event to prevent setting focus back on the new item
                    if (e.OldFocus != Keyboard.FocusedElement)
                    {
                        e.Handled = true; 
                    }
                    else if (this.GetBoolField(BoolField.SetFocusOnContent)) 
                    { 
                        /*TabControl*/var parentTabControl = this.TabControlParent;
                        if (parentTabControl != null) 
                        {
                            // Save the parent and check for null to make sure that SetCurrentValue didn't have a change handler
                            // that removed the TabItem from the tree.
                            /*ContentPresenter*/var selectedContentPresenter = parentTabControl.SelectedContentPresenter; 
                            if (selectedContentPresenter != null)
                            { 
                                parentTabControl.UpdateLayout(); // Wait for layout 
                                var success = selectedContentPresenter.MoveFocus(new TraversalRequest(FocusNavigationDirection.First));
 
                                // If we successfully move focus inside the content then don't set focus to the header
                                if (success)
                                    e.Handled = true;
                            } 
                        }
                    } 
                } 
            }
        }, 

        /// <summary>
        /// The Access key for this control was invoked.
        /// </summary> 
//        protected override void 
        OnAccessKey:function(/*AccessKeyEventArgs*/ e)
        { 
        	this.SetFocus(); 
        },
 
        /// <summary>
        ///     This method is invoked when the Content property changes.
        /// </summary>
        /// <param name="oldContent">The old value of the Content property.</param> 
        /// <param name="newContent">The new value of the Content property.</param>
//        protected override void 
        OnContentChanged:function(/*object*/ oldContent, /*object*/ newContent) 
        { 
        	HeaderedContentControl.prototype.OnContentChanged.call(this, oldContent, newContent);
 
            // If this is the selected TabItem then we should update TabControl.SelectedContent
            if (this.IsSelected)
            {
                var tabControl = this.TabControlParent; 
                if (tabControl != null)
                { 
                    if (newContent == BindingExpressionBase.DisconnectedItem) 
                    {
                        // don't let {DisconnectedItem} bleed into the UI 
                        newContent = null;
                    }

                    tabControl.SelectedContent = newContent; 
                }
            } 
        }, 

        /// <summary> 
        ///     This method is invoked when the ContentTemplate property changes.
        /// </summary>
        /// <param name="oldContentTemplate">The old value of the ContentTemplate property.</param>
        /// <param name="newContentTemplate">The new value of the ContentTemplate property.</param> 
//        protected override void 
        OnContentTemplateChanged:function(/*DataTemplate*/ oldContentTemplate, /*DataTemplate*/ newContentTemplate)
        { 
        	HeaderedContentControl.prototype.OnContentTemplateChanged.call(this, oldContentTemplate, newContentTemplate); 

            // If this is the selected TabItem then we should update TabControl.SelectedContentTemplate 
            if (this.IsSelected)
            {
                var tabControl = this.TabControlParent;
                if (tabControl != null) 
                {
                    tabControl.SelectedContentTemplate = newContentTemplate; 
                } 
            }
        }, 

        /// <summary>
        ///     This method is invoked when the ContentTemplateSelector property changes.
        /// </summary> 
        /// <param name="oldContentTemplateSelector">The old value of the ContentTemplateSelector property.</param>
        /// <param name="newContentTemplateSelector">The new value of the ContentTemplateSelector property.</param> 
//        protected override void 
        OnContentTemplateSelectorChanged:function(/*DataTemplateSelector*/ oldContentTemplateSelector, /*DataTemplateSelector*/ newContentTemplateSelector) 
        {
        	HeaderedContentControl.prototype.OnContentTemplateSelectorChanged.call(this, oldContentTemplateSelector, newContentTemplateSelector); 

            // If this is the selected TabItem then we should update TabControl.SelectedContentTemplateSelector
            if (this.IsSelected)
            { 
                var tabControl = this.TabControlParent;
                if (tabControl != null) 
                { 
                    tabControl.SelectedContentTemplateSelector = newContentTemplateSelector;
                } 
            }
        },
 
//        internal bool 
        SetFocus:function()
        { 
            var returnValue = false; 

            if (!this.GetBoolField(BoolField.SettingFocus)) 
            {
                var currentFocus = Keyboard.FocusedElement instanceof TabItem ? Keyboard.FocusedElement : null;

                // If current focus was another TabItem in the same TabControl - dont set focus on content 
                var setFocusOnContent = ((currentFocus == this) || (currentFocus == null) || (currentFocus.TabControlParent != this.TabControlParent));
                this.SetBoolField(BoolField.SettingFocus, true); 
                this.SetBoolField(BoolField.SetFocusOnContent, setFocusOnContent); 
                try
                { 
                    returnValue = this.Focus() || setFocusOnContent;
                }
                finally
                { 
                	this.SetBoolField(BoolField.SettingFocus, false);
                	this.SetBoolField(BoolField.SetFocusOnContent, false); 
                } 
            }
 
            return returnValue;
        },

//        private bool 
        GetBoolField:function(/*BoolField*/ field) 
        {
            return (this._tabItemBoolFieldStore & field) != 0; 
        }, 

//        private void 
        SetBoolField:function(/*BoolField*/ field, /*bool*/ value) 
        {
            if (value)
            {
            	this._tabItemBoolFieldStore |= field; 
            }
            else 
            { 
            	this._tabItemBoolFieldStore &= (~field);
            } 
        }
	});
	
	Object.defineProperties(TabItem.prototype,{

        /// <summary>
        ///     Indicates whether this TabItem is selected. 
        /// </summary>
//        public bool 
        IsSelected: 
        {
            get:function() { return this.GetValue(TabItem.IsSelectedProperty); }, 
            set:function(value) { this.SetValue(TabItem.IsSelectedProperty, value); }
        },

        /// <summary> 
        /// Specifies the placement of the TabItem. This read-only property get its value from the TabControl parent
        /// </summary> 
//        public Dock 
        TabStripPlacement:
        {
            get:function()
            { 
                return this.GetValue(TabItem.TabStripPlacementProperty);
            } 
        }, 

//        private TabControl 
        TabControlParent: 
        {
            get:function() 
            { 
                var r = ItemsControl.ItemsControlFromItemContainer(this);
                return r instanceof TabControl ? r : null;
            } 
        },

   
//        BoolField 
        _tabItemBoolFieldStore:
        {
        	get:function(){
            	return BoolField.DefaultValue; 
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
	
	Object.defineProperties(TabItem,{
		/// <summary>
        ///     Indicates whether this TabItem is selected. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsSelectedProperty:
        {
        	get:function(){
        		if(TabItem._IsSelectedProperty === undefined){
        			TabItem._IsSelectedProperty  = 
                        Selector.IsSelectedProperty.AddOwner(TabItem.Type, 
                                /*new FrameworkPropertyMetadata(false,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault 
                                        | FrameworkPropertyMetadataOptions.AffectsParentMeasure 
                                        | FrameworkPropertyMetadataOptions.Journal, 
                                        new PropertyChangedCallback(OnIsSelectedChanged))*/
                        		FrameworkPropertyMetadata.Build3PCCB(false,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault 
                                        | FrameworkPropertyMetadataOptions.AffectsParentMeasure 
                                        | FrameworkPropertyMetadataOptions.Journal, 
                                        new PropertyChangedCallback(null, OnIsSelectedChanged)));
        		}
        		
        		return TabItem._IsSelectedProperty;
        	}
        },
 
        /// <summary> 
        ///     Property key for TabStripPlacementProperty.
        /// </summary>
//        private static readonly DependencyPropertyKey 
        TabStripPlacementPropertyKey:
        {
        	get:function(){
        		if(TabItem._TabStripPlacementPropertyKey === undefined){
        			TabItem._TabStripPlacementPropertyKey  =
                        DependencyProperty.RegisterReadOnly( 
                                "TabStripPlacement",
                                Number.Type, 
                                TabItem.Type, 
                                /*new FrameworkPropertyMetadata(
                                        Dock.Top, 
                                        null,
                                        new CoerceValueCallback(null, CoerceTabStripPlacement))*/
                                FrameworkPropertyMetadata.Build3PCCB(Dock.Top, 
                                        null,
                                        new CoerceValueCallback(null, CoerceTabStripPlacement)));
        		}
        		
        		return TabItem._TabStripPlacementPropertyKey;
        	}
        }, 

        /// <summary> 
        /// Specifies the placement of the TabItem
        /// </summary> 
//        public static readonly DependencyProperty 
        TabStripPlacementProperty:
        {
        	get:function(){
//        		if(TabItem._TabStripPlacementProperty === undefined){
//        			TabItem._TabStripPlacementProperty  = 
//        				TabItem.TabStripPlacementPropertyKey.DependencyProperty;
//        		}
        		
//        		return TabItem._TabStripPlacementProperty;
        		return TabItem.TabStripPlacementPropertyKey.DependencyProperty;
        	}
        }		  
	});
	
//	static TabItem() 
	function Initialize(){
		_dType  = DependencyObjectType.FromSystemTypeInternal(TabItem.Type);
//        EventManager.RegisterClassHandler(TabItem.Type, AccessKeyManager.AccessKeyPressedEvent, new AccessKeyPressedEventHandler(OnAccessKeyPressed)); 

        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(TabItem.Type, 
        		/*new FrameworkPropertyMetadata(TabItem.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(TabItem.Type));
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(TabItem.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Contained)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Contained)); 
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(TabItem.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Local)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Local));

        UIElement.IsEnabledProperty.OverrideMetadata(TabItem.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))); 
        UIElement.IsMouseOverPropertyKey.OverrideMetadata(TabItem.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
//        AutomationProperties.IsOffscreenBehaviorProperty.OverrideMetadata(TabItem.Type, new FrameworkPropertyMetadata(IsOffscreenBehavior.FromClip)); 
    };

//    private static void 
    function OnIsSelectedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        var tabItem = d instanceof TabItem ? d : null; 

        var isSelected = e.NewValue;

        /*TabControl*/var parentTabControl = tabItem.TabControlParent;
//        if (parentTabControl != null)
//        {
//            parentTabControl.RaiseIsSelectedChangedAutomationEvent(tabItem, isSelected); 
//        }

        if (isSelected) 
        {
            tabItem.OnSelected(new RoutedEventArgs(Selector.SelectedEvent, tabItem)); 
        }
        else
        {
            tabItem.OnUnselected(new RoutedEventArgs(Selector.UnselectedEvent, tabItem)); 
        }


        // KeyboardNavigation use bounding box reduced with DirectionalNavigationMargin when calculating the next element in directional navigation
        // Because TabItem use negative margins some TabItems overlap which would changes the directional navigation if we don't reduce the bounding box 
        if (isSelected)
        {
        	// cym comment
//            var binding = new Binding("Margin");
//            binding.Source = tabItem; 
//            BindingOperations.SetBinding(tabItem, KeyboardNavigation.DirectionalNavigationMarginProperty, binding);
        } 
        else 
        {
            BindingOperations.ClearBinding(tabItem, KeyboardNavigation.DirectionalNavigationMarginProperty); 
        }

        tabItem.UpdateVisualState();
    }


//    private static object 
    function CoerceTabStripPlacement(/*DependencyObject*/ d, /*object*/ value)
    {
        var tabControl = d.TabControlParent;
        return (tabControl != null) ? tabControl.TabStripPlacement : value; 
    }

//    private static void 
    function OnAccessKeyPressed(/*object*/ sender, /*AccessKeyPressedEventArgs*/ e)
    { 
        if (!e.Handled && e.Scope == null) 
        {
            var tabItem = sender instanceof TabItem ? sender : null; 

            if (e.Target == null)
            {
                e.Target = tabItem; 
            }
            else if (!tabItem.IsSelected) // If TabItem is not active it is a scope for its content elements 
            { 
                e.Scope = tabItem;
                e.Handled = true; 
            }
        }
    }
	
	TabItem.Type = new Type("TabItem", TabItem, [HeaderedContentControl.Type]);
	Initialize();
	
	return TabItem;
});
 
        


