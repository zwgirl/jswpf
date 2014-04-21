/**
 * CalendarDateRange
 */
/// <summary>
/// Specifies a DateTime range class which has a start and end.
/// </summary> 
define(["dojo/_base/declare", "system/Type", "componentmodel/INotifyPropertyChanged"], 
		function(declare, Type, INotifyPropertyChanged){
	var CalendarDateRange = declare("CalendarDateRange", INotifyPropertyChanged,{
		constructor:function(/*DateTime*/ start, /*DateTime*/ end){
			if(arguments.length == 0){
				this._start = DateTime.MinValue; 
	            this._end = DateTime.MaxValue;
			}else if(arguments.length == 1){
				this._start = start; 
	            this._end = start;
			}else if(arguments.length == 2){
				this._start = start; 
	            this._end = end;
			}
		},
		
		/// <summary>
        /// Returns true if any day in the given DateTime range is contained in the current CalendarDateRange. 
        /// </summary>
        /// <param name="range"></param> 
        /// <returns></returns> 
//        internal bool 
		ContainsAny:function(/*CalendarDateRange*/ range)
        { 
            return (range.End >= this.Start) && (this.End >= range.Start);
        },
 
//        private void 
        OnChanging:function(/*CalendarDateRangeChangingEventArgs*/ e)
        { 
            /*EventHandler<CalendarDateRangeChangingEventArgs>*/var handler = this.Changing;
            if (handler != null)
            {
                handler.Invoke(this, e); 
            }
        }, 
 
//        private void 
        OnPropertyChanged:function(/*PropertyChangedEventArgs*/ e)
        { 
            /*PropertyChangedEventHandler*/var handler = this.PropertyChanged;
            if (handler != null)
            {
                handler.Invoke(this, e); 
            }
        } 
	});
	
	Object.defineProperties(CalendarDateRange.prototype,{
//		public event PropertyChangedEventHandler 
		PropertyChanged: 
		{
			get:function(){
				if(this._PropertyChanged === undefined){
					this._PropertyChanged = new Delegate();	
				}
				return this._PropertyChanged;
			}
		},
		 /// <summary>
        /// Specifies the End date of the CalendarDateRange. 
        /// </summary>
//        public DateTime 
		End: 
        { 
            get:function()
            { 
                return CoerceEnd(this._start, this._end);
            },
            set:function(value) 
            {
                /*DateTime*/var newEnd = CoerceEnd(this._start, value); 
                if (newEnd != End) 
                {
                    this.OnChanging(new CalendarDateRangeChangingEventArgs(this._start, newEnd)); 
                    this._end = value;
                    this.OnPropertyChanged(new PropertyChangedEventArgs("End"));
                }
            } 
        },
 
        /// <summary> 
        /// Specifies the Start date of the CalendarDateRange.
        /// </summary> 
//        public DateTime 
		Start:
        {
            get:function()
            { 
                return this._start;
            }, 
            set:function(value)
            { 
                if (this._start != value)
                {
                    /*DateTime*/var oldEnd = this.End;
                    /*DateTime*/var newEnd = CoerceEnd(value, this._end); 

                    this.OnChanging(new CalendarDateRangeChangingEventArgs(value, newEnd)); 
 
                    this._start = value;
 
                    this.OnPropertyChanged(new PropertyChangedEventArgs("Start"));

                    if (newEnd != oldEnd)
                    { 
                    	this.OnPropertyChanged(new PropertyChangedEventArgs("End"));
                    } 
                } 
            }
        }, 

//        internal event EventHandler<CalendarDateRangeChangingEventArgs> 
		Changing: 
		{
			get:function(){
				if(this._Changing === undefined){
					this._Changing = new Delegate();	
				}
				return this._Changing;
			}
		}
	});
	
    /// <summary>
    /// Coerced the end parameter to satisfy the start &lt;= end constraint 
    /// </summary>
    /// <param name="start"></param>
    /// <param name="end"></param>
    /// <returns>If start &lt;= end the end parameter otherwise the start parameter</returns> 
//    private static DateTime 
	function CoerceEnd(/*DateTime*/ start, /*DateTime*/ end)
    { 
        return (DateTime.Compare(start, end) <= 0) ? end : start; 
    }
	
	CalendarDateRange.Type = new Type("CalendarDateRange", CalendarDateRange, [INotifyPropertyChanged.Type]);
	return CalendarDateRange;
});



       
 


