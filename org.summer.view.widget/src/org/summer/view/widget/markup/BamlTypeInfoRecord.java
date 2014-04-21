package org.summer.view.widget.markup;
public class BamlTypeInfoRecord extends BamlVariableSizedRecord
    {
        /*internal*/public BamlTypeInfoRecord() 
        {
            Pin(); // Don't allow this record to be recycled in the read cache. 
            TypeId = -1; 
        }
 
//#region Methods

//#if !PBTCOMPILER
        // LoadRecord specific data 
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            TypeId       =   bamlBinaryReader.ReadInt16(); 
            AssemblyId   =   bamlBinaryReader.ReadInt16();
            TypeFullName =   bamlBinaryReader.ReadString(); 

            // Note that the upper 4 bits of the AssemblyId are used for flags
            _typeInfoFlags = (TypeInfoFlags)(AssemblyId >> 12);
            _assemblyId &= 0x0FFF; 
        }
//#endif 
 
        // write record specific Data.
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
            // write out an int for record size but we'll go back and fill
            bamlBinaryWriter.Write(TypeId);
            // Note that the upper 4 bits of the AssemblyId are used for flags 
            bamlBinaryWriter.Write((short)(((ushort)AssemblyId) | (((ushort)_typeInfoFlags) << 12)));
            bamlBinaryWriter.Write(TypeFullName); 
        } 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        {
            base.Copy(record);
 
            BamlTypeInfoRecord newRecord = (BamlTypeInfoRecord)record;
            newRecord._typeInfoFlags = _typeInfoFlags; 
            newRecord._assemblyId = _assemblyId; 
            newRecord._typeFullName = _typeFullName;
            newRecord._type = _type; 
        }
//#endif

//#endregion Methods 

//#region Properties 
 
        // The following are stored in the baml stream
 
        // ID of this type.  Refenced in other baml records where a
        // Type is needed.
        /*internal*/public short TypeId
        { 

            get 
            { 
                short value = (short) _flags[_typeIdLowSection];
                value |= (short) (_flags[_typeIdHighSection] << 8); 

                return value;
            }
 
            set
            { 
                _flags[_typeIdLowSection] = (short)  (value & 0xff); 
                _flags[_typeIdHighSection] = (short) ((value & 0xff00) >> 8);
            } 


        }
 
        // Assembly id of the assembly where this type is defined.
        // NOTE:  This is always positive in BAML files, but can be set 
        //        to -1 for known types when created programmatically. 
        /*internal*/public short AssemblyId
        { 
            get { return _assemblyId; }
            set
            {
                // Make sure we don't intrude on the Flags portion of the assembly ID 
                if (_assemblyId > 0x0FFF)
                { 
                    throw new XamlParseException(SR.Get(SRID.ParserTooManyAssemblies)); 
                }
                _assemblyId = value; 
            }
        }

        // Fully qualified name of type, including namespace 
        /*internal*/public String TypeFullName
        { 
            get { return _typeFullName; } 
            set { _typeFullName = value; }
        } 

        // Additional properties not stored in the baml stream

        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.TypeInfo; } 
        } 

//#if !PBTCOMPILER 
        // Actual type.  Filled in here when xaml is used to create
        // a tree, and the token reader knows the type
        /*internal*/public Type Type
        { 
            get { return _type; }
            set { _type = value; } 
        } 

        // Extract the namespace from the type full name and return 
        // it.  We are assuming here that the type full name has a single
        // classname at the end and we are not refering to a nested class...
        /*internal*/public String ClrNamespace
        { 
            get
            { 
                int periodIndex = _typeFullName.LastIndexOf('.'); 
                return periodIndex > 0 ?
                            _typeFullName.Substring(0, periodIndex) : 
                            String.Empty;
            }
        }
//#endif 

        // True if there is a serializer associated with this type 
        /*internal*/public virtual boolean HasSerializer 
        {
            get { return false; } 
        }

        /*internal*/public boolean IsInternalType
        { 
#if !PBTCOMPILER
            get 
            { 
                return ((_typeInfoFlags & TypeInfoFlags.Internal) == TypeInfoFlags.Internal);
            } 
#endif

            set
            { 
                // Don't allow resetting to false (i.e. converting back top public if
                // it becomes non-public, for added safety. 
                if (value) 
                {
                    _typeInfoFlags |= TypeInfoFlags.Internal; 
                }
            }
        }
 
//#endregion Properties
 
//#region Data 

        // Allocate space in _flags. 
        // BitVector32 doesn't support 16 bit sections, so we have to break
        // it up into 2 sections.

        private static BitVector32.Section _typeIdLowSection 
            = BitVector32.CreateSection( (short)0xff, BamlVariableSizedRecord.LastFlagsSection );
 
        private static BitVector32.Section _typeIdHighSection 
            = BitVector32.CreateSection( (short)0xff, _typeIdLowSection );
 
//#if !PBTCOMPILER
//         This provides subclasses with a referece section to create their own section.
        /*internal*/public new static BitVector32.Section LastFlagsSection
        { 
            get { return _typeIdHighSection; }
        } 
//#endif 

 
        // Flags contained in TypeInfo that give additional information
        // about the type that is determined at compile time.
        [Flags]
        private enum TypeInfoFlags : byte 
        {
            Internal             = 0x1, 
            UnusedTwo            = 0x2, 
            UnusedThree          = 0x4,
        } 

        TypeInfoFlags _typeInfoFlags = 0;
        short         _assemblyId = -1;
        String        _typeFullName; 
//#if !PBTCOMPILER
        Type          _type; 
//#endif 

//#endregion Data 


    }
 
    // Type info record for a type that has a custom serializer associated with it.
    // This gives the serializer type that will be used when deserializing this type 
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code. 
    // </SecurityNote>
    /*internal*/