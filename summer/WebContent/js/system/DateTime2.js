/**
 * DateTime
 */
// This value type represents a date and time.  Every DateTime
// object has a private field (Ticks) of type Int64 that stores the
// date and time as the number of 100 nanosecond intervals since
// 12:00 AM January 1, year 1 A.D. in the proleptic Gregorian Calendar. 
//
// Starting from V2.0, DateTime also stored some context about its time 
// zone in the form of a 3-state value representing Unspecified, Utc or 
// Local. This is stored in the two top bits of the 64-bit numeric value
// with the remainder of the bits storing the tick count. This information 
// is only used during time zone conversions and is not part of the
// identity of the DateTime. Thus, operations like Compare and Equals
// ignore this state. This is to stay compatible with earlier behavior
// and performance characteristics and to avoid forcing  people into dealing 
// with the effects of daylight savings. Note, that this has little effect
// on how the DateTime works except in a context where its specific time 
// zone is needed, such as during conversions and some parsing and formatting 
// cases.
// 
// There is also 4th state stored that is a special type of Local value that
// is used to avoid data loss when round-tripping between local and UTC time.
// See below for more information on this 4th state, although it is
// effectively hidden from most users, who just see the 3-state DateTimeKind 
// enumeration.
// 
// For compatability, DateTime does not serialize the Kind data when used in 
// binary serialization.
// 
// For a description of various calendar issues, look at
//
// Calendar Studies web site, at
// http://serendipity.nofadz.com/hermetic/cal_stud.htm. 
//
// 
define(["dojo/_base/declare", "system/Type", "system/IComparable", "system/IEquatable", "system/DateTimeKind"], 
		function(declare, Type, IComparable, IEquatable, DateTimeKind){
	// Number of 100ns ticks per time unit
//    private const long 
	var TicksPerMillisecond = 10000;
//    private const long 
	var TicksPerSecond = TicksPerMillisecond * 1000; 
//    private const long
	var TicksPerMinute = TicksPerSecond * 60;
//    private const long 
	var TicksPerHour = TicksPerMinute * 60; 
//    private const long 
	var TicksPerDay = TicksPerHour * 24; 

    // Number of milliseconds per time unit 
//    private const int 
	var MillisPerSecond = 1000;
//    private const int 
	var MillisPerMinute = MillisPerSecond * 60;
//    private const int 
	var MillisPerHour = MillisPerMinute * 60;
//    private const int 
	var MillisPerDay = MillisPerHour * 24; 

    // Number of days in a non-leap year 
//    private const int 
	var DaysPerYear = 365; 
    // Number of days in 4 years
//    private const int 
	var DaysPer4Years = DaysPerYear * 4 + 1;       // 1461 
    // Number of days in 100 years
//    private const int 
	var DaysPer100Years = DaysPer4Years * 25 - 1;  // 36524
    // Number of days in 400 years
//    private const int 
	var DaysPer400Years = DaysPer100Years * 4 + 1; // 146097 

    // Number of days from 1/1/0001 to 12/31/1600 
//    private const int 
	var DaysTo1601 = DaysPer400Years * 4;          // 584388 
    // Number of days from 1/1/0001 to 12/30/1899
//    private const int 
	var DaysTo1899 = DaysPer400Years * 4 + DaysPer100Years * 3 - 367; 
    // Number of days from 1/1/0001 to 12/31/9999
//    private const int 
    var DaysTo10000 = DaysPer400Years * 25 - 366;  // 3652059

//    internal const long 
    var MinTicks = 0; 
//    internal const long 
    var MaxTicks = DaysTo10000 * TicksPerDay - 1;
//    private const long 
    var MaxMillis = /*(long)*/DaysTo10000 * MillisPerDay; 

//    private const long 
    var FileTimeOffset = DaysTo1601 * TicksPerDay;
//    private const long 
    var DoubleDateOffset = DaysTo1899 * TicksPerDay; 
    // The minimum OA date is 0100/01/01 (Note it's year 100).
    // The maximum OA date is 9999/12/31
//    private const long 
    var OADateMinAsTicks = (DaysPer100Years - DaysPerYear) * TicksPerDay;
    // All OA dates must be greater than (not >=) OADateMinAsDouble 
//    private const double 
    var OADateMinAsDouble = -657435.0;
    // All OA dates must be less than (not <=) OADateMaxAsDouble 
//    private const double 
    var OADateMaxAsDouble = 2958466.0; 

//    private const int 
    var DatePartYear = 0; 
//    private const int 
    var DatePartDayOfYear = 1;
//    private const int 
    var DatePartMonth = 2;
//    private const int 
    var DatePartDay = 3;

//    private static readonly int[] 
    var DaysToMonth365 = [
        0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365]; 
//    private static readonly int[]
    var DaysToMonth366 = [
        0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];

//    private const UInt64 
    var TicksMask             = 0x3FFFFFFFFFFFFFFF; 
//    private const UInt64 FlagsMask             = 0xC000000000000000;
//    private const UInt64 
    var LocalMask             = 0x8000000000000000; 
//    private const Int64 
    var TicksCeiling           = 0x4000000000000000; 
//    private const UInt64 
    var KindUnspecified       = 0x0000000000000000;
//    private const UInt64 
    var KindUtc               = 0x4000000000000000; 
//    private const UInt64 
    var KindLocal             = 0x8000000000000000;
//    private const UInt64 
    var KindLocalAmbiguousDst = 0xC000000000000000;
//    private const Int32 
    var KindShift = 62;

//    private const String 
    var TicksField            = "ticks";
//    private const String 
    var DateDataField         = "dateData"; 
	var DateTime = declare("DateTime", IComparable,{
		constructor:function(){
			this.dateData = new Date().getTime();
		},
		
		// Constructs a DateTime from a tick count. The ticks 
        // argument specifies the date as the number of 100-nanosecond intervals
        // that have elapsed since 1/1/0001 12:00am.
        //
//        public DateTime(long ticks) { 
//            if (ticks < MinTicks || ticks > MaxTicks)
//                throw new ArgumentOutOfRangeException("ticks", Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadTicks")); 
//            dateData = (UInt64)ticks;
//        } 
//
//        private DateTime(UInt64 dateData) {
//            this.dateData = dateData;
//        } 
//
//        public DateTime(long ticks, DateTimeKind kind) { 
//            if (ticks < MinTicks || ticks > MaxTicks) { 
//                throw new ArgumentOutOfRangeException("ticks", Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadTicks"));
//            } 
//            if (kind < DateTimeKind.Unspecified || kind > DateTimeKind.Local) {
//                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidDateTimeKind"), "kind");
//            }
//            this.dateData = ((UInt64)ticks | ((UInt64)kind << KindShift));
//        } 
// 
//        internal DateTime(long ticks, DateTimeKind kind, Boolean isAmbiguousDst) {
//            if (ticks < MinTicks || ticks > MaxTicks) { 
//                throw new ArgumentOutOfRangeException("ticks", Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadTicks"));
//            }
//            dateData = ((UInt64)ticks | (isAmbiguousDst ? KindLocalAmbiguousDst : KindLocal));
//        } 
// 
//        // Constructs a DateTime from a given year, month, and day. The
//        // time-of-day of the resulting DateTime is always midnight. 
//        //
//        public DateTime(int year, int month, int day) {
//            this.dateData = (UInt64) DateToTicks(year, month, day);
//        } 
//
//        // Constructs a DateTime from a given year, month, and day for 
//        // the specified calendar. The 
//        // time-of-day of the resulting DateTime is always midnight.
//        // 
//        public DateTime(int year, int month, int day, Calendar calendar)
//            : this(year, month, day, 0, 0, 0, calendar) {
//        }
// 
//        // Constructs a DateTime from a given year, month, day, hour,
//        // minute, and second. 
//        // 
//        public DateTime(int year, int month, int day, int hour, int minute, int second) {
//            this.dateData = (UInt64)(DateToTicks(year, month, day) + TimeToTicks(hour, minute, second)); 
//        }
//
//        public DateTime(int year, int month, int day, int hour, int minute, int second, DateTimeKind kind) {
//            if (kind < DateTimeKind.Unspecified || kind > DateTimeKind.Local) { 
//                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidDateTimeKind"), "kind");
//            } 
//            Int64 ticks = DateToTicks(year, month, day) + TimeToTicks(hour, minute, second);
//            this.dateData = ((UInt64)ticks | ((UInt64)kind << KindShift)); 
//        }
//
//        // Constructs a DateTime from a given year, month, day, hour,
//        // minute, and second for the specified calendar. 
//        //
//        public DateTime(int year, int month, int day, int hour, int minute, int second, Calendar calendar) { 
//            if (calendar == null) 
//                throw new ArgumentNullException("calendar");
//            this.dateData = (UInt64)calendar.ToDateTime(year, month, day, hour, minute, second, 0).Ticks;
//        }
//
//        // Constructs a DateTime from a given year, month, day, hour, 
//        // minute, and second.
//        // 
//        public DateTime(int year, int month, int day, int hour, int minute, int second, int millisecond) { 
//            if (millisecond < 0 || millisecond >= MillisPerSecond) {
//                throw new ArgumentOutOfRangeException("millisecond", Environment.GetResourceString("ArgumentOutOfRange_Range", 0, MillisPerSecond - 1)); 
//            }
//            Int64 ticks = DateToTicks(year, month, day) + TimeToTicks(hour, minute, second);
//            ticks += millisecond * TicksPerMillisecond; 
//            if (ticks < MinTicks || ticks > MaxTicks)
//                throw new ArgumentException(Environment.GetResourceString("Arg_DateTimeRange")); 
//            this.dateData = (UInt64)ticks; 
//        }
// 
//        public DateTime(int year, int month, int day, int hour, int minute, int second, int millisecond, DateTimeKind kind) {
//            if (millisecond < 0 || millisecond >= MillisPerSecond) {
//                throw new ArgumentOutOfRangeException("millisecond", Environment.GetResourceString("ArgumentOutOfRange_Range", 0, MillisPerSecond - 1));
//            } 
//            if (kind < DateTimeKind.Unspecified || kind > DateTimeKind.Local) {
//                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidDateTimeKind"), "kind"); 
//            } 
//            Int64 ticks = DateToTicks(year, month, day) + TimeToTicks(hour, minute, second); 
//            ticks += millisecond * TicksPerMillisecond;
//            if (ticks < MinTicks || ticks > MaxTicks)
//                throw new ArgumentException(Environment.GetResourceString("Arg_DateTimeRange"));
//            this.dateData = ((UInt64)ticks | ((UInt64)kind << KindShift)); 
//        }
// 
//        // Constructs a DateTime from a given year, month, day, hour, 
//        // minute, and second for the specified calendar.
//        // 
//        public DateTime(int year, int month, int day, int hour, int minute, int second, int millisecond, Calendar calendar) {
//            if (calendar == null)
//                throw new ArgumentNullException("calendar");
//            if (millisecond < 0 || millisecond >= MillisPerSecond) { 
//                throw new ArgumentOutOfRangeException("millisecond", Environment.GetResourceString("ArgumentOutOfRange_Range", 0, MillisPerSecond - 1));
//            } 
//            Int64 ticks = calendar.ToDateTime(year, month, day, hour, minute, second, 0).Ticks;
//            ticks += millisecond * TicksPerMillisecond; 
//            if (ticks < MinTicks || ticks > MaxTicks)
//                throw new ArgumentException(Environment.GetResourceString("Arg_DateTimeRange"));
//            this.dateData = (UInt64)ticks;
//        } 
//
//        public DateTime(int year, int month, int day, int hour, int minute, int second, int millisecond, Calendar calendar, DateTimeKind kind) { 
//            if (calendar == null) 
//                throw new ArgumentNullException("calendar");
//            if (millisecond < 0 || millisecond >= MillisPerSecond) { 
//                throw new ArgumentOutOfRangeException("millisecond", Environment.GetResourceString("ArgumentOutOfRange_Range", 0, MillisPerSecond - 1));
//            }
//            if (kind < DateTimeKind.Unspecified || kind > DateTimeKind.Local) {
//                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidDateTimeKind"), "kind"); 
//            }
//            Int64 ticks = calendar.ToDateTime(year, month, day, hour, minute, second, 0).Ticks; 
//            ticks += millisecond * TicksPerMillisecond;
//            if (ticks < MinTicks || ticks > MaxTicks) 
//                throw new ArgumentException(Environment.GetResourceString("Arg_DateTimeRange"));
//            this.dateData = ((UInt64)ticks | ((UInt64)kind << KindShift));
//        }
		// Returns the DateTime resulting from adding the given
        // TimeSpan to this DateTime. 
        // 
//        public DateTime 
		Add:function(/*TimeSpan*/ value) {
            return AddTicks(value._ticks); 
        },

        // Returns the DateTime resulting from adding a fractional number of
        // time units to this DateTime. 
//        private DateTime 
        Add:function(/*double*/ value, /*int*/ scale) {
            var millis = Math.floor((value * scale + (value >= 0? 0.5: -0.5))); 
            if (millis <= -MaxMillis || millis >= MaxMillis) 
                throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_AddValue"));
            return AddTicks(millis * TicksPerMillisecond); 
        },

        // Returns the DateTime resulting from adding a fractional number of
        // days to this DateTime. The result is computed by rounding the 
        // fractional number of days given by value to the nearest
        // millisecond, and adding that interval to this DateTime. The 
        // value argument is permitted to be negative. 
        //
//        public DateTime 
        AddDays:function(/*double*/ value) { 
            return Add(value, MillisPerDay);
        },

        // Returns the DateTime resulting from adding a fractional number of 
        // hours to this DateTime. The result is computed by rounding the
        // fractional number of hours given by value to the nearest 
        // millisecond, and adding that interval to this DateTime. The 
        // value argument is permitted to be negative.
        // 
//        public DateTime 
        AddHours:function(/*double*/ value) {
            return Add(value, MillisPerHour);
        },
 
        // Returns the DateTime resulting from the given number of
        // milliseconds to this DateTime. The result is computed by rounding 
        // the number of milliseconds given by value to the nearest integer, 
        // and adding that interval to this DateTime. The value
        // argument is permitted to be negative. 
        //
//        public DateTime 
        AddMilliseconds:function(/*double*/ value) {
            return Add(value, 1);
        }, 

        // Returns the DateTime resulting from adding a fractional number of 
        // minutes to this DateTime. The result is computed by rounding the 
        // fractional number of minutes given by value to the nearest
        // millisecond, and adding that interval to this DateTime. The 
        // value argument is permitted to be negative.
        //
//        public DateTime 
        AddMinutes:function(/*double*/ value) {
            return Add(value, MillisPerMinute); 
        },
 
        // Returns the DateTime resulting from adding the given number of 
        // months to this DateTime. The result is computed by incrementing
        // (or decrementing) the year and month parts of this DateTime by 
        // months months, and, if required, adjusting the day part of the
        // resulting date downwards to the last day of the resulting month in the
        // resulting year. The time-of-day part of the result is the same as the
        // time-of-day part of this DateTime. 
        //
        // In more precise terms, considering this DateTime to be of the 
        // form y / m / d + t, where y is the 
        // year, m is the month, d is the day, and t is the
        // time-of-day, the result is y1 / m1 / d1 + t, 
        // where y1 and m1 are computed by adding months months
        // to y and m, and d1 is the largest value less than
        // or equal to d that denotes a valid day in month m1 of year
        // y1. 
        //
//        public DateTime 
        AddMonths:function(/*int*/ months) { 
            if (months < -120000 || months > 120000) throw new ArgumentOutOfRangeException("months", Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadMonths")); 
            var y = GetDatePart(DatePartYear); 
            var m = GetDatePart(DatePartMonth);
            var d = GetDatePart(DatePartDay);
            var i = m - 1 + months;
            if (i >= 0) { 
                m = i % 12 + 1;
                y = y + i / 12; 
            } 
            else {
                m = 12 + (i + 1) % 12; 
                y = y + (i - 11) / 12;
            }
            if (y < 1 || y > 9999) {
                throw new ArgumentOutOfRangeException("months", Environment.GetResourceString("ArgumentOutOfRange_DateArithmetic")); 
            }
            var days = DaysInMonth(y, m); 
            if (d > days) d = days; 
            return new DateTime((DateToTicks(y, m, d) + InternalTicks % TicksPerDay) | InternalKind);
        }, 

        // Returns the DateTime resulting from adding a fractional number of
        // seconds to this DateTime. The result is computed by rounding the
        // fractional number of seconds given by value to the nearest 
        // millisecond, and adding that interval to this DateTime. The
        // value argument is permitted to be negative. 
        // 
//        public DateTime 
        AddSeconds:function(/*double*/ value) {
            return Add(value, MillisPerSecond); 
        },

        // Returns the DateTime resulting from adding the given number of
        // 100-nanosecond ticks to this DateTime. The value argument 
        // is permitted to be negative.
        // 
//        public DateTime
        AddTicks:function(/*long*/ value) { 
        	var ticks = InternalTicks;
            if (value > MaxTicks - ticks || value < MinTicks - ticks) { 
                throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_DateArithmetic"));
            }
            return new DateTime((ticks + value) | InternalKind);
        }, 

        // Returns the DateTime resulting from adding the given number of 
        // years to this DateTime. The result is computed by incrementing 
        // (or decrementing) the year part of this DateTime by value
        // years. If the month and day of this DateTime is 2/29, and if the 
        // resulting year is not a leap year, the month and day of the resulting
        // DateTime becomes 2/28. Otherwise, the month, day, and time-of-day
        // parts of the result are the same as those of this DateTime.
        // 
//        public DateTime 
        AddYears:function(/*int*/ value) {
            if (value < -10000 || value > 10000) throw new ArgumentOutOfRangeException("years", Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadYears")); 
            return AddMonths(value * 12);
        },
        
     // Compares this DateTime to a given object. This method provides an 
        // implementation of the IComparable interface. The object
        // argument must be another DateTime, or otherwise an exception 
        // occurs.  Null is considered less than any instance. 
        //
        // Returns a value less than zero if this  object 
//        public int 
        CompareTo:function(/*Object*/ value) {
            if (value == null) return 1;
            if (!(value instanceof DateTime)) {
                throw new ArgumentException(Environment.GetResourceString("Arg_MustBeDateTime")); 
            }
 
            var valueTicks = value.InternalTicks; 
            var ticks = InternalTicks;
            if (ticks > valueTicks) return 1; 
            if (ticks < valueTicks) return -1;
            return 0;
        },
 
//        public int 
        CompareTo:function(/*DateTime*/ value) {
        	var valueTicks = value.InternalTicks; 
        	var ticks = InternalTicks; 
            if (ticks > valueTicks) return 1;
            if (ticks < valueTicks) return -1; 
            return 0;
        },
 
        // Checks if this DateTime is equal to a given object. Returns 
        // true if the given object is a boxed DateTime and its value
        // is equal to the value of this DateTime. Returns false 
        // otherwise.
        //
//        public override bool 
        Equals:function(/*Object*/ value) {
            if (value instanceof DateTime) { 
                return InternalTicks == (value).InternalTicks;
            } 
            return false; 
        },

//        public Boolean 
        IsDaylightSavingTime:function() { 
            if (this.Kind == DateTimeKind.Utc) { 
                return false;
            } 
            return TimeZoneInfo.Local.IsDaylightSavingTime(this, TimeZoneInfoOptions.NoThrowOnInvalidTime);
        },

//        public Int64 
        ToBinary:function() {
            if (this.Kind == DateTimeKind.Local) {
                // Local times need to be adjusted as you move from one time zone to another, 
                // just as they are when serializing in text. As such the format for local times
                // changes to store the ticks of the UTC time, but with flags that look like a 
                // local date. 

                // To match serialization in text we need to be able to handle cases where 
                // the UTC value would be out of range. Unused parts of the ticks range are
                // used for this, so that values just past max value are stored just past the
                // end of the maximum range, and values just below minimum value are stored
                // at the end of the ticks area, just below 2^62. 
            	var offset = TimeZoneInfo.GetLocalUtcOffset(this, TimeZoneInfoOptions.NoThrowOnInvalidTime);
            	var ticks = Ticks; 
            	var storedTicks = ticks - offset.Ticks; 
                if (storedTicks < 0) {
                    storedTicks = TicksCeiling + storedTicks; 
                }
                return storedTicks | LocalMask;
            }
            else { 
                return dateData;
            } 
        }, 

        // Return the underlying data, without adjust local times to the right time zone. Needed if performance 
        // or compatability are important.
//        internal Int64 
        ToBinaryRaw:function() {
            return /*(Int64)*/dateData; 
        },
        
     // Returns a given date part of this DateTime. This method is used
        // to compute the year, day-of-year, month, or day part. 
//        private int 
        GetDatePart:function(/*int*/ part) { 
            var ticks = this.InternalTicks;
            // n = number of days since 1/1/0001 
            var n = Math.floor((ticks / TicksPerDay));
            // y400 = number of whole 400-year periods since 1/1/0001
            var y400 = n / DaysPer400Years;
            // n = day number within 400-year period 
            n -= y400 * DaysPer400Years;
            // y100 = number of whole 100-year periods within 400-year period 
            var y100 = n / DaysPer100Years; 
            // Last 100-year period has an extra day, so decrement result if 4
            if (y100 == 4) y100 = 3; 
            // n = day number within 100-year period
            n -= y100 * DaysPer100Years;
            // y4 = number of whole 4-year periods within 100-year period
            var y4 = n / DaysPer4Years; 
            // n = day number within 4-year period
            n -= y4 * DaysPer4Years; 
            // y1 = number of whole years within 4-year period 
            var y1 = n / DaysPerYear;
            // Last year has an extra day, so decrement result if 4 
            if (y1 == 4) y1 = 3;
            // If year was requested, compute and return it
            if (part == DatePartYear) {
                return y400 * 400 + y100 * 100 + y4 * 4 + y1 + 1; 
            }
            // n = day number within year 
            n -= y1 * DaysPerYear; 
            // If day-of-year was requested, return it
            if (part == DatePartDayOfYear) return n + 1; 
            // Leap year calculation looks different from IsLeapYear since y1, y4,
            // and y100 are relative to year 1, not year 0
            var leapYear = y1 == 3 && (y4 != 24 || y100 == 3);
            /*int[]*/var days = leapYear? DaysToMonth366: DaysToMonth365; 
            // All months have less than 32 days, so n >> 5 is a good conservative
            // estimate for the month 
            var m = n >> 5 + 1; 
            // m = 1-based month number
            while (n >= days[m]) m++; 
            // If month was requested, return it
            if (part == DatePartMonth) return m;
            // Return 1-based day-of-month
            return n - days[m - 1] + 1; 
        },
 
       

        // Returns the hash code for this DateTime. 
        //
//        public override int 
        GetHashCode:function() {
            /*Int64*/var ticks = this.InternalTicks; 
            return /*unchecked((int)*/ticks ^ /*(int)*/(ticks >> 32); 
        },
        
//        internal Boolean 
        IsAmbiguousDaylightSavingTime:function() { 
            return (InternalKind == KindLocalAmbiguousDst); 
        },
        
//        public TimeSpan 
        Subtract:function(/*DateTime*/ value) {
            return new TimeSpan(InternalTicks - value.InternalTicks);
        },
 
//        public DateTime 
        Subtract:function(/*TimeSpan*/ value) {
        	var ticks = InternalTicks; 
        	var valueTicks = value._ticks; 
            if (ticks - MinTicks < valueTicks || ticks - MaxTicks > valueTicks) {
                throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_DateArithmetic")); 
            }
            return new DateTime((ticks - valueTicks) | InternalKind);
        },
        
        // Converts the DateTime instance into an OLE Automation compatible
        // double date. 
//        public double 
        ToOADate:function() { 
            return TicksToOADate(InternalTicks);
        }, 

//        public long 
        ToFileTime:function() {
            // Treats the input as local if it is not specified
            return ToUniversalTime().ToFileTimeUtc(); 
        },
 
//        public long 
        ToFileTimeUtc:function() { 
            // Treats the input as universal if it is not specified
        	var ticks = ((InternalKind & LocalMask) != 0) ? ToUniversalTime().InternalTicks : this.InternalTicks; 
            ticks -= FileTimeOffset;
            if (ticks < 0) {
                throw new ArgumentOutOfRangeException(null, Environment.GetResourceString("ArgumentOutOfRange_FileTimeInvalid"));
            } 
            return ticks;
        }, 
 
//        public DateTime 
        ToLocalTime:function()
        { 
            return ToLocalTime(false);
        },

//        internal DateTime 
        ToLocalTime:function(/*bool*/ throwOnOverflow) 
        {
            if (Kind == DateTimeKind.Local) { 
                return this; 
            }
            var isDaylightSavings = false; 
            var isAmbiguousLocalDst = false;
            var offset = TimeZoneInfo.GetUtcOffsetFromUtc(this, TimeZoneInfo.Local, 
            		/*out isDaylightSavings*/isDaylightSavings, /*out isAmbiguousLocalDst*/isAmbiguousLocalDstOut).Ticks;
            var tick = Ticks + offset;
            if (tick > DateTime.MaxTicks) 
            {
                if (throwOnOverflow) 
                    throw new ArgumentException(Environment.GetResourceString("Arg_ArgumentOutOfRangeException")); 
                else
                    return new DateTime(DateTime.MaxTicks, DateTimeKind.Local); 
            }
            if (tick < DateTime.MinTicks)
            {
                if (throwOnOverflow) 
                    throw new ArgumentException(Environment.GetResourceString("Arg_ArgumentOutOfRangeException"));
                else 
                    return new DateTime(DateTime.MinTicks, DateTimeKind.Local); 
            }
            return new DateTime(tick, DateTimeKind.Local, isAmbiguousLocalDst); 
        },

//        public String 
        ToLongDateString:function() {
            return DateTimeFormat.Format(this, "D", DateTimeFormatInfo.CurrentInfo);
        }, 
 
//        public String 
        ToLongTimeString:function() {
            return DateTimeFormat.Format(this, "T", DateTimeFormatInfo.CurrentInfo);
        },

//        public String 
        ToShortDateString:function() { 
            return DateTimeFormat.Format(this, "d", DateTimeFormatInfo.CurrentInfo); 
        }, 

//        public String 
        ToShortTimeString:function() { 
            return DateTimeFormat.Format(this, "t", DateTimeFormatInfo.CurrentInfo);
        },
 
//        public override String 
        ToString:function() {
            return DateTimeFormat.Format(this, null, DateTimeFormatInfo.CurrentInfo); 
        },
 
//        public String 
        ToString:function(/*String*/ format) {
            return DateTimeFormat.Format(this, format, DateTimeFormatInfo.CurrentInfo);
        }, 

//        public String 
        ToString:function(/*IFormatProvider*/ provider) { 
            return DateTimeFormat.Format(this, null, DateTimeFormatInfo.GetInstance(provider));
        },
 
//        public String 
        ToString:function(/*String*/ format, /*IFormatProvider*/ provider) {
            return DateTimeFormat.Format(this, format, DateTimeFormatInfo.GetInstance(provider)); 
        },
 
//        public DateTime 
        ToUniversalTime:function() {
            return TimeZoneInfo.ConvertTimeToUtc(this, TimeZoneInfoOptions.NoThrowOnInvalidTime);
        },
        
        // Returns a string array containing all of the known date and time options for the
        // current culture.  The strings returned are properly formatted date and
        // time strings for the current instance of DateTime. 
//        public String[] 
        GetDateTimeFormats:function()
        { 
            return (GetDateTimeFormats(CultureInfo.CurrentCulture));
        }, 

        // Returns a string array containing all of the known date and time options for the
        // using the information provided by IFormatProvider.  The strings returned are properly formatted date and
        // time strings for the current instance of DateTime. 
//        public String[] 
        GetDateTimeFormats:function(/*IFormatProvider*/ provider)
        { 
            return (DateTimeFormat.GetAllDateTimes(this, DateTimeFormatInfo.GetInstance(provider)));
        },


        // Returns a string array containing all of the date and time options for the
        // given format format and current culture.  The strings returned are properly formatted date and 
        // time strings for the current instance of DateTime.
//        public String[] 
        GetDateTimeFormats:function(/*char*/ format) 
        { 
            return (GetDateTimeFormats(format, CultureInfo.CurrentCulture)); 
        },

        // Returns a string array containing all of the date and time options for the
        // given format format and given culture.  The strings returned are properly formatted date and 
        // time strings for the current instance of DateTime.
//        public String[] 
        GetDateTimeFormats:function(/*char*/ format, /*IFormatProvider*/ provider) 
        { 
            return (DateTimeFormat.GetAllDateTimes(this, format, DateTimeFormatInfo.GetInstance(provider))); 
        },

        //
        // IConvertible implementation 
        //
//        public TypeCode 
        GetTypeCode:function() {
            return TypeCode.DateTime;
        },
 

//        /// <internalonly/> 
////        bool IConvertible.
//        ToBoolean:function(/*IFormatProvider*/ provider) { 
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Boolean"));
//        } 
//
//        /// <internalonly/>
//        char IConvertible.ToChar(IFormatProvider provider) {
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Char")); 
//        }
// 
//        /// <internalonly/> 
//        sbyte IConvertible.ToSByte(IFormatProvider provider) {
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "SByte")); 
//        }
//
//        /// <internalonly/>
//        byte IConvertible.ToByte(IFormatProvider provider) { 
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Byte"));
//        } 
// 
//        /// <internalonly/>
//        short IConvertible.ToInt16(IFormatProvider provider) { 
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Int16"));
//        }
//
//        /// <internalonly/> 
//        ushort IConvertible.ToUInt16(IFormatProvider provider) {
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "UInt16")); 
//        } 
//
//        /// <internalonly/> 
//        int IConvertible.ToInt32(IFormatProvider provider) {
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Int32"));
//        }
// 
//        /// <internalonly/>
//        uint IConvertible.ToUInt32(IFormatProvider provider) { 
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "UInt32")); 
//        }
// 
//        /// <internalonly/>
//        long IConvertible.ToInt64(IFormatProvider provider) {
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Int64"));
//        } 
//
//        /// <internalonly/> 
//        ulong IConvertible.ToUInt64(IFormatProvider provider) { 
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "UInt64"));
//        } 
//
//        /// <internalonly/>
//        float IConvertible.ToSingle(IFormatProvider provider) {
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Single")); 
//        }
// 
//        /// <internalonly/> 
//        double IConvertible.ToDouble(IFormatProvider provider) {
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Double")); 
//        }
//
//        /// <internalonly/>
//        Decimal IConvertible.ToDecimal(IFormatProvider provider) { 
//            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Decimal"));
//        } 
 
//        DateTime IConvertible.
        ToDateTime:function(/*IFormatProvider*/ provider) {
            return this; 
        }
 
//        /// <internalonly/> 
//        Object IConvertible.ToType(Type type, IFormatProvider provider) {
//            return Convert.DefaultToType((IConvertible)this, type, provider); 
//        }
	});
	
	Object.defineProperties(DateTime.prototype,{
//		internal Int64 
		InternalTicks: {
            get:function() { 
                return (this.dateData & this.TicksMask);
            }
        },
 
//        private UInt64
        InternalKind: {
            get:function() { 
                return (this.dateData & this.FlagsMask);
            }
        },
        // Returns the date part of this DateTime. The resulting value 
        // corresponds to this DateTime with the time-of-day part set to
        // zero (midnight).
        //
//        public DateTime 
        Date: { 
            get:function() {
            	var ticks = this.InternalTicks; 
                return new DateTime((ticks - ticks % TicksPerDay) | this.InternalKind);
            }
        },
        // Returns the day-of-month part of this DateTime. The returned 
        // value is an integer between 1 and 31.
        // 
//        public int 
        Day: {
            get:function() {
                return this.GetDatePart(DatePartDay);
            } 
        }, 

        // Returns the day-of-week part of this DateTime. The returned value 
        // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates
        // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates
        // Thursday, 5 indicates Friday, and 6 indicates Saturday.
        // 
//        public DayOfWeek 
        DayOfWeek: {
            get:function() { 
                return ((this.InternalTicks / TicksPerDay + 1) % 7);
            } 
        },
 
        // Returns the day-of-year part of this DateTime. The returned value 
        // is an integer between 1 and 366.
        // 
//        public int 
        DayOfYear: {
            get:function() {
                return this.GetDatePart(DatePartDayOfYear);
            } 
        }, 
     // Returns the hour part of this DateTime. The returned value is an
        // integer between 0 and 23.
        //
//        public int 
        Hour: { 
            get:function() {
                return ((this.InternalTicks / TicksPerHour) % 24);
            }
        }, 
 
//        public DateTimeKind 
        Kind: {
            get:function() { 
                switch (this.InternalKind) { 
                    case KindUnspecified:
                        return DateTimeKind.Unspecified; 
                    case KindUtc:
                        return DateTimeKind.Utc;
                    default:
                        return DateTimeKind.Local; 
                }
            } 
        },

        // Returns the millisecond part of this DateTime. The returned value 
        // is an integer between 0 and 999.
        //
//        public int 
        Millisecond: {
            get:function() { 
                return /*(int)*/((this.InternalTicks/ TicksPerMillisecond) % 1000);
            }
        },
 
        // Returns the minute part of this DateTime. The returned value is
        // an integer between 0 and 59. 
        // 
//        public int 
        Minute: {
            get:function() {
                return /*(int)*/((this.InternalTicks / TicksPerMinute) % 60); 
            } 
        },
 
        // Returns the month part of this DateTime. The returned value is an
        // integer between 1 and 12.
        //
//        public int 
        Month: { 
            get:function() {
                return this.GetDatePart(DatePartMonth); 
            }
        },
        
     // Returns the second part of this DateTime. The returned value is
        // an integer between 0 and 59.
        // 
//        public int 
        Second: {
            get:function() { 
                return ((this.InternalTicks / TicksPerSecond) % 60);
            } 
        },
 
        // Returns the tick count for this DateTime. The returned value is 
        // the number of 100-nanosecond intervals that have elapsed since 1/1/0001
        // 12:00am. 
        //
//        public long 
        Ticks: {
            get:function() {
                return this.InternalTicks; 
            }
        }, 
 
        // Returns the time-of-day part of this DateTime. The returned value
        // is a TimeSpan that indicates the time elapsed since midnight. 
        //
//        public TimeSpan 
        TimeOfDay: {
            get:function() { 
                return new TimeSpan(this.InternalTicks % TicksPerDay); 
            }
        }, 
        // Returns the year part of this DateTime. The returned value is an 
        // integer between 1 and 9999. 
        //
//        public int 
        Year: { 
            get:function() {
                return this.GetDatePart(DatePartYear);
            } 
        }
	});
	
	Object.defineProperties(DateTime,{
		 // Returns a DateTime representing the current date and time. The
        // resolution of the returned value depends on the system timer. For
        // Windows NT 3.5 and later the timer resolution is approximately 10ms, 
        // for Windows NT 3.1 it is approximately 16ms, and for Windows 95 and 98
        // it is approximately 55ms. 
        // 
//        public static DateTime 
		Now: {
            get:function() { 

                /*DateTime*/var utc = DateTime.UtcNow;
                var isAmbiguousLocalDst = false; 
                /*Int64*/var offset = 0; //TimeZoneInfo.GetDateTimeNowUtcOffsetFromUtc(utc, /*out isAmbiguousLocalDst*/isAmbiguousLocalDstOut).Ticks;
                /*long*/var tick = utc.Ticks + offset; 
                if (tick>DateTime.MaxTicks) { 
                    return new DateTime(DateTime.MaxTicks, DateTimeKind.Local);
                } 
                if (tick<DateTime.MinTicks) {
                    return new DateTime(DateTime.MinTicks, DateTimeKind.Local);
                }
                return new DateTime(tick, DateTimeKind.Local, isAmbiguousLocalDst); 
            }
        }, 
 
//        public static DateTime 
		UtcNow: {
            get:function() { 
                // following code is tuned for speed. Don't change it without running benchmark. 
                var ticks = 0; 
                ticks = new Date().getTime(); //GetSystemTimeAsFileTime();
                return new DateTime( ((ticks + FileTimeOffset)) | KindUtc); 
            }
        },
        // Returns a DateTime representing the current date. The date part
        // of the returned value is the current date, and the time-of-day part of
        // the returned value is zero (midnight). 
        //
//        public static DateTime 
        Today: { 
            get:function() {
                return DateTime.Now.Date;
            }
        },
	});
	
    // Compares two DateTime values, returning an integer that indicates
    // their relationship.
    // 
//    public static int 
	DateTime.Compare = function(/*DateTime*/ t1, /*DateTime*/ t2) {
        var ticks1 = t1.InternalTicks; 
        var ticks2 = t2.InternalTicks; 
        if (ticks1 > ticks2) return 1;
        if (ticks1 < ticks2) return -1; 
        return 0;
    };
    
 // Returns the tick count corresponding to the given year, month, and day. 
    // Will check the if the parameters are valid.
//    private static long 
    function DateToTicks(/*int*/ year, /*int*/ month, /*int*/ day) { 
        if (year >= 1 && year <= 9999 && month >= 1 && month <= 12) { 
            /*int[]*/var days = IsLeapYear(year)? DaysToMonth366: DaysToMonth365;
            if (day >= 1 && day <= days[month] - days[month - 1]) { 
            	var y = year - 1;
            	var n = y * 365 + y / 4 - y / 100 + y / 400 + days[month - 1] + day - 1;
                return n * TicksPerDay;
            } 
        }
        throw new ArgumentOutOfRangeException(null, Environment.GetResourceString("ArgumentOutOfRange_BadYearMonthDay")); 
    } 

    // Return the tick count corresponding to the given hour, minute, second. 
    // Will check the if the parameters are valid.
//    private static long 
    function TimeToTicks(/*int*/ hour, /*int*/ minute, /*int*/ second)
    {
        //TimeSpan.TimeToTicks is a family access function which does no error checking, so 
        //we need to put some error checking out here.
        if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >=0 && second < 60) 
        { 
            return (TimeSpan.TimeToTicks(hour, minute, second));
        } 
        throw new ArgumentOutOfRangeException(null, Environment.GetResourceString("ArgumentOutOfRange_BadHourMinuteSecond"));
    }

    // Returns the number of days in the month given by the year and 
    // month arguments.
    // 
//    public static int 
    DaysInMonth = function(/*int*/ year, /*int*/ month) { 
        if (month < 1 || month > 12) throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Month"));
        // IsLeapYear checks the year argument
        /*int[]*/var days = IsLeapYear(year)? DaysToMonth366: DaysToMonth365;
        return days[month] - days[month - 1];
    }; 

    // Converts an OLE Date to a tick count. 
    // This function is duplicated in COMDateTime.cpp 
//    internal static long 
    DoubleDateToTicks = function(/*double*/ value) {
        if (value >= OADateMaxAsDouble || value <= OADateMinAsDouble) 
            throw new ArgumentException(Environment.GetResourceString("Arg_OleAutDateInvalid"));
        var millis = (long)(value * MillisPerDay + (value >= 0? 0.5: -0.5));
        // The interesting thing here is when you have a value like 12.5 it all positive 12 days and 12 hours from 01/01/1899
        // However if you a value of -12.25 it is minus 12 days but still positive 6 hours, almost as though you meant -11.75 all negative 
        // This line below fixes up the millis in the negative case
        if (millis < 0) { 
            millis -= (millis % MillisPerDay) * 2; 
        }

        millis += DoubleDateOffset / TicksPerMillisecond;

        if (millis < 0 || millis >= MaxMillis) throw new ArgumentException(Environment.GetResourceString("Arg_OleAutDateScale"));
        return millis * TicksPerMillisecond; 
    };
    
    // Compares two DateTime values for equality. Returns true if
    // the two DateTime values are equal, or false if they are 
    // not equal. 
    //
//    public static bool 
    Equals = function(/*DateTime*/ t1, /*DateTime*/ t2) { 
        return t1.InternalTicks == t2.InternalTicks;
    };

//    public static DateTime 
    FromBinary = function(/*Int64*/ dateData) { 
        if ((dateData & (unchecked( LocalMask))) != 0) {
            // Local times need to be adjusted as you move from one time zone to another, 
            // just as they are when serializing in text. As such the format for local times 
            // changes to store the ticks of the UTC time, but with flags that look like a
            // local date. 
        	var ticks = dateData & (unchecked(TicksMask));
            // Negative ticks are stored in the top part of the range and should be converted back into a negative number
            if (ticks > TicksCeiling - TicksPerDay) {
                ticks = ticks - TicksCeiling; 
            }
            // Convert the ticks back to local. If the UTC ticks are out of range, we need to default to 
            // the UTC offset from MinValue and MaxValue to be consistent with Parse. 
            var isAmbiguousLocalDst = false;
            var offsetTicks; 
            if (ticks < MinTicks) {
                offsetTicks = TimeZoneInfo.GetLocalUtcOffset(DateTime.MinValue, TimeZoneInfoOptions.NoThrowOnInvalidTime).Ticks;
            }
            else if (ticks > MaxTicks) { 
                offsetTicks = TimeZoneInfo.GetLocalUtcOffset(DateTime.MaxValue, TimeZoneInfoOptions.NoThrowOnInvalidTime).Ticks;
            } 
            else { 
                // Because the ticks conversion between UTC and local is lossy, we need to capture whether the
                // time is in a repeated hour so that it can be passed to the DateTime constructor. 
                var utcDt = new DateTime(ticks, DateTimeKind.Utc);
                var isDaylightSavings = false;
                offsetTicks = TimeZoneInfo.GetUtcOffsetFromUtc(utcDt, TimeZoneInfo.Local,
                		/*out isDaylightSavings*/isDaylightSavingsOut, /*out isAmbiguousLocalDst*/isAmbiguousLocalDstOut).Ticks;
            } 
            ticks += offsetTicks;
            // Another behaviour of parsing is to cause small times to wrap around, so that they can be used 
            // to compare times of day 
            if (ticks < 0) {
                ticks += TicksPerDay; 
            }
            if (ticks < MinTicks || ticks > MaxTicks) {
                throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeBadBinaryData"), "dateData");
            } 
            return new DateTime(ticks, DateTimeKind.Local, isAmbiguousLocalDst);
        } 
        else { 
            return DateTime.FromBinaryRaw(dateData);
        } 
    };

    // A version of ToBinary that uses the real representation and does not adjust local times. This is needed for
    // scenarios where the serialized data must maintain compatability 
//    internal static DateTime 
    FromBinaryRaw = function(/*Int64*/ dateData) {
        var ticks = dateData & TicksMask; 
        if (ticks < MinTicks || ticks > MaxTicks) 
            throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeBadBinaryData"), "dateData");
        return new DateTime(dateData); 
    };

    // Creates a DateTime from a Windows filetime. A Windows filetime is
    // a long representing the date and time as the number of 
    // 100-nanosecond intervals that have elapsed since 1/1/1601 12:00am.
    // 
//    public static DateTime 
    FromFileTime = function(/*long*/ fileTime) { 
        return FromFileTimeUtc(fileTime).ToLocalTime();
    };

//    public static DateTime 
    FromFileTimeUtc = function(/*long*/ fileTime) {
        if (fileTime < 0 || fileTime > MaxTicks - FileTimeOffset) {
            throw new ArgumentOutOfRangeException("fileTime", Environment.GetResourceString("ArgumentOutOfRange_FileTimeInvalid")); 
        }

        // This is the ticks in Universal time for this fileTime.
        var universalTicks = fileTime + FileTimeOffset; 
        return new DateTime(universalTicks, DateTimeKind.Utc);
    };

    // Creates a DateTime from an OLE Automation Date. 
    //
//    public static DateTime 
    FromOADate = function(/*double*/ d) { 
        return new DateTime(DoubleDateToTicks(d), DateTimeKind.Unspecified); 
    };
    
//    public static DateTime 
    DateTime.SpecifyKind = function(/*DateTime*/ value, /*DateTimeKind*/ kind) { 
        return new DateTime(value.InternalTicks, kind);
    };
    
 // Checks whether a given year is a leap year. This method returns true if 
    // year is a leap year, or false if not.
    // 
//    public static bool 
    IsLeapYear = function(/*int*/ year) {
        if (year < 1 || year > 9999) {
            throw new ArgumentOutOfRangeException("year", Environment.GetResourceString("ArgumentOutOfRange_Year"));
        } 
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0); 
    };

    // Constructs a DateTime from a string. The string must specify a 
    // date and optionally a time in a culture-specific or universal format.
    // Leading and trailing whitespace characters are allowed.
    //
//    public static DateTime 
    Parse = function(/*String*/ s) { 
        return (DateTimeParse.Parse(s, DateTimeFormatInfo.CurrentInfo, DateTimeStyles.None));
    }; 

//    // Constructs a DateTime from a string. The string must specify a
//    // date and optionally a time in a culture-specific or universal format. 
//    // Leading and trailing whitespace characters are allowed.
//    //
//    public static DateTime Parse(String s, IFormatProvider provider) {
//        return (DateTimeParse.Parse(s, DateTimeFormatInfo.GetInstance(provider), DateTimeStyles.None)); 
//    }
//
//    public static DateTime Parse(String s, IFormatProvider provider, DateTimeStyles styles) { 
//        DateTimeFormatInfo.ValidateStyles(styles, "styles");
//        return (DateTimeParse.Parse(s, DateTimeFormatInfo.GetInstance(provider), styles)); 
//    }
//
//    // Constructs a DateTime from a string. The string must specify a
//    // date and optionally a time in a culture-specific or universal format. 
//    // Leading and trailing whitespace characters are allowed.
//    // 
//    public static DateTime ParseExact(String s, String format, IFormatProvider provider) { 
//        return (DateTimeParse.ParseExact(s, format, DateTimeFormatInfo.GetInstance(provider), DateTimeStyles.None));
//    } 
//
//    // Constructs a DateTime from a string. The string must specify a
//    // date and optionally a time in a culture-specific or universal format.
//    // Leading and trailing whitespace characters are allowed. 
//    //
//    public static DateTime ParseExact(String s, String format, IFormatProvider provider, DateTimeStyles style) { 
//        DateTimeFormatInfo.ValidateStyles(style, "style"); 
//        return (DateTimeParse.ParseExact(s, format, DateTimeFormatInfo.GetInstance(provider), style));
//    } 
//
//    public static DateTime ParseExact(String s, String[] formats, IFormatProvider provider, DateTimeStyles style) {
//        DateTimeFormatInfo.ValidateStyles(style, "style");
//        return DateTimeParse.ParseExactMultiple(s, formats, DateTimeFormatInfo.GetInstance(provider), style); 
//    }
    
 // This function is duplicated in COMDateTime.cpp
//    private static double 
    function TicksToOADate(/*long*/ value) { 
        if (value == 0) 
            return 0.0;  // Returns OleAut's zero'ed date value.
        if (value < TicksPerDay) // This is a fix for VB. They want the default day to be 1/1/0001 rathar then 12/30/1899. 
            value += DoubleDateOffset; // We could have moved this fix down but we would like to keep the bounds check.
        if (value < OADateMinAsTicks)
            throw new OverflowException(Environment.GetResourceString("Arg_OleAutDateInvalid"));
        // Currently, our max date == OA's max date (12/31/9999), so we don't 
        // need an overflow check in that direction.
        var millis = (value  - DoubleDateOffset) / TicksPerMillisecond; 
        if (millis < 0) { 
            var frac = millis % MillisPerDay;
            if (frac != 0) millis -= (MillisPerDay + frac) * 2; 
        }
        return millis / MillisPerDay;
    }
    
//    public static Boolean 
    TryParse = function(/*String*/ s, /*out DateTime result*/resultOut) {
        return DateTimeParse.TryParse(s, DateTimeFormatInfo.CurrentInfo, DateTimeStyles.None, /*out result*/resultOut); 
    }; 

//    public static Boolean TryParse(String s, IFormatProvider provider, DateTimeStyles styles, out DateTime result) { 
//        DateTimeFormatInfo.ValidateStyles(styles, "styles");
//        return DateTimeParse.TryParse(s, DateTimeFormatInfo.GetInstance(provider), styles, out result);
//    }
//
//    public static Boolean TryParseExact(String s, String format, IFormatProvider provider, DateTimeStyles style, out DateTime result) {
//        DateTimeFormatInfo.ValidateStyles(style, "style"); 
//        return DateTimeParse.TryParseExact(s, format, DateTimeFormatInfo.GetInstance(provider), style, out result); 
//    }
//
//    public static Boolean TryParseExact(String s, String[] formats, IFormatProvider provider, DateTimeStyles style, out DateTime result) {
//        DateTimeFormatInfo.ValidateStyles(style, "style");
//        return DateTimeParse.TryParseExactMultiple(s, formats, DateTimeFormatInfo.GetInstance(provider), style, out result);
//    }
    
    // Tries to construct a DateTime from a given year, month, day, hour,
    // minute, second and millisecond. 
    //
//    internal static Boolean 
    TryCreate = function(/*int*/ year, /*int*/ month, /*int*/ day, /*int*/ hour, /*int*/ minute, /*int*/ second, /*int*/ millisecond, /*out DateTime result*/resultOut) { 
        result = DateTime.MinValue; 
        if (year < 1 || year > 9999 || month < 1 || month > 12) {
            return false; 
        }
        /*int[]*/var days = IsLeapYear(year) ? DaysToMonth366 : DaysToMonth365;
        if (day < 1 || day > days[month] - days[month - 1]) {
            return false; 
        }
        if (hour < 0 || hour >= 24 || minute < 0 || minute >= 60 || second < 0 || second >= 60) { 
            return false; 
        }
        if (millisecond < 0 || millisecond >= MillisPerSecond) { 
            return false;
        }
        var ticks = DateToTicks(year, month, day) + TimeToTicks(hour, minute, second);

        ticks += millisecond * TicksPerMillisecond;
        if (ticks < MinTicks || ticks > MaxTicks) { 
            return false; 
        }
        result = new DateTime(ticks, DateTimeKind.Unspecified); 
        return true;
    };
    
//  public static readonly DateTime 
    DateTime.MinValue = new DateTime(MinTicks, DateTimeKind.Unspecified);
//    public static readonly DateTime 
    DateTime.MaxValue = new DateTime(MaxTicks, DateTimeKind.Unspecified);
	
	DateTime.Type = new Type("DateTime", DateTime, [IComparable.Type]);
	return DateTime;
});

    
//    public struct DateTime : IComparable, IFormattable, IConvertible, ISerializable, IComparable<DateTime>,IEquatable<DateTime> { 
//
//        
// 
//        // The data is stored as an unsigned 64-bit integeter
//        //   Bits 01-62: The value of 100-nanosecond ticks where 0 represents 1/1/0001 12:00am, up until the value 
//        //               12/31/9999 23:59:59.9999999
//        //   Bits 63-64: A four-state value that describes the DateTimeKind value of the date time, with a 2nd
//        //               value for the rare case where the date time is local, but is in an overlapped daylight
//        //               savings time hour and it is in daylight savings time. This allows distinction of these 
//        //               otherwise ambiguous local times and prevents data loss when round tripping from Local to
//        //               UTC time. 
//        private UInt64 dateData; 
//
//        internal static extern long GetSystemTimeAsFileTime(); 


