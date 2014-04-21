package org.summer.view.widget.markup;
public class BamlPropertyWithStaticResourceIdRecord extends BamlStaticResourceIdRecord 
    { 

//#region Methods 

//#if !PBTCOMPILER
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            AttributeId = bamlBinaryReader.ReadInt16();
            StaticResourceId = bamlBinaryReader.ReadInt16(); 
        } 
//#endif
 
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        {
            bamlBinaryWriter.Write(AttributeId);
            bamlBinaryWriter.Write(StaticResourceId); 
        }
 
//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        { 
            base.Copy(record);

            BamlPropertyWithStaticResourceIdRecord newRecord = (BamlPropertyWithStaticResourceIdRecord)record;
            newRecord._attributeId = _attributeId; 
        }
//#endif 
 
//#endregion Methods
// 
//#region Properties

        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.PropertyWithStaticResourceId; }
        } 
 
        /*internal*/public /*override*/ Int32 RecordSize
        { 
            get { return 4; }
            set { Debug.Assert(value == -1, "Wrong size set for complex prop record"); }
        }
 
        // Id of the property whose value is the simple SR
        /*internal*/public short AttributeId 
        { 
            get { return _attributeId; }
            set { _attributeId = value; } 
        }

//#endregion Properties
 
//#region Data
 
        short _attributeId = -1; 

//#if !PBTCOMPILER 
        public /*override*/ String ToString()
        {
            return String.Format(CultureInfo.InvariantCulture,
                                 "{0} attr({1}) staticResourceId({2})", 
                                 RecordType, AttributeId, StaticResourceId);
        } 
//#endif 

//#endregion Data 

    }

 
    // Text content between the begin and end tag of an element.
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/