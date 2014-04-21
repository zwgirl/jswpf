package org.summer.view.widget.markup;

import org.summer.view.widget.CultureInfo;

public class BamlPresentationOptionsAttributeRecord extends BamlStringValueRecord
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

            BamlPresentationOptionsAttributeRecord newRecord = (BamlPresentationOptionsAttributeRecord)record;
            newRecord._name = _name; 
            newRecord._nameId = _nameId;
        } 
//#endif 

//#endregion Methods 

//#region Properties

        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.PresentationOptionsAttribute; } 
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

//#endregion Properties 

//#if !PBTCOMPILER
        public /*override*/ String ToString()
        { 
            return String.Format(CultureInfo.InvariantCulture,
                                 "{0} nameId({1}) is '{2}' ", 
                                 RecordType, NameId, Name); 
        }
//#endif 

//#region Data
        String _name;
        Int16  _nameId; 
//#endregion Data
 
    } 

    // 
    // BamlPropertyComplexStartRecord is for Complex DependencyProperty declarations
    // in markup, where the actual type and value is determined by subsequent records.
    //
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code. 
    // </SecurityNote> 
    /*internal*/