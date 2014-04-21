package org.summer.view.widget.internal;
#region ListSourceConverter

    internal class ListSourceConverter : IValueConverter
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

        public object Convert(object o, Type type, object parameter, CultureInfo culture) 
        {
            IList il = null;
            IListSource ils = o as IListSource;
 
            if (ils != null)
            { 
                il = ils.GetList(); 
            }
 
            return il;
        }

        public object ConvertBack(object o, Type type, object parameter, CultureInfo culture) 
        {
            return null; 
        } 
    }
 
#endregion ListSourceConverter