package org.summer.view.widget.input;

import org.summer.view.widget.Delegate;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.UIElement;

/// <summary> 
    /// The inputs to an AccessKeyPressedEventHandler
    /// </summary> 
    public class AccessKeyPressedEventArgs extends RoutedEventArgs 
    {
//        #region Constructors 

        /// <summary>
        /// The constructor for AccessKeyPressed event args
        /// </summary> 
        public AccessKeyPressedEventArgs()
        { 
            RoutedEvent = AccessKeyManager.AccessKeyPressedEvent; 
            _key = null;
        } 

        /// <summary>
        /// Constructor for AccessKeyPressed event args
        /// </summary> 
        /// <param name="key"></param>
        public AccessKeyPressedEventArgs(String key) 
        { 
        	 this() ;
            _key = key;
        } 

//        #endregion

//        #region Public Properties 

        /// <summary> 
        /// The scope for the element that raised this event. 
        /// </summary>
        public Object Scope 
        {
            get { return _scope; }
            set { _scope = value; }
        } 

        /// <summary> 
        /// Target element for the element that raised this event. 
        /// </summary>
        /// <value></value> 
        public UIElement Target
        {
            get { return _target; }
            set { _target = value; } 
        }
 
        /// <summary> 
        /// Key that was pressed
        /// </summary> 
        /// <value></value>
        public String Key
        {
            get { return _key; } 
        }
 
//        #endregion 

//        #region Protected Methods 

        /// <summary>
        /// </summary>
        /// <param name="genericHandler">The handler to invoke.</param> 
        /// <param name="genericTarget">The current Object along the event's route.</param>
        protected /*override*/ void InvokeEventHandler(Delegate genericHandler, Object genericTarget) 
        { 
            AccessKeyPressedEventHandler handler = (AccessKeyPressedEventHandler)genericHandler;
 
            handler(genericTarget, this);
        }

//        #endregion 

//        #region Data 
 
        private Object _scope;
        private UIElement _target; 
        private String _key;

//        #endregion
    }