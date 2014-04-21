package org.summer.view.widget.markup;

import org.summer.view.widget.IServiceProvider;
import org.summer.view.widget.Type;
import org.summer.view.widget.model.ITypeDescriptorContext;
import org.summer.view.widget.model.PropertyDescriptor;

public interface IValueSerializerContext extends ITypeDescriptorContext, IServiceProvider
	{
		ValueSerializer GetValueSerializerFor (PropertyDescriptor descriptor);
		ValueSerializer GetValueSerializerFor (Type type);
	}