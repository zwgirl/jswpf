/**
 * DOMElement
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement", "windows/UIElement", "markup/IAddChild",
        "internal/controls/EmptyEnumerator", "windows/SingleChildEnumerator", "objectmodel/Collection"], 
		function(declare, Type, FrameworkElement, UIElement, IAddChild, 
				EmptyEnumerator, SingleChildEnumerator){
	var DOMElement = declare("DOMElement", [FrameworkElement, IAddChild], {
		constructor:function(){
			this._visualchildren = null;
			this._logicChildren = null;
		},
		
	       ///<summary> 
        /// This method is called to Add the object as a child of the DOMElement.  This method is used primarily
        /// by the parser; a more direct way of adding a child to a DOMElement is to use the <see cref="Child" />
        /// property.
        ///</summary> 
        ///<param name="value">
        /// The object to add as a child; it must be a UIElement. 
        ///</param> 
//        void IAddChild.
        AddChild:function(/*Object*/ value)
        { 
        	if(value === undefined || value === null){
        		throw new Error('argument value may notbe null!');
        	}
        	
           	if(this._logicChildren == null){
        		this._logicChildren = new Collection();
        	}
           	
           	this._logicChildren.Add(value);
        	
        	if(this._visualchildren == null){
        		this._visualchildren = new Collection();
        	}
        	
        	var visual = null;
            if ((value instanceof UIElement))
            {
            	visual = value;
            }else if(typeof value =="string"){
            	visual= new Span(value);
            }else {
            	visual= new Span(value.ToString());
            }
            
        	this._visualchildren.Add(visual);

            this.AddLogicalChild(visual);
            // notify the visual layer about the new child. 
            this. AddVisualChild(visual); 
        },
        
        ///<summary>
        /// This method is called by the parser when text appears under the tag in markup. 
        /// As Decorators do not support text, calling this method has no effect if the text 
        /// is all whitespace.  For non-whitespace text, throw an exception.
        ///</summary> 
        ///<param name="text">
        /// Text to add as a child.
        ///</param>
//        public void /*IAddChild.*/
        AddText:function (/*String*/ text) 
        {
//            XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
        	this.AddChild(text);
        }, 

        /// <summary> 
        /// Returns the child at the specified index.
        /// </summary> 
//        protected override Visual 
        GetVisualChild:function(/*int*/ index) 
        {
            if ((this._visualchildren == null) 
                ||  (index < 0))
            {
                throw new Error('ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)');
            }

            return this._visualchildren.Get(index); 
        },

        /// <summary> 
        /// Updates DesiredSize of the DOMElement.  Called by parent UIElement.  This is the first pass of layout.
        /// </summary>
        /// <remarks>
        /// DOMElement determines a desired size it needs from the child's sizing properties, margin, and requested size. 
        /// </remarks>
        /// <param name="constraint">Constraint size is an "upper limit" that the return value should not exceed.</param> 
        /// <returns>The DOMElement's desired size.</returns> 
//        protected override Size 
        MeasureOverride:function()
        { 
            var count = this.VisualChildrenCount;

            if (count > 0)
            { 
            	for(var i=0; i<count; i++){
                    /*UIElement*/var child = this.GetVisualChild(i);
                    if (child != null) 
                    { 
                        child.Measure();
                    }
            	}
            } 
        },
 
        /// <summary>
        /// DOMElement computes the position of its single child inside child's Margin and calls Arrange
        /// on the child.
        /// </summary> 
        /// <param name="arrangeSize">Size the DOMElement will assume.</param>
//        protected override Size 
        ArrangeOverride:function() 
        { 
            var count = this.VisualChildrenCount;

            if (count > 0)
            { 
            	for(var i=0; i<count; i++){
                    /*UIElement*/var child = this.GetVisualChild(i);
                    if (child != null) 
                    { 
                        child.Arrange();
                        this._dom.appendChild(child._dom);
                    }
            	}
            }
        }

	});
	
	Object.defineProperties(DOMElement.prototype,{
	     
        /// <summary>
        /// Returns enumerator to logical children. 
        /// </summary> 
//        protected internal override IEnumerator 
        LogicalChildren:
        { 
            get:function()
            {
                if (this._logicChildren == null)
                { 
                    return EmptyEnumerator.Instance;
                } 
 
                return this._logicChildren.GetEnumerator();
            } 
        },

 
        /// <summary>
        /// Returns the Visual children count. 
        /// </summary> 
//        protected override int 
        VisualChildrenCount:
        { 
            get:function() { return (this._visualchildren == null) ? 0 : this._visualchildren.Count; }
        },
        
        Accesskey:
		{
			get:function(){ return this.GetValue(DOMElement.AccesskeyProperty);},
			set:function(value) {this.SetValue(DOMElement.AccesskeyProperty, value); }
		},
		
		Class:
		{
			get:function(){ return this.GetValue(DOMElement.ClassProperty);},
			set:function(value) {this.SetValue(DOMElement.ClassProperty, value); }
		},
		
		Contenteditable:
		{
			get:function(){ return this.GetValue(DOMElement.ContenteditableProperty);},
			set:function(value) {this.SetValue(DOMElement.ContenteditableProperty, value); }
		},
		
		Contextmenu:
		{
			get:function(){ return this.GetValue(DOMElement.ContextmenuProperty);},
			set:function(value) {this.SetValue(DOMElement.ContextmenuProperty, value); }
		},
		
		Dir:
		{
			get:function(){ return this.GetValue(DOMElement.DirProperty);},
			set:function(value) {this.SetValue(DOMElement.DirProperty, value); }
		},
		
		Draggable:
		{
			get:function(){ return this.GetValue(DOMElement.DraggableProperty);},
			set:function(value) {this.SetValue(DOMElement.DraggableProperty, value); }
		},
		
		Dropzone:
		{
			get:function(){ return this.GetValue(DOMElement.DropzoneProperty);},
			set:function(value) {this.SetValue(DOMElement.DropzoneProperty, value); }
		},
		
		Hidden:
		{
			get:function(){ return this.GetValue(DOMElement.HiddenProperty);},
			set:function(value) {this.SetValue(DOMElement.HiddenProperty, value); }
		},
		
		Id:
		{
			get:function(){ return this.GetValue(DOMElement.IdProperty);},
			set:function(value) {this.SetValue(DOMElement.IdProperty, value); }
		},
		
		Lang:
		{
			get:function(){ return this.GetValue(DOMElement.LangProperty);},
			set:function(value) {this.SetValue(DOMElement.LangProperty, value); }
		},
		
		Style:
		{
			get:function(){ return this.GetValue(DOMElement.StyleProperty);},
			set:function(value) {this.SetValue(DOMElement.StyleProperty, value); }
		},
		
		
		Tabindex:
		{
			get:function(){ return this.GetValue(DOMElement.TabindexProperty);},
			set:function(value) {this.SetValue(DOMElement.TabindexProperty, value); }
		},
		
		Title:
		{
			get:function(){ return this.GetValue(DOMElement.TitleProperty);},
			set:function(value) {this.SetValue(DOMElement.TitleProperty, value); }
		},
        
	});
	

	
	Object.defineProperties(DOMElement,{
//		accesskey
//        public static readonly DependencyProperty 
		AccesskeyProperty:
        {
        	get:function(){
        		if(DOMElement._AccesskeyProperty === undefined){
        			DOMElement._AccesskeyProperty= DependencyProperty.Register("Accesskey", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._AccesskeyProperty._domProp = "accesskey";
        		}
        		return DOMElement._AccesskeyProperty;
        	}
        },
//    	class
//      public static readonly DependencyProperty 
        ClassProperty:
        {
        	get:function(){
        		if(DOMElement._ClassProperty === undefined){
        			DOMElement._ClassProperty= DependencyProperty.Register("Class", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._ClassProperty._domProp = "class";
        		}
        		return DOMElement._ClassProperty;
        	}
        },
//    	contenteditable 
//      public static readonly DependencyProperty 
        ContenteditableProperty:
        {
        	get:function(){
        		if(DOMElement._ContenteditableProperty === undefined){
        			DOMElement._ContenteditableProperty= DependencyProperty.Register("Contenteditable", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._ContenteditableProperty._domProp = "contenteditable";
        			
        		}
        		return DOMElement._ContenteditableProperty;
        	}
        },
//    	contextmenu	
//      public static readonly DependencyProperty 
        ContextmenuProperty:
        {
        	get:function(){
        		if(DOMElement._ContextmenuProperty === undefined){
        			DOMElement._ContextmenuProperty= DependencyProperty.Register("Contextmenu", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._ContextmenuProperty._domProp = "contextmenu";
        		}
        		return DOMElement._ContextmenuProperty;
        	}
        },
//    	dir 
//      public static readonly DependencyProperty 
        DirProperty:
        {
        	get:function(){
        		if(DOMElement._DirProperty === undefined){
        			DOMElement._DirProperty= DependencyProperty.Register("Dir", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._DirProperty._domProp = "dir";
        		}
        		return DOMElement._DirProperty;
        	}
        },
        
//    	draggable
//      public static readonly DependencyProperty 
        DraggableProperty:
        {
        	get:function(){
        		if(DOMElement._DraggableProperty === undefined){
        			DOMElement._DraggableProperty= DependencyProperty.Register("Draggable", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._DraggableProperty._domProp = "draggable";
        		}
        		return DOMElement._DraggableProperty;
        	}
        },

//    	dropzone
//      public static readonly DependencyProperty 
        DropzoneProperty:
        {
        	get:function(){
        		if(DOMElement._DropzoneProperty === undefined){
        			DOMElement._DropzoneProperty= DependencyProperty.Register("Dropzone", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._DropzoneProperty._domProp = "dropzone";
        		}
        		return DOMElement._DropzoneProperty;
        	}
        },
        
//    	hidden
//      public static readonly DependencyProperty 
        HiddenProperty:
        {
        	get:function(){
        		if(DOMElement._HiddenProperty === undefined){
        			DOMElement._HiddenProperty= DependencyProperty.Register("Hidden", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._HiddenProperty._domProp = "hidden";
        		}
        		return DOMElement._HiddenProperty;
        	}
        },
        
//    	id
//      public static readonly DependencyProperty 
        IdProperty:
        {
        	get:function(){
        		if(DOMElement._IdProperty === undefined){
        			DOMElement._IdProperty= DependencyProperty.Register("Id", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._IdProperty._domProp = "id";
        		}
        		return DOMElement._IdProperty;
        	}
        },
        
//    	lang
//      public static readonly DependencyProperty 
        LangProperty:
        {
        	get:function(){
        		if(DOMElement._LangProperty === undefined){
        			DOMElement._LangProperty= DependencyProperty.Register("Lang", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._LangProperty._domProp = "lang";
        		}
        		return DOMElement._LangProperty;
        	}
        },
        
//    	spellcheck
//      public static readonly DependencyProperty 
        SpellcheckProperty:
        {
        	get:function(){
        		if(DOMElement._SpellcheckProperty === undefined){
        			DOMElement._SpellcheckProperty= DependencyProperty.Register("Spellcheck", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._SpellcheckProperty._domProp = "spellcheck";
        		}
        		return DOMElement._SpellcheckProperty;
        	}
        },
        
//    	style
//      public static readonly DependencyProperty 
        StyleProperty:
        {
        	get:function(){
        		if(DOMElement._StyleProperty === undefined){
        			DOMElement._StyleProperty= DependencyProperty.Register("Style", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._StyleProperty._domProp = "style";
        		}
        		return DOMElement._StyleProperty;
        	}
        },
//    	tabindex
//      public static readonly DependencyProperty 
        TabindexProperty:
        {
        	get:function(){
        		if(DOMElement._TabindexProperty === undefined){
        			DOMElement._TabindexProperty= DependencyProperty.Register("Tabindex", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._TabindexProperty._domProp = "tabindex";
        		}
        		return DOMElement._TabindexProperty;
        	}
        },
        
//    	title
//      public static readonly DependencyProperty 
        TitleProperty:
        {
        	get:function(){
        		if(DOMElement._TitleProperty === undefined){
        			DOMElement._TitleProperty= DependencyProperty.Register("Title", String.Type, DOMElement.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			DOMElement._TitleProperty._domProp = "title";
        		}
        		return DOMElement._TitleProperty;
        	}
        },
	});
	
	DOMElement.Type = new Type("DOMElement", DOMElement, [FrameworkElement.Type, IAddChild.Type]);
	return DOMElement;
});

 