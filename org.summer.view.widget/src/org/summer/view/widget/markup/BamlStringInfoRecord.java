package org.summer.view.widget.markup;
public class BamlStringInfoRecord extends BamlVariableSizedRecord
    { 
        /*internal*/public BamlStringInfoRecord() 
        {
            Pin(); // Don't allow this record to be recycled in the read cache. 
            StringId = -1;
        }

//#region Methods 

//#if !PBTCOMPILER 
        // LoadRecord specific data 
        /*internal*/public /*override*/ void LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            StringId = bamlBinaryReader.ReadInt16();
            Value    = bamlBinaryReader.ReadString();
        }
//#endif 

        // write record specific Data. 
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
            // write out an int for String Id 
            bamlBinaryWriter.Write(StringId);
            bamlBinaryWriter.Write(Value);
        }
 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        { 
            base.Copy(record);
 
            BamlStringInfoRecord newRecord = (BamlStringInfoRecord)record;
            newRecord._value = _value;
        }
//#endif 

//#endregion Methods 
 
//#region Properties
        // Resource Identifier pointing to the StringTable Entry 
        /*internal*/public short StringId
        {
            get
            { 
                short value = (short) _flags[_stringIdLowSection];
                value |= (short) (_flags[_stringIdHighSection] << 8); 
 
                return value;
            } 

            set
            {
                _flags[_stringIdLowSection] = (short)  (value & 0xff); 
                _flags[_stringIdHighSection] = (short) ((value & 0xff00) >> 8);
            } 
        } 

        // Resource String 
        /*internal*/public String Value
        {
            get { return _value; }
            set { _value = value; } 
        }
 
        // Additional properties not stored in the baml stream 
        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.StringInfo; }
        }

        // True if there is a serializer associated with this type 
        /*internal*/public virtual boolean HasSerializer
        { 
            get { return false; } 
        }
//#endregion Properties 

//#if !PBTCOMPILER
        public /*override*/ String ToString()
        { 
            return String.Format(CultureInfo.InvariantCulture,
                                 "{0} stringId({1}='{2}'", 
                                 RecordType, StringId, _value); 
        }
//#endif 

//#region Data

 
        // Allocate space in _flags.
        // BitVector32 doesn't support 16 bit sections, so we have to break 
        // it up into 2 sections. 

        private static BitVector32.Section _stringIdLowSection 
            = BitVector32.CreateSection( (short)0xff, BamlVariableSizedRecord.LastFlagsSection );

        private static BitVector32.Section _stringIdHighSection
            = BitVector32.CreateSection( (short)0xff, _stringIdLowSection ); 

//#if !PBTCOMPILER 
        // This provides subclasses with a referece section to create their own section. 
        /*internal*/public new static BitVector32.Section LastFlagsSection
        { 
            get { return _stringIdHighSection; }
        }
//#endif
 
        String _value ;
//#endregion Data 
    } 

    // Sets the content property context for an element 
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/