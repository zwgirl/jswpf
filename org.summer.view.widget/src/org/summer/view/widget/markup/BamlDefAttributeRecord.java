package org.summer.view.widget.markup;
public class BamlDefAttributeRecord extends BamlStringValueRecord 
    {
 
//#region Methods

//#if !PBTCOMPILER
        // LoadRecord specific data 
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            Value      =  bamlBinaryReader.ReadString(); 
            NameId     =  bamlBinaryReader.ReadInt16();
            Name       =  null; 
        }
//#endif

        // write record specific Data. 
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        { 
            bamlBinaryWriter.Write(Value); 
            bamlBinaryWriter.Write(NameId);
        } 

//#if !PBTCOMPILER
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        { 
            base.Copy(record);
 
            BamlDefAttributeRecord newRecord = (BamlDefAttributeRecord)record; 
            newRecord._name = _name;
            newRecord._nameId = _nameId; 
            newRecord._attributeUsage = _attributeUsage;
        }
//#endif
 
//#endregion Methods
// 
//#region Properties 

        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.DefAttribute; }
        }
 
        // The following is written out the baml file.
 
        /*internal*/public Int16 NameId 
        {
            get { return _nameId; } 
            set { _nameId = value; }
        }

        // The following are cached locally, but not written to baml. 

        /*internal*/public String Name 
        { 
#if !PBTCOMPILER
            get { return _name; } 
#endif
            set { _name = value; }
        }
 
        // Some attributes have special usage, such as setting the XmlLang and XmlSpace
        // strings in the parser context.  This is flagged with this property 
        /*internal*/public BamlAttributeUsage AttributeUsage 
        {
#if !PBTCOMPILER 
            get { return _attributeUsage; }
#endif
            set { _attributeUsage = value; }
        } 

//#endregion Properties 
 
//#if !PBTCOMPILER
        public /*override*/ String ToString() 
        {
            return String.Format(CultureInfo.InvariantCulture,
                                 "{0} nameId({1}) is '{2}' usage={3}",
                                 RecordType, NameId, Name, AttributeUsage); 
        }
//#endif 
 
//#region Data
        String _name; 
        Int16  _nameId;
        BamlAttributeUsage _attributeUsage;
//#endregion Data
 
    }
 
    // BamlRecord for PresentationOptions:Whatever attribute 
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote>
    /*internal*/