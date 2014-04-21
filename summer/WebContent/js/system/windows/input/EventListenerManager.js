/**
 * EventListenerManager
 */

define(["dojo/_base/declare", "system/Type", "input/MouseEventArgs", "input/MouseButtonEventArgs",
        "input/KeyboardEventArgs", "input/Keyboard", "controls/PopupControlService"], 
		function(declare, Type, MouseEventArgs, MouseButtonEventArgs,
				KeyboardEventArgs, Keyboard, PopupControlService){
	
	var EventListenerManager = declare("EventListenerManager", Object,{
		constructor:function()
        { 
		}

	});
	
	EventListenerManager.AddDefaultEventListeners = function(dom)
    { 
		//to WPF MouseEnterEvent
		dom.addEventListener("mouseover", function(event){
//			alert("MouseEnterEvent");
			event.stopPropagation();
			var mouseEventArgs = new MouseEventArgs(event);
			mouseEventArgs.RoutedEvent = Mouse.MouseEnterEvent;
			InputManager.Current.PrimaryMouseDevice.ChangeMouseOver(this._source, event.timeStamp);
//			
			mouseEventArgs.Source = this._source;
			this._source.RaiseEvent(mouseEventArgs);
			return false;
		});
		
		dom.addEventListener("mouseover", PopupControlService.Current.OnPostProcessInput1);
		
		//to WPF MouseMoveEvent
		dom.addEventListener("mousemove", function(event){
//			alert("MouseMoveEvent");
			event.stopPropagation();
			var mouseEventArgs = new MouseEventArgs(event);
			mouseEventArgs.RoutedEvent = Mouse.PreviewMouseMoveEvent;
//			InputManager.Current.PrimaryMouseDevice.ReevaluateMouseOver(null, null, true);
//			
//			UIElement.MouseOverProperty.OnOriginValueChanged(_mouseOver, _mouseOver, ref _mouseOverTreeState);
			mouseEventArgs.Source = this._source;
			this._source.RaiseEvent(mouseEventArgs);
			
			mouseEventArgs.OverrideRoutedEvent(Mouse.MouseMoveEvent);
			this._source.RaiseEvent(mouseEventArgs);
			return false;
		});
		
		//to WPF MouseLeaveEvent
		dom.addEventListener("mouseout", function(event){
//			alert("MouseLeaveEvent");
			event.stopPropagation();
			var mouseEventArgs = new MouseEventArgs(event);
			mouseEventArgs.RoutedEvent = Mouse.MouseLeaveEvent;
//			InputManager.Current.PrimaryMouseDevice.ReevaluateMouseOver(null, null, true);
//			
//			UIElement.MouseOverProperty.OnOriginValueChanged(_mouseOver, _mouseOver, ref _mouseOverTreeState);
			mouseEventArgs.Source = this._source;
			this._source.RaiseEvent(mouseEventArgs);
			return false;
		});
		
		//to WPF MouseDownEvent
		dom.addEventListener("mousedown", function(event){
			event.stopPropagation();
			event.preventDefault();
//			alert("MouseDownEvent");
			var mouseEventArgs = new MouseButtonEventArgs(event, 1);
			mouseEventArgs.RoutedEvent = Mouse.PreviewMouseDownEvent;
			mouseEventArgs.Source = this._source;
			this._source.RaiseEvent(mouseEventArgs);
			
			mouseEventArgs.OverrideRoutedEvent(Mouse.MouseDownEvent);
			this._source.RaiseEvent(mouseEventArgs);
			return false;
		}, false);

		//to WPF MouseUpEvent
		dom.addEventListener("mouseup", function(event){
			event.stopPropagation();
//			alert("MouseUpEvent");
			var mouseEventArgs = new MouseButtonEventArgs(event, 0);
			mouseEventArgs.RoutedEvent = Mouse.PreviewMouseUpEvent;
			mouseEventArgs.Source = this._source;
			this._source.RaiseEvent(mouseEventArgs);
			
			mouseEventArgs.OverrideRoutedEvent(Mouse.MouseUpEvent);
			this._source.RaiseEvent(mouseEventArgs);
			return false;

		}, false);
		
		//to WPF MouseWheelEvent
		dom.addEventListener("mousewheel", function(event){
			event.stopPropagation();
//			alert("MouseWheelEvent");
			var mouseEventArgs = new MouseWheelEventArgs(event);
			mouseEventArgs.RoutedEvent = Mouse.MouseWheelEvent;
			mouseEventArgs.Source = this._source;
			this._source.RaiseEvent(mouseEventArgs);
			
			mouseEventArgs.OverrideRoutedEvent(Mouse.PreviewMouseWheelEvent);
			this._source.RaiseEvent(mouseEventArgs);
			return false;

		}, false);
		
//		//to WPF KeyDownEvent
		dom.addEventListener("keydown", function(event){
			event.stopPropagation();
			event.preventDefault();
//			console.log("onkeydown");
			var keyEventArgs = new KeyEventArgs(event);
			keyEventArgs.RoutedEvent = Keyboard.PreviewKeyDownEvent;
			keyEventArgs.Source = this._source;
			this._source.RaiseEvent(keyEventArgs);
			
			keyEventArgs.OverrideRoutedEvent(Keyboard.KeyDownEvent);
			this._source.RaiseEvent(keyEventArgs);
			
			KeyboardNavigation.Current.ProcessInput(keyEventArgs);
			
			return false;

		}, false);
		
		
		//to WPF KeyUpEvent
		dom.addEventListener("keyup", function(event){
			event.stopPropagation();
			event.preventDefault();
//			console.log("onkeyup");
			var keyEventArgs = new KeyEventArgs(event);
			keyEventArgs.RoutedEvent = Keyboard.PreviewKeyUpEvent;
			keyEventArgs.Source = this._source;
			this._source.RaiseEvent(keyEventArgs);
			
			keyEventArgs.OverrideRoutedEvent(Keyboard.KeyUpEvent);
			this._source.RaiseEvent(keyEventArgs);
			
			return false;

		}, false);
    };
	
	EventListenerManager.AddEventListeners = function(element)
    { 
		element.AddDomEventListener();
    };
	
	EventListenerManager.Type = new Type("EventListenerManager", EventListenerManager, [Object.Type]);
	return EventListenerManager;
});
