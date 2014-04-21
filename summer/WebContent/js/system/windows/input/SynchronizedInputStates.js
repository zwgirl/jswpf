/**
 * SynchronizedInputStates
 */
define(["dojo/_base/declare"], function(declare){

    var SynchronizedInputStates=declare("SynchronizedInputStates", null,{ 
    });	
    
	  
    SynchronizedInputStates.NoOpportunity   = 1; 
    SynchronizedInputStates.HadOpportunity  = 2;
    SynchronizedInputStates.Handled         = 3; 
    SynchronizedInputStates.Discarded       = 4; 
    
    return SynchronizedInputStates;
}); 
