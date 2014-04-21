/**
 * ListItem
 */

define(["dojo/_base/declare", "system/Type", "documents/TextElement", "documents/TextElementCollection"], 
		function(declare, Type, TextElement, TextElementCollection){
	var ListItem = declare("ListItem", TextElement,{
		constructor:function(/*Paragraph*/ paragraph) 
        {
			if(paragraph === undefined){
				paragraph = null;
			}
            if (paragraph != null) 
            {
                this.Blocks.Add(paragraph);
            }
            
            this._dom = window.document.createElement('li');
        },
        
        Arrange:function(parent /*DOM element*/){
           	
        	for(var i=0; i<this.Blocks.Count; i++){
        		var block = this.Blocks.Get(i);
        		block.Arrange();
        		
        		this._dom.appendChild(block._dom);
        	}
			
//        	parent.appendChild(this._dom);
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
	
	Object.defineProperties(ListItem.prototype,{
        /// <value> 
        /// Parent element as IBlockItemParent through which a Children collection
        /// containing this BlockItem is available for Adding/Removing purposes.
        /// </value>
//        public List
		List: 
        {
            get:function() 
            { 
                return (this.Parent instanceof List ? this.Parent : null);
            } 
        },

        /// <value>
        /// Collection of BlockItems contained in this ListItem. 
        /// Usually this collection contains only one Paragraph element.
        /// In case of nested lists it can contain List element as a second 
        /// item of the collection. 
        /// More Paragraphs can be added to a collection as well.
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
 
        /// <value>
        /// A collection of ListItems containing this one in its sequential tree.
        /// May return null if an element is not inserted into any tree.
        /// </value> 
//        public ListItemCollection 
        SiblingListItems:
        { 
            get:function() 
            {
                if (this.Parent == null) 
                {
                    return null;
                }
 
                return new ListItemCollection(this, /*isOwnerParent*/false);
            } 
        }, 

        /// <summary> 
        /// Returns a ListItem immediately following this one
        /// </summary>
//        public ListItem 
        NextListItem:
        { 
            get:function()
            { 
                return this.NextElement instanceof ListItem ? his.NextElement : null; 
            }
        }, 

        /// <summary>
        /// Returns a block immediately preceding this one
        /// on the same level of siblings 
        /// </summary>
//        public ListItem 
        PreviousListItem: 
        { 
            get:function()
            { 
                return this.PreviousElement instanceof ListItem ? this.PreviousElement : null;
            }
        },	
        /// <summary> 
        /// The Margin property specifies the margin of the element. 
        /// </summary>
//        public Thickness 
        Margin: 
        {
            get:function() { return this.GetValue(ListItem.MarginProperty); },
            set:function(value) { this.SetValue(ListItem.MarginProperty, value); }
        },
        
        /// <summary> 
        /// The Padding property specifies the padding of the element.
        /// </summary> 
//        public Thickness 
        Padding:
        {
            get:function() { return this.GetValue(ListItem.PaddingProperty); },
            set:function(value) { this.SetValue(ListItem.PaddingProperty, value); } 
        },
        
        /// <summary>
        /// The BorderThickness property specifies the border of the element. 
        /// </summary>
//        public Thickness 
        BorderThickness:
        {
            get:function() { return this.GetValue(ListItem.BorderThicknessProperty); },
            set:function(value) { this.SetValue(ListItem.BorderThicknessProperty, value); }
        },
        
      /// <summary> 
        /// The BorderBrush property specifies the brush of the border.
        /// </summary>
//        public Brush 
        BorderBrush:
        { 
            get:function() { return this.GetValue(ListItem.BorderBrushProperty); },
            set:function(value) { this.SetValue(ListItem.BorderBrushProperty, value); } 
        },
        /// <summary> 
        /// 
        /// </summary>
//        public TextAlignment 
        TextAlignment: 
        {
            get:function() { return this.GetValue(ListItem.TextAlignmentProperty); },
            set:function(value) { this.SetValue(ListItem.TextAlignmentProperty, value); }
        }, 
        /// <summary>
        /// The FlowDirection property specifies the flow direction of the element. 
        /// </summary>
//        public FlowDirection 
        FlowDirection: 
        { 
            get:function() { return this.GetValue(ListItem.FlowDirectionProperty); },
            set:function(value) { this.SetValue(ListItem.FlowDirectionProperty, value); } 
        },
        /// <summary> 
        /// The LineHeight property specifies the height of each generated line box.
        /// </summary>
//        public double 
        LineHeight: 
        {
            get:function() { return this.GetValue(ListItem.LineHeightProperty); },
            set:function(value) { this.SetValue(ListItem.LineHeightProperty, value); } 
        },
        /// <summary> 
        /// The LineStackingStrategy property specifies how lines are placed
        /// </summary> 
//        public LineStackingStrategy 
        LineStackingStrategy:
        {
            get:function() { return this.GetValue(ListItem.LineStackingStrategyProperty); },
            set:function(value) { this.SetValue(ListItem.LineStackingStrategyProperty, value); } 
        },
        /// <summary> 
        /// Marks this element's left edge as visible to IMEs.
        /// This means element boundaries will act as word breaks. 
        /// </summary> 
//        internal override bool 
        IsIMEStructuralElement:
        { 
            get:function()
            {
                return true;
            } 
        }
	});
	
	Object.defineProperties(ListItem,{
	     /// <summary>
        /// DependencyProperty for <see cref="Margin" /> property. 
        /// </summary> 
//        public static readonly DependencyProperty 
		MarginProperty:
        {
        	get:function(){
            	if(ListItem._ForegroundProperty === undefined){
            		ListItem._ForegroundProperty =
                        Block.MarginProperty.AddOwner( 
                                ListItem.Type,
                                /*new FrameworkPropertyMetadata(
                                        new Thickness(),
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)*/
                                FrameworkPropertyMetadata.Build2(
                                        new Thickness(),
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)); 
            	}
            	
            	return ListItem._ForegroundProperty;
        	}
        },

        /// <summary> 
        /// DependencyProperty for <see cref="Padding" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		PaddingProperty:
        {
        	get:function(){
            	if(ListItem._ForegroundProperty === undefined){
            		ListItem._ForegroundProperty = 
                        Block.PaddingProperty.AddOwner(
                                ListItem.Type,
                                /*new FrameworkPropertyMetadata(
                                        new Thickness(), 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure)*/
                                FrameworkPropertyMetadata.Build2(
                                        new Thickness(), 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure));
            	}
            	
            	return ListItem._ForegroundProperty;
        	}
        },
 
        /// <summary> 
        /// DependencyProperty for <see cref="BorderThickness" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		BorderThicknessProperty:
        {
        	get:function(){
            	if(ListItem._ForegroundProperty === undefined){
            		ListItem._ForegroundProperty =
                        Block.BorderThicknessProperty.AddOwner(
                                ListItem.Type,
                                /*new FrameworkPropertyMetadata( 
                                        new Thickness(),
                                        FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender)*/
                                FrameworkPropertyMetadata.Build2( 
                                        new Thickness(),
                                        FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender)); 
            	}
            	
            	return ListItem._ForegroundProperty;
        	}
        },
        /// <summary>
        /// DependencyProperty for <see cref="BorderBrush" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		BorderBrushProperty:
        {
        	get:function(){
            	if(ListItem._ForegroundProperty === undefined){
            		ListItem._ForegroundProperty =
                        Block.BorderBrushProperty.AddOwner(
                                ListItem.Type, 
                                /*new FrameworkPropertyMetadata(
                                        null, 
                                        FrameworkPropertyMetadataOptions.AffectsRender)*/
                                FrameworkPropertyMetadata.Build2(
                                        null, 
                                        FrameworkPropertyMetadataOptions.AffectsRender)); 
            	}
            	
            	return ListItem._ForegroundProperty;
        	}
        },

      

        /// <summary> 
        /// DependencyProperty for <see cref="TextAlignment" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		TextAlignmentProperty:
        {
        	get:function(){
            	if(ListItem._ForegroundProperty === undefined){
            		ListItem._ForegroundProperty =
                        Block.TextAlignmentProperty.AddOwner(ListItem.Type); 
            	}
            	
            	return ListItem._ForegroundProperty;
        	}
        },
     

        /// <summary> 
        /// DependencyProperty for <see cref="FlowDirection" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		FlowDirectionProperty:
        {
        	get:function(){
            	if(ListItem._ForegroundProperty === undefined){
            		ListItem._ForegroundProperty = 
                        Block.FlowDirectionProperty.AddOwner(ListItem.Type);
            	}
            	
            	return ListItem._ForegroundProperty;
        	}
        },
        

        /// <summary>
        /// DependencyProperty for <see cref="LineHeight" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		LineHeightProperty:
        {
        	get:function(){
            	if(ListItem._ForegroundProperty === undefined){
            		ListItem._ForegroundProperty = 
                        Block.LineHeightProperty.AddOwner(ListItem.Type); 
            	}
            	
            	return ListItem._ForegroundProperty;
        	}
        }, 
        
 
        /// <summary>
        /// DependencyProperty for <see cref="LineStackingStrategy" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		LineStackingStrategyProperty:
        {
        	get:function(){
            	if(ListItem._ForegroundProperty === undefined){
            		ListItem._ForegroundProperty = 
                        Block.LineStackingStrategyProperty.AddOwner(ListItem.Type);
            	}
            	
            	return ListItem._ForegroundProperty;
        	}
        }, 
	});
	
	ListItem.Type = new Type("ListItem", ListItem, [TextElement.Type]);
	return ListItem;
});
        

