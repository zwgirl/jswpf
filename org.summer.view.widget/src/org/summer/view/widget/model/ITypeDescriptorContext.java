package org.summer.view.widget.model;

import org.summer.view.widget.IServiceProvider;

//[ComVisible (true)]
	public interface ITypeDescriptorContext extends IServiceProvider
	{
		IContainer Container { get; }

		Object Instance { get; }

		PropertyDescriptor PropertyDescriptor { get; }

		void OnComponentChanged ();

		boolean OnComponentChanging ();
	}