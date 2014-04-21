/**
 * Input
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Input = declare("Input", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("input");
		},
	});
	
	Object.defineProperties(Input.prototype,{
		Accept:
		{
			get:function(){ return this.GetValue(Input.AcceptProperty);},
			set:function(value) {this.SetValue(Input.AcceptProperty, value); }
		},
		Alt:
		{
			get:function(){ return this.GetValue(Input.AltProperty);},
			set:function(value) {this.SetValue(Input.AltProperty, value); }
		},
		Autocomplete:
		{
			get:function(){ return this.GetValue(Input.AutocompleteProperty);},
			set:function(value) {this.SetValue(Input.AutocompleteProperty, value); }
		},
		Autofocus:
		{
			get:function(){ return this.GetValue(Input.AutofocusProperty);},
			set:function(value) {this.SetValue(Input.AutofocusProperty, value); }
		},
		Checked:
		{
			get:function(){ return this.GetValue(Input.CheckedProperty);},
			set:function(value) {this.SetValue(Input.CheckedProperty, value); }
		},
		Disabled:
		{
			get:function(){ return this.GetValue(Input.DisabledProperty);},
			set:function(value) {this.SetValue(Input.DisabledProperty, value); }
		},
		Form:
		{
			get:function(){ return this.GetValue(Input.FormProperty);},
			set:function(value) {this.SetValue(Input.FormProperty, value); }
		},
		Formaction:
		{
			get:function(){ return this.GetValue(Input.FormactionProperty);},
			set:function(value) {this.SetValue(Input.FormactionProperty, value); }
		},
		Formenctype:
		{
			get:function(){ return this.GetValue(Input.FormenctypeProperty);},
			set:function(value) {this.SetValue(Input.FormenctypeProperty, value); }
		},
		Formmethod:
		{
			get:function(){ return this.GetValue(Input.FormmethodProperty);},
			set:function(value) {this.SetValue(Input.FormmethodProperty, value); }
		},
		Formnovalidate:
		{
			get:function(){ return this.GetValue(Input.FormnovalidateProperty);},
			set:function(value) {this.SetValue(Input.FormnovalidateProperty, value); }
		},
		Formtarget:
		{
			get:function(){ return this.GetValue(Input.FormtargetProperty);},
			set:function(value) {this.SetValue(Input.FormtargetProperty, value); }
		},
		Height:
		{
			get:function(){ return this.GetValue(Input.HeightProperty);},
			set:function(value) {this.SetValue(Input.HeightProperty, value); }
		},
		List:
		{
			get:function(){ return this.GetValue(Input.ListProperty);},
			set:function(value) {this.SetValue(Input.ListProperty, value); }
		},
		Max:
		{
			get:function(){ return this.GetValue(Input.MaxProperty);},
			set:function(value) {this.SetValue(Input.MaxProperty, value); }
		},
		Maxlength:
		{
			get:function(){ return this.GetValue(Input.MaxlengthProperty);},
			set:function(value) {this.SetValue(Input.MaxlengthProperty, value); }
		},
		Min:
		{
			get:function(){ return this.GetValue(Input.MinProperty);},
			set:function(value) {this.SetValue(Input.MinProperty, value); }
		},
		Multiple:
		{
			get:function(){ return this.GetValue(Input.MultipleProperty);},
			set:function(value) {this.SetValue(Input.MultipleProperty, value); }
		},
		Name:
		{
			get:function(){ return this.GetValue(Input.NameProperty);},
			set:function(value) {this.SetValue(Input.NameProperty, value); }
		},
		Pattern:
		{
			get:function(){ return this.GetValue(Input.PatternProperty);},
			set:function(value) {this.SetValue(Input.PatternProperty, value); }
		},
		Placeholder:
		{
			get:function(){ return this.GetValue(Input.PlaceholderProperty);},
			set:function(value) {this.SetValue(Input.PlaceholderProperty, value); }
		},
		Readonly:
		{
			get:function(){ return this.GetValue(Input.ReadonlyProperty);},
			set:function(value) {this.SetValue(Input.ReadonlyProperty, value); }
		},
		
		Required:
		{
			get:function(){ return this.GetValue(Input.RequiredProperty);},
			set:function(value) {this.SetValue(Input.RequiredProperty, value); }
		},
		Size:
		{
			get:function(){ return this.GetValue(Input.SizeProperty);},
			set:function(value) {this.SetValue(Input.SizeProperty, value); }
		},
		Src:
		{
			get:function(){ return this.GetValue(Input.SrcProperty);},
			set:function(value) {this.SetValue(Input.SrcProperty, value); }
		},
		Step:
		{
			get:function(){ return this.GetValue(Input.StepProperty);},
			set:function(value) {this.SetValue(Input.StepProperty, value); }
		},
		Type:
		{
			get:function(){ return this.GetValue(Input.TypeProperty);},
			set:function(value) {this.SetValue(Input.TypeProperty, value); }
		},
		Value:
		{
			get:function(){ return this.GetValue(Input.ValueProperty);},
			set:function(value) {this.SetValue(Input.ValueProperty, value); }
		},
		Width:
		{
			get:function(){ return this.GetValue(Input.WidthProperty);},
			set:function(value) {this.SetValue(Input.WidthProperty, value); }
		},
	});
	
	Object.defineProperties(Input,{
//		accept	list_of_mime_types 规定可通过文件上传控件提交的文件类型。 （仅适用于 type="file"）
//      public static readonly DependencyProperty 
		AcceptProperty:
		{
			get:function(){
				if(Input._AcceptProperty === undefined){
					Input._AcceptProperty= DependencyProperty.Register("Accept", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._AcceptProperty._domProp = "accept";
				}
				return Input._AcceptProperty;
			}
		},
//		alt	tex 规定图像输入控件的替代文本。 （仅适用于 type="image"）
//      public static readonly DependencyProperty 
		AltProperty:
		{
			get:function(){
				if(Input._AltProperty === undefined){
					Input._AltProperty= DependencyProperty.Register("Alt", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._AltProperty._domProp = "alt";
				}
				return Input._AltProperty;
			}
		},
//		autocomplete	 on off  规定是否使用输入字段的自动完成功能。
//      public static readonly DependencyProperty 
		AutocompleteProperty:
		{
			get:function(){
				if(Input._AutocompleteProperty === undefined){
					Input._AutocompleteProperty= DependencyProperty.Register("Autocomplete", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._AutocompleteProperty._domProp = "autocomplete";
				}
				return Input._AutocompleteProperty;
			}
		},
//		autofocus	autofocus	 规定输入字段在页面加载时是否获得焦点。 （不适用于 type="hidden"）
//      public static readonly DependencyProperty 
		AutofocusProperty:
		{
			get:function(){
				if(Input._AutofocusProperty === undefined){
					Input._AutofocusProperty= DependencyProperty.Register("Autofocus", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._AutofocusProperty._domProp = "autofocus";
				}
				return Input._AutofocusProperty;
			}
		},
//		checked	checked	 规定当页面加载时是否预先选择该 input 元素。 （适用于 type="checkbox" 或 type="radio"）
//      public static readonly DependencyProperty 
		CheckedProperty:
		{
			get:function(){
				if(Input._CheckedProperty === undefined){
					Input._CheckedProperty= DependencyProperty.Register("Checked", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._CheckedProperty._domProp = "checked";
				}
				return Input._CheckedProperty;
			}
		},
//		disabled	disabled 规定当页面加载时是否禁用该 input 元素。 （不适用于 type="hidden"）
//      public static readonly DependencyProperty 
		DisabledProperty:
		{
			get:function(){
				if(Input._DisabledProperty === undefined){
					Input._DisabledProperty= DependencyProperty.Register("Disabled", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._DisabledProperty._domProp = "disabled";
				}
				return Input._DisabledProperty;
			}
		},

//		form	formname	规定输入字段所属的一个或多个表单。 
//      public static readonly DependencyProperty 
		FormProperty:
		{
			get:function(){
				if(Input._FormProperty === undefined){
					Input._FormProperty= DependencyProperty.Register("Form", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._FormProperty._domProp = "form";
				}
				return Input._FormProperty;
			}
		},
//		formaction	URL	 覆盖表单的 action 属性。 （适用于 type="submit" 和 type="image"）
//      public static readonly DependencyProperty 
		FormactionProperty:
		{
			get:function(){
				if(Input._FormactionProperty === undefined){
					Input._FormactionProperty= DependencyProperty.Register("Formaction", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._FormactionProperty._domProp = "formaction";
				}
				return Input._FormactionProperty;
			}
		},
//		formenctype	见注释	 覆盖表单的 enctype 属性。 （适用于 type="submit" 和 type="image"）
//      public static readonly DependencyProperty 
		FormenctypeProperty:
		{
			get:function(){
				if(Input._FormenctypeProperty === undefined){
					Input._FormenctypeProperty= DependencyProperty.Register("Formenctype", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._FormenctypeProperty._domProp = "formenctype";
				}
				return Input._FormenctypeProperty;
			}
		},
//		formmethod	 get| post  覆盖表单的 method 属性。 （适用于 type="submit" 和 type="image"）
//      public static readonly DependencyProperty 
		FormmethodProperty:
		{
			get:function(){
				if(Input._FormmethodProperty === undefined){
					Input._FormmethodProperty= DependencyProperty.Register("Formmethod", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._FormmethodProperty._domProp = "formmethod";
				}
				return Input._FormmethodProperty;
			}
		},
//		formnovalidate	formnovalidate	 覆盖表单的 novalidate 属性。 如果使用该属性，则提交表单时不进行验证。
//      public static readonly DependencyProperty 
		FormnovalidateProperty:
		{
			get:function(){
				if(Input._FormnovalidateProperty === undefined){
					Input._FormnovalidateProperty= DependencyProperty.Register("Formnovalidate", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._FormnovalidateProperty._domProp = "formnovalidate";
				}
				return Input._FormnovalidateProperty;
			}
		},
//		formtarget	_blank|_self|_top |framename 覆盖表单的 target 属性。（适用于 type="submit" 和 type="image"）
//      public static readonly DependencyProperty 
		FormtargetProperty:
		{
			get:function(){
				if(Input._FormtargetProperty === undefined){
					Input._FormtargetProperty= DependencyProperty.Register("Formtarget", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._FormtargetProperty._domProp = "formtarget";
				}
				return Input._FormtargetProperty;
			}
		},
//		height	 pixels % 定义 input 字段的高度。（适用于 type="image"）
//      public static readonly DependencyProperty 
		HeightProperty:
		{
			get:function(){
				if(Input._HeightProperty === undefined){
					Input._HeightProperty= DependencyProperty.Register("Height", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._HeightProperty._domProp = "height";
				}
				return Input._HeightProperty;
			}
		},
//		list	datalist-id	引用包含输入字段的预定义选项的 datalist 。
//      public static readonly DependencyProperty 
		ListProperty:
		{
			get:function(){
				if(Input._ListProperty === undefined){
					Input._ListProperty= DependencyProperty.Register("List", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._ListProperty._domProp = "list";
				}
				return Input._ListProperty;
			}
		},
//		max	 number date 规定输入字段的最大值。 请与 "min" 属性配合使用，来创建合法值的范围。 
//      public static readonly DependencyProperty 
		MaxProperty:
		{
			get:function(){
				if(Input._MaxProperty === undefined){
					Input._MaxProperty= DependencyProperty.Register("Max", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._MaxProperty._domProp = "max";
				}
				return Input._MaxProperty;
			}
		},
		
//		maxlength	number	规定文本字段中允许的最大字符数。
//      public static readonly DependencyProperty 
		MaxlengthProperty:
		{
			get:function(){
				if(Input._MaxlengthProperty === undefined){
					Input._MaxlengthProperty= DependencyProperty.Register("Maxlength", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._MaxlengthProperty._domProp = "maxlength";
				}
				return Input._MaxlengthProperty;
			}
		},
//		min	 number date 规定输入字段的最小值。 请与 "max" 属性配合使用，来创建合法值的范围。
//      public static readonly DependencyProperty 
		MinProperty:
		{
			get:function(){
				if(Input._MinProperty === undefined){
					Input._MinProperty= DependencyProperty.Register("Min", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._MinProperty._domProp = "min";
				}
				return Input._MinProperty;
			}
		},
//		multiple	multiple	如果使用该属性，则允许一个以上的值。
//      public static readonly DependencyProperty 
		MultipleProperty:
		{
			get:function(){
				if(Input._MultipleProperty === undefined){
					Input._MultipleProperty= DependencyProperty.Register("Multiple", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._MultipleProperty._domProp = "multiple";
				}
				return Input._MultipleProperty;
			}
		},
//		name	field_name 规定 input 元素的名称。 name 属性用于在提交表单时搜集字段的值。
//      public static readonly DependencyProperty 
		NameProperty:
		{
			get:function(){
				if(Input._NameProperty === undefined){
					Input._NameProperty= DependencyProperty.Register("Name", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._NameProperty._domProp = "name";
				}
				return Input._NameProperty;
			}
		},
//		pattern	regexp_pattern	 规定输入字段的值的模式或格式。 例如 pattern="[0-9]" 表示输入值必须是 0 与 9 之间的数字。
//      public static readonly DependencyProperty 
		PatternProperty:
		{
			get:function(){
				if(Input._PatternProperty === undefined){
					Input._PatternProperty= DependencyProperty.Register("Pattern", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._PatternProperty._domProp = "pattern";
				}
				return Input._PatternProperty;
			}
		},
//		placeholder	text	规定帮助用户填写输入字段的提示。
//      public static readonly DependencyProperty 
		PlaceholderProperty:
		{
			get:function(){
				if(Input._PlaceholderProperty === undefined){
					Input._PlaceholderProperty= DependencyProperty.Register("Placeholder", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._PlaceholderProperty._domProp = "placeholder";
				}
				return Input._PlaceholderProperty;
			}
		},
//		readonly	readonly	指示字段的值无法修改。
//      public static readonly DependencyProperty 
		ReadonlyProperty:
		{
			get:function(){
				if(Input._ReadonlyProperty === undefined){
					Input._ReadonlyProperty= DependencyProperty.Register("Readonly", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._ReadonlyProperty._domProp = "readonly";
				}
				return Input._ReadonlyProperty;
			}
		},
//		required	required	指示输入字段的值是必需的。
//      public static readonly DependencyProperty 
		RequiredProperty:
		{
			get:function(){
				if(Input._RequiredProperty === undefined){
					Input._RequiredProperty= DependencyProperty.Register("Required", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._RequiredProperty._domProp = "required";
				}
				return Input._RequiredProperty;
			}
		},
//		size	number_of_char	规定输入字段中的可见字符数。
//      public static readonly DependencyProperty 
		SizeProperty:
		{
			get:function(){
				if(Input._SizeProperty === undefined){
					Input._SizeProperty= DependencyProperty.Register("Size", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._SizeProperty._domProp = "size";
				}
				return Input._SizeProperty;
			}
		},
//		src	URL	规定图像的 URL。（适用于 type="image"）
//      public static readonly DependencyProperty 
		SrcProperty:
		{
			get:function(){
				if(Input._SrcProperty === undefined){
					Input._SrcProperty= DependencyProperty.Register("Src", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._SrcProperty._domProp = "src";
				}
				return Input._SrcProperty;
			}
		},
//		step	number	规定输入字的的合法数字间隔。
//      public static readonly DependencyProperty 
		StepProperty:
		{
			get:function(){
				if(Input._StepProperty === undefined){
					Input._StepProperty= DependencyProperty.Register("Step", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._StepProperty._domProp = "step";
				}
				return Input._StepProperty;
			}
		},
//		type	button|checkbox|date|datetime|datetime-local|email|file|hidden|image|month|number|password
//		radio|range|reset|submit|text|time|url|week 规定 input 元素的类型。
//      public static readonly DependencyProperty 
		TypeProperty:
		{
			get:function(){
				if(Input._TypeProperty === undefined){
					Input._TypeProperty= DependencyProperty.Register("Type", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._TypeProperty._domProp = "type";
				}
				return Input._TypeProperty;
			}
		},
//		value	value	 对于按钮：规定按钮上的文本 对于图像按钮：传递到脚本的字段的符号结果 对于复选框和单选按钮：定义 input 元素被点击时的结果。 对于隐藏、密码和文本字段：规定元素的默认值。 注释：不能与 type="file" 一同使用。
//		注释：对于 type="checkbox" 以及 type="radio"，是必需的。
//      public static readonly DependencyProperty 
		ValueProperty:
		{
			get:function(){
				if(Input._ValueProperty === undefined){
					Input._ValueProperty= DependencyProperty.Register("Value", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._ValueProperty._domProp = "value";
				}
				return Input._ValueProperty;
			}
		},
//		width	 pixels % 定义 input 字段的宽度。（适用于 type="image"）
//      public static readonly DependencyProperty 
		WidthProperty:
		{
			get:function(){
				if(Input._WidthProperty === undefined){
					Input._WidthProperty= DependencyProperty.Register("Width", String.Type, Input.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Input._WidthProperty._domProp = "width";
				}
				return Input._WidthProperty;
			}
		},
	});
	
	Input.Type = new Type("Input", Input, [DOMElement.Type, IAddChild.Type]);
	return Input;
});