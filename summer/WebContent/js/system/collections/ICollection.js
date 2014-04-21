/**
 * ICollection
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerable"], 
		function(declare, Type, IEnumerable){
	var ICollection = declare("ICollection", IEnumerable, {
//		void 
		CopyTo:function(/*Array*/ array, /*int*/ index){
			
		}
	});
	
	Object.defineProperties(ICollection.prototype,{
		/*int*/ Count:
		{
			get:function(){
				
			}
		},
		/*object*/ SyncRoot:
		{
			get:function(){
				
			}
		},
		/*bool*/ IsSynchronized:
		{
			get:function(){
				
			}
		}
	});
	
	ICollection.Type = new Type("ICollection", ICollection, [IEnumerable.Type], true);
	return ICollection;
});
