/**
 * SelectedDatesCollection
 */
/// <summary> 
/// Represents the collection of SelectedDates for the Calendar Control.
/// </summary> 
define(["dojo/_base/declare", "system/Type", "objectmodel/ObservableCollection", "objectmodel/Collection"], 
		function(declare, Type, ObservableCollection, Collection){
	var SelectedDatesCollection = declare("SelectedDatesCollection", ObservableCollection,{
		constructor:function(/*Calendar*/ owner) 
        {
			ObservableCollection.prototype.constructor.call(this);
//            this._dispatcherThread = Thread.CurrentThread;
            this._owner = owner;
            this._addedItems = new Collection/*<DateTime>*/(); 
            this._removedItems = new Collection/*<DateTime>*/();
            
//            private bool 
            this._isAddingRange = false; 
//            private DateTime? 
            this._maximumDate = null; 
//            private DateTime? 
            this._minimumDate = null;
		},
		
		 /// <summary>
        /// Adds a range of dates to the Calendar SelectedDates. 
        /// </summary> 
        /// <param name="start"></param>
        /// <param name="end"></param> 
//        public void 
		AddRange:function(/*DateTime*/ start, /*DateTime*/ end)
        {
            this.BeginAddRange();
 
            // If CalendarSelectionMode.SingleRange and a user programmatically tries to add multiple ranges, we will throw away the old range and replace it with the new one.
            if (this._owner.SelectionMode == CalendarSelectionMode.SingleRange && this.Count > 0) 
            { 
                this.ClearInternal();
            } 

            var days = GetDaysInRange(start, end);
            for(var i=0 ;i<days.Count; i++) //foreach (DateTime current in GetDaysInRange(start, end))
            {
            	var current = days.Get(i);
                this.Add(current); 
            }
 
            this.EndAddRange(); 
        },
 
        /// <summary>
        /// Clears all the items of the SelectedDates. 
        /// </summary> 
//        protected override void 
        ClearItems:function()
        { 
            if (!this.IsValidThread())
            {
                throw new NotSupportedException(SR.Get(SRID.CalendarCollection_MultiThreadedCollectionChangeNotSupported));
            } 

            // Turn off highlight 
            this._owner.HoverStart = null; 

            this.ClearInternal(true /*fireChangeNotification*/); 
        },

        /// <summary>
        /// Inserts the item in the specified position of the SelectedDates collection. 
        /// </summary>
        /// <param name="index"></param> 
        /// <param name="item"></param> 
//        protected override void 
        InsertItem:function(/*int*/ index, /*DateTime*/ item)
        { 
            if (!this.IsValidThread())
            {
                throw new NotSupportedException(SR.Get(SRID.CalendarCollection_MultiThreadedCollectionChangeNotSupported));
            } 

            if (!this.Contains(item)) 
            { 
                /*Collection<DateTime>*/var addedItems = new Collection/*<DateTime>*/();
 
                var isCleared = this.CheckSelectionMode();

                if (Calendar.IsValidDateSelection(this._owner, item))
                { 
                    // If the Collection is cleared since it is SingleRange and it had another range
                    // set the index to 0 
                    if (isCleared) 
                    {
                        index = 0; 
                        isCleared = false;
                    }

                    base.InsertItem(index, item); 
                    this.UpdateMinMax(item);
 
                    // The event fires after SelectedDate changes 
                    if (index == 0 && !(this._owner.SelectedDate.HasValue && DateTime.Compare(this._owner.SelectedDate.Value, item) == 0))
                    { 
                        this._owner.SelectedDate = item;
                    }

                    if (!this._isAddingRange) 
                    {
                    	this.addedItems.Add(item); 
 
                    	this.RaiseSelectionChanged(this._removedItems, addedItems);
                        this._removedItems.Clear(); 
                        var monthDifference = DateTimeHelper.CompareYearMonth(item, this._owner.DisplayDateInternal);

                        if (monthDifference < 2 && monthDifference > -2)
                        { 
                            this._owner.UpdateCellItems();
                        } 
                    } 
                    else
                    { 
                        this._addedItems.Add(item);
                    }
                }
                else 
                {
                    throw new ArgumentOutOfRangeException(SR.Get(SRID.Calendar_OnSelectedDateChanged_InvalidValue)); 
                } 
            }
        }, 

        /// <summary>
        /// Removes the item at the specified position.
        /// </summary> 
        /// <param name="index"></param>
//        protected override void 
        RemoveItem:function(/*int*/ index) 
        { 
            if (!this.IsValidThread())
            { 
                throw new NotSupportedException(SR.Get(SRID.CalendarCollection_MultiThreadedCollectionChangeNotSupported));
            }

            if (index >= this.Count) 
            {
                base.RemoveItem(index); 
                this.ClearMinMax(); 
            }
            else 
            {
                /*Collection<DateTime>*/var addedItems = new Collection/*<DateTime>*/();
                /*Collection<DateTime>*/var removedItems = new Collection/*<DateTime>*/();
                var monthDifference = DateTimeHelper.CompareYearMonth(this.Get(index), this._owner.DisplayDateInternal); 

                removedItems.Add(this.Get(index)); 
                base.RemoveItem(index); 
                this.ClearMinMax();
 
                // The event fires after SelectedDate changes
                if (index == 0)
                {
                    if (Count > 0) 
                    {
                        this._owner.SelectedDate = this.Get(0); 
                    } 
                    else
                    { 
                        this._owner.SelectedDate = null;
                    }
                }
 
                this.RaiseSelectionChanged(removedItems, addedItems);
 
                if (monthDifference < 2 && monthDifference > -2) 
                {
                    this._owner.UpdateCellItems(); 
                }
            }
        },
 
        /// <summary>
        /// The object in the specified index is replaced with the provided item. 
        /// </summary> 
        /// <param name="index"></param>
        /// <param name="item"></param> 
//        protected override void 
        SetItem:function(/*int*/ index, /*DateTime*/ item)
        {
            if (!IsValidThread())
            { 
                throw new NotSupportedException(SR.Get(SRID.CalendarCollection_MultiThreadedCollectionChangeNotSupported));
            } 
 
            if (!this.Contains(item))
            { 
                /*Collection<DateTime>*/var addedItems = new Collection/*<DateTime>*/();
                /*Collection<DateTime>*/var removedItems = new Collection/*<DateTime>*/();

                if (index >= this.Count) 
                {
                    base.SetItem(index, item); 
                    this.UpdateMinMax(item); 
                }
                else 
                {
                    if (item != null && DateTime.Compare(this.Get(index), item) != 0 && Calendar.IsValidDateSelection(this._owner, item))
                    {
                        removedItems.Add(this[index]); 
                        base.SetItem(index, item);
                        this.UpdateMinMax(item); 
 
                        addedItems.Add(item);
 
                        // The event fires after SelectedDate changes
                        if (index == 0 && !(this._owner.SelectedDate.HasValue && DateTime.Compare(this._owner.SelectedDate.Value, item) == 0))
                        {
                            this._owner.SelectedDate = item; 
                        }
 
                        this.RaiseSelectionChanged(removedItems, addedItems); 

                        var monthDifference = DateTimeHelper.CompareYearMonth(item, this._owner.DisplayDateInternal); 

                        if (monthDifference < 2 && monthDifference > -2)
                        {
                            this._owner.UpdateCellItems(); 
                        }
                    } 
                } 
            }
        },

        /// <summary> 
        /// Adds a range of dates to the Calendar SelectedDates. 
        /// </summary>
        /// <remarks> 
        /// Helper version of AddRange for mouse drag selection.
        /// This version guarantees no exceptions will be thrown by removing blackout days from the range before adding to the collection
        /// </remarks>
//        internal void 
        AddRangeInternal:function(/*DateTime*/ start, /*DateTime*/ end) 
        {
        	this.BeginAddRange(); 
 
            // In Mouse Selection we allow the user to be able to add multiple ranges in one action in MultipleRange Mode
            // In SingleRange Mode, we only add the first selected range 
            /*DateTime*/var lastAddedDate = start;
            var days = GetDaysInRange(start, end);
            for(var i=0 ;i<days.Count; i++) //foreach (DateTime current in GetDaysInRange(start, end))
            {
            	var current = days.Get(i);
                if (Calendar.IsValidDateSelection(this._owner, current)) 
                {
                    this.Add(current); 
                    lastAddedDate = current; 
                }
                else 
                {
                    if (this._owner.SelectionMode == CalendarSelectionMode.SingleRange)
                    {
                        this._owner.CurrentDate = lastAddedDate; 
                        break;
                    } 
                } 
            }
 
            this.EndAddRange();
        },

////        internal void 
//        ClearInternal:function() 
//        {
//            ClearInternal(false /*fireChangeNotification*/); 
//        }, 

//        internal void 
        ClearInternal:function(/*bool*/ fireChangeNotification) 
        {
        	if(fireChangeNotification === undefined){
        		fireChangeNotification = false;
        	} 
            if (this.Count > 0)
            {
                for(var i=0; i<this.Count; i++) //foreach (DateTime item in this) 
                {
                	var item = this.Get(i);
                	this._removedItems.Add(item); 
                } 

                base.ClearItems(); 
                this.ClearMinMax();

                if (fireChangeNotification)
                { 
                    if (this._owner.SelectedDate != null)
                    { 
                        this._owner.SelectedDate = null; 
                    }
 
                    if (this._removedItems.Count > 0)
                    {
                        /*Collection<DateTime>*/var addedItems = new Collection/*<DateTime>*/();
                        this.RaiseSelectionChanged(this._removedItems, addedItems); 
                        this._removedItems.Clear();
                    } 
 
                    this._owner.UpdateCellItems();
                } 
            }
        },

//        internal void 
        Toggle:function(/*DateTime*/ date) 
        {
            if (Calendar.IsValidDateSelection(this._owner, date)) 
            { 
                switch (this._owner.SelectionMode)
                { 
                    case CalendarSelectionMode.SingleDate:
                    {
                        if (!this._owner.SelectedDate.HasValue || DateTimeHelper.CompareDays(this._owner.SelectedDate.Value, date) != 0)
                        { 
                            this._owner.SelectedDate = date;
                        } 
                        else 
                        {
                            this._owner.SelectedDate = null; 
                        }

                        break;
                    } 

                    case CalendarSelectionMode.MultipleRange: 
                    { 
                        if (!this.Remove(date))
                        { 
                        	this.Add(date);
                        }

                        break; 
                    }
 
                    default: 
                    {
//                        Debug.Assert(false); 
                        break;
                    }
                }
            } 
        },

//        private void 
        RaiseSelectionChanged:function(/*IList*/ removedItems, /*IList*/ addedItems)
        {
            this._owner.OnSelectedDatesCollectionChanged(new CalendarSelectionChangedEventArgs(Calendar.SelectedDatesChangedEvent, removedItems, addedItems)); 
        },
 
//        private void 
        BeginAddRange:function() 
        {
//            Debug.Assert(!_isAddingRange); 
        	this._isAddingRange = true;
        },

//        private void 
        EndAddRange:function() 
        {
//            Debug.Assert(_isAddingRange); 
 
        	this._isAddingRange = false;
            this.RaiseSelectionChanged(this._removedItems, this._addedItems); 
            this._removedItems.Clear();
            this._addedItems.Clear();
            this._owner.UpdateCellItems();
        }, 

//        private bool 
        CheckSelectionMode:function() 
        { 
            if (this._owner.SelectionMode == CalendarSelectionMode.None)
            { 
                throw new InvalidOperationException(SR.Get(SRID.Calendar_OnSelectedDateChanged_InvalidOperation));
            }

            if (this._owner.SelectionMode == CalendarSelectionMode.SingleDate && this.Count > 0) 
            {
                throw new InvalidOperationException(SR.Get(SRID.Calendar_CheckSelectionMode_InvalidOperation)); 
            } 

            // if user tries to add an item into the SelectedDates in SingleRange mode, we throw away the old range and replace it with the new one 
            // in order to provide the removed items without an additional event, we are calling ClearInternal
            if (this._owner.SelectionMode == CalendarSelectionMode.SingleRange && !this._isAddingRange && this.Count > 0)
            {
                this.ClearInternal(); 
                return true;
            } 
            else 
            {
                return false; 
            }
        },

//        private bool 
        IsValidThread:function() 
        {
            return true; //Thread.CurrentThread == this._dispatcherThread; 
        }, 

//        private void 
        UpdateMinMax:function(/*DateTime*/ date) 
        {
            if ((!this._maximumDate.HasValue) || (date > this._maximumDate.Value))
            {
            	this._maximumDate = date; 
            }
 
            if ((!this._minimumDate.HasValue) || (date < this._minimumDate.Value)) 
            {
            	this._minimumDate = date; 
            }
        },

//        private void 
        ClearMinMax:function() 
        {
        	this._maximumDate = null; 
        	this._minimumDate = null; 
        }
	});
	
	Object.defineProperties(SelectedDatesCollection.prototype,{
//		internal DateTime 
		MinimumDate:
        {
            get:function()
            { 
                if (Count < 1)
                { 
                    return null; 
                }
 
                if (!this._minimumDate.HasValue)
                {
                    /*DateTime*/var result = this[0];
                    for(var i=0; i<this.Count; i++) //foreach (DateTime selectedDate in this) 
                    {
                    	var selectedDate = this.Get(i);
                        if (DateTime.Compare(selectedDate, result) < 0) 
                        { 
                            result = selectedDate;
                        } 
                    }

                    this._maximumDate = result;
                } 

                return this._minimumDate; 
            } 
        },
 
//        internal DateTime 
		MaximumDate:
        {
            get:function()
            { 
                if (Count < 1)
                { 
                    return null; 
                }
 
                if (!this._maximumDate.HasValue)
                {
                    /*DateTime*/var result = this.Get(0);
                    for(var i=0; i<this.Count; i++) //foreach (DateTime selectedDate in this) 
                    {
                    	var selectedDate = this.Get(i);
                        if (DateTime.Compare(selectedDate, result) > 0) 
                        { 
                            result = selectedDate;
                        } 
                    }

                    this._maximumDate = result;
                } 

                return this._maximumDate; 
            } 
        },
        
	});
	
	Object.defineProperties(SelectedDatesCollection,{
		  
	});
//	private static IEnumerable<DateTime> 
	function GetDaysInRange(/*DateTime*/ start, /*DateTime*/ end)
    {
		var result = new List();
        // increment parameter specifies if the Days were selected in Descending order or Ascending order
        // based on this value, we add the days in the range either in Ascending order or in Descending order 
        var increment = GetDirection(start, end);

        /*DateTime?*/var rangeStart = start; 

        do 
        {
//            yield return rangeStart.Value;
        	result.Add(rangeStart.Value);
            rangeStart = DateTimeHelper.AddDays(rangeStart.Value, increment);
        } 
        while (rangeStart.HasValue && DateTime.Compare(end, rangeStart.Value) != -increment);
        
        return result;
    } 

//    private static int 
	function GetDirection(/*DateTime*/ start, /*DateTime*/ end)
    { 
        return (DateTime.Compare(end, start) >= 0) ? 1 : -1;
    }
	
	SelectedDatesCollection.Type = new Type("SelectedDatesCollection", SelectedDatesCollection, [ObservableCollection.Type]);
	return SelectedDatesCollection;
});


 
        
 
       
 
        


