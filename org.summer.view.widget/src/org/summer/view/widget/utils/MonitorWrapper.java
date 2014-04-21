package org.summer.view.widget.utils;

import org.summer.view.widget.IDisposable;

/// <summary>
/// Monitor with Busy flag while it is entered.
/// </summary> 
/*internal*/ public class MonitorWrapper
{ 
    public IDisposable Enter() 
    {
        Monitor.Enter(_syncRoot); 
        Interlocked.Increment(/*ref*/ _enterCount);
        return new MonitorHelper(this);
    }

    public void Exit()
    { 
        int count = Interlocked.Decrement(/*ref*/ _enterCount); 
        Invariant.Assert(count >= 0, "unmatched call to MonitorWrapper.Exit");
        Monitor.Exit(_syncRoot); 
    }

    public boolean Busy
    { 
        get
        { 
            return (_enterCount > 0); 
        }
    } 

    int _enterCount;
    Object _syncRoot = new Object();

    private class MonitorHelper implements IDisposable
    { 
        public MonitorHelper(MonitorWrapper monitorWrapper) 
        {
            _monitorWrapper = monitorWrapper; 
        }

        public void Dispose()
        { 
            if (_monitorWrapper != null)
            { 
                _monitorWrapper.Exit(); 
                _monitorWrapper = null;
            } 
            GC.SuppressFinalize(this);
        }
        private MonitorWrapper _monitorWrapper;
    } 
}