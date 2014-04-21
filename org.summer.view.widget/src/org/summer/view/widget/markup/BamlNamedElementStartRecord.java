package org.summer.view.widget.markup;
public class BamlNamedElementStartRecord extends BamlElementStartRecord 
    {
 
//#region Methods

//        #if !PBTCOMPILER
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader) 
        {
            TypeId = bamlBinaryReader.ReadInt16(); 
            RuntimeName = bamlBinaryReader.ReadString(); 
        }
//        #endif 

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        {
            bamlBinaryWriter.Write(TypeId); 

            if( RuntimeName != null ) 
            { 
                bamlBinaryWriter.Write(RuntimeName);
            } 
        }

//#if !PBTCOMPILER
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        {
            base.Copy(record); 
 
            BamlNamedElementStartRecord newRecord = (BamlNamedElementStartRecord)record;
            newRecord._isTemplateChild = _isTemplateChild; 
            newRecord._runtimeName = _runtimeName;
        }
//#endif
// 
//#endregion Methods
// 
//#region Properties 

        /*internal*/public String RuntimeName 
        {
            get { return _runtimeName; }
            set { _runtimeName = value; }
        } 

        // This flag is used by templates to indicate that an ElementStart 
        // record is for an Object that will be a template child.  We had to add 
        // this to allow some validation during template application.  This isn't
        // a good solution, because we shouldn't have this record understanding 
        // template children.  But the long-term plan is to break the template design
        // away from a dependence on names, at which point this whole BamlNamedElementStartRecord
        // will go away.
        private boolean _isTemplateChild = false; 
        /*internal*/public boolean IsTemplateChild
        { 
            get { return _isTemplateChild; } 
            set { _isTemplateChild = value; }
        } 

//#endregion Properties
//
// 
//#region Data
 
        // Id of the type of this Object 
        String _runtimeName = null;
 
//#endregion Data
    }
//#endif
 
    // Marks a block that has deferable content.  This record contains the size
    // of the deferable section, excluding the start and end records themselves. 
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code. 
    // </SecurityNote>
    /*internal*/