/**
 * Inline
 */

define(["dojo/_base/declare", "system/Type", "documents/TextElement"], 
		function(declare, Type, TextElement){
	var Inline = declare("Inline", TextElement,{
		constructor:function(){
		},
	
	});
	
	Object.defineProperties(Inline.prototype,{

        /// <summary> 
        ///
        /// </summary> 
//        public BaselineAlignment 
        BaselineAlignment: 
        {
            get:function() { return this.GetValue(Inline.BaselineAlignmentProperty); }, 
            set:function(value) { this.SetValue(Inline.BaselineAlignmentProperty, value); }
        },
        /// <summary>
        /// The TextDecorations property specifies decorations that are added to the text of an element. 
        /// </summary>
//        public TextDecorationCollection 
        TextDecorations:
        {
            get:function() { return this.GetValue(Inline.TextDecorationsProperty); }, 
            set:function(value) { this.SetValue(Inline.TextDecorationsProperty, value); }
        }, 
 
        /// <summary>
        /// The FlowDirection property specifies the flow direction of the element. 
        /// </summary> 
//        public FlowDirection 
        FlowDirection:
        { 
            get:function() { return this.GetValue(Inline.FlowDirectionProperty); },
            set:function(value) { this.SetValue(Inline.FlowDirectionProperty, value); }
        }
	});
	
	Object.defineProperties(Inline,{
	    /// <summary> 
        /// DependencyProperty for <see cref="BaselineAlignment" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		BaselineAlignmentProperty:
        {
        	get:function(){
            	if(TextElement._ForegroundProperty === undefined){
            		TextElement._ForegroundProperty =
                        DependencyProperty.Register( 
                                "BaselineAlignment",
                                Number.Type, 
                                Inline.Type, 
                                new FrameworkPropertyMetadata(
                                        BaselineAlignment.Baseline, 
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure),
                                new ValidateValueCallback(IsValidBaselineAlignment));
            	}
            	
            	return TextElement._ForegroundProperty;
        	}
        },

        /// <summary> 
        /// DependencyProperty for <see cref="TextDecorations" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		TextDecorationsProperty:
        {
        	get:function(){
            	if(TextElement._ForegroundProperty === undefined){
            		TextElement._ForegroundProperty = 
                        DependencyProperty.Register(
                                "TextDecorations", 
                                TextDecorationCollection.Type,
                                Inline.Type,
                                new FrameworkPropertyMetadata(
                                        new FreezableDefaultValueFactory(TextDecorationCollection.Empty), 
                                        FrameworkPropertyMetadataOptions.AffectsRender
                                        )); 
            	}
            	
            	return TextElement._ForegroundProperty;
        	}
        },
 
        /// <summary>
        /// DependencyProperty for <see cref="FlowDirection" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		FlowDirectionProperty:
        {
        	get:function(){
            	if(TextElement._ForegroundProperty === undefined){
            		TextElement._ForegroundProperty =
                        FrameworkElement.FlowDirectionProperty.AddOwner(Inline.Type);
            	}
            	
            	return TextElement._ForegroundProperty;
        	}
        },
 
	});

//    internal static Run 
	TextElement.CreateImplicitRun = function(/*DependencyObject*/ parent) 
    { 
        return new Run();
    }; 

//    internal static InlineUIContainer 
	TextElement.CreateImplicitInlineUIContainer = function(/*DependencyObject*/ parent)
    {
        return new InlineUIContainer(); 
    };
//    private static bool 
	function IsValidBaselineAlignment(/*object*/ o) 
    {
        return o == BaselineAlignment.Baseline
            || o == BaselineAlignment.Bottom
            || o == BaselineAlignment.Center
            || o == BaselineAlignment.Subscript 
            || o == BaselineAlignment.Superscript
            || o == BaselineAlignment.TextBottom 
            || o == BaselineAlignment.TextTop 
            || o == BaselineAlignment.Top;
    } 
	
	Inline.Type = new Type("Inline", Inline, [TextElement.Type]);
	return Inline;
});

 


