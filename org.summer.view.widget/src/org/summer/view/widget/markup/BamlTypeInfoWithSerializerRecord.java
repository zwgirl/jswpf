package org.summer.view.widget.markup;
public class BamlTypeInfoWithSerializerRecord extends BamlTypeInfoRecord
    {
        /*internal*/public BamlTypeInfoWithSerializerRecord() 
        {
            Pin(); // Don't allow this record to be recycled in the read cache. 
        } 

//#region Methods 

//#if !PBTCOMPILER
        // LoadRecord specific data
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader) 
        {
            base.LoadRecordData(bamlBinaryReader); 
            SerializerTypeId  =   bamlBinaryReader.ReadInt16(); 
        }
//#endif 

        // write record specific Data.
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        { 
            base.WriteRecordData(bamlBinaryWriter);
            bamlBinaryWriter.Write(SerializerTypeId); 
        } 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        {
            base.Copy(record);
 
            BamlTypeInfoWithSerializerRecord newRecord = (BamlTypeInfoWithSerializerRecord)record;
            newRecord._serializerTypeId = _serializerTypeId; 
            newRecord._serializerType = _serializerType; 
        }
//#endif 

//#endregion Methods

//#region Properties 

        // The following are stored in the baml stream 
 
        // ID of this type.  Refenced in other baml records where a
        // Type is needed. 
        /*internal*/public short SerializerTypeId
        {
            get { return _serializerTypeId; }
            set { _serializerTypeId = value; } 
        }
 
        // Additional properties not stored in the baml stream 

        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.TypeSerializerInfo; }
        }
 
//#if !PBTCOMPILER
        // Actual type of associated serializer.  Filled in here when xaml is used to create 
        // a tree, and the token reader knows the type of the serializer, or 
        // when we are reading the baml file and have determined the
        // serializer type. 
        /*internal*/public Type SerializerType
        {
            get { return _serializerType; }
            set { _serializerType = value; } 
        }
//#endif 
 
        // True if there is a serializer associated with this type.  A serializer
        // will never be the first type Object in a baml file, so its type ID will 
        // never be 0.  Any other ID indicates we have a serializer.
        /*internal*/public /*override*/ boolean HasSerializer
        {
            get 
            {
                Debug.Assert( SerializerTypeId != 0 ); 
                return true; 
            }
        } 

//#endregion Properties

//#region Data 

        short _serializerTypeId = 0; 
#if !PBTCOMPILER 
        Type _serializerType;
//#endif 

//#endregion Data

    } 

    // Used for mapping properties and events to an owner type, given the 
    // name of the attribute.  Note that Attribute is used for historical 
    // reasons and for similarities to Xml attributes.  For us attributes
    // are just properties and events. 
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/