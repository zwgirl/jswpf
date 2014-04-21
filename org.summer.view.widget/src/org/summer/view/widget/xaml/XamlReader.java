package org.summer.view.widget.xaml;

import org.summer.view.widget.IDisposable;

public abstract class XamlReader implements IDisposable
	{
		protected boolean IsDisposed { get; private set; }

		public abstract boolean IsEof { get; }
		public abstract XamlMember Member { get; }
		public abstract NamespaceDeclaration Namespace { get; }
		public abstract XamlNodeType NodeType { get; }
		public abstract XamlSchemaContext SchemaContext { get; }
		public abstract XamlType Type { get; }
		public abstract Object Value { get; }

		public void Close ()
		{
			Dispose (true);
		}

		protected /*virtual*/ void Dispose (boolean disposing)
		{
			IsDisposed = true;
		}

		public void /*IDisposable.*/Dispose ()
		{
			Dispose (true);
		}

		public abstract boolean Read ();

		public /*virtual*/ XamlReader ReadSubtree ()
		{
			return new XamlSubtreeReader (this);
		}

		public /*virtual*/ void Skip ()
		{
			int count = 0;
			switch (NodeType) {
			case /*XamlNodeType.*/StartMember:
			case /*XamlNodeType.*/StartObject:
			case /*XamlNodeType.*/GetObject:
				count++;
				while (Read ()) {
					switch (NodeType) {
					case /*XamlNodeType.*/StartMember:
					case /*XamlNodeType.*/GetObject:
					case /*XamlNodeType.*/StartObject:
						count++;
						continue;
					case /*XamlNodeType.*/EndMember:
					case /*XamlNodeType.*/EndObject:
						count--;
						if (count == 0) {
							Read ();
							return;
						}
						continue;
					}
				}
				return;

			default:
				Read ();
				return;
			}
		}
	}