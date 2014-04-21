package org.summer.view.widget.data;
    // Flags indicating run-time properties of a BindingExpression 
//    [Flags]
    /*internal*/public enum BindingFlags //: uint
    {
        // names used by Binding 

        OneWay                  ,//= PrivateFlags.iSourceToTarget, 
        TwoWay                  ,//= PrivateFlags.iSourceToTarget | PrivateFlags.iTargetToSource, 
        OneWayToSource          ,//= PrivateFlags.iTargetToSource,
        OneTime                 ,//= 0, 
        PropDefault             ,//= PrivateFlags.iPropDefault,
        NotifyOnTargetUpdated   ,//= PrivateFlags.iNotifyOnTargetUpdated,
        NotifyOnSourceUpdated   ,//= PrivateFlags.iNotifyOnSourceUpdated,
        NotifyOnValidationError ,//= PrivateFlags.iNotifyOnValidationError, 
        UpdateOnPropertyChanged ,//= 0,
        UpdateOnLostFocus       ,//= PrivateFlags.iUpdateOnLostFocus, 
        UpdateExplicitly        ,//= PrivateFlags.iUpdateExplicitly, 
        UpdateDefault           ,//= PrivateFlags.iUpdateDefault,
        PathGeneratedInternally ,//= PrivateFlags.iPathGeneratedInternally, 
        ValidatesOnExceptions   ,//= PrivateFlags.iValidatesOnExceptions,
        ValidatesOnDataErrors   ,//= PrivateFlags.iValidatesOnDataErrors,
        ValidatesOnNotifyDataErrors ,//= PrivateFlags.iValidatesOnNotifyDataErrors,

        Default                 ,//= PropDefault | UpdateDefault,

        /// <summary> Error value, returned by FlagsFrom to indicate faulty input</summary> 
        IllegalInput                ,//= PrivateFlags.iIllegalInput,

        PropagationMask ,//= OneWay | TwoWay | OneWayToSource | OneTime | PropDefault,
        UpdateMask      ,//= UpdateOnPropertyChanged | UpdateOnLostFocus | UpdateExplicitly | UpdateDefault,
    }