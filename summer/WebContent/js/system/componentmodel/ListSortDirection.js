/**
 * ListSortDirection
 */
define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){

    var ListSortDirection = declare("ListSortDirection", Object,{ 
    });	


    NewItemPlaceholderPosition.Ascending = 0; 
    NewItemPlaceholderPosition.Descending = 1; 


    ListSortDirection.Type = new Type("ListSortDirection", ListSortDirection, [Object.Type]); 
    return ListSortDirection;
        
});
