/**
 * Delegate
 */
define("",["dojo/_base/declare"], 
		function(declare){
	var Delegate = declare(null, {
		constructor: function(handler){
			if(handler!=null && handler!=undefined){
				this.AddHandler(handler);
			}
		},
		
        DynamicInvoke:function(args) 
        { 
            // Theoretically we should set up a LookForMyCaller stack mark here and pass that along.
            // But to maintain backward compatibility we can't switch to calling an 
            // internal overload of DynamicInvokeImpl that takes a stack mark.
            // Fortunately the stack walker skips all the reflection invocation frames including this one.
            // So this method will never be returned by the stack walker as the caller.
            // See SystemDomain::CallersMethodCallbackWithStackMark in AppDomain.cpp. 
            return this.DynamicInvokeImpl(args);
        },
 
        DynamicInvokeImpl:function( args) 
        {
        	this.Notify(args);
        }, 

		AddHandler: function(){
			if(arguments.length==0 || arguments.length>2){
				throw Error("parameter count illegal!");
			}
			if(arguments[0] instanceof Delegate){
				this._handlers.push(arguments[0]);
			}else{
				this._handlers.push(Delegate.CreateDelegate(arguments));
			}
		},
		RemoveHandler:function(handler){
			if(handler instanceof Delegate){
				for(var i in this._handlers){
					if(this._handlers[i]===handler){
						this._handlers.splice(i,1);
					}
				}
			}else if(handler instanceof Function){
				for(var i in this._handlers){
					if(this._handlers[i]===handler){
						this._handlers.splice(i,1);
					}
				}
			}

		},
		Invoke:function( ){
			this.Method.apply(this.Target, arguments);
			
			if(this._handlers!=undefined ){
				for(var i in this._handlers){
					var handler=this._handlers[i];
					handler.Invoke(arguments);
				}
			}
		},
		
		GetInvocationList:function(){
			return this._handlers.slice();
		}
	});	
	
	Delegate.Combine = function(){
		
	};
	
	public static Delegate Combine(Delegate a, Delegate b);
	
	Delegate.Remove(/*Delegate*/ source, /*Delegate*/ value)
    {
        if (source == null) 
            return null;

        if (value == null) 
            return source;

        if (!(value instanceof source))
            throw new Error("ArgumentException(Environment.GetResourceString('Arg_DlgtTypeMis')");

        return source.RemoveImpl(value); 
    };

    Delegate.RemoveAll=function(/*Delegate*/ source, /*Delegate*/ value) 
    {
        Delegate newDelegate = null; 

        do
        {
            newDelegate = source; 
            source = Remove(source, value);
        } 
        while (newDelegate != source); 

        return newDelegate; 
    };
    
	Object.defineProperties(Delegate.prototype,{
		  
		Target:
		{
			get:function() { return this._target; }
		},
		 
		Method:
		{
			get:function() { return this._method; }
		}
	});
	
	return Delegate;
	
});




