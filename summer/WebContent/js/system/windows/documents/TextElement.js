/**
 * TextElement
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkContentElement", "markup/IAddChild", "media/Brushes",
        "media/FontFamily", "windows/SystemFonts", "windows/FontStyle", "windows/FontWeight", "windows/FontStretch",
        "windows/FontStretches"], 
		function(declare, Type, FrameworkContentElement, IAddChild, Brushes,
				FontFamily, SystemFonts, FontStyle, FontWeight, FontStretch,
				FontStretches){
	
	var TextElement = declare("TextElement", [FrameworkContentElement, IAddChild],{
		constructor:function(){

		},
		
    
        ///<summary>
        /// Called to add the object as a child. 
        ///</summary> 
        ///<param name="value">
        /// A Block to add as a child. 
        ///</param>
        /// <exception cref="System.ArgumentException">
        /// o must derive from either UIElement or TextElement, or an
        /// ArgumentException will be thrown by this method. 
        /// </exception>
//        void IAddChild.
        AddChild:function(/*object*/ value) 
        { 
            var valueType = value.GetType();
 
            var te = value instanceof TextElement ? value : null;

            if (te != null)
            { 
                TextSchema.ValidateChild(/*parent:*/this, /*child:*/te, true /* throwIfIllegalChild */, true /* throwIfIllegalHyperlinkDescendent */);
                this.Append(te); 
            } 
            else
            { 
                var uie = value instanceof UIElement ? value : null;
                if (uie != null)
                {
                    /*InlineUIContainer*/var inlineContainer = this instanceof InlineUIContainer ? this : null; 
                    if (inlineContainer != null)
                    { 
                        if (inlineContainer.Child != null) 
                        {
                            throw new ArgumentException(SR.Get(SRID.TextSchema_ThisInlineUIContainerHasAChildUIElementAlready, this.GetType().Name,
                            		this.Child.GetType().Name, value.GetType().Name)); 
                        }

                        inlineContainer.Child = uie;
                    } 
                    else
                    { 
                        var blockContainer = this instanceof BlockUIContainer ? this : null; 
                        if (blockContainer != null)
                        { 
                            if (blockContainer.Child != null)
                            {
                                throw new ArgumentException(SR.Get(SRID.TextSchema_ThisBlockUIContainerHasAChildUIElementAlready, this.GetType().Name, this.Child.GetType().Name, value.GetType().Name));
                            } 

                            blockContainer.Child = uie; 
                        } 
                        else
                        { 
                            if (TextSchema.IsValidChild(/*parent:*/this, /*childType:*/typeof(InlineUIContainer)))
                            {
                                // Create implicit InlineUIContainer wrapper for this UIElement
                                var implicitInlineUIContainer = Inline.CreateImplicitInlineUIContainer(this); 
                                this.Append(implicitInlineUIContainer);
                                implicitInlineUIContainer.Child = uie; 
                            } 
                            else
                            { 
                                throw new ArgumentException(SR.Get(SRID.TextSchema_ChildTypeIsInvalid, this.GetType().Name, value.GetType().Name));
                            }
                        }
                    } 
                }
                else 
                { 
                    throw new ArgumentException(SR.Get(SRID.TextSchema_ChildTypeIsInvalid, this.GetType().Name, value.GetType().Name));
                } 
            }
        },

        ///<summary> 
        /// Called when text appears under the tag in markup
        ///</summary> 
        ///<param name="text"> 
        /// Text to Add to this TextElement
        ///</param> 
        /// <ExternalAPI/>
//        void IAddChild.
        AddText:function(/*string*/ text)
        {
            if (text == null) 
            {
                throw new ArgumentNullException("text"); 
            } 

            // Check if text run is allowed in this element, 
            // and create implicit Run if possible.
            if (TextSchema.IsValidChild(/*parent:*/this, /*childType:*/String.Type))
            {
            	this.Append(text); 
            }
            else 
            { 
                // Implicit Run creation
                if (TextSchema.IsValidChild(/*parent:*/this, /*childType:*/Run.Type)) 
                {

                    // NOTE: Do not use new Run(text) constructor to avoid TextContainer creation
                    // which would hit parser perf 
                    var implicitRun = Inline.CreateImplicitRun(this);
 
                    this.Append(implicitRun); 

                    implicitRun.Text = text; 
                }
                else
                {
                    // Otherwise text is not allowed. Throw if it is not a whitespace 
                    if (text.trim().length > 0)
                    { 
                        throw new InvalidOperationException(SR.Get(SRID.TextSchema_TextIsNotAllowed, this.GetType().Name)); 
                    }
 
                    // As to whitespace - it can be simply ignored
                }
            }
        },
 
        /// <summary>
        /// Notification that a specified property has been invalidated 
        /// </summary>
        /// <param name="e">EventArgs that contains the property, metadata, old value, and new value for this change</param>
//        protected override void 
        OnPropertyChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
            // Always call base.OnPropertyChanged, otherwise Property Engine will not work.
        	FrameworkContentElement.prototype.OnPropertyChanged.call(this, e); 
 
            // Note whether or not this change due to a SetValue/ClearValue call.
            var localValueChanged = e.NewValueSource == BaseValueSourceInternal.Local || e.OldValueSource == BaseValueSourceInternal.Local; 

            if (localValueChanged || e.IsAValueChange || e.IsASubPropertyChange)
            {
//                if (this.IsInTree) // No work to do if no one's listening. 
//                {
//                    // If the modified property affects layout we have some additional 
//                    // bookkeeping to take care of. 
//                    var fmetadata = e.Metadata instanceof FrameworkPropertyMetadata ? e.Metadata : null;
//                    if (fmetadata != null) 
//                    {
//                        var affectsMeasureOrArrange = fmetadata.AffectsMeasure || fmetadata.AffectsArrange || fmetadata.AffectsParentMeasure || fmetadata.AffectsParentArrange;
//                        var affectsRender = (fmetadata.AffectsRender &&
//                            (e.IsAValueChange || !fmetadata.SubPropertiesDoNotAffectRender)); 
//                        if (affectsMeasureOrArrange || affectsRender)
//                        { 
//                            /*TextContainer*/var textContainer = this.EnsureTextContainer(); 
//
//                            textContainer.BeginChange(); 
//                            try
//                            {
//                                if (localValueChanged)
//                                { 
//                                    TextTreeUndo.CreatePropertyUndoUnit(this, e);
//                                } 
// 
//                                if (e.IsAValueChange || e.IsASubPropertyChange)
//                                { 
//                                    NotifyTypographicPropertyChanged(affectsMeasureOrArrange, localValueChanged, e.Property);
//                                }
//                            }
//                            finally 
//                            {
//                                textContainer.EndChange(); 
//                            } 
//                        }
//                    } 
//                }
            }
        },
 
        // Notify our TextContainer that a typographic property has changed
        // value on this TextElement. 
        // This has the side effect of invalidating layout. 
//        internal void 
        NotifyTypographicPropertyChanged:function(/*bool*/ affectsMeasureOrArrange, /*bool*/ localValueChanged, /*DependencyProperty*/ property)
        { 
//            if (!this.IsInTree) // No work to do if no one's listening.
//            {
//                return;
//            } 
//
//            /*TextContainer*/var tree; 
//            /*TextPointer*/var beforeStart; 
//
//            tree = EnsureTextContainer(); 
//
//            // Take note that something layout related has changed.
//            tree.NextLayoutGeneration();
// 
//            // Notify any external listeners.
//            if (tree.HasListeners) 
//            { 
//                // Get the position before the start of this element.
//                beforeStart = new TextPointer(tree, this._textElementNode, ElementEdge.BeforeStart, LogicalDirection.Forward); 
//                beforeStart.Freeze();
//
//                // Raise ContentAffected event that spans entire TextElement (from BeforeStart to AfterEnd).
//                tree.BeginChange(); 
//                try
//                { 
//                    tree.BeforeAddChange(); 
//                    if (localValueChanged)
//                    { 
//                        tree.AddLocalValueChange();
//                    }
//                    tree.AddChange(beforeStart, this._textElementNode.SymbolCount, this._textElementNode.IMECharCount,
//                        PrecursorTextChangeType.PropertyModified, property, !affectsMeasureOrArrange); 
//                }
//                finally 
//                { 
//                    tree.EndChange();
//                } 
//            }
        },

        // ........................................................................
        //
        // Helpers for Text Flow Initialization 
        //
        // ........................................................................ 
 
        // Recursively calls EndInit for this element and for all its descendants
//        internal void 
        DeepEndInit:function() 
        {
            if (!this.IsInitialized)
            {
                if (!this.IsEmpty) 
                {
                    var children = this.LogicalChildren; 
 
                    while (children.MoveNext())
                    { 
                        // child.Current could be FrameworkElement, FrameworkContentElement,
                        //  or anything else.  Only recursively call self for FE & FCE.
                        var child = children.Current instanceof TextElement ? children.Current : null;
                        if (child != null) 
                        {
                            child.DeepEndInit(); 
                        } 
                    }
                } 

                // Mark the end of the initialization phase
                this.EndInit();
//                Invariant.Assert(this.IsInitialized); 
            }
        }, 
 
        /// <summary> 
        /// Derived classes override this method to get notified when a TextContainer
        /// change affects the text parented by this element.
        /// </summary>
        /// <remarks> 
        /// If this TextElement is a Run, this function will be called whenever the text content
        /// under this Run changes. If this TextElement is not a Run, this function will be called 
        /// most of the time its content changes, but not necessarily always. 
        /// </remarks>
//        internal virtual void 
        OnTextUpdated:function() 
        {
        },

        /// <summary> 
        /// Derived classes override this method to get notified before TextContainer
        /// causes a logical tree change that affects this element. 
        /// </summary> 
//        internal virtual void 
        BeforeLogicalTreeChange:function()
        { 
        },

        /// <summary>
        /// Derived classes override this method to get notified after TextContainer 
        /// causes a logical tree change that affects this element.
        /// </summary> 
//        internal virtual void 
        AfterLogicalTreeChange:function() 
        {
        }, 

        /// <summary>
        /// Inserts a string at the end of the content spanned by this TextElement.
        /// </summary> 
        /// <param name="textData">
        /// string to insert. 
        /// </param> 
//        private void 
        Append:function(/*string*/ textData)
        { 
            /*TextContainer*/var tree;

            if (textData == null)
            { 
                throw new ArgumentNullException("textData");
            } 
 
            tree = this.EnsureTextContainer();
 
            tree.BeginChange();
            try
            {
                // 

                tree.InsertTextInternal(new TextPointer(tree, this._textElementNode, ElementEdge.BeforeEnd), textData); 
            } 
            finally
            { 
                tree.EndChange();
            }
        },
 
        /// <summary>
        /// Inserts a TextElement at the end of the content spanned by this 
        /// TextElement. 
        /// </summary>
        /// <param name="element"> 
        /// TextElement to insert.
        /// </param>
        /// <Remarks>
        /// This method will remove element from TextContainer it was previously 
        /// positioned within.  Any content spanned by element will also
        /// be moved. 
        /// </Remarks> 
//        private void 
        Append:function(/*TextElement*/ element)
        { 
            /*TextContainer*/var tree;
            /*TextPointer*/var position;

            if (element == null) 
            {
                throw new ArgumentNullException("element"); 
            } 

            tree = EnsureTextContainer(); 

            tree.BeginChange();
            try
            { 
                //
 
                position = new TextPointer(tree, _textElementNode, ElementEdge.BeforeEnd); 
                tree.InsertElementInternal(position, position, element);
            } 
            finally
            {
                tree.EndChange();
            } 
        },
 
        // Demand creates a TextContainer if no tree is associated with this instance. 
        // Otherwise returns the exisiting tree, and clears the tree's DeadPositionList.
//        private TextContainer 
        EnsureTextContainer:function() 
        {
            /*TextContainer*/var tree;
            /*TextPointer*/var start;
 
            if (this.IsInTree)
            { 
                tree = this._textElementNode.GetTextTree(); 
                tree.EmptyDeadPositionList();
            } 
            else
            {
                tree = new TextContainer(null, false /* plainTextOnly */);
                start = tree.Start; 

                tree.BeginChange(); 
                try 
                {
                    tree.InsertElementInternal(start, start, this); 
                }
                finally
                {
                    // No event will be raised, since we know there are no listeners yet! 
                    tree.EndChange();
                } 
 
//                Invariant.Assert(this.IsInTree);
            } 

            return tree;
        }
	});
	
	Object.defineProperties(TextElement.prototype,{
//        /// <summary>
//        /// A TextRange spanning the content of this element. 
//        /// </summary>
////        internal TextRange 
//		TextRange:
//        {
//            get:function() 
//            {
//            	/*TextContainer*/var tree = this.EnsureTextContainer();
// 
//                var contentStart = new TextPointer(tree, this._textElementNode, ElementEdge.AfterStart, LogicalDirection.Backward);
//                contentStart.Freeze();
//
//                var contentEnd = new TextPointer(tree, this._textElementNode, ElementEdge.BeforeEnd, LogicalDirection.Forward); 
//                contentEnd.Freeze();
// 
//                return new TextRange(contentStart, contentEnd); 
//            }
//        }, 
//
//        /// <summary>
//        /// A TextPointer located just before the start edge of this TextElement.
//        /// </summary> 
//        /// <Remarks>
//        /// The TextPointer returned always has its IsFrozen property set true 
//        /// and LogicalDirection set Forward. 
//        /// </Remarks>
////        public TextPointer 
//        ElementStart: 
//        {
//            get:function()
//            {
//                /*TextContainer*/var tree; 
//                /*TextPointer*/var elementStart;
// 
//                tree = this.EnsureTextContainer(); 
//
//                elementStart = new TextPointer(tree, this._textElementNode, ElementEdge.BeforeStart, LogicalDirection.Forward); 
//                elementStart.Freeze();
//
//                return elementStart;
//            } 
//        },
// 
////        internal StaticTextPointer 
//        StaticElementStart: 
//        {
//            get:function() 
//            {
//            	/*TextContainer*/var tree = this.EnsureTextContainer();
//
//                return new StaticTextPointer(tree, this._textElementNode, 0); 
//            }
//        }, 
// 
//        /// <summary>
//        /// A TextPointer located just past the start edge of this TextElement. 
//        /// </summary>
//        /// <Remarks>
//        /// The TextPointer returned always has its IsFrozen property set true
//        /// and LogicalDirection set Backward. 
//        /// </Remarks>
////        public TextPointer 
//        ContentStart: 
//        { 
//            get:function()
//            { 
//            	/*TextContainer*/var tree;
//            	/*TextPointer*/var contentStart;
//
//                tree = this.EnsureTextContainer(); 
//
//                contentStart = new TextPointer(tree, this._textElementNode, ElementEdge.AfterStart, LogicalDirection.Backward); 
//                contentStart.Freeze(); 
//
//                return contentStart; 
//            }
//        },
//
////        internal StaticTextPointer 
//        StaticContentStart: 
//        {
//            get:function() 
//            { 
//            	/*TextPointer*/var tree = this.EnsureTextContainer();
// 
//                return new StaticTextPointer(tree, this._textElementNode, 1);
//            }
//        },
// 
//        /// <summary>
//        /// A TextPointer located just before the end edge of this TextElement. 
//        /// </summary> 
//        /// <Remarks>
//        /// The TextPointer returned always has its IsFrozen property set true 
//        /// and LogicalDirection set Forward.
//        /// </Remarks>
////        public TextPointer 
//        ContentEnd:
//        { 
//            get:function()
//            { 
//            	/*TextContainer*/var tree; 
//            	/*TextPointer*/var contentEnd;
// 
//                tree = this.EnsureTextContainer();
//
//                contentEnd = new TextPointer(tree, _textElementNode, ElementEdge.BeforeEnd, LogicalDirection.Forward);
//                contentEnd.Freeze(); 
//
//                return contentEnd; 
//            } 
//        },
// 
////        internal StaticTextPointer 
//        StaticContentEnd:
//        {
//            get:function()
//            { 
//            	/*TextContainer*/var tree = this.EnsureTextContainer();
// 
//                return new StaticTextPointer(tree, this._textElementNode, this._textElementNode.SymbolCount - 1); 
//            }
//        }, 
// 
//        /// <summary>
//        /// A TextPointer located just after the end edge of this TextElement.
//        /// </summary>
//        /// <Remarks> 
//        /// The TextPointer returned always has its IsFrozen property set true
//        /// and LogicalDirection set Backward. 
//        /// </Remarks> 
////        public TextPointer 
//        ElementEnd:
//        { 
//            get:function()
//            {
//            	/*TextContainer*/var tree;
//            	/*TextPointer*/var elementEnd; 
//
//                tree = EnsureTextContainer(); 
// 
//                elementEnd = new TextPointer(tree, this._textElementNode, ElementEdge.AfterEnd, LogicalDirection.Backward);
//                elementEnd.Freeze(); 
//
//                return elementEnd;
//            }
//        }, 
//
////        internal StaticTextPointer: 
//        StaticElementEnd: 
//        { 
//            get:function()
//            { 
//            	/*TextContainer*/var tree = EnsureTextContainer();
//
//                return new StaticTextPointer(tree, this._textElementNode, this._textElementNode.SymbolCount);
//            } 
//        },
 

        /// <summary>
        /// The FontFamily property specifies the name of font family. 
        /// </summary> 
//        public FontFamily 
        FontFamily:
        { 
            get:function() { return this.GetValue(TextElement.FontFamilyProperty); },
            set:function(value) { this.SetValue(TextElement.FontFamilyProperty, value); } 
        }, 

        /// <summary> 
        /// The FontStyle property requests normal, italic, and oblique faces within a font family. 
        /// </summary>
//        public FontStyle 
        FontStyle: 
        {
            get:function() { return this.GetValue(TextElement.FontStyleProperty); },
            set:function(value) { this.SetValue(TextElement.FontStyleProperty, value); }
        }, 

        /// <summary>
        /// The FontWeight property specifies the weight of the font. 
        /// </summary>
//        public FontWeight 
        FontWeight: 
        { 
            get:function() { return this.GetValue(TextElement.FontWeightProperty); },
            set:function(value) { this.SetValue(TextElement.FontWeightProperty, value); } 
        },

        /// <summary> 
        /// The FontStretch property selects a normal, condensed, or extended face from a font family.
        /// </summary>
//        public FontStretch 
        FontStretch:
        { 
            get:function() { return this.GetValue(TextElement.FontStretchProperty); },
            set:function(value) { this.SetValue(TextElement.FontStretchProperty, value); } 
        }, 

   
        /// <summary> 
        /// The FontSize property specifies the size of the font.
        /// </summary> 
//        public double 
        FontSize:
        { 
            get:function() { return this.GetValue(TextElement.FontSizeProperty); },
            set:function(value) { this.SetValue(TextElement.FontSizeProperty, value); } 
        }, 

        /// <summary> 
        /// The Foreground property specifies the foreground brush of an element's text content.
        /// </summary>
//        public Brush 
        Foreground:
        { 
            get:function() { return this.GetValue(TextElement.ForegroundProperty); },
            set:function(value) { this.SetValue(TextElement.ForegroundProperty, value); } 
        }, 
        /// <summary> 
        /// The Background property defines the brush used to fill the content area.
        /// </summary> 
//        public Brush 
        Background: 
        {
            get:function() { return this.GetValue(TextElement.BackgroundProperty); }, 
            set:function(value) { this.SetValue(TextElement.BackgroundProperty, value); }
        },  
        
        /// <summary>
        /// The TextEffects property specifies effects that are added to the text of an element. 
        /// </summary>
//        public TextEffectCollection 
        TextEffects:
        {
            get:function() { return this.GetValue(TextElement.TextEffectsProperty); }, 
            set:function(value) { this.SetValue(TextElement.TextEffectsProperty, value); }
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
        /// Returns enumerator to logical children.
        /// </summary>
//        protected internal override IEnumerator 
        LogicalChildren: 
        {
            get:function() 
            { 
                return this.IsEmpty
                    ? new RangeContentEnumerator(null, null) 
                    : new RangeContentEnumerator(this.ContentStart, this.ContentEnd);
            }
        },

        //-----------------------------------------------------
        // The TextContainer containing this TextElement. 
        //------------------------------------------------------
//        internal TextContainer 
        TextContainer: 
        { 
            get:function()
            { 
                return EnsureTextContainer();
            }
        },
 
        //------------------------------------------------------
        // Emptiness of an element 
        //----------------------------------------------------- 
//        internal bool 
        IsEmpty:
        { 
            get:function()
            {
                if (this._textElementNode == null)
                    return true; 

                return (this._textElementNode.ContainedNode == null); 
            } 
        },
 
//        //------------------------------------------------------
//        // True if this TextElement is contained within a TextContainer.
//        //-----------------------------------------------------
////        internal bool 
//        IsInTree: 
//        {
//            get:function() 
//            { 
//                return this._textElementNode != null;
//            } 
//        },
//
//        //-----------------------------------------------------
//        // Symbol offset of this.ElementStart. 
//        //-----------------------------------------------------
////        internal int 
//        ElementStartOffset: 
//        { 
//            get:function()
//            { 
////                Invariant.Assert(this.IsInTree, "TextElement is not in any TextContainer, caller should ensure this.");
//                return this._textElementNode.GetSymbolOffset(EnsureTextContainer().Generation) - 1;
//            }
//        }, 
//
//        //------------------------------------------------------ 
//        // Symbol offset of this.ContentStart. 
//        //-----------------------------------------------------
////        internal int 
//        ContentStartOffset: 
//        {
//            get:function()
//            {
////                Invariant.Assert(this.IsInTree, "TextElement is not in any TextContainer, caller should ensure this."); 
//                return this._textElementNode.GetSymbolOffset(EnsureTextContainer().Generation);
//            } 
//        }, 
//
//        //------------------------------------------------------ 
//        // Symbol offset of this.ContentEnd.
//        //------------------------------------------------------
////        internal int 
//        ContentEndOffset:
//        { 
//            get:function()
//            { 
////                Invariant.Assert(this.IsInTree, "TextElement is not in any TextContainer, caller should ensure this."); 
//                return this._textElementNode.GetSymbolOffset(EnsureTextContainer().Generation) + _textElementNode.SymbolCount - 2;
//            } 
//        },
//
//        //-----------------------------------------------------
//        // Symbol offset of this.ElementEnd. 
//        //------------------------------------------------------
////        internal int 
//        ElementEndOffset: 
//        { 
//            get:function()
//            { 
////                Invariant.Assert(this.IsInTree, "TextElement is not in any TextContainer, caller should ensure this.");
//                return this._textElementNode.GetSymbolOffset(EnsureTextContainer().Generation) + _textElementNode.SymbolCount - 1;
//            }
//        }, 
//
//        //----------------------------------------------------- 
//        // Symbol count of this TextElement, including start/end 
//        // edges.
//        //----------------------------------------------------- 
////        internal int 
//        SymbolCount:
//        {
//            get:function()
//            { 
//                return this.IsInTree ? this._textElementNode.SymbolCount : 2;
//            } 
//        }, 
//
//        //----------------------------------------------------- 
//        // The node in a TextContainer representing this TextElement.
//        //------------------------------------------------------
////        internal TextTreeTextElementNode 
//        TextElementNode:
//        { 
//            get:function()
//            { 
//                return this._textElementNode; 
//            },
// 
//            set:function(value)
//            {
//            	this._textElementNode = value;
//            } 
//        },
 
        //------------------------------------------------------------------- 
        // Typography properties group
        //-------------------------------------------------------------------- 
//        internal TypographyProperties 
        TypographyPropertiesGroup:
        {
            get:function()
            { 
                if (this._typographyPropertiesGroup == null)
                { 
                	this._typographyPropertiesGroup = this.GetTypographyProperties(this); 
                }
                return this._typographyPropertiesGroup; 
            }
        },

        //------------------------------------------------------ 
        // Derived classes override this method if they want
        // their left edges to be visible to IMEs.  This is the
        // case for structural elements like Paragraph but not
        // for formatting elements like Inline. 
        //-----------------------------------------------------
//        internal virtual bool 
        IsIMEStructuralElement: 
        { 
            get:function()
            { 
                return false;
            }
        },
 
        //------------------------------------------------------
        // Plain text character count of this element's edges. 
        // Used by the IME to convert Paragraph, TableCell, etc. 
        // into unicode placeholders.
        //----------------------------------------------------- 
//        internal int 
        IMELeftEdgeCharCount:
        {
            get:function()
            { 
                var leftEdgeCharCount = 0;
 
                if (this.IsIMEStructuralElement) 
                {
                    if (!this.IsInTree) 
                    {
                        // IMELeftEdgeCharCount depends on context, has no meaning outside a tree.
                        leftEdgeCharCount = -1;
                    } 
                    else
                    { 
                        // The first sibling is always invisible to the IME. 
                        // This ensures we don't get into trouble creating implicit
                        // content on IME SetText calls. 
                        leftEdgeCharCount = this.TextElementNode.IsFirstSibling ? 0 : 1;
                    }
                }
 
                return leftEdgeCharCount;
            } 
        }, 

        //----------------------------------------------------- 
        // Returns true if this node is the leftmost sibling of its parent
        // and visible to the IMEs (ie, is a Block).
        //
        // This is interesting because when we do want to expose 
        // element edges to the IMEs (Blocks, TableCell, etc.) we
        // have one exception: the first sibling.  Edges of first 
        // siblings must be hidden because the TextEditor will 
        // implicitly create first siblings when the IMEs, for example,
        // insert raw text into a TableCell that lacks a Paragraph. 
        // The IMEs can't handle the implicit edge creation, so we
        // hide those edges.
        //-----------------------------------------------------
//        internal virtual bool 
        IsFirstIMEVisibleSibling: 
        {
            get:function() 
            { 
                var isFirstIMEVisibleSibling = false;
 
                if (this.IsIMEStructuralElement)
                {
                    isFirstIMEVisibleSibling = (this.TextElementNode == null) ? true : this.TextElementNode.IsFirstSibling;
                } 

                return isFirstIMEVisibleSibling; 
            } 
        },
 
        //------------------------------------------------------
        // Returns a TextElement immediately following this one
        // on the same level of siblings.
        //----------------------------------------------------- 
//        internal TextElement 
        NextElement:
        { 
            get:function() 
            {
                if (!this.IsInTree) 
                {
                    return null;
                }
 
                /*TextTreeTextElementNode*/var node = this._textElementNode.GetNextNode();
                node = node instanceof TextTreeTextElementNode ? node : null;
                return (node != null) ? node.TextElement : null; 
            } 
        },
 
        //------------------------------------------------------
        // Returns a TextElement immediately preceding this one
        // on the same level of siblings.
        //------------------------------------------------------ 
//        internal TextElement 
        PreviousElement:
        { 
            get:function() 
            {
                if (!this.IsInTree) 
                {
                    return null;
                }
 
                /*TextTreeTextElementNode*/var node = this._textElementNode.GetPreviousNode();
                node = node instanceof TextTreeTextElementNode ? node : null;
                return (node != null) ? node.TextElement : null; 
            } 
        },
 
        //-----------------------------------------------------
        // Returns the first TextElement contained by this
        // TextElement.
        //------------------------------------------------------ 
//        internal TextElement 
        FirstChildElement:
        { 
            get:function() 
            {
                if (!this.IsInTree) 
                {
                    return null;
                }
 
                /*TextTreeTextElementNode*/var node = _textElementNode.GetFirstContainedNode();
                node = node instanceof TextTreeTextElementNode ? node : null;
                return (node != null) ? node.TextElement : null; 
            } 
        },
 
        //-----------------------------------------------------
        // Returns the last TextElement contained by this
        // TextElement.
        //----------------------------------------------------- 
//        internal TextElement 
        LastChildElement:
        { 
            get:function() 
            {
                if (!this.IsInTree) 
                {
                    return null;
                }
 
                /*TextTreeTextElementNode*/var node = _textElementNode.GetLastContainedNode();
                node = node instanceof TextTreeTextElementNode ? node : null;
                return (node != null) ? node.TextElement : null; 
            } 
        }


	});
	
	Object.defineProperties(TextElement,{
	      /// <summary> 
        /// DependencyProperty for <see cref="FontFamily" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		FontFamilyProperty:
        {
        	get:function(){
            	if(TextElement._FontFamilyProperty === undefined){
            		TextElement._FontFamilyProperty = 
                        DependencyProperty.RegisterAttached(
                                "FontFamily", 
                                FontFamily.Type, 
                                TextElement.Type,
                                /*new FrameworkPropertyMetadata( 
                                        SystemFonts.MessageFontFamily,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2( 
                                        SystemFonts.MessageFontFamily,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits),
                                new ValidateValueCallback(null, IsValidFontFamily));
            	}
            	
            	return TextElement._FontFamilyProperty;
        	}
        }, 
        /// <summary>
        /// DependencyProperty for <see cref="FontStyle" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		FontStyleProperty:
        {
        	get:function(){
            	if(TextElement._FontStyleProperty === undefined){
            		TextElement._FontStyleProperty = 
                        DependencyProperty.RegisterAttached( 
                                "FontStyle",
                                FontStyle.Type, 
                                TextElement.Type,
                                /*new FrameworkPropertyMetadata(
                                        SystemFonts.MessageFontStyle,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(
                                        SystemFonts.MessageFontStyle,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits)); 
            	}
            	
            	return TextElement._FontStyleProperty;
        	}
        },

        /// <summary>
        /// DependencyProperty for <see cref="FontWeight" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		FontWeightProperty:
        {
        	get:function(){
            	if(TextElement._FontWeightProperty === undefined){
            		TextElement._FontWeightProperty =
                        DependencyProperty.RegisterAttached( 
                                "FontWeight",
                                FontWeight.Type, 
                                TextElement.Type, 
                                /*new FrameworkPropertyMetadata(
                                        SystemFonts.MessageFontWeight, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(
                                        SystemFonts.MessageFontWeight, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits));
            	}
            	
            	return TextElement._FontWeightProperty;
        	}
        }, 

        /// <summary>
        /// DependencyProperty for <see cref="FontStretch" /> property. 
        /// </summary> 
//        public static readonly DependencyProperty 
		FontStretchProperty:
        {
        	get:function(){
            	if(TextElement._FontStretchProperty === undefined){
            		TextElement._FontStretchProperty = 
                        DependencyProperty.RegisterAttached(
                                "FontStretch",
                                FontStretch.Type,
                                TextElement.Type, 
                                /*new FrameworkPropertyMetadata(
                                        FontStretches.Normal, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(
                                        FontStretches.Normal, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits));
            	}
            	
            	return TextElement._FontStretchProperty;
        	}
        },  

        /// <summary>
        /// DependencyProperty for <see cref="FontSize" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		FontSizeProperty:
        {
        	get:function(){
            	if(TextElement._FontSizeProperty === undefined){
            		TextElement._FontSizeProperty = 
                        DependencyProperty.RegisterAttached( 
                                "FontSize",
                                Number.Type, 
                                TextElement.Type,
                                /*new FrameworkPropertyMetadata(
                                        SystemFonts.MessageFontSize,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(
                                        SystemFonts.MessageFontSize,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender 
                                        | FrameworkPropertyMetadataOptions.Inherits), 
                                new ValidateValueCallback(null, IsValidFontSize));
            	}
            	
            	return TextElement._FontSizeProperty;
        	}
        }, 
 
        /// <summary>
        /// DependencyProperty for <see cref="Foreground" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		ForegroundProperty:
        {
        	get:function(){
            	if(TextElement._ForegroundProperty === undefined){
            		TextElement._ForegroundProperty = 
                        DependencyProperty.RegisterAttached(
                                "Foreground", 
                                Brush.Type,
                                TextElement.Type,
                                /*new FrameworkPropertyMetadata(
                                        Brushes.Black, 
                                        FrameworkPropertyMetadataOptions.AffectsRender |
                                        FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender | 
                                        FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(
                                        Brushes.Black, 
                                        FrameworkPropertyMetadataOptions.AffectsRender |
                                        FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender | 
                                        FrameworkPropertyMetadataOptions.Inherits));
            	}
            	
            	return TextElement._ForegroundProperty;
        	}
        },  
        /// <summary>
        /// DependencyProperty for <see cref="Background" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		BackgroundProperty:
        {
        	get:function(){
            	if(TextElement._BackgroundProperty === undefined){
            		TextElement._BackgroundProperty = 
                        DependencyProperty.Register("Background", 
                        		Brush.Type,
                                TextElement.Type, 
                                /*new FrameworkPropertyMetadata(null,
                                        FrameworkPropertyMetadataOptions.AffectsRender)*/
                                FrameworkPropertyMetadata.Build2(null,
                                        FrameworkPropertyMetadataOptions.AffectsRender));
            	}
            	
            	return TextElement._BackgroundProperty;
        	}
        }, 
        
       

//        internal static readonly UncommonField<TextElement> 
		ContainerTextElementField:
        {
        	get:function(){
            	if(TextElement._ContainerTextElementField === undefined){
            		TextElement._ContainerTextElementField = new UncommonField/*<TextElement>*/(); 
            	}
            	
            	return TextElement._ContainerTextElementField;
        	}
        },
        
        /// <summary> 
        /// DependencyProperty for <see cref="TextEffectCollection" /> property.
        /// It doesn't affect layout 
        /// </summary> 
//        public static readonly DependencyProperty 
		TextEffectsProperty:
        {
        	get:function(){
            	if(TextElement._TextEffectsProperty === undefined){
            		TextElement._TextEffectsProperty =
                        DependencyProperty.Register( 
                                "TextEffects",
                                TextEffectCollection.Type,
                                TextElement.Type,
                                /*new FrameworkPropertyMetadata( 
                                        new FreezableDefaultValueFactory(TextEffectCollection.Empty),
                                        FrameworkPropertyMetadataOptions.AffectsRender)*/
                                FrameworkPropertyMetadata.Build2( 
                                        new FreezableDefaultValueFactory(TextEffectCollection.Empty),
                                        FrameworkPropertyMetadataOptions.AffectsRender)); 
            	}
            	
            	return TextElement._TextEffectsProperty;
        	}
        }, 
 
	});
	
//	static TextElement() 
	TextElement.Init = function()
    {
        // For attached properties metadata specific to the type needs to be set using OverrideMetadata
        // instead of passing it during property registration. Otherwise all types will get it.
        var typographyChanged = new PropertyChangedCallback(null, OnTypographyChanged); 

        // Registering typography properties metadata 
        /*DependencyProperty[]*/var typographyProperties = Typography.TypographyPropertiesList; 
        for (var i = 0; i < typographyProperties.Length; i++)
        { 
            typographyProperties[i].OverrideMetadata(TextElement.Type, 
            		/*new FrameworkPropertyMetadata(typographyChanged)*/
            		FrameworkPropertyMetadata.BuildWithPCCB(typographyChanged));
        }
    };
    /// <summary> 
    /// DependencyProperty setter for <see cref="FontFamily" /> property.
    /// </summary>
    /// <param name="element">The element to which to write the attached property.</param>
    /// <param name="value">The property value to set</param> 
//    public static void 
    TextElement.SetFontFamily = function(/*DependencyObject*/ element, /*FontFamily*/ value)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(TextElement.FontFamilyProperty, value);
    }; 

    /// <summary> 
    /// DependencyProperty getter for <see cref="FontFamily" /> property. 
    /// </summary>
    /// <param name="element">The element from which to read the attached property.</param> 
//    public static FontFamily 
    TextElement.GetFontFamily = function(/*DependencyObject*/ element)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 

        return element.GetValue(TextElement.FontFamilyProperty);
    } 

    /// <summary> 
    /// DependencyProperty setter for <see cref="FontStyle" /> property. 
    /// </summary>
    /// <param name="element">The element to which to write the attached property.</param> 
    /// <param name="value">The property value to set</param>
//    public static void 
    TextElement.SetFontStyle = function(/*DependencyObject*/ element, /*FontStyle*/ value)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 

        element.SetValue(TextElement.FontStyleProperty, value); 
    };

    /// <summary>
    /// DependencyProperty getter for <see cref="FontStyle" /> property. 
    /// </summary>
    /// <param name="element">The element from which to read the attached property.</param> 
//    public static FontStyle 
    TextElement.GetFontStyle = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }

        return element.GetValue(TextElement.FontStyleProperty);
    }; 

    /// <summary>
    /// DependencyProperty setter for <see cref="FontWeight" /> property. 
    /// </summary>
    /// <param name="element">The element to which to write the attached property.</param> 
    /// <param name="value">The property value to set</param> 
//    public static void 
    TextElement.SetFontWeight = function(/*DependencyObject*/ element, /*FontWeight*/ value)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 

        element.SetValue(TextElement.FontWeightProperty, value); 
    };

    /// <summary> 
    /// DependencyProperty getter for <see cref="FontWeight" /> property.
    /// </summary>
    /// <param name="element">The element from which to read the attached property.</param>
//    public static FontWeight 
    TextElement.GetFontWeight =function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        return element.GetValue(TextElement.FontWeightProperty);
    };

    /// <summary> 
    /// DependencyProperty setter for <see cref="FontStretch" /> property.
    /// </summary>
    /// <param name="element">The element to which to write the attached property.</param>
    /// <param name="value">The property value to set</param> 
//    public static void 
    TextElement.SetFontStretch = function(/*DependencyObject*/ element, /*FontStretch*/ value)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(TextElement.FontStretchProperty, value);
    }; 

    /// <summary> 
    /// DependencyProperty getter for <see cref="FontStretch" /> property. 
    /// </summary>
    /// <param name="element">The element from which to read the attached property.</param> 
//    public static FontStretch 
    TextElement.GetFontStretch = function(/*DependencyObject*/ element)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 

        return element.GetValue(TextElement.FontStretchProperty);
    };

    /// <summary> 
    /// DependencyProperty setter for <see cref="FontSize" /> property.
    /// </summary>
    /// <param name="element">The element to which to write the attached property.</param>
    /// <param name="value">The property value to set</param> 
//    public static void 
    TextElement.SetFontSize = function(/*DependencyObject*/ element, /*double*/ value)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(TextElement.FontSizeProperty, value);
    };

    /// <summary> 
    /// DependencyProperty getter for <see cref="FontSize" /> property. 
    /// </summary>
    /// <param name="element">The element from which to read the attached property.</param> 
//    public static double 
    TextElement.GetFontSize = function(/*DependencyObject*/ element)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 

        return element.GetValue(TextElement.FontSizeProperty); 
    };

    /// <summary> 
    /// DependencyProperty setter for <see cref="Foreground" /> property.
    /// </summary>
    /// <param name="element">The element to which to write the attached property.</param>
    /// <param name="value">The property value to set</param> 
//    public static void 
    TextElement.SetForeground = function(/*DependencyObject*/ element, /*Brush*/ value)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(TextElement.ForegroundProperty, value);
    }; 

    /// <summary> 
    /// DependencyProperty getter for <see cref="Foreground" /> property. 
    /// </summary>
    /// <param name="element">The element from which to read the attached property.</param> 
//    public static Brush 
    TextElement.GetForeground = function(/*DependencyObject*/ element)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 

        return element.GetValue(TextElement.ForegroundProperty);
    };

//    internal static TypographyProperties 
    TextElement.GetTypographyProperties = function(/*DependencyObject*/ element)
    { 
        /*TypographyProperties*/var group = new TypographyProperties(); 

//        group.SetStandardLigatures(element.GetValue(Typography.StandardLigaturesProperty)); 
//        group.SetContextualLigatures(element.GetValue(Typography.ContextualLigaturesProperty));
//        group.SetDiscretionaryLigatures(element.GetValue(Typography.DiscretionaryLigaturesProperty));
//        group.SetHistoricalLigatures(element.GetValue(Typography.HistoricalLigaturesProperty));
//        group.SetAnnotationAlternates(element.GetValue(Typography.AnnotationAlternatesProperty)); 
//        group.SetContextualAlternates(element.GetValue(Typography.ContextualAlternatesProperty));
//        group.SetHistoricalForms(element.GetValue(Typography.HistoricalFormsProperty)); 
//        group.SetKerning(element.GetValue(Typography.KerningProperty)); 
//        group.SetCapitalSpacing(element.GetValue(Typography.CapitalSpacingProperty));
//        group.SetCaseSensitiveForms(element.GetValue(Typography.CaseSensitiveFormsProperty)); 
//        group.SetStylisticSet1(element.GetValue(Typography.StylisticSet1Property));
//        group.SetStylisticSet2(element.GetValue(Typography.StylisticSet2Property));
//        group.SetStylisticSet3(element.GetValue(Typography.StylisticSet3Property));
//        group.SetStylisticSet4(element.GetValue(Typography.StylisticSet4Property)); 
//        group.SetStylisticSet5(element.GetValue(Typography.StylisticSet5Property));
//        group.SetStylisticSet6(element.GetValue(Typography.StylisticSet6Property)); 
//        group.SetStylisticSet7(element.GetValue(Typography.StylisticSet7Property)); 
//        group.SetStylisticSet8(element.GetValue(Typography.StylisticSet8Property));
//        group.SetStylisticSet9(element.GetValue(Typography.StylisticSet9Property)); 
//        group.SetStylisticSet10(element.GetValue(Typography.StylisticSet10Property));
//        group.SetStylisticSet11(element.GetValue(Typography.StylisticSet11Property));
//        group.SetStylisticSet12(element.GetValue(Typography.StylisticSet12Property));
//        group.SetStylisticSet13(element.GetValue(Typography.StylisticSet13Property)); 
//        group.SetStylisticSet14(element.GetValue(Typography.StylisticSet14Property));
//        group.SetStylisticSet15(element.GetValue(Typography.StylisticSet15Property)); 
//        group.SetStylisticSet16(element.GetValue(Typography.StylisticSet16Property)); 
//        group.SetStylisticSet17(element.GetValue(Typography.StylisticSet17Property));
//        group.SetStylisticSet18(element.GetValue(Typography.StylisticSet18Property)); 
//        group.SetStylisticSet19(element.GetValue(Typography.StylisticSet19Property));
//        group.SetStylisticSet20(element.GetValue(Typography.StylisticSet20Property));
//        group.SetFraction(element.GetValue(Typography.FractionProperty));
//        group.SetSlashedZero(element.GetValue(Typography.SlashedZeroProperty)); 
//        group.SetMathematicalGreek(element.GetValue(Typography.MathematicalGreekProperty));
//        group.SetEastAsianExpertForms(element.GetValue(Typography.EastAsianExpertFormsProperty)); 
//        group.SetVariants((FontVariants) element.GetValue(Typography.VariantsProperty)); 
//        group.Set----s((FontCapitals) element.GetValue(Typography.CapitalsProperty));
//        group.SetNumeralStyle((FontNumeralStyle) element.GetValue(Typography.NumeralStyleProperty)); 
//        group.SetNumeralAlignment((FontNumeralAlignment) element.GetValue(Typography.NumeralAlignmentProperty));
//        group.SetEastAsianWidths((FontEastAsianWidths) element.GetValue(Typography.EastAsianWidthsProperty));
//        group.SetEastAsianLanguage((FontEastAsianLanguage) element.GetValue(Typography.EastAsianLanguageProperty));
//        group.SetStandardSwashes(element.GetValue(Typography.StandardSwashesProperty)); 
//        group.SetContextualSwashes(element.GetValue(Typography.ContextualSwashesProperty));
//        group.SetStylisticAlternates(element.GetValue(Typography.StylisticAlternatesProperty)); 

        return group;
    }; 

    // Returns the common TextElement ancestor of two TextElements.
//    internal static TextElement 
    TextElement.GetCommonAncestor = function(/*TextElement*/ element1, /*TextElement*/ element2) 
    {
        if (element1 != element2)
        {
            var depth1 = 0; 
            var depth2 = 0;
            /*TextElement*/var element; 

            // Calculate the depths of each TextElement within the tree.
            for (element = element1; element.Parent instanceof TextElement; element = element.Parent) 
            {
                depth1++;
            }
            for (element = element2; element.Parent instanceof TextElement; element = element.Parent) 
            {
                depth2++; 
            } 

            // Then walk up until we reach an equal depth. 

            while (depth1 > depth2 && element1 != element2)
            {
                element1 = element1.Parent; 
                depth1--;
            } 

            while (depth2 > depth1 && element1 != element2)
            { 
                element2 = element2.Parent;
                depth2--;
            }

            // Then, if necessary, keep going up to the root looking for a match.
            while (element1 != element2) 
            { 
                element1 = element1.Parent instanceof TextElement ? element1.Parent : null;
                element2 = element2.Parent instanceof TextElement ? element2.Parent : null; 
            }
        }

        return element1;
    } 

//    private static void 
    function OnTypographyChanged(/*DependencyObject*/ element, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        element._typographyPropertiesGroup = null; 
    } 

//    private static bool 
    function IsValidFontFamily(/*object*/ o)
    { 
        var value = o instanceof FontFamily ? o : null; 
        return (value != null);
    } 

    /// <summary>
    /// <see cref="DependencyProperty.ValidateValueCallback"/>
    /// </summary> 
//    private static bool 
    function IsValidFontSize(/*object*/ value)
    { 
        var fontSize = value; 
        var minFontSize = 1; //TextDpi.MinWidth;
        var maxFontSize = 100000; //Math.Min(1000000, PTS.MaxFontSize); 

        if (Number.IsNaN(fontSize))
        {
            return false; 
        }
        if (fontSize < minFontSize) 
        { 
            return false;
        } 
        if (fontSize > maxFontSize)
        {
            return false;
        } 
        return true;
    } 
    
	
	TextElement.Type = new Type("TextElement", TextElement, [FrameworkContentElement.Type, IAddChild.Type]);
	return TextElement;
});

//        // The node in a TextContainer representing this TextElement. 
//        private TextTreeTextElementNode _textElementNode;
//
//        //--------------------------------------------------------------------
//        // Typography Group Property 
//        //-------------------------------------------------------------------
//        private TypographyProperties _typographyPropertiesGroup = Typography.Default; 





