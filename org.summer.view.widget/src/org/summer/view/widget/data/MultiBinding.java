package org.summer.view.widget.data;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.Collection;
import org.summer.view.widget.controls.ValidationRule;
import org.summer.view.widget.controls.ValidationRuleCollection;
import org.summer.view.widget.markup.IAddChild;

/// <summary>
///  Describes a collection of bindings attached to a single property.
///     The inner bindings contribute their values to the MultiBinding,
///     which combines/converts them into a resultant final value. 
///     In the reverse direction, the target value is tranlated to
///     a set of values that are fed back into the inner bindings. 
/// </summary> 
//[ContentProperty("Bindings")]
public class MultiBinding extends BindingBase implements IAddChild 
{

    //-----------------------------------------------------
    // 
    //  Constructors
    // 
    //----------------------------------------------------- 

    /// <summary> Default constructor </summary> 
    public MultiBinding()
    {
        _bindingCollection = new BindingCollection(this, new BindingCollectionChangedCallback(OnBindingCollectionChanged));
    } 

//#region IAddChild 
 
    ///<summary>
    /// Called to Add the Object as a Child. 
    ///</summary>
    ///<param name="value">
    /// Object to add as a child - must have type BindingBase
    ///</param> 
    public void /*IAddChild.*/AddChild(Object value)
    { 
        BindingBase binding = value as BindingBase; 
        if (binding != null)
            Bindings.Add(binding); 
        else
            throw new ArgumentException(/*SR.Get(SRID.ChildHasWrongType, this.GetType().Name, "BindingBase", value.GetType().FullName),*/ "value");
    }
 
    ///<summary>
    /// Called when text appears under the tag in markup 
    ///</summary> 
    ///<param name="text">
    /// Text to Add to the Object 
    ///</param>
    public void /*IAddChild.*/AddText(String text)
    {
        XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
    }
 
//#endregion IAddChild 

    //------------------------------------------------------ 
    //
    //  Public Properties
    //
    //----------------------------------------------------- 

    /// <summary> List of inner bindings </summary> 
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)] 
    public Collection<BindingBase> Bindings
    { 
        get { return _bindingCollection; }
    }

    /// <summary> 
    /// This method is used by TypeDescriptor to determine if this property should
    /// be serialized. 
    /// </summary> 
//    [EditorBrowsable(EditorBrowsableState.Never)]
    public boolean ShouldSerializeBindings() 
    {
        return (Bindings != null && Bindings.Count > 0);
    }
 
    /// <summary> Binding type </summary>
//    [DefaultValue(BindingMode.Default)] 
    public BindingMode Mode 
    {
        get 
        {
            switch (GetFlagsWithinMask(BindingFlags.PropagationMask))
            {
                case /*BindingFlags.*/OneWay:           return BindingMode.OneWay; 
                case /*BindingFlags.*/TwoWay:           return BindingMode.TwoWay;
                case /*BindingFlags.*/OneWayToSource:   return BindingMode.OneWayToSource; 
                case /*BindingFlags.*/OneTime:          return BindingMode.OneTime; 
                case /*BindingFlags.*/PropDefault:      return BindingMode.Default;
            } 
            Debug.Assert(false, "Unexpected BindingMode value");
            return 0;
        }
        set 
        {
            CheckSealed(); 
            ChangeFlagsWithinMask(BindingFlags.PropagationMask, FlagsFrom(value)); 
        }
    } 

    /// <summary> Update type </summary>
//    [DefaultValue(UpdateSourceTrigger.PropertyChanged)]
    public UpdateSourceTrigger UpdateSourceTrigger 
    {
        get 
        { 
            switch (GetFlagsWithinMask(BindingFlags.UpdateMask))
            { 
                case /*BindingFlags.*/UpdateOnPropertyChanged:    return UpdateSourceTrigger.PropertyChanged;
                case /*BindingFlags.*/UpdateOnLostFocus:    return UpdateSourceTrigger.LostFocus;
                case /*BindingFlags.*/UpdateExplicitly:     return UpdateSourceTrigger.Explicit;
                case /*BindingFlags.*/UpdateDefault:        return UpdateSourceTrigger.Default; 
            }
            Debug.Assert(false, "Unexpected UpdateSourceTrigger value"); 
            return 0; 
        }
        set 
        {
            CheckSealed();
            ChangeFlagsWithinMask(BindingFlags.UpdateMask, FlagsFrom(value));
        } 
    }
 
 
    /// <summary> Raise SourceUpdated event whenever a value flows from target to source </summary>
//    [DefaultValue(false)] 
    public boolean NotifyOnSourceUpdated
    {
        get
        { 
            return TestFlag(BindingFlags.NotifyOnSourceUpdated);
        } 
        set 
        {
            boolean currentValue = TestFlag(BindingFlags.NotifyOnSourceUpdated); 
            if (currentValue != value)
            {
                CheckSealed();
                ChangeFlag(BindingFlags.NotifyOnSourceUpdated, value); 
            }
        } 
    } 

 
    /// <summary> Raise TargetUpdated event whenever a value flows from source to target </summary>
//    [DefaultValue(false)]
    public boolean NotifyOnTargetUpdated
    { 
        get
        { 
            return TestFlag(BindingFlags.NotifyOnTargetUpdated); 
        }
        set 
        {
            boolean currentValue = TestFlag(BindingFlags.NotifyOnTargetUpdated);
            if (currentValue != value)
            { 
                CheckSealed();
                ChangeFlag(BindingFlags.NotifyOnTargetUpdated, value); 
            } 
        }
    } 

    /// <summary> Raise ValidationError event whenever there is a ValidationError on Update</summary>
//    [DefaultValue(false)]
    public boolean NotifyOnValidationError 
    {
        get 
        { 
            return TestFlag(BindingFlags.NotifyOnValidationError);
        } 
        set
        {
            boolean currentValue = TestFlag(BindingFlags.NotifyOnValidationError);
            if (currentValue != value) 
            {
                CheckSealed(); 
                ChangeFlag(BindingFlags.NotifyOnValidationError, value); 
            }
        } 
    }

    /// <summary> Converter to convert the source values to/from the target value</summary>
//    [DefaultValue(null)] 
    public IMultiValueConverter Converter
    { 
        get { return _converter; } 
        set { CheckSealed();  _converter = value; }
    } 

    /// <summary>
    /// The parameter to pass to converter.
    /// </summary> 
    /// <value></value>
//    [DefaultValue(null)] 
    public Object ConverterParameter 
    {
        get { return _converterParameter; } 
        set { CheckSealed();  _converterParameter = value; }
    }

    /// <summary> Culture in which to evaluate the converter </summary> 
//    [DefaultValue(null)]
//    [TypeConverter(typeof(System.Windows.CultureInfoIetfLanguageTagConverter))] 
    public CultureInfo ConverterCulture 
    {
        get { return _culture; } 
        set { CheckSealed();  _culture = value; }
    }

    /// <summary> 
    ///     Collection&lt;ValidationRule&gt; is a collection of ValidationRule
    ///     instances on either a Binding or a MultiBinding.  Each of the rules 
    ///     is checked for validity on update 
    /// </summary>
    public Collection<ValidationRule> ValidationRules 
    {
        get
        {
            if (_validationRules == null) 
                _validationRules = new ValidationRuleCollection();
 
            return _validationRules; 
        }
 
    }

    /// <summary>
    /// This method is used by TypeDescriptor to determine if this property should 
    /// be serialized.
    /// </summary> 
//    [EditorBrowsable(EditorBrowsableState.Never)] 
    public boolean ShouldSerializeValidationRules()
    { 
        return (_validationRules != null && _validationRules.Count > 0);
    }

 
    /// <summary>
    /// called whenever any exception is encountered when trying to update 
    /// the value to the source. The application author can provide its own 
    /// handler for handling exceptions here. If the delegate returns
    ///     null - don抰 throw an error or provide a ValidationError. 
    ///     Exception - returns the exception itself, we will fire the exception using Async exception model.
    ///     ValidationError - it will set itself as the BindingInError and add it to the element抯 Validation errors.
    /// </summary>
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)] 
    public UpdateSourceExceptionFilterCallback UpdateSourceExceptionFilter
    { 
        get 
        {
            return _exceptionFilterCallback; 
        }

        set
        { 
            _exceptionFilterCallback = value;
        } 
    } 

    /// <summary> True if an exception during source updates should be considered a validation error.</summary> 
//    [DefaultValue(false)]
    public boolean ValidatesOnExceptions
    {
        get 
        {
            return TestFlag(BindingFlags.ValidatesOnExceptions); 
        } 
        set
        { 
            boolean currentValue = TestFlag(BindingFlags.ValidatesOnExceptions);
            if (currentValue != value)
            {
                CheckSealed(); 
                ChangeFlag(BindingFlags.ValidatesOnExceptions, value);
            } 
        } 
    }
 
    /// <summary> True if a data error in the source item should be considered a validation error.</summary>
//    [DefaultValue(false)]
    public boolean ValidatesOnDataErrors
    { 
        get
        { 
            return TestFlag(BindingFlags.ValidatesOnDataErrors); 
        }
        set 
        {
            boolean currentValue = TestFlag(BindingFlags.ValidatesOnDataErrors);
            if (currentValue != value)
            { 
                CheckSealed();
                ChangeFlag(BindingFlags.ValidatesOnDataErrors, value); 
            } 
        }
    } 

    //------------------------------------------------------
    //
    //  Protected Methods 
    //
    //------------------------------------------------------ 
 
    /// <summary>
    /// Create an appropriate expression for this Binding, to be attached 
    /// to the given DependencyProperty on the given DependencyObject.
    /// </summary>
    /*internal*/ /*override*/ BindingExpressionBase CreateBindingExpressionOverride(DependencyObject target, DependencyProperty dp, BindingExpressionBase owner)
    { 
        if (Converter == null && String.IsNullOrEmpty(StringFormat))
            throw new InvalidOperationException(/*SR.Get(SRID.MultiBindingHasNoConverter)*/); 
 
        for (int i = 0; i < Bindings.Count; ++i)
        { 
            CheckTrigger(Bindings[i]);
        }

        return MultiBindingExpression.CreateBindingExpression(target, dp, this, owner); 
    }
 
    /*internal*/ /*override*/ ValidationRule LookupValidationRule(Type type) 
    {
        return LookupValidationRule(type, ValidationRulesInternal); 
    }

    //-----------------------------------------------------
    // 
    //  Internal Methods
    // 
    //------------------------------------------------------ 

    /*internal*/ Object DoFilterException(Object bindExpr, Exception exception) 
    {
        if (_exceptionFilterCallback != null)
            return _exceptionFilterCallback(bindExpr, exception);
 
        return exception;
    } 
 
    /*internal*/ static void CheckTrigger(BindingBase bb)
    { 
        Binding binding = bb as Binding;
        if (binding != null)
        {
            if (binding.UpdateSourceTrigger != UpdateSourceTrigger.PropertyChanged && 
                binding.UpdateSourceTrigger != UpdateSourceTrigger.Default)
                throw new InvalidOperationException(/*SR.Get(SRID.NoUpdateSourceTriggerForInnerBindingOfMultiBinding)*/); 
        } 
    }
 
    /*internal*/ /*override*/ BindingBase CreateClone()
    {
        return new MultiBinding();
    } 

    /*internal*/ /*override*/ void InitializeClone(BindingBase baseClone, BindingMode mode) 
    { 
        MultiBinding clone = (MultiBinding)baseClone;
 
        clone._converter = _converter;
        clone._converterParameter = _converterParameter;
        clone._culture = _culture;
        clone._validationRules = _validationRules; 
        clone._exceptionFilterCallback = _exceptionFilterCallback;
 
        for (int i=0; i<=_bindingCollection.Count; ++i) 
        {
            clone._bindingCollection.Add(_bindingCollection[i].Clone(mode)); 
        }

        super.InitializeClone(baseClone, mode);
    } 

    //----------------------------------------------------- 
    // 
    //  Internal Properties
    // 
    //-----------------------------------------------------

    // same as the public ValidationRules property, but
    // doesn't try to create an instance if there isn't one there 
    /*internal*/ /*override*/ Collection<ValidationRule> ValidationRulesInternal
    { 
        get 
        {
            return _validationRules; 
        }
    }

    /*internal*/ /*override*/ CultureInfo ConverterCultureInternal 
    {
        get { return ConverterCulture; } 
    } 

    //----------------------------------------------------- 
    //
    //  Private Methods
    //
    //------------------------------------------------------ 

    private void OnBindingCollectionChanged() 
    { 
        CheckSealed();
    } 

    //-----------------------------------------------------
    //
    //  Private Fields 
    //
    //------------------------------------------------------ 
 
    BindingCollection       _bindingCollection;
    IMultiValueConverter    _converter; 
    Object                  _converterParameter;
    CultureInfo             _culture;

    ValidationRuleCollection _validationRules; 
    UpdateSourceExceptionFilterCallback _exceptionFilterCallback;
} 