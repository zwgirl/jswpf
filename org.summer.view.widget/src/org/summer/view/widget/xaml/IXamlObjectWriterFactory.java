package org.summer.view.widget.xaml;

public interface IXamlObjectWriterFactory {
	XamlObjectWriterSettings GetParentSettings();
	
	XamlObjectWriter GetXamlObjectWriter(
			XamlObjectWriterSettings settings
		);
}
