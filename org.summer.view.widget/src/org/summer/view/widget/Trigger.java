package org.summer.view.widget;

import org.summer.view.widget.collection.HybridDictionary;
import org.summer.view.widget.data.Expression;
import org.summer.view.widget.markup.DependencyPropertyConverter;
import org.summer.view.widget.markup.IAddChild;
import org.summer.view.widget.markup.MarkupExtension;
import org.summer.view.widget.markup.NullExtension;
import org.summer.view.widget.model.ISupportInitialize;
import org.summer.view.widget.model.ITypeDescriptorContext;


/// <summary> 
///     A single Style property conditional dependency driver
/// </summary> 
//[ContentProperty("Setters")] 
//[XamlSetTypeConverterAttribute("ReceiveTypeConverter")]
public class Trigger extends TriggerBase implements IAddChild, ISupportInitialize 
{
    /// <summary>
    ///     DependencyProperty of the conditional
    /// </summary> 
//    [Ambient]
//    [Localizability(LocalizationCategory.None, Modifiability = Modifiability.Unmodifiable, Readability = Readability.Unreadable)] // Not localizable by-default 
    public DependencyProperty Property 
    {
        get 
        {
            // Verify Context Access
            VerifyAccess();

            return _property;
        } 
        set 
        {
            // Verify Context Access 
            VerifyAccess();

            if (IsSealed)
            { 
                throw new InvalidOperationException(/*SR.Get(SRID.CannotChangeAfterSealed, "Trigger")*/);
            } 

            _property = value;
        } 
    }

    /// <summary>
    ///     Value of the condition (equality check) 
    /// </summary>
//    [DependsOn("Property")] 
//    [DependsOn("SourceName")] 
//    [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] // Not localizable by-default
//    [TypeConverter(typeof(SetterTriggerConditionValueConverter))] 
    public Object Value
    {
        get
        { 
            // Verify Context Access
            VerifyAccess(); 

            return _value;
        } 
        set
        {
            // Verify Context Access
            VerifyAccess(); 

            if (IsSealed) 
            { 
                throw new InvalidOperationException(/*SR.Get(SRID.CannotChangeAfterSealed, "Trigger")*/);
            } 

            if (value instanceof NullExtension)
            {
                value = null; 
            }

            if (value instanceof MarkupExtension) 
            {
                throw new ArgumentException(/*SR.Get(SRID.ConditionValueOfMarkupExtensionNotSupported, 
                                                   value.GetType().Name)*/);
            }

            if (value instanceof Expression) 
            {
                throw new ArgumentException(/*SR.Get(SRID.ConditionValueOfExpressionNotSupported)*/); 
            } 

            _value = value; 
        }
    }

    /// <summary> 
    /// The x:Name of the Object whose property shall
    /// trigger the associated setters to be applied. 
    /// If null, then this is the Object being Styled 
    /// and not anything under its Template Tree.
    /// </summary> 
//    [DefaultValue(null)]
//    [Ambient]
    public String SourceName
    { 
        get
        { 
            // Verify Context Access 
            VerifyAccess();

            return _sourceName;
        }
        set
        { 
            // Verify Context Access
            VerifyAccess(); 

            if( IsSealed )
            { 
                throw new InvalidOperationException(/*SR.Get(SRID.CannotChangeAfterSealed, "Trigger")*/);
            }

            _sourceName = value; 
        }
    } 

    /// <summary>
    /// Collection of Setter objects, which describes what to apply 
    /// when this trigger is active.
    /// </summary>
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
    public SetterBaseCollection Setters 
    {
        get 
        { 
            // Verify Context Access
            VerifyAccess(); 

            if( _setters == null )
            {
                _setters = new SetterBaseCollection(); 
            }
            return _setters; 
        } 
    }

    ///<summary>
    /// This method is called to Add a Setter Object as a child of the Style.
    ///</summary>
    ///<param name="value"> 
    /// The Object to add as a child; it must be a Setter or subclass.
    ///</param> 
    public void /*IAddChild.*/AddChild (Object value) 
    {
        // Verify Context Access 
        VerifyAccess();

        Setters.Add(Trigger.CheckChildIsSetter(value));
    } 

    ///<summary> 
    /// This method is called by the parser when text appears under the tag in markup. 
    /// As default Styles do not support text, calling this method has no effect.
    ///</summary> 
    ///<param name="text">
    /// Text to add as a child.
    ///</param>
    public void /*IAddChild.*/AddText (String text) 
    {
        // Verify Context Access 
        VerifyAccess(); 

        XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
    }

    // Shared by PropertyTrigger, MultiPropertyTrigger, DataTrigger, MultiDataTrigger
    /*internal*/ public  static Setter CheckChildIsSetter( Object o ) 
    {
        if (o == null) 
        { 
            throw new ArgumentNullException("o");
        } 

        Setter setter = o as Setter;

        if (setter == null) 
        {
            throw new ArgumentException(/*SR.Get(SRID.UnexpectedParameterType, o.GetType(), typeof(Setter)),*/ "o"); 
        } 

        return setter; 
    }

    /*internal*/ public  /*sealed*/ /*override*/ void Seal()
    { 
        if (IsSealed)
        { 
            return; 
        }

        if (_property != null)
        {
            // Ensure valid condition
            if (!_property.IsValidValue(_value)) 
            {
                throw new InvalidOperationException(/*SR.Get(SRID.InvalidPropertyValue, _value, _property.Name )*/); 
            } 
        }

        // Freeze the condition for the trigger
        StyleHelper.SealIfSealable(_value);

        // Process the _setters collection: Copy values into PropertyValueList and seal the Setter objects. 
        ProcessSettersCollection(_setters);

        // Build conditions array from collection 
        TriggerConditions = new TriggerCondition[] {
            new TriggerCondition( 
                _property,
                LogicalOp.Equals,
                _value,
                (_sourceName != null) ? _sourceName : StyleHelper.SelfName) }; 

        // Set Condition for all property triggers 
        for (int i = 0; i < PropertyValues.Count; i++) 
        {
            PropertyValue propertyValue = PropertyValues[i]; 
            propertyValue.Conditions = TriggerConditions;
            // Put back modified struct
            PropertyValues[i] = propertyValue;
        } 

        super.Seal(); 
    } 

    // evaluate the current state of the trigger 
    /*internal*/ public  /*override*/ boolean GetCurrentState(DependencyObject container, UncommonField<HybridDictionary[]> dataField)
    {
//        Debug.Assert( TriggerConditions != null && TriggerConditions.Length == 1,
//            "This method assumes there is exactly one TriggerCondition." ); 
//
//        Debug.Assert( TriggerConditions[0].SourceChildIndex == 0, 
//            "This method was created to handle properties on the containing Object, more work is needed to handle templated children too." ); 

        return TriggerConditions[0].Match(container.GetValue(TriggerConditions[0].Property)); 
    }

//    #region ISupportInitialize Members

    public void /*ISupportInitialize.*/BeginInit()
    { 
    } 

    public void /*ISupportInitialize.*/EndInit() 
    {
        // Resolve all properties here
        if (_unresolvedProperty != null)
        { 
            try
            { 
                Property = DependencyPropertyConverter.ResolveProperty(_serviceProvider, 
                    SourceName, _unresolvedProperty);
            } 
            finally
            {
                _unresolvedProperty = null;
            } 
        }
        if (_unresolvedValue != null) 
        { 
            try
            { 
                Value = SetterTriggerConditionValueConverter.ResolveValue(_serviceProvider,
                    Property, _cultureInfoForTypeConverter, _unresolvedValue);
            }
            finally 
            {
                _unresolvedValue = null; 
            } 
        }
        _serviceProvider = null; 
        _cultureInfoForTypeConverter = null;
    }

//    #endregion 

    public static void ReceiveTypeConverter(Object targetObject, XamlSetTypeConverterEventArgs eventArgs) 
    { 
        Trigger trigger = targetObject as Trigger;
        if (trigger == null) 
        {
            throw new ArgumentNullException("targetObject");
        }
        if (eventArgs == null) 
        {
            throw new ArgumentNullException("eventArgs"); 
        } 

        if (eventArgs.Member.Name == "Property") 
        {
            trigger._unresolvedProperty = eventArgs.Value;
            trigger._serviceProvider = eventArgs.ServiceProvider;
            trigger._cultureInfoForTypeConverter = eventArgs.CultureInfo; 

            eventArgs.Handled = true; 
        } 
        else if (eventArgs.Member.Name == "Value")
        { 
            trigger._unresolvedValue = eventArgs.Value;
            trigger._serviceProvider = eventArgs.ServiceProvider;
            trigger._cultureInfoForTypeConverter = eventArgs.CultureInfo;

            eventArgs.Handled = true;
        } 
    } 

    private DependencyProperty _property; 
    private Object _value = DependencyProperty.UnsetValue;
    private String _sourceName = null;
    private SetterBaseCollection _setters = null;
    private Object _unresolvedProperty = null; 
    private Object _unresolvedValue = null;
    private ITypeDescriptorContext _serviceProvider = null; 
    private CultureInfo _cultureInfoForTypeConverter = null; 
}