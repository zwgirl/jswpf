package org.summer.view.widget.xaml;
/*internal*/ public class XamlNodeMember
{
	public XamlNodeMember (XamlObject owner, XamlMember member)
	{
		this.owner = owner;
		this.member = member;
	}

	final XamlObject owner;
	final XamlMember member;

	public XamlObject Owner {
		get { return owner; }
	}
	public XamlMember Member {
		get { return member; }
	}
	public XamlObject Value {
		get {
			var mv = Owner.GetMemberValue (Member);
			return new XamlObject (GetType (mv), mv);
		}
	}

	XamlType GetType (Object obj)
	{
		return obj == null ? XamlLanguage.Null : owner.Type.SchemaContext.GetXamlType (new InstanceContext (obj).GetRawValue ().GetType ());
	}
}