package org.summer.view.widget.markup;

import org.summer.view.widget.reflection.Assembly;

public class BamlAssemblyInfoRecord extends BamlVariableSizedRecord 
    {
        /*internal*/public BamlAssemblyInfoRecord() 
        { 
            Pin(); // Don't allow this record to be recycled in the read cache.
            AssemblyId = -1; 
        }

//#region Methods
 
//#if !PBTCOMPILER
        // LoadRecord specific data 
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader) 
        {
            AssemblyId       =  bamlBinaryReader.ReadInt16(); 
            AssemblyFullName =  bamlBinaryReader.ReadString();
        }
//#endif
 
        // write record specific Data.
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        { 
            // write out an int for record size but we'll go back and fill
            bamlBinaryWriter.Write(AssemblyId); 
            bamlBinaryWriter.Write(AssemblyFullName);
        }

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        { 
            base.Copy(record); 

            BamlAssemblyInfoRecord newRecord = (BamlAssemblyInfoRecord)record; 
            newRecord._assemblyFullName = _assemblyFullName;
            newRecord._assembly = _assembly;
        }
//#endif 

//#endregion Methods 
 
//#region Properties
 
        // The following are stored in the baml stream

        // ID of this assembly
        /*internal*/public short AssemblyId 
        {
 
            get 
            {
                short value = (short) _flags[_assemblyIdLowSection]; 
                value |= (short) (_flags[_assemblyIdHighSection] << 8);

                return value;
            } 

            set 
            { 
                _flags[_assemblyIdLowSection] = (short)  (value & 0xff);
                _flags[_assemblyIdHighSection] = (short) ((value & 0xff00) >> 8); 
            }

        }
 
        // Allocate space in _flags.
        // BitVector32 doesn't support 16 bit sections, so we have to break 
        // it up into 2 sections. 

        private static BitVector32.Section _assemblyIdLowSection 
            = BitVector32.CreateSection( (short)0xff, BamlVariableSizedRecord.LastFlagsSection );

        private static BitVector32.Section _assemblyIdHighSection
            = BitVector32.CreateSection( (short)0xff, _assemblyIdLowSection ); 

//#if !PBTCOMPILER 
        // This provides subclasses with a referece section to create their own section. 
        /*internal*/public new static BitVector32.Section LastFlagsSection
        { 
            get { return _assemblyIdHighSection; }
        }
//#endif
 
        // Full name of this assembly, excluding any suffix.  This has
        // the format "AssemblyName, Version, Culture, PublicKeyToken" when we 
        // have a true full name.  Sometimes we aren't given the full assembly 
        // name, in which case the full name is the same as the short name.
        /*internal*/public String AssemblyFullName 
        {
            get { return _assemblyFullName; }
            set { _assemblyFullName = value; }
        } 

        // The following are not part of the BAML stream 
 
        // Identify type of record
        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.AssemblyInfo; }
        }
 
        // The actual loaded assembly
        /*internal*/public Assembly Assembly 
        { 
            get { return _assembly; }
            set { _assembly = value; } 
        }


//#endregion Properties 

 
//#region Data 

        String   _assemblyFullName; 
        Assembly _assembly;

//#endregion Data
    } 

    // Information about a type for an element, Object or property 
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code. 
    // </SecurityNote>
    /*internal*/