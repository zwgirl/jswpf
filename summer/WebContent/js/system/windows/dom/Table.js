/**
 * Table
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Table = declare("Table", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("table");
		},
	});
	
	Object.defineProperties(Table.prototype,{
		Border:
		{
			get:function(){ return this.GetValue(Table.BorderProperty);},
			set:function(value) {this.SetValue(Table.BorderProperty, value); }
		},
	});
	
	Object.defineProperties(Table,{
//		border	 "" 1
//      public static readonly DependencyProperty 
		BorderProperty:
		{
			get:function(){
				if(Table._BorderProperty === undefined){
					Table._BorderProperty= DependencyProperty.Register("Border", String.Type, Table.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Table._BorderProperty._domProp = "border";
				}
				return Table._BorderProperty;
			}
		},
	});
	
	Table.Type = new Type("Table", Table, [DOMElement.Type, IAddChild.Type]);
	return Table;
});