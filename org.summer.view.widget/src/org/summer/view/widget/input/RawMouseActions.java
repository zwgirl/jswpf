package org.summer.view.widget.input;
//[Flags]
	/*internal*/ public enum RawMouseActions
	{
		None ,//= 0,
		AttributesChanged ,//= 1,
		Activate ,//= 2,
		Deactivate ,//= 4,
		RelativeMove ,//= 8,
		AbsoluteMove ,//= 16,
		VirtualDesktopMove ,//= 32,
		Button1Press ,//= 64,
		Button1Release ,//= 128,
		Button2Press ,//= 256,
		Button2Release ,//= 512,
		Button3Press ,//= 1024,
		Button3Release ,//= 2048,
		Button4Press ,//= 4096,
		Button4Release ,//= 8192,
		Button5Press ,//= 16384,
		Button5Release ,//= 32768,
		VerticalWheelRotate ,//= 65536,
		HorizontalWheelRotate ,//= 131072,
		QueryCursor ,//= 262144,
		CancelCapture ,//= 524288
	}