/**
 * ExecutedRoutedEventArgs
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutedEventArgs", "windows/DependencyObject"], 
		function(declare, Type, RoutedEventArgs, DependencyObject){
	var ExecutedRoutedEventArgs = declare("ExecutedRoutedEventArgs", RoutedEventArgs,{
		constructor:function(/*ICommand*/ command, /*object*/ parameter)
        {
            if (command == null) 
            {
                throw new ArgumentNullException("command"); 
            } 

            this._command = command; 
            this._parameter = parameter;
        },
        /// <summary>
        ///     Calls the handler.
        /// </summary>
        /// <param name="genericHandler">Handler delegate to invoke</param> 
        /// <param name="target">Target element</param>
//        protected override void 
        InvokeEventHandler:function(/*Delegate*/ genericHandler, /*object*/ target) 
        { 
            /*ExecutedRoutedEventHandler*/var handler = genericHandler;
            handler.Invoke(target instanceof DependencyObject ? target : null, this); 
        }
	});
	
	Object.defineProperties(ExecutedRoutedEventArgs.prototype,{
		   /// <summary>
        ///     The command being executed. 
        /// </summary>
//        public ICommand 
		Command:
        {
            get:function() { return this._command; } 
        },
 
        /// <summary> 
        ///     The parameter passed when executing the command.
        /// </summary> 
//        public object 
		Parameter:
        {
            get:function() { return this._parameter; }
        }   
	});
	
	Object.defineProperties(ExecutedRoutedEventArgs,{
		  
	});
	
	ExecutedRoutedEventArgs.Type = new Type("ExecutedRoutedEventArgs", ExecutedRoutedEventArgs, [RoutedEventArgs.Type]);
	return ExecutedRoutedEventArgs;
});
