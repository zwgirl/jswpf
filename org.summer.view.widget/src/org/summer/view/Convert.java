package org.summer.view;

import org.summer.view.widget.Type;
// Returns the type code of this object. An implementation of this method 
    // must not return TypeCode.Empty (which represents a null reference) or
    // TypeCode.Object (which represents an object that doesn't implement the 
    // IConvertible interface). An implementation of this method should return
    // TypeCode.DBNull if the value of this object is a database null. For
    // example, a nullable integer type should return TypeCode.DBNull if the
    // value of the object is the database null. Otherwise, an implementation 
    // of this method should return the TypeCode that best describes the
    // /*internal*/ public representation of the object. 
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
 
    public /*static*/ class Convert {

        //A typeof operation is fairly expensive (does a system call), so we'll cache these here
        //statically.  These are exactly lined up with the TypeCode, eg. ConvertType[TypeCode.Int16] 
        //will give you the type of an Int16.
        /*internal*/ public static final RuntimeType[] ConvertTypes = { 
            (RuntimeType)typeof(System.Empty), 
            (RuntimeType)typeof(Object),
            (RuntimeType)typeof(System.DBNull), 
            (RuntimeType)typeof(Boolean),
            (RuntimeType)typeof(Char),
            (RuntimeType)typeof(SByte),
            (RuntimeType)typeof(Byte), 
            (RuntimeType)typeof(Int16),
            (RuntimeType)typeof(UInt16), 
            (RuntimeType)typeof(Int32), 
            (RuntimeType)typeof(UInt32),
            (RuntimeType)typeof(Int64), 
            (RuntimeType)typeof(UInt64),
            (RuntimeType)typeof(Single),
            (RuntimeType)typeof(Double),
            (RuntimeType)typeof(Decimal), 
            (RuntimeType)typeof(DateTime),
            (RuntimeType)typeof(Object), //TypeCode is discontinuous so we need a placeholder. 
            (RuntimeType)typeof(String) 
        };
 
        // Need to special case Enum because typecode will be underlying type, e.g. Int32
        private static final RuntimeType EnumType = (RuntimeType)typeof(Enum);

        /*internal*/ public static final char[] base64Table = {'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O', 
                                                       'P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d',
                                                       'e','f','g','h','i','j','k','l','m','n','o','p','q','r','s', 
                                                       't','u','v','w','x','y','z','0','1','2','3','4','5','6','7', 
                                                       '8','9','+','/','=' };
 
        private final Int32 base64LineBreakPosition = 76;


        public static final Object DBNull = System.DBNull.Value; 

        // Returns the type code for the given object. If the argument is null,
        // the result is TypeCode.Empty. If the argument is not a value (i.e. if
        // the object does not implement IConvertible), the result is TypeCode.Object. 
        // Otherwise, the result is the type code of the object, as determined by
        // the object's implementation of IConvertible. 
        public static TypeCode GetTypeCode(object value) {
            if (value == null) return TypeCode.Empty; 
            IConvertible temp = value as IConvertible;
            if (temp != null)
            {
                return temp.GetTypeCode(); 
            }
            return TypeCode.Object; 
        } 

        // Returns true if the given object is a database null. This operation 
        // corresponds to "value.GetTypeCode() == TypeCode.DBNull".
        public static boolean IsDBNull(object value) {
            if (value == System.DBNull.Value) return true; 
            IConvertible convertible = value as IConvertible;
            return convertible != null? convertible.GetTypeCode() == TypeCode.DBNull: false; 
        } 

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
            case TypeCode.Char:
                return v.ToChar(provider); 
            case TypeCode.SByte: 
                return v.ToSByte(provider);
            case TypeCode.Byte: 
                return v.ToByte(provider);
            case TypeCode.Int16:
                return v.ToInt16(provider);
            case TypeCode.UInt16: 
                return v.ToUInt16(provider);
            case TypeCode.Int32: 
                return v.ToInt32(provider); 
            case TypeCode.UInt32:
                return v.ToUInt32(provider); 
            case TypeCode.Int64:
                return v.ToInt64(provider);
            case TypeCode.UInt64:
                return v.ToUInt64(provider); 
            case TypeCode.Single:
                return v.ToSingle(provider); 
            case TypeCode.Double: 
                return v.ToDouble(provider);
            case TypeCode.Decimal: 
                return v.ToDecimal(provider);
            case TypeCode.DateTime:
                return v.ToDateTime(provider);
            case TypeCode.String: 
                return v.ToString(provider);
            case TypeCode.Object: 
                return value; 
            case TypeCode.DBNull:
                throw new InvalidCastException(Environment.GetResourceString("InvalidCast_DBNull")); 
            case TypeCode.Empty:
                throw new InvalidCastException(Environment.GetResourceString("InvalidCast_Empty"));
            default:
                throw new ArgumentException(Environment.GetResourceString("Arg_UnknownTypeCode")); 
            }
        } 
 
        /*internal*/ public static Object DefaultToType(IConvertible value, Type targetType, IFormatProvider provider) {
            if (targetType==null) {
                throw new ArgumentNullException("targetType");
            }

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
            if (rtConversionType==ConvertTypes[(int)TypeCode.Char]) 
                return ic.ToChar(provider);
            if (rtConversionType==ConvertTypes[(int)TypeCode.SByte]) 
                return ic.ToSByte(provider);
            if (rtConversionType==ConvertTypes[(int)TypeCode.Byte])
                return ic.ToByte(provider);
            if (rtConversionType==ConvertTypes[(int)TypeCode.Int16]) 
                return ic.ToInt16(provider);
            if (rtConversionType==ConvertTypes[(int)TypeCode.UInt16]) 
                return ic.ToUInt16(provider); 
            if (rtConversionType==ConvertTypes[(int)TypeCode.Int32])
                return ic.ToInt32(provider); 
            if (rtConversionType==ConvertTypes[(int)TypeCode.UInt32])
                return ic.ToUInt32(provider);
            if (rtConversionType==ConvertTypes[(int)TypeCode.Int64])
                return ic.ToInt64(provider); 
            if (rtConversionType==ConvertTypes[(int)TypeCode.UInt64])
                return ic.ToUInt64(provider); 
            if (rtConversionType==ConvertTypes[(int)TypeCode.Single]) 
                return ic.ToSingle(provider);
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
        public static boolean ToBoolean(Object value) { 
            return value == null? false: ((IConvertible)value).ToBoolean(null); 
        }
 
        public static boolean ToBoolean(Object value, IFormatProvider provider) {
            return value == null? false: ((IConvertible)value).ToBoolean(provider);
        }
 

        public static boolean ToBoolean(boolean value) { 
            return value; 
        }
 
        public static boolean ToBoolean(sbyte value) {
            return value != 0;
        } 

        // To be consistent with IConvertible in the base data types else we get different semantics 
        // with widening operations. Without this operator this widen succeeds,with this API the widening throws. 
        public static boolean ToBoolean(char value) {
            return ((IConvertible)value).ToBoolean(null); 
        }

        public static boolean ToBoolean(byte value) {
            return value != 0; 
        }
 
 
        public static boolean ToBoolean(short value) {
            return value != 0; 
        }

        public static boolean ToBoolean(ushort value) { 
            return value != 0;
        } 
 
        public static boolean ToBoolean(int value) {
            return value != 0; 
        }

        public static boolean ToBoolean(uint value) { 
            return value != 0;
        } 
 
        public static boolean ToBoolean(long value) {
            return value != 0; 
        }

        public static boolean ToBoolean(ulong value) { 
            return value != 0;
        } 
 
        public static boolean ToBoolean(String value) {
            if (value == null) 
                return false;
            return Boolean.Parse(value);
        }
 
        public static boolean ToBoolean(String value, IFormatProvider provider) {
            if (value == null) 
                return false; 
            return Boolean.Parse(value);
        } 

        public static boolean ToBoolean(float value)
        {
            return value != 0; 
        }
 
        public static boolean ToBoolean(double value) 
        {
            return value != 0; 
        }

        public static boolean ToBoolean(decimal value)
        { 
            return value != 0;
        } 
 
        public static boolean ToBoolean(DateTime value)
        { 
            return ((IConvertible)value).ToBoolean(null);
        }

        // Disallowed conversions to Boolean 
        // public static boolean ToBoolean(TimeSpan value)
 
        // Conversions to Char 

 
        public static char ToChar(object value) {
            return value == null? (char)0: ((IConvertible)value).ToChar(null);
        }
 
        public static char ToChar(object value, IFormatProvider provider) {
            return value == null? (char)0: ((IConvertible)value).ToChar(provider); 
        } 

        public static char ToChar(boolean value) { 
            return ((IConvertible)value).ToChar(null);
        }

        public static char ToChar(char value) { 
            return value;
        } 
 
        public static char ToChar(sbyte value) { 
            if (value < 0) throw new OverflowException(Environment.GetResourceString("Overflow_Char"));
            Contract.EndContractBlock();
            return (char)value;
        } 

        public static char ToChar(byte value) { 
            return (char)value; 
        }
 
        public static char ToChar(short value) {
            if (value < 0) throw new OverflowException(Environment.GetResourceString("Overflow_Char"));
            Contract.EndContractBlock();
            return (char)value; 
        }
 
        public static char ToChar(ushort value) {
            return (char)value; 
        }

        public static char ToChar(int value) {
            if (value < 0 || value > Char.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Char")); 
            Contract.EndContractBlock();
            return (char)value; 
        } 

        public static char ToChar(uint value) {
            if (value > Char.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Char"));
            Contract.EndContractBlock();
            return (char)value; 
        }
 
        public static char ToChar(long value) { 
            if (value < 0 || value > Char.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Char"));
            Contract.EndContractBlock(); 
            return (char)value;
        }

        public static char ToChar(ulong value) {
            if (value > Char.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Char")); 
            Contract.EndContractBlock(); 
            return (char)value;
        } 

        //
        // @VariantSwitch
        // Remove FormatExceptions; 
        //
        public static char ToChar(String value) { 
            return ToChar(value, null); 
        }
 
        public static char ToChar(String value, IFormatProvider provider) {
            if (value == null)
                throw new ArgumentNullException("value");
            Contract.EndContractBlock(); 

            if (value.Length != 1) 
                throw new FormatException(Environment.GetResourceString(ResId.Format_NeedSingleChar)); 

            return value[0]; 
        }

        // To be consistent with IConvertible in the base data types else we get different semantics
        // with widening operations. Without this operator this widen succeeds,with this API the widening throws. 
        public static char ToChar(float value)
        { 
            return ((IConvertible)value).ToChar(null); 
        }
 
        // To be consistent with IConvertible in the base data types else we get different semantics
        // with widening operations. Without this operator this widen succeeds,with this API the widening throws.
        public static char ToChar(double value)
        { 
            return ((IConvertible)value).ToChar(null);
        } 
 
        // To be consistent with IConvertible in the base data types else we get different semantics
        // with widening operations. Without this operator this widen succeeds,with this API the widening throws. 
        public static char ToChar(decimal value)
        {
            return ((IConvertible)value).ToChar(null);
        } 

        public static char ToChar(DateTime value) 
        { 
            return ((IConvertible)value).ToChar(null);
        } 


        // Disallowed conversions to Char
        // public static char ToChar(TimeSpan value) 

        // Conversions to SByte 
 
        public static sbyte ToSByte(object value) { 
            return value == null? (sbyte)0: ((IConvertible)value).ToSByte(null);
        }

        public static sbyte ToSByte(object value, IFormatProvider provider) {
            return value == null? (sbyte)0: ((IConvertible)value).ToSByte(provider); 
        } 

        public static sbyte ToSByte(boolean value) {
            return value? (sbyte)Boolean.True: (sbyte)Boolean.False;
        }
 
        public static sbyte ToSByte(sbyte value) { 
            return value; 
        }
 
        public static sbyte ToSByte(char value) {
            if (value > SByte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_SByte"));
            Contract.EndContractBlock(); 
            return (sbyte)value;
        } 
 
        public static sbyte ToSByte(byte value) { 
            if (value > SByte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_SByte"));
            Contract.EndContractBlock();
            return (sbyte)value;
        } 

        public static sbyte ToSByte(short value) { 
            if (value < SByte.MinValue || value > SByte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_SByte"));
            Contract.EndContractBlock(); 
            return (sbyte)value;
        }

        public static sbyte ToSByte(ushort value) {
            if (value > SByte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_SByte")); 
            Contract.EndContractBlock(); 
            return (sbyte)value;
        } 

        public static sbyte ToSByte(int value) {
            if (value < SByte.MinValue || value > SByte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_SByte")); 
            Contract.EndContractBlock();
            return (sbyte)value; 
        } 

        public static sbyte ToSByte(uint value) {
            if (value > SByte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_SByte"));
            Contract.EndContractBlock();
            return (sbyte)value; 
        }
 
        public static sbyte ToSByte(long value) {
            if (value < SByte.MinValue || value > SByte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_SByte")); 
            Contract.EndContractBlock();
            return (sbyte)value;
        }
 
        public static sbyte ToSByte(ulong value) { 
            if (value > (ulong)SByte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_SByte")); 
            Contract.EndContractBlock();
            return (sbyte)value; 
        }

        public static sbyte ToSByte(float value) { 
            return ToSByte((double)value);
        } 
 
      
        public static sbyte ToSByte(double value) { 
            return ToSByte(ToInt32(value));
        }

        public static sbyte ToSByte(decimal value) {
            return Decimal.ToSByte(Decimal.Round(value, 0)); 
        } 

        public static sbyte ToSByte(String value) {
            if (value == null)
                return 0;
            return SByte.Parse(value, CultureInfo.CurrentCulture); 
        }
 
        public static sbyte ToSByte(String value, IFormatProvider provider) {
            return SByte.Parse(value, NumberStyles.Integer, provider); 
        }

        public static sbyte ToSByte(DateTime value) 
        {
            return ((IConvertible)value).ToSByte(null); 
        } 

        // Disallowed conversions to SByte 
        // public static sbyte ToSByte(TimeSpan value)

        // Conversions to Byte
 
        public static byte ToByte(object value) {
            return value == null? (byte)0: ((IConvertible)value).ToByte(null); 
        } 

        public static byte ToByte(object value, IFormatProvider provider) { 
            return value == null? (byte)0: ((IConvertible)value).ToByte(provider);
        }

        public static byte ToByte(boolean value) { 
            return value? (byte)Boolean.True: (byte)Boolean.False;
        } 
 
        public static byte ToByte(byte value) {
            return value; 
        }

        public static byte ToByte(char value) {
            if (value > Byte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Byte")); 
            Contract.EndContractBlock();
            return (byte)value; 
        } 

        public static byte ToByte(sbyte value) {
            if (value < Byte.MinValue) throw new OverflowException(Environment.GetResourceString("Overflow_Byte"));
            Contract.EndContractBlock();
            return (byte)value; 
        }
 
        public static byte ToByte(short value) { 
            if (value < Byte.MinValue || value > Byte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Byte"));
            Contract.EndContractBlock(); 
            return (byte)value;
        }

        public static byte ToByte(ushort value) {
            if (value > Byte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Byte")); 
            Contract.EndContractBlock(); 
            return (byte)value;
        } 

        public static byte ToByte(int value) {
            if (value < Byte.MinValue || value > Byte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Byte"));
            Contract.EndContractBlock(); 
            return (byte)value;
        } 
 
        public static byte ToByte(uint value) { 
            if (value > Byte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Byte"));
            Contract.EndContractBlock();
            return (byte)value;
        } 

        public static byte ToByte(long value) { 
            if (value < Byte.MinValue || value > Byte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Byte")); 
            Contract.EndContractBlock();
            return (byte)value; 
        }

        public static byte ToByte(ulong value) { 
            if (value > Byte.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Byte"));
            Contract.EndContractBlock(); 
            return (byte)value; 
        }
 
        public static byte ToByte(float value) {
            return ToByte((double)value);
        }
 
        public static byte ToByte(double value) {
            return ToByte(ToInt32(value)); 
        } 

        public static byte ToByte(decimal value) { 
            return Decimal.ToByte(Decimal.Round(value, 0));
        }

        public static byte ToByte(String value) { 
            if (value == null)
                return 0; 
            return Byte.Parse(value, CultureInfo.CurrentCulture); 
        }
 
        public static byte ToByte(String value, IFormatProvider provider) {
            if (value == null)
                return 0;
            return Byte.Parse(value, NumberStyles.Integer, provider); 
        }
 
        public static byte ToByte(DateTime value) 
        {
            return ((IConvertible)value).ToByte(null); 
        }


        // Disallowed conversions to Byte 
        // public static byte ToByte(TimeSpan value)
 
        // Conversions to Int16 

        public static short ToInt16(object value) { 
            return value == null? (short)0: ((IConvertible)value).ToInt16(null);
        }

        public static short ToInt16(object value, IFormatProvider provider) { 
            return value == null? (short)0: ((IConvertible)value).ToInt16(provider);
        } 
 
        public static short ToInt16(boolean value) {
            return value? (short)Boolean.True: (short)Boolean.False; 
        }

        public static short ToInt16(char value) {
            if (value > Int16.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Int16")); 
            Contract.EndContractBlock();
            return (short)value; 
        } 

        public static short ToInt16(sbyte value) {
            return value;
        }
 
        public static short ToInt16(byte value) {
            return value; 
        } 

        public static short ToInt16(ushort value) {
            if (value > Int16.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Int16"));
            Contract.EndContractBlock();
            return (short)value; 
        }
 
        public static short ToInt16(int value) { 
            if (value < Int16.MinValue || value > Int16.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Int16"));
            Contract.EndContractBlock(); 
            return (short)value;
        }

        public static short ToInt16(uint value) {
            if (value > Int16.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Int16")); 
            Contract.EndContractBlock(); 
            return (short)value;
        } 

        public static short ToInt16(short value) {
            return value;
        } 

        public static short ToInt16(long value) { 
            if (value < Int16.MinValue || value > Int16.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Int16")); 
            Contract.EndContractBlock();
            return (short)value; 
        }

      
        public static short ToInt16(ulong value) { 
            if (value > (ulong)Int16.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Int16"));
            Contract.EndContractBlock(); 
            return (short)value; 
        }
 
        public static short ToInt16(float value) {
            return ToInt16((double)value);
        }
 
        public static short ToInt16(double value) {
            return ToInt16(ToInt32(value)); 
        } 

        public static short ToInt16(decimal value) { 
            return Decimal.ToInt16(Decimal.Round(value, 0));
        }

        public static short ToInt16(String value) { 
            if (value == null)
                return 0; 
            return Int16.Parse(value, CultureInfo.CurrentCulture); 
        }
 
        public static short ToInt16(String value, IFormatProvider provider) {
            if (value == null)
                return 0;
            return Int16.Parse(value, NumberStyles.Integer, provider); 
        }
 
        public static short ToInt16(DateTime value) 
        {
            return ((IConvertible)value).ToInt16(null); 
        }


        // Disallowed conversions to Int16 
        // public static short ToInt16(TimeSpan value)
 
        // Conversions to UInt16 

        public static ushort ToUInt16(object value) {
            return value == null? (ushort)0: ((IConvertible)value).ToUInt16(null);
        }
 
        public static ushort ToUInt16(object value, IFormatProvider provider) { 
            return value == null? (ushort)0: ((IConvertible)value).ToUInt16(provider); 
        }
 

        public static ushort ToUInt16(boolean value) {
            return value? (ushort)Boolean.True: (ushort)Boolean.False; 
        }
 
        public static ushort ToUInt16(char value) {
            return value; 
        }

        public static ushort ToUInt16(sbyte value) { 
            if (value < 0) throw new OverflowException(Environment.GetResourceString("Overflow_UInt16"));
            Contract.EndContractBlock(); 
            return (ushort)value; 
        }
 
        public static ushort ToUInt16(byte value) {
            return value;
        } 

        public static ushort ToUInt16(short value) { 
            if (value < 0) throw new OverflowException(Environment.GetResourceString("Overflow_UInt16"));
            Contract.EndContractBlock(); 
            return (ushort)value;
        }

        public static ushort ToUInt16(int value) {
            if (value < 0 || value > UInt16.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_UInt16")); 
            Contract.EndContractBlock(); 
            return (ushort)value;
        } 

        public static ushort ToUInt16(ushort value) {
            return value; 
        }
 
        public static ushort ToUInt16(uint value) {
            if (value > UInt16.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_UInt16")); 
            Contract.EndContractBlock();
            return (ushort)value;
        }
 

        public static ushort ToUInt16(long value) { 
            if (value < 0 || value > UInt16.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_UInt16"));
            Contract.EndContractBlock(); 
            return (ushort)value;
        }

        public static ushort ToUInt16(ulong value) {
            if (value > UInt16.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_UInt16")); 
            Contract.EndContractBlock(); 
            return (ushort)value;
        } 

      
        public static ushort ToUInt16(float value) {
            return ToUInt16((double)value); 
        }
 
       
        public static ushort ToUInt16(double value) {
            return ToUInt16(ToInt32(value)); 
        }

      
        public static ushort ToUInt16(decimal value) { 
            return Decimal.ToUInt16(Decimal.Round(value, 0));
        } 
 
      
        public static ushort ToUInt16(String value) { 
            if (value == null)
                return 0;
            return UInt16.Parse(value, CultureInfo.CurrentCulture);
        } 

       
        public static ushort ToUInt16(String value, IFormatProvider provider) { 
            if (value == null)
                return 0; 
            return UInt16.Parse(value, NumberStyles.Integer, provider);
        }

       
        public static ushort ToUInt16(DateTime value)
        { 
            return ((IConvertible)value).ToUInt16(null); 
        }
 
        // Disallowed conversions to UInt16
        // public static ushort ToUInt16(TimeSpan value)

        // Conversions to Int32 

        public static int ToInt32(object value) { 
            return value == null? 0: ((IConvertible)value).ToInt32(null); 
        }
 
        public static int ToInt32(object value, IFormatProvider provider) {
            return value == null? 0: ((IConvertible)value).ToInt32(provider);
        }
 

        public static int ToInt32(boolean value) { 
            return value? Boolean.True: Boolean.False; 
        }
 
        public static int ToInt32(char value) {
            return value;
        }
 
      
        public static int ToInt32(sbyte value) { 
            return value; 
        }
 
        public static int ToInt32(byte value) {
            return value;
        }
 
        public static int ToInt32(short value) {
            return value; 
        } 

        public static int ToInt32(ushort value) {
            return value;
        }
 
      
        public static int ToInt32(uint value) { 
            if (value > Int32.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Int32")); 
            Contract.EndContractBlock();
            return (int)value; 
        }

        public static int ToInt32(int value) {
            return value; 
        }
 
        public static int ToInt32(long value) { 
            if (value < Int32.MinValue || value > Int32.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Int32"));
            Contract.EndContractBlock(); 
            return (int)value;
        }

       
        public static int ToInt32(ulong value) {
            if (value > Int32.MaxValue) throw new OverflowException(Environment.GetResourceString("Overflow_Int32")); 
            Contract.EndContractBlock(); 
            return (int)value;
        } 

        public static int ToInt32(float value) {
            return ToInt32((double)value);
        } 

        public static int ToInt32(double value) { 
            if (value >= 0) { 
                if (value < 2147483647.5) {
                    int result = (int)value; 
                    double dif = value - result;
                    if (dif > 0.5 || dif == 0.5 && (result & 1) != 0) result++;
                    return result;
                } 
            }
            else { 
                if (value >= -2147483648.5) { 
                    int result = (int)value;
                    double dif = value - result; 
                    if (dif < -0.5 || dif == -0.5 && (result & 1) != 0) result--;
                    return result;
                }
            } 
            throw new OverflowException(Environment.GetResourceString("Overflow_Int32"));
        } 
 
        
        public static int ToInt32(decimal value) { 
            return Decimal.FCallToInt32(value);
        }

        public static int ToInt32(String value) { 
            if (value == null)
                return 0; 
            return Int32.Parse(value, CultureInfo.CurrentCulture); 
        }
 
        public static int ToInt32(String value, IFormatProvider provider) {
            if (value == null)
                return 0;
            return Int32.Parse(value, NumberStyles.Integer, provider); 
        }
 
        public static int ToInt32(DateTime value) 
        {
            return ((IConvertible)value).ToInt32(null); 
        }


        // Disallowed conversions to Int32 
        // public static int ToInt32(TimeSpan value)
 
        // Conversions to UInt32 

       
        public static uint ToUInt32(object value) {
            return value == null? 0: ((IConvertible)value).ToUInt32(null);
        }
 
      
        public static uint ToUInt32(object value, IFormatProvider provider) { 
            return value == null? 0: ((IConvertible)value).ToUInt32(provider); 
        }
 

      
        public static uint ToUInt32(boolean value) {
            return value? (uint)Boolean.True: (uint)Boolean.False; 
        }
 
       
        public static uint ToUInt32(char value) {
            return value; 
        }

      
        public static uint ToUInt32(sbyte value) { 
            if (value < 0) throw new OverflowException(Environment.GetResourceString("Overflow_UInt32"));
            Contract.EndContractBlock(); 
            return (uint)value; 
        }
 
      
        public static uint ToUInt32(byte value) {
            return value;
        } 

       
        public static uint ToUInt32(short value) { 
            if (value < 0) throw new OverflowException(Environment.GetResourceString("Overflow_UInt32"));
            Contract.EndContractBlock(); 
            return (uint)value;
        }

       
        public static uint ToUInt32(ushort value) {
            return value; 
        } 

       
        public static uint ToUInt32(int value) {
            if (value < 0) throw new OverflowException(Environment.GetResourceString("Overflow_UInt32"));
            Contract.EndContractBlock();
            return (uint)value; 
        }
 
       
        public static uint ToUInt32(uint value) {
            return value; 
        }

      
        public static uint ToNumber(long value) { 
        	if(value == null){
        		return null;
        	}
        	if(typeof value == "string"){
        		
        	}
            return (uint)value; 
        }
 
        public static DateTime ToDateTime(decimal value) {
        	if(value == null){
        		return null;
        	}
        	if(typeof value == "string"){
        		
        	}else if(typeof value == "number"){
        		return Date(value);
        	}
        } 

        // Disallowed conversions to DateTime 
        // public static DateTime ToDateTime(TimeSpan value)

        // Conversions to String
 
//        public static String 
        Converter.ToString = function(String value) {
        	if(typeof value =="string"){
                return value; 
        	}else{
        		return value == null? String.Empty: value.ToString(); 
        	}
        }
 
    }  // class Convert