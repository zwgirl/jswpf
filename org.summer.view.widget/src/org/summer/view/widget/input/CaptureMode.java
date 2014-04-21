package org.summer.view.widget.input;

public enum CaptureMode {
	Element, // Mouse capture is applied to a single element. Mouse input goes
				// to the captured element.
	None, // No mouse capture. Mouse input goes to the element under the mouse.
	SubTree, // Mouse capture is applied to a subtree of elements. If the mouse
				// is over a child of the element with capture, mouse input is
				// sent to the child element. Otherwise, mouse input is sent to
				// the element with mouse capture.
}