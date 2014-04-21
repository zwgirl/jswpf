package org.summer.view.widget.internal;

import org.summer.view.widget.DependencyProperty;

/*internal*/public class LivePropertyInfo 
{
    public LivePropertyInfo(String path, DependencyProperty dp) 
    { 
        _path = path;
        _dp = dp; 
    }

    String _path;
    public String Path { get { return _path; } } 

    DependencyProperty _dp; 
    public DependencyProperty Property { get { return _dp; } } 
}