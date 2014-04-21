/**
 * CheckBox
 */
/// <summary> 
///     Use a CheckBox to give the user an option, such as true/false.
///     CheckBox allow the user to choose from a list of options. 
///     CheckBox controls let the user pick a combination of options.
/// </summary>
define(["dojo/_base/declare", "system/Type", "primitives/ToggleButton", "windows/FrameworkElement",
        "input/KeyboardNavigation", "windows/DependencyObjectType"], 
		function(declare, Type, ToggleButton, FrameworkElement,
				KeyboardNavigation, DependencyObjectType){
	var CheckBox = declare("CheckBox", ToggleButton,{
		constructor:function(){
			
			this._dom = window.document.createElement('div');
			this._dom.tabIndex = 0;
			this._dom._source = this;
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
		Focus:function(){
			if(ToggleButton.prototype.Focus.call(this)){
				console.log("check div setfocus");
				this._dom.focus();
			}
		},
		
        /// <summary> 
        /// This is the method that responds to the KeyDown event.
        /// </summary> 
        /// <param name="e"></param> 
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e)
        { 
        	ToggleButton.prototype.OnKeyDown.call(this, e);

            // Add aditional keys "+" and "-" when we are not in IsThreeState mode
            if (!this.IsThreeState) 
            {
                if (e.Key == Key.OemPlus || e.Key == Key.Add) 
                { 
                    e.Handled = true;
                    this.ClearValue(ToggleButton.IsPressedPropertyKey); 
                    this.SetCurrentValueInternal(ToggleButton.IsCheckedProperty, false);
                }
                else if (e.Key == Key.OemMinus || e.Key == Key.Subtract)
                { 
                    e.Handled = true;
                    this.ClearValue(ToggleButton.IsPressedPropertyKey); 
                    this.SetCurrentValueInternal(ToggleButton.IsCheckedProperty, false); 
                }
            } 
        },

        /// <summary>
        /// The Access key for this control was invoked. 
        /// </summary>
        /// <param name="e"></param> 
//        protected override void 
        OnAccessKey:function(/*AccessKeyEventArgs*/ e) 
        {
            if (!this.IsKeyboardFocused) 
            {
            	this.Focus();
            }
 
            ToggleButton.prototype.OnAccessKey.call(this, e);
        }
	});
	
	Object.defineProperties(CheckBox.prototype,{
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types. 
//        internal override DependencyObjectType 
		DTypeThemeStyleKey:
        { 
            get:function() { return _dType; }
        }  
	});
	
//    static CheckBox() 
    function Initialize(){
        // Set the default Style
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(CheckBox.Type, 
        		/*new FrameworkPropertyMetadata(CheckBox.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(CheckBox.Type));
        _dType = DependencyObjectType.FromSystemTypeInternal(CheckBox.Type); 

        KeyboardNavigation.AcceptsReturnProperty.OverrideMetadata(CheckBox.Type, /*new FrameworkPropertyMetadata(false)*/
        		FrameworkPropertyMetadata.BuildWithDV(false)); 
    } 
	
	CheckBox.Type = new Type("CheckBox", CheckBox, [ToggleButton.Type]);
	Initialize();
	
	return CheckBox;
});
