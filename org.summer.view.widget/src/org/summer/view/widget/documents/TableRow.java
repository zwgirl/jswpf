package org.summer.view.widget.documents;

import org.summer.view.widget.markup.IAddChild;
 /// <summary>
    /// Table row
    /// </summary> 

//    [ContentProperty("Cells")] 
    public class TableRow extends TextElement implements IAddChild, IIndexedChild<TableRowGroup>, IAcceptInsertion 
    {
        //----------------------------------------------------- 
        //
        //  Constructors
        //
        //----------------------------------------------------- 

//        #region Constructors 
 
        /// <summary>
        /// Creates an instance of a Row 
        /// </summary>
        public TableRow()
            : base()
        { 
            PrivateInitialize();
        } 
 
//        #endregion
 
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
 
            TableCell cell = value as TableCell;
            if (cell != null)
            {
                Cells.Add(cell); 
                return;
            } 
 
            throw (new ArgumentException(SR.Get(SRID.UnexpectedParameterType, value.GetType(), typeof(TableCell)), "value"));
        } 

        /// <summary>
        /// <see cref="IAddChild.AddText"/>
        /// </summary> 
        public void /*IAddChild.*/AddText(String text)
        { 
            XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
        }
 

        /// <summary>
        /// Called when tablerow gets new parent
        /// </summary> 
        /// <param name="newParent">
        /// New parent of cell 
        /// </param> 
        /*internal*/ public /*override*/ void OnNewParent(DependencyObject newParent)
        { 
            DependencyObject oldParent = this.Parent;

            if (newParent != null && !(newParent is TableRowGroup))
            { 
                throw new InvalidOperationException(SR.Get(SRID.TableInvalidParentNodeType, newParent.GetType().ToString()));
            } 
 
            if (oldParent != null)
            { 
                ((TableRowGroup)oldParent).Rows.InternalRemove(this);
            }

            base.OnNewParent(newParent); 

            if (newParent != null) 
            { 
                ((TableRowGroup)newParent).Rows.InternalAdd(this);
            } 
        }

//        #endregion Public Methods
 
        //------------------------------------------------------
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
        //------------------------------------------------------ 

//        #region Internal Methods

//        #endregion IIndexedChild implementation
 
        /// <summary>
        /// Callback used to notify the Row about entering model tree. 
        /// </summary> 
        /*internal*/ public void OnEnterParentTree()
        { 
            if (Table != null)
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
        /// Callback used to notify the Row about exitting model tree. 
        /// </summary>
        /*internal*/ public void OnAfterExitParentTree(TableRowGroup rowGroup) 
        {
            if (rowGroup.Table != null)
            {
                Table.OnStructureChanged(); 
            }
        } 
 
        /// <summary>
        /// ValidateStructure 
        /// </summary>
        /*internal*/ public void ValidateStructure(RowSpanVector rowSpanVector)
        {
            Debug.Assert(rowSpanVector != null); 

            SetFlags(!rowSpanVector.Empty(), Flags.HasForeignCells); 
            SetFlags(false, Flags.HasRealCells); 

            _formatCellCount = 0; 
            _columnCount = 0;

            int firstAvailableIndex;
            int firstOccupiedIndex; 

            rowSpanVector.GetFirstAvailableRange(out firstAvailableIndex, out firstOccupiedIndex); 
            for (int i = 0; i < _cells.Count; ++i) 
            {
                TableCell cell = _cells[i]; 

                // Get cloumn span and row span. Row span is limited to the number of rows in the row group.
                // Since we do not know the number of columns in the table at this point, column span is limited only
                // by /*internal*/ public constants 
                int columnSpan = cell.ColumnSpan;
                int rowSpan = cell.RowSpan; 
 
                while (firstAvailableIndex + columnSpan > firstOccupiedIndex)
                { 
                    rowSpanVector.GetNextAvailableRange(out firstAvailableIndex, out firstOccupiedIndex);
                }

                Debug.Assert(i <= firstAvailableIndex); 

                cell.ValidateStructure(firstAvailableIndex); 
 
                if (rowSpan > 1)
                { 
                    rowSpanVector.Register(cell);
                }
                else
                { 
                    _formatCellCount++;
                } 
 
                firstAvailableIndex += columnSpan;
            } 

            _columnCount = firstAvailableIndex;

            boolean isLastRowOfAnySpan = false; 
            rowSpanVector.GetSpanCells(out _spannedCells, out isLastRowOfAnySpan);
            Debug.Assert(_spannedCells != null); 
 
            if ((_formatCellCount > 0) ||
               isLastRowOfAnySpan == true) 
            {
                SetFlags(true, Flags.HasRealCells);
            }
 
            _formatCellCount += _spannedCells.Length;
 
            Debug.Assert(_cells.Count <= _formatCellCount); 
        }
 
//        #endregion Internal Methods

        //-----------------------------------------------------
        // 
        //  Internal Properties
        // 
        //----------------------------------------------------- 

//        #region Internal Properties 

        /// <summary>
        /// RowGroup owner accessor
        /// </summary> 
        /*internal*/ public TableRowGroup RowGroup
        { 
            get 
            {
                return (Parent as TableRowGroup); 
            }
        }

        /// <summary> 
        /// Table owner accessor
        /// </summary> 
        /*internal*/ public Table Table { get { return (RowGroup != null ? RowGroup.Table : null); } } 

        /// <summary> 
        /// Returns the row's cell collection
        /// </summary>
//        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        public TableCellCollection Cells { get { return (_cells); } } 

        /// <summary> 
        /// This method is used by TypeDescriptor to determine if this property should 
        /// be serialized.
        /// </summary> 
//        [EditorBrowsable(EditorBrowsableState.Never)]
        public boolean ShouldSerializeCells()
        {
            return (Cells.Count > 0); 
        }
 
        /// <summary> 
        /// Row's index in the parents collection.
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
        /// Stores temporary data for where to insert a new cell
        /// </summary>
        /*internal*/ public int InsertionIndex 
        {
            get { return _cellInsertionIndex; } 
            set { _cellInsertionIndex = value; } 
        }
 
        /// <summary>
        /// Returns span cells vector
        /// </summary>
        /*internal*/ public TableCell[] SpannedCells 
        {
            get { return (_spannedCells); } 
        } 

        /// <summary> 
        /// Count of columns in the table
        /// </summary>
        /*internal*/ public int ColumnCount
        { 
            get
            { 
                return (_columnCount); 
            }
        } 

        /// <summary>
        /// Returns "true" if there are row spanned cells belonging to previous rows
        /// </summary> 
        /*internal*/ public boolean HasForeignCells
        { 
            get { return (CheckFlags(Flags.HasForeignCells)); } 
        }
 
        /// <summary>
        /// Returns "true" if there are row spanned cells belonging to previous rows
        /// </summary>
        /*internal*/ public boolean HasRealCells 
        {
            get { return (CheckFlags(Flags.HasRealCells)); } 
        } 

        /// <summary> 
        /// Count of columns in the table
        /// </summary>
        /*internal*/ public int FormatCellCount
        { 
            get
            { 
                return (_formatCellCount); 
            }
        } 

        /// <summary>
        /// Marks this element's left edge as visible to IMEs.
        /// This means element boundaries will act as word breaks. 
        /// </summary>
        /*internal*/ public /*override*/ boolean IsIMEStructuralElement 
        { 
            get
            { 
                return true;
            }
        }
 
//        #endregion Internal Properties
 
        //----------------------------------------------------- 
        //
        //  Private Methods 
        //
        //------------------------------------------------------

//        #region Private Methods 

        /// <summary> 
        /// Private ctor time initialization. 
        /// </summary>
        private void PrivateInitialize() 
        {
            _cells = new TableCellCollection(this);
            _parentIndex = -1;
            _cellInsertionIndex = -1; 
        }
 
        /// <summary> 
        /// SetFlags is used to set or unset one or multiple flags on the row.
        /// </summary> 
        private void SetFlags(boolean value, Flags flags)
        {
            _flags = value ? (_flags | flags) : (_flags & (~flags));
        } 

        /// <summary> 
        /// CheckFlags returns true if all flags in the bitmask flags are set. 
        /// </summary>
        private boolean CheckFlags(Flags flags) 
        {
            return ((_flags & flags) == flags);
        }
 

//        #endregion Private Methods 
 
        //-----------------------------------------------------
        // 
        //  Private Fields
        //
        //------------------------------------------------------
 
//        #region Private Fields
        private TableCellCollection _cells;             //  collection of cells belonging to the row 
        private TableCell[] _spannedCells;              //  row spanned cell storage 

        private int _parentIndex;                       //  row's index in parent's children collection 
        private int _cellInsertionIndex;                // Insertion index a cell
        private int _columnCount;

        private Flags _flags;                           //  flags reflecting various aspects of row's state 
        private int _formatCellCount;                   //  count of the cell to be formatted in this row
 
 
//        #endregion Private Fields
 
        //------------------------------------------------------
        //
        //  Private Structures / Classes
        // 
        //-----------------------------------------------------
 
//        #region Private Structures Classes 

//        [System.Flags] 
        private enum Flags
        {
            //
            //  state flags 
            //
            HasForeignCells = 0x00000010, //  there are hanging cells from the previous rows 
            HasRealCells = 0x00000020, // real cells in row (not just spanning) (Only known by validation, not format) 
        }
 
//        #endregion Private Structures Classes

    }