package org.summer.view.widget.data;

import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.Type;
//dynamically pick and switch a default value converter to convert between source and target type 
/*internal*/ public class DynamicValueConverter implements IValueConverter
{ 
    /*internal*/ public DynamicValueConverter(boolean targetToSourceNeeded)
    {
        _targetToSourceNeeded = targetToSourceNeeded;
    } 

    /*internal*/ public DynamicValueConverter(boolean targetToSourceNeeded, Type sourceType, Type targetType) 
    { 
        _targetToSourceNeeded = targetToSourceNeeded;
        EnsureConverter(sourceType, targetType); 
    }

    /*internal*/ public Object Convert(Object value, Type targetType)
    { 
        return Convert(value, targetType, null, CultureInfo.InvariantCulture);
    } 

    public Object Convert(Object value, Type targetType, Object parameter, CultureInfo culture)
    { 
        Object result = DependencyProperty.UnsetValue;  // meaning: failure to convert

        if (value != null)
        { 
            Type sourceType = value.GetType();
            EnsureConverter(sourceType, targetType); 

            if (_converter != null)
            { 
                result = _converter.Convert(value, targetType, parameter, culture);
            }
        }
        else 
        {
            if (!targetType.IsValueType) 
            { 
                result = null;
            } 
        }

        return result;
    } 

    public Object ConvertBack(Object value, Type sourceType, Object parameter, CultureInfo culture) 
    { 
        Object result = DependencyProperty.UnsetValue;  // meaning: failure to convert

        if (value != null)
        {
            Type targetType = value.GetType();
            EnsureConverter(sourceType, targetType); 

            if (_converter != null) 
            { 
                result = _converter.ConvertBack(value, sourceType, parameter, culture);
            } 
        }
        else
        {
            if (!sourceType.IsValueType) 
            {
                result = null; 
            } 
        }

        return result;
    }


    private void EnsureConverter(Type sourceType, Type targetType)
    { 
        if ((_sourceType != sourceType) || (_targetType != targetType)) 
        {
            // types have changed - get a new converter 

            if (sourceType != null && targetType != null)
            {
                // DefaultValueConverter.Create() is more sophisticated to find correct type converters, 
                // e.g. if source/targetType is Object or well-known system types.
                // if there is any change in types, give that code to come up with the correct converter 
                if (_engine == null) 
                {
                    _engine = DataBindEngine.CurrentDataBindEngine; 
                }
                Invariant.Assert(_engine != null);
                _converter = _engine.GetDefaultValueConverter(sourceType, targetType, _targetToSourceNeeded);
            } 
            else
            { 
                // if either type is null, no conversion is possible. 
                // Don't ask GetDefaultValueConverter - it will use null as a
                // hashtable key, and crash (bug 110859). 
                _converter = null;
            }

            _sourceType = sourceType; 
            _targetType = targetType;
        } 
    } 

    private Type _sourceType; 
    private Type _targetType;
    private IValueConverter _converter;
    private boolean _targetToSourceNeeded;
    private DataBindEngine _engine; 
}