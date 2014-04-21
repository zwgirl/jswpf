/**
 * IList
 */

define(["dojo/_base/declare", "system/Type",
        "collections/IEnumerable", "collections/ICollection"], 
        function(declare, Type,
        		IEnumerable, ICollection){
	var IList = declare("IList", [ICollection, IEnumerable],{
		Set:function(index, value){
			
		},
		Get:function(index){
			
		},
		
//		int 
		Add:function(/*object*/ value){
			
		},
//		bool 
		Contains:function(/*object*/ value){
			
		},
//		void 
		Clear:function(){
			
		},
//		int 
		IndexOf:function(/*object*/ value){
			
		},
//		void 
		Insert:function(/*int*/ index, /*object*/ value){
			
		},
//		void 
		Remove:function(/*object*/ value){
			
		},
//		void 
		RemoveAt:function(/*int*/ index){
			
		}
	});
	
	Object.defineProperties(IList.prototype,{
//		bool 
		IsReadOnly:
		{
			get:function(){
				
			}
		},
//		bool 
		IsFixedSize:
		{
			get:function(){
				
			}
		}
	});
	
	IList.Type = new Type("IList", IList, [ICollection.Type, IEnumerable.Type], true);
	return IList;
});
