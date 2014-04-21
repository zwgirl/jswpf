/**
 * FlowDocument
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkContentElement", "markup/IAddChild"], 
		function(declare, Type, FrameworkContentElement, IAddChild){
	var FlowDocument = declare("FlowDocument", [FrameworkContentElement, IAddChild],{
		constructor:function(){
		},
		
	     /// <summary>
        /// Notification that a specified property has been invalidated
        /// </summary> 
        /// <param name="e">EventArgs that contains the property, metadata, old value, and new value for this change</param>
//        protected sealed override void 
		OnPropertyChanged:function(/*DependencyPropertyChangedEventArgs*/ e) 
        { 
            // Always call base.OnPropertyChanged, otherwise Property Engine will not work.
			FrameworkContentElement.prototype.OnPropertyChanged.call(this, e); 

            if (e.IsAValueChange || e.IsASubPropertyChange)
            {
            	
            }
        }, 


        /// <summary> 
        /// Called before the parent is changed to the new value. 
        /// We listen to parent change notifications to enforce coercing FlowDocument's IsEnabled property to false
        /// (when it is parented by RichTextBox). 
        /// This property coersion is done in 2 parts.
        ///     1. Implement IsEnabledCore for property coersion
        ///     2. Listen to changes to parent
        /// (2) needs to be done, since property system does not coerce default values. 
        /// Listening to parent changes guarantees that every time FlowDocument is removed or connected to a RichTextBox parent,
        /// we explicitly coerce IsEnabled for the new tree. 
        /// </summary> 
        /// <param name="newParent"></param>
//        internal override void 
        OnNewParent:function(/*DependencyObject*/ newParent) 
        {
            /*DependencyObject*/var oldParent = this.Parent;
            FrameworkContentElement.prototype.OnNewParent.call(this, newParent);
 
            if (newParent instanceof RichTextBox || oldParent instanceof RichTextBox)
            { 
                CoerceValue(IsEnabledProperty); 
            }
        }, 

        
        ///<summary> 
        /// Called to Add the object as a Child. 
        ///</summary>
        ///<param name="value"> 
        /// Object to add as a child
        ///</param>
//        void IAddChild.
        AddChild:function(/*Object*/ value)
        { 
            if (value == null)
            { 
                throw new ArgumentNullException("value"); 
            }
 
//            if (!TextSchema.IsValidChildOfContainer(/*parentType:*/FlowDocument.Type, /*childType:*/value.GetType()))
//            {
//                throw new ArgumentException(SR.Get(SRID.TextSchema_ChildTypeIsInvalid, FlowDocument.Type.Name, value.GetType().Name));
//            } 

            // Checking that the element inserted does not have a parent 
            if (value instanceof TextElement && value.Parent != null) 
            {
                throw new ArgumentException(SR.Get(SRID.TextSchema_TheChildElementBelongsToAnotherTreeAlready, value.GetType().Name)); 
            }

            if (value instanceof Block)
            { 
                this.Blocks.Add(value); 
            } 
            else
            { 
                Invariant.Assert(false); // We do not expect anything except Blocks on top level of a FlowDocument
            }
        },
 
        ///<summary>
        /// Called when text appears under the tag in markup 
        ///</summary> 
        ///<param name="text">
        /// Text to Add to the Object 
        ///</param>
//        void IAddChild.
        AddText:function(/*string*/ text)
        {
            XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
        },
        
        Arrange:function(parent /*DOM element*/){
        	for(var i=0; i<this.Blocks.Count; i++){
        		var block = this.Blocks.Get(i);
        		block.Arrange(parent);
        	}
        },
 
	});
	
	Object.defineProperties(FlowDocument.prototype,{
        /// <value>
        /// Collection of Blocks contained in this element
        /// </value>
//        public BlockCollection 
		Blocks:
        { 
            get:function() 
            {
            	if(this._blocks === undefined){
            		this._blocks = new TextElementCollection(this);
            	}
                return  this._blocks; 
            }
        },
        
        /// <summary>
        /// Returns enumerator to logical children.
        /// </summary>
//        protected internal override IEnumerator 
        LogicalChildren: 
        {
            get:function() 
            { 
                return this._blocks.GetEnumerator();
            }
        },
 
        /// <summary>
        /// The FontFamily property specifies the font family. 
        /// </summary>
//        public FontFamily 
        FontFamily: 
        { 
            get:function() { return this.GetValue(FlowDocument.FontFamilyProperty); },
            set:function(value) { this.SetValue(FlowDocument.FontFamilyProperty, value); } 
        },

        /// <summary> 
        /// The FontStyle property requests normal, italic, and oblique faces within a font family.
        /// </summary>
//        public FontStyle 
        FontStyle:
        { 
            get:function() { return this.GetValue(FlowDocument.FontStyleProperty); },
            set:function(value) { this.SetValue(FlowDocument.FontStyleProperty, value); } 
        }, 

        /// <summary> 
        /// The FontWeight property specifies the weight of the font. 
        /// </summary>
//        public FontWeight 
        FontWeight: 
        {
            get:function() { return this.GetValue(FlowDocument.FontWeightProperty); },
            set:function(value) { this.SetValue(FlowDocument.FontWeightProperty, value); }
        }, 

        /// <summary>
        /// The FontStretch property selects a normal, condensed, or extended face from a font family. 
        /// </summary>
//        public FontStretch 
        FontStretch: 
        { 
            get:function() { return this.GetValue(FlowDocument.FontStretchProperty); },
            set:function(value) { this.SetValue(FlowDocument.FontStretchProperty, value); } 
        },
 
        /// <summary>
        /// The FontSize property specifies the size of the font.
        /// </summary>
//        public double 
        FontSize: 
        { 
            get:function() { return this.GetValue(FlowDocument.FontSizeProperty); },
            set:function(value) { this.SetValue(FlowDocument.FontSizeProperty, value); } 
        },
 
        /// <summary>
        /// The Foreground property specifies the foreground brush of an element's text content.
        /// </summary>
//        public Brush 
        Foreground: 
        {
            get:function() { return this.GetValue(FlowDocument.ForegroundProperty); }, 
            set:function(value) { this.SetValue(FlowDocument.ForegroundProperty, value); } 
        },

        /// <summary>
        /// The Background property defines the brush used to fill the content area.
        /// </summary> 
//        public Brush 
        Background:
        { 
            get:function() { return this.GetValue(FlowDocument.BackgroundProperty); }, 
            set:function(value) { this.SetValue(FlowDocument.BackgroundProperty, value); }
        }, 

        /// <summary>
        /// The TextEffects property specifies effects that are added to the text of an element. 
        /// </summary>
//        public TextEffectCollection 
        TextEffects: 
        { 
            get:function() { return this.GetValue(FlowDocument.TextEffectsProperty); },
            set:function(value) { this.SetValue(FlowDocument.TextEffectsProperty, value); } 
        },

        /// <summary> 
        /// The TextAlignment property specifies the alignmnet of the element.
        /// </summary>
//        public TextAlignment 
        TextAlignment:
        { 
            get:function() { return this.GetValue(FlowDocument.TextAlignmentProperty); },
            set:function(value) { this.SetValue(FlowDocument.TextAlignmentProperty, value); } 
        }, 

        /// <summary> 
        /// The FlowDirection property specifies the flow direction of the element. 
        /// </summary>
//        public FlowDirection 
        FlowDirection: 
        {
            get:function() { return this.GetValue(FlowDocument.FlowDirectionProperty); },
            set:function(value) { this.SetValue(FlowDocument.FlowDirectionProperty, value); }
        }, 

        /// <summary>
        /// The LineHeight property specifies the height of each generated line box. 
        /// </summary>
//        public double 
        LineHeight: 
        {
            get:function() { return this.GetValue(FlowDocument.LineHeightProperty); }, 
            set:function(value) { this.SetValue(FlowDocument.LineHeightProperty, value); }
        },
 
        /// <summary>
        /// The LineStackingStrategy property specifies how lines are placed
        /// </summary>
//        public LineStackingStrategy 
        LineStackingStrategy: 
        {
            get:function() { return this.GetValue(FlowDocument.LineStackingStrategyProperty); }, 
            set:function(value) { this.SetValue(FlowDocument.LineStackingStrategyProperty, value); } 
        },

        /// <summary> 
        /// The minimum width of each column.  If IsColumnWidthIsFlexible is True, then this
        /// value is clamped to be no larger than the width of the page (specified by 
        /// PageWidth or PageSize) minus the PagePadding. 
        /// </summary>
//        public double 
        ColumnWidth:
        {
            get:function() { return this.GetValue(FlowDocument.ColumnWidthProperty); }, 
            set:function(value) { this.SetValue(FlowDocument.ColumnWidthProperty, value); }
        }, 

        /// <summary>
        /// The distance between each column. This value is clamped to be no larger than 
        /// the width of the page (specified by PageWidth or PageSize) minus the PagePadding.
        /// </summary> 
//        public double 
        ColumnGap: 
        {
            get:function() { return this.GetValue(FlowDocument.ColumnGapProperty); },
            set:function(value) { this.SetValue(FlowDocument.ColumnGapProperty, value); }
        }, 

        /// <summary> 
        /// Whether the width of columns is flexible. If this property is true, then columns
        /// will frequently be wider than ColumnWidth. If false, columns will always be exactly
        /// ColumnWidth (as long as the value is smaller than the width of the page minus padding).
        /// </summary> 
//        public bool 
        IsColumnWidthFlexible:
        { 
            get:function() { return this.GetValue(FlowDocument.IsColumnWidthFlexibleProperty); }, 
            set:function(value) { this.SetValue(FlowDocument.IsColumnWidthFlexibleProperty, value); }
        },

        /// <summary> 
        /// The width of the line drawn in between columns. This value is clamped 
        /// to be no larger than the ColumnGap.
        /// </summary> 
//        public double 
        ColumnRuleWidth:
        { 
            get:function() { return this.GetValue(FlowDocument.ColumnRuleWidthProperty); },
            set:function(value) { this.SetValue(FlowDocument.ColumnRuleWidthProperty, value); } 
        }, 

        /// <summary>
        /// The brush used to draw the line between columns. 
        /// </summary>
//        public Brush 
        ColumnRuleBrush: 
        { 
            get:function() { return this.GetValue(FlowDocument.ColumnRuleBrushProperty); },
            set:function(value) { this.SetValue(FlowDocument.ColumnRuleBrushProperty, value); } 
        },

        /// <summary> 
        /// Whether FlowDocument should attempt to construct optimal text paragraphs. 
        /// </summary>
//        public bool 
        IsOptimalParagraphEnabled: 
        {
            get:function() { return this.GetValue(FlowDocument.IsOptimalParagraphEnabledProperty); },
            set:function(value) { this.SetValue(FlowDocument.IsOptimalParagraphEnabledProperty, value); }
        }, 

        /// <summary>
        /// The width of pages returned by GetPage. This value takes precedence over 
        /// PageSize.Width, MinPageWidth, and MaxPageWidth.
        /// </summary> 
//        public double 
        PageWidth:
        { 
            get:function() { return this.GetValue(FlowDocument.PageWidthProperty); },
            set:function(value) { this.SetValue(FlowDocument.PageWidthProperty, value); }
        },
 
        /// <summary>
        /// The minimum width of pages returned by GetPage. This value takes
        /// precedence over PageSize.Width, but not PageWidth.
        /// </summary> 
//        public double 
        MinPageWidth: 
        { 
            get:function() { return this.GetValue(FlowDocument.MinPageWidthProperty); },
            set:function(value) { this.SetValue(FlowDocument.MinPageWidthProperty, value); } 
        },

        /// <summary> 
        /// The maximum width of pages returned by GetPage. This value takes
        /// precedence over PageSize.Width, but not PageWidth.
        /// </summary>
//        public double 
        MaxPageWidth:
        { 
            get:function() { return this.GetValue(FlowDocument.MaxPageWidthProperty); }, 
            set:function(value) { this.SetValue(FlowDocument.MaxPageWidthProperty, value); }
        }, 
 
        /// <summary>
        /// The height of pages returned by GetPage. This value takes precedence 
        /// over PageSize.Height, MinPageHeight, and MaxPageHeight.
        /// </summary>
//        public double 
        PageHeight: 
        {
            get:function() { return this.GetValue(FlowDocument.PageHeightProperty); }, 
            set:function(value) { this.SetValue(FlowDocument.PageHeightProperty, value); } 
        },

        /// <summary> 
        /// The minimum height of pages returned by GetPage. This value takes 
        /// precedence over PageSize.Height, but not PageHeight.
        /// </summary> 
//        public double 
        MinPageHeight:
        {
            get:function() { return this.GetValue(FlowDocument.MinPageHeightProperty); }, 
            set:function(value) { this.SetValue(FlowDocument.MinPageHeightProperty, value); }
        }, 
 
        /// <summary>
        /// The maximum height of pages returned by GetPage. This value takes 
        /// precedence over PageSize.Height, but not PageHeight. 
        /// </summary>
//        public double 
        MaxPageHeight:
        {
            get:function() { return this.GetValue(FlowDocument.MaxPageHeightProperty); },
            set:function(value) { this.SetValue(FlowDocument.MaxPageHeightProperty, value); } 
        },

        /// <summary>
        /// Padding applied between the page boundaries and the content of the page. 
        /// If the sum of the specified padding in a dimension is greater than the
        /// corresponding page dimension, then the padding values in that dimension 
        /// will be proportionally reduced such that the sum of the padding in that 
        /// dimension is equal to the page dimension.
        /// For example, if the PageSize is (100, 100) and PagePadding is (0, 120, 0, 80), 
        /// then the page will be formatted as if the PagePadding were actually (0, 60, 0, 40).
        /// </summary>
//        public Thickness 
        PagePadding:
        { 
            get:function() { return this.GetValue(FlowDocument.PagePaddingProperty); },
            set:function(value) { this.SetValue(FlowDocument.PagePaddingProperty, value); } 
        }, 

        /// <summary> 
        /// Class providing access to all text typography properties
        /// </summary>
//        public Typography 
        Typography:
        { 
            get:function()
            { 
                return new Typography(this); 
            }
        }, 
 
        /// <summary>
        /// CLR property for hyphenation 
        /// </summary>
//        public bool 
        IsHyphenationEnabled:
        {
            get:function() { return this.GetValue(FlowDocument.IsHyphenationEnabledProperty); }, 
            set:function(value) { this.SetValue(FlowDocument.IsHyphenationEnabledProperty, value); }
        },
        
        
        /// <summary>
        /// Returns enumerator to logical children.
        /// </summary> 
//        protected internal override IEnumerator 
        LogicalChildren:
        { 
            get:function() 
            {
                return new RangeContentEnumerator(this._structuralCache.TextContainer.Start, this._structuralCache.TextContainer.End); 
            }
        },

        /// <summary> 
        ///     Fetches the value of the IsEnabled property
        /// </summary> 
        /// <remarks> 
        ///     We want to coerce ContentElements and UIElement children of FlowDocument to be disabled in _editable_ content (ie, RichTextBox).
        ///     In read-only mode, in say the FlowDocumentReader, we don't want any coercing. 
        /// </remarks>
//        protected override bool 
        IsEnabledCore:
        {
            get:function() 
            {
                if (!base.IsEnabledCore) 
                { 
                    return false;
                } 

                var parentRichTextBox = this.Parent instanceof RichTextBox ? this.Parent : null;

                return (parentRichTextBox == null) ? true : parentRichTextBox.IsDocumentEnabled; 
            }
        }, 

        /// <summary>
        /// An object which formats botomless content. 
        /// </summary>
//        internal FlowDocumentFormatter 
        BottomlessFormatter: 
        { 
            get:function()
            { 
                if (this._formatter != null && !(this._formatter instanceof FlowDocumentFormatter))
                {
                	this._formatter.Suspend();
                	this._formatter = null; 
                }
                if (this._formatter == null) 
                { 
                	this._formatter = new FlowDocumentFormatter(this);
                } 
                return this._formatter;
            }
        },
 
        /// <summary>
        /// StructuralCache. 
        /// </summary> 
//        internal StructuralCache 
        StructuralCache:
        { 
            get:function()
            {
                return this._structuralCache;
            } 
        },
 
        /// <summary> 
        /// Typography properties group.
        /// </summary> 
//        internal TypographyProperties 
        TypographyPropertiesGroup:
        {
            get:function()
            { 
                if (this._typographyPropertiesGroup == null)
                { 
                	this._typographyPropertiesGroup = TextElement.GetTypographyProperties(this); 
                }
                return this._typographyPropertiesGroup; 
            }
        },

        /// <summary> 
        /// TextWrapping property value (set by TextBox/RichTextBox)
        /// </summary> 
//        internal TextWrapping 
        TextWrapping: 
        {
            get:function()
            {
                return this._textWrapping;
            },
            set:function(value) 
            {
            	this._textWrapping = value; 
            } 
        },
 
	});
	
	Object.defineProperties(FlowDocument,{

        /// <summary>
        /// DependencyProperty for <see cref="FontFamily" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		FontFamilyProperty:
        {
        	get:function(){
	        	if(FlowDocument._FontFamilyProperty === undefined){
	        		FlowDocument._FontFamilyProperty =
	                    TextElement.FontFamilyProperty.AddOwner(FlowDocument.Type); 
	        	}
	        	
	        	return FlowDocument._FontFamilyProperty;
        	}
        }, 

        /// <summary>
        /// DependencyProperty for <see cref="FontStyle" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		FontStyleProperty:
        {
        	get:function(){
	        	if(FlowDocument._FontStyleProperty === undefined){
	        		FlowDocument._FontStyleProperty = 
	                    TextElement.FontStyleProperty.AddOwner(FlowDocument.Type);  
	        	}
	        	
	        	return FlowDocument._FontStyleProperty;
        	}
        },  


        /// <summary> 
        /// DependencyProperty for <see cref="FontWeight" /> property.
        /// </summary>
//        public static readonly DependencyProperty
		FontWeightProperty:
        {
        	get:function(){
	        	if(FlowDocument._FontWeightProperty === undefined){
	        		FlowDocument._FontWeightProperty =
	                    TextElement.FontWeightProperty.AddOwner(FlowDocument.Type);  
	        	}
	        	
	        	return FlowDocument._FontWeightProperty;
        	}
        },  

        /// <summary> 
        /// DependencyProperty for <see cref="FontStretch" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		FontStretchProperty:
        {
        	get:function(){
	        	if(FlowDocument._FontStretchProperty === undefined){
	        		FlowDocument._FontStretchProperty = 
	                    TextElement.FontStretchProperty.AddOwner(FlowDocument.Type);
	        	}
	        	
	        	return FlowDocument._FontStretchProperty;
        	}
        },  

        /// <summary>
        /// DependencyProperty for <see cref="FontSize" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		FontSizeProperty:
        {
        	get:function(){
	        	if(FlowDocument._FontSizeProperty === undefined){
	        		FlowDocument._FontSizeProperty = 
	                    TextElement.FontSizeProperty.AddOwner( 
	                            FlowDocument.Type);
	        	}
	        	
	        	return FlowDocument._FontSizeProperty;
        	}
        },  

        /// <summary>
        /// DependencyProperty for <see cref="Foreground" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		ForegroundProperty:
        {
        	get:function(){
	        	if(FlowDocument._ForegroundProperty === undefined){
	        		FlowDocument._ForegroundProperty = 
	                    TextElement.ForegroundProperty.AddOwner( 
	                            FlowDocument.Type);
	        	}
	        	
	        	return FlowDocument._ForegroundProperty;
        	}
        },  
 
        /// <summary>
        /// DependencyProperty for <see cref="Background" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		BackgroundProperty:
        {
        	get:function(){
	        	if(FlowDocument._BackgroundProperty === undefined){
	        		FlowDocument._BackgroundProperty = 
	                    TextElement.BackgroundProperty.AddOwner(
	                            FlowDocument.Type, 
	                            new FrameworkPropertyMetadata( 
	                                    null,
	                                    FrameworkPropertyMetadataOptions.AffectsRender));
	        	}
	        	
	        	return FlowDocument._BackgroundProperty;
        	}
        },   

        /// <summary>
        /// DependencyProperty for <see cref="TextEffects" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		TextEffectsProperty:
        {
        	get:function(){
	        	if(FlowDocument._TextEffectsProperty === undefined){
	        		FlowDocument._TextEffectsProperty =
	                    TextElement.TextEffectsProperty.AddOwner( 
	                            FlowDocument.Type, 
	                            new FrameworkPropertyMetadata(
	                                    new FreezableDefaultValueFactory(TextEffectCollection.Empty), 
	                                    FrameworkPropertyMetadataOptions.AffectsRender));
	        	}
	        	
	        	return FlowDocument._TextEffectsProperty;
        	}
        },  

        /// <summary>
        /// DependencyProperty for <see cref="TextAlignment" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		TextAlignmentProperty:
        {
        	get:function(){
	        	if(FlowDocument._TextAlignmentProperty === undefined){
	        		FlowDocument._TextAlignmentProperty = 
	                    Block.TextAlignmentProperty.AddOwner(FlowDocument.Type); 
	        	}
	        	
	        	return FlowDocument._TextAlignmentProperty;
        	}
        },  

        /// <summary> 
        /// DependencyProperty for <see cref="FlowDirection" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		FlowDirectionProperty:
        {
        	get:function(){
	        	if(FlowDocument._FlowDirectionProperty === undefined){
	        		FlowDocument._FlowDirectionProperty =
	                    Block.FlowDirectionProperty.AddOwner(FlowDocument.Type);  
	        	}
	        	
	        	return FlowDocument._FlowDirectionProperty;
        	}
        },  

        /// <summary> 
        /// DependencyProperty for <see cref="LineHeight" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        LineHeightProperty:
        {
        	get:function(){
	        	if(FlowDocument._LineHeightProperty === undefined){
	        		FlowDocument._LineHeightProperty = 
	                    Block.LineHeightProperty.AddOwner(FlowDocument.Type);
	        	}
	        	
	        	return FlowDocument._LineHeightProperty;
        	}
        },  

        /// <summary> 
        /// DependencyProperty for <see cref="LineStackingStrategy" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        LineStackingStrategyProperty:
        {
        	get:function(){
	        	if(FlowDocument._LineStackingStrategyProperty === undefined){
	        		FlowDocument._LineStackingStrategyProperty = 
	                    Block.LineStackingStrategyProperty.AddOwner(FlowDocument.Type);
	        	}
	        	
	        	return FlowDocument._LineStackingStrategyProperty;
        	}
        },  
 
        /// <summary>
        /// DependencyProperty for <see cref="ColumnWidth" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
        ColumnWidthProperty:
        {
        	get:function(){
	        	if(FlowDocument._ColumnWidthProperty === undefined){
	        		FlowDocument._ColumnWidthProperty = 
	                    DependencyProperty.Register(
	                            "ColumnWidth", 
	                            Number.Type, 
	                            FlowDocument.Type,
	                            new FrameworkPropertyMetadata( 
	                                    Number.NaN,
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure)); 
	        	}
	        	
	        	return FlowDocument._ColumnWidthProperty;
        	}
        },  
        /// <summary>
        /// DependencyProperty for <see cref="ColumnGap" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        ColumnGapProperty:
        {
        	get:function(){
	        	if(FlowDocument._ColumnGapProperty === undefined){
	        		FlowDocument._ColumnGapProperty =
	                    DependencyProperty.Register(
	                            "ColumnGap", 
	                            Number.Type,
	                            FlowDocument.Type, 
	                            new FrameworkPropertyMetadata( 
	                            		Number.NaN,
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure), 
	                                    new ValidateValueCallback(null, IsValidColumnGap)); 
	        	}
	        	
	        	return FlowDocument._ColumnGapProperty;
        	}
        },  


        /// <summary> 
        /// DependencyProperty for <see cref="IsColumnWidthFlexible" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsColumnWidthFlexibleProperty:
        {
        	get:function(){
	        	if(FlowDocument._IsColumnWidthFlexibleProperty === undefined){
	        		FlowDocument._IsColumnWidthFlexibleProperty = 
	                    DependencyProperty.Register(
	                            "IsColumnWidthFlexible",
	                            Boolean.Type,
	                            FlowDocument.Type, 
	                            new FrameworkPropertyMetadata(
	                                    true, 
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure)); 
	        	}
	        	
	        	return FlowDocument._IsColumnWidthFlexibleProperty;
        	}
        },  

        /// <summary>
        /// DependencyProperty for <see cref="ColumnRuleWidth" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        ColumnRuleWidthProperty:
        {
        	get:function(){
	        	if(FlowDocument._ColumnRuleWidthProperty === undefined){
	        		FlowDocument._ColumnRuleWidthProperty =
	                    DependencyProperty.Register( 
	                            "ColumnRuleWidth", 
	                            Number.Type,
	                            FlowDocument.Type, 
	                            new FrameworkPropertyMetadata(
	                                    0.0,
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure),
	                            new ValidateValueCallback(IsValidColumnRuleWidth));  
	        	}
	        	
	        	return FlowDocument._ColumnRuleWidthProperty;
        	}
        },  

        /// <summary> 
        /// DependencyProperty for <see cref="ColumnRuleBrush" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
        ColumnRuleBrushProperty:
        {
        	get:function(){
	        	if(FlowDocument._ColumnRuleBrushProperty === undefined){
	        		FlowDocument._ColumnRuleBrushProperty =
	                    DependencyProperty.Register( 
	                            "ColumnRuleBrush",
	                            Brush.Type, 
	                            FlowDocument.Type, 
	                            new FrameworkPropertyMetadata(
	                                    null, 
	                                    FrameworkPropertyMetadataOptions.AffectsRender));
	        	}
	        	
	        	return FlowDocument._ColumnRuleBrushProperty;
        	}
        }, 

        /// <summary>
        /// DependencyProperty for <see cref="IsOptimalParagraphEnabled" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsOptimalParagraphEnabledProperty:
        {
        	get:function(){
	        	if(FlowDocument._IsOptimalParagraphEnabledProperty === undefined){
	        		FlowDocument._IsOptimalParagraphEnabledProperty = 
	                    DependencyProperty.Register( 
	                            "IsOptimalParagraphEnabled",
	                            Boolean.Type, 
	                            FlowDocument.Type,
	                            new FrameworkPropertyMetadata(
	                                    false,
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure));  
	        	}
	        	
	        	return FlowDocument._IsOptimalParagraphEnabledProperty;
        	}
        }, 

        /// <summary> 
        /// DependencyProperty for <see cref="PageWidth" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        PageWidthProperty:
        {
        	get:function(){
	        	if(FlowDocument._PageWidthProperty === undefined){
	        		FlowDocument._PageWidthProperty = 
	                    DependencyProperty.Register(
	                            "PageWidth",
	                            Number.Type,
	                            FlowDocument.Type, 
	                            new FrameworkPropertyMetadata(
	                                    Number.NaN, 
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure, 
	                                    new PropertyChangedCallback(OnPageMetricsChanged),
	                                    new CoerceValueCallback(CoercePageWidth)), 
	                            new ValidateValueCallback(IsValidPageSize)); 
	        	}
	        	
	        	return FlowDocument._PageWidthProperty;
        	}
        },  

        /// <summary>
        /// DependencyProperty for <see cref="MinPageWidth" /> property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        MinPageWidthProperty:
        {
        	get:function(){
	        	if(FlowDocument._MinPageWidthProperty === undefined){
	        		FlowDocument._MinPageWidthProperty =
	                    DependencyProperty.Register( 
	                            "MinPageWidth",
	                            Number.Type,
	                            FlowDocument.Type,
	                            new FrameworkPropertyMetadata( 
	                                    0.0,
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure, 
	                                    new PropertyChangedCallback(OnMinPageWidthChanged)), 
	                            new ValidateValueCallback(IsValidMinPageSize));
	        	}
	        	
	        	return FlowDocument._MinPageWidthProperty;
        	}
        },  
 
        /// <summary>
        /// DependencyProperty for <see cref="MaxPageWidth" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        MaxPageWidthProperty:
        {
        	get:function(){
	        	if(FlowDocument._MaxPageWidthProperty === undefined){
	        		FlowDocument._MaxPageWidthProperty = 
	                    DependencyProperty.Register( 
	                            "MaxPageWidth",
	                            Number.Type, 
	                            FlowDocument.Type,
	                            new FrameworkPropertyMetadata(
	                                    Number.PositiveInfinity,
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure, 
	                                    new PropertyChangedCallback(null, OnMaxPageWidthChanged),
	                                    new CoerceValueCallback(null, CoerceMaxPageWidth)), 
	                            new ValidateValueCallback(null, IsValidMaxPageSize)); 
	        	}
	        	
	        	return FlowDocument._MaxPageWidthProperty;
        	}
        },   

        /// <summary>
        /// DependencyProperty for <see cref="PageHeight" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        PageHeightProperty:
        {
        	get:function(){
	        	if(FlowDocument._PageHeightProperty === undefined){
	        		FlowDocument._PageHeightProperty =
	                    DependencyProperty.Register( 
	                            "PageHeight", 
	                            Number.Type,
	                            FlowDocument.Type, 
	                            new FrameworkPropertyMetadata(
	                                    Number.NaN,
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure,
	                                    new PropertyChangedCallback(null, OnPageMetricsChanged), 
	                                    new CoerceValueCallback(null, CoercePageHeight)),
	                            new ValidateValueCallback(null, IsValidPageSize)); 
	        	}
	        	
	        	return FlowDocument._PageHeightProperty;
        	}
        },  
 
        /// <summary>
        /// DependencyProperty for <see cref="MinPageHeight" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
        MinPageHeightProperty:
        {
        	get:function(){
	        	if(FlowDocument._MinPageHeightProperty === undefined){
	        		FlowDocument._MinPageHeightProperty  = 
	                    DependencyProperty.Register(
	                            "MinPageHeight", 
	                            Number.Type, 
	                            FlowDocument.Type,
	                            new FrameworkPropertyMetadata( 
	                                    0.0,
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure,
	                                    new PropertyChangedCallback(null, OnMinPageHeightChanged)),
	                            new ValidateValueCallback(null, IsValidMinPageSize)); 
	        	}
	        	
	        	return FlowDocument._MinPageHeightProperty;
        	}
        }, 

        /// <summary>
        /// DependencyProperty for <see cref="MaxPageHeight" /> property. 
        /// </summary>
//        public static readonly DependencyProperty
        MaxPageHeightProperty:
        {
        	get:function(){
	        	if(FlowDocument._MaxPageHeightProperty === undefined){
	        		FlowDocument._MaxPageHeightProperty =
	                    DependencyProperty.Register(
	                            "MaxPageHeight", 
	                            Number.Type,
	                            FlowDocument.Type, 
	                            new FrameworkPropertyMetadata( 
	                                    Number.PositiveInfinity,
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure, 
	                                    new PropertyChangedCallback(null, OnMaxPageHeightChanged),
	                                    new CoerceValueCallback(null, CoerceMaxPageHeight)),
	                            new ValidateValueCallback(null, IsValidMaxPageSize));
	        	}
	        	
	        	return FlowDocument._MaxPageHeightProperty;
        	}
        },  
 
        /// <summary> 
        /// DependencyProperty for <see cref="PagePadding" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        PagePaddingProperty:
        {
        	get:function(){
	        	if(FlowDocument._PagePaddingProperty === undefined){
	        		FlowDocument._PagePaddingProperty =
	                    DependencyProperty.Register(
	                            "PagePadding",
	                            Thickness.Type, 
	                            FlowDocument.Type,
	                            new FrameworkPropertyMetadata( 
	                                    new Thickness(Number.NaN), 
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure,
	                                    new PropertyChangedCallback(null, OnPageMetricsChanged)), 
	                            new ValidateValueCallback(null, IsValidPagePadding)); 
	        	}
	        	
	        	return FlowDocument._PagePaddingProperty;
        	}
        },  
        
 
	});
	
//    private static bool 
    function IsValidPageSize(/*object*/ o)
    {
        var value = o; 
        var maxSize = Math.min(1000000, PTS.MaxPageSize);
        if (Double.IsNaN(value)) 
        { 
            return true;
        } 
        if (value < 0 || value > maxSize)
        {
            return false;
        } 
        return true;
    } 

//    private static bool 
    function IsValidMinPageSize(/*object*/ o)
    { 
    	var value = o;
    	var maxSize = Math.min(1000000, PTS.MaxPageSize);
        if (Double.IsNaN(value))
        { 
            return false;
        } 
        if (!Double.IsNegativeInfinity(value) && (value < 0 || value > maxSize)) 
        {
            return false; 
        }
        return true;
    }

//    private static bool 
    function IsValidMaxPageSize(/*object*/ o)
    { 
    	var value = o; 
    	var maxSize = Math.Min(1000000, PTS.MaxPageSize);
        if (Double.IsNaN(value)) 
        {
            return false;
        }
        if (!Double.IsPositiveInfinity(value) && (value < 0 || value > maxSize)) 
        {
            return false; 
        } 
        return true;
    } 

//    private static bool 
    function IsValidPagePadding(/*object*/ o)
    {
//        Thickness value = (Thickness)o; 
        return Block.IsValidThickness(o, /*allow NaN*/true);
    } 

//    private static bool 
    function IsValidColumnRuleWidth(/*object*/ o)
    { 
    	var ruleWidth = /*(double)*/o;
    	var maxRuleWidth = Math.min(1000000, PTS.MaxPageSize);
        if (Double.IsNaN(ruleWidth) || ruleWidth < 0 || ruleWidth > maxRuleWidth)
        { 
            return false;
        } 
        return true; 
    }

//    private static bool 
    function IsValidColumnGap(/*object*/ o)
    {
    	var gap = /*(double)*/o;
    	var maxGap = Math.min(1000000, PTS.MaxPageSize); 
        if (Double.IsNaN(gap))
        { 
            // Default value. 
            return true;
        } 
        if (gap < 0 || gap > maxGap)
        {
            return false;
        } 
        return true;
    }
    
    /// <summary>
    /// One of the properties which comprises TypographyProperties has changed -- reset cache.
    /// </summary>
//    private static void 
    function OnTypographyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        d._typographyPropertiesGroup = null; 
    } 

    /// <summary>
    /// Respond to page metrics changes. 
    /// </summary>
//    private static void 
    function OnPageMetricsChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        /*FlowDocument*/var fd = d; 
        if (fd._structuralCache != null && fd._structuralCache.IsFormattedOnce)
        { 
            // Notify formatter about content invalidation. 
            if (fd._formatter != null)
            { 
                // Any change of page metrics invalidates the layout.
                // Hence page metrics change is treated in the same way as ContentChanged
                // spanning entire content.
                fd._formatter.OnContentInvalidated(true); 
            }

            // Fire notification about the PageSize change - needed in RichTextBox 
            if (fd.PageSizeChanged != null)
            { 
                // NOTE: May execute external code, so it is possible to get
                //       an exception here.
                fd.PageSizeChanged(fd, EventArgs.Empty);
            } 
        }
    } 

    /// <summary>
    /// Respond to MinPageWidth change. 
    /// </summary>
//    private static void 
    function OnMinPageWidthChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        d.CoerceValue(MaxPageWidthProperty); 
        d.CoerceValue(PageWidthProperty);
    } 

    /// <summary>
    /// Respond to MinPageHeight change. 
    /// </summary>
//    private static void 
    function OnMinPageHeightChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        d.CoerceValue(MaxPageHeightProperty); 
        d.CoerceValue(PageHeightProperty);
    } 

    /// <summary>
    /// Respond to MaxPageWidth change. 
    /// </summary>
//    private static void 
    function OnMaxPageWidthChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        d.CoerceValue(PageWidthProperty); 
    }

    /// <summary> 
    /// Respond to MaxPageHeight change.
    /// </summary> 
//    private static void 
    function OnMaxPageHeightChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        d.CoerceValue(PageHeightProperty);
    } 

    /// <summary> 
    /// Coerce MaxPageWidth value. 
    /// </summary>
//    private static object 
    function CoerceMaxPageWidth(/*DependencyObject*/ d, /*object*/ value) 
    {
        /*FlowDocument*/var fd = d;
        var max = value;
        var min = fd.MinPageWidth; 
        if (max < min)
        { 
            return min; 
        }
        return value; 
    }

    /// <summary>
    /// Coerce MaxPageHeight value. 
    /// </summary>
//    private static object 
    function CoerceMaxPageHeight(/*DependencyObject*/ d, /*object*/ value) 
    { 
        /*FlowDocument*/var fd = d;
        var max = value; 
        var min = fd.MinPageHeight;
        if (max < min)
        {
            return min; 
        }
        return value; 
    } 

    /// <summary> 
    /// Coerce PageWidth value.
    /// </summary>
//    private static object 
    function CoercePageWidth(/*DependencyObject*/ d, /*object*/ value)
    { 
        /*FlowDocument*/var fd = d;
        var width = value; 

        if (!DoubleUtil.IsNaN(width))
        { 
            var max = fd.MaxPageWidth;
            if (width > max)
            {
                width = max; 
            }

            var min = fd.MinPageWidth; 
            if (width < min)
            { 
                width = min;
            }
        }

        return value;
    } 

    /// <summary>
    /// Coerce PageHeight value. 
    /// </summary>
//    private static object 
    function CoercePageHeight(/*DependencyObject*/ d, /*object*/ value)
    {
        /*FlowDocument*/var fd = d; 
        var height = value;

        if (!DoubleUtil.IsNaN(height)) 
        {
            var max = fd.MaxPageHeight; 
            if (height > max)
            {
                height = max;
            } 

            var min = fd.MinPageHeight; 
            if (height < min) 
            {
                height = min; 
            }
        }

        return value; 
    }
    
    /// <summary> 
    /// Static constructor. Registers metadata for its properties.
    /// </summary> 
//    static FlowDocument()
    function Initizlize()
    {
        /*PropertyChangedCallback*/var typographyChanged = new PropertyChangedCallback(null, OnTypographyChanged);

        // Registering typography properties metadata
        /*DependencyProperty[]*/var typographyProperties = Typography.TypographyPropertiesList; 
        for (var i = 0; i < typographyProperties.Length; i++) 
        {
            typographyProperties[i].OverrideMetadata(FlowDocument.Type, new FrameworkPropertyMetadata(typographyChanged)); 
        }

        DefaultStyleKeyProperty.OverrideMetadata(FlowDocument.Type, new FrameworkPropertyMetadata(FlowDocument.Type));
        FocusableProperty.OverrideMetadata(FlowDocument.Type, new FrameworkPropertyMetadata(true)); 
    };
	
	FlowDocument.Type = new Type("FlowDocument", FlowDocument, 
			[FrameworkContentElement.Type, IAddChild.Type]);
	return FlowDocument;
});

//        static private readonly Type FlowDocument.Type = typeof(FlowDocument); 
// 
//
// 
// 
//        /// <summary> 
//        /// Initialized the new instance of a FlowDocument specifying a Block added
//        /// as its first child. 
//        /// </summary>
//        /// <param name="block">
//        /// Block added as a first initial child of the FlowDocument.
//        /// </param> 
//        public FlowDocument(Block block)
//            : base() 
//        { 
//            Initialize(null); // null means to create its own TextContainer
// 
//            if (block == null)
//            {
//                throw new ArgumentNullException("block");
//            } 
//
//            this.Blocks.Add(block); 
//        } 
//
//        /// <summary> 
//        /// FlowDocument constructor with TextContainer.
//        /// </summary>
//        internal FlowDocument(TextContainer textContainer)
//            : base() 
//        {
//            Initialize(textContainer); 
//        } 
 
   
 
  

//        private StructuralCache _structuralCache;                   // Structural cache for the content. 
//        private TypographyProperties _typographyPropertiesGroup;    // Cache for typography properties.
//        private IFlowDocumentFormatter _formatter;                  // Current formatter asociated with FlowDocument.
//        private TextWrapping _textWrapping = TextWrapping.Wrap;     // internal cache for TextBox/RichTextBox


     


