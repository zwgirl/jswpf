/**
 * CommandBindingCollection
 */

define(["dojo/_base/declare", "system/Type", "input/RoutedCommand", "generic/List"], 
		function(declare, Type, RoutedCommand, List){
	var CommandBindingCollection = declare("CommandBindingCollection", List,{
		
//	     internal ICommand 
	    FindMatchCommand:function(/*object*/ targetElement, /*InputEventArgs*/ inputEventArgs) 
        {
            for (var i = 0; i < Count; i++) 
            {
                /*CommandBinding*/
            	var commandBinding = this.Get(i);
                /*RoutedCommand*/
            	var routedCommand = commandBinding.Command;
                routedCommand = routedCommand instanceof RoutedCommand ? routedCommand : null;
                if (routedCommand != null) 
                {
                    /*InputGestureCollection*/
                	var inputGestures = routedCommand.InputGesturesInternal; 
                    if (inputGestures != null) 
                    {
                        if (inputGestures.FindMatch(targetElement, inputEventArgs) != null) 
                        {
                            return routedCommand;
                        }
                    } 
                }
            } 
 
            return null;
        },

//	        internal CommandBinding 
        FindMatchCommandBinding:function(/*ICommand*/ command, indexRef/*ref int index*/)
        {
            while (indexRef.index < Count) 
            {
                /*CommandBinding*/
            	var commandBinding = this.Get(indexRef.index++); 
                if (commandBinding.Command == command) 
                {
                    return commandBinding; 
                }
            }

            return null; 
        }
	});
	
	Object.defineProperties(CommandBindingCollection.prototype,{
	});
	
	CommandBindingCollection.Type = new Type("CommandBindingCollection", CommandBindingCollection, [List.Type]);
	return CommandBindingCollection;
});
