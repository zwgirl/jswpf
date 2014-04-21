package org.summer.view.widget.documents;

import org.summer.view.widget.DependencyObject;
 // UIElements in the TextContainer are represented internally by TextTreeObjectNodes.
    //
    // This class is a simple container for a UIElement, it only holds state.
    /*internal*/ public class TextTreeObjectNode extends TextTreeNode 
    {
        //----------------------------------------------------- 
        // 
        //  Constructors
        // 
        //-----------------------------------------------------

//        #region Constructors
 
        // Creates a new TextTreeObjectNode instance.
        /*internal*/ public TextTreeObjectNode(DependencyObject embeddedElement) 
        { 
            _embeddedElement = embeddedElement;
            _symbolOffsetCache = -1; 
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
//            return ("ObjectNode Id=" + this.DebugId + " Object=" + _embeddedElement);
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
        /*internal*/ public /*override*/ TextTreeNode Clone()
        { 
            TextTreeObjectNode clone; 

            clone = new TextTreeObjectNode(_embeddedElement); 

            return clone;
        }
 
        // Returns the TextPointerContext of the node.
        /*internal*/ public /*override*/ TextPointerContext GetPointerContext(LogicalDirection direction) 
        { 
            return TextPointerContext.EmbeddedElement;
        } 

//        #endregion Internal methods

        //----------------------------------------------------- 
        //
        //  Internal Properties 
        // 
        //------------------------------------------------------
 
//        #region Internal Properties

        // If this node is a local root, then ParentNode contains it.
        // Otherwise, this is the node parenting this node within its tree. 
        /*internal*/ public /*override*/ SplayTreeNode ParentNode
        { 
            get 
            {
                return _parentNode; 
            }

            set
            { 
                _parentNode = (TextTreeNode)value;
            } 
        } 

        // TextTreeObjectNode never has contained nodes. 
        /*internal*/ public /*override*/ SplayTreeNode ContainedNode
        {
            get
            { 
                return null;
            } 
 
            set
            { 
//                Invariant.Assert(false, "Can't set contained node on a TextTreeObjectNode!");
            }
        }
 
        // Count of symbols of all siblings preceding this node.
        /*internal*/ public /*override*/ int LeftSymbolCount 
        { 
            get
            { 
                return _leftSymbolCount;
            }

            set 
            {
                _leftSymbolCount = value; 
            } 
        }
 
        // Count of symbols of all siblings preceding this node.
        /*internal*/ public /*override*/ int LeftCharCount
        {
            get 
            {
                return _leftCharCount; 
            } 

            set 
            {
                _leftCharCount = value;
            }
        } 

        // Left child node in a sibling tree. 
        /*internal*/ public /*override*/ SplayTreeNode LeftChildNode 
        {
            get 
            {
                return _leftChildNode;
            }
 
            set
            { 
                _leftChildNode = (TextTreeNode)value; 
            }
        } 

        // Right child node in a sibling tree.
        /*internal*/ public /*override*/ SplayTreeNode RightChildNode
        { 
            get
            { 
                return _rightChildNode; 
            }
 
            set
            {
                _rightChildNode = (TextTreeNode)value;
            } 
        }
 
        // The TextContainer's generation when SymbolOffsetCache was last updated. 
        // If the current generation doesn't match TextContainer.Generation, then
        // SymbolOffsetCache is invalid. 
        /*internal*/ public /*override*/ uint Generation
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
 
        // Cached symbol offset.
        /*internal*/ public /*override*/ int SymbolOffsetCache 
        { 
            get
            { 
                return _symbolOffsetCache;
            }

            set 
            {
                _symbolOffsetCache = value; 
            } 
        }
 
        // Count of symbols covered by this node.
        /*internal*/ public /*override*/ int SymbolCount
        {
            get 
            {
                return 1; 
            } 

            set 
            {
//                Invariant.Assert(false, "Can't set SymbolCount on TextTreeObjectNode!");
            }
        } 

        // Count of symbols covered by this node. 
        /*internal*/ public /*override*/ int IMECharCount 
        {
            get 
            {
                return 1;
            }
 
            set
            { 
//                Invariant.Assert(false, "Can't set CharCount on TextTreeObjectNode!"); 
            }
        } 

        // Count of TextPositions referencing the node's BeforeStart edge.
        // Since nodes don't usually have any references, we demand allocate
        // storage when needed. 
        /*internal*/ public /*override*/ boolean BeforeStartReferenceCount
        { 
            get 
            {
                return (_edgeReferenceCounts & ElementEdge.BeforeStart) != 0; 
            }

            set
            { 
                Invariant.Assert(value); // Illegal to clear a set ref count.
                _edgeReferenceCounts |= ElementEdge.BeforeStart; 
            } 
        }
 
        // Count of TextPositions referencing the node's AfterStart edge.
        // Since object nodes don't have an AfterStart edge, this is always zero.
        /*internal*/ public /*override*/ boolean AfterStartReferenceCount
        { 
            get
            { 
                return false; 
            }
 
            set
            {
                Invariant.Assert(false, "Object nodes don't have an AfterStart edge!");
            } 
        }
 
        // Count of TextPositions referencing the node's BeforeEnd edge. 
        // Since object nodes don't have an BeforeEnd edge, this is always zero.
        /*internal*/ public /*override*/ boolean BeforeEndReferenceCount 
        {
            get
            {
                return false; 
            }
 
            set 
            {
                Invariant.Assert(false, "Object nodes don't have a BeforeEnd edge!"); 
            }
        }

        // Count of TextPositions referencing the node's right 
        // edge.
        // Since nodes don't usually have any references, we demand allocate 
        // storage when needed. 
        /*internal*/ public /*override*/ boolean AfterEndReferenceCount
        { 
            get
            {
                return (_edgeReferenceCounts & ElementEdge.AfterEnd) != 0;
            } 

            set 
            { 
                Invariant.Assert(value); // Illegal to clear a set ref count.
                _edgeReferenceCounts |= ElementEdge.AfterEnd; 
            }
        }

        // The UIElement or ContentElement linked to this node. 
        /*internal*/ public DependencyObject EmbeddedElement
        { 
            get 
            {
                return _embeddedElement; 
            }
        }

//        #endregion Internal Properties 

        //----------------------------------------------------- 
        // 
        //  Private Fields
        // 
        //-----------------------------------------------------

//        #region Private Fields
 
        // Count of symbols of all siblings preceding this node.
        private int _leftSymbolCount; 
 
        // Count of chars of all siblings preceding this node.
        private int _leftCharCount; 

        // If this node is a local root, then ParentNode contains it.
        // Otherwise, this is the node parenting this node within its tree.
        private TextTreeNode _parentNode; 

        // Left child node in a sibling tree. 
        private TextTreeNode _leftChildNode; 

        // Right child node in a sibling tree. 
        private TextTreeNode _rightChildNode;

        // The TextContainer's generation when SymbolOffsetCache was last updated.
        // If the current generation doesn't match TextContainer.Generation, then 
        // SymbolOffsetCache is invalid.
        private uint _generation; 
 
        // Cached symbol offset.
        private int _symbolOffsetCache; 

        // Reference counts of TextPositions referencing this node.
        // Lazy allocated -- null means no references.
        private ElementEdge _edgeReferenceCounts; 

        // The UIElement or ContentElement linked to this node. 
        private final DependencyObject _embeddedElement; 

//        #endregion Private Fields 
    }