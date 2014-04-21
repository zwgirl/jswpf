/**
 * FindToolTipEventArgs
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutedEventArgs"], function(declare, Type, RoutedEventArgs){
	var FindToolTipEventArgs = declare("FindToolTipEventArgs", RoutedEventArgs,{
		constructor:function()
        { 
			this.RoutedEvent = ToolTipService.FindToolTipEvent;
			this._keepCurrentActive = false;
			this._targetElement = null;
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
	
	Object.defineProperties(FindToolTipEventArgs.prototype, {
//       internal DependencyObject 
       TargetElement:
       { 
           get:function() { return this._targetElement; }, 
           set:function(value) { this._targetElement = value; }
       },

//       internal bool 
       KeepCurrentActive:
       {
    	   get:function() { return this._keepCurrentActive; }, 
    	   set:function(value) { this._keepCurrentActive = value; }
       } 		
	});
	
	FindToolTipEventArgs.Type = new Type("FindToolTipEventArgs", FindToolTipEventArgs, [RoutedEventArgs.Type]);
	return FindToolTipEventArgs;
});
