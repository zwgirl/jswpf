/**
 * EmptyEnumerable
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerable", "internal.controls/EmptyEnumerator"], 
		function(declare, Type, IEnumerable, EmptyEnumerator){
	var EmptyEnumerable = declare("EmptyEnumerable", IEnumerable,{
//        IEnumerator IEnumerable.
        GetEnumerator:function()
        {
            return EmptyEnumerator.Instance;
        } 
	});
	
	Object.defineProperties(EmptyEnumerable,{
//        public static IEnumerable 
        Instance:
        {
            get:function()
            {
                if (EmptyEnumerable._instance == null) 
                {
                	EmptyEnumerable._instance = new EmptyEnumerable(); 
                } 
                return EmptyEnumerable._instance;
            } 
        }
	});
	
	EmptyEnumerable.Type = new Type("EmptyEnumerable", EmptyEnumerable, [IEnumerable.Type]);
	return EmptyEnumerable;
});

