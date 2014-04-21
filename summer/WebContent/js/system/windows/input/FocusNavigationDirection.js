/**
 * FocusNavigationDirection
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var FocusNavigationDirection = declare("FocusNavigationDirection", Object, { 
    });	
    
    FocusNavigationDirection.Next = 0;

    FocusNavigationDirection.Previous=1; 

    FocusNavigationDirection.First=2;
    
    FocusNavigationDirection.Last = 3;

    FocusNavigationDirection.Left=4; 

    FocusNavigationDirection.Right=5;
    
    FocusNavigationDirection.Up=6;
    
    FocusNavigationDirection.Down=7;

//    FocusNavigationDirection.Type = new Type("FocusNavigationDirection", FocusNavigationDirection, [Object.Type]);
    return FocusNavigationDirection;
});	
