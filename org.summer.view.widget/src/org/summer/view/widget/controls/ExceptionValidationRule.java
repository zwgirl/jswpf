package org.summer.view.widget.controls;

import org.summer.view.widget.CultureInfo;

/// <summary>
///     ExceptionValidationRule can be added to the ValidationRulesCollection of a Binding
///     or MultiBinding to indicate that Exceptions that occur during UpdateSource should
///     be considered ValidationErrors
/// </summary>
public class ExceptionValidationRule extends ValidationRule {

	// / <summary>
	// / ExceptionValidationRule ctor.
	// / </summary>
	public ExceptionValidationRule() {
	}

	// / <summary>
	// / Validate is called when Data binding is updating
	// / </summary>
	public ValidationResult Validate(Object value, CultureInfo cultureInfo) {
		return ValidationResult.ValidResult;
	}

	public static final ExceptionValidationRule Instance = new ExceptionValidationRule();
}