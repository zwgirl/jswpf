define(["dojo/_base/declare","my/ClassB"], function(declare, ClassB){
	var ClassC = declare(ClassB,{
//	    "-chains-": {
//	        constructor: "manual"
//	      },
	      
		constructor:function(name,age,sex){
			console.log("constructor of ClassC ");
			
			var superCtos=this.getInherited(arguments);
			superCtos(arguments, [age, sex]);
		},
		
		sayHello1:function(name){
			console.log("I' m ClassC.sayHello()" + name);
			
//			 this.inherited(arguments);
		}
	});
	
//	ClassC.prototype.sayHello=function(){
//		console.log("I' m ClassC.sayHello()");
//		
//		 this.inherited(arguments);
//	};
	
	Object.defineProperties(ClassC.prototype,{
		ClassC:{
			get:function(){
				console.log("execute here : Name get");
				return this.classC;
			},
			set:function(value){
				console.log("execute here : Name set");
				this.classC=value;
			}
		}
	});
	
	return ClassC;
});