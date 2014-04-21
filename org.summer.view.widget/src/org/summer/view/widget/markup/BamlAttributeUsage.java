package org.summer.view.widget.markup;
/// <summary>
    /// Some attributes have special usages or cause additional actions when they 
    /// are set on an element.  This can be have some other effects
    /// such as setting the xml:lang or xml:space values in the parser context.
    /// The PropertyUsage describes addition effects or usage for this property.
    /// </summary> 
    /*internal*/public enum BamlAttributeUsage //: short
    { 
        /// <summary> A regular property that has no other use </summary> 
        Default , //= 0,
 
        /// <summary> A property that has xml:lang information </summary>
        XmlLang,

        /// <summary> A property that has xml:space information </summary> 
        XmlSpace,
 
        /// <summary> A property that has the RuntimeIdProperty information </summary> 
        RuntimeName,
    } 

    // This class handles allocation, read and write management of baml records.
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add 
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/