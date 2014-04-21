/**
 * MemberInfo
 */

define(["dojo/_base/declare", "system/Type", "reflection/ICustomAttributeProvider"], 
		function(declare, Type, ICustomAttributeProvider){
	var MemberInfo = declare("MemberInfo", ICustomAttributeProvider,{
		constructor:function(/*String*/ name){
			this._name = name;
		}
	});
	
	Object.defineProperties(MemberInfo.prototype,{
//        public abstract String 
		Name: { get:function(){return this._name; } }, 

//        public abstract Type 
		DeclaringType: { get:function(){} }, 
 
//        public abstract Type 
		ReflectedType: { get:function(){} },
 
//        public virtual IEnumerable<CustomAttributeData> 
		CustomAttributes:
        {
            get:function()
            { 
                return GetCustomAttributesData();
            } 
        } 
	});
	
	MemberInfo.Type = new Type("MemberInfo", MemberInfo, [ICustomAttributeProvider.Type]);
	return MemberInfo;
});

