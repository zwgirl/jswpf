/**
 * DefaultValueConverter
 */

define(["dojo/_base/declare", "system/Type", "data/IValueConverter", "internal.data/SystemConvertConverter"], 
		function(declare, Type, IValueConverter, SystemConvertConverter){
	
//	 static Type 
	var StringType = String.Type; 
	 
	var DefaultValueConverter = declare("DefaultValueConverter", Object,{
		constructor:function(/*TypeConverter*/ typeConverter, /*Type*/ sourceType, /*Type*/ targetType, 
                /*bool*/ shouldConvertFrom, /*bool*/ shouldConvertTo, /*DataBindEngine*/ engine)
        { 
            this._typeConverter = typeConverter; 
            this._sourceType = sourceType;
            this._targetType = targetType; 
            this._shouldConvertFrom = shouldConvertFrom;
            this._shouldConvertTo = shouldConvertTo;
            this._engine = engine;
		},
		
//		protected object 
		ConvertFrom:function(/*object*/ o, /*Type*/ destinationType, /*DependencyObject*/ targetElement, /*CultureInfo*/ culture) 
        {
            return ConvertHelper(o, destinationType, targetElement, culture, false); 
        }, 

//        protected object 
        ConvertTo:function(/*object*/ o, /*Type*/ destinationType, /*DependencyObject*/ targetElement, /*CultureInfo*/ culture) 
        {
            return ConvertHelper(o, destinationType, targetElement, culture, true);
        },
 
        // for lazy creation of the type converter, since GetConverter is expensive
//        protected void 
        EnsureConverter:function(/*Type*/ type) 
        { 
            if (_typeConverter == null)
            { 
                _typeConverter = DefaultValueConverter.GetConverter(type);
            }
        },
 
//        private object 
        ConvertHelper:function(/*object*/ o, /*Type*/ destinationType, 
        		/*DependencyObject*/ targetElement, /*CultureInfo*/ culture, /*bool*/ isForward)
        {
            var value = DependencyProperty.UnsetValue; 
            var needAssignment = (isForward ? !_shouldConvertTo : !_shouldConvertFrom);
            /*NotSupportedException*/var savedEx = null; 
 
            if (!needAssignment)
            { 
                value = TryParse(o, destinationType, culture);

                if (value == DependencyProperty.UnsetValue)
                { 
                    /*ValueConverterContext*/var ctx = Engine.ValueConverterContext;
 
                    // The fixed VCContext object is usually available for re-use. 
                    // In the rare cases when a second conversion is requested while
                    // a previous conversion is still in progress, we allocate a temporary 
                    // context object to handle the re-entrant request.  (See Dev10 bugs
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
                    catch (/*NotSupportedException*/ ex)
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

            if (needAssignment && savedEx != null) 
                throw savedEx;

            return value;
        } 
		
	});
	
	DefaultValueConverter.Type = new Type("DefaultValueConverter", DefaultValueConverter, [Object.Type]);

	var ObjectTargetConverter = declare("ObjectTargetConverter", DefaultValueConverter,{
		constructor:function(/*Type*/ sourceType, /*DataBindEngine*/ engine){
//				base(null, sourceType, typeof(object), 
//		                 true /* shouldConvertFrom */, false /* shouldConvertTo */, engine)
			
			DefaultValueConverter.prototype.constructor.call(this, null, sourceType, Object.Type, 
	                 true /* shouldConvertFrom */, false /* shouldConvertTo */, engine);
		},
//			public object 
		Convert:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture) 
        {
            // conversion from any type to object is easy
            return o;
        },

//	        public object 
        ConvertBack:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture) 
        { 
            // if types are compatible, just pass the value through
            if (o == null && !this._sourceType.IsValueType) 
                return o;

            if (o != null && this._sourceType.IsAssignableFrom(o.GetType()))
                return o; 

            // if source type is string, use String.Format (string's type converter doesn't 
            // do it for us - boo!) 
            if (this._sourceType == String.Type)
                return String.Format(culture, "{0}", o); 

            // otherwise, use system converter
            this.EnsureConverter(this._sourceType);
            return ConvertFrom(o, this._sourceType, parameter instanceof DependencyObject ? parameter : null, culture); 
        }
	});
	
	ObjectTargetConverter.Type = new Type("ObjectTargetConverter", ObjectTargetConverter, 
			[DefaultValueConverter.Type, IValueConverter.Type]);
	
	Object.defineProperties(DefaultValueConverter.prototype,{
//		 protected DataBindEngine 
		Engine:     
		{ get:function() { return this._engine; } }   
	});
	
	Object.defineProperties(DefaultValueConverter,{
//		internal static readonly IValueConverter 
		ValueConverterNotNeeded:
		{
			get:function(){
				if(DefaultValueConverter._ValueConverterNotNeeded === undefined){
					DefaultValueConverter._ValueConverterNotNeeded = new ObjectTargetConverter(Object.Type, null);
				}
				
				return DefaultValueConverter._ValueConverterNotNeeded;
			}
		}
		  
	});
	
    // static constructor - returns a ValueConverter suitable for converting between
    // the source and target.  The flag indicates whether targetToSource 
    // conversions are actually needed.
    // if no Converter is needed, return DefaultValueConverter.ValueConverterNotNeeded marker. 
    // if unable to create a DefaultValueConverter, return null to indicate error. 
//    internal static IValueConverter 
	DefaultValueConverter.Create = function(/*Type*/ sourceType,
                                            /*Type*/ targetType, 
                                            /*bool*/ targetToSource,
                                            /*DataBindEngine*/ engine)
    {
        /*TypeConverter*/var typeConverter; 
        /*Type*/var innerType;
        var canConvertTo, canConvertFrom; 
        var sourceIsNullable = false; 
        var targetIsNullable = false;

        // sometimes, no conversion is necessary
        if (sourceType == targetType ||
            (!targetToSource && targetType.IsAssignableFrom(sourceType)))
        { 
            return DefaultValueConverter.ValueConverterNotNeeded;
        } 

        // the type convert for System.Object is useless.  It claims it can
        // convert from string, but then throws an exception when asked to do 
        // so.  So we work around it.
        if (targetType == Object.Type)
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
        else if (sourceType == Object.Type) 
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
        // TypeConverter for Nullable can convert e.g. Nullable<DateTime> to string
        // but it ends up doing a different conversion than the TypeConverter for the
        // generic's inner type, e.g. bug 1361977 
//        innerType = Nullable.GetUnderlyingType(sourceType);
//        if (innerType != null) 
//        { 
//            sourceType = innerType;
//            sourceIsNullable = true; 
//        }
//        innerType = Nullable.GetUnderlyingType(targetType);
//        if (innerType != null)
//        { 
//            targetType = innerType;
//            targetIsNullable = true; 
//        } 
        if (sourceIsNullable || targetIsNullable)
        { 
            // single-level recursive call to try to find a converter for basic value types
            return Create(sourceType, targetType, targetToSource, engine);
        }

        // special case for converting IListSource to IList
        if (IListSource.Type.IsAssignableFrom(sourceType) && 
            targetType.IsAssignableFrom(IList.Type)) 
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
        typeConverter = DefaultValueConverter.GetConverter(sourceType);
        canConvertTo = (typeConverter != null) ? typeConverter.CanConvertTo(targetType) : false;
        canConvertFrom = (typeConverter != null) ? typeConverter.CanConvertFrom(targetType) : false; 

        if ((canConvertTo || targetType.IsAssignableFrom(sourceType)) && 
            (!targetToSource || canConvertFrom || sourceType.IsAssignableFrom(targetType))) 
        {
            return new SourceDefaultValueConverter(typeConverter, sourceType, targetType, 
                                                   targetToSource && canConvertFrom, canConvertTo, engine);
        }

        // if that doesn't work, try using the target's type converter 
        typeConverter = DefaultValueConverter.GetConverter(targetType);
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
    }; 

//    internal static TypeConverter 
    DefaultValueConverter.GetConverter = function(/*Type*/ type)
    {
//        /*TypeConverter*/var typeConverter = null; 
//        /*WpfKnownType*/var knownType = null; //XamlReader.BamlSharedSchemaContext.GetKnownXamlType(type);  //cym comment
//        knownType = knownType instanceof WpfKnownType ? knownType : null;
//        if (knownType != null && knownType.TypeConverter != null) 
//        { 
//            typeConverter = knownType.TypeConverter.ConverterInstance;
//        } 
//        if (typeConverter == null)
//        {
//            typeConverter = TypeDescriptor.GetConverter(type);
//        } 
//
//        return typeConverter; 
    	
    	return null;
    }; 

    // some types have Parse methods that are more successful than their 
    // type converters at converting strings.
    // [This code is lifted from [....] - formatter.cs]
//    internal static object 
    DefaultValueConverter.TryParse = function(/*object*/ o, /*Type*/ targetType, /*CultureInfo*/ culture)
    { 
        var result = DependencyProperty.UnsetValue;
        var stringValue = typeof o =="string" ? o : null; 

        if (stringValue != null)
        { 
            try
            {
                /*MethodInfo*/var mi;

                if (culture != null && (mi = targetType.GetMethod("Parse",
                                        BindingFlags.Public | BindingFlags.Static, 
                                        null, 
                                        /*new Type[] {*/[StringType, /*typeof(System.Globalization.*/NumberStyles.Type, 
                                                         /*typeof(System.*/IFormatProvider.Type],
                                        null)) 
                            != null)
                {
                    result =  mi.Invoke(null, /*new object [] {*/[stringValue, NumberStyles.Any, culture]);
                } 
                else if (culture != null && (mi = targetType.GetMethod("Parse",
                                        BindingFlags.Public | BindingFlags.Static, 
                                        null, 
                                        /*new Type[] {*/[StringType, /*typeof(System.*/IFormatProvider.Type],
                                        null)) 
                            != null)
                {
                    result =  mi.Invoke(null, /*new object [] {*/[stringValue, culture]);
                } 
                else if ((mi = targetType.GetMethod("Parse",
                                        BindingFlags.Public | BindingFlags.Static, 
                                        null, 
                                        /*new Type[] {*/[StringType],
                                        null)) 
                            != null)
                {
                    result =  mi.Invoke(null, /*new object [] {*/[stringValue]);
                } 
            }
            catch (/*TargetInvocationException*/ex) 
            { 
            }
        } 

        return result;
    };

	return DefaultValueConverter;
});
//        protected Type _sourceType;
//        protected Type _targetType; 
//
//        private TypeConverter _typeConverter;
//        private bool _shouldConvertFrom;
//        private bool _shouldConvertTo; 
//        private DataBindEngine _engine;


