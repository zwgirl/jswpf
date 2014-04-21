package org.summer.view.widget.xaml;
/// <summary>
/// NamespaceDeclaration class which is similar to NamespaceDeclaration class in
/// XmlNamespaceManager code in BCL. ScopeCount gets incremented and decremented 
/// at PushScope/PopScope, and acts like a marker between Scoped Declarations.
/// </summary> 
//public class NamespaceDeclaration 
//{
//    /// <summary> 
//    /// namespace prefix
//    /// </summary>
//    public String Prefix;
//
//    /// <summary>
//    /// xml namespace uri. 
//    /// </summary> 
//    public String Uri;
//
//    /// <summary>
//    /// ScopeCount.  Incremented for nested scopes.
//    /// </summary>
//    public int    ScopeCount; 
//}

public class NamespaceDeclaration
{
	public NamespaceDeclaration (String ns, String prefix)
	{
		// null arguments are allowed.
		Namespace = ns;
		Prefix = prefix;
	}

	public String Namespace { get; private set; }
	public String Prefix { get; private set; }
}