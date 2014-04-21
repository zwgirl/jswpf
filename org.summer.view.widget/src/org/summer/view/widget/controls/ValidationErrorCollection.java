package org.summer.view.widget.controls;

import org.summer.view.widget.collection.ObservableCollection;
import org.summer.view.widget.collection.ReadOnlyObservableCollection;
/// <summary> 
///      ValidationErrorCollection contains the list of ValidationErrors from
///      the various Bindings and MultiBindings on an Element.  ValidationErrorCollection 
///      be set through the Validation.ErrorsProperty. 
/// </summary>

/*internal*/public class ValidationErrorCollection extends
		ObservableCollection<ValidationError> {

	// / <summary>
	// / Empty collection that serves as a default value for
	// / Validation.ErrorsProperty.
	// / </summary>
	public static final ReadOnlyObservableCollection<ValidationError> Empty = new ReadOnlyObservableCollection<ValidationError>(
			new ValidationErrorCollection());
}