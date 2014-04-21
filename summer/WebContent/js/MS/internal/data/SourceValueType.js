/**
 * SourceValueType
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var SourceValueType = declare("SourceValueType", Object, { 
    });	
    
    SourceValueType.Property = 0;
    SourceValueType.Indexer = 1;
    SourceValueType.Direct = 2;

    SourceValueType.Type = new Type("SourceValueType", SourceValueType, [Object.Type]);
    return SourceValueType;
});

//internal enum SourceValueType { Property, Indexer, Direct }; 
