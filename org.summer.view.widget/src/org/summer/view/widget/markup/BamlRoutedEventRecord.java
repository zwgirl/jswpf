package org.summer.view.widget.markup;
public class BamlRoutedEventRecord extends BamlStringValueRecord
    { 
 
//#region Methods
 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader)
        {
            AttributeId   = bamlBinaryReader.ReadInt16(); 
            Value         = bamlBinaryReader.ReadString();
        } 
//#endif 

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
            bamlBinaryWriter.Write(AttributeId);
            bamlBinaryWriter.Write(Value);
        } 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        {
            base.Copy(record); 

            BamlRoutedEventRecord newRecord = (BamlRoutedEventRecord)record;
            newRecord._attributeId = _attributeId;
        } 
//#endif
 
//#endregion Methods 

//#region Properties 

        /*internal*/public /*override*/ BamlRecordType RecordType
        {
            get { return BamlRecordType.RoutedEvent; } 
        }
 
        /*internal*/public short AttributeId 
        {
            get { return _attributeId; } 
#if !PBTCOMPILER
            set { _attributeId = value; }
#endif
        } 

//#endregion Properties 
 
//#region Data
 
        short _attributeId = -1;

//#endregion Data
    } 

 
    // A section of literal content. 
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote>
    /*internal*/