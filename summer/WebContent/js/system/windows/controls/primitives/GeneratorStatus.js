/**
 * from IItemContainerGenerator
 */ 

/**
 * GeneratorStatus
 */
define(["dojo/_base/declare"], function(declare){

    var GeneratorStatus=declare("GeneratorStatus", null,{ 
    });	
    
    GeneratorStatus.NotStarted = 0;
    GeneratorStatus.GeneratingContainers = 1;
    GeneratorStatus.ContainersGenerated = 2;
    GeneratorStatus.Error = 3;

    return GeneratorStatus;
    
});
