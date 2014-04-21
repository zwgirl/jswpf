package org.summer.view.widget.controls.primitives;

public enum PlacementMode {
	Absolute, // A position of the Popup control relative to the upper-left
				// corner of the screen and at an offset that is defined by the
				// HorizontalOffset and VerticalOffset property values. If the
				// screen edge obscures the Popup, the control then repositions
				// itself to align with the edge.
	AbsolutePoint, // A position of the Popup control relative to the upper-left
					// corner of the screen and at an offset that is defined by
					// the HorizontalOffset and VerticalOffset property values.
					// If the screen edge obscures the Popup, the control
					// extends in the opposite direction from the axis defined
					// by the HorizontalOffset or VerticalOffset=.
	Bottom, // A position of the Popup control where the control aligns its
			// upper edge with the lower edge of the PlacementTarget and aligns
			// its left edge with the left edge of the PlacementTarget. If the
			// lower screen-edge obscures the Popup, the control repositions
			// itself so that its lower edge aligns with the upper edge of the
			// PlacementTarget. If the upper screen-edge obscures the Popup, the
			// control then repositions itself so that its upper edge aligns
			// with the upper screen-edge.
	Center, // A position of the Popup control where it is centered over the
			// PlacementTarget. If a screen edge obscures the Popup, the control
			// repositions itself to align with the screen edge.
	Custom, // A position and repositioning behavior for the Popup control that
			// is defined by the CustomPopupPlacementCallback delegate specified
			// by the Popup.CustomPopupPlacementCallback property.
	Left, // A Popup control that aligns its left edge with the right edge of
			// the PlacementTarget and aligns its upper edge with the upper edge
			// of the PlacementTarget. If the left screen-edge obscures the
			// Popup, the control repositions itself so that its left edge
			// aligns with the right edge of the PlacementTarget. If the right
			// screen-edge obscures the Popup, the right edge of the control
			// aligns with the right screen-edge. If the upper or lower
			// screen-edge obscures the Popup, the control repositions itself to
			// align with the obscuring screen edge.
	Mouse, // A postion of the Popup control that aligns its upper edge with the
			// lower edge of the bounding box of the mouse and aligns its left
			// edge with the left edge of the bounding box of the mouse. If the
			// lower screen-edge obscures the Popup, it repositions itself to
			// align with the upper edge of the bounding box of the mouse. If
			// the upper screen-edge obscures the Popup, the control repositions
			// itself to align with the upper screen-edge.
	MousePoint, // A position of the Popup control relative to the tip of the
				// mouse cursor and at an offset that is defined by the
				// HorizontalOffset and VerticalOffset property values. If a
				// horizontal or vertical screen edge obscures the Popup, it
				// opens in the opposite direction from the obscuring edge. If
				// the opposite screen edge also obscures the Popup, it then
				// aligns with the obscuring screen edge.
	Relative, // A position of the Popup control relative to the upper-left
				// corner of the PlacementTarget and at an offset that is
				// defined by the HorizontalOffset and VerticalOffset property
				// values. If the screen edge obscures the Popup, the control
				// repositions itself to align with the screen edge.
	RelativePoint, // A position of the Popup control relative to the upper-left
					// corner of the PlacementTarget and at an offset that is
					// defined by the HorizontalOffset and VerticalOffset
					// property values. If a screen edge obscures the Popup, the
					// Popup extends in the opposite direction from the
					// direction from the axis defined by the HorizontalOffset
					// or VerticalOffset. If the opposite screen edge also
					// obscures the Popup, the control then aligns with this
					// screen edge.
	Right, // A position of the Popup control that aligns its left edge with the
			// right edge of the PlacementTarget and aligns its upper edge with
			// the upper edge of the PlacementTarget. If the right screen-edge
			// obscures the Popup, the control repositions itself so that its
			// left edge aligns with the left edge of the PlacementTarget. If
			// the left screen-edge obscures the Popup, the control repositions
			// itself so that its left edge aligns with the left screen-edge. If
			// the upper or lower screen-edge obscures the Popup, the control
			// then repositions itself to align with the obscuring screen edge.
	Top, // A position of the Popup control that aligns its lower edge with the
			// upper edge of the PlacementTarget and aligns its left edge with
			// the left edge of the PlacementTarget. If the upper screen-edge
			// obscures the Popup, the control repositions itself so that its
			// upper edge aligns with the lower edge of the PlacementTarget. If
			// the lower screen-edge obscures the Popup, the lower edge of the
			// control aligns with the lower screen-edge. If the left or right
			// screen-edge obscures the Popup, it then repositions itself to
			// align with the obscuring screen.
}
