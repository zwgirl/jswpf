package org.summer.view.widget.xaml;

import org.summer.view.widget.collection.Dictionary;
import org.summer.view.widget.markup.INameScope;

class NameScope implements INameScope
	{
		Dictionary<String,Object> table = new Dictionary<String,Object> ();
		// It is an external read-only namescope.
		INameScope external;

		public NameScope (INameScope external)
		{
			this.external = external;
		}

		public Object FindName (String name)
		{
			Object obj = external != null ? external.FindName (name) : null;
			if (obj != null)
				return obj;
			return table.TryGetValue (name, /*out*/ obj) ? obj : null;
		}

		public void RegisterName (String name, Object scopedElement)
		{
			table.Add (name, scopedElement);
		}

		public void UnregisterName (String name)
		{
			table.Remove (name);
		}
	}