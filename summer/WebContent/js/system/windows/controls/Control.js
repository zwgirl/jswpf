/**
 * Control 
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement",
        "windows/FrameworkPropertyMetadata", "windows/DependencyProperty", "windows/ControlTemplate",
        "windows/FrameworkPropertyMetadataOptions", "windows/PropertyChangedCallback", "input/KeyboardNavigation",
        "windows/Thickness", "controls/Validation", "windows/VisualStateManager", "controls/VisualStates",
        "documents/TextElement", "windows/SystemColors"], 
        function(declare, Type, FrameworkElement,
        		FrameworkPropertyMetadata, DependencyProperty, ControlTemplate,
        		FrameworkPropertyMetadataOptions, PropertyChangedCallback, KeyboardNavigation,
        		Thickness, Validation, VisualStateManager, VisualStates,
        		TextElement, SystemColors){
	
//    internal enum 
    var ControlBoolFlags = declare("ControlBoolFlags", null,{});
    ControlBoolFlags.ContentIsNotLogical                 = 0x0001;            // used in contentcontrol.cs
    ControlBoolFlags.IsSpaceKeyDown                      = 0x0002;            // used in ButtonBase.cs 
    ControlBoolFlags.HeaderIsNotLogical                  = 0x0004;            // used in HeaderedContentControl.cs; HeaderedItemsControl.cs 
    ControlBoolFlags.CommandDisabled                     = 0x0008;            // used in ButtonBase.cs; MenuItem.cs
    ControlBoolFlags.ContentIsItem                       = 0x0010;            // used in contentcontrol.cs 
    ControlBoolFlags.HeaderIsItem                        = 0x0020;            // used in HeaderedContentControl.cs; HeaderedItemsControl.cs
    ControlBoolFlags.ScrollHostValid                     = 0x0040;            // used in ItemsControl.cs
    ControlBoolFlags.ContainsSelection                   = 0x0080;            // used in TreeViewItem.cs
    ControlBoolFlags.VisualStateChangeSuspended          = 0x0100;            // used in Control.cs 
	
	var Control = declare("Control", FrameworkElement,{
		constructor:function(){
            // Initialize the _templateCache to the default value for TemplateProperty.
            // If the default value is non-null then wire it to the current instance.
            /*PropertyMetadata*/
			var metadata = Control.TemplateProperty.GetMetadata(this.DependencyObjectType); 
            /*ControlTemplate*/
			var defaultValue =  metadata.DefaultValue;
            if (defaultValue != null) 
            { 
                this.OnTemplateChanged(this, 
                		/*new DependencyPropertyChangedEventArgs(Control.TemplateProperty, metadata, null, defaultValue)*/
                		DependencyPropertyChangedEventArgs.BuildPMOO(Control.TemplateProperty, metadata, null, defaultValue));
            } 
            
            // Property caches 
//            private ControlTemplate         
            this._templateCache = null;
//            internal ControlBoolFlags       
            this._controlBoolField = 0;   // Cache valid bits 
		},
		
	      
        // Internal helper so FrameworkElement could see call the template changed virtual 
//        internal override void 
        OnTemplateChangedInternal:function(/*FrameworkTemplate*/ oldTemplate, /*FrameworkTemplate*/ newTemplate) 
        {
            this.OnTemplateChanged(oldTemplate, newTemplate); 
        },
        /// <summary>
        ///     Template has changed
        /// </summary>
        /// <remarks> 
        ///     When a Template changes, the VisualTree is removed. The new Template's
        ///     VisualTree will be created when ApplyTemplate is called 
        /// </remarks> 
        /// <param name="oldTemplate">The old Template</param>
        /// <param name="newTemplate">The new Template</param> 
//        protected virtual void 
        OnTemplateChanged:function(/*ControlTemplate*/ oldTemplate, /*ControlTemplate*/ newTemplate)
        {
        },

        /// <summary>
        ///     An event reporting a mouse button was pressed twice in a row.
        /// </summary> 
        /// <param name="e">Event arguments</param>
//        protected virtual void 
        OnPreviewMouseDoubleClick:function(/*MouseButtonEventArgs*/ e) 
        { 
            this.RaiseEvent(e);
        }, 
        
        /// <summary> 
        ///     An event reporting a mouse button was pressed twice in a row.
        /// </summary> 
        /// <param name="e">Event arguments</param>
//        protected virtual void 
        OnMouseDoubleClick:function(/*MouseButtonEventArgs*/ e)
        {
            this.RaiseEvent(e); 
        },

        /// <summary> 
        /// Suspends visual state changes.
        /// </summary> 
//        internal override void 
        OnPreApplyTemplate:function() 
        {
            this.VisualStateChangeSuspended = true; 
            FrameworkElement.prototype.OnPreApplyTemplate.call(this);
        },

        /// <summary> 
        /// Restores visual state changes & updates the visual state without transitions.
        /// </summary> 
//        internal override void 
        OnPostApplyTemplate:function() 
        {
        	FrameworkElement.prototype.OnPostApplyTemplate.call(this); 

            this.VisualStateChangeSuspended = false;
            this.UpdateVisualState(false);
        }, 

        /// <summary> 
        /// Update the current visual state of the control 
        /// </summary>
        /// <param name="useTransitions"> 
        /// true to use transitions when updating the visual state, false to
        /// snap directly to the new visual state.
        /// </param>
//        internal void 
        UpdateVisualState:function(/*bool*/ useTransitions) 
        {
        	if(useTransitions === undefined){
        		useTransitions = false;
        	}
            if (!this.VisualStateChangeSuspended) 
            {
                this.ChangeVisualState(useTransitions); 
            }
        },
 
        /// <summary>
        ///     Change to the correct visual state for the Control. 
        /// </summary> 
        /// <param name="useTransitions">
        ///     true to use transitions when updating the visual state, false to 
        ///     snap directly to the new visual state.
        /// </param>
//        internal virtual void 
        ChangeVisualState:function(/*bool*/ useTransitions)
        { 
            this.ChangeValidationVisualState(useTransitions);
        },
 
        /// <summary>
        ///     Common code for putting a control in the validation state.  Controls that use the should register 
        ///     for change notification of Validation.HasError.
        /// </summary>
        /// <param name="useTransitions"></param>
//        internal void 
        ChangeValidationVisualState:function(/*bool*/ useTransitions) 
        {
            if (Validation.GetHasError(this)) 
            { 
                if (this.IsKeyboardFocused)
                { 
                    VisualStateManager.GoToState(this, VisualStates.StateInvalidFocused, useTransitions);
                }
                else
                { 
                    VisualStateManager.GoToState(this, VisualStates.StateInvalidUnfocused, useTransitions);
                } 
            } 
            else
            { 
                VisualStateManager.GoToState(this, VisualStates.StateValid, useTransitions);
            }
        },
        
        /// <summary>
        ///     Default control measurement is to measure only the first visual child. 
        ///     This child would have been created by the inflation of the
        ///     visual tree from the control's style.
        ///
        ///     Derived controls may want to override this behavior. 
        /// </summary>
        /// <param name="constraint">The measurement constraints.</param> 
        /// <returns>The desired size of the control.</returns> 
//        protected override Size 
        MeasureOverride:function()
        { 
            var count = this.VisualChildrenCount;

            if (count > 0)
            { 
                /*UIElement*/var child = this.GetVisualChild(0);
                if (child != null) 
                { 
                    child.Measure();
                }
            }
            
//            console.log("Background : " + this.Name + " color: " + this.Background);
        },
 
        /// <summary> 
        ///     Default control arrangement is to only arrange
        ///     the first visual child. No transforms will be applied. 
        /// </summary>
        /// <param name="arrangeBounds">The computed size.</param>
//        protected override Size 
        ArrangeOverride:function()
        { 
        	this.SetUpStyle();
            var count = this.VisualChildrenCount;
 
            if (count>0) 
            {
                /*UIElement*/var child = this.GetVisualChild(0); 
                if (child != null)
                {
                	child.Arrange(this._dom);
                	this._dom.appendChild(child._dom);
                } 
            }
        }, 
        
        SetUpStyle:function(){
        	FrameworkElement.prototype.SetUpStyle.call(this);
        	
//        	var background = this.Background;
//        	if(background != null){
//        		this._dom.style.setProperty("background-color", background.Color.ToString(), "");
//        	}
//        	
//        	var foreground = this.Foreground;
//           	if( foreground!= null){
//        		this._dom.style.setProperty("color", foreground.Color.ToString(), "");
//        	}
//           	
//           	var fontSize = this.FontSize;
//           	if(fontSize != null){
//        		this._dom.style.setProperty("font-size", fontSize + "pt" , "");
//        	}
//           	
//           	var fontStretch = this.FontStretch;
//           	if(this.FontStretch != null){
//        		this._dom.style.setProperty("font-stretch", fontStretch.ToString(), "");
//        	}
//           	
//           	var fontStyle = this.FontStyle;
//           	if(this.FontStyle != null){
//        		this._dom.style.setProperty("font-style", fontStyle.ToString(), "");
//        	}
//           	
//           	var fontWeight = this.FontWeight;
//        	if(this.FontWeight != null){
//        		this._dom.style.setProperty("font-weight", fontWeight.ToString(), "");
//        	}
//        	
//        	var fontFamily = this.FontFamily;
//        	if(this.FontFamily != null){
//        		this._dom.style.setProperty("font-family", fontFamily.ToString(), "");
//        	}
        	
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
            			if(this._dom){
                  			this._dom.style.setProperty("background-color",e.NewValue.Color.ToString(),"");
            			}
            		}else{
            			this._dom.style.setProperty("background-color", "");
            		}
            	}
	          	
	          	if(dp === Control.ForegroundProperty){
            		if(e.NewValue){
            			if(this._dom){
                  			this._dom.style.setProperty("color",e.NewValue.Color.ToString(),"");
            			}
            		}else{
            			this._dom.style.setProperty("color", "");
            		}
            	}
	          	
	          	if(dp === Control.FontSizeProperty){
            		if(e.NewValue){
            			if(this._dom){
                       		this._dom.style.setProperty("font-size", e.NewValue + "pt" , "");
            			}
            		}else{
            			this._dom.style.setProperty("font-size", "");
            		}
            	}
	          	
	          	if(dp === Control.FontStretchProperty){
            		if(e.NewValue){
            			if(this._dom){
            				this._dom.style.setProperty("font-stretch", e.NewValue.ToString(), "");
            			}
            		}else{
            			this._dom.style.setProperty("font-stretch", "");
            		}
            	}
	          	
	          	if(dp === Control.FontStyleProperty){
            		if(e.NewValue){
            			if(this._dom){
            				this._dom.style.setProperty("font-style", e.NewValue.ToString(), "");
            			}
            		}else{
            			this._dom.style.setProperty("font-style", "");
            		}
            	}
	          	
	          	if(dp === Control.FontWeightProperty){
            		if(e.NewValue){
            			if(this._dom){
            				this._dom.style.setProperty("font-weight", e.NewValue.ToString(), "");
            			}
            		}else{
            			this._dom.style.setProperty("font-weight", "");
            		}
            	}
	          	
	          	if(dp === Control.FontFamilyProperty){
            		if(e.NewValue){
            			if(this._dom){
            				this._dom.style.setProperty("font-family", e.NewValue.ToString(), "");
            			}
            		}else{
            			this._dom.style.setProperty("font-family", "");
            		}
            	}
			}
		}, 

//        internal bool 
        ReadControlFlag:function(/*ControlBoolFlags*/ reqFlag) 
        {
            return (this._controlBoolField & reqFlag) != 0;
        },
 
//        internal void 
        WriteControlFlag:function(/*ControlBoolFlags*/ reqFlag, /*bool*/ set)
        { 
            if (set) 
            {
                this._controlBoolField |= reqFlag; 
            }
            else
            {
                this._controlBoolField &= (~reqFlag); 
            }
        },
        
//      /// <summary>
//      ///     An event reporting a mouse button was pressed twice in a row.
//      /// </summary> 
//      public event MouseButtonEventHandler PreviewMouseDoubleClick
//      { 
//          add { AddHandler(PreviewMouseDoubleClickEvent, value); } 
//          remove { RemoveHandler(PreviewMouseDoubleClickEvent, value); }
//      }
        
        AddPreviewMouseDoubleClickHandler:function(value) { this.AddHandler(Control.PreviewMouseDoubleClickEvent, value); }, 
        RemovePreviewMouseDoubleClickHandler:function(value) { this.RemoveHandler(Control.PreviewMouseDoubleClickEvent, value); },

	});
	
	Object.defineProperties(Control.prototype,{
 
        /// <summary>
        ///     An object that describes the border background. 
        ///     This will only affect controls whose template uses the property
        ///     as a parameter. On other controls, the property will do nothing.
        /// </summary>
//        public Brush 
        BorderBrush:
        { 
            get:function() { return this.GetValue(Control.BorderBrushProperty); }, 
            set:function(value) { this.SetValue(Control.BorderBrushProperty, value); }
        }, 

        /// <summary>
        ///     An object that describes the border thickness. 
        ///     This will only affect controls whose template uses the property
        ///     as a parameter. On other controls, the property will do nothing. 
        /// </summary> 
//        public Thickness 
        BorderThickness: 
        {
            get:function() { return this.GetValue(Control.BorderThicknessProperty); },
            set:function(value) { this.SetValue(Control.BorderThicknessProperty, value); }
        }, 
        /// <summary>
        ///     An object that describes the background. 
        ///     This will only affect controls whose template uses the property
        ///     as a parameter. On other controls, the property will do nothing.
        /// </summary>
//        public Brush 
        Background:
        { 
            get:function() { return this.GetValue(Control.BackgroundProperty); }, 
            set:function(value) { this.SetValue(Control.BackgroundProperty, value); }
        }, 
 
        /// <summary>
        ///     An brush that describes the foreground color. 
        ///     This will only affect controls whose template uses the property 
        ///     as a parameter. On other controls, the property will do nothing.
        /// </summary> 
//        public Brush 
        Foreground:
        {
            get:function() { return this.GetValue(Control.ForegroundProperty); }, 
            set:function(value) { this.SetValue(Control.ForegroundProperty, value); }
        }, 

        /// <summary>
        ///     The font family of the desired font.
        ///     This will only affect controls whose template uses the property 
        ///     as a parameter. On other controls, the property will do nothing.
        /// </summary> 
//        public FontFamily 
        FontFamily: 
        {
            get:function() { return this.GetValue(Control.FontFamilyProperty); },
            set:function(value) { this.SetValue(Control.FontFamilyProperty, value); }
        },

        /// <summary> 
        ///     The size of the desired font.
        ///     This will only affect controls whose template uses the property
        ///     as a parameter. On other controls, the property will do nothing.
        /// </summary> 
//        public double 
        FontSize:
        { 
            get:function() { return this.GetValue(Control.FontSizeProperty); },
            set:function(value) { this.SetValue(Control.FontSizeProperty, value); }
        },
 
        /// <summary> 
        ///     The stretch of the desired font.
        ///     This will only affect controls whose template uses the property 
        ///     as a parameter. On other controls, the property will do nothing.
        /// </summary>
//        public FontStretch 
        FontStretch: 
        {
            get:function() { return this.GetValue(Control.FontStretchProperty); }, 
            set:function(value) { this.SetValue(Control.FontStretchProperty, value); } 
        },

        /// <summary> 
        ///     The style of the desired font.
        ///     This will only affect controls whose template uses the property 
        ///     as a parameter. On other controls, the property will do nothing. 
        /// </summary>
//        public FontStyle 
        FontStyle:
        {
            get:function() { return this.GetValue(Control.FontStyleProperty); },
            set:function(value) { this.SetValue(Control.FontStyleProperty, value); } 
        },
 
        /// <summary>
        ///     The weight or thickness of the desired font.
        ///     This will only affect controls whose template uses the property
        ///     as a parameter. On other controls, the property will do nothing. 
        /// </summary>
//        public FontWeight 
        FontWeight: 
        {
            get:function() { return this.GetValue(Control.FontWeightProperty); },
            set:function(value) { this.SetValue(Control.FontWeightProperty, value); }
        },

        /// <summary> 
        ///     The horizontal alignment of the control.
        ///     This will only affect controls whose template uses the property
        ///     as a parameter. On other controls, the property will do nothing.
        /// </summary> 
//        public HorizontalAlignment 
        HorizontalContentAlignment: 
        { 
            get:function() { return this.GetValue(Control.HorizontalContentAlignmentProperty); },
            set:function(value) { this.SetValue(Control.HorizontalContentAlignmentProperty, value); } 
        },
 
        /// <summary>
        ///     The vertical alignment of the control. 
        ///     This will only affect controls whose template uses the property
        ///     as a parameter. On other controls, the property will do nothing.
        /// </summary>
//        public VerticalAlignment 
        VerticalContentAlignment:
        { 
            get:function() { return this.GetValue(Control.VerticalContentAlignmentProperty); }, 
            set:function(value) { this.SetValue(Control.VerticalContentAlignmentProperty, value); }
        }, 

        /// <summary> 
        ///     TabIndex property change the order of Tab navigation between Controls.
        ///     Control with lower TabIndex will get focus before the Control with higher index
        /// </summary>
//        public int 
        TabIndex:
        { 
            get:function() { return this.GetValue(Control.TabIndexProperty); }, 
            set:function(value) { this.SetValue(Control.TabIndexProperty, value); }
        }, 

        /// <summary> 
        ///     Determine is the Control should be considered during Tab navigation.
        ///     If IsTabStop is false then it is excluded from Tab navigation
        /// </summary>
//        public bool 
        IsTabStop:
        { 
            get:function() { return this.GetValue(Control.IsTabStopProperty); },
            set:function(value) { this.SetValue(Control.IsTabStopProperty, value); }
        },
        /// <summary> 
        /// Padding Property
        /// </summary> 
//        public Thickness 
        Padding:
        { 
            get:function() { return this.GetValue(Control.PaddingProperty); },
            set:function(value) { this.SetValue(Control.PaddingProperty, value); }
        },

        /// <summary>
        /// Template Property
        /// </summary> 
//        public ControlTemplate 
        Template:
        { 
            get:function() { return this._templateCache; }, 
            set:function(value) { this.SetValue(Control.TemplateProperty, value); }
        }, 

        // Internal Helper so the FrameworkElement could see this property
//        internal override FrameworkTemplate 
        TemplateInternal:
        { 
            get:function() { return this.Template; }
        },
 
        // Internal Helper so the FrameworkElement could see the template cache
//        internal override FrameworkTemplate 
        TemplateCache:
        {
            get:function() { return this._templateCache; },
            set:function(value) { this._templateCache =  value; }
        },
        
        
        /// <summary>
        ///     If control has a scrollviewer in its style and has a custom keyboard scrolling behavior when HandlesScrolling should return true. 
        /// Then ScrollViewer will not handle keyboard input and leave it up to the control. 
        /// </summary>
//        protected internal virtual bool 
        HandlesScrolling: 
        {
            get:function() { return false; }
        },
 
//        internal bool 
        VisualStateChangeSuspended:
        { 
            get:function() { return this.ReadControlFlag(ControlBoolFlags.VisualStateChangeSuspended); }, 
            set:function(value) { this.WriteControlFlag(ControlBoolFlags.VisualStateChangeSuspended, value); }
        } 
	});
	
	Object.defineProperties(Control,{
        /// <summary> 
        ///     The DependencyProperty for the BorderBrush property.
        /// </summary> 
//        public static readonly DependencyProperty 
        BorderBrushProperty:
        {
        	get:function(){
        		if(Control._BorderBrushProperty === undefined){
        			Control._BorderBrushProperty  = Border.BorderBrushProperty.AddOwner(Control.Type,
                            /*new FrameworkPropertyMetadata( 
                                    Border.BorderBrushProperty.DefaultMetadata.DefaultValue,
                                    FrameworkPropertyMetadataOptions.None)*/
        					FrameworkPropertyMetadata.Build2(Border.BorderBrushProperty.DefaultMetadata.DefaultValue,
                                    FrameworkPropertyMetadataOptions.None)); 
        		}
        		
        		return Control._BorderBrushProperty;
        	}
        },
               

        /// <summary>
        ///     The DependencyProperty for the BorderThickness property.
        /// </summary> 
//        public static readonly DependencyProperty 
        BorderThicknessProperty:
        {
        	get:function(){
        		if(Control._BorderThicknessProperty === undefined){
        			Control._BorderThicknessProperty = Border.BorderThicknessProperty.AddOwner(Control.Type, 
                            /*new FrameworkPropertyMetadata(
                                    Border.BorderThicknessProperty.DefaultMetadata.DefaultValue, 
                                    FrameworkPropertyMetadataOptions.None)*/
        					FrameworkPropertyMetadata.Build2(
        							Border.BorderThicknessProperty.DefaultMetadata.DefaultValue, 
                                    FrameworkPropertyMetadataOptions.None));
 
        		}
        		
        		return Control._BorderThicknessProperty;
        	}
        }, 
                
        /// <summary> 
        ///     The DependencyProperty for the Background property. 
        /// </summary>
//        public static readonly DependencyProperty 
        BackgroundProperty:
        {
        	get:function(){
        		if(Control._BackgroundProperty === undefined){
        			Control._BackgroundProperty =
                        Panel.BackgroundProperty.AddOwner(Control.Type,
                                /*new FrameworkPropertyMetadata(
                                    Panel.BackgroundProperty.DefaultMetadata.DefaultValue, 
                                    FrameworkPropertyMetadataOptions.None)*/
                        		FrameworkPropertyMetadata.Build2(
                        				Panel.BackgroundProperty.DefaultMetadata.DefaultValue, 
                                        FrameworkPropertyMetadataOptions.None));
        		}
        		
        		return Control._BackgroundProperty;
        	}
        }, 

        /// <summary>
        ///     The DependencyProperty for the Foreground property.
        ///     Flags:              Can be used in style rules 
        ///     Default Value:      System Font Color
        /// </summary> 
//        public static readonly DependencyProperty 
        ForegroundProperty:
        {
        	get:function(){
        		if(Control._ForegroundProperty === undefined){
        			Control._ForegroundProperty =
                        TextElement.ForegroundProperty.AddOwner( 
                                Control.Type,
                                /*new FrameworkPropertyMetadata(SystemColors.ControlTextBrush,
                                    FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(SystemColors.ControlTextBrush,
                                    FrameworkPropertyMetadataOptions.Inherits)); 
        		}
        		
        		return Control._ForegroundProperty;
        	}
        }, 
 
        /// <summary>
        ///     The DependencyProperty for the FontFamily property. 
        ///     Flags:              Can be used in style rules
        ///     Default Value:      System Dialog Font
        /// </summary>
//        public static readonly DependencyProperty 
        FontFamilyProperty:
        {
        	get:function(){
        		if(Control._FontFamilyProperty === undefined){
        			Control._FontFamilyProperty =
                        TextElement.FontFamilyProperty.AddOwner( 
                                Control.Type, 
                                /*new FrameworkPropertyMetadata(SystemFonts.MessageFontFamily,
                                    FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(SystemFonts.MessageFontFamily,
                                    FrameworkPropertyMetadataOptions.Inherits)); 
        		}
        		
        		return Control._FontFamilyProperty;
        	}
        }, 

        /// <summary> 
        ///     The DependencyProperty for the FontSize property. 
        ///     Flags:              Can be used in style rules
        ///     Default Value:      System Dialog Font Size 
        /// </summary>
//        public static readonly DependencyProperty 
        FontSizeProperty:
        {
        	get:function(){
        		if(Control._FontSizeProperty === undefined){
        			Control._FontSizeProperty =
                        TextElement.FontSizeProperty.AddOwner( 
                                Control.Type,
                                /*new FrameworkPropertyMetadata(SystemFonts.MessageFontSize, 
                                    FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(SystemFonts.MessageFontSize, 
                                    FrameworkPropertyMetadataOptions.Inherits)); 
        		}
        		
        		return Control._FontSizeProperty;
        	}
        }, 
 
        /// <summary>
        ///     The DependencyProperty for the FontStretch property. 
        ///     Flags:              Can be used in style rules 
        ///     Default Value:      FontStretches.Normal
        /// </summary> 
//        public static readonly DependencyProperty 
        FontStretchProperty:
        {
        	get:function(){
        		if(Control._FontStretchProperty === undefined){
        			Control._FontStretchProperty = TextElement.FontStretchProperty.AddOwner(Control.Type,
                            /*new FrameworkPropertyMetadata(TextElement.FontStretchProperty.DefaultMetadata.DefaultValue, 
                                    FrameworkPropertyMetadataOptions.Inherits)*/
        					FrameworkPropertyMetadata.Build2(TextElement.FontStretchProperty.DefaultMetadata.DefaultValue, 
                                    FrameworkPropertyMetadataOptions.Inherits));
        		}
        		
        		return Control._FontStretchProperty;
        	}
        },
            
 
        /// <summary>
        ///     The DependencyProperty for the FontStyle property.
        ///     Flags:              Can be used in style rules
        ///     Default Value:      System Dialog Font Style 
        /// </summary>
//        public static readonly DependencyProperty 
        FontStyleProperty:
        {
        	get:function(){
        		if(Control._FontStyleProperty === undefined){
        			Control._FontStyleProperty = 
                        TextElement.FontStyleProperty.AddOwner(
                                Control.Type, 
                                /*new FrameworkPropertyMetadata(SystemFonts.MessageFontStyle,
                                    FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(SystemFonts.MessageFontStyle,
                                    FrameworkPropertyMetadataOptions.Inherits)); 
        		}
        		
        		return Control._FontStyleProperty;
        	}
        }, 
 
        /// <summary> 
        ///     The DependencyProperty for the FontWeight property.
        ///     Flags:              Can be used in style rules 
        ///     Default Value:      System Dialog Font Weight
        /// </summary>
//        public static readonly DependencyProperty 
        FontWeightProperty:
        {
        	get:function(){
        		if(Control._FontWeightProperty === undefined){
        			Control._FontWeightProperty = 
                        TextElement.FontWeightProperty.AddOwner(
                                Control.Type, 
                                /*new FrameworkPropertyMetadata(SystemFonts.MessageFontWeight, 
                                    FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(SystemFonts.MessageFontWeight, 
                                    FrameworkPropertyMetadataOptions.Inherits)); 
        		}
        		
        		return Control._FontWeightProperty;
        	}
        }, 

        /// <summary> 
        /// HorizontalContentAlignment Dependency Property.
        ///     Flags:              Can be used in style rules 
        ///     Default Value:      HorizontalAlignment.Left 
        /// </summary>
//        public static readonly DependencyProperty 
        HorizontalContentAlignmentProperty:
        {
        	get:function(){
        		if(Control._HorizontalContentAlignmentProperty === undefined){
        			Control._HorizontalContentAlignmentProperty =
                    DependencyProperty.Register(
                                "HorizontalContentAlignment",
                                Number.Type/*typeof(HorizontalAlignment)*/, 
                                Control.Type,
                                /*new FrameworkPropertyMetadata(HorizontalAlignment.Left)*/
                                FrameworkPropertyMetadata.BuildWithDV(HorizontalAlignment.Left), 
                                new ValidateValueCallback(null, FrameworkElement.ValidateHorizontalAlignmentValue));  
        		}
        		
        		return Control._HorizontalContentAlignmentProperty;
        	}
        }, 

        /// <summary>
        /// VerticalContentAlignment Dependency Property. 
        ///     Flags:              Can be used in style rules
        ///     Default Value:      VerticalAlignment.Top 
        /// </summary> 
//        public static readonly DependencyProperty 
        VerticalContentAlignmentProperty:
        {
        	get:function(){
        		if(Control._VerticalContentAlignmentProperty === undefined){
        			Control._VerticalContentAlignmentProperty = 
                    DependencyProperty.Register(
                                "VerticalContentAlignment",
                                Number.Type/*typeof(VerticalAlignment)*/,
                                Control.Type, 
                                /*new FrameworkPropertyMetadata(VerticalAlignment.Top)*/
                                FrameworkPropertyMetadata.BuildWithDV(VerticalAlignment.Top),
                                new ValidateValueCallback(null, FrameworkElement.ValidateVerticalAlignmentValue)); 
 
        		}
        		
        		return Control._VerticalContentAlignmentProperty;
        	}
        }, 
        /// <summary>
        ///     The DependencyProperty for the TabIndex property.
        /// </summary> 
//        public static readonly DependencyProperty 
        TabIndexProperty:
        {
        	get:function(){
        		if(Control._TabIndexProperty === undefined){
        			Control._TabIndexProperty = KeyboardNavigation.TabIndexProperty.AddOwner(Control.Type);  
        		}
        		
        		return Control._TabIndexProperty;
        	}
        }, 
                

        /// <summary>
        ///     The DependencyProperty for the IsTabStop property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsTabStopProperty:
        {
        	get:function(){
        		if(Control._IsTabStopProperty === undefined){
        			Control._IsTabStopProperty = KeyboardNavigation.IsTabStopProperty.AddOwner(Control.Type);  
        		}
        		
        		return Control._IsTabStopProperty;
        	}
        }, 
                

        /// <summary>
        /// PaddingProperty
        /// </summary> 
//        public static readonly DependencyProperty 
        PaddingProperty:
        {
        	get:function(){
        		if(Control._PaddingProperty === undefined){
        			Control._PaddingProperty = DependencyProperty.Register( "Padding", 
        					Thickness.Type/*typeof(Thickness)*/, Control.Type,
                            /*new FrameworkPropertyMetadata( 
                                    new Thickness(),
                                    FrameworkPropertyMetadataOptions.AffectsParentMeasure)*/
        					FrameworkPropertyMetadata.Build2(new Thickness(),
                                    FrameworkPropertyMetadataOptions.AffectsParentMeasure)); 
        		}
        		
        		return Control._PaddingProperty;
        	}
        }, 
            
 
        /// <summary>
        /// TemplateProperty 
        /// </summary> 
//        public static readonly DependencyProperty 
        TemplateProperty:
        {
        	get:function(){
        		if(Control._TemplateProperty === undefined){
        			Control._TemplateProperty  = 
                        DependencyProperty.Register(
                                "Template",
                                ControlTemplate.Type/*typeof(ControlTemplate)*/,
                                Control.Type, 
                                /*new FrameworkPropertyMetadata(
                                         null,  // default value 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(null, OnTemplateChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(null,
                                		FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(null, OnTemplateChanged))); 
        			
        		}
        		
        		return Control._TemplateProperty;
        	}
        },
        
        /// <summary> 
        ///     PreviewMouseDoubleClick event 
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewMouseDoubleClickEvent:
        {
        	get:function(){
        		if(Control._PreviewMouseDoubleClickEvent === undefined){
        			Control._PreviewMouseDoubleClickEvent  = EventManager.RegisterRoutedEvent("PreviewMouseDoubleClick", 
        					RoutingStrategy.Direct, 
        					MouseButtonEventHandler.Type, 
        					Control.Type); 
        		}
        		
        		return Control._PreviewMouseDoubleClickEvent;
        	}
        },


        /// <summary>
        ///     MouseDoubleClick event
        /// </summary> 
//        public static readonly RoutedEvent 
        MouseDoubleClickEvent:
        {
        	get:function(){
        		if(Control._MouseDoubleClick === undefined){
        			Control._MouseDoubleClick  = EventManager.RegisterRoutedEvent("MouseDoubleClick", RoutingStrategy.Direct, 
        					MouseButtonEventHandler.Type, Control.Type);
        		}
        		
        		return Control._MouseDoubleClick;
        	}
        }
        
	});
	

//    private static bool 
	function IsMarginValid(/*object*/ value) 
    {
        /*Thickness*/var t = value; 
        return (t.Left >= 0.0 
                && t.Right >= 0.0
                && t.Top >= 0.0
                && t.Bottom >= 0.0);
    }
    
    // Property invalidation callback invoked when TemplateProperty is invalidated
//        private static void 
    function OnTemplateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        StyleHelper.UpdateTemplateCache(d, e.OldValue, e.NewValue, Control.TemplateProperty); 
    }
        
//        private static void 
    function HandleDoubleClick(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    {
        if (e.ClickCount == 2) 
        {
            /*Control*/var ctrl = sender;
            /*MouseButtonEventArgs*/var doubleClick = new MouseButtonEventArgs(e.MouseDevice, e.Timestamp, e.ChangedButton, e.StylusDevice);
 
            if ((e.RoutedEvent == UIElement.PreviewMouseLeftButtonDownEvent) ||
                    (e.RoutedEvent == UIElement.PreviewMouseRightButtonDownEvent)) 
            { 
                doubleClick.RoutedEvent = PreviewMouseDoubleClickEvent;
                doubleClick.Source = e.OriginalSource; // Set OriginalSource because initially is null 
                doubleClick.OverrideSource(e.Source);
                ctrl.OnPreviewMouseDoubleClick(doubleClick);
            }
            else 
            {
                doubleClick.RoutedEvent = MouseDoubleClickEvent; 
                doubleClick.Source = e.OriginalSource; // Set OriginalSource because initially is null 
                doubleClick.OverrideSource(e.Source);
                ctrl.OnMouseDoubleClick(doubleClick); 
            }

            // If MouseDoubleClick event is handled - we delegate the state to original MouseButtonEventArgs
            if (doubleClick.Handled) 
                e.Handled = true;
        } 
    }

//        internal static void 
    Control.OnVisualStatePropertyChanged = function(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        // Due to inherited properties, its safer not to cast to control because this might get fired for
        // non-controls. 
        var control = d instanceof Control ? d : null;
        if (control != null)
        {
            control.UpdateVisualState(); 
        }
    };
    
    /// <summary> 
    ///     The base class for all controls.
    /// </summary>
 
//        static Control 
    function Initialize() 
    {
        UIElement.FocusableProperty.OverrideMetadata(Control.Type, 
        		/*new FrameworkPropertyMetadata(true)*/
        		FrameworkPropertyMetadata.BuildWithDV(true)); 

        EventManager.RegisterClassHandler(Control.Type, UIElement.PreviewMouseLeftButtonDownEvent, 
        		new MouseButtonEventHandler(null, HandleDoubleClick), true);
        EventManager.RegisterClassHandler(Control.Type, UIElement.MouseLeftButtonDownEvent, 
        		new MouseButtonEventHandler(null, HandleDoubleClick), true);
        EventManager.RegisterClassHandler(Control.Type, UIElement.PreviewMouseRightButtonDownEvent, 
        		new MouseButtonEventHandler(null, HandleDoubleClick), true); 
        EventManager.RegisterClassHandler(Control.Type, UIElement.MouseRightButtonDownEvent, 
        		new MouseButtonEventHandler(null, HandleDoubleClick), true);
 
        // change handlers to update validation visual state 
        UIElement.IsKeyboardFocusedPropertyKey.OverrideMetadata(Control.Type, 
        		/*new PropertyMetadata(new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        		PropertyMetadata.BuildWithPropChangeCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
    };

	
	Control.Type = new Type("Control", Control, [FrameworkElement.Type]);
	Initialize();
	
	return Control;
});
