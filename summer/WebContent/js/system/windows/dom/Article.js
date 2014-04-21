/**
 * Article
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Article = declare("Article", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("article");
		},
	});
	
	Object.defineProperties(Article.prototype,{
	});
	
	Article.Type = new Type("Article", Article, [DOMElement.Type, IAddChild.Type]);
	return Article;
});

 