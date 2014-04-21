package org.summer.view.widget.xaml;
// Its original purpose was to enable delayed reflection, but it's not supported yet.
/*internal*/ public class InstanceContext
{
	public InstanceContext (Object value)
	{
		this.value = value;
	}

	Object value;

	public Object GetRawValue ()
	{
		return value; // so far.
	}
}