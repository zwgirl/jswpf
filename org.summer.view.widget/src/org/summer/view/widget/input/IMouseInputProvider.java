package org.summer.view.widget.input;

import java.awt.Cursor;

import org.summer.view.widget.IInputElement;
import org.summer.view.widget.Point;

public interface IMouseInputProvider extends IInputProvider {
	boolean SetCursor(Cursor cursor);

	boolean CaptureMouse();

	void ReleaseMouseCapture();

	int GetIntermediatePoints(IInputElement relativeTo, Point[] points);
}