/**
 */
package org.summer.view.widget.controls;

import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.controls.primitives.ToggleButton;
import org.summer.view.widget.input.AccessKeyEventArgs;
import org.summer.view.widget.input.Key;
import org.summer.view.widget.input.KeyEventArgs;
import org.summer.view.widget.input.KeyboardNavigation;

/// <summary> 
///     Use a CheckBox to give the user an option, such as true/false.
///     CheckBox allow the user to choose from a list of options. 
///     CheckBox controls let the user pick a combination of options.
/// </summary>
//[DefaultEvent("CheckStateChanged")]
//[Localizability(LocalizationCategory.CheckBox)] 
public class CheckBox extends ToggleButton
{ 
//    #region Constructors 

    static //CheckBox() 
    {
        // Set the default Style
        DefaultStyleKeyProperty.OverrideMetadata(typeof(CheckBox), new FrameworkPropertyMetadata(typeof(CheckBox)));
        _dType = DependencyObjectType.FromSystemTypeInternal(typeof(CheckBox)); 

        KeyboardNavigation.AcceptsReturnProperty.OverrideMetadata(typeof(CheckBox), new FrameworkPropertyMetadata(BooleanBoxes.FalseBox)); 
    } 

    /// <summary> 
    ///     Default CheckBox constructor
    /// </summary>
    /// <remarks>
    ///     Automatic determination of current Dispatcher. Use alternative constructor 
    ///     that accepts a Dispatcher for best performance.
    /// </remarks> 
    public CheckBox() 
    {
    	super();
    } 
//    #endregion

//    #region Override methods

    /// <summary>
    /// Creates AutomationPeer (<see cref="UIElement.OnCreateAutomationPeer"/>) 
    /// </summary> 
    protected /*override*/ System.Windows.Automation.Peers.AutomationPeer OnCreateAutomationPeer()
    { 
        return new System.Windows.Automation.Peers.CheckBoxAutomationPeer(this);
    }

    /// <summary> 
    /// This is the method that responds to the KeyDown event.
    /// </summary> 
    /// <param name="e"></param> 
    protected /*override*/ void OnKeyDown(KeyEventArgs e)
    { 
        base.OnKeyDown(e);

        // Add aditional keys "+" and "-" when we are not in IsThreeState mode
        if (!IsThreeState) 
        {
            if (e.Key == Key.OemPlus || e.Key == Key.Add) 
            { 
                e.Handled = true;
                ClearValue(IsPressedPropertyKey); 
                SetCurrentValueInternal(IsCheckedProperty, BooleanBoxes.TrueBox);
            }
            else if (e.Key == Key.OemMinus || e.Key == Key.Subtract)
            { 
                e.Handled = true;
                ClearValue(IsPressedPropertyKey); 
                SetCurrentValueInternal(IsCheckedProperty, BooleanBoxes.FalseBox); 
            }
        } 
    }

    /// <summary>
    /// The Access key for this control was invoked. 
    /// </summary>
    /// <param name="e"></param> 
    protected /*override*/ void OnAccessKey(AccessKeyEventArgs e) 
    {
        if (!IsKeyboardFocused) 
        {
            Focus();
        }

        base.OnAccessKey(e);
    } 

//    #endregion

//    #region Data
//    #endregion

//    #region DTypeThemeStyleKey 

    // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
    // value. Controls will /*override*/ this method to return approriate types. 
   /*internal*/ public /*override*/ DependencyObjectType DTypeThemeStyleKey
    { 
        get { return _dType; }
    }

    private static DependencyObjectType _dType; 

//    #endregion DTypeThemeStyleKey 
} 
