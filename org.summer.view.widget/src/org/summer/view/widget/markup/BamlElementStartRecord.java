package org.summer.view.widget.markup;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.CultureInfo;

public class BamlElementStartRecord extends BamlRecord
    { 

//#region Methods 
// 
//#if !PBTCOMPILER
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader) 
        {
            TypeId = bamlBinaryReader.ReadInt16();
            byte flags = bamlBinaryReader.ReadByte();
            CreateUsingTypeConverter = (flags & 1) != 0; 
            IsInjected = (flags & 2) != 0;
        } 
//#endif 

        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
            bamlBinaryWriter.Write(TypeId);
            byte flags = (byte)((CreateUsingTypeConverter ? 1 : 0) | (IsInjected ? 2 : 0));
            bamlBinaryWriter.Write(flags); 
        }
 
//#endregion Methods 
//
//#region Properties 

        /*internal*/public /*override*/ BamlRecordType RecordType
        {
            get { return BamlRecordType.ElementStart; } 
        }
 
        // Id of the type of this Object 
        /*internal*/public short TypeId
        { 

            get
            {
                short value = (short) _flags[_typeIdLowSection]; 
                value |= (short) (_flags[_typeIdHighSection] << 8);
 
                return value; 
            }
 
            set
            {
                _flags[_typeIdLowSection] = (short)  (value & 0xff);
                _flags[_typeIdHighSection] = (short) ((value & 0xff00) >> 8); 
            }
 
 
        }
 
        // Whether this Object instance is expected to be created via TypeConverter
        /*internal*/public boolean CreateUsingTypeConverter
        {
            get 
            {
                return _flags[_useTypeConverter] == 1 ? true : false; 
            } 

            set 
            {
                _flags[_useTypeConverter] = value ? 1 : 0;
            }
        } 

        // Whether this element start record is just an injected tag that should not be processed 
        /*internal*/public boolean IsInjected 
        {
            get 
            {
                return _flags[_isInjected] == 1 ? true : false;
            }
 
            set
            { 
                _flags[_isInjected] = value ? 1 : 0; 
            }
        } 

        /*internal*/public /*override*/ Int32 RecordSize
        {
            get { return 3; } 
            set { Debug.Assert(value == -1, "Wrong size set for element record"); }
        } 
 
//#endregion Properties
// 
//#if !PBTCOMPILER
        public /*override*/ String ToString()
        {
            return String.Format(CultureInfo.InvariantCulture, 
                                 "{0} typeId={1}",
                                 RecordType, GetTypeName(TypeId)); 
        } 
//#endif
 

        // Allocate space in _flags.
        // BitVector32 doesn't support 16 bit sections, so we have to break
        // it up into 2 sections. 

        private static BitVector32.Section _typeIdLowSection 
            = BitVector32.CreateSection( (short)0xff, BamlRecord.LastFlagsSection ); 

        private static BitVector32.Section _typeIdHighSection 
            = BitVector32.CreateSection( (short)0xff, _typeIdLowSection );

        private static BitVector32.Section _useTypeConverter
            = BitVector32.CreateSection( 1, _typeIdHighSection ); 

        private static BitVector32.Section _isInjected 
            = BitVector32.CreateSection( 1, _useTypeConverter ); 

 
        // This provides subclasses with a referece section to create their own section.
        /*internal*/public new static BitVector32.Section LastFlagsSection
        {
            get { return _isInjected; } 
        }
    } 
 

 
    //+---------------------------------------------------------------------------------------------------------------
    //
    //  BamlNamedElementStartRecord
    // 
    //  This is a BamlElementStartRecord that also carries an element name.
    // 
    //  This is currently /*internal*/public, used only for templates.  The original intent for this record was that 
    //  it become the new design for named objects; any Object with an x:Name set, would have that name
    //  incorporated into the element start record.  But that design did not happen, instead the 
    //  property attribute are re-ordered such that the name always immediately follows the element
    //  start record.  So this should be removed, and the template code updated accordingly.  (And in fact,
    //  the template design should be updated so as not to be reliant on naming, as that is too fragile.)
    // 
    //+----------------------------------------------------------------------------------------------------------------
//#if !PBTCOMPILER 
    /*internal*/