package org.summer.view.widget.markup;
public class BamlPropertyRecord extends BamlStringValueRecord 
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

            BamlPropertyRecord newRecord = (BamlPropertyRecord)record; 
            newRecord._attributeId = _attributeId;
        } 
//#endif 

//#endregion Methods 

//#region Properties

        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.Property; } 
        } 

        /*internal*/public short AttributeId 
        {
            get { return _attributeId; }
            set { _attributeId = value; }
        } 

//#endregion Properties 
 
//#if !PBTCOMPILER
        public /*override*/ String ToString() 
        {
            return String.Format(CultureInfo.InvariantCulture,
                                 "{0} attr({1}) <== '{2}'",
                                 RecordType, _attributeId, Value); 
        }
//#endif 
 
//#region Data
        short  _attributeId = -1; 
//#endregion Data


    } 

    // 
    // BamlPropertyWithExtensionRecord is for property values that are Markup extensions 
    // with a single param member that are written out as attributeIds.
    // 
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/