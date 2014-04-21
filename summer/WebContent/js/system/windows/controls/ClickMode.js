/**
 * ClickMode
 */
define(["dojo/_base/declare"], function(declare){

    var ClickMode=declare("ClickMode", null,{ 
    });	
    
    ClickMode.Release = 0;
    ClickMode.Press = 1;
    ClickMode.Hover = 2;
    
    return ClickMode;
});