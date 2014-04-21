/**
 * BlockCollection
 */

define(["dojo/_base/declare", "system/Type", "documents/TextElementCollection"], 
		function(declare, Type, TextElementCollection){
	var BlockCollection = declare("BlockCollection", TextElementCollection,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(BlockCollection.prototype,{
		  
	});
	
	Object.defineProperties(BlockCollection,{
		  
	});
	
	BlockCollection.Type = new Type("BlockCollection", BlockCollection, [TextElementCollection.Type]);
	return BlockCollection;
});

//---------------------------------------------------------------------------- 
//
// Copyright (C) Microsoft Corporation.  All rights reserved.
//
// Description: Collection of Block elements 
//    Collection of Block elements - elements allowed as children
//    of FlowDocument, Section, ListItem, TableCell, Floater and Figure. 
// 
//---------------------------------------------------------------------------
 
namespace System.Windows.Documents
{
    using MS.Internal; // Invariant
 
    /// <summary>
    /// Collection of Block elements - elements allowed as children 
    /// of FlowDocument, Section, ListItem, TableCell, Floater and Figure. 
    /// </summary>
    public class BlockCollection : TextElementCollection<Block> 
    {
        //-------------------------------------------------------------------
        //
        //  Constructors 
        //
        //------------------------------------------------------------------- 
 
        #region Constructors
 
        // Constructor is internal. We allow BlockCollection creation only from inside owning elements such as FlowDocument or TextElement.
        // Note that when a SiblingBlocks collection is created for a Block, the owner of collection is that member Block object.
        // Flag isOwnerParent indicates whether owner is a parent or a member of the collection.
        internal BlockCollection(DependencyObject owner, bool isOwnerParent) 
            : base(owner, isOwnerParent)
        { 
        } 

        #endregion Constructors 

        //--------------------------------------------------------------------
        //
        //  Public Properties 
        //
        //------------------------------------------------------------------- 
 
        #region Public Properties
 
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
 
        #endregion Public Properties
    } 
} 

