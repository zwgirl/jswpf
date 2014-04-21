package org.summer.view.widget.model;

import org.summer.view.widget.WeakEventManager;

public class ErrorsChangedEventManager extends WeakEventManager
{
//    #region Constructors 

    // 
    //  Constructors 
    //

    private ErrorsChangedEventManager()
    {
    }

//    #endregion Constructors

//    #region Public Methods 

    // 
    //  Public Methods
    //

    /// <summary> 
    /// Add a handler for the given source's event.
    /// </summary> 
    public static void AddHandler(INotifyDataErrorInfo source, EventHandler<DataErrorsChangedEventArgs> handler) 
    {
        if (source == null) 
            throw new ArgumentNullException("source");
        if (handler == null)
            throw new ArgumentNullException("handler");

        CurrentManager.ProtectedAddHandler(source, handler);
    } 

    /// <summary>
    /// Remove a handler for the given source's event. 
    /// </summary>
    public static void RemoveHandler(INotifyDataErrorInfo source, EventHandler<DataErrorsChangedEventArgs> handler)
    {
        if (source == null) 
            throw new ArgumentNullException("source");
        if (handler == null) 
            throw new ArgumentNullException("handler"); 

        CurrentManager.ProtectedRemoveHandler(source, handler); 
    }

//    #endregion Public Methods

//    #region Protected Methods

    // 
    //  Protected Methods
    // 

    /// <summary>
    /// Return a new list to hold listeners to the event.
    /// </summary> 
    protected override ListenerList NewListenerList()
    { 
        return new ListenerList<DataErrorsChangedEventArgs>(); 
    }

    /// <summary>
    /// Listen to the given source for the event.
    /// </summary>
    protected override void StartListening(Object source) 
    {
        INotifyDataErrorInfo typedSource = (INotifyDataErrorInfo)source; 
        typedSource.ErrorsChanged += new EventHandler<DataErrorsChangedEventArgs>(OnErrorsChanged); 
    }

    /// <summary>
    /// Stop listening to the given source for the event.
    /// </summary>
    protected override void StopListening(Object source) 
    {
        INotifyDataErrorInfo typedSource = (INotifyDataErrorInfo)source; 
        typedSource.ErrorsChanged -= new EventHandler<DataErrorsChangedEventArgs>(OnErrorsChanged); 
    }

//    #endregion Protected Methods

//    #region Private Properties

    //
    //  Private Properties 
    // 

    // get the event manager for the current thread 
    private static ErrorsChangedEventManager CurrentManager
    {
        get
        { 
            Type managerType = typeof(ErrorsChangedEventManager);
            ErrorsChangedEventManager manager = (ErrorsChangedEventManager)GetCurrentManager(managerType); 

            // at first use, create and register a new manager
            if (manager == null) 
            {
                manager = new ErrorsChangedEventManager();
                SetCurrentManager(managerType, manager);
            } 

            return manager; 
        } 
    }

//    #endregion Private Properties

//    #region Private Methods

    //
    //  Private Methods 
    // 

    // event handler for ErrorsChanged event 
    private void OnErrorsChanged(Object sender, DataErrorsChangedEventArgs args)
    {
        DeliverEvent(sender, args);
    } 

//    #endregion Private Methods 
} 