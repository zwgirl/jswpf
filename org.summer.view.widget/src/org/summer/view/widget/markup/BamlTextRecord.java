package org.summer.view.widget.markup;
public class BamlTextRecord extends BamlStringValueRecord
    {
//#region Properties
 
        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.Text; } 
        }
 
//#endregion Properties
    }

    // This is a text record within a [Static/Dynamic]ResourceExtension. 
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code. 
    // </SecurityNote>
    /*internal*/