package org.summer.view.widget.xaml;

/*internal*/ public class XamlNodeInfo
{
	public XamlNodeInfo (XamlNodeType nodeType, XamlObject value)
	{
		node_type = nodeType;
		this.value = value;
		member = default (XamlNodeMember);
	}

	public XamlNodeInfo (XamlNodeType nodeType, XamlNodeMember member)
	{
		node_type = nodeType;
		this.value = default (XamlObject);
		this.member = member;
	}

	public XamlNodeInfo (Object value)
	{
		node_type = XamlNodeType.Value;
		this.value = value;
		member = default (XamlNodeMember);
	}

	public XamlNodeInfo (NamespaceDeclaration ns)
	{
		node_type = XamlNodeType.NamespaceDeclaration;
		this.value = ns;
		member = default (XamlNodeMember);
	}

	XamlNodeType node_type;
	Object value;
	XamlNodeMember member;

	public XamlNodeType NodeType {
		get { return node_type; }
	}
	public XamlObject Object {
		get { return (XamlObject) value; }
	}
	public XamlNodeMember Member {
		get { return member; }
	}
	public Object Value {
		get { return value; }
	}
}

