package org.summer.view.widget.markup;

import org.summer.view.widget.context.XamlFrame;
import org.summer.view.widget.xaml.XamlMember;
import org.summer.view.widget.xaml.XamlType;

/*internal*/ public class WpfXamlFrame extends XamlFrame
{
    public WpfXamlFrame() { }
    public boolean FreezeFreezable { get; set; } 
    public XamlMember Property { get; set; }
    public XamlType Type { get; set; } 
    public Object Instance { get; set; } 
    public XmlnsDictionary XmlnsDictionary { get; set; }
    public boolean/*?*/ XmlSpace { get; set; } 

    public /*override*/ void Reset()
    {
        Type = null; 
        Property = null;
        Instance = null; 
        XmlnsDictionary = null; 
        XmlSpace = null;
        if (FreezeFreezable) 
        {
            FreezeFreezable = false;
        }
    } 
}