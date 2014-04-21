/**
 * StringComparison
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var StringComparison = declare("StringComparison", Object, { 
    });	
    
    StringComparison.CurrentCulture = 0;
    StringComparison.CurrentCultureIgnoreCase=1; 
    StringComparison.InvariantCulture=2;
    StringComparison.InvariantCultureIgnoreCase = 3;
    StringComparison.Ordinal=4; 
    StringComparison.OrdinalIgnoreCase=5;

//    StringComparison.Type = new Type("StringComparison", StringComparison, [Object.Type]);
    return StringComparison;
});
