/**
 * TimeSpan
 */
// TimeSpan represents a duration of time.  A TimeSpan can be negative
// or positive. 
// 
// TimeSpan is internally represented as a number of milliseconds.  While
// this maps well into units of time such as hours and days, any 
// periods longer than that aren't representable in a nice fashion.
// For instance, a month can be between 28 and 31 days, while a year
// can contain 365 or 364 days.  A decade can have between 1 and 3 leapyears,
// depending on when you map the TimeSpan into the calendar.  This is why 
// we do not provide Years() or Months().
// 
// Note: System.TimeSpan needs to interop with the WinRT structure 
// type Windows::Foundation:TimeSpan. These types are currently binary-compatible in
// memory so no custom marshalling is required. If at any point the implementation 
// details of this type should change, or new fields added, we need to remember to add
// an appropriate custom ILMarshaler to keep WInRT interop scenarios enabled.
    //
define(["dojo/_base/declare", "system/Type", "system/IComparable"], 
		function(declare, Type, IComparable){
	
//	public const long    
	var TicksPerMillisecond =  10000;
//    public const long 
	var TicksPerSecond = TicksPerMillisecond * 1000;   // 10,000,000 
//    public const long 
	var TicksPerMinute = TicksPerSecond * 60;         // 600,000,000 
//    public const long 
	var TicksPerHour = TicksPerMinute * 60;        // 36,000,000,000
//    public const long 
	var TicksPerDay = TicksPerHour * 24;          // 864,000,000,000 
//    internal const long 
	var MaxSeconds = Number.MAX_INT / TicksPerSecond;
//    internal const long 
	var MinSeconds = Number.MIN_INT / TicksPerSecond; 

//    internal const long 
	var MaxMilliSeconds = Number.MAX_INT / TicksPerMillisecond; 
//    internal const long 
	var MinMilliSeconds = Number.MIN_INT / TicksPerMillisecond; 

//    internal const long 
	var TicksPerTenthSecond = TicksPerMillisecond * 100; 

//    private const double 
	var MillisecondsPerTick = 1.0 / TicksPerMillisecond;
//    private const double 
    var SecondsPerTick =  1.0 / TicksPerSecond;         // 0.0001
//    private const double 
    var MinutesPerTick = 1.0 / TicksPerMinute; // 1.6666666666667e-9
//    private const double 
    var HoursPerTick = 1.0 / TicksPerHour; // 2.77777777777777778e-11
//    private const double
    var DaysPerTick = 1.0 / TicksPerDay; // 1.1574074074074074074e-12

//    private const int 
    var MillisPerSecond = 1000; 
//    private const int
    var  MillisPerMinute = MillisPerSecond * 60; //     60,000
//    private const int 
    var MillisPerHour = MillisPerMinute * 60;   //  3,600,000 
//    private const int 
    var MillisPerDay = MillisPerHour * 24;      // 86,400,000
    
	var TimeSpan = declare("TimeSpan", IComparable,{
		constructor:function(/*int*/ days, /*int*/ hours, /*int*/ minutes, /*int*/ seconds, /*int*/ milliseconds){
			if(arguments.length == 1){
				this._ticks = days;
			}else if(arguments.length == 3){
				this._ticks = TimeToTicks(days, hours, minutes);
			}else if(arguments.length == 4){
				milliseconds = 0;
				var totalMilliSeconds = (days * 3600 * 24 + hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds; 
	            if (totalMilliSeconds > MaxMilliSeconds || totalMilliSeconds < MinMilliSeconds) 
	                throw new ArgumentOutOfRangeException(null, Environment.GetResourceString("Overflow_TimeSpanTooLong"));
	            this._ticks =  totalMilliSeconds * TicksPerMillisecond; 
			}else if(arguments.length == 5){
				var totalMilliSeconds = (days * 3600 * 24 + hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds; 
	            if (totalMilliSeconds > MaxMilliSeconds || totalMilliSeconds < MinMilliSeconds) 
	                throw new ArgumentOutOfRangeException(null, Environment.GetResourceString("Overflow_TimeSpanTooLong"));
	            this._ticks =  totalMilliSeconds * TicksPerMillisecond; 
			}
		},
		
//		public TimeSpan 
		Duration:function() { 
            if (this.Ticks==TimeSpan.MinValue.Ticks)
                throw new OverflowException(Environment.GetResourceString("Overflow_Duration")); 
            return new TimeSpan(this._ticks >= 0? this._ticks : -this._ticks);
        },

//        public override bool 
		Equals:function(/*Object*/ value) {
            if (value instanceof TimeSpan) {
                return _ticks == value._ticks; 
            }
            return false; 
        },
        // Returns a value less than zero if this  object 
//      public int 
        CompareTo:function(/*Object*/ value) {
        	if (value == null) return 1; 
        	if (!(value instanceof TimeSpan))
        		throw new ArgumentException(Environment.GetResourceString("Arg_MustBeTimeSpan"));
        	var t = value._ticks;
        	if (this._ticks > t) return 1; 
        	if (this._ticks < t) return -1;
        	return 0; 
        }
	});
	
	Object.defineProperties(TimeSpan.prototype,{
//		public long 
		Ticks: {
            get:function() { return this._ticks; } 
        },
 
//        public int 
		Days: { 
            get:function() { return (this._ticks / TicksPerDay); }
        }, 

//        public int 
		Hours: {
            get:function() { return ((this._ticks / TicksPerHour) % 24); }
        }, 

//        public int
		Milliseconds: { 
            get:function() { return ((this._ticks / TicksPerMillisecond) % 1000); } 
        },
 
//        public int 
		Minutes: {
            get:function() { return ((this._ticks / TicksPerMinute) % 60); }
        },
 
//        public int 
		Seconds: {
            get:function() { return ((this._ticks / TicksPerSecond) % 60); } 
        }, 

//        public double 
		TotalDays: { 
            get:function() { return (this._ticks) * DaysPerTick; }
        },

//        public double 
		TotalHours: { 
            get:function() { return this._ticks * HoursPerTick; }
        },
        
//        public double 
        TotalMilliseconds: {
            get:function() { 
                var temp = this._ticks * MillisecondsPerTick;
                if (temp > MaxMilliSeconds)
                    return MaxMilliSeconds;
 
                if (temp < MinMilliSeconds)
                    return MinMilliSeconds; 
 
                return temp;
            } 
        },

//        public double 
        TotalMinutes: {
            get:function() { return this._ticks * MinutesPerTick; } 
        },
 
//        public double 
        TotalSeconds: { 
            get:function() { return this._ticks * SecondsPerTick; }
        },
        
//        public override int 
        GetHashCode:function() { 
            return this._ticks ^ this._ticks >> 32;
        }
	});
	
	Object.defineProperties(TimeSpan,{
		  
	});
	


//    public static readonly TimeSpan.TimeSpan
	var Zero = new TimeSpan(0);

//    public static readonly TimeSpan.TimeSpan 
	
	var MaxValue = new TimeSpan(Number.MAX_INT); 
//    public static readonly TimeSpan.TimeSpan 
	
	var MinValue = new TimeSpan(Number.MAX_INT);
	
//	public TimeSpan 
	Add = function(/*TimeSpan*/ ts) {
        var result = this._ticks + ts._ticks; 
        // Overflow if signs of operands was identical and result's 
        // sign was opposite.
        // >> 63 gives the sign bit (either 64 1's or 64 0's). 
        if ((this._ticks >> 32 == ts._ticks >> 32) && (this._ticks >> 32 != result >> 32))
            throw new OverflowException(Environment.GetResourceString("Overflow_TimeSpanTooLong"));
        return new TimeSpan(result);
    };


    // Compares two TimeSpan values, returning an integer that indicates their 
    // relationship.
    // 
//    public static int 
    TimeSpan.Compare = function(/*TimeSpan*/ t1, /*TimeSpan*/ t2) {
        if (t1._ticks > t2._ticks) return 1;
        if (t1._ticks < t2._ticks) return -1;
        return 0; 
    };
    
//    public static bool 
    TimeSpan.Equals = function(/*TimeSpan*/ t1, /*TimeSpan*/ t2) {
        return t1._ticks == t2._ticks; 
    }; 

//    public static TimeSpan 
    TimeSpan.FromDays = function(/*double*/ value) { 
        return Interval(value, MillisPerDay);
    };
    
//    public static TimeSpan 
    TimeSpan.FromHours = function(/*double*/ value) { 
        return Interval(value, MillisPerHour);
    };

//    private static TimeSpan 
    Interval = function(/*double*/ value, /*int*/ scale) {
        if (Number.IsNaN(value)) 
            throw new ArgumentException(Environment.GetResourceString("Arg_CannotBeNaN"));
        var tmp = value * scale;
        var millis = tmp + (value >= 0? 0.5: -0.5); 
        if ((millis > Number.MAX_INT / TicksPerMillisecond) || (millis < Number.MIN_INT / TicksPerMillisecond))
            throw new OverflowException(Environment.GetResourceString("Overflow_TimeSpanTooLong")); 
        return new TimeSpan(millis * TicksPerMillisecond); 
    };

//    public static TimeSpan 
    TimeSpan.FromMilliseconds = function(/*double*/ value) {
        return Interval(value, 1);
    };

//    public static TimeSpan 
    TimeSpan.FromMinutes = function(/*double*/ value) {
        return Interval(value, MillisPerMinute); 
    };
	
	TimeSpan.Type = new Type("TimeSpan", TimeSpan, [IComparable.Type]);
	return TimeSpan;
});

//        // internal so that DateTime doesn't have to call an extra get 
//        // method for some arithmetic operations.
//        internal long _ticks; 
//
//        public TimeSpan Negate() { 
//            if (Ticks==TimeSpan.MinValue.Ticks)
//                throw new OverflowException(Environment.GetResourceString("Overflow_NegateTwosCompNum"));
//            Contract.EndContractBlock();
//            return new TimeSpan(-_ticks); 
//        }
//
//        public TimeSpan Subtract(TimeSpan ts) {
//            long result = _ticks - ts._ticks;
//            // Overflow if signs of operands was different and result's 
//            // sign was opposite from the first argument's sign.
//            // >> 63 gives the sign bit (either 64 1's or 64 0's). 
//            if ((_ticks >> 63 != ts._ticks >> 63) && (_ticks >> 63 != result >> 63)) 
//                throw new OverflowException(Environment.GetResourceString("Overflow_TimeSpanTooLong"));
//            return new TimeSpan(result); 
//        }
//        public static TimeSpan FromSeconds(double value) { 
//            return Interval(value, MillisPerSecond);
//        } 
//        public static TimeSpan FromTicks(long value) { 
//            return new TimeSpan(value); 
//        }
// 
//        internal static long TimeToTicks(int hour, int minute, int second) {
//            // totalSeconds is bounded by 2^31 * 2^12 + 2^31 * 2^8 + 2^31,
//            // which is less than 2^44, meaning we won't overflow totalSeconds.
//            long totalSeconds = (long)hour * 3600 + (long)minute * 60 + (long)second; 
//            if (totalSeconds > MaxSeconds || totalSeconds < MinSeconds)
//                throw new ArgumentOutOfRangeException(null, Environment.GetResourceString("Overflow_TimeSpanTooLong")); 
//            return totalSeconds * TicksPerSecond; 
//        }
// 
//        // See System.Globalization.TimeSpanParse and System.Globalization.TimeSpanFormat
//        public static TimeSpan Parse(String s) {
//            /* Constructs a TimeSpan from a string.  Leading and trailing white space characters are allowed. */ 
//            return TimeSpanParse.Parse(s, null);
//        } 
//        public static TimeSpan Parse(String input, IFormatProvider formatProvider) { 
//            return TimeSpanParse.Parse(input, formatProvider);
//        } 
//        public static TimeSpan ParseExact(String input, String format, IFormatProvider formatProvider) {
//            return TimeSpanParse.ParseExact(input, format, formatProvider, TimeSpanStyles.None);
//        }
//        public static TimeSpan ParseExact(String input, String[] formats, IFormatProvider formatProvider) { 
//            return TimeSpanParse.ParseExactMultiple(input, formats, formatProvider, TimeSpanStyles.None);
//        } 
//        public static TimeSpan ParseExact(String input, String format, IFormatProvider formatProvider, TimeSpanStyles styles) { 
//            TimeSpanParse.ValidateStyles(styles, "styles");
//            return TimeSpanParse.ParseExact(input, format, formatProvider, styles); 
//        }
//        public static TimeSpan ParseExact(String input, String[] formats, IFormatProvider formatProvider, TimeSpanStyles styles) {
//            TimeSpanParse.ValidateStyles(styles, "styles");
//            return TimeSpanParse.ParseExactMultiple(input, formats, formatProvider, styles); 
//        }
//        public static Boolean TryParse(String s, out TimeSpan result) { 
//            return TimeSpanParse.TryParse(s, null, out result); 
//        }
//        public static Boolean TryParse(String input, IFormatProvider formatProvider, out TimeSpan result) { 
//            return TimeSpanParse.TryParse(input, formatProvider, out result);
//        }
//        public static Boolean TryParseExact(String input, String format, IFormatProvider formatProvider, out TimeSpan result) {
//            return TimeSpanParse.TryParseExact(input, format, formatProvider, TimeSpanStyles.None, out result); 
//        }
//        public static Boolean TryParseExact(String input, String[] formats, IFormatProvider formatProvider, out TimeSpan result) { 
//            return TimeSpanParse.TryParseExactMultiple(input, formats, formatProvider, TimeSpanStyles.None, out result); 
//        }
//        public static Boolean TryParseExact(String input, String format, IFormatProvider formatProvider, TimeSpanStyles styles, out TimeSpan result) { 
//            TimeSpanParse.ValidateStyles(styles, "styles");
//            return TimeSpanParse.TryParseExact(input, format, formatProvider, styles, out result);
//        }
//        public static Boolean TryParseExact(String input, String[] formats, IFormatProvider formatProvider, TimeSpanStyles styles, out TimeSpan result) { 
//            TimeSpanParse.ValidateStyles(styles, "styles");
//            return TimeSpanParse.TryParseExactMultiple(input, formats, formatProvider, styles, out result); 
//        } 
//        public override String ToString() {
//            return TimeSpanFormat.Format(this, null, null); 
//        }
//        public String ToString(String format) {
//            return TimeSpanFormat.Format(this, format, null);
//        } 
//        public String ToString(String format, IFormatProvider formatProvider) {
//            if (LegacyMode) { 
//                return TimeSpanFormat.Format(this, null, null); 
//            }
//            else { 
//                return TimeSpanFormat.Format(this, format, formatProvider);
//            }
//        }
