package org.summer.view.widget.permission;

import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.xaml.permissions.XamlAccessLevel;

//[Serializable]
public /*sealed*/ class XamlLoadPermission extends CodeAccessPermission implements IUnrestrictedPermission
{
	public XamlLoadPermission (IEnumerable<XamlAccessLevel> allowedAccess)
	{
		AllowedAccess = new List<XamlAccessLevel> (allowedAccess);
	}
	public XamlLoadPermission (PermissionState state)
	{
		throw new NotImplementedException ();
	}
	public XamlLoadPermission (XamlAccessLevel allowedAccess)
		: this (new XamlAccessLevel [] {allowedAccess})
	{
	}

	public IList<XamlAccessLevel> AllowedAccess { get; private set; }

	public /*override*/ IPermission Copy ()
	{
		throw new NotImplementedException ();
	}
	public /*override*/ void FromXml (SecurityElement elem)
	{
		throw new NotImplementedException ();
	}
	public boolean Includes (XamlAccessLevel requestedAccess)
	{
		throw new NotImplementedException ();
	}
	public /*override*/ IPermission Intersect (IPermission target)
	{
		throw new NotImplementedException ();
	}
	public /*override*/ boolean IsSubsetOf (IPermission target)
	{
		throw new NotImplementedException ();
	}
	public boolean IsUnrestricted ()
	{
		throw new NotImplementedException ();
	}
	public /*override*/ SecurityElement ToXml ()
	{
		throw new NotImplementedException ();
	}
	public /*override*/ IPermission Union (IPermission other)
	{
		throw new NotImplementedException ();
	}
}