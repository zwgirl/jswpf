package org.summer.view.widget.markup;
public class BamlDocumentEndRecord extends BamlRecord 
    {
 
//#region Properties

        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.DocumentEnd; }
        } 
 
//#endregion Properties
 
    }

    // The following records are used internally in the baml stream to
    // define attribute (eg - property), type and assembly information 
    // for records that follow later on in the stream.  They are never
    // publically exposed 
 
    // Information about an assembly where a type is defined
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code.
    // </SecurityNote>
    /*internal*/