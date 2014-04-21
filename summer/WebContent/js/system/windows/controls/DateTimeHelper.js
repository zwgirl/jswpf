/**
 * DateTimeHelper
 */

define(["dojo/_base/declare", "system/Type", "controls/HeaderedContentControl", "globalization/GregorianCalendar"], 
		function(declare, Type, HeaderedContentControl, GregorianCalendar){
	
//	private static System.Globalization.Calendar 
	var cal = new GregorianCalendar();
	
	var DateTimeHelper = declare("DateTimeHelper", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(DateTimeHelper,{
		  
	});
//    public static DateTime/*?*/ 
	DateTimeHelper.AddDays = function(/*DateTime*/ time, /*int*/ days)
    { 
        try
        {
            return cal.AddDays(time, days);
        } 
        catch (ex)
        { 
            return null; 
        }
    };
    
//    public static DateTime/*?*/ 
    DateTimeHelper.AddMonths = function(/*DateTime*/ time, /*int*/ months)
    {
        try 
        {
            return cal.AddMonths(time, months); 
        } 
        catch (ex)
        { 
            return null;
        }
    };
    
//    public static DateTime/*?*/ 
    DateTimeHelper.AddYears = function (/*DateTime*/ time, /*int*/ years)
    { 
        try 
        {
            return cal.AddYears(time, years); 
        }
        catch (ex)
        {
            return null; 
        }
    }; 
    
//    public static DateTime/*?*/ 
    DateTimeHelper.SetYear = function(/*DateTime*/ date, /*int*/ year)
    { 
        return DateTimeHelper.AddYears(date, year - date.Year);
    };
    
//    public static DateTime/*?*/ 
    DateTimeHelper.SetYearMonth = function(/*DateTime*/ date, /*DateTime*/ yearMonth) 
    {
        /*DateTime?*/var target = SetYear(date, yearMonth.Year); 
        if (target.HasValue) 
        {
            target = DateTimeHelper.AddMonths(target, yearMonth.Month - date.Month); 
        }

        return target;
    }; 

//    public static int 
    DateTimeHelper.CompareDays = function(/*DateTime*/ dt1, /*DateTime*/ dt2) 
    { 
        return Date.Compare(DateTimeHelper.DiscardTime(dt1), DateTimeHelper.DiscardTime(dt2));
    }; 

//    public static int 
    DateTimeHelper.CompareYearMonth = function(/*DateTime*/ dt1, /*DateTime*/ dt2)
    {
        return ((dt1.Year - dt2.Year) * 12) + (dt1.Month - dt2.Month); 
    };

//    public static int 
    DateTimeHelper.DecadeOfDate = function(/*DateTime*/ date) 
    {
        return date.Year - (date.Year % 10); 
    };

//    public static DateTime 
    DateTimeHelper.DiscardDayTime = function(/*DateTime*/ d)
    { 
        return new Date(d.Year, d.Month, 1, 0, 0, 0);
    }; 

//    public static DateTime/*?*/ 
    DateTimeHelper.DiscardTime = function(/*DateTime*//*?*/ d)
    { 
        if (d == null)
        {
            return null;
        } 

        return d.Date; 
    }; 

//    public static int 
    DateTimeHelper.EndOfDecade = function(/*DateTime*/ date) 
    {
        return DecadeOfDate(date) + 9;
    };

//    public static DateTimeFormatInfo 
    DateTimeHelper.GetCurrentDateFormat = function()
    { 
        return DateTimeHelper.GetDateFormat(/*CultureInfo.CurrentCulture*/); 
    };

//    internal static CultureInfo 
    DateTimeHelper.GetCulture = function(/*FrameworkElement*/ element)
    {
//        var culture; 
//        if (element.GetValueSource(FrameworkElement.LanguageProperty, null, /*out hasModifiers*/{"hasModifiers" : null}) != BaseValueSourceInternal.Default)
//        { 
//            culture = MS.Internal.Text.DynamicPropertyReader.GetCultureInfo(element); 
//        }
//        else 
//        {
//            culture = CultureInfo.CurrentCulture;
//        }
//        return culture; 
    	
    	return null;
    };

//    internal static DateTimeFormatInfo 
    DateTimeHelper.GetDateFormat = function(/*CultureInfo*/ culture) 
    {
//        if (culture.Calendar instanceof GregorianCalendar) 
//        {
//            return culture.DateTimeFormat;
//        }
//        else 
//        {
//            /*GregorianCalendar*/var foundCal  =null; 
//            /*DateTimeFormatInfo*/var dtfi = null; 
//
//            for(var i=0; i<culture.OptionalCalendars.Count; i++) //foreach (System.Globalization.Calendar cal in culture.OptionalCalendars) 
//            {
//                if (cal instanceof GregorianCalendar)
//                {
//                    // Return the first Gregorian calendar with CalendarType == Localized 
//                    // Otherwise return the first Gregorian calendar
//                    if (foundCal == null) 
//                    { 
//                        foundCal = cal instanceof GregorianCalendar ? cal : null;
//                    } 
//
//                    if ((cal).CalendarType == GregorianCalendarTypes.Localized)
//                    {
//                        foundCal = cal instanceof GregorianCalendar ? cal : null; 
//                        break;
//                    } 
//                } 
//            }
//
//
//            if (foundCal == null)
//            {
//                // if there are no GregorianCalendars in the OptionalCalendars list, use the invariant dtfi 
//                dtfi = (/*(CultureInfo)*/CultureInfo.InvariantCulture.Clone()).DateTimeFormat;
//                dtfi.Calendar = new GregorianCalendar(); 
//            } 
//            else
//            { 
//                dtfi = (/*(CultureInfo)*/culture.Clone()).DateTimeFormat;
//                dtfi.Calendar = foundCal;
//            }
//
//            return dtfi;
//        } 
    	return null;
    }; 

    // returns if the date is included in the range 
//    public static bool 
    DateTimeHelper.InRange = function(/*DateTime*/ date, /*CalendarDateRange*/ range)
    {
        return InRange(date, range.Start, range.End);
    }; 

    // returns if the date is included in the range 
//    public static bool 
    DateTimeHelper.InRange = function(/*DateTime*/ date, /*DateTime*/ start, /*DateTime*/ end) 
    {
//        Debug.Assert(DateTime.Compare(start, end) < 1); 

        if (CompareDays(date, start) > -1 && CompareDays(date, end) < 1)
        {
            return true; 
        }

        return false; 
    };



//    public static string 
    DateTimeHelper.ToDayString = function(/*DateTime*//*?*/ date, /*CultureInfo*/ culture)
    { 
        var result = String.Empty;
        /*DateTimeFormatInfo*/var format = DateTimeHelper.GetDateFormat(culture); 

        if (date!=null && format != null)
        { 
            result = date.Day.ToString(format);
        }

        if(date!=null){
        	return date.Day.toString();
        }
        return result; 
    };

    // This is specifically for Calendar.  It switches which year is at the beginning or end of the string. 
//    public static string 
    DateTimeHelper.ToDecadeRangeString = function(/*int*/ decade, /*FrameworkElement*/ fe)
    { 
        var result = String.Empty;
        /*DateTimeFormatInfo*/var format = DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(fe));

        if (format != null) 
        {
            var isRightToLeft = fe.FlowDirection==FlowDirection.RightToLeft; 
            var decadeRight = isRightToLeft?decade:(decade+9); 
            var decadeLeft =  isRightToLeft?(decade+9):decade;
            result = decadeLeft.ToString(format) + "-" + decadeRight.ToString(format); 
        }

        return result;
    }; 

//    public static string 
    DateTimeHelper.ToYearMonthPatternString = function(/*DateTime*//*?*/ date, /*CultureInfo*/ culture) 
    { 
    	var result = String.Empty;
        /*DateTimeFormatInfo*/var format = DateTimeHelper.GetDateFormat(culture); 

        if (date != null && format != null)
        {
            result = date.ToString(format.YearMonthPattern, format); 
        }

        return String.Format("{0}年{1}月", date.Year, date.Month + 1); 
    };

//    public static string 
    DateTimeHelper.ToYearString = function(/*DateTime*//*?*/ date, /*CultureInfo*/ culture)
    {
        var result = String.Empty;
        /*DateTimeFormatInfo*/var format = DateTimeHelper.GetDateFormat(culture); 

        if (date!=null && format != null) 
        { 
            result = date.Year.ToString(format);
        } 

        return result;
    };

//    public static string 
    DateTimeHelper.ToAbbreviatedMonthString = function( /*DateTime*//*?*/ date, /*CultureInfo*/ culture)
    { 
        var result = String.Empty; 
        /*DateTimeFormatInfo*/var format = DateTimeHelper.GetDateFormat(culture);

        if (date!=null && format != null)
        {
            /*string[]*/var monthNames = format.AbbreviatedMonthNames;
            if (monthNames != null && monthNames.Length > 0) 
            {
                result = monthNames[(date.Month - 1) % monthNames.length]; 
            } 
        }

        return result;
    };

//    public static string 
    DateTimeHelper.ToLongDateString = function(/*DateTime*//*?*/ date, /*CultureInfo*/ culture) 
    {
        var result = String.Empty; 
        /*DateTimeFormatInfo*/var format = DateTimeHelper.GetDateFormat(culture); 

        if (date!=null && format != null) 
        {
            result = date.Date.ToString(format.LongDatePattern, format);
        }

        return result;
    };
	
	DateTimeHelper.Type = new Type("DateTimeHelper", DateTimeHelper, [Object.Type]);
	return DateTimeHelper;
});

