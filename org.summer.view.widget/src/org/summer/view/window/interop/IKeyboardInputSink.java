package org.summer.view.window.interop;

import org.summer.view.widget.input.ModifierKeys;
import org.summer.view.widget.input.TraversalRequest;

public interface IKeyboardInputSink
	{
		IKeyboardInputSite KeyboardInputSite
		{
			get;
//			[SecurityCritical]
//			[UIPermission(SecurityAction.LinkDemand, Unrestricted = true)]
			set;
		}
		
		
//		[SecurityCritical]
//		[UIPermission(SecurityAction.LinkDemand, Unrestricted = true)]
		IKeyboardInputSite RegisterKeyboardInputSink(IKeyboardInputSink sink);
		
		
//		[SecurityCritical]
//		[UIPermission(SecurityAction.LinkDemand, Unrestricted = true)]
		boolean TranslateAccelerator(/*ref*/ MSG msg, ModifierKeys modifiers);
		
		boolean TabInto(TraversalRequest request);
		
		
//		[SecurityCritical]		
//		[UIPermission(SecurityAction.LinkDemand, Unrestricted = true)]
		boolean OnMnemonic(r/*ref*/ef MSG msg, ModifierKeys modifiers);
		
//		[SecurityCritical]
//		[UIPermission(SecurityAction.LinkDemand, Unrestricted = true)]
		boolean TranslateChar(/*ref*/ MSG msg, ModifierKeys modifiers);
		boolean HasFocusWithin();
	}