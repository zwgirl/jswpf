/**
 * BlockUIContainer
 */

define(["dojo/_base/declare", "system/Type", "documents/Block"], 
		function(declare, Type, Block){
	var BlockUIContainer = declare("BlockUIContainer", Block,{
		constructor:function(/*UIElement*/ uiElement)
        {
			if(uiElement === undefined){
				uiElement = null;
			}
			
            if (uiElement != null) 
            { 
                this.Child = uiElement;
            } 
        },
        
        Arrange:function(parent /*DOM element*/){
           	this._dom = window.document.createElement('span');
        	for(var i=0; i<this.Inlines.Count; i++){
        		var inline = this.Inlines.Get(i);
        		inline.Arrange(this._dom);
        	}
			
        	parent.appendChild(this._dom);
        },
	});
	
	Object.defineProperties(BlockUIContainer.prototype,{
        /// <summary>
        /// The content spanned by this TextElement. 
        /// </summary> 
//        public UIElement 
		Child:
        { 
            get:function()
            {
                return this._child;
            }, 

            set:function(value) 
            { 
            	this._child = value; 
            	
            	LogicalTreeHelper.AddLogicalChild(this, value);
            }
        },
        
        /// <summary>
        /// Returns enumerator to logical children.
        /// </summary>
//        protected internal override IEnumerator 
        LogicalChildren: 
        {
            get:function() 
            { 
                return new SingleChildEnumerator(this._child);
            }
        },
	});
	
	BlockUIContainer.Type = new Type("BlockUIContainer", BlockUIContainer, [Block.Type]);
	return BlockUIContainer;
});



