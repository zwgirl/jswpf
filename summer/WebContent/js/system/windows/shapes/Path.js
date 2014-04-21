/**
 * Path
 */
 /// <summary> 
 /// The Path shape element
 /// This element (like all shapes) belongs under a Canvas, 
 /// and will be presented by the parent canvas.
 /// Since a Path is really a path which closes its path
 /// </summary>
define(["dojo/_base/declare", "system/Type", "shapes/Shape", "media/Geometry"], 
		function(declare, Type, Shape, Geometry){
	var Path = declare("Path", Shape,{
		constructor:function(){
			
			this._shape = document.createElementNS(Shape.SVG_NS, "path");
			this.BuildPolygon();
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
		BuildPolygon:function(){
			this._shape._source = this;
			
//			if(typeof this.Data =="string"){
//				this._shape.setAttribute("d", this.Data);
//			}else if(this.Data != null){
//				this._shape.setAttribute("d", this.Data.ToString());
//			}
			
			this.SetupStroke(this._shape);
			
			this._dom.appendChild(this._shape); 

		},
		
		MeasureOverride:function(){
			if(typeof this.Data =="string"){
				this._shape.setAttribute("d", this.Data);
			}else if(this.Data != null){
				this._shape.setAttribute("d", this.Data.ToString());
			}
		},
		
		/// <summary>
		/// Notification that a specified property has been invalidated 
		/// </summary>
		/// <param name="e">EventArgs that contains the property, metadata, old value, and new value for this change</param>
//		protected sealed override void 
		OnPropertyChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
		{ 
			// Always call base.OnPropertyChanged, otherwise Property Engine will not work.
			FrameworkElement.prototype.OnPropertyChanged.call(this, e); 
			var dp = e.Property;

			if (e.IsAValueChange || e.IsASubPropertyChange)
			{ 
	          	if(dp === Path.DataProperty){
            		if(e.NewValue){
            			if(this._dom){
                  			this._shape.setAttribute("d",e.NewValue,"");
            			}
            		}else{
            			
            		}
            		
            	}
			}
		}
	});
	
	Object.defineProperties(Path.prototype,{
		 /// <summary> 
	     /// Data property 
	     /// </summary>
//	     public Geometry 
		Data: 
	     {
	         get:function()
	         {
	             return this.GetValue(Path.DataProperty); 
	         },
	         set:function(value) 
	         { 
	        	 this.SetValue(Path.DataProperty, value);
	         } 
	     },

	     /// <summary> 
	     /// Get the path that defines this shape 
	     /// </summary>
//	     protected override Geometry 
	     DefiningGeometry: 
	     {
	         get:function()
	         {
	             /*Geometry*/var data = Data; 

	             if (data == null) 
	             { 
	                 data = Geometry.Empty;
	             } 

	             return data;
	         }
	     }  
	});
	
	Object.defineProperties(Path,{
	     /// <summary>
	     /// Data property
	     /// </summary> 
//	     public static readonly DependencyProperty 
		DataProperty:
        {
        	get:function(){
        		if(Path._DataProperty === undefined){
        			Path._DataProperty = DependencyProperty.Register( 
        			         "Data", 
        			         /*Geometry.Type*/Object.Type,
        			         Path.Type, 
        			         /*new FrameworkPropertyMetadata(
        			             null,
        			             FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender)*/
        			         FrameworkPropertyMetadata.Build2(null,
            			             FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender),
        			         null);  
        		}
        		
        		return Path._DataProperty;
        	}
        },  
	});
	
	Path.Type = new Type("Path", Path, [Shape.Type]);
	return Path;
});