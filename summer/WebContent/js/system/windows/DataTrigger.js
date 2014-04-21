/**
 * DataTrigger
 */

define(["dojo/_base/declare", "system/Type", "markup/MarkupExtension"], 
		function(declare, Type, MarkupExtension){
	var DataTrigger = declare("DataTrigger", TriggerBase,{
		constructor:function(){
			
//		    private BindingBase 
		    this._binding= null; 
//		    private object 
		    this._value = DependencyProperty.UnsetValue;
//		    private SetterBaseCollection 
		    this._setters = null; 
		},
		
		 
        ///<summary>
        /// This method is called to Add a Setter object as a child of the Style. 
        ///</summary> 
        ///<param name="value">
        /// The object to add as a child; it must be a Setter or subclass. 
        ///</param>
//        void IAddChild.
        AddChild:function (/*Object*/ value)
        {
            this.Setters.Add(Trigger.CheckChildIsSetter(value)); 
        },
 
//        internal sealed override void 
        Seal:function() 
        {
            if (this.IsSealed) 
            {
                return;
            }
 
            // Process the _setters collection: Copy values into PropertyValueList and seal the Setter objects.
            this.ProcessSettersCollection(this._setters); 
 
            // Freeze the value for the trigger
            StyleHelper.SealIfSealable(this._value); 

            // Build conditions array from collection
            this.TriggerConditions = [new TriggerCondition( 
                    this._binding,
                    LogicalOp.Equals, 
                    this._value)];
//            	new TriggerCondition[] {
//                new TriggerCondition( 
//                    _binding,
//                    LogicalOp.Equals, 
//                    _value) }; 

            // Set Condition for all data triggers 
            for (var i = 0; i < this.PropertyValues.Count; i++)
            {
                /*PropertyValue*/var propertyValue = this.PropertyValues.Get(i);
 
                propertyValue.Conditions = this.TriggerConditions;
                switch (propertyValue.ValueType) 
                { 
                    case PropertyValueType.Trigger:
                        propertyValue.ValueType = PropertyValueType.DataTrigger; 
                        break;
                    case PropertyValueType.PropertyTriggerResource:
                        propertyValue.ValueType = PropertyValueType.DataTriggerResource;
                        break; 
                    default:
                        throw new Error('InvalidOperationException(SR.Get(SRID.UnexpectedValueTypeForDataTrigger, propertyValue.ValueType)'); 
                } 

                // Put back modified struct 
                this.PropertyValues.Set(i, propertyValue);
            }

            TriggerBase.prototype.Seal.call(this); 
        },
 
        // evaluate the current state of the trigger 
//        internal override bool 
        GetCurrentState:function(/*DependencyObject*/ container, /*UncommonField<HybridDictionary[]>*/ dataField)
        { 
            return TriggerConditions[0].ConvertAndMatch(StyleHelper.GetDataTriggerValue(dataField, container, 
            		this.TriggerConditions[0].Binding)); 
        }
 
	});
	
	Object.defineProperties(DataTrigger.prototype,{
	      /// <summary> 
        ///     Binding declaration of the conditional
        /// </summary>
//        [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] // Not localizable by-default
//        public BindingBase 
        Binding: 
        {
            get:function() 
            { 
                return this._binding;
            },
            set:function(value)
            {
                if (this.IsSealed) 
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "DataTrigger")');
                }
 
                this._binding = value;
            } 
        }, 

        /// <summary> 
        ///     Value of the condition (equality check)
        /// </summary>
//        [DependsOn("Binding")]
//        [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] // Not localizable by-default 
//        public object 
        Value:
        { 
            get:function() 
            {
                return this._value;
            }, 
            set:function(value)
            { 
                if (this.IsSealed)
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "DataTrigger")');
                } 

                if (value instanceof MarkupExtension) 
                { 
                    throw new Error('ArgumentException(SR.Get(SRID.ConditionValueOfMarkupExtensionNotSupported, value.GetType().Name)'); 
                }

                if( value instanceof Expression )
                { 
                    throw new Error('ArgumentException(SR.Get(SRID.ConditionValueOfExpressionNotSupported)');
                } 
 
                this._value = value;
            } 
        },

        /// <summary>
        ///     Collection of Setter objects, which describes what to apply 
        /// when this trigger is active.
        /// </summary> 
//        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)] 
//        public SetterBaseCollection 
        Setters:
        { 
            get:function()
            {
                if( this._setters === null ) 
                { 
                	this._setters = new SetterBaseCollection();
                } 
                return this._setters;
            }
        }
	});


//    public static void 
    DataTrigger.ReceiveMarkupExtension = function(/*object*/ targetObject, /*XamlSetMarkupExtensionEventArgs*/ eventArgs)
    {
        if (targetObject == null) 
        {
            throw new Error('ArgumentNullException("targetObject")'); 
        } 
        if (eventArgs == null)
        { 
            throw new Error('ArgumentNullException("eventArgs")');
        }

        var trigger = targetObject instanceof DataTrigger ? targetObject : null; 
        if (trigger != null && eventArgs.Member.Name == "Binding" && eventArgs.MarkupExtension instanceof BindingBase)
        { 
            trigger.Binding = eventArgs.MarkupExtension instanceof BindingBase ? eventArgs.MarkupExtension : null; 

            eventArgs.Handled = true; 
        }
        else
        {
            eventArgs.CallBase(); 
        }
    };
	
    DataTrigger.Type = new Type("DataTrigger", DataTrigger, [TriggerBase.Type]);
	return DataTrigger;
});

////---------------------------------------------------------------------------- 
////
//// <copyright file="DataTrigger.cs" company="Microsoft">
////    Copyright (C) Microsoft Corporation.  All rights reserved.
//// </copyright> 
////
//// Description: Defines DataTrigger object, akin to Trigger except it 
////              gets values from data. 
////
////--------------------------------------------------------------------------- 
//
//using System;
//using System.Collections.Specialized;
//using System.ComponentModel; 
//using System.Diagnostics;
//using System.Windows.Data; 
//using System.Windows.Markup; 
//
//namespace System.Windows 
//{
//    /// <summary>
//    ///     A single Style data conditional dependency driver
//    /// </summary> 
//    [ContentProperty("Setters")]
//    [XamlSetMarkupExtensionAttribute("ReceiveMarkupExtension")] 
//    public class DataTrigger : TriggerBase, IAddChild 
//    {
//        /// <summary> 
//        ///     Binding declaration of the conditional
//        /// </summary>
//        [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] // Not localizable by-default
//        public BindingBase Binding 
//        {
//            get 
//            { 
//                // Verify Context Access
//                VerifyAccess(); 
//
//                return _binding;
//            }
//            set 
//            {
//                // Verify Context Access 
//                VerifyAccess(); 
//
//                if (IsSealed) 
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "DataTrigger"));
//                }
// 
//                _binding = value;
//            } 
//        } 
//
//        /// <summary> 
//        ///     Value of the condition (equality check)
//        /// </summary>
//        [DependsOn("Binding")]
//        [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] // Not localizable by-default 
//        public object Value
//        { 
//            get 
//            {
//                // Verify Context Access 
//                VerifyAccess();
//
//                return _value;
//            } 
//            set
//            { 
//                // Verify Context Access 
//                VerifyAccess();
// 
//                if (IsSealed)
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "DataTrigger"));
//                } 
//
//                if (value is MarkupExtension) 
//                { 
//                    throw new ArgumentException(SR.Get(SRID.ConditionValueOfMarkupExtensionNotSupported,
//                                                       value.GetType().Name)); 
//                }
//
//                if( value is Expression )
//                { 
//                    throw new ArgumentException(SR.Get(SRID.ConditionValueOfExpressionNotSupported));
//                } 
// 
//                _value = value;
//            } 
//        }
//
//        /// <summary>
//        ///     Collection of Setter objects, which describes what to apply 
//        /// when this trigger is active.
//        /// </summary> 
//        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)] 
//        public SetterBaseCollection Setters
//        { 
//            get
//            {
//                // Verify Context Access
//                VerifyAccess(); 
//
//                if( _setters == null ) 
//                { 
//                    _setters = new SetterBaseCollection();
//                } 
//                return _setters;
//            }
//        }
// 
//        ///<summary>
//        /// This method is called to Add a Setter object as a child of the Style. 
//        ///</summary> 
//        ///<param name="value">
//        /// The object to add as a child; it must be a Setter or subclass. 
//        ///</param>
//        void IAddChild.AddChild (Object value)
//        {
//            // Verify Context Access 
//            VerifyAccess();
// 
//            Setters.Add(Trigger.CheckChildIsSetter(value)); 
//        }
// 
//        ///<summary>
//        /// This method is called by the parser when text appears under the tag in markup.
//        /// As default Styles do not support text, calling this method has no effect.
//        ///</summary> 
//        ///<param name="text">
//        /// Text to add as a child. 
//        ///</param> 
//        void IAddChild.AddText (string text)
//        { 
//            // Verify Context Access
//            VerifyAccess();
//
//            XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
//        }
// 
//        internal sealed override void Seal() 
//        {
//            if (IsSealed) 
//            {
//                return;
//            }
// 
//            // Process the _setters collection: Copy values into PropertyValueList and seal the Setter objects.
//            ProcessSettersCollection(_setters); 
// 
//            // Freeze the value for the trigger
//            StyleHelper.SealIfSealable(_value); 
//
//            // Build conditions array from collection
//            TriggerConditions = new TriggerCondition[] {
//                new TriggerCondition( 
//                    _binding,
//                    LogicalOp.Equals, 
//                    _value) }; 
//
//            // Set Condition for all data triggers 
//            for (int i = 0; i < PropertyValues.Count; i++)
//            {
//                PropertyValue propertyValue = PropertyValues[i];
// 
//                propertyValue.Conditions = TriggerConditions;
//                switch (propertyValue.ValueType) 
//                { 
//                    case PropertyValueType.Trigger:
//                        propertyValue.ValueType = PropertyValueType.DataTrigger; 
//                        break;
//                    case PropertyValueType.PropertyTriggerResource:
//                        propertyValue.ValueType = PropertyValueType.DataTriggerResource;
//                        break; 
//                    default:
//                        throw new InvalidOperationException(SR.Get(SRID.UnexpectedValueTypeForDataTrigger, propertyValue.ValueType)); 
//                } 
//
//                // Put back modified struct 
//                PropertyValues[i] = propertyValue;
//            }
//
//            base.Seal(); 
//        }
// 
//        // evaluate the current state of the trigger 
//        internal override bool GetCurrentState(DependencyObject container, UncommonField<HybridDictionary[]> dataField)
//        { 
//            Debug.Assert( TriggerConditions != null && TriggerConditions.Length == 1,
//                "This method assumes there is exactly one TriggerCondition." );
//
//            return TriggerConditions[0].ConvertAndMatch(StyleHelper.GetDataTriggerValue(dataField, container, TriggerConditions[0].Binding)); 
//        }
// 
//        private BindingBase _binding; 
//        private object _value = DependencyProperty.UnsetValue;
//        private SetterBaseCollection _setters = null; 
//
//        public static void ReceiveMarkupExtension(object targetObject, XamlSetMarkupExtensionEventArgs eventArgs)
//        {
//            if (targetObject == null) 
//            {
//                throw new ArgumentNullException("targetObject"); 
//            } 
//            if (eventArgs == null)
//            { 
//                throw new ArgumentNullException("eventArgs");
//            }
//
//            DataTrigger trigger = targetObject as DataTrigger; 
//            if (trigger != null && eventArgs.Member.Name == "Binding" && eventArgs.MarkupExtension is BindingBase)
//            { 
//                trigger.Binding = eventArgs.MarkupExtension as BindingBase; 
//
//                eventArgs.Handled = true; 
//            }
//            else
//            {
//                eventArgs.CallBase(); 
//            }
//        } 
//    } 
//}