/**
 * IRecyclingItemContainerGenerator
 */

define(["dojo/_base/declare", "system/Type", "primitives/IItemContainerGenerator"], 
		function(declare, Type, IItemContainerGenerator){
	var IRecyclingItemContainerGenerator = declare("IRecyclingItemContainerGenerator", IItemContainerGenerator,{
//		void 
		Recycle:function(/*GeneratorPosition*/ position, /*int*/ count){}
	});
	
	IRecyclingItemContainerGenerator.Type = new Type("IRecyclingItemContainerGenerator", 
			IRecyclingItemContainerGenerator, [IItemContainerGenerator.Type], true);
	return IRecyclingItemContainerGenerator;
});

