/**
 * StringBuilder
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var StringBuilder = declare("StringBuilder", Object, { 
    	constructor:function(){
    		this._stringArray = new Array();	
    	},
    	Append:function(str)
    	{
    		this._stringArray.push(str);
    		
    		return this;
    	},
    	
    	Clear:function () { this._stringArray = []; },

    	IsEmpty:function () { return this._stringArray.length == 0; },
    	
    	AppendFormat:function()
		{
    		this._stringArray.push(String.Format.apply(null, arguments)); 
			
			return this;
		},

    	ToString:function()
    	{
    		return this._stringArray.join();
    	}

    });	

    StringBuilder.Type = new Type("StringBuilder", StringBuilder, [Object.Type]);
    return StringBuilder;
});
