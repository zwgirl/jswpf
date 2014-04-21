package org.summer.view.widget.xaml;
public interface IXamlLineInfoConsumer
	{
		boolean ShouldProvideLineInfo { get; }
		void SetLineInfo (int lineNumber, int linePosition);
	}