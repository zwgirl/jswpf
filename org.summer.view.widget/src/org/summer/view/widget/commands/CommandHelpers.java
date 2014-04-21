package org.summer.view.widget.commands;

import java.awt.RenderingHints.Key;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.IInputElement;
import org.summer.view.widget.Type;
import org.summer.view.widget.input.CanExecuteRoutedEventHandler;
import org.summer.view.widget.input.CommandBinding;
import org.summer.view.widget.input.CommandManager;
import org.summer.view.widget.input.ExecutedRoutedEventHandler;
import org.summer.view.widget.input.ICommand;
import org.summer.view.widget.input.ICommandSource;
import org.summer.view.widget.input.InputBinding;
import org.summer.view.widget.input.ModifierKeys;
import org.summer.view.widget.input.RoutedCommand;

/*internal*/ public /*static*/ class CommandHelpers
{ 

    // Lots of specialized registration methods to avoid new'ing up more common stuff (like InputGesture's) at the callsite, as that's frequently
    // repeated and increases code size.  Do it once, here.

    /*internal*/ public static void RegisterCommandHandler(Type controlType, RoutedCommand command, ExecutedRoutedEventHandler executedRoutedEventHandler)
    { 
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, null, null); 
    }

    /*internal*/ public static void RegisterCommandHandler(Type controlType, RoutedCommand command, ExecutedRoutedEventHandler executedRoutedEventHandler,
                                                InputGesture inputGesture)
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, null, inputGesture); 
    }

    /*internal*/ public static void RegisterCommandHandler(Type controlType, RoutedCommand command, ExecutedRoutedEventHandler executedRoutedEventHandler, 
                                                Key key)
    { 
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, null, new KeyGesture(key));
    }

    /*internal*/ public static void RegisterCommandHandler(Type controlType, RoutedCommand command, ExecutedRoutedEventHandler executedRoutedEventHandler, 
                                                InputGesture inputGesture, InputGesture inputGesture2)
    { 
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, null, inputGesture, inputGesture2); 
    }

    /*internal*/ public static void RegisterCommandHandler(Type controlType, RoutedCommand command, ExecutedRoutedEventHandler executedRoutedEventHandler,
                                                CanExecuteRoutedEventHandler canExecuteRoutedEventHandler)
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler, null); 
    }

    /*internal*/ public static void RegisterCommandHandler(Type controlType, RoutedCommand command, ExecutedRoutedEventHandler executedRoutedEventHandler, 
                                                CanExecuteRoutedEventHandler canExecuteRoutedEventHandler, InputGesture inputGesture)
    { 
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler, inputGesture);
    }

    /*internal*/ public static void RegisterCommandHandler(Type controlType, RoutedCommand command, ExecutedRoutedEventHandler executedRoutedEventHandler, 
                                                CanExecuteRoutedEventHandler canExecuteRoutedEventHandler, Key key)
    { 
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler, new KeyGesture(key)); 
    }

    /*internal*/ public static void RegisterCommandHandler(Type controlType, RoutedCommand command, ExecutedRoutedEventHandler executedRoutedEventHandler,
                                                CanExecuteRoutedEventHandler canExecuteRoutedEventHandler, InputGesture inputGesture, InputGesture inputGesture2)
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler, inputGesture, inputGesture2); 
    }

    /*internal*/ public static void RegisterCommandHandler(Type controlType, RoutedCommand command, ExecutedRoutedEventHandler executedRoutedEventHandler, 
                                                CanExecuteRoutedEventHandler canExecuteRoutedEventHandler,
                                                InputGesture inputGesture, InputGesture inputGesture2, InputGesture inputGesture3, InputGesture inputGesture4) 
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler,
                                      inputGesture, inputGesture2, inputGesture3, inputGesture4);
    } 

    /*internal*/ public static void RegisterCommandHandler(Type controlType, RoutedCommand command, Key key, ModifierKeys modifierKeys, 
                                                ExecutedRoutedEventHandler executedRoutedEventHandler, CanExecuteRoutedEventHandler canExecuteRoutedEventHandler) 
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler, new KeyGesture(key, modifierKeys)); 
    }

    /*internal*/ public static void RegisterCommandHandler(Type controlType, RoutedCommand command, ExecutedRoutedEventHandler executedRoutedEventHandler,
                                                string srid1, string srid2) 
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, null, 
                                              KeyGesture.CreateFromResourceStrings(SR.Get(srid1), SR.Get(srid2))); 
    }

    /*internal*/ public static void RegisterCommandHandler(Type controlType, RoutedCommand command, ExecutedRoutedEventHandler executedRoutedEventHandler,
                                                CanExecuteRoutedEventHandler canExecuteRoutedEventHandler, string srid1, string srid2)
    {
        PrivateRegisterCommandHandler(controlType, command, executedRoutedEventHandler, canExecuteRoutedEventHandler, 
                                              KeyGesture.CreateFromResourceStrings(SR.Get(srid1), SR.Get(srid2)));
    } 

    // 'params' based method is private.  Call sites that use this bloat unwittingly due to implicit construction of the params array that goes into IL.
    private static void PrivateRegisterCommandHandler(Type controlType, RoutedCommand command, ExecutedRoutedEventHandler executedRoutedEventHandler, 
                                                      CanExecuteRoutedEventHandler canExecuteRoutedEventHandler, /*params*/ InputGesture[] inputGestures)
    {
        // Validate parameters
        Debug.Assert(controlType != null); 
        Debug.Assert(command != null);
        Debug.Assert(executedRoutedEventHandler != null); 
        // All other parameters may be null 

        // Create command link for this command 
        CommandManager.RegisterClassCommandBinding(controlType, new CommandBinding(command, executedRoutedEventHandler, canExecuteRoutedEventHandler));

        // Create additional input binding for this command
        if (inputGestures != null) 
        {
            for (int i = 0; i < inputGestures.Length; i++) 
            { 
                CommandManager.RegisterClassInputBinding(controlType, new InputBinding(command, inputGestures[i]));
            } 
        }

    }

    /*internal*/ public static boolean CanExecuteCommandSource(ICommandSource commandSource)
    { 
        ICommand command = commandSource.Command; 
        if (command != null)
        { 
            Object parameter = commandSource.CommandParameter;
            IInputElement target = commandSource.CommandTarget;

            RoutedCommand routed = command as RoutedCommand; 
            if (routed != null)
            { 
                if (target == null) 
                {
                    target = commandSource as IInputElement; 
                }
                return routed.CanExecute(parameter, target);
            }
            else 
            {
                return command.CanExecute(parameter); 
            } 
        }

        return false;
    }

    /// <summary> 
    ///     Executes the command on the given command source.
    /// </summary> 
    /// <SecurityNote> 
    ///     Critical - calls critical function (ExecuteCommandSource)
    ///     TreatAsSafe - always passes in false for userInitiated, which is safe 
    /// </SecurityNote>
//    [SecurityCritical, SecurityTreatAsSafe]
    /*internal*/ public static void ExecuteCommandSource(ICommandSource commandSource)
    { 
        CriticalExecuteCommandSource(commandSource, false);
    } 

            /// <summary>
    ///     Executes the command on the given command source. 
    /// </summary>
    /// <SecurityNote>
    /// Critical - sets the user initiated bit on a command, which is used
    ///            for security purposes later. It is important to validate 
    ///            the callers of this, and the implementation to make sure
    ///            that we only call MarkAsUserInitiated in the correct cases. 
    /// </SecurityNote> 
//    [SecurityCritical]
    /*internal*/ public static void CriticalExecuteCommandSource(ICommandSource commandSource, boolean userInitiated) 
    {
        ICommand command = commandSource.Command;
        if (command != null)
        { 
            Object parameter = commandSource.CommandParameter;
            IInputElement target = commandSource.CommandTarget; 

            RoutedCommand routed = command as RoutedCommand;
            if (routed != null) 
            {
                if (target == null)
                {
                    target = commandSource as IInputElement; 
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
    } 
    // This allows a caller to override its ICommandSource values (used by Button and ScrollBar)
    /*internal*/ public static void ExecuteCommand(ICommand command, Object parameter, IInputElement target) 
    {
        RoutedCommand routed = command as RoutedCommand;
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
    }
} 