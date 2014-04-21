/**
 * Second check 12-12
 * CommandManager
 */

define(["dojo/_base/declare", "system/Type", "input/CommandBindingCollection", "windows/RoutingStrategy", 
        "input/ExecutedRoutedEventHandler", "input/InputBindingCollection", "input/CanExecuteRoutedEventHandler",
        "specialized/HybridDictionary", "windows/WeakEventManager", "windows/ListenerList"], 
		function(declare, Type, CommandBindingCollection, RoutingStrategy,
				ExecutedRoutedEventHandler, InputBindingCollection, CanExecuteRoutedEventHandler,
				HybridDictionary, WeakEventManager, ListenerList){
	
//	private class 
	var RequerySuggestedEventManager =declare(WeakEventManager, {
        /// <summary> 
        /// Return a new list to hold listeners to the event.
        /// </summary>
//        protected override ListenerList 
		NewListenerList:function()
        { 
            return new ListenerList();
        },

        /// <summary>
        /// Listen to the given source for the event. 
        /// </summary>
//        protected override void 
        StartListening:function(/*object*/ source)
        {
            var typedSource = CommandManager.Current; 
            typedSource.PrivateRequerySuggested.Combine(new EventHandler(this, this.OnRequerySuggested));
        }, 

        /// <summary>
        /// Stop listening to the given source for the event. 
        /// </summary>
//        protected override void 
        StopListening:function(/*object*/ source)
        {
            var typedSource = CommandManager.Current; 
            typedSource.PrivateRequerySuggested.Remove(new EventHandler(this, this.OnRequerySuggested));
        }, 

        // event handler for CurrentChanged event 
//        private void 
        OnRequerySuggested:function(/*object*/ sender, /*EventArgs*/ args)
        { 
            this.DeliverEvent(sender, args);
        }
	}); 
	
	Object.defineProperties(RequerySuggestedEventManager, {
	    // get the event manager for the current thread 
//	    private static RequerySuggestedEventManager 
		CurrentManager:
	    { 
	        get:function()
	        {
	            var managerType = RequerySuggestedEventManager.Type;
	            var manager = /*(RequerySuggestedEventManager)*/WeakEventManager.GetCurrentManager(managerType); 

	            // at first use, create and register a new manager 
	            if (manager == null) 
	            {
	                manager = new RequerySuggestedEventManager(); 
	                WeakEventManager.SetCurrentManager(managerType, manager);
	            }

	            return manager; 
	        }
	    }
	});
	
    /// <summary> 
    /// Add a handler for the given source's event. 
    /// </summary>
//    public static void 
	RequerySuggestedEventManager.AddHandler = function(/*CommandManager*/ source, /*EventHandler*/ handler) 
    {
        if (handler == null)
            return; // 4.0-compat;  should be:  throw new ArgumentNullException("handler");

        RequerySuggestedEventManager.CurrentManager.ProtectedAddHandler(source, handler);
    }; 

    /// <summary>
    /// Remove a handler for the given source's event. 
    /// </summary>
//    public static void 
	RequerySuggestedEventManager.RemoveHandler = function(/*CommandManager*/ source, /*EventHandler*/ handler)
    {
        if (handler == null) 
            return; // 4.0-compat;  should be:  throw new ArgumentNullException("handler");

        RequerySuggestedEventManager.CurrentManager.ProtectedRemoveHandler(source, handler); 
    };
	
	RequerySuggestedEventManager.Type = new Type("RequerySuggestedEventManager", RequerySuggestedEventManager,
			[WeakEventManager.Type]);


	
	var CommandManager = declare("CommandManager", Object,{
		constructor:function(){

		},
		

//        /// <summary> 
//        ///     Adds an idle priority dispatcher operation to raise RequerySuggested. 
//        /// </summary>
//        private void RaiseRequerySuggested() 
//        {
//            if (_requerySuggestedOperation == null)
//            {
//                Dispatcher dispatcher = Dispatcher.CurrentDispatcher; 
//                if ((dispatcher != null) && !dispatcher.HasShutdownStarted && !dispatcher.HasShutdownFinished)
//                { 
//                    _requerySuggestedOperation = dispatcher.BeginInvoke(DispatcherPriority.Background, new DispatcherOperationCallback(RaiseRequerySuggested), null); 
//                }
//            } 
//        }

//        private object 
		RaiseRequerySuggested:function(/*object*/ obj)
        { 
			if(obj === undefined){obj = null}
            // Call the RequerySuggested handlers
//            _requerySuggestedOperation = null; 
 
            if (PrivateRequerySuggested != null)
                PrivateRequerySuggested.Invoke(null, EventArgs.Empty); 

            return null;
        }
	});
	
	Object.defineProperties(CommandManager.prototype, {
//        private event EventHandler 
		PrivateRequerySuggested:
		{
			get:function(){
				if(this._PrivateRequerySuggested === undefined){
					this._PrivateRequerySuggested = new EventHandler();
				}
				
				return this._PrivateRequerySuggested;
			}
		}
	});
	
	  // This is a Hashtable of CommandBindingCollections keyed on OwnerType 
    // Each ItemList holds the registered Class level CommandBindings for that OwnerType 
//    private static HybridDictionary 
	var _classCommandBindings = new HybridDictionary();

    // This is a Hashtable of InputBindingCollections keyed on OwnerType
    // Each Item holds the registered Class level CommandBindings for that OwnerType
//    private static HybridDictionary 
	var _classInputBindings = new HybridDictionary();
    var _commandManager = null;
	
	Object.defineProperties(CommandManager,{
        /// <summary> 
        ///     Event before a command is executed
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewExecutedEvent:
        {
        	get:function()
        	{
        		if(CommandManager._PreviewExecutedEvent === undefined){
        			CommandManager._PreviewExecutedEvent=
                        EventManager.RegisterRoutedEvent("PreviewExecuted",
                                RoutingStrategy.Tunnel,
                                ExecutedRoutedEventHandler.Type, 
                                CommandManager.Type);
        		}
        		return CommandManager._PreviewExecutedEvent;
        	}
        },
        
        /// <summary> 
        ///     Event to execute a command
        /// </summary>
//        public static readonly RoutedEvent 
        ExecutedEvent:
        {
        	get:function(){
        		if(CommandManager._ExecutedEvent === undefined){
        			CommandManager._ExecutedEvent=
                        EventManager.RegisterRoutedEvent("Executed", 
                                RoutingStrategy.Bubble,
                                ExecutedRoutedEventHandler.Type, 
                                CommandManager.Type); 
        		}
        		return CommandManager._ExecutedEvent;
        	}
        },

        /// <summary>
        ///     Event to determine if a command can be executed
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewCanExecuteEvent:
        {
        	get:function(){
        		if(CommandManager._PreviewCanExecuteEvent === undefined){
        			CommandManager._PreviewCanExecuteEvent=
                        EventManager.RegisterRoutedEvent("PreviewCanExecute", 
                                RoutingStrategy.Tunnel, 
                                CanExecuteRoutedEventHandler.Type,
                                CommandManager.Type); 
        		}
        		return CommandManager._PreviewCanExecuteEvent;
        	}
        },
        
        /// <summary> 
        ///     Event to determine if a command can be executed
        /// </summary> 
//        public static readonly RoutedEvent 
        CanExecuteEvent:
        {
        	get:function(){
        		if(CommandManager._CanExecuteEvent === undefined){
        			CommandManager._CanExecuteEvent= 
                        EventManager.RegisterRoutedEvent("CanExecute",
                                RoutingStrategy.Bubble, 
                                CanExecuteRoutedEventHandler.Type,
                                CommandManager.Type);
        		}
        		return CommandManager._CanExecuteEvent;
        	}
        },


        /// <summary> 
        ///     Return the CommandManager associated with the current thread. 
        /// </summary>
//        private static CommandManager 
        Current: 
        {
            get:function()
            {
                if (_commandManager == null) 
                {
                	_commandManager = new CommandManager(); 
                } 

                return _commandManager; 
            }
        }

	});
	
	/// <summary> 
    ///     Attaches the handler on the element.
    /// </summary> 
    /// <param name="element">The element on which to attach the handler.</param>
    /// <param name="handler">The handler to attach.</param>
//    public static void 
    CommandManager.AddPreviewExecutedHandler = function(/*UIElement*/ element, /*ExecutedRoutedEventHandler*/ handler)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }
        if (handler == null) 
        {
            throw new ArgumentNullException("handler");
        }

        element.AddHandler(CommandManager.PreviewExecutedEvent, handler);
    }; 

    /// <summary>
    ///     Removes the handler from the element. 
    /// </summary>
    /// <param name="element">The element from which to remove the handler.</param>
    /// <param name="handler">The handler to remove.</param>
//    public static void 
    CommandManager.RemovePreviewExecutedHandler = function(/*UIElement*/ element, /*ExecutedRoutedEventHandler*/ handler) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 
        if (handler == null)
        {
            throw new ArgumentNullException("handler");
        } 

        element.RemoveHandler(CommandManager.PreviewExecutedEvent, handler); 
    }; 

    /// <summary> 
    ///     Attaches the handler on the element.
    /// </summary>
    /// <param name="element">The element on which to attach the handler.</param>
    /// <param name="handler">The handler to attach.</param> 
//    public static void 
    CommandManager.AddExecutedHandler = function(/*UIElement*/ element, /*ExecutedRoutedEventHandler*/ handler)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }
        if (handler == null)
        {
            throw new ArgumentNullException("handler"); 
        }

        element.AddHandler(CommandManager.ExecutedEvent, handler); 
    };

    /// <summary>
    ///     Removes the handler from the element.
    /// </summary>
    /// <param name="element">The element from which to remove the handler.</param> 
    /// <param name="handler">The handler to remove.</param>
//    public static void 
    CommandManager.RemoveExecutedHandler = function(/*UIElement*/ element, /*ExecutedRoutedEventHandler*/ handler) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }
        if (handler == null)
        { 
            throw new ArgumentNullException("handler");
        } 

        element.RemoveHandler(CommandManager.ExecutedEvent, handler);
    };
    /// <summary>
    ///     Attaches the handler on the element.
    /// </summary> 
    /// <param name="element">The element on which to attach the handler.</param>
    /// <param name="handler">The handler to attach.</param> 
//    public static void 
    CommandManager.AddPreviewCanExecuteHandler = function(/*UIElement*/ element, /*CanExecuteRoutedEventHandler*/ handler) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }
        if (handler == null) 
        {
            throw new ArgumentNullException("handler"); 
        } 

        element.AddHandler(CommandManager.PreviewCanExecuteEvent, handler); 
    };

    /// <summary>
    ///     Removes the handler from the element. 
    /// </summary>
    /// <param name="element">The element from which to remove the handler.</param> 
    /// <param name="handler">The handler to remove.</param> 
//    public static void 
    CommandManager.RemovePreviewCanExecuteHandler = function(/*UIElement*/ element, /*CanExecuteRoutedEventHandler*/ handler)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 
        if (handler == null)
        { 
            throw new ArgumentNullException("handler"); 
        }

        element.RemoveHandler(PreviewCanExecuteEvent, handler);
    };


    /// <summary> 
    ///     Attaches the handler on the element.
    /// </summary> 
    /// <param name="element">The element on which to attach the handler.</param> 
    /// <param name="handler">The handler to attach.</param>
//    public static void 
    CommandManager.AddCanExecuteHandler = function(/*UIElement*/ element, /*CanExecuteRoutedEventHandler*/ handler) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }
        if (handler == null) 
        { 
            throw new ArgumentNullException("handler");
        } 

        element.AddHandler(CommandManager.CanExecuteEvent, handler);
    };

    /// <summary>
    ///     Removes the handler from the element. 
    /// </summary> 
    /// <param name="element">The element from which to remove the handler.</param>
    /// <param name="handler">The handler to remove.</param> 
//    public static void 
    CommandManager.RemoveCanExecuteHandler = function(/*UIElement*/ element, /*CanExecuteRoutedEventHandler*/ handler)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 
        if (handler == null) 
        {
            throw new ArgumentNullException("handler"); 
        }

        element.RemoveHandler(CommandManager.CanExecuteEvent, handler);
    }; 

    /// <summary>
    ///     Register class level InputBindings.
    /// </summary>
    /// <param name="type">Owner type</param> 
    /// <param name="inputBinding">InputBinding to register</param>
//    public static void 
    CommandManager.RegisterClassInputBinding = function(/*Type*/ type, /*InputBinding*/ inputBinding) 
    { 
        if (type == null)
        { 
            throw new ArgumentNullException("type");
        }
        if (inputBinding == null)
        { 
            throw new ArgumentNullException("inputBinding");
        } 

        /*InputBindingCollection*/var inputBindings = _classInputBindings.Get(type);
        inputBindings = inputBindings instanceof InputBindingCollection ? inputBindings : null;

        if (inputBindings == null)
        { 
            inputBindings = new InputBindingCollection();
            _classInputBindings.Set(type, inputBindings); 
        } 

        inputBindings.Add(inputBinding); 

        if (!inputBinding.IsFrozen)
        {
            inputBinding.Freeze(); 
        }
    };

    /// <summary> 
    ///     Register class level CommandBindings.
    /// </summary>
    /// <param name="type">Owner type</param>
    /// <param name="commandBinding">CommandBinding to register</param> 
//    public static void 
    CommandManager.RegisterClassCommandBinding = function(/*Type*/ type, /*CommandBinding*/ commandBinding)
    { 
        if (type == null) 
        {
            throw new ArgumentNullException("type"); 
        }
        if (commandBinding == null)
        {
            throw new ArgumentNullException("commandBinding"); 
        }

        /*CommandBindingCollection*/
        var bindings = this._classCommandBindings.Get(type);
        bindings = bindings instanceof CommandBindingCollection ? bindings : null; 

        if (bindings == null)
        {
            bindings = new CommandBindingCollection(); 
            this._classCommandBindings.Set(type, bindings);
        } 

        bindings.Add(commandBinding);
    };

    /// <summary>
    ///     Invokes RequerySuggested listeners registered on the current thread. 
    /// </summary>
//    public static void 
    CommandManager.InvalidateRequerySuggested = function() 
    { 
        CommandManager.Current.RaiseRequerySuggested();
    }; 

    /// <summary> 
    ///     Scans input and command bindings for matching gestures and executes the appropriate command
    /// </summary> 
    /// <remarks> 
    ///     Scans for command to execute in the following order:
    ///     - input bindings associated with the targetElement instance 
    ///     - input bindings associated with the targetElement class
    ///     - command bindings associated with the targetElement instance
    ///     - command bindings associated with the targetElement class
    /// </remarks> 
    /// <param name="targetElement">UIElement/ContentElement to be scanned for input and command bindings</param>
    /// <param name="inputEventArgs">InputEventArgs to be matched against for gestures</param> 
    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input and cause elevations for Userinitiated paste
    /// </SecurityNote> 
//    internal static void 
    CommandManager.TranslateInput = function(/*IInputElement*/ targetElement, /*InputEventArgs*/ inputEventArgs)
    {
        if ((targetElement == null) || (inputEventArgs == null)) 
        {
            return; 
        } 

        /*ICommand*/var command = null; 
        /*IInputElement*/var target = null;
        /*object*/var parameter = null;

        // Step 1: Check local input bindings
        /*InputBindingCollection*/var localInputBindings = targetElement.InputBindingsInternal;
        
        if (localInputBindings != null) 
        { 
            /*InputBinding*/var inputBinding = localInputBindings.FindMatch(targetElement, inputEventArgs);
            if (inputBinding != null) 
            {
                command = inputBinding.Command;
                target = inputBinding.CommandTarget;
                parameter = inputBinding.CommandParameter; 
            }
        } 
        
        if ((targetElement == null) || (inputEventArgs == null)) 
        {
            return; 
        } 
        
        // Step 2: If no command, check class input bindings
        if (command == null) 
        {
            /*Type*/var classType = targetElement.GetType(); 
            while (classType != null)
            { 
                /*InputBindingCollection*/
            	var classInputBindings = _classInputBindings.Get(classType);
            	classInputBindings = classInputBindings instanceof InputBindingCollection ? classInputBindings : null; 
                if (classInputBindings != null)
                { 
                    /*InputBinding*/
                	var inputBinding = classInputBindings.FindMatch(targetElement, inputEventArgs);
                    if (inputBinding != null)
                    {
                        command = inputBinding.Command; 
                        target = inputBinding.CommandTarget;
                        parameter = inputBinding.CommandParameter; 
                        break; 
                    }
                } 
                classType = classType.BaseType;
            }
        } 

        // Step 3: If no command, check local command bindings 
        if (command == null) 
        {
            // Check for the instance level ones Next 
            /*CommandBindingCollection*/var localCommandBindings = targetElement.CommandBindingsInternal; 

            if (localCommandBindings != null)
            { 
                command = localCommandBindings.FindMatchCommand(targetElement, inputEventArgs); 
            }
        } 

        // Step 4: If no command, look at class command bindings
        if (command == null)
        { 
            /*Type*/var classType = targetElement.GetType(); 
            while (classType != null)
            { 
                /*CommandBindingCollection*/
            	var classCommandBindings = _classCommandBindings.Get(classType);
            	classCommandBindings = classCommandBindings instanceof CommandBindingCollection ? classCommandBindings : null;
                if (classCommandBindings != null)
                {
                    command = classCommandBindings.FindMatchCommand(targetElement, inputEventArgs); 
                    if (command != null)
                    { 
                        break; 
                    }
                } 
                classType = classType.BaseType;
            }
        } 
        
        // Step 5: If found a command, then execute it (unless it is 
        // the special "NotACommand" command, which we simply ignore without 
        // setting Handled=true, so that the input bubbles up to the parent)
        if (command != null && command != ApplicationCommands.NotACommand) 
        {
            // We currently do not support declaring the element with focus as the target
            // element by setting target == null.  Instead, we interpret a null target to indicate
            // the element that we are routing the event through, e.g. the targetElement parameter. 
            if (target == null)
            { 
                target = targetElement; 
            }

            var continueRouting = false;

            /*RoutedCommand*/var routedCommand = command instanceof RoutedCommand ? command : null;
            if (routedCommand != null) 
            {
            	var continueRoutingOut ={
            		"continueRouting" : false	
            	};
            	var flag = routedCommand.CriticalCanExecute(parameter, 
                        target, 
                        inputEventArgs.UserInitiated /*trusted*/,
                        continueRoutingOut
                        /*out continueRouting*/);
            	continueRouting = continueRoutingOut.continueRouting;
                if (flag) 
                {
                    // If the command can be executed, we never continue to route the
                    // input event.
                    continueRouting = false; 

                    ExecuteCommand(routedCommand, parameter, target, inputEventArgs); 
                } 
            }
            else 
            {
                if (command.CanExecute(parameter))
                {
                    command.Execute(parameter); 
                }
            } 

            // If we mapped an input event to a command, we should always
            // handle the input event - regardless of whether the command 
            // was executed or not.  Unless the CanExecute handler told us
            // to continue the route.
            inputEventArgs.Handled = !continueRouting;
        } 
    };

    /// <SecurityNote> 
    ///     Critical - accesses critical information (determining if command is driven from user input)
    ///     TreatAsSafe - Does so correctly (only looking at protected information, does not modify) 
    /// </SecurityNote>
//    private static bool 
    function ExecuteCommand(/*RoutedCommand*/ routedCommand, /*object*/ parameter, /*IInputElement*/ target, /*InputEventArgs*/ inputEventArgs)
    { 
        return routedCommand.ExecuteCore(parameter, target, inputEventArgs.UserInitiated);
    } 

    /// <summary>
    ///     Forwards CanExecute events to CommandBindings. 
    /// </summary>
//    internal static void 
    CommandManager.OnCanExecute = function(/*object*/ sender, /*CanExecuteRoutedEventArgs*/ e)
    {
        if ((sender != null) && (e != null) && (e.Command != null)) 
        {
            FindCommandBinding(sender, e, e.Command, false); 

            if (!e.Handled && (e.RoutedEvent == CommandManager.CanExecuteEvent))
            { 
                /*DependencyObject*/var d = sender instanceof DependencyObject ? sender : null;
                if (d != null)
                {
                    if (FocusManager.GetIsFocusScope(d)) 
                    {
                        // This element is a focus scope. 
                        // Try to transfer the event to its parent focus scope's focused element. 
                        /*IInputElement*/var focusedElement = GetParentScopeFocusedElement(d);
                        if (focusedElement != null) 
                        {
                            TransferEvent(focusedElement, e);
                        }
                    } 
                }
            } 
        } 
    };
  
//    private static bool 
    function CanExecuteCommandBinding(/*object*/ sender, /*CanExecuteRoutedEventArgs*/ e, /*CommandBinding*/ commandBinding)
    {
        commandBinding.OnCanExecute(sender, e);
        return e.CanExecute || e.Handled; 
    }

    /// <summary> 
    ///     Forwards Executed events to CommandBindings.
    /// </summary> 
//    internal static void 
    CommandManager.OnExecuted = function(/*object*/ sender, /*ExecutedRoutedEventArgs*/ e)
    {
        if ((sender != null) && (e != null) && (e.Command != null))
        { 
            FindCommandBinding(sender, e, e.Command, true);

            if (!e.Handled && (e.RoutedEvent == CommandManager.ExecutedEvent)) 
            {
            	/*DependencyObject*/var d = sender instanceof DependencyObject ? sender : null;
                if (d != null)
                {
                    if (FocusManager.GetIsFocusScope(d))
                    { 
                        // This element is a focus scope.
                        // Try to transfer the event to its parent focus scope's focused element. 
                        /*IInputElement*/var focusedElement = GetParentScopeFocusedElement(d); 
                        if (focusedElement != null)
                        { 
                            TransferEvent(focusedElement, e);
                        }
                    }
                } 
            }
        } 
    }; 

    /// <SecurityNote> 
    ///     Critical - creates critical information (determining if command is driven from user input)
    ///     TreatAsSafe - Does so correctly (only looking at protected information)
    /// </SecurityNote>
//    private static bool 
    function ExecuteCommandBinding(/*object*/ sender, /*ExecutedRoutedEventArgs*/ e, /*CommandBinding*/ commandBinding)
    { 
    	commandBinding.OnExecuted(sender, e); 

        return e.Handled;
    };

//    internal static void 
    CommandManager.OnCommandDevice = function(/*object*/ sender, /*CommandDeviceEventArgs*/ e)
    { 
        if ((sender != null) && (e != null) && (e.Command != null)) 
        {
            /*CanExecuteRoutedEventArgs*/
        	var canExecuteArgs = new CanExecuteRoutedEventArgs(e.Command, null /* parameter */); 
            canExecuteArgs.RoutedEvent = CommandManager.CanExecuteEvent;
            canExecuteArgs.Source = sender;
            CommandManager.OnCanExecute(sender, canExecuteArgs);

            if (canExecuteArgs.CanExecute)
            { 
                /*ExecutedRoutedEventArgs*/
            	var executedArgs = new ExecutedRoutedEventArgs(e.Command, null /* parameter */); 
                executedArgs.RoutedEvent = CommandManager.ExecutedEvent;
                executedArgs.Source = sender; 
                CommandManager.OnExecuted(sender, executedArgs);

                if (executedArgs.Handled)
                { 
                    e.Handled = true;
                } 
            } 
        }
    };
  
//    private static void 
    function FindCommandBinding(/*CommandBindingCollection*/ commandBindings, /*object*/ sender, /*RoutedEventArgs*/ e, /*ICommand*/ command, /*bool*/ execute)
    {
    	if(arguments.length == 4){
    		execute = command;
    		command = e;
    		e = sender;
    		sender = commandBindings;
    		
	        // Check local command bindings 
	        /*CommandBindingCollection*/
	    	var commandBindings = sender.CommandBindingsInternal;
	        if (commandBindings != null)
	        {
	            FindCommandBinding(commandBindings, sender, e, command, execute);
	        } 
	
	        // If no command binding is found, check class command bindings 
	        // Check from the current type to all the base types 
	        /*Type*/var classType = sender.GetType();
	        while (classType != null)
	        {
	            /*CommandBindingCollection*/var classCommandBindings = this._classCommandBindings.Get(classType);
	            classCommandBindings = classCommandBindings instanceof CommandBindingCollection ? classCommandBindings : null; 
	            if (classCommandBindings != null)
	            { 
	                FindCommandBinding(classCommandBindings, sender, e, command, execute); 
	            }
	            classType = classType.BaseType; 
	        }
    	}else if(arguments.length == 5){  /*///*CommandBindingCollection commandBindings, 
    			object sender, RoutedEventArgs e, ICommand command, bool execute)*/
            var index = 0;
            var indexRef={"index" : index};
            while (true)
            { 
                /*CommandBinding*/
            	var commandBinding = commandBindings.FindMatchCommandBinding(command, indexRef/*ref index*/);
            	index = indexRef.index;
                if ((commandBinding == null) ||
                    (execute && ExecuteCommandBinding(sender, /*(ExecutedRoutedEventArgs)*/e, commandBinding)) ||
                    (!execute && CanExecuteCommandBinding(sender, /*(CanExecuteRoutedEventArgs)*/e, commandBinding))) 
                {
                    break; 
                } 
            }
    	}
    }

//    private static void 
    function TransferEvent(/*IInputElement*/ newSource, /*CanExecuteRoutedEventArgs or ExecutedRoutedEventArgs*/ e)
    {
        /*RoutedCommand*/var command = e.Command instanceof RoutedCommand ? e.Command : null; 
        if (command != null)
        { 
            try 
            {
            	if(e instanceof CanExecuteRoutedEventArgs){
                    e.CanExecute = command.CanExecute(e.Parameter, newSource); 
            	}else{
            		command.ExecuteCore(e.Parameter, newSource, e.UserInitiated); 
            	}
            }
            finally
            {
                e.Handled = true; 
            }
        } 
    } 
  
//    private static IInputElement 
    function GetParentScopeFocusedElement(/*DependencyObject*/ childScope) 
    {
        /*DependencyObject*/var parentScope = GetParentScope(childScope); 
        if (parentScope != null) 
        {
            /*IInputElement*/var focusedElement = FocusManager.GetFocusedElement(parentScope); 
            if ((focusedElement != null) && !ContainsElement(childScope, focusedElement instanceof DependencyObject ? focusedElement : null))
            {
                // The focused element from the parent focus scope is not within the focus scope
                // of the current element. 
                return focusedElement;
            } 
        } 

        return null; 
    }
//    private static DependencyObject 
    function GetParentScope(/*DependencyObject*/ childScope)
    { 
        // Get the parent element of the childScope element
        parent = childScope.GetUIParent(true); 

        if (parent != null) 
        { 
            // Get the next focus scope above this one
            return FocusManager.GetFocusScope(parent); 
        }

        return null;
    } 

//    private static bool 
    function ContainsElement(/*DependencyObject*/ scope, /*DependencyObject*/ child) 
    { 
        if (child != null)
        { 
            /*DependencyObject*/var parentScope = FocusManager.GetFocusScope(child);
            while (parentScope != null)
            {
                if (parentScope == scope) 
                {
                    // A parent scope matches the scope we are looking for 
                    return true; 
                }
                parentScope = GetParentScope(parentScope); 
            }
        }

        return false; 
    }
    
//    /// <summary>
//    ///     Raised when CanExecute should be requeried on commands. 
//    /// </summary>
//    public static event EventHandler RequerySuggested
//    {
//        add 
//        {
//            // if a source delegates its CanExecuteChanged event to RequerySuggested, 
//            // we redirect any weak-event listeners through the CanExecuteChangedManager. 
//            if (!CanExecuteChangedEventManager.IsSourceDelegatingToCommandManager(value))
//            { 
//                RequerySuggestedEventManager.AddHandler(null, value);
//            }
//        }
//        remove { RequerySuggestedEventManager.RemoveHandler(null, value); } 
//    }
    
    CommandManager.AddRequerySuggestedHandler = function(value) 
    {
        // if a source delegates its CanExecuteChanged event to RequerySuggested, 
        // we redirect any weak-event listeners through the CanExecuteChangedManager. 
        if (!CanExecuteChangedEventManager.IsSourceDelegatingToCommandManager(value))
        { 
            RequerySuggestedEventManager.AddHandler(null, value);
        }
    };
    CommandManager.RemoveAddRequerySuggestedHandler = function(value)  { RequerySuggestedEventManager.RemoveHandler(null, value); };
	
	CommandManager.Type = new Type("CommandManager", CommandManager, [Object.Type]);
	return CommandManager;
});
//        /// <summary>
//        ///     Raised when CanExecute should be requeried on commands. 
//        /// </summary>
//        public static event EventHandler RequerySuggested
//        {
//            add 
//            {
//                // if a source delegates its CanExecuteChanged event to RequerySuggested, 
//                // we redirect any weak-event listeners through the CanExecuteChangedManager. 
//                if (!CanExecuteChangedEventManager.IsSourceDelegatingToCommandManager(value))
//                { 
//                    RequerySuggestedEventManager.AddHandler(null, value);
//                }
//            }
//            remove { RequerySuggestedEventManager.RemoveHandler(null, value); } 
//        }
//
//        // The CommandManager associated with the current thread
//        private static CommandManager _commandManager; 
//
//        // This is a Hashtable of CommandBindingCollections keyed on OwnerType 
//        // Each ItemList holds the registered Class level CommandBindings for that OwnerType 
//        private static HybridDictionary _classCommandBindings = new HybridDictionary();
// 
//        // This is a Hashtable of InputBindingCollections keyed on OwnerType
//        // Each Item holds the registered Class level CommandBindings for that OwnerType
//        private static HybridDictionary _classInputBindings = new HybridDictionary();
//
//        ///<summary> 
//        ///     Creates a new instance of this class.
//        ///</summary> 
//        private CommandManager() 
//        {
//        } 
//
//        /// <summary> 
//        ///     Adds an idle priority dispatcher operation to raise RequerySuggested. 
//        /// </summary>
//        private void RaiseRequerySuggested() 
//        {
//            if (_requerySuggestedOperation == null)
//            {
//                Dispatcher dispatcher = Dispatcher.CurrentDispatcher; 
//                if ((dispatcher != null) && !dispatcher.HasShutdownStarted && !dispatcher.HasShutdownFinished)
//                { 
//                    _requerySuggestedOperation = dispatcher.BeginInvoke(DispatcherPriority.Background, new DispatcherOperationCallback(RaiseRequerySuggested), null); 
//                }
//            } 
//        }
//
//        private object RaiseRequerySuggested(object obj)
//        { 
//            // Call the RequerySuggested handlers
//            _requerySuggestedOperation = null; 
// 
//            if (PrivateRequerySuggested != null)
//                PrivateRequerySuggested(null, EventArgs.Empty); 
//
//            return null;
//        }
//
//        private DispatcherOperation _requerySuggestedOperation; 
//
//        private event EventHandler PrivateRequerySuggested;
//
//        private class RequerySuggestedEventManager : WeakEventManager 
//        {
//
//            private RequerySuggestedEventManager()
//            { 
//            }
//
//            /// <summary> 
//            /// Add a handler for the given source's event. 
//            /// </summary>
//            public static void AddHandler(CommandManager source, EventHandler handler) 
//            {
//                if (handler == null)
//                    return; // 4.0-compat;  should be:  throw new ArgumentNullException("handler");
// 
//                CurrentManager.ProtectedAddHandler(source, handler);
//            } 
// 
//            /// <summary>
//            /// Remove a handler for the given source's event. 
//            /// </summary>
//            public static void RemoveHandler(CommandManager source, EventHandler handler)
//            {
//                if (handler == null) 
//                    return; // 4.0-compat;  should be:  throw new ArgumentNullException("handler");
// 
//                CurrentManager.ProtectedRemoveHandler(source, handler); 
//            }
//
//            /// <summary> 
//            /// Return a new list to hold listeners to the event.
//            /// </summary>
//            protected override ListenerList NewListenerList()
//            { 
//                return new ListenerList();
//            } 
// 
//            /// <summary>
//            /// Listen to the given source for the event. 
//            /// </summary>
//            protected override void StartListening(object source)
//            {
//                CommandManager typedSource = CommandManager.Current; 
//                typedSource.PrivateRequerySuggested += new EventHandler(OnRequerySuggested);
//            } 
// 
//            /// <summary>
//            /// Stop listening to the given source for the event. 
//            /// </summary>
//            protected override void StopListening(object source)
//            {
//                CommandManager typedSource = CommandManager.Current; 
//                typedSource.PrivateRequerySuggested -= new EventHandler(OnRequerySuggested);
//            } 
// 
//            // get the event manager for the current thread 
//            private static RequerySuggestedEventManager CurrentManager
//            { 
//                get
//                {
//                    Type managerType = typeof(RequerySuggestedEventManager);
//                    RequerySuggestedEventManager manager = (RequerySuggestedEventManager)GetCurrentManager(managerType); 
//
//                    // at first use, create and register a new manager 
//                    if (manager == null) 
//                    {
//                        manager = new RequerySuggestedEventManager(); 
//                        SetCurrentManager(managerType, manager);
//                    }
//
//                    return manager; 
//                }
//            } 
// 
//            // event handler for CurrentChanged event 
//            private void OnRequerySuggested(object sender, EventArgs args)
//            { 
//                DeliverEvent(sender, args);
//            }
//        }


