package org.summer.view.widget.model;

import org.summer.view.widget.collection.IList;

public interface IListSource {
	IList GetList ();
	boolean ContainsListCollection { get; }
}