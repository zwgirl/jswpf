package org.summer.view.widget.baml2006;

import org.summer.view.widget.xaml.XamlNodeList;
import org.summer.view.widget.xaml.XamlSchemaContext;
import org.summer.view.widget.xaml.XamlType;

/*internal*/public  class StaticResource 
{ 

    public StaticResource(XamlType type, XamlSchemaContext schemaContext) 
    {
        ResourceNodeList = new XamlNodeList(schemaContext, 8);
        ResourceNodeList.Writer.WriteStartObject(type);
    } 

    public XamlNodeList ResourceNodeList { get; private set; } 
} 