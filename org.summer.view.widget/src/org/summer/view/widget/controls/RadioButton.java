/**
 */
package org.summer.view.widget.controls;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.LogicalTreeHelper;
import org.summer.view.widget.PropertyChangedCallback;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.UncommonField;
import org.summer.view.widget.WeakReference;
import org.summer.view.widget.collection.ArrayList;
import org.summer.view.widget.collection.Hashtable;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.controls.primitives.ToggleButton;
import org.summer.view.widget.input.AccessKeyEventArgs;
import org.summer.view.widget.media.Visual;

/// <summary>
///     RadioButton implements option button with two states: true or false
/// </summary>
//[Localizability(LocalizationCategory.RadioButton)] 
public class RadioButton extends ToggleButton
{ 
//    #region Constructors 

    static //RadioButton() 
    {
        DefaultStyleKeyProperty.OverrideMetadata(typeof(RadioButton), new FrameworkPropertyMetadata(typeof(RadioButton)));
        _dType = DependencyObjectType.FromSystemTypeInternal(typeof(RadioButton));

        KeyboardNavigation.AcceptsReturnProperty.OverrideMetadata(typeof(RadioButton), new FrameworkPropertyMetadata(MS.Internal.KnownBoxes.BooleanBoxes.FalseBox));
    } 

    /// <summary>
    ///     Default RadioButton constructor 
    /// </summary>
    /// <remarks>
    ///     Automatic determination of current Dispatcher. Use alternative constructor
    ///     that accepts a Dispatcher for best performance. 
    /// </remarks>
    public RadioButton()
    { 
    	super();
    }

//    #endregion

//    #region private helpers

    private static void OnGroupNameChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
        RadioButton radioButton = (RadioButton)d; 
        String groupName = e.NewValue as String;
        String currentlyRegisteredGroupName = _currentlyRegisteredGroupName.GetValue(radioButton); 

        if (groupName != currentlyRegisteredGroupName)
        {
            // Unregister the old group name if set 
            if (!String.IsNullOrEmpty(currentlyRegisteredGroupName))
                Unregister(currentlyRegisteredGroupName, radioButton); 

            // Register the new group name is set
            if (!String.IsNullOrEmpty(groupName)) 
                Register(groupName, radioButton);
        }
    }

    private static void Register(String groupName, RadioButton radioButton)
    { 
        if (_groupNameToElements == null) 
            _groupNameToElements = new Hashtable(1);

        /*lock*/synchronized (_groupNameToElements)
        {
            ArrayList elements = (ArrayList)_groupNameToElements[groupName];

            if (elements == null)
            { 
                elements = new ArrayList(1); 
                _groupNameToElements[groupName] = elements;
            } 
            else
            {
                // There were some elements there, remove dead ones
                PurgeDead(elements, null); 
            }

            elements.Add(new WeakReference(radioButton)); 
        }
        _currentlyRegisteredGroupName.SetValue(radioButton, groupName); 
    }

    private static void Unregister(String groupName, RadioButton radioButton)
    { 
        if (_groupNameToElements == null)
            return; 

        /*lock*/synchronized (_groupNameToElements)
        { 
            // Get all elements bound to this key and remove this element
            ArrayList elements = (ArrayList)_groupNameToElements[groupName];

            if (elements != null) 
            {
                PurgeDead(elements, radioButton); 
                if (elements.Count == 0) 
                {
                    _groupNameToElements.Remove(groupName); 
                }
            }
        }
        _currentlyRegisteredGroupName.SetValue(radioButton, null); 
    }

    private static void PurgeDead(ArrayList elements, Object elementToRemove) 
    {
        for (int i = 0; i < elements.Count; ) 
        {
            WeakReference weakReference = (WeakReference)elements[i];
            Object element = weakReference.Target;
            if (element == null || element == elementToRemove) 
            {
                elements.RemoveAt(i); 
            } 
            else
            { 
                i++;
            }
        }
    } 

    private void UpdateRadioButtonGroup() 
    { 
        String groupName = GroupName;
        if (!String.IsNullOrEmpty(groupName)) 
        {
            Visual rootScope = KeyboardNavigation.GetVisualRoot(this);
            if (_groupNameToElements == null)
                _groupNameToElements = new Hashtable(1); 
            /*lock*/synchronized (_groupNameToElements)
            { 
                // Get all elements bound to this key and remove this element 
                ArrayList elements = (ArrayList)_groupNameToElements[groupName];
                for (int i = 0; i < elements.Count; ) 
                {
                    WeakReference weakReference = (WeakReference)elements[i];
                    RadioButton rb = weakReference.Target as RadioButton;
                    if (rb == null) 
                    {
                        // Remove dead instances 
                        elements.RemoveAt(i); 
                    }
                    else 
                    {
                        // Uncheck all checked RadioButtons different from the current one
                        if (rb != this && (rb.IsChecked == true) && rootScope == KeyboardNavigation.GetVisualRoot(rb))
                            rb.UncheckRadioButton(); 
                        i++;
                    } 
                } 
            }
        } 
        else // Logical parent should be the group
        {
            DependencyObject parent = this.Parent;
            if (parent != null) 
            {
                // Traverse logical children 
                IEnumerable children = LogicalTreeHelper.GetChildren(parent); 
                IEnumerator itor = children.GetEnumerator();
                while (itor.MoveNext()) 
                {
                    RadioButton rb = itor.Current as RadioButton;
                    if (rb != null && rb != this && String.IsNullOrEmpty(rb.GroupName) && (rb.IsChecked == true))
                        rb.UncheckRadioButton(); 
                }
            } 

        }
    } 

    private void UncheckRadioButton()
    {
        SetCurrentValueInternal(IsCheckedProperty, MS.Internal.KnownBoxes.BooleanBoxes.FalseBox); 
    }

//    #endregion 

//    #region Properties and Events 

    /// <summary>
    /// The DependencyID for the GroupName property.
    /// Default Value:      "String.Empty" 
    /// </summary>
    public static final DependencyProperty GroupNameProperty = DependencyProperty.Register( 
        "GroupName", 
        typeof(String),
        typeof(RadioButton), 
        new FrameworkPropertyMetadata(String.Empty, new PropertyChangedCallback(OnGroupNameChanged)));

    /// <summary>
    /// GroupName determine mutually excusive radiobutton groups 
    /// </summary>
//    [DefaultValue("")] 
//    [Localizability(LocalizationCategory.NeverLocalize)] // cannot be localized 
    public String GroupName
    { 
        get
        {
            return (String)GetValue(GroupNameProperty);
        } 

        set 
        { 
            SetValue(GroupNameProperty, value);
        } 
    }

//    #endregion

//    #region Override methods

    /// <summary> 
    /// Creates AutomationPeer (<see cref="UIElement.OnCreateAutomationPeer"/>)
    /// </summary> 
    protected /*override*/ /*System.Windows.Automation.Peers.*/AutomationPeer OnCreateAutomationPeer()
    {
        return new /*System.Windows.Automation.Peers.*/RadioButtonAutomationPeer(this);
    } 

    /// <summary> 
    ///     This method is invoked when the IsChecked becomes true. 
    /// </summary>
    /// <param name="e">RoutedEventArgs.</param> 
    protected /*override*/ void OnChecked(RoutedEventArgs e)
    {
        // If RadioButton is checked we should uncheck the others in the same group
        UpdateRadioButtonGroup(); 
        super.OnChecked(e);
    } 

    /// <summary>
    /// This /*override*/ method is called from OnClick(). 
    /// RadioButton implements its own toggle behavior
    /// </summary>
    protected /*internal*/ /*override*/ void OnToggle()
    { 
        SetCurrentValueInternal(IsCheckedProperty, MS.Internal.KnownBoxes.BooleanBoxes.TrueBox);
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

        super.OnAccessKey(e);
    }


//    #endregion

//    #region Accessibility 

//    #endregion Accessibility 

//    #region DTypeThemeStyleKey

    // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
    // value. Controls will /*override*/ this method to return approriate types.
    /*internal*/ public /*override*/ DependencyObjectType DTypeThemeStyleKey 
    { 
        get { return _dType; }
    } 

    private static DependencyObjectType _dType;

//    #endregion DTypeThemeStyleKey 

//    #region private data 

//    [ThreadStatic] 
    private static Hashtable _groupNameToElements;
    private static final UncommonField<String> _currentlyRegisteredGroupName = new UncommonField<String>(); 

//    #endregion private data
}
