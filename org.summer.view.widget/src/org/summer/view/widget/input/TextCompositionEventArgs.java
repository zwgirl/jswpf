package org.summer.view.widget.input;
 /// <summary> 
    ///     The TextCompositionEventArgs class contains a text representation of
    ///     input. 
    /// </summary>
    public class TextCompositionEventArgs extends InputEventArgs
    {
        /// <summary> 
        ///     Constructs an instance of the TextInputEventArgs class.
        /// </summary> 
        /// <param name="inputDevice"> 
        ///     The input device to associate with this event.
        /// </param> 
        /// <param name="composition">
        ///     The TextComposition Object that contains the composition text and the composition state.
        /// </param>
        public TextCompositionEventArgs(InputDevice inputDevice, TextComposition composition) 
        {
        	super(inputDevice, Environment.TickCount) ;
            if (composition == null) 
            { 
                throw new ArgumentNullException("composition");
            } 

            _composition = composition;
        }
 
        /// <summary>
        ///     The text composition that was provided. 
        /// </summary> 
        /// <ExternalAPI Inherit="true"/>
        public TextComposition TextComposition 
        {
            get {return _composition;}
        }
 
        /// <summary>
        ///     The result text that was provided as input. 
        /// </summary> 
        /// <ExternalAPI Inherit="true"/>
        public String Text 
        {
            get {return _composition.Text;}
        }
 
        /// <summary>
        ///     The result system text that was provided as input. 
        /// </summary> 
        /// <ExternalAPI Inherit="true"/>
        public String SystemText 
        {
            get {return _composition.SystemText;}
        }
 
        /// <summary>
        ///     The result control text that was provided as input. 
        /// </summary> 
        /// <ExternalAPI Inherit="true"/>
        public String ControlText 
        {
            get {return _composition.ControlText;}
        }
 
        /// <summary>
        ///     The mechanism used to call the type-specific handler on the 
        ///     target. 
        /// </summary>
        /// <param name="genericHandler"> 
        ///     The generic handler to call in a type-specific way.
        /// </param>
        /// <param name="genericTarget">
        ///     The target to call the handler on. 
        /// </param>
        /// <ExternalAPI/> 
        protected /*override*/ void InvokeEventHandler(Delegate genericHandler, Object genericTarget) 
        {
            TextCompositionEventHandler handler = (TextCompositionEventHandler) genericHandler; 

            handler(genericTarget, this);
        }
 
        // The target TextComposition Object of this event.
        private TextComposition _composition; 
    } 