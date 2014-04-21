package org.summer.view.widget.controls;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.PropertyMetadata;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.data.Binding;
/// <summary> 
/// DatePickerTextBox is a specialized form of TextBox which displays custom visuals when its contents are empty
/// </summary> 
//[TemplatePart(Name = DatePickerTextBox.ElementContentName, Type = typeof(ContentControl))]
public /*sealed partial*/ class DatePickerTextBox extends TextBox
{
//    #region Constants 
    private final String ElementContentName = "PART_Watermark";

//    #endregion 

//    #region Data 

    private ContentControl elementContent;

//    #endregion 

//    #region Constructor 

    /// <summary>
    /// Static constructor 
    /// </summary>
    static DatePickerTextBox()
    {
        DefaultStyleKeyProperty.OverrideMetadata(typeof(DatePickerTextBox), new FrameworkPropertyMetadata(typeof(DatePickerTextBox))); 
        TextProperty.OverrideMetadata(typeof(DatePickerTextBox), new FrameworkPropertyMetadata(OnVisualStatePropertyChanged));
    } 

    /// <summary>
    /// Initializes a new instance of the <see cref="DatePickerTextBox"/> class. 
    /// </summary>
    public DatePickerTextBox()
    {
        this.SetCurrentValue(WatermarkProperty, SR.Get(SRID.DatePickerTextBox_DefaultWatermarkText)); 
        this.Loaded += OnLoaded;
        this.IsEnabledChanged += new DependencyPropertyChangedEventHandler(OnDatePickerTextBoxIsEnabledChanged); 
    } 
//    #endregion

//    #region Public Properties

//    #region Watermark
    /// <summary> 
    /// Watermark dependency property
    /// </summary> 
    /*internal*/ public static final DependencyProperty WatermarkProperty = DependencyProperty.Register( 
        "Watermark", typeof(Object), typeof(DatePickerTextBox), new PropertyMetadata(OnWatermarkPropertyChanged));

    /// <summary>
    /// Watermark content
    /// </summary>
    /// <value>The watermark.</value> 
    /*internal*/ public Object Watermark
    { 
        get { return (Object)GetValue(WatermarkProperty); } 
        set { SetValue(WatermarkProperty, value); }
    } 

//    #endregion

//    #endregion Public Properties 

//    #region Protected 

    /// <summary>
    /// Called when template is applied to the control. 
    /// </summary>
    public /*override*/ void OnApplyTemplate()
    {
        super.OnApplyTemplate(); 

        elementContent = ExtractTemplatePart<ContentControl>(ElementContentName); 

        // We dont want to expose watermark property as public yet, because there
        // is a good chance in future that the implementation will change when 
        // a WatermarkTextBox control gets implemented. This is mostly to
        // mimc SL. Hence setting the binding in code rather than in control template.
        if (elementContent != null)
        { 
            Binding watermarkBinding = new Binding("Watermark");
            watermarkBinding.Source = this; 
            elementContent.SetBinding(ContentControl.ContentProperty, watermarkBinding); 
        }

        OnWatermarkChanged();
    }

    protected /*override*/ void OnGotFocus(RoutedEventArgs e) 
    {
        super.OnGotFocus(e); 
        if (IsEnabled) 
        {
            if (!String.IsNullOrEmpty(this.Text)) 
            {
                Select(0, this.Text.Length);
            }
        } 
    }

//    #endregion Protected 

//    #region Private 

    private void OnLoaded(Object sender, RoutedEventArgs e)
    {
        ApplyTemplate(); 
    }

    /// <summary> 
    /// Change to the correct visual state for the textbox.
    /// </summary> 
    /// <param name="useTransitions">
    /// true to use transitions when updating the visual state, false to
    /// snap directly to the new visual state.
    /// </param> 
    /*internal*/ public /*override*/ void ChangeVisualState(boolean useTransitions)
    { 
        super.ChangeVisualState(useTransitions); 

        // Update the WatermarkStates group 
        if (this.Watermark != null && String.IsNullOrEmpty(this.Text))
        {
            VisualStates.GoToState(this, useTransitions, VisualStates.StateWatermarked, VisualStates.StateUnwatermarked);
        } 
        else
        { 
            VisualStates.GoToState(this, useTransitions, VisualStates.StateUnwatermarked); 
        }
    } 

    private T ExtractTemplatePart<T>(String partName) where T : DependencyObject
    {
        DependencyObject obj = GetTemplateChild(partName); 
        return ExtractTemplatePart<T>(partName, obj);
    } 

    private static T ExtractTemplatePart<T>(String partName, DependencyObject obj) where T : DependencyObject
    { 
        Debug.Assert(
            obj == null || typeof(T).IsInstanceOfType(obj),
            String.Format(CultureInfo.InvariantCulture, SR.Get(SRID.DatePickerTextBox_TemplatePartIsOfIncorrectType), partName, typeof(T).Name));
        return obj as T; 
    }

    /// <summary> 
    /// Called when the IsEnabled property changes.
    /// </summary> 
    /// <param name="sender">Sender Object</param>
    /// <param name="e">Property changed args</param>
    private void OnDatePickerTextBoxIsEnabledChanged(Object sender, DependencyPropertyChangedEventArgs e)
    { 
        Debug.Assert(e.NewValue is boolean);
        boolean isEnabled = (boolean)e.NewValue; 

        SetCurrentValueInternal(IsReadOnlyProperty, MS.Internal.KnownBoxes.BooleanBoxes.Box(!isEnabled));
    } 

    private void OnWatermarkChanged()
    {
        if (elementContent != null) 
        {
            Control watermarkControl = this.Watermark as Control; 
            if (watermarkControl != null) 
            {
                watermarkControl.IsTabStop = false; 
                watermarkControl.IsHitTestVisible = false;
            }
        }
    } 

    /// <summary> 
    /// Called when watermark property is changed. 
    /// </summary>
    /// <param name="sender">The sender.</param> 
    /// <param name="args">The <see cref="System.Windows.DependencyPropertyChangedEventArgs"/> instance containing the event data.</param>
    private static void OnWatermarkPropertyChanged(DependencyObject sender, DependencyPropertyChangedEventArgs args)
    {
        DatePickerTextBox datePickerTextBox = sender as DatePickerTextBox; 
        Debug.Assert(datePickerTextBox != null, "The source is not an instance of a DatePickerTextBox!");
        datePickerTextBox.OnWatermarkChanged(); 
        datePickerTextBox.UpdateVisualState(); 
    }

//    #endregion Private
}