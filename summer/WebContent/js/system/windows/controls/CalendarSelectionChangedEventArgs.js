/**
 * CalendarSelectionChangedEventArgs
 */

define(["dojo/_base/declare", "system/Type", "controls/SelectionChangedEventArgs"], 
		function(declare, Type, SelectionChangedEventArgs){
	var CalendarSelectionChangedEventArgs = declare("CalendarSelectionChangedEventArgs", SelectionChangedEventArgs,{
		constructor:function(/*RoutedEvent*/ eventId, /*IList*/ removedItems, /*IList*/ addedItems){
		},
//        protected override void 
		InvokeEventHandler:function(/*Delegate*/ genericHandler, /*object*/ genericTarget) 
        {
            /*EventHandler<SelectionChangedEventArgs>*/var handler = 
            	genericHandler instanceof EventHandler/*<SelectionChangedEventArgs>*/ ? genericHandler : null; 
            if (handler != null) 
            {
                handler.Invoke(genericTarget, this); 
            }
            else
            {
            	SelectionChangedEventArgs.prototype.InvokeEventHandler.call(this, genericHandler, genericTarget); 
            }
        } 
	});
	
	CalendarSelectionChangedEventArgs.Type = new Type("CalendarSelectionChangedEventArgs", CalendarSelectionChangedEventArgs, 
			[SelectionChangedEventArgs.Type]);
	return CalendarSelectionChangedEventArgs;
});

