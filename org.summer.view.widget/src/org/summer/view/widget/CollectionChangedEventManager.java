package org.summer.view.widget;

import org.summer.view.widget.collection.NotifyCollectionChangedEventArgs;
 /// <summary>
    /// Manager for the INotifyCollectionChanged.CollectionChanged event.
    /// </summary>
    public class CollectionChangedEventManager extends WeakEventManager
    {
//        #region Constructors
    	//
        //  Constructors
        //
 
        private CollectionChangedEventManager()
        {
        }
 
//        #endregion Constructors
// 
//        #region Public Methods
  
        //
        //  Public Methods
        //
 
        /// <summary>
        /// Add a listener to the given source's event.
        /// </summary>
        public static void AddListener(INotifyCollectionChanged source, IWeakEventListener listener)
        {
            CurrentManager.ProtectedAddListener(source, listener);
        }
 
        /// <summary>
        /// Remove a listener to the given source's event.
        /// </summary>
        public static void RemoveListener(INotifyCollectionChanged source, IWeakEventListener listener)
        {
            CurrentManager.ProtectedRemoveListener(source, listener);
        }
  
//        #endregion Public Methods
// 
//        #region Protected Methods
  
        //
        //  Protected Methods
        //
 
        /// <summary>
        /// Listen to the given source for the event.
        /// </summary>
        protected void StartListening(Object source)
        {
            INotifyCollectionChanged typedSource = (INotifyCollectionChanged)source;
            typedSource.CollectionChanged += new NotifyCollectionChangedEventHandler(OnCollectionChanged);
        }
 
        /// <summary>
        /// Stop listening to the given source for the event.
        /// </summary>
        protected void StopListening(Object source)
        {
            INotifyCollectionChanged typedSource = (INotifyCollectionChanged)source;
            typedSource.CollectionChanged -= new NotifyCollectionChangedEventHandler(OnCollectionChanged);
        }
 
//        #endregion Protected Methods
// 
//        #region Private Properties
 
        //
        //  Private Properties
        //
  
        // get the event manager for the current thread
        private static CollectionChangedEventManager CurrentManager
        {
            get
            {
                Type managerType = typeof(CollectionChangedEventManager);
                CollectionChangedEventManager manager = (CollectionChangedEventManager)GetCurrentManager(managerType);
  
                // at first use, create and register a new manager
                if (manager == null)
                {
                    manager = new CollectionChangedEventManager();
                    SetCurrentManager(managerType, manager);
                }
  
                return manager;
            }
        }
 
//        #endregion Private Properties
// 
//        #region Private Methods
 
        //
        //  Private Methods
        //
  
        // event handler for CollectionChanged event
        private void OnCollectionChanged(Object sender, NotifyCollectionChangedEventArgs args)
        {
            DeliverEvent(sender, args);
        }
  
//        #endregion Private Methods
    }