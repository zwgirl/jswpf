/**
 * InternalFlags2
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var InternalFlags2 = declare("InternalFlags2", null,{

	});
    
    // RESERVED: Bits 0-15  (0x0000FFFF): TemplateChildIndex 
    InternalFlags2.R0                          = 0x00000001;
    InternalFlags2.R1                          = 0x00000002; 
    InternalFlags2.R2                          = 0x00000004; 
    InternalFlags2.R3                          = 0x00000008;
    InternalFlags2.R4                          = 0x00000010; 
    InternalFlags2.R5                          = 0x00000020;
    InternalFlags2.R6                          = 0x00000040;
    InternalFlags2.R7                          = 0x00000080;
    InternalFlags2.R8                          = 0x00000100; 
    InternalFlags2.R9                          = 0x00000200;
    InternalFlags2.RA                          = 0x00000400; 
    InternalFlags2.RB                          = 0x00000800; 
    InternalFlags2.RC                          = 0x00001000;
    InternalFlags2.RD                          = 0x00002000; 
    InternalFlags2.RE                          = 0x00004000;
    InternalFlags2.RF                          = 0x00008000;

    // free bit                 = 0x00010000; 
    // free bit                 = 0x00020000;
    // free bit                 = 0x00040000; 
    // free bit                 = 0x00080000; 

    InternalFlags2.TreeHasLoadedChangeHandler  = 0x00100000; 
    InternalFlags2.IsLoadedCache               = 0x00200000;
    InternalFlags2.IsStyleSetFromGenerator     = 0x00400000;
    InternalFlags2.IsParentAnFE                = 0x00800000;
    InternalFlags2.IsTemplatedParentAnFE       = 0x01000000; 
    InternalFlags2.HasStyleChanged             = 0x02000000;
    InternalFlags2.HasTemplateChanged          = 0x04000000; 
    InternalFlags2.HasStyleInvalidated         = 0x08000000; 
    InternalFlags2.IsRequestingExpression      = 0x10000000;
    InternalFlags2.HasMultipleInheritanceContexts = 0x20000000; 

    // free bit                 = 0x40000000;
    InternalFlags2.BypassLayoutPolicies        = 0x80000000;

    // Default is so that the default value of TemplateChildIndex
    // (which is stored in the low 16 bits) can be 0xFFFF (interpreted to be -1). 
    InternalFlags2.Default                     = 0x0000FFFF; 
    
    return InternalFlags2;
});