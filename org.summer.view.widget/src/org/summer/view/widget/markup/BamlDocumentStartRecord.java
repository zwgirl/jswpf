package org.summer.view.widget.markup;
public class BamlDocumentStartRecord extends BamlRecord
    {
//#region Methods 

        // Writes data at the current position.  The seek pointer points 
        // to byte after the end of record when done. 
        /*internal*/public /*override*/ void Write(BinaryWriter bamlBinaryWriter)
        { 
            // Remember the file location of this baml record.  This
            // is needed if we have to come back later to update the [....] mode.
            if (FilePos == -1 && bamlBinaryWriter != null)
            { 
                FilePos = bamlBinaryWriter.Seek(0,SeekOrigin.Current);
            } 
 
            base.Write(bamlBinaryWriter);
        } 

        // Adjust seeks pointer to this Record and updates the data.
        // Then sets seek pointer pack to original.
        // NOTE:  This will ONLY work for file sizes under 2 gig.  This is 
        //        not a problem for current useage, since this is mostly used
        //        when updating LoadAsync attribute on the DocumentStart record, 
        //        which is usually set on the first element in the xaml file. 
        /*internal*/public virtual void UpdateWrite(BinaryWriter bamlBinaryWriter)
        { 
            // default implementation, class should /*override*/ if
            // wants to optimize to only update dirty data.
            long currentPosiition = bamlBinaryWriter.Seek(0,SeekOrigin.Current);
 
            // seek to original record position.
 
            Debug.Assert(FilePos != -1,"UpdateWrite called but Write Never was"); 

            // Note: This only works for files up to 2 gig in length. 
            //       This is not a new restriction, but it should be
            //       fixed to work with larger files...
            bamlBinaryWriter.Seek((int)FilePos,SeekOrigin.Begin);
            Write(bamlBinaryWriter); 
            bamlBinaryWriter.Seek( (int) currentPosiition,SeekOrigin.Begin);
        } 
 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader) 
        {
            LoadAsync =  bamlBinaryReader.ReadBoolean();
            MaxAsyncRecords =  bamlBinaryReader.ReadInt32();
            DebugBaml = bamlBinaryReader.ReadBoolean(); 
        }
//#endif 
 
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter)
        { 
            bamlBinaryWriter.Write(LoadAsync);
            bamlBinaryWriter.Write(MaxAsyncRecords);
            bamlBinaryWriter.Write(DebugBaml);
        } 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        {
            base.Copy(record); 

            BamlDocumentStartRecord newRecord = (BamlDocumentStartRecord)record;
            newRecord._maxAsyncRecords = _maxAsyncRecords;
            newRecord._loadAsync = _loadAsync; 
            newRecord._filePos = _filePos;
            newRecord._debugBaml = _debugBaml; 
        } 
//#endif
 
//#endregion Methods

//#region Properties
 
        /*internal*/public /*override*/ BamlRecordType RecordType
        { 
            get { return BamlRecordType.DocumentStart; } 
        }
 
        /*internal*/public boolean LoadAsync
        {
            get { return _loadAsync; }
#if !PBTCOMPILER 
            set { _loadAsync = value; }
#endif 
        } 

        /*internal*/public int MaxAsyncRecords 
        {
            get { return _maxAsyncRecords; }
            set { _maxAsyncRecords = value; }
        } 

        // Position in the baml file stream 
        /*internal*/public long FilePos 
        {
            get { return _filePos; } 
            set { _filePos  = value; }
        }

        // Are there Debug Baml Records in this Baml Stream 
        /*internal*/public boolean DebugBaml
        { 
            get { return _debugBaml; } 
            set { _debugBaml  = value; }
        } 

//#endregion Properties

//#region Data 
        int         _maxAsyncRecords  = -1;
        boolean        _loadAsync = false; 
        long        _filePos = -1; 
        boolean        _debugBaml = false;
//#endregion Data 
    }

    // This marks the end tag of an element
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code. 
    // </SecurityNote> 
    /*internal*/