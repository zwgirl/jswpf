package org.summer.view.widget.controls;

import org.summer.view.widget.collection.Collection;

/// <summary>
///     ValidationRulesCollection is a collection of ValidationRule
///     instances on either a Binding or a MultiBinding.  Each of the rules
///     is checked for validity on update 
/// </summary>
/*internal*/public class ValidationRuleCollection extends
		Collection<ValidationRule> {

	// -----------------------------------------------------
	//
	// Protected Methods
	//
	// -----------------------------------------------------

	// #region Protected Methods

	// / <summary>
	// / called by base class Collection&lt;T&gt; when an item is added to list;
	// / raises a CollectionChanged event to any listeners
	// / </summary>
	protected/* override */void InsertItem(int index, ValidationRule item) {
		if (item == null)
			throw new IllegalArgumentException("item");
		super.InsertItem(index, item);
	}

	// / <summary>
	// / called by base class Collection&lt;T&gt; when an item is added to list;
	// / raises a CollectionChanged event to any listeners
	// / </summary>
	protected/* override */void SetItem(int index, ValidationRule item) {
		if (item == null)
			throw new IllegalArgumentException("item");
		super.SetItem(index, item);
	}

	// #endregion Protected Methods

}