package org.summer.view.widget.documents;

import org.summer.view.widget.DependencyObject;
 // This is the base class for all TextContainer nodes.  It contains no state,
    // but has several abstract properties to derived class state. 
    //
    // The vast majority of tree manipulations work with TextTreeNode rather 
    // than derived classes.  All splay tree balancing code lives in this class. 
    //
    // Nodes in the TextContainer live within two hierarchies.  Sibling nodes are 
    // stored in splay trees, a type of balanced binary tree.  Some nodes,
    // the TextTreeRootNode and TextTreeTextElementNodes, "contain" other nodes
    // which are themselves roots of splay trees.  So an individual node is
    // always in a splay tree along with its siblings, and it may contain 
    // a splay tree of its own children.
    // 
    // For example, 
    //
    // <Paragraph>Hi!</Paragraph><Paragraph>Fancy <Inline>text</Inline>.</Paragraph> 
    //
    // becomes
    //
    //   [TextTreeRootNode] 
    //           ||
    //   [TextTreeTextElementNode] 
    //           ||               \ 
    //           ||                \
    //           ||                 \ 
    //   [TextTreeTextNode "Hi!"]  [TextTreeTextElementNode]
    //                                       ||
    //                                    [TextTreeTextElementNode]
    //                                   /   ||   \ 
    //                                 /     ||     \
    //                               /       ||       \ 
    //                             /         ||         \ 
    //                           /           ||           \
    //                         /             ||             \ 
    // [TextTreeTextNode "Fancy "] [TextTreeTextNode "text"] [TextTreeTextNode "."]
    //
    // "||" is a link from tree to tree, "|" is a link between nodes in a single tree.
    // 
    // The splay tree algorithm relies on a balancing operation, Splay(), performed
    // after each node access.  It's very important to continue splaying the tree 
    // as nodes are accessed, or we'll have an unbalanced binary tree.  If you're 
    // trying to figure out why the tree perf has regressed and you see deep trees,
    // read up on the splay tree algorithm in your reference book of choice and 
    // then consider whether or not Splay() is being called appropriately from any
    // new code.
    public abstract class TextTreeNode extends SplayTreeNode
    { 
        //-----------------------------------------------------
        // 
        //  Protected Methods 
        //
        //----------------------------------------------------- 


        // Sets the count of TextPositions referencing the node's left
        // edge. 
        // Since nodes don't usually have any references, we demand allocate 
        // storage when needed.
        protected static void SetBeforeStartReferenceCount(/*ref*/ EdgeReferenceCounts edgeReferenceCounts, int value) 
        {
            if (edgeReferenceCounts != null)
            {
                if (value == 0 && 
                    edgeReferenceCounts.AfterStartReferenceCount == 0 &&
                    edgeReferenceCounts.BeforeEndReferenceCount == 0 && 
                    edgeReferenceCounts.AfterEndReferenceCount == 0) 
                {
                    edgeReferenceCounts = null; 
                }
                else
                {
                    edgeReferenceCounts.BeforeStartReferenceCount = value; 
                }
            } 
            else if (value != 0) 
            {
                edgeReferenceCounts = new EdgeReferenceCounts(); 
                edgeReferenceCounts.BeforeStartReferenceCount = value;
            }
        }
 
        // Sets the count of TextPositions referencing the node's AfterStart edge.
        // Since nodes don't usually have any references, we demand allocate 
        // storage when needed. 
        protected void SetAfterStartReferenceCount(/*ref*/ EdgeReferenceCounts edgeReferenceCounts, int value)
        { 
            EdgeReferenceCounts originalCounts;

            if (edgeReferenceCounts != null)
            { 
                if (value == 0 &&
                    edgeReferenceCounts.BeforeStartReferenceCount == 0 && 
                    edgeReferenceCounts.BeforeEndReferenceCount == 0 && 
                    edgeReferenceCounts.AfterEndReferenceCount == 0)
                { 
                    edgeReferenceCounts = null;
                }
                else
                { 
                    if (!(edgeReferenceCounts is ElementEdgeReferenceCounts))
                    { 
                        // We need a slightly bigger object, which tracks the inner edges. 
//                        Invariant.Assert(this is TextTreeTextElementNode, "Non-element nodes should never have inner edge references!");
                        originalCounts = edgeReferenceCounts; 
                        edgeReferenceCounts = new ElementEdgeReferenceCounts();
                        edgeReferenceCounts.BeforeStartReferenceCount = originalCounts.BeforeStartReferenceCount;
                        edgeReferenceCounts.AfterEndReferenceCount = originalCounts.AfterEndReferenceCount;
                    } 
                    edgeReferenceCounts.AfterStartReferenceCount = value;
                } 
            } 
            else if (value != 0)
            { 
                edgeReferenceCounts = new ElementEdgeReferenceCounts();
                edgeReferenceCounts.AfterStartReferenceCount = value;
            }
        } 

        // Sets the count of TextPositions referencing the node's BeforeEnd edge. 
        // Since nodes don't usually have any references, we demand allocate 
        // storage when needed.
        protected void SetBeforeEndReferenceCount(/*ref*/ EdgeReferenceCounts edgeReferenceCounts, int value) 
        {
            EdgeReferenceCounts originalCounts;

            if (edgeReferenceCounts != null) 
            {
                if (value == 0 && 
                    edgeReferenceCounts.BeforeStartReferenceCount == 0 && 
                    edgeReferenceCounts.AfterStartReferenceCount == 0 &&
                    edgeReferenceCounts.AfterEndReferenceCount == 0) 
                {
                    edgeReferenceCounts = null;
                }
                else 
                {
                    if (!(edgeReferenceCounts is ElementEdgeReferenceCounts)) 
                    { 
                        // We need a slightly bigger object, which tracks the inner edges.
//                        Invariant.Assert(this is TextTreeTextElementNode, "Non-element nodes should never have inner edge references!"); 
                        originalCounts = edgeReferenceCounts;
                        edgeReferenceCounts = new ElementEdgeReferenceCounts();
                        edgeReferenceCounts.BeforeStartReferenceCount = originalCounts.BeforeStartReferenceCount;
                        edgeReferenceCounts.AfterEndReferenceCount = originalCounts.AfterEndReferenceCount; 
                    }
                    edgeReferenceCounts.BeforeEndReferenceCount = value; 
                } 
            }
            else if (value != 0) 
            {
                edgeReferenceCounts = new ElementEdgeReferenceCounts();
                edgeReferenceCounts.BeforeEndReferenceCount = value;
            } 
        }
 
        // Sets the count of TextPositions referencing the node's right 
        // edge.
        // Since nodes don't usually have any references, we demand allocate 
        // storage when needed.
        protected static void SetAfterEndReferenceCount(/*ref*/ EdgeReferenceCounts edgeReferenceCounts, int value)
        {
            if (edgeReferenceCounts != null) 
            {
                if (value == 0 && 
                    edgeReferenceCounts.BeforeStartReferenceCount == 0 && 
                    edgeReferenceCounts.AfterStartReferenceCount == 0 &&
                    edgeReferenceCounts.BeforeEndReferenceCount == 0) 
                {
                    edgeReferenceCounts = null;
                }
                else 
                {
                    edgeReferenceCounts.AfterEndReferenceCount = value; 
                } 
            }
            else if (value != 0) 
            {
                edgeReferenceCounts = new EdgeReferenceCounts();
                edgeReferenceCounts.AfterEndReferenceCount = value;
            } 
        }
 
        //------------------------------------------------------
        //
        //  Internal Methods
        // 
        //-----------------------------------------------------
 

        // Returns a shallow copy of this node. 
        // The clone is a local root with no children.
        /*internal*/ public abstract TextTreeNode Clone();

        // Returns the TextContainer containing this node. 
        /*internal*/ public TextContainer GetTextTree()
        { 
            SplayTreeNode node; 
            SplayTreeNode containingNode;
 
            node = this;

            while (true)
            { 
                containingNode = node.GetContainingNode();
                if (containingNode == null) 
                    break; 
                node = containingNode;
            } 

            return ((TextTreeRootNode)node).TextContainer;
        }
 
        // Returns the closest DependencyObject scoping a given node.
        // This includes the node itself and TextContainer.Parent. 
        /*internal*/ public DependencyObject GetDependencyParent() 
        {
            SplayTreeNode node; 
            DependencyObject parent;
            SplayTreeNode containingNode;
            TextTreeTextElementNode elementNode;
 
            node = this;
 
            while (true) 
            {
                elementNode = node as TextTreeTextElementNode; 
                if (elementNode != null)
                {
                    parent = elementNode.TextElement;
//                    Invariant.Assert(parent != null, "TextElementNode has null TextElement!"); 
                    break;
                } 
 
                containingNode = node.GetContainingNode();
                if (containingNode == null) 
                {
                    parent = ((TextTreeRootNode)node).TextContainer.Parent; // This may be null.
                    break;
                } 

                node = containingNode; 
            } 

            return parent; 
        }

        // Returns the closest Logical Tree Node to a given node, including the
        // node itself and TextContainer.Parent. 
        /*internal*/ public DependencyObject GetLogicalTreeNode()
        { 
            TextTreeObjectNode objectNode; 
            TextTreeTextElementNode textElementNode;
            SplayTreeNode node; 
            SplayTreeNode containingNode;
            DependencyObject logicalTreeNode;

            objectNode = (TextTreeObjectNode) (this instanceof TextTreeObjectNode ? this : null); 
            if (objectNode != null)
            { 
                if (objectNode.EmbeddedElement instanceof FrameworkElement) 
                {
                    return objectNode.EmbeddedElement; 
                }
            }

            node = this; 

            while (true) 
            { 
                textElementNode = (TextTreeTextElementNode) (node instanceof TextTreeTextElementNode ? node : null) ;
                if (textElementNode != null) 
                {
                    logicalTreeNode = textElementNode.TextElement;
                    break;
                } 

                containingNode = node.GetContainingNode(); 
                if (containingNode == null) 
                {
                    logicalTreeNode = ((TextTreeRootNode)node).TextContainer.Parent; 
                    break;
                }

                node = containingNode; 
            }
 
            return logicalTreeNode; 
        }
 
        // Returns the TextPointerContext of the node.
        // If node is TextTreeTextElementNode, this method returns ElementStart
        // if direction == Forward, otherwise ElementEnd if direction == Backward.
        /*internal*/ public abstract TextPointerContext GetPointerContext(LogicalDirection direction); 

        // Increments the reference count of TextPositions referencing a 
        // particular edge of this node. 
        //
        // If this node is a TextTreeTextNode, the increment may split the node 
        // and the return value is guaranteed to be the node containing the referenced
        // edge (which may be a new node).  Otherwise this method always returns
        // the original node.
        /*internal*/ public TextTreeNode IncrementReferenceCount(ElementEdge edge) 
        {
            return IncrementReferenceCount(edge, +1); 
        } 

        /*internal*/ public /*virtual*/ TextTreeNode IncrementReferenceCount(ElementEdge edge, boolean delta) 
        {
            return IncrementReferenceCount(edge, delta ? 1 : 0);
        }
 
        // Increments the reference count of TextPositions referencing a
        // particular edge of this node. 
        // 
        // If this node is a TextTreeTextNode, the increment may split the node
        // and the return value is guaranteed to be the node containing the referenced 
        // edge (which may be a new node).  Otherwise this method always returns
        // the original node.
        /*internal*/ public /*virtual*/ TextTreeNode IncrementReferenceCount(ElementEdge edge, int delta)
        { 
//            Invariant.Assert(delta >= 0);
 
            if (delta > 0) 
            {
                switch (edge) 
                {
                    case ElementEdge.BeforeStart:
                        this.BeforeStartReferenceCount = true;
                        break; 

                    case ElementEdge.AfterStart: 
                        this.AfterStartReferenceCount = true; 
                        break;
 
                    case ElementEdge.BeforeEnd:
                        this.BeforeEndReferenceCount = true;
                        break;
 
                    case ElementEdge.AfterEnd:
                        this.AfterEndReferenceCount = true; 
                        break; 

                    default: 
                        Invariant.Assert(false, "Bad ElementEdge value!");
                        break;
                }
            } 

            return this; 
        } 

        // Decrements the reference count of TextPositions referencing this 
        // node.
        //
        // Be careful!  If this node is a TextTreeTextNode, the decrement may
        // cause a merge, and this node may be removed from the tree. 
        /*internal*/ public /*virtual*/ void DecrementReferenceCount(ElementEdge edge)
        { 
            switch (edge)
            { 
                case ElementEdge.BeforeStart:
                    this.BeforeStartReferenceCount--;
                    Invariant.Assert(this.BeforeStartReferenceCount >= 0, "Bad BeforeStart ref count!");
                    break; 

                case ElementEdge.AfterStart: 
                    this.AfterStartReferenceCount--; 
                    Invariant.Assert(this.AfterStartReferenceCount >= 0, "Bad AfterStart ref count!");
                    break; 

                case ElementEdge.BeforeEnd:
                    this.BeforeEndReferenceCount--;
                    Invariant.Assert(this.BeforeEndReferenceCount >= 0, "Bad BeforeEnd ref count!"); 
                    break;
 
                case ElementEdge.AfterEnd: 
                    this.AfterEndReferenceCount--;
                    Invariant.Assert(this.AfterEndReferenceCount >= 0, "Bad AfterEnd ref count!"); 
                    break;

                default:
                    Invariant.Assert(false, "Bad ElementEdge value!"); 
                    break;
            } 
        }
 
        // Inserts a node at a specified position.
        /*internal*/ public void InsertAtPosition(TextPointer position)
        {
            InsertAtNode(position.Node, position.Edge); 
        }
 
        /*internal*/ public ElementEdge GetEdgeFromOffsetNoBias(int nodeOffset) 
        {
            return GetEdgeFromOffset(nodeOffset, LogicalDirection.Forward); 
        }

        /*internal*/ public ElementEdge GetEdgeFromOffset(int nodeOffset, LogicalDirection bias)
        { 
            ElementEdge edge;
 
            if (this.SymbolCount == 0) 
            {
                // If we're pointing at a zero-width TextTreeTextNode, we need to make 
                // sure we get the right edge -- nodeOffset doesn't convey enough information
                // for GetEdgeFromOffset to compute a correct value.
                edge = (bias == LogicalDirection.Forward) ? ElementEdge.AfterEnd : ElementEdge.BeforeStart;
            } 
            else if (nodeOffset == 0)
            { 
                edge = ElementEdge.BeforeStart; 
            }
            else if (nodeOffset == this.SymbolCount) 
            {
                edge = ElementEdge.AfterEnd;
            }
            else if (nodeOffset == 1) 
            {
                edge = ElementEdge.AfterStart; 
            } 
            else
            { 
//                Invariant.Assert(nodeOffset == this.SymbolCount - 1);
                edge = ElementEdge.BeforeEnd;
            }
 
            return edge;
        } 
 
        /*internal*/ public int GetOffsetFromEdge(ElementEdge edge)
        { 
            int offset;

            switch (edge)
            { 
                case ElementEdge.BeforeStart:
                    offset = 0; 
                    break; 

                case ElementEdge.AfterStart: 
                    offset = 1;
                    break;

                case ElementEdge.BeforeEnd: 
                    offset = this.SymbolCount - 1;
                    break; 
 
                case ElementEdge.AfterEnd:
                    offset = this.SymbolCount; 
                    break;

                default:
                    offset = 0; 
                    Invariant.Assert(false, "Bad ElementEdge value!");
                    break; 
            } 

            return offset; 
        }

 
        //------------------------------------------------------
        // 
        //  Internal Properties 
        //
        //------------------------------------------------------ 


        // Count of TextPositions referencing the node's BeforeStart edge. 
        /*internal*/ public abstract boolean BeforeStartReferenceCount { get; set; }
 
        // Count of TextPositions referencing the node's AfterStart edge. 
        /*internal*/ public abstract boolean AfterStartReferenceCount { get; set; }
 
        // Count of TextPositions referencing the node's BeforeEnd edge.
        /*internal*/ public abstract boolean BeforeEndReferenceCount { get; set; }

        // Count of TextPositions referencing the node's AfterEnd edge. 
        /*internal*/ public abstract boolean AfterEndReferenceCount { get; set; }
 
    }