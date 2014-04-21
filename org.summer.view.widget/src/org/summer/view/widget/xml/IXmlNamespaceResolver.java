package org.summer.view.widget.xml;

import org.summer.view.widget.collection.IDictionary;

public interface IXmlNamespaceResolver
	{
		IDictionary<String, String> GetNamespacesInScope (XmlNamespaceScope scope);

		String LookupNamespace (String prefix);

		String LookupPrefix (String namespaceName);
	}