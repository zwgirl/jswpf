package org.summer.view.widget.data;
//    [Flags]
    /*private*/ enum PrivateFlags //: uint 
    { 
        // internal use

        iSourceToTarget             ,//= 0x00000001,
        iTargetToSource             ,//= 0x00000002,
        iPropDefault                ,//= 0x00000004,
        iNotifyOnTargetUpdated      ,//= 0x00000008, 
        iDefaultValueConverter      ,//= 0x00000010,
        iInTransfer                 ,//= 0x00000020, 
        iInUpdate                   ,//= 0x00000040, 
        iTransferPending            ,//= 0x00000080,
        iNeedDataTransfer           ,//= 0x00000100, 
        iTransferDeferred           ,//= 0x00000200,   // used by MultiBindingExpression
        iUpdateOnLostFocus          ,//= 0x00000400,
        iUpdateExplicitly           ,//= 0x00000800,
        iUpdateDefault              ,//= iUpdateExplicitly | iUpdateOnLostFocus, 
        iNeedsUpdate                ,//= 0x00001000,
        iPathGeneratedInternally    ,//= 0x00002000, 
        iUsingMentor                ,//= 0x00004000, 
        iResolveNamesInTemplate     ,//= 0x00008000,
        iDetaching                  ,//= 0x00010000, 
        iNeedsCollectionView        ,//= 0x00020000,
        iInPriorityBindingExpression,//= 0x00040000,
        iInMultiBindingExpression   ,//= 0x00080000,
        iUsingFallbackValue         ,//= 0x00100000, 
        iNotifyOnValidationError    ,//= 0x00200000,
        iAttaching                  ,//= 0x00400000, 
        iNotifyOnSourceUpdated      ,//= 0x00800000, 
        iValidatesOnExceptions      ,//= 0x01000000,
        iValidatesOnDataErrors      ,//= 0x02000000, 
        iIllegalInput               ,//= 0x04000000,
        iNeedsValidation            ,//= 0x08000000,
        iTargetWantsXTNotification  ,//= 0x10000000,
        iValidatesOnNotifyDataErrors,//= 0x20000000, 
        iDataErrorsChangedPending   ,//= 0x40000000,
        iDeferUpdateForComposition  ,//= 0x80000000, 

        iPropagationMask ,//= iSourceToTarget | iTargetToSource | iPropDefault,
        iUpdateMask      ,//= iUpdateOnLostFocus | iUpdateExplicitly, 
        iAdoptionMask    ,//= iSourceToTarget | iTargetToSource | iNeedsUpdate | iNeedsValidation,
    }