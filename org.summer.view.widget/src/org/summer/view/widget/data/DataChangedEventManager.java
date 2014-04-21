package org.summer.view.widget.data;

import org.summer.view.widget.EventArgs;
import org.summer.view.widget.IWeakEventListener;
import org.summer.view.widget.WeakEventManager;

/// <summary>
    /// Manager for the DataSourceProvider.DataChanged event.
    /// </summary>
    public class DataChangedEventManager extends WeakEventManager
    {
//        #region Constructors
  
        //
        //  Constructors
        //
 
        private DataChangedEventManager()
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
        public static void AddListener(DataSourceProvider source, IWeakEventListener listener)
        {
            CurrentManager.ProtectedAddListener(source, listener);
        }
 
        /// <summary>
        /// Remove a listener to the given source's event.
        /// </summary>
        public static void RemoveListener(DataSourceProvider source, IWeakEventListener listener)
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
            DataSourceProvider typedSource = (DataSourceProvider)source;
            typedSource.DataChanged += new EventHandler(OnDataChanged);
        }
 
        /// <summary>
        /// Stop listening to the given source for the event.
        /// </summary>
        protected void StopListening(Object source)
        {
            DataSourceProvider typedSource = (DataSourceProvider)source;
            typedSource.DataChanged -= new EventHandler(OnDataChanged);
        }
 
//        #endregion Protected Methods
// 
//        #region Private Properties
 
        //
        //  Private Properties
        //
  
        // get the event manager for the current thread
        private static DataChangedEventManager CurrentManager
        {
            get
            {
                Type managerType = typeof(DataChangedEventManager);
                DataChangedEventManager manager = (DataChangedEventManager)GetCurrentManager(managerType);
  
                // at first use, create and register a new manager
                if (manager == null)
                {
                    manager = new DataChangedEventManager();
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
  
        // event handler for DataChanged event
        private void OnDataChanged(Object sender, EventArgs args)
        {
            DeliverEvent(sender, args);
        }
  
//        #endregion Private Methods
    }