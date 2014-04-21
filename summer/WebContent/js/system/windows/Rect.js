/**
 * Second Check 2014-01-16
 * Rect
 */
/// <summary> 
/// Rect - The primitive which represents a rectangle.  Rects are stored as 
/// X, Y (Location) and Width and Height (Size).  As a result, Rects cannot have negative
/// Width or Height. 
/// </summary>
define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var Rect = declare("Rect", Object,{
		constructor:function(/*double*/ x,
                /*double*/ y,
                /*double*/ width, 
                /*double*/ height)
                { 
			
		    /// <summary>
		    /// Constructor which sets the initial values to bound the (0,0) point and the point 
		    /// that results from (0,0) + size. 
		    /// </summary>
			if(arguments.length ==1){
				var size = arguments[0];
		        if(size.IsEmpty)
		        {
//		            this = s_empty; 
	        		this._x = Number.PositiveInfinity;
	        		this._y = Number.PositiveInfinity;
	        		this._width = Number.NegativeInfinity; 
	        		this._height = Number.NegativeInfinity;
		        }
		        else 
		        { 
		            this._x = _y = 0;
		            this._width = size.Width; 
		            this._height = size.Height;
		        }
			}else if(arguments.length == 4){
				if (width < 0 || height < 0) 
				{
					throw new System.ArgumentException(SR.Get(SRID.Size_WidthAndHeightCannotBeNegative)); 
				}

				this._x = x;
				this._y = y; 
				this._width = width;
				this._height = height; 
			}else if(arguments.length == 2){
				/// <summary> 
			    /// Constructor which sets the initial values to the values of the parameters 
			    /// </summary>
//			    public Rect(Point location, 
//		                Size size)
				if(arguments.length[1] instanceof Size ){
					var location = arguments[0], size = arguments[1];
			        if (size.IsEmpty)
			        { 
//			            this = s_empty; 
		        		this._x = Number.PositiveInfinity;
		        		this._y = Number.PositiveInfinity;
		        		this._width = Number.NegativeInfinity; 
		        		this._height = Number.NegativeInfinity;
			        } 
			        else 
			        {
			        	this._x = location._x; 
			        	this._y = location._y;
			        	this._width = size._width;
			        	this._height = size._height;
			        }
				}else if(arguments.length[1] instanceof Point){
					var point1 = arguments[0], point2 = arguments[1];
					
			        this._x = Math.min(point1._x, point2._x); 
			        this._y = Math.min(point1._y, point2._y); 

			        //  Max with 0 to prevent double weirdness from causing us to be (-epsilon..0) 
			        this._width = Math.max(Math.max(point1._x, point2._x) - this._x, 0);
			        this._height = Math.max(Math.max(point1._y, point2._y) - this._y, 0);
				}else if(arguments.length[1] instanceof Vector){
					var point1 = arguments[0], vector = arguments[1], point2 = Pointe.Add(point, vector);
					this.constructor(point1, point2);
				}
			}
		},
		
	    /// <summary>
	    /// Equals - compares this Rect with the passed in object.  In this equality 
	    /// Double.NaN is equal to itself, unlike in numeric equality.
	    /// Note that double values can acquire error when operated upon, such that 
	    /// an exact comparison between two values which 
	    /// are logically equal may fail.
	    /// </summary> 
	    /// <returns>
	    /// bool - true if the object is an instance of Rect and if it's equal to "this".
	    /// </returns>
	    /// <param name='o'>The object to compare to "this"</param> 
//	    public override bool 
		Equals:function(/*object*/ o)
	    { 
	        if ((null == o) || !(o instanceof Rect)) 
	        {
	            return false; 
	        }
	
	        return Rect.Equals(this,o); 
	    },
	    /// <summary> 
	    /// Returns the HashCode for this Rect
	    /// </summary> 
	    /// <returns> 
	    /// int - the HashCode for this Rect
	    /// </returns> 
//	    public override int 
	    GetHashCode:function()
	    {
	        if (this.IsEmpty)
	        { 
	            return 0;
	        } 
	        else 
	        {
	            // Perform field-by-field XOR of HashCodes 
	            return this.X.GetHashCode() ^
	            	this.Y.GetHashCode() ^
	            	this.Width.GetHashCode() ^
	            	this.Height.GetHashCode(); 
	        }
	    },
	    
//	    /// <summary> 
//	    /// Contains - Returns true if the Point is within the rectangle, inclusive of the edges.
//	    /// Returns false otherwise. 
//	    /// </summary> 
//	    /// <param name="point"> The point which is being tested </param>
//	    /// <returns> 
//	    /// Returns true if the Point is within the rectangle.
//	    /// Returns false otherwise
//	    /// </returns>
////	    public bool 
//	    Contains:function(/*Point*/ point) 
//	    {
//	        return this.Contains(point._x, point._y); 
//	    }, 
//
//	    /// <summary> 
//	    /// Contains - Returns true if the Point represented by x,y is within the rectangle inclusive of the edges.
//	    /// Returns false otherwise.
//	    /// </summary>
//	    /// <param name="x"> X coordinate of the point which is being tested </param> 
//	    /// <param name="y"> Y coordinate of the point which is being tested </param>
//	    /// <returns> 
//	    /// Returns true if the Point represented by x,y is within the rectangle. 
//	    /// Returns false otherwise.
//	    /// </returns> 
////	    public bool 
//	    Contains:function(/*double*/ x, /*double*/ y)
//	    {
//	        if (this.IsEmpty)
//	        { 
//	            return false;
//	        } 
//
//	        return this.ContainsInternal(x, y);
//	    }, 
//
//	    /// <summary>
//	    /// Contains - Returns true if the Rect non-Empty and is entirely contained within the
//	    /// rectangle, inclusive of the edges. 
//	    /// Returns false otherwise
//	    /// </summary> 
////	    public bool 
//	    Contains:function(/*Rect*/ rect) 
//	    {
//	        if (this.IsEmpty || rect.IsEmpty) 
//	        {
//	            return false;
//	        }
//
//	        return (this._x <= rect._x &&
//	        		this._y <= rect._y && 
//	        		this._x + this._width >= rect._x + rect._width && 
//	        		this._y + this._height >= rect._y + rect._height );
//	    },
	    
	    Contains:function(/*Rect*/ rect) 
	    {
	    	if(arguments.length == 1){
	    		if(arguments[0] instanceof Rect){
	    			var rect = arguments[0];
	    	        if (this.IsEmpty || rect.IsEmpty) 
	    	        {
	    	            return false;
	    	        }
	    	        
	    	        return (this._x <= rect._x &&
	    	        		this._y <= rect._y && 
	    	        		this._x + this._width >= rect._x + rect._width && 
	    	        		this._y + this._height >= rect._y + rect._height );
	    		}else if(arguments[0] instanceof Point){
	    			var point = arguments[0];
	    			return this.Contains(point._x, point._y); 
	    		}
	    	}else if(arguments.length == 2){
	    		var x = arguments[0], y = arguments[1];
		        if (this.IsEmpty)
		        { 
		            return false;
		        } 

		        return this.ContainsInternal(x, y);
	    	}
	    },
	    

	    /// <summary>
	    /// IntersectsWith - Returns true if the Rect intersects with this rectangle
	    /// Returns false otherwise. 
	    /// Note that if one edge is coincident, this is considered an intersection.
	    /// </summary> 
	    /// <returns> 
	    /// Returns true if the Rect intersects with this rectangle
	    /// Returns false otherwise. 
	    /// or Height
	    /// </returns>
	    /// <param name="rect"> Rect </param>
//	    public bool 
	    IntersectsWith:function(/*Rect*/ rect) 
	    {
	        if (this.IsEmpty || rect.IsEmpty) 
	        { 
	            return false;
	        } 

	        return (rect.Left <= this.Right) &&
	               (rect.Right >= this.Left) &&
	               (rect.Top <= this.Bottom) && 
	               (rect.Bottom >= this.Top);
	    },

	    /// <summary>
	    /// Intersect - Update this rectangle to be the intersection of this and rect 
	    /// If either this or rect are Empty, the result is Empty as well.
	    /// </summary>
	    /// <param name="rect"> The rect to intersect with this </param>
//	    public void 
	    Intersect:function(/*Rect*/ rect) 
	    {
	        if (!this.IntersectsWith(rect)) 
	        { 
//	            this = s_empty; 
        		this._x = Number.PositiveInfinity;
        		this._y = Number.PositiveInfinity;
        		this._width = Number.NegativeInfinity; 
        		this._height = Number.NegativeInfinity;
	        } 
	        else
	        {
	            var left   = Math.max(this.Left, rect.Left);
	            var top    = Math.max(this.Top, rect.Top); 

	            //  Max with 0 to prevent double weirdness from causing us to be (-epsilon..0) 
	            this._width = Math.max(Math.min(this.Right, rect.Right) - left, 0); 
	            this._height = Math.max(Math.min(this.Bottom, rect.Bottom) - top, 0);

	            this._x = left;
	            this._y = top;
	        }
	    },
	    
//	    /// <summary> 
//	    /// Union - Update this rectangle to be the union of this and rect.
//	    /// </summary> 
////	    public void 
//	    Union:function(/*Rect*/ rect)
//	    {
//	        if (IsEmpty)
//	        { 
//	            this = rect;
//	        } 
//	        else if (!rect.IsEmpty) 
//	        {
//	            double left = Math.Min(Left, rect.Left); 
//	            double top = Math.Min(Top, rect.Top);
//
//
//	            // We need this check so that the math does not result in NaN 
//	            if ((rect.Width == Double.PositiveInfinity) || (Width == Double.PositiveInfinity))
//	            { 
//	                _width = Double.PositiveInfinity; 
//	            }
//	            else 
//	            {
//	                //  Max with 0 to prevent double weirdness from causing us to be (-epsilon..0)
//	                double maxRight = Math.Max(Right, rect.Right);
//	                _width = Math.Max(maxRight - left, 0); 
//	            }
//
//	            // We need this check so that the math does not result in NaN 
//	            if ((rect.Height == Double.PositiveInfinity) || (Height == Double.PositiveInfinity))
//	            { 
//	                _height = Double.PositiveInfinity;
//	            }
//	            else
//	            { 
//	                //  Max with 0 to prevent double weirdness from causing us to be (-epsilon..0)
//	                double maxBottom = Math.Max(Bottom, rect.Bottom); 
//	                _height = Math.Max(maxBottom - top, 0); 
//	            }
//
//	            _x = left;
//	            _y = top;
//	        }
//	    }, 
//
//	    /// <summary> 
//	    /// Union - Update this rectangle to be the union of this and point. 
//	    /// </summary>
////	    public void 
//	    Union:function(/*Point*/ point) 
//	    {
//	        Union(new Rect(point, point));
//	    },
	    
	  /// <summary> 
	    /// Union - Update this rectangle to be the union of this and rect.
	    /// </summary> 
//	    public void 
	    Union:function(/*Rect*/ rect)
	    {
	    	if(rect instanceof Rect){
	    		if (this.IsEmpty)
		        { 
//		            this = rect;
	        		this._x = rect.X;
	        		this._y = rect.Y;
	        		this._width = rect.Width; 
	        		this._height = rect.Height;
		        } 
		        else if (!rect.IsEmpty) 
		        {
		            var left = Math.min(this.Left, rect.Left); 
		            var top = Math.min(this.Top, rect.Top);


		            // We need this check so that the math does not result in NaN 
		            if ((rect.Width == Number.PositiveInfinity) || (this.Width == Number.PositiveInfinity))
		            { 
		            	this._width = Number.PositiveInfinity; 
		            }
		            else 
		            {
		                //  Max with 0 to prevent double weirdness from causing us to be (-epsilon..0)
		                var maxRight = Math.max(this.Right, rect.Right);
		                this._width = Math.max(maxRight - left, 0); 
		            }

		            // We need this check so that the math does not result in NaN 
		            if ((rect.Height == Number.PositiveInfinity) || (this.Height == Number.PositiveInfinity))
		            { 
		            	this._height = Number.PositiveInfinity;
		            }
		            else
		            { 
		                //  Max with 0 to prevent double weirdness from causing us to be (-epsilon..0)
		                var maxBottom = Math.max(this.Bottom, rect.Bottom); 
		                this._height = Math.max(maxBottom - top, 0); 
		            }

		            this._x = left;
		            this._y = top;
		        }
	    	}else if(rect instanceof Point){
	    		var point  = rect;
	    		this.Union(new Rect(point, point));
	    	}
	        
	    }, 

//	    /// <summary>
//	    /// Offset - translate the Location by the offset provided. 
//	    /// If this is Empty, this method is illegal. 
//	    /// </summary>
////	    public void 
//	    Offset:function(/*Vector*/ offsetVector) 
//	    {
//	        if (IsEmpty)
//	        {
//	            throw new System.InvalidOperationException(SR.Get(SRID.Rect_CannotCallMethod)); 
//	        }
//
//	        _x += offsetVector._x; 
//	        _y += offsetVector._y;
//	    }, 
//
//	    /// <summary>
//	    /// Offset - translate the Location by the offset provided
//	    /// If this is Empty, this method is illegal. 
//	    /// </summary>
////	    public void 
//	    Offset:function(/*double*/ offsetX, /*double*/ offsetY) 
//	    { 
//	        if (IsEmpty)
//	        { 
//	            throw new System.InvalidOperationException(SR.Get(SRID.Rect_CannotCallMethod));
//	        }
//
//	        _x += offsetX; 
//	        _y += offsetY;
//	    }, 

	    /// <summary>
	    /// Offset - translate the Location by the offset provided
	    /// If this is Empty, this method is illegal. 
	    /// </summary>
//	    public void 
	    Offset:function(/*double*/ offsetX, /*double*/ offsetY) 
	    { 
	    	if(arguments.length ==1 ){
	    		var offsetVector = arguments[0];
		        if (this.IsEmpty)
		        {
		            throw new System.InvalidOperationException(SR.Get(SRID.Rect_CannotCallMethod)); 
		        }

		        this._x += offsetVector._x; 
		        this._y += offsetVector._y;	
	    	}else if(arguments.length == 2){
		        if (this.IsEmpty)
		        { 
		            throw new System.InvalidOperationException(SR.Get(SRID.Rect_CannotCallMethod));
		        }

		        this._x += offsetX; 
		        this._y += offsetY;
	    	}
	    },

//	    /// <summary>
//	    /// Inflate - inflate the bounds by the size provided, in all directions
//	    /// If this is Empty, this method is illegal.
//	    /// </summary> 
////	    public void 
//	    Inflate:function(/*Size*/ size)
//	    { 
//	        Inflate(size._width, size._height); 
//	    },
//
//	    /// <summary>
//	    /// Inflate - inflate the bounds by the size provided, in all directions.
//	    /// If -width is > Width / 2 or -height is > Height / 2, this Rect becomes Empty
//	    /// If this is Empty, this method is illegal. 
//	    /// </summary>
////	    public void 
//	    Inflate:function(/*double*/ width, /*double*/ height) 
//	    { 
//	        if (this.IsEmpty)
//	        { 
//	            throw new System.InvalidOperationException(SR.Get(SRID.Rect_CannotCallMethod));
//	        }
//
//	        this._x -= width; 
//	        this._y -= height;
//
//	        // Do two additions rather than multiplication by 2 to avoid spurious overflow 
//	        // That is: (A + 2 * B) != ((A + B) + B) if 2*B overflows.
//	        // Note that multiplication by 2 might work in this case because A should start 
//	        // positive & be "clamped" to positive after, but consider A = Inf & B = -MAX.
//	        this._width += width;
//	        this._width += width;
//	        this._height += height; 
//	        this._height += height;
//
//	        // We catch the case of inflation by less than -width/2 or -height/2 here.  This also 
//	        // maintains the invariant that either the Rect is Empty or _width and _height are
//	        // non-negative, even if the user parameters were NaN, though this isn't strictly maintained 
//	        // by other methods.
//	        if ( !(this._width >= 0 && this._height >= 0) )
//	        {
//	            this = s_empty; 
//	        }
//	    }, 

	    /// <summary>
	    /// Inflate - inflate the bounds by the size provided, in all directions.
	    /// If -width is > Width / 2 or -height is > Height / 2, this Rect becomes Empty
	    /// If this is Empty, this method is illegal. 
	    /// </summary>
//	    public void 
	    Inflate:function(/*double*/ width, /*double*/ height) 
	    { 
	    	if(arguments.length == 1){
	    		var size = arguments[0];
	    		
	    		this.Inflate(size._width, size._height); 
	    	}else if(arguments.length == 2){
	    		if (this.IsEmpty)
		        { 
		            throw new System.InvalidOperationException(SR.Get(SRID.Rect_CannotCallMethod));
		        }

		        this._x -= width; 
		        this._y -= height;

		        // Do two additions rather than multiplication by 2 to avoid spurious overflow 
		        // That is: (A + 2 * B) != ((A + B) + B) if 2*B overflows.
		        // Note that multiplication by 2 might work in this case because A should start 
		        // positive & be "clamped" to positive after, but consider A = Inf & B = -MAX.
		        this._width += width;
		        this._width += width;
		        this._height += height; 
		        this._height += height;

		        // We catch the case of inflation by less than -width/2 or -height/2 here.  This also 
		        // maintains the invariant that either the Rect is Empty or _width and _height are
		        // non-negative, even if the user parameters were NaN, though this isn't strictly maintained 
		        // by other methods.
		        if ( !(this._width >= 0 && this._height >= 0) )
		        {
//		            this = s_empty; 
	        		this._x = Number.PositiveInfinity;
	        		this._y = Number.PositiveInfinity;
	        		this._width = Number.NegativeInfinity; 
	        		this._height = Number.NegativeInfinity;
		        }
	    	}
	        
	    }, 
	    

	    /// <summary> 
	    /// Updates rectangle to be the bounds of the original value transformed
	    /// by the matrix. 
	    /// The Empty Rect is not affected by this call.
	    /// </summary>
	    /// <param name="matrix"> Matrix </param>
//	    public void 
	    Transform:function(/*Matrix*/ matrix) 
	    {
	        MatrixUtil.TransformRect(/*ref*/ this, /*ref*/ matrix); 
	    }, 

	    /// <summary> 
	    /// Scale the rectangle in the X and Y directions
	    /// </summary>
	    /// <param name="scaleX"> The scale in X </param>
	    /// <param name="scaleY"> The scale in Y </param> 
//	    public void 
	    Scale:function(/*double*/ scaleX, /*double*/ scaleY)
	    { 
	        if (this.IsEmpty) 
	        {
	            return; 
	        }

	        this._x *= scaleX;
	        this._y *= scaleY; 
	        this._width *= scaleX;
	        this._height *= scaleY; 

	        // If the scale in the X dimension is negative, we need to normalize X and Width
	        if (scaleX < 0) 
	        {
	            // Make X the left-most edge again
	        	this._x += this._width;

	            // and make Width positive
	            this._width *= -1; 
	        } 

	        // Do the same for the Y dimension 
	        if (scaleY < 0)
	        {
	            // Make Y the top-most edge again
	        	this._y += this._height; 

	            // and make Height positive 
	        	this._height *= -1; 
	        }
	    }, 

	    /// <summary> 
	    /// ContainsInternal - Performs just the "point inside" logic 
	    /// </summary>
	    /// <returns> 
	    /// bool - true if the point is inside the rect
	    /// </returns>
	    /// <param name="x"> The x-coord of the point to test </param>
	    /// <param name="y"> The y-coord of the point to test </param> 
//	    private bool 
	    ContainsInternal:function(/*double*/ x, /*double*/ y)
	    { 
	        // We include points on the edge as "contained". 
	        // We do "x - _width <= _x" instead of "x <= _x + _width"
	        // so that this check works when _width is PositiveInfinity 
	        // and _x is NegativeInfinity.
	        return ((x >= this._x) && (x - this._width <= _x) &&
	                (y >= this._y) && (y - this._height <= this._y));
	    },
	    

	    /// <summary>
	    /// Creates a string representation of this object based on the current culture. 
	    /// </summary>
	    /// <returns> 
	    /// A string representation of this object. 
	    /// </returns>
//	    public override string 
	    ToString:function() 
	    {

	        // Delegate to the internal method which implements all ToString calls.
	        return this.ConvertToString(null /* format string */, null /* format provider */); 
	    },

	    /// <summary>
	    /// Creates a string representation of this object based on the format string
	    /// and IFormatProvider passed in.
	    /// If the provider is null, the CurrentCulture is used. 
	    /// See the documentation for IFormattable for more information.
	    /// </summary> 
	    /// <returns> 
	    /// A string representation of this object.
	    /// </returns> 
//	    internal string 
	    ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider)
	    {
	        if (this.IsEmpty)
	        { 
	            return "Empty";
	        } 

	        // Helper to get the numeric list separator for a given culture.
	        var separator = MS.Internal.TokenizerHelper.GetNumericListSeparator(provider); 
	        return String.Format(provider,
	                             "{1:" + format + "}{0}{2:" + format + "}{0}{3:" + format + "}{0}{4:" + format + "}",
	                             separator,
	                             this._x, 
	                             this._y,
	                             this._width, 
	                             this._height); 
	    }

	    
	});
	
	Object.defineProperties(Rect.prototype,{
	    /// <summary>
	    /// IsEmpty - this returns true if this rect is the Empty rectangle. 
	    /// Note: If width or height are 0 this Rectangle still contains a 0 or 1 dimensional set
	    /// of points, so this method should not be used to check for 0 area.
	    /// </summary>
//	    public bool 
	    IsEmpty: 
	    {
	        get:function() 
	        { 
	            return this._width < 0;
	        }
	    }, 


	    /// <summary> 
	    /// Location - The Point representing the origin of the Rectangle 
	    /// </summary>
//	    public Point 
	    Location: 
	    {
	        get:function()
	        {
	            return new Point(this._x, this._y); 
	        },
	        set:function(value) 
	        { 
	            if (this.IsEmpty)
	            { 
	                throw new System.InvalidOperationException(SR.Get(SRID.Rect_CannotModifyEmptyRect));
	            }

	            this._x = value._x; 
	            this._y = value._y;
	        } 
	    }, 

	    /// <summary> 
	    /// Size - The Size representing the area of the Rectangle
	    /// </summary>
//	    public Size 
	    Size:
	    { 
	        get:function()
	        { 
	            if (this.IsEmpty) 
	                return Size.Empty;
	            return new Size(this._width, this._height); 
	        },
	        set:function(value)
	        {
	            if (value.IsEmpty) 
	            {
//	                this = s_empty; 
	        		this._x = Number.PositiveInfinity;
	        		this._y = Number.PositiveInfinity;
	        		this._width = Number.NegativeInfinity; 
	        		this._height = Number.NegativeInfinity;
	            } 
	            else
	            { 
	                if (this.IsEmpty)
	                {
	                    throw new System.InvalidOperationException(SR.Get(SRID.Rect_CannotModifyEmptyRect));
	                } 

	                this._width = value._width; 
	                this._height = value._height; 
	            }
	        } 
	    },

	    /// <summary>
	    /// X - The X coordinate of the Location. 
	    /// If this is the empty rectangle, the value will be positive infinity.
	    /// If this rect is Empty, setting this property is illegal. 
	    /// </summary> 
//	    public double 
	    X:
	    { 
	        get:function()
	        {
	            return this._x;
	        }, 
	        set:function(value)
	        { 
	            if (this.IsEmpty) 
	            {
	                throw new System.InvalidOperationException(SR.Get(SRID.Rect_CannotModifyEmptyRect)); 
	            }

	            this._x = value;
	        } 

	    }, 

	    /// <summary>
	    /// Y - The Y coordinate of the Location 
	    /// If this is the empty rectangle, the value will be positive infinity.
	    /// If this rect is Empty, setting this property is illegal.
	    /// </summary>
//	    public double 
	    Y: 
	    {
	        get:function() 
	        { 
	            return this._y;
	        }, 
	        set:function(value)
	        {
	            if (this.IsEmpty)
	            { 
	                throw new System.InvalidOperationException(SR.Get(SRID.Rect_CannotModifyEmptyRect));
	            } 

	            this._y = value;
	        } 
	    },

	    /// <summary>
	    /// Width - The Width component of the Size.  This cannot be set to negative, and will only 
	    /// be negative if this is the empty rectangle, in which case it will be negative infinity.
	    /// If this rect is Empty, setting this property is illegal. 
	    /// </summary> 
//	    public double 
	    Width:
	    { 
	        get:function()
	        {
	            return this._width;
	        }, 
	        set:function(value)
	        { 
	            if (this.IsEmpty) 
	            {
	                throw new System.InvalidOperationException(SR.Get(SRID.Rect_CannotModifyEmptyRect)); 
	            }

	            if (value < 0)
	            { 
	                throw new System.ArgumentException(SR.Get(SRID.Size_WidthCannotBeNegative));
	            } 

	            this._width = value;
	        } 
	    },
	    /// <summary>
	    /// Height - The Height component of the Size.  This cannot be set to negative, and will only 
	    /// be negative if this is the empty rectangle, in which case it will be negative infinity.
	    /// If this rect is Empty, setting this property is illegal. 
	    /// </summary> 
//	    public double 
	    Height:
	    { 
	        get:function()
	        {
	            return this._height;
	        }, 
	        set:function(value)
	        { 
	            if (this.IsEmpty) 
	            {
	                throw new System.InvalidOperationException(SR.Get(SRID.Rect_CannotModifyEmptyRect)); 
	            }

	            if (value < 0)
	            { 
	                throw new System.ArgumentException(SR.Get(SRID.Size_HeightCannotBeNegative));
	            } 

	            this._height = value;
	        } 
	    },

	    /// <summary>
	    /// Left Property - This is a read-only alias for X 
	    /// If this is the empty rectangle, the value will be positive infinity.
	    /// </summary> 
//	    public double 
	    Left: 
	    {
	        get:function() 
	        {
	            return this._x;
	        }
	    }, 

	    /// <summary> 
	    /// Top Property - This is a read-only alias for Y 
	    /// If this is the empty rectangle, the value will be positive infinity.
	    /// </summary> 
//	    public double 
	    Top:
	    {
	        get:function()
	        { 
	            return this._y;
	        } 
	    }, 
	    /// <summary> 
	    /// Right Property - This is a read-only alias for X + Width
	    /// If this is the empty rectangle, the value will be negative infinity.
	    /// </summary>
//	    public double 
	    Right: 
	    {
	        get:function() 
	        { 
	            if (this.IsEmpty)
	            { 
	                return Number.NegativeInfinity;
	            }

	            return this._x + this._width; 
	        }
	    }, 

	    /// <summary>
	    /// Bottom Property - This is a read-only alias for Y + Height 
	    /// If this is the empty rectangle, the value will be negative infinity.
	    /// </summary>
//	    public double 
	    Bottom:
	    { 
	        get:function()
	        { 
	            if (this.IsEmpty) 
	            {
	                return Number.NegativeInfinity; 
	            }

	            return this._y + this._height;
	        } 
	    },

	    /// <summary> 
	    /// TopLeft Property - This is a read-only alias for the Point which is at X, Y
	    /// If this is the empty rectangle, the value will be positive infinity, positive infinity. 
	    /// </summary>
//	    public Point 
	    TopLeft:
	    {
	        get:function() 
	        {
	            return new Point(this.Left, this.Top); 
	        } 
	    },

	    /// <summary>
	    /// TopRight Property - This is a read-only alias for the Point which is at X + Width, Y
	    /// If this is the empty rectangle, the value will be negative infinity, positive infinity.
	    /// </summary> 
//	    public Point 
	    TopRight:
	    { 
	        get:function() 
	        {
	            return new Point(this.Right, this.Top); 
	        }
	    },
	    /// <summary> 
	    /// BottomLeft Property - This is a read-only alias for the Point which is at X, Y + Height
	    /// If this is the empty rectangle, the value will be positive infinity, negative infinity. 
	    /// </summary> 
//	    public Point 
	    BottomLeft:
	    { 
	        get:function()
	        {
	            return new Point(this.Left, this.Bottom);
	        } 
	    },

	    /// <summary> 
	    /// BottomRight Property - This is a read-only alias for the Point which is at X + Width, Y + Height
	    /// If this is the empty rectangle, the value will be negative infinity, negative infinity. 
	    /// </summary>
//	    public Point 
	    BottomRight:
	    {
	        get:function() 
	        {
	            return new Point(this.Right, this.Bottom); 
	        } 
	    }		  
	});
	
	Object.defineProperties(Rect, {
		/// <summary> 
	    /// Empty - a static property which provides an Empty rectangle.  X and Y are positive-infinity
	    /// and Width and Height are negative infinity.  This is the only situation where Width or
	    /// Height can be negative.
	    /// </summary> 
//	    public static Rect 
		Empty:
	    { 
	        get:function() 
	        {
	            return s_empty; 
	        }
	    }, 
	});
	
//	static private Rect 
	function CreateEmptyRect() 
	{ 
		var rect = new Rect();
		// We can't set these via the property setters because negatives widths 
		// are rejected in those APIs.
		rect._x = Number.PositiveInfinity;
		rect._y = Number.PositiveInfinity;
		rect._width = Number.NegativeInfinity; 
		rect._height = Number.NegativeInfinity;
		return rect; 
	} 

//  private readonly static Rect 
	var s_empty = CreateEmptyRect(); 
	
    /// <summary> 
    /// Intersect - Return the result of the intersection of rect1 and rect2. 
    /// If either this or rect are Empty, the result is Empty as well.
    /// </summary> 
//    public static Rect 
	Rect.Intersect = function(/*Rect*/ rect1, /*Rect*/ rect2)
    {
        rect1.Intersect(rect2);
        return rect1; 
    };
    
//  /// <summary> 
//    /// Union - Return the result of the union of rect1 and rect2. 
//    /// </summary>
////    public static Rect 
//    Rect.Union = function(/*Rect*/ rect1, /*Rect*/ rect2) 
//    {
//        rect1.Union(rect2);
//        return rect1;
//    }; 
//    /// <summary>
//    /// Union - Return the result of the union of rect and point. 
//    /// </summary> 
////    public static Rect 
//    Rect.Union = function(/*Rect*/ rect, /*Point*/ point)
//    { 
//        rect.Union(new Rect(point, point));
//        return rect;
//    };
    
    /// <summary>
    /// Union - Return the result of the union of rect and point. 
    /// </summary> 
//    public static Rect 
    Rect.Union = function(/*Rect*/ rect, /*Point*/ point)
    { 
    	if(arguments[1] instanceof Rect){
    		var rect1 = arguments[0];
    		var rect2 = arguments[1];
            rect1.Union(rect2);
            return rect1;
    	}else {
    		var rect = arguments[0];
    		var point = arguments[1];
            rect.Union(new Rect(point, point));
            return rect;
    	}
    };
//    /// <summary>
//    /// Offset - return the result of offsetting rect by the offset provided 
//    /// If this is Empty, this method is illegal.
//    /// </summary>
////    public static Rect 
//    Rect.Offset = function(/*Rect*/ rect, /*Vector*/ offsetVector)
//    { 
//        rect.Offset(offsetVector.X, offsetVector.Y);
//        return rect; 
//    }; 
//
//    /// <summary> 
//    /// Offset - return the result of offsetting rect by the offset provided
//    /// If this is Empty, this method is illegal.
//    /// </summary>
////    public static Rect 
//    Rect.Offset = function(/*Rect*/ rect, /*double*/ offsetX, /*double*/ offsetY) 
//    {
//        rect.Offset(offsetX, offsetY); 
//        return rect; 
//    };
    
    /// <summary>
    /// Offset - return the result of offsetting rect by the offset provided 
    /// If this is Empty, this method is illegal.
    /// </summary>
//    public static Rect 
    Rect.Offset = function(/*Rect*/ rect, /*double*/ offsetX, /*double*/ offsetY)
    { 
    	if(arguments.length == 2){
    		var rect = arguments[0], offsetVector = arguments[1];
            rect.Offset(offsetVector.X, offsetVector.Y);
            return rect; 
    	}else if(arguments.length == 2){
            rect.Offset(offsetX, offsetY); 
            return rect; 
    	}
    }; 
//    /// <summary>
//    /// Inflate - return the result of inflating rect by the size provided, in all directions 
//    /// If this is Empty, this method is illegal.
//    /// </summary>
////    public static Rect 
//    Rect.Inflate = function(/*Rect*/ rect, /*Size*/ size)
//    { 
//        rect.Inflate(size._width, size._height);
//        return rect; 
//    }; 
//
//    /// <summary> 
//    /// Inflate - return the result of inflating rect by the size provided, in all directions
//    /// If this is Empty, this method is illegal.
//    /// </summary>
////    public static Rect 
//    Rect.Inflate = function(/*Rect*/ rect, /*double*/ width, /*double*/ height) 
//    {
//        rect.Inflate(width, height); 
//        return rect; 
//    };

    /// <summary> 
    /// Inflate - return the result of inflating rect by the size provided, in all directions
    /// If this is Empty, this method is illegal.
    /// </summary>
//    public static Rect 
    Rect.Inflate = function(/*Rect*/ rect, /*double*/ width, /*double*/ height) 
    {
    	if(arguments.length == 2){
    		var rect = arguments[0], size = arguments[1];
            rect.Inflate(size._width, size._height);
            return rect; 
    	}else if(arguments.length == 2){
            rect.Inflate(width, height); 
            return rect; 
    	}

    };

    /// <summary>
    /// Returns the bounds of the transformed rectangle.
    /// The Empty Rect is not affected by this call.
    /// </summary> 
    /// <returns>
    /// The rect which results from the transformation. 
    /// </returns> 
    /// <param name="rect"> The Rect to transform. </param>
    /// <param name="matrix"> The Matrix by which to transform. </param> 
//    public static Rect 
    Rect.Transform = function(/*Rect*/ rect, /*Matrix*/ matrix)
    {
        MatrixUtil.TransformRect(/*ref*/ rect, /*ref*/ matrix);
        return rect; 
    };
    
    /// <summary>
    /// Compares two Rect instances for object equality.  In this equality 
    /// Double.NaN is equal to itself, unlike in numeric equality.
    /// Note that double values can acquire error when operated upon, such that 
    /// an exact comparison between two values which 
    /// are logically equal may fail.
    /// </summary> 
    /// <returns>
    /// bool - true if the two Rect instances are exactly equal, false otherwise
    /// </returns>
    /// <param name='rect1'>The first Rect to compare</param> 
    /// <param name='rect2'>The second Rect to compare</param>
//    public static bool 
    Rect.Equals =function(/*Rect*/ rect1, /*Rect*/ rect2) 
    { 
        if (rect1.IsEmpty)
        { 
            return rect2.IsEmpty;
        }
        else
        { 
            return rect1.X.Equals(rect2.X) &&
                   rect1.Y.Equals(rect2.Y) && 
                   rect1.Width.Equals(rect2.Width) && 
                   rect1.Height.Equals(rect2.Height);
        } 
    };
	
	Rect.Type = new Type("Rect", Rect, [Object.Type]);
	return Rect;
});






