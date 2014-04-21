/**
 * Convert
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var Convert = declare("Convert", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(Convert.prototype,{
		  
	});
	
	Object.defineProperties(Convert,{
		  
	});
	
	Convert.Type = new Type("Convert", Convert, [Object.Type]);
	return Convert;
});
 
    // Returns the type code of this object. An implementation of this method 
    // must not return TypeCode.Empty (which represents a null reference) or
    // TypeCode.Object (which represents an object that doesn't implement the 
    // IConvertible interface). An implementation of this method should return
    // TypeCode.DBNull if the value of this object is a database null. For
    // example, a nullable integer type should return TypeCode.DBNull if the
    // value of the object is the database null. Otherwise, an implementation 
    // of this method should return the TypeCode that best describes the
    // internal representation of the object. 
    // The Value class provides conversion and querying methods for values. The 
    // Value class contains static members only, and it is not possible to create
    // instances of the class. 
    //
    // The statically typed conversion methods provided by the Value class are all
    // of the form:
    // 
    //    public static XXX ToXXX(YYY value)
    // 
    // where XXX is the target type and YYY is the source type. The matrix below 
    // shows the set of supported conversions. The set of conversions is symmetric
    // such that for every ToXXX(YYY) there is also a ToYYY(XXX). 
    //
    // From:  To: Bol Chr SBy Byt I16 U16 I32 U32 I64 U64 Sgl Dbl Dec Dat Str
    // ---------------------------------------------------------------------
    // Boolean     x       x   x   x   x   x   x   x   x   x   x   x       x 
    // Char            x   x   x   x   x   x   x   x   x                   x
    // SByte       x   x   x   x   x   x   x   x   x   x   x   x   x       x 
    // Byte        x   x   x   x   x   x   x   x   x   x   x   x   x       x 
    // Int16       x   x   x   x   x   x   x   x   x   x   x   x   x       x
    // UInt16      x   x   x   x   x   x   x   x   x   x   x   x   x       x 
    // Int32       x   x   x   x   x   x   x   x   x   x   x   x   x       x
    // UInt32      x   x   x   x   x   x   x   x   x   x   x   x   x       x
    // Int64       x   x   x   x   x   x   x   x   x   x   x   x   x       x
    // UInt64      x   x   x   x   x   x   x   x   x   x   x   x   x       x 
    // Single      x       x   x   x   x   x   x   x   x   x   x   x       x
    // Double      x       x   x   x   x   x   x   x   x   x   x   x       x 
    // Decimal     x       x   x   x   x   x   x   x   x   x   x   x       x 
    // DateTime                                                        x   x
    // String      x   x   x   x   x   x   x   x   x   x   x   x   x   x   x 
    // ---------------------------------------------------------------------
    //
    // For dynamic conversions, the Value class provides a set of methods of the
    // form: 
    //
    //    public static XXX ToXXX(object value) 
    // 
    // where XXX is the target type (Boolean, Char, SByte, Byte, Int16, UInt16,
    // Int32, UInt32, Int64, UInt64, Single, Double, Decimal, DateTime, 
    // or String). The implementations of these methods all take the form:
    //
    //    public static XXX toXXX(object value) {
    //        return value == null? XXX.Default: ((IConvertible)value).ToXXX(); 
    //    }
    // 
    // The code first checks if the given value is a null reference (which is the 
    // same as Value.Empty), in which case it returns the default value for type
    // XXX. Otherwise, a cast to IConvertible is performed, and the appropriate ToXXX() 
    // method is invoked on the object. An InvalidCastException is thrown if the
    // cast to IConvertible fails, and that exception is simply allowed to propagate out
    // of the conversion method.
 
    // Constant representing the database null value. This value is used in
    // database applications to indicate the absense of a known value. Note 
    // that Value.DBNull is NOT the same as a null object reference, which is 
    // represented by Value.Empty.
    // 
    // The Equals() method of DBNull always returns false, even when the
    // argument is itself DBNull.
    //
    // When passed Value.DBNull, the Value.GetTypeCode() method returns 
    // TypeCode.DBNull.
    // 
    // When passed Value.DBNull, the Value.ToXXX() methods all throw an 
    // InvalidCastException.
 
    public static class Convert {


        // Converts the given object to the given type. In general, this method is 
        // equivalent to calling the Value.ToXXX(value) method for the given
        // typeCode and boxing the result.
        //
        // The method first checks if the given object implements IConvertible. If not, 
        // the only permitted conversion is from a null to TypeCode.Empty, the
        // result of which is null. 
        // 
        // If the object does implement IConvertible, a check is made to see if the
        // object already has the given type code, in which case the object is 
        // simply returned. Otherwise, the appropriate ToXXX() is invoked on the
        // object's implementation of IConvertible.
        public static Object ChangeType(Object value, TypeCode typeCode) {
            return ChangeType(value, typeCode, Thread.CurrentThread.CurrentCulture); 
        }
 
        public static Object ChangeType(Object value, TypeCode typeCode, IFormatProvider provider) { 
            if (value == null && (typeCode == TypeCode.Empty || typeCode == TypeCode.String || typeCode == TypeCode.Object)) {
                return null; 
            }

            IConvertible v = value as IConvertible;
            if (v == null) { 
                throw new InvalidCastException(Environment.GetResourceString("InvalidCast_IConvertible"));
            } 
 
            // This line is invalid for things like Enums that return a TypeCode
            // of Int32, but the object can't actually be cast to an Int32. 
            //            if (v.GetTypeCode() == typeCode) return value;
            switch (typeCode) {
            case TypeCode.Boolean:
                return v.ToBoolean(provider); 
            case TypeCode.Int32: 
                return v.ToInt32(provider); 
            case TypeCode.Double: 
                return v.ToDouble(provider);
            case TypeCode.DateTime:
                return v.ToDateTime(provider);
            case TypeCode.String: 
                return v.ToString(provider);
            case TypeCode.Object: 
                return value; 
            case TypeCode.Empty:
                throw new InvalidCastException(Environment.GetResourceString("InvalidCast_Empty"));
            default:
                throw new ArgumentException(Environment.GetResourceString("Arg_UnknownTypeCode")); 
            }
        } 
 
        internal static Object DefaultToType(IConvertible value, Type targetType, IFormatProvider provider) {
            Contract.Requires(value != null, "[Convert.DefaultToType]value!=null"); 
            if (targetType==null) {
                throw new ArgumentNullException("targetType");
            }
            Contract.EndContractBlock(); 

            RuntimeType rtTargetType = targetType as RuntimeType; 
 
            if (rtTargetType != null)
            { 
                if (value.GetType() == targetType)
                {
                    return value;
                } 

                if (rtTargetType == ConvertTypes[(int)TypeCode.Boolean]) 
                    return value.ToBoolean(provider); 
                if (rtTargetType == ConvertTypes[(int)TypeCode.Char])
                    return value.ToChar(provider); 
                if (rtTargetType == ConvertTypes[(int)TypeCode.SByte])
                    return value.ToSByte(provider);
                if (rtTargetType == ConvertTypes[(int)TypeCode.Byte])
                    return value.ToByte(provider); 
                if (rtTargetType == ConvertTypes[(int)TypeCode.Int16])
                    return value.ToInt16(provider); 
                if (rtTargetType == ConvertTypes[(int)TypeCode.UInt16]) 
                    return value.ToUInt16(provider);
                if (rtTargetType == ConvertTypes[(int)TypeCode.Int32]) 
                    return value.ToInt32(provider);
                if (rtTargetType == ConvertTypes[(int)TypeCode.UInt32])
                    return value.ToUInt32(provider);
                if (rtTargetType == ConvertTypes[(int)TypeCode.Int64]) 
                    return value.ToInt64(provider);
                if (rtTargetType == ConvertTypes[(int)TypeCode.UInt64]) 
                    return value.ToUInt64(provider); 
                if (rtTargetType == ConvertTypes[(int)TypeCode.Single])
                    return value.ToSingle(provider); 
                if (rtTargetType == ConvertTypes[(int)TypeCode.Double])
                    return value.ToDouble(provider);
                if (rtTargetType == ConvertTypes[(int)TypeCode.Decimal])
                    return value.ToDecimal(provider); 
                if (rtTargetType == ConvertTypes[(int)TypeCode.DateTime])
                    return value.ToDateTime(provider); 
                if (rtTargetType == ConvertTypes[(int)TypeCode.String]) 
                    return value.ToString(provider);
                if (rtTargetType == ConvertTypes[(int)TypeCode.Object]) 
                    return (Object)value;
                //  Need to special case Enum because typecode will be underlying type, e.g. Int32
                if (rtTargetType == EnumType)
                    return (Enum)value; 
                if (rtTargetType == ConvertTypes[(int)TypeCode.DBNull])
                    throw new InvalidCastException(Environment.GetResourceString("InvalidCast_DBNull")); 
                if (rtTargetType == ConvertTypes[(int)TypeCode.Empty]) 
                    throw new InvalidCastException(Environment.GetResourceString("InvalidCast_Empty"));
            } 

            throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", value.GetType().FullName, targetType.FullName));
        }
 
        public static Object ChangeType(Object value, Type conversionType) {
            return ChangeType(value, conversionType, Thread.CurrentThread.CurrentCulture); 
        } 

        public static Object ChangeType(Object value, Type conversionType, IFormatProvider provider) { 
            if( conversionType == null) {
                throw new ArgumentNullException("conversionType");
            }

            if( value == null ) { 
                if(conversionType.IsValueType) { 
                    throw new InvalidCastException(Environment.GetResourceString("InvalidCast_CannotCastNullToValueType"));
                } 
                return null;
            }

            IConvertible ic = value as IConvertible; 
            if (ic == null) {
                if ( value.GetType() == conversionType) { 
                    return value; 
                }
                throw new InvalidCastException(Environment.GetResourceString("InvalidCast_IConvertible")); 
            }

            RuntimeType rtConversionType = conversionType as RuntimeType;
 
            if (rtConversionType==ConvertTypes[(int)TypeCode.Boolean])
                return ic.ToBoolean(provider); 
            if (rtConversionType==ConvertTypes[(int)TypeCode.Int32])
                return ic.ToInt32(provider); 
            if (rtConversionType==ConvertTypes[(int)TypeCode.Double]) 
                return ic.ToDouble(provider);
            if (rtConversionType==ConvertTypes[(int)TypeCode.Decimal])
                return ic.ToDecimal(provider);
            if (rtConversionType==ConvertTypes[(int)TypeCode.DateTime]) 
                return ic.ToDateTime(provider);
            if (rtConversionType==ConvertTypes[(int)TypeCode.String]) 
                return ic.ToString(provider); 
            if (rtConversionType==ConvertTypes[(int)TypeCode.Object])
                return (Object)value; 

            return ic.ToType(conversionType, provider);
        }
 
        // Conversions to Boolean
        public static bool ToBoolean(Object value) { 
            return value == null? false: ((IConvertible)value).ToBoolean(null); 
        }
 
        public static bool ToBoolean(bool value) { 
            return value; 
        }
 

        public static bool ToBoolean(ulong value) { 
            return value != 0;
        } 
 
        public static bool ToBoolean(String value) {
            if (value == null) 
                return false;
            return Boolean.Parse(value);
        }
 
        public static bool ToBoolean(/*String*/ value/*, IFormatProvider provider*/) {
            if (value == null) 
                return false; 
            if(typeof value == "string"){
            	return Boolean.Parse(value);
            }
        } 

        public static double ToDouble(String value, IFormatProvider provider) {
            if (value == null) 
                return 0;
            return Double.Parse(value, NumberStyles.Float | NumberStyles.AllowThousands, provider); 
        } 

        public static string ToString(Object value, IFormatProvider provider) { 
            IConvertible ic = value as IConvertible;
            if (ic != null)
                return ic.ToString(provider);
            IFormattable formattable = value as IFormattable; 
            if (formattable != null)
                return formattable.ToString(null, provider); 
            return value == null? String.Empty: value.ToString(); 
        }
 
    }  // class Convert
}  // namespace 

