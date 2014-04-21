package org.summer.view.widget.markup;
public class BamlPropertyTypeReferenceRecord extends BamlPropertyComplexStartRecord 
    {
//        #region Methods 
 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void LoadRecordData(BinaryReader bamlBinaryReader) 
        {
            AttributeId = bamlBinaryReader.ReadInt16();
            TypeId  = bamlBinaryReader.ReadInt16();
        } 
//#endif
 
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
            bamlBinaryWriter.Write(AttributeId); 
            bamlBinaryWriter.Write(TypeId);
        }

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        { 
            base.Copy(record); 

            BamlPropertyTypeReferenceRecord newRecord = (BamlPropertyTypeReferenceRecord)record; 
            newRecord._typeId = _typeId;
        }
//#endif
 
//        #endregion Methods
 
//        #region Properties 

        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.PropertyTypeReference; }
        }
 
        /*internal*/public short TypeId
        { 
            get { return _typeId; } 
            set { _typeId = value; }
        } 

        /*internal*/public /*override*/ Int32 RecordSize
        {
            get { return 4; } 
            set { Debug.Assert (value == -1, "Wrong size set for complex prop record"); }
        } 
 
//        #endregion Properties
 
//        #region Data
        short _typeId = 0;
//        #endregion Data
    } 

    // 
    // BamlPropertyWithConverterRecord information for property with custom type converter 
    //
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code.
    // </SecurityNote>
    /*internal*/