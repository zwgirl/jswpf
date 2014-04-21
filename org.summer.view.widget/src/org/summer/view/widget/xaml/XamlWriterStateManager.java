package org.summer.view.widget.xaml;

import java.rmi.activation.Activator;

///*internal*/public class XamlWriterStateManager<TError,TNSError> extends XamlWriterStateManager
////		where TError : Exception
////		where TNSError : Exception
//	{
//		public XamlWriterStateManager (boolean isXmlWriter)
//		{
//			: this (isXmlWriter);
//		}
//
//		public /*override*/ Exception CreateError (String msg)
//		{
//			return (Exception) Activator.CreateInstance (typeof (TError), new Object [] {msg});
//		}
//
//		public /*override*/ Exception CreateNamespaceError (String msg)
//		{
//			return (Exception) Activator.CreateInstance (typeof (TNSError), new Object [] {msg});
//		}
//	}



	/*internal*/public /*abstract*/ class XamlWriterStateManager
	{
		public XamlWriterStateManager (boolean isXmlWriter)
		{
			allow_ns_at_value = isXmlWriter;
			allow_object_after_value = isXmlWriter;
			allow_parallel_values = !isXmlWriter;
			allow_empty_member = !isXmlWriter;
			allow_multiple_results = !isXmlWriter;
		}

		// configuration
		boolean allow_ns_at_value, allow_object_after_value, allow_parallel_values, allow_empty_member, allow_multiple_results;

		// state
		XamlWriteState state = XamlWriteState.Initial;
		boolean ns_pushed;
		boolean accept_multiple_values; // It is PositionalParameters-specific state.

		public XamlWriteState State {
			get { return state; }
		}

		// FIXME: actually this property is a hack. It should preserve stacked flag values for each nested member in current tree state.
		public boolean AcceptMultipleValues {
			get { return accept_multiple_values; }
			set { accept_multiple_values = value; }
		}

		public void OnClosingItem ()
		{
			// somewhat hacky state change to not reject StartMember->EndMember.
			if (state == XamlWriteState.MemberStarted)
				state = XamlWriteState.ValueWritten;
		}

		public void EndMember ()
		{
			RejectNamespaces (XamlNodeType.EndMember);
			CheckState (XamlNodeType.EndMember);
			state = XamlWriteState.MemberDone;
		}

		public void EndObject (boolean hasMoreNodes)
		{
			RejectNamespaces (XamlNodeType.EndObject);
			CheckState (XamlNodeType.EndObject);
			state = hasMoreNodes ? XamlWriteState.ObjectWritten : allow_multiple_results ? XamlWriteState.Initial : XamlWriteState.End;
		}

		public void GetObject ()
		{
			CheckState (XamlNodeType.GetObject);
			RejectNamespaces (XamlNodeType.GetObject);
			state = XamlWriteState.MemberDone;
		}

		public void StartMember ()
		{
			CheckState (XamlNodeType.StartMember);
			state = XamlWriteState.MemberStarted;
			ns_pushed = false;
		}

		public void StartObject ()
		{
			CheckState (XamlNodeType.StartObject);
			state = XamlWriteState.ObjectStarted;
			ns_pushed = false;
		}

		public void Value ()
		{
			CheckState (XamlNodeType.Value);
			RejectNamespaces (XamlNodeType.Value);
			state = XamlWriteState.ValueWritten;
		}

		public void Namespace ()
		{
			if (!allow_ns_at_value && (state == XamlWriteState.ValueWritten || state == XamlWriteState.ObjectStarted))
				throw CreateError (String.Format ("Namespace declarations cannot be written at {0} state", state));
			ns_pushed = true;
		}

		public void NamespaceCleanedUp ()
		{
			ns_pushed = false;
		}

		void CheckState (XamlNodeType next)
		{
			switch (state) {
			case XamlWriteState.Initial:
				switch (next) {
				case XamlNodeType.StartObject:
					return;
				}
				break;
			case XamlWriteState.ObjectStarted:
				switch (next) {
				case XamlNodeType.StartMember:
				case XamlNodeType.EndObject:
					return;
				}
				break;
			case XamlWriteState.MemberStarted:
				switch (next) {
				case XamlNodeType.StartObject:
				case XamlNodeType.Value:
				case XamlNodeType.GetObject:
					return;
				case XamlNodeType.EndMember:
					if (allow_empty_member)
						return;
					break;
				}
				break;
			case XamlWriteState.ObjectWritten:
				switch (next) {
				case XamlNodeType.StartObject:
				case XamlNodeType.Value:
				case XamlNodeType.EndMember:
					return;
				}
				break;
			case XamlWriteState.ValueWritten:
				switch (next) {
				case XamlNodeType.Value:
					if (allow_parallel_values | accept_multiple_values)
						return;
					break;
				case XamlNodeType.StartObject:
					if (allow_object_after_value)
						return;
					break;
				case XamlNodeType.EndMember:
					return;
				}
				break;
			case XamlWriteState.MemberDone:
				switch (next) {
				case XamlNodeType.StartMember:
				case XamlNodeType.EndObject:
					return;
				}
				break;
			}
			throw CreateError (String.Format ("{0} is not allowed at current state {1}", next, state));
		}

		void RejectNamespaces (XamlNodeType next)
		{
			if (ns_pushed) {
				// strange, but on WriteEndMember it throws XamlXmlWriterException, while for other nodes it throws IOE.
				String msg = String.Format ("Namespace declarations cannot be written before {0}", next);
				if (next == XamlNodeType.EndMember)
					throw CreateError (msg);
				else
					throw CreateNamespaceError (msg);
			}
		}

//		public abstract Exception CreateError (String msg);
//		public abstract Exception CreateNamespaceError (String msg);
		
		public /*override*/ Exception CreateError (String msg)
		{
			return (Exception) Activator.CreateInstance (typeof (TError), new Object [] {msg});
		}

		public /*override*/ Exception CreateNamespaceError (String msg)
		{
			return (Exception) Activator.CreateInstance (typeof (TNSError), new Object [] {msg});
		}
	}