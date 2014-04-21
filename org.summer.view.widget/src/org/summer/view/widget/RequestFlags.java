package org.summer.view.widget;
public enum RequestFlags 
{ 
    FullyResolved ,//= 0x00,
    AnimationBaseValue ,//= 0x01, 
    CoercionBaseValue ,//= 0x02,
    DeferredReferences ,//= 0x04,
    SkipDefault ,//= 0x08,
    RawEntry ,//= 0x10, 
}