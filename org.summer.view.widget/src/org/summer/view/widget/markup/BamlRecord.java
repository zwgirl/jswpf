package org.summer.view.widget.markup;
public abstract class BamlRecord
    { 

// #region Methods 
 
//#if !PBTCOMPILER
        // If there are enough bytes available, load the record size from the 
        // binary reader.  For fixed size records that derive from BamlRecord,
        // there is no size field in the baml file, so this always succeeds.
        /*internal*/public virtual boolean LoadRecordSize(
            BinaryReader bamlBinaryReader, 
            long         bytesAvailable)
        { 
            return true; 
        }
 
        // Load record data.  This does not include the record type, or the
        // size field, which are loaded separately.  If the subclass has no
        // specific data to load, then don't /*override*/ this.
        /*internal*/public virtual void  LoadRecordData(BinaryReader bamlBinaryReader) 
        {
        } 
//#endif 

        // Writes data at the current position seek pointer points 
        // to byte after the end of record when done.
        /*internal*/public virtual void Write(BinaryWriter bamlBinaryWriter)
        {
            // BamlRecords may be used without a stream, so if you attempt to write when there 
            // isn't a writer, just ignore it.
            if (bamlBinaryWriter == null) 
            { 
                return;
            } 

            // Baml records always start with record type
            bamlBinaryWriter.Write((byte) RecordType);
 
            // IMPORTANT:  The RecordType is the last thing written before calling
            //             WriteRecordData.  Some records assume the record type is located 
            //             directly before the current stream location and may change it, so 
            //             don't change where the record type is written in the stream!!!
            //             Paint is one example of a DP Object that will seek back to change 
            //             the record type if it is unable to serialize itself.
            WriteRecordData(bamlBinaryWriter);
        }
 
        // Write contents of the record, excluding size (if any) and record type.
        // If the subclass has no specific data to write out, don't /*override*/ this. 
        /*internal*/public virtual void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
        } 


//#endregion Methods
 
//#region Properties
 
        // Actual size of the complete BamlRecord (excluding RecordType) in bytes. 
        // Currently limited to 2 gigabytes.  Default size is 0 bytes of data.
        // Subclasses must /*override*/ if they have a different size. 
        /*internal*/public virtual Int32 RecordSize
        {
            get { return 0; }
            set { Debug.Assert (value == -1, "Setting fixed record to an invalid size"); } 
        }
 
        // Identifies the type off BAML record.  This is used when casting to 
        // a BamlRecord subclass.  All subclasses **MUST** /*override*/ this.
        /*internal*/public virtual BamlRecordType RecordType 
        {
            get
            {
                Debug.Assert(false, "Must /*override*/ RecordType"); 
                return BamlRecordType.Unknown;
            } 
        } 

 
//#if !PBTCOMPILER
        // Next Record pointer - used in BamlObjectFactory
        /*internal*/public BamlRecord Next
        { 
            get { return _nextRecord; }
            set { _nextRecord = value ; } 
        } 
//#endif
 
        // The BamlRecorManager keeps a cache of baml records and tries to reuse them automatically.
        // To keep a record from being cached, it can be pinned.  For correct pinning we keep a
        // pin count.  To save working set, we only have two bits for the reference count.
        // So if the reference count reaches three the record becomes permanently pinned. 

        /*internal*/public boolean IsPinned 
        { 
            get
            { 
                return PinnedCount > 0;
            }

        } 

        // (See comment on IsPinned.) 
        /*internal*/public int PinnedCount 
        {
            get 
            {
                return _flags[_pinnedFlagSection];
            }
 
            set
            { 
                Debug.Assert( value <= 3 && value >= 0 ); 
                _flags[_pinnedFlagSection] = value;
            } 
        }

        // (See comment on IsPinned.)
        /*internal*/public void Pin() 
        {
            if( PinnedCount < 3 ) 
            { 
                ++PinnedCount;
            } 
        }

//#if !PBTCOMPILER
        // (See comment on IsPinned.) 
        /*internal*/public void Unpin()
        { 
            if( PinnedCount < 3 ) 
            {
                --PinnedCount; 
            }
        }

        /*internal*/public virtual void Copy(BamlRecord record) 
        {
            record._flags = _flags; 
            record._nextRecord = _nextRecord; 
        }
 
//#endif


 
//#endregion Properties
// 
//#region Data 

        // Internal flags for efficient storage 
        // NOTE: bits here are used by sub-classes also.
        // This BitVector32 field is shared by subclasses to save working set.  Sharing flags like this
        // is easier in e.g. FrameworkElement, where the class hierarchy is linear, but can be bug-prone otherwise.  To make the
        // code less fragile, each class abstractly provides it's last section to subclasses(LastFlagsSection), which they can 
        // use in their call to CreateSection.
 
        /*internal*/public BitVector32 _flags; 

        // Allocate space in _flags. 

        private static BitVector32.Section _pinnedFlagSection = BitVector32.CreateSection( 3 /* Allocates two bits to store values up to 3 */ );

        // This provides subclasses with a referece section to create their own section. 
        /*internal*/public static BitVector32.Section LastFlagsSection
        { 
            get { return _pinnedFlagSection; } 
        }
 

//#if !PBTCOMPILER
        private BamlRecord _nextRecord = null;
//#endif 

 
        // Size of the record type field in the baml file. 
        /*internal*/public const int RecordTypeFieldLength = 1;
 
//#if !PBTCOMPILER
        public /*override*/ String ToString()
        {
            return String.Format(CultureInfo.InvariantCulture, "{0}", RecordType); 
        }
 
        protected static String GetTypeName(int typeId) 
        {
            String typeName = typeId.ToString(CultureInfo.InvariantCulture); 
            if(typeId < 0)
            {
                KnownElements elm = (KnownElements)(-typeId);
                typeName = elm.ToString(); 
            }
            return typeName; 
        } 

 
        // This helper checks for records that indicate that you're out of
        // an element start, and into it's "content" (in the xml sense).
        // We have to infer this, because unlike Xml, Baml doesn't provide
        // an end-attributes record. 

        /*internal*/public static boolean IsContentRecord( BamlRecordType bamlRecordType ) 
        { 
            return bamlRecordType == BamlRecordType.PropertyComplexStart
                   || 
                   bamlRecordType == BamlRecordType.PropertyArrayStart
                   ||
                   bamlRecordType == BamlRecordType.PropertyIListStart
                   || 
                   bamlRecordType == BamlRecordType.PropertyIDictionaryStart
                   || 
                   bamlRecordType == BamlRecordType.Text; 

        } 

//#endif

//#endregion Data 
    }
 
    // An abstract base class for records that record their size as part of the 
    // baml stream.
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code.
    // </SecurityNote>
    /*internal*/