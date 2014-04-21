/**
 * ContextMenuEventArgs
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutedEventArgs"], function(declare, Type){
	var ContextMenuEventArgs = declare("ContextMenuEventArgs", RoutedEventArgs,{
		constructor:function(/*object*/ source, /*bool*/ opening, /*double*/ left, /*double*/ top) 
        {
			if(left === undefined){
				left = -1.0;
			}
			
			if(top === undefined){
				top = -1.0;
			}
			
			this._targetElement = null;
            this._left = left; 
            this._top = top; 
            this.RoutedEvent =(opening ? ContextMenuService.ContextMenuOpeningEvent : ContextMenuService.ContextMenuClosingEvent);
            this.Source = source; 
        },
        
        /// <summary> 
        /// Support DynamicInvoke for ContextMenuEvent
        /// </summary> 
        /// <param name="genericHandler"></param>
        /// <param name="genericTarget"></param>
//        protected override void 
        InvokeEventHandler:function(/*Delegate*/ genericHandler, /*object*/ genericTarget)
        { 
            /*ContextMenuEventHandler*/var handler = /*(ContextMenuEventHandler)*/genericHandler;
            handler.Invoke(genericTarget, this); 
        } 
	});
	
	Object.defineProperties(ContextMenuEventArgs.prototype,{
	       /// <summary>
        ///     Position (horizontal) that context menu should displayed 
        /// </summary>
//        public double 
        CursorLeft: 
        { 
            get:function() { return this._left; }
        },

        /// <summary>
        /// Position (vertical) that context menu should displayed
        /// </summary> 
//        public double 
        CursorTop:
        { 
            get:function() { return this._top; } 
        },
 
//        internal DependencyObject 
        TargetElement:
        {
            get:function() { return this._targetElement; },
            set:function(value) { this._targetElement = value; } 
        }
	});
	
	ContextMenuEventArgs.Type = new Type("ContextMenuEventArgs", ContextMenuEventArgs, [RoutedEventArgs.Type]);
	return ContextMenuEventArgs;
});
