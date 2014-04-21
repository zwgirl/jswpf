/**
 * EmptyEnumerator
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerator"], function(declare, Type, IEnumerator){
	var EmptyEnumerator = declare("EmptyEnumerator", IEnumerator, {
        /// <summary> 
        /// Does nothing.
        /// </summary> 
//        public void 
        Reset:function() { },

        /// <summary>
        /// Returns false. 
        /// </summary>
        /// <returns>false</returns> 
//        public bool 
        MoveNext:function() { return false; } 
	});
	
	Object.defineProperties(EmptyEnumerator.prototype,{
        /// Returns null. 
//        public object 
        Current: 
        { 
            get:function()
            {
                throw new InvalidOperationException();
            }
        } 

	});
	
	Object.defineProperties(EmptyEnumerator, {
		  
	     /// Read-Only instance of an Empty Enumerator.
//			public static IEnumerator 
			Instance: 
			{
				get:function() 
		         { 
		             if (EmptyEnumerator._instance === undefined)
		             { 
		            	 EmptyEnumerator._instance = new EmptyEnumerator();
		             }
		             return EmptyEnumerator._instance;
		         } 
		    }

		});
	
	EmptyEnumerator.Type = new Type("EmptyEnumerator", EmptyEnumerator, [IEnumerator.Type]);
	return EmptyEnumerator;
});


