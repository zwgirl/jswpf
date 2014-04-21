/**
 */
package org.summer.view.widget.controls;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.FrameworkPropertyMetadataOptions;
import org.summer.view.widget.RoutedEvent;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.UIPropertyMetadata;
import org.summer.view.widget.controls.primitives.Selector;
import org.summer.view.widget.input.KeyboardNavigationMode;
import org.summer.view.widget.input.MouseButton;
import org.summer.view.widget.input.MouseButtonEventArgs;
import org.summer.view.widget.input.MouseEventArgs;
import org.summer.view.widget.media.VisualTreeHelper;
import org.summer.view.widget.threading.DispatcherOperation;


/// <summary> 
///     Control that implements a selectable item inside a ListBox.
/// </summary>
//[DefaultEvent("Selected")]
public class ListBoxItem extends ContentControl 
{
    //------------------------------------------------------------------- 
    // 
    //  Constructors
    // 
    //-------------------------------------------------------------------

//    #region Constructors

    /// <summary>
    ///     Default DependencyObject constructor 
    /// </summary> 
    public ListBoxItem() 
    { 
    	super();
    }

    static // ListBoxItem()
    { 
        DefaultStyleKeyProperty.OverrideMetadata(typeof(ListBoxItem), new FrameworkPropertyMetadata(typeof(ListBoxItem)));
        _dType = DependencyObjectType.FromSystemTypeInternal(typeof(ListBoxItem)); 
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(typeof(ListBoxItem), new FrameworkPropertyMetadata(KeyboardNavigationMode.Once)); 
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(typeof(ListBoxItem), new FrameworkPropertyMetadata(KeyboardNavigationMode.Local));

        IsEnabledProperty.OverrideMetadata(typeof(ListBoxItem), new UIPropertyMetadata(new PropertyChangedCallback(OnVisualStatePropertyChanged)));
        IsMouseOverPropertyKey.OverrideMetadata(typeof(ListBoxItem), new UIPropertyMetadata(new PropertyChangedCallback(OnVisualStatePropertyChanged)));
        Selector.IsSelectionActivePropertyKey.OverrideMetadata(typeof(ListBoxItem), new FrameworkPropertyMetadata(new PropertyChangedCallback(OnVisualStatePropertyChanged)));
        AutomationProperties.IsOffscreenBehaviorProperty.OverrideMetadata(typeof(ListBoxItem), new FrameworkPropertyMetadata(IsOffscreenBehavior.FromClip)); 
    }

//    #endregion 

    //-------------------------------------------------------------------- 
    //
    //  Public Properties
    //
    //------------------------------------------------------------------- 

//    #region Public Properties 

    /// <summary>
    ///     Indicates whether this ListBoxItem is selected. 
    /// </summary>
    public static final DependencyProperty IsSelectedProperty =
            Selector.IsSelectedProperty.AddOwner(typeof(ListBoxItem),
                    new FrameworkPropertyMetadata(false, 
                            FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal,
                            new PropertyChangedCallback(OnIsSelectedChanged))); 

    /// <summary>
    ///     Indicates whether this ListBoxItem is selected. 
    /// </summary>
//    [Bindable(true), Category("Appearance")]
    public boolean IsSelected
    { 
        get { return (boolean) GetValue(IsSelectedProperty); }
        set { SetValue(IsSelectedProperty, value); } 
    } 

    private static void OnIsSelectedChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        ListBoxItem listItem = d as ListBoxItem;
        boolean isSelected = (boolean) e.NewValue;

        Selector parentSelector = listItem.ParentSelector;
        if (parentSelector != null) 
        { 
            parentSelector.RaiseIsSelectedChangedAutomationEvent(listItem, isSelected);
        } 

        if (isSelected)
        {
            listItem.OnSelected(new RoutedEventArgs(Selector.SelectedEvent, listItem)); 
        }
        else 
        { 
            listItem.OnUnselected(new RoutedEventArgs(Selector.UnselectedEvent, listItem));
        } 

        listItem.UpdateVisualState();
    }

    /// <summary>
    ///     Event indicating that the IsSelected property is now true. 
    /// </summary> 
    /// <param name="e">Event arguments</param>
    protected /*virtual*/ void OnSelected(RoutedEventArgs e) 
    {
        HandleIsSelectedChanged(true, e);
    }

    /// <summary>
    ///     Event indicating that the IsSelected property is now false. 
    /// </summary> 
    /// <param name="e">Event arguments</param>
    protected /*virtual*/ void OnUnselected(RoutedEventArgs e) 
    {
        HandleIsSelectedChanged(false, e);
    }

    private void HandleIsSelectedChanged(boolean newValue, RoutedEventArgs e)
    { 
        RaiseEvent(e); 
    }

//    #endregion

//    #region Events

    /// <summary>
    ///     Raised when the item's IsSelected property becomes true. 
    /// </summary> 
    public static final RoutedEvent SelectedEvent = Selector.SelectedEvent.AddOwner(typeof(ListBoxItem));

    /// <summary>
    ///     Raised when the item's IsSelected property becomes true.
    /// </summary>
    public /*event*/ RoutedEventHandler Selected 
    {
        add 
        { 
            AddHandler(SelectedEvent, value);
        } 
        remove
        {
            RemoveHandler(SelectedEvent, value);
        } 
    }

    /// <summary> 
    ///     Raised when the item's IsSelected property becomes false.
    /// </summary> 
    public static final RoutedEvent UnselectedEvent = Selector.UnselectedEvent.AddOwner(typeof(ListBoxItem));

    /// <summary>
    ///     Raised when the item's IsSelected property becomes false. 
    /// </summary>
    public /*event*/ RoutedEventHandler Unselected 
    { 
        add
        { 
            AddHandler(UnselectedEvent, value);
        }
        remove
        { 
            RemoveHandler(UnselectedEvent, value);
        } 
    } 

//    #endregion 

    //--------------------------------------------------------------------
    //
    //  Protected Methods 
    //
    //-------------------------------------------------------------------- 

//    #region Protected Methods

    /*internal*/ /*override*/ void ChangeVisualState(boolean useTransitions)
    {
        // Change to the correct state in the Interaction group
        if (!IsEnabled) 
        {
            // [copied from SL code] 
            // If our child is a control then we depend on it displaying a proper "disabled" state.  If it is not a control 
            // (ie TextBlock, Border, etc) then we will use our visuals to show a disabled state.
            VisualStateManager.GoToState(this, Content is Control ? VisualStates.StateNormal : VisualStates.StateDisabled, useTransitions); 
        }
        else if (IsMouseOver)
        {
            VisualStateManager.GoToState(this, VisualStates.StateMouseOver, useTransitions); 
        }
        else 
        { 
            VisualStateManager.GoToState(this, VisualStates.StateNormal, useTransitions);
        } 

        // Change to the correct state in the Selection group
        if (IsSelected)
        { 
            if (Selector.GetIsSelectionActive(this))
            { 
                VisualStateManager.GoToState(this, VisualStates.StateSelected, useTransitions); 
            }
            else 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateSelectedUnfocused, VisualStates.StateSelected);
            }
        } 
        else
        { 
            VisualStateManager.GoToState(this, VisualStates.StateUnselected, useTransitions); 
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

    /// <summary> 
    /// Creates AutomationPeer (<see cref="UIElement.OnCreateAutomationPeer"/>)
    /// </summary> 
    protected /*override*/ AutomationPeer OnCreateAutomationPeer() 
    {
        return new ListBoxItemWrapperAutomationPeer(this); 
    }


    /// <summary> 
    ///     This is the method that responds to the MouseButtonEvent event.
    /// </summary> 
    /// <param name="e">Event arguments</param> 
    protected /*override*/ void OnMouseLeftButtonDown(MouseButtonEventArgs e)
    { 
        if (!e.Handled)
        {
            //
            e.Handled = true; 
            HandleMouseButtonDown(MouseButton.Left);
        } 
        super.OnMouseLeftButtonDown(e); 
    }

    /// <summary>
    ///     This is the method that responds to the MouseButtonEvent event.
    /// </summary>
    /// <param name="e">Event arguments</param> 
    protected /*override*/ void OnMouseRightButtonDown(MouseButtonEventArgs e)
    { 
        if (!e.Handled) 
        {
            // 
            e.Handled = true;
            HandleMouseButtonDown(MouseButton.Right);
        }
        super.OnMouseRightButtonDown(e); 
    }

    private void HandleMouseButtonDown(MouseButton mouseButton) 
    {
        if (Selector.UiGetIsSelectable(this) && Focus()) 
        {
            ListBox parent = ParentListBox;
            if (parent != null)
            { 
                parent.NotifyListItemClicked(this, mouseButton);
            } 
        } 
    }

    /// <summary>
    /// Called when IsMouseOver changes on this element.
    /// </summary>
    /// <param name="e"></param> 
    protected /*override*/ void OnMouseEnter(MouseEventArgs e)
    { 
        // abort any drag operation we have queued. 
        if (parentNotifyDraggedOperation != null)
        { 
            parentNotifyDraggedOperation.Abort();
            parentNotifyDraggedOperation = null;
        }

        if (IsMouseOver)
        { 
            ListBox parent = ParentListBox; 

            if (parent != null && Mouse.LeftButton == MouseButtonState.Pressed) 
            {
                parent.NotifyListItemMouseDragged(this);
            }
        } 
        super.OnMouseEnter(e);
    } 

    /// <summary>
    /// Called when IsMouseOver changes on this element. 
    /// </summary>
    /// <param name="e"></param>
    protected /*override*/ void OnMouseLeave(MouseEventArgs e)
    { 
        // abort any drag operation we have queued.
        if (parentNotifyDraggedOperation != null) 
        { 
            parentNotifyDraggedOperation.Abort();
            parentNotifyDraggedOperation = null; 
        }

        super.OnMouseLeave(e);
    } 

    /// <summary> 
    /// Called when the visual parent of this element changes. 
    /// </summary>
    /// <param name="oldParent"></param> 
    protected /*internal*/ /*override*/ void OnVisualParentChanged(DependencyObject oldParent)
    {
        ItemsControl oldItemsControl = null;

        if (VisualTreeHelper.GetParent(this) == null)
        { 
            if (IsKeyboardFocusWithin) 
            {
                // This ListBoxItem had focus but was removed from the tree. 
                // The normal behavior is for focus to become null, but we would rather that
                // focus go to the parent ListBox.

                // Use the oldParent to get a reference to the ListBox that this ListBoxItem used to be in. 
                // The oldParent's ItemsOwner should be the ListBox.
                oldItemsControl = ItemsControl.GetItemsOwner(oldParent); 
            } 
        }

        super.OnVisualParentChanged(oldParent);

        // If earlier, we decided to set focus to the old parent ListBox, do it here
        // after calling base so that the state for IsKeyboardFocusWithin is updated correctly. 
        if (oldItemsControl != null)
        { 
            oldItemsControl.Focus(); 
        }
    } 


//    #endregion

    //-------------------------------------------------------------------
    // 
    //  Implementation 
    //
    //-------------------------------------------------------------------- 

//    #region Implementation

    private ListBox ParentListBox 
    {
        get 
        { 
            return ParentSelector as ListBox;
        } 
    }

    /*internal*/ Selector ParentSelector
    { 
        get
        { 
            return ItemsControl.ItemsControlFromItemContainer(this) as Selector; 
        }
    } 

//    #endregion

//#if OLD_AUTOMATION 
////left here for reference only as it is still used by MonthCalendar
//    /// <summary> 
//    /// DependencyProperty for SelectionContainer property. 
//    /// </summary>
//    /*internal*/ static final DependencyProperty SelectionContainerProperty 
//        = DependencyProperty.RegisterAttached("SelectionContainer", typeof(UIElement), typeof(ListBoxItem),
//        new FrameworkPropertyMetadata((UIElement)null));
//#endif

//    #region Private Fields

    DispatcherOperation parentNotifyDraggedOperation = null; 

//    #endregion 

//    #region DTypeThemeStyleKey

    // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
    // value. Controls will /*override*/ this method to return approriate types.
    /*internal*/ /*override*/ DependencyObjectType DTypeThemeStyleKey 
    { 
        get { return _dType; }
    } 

    private static DependencyObjectType _dType;

//    #endregion DTypeThemeStyleKey 
}
