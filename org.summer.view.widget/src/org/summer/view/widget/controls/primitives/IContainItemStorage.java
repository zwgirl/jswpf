package org.summer.view.widget.controls.primitives;

import org.summer.view.widget.DependencyProperty;

public interface IContainItemStorage {
	void Clear();

	void ClearItemValue(Object item, DependencyProperty dp);

	void ClearValue(DependencyProperty dp);

	Object ReadItemValue(Object item, DependencyProperty dp);

	void StoreItemValue(Object item, DependencyProperty dp, Object value);
}
