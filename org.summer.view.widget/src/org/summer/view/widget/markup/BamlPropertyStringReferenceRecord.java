package org.summer.view.widget.markup;
public class BamlPropertyStringReferenceRecord extends BamlPropertyComplexStartRecord 
    {
//        #region Methods

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            AttributeId = bamlBinaryReader.ReadInt16(); 
            StringId  = bamlBinaryReader.ReadInt16();
        } 
//#endif

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        { 
            bamlBinaryWriter.Write(AttributeId);
            bamlBinaryWriter.Write(StringId); 
        } 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        {
            base.Copy(record);
 
            BamlPropertyStringReferenceRecord newRecord = (BamlPropertyStringReferenceRecord)record;
            newRecord._stringId = _stringId; 
        } 
//#endif
 
//        #endregion Methods

//        #region Properties
 
        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.PropertyStringReference; } 
        }
 
        /*internal*/public short StringId
        {
            get { return _stringId; }
#if !PBTCOMPILER 
            set { _stringId = value; }
#endif 
        } 

        /*internal*/public /*override*/ Int32 RecordSize 
        {
            get { return 4; }
            set { Debug.Assert (value == -1, "Wrong size set for complex prop record"); }
        } 

//        #endregion Properties 
 
//        #region Data
        short _stringId = 0; 

//        #endregion Data
    }
 
    //
    // BamlPropertyTypeReferenceRecord is for Property values that are written 
    // out as references into the type table.  So the property value is a 'Type' Object. 
    //
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code.
    // </SecurityNote>
    /*internal*/