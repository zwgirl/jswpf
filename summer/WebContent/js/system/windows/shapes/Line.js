/**
 * Line
 */
/// <summary> 
/// The line shape element
/// This element (like all shapes) belongs under a Canvas, 
/// and will be presented by the parent canvas.
/// </summary>
define(["dojo/_base/declare", "system/Type", "shapes/Shape"], 
		function(declare, Type, Shape){
	var Line = declare("Line", Shape,{
		constructor:function(){
//	        private LineGeometry 
			this._lineGeometry = null;
			
			this._shape = document.createElementNS(Shape.SVG_NS, "line");
			this.BuildLine();
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
		BuildLine:function(){
			this._shape._source = this;
			this._shape.setAttribute("x1", this.X1);
			this._shape.setAttribute("y1", this.Y1);
			this._shape.setAttribute("x2", this.X2);
			this._shape.setAttribute("y2", this.Y2);
			
			this.SetupStroke(this._shape);
			
			this._dom.appendChild(this._shape); 

		},
 
		
//        internal override void 
		CacheDefiningGeometry:function() 
        {
            /*Point*/var point1 = new Point(X1, Y1);
            /*Point*/var point2 = new Point(X2, Y2);
 
            // Create the Line geometry
            this._lineGeometry = new LineGeometry(point1, point2); 
        } 
	});
	
	Object.defineProperties(Line.prototype,{
		 /// <summary> 
        /// X1 property
        /// </summary>
//        public double 
		X1: 
        {
            get:function() 
            { 
                return this.GetValue(Line.X1Property);
            }, 
            set:function(value)
            {
            	this.SetValue(Line.X1Property, value);
            } 
        },

        /// <summary> 
        /// Y1 property 
        /// </summary>
//        public double 
        Y1:
        {
            get:function()
            { 
                return this.GetValue(Line.Y1Property);
            }, 
            set:function(value)
            {
            	this.SetValue(Line.Y1Property, value); 
            }
        },

        /// <summary>
        /// X2 property 
        /// </summary>
//        public double 
        X2: 
        {
            get:function() 
            {
                return this.GetValue(Line.X2Property);
            }, 
            set:function(value) 
            {
            	this.SetValue(Line.X2Property, value); 
            } 
        },

        /// <summary> 
        /// Y2 property
        /// </summary>
//        public double 
        Y2:
        {
            get:function() 
            { 
                return this.GetValue(Line.Y2Property);
            }, 
            set:function(value)
            {
            	this.SetValue(Line.Y2Property, value);
            } 
        }, 
        
        /// <summary> 
        /// Get the line that defines this shape
        /// </summary> 
//        protected override Geometry 
        DefiningGeometry:
        {
            get:function() 
            {
                return this._lineGeometry;
            }
        } 
	});
	
	Object.defineProperties(Line,{
        /// <summary>
        /// X1 property
        /// </summary>
//        public static readonly DependencyProperty 
		X1Property:
        {
        	get:function(){
        		if(Line._X1Property === undefined){
        			Line._X1Property = 
        	            DependencyProperty.Register( "X1", Number.Type, Line.Type,
        	                    /*new FrameworkPropertyMetadata(0, 
        	                    		FrameworkPropertyMetadataOptions.AffectsMeasure 
        	                    		| FrameworkPropertyMetadataOptions.AffectsRender)*/
        	            		FrameworkPropertyMetadata.Build2(0, 
        	                    		FrameworkPropertyMetadataOptions.AffectsMeasure 
        	                    		| FrameworkPropertyMetadataOptions.AffectsRender), 
        	                    new ValidateValueCallback(null, Shape.IsDoubleFinite)); 
        		}
        		
        		return Line._X1Property;
        	}
        },
        
        /// <summary> 
        /// Y1 property
        /// </summary> 
//        public static readonly DependencyProperty 
		Y1Property:
        {
        	get:function(){
        		if(Line._Y1Property === undefined){
        			Line._Y1Property =
        	            DependencyProperty.Register( "Y1", Number.Type, Line.Type,
        	                    /*new FrameworkPropertyMetadata(0, 
        	                    		FrameworkPropertyMetadataOptions.AffectsMeasure 
        	                    		| FrameworkPropertyMetadataOptions.AffectsRender)*/
        	            		FrameworkPropertyMetadata.Build2(0, 
        	                    		FrameworkPropertyMetadataOptions.AffectsMeasure 
        	                    		| FrameworkPropertyMetadataOptions.AffectsRender),
        	                    new ValidateValueCallback(null, Shape.IsDoubleFinite)); 
        	            
        		}
        		
        		return Line._Y1Property;
        	}
        },
        /// <summary> 
        /// X2 property
        /// </summary> 
//        public static readonly DependencyProperty 
		X2Property:
        {
        	get:function(){
        		if(Line._X2Property === undefined){
        			Line._X2Property = 
        	            DependencyProperty.Register( "X2", Number.Type, Line.Type,
        	                    /*new FrameworkPropertyMetadata(0, 
        	                    		FrameworkPropertyMetadataOptions.AffectsMeasure 
        	                    		| FrameworkPropertyMetadataOptions.AffectsRender)*/
        	            		FrameworkPropertyMetadata.Build2(0, 
        	                    		FrameworkPropertyMetadataOptions.AffectsMeasure 
        	                    		| FrameworkPropertyMetadataOptions.AffectsRender), 
        	                    new ValidateValueCallback(null, Shape.IsDoubleFinite));
        		}
        		
        		return Line._X2Property;
        	}
        },
        
        /// <summary>
        /// Y2 property
        /// </summary>
//        public static readonly DependencyProperty 
		Y2Property:
        {
        	get:function(){
        		if(Line._Y2Property === undefined){
        			Line._Y2Property = 
        	            DependencyProperty.Register( "Y2", Number.Type, Line.Type,
        	                    /*new FrameworkPropertyMetadata(0, 
        	                    		FrameworkPropertyMetadataOptions.AffectsMeasure 
        	                    		| FrameworkPropertyMetadataOptions.AffectsRender)*/
        	            		FrameworkPropertyMetadata.Build2(0, 
        	                    		FrameworkPropertyMetadataOptions.AffectsMeasure 
        	                    		| FrameworkPropertyMetadataOptions.AffectsRender), 
        	                    new ValidateValueCallback(null, Shape.IsDoubleFinite)); 
        		}
        		
        		return Line._Y2Property;
        	}
        },
	});
	
	Line.Type = new Type("Line", Line, [Shape.Type]);
	return Line;
});



       






