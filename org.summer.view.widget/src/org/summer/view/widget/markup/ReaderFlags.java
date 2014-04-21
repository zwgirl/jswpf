package org.summer.view.widget.markup;
// Unlike the tokenizer and the writer, the reader knows the difference between CLR
    // object and DependencyObjects.  This is done because DependencyObjects support a 
    // superset of CLR functionality, such as the ability to quickly set a property
    // using DependencyObject.SetValue(DependencyProperty, object)
    /*internal*/public enum ReaderFlags //: ushort
    { 
        // Context types
        Unknown                   = 0x0000, 
 
        DependencyObject          = 0x1000,
        ClrObject                 = 0x2000, 

        PropertyComplexClr        = 0x3000,
        PropertyComplexDP         = 0x4000,
 
        PropertyArray             = 0x5000,
        PropertyIList             = 0x6000, 
        PropertyIDictionary       = 0x7000, 
        PropertyIAddChild         = 0x8000,
 
        RealizeDeferContent       = 0x9000,

        ConstructorParams         = 0xA000,
 
        ContextTypeMask           = 0xF000,
 
        StyleObject               = 0x0100, 
        FrameworkTemplateObject   = 0x0200,
        TableTemplateObject       = 0x0400, 
        SingletonConstructorParam = 0x0800,

        // Element flags
        NeedToAddToTree           = 0x0001,    // Need to add to element tree, but haven't yet 
        AddedToTree               = 0x0002,    // Has already been added to element tree, so don't do it again
        InjectedElement           = 0x0004,    // Context was an injected element, so skip over it 
        CollectionHolder          = 0x0008, 
        IDictionary               = 0x0010,
        IList                     = 0x0020, 
        ArrayExt                  = 0x0040,
        IAddChild                 = 0x0080,

    } 

 