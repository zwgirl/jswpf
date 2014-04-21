package org.summer.view.widget.input;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.Type;

/// <summary> 
///     RoutedCommand with added UI Information.
/// </summary> 
//[TypeConverter("System.Windows.Input.CommandConverter, PresentationFramework, Version=" + BuildInfo.WCP_VERSION + ", Culture=neutral, PublicKeyToken=" + BuildInfo.WCP_PUBLIC_KEY_TOKEN + ", Custom=null")]
public class RoutedUICommand extends RoutedCommand
{
    /// <summary> 
    ///     Default Constructor - needed to allow markup creation
    /// </summary> 
    public RoutedUICommand() 
    {
    	super();
        _text = String.Empty; 
    }

    /// <summary>
    ///     Creates an instance of this class. 
    /// </summary>
    /// <param name="text">Descriptive and localizable text for the command</param> 
    /// <param name="name">Declared Name of the RoutedCommand for Serialization</param> 
    /// <param name="ownerType">Type that is registering the property</param>
    public RoutedUICommand(String text, String name, Type ownerType) 
        : this(text, name, ownerType, null)
    {
    }

    /// <summary>
    ///     Creates an instance of this class. 
    /// </summary> 
    /// <param name="text">Descriptive and localizable text for the command</param>
    /// <param name="name">Declared Name of the RoutedCommand for Serialization</param> 
    /// <param name="ownerType">Type that is registering the property</param>
    /// <param name="inputGestures">Default Input Gestures associated</param>
    public RoutedUICommand(String text, String name, Type ownerType, InputGestureCollection inputGestures)
        : base(name, ownerType, inputGestures) 
    {
        if (text == null) 
        { 
            throw new ArgumentNullException("text");
        } 
        _text = text;
    }

    /// <summary> 
    ///     Creates an instance of this class. Allows lazy initialization of InputGestureCollection and Text properties.
    /// </summary> 
    /// <param name="name">Declared Name of the RoutedCommand for Serialization</param> 
    /// <param name="ownerType">Type that is registering the property</param>
    /// <param name="commandId">An identifier assigned by the owning type to the command</param> 
    /*internal*/public RoutedUICommand(String name, Type ownerType, byte commandId):base(name, ownerType, commandId)
    {
    }

    /// <summary>
    ///     Descriptive and localizable text for the command. 
    /// </summary> 
    public String Text
    { 
        get
        {
            if(_text == null)
            { 
                _text = GetText();
            } 
            return _text; 
        }
        set 
        {
            if (value == null)
            {
                throw new ArgumentNullException("value"); 
            }
            _text = value; 
        } 
    }

    /// <summary>
    ///    Fetches the text by invoking the GetUIText function on the owning type.
    /// </summary>
    /// <returns>The text for the command</returns> 
    private String GetText()
    { 
        if(OwnerType == typeof(ApplicationCommands)) 
        {
            return ApplicationCommands.GetUIText(CommandId); 
        }
        else if(OwnerType == typeof(NavigationCommands))
        {
            return NavigationCommands.GetUIText(CommandId); 
        }
        else if(OwnerType == typeof(MediaCommands)) 
        { 
            return MediaCommands.GetUIText(CommandId);
        } 
        else if(OwnerType == typeof(ComponentCommands))
        {
            return ComponentCommands.GetUIText(CommandId);
        } 
        return null;
    } 

   private String _text;
}