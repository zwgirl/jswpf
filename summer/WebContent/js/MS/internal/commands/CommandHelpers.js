/**
 * CommandHelpers
 */

define(["dojo/_base/declare", "system/Type", "windows/IInputElement", "input/CommandManager", "input/RoutedCommand",
        "input/CommandBinding", "input/InputBinding"], 
		function(declare, Type, IInputElement, CommandManager, RoutedCommand,
				CommandBinding, InputBinding){
	var CommandHelpers = declare("CommandHelpers", null,{
	});
	
    // Lots of specialized registration methods to avoid new'ing up more common stuff (like InputGesture's) at the callsite, as that's frequently
    // repeated and increases code size.  Do it once, here.

//    internal static void 
	CommandHelpers.RegisterCommandHandler = function(/*Type*/ controlType, /*RoutedCommand*/ command, 
			/*ExecutedRoutedEventHandler*/ executedRoutedEventHandler)
    { 
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, null, null); 
    };

//    internal static void 
    CommandHelpers.RegisterCommandHandler = function(/*Type*/ controlType, /*RoutedCommand*/ command, 
    		/*ExecutedRoutedEventHandler*/ executedRoutedEventHandler,
                                                /*InputGesture*/ inputGesture)
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, null, inputGesture); 
    };

//    internal static void 
    CommandHelpers.RegisterCommandHandler = function(/*Type*/ controlType, /*RoutedCommand*/ command, 
    		/*ExecutedRoutedEventHandler*/ executedRoutedEventHandler, 
                                                /*Key*/ key)
    { 
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, null, new KeyGesture(key));
    };

//    internal static void 
    CommandHelpers.RegisterCommandHandler = function(/*Type*/ controlType, /*RoutedCommand*/ command, 
    		/*ExecutedRoutedEventHandler*/ executedRoutedEventHandler, 
                                                /*InputGesture*/ inputGesture, /*InputGesture*/ inputGesture2)
    { 
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, null, inputGesture, inputGesture2); 
    };

//    internal static void 
    CommandHelpers.RegisterCommandHandler = function(/*Type*/ controlType, /*RoutedCommand*/ command, 
    		/*ExecutedRoutedEventHandler*/ executedRoutedEventHandler,
                                                /*CanExecuteRoutedEventHandler*/ canExecuteRoutedEventHandler)
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler, null); 
    };

//    internal static void 
    CommandHelpers.RegisterCommandHandler = function(/*Type*/ controlType, /*RoutedCommand*/ command, 
    		/*ExecutedRoutedEventHandler*/ executedRoutedEventHandler, 
                                                /*CanExecuteRoutedEventHandler*/ canExecuteRoutedEventHandler,
                                                /*InputGesture*/ inputGesture)
    { 
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler, inputGesture);
    };

//    internal static void 
    CommandHelpers.RegisterCommandHandler = function(/*Type*/ controlType, /*RoutedCommand*/ command, 
    		/*ExecutedRoutedEventHandler*/ executedRoutedEventHandler, 
                                                /*CanExecuteRoutedEventHandler*/ canExecuteRoutedEventHandler, /*Key*/ key)
    { 
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler, new KeyGesture(key)); 
    };

//    internal static void 
    CommandHelpers.RegisterCommandHandler = function(/*Type*/ controlType, 
    		/*RoutedCommand*/ command, /*ExecutedRoutedEventHandler*/ executedRoutedEventHandler,
                                                /*CanExecuteRoutedEventHandler*/ canExecuteRoutedEventHandler, 
                                                /*InputGesture*/ inputGesture, /*InputGesture*/ inputGesture2)
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler, inputGesture, inputGesture2); 
    };

//    internal static void 
    CommandHelpers.RegisterCommandHandler = function(/*Type*/ controlType, /*RoutedCommand*/ command,
    		/*ExecutedRoutedEventHandler*/ executedRoutedEventHandler, 
                                                /*CanExecuteRoutedEventHandler*/ canExecuteRoutedEventHandler,
                                                /*InputGesture*/ inputGesture, 
                                                /*InputGesture*/ inputGesture2, /*InputGesture*/ inputGesture3,
                                                /*InputGesture*/ inputGesture4) 
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler,
                                      inputGesture, inputGesture2, inputGesture3, inputGesture4);
    }; 

//    internal static void 
    CommandHelpers.RegisterCommandHandler = function(/*Type*/ controlType, /*RoutedCommand*/ command, /*Key*/ key, 
    		/*ModifierKeys*/ modifierKeys, 
            /*ExecutedRoutedEventHandler*/ executedRoutedEventHandler, /*CanExecuteRoutedEventHandler*/ canExecuteRoutedEventHandler) 
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler, new KeyGesture(key, modifierKeys)); 
    };

//    internal static void 
    CommandHelpers.RegisterCommandHandler = function(/*Type*/ controlType, /*RoutedCommand*/ command, 
    		/*ExecutedRoutedEventHandler*/ executedRoutedEventHandler,
                                                /*string*/ srid1, /*string*/ srid2) 
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, null, 
                                              KeyGesture.CreateFromResourceStrings(SR.Get(srid1), SR.Get(srid2))); 
    };

//    internal static void 
    CommandHelpers.RegisterCommandHandler = function(/*Type*/ controlType, /*RoutedCommand*/ command, 
    		/*ExecutedRoutedEventHandler*/ executedRoutedEventHandler,
                                                /*CanExecuteRoutedEventHandler*/ canExecuteRoutedEventHandler, 
                                                /*string*/ srid1, /*string*/ srid2)
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler, 
                                              KeyGesture.CreateFromResourceStrings(SR.Get(srid1), SR.Get(srid2)));
    }; 

    // 'params' based method is private.  Call sites that use this bloat unwittingly due to implicit construction of the params array that goes into IL.
//    private static void 
    function PrivateRegisterCommandHandler(/*Type*/ controlType, /*RoutedCommand*/ command, 
    		/*ExecutedRoutedEventHandler*/ executedRoutedEventHandler, 
                                                      /*CanExecuteRoutedEventHandler*/ canExecuteRoutedEventHandler, 
                                                      /*params InputGesture[]*/ inputGestures)
    {
        // Validate parameters
//        Debug.Assert(controlType != null); 
//        Debug.Assert(command != null);
//        Debug.Assert(executedRoutedEventHandler != null); 
        // All other parameters may be null 

        // Create command link for this command 
        CommandManager.RegisterClassCommandBinding(controlType, new CommandBinding(command, executedRoutedEventHandler, canExecuteRoutedEventHandler));

        // Create additional input binding for this command
        if (inputGestures != null) 
        {
            for (var i = 0; i < inputGestures.length; i++) 
            { 
                CommandManager.RegisterClassInputBinding(controlType, new InputBinding(command, inputGestures[i]));
            } 
        }

    }

//    internal static bool 
    CommandHelpers.CanExecuteCommandSource = function(/*ICommandSource*/ commandSource)
    { 
        /*ICommand*/var command = commandSource.Command; 
        if (command != null)
        { 
            /*object*/var parameter = commandSource.CommandParameter;
            /*IInputElement*/var target = commandSource.CommandTarget;

            /*RoutedCommand*/var routed = command instanceof RoutedCommand ? command : null; 
            if (routed != null)
            { 
                if (target == null) 
                {
                    target = commandSource instanceof IInputElement ? commandSource : null; 
                }
                return routed.CanExecute(parameter, target);
            }
            else 
            {
                return command.CanExecute(parameter); 
            } 
        }

        return false;
    };

    /// <summary> 
    ///     Executes the command on the given command source.
    /// </summary> 
    /// <SecurityNote> 
    ///     Critical - calls critical function (ExecuteCommandSource)
    ///     TreatAsSafe - always passes in false for userInitiated, which is safe 
    /// </SecurityNote>
//    internal static void 
    CommandHelpers.ExecuteCommandSource = function(/*ICommandSource*/ commandSource)
    { 
    	CommandHelpers.CriticalExecuteCommandSource(commandSource, false);
    }; 

            /// <summary>
    ///     Executes the command on the given command source. 
    /// </summary>
    /// <SecurityNote>
    /// Critical - sets the user initiated bit on a command, which is used
    ///            for security purposes later. It is important to validate 
    ///            the callers of this, and the implementation to make sure
    ///            that we only call MarkAsUserInitiated in the correct cases. 
    /// </SecurityNote> 
//    internal static void 
    CommandHelpers.CriticalExecuteCommandSource = function(/*ICommandSource*/ commandSource, /*bool*/ userInitiated) 
    {
        /*ICommand*/var command = commandSource.Command;
        if (command != null)
        { 
            /*object*/var parameter = commandSource.CommandParameter;
            /*IInputElement*/var target = commandSource.CommandTarget; 

            /*RoutedCommand*/ routed = command instanceof RoutedCommand ? command : null;
            if (routed != null) 
            {
                if (target == null)
                {
                    target = commandSource instanceof IInputElement ? commandSource : null; 
                }
                if (routed.CanExecute(parameter, target)) 
                { 
                    routed.ExecuteCore(parameter, target, userInitiated);
                } 
            }
            else if (command.CanExecute(parameter))
            {
                command.Execute(parameter); 
            }
        } 
    }; 
    // This allows a caller to override its ICommandSource values (used by Button and ScrollBar)
//    internal static void 
    CommandHelpers.ExecuteCommand = function(/*ICommand*/ command, /*object*/ parameter, /*IInputElement*/ target) 
    {
        /*RoutedCommand*/var routed = command instanceof RoutedCommand ? command : null;
        if (routed != null)
        { 
            if (routed.CanExecute(parameter, target))
            { 
                routed.Execute(parameter, target); 
            }
        } 
        else if (command.CanExecute(parameter))
        {
            command.Execute(parameter);
        } 
    };
	
	CommandHelpers.Type = new Type("CommandHelpers", CommandHelpers, [Object.Type]);
	return CommandHelpers;
});

  
