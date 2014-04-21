/**
 * from AccessorTable
 * AccessorInfo
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var AccessorInfo = declare("AccessorInfo", Object,{
		constructor:function(/*object*/ accessor, /*Type*/ propertyType, /*object[]*/ args)
        { 
            this._accessor = accessor;
            this._propertyType = propertyType; 
            this._args = args; 
            
//            int         
            this._generation = 0;        // used for discarding aged entries
		},
		
	});
	
	Object.defineProperties(AccessorInfo.prototype,{
//	     internal object     
		Accessor:        { get:function() { return this._accessor; } },
//        internal Type       
		PropertyType:    { get:function() { return this._propertyType; } },
//        internal object[]   
		Args:            { get:function() { return this._args; } },
	 
//        internal int 
		Generation: { get:function() { return this._generation; }, set:function(value) { this._generation = value; } }	  
	});
	
	Object.defineProperties(AccessorInfo,{
		  
	});
	
	AccessorInfo.Type = new Type("AccessorInfo", AccessorInfo, [Object.Type]);
	return AccessorInfo;
});
