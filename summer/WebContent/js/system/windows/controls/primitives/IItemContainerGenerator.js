/**
 * IItemContainerGenerator
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IItemContainerGenerator = declare("IItemContainerGenerator", Object,{
//		ItemContainerGenerator 
		GetItemContainerGeneratorForPanel:function(/*Panel*/ panel){},
//		IDisposable 
		StartAt:function(/*GeneratorPosition*/ position, /*GeneratorDirection*/ direction){},
//		IDisposable 
		StartAt:function(/*GeneratorPosition*/ position, /*GeneratorDirection*/ direction, /*bool*/ allowStartAtRealizedItem){},
//		DependencyObject 
//		GenerateNext();
//		DependencyObject 
		GenerateNext:function(/*out bool isNewlyRealized*/isNewlyRealizedOut){},
//		void 
		PrepareItemContainer:function(/*DependencyObject*/ container){},
//		void 
		RemoveAll:function(){},
//		void 
		Remove:function(/*GeneratorPosition*/ position, /*int*/ count){},
//		GeneratorPosition 
		GeneratorPositionFromIndex:function(/*int*/ itemIndex){},
//		int 
		IndexFromGeneratorPosition:function(/*GeneratorPosition*/ position){},
	});
	
	IItemContainerGenerator.Type = new Type("IItemContainerGenerator", IItemContainerGenerator, [Object.Type], true);
	return IItemContainerGenerator;
});
