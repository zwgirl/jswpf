/**
 */
package org.summer.view.widget.controls;

import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.HorizontalAlignment;
import org.summer.view.window.automation.peer.AutomationPeer;


/// <summary>
///     Separator control is a simple Control subclass that is used in different styles
/// depend on container control. Common usage is inside ListBox, ComboBox, MenuItem and ToolBar. 
/// </summary>
//[Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] // cannot be read & localized as string 
public class Separator extends Control 
{
    static //Separator() 
    {
        DefaultStyleKeyProperty.OverrideMetadata(typeof(Separator), new FrameworkPropertyMetadata(typeof(Separator)));
        _dType = DependencyObjectType.FromSystemTypeInternal(typeof(Separator));

        IsEnabledProperty.OverrideMetadata(typeof(Separator), new FrameworkPropertyMetadata(BooleanBoxes.FalseBox));
    } 

    /*internal*/ public static void PrepareContainer(Control container)
    { 
        if (container != null)
        {
            // Disable the control and set the alignment to stretch
            container.IsEnabled = false; 
            container.HorizontalContentAlignment = HorizontalAlignment.Stretch;
        } 
    } 

    /// <summary> 
    /// Creates AutomationPeer (<see cref="UIElement.OnCreateAutomationPeer"/>)
    /// </summary>
    protected /*override*/ AutomationPeer OnCreateAutomationPeer()
    { 
        return new SeparatorAutomationPeer(this);
    } 

//    #region DTypeThemeStyleKey

    // Returns the DependencyObjectType for the registered ThemeStyleKey's default
    // value. Controls will /*override*/ this method to return approriate types.
    /*internal*/ public /*override*/ DependencyObjectType DTypeThemeStyleKey
    { 
        get { return _dType; }
    } 

    private static DependencyObjectType _dType;

//    #endregion DTypeThemeStyleKey
} // Separator
