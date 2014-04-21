package org.summer.view.widget.controls;

import org.summer.view.widget.DataTemplate;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.DependencyPropertyKey;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.FrameworkObject;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.LogicalTreeHelper;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.data.BindingExpressionBase;
import org.summer.view.widget.internal.Helper;
import org.summer.view.widget.markup.IAddChild;

/// <summary>
///     The base class for all controls with a single piece of content.
/// </summary> 
/// <remarks>
///     ContentControl adds Content, ContentTemplate, ContentTemplateSelector and Part features to a Control. 
/// </remarks> 
//[DefaultProperty("Content")]
//[ContentProperty("Content")] 
//[Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)]
public class ContentControl extends Control implements IAddChild
{
//    #region Constructors 
    /// <summary>
    ///     Default DependencyObject constructor 
    /// </summary> 
    /// <remarks>
    ///     Automatic determination of current Dispatcher. Use alternative constructor 
    ///     that accepts a Dispatcher for best performance.
    /// </remarks>
    public ContentControl() 
    { 
    	super();
    }

    static //ContentControl() 
    {
        DefaultStyleKeyProperty.OverrideMetadata(typeof(ContentControl), new FrameworkPropertyMetadata(typeof(ContentControl))); 
        _dType = DependencyObjectType.FromSystemTypeInternal(typeof(ContentControl));
    }

//    #endregion 

//    #region LogicalTree 

    /// <summary>
    ///     Returns enumerator to logical children 
    /// </summary>
    protected /*internal*/ /*override*/ IEnumerator LogicalChildren
    {
        get 
        {
            Object content = Content; 

            if (ContentIsNotLogical || content == null)
            { 
                return EmptyEnumerator.Instance;
            }

            // If the current ContentControl is in a Template.VisualTree and is meant to host 
            // the content for the container then that content shows up as the logical child
            // for the container and not for the current ContentControl. 
            DependencyObject templatedParent = this.TemplatedParent; 
            if (templatedParent != null)
            { 
               DependencyObject d = content as DependencyObject;
               if (d != null)
               {
                   DependencyObject logicalParent =  LogicalTreeHelper.GetParent(d); 
                   if (logicalParent != null && logicalParent != this)
                   { 
                       return EmptyEnumerator.Instance; 
                   }
               } 
            }

            return new ContentModelTreeEnumerator(this, content);
        } 
    }

//    #endregion 

//    #region Internal Methods 

    /// <summary>
    ///     Gives a String representation of this Object.
    /// </summary> 
    /// <returns></returns>
    /*internal*/ /*override*/ String GetPlainText() 
    { 
        return ContentObjectToString(Content);
    } 

    /*internal*/ static String ContentObjectToString(Object content)
    {
        if (content != null) 
        {
            FrameworkElement feContent = content as FrameworkElement; 
            if (feContent != null) 
            {
                return feContent.GetPlainText(); 
            }

            return content.ToString();
        } 

        return String.Empty; 
    } 

    /// <summary> 
    /// Prepare to display the item.
    /// </summary>
    /*internal*/public void PrepareContentControl(Object item,
                                    DataTemplate itemTemplate, 
                                    DataTemplateSelector itemTemplateSelector,
                                    String itemStringFormat) 
    { 
        if (item != this)
        { 
            // don't treat Content as a logical child
            ContentIsNotLogical = true;

            // copy styles from the ItemsControl 
            if (ContentIsItem || !HasNonDefaultValue(ContentProperty))
            { 
                Content = item; 
                ContentIsItem = true;
            } 
            if (itemTemplate != null)
                SetValue(ContentTemplateProperty, itemTemplate);
            if (itemTemplateSelector != null)
                SetValue(ContentTemplateSelectorProperty, itemTemplateSelector); 
            if (itemStringFormat != null)
                SetValue(ContentStringFormatProperty, itemStringFormat); 
        } 
        else
        { 
            ContentIsNotLogical = false;
        }
    }

    /// <summary>
    /// Undo the effect of PrepareContentControl. 
    /// </summary> 
    /*internal*/public void ClearContentControl(Object item)
    { 
        if (item != this)
        {
            if (ContentIsItem)
            { 
                Content = BindingExpressionBase.DisconnectedItem;
            } 
        } 
    }

    /// <summary>
    /// This method is used by TypeDescriptor to determine if this property should
    /// be serialized.
    /// </summary> 
    // Lets derived classes control the serialization behavior for Content DP
//    [EditorBrowsable(EditorBrowsableState.Never)] 
    public /*virtual*/ boolean ShouldSerializeContent() 
    {
        return ReadLocalValue(ContentProperty) != DependencyProperty.UnsetValue; 
    }
//    #endregion

//    #region IAddChild 

    /// <summary> 
    ///  Add an Object child to this control 
    /// </summary>
//    void IAddChild.AddChild(Object value) 
//    {
//        AddChild(value);
//    }

    /// <summary>
    ///  Add an Object child to this control 
    /// </summary> 
    public /*virtual*/ void AddChild(Object value)
    { 
        // if conent is the first child or being cleared, set directly
        if (Content == null || value == null)
        {
            Content = value; 
        }
        else 
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.ContentControlCannotHaveMultipleContent)*/);
        } 
    }

    /// <summary>
    ///  Add a text String to this control 
    /// </summary>
//    void IAddChild.AddText(String text) 
//    { 
//        AddText(text);
//    } 

    /// <summary>
    ///  Add a text String to this control
    /// </summary> 
    public /*virtual*/ void AddText(String text)
    { 
        AddChild(text); 
    }
//    #endregion IAddChild 

//    #region Properties

    /// <summary> 
    ///     The DependencyProperty for the Content property.
    ///     Flags:              None 
    ///     Default Value:      null 
    /// </summary>
//    [CommonDependencyProperty] 
    public static final DependencyProperty ContentProperty =
            DependencyProperty.Register(
                    "Content",
                    typeof(Object), 
                    typeof(ContentControl),
                    new FrameworkPropertyMetadata( 
                            (Object)null, 
                            new PropertyChangedCallback(OnContentChanged)));

    /// <summary>
    ///     Content is the data used to generate the child elements of this control.
    /// </summary>
//    [Bindable(true), CustomCategory("Content")] 
    public Object Content
    { 
        get { return GetValue(ContentProperty); } 
        set { SetValue(ContentProperty, value); }
    } 

    /// <summary>
    ///     Called when ContentProperty is invalidated on "d."
    /// </summary> 
    private static void OnContentChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
        ContentControl ctrl = (ContentControl) d; 
        ctrl.SetValue(HasContentPropertyKey, (e.NewValue != null) ? true : false);

        ctrl.OnContentChanged(e.OldValue, e.NewValue);
    }

    /// <summary> 
    ///     This method is invoked when the Content property changes.
    /// </summary> 
    /// <param name="oldContent">The old value of the Content property.</param> 
    /// <param name="newContent">The new value of the Content property.</param>
    protected /*virtual*/ void OnContentChanged(Object oldContent, Object newContent) 
    {
        // Remove the old content child
        RemoveLogicalChild(oldContent);

        // if Content should not be treated as a logical child, there's
        // nothing to do 
        if (ContentIsNotLogical) 
            return;

        DependencyObject d = newContent as DependencyObject;
        if (d != null)
        {
            DependencyObject logicalParent = LogicalTreeHelper.GetParent(d); 
            if (logicalParent != null)
            { 
                if (TemplatedParent != null && FrameworkObject.IsEffectiveAncestor(logicalParent, this)) 
                {
                    // In the case that this ContentControl belongs in a parent template 
                    // and represents the content of a parent, we do not wish to change
                    // the logical ancestry of the content.
                    return;
                } 
                else
                { 
                    // If the new content was previously hooked up to the logical 
                    // tree then we sever it from the old parent.
                    LogicalTreeHelper.RemoveLogicalChild(logicalParent, newContent); 
                }
            }
        }

        // Add the new content child
        AddLogicalChild(newContent); 
    } 

    /// <summary> 
    ///     The key needed set a read-only property.
    /// </summary>
    private static final DependencyPropertyKey HasContentPropertyKey =
            DependencyProperty.RegisterReadOnly( 
                    "HasContent",
                    typeof(Boolean), 
                    typeof(ContentControl), 
                    new FrameworkPropertyMetadata(
                            BooleanBoxes.FalseBox, 
                            FrameworkPropertyMetadataOptions.None));

    /// <summary>
    ///     The DependencyProperty for the HasContent property. 
    ///     Flags:              None
    ///     Other:              Read-Only 
    ///     Default Value:      false 
    /// </summary>
//    [CommonDependencyProperty] 
    public static final DependencyProperty HasContentProperty =
            HasContentPropertyKey.DependencyProperty;

    /// <summary> 
    ///     True if Content is non-null, false otherwise.
    /// </summary> 
//    [Browsable(false), ReadOnly(true)] 
    public boolean HasContent
    { 
        get { return (boolean) GetValue(HasContentProperty); }
    }

    /// <summary> 
    ///     The DependencyProperty for the ContentTemplate property.
    ///     Flags:              None 
    ///     Default Value:      null 
    /// </summary>
//    [CommonDependencyProperty] 
    public static final DependencyProperty ContentTemplateProperty =
            DependencyProperty.Register(
                    "ContentTemplate",
                    typeof(DataTemplate), 
                    typeof(ContentControl),
                    new FrameworkPropertyMetadata( 
                            (DataTemplate) null, 
                          new PropertyChangedCallback(OnContentTemplateChanged)));


    /// <summary>
    ///     ContentTemplate is the template used to display the content of the control.
    /// </summary> 
//    [Bindable(true), CustomCategory("Content")]
    public DataTemplate ContentTemplate 
    { 
        get { return (DataTemplate) GetValue(ContentTemplateProperty); }
        set { SetValue(ContentTemplateProperty, value); } 
    }

    /// <summary>
    ///     Called when ContentTemplateProperty is invalidated on "d." 
    /// </summary>
    private static void OnContentTemplateChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    { 
        ContentControl ctrl = (ContentControl)d;
        ctrl.OnContentTemplateChanged((DataTemplate) e.OldValue, (DataTemplate) e.NewValue); 
    }

    /// <summary>
    ///     This method is invoked when the ContentTemplate property changes. 
    /// </summary>
    /// <param name="oldContentTemplate">The old value of the ContentTemplate property.</param> 
    /// <param name="newContentTemplate">The new value of the ContentTemplate property.</param> 
    protected /*virtual*/ void OnContentTemplateChanged(DataTemplate oldContentTemplate, DataTemplate newContentTemplate)
    { 
        Helper.CheckTemplateAndTemplateSelector("Content", ContentTemplateProperty, ContentTemplateSelectorProperty, this);
    }

    /// <summary> 
    ///     The DependencyProperty for the ContentTemplateSelector property.
    ///     Flags:              None 
    ///     Default Value:      null 
    /// </summary>
//    [CommonDependencyProperty] 
    public static final DependencyProperty ContentTemplateSelectorProperty =
            DependencyProperty.Register(
                    "ContentTemplateSelector",
                    typeof(DataTemplateSelector), 
                    typeof(ContentControl),
                    new FrameworkPropertyMetadata( 
                            (DataTemplateSelector) null, 
                            new PropertyChangedCallback(OnContentTemplateSelectorChanged)));

    /// <summary>
    ///     ContentTemplateSelector allows the application writer to provide custom logic
    ///     for choosing the template used to display the content of the control.
    /// </summary> 
    /// <remarks>
    ///     This property is ignored if <seealso cref="ContentTemplate"/> is set. 
    /// </remarks> 
//    [Bindable(true), CustomCategory("Content")]
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)] 
    public DataTemplateSelector ContentTemplateSelector
    {
        get { return (DataTemplateSelector) GetValue(ContentTemplateSelectorProperty); }
        set { SetValue(ContentTemplateSelectorProperty, value); } 
    }

    /// <summary> 
    ///     Called when ContentTemplateSelectorProperty is invalidated on "d."
    /// </summary> 
    private static void OnContentTemplateSelectorChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        ContentControl ctrl = (ContentControl) d;
        ctrl.OnContentTemplateSelectorChanged((DataTemplateSelector) e.NewValue, (DataTemplateSelector) e.NewValue); 
    }

    /// <summary> 
    ///     This method is invoked when the ContentTemplateSelector property changes.
    /// </summary> 
    /// <param name="oldContentTemplateSelector">The old value of the ContentTemplateSelector property.</param>
    /// <param name="newContentTemplateSelector">The new value of the ContentTemplateSelector property.</param>
    protected /*virtual*/ void OnContentTemplateSelectorChanged(DataTemplateSelector oldContentTemplateSelector, DataTemplateSelector newContentTemplateSelector)
    { 
        Helper.CheckTemplateAndTemplateSelector("Content", ContentTemplateProperty, ContentTemplateSelectorProperty, this);
    } 

    /// <summary>
    ///     The DependencyProperty for the ContentStringFormat property. 
    ///     Flags:              None
    ///     Default Value:      null
    /// </summary>
//    [CommonDependencyProperty] 
    public static final DependencyProperty ContentStringFormatProperty =
            DependencyProperty.Register( 
                    "ContentStringFormat", 
                    typeof(String),
                    typeof(ContentControl), 
                    new FrameworkPropertyMetadata(
                            (String) null,
                          new PropertyChangedCallback(OnContentStringFormatChanged)));


    /// <summary> 
    ///     ContentStringFormat is the format used to display the content of 
    ///     the control as a String.  This arises only when no template is
    ///     available. 
    /// </summary>
//    [Bindable(true), CustomCategory("Content")]
    public String ContentStringFormat
    { 
        get { return (String) GetValue(ContentStringFormatProperty); }
        set { SetValue(ContentStringFormatProperty, value); } 
    } 

    /// <summary> 
    ///     Called when ContentStringFormatProperty is invalidated on "d."
    /// </summary>
    private static void OnContentStringFormatChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
        ContentControl ctrl = (ContentControl)d;
        ctrl.OnContentStringFormatChanged((String) e.OldValue, (String) e.NewValue); 
    } 

    /// <summary> 
    ///     This method is invoked when the ContentStringFormat property changes.
    /// </summary>
    /// <param name="oldContentStringFormat">The old value of the ContentStringFormat property.</param>
    /// <param name="newContentStringFormat">The new value of the ContentStringFormat property.</param> 
    protected /*virtual*/ void OnContentStringFormatChanged(String oldContentStringFormat, String newContentStringFormat)
    { 
    } 

//    #endregion 

//    #region Private methods

    // 
    //  Private Methods
    // 

    /// <summary>
    ///    Indicates whether Content should be a logical child or not. 
    /// </summary>
    /*internal*/ boolean ContentIsNotLogical
    {
        get { return ReadControlFlag(ControlBoolFlags.ContentIsNotLogical); } 
        set { WriteControlFlag(ControlBoolFlags.ContentIsNotLogical, value); }
    } 

    /// <summary>
    ///    Indicates whether Content is a data item 
    /// </summary>
    /*internal*/ boolean ContentIsItem
    {
        get { return ReadControlFlag(ControlBoolFlags.ContentIsItem); } 
        set { WriteControlFlag(ControlBoolFlags.ContentIsItem, value); }
    } 

    //
    //  This property 
    //  1. Finds the correct initial size for the _effectiveValues store on the current DependencyObject
    //  2. This is a performance optimization
    //
    /*internal*/ /*override*/ int EffectiveValuesInitialSize 
    {
        get { return 4; } 
    } 

//    #endregion Private methods 

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