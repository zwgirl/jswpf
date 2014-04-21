/**
 * From BindingExpressionBase
 * PrivateFlags
 */

define(["dojo/_base/declare"], function(declare){

    var PrivateFlags=declare("PrivateFlags", null,{ 
    });	
     
    PrivateFlags.iSourceToTarget             = 0x00000001;
    PrivateFlags.iTargetToSource             = 0x00000002;
    PrivateFlags.iPropDefault                = 0x00000004;
    PrivateFlags.iNotifyOnTargetUpdated      = 0x00000008; 
    PrivateFlags.iDefaultValueConverter      = 0x00000010;
    PrivateFlags.iInTransfer                 = 0x00000020; 
    PrivateFlags.iInUpdate                   = 0x00000040; 
    PrivateFlags.iTransferPending            = 0x00000080;
    PrivateFlags.iNeedDataTransfer           = 0x00000100; 
    PrivateFlags.iTransferDeferred           = 0x00000200;   // used by MultiBindingExpression
    PrivateFlags.iUpdateOnLostFocus          = 0x00000400;
    PrivateFlags.iUpdateExplicitly           = 0x00000800;
    PrivateFlags.iUpdateDefault              = PrivateFlags.iUpdateExplicitly | PrivateFlags.iUpdateOnLostFocus; 
    PrivateFlags.iNeedsUpdate                = 0x00001000;
    PrivateFlags.iPathGeneratedInternally    = 0x00002000; 
    PrivateFlags.iUsingMentor                = 0x00004000; 
    PrivateFlags.iResolveNamesInTemplate     = 0x00008000;
    PrivateFlags.iDetaching                  = 0x00010000; 
    PrivateFlags.iNeedsCollectionView        = 0x00020000;
    PrivateFlags.iInPriorityBindingExpression= 0x00040000;
    PrivateFlags.iInMultiBindingExpression   = 0x00080000;
    PrivateFlags.iUsingFallbackValue         = 0x00100000; 
    PrivateFlags.iNotifyOnValidationError    = 0x00200000;
    PrivateFlags.iAttaching                  = 0x00400000; 
    PrivateFlags.iNotifyOnSourceUpdated      = 0x00800000; 
    PrivateFlags.iValidatesOnExceptions      = 0x01000000;
    PrivateFlags.iValidatesOnDataErrors      = 0x02000000; 
    PrivateFlags.iIllegalInput               = 0x04000000;
    PrivateFlags.iNeedsValidation            = 0x08000000;
    PrivateFlags.iTargetWantsXTNotification  = 0x10000000;
    PrivateFlags.iValidatesOnNotifyDataErrors= 0x20000000; 
    PrivateFlags.iDataErrorsChangedPending   = 0x40000000;
    PrivateFlags.iDeferUpdateForComposition  = 0x80000000; 
 
    PrivateFlags.iPropagationMask = PrivateFlags.iSourceToTarget | PrivateFlags.iTargetToSource | PrivateFlags.iPropDefault;
    PrivateFlags.iUpdateMask      = PrivateFlags.iUpdateOnLostFocus | PrivateFlags.iUpdateExplicitly; 
    PrivateFlags.iAdoptionMask    = PrivateFlags.iSourceToTarget | PrivateFlags.iTargetToSource | PrivateFlags.iNeedsUpdate | PrivateFlags.iNeedsValidation;

    return PrivateFlags;
        
});