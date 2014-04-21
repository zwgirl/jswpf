/**
 * DispatcherTimer
 */
/// <summary> 
///     A timer that is integrated into the Dispatcher queues, and will
///     be processed after a given amount of time at a specified priority.
/// </summary>
define(["dojo/_base/declare", "system/Type", "system/TimeSpan", "system/EventArgs"], 
		function(declare, Type, TimeSpan){
	var DispatcherTimer = declare("DispatcherTimer", Object,{
		constructor:function(/*TimeSpan*/ interval, callback){
			if(arguments.length == 1){
	            if (interval.TotalMilliseconds < 0) 
	                throw new ArgumentOutOfRangeException("interval", SR.Get(SRID.TimeSpanPeriodOutOfRange_TooSmall));

	            if (interval.TotalMilliseconds > Number.MAX_INT)
	                throw new ArgumentOutOfRangeException("interval", SR.Get(SRID.TimeSpanPeriodOutOfRange_TooLarge)); 

	            this._interval = interval;
			}else if(arguments.length == 2){
	            this._interval = interval;
	            this.Tick.Combine(callback);
			}
 
			this._tag = null;
	        this._isEnabled = false;
			this.timer = -1;
		},
		
        /// <summary> 
        ///     Starts the timer. 
        /// </summary>
//        public void 
        Start:function() 
        {
        	var tick = this.Tick;
        	var self = this;
        	
        	tick.Invoke(self, EventArgs.Empty); 
//        	this.timer = window.setInterval(function() {
////        		alert("timeout!");
//                if(tick != null)
//                { 
//                	tick.Invoke(self, EventArgs.Empty); 
//                }
//        	}, 1500/*this.Interval.TotalMilliseconds*/);
        },

        /// <summary> 
        ///     Stops the timer.
        /// </summary> 
//        public void 
        Stop:function() 
        {
//        	window.clearInterval(this.timer);
        },
        
	});
	
	Object.defineProperties(DispatcherTimer.prototype,{
        /// <summary> 
        ///     Occurs when the specified timer interval has elapsed and the
        ///     timer is enabled. 
        /// </summary>
//        public event EventHandler 
		Tick:
		{
			get:function(){
				if(this._Tick === undefined){
					this._Tick = new Delegate();
				}
				
				return this._Tick;
			}
				
		},
      /// <summary>
        ///     Gets or sets whether the timer is running. 
        /// </summary> 
//        public bool 
        IsEnabled:
        { 
            get:function()
            {
                return this._isEnabled;
            }, 
            set:function(value) 
            { 
                if(!value && this._isEnabled)
                {
                	this.Stop();
                } 
                else if(value && !this._isEnabled)
                { 
                	this.Start(); 
                }
            }
        },

        /// <summary> 
        ///     Gets or sets the time between timer ticks.
        /// </summary> 
//        public TimeSpan 
        Interval: 
        {
            get:function() 
            {
                return this._interval;
            },
            set:function(value)
            { 
//                var updateWin32Timer = false; 

                if (value.TotalMilliseconds < 0) 
                    throw new ArgumentOutOfRangeException("value", SR.Get(SRID.TimeSpanPeriodOutOfRange_TooSmall));

                if (value.TotalMilliseconds > Number.MAX_INT)
                    throw new ArgumentOutOfRangeException("value", SR.Get(SRID.TimeSpanPeriodOutOfRange_TooLarge)); 

                this._interval = value;
                
//                if(this._isEnabled)
//                {
//                	this._dueTimeInTicks = Environment.TickCount + this._interval.TotalMilliseconds;
//                    updateWin32Timer = true; 
//                } 
// 
//                if(updateWin32Timer)
//                { 
//                	this._dispatcher.UpdateWin32Timer();
//                }
            }
        },
        
      /// <summary> 
        ///     Any data that the caller wants to pass along with the timer.
        /// </summary> 
//        public object 
        Tag: 
        {
            get:function() 
            {
                return this._tag;
            },
            set:function(value)
            { 
            	this._tag = value; 
            }
        } 
	});
	
	DispatcherTimer.Type = new Type("DispatcherTimer", DispatcherTimer, [Object.Type]);
	return DispatcherTimer;
});




