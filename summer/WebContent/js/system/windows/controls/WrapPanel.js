/**
 * WrapPanel
 */

define(["dojo/_base/declare", "system/Type", "controls/Panel", "windows/Size", "windows/FrameworkPropertyMetadata",
        "windows/FrameworkPropertyMetadataOptions", "windows/PropertyChangedCallback"], 
		function(declare, Type, Panel, Size, FrameworkPropertyMetadata,
				FrameworkPropertyMetadataOptions, PropertyChangedCallback){
	
	var WrapPanel = declare("WrapPanel", Panel,{
		constructor:function(){
			this._orientation = WrapPanel.OrientationProperty.GetDefaultValue(this.DependencyObjectType);
			
	        this._scrollData = null; 
	        
	        this._dom = window.document.createElement("div");
	        this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
		/// <summary> 
        /// <see cref="FrameworkElement.MeasureOverride"/>
        /// </summary> 
//        protected override Size 
		MeasureOverride:function(/*Size*/ constraint)
        {

            var children = this.InternalChildren; 
 
            for(var i=0, count = children.Count; i<count; i++)
            { 
            	var child = children.Get(i);
            	child = child instanceof UIElement ? child : null;
                if(child == null) continue;

                //Flow passes its own constrint to children 
                child.Measure(/*childConstraint*/);
            }
        },
 
        /// <summary>
        /// <see cref="FrameworkElement.ArrangeOverride"/> 
        /// </summary> 
//        protected override Size 
		ArrangeOverride:function()
        { 
            /*UIElementCollection*/var children = this.InternalChildren;
 
            for(var i=0, count = children.Count; i<count; i++)
            { 
                /*UIElement*/var child = children.Get(i); 
                child = child instanceof UIElement ? child : null; 
                if(child == null) continue;
 
                child.Arrange();
                
                this._dom.appendChild(child._dom);
                child._dom.style.setProperty("float", "left");
            }
        },
        
        OnAddChild:function(child){
        	if(this.ArrangeDirty){
        		return;
        	}
        	child.Arrange();
        	this._dom.appendChild(child._dom);
        },
        
        OnRemoveChild:function(child){
        	if(this.ArrangeDirty){
        		return;
        	}
//        	child.Arrange();
        	this._dom.removeChild(child._dom);
        },
	});
	
	Object.defineProperties(WrapPanel.prototype,{
		/// <summary>
        /// The ItemWidth and ItemHeight properties specify the size of all items in the WrapPanel.
        /// Note that children of
        /// WrapPanel may have their own Width/Height properties set - the ItemWidth/ItemHeight 
        /// specifies the size of "layout partition" reserved by WrapPanel for the child.
        /// If this property is not set (or set to "Auto" in markup or Double.NaN in code) - the size of layout 
        /// partition is equal to DesiredSize of the child element. 
        /// </summary>
//        public double 
		ItemWidth:
        {
            get:function() { return this.GetValue(WrapPanel.ItemWidthProperty); },
            set:function(value) { this.SetValue(WrapPanel.ItemWidthProperty, value); } 
        },
        
        /// <summary> 
        /// The ItemWidth and ItemHeight properties specify the size of all items in the WrapPanel.
        /// Note that children of 
        /// WrapPanel may have their own Width/Height properties set - the ItemWidth/ItemHeight 
        /// specifies the size of "layout partition" reserved by WrapPanel for the child.
        /// If this property is not set (or set to "Auto" in markup or Double.NaN in code) - the size of layout 
        /// partition is equal to DesiredSize of the child element.
        /// </summary>
//        public double 
        ItemHeight: 
        {
            get:function() { return this.GetValue(WrapPanel.ItemHeightProperty); }, 
            set:function(value) { this.SetValue(WrapPanel.ItemHeightProperty, value); } 
        },
        
        /// <summary>
        /// Specifies dimension of children positioning in absence of wrapping. 
        /// Wrapping occurs in orthogonal direction. For example, if Orientation is Horizontal,
        /// the items try to form horizontal rows first and if needed are wrapped and form vertical stack of rows. 
        /// If Orientation is Vertical, items first positioned in a vertical column, and if there is 
        /// not enough space - wrapping creates additional columns in horizontal dimension.
        /// </summary> 
//        public Orientation 
        Orientation:
        {
            get:function() { return this._orientation; },
            set:function(value) { this.SetValue(OrientationProperty, value); } 
        },
        
        
 
	});
	
	Object.defineProperties(WrapPanel,{
		/// <summary> 
        /// DependencyProperty for <see cref="ItemWidth" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		ItemWidthProperty:
        {
        	get:function(){
        		if(WrapPanel._ItemWidthProperty === undefined){
        			WrapPanel._ItemWidthProperty = 
                        DependencyProperty.Register(
                                "ItemWidth",
                                Number.Type,
                                WrapPanel.Type, 
                                /*new FrameworkPropertyMetadata(
                                        Double.NaN, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)*/
                                FrameworkPropertyMetadata.Build2(
                                        Number.NaN, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure), 
                                new ValidateValueCallback(IsWidthHeightValid));
        		}
        		
        		return WrapPanel._ItemWidthProperty;
        	}
        },  
        
        /// <summary>
        /// DependencyProperty for <see cref="ItemHeight" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		ItemHeightProperty:
        {
        	get:function(){
        		if(WrapPanel._ItemHeightProperty === undefined){
        			WrapPanel._ItemHeightProperty =
                        DependencyProperty.Register(
                                "ItemHeight", 
                                Number.Type,
                                WrapPanel.Type, 
                                /*new FrameworkPropertyMetadata( 
                                        Double.NaN,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)*/
                                FrameworkPropertyMetadata.Build2( 
                                        NUmber.NaN,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure), 
                                new ValidateValueCallback(null, IsWidthHeightValid));
        		}
        		
        		return WrapPanel._ItemHeightProperty;
        	}
        },
        
        /// <summary>
        /// DependencyProperty for <see cref="Orientation" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		OrientationProperty:
        {
        	get:function(){
        		if(WrapPanel._OrientationProperty === undefined){
        			WrapPanel._OrientationProperty = 
                        StackPanel.OrientationProperty.AddOwner(
                        		WrapPanel.Type, 
                                /*new FrameworkPropertyMetadata( 
                                        Orientation.Horizontal,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(OnOrientationChanged))*/
                        		FrameworkPropertyMetadata.Build3PCCB( 
                                        Orientation.Horizontal,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(null, OnOrientationChanged)));
        		}
        		
        		return WrapPanel._OrientationProperty;
        	}
        },
        
	});
	
//	private static bool 
	function IsWidthHeightValid(/*object*/ value) 
    {
//        double v = (double)value;
        return (Number.IsNaN(value)) || (value >= 0.0 && !Number.IsPositiveInfinity(value));
    } 
	
	 /// <summary> 
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/>
    /// </summary> 
//    private static void 
	function OnOrientationChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        WrapPanel p = (WrapPanel)d;
        d._orientation = e.NewValue; 
    }
	
	WrapPanel.Type = new Type("WrapPanel", WrapPanel, [Panel.Type]);
	return WrapPanel;
});


       

 
         

