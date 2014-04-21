package org.summer.view.widget.data;

import java.beans.EventHandler;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.FrameworkContentElement;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.IWeakEventListener;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.Type;
import org.summer.view.widget.WeakEventManager;
import org.summer.view.widget.internal.Helper;

/// <summary>
    /// Manager for the DependencyObject.LostFocus event. 
    /// </summary>
    public class LostFocusEventManager extends WeakEventManager
    {
//        #region Constructors 

        // 
        //  Constructors 
        //
 
        private LostFocusEventManager()
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
        public static void AddListener(DependencyObject source, IWeakEventListener listener) 
        {
            if (source == null) 
                throw new ArgumentNullException("source");
            if (listener == null)
                throw new ArgumentNullException("listener");
 
            CurrentManager.ProtectedAddListener(source, listener);
        } 
 
        /// <summary>
        /// Remove a listener to the given source's event. 
        /// </summary>
        public static void RemoveListener(DependencyObject source, IWeakEventListener listener)
        {
            if (source == null) 
                throw new ArgumentNullException("source");
            if (listener == null) 
                throw new ArgumentNullException("listener"); 

            CurrentManager.ProtectedRemoveListener(source, listener); 
        }

        /// <summary>
        /// Add a handler for the given source's event. 
        /// </summary>
        public static void AddHandler(DependencyObject source, EventHandler<RoutedEventArgs> handler) 
        { 
            if (handler == null)
                throw new ArgumentNullException("handler"); 

            CurrentManager.ProtectedAddHandler(source, handler);
        }
 
        /// <summary>
        /// Remove a handler for the given source's event. 
        /// </summary> 
        public static void RemoveHandler(DependencyObject source, EventHandler<RoutedEventArgs> handler)
        { 
            if (handler == null)
                throw new ArgumentNullException("handler");

            CurrentManager.ProtectedRemoveHandler(source, handler); 
        }
 
//        #endregion Public Methods 
//
//        #region Protected Methods 

        //
        //  Protected Methods
        // 

        /// <summary> 
        /// Return a new list to hold listeners to the event. 
        /// </summary>
        protected ListenerList NewListenerList() 
        {
            return new ListenerList<RoutedEventArgs>();
        }
 
        /// <summary>
        /// Listen to the given source for the event. 
        /// </summary> 
        protected void StartListening(Object source)
        { 
            DependencyObject typedSource = (DependencyObject)source;
            FrameworkElement fe;
            FrameworkContentElement fce;
            Helper.DowncastToFEorFCE(typedSource, /*out*/ fe, /*out*/ fce, true); 

            if (fe != null) 
                fe.LostFocus += new RoutedEventHandler(OnLostFocus); 
            else if (fce != null)
                fce.LostFocus += new RoutedEventHandler(OnLostFocus); 
        }

        /// <summary>
        /// Stop listening to the given source for the event. 
        /// </summary>
        protected void StopListening(Object source) 
        { 
            DependencyObject typedSource = (DependencyObject)source;
            FrameworkElement fe; 
            FrameworkContentElement fce;
            Helper.DowncastToFEorFCE(typedSource, /*out*/ fe, /*out*/ fce, true);

            if (fe != null) 
                fe.LostFocus -= new RoutedEventHandler(OnLostFocus);
            else if (fce != null) 
                fce.LostFocus -= new RoutedEventHandler(OnLostFocus); 
        }
 
//        #endregion Protected Methods
//
//        #region Private Properties
 
        //
        //  Private Properties 
        // 

        // get the event manager for the current thread 
        private static LostFocusEventManager CurrentManager
        {
            get
            { 
                Type managerType = typeof(LostFocusEventManager);
                LostFocusEventManager manager = (LostFocusEventManager)GetCurrentManager(managerType); 
 
                // at first use, create and register a new manager
                if (manager == null) 
                {
                    manager = new LostFocusEventManager();
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

        // event handler for LostFocus event 
        private void OnLostFocus(Object sender, RoutedEventArgs args)
        {
            DeliverEvent(sender, args);
        } 

//        #endregion Private Methods 
    } 