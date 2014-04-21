package org.summer.view.widget.internal;

import org.summer.view.widget.EventArgs;
import org.summer.view.widget.InheritablePropertyChangeInfo;


// Event args for the (/*internal*/ public) InheritedPropertyChanged event 
/*internal*/ public class InheritedPropertyChangedEventArgs extends EventArgs 
{
    /*internal*/ public InheritedPropertyChangedEventArgs(/*ref*/ InheritablePropertyChangeInfo info) 
    {
        _info = info;
    }

    /*internal*/ public InheritablePropertyChangeInfo Info
    { 
        get { return _info; } 
    }

    private InheritablePropertyChangeInfo _info;
}

// Handler delegate for the (/*internal*/ public) InheritedPropertyChanged event 
///*internal*/ public delegate void InheritedPropertyChangedEventHandler(Object sender, InheritedPropertyChangedEventArgs e);