/**
 * SelectionMode
 */
define(["dojo/_base/declare"], function(declare){

    var SelectionMode=declare("SelectionMode", null,{ 
    });	
    
    SelectionMode.Single = 0;

    SelectionMode.Multiple = 1;

    SelectionMode.Extended = 2;

    
    return SelectionMode;
    
}); 
