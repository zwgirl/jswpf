/**
 * InlineUIContainer
 */

define(["dojo/_base/declare", "system/Type", "documents/Inline"], 
		function(declare, Type, Inline){
	var InlineUIContainer = declare("InlineUIContainer", Inline,{
		constructor:function(/*UIElement*/ childUIElement)
        {
			if(childUIElement === undefined){
				childUIElement = null;
			}

            this.Child = childUIElement; 
            
            this._dom = window.document.createElement('span');
        },
        
        Arrange:function(parent /*DOM element*/){
           	
           	this.Child.Measure();
           	this.Child.Arrange(this._dom);
           	this._dom.appendChild(this.Child._dom);
			
//        	parent.appendChild(this._dom);
        }
	});
	
	Object.defineProperties(InlineUIContainer.prototype,{
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
            	if(this._child != null && this._child != value){
            		LogicalTreeHelper.RemoveLogicalChild(this, this._child);
            	}
            	
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
	
	InlineUIContainer.Type = new Type("InlineUIContainer", InlineUIContainer, [Inline.Type]);
	return InlineUIContainer;
});


