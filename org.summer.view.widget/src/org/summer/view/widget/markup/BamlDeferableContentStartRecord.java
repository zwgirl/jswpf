package org.summer.view.widget.markup;
public class BamlDeferableContentStartRecord extends BamlRecord
    {
//#region Methods 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader) 
        {
            ContentSize = bamlBinaryReader.ReadInt32(); 
        }
//#endif

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
            _contentSizePosition = bamlBinaryWriter.Seek(0, SeekOrigin.Current); 
            bamlBinaryWriter.Write(ContentSize); 
        }
 
        // Update the size of the content contained between the end of the start
        // record and the beginning of the end record.  The size of the content is
        // usually not known when the start record is written out.
        /*internal*/public void UpdateContentSize( 
            Int32         contentSize,
            BinaryWriter  bamlBinaryWriter) 
        { 
            Debug.Assert(_contentSizePosition != -1,
                    "Must call WriteRecordData before updating content size"); 

            // Use relative positions to reduce the possibility of truncation,
            // since Seek takes a 32 bit int, but position is a 64 bit int.
            Int64 existingPosition = bamlBinaryWriter.Seek(0, SeekOrigin.Current); 
            Int32 deltaPosition = (Int32)(_contentSizePosition-existingPosition);
 
            bamlBinaryWriter.Seek(deltaPosition, SeekOrigin.Current); 
            bamlBinaryWriter.Write(contentSize);
            bamlBinaryWriter.Seek((int)(-ContentSizeSize-deltaPosition), SeekOrigin.Current); 
        }

//#if !PBTCOMPILER
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        {
            base.Copy(record); 
 
            BamlDeferableContentStartRecord newRecord = (BamlDeferableContentStartRecord)record;
            newRecord._contentSize = _contentSize; 
            newRecord._contentSizePosition = _contentSizePosition;
            newRecord._valuesBuffer = _valuesBuffer;
        }
//#endif 

//#endregion Methods 
 
//#region Properties
 
        /*internal*/public /*override*/ BamlRecordType RecordType
        {
            get { return BamlRecordType.DeferableContentStart; }
        } 

        /*internal*/public Int32 ContentSize 
        { 
            get { return _contentSize; }
#if !PBTCOMPILER 
            set { _contentSize = value; }
#endif
        }
 
        /*internal*/public /*override*/ Int32 RecordSize
        { 
            get { return 4; } 
            set { Debug.Assert(value == -1, "Wrong size set for element record"); }
        } 

//#if !PBTCOMPILER

        /// <summary> 
        /// For the case of a ResourceDictionary inside template content, we read
        /// the dictionary values into a byte array while creating the template 
        /// content. Later during template instantiation when the dictionary instance 
        /// is created we use this buffer to create a memory stream so that the
        /// ResourceDictionary can use it to RealizeDeferredContent. This is required 
        /// because at template instantiation time we do not have a stream to work with.
        /// The reader operates on a linked list of BamlRecords.
        /// </summary>
        /*internal*/public byte[] ValuesBuffer 
        {
            get { return _valuesBuffer; } 
            set { _valuesBuffer = value; } 
        }
//#endif 

//#endregion Properties

 
//#region Data
 
        // Size of the ContentSize field written out to the baml stream.  This 
        // must be kept in [....] with the size of the _contentSize field.
        const Int64 ContentSizeSize = 4; 

        // Size of the content between the end of the start record and the
        // beginning of the end record for this element.
        Int32 _contentSize = - 1; 

        // Absolute position in the stream where ContentSize is written. 
        Int64 _contentSizePosition = -1; 

//#if !PBTCOMPILER 

        byte[] _valuesBuffer;

//#endif 

//#endregion Data 
    } 

    //+--------------------------------------------------------------------------------------------------------------- 
    //
    //  BamlStaticResourceStartRecord
    //
    //  This record marks the start of a StaticResourceExtension within the header for a deferred section. 
    //
    //+---------------------------------------------------------------------------------------------------------------- 
 
    /*internal*/