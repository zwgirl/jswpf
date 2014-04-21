package org.summer.view.widget.markup;
public class BamlStaticResourceStartRecord extends BamlElementStartRecord
    { 

//#region Properties

        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.StaticResourceStart; } 
        } 

//#endregion Properties 

    }

    //+---------------------------------------------------------------------------------------------------------------- 
    //
    //  BamlStaticResourceEndRecord 
    // 
    //  This record marks the end of a StaticResourceExtension within the header for a deferred section.
    // 
    //+---------------------------------------------------------------------------------------------------------------

    /*internal*/