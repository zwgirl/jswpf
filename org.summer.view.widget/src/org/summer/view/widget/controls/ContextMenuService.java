package org.summer.view.widget.controls;

import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.Delegate;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.EventManager;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.FrameworkPropertyMetadataOptions;
import org.summer.view.widget.RoutedEvent;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.RoutingStrategy;
import org.summer.view.widget.UIElement;
import org.w3c.dom.css.Rect;

/// <summary> 
///     Service class that provides the system implementation for displaying ContextMenus.
/// </summary> 
public /*static*/ class ContextMenuService
{
//    #region Attached Properties

    /// <summary>
    ///     The DependencyProperty for the ContextMenu property. 
    /// </summary> 
    public static final DependencyProperty ContextMenuProperty =
            DependencyProperty.RegisterAttached( 
                   "ContextMenu",              // Name
                    typeof(ContextMenu),        // Type
                    typeof(ContextMenuService), // Owner
                    new FrameworkPropertyMetadata((ContextMenu)null, 
                            FrameworkPropertyMetadataOptions.None));

    /// <summary> 
    ///     Gets the value of the ContextMenu property on the specified Object.
    /// </summary> 
    /// <param name="element">The Object on which to query the ContextMenu property.</param>
    /// <returns>The value of the ContextMenu property.</returns>
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))]
    public static ContextMenu GetContextMenu(DependencyObject element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        ContextMenu cm = (ContextMenu)element.GetValue(ContextMenuProperty);

        if ((cm != null) && (element.Dispatcher != cm.Dispatcher)) 
        {
            throw new ArgumentException(SR.Get(SRID.ContextMenuInDifferentDispatcher)); 
        } 

        return cm; 
   }

    /// <summary>
    ///     Sets the ContextMenu property on the specified Object. 
    /// </summary>
    /// <param name="element">The Object on which to set the ContextMenu property.</param> 
    /// <param name="value"> 
    ///     The value of the ContextMenu property. If the value is of type ContextMenu, then
    ///     that is the ContextMenu that will be used (without any modification). If the value 
    ///     is of any other type, then that value will be used as the content for a ContextMenu
    ///     provided by this service, and the other attached properties of this service
    ///     will be used to configure the ContextMenu.
    /// </param> 
    public static void SetContextMenu(DependencyObject element, ContextMenu value)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(ContextMenuProperty, value);
    }

    /// <summary>
    ///     The DependencyProperty for the HorizontalOffset property. 
    /// </summary> 
    public static final DependencyProperty HorizontalOffsetProperty =
        DependencyProperty.RegisterAttached("HorizontalOffset",         // Name 
                                            typeof(double),             // Type
                                            typeof(ContextMenuService), // Owner
                                            new FrameworkPropertyMetadata(0d)); // Default Value

    /// <summary>
    ///     Gets the value of the HorizontalOffset property. 
    /// </summary> 
    /// <param name="element">The Object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    [TypeConverter(typeof(LengthConverter))]
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))]
    public static double GetHorizontalOffset(DependencyObject element)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }
        return (double)element.GetValue(HorizontalOffsetProperty); 
    }

    /// <summary>
    ///     Sets the value of the HorizontalOffset property. 
    /// </summary>
    /// <param name="element">The Object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param> 
    public static void SetHorizontalOffset(DependencyObject element, double value)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 
        element.SetValue(HorizontalOffsetProperty, value);
    } 

    /// <summary>
    ///     The DependencyProperty for the VerticalOffset property. 
    /// </summary>
    public static final DependencyProperty VerticalOffsetProperty =
        DependencyProperty.RegisterAttached("VerticalOffset",           // Name
                                            typeof(double),             // Type 
                                            typeof(ContextMenuService), // Owner
                                            new FrameworkPropertyMetadata(0d)); // Default Value 

    /// <summary>
    ///     Gets the value of the VerticalOffset property. 
    /// </summary>
    /// <param name="element">The Object on which to query the property.</param>
    /// <returns>The value of the property.</returns>
//    [TypeConverter(typeof(LengthConverter))] 
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))]
    public static double GetVerticalOffset(DependencyObject element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }
        return (double)element.GetValue(VerticalOffsetProperty);
    } 

    /// <summary> 
    ///     Sets the value of the VerticalOffset property. 
    /// </summary>
    /// <param name="element">The Object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param>
    public static void SetVerticalOffset(DependencyObject element, double value)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 
        element.SetValue(VerticalOffsetProperty, value);
    } 

    /// <summary>
    ///     The DependencyProperty for the HasDropShadow property.
    /// </summary> 
    public static final DependencyProperty HasDropShadowProperty =
        DependencyProperty.RegisterAttached("HasDropShadow",            // Name 
                                            typeof(boolean),               // Type 
                                            typeof(ContextMenuService), // Owner
                                            new FrameworkPropertyMetadata(BooleanBoxes.FalseBox)); //Default Value 
    /// <summary>
    ///     Gets the value of the HasDropShadow property.
    /// </summary>
    /// <param name="element">The Object on which to query the property.</param> 
    /// <returns>The value of the property.</returns>
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))] 
    public static boolean GetHasDropShadow(DependencyObject element) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }
        return (boolean)element.GetValue(HasDropShadowProperty); 
    }

    /// <summary> 
    ///     Sets the value of the HasDropShadow property.
    /// </summary> 
    /// <param name="element">The Object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param>
    public static void SetHasDropShadow(DependencyObject element, boolean value)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(HasDropShadowProperty, BooleanBoxes.Box(value)); 
    }

    /// <summary>
    ///     The DependencyProperty for the PlacementTarget property. 
    /// </summary>
    public static final DependencyProperty PlacementTargetProperty = 
        DependencyProperty.RegisterAttached("PlacementTarget",          // Name 
                                            typeof(UIElement),          // Type
                                            typeof(ContextMenuService), // Owner 
                                            new FrameworkPropertyMetadata((UIElement)null)); // Default Value

    /// <summary>
    ///     Gets the value of the PlacementTarget property. 
    /// </summary>
    /// <param name="element">The Object on which to query the property.</param> 
    /// <returns>The value of the property.</returns> 
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))]
    public static UIElement GetPlacementTarget(DependencyObject element) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }
        return (UIElement)element.GetValue(PlacementTargetProperty); 
    } 

    /// <summary> 
    ///     Sets the value of the PlacementTarget property.
    /// </summary>
    /// <param name="element">The Object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param> 
    public static void SetPlacementTarget(DependencyObject element, UIElement value)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(PlacementTargetProperty, value);
    }

    /// <summary>
    ///     The DependencyProperty for the PlacementRectangle property. 
    /// </summary> 
    public static final DependencyProperty PlacementRectangleProperty =
        DependencyProperty.RegisterAttached("PlacementRectangle",       // Name 
                                            typeof(Rect),               // Type
                                            typeof(ContextMenuService), // Owner
                                            new FrameworkPropertyMetadata(Rect.Empty)); // Default Value

    /// <summary>
    ///     Gets the value of the PlacementRectangle property. 
    /// </summary> 
    /// <param name="element">The Object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))]
    public static Rect GetPlacementRectangle(DependencyObject element)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 
        return (Rect)element.GetValue(PlacementRectangleProperty);
    } 

    /// <summary>
    ///     Sets the value of the PlacementRectangle property.
    /// </summary> 
    /// <param name="element">The Object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param> 
    public static void SetPlacementRectangle(DependencyObject element, Rect value) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }
        element.SetValue(PlacementRectangleProperty, value); 
    }

    /// <summary> 
    ///     The DependencyProperty for the Placement property.
    /// </summary> 
    public static final DependencyProperty PlacementProperty =
        DependencyProperty.RegisterAttached("Placement",                // Name
                                            typeof(PlacementMode),      // Type
                                            typeof(ContextMenuService), // Owner 
                                            new FrameworkPropertyMetadata(PlacementMode.MousePoint)); // Default Value

    /// <summary> 
    ///     Gets the value of the Placement property.
    /// </summary> 
    /// <param name="element">The Object on which to query the property.</param>
    /// <returns>The value of the property.</returns>
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))]
    public static PlacementMode GetPlacement(DependencyObject element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 
        return (PlacementMode)element.GetValue(PlacementProperty);
    }

    /// <summary> 
    ///     Sets the value of the Placement property.
    /// </summary> 
    /// <param name="element">The Object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param>
    public static void SetPlacement(DependencyObject element, PlacementMode value) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(PlacementProperty, value); 
    } 

    /// <summary> 
    ///     The DependencyProperty for the ShowOnDisabled property.
    /// </summary>
    public static final DependencyProperty ShowOnDisabledProperty =
        DependencyProperty.RegisterAttached("ShowOnDisabled",           // Name 
                                            typeof(boolean),               // Type
                                            typeof(ContextMenuService), // Owner 
                                            new FrameworkPropertyMetadata(BooleanBoxes.FalseBox)); // Default Value 

    /// <summary> 
    ///     Gets the value of the ShowOnDisabled property.
    /// </summary>
    /// <param name="element">The Object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))]
    public static boolean GetShowOnDisabled(DependencyObject element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }
        return (boolean)element.GetValue(ShowOnDisabledProperty);
    } 

    /// <summary> 
    ///     Sets the value of the ShowOnDisabled property. 
    /// </summary>
    /// <param name="element">The Object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param>
    public static void SetShowOnDisabled(DependencyObject element, boolean value)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 
        element.SetValue(ShowOnDisabledProperty, BooleanBoxes.Box(value));
    } 

    /// <summary>
    ///     The DependencyProperty for the IsEnabled property.
    /// </summary> 
    public static final DependencyProperty IsEnabledProperty =
        DependencyProperty.RegisterAttached("IsEnabled",                // Name 
                                            typeof(boolean),               // Type 
                                            typeof(ContextMenuService), // Owner
                                            new FrameworkPropertyMetadata(BooleanBoxes.TrueBox)); // Default Value 

    /// <summary>
    ///     Gets the value of the IsEnabled property.
    /// </summary> 
    /// <param name="element">The Object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))] 
    public static boolean GetIsEnabled(DependencyObject element)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 
        return (boolean)element.GetValue(IsEnabledProperty);
    } 

    /// <summary>
    ///     Sets the value of the IsEnabled property. 
    /// </summary>
    /// <param name="element">The Object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param>
    public static void SetIsEnabled(DependencyObject element, boolean value) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 
        element.SetValue(IsEnabledProperty, BooleanBoxes.Box(value));
    }

//    #endregion 

//    #region Events 

    /// <summary>
    ///     An event that fires just before a ContextMenu should be opened. 
    ///
    ///     To manually open and close ContextMenus, mark this event as handled.
    ///     Otherwise, the value of the the ContextMenu property will be used
    ///     to automatically open a ContextMenu. 
    /// </summary>
    public static final RoutedEvent ContextMenuOpeningEvent = 
        EventManager.RegisterRoutedEvent("ContextMenuOpening", 
                                           RoutingStrategy.Bubble,
                                           typeof(ContextMenuEventHandler), 
                                           typeof(ContextMenuService));

    /// <summary>
    ///     Adds a handler for the ContextMenuOpening attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param> 
    public static void AddContextMenuOpeningHandler(DependencyObject element, ContextMenuEventHandler handler)
    { 
        UIElement.AddHandler(element, ContextMenuOpeningEvent, handler);
    }

    /// <summary> 
    ///     Removes a handler for the ContextMenuOpening attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
    public static void RemoveContextMenuOpeningHandler(DependencyObject element, ContextMenuEventHandler handler) 
    {
        UIElement.RemoveHandler(element, ContextMenuOpeningEvent, handler);
    }

    /// <summary>
    ///     An event that fires just as a ContextMenu closes. 
    /// </summary> 
    public static final RoutedEvent ContextMenuClosingEvent =
        EventManager.RegisterRoutedEvent("ContextMenuClosing", 
                                           RoutingStrategy.Bubble,
                                           typeof(ContextMenuEventHandler),
                                           typeof(ContextMenuService));

    /// <summary>
    ///     Adds a handler for the ContextMenuClosing attached event 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
    public static void AddContextMenuClosingHandler(DependencyObject element, ContextMenuEventHandler handler)
    {
        UIElement.AddHandler(element, ContextMenuClosingEvent, handler);
    } 

    /// <summary> 
    ///     Removes a handler for the ContextMenuClosing attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
    public static void RemoveContextMenuClosingHandler(DependencyObject element, ContextMenuEventHandler handler)
    {
        UIElement.RemoveHandler(element, ContextMenuClosingEvent, handler); 
    }

    static //ContextMenuService() 
    {
        EventManager.RegisterClassHandler(typeof(UIElement), ContextMenuOpeningEvent, new ContextMenuEventHandler(OnContextMenuOpening)); 
        EventManager.RegisterClassHandler(typeof(ContentElement), ContextMenuOpeningEvent, new ContextMenuEventHandler(OnContextMenuOpening));
        EventManager.RegisterClassHandler(typeof(UIElement3D), ContextMenuOpeningEvent, new ContextMenuEventHandler(OnContextMenuOpening));
    }

    private static void OnContextMenuOpening(Object sender, ContextMenuEventArgs e)
    { 
        if (e.TargetElement == null) 
        {
            DependencyObject o = sender as DependencyObject; 
            if (o != null)
            {
                if (ContextMenuIsEnabled(o))
                { 
                    // Store for later
                    e.TargetElement = o; 
                } 
            }
        } 
    }

//    #endregion

//    #region Implementation

    /*internal*/ public static boolean ContextMenuIsEnabled(DependencyObject o) 
    {
        boolean contextMenuIsEnabled = false; 
        Object menu = GetContextMenu(o);
        if ((menu != null) && GetIsEnabled(o))
        {
            if (PopupControlService.IsElementEnabled(o) || GetShowOnDisabled(o)) 
            {
                contextMenuIsEnabled = true; 
            } 
        }

        return contextMenuIsEnabled;
    }

//    #endregion 
}

/// <summary> 
/// The callback type for handling a ContextMenuEvent
/// </summary> 
//public /*delegate*/ void ContextMenuEventHandler(Object sender, ContextMenuEventArgs e);

