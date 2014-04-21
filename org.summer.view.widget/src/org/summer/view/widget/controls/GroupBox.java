/**
 */
package org.summer.view.widget.controls;

import org.summer.view.widget.EventManager;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.input.AccessKeyEventArgs;
import org.summer.view.widget.input.AccessKeyManager;
import org.summer.view.widget.input.AccessKeyPressedEventArgs;
import org.summer.view.widget.input.FocusNavigationDirection;
import org.summer.view.widget.input.TraversalRequest;
import org.summer.view.window.automation.peer.AutomationPeer;


/// <summary>
/// GroupBox Control class 
/// </summary> 
//[Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] // cannot be read & localized as string
public class GroupBox extends HeaderedContentControl 
{
//    #region Constructors

    static/* GroupBox()*/ 
    {
        FocusableProperty.OverrideMetadata(typeof(GroupBox), new FrameworkPropertyMetadata(false)); 
        IsTabStopProperty.OverrideMetadata(typeof(GroupBox), new FrameworkPropertyMetadata(false)); 
        DefaultStyleKeyProperty.OverrideMetadata(typeof(GroupBox), new FrameworkPropertyMetadata(typeof(GroupBox)));
        EventManager.RegisterClassHandler(typeof(GroupBox), AccessKeyManager.AccessKeyPressedEvent, new AccessKeyPressedEventHandler(OnAccessKeyPressed)); 
    }

//    #endregion

//    #region Override methods

    /// <summary> 
    /// Creates AutomationPeer (<see cref="UIElement.OnCreateAutomationPeer"/>)
    /// </summary> 
    protected /*override*/ AutomationPeer OnCreateAutomationPeer()
    {
        return new System.Windows.Automation.Peers.GroupBoxAutomationPeer(this);
    } 

    /// <summary> 
    /// The Access key for this control was invoked. 
    /// </summary>
    protected /*override*/ void OnAccessKey(AccessKeyEventArgs e) 
    {
        MoveFocus(new TraversalRequest(FocusNavigationDirection.First));
    }

    private static void OnAccessKeyPressed(Object sender, AccessKeyPressedEventArgs e)
    { 
        if (!e.Handled && e.Scope == null && e.Target == null) 
        {
            e.Target = sender as GroupBox; 
        }
    }

//    #endregion 
}