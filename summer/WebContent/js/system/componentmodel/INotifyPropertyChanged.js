/**
 * INotifyPropertyChanged
 */

define(["dojo/_base/declare", "system/Type", "componentmodel/PropertyChangedEventHandler"], 
		function(declare, Type, PropertyChangedEventHandler){
	var INotifyPropertyChanged = declare("INotifyPropertyChanged", Object,{

	});
	
	Object.defineProperties(INotifyPropertyChanged.prototype,{
		PropertyChanged:{
			get:function(){
				if(this._propertyChanged == null){
					this._propertyChanged = new PropertyChangedEventHandler();
				}
				
				return this._propertyChanged;
			}
		}
	});
	
	INotifyPropertyChanged.Type = new Type("INotifyPropertyChanged", INotifyPropertyChanged, [Object.Type]);
	return INotifyPropertyChanged;
});
