/**
 * LineBreak
 */

define(["dojo/_base/declare", "system/Type", "documents/Inline"], 
		function(declare, Type, Inline){
	var LineBreak = declare("LineBreak", Inline,{
		constructor:function()
        {
			this._dom = window.document.createElement('br');
        },
        
        Arrange:function(parent /*DOM element*/){
           	
			
//        	parent.appendChild(this._dom);
        }
	});
	
	LineBreak.Type = new Type("LineBreak", LineBreak, [Inline.Type]);
	return LineBreak;
});
