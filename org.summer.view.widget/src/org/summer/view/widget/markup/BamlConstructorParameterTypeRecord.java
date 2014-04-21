package org.summer.view.widget.markup;

import org.eclipse.osgi.framework.debug.Debug;

public class BamlConstructorParameterTypeRecord extends BamlRecord 
    {
//        #region Methods

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            TypeId  = bamlBinaryReader.ReadInt16(); 
        }
//#endif 

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        {
            bamlBinaryWriter.Write(TypeId); 
        }
 
//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        { 
            base.Copy(record);

            BamlConstructorParameterTypeRecord newRecord = (BamlConstructorParameterTypeRecord)record;
            newRecord._typeId = _typeId; 
        }
//#endif 
 
//        #endregion Methods
 
//        #region Properties

        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.ConstructorParameterType; }
        } 
 
        /*internal*/public short TypeId
        { 
            get { return _typeId; }
            set { _typeId = value; }
        }
 
        /*internal*/public /*override*/ Int32 RecordSize
        { 
            get { return 2; } 
            set { Debug.Assert (value == -1, "Wrong size set for complex prop record"); }
        } 

//        #endregion Properties

//        #region Data 
        short _typeId = 0;
//        #endregion Data 
    } 

    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code.
    // </SecurityNote>
    /*internal*/