/// <summary>
///     This delegate must used by handlers of the DragCompleted event.
/// </summary> 
/// <param name="sender">The current element along the event's route.</param>
/// <param name="e">The event arguments containing additional information about the event.</param> 
/// <returns>Nothing.</returns> 

/**
 * from DragCompletedEventArgs
 * DragCompletedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var DragCompletedEventHandler = declare("DragCompletedEventHandler", Delegate,{
		constructor:function(target, method){
			
		}
	});

	DragCompletedEventHandler.Type = new Type("DragCompletedEventHandler", DragCompletedEventHandler, [Delegate.Type]);
	return DragCompletedEventHandler;
});

//public delegate void DragCompletedEventHandler(object sender, DragCompletedEventArgs e);