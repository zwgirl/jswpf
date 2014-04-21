package org.summer.view.widget.markup;

import org.summer.view.widget.EventArgs;
import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.xaml.XamlMember;

public class XamlSetValueEventArgs extends EventArgs
	{
		public XamlSetValueEventArgs (XamlMember member, Object value)
		{
			Member = member;
			Value = value;
		}

		public boolean Handled { get; set; }
		public XamlMember Member { get; private set; }
		public Object Value { get; private set; }

		public /*virtual*/ void CallBase ()
		{
			throw new NotImplementedException ();
		}
	}