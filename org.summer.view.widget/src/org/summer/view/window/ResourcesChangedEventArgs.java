package org.summer.view.window;

import org.summer.view.widget.EventArgs;
import org.summer.view.widget.ResourcesChangeInfo;

/// <summary>
///     These EventArgs are used to pass additional
///     information during a ResourcesChanged event 
/// </summary>
/*internal*/ public class ResourcesChangedEventArgs extends EventArgs 
{ 
    /*internal*/ public ResourcesChangedEventArgs(ResourcesChangeInfo info)
    { 
        _info = info;
    }

    /*internal*/ public ResourcesChangeInfo Info 
    {
        get { return _info; } 
    } 

    private ResourcesChangeInfo _info; 
}