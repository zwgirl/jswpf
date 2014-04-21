/**
 * Option
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Option = declare("Option", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("option");
		},
	});
	
	Object.defineProperties(Option.prototype, {
		Disabled:
		{
			get:function(){ return this.GetValue(Option.DisabledProperty);},
			set:function(value) {this.SetValue(Option.DisabledProperty, value); }
		},
		Label:
		{
			get:function(){ return this.GetValue(Option.LabelProperty);},
			set:function(value) {this.SetValue(Option.LabelProperty, value); }
		},
		Selected:
		{
			get:function(){ return this.GetValue(Option.SelectedProperty);},
			set:function(value) {this.SetValue(Option.SelectedProperty, value); }
		},
		Value:
		{
			get:function(){ return this.GetValue(Option.ValueProperty);},
			set:function(value) {this.SetValue(Option.ValueProperty, value); }
		},
	});
	
	Object.defineProperties(Option, {
//		disabled	disabled	规定此选项应在首次加载时被禁用。	4	5
//      public static readonly DependencyProperty 
		DisabledProperty:
		{
			get:function(){
				if(Option._DisabledProperty === undefined){
					Option._DisabledProperty= DependencyProperty.Register("Disabled", String.Type, Colgroup.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Option._DisabledProperty._domProp = "disabled";
				}
				return Option._DisabledProperty;
			}
		},
//		label	text	定义当使用 <optgroup> 时所使用的标注。	4	5
//      public static readonly DependencyProperty 
		LabelProperty:
		{
			get:function(){
				if(Option._LabelProperty === undefined){
					Option._LabelProperty= DependencyProperty.Register("Label", String.Type, Colgroup.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Option._LabelProperty._domProp = "label";
				}
				return Option._LabelProperty;
			}
		},
//		selected	selected	规定选项（在首次显示在列表中时）表现为选中状态。	4	5
//      public static readonly DependencyProperty 
		SelectedProperty:
		{
			get:function(){
				if(Option._SelectedProperty === undefined){
					Option._SelectedProperty= DependencyProperty.Register("Selected", String.Type, Colgroup.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Option._SelectedProperty._domProp = "selected";
				}
				return Option._SelectedProperty;
			}
		},
//		value	text	定义送往服务器的选项值。	4	5
//      public static readonly DependencyProperty 
		ValueProperty:
		{
			get:function(){
				if(Option._ValueProperty === undefined){
					Option._ValueProperty= DependencyProperty.Register("Value", String.Type, Colgroup.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Option._ValueProperty._domProp = "value";
				}
				return Option._ValueProperty;
			}
		},
	});
	
	Option.Type = new Type("Option", Option, [DOMElement.Type, IAddChild.Type]);
	return Option;
});