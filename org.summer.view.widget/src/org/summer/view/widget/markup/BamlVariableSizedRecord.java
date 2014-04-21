package org.summer.view.widget.markup;
public abstract class BamlVariableSizedRecord extends BamlRecord 
    {
// #region Methods 
 
//#if !PBTCOMPILER
        // If there are enough bytes available, load the record size from the 
        // binary reader.  The default action is to load the 4 byte size from
        // the reader, if there are at least 4 bytes available.
        /*internal*/public /*override*/ boolean LoadRecordSize(
            BinaryReader bamlBinaryReader, 
            long         bytesAvailable)
        { 
           int recordSize; 
           boolean loadedSize = LoadVariableRecordSize(bamlBinaryReader, bytesAvailable, out recordSize);
           if (loadedSize) 
           {
               RecordSize = recordSize;
           }
           return loadedSize; 
        }
 
        // If there are enough bytes available, load the record size from the 
        // binary reader.  The default action is to load the 4 byte size from
        // the reader, if there are at least 4 bytes available. 
        /*internal*/public static boolean LoadVariableRecordSize(
                BinaryReader bamlBinaryReader,
                long         bytesAvailable,
            out int          recordSize) 
        {
            if (bytesAvailable >= MaxRecordSizeFieldLength) 
            { 
                recordSize = ((BamlBinaryReader)bamlBinaryReader).Read7BitEncodedInt();
                return true; 
            }
            else
            {
                recordSize = -1; 
                return false;
            } 
        } 
//#endif
 
        protected int ComputeSizeOfVariableLengthRecord(long start, long end)
        {
            int size = (Int32)(end - start);
            int sizeOfSize = BamlBinaryWriter.SizeOf7bitEncodedSize(size); 
            sizeOfSize = BamlBinaryWriter.SizeOf7bitEncodedSize(sizeOfSize+size);
            return (sizeOfSize+size); 
        } 

        // Writes data at the current position seek pointer points 
        // to byte after the end of record when done.
        /*internal*/public /*override*/ void Write(BinaryWriter bamlBinaryWriter)
        {
            // BamlRecords may be used without a stream, so if you attempt to write when there 
            // isn't a writer, just ignore it.
            if (bamlBinaryWriter == null) 
            { 
                return;
            } 


            // Baml records always start with record type
            bamlBinaryWriter.Write((byte) RecordType); 

            // Remember the file location of this baml record.  This 
            // is needed if we have to come back later to update the [....] mode. 
            // IMPORTANT:  The RecordType is the last thing written before calling
            //             WriteRecordData.  Some records assume the record type is located 
            //             directly before the current stream location and may change it, so
            //             don't change where the record type is written in the stream!!!
            //             Paint is one example of a DP Object that will seek back to change
            //             the record type if it is unable to serialize itself. 

            //  Write just the data, this is just to measure the size. 
            long startSeekPosition = bamlBinaryWriter.Seek(0,SeekOrigin.Current); 
            WriteRecordData(bamlBinaryWriter);
            long endSeekPosition = bamlBinaryWriter.Seek(0,SeekOrigin.Current); 

            Debug.Assert(RecordSize < 0);
            RecordSize = ComputeSizeOfVariableLengthRecord(startSeekPosition, endSeekPosition);
 
            // seek back to the begining,  this time write the size, then the data.
            bamlBinaryWriter.Seek((int)startSeekPosition, SeekOrigin.Begin); 
            WriteRecordSize(bamlBinaryWriter); 
            WriteRecordData(bamlBinaryWriter);
        } 

        // Write the size of this record.  The default action is to write the 4 byte
        // size, which may be overwritten later once WriteRecordData has been called.
        /*internal*/public void WriteRecordSize(BinaryWriter bamlBinaryWriter) 
        {
            ((BamlBinaryWriter)bamlBinaryWriter).Write7BitEncodedInt(RecordSize); 
        } 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        {
            base.Copy(record);
 
            BamlVariableSizedRecord newRecord = (BamlVariableSizedRecord)record;
            newRecord._recordSize = _recordSize; 
        } 
//#endif
 
//#endregion Methods
//
//#region Properties
 
        // Actual size of the complete BamlRecord in bytes.  Currently
        // limited to 2 gigabytes. 
        /*internal*/public /*override*/ Int32 RecordSize 
        {
            get { return _recordSize; } 
            set { _recordSize = value; }
        }

        // This provides subclasses with a referece section to create their own section. 
        /*internal*/public new static BitVector32.Section LastFlagsSection
        { 
            get { return BamlRecord.LastFlagsSection; } 
        }
 

//#endregion Properties

//#region Data 

        // Size of the RecordSize field in the baml file.  This must be in 
        // [....] the type type of _recordSize below. 
        /*internal*/public const int MaxRecordSizeFieldLength = 4;
 
        Int32          _recordSize = -1;   // we use a 7 bit encoded variable size

//#endregion Data
    } 

    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/