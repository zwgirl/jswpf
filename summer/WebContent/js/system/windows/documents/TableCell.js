/**
 * TableCell
 */

define(["dojo/_base/declare", "system/Type", "documents/TextElement", "IIndexedChild", "windows/FrameworkPropertyMetadata",
        "windows/FrameworkPropertyMetadataOptions", "windows/PropertyChangedCallback", "windows/ValidateValueCallback"], 
		function(declare, Type, TextElement, IIndexedChild, FrameworkPropertyMetadata,
				FrameworkPropertyMetadataOptions, PropertyChangedCallback, ValidateValueCallback){
	var TableCell = declare("TableCell", [TextElement, IIndexedChild],{
		constructor:function(/*Block*/ blockItem){
			if(blockItem === undefined){
				blockItem = null;
			}
			this.PrivateInitialize();
			
            if (blockItem != null)
            { 
                this.Blocks.Add(blockItem);
            }
		},
		
        /// <summary>
        /// Called when tablecell gets new parent 
        /// </summary> 
        /// <param name="newParent">
        /// New parent of cell 
        /// </param>
//        internal override void 
		OnNewParent:function(/*DependencyObject*/ newParent)
        {
            /*DependencyObject*/var oldParent = this.Parent; 
            var newParentTR = newParent instanceof TableRow ? newParent : null;
 
            if((newParent != null) && (newParentTR == null)) 
            {
                throw new InvalidOperationException(SR.Get(SRID.TableInvalidParentNodeType, newParent.GetType().ToString())); 
            }

            if(oldParent != null)
            { 
                oldParent.Cells.InternalRemove(this);
            } 
 
            base.OnNewParent(newParent);
 
            if ((newParentTR != null) && (newParentTR.Cells != null)) // keep PreSharp happy
            {
                newParentTR.Cells.InternalAdd(this);
            } 
        },
        
      /// <summary> 
        /// Callback used to notify the Cell about entering model tree.
        /// </summary> 
//        internal void 
        OnEnterParentTree:function()
        {
            if(Table != null)
            { 
                Table.OnStructureChanged();
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
        /// Callback used to notify the Cell after it has exitted model tree. (Structures are all updated)
        /// </summary> 
//        internal void 
        OnAfterExitParentTree:function(/*TableRow*/ row)
        {
            if(row.Table != null)
            { 
                row.Table.OnStructureChanged();
            } 
        }, 

 
        /// <summary>
        /// ValidateStructure -- caches column index
        /// </summary>
//        internal void 
        ValidateStructure:function(/*int*/ columnIndex) 
        {
//            Invariant.Assert(columnIndex >= 0); 
 
            this._columnIndex = columnIndex;
        }, 

   
        /// <summary>
        /// Private ctor time initialization. 
        /// </summary>
//        private void 
        PrivateInitialize:function() 
        { 
        	this._parentIndex = -1;
        	this._columnIndex = -1; 
        },
        
        
	});
	
	Object.defineProperties(TableCell.prototype,{
	     /// <value>
        /// Collection of Blocks contained in this Section. 
        /// </value>
//        public BlockCollection 
		Blocks:
        { 
            get:function()
            { 
//                return new BlockCollection(this, /*isOwnerParent*/true); 
                if(this._blocks === undefined){
                	this._blocks = new List();
                }
                
                return this._blocks;
            }
        },

        /// <summary>
        /// Column span property.
        /// </summary> 
//        public int 
        ColumnSpan:
        { 
            get:function() { return this.GetValue(TableCell.ColumnSpanProperty); }, 
            set:function(value) { this.SetValue(TableCell.ColumnSpanProperty, value); }
        }, 

        /// <summary>
        /// Row span property.
        /// </summary> 
//        public int 
        RowSpan:
        { 
            get:function() { return this. GetValue(TableCell.RowSpanProperty); }, 
            set:function(value) { this.SetValue(TableCell.RowSpanProperty, value); }
        },
        
        /// <summary>
        /// The Padding property specifies the padding of the element.
        /// </summary> 
//        public Thickness 
        Padding:
        { 
            get:function() { return this.GetValue(TableCell.PaddingProperty); }, 
            set:function(value) { this.SetValue(TableCell.PaddingProperty, value); }
        },
        
        /// <summary>
        /// The BorderThickness property specifies the border of the element. 
        /// </summary>
//        public Thickness 
        BorderThickness: 
        { 
            get:function() { return this.GetValue(TableCell.BorderThicknessProperty); },
            set:function(value) { this.SetValue(TableCell.BorderThicknessProperty, value); } 
        },

        /// <summary> 
        /// The BorderBrush property specifies the brush of the border.
        /// </summary> 
//        public Brush 
        BorderBrush: 
        {
            get:function() { return this.GetValue(TableCell.BorderBrushProperty); }, 
            set:function(value) { this.SetValue(TableCell.BorderBrushProperty, value); }
        },

        /// <summary>
        ///
        /// </summary>
//        public TextAlignment 
        TextAlignment: 
        {
            get:function() { return this.GetValue(TableCell.TextAlignmentProperty); }, 
            set:function(value) { this.SetValue(TableCell.TextAlignmentProperty, value); } 
        },
 
        /// <summary> 
        /// The FlowDirection property specifies the flow direction of the element.
        /// </summary> 
//        public FlowDirection 
        FlowDirection:
        {
            get:function() { return this.GetValue(TableCell.FlowDirectionProperty); },
            set:function(value) { this.SetValue(TableCell.FlowDirectionProperty, value); } 
        },
 
        /// <summary> 
        /// The LineHeight property specifies the height of each generated line box.
        /// </summary> 
//        public double 
        LineHeight:
        { 
            get:function() { return this.GetValue(TableCell.LineHeightProperty); },
            set:function(value) { this.SetValue(TableCell.LineHeightProperty, value); }
        },
 
        /// <summary>
        /// The LineStackingStrategy property specifies how lines are placed
        /// </summary> 
//        public LineStackingStrategy 
        LineStackingStrategy:
        { 
            get:function() { return this.GetValue(TableCell.LineStackingStrategyProperty); },
            set:function(value) { this.SetValue(TableCell.LineStackingStrategyProperty, value); }
        },
        
        /// <summary> 
        /// Row owner accessor
        /// </summary> 
//        internal TableRow 
        Row: { get:function() { return this.Parent instanceof TableRow ? this.Parent : null; } }, 

        /// <summary> 
        /// Table owner accessor
        /// </summary>
//        internal Table 
        Table: { get:function() { return this.Row != null ? this.Row.Table : null; } },
 
        /// <summary>
        /// Cell's index in the parents collection. 
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
        /// Returns cell's parenting row index. 
        /// </summary>
//        internal int 
        RowIndex: 
        { 
            get:function()
            { 
                return (this.Row.Index);
            }
        },
 
        /// <summary>
        /// Returns cell's parenting row group index. 
        /// </summary> 
//        internal int 
        RowGroupIndex:
        { 
            get:function()
            {
                return (this.Row.RowGroup.Index);
            } 
        },
 
        /// <summary> 
        /// Returns or sets cell's parenting column index.
        /// </summary> 
        /// <remarks>
        /// Called by the parent Row during (re)build of the StructuralCache.
        /// Change of column index causes Layout Dirtyness of the cell.
        /// </remarks> 
//        internal int 
        ColumnIndex:
        { 
            get:function()
            {
                return (this._columnIndex); 
            },
            set:function(value)
            {
            	this._columnIndex = value; 
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
	
	Object.defineProperties(TableCell,{
		 
        /// <summary>
        /// DependencyProperty for <see cref="Padding" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		PaddingProperty:
        {
        	get:function(){
            	if(TableCell._PaddingProperty === undefined){
            		TableCell._PaddingProperty = 
                        Block.PaddingProperty.AddOwner(
                                TableCell.Type, 
                                /*new FrameworkPropertyMetadata( 
                                        new Thickness(),
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)*/
                                FrameworkPropertyMetadata.Build2( 
                                        new Thickness(),
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)); 
            	}
            	
            	return TableCell._PaddingProperty;
        	}
        }, 
        
        /// <summary>
        /// DependencyProperty for <see cref="BorderThickness" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		BorderThicknessProperty:
        {
        	get:function(){
            	if(TableCell._BorderThicknessProperty === undefined){
            		TableCell._BorderThicknessProperty =
                        Block.BorderThicknessProperty.AddOwner( 
                                TableCell.Type, 
                                /*new FrameworkPropertyMetadata(
                                        new Thickness(), 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)*/
                                FrameworkPropertyMetadata.Build2(
                                        new Thickness(), 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)); 
            	}
            	
            	return TableCell._BorderThicknessProperty;
        	}
        }, 
        /// <summary>
        /// DependencyProperty for <see cref="BorderBrush" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		BorderBrushProperty:
        {
        	get:function(){
            	if(TableCell._BorderBrushProperty === undefined){
            		TableCell._BorderBrushProperty  = 
                        Block.BorderBrushProperty.AddOwner( 
                                TableCell.Type,
                                /*new FrameworkPropertyMetadata( 
                                        null,
                                        FrameworkPropertyMetadataOptions.AffectsRender)*/
                                FrameworkPropertyMetadata.Build2( 
                                        null,
                                        FrameworkPropertyMetadataOptions.AffectsRender));
            	}
            	
            	return TableCell._BorderBrushProperty;
        	}
        },
        /// <summary> 
        /// DependencyProperty for <see cref="TextAlignment" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		TextAlignmentProperty:
        {
        	get:function(){
            	if(TableCell._TextAlignmentProperty === undefined){
            		TableCell._TextAlignmentProperty = 
                        Block.TextAlignmentProperty.AddOwner(TableCell.Type);
            	}
            	
            	return TableCell._TextAlignmentProperty;
        	}
        }, 
        
        /// <summary>
        /// DependencyProperty for <see cref="FlowDirection" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		FlowDirectionProperty:
        {
        	get:function(){
            	if(TableCell._FlowDirectionProperty === undefined){
            		TableCell._FlowDirectionProperty = 
                        Block.FlowDirectionProperty.AddOwner(TableCell.Type);
            	}
            	
            	return TableCell._FlowDirectionProperty;
        	}
        }, 
        
        /// <summary> 
        /// DependencyProperty for <see cref="LineHeight" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		LineHeightProperty:
        {
        	get:function(){
            	if(TableCell._LineHeightProperty === undefined){
            		TableCell._LineHeightProperty =
                        Block.LineHeightProperty.AddOwner(TableCell.Type); 
            	}
            	
            	return TableCell._LineHeightProperty;
        	}
        }, 
        
        /// <summary>
        /// DependencyProperty for <see cref="LineStackingStrategy" /> property. 
        /// </summary> 
//        public static readonly DependencyProperty 
		LineStackingStrategyProperty:
        {
        	get:function(){
            	if(TableCell._LineStackingStrategyProperty === undefined){
            		TableCell._LineStackingStrategyProperty =
                        Block.LineStackingStrategyProperty.AddOwner(TableCell.Type);  
            	}
            	
            	return TableCell._LineStackingStrategyProperty;
        	}
        },
        
        /// <summary>
        /// Column span property.
        /// </summary>
//        public static readonly DependencyProperty 
		ColumnSpanProperty:
        {
        	get:function(){
            	if(TableCell._ColumnSpanProperty === undefined){
            		TableCell._ColumnSpanProperty = 
                        DependencyProperty.Register(
                                "ColumnSpan", 
                                Number.Type, 
                                TableCell.Type,
                                /*new FrameworkPropertyMetadata( 
                                        1,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(null, OnColumnSpanChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB( 
                                        1,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(null, OnColumnSpanChanged)),
                                new ValidateValueCallback(null, IsValidColumnSpan)); 
            	}
            	
            	return TableCell._ColumnSpanProperty;
        	}
        },

        /// <summary> 
        /// Row span property. 
        /// </summary>
//        public static readonly DependencyProperty 
		RowSpanProperty:
        {
        	get:function(){
            	if(TableCell._RowSpanProperty === undefined){
            		TableCell._RowSpanProperty = 
                        DependencyProperty.Register(
                                "RowSpan",
                                Number.Type,
                                TableCell.Type, 
                                /*new FrameworkPropertyMetadata(
                                        1, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(null, OnRowSpanChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        1, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(null, OnRowSpanChanged)),
                                new ValidateValueCallback(null, IsValidRowSpan));  
            	}
            	
            	return TableCell._RowSpanProperty;
        	}
        },
        
	});
	
	/// <summary>
    /// <see cref="DependencyProperty.ValidateValueCallback"/> 
    /// </summary>
//    private static bool 
	function IsValidRowSpan(/*object*/ value) 
    { 
        // Maximum row span is limited to 1000000. We do not have any limits from PTS or other formatting restrictions for this value.
        var span = value; 
        return (span >= 1 && span <= 1000000);
    }

	var maxSpan  = 1000;
    /// <summary> 
    /// <see cref="DependencyProperty.ValidateValueCallback"/>
    /// </summary> 
//    private static bool 
	function IsValidColumnSpan(/*object*/ value) 
    {
        return (value >= 1 && value <= maxSpan);
    }

    /// <summary>
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/> 
    /// </summary> 
//    private static void 
	function OnColumnSpanChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        TableCell cell = (TableCell) d;

        if(d.Table != null)
        { 
            d.Table.OnStructureChanged();
        } 
    }

    /// <summary> 
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/>
    /// </summary> 
//    private static void 
    function OnRowSpanChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        TableCell cell = (TableCell) d;

        if(d.Table != null)
        { 
            d.Table.OnStructureChanged(); 
        }
    } 
	
	TableCell.Type = new Type("TableCell", TableCell, [TextElement.Type, IIndexedChild.Type]);
	return TableCell;
});
//        private int _parentIndex;                               //  cell's index in parent's children collection 
//        private int _columnIndex;                               // Column index for cell. 
       

        

