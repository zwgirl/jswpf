package org.summer.view.widget.controls;
/// <summary> Describes if a validation error has been added or cleared 
/// </summary> 
public enum ValidationErrorEventAction
{ 
    /**
     * A new ValidationError has been detected.
     */
    Added,
    /**
     * An existing ValidationError has been cleared.
     */
    Removed, 
}