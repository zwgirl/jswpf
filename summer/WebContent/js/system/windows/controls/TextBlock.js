/**
 * TextBlock
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerator", "windows/UncommonField",
        "windows/FrameworkElement", "windows/IContentHost", "markup/IAddChild", "system/IServiceProvider",
        "input/MouseEventArgs", "input/Mouse", "input/Keyboard", "input/KeyboardDevice", "input/KeyEventArgs",
        "documents/TextElementCollection", "input/EventListenerManager"], 
		function(declare, Type, IEnumerator, UncommonField,
				FrameworkElement, IContentHost, IAddChild, IServiceProvider,
				MouseEventArgs, Mouse, Keyboard, KeyboardDevice, KeyEventArgs,
				TextElementCollection, EventListenerManager){
	
//  private enum 
	var Flags = declare(null, {});
	
	Flags.FormattedOnce           = 0x1;      // Element has been formatted at least once. 
	Flags.MeasureInProgress       = 0x2;      // Measure is in progress.
	Flags.TreeInReadOnlyMode      = 0x4;      // Tree (content) is in read only mode. 
	Flags.RequiresAlignment       = 0x8;      // Content requires alignment process. 
	Flags.ContentChangeInProgress = 0x10;     // Content change is in progress
                                            //(it has been started; but is is not completed yet). 
	Flags.IsContentPresenterContainer = 0x20; // Is this Text control being used by a ContentPresenter to host its content
	Flags.HasParagraphEllipses    = 0x40;     // Has paragraph ellipses
	Flags.PendingTextContainerEventInit = 0x80; // Needs TextContainer event hookup on next Measure call.
	Flags.ArrangeInProgress       = 0x100;      // Arrange is in progress. 
	Flags.IsTypographySet         = 0x200;      // Typography properties are not at default values
	Flags.TextContentChanging     = 0x400;    // TextProperty update in progress. 
	Flags.IsHyphenatorSet         = 0x800;   // used to indicate when HyphenatorField has been set 
	Flags.HasFirstLine            = 0x1000;
	
	var TextBlock = declare("TextBlock", [FrameworkElement, IContentHost, IAddChild, IServiceProvider], {
		
		constructor:function(/*Inline*/ inline){
			if(inline === undefined){
				inline = null;
			}
			if (inline != null)
	        { 
				this.Inlines.Add(inline);
	        }

			//-------------------------------------------------------------------- 
			//Distance from the top of the Element to its baseline.
			//------------------------------------------------------------------- 
//			private double 
			this._baselineOffset = 0; 
			
			this._dom = window.document.createElement('span');
			this._dom._source = this;
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		

		///<summary> 
		/// Called to Add the object as a Child.
		///</summary> 
		///<param name="value"> 
		/// Object to add as a child
		///</param> 
//		void IAddChild.
		AddChild:function(/*Object*/ value)
		{
			if (value == null)
			{ 
				throw new ArgumentNullException("value");
			} 
			
			if(typeof(value) == "string"){
				return this.AddText(value);
			}
			
			var valueType = value.GetType();

		  	// Do implicit conversion to allowed inline type - if possible
//			if (!TextSchema.IsValidChildOfContainer(parentType, /* childType */valueType)) 
//			{
				if (value instanceof UIElement) 
				{ 
					value = new InlineUIContainer(value);
				} 
//				else
//				{
//					throw new ArgumentException(SR.Get(SRID.TextSchema_ChildTypeIsInvalid, parentType.Name, valueType.Name));
//				} 
//			}

			this.Inlines.Add(value); 
		},
		

		///<summary> 
		/// Called when text appears under the tag in markup. 
		///</summary>
		///<param name="text"> 
		/// Text to Add to the Object
		///</param>
//		void IAddChild.
		AddText:function(/*string*/ text)
		{ 
			if (text == null)
			{ 
				throw new ArgumentNullException("text"); 
			}

			this.Text = this.Text + text;

			var implicitRun = Inline.CreateImplicitRun(this);
			this.Inlines.Add(implicitRun);
			implicitRun.Text = text; 
			
		},
		
		/// <summary>
		///   Derived class must implement to support Visual children. The method must return
		///    the child at the specified index. Index must be between 0 and GetVisualChildrenCount-1.
		/// 
		///    By default a Visual does not have any children.
		/// 
		///  Remark: 
		///       During this virtual call it is not valid to modify the Visual tree.
		/// </summary> 
//		protected override Visual 
		GetVisualChild:function(/*int*/ index)
		{
		  return this.VisualChildren.Get(index); 
		},

		/// <summary>
		/// Content measurement.
		/// </summary>
		/// <param name="constraint">Constraint size.</param> 
		/// <returns>Computed desired size.</returns>
//		protected sealed override Size 
		MeasureOverride:function() 
		{ 
			
			if(this.Foreground != null || this.Foreground !=undefined){
				this._dom.style.setProperty("color:", this.Foreground.Color.ToString(), "");
			}
			
			if(this.Background != null || this.Background !=undefined){
				this._dom.style.setProperty("background-color",this.Background.Color.ToString(),"");
			}

		}, 

		/// <summary>
		/// Content arrangement. 
		/// </summary>
		/// <param name="arrangeSize">Size that element should use to arrange itself and its children.</param>
//		protected sealed override Size 
		ArrangeOverride:function()
		{ 
//			parent.appendChild(this._dom);
			
			if(this.Inlines.Count<=0){
	           	this.textNode = window.document.createTextNode(this.Text);
	           	this._dom.appendChild(this.textNode);
//				this._dom.innerText = this.Text;
			}else{
				for(var i=0; i<this.Inlines.Count; i++){
					var child = this.Inlines.Get(i);
					this._dom.appendChild(child._dom);
					child.Arrange(this._dom);
				}
			}
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
	          	
	          	if(dp === TextBlock.TextProperty){
            		if(e.NewValue){
            			if(this.textNode!=null){
                   			this.textNode.data = e.NewValue;
            			}
 
//            			var textNode = window.document.createTextNode(e.NewValue);
//        	           	this._dom.appendChild(textNode);
            		}else{
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
		/// remove a child from TextBlock's collection (only Visually)
		/// Used by ComplexLine.cs, etc
		/// </summary> 
//		internal void 
		RemoveChild:function(/*Visual*/ child)
		{ 
			this.VisualChildren.Remove(child); 
		},

		//--------------------------------------------------------------------
		//Measure child UIElement.
		//
//		    inlineObject - hosted inline object to measure. 
		//
		//Returns: Size of the inline object. 
		//------------------------------------------------------------------- 
//		internal Size 
		MeasureChild:function(/*InlineObject*/ inlineObject)
		{ 
		  
		},


		//----------------------------------------------------------------- 
		//SetFlags is used to set or unset one or multiple flags.
		//-----------------------------------------------------------------
//		private void 
		SetFlags:function(/*bool*/ value, /*Flags*/ flags)
		{ 
			this._flags = value ? (this._flags | flags) : (this._flags & (~flags));
		}, 

		//-----------------------------------------------------------------
		//CheckFlags returns true if all of passed flags in the bitmask are set. 
		//------------------------------------------------------------------
//		private bool 
		CheckFlags:function(/*Flags*/ flags)
		{
			return ((this._flags & flags) == flags); 
		},


	});
	
	Object.defineProperties(TextBlock.prototype,{
		
		/// <summary>
		/// Returns enumerator to logical children.
		/// </summary>
//		protected internal override IEnumerator 
		LogicalChildren: 
		{
		  get:function() 
		  { 
			  if (IsContentPresenterContainer)
			  { 
				  // We are hosting content that belongs to a ContentPresenter
				  return EmptyEnumerator.Instance;
			  }
			  
			  this.Inlines.GetEnumerator();
		  }
		},
		
		VisualChildren:{
			get:function()
			{
				if(this._visualChildren === undefined){
					this._visualChildren = new VisualCollection(this);  
				}
				return this._visualChildren;
			}
		},
		
		/// <value>
		/// Collection of Inline items contained in this TextBlock. 
		/// </value> 
//		public InlineCollection 
		Inlines: 
		{
		  get:function()
		  {
			  if(this._inlines === undefined){
				  this._inlines = new TextElementCollection(this); 
			  }
		      return this._inlines;
		  }
		}, 

		/// <summary>
		/// Breaking condition before the Element. 
		/// </summary>
//		public LineBreakCondition 
		BreakBefore: { get:function() { return this.LineBreakCondition.BreakDesired; } }, 

		/// <summary>
		/// Breaking condition after the Element. 
		/// </summary>
//		public LineBreakCondition 
		BreakAfter: { get:function() { return this.LineBreakCondition.BreakDesired; } },

		/// <summary> 
		/// Access to all text typography properties.
		/// </summary> 
//		public Typography 
		Typography: 
		{
		  get:function() 
		  {
		      return new Typography(this);
		  }
		},
		
		/// <summary>
		/// The BaselineOffset property provides an adjustment to baseline offset
		/// </summary>
//		public double 
		BaselineOffset: 
		{
		  get:function() { return this.GetValue(TextBlock.BaselineOffsetProperty); }, 
		  set:function(value) { this.SetValue(TextBlock.BaselineOffsetProperty, value); } 
		},
		/// <summary>
		/// The Text property defines the content (text) to be displayed.
		/// </summary>
//		public string 
		Text:
		{ 
		  get:function() { return this.GetValue(TextBlock.TextProperty); }, 
		  set:function(value) { this.SetValue(TextBlock.TextProperty, value); }
		},
		
		/// <summary> 
		/// The FontFamily property specifies the name of font family.
		/// </summary> 
//		public FontFamily 
		FontFamily:
		{
		  get:function() { return this.GetValue(TextBlock.FontFamilyProperty); }, 
		  set:function(value) { this.SetValue(TextBlock.FontFamilyProperty, value); }
		},

		/// <summary>
		/// The FontStyle property requests normal, italic, and oblique faces within a font family. 
		/// </summary>
//		public FontStyle 
		FontStyle:
		{
		  get:function() { return this.GetValue(TextBlock.FontStyleProperty); }, 
		  set:function(value) { SetValue(TextBlock.FontStyleProperty, value); }
		}, 

		/// <summary>
		/// The FontWeight property specifies the weight of the font. 
		/// </summary>
//		public FontWeight 
		FontWeight:
		{
		  get:function() { return this.GetValue(TextBlock.FontWeightProperty); }, 
		  set:function(value) { this.SetValue(TextBlock.FontWeightProperty, value); }
		}, 

		/// <summary>
		/// The FontStretch property selects a normal, condensed, or extended face from a font family. 
		/// </summary>
//		public FontStretch 
		FontStretch:
		{
		  get:function() { return this.GetValue(TextBlock.FontStretchProperty); }, 
		  set:function(value) { this.SetValue(TextBlock.FontStretchProperty, value); }
		}, 

		/// <summary> 
		/// The FontSize property specifies the size of the font.
		/// </summary>
//		public double 
		FontSize:
		{ 
		  get:function() { return this.GetValue(TextBlock.FontSizeProperty); }, 
		  set:function(value) { this.SetValue(TextBlock.FontSizeProperty, value); }
		}, 

		/// <summary> 
		/// The Foreground property specifies the foreground brush of an element's text content.
		/// </summary> 
//		public Brush 
		Foreground: 
		{
		  get:function() { return this.GetValue(TextBlock.ForegroundProperty); },
		  set:function(value) { this.SetValue(TextBlock.ForegroundProperty, value); }
		},

		/// <summary>
		/// The Background property defines the brush used to fill the content area. 
		/// </summary>
//		public Brush 
		Background:
		{
		  get:function() { return this.GetValue(TextBlock.BackgroundProperty); }, 
		  set:function(value) { this.SetValue(TextBlock.BackgroundProperty, value); }
		}, 

		/// <summary>
		/// The TextDecorations property specifies decorations that are added to the text of an element.
		/// </summary> 
//		public TextDecorationCollection 
		TextDecorations:
		{ 
		  get:function() { return this.GetValue(TextBlock.TextDecorationsProperty); }, 
		  set:function(value) { this.SetValue(TextBlock.TextDecorationsProperty, value); }
		}, 

		/// <summary>
		/// The TextEffects property specifies effects that are added to the text of an element. 
		/// </summary>
//		public TextEffectCollection 
		TextEffects: 
		{ 
		  get:function() { return this.GetValue(TextBlock.TextEffectsProperty); },
		  set:function(value) { this.SetValue(TextBlock.TextEffectsProperty, value); } 
		},

		/// <summary> 
		/// The LineHeight property specifies the height of each generated line box.
		/// </summary>
//		public double 
		LineHeight: 
		{
		  get:function() { return this.GetValue(TextBlock.LineHeightProperty); }, 
		  set:function(value) { this.SetValue(TextBlock.LineHeightProperty, value); } 
		},

		/// <summary>
		/// The LineStackingStrategy property specifies how lines are placed
		/// </summary>
//		public LineStackingStrategy 
		LineStackingStrategy: 
		{
		  get:function() { return this.GetValue(TextBlock.LineStackingStrategyProperty); }, 
		  set:function(value) { this.SetValue(TextBlock.LineStackingStrategyProperty, value); } 
		},

		/// <summary> 
		/// The Padding property specifies the padding of the element.
		/// </summary> 
//		public Thickness 
		Padding: 
		{
		  get:function() { return this.GetValue(TextBlock.PaddingProperty); }, 
		  set:function(value) { this.SetValue(TextBlock.PaddingProperty, value); }
		},

		/// <summary>
		/// The TextAlignment property specifies horizontal alignment of the content.
		/// </summary>
//		public TextAlignment 
		TextAlignment: 
		{
		  get:function() { return this.GetValue(TextBlock.TextAlignmentProperty); }, 
		  set:function(value) { this.SetValue(TextBlock.TextAlignmentProperty, value); } 
		},

		/// <summary>
		/// The TextTrimming property specifies the trimming behavior situation 
		/// in case of clipping some textual content caused by overflowing the line's box.
		/// </summary>
//		public TextTrimming 
		TextTrimming:
		{ 
		  get:function() { return this.GetValue(TextBlock.TextTrimmingProperty); },
		  set:function(value) { this.SetValue(TextBlock.TextTrimmingProperty, value); } 
		},

		/// <summary>
		/// The TextWrapping property controls whether or not text wraps 
		/// when it reaches the flow edge of its containing block box. 
		/// </summary>
//		public TextWrapping 
		TextWrapping: 
		{
		  get:function() { return this.GetValue(TextBlock.TextWrappingProperty); },
		  set:function(value) { this.SetValue(TextBlock.TextWrappingProperty, value); }
		}, 

		/// <summary> 
		///  Derived classes override this property to enable the Visual code to enumerate
		///  the Visual children. Derived classes need to return the number of children 
		///  from this method. 
		///
		///    By default a Visual does not have any children. 
		///
		///  Remark:
		///      During this virtual method the Visual tree must not be modified.
		/// </summary> 
//		protected override int 
		VisualChildrenCount:
		{ 
		  get:function() { return this.VisualChildren.Count; } 
		},
		

		//------------------------------------------------------------------- 
		//Text formatter object
		//--------------------------------------------------------------------
//		internal TextFormatter 
		TextFormatter:
		{ 
		  get:function()
		  { 
		      var textFormattingMode = TextOptions.GetTextFormattingMode(this); 
		      if (TextFormattingMode.Display == textFormattingMode)
		      { 
		          if (this._textFormatterDisplay == null)
		          {
		        	  this._textFormatterDisplay = System.Windows.Media.TextFormatting.TextFormatter.FromCurrentDispatcher(textFormattingMode);
		          } 
		          return this._textFormatterDisplay;
		      } 
		      else 
		      {
		          if (this._textFormatterIdeal == null) 
		          {
		        	  this._textFormatterIdeal = System.Windows.Media.TextFormatting.TextFormatter.FromCurrentDispatcher(textFormattingMode);
		          }
		          return this._textFormatterIdeal; 
		      }
		  } 
		}, 

		//-------------------------------------------------------------------- 
		//TextBlock paragraph properties.
		//-------------------------------------------------------------------
//		internal LineProperties 
		ParagraphProperties:
		{ 
		  get:function()
		  { 
		      var lineProperties = this.GetLineProperties(); 
		      return lineProperties;
		  } 
		},

		//--------------------------------------------------------------------
		//IsTypographyDefaultValue 
		//-------------------------------------------------------------------
//		internal bool 
		IsTypographyDefaultValue: 
		{ 
		  get:function()
		  { 
		      return !this.CheckFlags(Flags.IsTypographySet);
		  }
		},

		//-------------------------------------------------------------------
		//Is this TextBlock control being used by a ContentPresenter/ HyperLink 
		//to host its content. If it is then TextBlock musn't try to disconnect the 
		//logical parent pointer for the content. This flag allows the TextBlock
		//to discover this special scenario and behave differently. 
		//--------------------------------------------------------------------
//		internal bool 
		IsContentPresenterContainer:
		{
		  get:function() { return this.CheckFlags(Flags.IsContentPresenterContainer); }, 
		  set:function(value) { this.SetFlags(value, Flags.IsContentPresenterContainer); }
		}, 
		
	});
	
	Object.defineProperties(TextBlock,{
		/// <summary> 
		/// DependencyProperty for <see cref="BaselineOffset" /> property.
		/// </summary> 
//		public static readonly DependencyProperty 
		BaselineOffsetProperty:
        {
        	get:function(){
        		if(TextBlock._BaselineOffsetProperty === undefined){
        			TextBlock._BaselineOffsetProperty=
        			      DependencyProperty.RegisterAttached(
        			              "BaselineOffset",
        			              Number.Type, 
        			              TextBlock.Type,
        			             /* new FrameworkPropertyMetadata( 
        			                      Number.NaN, 
        			                      new PropertyChangedCallback(null, OnBaselineOffsetChanged))*/
        			              FrameworkPropertyMetadata.BuildWithDVandPCCB( 
        			                      Number.NaN, 
        			                      new PropertyChangedCallback(null, OnBaselineOffsetChanged)));
        		}
        		
        		return TextBlock._BaselineOffsetProperty;
        	}
        }, 
		
		/// <summary>
		/// DependencyProperty for <see cref="Text" /> property. 
		/// </summary>
//		public static readonly DependencyProperty 
		TextProperty:
        {
        	get:function(){
        		if(TextBlock._TextProperty === undefined){
        			TextBlock._TextProperty= 
        			      DependencyProperty.Register(
        			              "Text", 
        			              String.Type,
        			              TextBlock.Type,
        			              /*new FrameworkPropertyMetadata(
        			                      String.Empty, 
        			                      FrameworkPropertyMetadataOptions.AffectsMeasure |
        			                      FrameworkPropertyMetadataOptions.AffectsRender, 
        			                      new PropertyChangedCallback(null, OnTextChanged), 
        			                      new CoerceValueCallback(null, CoerceText))*/
        			              FrameworkPropertyMetadata.Build4(
        			                      String.Empty, 
        			                      FrameworkPropertyMetadataOptions.AffectsMeasure |
        			                      FrameworkPropertyMetadataOptions.AffectsRender, 
        			                      new PropertyChangedCallback(null, OnTextChanged), 
        			                      new CoerceValueCallback(null, CoerceText)));
        		}
        		
        		return TextBlock._TextProperty;
        	}
        }, 
		
		/// <summary> 
		/// DependencyProperty for <see cref="FontFamily" /> property.
		/// </summary>
//		public static readonly DependencyProperty 
		FontFamilyProperty:
        {
        	get:function(){
        		if(TextBlock._FontFamilyProperty === undefined){
        			TextBlock._FontFamilyProperty= 
        			      TextElement.FontFamilyProperty.AddOwner(TextBlock.Type);
        		}
        		
        		return TextBlock._FontFamilyProperty;
        	}
        }, 
		
		/// <summary>
		/// DependencyProperty for <see cref="FontStyle" /> property.
		/// </summary>
//		public static readonly DependencyProperty 
		FontStyleProperty:
        {
        	get:function(){
        		if(TextBlock._FontStyleProperty === undefined){
        			TextBlock._ClickEvent=
        			      TextElement.FontStyleProperty.AddOwner(TextBlock.Type); 
        		}
        		
        		return TextBlock._FontStyleProperty;
        	}
        }, 

		/// <summary>
		/// DependencyProperty for <see cref="FontWeight" /> property.
		/// </summary>
//		public static readonly DependencyProperty 
		FontWeightProperty:
        {
        	get:function(){
        		if(TextBlock._FontWeightProperty === undefined){
        			TextBlock._FontWeightProperty=
        			      TextElement.FontWeightProperty.AddOwner(TextBlock.Type); 
        		}
        		
        		return TextBlock._FontWeightProperty;
        	}
        }, 

		/// <summary>
		/// DependencyProperty for <see cref="FontStretch" /> property.
		/// </summary>
//		public static readonly DependencyProperty 
		FontStretchProperty:
        {
        	get:function(){
        		if(TextBlock._FontStretchProperty === undefined){
        			TextBlock._FontStretchProperty=
        			      TextElement.FontStretchProperty.AddOwner(TextBlock.Type); 
        		}
        		
        		return TextBlock._FontStretchProperty;
        	}
        }, 

		/// <summary>
		/// DependencyProperty for <see cref="FontSize" /> property.
		/// </summary>
//		public static readonly DependencyProperty 
		FontSizeProperty:
        {
        	get:function(){
        		if(TextBlock._FontSizeProperty === undefined){
        			TextBlock._FontSizeProperty=
        			      TextElement.FontSizeProperty.AddOwner( 
        			              TextBlock.Type); 
        		}
        		
        		return TextBlock._FontSizeProperty;
        	}
        }, 

		/// <summary>
		/// DependencyProperty for <see cref="Foreground" /> property. 
		/// </summary> 
//		public static readonly DependencyProperty 
		ForegroundProperty:
        {
        	get:function(){
        		if(TextBlock._ForegroundProperty === undefined){
        			TextBlock._ForegroundProperty= 
        			      TextElement.ForegroundProperty.AddOwner(
        			              TextBlock.Type);
        		}
        		
        		return TextBlock._ForegroundProperty;
        	}
        }, 

		/// <summary> 
		/// DependencyProperty for <see cref="Background" /> property. 
		/// </summary>
//		public static readonly DependencyProperty 
		BackgroundProperty:
        {
        	get:function(){
        		if(TextBlock._BackgroundProperty === undefined){
        			TextBlock._BackgroundProperty=
        			      TextElement.BackgroundProperty.AddOwner(
        			              TextBlock.Type,
        			              new FrameworkPropertyMetadata( 
        			                      null,
        			                      FrameworkPropertyMetadataOptions.AffectsRender)); 
        		}
        		
        		return TextBlock._BackgroundProperty;
        	}
        }, 

		/// <summary>
		/// DependencyProperty for <see cref="TextDecorations" /> property. 
		/// </summary>
//		public static readonly DependencyProperty 
		TextDecorationsProperty:
        {
        	get:function(){
        		if(TextBlock._TextDecorationsProperty === undefined){
        			TextBlock._TextDecorationsProperty=
        			      Inline.TextDecorationsProperty.AddOwner( 
        			              TextBlock.Type,
        			              /*new FrameworkPropertyMetadata( 
        			                      new FreezableDefaultValueFactory(TextDecorationCollection.Empty), 
        			                      FrameworkPropertyMetadataOptions.AffectsRender
        			                      )*/
        			              FrameworkPropertyMetadata.Build2( 
        			                      new FreezableDefaultValueFactory(TextDecorationCollection.Empty), 
        			                      FrameworkPropertyMetadataOptions.AffectsRender)); 
        		}
        		
        		return TextBlock._TextDecorationsProperty;
        	}
        }, 

		/// <summary>
		/// DependencyProperty for <see cref="TextEffects" /> property.
		/// </summary> 
//		public static readonly DependencyProperty 
		TextEffectsProperty:
        {
        	get:function(){
        		if(TextBlock._TextEffectsProperty === undefined){
        			TextBlock._TextEffectsProperty=
        			      TextElement.TextEffectsProperty.AddOwner( 
        			              TextBlock.Type, 
        			              /*new FrameworkPropertyMetadata(
        			                      new FreezableDefaultValueFactory(TextEffectCollection.Empty), 
        			                      FrameworkPropertyMetadataOptions.AffectsRender)*/
        			              FrameworkPropertyMetadata.Build2(
        			                      new FreezableDefaultValueFactory(TextEffectCollection.Empty), 
        			                      FrameworkPropertyMetadataOptions.AffectsRender));
        		}
        		
        		return TextBlock._TextEffectsProperty;
        	}
        }, 

		/// <summary>
		/// DependencyProperty for <see cref="LineHeight" /> property. 
		/// </summary>
//		public static readonly DependencyProperty 
		LineHeightProperty:
        {
        	get:function(){
        		if(TextBlock._LineHeightProperty === undefined){
        			TextBlock._LineHeightProperty= 
        			      Block.LineHeightProperty.AddOwner(TextBlock.Type); 
        		}
        		
        		return TextBlock._LineHeightProperty;
        	}
        }, 

		/// <summary> 
		/// DependencyProperty for <see cref="LineStackingStrategy" /> property.
		/// </summary> 
//		public static readonly DependencyProperty 
		LineStackingStrategyProperty:
        {
        	get:function(){
        		if(TextBlock._LineStackingStrategyProperty === undefined){
        			TextBlock._LineStackingStrategyProperty= 
        			      Block.LineStackingStrategyProperty.AddOwner(TextBlock.Type);
        		}
        		
        		return TextBlock._LineStackingStrategyProperty;
        	}
        }, 

		/// <summary>
		/// DependencyProperty for <see cref="Padding" /> property. 
		/// </summary>
//		public static readonly DependencyProperty 
		PaddingProperty:
        {
        	get:function(){
        		if(TextBlock._PaddingProperty === undefined){
        			TextBlock._PaddingProperty = 
        			      Block.PaddingProperty.AddOwner( 
        			              TextBlock.Type,
        			              /*new FrameworkPropertyMetadata( 
        			                      new Thickness(),
        			                      FrameworkPropertyMetadataOptions.AffectsMeasure)*/
        			              FrameworkPropertyMetadata.Build2( 
        			                      new Thickness(),
        			                      FrameworkPropertyMetadataOptions.AffectsMeasure));
        		}
        		
        		return TextBlock._PaddingProperty;
        	}
        }, 

		/// <summary> 
		/// DependencyProperty for <see cref="TextAlignment" /> property.
		/// </summary> 
//		public static readonly DependencyProperty 
		TextAlignmentProperty:
        {
        	get:function(){
        		if(TextBlock._TextAlignmentProperty === undefined){
        			TextBlock._TextAlignmentProperty= 
        			      Block.TextAlignmentProperty.AddOwner(TextBlock.Type);
        		}
        		
        		return TextBlock._TextAlignmentProperty;
        	}
        }, 

		/// <summary>
		/// DependencyProperty for <see cref="TextTrimming" /> property. 
		/// </summary>
//		public static readonly DependencyProperty 
		TextTrimmingProperty:
        {
        	get:function(){
        		if(TextBlock._TextTrimmingProperty === undefined){
        			TextBlock._TextTrimmingProperty= 
        			      DependencyProperty.Register(
        			              "TextTrimming", 
        			              Number.Type,
        			              TextBlock.Type,
        			              /*new FrameworkPropertyMetadata(
        			                      TextTrimming.None, 
        			                      FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender)*/
        			              FrameworkPropertyMetadata.Build2(
        			                      TextTrimming.None, 
        			                      FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender),
        			              new ValidateValueCallback(null, IsValidTextTrimming)); 
        		}
        		
        		return TextBlock._TextTrimmingProperty;
        	}
        }, 

		/// <summary> 
		/// DependencyProperty for <see cref="TextWrapping" /> property.
		/// </summary>
//		public static readonly DependencyProperty 
		TextWrappingProperty:
        {
        	get:function(){
        		if(TextBlock._TextWrappingProperty === undefined){
        			TextBlock._TextWrappingProperty= 
        			      DependencyProperty.Register(
        			              "TextWrapping", 
        			              Number.Type, 
        			              TextBlock.Type,
        			              /*new FrameworkPropertyMetadata( 
        			                      TextWrapping.NoWrap,
        			                      FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender)*/
        			              FrameworkPropertyMetadata.Build2( 
        			                      TextWrapping.NoWrap,
        			                      FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender),
        			              new ValidateValueCallback(null, IsValidTextWrap));
        		}
        		
        		return TextBlock._TextWrappingProperty;
        	}
        }, 

		
	});
	
    /// <summary> 
    /// TextBlock static constructor. Registers metadata for its properties.
    /// </summary>
//    static TextBlock()
    function Initialize(){ 
        // Required here, just for this type - Don't want anyone else to pick up this GetValueOverride
        BaselineOffsetProperty.OverrideMetadata( 
                TextBlock.Type, 
                new FrameworkPropertyMetadata(
                        null, 
                        new CoerceValueCallback(null, CoerceBaselineOffset)));

        // Registering typography properties metadata
        var onTypographyChanged = new PropertyChangedCallback(null, OnTypographyChanged); 
        /*DependencyProperty[]*/var typographyProperties = Typography.TypographyPropertiesList;
        for (var i = 0; i < typographyProperties.Length; i++) 
        { 
            typographyProperties[i].OverrideMetadata(TextBlock.Type, new FrameworkPropertyMetadata(onTypographyChanged));
        } 

        EventManager.RegisterClassHandler(TextBlock.Type, RequestBringIntoViewEvent, new RequestBringIntoViewEventHandler(OnRequestBringIntoView));
        DefaultStyleKeyProperty.OverrideMetadata(TextBlock.Type, new FrameworkPropertyMetadata(TextBlock.Type));
    }
    
 

  	/// <summary>
  	/// Coersion callback for the Text property.
  	/// </summary> 
  	/// <remarks>
  	/// We cannot assume value is a string here -- it may be a DeferredTextReference. 
  	/// </remarks> 
//  	private static object 
  	function CoerceText(/*DependencyObject*/ d, /*object*/ value)
  	{ 

  		if (value == null)
  		{ 
  			value = String.Empty;
  		} 

  		if (d._complexContent != null &&
  				!d.CheckFlags(Flags.TextContentChanging) && 
  				value == d.GetValue(TextProperty))
  		{
	        // If the new value equals the old value, then the property
	        // system will optimize out the call to OnTextChanged.  We can't 
	        // skip this call because there's ambiguity between the TextProperty
	        // view of content and actual content -- we might have a new 
	        // value even if strings match. 
	        //
	        // E.g.: content = <Image/>, TextProperty == " " 
	        // Now setting TextProperty = " " really changes content, replacing
	        // the Image with a space char.
  			OnTextChanged(d, value);
  		} 

  		return value; 
//  		return DependencyProperty.UnsetValue;
  	}
  	
  	/// <summary>
  	/// DependencyProperty setter for <see cref="FontFamily" /> property. 
  	/// </summary>
  	/// <param name="element">The element to which to write the attached property.</param>
  	/// <param name="value">The property value to set</param>
//  	public static void 
  	TextBlock.SetFontFamily = function(/*DependencyObject*/ element, /*FontFamily*/ value) 
  	{
  		if (element == null) 
  		{ 
  			throw new ArgumentNullException("element");
  		} 

  		element.SetValue(FontFamilyProperty, value);
  	};

  	/// <summary>
  	/// DependencyProperty getter for <see cref="FontFamily" /> property. 
  	/// </summary> 
  	/// <param name="element">The element from which to read the attached property.</param>
//  	public static FontFamily 
  	TextBlock.GetFontFamily = function(/*DependencyObject*/ element) 
  	{
  		if (element == null)
  		{
  			throw new ArgumentNullException("element"); 
  		}

  		return element.GetValue(FontFamilyProperty); 
  	};
  	
  	/// <summary>
  	/// DependencyProperty setter for <see cref="FontStyle" /> property. 
  	/// </summary>
  	/// <param name="element">The element to which to write the attached property.</param>
  	/// <param name="value">The property value to set</param>
//  	public static void 
  	TextBlock.SetFontStyle = function(/*DependencyObject*/ element, /*FontStyle*/ value) 
  	{
  		if (element == null) 
  		{ 
  			throw new ArgumentNullException("element");
  		} 

  		element.SetValue(FontStyleProperty, value);
  	};
  	
  	/// <summary>
  	/// DependencyProperty getter for <see cref="FontStyle" /> property. 
  	/// </summary> 
  	/// <param name="element">The element from which to read the attached property.</param>
//  	public static FontStyle 
  	GetFontStyle = function(/*DependencyObject*/ element) 
  	{
  		if (element == null)
	    {
	        throw new ArgumentNullException("element"); 
	    }

  		return element.GetValue(FontStyleProperty); 
  	};
  	/// <summary>
  	/// DependencyProperty setter for <see cref="FontWeight" /> property. 
  	/// </summary>
  	/// <param name="element">The element to which to write the attached property.</param>
  	/// <param name="value">The property value to set</param>
//  	public static void 
  	SetFontWeight = function(/*DependencyObject*/ element, /*FontWeight*/ value) 
  	{
  		if (element == null) 
  		{ 
  			throw new ArgumentNullException("element");
  		} 

  		element.SetValue(FontWeightProperty, value);
  	};
  	

  	/// <summary>
  	/// DependencyProperty getter for <see cref="FontWeight" /> property. 
  	/// </summary> 
  	/// <param name="element">The element from which to read the attached property.</param>
//  	public static FontWeight 
  	GetFontWeight = function(/*DependencyObject*/ element) 
  	{
  		if (element == null)
  		{
  			throw new ArgumentNullException("element"); 
  		}

  		return element.GetValue(FontWeightProperty); 
  	};
  	
	/// <summary>
  	/// DependencyProperty setter for <see cref="FontStretch" /> property. 
  	/// </summary>
  	/// <param name="element">The element to which to write the attached property.</param>
  	/// <param name="value">The property value to set</param>
//  	public static void 
  	TextBlock.SetFontStretch = function(/*DependencyObject*/ element, /*FontStretch*/ value) 
  	{
  		if (element == null) 
  		{ 
  			throw new ArgumentNullException("element");
  		} 

  		element.SetValue(FontStretchProperty, value);
  	};

  	/// <summary>
  	/// DependencyProperty getter for <see cref="FontStretch" /> property. 
  	/// </summary> 
  	/// <param name="element">The element from which to read the attached property.</param>
//  	public static FontStretch 
  	TextBlock.GetFontStretch = function(/*DependencyObject*/ element) 
  	{
  		if (element == null)
  		{
  			throw new ArgumentNullException("element"); 
  		}

  		return element.GetValue(FontStretchProperty); 
  	};
  	/// <summary>
  	/// DependencyProperty setter for <see cref="FontSize" /> property.
  	/// </summary> 
  	/// <param name="element">The element to which to write the attached property.</param>
 	 /// <param name="value">The property value to set</param> 
//  	public static void 
  	TextBlock.SetFontSize = function(/*DependencyObject*/ element, /*double*/ value) 
  	{
  		if (element == null) 
  		{
  			throw new ArgumentNullException("element");
  		}

  		element.SetValue(FontSizeProperty, value);
  	};
	
  	/// <summary>
  	/// DependencyProperty getter for <see cref="FontSize" /> property. 
  	/// </summary>
  	/// <param name="element">The element from which to read the attached property.</param>
//  	public static double 
  	TextBlock.GetFontSize = function(/*DependencyObject*/ element) 
  	{
  		if (element == null) 
  		{ 
  			throw new ArgumentNullException("element");
  		} 

  		return element.GetValue(FontSizeProperty);
  	};
	  
	  /// <summary> 
	/// DependencyProperty setter for <see cref="Foreground" /> property.
	/// </summary> 
	/// <param name="element">The element to which to write the attached property.</param> 
	/// <param name="value">The property value to set</param>
//	public static void 
  	TextBlock.SetForeground = function(/*DependencyObject*/ element, /*Brush*/ value) 
	{
		if (element == null)
		{
		  throw new ArgumentNullException("element"); 
		}
		
		element.SetValue(ForegroundProperty, value); 
	};
	
	/// <summary>
	/// DependencyProperty getter for <see cref="Foreground" /> property.
	/// </summary>
	/// <param name="element">The element from which to read the attached property.</param> 
//	public static Brush 
	TextBlock.GetForeground = function(/*DependencyObject*/ element)
	{ 
		if (element == null) 
		{
		  throw new ArgumentNullException("element"); 
		}
		
		return element.GetValue(ForegroundProperty);
	};
	
	/// <summary>
	/// DependencyProperty setter for <see cref="LineHeight" /> property.
	/// </summary>
	/// <param name="element">The element to which to write the attached property.</param> 
	/// <param name="value">The property value to set</param>
//	public static void 
	TextBlock.SetLineHeight = function(/*DependencyObject*/ element, /*double*/ value) 
	{ 
		if (element == null)
		{ 
		    throw new ArgumentNullException("element");
		}
		
		element.SetValue(LineHeightProperty, value); 
	};
	
	/// <summary> 
	/// DependencyProperty getter for <see cref="LineHeight" /> property.
	/// </summary> 
	/// <param name="element">The element from which to read the attached property.</param>
//	public static double 
	TextBlock.GetLineHeight = function(/*DependencyObject*/ element)
	{ 
		if (element == null)
		{ 
		    throw new ArgumentNullException("element"); 
		}
		
		return element.GetValue(LineHeightProperty);
	};
	
	/// <summary>
	/// DependencyProperty setter for <see cref="LineStackingStrategy" /> property.
	/// </summary>
	/// <param name="element">The element to which to write the attached property.</param> 
	/// <param name="value">The property value to set</param>
//	public static void 
	TextBlock.SetLineStackingStrategy = function(/*DependencyObject*/ element, /*LineStackingStrategy*/ value) 
	{ 
		if (element == null)
		{ 
			throw new ArgumentNullException("element");
		}
	
		element.SetValue(LineStackingStrategyProperty, value); 
	};
	
	/// <summary> 
	/// DependencyProperty getter for <see cref="LineStackingStrategy" /> property.
	/// </summary> 
	/// <param name="element">The element from which to read the attached property.</param>
//	public static LineStackingStrategy 
	GetLineStackingStrategy = function(/*DependencyObject*/ element)
	{
		if (element == null) 
		{
			throw new ArgumentNullException("element"); 
		} 
	
		return element.GetValue(LineStackingStrategyProperty); 
	};
	
	/// <summary>
	/// DependencyProperty setter for <see cref="TextAlignment" /> property.
	/// </summary>
	/// <param name="element">The element to which to write the attached property.</param> 
	/// <param name="value">The property value to set</param>
//	public static void 
	SetTextAlignment = function(/*DependencyObject*/ element, /*TextAlignment*/ value) 
	{ 
		if (element == null)
		{ 
			throw new ArgumentNullException("element");
		}

		element.SetValue(TextAlignmentProperty, value); 
	};

	/// <summary> 
	/// DependencyProperty getter for <see cref="TextAlignment" /> property.
	/// </summary> 
	/// <param name="element">The element from which to read the attached property.</param>
//	public static TextAlignment 
	GetTextAlignment = function(/*DependencyObject*/ element)
	{
		if (element == null) 
		{
			throw new ArgumentNullException("element"); 
		} 

		return element.GetValue(TextAlignmentProperty); 
	};
	
	//typography properties changed, no cache for this, just reset the flag
//	private static void 
	function OnTypographyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
	{
		d.SetFlags(true, Flags.IsTypographySet);
	}
	

	/// <summary> 
	/// Property invalidator for baseline offset
	/// </summary>
	/// <param name="d">Dependency Object that the property value is being changed on.</param>
	/// <param name="e">EventArgs that contains the old and new values for this property</param> 
//	private static void 
	function OnBaselineOffsetChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
	{ 
	  //Set up our baseline changed event 

	  //fire event! 
	  var te = TextElement.ContainerTextElementField.GetValue(d);

	  if (te != null)
	  { 
	      var parent = te.TextContainer.Parent;
	      var tb = parent instanceof TextBlock ? parent : null; 
	      if (tb != null) 
	      {
	          tb.OnChildBaselineOffsetChanged(d); 
	      }
	      else
	      {
	          var fd = parent instanceof FlowDocument ? parent : null; 
	          if (fd != null && d instanceof UIElement)
	          { 
	              fd.OnChildDesiredSizeChanged(d); 
	          }
	      } 
	  }
	}
  	
//	private static bool 
	function IsValidTextTrimming(/*object*/ o)
	{
	  return o == TextTrimming.CharacterEllipsis
	      || o == TextTrimming.None 
	      || o == TextTrimming.WordEllipsis; 
	}

//	private static bool 
	function IsValidTextWrap(/*object*/ o)
	{
	  return o == TextWrapping.Wrap 
	      || o == TextWrapping.NoWrap
	      || o == TextWrapping.WrapWithOverflow; 
	}
	
//	private static object 
	function CoerceBaselineOffset(/*DependencyObject*/ d, /*object*/ value) 
	{
	  if(DoubleUtil.IsNaN(value))
	  {
	      return d._baselineOffset; 
	  }

	  return value; 
	}

	//-------------------------------------------------------------------
	//Text helpers 
	//-------------------------------------------------------------------

//	private static void 
	function OnTextChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
	{
	}
	
	TextBlock.Type = new Type("TextBlock", TextBlock, [FrameworkElement.Type, IContentHost.Type, IAddChild.Type, IServiceProvider.Type]);
	return TextBlock;
});
