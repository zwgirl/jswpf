/**
 * Grid
 */

define(["dojo/_base/declare", "system/Type", "controls/Panel", "markup/IAddChild", "windows/UIElement",
        "collections/IComparer", "controls/DefinitionCollection", "controls/RowDefinition", "controls/ColumnDefinition"], 
		function(declare, Type, Panel, IAddChild, UIElement,
				IComparer, DefinitionCollection, RowDefinition, ColumnDefinition){
	
    /// <summary>
    /// Extended data instantiated on demand, when grid handles non-trivial case. 
    /// </summary>
//    private class 
    var ExtendedData =declare(null, {});
    
    Object.defineProperties(ExtendedData.prototype, { 
//        internal ColumnDefinitionCollection 
    	ColumnDefinitions: //  collection of column definitions (logical tree support)
    	{
    		get:function(){
    			return this._ColumnDefinitions;
    		},
    		set:function(value) {
    			this._ColumnDefinitions = value;
    		}
    	},
//        internal RowDefinitionCollection 
    	RowDefinitions://  collection of row definitions (logical tree support) 
    	{
    		get:function(){
    			return this._RowDefinitions;
    		},
    		set:function(value) {
    			this._RowDefinitions = value;
    		}
    	},        
//        internal DefinitionBase[] 
    	DefinitionsU: //  collection of column definitions used during calc
    	{
    		get:function(){
    			return this._DefinitionsU;
    		},
    		set:function(value) {
    			this._DefinitionsU = value;
    		}
    	},                
//        internal DefinitionBase[] 
    	DefinitionsV://  collection of row definitions used during calc
    	{
    		get:function(){
    			return this._DefinitionsV;
    		},
    		set:function(value) {
    			this._DefinitionsV = value;
    		}
    	},                 
//        internal CellCache[] 
    	CellCachesCollection://  backing store for logical children
    	{
    		get:function(){
    			return this._CellCachesCollection;
    		},
    		set:function(value) {
    			this._CellCachesCollection = value;
    		}
    	},              
//        internal int 
    	CellGroup1://  index of the first cell in first cell group 
    	{
    		get:function(){
    			return this._CellGroup1;
    		},
    		set:function(value) {
    			this._CellGroup1 = value;
    		}
    	},                                
//        internal int 
    	CellGroup2://  index of the first cell in second cell group
    	{
    		get:function(){
    			return this._CellGroup2;
    		},
    		set:function(value) {
    			this._CellGroup2 = value;
    		}
    	},                                
//        internal int 
    	CellGroup3://  index of the first cell in third cell group 
    	{
    		get:function(){
    			return this._CellGroup3;
    		},
    		set:function(value) {
    			this._CellGroup3 = value;
    		}
    	},                                
//        internal int 
    	CellGroup4://  index of the first cell in forth cell group
    	{
    		get:function(){
    			return this._CellGroup4;
    		},
    		set:function(value) {
    			this._CellGroup4 = value;
    		}
    	},                                 
//        internal DefinitionBase[] 
    	TempDefinitions://  temporary array used during layout for various purposes
            //  TempDefinitions.Length == Max(definitionsU.Length, definitionsV.Length)
    	{
    		get:function(){
    			return this._TempDefinitions;
    		},
    		set:function(value) {
    			this._TempDefinitions = value;
    		}
    	},               
    });
    
    /// <summary> 
    /// LayoutTimeSizeType is used internally and reflects layout-time size type.
    /// </summary>
//    [System.Flags]
//    internal enum 
    var LayoutTimeSizeType =declare(null, {});
    LayoutTimeSizeType.None        = 0x00; 
    LayoutTimeSizeType.Pixel       = 0x01; 
    LayoutTimeSizeType.Auto        = 0x02;
    LayoutTimeSizeType.Star        = 0x04; 

    /// <summary> 
    /// CellCache stored calculated values of
    /// 1. attached cell positioning properties; 
    /// 2. size type; 
    /// 3. index of a next cell in the group;
    /// </summary> 
//    private struct 
    var CellCache = declare(null, {});
    
    Object.defineProperties(CellCache.prototype, {
//        internal int 
    	ColumnIndex:{set:function(){return this._ColumnIndex;}, set:function(value){this._ColumnIndex = value;}},
//        internal int 
    	RowIndex:{set:function(){return this._RowIndex;}, set:function(value){this._RowIndex = value;}}, 
//        internal int 
    	ColumnSpan:{set:function(){return this._ColumnSpan;}, set:function(value){this._ColumnSpan = value;}},
//        internal int 
    	RowSpan:{set:function(){return this._RowSpan;}, set:function(value){this._RowSpan = value;}}, 
//        internal LayoutTimeSizeType 
    	SizeTypeU:{set:function(){return this._SizeTypeU;}, set:function(value){this._SizeTypeU = value;}}, 
//        internal LayoutTimeSizeType 
    	SizeTypeV:{set:function(){return this._SizeTypeV;}, set:function(value){this._SizeTypeV = value;}},
//        internal int 
    	Next:{set:function(){return this._Next;}, set:function(value){this._Next = value;}}, 
//        internal bool 
    	IsStarU: { get:function() { return ((this.SizeTypeU & LayoutTimeSizeType.Star) != 0); } },
//        internal bool 
    	IsAutoU: { get:function() { return ((this.SizeTypeU & LayoutTimeSizeType.Auto) != 0); } },
//        internal bool 
    	IsStarV: { get:function() { return ((this.SizeTypeV & LayoutTimeSizeType.Star) != 0); } },
//        internal bool 
    	IsAutoV: { get:function() { return ((this.SizeTypeV & LayoutTimeSizeType.Auto) != 0); } }, 
    });
    
    

    /// <summary> 
    /// Helper class for representing a key for a span in hashtable.
    /// </summary> 
//    private class 
    var SpanKey = declare(null, {
        /// <summary>
        /// Constructor. 
        /// </summary>
        /// <param name="start">Starting index of the span.</param> 
        /// <param name="count">Span count.</param> 
        /// <param name="u"><c>true</c> for columns; <c>false</c> for rows.</param>
        construcor:function(/*int*/ start, /*int*/ count, /*bool*/ u) 
        {
            this._start = start;
            this._count = count;
            this._u = u; 
        },

        /// <summary> 
        /// <see cref="object.GetHashCode"/>
        /// </summary> 
//        public override int 
        GetHashCode:function()
        {
            var hash = (this._start ^ (this._count << 2));

            if (this._u) hash &= 0x7ffffff;
            else    hash |= 0x8000000; 

            return (hash);
        },

        /// <summary>
        /// <see cref="object.Equals(object)"/>
        /// </summary> 
//        public override bool 
        Equals:function(/*object*/ obj)
        { 
            var sk = obj instanceof SpanKey ? obj : null; 
            return (    sk != null
                    &&  sk._start == this._start 
                    &&  sk._count == this._count
                    &&  sk._u == this._u );
        }
    });
    
    Object.defineProperties(SpanKey, {

        /// <summary>
        /// Returns start index of the span. 
        /// </summary> 
//        internal int 
    	Start: { get:function() { return (this._start); } },

        /// <summary>
        /// Returns span count.
        /// </summary>
//        internal int 
    	Count: { get:function() { return (this._count); } }, 

        /// <summary> 
        /// Returns <c>true</c> if this is a column span. 
        /// <c>false</c> if this is a row span.
        /// </summary> 
//        internal bool 
    	U: { get:function() { return (this._u); } },
    });

    /// <summary>
    /// SpanPreferredDistributionOrderComparer. 
    /// </summary>
//    private class 
    var SpanPreferredDistributionOrderComparer =declare(IComparer, {
//        public int 
    	Compare:function(/*object*/ x, /*object*/ y) 
        {
            /*DefinitionBase*/var definitionX = x instanceof DefinitionBase ? x : null; 
            /*DefinitionBase*/var definitionY = y instanceof DefinitionBase ? y : null;  


            var b = CompareNullRefs(definitionX, definitionY, /*out result*/{"result" : result});
            var result = resultOut.result;
            if (!b)
            {
                if (definitionX.UserSize.IsAuto) 
                {
                    if (definitionY.UserSize.IsAuto) 
                    { 
                        result = definitionX.MinSize.CompareTo(definitionY.MinSize);
                    } 
                    else
                    {
                        result = -1;
                    } 
                }
                else 
                { 
                    if (definitionY.UserSize.IsAuto)
                    { 
                        result = +1;
                    }
                    else
                    { 
                        result = definitionX.PreferredSize.CompareTo(definitionY.PreferredSize);
                    } 
                } 
            }

            return result;
        }
    });

    /// <summary>
    /// SpanMaxDistributionOrderComparer. 
    /// </summary> 
//    private class 
    var SpanMaxDistributionOrderComparer = declare(IComparer, { 
//        public int 
    	Compare:function(/*object*/ x, /*object*/ y)
        {
            /*DefinitionBase*/var definitionX = x instanceof DefinitionBase ? x : null; 
            /*DefinitionBase*/var definitionY = y instanceof DefinitionBase ? y : null;  

            var b = CompareNullRefs(definitionX, definitionY, /*out result*/{"result" : result});
            var result = resultOut.result;

            if (!b)
            { 
                if (definitionX.UserSize.IsAuto)
                {
                    if (definitionY.UserSize.IsAuto)
                    { 
                        result = definitionX.SizeCache.CompareTo(definitionY.SizeCache);
                    } 
                    else 
                    {
                        result = +1; 
                    }
                }
                else
                { 
                    if (definitionY.UserSize.IsAuto)
                    { 
                        result = -1; 
                    }
                    else 
                    {
                        result = definitionX.SizeCache.CompareTo(definitionY.SizeCache);
                    }
                } 
            }

            return result; 
        }
    }); 

    /// <summary>
    /// StarDistributionOrderComparer.
    /// </summary> 
//    private class 
    var StarDistributionOrderComparer = declare(IComparer, { 
//        public int 
    	Compare:function(/*object*/ x, /*object*/ y) 
        {
            /*DefinitionBase*/var definitionX = x instanceof DefinitionBase ? x : null; 
            /*DefinitionBase*/var definitionY = y instanceof DefinitionBase ? y : null;  

            var b = CompareNullRefs(definitionX, definitionY, /*out result*/{"result" : result});
            var result = resultOut.result;

            if (!b)
            { 
                result = definitionX.SizeCache.CompareTo(definitionY.SizeCache); 
            }

            return result;
        }
    });

    /// <summary>
    /// DistributionOrderComparer. 
    /// </summary> 
//    private class 
    var DistributionOrderComparer =declare(IComparer, { 
//        public int 
    	Compare:function(/*object*/ x, /*object*/ y)
        {
            /*DefinitionBase*/var definitionX = x instanceof DefinitionBase ? x : null; 
            /*DefinitionBase*/var definitionY = y instanceof DefinitionBase ? y : null;  

            var b = CompareNullRefs(definitionX, definitionY, /*out result*/{"result" : result});
            var result = resultOut.result; 

            if (!b)
            { 
                var xprime = definitionX.SizeCache - definitionX.MinSizeForArrange;
                var yprime = definitionY.SizeCache - definitionY.MinSizeForArrange;
                result = xprime.CompareTo(yprime);
            } 

            return result; 
        } 
    });


    /// <summary>
    /// StarDistributionOrderIndexComparer.
    /// </summary> 
//    private class 
    var StarDistributionOrderIndexComparer =declare(IComparer, { 
//        private readonly DefinitionBase[] definitions; 

//        internal 
        constructor:function(/*DefinitionBase[]*/ definitions) 
        {
//            Invariant.Assert(definitions != null);
            this.definitions = definitions;
        }, 

//        public int 
        Compare:function(/*object*/ x, /*object*/ y) 
        { 
            /*int?*/var indexX = x ; //as int?;
            /*int?*/var indexY = y; // as int?; 

            /*DefinitionBase*/var definitionX = null;
            /*DefinitionBase*/var definitionY = null;

            if (indexX != null)
            { 
                definitionX = definitions[indexX.Value]; 
            }
            if (indexY != null) 
            {
                definitionY = definitions[indexY.Value];
            }

            var result;

            if (!CompareNullRefs(definitionX, definitionY, /*out result*/resultOut)) 
            {
                result = definitionX.SizeCache.CompareTo(definitionY.SizeCache); 
            }

            return result;
        } 
    });

    /// <summary> 
    /// DistributionOrderComparer.
    /// </summary> 
//    private class 
    var DistributionOrderIndexComparer =  declare(IComparer, {
//        private readonly DefinitionBase[] definitions;

        constructor:function(/*DefinitionBase[]*/ definitions)
        { 
//            Invariant.Assert(definitions != null); 
            this.definitions = definitions;
        }, 

//        public int 
        Compare:function(/*object*/ x, /*object*/ y)
        {
            /*int?*/var indexX = x; // as int?; 
            var  indexY = y; // as int?;

            /*DefinitionBase*/var definitionX = null; 
            /*DefinitionBase*/var definitionY = null;

            if (indexX != null)
            {
                definitionX = definitions[indexX.Value];
            } 
            if (indexY != null)
            { 
                definitionY = definitions[indexY.Value]; 
            }

            var result;

            if (!CompareNullRefs(definitionX, definitionY, /*out result*/resultOut))
            { 
                var xprime = definitionX.SizeCache - definitionX.MinSizeForArrange;
                var yprime = definitionY.SizeCache - definitionY.MinSizeForArrange; 
                result = xprime.CompareTo(yprime); 
            }

            return result;
        }
    });

    /// <summary>
    /// RoundingErrorIndexComparer. 
    /// </summary> 
//    private class 
    var RoundingErrorIndexComparer = declare(IComparer, { 
//        private readonly double[] errors;

        constructor:function(/*double[]*/ errors)
        { 
//            Invariant.Assert(errors != null);
            this.errors = errors; 
        },

//        public int 
        Compare:function(/*object*/ x, /*object*/ y) 
        {
            /*int?*/var indexX = x; // as int?;
            /*int?*/var indexY = y; // as int?;

            var result;

            if (!CompareNullRefs(indexX, indexY, /*out result*/resultOut)) 
            {
                var errorX = errors[indexX.Value]; 
                var errorY = errors[indexY.Value];
                result = errorX.CompareTo(errorY);
            }

            return result;
        } 
    }); 

    /// <summary> 
    /// Implementation of a simple enumerator of grid's logical children
    /// </summary>
//    private class 
    var GridChildrenCollectionEnumeratorSimple = declare(IEnumerator, { 
    	
//        private int _currentEnumerator; 
//        private Object _currentChild;
//        private ColumnDefinitionCollection.Enumerator _enumerator0; 
//        private RowDefinitionCollection.Enumerator _enumerator1;
//        private UIElementCollection _enumerator2Collection;
//        private int _enumerator2Index;
//        private int _enumerator2Count; 
        constructor:function(/*Grid*/ grid, /*bool*/ includeChildren)
        { 
//            Debug.Assert(grid != null); 
            this._currentEnumerator = -1;
            this._enumerator0 = new DefinitionCollection.Enumerator(grid.ExtData != null ? grid.ExtData.ColumnDefinitions : null); 
            this._enumerator1 = new DefinitionCollection.Enumerator(grid.ExtData != null ? grid.ExtData.RowDefinitions : null);
            // GridLineRenderer is NOT included into this enumerator.
            this._enumerator2Index = 0;
            if (includeChildren) 
            {
            	this._enumerator2Collection = grid.Children; 
            	this._enumerator2Count = _enumerator2Collection.Count; 
            }
            else 
            {
            	this._enumerator2Collection = null;
            	this._enumerator2Count = 0;
            } 
        },

//        public bool 
        MoveNext:function() 
        {
            while (this._currentEnumerator < 3) 
            {
                if (this._currentEnumerator >= 0)
                {
                    switch (this._currentEnumerator) 
                    {
                        case (0): if (this._enumerator0.MoveNext()) { this._currentChild = this._enumerator0.Current; return (true); } break; 
                        case (1): if (this._enumerator1.MoveNext()) { this._currentChild = this._enumerator1.Current; return (true); } break; 
                        case (2): if (this._enumerator2Index < this._enumerator2Count)
                                  { 
                        				this._currentChild = this._enumerator2Collection.Get(this._enumerator2Index);
                        				this._enumerator2Index++;
                        			  	return (true);
                                  } 
                                  break;
                    } 
                } 
                this._currentEnumerator++;
            } 
            return (false);
        },

//        public void 
        Reset:function() 
        {
        	this._currentEnumerator = -1; 
        	this._currentChild = null;
        	this._enumerator0.Reset();
        	this._enumerator1.Reset();
        	this._enumerator2Index = 0; 
        }


    });
    
    Object.defineProperties(GridChildrenCollectionEnumeratorSimple.prototype, {
//        public Object 
        Current: 
        {
            get:function() 
            { 
                if (this._currentEnumerator == -1)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.EnumeratorNotStarted));
                }
                if (this._currentEnumerator >= 3) 
                {
                    throw new InvalidOperationException(SR.Get(SRID.EnumeratorReachedEnd)); 
                }

                //  assert below is not true anymore since UIElementCollection allowes for null children
                //Debug.Assert(_currentChild != null);
                return (this._currentChild);
            } 
        }
    });

    /// <summary> 
    /// Helper to render grid lines.
    /// </summary> 
//    internal class 
    var GridLinesRenderer = declare(/*DrawingVisual*/null, {
        /// <summary>
        /// Static initialization 
        /// </summary>
//        static GridLinesRenderer() 
//        { 
//            s_oddDashPen = new Pen(Brushes.Blue, c_penWidth);
//            DoubleCollection oddDashArray = new DoubleCollection(); 
//            oddDashArray.Add(c_dashLength);
//            oddDashArray.Add(c_dashLength);
//            s_oddDashPen.DashStyle = new DashStyle(oddDashArray, 0);
//            s_oddDashPen.DashCap = PenLineCap.Flat; 
//            s_oddDashPen.Freeze();
//
//            s_evenDashPen = new Pen(Brushes.Yellow, c_penWidth); 
//            DoubleCollection evenDashArray = new DoubleCollection();
//            evenDashArray.Add(c_dashLength); 
//            evenDashArray.Add(c_dashLength);
//            s_evenDashPen.DashStyle = new DashStyle(evenDashArray, c_dashLength);
//            s_evenDashPen.DashCap = PenLineCap.Flat;
//            s_evenDashPen.Freeze(); 
//        }
//
//        /// <summary> 
//        /// UpdateRenderBounds.
//        /// </summary> 
//        /// <param name="boundsSize">Size of render bounds</param>
//        internal void UpdateRenderBounds(Size boundsSize)
//        {
//            using (DrawingContext drawingContext = RenderOpen()) 
//            {
//                Grid grid = VisualTreeHelper.GetParent(this) as Grid; 
//                if (    grid == null 
//                    ||  grid.ShowGridLines == false )
//                { 
//                    return;
//                }
//
//                for (int i = 1; i < grid.DefinitionsU.Length; ++i) 
//                {
//                    DrawGridLine( 
//                        drawingContext, 
//                        grid.DefinitionsU[i].FinalOffset, 0.0,
//                        grid.DefinitionsU[i].FinalOffset, boundsSize.Height); 
//                }
//
//                for (int i = 1; i < grid.DefinitionsV.Length; ++i)
//                { 
//                    DrawGridLine(
//                        drawingContext, 
//                        0.0, grid.DefinitionsV[i].FinalOffset, 
//                        boundsSize.Width, grid.DefinitionsV[i].FinalOffset);
//                } 
//            }
//        }
//
//        /// <summary> 
//        /// Draw single hi-contrast line.
//        /// </summary> 
//        private static void DrawGridLine( 
//            DrawingContext drawingContext,
//            double startX, 
//            double startY,
//            double endX,
//            double endY)
//        { 
//            Point start = new Point(startX, startY);
//            Point end = new Point(endX, endY); 
//            drawingContext.DrawLine(s_oddDashPen, start, end); 
//            drawingContext.DrawLine(s_evenDashPen, start, end);
//        } 
//
//        private const double c_dashLength = 4.0;    //
//        private const double c_penWidth = 1.0;      //
//        private static readonly Pen s_oddDashPen;   //  first pen to draw dash 
//        private static readonly Pen s_evenDashPen;  //  second pen to draw dash
//        private static readonly Point c_zeroPoint = new Point(0, 0); 
    }); 

    /// <summary>
    /// Grid validity / property caches dirtiness flags 
    /// </summary>
//    [System.Flags] enum
    var Flags = declare(null, {});
        // 
        //  the foolowing flags let grid tracking dirtiness in more granular manner:
        //  * Valid???Structure flags indicate that elements were added or removed.
        //  * Valid???Layout flags indicate that layout time portion of the information
        //    stored on the objects should be updated. 
        //
    Flags.ValidDefinitionsUStructure              = 0x00000001; 
    Flags.ValidDefinitionsVStructure              = 0x00000002; 
    Flags.ValidCellsStructure                     = 0x00000004;

        //
        //  boolean properties state
        //
    Flags.ShowGridLinesPropertyValue              = 0x00000100;   //  show grid lines ? 

        // 
        //  boolean flags 
        //
    Flags.ListenToNotifications                   = 0x00001000;   //  "0" when all notifications are ignored 
    Flags.SizeToContentU                          = 0x00002000;   //  "1" if calculating to content in U direction
    Flags.SizeToContentV                          = 0x00004000;   //  "1" if calculating to content in V direction
    Flags.HasStarCellsU                           = 0x00008000;   //  "1" if at least one cell belongs to a Star column
    Flags.HasStarCellsV                           = 0x00010000;   //  "1" if at least one cell belongs to a Star row 
    Flags.HasGroup3CellsInAutoRows                = 0x00020000;   //  "1" if at least one cell of group 3 belongs to an Auto row
    Flags.MeasureOverrideInProgress               = 0x00040000;   //  "1" while in the context of Grid.MeasureOverride 
    Flags.ArrangeOverrideInProgress               = 0x00080000;   //  "1" while in the context of Grid.ArrangeOverride 
    
//    internal enum 
    var Counters =declare(null, {});
    Counters.Default = -1;

    Counters.MeasureOverride = 0;
    Counters._ValidateColsStructure = 1;
    Counters._ValidateRowsStructure = 2;
    Counters._ValidateCells = 3; 
    Counters._MeasureCell = 4;
    Counters.__MeasureChild = 5; 
    Counters._CalculateDesiredSize = 6; 

    Counters.ArrangeOverride = 7; 
    Counters._SetFinalSize = 8;
    Counters._ArrangeChildHelper2 = 9;
    Counters._PositionCell = 10;

    Counters.Count = 11;
    
//    private struct 
    var Counter = declare(null, {});
    Object.defineProperties(Counter.prototype, {
//        internal long   
    	Start:{set:function(){return this._Start;}, set:function(value){this._Start = value;}},  
//        internal long   
    	Total:{set:function(){return this._Total;}, set:function(value){this._Total = value;}}, 
//        internal int    
    	Calls:{set:function(){return this._Calls;}, set:function(value){this._Calls = value;}},  
    }); 
    
    
//    private static readonly LocalDataStoreSlot s_tempDefinitionsDataSlot = Thread.AllocateDataSlot();
//    private static readonly IComparer 
    var s_spanPreferredDistributionOrderComparer = new SpanPreferredDistributionOrderComparer(); 
//    private static readonly IComparer 
    var s_spanMaxDistributionOrderComparer = new SpanMaxDistributionOrderComparer(); 
//    private static readonly IComparer 
    var s_starDistributionOrderComparer = new StarDistributionOrderComparer();
//    private static readonly IComparer 
    var s_distributionOrderComparer = new DistributionOrderComparer(); 
    
    
var Cell = declare(null, {
    	constructor:function(row, column, rowSpan, columnSpan){
    		this._elements = null;
    		this._row = row;
    		this._column = column;
    		this._rowSpan = rowSpan;
    		this._columnSpan = columnSpan;
    	},
    	AddElement:function(element){
    		if(this._elements == null){
    			this._elements = [];
    		}
    		
			this._elements.push(element);
    	}
    });
    
    Object.defineProperties(Cell.prototype, {
    	Row:{
    		get:function(){
    			return this._row;
    		}
    	},
    	Column:{
    		get:function(){
    			return this._column;
    		}
    	},
    	RowSpan:{
    		get:function(){
    			return this._rowSpan;
    		},
    		set:function(value){
    			this._rowSpan = value;
    		}
    	},
    	ColumnSpan:{
    		get:function(){
    			return this._columnSpan;
    		},
    		set:function(value){
    			this._columnSpan = value;
    		}
    		
    	},
    	
    	Height:{
    		get:function(){
    			return this._height;
    		}
    	},
    	
    	Width:{
    		get:function(){
    			return this._width;
    		}
    	},
    	
    	Elements:{
    		get:function(){
    			return this._elements;
    		}

    	},
    	
    	IsEmpty:{
    		get:function(){
    			return this._elements ==null || this._elements.length==0;
    		}
    	},
    	
    	Flag:{
      		get:function(){
    			return this._flag;
    		},
    		set:function(value){
    			this._flag = value;
    		}
    	}
    });
    
	var Grid = declare("Grid", [Panel, IAddChild],{
		constructor:function(){
            this.SetFlags(Grid.ShowGridLinesProperty.GetDefaultValue(this.DependencyObjectType), Flags.ShowGridLinesPropertyValue);
            
        	this._dom = window.document.createElement('div');
        	this._dom.id = 'Grid';
//        	this._dom.style.setProperty("border", "border: 1px solid #ccc;");
        	this.trs = [];
			this._dom._source = this;
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
        OnAddChild:function(child){
        	if(this.ArrangeDirty){
        		return;
        	}
        	child.Arrange();
        	this._dom.appendChild(child._dom);
        },
        
        OnRemoveChild:function(child){
        	if(this.ArrangeDirty){
        		return;
        	}
//        	child.Arrange();
        	this._dom.removeChild(child._dom);
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
 
            var cell = value instanceof UIElement ? value : null; 
            if (cell != null)
            { 
                this.Children.Add(cell);
                return;
            }
 
            throw (new ArgumentException(SR.Get(SRID.Grid_UnexpectedParameterType, value.GetType(), typeof(UIElement)), "value"));
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
        ///   Derived class must implement to support Visual children. The method must return 
        ///    the child at the specified index. Index must be between 0 and GetVisualChildrenCount-1.
        /// 
        ///    By default a Visual does not have any children.
        ///
        ///  Remark:
        ///       During this virtual call it is not valid to modify the Visual tree. 
        /// </summary>
////        protected override Visual 
//		GetVisualChild:function(/*int*/ index) 
//        { 
//            // because "base.Count + 1" for GridLinesRenderer
//            // argument checking done at the base class 
//            if(index == Panel.prototype.VisualChildrenCount)
//            {
//                if (this._gridLinesRenderer == null)
//                { 
//                    throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange));
//                } 
//                return this._gridLinesRenderer; 
//            }
//            else return Panel.prototype.GetVisualChild.call(this, index); 
//
//        },

//        /// <summary>
//        /// Content measurement.
//        /// </summary> 
//        /// <param name="constraint">Constraint</param>
//        /// <returns>Desired size</returns> 
////        protected override Size 
//        MeasureOverride:function() 
//        {
//        	/*UIElementCollection*/var children = this.InternalChildren; 
//        	/*ExtendedData*/var extData = this.ExtData;
//    		if (extData == null)
//    		{
//            	this._dom = window.document.createElement('div');
//            	this._dom.id = 'table_cell';
//    			for (var i = 0, count = children.Count; i < count; ++i) 
//    			{ 
//    				var child = children.Get(i);
//    				if (child != null) 
//    				{
//    					child.Measure();
//    				}
//    			} 
//    		} 
//    		else
//    		{ 
////            	this._dom = window.document.createElement('table');
////            	this._dom.style.setProperty("border", "border: 1px solid #ccc;");
//    			this.cells = [];
//    			
//    			var columns = extData.ColumnDefinitions.Count;
//    			var rows = extData.RowDefinitions.Count;
//    			for(var row = 0; row<rows; row++){
//    				this.cells[row] = [];
//    				for(var column = 0; column<columns; column++){
//						this.cells[row][column] = new Cell(row, column, 1, 1, 0, 0);
//    				}
//    				
//    				
//    			}
//    			
//    			for (var i = 0, count = children.Count; i < count; i++) 
//    			{ 
//    				var child = children.Get(i);
//    				if (child == null) continue;
////    				if (child != null) 
////    				{
//    					child.Measure();
////    				}
//    				
//    				var flag = {"Created" : false};
//    				
//    				var row = Grid.GetRow(child);
//    				var column = Grid.GetColumn(child);
//    				var rowSpan = Grid.GetRowSpan(child);
//    				var columnSpan = Grid.GetColumnSpan(child);
//    				row = (row ===undefined || row ==null) ? 0 : row;
//    				column = (column ===undefined || column ==null) ? 0 : column;
//    				rowSpan = (rowSpan ===undefined || rowSpan ==null || rowSpan <1) ? 1 : rowSpan;
//    				columnSpan = (columnSpan ===undefined || columnSpan ==null || columnSpan<1) ? 1 : columnSpan;
//    				
//    				for(var j = row, rows = rowSpan + row; j<=rows-1; j++){
//        				for(var k = column, columns = columnSpan + column; k<=columns-1; k++){
//        					var cell = this.cells[j][k];
//    						cell.RowSpan = rowSpan;
//    						cell.ColumnSpan = columnSpan;
//        	   				cell.AddElement(child);
//        	   				cell.Flag = flag;
//        				}
//    				}
//    			} 
//    		}
//        },
//
//        /// <summary>
//        /// Content arrangement.
//        /// </summary>
//        /// <param name="arrangeSize">Arrange size</param> 
////        protected override Size 
//        ArrangeOverride:function()
//        { 
//           	if(this.ArrangeDirty){
//           		
//    			var children = this.InternalChildren; 
//
//    			//clear previous layout data
//    			for (var i = 0, count = children.Count; i < count; i++)
//    			{ 
//    				var child = children.Get(i);
//    				if (child != null)
//    				{
//    					if(child._parentDom){
//    						child._parentDom.removeChild(this._dom);
//    					}
//    				}
//    			} 
//    			
//    			for(var i=0; i<this.trs.length; i++){
//    				this._dom.removeChild(this.trs[i]);
//    			}
//    			this.trs.length = 0;
//           		
//    			////////////////////////////
//    			//create new lauout data
//           		if (this._data == null) 
//        		{
//        			var children = this.InternalChildren; 
//
//        			var temp = null;
//        			for (var i = 0, count = children.Count; i < count; i++)
//        			{ 
//        				var child = children.Get(i);
//        				if (child != null)
//        				{
//        					if(temp != null){
//	        					//temp.style.setProperty("position", "absolute");
//	        					temp.style.setProperty("top", "1px");
//	        					temp.style.setProperty("left", "1px");
//        					}
//                            
//                            child.Arrange(this._dom); 
//                            temp = child._dom;
//                            this._dom.appendChild(child._dom);
//                            //this._dom.style.setProperty("position", "relative");
//        				}
//        			} 
//        		} 
//        		else
//        		{ 
//        			this.trs = [];
//        			var rowDefs = this._data.RowDefinitions;
//        			var columnDefs = this._data.ColumnDefinitions;
//        			var rowCount =rowDefs.Count;
//        			var columnCount = columnDefs.Count;
//        			for(var i=0; i<rowCount; i++ ){
//        				var row = rowDefs.Get(i);
//        				var tr = window.document.createElement('tr');
//        				
//        				row._dom  = tr;
//        				
//        				this._dom.appendChild(tr);
//        				this.trs.push(tr);
//        			}
//        			
//      				for(var row=0; row<rowCount; row++){
//    					for(var column=0; column<columnCount; column++){
//
//    						var cell = this.cells[row][column];
//
//    						if(cell.IsEmpty){
//    							var td = window.document.createElement('td');
//    							td.setAttribute("rowSpan", cell.RowSpan);
//    							td.setAttribute("colSpan", cell.ColumnSpan);
//    							this.trs[row].appendChild(td);
//    							
//    							td.innerHTML="&nbsp;";
////    							td.innerHTML="<p>sasasasas </p>";
//    						}else{
//    							if(cell.Flag.Created){
//    								continue;
//    							}
//    							var td = window.document.createElement('td');
//    							td.setAttribute("rowSpan", cell.RowSpan);
//    							td.setAttribute("colSpan", cell.ColumnSpan);
//    							this.trs[row].appendChild(td);
//    							
//    							if(cell.Elements.length>1){
//    	  							for(var i=0;i<cell.Elements.length;i++){
//        								var element = cell.Elements[i];
//        								element._parentDom = td;
//        								element.Arrange(td);
//        								td.appendChild(element._dom);
//        								//element._dom.style.setProperty("position", "absolute");
//        							}
//    							}else{
//    								var element = cell.Elements[0];
//    								element._parentDom = td;
//    								element.Arrange(td);
//    								td.appendChild(element._dom);
//    							}
//    								
//  
//    							cell.Flag.Created = true;
//    						}
//    					}
//    				}
//        		}
//           		
//           		this.ArrangeDirty = false;
//        	}
////        	parent.appendChild(this._dom);
//    		 
//        }, 
        
	      /// <summary>
	      /// Content measurement.
	      /// </summary> 
	      /// <param name="constraint">Constraint</param>
	      /// <returns>Desired size</returns> 
	//      protected override Size 
	      MeasureOverride:function() 
	      {
	    	 this._dom.style.setProperty("display", "-ms-grid");
	    	 var rows = this.Rows;
	    	 if(!String.IsNullOrEmpty(rows)){
		    	 this._dom.style.setProperty("-ms-grid-rows", rows); 
	    	 }
	    	 var columns = this.Columns;
	    	 if(!String.IsNullOrEmpty(columns)){
		    	 this._dom.style.setProperty("-ms-grid-columns", columns); 
	    	 }
	      	/*UIElementCollection*/var children = this.InternalChildren; 
  			for (var i = 0, count = children.Count; i < count; ++i) 
  			{ 
  				var child = children.Get(i);
  				if (child != null) 
  				{
  					child.Measure();
  				}
  			}
	      },

        /// <summary>
        /// Content arrangement.
        /// </summary>
        /// <param name="arrangeSize">Arrange size</param> 
//        protected override Size 
        ArrangeOverride:function()
        { 
//           	if(this.ArrangeDirty){
           		
    			var children = this.InternalChildren; 

    			//clear previous layout data
    			for (var i = 0, count = children.Count; i < count; i++)
    			{ 
    				var child = children.Get(i);
    				if (child != null)
    				{
    					child.Arrange();
    					var row = child.GetValue(Grid.RowProperty);
    					if(!String.IsNullOrEmpty(row)){
    						child._dom.style.setProperty("-ms-grid-row", row);
    					}
    					
    					var rowSpan = child.GetValue(Grid.RowSpanProperty);
    					if(!String.IsNullOrEmpty(rowSpan)){
    						child._dom.style.setProperty("-ms-grid-row-span", rowSpan);
    					}
    					
    					var column = child.GetValue(Grid.ColumnProperty);
    					if(!String.IsNullOrEmpty(column)){
    						child._dom.style.setProperty("-ms-grid-column", column);
    					}
    					
    					var columnSpan = child.GetValue(Grid.ColumnSpanProperty);
    					if(!String.IsNullOrEmpty(columnSpan)){
    						child._dom.style.setProperty("-ms-grid-column-span", columnSpan);
    					}
						this._dom.appendChild(child._dom);
    				}
    			} 
           		
           		this.ArrangeDirty = false;
//        	}
//        	parent.appendChild(this._dom);
    		 
        }, 

 
        /// <summary>
        /// <see cref="Visual.OnVisualChildrenChanged"/> 
        /// </summary>
//        protected internal override void 
		OnVisualChildrenChanged:function(
            /*DependencyObject*/ visualAdded,
            /*DependencyObject*/ visualRemoved) 
        {
            this.CellsStructureDirty = true; 
 
            Panel.prototype.OnVisualChildrenChanged.call(this, visualAdded, visualRemoved);
        }, 

        /// <summary>
        ///     Invalidates grid caches and makes the grid dirty for measure. 
        /// </summary>
//        internal void 
		Invalidate:function() 
        { 
			this.CellsStructureDirty = true;
			this.InvalidateMeasure(); 
        },

        /// <summary>
        ///     Returns final width for a column. 
        /// </summary>
        /// <remarks> 
        ///     Used from public ColumnDefinition ActualWidth. Calculates final width using offset data. 
        /// </remarks>
//        internal double 
		GetFinalColumnDefinitionWidth:function(/*int*/ columnIndex) 
        {
            var value = 0.0;

            //  actual value calculations require structure to be up-to-date 
            if (!this.ColumnDefinitionCollectionDirty) 
            {
            	/*DefinitionBase[]*/var definitions = this.DefinitionsU; 
                value = definitions[(columnIndex + 1) % definitions.length].FinalOffset;
                if (columnIndex != 0) { value -= definitions[columnIndex].FinalOffset; }
            }
            return (value); 
        },
 
        /// <summary> 
        ///     Returns final height for a row.
        /// </summary> 
        /// <remarks>
        ///     Used from public RowDefinition ActualHeight. Calculates final height using offset data.
        /// </remarks>
//        internal double 
		GetFinalRowDefinitionHeight:function(/*int*/ rowIndex) 
        {
            var value = 0.0; 
 
            //  actual value calculations require structure to be up-to-date
            if (!RowDefinitionCollectionDirty)
            {
                /*DefinitionBase[]*/var definitions = this.DefinitionsV; 
                value = definitions[(rowIndex + 1) % definitions.length].FinalOffset;
                if (rowIndex != 0) { value -= definitions[rowIndex].FinalOffset; } 
            } 
            return (value);
        }, 

        /// <summary> 
        /// Lays out cells according to rows and columns, and creates lookup grids.
        /// </summary> 
//        private void 
		ValidateCells:function() 
        {
//            EnterCounter(Counters._ValidateCells); 

            if (this.CellsStructureDirty)
            {
            	this.ValidateCellsCore(); 
            	this.CellsStructureDirty = false;
            } 
 
//            ExitCounter(Counters._ValidateCells);
        }, 

        /// <summary>
        /// ValidateCellsCore
        /// </summary> 
//        private void 
		ValidateCellsCore:function()
        { 
            /*UIElementCollection*/var children = this.InternalChildren; 
            /*ExtendedData*/var extData = this.ExtData;
 
            extData.CellCachesCollection = new CellCache[children.Count];
            extData.CellGroup1 = int.MaxValue;
            extData.CellGroup2 = int.MaxValue;
            extData.CellGroup3 = int.MaxValue; 
            extData.CellGroup4 = int.MaxValue;
 
            var hasStarCellsU = false; 
            var hasStarCellsV = false;
            var hasGroup3CellsInAutoRows = false; 

            for (var i = PrivateCells.Length - 1; i >= 0; --i)
            {
                /*UIElement*/var child = children.Get(i); 
                if (child == null)
                { 
                    continue; 
                }
 
                /*CellCache*/var cell = new CellCache();

                //
                //  read and cache child positioning properties 
                //
 
                //  read indices from the corresponding properties 
                //      clamp to value < number_of_columns
                //      column >= 0 is guaranteed by property value validation callback 
                cell.ColumnIndex = Math.min(GetColumn(child), DefinitionsU.Length - 1);
                //      clamp to value < number_of_rows
                //      row >= 0 is guaranteed by property value validation callback
                cell.RowIndex = Math.min(GetRow(child), DefinitionsV.Length - 1); 

                //  read span properties 
                //      clamp to not exceed beyond right side of the grid 
                //      column_span > 0 is guaranteed by property value validation callback
                cell.ColumnSpan = Math.min(GetColumnSpan(child), DefinitionsU.Length - cell.ColumnIndex); 

                //      clamp to not exceed beyond bottom side of the grid
                //      row_span > 0 is guaranteed by property value validation callback
                cell.RowSpan = Math.min(GetRowSpan(child), DefinitionsV.Length - cell.RowIndex); 

                Debug.Assert(0 <= cell.ColumnIndex && cell.ColumnIndex < DefinitionsU.Length); 
                Debug.Assert(0 <= cell.RowIndex && cell.RowIndex < DefinitionsV.Length); 

                // 
                //  calculate and cache length types for the child
                //

                cell.SizeTypeU = GetLengthTypeForRange(DefinitionsU, cell.ColumnIndex, cell.ColumnSpan); 
                cell.SizeTypeV = GetLengthTypeForRange(DefinitionsV, cell.RowIndex, cell.RowSpan);
 
                hasStarCellsU |= cell.IsStarU; 
                hasStarCellsV |= cell.IsStarV;
 
                //
                //  distribute cells into four groups.
                //
 
                if (!cell.IsStarV)
                { 
                    if (!cell.IsStarU) 
                    {
                        cell.Next = extData.CellGroup1; 
                        extData.CellGroup1 = i;
                    }
                    else
                    { 
                        cell.Next = extData.CellGroup3;
                        extData.CellGroup3 = i; 
 
                        //  remember if this cell belongs to auto row
                        hasGroup3CellsInAutoRows |= cell.IsAutoV; 
                    }
                }
                else
                { 
                    if (    cell.IsAutoU
                            //  note below: if spans through Star column it is NOT Auto 
                        &&  !cell.IsStarU ) 
                    {
                        cell.Next = extData.CellGroup2; 
                        extData.CellGroup2 = i;
                    }
                    else
                    { 
                        cell.Next = extData.CellGroup4;
                        extData.CellGroup4 = i; 
                    } 
                }
 
                PrivateCells[i] = cell;
            }

            this.HasStarCellsU = hasStarCellsU; 
            this.HasStarCellsV = hasStarCellsV;
            this.HasGroup3CellsInAutoRows = hasGroup3CellsInAutoRows; 
        }, 

        /// <summary> 
        /// Initializes DefinitionsU memeber either to user supplied ColumnDefinitions collection
        /// or to a default single element collection. DefinitionsU gets trimmed to size.
        /// </summary>
        /// <remarks> 
        /// This is one of two methods, where ColumnDefinitions and DefinitionsU are directly accessed.
        /// All the rest measure / arrange / render code must use DefinitionsU. 
        /// </remarks> 
//        private void 
		ValidateDefinitionsUStructure:function()
        { 
//            EnterCounter(Counters._ValidateColsStructure);

            if (this.ColumnDefinitionCollectionDirty)
            { 
                /*ExtendedData*/var extData = ExtData;
 
                if (extData.ColumnDefinitions == null) 
                {
                    if (extData.DefinitionsU == null) 
                    {
                        extData.DefinitionsU = /*new DefinitionBase[] {*/[ new ColumnDefinition() ];
                    }
                } 
                else
                { 
                    extData.ColumnDefinitions.InternalTrimToSize(); 

                    if (extData.ColumnDefinitions.InternalCount == 0) 
                    {
                        //  if column definitions collection is empty
                        //  mockup array with one column
                        extData.DefinitionsU = /*new DefinitionBase[] {*/[ new ColumnDefinition() ]; 
                    }
                    else 
                    { 
                        extData.DefinitionsU = extData.ColumnDefinitions.InternalItems;
                    } 
                }

                this.ColumnDefinitionCollectionDirty = false;
            } 

//            ExitCounter(Counters._ValidateColsStructure);
        }, 

        /// <summary>
        /// Initializes DefinitionsV memeber either to user supplied RowDefinitions collection
        /// or to a default single element collection. DefinitionsV gets trimmed to size. 
        /// </summary>
        /// <remarks> 
        /// This is one of two methods, where RowDefinitions and DefinitionsV are directly accessed. 
        /// All the rest measure / arrange / render code must use DefinitionsV.
        /// </remarks> 
//        private void 
		ValidateDefinitionsVStructure:function()
        {
//            EnterCounter(Counters._ValidateRowsStructure);
 
            if (this.RowDefinitionCollectionDirty)
            { 
                var extData = this.ExtData; 

                if (extData.RowDefinitions == null) 
                {
                    if (extData.DefinitionsV == null)
                    {
                        extData.DefinitionsV = /*new DefinitionBase[] {*/[ new RowDefinition() ]; 
                    }
                } 
                else 
                {
                    extData.RowDefinitions.InternalTrimToSize(); 

                    if (extData.RowDefinitions.InternalCount == 0)
                    {
                        //  if row definitions collection is empty 
                        //  mockup array with one row
                        extData.DefinitionsV = /*new DefinitionBase[] {*/[ new RowDefinition() ]; 
                    } 
                    else
                    { 
                        extData.DefinitionsV = extData.RowDefinitions.InternalItems;
                    }
                }
 
                this.RowDefinitionCollectionDirty = false;
            } 
 
//            Debug.Assert(ExtData.DefinitionsV != null && ExtData.DefinitionsV.Length > 0);
 
//            ExitCounter(Counters._ValidateRowsStructure);
        },

        /// <summary> 
        /// Validates layout time size type information on given array of definitions.
        /// Sets MinSize and MeasureSizes. 
        /// </summary> 
        /// <param name="definitions">Array of definitions to update.</param>
        /// <param name="treatStarAsAuto">if "true" then star definitions are treated as Auto.</param> 
//        private void 
		ValidateDefinitionsLayout:function(
            /*DefinitionBase[]*/ definitions,
            /*bool*/ treatStarAsAuto)
        { 
            for (var i = 0; i < definitions.Length; ++i)
            { 
                definitions[i].OnBeforeLayout(this); 

                var userMinSize = definitions[i].UserMinSize; 
                var userMaxSize = definitions[i].UserMaxSize;
                var userSize = 0;

                switch (definitions[i].UserSize.GridUnitType) 
                {
                    case (GridUnitType.Pixel): 
                        definitions[i].SizeType = LayoutTimeSizeType.Pixel; 
                        userSize = definitions[i].UserSize.Value;
                        // this was brought with NewLayout and defeats squishy behavior 
                        userMinSize = Math.Max(userMinSize, Math.Min(userSize, userMaxSize));
                        break;
                    case (GridUnitType.Auto):
                        definitions[i].SizeType = LayoutTimeSizeType.Auto; 
                        userSize = double.PositiveInfinity;
                        break; 
                    case (GridUnitType.Star): 
                        if (treatStarAsAuto)
                        { 
                            definitions[i].SizeType = LayoutTimeSizeType.Auto;
                            userSize = double.PositiveInfinity;
                        }
                        else 
                        {
                            definitions[i].SizeType = LayoutTimeSizeType.Star; 
                            userSize = double.PositiveInfinity; 
                        }
                        break; 
                    default:
                        Debug.Assert(false);
                        break;
                } 

                definitions[i].UpdateMinSize(userMinSize); 
                definitions[i].MeasureSize = Math.max(userMinSize, Math.min(userSize, userMaxSize)); 
            }
        }, 

//        private double[] 
		CacheMinSizes:function(/*int*/ cellsHead, /*bool*/ isRows)
        {
            /*double[]*/var minSizes = isRows ? new double[DefinitionsV.Length] : new double[DefinitionsU.Length]; 

            for (var j=0; j<minSizes.Length; j++) 
            { 
                minSizes[j] = -1;
            } 

            var i = cellsHead;
            do
            { 
                if (isRows)
                { 
                    minSizes[PrivateCells[i].RowIndex] = DefinitionsV[PrivateCells[i].RowIndex].MinSize; 
                }
                else 
                {
                    minSizes[PrivateCells[i].ColumnIndex] = DefinitionsU[PrivateCells[i].ColumnIndex].MinSize;
                }
 
                i = PrivateCells[i].Next;
 
            } while (i < this.PrivateCells.length); 

            return minSizes; 
        },

//        private void 
		ApplyCachedMinSizes:function(/*double[]*/ minSizes, /*bool*/ isRows)
        { 
            for (var i=0; i<minSizes.length; i++)
            { 
                if (DoubleUtil.GreaterThanOrClose(minSizes[i], 0)) 
                {
                    if (isRows) 
                    {
                        DefinitionsV[i].SetMinSize(minSizes[i]);
                    }
                    else 
                    {
                        DefinitionsU[i].SetMinSize(minSizes[i]); 
                    } 
                }
            } 
        },

//        private void 
		MeasureCellsGroup:function(
            /*int*/ cellsHead, 
            /*Size*/ referenceSize,
            /*bool*/ ignoreDesiredSizeU, 
            /*bool*/ forceInfinityV) 
        {
            /*bool*/var unusedHasDesiredSizeUChanged; 
            this.MeasureCellsGroup(cellsHead, referenceSize, ignoreDesiredSizeU, forceInfinityV, 
            		/*out unusedHasDesiredSizeUChanged*/unusedHasDesiredSizeUChangedOut);
        },

        /// <summary> 
        /// Measures one group of cells.
        /// </summary> 
        /// <param name="cellsHead">Head index of the cells chain.</param> 
        /// <param name="referenceSize">Reference size for spanned cells
        /// calculations.</param> 
        /// <param name="ignoreDesiredSizeU">When "true" cells' desired
        /// width is not registered in columns.</param>
        /// <param name="forceInfinityV">Passed through to MeasureCell.
        /// When "true" cells' desired height is not registered in rows.</param> 
//        private void 
		MeasureCellsGroup:function(
            /*int*/ cellsHead, 
            /*Size*/ referenceSize, 
            /*bool*/ ignoreDesiredSizeU,
            /*bool*/ forceInfinityV, 
            /*out bool hasDesiredSizeUChanged*/hasDesiredSizeUChangedOut)
        {
            hasDesiredSizeUChanged = false;
 
            if (cellsHead >= PrivateCells.Length)
            { 
                return; 
            }
 
            /*UIElementCollection*/var children = this.InternalChildren;
            /*Hashtable*/var spanStore = null;
            var ignoreDesiredSizeV = forceInfinityV;
 
            var i = cellsHead;
            do 
            { 
                var oldWidth = children.Get(i).DesiredSize.Width;
 
                this.MeasureCell(i, forceInfinityV);

                hasDesiredSizeUChanged |= !DoubleUtil.AreClose(oldWidth, children[i].DesiredSize.Width);
 
                if (!ignoreDesiredSizeU)
                { 
                    if (PrivateCells[i].ColumnSpan == 1) 
                    {
                        DefinitionsU[PrivateCells[i].ColumnIndex].UpdateMinSize(Math.Min(children[i].DesiredSize.Width, DefinitionsU[PrivateCells[i].ColumnIndex].UserMaxSize)); 
                    }
                    else
                    {
                        RegisterSpan( 
                            /*ref*/ spanStore,
                            PrivateCells[i].ColumnIndex, 
                            PrivateCells[i].ColumnSpan, 
                            true,
                            children[i].DesiredSize.Width); 
                    }
                }

                if (!ignoreDesiredSizeV) 
                {
                    if (PrivateCells[i].RowSpan == 1) 
                    { 
                        DefinitionsV[PrivateCells[i].RowIndex].UpdateMinSize(Math.Min(children[i].DesiredSize.Height, DefinitionsV[PrivateCells[i].RowIndex].UserMaxSize));
                    } 
                    else
                    {
                        RegisterSpan(
                            /*ref*/ spanStore, 
                            PrivateCells[i].RowIndex,
                            PrivateCells[i].RowSpan, 
                            false, 
                            children[i].DesiredSize.Height);
                    } 
                }

                i = PrivateCells[i].Next;
            } while (i < PrivateCells.Length); 

            if (spanStore != null) 
            { 
                for/*each*/ (/*DictionaryEntry*/var e in spanStore)
                { 
                    /*SpanKey*/var key = e.Key;
                    var requestedSize = e.Value;

                    EnsureMinSizeInDefinitionRange( 
                        key.U ? DefinitionsU : DefinitionsV,
                        key.Start, 
                        key.Count, 
                        requestedSize,
                        key.U ? referenceSize.Width : referenceSize.Height); 
                }
            }
        },
 
        /// <summary>
        /// Takes care of measuring a single cell. 
        /// </summary>
        /// <param name="cell">Index of the cell to measure.</param>
        /// <param name="forceInfinityV">If "true" then cell is always
        /// calculated to infinite height.</param> 
//        private void 
		MeasureCell:function(
            /*int*/ cell, 
            /*bool*/ forceInfinityV) 
        {
//            EnterCounter(Counters._MeasureCell); 

            var cellMeasureWidth;
            var cellMeasureHeight;
 
            if (    PrivateCells[cell].IsAutoU
                &&  !PrivateCells[cell].IsStarU   ) 
            { 
                //  if cell belongs to at least one Auto column and not a single Star column
                //  then it should be calculated "to content", thus it is possible to "shortcut" 
                //  calculations and simply assign PositiveInfinity here.
                cellMeasureWidth = double.PositiveInfinity;
            }
            else 
            {
                //  otherwise... 
                cellMeasureWidth = GetMeasureSizeForRange( 
                                        DefinitionsU,
                                        PrivateCells[cell].ColumnIndex, 
                                        PrivateCells[cell].ColumnSpan);
            }

            if (forceInfinityV) 
            {
                cellMeasureHeight = double.PositiveInfinity; 
            } 
            else if (   PrivateCells[cell].IsAutoV
                    &&  !PrivateCells[cell].IsStarV   ) 
            {
                //  if cell belongs to at least one Auto row and not a single Star row
                //  then it should be calculated "to content", thus it is possible to "shortcut"
                //  calculations and simply assign PositiveInfinity here. 
                cellMeasureHeight = double.PositiveInfinity;
            } 
            else 
            {
                cellMeasureHeight = GetMeasureSizeForRange( 
                                        DefinitionsV,
                                        PrivateCells[cell].RowIndex,
                                        PrivateCells[cell].RowSpan);
            } 

//            EnterCounter(Counters.__MeasureChild); 
            /*UIElement*/var child = this.InternalChildren.Get(cell); 
            if (child != null)
            { 
                var childConstraint = new Size(cellMeasureWidth, cellMeasureHeight);
                child.Measure(childConstraint);
            }
//            ExitCounter(Counters.__MeasureChild); 

//            ExitCounter(Counters._MeasureCell); 
        }, 

 
        /// <summary>
        /// Calculates one dimensional measure size for given definitions' range.
        /// </summary>
        /// <param name="definitions">Source array of definitions to read values from.</param> 
        /// <param name="start">Starting index of the range.</param>
        /// <param name="count">Number of definitions included in the range.</param> 
        /// <returns>Calculated measure size.</returns> 
        /// <remarks>
        /// For "Auto" definitions MinWidth is used in place of PreferredSize. 
        /// </remarks>
//        private double 
		GetMeasureSizeForRange:function(
            /*DefinitionBase[]*/ definitions,
            /*int*/ start, 
            /*int*/ count)
        { 
//            Debug.Assert(0 < count && 0 <= start && (start + count) <= definitions.Length); 

            var measureSize = 0; 
            var i = start + count - 1;

            do
            { 
                measureSize += (definitions[i].SizeType == LayoutTimeSizeType.Auto)
                    ? definitions[i].MinSize 
                    : definitions[i].MeasureSize; 
            } while (--i >= start);
 
            return (measureSize);
        },

        /// <summary> 
        /// Accumulates length type information for given definition's range.
        /// </summary> 
        /// <param name="definitions">Source array of definitions to read values from.</param> 
        /// <param name="start">Starting index of the range.</param>
        /// <param name="count">Number of definitions included in the range.</param> 
        /// <returns>Length type for given range.</returns>
//        private LayoutTimeSizeType 
		GetLengthTypeForRange:function(
            /*DefinitionBase[]*/ definitions,
            /*int*/ start, 
            /*int*/ count)
        { 
//            Debug.Assert(0 < count && 0 <= start && (start + count) <= definitions.Length); 

            /*LayoutTimeSizeType*/var lengthType = LayoutTimeSizeType.None; 
            var i = start + count - 1;

            do
            { 
                lengthType |= definitions[i].SizeType;
            } while (--i >= start); 
 
            return (lengthType);
        }, 

        /// <summary>
        /// Distributes min size back to definition array's range.
        /// </summary> 
        /// <param name="start">Start of the range.</param>
        /// <param name="count">Number of items in the range.</param> 
        /// <param name="requestedSize">Minimum size that should "fit" into the definitions range.</param> 
        /// <param name="definitions">Definition array receiving distribution.</param>
        /// <param name="percentReferenceSize">Size used to resolve percentages.</param> 
//        private void 
		EnsureMinSizeInDefinitionRange:function(
            /*DefinitionBase[]*/ definitions,
            /*int*/ start,
            /*int*/ count, 
            /*double*/ requestedSize,
            /*double*/ percentReferenceSize) 
        { 
//            Debug.Assert(1 < count && 0 <= start && (start + count) <= definitions.Length);
 
            //  avoid processing when asked to distribute "0"
            if (!_IsZero(requestedSize))
            {
                /*DefinitionBase[]*/var tempDefinitions = this.TempDefinitions; //  temp array used to remember definitions for sorting 
                var end = start + count;
                var autoDefinitionsCount = 0; 
                var rangeMinSize = 0; 
                var rangePreferredSize = 0;
                var rangeMaxSize = 0; 
                var maxMaxSize = 0;                              //  maximum of maximum sizes

                //  first accumulate the necessary information:
                //  a) sum up the sizes in the range; 
                //  b) count the number of auto definitions in the range;
                //  c) initialize temp array 
                //  d) cache the maximum size into SizeCache 
                //  e) accumulate max of max sizes
                for (var i = start; i < end; ++i) 
                {
                	var minSize = definitions[i].MinSize;
                	var preferredSize = definitions[i].PreferredSize;
                	var maxSize = Math.Max(definitions[i].UserMaxSize, minSize); 

                    rangeMinSize += minSize; 
                    rangePreferredSize += preferredSize; 
                    rangeMaxSize += maxSize;
 
                    definitions[i].SizeCache = maxSize;

                    if (maxMaxSize < maxSize)   maxMaxSize = maxSize;
                    if (definitions[i].UserSize.IsAuto) autoDefinitionsCount++;
                    tempDefinitions[i - start] = definitions[i];
                } 

                //  avoid processing if the range already big enough 
                if (requestedSize > rangeMinSize) 
                {
                    if (requestedSize <= rangePreferredSize) 
                    {
                        //
                        //  requestedSize fits into preferred size of the range.
                        //  distribute according to the following logic: 
                        //  * do not distribute into auto definitions - they should continue to stay "tight";
                        //  * for all non-auto definitions distribute to equi-size min sizes, without exceeding preferred size. 
                        // 
                        //  in order to achieve that, definitions are sorted in a way that all auto definitions
                        //  are first, then definitions follow ascending order with PreferredSize as the key of sorting. 
                        //
                    	var sizeToDistribute;
                    	var i;
 
                        Array.Sort(tempDefinitions, 0, count, s_spanPreferredDistributionOrderComparer);
                        for (i = 0, sizeToDistribute = requestedSize; i < autoDefinitionsCount; ++i) 
                        { 
                            //  sanity check: only auto definitions allowed in this loop
//                            Debug.Assert(tempDefinitions[i].UserSize.IsAuto); 

                            //  adjust sizeToDistribute value by subtracting auto definition min size
                            sizeToDistribute -= (tempDefinitions[i].MinSize);
                        } 

                        for (; i < count; ++i) 
                        { 
                            //  sanity check: no auto definitions allowed in this loop
//                            Debug.Assert(!tempDefinitions[i].UserSize.IsAuto); 

                            var newMinSize = Math.Min(sizeToDistribute / (count - i), tempDefinitions[i].PreferredSize);
                            if (newMinSize > tempDefinitions[i].MinSize) { tempDefinitions[i].UpdateMinSize(newMinSize); }
                            sizeToDistribute -= newMinSize; 
                        }
 
                        //  sanity check: requested size must all be distributed 
                        Debug.Assert(_IsZero(sizeToDistribute));
                    } 
                    else if (requestedSize <= rangeMaxSize)
                    {
                        //
                        //  requestedSize bigger than preferred size, but fit into max size of the range. 
                        //  distribute according to the following logic:
                        //  * do not distribute into auto definitions, if possible - they should continue to stay "tight"; 
                        //  * for all non-auto definitions distribute to euqi-size min sizes, without exceeding max size. 
                        //
                        //  in order to achieve that, definitions are sorted in a way that all non-auto definitions 
                        //  are last, then definitions follow ascending order with MaxSize as the key of sorting.
                        //
                    	var sizeToDistribute;
                    	var i; 

                        Array.Sort(tempDefinitions, 0, count, s_spanMaxDistributionOrderComparer); 
                        for (i = 0, sizeToDistribute = requestedSize - rangePreferredSize; i < count - autoDefinitionsCount; ++i) 
                        {
                            //  sanity check: no auto definitions allowed in this loop 
//                            Debug.Assert(!tempDefinitions[i].UserSize.IsAuto);

                            var preferredSize = tempDefinitions[i].PreferredSize;
                            var newMinSize = preferredSize + sizeToDistribute / (count - autoDefinitionsCount - i); 
                            tempDefinitions[i].UpdateMinSize(Math.Min(newMinSize, tempDefinitions[i].SizeCache));
                            sizeToDistribute -= (tempDefinitions[i].MinSize - preferredSize); 
                        } 

                        for (; i < count; ++i) 
                        {
                            //  sanity check: only auto definitions allowed in this loop
//                            Debug.Assert(tempDefinitions[i].UserSize.IsAuto);
 
                            var preferredSize = tempDefinitions[i].MinSize;
                            var newMinSize = preferredSize + sizeToDistribute / (count - i); 
                            tempDefinitions[i].UpdateMinSize(Math.Min(newMinSize, tempDefinitions[i].SizeCache)); 
                            sizeToDistribute -= (tempDefinitions[i].MinSize - preferredSize);
                        } 

                        //  sanity check: requested size must all be distributed
//                        Debug.Assert(_IsZero(sizeToDistribute));
                    } 
                    else
                    { 
                        // 
                        //  requestedSize bigger than max size of the range.
                        //  distribute according to the following logic: 
                        //  * for all definitions distribute to equi-size min sizes.
                        //
                    	var equalSize = requestedSize / count;
 
                        if (    equalSize < maxMaxSize
                            &&  !_AreClose(equalSize, maxMaxSize)   ) 
                        { 
                            //  equi-size is less than maximum of maxSizes.
                            //  in this case distribute so that smaller definitions grow faster than 
                            //  bigger ones.
                        	var totalRemainingSize = maxMaxSize * count - rangeMaxSize;
                        	var sizeToDistribute = requestedSize - rangeMaxSize;
 
                            //  sanity check: totalRemainingSize and sizeToDistribute must be real positive numbers
//                            Debug.Assert(   !double.IsInfinity(totalRemainingSize) 
//                                        &&  !DoubleUtil.IsNaN(totalRemainingSize) 
//                                        &&  totalRemainingSize > 0
//                                        &&  !double.IsInfinity(sizeToDistribute) 
//                                        &&  !DoubleUtil.IsNaN(sizeToDistribute)
//                                        &&  sizeToDistribute > 0    );

                            for (var i = 0; i < count; ++i) 
                            {
                            	var deltaSize = (maxMaxSize - tempDefinitions[i].SizeCache) * sizeToDistribute / totalRemainingSize; 
                                tempDefinitions[i].UpdateMinSize(tempDefinitions[i].SizeCache + deltaSize); 
                            }
                        } 
                        else
                        {
                            //
                            //  equi-size is greater or equal to maximum of max sizes. 
                            //  all definitions receive equalSize as their mim sizes.
                            // 
                            for (var i = 0; i < count; ++i) 
                            {
                                tempDefinitions[i].UpdateMinSize(equalSize); 
                            }
                        }
                    }
                } 
            }
        }, 
 
        /// <summary>
        /// Resolves Star's for given array of definitions. 
        /// </summary>
        /// <param name="definitions">Array of definitions to resolve stars.</param>
        /// <param name="availableSize">All available size.</param>
        /// <remarks> 
        /// Must initialize LayoutSize for all Star entries in given array of definitions.
        /// </remarks> 
//        private void 
		ResolveStar:function( 
            /*DefinitionBase[]*/ definitions,
            /*double*/ availableSize) 
        {
            /*DefinitionBase[]*/var tempDefinitions = this.TempDefinitions;
            var starDefinitionsCount = 0;
            var takenSize = 0; 

            for (var i = 0; i < definitions.Length; ++i) 
            { 
                switch (definitions[i].SizeType)
                { 
                    case (LayoutTimeSizeType.Auto):
                        takenSize += definitions[i].MinSize;
                        break;
                    case (LayoutTimeSizeType.Pixel): 
                        takenSize += definitions[i].MeasureSize;
                        break; 
                    case (LayoutTimeSizeType.Star): 
                        {
                            tempDefinitions[starDefinitionsCount++] = definitions[i]; 

                            var starValue = definitions[i].UserSize.Value;

                            if (_IsZero(starValue)) 
                            {
                                definitions[i].MeasureSize = 0; 
                                definitions[i].SizeCache = 0; 
                            }
                            else 
                            {
                                //  clipping by c_starClip guarantees that sum of even a very big number of max'ed out star values
                                //  can be summed up without overflow
                                starValue = Math.Min(starValue, c_starClip); 

                                //  Note: normalized star value is temporary cached into MeasureSize 
                                definitions[i].MeasureSize = starValue; 
                                var maxSize             = Math.Max(definitions[i].MinSize, definitions[i].UserMaxSize);
                                maxSize                    = Math.Min(maxSize, c_starClip); 
                                definitions[i].SizeCache   = maxSize / starValue;
                            }
                        }
                        break; 
                }
            } 
 
            if (starDefinitionsCount > 0)
            { 
                Array.Sort(tempDefinitions, 0, starDefinitionsCount, s_starDistributionOrderComparer);

                //  the 'do {} while' loop below calculates sum of star weights in order to avoid fp overflow...
                //  partial sum value is stored in each definition's SizeCache member. 
                //  this way the algorithm guarantees (starValue <= definition.SizeCache) and thus
                //  (starValue / definition.SizeCache) will never overflow due to sum of star weights becoming zero. 
                //  this is an important change from previous implementation where the following was possible: 
                //  ((BigValueStar + SmallValueStar) - BigValueStar) resulting in 0...
                var allStarWeights = 0; 
                var i = starDefinitionsCount - 1;
                do
                {
                    allStarWeights += tempDefinitions[i].MeasureSize; 
                    tempDefinitions[i].SizeCache = allStarWeights;
                } while (--i >= 0); 
 
                i = 0;
                do 
                {
                	var resolvedSize;
                	var starValue = tempDefinitions[i].MeasureSize;
 
                    if (_IsZero(starValue))
                    { 
                        resolvedSize = tempDefinitions[i].MinSize; 
                    }
                    else 
                    {
                    	var userSize = Math.Max(availableSize - takenSize, 0.0) * (starValue / tempDefinitions[i].SizeCache);
                        resolvedSize    = Math.Min(userSize, tempDefinitions[i].UserMaxSize);
                        resolvedSize    = Math.Max(tempDefinitions[i].MinSize, resolvedSize); 
                    }
 
                    tempDefinitions[i].MeasureSize = resolvedSize; 
                    takenSize                     += resolvedSize;
                } while (++i < starDefinitionsCount); 
            }
        },

        /// <summary> 
        /// Calculates desired size for given array of definitions.
        /// </summary> 
        /// <param name="definitions">Array of definitions to use for calculations.</param> 
        /// <returns>Desired size.</returns>
//        private double 
		CalculateDesiredSize:function( 
            /*DefinitionBase[]*/ definitions)
        {
			var desiredSize = 0;
 
            for (var i = 0; i < definitions.Length; ++i)
            { 
                desiredSize += definitions[i].MinSize; 
            }
 
            return (desiredSize);
        },

        /// <summary> 
        /// Calculates and sets final size for all definitions in the given array.
        /// </summary> 
        /// <param name="definitions">Array of definitions to process.</param> 
        /// <param name="finalSize">Final size to lay out to.</param>
        /// <param name="rows">True if sizing row definitions, false for columns</param> 
//        private void 
		SetFinalSize:function(
            /*DefinitionBase[]*/ definitions,
            /*double*/ finalSize,
            /*bool*/ columns) 
        {
			var starDefinitionsCount = 0;                       //  traverses form the first entry up 
			var nonStarIndex = definitions.Length;              //  traverses from the last entry down 
			var allPreferredArrangeSize = 0;
			var useLayoutRounding = this.UseLayoutRounding; 
            /*int[]*/var definitionIndices = DefinitionIndices;
            /*double[]*/var roundingErrors = null;

            // If using layout rounding, check whether rounding needs to compensate for high DPI 
            var dpi = 1.0;
 
            if (useLayoutRounding) 
            {
                dpi = columns ? FrameworkElement.DpiScaleX : FrameworkElement.DpiScaleY; 
                roundingErrors = RoundingErrors;
            }

            for (var i = 0; i < definitions.Length; ++i) 
            {
                //  if definition is shared then is cannot be star 
//                Debug.Assert(!definitions[i].IsShared || !definitions[i].UserSize.IsStar); 

                if (definitions[i].UserSize.IsStar) 
                {
                	var starValue = definitions[i].UserSize.Value;

                    if (_IsZero(starValue)) 
                    {
                        //  cach normilized star value temporary into MeasureSize 
                        definitions[i].MeasureSize = 0; 
                        definitions[i].SizeCache = 0;
                    } 
                    else
                    {
                        //  clipping by c_starClip guarantees that sum of even a very big number of max'ed out star values
                        //  can be summed up without overflow 
                        starValue = Math.Min(starValue, c_starClip);
 
                        //  Note: normalized star value is temporary cached into MeasureSize 
                        definitions[i].MeasureSize = starValue;
                        var maxSize = Math.Max(definitions[i].MinSizeForArrange, definitions[i].UserMaxSize); 
                        maxSize = Math.Min(maxSize, c_starClip);
                        definitions[i].SizeCache = maxSize / starValue;
                        if (useLayoutRounding)
                        { 
                            roundingErrors[i] = definitions[i].SizeCache;
                            definitions[i].SizeCache = UIElement.RoundLayoutValue(definitions[i].SizeCache, dpi); 
                        } 
                    }
                    definitionIndices[starDefinitionsCount++] = i; 
                }
                else
                {
                	var userSize = 0; 

                    switch (definitions[i].UserSize.GridUnitType) 
                    { 
                        case (GridUnitType.Pixel):
                            userSize = definitions[i].UserSize.Value; 
                            break;

                        case (GridUnitType.Auto):
                            userSize = definitions[i].MinSizeForArrange; 
                            break;
                    } 
 
                    var userMaxSize;
 
                    if (definitions[i].IsShared)
                    {
                        //  overriding userMaxSize effectively prevents squishy-ness.
                        //  this is a "solution" to avoid shared definitions from been sized to 
                        //  different final size at arrange time, if / when different grids receive
                        //  different final sizes. 
                        userMaxSize = userSize; 
                    }
                    else 
                    {
                        userMaxSize = definitions[i].UserMaxSize;
                    }
 
                    definitions[i].SizeCache = Math.Max(definitions[i].MinSizeForArrange, Math.Min(userSize, userMaxSize));
                    if (useLayoutRounding) 
                    { 
                        roundingErrors[i] = definitions[i].SizeCache;
                        definitions[i].SizeCache = UIElement.RoundLayoutValue(definitions[i].SizeCache, dpi); 
                    }

                    allPreferredArrangeSize += definitions[i].SizeCache;
                    definitionIndices[--nonStarIndex] = i; 
                }
            } 
 
            //  indices should meet
            Debug.Assert(nonStarIndex == starDefinitionsCount); 

            if (starDefinitionsCount > 0)
            {
                /*StarDistributionOrderIndexComparer*/
            	var starDistributionOrderIndexComparer = new StarDistributionOrderIndexComparer(definitions); 
                Array.Sort(definitionIndices, 0, starDefinitionsCount, starDistributionOrderIndexComparer);
 
                //  the 'do {} while' loop below calculates sum of star weights in order to avoid fp overflow... 
                //  partial sum value is stored in each definition's SizeCache member.
                //  this way the algorithm guarantees (starValue <= definition.SizeCache) and thus 
                //  (starValue / definition.SizeCache) will never overflow due to sum of star weights becoming zero.
                //  this is an important change from previous implementation where the following was possible:
                //  ((BigValueStar + SmallValueStar) - BigValueStar) resulting in 0...
                var allStarWeights = 0; 
                var i = starDefinitionsCount - 1;
                do 
                { 
                    allStarWeights += definitions[definitionIndices[i]].MeasureSize;
                    definitions[definitionIndices[i]].SizeCache = allStarWeights; 
                } while (--i >= 0);

                i = 0;
                do 
                {
                	var resolvedSize; 
                	var starValue = definitions[definitionIndices[i]].MeasureSize; 

                    if (_IsZero(starValue)) 
                    {
                        resolvedSize = definitions[definitionIndices[i]].MinSizeForArrange;
                    }
                    else 
                    {
                    	var userSize = Math.Max(finalSize - allPreferredArrangeSize, 0.0) * (starValue / definitions[definitionIndices[i]].SizeCache); 
                        resolvedSize = Math.Min(userSize, definitions[definitionIndices[i]].UserMaxSize); 
                        resolvedSize = Math.Max(definitions[definitionIndices[i]].MinSizeForArrange, resolvedSize);
                    } 

                    definitions[definitionIndices[i]].SizeCache = resolvedSize;
                    if (useLayoutRounding)
                    { 
                        roundingErrors[definitionIndices[i]] = definitions[definitionIndices[i]].SizeCache;
                        definitions[definitionIndices[i]].SizeCache = UIElement.RoundLayoutValue(definitions[definitionIndices[i]].SizeCache, dpi); 
                    } 

                    allPreferredArrangeSize += definitions[definitionIndices[i]].SizeCache; 
                } while (++i < starDefinitionsCount);
            }

            if (    allPreferredArrangeSize > finalSize 
                &&  !_AreClose(allPreferredArrangeSize, finalSize)  )
            { 
                /*DistributionOrderIndexComparer*/
            	var distributionOrderIndexComparer = new DistributionOrderIndexComparer(definitions); 
                Array.Sort(definitionIndices, 0, definitions.Length, distributionOrderIndexComparer);
                var sizeToDistribute = finalSize - allPreferredArrangeSize; 

                for (var i = 0; i < definitions.Length; ++i)
                {
                	var definitionIndex = definitionIndices[i]; 
                	var final1 = definitions[definitionIndex].SizeCache + (sizeToDistribute / (definitions.Length - i));
                	var finalOld = final1; 
                    final1 = Math.max(final1, definitions[definitionIndex].MinSizeForArrange); 
                    final1 = Math.min(final1, definitions[definitionIndex].SizeCache);
 
                    if (useLayoutRounding)
                    {
                        roundingErrors[definitionIndex] = final1;
                        final1 = UIElement.RoundLayoutValue(finalOld, dpi); 
                        final1 = Math.Max(final1, definitions[definitionIndex].MinSizeForArrange);
                        final1 = Math.Min(final1, definitions[definitionIndex].SizeCache); 
                    } 

                    sizeToDistribute -= (final1 - definitions[definitionIndex].SizeCache); 
                    definitions[definitionIndex].SizeCache = final1;
                }

                allPreferredArrangeSize = finalSize - sizeToDistribute; 
            }
 
            if (useLayoutRounding) 
            {
                if (!_AreClose(allPreferredArrangeSize, finalSize)) 
                {
                    // Compute deltas
                    for (var i = 0; i < definitions.Length; ++i)
                    { 
                        roundingErrors[i] = roundingErrors[i] - definitions[i].SizeCache;
                        definitionIndices[i] = i; 
                    } 

                    // Sort rounding errors 
                    /*RoundingErrorIndexComparer*/
                    var roundingErrorIndexComparer = new RoundingErrorIndexComparer(roundingErrors);
                    Array.Sort(definitionIndices, 0, definitions.Length, roundingErrorIndexComparer);
                    var adjustedSize = allPreferredArrangeSize;
                    var dpiIncrement = UIElement.RoundLayoutValue(1.0, dpi); 

                    if (allPreferredArrangeSize > finalSize) 
                    { 
                    	var i = definitions.Length - 1;
                        while ((adjustedSize > finalSize && !_AreClose(adjustedSize, finalSize)) && i >= 0) 
                        {
                            /*DefinitionBase*/var definition = definitions[definitionIndices[i]];
                            var final = definition.SizeCache - dpiIncrement;
                            final = Math.Max(final, definition.MinSizeForArrange); 
                            if (final < definition.SizeCache)
                            { 
                                adjustedSize -= dpiIncrement; 
                            }
                            definition.SizeCache = final; 
                            i--;
                        }
                    }
                    else if (allPreferredArrangeSize < finalSize) 
                    {
                    	var i = 0; 
                        while ((adjustedSize < finalSize && !_AreClose(adjustedSize, finalSize)) && i < definitions.Length) 
                        {
                            /*DefinitionBase*/var definition = definitions[definitionIndices[i]]; 
                            var final = definition.SizeCache + dpiIncrement;
                            final = Math.Max(final, definition.MinSizeForArrange);
                            if (final > definition.SizeCache)
                            { 
                                adjustedSize += dpiIncrement;
                            } 
                            definition.SizeCache = final; 
                            i++;
                        } 
                    }
                }
            }
 
            definitions[0].FinalOffset = 0.0;
            for (var i = 0; i < definitions.Length; ++i) 
            { 
                definitions[(i + 1) % definitions.length].FinalOffset = definitions[i].FinalOffset + definitions[i].SizeCache;
            } 
        },

        /// <summary> 
        /// Calculates final (aka arrange) size for given range.
        /// </summary> 
        /// <param name="definitions">Array of definitions to process.</param> 
        /// <param name="start">Start of the range.</param>
        /// <param name="count">Number of items in the range.</param> 
        /// <returns>Final size.</returns>
//        private double 
		GetFinalSizeForRange:function(
            /*DefinitionBase[]*/ definitions,
            /*int*/ start, 
            /*int*/ count)
        { 
			var size = 0; 
			var i = start + count - 1;
 
            do
            {
                size += definitions[i].SizeCache;
            } while (--i >= start); 

            return (size); 
        }, 

        /// <summary> 
        /// Clears dirty state for the grid and its columns / rows
        /// </summary>
//        private void 
		SetValid:function()
        { 
            /*ExtendedData*/var extData = ExtData;
            if (extData != null) 
            { 
//                for (int i = 0; i < PrivateColumnCount; ++i) DefinitionsU[i].SetValid ();
//                for (int i = 0; i < PrivateRowCount; ++i) DefinitionsV[i].SetValid (); 

                if (extData.TempDefinitions != null)
                {
                    //  TempDefinitions has to be cleared to avoid "memory leaks" 
                    Array.Clear(extData.TempDefinitions, 0, Math.Max(DefinitionsU.Length, DefinitionsV.Length));
                    extData.TempDefinitions = null; 
                } 
            }
        }, 
 
        /// <summary>
        /// Synchronized ShowGridLines property with the state of the grid's visual collection 
        /// by adding / removing GridLinesRenderer visual.
        /// Returns a reference to GridLinesRenderer visual or null.
        /// </summary>
//        private GridLinesRenderer 
		EnsureGridLinesRenderer:function() 
        {
            // 
            //  synchronize the state 
            //
            if (ShowGridLines && (_gridLinesRenderer == null)) 
            {
                _gridLinesRenderer = new GridLinesRenderer();
                this.AddVisualChild(_gridLinesRenderer);
            } 

            if ((!ShowGridLines) && (_gridLinesRenderer != null)) 
            { 
                this.RemoveVisualChild(_gridLinesRenderer);
                _gridLinesRenderer = null; 
            }

            return (_gridLinesRenderer);
        },

        /// <summary> 
        /// SetFlags is used to set or unset one or multiple 
        /// flags on the object.
        /// </summary> 
//        private void 
		SetFlags:function(/*bool*/ value, /*Flags*/ flags)
        {
            this._flags = value ? (this._flags | flags) : (this._flags & (~flags));
        }, 

        /// <summary> 
        /// CheckFlagsAnd returns <c>true</c> if all the flags in the 
        /// given bitmask are set on the object.
        /// </summary> 
//        private bool 
		CheckFlagsAnd:function(/*Flags*/ flags)
        {
            return ((this._flags & flags) == flags);
        }, 

        /// <summary> 
        /// CheckFlagsOr returns <c>true</c> if at least one flag in the 
        /// given bitmask is set.
        /// </summary> 
        /// <remarks>
        /// If no bits are set in the given bitmask, the method returns
        /// <c>true</c>.
        /// </remarks> 
//        private bool 
		CheckFlagsOr:function(/*Flags*/ flags)
        { 
            return (flags == 0 || (this._flags & flags) != 0); 
        },
 
	});
	
	Object.defineProperties(Grid.prototype,{
        /// <summary> 
        /// <see cref="FrameworkElement.LogicalChildren"/>
        /// </summary> 
//        protected internal override IEnumerator 
		LogicalChildren:
        {
            get:function()
            { 
                // empty panel or a panel being used as the items
                // host has *no* logical children; give empty enumerator 
                var noChildren = (Panel.prototype.VisualChildrenCount == 0) || IsItemsHost; 

                if (noChildren) 
                {
                    var extData = this.ExtData;

                    if (    extData == null 
                        ||  (   (extData.ColumnDefinitions == null || extData.ColumnDefinitions.Count == 0)
                            &&  (extData.RowDefinitions    == null || extData.RowDefinitions.Count    == 0) ) 
                       ) 
                    {
                        //  grid is empty 
                        return EmptyEnumerator.Instance;
                    }
                }
 
                return (new GridChildrenCollectionEnumeratorSimple(this, !noChildren));
            } 
        }, 

        /// <summary>
        /// ShowGridLines property.
        /// </summary> 
//        public bool 
		ShowGridLines:
        { 
            get:function() { return (this.CheckFlagsAnd(Flags.ShowGridLinesPropertyValue)); }, 
            set:function(value) { this.SetValue(ShowGridLinesProperty, value); }
        }, 

        /// <summary>
        /// Returns a ColumnDefinitionCollection of column definitions.
        /// </summary> 
//        public ColumnDefinitionCollection 
		ColumnDefinitions: 
        { 
            get:function()
            { 
                if (this._data == null) { this._data = new ExtendedData(); }
                if (this._data.ColumnDefinitions == null) { this._data.ColumnDefinitions = new DefinitionCollection(this, ColumnDefinition.Type); }

                return (this._data.ColumnDefinitions); 
            }
        }, 
 
        /// <summary>
        /// Returns a RowDefinitionCollection of row definitions. 
        /// </summary>
//        public RowDefinitionCollection 
		RowDefinitions:
        { 
            get:function()
            { 
                if (this._data == null) { this._data = new ExtendedData(); } 
                if (this._data.RowDefinitions == null) { this._data.RowDefinitions = new DefinitionCollection(this, RowDefinition.Type); }
 
                return (this._data.RowDefinitions);
            }
        },
        
        

        /// <summary> 
        ///  Derived classes override this property to enable the Visual code to enumerate
        ///  the Visual children. Derived classes need to return the number of children 
        ///  from this method. 
        ///
        ///    By default a Visual does not have any children. 
        ///
        ///  Remark: During this virtual method the Visual tree must not be modified.
        /// </summary>
//        protected override int 
		VisualChildrenCount: 
        {
            //since GridLinesRenderer has not been added as a child, so we do not subtract 
            get:function() { return Panel.prototype.VisualChildrenCount + (this._gridLinesRenderer != null ? 1 : 0); } 
        },

        /// <summary>
        /// Convenience accessor to MeasureOverrideInProgress bit flag. 
        /// </summary>
//        internal bool 
		MeasureOverrideInProgress: 
        { 
            get:function() { return (this.CheckFlagsAnd(Flags.MeasureOverrideInProgress)); }, 
            set:function(value) { this.SetFlags(value, Flags.MeasureOverrideInProgress); } 
        },

        /// <summary>
        /// Convenience accessor to ArrangeOverrideInProgress bit flag. 
        /// </summary>
//        internal bool 
		ArrangeOverrideInProgress: 
        { 
            get:function() { return (this.CheckFlagsAnd(Flags.ArrangeOverrideInProgress)); }, 
            set:function(value) { this.SetFlags(value, Flags.ArrangeOverrideInProgress); } 
        },

        /// <summary>
        /// Convenience accessor to ValidDefinitionsUStructure bit flag. 
        /// </summary>
//        internal bool 
		ColumnDefinitionCollectionDirty: 
        { 
            get:function() { return (!this.CheckFlagsAnd(Flags.ValidDefinitionsUStructure)); }, 
            set:function(value) { this.SetFlags(!value, Flags.ValidDefinitionsUStructure); } 
        },

        /// <summary>
        /// Convenience accessor to ValidDefinitionsVStructure bit flag. 
        /// </summary>
//        internal bool 
		RowDefinitionCollectionDirty: 
        { 
            get:function() { return (!this.CheckFlagsAnd(Flags.ValidDefinitionsVStructure)); }, 
            set:function(value) { this.SetFlags(!value, Flags.ValidDefinitionsVStructure); } 
        },


        /// <summary> 
        /// Private version returning array of column definitions. 
        /// </summary>
//        private DefinitionBase[] 
		DefinitionsU: 
        {
            get:function() { return (ExtData.DefinitionsU); }
        },
 
        /// <summary>
        /// Private version returning array of row definitions. 
        /// </summary> 
//        private DefinitionBase[] 
		DefinitionsV:
        { 
            get:function() { return (ExtData.DefinitionsV); }
        },

        /// <summary> 
        /// Helper accessor to layout time array of definitions.
        /// </summary> 
//        private DefinitionBase[] 
		TempDefinitions: 
        {
            get:function() 
            {
                var extData = ExtData;
                var requiredLength = Math.Max(DefinitionsU.Length, DefinitionsV.Length);
 
                if (    extData.TempDefinitions == null
                    ||  extData.TempDefinitions.Length < requiredLength   ) 
                { 
                    /*WeakReference*/var tempDefinitionsWeakRef = Thread.GetData(s_tempDefinitionsDataSlot);
                    if (tempDefinitionsWeakRef == null) 
                    {
                        extData.TempDefinitions = new DefinitionBase[requiredLength * 2];
                        Thread.SetData(s_tempDefinitionsDataSlot, new WeakReference(extData.TempDefinitions));
                    } 
                    else
                    { 
                        extData.TempDefinitions = /*(DefinitionBase[])*/tempDefinitionsWeakRef.Target; 
                        if (    extData.TempDefinitions == null
                            ||  extData.TempDefinitions.Length < requiredLength   ) 
                        {
                            extData.TempDefinitions = new DefinitionBase[requiredLength * 2];
                            tempDefinitionsWeakRef.Target = extData.TempDefinitions;
                        } 
                    }
                } 
                return (extData.TempDefinitions); 
            }
        }, 

        /// <summary>
        /// Helper accessor to definition indices.
        /// </summary> 
//        private int[] 
		DefinitionIndices:
        { 
            get:function() 
            {
                var requiredLength = Math.max(DefinitionsU.Length, DefinitionsV.Length); 

                if (this._definitionIndices == null && requiredLength == 0)
                {
                	this._definitionIndices = [1]; //new int[1]; 
                }
                else if (_definitionIndices == null || _definitionIndices.Length < requiredLength) 
                { 
                	this._definitionIndices = new int[requiredLength];
                } 

                return _definitionIndices;
            }
        }, 

        /// <summary> 
        /// Helper accessor to rounding errors. 
        /// </summary>
//        private double[] 
		RoundingErrors: 
        {
            get:function()
            {
                var requiredLength = Math.max(DefinitionsU.Length, DefinitionsV.Length); 

                if (this._roundingErrors == null && requiredLength == 0) 
                { 
                	this._roundingErrors = new double[1];
                } 
                else if (this._roundingErrors == null || this._roundingErrors.Length < requiredLength)
                {
                	this._roundingErrors = new double[requiredLength];
                } 
                return this._roundingErrors;
            } 
        }, 

        /// <summary> 
        /// Private version returning array of cells.
        /// </summary>
//        private CellCache[] 
		PrivateCells:
        { 
            get:function() { return (ExtData.CellCachesCollection); }
        }, 
 
        /// <summary>
        /// Convenience accessor to ValidCellsStructure bit flag. 
        /// </summary>
//        private bool 
		CellsStructureDirty:
        {
            get:function() { return (!this.CheckFlagsAnd(Flags.ValidCellsStructure)); }, 
            set:function(value) { this.SetFlags(!value, Flags.ValidCellsStructure); }
        }, 
 
        /// <summary>
        /// Convenience accessor to ListenToNotifications bit flag. 
        /// </summary>
//        private bool 
		ListenToNotifications:
        {
            get:function() { return (this.CheckFlagsAnd(Flags.ListenToNotifications)); }, 
            set:function(value) { this.SetFlags(value, Flags.ListenToNotifications); }
        }, 
 
        /// <summary>
        /// Convenience accessor to SizeToContentU bit flag. 
        /// </summary>
//        private bool 
		SizeToContentU:
        {
            get:function() { return (this.CheckFlagsAnd(Flags.SizeToContentU)); }, 
            set:function(value) { this.SetFlags(value, Flags.SizeToContentU); }
        }, 
 
        /// <summary>
        /// Convenience accessor to SizeToContentV bit flag. 
        /// </summary>
//        private bool 
		SizeToContentV:
        {
            get:function() { return (this.CheckFlagsAnd(Flags.SizeToContentV)); }, 
            set:function(value) { this.SetFlags(value, Flags.SizeToContentV); }
        }, 
 
        /// <summary>
        /// Convenience accessor to HasStarCellsU bit flag. 
        /// </summary>
//        private bool 
		HasStarCellsU:
        {
            get:function() { return (this.CheckFlagsAnd(Flags.HasStarCellsU)); }, 
            set:function(value) { this.SetFlags(value, Flags.HasStarCellsU); }
        }, 
 
        /// <summary>
        /// Convenience accessor to HasStarCellsV bit flag. 
        /// </summary>
//        private bool 
		HasStarCellsV:
        {
            get:function() { return (this.CheckFlagsAnd(Flags.HasStarCellsV)); }, 
            set:function(value) { this.SetFlags(value, Flags.HasStarCellsV); }
        }, 
 
        /// <summary>
        /// Convenience accessor to HasGroup3CellsInAutoRows bit flag. 
        /// </summary>
//        private bool 
		HasGroup3CellsInAutoRows:
        {
            get:function() { return (this.CheckFlagsAnd(Flags.HasGroup3CellsInAutoRows)); }, 
            set:function(value) { this.SetFlags(value, Flags.HasGroup3CellsInAutoRows); }
        },
 

        /// <summary>
        /// Returns reference to extended data bag.
        /// </summary> 
//        private ExtendedData 
		ExtData:
        { 
            get:function() { return (this._data); } 
        },

//        public String 
		Columns: 
        { 
            get:function() { return (this.GetValue(Grid.ColumnsProperty)); }, 
            set:function(value) { this.SetValue(Grid.ColumnsProperty, value); }
        }, 
 
//      public String 
		Rows:
        { 
            get:function() { return (this.GetValue(Grid.RowsProperty)); }, 
            set:function(value) { this.SetValue(Grid.RowsProperty, value); }
        },

	});
	
	Object.defineProperties(Grid,{
//        private static readonly LocalDataStoreSlot s_tempDefinitionsDataSlot = Thread.AllocateDataSlot();
//        private static readonly IComparer s_spanPreferredDistributionOrderComparer = new SpanPreferredDistributionOrderComparer(); 
//        private static readonly IComparer s_spanMaxDistributionOrderComparer = new SpanMaxDistributionOrderComparer(); 
//        private static readonly IComparer s_starDistributionOrderComparer = new StarDistributionOrderComparer();
//        private static readonly IComparer s_distributionOrderComparer = new DistributionOrderComparer(); 

        /// <summary>
        /// ShowGridLines property. This property is used mostly
        /// for simplification of visual debuggig. When it is set 
        /// to <c>true</c> grid lines are drawn to visualize location
        /// of grid lines. 
        /// </summary> 
//        public static readonly DependencyProperty 
        ShowGridLinesProperty:
        {
        	get:function(){
        		if(Grid._ShowGridLinesProperty === undefined){
        			Grid._ShowGridLinesProperty  =
                        DependencyProperty.Register( 
                                "ShowGridLines",
                                Boolean.Type,
                                Grid.Type,
                                /*new FrameworkPropertyMetadata( 
                                        false,
                                        new PropertyChangedCallback(null, OnShowGridLinesPropertyChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                                        false,
                                        new PropertyChangedCallback(null, OnShowGridLinesPropertyChanged))); 
        		}
        		
        		return Grid._ShowGridLinesProperty;
        	}
        }, 
 
        /// <summary>
        /// Column property. This is an attached property. 
        /// Grid defines Column property, so that it can be set
        /// on any element treated as a cell. Column property
        /// specifies child's position with respect to columns.
        /// </summary> 
        /// <remarks>
        /// <para> Columns are 0 - based. In order to appear in first column, element 
        /// should have Column property set to <c>0</c>. </para> 
        /// <para> Default value for the property is <c>0</c>. </para>
        /// </remarks> 
//        public static readonly DependencyProperty 
        ColumnProperty:
        {
        	get:function(){
        		if(Grid._ColumnProperty === undefined){
        			Grid._ColumnProperty =
                        DependencyProperty.RegisterAttached(
                                "Column", 
                                Number.Type,
                                Grid.Type, 
                                /*new FrameworkPropertyMetadata( 
                                        0,
                                        new PropertyChangedCallback(null, OnCellAttachedPropertyChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                                        1,
                                        new PropertyChangedCallback(null, OnCellAttachedPropertyChanged)), 
                                new ValidateValueCallback(null, IsIntValueNotNegative));
        		}
        		
        		return Grid._ColumnProperty;
        	}
        }, 

        /// <summary>
        /// Row property. This is an attached property. 
        /// Grid defines Row, so that it can be set
        /// on any element treated as a cell. Row property 
        /// specifies child's position with respect to rows. 
        /// <remarks>
        /// <para> Rows are 0 - based. In order to appear in first row, element 
        /// should have Row property set to <c>0</c>. </para>
        /// <para> Default value for the property is <c>0</c>. </para>
        /// </remarks>
        /// </summary> 
//        public static readonly DependencyProperty 
        RowProperty:
        {
        	get:function(){
        		if(Grid._RowProperty === undefined){
        			Grid._RowProperty = 
                        DependencyProperty.RegisterAttached( 
                                "Row",
                                Number.Type, 
                                Grid.Type,
                                /*new FrameworkPropertyMetadata(
                                        0,
                                        new PropertyChangedCallback(null, OnCellAttachedPropertyChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
                                		1,
                                        new PropertyChangedCallback(null, OnCellAttachedPropertyChanged)), 
                                new ValidateValueCallback(null, IsIntValueNotNegative));
        		}
        		
        		return Grid._RowProperty;
        	}
        }, 
 
        /// <summary> 
        /// ColumnSpan property. This is an attached property.
        /// Grid defines ColumnSpan, so that it can be set 
        /// on any element treated as a cell. ColumnSpan property
        /// specifies child's width with respect to columns.
        /// Example, ColumnSpan == 2 means that child will span across two columns.
        /// </summary> 
        /// <remarks>
        /// Default value for the property is <c>1</c>. 
        /// </remarks> 
//        public static readonly DependencyProperty 
        ColumnSpanProperty:
        {
        	get:function(){
        		if(Grid._ColumnSpanProperty === undefined){
        			Grid._ColumnSpanProperty = 
                        DependencyProperty.RegisterAttached(
                                "ColumnSpan",
                                Number.Type,
                                Grid.Type, 
                               /* new FrameworkPropertyMetadata(
                                        1, 
                                        new PropertyChangedCallback(null, OnCellAttachedPropertyChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(1, 
                                        new PropertyChangedCallback(null, OnCellAttachedPropertyChanged)), 
                                new ValidateValueCallback(null, IsIntValueGreaterThanZero));
        		}
        		
        		return Grid._ColumnSpanProperty;
        	}
        },  
 
        /// <summary>
        /// RowSpan property. This is an attached property.
        /// Grid defines RowSpan, so that it can be set
        /// on any element treated as a cell. RowSpan property 
        /// specifies child's height with respect to row grid lines.
        /// Example, RowSpan == 3 means that child will span across three rows. 
        /// </summary> 
        /// <remarks>
        /// Default value for the property is <c>1</c>. 
        /// </remarks>
//        public static readonly DependencyProperty 
        RowSpanProperty:
        {
        	get:function(){
        		if(Grid._RowSpanProperty === undefined){
        			Grid._RowSpanProperty =
                        DependencyProperty.RegisterAttached( 
                                "RowSpan",
                                Number.Type, 
                                Grid.Type, 
                                /*new FrameworkPropertyMetadata(
                                        1, 
                                        new PropertyChangedCallback(OnCellAttachedPropertyChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(1, 
                                        new PropertyChangedCallback(null, OnCellAttachedPropertyChanged)),
                                new ValidateValueCallback(null, IsIntValueGreaterThanZero));
        		}
        		
        		return Grid._RowSpanProperty;
        	}
        },  

 
        /// <summary>
        /// IsSharedSizeScope property marks scoping element for shared size. 
        /// </summary> 
//        public static readonly DependencyProperty 
        IsSharedSizeScopeProperty:
        {
        	get:function(){
        		if(Grid._IsSharedSizeScopeProperty === undefined){
        			Grid._IsSharedSizeScopeProperty =
                        DependencyProperty.RegisterAttached( 
                                "IsSharedSizeScope",
                                Boolean.Type,
                                Grid.Type,
                                /*new FrameworkPropertyMetadata( 
                                        false,
                                        new PropertyChangedCallback(null, DefinitionBase.OnIsSharedSizeScopePropertyChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(false,
                                        new PropertyChangedCallback(null, DefinitionBase.OnIsSharedSizeScopePropertyChanged)));
        		}
        		
        		return Grid._IsSharedSizeScopeProperty;
        	}
        }, 
        
        ColumnsProperty:
        {
        	get:function(){
        		if(Grid._ColumnsProperty === undefined){
        			Grid._ColumnsProperty = 
                        DependencyProperty.Register(
                                "Columns",
                                String.Type,
                                Grid.Type, 
                               /* new FrameworkPropertyMetadata(
                                        1, 
                                        new PropertyChangedCallback(null, OnCellAttachedPropertyChanged))*/
                                FrameworkPropertyMetadata.BuildWithDV(null)/*, 
                                new ValidateValueCallback(null, IsIntValueGreaterThanZero)*/);
        		}
        		
        		return Grid._ColumnsProperty;
        	}
        }, 
        
        RowsProperty:
        {
        	get:function(){
        		if(Grid._RowsProperty === undefined){
        			Grid._RowsProperty = 
                        DependencyProperty.Register(
                                "Rows",
                                String.Type,
                                Grid.Type, 
                               /* new FrameworkPropertyMetadata(
                                        1, 
                                        new PropertyChangedCallback(null, OnCellAttachedPropertyChanged))*/
                                FrameworkPropertyMetadata.BuildWithDV(null)/*, 
                                new ValidateValueCallback(null, IsIntValueGreaterThanZero)*/);
        		}
        		
        		return Grid._RowsProperty;
        	}
        }, 
  
	});
	
  
    /// <summary> 
    /// Helper for setting Column property on a UIElement.
    /// </summary>
    /// <param name="element">UIElement to set Column property on.</param>
    /// <param name="value">Column property value.</param> 
//    public static void 
	Grid.SetColumn = function(/*UIElement*/ element, /*int*/ value)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(ColumnProperty, value);
    };

    /// <summary> 
    /// Helper for reading Column property from a UIElement. 
    /// </summary>
    /// <param name="element">UIElement to read Column property from.</param> 
    /// <returns>Column property value.</returns>
//    public static int 
	Grid.GetColumn = function(/*UIElement*/ element)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }

        return (element.GetValue(Grid.ColumnProperty));
    };

    /// <summary> 
    /// Helper for setting Row property on a UIElement.
    /// </summary> 
    /// <param name="element">UIElement to set Row property on.</param> 
    /// <param name="value">Row property value.</param>
//    public static void 
	Grid.SetRow = function(/*UIElement*/ element, /*int*/ value) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(Grid.RowProperty, value); 
    };

    /// <summary>
    /// Helper for reading Row property from a UIElement.
    /// </summary>
    /// <param name="element">UIElement to read Row property from.</param> 
    /// <returns>Row property value.</returns>
//    public static int 
	Grid.GetRow = function(/*UIElement*/ element) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }

        return (element.GetValue(Grid.RowProperty));
    };

    /// <summary>
    /// Helper for setting ColumnSpan property on a UIElement. 
    /// </summary>
    /// <param name="element">UIElement to set ColumnSpan property on.</param>
    /// <param name="value">ColumnSpan property value.</param>
//    public static void 
	Grid.SetColumnSpan = function(/*UIElement*/ element, /*int*/ value) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        element.SetValue(Grid.ColumnSpanProperty, value);
    };

    /// <summary>
    /// Helper for reading ColumnSpan property from a UIElement. 
    /// </summary> 
    /// <param name="element">UIElement to read ColumnSpan property from.</param>
    /// <returns>ColumnSpan property value.</returns> 
//    public static int 
	Grid.GetColumnSpan = function(/*UIElement*/ element)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 

        return (element.GetValue(Grid.ColumnSpanProperty)); 
    };

    /// <summary>
    /// Helper for setting RowSpan property on a UIElement. 
    /// </summary>
    /// <param name="element">UIElement to set RowSpan property on.</param> 
    /// <param name="value">RowSpan property value.</param> 
//    public static void 
    Grid.SetRowSpan = function(/*UIElement*/ element, /*int*/ value)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 

        element.SetValue(Grid.RowSpanProperty, value); 
    }; 

    /// <summary> 
    /// Helper for reading RowSpan property from a UIElement.
    /// </summary>
    /// <param name="element">UIElement to read RowSpan property from.</param>
    /// <returns>RowSpan property value.</returns> 
//    public static int 
	Grid.GetRowSpan = function(/*UIElement*/ element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }

        return (element.GetValue(Grid.RowSpanProperty)); 
    };

    /// <summary> 
    /// Helper for setting IsSharedSizeScope property on a UIElement.
    /// </summary> 
    /// <param name="element">UIElement to set IsSharedSizeScope property on.</param>
    /// <param name="value">IsSharedSizeScope property value.</param>
//    public static void 
	Grid.SetIsSharedSizeScope = function(/*UIElement*/ element, /*bool*/ value)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(Grid.IsSharedSizeScopeProperty, value);
    };

    /// <summary> 
    /// Helper for reading IsSharedSizeScope property from a UIElement.
    /// </summary> 
    /// <param name="element">UIElement to read IsSharedSizeScope property from.</param> 
    /// <returns>IsSharedSizeScope property value.</returns>
//    public static bool 
	Grid.GetIsSharedSizeScope = function(/*UIElement*/ element) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }

        return (element.GetValue(Grid.IsSharedSizeScopeProperty)); 
    };

    /// <summary>
    /// Helper method to register a span information for delayed processing. 
    /// </summary> 
    /// <param name="store">Reference to a hashtable object used as storage.</param>
    /// <param name="start">Span starting index.</param> 
    /// <param name="count">Span count.</param>
    /// <param name="u"><c>true</c> if this is a column span. <c>false</c> if this is a row span.</param>
    /// <param name="value">Value to store. If an entry already exists the biggest value is stored.</param>
//    private static void 
	function RegisterSpan( 
        /*ref Hashtable*/ store,
        /*int*/ start, 
        /*int*/ count, 
        /*bool*/ u,
        /*double*/ value) 
    {
        if (store == null)
        {
            store = new Hashtable(); 
        }

        /*SpanKey*/var key = new SpanKey(start, count, u); 
        var o = store.Get(key);

        if (    o == null
            ||  value > o   )
        {
            store.Set(key, value); 
        }
    } 

  
    /// <summary>
    /// Sorts row/column indices by rounding error if layout rounding is applied. 
    /// </summary>
    /// <param name="x">Index, rounding error pair</param> 
    /// <param name="y">Index, rounding error pair</param> 
    /// <returns>1 if x.Value > y.Value, 0 if equal, -1 otherwise</returns>
//    private static int 
	function CompareRoundingErrors(/*KeyValuePair<int, double>*/ x, /*KeyValuePair<int, double>*/ y) 
    {
        if (x.Value < y.Value)
        {
            return -1; 
        }
        else if (x.Value > y.Value) 
        { 
            return 1;
        } 
        return 0;
    }


    /// <summary>
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/>
    /// </summary>
//    private static void 
	function OnShowGridLinesPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        if (d.ExtData != null    // trivial grid is 1 by 1. there is no grid lines anyway
            &&  d.ListenToNotifications) 
        {
            d.InvalidateVisual();
        }

        d.SetFlags(e.NewValue, Flags.ShowGridLinesPropertyValue);
    } 

    /// <summary>
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/> 
    /// </summary>
//    private static void 
	function OnCellAttachedPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        var child = d instanceof Visual ? d: null; 

        if (child != null) 
        { 
            var grid = VisualTreeHelper.GetParent(child);
            grid = grid instanceof Grid ? grid : null;
            if (    grid != null 
                &&  grid.ExtData != null
                &&  grid.ListenToNotifications  )
            {
                grid.CellsStructureDirty = true; 
                grid.InvalidateMeasure();
            } 
        } 
    }

    /// <summary>
    /// <see cref="DependencyProperty.ValidateValueCallback"/>
    /// </summary>
//    private static bool 
	function IsIntValueNotNegative(/*object*/ value) 
    {
        return (value >= 0); 
    } 

    /// <summary> 
    /// <see cref="DependencyProperty.ValidateValueCallback"/>
    /// </summary>
//    private static bool 
	function IsIntValueGreaterThanZero(/*object*/ value)
    { 
        return (value > 0);
    } 

    /// <summary>
    /// Helper for Comparer methods. 
    /// </summary>
    /// <returns>
    /// true iff one or both of x and y are null, in which case result holds
    /// the relative sort order. 
    /// </returns>
//    private static bool 
	function CompareNullRefs(/*object*/ x, /*object*/ y, /*out int result*/resultOut) 
    { 
		resultOut.result = 2;

        if (x == null)
        {
            if (y == null)
            { 
            	resultOut.result = 0;
            } 
            else 
            {
            	resultOut.result = -1; 
            }
        }
        else
        { 
            if (y == null)
            { 
            	resultOut.result = 1; 
            }
        } 

        return (resultOut.result != 2);
    }

    /// <summary>
    /// fp version of <c>d == 0</c>. 
    /// </summary>
    /// <param name="d">Value to check.</param>
    /// <returns><c>true</c> if d == 0.</returns>
//    private static bool 
	function _IsZero(/*double*/ d) 
    {
        return (Math.Abs(d) < c_epsilon); 
    } 

    /// <summary> 
    /// fp version of <c>d1 == d2</c>
    /// </summary>
    /// <param name="d1">First value to compare</param>
    /// <param name="d2">Second value to compare</param> 
    /// <returns><c>true</c> if d1 == d2</returns>
//    private static bool 
	function _AreClose(/*double*/ d1, /*double*/ d2) 
    { 
        return (Math.abs(d1 - d2) < c_epsilon);
    } 
  
	
	Grid.Type = new Type("Grid", Grid, [Panel.Type, IAddChild.Type]);
	return Grid;
});

//
//        private ExtendedData _data;                             //  extended data instantiated on demand, for non-trivial case handling only
//        private Flags _flags;                                   //  grid validity / property caches dirtiness flags
//        private GridLinesRenderer _gridLinesRenderer;
// 
//        // Keeps track of definition indices.
//        int[] _definitionIndices; 
// 
//        // Stores unrounded values and rounding errors during layout rounding.
//        double[] _roundingErrors; 
// 
//        private const double c_epsilon = 1e-5;                  //  used in fp calculations
//        private const double c_starClip = 1e298;                //  used as maximum for clipping star values during normalization
//        private const int c_layoutLoopMaxCount = 5;             // 5 is an arbitrary constant chosen to end the measure loop 
//        private static readonly LocalDataStoreSlot s_tempDefinitionsDataSlot = Thread.AllocateDataSlot();
//        private static readonly IComparer s_spanPreferredDistributionOrderComparer = new SpanPreferredDistributionOrderComparer(); 
//        private static readonly IComparer s_spanMaxDistributionOrderComparer = new SpanMaxDistributionOrderComparer(); 
//        private static readonly IComparer s_starDistributionOrderComparer = new StarDistributionOrderComparer();
//        private static readonly IComparer s_distributionOrderComparer = new DistributionOrderComparer(); 
//
//
//        // 
//        //  This property
//        //  1. Finds the correct initial size for the _effectiveValues store on the current DependencyObject 
//        //  2. This is a performance optimization 
//        //
//        internal override int EffectiveValuesInitialSize 
//        {
//            get { return 9; }
//        }
// 
//        [Conditional("GRIDPARANOIA")]
//        internal void EnterCounterScope(Counters scopeCounter) 
//        { 
//            #if GRIDPARANOIA
//            if (ID == "CountThis") 
//            {
//                if (_counters == null)
//                {
//                    _counters = new Counter[(int)Counters.Count]; 
//                }
//                ExitCounterScope(Counters.Default); 
//                EnterCounter(scopeCounter); 
//            }
//            else 
//            {
//                _counters = null;
//            }
//            #endif // GRIDPARANOIA 
//        }
// 
//        [Conditional("GRIDPARANOIA")] 
//        internal void ExitCounterScope(Counters scopeCounter)
//        { 
//            #if GRIDPARANOIA
//            if (_counters != null)
//            {
//                if (scopeCounter != Counters.Default) 
//                {
//                    ExitCounter(scopeCounter); 
//                } 
//
//                if (_hasNewCounterInfo) 
//                {
//                    string NFormat = "F6";
//                    Console.WriteLine(
//                                "\ncounter name          | total t (ms)  | # of calls    | per call t (ms)" 
//                            +   "\n----------------------+---------------+---------------+----------------------" );
// 
//                    for (int i = 0; i < _counters.Length; ++i) 
//                    {
//                        if (_counters[i].Calls > 0) 
//                        {
//                            Counters counter = (Counters)i;
//                            double total = CostInMilliseconds(_counters[i].Total);
//                            double single = total / _counters[i].Calls; 
//                            string counterName = counter.ToString();
//                            string separator; 
// 
//                            if (counterName.Length < 8)         { separator = "\t\t\t";  }
//                            else if (counterName.Length < 16)   { separator = "\t\t";    } 
//                            else                                { separator = "\t";      }
//
//                            Console.WriteLine(
//                                    counter.ToString() + separator 
//                                +   total.ToString(NFormat) + "\t"
//                                +   _counters[i].Calls + "\t\t" 
//                                +   single.ToString(NFormat)); 
//
//                            _counters[i] = new Counter(); 
//                        }
//                    }
//                }
//                _hasNewCounterInfo = false; 
//            }
//            #endif // GRIDPARANOIA 
//        } 
//
//        [Conditional("GRIDPARANOIA")] 
//        internal void EnterCounter(Counters counter)
//        {
//            #if GRIDPARANOIA
//            if (_counters != null) 
//            {
//                Debug.Assert((int)counter < _counters.Length); 
// 
//                int i = (int)counter;
//                QueryPerformanceCounter(out _counters[i].Start); 
//            }
//            #endif // GRIDPARANOIA
//        }
// 
//        [Conditional("GRIDPARANOIA")]
//        internal void ExitCounter(Counters counter) 
//        { 
//            #if GRIDPARANOIA
//            if (_counters != null) 
//            {
//                Debug.Assert((int)counter < _counters.Length);
//
//                int i = (int)counter; 
//                long l;
//                QueryPerformanceCounter(out l); 
//                l = Cost(_counters[i].Start, l); 
//                _counters[i].Total += l;
//                _counters[i].Calls++; 
//                _hasNewCounterInfo = true;
//            }
//            #endif // GRIDPARANOIA
//        } 

 
 
