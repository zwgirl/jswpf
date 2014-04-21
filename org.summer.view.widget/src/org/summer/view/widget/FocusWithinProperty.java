package org.summer.view.widget;
  ///////////////////////////////////////////////////////////////////////// 
 
    /*internal*/ public class FocusWithinProperty extends ReverseInheritProperty
    { 
        /////////////////////////////////////////////////////////////////////

        /*internal*/ public FocusWithinProperty()  
        { 
        	super(
                    UIElement.IsKeyboardFocusWithinPropertyKey, 
                    CoreFlags.IsKeyboardFocusWithinCache,
                    CoreFlags.IsKeyboardFocusWithinChanged);
        }
 
        /////////////////////////////////////////////////////////////////////

        /*internal*/ public /*override*/ void FireNotifications(UIElement uie, ContentElement ce, UIElement3D uie3D, boolean oldValue)
        { 
            DependencyPropertyChangedEventArgs args =
                    new DependencyPropertyChangedEventArgs( 
                        UIElement.IsKeyboardFocusWithinProperty, 
                        BooleanBoxes.Box(oldValue),
                        BooleanBoxes.Box(!oldValue)); 

            if (uie != null)
            {
                uie.RaiseIsKeyboardFocusWithinChanged(args); 
            }
            else if (ce != null) 
            { 
                ce.RaiseIsKeyboardFocusWithinChanged(args);
            } 
            else if (uie3D != null)
            {
                uie3D.RaiseIsKeyboardFocusWithinChanged(args);
            } 
        }
    } 