/**
 * PropertyInfo
 */

define(["dojo/_base/declare", "system/Type", "reflection/MemberInfo"], 
		function(declare, Type, MemberInfo){
	var PropertyInfo = declare("PropertyInfo", MemberInfo,{
		constructor:function(/*String*/ name){
		},
		
//	    public abstract void 
		SetValue:function(/*Object*/ obj, /*Object*/ value){
			obj[this.Name] = value;
		},
 
//        public virtual Object 
		GetValue:function(/*Object*/ obj, /*Object[]*/ index)
        {
			if(index != null){
				
				
			}else{
				return obj[this.Name];
			}
        } 
	});
	
	Object.defineProperties(PropertyInfo.prototype,{
//        public abstract bool 
		CanRead: { get:function(){ return true;} },
        
//        public abstract bool 
		CanWrite: { get:function(){return true;}  },
		
//        public virtual MethodInfo 
		GetMethod: 
        { 
            get:function(){return null;}
        },
 
//        public virtual MethodInfo 
		SetMethod:
        { 
            get:function(){}
        }
	});
	
	PropertyInfo.Type = new Type("PropertyInfo", PropertyInfo, [MemberInfo.Type]);
	return PropertyInfo;
});



