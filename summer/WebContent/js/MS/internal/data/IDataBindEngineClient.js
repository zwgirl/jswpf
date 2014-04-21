/**
 * Second Check 12-29
 * IDataBindEngineClient
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IDataBindEngineClient = declare("IDataBindEngineClient", null,{
//	    void 
	    TransferValue:function(){},
//	    void 
	    UpdateValue:function(){},
//	    bool 
	    AttachToContext:function(/*bool*/ lastChance){}, 
//	    void 
	    VerifySourceReference:function(/*bool*/ lastChance){},
//	    void 
	    OnTargetUpdated:function(){}

	});
	
	Object.defineProperties(IDataBindEngineClient.prototype,{
//	    DependencyObject 
	    TargetElement: { get:function(){} } 
	});
	
	IDataBindEngineClient.Type = new Type("IDataBindEngineClient", IDataBindEngineClient, [Object.Type], true);
	return IDataBindEngineClient;
});
