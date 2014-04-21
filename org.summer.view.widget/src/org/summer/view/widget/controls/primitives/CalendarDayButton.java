package org.summer.view.widget.controls.primitives;

import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyKey;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.controls.Button;
import org.summer.view.widget.controls.Calendar;
import org.summer.view.widget.controls.ContentControl;
import org.summer.view.widget.controls.VisualStates;
import org.summer.view.window.VisualStateManager;
import org.summer.view.window.automation.peer.AutomationPeer;

/// <summary> 
    /// Represents a button control used in Calendar Control, which reacts to the Click event.
    /// </summary> 
    public /*sealed*/ class CalendarDayButton extends Button 
    {
//        #region Constants 
        /// <summary>
        /// Default content for the CalendarDayButton
        /// </summary>
        private final int DEFAULTCONTENT = 1; 

//        #endregion 
 
        /// <summary>
        /// Static constructor 
        /// </summary>
        static CalendarDayButton()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(CalendarDayButton), new FrameworkPropertyMetadata(typeof(CalendarDayButton))); 
        }
 
        /// <summary> 
        /// Represents the CalendarDayButton that is used in Calendar Control.
        /// </summary> 
        public CalendarDayButton()
            
        {
        	super();
        } 

//        #region Public Properties 
// 
//        #region IsToday
 
        /*internal*/ public static final DependencyPropertyKey IsTodayPropertyKey = DependencyProperty.RegisterReadOnly(
            "IsToday",
            typeof(boolean),
            typeof(CalendarDayButton), 
            new FrameworkPropertyMetadata(false, new PropertyChangedCallback(OnVisualStatePropertyChanged)));
 
        /// <summary> 
        /// Dependency property field for IsToday property
        /// </summary> 
        public static final DependencyProperty IsTodayProperty = IsTodayPropertyKey.DependencyProperty;

        /// <summary>
        /// True if the CalendarDayButton represents today 
        /// </summary>
        public boolean IsToday 
        { 
            get { return (boolean)GetValue(IsTodayProperty); }
        } 

//        #endregion IsToday
//
//        #region IsSelected 

        /*internal*/ public static final DependencyPropertyKey IsSelectedPropertyKey = DependencyProperty.RegisterReadOnly( 
            "IsSelected", 
            typeof(boolean),
            typeof(CalendarDayButton), 
            new FrameworkPropertyMetadata(false, new PropertyChangedCallback(OnVisualStatePropertyChanged)));

        /// <summary>
        /// Dependency property field for IsSelected property 
        /// </summary>
        public static final DependencyProperty IsSelectedProperty = IsSelectedPropertyKey.DependencyProperty; 
 
        /// <summary>
        /// True if the CalendarDayButton is selected 
        /// </summary>
        public boolean IsSelected
        {
            get { return (boolean)GetValue(IsSelectedProperty); } 
        }
 
//        #endregion IsSelected 
//
//        #region IsInactive 

        /*internal*/ public static final DependencyPropertyKey IsInactivePropertyKey = DependencyProperty.RegisterReadOnly(
            "IsInactive",
            typeof(boolean), 
            typeof(CalendarDayButton),
            new FrameworkPropertyMetadata(false, new PropertyChangedCallback(OnVisualStatePropertyChanged))); 
 
        /// <summary>
        /// Dependency property field for IsActive property 
        /// </summary>
        public static final DependencyProperty IsInactiveProperty = IsInactivePropertyKey.DependencyProperty;

        /// <summary> 
        /// True if the CalendarDayButton represents a day that falls in the currently displayed month
        /// </summary> 
        public boolean IsInactive 
        {
            get { return (boolean)GetValue(IsInactiveProperty); } 
        }

//        #endregion IsInactive
// 
//        #region IsBlackedOut
 
        /*internal*/ public static final DependencyPropertyKey IsBlackedOutPropertyKey = DependencyProperty.RegisterReadOnly( 
            "IsBlackedOut",
            typeof(boolean), 
            typeof(CalendarDayButton),
            new FrameworkPropertyMetadata(false, new PropertyChangedCallback(OnVisualStatePropertyChanged)));

        /// <summary> 
        /// Dependency property field for IsBlackedOut property
        /// </summary> 
        public static final DependencyProperty IsBlackedOutProperty = IsBlackedOutPropertyKey.DependencyProperty; 

        /// <summary> 
        /// True if the CalendarDayButton represents a blackout date
        /// </summary>
        public boolean IsBlackedOut
        { 
            get { return (boolean)GetValue(IsBlackedOutProperty); }
        } 
 
//        #endregion IsBlackedOut
// 
//        #region IsHighlighted

        /*internal*/ public static readonly DependencyPropertyKey IsHighlightedPropertyKey = DependencyProperty.RegisterReadOnly(
            "IsHighlighted", 
            typeof(boolean),
            typeof(CalendarDayButton), 
            new FrameworkPropertyMetadata(false, new PropertyChangedCallback(OnVisualStatePropertyChanged))); 

        /// <summary> 
        /// Dependency property field for IsHighlighted property
        /// </summary>
        public static readonly DependencyProperty IsHighlightedProperty = IsHighlightedPropertyKey.DependencyProperty;
 
        /// <summary>
        /// True if the CalendarDayButton represents a highlighted date 
        /// </summary> 
        public boolean IsHighlighted
        { 
            get { return (boolean)GetValue(IsHighlightedProperty); }
        }

//        #endregion IsHighlighted 
//
//        #endregion Public Properties 
// 
//        #region Internal Properties
 
        /*internal*/ public Calendar Owner
        {
            get;
            set; 
        }
 
//        #endregion Internal Properties 
//
//        #region Public Methods 
//
//        #endregion Public Methods
//
//        #region Protected Methods 

        /// <summary> 
        /// Creates the automation peer for the CalendarDayButton. 
        /// </summary>
        /// <returns></returns> 
        protected /*override*/ AutomationPeer OnCreateAutomationPeer()
        {
            return new CalendarButtonAutomationPeer(this);
        } 

//        #endregion Protected Methods 
// 
//        #region Internal Methods
 
        /// <summary>
        /// Change to the correct visual state for the button.
        /// </summary>
        /// <param name="useTransitions"> 
        /// true to use transitions when updating the visual state, false to
        /// snap directly to the new visual state. 
        /// </param> 
        /*internal*/ public /*override*/ void ChangeVisualState(boolean useTransitions)
        { 
            // Update the SelectionStates group
            if (IsSelected || IsHighlighted)
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateSelected, VisualStates.StateUnselected); 
            }
            else 
            { 
                VisualStateManager.GoToState(this, VisualStates.StateUnselected, useTransitions);
            } 

            // Update the ActiveStates group
            if (!IsInactive)
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateActive, VisualStates.StateInactive);
            } 
            else 
            {
                VisualStateManager.GoToState(this, VisualStates.StateInactive, useTransitions); 
            }

            // Update the DayStates group
            if (IsToday && this.Owner != null && this.Owner.IsTodayHighlighted) 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateToday, VisualStates.StateRegularDay); 
            } 
            else
            { 
                VisualStateManager.GoToState(this, VisualStates.StateRegularDay, useTransitions);
            }

            // Update the BlackoutDayStates group 
            if (IsBlackedOut)
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateBlackoutDay, VisualStates.StateNormalDay); 
            }
            else 
            {
                VisualStateManager.GoToState(this, VisualStates.StateNormalDay, useTransitions);
            }
 
            // Update the FocusStates group
            if (IsKeyboardFocused) 
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateCalendarButtonFocused, VisualStates.StateCalendarButtonUnfocused);
            } 
            else
            {
                VisualStateManager.GoToState(this, VisualStates.StateCalendarButtonUnfocused, useTransitions);
            } 

            base.ChangeVisualState(useTransitions); 
        } 

        /*internal*/ public void NotifyNeedsVisualStateUpdate() 
        {
            UpdateVisualState();
        }
 
        /*internal*/ public void SetContentInternal(String value)
        { 
            SetCurrentValueInternal(ContentControl.ContentProperty, value); 
        }
 
//        #endregion Internal Methods

    }