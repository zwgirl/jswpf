package org.summer.view.widget.xaml;
/*internal*/ public class XamlNodeLineInfo
{
	public final XamlNodeInfo Node;
	public final int LineNumber, LinePosition;
	public XamlNodeLineInfo (XamlNodeInfo node, int line, int column)
	{
		Node = node;
		LineNumber = line;
		LinePosition = column;
	}
}