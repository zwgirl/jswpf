/**
 * PasswordBox
 */

define(["dojo/_base/declare", "system/Type", "controls/Control", "windows/FrameworkPropertyMetadata",
        "windows/PropertyChangedCallback", "input/EventListenerManager"], 
		function(declare, Type, Control, FrameworkPropertyMetadata,
				PropertyChangedCallback, EventListenerManager){
	var PasswordBox = declare("PasswordBox", Control,{
		constructor:function(){
			
			this._dom = window.document.createElement('input');
			this._dom.setAttribute("type","password");  
			this._dom.setAttribute("name","inputname");  
			this._dom._source = this;
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
        
//      protected void 
        OnPasswordChanged:function(oldValue, newValue)
        { 
            
        },
        
        /// <summary>
        ///     Default control measurement is to measure only the first visual child. 
        ///     This child would have been created by the inflation of the
        ///     visual tree from the control's style.
        ///
        ///     Derived controls may want to /*override*/ this behavior. 
        /// </summary>
        /// <param name="constraint">The measurement constraints.</param> 
        /// <returns>The desired size of the control.</returns> 
//        protected /*override*/ Size 
//        MeasureOverride:function()
//        { 
//
////			newNode.innerHTML =  "<h3>" + module.mid +  "   enter execModule" + "</h3> ";
////			window.document.getElementById("test1").appendChild( newNode );
////			this._dom.addEventListener();
//        },

        /// <summary> 
        ///     Default control arrangement is to only arrange
        ///     the first visual child. No transforms will be applied. 
        /// </summary>
        /// <param name="arrangeBounds">The computed size.</param>
//        protected /*override*/ Size 
//        ArrangeOverride:function()
//        { 
//        	parent.appendChild(this._dom);
//        },
        
        /// <summary> 
        /// Event fired from this text box when its inner content 
        /// has been changed.
        /// </summary> 
        /// <remarks>
        /// It is redirected from inner TextContainer.Changed event.
        /// </remarks>
        AddPasswordChanged:function(value) 
        { 
            AddHandler(PasswordChangedEvent, value);
        }, 

        RemovePasswordChanged:function(value)
        {
            RemoveHandler(PasswordChangedEvent, value); 
        },
	});
	
	Object.defineProperties(PasswordBox.prototype,{
	       /// <summary>
        /// Contents of the PasswordBox. 
        /// </summary> 
        /// <remarks>
        /// Use the SecurePassword property in place of this one when possible. 
        /// Doing so reduces the risk of revealing content that should be kept secret.
        /// </remarks>
        /// <SecurityNote>
        /// Critical - The getter elevates to unmanaged code and has unsafe code block. 
        ///            The setter calls SetSecurePassword.
        /// 
        /// PublicOK: Does not pass unsafe data to native code. 
        ///           Does not pass 2nd party SecureString to SetSecurePassword.
        /// 
        /// </SecurityNote>
//        public string 
		Password: 
        {
            get:function() 
            {
                return this._password;
            },

            set:function(value)
            { 

            } 
        },

        /// <summary> 
        /// Maximum number of characters the PasswordBox can accept 
        /// </summary>
//        public int 
        MaxLength:
        {
            get:function() { return this.GetValue(PasswordBox.MaxLengthProperty); },
            set:function(value) { this.SetValue(PasswordBox.MaxLengthProperty, value); } 
        }
	});
	
	Object.defineProperties(PasswordBox,{
        /// <summary>
        /// The DependencyID for the PasswordChar property.
        /// Default Value:     '*'
        /// </summary> 
//        public static readonly DependencyProperty 
		PasswordProperty:
        {
        	get:function(){
        		if(PasswordBox._PasswordProperty === undefined){
        			PasswordBox._PasswordProperty =
                        DependencyProperty.RegisterAttached( 
                                "Password", // Property name 
                                String.Type, // Property type
                                PasswordBox.Type, // Property owner 
                                /*new FrameworkPropertyMetadata(String.Empty, 
                                		new PropertyChangedCallback(null, OnPasswordChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(String.Empty, 
                                		new PropertyChangedCallback(null, OnPasswordChanged))); // Flags  

        		}
        		
        		return Image._PasswordProperty;
        	}
        }, 
        /// <summary>
        /// The limit number of characters that the PasswordBox or other editable controls can contain. 
        /// if it is 0, means no-limitation.
        /// User can set this value for some simple single line PasswordBox to restrict the text number. 
        /// By default it is 0. 
        /// </summary>
        /// <remarks> 
        /// When this property is set to zero, the maximum length of the text that can be entered
        /// in the control is limited only by available memory. You can use this property to restrict
        /// the length of text entered in the control for values such as postal codes and telephone numbers.
        /// You can also use this property to restrict the length of text entered when the data is to be entered 
        /// in a database.
        /// You can limit the text entered into the control to the maximum length of the corresponding field in the database. 
        /// Note:   In code, you can set the value of the Text property to a value that is larger than 
        /// the value specified by the MaxLength property.
        /// This property only affects text entered into the control at runtime. 
        /// </remarks>
//        public static readonly DependencyProperty 
		MaxLengthProperty:
        {
        	get:function(){
        		if(PasswordBox._SourceProperty === undefined){
        			PasswordBox._SourceProperty =
                        TextBox.MaxLengthProperty.AddOwner(PasswordBox.Type);

        		}
        		
        		return PasswordBox._SourceProperty;
        	}
        }, 
        

        /// <summary>
        /// Event for "Text has changed"
        /// </summary>
        /// <remarks> 
        /// Unlike most RoutedEvents on Controls, PasswordChangedEvent does not
        /// have a matching protected virtual OnPasswordChanged method -- 
        /// because PasswordBox is sealed. 
        /// </remarks>
//        public static readonly RoutedEvent 
		PasswordChangedEvent:
        {
        	get:function(){
        		if(PasswordBox._PasswordChangedEvent === undefined){
        			PasswordBox._PasswordChangedEvent = EventManager.RegisterRoutedEvent( 
        		            "PasswordChanged", // Event name
        		            RoutingStrategy.Bubble, //
        		            RoutedEventHandler.Type, //
        		            PasswordBox.Type); // 

        		}
        		
        		return Image._PasswordChangedEvent;
        	}
        }, 
	});
	
    /// <summary>
    /// Callback for changes to the PasswordChar property. 
    /// </summary>
//    private static void 
	function OnPasswordChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        // Force a layout refresh to display the new char.
        d.OnPasswordChanged(e.OldValue, e.NewValue);
    }
	
	PasswordBox.Type = new Type("PasswordBox", PasswordBox, [Control.Type]);
	return PasswordBox;
});
