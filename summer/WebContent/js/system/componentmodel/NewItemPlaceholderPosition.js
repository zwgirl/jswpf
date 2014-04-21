/**
 * NewItemPlaceholderPosition
 */
define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){

    var NewItemPlaceholderPosition = declare("NewItemPlaceholderPosition", Object,{ 
    });	


    NewItemPlaceholderPosition.None = 0; 
    NewItemPlaceholderPosition.AtBeginning = 1; 
    NewItemPlaceholderPosition.AtEnd = 2;


	NewItemPlaceholderPosition.Type = new Type("NewItemPlaceholderPosition", NewItemPlaceholderPosition, [Object.Type]); 
    return NewItemPlaceholderPosition;
        
});
