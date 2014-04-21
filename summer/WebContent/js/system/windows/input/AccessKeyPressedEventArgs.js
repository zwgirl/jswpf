   /// <summary> 
    /// The inputs to an AccessKeyPressedEventHandler
    /// </summary> 
    public class AccessKeyPressedEventArgs : RoutedEventArgs 
    {
        #region Constructors 

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
        public AccessKeyPressedEventArgs(string key) : this() 
        { 
            _key = key;
        } 

        #endregion

        #region Public Properties 

        /// <summary> 
        /// The scope for the element that raised this event. 
        /// </summary>
        public object Scope 
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
        public string Key
        {
            get { return _key; } 
        }
 
        #endregion 

        #region Protected Methods 

        /// <summary>
        /// </summary>
        /// <param name="genericHandler">The handler to invoke.</param> 
        /// <param name="genericTarget">The current object along the event's route.</param>
        protected override void InvokeEventHandler(Delegate genericHandler, object genericTarget) 
        { 
            AccessKeyPressedEventHandler handler = (AccessKeyPressedEventHandler)genericHandler;
 
            handler(genericTarget, this);
        }

        #endregion 

        #region Data 
 
        private object _scope;
        private UIElement _target; 
        private string _key;

        #endregion
    } 