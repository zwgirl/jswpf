/**
 * TabControl
 */

define(["dojo/_base/declare", "system/Type", "primitives/Selector", "input/KeyboardNavigation",
        "windows/DependencyObjectType", "windows/FrameworkElement", "windows/FrameworkPropertyMetadata",
        "controls/Control", "windows/UIElement", "windows/UIPropertyMetadata", "specialized/NotifyCollectionChangedAction",
        "controls/ItemContainerGenerator", "system/EventHandler", "input/ModifierKeys", "media/VisualTreeHelper",
        "input/Key", "controls/DockPanel", "windows/DataTemplate", "controls/TabItem"], 
		function(declare, Type, Selector, KeyboardNavigation,
				DependencyObjectType, FrameworkElement, FrameworkPropertyMetadata,
				Control, UIElement, UIPropertyMetadata, NotifyCollectionChangedAction,
				ItemContainerGenerator, EventHandler, ModifierKeys, VisualTreeHelper,
				Key, DockPanel, DataTemplate, TabItem){
	
//	private static DependencyObjectType 
    var _dType = null;
	   // Part name used in the style. The class TemplatePartAttribute should use the same name 
//    private const string 
    var SelectedContentHostTemplateName = "PART_SelectedContentHost";
    
	var TabControl = declare("TabControl", Selector,{
		constructor:function(){
			
			this._dom = window.document.createElement('div');
			this._dom._source = this;
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
      
//        internal override void 
        ChangeVisualState:function(/*bool*/ useTransitions) 
        {
            if (!this.IsEnabled) 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateDisabled, VisualStates.StateNormal);
            }
            else 
            {
                VisualStateManager.GoToState(this, VisualStates.StateNormal, useTransitions); 
            } 

            Selector.prototype.ChangeVisualState.call(this, useTransitions); 
        },

        /// <summary>
        ///     This virtual method in called when IsInitialized is set to true and it raises an Initialized event
        /// </summary> 
//        protected override void 
        OnInitialized:function(/*EventArgs*/ e)
        { 
        	Selector.prototype.OnInitialized.call(this, e); 
            this.CanSelectMultiple = false;
            this.ItemContainerGenerator.StatusChanged.Combine(new EventHandler(this, this.OnGeneratorStatusChanged)); 
        },
        /// <summary>
        /// Called when the Template's tree has been generated. When Template gets expanded we ensure that SelectedContent is in [....]
        /// </summary> 
//        public override void 
        OnApplyTemplate:function()
        { 
        	Selector.prototype.OnApplyTemplate.call(this); 
            this.UpdateSelectedContent();
        },

        /// <summary>
        /// A virtual function that is called when the selection is changed. Default behavior
        /// is to raise a SelectionChangedEvent 
        /// </summary>
        /// <param name="e">The inputs for this event. Can be raised (default behavior) or processed 
        ///   in some other way.</param> 
//        protected override void 
        OnSelectionChanged:function(/*SelectionChangedEventArgs*/ e)
        { 
        	Selector.prototype.OnSelectionChanged.call(this, e);
            if (this.IsKeyboardFocusWithin)
            {
                // If keyboard focus is within the control, make sure it is going to the correct place 
                /*TabItem*/var item = this.GetSelectedTabItem();
                if (item != null) 
                { 
                    item.SetFocus();
                } 
            }
            this.UpdateSelectedContent();

        }, 

        /// <summary> 
        /// Updates the current selection when Items has changed 
        /// </summary>
        /// <param name="e">Information about what has changed</param> 
//        protected override void 
        OnItemsChanged:function(/*NotifyCollectionChangedEventArgs*/ e)
        {
        	Selector.prototype.OnItemsChanged.call(this, e);
            if (e.Action == NotifyCollectionChangedAction.Remove && this.SelectedIndex == -1) 
            {
                // If we remove the selected item we should select the previous item 
                var startIndex = e.OldStartingIndex + 1; 
                if (startIndex > this.Items.Count)
                    startIndex = 0; 
                /*TabItem*/var nextTabItem = this.FindNextTabItem(startIndex, -1);
                if (nextTabItem != null)
                    nextTabItem.SetCurrentValueInternal(TabItem.IsSelectedProperty, true);
            } 
        },
 
        /// <summary> 
        /// This is the method that responds to the KeyDown event.
        /// </summary> 
        /// <param name="e"></param>
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e)
        {
            /*TabItem*/var nextTabItem = null; 

            // Handle [Ctrl][Shift]Tab, Home and End cases 
            // We have special handling here because if focus is inside the TabItem content we cannot 
            // cycle through TabItem because the content is not part of the TabItem visual tree
 
            var direction = 0;
            var startIndex = -1;
            switch (e.Key)
            { 
                case Key.Tab:
                    if ((e.KeyboardDevice.Modifiers & ModifierKeys.Control) == ModifierKeys.Control) 
                    { 
                        startIndex = ItemContainerGenerator.IndexFromContainer(ItemContainerGenerator.ContainerFromItem(this.SelectedItem));
                        if ((e.KeyboardDevice.Modifiers & ModifierKeys.Shift) == ModifierKeys.Shift) 
                            direction = -1;
                        else
                            direction = 1;
                    } 
                    break;
                case Key.Home: 
                    direction = 1; 
                    startIndex = -1;
                    break; 
                case Key.End:
                    direction = -1;
                    startIndex = Items.Count;
                    break; 
            }
 
            nextTabItem = this.FindNextTabItem(startIndex, direction); 

            if (nextTabItem != null && nextTabItem != this.SelectedItem) 
            {
                e.Handled = nextTabItem.SetFocus();
                
//                nextTabItem.IsSelected = true;   // cym add
            }
 
            if (!e.Handled)
            	Selector.prototype.OnKeyDown.call(this, e); 
        }, 

//        private TabItem 
        FindNextTabItem:function(/*int*/ startIndex, /*int*/ direction) 
        {
            /*TabItem*/var nextTabItem = null;
            if (direction != 0)
            { 
            	var index = startIndex;
                for (var i = 0; i < this.Items.Count; i++) 
                { 
                    index += direction;
                    if (index >= this.Items.Count) 
                        index = 0;
                    else if (index < 0)
                        index = this.Items.Count - 1;
 
                    /*TabItem*/var tabItem = ItemContainerGenerator.ContainerFromIndex(index);
                    tabItem = tabItem instanceof TabItem ? tabItem : null;
                    if (tabItem != null && tabItem.IsEnabled && tabItem.Visibility == Visibility.Visible) 
                    { 
                        nextTabItem = tabItem;
                        break; 
                    }
                }
            }
            return nextTabItem; 
        },
 
        /// <summary> 
        /// Return true if the item is (or is eligible to be) its own ItemUI
        /// </summary> 
//        protected override bool 
        IsItemItsOwnContainerOverride:function(/*object*/ item)
        {
            return (item instanceof TabItem);
        }, 

        /// <summary> Create or identify the element used to display the given item. </summary> 
//        protected override DependencyObject 
        GetContainerForItemOverride:function() 
        {
            return new TabItem(); 
        },

//        private void 
        OnGeneratorStatusChanged:function(/*object*/ sender, /*EventArgs*/ e) 
        { 
            if (this.ItemContainerGenerator.Status == GeneratorStatus.ContainersGenerated)
            { 
                if (this.HasItems && this._selectedItems.Count == 0)
                {
                	this.SetCurrentValueInternal(Selector.SelectedIndexProperty, 0);
                } 

                this.UpdateSelectedContent(); 
            } 
        },
 
//        private TabItem 
        GetSelectedTabItem:function()
        {
            var selectedItem = this.SelectedItem;
            if (selectedItem != null) 
            {
                // Check if the selected item is a TabItem 
                /*TabItem*/var tabItem = selectedItem;
                tabItem = tabItem instanceof TabItem ? tabItem : null; 
                if (tabItem == null)
                { 
                    // It is a data item, get its TabItem container
                    tabItem = this.ItemContainerGenerator.ContainerFromIndex(this.SelectedIndex);
                    tabItem = tabItem instanceof TabItem ? tabItem : null;

                    // Due to event leapfrogging, we may have the wrong container. 
                    // If so, re-fetch the right container using a more expensive method.
                    // (BTW, the previous line will cause a debug assert in this case)  [Dev10 452711] 
                    if (tabItem == null || 
                        !Object.Equals(selectedItem, this.ItemContainerGenerator.ItemFromContainer(tabItem)))
                    { 
                        tabItem = this.ItemContainerGenerator.ContainerFromItem(selectedItem);
                        tabItem = tabItem instanceof TabItem ? tabItem : null;
                    }
                }
 
                return tabItem;
            } 
 
            return null;
        }, 

        // When selection is changed we need to copy the active TabItem content in SelectedContent property
        // SelectedContent is aliased in the TabControl style
//        private void 
        UpdateSelectedContent:function() 
        {
            if (this.SelectedIndex < 0) 
            { 
                this.SelectedContent = null;
                this.SelectedContentTemplate = null; 
                this.SelectedContentTemplateSelector = null;
                this.SelectedContentStringFormat = null;
                return;
            } 

            /*TabItem*/var tabItem = this.GetSelectedTabItem(); 
            if (tabItem != null) 
            {
                /*FrameworkElement*/var visualParent = VisualTreeHelper.GetParent(tabItem);
                visualParent = visualParent instanceof FrameworkElement ? visualParent : null; 

                if (visualParent != null)
                {
                    KeyboardNavigation.SetTabOnceActiveElement(visualParent, tabItem); 
                    KeyboardNavigation.SetTabOnceActiveElement(this, visualParent);
                } 
 
                this.SelectedContent = tabItem.Content;
                /*ContentPresenter*/var scp = this.SelectedContentPresenter; 
                if (scp != null)
                {
                    scp.HorizontalAlignment = tabItem.HorizontalContentAlignment;
                    scp.VerticalAlignment = tabItem.VerticalContentAlignment; 
                }
 
                // Use tabItem's template or selector if specified, otherwise use TabControl's 
                if (tabItem.ContentTemplate != null || tabItem.ContentTemplateSelector != null || tabItem.ContentStringFormat != null)
                { 
                	this.SelectedContentTemplate = tabItem.ContentTemplate;
                	this.SelectedContentTemplateSelector = tabItem.ContentTemplateSelector;
                	this.SelectedContentStringFormat = tabItem.ContentStringFormat;
                } 
                else
                { 
                	this.SelectedContentTemplate = this.ContentTemplate; 
                	this.SelectedContentTemplateSelector = this.ContentTemplateSelector;
                	this.SelectedContentStringFormat = this.ContentStringFormat; 
                }
             }
        }
	});
	
	Object.defineProperties(TabControl.prototype,{

        /// <summary>
        ///     TabStripPlacement specify how tab headers align relatively to content 
        /// </summary> 
//        public Dock 
        TabStripPlacement: 
        {
            get:function()
            {
                return this.GetValue(TabControl.TabStripPlacementProperty); 
            },
            set:function(value) 
            { 
            	this.SetValue(TabControl.TabStripPlacementProperty, value);
            } 
        },

        /// <summary>
        ///     SelectedContent is the Content of current SelectedItem. 
        /// This property is updated whenever the selection is changed.
        /// It always keeps a reference to active TabItem.Content 
        /// Used for aliasing in default TabControl Style 
        /// </summary>
//        public object 
        SelectedContent:
        {
            get:function()
            { 
                return this.GetValue(TabControl.SelectedContentProperty);
            },
            /*internal*/ set:function(value) 
            {
            	this.SetValue(TabControl.SelectedContentPropertyKey, value); 
            }
        },

        /// <summary> 
        ///     SelectedContentTemplate is the ContentTemplate of current SelectedItem.
        /// This property is updated whenever the selection is changed. 
        /// It always keeps a reference to active TabItem.ContentTemplate 
        /// It is used for aliasing in default TabControl Style
        /// </summary> 
        /// <value></value>
//        public DataTemplate 
        SelectedContentTemplate:
        { 
            get:function()
            { 
                return this.GetValue(TabControl.SelectedContentTemplateProperty); 
            },
            /*internal*/ set:function(value) 
            {
            	this.SetValue(TabControl.SelectedContentTemplatePropertyKey, value);
            }
        }, 

        /// <summary> 
        ///     SelectedContentTemplateSelector allows the app writer to provide custom style selection logic. 
        /// </summary>
//        public DataTemplateSelector 
        SelectedContentTemplateSelector:
        {
            get:function()
            { 
                return this.GetValue(TabControl.SelectedContentTemplateSelectorProperty);
            }, 
            /*internal*/ set:function(value) 
            {
            	this.SetValue(TabControl.SelectedContentTemplateSelectorPropertyKey, value); 
            }
        },
 
        /// <summary>
        ///     ContentStringFormat is the format used to display the content of
        ///     the control as a string.  This arises only when no template is
        ///     available. 
        /// </summary>
//        public String 
        SelectedContentStringFormat: 
        { 
            get:function() { return this.GetValue(TabControl.SelectedContentStringFormatProperty); },
            /*internal*/ set:function(value)  { this.SetValue(TabControl.SelectedContentStringFormatPropertyKey, value); } 
        },

        /// <summary>
        /// ContentTemplate is the ContentTemplate to apply to TabItems
        /// that do not have the ContentTemplate or ContentTemplateSelector properties 
        /// defined
        /// </summary> 
        /// <value></value> 
//        public DataTemplate 
        ContentTemplate:
        { 
            get:function()
            {
                return this.GetValue(TabControl.ContentTemplateProperty);
            }, 
            set:function(value) 
            { 
            	this.SetValue(TabControl.ContentTemplateProperty, value); 
            }
        },

        /// <summary> 
        ///     ContentTemplateSelector allows the app writer to provide custom style selection logic.
        /// </summary>
//        public DataTemplateSelector 
        ContentTemplateSelector:
        { 
            get:function()
            { 
                return this.GetValue(TabControl.ContentTemplateSelectorProperty); 
            },
            set:function(value)  
            {
            	this.SetValue(TabControl.ContentTemplateSelectorProperty, value);
            }
        }, 
        /// <summary>
        ///     ContentStringFormat is the format used to display the content of
        ///     the control as a string.  This arises only when no template is
        ///     available. 
        /// </summary>
//        public String 
        ContentStringFormat: 
        { 
            get:function() { return this.GetValue(TabControl.ContentStringFormatProperty); },
            set:function(value)  { this.SetValue(TabControl.ContentStringFormatProperty, value); } 
        },
 
 
//        internal ContentPresenter 
        SelectedContentPresenter: 
        {
            get:function() 
            {
                var r= this.GetTemplateChild(SelectedContentHostTemplateName);
                return r = r instanceof ContentPresenter ? r : null;
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
	
	Object.defineProperties(TabControl,{

        /// <summary> 
        ///     The DependencyProperty for the TabStripPlacement property.
        ///     Flags:              None 
        ///     Default Value:      Dock.Top 
        /// </summary>
//        public static readonly DependencyProperty 
        TabStripPlacementProperty:
        {
        	get:function(){
        		if(TabControl._TabStripPlacementProperty === undefined){
        			TabControl._TabStripPlacementProperty = 
                        DependencyProperty.Register(
                                "TabStripPlacement",
                                Number.Type,
                                TabControl.Type, 
                                /*new FrameworkPropertyMetadata(
                                        Dock.Top, 
                                        new PropertyChangedCallback(OnTabStripPlacementPropertyChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(Dock.Top, 
                                        new PropertyChangedCallback(null, OnTabStripPlacementPropertyChanged)),
                                new ValidateValueCallback(null, DockPanel.IsValidDock));
        		}
        		
        		return TabControl._TabStripPlacementProperty;
        	}
        },
 

//        private static readonly DependencyPropertyKey 
        SelectedContentPropertyKey:
        {
        	get:function(){
//        		if(TabControl._SelectedContentPropertyKey === undefined){
//        			TabControl._SelectedContentPropertyKey = DependencyProperty.RegisterReadOnly("SelectedContent", 
//        					Object.Type, TabControl.Type, 
//        					/*new FrameworkPropertyMetadata(null)*/
//        					FrameworkPropertyMetadata.BuildWithDV(null));
//        		}
        		
        		return TabControl._SelectedContentPropertyKey;
        	}
        }, 
 
        /// <summary>
        ///     The DependencyProperty for the SelectedContent property. 
        ///     Flags:              None 
        ///     Default Value:      null
        /// </summary> 
//        public static readonly DependencyProperty 
        SelectedContentProperty:
        {
        	get:function(){
//        		if(TabControl._SelectedContentProperty === undefined){
//        			TabControl._SelectedContentProperty = TabControl.SelectedContentPropertyKey.DependencyProperty;
//        		}
//        		
//        		return TabControl._SelectedContentProperty;
        		
        		return TabControl.SelectedContentPropertyKey.DependencyProperty;
        	}
        }, 

//        private static readonly DependencyPropertyKey 
        SelectedContentTemplatePropertyKey:
        {
        	get:function(){
//        		if(TabControl._SelectedContentTemplatePropertyKey === undefined){
//        			TabControl._SelectedContentTemplatePropertyKey = DependencyProperty.RegisterReadOnly("SelectedContentTemplate", 
//        					DataTemplate.Type, 
//        	        		TabControl.Type, 
//        	        		/*new FrameworkPropertyMetadata((DataTemplate)null)*/
//        	        		FrameworkPropertyMetadata.BuildWithDV(null));
//        		}
        		
        		return TabControl._SelectedContentTemplatePropertyKey;
        	}
        },  

        /// <summary> 
        ///     The DependencyProperty for the SelectedContentTemplate property. 
        ///     Flags:              None
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        SelectedContentTemplateProperty:
        {
        	get:function(){
//        		if(TabControl._SelectedContentTemplateProperty === undefined){
//        			TabControl._SelectedContentTemplateProperty = SelectedContentTemplatePropertyKey.DependencyProperty;
//        		}
//        		
//        		return TabControl._SelectedContentTemplateProperty;
        		
        		return TabControl.SelectedContentTemplatePropertyKey.DependencyProperty;
        	}
        }, 

//        private static readonly DependencyPropertyKey 
        SelectedContentTemplateSelectorPropertyKey:
        {
        	get:function(){
//        		if(TabControl._SelectedContentTemplateSelectorPropertyKey === undefined){
//        			TabControl._SelectedContentTemplateSelectorPropertyKey = DependencyProperty.RegisterReadOnly("SelectedContentTemplateSelector", 
//        					DataTemplateSelector.Type, TabControl.Type, 
//        	        		/*new FrameworkPropertyMetadata((DataTemplateSelector)null)*/
//        					FrameworkPropertyMetadata.BuildWithDV(null));
//        		}
        		
        		return TabControl._SelectedContentTemplateSelectorPropertyKey;
        	}
        },  
 
        /// <summary>
        ///     The DependencyProperty for the SelectedContentTemplateSelector property. 
        ///     Flags:              None
        ///     Default Value:      null
        /// </summary>
//        public static readonly DependencyProperty 
        SelectedContentTemplateSelectorProperty:
        {
        	get:function(){
//        		if(TabControl._SelectedContentTemplateSelectorProperty === undefined){
//        			TabControl._SelectedContentTemplateSelectorProperty = SelectedContentTemplateSelectorPropertyKey.DependencyProperty; 
//        		}
//        		
//        		return TabControl._SelectedContentTemplateSelectorProperty;
        		
        		return TabControl.SelectedContentTemplateSelectorPropertyKey.DependencyProperty;
        	}
        }, 


//        private static readonly DependencyPropertyKey 
        SelectedContentStringFormatPropertyKey:
        {
        	get:function(){
//        		if(TabControl._SelectedContentStringFormatPropertyKey === undefined){
//        			TabControl._SelectedContentStringFormatPropertyKey  = 
//                        DependencyProperty.RegisterReadOnly("SelectedContentStringFormat",
//                                String.Type, 
//                                TabControl.Type, 
//                                /*new FrameworkPropertyMetadata((String)null)*/
//                                FrameworkPropertyMetadata.BuildWithDV(null));
//        		}
        		
        		return TabControl._SelectedContentStringFormatPropertyKey;
        	}
        },
 
        /// <summary>
        ///     The DependencyProperty for the SelectedContentStringFormat property.
        ///     Flags:              None
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        SelectedContentStringFormatProperty:
        {
        	get:function(){
//        		if(TabControl._SelectedContentStringFormatProperty === undefined){
//        			TabControl._SelectedContentStringFormatProperty = 
//                        SelectedContentStringFormatPropertyKey.DependencyProperty; 
//        		}
//        		
//        		return TabControl._SelectedContentStringFormatProperty;
        		
        		return TabControl.SelectedContentStringFormatPropertyKey.DependencyProperty; 
        	}
        }, 

        /// <summary> 
        ///     The DependencyProperty for the ContentTemplate property.
        ///     Flags:              None 
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        ContentTemplateProperty:
        {
        	get:function(){
//        		if(TabControl._ContentTemplateProperty === undefined){
//        			TabControl._ContentTemplateProperty = DependencyProperty.Register("ContentTemplate", DataTemplate.Type, 
//        	        		TabControl.Type, 
//        	        		/*new FrameworkPropertyMetadata((DataTemplate)null)*/
//        	        		FrameworkPropertyMetadata.BuildWithDV(null));
//        		}
        		
        		return TabControl._ContentTemplateProperty;
        	}
        },  

        /// <summary>
        ///     The DependencyProperty for the ContentTemplateSelector property.
        ///     Flags:              None 
        ///     Default Value:      null
        /// </summary> 
//        public static readonly DependencyProperty 
        ContentTemplateSelectorProperty:
        {
        	get:function(){
//        		if(TabControl._ContentTemplateSelectorProperty === undefined){
//        			TabControl._ContentTemplateSelectorProperty = DependencyProperty.Register("ContentTemplateSelector", 
//        					DataTemplateSelector.Type, TabControl.Type, 
//        	        		/*new FrameworkPropertyMetadata((DataTemplateSelector)null)*/
//        					FrameworkPropertyMetadata.BuildWithDV(null));
//        		}
        		
        		return TabControl._ContentTemplateSelectorProperty;
        	}
        },  

        /// <summary> 
        ///     The DependencyProperty for the ContentStringFormat property. 
        ///     Flags:              None
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        ContentStringFormatProperty:
        {
        	get:function(){
//        		if(TabControl._ContentStringFormatProperty === undefined){
//        			TabControl._ContentStringFormatProperty =
//                        DependencyProperty.Register(
//                                "ContentStringFormat", 
//                                String.Type,
//                                TabControl.Type, 
//                                /*new FrameworkPropertyMetadata((String) null)*/
//                                FrameworkPropertyMetadata.BuildWithDV(null)); 
//        		}
        		
        		return TabControl._ContentStringFormatProperty;
        	}
        }
	});
	
//	static TabControl() 
	function Initialize()
    { 
		_dType = DependencyObjectType.FromSystemTypeInternal(TabControl.Type); 
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(TabControl.Type, 
        		/*new FrameworkPropertyMetadata(TabControl.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(TabControl.Type));
        Control.IsTabStopProperty.OverrideMetadata(TabControl.Type, 
        		/*new FrameworkPropertyMetadata(false)*/
        		FrameworkPropertyMetadata.BuildWithDV(false));
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(TabControl.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Contained)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Contained));

        UIElement.IsEnabledProperty.OverrideMetadata(TabControl.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))); 
    };

    // When TabControl TabStripPlacement is changing we need to invalidate its TabItem TabStripPlacement
//    private static void 
    function OnTabStripPlacementPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        TabControl tc = (TabControl)d; 
        /*ItemCollection*/var  tabItemCollection = d.Items;
        for (var i = 0; i < tabItemCollection.Count; i++) 
        { 
            /*TabItem*/var ti = d.ItemContainerGenerator.ContainerFromIndex(i);
            ti = ti instanceof TabItem ? ti : null;
            if (ti != null) 
                ti.CoerceValue(TabItem.TabStripPlacementProperty);
        }
    }
    
    function RegisterDependencyProperties(){
    	TabControl._SelectedContentPropertyKey = DependencyProperty.RegisterReadOnly("SelectedContent", 
				Object.Type, TabControl.Type, 
				/*new FrameworkPropertyMetadata(null)*/
				FrameworkPropertyMetadata.BuildWithDV(null));
    	
    	TabControl._SelectedContentTemplatePropertyKey = DependencyProperty.RegisterReadOnly("SelectedContentTemplate", 
				DataTemplate.Type, 
        		TabControl.Type, 
        		/*new FrameworkPropertyMetadata((DataTemplate)null)*/
        		FrameworkPropertyMetadata.BuildWithDV(null));
    	
    	TabControl._SelectedContentTemplateSelectorPropertyKey = DependencyProperty.RegisterReadOnly("SelectedContentTemplateSelector", 
				DataTemplateSelector.Type, TabControl.Type, 
        		/*new FrameworkPropertyMetadata((DataTemplateSelector)null)*/
				FrameworkPropertyMetadata.BuildWithDV(null));
    	
    	TabControl._SelectedContentStringFormatPropertyKey  = 
            DependencyProperty.RegisterReadOnly("SelectedContentStringFormat",
                    String.Type, 
                    TabControl.Type, 
                    /*new FrameworkPropertyMetadata((String)null)*/
                    FrameworkPropertyMetadata.BuildWithDV(null));
    	
    	TabControl._ContentTemplateProperty = DependencyProperty.Register("ContentTemplate", DataTemplate.Type, 
        		TabControl.Type, 
        		/*new FrameworkPropertyMetadata((DataTemplate)null)*/
        		FrameworkPropertyMetadata.BuildWithDV(null));
    	
    	TabControl._ContentTemplateSelectorProperty = DependencyProperty.Register("ContentTemplateSelector", 
				DataTemplateSelector.Type, TabControl.Type, 
        		/*new FrameworkPropertyMetadata((DataTemplateSelector)null)*/
				FrameworkPropertyMetadata.BuildWithDV(null));
    	
    	TabControl._ContentStringFormatProperty =
            DependencyProperty.Register(
                    "ContentStringFormat", 
                    String.Type,
                    TabControl.Type, 
                    /*new FrameworkPropertyMetadata((String) null)*/
                    FrameworkPropertyMetadata.BuildWithDV(null)); 
    }
  
	
	TabControl.Type = new Type("TabControl", TabControl, [Selector.Type]);
	Initialize();
	RegisterDependencyProperties();
	
	return TabControl;
});

        

