/**
 * Run
 */

define(["dojo/_base/declare", "system/Type", "documents/Inline", "windows/SingleChildEnumerator"], 
		function(declare, Type, Inline, SingleChildEnumerator){
	var Run = declare("Run", Inline,{
		constructor:function(/*string*/ text)
        {
			
			if(text === undefined){
				text = null;
			}
			
			this.Text = text;
          
			this._dom = window.document.createTextNode(this.Text);
			this._dom._source = this;
        },
        
        ///<summary>
        /// Called to add the object as a child. 
        ///</summary> 
        ///<param name="value">
        /// A Block to add as a child. 
        ///</param>
        /// <exception cref="System.ArgumentException">
        /// o must derive from either UIElement or TextElement, or an
        /// ArgumentException will be thrown by this method. 
        /// </exception>
//        void IAddChild.
        AddChild:function(/*object*/ value) 
        { 
            if(typeof(value) == "string"){
            	this.AddText(value);
            }else{
            	throw new ArgumentException(SR.Get(SRID.TextSchema_ChildTypeIsInvalid, this.GetType().Name, value.GetType().Name));
            }
        },

        ///<summary> 
        /// Called when text appears under the tag in markup
        ///</summary> 
        ///<param name="text"> 
        /// Text to Add to this TextElement
        ///</param> 
        /// <ExternalAPI/>
//        void IAddChild.
        AddText:function(/*string*/ text)
        {
            if (text == null) 
            {
                throw new ArgumentNullException("text"); 
            } 
            
            this.Text += text;
        },
        
        
        /// <summary>
        /// Updates TextProperty when it is no longer in [....] with the backing store. Called by
        /// TextContainer when a change affects the text contained by this Run.
        /// </summary> 
        /// <remarks>
        /// If a public TextChanged event is added, we need to raise the event only when the 
        /// outermost call to this function exits. 
        /// </remarks>
//        internal override void 
        OnTextUpdated:function() 
        {
            // If the value of Run.Text comes from a local value without a binding expression, we purposely allow the
            // redundant roundtrip property set here. (SetValue on Run.TextProperty causes a TextContainer change,
            // which causes this notification, and we set the property again.) We want to avoid keeping duplicate string 
            // data (both in the property system and in the backing store) when Run.Text is set, so we replace the
            // original string property value with a deferred reference. This causes an extra property changed 
            // notification, but this is better than duplicating the data. 

//            var textPropertySource = DependencyPropertyHelper.GetValueSource(this, Run.TextProperty); 
//            if (!this._isInsideDeferredSet && (this._changeEventNestingCount == 0 || (textPropertySource.BaseValueSource == BaseValueSource.Local
//                && !textPropertySource.IsExpression)))
//            {
//                this._changeEventNestingCount++; 
//                this._isInsideDeferredSet = true;
//                try 
//                { 
//                    // Use a deferred reference as a performance optimization. Most of the time, no
//                    // one will even be watching this property. 
//                	this.SetCurrentDeferredValue(Run.TextProperty, new DeferredRunTextReference(this));
//                }
//                finally
//                { 
//                	this._isInsideDeferredSet = false;
//                	this._changeEventNestingCount--; 
//                } 
//            }
        }, 

        Arrange:function(parent /*DOM element*/){
//           	this._dom = window.document.createElement('span');
           	
//           	element.appendChild(textNode);
			
//        	parent.appendChild(textNode);
        	
        }
	});
	
	Object.defineProperties(Run.prototype,{

        /// <summary> 
        /// The content spanned by this TextElement.
        /// </summary>
//        public string 
		Text:
        { 
            get:function() { return this.GetValue(Run.TextProperty); },
            set:function(value) { this.SetValue(Run.TextProperty, value); } 
        },
        
        /// <summary>
        /// Returns enumerator to logical children.
        /// </summary>
//        protected internal override IEnumerator 
        LogicalChildren: 
        {
            get:function() 
            { 
                return new SingleChildEnumerator(this);
            }
        },
 
	});
	
	Object.defineProperties(Run,{

        /// <summary> 
        /// Dependency property backing Text. 
        /// </summary>
        /// <remarks> 
        /// Note that when a TextRange that intersects with this Run gets modified (e.g. by editing
        /// a selection in RichTextBox), we will get two changes to this property since we delete
        /// and then insert when setting the content of a TextRange.
        /// </remarks> 
//        public static readonly DependencyProperty 
		TextProperty:
        {
        	get:function(){
            	if(Run._TextProperty === undefined){
            		Run._TextProperty = DependencyProperty.Register("Text", 
            				String.Type, Run.Type,
            	            new FrameworkPropertyMetadata(
            	            		String.Empty, 
            	            		FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
            	                    new PropertyChangedCallback(OnTextPropertyChanged), 
            	                    new CoerceValueCallback(CoerceText))); 
            	}
            	
            	return Run._TextProperty;
        	}
        } 

	});

    /// <summary>
    /// Changed handler for the Text property. 
    /// </summary>
    /// <param name="d">The source of the event.</param> 
    /// <param name="e">A PropertyChangedEventArgs that contains the event data.</param> 
    /// <remarks>
    /// We can't assume the value is a string here -- it may be a DeferredRunTextReference. 
    /// </remarks>
//    private static void 
	function OnTextPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        /*Run*/var run = d; 

        // Return if this update was caused by a TextContainer change or a reentrant change. 
        if (run._changeEventNestingCount > 0) 
        {
            return; 
        }

//        Invariant.Assert(!e.NewEntry.IsDeferredReference);

        // CoerceText will have already converted null -> String.Empty, but our default
        // CoerceValueCallback could be overridden by a derived class.  So check again here. 
        var newText = e.NewValue; 
        if (newText == null)
        { 
            newText = String.Empty;
        }

//        // Run.TextProperty has changed. Update the backing store. 
//        run._changeEventNestingCount++;
//        try 
//        { 
//            var textContainer = run.TextContainer;
//            textContainer.BeginChange(); 
//
//            try
//            {
//                var contentStart = run.ContentStart; 
//                if (!run.IsEmpty)
//                { 
//                    textContainer.DeleteContentInternal(contentStart, run.ContentEnd); 
//                }
//                contentStart.InsertTextInRun(newText); 
//            }
//            finally
//            {
//                textContainer.EndChange(); 
//            }
//        } 
//        finally 
//        {
//            run._changeEventNestingCount--; 
//        }
//
//        // We need to clear undo stack if we are in a RichTextBox and the value comes from
//        // data binding or some other expression. 
//         document = run.TextContainer.Parent instanceof FlowDocument ? run.TextContainer.Parent : null;
//        if (document != null) 
//        { 
//            /*RichTextBox*/var rtb = document.Parent instanceof RichTextBox ? document.Parent : null;
//            if (rtb != null && run.HasExpression(run.LookupEntry(Run.TextProperty.GlobalIndex), Run.TextProperty)) 
//            {
//                /*UndoManager*/var undoManager = rtb.TextEditor._GetUndoManager();
//                if (undoManager != null && undoManager.IsEnabled)
//                { 
//                    undoManager.Clear();
//                } 
//            } 
//        }
    }

    /// <summary>
    /// Coercion callback for the Text property.
    /// </summary> 
    /// <param name="d">The object that the property exists on.</param>
    /// <param name="baseValue">The new value of the property, prior to any coercion attempt.</param> 
    /// <returns>The coerced value.</returns> 
    /// <remarks>
    /// We can't assume the value is a string here -- it may be a DeferredRunTextReference. 
    /// </remarks>
//    private static object 
    function CoerceText(/*DependencyObject*/ d, /*object*/ baseValue)
    {
        if (baseValue == null) 
        {
            baseValue = string.Empty; 
        } 

        return baseValue; 
    }
	
	Run.Type = new Type("Run", Run, [Inline.Type]);
	return Run;
});
