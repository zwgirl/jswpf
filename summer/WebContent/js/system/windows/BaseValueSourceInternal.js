define(["dojo/_base/declare"], function(declare){

    var BaseValueSourceInternal =  declare("BaseValueSourceInternal", null,{ 
    });

    BaseValueSourceInternal.Unknown                 = 0;
    BaseValueSourceInternal.Default                 = 1; 
    BaseValueSourceInternal.Inherited               = 2; 
    BaseValueSourceInternal.ThemeStyle              = 3;
    BaseValueSourceInternal.ThemeStyleTrigger       = 4; 
    BaseValueSourceInternal.Style                   = 5;
    BaseValueSourceInternal.TemplateTrigger         = 6;
    BaseValueSourceInternal.StyleTrigger            = 7;
    BaseValueSourceInternal.ImplicitReference       = 8; 
    BaseValueSourceInternal.ParentTemplate          = 9;
    BaseValueSourceInternal.ParentTemplateTrigger   = 10; 
    BaseValueSourceInternal.Local                   = 11;
    
    return BaseValueSourceInternal;
});