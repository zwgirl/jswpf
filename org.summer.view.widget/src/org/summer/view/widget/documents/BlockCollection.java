package org.summer.view.widget.documents;

import org.summer.view.widget.DependencyObject;

/// <summary>
    /// Collection of Block elements - elements allowed as children 
    /// of FlowDocument, Section, ListItem, TableCell, Floater and Figure. 
    /// </summary>
    public class BlockCollection extends TextElementCollection<Block> 
    {
        //-------------------------------------------------------------------
        //
        //  Constructors 
        //
        //------------------------------------------------------------------- 
 
//        #region Constructors
 
        // Constructor is /*internal*/ public. We allow BlockCollection creation only from inside owning elements such as FlowDocument or TextElement.
        // Note that when a SiblingBlocks collection is created for a Block, the owner of collection is that member Block object.
        // Flag isOwnerParent indicates whether owner is a parent or a member of the collection.
        /*internal*/ public BlockCollection(DependencyObject owner, boolean isOwnerParent) 
        { 
        	super(owner, isOwnerParent);
        } 

//        #endregion Constructors 

        //--------------------------------------------------------------------
        //
        //  Public Properties 
        //
        //------------------------------------------------------------------- 
 
//        #region Public Properties
 
        /// <value>
        /// Returns a first Block of this collection
        /// </value>
        public Block FirstBlock 
        {
            get 
            { 
                return this.FirstChild;
            } 
        }

        /// <value>
        /// Returns a last Block of this collection 
        /// </value>
        public Block LastBlock 
        { 
            get
            { 
                return this.LastChild;
            }
        }
 
//        #endregion Public Properties
    } 