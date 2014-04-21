define(["dojo/_base/declare", "my/ClassC"], function(declare, ClassC){
/*	var Enum = {
		a:1,
		b:2,
		c:3
	};*/
	
	var SuperA = declare(null,{
		Enum : {
				a:1,
				b:2,
				c:3
			},
		constructor:function(found){
			console.log("superA constructor : " + found);
			this._found1 = found;
		},
		
		sayHello1:function(name){
			console.log("I' m SuperA.sayHello()" + name);
		}
	});

//	SuperA.prototype.sayHello=function(){
//		console.log("I' m SuperA.sayHello()");
//	};
	
	Object.defineProperties(SuperA.prototype,{
		Name:{
			get:function(){
				console.log("execute here : Name get");
				return this.name;
			},
			set:function(value){
				console.log("execute here : Name set");
				this.name=value;
			}
		}
	});
	
	return SuperA;
});