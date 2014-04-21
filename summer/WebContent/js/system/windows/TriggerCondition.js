/**
 * from StyleHelper
 */

/**
 * TriggerCondition
 */

define(["dojo/_base/declare", "system/Type", "windows/LogicalOp", "windows/DependencyProperty", "data/BindingBase",
        "windows/BindingValueCache"], 
		function(declare, Type, LogicalOp, DependencyProperty, BindingBase,
				BindingValueCache){
	var TriggerCondition = declare("TriggerCondition", Object,{
		constructor:function(/*BindingBase binding or DependencyProperty dp*/obj, 
				/*LogicalOp*/ logicalOp, /*object*/ value, /*string*/ sourceName) 
        {
            if(obj instanceof DependencyProperty){
    			this.Property = obj; 
            }else if(obj instanceof BindingBase){
                this.Binding = obj;
            }
            
            if(sourceName === undefined){
            	sourceName = StyleHelper.SelfName;
            }
            
//			this.Property = obj; 
            this.LogicalOp = logicalOp;
            this.Value = value;
            this.SourceName = sourceName; 
            this.SourceChildIndex = 0;
            this.BindingValueCache = new BindingValueCache(null, null);
		},

//        private bool 
        Match:function(/*object*/ state, /*object*/ referenceValue) 
        { 
        	if(referenceValue === undefined){
        		referenceValue = this.Value;
        	}
            if (this.LogicalOp == LogicalOp.Equals)
            { 
                return Object.Equals(state, referenceValue);
            }
            else
            { 
                return !Object.Equals(state, referenceValue);
            } 
        },

        // Check for match, after converting the reference value to the type 
        // of the state value.  (Used by data triggers)
//        internal bool 
        ConvertAndMatch:function(/*object*/ state)
        {
            // convert the reference value to the type of 'state', 
            // provided the reference value is a string and the
            // state isn't null or a string.  (Otherwise, we can 
            // compare the state and reference values directly.) 
            /*object*/
        	var referenceValue = this.Value;
//            string var referenceString = referenceValue as String; 
            /*string*/
        	var referenceString = typeof(referenceValue) == 'string' ? referenceValue : null; 
            /*Type*/
        	var stateType = (state != null) ? state.GetType() : null;

            if (referenceString != null && stateType != null &&
                stateType != String.Type/*typeof(String)*/) 
            {
                // the most recent type and value are cached in the 
                // TriggerCondition, since it's very likely the 
                // condition's Binding produces the same type of
                // value every time.  The cached values can be used 
                // on any thread, so we must synchronize access.
                /*BindingValueCache*/
            	var bindingValueCache = this.BindingValueCache;
                /*Type*/
            	var cachedType = bindingValueCache.BindingValueType;
                /*object*/
            	var cachedValue = bindingValueCache.ValueAsBindingValueType; 

                if (stateType != cachedType) 
                { 
                    // the cached type isn't the current type - refresh the cache
 
                    cachedValue = referenceValue; // in case of failure
                    /*TypeConverter*/
                    var typeConverter = DefaultValueConverter.GetConverter(stateType);
                    if (typeConverter != null && typeConverter.CanConvertFrom(String.Type/*typeof(String)*/))
                    { 

                        try 
                        {
                            cachedValue = typeConverter.ConvertFromString(null, 
                            		System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS, referenceString); 
                        } 
                        catch (/*Exception*/ ex)
                        { 
                            if (CriticalExceptions.IsCriticalApplicationException(ex))
                                throw ex;
                            // if the conversion failed, just use the unconverted value
                        } 
                    }
 
                    // cache the converted value
                    bindingValueCache = new BindingValueCache(stateType, cachedValue); 
                    this.BindingValueCache = bindingValueCache; 
                }
 
                referenceValue = cachedValue;
            }

            return this.Match(state, referenceValue); 
        },
 
        // Implemented for #1038821, FxCop ConsiderOverridingEqualsAndOperatorEqualsOnValueTypes 
        //  Called from ChildValueLookup.Equals, avoid boxing by not using the generic object-based Equals.
//        internal bool 
        TypeSpecificEquals:function( /*TriggerCondition*/ value ) 
        {
            if( this.Property            === value.Property &&
            		this.Binding             === this.value.Binding &&
            		this.LogicalOp           === this.value.LogicalOp && 
            		this.Value               == this.value.Value &&
            		this.SourceName          === this.value.SourceName ) 
            { 
                return true;
            } 
            return false;
        }
	});
	
	Object.defineProperties(TriggerCondition.prototype,{
//	    internal readonly DependencyProperty        
	    Property: 
        {
        	get:function(){
        		return this._property;
        	},
        	set:function(value)
        	{
        		this._property = value;
        	}
        },
//	    internal readonly BindingBase               
	    Binding: 
        {
        	get:function(){
        		return this._binding;
        	},
        	set:function(value)
        	{
        		this._binding = value;
        	}
        },
//	    internal readonly LogicalOp                 
	    LogicalOp:
        {
        	get:function(){
        		return this._logicalOp;
        	},
        	set:function(value)
        	{
        		this._logicalOp = value;
        	}
        },
//	    internal readonly object                    
	    Value: 
        {
        	get:function(){
        		return this._value;
        	},
        	set:function(value)
        	{
        		this._value = value;
        	}
        },
//	    internal readonly string                    
	    SourceName:
        {
        	get:function(){
        		return this._sourceName;
        	},
        	set:function(value)
        	{
        		this._sourceName = value;
        	}
        },
//	    internal          int                       
	    SourceChildIndex:
        {
        	get:function(){
        		return this._sourceChildIndex;
        	},
        	set:function(value)
        	{
        		this._sourceChildIndex = value;
        	}
        },
//	    internal          BindingValueCache         
	    BindingValueCache:
        {
        	get:function(){
        		return this._bindingValueCache;
        	},
        	set:function(value)
        	{
        		this._bindingValueCache = value;
        	}
        },
	});
	
	TriggerCondition.Type = new Type("TriggerCondition", TriggerCondition, [Object.Type]);
	return TriggerCondition;
});

//   // 
//    //  Conditions set on [Multi]Trigger are stored
//    //  in structures of this kind
//    //
//    internal struct TriggerCondition 
//    {
//        #region Construction 
// 
//        internal TriggerCondition(DependencyProperty dp, LogicalOp logicalOp, object value, string sourceName)
//        { 
//            Property = dp;
//            Binding = null;
//            LogicalOp = logicalOp;
//            Value = value; 
//            SourceName = sourceName;
//            SourceChildIndex = 0; 
//            BindingValueCache = new BindingValueCache(null, null); 
//        }
// 
//        internal TriggerCondition(BindingBase binding, LogicalOp logicalOp, object value) :
//            this(binding, logicalOp, value, StyleHelper.SelfName)
//        {
//            // Call Forwarded 
//        }
// 
//        internal TriggerCondition(BindingBase binding, LogicalOp logicalOp, object value, string sourceName) 
//        {
//            Property = null; 
//            Binding = binding;
//            LogicalOp = logicalOp;
//            Value = value;
//            SourceName = sourceName; 
//            SourceChildIndex = 0;
//            BindingValueCache = new BindingValueCache(null, null); 
//        } 
//
//        // Check for match 
//        internal bool Match(object state)
//        {
//            return Match(state, Value);
//        } 
//
//        private bool Match(object state, object referenceValue) 
//        { 
//            if (LogicalOp == LogicalOp.Equals)
//            { 
//                return Object.Equals(state, referenceValue);
//            }
//            else
//            { 
//                return !Object.Equals(state, referenceValue);
//            } 
//        } 
//
//        // Check for match, after converting the reference value to the type 
//        // of the state value.  (Used by data triggers)
//        internal bool ConvertAndMatch(object state)
//        {
//            // convert the reference value to the type of 'state', 
//            // provided the reference value is a string and the
//            // state isn't null or a string.  (Otherwise, we can 
//            // compare the state and reference values directly.) 
//            object referenceValue = Value;
//            string referenceString = referenceValue as String; 
//            Type stateType = (state != null) ? state.GetType() : null;
//
//            if (referenceString != null && stateType != null &&
//                stateType != typeof(String)) 
//            {
//                // the most recent type and value are cached in the 
//                // TriggerCondition, since it's very likely the 
//                // condition's Binding produces the same type of
//                // value every time.  The cached values can be used 
//                // on any thread, so we must synchronize access.
//                BindingValueCache bindingValueCache = BindingValueCache;
//                Type cachedType = bindingValueCache.BindingValueType;
//                object cachedValue = bindingValueCache.ValueAsBindingValueType; 
//
//                if (stateType != cachedType) 
//                { 
//                    // the cached type isn't the current type - refresh the cache
// 
//                    cachedValue = referenceValue; // in case of failure
//                    TypeConverter typeConverter = DefaultValueConverter.GetConverter(stateType);
//                    if (typeConverter != null && typeConverter.CanConvertFrom(typeof(String)))
//                    { 
//                        // PreSharp uses message numbers that the C# compiler doesn't know about.
//                        // Disable the C# complaints, per the PreSharp documentation. 
//                        #pragma warning disable 1634, 1691 
//
//                        // PreSharp complains about catching NullReference (and other) exceptions. 
//                        // It doesn't recognize that IsCritical[Application]Exception() handles these correctly.
//                        #pragma warning disable 56500
//
//                        try 
//                        {
//                            cachedValue = typeConverter.ConvertFromString(null, System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS, referenceString); 
//                        } 
//                        catch (Exception ex)
//                        { 
//                            if (CriticalExceptions.IsCriticalApplicationException(ex))
//                                throw;
//                            // if the conversion failed, just use the unconverted value
//                        } 
//                        catch // non CLS compliant exception
//                        { 
//                            // if the conversion failed, just use the unconverted value 
//                        }
// 
//                        #pragma warning restore 56500
//                        #pragma warning restore 1634, 1691
//                    }
// 
//                    // cache the converted value
//                    bindingValueCache = new BindingValueCache(stateType, cachedValue); 
//                    BindingValueCache = bindingValueCache; 
//                }
// 
//                referenceValue = cachedValue;
//            }
//
//            return Match(state, referenceValue); 
//        }
// 
//        // Implemented for #1038821, FxCop ConsiderOverridingEqualsAndOperatorEqualsOnValueTypes 
//        //  Called from ChildValueLookup.Equals, avoid boxing by not using the generic object-based Equals.
//        internal bool TypeSpecificEquals( TriggerCondition value ) 
//        {
//            if( Property            == value.Property &&
//                Binding             == value.Binding &&
//                LogicalOp           == value.LogicalOp && 
//                Value               == value.Value &&
//                SourceName          == value.SourceName ) 
//            { 
//                return true;
//            } 
//            return false;
//        }
//
//        #endregion Construction 
//
//        internal readonly DependencyProperty        Property; 
//        internal readonly BindingBase               Binding; 
//        internal readonly LogicalOp                 LogicalOp;
//        internal readonly object                    Value; 
//        internal readonly string                    SourceName;
//        internal          int                       SourceChildIndex;
//        internal          BindingValueCache         BindingValueCache;
//    } 