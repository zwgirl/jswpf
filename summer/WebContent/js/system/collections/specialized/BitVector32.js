/**
 * BitVector32
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    /// <devdoc>
    ///    <para> 
    ///       Represents an section of the vector that can contain a integer number.</para> 
    /// </devdoc>
//    public struct
    var Section =declare(null, { 
        constructor:function(/*short*/ mask, /*short*/ offset) { 
            this.mask = mask;
            this.offset = offset; 
        }, 

//        public override bool 
        Equals:function(/*object*/ o) {
            if (o instanceof Section) 
                return o == this;
            else 
                return false; 
        },

//        public override int 
        GetHashCode:function() { 
            return base.GetHashCode();
        }, 

        /// <devdoc>
        /// </devdoc>
//        public static string 
        ToString:function(/*Section*/ value) { 
            
        }, 

        /// <devdoc>
        /// </devdoc> 
//        public override string 
        ToString:function() {
        	return "Section{0x" + Convert.ToString(this.Mask, 16) + ", 0x" + Convert.ToString(this.Offset, 16) + "}";
        }

    });
    
    Object.defineProperties(Section.prototype, {
//    	public short 
    	Mask: { 
            get:function() {
                return this.mask;
            }
        }, 

//        public short 
        Offset: { 
            get:function() { 
                return this.offset;
            } 
        }
    });
    
	var BitVector32 = declare("BitVector32", null,{
		constructor:function(par){
			if(par instanceof BitVector32){
				this.data = value.data;
			}else{
				this.data = par; 
			}
		},
        
        Get:function(bit) {
            return (this.data & bit) == bit; 
        },
        Set:function(bit, value) { 
            if (value) { 
            	this.data |= bit;
            } 
            else {
            	this.data &= ~bit;
            }
        },
        
        GetSection:function(section) {
            return ((data & (section.Mask << section.Offset)) >> section.Offset);
        }, 
        SetSection:function(section) {
            value <<= section.Offset;
            var offsetMask = (0xFFFF & section.Mask) << section.Offset;
            this.data = (this.data & ~offsetMask) | (value & offsetMask); 
        },
        
//        public override bool 
        Equals:function(/*object*/ o) { 
            if (!(o instanceof BitVector32)) {
                return false; 
            } 

            return data == o.data; 
        },

//        public override int 
        GetHashCode:function() {
            return base.GetHashCode(); 
        },
 
        /// <devdoc>
        /// </devdoc> 
//        public override string 
        ToString:function() {
            return BitVector32.ToString(this);
        }
	});
	
	Object.defineProperties(BitVector32.prototype,{
        /// <devdoc>
        ///    returns the raw data stored in this bit vector... 
        /// </devdoc>
//        public int 
        Data: {
            get:function() {
                return this.data; 
            }
        },
        
	});
	
//    private static short 
    function CountBitsSet(/*short*/ mask) {
    	 
        // yes, I know there are better algorithms, however, we know the
        // bits are always right aligned, with no holes (i.e. always 00000111,
        // never 000100011), so this is just fine...
        // 
        var value = 0;
        while ((mask & 0x1) != 0) { 
            value++; 
            mask >>= 1;
        } 
        return value;
    }

    /// <devdoc>
    ///     Creates the next mask in a series.
    /// </devdoc> 
//    public static int 
    BitVector32.CreateMask = function(/*int*/ previous) {
    	if(previous === undefined){
    		previous = 0;
    	}
        if (previous == 0) { 
            return 1; 
        }

        if (previous == 0x80000000) {
            throw new InvalidOperationException(SR.GetString(SR.BitVectorFull));
        }

        return previous << 1;
    };

    /// <devdoc>
    ///     Given a highValue, creates the mask 
    /// </devdoc>
//    private static short 
    function CreateMaskFromHighValue(/*short*/ highValue) {
        var required = 16;
        while ((highValue & 0x8000) == 0) { 
            required--;
            highValue <<= 1; 
        } 

        var value = 0; 
        while (required > 0) {
            required--;
            value <<= 1;
            value |= 0x1; 
        }

        return value; 
    }

    /// <devdoc>
    ///    <para>Creates the first section in a series, with the specified maximum value.</para>
    /// </devdoc>
//    public static Section 
    BitVector32.CreateSection = function(/*short*/ maxValue) { 
        return CreateSectionHelper(maxValue, 0, 0);
    };

    /// <devdoc>
    ///    <para>Creates the next section in a series, with the specified maximum value.</para> 
    /// </devdoc>
//    public static Section 
    BitVector32.CreateSection = function(/*short*/ maxValue, /*Section*/ previous) {
        return CreateSectionHelper(maxValue, previous.Mask, previous.Offset);
    };

//    private static Section 
    function CreateSectionHelper(/*short*/ maxValue, /*short*/ priorMask, /*short*/ priorOffset) { 
        if (maxValue < 1) { 
            throw new ArgumentException(SR.GetString(SR.Argument_InvalidValue, "maxValue", 0), "maxValue");
        } 

        var offset = (priorOffset + CountBitsSet(priorMask)); 
        if (offset >= 32) { 
            throw new InvalidOperationException(SR.GetString(SR.BitVectorFull));
        } 
        return new Section(CreateMaskFromHighValue(maxValue), offset);
    }
    
    /// <devdoc> 
    /// </devdoc>
//    public static string 
    BitVector32.ToString = function(/*BitVector32*/ value) { 
        /*StringBuilder*/var sb = new StringBuilder(/*"BitVector32{".Length*/12 + /*32 bits*/32 + /*"}".Length"*/1);
        sb.Append("BitVector32{");
        var locdata = value.data;
        for (var i=0; i<32; i++) { 
            if ((locdata & 0x80000000) != 0) {
                sb.Append("1"); 
            } else {
                sb.Append("0"); 
            }
            locdata <<= 1;
        }
        sb.Append("}"); 
        return sb.ToString();
    };
	
	BitVector32.Type = new Type("BitVector32", BitVector32, [Object.Type]);
	return BitVector32;
});

