package org.summer.view.window.interop;
public interface IWin32Window
	{
		IntPtr Handle
		{
//			[UIPermission(SecurityAction.InheritanceDemand, Window = UIPermissionWindow.AllWindows)]
			get;
		}
	}