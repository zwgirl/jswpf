/**
 * ListBoxItem
 */

define(["dojo/_base/declare", "system/Type", "controls/ContentControl", "windows/VisualStateManager",
        "controls/VisualStates", "controls/ListBox", "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions",
        "windows/PropertyChangedCallback"], 
		function(declare, Type, ContentControl, VisualStateManager, 
				VisualStates, ListBox, FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions,
				PropertyChangedCallback){
	
//  private static DependencyObjectType 
    var _dType = null;
    	
	var ListBoxItem = declare("ListBoxItem", ContentControl,{
		constructor:function(){

	        this._dom = window.document.createElement("div");
//	        this._dom.style.setProperty("border", "thin dotted #FF0000");
			this._dom._source = this;
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
		/// <summary>
		/// Notification that a specified property has been invalidated 
		/// </summary>
		/// <param name="e">EventArgs that contains the property, metadata, old value, and new value for this change</param>
//		protected sealed override void 
		OnPropertyChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
		{ 
			// Always call base.OnPropertyChanged, otherwise Property Engine will not work.
			FrameworkElement.prototype.OnPropertyChanged.call(this, e); 
			var dp = e.Property;

			if (e.IsAValueChange || e.IsASubPropertyChange)
			{ 
	          	if(dp === Control.BackgroundProperty){
            		if(e.NewValue){
            			this._dom.style.setProperty("background-color",e.NewValue.Color.ToString(),"");
            		}else{
            			this._dom.style.setProperty("background-color","","");
            		}
            		
            	}
	          	
	          	if(dp === Control.ForegroundProperty){
            		if(e.NewValue){
            			if(this._dom)
            				this._dom.style.setProperty("color", e.NewValue.Color.ToString(),"");
            		}else{
            			if(this._dom)
            				this._dom.style.setProperty("color", "red","");
            		}
            		
            	}
	          	
//				if (this.CheckFlags(Flags.FormattedOnce))
//				{
//					var fmetadata = e.Metadata instanceof FrameworkPropertyMetadata ? e.Metadata : null;
//					if (fmetadata != null) 
//					{
//						var affectsRender = (fmetadata.AffectsRender && 
//								(e.IsAValueChange || !fmetadata.SubPropertiesDoNotAffectRender)); 
//
//						if (fmetadata.AffectsMeasure || fmetadata.AffectsArrange || affectsRender) 
//						{
//							// Will throw an exception, if during measure/arrange/render process.
//							this.VerifyTreeIsUnlocked();
//
//							// TextRunCache stores properties for every single run fetched so far.
//							// If there are any property changes, which affect measure, arrange or 
//							// render, invalidate TextRunCache. It will force TextFormatter to refetch 
//							// runs and properties.
//							// _lineProperties = null; 
//							this._textBlockCache = null;
//						}
//					}
//				} 
			}
		}, 
		
		ApplyTemplate:function() {
			ContentControl.prototype.ApplyTemplate.call(this);
		},

////        protected override Size 
//        ArrangeOverride:function()
//        { 
////        	this._dom = parent;
////        	ContentControl.prototype.ArrangeOverride.call(this, parent);
//          	if(this.ArrangeDirty){
//         		this.ArrangeDirty = false;
//         		if(this._parentDom !== parent){
//         			if(this._parentDom){ this._parentDom.removeChild(this._dom); }
//         			parent.appendChild(this._dom);
//         			this._parentDom = parent;
//         		}
////            	this._dom = parent;
//         		ContentControl.prototype.ArrangeOverride.call(this, this._dom);
//        	}
//        },
 
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
        ChangeVisualState:function(/*bool*/ useTransitions)
        {
//            // Change to the correct state in the Interaction group
//            if (!this.IsEnabled) 
//            {
//                // [copied from SL code] 
//                // If our child is a control then we depend on it displaying a proper "disabled" state.  If it is not a control 
//                // (ie TextBlock, Border, etc) then we will use our visuals to show a disabled state.
//                VisualStateManager.GoToState(this, this.Content instanceof Control ? VisualStates.StateNormal : VisualStates.StateDisabled, useTransitions); 
//            }
//            else if (this.IsMouseOver)
//            {
//                VisualStateManager.GoToState(this, VisualStates.StateMouseOver, useTransitions); 
//            }
//            else 
//            { 
//                VisualStateManager.GoToState(this, VisualStates.StateNormal, useTransitions);
//            } 
//
            // Change to the correct state in the Selection group
            if (this.IsSelected)
            { 
                if (Selector.GetIsSelectionActive(this))
                { 
                    VisualStateManager.GoToState(this, VisualStates.StateSelected, useTransitions); 
                }
                else 
                {
                    VisualStates.GoToState(this, useTransitions, VisualStates.StateSelectedUnfocused, VisualStates.StateSelected);
                }
            } 
//            else
//            { 
//                VisualStateManager.GoToState(this, VisualStates.StateUnselected, useTransitions); 
//            }
// 
//            if (this.IsKeyboardFocused)
//            {
//                VisualStateManager.GoToState(this, VisualStates.StateFocused, useTransitions);
//            } 
//            else
//            { 
//                VisualStateManager.GoToState(this, VisualStates.StateUnfocused, useTransitions); 
//            }
 
            ContentControl.prototype.ChangeVisualState.call(this, useTransitions);
        },

        /// <summary> 
        ///     This is the method that responds to the MouseButtonEvent event.
        /// </summary> 
        /// <param name="e">Event arguments</param> 
//        protected override void 
        OnMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e)
        { 
            if (!e.Handled)
            {
                //
                e.Handled = true; 
                this.HandleMouseButtonDown(MouseButton.Left);
            } 
            ContentControl.prototype.OnMouseLeftButtonDown.call(this, e); 
        },
 
        /// <summary>
        ///     This is the method that responds to the MouseButtonEvent event.
        /// </summary>
        /// <param name="e">Event arguments</param> 
//        protected override void 
        OnMouseRightButtonDown:function(/*MouseButtonEventArgs*/ e)
        { 
            if (!e.Handled) 
            {
                // 
                e.Handled = true;
                this.HandleMouseButtonDown(MouseButton.Right);
            }
            ContentControl.prototype.OnMouseRightButtonDown.call(e); 
        },
 
//        private void 
        HandleMouseButtonDown:function(/*MouseButton*/ mouseButton) 
        {
            if (Selector.UiGetIsSelectable(this) && this.Focus()) 
            {
                /*ListBox*/var parent = this.ParentListBox;
                if (parent != null)
                { 
                    parent.NotifyListItemClicked(this, mouseButton);
                } 
            } 
        },
 
        /// <summary>
        /// Called when IsMouseOver changes on this element.
        /// </summary>
        /// <param name="e"></param> 
//        protected override void 
        OnMouseEnter:function(/*MouseEventArgs*/ e)
        { 
//            // abort any drag operation we have queued. 
//            if (parentNotifyDraggedOperation != null)
//            { 
//                parentNotifyDraggedOperation.Abort();
//                parentNotifyDraggedOperation = null;
//            }
 
            if (this.IsMouseOver)
            { 
                var parent = this.ParentListBox; 

                if (parent != null && Mouse.LeftButton == MouseButtonState.Pressed) 
                {
                    parent.NotifyListItemMouseDragged(this);
                }
            } 
            ContentControl.prototype.OnMouseEnter.call(this, e);
        }, 
 
        /// <summary>
        /// Called when IsMouseOver changes on this element. 
        /// </summary>
        /// <param name="e"></param>
//        protected override void 
        OnMouseLeave:function(/*MouseEventArgs*/ e)
        { 
//            // abort any drag operation we have queued.
//            if (parentNotifyDraggedOperation != null) 
//            { 
//                parentNotifyDraggedOperation.Abort();
//                parentNotifyDraggedOperation = null; 
//            }

            ContentControl.prototype.OnMouseLeave.call(this, e);
        }, 

        /// <summary> 
        /// Called when the visual parent of this element changes. 
        /// </summary>
        /// <param name="oldParent"></param> 
//        protected internal override void 
        OnVisualParentChanged:function(/*DependencyObject*/ oldParent)
        {
            /*ItemsControl*/var oldItemsControl = null;
 
            if (VisualTreeHelper.GetParent(this) == null)
            { 
                if (this.IsKeyboardFocusWithin) 
                {
                    // This ListBoxItem had focus but was removed from the tree. 
                    // The normal behavior is for focus to become null, but we would rather that
                    // focus go to the parent ListBox.

                    // Use the oldParent to get a reference to the ListBox that this ListBoxItem used to be in. 
                    // The oldParent's ItemsOwner should be the ListBox.
                    oldItemsControl = ItemsControl.GetItemsOwner(oldParent); 
                } 
            }
 
            ContentControl.prototype.OnVisualParentChanged.call(this, oldParent);

            // If earlier, we decided to set focus to the old parent ListBox, do it here
            // after calling base so that the state for IsKeyboardFocusWithin is updated correctly. 
            if (oldItemsControl != null)
            { 
                oldItemsControl.Focus(); 
            }
        },
        
        /// <summary>
        ///     Raised when the item's IsSelected property becomes true.
        /// </summary>
//        public event RoutedEventHandler 
        AddSelectedHandler:function(value){
        	this.AddHandler(ListBoxItem.SelectedEvent, value);
        },
        
        RemoveSelectedHandler:function(value){
        	this.RemoveHandler(ListBoxItem.SelectedEvent, value);
        },
        
        AddUnselectedHandler:function(value){
        	this.AddHandler(ListBoxItem.UnselectedEvent, value);
        },
        
        RemoveUnselectedHandler:function(value){
        	this.RemoveHandler(ListBoxItem.UnselectedEvent, value);
        }
	});
	
	Object.defineProperties(ListBoxItem.prototype,{
 
        /// <summary>
        ///     Indicates whether this ListBoxItem is selected. 
        /// </summary>
//        public bool 
        IsSelected:
        { 
            get:function() { return this.GetValue(ListBoxItem.IsSelectedProperty); },
            set:function(value) { this.SetValue(ListBoxItem.IsSelectedProperty, value); } 
        },
 
   

//        private ListBox 
        ParentListBox: 
        {
            get:function() 
            { 
                return this.ParentSelector instanceof ListBox ? this.ParentSelector : null;
            } 
        },

//        internal Selector 
        ParentSelector:
        { 
            get:function()
            { 
                var r = ItemsControl.ItemsControlFromItemContainer(this);
                return r instanceof Selector ? r : null; 
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
	
	Object.defineProperties(ListBoxItem,{
 
        /// <summary>
        ///     Indicates whether this ListBoxItem is selected. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsSelectedProperty:
        {
        	get:function(){
        		if(ListBoxItem._IsSelectedProperty === undefined){
        			ListBoxItem._IsSelectedProperty =
                        Selector.IsSelectedProperty.AddOwner(ListBoxItem.Type,
                                /*new FrameworkPropertyMetadata(false, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal,
                                        new PropertyChangedCallback(OnIsSelectedChanged))*/
                        		FrameworkPropertyMetadata.Build3PCCB(false, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal,
                                        new PropertyChangedCallback(null, OnIsSelectedChanged)));
        		}
        		
        		return ListBoxItem._IsSelectedProperty;
        	}
        }, 
 
        /// <summary>
        ///     Raised when the item's IsSelected property becomes true. 
        /// </summary> 
//        public static readonly RoutedEvent 
        SelectedEvent:
        {
        	get:function(){
        		if(ListBoxItem._SelectedEvent === undefined){
        			ListBoxItem._SelectedEvent = Selector.SelectedEvent.AddOwner(ListBoxItem.Type);
        		}
        		
        		return ListBoxItem._SelectedEvent;
        	}
        }, 
 
        /// <summary> 
        ///     Raised when the item's IsSelected property becomes false.
        /// </summary> 
//        public static readonly RoutedEvent 
        UnselectedEvent:
        {
        	get:function(){
        		if(ListBoxItem._UnselectedEvent === undefined){
        			ListBoxItem._UnselectedEvent = Selector.UnselectedEvent.AddOwner(ListBoxItem.Type);
        		}
        		
        		return ListBoxItem._UnselectedEvent;
        	}
        }, 

        // left here for reference only as it is still used by MonthCalendar
        /// <summary> 
        /// DependencyProperty for SelectionContainer property. 
        /// </summary>
//        internal static readonly DependencyProperty 
        SelectionContainerProperty:
        {
        	get:function(){
        		if(ListBoxItem._SelectionContainerProperty === undefined){
        			ListBoxItem._SelectionContainerProperty = DependencyProperty.RegisterAttached("SelectionContainer", UIElement.Type, ListBoxItem.Type,
        		            new FrameworkPropertyMetadata(null));
        		}
        		
        		return ListBoxItem._SelectionContainerProperty;
        	}
        }, 
	});
	

//    private static void 
    function OnIsSelectedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        /*ListBoxItem*/var listItem = d instanceof ListBoxItem ? d: null;
        var isSelected = e.NewValue;

//        /*Selector*/var parentSelector = listItem.ParentSelector;
//        if (parentSelector != null) 
//        { 
//            parentSelector.RaiseIsSelectedChangedAutomationEvent(listItem, isSelected);
//        } 

        if (isSelected)
        {
            listItem.OnSelected(new RoutedEventArgs(Selector.SelectedEvent, listItem)); 
        }
        else 
        { 
            listItem.OnUnselected(new RoutedEventArgs(Selector.UnselectedEvent, listItem));
        } 

        listItem.UpdateVisualState();
    }
    
//	static ListBoxItem()
    function Initialize()
    { 
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(ListBoxItem.Type, 
        		/*new FrameworkPropertyMetadata(ListBoxItem.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(ListBoxItem.Type));
        
        _dType = DependencyObjectType.FromSystemTypeInternal(ListBoxItem.Type); 
        
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(ListBoxItem.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Once)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Once)); 
        
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(ListBoxItem.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Local)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Local));

        UIElement.IsEnabledProperty.OverrideMetadata(ListBoxItem.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
        
        UIElement.IsMouseOverPropertyKey.OverrideMetadata(ListBoxItem.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
        
        Selector.IsSelectionActivePropertyKey.OverrideMetadata(ListBoxItem.Type, 
        		/*new FrameworkPropertyMetadata(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))*/
        		FrameworkPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
//        AutomationProperties.IsOffscreenBehaviorProperty.OverrideMetadata(ListBoxItem.Type, 
//        		/*new FrameworkPropertyMetadata(IsOffscreenBehavior.FromClip)*/
//        		FrameworkPropertyMetadata.BuildWithDV(IsOffscreenBehavior.FromClip)); 
    };
	
	ListBoxItem.Type = new Type("ListBoxItem", ListBoxItem, [ContentControl.Type]);
	Initialize();
	
	return ListBoxItem;
});
 

        


