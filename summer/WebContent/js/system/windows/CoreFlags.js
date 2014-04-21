/**
 * from UIElement
 * CoreFlags
 */
define(["dojo/_base/declare"], function(declare){

    var CoreFlags=declare("CoreFlags", null,{ 
    });	
    
	  
	  CoreFlags.None                            = 0x00000000; 
	  CoreFlags.SnapsToDevicePixelsCache        = 0x00000001;
	  CoreFlags.ClipToBoundsCache               = 0x00000002; 
	  CoreFlags.MeasureDirty                    = 0x00000004; 
	  CoreFlags.ArrangeDirty                    = 0x00000008;
	  CoreFlags.MeasureInProgress               = 0x00000010; 
	  CoreFlags.ArrangeInProgress               = 0x00000020;
	  CoreFlags.NeverMeasured                   = 0x00000040;
	  CoreFlags.NeverArranged                   = 0x00000080;
	  CoreFlags.MeasureDuringArrange            = 0x00000100; 
	  CoreFlags.IsCollapsed                     = 0x00000200;
	  CoreFlags.IsKeyboardFocusWithinCache      = 0x00000400; 
	  CoreFlags.IsKeyboardFocusWithinChanged    = 0x00000800; 
	  CoreFlags.IsMouseOverCache                = 0x00001000;
	  CoreFlags.IsMouseOverChanged              = 0x00002000; 
	  CoreFlags.IsMouseCaptureWithinCache       = 0x00004000;
	  CoreFlags.IsMouseCaptureWithinChanged     = 0x00008000;
	  CoreFlags.IsStylusOverCache               = 0x00010000;
	  CoreFlags.IsStylusOverChanged             = 0x00020000; 
	  CoreFlags.IsStylusCaptureWithinCache      = 0x00040000;
	  CoreFlags.IsStylusCaptureWithinChanged    = 0x00080000; 
	  CoreFlags.HasAutomationPeer               = 0x00100000; 
	  CoreFlags.RenderingInvalidated            = 0x00200000;
	  CoreFlags.IsVisibleCache                  = 0x00400000; 
	  CoreFlags.AreTransformsClean              = 0x00800000;
	  CoreFlags.IsOpacitySuppressed             = 0x01000000;
	  CoreFlags.ExistsEventHandlersStore        = 0x02000000;
	  CoreFlags.TouchesOverCache                = 0x04000000; 
	  CoreFlags.TouchesOverChanged              = 0x08000000;
	  CoreFlags.TouchesCapturedWithinCache      = 0x10000000; 
	  CoreFlags.TouchesCapturedWithinChanged    = 0x20000000; 
	  CoreFlags.TouchLeaveCache                 = 0x40000000;
	  CoreFlags.TouchEnterCache                 = 0x80000000; 

    
    return CoreFlags;
}); 


      