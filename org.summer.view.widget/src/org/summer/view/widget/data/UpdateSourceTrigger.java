package org.summer.view.widget.data;
public enum UpdateSourceTrigger 
    {
        /// <summary> Obtain trigger from target property default </summary>
        Default,
        /// <summary> Update whenever the target property changes </summary> 
        PropertyChanged,
        /// <summary> Update only when target element loses focus, or when Binding deactivates </summary> 
        LostFocus, 
        /// <summary> Update only by explicit call to BindingExpression.UpdateSource() </summary>
        Explicit 
    }

    /// <summary>
    /// Base class for Binding, PriorityBinding, and MultiBinding. 
    /// </summary>
//    [MarkupExtensionReturnType(typeof(object))] 
//    [Localizability(LocalizationCategory.None, Modifiability = Modifiability.Unmodifiable, Readability = Readability.Unreadable)] // Not localizable by-default 
    