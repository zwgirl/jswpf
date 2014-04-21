/**
 * CanExecuteRoutedEventArgs
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutedEventArgs"], 
		function(declare, Type, RoutedEventArgs){
	var CanExecuteRoutedEventArgs = declare("CanExecuteRoutedEventArgs", RoutedEventArgs,{
		constructor:function(/*ICommand*/ command, /*object*/ parameter)
        {
            if (command == null) 
            {
                throw new ArgumentNullException("command"); 
            } 

            this._command = command; 
            this._parameter = parameter;
            
//            private bool 
            this._canExecute = false;       // Defaults to false
//            private bool 
            this._continueRouting = false;  // Defaults to false
        },
        
        /// <summary>
        ///     Calls the handler.
        /// </summary> 
        /// <param name="genericHandler">Handler delegate to invoke</param>
        /// <param name="target">Target element</param> 
//        protected override void 
        InvokeEventHandler:function(/*Delegate*/ genericHandler, /*object*/ target) 
        {
            /*CanExecuteRoutedEventHandler*/var handler = genericHandler; 
            handler.Invoke(target instanceof DependencyObject ? target : null, this);
        }
	});
	
	Object.defineProperties(CanExecuteRoutedEventArgs.prototype,{
        /// <summary>
        ///     The command that could be executed. 
        /// </summary>
//        public ICommand 
		Command:
        {
            get:function() { return this._command; } 
        },
 
        /// <summary> 
        ///     The parameter passed when considering executing the command.
        /// </summary> 
//        public object 
		Parameter:
        {
            get:function() { return this._parameter; }
        },
        

        /// <summary> 
        ///     Whether the command with the specified parameter can be executed. 
        /// </summary>
//        public bool 
        CanExecute: 
        {
            get:function() { return this._canExecute; },
            set:function(value) { this._canExecute = value; }
        }, 

        /// <summary> 
        ///     Whether the input event (if any) that caused the command 
        ///     should continue its route.
        /// </summary> 
//        public bool 
        ContinueRouting:
        {
            get:function() { return this._continueRouting; },
            set:function(value) { this._continueRouting = value; } 
        }
	});
	
	Object.defineProperties(CanExecuteRoutedEventArgs,{
		  
	});
	
	CanExecuteRoutedEventArgs.Type = new Type("CanExecuteRoutedEventArgs", CanExecuteRoutedEventArgs, [RoutedEventArgs.Type]);
	return CanExecuteRoutedEventArgs;
});

 
