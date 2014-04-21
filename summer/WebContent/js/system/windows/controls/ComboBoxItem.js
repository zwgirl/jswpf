/**
 * ComboBoxItem
 */

define(["dojo/_base/declare", "system/Type", "controls/ListBoxItem", "media/VisualFlags", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata", "windows/UIElement"], 
		function(declare, Type, ListBoxItem, VisualFlags, DependencyProperty,
				FrameworkPropertyMetadata, UIElement){
//  private static DependencyObjectType 
    var _dType = null;
	var ComboBoxItem = declare("ComboBoxItem", ListBoxItem,{
		constructor:function(){
			this._dom.id = "ComboBoxItem";
		},

        /// <summary>
        ///     This is the method that responds to the MouseButtonEvent event. 
        /// </summary>
        /// <param name="e">Event arguments</param> 
//        protected override void 
		OnMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e) 
        {
            e.Handled = true; 

            var parent = this.ParentComboBox;

            if (parent != null) 
            {
                parent.NotifyComboBoxItemMouseDown(this); 
            } 

            ListBoxItem.prototype.OnMouseLeftButtonDown.call(this, e); 
        },

        /// <summary>
        /// 
        /// </summary>
        /// <param name="e"></param> 
//        protected override void 
		OnMouseLeftButtonUp:function(/*MouseButtonEventArgs*/ e) 
        {
            e.Handled = true; 

            var parent = this.ParentComboBox;

            if (parent != null) 
            {
                parent.NotifyComboBoxItemMouseUp(this); 
            } 

            ListBoxItem.prototype.OnMouseLeftButtonUp.call(this, e); 
        },

        /// <summary>
        /// 
        /// </summary>
        /// <param name="e"></param> 
//        protected override void 
		OnMouseEnter:function(/*MouseEventArgs*/ e) 
        {
            e.Handled = true; 

            var parent = this.ParentComboBox;

            if (parent != null) 
            {
                parent.NotifyComboBoxItemEnter(this); 
            } 

            ListBoxItem.prototype.OnMouseEnter.call(this, e); 

        },

        /// <summary> 
        /// Called when Content property has been changed.
        /// </summary> 
        /// <param name="oldContent"></param> 
        /// <param name="newContent"></param>
//        protected override void 
		OnContentChanged:function(/*object*/ oldContent, /*object*/ newContent) 
        {
			ListBoxItem.prototype.OnContentChanged.call(this, oldContent, newContent);

            // If this is selected, we need to update ParentComboBox.Text 
            // Scenario:
            //      <ComboBox Width="200" Height="20" IsEditable="True" MaxDropDownHeight="50"> 
            //          <Text>item1</Text> 
            //          <Text>Item2</Text>
            //          <ComboBoxItem IsSelected="True">item3</ComboBoxItem> 
            //      </ComboBox>
            // In this case ComboBox will try to update Text property as soon as it get
            // SelectionChanged event. However, at that time ComboBoxItem.Content is not
            // parse yet. So, Content is null. This causes ComboBox.Text to be "". 
            //
            /*ComboBox*/var parent; 
            if (this.IsSelected && (null != (parent = this.ParentComboBox))) 
            {
                parent.SelectedItemUpdated(); 
            }

            // When the content of the combobox item is a UIElement,
            // combobox will create a visual clone of the item which needs 
            // to update even when the combobox is closed
            this.SetFlags(newContent instanceof UIElement, VisualFlags.IsLayoutIslandRoot); 
        }, 

        /// <summary> 
        ///     Called when this element gets focus.
        /// </summary>
        /// <param name="e"></param>
//        protected override void 
		OnGotKeyboardFocus:function(/*KeyboardFocusChangedEventArgs*/ e) 
        {
            e.Handled = true; 
 
            var parent = this.ParentComboBox;
 
            if (parent != null)
            {
                parent.NotifyComboBoxItemEnter(this);
            } 

            ListBoxItem.prototype.OnGotKeyboardFocus.call(this, e); 
        }, 

//        internal void 
		SetIsHighlighted:function(/*bool*/ isHighlighted) 
        {
			this.IsHighlighted = isHighlighted;
        }

	});
	
	Object.defineProperties(ComboBoxItem.prototype,{

        /// <summary>
        /// Indicates if the item is highlighted or not.  Styles that want to 
        /// show a highlight for selection should trigger off of this value.
        /// </summary> 
        /// <value></value> 
//        public bool 
        IsHighlighted:
        { 
            get:function()
            {
                return this.GetValue(ComboBoxItem.IsHighlightedProperty);
            }, 
            /*protected*/ set:function(value)
            { 
            	this.SetValue(ComboBoxItem.IsHighlightedPropertyKey, value); 
            }
        }, 
 
//        private ComboBox 
        ParentComboBox:
        {
            get:function()
            { 
                return this.ParentSelector instanceof ComboBox ? this.ParentSelector : null;
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
	
	Object.defineProperties(ComboBoxItem,{
	       /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary>
//        private static readonly DependencyPropertyKey 
        IsHighlightedPropertyKey:
        {
        	get:function(){
        		if(ComboBoxItem._IsHighlightedPropertyKey === undefined){
        			ComboBoxItem._IsHighlightedPropertyKey =
        	            DependencyProperty.RegisterReadOnly("IsHighlighted", Boolean.Type, ComboBoxItem.Type,
                                /*new FrameworkPropertyMetadata(false)*/
        	            		FrameworkPropertyMetadata.BuildWithDV(false)); 
        		}
        		
        		return ComboBoxItem._IsHighlightedPropertyKey;
        	}
        }, 

        /// <summary> 
        /// DependencyProperty for the IsHighlighted property 
        /// </summary>
//        public static readonly DependencyProperty 
        IsHighlightedProperty:
        {
        	get:function(){
        		return ComboBoxItem.IsHighlightedPropertyKey.DependencyProperty;
        	}
        }
  
	});
	
//	static ComboBoxItem() 
	function Initialize()
    {
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(ComboBoxItem.Type, 
        		/*new FrameworkPropertyMetadata(ComboBoxItem.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(ComboBoxItem.Type)); 
        _dType = DependencyObjectType.FromSystemTypeInternal(ComboBoxItem.Type);
    };
	
	ComboBoxItem.Type = new Type("ComboBoxItem", ComboBoxItem, [ListBoxItem.Type]);
	Initialize();
	
	return ComboBoxItem;
});

