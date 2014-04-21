package org.summer.view.widget;
public interface IInputElement
	{
		void AddHandler (RoutedEvent routedEvent, Delegate handler);
		boolean CaptureMouse ();
		boolean CaptureStylus ();
		boolean Focus ();
		void RaiseEvent (RoutedEventArgs e);
		void ReleaseMouseCapture ();
		void ReleaseStylusCapture ();
		void RemoveHandler (RoutedEvent routedEvent, Delegate handler);

		boolean Focusable { get; set; }
		boolean IsEnabled { get; }
		boolean IsKeyboardFocused { get; }
		boolean IsKeyboardFocusWithin { get; }
		boolean IsMouseCaptured { get; }
		boolean IsMouseDirectlyOver { get; }
		boolean IsMouseOver { get; }
		boolean IsStylusCaptured { get; }
		boolean IsStylusDirectlyOver { get; }
		boolean IsStylusOver { get; }

		/*event*/ KeyboardFocusChangedEventHandler GotKeyboardFocus;
		/*event*/ MouseEventHandler GotMouseCapture;
		/*event*/ StylusEventHandler GotStylusCapture;
		/*event*/ KeyEventHandler KeyDown;
		/*event*/ KeyEventHandler KeyUp;
		/*event*/ KeyboardFocusChangedEventHandler LostKeyboardFocus;
		/*event*/ MouseEventHandler LostMouseCapture;
		/*event*/ StylusEventHandler LostStylusCapture;
		/*event*/ MouseEventHandler MouseEnter;
		/*event*/ MouseEventHandler MouseLeave;
		/*event*/ MouseButtonEventHandler MouseLeftButtonDown;
		/*event*/ MouseButtonEventHandler MouseLeftButtonUp;
		/*event*/ MouseEventHandler MouseMove;
		/*event*/ MouseButtonEventHandler MouseRightButtonDown;
		/*event*/ MouseButtonEventHandler MouseRightButtonUp;
 		/*event*/ MouseWheelEventHandler MouseWheel;
		/*event*/ KeyboardFocusChangedEventHandler PreviewGotKeyboardFocus;
		/*event*/ KeyEventHandler PreviewKeyDown;
		/*event*/ KeyEventHandler PreviewKeyUp;
		/*event*/ KeyboardFocusChangedEventHandler PreviewLostKeyboardFocus;
		/*event*/ MouseButtonEventHandler PreviewMouseLeftButtonDown;
		/*event*/ MouseButtonEventHandler PreviewMouseLeftButtonUp;
		/*event*/ MouseEventHandler PreviewMouseMove;
		/*event*/ MouseButtonEventHandler PreviewMouseRightButtonDown;
		/*event*/ MouseButtonEventHandler PreviewMouseRightButtonUp;
		/*event*/ MouseWheelEventHandler PreviewMouseWheel;
		/*event*/ StylusButtonEventHandler PreviewStylusButtonDown;
		/*event*/ StylusButtonEventHandler PreviewStylusButtonUp;
		/*event*/ StylusDownEventHandler PreviewStylusDown;
		/*event*/ StylusEventHandler PreviewStylusInAirMove;
		/*event*/ StylusEventHandler PreviewStylusInRange;
		/*event*/ StylusEventHandler PreviewStylusMove;
		/*event*/ StylusEventHandler PreviewStylusOutOfRange;
		/*event*/ StylusSystemGestureEventHandler PreviewStylusSystemGesture;
		/*event*/ StylusEventHandler PreviewStylusUp;
		/*event*/ TextCompositionEventHandler PreviewTextInput;
		/*event*/ StylusButtonEventHandler StylusButtonDown;
		/*event*/ StylusButtonEventHandler StylusButtonUp;
		/*event*/ StylusDownEventHandler StylusDown;
		/*event*/ StylusEventHandler StylusEnter;
		/*event*/ StylusEventHandler StylusInAirMove;
		/*event*/ StylusEventHandler StylusInRange;
		/*event*/ StylusEventHandler StylusLeave;
		/*event*/ StylusEventHandler StylusMove;
		/*event*/ StylusEventHandler StylusOutOfRange;
		/*event*/ StylusSystemGestureEventHandler StylusSystemGesture;
		/*event*/ StylusEventHandler StylusUp;
		/*event*/ TextCompositionEventHandler TextInput;
	}