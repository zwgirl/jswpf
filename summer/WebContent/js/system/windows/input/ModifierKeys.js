/**
 * ModifierKeys
 */
define(["dojo/_base/declare"], function(declare){

    var ModifierKeys=declare("ModifierKeys", null,{ 
    });	
    
    ModifierKeys.None = 0;

    ModifierKeys.Alt = 1;

    ModifierKeys.Control = 2;
    ModifierKeys.Shift = 4;

    ModifierKeys.Windows = 8;

    
    return ModifierKeys;
    
}); 
