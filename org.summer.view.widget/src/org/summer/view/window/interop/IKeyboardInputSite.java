package org.summer.view.window.interop;

import org.summer.view.widget.input.TraversalRequest;

public interface IKeyboardInputSite
{
	IKeyboardInputSink Sink
	{
		get;
	}
//	[SecurityCritical]
//	[UIPermission(SecurityAction.LinkDemand, Unrestricted = true)]
	void Unregister();
	
	boolean OnNoMoreTabStops(TraversalRequest request);
}