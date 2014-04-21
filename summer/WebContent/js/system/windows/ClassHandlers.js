/**
 * Second Check 12-17
 * from ClassHandlersStore
 * ClassHandlers
 */
//Stores ClassHandlers for the given RoutedEvent

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	// internal struct 
	var ClassHandlers = declare("ClassHandlers", Object,{
		constructor:function(){
//		    internal RoutedEvent RoutedEvent; 
//		    internal RoutedEventHandlerInfoList Handlers;
//		    internal bool HasSelfHandlers;
		},
	    /// <summary> 
	    ///     Serves as a hash function for a particular type, suitable for use in
	    ///     hashing algorithms and data structures like a hash table 
	    /// </summary>
//	    public override int 
		GetHashCode:function()
	    {
	        return Object.prototype.GetHashCode.call(this); 
	    },
	    /// <summary> 
	    ///     Is the given ClassHandlers struct equals the current 
	    /// </summary>
//	    public bool 
	    Equals:function(/*ClassHandlers*/ classHandlers) 
	    {
	    	if(!(classHandlers instanceof ClassHandlers)){
	    		return false;
	    	}
	        return (
	            classHandlers.RoutedEvent == this.RoutedEvent &&
	            classHandlers.Handlers == this.Handlers); 
	    }
	});
	
	Object.defineProperties(ClassHandlers.prototype,{
//        internal RoutedEvent 
        RoutedEvent:{
        	get:function(){
        		return this._routedEvent;
        	},
        	set:function(value){
        		this._routedEvent = value;
        	}
        },
//        internal RoutedEventHandlerInfoList 
        Handlers:
        {
        	get:function(){
        		return this._handlers;
        	},
        	set:function(value){
        		this._handlers = value;
        	}
        },
        
//        internal bool 
        HasSelfHandlers:
        {
        	get:function(){
        		return this._hasSelfHandlers;
        	},
        	set:function(value){
        		this._hasSelfHandlers = value;
        	}
        }
	});
	
	ClassHandlers.Type = new Type("ClassHandlers", ClassHandlers, [Object.Type]);
	return ClassHandlers;
});

