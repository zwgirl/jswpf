define(["dojo/_base/declare"],  function(declare) {
	var EntryIndex = deflare(null,{
		  
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 && arguments[0].constructor == Number){
				this._store = arguments[0] | 0x80000000;
			}else if(arguments.length==1 && arguments[0].constructor == Number && arguments[1].constructor==Boolean){
				this._store = arguments[0] & 0x7FFFFFFF;
				if (arguments[1]){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
		}
	});
	
	Object.defineProperties(EntryIndex.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	return EntryIndex;
});