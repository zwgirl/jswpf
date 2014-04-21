package org.summer.view.widget.markup;

import org.summer.view.widget.Type;

public interface IXamlTypeResolver {
	Type Resolve(String qualifiedTypeName);
}