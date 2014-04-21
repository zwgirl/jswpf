package org.summer.view.widget.internal;
/*internal*/public class DataBindOperation 
{ 
    public DataBindOperation(DispatcherOperationCallback method, boolean arg, int cost/*=1*/)
    { 
        _method = method;
        _arg = arg;
        _cost = cost;
    } 

    public int Cost 
    { 
        get { return _cost; }
        set { _cost = value; } 
    }

    public void Invoke()
    { 
        _method(_arg);
    } 

    DispatcherOperationCallback _method;
    boolean _arg; 
    int _cost;
}