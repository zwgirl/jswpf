package org.summer.view.widget.markup;

import javax.sql.rowset.spi.XmlReader;

import org.summer.view.widget.Freezable;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.Dictionary;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.collection.Stack;
import org.summer.view.widget.model.TypeConverter;
 
//#if PBTCOMPILER
//
//    ///<summary>
//    ///     The IUriContext interface allows elements (like Frame, PageViewer) and type converters 
//    ///     (like BitmapImage TypeConverters) a way to ensure that base uri is set on them by the
//    ///     parser, codegen for xaml, baml and caml cases.  The elements can then use this base uri 
//    ///     to navigate. 
//    ///</summary>
/*internal*/ public interface IUriContext 
{
    /// <summary>
    ///     Provides the base uri of the current context.
    /// </summary> 
    Uri BaseUri
    { 
        get; 
        set;
    } 
}
//
//#endif
 
