package org.summer.view.widget.markup;
public class BamlPropertyCustomRecord extends BamlVariableSizedRecord
    { 
//#region Methods
 
//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            AttributeId      = bamlBinaryReader.ReadInt16();
            short serializerTypeId = bamlBinaryReader.ReadInt16();

            IsValueTypeId = (serializerTypeId & TypeIdValueMask) == TypeIdValueMask; 
            if (IsValueTypeId)
            { 
                serializerTypeId &= (short)(~TypeIdValueMask); 
            }
 
            SerializerTypeId = serializerTypeId;

            ValueObjectSet  = false;
            IsRawEnumValueSet = false; 
            _valueObject = null;
 
            // ValueObject and ValueObject are not set until BamlRecordReader.ReadPropertyCustomRecord 
            // because the Mapper is needed for custom DPs
 
            // NOTE: above may no longer true, so this could be potentially changed to be in [....] with
            // other record. Needs more investigation.
        }
 
        // Read the binary data using the passed reader and use that to set the ValueObject.
        /*internal*/public Object GetCustomValue(BinaryReader reader, Type propertyType, short serializerId, BamlRecordReader bamlRecordReader) 
        { 
            Debug.Assert(!ValueObjectSet);
 
            // Handle enums and bools here directly.
            // Otherwise call the known custom serializers directly.
            switch (serializerId)
            { 
                case (short)KnownElements.EnumConverter:
 
                    uint enumBits; 
                    if (_valueObject == null)
                    { 
                        // if no raw value has been read in yet, read it now
                        // from the baml stream.
                        enumBits = reader.ReadUInt32();
                    } 
                    else
                    { 
                        // raw value has been read in earlier, so try to resolve into 
                        // an actual enum value now.
                        enumBits = (uint)_valueObject; 
                    }

                    if (propertyType.IsEnum)
                    { 
                        // property Type is an enum, so raw value can be resolved now.
                        _valueObject = Enum.ToObject(propertyType, enumBits); 
                        ValueObjectSet = true; 
                        IsRawEnumValueSet = false;
                    } 
                    else
                    {
                        // property Type is not available yet, so raw value cannot
                        // be resolved now. Store it and try later. 
                        _valueObject = enumBits;
                        ValueObjectSet = false; 
                        IsRawEnumValueSet = true; 
                    }
 
                    return _valueObject;

                case (short)KnownElements.BooleanConverter:
 
                    byte boolByte = reader.ReadByte();
                    _valueObject = boolByte == 1; 
                    break; 

                case (short)KnownElements.XamlBrushSerializer: 

                    // Don't bother creating a XamlBrushSerializer instance & calling ConvertCustomBinaryToObject
                    // on it since that just calls SCB directly liek below. This saves big on perf.
                    _valueObject = SolidColorBrush.DeserializeFrom(reader, bamlRecordReader.TypeConvertContext); 
                    break;
 
                case (short)KnownElements.XamlPathDataSerializer: 

                    _valueObject = XamlPathDataSerializer.StaticConvertCustomBinaryToObject(reader); 
                    break;

                case (short)KnownElements.XamlPoint3DCollectionSerializer:
 
                    _valueObject = XamlPoint3DCollectionSerializer.StaticConvertCustomBinaryToObject(reader);
                    break; 
 
                case (short)KnownElements.XamlVector3DCollectionSerializer:
 
                    _valueObject = XamlVector3DCollectionSerializer.StaticConvertCustomBinaryToObject(reader);
                    break;

                case (short)KnownElements.XamlPointCollectionSerializer: 

                    _valueObject = XamlPointCollectionSerializer.StaticConvertCustomBinaryToObject(reader); 
                    break; 

                case (short)KnownElements.XamlInt32CollectionSerializer: 

                    _valueObject = XamlInt32CollectionSerializer.StaticConvertCustomBinaryToObject(reader);
                    break;
 
                default:
                    Debug.Assert (false, "Unknown custom serializer"); 
                    return null; 
            }
 
            ValueObjectSet = true;
            return _valueObject;
        }
 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        { 
            base.Copy(record); 

            BamlPropertyCustomRecord newRecord = (BamlPropertyCustomRecord)record; 
            newRecord._valueObject = _valueObject;
            newRecord._attributeId = _attributeId;
            newRecord._serializerTypeId = _serializerTypeId;
        } 

//#endif 
// 
//#endregion Methods
// 
//#region Properties

        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.PropertyCustom; }
        } 
 
        /*internal*/public short AttributeId
        { 
            get { return _attributeId; }
            set { _attributeId = value; }
        }
 
        // ID of this serializer type.  Referenced in other baml records where a
        // Type is needed. 
        /*internal*/public short SerializerTypeId 
        {
            get { return _serializerTypeId; } 
            set { _serializerTypeId = value; }
        }

        // The following properties are NOT written to the BAML stream. 

//#if !PBTCOMPILER 
        // Value of the converted Object. 
        /*internal*/public Object ValueObject
        { 
            get { return _valueObject; }
            set { _valueObject = value; }
        }
 
        // Return true if GetCustomValue has been called, indicating that
        // a conversion from binary custom data to a ValueObject has occurred. 
        /*internal*/public boolean ValueObjectSet 
        {
            get { return _flags[_isValueSetSection] == 1 ? true : false; } 
            set { _flags[_isValueSetSection] = value ? 1 : 0; }
        }

        /*internal*/public boolean IsValueTypeId 
        {
            get { return _flags[_isValueTypeIdSection] == 1 ? true : false; } 
            set { _flags[_isValueTypeIdSection] = value ? 1 : 0; } 
        }
 
        // true if only the raw value of enum has been read as it cannot yet be
        // converted into an enum as the Type is not available yet.
        /*internal*/public boolean IsRawEnumValueSet
        { 
            get { return _flags[_isRawEnumValueSetSection] == 1 ? true : false; }
            set { _flags[_isRawEnumValueSetSection] = value ? 1 : 0; } 
        } 

        Object _valueObject; 

        // Allocate space in _flags.
        private static BitVector32.Section _isValueSetSection
            = BitVector32.CreateSection(1, BamlVariableSizedRecord.LastFlagsSection); 

        // Allocate space in _flags. 
        private static BitVector32.Section _isValueTypeIdSection 
            = BitVector32.CreateSection(1, _isValueSetSection);
 
        // Allocate space in _flags.
        private static BitVector32.Section _isRawEnumValueSetSection
            = BitVector32.CreateSection(1, _isValueTypeIdSection);
 
        // This provides subclasses with a referece section to create their own section.
        /*internal*/public new static BitVector32.Section LastFlagsSection 
        { 
            get { return _isRawEnumValueSetSection; }
        } 
//#endif
//
//#endregion Properties
// 
//#region Data
 
        /*internal*/public static readonly short TypeIdValueMask = 0x4000; 

        short                  _attributeId = 0; 
        short                  _serializerTypeId = 0;

//#endregion Data
    } 

    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/