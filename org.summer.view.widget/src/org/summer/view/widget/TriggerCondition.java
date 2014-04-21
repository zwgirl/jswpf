package org.summer.view.widget;

import org.summer.view.widget.data.BindingBase;
import org.summer.view.widget.internal.DefaultValueConverter;
import org.summer.view.widget.markup.TypeConverterHelper;
import org.summer.view.widget.model.TypeConverter;

// 
//  Conditions set on [Multi]Trigger are stored
//  in structures of this kind
//
/*internal*/ public  class TriggerCondition 
{
//    #region Construction 

    /*internal*/ public  TriggerCondition(DependencyProperty dp, LogicalOp logicalOp, Object value, String sourceName)
    { 
        Property = dp;
        Binding = null;
        LogicalOp = logicalOp;
        Value = value; 
        SourceName = sourceName;
        SourceChildIndex = 0; 
        BindingValueCache = new BindingValueCache(null, null); 
    }

    /*internal*/ public  TriggerCondition(BindingBase binding, LogicalOp logicalOp, Object value) 
    {
        this(binding, logicalOp, value, StyleHelper.SelfName);
        // Call Forwarded 
    }

    /*internal*/ public  TriggerCondition(BindingBase binding, LogicalOp logicalOp, Object value, String sourceName) 
    {
        Property = null; 
        Binding = binding;
        LogicalOp = logicalOp;
        Value = value;
        SourceName = sourceName; 
        SourceChildIndex = 0;
        BindingValueCache = new BindingValueCache(null, null); 
    } 

    // Check for match 
    /*internal*/ public  boolean Match(Object state)
    {
        return Match(state, Value);
    } 

    private boolean Match(Object state, Object referenceValue) 
    { 
        if (LogicalOp == LogicalOp.Equals)
        { 
            return Object.Equals(state, referenceValue);
        }
        else
        { 
            return !Object.Equals(state, referenceValue);
        } 
    } 

    // Check for match, after converting the reference value to the type 
    // of the state value.  (Used by data triggers)
    /*internal*/ public  boolean ConvertAndMatch(Object state)
    {
        // convert the reference value to the type of 'state', 
        // provided the reference value is a String and the
        // state isn't null or a String.  (Otherwise, we can 
        // compare the state and reference values directly.) 
        Object referenceValue = Value;
        String referenceString = referenceValue as String; 
        Type stateType = (state != null) ? state.GetType() : null;

        if (referenceString != null && stateType != null &&
            stateType != typeof(String)) 
        {
            // the most recent type and value are cached in the 
            // TriggerCondition, since it's very likely the 
            // condition's Binding produces the same type of
            // value every time.  The cached values can be used 
            // on any thread, so we must synchronize access.
            BindingValueCache bindingValueCache = BindingValueCache;
            Type cachedType = bindingValueCache.BindingValueType;
            Object cachedValue = bindingValueCache.ValueAsBindingValueType; 

            if (stateType != cachedType) 
            { 
                // the cached type isn't the current type - refresh the cache

                cachedValue = referenceValue; // in case of failure
                TypeConverter typeConverter = DefaultValueConverter.GetConverter(stateType);
                if (typeConverter != null && typeConverter.CanConvertFrom(typeof(String)))
                { 
                    // PreSharp uses message numbers that the C# compiler doesn't know about.
                    // Disable the C# complaints, per the PreSharp documentation. 
//                    #pragma warning disable 1634, 1691 

                    // PreSharp complains about catching NullReference (and other) exceptions. 
                    // It doesn't recognize that IsCritical[Application]Exception() handles these correctly.
//                    #pragma warning disable 56500

                    try 
                    {
                        cachedValue = typeConverter.ConvertFromString(null, /*System.Windows.Markup.*/TypeConverterHelper.InvariantEnglishUS, referenceString); 
                    } 
                    catch (Exception ex)
                    { 
                        if (CriticalExceptions.IsCriticalApplicationException(ex))
                            throw ex;
                        // if the conversion failed, just use the unconverted value
                    } 
//                    catch // non CLS compliant exception
//                    { 
//                        // if the conversion failed, just use the unconverted value 
//                    }

//                    #pragma warning restore 56500
//                    #pragma warning restore 1634, 1691
                }

                // cache the converted value
                bindingValueCache = new BindingValueCache(stateType, cachedValue); 
                BindingValueCache = bindingValueCache; 
            }

            referenceValue = cachedValue;
        }

        return Match(state, referenceValue); 
    }

    // Implemented for #1038821, FxCop ConsiderOverridingEqualsAndOperatorEqualsOnValueTypes 
    //  Called from ChildValueLookup.Equals, avoid boxing by not using the generic Object-based Equals.
    /*internal*/ public  boolean TypeSpecificEquals( TriggerCondition value ) 
    {
        if( Property            == value.Property &&
            Binding             == value.Binding &&
            LogicalOp           == value.LogicalOp && 
            Value               == value.Value &&
            SourceName          == value.SourceName ) 
        { 
            return true;
        } 
        return false;
    }

//    #endregion Construction 

    /*internal*/ public  final DependencyProperty        Property; 
    /*internal*/ public  final BindingBase               Binding; 
    /*internal*/ public  final LogicalOp                 LogicalOp;
    /*internal*/ public  final Object                    Value; 
    /*internal*/ public  final String                    SourceName;
    /*internal*/ public           int                       SourceChildIndex;
    /*internal*/ public           BindingValueCache         BindingValueCache;
} 