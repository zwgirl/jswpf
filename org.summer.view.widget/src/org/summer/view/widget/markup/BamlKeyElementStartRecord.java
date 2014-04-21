package org.summer.view.widget.markup;
public class BamlKeyElementStartRecord extends BamlDefAttributeKeyTypeRecord implements IBamlDictionaryKey
    { 
        /*internal*/public BamlKeyElementStartRecord() 
        {
            Pin(); // Don't allow this record to be recycled in the read cache. 
        }

//#region Properties
 
        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.KeyElementStart; } 
        }
 
//#endregion Properties

    }
 
    // This marks the end tag of an element being used as the key for an IDictionary
    /*internal*/