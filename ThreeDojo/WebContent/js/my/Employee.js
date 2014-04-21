define(["dojo/_base/declare", "my/DependencyProperty", "my/DependencyObject"], 
		function(declare, DependencyProperty, DependencyObject){
  var Employee = declare(DependencyObject, {
    constructor: function(name, age, residence, salary){
      this.name=name;
      this.age=age;
      this.residence=residence;
      
    },

    ttt:function(){
    	return this.name;
    },


    askForRaise: function(){
      return this.age  +  this.ttt();
    }
  });
  
  Employee.prototype.nameProperty=DependencyProperty.Register(/*String*/ "name", /*Type*/ "propertyType", /*Type*/ "ownerType", 
			/*PropertyMetadata*/ "typeMetadata", /*ValidateValueCallback*/ "validateValueCallback");
  Employee.prototype.ageProperty=DependencyProperty.Register(/*String*/ "age", /*Type*/ "propertyType", /*Type*/ "ownerType", 
			/*PropertyMetadata*/ "typeMetadata", /*ValidateValueCallback*/ "validateValueCallback");
  Employee.prototype.residenceProperty=	DependencyProperty.Register(/*String*/ "residence", /*Type*/ "propertyType", /*Type*/ "ownerType", 
					/*PropertyMetadata*/ "typeMetadata", /*ValidateValueCallback*/ "validateValueCallback");
  
  Object.defineProperties(Employee.prototype, {
      name : 
      	{ get:function(){
      		return this.getValue(this.nameProperty);
      		},
      	  set:function(value){
      		this.setValue(this.nameProperty,value);
      	  }
      	},
      	age : 
      	{ get:function(){
      		return this.getValue(this.ageProperty);
      		},
      	  set:function(value){
      		this.setValue(this.ageProperty,value);
      	  }
      	},
      	residence : 
      	{ get:function(){
      		return this.getValue(this.residenceProperty);
      		},
      	  set:function(value){
      		this.setValue(this.residenceProperty,value);
      	  }
      	},
  	});
  
  return Employee;
});