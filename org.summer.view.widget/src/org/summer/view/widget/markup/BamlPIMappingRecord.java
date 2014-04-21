package org.summer.view.widget.markup;
public class BamlPIMappingRecord extends BamlVariableSizedRecord 
    {
 
//#region Methods

//#if !PBTCOMPILER
        // LoadRecord specific data 
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            XmlNamespace  =  bamlBinaryReader.ReadString(); 
            ClrNamespace  =  bamlBinaryReader.ReadString();
            AssemblyId    =  bamlBinaryReader.ReadInt16(); 
        }
//#endif
        // write record specific Data.
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
            // write out an int for record size but we'll go back and fill 
            bamlBinaryWriter.Write(XmlNamespace); 
            bamlBinaryWriter.Write(ClrNamespace);
            bamlBinaryWriter.Write(AssemblyId); 
        }

//#if !PBTCOMPILER
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        {
            base.Copy(record); 
 
            BamlPIMappingRecord newRecord = (BamlPIMappingRecord)record;
            newRecord._xmlns = _xmlns; 
            newRecord._clrns = _clrns;
        }
//#endif
 
//#endregion Methods
 
//#region Properties 

        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.PIMapping; }
        }
 
        /*internal*/public String XmlNamespace
        { 
            get { return _xmlns; } 
            set {_xmlns = value; }
        } 

        /*internal*/public String ClrNamespace
        {
            get { return _clrns; } 
            set { _clrns = value; }
        } 
 
        /*internal*/public short AssemblyId
        { 

            get
            {
                short value = (short) _flags[_assemblyIdLowSection]; 
                value |= (short) (_flags[_assemblyIdHighSection] << 8);
 
                return value; 
            }
 
            set
            {
                _flags[_assemblyIdLowSection] = (short)  (value & 0xff);
                _flags[_assemblyIdHighSection] = (short) ((value & 0xff00) >> 8); 
            }
 
        } 

        // Allocate space in _flags. 
        // BitVector32 doesn't support 16 bit sections, so we have to break
        // it up into 2 sections.

        private static BitVector32.Section _assemblyIdLowSection 
            = BitVector32.CreateSection( (short)0xff, BamlVariableSizedRecord.LastFlagsSection );
 
        private static BitVector32.Section _assemblyIdHighSection 
            = BitVector32.CreateSection( (short)0xff, _assemblyIdLowSection );
 
//#if !PBTCOMPILER
        // This provides subclasses with a referece section to create their own section.
        /*internal*/public new static BitVector32.Section LastFlagsSection
        { 
            get { return _assemblyIdHighSection; }
        } 
//#endif 

 

//#endregion Properties

//#region Data 
        String _xmlns;
        String _clrns; 
//#endregion Data 

    } 

    // Common base class for variables sized records that contain a String value
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/