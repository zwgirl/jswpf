define(["dojo/_base/declare"], function(declare){

    var ValidationStep=declare("ValidationStep", Object,{ 
    });	
    
    ValidationStep.RawProposedValue = 0;
	ValidationStep.ConvertedProposedValuev = 1;
	ValidationStep.UpdatedValue = 2;
	ValidationStep.CommittedValuev = 3;
    
    return ValidationStep;
});
