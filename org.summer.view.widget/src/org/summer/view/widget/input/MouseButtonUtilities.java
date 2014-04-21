package org.summer.view.widget.input;
/// <summary> 
///     Utility class for MouseButton 
/// </summary>
/*internal*/ public /*sealed*/ class MouseButtonUtilities 
{
    /// <summary>
    ///     Private placeholder constructor
    /// </summary> 
    /// <remarks>
    ///     There is present to supress the autogeneration of a public one, which 
    ///     triggers an FxCop violation, as this is an /*internal*/ public class that is never instantiated 
    /// </remarks>
    private MouseButtonUtilities() 
    {
    }

    /// <summary> 
    ///     Ensures MouseButton is set to a valid value.
    /// </summary> 
    /// <remarks> 
    ///     There is a proscription against using Enum.IsDefined().  (it is slow)
    ///     So we manually validate using a switch statement. 
    /// </remarks>
//    [FriendAccessAllowed]
    /*internal*/ public static void Validate(MouseButton button)
    { 
        switch(button)
        { 
            case MouseButton.Left: 
            case MouseButton.Middle:
            case MouseButton.Right: 
            case MouseButton.XButton1:
            case MouseButton.XButton2:
                break;
            default: 
                throw new  System.ComponentModel.InvalidEnumArgumentException("button", (int)button, typeof(MouseButton));
        } 
    } 

} 