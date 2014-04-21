package org.summer.view.widget.documents;
// All TextContainers contain a single TextTreeRootNode, which contains all other
    // nodes.  The root node is special because it contains tree-global data, 
    // and TextPositions may never reference its BeforeStart/AfterEnd edges.
    // Because of the restrictions on TextPointer, the root node may never 
    // be removed from the tree. 
    /*internal*/ public class TextTreeRootNode extends TextTreeNode
    { 
        //-----------------------------------------------------
        //
        //  Constructors
        // 
        //-----------------------------------------------------
 
//        #region Constructors 

        // Creates a TextTreeRootNode instance. 
        /*internal*/ public TextTreeRootNode(TextContainer tree)
        {
            _tree = tree;
//#if REFCOUNT_DEAD_TEXTPOINTERS 
//            _deadPositionList = new ArrayList(0);
//#endif // REFCOUNT_DEAD_TEXTPOINTERS 
 
            // Root node has two imaginary element edges to match TextElementNode semantics.
            _symbolCount = 2; 

            // CaretUnitBoundaryCache always starts unset.
            _caretUnitBoundaryCacheOffset = -1;
        } 

//        #endregion Constructors 
 
        //------------------------------------------------------
        // 
        //  Public Methods
        //
        //-----------------------------------------------------
 
//        #region Public Methods
 
//#if DEBUG 
//        // Debug-only ToString /*override*/.
//        public /*override*/ string ToString() 
//        {
//            return ("RootNode Id=" + this.DebugId + " SymbolCount=" + _symbolCount);
//        }
//#endif // DEBUG 

//        #endregion Public Methods 
 
        //------------------------------------------------------
        // 
        //  Internal Methods
        //
        //------------------------------------------------------
 
//        #region Internal Methods
 
        // Returns a shallow copy of this node. 
        // This should never be called for the root node, since it is never
        // involved in delete operations. 
        /*internal*/ public /*override*/ TextTreeNode Clone()
        {
//            Invariant.Assert(false, "Unexpected call to TextTreeRootNode.Clone!");
            return null; 
        }
 
        // Returns the TextPointerContext of the node. 
        // If node is TextTreeTextElementNode, this method returns ElementStart
        // if direction == Forward, otherwise ElementEnd if direction == Backward. 
        /*internal*/ public /*override*/ TextPointerContext GetPointerContext(LogicalDirection direction)
        {
            // End-of-tree is "None".
            return TextPointerContext.None; 
        }
 
//        #endregion Internal methods 

        //----------------------------------------------------- 
        //
        //  Internal Properties
        //
        //------------------------------------------------------ 

//        #region Internal Properties 
 
        // The root node never has a parent node.
        /*internal*/ public /*override*/ SplayTreeNode ParentNode 
        {
            get
            {
                return null; 
            }
 
            set 
            {
                Invariant.Assert(false, "Can't set ParentNode on TextContainer root!"); 
            }
        }

        // Root node of a contained tree, if any. 
        /*internal*/ public /*override*/ SplayTreeNode ContainedNode
        { 
            get 
            {
                return _containedNode; 
            }

            set
            { 
                _containedNode = (TextTreeNode)value;
            } 
        } 

        // The root node never has sibling nodes, so the LeftSymbolCount is a 
        // constant zero.
        /*internal*/ public /*override*/ int LeftSymbolCount
        {
            get 
            {
                return 0; 
            } 

            set 
            {
                Invariant.Assert(false, "TextContainer root is never a sibling!");
            }
        } 

        // The root node never has sibling nodes, so the LeftCharCount is a 
        // constant zero. 
        /*internal*/ public /*override*/ int LeftCharCount
        { 
            get
            {
                return 0;
            } 

            set 
            { 
                Invariant.Assert(false, "TextContainer root is never a sibling!");
            } 
        }

        // The root node never has siblings, so it never has child nodes.
        /*internal*/ public /*override*/ SplayTreeNode LeftChildNode 
        {
            get 
            { 
                return null;
            } 

            set
            {
                Invariant.Assert(false, "TextContainer root never has sibling nodes!"); 
            }
        } 
 
        // The root node never has siblings, so it never has child nodes.
        /*internal*/ public /*override*/ SplayTreeNode RightChildNode 
        {
            get
            {
                return null; 
            }
 
            set 
            {
                Invariant.Assert(false, "TextContainer root never has sibling nodes!"); 
            }
        }

        // The tree generation.  Incremented whenever the tree content changes. 
        /*internal*/ public /*override*/ int Generation
        { 
            get 
            {
                return _generation; 
            }

            set
            { 
                _generation = value;
            } 
        } 

        // Like the Generation property, but this counter is only updated when 
        // an edit that might affect TextPositions occurs.  In practice, inserts
        // do not bother TextPositions, but deletions do.
        /*internal*/ public int PositionGeneration
        { 
            get
            { 
                return _positionGeneration; 
            }
 
            set
            {
                _positionGeneration = value;
            } 
        }
 
        // Incremeneted whenever a layout property value changes on a TextElement. 
        /*internal*/ public int LayoutGeneration
        { 
            get
            {
                return _layoutGeneration;
            } 

            set 
            { 
                _layoutGeneration = value;
 
                // Invalidate the caret unit boundary cache on layout update.
                _caretUnitBoundaryCacheOffset = -1;
            }
        } 

        // Cached symbol offset.  The root node is always at offset zero. 
        /*internal*/ public /*override*/ int SymbolOffsetCache 
        {
            get 
            {
                return 0;
            }
 
            set
            { 
                Invariant.Assert(value == 0, "Bad SymbolOffsetCache on TextContainer root!"); 
            }
        } 

        // The count of all symbols in the tree, including two edge symbols for
        // the root node itself.
        /*internal*/ public /*override*/ int SymbolCount 
        {
            get 
            { 
                return _symbolCount;
            } 

            set
            {
                Invariant.Assert(value >= 2, "Bad _symbolCount on TextContainer root!"); 
                _symbolCount = value;
            } 
        } 

        // The count of all chars in the tree. 
        /*internal*/ public /*override*/ int IMECharCount
        {
            get
            { 
                return _imeCharCount;
            } 
 
            set
            { 
                Invariant.Assert(value >= 0, "IMECharCount may never be negative!");
                _imeCharCount = value;
            }
        } 

        // Count of TextPositions referencing the node's BeforeStart 
        // edge.  We don't bother to actually track this for the root node 
        // since it is only useful in delete operations and the root node
        // is never deleted. 
        /*internal*/ public /*override*/ boolean BeforeStartReferenceCount
        {
            get
            { 
                return false;
            } 
 
            set
            { 
                Invariant.Assert(!value, "Root node BeforeStart edge can never be referenced!");
            }
        }
 
        // Count of TextPositions referencing the node's AfterStart
        // edge.  We don't bother to actually track this for the root node 
        // since it is only useful in delete operations and the root node 
        // is never deleted.
        /*internal*/ public /*override*/ boolean AfterStartReferenceCount 
        {
            get
            {
                return false; 
            }
 
            set 
            {
                // We can ignore the value because the TextContainer root is never removed. 
            }
        }

        // Count of TextPositions referencing the node's BeforeEnd 
        // edge.  We don't bother to actually track this for the root node
        // since it is only useful in delete operations and the root node 
        // is never deleted. 
        /*internal*/ public /*override*/ boolean BeforeEndReferenceCount
        { 
            get
            {
                return false;
            } 

            set 
            { 
                // We can ignore the value because the TextContainer root is never removed.
            } 
        }

        // Count of TextPositions referencing the node's AfterEnd
        // edge.  We don't bother to actually track this for the root node 
        // since it is only useful in delete operations and the root node
        // is never deleted. 
        /*internal*/ public /*override*/ boolean AfterEndReferenceCount 
        {
            get 
            {
                return false;
            }
 
            set
            { 
                Invariant.Assert(!value, "Root node AfterEnd edge can never be referenced!"); 
            }
        } 

        // The owning TextContainer.
        /*internal*/ public TextContainer TextContainer
        { 
            get
            { 
                return _tree; 
            }
        } 

        // A tree of TextTreeTextBlocks, used to store raw text for the entire
        // tree.
        /*internal*/ public TextTreeRootTextBlock RootTextBlock 
        {
            get 
            { 
                return _rootTextBlock;
            } 

            set
            {
                _rootTextBlock = value; 
            }
        } 
 
//#if REFCOUNT_DEAD_TEXTPOINTERS
//        // A list of positions ready to be garbage collected.  The TextPointer 
//        // finalizer adds positions to this list.
//        /*internal*/ public ArrayList DeadPositionList
//        {
//            get 
//            {
//                return _deadPositionList; 
//            } 
//
//            set 
//            {
//                _deadPositionList = value;
//            }
//        } 
//#endif // REFCOUNT_DEAD_TEXTPOINTERS
 
        // Structure that allows for dispatcher processing to be 
        // enabled after a call to Dispatcher.DisableProcessing.
        /*internal*/ public DispatcherProcessingDisabled DispatcherProcessingDisabled 
        {
            get
            {
                return _processingDisabled; 
            }
 
            set 
            {
                _processingDisabled = value; 
            }
        }

        // Cached TextView.IsAtCaretUnitBoundary calculation for CaretUnitBoundaryCacheOffset. 
        /*internal*/ public boolean CaretUnitBoundaryCache
        { 
            get 
            {
                return _caretUnitBoundaryCache; 
            }

            set
            { 
                _caretUnitBoundaryCache = value;
            } 
        } 

        // Symbol offset of CaretUnitBoundaryCache, or -1 if the cache is empty. 
        /*internal*/ public int CaretUnitBoundaryCacheOffset
        {
            get
            { 
                return _caretUnitBoundaryCacheOffset;
            } 
 
            set
            { 
                _caretUnitBoundaryCacheOffset = value;
            }
        }
 
//        #endregion Internal Properties
 
        //----------------------------------------------------- 
        //
        //  Private Fields 
        //
        //-----------------------------------------------------

//        #region Private Fields 

        // The owning TextContainer. 
        private final TextContainer _tree; 

        // Root node of a contained tree, if any. 
        private TextTreeNode _containedNode;

        // The count of all symbols in the tree, including two edge symbols for
        // the root node itself. 
        private int _symbolCount;
 
        // The count of all chars in the tree. 
        private int _imeCharCount;
 
        // The tree generation.  Incremented whenever the tree content changes.
        private int _generation;

        // Like _generation, but only updated when a change could affect positions. 
        private int _positionGeneration;
 
        // Like _generation, but only updated when on a TextElement layout property change. 
        private int _layoutGeneration;
 
        // A tree of TextTreeTextBlocks, used to store raw text for the entire TextContainer.
        private TextTreeRootTextBlock _rootTextBlock;

//#if REFCOUNT_DEAD_TEXTPOINTERS 
//        // A list of positions ready to be garbage collected.  The TextPointer
//        // finalizer adds positions to this list. 
//        private ArrayList _deadPositionList; 
//#endif // REFCOUNT_DEAD_TEXTPOINTERS
 
        // Cached TextView.IsAtCaretUnitBoundary calculation for _caretUnitBoundaryCacheOffset.
        private boolean _caretUnitBoundaryCache;

        // Symbol offset of _caretUnitBoundaryCache, or -1 if the cache is empty. 
        private int _caretUnitBoundaryCacheOffset;
 
        // Structure that allows for dispatcher processing to be 
        // enabled after a call to Dispatcher.DisableProcessing.
        private DispatcherProcessingDisabled _processingDisabled; 

//        #endregion Private Fields
    }