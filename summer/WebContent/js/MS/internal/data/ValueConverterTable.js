/**
 * ValueConverterTable
 */
//cache of default value converters (so that all uses of string-to-int can 
// share the same converter)
define(["dojo/_base/declare", "system/Type", "collections/Hashtable"], 
		function(declare, Type, Hashtable){
	
//	struct 
	var Key = declare(null, 
    {
//        Type _sourceType, _targetType; 
//        bool _targetToSource;

        constructor:function(/*Type*/ sourceType, /*Type*/ targetType, /*bool*/ targetToSource) 
        {
            this._sourceType = sourceType; 
            this._targetType = targetType;
            this._targetToSource = targetToSource;
        },

//        public override int 
        GetHashCode:function()
        { 
            return this._sourceType.GetHashCode() + this._targetType.GetHashCode(); 
        },

//        public override bool 
        Equals:function(/*object*/ o)
        {
            if (o instanceof Key)
            { 
                return this == o;
            } 
            return false; 
        }
    });
	
	var ValueConverterTable = declare("ValueConverterTable", Hashtable,{
		constructor:function( ){

		},
//      public IValueConverter this[Type sourceType, Type targetType, bool targetToSource]
//    	{ 
        Get:function(/*Type*/ sourceType, /*Type*/ targetType, /*bool*/ targetToSource) 
        {
            var key = new Key(sourceType, targetType, targetToSource); 
            var value = Hashtable.prototype.Get.call(this, key);
            return /*(IValueConverter)*/value;
        },
//        public void 
        Add:function(/*Type*/ sourceType, /*Type*/ targetType, /*bool*/ targetToSource, /*IValueConverter*/ value) 
        { 
        	Hashtable.prototype.Add.call(this, new Key(sourceType, targetType, targetToSource), value);
        } 
	});
	
	ValueConverterTable.Type = new Type("ValueConverterTable", ValueConverterTable, [Hashtable.Type]);
	return ValueConverterTable;
});

