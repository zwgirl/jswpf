package org.summer.view.widget.internal;

import java.lang.reflect.Array;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ContentElement;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.EventRoute;
import org.summer.view.widget.RoutedEvent;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.RoutedEventHandler;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.UIElement3D;
import org.summer.view.widget.UIElementHelper;
import org.summer.view.widget.input.InputElement;
import org.summer.view.widget.input.InputManager;
import org.summer.view.widget.input.Keyboard;
import org.summer.view.widget.input.KeyboardEventArgs;
import org.summer.view.widget.input.Mouse;
import org.summer.view.widget.input.MouseButton;
import org.summer.view.widget.input.MouseButtonEventArgs;
import org.summer.view.widget.input.TextCompositionEventArgs;
import org.summer.view.window.automation.peer.AutomationEvents;
import org.summer.view.window.automation.peer.AutomationPeer;

/*internal*/ public /*static*/ class SynchronizedInputHelper 
{
    /*internal*/ public static DependencyObject GetUIParentCore(DependencyObject o) 
    { 
        UIElement e = o as UIElement;
        if (e != null) 
        {
            return e.GetUIParentCore();
        }
        else 
        {
            ContentElement ce = o as ContentElement; 
            if (ce != null) 
            {
                return ce.GetUIParentCore(); 
            }
            else
            {
                UIElement3D e3D = o as UIElement3D; 
                if (e3D != null)
                { 
                    return e3D.GetUIParentCore(); 
                }
            } 
            return null;
        }
    }

    /*internal*/ public static boolean IsMappedEvent(RoutedEventArgs args)
    { 
        RoutedEvent re = args.RoutedEvent; 

        return (re == Keyboard.KeyUpEvent || 
                re == Keyboard.KeyDownEvent ||
                re == TextCompositionManager.TextInputEvent ||
                re == Mouse.MouseDownEvent ||
                re == Mouse.MouseUpEvent); 
    }

    /*internal*/ public static SynchronizedInputType GetPairedInputType(SynchronizedInputType inputType) 
    {
        SynchronizedInputType pairedInputType = SynchronizedInputType.KeyDown; 

        switch (inputType)
        {
            case SynchronizedInputType.KeyDown: 
                pairedInputType = SynchronizedInputType.KeyUp;
                break; 

            case SynchronizedInputType.KeyUp:
                pairedInputType = SynchronizedInputType.KeyDown; 
                break;

            case SynchronizedInputType.MouseLeftButtonDown:
                pairedInputType = SynchronizedInputType.MouseLeftButtonUp; 
                break;

            case SynchronizedInputType.MouseLeftButtonUp: 
                pairedInputType = SynchronizedInputType.MouseLeftButtonDown;
                break; 

            case SynchronizedInputType.MouseRightButtonDown:
                pairedInputType = SynchronizedInputType.MouseRightButtonUp;
                break; 

            case SynchronizedInputType.MouseRightButtonUp: 
                pairedInputType = SynchronizedInputType.MouseRightButtonDown; 
                break;
        } 

        return pairedInputType;
    }

    // Check whether InputManager is listening for this input.
    /*internal*/ public static boolean IsListening(RoutedEventArgs args) 
    { 
        if (Array.IndexOf(InputManager.SynchronizedInputEvents, args.RoutedEvent) >= 0)
        { 
            return true;
        }
        else
        { 
            return false;
        } 
    } 

    // Check whether this element is listening for input. 
    /*internal*/ public static boolean IsListening(DependencyObject o, RoutedEventArgs args)
    {
        if (InputManager.ListeningElement == o &&
            Array.IndexOf(InputManager.SynchronizedInputEvents, args.RoutedEvent) >= 0) 
        {
            return true; 
        } 
        else
        { 
            return false;
        }
    }

    /*internal*/ public static boolean ShouldContinueListening(RoutedEventArgs args)
    { 
        return args.RoutedEvent == Keyboard.KeyDownEvent; 
    }

    // Add a preopportunity handler for the logical parent incase of templated element.
    /*internal*/ public static void AddParentPreOpportunityHandler(DependencyObject o, EventRoute route, RoutedEventArgs args)
    {
        // If the logical parent is different from visual parent then add handler on behalf of the 
        // parent into the route. This is to cover the templated elements, where event could be
        // handled by one of the child visual element but we should consider it as if event is handled by 
        // parent element ( logical parent). 
        DependencyObject visualParent = null;
        if(o is Visual || o is Visual3D) 
        {
            visualParent = UIElementHelper.GetUIParent(o);
        }
        DependencyObject logicalParent = SynchronizedInputHelper.GetUIParentCore(o); 
        if (logicalParent != null && logicalParent != visualParent)
        { 
            UIElement e = logicalParent as UIElement; 
            if (e != null)
            { 
                e.AddSynchronizedInputPreOpportunityHandler(route, args);
            }
            else
            { 
                ContentElement ce = logicalParent as ContentElement;
                if (ce != null) 
                { 
                    ce.AddSynchronizedInputPreOpportunityHandler(route, args);
                } 
                else
                {
                    UIElement3D e3D = logicalParent as UIElement3D;
                    if (e3D != null) 
                    {
                        e3D.AddSynchronizedInputPreOpportunityHandler(route, args); 
                    } 
                }
            } 
        }
    }

    // If the routed event type matches one the element listening on then add handler to the event route. 
    /*internal*/ public static void AddHandlerToRoute(DependencyObject o, EventRoute route, RoutedEventHandler eventHandler, boolean handledToo)
    { 
        // Add a synchronized input handler to the route. 
        route.Add(o, eventHandler, handledToo);
    } 

    // If this handler is invoked then it indicates the element had the opportunity to handle event.
    /*internal*/ public static void PreOpportunityHandler(Object sender, RoutedEventArgs args)
    { 
        KeyboardEventArgs kArgs = args as KeyboardEventArgs;
        // if it's the keyboard event then we have 1:1 mapping between handlers & events, 
        // so no remapping required. 
        if (kArgs != null)
        { 
            InputManager.SynchronizedInputState = SynchronizedInputStates.HadOpportunity;
        }
        else
        { 
            TextCompositionEventArgs tArgs = args as TextCompositionEventArgs;
            if (tArgs != null) 
            { 
                InputManager.SynchronizedInputState = SynchronizedInputStates.HadOpportunity;
            } 
            else
            {
                // If this is an mouse event then we have handlers only for generic MouseDown & MouseUp events,
                // so we need additional logic here to decide between Mouse left and right button events. 
                MouseButtonEventArgs mbArgs = args as MouseButtonEventArgs;
                if (mbArgs != null) 
                { 
                    Debug.Assert(mbArgs != null);
                    switch (mbArgs.ChangedButton) 
                    {
                        case MouseButton.Left:
                            if (InputManager.SynchronizeInputType == SynchronizedInputType.MouseLeftButtonDown ||
                                InputManager.SynchronizeInputType == SynchronizedInputType.MouseLeftButtonUp) 
                            {
                                InputManager.SynchronizedInputState = SynchronizedInputStates.HadOpportunity; 
                            } 
                            break;
                        case MouseButton.Right: 
                            if (InputManager.SynchronizeInputType == SynchronizedInputType.MouseRightButtonDown ||
                                InputManager.SynchronizeInputType == SynchronizedInputType.MouseRightButtonUp)
                            {
                                InputManager.SynchronizedInputState = SynchronizedInputStates.HadOpportunity; 
                            }
                            break; 
                        default: 
                            break;
                    } 
                }
            }
        }
    } 

    // This handler will be called after all class and instance handlers are called, here we 
    // decide whether the event is handled by this element or some other element. 
    /*internal*/ public static void PostOpportunityHandler(Object sender, RoutedEventArgs args)
    { 
        KeyboardEventArgs kArgs = args as KeyboardEventArgs;
        // if it's the keyboard event then we have 1:1 mapping between handlers & events,
        // so no remapping required.
        if (kArgs != null) 
        {
            InputManager.SynchronizedInputState = SynchronizedInputStates.Handled; 
        } 
        else
        { 
            TextCompositionEventArgs tArgs = args as TextCompositionEventArgs;
            if (tArgs != null)
            {
                InputManager.SynchronizedInputState = SynchronizedInputStates.Handled; 
            }
            else 
            { 
                // If this is an mouse event then we have handlers only for generic MouseDown & MouseUp events,
                // so we need additional logic here to decide between Mouse left and right button events. 
                MouseButtonEventArgs mbArgs = args as MouseButtonEventArgs;
                Debug.Assert(mbArgs != null);
                if (mbArgs != null)
                { 
                    switch (mbArgs.ChangedButton)
                    { 
                        case MouseButton.Left: 
                            if (InputManager.SynchronizeInputType == SynchronizedInputType.MouseLeftButtonDown ||
                                InputManager.SynchronizeInputType == SynchronizedInputType.MouseLeftButtonUp) 
                            {
                                InputManager.SynchronizedInputState = SynchronizedInputStates.Handled;
                            }
                            break; 
                        case MouseButton.Right:
                            if (InputManager.SynchronizeInputType == SynchronizedInputType.MouseRightButtonDown || 
                                InputManager.SynchronizeInputType == SynchronizedInputType.MouseRightButtonUp) 
                            {
                                InputManager.SynchronizedInputState = SynchronizedInputStates.Handled; 
                            }
                            break;
                        default:
                            break; 
                    }
                } 
            } 
        }
    } 



    // Map a Synchronized input type received from automation client to routed event 
    /*internal*/ public static RoutedEvent[] MapInputTypeToRoutedEvents(SynchronizedInputType inputType)
    { 
        RoutedEvent[] e = null; 
        switch (inputType)
        { 
            case SynchronizedInputType.KeyUp:
                e = new RoutedEvent[] {Keyboard.KeyUpEvent};
                break;
            case SynchronizedInputType.KeyDown: 
                e = new RoutedEvent[] {Keyboard.KeyDownEvent, TextCompositionManager.TextInputEvent};
                break; 
            case SynchronizedInputType.MouseLeftButtonDown: 
            case SynchronizedInputType.MouseRightButtonDown:
                e = new RoutedEvent[] {Mouse.MouseDownEvent}; 
                break;
            case SynchronizedInputType.MouseLeftButtonUp:
            case SynchronizedInputType.MouseRightButtonUp:
                e = new RoutedEvent[] {Mouse.MouseUpEvent}; 
                break;
            default: 
                Debug.Assert(false); 
                e = null;
                break; 
        }
        return e;
    }

    /*internal*/ public static void RaiseAutomationEvents()
    { 
        if (InputElement.IsUIElement(InputManager.ListeningElement)) 
        {
            UIElement e = (UIElement)InputManager.ListeningElement; 
            //Raise InputDiscarded automation event
            SynchronizedInputHelper.RaiseAutomationEvent(e.GetAutomationPeer());
        }
        else if (InputElement.IsContentElement(InputManager.ListeningElement)) 
        {
            ContentElement ce = (ContentElement)InputManager.ListeningElement; 
            //Raise InputDiscarded automation event 
            SynchronizedInputHelper.RaiseAutomationEvent(ce.GetAutomationPeer());
        } 
        else if (InputElement.IsUIElement3D(InputManager.ListeningElement))
        {
            UIElement3D e3D = (UIElement3D)InputManager.ListeningElement;
            //Raise InputDiscarded automation event 
            SynchronizedInputHelper.RaiseAutomationEvent(e3D.GetAutomationPeer());
        } 
    } 


    // Raise synchronized input automation events here.
    /*internal*/ public static void RaiseAutomationEvent(AutomationPeer peer)
    {
        if (peer != null) 
        {
            switch (InputManager.SynchronizedInputState) 
            { 
                case SynchronizedInputStates.Handled:
                    peer.RaiseAutomationEvent(AutomationEvents.InputReachedTarget); 
                    break;
                case SynchronizedInputStates.Discarded:
                    peer.RaiseAutomationEvent(AutomationEvents.InputDiscarded);
                    break; 
                default:
                    peer.RaiseAutomationEvent(AutomationEvents.InputReachedOtherElement); 
                    break; 
            }
        } 

    }
}

