/**
 * Calendar
 */
/// <summary> 
/// Represents a control that enables a user to select a date by using a visual calendar display.
/// </summary> 
define(["dojo/_base/declare", "system/Type", "controls/Control", "controls/CalendarBlackoutDatesCollection",
        "controls/SelectedDatesCollection", "controls/CalendarMode", "controls/DateTimeHelper",
        "controls/CalendarDateChangedEventArgs", "system/DayOfWeek", "controls/CalendarSelectionMode"], 
		function(declare, Type, Control, CalendarBlackoutDatesCollection,
				SelectedDatesCollection, CalendarMode, DateTimeHelper,
				CalendarDateChangedEventArgs, DayOfWeek, CalendarSelectionMode){
	
//    private const string 
	var ElementRoot = "PART_Root"; 
//    private const string 
	var ElementMonth = "PART_CalendarItem";
	
//    private const int 
	var COLS = 7;
//    private const int 
	var ROWS = 7;
//    private const int 
	var YEAR_ROWS = 3;
//    private const int 
	var YEAR_COLS = 4; 
//    private const int 
    var YEARS_PER_DECADE = 10;
    
	var Calendar = declare("Calendar", Control,{
		constructor:function(){
//		    private Date? 
			this._hoverStart = null;
//	        private Date? 
			this._hoverEnd = null;
//	        private bool 
			this._isShiftPressed = false;
//	        private Date? 
			this._currentDate = null; 
//	        private CalendarItem 
			this._monthControl = null;
	        
            this._blackoutDates = new CalendarBlackoutDatesCollection(this);
            this._selectedDates = new SelectedDatesCollection(this); 
            this.SetCurrentValueInternal(Calendar.DisplayDateProperty, Date.Today); 
            
            this._dom = document.createElement("div");
			this._dom._source = this;
            this._dom.id = "Calendar";
		},
        /// <summary> 
        /// Occurs when a date is selected. 
        /// </summary>
//        public event EventHandler<SelectionChangedEventArgs> SelectedDatesChanged 
//        {
//            
//        },
		
		AddSelectedDatesChanged:function(value) { this.AddHandler(Calendar.SelectedDatesChangedEvent, value); },
        RemoveSelectedDatesChanged:function(value) { this.RemoveHandler(Calendar.SelectedDatesChangedEvent, value); },
        
      /// <summary> 
        /// Invoked whenever application code or an internal process,
        /// such as a rebuilding layout pass, calls the ApplyTemplate method. 
        /// </summary> 
//        public override void 
        OnApplyTemplate:function()
        { 
            if (this._monthControl != null)
            {
            	this._monthControl.Owner = null;
            } 

            Control.prototype.OnApplyTemplate.call(this); 
 
            this._monthControl = this.GetTemplateChild(ElementMonth);
            this._monthControl = this._monthControl instanceof CalendarItem ? this._monthControl : null;
 
            if (this._monthControl != null)
            {
            	this._monthControl.Owner = this;
            } 

            this.CurrentDate = this.DisplayDate; 
            this.UpdateCellItems(); 
        },
 
        /// <summary>
        /// Provides a text representation of the selected date.
        /// </summary>
        /// <returns>A text representation of the selected date, or an empty string if SelectedDate is a null reference.</returns> 
//        public override string 
        ToString:function()
        { 
            if (this.SelectedDate != null) 
            {
                return this.SelectedDate.ToString(DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this))); 
            }
            else
            {
                return String.Empty; 
            }
        }, 

//        protected virtual void 
        OnSelectedDatesChanged:function(/*SelectionChangedEventArgs*/ e)
        { 
            this.RaiseEvent(e);
        }, 
 
//        protected virtual void 
        OnDisplayDateChanged:function(/*CalendarDateChangedEventArgs*/ e)
        { 
            /*EventHandler<CalendarDateChangedEventArgs>*/var handler = this.DisplayDateChanged;
            if (handler != null)
            {
                handler.Invoke(this, e); 
            }
        }, 
 
//        protected virtual void 
        OnDisplayModeChanged:function(/*CalendarModeChangedEventArgs*/ e)
        { 
            /*EventHandler<CalendarModeChangedEventArgs>*/var handler = this.DisplayModeChanged;

            if (handler != null)
            { 
                handler.Invoke(this, e);
            } 
        }, 

//        protected virtual void 
        OnSelectionModeChanged:function(/*EventArgs*/ e) 
        {
            /*EventHandler<EventArgs>*/var handler = this.SelectionModeChanged;

            if (handler != null) 
            {
                handler.Invoke(this, e); 
            } 
        },
 
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e)
        {
            if (!e.Handled)
            { 
                e.Handled = this.ProcessCalendarKey(e);
            } 
        },

//        protected override void 
        OnKeyUp:function(/*KeyEventArgs*/ e) 
        {
            if (!e.Handled)
            {
                if (e.Key == Key.LeftShift || e.Key == Key.RightShift) 
                {
                    this.ProcessShiftKeyUp(); 
                } 
            }
        }, 

//        internal CalendarDayButton 
        FindDayButtonFromDay:function(/*Date*/ day) 
        { 
            if (this.MonthControl != null)
            { 
            	var buttons = this.MonthControl.GetCalendarDayButtons();
                for(var i=0; i<buttons.Count; i++) //foreach (CalendarDayButton b in this.MonthControl.GetCalendarDayButtons())
                {
                	var b = buttons.Get(i);
                    if (b.DataContext instanceof Date)
                    { 
                        if (DateTimeHelper.CompareDays(b.DataContext, day) == 0)
                        { 
                            return b; 
                        }
                    } 
                }
            }

            return null; 
        },
 
//        internal void 
        OnDayButtonMouseUp:function(/*MouseButtonEventArgs*/ e)
        { 
            /*MouseButtonEventHandler*/var handler = this.DayButtonMouseUp;
            if (null != handler) 
            { 
                handler.Invoke(this, e);
            } 
        },

//        internal void 
        OnDayOrMonthPreviewKeyDown:function(/*RoutedEventArgs*/ e)
        { 
            /*RoutedEventHandler*/var handler = this.DayOrMonthPreviewKeyDown;
            if (null != handler) 
            { 
                handler.Invoke(this, e);
            } 
        },

        // If the day is a trailing day, Update the DisplayDate
//        internal void 
        OnDayClick:function(/*Date*/ selectedDate) 
        {
            if (this.SelectionMode == CalendarSelectionMode.None) 
            { 
                this.CurrentDate = selectedDate;
            } 

            if (DateTimeHelper.CompareYearMonth(selectedDate, this.DisplayDateInternal) != 0)
            {
                this.MoveDisplayTo(selectedDate); 
            }
            else 
            { 
            	this.UpdateCellItems();
            	this.FocusDate(selectedDate); 
            }
        },

//        internal void 
        OnCalendarButtonPressed:function(/*CalendarButton*/ b, /*bool*/ switchDisplayMode) 
        {
            if (b.DataContext instanceof Date) 
            { 
                /*Date*/var d = b.DataContext;
 
                /*Date?*/var newDate = null;
                /*CalendarMode*/var newMode = CalendarMode.Month;

                switch (this.DisplayMode) 
                {
                    case CalendarMode.Month: 
                    { 
//                        Debug.Assert(false);
                        break; 
                    }

                    case CalendarMode.Year:
                    { 
                        newDate = DateTimeHelper.SetYearMonth(this.DisplayDate, d);
                        newMode = CalendarMode.Month; 
                        break; 
                    }
 
                    case CalendarMode.Decade:
                    {
                        newDate = DateTimeHelper.SetYear(this.DisplayDate, d.Year);
                        newMode = CalendarMode.Year; 
                        break;
                    } 
 
                    default:
//                        Debug.Assert(false); 
                        break;
                }

                if (newDate != null) 
                {
                    this.DisplayDate = newDate; 
                    if (switchDisplayMode) 
                    {
                        this.SetCurrentValueInternal(Calendar.DisplayModeProperty, newMode); 
                        this.FocusDate(this.DisplayMode == CalendarMode.Month ? this.CurrentDate : this.DisplayDate);
                    }
                }
            } 
        },
 
//        private Date? 
        GetDateOffset:function(/*Date*/ date, /*int*/ offset, /*CalendarMode*/ displayMode) 
        {
            /*Date?*/var result = null; 
            switch (displayMode)
            {
                case CalendarMode.Month:
                { 
                    result = DateTimeHelper.AddMonths(date, offset);
                    break; 
                } 

                case CalendarMode.Year: 
                {
                    result = DateTimeHelper.AddYears(date, offset);
                    break;
                } 

                case CalendarMode.Decade: 
                { 
                    result = DateTimeHelper.AddYears(this.DisplayDate, offset * YEARS_PER_DECADE);
                    break; 
                }

                default:
                Debug.Assert(false); 
                break;
            } 
 
            return result;
        }, 

//        private void 
        MoveDisplayTo:function(/*Date?*/ date)
        {
            if (date != null) 
            {
                /*Date*/var d = date.Date; 
                switch (this.DisplayMode) 
                {
                    case CalendarMode.Month: 
                    {
                        this.SetCurrentValueInternal(Calendar.DisplayDateProperty, DateTimeHelper.DiscardDayTime(d));
                        this.CurrentDate = d;
                        this.UpdateCellItems(); 

                        break; 
                    } 

                    case CalendarMode.Year: 
                    case CalendarMode.Decade:
                    {
                        this.SetCurrentValueInternal(Calendar.DisplayDateProperty, d);
                        this.UpdateCellItems(); 

                        break; 
                    } 

                    default: 
//                    Debug.Assert(false);
                    break;
                }
 
                this.FocusDate(d);
            } 
        }, 

//        internal void 
        OnNextClick:function() 
        {
            /*Date?*/var nextDate = this.GetDateOffset(this.DisplayDate, 1, this.DisplayMode);
            if (nextDate != null)
            { 
                this.MoveDisplayTo(DateTimeHelper.DiscardDayTime(nextDate));
            } 
        }, 

//        internal void 
        OnPreviousClick:function() 
        {
            /*Date?*/var nextDate = this.GetDateOffset(this.DisplayDate, -1, this.DisplayMode);
            if (nextDate != null)
            { 
                this.MoveDisplayTo(DateTimeHelper.DiscardDayTime(nextDate));
            } 
        }, 

//        internal void 
        OnSelectedDatesCollectionChanged:function(/*SelectionChangedEventArgs*/ e) 
        {
            if (this.IsSelectionChanged(e))
            {
//                if (AutomationPeer.ListenerExists(AutomationEvents.SelectionItemPatternOnElementSelected) || 
//                    AutomationPeer.ListenerExists(AutomationEvents.SelectionItemPatternOnElementAddedToSelection) ||
//                    AutomationPeer.ListenerExists(AutomationEvents.SelectionItemPatternOnElementRemovedFromSelection)) 
//                { 
//                    CalendarAutomationPeer peer = FrameworkElementAutomationPeer.FromElement(this) as CalendarAutomationPeer;
//                    if (peer != null) 
//                    {
//                        peer.RaiseSelectionEvents(e);
//                    }
//                } 

            	this.CoerceFromSelection(); 
            	this.OnSelectedDatesChanged(e); 
            }
        }, 

//        internal void 
        UpdateCellItems:function()
        {
            /*CalendarItem*/var monthControl = this.MonthControl; 
            if (monthControl != null)
            { 
                switch (this.DisplayMode) 
                {
                    case CalendarMode.Month: 
                    {
                        monthControl.UpdateMonthMode();
                        break;
                    } 

                    case CalendarMode.Year: 
                    { 
                        monthControl.UpdateYearMode();
                        break; 
                    }

                    case CalendarMode.Decade:
                    { 
                        monthControl.UpdateDecadeMode();
                        break; 
                    } 

                    default: 
                        Debug.Assert(false);
                        break;
                }
            } 
        },

//        private void 
        CoerceFromSelection:function()
        {
        	this.CoerceValue(Calendar.DisplayDateStartProperty); 
        	this.CoerceValue(Calendar.DisplayDateEndProperty);
        	this.CoerceValue(Calendar.DisplayDateProperty); 
        }, 

        // This method adds the days that were selected by Keyboard to the SelectedDays Collection 
//        private void 
        AddKeyboardSelection:function()
        {
            if (this.HoverStart != null)
            { 
                this.SelectedDates.ClearInternal();
 
                // In keyboard selection, we are sure that the collection does not include any blackout days 
                this.SelectedDates.AddRange(this.HoverStart, this.CurrentDate);
            } 
        },
        

//        private void 
        OnSelectedMonthChanged:function(/*Date?*/ selectedMonth) 
        {
            if (selectedMonth != null)
            {
//                Debug.Assert(this.DisplayMode == CalendarMode.Year); 
                this.SetCurrentValueInternal(Calendar.DisplayDateProperty, selectedMonth);
 
                this.UpdateCellItems(); 

                this.FocusDate(selectedMonth); 
            }
        },

//        private void 
        OnSelectedYearChanged:function(/*Date?*/ selectedYear) 
        {
            if (selectedYear != null) 
            { 
//                Debug.Assert(this.DisplayMode == CalendarMode.Decade);
                this.SetCurrentValueInternal(Calendar.DisplayDateProperty, selectedYear); 

                this.UpdateCellItems();

                this.FocusDate(selectedYear); 
            }
        }, 
 
//        internal void 
        FocusDate:function(/*Date*/ date)
        { 
            if (this.MonthControl != null)
            {
                this.MonthControl.FocusDate(date);
            } 
        },
 
        

//        private bool 
        ProcessCalendarKey:function(/*KeyEventArgs*/ e) 
        { 
            if (this.DisplayMode == CalendarMode.Month)
            { 
                // If a blackout day is inactive, when clicked on it, the previous inactive day which is not a blackout day can get the focus.
                // In this case we should allow keyboard functions on that inactive day
                /*CalendarDayButton*/var currentDayButton = (this.MonthControl != null) ? MonthControl.GetCalendarDayButton(this.CurrentDate) : null;
 
                if (DateTimeHelper.CompareYearMonth(this.CurrentDate, this.DisplayDateInternal) != 0 
                		&& currentDayButton != null && !currentDayButton.IsInactive)
                { 
                    return false; 
                }
            } 
            
            var ctrlOut = {"ctrl" : null};
            var shiftOut = {"shift" : null};
            CalendarKeyboardHelper.GetMetaKeyState(/*out ctrl*/ctrlOut, /*out shift*/shiftOut);
            var ctrl = ctrlOut.ctrl,
            shift = shiftOut.shift;
 
            switch (e.Key)
            { 
                case Key.Up: 
                {
                    this.ProcessUpKey(ctrl, shift); 
                    return true;
                }

                case Key.Down: 
                {
                	this.ProcessDownKey(ctrl, shift); 
                    return true; 
                }
 
                case Key.Left:
                {
                	this.ProcessLeftKey(shift);
                    return true; 
                }
 
                case Key.Right: 
                {
                	this.ProcessRightKey(shift); 
                    return true;
                }

                case Key.PageDown: 
                {
                	this.ProcessPageDownKey(shift); 
                    return true; 
                }
 
                case Key.PageUp:
                {
                	this.ProcessPageUpKey(shift);
                    return true; 
                }
 
                case Key.Home: 
                {
                	this.ProcessHomeKey(shift); 
                    return true;
                }

                case Key.End: 
                {
                	this.ProcessEndKey(shift); 
                    return true; 
                }
 
                case Key.Enter:
                case Key.Space:
                {
                    return this.ProcessEnterKey(); 
                }
            } 
 
            return false;
        }, 

//        private void 
        ProcessDownKey:function(/*bool*/ ctrl, /*bool*/ shift)
        {
            switch (this.DisplayMode) 
            {
                case CalendarMode.Month: 
                { 
                    if (!ctrl || shift)
                    { 
                        /*Date?*/var selectedDate = this._blackoutDates.GetNonBlackoutDate(DateTimeHelper.AddDays(this.CurrentDate, COLS), 1);
                        this.ProcessSelection(shift, selectedDate);
                    }
 
                    break;
                } 
 
                case CalendarMode.Year:
                { 
                    if (ctrl)
                    {
                        this.SetCurrentValueInternal(DisplayModeProperty, CalendarMode.Month);
                        this.FocusDate(this.DisplayDate); 
                    }
                    else 
                    { 
                        /*Date?*/var selectedMonth = DateTimeHelper.AddMonths(this.DisplayDate, YEAR_COLS);
                        this.OnSelectedMonthChanged(selectedMonth); 
                    }

                    break;
                } 

                case CalendarMode.Decade: 
                { 
                    if (ctrl)
                    { 
                        this.SetCurrentValueInternal(DisplayModeProperty, CalendarMode.Year);
                        this.FocusDate(this.DisplayDate);
                    }
                    else 
                    {
                        /*Date?*/var selectedYear = DateTimeHelper.AddYears(this.DisplayDate, YEAR_COLS); 
                        this.OnSelectedYearChanged(selectedYear); 
                    }
 
                    break;
                }
            }
        }, 

//        private void 
        ProcessEndKey:function(/*bool*/ shift) 
        { 
            switch (this.DisplayMode)
            { 
                case CalendarMode.Month:
                {
                    if (this.DisplayDate != null)
                    { 
                        /*Date?*/var selectedDate = new Date(this.DisplayDateInternal.Year, this.DisplayDateInternal.Month, 1);
 
                        if (DateTimeHelper.CompareYearMonth(Date.MaxValue, selectedDate) > 0) 
                        {
                            // since DisplayDate is not equal to Date.MaxValue we are sure selectedDate is not null 
                            selectedDate = DateTimeHelper.AddMonths(selectedDate, 1);
                            selectedDate = DateTimeHelper.AddDays(selectedDate, -1);
                        }
                        else 
                        {
                            selectedDate = Date.MaxValue; 
                        } 

                        ProcessSelection(shift, selectedDate); 
                    }

                    break;
                } 

                case CalendarMode.Year: 
                { 
                    /*Date*/var selectedMonth = new Date(this.DisplayDate.Year, 12, 1);
                    this.OnSelectedMonthChanged(selectedMonth); 
                    break;
                }

                case CalendarMode.Decade: 
                {
                    /*Date?*/var selectedYear = new Date(DateTimeHelper.EndOfDecade(this.DisplayDate), 1, 1); 
                    this.OnSelectedYearChanged(selectedYear); 
                    break;
                } 
            }
        },

//        private bool 
        ProcessEnterKey:function() 
        {
            switch (this.DisplayMode) 
            { 
                case CalendarMode.Year:
                { 
                    this.SetCurrentValueInternal(Calendar.DisplayModeProperty, CalendarMode.Month);
                    this.FocusDate(this.DisplayDate);
                    return true;
                } 

                case CalendarMode.Decade: 
                { 
                    this.SetCurrentValueInternal(Calendar.DisplayModeProperty, CalendarMode.Year);
                    this.FocusDate(this.DisplayDate); 
                    return true;
                }
            }
 
            return false;
        }, 
 
//        private void 
        ProcessHomeKey:function(/*bool*/ shift)
        { 
            switch (this.DisplayMode)
            {
                case CalendarMode.Month:
                { 
                    //
                    /*Date?*/var selectedDate = new Date(this.DisplayDateInternal.Year, this.DisplayDateInternal.Month, 1); 
                    this.ProcessSelection(shift, selectedDate); 
                    break;
                } 

                case CalendarMode.Year:
                {
                    /*Date*/var selectedMonth = new Date(this.DisplayDate.Year, 1, 1); 
                    this.OnSelectedMonthChanged(selectedMonth);
                    break; 
                } 

                case CalendarMode.Decade: 
                {
                    /*Date?*/var selectedYear = new Date(DateTimeHelper.DecadeOfDate(this.DisplayDate), 1, 1);
                    this.OnSelectedYearChanged(selectedYear);
                    break; 
                }
            } 
        },

//        private void 
        ProcessLeftKey:function(/*bool*/ shift) 
        {
            var moveAmmount = (!this.IsRightToLeft) ? -1 : 1;
            switch (this.DisplayMode)
            { 
                case CalendarMode.Month:
                { 
                    /*Date?*/var selectedDate = this._blackoutDates.GetNonBlackoutDate(DateTimeHelper.AddDays(this.CurrentDate, moveAmmount), moveAmmount); 
                    this.ProcessSelection(shift, selectedDate);
                    break; 
                }

                case CalendarMode.Year:
                { 
                    /*Date?*/var selectedMonth = DateTimeHelper.AddMonths(this.DisplayDate, moveAmmount);
                    this.OnSelectedMonthChanged(selectedMonth); 
                    break; 
                }
 
                case CalendarMode.Decade:
                {
                    /*Date?*/var selectedYear = DateTimeHelper.AddYears(this.DisplayDate, moveAmmount);
                    this.OnSelectedYearChanged(selectedYear); 
                    break;
                } 
            } 
        },
 
//        private void 
        ProcessPageDownKey:function(/*bool*/ shift)
        {
            switch (this.DisplayMode)
            { 
                case CalendarMode.Month:
                { 
                    /*Date?*/var selectedDate = this._blackoutDates.GetNonBlackoutDate(DateTimeHelper.AddMonths(this.CurrentDate, 1), 1); 
                    this.ProcessSelection(shift, selectedDate);
                    break; 
                }

                case CalendarMode.Year:
                { 
                    /*Date?*/var selectedMonth = DateTimeHelper.AddYears(this.DisplayDate, 1);
                    this.OnSelectedMonthChanged(selectedMonth); 
                    break; 
                }
 
                case CalendarMode.Decade:
                {
                    /*Date?*/var selectedYear = DateTimeHelper.AddYears(this.DisplayDate, 10 );
                    this.OnSelectedYearChanged(selectedYear); 
                    break;
                } 
            } 
        },
 
//        private void 
        ProcessPageUpKey:function(/*bool*/ shift)
        {
            switch (this.DisplayMode)
            { 
                case CalendarMode.Month:
                { 
                    /*Date?*/var selectedDate = this._blackoutDates.GetNonBlackoutDate(DateTimeHelper.AddMonths(this.CurrentDate, -1), -1); 
                    ProcessSelection(shift, selectedDate);
                    break; 
                }

                case CalendarMode.Year:
                { 
                	/*Date?*/var selectedMonth = DateTimeHelper.AddYears(this.DisplayDate, -1);
                    OnSelectedMonthChanged(selectedMonth); 
                    break; 
                }
 
                case CalendarMode.Decade:
                {
                	/*Date?*/var selectedYear = DateTimeHelper.AddYears(this.DisplayDate, -10);
                    OnSelectedYearChanged(selectedYear); 
                    break;
                } 
            } 
        },
 
//        private void 
        ProcessRightKey:function(/*bool*/ shift)
        {
            var moveAmmount = (!this.IsRightToLeft) ? 1 : -1;
            switch (this.DisplayMode) 
            {
                case CalendarMode.Month: 
                { 
                	/*Date?*/var selectedDate = this._blackoutDates.GetNonBlackoutDate(DateTimeHelper.AddDays(this.CurrentDate, moveAmmount), moveAmmount);
                	this.ProcessSelection(shift, selectedDate); 
                    break;
                }

                case CalendarMode.Year: 
                {
                	/*Date?*/var selectedMonth = DateTimeHelper.AddMonths(this.DisplayDate, moveAmmount); 
                	this.OnSelectedMonthChanged(selectedMonth); 
                    break;
                } 

                case CalendarMode.Decade:
                {
                	/*Date?*/var selectedYear = DateTimeHelper.AddYears(this.DisplayDate, moveAmmount); 
                	this.OnSelectedYearChanged(selectedYear);
                    break; 
                } 
            }
        }, 

//        private void 
        ProcessSelection:function(/*bool*/ shift, /*Date?*/ lastSelectedDate)
        {
            if (this.SelectionMode == CalendarSelectionMode.None && lastSelectedDate != null) 
            {
                this.OnDayClick(lastSelectedDate); 
                return; 
            }
 
            if (lastSelectedDate != null && IsValidKeyboardSelection(this, lastSelectedDate))
            {
                if (this.SelectionMode == CalendarSelectionMode.SingleRange || this.SelectionMode == CalendarSelectionMode.MultipleRange)
                { 
                    this.SelectedDates.ClearInternal();
                    if (shift) 
                    { 
                        this._isShiftPressed = true;
                        if (!this.HoverStart != null) 
                        {
                            this.HoverStart = this.HoverEnd = this.CurrentDate;
                        }
 
                        // If we hit a BlackOutDay with keyboard we do not update the HoverEnd
                        /*CalendarDateRange*/var range; 
 
                        if (Date.Compare(this.HoverStart, lastSelectedDate) < 0)
                        { 
                            range = new CalendarDateRange(this.HoverStart, lastSelectedDate);
                        }
                        else
                        { 
                            range = new CalendarDateRange(lastSelectedDate, this.HoverStart);
                        } 
 
                        if (!this.BlackoutDates.ContainsAny(range))
                        { 
                            this._currentDate = lastSelectedDate;
                            this.HoverEnd = lastSelectedDate;
                        }
 
                        this.OnDayClick(this.CurrentDate);
                    } 
                    else 
                    {
                        this.HoverStart = this.HoverEnd = this.CurrentDate = lastSelectedDate; 
                        this.AddKeyboardSelection();
                        this.OnDayClick(lastSelectedDate);
                    }
                } 
                else
                { 
                    // ON CLEAR 
                    this.CurrentDate = lastSelectedDate;
                    this.HoverStart = this.HoverEnd = null; 
                    if (this.SelectedDates.Count > 0)
                    {
                        this.SelectedDates.Set(0, lastSelectedDate);
                    } 
                    else
                    { 
                        this.SelectedDates.Add(lastSelectedDate); 
                    }
 
                    this.OnDayClick(lastSelectedDate);
                }

                this.UpdateCellItems(); 
            }
        }, 
 
//        private void 
        ProcessShiftKeyUp:function()
        { 
            if (this._isShiftPressed && (this.SelectionMode == CalendarSelectionMode.SingleRange || this.SelectionMode == CalendarSelectionMode.MultipleRange))
            {
                AddKeyboardSelection();
                this._isShiftPressed = false; 
                this.HoverStart = this.HoverEnd = null;
            } 
        },

//        private void 
        ProcessUpKey:function(/*bool*/ ctrl, /*bool*/ shift) 
        {
            switch (this.DisplayMode)
            {
                case CalendarMode.Month: 
                {
                    if (ctrl) 
                    { 
                        this.SetCurrentValueInternal(DisplayModeProperty, CalendarMode.Year);
                        FocusDate(this.DisplayDate); 
                    }
                    else
                    {
                    	/*Date?*/var selectedDate = this._blackoutDates.GetNonBlackoutDate(DateTimeHelper.AddDays(this.CurrentDate, -COLS), -1); 
                        ProcessSelection(shift, selectedDate);
                    } 
 
                    break;
                } 

                case CalendarMode.Year:
                {
                    if (ctrl) 
                    {
                        this.SetCurrentValueInternal(DisplayModeProperty, CalendarMode.Decade); 
                        FocusDate(this.DisplayDate); 
                    }
                    else 
                    {
                    	/*Date?*/var selectedMonth = DateTimeHelper.AddMonths(this.DisplayDate, -YEAR_COLS);
                        OnSelectedMonthChanged(selectedMonth);
                    } 

                    break; 
                } 

                case CalendarMode.Decade: 
                {
                    if (!ctrl)
                    {
                        /*Date?*/var selectedYear = DateTimeHelper.AddYears(this.DisplayDate, -YEAR_COLS); 
                        OnSelectedYearChanged(selectedYear);
                    } 
 
                    break;
                } 
            }
        }
	});
	
	Object.defineProperties(Calendar.prototype,{
        /// <summary> 
        /// Occurs when the DisplayDate property is changed. 
        /// </summary>
//        public event EventHandler<CalendarDateChangedEventArgs> 
		DisplayDateChanged:
		{
			get:function(){
				if(this._DisplayDateChanged === undefined){
					this._DisplayDateChanged = new Delegate();
				}
				
				return this._DisplayDateChanged;
			}
		}, 

        /// <summary>
        /// Occurs when the DisplayMode property is changed.
        /// </summary> 
//        public event EventHandler<CalendarModeChangedEventArgs> 
		DisplayModeChanged:
		{
			get:function(){
				if(this._DisplayModeChanged === undefined){
					this._DisplayModeChanged = new Delegate();
				}
				
				return this._DisplayModeChanged;
			}
		},
 
        /// <summary> 
        /// Occurs when the SelectionMode property is changed.
        /// </summary> 
//        public event EventHandler<EventArgs> 
		SelectionModeChanged:
		{
			get:function(){
				if(this._SelectionModeChanged === undefined){
					this._SelectionModeChanged = new Delegate();
				}
				
				return this._SelectionModeChanged;
			}
		},  
        
        
        /// <summary>
        /// Gets or sets the dates that are not selectable. 
        /// </summary> 
//        public CalendarBlackoutDatesCollection 
		BlackoutDates:
        { 
            get:function() { return this._blackoutDates; }
        },
 
        /// <summary>
        /// Gets or sets the style for displaying a CalendarButton. 
        /// </summary>
//        public Style 
        CalendarButtonStyle:
        {
            get:function() { return this.GetValue(Calendar.CalendarButtonStyleProperty); }, 
            set:function(value) { this.SetValue(Calendar.CalendarButtonStyleProperty, value); }
        },
        
        /// <summary>
        /// Gets or sets the style for displaying a day. 
        /// </summary>
//        public Style 
        CalendarDayButtonStyle: 
        { 
            get:function() { return this.GetValue(Calendar.CalendarDayButtonStyleProperty); },
            set:function(value) { this.SetValue(Calendar.CalendarDayButtonStyleProperty, value); } 
        },
        /// <summary>
        /// Gets or sets the date to display.
        /// </summary> 
        ///
//        public Date 
        DisplayDate: 
        { 
            get:function() { return this.GetValue(Calendar.DisplayDateProperty); },
            set:function(value) { this.SetValue(Calendar.DisplayDateProperty, value); } 
        },
        /// <summary> 
        /// Gets or sets the style for a Month.
        /// </summary> 
//        public Style 
        CalendarItemStyle:
        {
            get:function() { return this.GetValue(Calendar.CalendarItemStyleProperty); },
            set:function(value) { this.SetValue(Calendar.CalendarItemStyleProperty, value); } 
        },
        
        /// <summary> 
        /// Gets or sets the last date to be displayed.
        /// </summary> 
        /// 
//        public Date? 
        DisplayDateEnd:
        { 
            get:function() { return this.GetValue(Calendar.DisplayDateEndProperty); },
            set:function(value) { this.SetValue(Calendar.DisplayDateEndProperty, value); }
        },
      /// <summary>
        /// Gets or sets the first date to be displayed.
        /// </summary> 
        ///
//        public Date? 
        DisplayDateStart: 
        { 
            get:function() { return this.GetValue(Calendar.DisplayDateStartProperty); },
            set:function(value) { this.SetValue(Calendar.DisplayDateStartProperty, value); } 
        },
        
        /// <summary>
        /// Gets or sets a value indicating whether the calendar is displayed in months or years. 
        /// </summary> 
//        public CalendarMode 
        DisplayMode:
        { 
            get:function() { return this.GetValue(Calendar.DisplayModeProperty); },
            set:function(value) { this.SetValue(Calendar.DisplayModeProperty, value); }
        },
        /// <summary>
        /// Gets or sets the day that is considered the beginning of the week. 
        /// </summary>
//        public DayOfWeek 
        FirstDayOfWeek: 
        { 
            get:function() { return this.GetValue(Calendar.FirstDayOfWeekProperty); },
            set:function(value) { this.SetValue(Calendar.FirstDayOfWeekProperty, value); } 
        },
        /// <summary>
        /// Gets or sets a value indicating whether the current date is highlighted. 
        /// </summary>
//        public bool 
        IsTodayHighlighted: 
        { 
            get:function() { return this.GetValue(Calendar.IsTodayHighlightedProperty); },
            set:function(value) { this.SetValue(Calendar.IsTodayHighlightedProperty, value); } 
        },
        /// <summary>
        /// Gets or sets the currently selected date.
        /// </summary>
        /// 
//        public Date? 
        SelectedDate:
        { 
            get:function() { return this.GetValue(Calendar.SelectedDateProperty); }, 
            set:function(value) { this.SetValue(Calendar.SelectedDateProperty, value); }
        },
        
        /// <summary>
        /// Gets the dates that are currently selected. 
        /// </summary>
//        public SelectedDatesCollection 
        SelectedDates:
        {
            get:function() { return this._selectedDates; } 
        },

        /// <summary>
        /// Gets or sets the selection mode for the calendar.
        /// </summary> 
//        public CalendarSelectionMode 
        SelectionMode:
        { 
            get:function() { return this.GetValue(Calendar.SelectionModeProperty); }, 
            set:function(value) { this.SetValue(Calendar.SelectionModeProperty, value); }
        }, 
//        internal event MouseButtonEventHandler 
        DayButtonMouseUp:
		{
			get:function(){
				if(this._DayButtonMouseUp === undefined){
					this._DayButtonMouseUp = new Delegate();
				}
				
				return this._DayButtonMouseUp;
			}
		},

//        internal event RoutedEventHandler 
        DayOrMonthPreviewKeyDown:
		{
			get:function(){
				if(this._DayOrMonthPreviewKeyDown === undefined){
					this._DayOrMonthPreviewKeyDown = new Delegate();
				}
				
				return this._DayOrMonthPreviewKeyDown;
			}
		}, 
 
        /// <summary>
        /// This flag is used to determine whether DatePicker should change its
        /// DisplayDate because of a SelectedDate change on its Calendar
        /// </summary> 
//        internal bool 
        DatePickerDisplayDateFlag:
        { 
            get:function(){ return this._DatePickerDisplayDateFlag;},
            set:function(value){this._DatePickerDisplayDateFlag = value;}
        }, 

//        internal Date 
        DisplayDateInternal:
        {
            get:function() {return this._DisplayDateInternal;},
            /*private*/ set:function(value){this._DisplayDateInternal = value;}
        }, 
 
//        internal Date 
        DisplayDateEndInternal:
        { 
            get:function()
            {
            	if(this.DisplayDateEnd == null){
            		return Date.MaxValue;
            	}
            	return this.DisplayDateEnd;
//                return this.DisplayDateEnd.GetValueOrDefault(Date.MaxValue);
            } 
        },
 
//        internal Date 
        DisplayDateStartInternal: 
        {
            get:function() 
            {
             	if(this.DisplayDateStart == null){
            		return Date.MinValue;
            	}
             	return this.DisplayDateEnd;
//                return this.DisplayDateStart.GetValueOrDefault(Date.MinValue);
            }
        }, 

//        internal Date 
        CurrentDate: 
        { 
            get:function() { 
              	if(this._currentDate == null){
            		return this.DisplayDateInternal;
            	}
             	return this._currentDate;
//            	return this._currentDate.GetValueOrDefault(this.DisplayDateInternal); 
            },
            set:function(value) { this._currentDate = value; } 
        },

//        internal Date? 
        HoverStart:
        { 
            get:function()
            { 
                return this.SelectionMode == CalendarSelectionMode.None ? null : this._hoverStart; 
            },
            set:function(value)
            {
            	this._hoverStart = value;
            } 
        },
 
//        internal Date? 
        HoverEnd: 
        {
            get:function() 
            {
                return this.SelectionMode == CalendarSelectionMode.None ? null : this._hoverEnd;
            },
            set:function(value)
            { 
            	this._hoverEnd = value; 
            }
        }, 

//        internal CalendarItem 
        MonthControl:
        {
            get:function() { return this._monthControl; } 
        },
 
//        internal Date 
        DisplayMonth: 
        {
            get:function() 
            {
                return DateTimeHelper.DiscardDayTime(this.DisplayDate);
            }
        }, 

//        internal Date 
        DisplayYear: 
        { 
            get:function()
            { 
                return new Date(this.DisplayDate.Year, 1, 1);
            }
        },
        
	});
	
	Object.defineProperties(Calendar,{
//		public static readonly RoutedEvent 
		SelectedDatesChangedEvent:
        {
        	get:function(){
        		if(Calendar._SelectedDatesChangedEvent === undefined){
        			Calendar._SelectedDatesChangedEvent = EventManager.RegisterRoutedEvent("SelectedDatesChanged", RoutingStrategy.Direct, 
        					EventHandler.Type, Calendar.Type);
        		}
        		
        		return Calendar._SelectedDatesChangedEvent;
        	}
        },  
		/// <summary>
        /// Identifies the CalendarButtonStyle dependency property. 
        /// </summary>
//        public static readonly DependencyProperty 
		CalendarButtonStyleProperty:
        {
        	get:function(){
        		if(Calendar._CalendarButtonStyleProperty === undefined){
        			Calendar._CalendarButtonStyleProperty =
        	            DependencyProperty.Register(
        	                    "CalendarButtonStyle", 
        	                    Style.Type,
        	                    Calendar.Type); 
        		}
        		
        		return Calendar._CalendarButtonStyleProperty;
        	}
        }, 

        /// <summary>
        /// Identifies the DayButtonStyle dependency property. 
        /// </summary>
//        public static readonly DependencyProperty 
		CalendarDayButtonStyleProperty:
        {
        	get:function(){
        		if(Calendar._CalendarDayButtonStyleProperty === undefined){
        			Calendar._CalendarDayButtonStyleProperty = 
        	            DependencyProperty.Register( 
        	                    "CalendarDayButtonStyle",
        	                    Style.Type, 
        	                    Calendar.Type);
        		}
        		
        		return Calendar._CalendarDayButtonStyleProperty;
        	}
        }, 
 
        /// <summary> 
        /// Identifies the MonthStyle dependency property.
        /// </summary> 
//        public static readonly DependencyProperty 
		CalendarItemStyleProperty:
        {
        	get:function(){
        		if(Calendar._CalendarItemStyleProperty === undefined){
        			Calendar._CalendarItemStyleProperty =
        	            DependencyProperty.Register(
        	                    "CalendarItemStyle",
        	                    Style.Type, 
        	                    Calendar.Type);
        		}
        		
        		return Calendar._CalendarItemStyleProperty;
        	}
        }, 

        /// <summary>
        /// Identifies the DisplayDate dependency property. 
        /// </summary>
//        public static readonly DependencyProperty 
		DisplayDateProperty:
        {
        	get:function(){
        		if(Calendar._DisplayDateProperty === undefined){
        			Calendar._DisplayDateProperty = 
        	            DependencyProperty.Register( 
        	                    "DisplayDate",
        	                    Date.Type, 
        	                    Calendar.Type,
        	                    /*new FrameworkPropertyMetadata(Date.MinValue, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
        	                    		new PropertyChangedCallback(null, OnDisplayDateChanged),
        	                    				new CoerceValueCallback(null, CoerceDisplayDate))*/
        	                    FrameworkPropertyMetadata.Build4(Date.MinValue, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
        	                    		new PropertyChangedCallback(null, OnDisplayDateChanged),
        	                    				new CoerceValueCallback(null, CoerceDisplayDate)));
        		}
        		
        		return Calendar._DisplayDateProperty;
        	}
        }, 
        /// <summary>
        /// Identifies the DisplayDateEnd dependency property. 
        /// </summary> 
//        public static readonly DependencyProperty 
		DisplayDateEndProperty:
        {
        	get:function(){
        		if(Calendar._DisplayDateEndProperty === undefined){
        			Calendar._DisplayDateEndProperty =
        	            DependencyProperty.Register( 
        	                    "DisplayDateEnd",
        	                    Date.Type,
        	                    Calendar.Type,
        	                    /*new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		new PropertyChangedCallback(null, OnDisplayDateEndChanged), 
        	                    		new CoerceValueCallback(null, CoerceDisplayDateEnd))*/
        	                    FrameworkPropertyMetadata.Build4(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		new PropertyChangedCallback(null, OnDisplayDateEndChanged), 
        	                    		new CoerceValueCallback(null, CoerceDisplayDateEnd))); 
        		}
        		
        		return Calendar._DisplayDateEndProperty;
        	}
        }, 

      /// <summary>
        /// Identifies the DisplayDateStart dependency property. 
        /// </summary>
//        public static readonly DependencyProperty 
		DisplayDateStartProperty:
        {
        	get:function(){
        		if(Calendar._DisplayDateStartProperty === undefined){
        			Calendar._DisplayDateStartProperty = 
        	            DependencyProperty.Register( 
        	                    "DisplayDateStart",
        	                    Date.Type, 
        	                    Calendar.Type,
        	                    /*new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
        	                    		new PropertyChangedCallback(null, OnDisplayDateStartChanged), 
        	                    				new CoerceValueCallback(null, CoerceDisplayDateStart))*/
        	                    FrameworkPropertyMetadata.Build4(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
        	                    		new PropertyChangedCallback(null, OnDisplayDateStartChanged), 
        	                    				new CoerceValueCallback(null, CoerceDisplayDateStart)));
        		}
        		
        		return Calendar._DisplayDateStartProperty;
        	}
        }, 

        /// <summary>
        /// Identifies the DisplayMode dependency property. 
        /// </summary> 
//        public static readonly DependencyProperty 
		DisplayModeProperty:
        {
        	get:function(){
        		if(Calendar._DisplayModeProperty === undefined){
        			Calendar._DisplayModeProperty =
        	            DependencyProperty.Register( 
        	                    "DisplayMode",
        	                    Number.Type,
        	                    Calendar.Type,
        	                    /*new FrameworkPropertyMetadata(CalendarMode.Month, 
        	                    		FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		new PropertyChangedCallback(null, OnDisplayModePropertyChanged))*/
        	                    FrameworkPropertyMetadata.Build3PCCB(CalendarMode.Month, 
        	                    		FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		new PropertyChangedCallback(null, OnDisplayModePropertyChanged)), 
        	                    new ValidateValueCallback(null, IsValidDisplayMode));
        		}
        		
        		return Calendar._DisplayModeProperty;
        	}
        }, 
        /// <summary>
        /// Identifies the FirstDayOfWeek dependency property. 
        /// </summary>
//        public static readonly DependencyProperty 
		FirstDayOfWeekProperty:
        {
        	get:function(){
        		if(Calendar._FirstDayOfWeekProperty === undefined){
        			Calendar._FirstDayOfWeekProperty = 
        	            DependencyProperty.Register( 
        	                    "FirstDayOfWeek",
        	                    Number.Type, 
        	                    Calendar.Type,
        	                    /*new FrameworkPropertyMetadata(DateTimeHelper.GetCurrentDateFormat().FirstDayOfWeek,
        	                    		new PropertyChangedCallback(null, OnFirstDayOfWeekChanged))*/
        	                    FrameworkPropertyMetadata.BuildWithDVandPCCB(DayOfWeek.Sunday/*DateTimeHelper.GetCurrentDateFormat().FirstDayOfWeek*/,
        	                    		new PropertyChangedCallback(null, OnFirstDayOfWeekChanged)),
        	                    new ValidateValueCallback(null, IsValidFirstDayOfWeek)); 
        		}
        		
        		return Calendar._FirstDayOfWeekProperty;
        	}
        }, 
        /// <summary>
        /// Identifies the IsTodayHighlighted dependency property. 
        /// </summary>
//        public static readonly DependencyProperty 
		IsTodayHighlightedProperty:
        {
        	get:function(){
        		if(Calendar._IsTodayHighlightedProperty === undefined){
        			Calendar._IsTodayHighlightedProperty = 
        	            DependencyProperty.Register( 
        	                    "IsTodayHighlighted",
        	                    Boolean.Type, 
        	                    Calendar.Type,
        	                    /*new FrameworkPropertyMetadata(true, 
        	                    		new PropertyChangedCallback(null, OnIsTodayHighlightedChanged))*/
        	                    FrameworkPropertyMetadata.BuildWithDVandPCCB(true, 
        	                    		new PropertyChangedCallback(null, OnIsTodayHighlightedChanged)));
        		}
        		
        		return Calendar._IsTodayHighlightedProperty;
        	}
        }, 
        /// <summary>
        /// Identifies the SelectedDate dependency property.
        /// </summary> 
//        public static readonly DependencyProperty 
		SelectedDateProperty:
        {
        	get:function(){
        		if(Calendar._SelectedDateProperty === undefined){
        			Calendar._SelectedDateProperty =
        	            DependencyProperty.Register( 
        	                    "SelectedDate", 
        	                    Date.Type,
        	                    Calendar.Type, 
        	                    /*new FrameworkPropertyMetadata(null, 
        	                    		FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		new PropertyChangedCallback(null, OnSelectedDateChanged))*/
        	                    FrameworkPropertyMetadata.Build3PCCB(null, 
        	                    		FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		new PropertyChangedCallback(null, OnSelectedDateChanged)));
        		}
        		
        		return Calendar._SelectedDateProperty;
        	}
        }, 
        /// <summary>
        /// Identifies the SelectionMode dependency property.
        /// </summary> 
//        public static readonly DependencyProperty 
		SelectionModeProperty:
        {
        	get:function(){
        		if(Calendar._SelectionModeProperty === undefined){
        			Calendar._SelectionModeProperty =
        	            DependencyProperty.Register( 
        	                    "SelectionMode", 
        	                    Number.Type,
        	                    Calendar.Type, 
        	                    /*new FrameworkPropertyMetadata(CalendarSelectionMode.SingleDate, OnSelectionModeChanged)*/
        	                    FrameworkPropertyMetadata.BuildWithDVandPCCB(CalendarSelectionMode.SingleDate, OnSelectionModeChanged),
        	                    new ValidateValueCallback(null, IsValidSelectionMode));
        		}
        		
        		return Calendar._SelectionModeProperty;
        	}
        }, 
	});
	
	 /// <summary> 
    /// DisplayDateProperty property changed handler.
    /// </summary> 
    /// <param name="d">Calendar that changed its DisplayDate.</param> 
    /// <param name="e">DependencyPropertyChangedEventArgs.</param>
//    private static void 
	function OnDisplayDateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        /*Calendar*/var c = d instanceof Calendar ? d : null;
//        Debug.Assert(c != null);

        c.DisplayDateInternal = DateTimeHelper.DiscardDayTime(e.NewValue);
        c.UpdateCellItems(); 
        c.OnDisplayDateChanged(new CalendarDateChangedEventArgs(e.OldValue, e.NewValue)); 
    }

//    private static object 
	function CoerceDisplayDate(/*DependencyObject*/ d, /*object*/ value)
    {
		/*Calendar*/var c = d instanceof Calendar ? d : null;

        /*Date*/var date = value;
        if (c.DisplayDateStart != null && (date < c.DisplayDateStart)) 
        { 
            value = c.DisplayDateStart;
        } 
        else if (c.DisplayDateEnd != null && (date > c.DisplayDateEnd))
        {
            value = c.DisplayDateEnd;
        } 

        return value; 
    } 
    
  /// <summary> 
    /// DisplayDateEndProperty property changed handler. 
    /// </summary>
    /// <param name="d">Calendar that changed its DisplayDateEnd.</param> 
    /// <param name="e">DependencyPropertyChangedEventArgs.</param>
//    private static void 
	function OnDisplayDateEndChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
		/*Calendar*/var c = d instanceof Calendar ? d : null;
//        Debug.Assert(c != null);

        c.CoerceValue(Calendar.DisplayDateProperty); 
        c.UpdateCellItems();
    } 

//    private static object 
	function CoerceDisplayDateEnd(/*DependencyObject*/ d, /*object*/ value)
    {
		/*Calendar*/var c = d instanceof Calendar ? d : null;

        /*Date?*/var date = value; 

        if (date != null)
        { 
            if (c.DisplayDateStart !=null && (date < c.DisplayDateStart))
            {
                value = c.DisplayDateStart;
            } 

            /*Date?*/var maxSelectedDate = c.SelectedDates.MaximumDate; 
            if (maxSelectedDate != null && (date < maxSelectedDate)) 
            {
                value = maxSelectedDate; 
            }
        }

        return value; 
    }
    
    /// <summary> 
    /// DisplayDateStartProperty property changed handler.
    /// </summary> 
    /// <param name="d">Calendar that changed its DisplayDateStart.</param> 
    /// <param name="e">DependencyPropertyChangedEventArgs.</param>
//    private static void
	function OnDisplayDateStartChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
		/*Calendar*/var c = d instanceof Calendar ? d : null;
//        Debug.Assert(c != null);

        c.CoerceValue(Calendar.DisplayDateEndProperty);
        c.CoerceValue(Calendar.DisplayDateProperty); 
        c.UpdateCellItems(); 
    }

//    private static object 
	function CoerceDisplayDateStart(/*DependencyObject*/ d, /*object*/ value)
    {
		/*Calendar*/var c = d instanceof Calendar ? d : null;

        /*Date?*/var date = value;

        if (date != null) 
        {
            /*Date?*/var minSelectedDate = c.SelectedDates.MinimumDate; 
            if (minSelectedDate!=null && (date > minSelectedDate))
            {
                value = minSelectedDate;
            } 
        }

        return value; 
    }
    
  /// <summary> 
    /// DisplayModeProperty property changed handler.
    /// </summary> 
    /// <param name="d">Calendar that changed its DisplayMode.</param>
    /// <param name="e">DependencyPropertyChangedEventArgs.</param>
//    private static void 
	function OnDisplayModePropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
		/*Calendar*/var c = d instanceof Calendar ? d : null;
//        Debug.Assert(c != null); 
        /*CalendarMode*/var mode = e.NewValue; 
        /*CalendarMode*/var oldMode = e.OldValue;
        /*CalendarItem*/var monthControl = c.MonthControl; 

        switch (mode)
        {
            case CalendarMode.Month: 
                {
                    if (oldMode == CalendarMode.Year || oldMode == CalendarMode.Decade) 
                    { 
                        // Cancel highlight when switching to month display mode
                        c.HoverStart = c.HoverEnd = null; 
                        c.CurrentDate = c.DisplayDate;
                    }

                    c.UpdateCellItems(); 
                    break;
                } 

            case CalendarMode.Year:
            case CalendarMode.Decade: 
                if (oldMode == CalendarMode.Month)
                {
                    c.SetCurrentValueInternal(Calendar.DisplayDateProperty, c.CurrentDate);
                } 

                c.UpdateCellItems(); 
                break; 

            default: 
                Debug.Assert(false);
                break;
        }

        c.OnDisplayModeChanged(new CalendarModeChangedEventArgs(e.OldValue, mode));
    } 


    /// <summary> 
    /// FirstDayOfWeekProperty property changed handler. 
    /// </summary>
    /// <param name="d">Calendar that changed its FirstDayOfWeek.</param> 
    /// <param name="e">DependencyPropertyChangedEventArgs.</param>
//    private static void 
	function OnFirstDayOfWeekChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
		/*Calendar*/var c = d instanceof Calendar ? d : null;
        c.UpdateCellItems();
    } 

    /// <summary> 
    /// IsTodayHighlightedProperty property changed handler.
    /// </summary> 
    /// <param name="d">Calendar that changed its IsTodayHighlighted.</param> 
    /// <param name="e">DependencyPropertyChangedEventArgs.</param>
//    private static void 
	function OnIsTodayHighlightedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
		/*Calendar*/var c = d instanceof Calendar ? d : null;

        var i = DateTimeHelper.CompareYearMonth(c.DisplayDateInternal, Date.Today); 

        if (i > -2 && i < 2) 
        { 
            c.UpdateCellItems();
        } 
    }
//    private static void 
	function OnLanguageChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
		/*Calendar*/var c = d instanceof Calendar ? d : null;
        if (DependencyPropertyHelper.GetValueSource(d, Calendar.FirstDayOfWeekProperty).BaseValueSource ==  BaseValueSource.Default) 
        {
            c.SetCurrentValueInternal(FirstDayOfWeekProperty, DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(c)).FirstDayOfWeek);
            c.UpdateCellItems();
        } 
    }
    
  /// <summary>
    /// SelectedDateProperty property changed handler. 
    /// </summary>
    /// <param name="d">Calendar that changed its SelectedDate.</param> 
    /// <param name="e">DependencyPropertyChangedEventArgs.</param> 
//    private static void 
	function OnSelectedDateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
		/*Calendar*/var c = d instanceof Calendar ? d : null;
//        Debug.Assert(c != null);

        if (c.SelectionMode != CalendarSelectionMode.None || e.NewValue == null) 
        {
            /*Date?*/var addedDate; 

            addedDate = /*(Date?)*/e.NewValue;

            if (IsValidDateSelection(c, addedDate))
            {
                if (!addedDate != null)
                { 
                    c.SelectedDates.ClearInternal(true /*fireChangeNotification*/);
                } 
                else 
                {
                    if (addedDate != null && !(c.SelectedDates.Count > 0 && c.SelectedDates[0] == addedDate)) 
                    {
                        c.SelectedDates.ClearInternal();
                        c.SelectedDates.Add(addedDate);
                    } 
                }

                // We update the current date for only the Single mode.For the other modes it automatically gets updated 
                if (c.SelectionMode == CalendarSelectionMode.SingleDate)
                { 
                    if (addedDate != null)
                    {
                        c.CurrentDate = addedDate;
                    } 

                    c.UpdateCellItems(); 
                } 
            }
            else 
            {
                throw new ArgumentOutOfRangeException("d", SR.Get(SRID.Calendar_OnSelectedDateChanged_InvalidValue));
            }
        } 
        else
        { 
            throw new InvalidOperationException(SR.Get(SRID.Calendar_OnSelectedDateChanged_InvalidOperation)); 
        }
    } 

//    private static void 
    function OnSelectionModeChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
    	/*Calendar*/var c = d instanceof Calendar ? d : null;
//        Debug.Assert(c != null); 

        c.HoverStart = c.HoverEnd = null; 
        c.SelectedDates.ClearInternal(true /*fireChangeNotification*/);
        c.OnSelectionModeChanged(EventArgs.Empty);
    }
    
//    internal static bool 
    IsValidDateSelection = function(/*Calendar*/ cal, /*object*/ value) 
    {
        return (value == null) || (!cal.BlackoutDates.Contains(value)); 
    };
    
//    private static bool 
    function IsSelectionChanged(/*SelectionChangedEventArgs*/ e)
    { 
        if (e.AddedItems.Count != e.RemovedItems.Count)
        { 
            return true; 
        }

        for(var i=0; i<e.AddedItems.COunt; i++) //foreach (Date addedDate in e.AddedItems)
        {
        	var addedDate = e.AddedItems.Get(i);
            if (!e.RemovedItems.Contains(addedDate))
            { 
                return true;
            } 
        } 

        return false; 
    }

//    private static bool 
    function IsValidDisplayMode(/*object*/ value)
    { 
        /*CalendarMode*/var mode = value;

        return mode == CalendarMode.Month 
            || mode == CalendarMode.Year
            || mode == CalendarMode.Decade; 
    }

//    internal static bool 
    IsValidFirstDayOfWeek = function(/*object*/ value)
    { 
        /*DayOfWeek*/var day = /*(DayOfWeek)*/value;

        return day == DayOfWeek.Sunday 
            || day == DayOfWeek.Monday
            || day == DayOfWeek.Tuesday 
            || day == DayOfWeek.Wednesday
            || day == DayOfWeek.Thursday
            || day == DayOfWeek.Friday
            || day == DayOfWeek.Saturday; 
    };

//    private static bool 
    function IsValidKeyboardSelection(/*Calendar*/ cal, /*object*/ value) 
    {
        if (value == null) 
        {
            return true;
        }
        else 
        {
            if (cal.BlackoutDates.Contains(value)) 
            { 
                return false;
            } 
            else
            {
                return Date.Compare(value, cal.DisplayDateStartInternal) >= 0 && Date.Compare(value, cal.DisplayDateEndInternal) <= 0;
            } 
        }
    } 

//    private static bool 
    function IsValidSelectionMode(/*object*/ value)
    { 
        /*CalendarSelectionMode*/var mode = value;

        return mode == CalendarSelectionMode.SingleDate
            || mode == CalendarSelectionMode.SingleRange 
            || mode == CalendarSelectionMode.MultipleRange
            || mode == CalendarSelectionMode.None; 
    } 
    /// <summary>
    ///     Called when this element gets focus. 
    /// </summary>
//    private static void 
    function OnGotFocus(/*object*/ sender, /*RoutedEventArgs*/ e)
    {
        // When Calendar gets focus move it to the DisplayDate 
        var c = /*(Calendar)*/sender;
        if (!e.Handled && e.OriginalSource == c) 
        { 
            // This check is for the case where the DisplayDate is the first of the month
            // and the SelectedDate is in the middle of the month.  If you tab into the Calendar 
            // the focus should go to the SelectedDate, not the DisplayDate.
            if (c.SelectedDate != null && DateTimeHelper.CompareYearMonth(c.SelectedDate, c.DisplayDateInternal) == 0)
            {
                c.FocusDate(c.SelectedDate); 
            }
            else 
            { 
                c.FocusDate(c.DisplayDate);
            } 

            e.Handled = true;
        }
    } 
	
    /// <summary>
    /// Static constructor 
    /// </summary> 
//    static Calendar()
	function Initialize()
    { 
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(Calendar.Type, 
        		/*new FrameworkPropertyMetadata(Calendar.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(Calendar.Type));
        
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(Calendar.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Once)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Once));
        
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(Calendar.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Contained)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Contained));
        
//        LanguageProperty.OverrideMetadata(Calendar.Type, new FrameworkPropertyMetadata(
//        		new PropertyChangedCallback(null, OnLanguageChanged))); 

        EventManager.RegisterClassHandler(Calendar.Type, UIElement.GotFocusEvent, 
        		new RoutedEventHandler(null, OnGotFocus)); 
    } 
	
	Calendar.Type = new Type("Calendar", Calendar, [Control.Type]);
	Initialize();
	
	return Calendar;
});



        

        


