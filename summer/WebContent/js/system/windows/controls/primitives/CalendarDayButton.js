/**
 * CalendarDayButton
 */
/// <summary> 
/// Represents a button control used in Calendar Control, which reacts to the Click event.
/// </summary> 
define(["dojo/_base/declare", "system/Type", "controls/Button"], 
		function(declare, Type, Button){
    /// <summary>
    /// Default content for the CalendarDayButton
    /// </summary>
//    private const int 
	var DEFAULTCONTENT = 1;
	var CalendarDayButton = declare("CalendarDayButton", Button,{
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
            if (this.IsSelected || this.IsHighlighted)
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateSelected, VisualStates.StateUnselected); 
            }
            else 
            { 
                VisualStateManager.GoToState(this, VisualStates.StateUnselected, useTransitions);
            } 

            // Update the ActiveStates group
            if (!this.IsInactive)
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateActive, VisualStates.StateInactive);
            } 
            else 
            {
                VisualStateManager.GoToState(this, VisualStates.StateInactive, useTransitions); 
            }

            // Update the DayStates group
            if (this.IsToday && this.Owner != null && this.Owner.IsTodayHighlighted) 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateToday, VisualStates.StateRegularDay); 
            } 
            else
            { 
                VisualStateManager.GoToState(this, VisualStates.StateRegularDay, useTransitions);
            }

            // Update the BlackoutDayStates group 
            if (this.IsBlackedOut)
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateBlackoutDay, VisualStates.StateNormalDay); 
            }
            else 
            {
                VisualStateManager.GoToState(this, VisualStates.StateNormalDay, useTransitions);
            }
 
            // Update the FocusStates group
            if (this.IsKeyboardFocused) 
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateCalendarButtonFocused, VisualStates.StateCalendarButtonUnfocused);
            } 
            else
            {
                VisualStateManager.GoToState(this, VisualStates.StateCalendarButtonUnfocused, useTransitions);
            } 

            Button.prototype.ChangeVisualState.call(this, useTransitions); 
        }, 

//        internal void 
		NotifyNeedsVisualStateUpdate:function() 
        {
            this.UpdateVisualState();
        },
 
//        internal void 
        SetContentInternal:function(/*string*/ value)
        { 
        	this.SetCurrentValueInternal(ContentControl.ContentProperty, value); 
        }
	});
	
	Object.defineProperties(CalendarDayButton.prototype,{
        /// <summary>
        /// True if the CalendarDayButton represents today 
        /// </summary>
//        public bool 
		IsToday: 
        { 
            get:function() { return this.GetValue(CalendarDayButton.IsTodayProperty); }
        },
      /// <summary>
        /// True if the CalendarDayButton is selected 
        /// </summary>
//        public bool 
        IsSelected:
        {
            get:function() { return this.GetValue(CalendarDayButton.IsSelectedProperty); } 
        },
        /// <summary> 
        /// True if the CalendarDayButton represents a day that falls in the currently displayed month
        /// </summary> 
//        public bool 
        IsInactive: 
        {
            get:function() { return this.GetValue(CalendarDayButton.IsInactiveProperty); } 
        },
        /// <summary> 
        /// True if the CalendarDayButton represents a blackout date
        /// </summary>
//        public bool 
        IsBlackedOut:
        { 
            get:function() { return this.GetValue(CalendarDayButton.IsBlackedOutProperty); }
        },
        /// <summary>
        /// True if the CalendarDayButton represents a highlighted date 
        /// </summary> 
//        public bool 
        IsHighlighted:
        { 
            get:function() { return this.GetValue(CalendarDayButton.IsHighlightedProperty); }
        },
 
//        internal Calendar 
        Owner:
        {
            get:function(){ return this._Owner;},
            set:function(value){ this._Owner = value;} 
        }
	});
	
	Object.defineProperties(CalendarDayButton,{
//		internal static readonly DependencyPropertyKey 
		IsTodayPropertyKey:
        {
        	get:function(){
        		if(CalendarDayButton._IsTodayPropertyKey === undefined){
        			CalendarDayButton._IsTodayPropertyKey = DependencyProperty.RegisterReadOnly(
        		            "IsToday",
        		            Boolean.Type,
        		            CalendarDayButton.Type, 
        		            /*new FrameworkPropertyMetadata(false, new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        		            FrameworkPropertyMetadata.BuildWithDVandPCCB(false, new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))); 
        		}
        		
        		return CalendarDayButton._IsTodayPropertyKey;
        	}
        	 
        }, 
		/// <summary> 
        /// Dependency property field for IsToday property
        /// </summary> 
//        public static readonly DependencyProperty 
		IsTodayProperty:
        {
        	get:function(){
        		return  CalendarDayButton.IsTodayPropertyKey.DependencyProperty;
        	}
        }, 

//        internal static readonly DependencyPropertyKey 
		IsSelectedPropertyKey:
        {
        	get:function(){
        		if(CalendarDayButton._IsSelectedPropertyKey === undefined){
        			CalendarDayButton._IsSelectedPropertyKey = DependencyProperty.RegisterReadOnly( 
        		            "IsSelected", 
        		            Boolean.Type,
        		            CalendarDayButton.Type, 
        		            /*new FrameworkPropertyMetadata(false, new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        		            FrameworkPropertyMetadata.BuildWithDVandPCCB(false, new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
        		}
        		return CalendarDayButton._IsSelectedPropertyKey;
        	}
        	 
        }, 

        /// <summary>
        /// Dependency property field for IsSelected property 
        /// </summary>
//        public static readonly DependencyProperty 
		IsSelectedProperty:
        {
        	get:function(){
        		return  CalendarDayButton.IsSelectedPropertyKey.DependencyProperty;
        	}
        	 
        },  
//        internal static readonly DependencyPropertyKey 
		IsInactivePropertyKey:
        {
        	get:function(){
        		if(CalendarDayButton._IsInactivePropertyKey === undefined){
        			CalendarDayButton._IsInactivePropertyKey = DependencyProperty.RegisterReadOnly(
        	                "IsInactive",
        	                Boolean.Type, 
        	                CalendarDayButton.Type,
        	                /*new FrameworkPropertyMetadata(false, new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        	                FrameworkPropertyMetadata.BuildWithDVandPCCB(false, new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
        		}
        		
        		return CalendarDayButton._IsInactivePropertyKey;
        	}
        	 
        },  
     
        /// <summary>
        /// Dependency property field for IsActive property 
        /// </summary>
//        public static readonly DependencyProperty 
		IsInactiveProperty:
        {
        	get:function(){
        		return  CalendarDayButton.IsInactivePropertyKey.DependencyProperty;
        	}
        	 
        }, 
//        internal static readonly DependencyPropertyKey 
		IsBlackedOutPropertyKey:
        {
        	get:function(){
        		if(CalendarDayButton._IsBlackedOutPropertyKey === undefined){
        			CalendarDayButton._IsBlackedOutPropertyKey = DependencyProperty.RegisterReadOnly( 
        	                "IsBlackedOut",
        	                Boolean.Type, 
        	                CalendarDayButton.Type,
        	                /*new FrameworkPropertyMetadata(false, new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        	                FrameworkPropertyMetadata.BuildWithDVandPCCB(false, new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
        		}
        		
        		return CalendarDayButton._IsBlackedOutPropertyKey;
        	}
        }, 

        /// <summary> 
        /// Dependency property field for IsBlackedOut property
        /// </summary> 
//        public static readonly DependencyProperty 
		IsBlackedOutProperty:
        {
	    	get:function(){
        		return  CalendarDayButton.IsBlackedOutPropertyKey.DependencyProperty; 
        	}
        }, 
//        internal static readonly DependencyPropertyKey 
		IsHighlightedPropertyKey:
        {
        	get:function(){
        		if(CalendarDayButton._IsHighlightedPropertyKey === undefined){
        			CalendarDayButton._IsHighlightedPropertyKey = DependencyProperty.RegisterReadOnly(
        	                "IsHighlighted", 
        	                Boolean.Type,
        	                CalendarDayButton.Type, 
        	                /*new FrameworkPropertyMetadata(false, new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        	                FrameworkPropertyMetadata.BuildWithDVandPCCB(false, new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
        		}
        		return CalendarDayButton._IsHighlightedPropertyKey;
        	}
        },  

        /// <summary> 
        /// Dependency property field for IsHighlighted property
        /// </summary>
//        public static readonly DependencyProperty 
		IsHighlightedProperty:
        {
        	get:function(){
        		return  CalendarDayButton.IsHighlightedPropertyKey.DependencyProperty;
        	}
        }
            
	});
	
	/// <summary>
    /// Static constructor 
    /// </summary>
//    static CalendarDayButton()
	function Initialize()
    {
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(CalendarDayButton.Type, 
        		/*new FrameworkPropertyMetadata(CalendarDayButton.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(CalendarDayButton.Type)); 
    }
	
	CalendarDayButton.Type = new Type("CalendarDayButton", CalendarDayButton, [Button.Type]);
	Initialize();
	
	return CalendarDayButton;
});

