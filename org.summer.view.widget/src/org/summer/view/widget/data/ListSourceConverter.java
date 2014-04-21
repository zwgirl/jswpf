package org.summer.view.widget.data;
/*internal*/ public class ListSourceConverter implements IValueConverter
{ 
    //-----------------------------------------------------
    // 
    //  Constructors 
    //
    //------------------------------------------------------ 


    //-----------------------------------------------------
    // 
    //  Interfaces (IValueConverter)
    // 
    //----------------------------------------------------- 

    public Object Convert(Object o, Type type, Object parameter, CultureInfo culture) 
    {
        IList il = null;
        IListSource ils = o as IListSource;

        if (ils != null)
        { 
            il = ils.GetList(); 
        }

        return il;
    }

    public Object ConvertBack(Object o, Type type, Object parameter, CultureInfo culture) 
    {
        return null; 
    } 
}