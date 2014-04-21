package org.summer.view.widget.xaml;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.EventArgs;

public class XamlObjectEventArgs extends EventArgs
	{
		public XamlObjectEventArgs (Object instance)
		{
			if (instance == null)
				throw new ArgumentNullException ("instance");
			Instance = instance;
		}

		public Object Instance { get; private set; }
	}
