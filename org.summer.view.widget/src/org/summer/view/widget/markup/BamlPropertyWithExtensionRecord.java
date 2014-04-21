package org.summer.view.widget.markup;
public class BamlPropertyWithExtensionRecord extends BamlRecord, IOptimizedMarkupExtension
    { 
//        #region Methods 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void LoadRecordData(BinaryReader bamlBinaryReader)
        {
            AttributeId = bamlBinaryReader.ReadInt16();
            short extensionTypeId = bamlBinaryReader.ReadInt16(); 
            ValueId = bamlBinaryReader.ReadInt16();
 
            // The upper 4 bits of the ExtensionTypeId are used as flags 
            _extensionTypeId = (short)(extensionTypeId & ExtensionIdMask);
            IsValueTypeExtension = (extensionTypeId & TypeExtensionValueMask) == TypeExtensionValueMask; 
            IsValueStaticExtension = (extensionTypeId & StaticExtensionValueMask) == StaticExtensionValueMask;
        }
//#endif
 
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        { 
            bamlBinaryWriter.Write(AttributeId); 
            short extensionTypeId = ExtensionTypeId;
            if (IsValueTypeExtension) 
            {
                extensionTypeId |= TypeExtensionValueMask;
            }
            else if (IsValueStaticExtension) 
            {
                extensionTypeId |= StaticExtensionValueMask; 
            } 
            bamlBinaryWriter.Write(extensionTypeId);
            bamlBinaryWriter.Write(ValueId); 
        }

//#if !PBTCOMPILER
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        {
            base.Copy(record); 
 
            BamlPropertyWithExtensionRecord newRecord = (BamlPropertyWithExtensionRecord)record;
            newRecord._attributeId = _attributeId; 
            newRecord._extensionTypeId = _extensionTypeId;
            newRecord._valueId = _valueId;
        }
//#endif 

//        #endregion Methods 
// 
//        #region Properties
 
        /*internal*/public /*override*/ BamlRecordType RecordType
        {
            get { return BamlRecordType.PropertyWithExtension; }
        } 

        // Id of the property whose value is the simple ME 
        /*internal*/public short AttributeId 
        {
            get { return _attributeId; } 
            set { _attributeId = value; }
        }

        // KnownElement Id of the MarkupExtension 
        public short ExtensionTypeId
        { 
            get { return _extensionTypeId; } 
            set
            { 
                // we shouldn't ever be intruding on the flags portion of the ExtensionTypeId
                Debug.Assert(value <= ExtensionIdMask);
                _extensionTypeId = value;
            } 
        }
 
        // For StaticExtension: AttributeId of a member 
        // For TemplateBindingExtension: AttributeId of a DependencyProperty
        // For a DynamicResourceExtension: 
        //      StringId if the value is a String
        //      TypeId if the value is a TypeExtension
        //      AttributeId of the member if the value is a StaticExtension
        public short ValueId 
        {
            get { return _valueId; } 
            set { _valueId = value; } 
        }
 
        /*internal*/public /*override*/ Int32 RecordSize
        {
            get { return 6; }
            set { Debug.Assert(value == -1, "Wrong size set for complex prop record"); } 
        }
 
        // For DynamicResourceExtension, if the value is itself a simple TypeExtension 
        public boolean IsValueTypeExtension
        { 
            get { return _flags[_isValueTypeExtensionSection] == 1 ? true : false; }
            set { _flags[_isValueTypeExtensionSection] = value ? 1 : 0; }
        }
 
        // For DynamicResourceExtension, if the value is itself a simple StaticExtension
        public boolean IsValueStaticExtension 
        { 
            get { return _flags[_isValueStaticExtensionSection] == 1 ? true : false; }
            set { _flags[_isValueStaticExtensionSection] = value ? 1 : 0; } 
        }

        // Allocate space in _flags.
        private static BitVector32.Section _isValueTypeExtensionSection 
            = BitVector32.CreateSection(1, BamlRecord.LastFlagsSection);
 
        private static BitVector32.Section _isValueStaticExtensionSection 
            = BitVector32.CreateSection(1, _isValueTypeExtensionSection);
 
//#if !PBTCOMPILER
        // This provides subclasses with a referece section to create their own section.
        /*internal*/public new static BitVector32.Section LastFlagsSection
        { 
            get { return _isValueStaticExtensionSection; }
        } 
 
        public /*override*/ String ToString()
        { 
            return String.Format(CultureInfo.InvariantCulture,
                                 "{0} attr({1}) extn({2}) valueId({3})",
                                 RecordType, _attributeId, _extensionTypeId, _valueId);
        } 
//#endif
 
//        #endregion Properties 

//        #region Data 
        short _attributeId = -1;
        short _extensionTypeId = 0;
        short _valueId = 0;
 
        private static readonly short ExtensionIdMask = 0x0FFF;
        private static readonly short TypeExtensionValueMask = 0x4000; 
        private static readonly short StaticExtensionValueMask = 0x2000; 
//        #endregion Data
    } 

    //
    // BamlPropertyCustomWriteInfoRecord is for DependencyProperty values that support
    // custom Avalon serialization. The property value objects write directly onto 
    // the BAML stream in whatever format they understand. This record is used only
    // during BAML write time. 
    // 
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote>
    /*internal*/