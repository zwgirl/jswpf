package org.summer.view.widget;
/*internal*/ public class SharedDp
{
    /*internal*/ public SharedDp( 
        DependencyProperty dp,
        Object             value, 
        String             elementName) 
    {
        Dp = dp; 
        Value = value;
        ElementName = elementName;
    }

    /*internal*/ public DependencyProperty Dp;
    /*internal*/ public Object             Value; 
    /*internal*/ public String             ElementName; 
}