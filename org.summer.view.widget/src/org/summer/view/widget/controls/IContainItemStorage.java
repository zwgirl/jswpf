package org.summer.view.widget.controls;

import org.summer.view.widget.DependencyProperty;

public interface IContainItemStorage {

	Object ReadItemValue(Object item, DependencyProperty dp);

	void StoreItemValue(Object item, DependencyProperty dp, Object value);

	void ClearItemValue(Object item, DependencyProperty dp);

	void ClearValue(DependencyProperty dp);

	void Clear();
}
