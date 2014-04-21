/**
 */
package org.summer.view.widget.controls.primitives;


import static org.summer.view.widget.controls.Control.OnVisualStatePropertyChanged;

import java.awt.RenderingHints.Key;
import java.awt.im.spi.InputMethod;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.DependencyPropertyKey;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.EventManager;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.FrameworkPropertyMetadataOptions;
import org.summer.view.widget.IInputElement;
import org.summer.view.widget.Point;
import org.summer.view.widget.PropertyChangedCallback;
import org.summer.view.widget.RoutedEvent;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.RoutedEventHandler;
import org.summer.view.widget.RoutingStrategy;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.UIPropertyMetadata;
import org.summer.view.widget.commands.CommandHelpers;
import org.summer.view.widget.controls.ClickMode;
import org.summer.view.widget.controls.ContentControl;
import org.summer.view.widget.input.AccessKeyEventArgs;
import org.summer.view.widget.input.AccessKeyManager;
import org.summer.view.widget.input.AccessKeyPressedEventArgs;
import org.summer.view.widget.input.CanExecuteChangedEventManager;
import org.summer.view.widget.input.FocusManager;
import org.summer.view.widget.input.ICommand;
import org.summer.view.widget.input.ICommandSource;
import org.summer.view.widget.input.InputManager;
import org.summer.view.widget.input.KeyEventArgs;
import org.summer.view.widget.input.Keyboard;
import org.summer.view.widget.input.ModifierKeys;
import org.summer.view.widget.input.Mouse;
import org.summer.view.widget.input.MouseButtonEventArgs;
import org.summer.view.widget.input.MouseEventArgs;
import org.summer.view.widget.media.Visual;
import org.summer.view.widget.media.VisualTreeHelper;
import org.summer.view.window.VisualStateManager;

/// <summary>
///     The base class for all buttons
/// </summary> 
/// <remarks>
///     ButtonBase adds IsPressed state, Click event, and Invoke features to a ContentControl. 
/// </remarks> 
//[DefaultEvent("Click")]
//[Localizability(LocalizationCategory.Button)] 
public abstract class ButtonBase extends ContentControl implements ICommandSource
{
//    #region Constructors

    static //ButtonBase()
    { 
        EventManager.RegisterClassHandler(typeof(ButtonBase), AccessKeyManager.AccessKeyPressedEvent, new AccessKeyPressedEventHandler(OnAccessKeyPressed)); 
        KeyboardNavigation.AcceptsReturnProperty.OverrideMetadata(typeof(ButtonBase), new FrameworkPropertyMetadata(BooleanBoxes.TrueBox));

        // Disable IME on button.
        //  - key typing should not be eaten by IME.
        //  - when the button has a focus, IME's disabled status should be indicated as
        //    grayed buttons on the language bar. 
        InputMethod.IsInputMethodEnabledProperty.OverrideMetadata(typeof(ButtonBase), new FrameworkPropertyMetadata(BooleanBoxes.FalseBox, FrameworkPropertyMetadataOptions.Inherits));

        IsMouseOverPropertyKey.OverrideMetadata(typeof(ButtonBase), new UIPropertyMetadata(new PropertyChangedCallback(OnVisualStatePropertyChanged))); 
        IsEnabledProperty.OverrideMetadata(typeof(ButtonBase), new UIPropertyMetadata(new PropertyChangedCallback(OnVisualStatePropertyChanged)));
    } 

    /// <summary>
    ///     Default ButtonBase constructor
    /// </summary> 
    /// <remarks>
    ///     Automatic determination of current Dispatcher. Use alternative constructor 
    ///     that accepts a Dispatcher for best performance. 
    /// </remarks>
    protected ButtonBase() 
    {
        super();
    }

//    #endregion

//    #region Virtual methods 
    /// <summary>
    /// This /*virtual*/ method is called when button is clicked and it raises the Click event 
    /// </summary>
    protected /*virtual*/ void OnClick()
    {
        RoutedEventArgs newEvent = new RoutedEventArgs(ButtonBase.ClickEvent, this); 
        RaiseEvent(newEvent);

        CommandHelpers.ExecuteCommandSource(this); 
    }


    /// <summary>
    ///     This method is invoked when the IsPressed property changes.
    /// </summary> 
    /// <param name="e">DependencyPropertyChangedEventArgs.</param>
    protected /*virtual*/ void OnIsPressedChanged(DependencyPropertyChangedEventArgs e) 
    { 
        OnVisualStatePropertyChanged(this, e);
    } 

//    #endregion Virtual methods

//    #region Private helpers 

    private boolean IsInMainFocusScope 
    { 
        get
        { 
            Visual focusScope = FocusManager.GetFocusScope(this) as Visual;
            return focusScope == null || VisualTreeHelper.GetParent(focusScope) == null;
        }
    } 

    /// <summary> 
    /// This method is called when button is clicked via IInvokeProvider. 
    /// </summary>
    /*internal*/ void AutomationButtonBaseClick() 
    {
        OnClick();
    }

    private static boolean IsValidClickMode(Object o)
    { 
        ClickMode value = (ClickMode)o; 
        return value == ClickMode.Press
            || value == ClickMode.Release 
            || value == ClickMode.Hover;
    }

    /// <summary> 
    /// Override for <seealso cref="UIElement.OnRenderSizeChanged"/>
    /// </summary> 
    protected /*internal*/ /*override*/ void OnRenderSizeChanged(SizeChangedInfo sizeInfo) 
    {
        super.OnRenderSizeChanged(sizeInfo); 

        // *** Workaround ***
        // We need OnMouseRealyOver Property here
        // 
        // There is a problem when Button is capturing the Mouse and resizing untill the mouse fall of the Button
        // During that time, Button and Mouse didn't really move. However, we need to update the IsPressed property 
        // because mouse is no longer over the button. 
        // We migth need a new property called *** IsMouseReallyOver *** property, so we can update IsPressed when
        // it's changed. (Can't use IsMouseOver or IsMouseDirectlyOver 'coz once Mouse is captured, they're alway 'true'. 
        //

        // Update IsPressed property
        if (IsMouseCaptured && (Mouse.PrimaryDevice.LeftButton == MouseButtonState.Pressed) && !IsSpaceKeyDown) 
        {
            // At this point, RenderSize is not updated. We must use finalSize instead. 
            UpdateIsPressed(); 
        }
    } 

    /// <summary>
    ///     Called when IsPressedProperty is changed on "d."
    /// </summary> 
    private static void OnIsPressedChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
        ButtonBase ctrl = (ButtonBase)d; 
        ctrl.OnIsPressedChanged(e);
    } 

    private static void OnAccessKeyPressed(Object sender, AccessKeyPressedEventArgs e)
    {
        if (!e.Handled && e.Scope == null && e.Target == null) 
        {
            e.Target = (UIElement)sender; 
        } 
    }

    private void UpdateIsPressed()
    {
        Point pos = Mouse.PrimaryDevice.GetPosition(this);

        if ((pos.X >= 0) && (pos.X <= ActualWidth) && (pos.Y >= 0) && (pos.Y <= ActualHeight))
        { 
            if (!IsPressed) 
            {
                SetIsPressed(true); 
            }
        }
        else if (IsPressed)
        { 
            SetIsPressed(false);
        } 
    } 

//    #endregion Private helpers 

//    #region Properties and Events
    /// <summary>
    /// Event correspond to left mouse button click 
    /// </summary>
    public static final RoutedEvent ClickEvent = EventManager.RegisterRoutedEvent("Click", RoutingStrategy.Bubble, typeof(RoutedEventHandler), typeof(ButtonBase)); 

    /// <summary>
    /// Add / Remove ClickEvent handler 
    /// </summary>
//    [Category("Behavior")]
    public /*event*/ RoutedEventHandler Click { add { AddHandler(ClickEvent, value); } remove { RemoveHandler(ClickEvent, value); } }

    /// <summary>
    ///     The DependencyProperty for RoutedCommand 
    /// </summary> 
//    [CommonDependencyProperty]
    public static final DependencyProperty CommandProperty = 
            DependencyProperty.Register(
                    "Command",
                    typeof(ICommand),
                    typeof(ButtonBase), 
                    new FrameworkPropertyMetadata((ICommand)null,
                        new PropertyChangedCallback(OnCommandChanged))); 

    /// <summary>
    /// The DependencyProperty for the CommandParameter 
    /// </summary>
//    [CommonDependencyProperty]
    public static final DependencyProperty CommandParameterProperty =
            DependencyProperty.Register( 
                    "CommandParameter",
                    typeof(Object), 
                    typeof(ButtonBase), 
                    new FrameworkPropertyMetadata((Object) null));

    /// <summary>
    ///     The DependencyProperty for Target property
    ///     Flags:              None
    ///     Default Value:      null 
    /// </summary>
//    [CommonDependencyProperty] 
    public static final DependencyProperty CommandTargetProperty = 
            DependencyProperty.Register(
                    "CommandTarget", 
                    typeof(IInputElement),
                    typeof(ButtonBase),
                    new FrameworkPropertyMetadata((IInputElement)null));

    /// <summary>
    ///     The key needed set a read-only property. 
    /// </summary> 
    /*internal*/ static final DependencyPropertyKey IsPressedPropertyKey =
            DependencyProperty.RegisterReadOnly( 
                    "IsPressed",
                    typeof(Boolean),
                    typeof(ButtonBase),
                    new FrameworkPropertyMetadata( 
                            BooleanBoxes.FalseBox,
                            new PropertyChangedCallback(OnIsPressedChanged))); 

    /// <summary>
    ///     The DependencyProperty for the IsPressed property. 
    ///     Flags:              None
    ///     Default Value:      false
    /// </summary>
//    [CommonDependencyProperty] 
    public static final DependencyProperty IsPressedProperty =
            IsPressedPropertyKey.DependencyProperty; 

    /// <summary>
    ///     IsPressed is the state of a button indicates that left mouse button is pressed or space key is pressed over the button. 
    /// </summary>
//    [Browsable(false), Category("Appearance"), ReadOnly(true)]
    public boolean IsPressed
    { 
        get { return (boolean) GetValue(IsPressedProperty); }
        protected set { SetValue(IsPressedPropertyKey, BooleanBoxes.Box(value)); } 
    } 

    private void SetIsPressed(boolean pressed) 
    {
        if (pressed)
        {
            SetValue(IsPressedPropertyKey, BooleanBoxes.Box(pressed)); 
        }
        else 
        { 
            ClearValue(IsPressedPropertyKey);
        } 
    }

    /// <summary>
    /// Get or set the Command property 
    /// </summary>
//    [Bindable(true), Category("Action")] 
//    [Localizability(LocalizationCategory.NeverLocalize)] 
    public ICommand Command
    { 
        get
        {
            return (ICommand) GetValue(CommandProperty);
        } 
        set
        { 
            SetValue(CommandProperty, value); 
        }
    } 

    private static void OnCommandChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        ButtonBase b = (ButtonBase)d; 
        b.OnCommandChanged((ICommand)e.OldValue, (ICommand)e.NewValue);
    } 

    private void OnCommandChanged(ICommand oldCommand, ICommand newCommand)
    { 
        if (oldCommand != null)
        {
            UnhookCommand(oldCommand);
        } 
        if (newCommand != null)
        { 
            HookCommand(newCommand); 
        }
    } 

    private void UnhookCommand(ICommand command)
    {
        CanExecuteChangedEventManager.RemoveHandler(command, OnCanExecuteChanged); 
        UpdateCanExecute();
    } 

    private void HookCommand(ICommand command)
    { 
        CanExecuteChangedEventManager.AddHandler(command, OnCanExecuteChanged);
        UpdateCanExecute();
    }

    private void OnCanExecuteChanged(Object sender, EventArgs e)
    { 
        UpdateCanExecute(); 
    }

    private void UpdateCanExecute()
    {
        if (Command != null)
        { 
            CanExecute = /*MS.Internal.Commands.*/CommandHelpers.CanExecuteCommandSource(this);
        } 
        else 
        {
            CanExecute = true; 
        }
    }

    /// <summary> 
    ///     Fetches the value of the IsEnabled property
    /// </summary> 
    /// <remarks> 
    ///     The reason this property is overridden is so that Button
    ///     can infuse the value for CanExecute into it. 
    /// </remarks>
    protected /*override*/ boolean IsEnabledCore
    {
        get 
        {
            return super.IsEnabledCore && CanExecute; 
        } 
    }

    /// <summary>
    /// Reflects the parameter to pass to the CommandProperty upon execution.
    /// </summary>
//    [Bindable(true), Category("Action")] 
//    [Localizability(LocalizationCategory.NeverLocalize)]
    public Object CommandParameter 
    { 
        get
        { 
            return GetValue(CommandParameterProperty);
        }
        set
        { 
            SetValue(CommandParameterProperty, value);
        } 
    } 

    /// <summary> 
    ///     The target element on which to fire the command.
    /// </summary>
//    [Bindable(true), Category("Action")]
    public IInputElement CommandTarget 
    {
        get 
        { 
            return (IInputElement)GetValue(CommandTargetProperty);
        } 
        set
        {
            SetValue(CommandTargetProperty, value);
        } 
    }

    /// <summary> 
    ///     The DependencyProperty for the ClickMode property.
    ///     Flags:              None 
    ///     Default Value:      ClickMode.Release
    /// </summary>
    public static final DependencyProperty ClickModeProperty =
            DependencyProperty.Register( 
                    "ClickMode",
                    typeof(ClickMode), 
                    typeof(ButtonBase), 
                    new FrameworkPropertyMetadata(ClickMode.Release),
                    new ValidateValueCallback(IsValidClickMode)); 


    /// <summary>
    ///     ClickMode specify when the Click event should fire 
    /// </summary>
//    [Bindable(true), Category("Behavior")] 
    public ClickMode ClickMode 
    {
        get 
        {
            return (ClickMode) GetValue(ClickModeProperty);
        }
        set 
        {
            SetValue(ClickModeProperty, value); 
        } 
    }

//    #endregion Properties and Events

//    #region Override methods
    /// <summary> 
    /// This is the method that responds to the MouseButtonEvent event.
    /// </summary> 
    /// <param name="e">Event arguments</param> 
    protected /*override*/ void OnMouseLeftButtonDown(MouseButtonEventArgs e)
    { 
        // Ignore when in hover-click mode.
        if (ClickMode != ClickMode.Hover)
        {
            e.Handled = true; 

            // Always set focus on itself 
            // In case ButtonBase is inside a nested focus scope we should restore the focus OnLostMouseCapture 
            Focus();

            // It is possible that the mouse state could have changed during all of
            // the call-outs that have happened so far.
            if (e.ButtonState == MouseButtonState.Pressed)
            { 
                // Capture the mouse, and make sure we got it.
                // WARNING: callout 
                CaptureMouse(); 
                if (IsMouseCaptured)
                { 
                    // Though we have already checked this state, our call to CaptureMouse
                    // could also end up changing the state, so we check it again.
                    if (e.ButtonState == MouseButtonState.Pressed)
                    { 
                        if (!IsPressed)
                        { 
                            SetIsPressed(true); 
                        }
                    } 
                    else
                    {
                        // Release capture since we decided not to press the button.
                        ReleaseMouseCapture(); 
                    }
                } 
            } 

            if (ClickMode == ClickMode.Press) 
            {
                boolean exceptionThrown = true;
                try
                { 
                    OnClick();
                    exceptionThrown = false; 
                } 
                finally
                { 
                    if (exceptionThrown)
                    {
                        // Cleanup the buttonbase state
                        SetIsPressed(false); 
                        ReleaseMouseCapture();
                    } 
                } 
            }
        } 

        super.OnMouseLeftButtonDown(e);
    }

    /// <summary>
    /// This is the method that responds to the MouseButtonEvent event. 
    /// </summary> 
    /// <param name="e">Event arguments</param>
    protected /*override*/ void OnMouseLeftButtonUp(MouseButtonEventArgs e) 
    {
        // Ignore when in hover-click mode.
        if (ClickMode != ClickMode.Hover)
        { 
            e.Handled = true;
            boolean shouldClick = !IsSpaceKeyDown && IsPressed && ClickMode == ClickMode.Release; 

            if (IsMouseCaptured && !IsSpaceKeyDown)
            { 
                ReleaseMouseCapture();
            }

            if (shouldClick) 
            {
                OnClick(); 
            } 
        }

        super.OnMouseLeftButtonUp(e);
    }

    /// <summary> 
    /// This is the method that responds to the MouseEvent event.
    /// </summary> 
    /// <param name="e">Event arguments</param> 
    protected /*override*/ void OnMouseMove(MouseEventArgs e)
    { 
        super.OnMouseMove(e);
        if ((ClickMode != ClickMode.Hover) &&
            ((IsMouseCaptured && (Mouse.PrimaryDevice.LeftButton == MouseButtonState.Pressed) && !IsSpaceKeyDown)))
        { 
            UpdateIsPressed();

            e.Handled = true; 
        }
    } 

    /// <summary>
    ///     Called when this element loses mouse capture.
    /// </summary> 
    /// <param name="e"></param>
    protected /*override*/ void OnLostMouseCapture(MouseEventArgs e) 
    { 
        super.OnLostMouseCapture(e);

        if ((e.OriginalSource == this) && (ClickMode != ClickMode.Hover) && !IsSpaceKeyDown)
        {
            // If we are inside a nested focus scope - we should restore the focus to the main focus scope
            // This will cover the scenarios like ToolBar buttons 
            if (IsKeyboardFocused && !IsInMainFocusScope)
                Keyboard.Focus(null); 

            // When we lose capture, the button should not look pressed anymore
            // -- unless the spacebar is still down, in which case we are still pressed. 
            SetIsPressed(false);
        }
    }

    /// <summary>
    ///     An event reporting the mouse entered this element. 
    /// </summary> 
    /// <param name="e">Event arguments</param>
    protected /*override*/ void OnMouseEnter(MouseEventArgs e) 
    {
        super.OnMouseEnter(e);
        if (HandleIsMouseOverChanged())
        { 
            e.Handled = true;
        } 
    } 

    /// <summary> 
    ///     An event reporting the mouse left this element.
    /// </summary>
    /// <param name="e">Event arguments</param>
    protected /*override*/ void OnMouseLeave(MouseEventArgs e) 
    {
        super.OnMouseLeave(e); 
        if (HandleIsMouseOverChanged()) 
        {
            e.Handled = true; 
        }
    }

    /// <summary> 
    ///     An event reporting that the IsMouseOver property changed.
    /// </summary> 
    private boolean HandleIsMouseOverChanged() 
    {
        if (ClickMode == ClickMode.Hover) 
        {
            if (IsMouseOver)
            {
                // Hovering over the button will click in the OnHover click mode 
                SetIsPressed(true);
                OnClick(); 
            } 
            else
            { 
                SetIsPressed(false);
            }

            return true; 
        }

        return false; 
    }

    /// <summary>
    /// This is the method that responds to the KeyDown event.
    /// </summary>
    /// <param name="e">Event arguments</param> 
    protected /*override*/ void OnKeyDown(KeyEventArgs e)
    { 
        super.OnKeyDown(e); 

        if (ClickMode == ClickMode.Hover) 
        {
            // Ignore when in hover-click mode.
            return;
        } 

        if (e.Key == Key.Space) 
        { 
            // Alt+Space should bring up system menu, we shouldn't handle it.
            if ((Keyboard.Modifiers & (ModifierKeys.Control | ModifierKeys.Alt)) != ModifierKeys.Alt) 
            {
                if ((!IsMouseCaptured) && (e.OriginalSource == this))
                {
                    IsSpaceKeyDown = true; 
                    SetIsPressed(true);
                    CaptureMouse(); 

                    if (ClickMode == ClickMode.Press)
                    { 
                        OnClick();
                    }

                    e.Handled = true; 
                }
            } 
        } 
        else if (e.Key == Key.Enter && (boolean)GetValue(KeyboardNavigation.AcceptsReturnProperty))
        { 
            if (e.OriginalSource == this)
            {
                IsSpaceKeyDown = false;
                SetIsPressed(false); 
                if (IsMouseCaptured)
                { 
                    ReleaseMouseCapture(); 
                }

                OnClick();
                e.Handled = true;
            }
        } 
        else
        { 
            // On any other key we set IsPressed to false only if Space key is pressed 
            if (IsSpaceKeyDown)
            { 
                SetIsPressed(false);
                IsSpaceKeyDown = false;
                if (IsMouseCaptured)
                { 
                    ReleaseMouseCapture();
                } 
            } 
        }
    } 

    /// <summary>
    /// This is the method that responds to the KeyUp event.
    /// </summary> 
    /// <param name="e">Event arguments</param>
    protected /*override*/ void OnKeyUp(KeyEventArgs e) 
    { 
        super.OnKeyUp(e);

        if (ClickMode == ClickMode.Hover)
        {
            // Ignore when in hover-click mode.
            return; 
        }

        if ((e.Key == Key.Space) && IsSpaceKeyDown) 
        {
            // Alt+Space should bring up system menu, we shouldn't handle it. 
            if ((Keyboard.Modifiers & (ModifierKeys.Control | ModifierKeys.Alt)) != ModifierKeys.Alt)
            {
                IsSpaceKeyDown = false;
                if (GetMouseLeftButtonReleased()) 
                {
                    boolean shouldClick = IsPressed && ClickMode == ClickMode.Release; 

                    // Release mouse capture if left mouse button is not pressed
                    if (IsMouseCaptured) 
                    {
                        // OnLostMouseCapture set IsPressed to false
                        ReleaseMouseCapture();
                    } 

                    if (shouldClick) 
                        OnClick(); 
                }
                else 
                {
                    // IsPressed state is updated only if mouse is captured (bugfix 919349)
                    if (IsMouseCaptured)
                        UpdateIsPressed(); 
                }

                e.Handled = true; 
            }
        } 
    }

    /// <summary>
    ///     An event announcing that the keyboard is no longer focused 
    /// </summary>
    /// <param name="e">Event arguments</param> 
    protected /*override*/ void OnLostKeyboardFocus(KeyboardFocusChangedEventArgs e) 
    {
        super.OnLostKeyboardFocus(e); 

        if (ClickMode == ClickMode.Hover)
        {
            // Ignore when in hover-click mode. 
            return;
        } 

        if (e.OriginalSource == this)
        { 
            if (IsPressed)
            {
                SetIsPressed(false);
            } 

            if (IsMouseCaptured) 
                ReleaseMouseCapture(); 

            IsSpaceKeyDown = false; 
        }
    }

    /// <summary> 
    /// The Access key for this control was invoked.
    /// </summary> 
    protected /*override*/ void OnAccessKey(AccessKeyEventArgs e) 
    {
        if (e.IsMultiple) 
        {
            super.OnAccessKey(e);
        }
        else 
        {
            // Don't call the base b/c we don't want to take focus 
            OnClick(); 
        }
    } 

    /// <SecurityNote>
    /// Critical - calling critical InputManager.Current
    /// Safe - InputManager.Current is not exposed and used temporary to determine the mouse state 
    /// </SecurityNote>
//    [SecurityCritical, SecurityTreatAsSafe] 
    private boolean GetMouseLeftButtonReleased() 
    {
        return InputManager.Current.PrimaryMouseDevice.LeftButton == MouseButtonState.Released; 
    }

    private boolean IsSpaceKeyDown
    { 
        get { return ReadControlFlag(ControlBoolFlags.IsSpaceKeyDown); }
        set { WriteControlFlag(ControlBoolFlags.IsSpaceKeyDown, value); } 
    } 

    private boolean CanExecute 
    {
        get { return !ReadControlFlag(ControlBoolFlags.CommandDisabled); }
        set
        { 
            if (value != CanExecute)
            { 
                WriteControlFlag(ControlBoolFlags.CommandDisabled, !value); 
                CoerceValue(IsEnabledProperty);
            } 
        }
    }

//    #endregion 

//    #region Visual State Manager 

    /// <summary>
    ///     Change to the correct visual state for the ButtonBase. 
    /// </summary>
    /// <param name="useTransitions">
    ///     true to use transitions when updating the visual state, false to
    ///     snap directly to the new visual state. 
    /// </param>
    /*internal*/ /*override*/ void ChangeVisualState(boolean useTransitions) 
    { 
        if (!IsEnabled)
        { 
            VisualStateManager.GoToState(this, VisualStates.StateDisabled, useTransitions);
        }
        else if (IsPressed)
        { 
            VisualStateManager.GoToState(this, VisualStates.StatePressed, useTransitions);
        } 
        else if (IsMouseOver) 
        {
            VisualStateManager.GoToState(this, VisualStates.StateMouseOver, useTransitions); 
        }
        else
        {
            VisualStateManager.GoToState(this, VisualStates.StateNormal, useTransitions); 
        }

        if (IsKeyboardFocused) 
        {
            VisualStateManager.GoToState(this, VisualStates.StateFocused, useTransitions); 
        }
        else
        {
            VisualStateManager.GoToState(this, VisualStates.StateUnfocused, useTransitions); 
        }

        super.ChangeVisualState(useTransitions); 
    }

//    #endregion
}
