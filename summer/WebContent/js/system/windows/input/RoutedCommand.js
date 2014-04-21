/**
 * RoutedCommand
 */

define(["dojo/_base/declare", "system/Type", "input/InputGestureCollection", "input/Keyboard",
        "input/CanExecuteRoutedEventArgs", "input/ICommand"], 
		function(declare, Type, InputGestureCollection, Keyboard,
				CanExecuteRoutedEventArgs, ICommand){
	
	var CommandManager = null;
	function EnsureCommandManager(){
		if(CommandManager == null){
			CommandManager = using("input/CommandManager");
		}
		
		return CommandManager;
	}
	
	var RoutedCommand = declare("RoutedCommand", ICommand,{
		constructor:function(/*string*/ name, /*Type*/ ownerType, 
				/*byte commandId or InputGestureCollection inputGestures*/ third){
			if(name === undefined){
				name = String.Empty;
			}
			
			if(ownerType === undefined){
				ownerType = null;
			}
			
			if(third === undefined){
				third = null;
			}
			
			if(typeof(thrid) === "number"){
		        this._commandId = third;
			}else if(third instanceof InputGestureCollection){
				this._inputGestureCollection = third;
			}
			
	        this._name = name;
	        this._ownerType = ownerType;
		},

	
	    /// <summary> 
	    ///     Executes the command with the given parameter on the given target.
	    /// </summary>
	    /// <param name="parameter">Parameter to be passed to any command handlers.</param>
	    /// <param name="target">Element at which to begin looking for command handlers.</param> 
	    /// <SecurityNote>
	    /// Critical - calls critical function (ExecuteImpl) 
	    /// PublicOk - always passes in false for userInitiated, which is safe 
	    /// </SecurityNote>
//	    public void 
	    Execute:function(/*object*/ parameter, /*IInputElement*/ target)
	    {
	    	if(target === undefined){
	    		target = Keyboard.FocusedElement;

	    	}
	        // We only support UIElement, ContentElement and UIElement3D
	        if ((target != null) && !InputElement.IsValid(target)) 
	        {
	            throw new Error('InvalidOperationException(SR.Get(SRID.Invalid_IInputElement, target.GetType())'); 
	        } 
	
	        if (target == null) 
	        {
	            target = FilterInputElement(Keyboard.FocusedElement);
	        }
	
	        this.ExecuteImpl(parameter, target, false);
	    }, 
	
	    /// <summary>
	    ///     Whether the command can be executed with the given parameter on the given target. 
	    /// </summary>
	    /// <param name="parameter">Parameter to be passed to any command handlers.</param>
	    /// <param name="target">The target element on which to begin looking for command handlers.</param>
	    /// <returns>true if the command can be executed, false otherwise.</returns> 
	    /// <SecurityNote>
	    ///    Critical: This can be used to spoof input and cause userinitiated permission to be asserted 
	    ///    PublicOK: The call sets trusted bit to false which prevents user initiated permission from being asserted 
	    /// </SecurityNote>
//	    public bool 
	    CanExecute:function(/*object*/ parameter, /*IInputElement*/ target)
	    {
	        return this.CriticalCanExecute(parameter, target, false, {"continueRouting": false}/*out unused*/); 
	    },
	    
		
	    /// <summary>
	    ///     Whether the command can be executed with the given parameter on the currently focused element. 
	    /// </summary>
	    /// <param name="parameter">Parameter to pass to any command handlers.</param> 
	    /// <returns>true if the command can be executed, false otherwise.</returns> 
	    /// <SecurityNote>
	    ///     Critical: This code takes in a trusted bit which can be used to cause elevations for paste 
	    ///     PublicOK: This code passes the flag in as false
	    /// </SecurityNote>
//	    bool ICommand.
	    CanExecute:function(/*object*/ parameter) 
	    {
	        return this.CanExecuteImpl(parameter, FilterInputElement(Keyboard.FocusedElement), false, {"continueRouting": false}/*out unused*/); 
	    },

	
	    /// <summary> 
	    ///     Whether the command can be executed with the given parameter on the given target.
	    /// </summary> 
	    /// <param name="parameter">Parameter to be passed to any command handlers.</param>
	    /// <param name="target">The target element on which to begin looking for command handlers.</param>
	    /// <param name="trusted">Determines whether this call will elevate for userinitiated input or not.</param>
	    /// <param name="continueRouting">Determines whether the input event (if any) that caused this command should continue its route.</param> 
	    /// <returns>true if the command can be executed, false otherwise.</returns>
	    /// <SecurityNote> 
	    ///     Critical: This code takes in a trusted bit which can be used to cause elevations for paste 
	    /// </SecurityNote>
//	    internal bool 
	    CriticalCanExecute:function(/*object*/ parameter, /*IInputElement*/ target, /*bool*/ trusted, continueRoutingOut/*out bool continueRouting*/)
	    {
	        // We only support UIElement, ContentElement, and UIElement3D
	        if ((target != null) && !InputElement.IsValid(target)) 
	        {
	            throw new Error('InvalidOperationException(SR.Get(SRID.Invalid_IInputElement, target.GetType())'); 
	        } 
	
	        if (target == null) 
	        {
	            target = this.FilterInputElement(Keyboard.FocusedElement);
	        }
	
	        return this.CanExecuteImpl(parameter, target, trusted, continueRoutingOut/*out continueRouting*/);
	    },
	
	
	
	    /// <summary>
	    ///    Fetches the default input gestures for the command by invoking the LoadDefaultGestureFromResource function on the owning type. 
	    /// </summary> 
	    /// <returns>collection of input gestures for the command</returns>
//	    private InputGestureCollection 
	    GetInputGestures:function() 
	    {
//	        if(OwnerType == typeof(ApplicationCommands))
//	        {
//	            return ApplicationCommands.LoadDefaultGestureFromResource(_commandId); 
//	        }
//	        else if(OwnerType == typeof(NavigationCommands)) 
//	        { 
//	            return NavigationCommands.LoadDefaultGestureFromResource(_commandId);
//	        } 
//	        else if(OwnerType == typeof(MediaCommands))
//	        {
//	            return MediaCommands.LoadDefaultGestureFromResource(_commandId);
//	        } 
//	        else if(OwnerType == typeof(ComponentCommands))
//	        { 
//	            return ComponentCommands.LoadDefaultGestureFromResource(_commandId); 
//	        }
	        return new InputGestureCollection(); 
	    },

	    /// <param name="parameter"></param>
	    /// <param name="target"></param> 
	    /// <param name="trusted"></param>
	    /// <param name="continueRouting"></param> 
	    /// <returns></returns> 
	    /// <SecurityNote>
	    ///     Critical: This code takes in a trusted bit which can be used to cause elevations for paste 
	    /// </SecurityNote>
//	    private bool 
	    CanExecuteImpl:function(/*object*/ parameter, /*IInputElement*/ target, /*bool*/ trusted, continueRoutingOut/*out bool continueRouting*/)
	    { 
	        // If blocked by rights-management fall through and return false
	        if ((target != null)/* && !IsBlockedByRM*/) 
	        { 
	            // Raise the Preview Event, check the Handled value, and raise the regular event.
	            /*CanExecuteRoutedEventArgs*/
	        	var args = new CanExecuteRoutedEventArgs(this, parameter); 
	            args.RoutedEvent = EnsureCommandManager().PreviewCanExecuteEvent;
	            this.CriticalCanExecuteWrapper(parameter, target, trusted, args);
	            if (!args.Handled)
	            { 
	                args.RoutedEvent = EnsureCommandManager().CanExecuteEvent;
	                this.CriticalCanExecuteWrapper(parameter, target, trusted, args); 
	            } 
	
	            continueRoutingOut.continueRouting = args.ContinueRouting; 
	            return args.CanExecute;
	        }
	        else
	        { 
	        	continueRoutingOut.continueRouting = false;
	            return false; 
	        } 
	    },
	
	    /// <SecurityNote>
	    ///     Critical: This code takes in a trusted bit which can be used to cause elevations for paste
	    /// </SecurityNote>
//	    private void 
	    CriticalCanExecuteWrapper:function(/*object*/ parameter, /*IInputElement*/ target, /*bool*/ trusted, /*CanExecuteRoutedEventArgs*/ args)
	    { 
	    	target.RaiseEvent(args, trusted);
	    },
	    /// <SecurityNote> 
	    /// Critical - Calls ExecuteImpl, which sets the user initiated bit on a command, which is used 
	    ///            for security purposes later. It is important to validate
	    ///            the callers of this, and the implementation to make sure 
	    ///            that we only call MarkAsUserInitiated in the correct cases.
	    /// </SecurityNote>
	//    internal bool 
	    ExecuteCore:function(/*object*/ parameter, /*IInputElement*/ target, /*bool*/ userInitiated) 
	    {
	        if (target == null) 
	        { 
	            target = FilterInputElement(Keyboard.FocusedElement);
	        } 
	
	        return this.ExecuteImpl(parameter, target, userInitiated);
	    },
	
	    /// <SecurityNote>
	    /// Critical - sets the user initiated bit on a command, which is used 
	    ///            for security purposes later. It is important to validate 
	    ///            the callers of this, and the implementation to make sure
	    ///            that we only call MarkAsUserInitiated in the correct cases. 
	    /// </SecurityNote>
	//    private bool 
	    ExecuteImpl:function(/*object*/ parameter, /*IInputElement*/ target, /*bool*/ userInitiated)
	    { 
	        // If blocked by rights-management fall through and return false
	        if ((target != null)/* && !IsBlockedByRM*/) 
	        { 
	            // Raise the Preview Event and check for Handled value, and
	            // Raise the regular ExecuteEvent. 
	            /*ExecutedRoutedEventArgs*/var args = new ExecutedRoutedEventArgs(this, parameter);
	            args.RoutedEvent = EnsureCommandManager().PreviewExecutedEvent; 
	
	        	target.RaiseEvent(args, userInitiated);
	
	            targetUIElement.RaiseEvent(args, userInitiated); 
	            
	            return args.Handled;
	        }
	
	        return false; 
	    },
	
	    /// <SecurityNote>
	    /// Critical - Accesses _flags. Setting IsBlockedByRM is a critical operation. Setting other flags should be fine.
	    /// </SecurityNote> 
	//    private void 
	    WritePrivateFlag:function(/*PrivateFlags*/ bit, /*bool*/ value) 
	    { 
	        if (value)
	        { 
	            this._flags.Value |= bit;
	        }
	        else
	        { 
	        	this._flags.Value &= ~bit;
	        } 
	    }, 
	
	//    private bool 
	    ReadPrivateFlag:function(/*PrivateFlags*/ bit) 
	    {
	        return (this._flags.Value & bit) != 0;
	    }
	});
	
	Object.defineProperties(RoutedCommand.prototype,{
	       /// <summary> 
        /// Name - Declared time Name of the property/field where it is
        ///              defined, for serialization/debug purposes only. 
        ///     Ex: public static RoutedCommand New  { get { new RoutedCommand("New", .... ) } } 
        ///          public static RoutedCommand New = new RoutedCommand("New", ... ) ;
        /// </summary> 
//        public string 
        Name:
        {
            get:function()
            { 
                return _name;
            } 
        },

        /// <summary> 
        ///     Owning type of the property
        /// </summary>
//        public Type 
        OwnerType:
        { 
            get:function()
            { 
                return this._ownerType; 
            }
        }, 

        /// <summary>
        ///     Identifier assigned by the owning Type. Note that this is not a global command identifier.
        /// </summary> 
//        internal byte 
        CommandId:
        { 
            get:function() 
            {
                return this._commandId; 
            }
        },

        /// <summary> 
        ///     Input Gestures associated with RoutedCommand
        /// </summary> 
//        public InputGestureCollection 
        InputGestures: 
        {
            get:function() 
            {
                if(InputGesturesInternal == null)
                {
                    this._inputGestureCollection = new InputGestureCollection(); 
                }
                return this._inputGestureCollection; 
            } 
        },
 
//        internal InputGestureCollection 
        InputGesturesInternal:
        {
            get:function()
            { 
                if(this._inputGestureCollection == null)
                { 
                	this._inputGestureCollection = GetInputGestures(); 
                    AreInputGesturesDelayLoaded = false;
                } 
                return this._inputGestureCollection;
            }
        },
        
//        /// <summary>
//        /// Rights Management Enabledness 
//        ///     Will be set by Rights Management code.
//        /// 
////        internal bool 
//        IsBlockedByRM: 
//        {
//            get:function()
//            {
//                return ReadPrivateFlag(PrivateFlags.IsBlockedByRM);
//            },
//
//            set:function(value)
//            { 
//                WritePrivateFlag(PrivateFlags.IsBlockedByRM, value);
//            }
//        },
// 
//        /// <SecurityNote>
//        ///     Critical: Calls WritePrivateFlag 
//        ///     TreatAsSafe: Setting IsBlockedByRM is a critical operation. Setting AreInputGesturesDelayLoaded isn't. 
//        /// </SecurityNote>
////        internal bool 
//        AreInputGesturesDelayLoaded: 
//        {
//            get:function()
//            {
//                return ReadPrivateFlag(PrivateFlags.AreInputGesturesDelayLoaded); 
//            },
// 
// 
//            set:function(value) 
//            {
//                WritePrivateFlag(PrivateFlags.AreInputGesturesDelayLoaded, value);
//            }
//        },
        
        /// <summary>
        ///     Raised when CanExecute should be requeried on commands.
        ///     Since commands are often global, it will only hold onto the handler as a weak reference.
        ///     Users of this event should keep a strong reference to their event handler to avoid 
        ///     it being garbage collected. This can be accomplished by having a private field
        ///     and assigning the handler as the value before or after attaching to this event. 
        /// </summary> 
//        public event EventHandler 
        CanExecuteChanged:
        { 
        	get:function(){
            	if(this._CanExecuteChanged === undefined){
            		this._CanExecuteChanged = new EventHandler();
            	}
            	
            	return this._CanExecuteChanged;
        	}
//            add { CommandManager.RequerySuggested += value; }
//            remove { CommandManager.RequerySuggested -= value; }
        }
	});
	
//    private static IInputElement 
    function FilterInputElement(/*IInputElement*/ elem)
    {
        // We only support UIElement, ContentElement, and UIElement3D
        if ((elem != null) && InputElement.IsValid(elem)) 
        {
            return elem; 
        } 

        return null; 
    }

	
    RoutedCommand.Type = new Type("RoutedCommand", RoutedCommand, [ICommand.Type]);
	return RoutedCommand;
});


