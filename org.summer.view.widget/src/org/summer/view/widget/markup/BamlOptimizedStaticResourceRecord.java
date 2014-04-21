package org.summer.view.widget.markup;
public class BamlOptimizedStaticResourceRecord extends BamlRecord implements IOptimizedMarkupExtension 
    {
 
//#region Methods

//#if !PBTCOMPILER
        /*internal*/public /*override*/ void LoadRecordData(BinaryReader bamlBinaryReader) 
        {
            byte flags = bamlBinaryReader.ReadByte(); 
            ValueId = bamlBinaryReader.ReadInt16(); 

            IsValueTypeExtension = (flags & TypeExtensionValueMask) != 0; 
            IsValueStaticExtension = (flags & StaticExtensionValueMask) != 0;
        }
//#endif
 
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        { 
            byte flags = 0; 
            if (IsValueTypeExtension)
            { 
                flags |= TypeExtensionValueMask;
            }
            else if (IsValueStaticExtension)
            { 
                flags |= StaticExtensionValueMask;
            } 
            bamlBinaryWriter.Write(flags); 
            bamlBinaryWriter.Write(ValueId);
        } 

//#if !PBTCOMPILER
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        { 
            base.Copy(record);
 
            BamlOptimizedStaticResourceRecord newRecord = (BamlOptimizedStaticResourceRecord)record; 
            newRecord._valueId = _valueId;
        } 
//#endif

//#endregion Methods
 
//#region Properties
 
        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.OptimizedStaticResource; } 
        }

        public short ExtensionTypeId
        { 
            get { return (short)KnownElements.StaticResourceExtension; }
        } 
 
        // StringId if the value is a String
        // TypeId if the value is a TypeExtension 
        // AttributeId of the member if the value is a StaticExtension
        public short ValueId
        {
            get { return _valueId; } 
            set { _valueId = value; }
        } 
 
        /*internal*/public /*override*/ Int32 RecordSize
        { 
            get { return 3; }
            set { Debug.Assert(value == -1, "Wrong size set for complex prop record"); }
        }
 
        // If the value is itself a simple TypeExtension
        public boolean IsValueTypeExtension 
        { 
            get { return _flags[_isValueTypeExtensionSection] == 1 ? true : false; }
            set { _flags[_isValueTypeExtensionSection] = value ? 1 : 0; } 
        }

        // If the value is itself a simple StaticExtension
        public boolean IsValueStaticExtension 
        {
            get { return _flags[_isValueStaticExtensionSection] == 1 ? true : false; } 
            set { _flags[_isValueStaticExtensionSection] = value ? 1 : 0; } 
        }
 
//#endregion Properties

//#region Data
// 
        short _valueId = 0;
 
        private static readonly byte TypeExtensionValueMask = 0x01; 
        private static readonly byte StaticExtensionValueMask = 0x02;
 
        // Allocate space in _flags.
        private static BitVector32.Section _isValueTypeExtensionSection
            = BitVector32.CreateSection(1, BamlRecord.LastFlagsSection);
 
        private static BitVector32.Section _isValueStaticExtensionSection
            = BitVector32.CreateSection(1, _isValueTypeExtensionSection); 
 
        // This provides subclasses with a referece section to create their own section.
        /*internal*/public new static BitVector32.Section LastFlagsSection 
        {
            get { return _isValueStaticExtensionSection; }
        }
 
//#if !PBTCOMPILER
        public /*override*/ String ToString() 
        { 
            return String.Format(CultureInfo.InvariantCulture,
                                 "{0} extn(StaticResourceExtension) valueId({1})", 
                                 RecordType, _valueId);
        }
//#endif
// 
//#endregion Data
 
 
    }
 
    //+---------------------------------------------------------------------------------------------------------------
    //
    //  BamlStaticResourceIdRecord
    // 
    //  This BamlRecord is an identifier for a StaticResourceExtension within the header for a deferred section.
    // 
    //+--------------------------------------------------------------------------------------------------------------- 

    /*internal*/