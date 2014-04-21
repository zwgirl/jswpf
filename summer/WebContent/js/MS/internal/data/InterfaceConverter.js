/**
 * InterfaceConverter
 */

define(["dojo/_base/declare", "system/Type", "data/IValueConverter"], 
		function(declare, Type, IValueConverter){
	var InterfaceConverter = declare("InterfaceConverter", IValueConverter,{
		constructor:function(/*Type*/ sourceType, /*Type*/ targetType) 
        {
            this._sourceType = sourceType; 
            this._targetType = targetType; 
        },
        
//        public object 
        Convert:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture) 
        {
            return this.ConvertTo(o, this._targetType); 
        },

//        public object 
        ConvertBack:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture)
        { 
            return this.ConvertTo(o, this._sourceType);
        }, 
 
//        private object 
        ConvertTo:function(/*object*/ o, /*Type*/ type)
        { 
            return type.IsInstanceOfType(o) ? o : null;
        }
        
	});
	
	Object.defineProperties(InterfaceConverter.prototype,{
		  
	});
	
	Object.defineProperties(InterfaceConverter,{
		  
	});
	
	InterfaceConverter.Type = new Type("InterfaceConverter", InterfaceConverter, [IValueConverter.Type]);
	return InterfaceConverter;
});
