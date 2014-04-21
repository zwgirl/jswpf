/**
 * Color
 */

define(["dojo/_base/declare", "system/Type", "system/IFormattable", "system/IEquatable"], 
		function(declare, Type, IFormattable, IEquatable){
	
//    private struct 
    var MILColorF = declare(null, {
    	constructor:function(){
        	this._a = 0;
        	this._r = 0;
        	this._g = 0;
        	this._b = 0;
    	}

    }); // this structure is the "milrendertypes.h" structure and should be identical for performance
    Object.defineProperties(MILColorF.prototype, { 
//        public float 
        a:
        {
        	get:function(){
        		return this._a;
        	},
        	set:function(value){
        		this._a = value;
        	}
        },
        r:
        {
        	get:function(){
        		return this._r;
        	},
        	set:function(value){
        		this._r = value;
        	}
        },
        g:
        {
        	get:function(){
        		return this._g;
        	},
        	set:function(value){
        		this._g = value;
        	}
        },
        b:
        {
        	get:function(){
        		return this._b;
        	},
        	set:function(value){
        		this._b = value;
        	}
        }, 
    });

//    private MILColorF scRgbColor;

//    private struct 
    var MILColor = declare(null, {
    	constructor:function(){
        	this._a = 0;
        	this._r = 0;
        	this._g = 0;
        	this._b = 0;
    	}
    });
    Object.defineProperties(MILColor.prototype, {  
//        public byte 
        a:
        {
        	get:function(){
        		return this._a;
        	},
        	set:function(value){
        		this._a = value;
        	}
        },
        r:
        {
        	get:function(){
        		return this._r;
        	},
        	set:function(value){
        		this._r = value;
        	}
        },
        g:
        {
        	get:function(){
        		return this._g;
        	},
        	set:function(value){
        		this._g = value;
        	}
        },
        b:
        {
        	get:function(){
        		return this._b;
        	},
        	set:function(value){
        		this._b = value;
        	}
        }, 
    }); 
    
    function decimalToHex(d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

        while (hex.length < padding) {
            hex = "0" + hex;
        }

        return hex;
    }
    

//         private const string 
         var c_scRgbFormat = "R";

    
	var Color = declare("Color", [IFormattable, IEquatable], {
		constructor:function(){
//	        private MILColorF 
			this.scRgbColor = new MILColorF();
//	        private MILColor 
			this.sRgbColor = new MILColor();
//	        private bool 
			this.isFromScRgb = false;
		},
		
		///<summary> 
        /// GetHashCode 
        ///</summary>
//        public override int 
        GetHashCode:function() 
        {
            return this.scRgbColor.GetHashCode(); //^this.context.GetHashCode();
        },
 
        /// <summary>
        /// Creates a string representation of this object based on the current culture. 
        /// </summary> 
        /// <returns>
        /// A string representation of this object. 
        /// </returns>
//        public override string 
        ToString:function()
        {
            // Delegate to the internal method which implements all ToString calls. 

//            var format = isFromScRgb ? c_scRgbFormat : null; 
// 
//            return ConvertToString(format, null);
        	return "#" /*+ this.A.toString(16)*/ + 
        		decimalToHex(this.R) + 
        		decimalToHex(this.G) +
        		decimalToHex(this.B);
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
//        internal string 
        ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider) 
        { 
        	var sb = new StringBuilder();
 
            sb.AppendFormat(provider, "#{0:X2}", this.sRgbColor.a);
            sb.AppendFormat(provider, "{0:X2}", this.sRgbColor.r); 
            sb.AppendFormat(provider, "{0:X2}", this.sRgbColor.g); 
            sb.AppendFormat(provider, "{0:X2}", this.sRgbColor.b);

            return sb.ToString(); 
        },

 
        /// <summary>
        /// Compares two colors for exact equality.  Note that float values can acquire error 
        /// when operated upon, such that an exact comparison between two vEquals(color);alues which are logically
        /// equal may fail. see cref="AreClose" for a "fuzzy" version of this comparison.
        /// </summary>
        /// <param name='o'>The object to compare to "this"</param> 
        /// <returns>Whether or not the two colors are equal</returns>
//        public override bool 
        Equals:function(/*object*/ o) 
        { 
            if (o instanceof Color)
            { 
                return (this == o);
            } 
            else
            { 
                return false; 
            }
        }, 
        
        
	});
	
	Object.defineProperties(Color.prototype,{
	      ///<summary> 
        /// ColorContext
        ///</summary>
//        public ColorContext 
        ColorContext:
        { 
            get:function()
            { 
                return this.context; 
            }
        },

        ///<summary>
        /// A
        ///</summary> 
//        public byte 
        A:
        { 
            get:function() 
            {
                return this.sRgbColor.a; 
            },
            set:function(value)
            {
            	this.scRgbColor.a = value / 255.0; 
            	this.sRgbColor.a = value;
            } 
        }, 

        /// <value>The Red channel as a byte whose range is [0..255]. 
        /// the value is not allowed to be out of range</value>
        /// <summary>
        /// R
        /// </summary> 
//        public byte 
        R:
        { 
            get:function() 
            {
                return this.sRgbColor.r; 
            },
            set:function(value)
            {
            	this.scRgbColor.r = sRgbToScRgb(value); 
            	this.sRgbColor.r = value;
            } 
        },
 
        ///<value>The Green channel as a byte whose range is [0..255]. 
        /// the value is not allowed to be out of range</value><summary>
        /// G 
        ///</summary>
//        public byte 
        G:
        {
            get:function() 
            {
                return this.sRgbColor.g; 
            },
            set:function(value)
            { 
            	this.scRgbColor.g = sRgbToScRgb(value);
            	this.sRgbColor.g = value; 
            }
        },

        ///<value>The Blue channel as a byte whose range is [0..255]. 
        /// the value is not allowed to be out of range</value><summary>
        /// B 
        ///</summary> 
//        public byte 
        B:
        { 
            get:function()
            {
                return this.sRgbColor.b;
            },
            set:function(value)
            { 
            	this.scRgbColor.b = sRgbToScRgb(value); 
            	this.sRgbColor.b = value;
            } 
        },
 
        ///<value>The Alpha channel as a float whose range is [0..1].
        /// the value is allowed to be out of range</value><summary>
        /// ScA
        ///</summary> 
//        public float 
        ScA:
        { 
            get:function() 
            {
                return this.scRgbColor.a; 
            },
            set:function(value)
            {
            	this.scRgbColor.a = value; 
                if (value < 0.0)
                { 
                	this.sRgbColor.a = 0; 
                }
                else if (value > 1.0) 
                {
                	this.sRgbColor.a = 255;
                }
                else 
                {
                	this.sRgbColor.a = (value * 255); 
                } 
            }
        }, 

        ///<value>The Red channel as a float whose range is [0..1].
        /// the value is allowed to be out of range</value>
        ///<summary> 
        /// ScR
        ///</summary> 
//        public float 
        ScR: 
        {
            get:function() 
            {
                return this.scRgbColor.r;
                // throw new ArgumentException(SR.Get(SRID.Color_ColorContextNotsRgb_or_ScRgb, null));
            },
            set:function(value)
            { 
            	this.scRgbColor.r = value; 
            	this.sRgbColor.r = ScRgbTosRgb(value);
            } 
        },
 
        ///<value>The Green channel as a float whose range is [0..1].
        /// the value is allowed to be out of range</value><summary>
        /// ScG
        ///</summary> 
//        public float 
        ScG:
        { 
            get:function()
            {
                return this.scRgbColor.g; 
                // throw new ArgumentException(SR.Get(SRID.Color_ColorContextNotsRgb_or_ScRgb, null));
            },
            set:function(value)
            { 
               	this.scRgbColor.g = value; 
            	this.sRgbColor.g = ScRgbTosRgb(value);
            }
        }, 
 
        ///<value>The Blue channel as a float whose range is [0..1].
        /// the value is allowed to be out of range</value><summary> 
        /// ScB
        ///</summary>
//        public float 
        ScB:
        { 
            get:function()
            { 
                return this.scRgbColor.b; 
                // throw new ArgumentException(SR.Get(SRID.Color_ColorContextNotsRgb_or_ScRgb, null));
            },
            set:function(value)
            {
            	this.scRgbColor.b = value;
            	this.sRgbColor.b = ScRgbTosRgb(value); 
            }
        } 
	});
	

    ///<summary> 
    /// Color - sRgb legacy interface, assumes Rgb values are sRgb
    ///</summary> 
//    internal static Color 
    Color.FromUInt32 = function(/*uint*/ argb)// internal legacy sRGB interface 
    {
        var c1 = new Color(); 

        c1.sRgbColor.a = ((argb & 0xff000000) >> 24);
        c1.sRgbColor.r = ((argb & 0x00ff0000) >> 16);
        c1.sRgbColor.g = ((argb & 0x0000ff00) >> 8); 
        c1.sRgbColor.b = (argb & 0x000000ff);
        c1.scRgbColor.a = c1.sRgbColor.a / 255.0; 
        c1.scRgbColor.r = sRgbToScRgb(c1.sRgbColor.r);  // note that context is undefined and thus unloaded 
        c1.scRgbColor.g = sRgbToScRgb(c1.sRgbColor.g);
        c1.scRgbColor.b = sRgbToScRgb(c1.sRgbColor.b); 

        c1.isFromScRgb = false;

        return c1;
    }; 

    ///<summary>
    /// FromScRgb 
    ///</summary>
//    public static Color 
    Color.FromScRgb = function(/*float*/ a, /*float*/ r, /*float*/ g, /*float*/ b)
    {
        var c1 = new Color(); 

        c1.scRgbColor.r = r; 
        c1.scRgbColor.g = g; 
        c1.scRgbColor.b = b;
        c1.scRgbColor.a = a; 
        if (a < 0.0)
        {
            a = 0.0;
        } 
        else if (a > 1.0)
        { 
            a = 1.0; 
        }

        c1.sRgbColor.a = ((a * 255.0) + 0.5);
        c1.sRgbColor.r = ScRgbTosRgb(c1.scRgbColor.r);
        c1.sRgbColor.g = ScRgbTosRgb(c1.scRgbColor.g);
        c1.sRgbColor.b = ScRgbTosRgb(c1.scRgbColor.b); 
        c1.context = null;

        c1.isFromScRgb = true; 

        return c1; 
    };

    ///<summary>
    /// Color - sRgb legacy interface, assumes Rgb values are sRgb, alpha channel is linear 1.0 gamma 
    ///</summary>
//    public static Color 
    Color.FromArgb = function(/*byte*/ a, /*byte*/ r, /*byte*/ g, /*byte*/ b)// legacy sRGB interface, bytes are required to properly round trip 
    { 
        var c1 = new Color();

        c1.scRgbColor.a = a / 255.0;
        c1.scRgbColor.r = sRgbToScRgb(r);  // note that context is undefined and thus unloaded
        c1.scRgbColor.g = sRgbToScRgb(g);
        c1.scRgbColor.b = sRgbToScRgb(b); 
        c1.sRgbColor.a = a; 
        c1.sRgbColor.r = ScRgbTosRgb(c1.scRgbColor.r); 
        c1.sRgbColor.g = ScRgbTosRgb(c1.scRgbColor.g);
        c1.sRgbColor.b = ScRgbTosRgb(c1.scRgbColor.b); 

        c1.isFromScRgb = false;

        return c1; 
    };

    ///<summary> 
    /// Color - sRgb legacy interface, assumes Rgb values are sRgb
    ///</summary> 
//    public static Color 
    Color.FromRgb = function(/*byte*/ r, /*byte*/ g, /*byte*/ b)// legacy sRGB interface, bytes are required to properly round trip
    {
        var c1 = Color.FromArgb(0xff, r, g, b);
        return c1; 
    };


    ///<summary> 
    /// Addition method - Adds each channel of the second color to each channel of the
    /// first and returns the result 
    ///</summary>
//    public static Color 
    Color.Add = function(/*Color*/ color1, /*Color*/ color2)
    {
        var c1 = FromScRgb(
                color1.scRgbColor.a + color2.scRgbColor.a, 
                color1.scRgbColor.r + color2.scRgbColor.r,
                color1.scRgbColor.g + color2.scRgbColor.g, 
                color1.scRgbColor.b + color2.scRgbColor.b); 
              return c1;
    };

    ///<summary> 
    /// Subtract method - subtracts each channel of the second color from each channel of the
    /// first and returns the result
    ///</summary>
//    public static Color 
    Color.Subtract = function(/*Color*/ color1, /*Color*/ color2) 
    {
        var c1 = FromScRgb( 
                color1.scRgbColor.a - color2.scRgbColor.a,
                color1.scRgbColor.r - color2.scRgbColor.r,
                color1.scRgbColor.g - color2.scRgbColor.g,
                color1.scRgbColor.b - color2.scRgbColor.b 
                );
            return c1; 
    };

    ///<summary> 
    /// Multiplication method - Multiplies each channel of the color by a coefficient and returns the result
    ///</summary> 
//    public static Color 
    Color.Multiply = function(/*Color*/ color, /*float*/ coefficient)
    {
    	var c1 = FromScRgb(color.scRgbColor.a * coefficient, 
    			color.scRgbColor.r * coefficient, 
    			color.scRgbColor.g * coefficient, 
    			color.scRgbColor.b * coefficient);

        return c1;
    };

    ///<summary> 
    /// Equality method for two colors - return true of colors are equal, otherwise returns false 
    ///</summary>
//    public static bool 
    Color.Equals = function(/*Color*/ color1, /*Color*/ color2) 
    {
        if (color1.scRgbColor.r != color2.scRgbColor.r)
        {
            return false; 
        }

        if (color1.scRgbColor.g != color2.scRgbColor.g) 
        {
            return false; 
        }

        if (color1.scRgbColor.b != color2.scRgbColor.b)
        { 
            return false;
        } 

        if (color1.scRgbColor.a != color2.scRgbColor.a)
        { 
            return false;
        }

        return true; 
    };


    ///<summary> 
    /// private helper function to set context values from a color value with a set context and ScRgb values
    ///</summary>
//    private static float 
    function sRgbToScRgb(/*byte*/ bval)
    { 
        var val = (bval / 255.0);

        if (!(val > 0.0))       // Handles NaN case too. (Though, NaN isn't actually 
                                // possible in this case.)
        { 
            return (0.0);
        }
        else if (val <= 0.04045)
        { 
            return (val / 12.92);
        } 
        else if (val < 1.0) 
        {
            return Math.pow((val + 0.055) / 1.055, 2.4); 
        }
        else
        {
            return (1.0); 
        }
    } 

    ///<summary>
    /// private helper function to set context values from a color value with a set context and ScRgb values 
    ///</summary>
    ///
//    private static byte 
    function ScRgbTosRgb(/*float*/ val)
    { 
        if (!(val > 0.0))       // Handles NaN case too
        { 
            return (0); 
        }
        else if (val <= 0.0031308) 
        {
            return (((255.0 * val * 12.92) + 0.5));
        }
        else if (val < 1.0) 
        {
            return (((255.0 * ((1.055 * Math.pow(val, (1.0 / 2.4))) - 0.055)) + 0.5)); 
        } 
        else
        { 
            return (255);
        }
    }

	
	Color.Type = new Type("Color", Color, [IFormattable.Type, IEquatable.Type]);
	return Color;
});





