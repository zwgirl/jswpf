package org.summer.view.widget.controls;

public enum ValidationStep {
	/**
	 * 在进行任何转换之前运行 ValidationRule。
	 */
	RawProposedValue, //

	/**
	 * 在转换了值后运行 ValidationRule。
	 */
	ConvertedProposedValue, //

	/**
	 * 在更新了源后运行 ValidationRule。
	 */
	UpdatedValue, //

	/**
	 * 在将值提交到源后运行 ValidationRule。
	 */
	CommittedValue, //
}