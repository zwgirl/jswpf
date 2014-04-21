define(["dojo/_base/declare","test/ClassB"], function(declare, ClassB){
	var ClassC = declare(ClassB,{
		constructor:function(name,age,sex){
			this.sex= sex;
			ClassB.prototype.constructor.call(this, name,age,sex);
		},
		
		sayHello1:function(name){
			ClassB.prototype.sayHello1.call(this, name);
			
		}
	});
	
	Object.defineProperties(ClassC.prototype,{
	});
	
	return ClassC;
});