/**
 */
package org.summer.view.widget.controls;


/// <summary>
///     Control that implements a selectable item inside a ListView. 
/// </summary>
//#if OLD_AUTOMATION 
//[Automation(AccessibilityControlType = "ListItem")] 
//#endif
public class ListViewItem extends ListBoxItem 
{
    // NOTE: ListViewItem has no default theme style. It uses ThemeStyleKey
    // to find default style for different view.

    // helper to set DefaultStyleKey of ListViewItem
    /*internal*/ public void SetDefaultStyleKey(Object key) 
    { 
        DefaultStyleKey = key;
    } 

    //  helper to clear DefaultStyleKey of ListViewItem
    /*internal*/ public void ClearDefaultStyleKey()
    { 
        ClearValue(DefaultStyleKeyProperty);
    } 
}  // ListViewItem
