package org.summer.view.widget;
// Note that these enum values are arranged in the reverse order of 
// precendence for these sources. Local value has highest 
// precedence and Default value has the least. Note that we do not
// store default values in the _effectiveValues cache unless it is 
// being coerced/animated.
//[FriendAccessAllowed] // Built into Base, also used by Core & Framework.
/*internal*/ public enum BaseValueSourceInternal //: short
{ 
    Unknown                 ,//= 0,
    Default                 ,//= 1, 
    Inherited               ,//= 2, 
    ThemeStyle              ,//= 3,
    ThemeStyleTrigger       ,//= 4, 
    Style                   ,//= 5,
    TemplateTrigger         ,//= 6,
    StyleTrigger            ,//= 7,
    ImplicitReference       ,//= 8, 
    ParentTemplate          ,//= 9,
    ParentTemplateTrigger   ,//= 10, 
    Local                   ,//= 11, 
}