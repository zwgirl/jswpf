/**
 * List
 */

define(["dojo/_base/declare", "system/Type", "documents/Block", "documents/TextElementCollection"], 
		function(declare, Type, Block, TextElementCollection){
	var List = declare("List", Block,{
		constructor:function(/*ListItem*/ listItem)
        { 
			if(listItem === undefined){
				listItem = null;
			}
            if (listItem != null)
            { 
                this.ListItems.Add(listItem);
            }
            
        	this._dom = window.document.createElement('ul');
        },
        
//      void IAddChild.
        AddChild:function(/*object*/ value) 
        { 
        	this.ListItems.Add(value);
        },

        /// Called when text appears under the tag in markup
        ///<param name="text"> 
        /// Text to Add to this Span
//        void IAddChild.
        AddText:function(/*string*/ text)
        {
            throw new ArgumentNullException("text");
        },
        
        Arrange:function(parent /*DOM element*/){
           
        	for(var i=0; i<this.ListItems.Count; i++){
        		var listItem = this.ListItems.Get(i);
        		listItem.Arrange();
        		this._dom.appendChild(listItem._dom);
        	}
			
//        	parent.appendChild(this._dom);
        },
        
        /// <summary> 
        /// Returns the integer "index" of a specified ListItem that is an immediate child of
        /// this List. This index is defined to be a sequential counter of ListElementItems only
        /// (skipping other elements) among this List's immediate children.
        /// 
        /// The list item index of the first child of type ListItem is specified by
        /// this.StartListIndex, which has a default value of 1. 
        /// 
        /// The index returned by this method is used in the formation of some ListItem
        /// markers such as "(b)" and "viii." (as opposed to others, like disks and wedges, 
        /// which are not sequential-position-dependent).
        /// </summary>
        /// <param name="item">The item whose index is to be returned.</param>
        /// <returns>Returns the index of a specified ListItem.</returns> 
//        internal int 
        GetListItemIndex:function(/*ListItem*/ item)
        { 
            // Check for valid arg 
            if (item == null)
            { 
                throw new ArgumentNullException("item");
            }
            if (item.Parent != this)
            { 
                throw new InvalidOperationException(SR.Get(SRID.ListElementItemNotAChildOfList));
            } 
 
            return	this.ListItems.IndexOf(item);
        },

        /// <summary> 
        /// Inserts a List around a sequence of Blocks
        /// starting from firstBlock ending with lastBlock. 
        /// the List must be empty and not inserted in a tree 
        /// before the operation
        /// </summary> 
        /// <param name="firstBlock"></param>
        /// <param name="lastBlock"></param>
//        internal void 
        Apply:function(/*Block*/ firstBlock, /*Block*/ lastBlock)
        { 
//            Invariant.Assert(this.Parent == null, "Cannot Apply List Because It Is Inserted In The Tree Already.");
//            Invariant.Assert(this.IsEmpty, "Cannot Apply List Because It Is Not Empty."); 
//            Invariant.Assert(firstBlock.Parent == lastBlock.Parent, "Cannot Apply List Because Block Are Not Siblings."); 

            var textContainer = this.TextContainer; 

            textContainer.BeginChange();
            try
            { 
                // Wrap all block items into this List element
                this.Reposition(firstBlock.ElementStart, lastBlock.ElementEnd); 
 
                // Add ListItem elements
                var block = firstBlock; 
                while (block != null)
                {
                    var listItem;
                    if (block instanceof List) 
                    {
                        // To wrap List into list item we pull it into previous ListItem (if any) as sublist 
                        listItem = block.ElementStart.GetAdjacentElement(LogicalDirection.Backward);
                        listItem = listItem instanceof ListItem ? listItem : null; 
                        if (listItem != null)
                        { 
                            // Wrap the List into preceding ListItem
                            listItem.Reposition(listItem.ContentStart, block.ElementEnd);
                        }
                        else 
                        {
                            // No preceding ListItem. Create new one 
                            listItem = new ListItem(); 
                            listItem.Reposition(block.ElementStart, block.ElementEnd);
                        } 
                    }
                    else
                    {
                        // To wrap paragraph into list item we need to create a new one 
                        //
                        listItem = new ListItem(); 
                        listItem.Reposition(block.ElementStart, block.ElementEnd); 

                        // MS Word-like heuristic: clear margin from a paragraph before wrapping it into a list item 
                        // Note: using TextContainer to make sure that undo unit is created.
                        block.ClearValue(Block.MarginProperty);
                        block.ClearValue(Block.PaddingProperty);
                        block.ClearValue(Paragraph.TextIndentProperty); 
                    }
 
                    // Stop when the last paragraph is covered 
                    block = block == lastBlock ? null : listItem.ElementEnd.GetAdjacentElement(LogicalDirection.Forward);
                } 

                // We need to set appropriate FlowDirection property on the new List and its paragraph children.
                // We take the FlowDirection value from the first paragraph's FlowDirection value.
 
                TextRangeEdit.SetParagraphProperty(this.ElementStart, this.ElementEnd,
                    Paragraph.FlowDirectionProperty, firstBlock.GetValue(Paragraph.FlowDirectionProperty)); 
            } 
            finally
            { 
                textContainer.EndChange();
            }
        }
	});
	
	Object.defineProperties(List.prototype,{
	    /// <value> 
        /// Collection of ListItems contained in this List.
        /// </value> 
//        public ListItemCollection 
		ListItems:
        {
            get:function() 
            {
            	if(this._listItems === undefined){
            		this._listItems = new TextElementCollection(this); 
            	}
                return  this._listItems; 
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
                return this.ListItems.GetEnumerator();
            }
        },
        
        /// <summary>
        /// Type of bullet or number to be used by default with ListElementItems 
        /// contained by this List 
        /// </summary>
//        public TextMarkerStyle 
        MarkerStyle: 
        {
            get:function() { return this.GetValue(List.MarkerStyleProperty); },
            set:function(value) { this.SetValue(List.MarkerStyleProperty, value); }
        },
        
        /// <summary>
        /// Desired distance between each contained ListItem's content and
        /// near edge of the associated marker.
        /// </summary> 
//        public double 
        MarkerOffset: 
        { 
            get:function() { return this.GetValue(List.MarkerOffsetProperty); },
            set:function(value) { this.SetValue(List.MarkerOffsetProperty, value); } 
        },
        
        /// <summary> 
        /// Item index of the first ListItem that is immediate child of
        /// this List. 
        /// </summary>
//        public int 
        StartIndex:
        {
            get:function() { return this.GetValue(List.StartIndexProperty); },
            set:function(value) { this.SetValue(List.StartIndexProperty, value); }
        } 		  
	});
	
	Object.defineProperties(List,{
	       /// <summary>
        /// DependencyProperty for <see cref="MarkerStyle" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		MarkerStyleProperty:
        {
        	get:function(){
            	if(List._ForegroundProperty === undefined){
            		List._ForegroundProperty = 
                        DependencyProperty.Register(
                                "MarkerStyle", 
                                Number.Type, 
                                List.Type,
                                /*new FrameworkPropertyMetadata( 
                                        TextMarkerStyle.Disc,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender)*/
                                FrameworkPropertyMetadata.Build2( 
                                        TextMarkerStyle.Disc,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender),
                                new ValidateValueCallback(null, IsValidMarkerStyle));
            	}
            	
            	return List._ForegroundProperty;
        	}
        },
 
        /// <summary> 
        /// DependencyProperty for <see cref="MarkerOffset" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		MarkerOffsetProperty:
        {
        	get:function(){
            	if(List._ForegroundProperty === undefined){
            		List._ForegroundProperty = 
                        DependencyProperty.Register(
                                "MarkerOffset",
                                Number.Type,
                                List.Type, 
                               /* new FrameworkPropertyMetadata(
                                        Number.NaN, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender)*/
                                FrameworkPropertyMetadata.Build2(
                                        Number.NaN, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender), 
                                        new ValidateValueCallback(null, IsValidMarkerOffset));
            	}
            	
            	return List._ForegroundProperty;
        	}
        },

        /// <summary>
        /// DependencyProperty for <see cref="StartIndex" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		StartIndexProperty:
        {
        	get:function(){
            	if(List._ForegroundProperty === undefined){
            		List._ForegroundProperty = 
                        DependencyProperty.Register( 
                                "StartIndex",
                                Number.Type, 
                                List.Type,
                                /*new FrameworkPropertyMetadata(
                                        1,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender)*/
                                FrameworkPropertyMetadata.Build2(
                                        1,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender), 
                                new ValidateValueCallback(null, IsValidStartIndex));
            	}
            	
            	return List._ForegroundProperty;
        	}
        },

	});
	
    /// <summary>
    /// List static constructor. Registers metadata for its properties.
    /// </summary>
//    static List() 
	function Initialize()
    {
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(List.Type, 
        		/*new FrameworkPropertyMetadata(List.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(List.Type)); 
    };
    
   

//    private static bool 
    function IsValidMarkerStyle(/*object*/ o) 
    { 
//        TextMarkerStyle value = (TextMarkerStyle)o;
        return o == TextMarkerStyle.None 
            || o == TextMarkerStyle.Disc
            || o == TextMarkerStyle.Circle
            || o == TextMarkerStyle.Square
            || o == TextMarkerStyle.Box 
            || o == TextMarkerStyle.LowerRoman
            || o == TextMarkerStyle.UpperRoman 
            || o == TextMarkerStyle.LowerLatin 
            || o == TextMarkerStyle.UpperLatin
            || o == TextMarkerStyle.Decimal; 
    }

//    private static bool 
    function IsValidStartIndex(/*object*/ o)
    { 
        return (o > 0); 
    } 

//    private static bool 
    function IsValidMarkerOffset(/*object*/ o) 
    {
        var value = o;
        var maxOffset = Math.min(1000000, PTS.MaxPageSize);
        var minOffset = -maxOffset; 

        if (Double.IsNaN(value)) 
        { 
            // Default
            return true; 
        }
        if (value < minOffset || value > maxOffset)
        {
            return false; 
        }
        return true; 
    } 
	
	List.Type = new Type("List", List, [Block.Type]);
	Initialize();
	
	return List;
});




