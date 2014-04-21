package org.summer.view.widget;
//[FriendAccessAllowed] // Built into Base, also used by Core & Framework. 
/*internal*/public enum FullValueSource //: short 
{
    // Bit used to store BaseValueSourceInternal = 0x01 
    // Bit used to store BaseValueSourceInternal = 0x02
    // Bit used to store BaseValueSourceInternal = 0x04
    // Bit used to store BaseValueSourceInternal = 0x08

    ValueSourceMask    ,// = 0x000F,
    ModifiersMask      ,// = 0x0070, 
    IsExpression       ,// = 0x0010, 
    IsAnimated         ,// = 0x0020,
    IsCoerced          ,// = 0x0040, 
    IsPotentiallyADeferredReference ,//= 0x0080,
    HasExpressionMarker ,//= 0x0100,
    IsCoercedWithCurrentValue ,//= 0x200,
} 
