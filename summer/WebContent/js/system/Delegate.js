/**
 * Delegate
 */
define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var Delegate = declare("Delegate", Object, {
		constructor: function(type, method){
			if(arguments.length==2){
				this._target=type;
				this._method=method;
			}
			
			this._invocationList =[];
		},
		
		Invoke:function( ){
			if(this.Method !== undefined && this.Method != null){
				this.Method.apply(this.Target, arguments);
			}

			if(this._invocationList == null){
				return;
			}
			for(var i =0; i<this._invocationList.length; i++){
				this._invocationList[i].Invoke.apply(this._invocationList[i], arguments);
			}
		},
		
		Call:function(){
			if(this.Method !== undefined && this.Method != null){
				return this.Method.apply(this.Target, arguments);
			}
			
			return null;
		},
		
		GetInvocationList:function(){
			return this._invocationList;
		},
		
	    Combine:function(/*Delegate*/ follow)
	    {
            if (follow == null) // cast to object for a more efficient test
                return this;
 
            this._invocationList.push(follow);
            return this;
        },
  
//      protected /*override*/ /*sealed*/ Delegate 
        Remove:function(/*Delegate*/ value)
        {
//	        var index= this._invocationList.indexOf(value);
//	        if(index!= -1){
//	        	this._invocationList.splice(index, 1);
//	        }
        	var toBeRemove =-1;
        	for(var i=0, count=this._invocationList.length; i<count; i++ ){
        		if(this._invocationList[i].Target ==value.Target ){
        			if(this._invocationList[i].Method == value.Method){
        				toBeRemove = i;
        				break;
        			}
        		}
        	}
        	
        	if(toBeRemove > -1){
        		this._invocationList.splice(toBeRemove, 1);
        	}
  
            return this;
        }
	});	
	
	Delegate.Remove = function(/*Delegate*/ source, /*Delegate*/ value){
        if (source == null) 
            return null;

        if (value == null) 
            return source;

        return source.Remove(value); 
    };

    Delegate.Combine = function(/*Delegate*/ a, /*Delegate*/ b)
    {
        // boundry conditions -- if either (or both) delegates is null
        //      return the other.
        if (a == null) // cast to Object for a more efficient test
            return b;
        if (b == null) // cast to Object for a more efficient test
            return a;

        return  a.Combine(b);
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
	
	Delegate.Type = new Type("Delegate", Delegate, [Object.Type]);
	return Delegate;
	
});
