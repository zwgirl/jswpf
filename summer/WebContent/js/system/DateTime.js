/**
 * DateTime
 */

define(["dojo/_base/declare", "system/Type", "system/IComparable", "system/IEquatable", "system/DateTimeKind"], 
		function(declare, Type, IComparable, IEquatable, DateTimeKind){

	var DateTime = declare("DateTime", Date,{
		constructor:function(){
			Date.apply(this, arguments); // call the "parent" constructor
		},
		
		// Return the number of days in the month
		GetDaysInMonth:function(utc) 
		{
	    	var m = utc ? this.getUTCMonth() : this.getMonth();
	    	// If feb.
	    	if (m == 1)
	    		return this.isLeapYear() ? 29 : 28;
	    	// If Apr, Jun, Sep or Nov return 30; otherwise 31
	    	return (m == 3 || m == 5 || m == 8 || m == 10) ? 30 : 31;
	  	},
	  	
	  	AddMonths:function (date, value) {
	  		var month = this.getMonth(); 
	  		this.setMonth(month + value); 
	  		return this; 
	  	},
	  	
	  	AddDays:function(days)
	  	{
	  		var date = this.getDate(); 
	  		this.setDate(date + value); 
	  		return this; 
	  	},
	  	
	  	GetDayOfWeek:function(){
	  		return this.getDay();
	  	},
	  	
	  	GetDayOfYear:function() {
	  		var onejan = new DateTime(this.getFullYear(),0,1);
	  		return Math.ceil((this - onejan) / 86400000);
		},

	    // Returns the DateTime resulting from adding a fractional number of 
	    // hours to this DateTime. The result is computed by rounding the
	    // fractional number of hours given by value to the nearest 
	    // millisecond, and adding that interval to this DateTime. The 
	    // value argument is permitted to be negative.
	    // 
		AddHours:function( value) {
			 this.setHours(this.getHours() + value);
			    return this;
	    },

	    // Returns the DateTime resulting from the given number of
	    // milliseconds to this DateTime. The result is computed by rounding 
	    // the number of milliseconds given by value to the nearest integer, 
	    // and adding that interval to this DateTime. The value
	    // argument is permitted to be negative. 
	    //
	    AddMilliseconds:function( value) {
	    	var millisecond = this.getMilliseconds(); 
	    	this.setMilliseconds(millisecond + value); 
	    	return this; 
	    }, 

	    // Returns the DateTime resulting from adding a fractional number of 
	    // minutes to this DateTime. The result is computed by rounding the 
	    // fractional number of minutes given by value to the nearest
	    // millisecond, and adding that interval to this DateTime. The 
	    // value argument is permitted to be negative.
	    //
	    AddMinutes:function(value) {
	    	var minute = this.addMinutes(); 
	    	this.setMinutes(minute + value); 
	    	return this; 
	    },

	    // Returns the DateTime resulting from adding a fractional number of
	    // seconds to this DateTime. The result is computed by rounding the
	    // fractional number of seconds given by value to the nearest 
	    // millisecond, and adding that interval to this DateTime. The
	    // value argument is permitted to be negative. 
	    // 
	    AddSeconds:function( value) {
	    	var second = this.getSeconds(); 
	    	this.setSeconds(second + value); 
	    	return this; 
	    },

	    // Returns the DateTime resulting from adding the given number of 
	    // years to this DateTime. The result is computed by incrementing 
	    // (or decrementing) the year part of this DateTime by value
	    // years. If the month and day of this DateTime is 2/29, and if the 
	    // resulting year is not a leap year, the month and day of the resulting
	    // DateTime becomes 2/28. Otherwise, the month, day, and time-of-day
	    // parts of the result are the same as those of this DateTime.
	    // 
	    AddYears:function( value) {
	        if (value < -10000 || value > 10000) throw new ArgumentOutOfRangeException("years", Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadYears")); 
	        return this.AddMonths(value * 12);
	    },
	    
//	    public boolean 
	    Equals:function(/*DateTime*/ value) {
	    	if(value instanceof DateTime){
	    		return this.getTime() == value.getTime();
	    	}
	        return false;
	    }
	});
	    
    Object.defineProperties(DateTime.prototype, {

//		internal Int64 
		Ticks: {
            get:function() { 
                return this.getTime();
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
                return this;
            }
        },
        // Returns the day-of-month part of this DateTime. The returned 
        // value is an integer between 1 and 31.
        // 
//        public int 
        Day: {
            get:function() {
                return this.getDate();
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
                return this.getDay();
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
                return this.getHours();
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
                return this.getMilliseconds();
            }
        },
 
        // Returns the minute part of this DateTime. The returned value is
        // an integer between 0 and 59. 
        // 
//        public int 
        Minute: {
            get:function() {
                return this.getMinutes(); 
            } 
        },
 
        // Returns the month part of this DateTime. The returned value is an
        // integer between 1 and 12.
        //
//        public int 
        Month: { 
            get:function() {
                return this.getMonth(); 
            }
        },
        
     // Returns the second part of this DateTime. The returned value is
        // an integer between 0 and 59.
        // 
//        public int 
        Second: {
            get:function() { 
                return this.getSeconds();
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
                return this.getYear();
            } 
        }
    });
    
    Object.defineProperties(DateTime, {
//    	public static DateTime 
    	UtcNow: {
            get:function() { 
                // following code is tuned for speed. Don't change it without running benchmark. 
                return new DateTime(); 
            }
        },
        
        // Returns a DateTime representing the current date. The date part
        // of the returned value is the current date, and the time-of-day part of
        // the returned value is zero (midnight). 
        //
//        public static DateTime 
        Today: { 
            get:function() {
                return new DateTime();
            }
        }
    });

    // Compares two DateTime values for equality. Returns true if
    // the two DateTime values are equal, or false if they are 
    // not equal. 
    //
//    public static boolean 
    DateTime.Equals = function(/*DateTime*/ t1, /*DateTime*/ t2) { 
        return t1.getTime() == t2.getTime();
    };
    
    // Checks whether a given year is a leap year. This method returns true if 
    // year is a leap year, or false if not.
    // 
//    public static boolean 
    DateTime.IsLeapYear = function(/*int*/ year) {
        if (year < 1 || year > 9999) {
            throw new ArgumentOutOfRangeException("year", Environment.GetResourceString("ArgumentOutOfRange_Year"));
        } 
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0); 
    };
    
//  private static readonly int[] 
    var DaysToMonth365 = [
        0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365]; 
//	    private static readonly int[]
    var DaysToMonth366 = [
        0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
    // Returns the number of days in the month given by the year and 
    // month arguments.
    // 
    DateTime.DaysInMonth = function(/*int*/ year, /*int*/ month) { 
        if (month < 1 || month > 12) throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Month"));
        // IsLeapYear checks the year argument
        var days = IsLeapYear(year)? DaysToMonth366: DaysToMonth365;
        return days[month] - days[month - 1];
    };
    
    
    DateTime.MinValue = new DateTime(-8640000000000000);
    DateTime.MaxValue = new DateTime(8640000000000000);
    
    DateTime.Type = new Type("DateTime" ,DateTime,[Date.Type]);
    return DateTime;
});

	    
