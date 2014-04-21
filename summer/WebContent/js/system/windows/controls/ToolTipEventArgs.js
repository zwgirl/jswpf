/**
 * ToolTipEventArgs
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutedEventArgs"], function(declare, Type, RoutedEventArgs){
	var ToolTipEventArgs = declare("ToolTipEventArgs", RoutedEventArgs,{
		constructor:function(/*bool*/ opening)
        { 
            if (opening)
            {
                this.RoutedEvent = ToolTipService.ToolTipOpeningEvent;
            } 
            else
            { 
            	this.RoutedEvent = ToolTipService.ToolTipClosingEvent; 
            }
		},
        /// <summary>
        ///     Invokes the event handler.
        /// </summary> 
        /// <param name="genericHandler">The delegate to call.</param>
        /// <param name="genericTarget">The target of the event.</param> 
//        protected override void 
        InvokeEventHandler:function(/*Delegate*/ genericHandler, /*object*/ genericTarget) 
        {
            genericHandler.Invoke(genericTarget, this);
        }
	});
	
	ToolTipEventArgs.Type = new Type("ToolTipEventArgs", ToolTipEventArgs, [RoutedEventArgs.Type]);
	return ToolTipEventArgs;
});
