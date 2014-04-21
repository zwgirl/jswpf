package org.summer.view.widget.markup;

public interface INameScope {
	Object FindName(String name);

	void RegisterName(String name, Object scopedElement);

	void UnregisterName(String name);
}