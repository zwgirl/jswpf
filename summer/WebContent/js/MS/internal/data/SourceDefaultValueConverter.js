/**
 * SourceDefaultValueConverter
 */

define(["dojo/_base/declare", "system/Type", "internal.data/DefaultValueConverter", "data/IValueConverter"], 
		function(declare, Type, DefaultValueConverter, IValueConverter){
	var SourceDefaultValueConverter = declare("SourceDefaultValueConverter", DefaultValueConverter,{
		constructor:function(/*TypeConverter*/ typeConverter, /*Type*/ sourceType, /*Type*/ targetType, 
                /*bool*/ shouldConvertFrom, /*bool*/ shouldConvertTo, /*DataBindEngine*/ engine){
//			base(typeConverter, sourceType, targetType, shouldConvertFrom, shouldConvertTo, engine) 
			DefaultValueConverter.prototype.constructor.call(this, typeConverter, sourceType, targetType, 
					shouldConvertFrom, shouldConvertTo, engine);
		},
		
//        public object 
		Convert:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture)
        { 
            return ConvertTo(o, this._targetType, 
            		parameter instanceof DependencyObject ? parameter : null, culture);
        },

//        public object 
		ConvertBack:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture) 
        {
            return ConvertFrom(o, this._sourceType, 
            		parameter instanceof DependencyObject ? parameter : null, culture); 
        } 
	});
	
	SourceDefaultValueConverter.Type = new Type("SourceDefaultValueConverter", SourceDefaultValueConverter,
			[DefaultValueConverter.Type, IValueConverter.Type]);
	return SourceDefaultValueConverter;
});
