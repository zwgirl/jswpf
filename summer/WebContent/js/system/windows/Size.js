/**
 * Size
 */

define(["dojo/_base/declare", "system/Type", "controls/HeaderedContentControl"], 
		function(declare, Type, HeaderedContentControl){
	var Size = declare("Size", Object,{
		constructor:function(/*double*/ width, /*double*/ height)
        { 
            if (width < 0 || height < 0) 
            {
                throw new System.ArgumentException(SR.Get(SRID.Size_WidthAndHeightCannotBeNegative)); 
            }

            this._width = width;
            this._height = height; 
        },
        
        /// <summary>
        /// Equals - compares this Size with the passed in object.  In this equality 
        /// Double.NaN is equal to itself, unlike in numeric equality.
        /// Note that double values can acquire error when operated upon, such that
        /// an exact comparison between two values which
        /// are logically equal may fail. 
        /// </summary>
        /// <returns> 
        /// bool - true if the object is an instance of Size and if it's equal to "this". 
        /// </returns>
        /// <param name='o'>The object to compare to "this"</param> 
//        public override bool 
        Equals:function(/*object*/ o)
        {
            if ((null == o) || !(o instanceof Size))
            { 
                return false;
            } 
 
            return Size.Equals(this,o); 
        },
        /// <summary> 
        /// Returns the HashCode for this Size
        /// </summary>
        /// <returns>
        /// int - the HashCode for this Size 
        /// </returns>
//        public override int 
        GetHashCode:function() 
        { 
            if (this.IsEmpty)
            { 
                return 0;
            }
            else
            { 
                // Perform field-by-field XOR of HashCodes
                return this.Width.GetHashCode() ^ 
                	this.Height.GetHashCode(); 
            }
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
            return ConvertToString(null /* format string */, null /* format provider */);
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
            if (IsEmpty) 
            {
                return "Empty"; 
            } 

            // Helper to get the numeric list separator for a given culture. 
            var separator = MS.Internal.TokenizerHelper.GetNumericListSeparator(provider);
            return String.Format(provider,
                                 "{1:" + format + "}{0}{2:" + format + "}",
                                 separator, 
                                 this._width,
                                 this._height); 
        } 
        
	});
	
	Object.defineProperties(Size.prototype,{


        /// <summary>
        /// IsEmpty - this returns true if this size is the Empty size.
        /// Note: If size is 0 this Size still contains a 0 or 1 dimensional set
        /// of points, so this method should not be used to check for 0 area. 
        /// </summary>
//        public bool 
		IsEmpty:
        { 
            get:function()
            { 
                return this._width < 0;
            }
        },
 
        /// <summary>
        /// Width - Default is 0, must be non-negative 
        /// </summary> 
//        public double 
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
                    throw new System.InvalidOperationException(SR.Get(SRID.Size_CannotModifyEmptySize)); 
                }

                if (value < 0)
                { 
                    throw new System.ArgumentException(SR.Get(SRID.Size_WidthCannotBeNegative));
                } 
 
                this._width = value;
            } 
        },

        /// <summary>
        /// Height - Default is 0, must be non-negative. 
        /// </summary>
//        public double 
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
                    throw new System.InvalidOperationException(SR.Get(SRID.Size_CannotModifyEmptySize)); 
                }
 
                if (value < 0)
                {
                    throw new System.ArgumentException(SR.Get(SRID.Size_HeightCannotBeNegative));
                } 

                this._height = value; 
            } 
        }	  
	});
	
//  private readonly static Size 
	var s_empty = CreateEmptySize();
	
	Object.defineProperties(Size,{
        /// <summary>
        /// Empty - a static property which provides an Empty size.  Width and Height are
        /// negative-infinity.  This is the only situation 
        /// where size can be negative.
        /// </summary> 
//        public static Size 
		Empty: 
        {
            get:function() 
            {
                return s_empty;
            }
        }  
	});
	

//    static private Size 
	function CreateEmptySize() 
    { 
        var size = new Size();
        // We can't set these via the property setters because negatives widths 
        // are rejected in those APIs.
        size._width = Number.NegativeInfinity;
        size._height = Number.NegativeInfinity;
        return size; 
    }
	
    /// <summary>
    /// Compares two Size instances for object equality.  In this equality
    /// Double.NaN is equal to itself, unlike in numeric equality.
    /// Note that double values can acquire error when operated upon, such that 
    /// an exact comparison between two values which
    /// are logically equal may fail. 
    /// </summary> 
    /// <returns>
    /// bool - true if the two Size instances are exactly equal, false otherwise 
    /// </returns>
    /// <param name='size1'>The first Size to compare</param>
    /// <param name='size2'>The second Size to compare</param>
//    public static bool 
	Size.Equals = function(/*Size*/ size1, /*Size*/ size2) 
    {
        if (size1.IsEmpty) 
        { 
            return size2.IsEmpty;
        } 
        else
        {
            return size1.Width.Equals(size2.Width) &&
                   size1.Height.Equals(size2.Height); 
        }
    };
	
	Size.Type = new Type("Size", Size, [Object.Type]);
	return Size;
});
//
////------------------------------------------------------------------------------ 
////Microsoft Avalon
////Copyright (c) Microsoft Corporation, 2001, 2002
////
////File: Size.cs 
////-----------------------------------------------------------------------------
//using System; 
//using System.ComponentModel; 
//using System.ComponentModel.Design.Serialization;
//using System.Reflection; 
//using System.Text;
//using System.Collections;
//using System.Globalization;
//using System.Windows; 
//using System.Windows.Media;
//using System.Runtime.InteropServices; 
//using MS.Internal.WindowsBase; 
//
//namespace System.Windows 
//{
///// <summary>
///// Size - A value type which defined a size in terms of non-negative width and height
///// </summary> 
//public partial struct Size
//{ 
//
//    /// <summary> 
//    /// Constructor which sets the size's initial values.  Width and Height must be non-negative
//    /// </summary>
//    /// <param name="width"> double - The initial Width </param>
//    /// <param name="height"> double - THe initial Height </param> 
//    public Size(double width, double height)
//    { 
//        if (width < 0 || height < 0) 
//        {
//            throw new System.ArgumentException(SR.Get(SRID.Size_WidthAndHeightCannotBeNegative)); 
//        }
//
//        _width = width;
//        _height = height; 
//    }
//
//    /// <summary>
//    /// Empty - a static property which provides an Empty size.  Width and Height are
//    /// negative-infinity.  This is the only situation 
//    /// where size can be negative.
//    /// </summary> 
//    public static Size Empty 
//    {
//        get 
//        {
//            return s_empty;
//        }
//    } 
//
//    /// <summary>
//    /// IsEmpty - this returns true if this size is the Empty size.
//    /// Note: If size is 0 this Size still contains a 0 or 1 dimensional set
//    /// of points, so this method should not be used to check for 0 area. 
//    /// </summary>
//    public bool IsEmpty 
//    { 
//        get
//        { 
//            return _width < 0;
//        }
//    }
//
//    /// <summary>
//    /// Width - Default is 0, must be non-negative 
//    /// </summary> 
//    public double Width
//    { 
//        get
//        {
//            return _width;
//        } 
//        set
//        { 
//            if (IsEmpty) 
//            {
//                throw new System.InvalidOperationException(SR.Get(SRID.Size_CannotModifyEmptySize)); 
//            }
//
//            if (value < 0)
//            { 
//                throw new System.ArgumentException(SR.Get(SRID.Size_WidthCannotBeNegative));
//            } 
//
//            _width = value;
//        } 
//    }
//
//    /// <summary>
//    /// Height - Default is 0, must be non-negative. 
//    /// </summary>
//    public double Height 
//    { 
//        get
//        { 
//            return _height;
//        }
//        set
//        { 
//            if (IsEmpty)
//            { 
//                throw new System.InvalidOperationException(SR.Get(SRID.Size_CannotModifyEmptySize)); 
//            }
//
//            if (value < 0)
//            {
//                throw new System.ArgumentException(SR.Get(SRID.Size_HeightCannotBeNegative));
//            } 
//
//            _height = value; 
//        } 
//    }
//
//    /// <summary>
//    /// Explicit conversion to Vector. 
//    /// </summary> 
//    /// <returns>
//    /// Vector - A Vector equal to this Size 
//    /// </returns>
//    /// <param name="size"> Size - the Size to convert to a Vector </param>
//    public static explicit operator Vector(Size size)
//    { 
//        return new Vector(size._width, size._height);
//    } 
//
//    /// <summary>
//    /// Explicit conversion to Point 
//    /// </summary>
//    /// <returns>
//    /// Point - A Point equal to this Size
//    /// </returns> 
//    /// <param name="size"> Size - the Size to convert to a Point </param>
//    public static explicit operator Point(Size size) 
//    { 
//        return new Point(size._width, size._height);
//    } 
//
//    static private Size CreateEmptySize() 
//    { 
//        Size size = new Size();
//        // We can't set these via the property setters because negatives widths 
//        // are rejected in those APIs.
//        size._width = Double.NegativeInfinity;
//        size._height = Double.NegativeInfinity;
//        return size; 
//    }
//
//    private readonly static Size s_empty = CreateEmptySize();


