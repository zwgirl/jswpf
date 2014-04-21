/**
 * Second check 12-16
 * FrugalMapStoreState
 */
// This enum controls the growth to successively more complex storage models
define(["dojo/_base/declare"], function(declare){
    
    // This enum controls the growth to successively more complex storage models
    //  internal enum 
    var FrugalMapStoreState  = declare("FrugalMapStoreState", null, {});
    FrugalMapStoreState.Success = 0;
    FrugalMapStoreState.ThreeObjectMap = 1; 
    FrugalMapStoreState.SixObjectMap = 2;
    FrugalMapStoreState.Array = 3;
    FrugalMapStoreState.SortedArray = 4;
    FrugalMapStoreState.Hashtable = 5;
    
    return FrugalMapStoreState;
});
