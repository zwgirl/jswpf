package org.summer.view.widget.documents;
/// <summary>
    /// Collection of ListItem elements 
    /// </summary>
    public class ListItemCollection extends TextElementCollection<ListItem> 
    { 
        //-------------------------------------------------------------------
        // 
        //  Constructors
        //
        //-------------------------------------------------------------------
 
        #region Constructors
 
        // This kind of collection is suposed to be created by owning List elements only. 
        // Note that when a SiblingListItems collection is created for a ListItem, the owner of collection is that member ListItem object.
        // Flag isOwnerParent indicates whether owner is a parent or a member of the collection. 
        internal ListItemCollection(DependencyObject owner, bool isOwnerParent)
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
        /// Returns a first ListItem of this collection
        /// </value> 
        public ListItem FirstListItem
        {
            get
            { 
                return this.FirstChild;
            } 
        } 

        /// <value> 
        /// Returns a last ListItem of this collection
        /// </value>
        public ListItem LastListItem
        { 
            get
            { 
                return this.LastChild; 
            }
        } 

        #endregion Public Properties
    }