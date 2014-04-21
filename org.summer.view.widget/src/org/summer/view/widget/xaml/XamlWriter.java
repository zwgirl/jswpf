package org.summer.view.widget.xaml;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.IDisposable;
import org.summer.view.widget.NotImplementedException;

public abstract class XamlWriter implements IDisposable
	{
		protected boolean IsDisposed { get; private set; }
		public abstract XamlSchemaContext SchemaContext { get; }

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

		public abstract void WriteEndMember ();
		public abstract void WriteEndObject ();
		public abstract void WriteGetObject ();
		public abstract void WriteNamespace (NamespaceDeclaration namespaceDeclaration);
		public abstract void WriteStartMember (XamlMember xamlMember);
		public abstract void WriteStartObject (XamlType type);
		public abstract void WriteValue (Object value);

		public void WriteNode (XamlReader reader)
		{
			if (reader == null)
				throw new ArgumentNullException ("reader");

			switch (reader.NodeType) {
			case /*XamlNodeType.*/StartObject:
				WriteStartObject (reader.Type);
				break;
			case /*XamlNodeType.*/GetObject:
				WriteGetObject ();
				break;
			case /*XamlNodeType.*/EndObject:
				WriteEndObject ();
				break;
			case /*XamlNodeType.*/StartMember:
				WriteStartMember (reader.Member);
				break;
			case /*XamlNodeType.*/EndMember:
				WriteEndMember ();
				break;
			case /*XamlNodeType.*/Value:
				WriteValue (reader.Value);
				break;
			case /*XamlNodeType.*/NamespaceDeclaration:
				WriteNamespace (reader.Namespace);
				break;
			default:
				throw NotImplemented (); // documented behavior
			}
		}

		Exception NotImplemented ()
		{
			return new NotImplementedException ();
		}
	}