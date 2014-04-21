/**
 * BindingFlags
 */
define(["dojo/_base/declare", "data/PrivateFlags", "system/Type"], 
		function(declare, PrivateFlags, Type){

    var BindingFlags = declare("BindingFlags", Object,{ 
    });	


	BindingFlags.OneWay                  = PrivateFlags.iSourceToTarget; 
	BindingFlags.TwoWay                  = PrivateFlags.iSourceToTarget | PrivateFlags.iTargetToSource; 
	BindingFlags.OneWayToSource          = PrivateFlags.iTargetToSource;
	BindingFlags.OneTime                 = 0; 
	BindingFlags.PropDefault             = PrivateFlags.iPropDefault;
	BindingFlags.NotifyOnTargetUpdated   = PrivateFlags.iNotifyOnTargetUpdated;
	BindingFlags.NotifyOnSourceUpdated   = PrivateFlags.iNotifyOnSourceUpdated;
	BindingFlags.NotifyOnValidationError = PrivateFlags.iNotifyOnValidationError;
	BindingFlags.UpdateOnPropertyChanged = 0;
	BindingFlags.UpdateOnLostFocus       = PrivateFlags.iUpdateOnLostFocus;
	BindingFlags.UpdateExplicitly        = PrivateFlags.iUpdateExplicitly;
	BindingFlags.UpdateDefault           = PrivateFlags.iUpdateDefault;
	BindingFlags.PathGeneratedInternally = PrivateFlags.iPathGeneratedInternally; 
	BindingFlags.ValidatesOnExceptions   = PrivateFlags.iValidatesOnExceptions;
	BindingFlags.ValidatesOnDataErrors   = PrivateFlags.iValidatesOnDataErrors;
	BindingFlags.ValidatesOnNotifyDataErrors = PrivateFlags.iValidatesOnNotifyDataErrors;
 
	BindingFlags.Default                 = BindingFlags.PropDefault | BindingFlags.UpdateDefault;
 
    /// <summary> Error value, returned by FlagsFrom to indicate faulty input</summary> 
	BindingFlags.IllegalInput                = PrivateFlags.iIllegalInput;
 
	BindingFlags.PropagationMask = BindingFlags.OneWay | BindingFlags.TwoWay | 
									BindingFlags.OneWayToSource | BindingFlags.OneTime | BindingFlags.PropDefaul;
	BindingFlags.UpdateMask      = BindingFlags.UpdateOnPropertyChanged | BindingFlags.UpdateOnLostFocus | 
									BindingFlags.UpdateExplicitly | BindingFlags.UpdateDefault;


	BindingFlags.Type = new Type("BindingFlags", BindingFlags, [Object.Type]); 
    return BindingFlags;
        
});