package org.summer.view.widget.xaml;

import java.beans.EventHandler;

import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.KeyValuePair;

public interface IXamlNameResolver
	{
		boolean IsFixupTokenAvailable { get; }
		/*event*/ EventHandler OnNameScopeInitializationComplete;
		Object GetFixupToken (IEnumerable<String> names);
		Object GetFixupToken (IEnumerable<String> names, boolean canAssignDirectly);
		IEnumerable<KeyValuePair<String, Object>> GetAllNamesAndValuesInScope ();
		Object Resolve (String name);
		Object Resolve (String name, /*out*/ boolean isFullyInitialized);
	}