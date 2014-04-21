package org.summer.view.widget.markup;

import org.eclipse.osgi.framework.debug.Debug;

public class BamlConnectionIdRecord extends BamlRecord 
    { 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void LoadRecordData(BinaryReader bamlBinaryReader) 
        {
            ConnectionId = bamlBinaryReader.ReadInt32();
        }
//#endif 

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        { 
            bamlBinaryWriter.Write(ConnectionId);
        } 

//#if !PBTCOMPILER
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        { 
            base.Copy(record);
 
            BamlConnectionIdRecord newRecord = (BamlConnectionIdRecord)record; 
            newRecord._connectionId = _connectionId;
        } 
//#endif

        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.ConnectionId; }
        } 
 
        // Id of the type of this Object
        /*internal*/public Int32 ConnectionId 
        {
            get { return _connectionId; }
            set { _connectionId = value; }
        } 

        /*internal*/public /*override*/ Int32 RecordSize 
        { 
            get { return 4; }
            set { Debug.Assert(value == -1, "Wrong size set for element record"); } 
        }

        Int32 _connectionId = -1;
    } 

    // An Object record in the Object tree.  This can be a CLR 
    // Object or a DependencyObject. 
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote>
    /*internal*/