/**
 * from itemsControl
 * ItemNavigateArgs
 */
define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	//    internal class 
    var ItemNavigateArgs = declare("ItemNavigateArgs", null, {
    	constructor:function(/*InputDevice*/ deviceUsed, /*ModifierKeys*/ modifierKeys)
        {
            this._deviceUsed = deviceUsed;
            this._modifierKeys = modifierKeys; 
        }
    });
    
    Object.defineProperties(ItemNavigateArgs.prototype, {
//    	public InputDevice 
    	DeviceUsed: { get:function() { return this._deviceUsed; } } 
    });
    
    Object.defineProperties(ItemNavigateArgs, {
//        public static ItemNavigateArgs 
        Empty:
        { 
            get:function()
            { 
                if (this._empty == null) 
                {
                	this._empty = new ItemNavigateArgs(null, ModifierKeys.None);; 
                }
                return this._empty;
            }
        } 
    });
    
    ItemNavigateArgs.Type = new Type("ItemNavigateArgs", ItemNavigateArgs, [Object.Type]);
    return ItemNavigateArgs;
});