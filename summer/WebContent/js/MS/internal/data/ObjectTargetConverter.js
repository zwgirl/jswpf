/**
 * ObjectTargetConverter
 */

define(["dojo/_base/declare", "system/Type", "internal.data/DefaultValueConverter", "data/IValueConverter"], 
		function(declare, Type, DefaultValueConverter, IValueConverter){
	var ObjectTargetConverter = declare("ObjectTargetConverter", DefaultValueConverter,{
		constructor:function(/*Type*/ sourceType, /*DataBindEngine*/ engine){
//			base(null, sourceType, typeof(object), 
//	                 true /* shouldConvertFrom */, false /* shouldConvertTo */, engine)
			
			DefaultValueConverter.prototype.constructor.call(this, null, sourceType, Object.Type, 
	                 true /* shouldConvertFrom */, false /* shouldConvertTo */, engine);
		},
//		public object 
		Convert:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture) 
        {
            // conversion from any type to object is easy
            return o;
        },

//        public object 
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
	return ObjectTargetConverter;
});
