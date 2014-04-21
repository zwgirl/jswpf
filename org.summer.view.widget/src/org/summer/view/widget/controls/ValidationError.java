package org.summer.view.widget.controls;

import org.summer.view.widget.ArgumentNullException;

/// <summary>
/// An error in validation -- either created by an ValidationRule 
/// or explicitly through MarkInvalid on BindingExpression or MultiBindingExpression. 
/// </summary>
public class ValidationError 
{

    /// <summary>
    /// ValidationError ctor 
    /// </summary>
    /// <param name="ruleInError">rule that detected validation error</param> 
    /// <param name="bindingInError">BindingExpression for which validation failed</param> 
    /// <param name="errorContent">validation rule specific details to the error</param>
    /// <param name="exception">exception that caused the validation failure; optional, can be null</param> 
    public ValidationError(ValidationRule ruleInError, Object bindingInError, Object errorContent, Exception exception)
    {
        if (ruleInError == null)
            throw new ArgumentNullException("ruleInError"); 
        if (bindingInError == null)
            throw new ArgumentNullException("bindingInError"); 

        _ruleInError = ruleInError;
        _bindingInError = bindingInError; 
        _errorContent = errorContent;
        _exception = exception;
    }

    /// <summary>
    /// ValidationError ctor 
    /// <param name="ruleInError">rule that detected validation error</param> 
    /// <param name="bindingInError">BindingExpression for which validation failed</param>
    /// </summary> 
    public ValidationError(ValidationRule ruleInError, Object bindingInError) 
    {
    	this(ruleInError, bindingInError, null, null);
    }

    /// <summary>
    /// If the validationError is as the result of an ValidationRule, 
    /// then this is the reference to that ValidationRule. 
    /// </summary>
    public ValidationRule RuleInError 
    {
        get
        {
            return _ruleInError; 
        }
        set 
        { 
            _ruleInError = value;
        } 
    }

    /// <summary>
    /// Some additional context for the ValidationError, such as 
    /// a string describing the error.
    /// </summary> 
    public Object ErrorContent 
    {
        get 
        {
            return _errorContent;
        }

        set
        { 
            _errorContent = value; 
        }
    } 

    /// <summary>
    /// If the ValidationError is the result of some Exception,
    /// this will be a reference to that exception. 
    /// </summary>
    public Exception Exception 
    { 
        get
        { 
            return _exception;
        }

        set 
        {
            _exception = value; 
        } 
    }

    /// <summary>
    /// The BindingExpression or MultiBindingExpression that was marked invalid
    /// either explicitly, or while validating the ValidationRules collection.
    /// </summary> 
    public Object BindingInError
    { 
        get 
        {
            return _bindingInError; 
        }
    }


    private ValidationRule     _ruleInError;
    private Object              _errorContent; 
    private Exception           _exception; 
    private Object              _bindingInError;

}