package org.summer.view.widget.controls;

public interface IProvidePropertyFallback {
    /// <summary> 
    /// Says if the type can provide fallback value for the given property
    /// </summary>
    boolean CanProvidePropertyFallback(String property);

    /// <summary> 
    /// Returns the fallback value for the given property.
    /// </summary> 
    Object /*IProvidePropertyFallback.*/ProvidePropertyFallback(String property, Exception cause);
}
