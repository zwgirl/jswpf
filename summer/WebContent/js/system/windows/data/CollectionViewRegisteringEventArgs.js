/**
 * CollectionViewRegisteringEventArgs
 */

define(["dojo/_base/declare", "system/Type", "system/EventArgs"], 
		function(declare, Type, EventArgs){
	var CollectionViewRegisteringEventArgs = declare("CollectionViewRegisteringEventArgs", EventArgs,{
		constructor:function(/*CollectionView*/ view)
		{
			this._view = view;
		}
	});
	
	Object.defineProperties(CollectionViewRegisteringEventArgs.prototype,{
//		public CollectionView 
		CollectionView:
		{
			get:function()
			{
				return this._view;
			}
		}  
	});
	
	CollectionViewRegisteringEventArgs.Type = new Type("CollectionViewRegisteringEventArgs", CollectionViewRegisteringEventArgs,
			[EventArgs.Type]);
	return CollectionViewRegisteringEventArgs;
});
