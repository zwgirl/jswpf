package org.summer.view.widget.markup;
public interface IBamlDictionaryKey
    {
        // Update the pointer to the Value that was written out when WriteRecordData
        // was first called. 
        void UpdateValuePosition(
            Int32        newPosition, 
            BinaryWriter bamlBinaryWriter); 

        // Relative stream position in the baml stream where the value associated 
        // with this key starts.  It is relative to the end of the keys section,
        // or the start of the values section.
        Int32 ValuePosition { get; set; }
 
        // The actual key Object used in the dictionary.  This may be a String,
        // field, type or other Object. 
        Object KeyObject { get; set; } 

        // Position in the stream where ValuePosition was written.  This is needed 
        // when updating the ValuePosition.
        Int64 ValuePositionPosition { get; set; }

        // True if the value associated with this key is shared. 
        boolean Shared { get; set; }
 
        // Whether Shared was set. 
        boolean SharedSet { get; set; }
 
//#if !PBTCOMPILER
        Object[] StaticResourceValues {get; set;}
//#endif
    } 

    // Common interface implemented by BamlRecords that 
    // use optimized storage for MarkupExtensions. 
    /*internal*/