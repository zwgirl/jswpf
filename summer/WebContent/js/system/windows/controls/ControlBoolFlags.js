/**
 * ControlBoolFlags
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ControlBoolFlags = declare("ControlBoolFlags", null,{
	});
	
	ControlBoolFlags.ContentIsNotLogical                 = 0x0001;            // used in contentcontrol.cs
	ControlBoolFlags.IsSpaceKeyDown                      = 0x0002;            // used in ButtonBase.cs 
	ControlBoolFlags.HeaderIsNotLogical                  = 0x0004;            // used in HeaderedContentControl.cs, HeaderedItemsControl.cs 
	ControlBoolFlags.CommandDisabled                     = 0x0008;            // used in ButtonBase.cs, MenuItem.cs
	ControlBoolFlags.ContentIsItem                       = 0x0010;            // used in contentcontrol.cs 
	ControlBoolFlags.HeaderIsItem                        = 0x0020;            // used in HeaderedContentControl.cs, HeaderedItemsControl.cs
	ControlBoolFlags.ScrollHostValid                     = 0x0040;            // used in ItemsControl.cs
	ControlBoolFlags.ContainsSelection                   = 0x0080;            // used in TreeViewItem.cs
	ControlBoolFlags.VisualStateChangeSuspended          = 0x0100;            // used in Control.cs 
	
	return ControlBoolFlags;
});

//    internal enum ControlBoolFlags : ushort
//    { 
//        ContentIsNotLogical                 = 0x0001,            // used in contentcontrol.cs
//        IsSpaceKeyDown                      = 0x0002,            // used in ButtonBase.cs 
//        HeaderIsNotLogical                  = 0x0004,            // used in HeaderedContentControl.cs, HeaderedItemsControl.cs 
//        CommandDisabled                     = 0x0008,            // used in ButtonBase.cs, MenuItem.cs
//        ContentIsItem                       = 0x0010,            // used in contentcontrol.cs 
//        HeaderIsItem                        = 0x0020,            // used in HeaderedContentControl.cs, HeaderedItemsControl.cs
//        ScrollHostValid                     = 0x0040,            // used in ItemsControl.cs
//        ContainsSelection                   = 0x0080,            // used in TreeViewItem.cs
//        VisualStateChangeSuspended          = 0x0100,            // used in Control.cs 
//    }