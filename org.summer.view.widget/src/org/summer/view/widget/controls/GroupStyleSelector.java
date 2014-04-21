package org.summer.view.widget.controls;

import org.summer.view.widget.data.CollectionViewGroup;

public interface GroupStyleSelector {
	GroupStyle Select(
			CollectionViewGroup group,
			int level
		);
}
