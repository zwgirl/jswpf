/**
 * Expander
 */

define(["dojo/_base/declare", "system/Type", "controls/HeaderedContentControl", "controls/ExpandDirection", 
        "controls/VisualStates", "windows/RoutedEventArgs", "windows/FrameworkElement", "controls/Control",
        "windows/UIElement", "windows/DependencyObjectType", "windows/FrameworkPropertyMetadata",
        "windows/UIPropertyMetadata", "windows/RoutingStrategy", "windows/EventManager", "windows/RoutedEventHandler",
        "windows/FrameworkPropertyMetadataOptions", "windows/PropertyChangedCallback"], 
		function(declare, Type, HeaderedContentControl, ExpandDirection, 
				VisualStates, RoutedEventArgs, FrameworkElement, Control,
				UIElement, DependencyObjectType, FrameworkPropertyMetadata,
				UIPropertyMetadata, RoutingStrategy, EventManager, RoutedEventHandler,
				FrameworkPropertyMetadataOptions, PropertyChangedCallback){
//	private static DependencyObjectType 
    var _dType = null;
	var Expander = declare("Expander", HeaderedContentControl,{
		constructor:function(){
			this._dom = window.document.createElement('div');
			this._dom._source = this;
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
		/// <summary>
		/// Content measurement.
		/// </summary>
		/// <param name="constraint">Constraint size.</param> 
		/// <returns>Computed desired size.</returns>
//		protected sealed override Size 
//		MeasureOverride:function() 
//		{ 
//			this._dom = window.document.createElement('div');
//			HeaderedContentControl.prototype.MeasureOverride.call(this);
//	
//		}, 

		/// <summary>
		/// Content arrangement. 
		/// </summary>
		/// <param name="arrangeSize">Size that element should use to arrange itself and its children.</param>
//		protected sealed override Size 
//		ArrangeOverride:function()
//		{ 
//			parent.appendChild(this._dom);
//			HeaderedContentControl.prototype.ArrangeOverride.call(this, parent);
////            this.InvalidateVisual(); 
////            return arrangeSize;	                          
//	                       
//		}, 

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
	          	if(dp === TextBlock.BackgroundProperty){
            		if(e.NewValue){
            			if(this._dom){
                  			this._dom.style.setProperty("background-color",e.NewValue.Color.ToString(),"");
            			}
            		}else{
            			
            		}
            	}
	          	
	          	if(dp === TextBlock.ForegroundProperty){
            		if(e.NewValue){
            			if(this._dom)
            				this._dom.style.setProperty("color", e.NewValue.Color.ToString(),"");
            		}else{
            			if(this._dom)
            				this._dom.style.setProperty("color", "red","");
            		}
            	}
			}
		}, 

        /// <summary> 
        /// Expanded event. It is fired when IsExpanded changed from false to true.
        /// </summary>
        AddExpandedHandler:function(value){
        	this.AddHandler(Expander.ExpandedEvent, value);
        },
        
        RemoveExpandedHandler:function(value){
        	this.RemoveHandler(Expander.ExpandedEvent, value);
        },
        
        AddCollapsedHandler:function(value){
        	this.AddHandler(Expander.ExpandedEvent, value);
        },
        
        RemoveCollapsedHandler:function(value){
        	this.RemoveHandler(Expander.ExpandedEvent, value);
        },

//        internal override void 
        ChangeVisualState:function(/*bool*/ useTransitions)
        {
            // Handle the Common states 
            if (!this.IsEnabled)
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateDisabled, VisualStates.StateNormal); 
            }
            else if (this.IsMouseOver) 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateMouseOver, VisualStates.StateNormal);
            }
            else 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateNormal); 
            } 

            // Handle the Focused states 
            if (this.IsKeyboardFocused)
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateFocused, VisualStates.StateUnfocused);
            } 
            else
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateUnfocused); 
            }
 
            if (this.IsExpanded)
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateExpanded);
            } 
            else
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateCollapsed); 
            }
 
            switch (this.ExpandDirection)
            {
                case ExpandDirection.Down:
                    VisualStates.GoToState(this, useTransitions, VisualStates.StateExpandDown); 
                    break;
 
                case ExpandDirection.Up: 
                    VisualStates.GoToState(this, useTransitions, VisualStates.StateExpandUp);
                    break; 

                case ExpandDirection.Left:
                    VisualStates.GoToState(this, useTransitions, VisualStates.StateExpandLeft);
                    break; 

                default: 
                    VisualStates.GoToState(this, useTransitions, VisualStates.StateExpandRight); 
                    break;
            } 

            HeaderedContentControl.prototype.ChangeVisualState.call(this, useTransitions);
        },
 
        /// <summary>
        /// A virtual function that is called when the IsExpanded property is changed to true. 
        /// Default behavior is to raise an ExpandedEvent. 
        /// </summary>
//        protected virtual void 
        OnExpanded:function() 
        {
            /*RoutedEventArgs*/var args = new RoutedEventArgs();
            args.RoutedEvent = Expander.ExpandedEvent;
            args.Source = this; 
            this.RaiseEvent(args);
        },
 
        /// <summary>
        /// A virtual function that is called when the IsExpanded property is changed to false. 
        /// Default behavior is to raise a CollapsedEvent.
        /// </summary>
//        protected virtual void 
        OnCollapsed:function()
        { 
            this.RaiseEvent(new RoutedEventArgs(Expander.CollapsedEvent, this));
        } 

	});
	
	Object.defineProperties(Expander.prototype,{
	     /// <summary>
        /// ExpandDirection specifies to which direction the content will expand 
        /// </summary> 
//        public ExpandDirection 
        ExpandDirection: 
        {
            get:function() { return this.GetValue(Expander.ExpandDirectionProperty); },
            set:function(value) { this.SetValue(Expander.ExpandDirectionProperty, value); }
        }, 

        /// <summary> 
        /// IsExpanded indicates whether the expander is currently expanded.
        /// </summary> 
//        public bool 
        IsExpanded:
        {
            get:function() { return this.GetValue(Expander.IsExpandedProperty); }, 
            set:function(value) { this.SetValue(Expander.IsExpandedProperty, value); }
        }, 
 
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will override this method to return approriate types. 
//        internal override DependencyObjectType 
        DTypeThemeStyleKey:
        {
            get:function() { return _dType; }
        } 
	  
	});
	
	Object.defineProperties(Expander,{
	        /// <summary> 
        /// The DependencyProperty for the ExpandDirection property. 
        /// Default Value: ExpandDirection.Down
        /// </summary> 
//        public static readonly DependencyProperty 
        ExpandDirectionProperty:
        {
        	get:function(){
        		if(Expander._ExpandDirectionProperty === undefined){
        			Expander._ExpandDirectionProperty =
                        DependencyProperty.Register(
                                "ExpandDirection",
                                Number.Type, 
                                Expander.Type,
                                /*new FrameworkPropertyMetadata( 
                                        ExpandDirection.Down  default value , 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(ExpandDirection.Down, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)), 
                                new ValidateValueCallback(null, IsValidExpandDirection));
        		}
        		return Expander._ExpandDirectionProperty;
        	}
        },  

        /// <summary> 
        ///     The DependencyProperty for the IsExpanded property.
        ///     Default Value: false 
        /// </summary> 
//        public static readonly DependencyProperty 
        IsExpandedProperty:
        {
        	get:function(){
        		if(Expander._IsExpandedProperty === undefined){
        			Expander._IsExpandedProperty =
                        DependencyProperty.Register( 
                                "IsExpanded",
                                Boolean.Type,
                                Expander.Type,
                                /*new FrameworkPropertyMetadata( 
                                        false,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal, 
                                        new PropertyChangedCallback(null, OnIsExpandedChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(false,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal, 
                                        new PropertyChangedCallback(null, OnIsExpandedChanged))); 
        		}
        		return Expander._IsExpandedProperty;
        	}
        },  

        /// <summary>
        /// Expanded event. 
        /// </summary>
//        public static readonly RoutedEvent 
        ExpandedEvent:
        {
        	get:function(){
        		if(Expander._ExpandedEvent === undefined){
        			Expander._ExpandedEvent =
        	            EventManager.RegisterRoutedEvent("Expanded",
        	                    RoutingStrategy.Bubble, 
        	                    RoutedEventHandler.Type,
        	                    Expander.Type 
        	                ); 
        		}
        		return Expander._ExpandedEvent;
        	}
        },  

        /// <summary> 
        /// Collapsed event.
        /// </summary>
//        public static readonly RoutedEvent 
        CollapsedEvent:
        {
        	get:function(){
        		if(Expander._CollapsedEvent === undefined){
        			Expander._CollapsedEvent  =
        	            EventManager.RegisterRoutedEvent("Collapsed", 
        	                    RoutingStrategy.Bubble,
        	                    RoutedEventHandler.Type, 
        	                    Expander.Type 
        	                );
        		}
        		return Expander._CollapsedEvent;
        	}
        } 
	});
	
//    static Expander()
	function Initialize()
    {
		_dType = DependencyObjectType.FromSystemTypeInternal(Expander.Type);
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(Expander.Type, 
        		/*new FrameworkPropertyMetadata(Expander.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(Expander.Type)); 

        Control.IsTabStopProperty.OverrideMetadata(Expander.Type, 
        		/*new FrameworkPropertyMetadata(false)*/
        		FrameworkPropertyMetadata.BuildWithDV(false)); 

        UIElement.IsMouseOverPropertyKey.OverrideMetadata(Expander.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))); 
        UIElement.IsEnabledProperty.OverrideMetadata(Expander.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
    };

//    private static bool 
    function IsValidExpandDirection(/*object*/ o)
    { 
        return (o == ExpandDirection.Down || 
                o == ExpandDirection.Left ||
                o == ExpandDirection.Right || 
                o == ExpandDirection.Up);
    }

//    private static void 
    function OnIsExpandedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        var newValue = e.NewValue; 

        if (newValue) 
        {
            d.OnExpanded(); 
//            d._dom.style.setProperty("display", "");
        } 
        else
        { 
            d.OnCollapsed();
//            d._dom.style.setProperty("display", "none");
        }

        d.UpdateVisualState(); 
    }

	
	Expander.Type = new Type("Expander", Expander, [HeaderedContentControl.Type]);
	Initialize();
	
	return Expander;
});


 
   


