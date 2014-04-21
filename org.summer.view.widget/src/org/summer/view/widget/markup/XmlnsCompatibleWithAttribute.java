package org.summer.view.widget.markup;

import org.summer.view.Attribute;

public /*sealed*/ class XmlnsCompatibleWithAttribute extends Attribute
{
	public XmlnsCompatibleWithAttribute (String oldNamespace, String newNamespace)
	{
		this.oldNamespace = oldNamespace;
		this.newNamespace = newNamespace;
	}

	public String NewNamespace {
		get { return newNamespace; }
	}

	public String OldNamespace {
		get { return oldNamespace; }
	}

	String newNamespace;
	String oldNamespace;
}