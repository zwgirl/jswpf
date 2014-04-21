package org.summer.view.widget.model;

import org.summer.view.widget.EventArgs;

/// <devdoc>
    /// <para>Provides data for the <see langword='ErrorsChanged'/> 
    /// event.</para>
    /// </devdoc> 
//    [HostProtection(SharedState = true)] 
public class DataErrorsChangedEventArgs extends EventArgs {
    private final String propertyName; 

    /// <devdoc>
    /// <para>Initializes a new instance of the <see cref='System.ComponentModel.DataErrorsChangedEventArgs'/>
    /// class.</para> 
    /// </devdoc>
    public DataErrorsChangedEventArgs(String propertyName) { 
        this.propertyName = propertyName; 
    }

    /// <devdoc>
    ///    <para>Indicates the name of the property whose errors changed.</para>
    /// </devdoc>
    public /*virtual*/ String PropertyName { 
        get {
            return propertyName; 
        } 
    }
}