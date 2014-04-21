/**
 * TableRowGroup
 */

define(["dojo/_base/declare", "system/Type", "windows/TextElement", "generic/List", "documents/TableRow"], 
		function(declare, Type, TextElement, List, TableRow){
	var TableRowGroup = declare("TableRowGroup", [TextElement, IAddChild, IIndexedChild, IAcceptInsertion],{
		constructor:function(){
			this.Initialize();
			
//	        private TableRowCollection _rows;               //  children rows store 
//	        private int _parentIndex;                       //  row group's index in parent's children collection 
//	        private int _rowInsertionIndex;                 //  Insertion index for row
//	        private int _columnCount;                       //  Column count. 
		},
		
		 // common initialization for all constructors
//        private void 
		Initialize:function() 
        { 
            this._rows = new List();
            this._rowInsertionIndex = -1; 
            this._parentIndex = -1;
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

            var row = value instanceof TableRow ? value : null; 
            if (row != null) 
            {
                this.Rows.Add(row); 

                return;
            }
 
            throw (new ArgumentException(SR.Get(SRID.UnexpectedParameterType, value.GetType(), typeof(TableRow)), "value"));
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
        /// Callback used to notify the RowGroup about entering model tree. 
        /// </summary>
//        internal void 
        OnEnterParentTree:function()
        {
            if(this.Table != null) 
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
        /// Callback used to notify the RowGroup about exitting model tree. 
        /// </summary>
//        internal void 
        OnAfterExitParentTree:function(/*Table*/ table)
        {
            table.OnStructureChanged(); 
        },
 
        /// <summary> 
        /// ValidateStructure
        /// </summary> 
//        internal void 
        ValidateStructure:function()
        {
            /*RowSpanVector*/var rowSpanVector = new RowSpanVector();
 
            this._columnCount = 0;
 
            for (var i = 0; i < this.Rows.Count; ++i) 
            {
                this.Rows[i].ValidateStructure(rowSpanVector); 

                this._columnCount = Math.Max(this._columnCount, this.Rows[i].ColumnCount);
            }
 
            this.Table.EnsureColumnCount(this._columnCount);
        },
        
        /// <summary>
        /// Called when body receives a new parent (via OM or text tree)
        /// </summary> 
        /// <param name="newParent">
        /// New parent of body 
        /// </param> 
//        internal override void 
        OnNewParent:function(/*DependencyObject*/ newParent)
        { 
            /*DependencyObject*/var oldParent = this.Parent;

            if (newParent != null && !(newParent instanceof Table))
            { 
                throw new InvalidOperationException(SR.Get(SRID.TableInvalidParentNodeType, newParent.GetType().ToString()));
            } 
 
            if (oldParent != null)
            { 
                this.OnExitParentTree();
                oldParent.RowGroups.InternalRemove(this);
                this.OnAfterExitParentTree(oldParent instanceof Table ? oldParent : null);
            } 

            TextElement.prototype.OnNewParent.call(this, newParent); 
 
            if (newParent != null)
            { 
                newParent.RowGroups.InternalAdd(this);
                this.OnEnterParentTree();
            }
        } 
	});
	
	Object.defineProperties(TableRowGroup.prototype,{
        /// <summary>
        /// Returns the row group's row collection 
        /// </summary>
//        public TableRowCollection 
		Rows:
        { 
            get:function()
            { 
                return (this._rows); 
            }
        },
        
        /// <summary>
        /// Table owner accessor
        /// </summary>
//        internal Table 
        Table:
        {
            get:function() 
            { 
                return this.Parent instanceof Table ? this.Parent : null;
            } 
        },

        /// <summary>
        /// RowGroup's index in the parents row group collection. 
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
//                Debug.Assert(value >= -1 && _parentIndex != value);
                this._parentIndex = value; 
            } 
        },
 
        /// <summary> 
        /// Stores temporary data for where to insert a new row
        /// </summary> 
//        internal int 
        InsertionIndex:
        {
            get:function() { return _rowInsertionIndex; },
            set:function(value) { _rowInsertionIndex = value; } 
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
	
	Object.defineProperties(TableRowGroup,{
		  
	});
	
	TableRowGroup.Type = new Type("TableRowGroup", TableRowGroup, 
			[TextElement, IAddChild, IIndexedChild, IAcceptInsertion.Type]);
	return TableRowGroup;
});
