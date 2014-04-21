/**
 * CalendarItem
 */

define(["dojo/_base/declare", "system/Type", "controls/Control", "windows/ComponentResourceKey", "primitives/CalendarDayButton",
        "globalization/GregorianCalendar", "generic/List"], 
		function(declare, Type, Control, ComponentResourceKey, CalendarDayButton,
				GregorianCalendar, List){
	
//    internal static class 
	var CalendarKeyboardHelper = declare(Object, {
    });
	
//  public static void 
	CalendarKeyboardHelper.GetMetaKeyState = function(/*out bool ctrl*/ctrlOut, /*out bool shift*/shiftOut) 
    { 
		ctrlOut.ctrl = (Keyboard.Modifiers & ModifierKeys.Control) == ModifierKeys.Control;
		shiftOut.shift = (Keyboard.Modifiers & ModifierKeys.Shift) == ModifierKeys.Shift; 
    };
	
//    private const string 
	var ElementRoot = "PART_Root";
//    private const string 
    var ElementHeaderButton = "PART_HeaderButton";
//    private const string 
    var ElementPreviousButton = "PART_PreviousButton";
//    private const string 
    var ElementNextButton = "PART_NextButton"; 
//    private const string 
    var ElementDayTitleTemplate = "DayTitleTemplate";
//    private const string 
    var ElementMonthView = "PART_MonthView"; 
//    private const string 
    var ElementYearView = "PART_YearView"; 
//    private const string 
    var ElementDisabledVisual = "PART_DisabledVisual";
    
    var shortestDayNames = ["日", "一", "二", "三", "四", "五", "六"];

//    private const int 
    var COLS = 7;
//    private const int 
    var ROWS = 7;
//    private const int 
    var YEAR_COLS = 4;
//    private const int 
    var YEAR_ROWS = 3; 
//    private const int 
    var NUMBER_OF_DAYS_IN_WEEK = 7;
    
	var CalendarItem = declare("CalendarItem", Control,{
		constructor:function(){
//	        private System.Globalization.Calendar 
			this._calendar = new GregorianCalendar(); 
//	        private DataTemplate 
			this._dayTitleTemplate = null;
//	        private FrameworkElement 
			this._disabledVisual = null; 
//	        private Button 
			this._headerButton = null; 
//	        private Grid 
			this._monthView = null;
//	        private Button 
			this._nextButton = null; 
//	        private Button 
			this._previousButton = null;
//	        private Grid 
			this._yearView = null;
//	        private bool 
			this._isMonthPressed = false;
//	        private bool 
			this._isDayPressed = false; 
			
			this._dom = document.createElement("div");
			this._dom._source = this;
            this._dom.id = "CalendarItem";
		},
		
		/// <summary> 
        /// Invoked whenever application code or an internal process,
        /// such as a rebuilding layout pass, calls the ApplyTemplate method. 
        /// </summary> 
//        public override void 
		OnApplyTemplate:function()
        { 
			Control.prototype.OnApplyTemplate.call(this);

            if (this._previousButton != null)
            { 
                this._previousButton.RemoveClickHandler(new RoutedEventHandler(this, this.PreviousButton_Click));
            } 
 
            if (this._nextButton != null)
            { 
                this._nextButton.RemoveClickHandler(new RoutedEventHandler(this, this.NextButton_Click));
            }

            if (this._headerButton != null) 
            {
                this._headerButton.RemoveClickHandler(new RoutedEventHandler(this, this.HeaderButton_Click)); 
            } 

            this._monthView = this.GetTemplateChild(ElementMonthView);
            this._monthView =this._monthView instanceof Grid ? this._monthView : null; 
            
            this._yearView = this.GetTemplateChild(ElementYearView);
            this._yearView =this._yearView instanceof Grid ? this._yearView : null; 
            
            this._previousButton = this.GetTemplateChild(ElementPreviousButton);
            this._previousButton =this._previousButton instanceof Button ? this._previousButton : null; 
            
            this._nextButton = this.GetTemplateChild(ElementNextButton);
            this._nextButton =this._nextButton instanceof Button ? this._nextButton : null; 
            
            this._headerButton = this.GetTemplateChild(ElementHeaderButton);
            this._headerButton =this._headerButton instanceof Button ? this._headerButton : null; 
            
            this._disabledVisual = this.GetTemplateChild(ElementDisabledVisual);
            this._disabledVisual =this._disabledVisual instanceof FrameworkElement ? this._disabledVisual : null; 
 
            // WPF Compat: Unlike SL, WPF is not able to get elements in template resources with GetTemplateChild() 
            this._dayTitleTemplate = null;
            if (this.Template != null && this.Template.Resources.Contains(CalendarItem.DayTitleTemplateResourceKey)) 
            {
            	this._dayTitleTemplate = this.Template.Resources.Get(CalendarItem.DayTitleTemplateResourceKey);
            	this._dayTitleTemplate = this._dayTitleTemplate instanceof DataTemplate ? this._dayTitleTemplate : null;
            }
 
            if (this._previousButton != null)
            { 
//                // If the user does not provide a Content value in template, we provide a helper text that can be used in Accessibility 
//                // this text is not shown on the UI, just used for Accessibility purposes
//                if (this._previousButton.Content == null) 
//                {
//                    this._previousButton.Content = SR.Get(SRID.Calendar_PreviousButtonName);
//                }
 
                this._previousButton.AddClickHandler(new RoutedEventHandler(this, this.PreviousButton_Click));
            } 
 
            if (this._nextButton != null)
            { 
//                // If the user does not provide a Content value in template, we provide a helper text that can be used in Accessibility
//                // this text is not shown on the UI, just used for Accessibility purposes
//                if (this._nextButton.Content == null)
//                { 
//                    this._nextButton.Content = SR.Get(SRID.Calendar_NextButtonName);
//                } 
 
                this._nextButton.AddClickHandler(new RoutedEventHandler(this, this.NextButton_Click));
            } 

            if (this._headerButton != null)
            {
                this._headerButton.AddClickHandler(new RoutedEventHandler(this, this.HeaderButton_Click)); 
            }
 
            this.PopulateGrids(); 

            if (this.Owner != null) 
            {
                switch (this.Owner.DisplayMode)
                {
                    case CalendarMode.Year: 
                    	this.UpdateYearMode();
                        break; 
                    case CalendarMode.Decade: 
                    	this.UpdateDecadeMode();
                        break; 
                    case CalendarMode.Month:
                    	this.UpdateMonthMode();
                        break;
 
                    default:
//                        Debug.Assert(false); 
                        break; 
                }
            } 
            else
            {
            	this.UpdateMonthMode();
            } 
        },

//        internal override void 
		ChangeVisualState:function(/*bool*/ useTransitions)
        {
            if (!this.IsEnabled) 
            {
                VisualStateManager.GoToState(this, VisualStates.StateDisabled, useTransitions); 
            } 
            else
            { 
                VisualStateManager.GoToState(this, VisualStates.StateNormal, useTransitions);
            }

            Control.prototype.ChangeVisualState.call(this, useTransitions); 
        },
 
//        protected override void 
        OnMouseUp:function(/*MouseButtonEventArgs*/ e) 
        {
        	Control.prototype.OnMouseUp.call(this, e); 

            if (this.IsMouseCaptured)
            {
                this.ReleaseMouseCapture(); 
            }
 
            this._isMonthPressed = false; 
            this._isDayPressed = false;
 
            // In Month mode, we may need to end a drag selection even if  the mouse up isn't on the calendar.
            if (!e.Handled &&
                this.Owner.DisplayMode == CalendarMode.Month &&
                this.Owner.HoverEnd != null) 
            {
                this.FinishSelection(this.Owner.HoverEnd); 
            } 
        },
 
//        protected override void 
        OnLostMouseCapture:function(/*MouseEventArgs*/ e)
        {
        	Control.prototype.OnLostMouseCapture.call(this, e);
 
            if (!this.IsMouseCaptured)
            { 
                this._isDayPressed = false; 
                this._isMonthPressed = false;
            } 
        },
 
//        internal void 
        UpdateDecadeMode:function() 
        {
            /*Date*/var selectedYear; 

            if (this.Owner != null)
            {
                selectedYear = this.Owner.DisplayYear; 
            }
            else 
            { 
                selectedYear = Date.Today;
            } 

            var decade = GetDecadeForDecadeMode(selectedYear);
            var decadeEnd = decade + 9;
 
            this.SetDecadeModeHeaderButton(decade);
            this.SetDecadeModePreviousButton(decade); 
            this.SetDecadeModeNextButton(decadeEnd); 

            if (this._yearView != null) 
            {
            	this.SetYearButtons(decade, decadeEnd);
            }
        }, 

//        internal void 
        UpdateMonthMode:function() 
        { 
        	this.SetMonthModeHeaderButton();
        	this.SetMonthModePreviousButton(); 
        	this.SetMonthModeNextButton();

            if (this._monthView != null)
            { 
            	this.SetMonthModeDayTitles();   //cym comment
            	this.SetMonthModeCalendarDayButtons(); 
            	this.AddMonthModeHighlight(); 
            }
        }, 

//        internal void 
        UpdateYearMode:function()
        {
        	this.SetYearModeHeaderButton(); 
        	this.SetYearModePreviousButton();
        	this.SetYearModeNextButton(); 
 
            if (this._yearView != null)
            { 
            	this.SetYearModeMonthButtons();
            }
        },
 
//        internal IEnumerable<CalendarDayButton> 
        GetCalendarDayButtons:function()
        { 
            var result = new List(); 
            var count = ROWS * COLS;
            if (this.MonthView != null) 
            {
                /*UIElementCollection*/var dayButtonsHost = this.MonthView.Children;
                for (var childIndex = COLS; childIndex < count; childIndex++)
                { 
                    /*CalendarDayButton*/var b = dayButtonsHost.Get(childIndex);
                    b = b instanceof CalendarDayButton ? b : null;
                    if (b != null) 
                    { 
//                        yield return b;
                    	result.Add(b);
                    } 
                }
            }
            
            return result;
        },
 
//        internal CalendarDayButton 
        GetFocusedCalendarDayButton:function()
        { 
        	var buttons = this.GetCalendarDayButtons();
            for(var i=0; i<buttons.Count; i++) //foreach (CalendarDayButton b in GetCalendarDayButtons()) 
            {
            	var b = buttons.Get(i);
                if (b != null && b.IsFocused) 
                {
                    return b;
                }
            } 

            return null; 
        },

//        internal CalendarDayButton 
        GetCalendarDayButton:function(/*Date*/ date) 
        {
        	var buttons = this.GetCalendarDayButtons();
        	for(var i=0; i<buttons.Count; i++) //foreach (CalendarDayButton b in GetCalendarDayButtons())
            {
        		var b = buttons.Get(i);
                if (b != null && b.DataContext instanceof Date) 
                {
                    if (DateTimeHelper.CompareDays(date, b.DataContext) == 0) 
                    { 
                        return b;
                    } 
                }
            }

            return null; 
        },
 
//        internal CalendarButton 
        GetCalendarButton:function(/*Date*/ date, /*CalendarMode*/ mode) 
        {
//            Debug.Assert(mode != CalendarMode.Month); 
        	var buttons = this.GetCalendarButtons();
        	for(var i=0; i<buttons.Count; i++) //foreach (CalendarButton b in GetCalendarButtons())
            {
        		var b = buttons.Get(i);
                if (b != null && b.DataContext instanceof Date) 
                {
                    if (mode == CalendarMode.Year) 
                    { 
                        if (DateTimeHelper.CompareYearMonth(date, b.DataContext) == 0)
                        { 
                            return b;
                        }
                    }
                    else 
                    {
                        if (date.Year == b.DataContext.Year) 
                        { 
                            return b;
                        } 
                    }
                }
            }
 
            return null;
        }, 
 
//        internal CalendarButton 
        GetFocusedCalendarButton:function()
        { 
        	var buttons = this.GetCalendarButtons();
        	for(var i=0; i<buttons.Count; i++) //foreach (CalendarButton b in GetCalendarButtons())
            {
        		var b = buttons.Get(i);
                if (b != null && b.IsFocused)
                { 
                    return b;
                } 
            } 

            return null; 
        },

//        private IEnumerable<CalendarButton> 
        GetCalendarButtons:function()
        { 
        	var result = new List();
        	var children = this.YearView.Children;
        	for(var i=0; i<children.Count; i++) //foreach (UIElement element in this.YearView.Children)
            { 
        		var element = children.Get(i);
                /*CalendarButton*/var b = element instanceof CalendarButton ? element : null; 
                if (b != null)
                { 
                	result.Add(b);
//                    yield return b;
                }
            }
        	
        	return result;
        }, 

//        internal void 
        FocusDate:function(/*Date*/ date) 
        { 
            /*FrameworkElement*/var focusTarget = null;
 
            switch (this.DisplayMode)
            {
                case CalendarMode.Month:
                { 
                    focusTarget = this.GetCalendarDayButton(date);
                    break; 
                } 

                case CalendarMode.Year: 
                case CalendarMode.Decade:
                {
                    focusTarget = this.GetCalendarButton(date, this.DisplayMode);
                    break; 
                }
 
                default: 
                {
//                    Debug.Assert(false); 
                    break;
                }
            }
 
            if (focusTarget != null && !focusTarget.IsFocused)
            { 
                focusTarget.MoveFocus(new TraversalRequest(FocusNavigationDirection.First)); 
            }
        }, 

//        private int 
        GetDecadeForDecadeMode:function(/*Date*/ selectedYear) 
        { 
            var decade = DateTimeHelper.DecadeOfDate(selectedYear);
 
            // Adjust the decade value if the mouse move selection is on,
            // such that if first or last year among the children are selected
            // then return the current selected decade as is.
            if (this._isMonthPressed && this._yearView != null) 
            {
                /*UIElementCollection*/var yearViewChildren = this._yearView.Children; 
                var count = yearViewChildren.Count; 

                if (count > 0) 
                {
                    /*CalendarButton*/var child = yearViewChildren.Get(0);
                    child = child instanceof CalendarButton ? child : null;
                    if (child != null &&
                        child.DataContext instanceof Date && 
                        child.DataContext.Year == selectedYear.Year)
                    { 
                        return (decade + 10); 
                    }
                } 

                if (count > 1)
                {
                    /*CalendarButton*/var child = yearViewChildren.Get(count - 1);
                    child = child instanceof CalendarButton ? child : null; 
                    if (child != null &&
                        child.DataContext instanceof Date && 
                        child.DataContext.Year == selectedYear.Year) 
                    {
                        return (decade - 10); 
                    }
                }
            }
            return decade; 
        },
 
//        private void 
        EndDrag:function(/*bool*/ ctrl, /*Date*/ selectedDate) 
        {
            if (this.Owner != null) 
            {
                this.Owner.CurrentDate = selectedDate;

                if (this.Owner.HoverStart != null) 
                {
                    if ( 
                        ctrl && 
                        Date.Compare(this.Owner.HoverStart, selectedDate) == 0 &&
                        (this.Owner.SelectionMode == CalendarSelectionMode.SingleDate 
                        		|| this.Owner.SelectionMode == CalendarSelectionMode.MultipleRange)) 
                    {
                        // Ctrl + single click = toggle
                        this.Owner.SelectedDates.Toggle(selectedDate);
                    } 
                    else
                    { 
                        // this is selection with Mouse, we do not guarantee the range does not include BlackOutDates. 
                        // Use the internal AddRange that omits BlackOutDates based on the SelectionMode
                        this.Owner.SelectedDates.AddRangeInternal(this.Owner.HoverStart, selectedDate); 
                    }

                    Owner.OnDayClick(selectedDate);
                } 
            }
        }, 
 
//        private void 
        CellOrMonth_PreviewKeyDown:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        { 
//            Debug.Assert(e != null);

            if (this.Owner == null)
            { 
                return;
            } 
 
            this.Owner.OnDayOrMonthPreviewKeyDown(e);
        }, 

//        private void 
        Cell_Clicked:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        {
            if (this.Owner == null) 
            {
                return; 
            } 

            /*CalendarDayButton*/var b = sender instanceof CalendarDayButton ? sender : null; 
//            Debug.Assert(b != null);

            if (!(b.DataContext instanceof Date))
            { 
                return;
            } 
 
            // If the day is a blackout day selection is not allowed
            if (!b.IsBlackedOut) 
            {
                /*Date*/var clickedDate = b.DataContext;
                var ctrlOut = {"ctrl" : null};
                var shiftOut = {"shift" : null};
                CalendarKeyboardHelper.GetMetaKeyState(/*out ctrl*/ctrlOut, /*out shift*/shiftOut);
                var ctrl = ctrlOut.ctrl,
                shift = shiftOut.shift;
 
                switch (this.Owner.SelectionMode) 
                {
                    case CalendarSelectionMode.None: 
                    {
                        break;
                    }
 
                    case CalendarSelectionMode.SingleDate:
                    { 
                        if (!ctrl) 
                        {
                            this.Owner.SelectedDate = clickedDate; 
                        }
                        else
                        {
                            this.Owner.SelectedDates.Toggle(clickedDate); 
                        }
 
                        break; 
                    }
 
                    case CalendarSelectionMode.SingleRange:
                        {
                            /*Date?*/var lastDate = this.Owner.CurrentDate;
                            this.Owner.SelectedDates.ClearInternal(true /*fireChangeNotification*/); 
                            if (shift && lastDate != null)
                            { 
                                this.Owner.SelectedDates.AddRangeInternal(lastDate, clickedDate); 
                            }
                            else 
                            {
                                this.Owner.SelectedDate = clickedDate;
                                this.Owner.HoverStart = null;
                                this.Owner.HoverEnd = null; 
                            }
 
                            break; 
                        }
 
                    case CalendarSelectionMode.MultipleRange:
                        {
                            if (!ctrl)
                            { 
                                this.Owner.SelectedDates.ClearInternal(true /*fireChangeNotification*/);
                            } 
 
                            if (shift)
                            { 
                                this.Owner.SelectedDates.AddRangeInternal(this.Owner.CurrentDate, clickedDate);
                            }
                            else
                            { 
                                if (!ctrl)
                                { 
                                    this.Owner.SelectedDate = clickedDate; 
                                }
                                else 
                                {
                                    this.Owner.SelectedDates.Toggle(clickedDate);
                                    this.Owner.HoverStart = null;
                                    this.Owner.HoverEnd = null; 
                                }
                            } 
 
                            break;
                        } 
                }

                this.Owner.OnDayClick(clickedDate);
            } 
        },
 
//        private void 
        Cell_MouseLeftButtonDown:function(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
        {
            /*CalendarDayButton*/var b = sender instanceof CalendarDayButton ? sender : null; 

            if (b == null)
            {
                return; 
            }
 
            if (this.Owner == null || !(b.DataContext instanceof Date)) 
            {
                return; 
            }

            if (b.IsBlackedOut)
            { 
                this.Owner.HoverStart = null;
            } 
            else 
            {
                this._isDayPressed = true; 
                Mouse.Capture(this, CaptureMode.SubTree);

                b.MoveFocus(new TraversalRequest(FocusNavigationDirection.First));

                var ctrlOut = {"ctrl" : null};
                var shiftOut = {"shift" : null};
                CalendarKeyboardHelper.GetMetaKeyState(/*out ctrl*/ctrlOut, /*out shift*/shiftOut);
                var ctrl = ctrlOut.ctrl,
                shift = shiftOut.shift;
 
                /*Date*/var selectedDate = b.DataContext;
//                Debug.Assert(selectedDate != null); 

                switch (this.Owner.SelectionMode)
                {
                    case CalendarSelectionMode.None: 
                    {
                        break; 
                    } 

                    case CalendarSelectionMode.SingleDate: 
                    {
                        this.Owner.DatePickerDisplayDateFlag = true;
                        if (!ctrl)
                        { 
                            this.Owner.SelectedDate = selectedDate;
                        } 
                        else 
                        {
                            this.Owner.SelectedDates.Toggle(selectedDate); 
                        }

                        break;
                    } 

                    case CalendarSelectionMode.SingleRange: 
                    { 
                        this.Owner.SelectedDates.ClearInternal();
 
                        if (shift)
                        {
                            if (!this.Owner.HoverStart != null)
                            { 
                                this.Owner.HoverStart = this.Owner.HoverEnd = this.Owner.CurrentDate;
                            } 
                        } 
                        else
                        { 
                            this.Owner.HoverStart = this.Owner.HoverEnd = selectedDate;
                        }

                        break; 
                    }
 
                    case CalendarSelectionMode.MultipleRange: 
                    {
                        if (!ctrl) 
                        {
                            this.Owner.SelectedDates.ClearInternal();
                        }
 
                        if (shift)
                        { 
                            if (!this.Owner.HoverStart != null) 
                            {
                                this.Owner.HoverStart = this.Owner.HoverEnd = this.Owner.CurrentDate; 
                            }
                        }
                        else
                        { 
                            this.Owner.HoverStart = this.Owner.HoverEnd = selectedDate;
                        } 
 
                        break;
                    } 
                }

                this.Owner.CurrentDate = selectedDate;
                this.Owner.UpdateCellItems(); 
            }
        }, 
 
//        private void 
        Cell_MouseEnter:function(/*object*/ sender, /*MouseEventArgs*/ e)
        { 
        	/*CalendarDayButton*/var b = sender instanceof CalendarDayButton ? sender : null; 
            if (b == null)
            {
                return; 
            }
 
            if (b.IsBlackedOut) 
            {
                return; 
            }

            if (e.LeftButton == MouseButtonState.Pressed && this._isDayPressed)
            { 
                b.MoveFocus(new TraversalRequest(FocusNavigationDirection.First));
 
                if (this.Owner == null || !(b.DataContext instanceof Date)) 
                {
                    return; 
                }

                /*Date*/var selectedDate = b.DataContext;
 
                switch (this.Owner.SelectionMode)
                { 
                    case CalendarSelectionMode.SingleDate: 
                    {
                        this.Owner.DatePickerDisplayDateFlag = true; 
                        this.Owner.HoverStart = this.Owner.HoverEnd = null;
                        if (this.Owner.SelectedDates.Count == 0)
                        {
                            this.Owner.SelectedDates.Add(selectedDate); 
                        }
                        else 
                        { 
                            this.Owner.SelectedDates.Set(0, selectedDate);
                        } 

                        return;
                    }
                } 

                this.Owner.HoverEnd = selectedDate; 
                this.Owner.CurrentDate = selectedDate; 
                this.Owner.UpdateCellItems();
            } 
        },


//        private void 
        Cell_MouseLeftButtonUp:function(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
        {
        	/*CalendarDayButton*/var b = sender instanceof CalendarDayButton ? sender : null;  
            if (b == null) 
            {
                return; 
            }

            if (this.Owner == null)
            { 
                return;
            } 
 
            if (!b.IsBlackedOut)
            { 
                this.Owner.OnDayButtonMouseUp(e);
            }

            if (!(b.DataContext instanceof Date)) 
            {
                return; 
            } 

            this.FinishSelection(b.DataContext); 
            e.Handled = true;
        },

//        private void 
        FinishSelection:function(/*Date*/ selectedDate) 
        {
            var ctrlOut = {"ctrl" : null};
            var shiftOut = {"shift" : null};
            CalendarKeyboardHelper.GetMetaKeyState(/*out ctrl*/ctrlOut, /*out shift*/shiftOut);
            var ctrl = ctrlOut.ctrl,
            shift = shiftOut.shift;

            if (this.Owner.SelectionMode == CalendarSelectionMode.None || this.Owner.SelectionMode == CalendarSelectionMode.SingleDate) 
            {
                this.Owner.OnDayClick(selectedDate);
                return;
            } 

            if (this.Owner.HoverStart != null) 
            { 
                switch (this.Owner.SelectionMode)
                { 
                    case CalendarSelectionMode.SingleRange:
                    {
                        // Update SelectedDates
                        this.Owner.SelectedDates.ClearInternal(); 
                        this.EndDrag(ctrl, selectedDate);
                        break; 
                    } 

                    case CalendarSelectionMode.MultipleRange: 
                    {
                        // add the selection (either single day or SingleRange day)
                    	this.EndDrag(ctrl, selectedDate);
                        break; 
                    }
                } 
            } 
            else
            { 
                // If the day is blacked out but also a trailing day we should be able to switch months
                /*CalendarDayButton*/var b = this.GetCalendarDayButton(selectedDate);
                if (b != null && b.IsInactive && b.IsBlackedOut)
                { 
                    this.Owner.OnDayClick(selectedDate);
                } 
            } 
        },
 
//        private void 
        Month_MouseLeftButtonDown:function(/*object*/ sender, /*MouseButtonEventArgs*/ e)
        {
        	/*CalendarDayButton*/var b = sender instanceof CalendarDayButton ? sender : null; 
            if (b != null) 
            {
                this._isMonthPressed = true; 
                Mouse.Capture(this, CaptureMode.SubTree); 

                if (this.Owner != null) 
                {
                    this.Owner.OnCalendarButtonPressed(b, false);
                }
            } 
        },
 
//        private void 
        Month_MouseLeftButtonUp:function(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
        {
        	/*CalendarDayButton*/var b = sender instanceof CalendarDayButton ? sender : null;  
            if (b != null && this.Owner != null)
            {
                this.Owner.OnCalendarButtonPressed(b, true);
            } 
        },
 
//        private void 
        Month_MouseEnter:function(/*object*/ sender, /*MouseEventArgs*/ e) 
        {
        	/*CalendarDayButton*/var b = sender instanceof CalendarDayButton ? sender : null;  
            if (b != null)
            {
                if (this._isMonthPressed && this.Owner != null)
                { 
                    this.Owner.OnCalendarButtonPressed(b, false);
                } 
            } 
        },
 
//        private void 
        Month_Clicked:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        {
        	/*CalendarDayButton*/var b = sender instanceof CalendarDayButton ? sender : null; 
            if (b != null) 
            {
                this.Owner.OnCalendarButtonPressed(b, true); 
            } 
        },
 
//        private void 
        HeaderButton_Click:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        {
            if (this.Owner != null)
            { 
                if (this.Owner.DisplayMode == CalendarMode.Month)
                { 
                    this.Owner.SetCurrentValueInternal(Calendar.DisplayModeProperty, CalendarMode.Year); 
                }
                else 
                {
//                    Debug.Assert(this.Owner.DisplayMode == CalendarMode.Year);

                    this.Owner.SetCurrentValueInternal(Calendar.DisplayModeProperty, CalendarMode.Decade); 
                }
 
                this.FocusDate(this.DisplayDate); 
            }
        }, 

//        private void 
        PreviousButton_Click:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        {
            if (this.Owner != null) 
            {
                this.Owner.OnPreviousClick(); 
            } 
        },
 
//        private void 
        NextButton_Click:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        {
            if (this.Owner != null)
            { 
                this.Owner.OnNextClick();
            } 
        }, 

//        private void 
        PopulateGrids:function() 
        {
            if (this._monthView != null)
            {
                for (var i = 0; i < COLS; i++) 
                {
//                    /*FrameworkElement*/var titleCell = (this._dayTitleTemplate != null) ? 
//                    		this._dayTitleTemplate.LoadContent() : new ContentControl(); 
//                    titleCell.SetValue(Grid.RowProperty, 0); 
//                    titleCell.SetValue(Grid.ColumnProperty, i);
//                    this._monthView.Children.Add(titleCell); 
                	
                	/*FrameworkElement*/var titleCell = null;
                    if(this._dayTitleTemplate != null){
                    	titleCell = this._dayTitleTemplate.LoadContent();
                    }else {
                    	titleCell = new TextBlock();
                    	var binding = new Binding();
                    	titleCell.SetBinding(TextBlock.TextProperty, binding);
                    }
                    
                    titleCell.SetValue(Grid.RowProperty, 1); 
                    titleCell.SetValue(Grid.ColumnProperty, i + 1);
                    this._monthView.Children.Add(titleCell); 
                    
//                    <TextBlock Foreground="#FF333333"
//                        FontWeight="Bold"
//                        FontSize="9.5"
//                        FontFamily="Verdana"
//                        Margin="0,6,0,6"
//                        Text="{Binding}"
//                        HorizontalAlignment="Center"
//                        VerticalAlignment="Center" />
                }

                for (var i = 1; i < ROWS; i++)
                { 
                    for (var j = 0; j < COLS; j++)
                    { 
                        /*CalendarDayButton*/var dayCell = new CalendarDayButton(); 

                        dayCell.Owner = this.Owner; 
                        dayCell.SetValue(Grid.RowProperty, i + 1);
                        dayCell.SetValue(Grid.ColumnProperty, j + 1);
//                        dayCell.SetBinding(CalendarDayButton.StyleProperty, this.GetOwnerBinding("CalendarDayButtonStyle"));
                        dayCell.SetBinding(FrameworkElement.StyleProperty, this.GetOwnerBinding("CalendarDayButtonStyle"));
 
                        dayCell.AddHandler(UIElement.MouseLeftButtonDownEvent, 
                        		new MouseButtonEventHandler(this, this.Cell_MouseLeftButtonDown), true);
                        dayCell.AddHandler(UIElement.MouseLeftButtonUpEvent, 
                        		new MouseButtonEventHandler(this, this.Cell_MouseLeftButtonUp), true); 
                        dayCell.AddHandler(UIElement.MouseEnterEvent, 
                        		new MouseEventHandler(this, this.Cell_MouseEnter), true); 
                        dayCell.AddClickHandler(new RoutedEventHandler(this, this.Cell_Clicked));
                        dayCell.AddHandler(UIElement.PreviewKeyDownEvent, 
                        		new RoutedEventHandler(this, this.CellOrMonth_PreviewKeyDown), true); 

                        this._monthView.Children.Add(dayCell);
                    }
                } 
            }
 
            if (this._yearView != null) 
            {
                /*CalendarButton*/var monthCell; 
                var count = 0;
                for (var i = 0; i < YEAR_ROWS; i++)
                {
                    for (var j = 0; j < YEAR_COLS; j++) 
                    {
                        monthCell = new CalendarButton(); 
 
                        monthCell.Owner = this.Owner;
                        monthCell.SetValue(Grid.RowProperty, i); 
                        monthCell.SetValue(Grid.ColumnProperty, j);
                        monthCell.SetBinding(FrameworkElement.StyleProperty, this.GetOwnerBinding("CalendarButtonStyle"));

                        monthCell.AddHandler(UIElement.MouseLeftButtonDownEvent, 
                        		new MouseButtonEventHandler(this, this.Month_MouseLeftButtonDown), true); 
                        monthCell.AddHandler(UIElement.MouseLeftButtonUpEvent, 
                        		new MouseButtonEventHandler(this, this.Month_MouseLeftButtonUp), true);
                        monthCell.AddHandler(UIElement.MouseEnterEvent, 
                        		new MouseEventHandler(this, this.Month_MouseEnter), true); 
                        monthCell.AddHandler(UIElement.PreviewKeyDownEvent, 
                        		new RoutedEventHandler(this, this.CellOrMonth_PreviewKeyDown), true); 
                        monthCell.AddClickHandler(new RoutedEventHandler(this, this.Month_Clicked));
 
                        this._yearView.Children.Add(monthCell);
                        count++;
                    }
                } 
            }
        }, 
 
//        private void 
        SetMonthModeDayTitles:function()
        {
            if (this._monthView != null)
            { 

//                /*string[]*/var shortestDayNames = DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this)).ShortestDayNames; 
 
                for (var childIndex = 0; childIndex < COLS; childIndex++)
                { 
                    /*FrameworkElement*/var daytitle = this._monthView.Children.Get(childIndex);
                    daytitle = daytitle instanceof FrameworkElement ? daytitle : null;

                    if (daytitle != null && shortestDayNames != null && shortestDayNames.length > 0)
                    { 
                        if (this.Owner != null)
                        { 
                            daytitle.DataContext = 
                            	shortestDayNames[(childIndex + this.Owner.FirstDayOfWeek) % shortestDayNames.length]; 
                        }
                        else 
                        {
                            daytitle.DataContext = 
                            	shortestDayNames[(childIndex + DateTimeHelper.GetDateFormat( DateTimeHelper.GetCulture(this)).FirstDayOfWeek) % shortestDayNames.length];
                        }
                    } 
                }
            } 
        }, 

//        private void 
        SetMonthModeCalendarDayButtons:function() 
        {
            /*Date*/var firstDayOfMonth = DateTimeHelper.DiscardDayTime(this.DisplayDate);
            var lastMonthToDisplay = this.GetNumberOfDisplayedDaysFromPreviousMonth(firstDayOfMonth);
 
            var isMinMonth = DateTimeHelper.CompareYearMonth(firstDayOfMonth, Date.MinValue) <= 0;
            var isMaxMonth = DateTimeHelper.CompareYearMonth(firstDayOfMonth, Date.MaxValue) >= 0; 
            var daysInMonth = this._calendar.GetDaysInMonth(firstDayOfMonth.Year, firstDayOfMonth.Month); 
            /*CultureInfo*/var culture = DateTimeHelper.GetCulture(this);
 
            var count = ROWS * COLS;
            for (var childIndex = COLS; childIndex < count; childIndex++)
            {
                /*CalendarDayButton*/var childButton = this._monthView.Children.Get(childIndex);
                childButton = childButton instanceof CalendarDayButton ? childButton : null; 

//                Debug.Assert(childButton != null); 
 
                var dayOffset = childIndex - lastMonthToDisplay - COLS;
                if ((!isMinMonth || (dayOffset >= 0)) && (!isMaxMonth || (dayOffset < daysInMonth))) 
                {
                    /*Date*/var dateToAdd = this._calendar.AddDays(firstDayOfMonth, dayOffset);
                    this.SetMonthModeDayButtonState(childButton, dateToAdd);
                    childButton.DataContext = dateToAdd; 
                    childButton.SetContentInternal(DateTimeHelper.ToDayString(dateToAdd, culture));
                } 
                else 
                {
                	this.SetMonthModeDayButtonState(childButton, null); 
                    childButton.DataContext = null;
                    childButton.SetContentInternal(DateTimeHelper.ToDayString(null, culture));
                }
            } 
        },
 
//        private void 
        SetMonthModeDayButtonState:function(/*CalendarDayButton*/ childButton, /*Date?*/ dateToAdd) 
        {
            if (this.Owner != null) 
            {
                if (dateToAdd != null)
                {
                    childButton.Visibility = Visibility.Visible; 

                    // If the day is outside the DisplayDateStart/End boundary, do not show it 
                    if (DateTimeHelper.CompareDays(dateToAdd, this.Owner.DisplayDateStartInternal) < 0 || DateTimeHelper.CompareDays(dateToAdd, this.Owner.DisplayDateEndInternal) > 0) 
                    {
                        childButton.IsEnabled = false; 
                        childButton.Visibility = Visibility.Hidden;
                    }
                    else
                    { 
                        childButton.IsEnabled = true;
 
                        // SET IF THE DAY IS SELECTABLE OR NOT 
                        childButton.SetValue(
                            CalendarDayButton.IsBlackedOutPropertyKey, 
                            this.Owner.BlackoutDates.Contains(dateToAdd));

                        // SET IF THE DAY IS ACTIVE OR NOT: set if the day is a trailing day or not
                        childButton.SetValue( 
                            CalendarDayButton.IsInactivePropertyKey,
                            DateTimeHelper.CompareYearMonth(dateToAdd, this.Owner.DisplayDateInternal) != 0); 
 
                        // SET IF THE DAY IS TODAY OR NOT
                        if (DateTimeHelper.CompareDays(dateToAdd, Date.Today) == 0) 
                        {
                            childButton.SetValue(CalendarDayButton.IsTodayPropertyKey, true);
                        }
                        else 
                        {
                            childButton.SetValue(CalendarDayButton.IsTodayPropertyKey, false); 
                        } 

                        // the child button doesn't get change notificaitons from Calendar.IsTodayHighlighted 
                        // so we need up change visual states to ensure the IsToday is up to date.
                        childButton.NotifyNeedsVisualStateUpdate();

                        // SET IF THE DAY IS SELECTED OR NOT 
                        // Since we should be comparing the Date values not Date values, we can't use this.Owner.SelectedDates.Contains(dateToAdd) directly
                        var isSelected = false; 
                        for(var i=0; i<this.Owner.SelectedDates.Count; i++) //foreach (Date item in this.Owner.SelectedDates) 
                        {
                        	var item = this.Owner.SelectedDates.Get(i);
                            isSelected |= (DateTimeHelper.CompareDays(dateToAdd, item) == 0); 
                        }

                        childButton.SetValue(CalendarDayButton.IsSelectedPropertyKey, isSelected);
                    } 
                }
                else 
                { 
                    childButton.Visibility = Visibility.Hidden;
                    childButton.IsEnabled = false; 
                    childButton.SetValue(CalendarDayButton.IsBlackedOutPropertyKey, false);
                    childButton.SetValue(CalendarDayButton.IsInactivePropertyKey, true);
                    childButton.SetValue(CalendarDayButton.IsTodayPropertyKey, false);
                    childButton.SetValue(CalendarDayButton.IsSelectedPropertyKey, false); 
                }
            } 
        }, 

//        private void
        AddMonthModeHighlight:function() 
        {
            var owner = this.Owner;
            if (owner == null)
            { 
                return;
            } 
 
            if (owner.HoverStart != null && owner.HoverEnd != null)
            { 
                /*Date*/var hStart = owner.HoverEnd;
                /*Date*/var hEnd = owner.HoverEnd;

                var daysToHighlight = DateTimeHelper.CompareDays(owner.HoverEnd, owner.HoverStart); 
                if (daysToHighlight < 0)
                { 
                    hEnd = owner.HoverStart; 
                }
                else 
                {
                    hStart = owner.HoverStart;
                }
 
                var count = ROWS * COLS;
 
                for (var childIndex = COLS; childIndex < count; childIndex++) 
                {
                    /*CalendarDayButton*/var childButton = this._monthView.Children.Get(childIndex);
                    childButton = childButton instanceof CalendarDayButton ? childButton : null; 
                    if (childButton.DataContext instanceof Date)
                    {
                        /*Date*/var date = childButton.DataContext;
                        childButton.SetValue( 
                            CalendarDayButton.IsHighlightedPropertyKey,
                            (daysToHighlight != 0) && DateTimeHelper.InRange(date, hStart, hEnd)); 
                    } 
                    else
                    { 
                        childButton.SetValue(CalendarDayButton.IsHighlightedPropertyKey, false);
                    }
                }
            } 
            else
            { 
                var count = ROWS * COLS; 

                for (var childIndex = COLS; childIndex < count; childIndex++) 
                {
                    /*CalendarDayButton*/var childButton = this._monthView.Children.Get(childIndex);
                    childButton = childButton instanceof CalendarDayButton ? childButton : null;
                    childButton.SetValue(CalendarDayButton.IsHighlightedPropertyKey, false);
                } 
            }
        }, 
 
//        private void 
        SetMonthModeHeaderButton:function()
        { 
            if (this._headerButton != null)
            {
                this._headerButton.Content = DateTimeHelper.ToYearMonthPatternString(this.DisplayDate, DateTimeHelper.GetCulture(this));
 
                if (this.Owner != null)
                { 
                    this._headerButton.IsEnabled = true; 
                }
            } 
        },

//        private void 
        SetMonthModeNextButton:function()
        { 
            if (this.Owner != null && this._nextButton != null)
            { 
                /*Date*/var firstDayOfMonth = DateTimeHelper.DiscardDayTime(this.DisplayDate); 

                // DisplayDate is equal to Date.MaxValue 
                if (DateTimeHelper.CompareYearMonth(firstDayOfMonth, Date.MaxValue) == 0)
                {
                	this._nextButton.IsEnabled = false;
                } 
                else
                { 
                    // Since we are sure DisplayDate is not equal to Date.MaxValue, 
                    // it is safe to use AddMonths
                    /*Date*/var firstDayOfNextMonth = this._calendar.AddMonths(firstDayOfMonth, 1); 
                    this._nextButton.IsEnabled = (DateTimeHelper.CompareDays(this.Owner.DisplayDateEndInternal, firstDayOfNextMonth) > -1);
                }
            }
        }, 

//        private void 
        SetMonthModePreviousButton:function() 
        { 
            if (this.Owner != null && this._previousButton != null)
            { 
                /*Date*/var firstDayOfMonth = DateTimeHelper.DiscardDayTime(this.DisplayDate);
                this._previousButton.IsEnabled = (DateTimeHelper.CompareDays(this.Owner.DisplayDateStartInternal, firstDayOfMonth) < 0);
            }
        }, 
 
//        private void 
        SetYearButtons:function(/*int*/ decade, /*int*/ decadeEnd)
        {
            var year;
            var count = -1; 
            for(var i=0; i<this._yearView.Children.Count; i++) //foreach (object child in _yearView.Children)
            { 
            	var child = this._yearView.Children.Get(i);
                /*CalendarButton*/var childButton = child instanceof CalendarButton ? child : null; 
//                Debug.Assert(childButton != null);
                year = decade + count; 

                if (year <= Date.MaxValue.Year && year >= Date.MinValue.Year)
                {
                    // There should be no time component. Time is 12:00 AM 
                    /*Date*/var day = new Date(year, 1, 1);
                    childButton.DataContext = day; 
                    childButton.SetContentInternal(DateTimeHelper.ToYearString(day, DateTimeHelper.GetCulture(this))); 
                    childButton.Visibility = Visibility.Visible;
 
                    if (this.Owner != null)
                    {
                        childButton.HasSelectedDays = (Owner.DisplayDate.Year == year);
 
                        if (year < this.Owner.DisplayDateStartInternal.Year || year > this.Owner.DisplayDateEndInternal.Year)
                        { 
                            childButton.IsEnabled = false; 
                            childButton.Opacity = 0;
                        } 
                        else
                        {
                            childButton.IsEnabled = true;
                            childButton.Opacity = 1; 
                        }
                    } 
 
                    // SET IF THE YEAR IS INACTIVE OR NOT: set if the year is a trailing year or not
                    childButton.IsInactive = year < decade || year > decadeEnd; 
                }
                else
                {
                    childButton.DataContext = null; 
                    childButton.IsEnabled = false;
                    childButton.Opacity = 0; 
                } 

                count++; 
            }
        },

//        private void 
        SetYearModeMonthButtons:function() 
        {
            var count = 0; 
            for(var i=0; i<this._yearView.Children.Count; i++) //foreach (object child in _yearView.Children) 
            {
            	var child = this._yearView.Children.Get(i);
                /*CalendarButton*/var childButton = child instanceof CalendarButton ? child : null; 
//                Debug.Assert(childButton != null);

                // There should be no time component. Time is 12:00 AM
                /*Date*/var day = new Date(this.DisplayDate.Year, count + 1, 1); 
                childButton.DataContext = day;
                childButton.SetContentInternal(DateTimeHelper.ToAbbreviatedMonthString(day, DateTimeHelper.GetCulture(this))); 
                childButton.Visibility = Visibility.Visible; 

                if (this.Owner != null) 
                {
//                    Debug.Assert(this.Owner.DisplayDateInternal != null);
                    childButton.HasSelectedDays = (DateTimeHelper.CompareYearMonth(day, this.Owner.DisplayDateInternal) == 0);
 
                    if (DateTimeHelper.CompareYearMonth(day, this.Owner.DisplayDateStartInternal) < 0 || DateTimeHelper.CompareYearMonth(day, this.Owner.DisplayDateEndInternal) > 0)
                    { 
                        childButton.IsEnabled = false; 
                        childButton.Opacity = 0;
                    } 
                    else
                    {
                        childButton.IsEnabled = true;
                        childButton.Opacity = 1; 
                    }
                } 
 
                childButton.IsInactive = false;
                count++; 
            }
        },

//        private void 
        SetYearModeHeaderButton:function() 
        {
            if (this._headerButton != null) 
            { 
                this._headerButton.IsEnabled = true;
                this._headerButton.Content = DateTimeHelper.ToYearString(this.DisplayDate, DateTimeHelper.GetCulture(this)); 
            }
        },

//        private void 
        SetYearModeNextButton:function() 
        {
            if (this.Owner != null && this._nextButton != null) 
            { 
                this._nextButton.IsEnabled = (this.Owner.DisplayDateEndInternal.Year != this.DisplayDate.Year);
            } 
        },

//        private void 
        SetYearModePreviousButton:function()
        { 
            if (this.Owner != null && this._previousButton != null)
            { 
            	this._previousButton.IsEnabled = (this.Owner.DisplayDateStartInternal.Year != this.DisplayDate.Year); 
            }
        }, 

//        private void 
        SetDecadeModeHeaderButton:function(/*int*/ decade) 
        { 
            if (this._headerButton != null)
            { 
                this._headerButton.Content = DateTimeHelper.ToDecadeRangeString(decade, this);
                this._headerButton.IsEnabled = false;
            }
        }, 

//        private void 
        SetDecadeModeNextButton:function(/*int*/ decadeEnd) 
        { 
            if (this.Owner != null && this._nextButton != null)
            { 
            	this._nextButton.IsEnabled = (this.Owner.DisplayDateEndInternal.Year > decadeEnd);
            }
        },
 
//        private void 
        SetDecadeModePreviousButton:function(/*int*/ decade)
        { 
            if (this.Owner != null && this._previousButton != null) 
            {
            	this._previousButton.IsEnabled = (decade > this.Owner.DisplayDateStartInternal.Year); 
            }
        },

        // How many days of the previous month need to be displayed 
//        private int 
        GetNumberOfDisplayedDaysFromPreviousMonth:function(/*Date*/ firstOfMonth) 
        {
            /*DayOfWeek*/var day = this._calendar.GetDayOfWeek(firstOfMonth); 
            var i;

            if (this.Owner != null)
            { 
                i = ((day - this.Owner.FirstDayOfWeek + NUMBER_OF_DAYS_IN_WEEK) % NUMBER_OF_DAYS_IN_WEEK);
            } 
            else 
            {
                i = ((day - DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this)).FirstDayOfWeek + NUMBER_OF_DAYS_IN_WEEK) % NUMBER_OF_DAYS_IN_WEEK); 
            }

            if (i == 0)
            { 
                return NUMBER_OF_DAYS_IN_WEEK;
            } 
            else 
            {
                return i; 
            }
        },

        /// <summary> 
        /// Gets a binding to a property on the owning calendar
        /// </summary> 
        /// <param name="propertyName"></param> 
        /// <returns></returns>
//        private BindingBase 
        GetOwnerBinding:function(/*string*/ propertyName) 
        {
            var result = new Binding(propertyName);
            result.Source = this.Owner;
            return result; 
        }
	});
	
	Object.defineProperties(CalendarItem.prototype,{
//		internal Grid 
		MonthView: 
        {
            get:function() { return this._monthView; }
        },
 
//        internal Calendar 
		Owner:
        { 
            get:function(){return this._owner;}, 
            set:function(value){ this._owner = value;}
        }, 

//        internal Grid 
        YearView:
        {
            get:function() { return this._yearView; } 
        },

        /// <summary>
        /// Gets a value indicating whether the calendar is displayed in months, years or decades.
        /// </summary> 
//        private CalendarMode 
        DisplayMode:
        { 
            get:function() 
            {
                return (this.Owner != null) ? this.Owner.DisplayMode : CalendarMode.Month; 
            }
        },

//        internal Button 
        HeaderButton: 
        {
            get:function() 
            { 
                return this._headerButton;
            } 
        },

//        internal Button 
        NextButton:
        { 
            get:function()
            { 
                return this._nextButton; 
            }
        }, 

//        internal Button 
        PreviousButton:
        {
            get:function() 
            {
                return this._previousButton; 
            } 
        },
 
//        private Date 
        DisplayDate:
        {
            get:function()
            { 
                return (this.Owner != null) ? this.Owner.DisplayDate : Date.Today;
            } 
        }   
	});
	
//  private static ComponentResourceKey 
    var _dayTitleTemplateResourceKey = null;
	Object.defineProperties(CalendarItem,{
        /// <summary>
        ///     Resource key for DayTitleTemplate
        /// </summary> 
//        public static ComponentResourceKey 
		DayTitleTemplateResourceKey:
        { 
            get:function() 
            {
                if (_dayTitleTemplateResourceKey == null) 
                {
                    _dayTitleTemplateResourceKey = new ComponentResourceKey(CalendarItem.Type, ElementDayTitleTemplate);
                }
 
                return _dayTitleTemplateResourceKey;
            } 
        } 
	});
	
//    static CalendarItem()
	function Initialize()
    { 
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(CalendarItem.Type, 
        		/*new FrameworkPropertyMetadata(CalendarItem.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(CalendarItem.Type));
        
        UIElement.FocusableProperty.OverrideMetadata(CalendarItem.Type, 
        		/*new FrameworkPropertyMetadata(false)*/
        		FrameworkPropertyMetadata.BuildWithDV(false));
        
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(CalendarItem.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Once)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Once));
        
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(CalendarItem.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Contained)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Contained)); 

        UIElement.IsEnabledProperty.OverrideMetadata(CalendarItem.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))); 
    } 
	
	CalendarItem.Type = new Type("CalendarItem", CalendarItem, [Control.Type]);
	Initialize();
	
	return CalendarItem;
});
