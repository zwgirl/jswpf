/**
 * Polygon
 */

define(["dojo/_base/declare", "system/Type", "shapes/Shape", "media/PointCollection",
        "internal/FreezableDefaultValueFactory", "media/FillRule", "media/ValidateEnums"], 
		function(declare, Type, Shape, PointCollection,
				FreezableDefaultValueFactory, FillRule, ValidateEnums){
	var Polygon = declare("Polygon", Shape,{
		constructor:function(){
//			private Geometry 
			this._polygonGeometry = null;
			this._shape = document.createElementNS(Shape.SVG_NS, "polygon");
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
			
			var rule = this.FillRule;
			if(rule != null){
				switch(this.FillRule){
					case FillRule.EvenOdd:{
						this._shape.setAttribute("fill-rule", 'evenodd');
						break;
					}
					case FillRule.Nonzero:{
						this._shape.setAttribute("fill-rule", 'nonzero');
						break;
					}
				}
			}
			
			this.SetupStroke(this._shape);
			
			this._dom.appendChild(this._shape); 

		},
		
//		internal override void 
		CacheDefiningGeometry:function() 
        { 
            /*PointCollection*/var pointCollection = Points;
            /*PathFigure*/var pathFigure = new PathFigure(); 

            // Are we degenerate?
            // Yes, if we don't have data
            if (pointCollection == null) 
            {
            	this._polygonGeometry = Geometry.Empty; 
                return; 
            }
 
            // Create the polygon PathGeometry
            // ISSUE-[....]-07/11/2003 - Bug 859068
            // The constructor for PathFigure that takes a PointCollection is internal in the Core
            // so the below causes an A/V. Consider making it public. 
            if (pointCollection.Count > 0)
            { 
                pathFigure.StartPoint = pointCollection[0]; 

                if (pointCollection.Count > 1) 
                {
                    /*Point[]*/var array = new Point[pointCollection.Count - 1];

                    for (var i = 1; i < pointCollection.Count; i++) 
                    {
                        array[i - 1] = pointCollection[i]; 
                    } 

                    pathFigure.Segments.Add(new PolyLineSegment(array, true)); 
                }

                pathFigure.IsClosed = true;
            } 

            /*PathGeometry*/var polygonGeometry = new PathGeometry(); 
            polygonGeometry.Figures.Add(pathFigure); 

            // Set FillRule 
            polygonGeometry.FillRule = this.FillRule;

            this._polygonGeometry = polygonGeometry;
        } 
	});
	
	Object.defineProperties(Polygon.prototype,{
        /// <summary>
        /// Points property 
        /// </summary>
//        public PointCollection 
		Points:
        {
            get:function() 
            {
                return this.GetValue(Polygon.PointsProperty); 
            }, 
            set:function(value)
            { 
            	this.SetValue(Polygon.PointsProperty, value);
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
                return this.GetValue(Polygon.FillRuleProperty); 
            }, 
            set:function(value) 
            {
            	this.SetValue(Polygon.FillRuleProperty, value);
            }
        },

        /// <summary> 
        /// Get the polygon that defines this shape
        /// </summary>
//        protected override Geometry 
        DefiningGeometry:
        { 
            get:function()
            { 
                return this._polygonGeometry; 
            }
        }		  
	});
	
	Object.defineProperties(Polygon, {
        /// <summary>
        /// Points property
        /// </summary>
//        public static readonly DependencyProperty 
		PointsProperty:
        {
        	get:function(){
        		if(Polygon._PointsProperty === undefined){
        			Polygon._PointsProperty = DependencyProperty.Register( 
        	                "Points", PointCollection.Type, Polygon.Type,
        	                /*new FrameworkPropertyMetadata(new FreezableDefaultValueFactory(PointCollection.Empty), 
        	                		FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender)*/
        	                FrameworkPropertyMetadata.Build2(new FreezableDefaultValueFactory(PointCollection.Empty), 
        	                		FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender)); 
        		}
        		
        		return Polygon._PointsProperty;
        	}
        }, 
        
        /// <summary>
        /// FillRule property 
        /// </summary> 
//        public static readonly DependencyProperty 
		FillRuleProperty:
        {
        	get:function(){
        		if(Polygon._FillRuleProperty === undefined){
        			Polygon._FillRuleProperty = DependencyProperty.Register(
        		            "FillRule", 
        		            /*typeof(FillRule)*/Number.Type,
        		            Polygon.Type,
        		            /*new FrameworkPropertyMetadata(
        		                FillRule.EvenOdd, 
        		                FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender)*/
        		            FrameworkPropertyMetadata.Build2(
            		                FillRule.EvenOdd, 
            		                FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender),
        		            new ValidateValueCallback(/*System.Windows.Media.*/ValidateEnums.IsFillRuleValid) 
        		            ); 
        		}
        		
        		return Polygon._FillRuleProperty;
        	}
        },
        
	});
	
	Polygon.Type = new Type("Polygon", Polygon, [Shape.Type]);
	return Polygon;
});

