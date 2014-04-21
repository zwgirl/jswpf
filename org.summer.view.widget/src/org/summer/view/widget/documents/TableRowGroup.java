package org.summer.view.widget.documents;

import org.summer.view.widget.markup.IAddChild;

/// <summary> 
    /// Table row group implementation
    /// </summary>
//    [ContentProperty("Rows")]
    public class TableRowGroup extends TextElement implements IAddChild, IIndexedChild<Table>, IAcceptInsertion 
    {
        //----------------------------------------------------- 
        // 
        //  Constructors
        // 
        //-----------------------------------------------------

//        #region Constructors
 
        /// <summary>
        /// Creates an instance of a RowGroup 
        /// </summary> 
        public TableRowGroup()
            : base() 
        {
            Initialize();
        }
 
        // common initialization for all constructors
        private void Initialize() 
        { 
            _rows = new TableRowCollection(this);
            _rowInsertionIndex = -1; 
            _parentIndex = -1;
        }

//#endregion 

        //------------------------------------------------------ 
        // 
        //  Public Methods
        // 
        //-----------------------------------------------------

//        #region Public Methods
 
        /// <summary>
        /// <see cref="IAddChild.AddChild"/> 
        /// </summary> 
        public void /*IAddChild.*/AddChild(Object value)
        { 
            if (value == null)
            {
                throw new ArgumentNullException("value");
            } 

            TableRow row = value as TableRow; 
            if (row != null) 
            {
                Rows.Add(row); 

                return;
            }
 
            throw (new ArgumentException(SR.Get(SRID.UnexpectedParameterType, value.GetType(), typeof(TableRow)), "value"));
        } 
 
        /// <summary>
        /// <see cref="IAddChild.AddText"/> 
        /// </summary>
        public void /*IAddChild.*/AddText(String text)
        {
            XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
        }
 
//        #endregion Public Methods 

        //------------------------------------------------------ 
        //
        //  Public Properties
        //
        //------------------------------------------------------ 

//        #region Public Properties 
 
        /// <summary>
        /// Returns the row group's row collection 
        /// </summary>
//        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        public TableRowCollection Rows
        { 
            get
            { 
                return (_rows); 
            }
        } 

        /// <summary>
        /// This method is used by TypeDescriptor to determine if this property should
        /// be serialized. 
        /// </summary>
//        [EditorBrowsable(EditorBrowsableState.Never)] 
        public bool ShouldSerializeRows() 
        {
            return Rows.Count > 0; 
        }

//        #endregion Public Properties
 
        //-----------------------------------------------------
        // 
        //  Protected Methods 
        //
        //------------------------------------------------------ 

//        #region Protected Methods

//        #endregion Protected Methods 

        //----------------------------------------------------- 
        // 
        //  Internal Methods
        // 
        //-----------------------------------------------------

//        #region Internal Methods
 
//        #region IIndexedChild implementation
        /// <summary> 
        /// Callback used to notify about entering model tree. 
        /// </summary>
        void IIndexedChild<Table>.OnEnterParentTree() 
        {
            this.OnEnterParentTree();
        }
 
        /// <summary>
        /// Callback used to notify about exitting model tree. 
        /// </summary> 
        void IIndexedChild<Table>.OnExitParentTree()
        { 
            this.OnExitParentTree();
        }

        void IIndexedChild<Table>.OnAfterExitParentTree(Table parent) 
        {
            this.OnAfterExitParentTree(parent); 
        } 

        int IIndexedChild<Table>.Index 
        {
            get { return this.Index; }
            set { this.Index = value; }
        } 

//        #endregion IIndexedChild implementation 
 
        /// <summary>
        /// Callback used to notify the RowGroup about entering model tree. 
        /// </summary>
        /*internal*/ public void OnEnterParentTree()
        {
            if(Table != null) 
            {
                Table.OnStructureChanged(); 
            } 
        }
 
        /// <summary>
        /// Callback used to notify the RowGroup about exitting model tree.
        /// </summary>
        /*internal*/ public void OnExitParentTree() 
        {
        } 
 
        /// <summary>
        /// Callback used to notify the RowGroup about exitting model tree. 
        /// </summary>
        /*internal*/ public void OnAfterExitParentTree(Table table)
        {
            table.OnStructureChanged(); 
        }
 
        /// <summary> 
        /// ValidateStructure
        /// </summary> 
        /*internal*/ public void ValidateStructure()
        {
            RowSpanVector rowSpanVector = new RowSpanVector();
 
            _columnCount = 0;
 
            for (int i = 0; i < Rows.Count; ++i) 
            {
                Rows[i].ValidateStructure(rowSpanVector); 

                _columnCount = Math.Max(_columnCount, Rows[i].ColumnCount);
            }
 
            Table.EnsureColumnCount(_columnCount);
        } 
 

//        #endregion Internal Methods 

        //-----------------------------------------------------
        //
        //  Internal Properties 
        //
        //------------------------------------------------------ 
 
//        #region Internal Properties
 
        /// <summary>
        /// Table owner accessor
        /// </summary>
        /*internal*/ public Table Table 
        {
            get 
            { 
                return Parent as Table;
            } 
        }

        /// <summary>
        /// RowGroup's index in the parents row group collection. 
        /// </summary>
        /*internal*/ public int Index 
        { 
            get
            { 
                return (_parentIndex);
            }
            set
            { 
                Debug.Assert(value >= -1 && _parentIndex != value);
                _parentIndex = value; 
            } 
        }
 
        int IAcceptInsertion.InsertionIndex
        {
            get { return this.InsertionIndex; }
            set { this.InsertionIndex = value; } 
        }
 
        /// <summary> 
        /// Stores temporary data for where to insert a new row
        /// </summary> 
        /*internal*/ public int InsertionIndex
        {
            get { return _rowInsertionIndex; }
            set { _rowInsertionIndex = value; } 
        }
 
        /// <summary> 
        /// Marks this element's left edge as visible to IMEs.
        /// This means element boundaries will act as word breaks. 
        /// </summary>
        /*internal*/ public /*override*/ bool IsIMEStructuralElement
        {
            get 
            {
                return true; 
            } 
        }
 
        #endregion Internal Properties

        //-----------------------------------------------------
        // 
        //  Private Methods
        // 
        //------------------------------------------------------ 

//        #region Private Methods 

        /// <summary>
        /// Called when body receives a new parent (via OM or text tree)
        /// </summary> 
        /// <param name="newParent">
        /// New parent of body 
        /// </param> 
        /*internal*/ public /*override*/ void OnNewParent(DependencyObject newParent)
        { 
            DependencyObject oldParent = this.Parent;

            if (newParent != null && !(newParent is Table))
            { 
                throw new InvalidOperationException(SR.Get(SRID.TableInvalidParentNodeType, newParent.GetType().ToString()));
            } 
 
            if (oldParent != null)
            { 
                OnExitParentTree();
                ((Table)oldParent).RowGroups.InternalRemove(this);
                OnAfterExitParentTree(oldParent as Table);
            } 

            base.OnNewParent(newParent); 
 
            if (newParent != null)
            { 
                ((Table)newParent).RowGroups.InternalAdd(this);
                OnEnterParentTree();
            }
        } 

//        #endregion Private Methods 
 
        //------------------------------------------------------
        // 
        //  Private Fields
        //
        //-----------------------------------------------------
 
//        #region Private Fields
        private TableRowCollection _rows;               //  children rows store 
        private int _parentIndex;                       //  row group's index in parent's children collection 
        private int _rowInsertionIndex;                 //  Insertion index for row
        private int _columnCount;                       //  Column count. 

//        #endregion Private Fields

        //------------------------------------------------------ 
        //
        //  Private Structures / Classes 
        // 
        //-----------------------------------------------------
    } 