
/**
 * TextPointer
 */

define(["dojo/_base/declare", "system/Type", "documents/ContentPosition", "documents/ITextPointer"], 
		function(declare, Type, ContentPosition, ITextPointer){
	
    // Enum used for the _flags bitfield.
//    private enum 
	var Flags =declare(null, {});
	Flags.EdgeMask                      = 15; // 4 low-order bis are an ElementEdge. 
	Flags.IsFrozen                      = 16; 
	Flags.IsCaretUnitBoundaryCacheValid = 32;
	Flags.CaretUnitBoundaryCache        = 64; 
    
	var TextPointer = declare("TextPointer", [ContentPosition, ITextPointer],{
		constructor:function(){
		}
	});
	
	Object.defineProperties(TextPointer.prototype,{
		  
	});
	
	Object.defineProperties(TextPointer,{
		  
	});
	
	TextPointer.Type = new Type("TextPointer", TextPointer, [ContentPosition.Type, ITextPointer.Type]);
	return TextPointer;
});

 
        /// <summary> 
        /// Creates a new instance of TextPointer object.
        /// </summary> 
        /// <param name="textPointer">
        /// TextPointer from which initial properties and location are initialized.
        /// </param>
        /// <remarks> 
        /// New TextPointers always have their IsFrozen property set to false,
        /// regardless of the state of the position parameter.  Otherwise the 
        /// new TextPointer instance is identical to the position parameter. 
        /// </remarks>
        internal TextPointer(TextPointer textPointer) 
        {
            if (textPointer == null)
            {
                throw new ArgumentNullException("textPointer"); 
            }
 
            InitializeOffset(textPointer, 0, textPointer.GetGravityInternal()); 
        }
 
        // Creates a new TextPointer instance.
        internal TextPointer(TextPointer position, int offset)
        {
            if (position == null) 
            {
                throw new ArgumentNullException("position"); 
            } 

            InitializeOffset(position, offset, position.GetGravityInternal()); 
        }

        // Creates a new TextPointer instance.
        internal TextPointer(TextPointer position, LogicalDirection direction) 
        {
            InitializeOffset(position, 0, direction); 
        } 

        // Creates a new TextPointer instance. 
        internal TextPointer(TextPointer position, int offset, LogicalDirection direction)
        {
            InitializeOffset(position, offset, direction);
        } 

        // Creates a new TextPointer instance. 
        internal TextPointer(TextContainer textContainer, int offset, LogicalDirection direction) 
        {
            SplayTreeNode node; 
            ElementEdge edge;

            if (offset < 1 || offset > textContainer.InternalSymbolCount - 1)
            { 
                throw new ArgumentException(SR.Get(SRID.BadDistance));
            } 
 
            textContainer.GetNodeAndEdgeAtOffset(offset, out node, out edge);
 
            Initialize(textContainer, (TextTreeNode)node, edge, direction, textContainer.PositionGeneration, false, false, textContainer.LayoutGeneration);
        }

        // Creates a new TextPointer instance. 
        internal TextPointer(TextContainer tree, TextTreeNode node, ElementEdge edge)
        { 
            Initialize(tree, node, edge, LogicalDirection.Forward, tree.PositionGeneration, false, false, tree.LayoutGeneration); 
        }
 
        // Creates a new TextPointer instance.
        internal TextPointer(TextContainer tree, TextTreeNode node, ElementEdge edge, LogicalDirection direction)
        {
            Initialize(tree, node, edge, direction, tree.PositionGeneration, false, false, tree.LayoutGeneration); 
        }
 
        // Constructor equivalent to ITextPointer.CreatePointer 
        internal TextPointer CreatePointer()
        { 
            return new TextPointer(this);
        }

        // Constructor equivalent to ITextPointer.CreatePointer 
        internal TextPointer CreatePointer(LogicalDirection gravity)
        { 
            return new TextPointer(this, gravity); 
        }

        /// <summary> 
        /// Returns true if this TextPointer is positioned within the same
        /// text containner as another TextPointer.
        /// </summary>
        /// <param name="textPosition"> 
        /// TextPointer to compare.
        /// </param> 
        public bool IsInSameDocument(TextPointer textPosition)
        {
            if (textPosition == null)
            { 
                throw new ArgumentNullException("textPosition");
            } 
 
            _tree.EmptyDeadPositionList();
 
            return (this.TextContainer == textPosition.TextContainer);
        }

        /// <summary> 
        /// Compares positions of this TextPointer with another TextPointer.
        /// </summary> 
        /// <param name="position"> 
        /// The TextPointer to compare with.
        /// </param> 
        /// <returns>
        /// Less than zero: this TextPointer preceeds position.
        /// Zero: this TextPointer is at the same location as position.
        /// Greater than zero: this TextPointer follows position. 
        /// </returns>
        /// <exception cref="System.ArgumentException"> 
        /// Throws ArgumentException if position does not belong to the same 
        /// text container as this TextPointer (you can use <see cref="TextPointer.IsInSameDocument"/>
        /// method to detect whether comparison is possible). 
        /// </exception>
        public int CompareTo(TextPointer position)
        {
            int offsetThis; 
            int offsetPosition;
            int result; 
 
            _tree.EmptyDeadPositionList();
 
            ValidationHelper.VerifyPosition(_tree, position);

            SyncToTreeGeneration();
            position.SyncToTreeGeneration(); 

            offsetThis = GetSymbolOffset(); 
            offsetPosition = position.GetSymbolOffset(); 

            if (offsetThis < offsetPosition) 
            {
                result = -1;
            }
            else if (offsetThis > offsetPosition) 
            {
                result = +1; 
            } 
            else
            { 
                result = 0;
            }

            return result; 
        }
 
        /// <summary> 
        /// Returns the type of content to one side of this TextPointer.
        /// </summary> 
        /// <param name="direction">
        /// Direction to query.
        /// </param>
        /// <returns> 
        /// <para>Returns <see cref="TextPointerContext.None"/> if this TextPointer
        /// is positioned at the beginning of a text container and the requested direction 
        /// is <see cref="System.Windows.Documents.LogicalDirection.Backward"/>, or if it is positioned 
        /// at the end of a text container  and the requested direction is
        /// <see cref="System.Windows.Documents.LogicalDirection.Forward"/>.</para> 
        /// <para>Returns <see cref="TextPointerContext.ElementStart"/> if the TextPointer
        /// has an openenig tag of some of TextElements in the requested direction.</para>
        /// <para>Returns <see cref="TextPointerContext.ElementEnd"/> if the TextPointer
        /// has a closing tag of some of TextElements in the requested direction.</para> 
        /// <para>Returns <see cref="TextPointerContext.Text"/> if the TextPointer
        /// is positioned within <see cref="Run"/> element and has some non-emty sequence of characters 
        /// in requested direction.</para> 
        /// <para>Returns <see cref="TextPointerContext.EmbeddedElement"/> is the TextPointer
        /// is positioned within <see cref="InlineUIContainer"/> or <see cref="BlockUIContainer"/> 
        /// element and has <see cref="UIElement"/> as atomic symbol in a requested direction.</para>
        /// </returns>
        public TextPointerContext GetPointerContext(LogicalDirection direction)
        { 
            ValidationHelper.VerifyDirection(direction, "direction"); 

            _tree.EmptyDeadPositionList(); 

            SyncToTreeGeneration();

            return (direction == LogicalDirection.Forward) ? GetPointerContextForward(_node, this.Edge) : GetPointerContextBackward(_node, this.Edge); 
        }
 
        /// <summary> 
        /// Returns the count of Unicode characters between this TextPointer and the
        /// edge of an element in the given direction. 
        /// </summary>
        /// <param name="direction">
        /// Direction to query.
        /// </param> 
        /// <remarks>
        /// If the TetPointer is positioned not inside a <see cref="Run"/> element, 
        /// then the method always returns zero. 
        /// </remarks>
        public int GetTextRunLength(LogicalDirection direction) 
        {
            ValidationHelper.VerifyDirection(direction, "direction");

            _tree.EmptyDeadPositionList(); 

            SyncToTreeGeneration(); 
 
            int count = 0;
 
            // Combine adjacent text nodes into a single run.
            // This isn't just a perf optimization.  Because text positions
            // split text nodes, if we just returned a single node's text
            // callers would see strange side effects where position.GetTextLength() != 
            // position.GetText if a position is moved between the calls.
            if (_tree.PlainTextOnly) 
            { 
                // Optimize for TextBox, which only ever contains (sometimes
                // very large quantities of) text nodes. 
                Invariant.Assert(this.GetScopingNode() is TextTreeRootNode);

                if (direction == LogicalDirection.Forward)
                { 
                    count = _tree.InternalSymbolCount - this.GetSymbolOffset() - 1;
                } 
                else 
                {
                    count = this.GetSymbolOffset() - 1; 
                }
            }
            else
            { 
                TextTreeNode textNode = GetAdjacentTextNodeSibling(direction);
 
                while (textNode != null) 
                {
                    count += textNode.SymbolCount; 
                    textNode = ((direction == LogicalDirection.Forward) ? textNode.GetNextNode() : textNode.GetPreviousNode()) as TextTreeTextNode;
                }
            }
 
            return count;
        } 
 
        /// <summary>
        /// Returns the distance between this TextPointer and another. 
        /// </summary>
        /// <param name="position">
        /// TextPointer to compare.
        /// </param> 
        /// <exception cref="System.ArgumentException">
        /// Throws an ArgumentException if the TextPointer position is not 
        /// positioned within the same document as this TextPointer. 
        /// </exception>
        /// <returns> 
        /// <para>The return value will be negative if the TextPointer position
        /// preceeds this TextPointer, zero if the two TextPointers
        /// are equally positioned, or positive if position follows this
        /// TextPointer.</para> 
        /// </returns>
        public int GetOffsetToPosition(TextPointer position) 
        { 
            _tree.EmptyDeadPositionList();
 
            ValidationHelper.VerifyPosition(_tree, position);

            SyncToTreeGeneration();
            position.SyncToTreeGeneration(); 

            return (position.GetSymbolOffset() - GetSymbolOffset()); 
        } 

        /// <summary> 
        /// Returns text bordering this TextPointer from one side or another.
        /// </summary>
        /// <param name="direction">
        /// Direction to query. 
        /// </param>
        public string GetTextInRun(LogicalDirection direction) 
        {
            ValidationHelper.VerifyDirection(direction, "direction");

            return TextPointerBase.GetTextInRun(this, direction); 
        }
 
        /// <summary> 
        /// Copies characters bordering this TextPointer into a caller supplied char array.
        /// </summary> 
        /// <param name="direction">
        /// Direction to query.
        /// </param>
        /// <param name="textBuffer"> 
        /// Buffer into which chars are copied.
        /// </param> 
        /// <param name="startIndex"> 
        /// Index within the textBuffer array at which the copy is started.
        /// </param> 
        /// <param name="count">
        /// The maximum number of characters to copy. Must be less than
        /// or equal to a (<c>textBuffer.Length - startIndex</c>).
        /// </param> 
        /// <returns>
        /// The count of chars actually copied. 
        /// </returns> 
        /// <exception cref="ArgumentException">
        /// Is thrown in the following cases: (a) when <c>startIndex</c> is less than zero, 
        /// (b) when <c>startIndex</c> is greater than <c>textBuffer.Length</c>,
        /// (c) when <c>count</c> is less than zero, (d) when <c>count</c>
        /// is greater than size available for copying (<c>textBuffer.Length - startIndex</c>).
        /// </exception> 
        public int GetTextInRun(LogicalDirection direction, char[] textBuffer, int startIndex, int count)
        {
            TextTreeTextNode textNode; 

            ValidationHelper.VerifyDirection(direction, "direction"); 
 
            SyncToTreeGeneration();
 
            textNode = GetAdjacentTextNodeSibling(direction);

            return textNode == null ? 0 : GetTextInRun(_tree, GetSymbolOffset(), textNode, -1, direction, textBuffer, startIndex, count);
        } 

        /// <summary> 
        /// Returns an element represented by a symbol, if any, bordering 
        /// this TextPointer in the specified direction.
        /// </summary> 
        /// <param name="direction">
        /// Direction to query.
        /// </param>
        /// <returns> 
        /// The element if its opening or closing tag exists
        /// in a specified direction. Otherwize returns null. 
        /// </returns> 
        public DependencyObject GetAdjacentElement(LogicalDirection direction) 
        {
            ValidationHelper.VerifyDirection(direction, "direction");

            _tree.EmptyDeadPositionList(); 
            SyncToTreeGeneration();
 
            return GetAdjacentElement(_node, this.Edge, direction); 
        }
 
        /// <summary>
        /// Returns a TextPointer at a new position by a specified symbol
        /// count.
        /// </summary> 
        /// <param name="offset">
        /// Number of symbols to advance.  offset may be negative, in which 
        /// case the TextPointer is moved backwards. 
        /// </param>
        /// <returns> 
        /// TextPointer located at requested position in case if requested position
        /// does exist, otherwize returns null. LogicalDirection of the TextPointer
        /// returned is the same as of this TexPointer.
        /// </returns> 
        public TextPointer GetPositionAtOffset(int offset)
        {
            return GetPositionAtOffset(offset, this.LogicalDirection);
        } 

        /// <summary> 
        /// Returns a TextPointer at a new position by a specified symbol 
        /// count.
        /// </summary> 
        /// <param name="offset">
        /// Number of symbols to advance.  offset may be negative, in which
        /// case the TextPointer is moved backwards.
        /// </param> 
        /// <param name="direction">
        /// LogicalDirection desired for a returned TextPointer. 
        /// </param> 
        /// <returns>
        /// TextPointer located at requested position in case if requested position 
        /// does exist, otherwize returns null. LogicalDirection of the TextPointer
        /// returned is as specified by a <paramref name="direction"/>.
        /// </returns>
        public TextPointer GetPositionAtOffset(int offset, LogicalDirection direction)
        { 
            TextPointer position = new TextPointer(this, direction);
            int actualCount = position.MoveByOffset(offset); 
            if (actualCount == offset) 
            {
                position.Freeze(); 
                return position;
            }
            else
            { 
                return null;
            } 
        } 

        /// <summary> 
        /// Returns a pointer at the next symbol in a specified
        /// direction, or past all following Unicode characters if the
        /// bordering content is Unicode text.
        /// </summary> 
        /// <param name="direction">
        /// Direction to move. 
        /// </param> 
        /// <returns>
        /// TextPointer in a requested direction, null if this TextPointer 
        /// borders the start or end of the document.
        /// </returns>
        public TextPointer GetNextContextPosition(LogicalDirection direction)
        {
            return (TextPointer)((ITextPointer)this).GetNextContextPosition(direction);
        } 

        /// <summary> 
        /// Returns a TextPointer at the closest insertion position in a 
        /// specified direction.
        /// </summary> 
        /// <param name="direction">
        /// Direction to search a closest insertion position.
        /// </param>
        /// <returns> 
        /// TextPointer positioned at inserion point. The value is never null.
        /// </returns> 
        public TextPointer GetInsertionPosition(LogicalDirection direction)
        {
            return (TextPointer)((ITextPointer)this).GetInsertionPosition(direction); 
        }
 
        // Used for pointer normalization in cases when direction does not matter. 
        internal TextPointer GetInsertionPosition()
        { 
            return GetInsertionPosition(LogicalDirection.Forward);
        }

        /// <summary> 
        /// Returns a TextPointer in the direction indicated to the following
        /// insertion position. 
        /// </summary> 
        /// <param name="direction">
        /// Direction to move. 
        /// </param>
        /// <returns>
        /// A TextPointer at an insertion position in a requested direction,
        /// null if there is no more insertion positions in that direction. 
        /// </returns>
        public TextPointer GetNextInsertionPosition(LogicalDirection direction) 
        { 
            return (TextPointer)((ITextPointer)this).GetNextInsertionPosition(direction);
        } 

        /// <summary>
        /// Returns a TextPointer at the start of line after skipping
        /// a given number of line starts in forward or backward direction. 
        /// </summary>
        /// <param name="count"> 
        /// Number of line starts to skip when finding a desired line start position. 
        /// Negative values specify preceding lines, zero specifies the current line,
        /// positive values specify following lines. 
        /// </param>
        /// <exception cref="System.InvalidOperationException">
        /// Throws an InvalidOperationException if this TextPointer's HasValidLayout
        /// property is set false.  Without a calculated layout it is not possible 
        /// to position relative to rendered lines.
        /// </exception> 
        /// <returns> 
        /// TextPointer positioned at the begining of a line requested
        /// (with LogicalDirection set to Forward). 
        /// If there is no sufficient lines in requested direction,
        /// returns null.
        /// </returns>
        public TextPointer GetLineStartPosition(int count)
        { 
            int actualCount;
 
            TextPointer lineStartPosition = GetLineStartPosition(count, out actualCount); 

            return (actualCount != count) ? null : lineStartPosition; 
        }

        /// <summary>
        /// Returns a TextPointer at the start of line after skipping 
        /// a given number of line starts in forward or backward direction.
        /// </summary> 
        /// <param name="count"> 
        /// Offset of the destination line.  Negative values specify preceding
        /// lines, zero specifies the current line, positive values specify 
        /// following lines.
        /// </param>
        /// <param name="actualCount">
        /// The offset of the line moved to.  This value may be less than 
        /// requested if the beginning or end of document is encountered.
        /// </param> 
        /// <returns> 
        /// TextPointer positioned at the begining of a line requested
        /// (with LogicalDirection set to Forward). 
        /// If there is no sufficient lines in requested direction,
        /// returns a position at the beginning of a farthest line
        /// in this direction. In such case out parameter actualCount
        /// gets a number of lines actually skipped. 
        /// Unlike the other override in this case the returned pointer is never null.
        /// </returns> 
        public TextPointer GetLineStartPosition(int count, out int actualCount) 
        {
            this.ValidateLayout(); 

            TextPointer position = new TextPointer(this);

            if (this.HasValidLayout) 
            {
                actualCount = position.MoveToLineBoundary(count); 
            } 
            else
            { 
                actualCount = 0;
            }

            position.SetLogicalDirection(LogicalDirection.Forward); 
            position.Freeze();
 
            return position; 
        }
 
        /// <summary>
        /// Returns the bounding box of the content bordering this TextPointer
        /// in a specified direction.
        /// </summary> 
        /// <param name="direction">
        /// Direction of content. 
        /// </param> 
        /// <remarks>
        /// <para>TextElement edges are not considered content for the purposes of 
        /// this method.  If the TextPointer is positioned before a TextElement
        /// edge, the return value will be the bounding box of the next
        /// non-TextElement content.</para>
        /// <para>If there is no content in the specified direction, a zero-width 
        /// Rect is returned with height matching the preceding content.</para>
        /// </remarks> 
        public Rect GetCharacterRect(LogicalDirection direction) 
        {
            ValidationHelper.VerifyDirection(direction, "direction"); 

            _tree.EmptyDeadPositionList();
            SyncToTreeGeneration();
 
            this.ValidateLayout();
 
            if (!this.HasValidLayout) 
            {
                return Rect.Empty; 
            }

            return TextPointerBase.GetCharacterRect(this, direction);
        } 

        /// <summary> 
        /// Inserts text at this TextPointer's position. 
        /// </summary>
        /// <param name="textData"> 
        /// Text to insert.
        /// </param>
        /// <remarks>
        /// The LogicalDirection property specifies whether this TextPointer 
        /// will be positioned before or after the new text.
        /// </remarks> 
        public void InsertTextInRun(string textData) 
        {
            if (textData == null) 
            {
                throw new ArgumentNullException("textData");
            }
 
            _tree.EmptyDeadPositionList();
            SyncToTreeGeneration(); 
 
            TextPointer insertPosition;
 
            if (TextSchema.IsInTextContent(this))
            {
                insertPosition = this;
            } 
            else
            { 
                insertPosition = TextRangeEditTables.EnsureInsertionPosition(this); 
            }
 
            _tree.BeginChange();
            try
            {
                _tree.InsertTextInternal(insertPosition, textData); 
            }
            finally 
            { 
                _tree.EndChange();
            } 
        }

        /// <summary>
        /// Deletes text in Run at this TextPointer's position 
        /// </summary>
        /// <remarks></remarks> 
        /// <param name="count"> 
        /// Number of characters to delete.
        /// Positive count deletes text following this TextPointer in Run. 
        /// Negative count deletes text preceding this TextPointer in Run.
        /// </param>
        /// <returns>
        /// Returns the actual count of deleted chars. 
        /// The actual count may be less than requested in cases
        /// when original requested count exceeds text run length in given direction. 
        /// </returns> 
        public int DeleteTextInRun(int count)
        { 
            _tree.EmptyDeadPositionList();
            SyncToTreeGeneration();

            // TextSchema Validation 
            if (!TextSchema.IsInTextContent(this))
            { 
                return 0; 
            }
 
            // Direction to delete text in run
            LogicalDirection direction = count < 0 ? LogicalDirection.Backward : LogicalDirection.Forward;

            // Get text run length in given direction 
            int maxDeleteCount = this.GetTextRunLength(direction);
 
            // Truncate count if it extends past the run in given direction 
            if (count > 0 && count > maxDeleteCount)
            { 
                count = maxDeleteCount;
            }
            else if (count < 0 && count < -maxDeleteCount)
            { 
                count = -maxDeleteCount;
            } 
 
            // Get a new pointer for deletion
            TextPointer deleteToPosition = new TextPointer(this, count); 

            _tree.BeginChange();
            try
            { 
                if (count > 0)
                { 
                    _tree.DeleteContentInternal(this, deleteToPosition); 
                }
                else if (count < 0) 
                {
                    _tree.DeleteContentInternal(deleteToPosition, this);
                }
            } 
            finally
            { 
                _tree.EndChange(); 
            }
 
            return count;
        }

        /// <summary> 
        /// Inserts a TextElement at this TextPointer's position.
        /// </summary> 
        /// <param name="textElement"> 
        /// ContentElement to insert.
        /// </param> 
        /// <remarks>
        /// The LogicalDirection property specifies whether this TextPointer
        /// will be positioned before or after the TextElement.
        /// </remarks> 
        /// <exception cref="ArgumentException">
        /// Throws ArgumentException is textElement is not valid 
        /// according to flow schema. 
        /// </exception>
        /// <exception cref="InvalidOperationException"> 
        /// Throws InvalidOperationException if textElement cannot be inserted
        /// at this position because it belongs to another tree.
        /// </exception>
        internal void InsertTextElement(TextElement textElement) 
        {
            Invariant.Assert(textElement != null); 
 
            _tree.EmptyDeadPositionList();
            SyncToTreeGeneration(); 

            ValidationHelper.ValidateChild(this, textElement, "textElement");

            if (textElement.Parent != null) 
            {
                throw new InvalidOperationException(SR.Get(SRID.TextPointer_CannotInsertTextElementBecauseItBelongsToAnotherTree)); 
            } 
            textElement.RepositionWithContent(this);
        } 

        /// <summary>
        /// Insert a paragraph break at this position by splitting all elements upto its paragraph ancestor.
        /// </summary> 
        /// <returns>
        /// When this position has a paragraph parent, this method returns a 
        /// normalized position in the beginning of a second paragraph. 
        ///
        /// Otherwise, if the position is not parented by a paragraph 
        /// (for special insertion positions such as table row end, BlockUIContainer boundaries, etc),
        /// this method creates a paragraph by using rules of EnsureInsertionPosition()
        /// and returns a normalized position at the start of the paragraph created.
        /// </returns> 
        /// <exception cref="InvalidOperationException">
        /// Throws InvalidOperationException when this position has a non-splittable ancestor such as Hyperlink, 
        /// since we cannot successfully split upto the parent paragraph in this case. 
        /// </exception>
        public TextPointer InsertParagraphBreak() 
        {
            _tree.EmptyDeadPositionList();
            SyncToTreeGeneration();
 
            if (this.TextContainer.Parent != null)
            { 
                Type containerType = this.TextContainer.Parent.GetType(); 
                if (!TextSchema.IsValidChildOfContainer(containerType, typeof(Paragraph)))
                { 
                    throw new InvalidOperationException(SR.Get(SRID.TextSchema_IllegalElement, "Paragraph", containerType));
                }
            }
 
            Inline ancestor = this.GetNonMergeableInlineAncestor();
 
            if (ancestor != null) 
            {
                // Cannot split a hyperlink element! 
                throw new InvalidOperationException(SR.Get(SRID.TextSchema_CannotSplitElement, ancestor.GetType().Name));
            }

            TextPointer position; 

            _tree.BeginChange(); 
            try 
            {
                position = TextRangeEdit.InsertParagraphBreak(this, /*moveIntoSecondParagraph:*/true); 
            }
            finally
            {
                _tree.EndChange(); 
            }
 
            return position; 
        }
 
        /// <summary>
        /// Insert a line break at this position.
        /// If the position is parented by a Run, the Run element is split at this position and then a line break inserted.
        /// </summary> 
        /// <returns>
        /// TextPointer positioned immediately after the closing tag of 
        /// a <see cref="LineBreak"/> element inserted by this method. 
        /// </returns>
        public TextPointer InsertLineBreak() 
        {
            _tree.EmptyDeadPositionList();
            SyncToTreeGeneration();
 
            TextPointer position;
 
            _tree.BeginChange(); 
            try
            { 
                position = TextRangeEdit.InsertLineBreak(this);
            }
            finally
            { 
                _tree.EndChange();
            } 
 
            return position;
        } 

        /// <summary>
        /// Debug only ToString override.
        /// </summary> 
        public override string ToString()
        { 
            return base.ToString();
        }

        /// <summary> 
        /// Returns true if layout is calculated at the current position. 
        /// </summary>
        /// <remarks> 
        /// Methods that depend on layout -- GetLineStartPosition,
        /// GetCharacterRect, and IsAtLineStartPosition -- will attempt
        /// to re-calculate a dirty layout when called.  Recalculating
        /// layout can be extremely expensive, however, and this method 
        /// lets the caller detect when layout is dirty.
        /// </remarks> 
        // Internal methods that depend on this property: 
        //  - MoveToNextCaretPosition
        //  - MoveToBackspaceCaretPosition 
        public bool HasValidLayout
        {
            get
            { 
                return _tree.TextView == null ? false : _tree.TextView.IsValid && _tree.TextView.Contains(this);
            } 
        } 

        /// <summary> 
        /// Specifies whether the TextPointer is associated with preceding or
        /// following content.
        /// </summary>
        /// <remarks> 
        /// <para>If new content is insert at the TextPointer's current position, it
        /// will move to the edge of the new content that also borders its 
        /// original associated content.</para> 
        /// </remarks>
        public LogicalDirection LogicalDirection 
        {
            get
            {
                return GetGravityInternal(); 
            }
        } 
 
        /// <summary>
        /// Returns the logical parent scoping this TextPointer. 
        /// </summary>
        public DependencyObject Parent
        {
            get 
            {
                _tree.EmptyDeadPositionList(); 
                SyncToTreeGeneration(); 

                return GetLogicalTreeNode(); 
            }
        }

        /// <summary> 
        /// Returns true if this TextPointer is positioned at an insertion
        /// position. 
        /// </summary> 
        /// <remarks>
        /// <para>An "insertion position" is a position where where the containing document 
        /// would normally place the caret.  Examples of positions that are not
        /// insertion positions include spaces between Paragraphs, or between
        /// Unicode surrogate pairs.</para>
        /// </remarks> 
        public bool IsAtInsertionPosition
        { 
            get 
            {
                _tree.EmptyDeadPositionList(); 
                SyncToTreeGeneration();

                return TextPointerBase.IsAtInsertionPosition(this);
            } 
        }
 
        /// <summary> 
        /// Returns true if this TextPointer is positioned at the start of a
        /// line. 
        /// </summary>
        /// <exception cref="System.InvalidOperationException">
        /// Throws an InvalidOperationException if this TextPointer's HasValidLayout
        /// property is set false.  Without a calculated layout it is not possible 
        /// to determine where the current line starts or ends.
        /// </exception> 
        public bool IsAtLineStartPosition 
        { 
            get
            { 
                _tree.EmptyDeadPositionList();
                SyncToTreeGeneration();

                this.ValidateLayout(); 

                if (!this.HasValidLayout) 
                { 
                    return false;
                } 

                TextSegment lineRange = _tree.TextView.GetLineRange(this);

                // Null lineRange if no layout is available. 
                if (!lineRange.IsNull)
                { 
                    TextPointer position = new TextPointer(this); 
                    TextPointerContext backwardContext = position.GetPointerContext(LogicalDirection.Backward);
 
                    // Skip past any formatting.
                    while ((backwardContext == TextPointerContext.ElementStart || backwardContext == TextPointerContext.ElementEnd) &&
                        TextSchema.IsFormattingType(position.GetAdjacentElement(LogicalDirection.Backward).GetType()))
                    { 
                        position.MoveToNextContextPosition(LogicalDirection.Backward);
                        backwardContext = position.GetPointerContext(LogicalDirection.Backward); 
                    } 

                    if (position.CompareTo((TextPointer)lineRange.Start) <= 0) 
                    {
                        return true;
                    }
                } 

                return false; 
            } 
        }
 
        /// <summary>
        /// Returns the paragraph scoping this textpointer
        /// </summary>
        /// <remarks> 
        /// <para>When TextPointer is at insertion position it usually
        /// have non-null paragraph. The only exception is when 
        /// it is positioned at the end of TableRow, where 
        /// there is no scoping paragraph.</para>
        /// <para>When TextPointer is positioned outside of a paragraph, 
        /// the property returns null.</para>
        /// </remarks>
        public Paragraph Paragraph
        { 
            get
            { 
                _tree.EmptyDeadPositionList(); 
                SyncToTreeGeneration();
 
                return this.ParentBlock as Paragraph;
            }
        }
 
        /// <summary>
        /// Returns the paragraph-like parent of the pointer 
        /// </summary> 
        /// <remarks>
        /// If we would have a common base class for Paragraph and BlockUIContainer, 
        /// we would return it here.
        /// </remarks>
        internal Block ParagraphOrBlockUIContainer
        { 
            //
            get 
            { 
                _tree.EmptyDeadPositionList();
                SyncToTreeGeneration(); 

                Block parentBlock = this.ParentBlock;
                return (parentBlock is Paragraph) || (parentBlock is BlockUIContainer) ? parentBlock : null;
            } 
        }
 
        /// <summary> 
        /// The start position of the document's content
        /// </summary> 
        /// <remarks>
        /// <para>This property may be useful as a base for persistent
        /// position indexing - for calculating offsets
        /// to all other pointers.</para> 
        /// <para>The <see cref="TextPointer.Parent"/> property for this
        /// position is not a TextElement - it is a text container, 
        /// which can be one of <see cref="TextBlock"/> or 
        /// <see cref="FlowDocument"/>.</para>
        /// </remarks> 
        public TextPointer DocumentStart
        {
            get
            { 
                return TextContainer.Start;
            } 
        } 

        /// <summary> 
        /// The end position of the document's content.
        /// </summary>
        /// <remarks>
        /// <para>The <see cref="TextPointer.Parent"/> property for this 
        /// position is not a TextElement - it is a text container,
        /// which can be one of <see cref="TextBlock"/> or 
        /// <see cref="FlowDocument"/>.</para> 
        /// </remarks>
        public TextPointer DocumentEnd 
        {
            get
            {
                return TextContainer.End; 
            }
        } 

        // Returns this TextPointer's topmost Inline ancestor, which is not a mergeable (or splittable) Inline element. (e.g. Hyperlink) 
        internal Inline GetNonMergeableInlineAncestor()
        {
            Inline ancestor = this.Parent as Inline;
 
            while (ancestor != null && TextSchema.IsMergeableInline(ancestor.GetType()))
            { 
                ancestor = ancestor.Parent as Inline; 
            }
 
            return ancestor;
        }

        // Returns this TextPointer's closest ListItem ancestor. 
        internal ListItem GetListAncestor()
        { 
            TextElement ancestor = this.Parent as TextElement; 

            while (ancestor != null && !(ancestor is ListItem)) 
            {
                ancestor = ancestor.Parent as TextElement;
            }
 
            return ancestor as ListItem;
        } 
 
        internal static int GetTextInRun(TextContainer textContainer, int symbolOffset, TextTreeTextNode textNode, int nodeOffset, LogicalDirection direction, char[] textBuffer, int startIndex, int count)
        { 
            int skipCount;
            int finalCount;

            if (textBuffer == null) 
            {
                throw new ArgumentNullException("textBuffer"); 
            } 
            if (startIndex < 0)
            { 
                throw new ArgumentException(SR.Get(SRID.NegativeValue, "startIndex"));
            }
            if (startIndex > textBuffer.Length)
            { 
                throw new ArgumentException(SR.Get(SRID.StartIndexExceedsBufferSize, startIndex, textBuffer.Length));
            } 
            if (count < 0) 
            {
                throw new ArgumentException(SR.Get(SRID.NegativeValue, "count")); 
            }
            if (count > textBuffer.Length - startIndex)
            {
                throw new ArgumentException(SR.Get(SRID.MaxLengthExceedsBufferSize, count, textBuffer.Length, startIndex)); 
            }
            Invariant.Assert(textNode != null, "textNode is expected to be non-null"); 
 
            textContainer.EmptyDeadPositionList();
 
            if (nodeOffset < 0)
            {
                skipCount = 0;
            } 
            else
            { 
                skipCount = (direction == LogicalDirection.Forward) ? nodeOffset : textNode.SymbolCount - nodeOffset; 
                symbolOffset += nodeOffset;
            } 
            finalCount = 0;

            // Loop and combine adjacent text nodes into a single run.
            // This isn't just a perf optimization.  Because text positions 
            // split text nodes, if we just returned a single node's text
            // callers would see strange side effects where position.GetTextLength() != 
            // position.GetText() if another position is moved between the calls. 
            while (textNode != null)
            { 
                // Never return more textBuffer than the text following this position in the current text node.
                finalCount += Math.Min(count - finalCount, textNode.SymbolCount - skipCount);
                skipCount = 0;
                if (finalCount == count) 
                    break;
                textNode = ((direction == LogicalDirection.Forward) ? textNode.GetNextNode() : textNode.GetPreviousNode()) as TextTreeTextNode; 
            } 

            // If we're reading backwards, need to fixup symbolOffset to point into the node. 
            if (direction == LogicalDirection.Backward)
            {
                symbolOffset -= finalCount;
            } 

            if (finalCount > 0) // We may not have allocated textContainer.RootTextBlock if no text was ever inserted. 
            { 
                TextTreeText.ReadText(textContainer.RootTextBlock, symbolOffset, finalCount, textBuffer, startIndex);
            } 

            return finalCount;
        }
 
        internal static DependencyObject GetAdjacentElement(TextTreeNode node, ElementEdge edge, LogicalDirection direction)
        { 
            TextTreeNode adjacentNode; 
            DependencyObject element;
 
            adjacentNode = GetAdjacentNode(node, edge, direction);

            if (adjacentNode is TextTreeObjectNode)
            { 
                element = ((TextTreeObjectNode)adjacentNode).EmbeddedElement;
            } 
            else if (adjacentNode is TextTreeTextElementNode) 
            {
                element = ((TextTreeTextElementNode)adjacentNode).TextElement; 
            }
            else
            {
                // We're adjacent to a text node, or have no sibling in the specified direction. 
                element = null;
            } 
 
            return element;
        } 

        /// <summary>
        /// Moves this TextPointer to another TextPointer's position.
        /// </summary> 
        /// <param name="textPosition">
        /// Position to move to. 
        /// </param> 
        /// <exception cref="System.ArgumentException">
        /// Throws an ArgumentException if textPosition is not 
        /// positioned within the same document.
        /// </exception>
        /// <exception cref="System.InvalidOperationException">
        /// Throws an InvalidOperationException if this TextPointer's IsFrozen 
        /// property is set true.  Frozen TextPointers may not be repositioned.
        /// </exception> 
        internal void MoveToPosition(TextPointer textPosition) 
        {
            ValidationHelper.VerifyPosition(_tree, textPosition); 

            VerifyNotFrozen();

            _tree.EmptyDeadPositionList(); 

            SyncToTreeGeneration(); 
            textPosition.SyncToTreeGeneration(); 

            MoveToNode(_tree, textPosition.Node, textPosition.Edge); 
        }

        /// <summary>
        /// Advances this TextPointer to a new position by a specified symbol 
        /// count.
        /// </summary> 
        /// <param name="offset"> 
        /// Number of symbols to advance.  offset may be negative, in which
        /// case the TextPointer is moved backwards. 
        /// </param>
        /// <exception cref="System.InvalidOperationException">
        /// Throws an InvalidOperationException if this TextPointer's IsFrozen
        /// property is set true.  Frozen TextPointers may not be repositioned. 
        /// </exception>
        /// <remarks> 
        /// This method, like all other TextPointer methods, defines a symbol 
        /// as a
        /// - 16 bit Unicode character. 
        /// - TextElement start or end edge.
        /// - UIElement.
        /// - ContentElement other than TextElement.
        /// </remarks> 
        /// <returns>
        /// The number of symbols actually advanced.  The absolute value of the 
        /// count returned may be less than requested if the end of document is 
        /// encountered while advancing.
        /// </returns> 
        internal int MoveByOffset(int offset)
        {
            SplayTreeNode node;
            ElementEdge edge; 
            int symbolOffset;
            int currentOffset; 
 
            VerifyNotFrozen();
 
            _tree.EmptyDeadPositionList();

            SyncToTreeGeneration();
 
            if (offset != 0)
            { 
                currentOffset = GetSymbolOffset(); 
                symbolOffset = unchecked(currentOffset + offset);
 
                if (symbolOffset < 1)
                {
                    if (offset > 0)
                    { 
                        // Rolled past Int32.MaxValue.  Go to end of doc.
                        symbolOffset = _tree.InternalSymbolCount - 1; 
                        offset = symbolOffset - currentOffset; 
                    }
                    else 
                    {
                        // Underflow.  Go to start of doc.
                        offset += (1 - symbolOffset);
                        symbolOffset = 1; 
                    }
                } 
                else if (symbolOffset > _tree.InternalSymbolCount - 1) 
                {
                    // Overflow.  Go to end of doc. 
                    // NB: there's no symmetric check here for rolling under with distance=Int32.MinValue.
                    // Since GetSymbolOffset is always positive, we can't roll-around with a min value.
                    offset -= (symbolOffset - (_tree.InternalSymbolCount - 1));
                    symbolOffset = _tree.InternalSymbolCount - 1; 
                }
 
                _tree.GetNodeAndEdgeAtOffset(symbolOffset, out node, out edge); 
                MoveToNode(_tree, (TextTreeNode)node, edge);
            } 

            return offset;
        }
 
        /// <summary>
        /// Advances this TextPointer to the next symbol in a specified 
        /// direction, or past all following Unicode characters if the 
        /// bordering content is Unicode text.
        /// </summary> 
        /// <param name="direction">
        /// Direction to move.
        /// </param>
        /// <exception cref="System.InvalidOperationException"> 
        /// Throws an InvalidOperationException if this TextPointer's IsFrozen
        /// property is set true.  Frozen TextPointers may not be repositioned. 
        /// </exception> 
        /// <returns>
        /// true if the TextPointer is repositioned, false if the TextPointer 
        /// borders the start or end of the document.
        /// </returns>
        /// <remarks>
        /// If the following symbol is of type EmbeddedElement, ElementStart, 
        /// or ElementEnd (as returned by the GetPointerContext method), then
        /// the TextPointer is advanced by exactly one symbol. 
        /// 
        /// If the following symbol is of type Text, then the TextPointer is
        /// advanced until it passes all following text (ie, until it reaches 
        /// a position with a different return value for GetPointerContext).
        /// The exact symbol count crossed can be calculated in advance by
        /// calling GetTextLength.
        /// 
        /// If there is no following symbol (start or end of the document),
        /// then the method does nothing and returns false. 
        /// </remarks> 
        internal bool MoveToNextContextPosition(LogicalDirection direction)
        { 
            TextTreeNode node;
            ElementEdge edge;
            bool moved;
 
            ValidationHelper.VerifyDirection(direction, "direction");
            VerifyNotFrozen(); 
 
            _tree.EmptyDeadPositionList();
 
            SyncToTreeGeneration();

            if (direction == LogicalDirection.Forward)
            { 
                moved = GetNextNodeAndEdge(out node, out edge);
            } 
            else 
            {
                moved = GetPreviousNodeAndEdge(out node, out edge); 
            }

            if (moved)
            { 
                SetNodeAndEdge(AdjustRefCounts(node, edge, _node, this.Edge), edge);
                DebugAssertGeneration(); 
            } 

            AssertState(); 

            return moved;
        }
 

        /// <summary> 
        /// Moves this TextPointer to the closest insertion position in a 
        /// specified direction. If the pointer is already at insertion point
        /// but there is a non-empty sequence formatting in the given direction, 
        /// then the position moves to the other instance of this insertion
        /// position.
        /// </summary>
        /// <param name="direction"> 
        /// Direction to move.
        /// </param> 
        /// <exception cref="System.InvalidOperationException"> 
        /// Throws an InvalidOperationException if this TextPointer's IsFrozen
        /// property is set true.  Frozen TextPointers may not be repositioned. 
        /// </exception>
        /// <remarks>
        /// An "insertion position" is a position where new content may be added
        /// without breaking any semantic rules of the containing document. 
        ///
        /// In practice, an insertion position is anywhere the containing document 
        /// would normally place the caret.  Examples of positions that are not 
        /// insertion positions include spaces between Paragraphs, or between
        /// Unicode surrogate pairs. 
        /// </remarks>
        /// <returns>
        /// True if the TextPointer is repositioned, false otherwise.
        /// </returns> 
        internal bool MoveToInsertionPosition(LogicalDirection direction)
        { 
            ValidationHelper.VerifyDirection(direction, "direction"); 
            VerifyNotFrozen();
 
            _tree.EmptyDeadPositionList();
            SyncToTreeGeneration();

            return TextPointerBase.MoveToInsertionPosition(this, direction); 
        }
 
        /// <summary> 
        /// Advances this TextPointer in the direction indicated to the following
        /// insertion position. 
        /// </summary>
        /// <param name="direction">
        /// Direction to move.
        /// </param> 
        /// <exception cref="System.InvalidOperationException">
        /// Throws an InvalidOperationException if this TextPointer's IsFrozen 
        /// property is set true.  Frozen TextPointers may not be repositioned. 
        /// </exception>
        /// <remarks> 
        /// An "insertion position" is a position where new content may be added
        /// without breaking any semantic rules of the containing document.
        ///
        /// In practice, an insertion position is anywhere the containing document 
        /// would normally place the caret.  Examples of positions that are not
        /// insertion positions include spaces between Paragraphs, or between 
        /// Unicode surrogate pairs. 
        ///
        /// If the TextPointer is not currently at an insertion position, this 
        /// method will move the TextPointer to the next insertion position in
        /// the indicated direction, just like the MoveToInsertionPosition
        /// method.
        /// 
        /// If the TextPointer is currently at an insertion position, this
        /// method will move the TextPointer to following insertion position, 
        /// if the end of document is not encountered. 
        /// </remarks>
        /// <returns> 
        /// True if the TextPointer is repositioned, false otherwise.
        /// </returns>
        internal bool MoveToNextInsertionPosition(LogicalDirection direction)
        { 
            ValidationHelper.VerifyDirection(direction, "direction");
            VerifyNotFrozen(); 
 
            _tree.EmptyDeadPositionList();
            SyncToTreeGeneration(); 

            return TextPointerBase.MoveToNextInsertionPosition(this, direction);
        }
 
        /// <summary>
        /// Advances this TextPointer to the start of a neighboring line. 
        /// </summary> 
        /// <param name="count">
        /// Offset of the destination line.  Negative values specify preceding 
        /// lines, zero specifies the current line, positive values specify
        /// following lines.
        /// </param>
        /// <exception cref="System.InvalidOperationException"> 
        /// Throws an InvalidOperationException if this TextPointer's IsFrozen
        /// property is set true.  Frozen TextPointers may not be repositioned. 
        /// </exception> 
        /// <returns>
        /// The offset of the line moved to.  This value may be less than 
        /// requested if the beginning or end of document is encountered.
        /// </returns>
        /// <remarks>
        /// If this TextPointer is at an otherwise ambiguous position, exactly 
        /// between two lines, the LogicalDirection property is used to determine
        /// current position.  So a TextPointer with backward LogicalDirection 
        /// is considered to be at the end of line, and calling MoveToLineBoundary(0) 
        /// would reposition it at the start of the preceding line.  Making the
        /// same call with forward LogicalDirection would leave the TextPointer 
        /// positioned where it started -- at the start of the following line.
        /// </remarks>
        internal int MoveToLineBoundary(int count)
        { 
            VerifyNotFrozen();
 
            this.ValidateLayout(); 

            if (!this.HasValidLayout) 
            {
                return 0;
            }
 
            _tree.EmptyDeadPositionList();
            SyncToTreeGeneration(); 
 
            return TextPointerBase.MoveToLineBoundary(this, _tree.TextView, count);
        } 

        /// <summary>
        /// Inserts a UIElement at this TextPointer's position.
        /// </summary> 
        /// <param name="uiElement">
        /// UIElement to insert. 
        /// </param> 
        /// <remarks>
        /// The LogicalDirection property specifies whether this TextPointer 
        /// will be positioned before or after the UIElement.
        /// </remarks>
        /// <exception cref="ArgumentException">
        /// Throws ArgumentException is contentElement is not valid 
        /// according to flow schema.
        /// </exception> 
        internal void InsertUIElement(UIElement uiElement) 
        {
            if (uiElement == null) 
            {
                throw new ArgumentNullException("uiElement");
            }
 
            _tree.EmptyDeadPositionList();
            SyncToTreeGeneration(); 
 
            ValidationHelper.ValidateChild(this, uiElement, "uiElement");
 
            if (!((TextElement)this.Parent).IsEmpty) // the parent may be InlineUIContainer or BlockUIContainer
            {
                throw new InvalidOperationException(SR.Get(SRID.TextSchema_UIElementNotAllowedInThisPosition));
            } 

            _tree.BeginChange(); 
            try 
            {
                _tree.InsertEmbeddedObjectInternal(this, uiElement); 
            }
            finally
            {
                _tree.EndChange(); 
            }
        } 
 
        //
        internal TextElement GetAdjacentElementFromOuterPosition(LogicalDirection direction) 
        {
            TextTreeTextElementNode elementNode;

            _tree.EmptyDeadPositionList(); 
            SyncToTreeGeneration();
 
            elementNode = GetAdjacentTextElementNodeSibling(direction); 
            return (elementNode == null) ? null : elementNode.TextElement;
        } 

        /// <summary>
        /// Sets the logical direction of this textpointer.
        /// </summary> 
        /// <exception cref="InvalidOperationException">
        /// Throws an InvalidOperationException if this TextPointer's Freeze() method has been called. 
        /// </exception> 
        /// <param name="direction"></param>
        internal void SetLogicalDirection(LogicalDirection direction) 
        {
            SplayTreeNode newNode;
            ElementEdge edge;
 
            ValidationHelper.VerifyDirection(direction, "direction");
 
            VerifyNotFrozen(); 

            _tree.EmptyDeadPositionList(); 

            if (GetGravityInternal() != direction)
            {
                SyncToTreeGeneration(); 

                newNode = _node; 
 
                // We need to shift nodes to match the new gravity.
                switch (this.Edge) 
                {
                    case ElementEdge.BeforeStart:
                        newNode = _node.GetPreviousNode();
                        if (newNode != null) 
                        {
                            // Move to the previous sibling. 
                            edge = ElementEdge.AfterEnd; 
                        }
                        else 
                        {
                            // Move to parent inner edge.
                            newNode = _node.GetContainingNode();
                            Invariant.Assert(newNode != null, "Bad tree state: newNode must be non-null (BeforeStart)"); 
                            edge = ElementEdge.AfterStart;
                        } 
                        break; 

                    case ElementEdge.AfterStart: 
                        newNode = _node.GetFirstContainedNode();
                        if (newNode != null)
                        {
                            // Move to first child. 
                            edge = ElementEdge.BeforeStart;
                        } 
                        else 
                        {
                            // Move to opposite edge. 
                            newNode = _node;
                            edge = ElementEdge.BeforeEnd;
                        }
 
                        break;
 
                    case ElementEdge.BeforeEnd: 
                        newNode = _node.GetLastContainedNode();
                        if (newNode != null) 
                        {
                            // Move to last child.
                            edge = ElementEdge.AfterEnd;
                        } 
                        else
                        { 
                            // Move to opposite edge. 
                            newNode = _node;
                            edge = ElementEdge.AfterStart; 
                        }
                        break;

                    case ElementEdge.AfterEnd: 
                        newNode = _node.GetNextNode();
                        if (newNode != null) 
                        { 
                            // Move to the next sibling.
                            edge = ElementEdge.BeforeStart; 
                        }
                        else
                        {
                            // Move to parent inner edge. 
                            newNode = _node.GetContainingNode();
                            Invariant.Assert(newNode != null, "Bad tree state: newNode must be non-null (AfterEnd)"); 
                            edge = ElementEdge.BeforeEnd; 
                        }
                        break; 

                    default:
                        Invariant.Assert(false, "Bad ElementEdge value");
                        edge = this.Edge; 
                        break;
                } 
 
                SetNodeAndEdge(AdjustRefCounts((TextTreeNode)newNode, edge, _node, this.Edge), edge);
                Invariant.Assert(GetGravityInternal() == direction, "Inconsistent position gravity"); 
            }
        }

        /// <summary> 
        /// True if the Freeze method has been called, in which case
        /// this TextPointer is immutable and may not be repositioned. 
        /// </summary> 
        /// <Remarks>
        /// By default, TextPointers are mutable -- they may be 
        /// repositioned with calls to methods like MoveByOffset, and
        /// LogicalDirection may be changed freely.  After Freeze is
        /// called, a TextPointer is locked down -- any attempt to set
        /// LogicalDirection or call repositioning methods will raise an 
        /// InvalidOperationException.
        /// </Remarks> 
        internal bool IsFrozen 
        {
            get 
            {
                _tree.EmptyDeadPositionList();

                return (_flags & (uint)Flags.IsFrozen) == (uint)Flags.IsFrozen; 
            }
        } 
 
        /// <summary>
        /// Makes this TextPointer immutable. 
        /// </summary>
        /// <Remarks>
        /// By default, TextPointers are mutable -- they may be
        /// repositioned with calls to methods like MoveByOffset, and 
        /// LogicalDirection may be changed freely.  After this method is
        /// called, a TextPointer is locked down -- any attempt to set 
        /// LogicalDirection or call repositioning methods will raise an 
        /// InvalidOperationException.
        /// 
        /// The IsFrozen property will return true after this method is called.
        ///
        /// Calling Freeze multiple times has no additional effect.
        /// </Remarks> 
        internal void Freeze()
        { 
            _tree.EmptyDeadPositionList(); 

            SetIsFrozen(); 
        }

        /// <summary>
        /// Returns an immutable TextPointer instance positioned equally to 
        /// this one, with a specified LogicalDirection.
        /// </summary> 
        /// <param name="logicalDirection"> 
        /// LogicalDirection of the returned TextPointer.
        /// </param> 
        /// <remarks>
        /// The TextPointer returned will always have its IsFrozen property set
        /// true.
        /// 
        /// The return value will be a new TextPointer instance unless this
        /// TextPointer is already frozen with a matching LogicalDirection, in 
        /// which case this TextPointer will be returned. 
        /// </remarks>
        internal TextPointer GetFrozenPointer(LogicalDirection logicalDirection) 
        {
            ValidationHelper.VerifyDirection(logicalDirection, "logicalDirection");

            _tree.EmptyDeadPositionList(); 

            return (TextPointer)TextPointerBase.GetFrozenPointer(this, logicalDirection); 
        } 

        void ITextPointer.SetLogicalDirection(LogicalDirection direction) 
        {
            SetLogicalDirection(direction);
        }
 
        int ITextPointer.CompareTo(ITextPointer position)
        { 
            return CompareTo((TextPointer)position); 
        }
 
        int ITextPointer.CompareTo(StaticTextPointer position)
        {
            int offsetThis;
            int offsetPosition; 
            int result;
 
            offsetThis = this.Offset + 1; 
            offsetPosition = TextContainer.GetInternalOffset(position);
 
            if (offsetThis < offsetPosition)
            {
                result = -1;
            } 
            else if (offsetThis > offsetPosition)
            { 
                result = +1; 
            }
            else 
            {
                result = 0;
            }
 
            return result;
        } 
 
        int ITextPointer.GetOffsetToPosition(ITextPointer position)
        { 
            return GetOffsetToPosition((TextPointer)position);
        }

        TextPointerContext ITextPointer.GetPointerContext(LogicalDirection direction) 
        {
            return GetPointerContext(direction); 
        } 

        int ITextPointer.GetTextRunLength(LogicalDirection direction) 
        {
            return GetTextRunLength(direction);
        }
 
        // <see cref="System.Windows.Documents.ITextPointer.GetTextInRun"/>
        string ITextPointer.GetTextInRun(LogicalDirection direction) 
        { 
            return TextPointerBase.GetTextInRun(this, direction);
        } 

        int ITextPointer.GetTextInRun(LogicalDirection direction, char[] textBuffer, int startIndex, int count)
        {
            return GetTextInRun(direction, textBuffer, startIndex, count); 
        }
 
        object ITextPointer.GetAdjacentElement(LogicalDirection direction) 
        {
            return GetAdjacentElement(direction); 
        }

        Type ITextPointer.GetElementType(LogicalDirection direction)
        { 
            DependencyObject element;
 
            ValidationHelper.VerifyDirection(direction, "direction"); 

            _tree.EmptyDeadPositionList(); 

            SyncToTreeGeneration();

            element = GetElement(direction); 

            return element != null ? element.GetType() : null; 
        } 

        bool ITextPointer.HasEqualScope(ITextPointer position) 
        {
            TextTreeNode parent1;
            TextTreeNode parent2;
            TextPointer textPointer; 

            _tree.EmptyDeadPositionList(); 
 
            ValidationHelper.VerifyPosition(_tree, position);
 
            textPointer = (TextPointer)position;

            SyncToTreeGeneration();
            textPointer.SyncToTreeGeneration(); 

            parent1 = GetScopingNode(); 
            parent2 = textPointer.GetScopingNode(); 

            return (parent1 == parent2); 
        }

        // Candidate for replacing MoveToNextContextPosition for immutable TextPointer model
        ITextPointer ITextPointer.GetNextContextPosition(LogicalDirection direction) 
        {
            ITextPointer pointer = ((ITextPointer)this).CreatePointer(); 
            if (pointer.MoveToNextContextPosition(direction)) 
            {
                pointer.Freeze(); 
            }
            else
            {
                pointer = null; 
            }
            return pointer; 
        } 

        // Candidate for replacing MoveToInsertionPosition for immutable TextPointer model 
        ITextPointer ITextPointer.GetInsertionPosition(LogicalDirection direction)
        {
            ITextPointer pointer = ((ITextPointer)this).CreatePointer();
            pointer.MoveToInsertionPosition(direction); 
            pointer.Freeze();
            return pointer; 
        } 

        // Returns the closest insertion position, treating all unicode code points 
        // as valid insertion positions.  A useful performance win over
        // GetNextInsertionPosition when only formatting scopes are important.
        ITextPointer ITextPointer.GetFormatNormalizedPosition(LogicalDirection direction)
        { 
            ITextPointer pointer = ((ITextPointer)this).CreatePointer();
            TextPointerBase.MoveToFormatNormalizedPosition(pointer, direction); 
            pointer.Freeze(); 
            return pointer;
        } 

        // Candidate for replacing MoveToNextInsertionPosition for immutable TextPointer model
        ITextPointer ITextPointer.GetNextInsertionPosition(LogicalDirection direction)
        { 
            ITextPointer pointer = ((ITextPointer)this).CreatePointer();
            if (pointer.MoveToNextInsertionPosition(direction)) 
            { 
                pointer.Freeze();
            } 
            else
            {
                pointer = null;
            } 
            return pointer;
        } 
 
        object ITextPointer.GetValue(DependencyProperty formattingProperty)
        { 
            DependencyObject parent;
            object val;

            if (formattingProperty == null) 
            {
                throw new ArgumentNullException("formattingProperty"); 
            } 

            _tree.EmptyDeadPositionList(); 

            SyncToTreeGeneration();

            parent = GetDependencyParent(); 

            if (parent == null) 
            { 
                val = DependencyProperty.UnsetValue;
            } 
            else
            {
                val = parent.GetValue(formattingProperty);
            } 

            return val; 
        } 

        object ITextPointer.ReadLocalValue(DependencyProperty formattingProperty) 
        {
            TextElement element;

            if (formattingProperty == null) 
            {
                throw new ArgumentNullException("formattingProperty"); 
            } 

            _tree.EmptyDeadPositionList(); 

            SyncToTreeGeneration();

            element = this.Parent as TextElement; 
            if (element == null)
            { 
                throw new InvalidOperationException(SR.Get(SRID.NoScopingElement, "This TextPointer")); 
            }
 
            return element.ReadLocalValue(formattingProperty);
        }

        LocalValueEnumerator ITextPointer.GetLocalValueEnumerator() 
        {
            DependencyObject element; 
 
            _tree.EmptyDeadPositionList();
 
            SyncToTreeGeneration();

            element = this.Parent as TextElement;
            if (element == null) 
            {
                // 
                return (new DependencyObject()).GetLocalValueEnumerator(); 
            }
 
            return element.GetLocalValueEnumerator();
        }

        ITextPointer ITextPointer.CreatePointer() 
        {
            return ((ITextPointer)this).CreatePointer(0, this.LogicalDirection); 
        } 

        StaticTextPointer ITextPointer.CreateStaticPointer() 
        {
            _tree.EmptyDeadPositionList();
            SyncToTreeGeneration();
 
            return new StaticTextPointer(_tree, _node, _node.GetOffsetFromEdge(this.Edge));
        } 
 
        ITextPointer ITextPointer.CreatePointer(int offset)
        { 
            return ((ITextPointer)this).CreatePointer(offset, this.LogicalDirection);
        }

        ITextPointer ITextPointer.CreatePointer(LogicalDirection gravity) 
        {
            return ((ITextPointer)this).CreatePointer(0, gravity); 
        } 

        ITextPointer ITextPointer.CreatePointer(int offset, LogicalDirection gravity) 
        {
            return new TextPointer(this, offset, gravity);
        }
 
        // <see cref="ITextPointer.Freeze"/>
        void ITextPointer.Freeze() 
        { 
            Freeze();
        } 

        ITextPointer ITextPointer.GetFrozenPointer(LogicalDirection logicalDirection)
        {
            return GetFrozenPointer(logicalDirection); 
        }
 
        // Worker for Min, accepts any ITextPointer. 
        bool ITextPointer.MoveToNextContextPosition(LogicalDirection direction)
        { 
            return MoveToNextContextPosition(direction);
        }

        int ITextPointer.MoveByOffset(int offset) 
        {
            return MoveByOffset(offset); 
        } 

        void ITextPointer.MoveToPosition(ITextPointer position) 
        {
            MoveToPosition((TextPointer)position);
        }
 
        void ITextPointer.MoveToElementEdge(ElementEdge edge)
        { 
            MoveToElementEdge(edge); 
        }
 
        internal void MoveToElementEdge(ElementEdge edge)
        {
            TextTreeTextElementNode elementNode;
 
            ValidationHelper.VerifyElementEdge(edge, "edge");
            VerifyNotFrozen(); 
 
            _tree.EmptyDeadPositionList();
 
            SyncToTreeGeneration();

            elementNode = GetScopingNode() as TextTreeTextElementNode;
            if (elementNode == null) 
            {
                throw new InvalidOperationException(SR.Get(SRID.NoScopingElement, "This TextNavigator")); 
            } 

            MoveToNode(_tree, elementNode, edge); 
        }

        // <see cref="TextPointer.MoveToLineBoundary"/>
        int ITextPointer.MoveToLineBoundary(int count) 
        {
            return MoveToLineBoundary(count); 
        } 

        // <see cref="TextPointer.GetCharacterRect"/> 
        Rect ITextPointer.GetCharacterRect(LogicalDirection direction)
        {
            return GetCharacterRect(direction);
        } 

        bool ITextPointer.MoveToInsertionPosition(LogicalDirection direction) 
        { 
            return MoveToInsertionPosition(direction);
        } 

        bool ITextPointer.MoveToNextInsertionPosition(LogicalDirection direction)
        {
            return MoveToNextInsertionPosition(direction); 
        }
 
        // The caret methods are debug only until we actually start to use them. 

        void ITextPointer.InsertTextInRun(string textData)
        {
            this.InsertTextInRun(textData); 
        }
 
        // 

 


        void ITextPointer.DeleteContentToPosition(ITextPointer limit)
        { 
            _tree.BeginChange();
            try 
            { 
                // DeleteContent is clever enough to handle the this > limit case.
                TextRangeEditTables.DeleteContent(this, (TextPointer)limit); 
            }
            finally
            {
                _tree.EndChange(); 
            }
        } 
 
        /// <see cref="ITextPointer.ValidateLayout"/>
        bool ITextPointer.ValidateLayout() 
        {
            return this.ValidateLayout();
        }
 
        /// <see cref="ITextPointer.ValidateLayout"/>
        internal bool ValidateLayout() 
        { 
            return TextPointerBase.ValidateLayout(this, _tree.TextView);
        } 

        // Returns the TextTreeTextNode in the direction indicated bordering
        // a TextPointer, or null if no such node exists.
        internal TextTreeTextNode GetAdjacentTextNodeSibling(LogicalDirection direction) 
        {
            return GetAdjacentSiblingNode(direction) as TextTreeTextNode; 
        } 

        // Returns the TextTreeTextNode in the direction indicated bordering 
        // a TextPointer, or null if no such node exists.
        internal static TextTreeTextNode GetAdjacentTextNodeSibling(TextTreeNode node, ElementEdge edge, LogicalDirection direction)
        {
            return GetAdjacentSiblingNode(node, edge, direction) as TextTreeTextNode; 
        }
 
        // Returns the TextTreeTextNode in the direction indicated bordering 
        // a TextPointer, or null if no such node exists.
        internal TextTreeTextElementNode GetAdjacentTextElementNodeSibling(LogicalDirection direction) 
        {
            return GetAdjacentSiblingNode(direction) as TextTreeTextElementNode;
        }
 
        // Returns the TextTreeTextNode in the direction indicated bordering
        // a TextPointer, or null if no such node exists. 
        internal TextTreeTextElementNode GetAdjacentTextElementNode(LogicalDirection direction) 
        {
            return GetAdjacentNode(direction) as TextTreeTextElementNode; 
        }

        // Returns the sibling node (ie, node in the same scope) in the direction indicated bordering
        // a TextPointer, or null if no such node exists. 
        internal TextTreeNode GetAdjacentSiblingNode(LogicalDirection direction)
        { 
            DebugAssertGeneration(); 

            return GetAdjacentSiblingNode(_node, this.Edge, direction); 
        }

        internal static TextTreeNode GetAdjacentSiblingNode(TextTreeNode node, ElementEdge edge, LogicalDirection direction)
        { 
            SplayTreeNode sibling;
 
            if (direction == LogicalDirection.Forward) 
            {
                switch (edge) 
                {
                    case ElementEdge.BeforeStart:
                        sibling = node;
                        break; 

                    case ElementEdge.AfterStart: 
                        sibling = node.GetFirstContainedNode(); 
                        break;
 
                    case ElementEdge.BeforeEnd:
                    default:
                        sibling = null;
                        break; 

                    case ElementEdge.AfterEnd: 
                        sibling = node.GetNextNode(); 
                        break;
                } 
            }
            else // direction == LogicalDirection.Backward
            {
                switch (edge) 
                {
                    case ElementEdge.BeforeStart: 
                        sibling = node.GetPreviousNode(); 
                        break;
 
                    case ElementEdge.AfterStart:
                    default:
                        sibling = null;
                        break; 

                    case ElementEdge.BeforeEnd: 
                        sibling = node.GetLastContainedNode(); 
                        break;
 
                    case ElementEdge.AfterEnd:
                        sibling = node;
                        break;
                } 
            }
 
            return (TextTreeNode)sibling; 
        }
 
        // Returns the symbol offset within the TextContainer of this Position.
        internal int GetSymbolOffset()
        {
            DebugAssertGeneration(); 

            return GetSymbolOffset(_tree, _node, this.Edge); 
        } 

        // Returns the symbol offset within the TextContainer of this Position. 
        internal static int GetSymbolOffset(TextContainer tree, TextTreeNode node, ElementEdge edge)
        {
            int offset;
 
            switch (edge)
            { 
                case ElementEdge.BeforeStart: 
                    offset = node.GetSymbolOffset(tree.Generation);
                    break; 

                case ElementEdge.AfterStart:
                    offset = node.GetSymbolOffset(tree.Generation) + 1;
                    break; 

                case ElementEdge.BeforeEnd: 
                    offset = node.GetSymbolOffset(tree.Generation) + node.SymbolCount - 1; 
                    break;
 
                case ElementEdge.AfterEnd:
                    offset = node.GetSymbolOffset(tree.Generation) + node.SymbolCount;
                    break;
 
                default:
                    Invariant.Assert(false, "Unknown value for position edge"); 
                    offset = 0; 
                    break;
            } 

            return offset;
        }
 
        // Returns the Logical Tree Node scoping this position.
        internal DependencyObject GetLogicalTreeNode() 
        { 
            DebugAssertGeneration();
 
            return GetScopingNode().GetLogicalTreeNode();
        }

        // Updates the position state if the node referenced by this position has 
        // been removed from the TextContainer.  This method must be called before
        // referencing the position's state when a public entry point is called. 
        internal void SyncToTreeGeneration() 
        {
            SplayTreeNode node; 
            SplayTreeNode searchNode;
            SplayTreeNode parentNode;
            SplayTreeNode splayNode;
            ElementEdge edge; 
            TextTreeFixupNode fixup = null;
 
            // If the tree hasn't had any deletions since the last time we 
            // checked there's no work to do.
            if (_generation == _tree.PositionGeneration) 
                return;

            // Invalidate the caret unit boundary cache -- the surrounding
            // content may have changed. 
            this.IsCaretUnitBoundaryCacheValid = false;
 
            node = _node; 
            edge = this.Edge;
 
            // If we can find a fixup node in the ancestor chain, this position
            // needs to be updated.
            //
            // It's possible to have cascading deletes -- some content was 
            // deleted, then the nodes pointed to by a fixup node were themselves
            // deleted, and so forth.  So we have to keep checking all the 
            // way up to the root. 

            while (true) 
            {
                searchNode = node;
                splayNode = node;
 
                while (true)
                { 
                    parentNode = searchNode.ParentNode; 
                    if (parentNode == null) // The root node is always valid.
                        break; 

                    fixup = parentNode as TextTreeFixupNode;
                    if (fixup != null)
                        break; 

                    if (searchNode.Role == SplayTreeNodeRole.LocalRoot) 
                    { 
                        splayNode.Splay();
                        splayNode = parentNode; 
                    }
                    searchNode = parentNode;
                }
 
                if (parentNode == null)
                    break; // Checked all the way to the root, position is valid. 
 
                // If we make it here we've found a fixup node.  Our gravity
                // tells us which direction to follow it. 
                if (GetGravityInternal() == LogicalDirection.Forward)
                {
                    if (edge == ElementEdge.BeforeStart && fixup.FirstContainedNode != null)
                    { 
                        // We get here if and only if a single TextElementNode was removed.
                        // Because only a single element was removed, we don't have to worry 
                        // about whether the position was originally in some contained content. 
                        // It originally pointed to the extracted node, so we can always
                        // move to contained content. 
                        node = fixup.FirstContainedNode;
                        Invariant.Assert(edge == ElementEdge.BeforeStart, "edge BeforeStart is expected");
                    }
                    else 
                    {
                        node = fixup.NextNode; 
                        edge = fixup.NextEdge; 
                    }
                } 
                else
                {
                    if (edge == ElementEdge.AfterEnd && fixup.LastContainedNode != null)
                    { 
                        // We get here if and only if a single TextElementNode was removed.
                        // Because only a single element was removed, we don't have to worry 
                        // about whether the position was originally in some contained content. 
                        // It originally pointed to the extracted node, so we can always
                        // move to contained content. 
                        node = fixup.LastContainedNode;
                        Invariant.Assert(edge == ElementEdge.AfterEnd, "edge AfterEnd is expected");
                    }
                    else 
                    {
                        node = fixup.PreviousNode; 
                        edge = fixup.PreviousEdge; 
                    }
                } 
            }

            // Note we intentionally don't call AdjustRefCounts here.
            // We already incremented ref counts when the old target 
            // node was deleted.
            SetNodeAndEdge((TextTreeNode)node, edge); 
 
            // Update the position generation, so we don't do this work again
            // until the tree changes. 
            _generation = _tree.PositionGeneration;

            AssertState();
        } 

        // Returns the logical parent node of a text position. 
        internal TextTreeNode GetScopingNode() 
        {
            return GetScopingNode(_node, this.Edge); 
        }

        internal static TextTreeNode GetScopingNode(TextTreeNode node, ElementEdge edge)
        { 
            TextTreeNode scopingNode;
 
            switch (edge) 
            {
                case ElementEdge.BeforeStart: 
                case ElementEdge.AfterEnd:
                    scopingNode = (TextTreeNode)node.GetContainingNode();
                    break;
 
                case ElementEdge.AfterStart:
                case ElementEdge.BeforeEnd: 
                default: 
                    scopingNode = node;
                    break; 
            }

            return scopingNode;
        } 

        // Debug only -- asserts this TextPointer is synchronized to the current tree generation. 
        internal void DebugAssertGeneration() 
        {
            Invariant.Assert(_generation == _tree.PositionGeneration, "TextPointer not synchronized to tree generation!"); 
        }

        internal bool GetNextNodeAndEdge(out TextTreeNode node, out ElementEdge edge)
        { 
            DebugAssertGeneration();
 
            return GetNextNodeAndEdge(_node, this.Edge, _tree.PlainTextOnly, out node, out edge); 
        }
 
        // Finds the next run, returned as a node/edge pair.
        // Returns false if there is no following run, in which case node/edge will match the input position.
        // The returned node/edge pair respects the input position's gravity.
        internal static bool GetNextNodeAndEdge(TextTreeNode sourceNode, ElementEdge sourceEdge, bool plainTextOnly, out TextTreeNode node, out ElementEdge edge) 
        {
            SplayTreeNode currentNode; 
            SplayTreeNode newNode; 
            SplayTreeNode nextNode;
            SplayTreeNode containingNode; 
            bool startedAdjacentToTextNode;
            bool endedAdjacentToTextNode;

            node = sourceNode; 
            edge = sourceEdge;
 
            newNode = node; 
            currentNode = node;
 
            // If we started next to a TextTreeTextNode, and the next node
            // is also a TextTreeTextNode, then skip past the second node
            // as well -- multiple text nodes count as a single Move run.
            do 
            {
                startedAdjacentToTextNode = false; 
                endedAdjacentToTextNode = false; 

                switch (edge) 
                {
                    case ElementEdge.BeforeStart:
                        newNode = currentNode.GetFirstContainedNode();
                        if (newNode != null) 
                        {
                            // Move to inner edge/first child. 
                        } 
                        else if (currentNode is TextTreeTextElementNode)
                        { 
                            // Move to inner edge.
                            newNode = currentNode;
                            edge = ElementEdge.BeforeEnd;
                        } 
                        else
                        { 
                            // Move to next node. 
                            startedAdjacentToTextNode = currentNode is TextTreeTextNode;
                            edge = ElementEdge.BeforeEnd; 
                            goto case ElementEdge.BeforeEnd;
                        }
                        break;
 
                    case ElementEdge.AfterStart:
                        newNode = currentNode.GetFirstContainedNode(); 
                        if (newNode != null) 
                        {
                            // Move to first child/second child or first child/first child child 
                            if (newNode is TextTreeTextElementNode)
                            {
                                edge = ElementEdge.AfterStart;
                            } 
                            else
                            { 
                                startedAdjacentToTextNode = newNode is TextTreeTextNode; 
                                endedAdjacentToTextNode = newNode.GetNextNode() is TextTreeTextNode;
                                edge = ElementEdge.AfterEnd; 
                            }
                        }
                        else if (currentNode is TextTreeTextElementNode)
                        { 
                            // Move to next node.
                            newNode = currentNode; 
                            edge = ElementEdge.AfterEnd; 
                        }
                        else 
                        {
                            Invariant.Assert(currentNode is TextTreeRootNode, "currentNode is expected to be TextTreeRootNode");
                            // This is the root node, leave newNode null.
                        } 
                        break;
 
                    case ElementEdge.BeforeEnd: 
                        newNode = currentNode.GetNextNode();
                        if (newNode != null) 
                        {
                            // Move to next node;
                            endedAdjacentToTextNode = newNode is TextTreeTextNode;
                            edge = ElementEdge.BeforeStart; 
                        }
                        else 
                        { 
                            // Move to inner edge of parent.
                            newNode = currentNode.GetContainingNode(); 
                        }
                        break;

                    case ElementEdge.AfterEnd: 
                        nextNode = currentNode.GetNextNode();
                        startedAdjacentToTextNode = nextNode is TextTreeTextNode; 
 
                        newNode = nextNode;
                        if (newNode != null) 
                        {
                            // Move to next node/first child;
                            if (newNode is TextTreeTextElementNode)
                            { 
                                edge = ElementEdge.AfterStart;
                            } 
                            else 
                            {
                                // Move to next node/next next node. 
                                endedAdjacentToTextNode = newNode.GetNextNode() is TextTreeTextNode;
                            }
                        }
                        else 
                        {
                            containingNode = currentNode.GetContainingNode(); 
 
                            if (!(containingNode is TextTreeRootNode))
                            { 
                                // Move to parent.
                                newNode = containingNode;
                            }
                        } 
                        break;
 
                    default: 
                        Invariant.Assert(false, "Unknown ElementEdge value");
                        break; 
                }

                currentNode = newNode;
 
                // Multiple text nodes count as a single Move run.
                // Instead of iterating through N text nodes, exploit 
                // the fact (when we can) that text nodes are only ever contained in 
                // runs with no other content.  Jump straight to the end.
                if (startedAdjacentToTextNode && endedAdjacentToTextNode && plainTextOnly) 
                {
                    newNode = newNode.GetContainingNode();
                    Invariant.Assert(newNode is TextTreeRootNode);
 
                    if (edge == ElementEdge.BeforeStart)
                    { 
                        edge = ElementEdge.BeforeEnd; 
                    }
                    else 
                    {
                        newNode = newNode.GetLastContainedNode();
                        Invariant.Assert(newNode != null);
                        Invariant.Assert(edge == ElementEdge.AfterEnd); 
                    }
 
                    break; 
                }
            } 
            while (startedAdjacentToTextNode && endedAdjacentToTextNode);

            if (newNode != null)
            { 
                node = (TextTreeNode)newNode;
            } 
 
            return (newNode != null);
        } 

        internal bool GetPreviousNodeAndEdge(out TextTreeNode node, out ElementEdge edge)
        {
            DebugAssertGeneration(); 

            return GetPreviousNodeAndEdge(_node, this.Edge, _tree.PlainTextOnly, out node, out edge); 
        } 

        // Finds the previous run, returned as a node/edge pair. 
        // Returns false if there is no preceding run, in which case node/edge will match the input position.
        // The returned node/edge pair respects the input positon's gravity.
        internal static bool GetPreviousNodeAndEdge(TextTreeNode sourceNode, ElementEdge sourceEdge, bool plainTextOnly, out TextTreeNode node, out ElementEdge edge)
        { 
            SplayTreeNode currentNode;
            SplayTreeNode newNode; 
            SplayTreeNode containingNode; 
            bool startedAdjacentToTextNode;
            bool endedAdjacentToTextNode; 

            node = sourceNode;
            edge = sourceEdge;
 
            newNode = node;
            currentNode = node; 
 
            // If we started next to a TextTreeTextNode, and the next node
            // is also a TextTreeTextNode, then skip past the second node 
            // as well -- multiple text nodes count as a single Move run.
            do
            {
                startedAdjacentToTextNode = false; 
                endedAdjacentToTextNode = false;
 
                switch (edge) 
                {
                    case ElementEdge.BeforeStart: 
                        newNode = currentNode.GetPreviousNode();
                        if (newNode != null)
                        {
                            // Move to next node/last child; 
                            if (newNode is TextTreeTextElementNode)
                            { 
                                // Move to previous node last child/previous node 
                                edge = ElementEdge.BeforeEnd;
                            } 
                            else
                            {
                                // Move to previous previous node/previous node.
                                startedAdjacentToTextNode = newNode is TextTreeTextNode; 
                                endedAdjacentToTextNode = startedAdjacentToTextNode && newNode.GetPreviousNode() is TextTreeTextNode;
                            } 
                        } 
                        else
                        { 
                            containingNode = currentNode.GetContainingNode();

                            if (!(containingNode is TextTreeRootNode))
                            { 
                                // Move to parent.
                                newNode = containingNode; 
                            } 
                        }
                        break; 

                    case ElementEdge.AfterStart:
                        newNode = currentNode.GetPreviousNode();
                        if (newNode != null) 
                        {
                            endedAdjacentToTextNode = newNode is TextTreeTextNode; 
 
                            // Move to previous node;
                            edge = ElementEdge.AfterEnd; 
                        }
                        else
                        {
                            // Move to inner edge of parent. 
                            newNode = currentNode.GetContainingNode();
                        } 
                        break; 

                    case ElementEdge.BeforeEnd: 
                        newNode = currentNode.GetLastContainedNode();
                        if (newNode != null)
                        {
                            // Move to penultimate child/last child or inner edge of last child. 
                            if (newNode is TextTreeTextElementNode)
                            { 
                                edge = ElementEdge.BeforeEnd; 
                            }
                            else 
                            {
                                startedAdjacentToTextNode = newNode is TextTreeTextNode;
                                endedAdjacentToTextNode = startedAdjacentToTextNode && newNode.GetPreviousNode() is TextTreeTextNode;
                                edge = ElementEdge.BeforeStart; 
                            }
                        } 
                        else if (currentNode is TextTreeTextElementNode) 
                        {
                            // Move to next node. 
                            newNode = currentNode;
                            edge = ElementEdge.BeforeStart;
                        }
                        else 
                        {
                            Invariant.Assert(currentNode is TextTreeRootNode, "currentNode is expected to be a TextTreeRootNode"); 
                            // This is the root node, leave newNode null. 
                        }
                        break; 

                    case ElementEdge.AfterEnd:
                        newNode = currentNode.GetLastContainedNode();
                        if (newNode != null) 
                        {
                            // Move to inner edge/last child. 
                        } 
                        else if (currentNode is TextTreeTextElementNode)
                        { 
                            // Move to opposite edge.
                            newNode = currentNode;
                            edge = ElementEdge.AfterStart;
                        } 
                        else
                        { 
                            // Move to previous node. 
                            startedAdjacentToTextNode = currentNode is TextTreeTextNode;
                            edge = ElementEdge.AfterStart; 
                            goto case ElementEdge.AfterStart;
                        }
                        break;
 
                    default:
                        Invariant.Assert(false, "Unknown ElementEdge value"); 
                        break; 
                }
 
                currentNode = newNode;

                // Multiple text nodes count as a single Move run.
                // Instead of iterating through N text nodes, exploit 
                // the fact (when we can) that text nodes are only ever contained in
                // runs with no other content.  Jump straight to the start. 
                if (startedAdjacentToTextNode && endedAdjacentToTextNode && plainTextOnly) 
                {
                    newNode = newNode.GetContainingNode(); 
                    Invariant.Assert(newNode is TextTreeRootNode);

                    if (edge == ElementEdge.AfterEnd)
                    { 
                        edge = ElementEdge.AfterStart;
                    } 
                    else 
                    {
                        newNode = newNode.GetFirstContainedNode(); 
                        Invariant.Assert(newNode != null);
                        Invariant.Assert(edge == ElementEdge.BeforeStart);
                    }
 
                    break;
                } 
            } 
            while (startedAdjacentToTextNode && endedAdjacentToTextNode);
 
            if (newNode != null)
            {
                node = (TextTreeNode)newNode;
            } 

            return (newNode != null); 
        } 

        internal static TextPointerContext GetPointerContextForward(TextTreeNode node, ElementEdge edge) 
        {
            TextTreeNode nextNode;
            TextTreeNode firstContainedNode;
            TextPointerContext symbolType; 

            switch (edge) 
            { 
                case ElementEdge.BeforeStart:
                    symbolType = node.GetPointerContext(LogicalDirection.Forward); 
                    break;

                case ElementEdge.AfterStart:
                    if (node.ContainedNode != null) 
                    {
                        firstContainedNode = (TextTreeNode)node.GetFirstContainedNode(); 
                        symbolType = firstContainedNode.GetPointerContext(LogicalDirection.Forward); 
                    }
                    else 
                    {
                        goto case ElementEdge.BeforeEnd;
                    }
                    break; 

                case ElementEdge.BeforeEnd: 
                    // The root node is special, there's no ElementStart/End, so test for null parent. 
                    Invariant.Assert(node.ParentNode != null || node is TextTreeRootNode, "Inconsistent node.ParentNode");
                    symbolType = (node.ParentNode != null) ? TextPointerContext.ElementEnd : TextPointerContext.None; 
                    break;

                case ElementEdge.AfterEnd:
                    nextNode = (TextTreeNode)node.GetNextNode(); 
                    if (nextNode != null)
                    { 
                        symbolType = nextNode.GetPointerContext(LogicalDirection.Forward); 
                    }
                    else 
                    {
                        // The root node is special, there's no ElementStart/End, so test for null parent.
                        Invariant.Assert(node.GetContainingNode() != null, "Bad position!"); // Illegal to be at root AfterEnd.
                        symbolType = (node.GetContainingNode() is TextTreeRootNode) ? TextPointerContext.None : TextPointerContext.ElementEnd; 
                    }
                    break; 
 
                default:
                    Invariant.Assert(false, "Unreachable code."); 
                    symbolType = TextPointerContext.Text;
                    break;
            }
 
            return symbolType;
        } 
 
        // Returns the symbol type preceding thisPosition.
        internal static TextPointerContext GetPointerContextBackward(TextTreeNode node, ElementEdge edge) 
        {
            TextPointerContext symbolType;
            TextTreeNode previousNode;
            TextTreeNode lastChildNode; 

            switch (edge) 
            { 
                case ElementEdge.BeforeStart:
                    previousNode = (TextTreeNode)node.GetPreviousNode(); 
                    if (previousNode != null)
                    {
                        symbolType = previousNode.GetPointerContext(LogicalDirection.Backward);
                    } 
                    else
                    { 
                        // The root node is special, there's no ElementStart/End, so test for null parent. 
                        Invariant.Assert(node.GetContainingNode() != null, "Bad position!"); // Illegal to be at root BeforeStart.
                        symbolType = (node.GetContainingNode() is TextTreeRootNode) ? TextPointerContext.None : TextPointerContext.ElementStart; 
                    }
                    break;

                case ElementEdge.AfterStart: 
                    // The root node is special, there's no ElementStart/End, so test for null parent.
                    Invariant.Assert(node.ParentNode != null || node is TextTreeRootNode, "Inconsistent node.ParentNode"); 
                    symbolType = (node.ParentNode != null) ? TextPointerContext.ElementStart : TextPointerContext.None; 
                    break;
 
                case ElementEdge.BeforeEnd:
                    lastChildNode = (TextTreeNode)node.GetLastContainedNode();
                    if (lastChildNode != null)
                    { 
                        symbolType = lastChildNode.GetPointerContext(LogicalDirection.Backward);
                    } 
                    else 
                    {
                        goto case ElementEdge.AfterStart; 
                    }
                    break;

                case ElementEdge.AfterEnd: 
                    symbolType = node.GetPointerContext(LogicalDirection.Backward);
                    break; 
 
                default:
                    Invariant.Assert(false, "Unknown ElementEdge value"); 
                    symbolType = TextPointerContext.Text;
                    break;
            }
 
            return symbolType;
        } 
 
        // Inserts an Inline at the current location, adding contextual
        // elements as needed to enforce the schema. 
        internal void InsertInline(Inline inline)
        {
            TextPointer position = this;
 
            // Check for hyperlink schema validity first -- we'll throw on an illegal Hyperlink descendent insert.
            bool isValidChild = TextSchema.ValidateChild(position, /*childType*/inline.GetType(), false /* throwIfIllegalChild */, true /* throwIfIllegalHyperlinkDescendent */); 
 
            // Now, it is safe to assume that !isValidChild will be the case of incomplete content.
            if (!isValidChild) 
            {
                if (position.Parent == null)
                {
                    // 
                    throw new InvalidOperationException(SR.Get(SRID.TextSchema_CannotInsertContentInThisPosition));
                } 
 
                // Ensure text content.
                position = TextRangeEditTables.EnsureInsertionPosition(this); 
                Invariant.Assert(position.Parent is Run, "EnsureInsertionPosition() must return a position in text content");
                Run run = (Run)position.Parent;

                if (run.IsEmpty) 
                {
                    // Remove the implicit (empty) Run, since we are going to insert an inline at this position. 
                    run.RepositionWithContent(null); 
                }
                else 
                {
                    // Position is parented by Run, split formatting elements to prepare for inserting inline at this position.
                    position = TextRangeEdit.SplitFormattingElement(position, /*keepEmptyFormatting:*/false);
                } 

                Invariant.Assert(TextSchema.IsValidChild(position, /*childType*/inline.GetType())); 
            } 

            inline.RepositionWithContent(position); 
        }

        // Helper that returns a DependencyObject which is a common ancestor of two pointers.
        internal static DependencyObject GetCommonAncestor(TextPointer position1, TextPointer position2) 
        {
            TextElement element1 = position1.Parent as TextElement; 
            TextElement element2 = position2.Parent as TextElement; 

            DependencyObject commonAncestor; 

            if (element1 == null)
            {
                commonAncestor = position1.Parent; 
            }
            else if (element2 == null) 
            { 
                commonAncestor = position2.Parent;
            } 
            else
            {
                commonAncestor = TextElement.GetCommonAncestor(element1, element2);
            } 

            return commonAncestor; 
        } 
 
        // <see cref="System.Windows.Documents.ITextPointer.ParentType"/>
        Type ITextPointer.ParentType
        {
            get 
            {
                _tree.EmptyDeadPositionList(); 
 
                SyncToTreeGeneration();
 
                DependencyObject element = this.Parent;

                return element != null ? element.GetType() : null;
            } 
        }
 
        /// <summary> 
        ///  Returns the TextContainer that this TextPointer is a part of.
        /// </summary> 
        ITextContainer ITextPointer.TextContainer
        {
            get
            { 
                return this.TextContainer;
            } 
        } 

        // <see cref="TextPointer.HasValidLayout"/> 
        bool ITextPointer.HasValidLayout
        {
            get
            { 
                return this.HasValidLayout;
            } 
        } 

        // <see cref="ITextPointer.IsAtCaretUnitBoundary"/> 
        bool ITextPointer.IsAtCaretUnitBoundary
        {
            get
            { 
                _tree.EmptyDeadPositionList();
                SyncToTreeGeneration(); // NB: this call might set this.IsCaretUnitBoundaryCacheValid == false. 
 
                this.ValidateLayout();
                if (!this.HasValidLayout) 
                {
                    return false;
                }
 
                if (_layoutGeneration != _tree.LayoutGeneration)
                { 
                    this.IsCaretUnitBoundaryCacheValid = false; 
                }
 
                if (!this.IsCaretUnitBoundaryCacheValid)
                {
                    this.CaretUnitBoundaryCache = _tree.IsAtCaretUnitBoundary(this);
                    _layoutGeneration = _tree.LayoutGeneration; 
                    this.IsCaretUnitBoundaryCacheValid = true;
                } 
 
                return this.CaretUnitBoundaryCache;
            } 
        }

        LogicalDirection ITextPointer.LogicalDirection
        { 
            get
            { 
                return this.LogicalDirection; 
            }
 
            /*
            set
            {
                this.LogicalDirection = value; 
            }
            */ 
        } 

        bool ITextPointer.IsAtInsertionPosition 
        {
            get { return this.IsAtInsertionPosition; }
        }
 
        // <see cref="TextPointer.IsFrozen"/>
        bool ITextPointer.IsFrozen 
        { 
            get
            { 
                return this.IsFrozen;
            }
        }
 
        // <see cref="ITextPointer.Offset"/>
        int ITextPointer.Offset 
        { 
            get
            { 
                return this.Offset;
            }
        }
 
        // <see cref="ITextPointer.Offset"/>
        internal int Offset 
        { 
            get
            { 
                _tree.EmptyDeadPositionList();
                SyncToTreeGeneration();

                return GetSymbolOffset() - 1; 
            }
        } 
 
        // Offset in unicode chars within the document.
        int ITextPointer.CharOffset 
        {
            get
            {
                return this.CharOffset; 
            }
        } 
 
        // Offset in unicode chars within the document.
        internal int CharOffset 
        {
            get
            {
                TextTreeTextElementNode elementNode; 

                _tree.EmptyDeadPositionList(); 
                SyncToTreeGeneration(); 

                int charOffset; 

                switch (this.Edge)
                {
                    case ElementEdge.BeforeStart: 
                        charOffset = _node.GetIMECharOffset();
                        break; 
 
                    case ElementEdge.AfterStart:
                        charOffset = _node.GetIMECharOffset(); 

                        elementNode = _node as TextTreeTextElementNode;
                        if (elementNode != null)
                        { 
                            charOffset += elementNode.IMELeftEdgeCharCount;
                        } 
                        break; 

                    case ElementEdge.BeforeEnd: 
                    case ElementEdge.AfterEnd:
                        charOffset = _node.GetIMECharOffset() + _node.IMECharCount;
                        break;
 
                    default:
                        Invariant.Assert(false, "Unknown value for position edge"); 
                        charOffset = 0; 
                        break;
                } 

                return charOffset;
            }
        } 

        /// <summary> 
        ///  Returns the TextContainer that this TextPointer is a part of. 
        /// </summary>
        internal TextContainer TextContainer 
        {
            get
            {
                return _tree; 
            }
        } 
 
        /// <summary>
        /// A FrameworkElement owning a TextContainer to which this TextPointer belongs. 
        /// </summary>
        internal FrameworkElement ContainingFrameworkElement
        {
            get 
            {
                return ((FrameworkElement)_tree.Parent); 
            } 
        }
 
        // Position at row end (immediately before Row closing tag) is a valid stopper for a caret.
        // Editing operations are restricted here (e.g. typing should automatically jump
        // to the following character position.
        // This property identifies such special position. 
        internal bool IsAtRowEnd
        { 
            get 
            {
                return TextPointerBase.IsAtRowEnd(this); 
            }
        }

        // Indicates if this TextPointer has an ancestor that is not a mergeable (or splittable) Inline element. (e.g. Hyperlink) 
        internal bool HasNonMergeableInlineAncestor 
        {
            get 
            {
                Inline ancestor = this.GetNonMergeableInlineAncestor();

                return ancestor != null; 
            }
        } 
 
        // Returns true if position is at the start boundary of a non-mergeable inline ancestor (hyperlink)
        internal bool IsAtNonMergeableInlineStart 
        {
            get
            {
                return TextPointerBase.IsAtNonMergeableInlineStart(this); 
            }
        } 
 
        // The node referenced by this position.
        internal TextTreeNode Node 
        {
            get
            {
                return _node; 
            }
        } 
 
        // The edge referenced by this position.
        internal ElementEdge Edge 
        {
            get
            {
                return (ElementEdge)(_flags & (uint)Flags.EdgeMask); 
            }
        } 
 
        // Returns the Block parenting this TextPointer, or null if none exists.
        internal Block ParentBlock 
        {
            get
            {
                _tree.EmptyDeadPositionList(); 
                SyncToTreeGeneration();
 
                DependencyObject parentBlock = this.Parent; 

                while (parentBlock is Inline && !(parentBlock is AnchoredBlock)) 
                {
                    parentBlock = ((Inline)parentBlock).Parent;
                }
 
                return parentBlock as Block;
            } 
        } 
 
        // Called by the TextPointer ctor.  Initializes this instance.
        private void InitializeOffset(TextPointer position, int distance, LogicalDirection direction)
        {
            SplayTreeNode node; 
            ElementEdge edge;
            int offset; 
            bool isCaretUnitBoundaryCacheValid; 

            // We MUST [....] to the current tree, otherwise we could addref 
            // an orphaned node, resulting in a future unmatched release...
            // Ref counts on orphaned nodes are only considered at the time
            // of removal, not afterwards.
            position.SyncToTreeGeneration(); 

            if (distance != 0) 
            { 
                offset = position.GetSymbolOffset() + distance;
                if (offset < 1 || offset > position.TextContainer.InternalSymbolCount - 1) 
                {
                    throw new ArgumentException(SR.Get(SRID.BadDistance));
                }
 
                position.TextContainer.GetNodeAndEdgeAtOffset(offset, out node, out edge);
 
                isCaretUnitBoundaryCacheValid = false; 
            }
            else 
            {
                node = position.Node;
                edge = position.Edge;
                isCaretUnitBoundaryCacheValid = position.IsCaretUnitBoundaryCacheValid; 
            }
 
            Initialize(position.TextContainer, (TextTreeNode)node, edge, direction, position.TextContainer.PositionGeneration, 
                position.CaretUnitBoundaryCache, isCaretUnitBoundaryCacheValid, position._layoutGeneration);
        } 

        // Called by the TextPointer ctor.  Initializes this instance.
        private void Initialize(TextContainer tree, TextTreeNode node, ElementEdge edge, LogicalDirection gravity, uint generation,
            bool caretUnitBoundaryCache, bool isCaretUnitBoundaryCacheValid, uint layoutGeneration) 
        {
            _tree = tree; 
 
            // Fixup of the target node based on gravity.
            // Positions always cling to a node edge that matches their gravity, 
            // so that insert ops never affect the position.
            RepositionForGravity(ref node, ref edge, gravity);

            SetNodeAndEdge(node.IncrementReferenceCount(edge), edge); 
            _generation = generation;
 
            this.CaretUnitBoundaryCache = caretUnitBoundaryCache; 
            this.IsCaretUnitBoundaryCacheValid = isCaretUnitBoundaryCacheValid;
            _layoutGeneration = layoutGeneration; 

            VerifyFlags();
            tree.AssertTree();
            AssertState(); 
        }
 
        // Throws an exception if this TextPointer is frozen. 
        private void VerifyNotFrozen()
        { 
            if (this.IsFrozen)
            {
                throw new InvalidOperationException(SR.Get(SRID.TextPositionIsFrozen));
            } 
        }
 
        // Inc/decs the position ref counts on TextTreeTextNodes as the navigator 
        // is repositioned.
        // If the new ref is to a TextTreeTextNode, the node may be split. 
        // Returns the actual node referenced, which will always be newNode,
        // unless newNode is a TextTreeTextNode that gets split.  The caller
        // should use the returned node to position navigators.
        private TextTreeNode AdjustRefCounts(TextTreeNode newNode, ElementEdge newNodeEdge, TextTreeNode oldNode, ElementEdge oldNodeEdge) 
        {
            TextTreeNode node; 
 
            // This test should walk the tree upwards to catch all errors...probably not worth the slowdown though.
            Invariant.Assert(oldNode.ParentNode == null || oldNode.IsChildOfNode(oldNode.ParentNode), "Trying to add ref a dead node!"); 
            Invariant.Assert(newNode.ParentNode == null || newNode.IsChildOfNode(newNode.ParentNode), "Trying to add ref a dead node!");

            node = newNode;
 
            if (newNode != oldNode || newNodeEdge != oldNodeEdge)
            { 
                node = newNode.IncrementReferenceCount(newNodeEdge); 
                oldNode.DecrementReferenceCount(oldNodeEdge);
            } 

            return node;
        }
 
        // For any logical position (location between two symbols) there are two
        // possible node/edge pairs.  This method choses the pair that fits a 
        // specified gravity, such that future inserts won't require that a text 
        // position be moved, based on its gravity, at the node/edge pair.
        private static void RepositionForGravity(ref TextTreeNode node, ref ElementEdge edge, LogicalDirection gravity) 
        {
            SplayTreeNode newNode;
            ElementEdge newEdge;
 
            newNode = node;
            newEdge = edge; 
 
            switch (edge)
            { 
                case ElementEdge.BeforeStart:
                    if (gravity == LogicalDirection.Backward)
                    {
                        newNode = node.GetPreviousNode(); 
                        newEdge = ElementEdge.AfterEnd;
                        if (newNode == null) 
                        { 
                            newNode = node.GetContainingNode();
                            newEdge = ElementEdge.AfterStart; 
                        }
                    }
                    break;
 
                case ElementEdge.AfterStart:
                    if (gravity == LogicalDirection.Forward) 
                    { 
                        newNode = node.GetFirstContainedNode();
                        newEdge = ElementEdge.BeforeStart; 
                        if (newNode == null)
                        {
                            newNode = node;
                            newEdge = ElementEdge.BeforeEnd; 
                        }
                    } 
                    break; 

                case ElementEdge.BeforeEnd: 
                    if (gravity == LogicalDirection.Backward)
                    {
                        newNode = node.GetLastContainedNode();
                        newEdge = ElementEdge.AfterEnd; 
                        if (newNode == null)
                        { 
                            newNode = node; 
                            newEdge = ElementEdge.AfterStart;
                        } 
                    }
                    break;

                case ElementEdge.AfterEnd: 
                    if (gravity == LogicalDirection.Forward)
                    { 
                        newNode = node.GetNextNode(); 
                        newEdge = ElementEdge.BeforeStart;
                        if (newNode == null) 
                        {
                            newNode = node.GetContainingNode();
                            newEdge = ElementEdge.BeforeEnd;
                        } 
                    }
                    break; 
            } 

            node = (TextTreeNode)newNode; 
            edge = newEdge;
        }

        // Worker for GetGravity.  No parameter validation. 
        private LogicalDirection GetGravityInternal()
        { 
            return (this.Edge == ElementEdge.BeforeStart || this.Edge == ElementEdge.BeforeEnd) ? LogicalDirection.Forward : LogicalDirection.Backward; 
        }
 
        // Returns the DependencyObject scoping this position.
        private DependencyObject GetDependencyParent()
        {
            DebugAssertGeneration(); 

            return GetScopingNode().GetDependencyParent(); 
        } 

        // Returns the node in the direction indicated bordering 
        // a TextPointer, or null if no such node exists.
        internal TextTreeNode GetAdjacentNode(LogicalDirection direction)
        {
            return GetAdjacentNode(_node, this.Edge, direction); 
        }
 
        internal static TextTreeNode GetAdjacentNode(TextTreeNode node, ElementEdge edge, LogicalDirection direction) 
        {
            TextTreeNode adjacentNode; 

            adjacentNode = GetAdjacentSiblingNode(node, edge, direction);

            if (adjacentNode == null) 
            {
                // We're the first or last child, try the parent. 
                if (edge == ElementEdge.AfterStart || edge == ElementEdge.BeforeEnd) 
                {
                    adjacentNode = node; 
                }
                else
                {
                    adjacentNode = (TextTreeNode)node.GetContainingNode(); 
                }
            } 
 
            return adjacentNode;
        } 

        // Positions this navigator at a node/edge pair.
        // Node/edge are adjusted based on the current gravity.
        private void MoveToNode(TextContainer tree, TextTreeNode node, ElementEdge edge) 
        {
            RepositionForGravity(ref node, ref edge, GetGravityInternal()); 
 
            _tree = tree;
            SetNodeAndEdge(AdjustRefCounts(node, edge, _node, this.Edge), edge); 
            _generation = tree.PositionGeneration;
        }

        /// <summary> 
        /// Returns the text element whose edge is in a specified direction
        /// from position. 
        /// </summary> 
        /// <returns>
        /// If the symbol in the specified direction is 
        /// TextPointerContext.ElementStart or TextPointerContext.ElementEnd, then this
        /// method will return the element whose edge preceeds this TextPointer.
        ///
        /// Otherwise, the method returns null. 
        /// </returns>
        private TextElement GetElement(LogicalDirection direction) 
        { 
            TextTreeTextElementNode elementNode;
 
            DebugAssertGeneration();

            elementNode = GetAdjacentTextElementNode(direction);
 
            return (elementNode == null) ? null : elementNode.TextElement;
        } 
 
        // Invariant.Strict only.  Asserts this position has good state.
        private void AssertState() 
        {
            if (Invariant.Strict)
            {
                // Positions must never have a null tree pointer. 
                Invariant.Assert(_node != null, "Null position node!");
 
                if (GetGravityInternal() == LogicalDirection.Forward) 
                {
                    // Positions with forward gravity must stay at left edges, otherwise inserts could displace them. 
                    Invariant.Assert(this.Edge == ElementEdge.BeforeStart || this.Edge == ElementEdge.BeforeEnd, "Bad position edge/gravity pair! (1)");
                }
                else
                { 
                    // Positions with backward gravity must stay at right edges, otherwise inserts could displace them.
                    Invariant.Assert(this.Edge == ElementEdge.AfterStart || this.Edge == ElementEdge.AfterEnd, "Bad position edge/gravity pair! (2)"); 
                } 

                if (_node is TextTreeRootNode) 
                {
                    // Positions may never be at the outer edge of the root node, since you can't insert content there.
                    Invariant.Assert(this.Edge != ElementEdge.BeforeStart && this.Edge != ElementEdge.AfterEnd, "Position at outer edge of root!");
                } 
                else if (_node is TextTreeTextNode || _node is TextTreeObjectNode)
                { 
                    // Text and object nodes have no inner edges/chilren, so you can't put a position there. 
                    Invariant.Assert(this.Edge != ElementEdge.AfterStart && this.Edge != ElementEdge.BeforeEnd, "Position at inner leaf node edge!");
                } 
                else
                {
                    // Add new asserts for new node types here.
                    Invariant.Assert(_node is TextTreeTextElementNode, "Unknown node type!"); 
                }
 
                Invariant.Assert(_tree != null, "Position has no tree!"); 

            }
        } 

 
        // Repositions the TextPointer and clears any relevant caches. 
        private void SetNodeAndEdge(TextTreeNode node, ElementEdge edge)
        { 
            Invariant.Assert(edge == ElementEdge.BeforeStart ||
                             edge == ElementEdge.AfterStart ||
                             edge == ElementEdge.BeforeEnd ||
                             edge == ElementEdge.AfterEnd); 

            _node = node; 
            _flags = (_flags & ~(uint)Flags.EdgeMask) | (uint)edge; 
            VerifyFlags();
 
            // Always clear the caret unit boundary cache when we move to a new position.
            this.IsCaretUnitBoundaryCacheValid = false;
        }
 
        // Setter for the public IsFrozen property.
        private void SetIsFrozen() 
        { 
            _flags |= (uint)Flags.IsFrozen;
            VerifyFlags(); 
        }

        // Ensure we have a valid _flags field.
        // See bug 1249258. 
        private void VerifyFlags()
        { 
            ElementEdge edge = (ElementEdge)(_flags & (uint)Flags.EdgeMask); 

            Invariant.Assert(edge == ElementEdge.BeforeStart || 
                             edge == ElementEdge.AfterStart ||
                             edge == ElementEdge.BeforeEnd ||
                             edge == ElementEdge.AfterEnd);
        } 

 
        // True when the CaretUnitBoundaryCache is ready for use.
        // If false the cache is not reliable. 
        private bool IsCaretUnitBoundaryCacheValid
        {
            get
            { 
                return (_flags & (uint)Flags.IsCaretUnitBoundaryCacheValid) == (uint)Flags.IsCaretUnitBoundaryCacheValid;
            } 
 
            set
            { 
                _flags = (_flags & ~(uint)Flags.IsCaretUnitBoundaryCacheValid) | (value ? (uint)Flags.IsCaretUnitBoundaryCacheValid : 0);
                VerifyFlags();
            }
        } 

        // Cached value from this.TextContainer.TextView.IsAtCaretUnitBoundary. 
        private bool CaretUnitBoundaryCache 
        {
            get 
            {
                return (_flags & (uint)Flags.CaretUnitBoundaryCache) == (uint)Flags.CaretUnitBoundaryCache;
            }
 
            set
            { 
                _flags = (_flags & ~(uint)Flags.CaretUnitBoundaryCache) | (value ? (uint)Flags.CaretUnitBoundaryCache : 0); 
                VerifyFlags();
            } 
        }

        // The position's TextContainer. 
        private TextContainer _tree;
 
        // The node referenced by this position. 
        private TextTreeNode _node;
 
        // The value of TextContainer.PositionGeneration the last time this position
        // called SyncToTreeGeneration.
        private uint _generation;
 
        // The value of TextContainer.LayoutGeneration the last time
        // this position queried ITextView.IsAtCaretUnitBoundary. 
        private uint _layoutGeneration; 

        // Bitfield used by Edge, IsFrozen, IsCaretUnitBoundaryCacheValid, and 
        // CaretUnitBoundaryCache properties.
        private uint _flags;


