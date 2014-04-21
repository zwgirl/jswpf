/**
 * GroupStyleSelector
 */
/// A delegate to select the group style as a function of the
/// parent group and its level.
define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var GroupStyleSelector = declare("GroupStyleSelector", Delegate,{
		constructor:function(){

		}
	});

	
	GroupStyleSelector.Type = new Type("GroupStyleSelector", GroupStyleSelector, [Delegate.Type]);
	return GroupStyleSelector;
});
