package org.summer.view.widget.markup;

import org.summer.view.widget.IServiceProvider;

public abstract class MarkupExtension
{
	public abstract Object ProvideValue (IServiceProvider serviceProvider);
}