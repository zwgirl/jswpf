/**
 * Table
 */

define(["dojo/_base/declare", "system/Type", "documents/Block"], 
		function(declare, Type, Block){
	
//    private enum 
	var ChildrenTypes =declare(null, {});
	ChildrenTypes.BeforeFirst     = 0; 
	ChildrenTypes.Columns         = 1; 
	ChildrenTypes.RowGroups       = 2;
	ChildrenTypes.AfterLast       = 3; 
    
    /// <summary>
    /// Implementation of a simple enumerator of table's children
    /// </summary>
//    private class 
	var TableChildrenCollectionEnumeratorSimple =declare(IEnumerator, {
        constructor:function(/*Table*/ table) 
        { 
            this._table = table; 
            this._version = this._table._version;
            this._columns = this._table._columns.GetEnumerator();
            this._rowGroups = this._table._rowGroups.GetEnumerator();
        }, 

//        public Object 
		Clone:function() 
        { 
            return (MemberwiseClone());
        }, 

//        public bool 
        MoveNext:function()
        {
            if (this._version != this._table._version) 
            {
                throw new InvalidOperationException(SR.Get(SRID.EnumeratorVersionChanged)); 
            } 

            // Strange design, but iterator must spin on contained column iterator 
            if ((this._currentChildType != ChildrenTypes.Columns) && (this._currentChildType != ChildrenTypes.RowGroups))
            	this._currentChildType++;

            var currentChild = null; 

            while (this._currentChildType < ChildrenTypes.AfterLast) 
            { 
                switch (_currentChildType)
                { 
                    case (ChildrenTypes.Columns):
                        if (this._columns.MoveNext())
                        {
                            currentChild = this._columns.Current; 
                        }
                        break; 
                    case (ChildrenTypes.RowGroups): 
                        if (this._rowGroups.MoveNext())
                        { 
                            currentChild = this._rowGroups.Current;
                        }
                        break;
                } 

                if (currentChild != null) 
                { 
                	this._currentChild = currentChild;
                    break; 
                }

                this._currentChildType++;
            } 

//            Debug.Assert(_currentChildType != ChildrenTypes.BeforeFirst); 
            return (this._currentChildType != ChildrenTypes.AfterLast); 
        },

//        public void 
        Reset:function()
        {
            if (this._version != this._table._version) 
            {
                throw new InvalidOperationException(SR.Get(SRID.EnumeratorVersionChanged)); 
            } 

            this._columns.Reset(); 
            this._rowGroups.Reset();
            this._currentChildType = ChildrenTypes.BeforeFirst;
            this._currentChild = null;
        }

//        private Table _table; 
//        private int _version; 
//        private IEnumerator _columns;
//        private IEnumerator _rowGroups; 
//        private ChildrenTypes _currentChildType;
//        private Object _currentChild;


    });
	
	Object.defineProperties(TableChildrenCollectionEnumeratorSimple.prototype, {
//		public Object
		Current:
        {
            get:function()
            { 
                if (this._currentChildType == ChildrenTypes.BeforeFirst)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.EnumeratorNotStarted));
                } 
                if (this._currentChildType == ChildrenTypes.AfterLast)
                {
                    throw new InvalidOperationException(SR.Get(SRID.EnumeratorReachedEnd)); 
                }

                return (this._currentChild); 
            }
        } 
	});

//	private const double 
	var c_defaultCellSpacing = 2;  //  default value of cell spacing 
	var Table = declare("Table", [Block, IAddChild, IAcceptInsertion],{
		constructor:function(){
			PrivateInitialize();
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

            var rowGroup = value instanceof TableRowGroup ? value : null; 
            if (rowGroup != null)
            { 
                this.RowGroups.Add(rowGroup); 
                return;
            } 

            throw (new ArgumentException(SR.Get(SRID.UnexpectedParameterType, value.GetType(), typeof(TableRowGroup)), "value"));
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
        ///     Initialization of this element is about to begin
        /// </summary> 
//        public override void 
        BeginInit:function() 
        {
            base.BeginInit(); 
            this._initializing = true;
        },

        /// <summary> 
        ///     Initialization of this element has completed
        /// </summary> 
//        public override void 
        EndInit:function() 
        {
        	this._initializing = false; 
        	this.OnStructureChanged();
            base.EndInit();
        },

        /// <summary>
        /// Updates table actual column count
        /// </summary>
        /// <param name="columnCount">Count of column to account for</param> 
//        internal void 
        EnsureColumnCount:function(/*int*/ columnCount)
        { 
            if (this._columnCount < columnCount) 
            	this._columnCount = columnCount;
        }, 

        /// <summary>
        /// OnStructureChanged - Called to rebuild structure.
        /// </summary> 
//        internal void 
        OnStructureChanged:function()
        { 
            if (!this._initializing) 
            {
                if (this.TableStructureChanged != null) 
                {
                	this.TableStructureChanged.Invoke(this, EventArgs.Empty);
                }
 
                this.ValidateStructure();
            } 
        },
 
        /// <summary> 
        /// ValidateStructure
        /// </summary> 
//        internal void 
        ValidateStructure:function()
        {
            if (!this._initializing)
            { 
                //
                //  validate row groups structural cache 
                // 
            	this._columnCount = 0;
                for (var i = 0; i < this._rowGroups.Count; ++i) 
                {
                	this._rowGroups[i].ValidateStructure();
                }
 
                this._version++;
            } 
        },

        /// <summary> 
        /// Notifies the text container that some property change has occurred, requiring a revalidation of table.
        /// </summary>
//        internal void 
        InvalidateColumns:function()
        { 
        	this.NotifyTypographicPropertyChanged(true /* affectsMeasureOrArrange */, true /* localValueChanged */, null);
        }, 
 
        /// <summary>
        /// Returns true if the given rowGroupIndex is the first non-empty one 
        /// </summary>
//        internal bool 
        IsFirstNonEmptyRowGroup:function(/*int*/ rowGroupIndex)
        {
            rowGroupIndex--; 

            while(rowGroupIndex >= 0) 
            { 
                if(RowGroups[rowGroupIndex].Rows.Count > 0)
                { 
                    return false;
                }

                rowGroupIndex--; 
            }
 
            return true; 
        },
 
        /// <summary>
        /// Returns true if the given rowGroupIndex is the last non-empty one
        /// </summary>
//        internal bool 
        IsLastNonEmptyRowGroup:function(/*int*/ rowGroupIndex) 
        {
            rowGroupIndex++; 
 
            while(rowGroupIndex < RowGroups.Count)
            { 
                if(RowGroups[rowGroupIndex].Rows.Count > 0)
                {
                    return false;
                } 

                rowGroupIndex++; 
            } 

            return true; 
        },
 
        /// <summary>
        /// Private ctor time initialization.
        /// </summary> 
//        private void 
        PrivateInitialize:function()
        { 
            // Acquire new PTS Context. 
        	this._columns = new TableColumnCollection(this);
        	this._rowGroups = new TableRowGroupCollection(this); 
        	this._rowGroupInsertionIndex = -1;
        }
	});
	
	Object.defineProperties(Table.prototype,{
        /// <summary>
        /// <see cref="FrameworkContentElement.LogicalChildren"/> 
        /// </summary> 
        /// <remarks>
        /// children enumerated in the following order: 
        /// * columns
        /// * rowgroups
        /// </remarks>
//        protected internal override IEnumerator 
		LogicalChildren: 
        {
            get:function() { return (new TableChildrenCollectionEnumeratorSimple(this)); } 
        }, 
 
        /// <summary>
        /// Returns table column collection.
        /// </summary>
//        public TableColumnCollection 
        Columns: { get:function() { return (this._columns); } },
 
        /// <summary>
        /// Returns table row group. 
        /// </summary>
//        public TableRowGroupCollection 
        RowGroups:
        { 
            get:function() { return (this._rowGroups); }
        }, 
 
        /// <summary>
        /// Cell spacing property. 
        /// </summary>
//        public double 
        CellSpacing:
        { 
            get:function() { return this.GetValue(CellSpacingProperty); },
            set:function(value) { this.SetValue(CellSpacingProperty, value); } 
        }, 
 
        /// <summary>
        /// Internal cell spacing getter
        /// </summary> 
//        internal double 
        InternalCellSpacing:
        { 
            get:function() { return Math.max(this.CellSpacing, 0); } 
        },
 
        /// <summary> 
        /// Stores temporary data for where to insert a new row group 
        /// </summary>
//        internal int 
        InsertionIndex:
        {
            get:function() { return this._rowGroupInsertionIndex; },
            set:function(value) { this._rowGroupInsertionIndex = value; }
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
        /// Fired when the table changes structurally 
        /// </summary> 
//        internal event EventHandler 
        TableStructureChanged:
        {
        	get:function(){
        		if(Table._TableStructureChanged === undefined){
        			Table._TableStructureChanged = new EventHandler();
        		}
        		
        		return Table._TableStructureChanged;
        	}
        }

	});
	
	Object.defineProperties(Table,{
		/// <summary>
        /// Cell spacing property. 
        /// </summary> 
//        public static readonly DependencyProperty 
		CellSpacingProperty:
        {
        	get:function(){
            	if(Table._ForegroundProperty === undefined){
            		Table._ForegroundProperty =
                        DependencyProperty.Register( 
                                "CellSpacing",
                                Number.Type,
                                Table.Type,
                                /*new FrameworkPropertyMetadata( 
                                        c_defaultCellSpacing,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)*/
                                FrameworkPropertyMetadata.Build2( 
                                        c_defaultCellSpacing,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure), 
                                new ValidateValueCallback(null, IsValidCellSpacing)); 
            	}
            	
            	return Table._ForegroundProperty;
        	}
        },
	});
	
    /// <summary> 
    /// Static ctor.  Initializes property metadata.
    /// </summary> 
//    static Table() 
	function Initialize()
    {
        MarginProperty.OverrideMetadata(Table.Type, new FrameworkPropertyMetadata(new Thickness(Number.NaN))); 
    };

//    private static bool 
	function IsValidCellSpacing(/*object*/ o) 
    {
        var spacing = o; 
        var maxSpacing = Math.min(1000000, PTS.MaxPageSize); 
        if (Double.IsNaN(spacing))
        { 
            return false;
        }
        if (spacing < 0 || spacing > maxSpacing)
        { 
            return false;
        } 
        return true; 
    }
	
	Table.Type = new Type("Table", Table, [Block.Type, IAddChild.Type, IAcceptInsertion.Type]);
	return Table;
});

//        private TableColumnCollection _columns;         //  collection of columns
//        private TableRowGroupCollection _rowGroups;     //  collection of row groups
//        private int _rowGroupInsertionIndex;            //  insertion index used by row group collection
//        
//        private int _columnCount;
//        private int _version = 0; 
//        private bool _initializing;                     //  True if the table is being initialized 
//        internal int ParanoiaVersion = 0; 
