package org.summer.view.widget.xaml;
/*internal*/ public /*static*/ class XamlNodeExtensions
{
	/*internal*/ public static Object GetMemberValue (/*this*/ XamlObject xobj, XamlMember xm)
	{
		if (xm.IsUnknown)
			return null;

		if (xm.IsAttachable)
			return xobj.GetRawValue (); // attachable property value

		// FIXME: this looks like an ugly hack. Is this really true? What if there's MarkupExtension that uses another MarkupExtension type as a member type.
		var obj = xobj.Context.GetRawValue ();
		if (xm == XamlLanguage.Initialization)
			return obj;
		if (xm == XamlLanguage.Items) // collection itself.
			return obj;
		if (xm == XamlLanguage.Arguments) // Object itself
			return obj;
		if (xm == XamlLanguage.PositionalParameters)
			return xobj.GetRawValue (); // dummy value
		return xm.Invoker.GetValue (xobj.GetRawValue ());
	}
}