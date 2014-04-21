/**
 * MouseOverProperty
 */

define(["dojo/_base/declare", "system/Type", "windows/ReverseInheritProperty", "windows/CoreFlags"], 
		function(declare, Type, ReverseInheritProperty, CoreFlags){
	var UIElement =null;
	function EnsureUIElement(){
		if(UIElement == null){
			UIElement = using("windows/UIElement");
		}
		return UIElement;
	}
	
	var MouseOverProperty = declare("MouseOverProperty", ReverseInheritProperty,{
   	 	"-chains-": {
	      constructor: "manual"
	    },
		constructor:function(){
			ReverseInheritProperty.prototype.constructor.call(this, 
					EnsureUIElement().IsMouseOverPropertyKey, 
					CoreFlags.IsMouseOverCache,
					CoreFlags.IsMouseOverChanged);
		},
		
//		 internal override void 
		FireNotifications:function(element, /*bool*/ oldValue)
        { 
            // Before we fire the mouse event we need to figure if the notification is still relevant.
            // This is because it is possible that the mouse state has changed during the previous 
            // property engine callout. Example: Consider a MessageBox being displayed during the 
            // IsMouseOver OnPropertyChanged override.
 
            var shouldFireNotification = false;
            shouldFireNotification = (!oldValue && element.IsMouseOver) || (oldValue && !element.IsMouseOver); 

//            if (shouldFireNotification) 
//            { 
//                var mouseEventArgs = new MouseEventArgs(Mouse.PrimaryDevice, Environment.TickCount, Mouse.PrimaryDevice.StylusDevice);
//                mouseEventArgs.RoutedEvent = oldValue ? Mouse.MouseLeaveEvent : Mouse.MouseEnterEvent; 
//
//                element.RaiseEvent(mouseEventArgs); 
//            }
        } 
	});
	
	MouseOverProperty.Type = new Type("MouseOverProperty", MouseOverProperty, [ReverseInheritProperty.Type]);
	return MouseOverProperty;
});
 
        /////////////////////////////////////////////////////////////////////

       

