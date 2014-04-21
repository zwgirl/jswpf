package org.summer.view.widget.markup;
public class BamlLiteralContentRecord extends BamlStringValueRecord
    { 

//#region Methods 
 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader) 
        {
            Value  =  bamlBinaryReader.ReadString();

            // 

 
            Int32 _lineNumber = bamlBinaryReader.ReadInt32(); 
            Int32 _linePosition = bamlBinaryReader.ReadInt32();
        } 
//#endif

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        { 
            bamlBinaryWriter.Write(Value);
 
            // 

 
            bamlBinaryWriter.Write((Int32)0);
            bamlBinaryWriter.Write((Int32)0);
        }
 
//#endregion Methods
// 
//#region Properties 

        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.LiteralContent; }
        }
 
//#endregion Properties
 
     } 

    // An record for the connection id that the (Style)BamlRecordReader uses to 
    // hookup an ID or event on any element in the Object tree or Style visual tree.
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code. 
    // </SecurityNote>
    /*internal*/