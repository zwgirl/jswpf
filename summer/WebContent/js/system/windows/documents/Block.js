/**
 * Block
 */

define(["dojo/_base/declare", "system/Type", "documents/TextElement"], 
		function(declare, Type, TextElement){
	var Block = declare("Block", TextElement,{
		constructor:function(/*int*/ index, /*boolean*/ found){

		},
	});
	
	Object.defineProperties(Block.prototype,{

        /// <summary> 
        /// The Margin property specifies the margin of the element.
        /// </summary> 
//        public Thickness 
        Margin: 
        {
            get:function() { return this.GetValue(Block.MarginProperty); },
            set:function(value) { this.SetValue(Block.MarginProperty, value); }
        },
 
        /// <summary>
        /// The Padding property specifies the padding of the element. 
        /// </summary>
//        public Thickness 
        Padding:
        {
            get:function() { return this.GetValue(Block.PaddingProperty); },
            set:function(value) { this.SetValue(Block.PaddingProperty, value); }
        }, 

        /// <summary>
        /// The BorderThickness property specifies the border of the element. 
        /// </summary>
//        public Thickness 
        BorderThickness: 
        { 
            get:function() { return this.GetValue(Block.BorderThicknessProperty); },
            set:function(value) { this.SetValue(Block.BorderThicknessProperty, value); } 
        },

        /// <summary> 
        /// The BorderBrush property specifies the brush of the border. 
        /// </summary>
//        public Brush 
        BorderBrush: 
        {
            get:function() { return this.GetValue(Block.BorderBrushProperty); },
            set:function(value) { this.SetValue(Block.BorderBrushProperty, value); }
        }, 
        /// <summary>
        ///
        /// </summary>
//        public TextAlignment 
        TextAlignment: 
        {
            get:function() { return this.GetValue(Block.TextAlignmentProperty); },
            set:function(value) { this.SetValue(Block.TextAlignmentProperty, value); } 
        },
 
        /// <summary> 
        /// The FlowDirection property specifies the flow direction of the element.
        /// </summary>
//        public FlowDirection 
        FlowDirection:
        { 
            get:function() { return this.GetValue(Block.FlowDirectionProperty); },
            set:function(value) { this.SetValue(Block.FlowDirectionProperty, value); } 
        }, 

        /// <summary> 
        /// The LineHeight property specifies the height of each generated line box.
        /// </summary> 
//        public double 
        LineHeight:
        { 
            get:function() { return this.GetValue(Block.LineHeightProperty); },
            set:function(value) { this.SetValue(Block.LineHeightProperty, value); }
        },
 
        /// <summary>
        /// The LineStackingStrategy property specifies how lines are placed 
        /// </summary>
//        public LineStackingStrategy 
        LineStackingStrategy: 
        { 
            get:function() { return this.GetValue(Block.LineStackingStrategyProperty); },
            set:function(value) { this.SetValue(Block.LineStackingStrategyProperty, value); } 
        },
        /// <summary>
        /// The BreakPageBefore property indicates that a break should occur before this page 
        /// </summary>
//        public bool 
        BreakPageBefore:
        {
            get:function() { return this.GetValue(Block.BreakPageBeforeProperty); },
            set:function(value) { this.SetValue(Block.BreakPageBeforeProperty, value); }
        }, 

        /// <summary>
        /// The BreakColumnBefore property indicates that a break should occur before this column
        /// </summary> 
//        public bool 
        BreakColumnBefore:
        { 
            get:function() { return this.GetValue(Block.BreakColumnBeforeProperty); },
            set:function(value) { this.SetValue(Block.BreakColumnBeforeProperty, value); }
        }, 

        /// <summary> 
        /// ClearFloaters property, replaces FloaterClear element. Clears floater in specified WrapDirection 
        /// </summary>
//        public WrapDirection 
        ClearFloaters: 
        {
            get:function() { return this.GetValue(Block.ClearFloatersProperty); },
            set:function(value) { this.SetValue(Block.ClearFloatersProperty, value); }
        }, 

        /// <summary> 
        /// Marks this element's left edge as visible to IMEs.
        /// This means element boundaries will act as word breaks.
        /// </summary>
//        internal override bool 
        IsIMEStructuralElement: 
        {
            get:function() 
            { 
                return true;
            } 
        },

	});
	
	Object.defineProperties(Block,{

        /// <summary> 
        /// DependencyProperty for <see cref="Margin" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		MarginProperty:
        {
        	get:function(){
            	if(Block._MarginProperty === undefined){
            		Block._MarginProperty =
                        DependencyProperty.Register( 
                                "Margin",
                                Thickness.Type, 
                                Block.Type, 
                                /*new FrameworkPropertyMetadata(
                                        new Thickness(), 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)*/
                                FrameworkPropertyMetadata.Build2(
                                        new Thickness(), 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure),
                                new ValidateValueCallback(null, IsValidMargin));
            	}
            	
            	return Block._MarginProperty;
        	}
        }, 

        /// <summary> 
        /// DependencyProperty for <see cref="Padding" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		PaddingProperty:
        {
        	get:function(){
            	if(Block._PaddingProperty === undefined){
            		Block._PaddingProperty = 
                        DependencyProperty.Register(
                                "Padding", 
                                Thickness.Type,
                                Block.Type,
                                /*new FrameworkPropertyMetadata(
                                        new Thickness(), 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)*/
                                FrameworkPropertyMetadata.Build2(
                                        new Thickness(), 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure),
                                new ValidateValueCallback(null, IsValidPadding)); 
            	}
            	
            	return Block._PaddingProperty;
        	}
        }, 
 
        /// <summary>
        /// DependencyProperty for <see cref="BorderThickness" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		BorderThicknessProperty:
        {
        	get:function(){
            	if(Block._BorderThicknessProperty === undefined){
            		Block._BorderThicknessProperty =
                        DependencyProperty.Register(
                                "BorderThickness", 
                                Thickness.Type,
                                Block.Type, 
                                /*new FrameworkPropertyMetadata( 
                                        new Thickness(),
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)*/
                                FrameworkPropertyMetadata.Build2( 
                                        new Thickness(),
                                        FrameworkPropertyMetadataOptions.AffectsMeasure), 
                                new ValidateValueCallback(null, IsValidBorderThickness));
            	}
            	
            	return Block._BorderThicknessProperty;
        	}
        }, 


        /// <summary>
        /// DependencyProperty for <see cref="BorderBrush" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		BorderBrushProperty:
        {
        	get:function(){
            	if(Block._BorderBrushProperty === undefined){
            		Block._BorderBrushProperty  = 
                        DependencyProperty.Register( 
                                "BorderBrush",
                                Brush.Type, 
                                Block.Type,
                                /*new FrameworkPropertyMetadata(
                                        null,
                                        FrameworkPropertyMetadataOptions.AffectsRender)*/
                                FrameworkPropertyMetadata.Build2(
                                        null,
                                        FrameworkPropertyMetadataOptions.AffectsRender)); 
            	}
            	
            	return Block._BorderBrushProperty;
        	}
        },


        /// <summary> 
        /// DependencyProperty for <see cref="TextAlignment" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		TextAlignmentProperty:
        {
        	get:function(){
            	if(Block._TextAlignmentProperty === undefined){
            		Block._TextAlignmentProperty = 
                        DependencyProperty.RegisterAttached(
                                "TextAlignment",
                                Number.Type,
                                Block.Type, 
                                /*new FrameworkPropertyMetadata(
                                        TextAlignment.Left, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(
                                        TextAlignment.Left, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits), 
                                new ValidateValueCallback(null, IsValidTextAlignment));
            	}
            	
            	return Block._TextAlignmentProperty;
        	}
        },
 

        /// <summary>
        /// DependencyProperty for <see cref="FlowDirection" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		FlowDirectionProperty:
        {
        	get:function(){
            	if(Block._FlowDirectionProperty === undefined){
            		Block._FlowDirectionProperty = 
                        FrameworkElement.FlowDirectionProperty.AddOwner(Block.Type); 
            	}
            	
            	return Block._FlowDirectionProperty;
        	}
        },


        /// <summary> 
        /// DependencyProperty for <see cref="LineHeight" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		LineHeightProperty:
        {
        	get:function(){
            	if(Block._LineHeightProperty === undefined){
            		Block._LineHeightProperty =
                        DependencyProperty.RegisterAttached( 
                                "LineHeight",
                                Number.Type, 
                                Block.Type, 
                                /*new FrameworkPropertyMetadata(
                                        Number.NaN, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(
                                        Number.NaN, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits),
                                new ValidateValueCallback(null, IsValidLineHeight));
            	}
            	
            	return Block._LineHeightProperty;
        	}
        },

 
        /// <summary>
        /// DependencyProperty for <see cref="LineStackingStrategy" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		LineStackingStrategyProperty:
        {
        	get:function(){
            	if(Block._LineStackingStrategyProperty === undefined){
            		Block._LineStackingStrategyProperty =
                        DependencyProperty.RegisterAttached(
                                "LineStackingStrategy", 
                                Number.Type,
                                Block.Type, 
                                /*new FrameworkPropertyMetadata( 
                                        LineStackingStrategy.MaxHeight,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2( 
                                        LineStackingStrategy.MaxHeight,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits), 
                                new ValidateValueCallback(null, IsValidLineStackingStrategy));
            	}
            	
            	return Block._LineStackingStrategyProperty;
        	}
        },
        /// <summary>
        /// Page break property, replaces PageBreak element. Indicates that a break should occur before this page. 
        /// </summary> 
//        public static readonly DependencyProperty 
		BreakPageBeforeProperty:
        {
        	get:function(){
            	if(Block._BreakPageBeforeProperty === undefined){
            		Block._BreakPageBeforeProperty =
                        DependencyProperty.Register( 
                                "BreakPageBefore",
                                Boolean.Type,
                                Block.Type,
                                /*new FrameworkPropertyMetadata( 
                                        false,
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure)*/
                                FrameworkPropertyMetadata.Build2( 
                                        false,
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure)); 
            	}
            	
            	return Block._BreakPageBeforeProperty;
        	}
        },
 
        /// <summary>
        /// Column break property, replaces ColumnBreak element. Indicates that a break should occur before this column. 
        /// </summary>
//        public static readonly DependencyProperty 
		BreakColumnBeforeProperty:
        {
        	get:function(){
            	if(Block._BreakColumnBeforeProperty === undefined){
            		Block._BreakColumnBeforeProperty =
                        DependencyProperty.Register(
                                "BreakColumnBefore", 
                                Boolean.Type,
                                Block.Type, 
                                /*new FrameworkPropertyMetadata( 
                                        false,
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure)*/
                                FrameworkPropertyMetadata.Build2( 
                                        false,
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure)); 
            	}
            	
            	return Block._BreakColumnBeforeProperty;
        	}
        },

        /// <summary>
        /// ClearFloaters property, replaces FloaterClear element. Clears floater in specified WrapDirection
        /// </summary> 
//        public static readonly DependencyProperty 
		ClearFloatersProperty:
        {
        	get:function(){
            	if(Block._ClearFloatersProperty === undefined){
            		Block._ClearFloatersProperty =
                        DependencyProperty.Register( 
                                "ClearFloaters", 
                                Number.Type,
                                Block.Type, 
                                /*new FrameworkPropertyMetadata(
                                        WrapDirection.None,
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure)*/
                                FrameworkPropertyMetadata.Build2(
                                        WrapDirection.None,
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure),
                                new ValidateValueCallback(null, IsValidWrapDirection));
            	}
            	
            	return Block._ClearFloatersProperty;
        	}
        }, 
	});
	

    /// <summary> 
    /// DependencyProperty setter for <see cref="IsHyphenationEnabled" /> property.
    /// </summary> 
    /// <param name="element">The element to which to write the attached property.</param>
    /// <param name="value">The property value to set</param>
//    public static void 
	Block.SetIsHyphenationEnabled = function(/*DependencyObject*/ element, /*bool*/ value)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(Block.IsHyphenationEnabledProperty, value);
    };

    /// <summary> 
    /// DependencyProperty getter for <see cref="IsHyphenationEnabled" /> property.
    /// </summary> 
    /// <param name="element">The element from which to read the attached property.</param> 
//    public static bool 
    Block.GetIsHyphenationEnabled = function(/*DependencyObject*/ element)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 

        return element.GetValue(Block.IsHyphenationEnabledProperty); 
    }; 

    /// <summary>
    /// DependencyProperty setter for <see cref="TextAlignment" /> property.
    /// </summary>
    /// <param name="element">The element to which to write the attached property.</param> 
    /// <param name="value">The property value to set</param>
//    public static void 
    Block.SetTextAlignment = function(/*DependencyObject*/ element, /*TextAlignment*/ value) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }

        element.SetValue(Block.TextAlignmentProperty, value); 
    };

    /// <summary> 
    /// DependencyProperty getter for <see cref="TextAlignment" /> property.
    /// </summary> 
    /// <param name="element">The element from which to read the attached property.</param>
//    public static TextAlignment 
    Block.GetTextAlignment = function(/*DependencyObject*/ element)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 

        return element.GetValue(Block.TextAlignmentProperty); 
    };

    /// <summary>
    /// DependencyProperty setter for <see cref="LineHeight" /> property. 
    /// </summary> 
    /// <param name="element">The element to which to write the attached property.</param>
    /// <param name="value">The property value to set</param> 
//    public static void 
    Block.SetLineHeight = function(/*DependencyObject*/ element, /*double*/ value)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 

        element.SetValue(Block.LineHeightProperty, value);
    };

    /// <summary>
    /// DependencyProperty getter for <see cref="LineHeight" /> property.
    /// </summary> 
    /// <param name="element">The element from which to read the attached property.</param>
//    public static double 
    Block.GetLineHeight = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }

        return element.GetValue(Block.LineHeightProperty);
    }; 

    /// <summary>
    /// DependencyProperty setter for <see cref="LineStackingStrategy" /> property. 
    /// </summary>
    /// <param name="element">The element to which to write the attached property.</param> 
    /// <param name="value">The property value to set</param> 
//    public static void 
    Block.SetLineStackingStrategy = function(/*DependencyObject*/ element, /*LineStackingStrategy*/ value)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 

        element.SetValue(Block.LineStackingStrategyProperty, value); 
    }; 

    /// <summary> 
    /// DependencyProperty getter for <see cref="LineStackingStrategy" /> property.
    /// </summary>
    /// <param name="element">The element from which to read the attached property.</param>
//    public static LineStackingStrategy 
    Block.GetLineStackingStrategy = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        return element.GetValue(Block.LineStackingStrategyProperty);
    };


//    internal static bool 
    Block.IsValidMargin = function(/*object*/ o) 
    {
        return IsValidThickness(o, /*allow NaN*/true);
    };

//    internal static bool 
    Block.IsValidPadding = function(/*object*/ o) 
    {
        return IsValidThickness(o, /*allow NaN*/true); 
    };

//    internal static bool 
    Block.IsValidBorderThickness = function(/*object*/ o)
    {
        return IsValidThickness(o, /*allow NaN*/false); 
    };

//    private static bool 
    function IsValidLineHeight(/*object*/ o) 
    {
        var lineHeight = o; 
        var minLineHeight = TextDpi.MinWidth; 
        var maxLineHeight = Math.min(1000000, PTS.MaxFontSize);

        if (Double.IsNaN(lineHeight))
        {
            return true;
        } 
        if (lineHeight < minLineHeight)
        { 
            return false; 
        }
        if (lineHeight > maxLineHeight) 
        {
            return false;
        }
        return true; 
    }

//    private static bool 
    function IsValidLineStackingStrategy(/*object*/ o) 
    {
        return (o == LineStackingStrategy.MaxHeight
                || o == LineStackingStrategy.BlockLineHeight);
    }

//    private static bool 
    function IsValidTextAlignment(/*object*/ o)
    { 
        return o == TextAlignment.Center
            || o == TextAlignment.Justify 
            || o == TextAlignment.Left
            || o == TextAlignment.Right;
    }

//    private static bool 
    function IsValidWrapDirection(/*object*/ o)
    { 
        return o == WrapDirection.None
            || o == WrapDirection.Left 
            || o == WrapDirection.Right
            || o == WrapDirection.Both;
    }

//    internal static bool 
    Block.IsValidThickness = function(/*Thickness*/ t, /*bool*/ allowNaN)
    { 
        var maxThickness = Math.min(1000000, PTS.MaxPageSize); 
        if (!allowNaN)
        { 
            if (Double.IsNaN(t.Left) || Double.IsNaN(t.Right) || Double.IsNaN(t.Top) || Double.IsNaN(t.Bottom))
            {
                return false;
            } 
        }
        if (!Double.IsNaN(t.Left) && (t.Left < 0 || t.Left > maxThickness)) 
        { 
            return false;
        } 
        if (!Double.IsNaN(t.Right) && (t.Right < 0 || t.Right > maxThickness))
        {
            return false;
        } 
        if (!Double.IsNaN(t.Top) && (t.Top < 0 || t.Top > maxThickness))
        { 
            return false; 
        }
        if (!Double.IsNaN(t.Bottom) && (t.Bottom < 0 || t.Bottom > maxThickness)) 
        {
            return false;
        }
        return true; 
    };
	
	Block.Type = new Type("Block", Block, [TextElement.Type]);
	return Block;
});

  

