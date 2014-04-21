package org.summer.view.widget;

import org.summer.view.widget.data.BindingBase;
import org.summer.view.widget.data.Expression;
import org.summer.view.widget.markup.DependencyPropertyConverter;
import org.summer.view.widget.markup.DynamicResourceExtension;
import org.summer.view.widget.markup.MarkupExtension;
import org.summer.view.widget.markup.StaticResourceExtension;
import org.summer.view.widget.model.ISupportInitialize;
import org.summer.view.widget.model.ITypeDescriptorContext;

/// <summary>
///     TargetType property setting class.
/// </summary> 
//[XamlSetMarkupExtensionAttribute("ReceiveMarkupExtension")]
//[XamlSetTypeConverterAttribute("ReceiveTypeConverter")] 
public class Setter extends SetterBase implements ISupportInitialize 
{
    /// <summary> 
    ///     Property Setter construction - set everything to null or DependencyProperty.UnsetValue
    /// </summary>
    public Setter()
    { 

    } 

    /// <summary>
    ///     Property Setter construction - given property and value 
    /// </summary>
    public Setter( DependencyProperty property, Object value )
    {
        Initialize( property, value, null ); 
    }

    /// <summary> 
    ///     Property Setter construction - given property, value, and String identifier for child node.
    /// </summary> 
    public Setter( DependencyProperty property, Object value, String targetName )
    {
        Initialize( property, value, targetName );
    } 

    /// <summary> 
    ///     Method that does all the initialization work for the constructors. 
    /// </summary>
    private void Initialize( DependencyProperty property, Object value, String target ) 
    {
        if( value == DependencyProperty.UnsetValue )
        {
            throw new IllegalArgumentException(/*SR.Get(SRID.SetterValueCannotBeUnset)*/); 
        }

        CheckValidProperty(property); 

        // No null check for target since null is a valid value. 

        _property = property;
        _value = value;
        _target = target; 
    }

    private void CheckValidProperty( DependencyProperty property) 
    {
        if (property == null) 
        {
            throw new IllegalArgumentException("property");
        }
        if (property.ReadOnly) 
        {
            // Read-only properties will not be consulting Style/Template/Trigger Setter for value. 
            //  Rather than silently do nothing, throw error. 
            throw new IllegalArgumentException(/*SR.Get(SRID.ReadOnlyPropertyNotAllowed, property.Name, GetType().Name)*/);
        } 
        if( property == FrameworkElement.NameProperty)
        {
            throw new IllegalArgumentException(/*SR.Get(SRID.CannotHavePropertyInStyle, FrameworkElement.NameProperty.Name)*/);
        } 
    }

    /// <summary> 
    ///     Seals this setter
    /// </summary> 
    /*internal*/ public  /*override*/ void Seal()
    {

        // Do the validation that can't be done until we know all of the property 
        // values.

        DependencyProperty dp = Property; 
        Object value = ValueInternal;

        if (dp == null)
        {
            throw new IllegalArgumentException(/*SR.Get(SRID.NullPropertyIllegal, "Setter.Property")*/);
        } 

        if( String.IsNullOrEmpty(TargetName)) 
        { 
            // Setter on container is not allowed to affect the StyleProperty.
            if (dp == FrameworkElement.StyleProperty) 
            {
                throw new IllegalArgumentException(/*SR.Get(SRID.StylePropertyInStyleNotAllowed)*/);
            }
        } 

        // Value needs to be valid for the DP, or a deferred reference, or one of the supported 
        // markup extensions. 

        if (!dp.IsValidValue(value)) 
        {
            // The only markup extensions supported by styles is resources and bindings.
            if (value instanceof MarkupExtension)
            { 
                if ( !(value instanceof DynamicResourceExtension) && !(value instanceof BindingBase) )
                { 
                    throw new IllegalArgumentException(/*SR.Get(SRID.SetterValueOfMarkupExtensionNotSupported, 
                                                       value.GetType().Name)*/);
                } 
            }

            else if (!(value instanceof DeferredReference))
            { 
                throw new IllegalArgumentException(/*SR.Get(SRID.InvalidSetterValue, value, dp.OwnerType, dp.Name)*/);
            } 
        } 

        // Freeze the value for the setter 
        StyleHelper.SealIfSealable(_value);

        super.Seal();
    } 

    /// <summary> 
    ///    Property that is being set by this setter 
    /// </summary>
//    [Ambient] 
//    [DefaultValue(null)]
//    [Localizability(LocalizationCategory.None, Modifiability = Modifiability.Unmodifiable, Readability = Readability.Unreadable)] // Not localizable by-default
    public DependencyProperty Property
    { 
        get { return _property; }
        set 
        { 
            CheckValidProperty(value);
            CheckSealed(); 
            _property = value;
        }

    } 

    /// <summary> 
    ///    Property value that is being set by this setter 
    /// </summary>
//    [System.Windows.Markup.DependsOn("Property")] 
//    [System.Windows.Markup.DependsOn("TargetName")]
//    [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] // Not localizable by-default
//    [TypeConverter(typeof(System.Windows.Markup.SetterTriggerConditionValueConverter))]
    public Object Value 
    {
        get 
        { 
            // Inflate the deferred reference if the _value is one of those.
            DeferredReference deferredReference = _value as DeferredReference; 
            if (deferredReference != null)
            {
                _value = deferredReference.GetValue(BaseValueSourceInternal.Unknown);
            } 

            return _value; 
        } 

        set 
        {
            if( value == DependencyProperty.UnsetValue )
            {
                throw new IllegalArgumentException(/*SR.Get(SRID.SetterValueCannotBeUnset)*/); 
            }

            CheckSealed(); 

            // No Expression support 
            if( value instanceof Expression )
            {
                throw new IllegalArgumentException(/*SR.Get(SRID.StyleValueOfExpressionNotSupported)*/);
            } 


            _value = value; 
        }
    } 

    /// <summary>
    ///     Internal property used so that we obtain the value as
    ///     is without having to inflate the DeferredReference. 
    /// </summary>
    /*internal*/ public  Object ValueInternal 
    { 
        get { return _value; }
    } 

    /// <summary>
    ///     When the set is directed at a child node, this String
    /// identifies the intended target child node. 
    /// </summary>
//    [DefaultValue(null)] 
//    [Ambient] 
    public String TargetName
    { 
        get
        {
            return _target;
        } 
        set
        { 
            // Setting to null is allowed, to clear out value. 
            CheckSealed();
            _target = value; 
        }
    }

    public static void ReceiveMarkupExtension(Object targetObject, XamlSetMarkupExtensionEventArgs eventArgs) 
    {
        if (targetObject == null) 
        { 
            throw new IllegalArgumentException("targetObject");
        } 
        if (eventArgs == null)
        {
            throw new IllegalArgumentException("eventArgs");
        } 

        Setter setter = targetObject as Setter; 

        if (setter == null || eventArgs.Member.Name != "Value")
        { 
            return;
        }

        MarkupExtension me = eventArgs.MarkupExtension; 

        if (me instanceof StaticResourceExtension) 
        { 
        	StaticResourceExtension sr = (StaticResourceExtension)me  ;
            setter.Value = sr.ProvideValueInternal(eventArgs.ServiceProvider, true /*allowDeferedReference*/); 
            eventArgs.Handled = true;
        }
        else if (me instanceof DynamicResourceExtension || me instanceof BindingBase)
        { 
            setter.Value = me;
            eventArgs.Handled = true; 
        } 
    }

    public static void ReceiveTypeConverter(Object targetObject, XamlSetTypeConverterEventArgs eventArgs)
    {
        Setter setter = targetObject as Setter;
        if (setter == null) 
        {
            throw new IllegalArgumentException("targetObject"); 
        } 
        if (eventArgs == null)
        { 
            throw new IllegalArgumentException("eventArgs");
        }

        if (eventArgs.Member.Name == "Property") 
        {
            setter._unresolvedProperty = eventArgs.Value; 
            setter._serviceProvider = eventArgs.ServiceProvider; 
            setter._cultureInfoForTypeConverter = eventArgs.CultureInfo;

            eventArgs.Handled = true;
        }
        else if (eventArgs.Member.Name == "Value")
        { 
            setter._unresolvedValue = eventArgs.Value;
            setter._serviceProvider = eventArgs.ServiceProvider; 
            setter._cultureInfoForTypeConverter = eventArgs.CultureInfo; 

            eventArgs.Handled = true; 
        }
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
                    TargetName, _unresolvedProperty); 
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

    private DependencyProperty    _property = null;
    private Object                _value    = DependencyProperty.UnsetValue; 
    private String                _target   = null;
    private Object _unresolvedProperty = null;
    private Object _unresolvedValue = null;
    private ITypeDescriptorContext _serviceProvider = null; 
    private CultureInfo _cultureInfoForTypeConverter = null;

} 