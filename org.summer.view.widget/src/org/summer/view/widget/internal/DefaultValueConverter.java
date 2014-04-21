package org.summer.view.widget.internal;

import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.Type;
import org.summer.view.widget.data.BindingFlags;
import org.summer.view.widget.data.DataBindEngine;
import org.summer.view.widget.data.IValueConverter;
import org.summer.view.widget.model.TypeConverter;
import org.summer.view.widget.model.TypeDescriptor;
import org.summer.view.widget.reflection.MethodInfo;

 
/*internal*/ public class DefaultValueConverter
{ 
    //----------------------------------------------------- 
    //
    //  Constructors 
    //
    //-----------------------------------------------------

    protected DefaultValueConverter(TypeConverter typeConverter, Type sourceType, Type targetType, 
                                    boolean shouldConvertFrom, boolean shouldConvertTo, DataBindEngine engine)
    { 
        _typeConverter = typeConverter; 
        _sourceType = sourceType;
        _targetType = targetType; 
        _shouldConvertFrom = shouldConvertFrom;
        _shouldConvertTo = shouldConvertTo;
        _engine = engine;
    } 

    //------------------------------------------------------ 
    // 
    //  Internal static API
    // 
    //-----------------------------------------------------

    // static constructor - returns a ValueConverter suitable for converting between
    // the source and target.  The flag indicates whether targetToSource 
    // conversions are actually needed.
    // if no Converter is needed, return DefaultValueConverter.ValueConverterNotNeeded marker. 
    // if unable to create a DefaultValueConverter, return null to indicate error. 
    /*internal*/ public static IValueConverter Create(Type sourceType,
                                            Type targetType, 
                                            boolean targetToSource,
                                            DataBindEngine engine)
    {
        TypeConverter typeConverter; 
        Type innerType;
        boolean canConvertTo, canConvertFrom; 
        boolean sourceIsNullable = false; 
        boolean targetIsNullable = false;

        // sometimes, no conversion is necessary
        if (sourceType == targetType ||
            (!targetToSource && targetType.IsAssignableFrom(sourceType)))
        { 
            return ValueConverterNotNeeded;
        } 

        // the type convert for System.Object is useless.  It claims it can
        // convert from String, but then throws an exception when asked to do 
        // so.  So we work around it.
        if (targetType == typeof(Object))
        {
            // The sourceType here might be a Nullable type: consider using 
            // NullableConverter when appropriate. (uncomment following lines)
            //Type innerType = Nullable.GetUnderlyingType(sourceType); 
            //if (innerType != null) 
            //{
            //    return new NullableConverter(new ObjectTargetConverter(innerType), 
            //                                 innerType, targetType, true, false);
            //}

            // 
            return new ObjectTargetConverter(sourceType, engine);
        } 
        else if (sourceType == typeof(Object)) 
        {
            // The targetType here might be a Nullable type: consider using 
            // NullableConverter when appropriate. (uncomment following lines)
            //Type innerType = Nullable.GetUnderlyingType(targetType);
            // if (innerType != null)
            // { 
            //     return new NullableConverter(new ObjectSourceConverter(innerType),
            //                                  sourceType, innerType, false, true); 
            // } 

            // 
            return new ObjectSourceConverter(targetType, engine);
        }

        // use System.Convert for well-known base types 
        if (SystemConvertConverter.CanConvert(sourceType, targetType))
        { 
            return new SystemConvertConverter(sourceType, targetType); 
        }

        // Need to check for nullable types first, since NullableConverter is a bit over-eager;
        // TypeConverter for Nullable can convert e.g. Nullable<DateTime> to String
        // but it ends up doing a different conversion than the TypeConverter for the
        // generic's inner type, e.g. bug 1361977 
        innerType = Nullable.GetUnderlyingType(sourceType);
        if (innerType != null) 
        { 
            sourceType = innerType;
            sourceIsNullable = true; 
        }
        innerType = Nullable.GetUnderlyingType(targetType);
        if (innerType != null)
        { 
            targetType = innerType;
            targetIsNullable = true; 
        } 
        if (sourceIsNullable || targetIsNullable)
        { 
            // single-level recursive call to try to find a converter for basic value types
            return Create(sourceType, targetType, targetToSource, engine);
        }

        // special case for converting IListSource to IList
        if (typeof(IListSource).IsAssignableFrom(sourceType) && 
            targetType.IsAssignableFrom(typeof(IList))) 
        {
            return new ListSourceConverter(); 
        }

        // Interfaces are best handled on a per-instance basis.  The type may
        // not implement the interface, but an instance of a derived type may. 
        if (sourceType.IsInterface || targetType.IsInterface)
        { 
            return new InterfaceConverter(sourceType, targetType); 
        }

        // try using the source's type converter
        typeConverter = GetConverter(sourceType);
        canConvertTo = (typeConverter != null) ? typeConverter.CanConvertTo(targetType) : false;
        canConvertFrom = (typeConverter != null) ? typeConverter.CanConvertFrom(targetType) : false; 

        if ((canConvertTo || targetType.IsAssignableFrom(sourceType)) && 
            (!targetToSource || canConvertFrom || sourceType.IsAssignableFrom(targetType))) 
        {
            return new SourceDefaultValueConverter(typeConverter, sourceType, targetType, 
                                                   targetToSource && canConvertFrom, canConvertTo, engine);
        }

        // if that doesn't work, try using the target's type converter 
        typeConverter = GetConverter(targetType);
        canConvertTo = (typeConverter != null) ? typeConverter.CanConvertTo(sourceType) : false; 
        canConvertFrom = (typeConverter != null) ? typeConverter.CanConvertFrom(sourceType) : false; 

        if ((canConvertFrom || targetType.IsAssignableFrom(sourceType)) && 
            (!targetToSource || canConvertTo || sourceType.IsAssignableFrom(targetType)))
        {
            return new TargetDefaultValueConverter(typeConverter, sourceType, targetType,
                                                   canConvertFrom, targetToSource && canConvertTo, engine); 
        }

        // nothing worked, give up 
        return null;
    } 

    /*internal*/ public static TypeConverter GetConverter(Type type)
    {
        TypeConverter typeConverter = null; 
        WpfKnownType knownType = org.summer.view.widget.markup.BamlSharedSchemaContext.GetKnownXamlType(type) as WpfKnownType;
        if (knownType != null && knownType.TypeConverter != null) 
        { 
            typeConverter = knownType.TypeConverter.ConverterInstance;
        } 
        if (typeConverter == null)
        {
            typeConverter = TypeDescriptor.GetConverter(type);
        } 

        return typeConverter; 
    } 

    // some types have Parse methods that are more successful than their 
    // type converters at converting strings.
    // [This code is lifted from [....] - formatter.cs]
    /*internal*/ public static Object TryParse(Object o, Type targetType, CultureInfo culture)
    { 
        Object result = DependencyProperty.UnsetValue;
        String stringValue = o as String; 

        if (stringValue != null)
        { 
            try
            {
                MethodInfo mi;

                if (culture != null && (mi = targetType.GetMethod("Parse",
                                        BindingFlags.Public | BindingFlags.Static, 
                                        null, 
                                        new Type[] {StringType, typeof(System.Globalization.NumberStyles), typeof(System.IFormatProvider)},
                                        null)) 
                            != null)
                {
                    result =  mi.Invoke(null, new Object [] {stringValue, NumberStyles.Any, culture});
                } 
                else if (culture != null && (mi = targetType.GetMethod("Parse",
                                        BindingFlags.Public | BindingFlags.Static, 
                                        null, 
                                        new Type[] {StringType, typeof(System.IFormatProvider)},
                                        null)) 
                            != null)
                {
                    result =  mi.Invoke(null, new Object [] {stringValue, culture});
                } 
                else if ((mi = targetType.GetMethod("Parse",
                                        BindingFlags.Public | BindingFlags.Static, 
                                        null, 
                                        new Type[] {StringType},
                                        null)) 
                            != null)
                {
                    result =  mi.Invoke(null, new Object [] {stringValue});
                } 
            }
            catch (TargetInvocationException) 
            { 
            }
        } 

        return result;
    }

    /*internal*/ public static final IValueConverter ValueConverterNotNeeded = new ObjectTargetConverter(typeof(Object), null);

    //------------------------------------------------------ 
    //
    //  Protected API 
    //
    //------------------------------------------------------

    protected Object ConvertFrom(Object o, Type destinationType, DependencyObject targetElement, CultureInfo culture) 
    {
        return ConvertHelper(o, destinationType, targetElement, culture, false); 
    } 

    protected Object ConvertTo(Object o, Type destinationType, DependencyObject targetElement, CultureInfo culture) 
    {
        return ConvertHelper(o, destinationType, targetElement, culture, true);
    }

    // for lazy creation of the type converter, since GetConverter is expensive
    protected void EnsureConverter(Type type) 
    { 
        if (_typeConverter == null)
        { 
            _typeConverter = GetConverter(type);
        }
    }

    //-----------------------------------------------------
    // 
    //  Private API 
    //
    //------------------------------------------------------ 

    private Object ConvertHelper(Object o, Type destinationType, DependencyObject targetElement, CultureInfo culture, boolean isForward)
    {
        Object value = DependencyProperty.UnsetValue; 
        boolean needAssignment = (isForward ? !_shouldConvertTo : !_shouldConvertFrom);
        NotSupportedException savedEx = null; 

        if (!needAssignment)
        { 
            value = TryParse(o, destinationType, culture);

            if (value == DependencyProperty.UnsetValue)
            { 
                ValueConverterContext ctx = Engine.ValueConverterContext;

                // The fixed VCContext Object is usually available for re-use. 
                // In the rare cases when a second conversion is requested while
                // a previous conversion is still in progress, we allocate a temporary 
                // context Object to handle the re-entrant request.  (See Dev10 bugs
                // 809846 and 817353 for situations where this can happen.)
                if (ctx.IsInUse)
                { 
                    ctx = new ValueConverterContext();
                } 

                try
                { 
                    ctx.SetTargetElement(targetElement);
                    if (isForward)
                    {
                        value = _typeConverter.ConvertTo(ctx, culture, o, destinationType); 
                    }
                    else 
                    { 
                        value = _typeConverter.ConvertFrom(ctx, culture, o);
                    } 
                }
                catch (NotSupportedException ex)
                {
                    needAssignment = true; 
                    savedEx = ex;
                } 
                finally 
                {
                    ctx.SetTargetElement(null); 
                }
            }
        }

        if (needAssignment &&
            ( (o != null && destinationType.IsAssignableFrom(o.GetType())) || 
              (o == null && !destinationType.IsValueType) )) 
        {
            value = o; 
            needAssignment = false;
        }

        if (TraceData.IsEnabled) 
        {
            if ((culture != null) && (savedEx != null)) 
            { 
                TraceData.Trace(TraceEventType.Error,
                    TraceData.DefaultValueConverterFailedForCulture( 
                        AvTrace.ToStringHelper(o),
                        AvTrace.TypeName(o),
                        destinationType.ToString(),
                        culture), 
                    savedEx);
            } 
            else if (needAssignment) 
            {
                TraceData.Trace(TraceEventType.Error, 
                    TraceData.DefaultValueConverterFailed(
                        AvTrace.ToStringHelper(o),
                        AvTrace.TypeName(o),
                        destinationType.ToString()), 
                    savedEx);
            } 
        } 

        if (needAssignment && savedEx != null) 
            throw savedEx;

        return value;
    } 

    protected DataBindEngine Engine     { get { return _engine; } } 

    protected Type _sourceType;
    protected Type _targetType; 

    private TypeConverter _typeConverter;
    private boolean _shouldConvertFrom;
    private boolean _shouldConvertTo; 
    private DataBindEngine _engine;

    static Type StringType = typeof(String); 
}