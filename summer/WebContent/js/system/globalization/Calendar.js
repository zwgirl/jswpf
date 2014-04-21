/**
 * Calendar
 */
// This abstract class represents a calendar. A calendar reckons time in
// divisions such as weeks, months and years. The number, length and start of 
// the divisions vary in each calendar.
// 
// Any instant in time can be represented as an n-tuple of numeric values using 
// a particular calendar. For example, the next vernal equinox occurs at (0.0, 0
// , 46, 8, 20, 3, 1999) in the Gregorian calendar. An  implementation of 
// Calendar can map any DateTime value to such an n-tuple and vice versa. The
// DateTimeFormat class can map between such n-tuples and a textual
// representation such as "8:46 AM [....] 20th 1999 AD".
// 
// Most calendars identify a year which begins the current era. There may be any
// number of previous eras. The Calendar class identifies the eras as enumerated 
// integers where the current era (CurrentEra) has the value zero. 
//
// For consistency, the first unit in each interval, e.g. the first month, is 
// assigned the value one.
// The calculation of hour/minute/second is moved to Calendar from GregorianCalendar,
// since most of the calendars (or all?) have the same way of calcuating hour/minute/second.
define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	
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
    
	var Calendar = declare("Calendar", Object,{
		constructor:function(){
//	        internal int 
			this.m_currentEraValue = -1;
	        
//	        private bool 
			this.m_isReadOnly = false; 
//	        internal int 
			this.twoDigitYearMax = -1;
		},
		////////////////////////////////////////////////////////////////////////
        //
        //  Clone 
        //
        //  Is the implementation of IColnable.
        //
        //////////////////////////////////////////////////////////////////////// 
//        public virtual Object 
		Clone:function() 
        { 
            /*object*/var o = MemberwiseClone();
            /*(Calendar)*/ o.SetReadOnlyState(false); 
            return o;
        },
//        internal void 
		VerifyWritable:function() 
        {
            if (this.m_isReadOnly) 
            {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
            }
        }, 

//        internal void 
        SetReadOnlyState:function(/*bool*/ readOnly) 
        { 
        	this.m_isReadOnly = readOnly;
        }, 

//        internal DateTime 
        Add:function(/*DateTime*/ time, /*double*/ value, /*int*/ scale) {
            // From ECMA CLI spec, Partition III, section 3.27:
            // 
            // If overflow occurs converting a floating-point type to an integer, or if the floating-point value
            // being converted to an integer is a NaN, the value returned is unspecified. 
            // 
            // Based upon this, this method should be performing the comparison against the double
            // before attempting a cast. Otherwise, the result is undefined. 
        	var tempMillis = (value * scale + (value >= 0 ? 0.5 : -0.5));
            if (!((tempMillis > -/*(double)*/MaxMillis) && (tempMillis < /*(double)*/MaxMillis)))
            {
                throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_AddValue")); 
            }
 
            var millis = /*(long)*/tempMillis; 
            var ticks = time.Ticks + millis * TicksPerMillisecond;
            Calendar.CheckAddResult(ticks, this.MinSupportedDateTime, this.MaxSupportedDateTime); 
            return (new Date(ticks));
        },

        // Returns the DateTime resulting from adding the given number of 
        // milliseconds to the specified DateTime. The result is computed by rounding
        // the number of milliseconds given by value to the nearest integer, 
        // and adding that interval to the specified DateTime. The value 
        // argument is permitted to be negative.
        // 

//        public virtual DateTime 
        AddMilliseconds:function(/*DateTime*/ time, /*double*/ milliseconds) {
            return this.Add(time, milliseconds, 1);
        }, 

 
        // Returns the DateTime resulting from adding a fractional number of 
        // days to the specified DateTime. The result is computed by rounding the
        // fractional number of days given by value to the nearest 
        // millisecond, and adding that interval to the specified DateTime. The
        // value argument is permitted to be negative.
        //
 
//        public virtual DateTime 
        AddDays:function(/*DateTime*/ time, /*int*/ days) {
            return this.Add(time, days, MillisPerDay); 
        }, 

        // Returns the DateTime resulting from adding a fractional number of 
        // hours to the specified DateTime. The result is computed by rounding the
        // fractional number of hours given by value to the nearest
        // millisecond, and adding that interval to the specified DateTime. The
        // value argument is permitted to be negative. 
        //
 
//        public virtual DateTime 
        AddHours:function(/*DateTime*/ time, /*int*/ hours) { 
            return this.Add(time, hours, MillisPerHour);
        }, 


        // Returns the DateTime resulting from adding a fractional number of
        // minutes to the specified DateTime. The result is computed by rounding the 
        // fractional number of minutes given by value to the nearest
        // millisecond, and adding that interval to the specified DateTime. The 
        // value argument is permitted to be negative. 
        //
 
//        public virtual DateTime 
        AddMinutes:function(/*DateTime*/ time, /*int*/ minutes) {
            return this.Add(time, minutes, MillisPerMinute);
        },
 

        // Returns the DateTime resulting from adding the given number of 
        // months to the specified DateTime. The result is computed by incrementing 
        // (or decrementing) the year and month parts of the specified DateTime by
        // value months, and, if required, adjusting the day part of the 
        // resulting date downwards to the last day of the resulting month in the
        // resulting year. The time-of-day part of the result is the same as the
        // time-of-day part of the specified DateTime.
        // 
        // In more precise terms, considering the specified DateTime to be of the
        // form y / m / d + t, where y is the 
        // year, m is the month, d is the day, and t is the 
        // time-of-day, the result is y1 / m1 / d1 + t,
        // where y1 and m1 are computed by adding value months 
        // to y and m, and d1 is the largest value less than
        // or equal to d that denotes a valid day in month m1 of year
        // y1.
        // 

//        public abstract DateTime AddMonths:function(DateTime time, int months); 
 
        // Returns the DateTime resulting from adding a number of
        // seconds to the specified DateTime. The result is computed by rounding the 
        // fractional number of seconds given by value to the nearest
        // millisecond, and adding that interval to the specified DateTime. The
        // value argument is permitted to be negative.
        // 

//        public virtual DateTime 
        AddSeconds:function(/*DateTime*/ time, /*int*/ seconds) { 
            return this.Add(time, seconds, MillisPerSecond); 
        },
 
        // Returns the DateTime resulting from adding a number of
        // weeks to the specified DateTime. The
        // value argument is permitted to be negative.
        // 

//        public virtual DateTime 
        AddWeeks:function(/*DateTime*/ time, /*int*/ weeks) { 
            return this.AddDays(time, weeks * 7); 
        },
 

        // Returns the DateTime resulting from adding the given number of
        // years to the specified DateTime. The result is computed by incrementing
        // (or decrementing) the year part of the specified DateTime by value 
        // years. If the month and day of the specified DateTime is 2/29, and if the
        // resulting year is not a leap year, the month and day of the resulting 
        // DateTime becomes 2/28. Otherwise, the month, day, and time-of-day 
        // parts of the result are the same as those of the specified DateTime.
        // 

//        public abstract DateTime AddYears:function(DateTime time, int years);

        // Returns the day-of-month part of the specified DateTime. The returned 
        // value is an integer between 1 and 31.
        // 
 
//        public abstract int GetDayOfMonth:function(DateTime time);
 
        // Returns the day-of-week part of the specified DateTime. The returned value
        // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates
        // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates
        // Thursday, 5 indicates Friday, and 6 indicates Saturday. 
        //
 
//        public abstract DayOfWeek GetDayOfWeek:function(DateTime time); 

        // Returns the day-of-year part of the specified DateTime. The returned value 
        // is an integer between 1 and 366.
        //

//        public abstract int GetDayOfYear:function(DateTime time); 

        // Returns the number of days in the month given by the year and 
        // month arguments. 
        //
 
////        public virtual int 
//        GetDaysInMonth:function(/*int*/ year, /*int*/ month, int era)
//        {
//            return this.GetDaysInMonth(year, month, CurrentEra);
//        }, 

        // Returns the number of days in the month given by the year and 
        // month arguments for the specified era. 
        //
 
//        public abstract int GetDaysInMonth:function(int year, int month, int era);

        // Returns the number of days in the year given by the year argument for the current era.
        // 

////        public virtual int 
//        GetDaysInYear:function(/*int*/ year) 
//        { 
//            return this.GetDaysInYear(year, CurrentEra);
//        }, 

        // Returns the number of days in the year given by the year argument for the current era.
        //
 
//        public abstract int GetDaysInYear:function(int year, int era);
 
        // Returns the era for the specified DateTime value. 

//        public abstract int GetEra:function(DateTime time); 
 
        // Returns the hour part of the specified DateTime. The returned value is an 
        // integer between 0 and 23.
        // 

//        public virtual int 
        GetHour:function(/*DateTime*/ time) {
            return (/*(int)*/time.Ticks / TicksPerHour) % 24;
        }, 

        // Returns the millisecond part of the specified DateTime. The returned value 
        // is an integer between 0 and 999. 
        //
 
//        public virtual double 
        GetMilliseconds:function(/*DateTime*/ time) {
            return /*(double)*/(time.Ticks / TicksPerMillisecond) % 1000;
        },
 
        // Returns the minute part of the specified DateTime. The returned value is
        // an integer between 0 and 59. 
        // 

//        public virtual int 
        GetMinute:function(/*DateTime*/ time) { 
            return /*(int)*/(time.Ticks / TicksPerMinute) % 60;
        },

        // Returns the month part of the specified DateTime. The returned value is an 
        // integer between 1 and 12.
        // 
 
//        public abstract int GetMonth:function(DateTime time);
 
        // Returns the number of months in the specified year in the current era.

//        public virtual int 
        GetMonthsInYear:function(/*int*/ year)
        { 
            return this.GetMonthsInYear(year, CurrentEra);
        }, 
 
        // Returns the number of months in the specified year and era.
 
//        public abstract int GetMonthsInYear:function(int year, int era);

        // Returns the second part of the specified DateTime. The returned value is
        // an integer between 0 and 59. 
        //
 
//        public virtual int 
        GetSecond:function(/*DateTime*/ time) { 
            return (/*(int)*/((time.Ticks / TicksPerSecond) % 60));
        }, 

        /*=================================GetFirstDayWeekOfYear==========================
        **Action: Get the week of year using the FirstDay rule.
        **Returns:  the week of year. 
        **Arguments:
        **  time 
        **  firstDayOfWeek  the first day of week (0=Sunday, 1=Monday, ... 6=Saturday) 
        **Notes:
        **  The CalendarWeekRule.FirstDay rule: Week 1 begins on the first day of the year. 
        **  Assume f is the specifed firstDayOfWeek,
        **  and n is the day of week for January 1 of the specified year.
        **  Assign offset = n - f;
        **  Case 1: offset = 0 
        **      E.g.
        **                     f=1 
        **          weekday 0  1  2  3  4  5  6  0  1 
        **          date       1/1
        **          week#      1                    2 
        **      then week of year = (GetDayOfYear(time) - 1) / 7 + 1
        **
        **  Case 2: offset < 0
        **      e.g. 
        **                     n=1   f=3
        **          weekday 0  1  2  3  4  5  6  0 
        **          date       1/1 
        **          week#      1     2
        **      This means that the first week actually starts 5 days before 1/1. 
        **      So week of year = (GetDayOfYear(time) + (7 + offset) - 1) / 7 + 1
        **  Case 3: offset > 0
        **      e.g.
        **                  f=0   n=2 
        **          weekday 0  1  2  3  4  5  6  0  1  2
        **          date          1/1 
        **          week#         1                    2 
        **      This means that the first week actually starts 2 days before 1/1.
        **      So Week of year = (GetDayOfYear(time) + offset - 1) / 7 + 1 
        ============================================================================*/

//        internal int 
        GetFirstDayWeekOfYear:function(/*DateTime*/ time, /*int*/ firstDayOfWeek) {
        	var dayOfYear = this.GetDayOfYear(time) - 1;   // Make the day of year to be 0-based, so that 1/1 is day 0. 
            // Calculate the day of week for the first day of the year.
            // dayOfWeek - (dayOfYear % 7) is the day of week for the first day of this year.  Note that 
            // this value can be less than 0.  It's fine since we are making it positive again in calculating offset. 
        	var dayForJan1 = /*(int)*/this.GetDayOfWeek(time) - (dayOfYear % 7);
        	var offset = (dayForJan1 - firstDayOfWeek + 14) % 7; 
//            Contract.Assert(offset >= 0, "Calendar.GetFirstDayWeekOfYear(): offset >= 0");
            return ((dayOfYear + offset) / 7 + 1);
        },
 
//        private int 
        GetWeekOfYearFullDays:function(/*DateTime*/ time, /*int*/ firstDayOfWeek, /*int*/ fullDays) {
        	var dayForJan1; 
        	var offset; 
        	var day;
 
        	var dayOfYear = this.GetDayOfYear(time) - 1; // Make the day of year to be 0-based, so that 1/1 is day 0.
            //
            // Calculate the number of days between the first day of year (1/1) and the first day of the week.
            // This value will be a positive value from 0 ~ 6.  We call this value as "offset". 
            //
            // If offset is 0, it means that the 1/1 is the start of the first week. 
            //     Assume the first day of the week is Monday, it will look like this: 
            //     Sun      Mon     Tue     Wed     Thu     Fri     Sat
            //     12/31    1/1     1/2     1/3     1/4     1/5     1/6 
            //              +--> First week starts here.
            //
            // If offset is 1, it means that the first day of the week is 1 day ahead of 1/1.
            //     Assume the first day of the week is Monday, it will look like this: 
            //     Sun      Mon     Tue     Wed     Thu     Fri     Sat
            //     1/1      1/2     1/3     1/4     1/5     1/6     1/7 
            //              +--> First week starts here. 
            //
            // If offset is 2, it means that the first day of the week is 2 days ahead of 1/1. 
            //     Assume the first day of the week is Monday, it will look like this:
            //     Sat      Sun     Mon     Tue     Wed     Thu     Fri     Sat
            //     1/1      1/2     1/3     1/4     1/5     1/6     1/7     1/8
            //                      +--> First week starts here. 

 
 
            // Day of week is 0-based.
            // Get the day of week for 1/1.  This can be derived from the day of week of the target day. 
            // Note that we can get a negative value.  It's ok since we are going to make it a positive value when calculating the offset.
            dayForJan1 = /*(int)*/this.GetDayOfWeek(time) - (dayOfYear % 7);

            // Now, calculate the offset.  Subtract the first day of week from the dayForJan1.  And make it a positive value. 
            offset = (firstDayOfWeek - dayForJan1 + 14) % 7;
            if (offset !== 0 && offset >= fullDays) 
            { 
                //
                // If the offset is greater than the value of fullDays, it means that 
                // the first week of the year starts on the week where Jan/1 falls on.
                //
                offset -= 7;
            } 
            //
            // Calculate the day of year for specified time by taking offset into account. 
            // 
            day = dayOfYear - offset;
            if (day >= 0) { 
                //
                // If the day of year value is greater than zero, get the week of year.
                //
                return (day/7 + 1); 
            }
            // 
            // Otherwise, the specified time falls on the week of previous year. 
            // Call this method again by passing the last day of previous year.
            // 
            // the last day of the previous year may "underflow" to no longer be a valid date time for
            // this calendar if we just subtract so we need the subclass to provide us with
            // that information
            if (time <= this.MinSupportedDateTime.AddDays(dayOfYear)) 
            {
                return this.GetWeekOfYearOfMinSupportedDateTime(firstDayOfWeek, fullDays); 
            } 
            return this.GetWeekOfYearFullDays(time.AddDays(-(dayOfYear + 1)), firstDayOfWeek, fullDays);
        }, 

//        private int 
        GetWeekOfYearOfMinSupportedDateTime:function(/*int*/ firstDayOfWeek, /*int*/ minimumDaysInFirstWeek)
        {
            var dayOfYear = GetDayOfYear(this.MinSupportedDateTime) - 1;  // Make the day of year to be 0-based, so that 1/1 is day 0. 
            var dayOfWeekOfFirstOfYear = /*(int)*/this.GetDayOfWeek(this.MinSupportedDateTime) - dayOfYear % 7;
 
            // Calculate the offset (how many days from the start of the year to the start of the week) 
            var offset = (firstDayOfWeek + 7 - dayOfWeekOfFirstOfYear) % 7;
            if (offset === 0 || offset >= minimumDaysInFirstWeek) 
            {
                // First of year falls in the first week of the year
                return 1;
            } 

            var daysInYearBeforeMinSupportedYear = DaysInYearBeforeMinSupportedYear - 1; // Make the day of year to be 0-based, so that 1/1 is day 0. 
            var dayOfWeekOfFirstOfPreviousYear = dayOfWeekOfFirstOfYear - 1 - (daysInYearBeforeMinSupportedYear % 7); 

            // starting from first day of the year, how many days do you have to go forward 
            // before getting to the first day of the week?
            var daysInInitialPartialWeek = (firstDayOfWeek - dayOfWeekOfFirstOfPreviousYear + 14) % 7;
            var day = daysInYearBeforeMinSupportedYear - daysInInitialPartialWeek;
            if (daysInInitialPartialWeek >= minimumDaysInFirstWeek) 
            {
                // If the offset is greater than the minimum Days in the first week, it means that 
                // First of year is part of the first week of the year even though it is only a partial week 
                // add another week
                day += 7; 
            }

            return (day / 7 + 1);
        }, 
 
        // Returns the week of year for the specified DateTime. The returned value is an 
        // integer between 1 and 53.
        // 

//        public virtual int 
        GetWeekOfYear:function(/*DateTime*/ time, /*CalendarWeekRule*/ rule, /*DayOfWeek*/ firstDayOfWeek)
        {
            if (/*(int)*/firstDayOfWeek < 0 || /*(int)*/firstDayOfWeek > 6) { 
                throw new ArgumentOutOfRangeException(
                    "firstDayOfWeek", Environment.GetResourceString("ArgumentOutOfRange_Range", 
                    DayOfWeek.Sunday, DayOfWeek.Saturday)); 
            }
//            Contract.EndContractBlock(); 
            switch (rule) {
                case CalendarWeekRule.FirstDay:
                    return (this.GetFirstDayWeekOfYear(time, /*(int)*/firstDayOfWeek));
                case CalendarWeekRule.FirstFullWeek: 
                    return (this.GetWeekOfYearFullDays(time, /*(int)*/firstDayOfWeek, 7));
                case CalendarWeekRule.FirstFourDayWeek: 
                    return (this.GetWeekOfYearFullDays(time, /*(int)*/firstDayOfWeek, 4)); 
            }
            throw new ArgumentOutOfRangeException( 
                "rule", Environment.GetResourceString("ArgumentOutOfRange_Range",
                CalendarWeekRule.FirstDay, CalendarWeekRule.FirstFourDayWeek));

        }, 

        // Returns the year part of the specified DateTime. The returned value is an 
        // integer between 1 and 9999. 
        //
 
//        public abstract int GetYear:function(DateTime time);

        // Checks whether a given day in the current era is a leap day. This method returns true if
        // the date is a leap day, or false if not. 
        //
 
//        public virtual bool 
        IsLeapDay:function(/*int*/ year, /*int*/ month, /*int*/ day) 
        {
            return this.IsLeapDay(year, month, day, CurrentEra); 
        },

        // Checks whether a given day in the specified era is a leap day. This method returns true if
        // the date is a leap day, or false if not. 
        //
 
//        public abstract bool IsLeapDay:function(int year, int month, int day, int era); 

        // Checks whether a given month in the current era is a leap month. This method returns true if 
        // month is a leap month, or false if not.
        //

//        public virtual bool 
        IsLeapMonth:function(/*int*/ year, /*int*/ month) { 
            return this.IsLeapMonth(year, month, CurrentEra);
        }, 
 
        // Checks whether a given month in the specified era is a leap month. This method returns true if
        // month is a leap month, or false if not. 
        //

//        public abstract bool 
//        IsLeapMonth:function(int year, int month, int era);
 
        // Returns  the leap month in a calendar year of the current era. This method returns 0
        // if this calendar does not have leap month, or this year is not a leap year. 
        // 

////        public virtual int 
//        GetLeapMonth:function(/*int*/ year)
//        {
//            return this.GetLeapMonth(year, CurrentEra);
//        }, 

        // Returns  the leap month in a calendar year of the specified era. This method returns 0 
        // if this calendar does not have leap month, or this year is not a leap year. 
        //
 
//        public virtual int 
        GetLeapMonth:function(/*int*/ year, /*int*/ era)
        {
            if(era === undefined){
                era = CurrentEra;
            }
            if (!this.IsLeapYear(year, era)) 
                return 0;
 
            var monthsCount = this.GetMonthsInYear(year, era); 
            for (var month=1; month<=monthsCount; month++)
            { 
                if (this.IsLeapMonth(year, month, era))
                    return month;
            }
 
            return 0;
        }, 
 
        // Checks whether a given year in the current era is a leap year. This method returns true if
        // year is a leap year, or false if not. 
        //

//        public virtual bool 
        IsLeapYear:function(/*int*/ year)
        { 
            return this.IsLeapYear(year, this.CurrentEra);
        },
 
        // Checks whether a given year in the specified era is a leap year. This method returns true if
        // year is a leap year, or false if not. 
        //

//        public abstract bool IsLeapYear:function(int year, int era);
 
        // Returns the date and time converted to a DateTime value.  Throws an exception if the n-tuple is invalid.
        // 
 
//        public virtual DateTime 
        ToDateTime:function(/*int*/ year, /*int*/ month,  /*int*/ day, /*int*/ hour, /*int*/ minute, /*int*/ second, /*int*/ millisecond)
        { 
            return (this.ToDateTime(year, month, day, hour, minute, second, millisecond, CurrentEra));
        },

        // Returns the date and time converted to a DateTime value.  Throws an exception if the n-tuple is invalid. 
        //
 
//        public abstract DateTime ToDateTime:function(int year, int month, int day, int hour, int minute, int second, int millisecond, int era); 

//        internal virtual Boolean 
        TryToDateTime:function(/*int*/ year, /*int*/ month, /*int*/ day, /*int*/ hour, /*int*/ minute, 
        		/*int*/ second, /*int*/ millisecond, /*int*/ era, /*out DateTime result*/resultOut) { 
        	resultOut.result = DateTime.MinValue;
            try {
            	resultOut.result = this.ToDateTime(year, month, day, hour, minute, second, millisecond, era);
                return true; 
            }
            catch (ArgumentException) { 
                return false; 
            }
        }, 

//        internal virtual bool 
        IsValidYear:function(/*int*/ year, /*int*/ era) {
            return (year >= this.GetYear(this.MinSupportedDateTime) && year <= this.GetYear(this.MaxSupportedDateTime));
        }, 

//        internal virtual bool 
        IsValidMonth:function(/*int*/ year, /*int*/ month, /*int*/ era) { 
            return (this.IsValidYear(year, era) && month >= 1 && month <= this.GetMonthsInYear(year, era)); 
        },
 
//        internal virtual bool 
        IsValidDay:function(/*int*/ year, /*int*/ month, /*int*/ day, /*int*/ era)
        {
            return (this.IsValidMonth(year, month, era) && day >= 1 && day <= this.GetDaysInMonth(year, month, era));
        },
        
        // Converts the year value to the appropriate century by using the
        // TwoDigitYearMax property.  For example, if the TwoDigitYearMax value is 2029,
        // then a two digit value of 30 will get converted to 1930 while a two digit
        // value of 29 will get converted to 2029. 

//        public virtual int 
        ToFourDigitYear:function(/*int*/ year) { 
            if (year < 0) { 
                throw new ArgumentOutOfRangeException("year",
                    Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum")); 
            }
//            Contract.EndContractBlock();
            if (year < 100) {
                return ((TwoDigitYearMax/100 - ( year > TwoDigitYearMax % 100 ? 1 : 0))*100 + year); 
            }
            // If the year value is above 100, just return the year value.  Don't have to do 
            // the TwoDigitYearMax comparison. 
            return year;
        } 
	});
	
	Object.defineProperties(Calendar.prototype,{
		// The minimum supported DateTime range for the calendar.
		 
//        public virtual DateTime 
		MinSupportedDateTime:
        {
            get:function() 
            {
                return Date.MinValue; 
            } 
        },
 
        // The maximum supported DateTime range for the calendar.

//        public virtual DateTime 
        MaxSupportedDateTime: 
        {
            get:function() 
            { 
                return Date.MaxValue;
            } 
        },
 
        ///
        // This can not be abstract, otherwise no one can create a subclass of Calendar.
        //
//        internal virtual int 
        ID: { 
            get:function() {
                return -1; 
            } 
        },
 
        ///
        // Return the Base calendar ID for calendars that didn't have defined data in calendarData
        //
 
//        internal virtual int 
        BaseCalendarID:
        { 
            get:function() { return this.ID; } 
        },
 
        // Returns  the type of the calendar.
        //
//        public virtual CalendarAlgorithmType 
        AlgorithmType: 
        {
            get:function() 
            { 
                return CalendarAlgorithmType.Unknown;
            } 
        },

        ////////////////////////////////////////////////////////////////////////
        // 
        //  IsReadOnly
        // 
        //  Detect if the object is readonly. 
        //
        //////////////////////////////////////////////////////////////////////// 
//        public bool 
        IsReadOnly:
        {
            get:function() { return (this.m_isReadOnly); } 
        },
        
     // Returns and assigns the maximum value to represent a two digit year.  This 
        // value is the upper boundary of a 100 year range that allows a two digit year
        // to be properly translated to a four digit year.  For example, if 2029 is the 
        // upper boundary, then a two digit value of 30 should be interpreted as 1930
        // while a two digit value of 29 should be interpreted as 2029.  In this example
        // , the 100 year range would be from 1930-2029.  See ToFourDigitYear().
 
//        public virtual int 
        TwoDigitYearMax:
        { 
            get:function() 
            {
                return twoDigitYearMax; 
            },

            set:function(value)
            { 
            	this.VerifyWritable();
                twoDigitYearMax = value; 
            } 
        },
        
        /*=================================CurrentEraValue==========================
         **Action: This is used to convert CurretEra(0) to an appropriate era value. 
         **Returns:
         **Arguments: 
         **Exceptions: 
         **Notes:
         ** The value is from calendar.nlp. 
         ============================================================================*/

//         internal virtual int 
        CurrentEraValue: {
             get:function() { 
                 // The following code assumes that the current era value can not be -1.
                 if (this.m_currentEraValue === -1) { 
//                     Contract.Assert(BaseCalendarID > 0, "[Calendar.CurrentEraValue] Expected ID > 0"); 
                	 this.m_currentEraValue = CalendarData.GetCalendarData(BaseCalendarID).iCurrentEra;
                 } 
                 return this.m_currentEraValue;
             }
         },
        /*=================================Eras==========================
        **Action: Get the list of era values.
        **Returns: The int array of the era names supported in this calendar. 
        **      null if era is not used.
        **Arguments: None. 
        **Exceptions: None. 
        ============================================================================*/
//        public abstract int[] 
         Eras: {
            get:function(){}
         }, 
        // it would be nice to make this abstract but we can't since that would break previous implementations 
//        protected virtual int 
         DaysInYearBeforeMinSupportedYear: 
         {
            get:function() 
            {
                return 365;
            }
         }

	});
	
    // The current era for a calendar.
	 
//    public const int 
	var CurrentEra = 0; 
	
	////////////////////////////////////////////////////////////////////////
    //
    //  ReadOnly 
    // 
    //  Create a cloned readonly instance or return the input one if it is
    //  readonly. 
    //
    ////////////////////////////////////////////////////////////////////////
//    public static Calendar 
	Calendar.ReadOnly = function(/*Calendar*/ calendar) 
    {
        if (calendar === null)       { throw new ArgumentNullException("calendar"); } 
        if (calendar.IsReadOnly)    { return (calendar); }

        /*Calendar*/var clonedCalendar = calendar.MemberwiseClone();
        clonedCalendar.SetReadOnlyState(true);

        return (clonedCalendar); 
    };
    
//    internal static void 
    Calendar.CheckAddResult = function(/*long*/ ticks, /*DateTime*/ minValue, /*DateTime*/ maxValue) {
        if (ticks < minValue.Ticks || ticks > maxValue.Ticks) {
//            throw new ArgumentException( 
//                String.Format(CultureInfo.InvariantCulture, Environment.GetResourceString("Argument_ResultCalendarRange"),
//                    minValue, maxValue)); 
        } 
//        Contract.EndContractBlock();
    };
    
 // Return the tick count corresponding to the given hour, minute, second.
    // Will check the if the parameters are valid.
//    internal static long 
    Calendar.TimeToTicks = function(/*int*/ hour, /*int*/ minute, /*int*/ second, /*int*/ millisecond) 
    {
        if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >=0 && second < 60) 
        { 
            if (millisecond < 0 || millisecond >= MillisPerSecond) {
                throw new ArgumentOutOfRangeException( 
                            "millisecond",
                            String.Format(
                                CultureInfo.InvariantCulture,
                                Environment.GetResourceString("ArgumentOutOfRange_Range"), 0, MillisPerSecond - 1)); 
            }
            return TimeSpan.TimeToTicks(hour, minute, second) + millisecond * TicksPerMillisecond; 
        } 
        throw new ArgumentOutOfRangeException(null, Environment.GetResourceString("ArgumentOutOfRange_BadHourMinuteSecond"));
    }; 

//    internal static int 
    Calendar.GetSystemTwoDigitYearSetting = function(/*int*/ CalID, /*int*/ defaultYearValue)
    { 
        // Call nativeGetTwoDigitYearMax 
        var twoDigitYearMax = CalendarData.nativeGetTwoDigitYearMax(CalID);
        if (twoDigitYearMax < 0) 
        {
            twoDigitYearMax = defaultYearValue;
        }
        return twoDigitYearMax; 
    };
	
	Calendar.Type = new Type("Calendar", Calendar, [Object.Type]);
	return Calendar;
});
