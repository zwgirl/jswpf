package org.summer.view.widget.markup;
public class BamlKeyElementEndRecord extends BamlElementEndRecord 
    { 

//#region Properties 

        /*internal*/public /*override*/ BamlRecordType RecordType
        {
            get { return BamlRecordType.KeyElementEnd; } 
        }
 
//#endregion Properties 

    } 

    // This marks the end of the baml stream, or document.
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/