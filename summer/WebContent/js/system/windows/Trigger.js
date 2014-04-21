/**
 * Trigger
 */

define(["dojo/_base/declare", "system/Type", "windows/TriggerBase", "windows/TriggerCondition", "windows/SetterBaseCollection",
        "markup/MarkupExtension", "windows/Expression", "windows/StyleHelper", "windows/LogicalOp", "windows/Setter"], 
		function(declare, Type, TriggerBase, TriggerCondition, SetterBaseCollection,
				MarkupExtension, Expression, StyleHelper, LogicalOp, Setter){
	var Trigger = declare("Trigger", TriggerBase,{
		constructor:function(){

//	        private DependencyProperty 
	        this._property = null; 
//	        private object 
	        this._value = Type.UnsetValue;
//	        private string 
	        this._sourceName = null;
//	        private SetterBaseCollection 
	        this._setters = null;
//	        private object 
	        this._unresolvedProperty = null; 
//	        private object 
	        this._unresolvedValue = null;
//	        private ITypeDescriptorContext 
	        this._serviceProvider = null; 
//	        private CultureInfo 
	        this._cultureInfoForTypeConverter = null;
		},
		 
        ///<summary>
        /// This method is called to Add a Setter object as a child of the Style.
        ///</summary>
        ///<param name="value"> 
        /// The object to add as a child; it must be a Setter or subclass.
        ///</param> 
//        void IAddChild.
        AddChild:function(/*Object*/ value) 
        {
            this.Setters.Add(Trigger.CheckChildIsSetter(value));
        },

        ///<summary> 
        /// This method is called by the parser when text appears under the tag in markup. 
        /// As default Styles do not support text, calling this method has no effect.
        ///</summary> 
        ///<param name="text">
        /// Text to add as a child.
        ///</param>
//        void IAddChild.
        AddText:function (/*string*/ text) 
        {
            XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
        },


//        internal sealed override void 
        Seal:function()
        { 
            if (this.IsSealed)
            { 
                return; 
            }
 
            if (this._property != null)
            {
                // Ensure valid condition
                if (!this._property.IsValidValue(this._value)) 
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.InvalidPropertyValue, _value, _property.Name )'); 
                } 
            }
 
            // Freeze the condition for the trigger
            StyleHelper.SealIfSealable(this._value);

            // Process the _setters collection: Copy values into PropertyValueList and seal the Setter objects. 
            this.ProcessSettersCollection(this._setters);
 
            // Build conditions array from collection 
            this.TriggerConditions = [new TriggerCondition( 
            		this._property,
                    LogicalOp.Equals,
                    this._value,
                    (this._sourceName != null) ? this._sourceName : StyleHelper.SelfName)];
//            	new TriggerCondition[] {
//                new TriggerCondition( 
//                    _property,
//                    LogicalOp.Equals,
//                    _value,
//                    (_sourceName != null) ? _sourceName : StyleHelper.SelfName) }; 

            // Set Condition for all property triggers 
            for (var i = 0; i < this.PropertyValues.Count; i++) 
            {
                /*PropertyValue*/
            	var propertyValue = this.PropertyValues.Get(i); 
                propertyValue.Conditions = this.TriggerConditions;
                // Put back modified struct
                this.PropertyValues.Set(i, propertyValue);
            } 

            TriggerBase.prototype.Seal.call(this); 
        },

        // evaluate the current state of the trigger 
//        internal override bool 
        GetCurrentState:function(/*DependencyObject*/ container, /*UncommonField<HybridDictionary[]>*/ dataField)
        {
//            Debug.Assert( TriggerConditions != null && TriggerConditions.Length == 1,
//                "This method assumes there is exactly one TriggerCondition." ); 

//            Debug.Assert( TriggerConditions[0].SourceChildIndex == 0, 
//                "This method was created to handle properties on the containing object, more work is needed to handle templated children too." ); 

            return this.TriggerConditions[0].Match(container.GetValue(this.TriggerConditions[0].Property)); 
        },

 
//        void ISupportInitialize.
        BeginInit:function()
        { 
        }, 

//        void ISupportInitialize.
        EndInit:function() 
        {
            // Resolve all properties here
            if (this._unresolvedProperty != null)
            { 
                try
                { 
                	this.Property = DependencyPropertyConverter.ResolveProperty(this._serviceProvider, 
                        SourceName, this._unresolvedProperty);
                } 
                finally
                {
                	this._unresolvedProperty = null;
                } 
            }
            if (this._unresolvedValue != null) 
            { 
                try
                { 
                	this.Value = SetterTriggerConditionValueConverter.ResolveValue(this._serviceProvider,
                        Property, this._cultureInfoForTypeConverter, this._unresolvedValue);
                }
                finally 
                {
                	this._unresolvedValue = null; 
                } 
            }
            this._serviceProvider = null; 
            this._cultureInfoForTypeConverter = null;
        },


//        public static void 
        ReceiveTypeConverter:function(/*object*/ targetObject, /*XamlSetTypeConverterEventArgs*/ eventArgs) 
        { 
            /*Trigger*/
        	var trigger = targetObject instanceof Trigger ? targetObject : null;
            if (trigger == null) 
            {
                throw new Error('ArgumentNullException("targetObject")');
            }
            if (eventArgs == null) 
            {
                throw new Error('ArgumentNullException("eventArgs")'); 
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
	
	});
	
	Object.defineProperties(Trigger.prototype,{
        /// <summary>
        ///     DependencyProperty of the conditional
        /// </summary> 
//        public DependencyProperty 
        Property: 
        {
            get:function() 
            {
                return this._property;
            }, 
            set:function(value) 
            {
                if (this.IsSealed)
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "Trigger")');
                } 
 
                this._property = value;
            } 
        },

        /// <summary>
        ///     Value of the condition (equality check) 
        /// </summary>
//        public object 
        Value:
        {
            get:function()
            { 
                return _value;
            }, 
            set:function(value)
            {

                if (this.IsSealed) 
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "Trigger")');
                } 

//                if (value instanceof NullExtension)
//                {
//                    value = null; 
//                }
 
                if (value instanceof MarkupExtension) 
                {
                    throw new Error('ArgumentException(SR.Get(SRID.ConditionValueOfMarkupExtensionNotSupported, value.GetType().Name)');
                }

                if (value instanceof Expression) 
                {
                    throw new Error('ArgumentException(SR.Get(SRID.ConditionValueOfExpressionNotSupported)'); 
                } 

                this._value = value; 
            }
        },

        /// <summary> 
        /// The x:Name of the object whose property shall
        /// trigger the associated setters to be applied. 
        /// If null, then this is the object being Styled 
        /// and not anything under its Template Tree.
        /// </summary> 
//        [DefaultValue(null)]
//        [Ambient]
//        public string 
        SourceName:
        { 
            get:function()
            { 
                return this._sourceName;
            },
            set:function(value)
            { 
                if( this.IsSealed )
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "Trigger")');
                }

                this._sourceName = value; 
            }
        },
 
        /// <summary>
        /// Collection of Setter objects, which describes what to apply 
        /// when this trigger is active.
        /// </summary>
//        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
//        public SetterBaseCollection 
        Setters: 
        {
            get:function() 
            { 
                if( this._setters == null )
                {
                	this._setters = new SetterBaseCollection(); 
                }
                return this._setters; 
            } 
        }
	});
	
	    // Shared by PropertyTrigger, MultiPropertyTrigger, DataTrigger, MultiDataTrigger
	//  internal static Setter 
	Trigger.CheckChildIsSetter = function( /*object*/ o ) 
	  {
	      if (o == null) 
	      { 
	          throw new Error('ArgumentNullException("o")');
	      } 
	
	      /*Setter*/var setter = o instanceof Setter ? o : null;
	
	      if (setter == null) 
	      {
	          throw new Error('ArgumentException(SR.Get(SRID.UnexpectedParameterType, o.GetType(), typeof(Setter)), "o")'); 
	      } 
	
	      return setter; 
	  };
	
	Trigger.Type = new Type("Trigger", Trigger, [TriggerBase.Type]);
	return Trigger;
});

