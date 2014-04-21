/**
 * ICollectionViewFactory
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ICollectionViewFactory = declare("ICollectionViewFactory", null,{
	});
	
	ICollectionViewFactory.Type = new Type("ICollectionViewFactory", ICollectionViewFactory, [Object.Type]);
	return ICollectionViewFactory;
});

/*public interface ICollectionViewFactory
	{
		ICollectionView CreateView();
	}*/