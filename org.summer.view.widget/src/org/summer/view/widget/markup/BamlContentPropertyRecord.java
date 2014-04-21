package org.summer.view.widget.markup;
public class BamlContentPropertyRecord extends BamlRecord
    { 
//        #region Methods 

//#if !PBTCOMPILER 
        // LoadRecord specific data
        /*internal*/public /*override*/ void LoadRecordData(BinaryReader bamlBinaryReader)
        {
            AttributeId = bamlBinaryReader.ReadInt16(); 
        }
//#endif 
 
        // write record specific Data.
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
            // write out an int for attribute Id
            bamlBinaryWriter.Write(AttributeId);
        } 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        {
            base.Copy(record); 

            BamlContentPropertyRecord newRecord = (BamlContentPropertyRecord)record;
            newRecord._attributeId = _attributeId;
        } 
//#endif
 
//        #endregion Methods 

//        #region Properties 
        // Id of the property being set as the context
        /*internal*/public short AttributeId
        {
            get { return _attributeId; } 
            set { _attributeId = value; }
        } 
 
        // Additional properties not stored in the baml stream
        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.ContentProperty; }
        }
 
        // True if there is a serializer associated with this type
        /*internal*/public virtual boolean HasSerializer 
        { 
            get { return false; }
        } 
//        #endregion Properties

//        #region Data
        short _attributeId = -1; 
//        #endregion Data
    } 
 

    // Debugging Linenumber record.  Linenumber from the XAML 
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/