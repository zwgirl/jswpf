/**
 * CalendarBlackoutDatesCollection
 */
/// <summary>
/// Represents a collection of DateTimeRanges. 
/// </summary>
define(["dojo/_base/declare", "system/Type", "objectmodel/ObservableCollection"], 
		function(declare, Type, ObservableCollection){
	var CalendarBlackoutDatesCollection = declare("CalendarBlackoutDatesCollection", ObservableCollection,{
		constructor:function(/*Calendar*/ owner)
        { 
			ObservableCollection.prototype.constructor.call(this);
            this._owner = owner;
//            this._dispatcherThread = Thread.CurrentThread; 
		},
		/// <summary>
        /// Dates that are in the past are added to the BlackoutDates.
        /// </summary> 
//        public void 
		AddDatesInPast:function()
        { 
            this.Add(new CalendarDateRange(DateTime.MinValue, DateTime.Today.AddDays(-1))); 
        },
 
//        /// <summary>
//        /// Checks if a DateTime is in the Collection
//        /// </summary>
//        /// <param name="date"></param> 
//        /// <returns></returns>
////        public bool 
//        Contains:function(/*DateTime*/ date) 
//        { 
//            return null != GetContainingDateRange(date);
//        }, 
//
//        /// <summary>
//        /// Checks if a Range is in the collection
//        /// </summary> 
//        /// <param name="start"></param>
//        /// <param name="end"></param> 
//        /// <returns></returns> 
////        public bool 
//        Contains:function(/*DateTime*/ start, /*DateTime*/ end)
//        { 
//            /*DateTime*/var rangeStart, rangeEnd;
//            var n = this.Count;
//
//            if (DateTime.Compare(end, start) > -1) 
//            {
//                rangeStart = DateTimeHelper.DiscardTime(start).Value; 
//                rangeEnd = DateTimeHelper.DiscardTime(end).Value; 
//            }
//            else 
//            {
//                rangeStart = DateTimeHelper.DiscardTime(end).Value;
//                rangeEnd = DateTimeHelper.DiscardTime(start).Value;
//            } 
//
//            for (var i = 0; i < n; i++) 
//            { 
//                if (DateTime.Compare(this.Get(i).Start, rangeStart) == 0 && DateTime.Compare(this.Get(i).End, rangeEnd) == 0)
//                { 
//                    return true;
//                }
//            }
// 
//            return false;
//        }, 

        /// <summary>
        /// Checks if a Range is in the collection
        /// </summary> 
        /// <param name="start"></param>
        /// <param name="end"></param> 
        /// <returns></returns> 
//        public bool 
        Contains:function(/*DateTime*/ start, /*DateTime*/ end)
        { 
        	if(arguments.length == 1){
        		return null != this.GetContainingDateRange(start);
        	}
        	
            /*DateTime*/var rangeStart, rangeEnd;
            var n = this.Count;

            if (DateTime.Compare(end, start) > -1) 
            {
                rangeStart = DateTimeHelper.DiscardTime(start).Value; 
                rangeEnd = DateTimeHelper.DiscardTime(end).Value; 
            }
            else 
            {
                rangeStart = DateTimeHelper.DiscardTime(end).Value;
                rangeEnd = DateTimeHelper.DiscardTime(start).Value;
            } 

            for (var i = 0; i < n; i++) 
            { 
                if (DateTime.Compare(this.Get(i).Start, rangeStart) == 0 && DateTime.Compare(this.Get(i).End, rangeEnd) == 0)
                { 
                    return true;
                }
            }
 
            return false;
        }, 
 
        /// <summary>
        /// Returns true if any day in the given DateTime range is contained in the BlackOutDays. 
        /// </summary>
        /// <param name="range">CalendarDateRange that is searched in BlackOutDays</param>
        /// <returns>true if at least one day in the range is included in the BlackOutDays</returns>
//        public bool 
        ContainsAny:function(/*CalendarDateRange*/ range) 
        {
            for(var i=0; i<this.Count; i++) //foreach (CalendarDateRange item in this) 
            { 
            	var item = this.Get(i);
                if (item.ContainsAny(range))
                { 
                    return true;
                }
            }
 
            return false;
        }, 
 
        /// <summary>
        /// This finds the next date that is not blacked out in a certian direction. 
        /// </summary>
        /// <param name="requestedDate"></param>
        /// <param name="dayInterval"></param>
        /// <returns></returns> 
//        internal DateTime? 
        GetNonBlackoutDate:function(/*DateTime?*/ requestedDate, /*int*/ dayInterval)
        { 
//            Debug.Assert(dayInterval != 0); 

            /*DateTime?*/var currentDate = requestedDate; 
            /*CalendarDateRange*/var range = null;

            if (requestedDate == null)
            { 
                return null;
            } 
 
            if ((range = this.GetContainingDateRange(/*(DateTime)*/currentDate)) == null)
            { 
                return requestedDate;
            }

            do 
            {
                if (dayInterval > 0) 
                { 
                    // Moving Forwards.
                    // The DateRanges require start <= end 
                    currentDate = DateTimeHelper.AddDays(range.End, dayInterval );
                }
                else 
                {
                    //Moving backwards. 
                    currentDate = DateTimeHelper.AddDays(range.Start, dayInterval ); 
                }
 				 
            } while (currentDate != null && ((range = this.GetContainingDateRange(/*(DateTime)*/currentDate)) != null));

 
            return currentDate;
        }, 

        /// <summary>
        /// All the items in the collection are removed. 
        /// </summary>
//        protected override void 
        ClearItems:function() 
        { 
            for(var i=0; i<this.Items.Count; i++) //foreach (CalendarDateRange item in Items) 
            {
            	var item = this.Items.Get(i);
                this.UnRegisterItem(item); 
            } 

            ObservableCollection.prototype.ClearItems.call(this); 
            this._owner.UpdateCellItems();
        },

        /// <summary> 
        /// The item is inserted in the specified place in the collection.
        /// </summary> 
        /// <param name="index"></param> 
        /// <param name="item"></param>
//        protected override void 
        InsertItem:function(/*int*/ index, /*CalendarDateRange*/ item) 
        {
            if (this.IsValid(item)) 
            {
            	this.RegisterItem(item); 
            	ObservableCollection.prototype.InsertItem.call(this, index, item);
                this._owner.UpdateCellItems();
            }
            else 
            {
                throw new ArgumentOutOfRangeException(SR.Get(SRID.Calendar_UnSelectableDates)); 
            } 
        },
 
        /// <summary>
        /// The item in the specified index is removed from the collection.
        /// </summary>
        /// <param name="index"></param> 
//        protected override void 
        RemoveItem:function(/*int*/ index)
        { 
            if (index >= 0 && index < this.Count)
            { 
                this.UnRegisterItem(this.Items.Get(index));
            } 
 
            ObservableCollection.prototype.RemoveItem.call(this, index);
            this._owner.UpdateCellItems(); 
        },

        /// <summary>
        /// The object in the specified index is replaced with the provided item. 
        /// </summary>
        /// <param name="index"></param> 
        /// <param name="item"></param> 
//        protected override void 
        SetItem:function(/*int*/ index, /*CalendarDateRange*/ item)
        { 
            if (this.IsValid(item)) 
            { 
                /*CalendarDateRange*/var oldItem = null;
                if (index >= 0 && index < this.Count) 
                {
                    oldItem = this.Items.Get(index);
                }
 
                ObservableCollection.prototype.SetItem.call(this, index, item);
 
                this.UnRegisterItem(oldItem); 
                this.RegisterItem(this.Items.Get(index));
 
                this._owner.UpdateCellItems();
            }
            else
            { 
                throw new ArgumentOutOfRangeException(SR.Get(SRID.Calendar_UnSelectableDates));
            } 
        },

        /// <summary> 
        /// Registers for change notification on date ranges
        /// </summary> 
        /// <param name="item"></param> 
//        private void 
        RegisterItem:function(/*CalendarDateRange*/ item)
        { 
            if (item != null)
            {
                item.Changing.Combine(new EventHandler/*<CalendarDateRangeChangingEventArgs>*/(this, this.Item_Changing));
                item.PropertyChanged.Combine(new PropertyChangedEventHandler(this, this.Item_PropertyChanged)); 
            }
        }, 
 
        /// <summary>
        /// Un registers for change notification on date ranges 
        /// </summary>
//        private void 
        UnRegisterItem:function(/*CalendarDateRange*/ item)
        {
            if (item != null) 
            {
                item.Changing.Remove(new EventHandler/*<CalendarDateRangeChangingEventArgs>*/(this, this.Item_Changing)); 
                item.PropertyChanged.Remove(new PropertyChangedEventHandler(this, this.Item_PropertyChanged)); 
            }
        }, 

        /// <summary>
        /// Reject date range changes that would make the blackout dates collection invalid
        /// </summary> 
        /// <param name="sender"></param>
        /// <param name="e"></param> 
//        private void 
        Item_Changing:function(/*object*/ sender, /*CalendarDateRangeChangingEventArgs*/ e) 
        {
            /*CalendarDateRange*/var item = sender instanceof CalendarDateRange ? sender : null; 
            if (item != null)
            {
                if (!this.IsValid(e.Start, e.End))
                { 
                    throw new ArgumentOutOfRangeException(SR.Get(SRID.Calendar_UnSelectableDates));
                } 
            } 
        },
 
        /// <summary>
        /// Update the calendar view to reflect the new blackout dates
        /// </summary>
        /// <param name="sender"></param> 
        /// <param name="e"></param>
//        private void 
        Item_PropertyChanged:function(/*object*/ sender, /*PropertyChangedEventArgs*/ e) 
        { 
            if (sender instanceof CalendarDateRange)
            { 
                this._owner.UpdateCellItems();
            }
        },
 
        /// <summary>
        /// Tests to see if a date range is not already selected 
        /// </summary> 
        /// <param name="item">date range to test</param>
        /// <returns>True if no selected day falls in the given date range</returns> 
//        private bool 
        IsValid:function(/*CalendarDateRange*/ item)
        {
            return IsValid(item.Start, item.End);
        }, 

        /// <summary> 
        /// Tests to see if a date range is not already selected 
        /// </summary>
        /// <param name="start">First day of date range to test</param> 
        /// <param name="end">Last day of date range to test</param>
        /// <returns>True if no selected day falls between start and end</returns>
//        private bool 
        IsValid:function(/*DateTime*/ start, /*DateTime*/ end)
        { 
            for(var i=0; i<this._owner.SelectedDates.Count; i++) //foreach (object child in _owner.SelectedDates)
            { 
            	var child = this._owner.SelectedDates.Get(i);
                /*DateTime?*/var day = child instanceof DateTime ? child : null; 
//                Debug.Assert(day != null);
                if (DateTimeHelper.InRange(day.Value, start, end)) 
                {
                    return false;
                }
            } 

            return true; 
        }, 

//        private bool 
        IsValidThread:function() 
        {
            return Thread.CurrentThread == this._dispatcherThread;
        },
 
        /// <summary>
        /// Gets the DateRange that contains the date. 
        /// </summary> 
        /// <param name="date"></param>
        /// <returns></returns> 
//        private CalendarDateRange 
        GetContainingDateRange:function(/*DateTime*/ date)
        {
            if (date == null)
                return null; 

            for (var i = 0; i < this.Count; i++) 
            { 
                if (DateTimeHelper.InRange(date, this.Get(i)))
                { 
                    return this.Get(i);
                }
            }
            return null; 
        }
	});
	
	CalendarBlackoutDatesCollection.Type = new Type("CalendarBlackoutDatesCollection", CalendarBlackoutDatesCollection, 
			[ObservableCollection.Type]);
	return CalendarBlackoutDatesCollection;
});
 

        

