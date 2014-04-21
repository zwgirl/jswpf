package org.summer.view.widget.xaml.permissions;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.Type;
import org.summer.view.widget.reflection.Assembly;

//[SerializableAttribute]
public class XamlAccessLevel
{
	public static XamlAccessLevel AssemblyAccessTo (Assembly assembly)
	{
		if (assembly == null)
			throw new ArgumentNullException ("assembly");

		return new XamlAccessLevel (assembly.GetName ());
	}
	public static XamlAccessLevel AssemblyAccessTo (AssemblyName assemblyName)
	{
		if (assemblyName == null)
			throw new ArgumentNullException ("assemblyName");
		return new XamlAccessLevel (assemblyName);
	}

	public static XamlAccessLevel PrivateAccessTo (String assemblyQualifiedTypeName)
	{
		if (assemblyQualifiedTypeName == null)
			throw new ArgumentNullException ("assemblyQualifiedTypeName");
		return new XamlAccessLevel (assemblyQualifiedTypeName);
	}

	public static XamlAccessLevel PrivateAccessTo (Type type)
	{
		if (type == null)
			throw new ArgumentNullException ("type");
		return new XamlAccessLevel (type.AssemblyQualifiedName);
	}

	/*internal*/public XamlAccessLevel (AssemblyName assemblyAccessToAssemblyName)
	{
		AssemblyAccessToAssemblyName = assemblyAccessToAssemblyName;
	}

	/*internal*/public XamlAccessLevel (String privateAccessToTypeName)
	{
		PrivateAccessToTypeName = privateAccessToTypeName;
	}

	public AssemblyName AssemblyAccessToAssemblyName { get; private set; }
	public String PrivateAccessToTypeName { get; private set; }
}