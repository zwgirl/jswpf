package org.summer.view.widget.markup;
public class BamlTextWithIdRecord extends BamlTextRecord 
    {
//#region Methods

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            ValueId  =  bamlBinaryReader.ReadInt16(); 
        }
//#endif 

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        {
            bamlBinaryWriter.Write(ValueId); 
        }
 
//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        { 
            base.Copy(record);

            BamlTextWithIdRecord newRecord = (BamlTextWithIdRecord)record;
            newRecord._valueId = _valueId; 
        }
//#endif 
 
//#endregion Methods
 
//#region Properties

        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.TextWithId; }
        } 
 
        /*internal*/public Int16 ValueId
        { 
            get { return _valueId; }
            set { _valueId = value; }
        }
 
//#endregion Properties
 
//#region Data 
        Int16 _valueId;
//#endregion Data 
    }

    // Text content between the begin and end tag of an element that will be parsed using a type converter.
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code. 
    // </SecurityNote> 
    /*internal*/