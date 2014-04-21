package org.summer.view.widget.model;

import org.summer.view.widget.EventArgs;

/// <devdoc>
/// <para>Provides data for the <see langword='PropertyChanged'/> 
/// event.</para>
/// </devdoc> 
//[HostProtection(SharedState = true)] 
public class PropertyChangedEventArgs<T> extends EventArgs {
    private final String propertyName; 

    /// <devdoc>
    /// <para>Initializes a new instance of the <see cref='System.ComponentModel.PropertyChangedEventArgs'/>
    /// class.</para> 
    /// </devdoc>
    public PropertyChangedEventArgs(String propertyName) { 
        this.propertyName = propertyName; 
    }

    /// <devdoc>
    ///    <para>Indicates the name of the property that changed.</para>
    /// </devdoc>
    public /*virtual*/ String PropertyName { 
        get {
            return propertyName; 
        } 
    }
}