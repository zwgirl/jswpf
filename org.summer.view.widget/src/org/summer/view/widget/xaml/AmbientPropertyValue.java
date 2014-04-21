package org.summer.view.widget.xaml;
public class AmbientPropertyValue
{
	public AmbientPropertyValue (XamlMember property, Object value)
	{
		// null arguments are allowed (4.0RC).
		RetrievedProperty = property;
		Value = value;
	}

	public XamlMember RetrievedProperty { get; private set; }

	public Object Value { get; private set; }
}