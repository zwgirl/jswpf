/**
 * ItemsChangedEventArgs
 */

define(["dojo/_base/declare", "system/Type", "system/EventArgs"], function(declare, Type, EventArgs){
	var ItemsChangedEventArgs = declare("ItemsChangedEventArgs", EventArgs,{
		constructor:function(){
			if(arguments.length==5 ){
				this._action = arguments[0];
				this._position = arguments[1];
				this._oldPosition = arguments[2];
				this._itemCount = arguments[3];
				this._itemUICount = arguments[4];
				
			}else if(arguments.length==4 ){
				this._action = arguments[0];
				this._position = arguments[1];
				this._oldPosition = new GeneratorPosition(-1, 0);
				this._itemCount = arguments[2];
				this._itemUICount = arguments[3];
			}
		}
	});
	
	Object.defineProperties(ItemsChangedEventArgs.prototype,{

        /// <summary> What happened </summary> 
//        public NotifyCollectionChangedAction 
        Action: { get:function() { return this._action; } },
 
        /// <summary> Where it happened </summary> 
//        public GeneratorPosition 
        Position: { get:function() { return this._position; } },
 
        /// <summary> Where it happened </summary>
//        public GeneratorPosition 
        OldPosition: { get:function() { return this._oldPosition; } },

        /// <summary> How many items were involved </summary> 
//        public int 
        ItemCount: { get:function() { return this._itemCount; } },
 
        /// <summary> How many UI elements were involved </summary> 
//        public int 
        ItemUICount: { get:function() { return this._itemUICount; } }
	});
	
	ItemsChangedEventArgs.Type = new Type("ItemsChangedEventArgs", ItemsChangedEventArgs, [EventArgs.Type]);
	return ItemsChangedEventArgs;
});

