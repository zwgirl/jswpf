/**
 * Span
 */

define(["dojo/_base/declare", "system/Type", "documents/Inline", "documents/TextElementCollection"], 
		function(declare, Type, Inline, TextElementCollection){
	var Span = declare("Span", Inline,{
		constructor:function(/*Inline*/ childInline)
        {
			if(childInline === undefined){
				childInline =null;
			}

            if (childInline != null) 
            { 
                this.Inlines.Add(childInline);
            } 
            
            this._dom = window.document.createElement('span');
            this._dom._source = this;
        },
        
        /// Called to add the object as a child. 
        ///<param name="value">
        /// <exception cref="System.ArgumentException">
        /// o must derive from either UIElement or TextElement, or an
        /// ArgumentException will be thrown by this method. 
//        void IAddChild.
        AddChild:function(/*object*/ value) 
        { 
            if(typeof(value) == "string"){
            	this.AddText(value);
            }else{
            	this.Inlines.Add(value);
            }
        },

        /// Called when text appears under the tag in markup
        ///<param name="text"> 
        /// Text to Add to this Span
//        void IAddChild.
        AddText:function(/*string*/ text)
        {
            if (text == null) 
            {
                throw new ArgumentNullException("text"); 
            } 

            // NOTE: Do not use new Run(text) constructor to avoid TextContainer creation
            // which would hit parser perf 
            var implicitRun = Inline.CreateImplicitRun(this);

            this.AddChild(implicitRun); 

            implicitRun.Text = text; 
        },
        
        Arrange:function(parent /*DOM element*/){
           	
        	for(var i=0; i<this.Inlines.Count; i++){
        		var inline = this.Inlines.Get(i);
        		inline.Arrange();
        		
        		this._dom.appendChild(inline._dom);
        	}
        }
 
	});
	
	Object.defineProperties(Span.prototype,{
        /// <value> 
        /// Collection of Inline items contained in this Section.
        /// </value>
//        public InlineCollection 
		Inlines: 
        {
            get:function() 
            { 
            	if(this._inlines === undefined){
            		this._inlines = new TextElementCollection(this);
            	}
                return  this._inlines; 
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
                return this.Inlines.GetEnumerator();
            }
        },

	});
	
	Span.Type = new Type("Span", Span, [Inline.Type]);
	return Span;
});


         



