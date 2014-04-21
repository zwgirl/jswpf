package org.summer.view.widget.markup;
public interface IOptimizedMarkupExtension
    { 
        short ExtensionTypeId
        {
            get;
        } 

        short ValueId 
        { 
            get;
        } 

        boolean IsValueTypeExtension
        {
            get; 
        }
 
        boolean IsValueStaticExtension 
        {
            get; 
        }
    }

    // BamlRecord use in a defer loaded dictionary as the key for adding a value. 
    // The value is a type that is refered to using a TypeID
    // <SecurityNote> 
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/