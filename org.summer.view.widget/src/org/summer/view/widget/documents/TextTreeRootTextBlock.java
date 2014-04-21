package org.summer.view.widget.documents;
 // The root node of a TextBlock splay tree.
    /*internal*/ public class TextTreeRootTextBlock extends SplayTreeNode 
    { 
        //-----------------------------------------------------
        // 
        //  Constructors
        //
        //-----------------------------------------------------
 
//        #region Constructors
 
        // Creates a TextTreeRootTextBlock instance. 
        /*internal*/ public TextTreeRootTextBlock()
        { 
            TextTreeTextBlock block;

            // Allocate an initial block with just two characters -- one for
            // each edge of the root node.  The block will grow when/if 
            // additional content is added.
            block = new TextTreeTextBlock(2); 
            block.InsertAtNode(this, ElementEdge.AfterStart); 
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
//            return ("RootTextBlock Id=" + this.DebugId); 
//        } 
//#endif // DEBUG
 
//        #endregion Public Methods

        //------------------------------------------------------
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
                Invariant.Assert(false, "Can't set ParentNode on TextBlock root!");
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
                _containedNode = (TextTreeTextBlock)value;
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

        // Count of unicode chars of all siblings preceding this node. 
        // This property is only used by TextTreeNodes.
        /*internal*/ public /*override*/ int LeftCharCount
        {
            get 
            {
                return 0; 
            } 

            set 
            {
                Invariant.Assert(value == 0);
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
                Invariant.Assert(false, "TextBlock root never has sibling nodes!"); 
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
                Invariant.Assert(false, "TextBlock root never has sibling nodes!");
            } 
        }
 
        // The tree generation.  Not used for TextTreeRootTextBlock. 
        /*internal*/ public /*override*/ uint Generation
        { 
            get
            {
                return 0;
            } 

            set 
            { 
                Invariant.Assert(false, "TextTreeRootTextBlock does not track Generation!");
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
                Invariant.Assert(false, "TextTreeRootTextBlock does not track SymbolOffsetCache!"); 
            }
        } 
 
        // Not used for TextTreeRootTextBlock.
        /*internal*/ public /*override*/ int SymbolCount 
        {
            get
            {
                return -1; 
            }
 
            set 
            {
                Invariant.Assert(false, "TextTreeRootTextBlock does not track symbol count!"); 
            }
        }

        // Count of unicode chars covered by this node and any contained nodes. 
        // This property is only used by TextTreeNodes.
        /*internal*/ public /*override*/ int IMECharCount 
        { 
            get
            { 
                return 0;
            }

            set 
            {
                Invariant.Assert(value == 0); 
            } 
        }
 
//        #endregion Internal Properties

        //-----------------------------------------------------
        // 
        //  Private Fields
        // 
        //------------------------------------------------------ 

//        #region Private Fields 

        // Root node of a contained tree, if any.
        private TextTreeTextBlock _containedNode;
 
//        #endregion Private Fields
    } 