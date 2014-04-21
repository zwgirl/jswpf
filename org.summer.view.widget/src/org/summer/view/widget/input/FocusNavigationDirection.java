package org.summer.view.widget.input;

public enum FocusNavigationDirection {
	Down,//	Move focus to another focusable element downwards from the currently focused element. 
	First,//	Move focus to the first focusable element in tab order. Not supported for PredictFocus. 
	Last,//	Move focus to the last focusable element in tab order. Not supported for PredictFocus. 
	Left,//	Move focus to another focusable element to the left of the currently focused element. 
	Next,//	Move focus to the next focusable element in tab order. Not supported for PredictFocus. 
	Previous,//	Move focus to the previous focusable element in tab order. Not supported for PredictFocus. 
	Right,//	Move focus to another focusable element to the right of the currently focused element. 
	Up,//	Move focus to another focusable element upwards from the currently focused element. 
}
