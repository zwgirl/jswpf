package org.summer.view.widget.xaml;
public class XamlSchemaContextSettings
{
	public XamlSchemaContextSettings ()
	{
	}

	public XamlSchemaContextSettings (XamlSchemaContextSettings settings)
	{
		// null is allowed.
		XamlSchemaContextSettings s = settings;
		if (s == null)
			return;
		FullyQualifyAssemblyNamesInClrNamespaces = s.FullyQualifyAssemblyNamesInClrNamespaces;
		SupportMarkupExtensionsWithDuplicateArity = s.SupportMarkupExtensionsWithDuplicateArity;
	}

	public boolean FullyQualifyAssemblyNamesInClrNamespaces { get; set; }
	public boolean SupportMarkupExtensionsWithDuplicateArity { get; set; }

}