/**
 * from MatrixUtil
 * MatrixTypes
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var MatrixTypes = declare("MatrixTypes", Object, { 
    });	
    
    MatrixTypes.TRANSFORM_IS_IDENTITY = 0;
    MatrixTypes.TRANSFORM_IS_TRANSLATION = 1; 
    MatrixTypes.TRANSFORM_IS_SCALING = 2; 
    MatrixTypes.TRANSFORM_IS_UNKNOWN = 4; 

//    MatrixTypes.Type = new Type("MatrixTypes", MatrixTypes, [Object.Type]);
    return MatrixTypes;
});
