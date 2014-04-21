package org.summer.view.widget.xaml;
/*internal*/ public class XamlObject
	{
		public XamlObject (XamlType type, Object instance)
			: this (type, new InstanceContext (instance))
		{
		}

		public XamlObject (XamlType type, InstanceContext context)
		{
			this.type = type;
			this.context = context;
		}

		final XamlType type;
		final InstanceContext context;

		public XamlType Type {
			get { return type; }
		}

		public InstanceContext Context {
			get { return context; }
		}

		XamlType GetType (Object obj)
		{
			return type.SchemaContext.GetXamlType (obj.GetType ());
		}

		public Object GetRawValue ()
		{
			return context.GetRawValue ();
		}
	}