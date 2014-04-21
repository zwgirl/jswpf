package org.summer.view.widget.data;
/// <summary> A request to the async data system. </summary> 
/*internal*/ public class AsyncDataRequest
{ 
    //-----------------------------------------------------
    //
    //  Constructors
    // 
    //-----------------------------------------------------

    /// <summary> Constructor </summary> 
    /*internal*/ public AsyncDataRequest(  Object bindingState,
                                AsyncRequestCallback workCallback, 
                                AsyncRequestCallback completedCallback,
                                /*params*/ Object[] args
                                )
    { 
        _bindingState = bindingState;
        _workCallback = workCallback; 
        _completedCallback = completedCallback; 
        _args = args;
    } 

    //------------------------------------------------------
    //
    //  Public Properties 
    //
    //----------------------------------------------------- 

    /* unused by default scheduler.  Restore for custom schedulers.
    /// <summary> The "user data" from the binding that issued the request. </summary> 
    public Object BindingState { get { return _bindingState; } }
    */

    /// <summary> The result of the request (valid when request is completed). </summary> 
    public Object Result { get { return _result; } }

    /// <summary> The status of the request. </summary> 
    public AsyncRequestStatus Status { get { return _status; } }

    /// <summary> The exception (for a failed request). </summary>
    public Exception Exception { get { return _exception; } }


    //------------------------------------------------------
    // 
    //  Public Methods 
    //
    //------------------------------------------------------ 

    /// <summary> Run the request's work delegate and return the result. </summary>
    /// <remarks>
    /// This method should be called synchronously on a worker thread, as it 
    /// calls the work delegate, which potentially takes a long time.  The
    /// method sets the status to "Working".  It is normally followed by a 
    /// call to Complete. 
    ///
    /// If the request has already been run or has been abandoned, this method 
    /// returns null.
    /// </remarks>
    public Object DoWork()
    { 
        if (DoBeginWork() && _workCallback != null)
            return _workCallback(this); 
        else 
            return null;
    } 


    /// <summary>If the request is in the "Waiting" state, return true and
    /// set its status to "Working".  Otherwise return false. 
    /// </summary>
    /// <remarks> 
    /// This method is thread-safe and works atomically.  Therefore only 
    /// one thread will be permitted to run the request.
    /// </remarks> 
    public boolean DoBeginWork()
    {
        return ChangeStatus(AsyncRequestStatus.Working);
    } 


    /// <summary> Set the request's status to "Completed", save the result, 
    /// and call the completed delegate. </summary>
    /// <remarks> 
    /// This method should be called on any thread, after
    /// either calling DoWork or performing the work for a request in some
    /// other way.
    /// 
    /// If the request has already been run or has been abandoned, this method
    /// does nothing. 
    /// </remarks> 
    public void Complete(Object result)
    { 
        if (ChangeStatus(AsyncRequestStatus.Completed))
        {
            _result = result;
            if (_completedCallback != null) 
                _completedCallback(this);
        } 
    } 


    /// <summary> Cancel the request.</summary>
    /// <remarks> This method can be called from any thread.
    /// <p>Calling Cancel does not actually terminate the work being
    /// done on behalf of the request, but merely causes the result 
    /// of that work to be ignored.</p>
    /// </remarks> 
    public void Cancel() 
    {
        ChangeStatus(AsyncRequestStatus.Cancelled); 
    }


    /// <summary> Fail the request because of an exception.</summary> 
    /// <remarks> This method can be called from any thread. </remarks>
    public void Fail(Exception exception) 
    { 
        if (ChangeStatus(AsyncRequestStatus.Failed))
        { 
            _exception = exception;
            if (_completedCallback != null)
                _completedCallback(this);
        } 
    }


    //-----------------------------------------------------
    // 
    //  /*internal*/ public properties
    //
    //------------------------------------------------------

    /// <summary> The caller-defined arguments. </summary>
    /*internal*/ public Object[] Args { get { return _args; } } 

    //-----------------------------------------------------
    // 
    //  Private methods
    //
    //-----------------------------------------------------

    // Change the status to the new status.  Return true if this is allowed.
    // Do it all atomically. 
    boolean ChangeStatus(AsyncRequestStatus newStatus) 
    {
        boolean allowChange = false; 

        /*lock*/synchronized(SyncRoot)
        {
            switch (newStatus) 
            {
                case AsyncRequestStatus.Working: 
                    allowChange = (_status == AsyncRequestStatus.Waiting); 
                    break;
                case AsyncRequestStatus.Completed: 
                    allowChange = (_status == AsyncRequestStatus.Working);
                    break;
                case AsyncRequestStatus.Cancelled:
                    allowChange = (_status == AsyncRequestStatus.Waiting) || 
                                    (_status == AsyncRequestStatus.Working);
                    break; 
                case AsyncRequestStatus.Failed: 
                    allowChange = (_status == AsyncRequestStatus.Working);
                    break; 
            }

            if (allowChange)
                _status = newStatus;; 
        }

        return allowChange; 
    }

    //-----------------------------------------------------
    //
    //  Private data
    // 
    //------------------------------------------------------

    AsyncRequestStatus _status; 
    Object _result;
    Object _bindingState; 
    Object[] _args;
    Exception _exception;

    AsyncRequestCallback _workCallback; 
    AsyncRequestCallback _completedCallback;

    Object SyncRoot = new Object();     // for synchronization 
}


