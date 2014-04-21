/**
 * ObjectSourceConverter
 */

define(["dojo/_base/declare", "system/Type", "internal.data/DefaultValueConverter", "data/IValueConverter"], 
		function(declare, Type, DefaultValueConverter, IValueConverter){
	var ObjectSourceConverter = declare("ObjectSourceConverter", DefaultValueConverter,{
   	 	"-chains-": {
	      constructor: "manual"
	    },
		constructor:function(/*Type*/ targetType, /*DataBindEngine*/ engine){
//			base(null, Object.Type, targetType, true /* shouldConvertFrom */, false /* shouldConvertTo */, engine)
			DefaultValueConverter.prototype.constructor.call(this, null, Object.Type, targetType, 
					true /* shouldConvertFrom */, false /* shouldConvertTo */, engine);
		},
		
//		public object
		Convert:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture)
        {
            // if types are compatible, just pass the value through 
            if ((o != null && this._targetType.IsAssignableFrom(o.GetType())) ||
                (o == null && !this._targetType.IsValueType)) 
                return o; 

            // if target type is string, use String.Format (string's type converter doesn't 
            // do it for us - boo!)
            if (this._targetType == String.Type)
                return String.Format(culture, "{0}", o);
 
            // otherwise, use system converter
            this.EnsureConverter(this._targetType); 
            return this.ConvertFrom(o, this._targetType, parameter instanceof DependencyObject ? parameter : null, culture); 
        },
 
//        public object 
		ConvertBack:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture)
        {
            // conversion from any type to object is easy
            return o; 
        }
	});
	
	ObjectSourceConverter.Type = new Type("ObjectSourceConverter", ObjectSourceConverter, 
			[DefaultValueConverter.Type, IValueConverter.Type]);
	return ObjectSourceConverter;
});
