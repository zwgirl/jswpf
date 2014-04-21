/**
 * CustomPopupPlacementCallback
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var CustomPopupPlacementCallback = declare("CustomPopupPlacementCallback", Delegate,{
		constructor:function(target, method){
			
		}
	});

	CustomPopupPlacementCallback.Type = new Type("CustomPopupPlacementCallback", CustomPopupPlacementCallback, [Delegate.Type]);
	return CustomPopupPlacementCallback;
});

//public delegate CustomPopupPlacement[] CustomPopupPlacementCallback(Size popupSize, Size targetSize, Point offset);