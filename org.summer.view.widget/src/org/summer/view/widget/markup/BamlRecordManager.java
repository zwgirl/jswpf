package org.summer.view.widget.markup;
public class BamlRecordManager 
    {
//#if !PBTCOMPILER 
        // Genericaly load and create the proper class.
        // This method assumes the seek pointer has already moved passed the recordType
        // field and is at the RecordSize or record contents (depending on record).
        // This method is used so the caller can first read the type of record, and expects 
        // to get back the entire record, or nothing (for async support).
        /*internal*/public BamlRecord ReadNextRecord( 
            BinaryReader   bamlBinaryReader, 
            long           bytesAvailable,
            BamlRecordType recordType) 
        {
            BamlRecord bamlRecord; // = null

            // Create the proper BamlRecord based on the recordType.  The assembly, 
            // type and attribute records are created every time, since they are
            // used by the BamlMapTable.  The other records are re-used, so they 
            // are created once and cached. 
            switch(recordType)
            { 
                case BamlRecordType.AssemblyInfo:
                    bamlRecord = new BamlAssemblyInfoRecord();
                    break;
                case BamlRecordType.TypeInfo: 
                    bamlRecord = new BamlTypeInfoRecord();
                    break; 
                case BamlRecordType.TypeSerializerInfo: 
                    bamlRecord = new BamlTypeInfoWithSerializerRecord();
                    break; 
                case BamlRecordType.AttributeInfo:
                    bamlRecord = new BamlAttributeInfoRecord();
                    break;
                case BamlRecordType.StringInfo: 
                    bamlRecord = new BamlStringInfoRecord();
                    break; 
                case BamlRecordType.DefAttributeKeyString: 
                    bamlRecord = new BamlDefAttributeKeyStringRecord();
                    break; 
                case BamlRecordType.DefAttributeKeyType:
                    bamlRecord = new BamlDefAttributeKeyTypeRecord();
                    break;
                case BamlRecordType.KeyElementStart: 
                    bamlRecord = new BamlKeyElementStartRecord();
                    break; 
 
                default:
 
                    // Get the current record from the cache.  If there's nothing there yet,
                    // or if what is there is pinned, then create one.  Note that records in the
                    // read cache are implicitly recycled, and records in the write cache are explicitly
                    // recycled (i.e., there's a ReleaseWriteRecord, but no ReleaseReadRecord). 

                    bamlRecord = _readCache[(int)recordType]; 
                    if (null == bamlRecord || bamlRecord.IsPinned ) 
                    {
                        bamlRecord = _readCache[(int)recordType] = AllocateRecord(recordType); 
                    }

                    break;
            } 

            bamlRecord.Next = null; 
 
            if (null != bamlRecord)
            { 
                // If LoadRecordSize indicates it can determine the record size
                // and has determined that there is enough content to load the
                // entire record, then continue.
                if (bamlRecord.LoadRecordSize(bamlBinaryReader, bytesAvailable) && 
                    bytesAvailable >= bamlRecord.RecordSize)
                { 
                    bamlRecord.LoadRecordData(bamlBinaryReader); 
                }
                else 
                {
                    bamlRecord = null;
                }
            } 

            return bamlRecord; 
        } 

        /// <summary> 
        /// Return the Object if it should be treated as IAddChild, otherwise return null
        /// </summary>
        static /*internal*/public IAddChild AsIAddChild(Object obj)
        { 
            IAddChild iac = obj as IAddChildInternal;
            return iac; 
        } 
//#endif
 
        /// <summary>
        /// True if type should be treated as IAddChild
        /// </summary>
        static /*internal*/public boolean TreatAsIAddChild(Type parentObjectType) 
        {
            return (KnownTypes.Types[(int)KnownElements.IAddChildInternal].IsAssignableFrom( parentObjectType )); 
        } 

        static /*internal*/public BamlRecordType GetPropertyStartRecordType(Type propertyType, boolean propertyCanWrite) 
        {
            BamlRecordType recordType;
            if (propertyType.IsArray)
            { 
                recordType = BamlRecordType.PropertyArrayStart;
            } 
            else if (typeof(IDictionary).IsAssignableFrom(propertyType)) 
            {
                recordType = BamlRecordType.PropertyIDictionaryStart; 
            }
            else if ((typeof(IList).IsAssignableFrom(propertyType) ||
                       BamlRecordManager.TreatAsIAddChild(propertyType) ||
                       (typeof(IEnumerable).IsAssignableFrom(propertyType) && !propertyCanWrite))) 
            {
                // we're a list if: 
                // 1) the property type is an IList. 
                // 2) the property type is an IAddChild (/*internal*/public).
                // 3) the property type is an IEnumerable and read-only and the parent is an IAddChild (/*internal*/public). 
                // for the third case, we can't check the parent until run-time.
                recordType = BamlRecordType.PropertyIListStart;
            }
            else 
            {
                recordType = BamlRecordType.PropertyComplexStart; 
            } 

            return recordType; 
        }

//#if !PBTCOMPILER
        /*internal*/public BamlRecord CloneRecord(BamlRecord record) 
        {
            BamlRecord newRecord; 
 
            switch (record.RecordType)
            { 
                case BamlRecordType.ElementStart:
                    if (record is BamlNamedElementStartRecord)
                    {
                        newRecord= new BamlNamedElementStartRecord(); 
                    }
                    else 
                    { 
                        newRecord = new BamlElementStartRecord();
                    } 
                    break;

                case BamlRecordType.PropertyCustom:
                    if (record is BamlPropertyCustomWriteInfoRecord) 
                    {
                        newRecord = new BamlPropertyCustomWriteInfoRecord(); 
                    } 
                    else
                    { 
                        newRecord = new BamlPropertyCustomRecord();
                    }
                    break;
 
                default:
                    newRecord = AllocateRecord(record.RecordType); 
                    break; 
            }
 
            record.Copy(newRecord);

            return newRecord;
        } 
//#endif
 
        // Helper function to create a BamlRecord from a BamlRecordType 
        private BamlRecord AllocateWriteRecord(BamlRecordType recordType)
        { 
            BamlRecord record;

            switch (recordType)
            { 
                case BamlRecordType.PropertyCustom:
                    record = new BamlPropertyCustomWriteInfoRecord(); 
                    break; 

                default: 
                    record = AllocateRecord(recordType);
                    break;
            }
 
            return record;
        } 
 
        // Helper function to create a BamlRecord from a BamlRecordType
        private BamlRecord AllocateRecord(BamlRecordType recordType) 
        {
            BamlRecord record;

            switch(recordType) 
            {
                case BamlRecordType.DocumentStart: 
                    record = new BamlDocumentStartRecord(); 
                    break;
                case BamlRecordType.DocumentEnd: 
                    record = new BamlDocumentEndRecord();
                    break;
                case BamlRecordType.ConnectionId:
                    record = new BamlConnectionIdRecord(); 
                    break;
                case BamlRecordType.ElementStart: 
                    record = new BamlElementStartRecord(); 
                    break;
                case BamlRecordType.ElementEnd: 
                    record = new BamlElementEndRecord();
                    break;
                case BamlRecordType.DeferableContentStart:
                    record = new BamlDeferableContentStartRecord(); 
                    break;
                case BamlRecordType.DefAttributeKeyString: 
                    record = new BamlDefAttributeKeyStringRecord(); 
                    break;
                case BamlRecordType.DefAttributeKeyType: 
                    record = new BamlDefAttributeKeyTypeRecord();
                    break;
                case BamlRecordType.LiteralContent:
                    record = new BamlLiteralContentRecord(); 
                    break;
                case BamlRecordType.Property: 
                    record = new BamlPropertyRecord(); 
                    break;
                case BamlRecordType.PropertyWithConverter: 
                    record = new BamlPropertyWithConverterRecord();
                    break;
                case BamlRecordType.PropertyStringReference:
                    record = new BamlPropertyStringReferenceRecord(); 
                    break;
                case BamlRecordType.PropertyTypeReference: 
                    record = new BamlPropertyTypeReferenceRecord(); 
                    break;
                case BamlRecordType.PropertyWithExtension: 
                    record = new BamlPropertyWithExtensionRecord();
                    break;
                case BamlRecordType.PropertyCustom:
                    record = new BamlPropertyCustomRecord(); 
                    break;
                case BamlRecordType.PropertyComplexStart: 
                    record = new BamlPropertyComplexStartRecord(); 
                    break;
                case BamlRecordType.PropertyComplexEnd: 
                    record = new BamlPropertyComplexEndRecord();
                    break;
                case BamlRecordType.RoutedEvent:
                    record = new BamlRoutedEventRecord(); 
                    break;
                case BamlRecordType.PropertyArrayStart: 
                    record = new BamlPropertyArrayStartRecord(); 
                    break;
                case BamlRecordType.PropertyArrayEnd: 
                    record = new BamlPropertyArrayEndRecord();
                    break;
                case BamlRecordType.PropertyIListStart:
                    record = new BamlPropertyIListStartRecord(); 
                    break;
                case BamlRecordType.PropertyIListEnd: 
                    record = new BamlPropertyIListEndRecord(); 
                    break;
                case BamlRecordType.PropertyIDictionaryStart: 
                    record = new BamlPropertyIDictionaryStartRecord();
                    break;
                case BamlRecordType.PropertyIDictionaryEnd:
                    record = new BamlPropertyIDictionaryEndRecord(); 
                    break;
                case BamlRecordType.Text: 
                    record = new BamlTextRecord(); 
                    break;
                case BamlRecordType.TextWithConverter: 
                    record = new BamlTextWithConverterRecord();
                    break;
                case BamlRecordType.TextWithId:
                    record = new BamlTextWithIdRecord(); 
                    break;
                case BamlRecordType.XmlnsProperty: 
                    record = new BamlXmlnsPropertyRecord(); 
                    break;
                case BamlRecordType.PIMapping: 
                    record = new BamlPIMappingRecord();
                    break;
                case BamlRecordType.DefAttribute:
                    record = new BamlDefAttributeRecord(); 
                    break;
                case BamlRecordType.PresentationOptionsAttribute: 
                    record = new BamlPresentationOptionsAttributeRecord(); 
                    break;
                case BamlRecordType.KeyElementStart: 
                    record = new BamlKeyElementStartRecord();
                    break;
                case BamlRecordType.KeyElementEnd:
                    record = new BamlKeyElementEndRecord(); 
                    break;
                case BamlRecordType.ConstructorParametersStart: 
                    record = new BamlConstructorParametersStartRecord(); 
                    break;
                case BamlRecordType.ConstructorParametersEnd: 
                    record = new BamlConstructorParametersEndRecord();
                    break;
                case BamlRecordType.ConstructorParameterType:
                    record = new BamlConstructorParameterTypeRecord(); 
                    break;
                case BamlRecordType.ContentProperty: 
                    record = new BamlContentPropertyRecord(); 
                    break;
                case BamlRecordType.AssemblyInfo: 
                case BamlRecordType.TypeInfo:
                case BamlRecordType.TypeSerializerInfo:
                case BamlRecordType.AttributeInfo:
                case BamlRecordType.StringInfo: 
                    Debug.Assert(false,"Assembly, Type and Attribute records are not cached, so don't ask for one.");
                    record = null; 
                    break; 
                case BamlRecordType.StaticResourceStart:
                    record = new BamlStaticResourceStartRecord(); 
                    break;
                case BamlRecordType.StaticResourceEnd:
                    record = new BamlStaticResourceEndRecord();
                    break; 
                case BamlRecordType.StaticResourceId:
                    record = new BamlStaticResourceIdRecord(); 
                    break; 
                case BamlRecordType.LineNumberAndPosition:
                    record = new BamlLineAndPositionRecord(); 
                    break;
                case BamlRecordType.LinePosition:
                    record = new BamlLinePositionRecord();
                    break; 
                case BamlRecordType.OptimizedStaticResource:
                    record = new BamlOptimizedStaticResourceRecord(); 
                    break; 
                case BamlRecordType.PropertyWithStaticResourceId:
                    record = new BamlPropertyWithStaticResourceIdRecord(); 
                    break;
                default:
                    Debug.Assert(false,"Unknown RecordType");
                    record = null; 
                    break;
            } 
 
            return record;
        } 

        // This should only be called from BamlRecordWriter -- it gets a record from the record
        // cache that must be freed with ReleaseRecord before GetRecord is called again.
        /*internal*/public BamlRecord GetWriteRecord(BamlRecordType recordType) 
        {
            // Create the cache of records used in writing, on demand 
 
            if( _writeCache == null )
            { 
                _writeCache = new BamlRecord[(int)BamlRecordType.LastRecordType];
            }

            BamlRecord record = _writeCache[(int)recordType]; 
            if (null == record)
            { 
                record = AllocateWriteRecord(recordType); 
            }
            else 
            {
                _writeCache[(int)recordType] = null;
            }
 
            // It is important to set RecordSize for variable size records
            // to a negative number to indicate that it has not been set yet. 
            // Fixed size records should ignore this set. 
            record.RecordSize = -1;
            return record; 
        }


        //+--------------------------------------------------------------------------------------------- 
        //
        //  ReleaseWriteRecord 
        // 
        //  Frees a record originally claimed with GetWriteRecord. Note that records in the
        //  read cache are implicitly recycled, and records in the write cache are explicitly 
        //  recycled (i.e., there's a ReleaseWriteRecord, but no ReleaseReadRecord).
        //
        //+---------------------------------------------------------------------------------------------
 
        /*internal*/public void ReleaseWriteRecord(BamlRecord record)
        { 
            // Put the write record back into the cache, if we're allowed to recycle it. 

            if( !record.IsPinned ) 
            {
                Debug.Assert(null == _writeCache[(int)record.RecordType]);
                if (null != _writeCache[(int)record.RecordType])
                { 
                    // This is really an /*internal*/public error.
                    throw new InvalidOperationException(SR.Get(SRID.ParserMultiBamls)); 
                } 
                _writeCache[(int)record.RecordType] = record;
            } 
        }


        // Cache of BamlRecords, used during read, to avoid lots of records from being 
        // created.  If a record gets pinned (BamlRecord.IsPinned gets set), it is not re-used.
 
//        #if !PBTCOMPILER 
        BamlRecord[] _readCache = new BamlRecord[(int)BamlRecordType.LastRecordType];
        #endif 

        // Cache of BamlRecords, used during write, also to avoid lots of records
        // from being created.
 
        BamlRecord[] _writeCache = null; //new BamlRecord[(int)BamlRecordType.LastRecordType];
 
    } 

    // The base of all baml records.  This gives a fixed size record that contains 
    // line number information used for generating error messages.  Note that the
    // line number information is not currently written out to the baml stream.
    /*internal*/