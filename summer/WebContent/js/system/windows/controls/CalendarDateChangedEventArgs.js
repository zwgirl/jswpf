/**
 * CalendarDateChangedEventArgs
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutedEventArgs"], 
		function(declare, Type, RoutedEventArgs){
	var CalendarDateChangedEventArgs = declare("CalendarDateChangedEventArgs", RoutedEventArgs,{
		constructor:function(/*DateTime?*/ removedDate, /*DateTime?*/ addedDate) 
        { 
            this.RemovedDate = removedDate;
            this.AddedDate = addedDate; 
		},
	});
	
	Object.defineProperties(CalendarDateChangedEventArgs.prototype,{
        /// <summary>
        /// Gets the date to be newly displayed. 
        /// </summary>
//        public DateTime? 
		AddedDate: 
        { 
            get:function(){
            	return this._AddedDate;
            },
            /*private*/ set:function(value){
            	this._AddedDate = value;
            } 
        },

        /// <summary>
        /// Gets the date that was previously displayed. 
        /// </summary>
//        public DateTime? 
		RemovedDate: 
        { 
            get:function(){
            	return this._RemovedDate;
            },
            /*private*/ set:function(value){
            	this._RemovedDate = value;
            } 
        } 
	});
	
	CalendarDateChangedEventArgs.Type = new Type("CalendarDateChangedEventArgs", CalendarDateChangedEventArgs, [RoutedEventArgs.Type]);
	return CalendarDateChangedEventArgs;
});

