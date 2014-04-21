/**
 * Shape
 */
    /// <summary> 
    /// The Polyline shape element 
    /// This element (like all shapes) belongs under a Canvas,
    /// and will be presented by the parent canvas. 
    /// </summary>
define(["dojo/_base/declare", "system/Type", "shapes/Shape"], 
		function(declare, Type, Shape){
	var Polyline = declare("Polyline", Shape,{
		constructor:function(){
//		     private Geometry 
			this._polylineGeometry = null; 
			
			this._shape = document.createElementNS(Shape.SVG_NS, "polyline");
			this.BuildPolygon();
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
		BuildPolygon:function(){
			this._shape._source = this;
			
			var pointsStr = "";
			var points = this.Points;
			if(points != null){
				for(var i=0; i<points.Count; i++){
					var point = points.Get(i);
					pointsStr +=" " +  point.X + "," + point.Y;
				}
			}
			this._shape.setAttribute("points", pointsStr);
			
			this.SetupStroke(this._shape);
			
			this._dom.appendChild(this._shape); 

		},
//		 internal override void 
		CacheDefiningGeometry:function() 
        { 
            /*PointCollection*/var pointCollection = Points;
            /*PathFigure*/var pathFigure = new PathFigure(); 

            // Are we degenerate?
            // Yes, if we don't have data
            if (pointCollection == null) 
            {
                _polylineGeometry = Geometry.Empty; 
                return; 
            }
 
            // Create the Polyline PathGeometry
            // ISSUE-[....]-07/11/2003 - Bug 859068
            // The constructor for PathFigure that takes a PointCollection is internal in the Core
            // so the below causes an A/V. Consider making it public. 
            if (pointCollection.Count > 0)
            { 
                pathFigure.StartPoint = pointCollection[0]; 

                if (pointCollection.Count > 1) 
                {
                    /*Point[]*/ array = new Point[pointCollection.Count - 1];

                    for (var i = 1; i < pointCollection.Count; i++) 
                    {
                        array[i - 1] = pointCollection[i]; 
                    } 

                    pathFigure.Segments.Add(new PolyLineSegment(array, true)); 
                }
            }

            /*PathGeometry*/var polylineGeometry = new PathGeometry(); 
            polylineGeometry.Figures.Add(pathFigure);
 
            // Set FillRule 
            polylineGeometry.FillRule = FillRule;
 
            if (polylineGeometry.Bounds == Rect.Empty)
            {
                this._polylineGeometry = Geometry.Empty;
            } 
            else
            { 
            	this._polylineGeometry = polylineGeometry; 
            }
        } 
	});
	
	Object.defineProperties(Polyline.prototype,{
        /// <summary> 
        /// Points property
        /// </summary> 
//        public PointCollection 
		Points:
        {
            get:function()
            { 
                return this.GetValue(Polyline.PointsProperty);
            },
            set:function(value) 
            {
            	this.SetValue(Polyline.PointsProperty, value); 
            }
        },
	     /// <summary>
        /// FillRule property 
        /// </summary>
//        public FillRule 
        FillRule:
        {
            get:function() 
            {
                return this.GetValue(Polyline.FillRuleProperty); 
            },
            set:function(value)
            { 
            	this.SetValue(Polyline.FillRuleProperty, value);
            }
        },

        /// <summary> 
        /// Get the polyline that defines this shape
        /// </summary>
//        protected override Geometry 
        DefiningGeometry:
        { 
            get:function()
            { 
                return this._polylineGeometry; 
            }
        }   
	});
	
	Object.defineProperties(Polyline,{
        /// <summary> 
        /// Points property
        /// </summary>
//        public static readonly DependencyProperty 
		PointsProperty:
        {
        	get:function(){
        		if(Polyline._FillRuleProperty === undefined){
        			Polyline._FillRuleProperty = DependencyProperty.Register(
        	                "Points", PointCollection.Type, Polyline.Type, 
        	                /*new FrameworkPropertyMetadata(new FreezableDefaultValueFactory(PointCollection.Empty), 
        	                		FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender)*/
        	                FrameworkPropertyMetadata.Build2(new FreezableDefaultValueFactory(PointCollection.Empty), 
        	                		FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender));
        		}
        		
        		return Polyline._FillRuleProperty;
        	}
        },
 


        /// <summary> 
        /// FillRule property
        /// </summary> 
//        public static readonly DependencyProperty 
		FillRuleProperty:
        {
        	get:function(){
        		if(Polyline._FillRuleProperty === undefined){
        			Polyline._FillRuleProperty = DependencyProperty.Register( 
        		            "FillRule",
        		            /*typeof(FillRule)*/Number.Type, 
        		            Polyline.Type,
        		            /*new FrameworkPropertyMetadata(
        		                FillRule.EvenOdd,
        		                FrameworkPropertyMetadataOptions.AffectsRender)*/
        		            FrameworkPropertyMetadata.Build2(FillRule.EvenOdd,
        		                FrameworkPropertyMetadataOptions.AffectsRender), 
        		            new ValidateValueCallback(null, /*System.Windows.Media.*/ValidateEnums.IsFillRuleValid)
        		            );
        		}
        		
        		return Polyline._FillRuleProperty;
        	}
        },   
	});
	
	Polyline.Type = new Type("Polyline", Polyline, [Shape.Type]);
	return Polyline;
});
