/**
 * Progress
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Progress = declare("Progress", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("progress");
		},
	});
	
	Object.defineProperties(Progress.prototype, {
		Max:
		{
			get:function(){ return this.GetValue(Progress.MaxProperty);},
			set:function(value) {this.SetValue(Progress.MaxProperty, value); }
		},
		Value:
		{
			get:function(){ return this.GetValue(Progress.ValueProperty);},
			set:function(value) {this.SetValue(Progress.ValueProperty, value); }
		},
	});
	
	Object.defineProperties(Progress, {
//		max	number
//      public static readonly DependencyProperty 
		MaxProperty:
		{
			get:function(){
				if(Progress._MaxProperty === undefined){
					Progress._MaxProperty= DependencyProperty.Register("Max", String.Type, Progress.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Progress._MaxProperty._domProp = "max";
				}
				return Progress._MaxProperty;
			}
		},
//		value	number
//      public static readonly DependencyProperty 
		ValueProperty:
		{
			get:function(){
				if(Progress._ValueProperty === undefined){
					Progress._ValueProperty= DependencyProperty.Register("Value", String.Type, Progress.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Progress._ValueProperty._domProp = "value";
				}
				return Progress._ValueProperty;
			}
		},
	});
	
	Progress.Type = new Type("Progress", Progress, [DOMElement.Type, IAddChild.Type]);
	return Progress;
});