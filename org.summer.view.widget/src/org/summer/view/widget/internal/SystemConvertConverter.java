package org.summer.view.widget.internal;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.Type;
import org.summer.view.widget.data.IValueConverter;
//#region SystemConvertConverter

    public class SystemConvertConverter implements IValueConverter 
    {
        public SystemConvertConverter(Type sourceType, Type targetType) 
        { 
            _sourceType = sourceType;
            _targetType = targetType; 
        }

        public Object Convert(Object o, Type type, Object parameter, CultureInfo culture)
        { 
            return /*System.*/org.summer.view.Convert.ChangeType(o, _targetType, culture);
        } 
 
        public Object ConvertBack(Object o, Type type, Object parameter, CultureInfo culture)
        { 
            Object parsedValue = DefaultValueConverter.TryParse(o, _sourceType, culture);
            return (parsedValue != DependencyProperty.UnsetValue)
                        ? parsedValue
                        : /*System.*/org.summer.view.Convert.ChangeType(o, _sourceType, culture); 
        }
 
        // ASSUMPTION: sourceType != targetType 
        public static boolean CanConvert(Type sourceType, Type targetType)
        { 
            // This assert is not Invariant.Assert because this will not cause
            // harm; It would just be odd.
            Debug.Assert(sourceType != targetType);
 
            // DateTime can only be converted to and from String type
            if (sourceType == typeof(DateTime)) 
                return (targetType == typeof(String)); 
            if (targetType == typeof(DateTime))
                return (sourceType == typeof(String)); 

            // Char can only be converted to a subset of supported types
            if (sourceType == typeof(Char))
                return CanConvertChar(targetType); 
            if (targetType == typeof(Char))
                return CanConvertChar(sourceType); 
 
            // Using nested loops is up to 40% more efficient than using one loop
            for (int i = 0; i < SupportedTypes.length; ++i) 
            {
                if (sourceType == SupportedTypes[i])
                {
                    ++i;    // assuming (sourceType != targetType), start at next type 
                    for (; i < SupportedTypes.length; ++i)
                    { 
                        if (targetType == SupportedTypes[i]) 
                            return true;
                    } 
                }
                else if (targetType == SupportedTypes[i])
                {
                    ++i;    // assuming (sourceType != targetType), start at next type 
                    for (; i < SupportedTypes.length; ++i)
                    { 
                        if (sourceType == SupportedTypes[i]) 
                            return true;
                    } 
                }
            }

            return false; 
        }
 
        private static boolean CanConvertChar(Type type) 
        {
            for (int i = 0; i < CharSupportedTypes.length; ++i) 
            {
                if (type == CharSupportedTypes[i])
                    return true;
            } 
            return false;
        } 
 
        Type _sourceType, _targetType;
 
        // list of types supported by System.Convert (from the SDK)
        static final Type[] SupportedTypes = {
            typeof(String),                             // put common types up front
            typeof(Int32),  typeof(Int64),  typeof(Single), typeof(Double), 
            typeof(Decimal),typeof(Boolean),
            typeof(Byte),   typeof(Int16), 
            typeof(UInt32), typeof(UInt64), typeof(UInt16), typeof(SByte),  // non-CLS compliant types 
        };
 
        // list of types supported by System.Convert for Char Type(from the SDK)
        static final Type[] CharSupportedTypes = {
            typeof(String),                             // put common types up front
            typeof(Int32),  typeof(Int64),  typeof(Byte),   typeof(Int16), 
            typeof(UInt32), typeof(UInt64), typeof(UInt16), typeof(SByte),  // non-CLS compliant types
        }; 
    } 

//#endregion SystemConvertConverter 