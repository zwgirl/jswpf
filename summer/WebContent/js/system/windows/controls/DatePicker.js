/**
 * DatePicker
 */
/// <summary> 
/// Represents a control that allows the user to select a date.
/// </summary> 
define(["dojo/_base/declare", "system/Type", "controls/Control", "controls/DateTimeHelper",
        "controls/DatePickerTextBox", "controls/DatePickerFormat"], 
		function(declare, Type, Control, DateTimeHelper,
				DatePickerTextBox, DatePickerFormat){
//	 private const String 
	var ElementRoot = "PART_Root"; 
//     private const String 
	var ElementTextBox = "PART_TextBox"; 
//     private const String 
	var ElementButton = "PART_Button";
//     private const String 
	var ElementPopup = "PART_Popup"; 
	
	var DatePicker = declare("DatePicker", Control,{
		constructor:function(){
            //            private ButtonBase 
            this._dropDownButton = null;
//            private Popup 
            this._popUp = null; 
//            private bool 
            this._disablePopupReopen = false;
//            private DatePickerTextBox 
            this._textBox = null;
//            private IDictionary<DependencyProperty, bool> 
            this._isHandlerSuspended = null;
//            private DateTime? 
            this._originalSelectedDate = null; 
            
			this.InitializeCalendar();
            this._defaultText = String.Empty;

            // Binding to FirstDayOfWeek and DisplayDate wont work 
//            this.SetCurrentValueInternal(DatePicker.FirstDayOfWeekProperty, DateTimeHelper.GetCurrentDateFormat().FirstDayOfWeek);
            
            this.DisplayDate = Date.Today; 

            this._dom = document.createElement("div");
			this._dom._source = this;
            this._dom.id = "DatePicker";

		},
        
        /// <summary>
        /// Sets the local Text property without breaking bindings 
        /// </summary> 
        /// <param name="value"></param>
//        private void 
		SetTextInternal:function(/*String*/ value) 
        {
            this.SetCurrentValueInternal(DatePicker.TextProperty, value);
        },
        
      /// <summary>
        /// Builds the visual tree for the DatePicker control when a new template is applied.
        /// </summary> 
//        public override void 
        OnApplyTemplate:function()
        { 
            if (this._popUp != null) 
            {
            	this._popUp.RemoveHandler(PreviewMouseLeftButtonDownEvent, new MouseButtonEventHandler(this, this.PopUp_PreviewMouseLeftButtonDown)); 
            	this._popUp.RemobeOpened(new Delegate(this, this.PopUp_Opened));
            	this._popUp.RemoveClosed(new Delegate(this, this.PopUp_Closed));
            	this. _popUp.Child = null;
            } 

            if (this._dropDownButton != null) 
            { 
            	this._dropDownButton.RemoveClick(new Delegate(this, this.DropDownButton_Click));
            	this._dropDownButton.RemoveHandler(MouseLeaveEvent, new MouseEventHandler(this, this.DropDownButton_MouseLeave)); 
            }

            if (this._textBox != null)
            { 
            	this._textBox.RemoveHandler(TextBox.KeyDownEvent, new KeyEventHandler(this, this.TextBox_KeyDown));
            	this._textBox.RemoveHandler(TextBox.TextChangedEvent, new TextChangedEventHandler(this, this.TextBox_TextChanged)); 
            	this._textBox.RemoveHandler(TextBox.LostFocusEvent, new RoutedEventHandler(this, this.TextBox_LostFocus)); 
            }
 
            Control.prototype.OnApplyTemplate.call(this);

            this._popUp = this.GetTemplateChild(ElementPopup);
            this._popUp = this._popUp instanceof Popup ? this._popUp : null;
 
            if (this._popUp != null)
            { 
            	this._popUp.AddHandler(UIElement.PreviewMouseLeftButtonDownEvent, new MouseButtonEventHandler(this, this.PopUp_PreviewMouseLeftButtonDown)); 
            	this._popUp.AddOpened(new Delegate(this, this.PopUp_Opened));
            	this._popUp.AddClosed(new Delegate(this, this.PopUp_Closed)); 
            	this._popUp.Child = this._calendar;

                if (this.IsDropDownOpen)
                { 
                    this._popUp.IsOpen = true;
                } 
            } 

            this._dropDownButton = this.GetTemplateChild(ElementButton);
            this._dropDownButton = this._dropDownButton instanceof Button ? this._dropDownButton : null; 
            if (this._dropDownButton != null)
            {
            	this._dropDownButton.AddClickHandler(new RoutedEventHandler(this, this.DropDownButton_Click));
            	this._dropDownButton.AddHandler(UIElement.MouseLeaveEvent, new MouseEventHandler(this, this.DropDownButton_MouseLeave), true); 

                // If the user does not provide a Content value in template, we provide a helper text that can be used in Accessibility 
                // this text is not shown on the UI, just used for Accessibility purposes 
                if (this._dropDownButton.Content == null)
                { 
                	this._dropDownButton.Content = "SR.Get(SRID.DatePicker_DropDownButtonName)";
                }
            }
 
            this._textBox = this.GetTemplateChild(ElementTextBox);
            this._textBox = this._textBox instanceof DatePickerTextBox ? this._textBox : null;
 
            if (this.SelectedDate == null) 
            {
                this.SetWaterMarkText(); 
            }

            if (this._textBox != null)
            { 
            	this._textBox.AddHandler(UIElement.KeyDownEvent, new KeyEventHandler(this, this.TextBox_KeyDown), true);
            	this._textBox.AddHandler(TextBoxBase.TextChangedEvent, new TextChangedEventHandler(this, this.TextBox_TextChanged), true); 
            	this._textBox.AddHandler(UIElement.LostFocusEvent, new RoutedEventHandler(this, this.TextBox_LostFocus), true); 

                if (this.SelectedDate == null) 
                {
                    if (!String.IsNullOrEmpty(this._defaultText))
                    {
                    	this._textBox.Text = this._defaultText; 
                    	this.SetSelectedDate();
                    } 
                } 
                else
                { 
                	this._textBox.Text = this.DateTimeToString(this.SelectedDate);
                }
            }
        }, 

        /// <summary> 
        /// Provides a text representation of the selected date. 
        /// </summary>
        /// <returns>A text representation of the selected date, or an empty String if SelectedDate is a null reference.</returns> 
//        public override String 
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

//        internal override void 
        ChangeVisualState:function(/*bool*/ useTransitions)
        { 
            if (!this.IsEnabled)
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateDisabled, VisualStates.StateNormal);
            } 
            else
            { 
                VisualStateManager.GoToState(this, VisualStates.StateNormal, useTransitions); 
            }
 
            Control.prototype.ChangeVisualState.call(this, useTransitions);
        },

//        protected virtual void 
        OnCalendarClosed:function(/*RoutedEventArgs*/ e) 
        {
            /*RoutedEventHandler*/var handler = this.CalendarClosed; 
            if (null != handler) 
            {
                handler.Invoke(this, e); 
            }
        },

//        protected virtual void 
        OnCalendarOpened:function(/*RoutedEventArgs*/ e) 
        {
            /*RoutedEventHandler*/var handler = this.CalendarOpened; 
            if (null != handler) 
            {
                handler.Invoke(this, e); 
            }
        },

//        protected virtual void 
        OnSelectedDateChanged:function(/*SelectionChangedEventArgs*/ e) 
        {
            this.RaiseEvent(e); 
        }, 

        /// <summary> 
        /// Raises the DateValidationError event.
        /// </summary>
        /// <param name="e">A DatePickerDateValidationErrorEventArgs that contains the event data.</param>
//        protected virtual void 
        OnDateValidationError:function(/*DatePickerDateValidationErrorEventArgs*/ e) 
        {
            /*EventHandler<DatePickerDateValidationErrorEventArgs>*/var handler = this.DateValidationError; 
            if (handler != null) 
            {
                handler.Invoke(this, e); 
            }
        },
        
//      /// <summary>
//        /// Occurs when the drop-down Calendar is closed. 
//        /// </summary>
//        public event RoutedEventHandler CalendarClosed; 
// 
//        /// <summary>
//        /// Occurs when the drop-down Calendar is opened. 
//        /// </summary>
//        public event RoutedEventHandler CalendarOpened;
//
//        /// <summary> 
//        /// Occurs when text entered into the DatePicker cannot be parsed or the Date is not valid to be selected.
//        /// </summary> 
//        public event EventHandler<DatePickerDateValidationErrorEventArgs> DateValidationError; 

        /// <summary> 
        /// Occurs when a date is selected.
        /// </summary>
//        public event EventHandler<SelectionChangedEventArgs> SelectedDateChanged
//        { 
//            add { AddHandler(SelectedDateChangedEvent, value); }
//            remove { RemoveHandler(SelectedDateChangedEvent, value); } 
//        } 
        
        AddSelectedDateChanged:function(value) { this.AddHandler(DatePicker.SelectedDateChangedEvent, value); },
        RemoveSelectedDateChanged:function(value) { this.RemoveHandler(DatePicker.SelectedDateChangedEvent, value); }, 

//        private void 
        SetValueNoCallback:function(/*DependencyProperty*/ property, /*object*/ value) 
        { 
            this.SetIsHandlerSuspended(property, true);
            try 
            {
            	this.SetCurrentValue(property, value);
            }
            finally 
            {
            	this.SetIsHandlerSuspended(property, false); 
            } 
        },
 
//        private bool 
        IsHandlerSuspended:function(/*DependencyProperty*/ property)
        {
            return this._isHandlerSuspended != null && this._isHandlerSuspended.ContainsKey(property);
        }, 

//        private void 
        SetIsHandlerSuspended:function(/*DependencyProperty*/ property, /*bool*/ value) 
        { 
            if (value)
            { 
                if (this._isHandlerSuspended == null)
                {
                	this._isHandlerSuspended = new Dictionary/*<DependencyProperty, bool>*/(2);
                } 

                this._isHandlerSuspended[property] = true; 
            } 
            else
            { 
                if (this._isHandlerSuspended != null)
                {
                	this._isHandlerSuspended.Remove(property);
                } 
            }
        }, 
 
//        private void 
        PopUp_PreviewMouseLeftButtonDown:function(/*object*/ sender, /*MouseButtonEventArgs*/ e)
        { 
            var popup = sender instanceof Popup ? sender : null;
            if (popup != null && !popup.StaysOpen)
            {
                if (this._dropDownButton != null) 
                {
                	// cym comment
//                    if (this._dropDownButton.InputHitTest(e.GetPosition(this._dropDownButton)) != null) 
//                    { 
//                        // This popup is being closed by a mouse press on the drop down button
//                        // The following mouse release will cause the closed popup to immediately reopen. 
//                        // Raise a flag to block reopeneing the popup
//                        this._disablePopupReopen = true;
//                    }
                } 
            }
        }, 
 
//        private void 
        PopUp_Opened:function(/*object*/ sender, /*EventArgs*/ e)
        { 
            if (!this.IsDropDownOpen)
            {
                this.SetCurrentValueInternal(DatePicker.IsDropDownOpenProperty, true);
            } 

            if (this._calendar != null) 
            { 
                this._calendar.DisplayMode = CalendarMode.Month;
                this._calendar.MoveFocus(new TraversalRequest(FocusNavigationDirection.First)); 
            }

            this.OnCalendarOpened(new RoutedEventArgs());
        }, 

//        private void 
        PopUp_Closed:function(/*object*/ sender, /*EventArgs*/ e) 
        { 
            if (this.IsDropDownOpen)
            { 
                this.SetCurrentValueInternal(DatePicker.IsDropDownOpenProperty, false);
            }

            if (this._calendar.IsKeyboardFocusWithin) 
            {
                this.MoveFocus(new TraversalRequest(FocusNavigationDirection.First)); 
            } 

            this.OnCalendarClosed(new RoutedEventArgs()); 
        },

//        private void
        Calendar_DayButtonMouseUp:function(/*object*/ sender, /*MouseButtonEventArgs*/ e)
        { 
            this.SetCurrentValueInternal(DatePicker.IsDropDownOpenProperty, false);
        }, 
 
//        private void 
        CalendarDayOrMonthButton_PreviewKeyDown:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        { 
            /*Calendar*/var c = sender instanceof Calendar ? sender : null;
            /*KeyEventArgs*/var args = e;

//            Debug.Assert(c != null); 
//            Debug.Assert(args != null);
 
            if (args.Key == Key.Escape || ((args.Key == Key.Enter || args.Key == Key.Space) && c.DisplayMode == CalendarMode.Month)) 
            {
                this.SetCurrentValueInternal(DatePicker.IsDropDownOpenProperty, false); 
                if (args.Key == Key.Escape)
                {
                    this.SetCurrentValueInternal(DatePicker.SelectedDateProperty, this._originalSelectedDate);
                } 
            }
        }, 
 
//        private void
        Calendar_DisplayDateChanged:function(/*object*/ sender, /*CalendarDateChangedEventArgs*/ e)
        { 
            if (e.AddedDate != this.DisplayDate)
            {
                this.SetCurrentValueInternal(DatePicker.DisplayDateProperty, e.AddedDate);
            } 
        },
 
//        private void 
        Calendar_SelectedDatesChanged:function(/*object*/ sender, /*SelectionChangedEventArgs*/ e) 
        {
//            Debug.Assert(e.AddedItems.Count < 2); 

            if (e.AddedItems.Count > 0 && this.SelectedDate != null && DateTime.Compare(e.AddedItems.Get(0), this.SelectedDate) != 0)
            {
                this.SetCurrentValueInternal(DatePicker.SelectedDateProperty, e.AddedItems[0]); 
            }
            else 
            { 
                if (e.AddedItems.Count == 0)
                { 
                    this.SetCurrentValueInternal(DatePicker.SelectedDateProperty, null);
                    return;
                }
 
                if (!this.SelectedDate != null)
                { 
                    if (e.AddedItems.Count > 0) 
                    {
                        this.SetCurrentValueInternal(DatePicker.SelectedDateProperty, e.AddedItems[0]); 
                    }
                }
            }
        }, 

//        private String 
        DateTimeToString:function(/*DateTime*/ d) 
        { 
            /*DateTimeFormatInfo*/var dtfi = DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this));
 
            switch (this.SelectedDateFormat)
            {
                case DatePickerFormat.Short:
                    { 
                        return String.Format(CultureInfo.CurrentCulture, d.ToString(dtfi.ShortDatePattern, dtfi));
                    } 
 
                case DatePickerFormat.Long:
                    { 
                        return String.Format(CultureInfo.CurrentCulture, d.ToString(dtfi.LongDatePattern, dtfi));
                    }
            }
 
            return null;
        }, 
        
        
//        private void 
        DropDownButton_Click:function(/*object*/ sender, /*RoutedEventArgs*/ e) 
        { 
            this.TogglePopUp();
        }, 

//        private void 
        DropDownButton_MouseLeave:function(/*object*/ sender, /*MouseEventArgs*/ e)
        {
            this._disablePopupReopen = false; 
        },
 
//        private void 
        TogglePopUp:function() 
        {
            if (this.IsDropDownOpen) 
            {
                this.SetCurrentValueInternal(DatePicker.IsDropDownOpenProperty, false);
            }
            else 
            {
                if (this._disablePopupReopen) 
                { 
                    this._disablePopupReopen = false;
                } 
                else
                {
                    this.SetSelectedDate();
                    this.SetCurrentValueInternal(DatePicker.IsDropDownOpenProperty, true); 
                }
            } 
        }, 

//        private void 
        InitializeCalendar:function() 
        {
            this._calendar = new Calendar();
            this._calendar.DayButtonMouseUp.Combine(new MouseButtonEventHandler(this, this.Calendar_DayButtonMouseUp));
            this._calendar.DisplayDateChanged.Combine(new EventHandler/*<CalendarDateChangedEventArgs>*/(this, this.Calendar_DisplayDateChanged)); 
            this._calendar.AddSelectedDatesChanged(new EventHandler/*<SelectionChangedEventArgs>*/(this, this.Calendar_SelectedDatesChanged));
            this._calendar.DayOrMonthPreviewKeyDown.Combine(new RoutedEventHandler(this, this.CalendarDayOrMonthButton_PreviewKeyDown)); 
            this._calendar.HorizontalAlignment = HorizontalAlignment.Left; 
            this._calendar.VerticalAlignment = VerticalAlignment.Top;
 
            this._calendar.SelectionMode = CalendarSelectionMode.SingleDate;
            this._calendar.SetBinding(Control.ForegroundProperty, this.GetDatePickerBinding(Control.ForegroundProperty));
//            this._calendar.SetBinding(FrameworkElement.StyleProperty, this.GetDatePickerBinding(DatePicker.CalendarStyleProperty));
            this._calendar.SetBinding(Calendar.IsTodayHighlightedProperty, this.GetDatePickerBinding(DatePicker.IsTodayHighlightedProperty)); 
            this._calendar.SetBinding(Calendar.FirstDayOfWeekProperty, this.GetDatePickerBinding(DatePicker.FirstDayOfWeekProperty));
//            this._calendar.SetBinding(Calendar.FlowDirectionProperty, this.GetDatePickerBinding(DatePicker.FlowDirectionProperty)); 
 
           // RenderOptions.SetClearTypeHint(this._calendar, ClearTypeHint.Enabled);
        }, 

//        private BindingBase 
        GetDatePickerBinding:function(/*DependencyProperty*/ property)
        {
            var binding = new Binding(property.Name); 
            binding.Source = this;
            return binding; 
        },
        
        // iT SHOULD RETURN NULL IF THE STRING IS NOT VALID, RETURN THE DATETIME VALUE IF IT IS VALID
 
        /// <summary>
        /// Input text is parsed in the correct format and changed into a DateTime object.
        /// If the text can not be parsed TextParseError Event is thrown.
        /// </summary> 
//        private DateTime? 
        ParseText:function(/*String*/ text)
        { 
            /*DateTime*/var newSelectedDate; 

            // TryParse is not used in order to be able to pass the exception to the TextParseError event 
            try
            {
                newSelectedDate = DateTime.Parse(text, DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this)));
 
                if (Calendar.IsValidDateSelection(this._calendar, newSelectedDate))
                { 
                    return newSelectedDate; 
                }
                else 
                {
                    var dateValidationError = new DatePickerDateValidationErrorEventArgs(new ArgumentOutOfRangeException("text", SR.Get(SRID.Calendar_OnSelectedDateChanged_InvalidValue)), text);
                    this.OnDateValidationError(dateValidationError);
 
                    if (dateValidationError.ThrowException)
                    { 
                        throw dateValidationError.Exception; 
                    }
                } 
            }
            catch (/*FormatException*/ ex)
            {
                var textParseError = new DatePickerDateValidationErrorEventArgs(ex, text); 
                this.OnDateValidationError(textParseError);
 
                if (textParseError.ThrowException && textParseError.Exception != null) 
                {
                    throw textParseError.Exception; 
                }
            }

            return null; 
        },
 
//        private bool 
        ProcessDatePickerKey:function(/*KeyEventArgs*/ e) 
        {
            switch (e.Key) 
            {
                case Key.System:
                {
                    switch (e.SystemKey) 
                    {
                        case Key.Down: 
                        { 
                            if ((Keyboard.Modifiers & ModifierKeys.Alt) == ModifierKeys.Alt)
                            { 
                                this.TogglePopUp();
                                return true;
                            }
 
                            break;
                        } 
                    } 

                    break; 
                }

                case Key.Enter:
                { 
                	this.SetSelectedDate();
                    return true; 
                } 
            }
 
            return false;
        },

//        private void 
        SetSelectedDate:function() 
        {
            if (this._textBox != null) 
            { 
                if (!String.IsNullOrEmpty(this._textBox.Text))
                { 
                    var s = this._textBox.Text;

                    if (this.SelectedDate != null)
                    { 
                        // If the String value of the SelectedDate and the TextBox String value are equal,
                        // we do not parse the String again 
                        // if we do an extra parse, we lose data in M/d/yy format 
                        // ex: SelectedDate = DateTime(1008,12,19) but when "12/19/08" is parsed it is interpreted as DateTime(2008,12,19)
                        var selectedDate = DateTimeToString(this.SelectedDate); 

                        if (String.Compare(selectedDate, s, StringComparison.Ordinal) == 0)
                        {
                            return; 
                        }
                    } 
 
                    var d = this.SetTextBoxValue(s);
                    if (!this.SelectedDate.Equals(d)) 
                    {
                        this.SetCurrentValueInternal(DatePicker.SelectedDateProperty, d);
                        this.SetCurrentValueInternal(DatePicker.DisplayDateProperty, d);
                    } 
                }
                else 
                { 
                    if (this.SelectedDate != null)
                    { 
                        this.SetCurrentValueInternal(DatePicker.SelectedDateProperty, null);
                    }
                }
            } 
            else
            { 
                var d = this.SetTextBoxValue(this._defaultText); 
                if (!this.SelectedDate.Equals(d))
                { 
                    this.SetCurrentValueInternal(DatePicker.SelectedDateProperty, d);
                }
            }
        }, 

        /// <summary> 
        ///     Set the Text property if it's not already set to the supplied value.  This avoids making the ValueSource Local. 
        /// </summary>
//        private void 
        SafeSetText:function(/*String*/ s) 
        {
            if (String.Compare(Text, s, StringComparison.Ordinal) != 0)
            {
                this.SetCurrentValueInternal(DatePicker.TextProperty, s); 
            }
        }, 
 
//        private DateTime? 
        SetTextBoxValue:function(/*String*/ s)
        { 
            if (String.IsNullOrEmpty(s))
            {
                this.SafeSetText(s);
                return this.SelectedDate; 
            }
            else 
            { 
                var d = this.ParseText(s);
 
                if (d != null)
                {
                    this.SafeSetText(this.DateTimeToString(d));
                    return d; 
                }
                else 
                { 
                    // If parse error:
                    // TextBox should have the latest valid selecteddate value: 
                    if (this.SelectedDate != null)
                    {
                        var newtext = this.DateTimeToString(this.SelectedDate);
                        this.SafeSetText(newtext); 
                        return this.SelectedDate;
                    } 
                    else 
                    {
                        this.SetWaterMarkText(); 
                        return null;
                    }
                }
            } 
        },
 
//        private void 
        SetWaterMarkText:function() 
        {
            if (this._textBox != null) 
            {
                /*DateTimeFormatInfo*/var dtfi = DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this));
                this.SetTextInternal(String.Empty);
                this._defaultText = String.Empty; 

                switch (this.SelectedDateFormat) 
                { 
                    case DatePickerFormat.Long:
                        { 
                            this._textBox.Watermark = "Long"; //String.Format(CultureInfo.CurrentCulture, SR.Get(SRID.DatePicker_WatermarkText), dtfi.LongDatePattern.ToString());
                            break;
                        }
 
                    case DatePickerFormat.Short:
                        { 
                            this._textBox.Watermark = "Short"; // String.Format(CultureInfo.CurrentCulture, SR.Get(SRID.DatePicker_WatermarkText), dtfi.ShortDatePattern.ToString()); 
                            break;
                        } 
                }
            }
        },
 
//        private void 
        TextBox_LostFocus:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        { 
            this.SetSelectedDate(); 
        },
 
//        private void 
		TextBox_KeyDown:function(/*object*/ sender, /*KeyEventArgs*/ e)
        {
            e.Handled = this.ProcessDatePickerKey(e) || e.Handled;
        },

//        private void 
        TextBox_TextChanged:function(/*object*/ sender, /*TextChangedEventArgs*/ e) 
        { 
            this.SetValueNoCallback(DatePicker.TextProperty, this._textBox.Text);
        }
	});
	
	Object.defineProperties(DatePicker.prototype,{
		
	      /// <summary>
        /// Occurs when the drop-down Calendar is closed. 
        /// </summary>
//        public event RoutedEventHandler 
		CalendarClosed:{
			get:function(){
				if(this._CalendarClosed == undefined){
					this._CalendarClosed = new Delegate();
				}
				return this._CalendarClosed;
			}
		},
 
        /// <summary>
        /// Occurs when the drop-down Calendar is opened. 
        /// </summary>
//        public event RoutedEventHandler 
		CalendarOpened:{
			get:function(){
				if(this._CalendarOpened == undefined){
					this._CalendarOpened = new Delegate();
				}
				return this._CalendarOpened;
			}
		},

        /// <summary> 
        /// Occurs when text entered into the DatePicker cannot be parsed or the Date is not valid to be selected.
        /// </summary> 
//        public event EventHandler<DatePickerDateValidationErrorEventArgs> 
		DateValidationError:
		{
			get:function(){
				if(this._DateValidationError == undefined){
					this._DateValidationError = new Delegate();
				}
				return this._DateValidationError;
			}
		},
		 /// <summary> 
        /// Gets the days that are not selectable.
        /// </summary> 
//        public CalendarBlackoutDatesCollection 
        BlackoutDates: 
        {
            get:function() { return this._calendar.BlackoutDates; } 
        },

 
        /// <summary> 
        /// Gets or sets the style that is used when rendering the calendar.
        /// </summary> 
//        public Style 
        CalendarStyle:
        {
            get:function() { return this.GetValue(DatePicker.CalendarStyleProperty); },
            set:function(value) { this.SetValue(DatePicker.CalendarStyleProperty, value); } 
        },
        
      /// <summary>
        /// Gets or sets the date to display.
        /// </summary> 
        ///
//        public DateTime 
        DisplayDate: 
        { 
            get:function() { return this.GetValue(DatePicker.DisplayDateProperty); },
            set:function(value) { this.SetValue(DatePicker.DisplayDateProperty, value); } 
        },
        /// <summary>
        /// Gets or sets the last date to be displayed. 
        /// </summary>
        ///
//        public DateTime? 
        DisplayDateEnd:
        { 
            get:function() { return this.GetValue(DatePicker.DisplayDateEndProperty); },
            set:function(value) { this.SetValue(DatePicker.DisplayDateEndProperty, value); } 
        }, 
 
        /// <summary> 
        /// Gets or sets the first date to be displayed.
        /// </summary>
        ///
//        public DateTime? 
        DisplayDateStart: 
        {
            get:function() { return this.GetValue(DatePicker.DisplayDateStartProperty); },
            set:function(value) { this.SetValue(DatePicker.DisplayDateStartProperty, value); } 
        },
        
        /// <summary>
        /// Gets or sets the day that is considered the beginning of the week.
        /// </summary> 
//        public DayOfWeek 
        FirstDayOfWeek:
        { 
            get:function() { return this.GetValue(DatePicker.FirstDayOfWeekProperty); }, 
            set:function(value) { this.SetValue(DatePicker.FirstDayOfWeekProperty, value); }
        }, 

        /// <summary>
        /// Gets or sets a value that indicates whether the drop-down Calendar is open or closed. 
        /// </summary>
//        public bool 
        IsDropDownOpen:
        {
            get:function() { return this.GetValue(DatePicker.IsDropDownOpenProperty); },
            set:function(value) { SetValue(DatePicker.IsDropDownOpenProperty, value); }
        }, 
 
        /// <summary>
        /// Gets or sets a value that indicates whether the current date will be highlighted. 
        /// </summary> 
//        public bool 
        IsTodayHighlighted:
        { 
            get:function() { return this.GetValue(DatePicker.IsTodayHighlightedProperty); },
            set:function(value) { this.SetValue(DatePicker.IsTodayHighlightedProperty, value); }
        },
 
        /// <summary> 
        /// Gets or sets the currently selected date.
        /// </summary>
        ///
//        public DateTime? 
        SelectedDate: 
        {
            get:function() { return this.GetValue(DatePicker.SelectedDateProperty); }, 
            set:function(value) { this.SetValue(DatePicker.SelectedDateProperty, value); } 
        },

        /// <summary> 
        /// Gets or sets the format that is used to display the selected date. 
        /// </summary>
//        public DatePickerFormat 
        SelectedDateFormat: 
        {
            get:function() { return this.GetValue(DatePicker.SelectedDateFormatProperty); },
            set:function(value) { this.SetValue(DatePicker.SelectedDateFormatProperty, value); }
        }, 
 
        /// <summary>
        /// Gets or sets the text that is displayed by the DatePicker. 
        /// </summary> 
//        public String 
        Text:
        { 
            get:function() { return this.GetValue(DatePicker.TextProperty); },
            set:function(value) { this.SetValue(DatePicker.TextProperty, value); }
        },

//        internal Calendar 
        Calendar: 
        { 
            get:function()
            { 
                return this._calendar;
            }
        },
 
//        internal TextBox 
        TextBox:
        { 
            get:function() 
            {
                return this._textBox; 
            }
        },

//        protected internal override bool 
        HasEffectiveKeyboardFocus:
        {
            get:function() 
            { 
                if (this._textBox != null)
                { 
                    return this._textBox.HasEffectiveKeyboardFocus;
                }
                return base.HasEffectiveKeyboardFocus;
            } 
        }
	});
	
	Object.defineProperties(DatePicker,{
//		public static readonly RoutedEvent 
		SelectedDateChangedEvent:
        {
        	get:function(){
        		if(DatePicker._SelectedDateChangedEvent === undefined){
        			DatePicker._SelectedDateChangedEvent = EventManager.RegisterRoutedEvent("SelectedDateChanged", RoutingStrategy.Direct, 
        	        		EventHandler/*<SelectionChangedEventArgs>*/.Type, DatePicker.Type);
        		}
        		
        		return DatePicker._SelectedDateChangedEvent;
        	}
        },
		/// <summary> 
        /// Identifies the CalendarStyle dependency property.
        /// </summary> 
//        public static readonly DependencyProperty 
		CalendarStyleProperty:
        {
        	get:function(){
        		if(DatePicker._CalendarStyleProperty === undefined){
        			DatePicker._CalendarStyleProperty =
        	            DependencyProperty.Register(
        	                    "CalendarStyle",
        	                    Style.Type, 
        	                    DatePicker.Type);
        		}
        		
        		return DatePicker._CalendarStyleProperty;
        	}
        }, 
        /// <summary>
        /// Identifies the DisplayDate dependency property. 
        /// </summary>
//        public static readonly DependencyProperty 
		DisplayDateProperty:
        {
        	get:function(){
        		if(DatePicker._DisplayDateProperty === undefined){
        			DatePicker._DisplayDateProperty = 
        	            DependencyProperty.Register( 
        	                    "DisplayDate",
        	                    Date.Type, 
        	                    DatePicker.Type,
        	                    /*new FrameworkPropertyMetadata(DateTime.Now, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		null, 
        	                    		CoerceDisplayDate)*/
        	                    FrameworkPropertyMetadata.Build4(Date.Now, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		null, 
        	                    		new CoerceValueCallback(null, CoerceDisplayDate)));
        		}
        		
        		return DatePicker._DisplayDateProperty;
        	}
        }, 
        
        /// <summary> 
        /// Identifies the DisplayDateEnd dependency property.
        /// </summary>
//        public static readonly DependencyProperty 
		DisplayDateEndProperty:
        {
        	get:function(){
        		if(DatePicker._DisplayDateEndProperty === undefined){
        			DatePicker._DisplayDateEndProperty =
        	            DependencyProperty.Register( 
        	                    "DisplayDateEnd",
        	                    Date.Type, 
        	                    DatePicker.Type, 
        	                   /* new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		OnDisplayDateEndChanged, 
        	                    		CoerceDisplayDateEnd)*/
        	                    FrameworkPropertyMetadata.Build4(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		new PropertyChangedCallback(null, OnDisplayDateEndChanged), 
        	                    		new CoerceValueCallback(null, CoerceDisplayDateEnd)));
        		}
        		
        		return DatePicker._DisplayDateEndProperty;
        	}
        }, 
        /// <summary>
        /// Identifies the DisplayDateStart dependency property.
        /// </summary>
//        public static readonly DependencyProperty 
		DisplayDateStartProperty:
        {
        	get:function(){
        		if(DatePicker._DisplayDateStartProperty === undefined){
        			DatePicker._DisplayDateStartProperty = 
        	            DependencyProperty.Register(
        	                    "DisplayDateStart", 
        	                    Date.Type, 
        	                    DatePicker.Type,
        	                    /*new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		OnDisplayDateStartChanged, 
        	                    		CoerceDisplayDateStart)*/
        	                    FrameworkPropertyMetadata.Build4(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		new PropertyChangedCallback(null, OnDisplayDateStartChanged), 
        	                    				new CoerceValueCallback(null, CoerceDisplayDateStart)));
        		}
        		
        		return DatePicker._DisplayDateStartProperty;
        	}
        },  

        /// <summary>
        /// Identifies the FirstDayOfWeek dependency property.
        /// </summary> 
//        public static readonly DependencyProperty 
		FirstDayOfWeekProperty:
        {
        	get:function(){
        		if(DatePicker._FirstDayOfWeekProperty === undefined){
        			DatePicker._FirstDayOfWeekProperty =
        	            DependencyProperty.Register( 
        	                    "FirstDayOfWeek", 
        	                    Number.Type,
        	                    DatePicker.Type, 
        	                    null,
        	                    new ValidateValueCallback(null, Calendar.IsValidFirstDayOfWeek));
        		}
        		
        		return DatePicker._FirstDayOfWeekProperty;
        	}
        }, 
        /// <summary>
        /// Identifies the IsDropDownOpen dependency property. 
        /// </summary>
//        public static readonly DependencyProperty 
		IsDropDownOpenProperty:
        {
        	get:function(){
        		if(DatePicker._IsDropDownOpenProperty === undefined){
        			DatePicker._IsDropDownOpenProperty =
        	            DependencyProperty.Register(
        	                    "IsDropDownOpen", 
        	                    Boolean.Type,
        	                    DatePicker.Type, 
        	                    /*new FrameworkPropertyMetadata(false, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		OnIsDropDownOpenChanged, 
        	                    		OnCoerceIsDropDownOpen)*/
        	                    FrameworkPropertyMetadata.Build4(false, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		new PropertyChangedCallback(null, OnIsDropDownOpenChanged), 
        	                    		new CoerceValueCallback(null, OnCoerceIsDropDownOpen)));
        		}
        		
        		return DatePicker._IsDropDownOpenProperty;
        	}
        },  

        /// <summary>
        /// Identifies the IsTodayHighlighted dependency property. 
        /// </summary> 
//        public static readonly DependencyProperty 
		IsTodayHighlightedProperty:
        {
        	get:function(){
        		if(DatePicker._IsTodayHighlightedProperty === undefined){
        			DatePicker._IsTodayHighlightedProperty =
        	            DependencyProperty.Register( 
        	                    "IsTodayHighlighted",
        	                    Boolean.Type,
        	                    DatePicker.Type);
        		}
        		
        		return DatePicker._IsTodayHighlightedProperty;
        	}
        }, 
        
        /// <summary>
        /// Identifies the SelectedDate dependency property.
        /// </summary>
//        public static readonly DependencyProperty 
		SelectedDateProperty:
        {
        	get:function(){
        		if(DatePicker._SelectedDateProperty === undefined){
        			DatePicker._SelectedDateProperty = 
        	            DependencyProperty.Register(
        	                    "SelectedDate", 
        	                    Date.Type, 
        	                    DatePicker.Type,
        	                    /*new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		OnSelectedDateChanged, 
        	                    		CoerceSelectedDate)*/
        	                    FrameworkPropertyMetadata.Build4(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
        	                    		new PropertyChangedCallback(null, OnSelectedDateChanged), 
        	                    		new CoerceValueCallback(null, CoerceSelectedDate))); 
        		}
        		
        		return DatePicker._SelectedDateProperty;
        	}
        }, 

        /// <summary> 
        /// Identifies the SelectedDateFormat dependency property. 
        /// </summary>
//        public static readonly DependencyProperty 
		SelectedDateFormatProperty:
        {
        	get:function(){
        		if(DatePicker._SelectedDateFormatProperty === undefined){
        			DatePicker._SelectedDateFormatProperty = 
        	            DependencyProperty.Register(
        	                    "SelectedDateFormat",
        	                    Number.Type,
        	                    DatePicker.Type, 
        	                    new FrameworkPropertyMetadata(DatePickerFormat.Long, OnSelectedDateFormatChanged),
        	                    new ValidateValueCallback(null, IsValidSelectedDateFormat)); 
        		}
        		
        		return DatePicker._SelectedDateFormatProperty;
        	}
        }, 
        
        /// <summary>
        /// Identifies the Text dependency property. 
        /// </summary> 
//        public static readonly DependencyProperty 
		TextProperty:
        {
        	get:function(){
        		if(DatePicker._TextProperty === undefined){
        			DatePicker._TextProperty =
        	            DependencyProperty.Register( 
        	                    "Text",
        	                    String.Type,
        	                    DatePicker.Type,
        	                    new FrameworkPropertyMetadata(String.Empty, OnTextChanged)); 
        		}
        		
        		return DatePicker._TextProperty;
        	}
        }
        
	});
	
//    private static object 
	function CoerceDisplayDate(/*DependencyObject*/ d, /*object*/ value) 
    {
		var dp = d instanceof DatePicker ? d : null; 

        // We set _calendar.DisplayDate in order to get _calendar to compute the coerced value
        dp._calendar.DisplayDate = value; 
        return dp._calendar.DisplayDate;
    }
    
  /// <summary>
    /// DisplayDateEndProperty property changed handler.
    /// </summary>
    /// <param name="d">DatePicker that changed its DisplayDateEnd.</param> 
    /// <param name="e">DependencyPropertyChangedEventArgs.</param>
//    private static void 
	function OnDisplayDateEndChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
		var dp = d instanceof DatePicker ? d : null;
        Debug.Assert(dp != null); 

        dp.CoerceValue(DatePicker.DisplayDateProperty);
    }

//    private static object 
	function CoerceDisplayDateEnd(/*DependencyObject*/ d, /*object*/ value)
    { 
		var dp = d instanceof DatePicker ? d : null;

        // We set _calendar.DisplayDateEnd in order to get _calendar to compute the coerced value 
        dp._calendar.DisplayDateEnd = value;
        return dp._calendar.DisplayDateEnd;
    }
    
  /// <summary>
    /// DisplayDateStartProperty property changed handler.
    /// </summary> 
    /// <param name="d">DatePicker that changed its DisplayDateStart.</param>
    /// <param name="e">DependencyPropertyChangedEventArgs.</param> 
//    private static void 
	function OnDisplayDateStartChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
		var dp = d instanceof DatePicker ? d : null;
//        Debug.Assert(dp != null);

        dp.CoerceValue(DatePicker.DisplayDateEndProperty);
        dp.CoerceValue(DatePicker.DisplayDateProperty); 
    }

//    private static object 
	function CoerceDisplayDateStart(/*DependencyObject*/ d, /*object*/ value) 
    {
		var dp = d instanceof DatePicker ? d : null;

        // We set _calendar.DisplayDateStart in order to get _calendar to compute the coerced value
        dp._calendar.DisplayDateStart = value;
        return dp._calendar.DisplayDateStart; 
    }
//    private static object 
	function OnCoerceIsDropDownOpen(/*DependencyObject*/ d, /*object*/ baseValue) 
    {
		var dp = d instanceof DatePicker ? d : null;
//        Debug.Assert(dp != null);

        if (!dp.IsEnabled)
        { 
            return false; 
        }

        return baseValue;
    }

    /// <summary> 
    /// IsDropDownOpenProperty property changed handler.
    /// </summary> 
    /// <param name="d">DatePicker that changed its IsDropDownOpen.</param> 
    /// <param name="e">DependencyPropertyChangedEventArgs.</param>
//    private static void 
	function OnIsDropDownOpenChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
		var dp = d instanceof DatePicker ? d : null;
//        Debug.Assert(dp != null);

        var newValue = e.NewValue;
        if (dp._popUp != null && dp._popUp.IsOpen != newValue) 
        { 
            dp._popUp.IsOpen = newValue;
            if (newValue) 
            {
                dp._originalSelectedDate = dp.SelectedDate;
                
                //cym comment
//                // When the popup is opened set focus to the DisplayDate button. 
//                // Do this asynchronously because the IsDropDownOpen could
//                // have been set even before the template for the DatePicker is 
//                // applied. And this would mean that the visuals wouldn't be available yet. 
//
//                dp.Dispatcher.BeginInvoke(DispatcherPriority.Input, (Action)delegate() 
//                    {
//                        // setting the focus to the calendar will focus the correct date.
//                        dp._calendar.Focus();
//                    }); 
            }
        } 
    } 

//    private static void 
	function OnIsEnabledChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
		var dp = d instanceof DatePicker ? d : null;
//        Debug.Assert(dp != null);

        dp.CoerceValue(DatePicker.IsDropDownOpenProperty);

        OnVisualStatePropertyChanged(d, e); 
    }
    
  /// <summary>
    /// SelectedDateProperty property changed handler.
    /// </summary> 
    /// <param name="d">DatePicker that changed its SelectedDate.</param>
    /// <param name="e">DependencyPropertyChangedEventArgs.</param> 
//    private static void 
	function OnSelectedDateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        /*DatePicker*/var dp = d instanceof DatePicker ? d : null; 
//        Debug.Assert(dp != null);

        /*Collection<DateTime>*/var addedItems = new Collection();
        /*Collection<DateTime>*/var removedItems = new Collection(); 
        /*DateTime?*/var addedDate;
        /*DateTime?*/var removedDate; 

        dp.CoerceValue(DatePicker.DisplayDateStartProperty);
        dp.CoerceValue(DatePicker.DisplayDateEndProperty); 
        dp.CoerceValue(DatePicker.DisplayDateProperty);

        addedDate = e.NewValue;
        removedDate = e.OldValue; 

        if (dp.SelectedDate != null) 
        { 
            /*DateTime*/var day = dp.SelectedDate;
            dp.SetTextInternal(dp.DateTimeToString(day)); 

            // When DatePickerDisplayDateFlag is TRUE, the SelectedDate change is coming from the Calendar UI itself,
            // so, we shouldn't change the DisplayDate since it will automatically be changed by the Calendar
            if ((day.Month != dp.DisplayDate.Month || day.Year != dp.DisplayDate.Year) && !dp._calendar.DatePickerDisplayDateFlag) 
            {
                dp.SetCurrentValueInternal(DatePicker.DisplayDateProperty, day); 
            } 

            dp._calendar.DatePickerDisplayDateFlag = false; 
        }
        else
        {
            dp.SetWaterMarkText(); 
        }

        if (addedDate != null) 
        {
            addedItems.Add(addedDate); 
        }

        if (removedDate != null)
        { 
            removedItems.Add(removedDate);
        } 

        dp.OnSelectedDateChanged(new CalendarSelectionChangedEventArgs(DatePicker.SelectedDateChangedEvent, removedItems, addedItems));

//        DatePickerAutomationPeer peer = UIElementAutomationPeer.FromElement(dp) as DatePickerAutomationPeer;
//        // Raise the propetyChangeEvent for Value if Automation Peer exist
//        if (peer != null)
//        { 
//            var addedDateString = addedDate.HasValue ? dp.DateTimeToString(addedDate.Value) : "";
//            var removedDateString = removedDate.HasValue ? dp.DateTimeToString(removedDate.Value) : ""; 
//            peer.RaiseValuePropertyChangedEvent(removedDateString, addedDateString); 
//        }
    } 

//    private static object 
	function CoerceSelectedDate(/*DependencyObject*/ d, /*object*/ value)
    {
		var dp = d instanceof DatePicker ? d : null; 

        // We set _calendar.SelectedDate in order to get _calendar to compute the coerced value 
        dp._calendar.SelectedDate = value; 
        return dp._calendar.SelectedDate;
    } 
    
  /// <summary>
    /// SelectedDateFormatProperty property changed handler. 
    /// </summary>
    /// <param name="d">DatePicker that changed its SelectedDateFormat.</param>
    /// <param name="e">DependencyPropertyChangedEventArgs.</param>
//    private static void 
	function OnSelectedDateFormatChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        var dp = d instanceof DatePicker ? d : null; 
//        Debug.Assert(dp != null); 

        if (dp._textBox != null) 
        {
            // Update DatePickerTextBox.Text
            if (String.IsNullOrEmpty(dp._textBox.Text))
            { 
                dp.SetWaterMarkText();
            } 
            else 
            {
                /*DateTime?*/var date = dp.ParseText(dp._textBox.Text); 

                if (date != null)
                {
                    dp.SetTextInternal(dp.DateTimeToString(date)); 
                }
            } 
        } 
    }
    
  /// <summary> 
    /// TextProperty property changed handler. 
    /// </summary>
    /// <param name="d">DatePicker that changed its Text.</param> 
    /// <param name="e">DependencyPropertyChangedEventArgs.</param>
//    private static void 
	function OnTextChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        /*DatePicker*/var dp = d instanceof DatePicker ? d: null; 
//        Debug.Assert(dp != null);

        if (!dp.IsHandlerSuspended(DatePicker.TextProperty)) 
        {
            var newValue = typeof e.NewValue == "String" ? e.NewValue : null; 

            if (newValue != null)
            {
                if (dp._textBox != null) 
                {
                    dp._textBox.Text = newValue; 
                } 
                else
                { 
                    dp._defaultText = newValue;
                }

                dp.SetSelectedDate(); 
            }
            else 
            { 
                dp.SetValueNoCallback(DatePicker.SelectedDateProperty, null);
            } 
        }
    }
  /// <summary>
    ///     Called when this element gets focus.
    /// </summary> 
//    private static void 
	function OnGotFocus(/*object*/ sender, /*RoutedEventArgs*/ e)
    { 
        // When Datepicker gets focus move it to the TextBox 
        /*DatePicker*/var picker = sender;
        if ((!e.Handled) && (picker._textBox != null)) 
        {
            if (e.OriginalSource == picker)
            {
                picker._textBox.Focus(); 
                e.Handled = true;
            } 
            else if (e.OriginalSource == picker._textBox) 
            {
                picker._textBox.SelectAll(); 
                e.Handled = true;
            }
        }
    } 

//    private static DateTime 
	function DiscardDayTime(/*DateTime*/ d)
    { 
		var year = d.Year;
		var month = d.Month;
        var newD = new DateTime(year, month, 1, 0, 0, 0);
        return newD; 
    }

//    private static DateTime? 
	function DiscardTime(/*DateTime?*/ d) 
    {
        if (d == null) 
        {
            return null;
        }
        else 
        {
            /*DateTime*/var discarded = /*(DateTime)*/d; 
            var year = discarded.Year; 
            var month = discarded.Month;
            var day = discarded.Day; 
            /*DateTime*/var newD = new DateTime(year, month, day, 0, 0, 0);
            return newD;
        }
    } 


//    private static bool 
	function IsValidSelectedDateFormat(/*object*/ value) 
    {
        /*DatePickerFormat*/var format = /*(DatePickerFormat)*/value;

        return format == DatePickerFormat.Long 
            || format == DatePickerFormat.Short;
    } 
	 /// <summary>
    /// Static constructor
    /// </summary> 
//    static DatePicker()
	function Initialzie()
    { 
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(DatePicker.Type, 
        		/*new FrameworkPropertyMetadata(DatePicker.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(DatePicker.Type)); 
        
        EventManager.RegisterClassHandler(DatePicker.Type, UIElement.GotFocusEvent, new RoutedEventHandler(null, OnGotFocus));
        
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(DatePicker.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Once)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Once)); 
        
        KeyboardNavigation.IsTabStopProperty.OverrideMetadata(DatePicker.Type, 
        		/*new FrameworkPropertyMetadata(false)*/
        		FrameworkPropertyMetadata.BuildWithDV(false));
        
        UIElement.IsEnabledProperty.OverrideMetadata(DatePicker.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, OnIsEnabledChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, OnIsEnabledChanged)));
    }
	
	DatePicker.Type = new Type("DatePicker", DatePicker, [Control.Type]);
	Initialzie();
	
	return DatePicker;
});

