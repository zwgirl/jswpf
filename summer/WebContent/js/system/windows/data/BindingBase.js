/**
 * Second Check 12-27
 * BindingBase
 */
define(["dojo/_base/declare", "system/Type", "data/BindingMode", "markup/MarkupExtension", 
        "internal/UncommonValueTable", "data/BindingMode", "data/UpdateSourceTrigger",
        "data/BindingFlags", "windows/DependencyProperty", "controls/DataErrorValidationRule",
        "internal/Helper"], 
        function(declare, Type, BindingMode, MarkupExtension, 
        		UncommonValueTable, BindingMode, UpdateSourceTrigger, 
        		BindingFlags, DependencyProperty, DataErrorValidationRule,
        		Helper){
	
	var Feature =
    {
        // BindingBase
        FallbackValue:0,
        StringFormat:1, 
        TargetNullValue:2,
        BindingGroupName:3, 
        Delay:4, 

        // Binding 
        XPath:5,
        Culture:6,
        AsyncState:7,
        ObjectSource:8, 
        RelativeSource:9,
        ElementSource:10, 
        Converter:11, 
        ConverterParameter:12,
        ValidationRules:13, 
        ExceptionFilterCallback:14,
        AttachedPropertiesInPath:15,

        // MultiBinding 

        // PriorityBinding 

        // Sentinel, for error checking.   Must be last.
        LastFeatureId:16 
    };
	

	var BindingBase = declare("BindingBase", MarkupExtension, {
		constructor:function( ){
			this._values = new UncommonValueTable();
			this._flags = BindingFlags.Default;
//	        bool            
	        this._isSealed = false;
		},
		
		/// <summary>
        /// Return the value to set on the property for the target for this
        /// binding. 
        /// </summary>
//        public sealed override object 
        ProvideValue:function(/*IServiceProvider*/ serviceProvider) 
        { 
            // Binding a property value only works on DependencyObject and DependencyProperties.
            // For all other cases, just return this Binding object as the value. 

            if (serviceProvider == null)
            {
                return this; 
            }
 
            // Bindings are not allowed On CLR props except for Setter,Trigger,Condition (bugs 1183373,1572537) 
            var targetDependencyObjectOut ={
            	"targetDependencyObject":null,
            };
            var targetDependencyPropertyOut ={
            	"targetDependencyProperty":null
            };
            Helper.CheckCanReceiveMarkupExtension(this, serviceProvider, /*out targetDependencyObject*/targetDependencyObjectOut, 
            		/*out targetDependencyProperty*/targetDependencyPropertyOut);

            var targetDependencyObject = targetDependencyObjectOut.targetDependencyObject; 
            var targetDependencyProperty = targetDependencyPropertyOut.targetDependencyProperty;
            
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
//        internal abstract BindingExpressionBase 
//		CreateBindingExpressionOverride:function(/*DependencyObject*/ targetObject, /*DependencyProperty*/ targetProperty, /*BindingExpressionBase*/ owner){}
        
        /// <summary> Return true if any of the given flags are set. </summary>
//        internal bool 
        TestFlag:function(/*BindingFlags*/ flag)
        {
            return (this._flags & flag) != 0; 
        },
 
        /// <summary> Set the given flags. </summary> 
//        internal void 
        SetFlag:function(/*BindingFlags*/ flag)
        { 
        	this._flags |= flag;
        },

        /// <summary> Clear the given flags. </summary> 
//        internal void 
        ClearFlag:function(/*BindingFlags*/ flag)
        { 
        	this._flags &= ~flag; 
        },
 
        /// <summary> Change the given flags to have the given value. </summary>
//        internal void 
        ChangeFlag:function(/*BindingFlags*/ flag, /*bool*/ value)
        {
            if (value) 
            	this._flags |=  flag;
            else 
            	this._flags &= ~flag; 
        },
 
        /// <summary> Get the flags within the given mas. </summary>
//        internal BindingFlags 
        GetFlagsWithinMask:function(/*BindingFlags*/ mask)
        {
            return (this._flags & mask); 
        },
        
        /// <summary> Change the flags within the given mask to have the given value. </summary> 
//        internal void 
        ChangeFlagsWithinMask:function(/*BindingFlags*/ mask, /*BindingFlags*/ flags)
        { 
        	this._flags = (this._flags & ~mask) | (flags & mask);
        },

//        /// <summary> 
//        /// Create an appropriate expression for this Binding, to be attached
//        /// to the given DependencyProperty on the given DependencyObject. 
//        /// </summary>
//        internal BindingExpressionBase 
//        CreateBindingExpression:function(/*DependencyObject*/ targetObject, /*DependencyProperty*/ targetProperty)
//        {
//        	this._isSealed = true; 
//            return this.CreateBindingExpressionOverride(targetObject, targetProperty, null);
//        }, 
 
        /// <summary>
        /// Create an appropriate expression for this Binding, to be attached 
        /// to the given DependencyProperty on the given DependencyObject.
        /// </summary>
//        internal BindingExpressionBase 
        CreateBindingExpression:function(/*DependencyObject*/ targetObject, /*DependencyProperty*/ targetProperty, /*BindingExpressionBase*/ owner)
        { 
        	if(owner === undefined){
        		owner = null;
        	}
        	this._isSealed = true;
            return this.CreateBindingExpressionOverride(targetObject, targetProperty, owner); 
        }, 

        // Throw if the binding is sealed. 
        CheckSealed:function()
        {
            if (this._isSealed)
                throw new Error("InvalidOperationException(SR.Get(SRID.ChangeSealedBinding)"); 
        },
 
        // Return one of the special ValidationRules 
//        internal ValidationRule 
        GetValidationRule:function(/*Type*/ type)
        { 
            if (this.TestFlag(BindingFlags.ValidatesOnExceptions) && type == ExceptionValidationRule.Type)
                return ExceptionValidationRule.Instance;

            if (this.TestFlag(BindingFlags.ValidatesOnDataErrors) && type == DataErrorValidationRule.Type) 
                return DataErrorValidationRule.Instance;
 
            if (this.TestFlag(BindingFlags.ValidatesOnNotifyDataErrors) && type == NotifyDataErrorValidationRule.Type) 
                return NotifyDataErrorValidationRule.Instance;
 
            return this.LookupValidationRule(type);
        },

//        internal virtual ValidationRule 
        LookupValidationRule:function(/*Type*/ type) 
        {
            return null; 
        },
        
        // return a copy of the current binding, but with the given mode
//        internal BindingBase 
        Clone:function(/*BindingMode*/ mode) 
        { 
            /*BindingBase*/var clone = this.CreateClone();
            this.InitializeClone(clone, mode); 
            return clone;
        },
        
        /*internal abstract BindingBase*/ 
        CreateClone:function(){
        },

        // initialize a clone 
//        internal virtual void 
        InitializeClone:function(/*BindingBase*/ clone, /*BindingMode*/ mode)
        { 
            clone._flags = this._flags; 
            CopyValue(Feature.FallbackValue, clone);
            clone._isSealed = this._isSealed; 
            CopyValue(Feature.StringFormat, clone);
            CopyValue(Feature.TargetNullValue, clone);
            CopyValue(Feature.BindingGroupName, clone);
 
            clone.ChangeFlagsWithinMask(BindingFlags.PropagationMask, FlagsFromBindingMode(mode));
        },
        
//        internal bool      
        HasValue:function(/*Feature*/ id) { return this._values.HasValue(id); },
//        internal object    
        GetValue:function(/*Feature*/ id, /*object*/ defaultValue) { return this._values.GetValue(id, defaultValue); }, 
//        internal void      
        SetValue:function(/*Feature*/ id, /*object*/ value) { this._values.SetValue(id, value); },
//        internal void      
        SetValue:function(/*Feature*/ id, /*object*/ value, /*object*/ defaultValue) 
        { 
        	if (Object.Equals(value, defaultValue)) 
        		this._values.ClearValue(id);
        	else 
        		this._values.SetValue(id, value); }, 
//        internal void      
        ClearValue:function(/*Feature*/ id) { this._values.ClearValue(id); }, 
//        internal void      
        CopyValue:function(/*Feature*/ id, /*BindingBase*/ clone) { if (this.HasValue(id)) { clone.SetValue(id, this.GetValue(id, null)); } },
	});
	
	Object.defineProperties(BindingBase.prototype,{

        /// <summary> Value to use when source cannot provide a value </summary> 
        /// <remarks> 
        ///     Initialized to DependencyProperty.UnsetValue; if FallbackValue is not set, BindingExpression
        ///     will return target property's default when Binding cannot get a real value. 
        /// </remarks>
        FallbackValue:
        {
            get:function() { return this.GetValue(Feature.FallbackValue, DependencyProperty.UnsetValue); }, 
            set:function(value) { this.CheckSealed(); this.SetValue(Feature.FallbackValue, value); }
        },
        
        /// <summary> Format string used to convert the data to type String. 
        /// </summary>
        /// <remarks>
        ///     This property is used when the target of the binding has type
        ///     String and no Converter is declared.  It is ignored in all other 
        ///     cases.
        /// </remarks> 
        StringFormat:
        { 
            get:function() { return this.GetValue(Feature.StringFormat, null); },
            set:function(value) { this.CheckSealed(); this.SetValue(Feature.StringFormat, value, null); }
        },
 
        /// <summary> Value used to represent "null" in the target property.
        /// </summary> 
        TargetNullValue:
        {
            get:function() { return this.GetValue(Feature.TargetNullValue, DependencyProperty.UnsetValue); }, 
            set:function(value) { this.CheckSealed(); this.SetValue(Feature.TargetNullValue, value); }
        },
        
        /// <summary> Name of the <see cref="BindingGroup"/> this binding should join.
        /// </summary> 
        BindingGroupName:
        { 
            get:function() { return this.GetValue(Feature.BindingGroupName, String.Empty); },
            set:function(value) { this.CheckSealed(); this.SetValue(Feature.BindingGroupName, value, String.Empty); }
        },
        /// <summary>
        /// The time (in milliseconds) to wait after the most recent property 
        /// change before performing source update. 
        /// </summary>
        /// <remarks> 
        /// This property affects only TwoWay bindings with UpdateSourceTrigger=PropertyChanged.
        /// </remarks>
        Delay:
        {
            get:function() { return this.GetValue(Feature.Delay, 0); }, 
            set:function(value) { this.CheckSealed(); this.SetValue(Feature.Delay, value, 0); } 
        },
        
        Flags: { get:function() { return this._flags; } },

        ConverterCultureInternal:
        {
            get:function() { return null; }
        },
 
        ValidationRulesInternal:
        { 
            get:function() { return null; } 
        },
 
        ValidatesOnNotifyDataErrorsInternal:
        {
            get:function() { return false; }
        } 
	});

//    /// <summary> Convert the given BindingMode to BindingFlags. </summary> 
//    /*internal static BindingFlags */
//	FlagsFrom(/*BindingMode*/ bindingMode){ 
//        switch (bindingMode){
//            case BindingMode.OneWay:            return BindingFlags.OneWay; 
//            case BindingMode.TwoWay:            return BindingFlags.TwoWay;
//            case BindingMode.OneWayToSource:    return BindingFlags.OneWayToSource;
//            case BindingMode.OneTime:           return BindingFlags.OneTime;
//            case BindingMode.Default:           return BindingFlags.PropDefault; 
//        }
//
//        return BindingFlags.IllegalInput; 
//    };
//
//    /// <summary> Convert the given UpdateSourceTrigger to BindingFlags. </summary>
///*    internal static BindingFlags */
//    BindingBase.FlagsFrom=function(/*UpdateSourceTrigger*/ updateSourceTrigger)
//    {
//        switch (updateSourceTrigger) 
//        {
//            case UpdateSourceTrigger.Default:           return BindingFlags.UpdateDefault; 
//            case UpdateSourceTrigger.PropertyChanged:   return BindingFlags.UpdateOnPropertyChanged; 
//            case UpdateSourceTrigger.LostFocus:         return BindingFlags.UpdateOnLostFocus;
//            case UpdateSourceTrigger.Explicit:          return BindingFlags.UpdateExplicitly; 
//        }
//
//        return BindingFlags.IllegalInput;
//    };
    
    /// <summary> Convert the given BindingMode to BindingFlags. </summary> 
    /*internal static BindingFlags */
	BindingBase.FlagsFromBindingMode=function(/*BindingMode or UpdateSourceTrigger*/ par){ 
        switch (par){
            case BindingMode.OneWay:            return BindingFlags.OneWay; 
            case BindingMode.TwoWay:            return BindingFlags.TwoWay;
            case BindingMode.OneWayToSource:    return BindingFlags.OneWayToSource;
            case BindingMode.OneTime:           return BindingFlags.OneTime;
            case BindingMode.Default:           return BindingFlags.PropDefault; 
        }

        return BindingFlags.IllegalInput; 
    };
    
    /// <summary> Convert the given BindingMode to BindingFlags. </summary> 
    /*internal static BindingFlags */
	BindingBase.FlagsFromUpdateSourceTrigger=function(/*BindingMode or UpdateSourceTrigger*/ par){ 
        switch (par) 
        {
            case UpdateSourceTrigger.Default:           return BindingFlags.UpdateDefault; 
            case UpdateSourceTrigger.PropertyChanged:   return BindingFlags.UpdateOnPropertyChanged; 
            case UpdateSourceTrigger.LostFocus:         return BindingFlags.UpdateOnLostFocus;
            case UpdateSourceTrigger.Explicit:          return BindingFlags.UpdateExplicitly; 
        }

        return BindingFlags.IllegalInput;
    };
    
//    internal static ValidationRule 
    BindingBase.LookupValidationRule = function(/*Type*/ type, /*Collection<ValidationRule>*/ collection) 
    {
        if (collection == null)
            return null;

        for (var i=0; i<collection.Count; ++i)
        { 
            if (type.IsInstanceOfType(collection.Get(i))) 
                return collection.Get(i);
        } 

        return null;
    };

	BindingBase.Type = new Type("BindingBase", BindingBase, [MarkupExtension.Type]);
	BindingBase.Feature = Feature;
	return BindingBase;
});




