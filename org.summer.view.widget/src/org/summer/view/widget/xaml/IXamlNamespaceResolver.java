package org.summer.view.widget.xaml;

import org.summer.view.widget.collection.IEnumerable;

public interface IXamlNamespaceResolver {
	String GetNamespace(String prefix);

	IEnumerable<NamespaceDeclaration> GetNamespacePrefixes();
}
