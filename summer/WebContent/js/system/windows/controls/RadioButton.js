/**
 * RadioButton
 */
/// <summary>
///     RadioButton implements option button with two states: true or false
/// </summary>
define(["dojo/_base/declare", "system/Type", "primitives/ToggleButton", "windows/UncommonField",
        "collections/Hashtable", "windows/FrameworkElement", "input/KeyboardNavigation",
        "windows/FrameworkPropertyMetadata", "windows/DependencyProperty", "windows/DependencyObjectType",
        "windows/PropertyChangedCallback"], 
		function(declare, Type, ToggleButton, UncommonField,
				Hashtable, FrameworkElement, KeyboardNavigation,
				FrameworkPropertyMetadata, DependencyProperty, DependencyObjectType,
				PropertyChangedCallback){
//    private static DependencyObjectType 
	var _dType = null;
//    private static Hashtable 
	var _groupNameToElements = null;
//    private static readonly UncommonField<string> 
	var _currentlyRegisteredGroupName = new UncommonField/*<string>*/();
	var RadioButton = declare("RadioButton", ToggleButton,{
		constructor:function(){
		},
		
//		private void 
		UpdateRadioButtonGroup:function() 
        { 
            var groupName = this.GroupName;
            if (!String.IsNullOrEmpty(groupName)) 
            {
                var rootScope = KeyboardNavigation.GetVisualRoot(this);
                if (_groupNameToElements == null)
                	_groupNameToElements = new Hashtable(1); 
                // Get all elements bound to this key and remove this element 
                /*ArrayList*/var elements = _groupNameToElements.Get(groupName);
                for (var i = 0; i < elements.Count; ) 
                {
                    /*WeakReference*/var weakReference = /*(WeakReference)*/elements.Get(i);
                    var rb = weakReference/*.Target*/ instanceof RadioButton ? weakReference : null;
                    if (rb == null) 
                    {
                        // Remove dead instances 
                        elements.RemoveAt(i); 
                    }
                    else 
                    {
                        // Uncheck all checked RadioButtons different from the current one
                        if (rb != this && (rb.IsChecked == true) && rootScope == KeyboardNavigation.GetVisualRoot(rb))
                            rb.UncheckRadioButton(); 
                        i++;
                    } 
                } 
            } 
            else // Logical parent should be the group
            {
                var parent = this.Parent;
                if (parent != null) 
                {
                    // Traverse logical children 
                    /*IEnumerable*/var children = LogicalTreeHelper.GetChildren(parent); 
                    /*IEnumerator*/var itor = children.GetEnumerator();
                    while (itor.MoveNext()) 
                    {
                        /*RadioButton*/var rb = itor.Current instanceof RadioButton ? itor.Current : null;
                        if (rb != null && rb != this && string.IsNullOrEmpty(rb.GroupName) && (rb.IsChecked == true))
                            rb.UncheckRadioButton(); 
                    }
                } 
 
            }
        }, 

//        private void 
		UncheckRadioButton:function()
        {
            SetCurrentValueInternal(RadioButton.IsCheckedProperty, false); 
        },
        
      /// <summary> 
        ///     This method is invoked when the IsChecked becomes true. 
        /// </summary>
        /// <param name="e">RoutedEventArgs.</param> 
//        protected override void 
        OnChecked:function(/*RoutedEventArgs*/ e)
        {
            // If RadioButton is checked we should uncheck the others in the same group
            this.UpdateRadioButtonGroup(); 
            base.OnChecked(e);
        }, 
 
        /// <summary>
        /// This override method is called from OnClick(). 
        /// RadioButton implements its own toggle behavior
        /// </summary>
//        protected internal override void 
        OnToggle:function()
        { 
        	this.SetCurrentValueInternal(RadioButton.IsCheckedProperty, true);
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
 
            base.OnAccessKey(e);
        }
	});
	
	Object.defineProperties(RadioButton.prototype,{
        /// <summary>
        /// GroupName determine mutually excusive radiobutton groups 
        /// </summary>
//        public string 
		GroupName:
        { 
            get:function()
            {
                return this.GetValue(RadioButton.GroupNameProperty);
            }, 
            set:function(value) 
            { 
            	this.SetValue(RadioButton.GroupNameProperty, value);
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
	
	Object.defineProperties(RadioButton,{
		/// <summary>
        /// The DependencyID for the GroupName property.
        /// Default Value:      "String.Empty" 
        /// </summary>
//        public static readonly DependencyProperty 
		GroupNameProperty:
        {
        	get:function(){
        		if(RangeBase._GroupNameProperty === undefined){
        			RangeBase._GroupNameProperty = DependencyProperty.Register( 
        		            "GroupName", 
        		            String.Type,
        		            RadioButton.Type, 
        		            /*new FrameworkPropertyMetadata(String.Empty, new PropertyChangedCallback(null, OnGroupNameChanged))*/
        		            FrameworkPropertyMetadata.BuildWithDVandPCCB(String.Empty, 
        		            		new PropertyChangedCallback(null, OnGroupNameChanged)));
        		}
        		
        		return RangeBase._GroupNameProperty;
        	}
        }	  
	});
	
//    private static void 
	function OnGroupNameChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        /*RadioButton*/var radioButton = d; 
        var groupName = typeof e.NewValue == "string" ? e.NewValue : null;
        var currentlyRegisteredGroupName = this._currentlyRegisteredGroupName.GetValue(radioButton); 

        if (groupName != currentlyRegisteredGroupName)
        {
            // Unregister the old group name if set 
            if (!String.IsNullOrEmpty(currentlyRegisteredGroupName))
                Unregister(currentlyRegisteredGroupName, radioButton); 

            // Register the new group name is set
            if (!String.IsNullOrEmpty(groupName)) 
                Register(groupName, radioButton);
        }
    }
	
//	private static void 
	function Register(/*string*/ groupName, /*RadioButton*/ radioButton)
    { 
        if (_groupNameToElements == null) 
            _groupNameToElements = new Hashtable(1);

        /*ArrayList*/var elements = _groupNameToElements.Get(groupName);

        if (elements == null)
        { 
            elements = new ArrayList(1); 
            _groupNameToElements.Set(groupName, elements);
        } 
        else
        {
            // There were some elements there, remove dead ones
            PurgeDead(elements, null); 
        }

        elements.Add(/*new WeakReference(radioButton)*/radioButton); 
        this._currentlyRegisteredGroupName.SetValue(radioButton, groupName); 
    }

//    private static void 
	function Unregister(/*string*/ groupName, /*RadioButton*/ radioButton)
    { 
        if (_groupNameToElements == null)
            return; 

        // Get all elements bound to this key and remove this element
        /*ArrayList*/var elements = _groupNameToElements.Get(groupName);

        if (elements != null) 
        {
            PurgeDead(elements, radioButton); 
            if (elements.Count == 0) 
            {
                _groupNameToElements.Remove(groupName); 
            }
        }
        _currentlyRegisteredGroupName.SetValue(radioButton, null); 
    }

//    private static void 
	function PurgeDead(/*ArrayList*/ elements, /*object*/ elementToRemove) 
    {
        for (var i = 0; i < elements.Count; ) 
        {
            /*WeakReference*/var weakReference = /*(WeakReference)*/elements[i];
            var element = weakReference/*.Target*/;
            if (element == null || element == elementToRemove) 
            {
                elements.RemoveAt(i); 
            } 
            else
            { 
                i++;
            }
        }
    } 
	
//    static RadioButton() 
	function Initialize()
    {
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(RadioButton.Type, 
        		/*new FrameworkPropertyMetadata(RadioButton.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(RadioButton.Type));
        _dType = DependencyObjectType.FromSystemTypeInternal(RadioButton.Type);

        KeyboardNavigation.AcceptsReturnProperty.OverrideMetadata(RadioButton.Type, 
        		/*new FrameworkPropertyMetadata(false)*/
        		FrameworkPropertyMetadata.BuildWithDV(false));
    } 
	
	RadioButton.Type = new Type("RadioButton", RadioButton, [ToggleButton.Type]);
	Initialize();
	
	return RadioButton;
});
