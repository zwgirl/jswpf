/**
 * CommandBinding
 */

define(["dojo/_base/declare", "system/Type", "input/CommandManager", "input/ExecutedRoutedEventHandler",
        "input/CanExecuteRoutedEventHandler", "input/CanExecuteRoutedEventArgs",
        ], 
		function(declare, Type, CommandManager, ExecutedRoutedEventHandler,
				CanExecuteRoutedEventHandler, CanExecuteRoutedEventArgs){
	var CommandBinding = declare("CommandBinding", null,{
		constructor:function(/*ICommand*/ command, /*ExecutedRoutedEventHandler*/ executed, /*CanExecuteRoutedEventHandler*/ canExecute) 
	    { 
	        if (command == null)
	        { 
	            throw new ArgumentNullException("command");
	        }

	        if(executed === undefined){
	        	executed = null;
	        }
	        
	        if(canExecute === undefined){
	        	canExecute = null;
	        }
	        
	        this._command = command; 

	        if (executed != null) 
	        { 
	        	this.Executed.Combine(executed);
	        } 
	        if (canExecute != null)
	        {
	        	this.CanExecute.Combine(canExecute);
			}
		},
		
	       /// <summary> 
        ///     Calls the CanExecute or PreviewCanExecute event based on the event argument's RoutedEvent.
        /// </summary> 
        /// <param name="sender">The sender of the event.</param>
        /// <param name="e">Event arguments.</param>
//        internal void 
        OnCanExecute:function(/*object*/ sender, /*CanExecuteRoutedEventArgs*/ e)
        { 
            if (!e.Handled)
            { 
                if (e.RoutedEvent == CommandManager.CanExecuteEvent) 
                {
                    if (this.CanExecute != null) 
                    {
                        this.CanExecute.Invoke(sender, e);
                        if (e.CanExecute)
                        { 
                            e.Handled = true;
                        } 
                    } 
                    else if (!e.CanExecute)
                    { 
                        // If there is an Executed handler, then the command can be executed.
                        if (this.Executed != null)
                        {
                            e.CanExecute = true; 
                            e.Handled = true;
                        } 
                    } 
                }
                else // e.RoutedEvent == CommandManager.PreviewCanExecuteEvent 
                {
                    if (this.PreviewCanExecute != null)
                    {
                        this.PreviewCanExecute.Invoke(sender, e); 
                        if (e.CanExecute)
                        { 
                            e.Handled = true; 
                        }
                    } 
                }
            }
        },
 
//        private bool 
        CheckCanExecute:function(/*object*/ sender, /*ExecutedRoutedEventArgs*/ e)
        { 
            /*CanExecuteRoutedEventArgs*/
        	var canExecuteArgs = new CanExecuteRoutedEventArgs(e.Command, e.Parameter); 
            canExecuteArgs.RoutedEvent = CommandManager.CanExecuteEvent;
 
            // Since we don't actually raise this event, we have to explicitly set the source.
            canExecuteArgs.Source = e.OriginalSource;
            canExecuteArgs.OverrideSource(e.Source);
 
            this.OnCanExecute(sender, canExecuteArgs);
 
            return canExecuteArgs.CanExecute; 
        },
 
        /// <summary>
        ///     Calls Executed or PreviewExecuted based on the event argument's RoutedEvent.
        /// </summary>
        /// <param name="sender">The sender of the event.</param> 
        /// <param name="e">Event arguments.</param>
//        internal void 
        OnExecuted:function(/*object*/ sender, /*ExecutedRoutedEventArgs*/ e) 
        { 
            if (!e.Handled)
            { 
                if (e.RoutedEvent == CommandManager.ExecutedEvent)
                {
                    if (this.Executed != null)
                    { 
                        if (this.CheckCanExecute(sender, e))
                        { 
                            this.Executed.Invoke(sender, e); 
                            e.Handled = true;
                        } 
                    }
                }
                else // e.RoutedEvent == CommandManager.PreviewExecutedEvent
                { 
                    if (this.PreviewExecuted != null)
                    { 
                        if (this.CheckCanExecute(sender, e)) 
                        {
                            this.PreviewExecuted.Invoke(sender, e); 
                            e.Handled = true;
                        }
                    }
                } 
            }
        }
	});
	
	Object.defineProperties(CommandBinding.prototype,{
        /// <summary>
        ///     Command associated with this binding
        /// </summary> 
//        public ICommand 
        Command: 
        { 
            get:function()
            { 
                return this._command;
            },

            set:function(value) 
            {
                if (value == null) 
                { 
                    throw new Error('ArgumentNullException("value")');
                } 

                this._command = value;
            }
        },
        
        /// <summary>
        ///     Called before the command is executed.
        /// </summary>
//        public event ExecutedRoutedEventHandler 
        PreviewExecuted:
        {
        	get:function(){
            	if(this._PreviewExecuted === undefined){
            		this._PreviewExecuted = new ExecutedRoutedEventHandler();
            	}
            	
            	return this._PreviewExecuted;
        	}
        },

        /// <summary> 
        ///     Called when the command is executed. 
        /// </summary>
//        public event ExecutedRoutedEventHandler 
        Executed:{
        	get:function(){
            	if(this._Executed === undefined){
            		this._Executed = new ExecutedRoutedEventHandler();
            	}
            	
            	return this._Executed;
        	}
        },

        /// <summary>
        ///     Called before determining if the command can be executed.
        /// </summary> 
//        public event CanExecuteRoutedEventHandler 
        PreviewCanExecute:
        {
        	get:function(){
            	if(this._PreviewCanExecute === undefined){
            		this._PreviewCanExecute = new CanExecuteRoutedEventHandler();
            	}
            	
            	return this._PreviewCanExecute;
        	}
        },
 
        /// <summary> 
        ///     Called to determine if the command can be executed.
        /// </summary> 
//        public event CanExecuteRoutedEventHandler 
        CanExecute:
        {
        	get:function(){
            	if(this._CanExecute === undefined){
            		this._CanExecute = new CanExecuteRoutedEventHandler();
            	}
            	
            	return this._CanExecute;
        	}
        }

	});
	
	CommandBinding.Type = new Type("CommandBinding", CommandBinding, [Object.Type]);
	return CommandBinding;
});



