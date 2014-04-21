package org.summer.view.widget.markup;
public class BamlPropertyCustomWriteInfoRecord extends BamlPropertyCustomRecord
    { 
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        { 
            int writePositionStart = (int)bamlBinaryWriter.Seek(0, SeekOrigin.Current); 
            short serializerTypeId = SerializerTypeId;
 
            bamlBinaryWriter.Write(AttributeId);
            if (serializerTypeId == (short)KnownElements.DependencyPropertyConverter)
            {
                // There is no need to actually use a real Converter here since we already have the 
                // DP value as an AttributeInfoId.
 
                // if ValueMemberName exists then remember that the ValueId is a TypeId of the 
                // type that declares ValueMemberName, so that it can be resolved correctly at
                // load time. 
                if (ValueMemberName != null)
                {
                    bamlBinaryWriter.Write((short)(serializerTypeId | TypeIdValueMask));
                } 
                else
                { 
                    bamlBinaryWriter.Write(serializerTypeId); 
                }
 
                // if ValueMemberName does not exist, ValueId is a KnownProperty Id
                // else it is a TypeId of the declaring type.
                bamlBinaryWriter.Write(ValueId);
 
                // Write out the ValueMemberName if it exists
                if (ValueMemberName != null) 
                { 
                    bamlBinaryWriter.Write(ValueMemberName);
                } 

                return;
            }
 
            bamlBinaryWriter.Write(serializerTypeId);
 
            boolean converted = false; 

            // If we have an enum or a boolean, do conversion to custom binary data here, 
            // since we do not have a serializer associated with these types.
            if (ValueType != null && ValueType.IsEnum)
            {
                uint uintValue = 0; 
                String [] enumValues = Value.Split(new Char[] { ',' });
 
                // if the Enum is a flag, then resolve each flag value in the enum value String. 
                foreach (String enumValue in enumValues)
                { 
                    FieldInfo enumField = ValueType.GetField(enumValue.Trim(), BindingFlags.Static | BindingFlags.Public | BindingFlags.IgnoreCase);
                    if (enumField != null)
                    {
                        // get the raw va;ue of the enum field and convert to a uint. 
                        Object rawEnumValue = enumField.GetRawConstantValue();
                        uintValue += (uint)Convert.ChangeType(rawEnumValue, typeof(uint), TypeConverterHelper.InvariantEnglishUS); 
                        converted = true; 
                    }
                    else 
                    {
                        converted = false;
                        break;
                    } 
                }
 
                if (converted) 
                {
                    bamlBinaryWriter.Write(uintValue); 
                }
            }
            else if (ValueType == typeof(Boolean))
            { 
                TypeConverter boolConverter = TypeDescriptor.GetConverter(typeof(Boolean));
                Object convertedValue = boolConverter.ConvertFromString(TypeContext, TypeConverterHelper.InvariantEnglishUS, Value); 
                bamlBinaryWriter.Write((byte)Convert.ChangeType(convertedValue, typeof(byte), TypeConverterHelper.InvariantEnglishUS)); 
                converted = true;
            } 
            else if (SerializerType == typeof(XamlBrushSerializer))
            {
                XamlSerializer serializer = new XamlBrushSerializer();
 
                // If we custom serialize this particular value at this point, then see
                // if it can convert. 
                // NOTE:  This is sensitive to changes in the BamlRecordWriter and 
                //        BamlRecordManager code and must be kept in [....] with them...
                converted = serializer.ConvertStringToCustomBinary(bamlBinaryWriter, Value); 
            }
            else if (SerializerType == typeof(XamlPoint3DCollectionSerializer))
            {
                XamlSerializer serializer = new XamlPoint3DCollectionSerializer(); 

                // If we custom serialize this particular value at this point, then see 
                // if it can convert. 
                // NOTE:  This is sensitive to changes in the BamlRecordWriter and
                //        BamlRecordManager code and must be kept in [....] with them... 
                converted = serializer.ConvertStringToCustomBinary(bamlBinaryWriter, Value);
            }
            else if (SerializerType == typeof(XamlVector3DCollectionSerializer))
            { 
                XamlSerializer serializer = new XamlVector3DCollectionSerializer();
 
                // If we custom serialize this particular value at this point, then see 
                // if it can convert.
                // NOTE:  This is sensitive to changes in the BamlRecordWriter and 
                //        BamlRecordManager code and must be kept in [....] with them...
                converted = serializer.ConvertStringToCustomBinary(bamlBinaryWriter, Value);
            }
            else if (SerializerType == typeof(XamlPointCollectionSerializer)) 
            {
                XamlSerializer serializer = new XamlPointCollectionSerializer(); 
 
                // If we custom serialize this particular value at this point, then see
                // if it can convert. 
                // NOTE:  This is sensitive to changes in the BamlRecordWriter and
                //        BamlRecordManager code and must be kept in [....] with them...
                converted = serializer.ConvertStringToCustomBinary(bamlBinaryWriter, Value);
            } 
            else if (SerializerType == typeof(XamlInt32CollectionSerializer))
            { 
                XamlSerializer serializer = new XamlInt32CollectionSerializer(); 

                // If we custom serialize this particular value at this point, then see 
                // if it can convert.
                // NOTE:  This is sensitive to changes in the BamlRecordWriter and
                //        BamlRecordManager code and must be kept in [....] with them...
                converted = serializer.ConvertStringToCustomBinary(bamlBinaryWriter, Value); 
            }
            else if (SerializerType == typeof(XamlPathDataSerializer)) 
            { 
                XamlSerializer serializer = new XamlPathDataSerializer();
 
                // If we custom serialize this particular value at this point, then see
                // if it can convert.
                // NOTE:  This is sensitive to changes in the BamlRecordWriter and
                //        BamlRecordManager code and must be kept in [....] with them... 
                converted = serializer.ConvertStringToCustomBinary(bamlBinaryWriter, Value);
            } 
 
            if (!converted)
            { 
                throw new XamlParseException(SR.Get(SRID.ParserBadString, Value, ValueType.Name));
            }
        }
 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        { 
            base.Copy(record);
 
            BamlPropertyCustomWriteInfoRecord newRecord = (BamlPropertyCustomWriteInfoRecord)record;
            newRecord._valueId = _valueId;
            newRecord._valueType = _valueType;
            newRecord._value = _value; 
            newRecord._valueMemberName = _valueMemberName;
            newRecord._serializerType = _serializerType; 
            newRecord._typeContext = _typeContext; 
        }
//#endif 

        // The KnownProperty Id of the Value, if it is a property and can be converted into one,
        // or the TypeId of the owner of the property value
        /*internal*/public short ValueId 
        {
            get { return _valueId; } 
            set { _valueId = value; } 
        }
 
        // If ValueId is a TypeId, then this holds the name of the member.
        /*internal*/public String ValueMemberName
        {
            get { return _valueMemberName; } 
            set { _valueMemberName = value; }
        } 
 
        // The following properties are NOT written to the BAML stream.
 
        // Type of this property
        /*internal*/public Type ValueType
        {
            get { return _valueType; } 
            set { _valueType = value; }
        } 
 
        // The String Value of the property.
        /*internal*/public String Value 
        {
            get { return _value; }
            set { _value = value; }
        } 

        // Type of the XamlSerializer associated with this property.  Null 
        // if this type is custom serialized by the parser itself. 
        /*internal*/public Type SerializerType
        { 
            get { return _serializerType; }
            set { _serializerType = value; }
        }
 
        // Context used for type conversion of built in types.
        /*internal*/public ITypeDescriptorContext TypeContext 
        { 
            get { return _typeContext; }
            set { _typeContext = value; } 
        }

        short                  _valueId;
        Type                   _valueType; 
        String                 _value;
        String                 _valueMemberName; 
        Type                   _serializerType; 
        ITypeDescriptorContext _typeContext;
    } 

    //
    // BamlPropertyCustomRecord is for DependencyProperty values that support
    // custom Avalon serialization. This record is used only during BAML load. 
    // The property value objects are read directly from the BAML stream by the
    // custom binary serializer for the property. 
    // 
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote>
    /*internal*/