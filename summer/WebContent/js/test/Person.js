define(["dojo/_base/declare", "system/Type", "componentmodel/INotifyPropertyChanged", "componentmodel/PropertyChangedEventArgs"], 
		function(declare, Type, INotifyPropertyChangedk, PropertyChangedEventArgs){
	
	var Person = declare("Person", INotifyPropertyChanged, {
		constructor:function(name, sex, age){
			this._name = name;
			this._sex = sex;
			this._age = age;
		}
	});
	
	Object.defineProperties(Person.prototype, {
		Name:{
			get:function(){
				return this._name;
			},
			set:function(value)
			{
				var oldValue = this._name;
				this._name = value;
				if(oldValue !=value){
					if(this._propertyChanged!==undefined){
						this._propertyChanged.Invoke(this, new PropertyChangedEventArgs("Name"));
					}
				}
			}
		},
		
		Sex:{
			get:function(){
				return this._sex;
			},
			set:function(value)
			{
				var oldValue = this._sex;
				this._sex = value;
				if(oldValue !=value){
					if(this._propertyChanged!==undefined){
						this._propertyChanged.Invoke(this, new PropertyChangedEventArgs("Sex"));
					}
				}
			}
		},
		
		Age:{
			get:function(){
				return this._age;
			},
			set:function(value)
			{
				var oldValue = this._age;
				this._age = value;
				if(oldValue !=value){
					if(this._propertyChanged!==undefined){
						this._propertyChanged.Invoke(this, new PropertyChangedEventArgs("Age"));
					}
				}
			}
		},
		
		PropertyChanged:
		{
			get:function(){
				if(this._propertyChanged===undefined){
					this._propertyChanged = new PropertyChangedEventHandler();
				}
				
				return this._propertyChanged;
			}	
		}
	});
	
	
	
	Person.Type = new Type("Person", Person, [INotifyPropertyChanged.Type]);
	
	return Person;
});