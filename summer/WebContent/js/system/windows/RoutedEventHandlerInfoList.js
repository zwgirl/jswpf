 /**
  * Second check 1013-12-14
 * RoutedEventHandlerInfoList
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var RoutedEventHandlerInfoList = declare("RoutedEventHandlerInfoList", null,{
//        internal bool 
        Contains:function(/*RoutedEventHandlerInfoList*/ handlers) 
        {
            /*RoutedEventHandlerInfoList*/var tempHandlers = this; 
            while (tempHandlers != null)
            {
                if (tempHandlers == handlers)
                { 
                    return true;
                } 
 
                tempHandlers = tempHandlers.Next;
            } 

            return false;
        }
	});
	
	Object.defineProperties(RoutedEventHandlerInfoList.prototype,{
		  
//        internal RoutedEventHandlerInfo[] 
        Handlers:
        {
        	get:function(){
        		return this._handlers;
        	},
        	set:function(value){
        		this._handlers = value;
        	}
        },
//        internal RoutedEventHandlerInfoList 
        Next:
        {
        	get:function(){
        		return this._next;
        	},
        	set:function(value){
        		this._next = value;
        	}
        }
 
	});
	
	RoutedEventHandlerInfoList.Type = new Type("RoutedEventHandlerInfoList", RoutedEventHandlerInfoList, [Object.Type]);
	return RoutedEventHandlerInfoList;
});
