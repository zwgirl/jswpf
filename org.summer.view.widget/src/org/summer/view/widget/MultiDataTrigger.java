package org.summer.view.widget;

import org.summer.view.widget.markup.IAddChild;

/// <summary> 
///     A multiple Style data conditional dependency driver
/// </summary> 
//[ContentProperty("Setters")] 
public /*sealed*/ class MultiDataTrigger extends TriggerBase implements IAddChild
{ 
    /// <summary>
    ///     Conditions collection
    /// </summary>
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)] 
    public ConditionCollection Conditions
    { 
        get 
        {
            // Verify Context Access 
            VerifyAccess();

            return _conditions;
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

    /*internal*/ public  /*override*/ void Seal()
    {
        if (IsSealed) 
        {
            return; 
        } 

        // Process the _setters collection: Copy values into PropertyValueList and seal the Setter objects. 
        ProcessSettersCollection(_setters);

        if (_conditions.Count > 0)
        { 
            // Seal conditions
            _conditions.Seal(ValueLookupType.DataTrigger); 
        } 

        // Build conditions array from collection 
        TriggerConditions = new TriggerCondition[_conditions.Count];

        for (int i = 0; i < TriggerConditions.Length; ++i)
        { 
            if (_conditions[i].SourceName != null && _conditions[i].SourceName.Length > 0)
            { 
                throw new InvalidOperationException(SR.Get(SRID.SourceNameNotSupportedForDataTriggers)); 
            }

            TriggerConditions[i] = new TriggerCondition(
                _conditions[i].Binding,
                LogicalOp.Equals,
                _conditions[i].Value); 
        }

        // Set conditions array for all property triggers 
        for (int i = 0; i < PropertyValues.Count; ++i)
        { 
            PropertyValue propertyValue = PropertyValues[i];
            propertyValue.Conditions = TriggerConditions;
            switch (propertyValue.ValueType)
            { 
                case PropertyValueType.Trigger:
                    propertyValue.ValueType = PropertyValueType.DataTrigger; 
                    break; 
                case PropertyValueType.PropertyTriggerResource:
                    propertyValue.ValueType = PropertyValueType.DataTriggerResource; 
                    break;
                default:
                    throw new InvalidOperationException(SR.Get(SRID.UnexpectedValueTypeForDataTrigger, propertyValue.ValueType));
            } 

            // Put back modified struct 
            PropertyValues[i] = propertyValue; 
        }

        super.Seal();
    }

    // evaluate the current state of the trigger 
    /*internal*/ public  /*override*/ boolean GetCurrentState(DependencyObject container, UncommonField<HybridDictionary[]> dataField)
    { 
        boolean retVal = (TriggerConditions.Length > 0); 

        for( int i = 0; retVal && i < TriggerConditions.Length; i++ ) 
        {
            retVal = TriggerConditions[i].ConvertAndMatch(StyleHelper.GetDataTriggerValue(dataField, container, TriggerConditions[i].Binding));
        }

        return retVal;
    } 


    private ConditionCollection _conditions = new ConditionCollection(); 
    private SetterBaseCollection _setters = null;
}