/**
 * Stretch
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var Stretch = declare("Stretch", Object, { 
    });	
    
    Stretch.None = 0;
    Stretch.Fill=1; 
    Stretch.Uniform=2; 
    Stretch.UniformToFill=3; 

//    Stretch.Type = new Type("Stretch", Stretch, [Object.Type]);
    return Stretch;
});
