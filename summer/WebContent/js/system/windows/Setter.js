/**
 * Setter
 */

define(["dojo/_base/declare", "system/Type", "windows/SetterBase", "markup/MarkupExtension",
        "windows/StyleHelper"], 
		function(declare, Type, SetterBase, MarkupExtension, StyleHelper){
	var Setter = declare("Setter", SetterBase,{ 
		constructor:function(/*DependencyProperty*/ property, /*object*/ value, /*string*/ targetName )
        {
			if(property === undefined){
				property = null;
			}
			
			if(value === undefined){
				value = null;
			}
			
			if(targetName === undefined){
				targetName = null;
			}
			
            this.Initialize( property, value, targetName );
            

//            private object 
            this._unresolvedProperty = null;
//            private object 
            this._unresolvedValue = null;
//            private ITypeDescriptorContext 
            this._serviceProvider = null; 
//            private CultureInfo 
            this._cultureInfoForTypeConverter = null;
		},
		

        /// <summary> 
        ///     Method that does all the initialization work for the constructors. 
        /// </summary>
//        private void 
        Initialize:function( /*DependencyProperty*/ property, /*object*/ value, /*string*/ target ) 
        {
            if( value == Type.UnsetValue )
            {
                throw new Error('ArgumentException(SR.Get(SRID.SetterValueCannotBeUnset)'); 
            }
 
            this.CheckValidProperty(property); 

            // No null check for target since null is a valid value. 

            this._property = property;
            this._value = value;
            this._target = target; 
        },
 
//        private void 
        CheckValidProperty:function( /*DependencyProperty*/ property) 
        {
            if (property == null) 
            {
                throw new Error('ArgumentNullException("property")');
            }
            if (property.ReadOnly) 
            {
                // Read-only properties will not be consulting Style/Template/Trigger Setter for value. 
                //  Rather than silently do nothing, throw error. 
                throw new Error('ArgumentException(SR.Get(SRID.ReadOnlyPropertyNotAllowed, property.Name, GetType().Name)');
            } 
//            if( property == FrameworkElement.NameProperty)
//            {
//                throw new Error('InvalidOperationException(SR.Get(SRID.CannotHavePropertyInStyle, FrameworkElement.NameProperty.Name)');
//            } 
        },
 
        /// <summary> 
        ///     Seals this setter
        /// </summary> 
//        internal override void 
        Seal:function()
        {

            // Do the validation that can't be done until we know all of the property 
            // values.
 
            /*DependencyProperty*/var dp = this.Property; 
            /*object*/var value = this.ValueInternal;
 
            if (dp == null)
            {
                throw new Error('ArgumentException(SR.Get(SRID.NullPropertyIllegal, "Setter.Property")');
            } 

            if( String.IsNullOrEmpty(this.TargetName)) 
            { 
//                // Setter on container is not allowed to affect the StyleProperty.
//                if (dp == FrameworkElement.StyleProperty) 
//                {
//                    throw new Error('ArgumentException(SR.Get(SRID.StylePropertyInStyleNotAllowed)');
//                }
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
                        throw new Error('ArgumentException(SR.Get(SRID.SetterValueOfMarkupExtensionNotSupported, value.GetType().Name)');
                    } 
                }

                else if (!(value instanceof DeferredReference))
                { 
                    throw new Error('ArgumentException(SR.Get(SRID.InvalidSetterValue, value, dp.OwnerType, dp.Name)');
                } 
            } 

            // Freeze the value for the setter 
            StyleHelper.SealIfSealable(this._value);

            SetterBase.prototype.Seal.call(this);
        },
        

//        void ISupportInitialize.
        BeginInit:function() 
        { 
        },

//        void ISupportInitialize.
        EndInit:function()
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

	});
	

//    public static void 
    Setter.ReceiveMarkupExtension = function(/*object*/ targetObject, /*XamlSetMarkupExtensionEventArgs*/ eventArgs) 
    {
        if (targetObject == null) 
        { 
            throw new Error('ArgumentNullException("targetObject")');
        } 
        if (eventArgs == null)
        {
            throw new Error('ArgumentNullException("eventArgs")');
        } 

        /*Setter*/var setter = targetObject instanceof Setter ? targetObject :null; 

        if (setter == null || eventArgs.Member.Name != "Value")
        { 
            return;
        }

        /*MarkupExtension*/var me = eventArgs.MarkupExtension; 

        if (me instanceof StaticResourceExtension) 
        { 
            var sr = me instanceof StaticResourceExtension ? me : null;
            setter.Value = sr.ProvideValueInternal(eventArgs.ServiceProvider, true /*allowDeferedReference*/); 
            eventArgs.Handled = true;
        }else if (me instanceof DynamicResourceExtension || me instanceof BindingBase){ 
            setter.Value = me;
            eventArgs.Handled = true; 
        } 
    };

//    public static void 
    Setter.ReceiveTypeConverter = function(/*object*/ targetObject, /*XamlSetTypeConverterEventArgs*/ eventArgs)
    {
        /*Setter*/
    	var setter = targetObject instanceof Setter ? targetObject : null;
        if (setter == null) 
        {
            throw new Error('ArgumentNullException("targetObject")'); 
        } 
        if (eventArgs == null)
        { 
            throw new Error('ArgumentNullException("eventArgs")');
        }

        if (eventArgs.Member.Name == "Property") 
        {
            setter._unresolvedProperty = eventArgs.Value; 
            setter._serviceProvider = eventArgs.ServiceProvider; 
            setter._cultureInfoForTypeConverter = eventArgs.CultureInfo;

            eventArgs.Handled = true;
        } else if (eventArgs.Member.Name == "Value") { 
            setter._unresolvedValue = eventArgs.Value;
            setter._serviceProvider = eventArgs.ServiceProvider; 
            setter._cultureInfoForTypeConverter = eventArgs.CultureInfo; 

            eventArgs.Handled = true; 
        }
    };

	Object.defineProperties(Setter.prototype,{

        /// <summary> 
        ///    Property that is being set by this setter 
        /// </summary>
//        public DependencyProperty 
        Property:
        { 
            get:function() { return this._property; },
            set:function(value) 
            { 
                this.CheckValidProperty(value);
                this.CheckSealed(); 
                this._property = value;
            }
        }, 

        /// <summary> 
        ///    Property value that is being set by this setter 
        /// </summary>
//        public object 
        Value: 
        {
            get:function() 
            { 
                // Inflate the deferred reference if the _value is one of those.
                /*DeferredReference*/var deferredReference = this._value instanceof DeferredReference ? this._value :null; 
                if (deferredReference != null)
                {
                	this._value = deferredReference.GetValue(BaseValueSourceInternal.Unknown);
                } 

                return this._value; 
            },

            set:function(value) 
            {
                if( value == DependencyProperty.UnsetValue )
                {
                    throw new Error('ArgumentException(SR.Get(SRID.SetterValueCannotBeUnset)'); 
                }
 
                CheckSealed(); 

                // No Expression support 
                if( value instanceof Expression )
                {
                    throw Error('new ArgumentException(SR.Get(SRID.StyleValueOfExpressionNotSupported)');
                } 

 
                this._value = value; 
            }
        },

        /// <summary>
        ///     Internal property used so that we obtain the value as
        ///     is without having to inflate the DeferredReference. 
        /// </summary>
//        internal object 
        ValueInternal:
        { 
            get:function() { return this._value; }
        },

        /// <summary>
        ///     When the set is directed at a child node, this string
        /// identifies the intended target child node. 
        /// </summary>
//        [DefaultValue(null)] 
//        [Ambient] 
//        public string 
        TargetName:
        { 
            get:function()
            {
                return this._target;
            }, 
            set:function(value)
            { 
                // Setting to null is allowed, to clear out value. 
                CheckSealed();
                this._target = value; 
            }
        }
	});
	
	Setter.Type = new Type("Setter", Setter, [SetterBase.Type]);
	return Setter;
});
