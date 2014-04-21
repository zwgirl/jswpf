/**
 * DockPanel
 */

define(["dojo/_base/declare", "system/Type", "controls/Panel", "controls/Dock", "windows/FrameworkPropertyMetadata",
        "windows/DependencyProperty"], 
		function(declare, Type, Panel, Dock, FrameworkPropertyMetadata,
				DependencyProperty){
	
//	private static class 
	var TmpRow = declare(null, {
		constructor:function(){
			this.center = 0;
			this.tr = null;
		}
	});
	Object.defineProperties(TmpRow.prototype, {
		center:{
			get:function(){
				return this._center;
			},
			set:function(value){
				this._center = value;
			}
		},
		tr:{
			get:function(){
				return this._tr;
			},
			set:function(value){
				this._tr = value;
			}
		}
	});
	  
	var DockPanel = declare("DockPanel", Panel,{
		constructor:function(){
	        
	        this._dom = window.document.createElement('div');
		},

		AddEventListeners:function(){
			
		},
		
        /// <summary> 
        /// Updates DesiredSize of the DockPanel.  Called by parent UIElement.  This is the first pass of layout.
        /// </summary> 
        /// <remarks>
        /// Children are measured based on their sizing properties and <see cref="System.Windows.Controls.Dock" />.
        /// Each child is allowed to consume all of the space on the side on which it is docked; Left/Right docked
        /// children are granted all vertical space for their entire width, and Top/Bottom docked children are 
        /// granted all horizontal space for their entire height.
        /// </remarks> 
        /// <param name="constraint">Constraint size is an "upper limit" that the return value should not exceed.</param> 
        /// <returns>The Panel's desired size.</returns>
//        protected override Size 
        MeasureOverride:function(/*DOMElement*/ parent) 
        {
        	this._dom = window.document.createElement("table");
            /*UIElementCollection*/var children = this.InternalChildren;

            for (var i = 0, count = children.Count; i < count; ++i) 
            {
                /*UIElement*/var child = children.Get(i);

                if (child == null) { continue; } 

                // Measure child.
                child.Measure(this._dom); 
            } 
        },

        /// <summary> 
        /// DockPanel computes a position and final size for each of its children based upon their
        /// <see cref="System.Windows.Controls.Dock" /> enum and sizing properties. 
        /// </summary> 
        /// <param name="arrangeSize">Size that DockPanel will assume to position children.</param>
//        protected override Size 
        ArrangeOverride:function() 
        {
//            /*UIElementCollection*/var children = InternalChildren;
//            var totalChildrenCount = children.Count;
//
//            for (var i = 0; i < totalChildrenCount; ++i)
//            {
//                /*UIElement*/var child = children.Get(i); 
//                if (child == null) { continue; }
// 
//                child.Arrange(this._dom); 
//            } 
        	
        	if(this.ArrangeDirty){
            	this.RealizeTable();
            	
            	parent.appendChild(this._dom);
            	
            	this.ArrangeDirty = false;
        	}

        },
        

        /**
         * (Re)creates the DOM structure of the table representing the DockPanel,
         * based on the order and layout of the children.
         */
//        private void 
        RealizeTable:function() 
        {
	        var children = this.InternalChildren;
	        var totalChildrenCount = children.Count;
	        var nonFillChildrenCount = totalChildrenCount - (this.LastChildFill ? 1 : 0);   
	        
	
	    	var rowCount = 1, colCount = 1;
	    	for (var i = 0; i < totalChildrenCount; ++i) 
	    	{ 
	    		var child = children.Get(i);
	    		var dock = child.GetValue(DockPanel.DockProperty);
	    		if(dock == Dock.Top || dock==Dock.Bottom){
	    			++rowCount; 
	    		}else if ((dock == Dock.Left) || (dock == Dock.Right)) {
	    			++colCount;
				}
			}
              
	        var rows = [];
	        for (var i = 0; i < rowCount; ++i) {
	        	rows[i] = new TmpRow();
	        	rows[i].tr = window.document.createElement("tr");
	        	this._dom.appendChild(rows[i].tr);
          	}
	
	        var logicalLeftCol = 0, logicalRightCol = colCount - 1;
	        var northRow = 0, southRow = rowCount - 1;
	        var centerTd = null;
	          
	        for (var i = 0; i < totalChildrenCount; ++i) {
	        	var child = children.Get(i);
	        	
	        	if (i >= nonFillChildrenCount){
	        		break;
	        	}

              	var dock = child.GetValue(DockPanel.DockProperty);
	
              	var td = window.document.createElement("td");
//              	td.appendChild(child._dom);
              	td.setAttribute("align", child.GetValue(FrameworkElement.HorizontalAlignmentProperty));
              	td.style.setProperty("verticalAlign", child.GetValue(FrameworkElement.VerticalAlignmentProperty));
              	td.setAttribute("width", child.GetValue(FrameworkElement.WidthProperty));
              	td.setAttribute("height", child.GetValue(FrameworkElement.HeightProperty));
              	
              	child.Arrange(td);
              	child._parentDom = td;
	
              	if (dock == Dock.Top) {
              		rows[northRow].tr.appendChild(td, rows[northRow].center);
            	  	td.setAttribute("colSpan", logicalRightCol - logicalLeftCol + 1);
            	  	++northRow;
              	} else if (dock == Dock.Bottom) {
              		this.InsertChild(rows[southRow].tr, td, rows[southRow].center);
              		td.setAttribute("colSpan", logicalRightCol - logicalLeftCol + 1);
              		--southRow;
	//              } else if (layout.direction == CENTER) {
	//            	  // Defer adding the center widget, so that it can be added after all
	//            	  // the others are complete.
	//            	  centerTd = td; 
              	} else if (this.ShouldAddToLogicalLeftOfTable(dock)) {
              		var row = rows[northRow];
              		this.InsertChild(row.tr, td, row.center++);
              		td.setAttribute("rowSpan", southRow - northRow + 1);
              		++logicalLeftCol;
              	} else if (this.ShouldAddToLogicalRightOfTable(dock)) {
              		var row = rows[northRow];
              		this.InsertChild(row.tr, td, row.center);
              		td.setAttribute("rowSpan", southRow - northRow + 1);
              		--logicalRightCol;
              	} 
	        }

//          // If there is a center widget, add it at the end (centerTd is guaranteed
//          // to be initialized because it will have been set in the CENTER case in
//          // the above loop).
//          if (center != null) {
//            TmpRow row = rows[northRow];
//            DOM.insertChild(row.tr, centerTd, row.center);
//            DOM.appendChild(centerTd, center.getElement());
//          }
          
          	// If there is a center widget, add it at the end (centerTd is guaranteed
          	// to be initialized because it will have been set in the CENTER case in
          	// the above loop).
          	if (this.LastChildFill ) {
          		var child = this.InternalChildren.Get(this.InternalChildren.Count-1);
          		var row = rows[northRow];
          		this.InsertChild(row.tr, centerTd, row.center);
          	}
        },
        
//        @Override
//        public native void 
        InsertChild:function(/*Element*/ parent, /*Element*/ toAdd, /*int*/ index) {
        	var count = 0, child = parent.firstChild, before = null;
        	while (child) {
        		if (child.nodeType == 1) {
        			if (count == index) {
        				before = child;
        				break;
        			}
        			++count;
        		}
        		child = child.nextSibling;
        	}

        	parent.insertBefore(toAdd, before);
        },
        
//        private boolean 
        ShouldAddToLogicalLeftOfTable:function(/*DockLayoutConstant widgetDirection*/dock) {
          
//          assert (widgetDirection == LINE_START || widgetDirection == LINE_END || 
//              widgetDirection == EAST || widgetDirection == WEST);
//          
//          // In a bidi-sensitive environment, adding a widget to the logical left
//          // column (think DOM order) means that it will be displayed at the start
//          // of the line direction for the current layout. This is because HTML
//          // tables are bidi-sensitive; the column order switches depending on 
//          // the line direction.
//          if (widgetDirection == LINE_START) {  
//            return true;
//          }
//          
//          if (LocaleInfo.getCurrentLocale().isRTL()) {
//            // In an RTL layout, the logical left columns will be displayed on the right hand 
//            // side. When the direction for the widget is EAST, adding the widget to the logical 
//            // left columns will have the desired effect of displaying the widget on the 'eastern' 
//            // side of the screen.
//            return (widgetDirection == EAST);          
//          }
          
          // In an LTR layout, the logical left columns are displayed on the left hand
          // side. When the direction for the widget is WEST, adding the widget to the
          // logical left columns will have the desired effect of displaying the widget on the
          // 'western' side of the screen.
          return (dock == Dock.Left);
        },

//        private boolean 
        ShouldAddToLogicalRightOfTable:function(/*DockLayoutConstant widgetDirection*/dock) {
          
//          // See comments for shouldAddToLogicalLeftOfTable for clarification
//          
//          assert (widgetDirection == LINE_START || widgetDirection == LINE_END ||
//              widgetDirection == EAST || widgetDirection == WEST);
//
//          if (widgetDirection == LINE_END) {
//            return true;
//          }
//
//          if (LocaleInfo.getCurrentLocale().isRTL()) {   
//            return (widgetDirection == WEST);
//          }
          
          return (dock == Dock.Right);
        }

	});
	
	Object.defineProperties(DockPanel.prototype,{
        /// <summary>
        /// This property controls whether the last child in the DockPanel should be stretched to fill any 
        /// remaining available space.
        /// </summary> 
//        public bool 
        LastChildFill: 
        {
            get:function() { return this.GetValue(DockPanel.LastChildFillProperty); }, 
            set:function(value) { this.SetValue(DockPanel.LastChildFillProperty, value); }
        }
	});
	
	Object.defineProperties(DockPanel,{
	     /// <summary>
        /// DependencyProperty for <see cref="LastChildFill" /> property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        LastChildFillProperty:
        {
        	get:function(){
        		if(DockPanel._LastChildFillProperty === undefined){
        			DockPanel._LastChildFillProperty =
                        DependencyProperty.Register(
                                "LastChildFill",
                                Boolean.Type,
                                DockPanel.Type, 
                                /*new FrameworkPropertyMetadata(true, FrameworkPropertyMetadataOptions.AffectsArrange)*/
                                FrameworkPropertyMetadata.Build2(true, FrameworkPropertyMetadataOptions.AffectsArrange));
        		}
        		
        		return DockPanel._LastChildFillProperty;
        	}
        },
 
 
        /// <summary>
        /// DependencyProperty for Dock property. 
        /// </summary>
        /// <seealso cref="DockPanel.GetDock" />
        /// <seealso cref="DockPanel.SetDock" />
//        public static readonly DependencyProperty 
        DockProperty:
        {
        	get:function(){
        		if(DockPanel._LastChildFillProperty === undefined){
        			DockPanel._LastChildFillProperty  =
                        DependencyProperty.RegisterAttached( 
                                "Dock", 
                                Number.Type,
                                DockPanel.Type, 
                                /*new FrameworkPropertyMetadata(
                                    Dock.Left,
                                    new PropertyChangedCallback(OnDockChanged)),
                                new ValidateValueCallback(IsValidDock)*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(Dock.Left,
                                    new PropertyChangedCallback(DockPanel, OnDockChanged)),
                                new ValidateValueCallback(DockPanel, DockPanel.IsValidDock));
        		}
        		
        		return DockPanel._LastChildFillProperty;
        	}
        } 
	});
	
    /// <summary> 
    /// Reads the attached property Dock from the given element.
    /// </summary> 
    /// <param name="element">UIElement from which to read the attached property.</param>
    /// <returns>The property's value.</returns>
    /// <seealso cref="DockPanel.DockProperty" />
//    public static Dock 
    DockPanel.GetDock = function(/*UIElement*/ element)
    { 
        if (element == null) { throw new ArgumentNullException("element"); } 

        return element.GetValue(DockPanel.DockProperty); 
    };

    /// <summary>
    /// Writes the attached property Dock to the given element. 
    /// </summary>
    /// <param name="element">UIElement to which to write the attached property.</param> 
    /// <param name="dock">The property value to set</param> 
    /// <seealso cref="DockPanel.DockProperty" />
//    public static void 
    DockPanel.SetDock = function(/*UIElement*/ element, /*Dock*/ dock) 
    {
        if (element == null) { throw new ArgumentNullException("element"); }

        element.SetValue(DockPanel.DockProperty, dock); 
    };

//    private static void
    function OnDockChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        /*UIElement*/var uie = d instanceof UIElement ? d : null; //it may be anyting, like FlowDocument... bug 1237275 
        if(uie != null)
        {
            /*DockPanel*/var p = VisualTreeHelper.GetParent(uie);
            p = p instanceof DockPanel ? p : null;
            if(p != null) 
            {
                p.InvalidateMeasure(); 
            } 
        }
    } 
    
//    internal static bool 
    DockPanel.IsValidDock = function(/*object*/ o) 
    {
        return (    o == Dock.Left
                ||  o == Dock.Top 
                ||  o == Dock.Right
                ||  o == Dock.Bottom);
    };
	
	DockPanel.Type = new Type("DockPanel", DockPanel, [Panel.Type]);
	return DockPanel;
});
 

