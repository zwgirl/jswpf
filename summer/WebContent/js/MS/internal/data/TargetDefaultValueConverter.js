/**
 * TargetDefaultValueConverter
 */

define(["dojo/_base/declare", "system/Type", "internal.data/DefaultValueConverter", "data/IValueConverter",
        "windows/DependencyObject"], 
		function(declare, Type, DefaultValueConverter, IValueConverter,
				DependencyObject){
	var TargetDefaultValueConverter = declare("TargetDefaultValueConverter", DefaultValueConverter,{
		constructor:function(/*TypeConverter*/ typeConverter, /*Type*/ sourceType, /*Type*/ targetType, 
                /*bool*/ shouldConvertFrom, /*bool*/ shouldConvertTo, /*DataBindEngine*/ engine){
//			base(typeConverter, sourceType, targetType, shouldConvertFrom, shouldConvertTo, engine)
			DefaultValueConverter.prototype.constructor.call(this, typeConverter, sourceType, 
					targetType, shouldConvertFrom, shouldConvertTo, engine);
		},
		
//		public object 
		Convert:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture) 
        {
            return this.ConvertFrom(o, this._targetType, 
            		parameter instanceof DependencyObject ? parameter : null, culture); 
        },

//        public object 
		ConvertBack:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture)
        { 
            return this.ConvertTo(o, this._sourceType, 
            		parameter instanceof DependencyObject ? parameter : null, culture);
        },
	});
	
	TargetDefaultValueConverter.Type = new Type("TargetDefaultValueConverter", TargetDefaultValueConverter,
			[DefaultValueConverter.Type, IValueConverter.Type]);
	return TargetDefaultValueConverter;
});
