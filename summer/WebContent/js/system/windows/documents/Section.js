/**
 * Section
 */

define(["dojo/_base/declare", "system/Type", "documents/Block", "documents/TextElementCollection"], 
		function(declare, Type, Block, TextElementCollection){
	
	var Section = declare("Section", Block,{
		constructor:function(/*Block*/ block)
        { 
			if(block === undefined){
				block =null;
			}
			
            if (block == null)
            { 
                throw new ArgumentNullException("block");
            }

            this.Blocks.Add(block); 
        },
        
        Arrange:function(parent /*DOM element*/){
           	this._dom = window.document.createElement('span');
        	for(var i=0; i<this.Inlines.Count; i++){
        		var inline = this.Inlines.Get(i);
        		inline.Arrange(this._dom);
        	}
			
        	parent.appendChild(this._dom);
        },
        
        /// Called to add the object as a child. 
        ///<param name="value">
        /// <exception cref="System.ArgumentException">
        /// o must derive from either UIElement or TextElement, or an
        /// ArgumentException will be thrown by this method. 
//        void IAddChild.
        AddChild:function(/*object*/ value) 
        { 
        	this.Blocks.Add(value);
        },

        /// Called when text appears under the tag in markup
        ///<param name="text"> 
        /// Text to Add to this Span
//        void IAddChild.
        AddText:function(/*string*/ text)
        {
            throw new ArgumentNullException("text");
        },
	});
	
	Object.defineProperties(Section.prototype,{
 
        /// <value>
        /// Collection of Blocks contained in this Section. 
        /// </value>
//        public BlockCollection 
        Blocks:
        { 
            get:function()
            { 
            	if(this._blocks === undefined){
            		this._blocks = new TextElementCollection(); 
            	}
                return  this._blocks; 
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
                return this.Blocks.GetEnumerator();
            }
        },
	});
	
	Section.Type = new Type("Section", Section, [Block.Type]);
	return Section;
});



