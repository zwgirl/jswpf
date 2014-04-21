/**
 * GregorianCalendar
 */

define(["dojo/_base/declare", "system/Type", "globalization/Calendar", "globalization/GregorianCalendarTypes"], 
		function(declare, Type, Calendar, GregorianCalendarTypes){
	
	// Number of 100ns (10E-7 second) ticks per time unit
//    internal const long 
	var TicksPerMillisecond   = 1; //10000;
//    internal const long 
	var TicksPerSecond        = TicksPerMillisecond * 1000;
//    internal const long 
	var TicksPerMinute        = TicksPerSecond * 60; 
//    internal const long 
	var TicksPerHour          = TicksPerMinute * 60;
//    internal const long 
	var TicksPerDay           = TicksPerHour * 24; 

    // Number of milliseconds per time unit
//    internal const int 
	var MillisPerSecond        = 1000; 
//    internal const int 
	var MillisPerMinute        = MillisPerSecond * 60;
//    internal const int 
	var MillisPerHour          = MillisPerMinute * 60;
//    internal const int 
	var MillisPerDay           = MillisPerHour * 24;

    // Number of days in a non-leap year
//    internal const int 
	var DaysPerYear            = 365; 
    // Number of days in 4 years 
//    internal const int 
	var DaysPer4Years          = DaysPerYear * 4 + 1;
    // Number of days in 100 years 
//    internal const int 
	var DaysPer100Years        = DaysPer4Years * 25 - 1;
    // Number of days in 400 years
//    internal const int 
	var DaysPer400Years        = DaysPer100Years * 4 + 1;

    // Number of days from 1/1/0001 to 1/1/10000
//    internal const int 
	var DaysTo10000            = DaysPer400Years * 25 - 366; 

//    internal const long 
	var MaxMillis             = DaysTo10000 * MillisPerDay;

    //
    //  Calendar ID Values.  This is used to get data from calendar.nlp.
    //  The order of calendar ID means the order of data items in the table.
    // 

//    internal const int 
	var CAL_GREGORIAN                  = 1 ;     // Gregorian (localized) calendar 
//    internal const int 
	var CAL_GREGORIAN_US               = 2 ;     // Gregorian (U.S.) calendar 
//    internal const int
	var CAL_JAPAN                      = 3 ;     // Japanese Emperor Era calendar
//    internal const int 
	var CAL_TAIWAN                     = 4 ;     // Taiwan Era calendar 
//    internal const int 
	var CAL_KOREA                      = 5 ;     // Korean Tangun Era calendar
//    internal const int 
	var CAL_HIJRI                      = 6 ;     // Hijri (Arabic Lunar) calendar
//    internal const int 
	var CAL_THAI                       = 7 ;     // Thai calendar
//    internal const int 
	var CAL_HEBREW                     = 8 ;     // Hebrew (Lunar) calendar 
//    internal const int 
	var CAL_GREGORIAN_ME_FRENCH        = 9 ;     // Gregorian Middle East French calendar
//    internal const int 
	var CAL_GREGORIAN_ARABIC           = 10;     // Gregorian Arabic calendar 
//    internal const int 
	var CAL_GREGORIAN_XLIT_ENGLISH     = 11;     // Gregorian Transliterated English calendar 
//    internal const int 
	var CAL_GREGORIAN_XLIT_FRENCH      = 12;
//    internal const int 
	var CAL_JULIAN                     = 13; 
//    internal const int 
	var CAL_JAPANESELUNISOLAR          = 14;
//    internal const int 
	var CAL_CHINESELUNISOLAR           = 15;
//    internal const int 
	var CAL_SAKA                       = 16;     // reserved to match Office but not implemented in our code
//    internal const int 
	var CAL_LUNAR_ETO_CHN              = 17;     // reserved to match Office but not implemented in our code 
//    internal const int 
	var CAL_LUNAR_ETO_KOR              = 18;     // reserved to match Office but not implemented in our code
//    internal const int 
	var CAL_LUNAR_ETO_ROKUYOU          = 19;     // reserved to match Office but not implemented in our code 
//    internal const int 
	var CAL_KOREANLUNISOLAR            = 20; 
//    internal const int 
	var CAL_TAIWANLUNISOLAR            = 21;
//    internal const int 
	var CAL_PERSIAN                    = 22; 
//    internal const int 
	var CAL_UMALQURA                   = 23;
    /*
    	A.D. = anno Domini
     */ 
//	 public const int 
	var ADEra = 1; 
	 

//     internal const int 
	var DatePartYear = 0; 
//     internal const int 
	var DatePartDayOfYear = 1;
//     internal const int 
	var DatePartMonth = 2;
//     internal const int 
	var DatePartDay = 3;

     //
     // This is the max Gregorian year can be represented by Date class.  The limitation 
     // is derived from Date class. 
     //
//     internal const int 
	var MaxYear = 9999; 
	
//	internal static readonly int[] 
	var DaysToMonth365 = 
    [
        0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365 
    ]; 

//    internal static readonly int[] 
	var DaysToMonth366 = 
    [
        0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366
    ];
	
//  public const int 
	var CurrentEra = 0; 

//    private static volatile Calendar 
	var s_defaultInstance = null;
	var GregorianCalendar = declare("GregorianCalendar", Calendar,{
		constructor:function(/*GregorianCalendarTypes*/ type){
			if(type === undefined){
				type = GregorianCalendarTypes.Localized;
			}
	        if (/*(int)*/type < /*(int)*/GregorianCalendarTypes.Localized || /*(int)*/type > /*(int)*/GregorianCalendarTypes.TransliteratedFrench) { 
	            throw new ArgumentOutOfRangeException(
	                        "type", 
	                        Environment.GetResourceString("ArgumentOutOfRange_Range",
	                GregorianCalendarTypes.Localized, GregorianCalendarTypes.TransliteratedFrench));
	        }
	        this.m_type = type;
		},
        
        // Returns the tick count corresponding to the given year, month, and day.
        // Will check the if the parameters are valid. 
//        internal virtual long 
        DateToTicks:function(/*int*/ year, /*int*/ month, /*int*/ day) {
            return new Date(year, month, day).getTime();
        },
 
        // Returns the Date resulting from adding the given number of
        // months to the specified Date. The result is computed by incrementing 
        // (or decrementing) the year and month parts of the specified Date by 
        // value months, and, if required, adjusting the day part of the
        // resulting date downwards to the last day of the resulting month in the 
        // resulting year. The time-of-day part of the result is the same as the
        // time-of-day part of the specified Date.
        //
        // In more precise terms, considering the specified Date to be of the 
        // form y / m / d + t, where y is the
        // year, m is the month, d is the day, and t is the 
        // time-of-day, the result is y1 / m1 / d1 + t, 
        // where y1 and m1 are computed by adding value months
        // to y and m, and d1 is the largest value less than 
        // or equal to d that denotes a valid day in month m1 of year
        // y1.
        //
 
//        public override Date 
        AddMonths:function(/*Date*/ time, /*int*/ months)
        { 
        	var result = new Date(time.getTime());
        	return result.AddMonths(months);
        }, 
 

        // Returns the Date resulting from adding the given number of 
        // years to the specified Date. The result is computed by incrementing
        // (or decrementing) the year part of the specified Date by value
        // years. If the month and day of the specified Date is 2/29, and if the
        // resulting year is not a leap year, the month and day of the resulting 
        // Date becomes 2/28. Otherwise, the month, day, and time-of-day
        // parts of the result are the same as those of the specified Date. 
        // 

//        public override Date 
        AddYears:function(/*Date*/ time, /*int*/ years) 
        {
            return this.AddMonths(time, years * 12);
        },
 
        // Returns the day-of-month part of the specified Date. The returned
        // value is an integer between 1 and 31. 
        // 

//        public override int 
        GetDayOfMonth:function(/*Date*/ time) 
        {
            return time.GetDayOfMonth();
        },
 
        // Returns the day-of-week part of the specified Date. The returned value
        // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates 
        // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates 
        // Thursday, 5 indicates Friday, and 6 indicates Saturday.
        // 

//        public override DayOfWeek 
        GetDayOfWeek:function(/*Date*/ time)
        {
            return time.GetDayOfWeek();
        },
 
        // Returns the day-of-year part of the specified Date. The returned value 
        // is an integer between 1 and 366.
        // 

//        public override int 
        GetDayOfYear:function(/*Date*/ time)
        {
        	return time.GetDayOfYear();
        },
 
        // Returns the number of days in the month given by the year and 
        // month arguments.
        // 

//        public override int 
        GetDaysInMonth:function(/*int*/ year, /*int*/ month, /*int*/ era) {
        	return new Date(year, month, 0, 0, 0, 0, 0).GetDaysInMonth();
        }, 
 
        // Returns the number of days in the year given by the year argument for the current era.
        // 

//        public override int 
        GetDaysInYear:function(/*int*/ year, /*int*/ era)
        {
            if (year >= 1 && year <= MaxYear) {
                return ((year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366:365); 
            } 
        },
 
        // Returns the era for the specified Date value.

//        public override int 
        GetEra:function(/*Date*/ time)
        { 
            return ADEra;
        },
     // Returns the month part of the specified Date. The returned value is an 
        // integer between 1 and 12.
        // 

//        public override int 
        GetMonth:function(/*Date*/ time)
        {
            return time.getMonth(); 
        },
 
        // Returns the number of months in the specified year and era. 

//        public override int 
        GetMonthsInYear:function(/*int*/ year, /*int*/ era) 
        {
            if (year >= 1 && year <= MaxYear)
            { 
                return 12;
            }  
        }, 

        // Returns the year part of the specified Date. The returned value is an 
        // integer between 1 and 9999.
        //

//        public override int 
        GetYear:function(/*Date*/ time) 
        {
            return time.getYear(); 
        }, 

        // Checks whether a given day in the specified era is a leap day. This method returns true if 
        // the date is a leap day, or false if not.
        //

//        public override bool 
        IsLeapDay:function(/*int*/ year, /*int*/ month, /*int*/ day, /*int*/ era) 
        {
         	if(era === undefined){
        		era = CurrentEra;
        	}
         	
            if (month < 1 || month > 12) { 
                throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Range", 
                    1, 12));
            } 

            if (era !== CurrentEra && era !== ADEra)
            { 
                throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
            } 
            if (year < 1 || year > MaxYear) { 
                throw new ArgumentOutOfRangeException(
                                "year", 
                                Environment.GetResourceString("ArgumentOutOfRange_Range", 1, MaxYear));
            }

            if (day < 1 || day > this.GetDaysInMonth(year, month)) { 
                throw new ArgumentOutOfRangeException("day", Environment.GetResourceString("ArgumentOutOfRange_Range",
                    1, GetDaysInMonth(year, month))); 
            } 
            if (!this.IsLeapYear(year)) {
                return false; 
            }
            if (month === 2 && day === 29) {
                return true;
            } 
            return false;
        },
 
        // Returns  the leap month in a calendar year of the specified era. This method returns 0
        // if this calendar does not have leap month, or this year is not a leap year. 
        //

//        public override int
        GetLeapMonth:function(/*int*/ year, /*int*/ era) 
        {
         	if(era === undefined){
        		era = CurrentEra;
        	}
            if (era !== CurrentEra && era !== ADEra) 
            { 
                throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
            } 
            if (year < 1 || year > MaxYear) {
                throw new ArgumentOutOfRangeException(
                            "year",
                            String.Format( 
                                CultureInfo.CurrentCulture,
                                Environment.GetResourceString("ArgumentOutOfRange_Range"), 1, MaxYear)); 
            } 
            return 0; 
        },

        // Checks whether a given month in the specified era is a leap month. This method returns true if
        // month is a leap month, or false if not. 
        //
 
//        public override bool 
        IsLeapMonth:function(/*int*/ year, /*int*/ month, /*int*/ era) 
        {
         	if(era === undefined){
        		era = CurrentEra;
        	}
            if (era !== CurrentEra && era !== ADEra) { 
                throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
            }

            if (year < 1 || year > MaxYear) { 
                throw new ArgumentOutOfRangeException(
                            "year", 
                            String.Format( 
                                CultureInfo.CurrentCulture,
                                Environment.GetResourceString("ArgumentOutOfRange_Range"), 1, MaxYear)); 
            }

            if (month < 1 || month > 12) {
                throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Range", 
                    1, 12));
            } 
            return (false);
 
        },

        // Checks whether a given year in the specified era is a leap year. This method returns true if
        // year is a leap year, or false if not. 
        //
 
//        public override bool 
        IsLeapYear:function(/*int*/ year, /*int*/ era) { 
         	if(era === undefined){
        		era = CurrentEra;
        	}
            if (era === CurrentEra || era === ADEra) {
                if (year >= 1 && year <= MaxYear) { 
                    return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
                }

                throw new ArgumentOutOfRangeException( 
                            "year",
                            String.Format( 
                                CultureInfo.CurrentCulture, 
                                Environment.GetResourceString("ArgumentOutOfRange_Range"), 1, MaxYear));
            } 
            throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
        },

        // Returns the date and time converted to a Date value.  Throws an exception if the n-tuple is invalid. 
        //
 
//        public override Date 
        ToDateTime:function(/*int*/ year, /*int*/ month, /*int*/ day, /*int*/ hour, /*int*/ minute, /*int*/ second, /*int*/ millisecond, /*int*/ era) 
        {
         	if(era === undefined){
        		era = CurrentEra;
        	}
            if (era === CurrentEra || era === ADEra) { 
                return new Date(year, month, day, hour, minute, second, millisecond);
            }
            throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
        }, 

//        internal override Boolean 
        TryToDateTime:function(/*int*/ year, /*int*/ month, /*int*/ day, /*int*/ hour, 
        		/*int*/ minute, /*int*/ second, /*int*/ millisecond, /*int*/ era, /*out Date result*/resultOut) { 
         	if(era === undefined){
        		era = CurrentEra;
        	}
            if (era === CurrentEra || era === ADEra) { 
                return Date.TryCreate(year, month, day, hour, minute, second, millisecond, /*out result*/resultOut);
            } 
            resultOut.result = Date.MinValue;
            return false;
        },
        
//        public override int 
        ToFourDigitYear:function(/*int*/ year) { 
            if (year < 0) {
                throw new ArgumentOutOfRangeException("year", 
                    Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
 
            if (year > MaxYear) {
                throw new ArgumentOutOfRangeException( 
                            "year", 
                            String.Format(
                                CultureInfo.CurrentCulture, 
                                Environment.GetResourceString("ArgumentOutOfRange_Range"), 1, MaxYear));
            }
            return Calendar.prototype.ToFourDigitYear.call(this, year);
        } 
        
	});
	
//	private const int 
	var DEFAULT_TWO_DIGIT_YEAR_MAX = 2029;
	
	Object.defineProperties(GregorianCalendar.prototype,{
//		public override Date 
		MinSupportedDateTime: 
        {
            get:function()
            {
                return Date.MinValue; 
            }
        }, 
 
//        public override Date 
		MaxSupportedDateTime: 
        {
            get:function()
            {
                return Date.MaxValue; 
            }
        }, 
 
        // Return the type of the Gregorian calendar.
        // 

//        public override CalendarAlgorithmType 
		AlgorithmType:
        { 
            get:function()
            { 
                return CalendarAlgorithmType.SolarCalendar; 
            }
        },
        
//        public virtual GregorianCalendarTypes 
        CalendarType: {
            get:function() { 
                return (this.m_type);
            },
            set:function(value) { 
                VerifyWritable();
 
                switch (value) { 
                    case GregorianCalendarTypes.Localized:
                    case GregorianCalendarTypes.USEnglish: 
                    case GregorianCalendarTypes.MiddleEastFrench:
                    case GregorianCalendarTypes.Arabic:
                    case GregorianCalendarTypes.TransliteratedEnglish:
                    case GregorianCalendarTypes.TransliteratedFrench: 
                    	this.m_type = value;
                        break; 
 
                    default:
                        throw new ArgumentOutOfRangeException("m_type", Environment.GetResourceString("ArgumentOutOfRange_Enum")); 
                }
            }
        },
 
//        internal override int 
        ID: {
            get:function() { 
                // By returning different ID for different variations of GregorianCalendar, 
                // we can support the Transliterated Gregorian calendar.
                // DateTimeFormatInfo will use this ID to get formatting information about 
                // the calendar.
                return this.m_type;
            }
        },
        
//        public override int[] 
        Eras: { 
            get:function() {
                return /*new int[]*/ [ADEra];
            }
        },
        
//        public override int 
        TwoDigitYearMax:
        { 
            get:function() {
                if (twoDigitYearMax === -1) {
                    twoDigitYearMax = this.GetSystemTwoDigitYearSetting(ID, DEFAULT_TWO_DIGIT_YEAR_MAX);
                } 
                return (twoDigitYearMax);
            }, 
 
            set:function(value) {
            	this.VerifyWritable(); 
                if (value < 99 || value > MaxYear) {
                    throw new ArgumentOutOfRangeException(
                                "year",
                                String.Format( 
                                    CultureInfo.CurrentCulture,
                                    Environment.GetResourceString("ArgumentOutOfRange_Range"), 
                                    99, 
                                    MaxYear));
 
                }
                twoDigitYearMax = value;
            }
        } 
	});
	
	/*=================================GetDefaultInstance==========================
     **Action: Internal method to provide a default intance of GregorianCalendar.  Used by NLS+ implementation
     **       and other calendars. 
     **Returns:
     **Arguments: 
     **Exceptions: 
     ============================================================================*/

//     internal static Calendar 
	GregorianCalendar.GetDefaultInstance = function() {
         if (s_defaultInstance === null) {
             s_defaultInstance = new GregorianCalendar();
         } 
         return (s_defaultInstance);
	};
	
	/*=================================GetAbsoluteDate========================== 
	  **Action: Gets the absolute date for the given Gregorian date.  The absolute date means
	  **       the number of days from January 1st, 1 A.D. 
	  **Returns:  the absolute date 
	  **Arguments:
	  **      year    the Gregorian year 
	  **      month   the Gregorian month
	  **      day     the day
	  **Exceptions:
	  **      ArgumentOutOfRangException  if year, month, day value is valid. 
	  **Note:
	  **      This is an internal method used by DateToTicks() and the calculations of Hijri and Hebrew calendars. 
	  **      Number of Days in Prior Years (both common and leap years) + 
	  **      Number of Days in Prior Months of Current Year +
	  **      Number of Days in Current Month 
	  **
	  ============================================================================*/

//     internal static long 
    GregorianCalendar.GetAbsoluteDate = function(/*int*/ year, /*int*/ month, /*int*/ day) { 
         if (year >= 1 && year <= MaxYear && month >= 1 && month <= 12)
         { 
             /*int[]*/var days = ((year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))) ? DaysToMonth366: DaysToMonth365; 
             if (day >= 1 && (day <= days[month] - days[month - 1])) {
                 var y = year - 1; 
                 var absoluteDate = y * 365 + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + days[month - 1] + day - 1;
                 return (absoluteDate);
             }
         } 
         throw new ArgumentOutOfRangeException(null, Environment.GetResourceString("ArgumentOutOfRange_BadYearMonthDay"));
    };
	
	GregorianCalendar.Type = new Type("GregorianCalendar", GregorianCalendar, [Calendar.Type]);
	return GregorianCalendar;
});
