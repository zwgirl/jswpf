/**
 * RouteItem
 */

    // An item in the EventRoute 
    //
    // RouteItem constitutes 
    // the target object and 
    // list of RoutedEventHandlerInfo that need
    // to be invoked upon the target object
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var RouteItem = declare("RouteItem", null,{
		constructor:function(/*object*/ target, /*RoutedEventHandlerInfo*/ routedEventHandlerInfo) 
        { 
            this._target = target;
            this._routedEventHandlerInfo = routedEventHandlerInfo; 
        },
        
        // Invokes the associated RoutedEventHandler 
        // on the target object with the given
        // RoutedEventArgs 
//        internal void 
        InvokeHandler:function(/*RoutedEventArgs*/ routedEventArgs) 
        {
            this._routedEventHandlerInfo.InvokeHandler(this._target, routedEventArgs); 
        }
        
	});
	
	Object.defineProperties(RouteItem.prototype,{
        // Returns target 
//        internal object 
        Target:
        { 
            get:function() {return this._target;}
        }

	});
	
	RouteItem.Type = new Type("RouteItem", RouteItem, [Object.Type]);
	return RouteItem;
});


 
