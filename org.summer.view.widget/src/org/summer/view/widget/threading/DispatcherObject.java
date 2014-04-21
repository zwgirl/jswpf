package org.summer.view.widget.threading;
/// <summary>
    ///     A DispatcherObject is an object associated with a
    ///     <see cref="Dispatcher">.  A DispatcherObject instance should
    ///     only be access by the dispatcher's thread.
    /// </see></summary>
    /// <remarks>
    ///     Subclasses of <see cref="DispatcherObject"> should enforce thread
    ///     safety by calling <see cref="VerifyAccess"> on all their public
    ///     methods to ensure the calling thread is the appropriate thread.
    ///     <para>
    ///     DispatcherObject cannot be independently instantiated; that is,
    ///     all constructors are protected.
    /// </para></see></see></remarks>
    public abstract class DispatcherObject
    {
        /// <summary>
        ///     Returns the <see cref="Dispatcher"> that this
        ///     <see cref="DispatcherObject"> is associated with.
        /// </see></see></summary>
//        [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Advanced)]
        public Dispatcher Dispatcher
        {
            get
            {
                // This property is free-threaded.
 
                return _dispatcher;
            }
        }
  
        // This method allows certain derived classes to break the dispatcher affinity
        // of our objects.
//        [FriendAccessAllowed] // Built into Base, also used by Framework.
        public void DetachFromDispatcher()
        {
            _dispatcher = null;
         }
 
        /// <summary>
        ///     Checks that the calling thread has access to this object.
        /// </summary>
        /// <remarks>
        ///     Only the dispatcher thread may access DispatcherObjects.
        ///     <p>
        ///     This method is public so that any thread can probe to
        ///     see if it has access to the DispatcherObject.
        ///
        /// <returns>
        ///     True if the calling thread has access to this object.
        /// </returns>
//        [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]
        public boolean CheckAccess()
        {
            // This method is free-threaded.
  
            boolean accessAllowed = true;
            Dispatcher dispatcher = _dispatcher;
 
            // Note: a DispatcherObject that is not associated with a
            // dispatcher is considered to be free-threaded.
            if(dispatcher != null)
            {
                accessAllowed = dispatcher.CheckAccess();
            }
 
            return accessAllowed;
        }
 
        /// </p><summary>
        ///     Verifies that the calling thread has access to this object.
        /// </summary>
        /// <remarks>
        ///     Only the dispatcher thread may access DispatcherObjects.
        ///     <p>
        ///     This method is public so that derived classes can probe to
        ///     see if the calling thread has access to itself.
        ///
//        [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]
        public void VerifyAccess()
        {
            // This method is free-threaded.
  
            Dispatcher dispatcher = _dispatcher;
  
            // Note: a DispatcherObject that is not associated with a
            // dispatcher is considered to be free-threaded.
            if(dispatcher != null)
            {
                dispatcher.VerifyAccess();
            }
        }
 
        /// </p><summary>
        ///     Instantiate this object associated with the current Dispatcher.
        /// </summary>
        protected DispatcherObject()
        {
            _dispatcher = Dispatcher.CurrentDispatcher;
        }
  
        private Dispatcher _dispatcher;
    }