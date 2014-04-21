package org.summer.view.window;

import org.summer.view.widget.ContentElement;
import org.summer.view.widget.IInputElement;
import org.summer.view.widget.Point;
import org.summer.view.widget.Rect;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.ReadOnlyCollection;

public interface IContentHost {
	ReadOnlyCollection<Rect> GetRectangles(ContentElement child);

	IInputElement InputHitTest(Point point);

	void OnChildDesiredSizeChanged(UIElement child);
	
	IEnumerator<IInputElement> HostedElements { get; };
}
