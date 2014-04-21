package org.summer.view.widget.markup;
public class BamlLinePositionRecord extends BamlRecord
    {

//#region Methods 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader) 
        {
            LinePosition = (uint) bamlBinaryReader.ReadInt32(); 
        }
//#endif

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
            bamlBinaryWriter.Write(LinePosition); 
        } 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        {
            base.Copy(record);
 
            BamlLinePositionRecord newRecord = (BamlLinePositionRecord)record;
            newRecord._linePosition = _linePosition; 
        } 
//#endif
 
//#endregion Methods

//#region Properties
 
        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.LinePosition; } 
        }
 
        /*internal*/public uint LinePosition
        {
            get { return _linePosition; }
            set { _linePosition = value; } 
        }
 
        /*internal*/public /*override*/ Int32 RecordSize 
        {
            get { return 4; } 
        }

        uint _linePosition;
 
//#endregion Properties
 
//#if !PBTCOMPILER 
        public /*override*/ String ToString()
        { 
            return String.Format(CultureInfo.InvariantCulture,
                                 "{0} LinePos={1}", RecordType, LinePosition);
        }
//#endif 
    }