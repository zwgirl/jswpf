package org.summer.view.widget.controls;

import org.summer.view.window.VisualStateManager;

/// <summary> 
    /// Names and helpers for visual states in the controls.
    /// <remarks>THIS IS A SHARED FILE.  PresentationFramework.Design.dll must be rebuilt if changed.</remarks> 
    /// </summary> 
    /*internal*/ public /*static*/ class VisualStates
    { 
//        #region CalendarDayButton

        /// <summary>
        /// Identifies the Today state. 
        /// </summary>
        /*internal*/ public final String StateToday = "Today"; 
 
        /// <summary>
        /// Identifies the RegularDay state. 
        /// </summary>
        /*internal*/ public final String StateRegularDay = "RegularDay";

        /// <summary> 
        /// Name of the Day state group.
        /// </summary> 
        /*internal*/ public final String GroupDay = "DayStates"; 

        /// <summary> 
        /// Identifies the BlackoutDay state.
        /// </summary>
        /*internal*/ public final String StateBlackoutDay = "BlackoutDay";
 
        /// <summary>
        /// Identifies the NormalDay state. 
        /// </summary> 
        /*internal*/ public final String StateNormalDay = "NormalDay";
 
        /// <summary>
        /// Name of the BlackoutDay state group.
        /// </summary>
        /*internal*/ public final String GroupBlackout = "BlackoutDayStates"; 

//        #endregion Constants 
 
//        #region GroupCalendarButtonFocus
        /// <summary> 
        /// Unfocused state for Calendar Buttons
        /// </summary>
        public final String StateCalendarButtonUnfocused = "CalendarButtonUnfocused";
 
        /// <summary>
        /// Focused state for Calendar Buttons 
        /// </summary> 
        public final String StateCalendarButtonFocused = "CalendarButtonFocused";
 
        /// <summary>
        /// CalendarButtons Focus state group
        /// </summary>
        public final String GroupCalendarButtonFocus = "CalendarButtonFocusStates"; 

//        #endregion GroupCalendarButtonFocus 
 
//        #region GroupCommon
        /// <summary> 
        /// Normal state
        /// </summary>
        public final static String StateNormal = "Normal";
 
        /// <summary>
        /// MouseOver state 
        /// </summary> 
        public final String StateMouseOver = "MouseOver";
 
        /// <summary>
        /// Pressed state
        /// </summary>
        public final String StatePressed = "Pressed"; 

        /// <summary> 
        /// Disabled state 
        /// </summary>
        public final String StateDisabled = "Disabled"; 

        /// <summary>
        /// Readonly state
        /// </summary> 
        public final String StateReadOnly = "ReadOnly";
 
        /// <summary> 
        /// Transition into the Normal state in the ProgressBar template.
        /// </summary> 
        /*internal*/ public final String StateDeterminate = "Determinate";

        /// <summary>
        /// Common state group 
        /// </summary>
        public final String GroupCommon = "CommonStates"; 
//        #endregion GroupCommon 

//        #region GroupFocus 
        /// <summary>
        /// Unfocused state
        /// </summary>
        public final static String StateUnfocused = "Unfocused"; 

        /// <summary> 
        /// Focused state 
        /// </summary>
        public final static String StateFocused = "Focused"; 

        /// <summary>
        /// Focused and Dropdown is showing state
        /// </summary> 
        public final String StateFocusedDropDown = "FocusedDropDown";
 
        /// <summary> 
        /// Focus state group
        /// </summary> 
        public final String GroupFocus = "FocusStates";
//        #endregion GroupFocus

//         #region GroupExpansion 

        /// <summary> 
        /// Expanded state of the Expansion state group. 
        /// </summary>
        public final static String StateExpanded = "Expanded"; 

        /// <summary>
        /// Collapsed state of the Expansion state group.
        /// </summary> 
        public final static String StateCollapsed = "Collapsed";
 
        /// <summary> 
        /// Expansion state group.
        /// </summary> 
        public final String GroupExpansion = "ExpansionStates";
//        #endregion GroupExpansion

//        #region GroupOpen 

        public final String StateOpen = "Open"; 
        public final String StateClosed = "Closed"; 

        public final String GroupOpen = "OpenStates"; 

//        #endregion

//        #region GroupHasItems 

        /// <summary> 
        /// HasItems state of the HasItems state group. 
        /// </summary>
        public final String StateHasItems = "HasItems"; 

        /// <summary>
        /// NoItems state of the HasItems state group.
        /// </summary> 
        public final String StateNoItems = "NoItems";
 
        /// <summary> 
        /// HasItems state group.
        /// </summary> 
        public final String GroupHasItems = "HasItemsStates";
//        #endregion GroupHasItems

//        #region GroupExpandDirection 

        /// <summary> 
        /// Down expand direction state of ExpandDirection state group. 
        /// </summary>
        public final static String StateExpandDown = "ExpandDown"; 

        /// <summary>
        /// Up expand direction state of ExpandDirection state group.
        /// </summary> 
        public final static String StateExpandUp = "ExpandUp";
 
        /// <summary> 
        /// Left expand direction state of ExpandDirection state group.
        /// </summary> 
        public final static String StateExpandLeft = "ExpandLeft";

        /// <summary>
        /// Right expand direction state of ExpandDirection state group. 
        /// </summary>
        public final static String StateExpandRight = "ExpandRight"; 
 
        /// <summary>
        /// ExpandDirection state group. 
        /// </summary>
        public final String GroupExpandDirection = "ExpandDirectionStates";
//        #endregion
 

//        #region GroupSelection 
        /// <summary> 
        /// Selected state
        /// </summary> 
        public final String StateSelected = "Selected";

        /// <summary>
        /// Selected and unfocused state 
        /// </summary>
        public final String StateSelectedUnfocused = "SelectedUnfocused"; 
 
        /// <summary>
        /// Selected and inactive state 
        /// </summary>
        public final String StateSelectedInactive = "SelectedInactive";

        /// <summary> 
        /// Unselected state
        /// </summary> 
        public final String StateUnselected = "Unselected"; 

        /// <summary> 
        /// Selection state group
        /// </summary>
        public final String GroupSelection = "SelectionStates";
//        #endregion GroupSelection 

//        #region GroupEdit 
        /// <summary> 
        /// Editable state
        /// </summary> 
        public final String StateEditable = "Editable";

        /// <summary>
        /// Uneditable state 
        /// </summary>
        public final String StateUneditable = "Uneditable"; 
 
        /// <summary>
        /// Edit state group 
        /// </summary>
        public final String GroupEdit = "EditStates";
//        #endregion GroupEdit
 
//        #region GroupActive
        /// <summary> 
        /// Active state 
        /// </summary>
        public final String StateActive = "Active"; 

        /// <summary>
        /// Inactive state
        /// </summary> 
        public final String StateInactive = "Inactive";
 
        /// <summary> 
        /// Active state group
        /// </summary> 
        public final String GroupActive = "ActiveStates";
//        #endregion GroupActive

//        #region GroupValidation 
        /// <summary>
        /// Valid state 
        /// </summary> 
        public final String StateValid = "Valid";
 
        /// <summary>
        /// InvalidFocused state
        /// </summary>
        public final String StateInvalidFocused = "InvalidFocused"; 

        /// <summary> 
        /// InvalidUnfocused state 
        /// </summary>
        public final String StateInvalidUnfocused = "InvalidUnfocused"; 

        /// <summary>
        /// Validation state group
        /// </summary> 
        public final String GroupValidation = "ValidationStates";
//        #endregion GroupValidation 
 
//        #region GroupWatermark
        /// <summary> 
        /// Unwatermarked state
        /// </summary>
        public final String StateUnwatermarked = "Unwatermarked";
 
        /// <summary>
        /// Watermarked state 
        /// </summary> 
        public final String StateWatermarked = "Watermarked";
 
        /// <summary>
        /// Watermark state group
        /// </summary>
        public final String GroupWatermark = "WatermarkStates"; 
//        #endregion GroupWatermark
 
//        #region GroupChecked 

        public final String StateChecked = "Checked"; 
        public final String StateUnchecked = "Unchecked";
        public final String StateIndeterminate = "Indeterminate";

        public final String GroupCheck = "CheckStates"; 

//        #endregion 
 
//        #region GroupCurrent
        /// <summary> 
        /// Regular state
        /// </summary>
        public final String StateRegular = "Regular";
 
        /// <summary>
        /// Current state 
        /// </summary> 
        public final String StateCurrent = "Current";
 
        /// <summary>
        /// Current state group
        /// </summary>
        public final String GroupCurrent = "CurrentStates"; 
//        #endregion GroupCurrent
 
//        #region GroupInteraction 
        /// <summary>
        /// Display state 
        /// </summary>
        public final String StateDisplay = "Display";

        /// <summary> 
        /// Editing state
        /// </summary> 
        public final String StateEditing = "Editing"; 

        /// <summary> 
        /// Interaction state group
        /// </summary>
        public final String GroupInteraction = "InteractionStates";
//        #endregion GroupInteraction 

 
//        #region GroupSort 
        /// <summary>
        /// Unsorted state 
        /// </summary>
        public final String StateUnsorted = "Unsorted";

        /// <summary> 
        /// Sort Ascending state
        /// </summary> 
        public final String StateSortAscending = "SortAscending"; 

        /// <summary> 
        /// Sort Descending state
        /// </summary>
        public final String StateSortDescending = "SortDescending";
 
        /// <summary>
        /// Sort state group 
        /// </summary> 
        public final String GroupSort = "SortStates";
//        #endregion GroupSort 

//        #region DataGridRow

        public final String DATAGRIDROW_stateAlternate = "Normal_AlternatingRow"; 
        public final String DATAGRIDROW_stateMouseOver = "MouseOver";
        public final String DATAGRIDROW_stateMouseOverEditing = "MouseOver_Unfocused_Editing"; 
        public final String DATAGRIDROW_stateMouseOverEditingFocused = "MouseOver_Editing"; 
        public final String DATAGRIDROW_stateMouseOverSelected = "MouseOver_Unfocused_Selected";
        public final String DATAGRIDROW_stateMouseOverSelectedFocused = "MouseOver_Selected"; 
        public final String DATAGRIDROW_stateNormal = "Normal";
        public final String DATAGRIDROW_stateNormalEditing = "Unfocused_Editing";
        public final String DATAGRIDROW_stateNormalEditingFocused = "Normal_Editing";
        public final String DATAGRIDROW_stateSelected = "Unfocused_Selected"; 
        public final String DATAGRIDROW_stateSelectedFocused = "Normal_Selected";
 
//        #endregion DataGridRow 

//        #region DataGridRowHeader 

        public final String DATAGRIDROWHEADER_stateMouseOver = "MouseOver";
        public final String DATAGRIDROWHEADER_stateMouseOverCurrentRow = "MouseOver_CurrentRow";
        public final String DATAGRIDROWHEADER_stateMouseOverEditingRow = "MouseOver_Unfocused_EditingRow"; 
        public final String DATAGRIDROWHEADER_stateMouseOverEditingRowFocused = "MouseOver_EditingRow";
        public final String DATAGRIDROWHEADER_stateMouseOverSelected = "MouseOver_Unfocused_Selected"; 
        public final String DATAGRIDROWHEADER_stateMouseOverSelectedCurrentRow = "MouseOver_Unfocused_CurrentRow_Selected"; 
        public final String DATAGRIDROWHEADER_stateMouseOverSelectedCurrentRowFocused = "MouseOver_CurrentRow_Selected";
        public final String DATAGRIDROWHEADER_stateMouseOverSelectedFocused = "MouseOver_Selected"; 
        public final String DATAGRIDROWHEADER_stateNormal = "Normal";
        public final String DATAGRIDROWHEADER_stateNormalCurrentRow = "Normal_CurrentRow";
        public final String DATAGRIDROWHEADER_stateNormalEditingRow = "Unfocused_EditingRow";
        public final String DATAGRIDROWHEADER_stateNormalEditingRowFocused = "Normal_EditingRow"; 
        public final String DATAGRIDROWHEADER_stateSelected = "Unfocused_Selected";
        public final String DATAGRIDROWHEADER_stateSelectedCurrentRow = "Unfocused_CurrentRow_Selected"; 
        public final String DATAGRIDROWHEADER_stateSelectedCurrentRowFocused = "Normal_CurrentRow_Selected"; 
        public final String DATAGRIDROWHEADER_stateSelectedFocused = "Normal_Selected";
 
//        #endregion DataGridRowHeader


        /// <summary> 
        /// Use VisualStateManager to change the visual state of the control.
        /// </summary> 
        /// <param name="control"> 
        /// Control whose visual state is being changed.
        /// </param> 
        /// <param name="useTransitions">
        /// true to use transitions when updating the visual state, false to
        /// snap directly to the new visual state.
        /// </param> 
        /// <param name="stateNames">
        /// Ordered list of state names and fallback states to transition into. 
        /// Only the first state to be found will be used. 
        /// </param>
        public static void GoToState(Control control, boolean useTransitions, /*params*/ String[] stateNames) 
        {
            if (stateNames == null)
            {
                return; 
            }
 
            foreach (String name in stateNames) 
            {
                if (VisualStateManager.GoToState(control, name, useTransitions)) 
                {
                    break;
                }
            } 
        }
    } 