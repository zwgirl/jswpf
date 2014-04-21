package org.summer.view.widget.xaml.schema;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.reflection.MethodInfo;
import org.summer.view.widget.xaml.XamlDirective;
import org.summer.view.widget.xaml.XamlMember;

public class XamlMemberInvoker
	{
		static final XamlMemberInvoker unknown = new XamlMemberInvoker ();
		public static XamlMemberInvoker UnknownInvoker {
			get { return unknown; }
		}

		protected XamlMemberInvoker ()
		{
		}

		public XamlMemberInvoker (XamlMember member)
		{
			if (member == null)
				throw new ArgumentNullException ("member");
			this.member = member;
		}

		XamlMember member;

		public MethodInfo UnderlyingGetter {
			get { return member != null ? member.UnderlyingGetter : null; }
		}

		public MethodInfo UnderlyingSetter {
			get { return member != null ? member.UnderlyingSetter : null; }
		}

		void ThrowIfUnknown ()
		{
			if (member == null)
				throw new NotSupportedException ("Current operation is invalid for unknown member.");
		}

		public /*virtual*/ Object GetValue (Object instance)
		{
			ThrowIfUnknown ();
			if (instance == null)
				throw new ArgumentNullException ("instance");
			if (member instanceof XamlDirective)
				throw new NotSupportedException (String.Format ("not supported operation on directive member {0}", member));
			if (UnderlyingGetter == null)
				throw new NotSupportedException (String.Format ("Attempt to get value from write-only property or event {0}", member));
			return UnderlyingGetter.Invoke (instance, new Object [0]);
		}
		public /*virtual*/ void SetValue (Object instance, Object value)
		{
			ThrowIfUnknown ();
			if (instance == null)
				throw new ArgumentNullException ("instance");
			if (member instanceof XamlDirective)
				throw new NotSupportedException (String.Format ("not supported operation on directive member {0}", member));
			if (UnderlyingSetter == null)
				throw new NotSupportedException (String.Format ("Attempt to set value from read-only property {0}", member));
			if (member.IsAttachable)
				UnderlyingSetter.Invoke (null, new Object [] {instance, value});
			else
				UnderlyingSetter.Invoke (instance, new Object [] {value});
		}

		public /*virtual*/ ShouldSerializeResult ShouldSerializeValue (Object instance)
		{
			throw new NotImplementedException ();
		}
	}