/**
 * VisualStates
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var VisualStates = declare("VisualStates", null,{
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 ){
				this._store = index | 0x80000000;
			}else if(arguments.length==2 ){
				this._store = index & 0x7FFFFFFF;
				if (found){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
		}
	});
	
	Object.defineProperties(VisualStates,{

	});
	
	/// <summary>
    /// Identifies the Today state. 
    /// </summary>
//    internal const string 
    VisualStates.StateToday = "Today"; 

    /// <summary>
    /// Identifies the RegularDay state. 
    /// </summary>
//    internal const string 
    VisualStates.StateRegularDay = "RegularDay";

    /// <summary> 
    /// Name of the Day state group.
    /// </summary> 
//    internal const string 
    VisualStates.GroupDay = "DayStates"; 

    /// <summary> 
    /// Identifies the BlackoutDay state.
    /// </summary>
//    internal const string 
    VisualStates.StateBlackoutDay = "BlackoutDay";

    /// <summary>
    /// Identifies the NormalDay state. 
    /// </summary> 
//    internal const string 
    VisualStates.StateNormalDay = "NormalDay";

    /// <summary>
    /// Name of the BlackoutDay state group.
    /// </summary>
//    internal const string 
    VisualStates.GroupBlackout = "BlackoutDayStates"; 

    /// <summary> 
    /// Unfocused state for Calendar Buttons
    /// </summary>
//    public const string 
    VisualStates.StateCalendarButtonUnfocused = "CalendarButtonUnfocused";

    /// <summary>
    /// Focused state for Calendar Buttons 
    /// </summary> 
//    public const string 
    VisualStates.StateCalendarButtonFocused = "CalendarButtonFocused";

    /// <summary>
    /// CalendarButtons Focus state group
    /// </summary>
//    public const string 
    VisualStates.GroupCalendarButtonFocus = "CalendarButtonFocusStates"; 

    /// <summary> 
    /// Normal state
    /// </summary>
//    public const string 
    VisualStates.StateNormal = "Normal";

    /// <summary>
    /// MouseOver state 
    /// </summary> 
//    public const string 
    VisualStates.StateMouseOver = "MouseOver";

    /// <summary>
    /// Pressed state
    /// </summary>
//    public const string 
    VisualStates.StatePressed = "Pressed"; 

    /// <summary> 
    /// Disabled state 
    /// </summary>
//    public const string 
    VisualStates.StateDisabled = "Disabled"; 

    /// <summary>
    /// Readonly state
    /// </summary> 
//    public const string 
    VisualStates.StateReadOnly = "ReadOnly";

    /// <summary> 
    /// Transition into the Normal state in the ProgressBar template.
    /// </summary> 
//    internal const string 
    VisualStates.StateDeterminate = "Determinate";

    /// <summary>
    /// Common state group 
    /// </summary>
//    public const string 
    VisualStates.GroupCommon = "CommonStates"; 
    /// <summary>
    /// Unfocused state
    /// </summary>
//    public const string 
    VisualStates.StateUnfocused = "Unfocused"; 

    /// <summary> 
    /// Focused state 
    /// </summary>
//    public const string 
    VisualStates.StateFocused = "Focused"; 

    /// <summary>
    /// Focused and Dropdown is showing state
    /// </summary> 
//    public const string 
    VisualStates.StateFocusedDropDown = "FocusedDropDown";

    /// <summary> 
    /// Focus state group
    /// </summary> 
//    public const string 
    VisualStates.GroupFocus = "FocusStates";

    /// <summary> 
    /// Expanded state of the Expansion state group. 
    /// </summary>
//    public const string 
    VisualStates.StateExpanded = "Expanded"; 

    /// <summary>
    /// Collapsed state of the Expansion state group.
    /// </summary> 
//    public const string 
    VisualStates.StateCollapsed = "Collapsed";

    /// <summary> 
    /// Expansion state group.
    /// </summary> 
//    public const string 
    VisualStates.GroupExpansion = "ExpansionStates";

//    public const string 
    VisualStates.StateOpen = "Open"; 
//    public const string 
    VisualStates.StateClosed = "Closed"; 

//    public const string 
    VisualStates.GroupOpen = "OpenStates"; 

    /// <summary> 
    /// HasItems state of the HasItems state group. 
    /// </summary>
//    public const string 
    VisualStates.StateHasItems = "HasItems"; 

    /// <summary>
    /// NoItems state of the HasItems state group.
    /// </summary> 
//    public const string 
    VisualStates.StateNoItems = "NoItems";

    /// <summary> 
    /// HasItems state group.
    /// </summary> 
//    public const string 
    VisualStates.GroupHasItems = "HasItemsStates";

    /// <summary> 
    /// Down expand direction state of ExpandDirection state group. 
    /// </summary>
//    public const string 
    VisualStates.StateExpandDown = "ExpandDown"; 

    /// <summary>
    /// Up expand direction state of ExpandDirection state group.
    /// </summary> 
//    public const string 
    VisualStates.StateExpandUp = "ExpandUp";

    /// <summary> 
    /// Left expand direction state of ExpandDirection state group.
    /// </summary> 
//    public const string 
    VisualStates.StateExpandLeft = "ExpandLeft";

    /// <summary>
    /// Right expand direction state of ExpandDirection state group. 
    /// </summary>
//    public const string 
    VisualStates.StateExpandRight = "ExpandRight"; 

    /// <summary>
    /// ExpandDirection state group. 
    /// </summary>
//    public const string 
    VisualStates.GroupExpandDirection = "ExpandDirectionStates";
    /// <summary> 
    /// Selected state
    /// </summary> 
//    public const string 
    VisualStates.StateSelected = "Selected";

    /// <summary>
    /// Selected and unfocused state 
    /// </summary>
//    public const string 
    VisualStates.StateSelectedUnfocused = "SelectedUnfocused"; 

    /// <summary>
    /// Selected and inactive state 
    /// </summary>
//    public const string 
    VisualStates.StateSelectedInactive = "SelectedInactive";

    /// <summary> 
    /// Unselected state
    /// </summary> 
//    public const string 
    VisualStates.StateUnselected = "Unselected"; 

    /// <summary> 
    /// Selection state group
    /// </summary>
//    public const string 
    VisualStates.GroupSelection = "SelectionStates";
    /// <summary> 
    /// Editable state
    /// </summary> 
//    public const string 
    VisualStates.StateEditable = "Editable";

    /// <summary>
    /// Uneditable state 
    /// </summary>
//    public const string 
    VisualStates.StateUneditable = "Uneditable"; 

    /// <summary>
    /// Edit state group 
    /// </summary>
//    public const string 
    VisualStates.GroupEdit = "EditStates";
    /// <summary> 
    /// Active state 
    /// </summary>
//    public const string 
    VisualStates.StateActive = "Active"; 

    /// <summary>
    /// Inactive state
    /// </summary> 
//    public const string 
    VisualStates.StateInactive = "Inactive";

    /// <summary> 
    /// Active state group
    /// </summary> 
//    public const string 
    VisualStates.GroupActive = "ActiveStates";
    /// <summary>
    /// Valid state 
    /// </summary> 
//    public const string 
    VisualStates.StateValid = "Valid";

    /// <summary>
    /// InvalidFocused state
    /// </summary>
//    public const string 
    VisualStates.StateInvalidFocused = "InvalidFocused"; 

    /// <summary> 
    /// InvalidUnfocused state 
    /// </summary>
//    public const string 
    VisualStates.StateInvalidUnfocused = "InvalidUnfocused"; 

    /// <summary>
    /// Validation state group
    /// </summary> 
//    public const string 
    VisualStates.GroupValidation = "ValidationStates";
    /// <summary> 
    /// Unwatermarked state
    /// </summary>
//    public const string 
    VisualStates.StateUnwatermarked = "Unwatermarked";

    /// <summary>
    /// Watermarked state 
    /// </summary> 
//    public const string 
    VisualStates.StateWatermarked = "Watermarked";

    /// <summary>
    /// Watermark state group
    /// </summary>
//    public const string 
    VisualStates.GroupWatermark = "WatermarkStates"; 

//    public const string 
    VisualStates.StateChecked = "Checked"; 
//    public const string 
    VisualStates.StateUnchecked = "Unchecked";
//    public const string 
    VisualStates.StateIndeterminate = "Indeterminate";

//    public const string 
    VisualStates.GroupCheck = "CheckStates"; 

    /// <summary> 
    /// Regular state
    /// </summary>
//    public const string 
    VisualStates.StateRegular = "Regular";

    /// <summary>
    /// Current state 
    /// </summary> 
//    public const string 
    VisualStates.StateCurrent = "Current";

    /// <summary>
    /// Current state group
    /// </summary>
//    public const string 
    VisualStates.GroupCurrent = "CurrentStates"; 
    /// <summary>
    /// Display state 
    /// </summary>
//    public const string 
    VisualStates.StateDisplay = "Display";

    /// <summary> 
    /// Editing state
    /// </summary> 
//    public const string 
    VisualStates.StateEditing = "Editing"; 

    /// <summary> 
    /// Interaction state group
    /// </summary>
//    public const string 
    VisualStates.GroupInteraction = "InteractionStates";
    /// <summary>
    /// Unsorted state 
    /// </summary>
//    public const string 
    VisualStates.StateUnsorted = "Unsorted";

    /// <summary> 
    /// Sort Ascending state
    /// </summary> 
//    public const string 
    VisualStates.StateSortAscending = "SortAscending"; 

    /// <summary> 
    /// Sort Descending state
    /// </summary>
//    public const string 
    VisualStates.StateSortDescending = "SortDescending";

    /// <summary>
    /// Sort state group 
    /// </summary> 
//    public const string 
    VisualStates.GroupSort = "SortStates";

//    public const string 
    VisualStates.DATAGRIDROW_stateAlternate = "Normal_AlternatingRow"; 
//    public const string 
    VisualStates.DATAGRIDROW_stateMouseOver = "MouseOver";
//    public const string 
    VisualStates.DATAGRIDROW_stateMouseOverEditing = "MouseOver_Unfocused_Editing"; 
//    public const string 
    VisualStates.DATAGRIDROW_stateMouseOverEditingFocused = "MouseOver_Editing"; 
//    public const string 
    VisualStates.DATAGRIDROW_stateMouseOverSelected = "MouseOver_Unfocused_Selected";
//    public const string 
    VisualStates.DATAGRIDROW_stateMouseOverSelectedFocused = "MouseOver_Selected"; 
//    public const string 
    VisualStates.DATAGRIDROW_stateNormal = "Normal";
//    public const string 
    VisualStates.DATAGRIDROW_stateNormalEditing = "Unfocused_Editing";
//    public const string 
    VisualStates.DATAGRIDROW_stateNormalEditingFocused = "Normal_Editing";
//    public const string 
    VisualStates.DATAGRIDROW_stateSelected = "Unfocused_Selected"; 
//    public const string 
    VisualStates.DATAGRIDROW_stateSelectedFocused = "Normal_Selected";


//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateMouseOver = "MouseOver";
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateMouseOverCurrentRow = "MouseOver_CurrentRow";
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateMouseOverEditingRow = "MouseOver_Unfocused_EditingRow"; 
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateMouseOverEditingRowFocused = "MouseOver_EditingRow";
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateMouseOverSelected = "MouseOver_Unfocused_Selected"; 
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateMouseOverSelectedCurrentRow = "MouseOver_Unfocused_CurrentRow_Selected"; 
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateMouseOverSelectedCurrentRowFocused = "MouseOver_CurrentRow_Selected";
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateMouseOverSelectedFocused = "MouseOver_Selected"; 
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateNormal = "Normal";
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateNormalCurrentRow = "Normal_CurrentRow";
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateNormalEditingRow = "Unfocused_EditingRow";
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateNormalEditingRowFocused = "Normal_EditingRow"; 
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateSelected = "Unfocused_Selected";
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateSelectedCurrentRow = "Unfocused_CurrentRow_Selected"; 
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateSelectedCurrentRowFocused = "Normal_CurrentRow_Selected"; 
//    public const string 
    VisualStates.DATAGRIDROWHEADER_stateSelectedFocused = "Normal_Selected";
    

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
//    public static void 
    VisualStates.GoToState = function(/*Control*/ control, /*bool*/ useTransitions, /*params string[]*/ stateNames) 
    {
        if (stateNames == null)
        {
            return; 
        }

        for/*each*/ (/*string*/var name in stateNames) 
        {
            if (VisualStateManager.GoToState(control, name, useTransitions)) 
            {
                break;
            }
        } 
    };
	
	VisualStates.Type = new Type("VisualStates", VisualStates, [Object.Type]);
	return VisualStates;
});

     




