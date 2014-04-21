/**
 * AccessText
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement", "markup/IAddChild", "windows/FrameworkPropertyMetadata",
        "windows/FrameworkPropertyMetadataOptions", "windows/UncommonField"], 
		function(declare, Type, FrameworkElement, IAddChild, FrameworkPropertyMetadata,
				FrameworkPropertyMetadataOptions, UncommonField){
	
    //---------------------------------------------------------------
    // Flag that indicates that internal Run should have a custom serialization 
    //----------------------------------------------------------------
//    private static readonly UncommonField<bool> 
	var HasCustomSerializationStorage = new UncommonField/*<bool>*/();
	
    //---------------------------------------------------------------
    // Defines the charecter to be used in fron of the access key
    //--------------------------------------------------------------- 
//    private const char 
	var _accessKeyMarker = '_';

    //---------------------------------------------------------------- 
    // Stores the default Style applied on the internal Run
    //--------------------------------------------------------------- 
//    private static Style 
	var _accessKeyStyle;
	
	var AccessText = declare("AccessText", [FrameworkElement, IAddChild],{
		constructor:function(){
//	        private TextContainer 
	        this._textContainer = null;
//	        private TextBlock 
	        this._textBlock = null;
//	        private Run 
	        this._accessKey = null; 
//	        private bool 
	        this._accessKeyLocated =false; 
//	        private string 
	        this._currentlyRegistered = null; 
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
            (this.TextBlock).AddChild(value); 
        }, 

        ///<summary> 
        /// Called when text appears under the tag in markup.
        ///</summary>
        ///<param name="text">
        /// Text to Add to the Object 
        ///</param>
//        void IAddChild.
        AddText:function(/*string*/ text) 
        { 
            (this.TextBlock).AddText(text);
        },
        
        /// <summary>
        /// Content measurement. 
        /// </summary> 
        /// <param name="constraint">Constraint size.</param>
        /// <returns>Computed desired size.</returns> 
//        protected sealed override Size 
        MeasureOverride:function(/*Size*/ constraint)
        {
            TextBlock.Measure(constraint);
            return TextBlock.DesiredSize; 
        },
 
        /// <summary> 
        /// Content arrangement.
        /// </summary> 
        /// <param name="arrangeSize">Size that element should use to arrange itself and its children.</param>
//        protected sealed override Size 
        ArrangeOverride:function()
        {
            TextBlock.Arrange(new Rect(arrangeSize)); 
            return arrangeSize;
        },
        
        /// <summary>
        /// CreateTextBlock - Creates a text block, adds as visual child, databinds properties and sets up appropriate event listener. 
        /// </summary>
//        private void 
        CreateTextBlock:function() 
        { 
            _textContainer = new TextContainer(this, false /* plainTextOnly */);
            _textBlock = new TextBlock(); 
            AddVisualChild(_textBlock);
            _textBlock.IsContentPresenterContainer = true;
            _textBlock.SetTextContainer(_textContainer);
            InitializeTextContainerListener(); 
        },
        
      /// <summary> 
        /// Gets the Visual child at the specified index. 
        /// </summary>
//        protected override Visual 
        GetVisualChild:function(/*int*/ index) 
        {
            if (index != 0)
            {
                throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)); 
            }
            return TextBlock; 
        }, 

        /// <summary>
        /// UpdateAccessKey - Scans forward in the tree looking for the access key marker, replacing it with access key element. We only support one find.
        /// </summary> 
//        private void 
        UpdateAccessKey:function()
        { 
            var navigator = new TextPointer(TextContainer.Start); 

            while (!_accessKeyLocated && navigator.CompareTo(TextContainer.End) < 0 ) 
            {
                /*TextPointerContext*/ var symbolType = navigator.GetPointerContext(LogicalDirection.Forward);
                switch (symbolType)
                { 
                    case TextPointerContext.Text:
                        var text = navigator.GetTextInRun(LogicalDirection.Forward); 
                        var index = FindAccessKeyMarker(text); 
                        if(index != -1 && index < text.Length - 1)
                        { 
                            var keyText = StringInfo.GetNextTextElement(text, index + 1);
                            /*TextPointer*/var keyEnd = navigator.GetPositionAtOffset(index + 1 + keyText.Length);

                            _accessKey = new Run(keyText); 
                            _accessKey.Style = AccessKeyStyle;
 
                            RegisterAccessKey(); 

                            HasCustomSerializationStorage.SetValue(_accessKey, true); 
                            _accessKeyLocated = true;

                            UninitializeTextContainerListener();
 
                            TextContainer.BeginChange();
                            try 
                            { 
                                var underlineStart = new TextPointer(navigator, index);
                                TextRangeEdit.DeleteInlineContent(underlineStart, keyEnd); 
                                _accessKey.RepositionWithContent(underlineStart);

                            }
                            finally 
                            {
                                TextContainer.EndChange(); 
                                InitializeTextContainerListener(); 
                            }
                        } 

                        break;
                }
                navigator.MoveToNextContextPosition(LogicalDirection.Forward); 
            }
 
            // Convert double _ to single _ 
            navigator = new TextPointer(TextContainer.Start);
            var accessKeyMarker = AccessKeyMarker.ToString(); 
            var doubleAccessKeyMarker = accessKeyMarker + accessKeyMarker;
            while (navigator.CompareTo(TextContainer.End) < 0)
            {
                /*TextPointerContext*/ var symbolType = navigator.GetPointerContext(LogicalDirection.Forward); 
                switch (symbolType)
                { 
                    case TextPointerContext.Text: 
                        var text = navigator.GetTextInRun(LogicalDirection.Forward);
                        var nexText = text.Replace(doubleAccessKeyMarker, accessKeyMarker); 
                        if (text != nexText)
                        {
                            var keyStart = new TextPointer(navigator, 0);
                            var keyEnd = new TextPointer(navigator, text.Length); 

                            UninitializeTextContainerListener(); 
                            TextContainer.BeginChange(); 
                            try
                            { 
                                keyEnd.InsertTextInRun(nexText);
                                TextRangeEdit.DeleteInlineContent(keyStart, keyEnd);
                            }
                            finally 
                            {
                                TextContainer.EndChange(); 
                                InitializeTextContainerListener(); 
                            }
                        } 

                        break;
                }
                navigator.MoveToNextContextPosition(LogicalDirection.Forward); 
            }
        },
        
//        private void 
        RegisterAccessKey:function()
        { 
            if (_currentlyRegistered != null)
            {
                AccessKeyManager.Unregister(_currentlyRegistered, this);
                _currentlyRegistered = null; 
            }
            var key = _accessKey.Text; 
            if (!string.IsNullOrEmpty(key)) 
            {
                AccessKeyManager.Register(key, this); 
                _currentlyRegistered = key;
            }
        },
        
//        private void 
        UpdateText:function(/*string*/ text) 
        {
            if (text == null) 
                text = string.Empty; 

            _accessKeyLocated = false; 
            _accessKey = null;
            TextContainer.BeginChange();
            try
            { 
                TextContainer.DeleteContentInternal(TextContainer.Start, TextContainer.End);
                /*Run*/var run = Inline.CreateImplicitRun(this); 
                (TextContainer.End).InsertTextElement(run); 
                run.Text = text;
            } 
            finally
            {
                TextContainer.EndChange();
            } 
        },
 
        // ------------------------------------------------------------------ 
        // Setup event handler.
        // ----------------------------------------------------------------- 
//        private void 
        InitializeTextContainerListener:function()
        {
            TextContainer.Changed += new TextContainerChangedEventHandler(OnTextContainerChanged);
        }, 

        // ------------------------------------------------------------------ 
        // Clear event handler. 
        // ------------------------------------------------------------------
//        private void 
        UninitializeTextContainerListener:function() 
        {
            TextContainer.Changed -= new TextContainerChangedEventHandler(OnTextContainerChanged);
        },
 
        // -----------------------------------------------------------------
        // Handler for TextContainer.Changed notification. 
        // ------------------------------------------------------------------ 
//        private void 
        OnTextContainerChanged:function(/*object*/ sender, /*TextContainerChangedEventArgs*/ args)
        { 
            // Skip changes that only affect properties.
            if (args.HasContentAddedOrRemoved)
            {
                UpdateAccessKey(); 
            }
        } 
 
	});
	
	Object.defineProperties(AccessText.prototype,{
        /// <summary>
        /// Returns enumerator to logical children. 
        /// </summary>
//        protected internal override IEnumerator 
		LogicalChildren: 
        { 
            get:function()
            { 
                return new RangeContentEnumerator(TextContainer.Start, TextContainer.End);
            }
        },

        /// <summary>
        ///     Read only access to the key after the first underline character 
        /// </summary> 
//        public char 
        AccessKey:
        { 
            get:function()
            {
                //
                return (_accessKey != null && _accessKey.Text.Length > 0) ? _accessKey.Text[0] : 0; 
            }
        },
        
        /// <summary> 
        /// The Text property defines the text to be displayed.
        /// </summary> 
//        public string 
        Text:
        { 
            get:function() { return this.GetValue(TextProperty); },
            set:function(value) { this.SetValue(TextProperty, value); }
        },
        
        /// <summary>
        /// The FontFamily property specifies the name of font family. 
        /// </summary>
//        public FontFamily 
        FontFamily:
        {
            get:function() { return this.GetValue(FontFamilyProperty); },
            set:function(value) { this.SetValue(FontFamilyProperty, value); } 
        },
        /// <summary> 
        /// The FontStyle property requests normal, italic, and oblique faces within a font family.
        /// </summary> 
//        public FontStyle 
        FontStyle: 
        {
            get:function() { return this.GetValue(FontStyleProperty); }, 
            set:function(value) { this.SetValue(FontStyleProperty, value); }
        },
        /// <summary>
        /// The FontWeight property specifies the weight of the font.
        /// </summary>
//        public FontWeight 
        FontWeight: 
        {
            get:function() { return this.GetValue(FontWeightProperty); }, 
            set:function(value) { this.SetValue(FontWeightProperty, value); } 
        },
        
        /// <summary> 
        /// The FontStretch property selects a normal, condensed, or extended face from a font family.
        /// </summary> 
//        public FontStretch 
        FontStretch:
        {
            get:function() { return this.GetValue(FontStretchProperty); },
            set:function(value) { this.SetValue(FontStretchProperty, value); } 
        },

        /// <summary> 
        /// The FontSize property specifies the size of the font.
        /// </summary> 
//        public double 
        FontSize: 
        {
            get:function() { return this.GetValue(FontSizeProperty); },
            set:function(value) { this.SetValue(FontSizeProperty, value); }
        },
        
        /// <summary>
        /// The Foreground property specifies the foreground brush of an element's text content. 
        /// </summary>
//        public Brush 
        Foreground: 
        { 
            get:function() { return this.GetValue(ForegroundProperty); },
            set:function(value) { this.SetValue(ForegroundProperty, value); } 
        },
        /// <summary>
        /// The Background property defines the brush used to fill the content area. 
        /// </summary> 
//        public Brush 
        Background:
        { 
            get:function() { return this.GetValue(BackgroundProperty); },
            set:function(value) { this.SetValue(BackgroundProperty, value); }
        },
        
        /// <summary> 
        /// The TextDecorations property specifies decorations that are added to the text of an element.
        /// </summary> 
//        public TextDecorationCollection 
        TextDecorations:
        {
            get:function() { return this.GetValue(TextDecorationsProperty); },
            set:function(value) { this.SetValue(TextDecorationsProperty, value); } 
        },
        
        /// <summary> 
        /// The TextEffects property specifies effects that are added to the text of an element.
        /// </summary>
//        public TextEffectCollection 
        TextEffects:
        { 
            get:function() { return this.GetValue(TextEffectsProperty); },
            set:function(value) { this.SetValue(TextEffectsProperty, value); } 
        },
        
        /// <summary> 
        /// The LineHeight property specifies the height of each generated line box. 
        /// </summary>
//        public double 
        LineHeight:
        {
            get:function() { return this.GetValue(LineHeightProperty); },
            set:function(value) { this.SetValue(LineHeightProperty, value); } 
        },
        
        
        /// <summary> 
        /// The LineStackingStrategy property specifies how lines are placed
        /// </summary> 
//        public LineStackingStrategy 
        LineStackingStrategy: 
        {
            get:function() { return this.GetValue(LineStackingStrategyProperty); }, 
            set:function(value) { this.SetValue(LineStackingStrategyProperty, value); }
        },
        
        /// <summary>
        /// The TextAlignment property specifies horizontal alignment of the content.
        /// </summary>
//        public TextAlignment 
        TextAlignment: 
        {
            get:function() { return this.GetValue(TextAlignmentProperty); }, 
            set:function(value) { this.SetValue(TextAlignmentProperty, value); } 
        },
        
        /// <summary>
        /// The TextTrimming property specifies the trimming behavior situation 
        /// in case of clipping some textual content caused by overflowing the line's box.
        /// </summary> 
//        public TextTrimming 
        TextTrimming: 
        {
            get:function() { return this.GetValue(TextTrimmingProperty); }, 
            set:function(value) { this.SetValue(TextTrimmingProperty, value); }
        },
        
        /// <summary> 
        /// The TextWrapping property controls whether or not text wraps 
        /// when it reaches the flow edge of its containing block box.
        /// </summary> 
//        public TextWrapping 
        TextWrapping:
        {
            get:function() { return this.GetValue(TextWrappingProperty); },
            set:function(value) { this.SetValue(TextWrappingProperty, value); } 
        },
        
        /// <summary> 
        /// The BaselineOffset property provides an adjustment to baseline offset
        /// </summary> 
//        public double 
        BaselineOffset: 
        {
            get:function() { return this.GetValue(BaselineOffsetProperty); }, 
            set:function(value) { this.SetValue(BaselineOffsetProperty, value); }
        },
        
//        internal TextBlock 
        TextBlock:
        {
            get:function() 
            {
                if (_textBlock == null)
                    CreateTextBlock();
                return _textBlock; 
            }
        }, 


//        private TextContainer 
        TextContainer: 
        { 
            get:function()
            { 
                if (_textContainer == null)
                    CreateTextBlock();
                return _textContainer;
            } 
        },
        
        /// <summary> 
        /// Gets the Visual children count of the AccessText control.
        /// </summary> 
//        protected override int 
        VisualChildrenCount:
        {
            get:function() { return 1; }
        },
        
	});
	
	Object.defineProperties(AccessText,{
		/// <summary> 
        /// DependencyProperty for <see cref="Text" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		TextProperty:
        {
        	get:function(){
        		if(AccessText._TextProperty === undefined){
        			AccessText._TextProperty =
                        DependencyProperty.Register( 
                                "Text",
                                String.Type, 
                                AccessText.Type, 
                                /*new FrameworkPropertyMetadata(
                                        string.Empty, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(null, OnTextChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        String.Empty, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(null, OnTextChanged)));
        		}
        		return AccessText._TextProperty;
        	}
        }, 

        /// <summary> 
        /// DependencyProperty for <see cref="FontFamily" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		FontFamilyProperty:
        {
        	get:function(){
        		if(AccessText._FontFamilyProperty === undefined){
        			AccessText._FontFamilyProperty = 
                        TextElement.FontFamilyProperty.AddOwner(AccessText.Type);
        		}
        		return AccessText._FontFamilyProperty;
        	}
        },  

        /// <summary> 
        /// DependencyProperty for <see cref="FontStyle" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		FontStyleProperty:
        {
        	get:function(){
        		if(AccessText._FontStyleProperty === undefined){
        			AccessText._FontStyleProperty =
                        TextElement.FontStyleProperty.AddOwner(AccessText.Type);
        		}
        		return AccessText._FontStyleProperty;
        	}
        },  

        /// <summary> 
        /// DependencyProperty for <see cref="FontWeight" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		FontWeightProperty:
        {
        	get:function(){
        		if(AccessText._FontWeightProperty === undefined){
        			AccessText._FontWeightProperty = 
                        TextElement.FontWeightProperty.AddOwner(AccessText.Type);
        		}
        		return AccessText._FontWeightProperty;
        	}
        },  
 
        /// <summary>
        /// DependencyProperty for <see cref="FontStretch" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		FontStretchProperty:
        {
        	get:function(){
        		if(AccessText._FontStretchProperty === undefined){
        			AccessText._FontStretchProperty = 
                        TextElement.FontStretchProperty.AddOwner(AccessText.Type);
        		}
        		return AccessText._FontStretchProperty;
        	}
        }, 
 
        /// <summary> 
        /// DependencyProperty for <see cref="FontSize" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        FontSizeProperty:
        {
        	get:function(){
        		if(AccessText._FontSizeProperty === undefined){
        			AccessText._FontSizeProperty =
                        TextElement.FontSizeProperty.AddOwner(AccessText.Type);
        		}
        		return AccessText._FontSizeProperty;
        	}
        }, 

        /// <summary> 
        /// DependencyProperty for <see cref="Foreground" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        ForegroundProperty:
        {
        	get:function(){
        		if(AccessText._ForegroundProperty === undefined){
        			AccessText._ForegroundProperty = 
                        TextElement.ForegroundProperty.AddOwner(AccessText.Type);
        		}
        		return AccessText._ForegroundProperty;
        	}
        }, 

        /// <summary>
        /// DependencyProperty for <see cref="Background" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        BackgroundProperty:
        {
        	get:function(){
        		if(AccessText._BackgroundProperty === undefined){
        			AccessText._BackgroundProperty = 
                        TextElement.BackgroundProperty.AddOwner( 
                                AccessText.Type,
                                /*new FrameworkPropertyMetadata( 
                                        null,
                                        FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(null, OnPropertyChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(null,
                                        FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(null, OnPropertyChanged)));
        		}
        		return AccessText._BackgroundProperty;
        	}
        }, 
        /// <summary>
        /// DependencyProperty for <see cref="TextDecorations" /> property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        TextDecorationsProperty:
        {
        	get:function(){
        		if(AccessText._TextDecorationsProperty === undefined){
        			AccessText._TextDecorationsProperty =
                        Inline.TextDecorationsProperty.AddOwner( 
                                AccessText.Type,
                                /*new FrameworkPropertyMetadata(
                                        new FreezableDefaultValueFactory(TextDecorationCollection.Empty),
                                        FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnPropertyChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        new FreezableDefaultValueFactory(TextDecorationCollection.Empty),
                                        FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnPropertyChanged)));
        		}
        		return AccessText._TextDecorationsProperty;
        	}
        },  
 
        /// <summary> 
        /// DependencyProperty for <see cref="TextEffects" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        TextEffectsProperty:
        {
        	get:function(){
        		if(AccessText._TextEffectsProperty === undefined){
        			AccessText._TextEffectsProperty =
                        TextElement.TextEffectsProperty.AddOwner(
                                AccessText.Type,
                                /*new FrameworkPropertyMetadata( 
                                        new FreezableDefaultValueFactory(TextEffectCollection.Empty),
                                        FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnPropertyChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB( 
                                        new FreezableDefaultValueFactory(TextEffectCollection.Empty),
                                        FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnPropertyChanged))); 
        		}
        		return AccessText._TextEffectsProperty;
        	}
        },  

        /// <summary> 
        /// DependencyProperty for <see cref="LineHeight" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
        LineHeightProperty:
        {
        	get:function(){
        		if(AccessText._LineHeightProperty === undefined){
        			AccessText._LineHeightProperty =
                        Block.LineHeightProperty.AddOwner(AccessText.Type); 
        		}
        		return AccessText._LineHeightProperty;
        	}
        },  

        /// <summary> 
        /// DependencyProperty for <see cref="LineStackingStrategy" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        LineStackingStrategyProperty:
        {
        	get:function(){
        		if(AccessText._LineStackingStrategyProperty === undefined){
        			AccessText._LineStackingStrategyProperty  =
                        Block.LineStackingStrategyProperty.AddOwner(AccessText.Type);
        		}
        		return AccessText._LineStackingStrategyProperty;
        	}
        }, 

        /// <summary> 
        /// DependencyProperty for <see cref="TextAlignment" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        TextAlignmentProperty:
        {
        	get:function(){
        		if(AccessText._TextAlignmentProperty === undefined){
        			AccessText._TextAlignmentProperty = 
                        Block.TextAlignmentProperty.AddOwner(AccessText.Type);
        		}
        		return AccessText._TextAlignmentProperty;
        	}
        },  
 
        /// <summary>
        /// DependencyProperty for <see cref="TextTrimming" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
        TextTrimmingProperty:
        {
        	get:function(){
        		if(AccessText._TextTrimmingProperty === undefined){
        			AccessText._TextTrimmingProperty = 
                        TextBlock.TextTrimmingProperty.AddOwner(
                                AccessText.Type, 
                                /*new FrameworkPropertyMetadata( 
                                        TextTrimming.None,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnPropertyChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB( 
                                        TextTrimming.None,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnPropertyChanged)));
        		}
        		return AccessText._TextTrimmingProperty;
        	}
        },  

        /// DependencyProperty for <see cref="TextWrapping" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        TextWrappingProperty:
        {
        	get:function(){
        		if(AccessText._TextWrappingProperty === undefined){
        			AccessText._TextWrappingProperty = 
                        TextBlock.TextWrappingProperty.AddOwner(
                                AccessText.Type, 
                                /*new FrameworkPropertyMetadata(
                                        TextWrapping.NoWrap,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(null, OnPropertyChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        TextWrapping.NoWrap,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(null, OnPropertyChanged)));
        		}
        		return AccessText._TextWrappingProperty;
        	}
        },   
 
        /// <summary> 
        /// DependencyProperty for <see cref="BaselineOffset" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        BaselineOffsetProperty:
        {
        	get:function(){
        		if(AccessText._BaselineOffsetProperty === undefined){
        			AccessText._BaselineOffsetProperty =
                        TextBlock.BaselineOffsetProperty.AddOwner(AccessText.Type, 
                        		/*new FrameworkPropertyMetadata(new PropertyChangedCallback(null, OnPropertyChanged))*/
                        		FrameworkPropertyMetadata.Bu);
        		}
        		return AccessText._BaselineOffsetProperty;
        	}
        },  

  
//        internal static char 
        AccessKeyMarker: 
        {
            get:function() { return _accessKeyMarker; }
        },
        
//        private static Style 
        AccessKeyStyle:
        {
            get:function()
            { 
                if (_accessKeyStyle == null)
                { 
                    var accessKeyStyle = new Style(Run.Type); 
                    var trigger = new Trigger();
                    trigger.Property = KeyboardNavigation.ShowKeyboardCuesProperty; 
                    trigger.Value = true;
                    trigger.Setters.Add(new Setter(TextDecorationsProperty, System.Windows.TextDecorations.Underline));
                    accessKeyStyle.Triggers.Add(trigger);
                    accessKeyStyle.Seal(); 
                    _accessKeyStyle = accessKeyStyle;
                } 
                return _accessKeyStyle; 
            }
        },
        

        
	});
	
//	private static void 
	function OnPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
	{
		d.TextBlock.SetValue(e.Property, e.NewValue); 
	}
	
    // Returns the index of _ marker.
    // _ can be escaped by double _ 
//    private static int 
	function FindAccessKeyMarker(/*string*/ text)
    {
        var lenght = text.Length;
        var startIndex = 0; 
        while (startIndex < lenght)
        { 
        	var index = text.IndexOf(AccessKeyMarker, startIndex); 
            if (index == -1)
                return -1; 
            // If next char exist and different from _
            if (index + 1 < lenght && text[index + 1] != AccessKeyMarker)
                return index;
            startIndex = index + 2; 
        }

        return -1; 
    }

//    internal static string 
	AccessText.RemoveAccessKeyMarker = function(/*string*/ text)
    {
        if (!string.IsNullOrEmpty(text))
        { 
            var accessKeyMarker = AccessKeyMarker.ToString();
            var doubleAccessKeyMarker = accessKeyMarker + accessKeyMarker; 
            var index = FindAccessKeyMarker(text); 
            if (index >=0 && index < text.Length - 1)
                text = text.Remove(index, 1); 
            // Replace double _ with single _
            text = text.Replace(doubleAccessKeyMarker, accessKeyMarker);

        } 
        return text;
    }; 
    
    //-------------------------------------------------------------------
    // Text helpers 
    //------------------------------------------------------------------- 
//    private static void 
	function OnTextChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.UpdateText(e.NewValue);
    }
	
	AccessText.Type = new Type("AccessText", AccessText, [FrameworkElement.Type, IAddChild.Type]);

    
	return AccessText;
});
 

 

