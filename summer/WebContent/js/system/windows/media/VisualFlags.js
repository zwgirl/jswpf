/**
 * VisualFlags
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var VisualFlags = declare("VisualFlags", null,{

	});
	
	VisualFlags.None = 0;
	VisualFlags.IsSubtreeDirtyForPrecompute = 1;
	VisualFlags.ShouldPostRender = 2;
	VisualFlags.IsUIElement = 4;
	VisualFlags.IsLayoutSuspended = 8;
	VisualFlags.IsVisualChildrenIterationInProgress = 16;
	VisualFlags.FindCommonAncestor = 64;
	VisualFlags.VisibilityCache_Visible = 512;
	VisualFlags.VisibilityCache_TakesSpace = 1024;
	VisualFlags.RegisteredForAncestorChanged = 2048;
	VisualFlags.SubTreeHoldsAncestorChanged = 4096;
	VisualFlags.NodeIsCyclicBrushRoot = 8192;
	VisualFlags.NodeHasEffect = 16384;
	VisualFlags.ReentrancyFlag = 65536;
	VisualFlags.HasChildren = 131072;
	
//	LogicalOp.Type = new Type("LogicalOp", LogicalOp, [Object.Type]);
	return VisualFlags;
});

