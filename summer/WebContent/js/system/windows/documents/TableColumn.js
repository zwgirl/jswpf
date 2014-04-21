/**
 * TableColumn
 */

define(["dojo/_base/declare", "system/Type", "windwos/FrameworkContentElement", "windows/FrameworkPropertyMetadata",
        "windows/FrameworkPropertyMetadataOptions", "windows/PropertyChangedCallback", "windows/ValidateValueCallback",
        "windows/GridUnitType", "windows/GridLength"], 
		function(declare, Type, FrameworkContentElement, FrameworkPropertyMetadata,
				FrameworkPropertyMetadataOptions, PropertyChangedCallback, ValidateValueCallback,
				GridUnitType, GridLength){
	var TableColumn = declare("TableColumn", [FrameworkContentElement, IIndexedChild],{
		constructor:function(){
			this._parentIndex = -1;
		},
		
//        void IIndexedChild<Table>.
        OnAfterExitParentTree:function(/*Table*/ parent) 
        {
        }, 

        /// <summary> 
        /// Callback used to notify the Cell about entering model tree.
        /// </summary>
//        internal void 
        OnEnterParentTree:function()
        { 
            this.Table.InvalidateColumns();
        }, 
 
        /// <summary>
        /// Callback used to notify the Cell about exitting model tree. 
        /// </summary>
//        internal void 
        OnExitParentTree:function()
        {
        	this.Table.InvalidateColumns(); 
        }
	});
	
	Object.defineProperties(TableColumn.prototype,{
        /// <summary> 
        /// Width property. 
        /// </summary>
//        public GridLength 
		Width: 
        {
            get:function() { return this.GetValue(TableColumn.WidthProperty); },
            set:function(value) { this.SetValue(TableColumn.WidthProperty, value); }
        }, 

        /// <summary> 
        /// Background property. 
        /// </summary>
//        public Brush 
        Background: 
        {
            get:function() { return this.GetValue(TableColumn.BackgroundProperty); },
            set:function(value) { this.SetValue(TableColumn.BackgroundProperty, value); }
        },
        
        /// <summary> 
        /// Column's index in the parents collection.
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
//                Debug.Assert (value >= -1 && _parentIndex != value); 
            	this._parentIndex = value; 
            }
        },
        
        /// <summary>
        /// Table owner accessor 
        /// </summary>
//        internal Table 
        Table: { get:function() { return this.Parent instanceof Table ? this.Parent : null; } }
	});
	
	Object.defineProperties(TableColumn,{
		/// <summary>
        /// DefaultWidth
        /// </summary> 
//        internal static GridLength 
		DefaultWidth:
		{ get:function() { return (new GridLength(0, GridUnitType.Auto)); } },
	      /// <summary>
        /// Width property. 
        /// </summary>
//        public static readonly DependencyProperty 
		WidthProperty:
        {
        	get:function(){
            	if(TableColumn._WidthProperty === undefined){
            		TableColumn._WidthProperty = 
                        DependencyProperty.Register( 
                                "Width",
                                GridLength.Type, 
                                TableColumn.Type,
                                /*new FrameworkPropertyMetadata(
                                        new GridLength(0, GridUnitType.Auto),
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(OnWidthChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        new GridLength(0, GridUnitType.Auto),
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(null, OnWidthChanged)),
                                new ValidateValueCallback(null, IsValidWidth)); 
            	}
            	
            	return TableColumn._WidthProperty;
        	}
        },  
 
        /// <summary>
        /// DependencyProperty for <see cref="Background" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		BackgroundProperty:
        {
        	get:function(){
            	if(TableColumn._ForegroundProperty === undefined){
            		TableColumn._ForegroundProperty =
                        Panel.BackgroundProperty.AddOwner(
                        		TableColumn.Type, 
                                /*new FrameworkPropertyMetadata(
                                        null, 
                                        FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnBackgroundChanged))*/
                        		FrameworkPropertyMetadata.Build3PCCB(
                                        null, 
                                        FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnBackgroundChanged)));	
            	}
            	
            	return TableColumn._ForegroundProperty;
        	}
        },   
	});
	
    /// <summary>
    /// <see cref="DependencyProperty.ValidateValueCallback"/> 
    /// </summary>
//    private static bool 
	function IsValidWidth(/*object*/ value)
    {
        /*GridLength*/var gridLength = value; 
        if ((gridLength.GridUnitType == GridUnitType.Pixel || gridLength.GridUnitType == GridUnitType.Star) &&
            (gridLength.Value < 0.0)) 
        { 
            return false;
        } 

        var maxPixel = Math.Min(1000000, PTS.MaxPageSize);
        if (gridLength.GridUnitType == GridUnitType.Pixel && (gridLength.Value > maxPixel))
        { 
            return false;
        } 
        return true; 
    }

    /// <summary>
    /// Called when the value of the WidthProperty changes
    /// </summary> 
//    private static void 
    function OnWidthChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        var table = d.Table;  //TableColumn
        if(table != null)
        { 
            table.InvalidateColumns();
        }
    }

    /// <summary>
    /// Called when the value of the BackgroundProperty changes 
    /// </summary> 
//    private static void 
    function OnBackgroundChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        var table = d.Table;  //TableColumn
        if(table != null)
        {
            table.InvalidateColumns(); 
        }
    } 
	
	TableColumn.Type = new Type("TableColumn", TableColumn, [FrameworkContentElement.Type, IIndexedChild.Type]);
	return TableColumn;
});
