package org.summer.view.widget.xaml;
public interface IXamlLineInfo
	{
		boolean HasLineInfo { get; }
		int LineNumber { get; }
		int LinePosition { get; }
	}