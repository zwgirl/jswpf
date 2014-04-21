package org.summer.view.widget.markup;
public class BamlDefAttributeKeyTypeRecord : BamlElementStartRecord, IBamlDictionaryKey
    {
        /*internal*/public BamlDefAttributeKeyTypeRecord()
        { 
            Pin(); // Don't allow this record to be recycled in the read cache.
        } 
 
//#region Methods
 
//#if !PBTCOMPILER
        // LoadRecord specific data
        /*internal*/public /*override*/ void LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            base.LoadRecordData(bamlBinaryReader);
            _valuePosition =  bamlBinaryReader.ReadInt32(); 
            ((IBamlDictionaryKey)this).Shared = bamlBinaryReader.ReadBoolean(); 
            ((IBamlDictionaryKey)this).SharedSet = bamlBinaryReader.ReadBoolean();
        } 
//#endif

        // Write record specific Data.
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
            base.WriteRecordData(bamlBinaryWriter); 
            _valuePositionPosition = bamlBinaryWriter.Seek(0, SeekOrigin.Current); 
            bamlBinaryWriter.Write(_valuePosition);
            bamlBinaryWriter.Write(((IBamlDictionaryKey)this).Shared); 
            bamlBinaryWriter.Write(((IBamlDictionaryKey)this).SharedSet);
        }

        // Update the pointer to the Value that was written out when WriteRecordData 
        // was first called.  At that time the true position was probably not known,
        // so it is written out later.  Be certain to leave the passed writer pointing 
        // to the same location it was at when this call was made. 
        void IBamlDictionaryKey.UpdateValuePosition(
            Int32        newPosition, 
            BinaryWriter bamlBinaryWriter)
        {
            Debug.Assert(_valuePositionPosition != -1,
                    "Must call WriteRecordData before updating position"); 

            // Use relative positions to reduce the possibility of truncation, 
            // since Seek takes a 32 bit int, but position is a 64 bit int. 
            Int64 existingPosition = bamlBinaryWriter.Seek(0, SeekOrigin.Current);
            Int32 deltaPosition = (Int32)(_valuePositionPosition-existingPosition); 

            bamlBinaryWriter.Seek(deltaPosition, SeekOrigin.Current);
            bamlBinaryWriter.Write(newPosition);
            bamlBinaryWriter.Seek(-ValuePositionSize-deltaPosition, SeekOrigin.Current); 
        }
 
//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        { 
            base.Copy(record);

            BamlDefAttributeKeyTypeRecord newRecord = (BamlDefAttributeKeyTypeRecord)record;
            newRecord._valuePosition = _valuePosition; 
            newRecord._valuePositionPosition = _valuePositionPosition;
            newRecord._keyObject = _keyObject; 
            newRecord._staticResourceValues = _staticResourceValues; 
        }
//#endif 

//#endregion Methods

//#region Properties 

        /*internal*/public /*override*/ BamlRecordType RecordType 
        { 
            get { return BamlRecordType.DefAttributeKeyType; }
        } 

        // Relative stream position in the baml stream where the value associated
        // with this key starts.  It is relative to the end of the keys section,
        // or the start of the values section. 
        Int32 IBamlDictionaryKey.ValuePosition
        { 
            get { return _valuePosition; } 
            set { _valuePosition = value; }
        } 

        // The actual key used in the defer loaded dictionary.  For this type of
        // record the key is a Type that is obtained at runtime from the base
        // classes TypeId 
        Object IBamlDictionaryKey.KeyObject
        { 
            get { return _keyObject; } 
            set { _keyObject = value; }
        } 

        // Position in the stream where ValuePosition was written.  This is needed
        // when updating the ValuePosition.
        Int64 IBamlDictionaryKey.ValuePositionPosition 
        {
            get { return _valuePositionPosition; } 
            set { _valuePositionPosition = value; } 
        }
 
        // True if the value associated with this key is shared.
        boolean IBamlDictionaryKey.Shared
        {
            get 
            {
                return _flags[_sharedSection] == 1 ? true : false; 
            } 

            set 
            {
                _flags[_sharedSection] = value ? 1 : 0;
            }
        } 

        // Whether Shared was set 
        boolean IBamlDictionaryKey.SharedSet 
        {
            get 
            {
                return _flags[_sharedSetSection] == 1 ? true : false;
            }
 
            set
            { 
                _flags[_sharedSetSection] = value ? 1 : 0; 
            }
        } 

//#if !PBTCOMPILER
        Object[] IBamlDictionaryKey.StaticResourceValues
        { 
            get { return _staticResourceValues; }
            set { _staticResourceValues = value; } 
        } 
//#endif
 

        // Allocate space in _flags.

        private static BitVector32.Section _sharedSection 
            = BitVector32.CreateSection( 1, BamlElementStartRecord.LastFlagsSection );
 
        private static BitVector32.Section _sharedSetSection 
            = BitVector32.CreateSection( 1, _sharedSection );
 
//#if !PBTCOMPILER
        // This provides subclasses with a referece section to create their own section.
        /*internal*/public new static BitVector32.Section LastFlagsSection
        { 
            get { return _sharedSetSection; }
        } 
//#endif 

 

//#endregion Properties

//#region Data 

        // Size in bytes of the ValuePosition field written out to baml.  This 
        // must be in [....] with the size of _valuePosition below. 
        /*internal*/public const Int32 ValuePositionSize = 4;
 
        // Relative position in the stream where the value associated with this key starts
        Int32 _valuePosition;

        // Position in the stream where ValuePosition was written.  This is needed 
        // when updating the ValuePosition.
        Int64 _valuePositionPosition = -1; 
 
        // Actual Object key used by a dictionary.  This is a Type Object
        Object _keyObject = null; 

//#if !PBTCOMPILER
        Object[] _staticResourceValues;
//#endif 

//#endregion Data 
    } 

 
    // BamlRecord for x:Key attribute when used in a defer loaded dictionary
    // as the key for adding a value.  The value is stored as a String.
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/