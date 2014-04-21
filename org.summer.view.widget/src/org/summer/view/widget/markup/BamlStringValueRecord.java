package org.summer.view.widget.markup;
public abstract class BamlStringValueRecord extends BamlVariableSizedRecord 
    {
 
//#region Methods

//#if !PBTCOMPILER
        // LoadRecord specific data 
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            Value  =  bamlBinaryReader.ReadString(); 
        }
//#endif 

        // write record specific Data.
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        { 
            bamlBinaryWriter.Write(Value);
        } 
 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        {
            base.Copy(record);

            BamlStringValueRecord newRecord = (BamlStringValueRecord)record; 
            newRecord._value = _value;
        } 
//#endif 

//#endregion Methods 

//#region Properties

        /*internal*/public String Value 
        {
            get { return _value; } 
            set { _value = value; } 
        }
 
//#endregion Properties

//#region Data
        String _value; 
//#endregion Data
 
    } 

    // Common methods for baml records that serve as keys in a dictionary. 
    /*internal*/