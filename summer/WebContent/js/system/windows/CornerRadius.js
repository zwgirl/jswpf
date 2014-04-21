/**
 * CornerRadius
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var CornerRadius = declare("CornerRadius", null,{
		constructor:function(/*double*/ topLeft, /*double*/ topRight, /*double*/ bottomRight, /*double*/ bottomLeft){
			if(arguments.length == 1){
				this._topLeft = this._topRight = this._bottomLeft = this._bottomRight = uniformRadius;
			}else{
				this._topLeft = topLeft; 
				this._topRight = topRight; 
				this._bottomRight = bottomRight;
				this._bottomLeft = bottomLeft; 
			}
		}
	});
	
	Object.defineProperties(CornerRadius.prototype,{
        /// <summary>This property is the Length on the thickness' top left corner</summary>
//        public double 
        TopLeft: 
        { 
            get:function() { return this._topLeft; },
            set:function(value) { this._topLeft = value; } 
        },

        /// <summary>This property is the Length on the thickness' top right corner</summary>
//        public double 
        TopRight: 
        {
            get:function() { return this._topRight; }, 
            set:function(value) { this._topRight = value; } 
        },
 
        /// <summary>This property is the Length on the thickness' bottom right corner</summary>
//        public double 
        BottomRight:
        {
            get:function() { return this._bottomRight; }, 
            set:function(value) { this._bottomRight = value; }
        }, 
 
        /// <summary>This property is the Length on the thickness' bottom left corner</summary>
//        public double 
        BottomLeft: 
        {
            get:function() { return this._bottomLeft; },
            set:function(value) { this._bottomLeft = value; }
        } 
	});
	
	CornerRadius.Type = new Type("CornerRadius", CornerRadius, [Object.Type]);
	return CornerRadius;
});

