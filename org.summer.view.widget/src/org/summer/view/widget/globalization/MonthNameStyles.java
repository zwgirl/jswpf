package org.summer.view.widget.globalization;
// 
    // Flags used to indicate different styles of month names.
    // This is an internal flag used by internalGetMonthName().
    // Use flag here in case that we need to provide a combination of these styles
    // (such as month name of a leap year in genitive form.  Not likely for now, 
    // but would like to keep the option open).
    // 
 
    internal enum MonthNameStyles { 
        Regular     = 0x00000000,
        Genitive    = 0x00000001,
        LeapYear    = 0x00000002,
    } 

    // 
    // Flags used to indicate special rule used in parsing/formatting 
    // for a specific DateTimeFormatInfo instance.
    // This is an internal flag. 
    //
    // This flag is different from MonthNameStyles because this flag
    // can be expanded to accomodate parsing behaviors like CJK month names
    // or alternative month names, etc. 

    /*internal*/ enum DateTimeFormatFlags { 
        None                    = 0x00000000,
        UseGenitiveMonth        = 0x00000001, 
        UseLeapYearMonth        = 0x00000002,
        UseSpacesInMonthNames   = 0x00000004, // Has spaces or non-breaking space in the month names.
        UseHebrewRule           = 0x00000008,   // Format/Parse using the Hebrew calendar rule.
        UseSpacesInDayNames     = 0x00000010,   // Has spaces or non-breaking space in the day names. 
        UseDigitPrefixInTokens  = 0x00000020,   // Has token starting with numbers.
 
        NotInitialized          = -1, 
    }
 

    

    internal class TokenHashValue {
        internal String tokenString; 
        internal TokenType tokenType;
        internal int tokenValue; 
 
        internal TokenHashValue(String tokenString, TokenType tokenType, int tokenValue) {
            this.tokenString = tokenString; 
            this.tokenType = tokenType;
            this.tokenValue = tokenValue;
        }
    } 