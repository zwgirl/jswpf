package org.summer.view.widget;

import org.summer.view.widget.collection.Dictionary;
import org.summer.view.widget.xaml.XamlObjectWriter;
import org.summer.view.widget.xaml.XamlReader;
import org.summer.view.widget.xaml.XamlType;

//This class is meant to hold any data that a TemplateContent needs during TemplateLoad 
// that isn't needed by a FrameworkTemplate during TemplateApply.
/*internal*/public class TemplateLoadData 
{ 
    /*internal*/ TemplateLoadData()
    { 
    }

    /*internal*/ TemplateContent.StackOfFrames Stack { get; set; }

    /*internal*/public Dictionary<String, XamlType> _namedTypes;
    /*internal*/ Dictionary<String, XamlType> NamedTypes 
    { 
        get
        { 
            if (_namedTypes == null)
                _namedTypes = new Dictionary<String, XamlType>();
            return _namedTypes;
        } 
    }

    /// <SecurityNote> 
    /// Critical to write: The XAML in this field is loaded with the privilege specified in LoadPermission.
    /// Safe to read: The Object in itself carries no privilege. 
    /// </SecurityNote>
    /*internal*/ /*System.Xaml.*/XamlReader Reader
    {
        get; 
//        [SecurityCritical]
        set; 
    } 

    /*internal*/ String RootName { get; set; } 
    /*internal*/ Object RootObject { get; set; }
    /*internal*/ ServiceProviderWrapper ServiceProviderWrapper { get; set; }
    /*internal*/ XamlObjectWriter ObjectWriter { get; set; }
} 