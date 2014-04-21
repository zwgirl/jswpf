package org.summer.view.widget.markup;
public class BamlStaticResourceIdRecord extends BamlRecord 
    {

//#region Methods
 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader) 
        { 
            StaticResourceId = bamlBinaryReader.ReadInt16();
        } 
//#endif

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        { 
            bamlBinaryWriter.Write(StaticResourceId);
        } 
 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        {
            base.Copy(record);

            BamlStaticResourceIdRecord newRecord = (BamlStaticResourceIdRecord)record; 
            newRecord._staticResourceId = _staticResourceId;
        } 
//#endif 

//#endregion Methods 

#region Properties
//
        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.StaticResourceId; } 
        } 

        /*internal*/public /*override*/ Int32 RecordSize 
        {
            get { return 2; }
            set { Debug.Assert(value == -1, "Wrong size set for complex prop record"); }
        } 

        /*internal*/public short StaticResourceId 
        { 
            get { return _staticResourceId; }
            set { _staticResourceId = value; } 
        }

//#endregion Properties
 

//#region Data 
 
        short _staticResourceId = -1;
 
//#if !PBTCOMPILER
        public /*override*/ String ToString()
        {
            return String.Format(CultureInfo.InvariantCulture, 
                                 "{0} staticResourceId({1})",
                                 RecordType, StaticResourceId); 
        } 
//#endif
 

//#endregion Data

    } 

    //+---------------------------------------------------------------------------------------------------------------- 
    // 
    //  BamlPropertyWithStaticResourceIdRecord
    // 
    //  This BamlRecord represents a BamlPropertyRecord with a StaticResourceId as place holder for
    //  a StaticResourceExtension within a deferred section.
    //
    //+--------------------------------------------------------------------------------------------------------------- 

    /*internal*/