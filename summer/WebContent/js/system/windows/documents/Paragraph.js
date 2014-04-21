/**
 * Paragraph
 */

define(["dojo/_base/declare", "system/Type", "documents/Block", "documents/TextElementCollection"], 
		function(declare, Type, Block, TextElementCollection){
	var Paragraph = declare("Paragraph", Block,{
		constructor:function(/*Inline*/ inline) 
        { 
			if(inline === undefined){
				inline = null;
			}
			
            if (inline != null)
            {
                this.Inlines.Add(inline); 
            } 
            
            this._dom = window.document.createElement('p');
            this._dom._source = this;
        },
        
        /// Called to add the object as a child. 
        ///<param name="value">
        /// <exception cref="System.ArgumentException">
        /// o must derive from either UIElement or TextElement, or an
        /// ArgumentException will be thrown by this method. 
//        void IAddChild.
        AddChild:function(/*object*/ value) 
        { 
            if(typeof(value) == "string"){
            	this.AddText(value);
            }else{
            	this.Inlines.Add(value);
            }
        },

        /// Called when text appears under the tag in markup
        ///<param name="text"> 
        /// Text to Add to this Span
//        void IAddChild.
        AddText:function(/*string*/ text)
        {
            if (text == null) 
            {
                throw new ArgumentNullException("text"); 
            } 
            

            // NOTE: Do not use new Run(text) constructor to avoid TextContainer creation
            // which would hit parser perf 
            var implicitRun = Inline.CreateImplicitRun(this);

            this.AddChild(implicitRun); 

            implicitRun.Text = text; 
        },
        
        
//        internal void 
        GetDefaultMarginValue:function(/*ref Thickness margin*/marginRef)
        { 
            var lineHeight = this.LineHeight; 
            if (IsLineHeightAuto(lineHeight))
            { 
                lineHeight = this.FontFamily.LineSpacing * this.FontSize;
            }
            marginRef.margin = new Thickness(0, lineHeight, 0, lineHeight);
        },
        
        Arrange:function(parent /*DOM element*/){
        	
           	
        	for(var i=0; i<this.Inlines.Count; i++){
        		var inline = this.Inlines.Get(i);
        		inline.Arrange();
        		this._dom.appendChild(inline._dom);
        	}
			
//        	parent.appendChild(this._dom);
        }
	});
	
	Object.defineProperties(Paragraph.prototype,{
	     /// <value>
        /// Collection of Inline items contained in this Paragraph.
        /// </value>
//        public InlineCollection 
		Inlines:
        { 
            get:function() 
            {
            	if(this._inlines === undefined){
            		this._inlines = new TextElementCollection(); 
            	}
                return  this._inlines; 
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
                return this.Inlines.GetEnumerator();
            }
        },
        
        /// <summary> 
        /// The TextDecorations property specifies decorations that are added to the text of an element. 
        /// </summary>
//        public TextDecorationCollection 
        TextDecorations: 
        {
            get:function() { return this.GetValue(Paragraph.TextDecorationsProperty); },
            set:function(value) { this.SetValue(Paragraph.TextDecorationsProperty, value); }
        },
        /// <summary>
        /// The TextIndent property specifies the indentation of the first line of a paragraph.
        /// </summary>
//        public double 
        TextIndent:
        { 
            get:function() { return this.GetValue(Paragraph.TextIndentProperty); }, 
            set:function(value) { this.SetValue(Paragraph.TextIndentProperty, value); }
        },
        
      /// <summary> 
        /// The MinOrphanLines is the minimum number of lines that 
        /// can be left behind when a paragraph is broken on a page break
        /// or column break. 
        /// </summary>
//        public int 
        MinOrphanLines:
        {
            get:function() { return this.GetValue(Paragraph.MinOrphanLinesProperty); }, 
            set:function(value) { this.SetValue(Paragraph.MinOrphanLinesProperty, value); }
        },
      /// <summary>
        /// The MinWidowLines is the minimum number of lines after a break 
        /// to be put on the next page or column.
        /// </summary> 
//        public int 
        MinWidowLines: 
        {
            get:function() { return this.GetValue(Paragraph.MinWidowLinesProperty); }, 
            set:function(value) { this.SetValue(Paragraph.MinWidowLinesProperty, value); }
        },
        /// <summary> 
        /// The KeepWithNext property indicates that this paragraph should be kept with
        /// the next paragraph in the track.  (This also implies that the paragraph itself 
        /// will not be broken.)
        /// </summary>
//        public bool 
        KeepWithNext:
        { 
            get:function() { return this.GetValue(Paragraph.KeepWithNextProperty); },
            set:function(value) { this.SetValue(Paragraph.KeepWithNextProperty, value); } 
        }, 
        /// <summary>
        /// The KeepTogether property indicates that all the text in the paragraph 
        /// should be kept together.
        /// </summary> 
//        public bool 
        KeepTogether: 
        {
            get:function() { return this.GetValue(Paragraph.KeepTogetherProperty); },
            set:function(value) { this.SetValue(Paragraph.KeepTogetherProperty, value); }
        }
        
        
	});
	
	Object.defineProperties(Paragraph,{
		/// <summary> 
        /// DependencyProperty for <see cref="TextDecorations" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		TextDecorationsProperty:
        {
        	get:function(){
            	if(Paragraph._TextDecorationsProperty === undefined){
            		Paragraph._TextDecorationsProperty = 
                        Inline.TextDecorationsProperty.AddOwner(
                                Paragraph.Type, 
                                /*new FrameworkPropertyMetadata(
                                        new FreezableDefaultValueFactory(TextDecorationCollection.Empty),
                                        FrameworkPropertyMetadataOptions.AffectsRender)*/
                                FrameworkPropertyMetadata.Build2(
                                        new FreezableDefaultValueFactory(TextDecorationCollection.Empty),
                                        FrameworkPropertyMetadataOptions.AffectsRender)); 
            	}
            	
            	return Paragraph._TextDecorationsProperty;
        	}
        }, 

        /// <summary> 
        /// DependencyProperty for <see cref="TextIndent" /> property. 
        /// </summary>
//        public static readonly DependencyProperty
		TextIndentProperty:
        {
        	get:function(){
            	if(Paragraph._TextIndentProperty === undefined){
            		Paragraph._TextIndentProperty = 
                        DependencyProperty.Register(
                                "TextIndent",
                                Number.Type,
                                Paragraph.Type, 
                                /*new FrameworkPropertyMetadata(
                                        0.0, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender)*/
                                FrameworkPropertyMetadata.Build2(
                                        0.0, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender), 
                                new ValidateValueCallback(null, IsValidTextIndent)); 
            	}
            	
            	return Paragraph._TextIndentProperty;
        	}
        }, 
 
        /// <summary>
        /// DependencyProperty for <see cref="MinOrphanLines" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		MinOrphanLinesProperty:
        {
        	get:function(){
            	if(Paragraph._MinOrphanLinesProperty === undefined){
            		Paragraph._MinOrphanLinesProperty =
                        DependencyProperty.Register( 
                                "MinOrphanLines", 
                                Number.Type,
                                Paragraph.Type, 
                                /*new FrameworkPropertyMetadata(
                                        0,
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure)*/
                                FrameworkPropertyMetadata.Build2(
                                        0,
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure),
                                new ValidateValueCallback(null, IsValidMinOrphanLines)); 
            	}
            	
            	return Paragraph._MinOrphanLinesProperty;
        	}
        }, 

        
 
        /// <summary>
        /// DependencyProperty for <see cref="MinWidowLines" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		MinWidowLinesProperty:
        {
        	get:function(){
            	if(Paragraph._MinWidowLinesProperty === undefined){
            		Paragraph._MinWidowLinesProperty =
                        DependencyProperty.Register(
                                "MinWidowLines", 
                                Number.Type,
                                Paragraph.Type, 
                                /*new FrameworkPropertyMetadata( 
                                        0,
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure)*/
                                FrameworkPropertyMetadata.Build2( 
                                        0,
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure), 
                                new ValidateValueCallback(null, IsValidMinWidowLines));
            	}
            	
            	return Paragraph._MinWidowLinesProperty;
        	}
        }, 

        /// <summary> 
        /// DependencyProperty for <see cref="KeepWithNext" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		KeepWithNextProperty:
        {
        	get:function(){
            	if(Paragraph._KeepWithNextProperty === undefined){
            		Paragraph._KeepWithNextProperty = 
                        DependencyProperty.Register(
                                "KeepWithNext", 
                                Boolean.Type,
                                Paragraph.Type,
                                /*new FrameworkPropertyMetadata(
                                        false, 
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure)*/
                                FrameworkPropertyMetadata.Build2(
                                        false, 
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure));
            	}
            	
            	return Paragraph._KeepWithNextProperty;
        	}
        }, 
        /// <summary> 
        /// DependencyProperty for <see cref="KeepTogether" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		KeepTogetherProperty:
        {
        	get:function(){
            	if(Paragraph._KeepTogetherProperty === undefined){
            		Paragraph._KeepTogetherProperty =
                        DependencyProperty.Register( 
                                "KeepTogether",
                                Boolean.Type, 
                                Paragraph.Type, 
                                /*new FrameworkPropertyMetadata(
                                        false, 
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure)*/
                                FrameworkPropertyMetadata.Build2(
                                        false, 
                                        FrameworkPropertyMetadataOptions.AffectsParentMeasure));
            	}
            	
            	return Paragraph._KeepTogetherProperty;
        	}
        },	  
	});
	
    /// <summary> 
    /// Static ctor.  Initializes property metadata. 
    /// </summary>
//    static Paragraph() 
	function Initialize()
    {
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(Paragraph.Type, 
        		/*new FrameworkPropertyMetadata(Paragraph.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(Paragraph.Type));
    };
    
//    internal static bool 
    Paragraph.IsMarginAuto = function(/*Thickness*/ margin) 
    { 
        return (Double.IsNaN(margin.Left) && Double.IsNaN(margin.Right) && Double.IsNaN(margin.Top) && Double.IsNaN(margin.Bottom));
    }; 

//    internal static bool 
    Paragraph.IsLineHeightAuto = function(/*double*/ lineHeight)
    {
        return (Double.IsNaN(lineHeight)); 
    };

    // Returns true if there is no text/embedded element content in passed paragraph, 
    // it may have zero or more inline formatting tags with no text.
//    internal static bool 
    Paragraph.HasNoTextContent = function(/*Paragraph*/ paragraph) 
    {
        /*ITextPointer*/var navigator = paragraph.ContentStart.CreatePointer();
        /*ITextPointer*/var end = paragraph.ContentEnd;

        while (navigator.CompareTo(end) < 0)
        { 
            /*TextPointerContext*/var symbolType = navigator.GetPointerContext(LogicalDirection.Forward); 
            if (symbolType ==  TextPointerContext.Text ||
                symbolType == TextPointerContext.EmbeddedElement || 
                typeof(LineBreak).IsAssignableFrom(navigator.ParentType) ||
                typeof(AnchoredBlock).IsAssignableFrom(navigator.ParentType))
            {
                return false; 
            }
            navigator.MoveToNextContextPosition(LogicalDirection.Forward); 
        } 

        return true; 
    };

//    private static bool 
    function IsValidMinOrphanLines(/*object*/ o) 
    {
        return (o >= 0 && o <= maxLines);
    } 

//    private static bool 
    function IsValidMinWidowLines(/*object*/ o)
    {
        return (o >= 0 && o <= maxLines); 
    } 

//    private static bool 
    function IsValidTextIndent(/*object*/ o) 
    {
        var maxIndent = Math.Min(1000000, PTS.MaxPageSize);
        var minIndent = -maxIndent; 
        if (Double.IsNaN(o))
        { 
            return false; 
        }
        if (o < minIndent || o > maxIndent) 
        {
            return false;
        }
        return true; 
    }
	
	Paragraph.Type = new Type("Paragraph", Paragraph, [Block.Type]);
	Initialize();
	
	return Paragraph;
});



       


