 /**
 * KeyEventArgs
 */

define(["dojo/_base/declare", "system/Type", "input/KeyboardEventArgs"], 
		function(declare, Type, KeyboardEventArgs){
	var KeyEventArgs = declare("KeyEventArgs", KeyboardEventArgs,{
  	 	"-chains-": {
  	 		constructor: "manual"
  	    },
		constructor:function(event){
			KeyboardEventArgs.prototype.constructor.call(this, event);
			

			this._realKey = event.which; 
			this._key = event.which; 
			this._isRepeat = event.repeat;
	            
//            if (!Keyboard.IsValidKey(this.Key))
//                throw new System.ComponentModel.InvalidEnumArgumentException("key", key, typeof(Key));
 
            // Start out assuming that this is just a normal key.
            this.MarkNormal();
		},
		
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
//        protected override void 
		InvokeEventHandler:function(/*Delegate*/ genericHandler, /*object*/ genericTarget)
        { 
            /*KeyEventHandler*/var handler = genericHandler; 

            handler.Invoke(genericTarget, this); 
        },

//        internal void 
        SetRepeat:function( /*bool*/ newRepeatState )
        { 
            this._isRepeat = newRepeatState;
        }, 
 
//        internal void
        MarkNormal:function()
        { 
        	this._key = this._realKey;
        },

//        internal void
        MarkSystem:function() 
        {
        	this._key = Key.System; 
        }, 

//        internal void 
        MarkImeProcessed:function() 
        {
        	this._key = Key.ImeProcessed;
        },
 
//        internal void 
        MarkDeadCharProcessed:function()
        { 
        	this._key = Key.DeadCharProcessed; 
        }
	});
	
	Object.defineProperties(KeyEventArgs.prototype,{
		 
        /// <summary>
        ///     The input source that provided this input. 
        /// </summary> 
        /// <remarks>
        ///     Callers must have UIPermission(PermissionState.Unrestricted) to call this API. 
        /// </remarks>
        ///<SecurityNote>
        ///     Critical - hands out _inputSource via UnsafeInputSource call.
        ///     PublicOK - there is a demand. 
        ///</SecurityNote>
//        public PresentationSource 
		InputSource: 
        { 
            get:function() 
            {
                SecurityHelper.DemandUnrestrictedUIPermission();

                return UnsafeInputSource; 
            }
        }, 
 
        /// <summary>
        ///     The Key referenced by the event, if the key is not being 
        ///     handled specially.
        /// </summary>
//        public Key 
        Key:
        { 
            get:function() {return this._key;}
        }, 
 
        /// <summary>
        ///     The original key, as opposed to <see cref="Key"/>, which might 
        ///     have been changed (e.g. by MarkTextInput).
        /// </summary>
        /// <remarks>
        /// Note:  This should remain internal.  When a processor obfuscates the key, 
        /// such as changing characters to Key.TextInput, we're deliberately trying to
        /// hide it and make it hard to find.  But internally we'd like an easy way to find 
        /// it.  So we have this internal, but it must remain internal. 
        /// </remarks>
//        internal Key 
        RealKey: 
        {
            get:function() { return this._realKey; }
        },
 
        /// <summary>
        ///     The Key referenced by the event, if the key is going to be 
        ///     processed by an IME. 
        /// </summary>
//        public Key 
        ImeProcessedKey: 
        {
            get:function() { return (this._key == Key.ImeProcessed) ? this._realKey : Key.None;}
        },
 
        /// <summary>
        ///     The Key referenced by the event, if the key is going to be 
        ///     processed by an system. 
        /// </summary>
//        public Key 
        SystemKey:
        {
            get:function() { return (this._key == Key.System) ? this._realKey : Key.None;}
        },
 
        /// <summary>
        ///     The Key referenced by the event, if the the key is going to 
        ///     be processed by Win32 Dead Char System. 
        /// </summary>
//        public Key 
        DeadCharProcessedKey: 
        {
            get:function() { return (this._key == Key.DeadCharProcessed) ? this._realKey : Key.None; }
        },
 
        /// <summary>
        ///     The state of the key referenced by the event. 
        /// </summary> 
//        public KeyStates 
        KeyStates:
        { 
            get:function() {return this.KeyboardDevice.GetKeyStates(this._realKey);}
        },

        /// <summary> 
        ///     Whether the key pressed is a repeated key or not.
        /// </summary> 
//        public bool 
        IsRepeat: 
        {
            get:function() {return this._isRepeat;} 
        },

        /// <summary>
        ///     Whether or not the key referenced by the event is down. 
        /// </summary>
        /// <ExternalAPI Inherit="true"/> 
//        public bool 
        IsDown: 
        {
            get:function() {return this.KeyboardDevice.IsKeyDown(this._realKey);} 
        },

        /// <summary>
        ///     Whether or not the key referenced by the event is up. 
        /// </summary>
        /// <ExternalAPI Inherit="true"/> 
//        public bool 
        IsUp: 
        {
            get:function() {return this.KeyboardDevice.IsKeyUp(this._realKey);} 
        },

        /// <summary>
        ///     Whether or not the key referenced by the event is toggled. 
        /// </summary>
        /// <ExternalAPI Inherit="true"/> 
//        public bool 
        IsToggled: 
        {
            get:function() {return this.KeyboardDevice.IsKeyToggled(this._realKey);} 
        },
        
        ///<SecurityNote> 
        /// Critical - hands out _inputSource.
        ///</SecurityNote>
//        internal PresentationSource 
        UnsafeInputSource:
        { 
            get:function() 
            { 
                return this._inputSource;
            } 
        },

//        internal int 
        ScanCode:
        { 
            get:function() {return this._scanCode;},
            set:function(value) {this._scanCode = value;} 
        }, 

//        internal bool 
        IsExtendedKey: 
        {
            get:function() {return this._isExtendedKey;},
            set:function(value) {this._isExtendedKey = value;}
        }, 

		  
	});
	
	Object.defineProperties(KeyEventArgs,{
		  
	});
	
	KeyEventArgs.Type = new Type("KeyEventArgs", KeyEventArgs, [KeyboardEventArgs.Type]);
	return KeyEventArgs;
});


  
 
 
//        private Key _realKey; 
//        private Key _key;
// 
//        ///<SecurityNote>
//        ///     Critical - PresentationSource required elevations to create it.
//        ///</SecurityNote>
//        private PresentationSource _inputSource;
// 
//        private bool _isRepeat; 
//        private int _scanCode;
//        private bool _isExtendedKey; 

