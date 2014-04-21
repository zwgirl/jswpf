/**
 * Border1
 */

define(["dojo/_base/declare", "system/Type", 
        "controls/Decorator", "windows/DependencyProperty", "windows/Thickness", "windows/CornerRadius",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, 
				Decorator, DependencyProperty, Thickness, CornerRadius,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Border1 = declare("Border1", Decorator, {
		constructor:function(){
			this._dom = window.document.createElement('div');
			this._dom.tabIndex = -1;
//	        this._dom.style.setProperty("border", "thin dotted #0000FF");
	        
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
	          	if(dp === Border1.BackgroundProperty){
            		if(e.NewValue){
            			this._dom.style.setProperty("background-color",e.NewValue.Color.ToString(),"");
            		}else{
            			this._dom.style.setProperty("background-color", "","");
            		}
            		
            	}
	          	
	          	if(dp === Border1.ForegroundProperty){
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
        /// <summary>
        /// Updates DesiredSize of the Border1.  Called by parent UIElement.  This is the first pass of layout. 
        /// </summary> 
        /// <remarks>
        /// Border1 determines its desired size it needs from the specified border the child: its sizing 
        /// properties, margin, and requested size.
        /// </remarks>
        /// <param name="constraint">Constraint size is an "upper limit" that the return value should not exceed.</param>
        /// <returns>The Decorator's desired size.</returns> 
//        protected override Size 
//        MeasureOverride:function()
//        { 
////        	this._dom = window.document.createElement('div');
//            if (this.Child != null) 
//            { 
//            	this.Child.Measure(); 
//            } 
//        },
 

        /// <summary> 
        /// Border1 computes the position of its single child and applies its child's alignments to the child. 
        ///
        /// </summary> 
        /// <param name="finalSize">The size reserved for this element by the parent</param>
        /// <returns>The actual ink area of the element, typically the same as finalSize</returns>
//        protected override Size 
        ArrangeOverride:function()
        { 
        	if(this.ArrangeDirty){
//        		parent.appendChild(this._dom);
        		
            	var borders = this.BorderThickness;

                if (this.Child != null)
                {
                	this.Child.Arrange(this._dom);
                	
                	this._dom.appendChild(this.Child._dom);
                }
                
                this.ArrangeDirty = false;
                
               	var foreground = this.Foreground;
               	if( foreground!= null){
            		this._dom.style.setProperty("background-color", foreground.Color.ToString(), "");
            	}
        	}

        },
	});
	
	Object.defineProperties(Border1.prototype,{

        /// <summary>
        /// The BorderThickness property defined how thick a border to draw.  The property's value is a 
        /// <see cref="System.Windows.Thickness" /> containing values for each of the Left, Top, Right,
        /// and Bottom sides.  Values of Auto are interpreted as zero. 
        /// </summary> 
//        public Thickness 
        BorderThickness:
        { 
            get:function() { return this.GetValue(Border1.BorderThicknessProperty); },
            set:function(value) { this.SetValue(Border1.BorderThicknessProperty, value); }
        },
 
        /// <summary>
        /// The Padding property inflates the effective size of the child by the specified thickness.  This 
        /// achieves the same effect as adding margin on the child, but is present here for convenience. 
        /// </summary>
//        public Thickness 
        Padding: 
        {
            get:function() { return this.GetValue(Border1.PaddingProperty); },
            set:function(value) { this.SetValue(Border1.PaddingProperty, value); }
        },

        /// <summary> 
        /// The CornerRadius property allows users to control the roundness of the corners independently by 
        /// setting a radius value for each corner.  Radius values that are too large are scaled so that they
        /// smoothly blend from corner to corner. 
        /// </summary>
//        public CornerRadius 
        CornerRadius:
        {
            get:function() { return this.GetValue(Border1.CornerRadiusProperty); }, 
            set:function(value) { this.SetValue(Border1.CornerRadiusProperty, value); }
        }, 

        /// <summary> 
        /// The BorderBrush property defines the brush used to fill the border region.
        /// </summary>
//        public Brush 
        BorderBrush:
        { 
            get:function() { return this.GetValue(Border1.BorderBrushProperty); },
            set:function(value) { this.SetValue(Border1.BorderBrushProperty, value); } 
        }, 

        /// <summary> 
        /// The Background property defines the brush used to fill the area within the border.
        /// </summary>
//        public Brush 
        Background:
        { 
            get:function() { return this.GetValue(Border1.BackgroundProperty); },
            set:function(value) { this.SetValue(Border1.BackgroundProperty, value); } 
        } 

	});
	

	Object.defineProperties(Border1, {
	    /// <summary> 
	    /// DependencyProperty for <see cref="BorderThickness" /> property.
	    /// </summary>
//	    public static readonly DependencyProperty 
	    BorderThicknessProperty:
	    {
	    	get:function(){
	    		if(Border1._BorderThicknessProperty == undefined){
	    			Border1._BorderThicknessProperty = DependencyProperty.Register("BorderThickness", Thickness.Type, Border1.Type,
                            /*new FrameworkPropertyMetadata( 
                                    new Thickness(), 
                                    FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender,
                                    new PropertyChangedCallback(Border1, OnClearPenCache))*/
	    					FrameworkPropertyMetadata.Build3PCCB(new Thickness(), 
                                    FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender,
                                    new PropertyChangedCallback(null, OnClearPenCache)), 
                              new ValidateValueCallback(null, IsThicknessValid)); 
	    		}
	    		
	    		return Border1._BorderThicknessProperty;
	    	}
	    },

	    /// <summary> 
	    /// DependencyProperty for <see cref="Padding" /> property.
	    /// </summary>
//	    public static readonly DependencyProperty 
	    PaddingProperty:
	    {
	    	get:function(){
	    		if(Border1._PaddingProperty == undefined){
	    			Border1._PaddingProperty = DependencyProperty.Register("Padding", Thickness.Type, Border1.Type, 
                            /*new FrameworkPropertyMetadata(
                                    new Thickness(), 
                                    FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender)*/
	    					FrameworkPropertyMetadata.Build2(new Thickness(), 
                                    FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender), 
                              new ValidateValueCallback(null, IsThicknessValid));
	    		}
	    		
	    		return Border1._PaddingProperty;
	    	}
	    },
	        

	    /// <summary>
	    /// DependencyProperty for <see cref="CornerRadius" /> property.
	    /// </summary>
//	    public static readonly DependencyProperty 
	    CornerRadiusProperty:
	    {
	    	get:function(){
	    		if(Border1._CornerRadiusProperty == undefined){
	    			Border1._CornerRadiusProperty = DependencyProperty.Register("CornerRadius", CornerRadius.Type, Border1.Type,
                            /*new FrameworkPropertyMetadata( 
                                    new CornerRadius(), 
                                    FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender)*/
	    					FrameworkPropertyMetadata.Build2(new CornerRadius(), 
                                    FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender),
                              new ValidateValueCallback(null, IsCornerRadiusValid)); 
	    		}
	    		
	    		return Border1._CornerRadiusProperty;
	    	}
	    },
	        


	    /// <summary>
	    /// DependencyProperty for <see cref="BorderBrush" /> property. 
	    /// </summary>
//	    public static readonly DependencyProperty 
	    BorderBrushProperty:
	    {
	    	get:function(){
	    		if(Border1._BorderBrushProperty === undefined){
	    			Border1._BorderBrushProperty = DependencyProperty.Register("BorderBrush", Brush.Type, Border1.Type, 
                            /*new FrameworkPropertyMetadata(
                                    (Brush)null, 
                                    FrameworkPropertyMetadataOptions.AffectsRender | 
                                    FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender,
                                    new PropertyChangedCallback(OnClearPenCache))*/
	    					FrameworkPropertyMetadata.Build3PCCB(null, 
                                    FrameworkPropertyMetadataOptions.AffectsRender | 
                                    FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender,
                                    new PropertyChangedCallback(null, OnClearPenCache))); 
	    		}
	    		
	    		return Border1._BorderBrushProperty;
	    	}
	    },
	         

	    /// <summary>
	    /// DependencyProperty for <see cref="Background" /> property.
	    /// </summary> 
//	    public static readonly DependencyProperty 
	    BackgroundProperty:
	    {
	    	get:function(){
	    		if(Border1._BorderThicknessProperty === undefined){
	    			Border1._BorderThicknessProperty = 
	    	            Panel.BackgroundProperty.AddOwner(Border1.Type, 
	    	                    /*new FrameworkPropertyMetadata(
	    	                            (Brush)null, 
	    	                            FrameworkPropertyMetadataOptions.AffectsRender |
	    	                            FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender)*/
	    	            		FrameworkPropertyMetadata.Build2(null, 
	    	                            FrameworkPropertyMetadataOptions.AffectsRender |
	    	                            FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender)); 
	    		}
	    		
	    		return Border1._BorderThicknessProperty;
	    	}
	    }
	    		
	});
	
//    private static void 
	function OnClearPenCache(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        d.LeftPenCache = null; 
//        d.RightPenCache = null; 
//        d.TopPenCache = null;
//        d.BottomPenCache = null; 
    }

//    private static bool 
    function IsThicknessValid(/*object*/ value)
    { 
        return value.IsValid(false, false, false, false); 
    } 
    

//    private static bool 
    function IsCornerRadiusValid(/*object*/ value)
    {
        return value.IsValid(false, false, false, false);
    } 
	
	Border1.Type = new Type("Border1", Border1, [Decorator.Type]);
	return Border1;
});






