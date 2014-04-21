package org.summer.view.widget.internal;
#region InterfaceConverter
 
    internal class InterfaceConverter : IValueConverter
    { 
        //----------------------------------------------------- 
        //
        //  Constructors 
        //
        //------------------------------------------------------

        internal InterfaceConverter(Type sourceType, Type targetType) 
        {
            _sourceType = sourceType; 
            _targetType = targetType; 
        }
 
        //-----------------------------------------------------
        //
        //  Interfaces (IValueConverter)
        // 
        //------------------------------------------------------
 
        public object Convert(object o, Type type, object parameter, CultureInfo culture) 
        {
            return ConvertTo(o, _targetType); 
        }

        public object ConvertBack(object o, Type type, object parameter, CultureInfo culture)
        { 
            return ConvertTo(o, _sourceType);
        } 
 
        private object ConvertTo(object o, Type type)
        { 
            return type.IsInstanceOfType(o) ? o : null;
        }

        Type _sourceType; 
        Type _targetType;
    } 
 
#endregion InterfaceConverter