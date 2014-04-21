/**
 * TableRow
 */

define(["dojo/_base/declare", "system/Type", "windows/TextElement", "generic/List"], 
		function(declare, Type, TextElement, List){
	
//    private enum 
	var Flags = declare(null, {});
        //
        //  state flags 
        //
	FlagsHasForeignCells = 0x00000010; //  there are hanging cells from the previous rows 
	FlagsHasRealCells = 0x00000020; // real cells in row (not just spanning) (Only known by validation, not format) 
    
	var TableRow = declare("TableRow", [TextElement, IAddChild, IIndexedChild, IAcceptInsertion],{
		constructor:function(){
			this.PrivateInitialize();
		},
		/// <summary> 
        /// <see cref="IAddChild.AddChild"/>
        /// </summary>
//        void IAddChild.
		AddChild:function(/*object*/ value)
        { 
            if (value == null)
            { 
                throw new ArgumentNullException("value"); 
            }
 
            var cell = value instanceof TableCell ? value : null;
            if (cell != null)
            {
                this.Cells.Add(cell); 
                return;
            } 
 
            throw (new ArgumentException(SR.Get(SRID.UnexpectedParameterType, value.GetType(), typeof(TableCell)), "value"));
        }, 

        /// <summary>
        /// <see cref="IAddChild.AddText"/>
        /// </summary> 
//        void IAddChild.
        AddText:function(/*string*/ text)
        { 
            XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
        },
 

        /// <summary>
        /// Called when tablerow gets new parent
        /// </summary> 
        /// <param name="newParent">
        /// New parent of cell 
        /// </param> 
//        internal override void 
        OnNewParent:function(/*DependencyObject*/ newParent)
        { 
            var oldParent = this.Parent;

            if (newParent != null && !(newParent instanceof TableRowGroup))
            { 
                throw new InvalidOperationException(SR.Get(SRID.TableInvalidParentNodeType, newParent.GetType().ToString()));
            } 
 
            if (oldParent != null)
            { 
                oldParent.Rows.Remove(this);
            }

            TextElement.prototype.OnNewParent.call(this, newParent); 

            if (newParent != null) 
            { 
                newParent.Rows.Add(this);
            } 
        },

        /// <summary>
        /// Callback used to notify the Row about entering model tree. 
        /// </summary> 
//        internal void 
        OnEnterParentTree:function()
        { 
            if (this.Table != null)
            {
            	this.Table.OnStructureChanged();
            } 
        },
 
        /// <summary> 
        /// Callback used to notify the RowGroup about exitting model tree.
        /// </summary> 
//        internal void 
        OnExitParentTree:function()
        {
        },
 

        /// <summary> 
        /// Callback used to notify the Row about exitting model tree. 
        /// </summary>
//        internal void 
        OnAfterExitParentTree:function(/*TableRowGroup*/ rowGroup) 
        {
            if (rowGroup.Table != null)
            {
                this.Table.OnStructureChanged(); 
            }
        }, 
 
        /// <summary>
        /// ValidateStructure 
        /// </summary>
//        internal void 
        ValidateStructure:function(/*RowSpanVector*/ rowSpanVector)
        {
//            Debug.Assert(rowSpanVector != null); 

            this.SetFlags(!rowSpanVector.Empty(), Flags.HasForeignCells); 
            this.SetFlags(false, Flags.HasRealCells); 

            this._formatCellCount = 0; 
            this._columnCount = 0;

            var firstAvailableIndex;
            var firstOccupiedIndex; 

            rowSpanVector.GetFirstAvailableRange(/*out firstAvailableIndex*/firstAvailableIndexOut, 
            		/*out firstOccupiedIndex*/firstOccupiedIndexOut); 
            for (var i = 0; i < _cells.Count; ++i) 
            {
                /*TableCell*/var cell = this._cells[i]; 

                // Get cloumn span and row span. Row span is limited to the number of rows in the row group.
                // Since we do not know the number of columns in the table at this point, column span is limited only
                // by internal constants 
                var columnSpan = cell.ColumnSpan;
                var rowSpan = cell.RowSpan; 
 
                while (firstAvailableIndex + columnSpan > firstOccupiedIndex)
                { 
                    rowSpanVector.GetNextAvailableRange(/*out firstAvailableIndex*/firstAvailableIndexOut, 
                    		/*out firstOccupiedIndex*/firstOccupiedIndexOut);
                }

//                Debug.Assert(i <= firstAvailableIndex); 

                cell.ValidateStructure(firstAvailableIndex); 
 
                if (rowSpan > 1)
                { 
                    rowSpanVector.Register(cell);
                }
                else
                { 
                	this._formatCellCount++;
                } 
 
                firstAvailableIndex += columnSpan;
            } 

            this._columnCount = firstAvailableIndex;

            var isLastRowOfAnySpan = false; 
            rowSpanVector.GetSpanCells(out _spannedCells, out isLastRowOfAnySpan);
//            Debug.Assert(_spannedCells != null); 
 
            if ((this._formatCellCount > 0) ||
               isLastRowOfAnySpan == true) 
            {
            	this.SetFlags(true, Flags.HasRealCells);
            }
 
            this._formatCellCount += _spannedCells.Length;
 
//            Debug.Assert(_cells.Count <= _formatCellCount); 
        },

        /// <summary> 
        /// Private ctor time initialization. 
        /// </summary>
//        private void 
        PrivateInitialize:function() 
        {
        	this._cells = new List(); //new TableCellCollection(this);
            this._parentIndex = -1;
            this._cellInsertionIndex = -1; 
        },
 
        /// <summary> 
        /// SetFlags is used to set or unset one or multiple flags on the row.
        /// </summary> 
//        private void 
        SetFlags:function(/*bool*/ value, /*Flags*/ flags)
        {
        	this._flags = value ? (this._flags | flags) : (this._flags & (~flags));
        }, 

        /// <summary> 
        /// CheckFlags returns true if all flags in the bitmask flags are set. 
        /// </summary>
//        private bool 
        CheckFlags:function(/*Flags*/ flags) 
        {
            return ((this._flags & flags) == flags);
        }
	});
	
	Object.defineProperties(TableRow.prototype,{
        /// <summary>
        /// RowGroup owner accessor
        /// </summary> 
//        internal TableRowGroup 
		RowGroup:
        { 
            get:function() 
            {
                return (this.Parent instanceof TableRowGroup ? this.Parent : null); 
            }
        },

        /// <summary> 
        /// Table owner accessor
        /// </summary> 
//        internal Table 
        Table: { get:function() { return (this.RowGroup != null ? this.RowGroup.Table : null); } }, 

        /// <summary> 
        /// Returns the row's cell collection
        /// </summary>
//        public TableCellCollection 
        Cells: { get:function() { return (this._cells); } }, 

        /// <summary> 
        /// Row's index in the parents collection.
        /// </summary> 
//        internal int 
        Index:
        {
            get:function()
            { 
                return (this._parentIndex);
            }, 
            set:function(value) 
            {
//                Debug.Assert(value >= -1 && this._parentIndex != value); 
            	this._parentIndex = value;
            }
        },
 
        /// <summary>
        /// Stores temporary data for where to insert a new cell
        /// </summary>
//        internal int 
        InsertionIndex: 
        {
            get:function() { return this._cellInsertionIndex; }, 
            setset:function(value)  { this._cellInsertionIndex = value; } 
        },
 
        /// <summary>
        /// Returns span cells vector
        /// </summary>
//        internal TableCell[] 
        SpannedCells: 
        {
            get:function() { return (this._spannedCells); } 
        }, 

        /// <summary> 
        /// Count of columns in the table
        /// </summary>
//        internal int 
        ColumnCount:
        { 
            get:function()
            { 
                return (this._columnCount); 
            }
        }, 

        /// <summary>
        /// Returns "true" if there are row spanned cells belonging to previous rows
        /// </summary> 
//        internal bool 
        HasForeignCells:
        { 
            get:function() { return (this.CheckFlags(Flags.HasForeignCells)); } 
        },
 
        /// <summary>
        /// Returns "true" if there are row spanned cells belonging to previous rows
        /// </summary>
//        internal bool 
        HasRealCells: 
        {
            get:function() { return (this.CheckFlags(Flags.HasRealCells)); } 
        }, 

        /// <summary> 
        /// Count of columns in the table
        /// </summary>
//        internal int 
        FormatCellCount:
        { 
            get:function()
            { 
                return (this._formatCellCount); 
            }
        }, 

        /// <summary>
        /// Marks this element's left edge as visible to IMEs.
        /// This means element boundaries will act as word breaks. 
        /// </summary>
//        internal override bool 
        IsIMEStructuralElement: 
        { 
            get:function()
            { 
                return true;
            }
        }

	});
	
	Object.defineProperties(TableRow,{
	});
	
	TableRow.Type = new Type("TableRow", TableRow, [TextElement.Type, IAddChild.Type, IIndexedChild.Type, IAcceptInsertion.Type]);
	return TableRow;
});
//        private TableCellCollection _cells;             //  collection of cells belonging to the row 
//        private TableCell[] _spannedCells;              //  row spanned cell storage 
//
//        private int _parentIndex;                       //  row's index in parent's children collection 
//        private int _cellInsertionIndex;                // Insertion index a cell
//        private int _columnCount;
//
//        private Flags _flags;                           //  flags reflecting various aspects of row's state 
//        private int _formatCellCount;                   //  count of the cell to be formatted in this row



