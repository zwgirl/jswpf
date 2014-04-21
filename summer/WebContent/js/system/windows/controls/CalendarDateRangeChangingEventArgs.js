/**
 * CalendarDateRangeChangingEventArgs
 */

define(["dojo/_base/declare", "system/Type", "system/EventArgs"], 
		function(declare, Type, EventArgs){
	var CalendarDateRangeChangingEventArgs = declare("CalendarDateRangeChangingEventArgs", EventArgs,{
		constructor:function(/*DateTime*/ start, /*DateTime*/ end) 
        { 
            this._start = start;
            this._end = end; 
		}
	});
	
	Object.defineProperties(CalendarDateRangeChangingEventArgs.prototype,{
//        public DateTime 
		Start:
        { 
            get:function() { return this._start; }
        }, 
 
//        public DateTime 
        End:
        { 
            get:function() { return this._end; }
        }  
	});
	
	CalendarDateRangeChangingEventArgs.Type = new Type("CalendarDateRangeChangingEventArgs", CalendarDateRangeChangingEventArgs,
			[EventArgs.Type]);
	return CalendarDateRangeChangingEventArgs;
});


