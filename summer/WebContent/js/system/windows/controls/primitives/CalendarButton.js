/**
 * CalendarButton
 */
/// <summary> 
/// Represents a button control used in Calendar Control, which reacts to the Click event.
/// </summary> 
define(["dojo/_base/declare", "system/Type", "controls/Button"], 
		function(declare, Type, Button){
	var CalendarButton = declare("CalendarButton", Button,{
		constructor:function(){
		},
		/// <summary>
        /// Change to the correct visual state for the button. 
        /// </summary>
        /// <param name="useTransitions">
        /// true to use transitions when updating the visual state, false to
        /// snap directly to the new visual state. 
        /// </param>
//        internal override void 
		ChangeVisualState:function(/*bool*/ useTransitions) 
        { 
            // Update the SelectionStates group
            if (HasSelectedDays) 
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
        },

//        internal void 
        SetContentInternal:function(/*string*/ value) 
        {
            SetCurrentValueInternal(ContentControl.ContentProperty, value);
        }
	});
	
	Object.defineProperties(CalendarButton.prototype,{
		 /// <summary> 
        /// True if the CalendarButton represents a date range containing the display date
        /// </summary> 
//        public bool 
		HasSelectedDays: 
        {
            get:function() { return this.GetValue(CalendarButton.HasSelectedDaysProperty); }, 
            /*internal*/ set:function(value) { this.SetValue(CalendarButton.HasSelectedDaysPropertyKey, value); }
        },
 
        /// <summary>
        /// True if the CalendarButton represents
        ///     a month that falls outside the current year
        ///     or 
        ///     a year that falls outside the current decade
        /// </summary> 
//        public bool 
		IsInactive:
        {
            get:function() { return this.GetValue(CalendarButton.IsInactiveProperty); }, 
            /*internal*/ set:function(value) { this.SetValue(CalendarButton.IsInactivePropertyKey, value); }
        },
 
//        internal Calendar 
        Owner:
        {
            get:function(){ return this._Owner;},
            set:function(){ this._Owner = value;} 
        } 
	});
	
	Object.defineProperties(CalendarButton,{
//        internal static readonly DependencyPropertyKey 
		HasSelectedDaysPropertyKey:
        {
        	get:function(){
        		if(CalendarButton._HasSelectedDaysPropertyKey === undefined){
        			CalendarButton._HasSelectedDaysPropertyKey = DependencyProperty.RegisterReadOnly(
        	                "HasSelectedDays",
        	                Boolean.Type, 
        	                CalendarButton.Type,
        	                /*new FrameworkPropertyMetadata(false, new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        	                FrameworkPropertyMetadata.BuildWithDVandPCCB(false, new PropertyChangedCallback(null, OnVisualStatePropertyChanged))); 
        		}
        		return CalendarButton._HasSelectedDaysPropertyKey;
        	}
        }, 
     
        /// <summary>
        /// Dependency property field for HasSelectedDays property 
        /// </summary>
//        public static readonly DependencyProperty 
		HasSelectedDaysProperty:
        {
	    	get:function(){
        		return  CalendarButton.HasSelectedDaysPropertyKey.DependencyProperty;
        	}
        },    
        
//        internal static readonly DependencyPropertyKey 
		IsInactivePropertyKey:
        {
        	get:function(){
        		if(CalendarButton._IsInactivePropertyKey === undefined){
        			CalendarButton._IsInactivePropertyKey  = DependencyProperty.RegisterReadOnly(
        		            "IsInactive", 
        		            Boolean.Type,
        		            CalendarButton.Type,
        		            /*new FrameworkPropertyMetadata(false, new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        		            FrameworkPropertyMetadata.BuildWithDVandPCCB(false, new PropertyChangedCallback(null, OnVisualStatePropertyChanged)));
        		}
        		return CalendarButton._IsInactivePropertyKey;
        	}
        },
 
        /// <summary>
        /// Dependency property field for IsInactive property 
        /// </summary> 
//        public static readonly DependencyProperty 
		IsInactiveProperty:
        {
	    	get:function(){
        		return   CalendarButton.IsInactivePropertyKey.DependencyProperty; 
        	}
        }, 
	});
	
    /// <summary> 
    /// Static constructor
    /// </summary>
//    static CalendarButton()
	function Initialize()
    { 
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(CalendarButton.Type, 
        		/*new FrameworkPropertyMetadata(CalendarButton.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(CalendarButton.Type));
    } 
	
	CalendarButton.Type = new Type("CalendarButton", CalendarButton, [Button.Type]);
	Initialize();
	
	return CalendarButton;
});
