package org.summer.view.widget.markup;
public class BamlPropertyComplexStartRecord extends BamlRecord
    { 

//#region Methods

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            AttributeId   = bamlBinaryReader.ReadInt16(); 
        }
//#endif 

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        {
            bamlBinaryWriter.Write(AttributeId); 
        }
 
//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        { 
            base.Copy(record);

            BamlPropertyComplexStartRecord newRecord = (BamlPropertyComplexStartRecord)record;
            newRecord._attributeId = _attributeId; 
        }
//#endif 
 
//#endregion Methods
 
//#region Properties

        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.PropertyComplexStart; }
        } 
 
        /*internal*/public short AttributeId
        { 
            get { return _attributeId; }
            set { _attributeId = value; }
        }
 
        /*internal*/public /*override*/ Int32 RecordSize
        { 
            get { return 2; } 
            set { Debug.Assert (value == -1, "Wrong size set for complex prop record"); }
        } 

//#endregion Properties

//#if !PBTCOMPILER 
        public /*override*/ String ToString()
        { 
            return String.Format(CultureInfo.InvariantCulture, 
                                 "{0} attr({1})",
                                 RecordType, _attributeId); 
        }
//#endif

//#region Data 
        short _attributeId = -1;
//#endregion Data 
 
    }
 
    //
    // BamlPropertyStringReferenceRecord is for Property values that are written
    // out as references into the String table.
    // 
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code. 
    // </SecurityNote>
    /*internal*/