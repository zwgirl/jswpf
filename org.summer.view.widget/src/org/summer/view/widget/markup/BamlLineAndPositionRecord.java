package org.summer.view.widget.markup;
public class BamlLineAndPositionRecord extends BamlRecord
    { 
 
//#region Methods
 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader)
        {
            LineNumber = (uint) bamlBinaryReader.ReadInt32(); 
            LinePosition = (uint) bamlBinaryReader.ReadInt32();
        } 
//#endif 

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
            bamlBinaryWriter.Write(LineNumber);
            bamlBinaryWriter.Write(LinePosition);
        } 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        {
            base.Copy(record); 

            BamlLineAndPositionRecord newRecord = (BamlLineAndPositionRecord)record;
            newRecord._lineNumber = _lineNumber;
            newRecord._linePosition = _linePosition; 
        }
//#endif 
 
//#endregion Methods
 
//#region Properties

        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.LineNumberAndPosition; }
        } 
 
        // Id of the type of this Object
        /*internal*/public uint LineNumber 
        {
            get { return _lineNumber; }
            set { _lineNumber = value; }
        } 

        /*internal*/public uint LinePosition 
        { 
            get { return _linePosition; }
            set { _linePosition = value; } 
        }

        /*internal*/public /*override*/ Int32 RecordSize
        { 
            get { return 8; }
        } 
 
        uint _lineNumber;
        uint _linePosition; 

//#endregion Properties

//#if !PBTCOMPILER 
        public /*override*/ String ToString()
        { 
            return String.Format(CultureInfo.InvariantCulture, 
                                 "{0} LineNum={1} Pos={2}", RecordType, LineNumber, LinePosition);
        } 
//#endif
    }

 
    // Debugging Line Position record.  Line Position from the XAML
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/