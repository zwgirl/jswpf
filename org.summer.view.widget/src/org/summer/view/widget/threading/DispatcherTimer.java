package org.summer.view.widget.threading;

import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.utils.ArgumentOutOfRangeException;

/// <summary> 
///     A timer that is integrated into the Dispatcher queues, and will
///     be processed after a given amount of time at a specified priority.
/// </summary>
public class DispatcherTimer 
{
    /// <summary> 
    ///     Creates a timer that uses the current thread's Dispatcher to 
    ///     process the timer event at background priority.
    /// </summary> 
    public DispatcherTimer()   // NOTE: should be Priority Dispatcher.BackgroundPriority
    {
    	this(DispatcherPriority.Background);
    }

    /// <summary>
    ///     Creates a timer that uses the current thread's Dispatcher to 
    ///     process the timer event at the specified priority. 
    /// </summary>
    /// <param name="priority"> 
    ///     The priority to process the timer at.
    /// </param>
    public DispatcherTimer(DispatcherPriority priority) // NOTE: should be Priority
    { 
        Initialize(Dispatcher.CurrentDispatcher, priority, TimeSpan.FromMilliseconds(0));
    } 

    /// <summary>
    ///     Creates a timer that uses the specified Dispatcher to 
    ///     process the timer event at the specified priority.
    /// </summary>
    /// <param name="priority">
    ///     The priority to process the timer at. 
    /// </param>
    /// <param name="dispatcher"> 
    ///     The dispatcher to use to process the timer. 
    /// </param>
    public DispatcherTimer(DispatcherPriority priority, Dispatcher dispatcher)  // NOTE: should be Priority 
    {
        if(dispatcher == null)
        {
            throw new ArgumentNullException("dispatcher"); 
        }

        Initialize(dispatcher, priority, TimeSpan.FromMilliseconds(0)); 
    }

    /// <summary>
    ///     Creates a timer that is bound to the specified dispatcher and
    ///     will be processed at the specified priority, after the
    ///     specified timeout. 
    /// </summary>
    /// <param name="interval"> 
    ///     The interval to tick the timer after. 
    /// </param>
    /// <param name="priority"> 
    ///     The priority to process the timer at.
    /// </param>
    /// <param name="callback">
    ///     The callback to call when the timer ticks. 
    /// </param>
    /// <param name="dispatcher"> 
    ///     The dispatcher to use to process the timer. 
    /// </param>
    public DispatcherTimer(TimeSpan interval, DispatcherPriority priority, EventHandler callback, Dispatcher dispatcher) // NOTE: should be Priority 
    {
        //
    	if(callback == null) 
        {
            throw new ArgumentNullException("callback");
        }
        if(dispatcher == null) 
        {
            throw new ArgumentNullException("dispatcher"); 
        } 

        if (interval.TotalMilliseconds < 0) 
            throw new ArgumentOutOfRangeException("interval", SR.Get(SRID.TimeSpanPeriodOutOfRange_TooSmall));

        if (interval.TotalMilliseconds > Int32.MaxValue)
            throw new ArgumentOutOfRangeException("interval", SR.Get(SRID.TimeSpanPeriodOutOfRange_TooLarge)); 

        Initialize(dispatcher, priority, interval); 

        Tick += callback;
        Start(); 
    }

    /// <summary>
    ///     Gets the dispatcher this timer is associated with. 
    /// </summary>
    public Dispatcher Dispatcher 
    { 
        get
        { 
            return _dispatcher;
        }
    }

    /// <summary>
    ///     Gets or sets whether the timer is running. 
    /// </summary> 
    public boolean IsEnabled
    { 
        get
        {
            return _isEnabled;
        } 

        set 
        { 
            /*lock*/synchronized(_instanceLock)
            { 
                if(!value && _isEnabled)
                {
                    Stop();
                } 
                else if(value && !_isEnabled)
                { 
                    Start(); 
                }
            } 
        }
    }

    /// <summary> 
    ///     Gets or sets the time between timer ticks.
    /// </summary> 
    public TimeSpan Interval 
    {
        get 
        {
            return _interval;
        }

        set
        { 
            boolean updateWin32Timer = false; 

            if (value.TotalMilliseconds < 0) 
                throw new ArgumentOutOfRangeException("value", SR.Get(SRID.TimeSpanPeriodOutOfRange_TooSmall));

            if (value.TotalMilliseconds > Int32.MaxValue)
                throw new ArgumentOutOfRangeException("value", SR.Get(SRID.TimeSpanPeriodOutOfRange_TooLarge)); 

            /*lock*/synchronized(_instanceLock) 
            { 
                _interval = value;

                if(_isEnabled)
                {
                    _dueTimeInTicks = Environment.TickCount + (int)_interval.TotalMilliseconds;
                    updateWin32Timer = true; 
                }
            } 

            if(updateWin32Timer)
            { 
                _dispatcher.UpdateWin32Timer();
            }
        }
    } 

    /// <summary> 
    ///     Starts the timer. 
    /// </summary>
    public void Start() 
    {
    	 /*lock*/synchronized(_instanceLock)
        {
            if(!_isEnabled) 
            {
                _isEnabled = true; 

                Restart();
            } 
        }
    }

    /// <summary> 
    ///     Stops the timer.
    /// </summary> 
    public void Stop() 
    {
        boolean updateWin32Timer = false; 

        /*lock*/synchronized(_instanceLock)
        {
            if(_isEnabled) 
            {
                _isEnabled = false; 
                updateWin32Timer = true; 

                // If the operation is in the queue, abort it. 
                if(_operation != null)
                {
                    _operation.Abort();
                    _operation = null; 
                }

            } 
        }

        if(updateWin32Timer)
        {
            _dispatcher.RemoveTimer(this);
        } 
    }

    /// <summary> 
    ///     Occurs when the specified timer interval has elapsed and the
    ///     timer is enabled. 
    /// </summary>
    public /*event*/ EventHandler Tick;

    /// <summary> 
    ///     Any data that the caller wants to pass along with the timer.
    /// </summary> 
    public Object Tag 
    {
        get 
        {
            return _tag;
        }

        set
        { 
            _tag = value; 
        }
    } 


    private void Initialize(Dispatcher dispatcher, DispatcherPriority priority, TimeSpan interval)
    { 
        // Note: all callers of this have a "priority" parameter.
        Dispatcher.ValidatePriority(priority, "priority"); 
        if(priority == DispatcherPriority.Inactive) 
        {
            throw new ArgumentException(SR.Get(SRID.InvalidPriority), "priority"); 
        }

        _dispatcher = dispatcher;
        _priority = priority; 
        _interval = interval;
    } 

    private void Restart()
    { 
    	 /*lock*/synchronized(_instanceLock)
        {
            if (_operation != null)
            { 
                // Timer has already been restarted, e.g. Start was called form the Tick handler.
                return; 
            } 

            // BeginInvoke a new operation. 
            _operation = _dispatcher.BeginInvoke(
                DispatcherPriority.Inactive,
                new DispatcherOperationCallback(FireTick),
                null); 


            _dueTimeInTicks = Environment.TickCount + (int) _interval.TotalMilliseconds; 

            if (_interval.TotalMilliseconds == 0 && _dispatcher.CheckAccess()) 
            {
                // shortcut - just promote the item now
                Promote();
            } 
            else
            { 
                _dispatcher.AddTimer(this); 
            }
        } 

    }

    /*internal*/ public void Promote() // called from Dispatcher 
    {
    	 /*lock*/synchronized(_instanceLock) 
        { 
            // Simply promote the operation to it's desired priority.
            if(_operation != null) 
            {
                _operation.Priority = _priority;
            }
        } 
    }

    private Object FireTick(Object unused) 
    {
        // The operation has been invoked, so forget about it. 
        _operation = null;

        // The dispatcher thread is calling us because item's priority
        // was changed from inactive to something else. 
        if(Tick != null)
        { 
            Tick(this, EventArgs.Empty); 
        }

        // If we are still enabled, start the timer again.
        if(_isEnabled)
        {
            Restart(); 
        }

        return null; 
    }

    // This is the Object we use to synchronize access.
    private Object _instanceLock = new Object();

    // Note: We cannot BE a dispatcher-affinity Object because we can be 
    // created by a worker thread.  We are still associated with a
    // dispatcher (where we post the item) but we can be accessed 
    // by any thread. 
    private Dispatcher _dispatcher;

    private DispatcherPriority _priority;  // NOTE: should be Priority
    private TimeSpan _interval;
    private Object _tag;
    private DispatcherOperation _operation; 
    private boolean _isEnabled;

    /*internal*/ public int _dueTimeInTicks; // used by Dispatcher 
}