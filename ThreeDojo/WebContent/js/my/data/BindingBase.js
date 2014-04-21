define([ "dojo/_base/declare", "dojo/_base/lang", "my/data/Feature" ], function(declare, lang, Feature) {

    /// <summary> Flags indicating special properties of a Binding. </summary>
    /*internal*/ /*enum*/
	var BindingFlags = //: uint
    { 
        /// <summary> Data flows from source to target (only) </summary> 
        OneWay : BindingExpressionBase.BindingFlags.OneWay,
        /// <summary> Data flows in both directions - source to target and vice-versa </summary> 
        TwoWay : BindingExpressionBase.BindingFlags.TwoWay,
        /// <summary> Data flows from target to source (only) </summary>
        OneWayToSource : BindingExpressionBase.BindingFlags.OneWayToSource,
        /// <summary> Target is initialized from the source (only) </summary> 
        OneTime : BindingExpressionBase.BindingFlags.OneTime,
        /// <summary> Data flow obtained from target property default </summary> 
        PropDefault : BindingExpressionBase.BindingFlags.PropDefault, 

        /// <summary> Raise TargetUpdated event whenever a value flows from source to target </summary> 
        NotifyOnTargetUpdated : BindingExpressionBase.BindingFlags.NotifyOnTargetUpdated,
        /// <summary> Raise SourceUpdated event whenever a value flows from target to source </summary>
        NotifyOnSourceUpdated : BindingExpressionBase.BindingFlags.NotifyOnSourceUpdated,
        /// <summary> Raise ValidationError event whenever there is a ValidationError on Update</summary> 
        NotifyOnValidationError : BindingExpressionBase.BindingFlags.NotifyOnValidationError,

        /// <summary> Obtain trigger from target property default </summary> 
        UpdateDefault : BindingExpressionBase.BindingFlags.UpdateDefault,
        /// <summary> Update the source value whenever the target value changes </summary> 
        UpdateOnPropertyChanged : BindingExpressionBase.BindingFlags.UpdateOnPropertyChanged,
        /// <summary> Update the source value whenever the target element loses focus </summary>
        UpdateOnLostFocus : BindingExpressionBase.BindingFlags.UpdateOnLostFocus,
        /// <summary> Update the source value only when explicitly told to do so </summary> 
        UpdateExplicitly : BindingExpressionBase.BindingFlags.UpdateExplicitly,

        /// <summary> 
        /// Used to determine whether the Path was internally Generated (such as the implicit
        /// /InnerText from an XPath).  If it is, then it doesn't need to be serialized. 
        /// </summary>
        PathGeneratedInternally : BindingExpressionBase.BindingFlags.PathGeneratedInternally,

        ValidatesOnExceptions   : BindingExpressionBase.BindingFlags.ValidatesOnExceptions, 
        ValidatesOnDataErrors   : BindingExpressionBase.BindingFlags.ValidatesOnDataErrors,
        ValidatesOnNotifyDataErrors   : BindingExpressionBase.BindingFlags.ValidatesOnNotifyDataErrors, 

        /// <summary> Flags describing data transfer </summary>
        PropagationMask : OneWay | TwoWay | OneWayToSource | OneTime | PropDefault, 

        /// <summary> Flags describing update trigger </summary>
        UpdateMask      : UpdateDefault | UpdateOnPropertyChanged | UpdateOnLostFocus | UpdateExplicitly,

        /// <summary> Default value</summary>
        Default : BindingExpressionBase.BindingFlags.Default | ValidatesOnNotifyDataErrors, 

        /// <summary> Error value, returned by FlagsFrom to indicate faulty input</summary>
        IllegalInput : BindingExpressionBase.BindingFlags.IllegalInput, 
    };
    
	var BindingBase = declare(null, { 
	    /*internal*/ 
		constructor:function(){
	    },

	    /// <summary>
	    /// Return the value to set on the property for the target for this
	    /// binding. 
	    /// </summary>
	    /*public sealed override Object */
	    ProvideValue:function(/*IServiceProvider*/ serviceProvider){ 
	        // Binding a property value only works on DependencyObject and DependencyProperties.
	        // For all other cases, just return this Binding Object as the value. 
	
	        if (serviceProvider == null)
	        {
	            return this; 
	        }
	
	        // Bindings are not allowed On CLR props except for Setter,Trigger,Condition (bugs 1183373,1572537) 
	
	        /*DependencyObject*/var targetDependencyObject; 
	        /*DependencyProperty*/var targetDependencyProperty;
	        var result = Helper.CheckCanReceiveMarkupExtension(this, serviceProvider, /*out*/ targetDependencyObject, /*out*/ targetDependencyProperty);
	        targetDependencyObject = result.targetDependencyObject;
	        targetDependencyProperty = result.targetDependencyProperty;
	        
	        if (targetDependencyObject == null || targetDependencyProperty == null) 
	        {
	            return this; 
	        } 
	
	        // delegate real work to subclass 
	        return this.CreateBindingExpression(targetDependencyObject, targetDependencyProperty);
	    },

	    /// <summary> 
	    /// Create an appropriate expression for this Binding, to be attached
	    /// to the given DependencyProperty on the given DependencyObject. 
	    /// </summary> 
//	    /*internal*/ abstract BindingExpressionBase CreateBindingExpressionOverride(DependencyObject targetObject, DependencyProperty targetProperty, BindingExpressionBase owner);
	
	    /// <summary> Return true if any of the given flags are set. </summary>
	    /*internal*/ /*boolean*/ 
	    TestFlag:function(/*BindingFlags*/ flag){
	        return (this._flags & flag) != 0; 
	    },
	
	    /// <summary> Set the given flags. </summary> 
	    /*internal*/ /*void*/ 
	    SetFlag:function(/*BindingFlags*/ flag){ 
	    	this._flags |= flag;
	    },
	
	    /// <summary> Clear the given flags. </summary> 
	    /*internal*/ /*void*/ 
	    ClearFlag:function(/*BindingFlags*/ flag){ 
	    	this._flags &= ~flag; 
	    },
	
	    /// <summary> Change the given flags to have the given value. </summary>
	    /*internal*/ /*void*/ 
	    ChangeFlag:function(/*BindingFlags*/ flag, /*boolean*/ value){
	        if (value) 
	            this._flags |=  flag;
	        else 
	        	this._flags &= ~flag; 
	    },
	
	    /// <summary> Get the flags within the given mas. </summary>
	    /*internal*/ /*BindingFlags*/ 
	    GetFlagsWithinMask:function(/*BindingFlags*/ mask){
	        return (this._flags & mask); 
	    },
	
	    /// <summary> Change the flags within the given mask to have the given value. </summary> 
	    /*internal*/ /*void*/ 
	    ChangeFlagsWithinMask:function(/*BindingFlags*/ mask, /*BindingFlags*/ flags){ 
	    	this._flags = (this._flags & ~mask) | (flags & mask);
	    },


	    /// <summary>
	    /// Create an appropriate expression for this Binding, to be attached 
	    /// to the given DependencyProperty on the given DependencyObject.
	    /// </summary>
	    /*internal*/ /*BindingExpressionBase*/ 
	    CreateBindingExpression:function(/*DependencyObject*/ targetObject, /*DependencyProperty*/ targetProperty, /*BindingExpressionBase*/ owner){ 
	    	this._isSealed = true;
	        return this.CreateBindingExpressionOverride(targetObject, targetProperty, owner); 
	    },
	
	    // Throw if the binding is sealed. 
	    /*internal*/ /*void*/ 
	    CheckSealed:function()
	    {
	        if (this._isSealed)
	            throw new InvalidOperationException(SR.Get(SRID.ChangeSealedBinding)); 
	    },
	
	    // Return one of the special ValidationRules 
	    /*internal*/ /*ValidationRule*/ 
	    GetValidationRule:function(/*Type*/ type){ 
	        if (this.TestFlag(BindingFlags.ValidatesOnExceptions) && type == typeof(System.Windows.Controls.ExceptionValidationRule))
	            return System.Windows.Controls.ExceptionValidationRule.Instance;
	
	        if (this.TestFlag(BindingFlags.ValidatesOnDataErrors) && type == typeof(System.Windows.Controls.DataErrorValidationRule)) 
	            return System.Windows.Controls.DataErrorValidationRule.Instance;
	
	        if (this.TestFlag(BindingFlags.ValidatesOnNotifyDataErrors) && type == typeof(System.Windows.Controls.NotifyDataErrorValidationRule)) 
	            return System.Windows.Controls.NotifyDataErrorValidationRule.Instance;
	
	        return LookupValidationRule(type);
	    },
	
	    /*internal*/ /*virtual ValidationRule */
	    LookupValidationRule:function(/*Type*/ type){
	        return null; 
	    },

	
//	    BindingFlags    _flags = BindingFlags.Default;
//	    boolean            _isSealed;
	
	    
	
	    /*internal*/ /*boolean*/      
	    HasValue:function(/*Feature*/ id) { 
	    	return _values.HasValue(/*(int)*/id); 
	    },
	    /*internal*/ /*Object*/    
	    GetValue:function(/*Feature*/ id, /*Object*/ defaultValue) { 
	    	return this._values.GetValue(/*(int)*/id, defaultValue);
	    },
	    /*internal*/ /*void*/      
	    SetValue:function(/*Feature*/ id, /*Object*/ value) { 
	    	this._values.SetValue(/*(int)*/id, value); 
	    },
	    /*internal*/ /*void*/      
	    SetValue:function(/*Feature*/ id, /*Object*/ value, /*Object*/ defaultValue) { 
	    	if (Object.Equals(value, defaultValue)) 
	    		this._values.ClearValue(/*(int)*/id); 
	    	else 
	    		this._values.SetValue(/*(int)*/id, value); 
	    },
	    /*internal*/ /*void*/      
	    ClearValue:function(/*Feature*/ id) { 
	    	this._values.ClearValue(/*(int)*/id); 
	    },
	    /*internal*/ /*void*/      
	    CopyValue:function(/*Feature*/ id, /*BindingBase*/ clone) { 
	    	if (HasValue(id)) { 
	    		clone.SetValue(id, GetValue(id, null)); 
	    	} 
	    }
//	    UncommonValueTable  _values; 
	});
	
//    /*internal*/ static BindingFlags FlagsFrom(BindingMode bindingMode)
	BindingBase.FlagsFromBindingMode = function(bindingMode){ 
        switch (bindingMode) 
        {
            case BindingMode.OneWay:            return BindingFlags.OneWay; 
            case BindingMode.TwoWay:            return BindingFlags.TwoWay;
            case BindingMode.OneWayToSource:    return BindingFlags.OneWayToSource;
            case BindingMode.OneTime:           return BindingFlags.OneTime;
            case BindingMode.Default:           return BindingFlags.PropDefault; 
        }

        return BindingFlags.IllegalInput; 
    };

    /// <summary> Convert the given UpdateSourceTrigger to BindingFlags. </summary>
//    /*internal*/ static BindingFlags FlagsFrom(UpdateSourceTrigger updateSourceTrigger)
	
    BindingBase.FlagsFromUpdateSourceTrigger = function(updateSourceTrigger){
        switch (updateSourceTrigger) 
        {
            case UpdateSourceTrigger.Default:           return BindingFlags.UpdateDefault; 
            case UpdateSourceTrigger.PropertyChanged:   return BindingFlags.UpdateOnPropertyChanged; 
            case UpdateSourceTrigger.LostFocus:         return BindingFlags.UpdateOnLostFocus;
            case UpdateSourceTrigger.Explicit:          return BindingFlags.UpdateExplicitly; 
        }

        return BindingFlags.IllegalInput;
    }; 
    
//    /*internal*/ static ValidationRule LookupValidationRule(Type type, Collection<ValidationRule> collection) 
    BindingBase.LookupValidationRule = function(type, collection){
        if (collection == null)
            return null;

        for (/*int*/var i=0; i<collection.Count; ++i)
        { 
            if (type.IsInstanceOfType(collection[i])) 
                return collection[i];
        } 

        return null;
    };


	
	Object.defineProperties(BindingBase.prototype, {

	    /*public Object */
		FallbackValue:
	    {
	        get:function() { return GetValue(Feature.FallbackValue, DependencyProperty.UnsetValue); }, 
	        set:function(value) { CheckSealed(); SetValue(Feature.FallbackValue, value); }
	    },

	    /// <summary> Format string used to convert the data to type String. 
	    /// </summary>
	    /// <remarks>
	    ///     This property is used when the target of the binding has type
	    ///     String and no Converter is declared.  It is ignored in all other 
	    ///     cases.
	    /// </remarks> 
	    /*public string */
	    StringFormat:
	    { 
	        get:function() { return /*(string)*/GetValue(Feature.StringFormat, null); },
	        set:function(value) { CheckSealed(); SetValue(Feature.StringFormat, value, null); }
	    },

	    /// <summary> Value used to represent "null" in the target property.
	    /// </summary> 
	    /*public Object */
	    TargetNullValue:
	    {
	        get:function() { return GetValue(Feature.TargetNullValue, DependencyProperty.UnsetValue); } ,
	        set:function(value) { CheckSealed(); SetValue(Feature.TargetNullValue, value); }
	    },


	    /// <summary> Name of the <see cref="BindingGroup"/> this binding should join.
	    /// </summary> 
	    /*public string */
	    BindingGroupName:
	    { 
	        get:function() { return /*(string)*/GetValue(Feature.BindingGroupName, String.Empty); },
	        set:function(value) { CheckSealed(); SetValue(Feature.BindingGroupName, value, String.Empty); }
	    },

	    /// <summary>
	    /// The time (in milliseconds) to wait after the most recent property 
	    /// change before performing source update. 
	    /// </summary>
	    /// <remarks> 
	    /// This property affects only TwoWay bindings with UpdateSourceTrigger=PropertyChanged.
	    /// </remarks>
	    /*public int */
	    Delay:
	    {
	        get:function() { return /*(int)*/this.GetValue(Feature.Delay, 0); }, 
	        set:function(value) { CheckSealed(); this.SetValue(Feature.Delay, value, 0); } 
	    },
		
	    /*internal*/ /*BindingFlags*/ 
	    Flags: { get:function() { return this._flags; } },
	
	    /*internal*/ /*virtual CultureInfo*/ 
	    ConverterCultureInternal:
	    {
	        get:function() { return null; }
	    },
	
	    /*internal*/ /*virtual Collection<ValidationRule>*/ 
	    ValidationRulesInternal:
	    { 
	        get:function() { return null; } 
	    },
	
	    /*internal*/ /*virtual boolean*/ 
	    ValidatesOnNotifyDataErrorsInternal:
	    {
	        get:function() { return false; }
	    } 
	});
	
	return BindingBase;
});