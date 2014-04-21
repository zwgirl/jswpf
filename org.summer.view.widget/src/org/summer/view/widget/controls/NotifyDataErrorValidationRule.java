package org.summer.view.widget.controls;

import org.summer.view.widget.CultureInfo;

/// <summary>
///     DataErrorValidationRule can be added to the ValidationRulesCollection of a Binding 
///     or MultiBinding to indicate that data errors in the source object should
///     be considered ValidationErrors
/// </summary>
public /*sealed*/ class NotifyDataErrorValidationRule extends ValidationRule 
{
    /// <summary> 
    /// DataErrorValidationRule ctor. 
    /// </summary>
    public NotifyDataErrorValidationRule() 
    {
    	super(ValidationStep.UpdatedValue, true);
    }

    /// <summary> 
    /// Validate is called when Data binding is updating
    /// </summary> 
    public /*override*/ ValidationResult Validate(Object value, CultureInfo cultureInfo) 
    {
        // this rule should never actually be called.  The errors from INotifyDataErrorInfo 
        // are obtained by listening to the ErrorsChanged event, not from running a rule.
        // But we need to define this method (it's abstract in the base class), and we
        // need to return something.  ValidResult does the least harm.
        return ValidationResult.ValidResult; 
    }

    public static final NotifyDataErrorValidationRule Instance = new NotifyDataErrorValidationRule(); 
}