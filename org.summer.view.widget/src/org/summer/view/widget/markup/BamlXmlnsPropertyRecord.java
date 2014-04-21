package org.summer.view.widget.markup;
public class BamlXmlnsPropertyRecord : BamlVariableSizedRecord
    {

//#region Methods 

//#if !PBTCOMPILER 
        // LoadRecord specific data 
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            Prefix  =  bamlBinaryReader.ReadString();
            XmlNamespace  =   bamlBinaryReader.ReadString();

            short count = bamlBinaryReader.ReadInt16(); 

            if (count > 0) 
            { 
                AssemblyIds = new short[count];
 
                for (short i = 0; i < count; i++)
                {
                    AssemblyIds[i] = bamlBinaryReader.ReadInt16();
                } 
            }
            else 
            { 
                AssemblyIds = null;
            } 

        }
//#endif
 
        // write record specific Data.
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        { 
            bamlBinaryWriter.Write(Prefix);
            bamlBinaryWriter.Write(XmlNamespace); 

            // Write the AssemblyIds which contain XmlnsDefinitionAttribute
            // for this xmlns Uri.
            // The format should be CountN Id1 Id2 ... IdN 
            //
            short count = 0; 
 
            if (AssemblyIds != null && AssemblyIds.Length > 0)
            { 
                count = (short) AssemblyIds.Length;
            }

            bamlBinaryWriter.Write(count); 

            if (count > 0) 
            { 
                for (short i = 0; i < count; i++)
                { 
                    bamlBinaryWriter.Write(AssemblyIds[i]);
                }
            }
        } 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record) 
        {
            base.Copy(record); 

            BamlXmlnsPropertyRecord newRecord = (BamlXmlnsPropertyRecord)record;
            newRecord._prefix = _prefix;
            newRecord._xmlNamespace = _xmlNamespace; 
            newRecord._assemblyIds = _assemblyIds;
        } 
//#endif 

//#endregion Methods 

//#region Properties

        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.XmlnsProperty; } 
        } 

        /*internal*/public String Prefix 
        {
            get { return _prefix; }
            set {_prefix = value; }
        } 

        /*internal*/public String XmlNamespace 
        { 
            get { return _xmlNamespace; }
            set { _xmlNamespace = value; } 
        }

        /*internal*/public short[] AssemblyIds
        { 
            get { return _assemblyIds; }
            set { _assemblyIds = value; } 
        } 

//#endregion Properties 

//#region Data

        String _prefix; 
        String _xmlNamespace;
        short[] _assemblyIds; 
 
//#endregion Data
 
    }

    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/