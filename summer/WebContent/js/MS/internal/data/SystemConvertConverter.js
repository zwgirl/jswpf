/**
 * SystemConvertConverter
 */

define(["dojo/_base/declare", "system/Type", "data/IValueConverter"], 
		function(declare, Type, IValueConverter){
    // list of types supported by System.Convert (from the SDK)
//    static readonly Type[] 
	var SupportedTypes = [
        String.Type,                             // put common types up front
        /*typeof(Int32),  typeof(Int64),  typeof(Single), typeof(Double), 
        typeof(Decimal),typeof(Boolean),
        typeof(Byte),   typeof(Int16), 
        typeof(UInt32), typeof(UInt64), typeof(UInt16), typeof(SByte)*/
        Number.Type  // non-CLS compliant types 
    ];

    // list of types supported by System.Convert for Char Type(from the SDK)
//    static readonly Type[] 
	var CharSupportedTypes = [
        String.Type,                             // put common types up front
        /*typeof(Int32),  typeof(Int64),  typeof(Byte),   typeof(Int16), 
        typeof(UInt32), typeof(UInt64), typeof(UInt16), typeof(SByte)*/
        Number.Type,  // non-CLS compliant types
    ];
    
	var SystemConvertConverter = declare("SystemConvertConverter", IValueConverter,{
		constructor:function(/*Type*/ sourceType, /*Type*/ targetType) 
        { 
            this._sourceType = sourceType;
            this._targetType = targetType; 
        },
        
//        public object 
        Convert:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture)
        { 
        	//cym comment
//            return System.Convert.ChangeType(o, this._targetType, culture);
        	if(o == null){
        		return null;
        	}
        	
        	return o.toString();
        }, 
 
//        public object 
        ConvertBack:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture)
        { 
            var parsedValue = DefaultValueConverter.TryParse(o, this._sourceType, culture);
            return (parsedValue != DependencyProperty.UnsetValue)
                        ? parsedValue
                        : System.Convert.ChangeType(o, this._sourceType, culture); 
        }
 
	});
	
	// ASSUMPTION: sourceType != targetType 
	//public static bool 
	SystemConvertConverter.CanConvert = function(/*Type*/ sourceType, /*Type*/ targetType)
	{ 
		// This assert is not Invariant.Assert because this will not cause
		// harm; It would just be odd.
		//  Debug.Assert(sourceType != targetType);

		// DateTime can only be converted to and from String type
		if (sourceType == Date.Type) 
			return (targetType == String.Type); 
		if (targetType == Date.Type)
			return (sourceType == String.Type); 

		//  // Char can only be converted to a subset of supported types
		//  if (sourceType == typeof(Char))
		//	      return CanConvertChar(targetType); 
		//  if (targetType == typeof(Char))
		//	      return CanConvertChar(sourceType); 

		// Using nested loops is up to 40% more efficient than using one loop
		for (var i = 0; i < SupportedTypes.length; ++i) 
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
	};
	
//    private static bool 
	function CanConvertChar(/*Type*/ type) 
    {
        for (var i = 0; i < CharSupportedTypes.length; ++i) 
        {
            if (type == CharSupportedTypes[i])
                return true;
        } 
        return false;
    } 
	
	SystemConvertConverter.Type = new Type("SystemConvertConverter", SystemConvertConverter, [IValueConverter.Type]);
	return SystemConvertConverter;
});
