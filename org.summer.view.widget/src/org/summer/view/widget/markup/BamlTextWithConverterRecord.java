package org.summer.view.widget.markup;
public class BamlTextWithConverterRecord extends BamlTextRecord
    { 
//#region Methods

//#if !PBTCOMPILER
        /*internal*/public /*override*/ void LoadRecordData(BinaryReader bamlBinaryReader) 
        {
            base.LoadRecordData(bamlBinaryReader); 
            ConverterTypeId  = bamlBinaryReader.ReadInt16(); 
        }
//#endif 

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        {
            base.WriteRecordData(bamlBinaryWriter); 
            bamlBinaryWriter.Write(ConverterTypeId);
        } 
 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        {
            base.Copy(record);

            BamlTextWithConverterRecord newRecord = (BamlTextWithConverterRecord)record; 
            newRecord._converterTypeId = _converterTypeId;
        } 
//#endif 

//#endregion Methods 

//#region Properties

        // The following are stored in the baml stream 

        // ID of this type converter.  Referenced in other baml records where a 
        // Type is needed. 
        /*internal*/public short ConverterTypeId
        { 
            get { return _converterTypeId; }
            set { _converterTypeId = value; }
        }
 
        // Additional properties not stored in the baml stream
 
        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.TextWithConverter; } 
        }

//#endregion Properties
 
//#region Data
 
        short _converterTypeId = 0; 

//#endregion Data 

    }

    // Marks the start of a Baml document.  This must always be the first 
    // record in a BAML stream.   It contains version information, and other
    // document wide directives. 
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code. 
    // </SecurityNote>
    /*internal*/