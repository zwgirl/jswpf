/**
 * FrugalListStoreState
 */
// This enum controls the growth to successively more complex storage models
define(["dojo/_base/declare"], function(declare){
    
    var FrugalListStoreState  = declare("FrugalListStoreState", Object, {});
    FrugalListStoreState.Success = 0;
    FrugalListStoreState.SingleItemList = 1; 
    FrugalListStoreState.ThreeItemList = 2;
    FrugalListStoreState.SixItemList = 3;
    FrugalListStoreState.Array = 4;
    
    return FrugalListStoreState;
});
