define(["dojo/_base/declare","my/SuperA", "my/ClassC"], function(declare, SuperA, ClassC){
var ClassB = declare(SuperA,{
//    "-chains-": {
//        constructor: "manual"
//      },
      
		constructor:function(agx,sex){
			console.log("constructor of ClassB ");
//			var superCtos=this.getInherited(arguments);
//			superCtos(arguments, [sex]);
		},
		
		sayHello1:function(name){
			console.log("I' m ClassB.sayHello()" + name);
			
//			 this.inherited(arguments);
		}
	});
	
//	ClassB.prototype.sayHello=function(){
//		console.log("I' m ClassB.sayHello()");
//		
//		 this.inherited(arguments);
//	};
	
	Object.defineProperties(ClassB.prototype,{
		ClassB:{
			get:function(){
				console.log("execute here : Name get");
				return this.classB;
			},
			set:function(value){
				console.log("execute here : Name set");
				this.classB=value;
			}
		}
	});
	
	return ClassB;
});