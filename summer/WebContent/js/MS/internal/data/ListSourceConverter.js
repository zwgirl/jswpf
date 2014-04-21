/**
 * ListSourceConverter
 */

define(["dojo/_base/declare", "system/Type", "data/IValueConverter"], 
		function(declare, Type, IValueConverter){
	var ListSourceConverter = declare("ListSourceConverter", IValueConverter,{
		constructor:function(){
		},
		
//		public object 
		Convert:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture) 
        {
            /*IList*/var il = null;
            /*IListSource*/var ils = o instanceof IListSource ? o : null;
 
            if (ils != null)
            { 
                il = ils.GetList(); 
            }
 
            return il;
        },

//        public object 
		ConvertBack:function(/*object*/ o, /*Type*/ type, /*object*/ parameter, /*CultureInfo*/ culture) 
        {
            return null; 
        } 
	});
	
	Object.defineProperties(ListSourceConverter.prototype,{
		  
	});
	
	Object.defineProperties(ListSourceConverter,{
		  
	});
	
	ListSourceConverter.Type = new Type("ListSourceConverter", ListSourceConverter, [IValueConverter.Type]);
	return ListSourceConverter;
});
