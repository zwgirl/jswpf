/**
 * IInputElement
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var IInputElement = declare("IInputElement", Object,{
		constructor:function(){
		}
	});
	
	
	IInputElement.Type = new Type("IInputElement", IInputElement, [Object.Type], true);
	return IInputElement;
});
//	public interface IInputElement
//	{
//		event MouseButtonEventHandler PreviewMouseLeftButtonDown;
//		event MouseButtonEventHandler MouseLeftButtonDown;
//		event MouseButtonEventHandler PreviewMouseLeftButtonUp;
//		event MouseButtonEventHandler MouseLeftButtonUp;
//		event MouseButtonEventHandler PreviewMouseRightButtonDown;
//		event MouseButtonEventHandler MouseRightButtonDown;
//		event MouseButtonEventHandler PreviewMouseRightButtonUp;
//		event MouseButtonEventHandler MouseRightButtonUp;
//		event MouseEventHandler PreviewMouseMove;
//		event MouseEventHandler MouseMove;
//		event MouseWheelEventHandler PreviewMouseWheel;
//		event MouseWheelEventHandler MouseWheel;
//		event MouseEventHandler MouseEnter;
//		event MouseEventHandler MouseLeave;
//		event MouseEventHandler GotMouseCapture;
//		event MouseEventHandler LostMouseCapture;
//		event StylusDownEventHandler PreviewStylusDown;
//		event StylusDownEventHandler StylusDown;
//		event StylusEventHandler PreviewStylusUp;
//		event StylusEventHandler StylusUp;
//		event StylusEventHandler PreviewStylusMove;
//		event StylusEventHandler StylusMove;
//		event StylusEventHandler PreviewStylusInAirMove;
//		event StylusEventHandler StylusInAirMove;
//		event StylusEventHandler StylusEnter;
//		event StylusEventHandler StylusLeave;
//		event StylusEventHandler PreviewStylusInRange;
//		event StylusEventHandler StylusInRange;
//		event StylusEventHandler PreviewStylusOutOfRange;
//		event StylusEventHandler StylusOutOfRange;
//		event StylusSystemGestureEventHandler PreviewStylusSystemGesture;
//		event StylusSystemGestureEventHandler StylusSystemGesture;
//		event StylusButtonEventHandler StylusButtonDown;
//		event StylusButtonEventHandler PreviewStylusButtonDown;
//		event StylusButtonEventHandler PreviewStylusButtonUp;
//		event StylusButtonEventHandler StylusButtonUp;
//		event StylusEventHandler GotStylusCapture;
//		event StylusEventHandler LostStylusCapture;
//		event KeyEventHandler PreviewKeyDown;
//		event KeyEventHandler KeyDown;
//		event KeyEventHandler PreviewKeyUp;
//		event KeyEventHandler KeyUp;
//		event KeyboardFocusChangedEventHandler PreviewGotKeyboardFocus;
//		event KeyboardFocusChangedEventHandler GotKeyboardFocus;
//		event KeyboardFocusChangedEventHandler PreviewLostKeyboardFocus;
//		event KeyboardFocusChangedEventHandler LostKeyboardFocus;
//		event TextCompositionEventHandler PreviewTextInput;
//		event TextCompositionEventHandler TextInput;
//		bool IsMouseOver
//		{
//			get;
//		}
//		bool IsMouseDirectlyOver
//		{
//			get;
//		}
//		bool IsMouseCaptured
//		{
//			get;
//		}
//		bool IsStylusOver
//		{
//			get;
//		}
//		bool IsStylusDirectlyOver
//		{
//			get;
//		}
//		bool IsStylusCaptured
//		{
//			get;
//		}
//		bool IsKeyboardFocusWithin
//		{
//			get;
//		}
//		bool IsKeyboardFocused
//		{
//			get;
//		}
//		bool IsEnabled
//		{
//			get;
//		}
//		bool Focusable
//		{
//			get;
//			set;
//		}
//		void RaiseEvent(RoutedEventArgs e);
//		void AddHandler(RoutedEvent routedEvent, Delegate handler);
//		void RemoveHandler(RoutedEvent routedEvent, Delegate handler);
//		bool CaptureMouse();
//		void ReleaseMouseCapture();
//		bool CaptureStylus();
//		void ReleaseStylusCapture();
//		bool Focus();
//	}