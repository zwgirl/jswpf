/**
 * ContentPresenter
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement", "windows/DataTemplate", "controls/DataTemplateSelector", 
        /*"windows/StyleHelper", */"windows/DependencyProperty"/*, "windows/FrameworkPropertyMetadata"*/, 
        "windows/FrameworkPropertyMetadataOptions",
        "windows/PropertyChangedCallback", "windows/UIElement",
        /*"windows/FrameworkElementFactory",*/ "controls/AccessText", "controls/TextBlock",
        "documents/Inline", "internal/Helper"], 
		function(declare, Type, FrameworkElement, DataTemplate, DataTemplateSelector, 
				/*StyleHelper, */DependencyProperty/*, FrameworkPropertyMetadata*/, 
				FrameworkPropertyMetadataOptions,
				PropertyChangedCallback, UIElement, /*FrameworkElementFactory,*/
				AccessText, TextBlock, Inline, Helper){
	
	var FrameworkElementFactory = null;
	function EnsureFrameworkElementFactory(){
		if(FrameworkElementFactory == null){
			FrameworkElementFactory = using("windows/FrameworkElementFactory");
		}
		
		return FrameworkElementFactory;
	}
	
    // Template for displaying UIElements - use the UIElement itself
    var UseContentTemplate = declare("UseContentTemplate", DataTemplate,{
		constructor:function(){
            // We need to preserve the treeState cache on a container node 
            // even after all its logical children have been added. This is so the 
            // construction of the template visual tree nodes can consume the cache.
            // This member helps us know whether we should retain the cache for 
            // special scenarios when the visual tree is being built via BuildVisualTree
            this.CanBuildVisualTree = true;
		},
		
//        internal override bool 
        BuildVisualTree:function(/*FrameworkElement*/ container)
        { 
            /*object*/var content = /*((ContentPresenter)container)*/container.Content; 
            /*UIElement*/var e = content instanceof UIElement ? content : null;
            if (e == null) 
            {
                /*TypeConverter*/var tc = TypeDescriptor.GetConverter(ReflectionHelper.GetReflectionType(content));
//                Debug.Assert(tc.CanConvertTo(typeof(UIElement)));
                e = /*(UIElement)*/ tc.ConvertTo(content, UIElement.Type); 
            }

            StyleHelper.AddCustomTemplateRoot( container, e ); 

            return true; 
        }
        
	}); 
    
    UseContentTemplate.Type = new Type("UseContentTemplate", UseContentTemplate, [DataTemplate.Type]);
    

    // template for displaying content when all else fails
    var DefaultTemplate = declare("DefaultTemplate", DataTemplate,{
		constructor:function(){
            // We need to preserve the treeState cache on a container node
            // even after all its logical children have been added. This is so the
            // construction of the template visual tree nodes can consume the cache.
            // This member helps us know whether we should retain the cache for 
            // special scenarios when the visual tree is being built via BuildVisualTree
            this.CanBuildVisualTree = true; 
		},
		
//        internal override bool 
        BuildVisualTree:function(/*FrameworkElement*/ container)
        {
            /*ContentPresenter*/var cp = /*(ContentPresenter)*/container;
            /*Visual*/var result = this.DefaultExpansion(cp.Content, cp);
            return (result != null);

        },

//        private UIElement 
        DefaultExpansion:function(/*object*/ content, /*ContentPresenter*/ container) 
        { 
            if (content == null)
                return null; 

            /*TextBlock*/var textBlock = CreateTextBlock(container);
            textBlock.IsContentPresenterContainer = true; // this is done so that the TextBlock does not steal away the logical child
            if( container != null ) 
            {
                StyleHelper.AddCustomTemplateRoot( 
                    container, 
                    textBlock,
                    false, // Do not need to check for existing visual parent since we just created it 
                    true); // set treeState cache on the Text instance created
            }

            this.DoDefaultExpansion(textBlock, content, container); 

            return textBlock; 
        },

//        private void 
        DoDefaultExpansion:function(/*TextBlock*/ textBlock, /*object*/ content, /*ContentPresenter*/ container) 
        {
//            Debug.Assert(!(content is String) && !(content is UIElement));  // these are handled by different templates

            /*Inline*/var inline; 

            if ((inline = content instanceof Inline ? content : null) != null) 
            { 
                textBlock.Inlines.Add(inline);
            } 
            else
            {
                var succeeded = false;
                /*string*/var stringFormat; 

                if ((stringFormat = container.ContentStringFormat) != null) 
                {
                    stringFormat = Helper.GetEffectiveStringFormat(stringFormat); 
                    textBlock.Text = String.Format(culture, stringFormat, content);
                    succeeded = true; 
                }

                if (!succeeded) 
                {
                	
                	//cym comment
//                    /*TypeConverter*/var tc = TypeDescriptor.GetConverter(ReflectionHelper.GetReflectionType(content)); 
//                    if (tc != null && (tc.CanConvertTo(typeof(String)))) 
//                    {
//                        textBlock.Text = tc.ConvertTo(null, content, String.Type); 
//                    }
//                    else
//                    {
                        textBlock.Text = String.Format(/*culture,*/ "{0}", content);
//                    } 
                } 
            }
        } 
        
	});  

    DefaultTemplate.Type = new Type("DefaultTemplate", DefaultTemplate, [DataTemplate.Type]);

    var DefaultSelector = declare("DefaultSelector", DataTemplateSelector,{
	      /// <summary> 
        /// Override this method to return an app specific <seealso cref="Template"/>. 
        /// </summary>
        /// <param name="item">The data content</param> 
        /// <param name="container">The container in which the content is to be displayed</param>
        /// <returns>a app specific template to apply.</returns>
//        public override DataTemplate 
        SelectTemplate:function(/*object*/ item, /*DependencyObject*/ container)
        { 
            /*DataTemplate*/var template = null;

            // Lookup template for typeof(Content) in resource dictionaries. 
            if (item != null)
            { 
                template = FrameworkElement.FindTemplateResourceInternal(container, item, DataTemplate.Type);
            }

            // default templates for well known types: 
            if (template == null)
            { 
                /*TypeConverter*/var tc = null; 
                /*string*/var s;

                if ((s = (typeof(item) == "string" ? item : null)) != null)
                    template = /*((ContentPresenter)container)*/container.SelectTemplateForString(s);
                else if (item instanceof UIElement)
                    template = ContentPresenter.UIElementContentTemplate; 
//                else if (SystemXmlHelper.IsXmlNode(item))
//                    template = ((ContentPresenter)container).SelectTemplateForXML(); 
                else if (item instanceof Inline) 
                    template = ContentPresenter.DefaultContentTemplate;
                // cym comment
//                else if (item != null && 
//                            (tc = TypeDescriptor.GetConverter(ReflectionHelper.GetReflectionType(item))) != null &&
//                            tc.CanConvertTo(typeof(UIElement)))
//                    template = ContentPresenter.UIElementContentTemplate;
                else 
                    template = ContentPresenter.DefaultContentTemplate;
            } 

            return template;
        } 
        
	}); 
    
    DefaultSelector.Type = new Type("DefaultSelector", DefaultSelector, [DataTemplateSelector.Type]);
	
	
    
//    private static DataTemplate 
    var s_AccessTextTemplate = null; 
//    private static DataTemplate 
    var s_StringTemplate = null; 
//    private static DataTemplate 
    var s_XmlNodeTemplate = null;
//    private static DataTemplate 
    var s_UIElementTemplate = null; 
//    private static DataTemplate 
    var s_DefaultTemplate = null;
//    private static DefaultSelector 
    var s_DefaultTemplateSelector = null;
    
	var ContentPresenter = declare("ContentPresenter", FrameworkElement,{
		constructor:function(){
			this.Initialize1();

//	        private DataTemplate 
	        this._templateCache = null; 

//	        private bool 
	        this._templateIsCurrent = null;
//	        private bool 
	        this._contentIsItem = false;
	        
	        this._dom = window.document.createElement('div');
	        this._dom.id = "ContentPresenter";
			this._dom._source = this;
			
	        
	        this.AddEventListeners();
		},

		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
//	    void 
	    Initialize1:function()
        { 
            // Initialize the _templateCache to the default value for TemplateProperty.
            // If the default value is non-null then wire it to the current instance.
            /*PropertyMetadata*/var metadata = ContentPresenter.TemplateProperty.GetMetadata(this.DependencyObjectType);
            /*DataTemplate*/var defaultValue = metadata.DefaultValue; 
            if (defaultValue != null)
            { 
                this.OnTemplateChanged(this, 
                		/*new DependencyPropertyChangedEventArgs(ContentPresenter.TemplateProperty, metadata, null, defaultValue)*/
                		DependencyPropertyChangedEventArgs.BuildPMOO(ContentPresenter.TemplateProperty, metadata, null, defaultValue)); 
            }
 
            this.DataContext = null; // this presents a uniform view:  CP always has local DC
        },
        
        ///     This method is invoked when the ContentTemplate property changes. 
        /// <param name="oldContentTemplate">The old value of the ContentTemplate property.</param> 
        /// <param name="newContentTemplate">The new value of the ContentTemplate property.</param>
//        protected virtual void 
        OnContentTemplateChanged:function(/*DataTemplate*/ oldContentTemplate, /*DataTemplate*/ newContentTemplate)
        {
            Helper.CheckTemplateAndTemplateSelector("Content", 
            		ContentPresenter.ContentTemplateProperty, ContentPresenter.ContentTemplateSelectorProperty, this); 

            // if ContentTemplate is really changing, remove the old template 
            this.Template = null; 
        },
        
        ///     This method is invoked when the ContentTemplateSelector property changes.
        /// <param name="oldContentTemplateSelector">The old value of the ContentTemplateSelector property.</param> 
        /// <param name="newContentTemplateSelector">The new value of the ContentTemplateSelector property.</param>
//        protected virtual void 
        OnContentTemplateSelectorChanged:function(/*DataTemplateSelector*/ oldContentTemplateSelector, /*DataTemplateSelector*/ newContentTemplateSelector) 
        {
            Helper.CheckTemplateAndTemplateSelector("Content", ContentPresenter.ContentTemplateProperty, 
            		ContentPresenter.ContentTemplateSelectorProperty, this);

            // if ContentTemplateSelector is really changing (and in use), remove the old template 
            this.Template = null;
        },
        

        ///     This method is invoked when the ContentStringFormat property changes.
        /// <param name="oldContentStringFormat">The old value of the ContentStringFormat property.</param>
        /// <param name="newContentStringFormat">The new value of the ContentStringFormat property.</param> 
//        protected virtual void 
        OnContentStringFormatChanged:function(/*String*/ oldContentStringFormat, /*String*/ newContentStringFormat)
        { 
            // force on-demand regeneration of the formatting templates for XML and String content 
        	ContentPresenter.StringFormattingTemplateField.ClearValue(this); 
        	ContentPresenter.AccessTextFormattingTemplateField.ClearValue(this);
        },
        
        /// Called when the Template's tree is about to be generated 
//        internal override void 
        OnPreApplyTemplate:function()
        { 
//            base.OnPreApplyTemplate();
        	FrameworkElement.prototype.OnPreApplyTemplate.call(this);

            // If we're inflating our visual tree but our TemplatedParent is null,
            // we might have been removed from the visual tree but not have had 
            // our ContentProperty invalidated.  This would mean that when we go
            // to reparent our content, we'll be looking at a stale cache.  Make 
            // sure to invalidate the Content property in this case. 
            if (this.TemplatedParent == null)
            { 
                // call GetValueCore to get this value from its TemplatedParent
                this.InvalidateProperty(ContentPresenter.ContentProperty);
            }
 
 
            if (!this._templateIsCurrent)
            { 
            	this.EnsureTemplate();
            	this._templateIsCurrent = true;
            }
        }, 

 
//        /// Updates DesiredSize of the ContentPresenter.  Called by parent UIElement.  This is the first pass of layout.
//        /// <remarks>
//        /// ContentPresenter determines a desired size it needs from the child's sizing properties, margin, and requested size.
//        /// </remarks>
//        /// <param name="constraint">Constraint size is an "upper limit" that the return value should not exceed.</param> 
//        /// <returns>The ContentPresenter's desired size.</returns>
////        protected override Size 
        MeasureOverride:function() 
        { 
            return Helper.MeasureElementWithSingleChild(this);
        },


        /// <summary>
        /// ContentPresenter computes the position of its single child inside child's Margin and calls Arrange 
        /// on the child.
        /// </summary> 
        /// <param name="arrangeSize">Size the ContentPresenter will assume.</param> 
//        protected override Size 
        ArrangeOverride:function()
        { 
//        	this._dom = parent;
        	if(this.ArrangeDirty){
//            	parent.appendChild(this._dom);
                return Helper.ArrangeElementWithSingleChild(this);
        		this.ArrangeDirty = false;
        	}
        },

 
        /// Return the template to use.  This may depend on the Content, or 
        /// other properties. 
        /// <remarks> 
        /// The base class implements the following rules:
        ///   (a) If ContentTemplate is set, use it.
        ///   (b) If ContentTemplateSelector is set, call its
        ///         SelectTemplate method.  If the result is not null, use it. 
        ///   (c) Look for a DataTemplate whose DataType matches the
        ///         Content among the resources known to the ContentPresenter 
        ///         (including application, theme, and system resources). 
        ///         If one is found, use it.
        ///   (d) If the type of Content is "common", use a standard template. 
        ///         The common types are String, XmlNode, UIElement.
        ///   (e) Otherwise, use a default template that essentially converts
        ///         Content to a string and displays it in a TextBlock.
        /// Derived classes can override these rules and implement their own. 
        /// </remarks>
//        protected virtual DataTemplate 
        ChooseTemplate:function() 
        { 
            /*DataTemplate*/var template = null;
            /*object*/var content = this.Content; 

            // ContentTemplate has first stab
            template = this.ContentTemplate;
 
            // no ContentTemplate set, try ContentTemplateSelector
            if (template == null) 
            { 
                if (this.ContentTemplateSelector != null)
                { 
                    template = this.ContentTemplateSelector.SelectTemplate(content, this);
                }
            }
 
            // if that failed, try the default TemplateSelector
            if (template == null) 
            { 
                template = ContentPresenter.DefaultTemplateSelector.SelectTemplate(content, this);
            } 

            return template;
        },
 

        /// Prepare to display the item.
//        internal void 
        PrepareContentPresenter:function(/*object*/ item,
                                /*DataTemplate*/ itemTemplate, 
                                /*DataTemplateSelector*/ itemTemplateSelector,
                                /*string*/ stringFormat) 
        { 
            if (item != this)
            { 
                // copy templates from parent ItemsControl
                if (this._contentIsItem || !this.HasNonDefaultValue(ContentPresenter.ContentProperty))
                {
                	this.Content = item; 
                	this._contentIsItem = true;
                } 
                if (itemTemplate != null) 
                	this.SetValue(ContentPresenter.ContentTemplateProperty, itemTemplate);
                if (itemTemplateSelector != null) 
                	this.SetValue(ContentPresenter.ContentTemplateSelectorProperty, itemTemplateSelector);
                if (stringFormat != null)
                	this.SetValue(ContentPresenter.ContentStringFormatProperty, stringFormat);
            } 
        },
 
        /// Undo the effect of PrepareContentPresenter.
//        internal void 
        ClearContentPresenter:function(/*object*/ item)
        {
            if (item != this)
            { 
                if (this._contentIsItem)
                { 
                	this.Content = BindingExpressionBase.DisconnectedItem; 
                }
            } 
        },
        
        // Internal helper so FrameworkElement could see call the template changed virtual
//        internal override void 
        OnTemplateChangedInternal:function(/*FrameworkTemplate*/ oldTemplate, /*FrameworkTemplate*/ newTemplate) 
        {
            this.OnTemplateChanged(oldTemplate, newTemplate); 
        },

 
        ///     Template has changed
        /// <remarks>
        ///     When a Template changes, the VisualTree is removed. The new Template's
        ///     VisualTree will be created when ApplyTemplate is called
        /// </remarks> 
        /// <param name="oldTemplate">The old Template</param>
        /// <param name="newTemplate">The new Template</param> 
//        protected virtual void 
        OnTemplateChanged:function(/*DataTemplate*/ oldTemplate, /*DataTemplate*/ newTemplate) 
        {
        }, 

//        private void 
        EnsureTemplate:function() 
        {
            /*DataTemplate*/var oldTemplate = this.Template;
            /*DataTemplate*/var newTemplate = null;
 
            for (this._templateIsCurrent = false; !this._templateIsCurrent; )
            { 
                // normally this loop will execute exactly once.  The only exception 
                // is when setting the DataContext causes the ContentTemplate or
                // ContentTemplateSelector to change, presumably because they are 
                // themselves data-bound (see bug 128119).  In that case, we need
                // to call ChooseTemplate again, to pick up the new template.
                // We detect this case because _templateIsCurrent is reset to false
                // in OnContentTemplate[Selector]Changed, causing a second iteration 
                // of the loop.
            	this._templateIsCurrent = true; 
                newTemplate = this.ChooseTemplate(); 

                // if the template is changing, it's important that the code that cleans 
                // up the old template runs while the CP's DataContext is still set to
                // the old Content.  The way to get this effect is:
                //      a. change the template to null
                //      b. change the data context 
                //      c. change the template to the new value
 
                if (oldTemplate != newTemplate) 
                {
                	this.Template = null; 
                }

                if (newTemplate != ContentPresenter.UIElementContentTemplate)
                { 
                    // set data context to the content, so that the template can bind to
                    // properties of the content. 
                    this.DataContext = this.Content; 
                }
                else 
                {
                    // If we're using the content directly, clear the data context.
                    // The content expects to inherit.
                    this.ClearValue(FrameworkElement.DataContextProperty); 
                }
            } 
 
            this.Template = newTemplate;
 
            // if the template didn't change, we still need to force the content for the template to be regenerated;
            // so call StyleHelper's DoTemplateInvalidations directly
            if (oldTemplate == newTemplate)
            { 
                StyleHelper.DoTemplateInvalidations(this, oldTemplate);
            } 
        },

        // Select a template for string content 
//        DataTemplate 
        SelectTemplateForString:function(/*string*/ s)
        {
            /*DataTemplate*/var template;
            /*string*/var format = this.ContentStringFormat; 

            if (this.RecognizesAccessKey && s.IndexOf(AccessText.AccessKeyMarker) > -1) 
            { 
                template = (String.IsNullOrEmpty(format)) ? 
                		ContentPresenter.AccessTextContentTemplate : ContentPresenter.FormattingAccessTextContentTemplate;
            } 
            else
            {
                template = (String.IsNullOrEmpty(format)) ? 
                		ContentPresenter.StringContentTemplate : ContentPresenter.FormattingStringContentTemplate;
            } 

            return template; 
        } 
	});
	
	Object.defineProperties(ContentPresenter.prototype,{
        ///     Determine if ContentPresenter should use AccessText in its style 
//        public bool 
        RecognizesAccessKey: 
        {
            get:function() { return this.GetValue(ContentPresenter.RecognizesAccessKeyProperty); },
            set:function(value) { this.SetValue(ContentPresenter.RecognizesAccessKeyProperty, BooleanBoxes.Box(value)); }
        },
        

        ///     Content is the data used to generate the child elements of this control. 
//        public object 
        Content: 
        {
            get:function() { return this.GetValue(ContentControl.ContentProperty); },
            set:function(value) { this.SetValue(ContentControl.ContentProperty, value); }
        },
        
        ///     ContentTemplate is the template used to display the content of the control. 
//        public DataTemplate 
        ContentTemplate:
        { 
            get:function() { return this.GetValue(ContentControl.ContentTemplateProperty); },
            set:function(value) { this.SetValue(ContentControl.ContentTemplateProperty, value); }
        },
        ///     ContentTemplateSelector allows the application writer to provide custom logic
        ///     for choosing the template used to display the content of the control. 
        /// <remarks>
        ///     This property is ignored if <seealso cref="ContentTemplate"/> is set.
        /// </remarks> 
//        public DataTemplateSelector 
        ContentTemplateSelector:
        { 
            get:function() { return this.GetValue(ContentControl.ContentTemplateSelectorProperty); }, 
            set:function(value) { this.SetValue(ContentControl.ContentTemplateSelectorProperty, value); }
        }, 
        
        ///     ContentStringFormat is the format used to display the content of 
        ///     the control as a string.  This arises only when no template is
        ///     available. 
//        public String 
        ContentStringFormat:
        { 
            get:function() { return this.GetValue(ContentPresenter.ContentStringFormatProperty); },
            set:function(value) { this.SetValue(ContentPresenter.ContentStringFormatProperty, value); } 
        },
        
        ///     ContentSource is the base name to use during automatic aliasing. 
        ///     When a template contains a ContentPresenter with ContentSource="Abc",
        ///     its Content, ContentTemplate, ContentTemplateSelector, and ContentStringFormat
        ///     properties are automatically aliased to Abc, AbcTemplate, AbcTemplateSelector,
        ///     and AbcStringFormat respectively.  The two most useful values for 
        ///     ContentSource are "Content" and "Header";  the default is "Content".
        /// <remarks> 
        ///     This property only makes sense in a template.  It should not be set on
        ///     an actual ContentPresenter;  there will be no effect. 
        /// </remarks>
//        public string 
        ContentSource:
        {
            get:function() { 
            	var result = this.GetValue(ContentPresenter.ContentSourceProperty);
            	return  e= typeof(result) == 'string' ? result : null; },
            set:function(value) { this.SetValue(ContentPresenter.ContentSourceProperty, value); }
        }, 
        //-----------------------------------------------------
        // 
        //  Internal properties 
        //
        //------------------------------------------------------ 


        // Internal Helper so the FrameworkElement could see this property
//        internal override FrameworkTemplate 
        TemplateInternal: 
        {
            get:function() { return this.Template; } 
        }, 

        // Internal Helper so the FrameworkElement could see the template cache 
//        internal override FrameworkTemplate 
        TemplateCache:
        {
            get:function() { return this._templateCache; },
            set:function(value) { this._templateCache = value; } 
        },
 
//        internal bool 
        TemplateIsCurrent: 
        {
            get:function() { return this._templateIsCurrent; } 
        },
        

//        DataTemplate 
        FormattingAccessTextContentTemplate:
        { 
            get:function()
            {
                /*DataTemplate*/var template = ContentPresenter.AccessTextFormattingTemplateField.GetValue(this);
                if (template == null) 
                {
                    /*Binding*/var binding = new Binding(); 
                    binding.StringFormat = this.ContentStringFormat; 

                    /*FrameworkElementFactory*/var text = CreateAccessTextFactory(); 
                    text.SetBinding(AccessText.TextProperty, binding);

                    template = new DataTemplate();
                    template.VisualTree = text; 
                    template.Seal();
 
                    ContentPresenter.AccessTextFormattingTemplateField.SetValue(this, template); 
                }
                return template; 
            }
        },

//        DataTemplate 
        FormattingStringContentTemplate: 
        {
            get:function() 
            { 
                /*DataTemplate*/var template = ContentPresenter.StringFormattingTemplateField.GetValue(this);
                if (template == null) 
                {
                    /*Binding*/var binding = new Binding();
                    binding.StringFormat = ContentStringFormat;
 
                    /*FrameworkElementFactory*/var text = CreateTextBlockFactory();
                    text.SetBinding(TextBlock.TextProperty, binding); 
 
                    template = new DataTemplate();
                    template.VisualTree = text; 
                    template.Seal();

                    ContentPresenter.StringFormattingTemplateField.SetValue(this, template);
                } 
                return template;
            } 
        },
        
//        DataTemplate 
        FormattingXmlNodeContentTemplate: 
        {
            get:function()
            {
                /*DataTemplate*/var template = ContentPresenter.XMLFormattingTemplateField.GetValue(this); 
                if (template == null)
                { 
                    var binding = new Binding(); 
                    binding.XPath = ".";
                    binding.StringFormat = ContentStringFormat; 

                    /*FrameworkElementFactory*/var text = CreateTextBlockFactory();
                    text.SetBinding(TextBlock.TextProperty, binding);
 
                    template = new DataTemplate();
                    template.VisualTree = text; 
                    template.Seal(); 

                    ContentPresenter.XMLFormattingTemplateField.SetValue(this, template); 
                }
                return template;
            }
        },

        /// Template Property 
//        private DataTemplate 
        Template: 
        { 
            get:function() {  return this._templateCache; },
            set:function(value) { this.SetValue(ContentPresenter.TemplateProperty, value); } 
        },

        // return true if the template was chosen by SelectTemplateForString 
//        bool 
        IsUsingDefaultStringTemplate:
        {
            get:function()
            { 
                if (this.Template == ContentPresenter.StringContentTemplate ||
                		this.Template == ContentPresenter.AccessTextContentTemplate) 
                { 
                    return true;
                } 

                /*DataTemplate*/var template;

                template = ContentPresenter.StringFormattingTemplateField.GetValue(this); 
                if (template != null && template == this.Template)
                { 
                    return true; 
                }
 
                template = ContentPresenter.AccessTextFormattingTemplateField.GetValue(this);
                if (template != null && template == this.Template)
                {
                    return true; 
                }
 
                return false; 
            }
        },
        
	});
	
	Object.defineProperties(ContentPresenter, {
        ///     The DependencyProperty for the RecognizesAccessKey property.
        ///     Flags:              None 
        ///     Default Value:      false
//        public static readonly DependencyProperty 
        RecognizesAccessKeyProperty:
        {
        	get:function(){
        		if(ContentPresenter._RecognizesAccessKeyProperty === undefined){
        			ContentPresenter._RecognizesAccessKeyProperty =
                        DependencyProperty.Register( 
                                "RecognizesAccessKey",
                                Boolean.Type,
                                ContentPresenter.Type,
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false)); 
        		}
        		
        		return ContentPresenter._RecognizesAccessKeyProperty;
        	}
			
        },

 

        ///     The DependencyProperty for the Content property. 
        ///     Flags:              None
        ///     Default Value:      null 
        // Any change in Content properties affectes layout measurement since
        // a new template may be used. On measurement,
        // ApplyTemplate will be invoked leading to possible application 
        // of a new template.
//        public static readonly DependencyProperty 
        ContentProperty:
        {
        	get:function(){
        		if(ContentPresenter._ContentProperty === undefined){
        			ContentPresenter._ContentProperty = 
                        ContentControl.ContentProperty.AddOwner(
                        		ContentPresenter.Type, 
                                /*new FrameworkPropertyMetadata(
                                    (object)null,
                                    FrameworkPropertyMetadataOptions.AffectsMeasure,
                                    new PropertyChangedCallback(null, OnContentChanged))*/
                        		FrameworkPropertyMetadata.Build3PCCB(
                                        /*(object)*/null,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(null, OnContentChanged))); 
        		}
        		
        		return ContentPresenter._ContentProperty;
        	}
			
        }, 
        
        ///     The DependencyProperty for the ContentTemplate property.
        ///     Flags:              None
        ///     Default Value:      null
//        public static readonly DependencyProperty 
        ContentTemplateProperty:
        {
        	get:function(){
        		if(ContentPresenter._ContentTemplateProperty === undefined){
        			ContentPresenter._ContentTemplateProperty = 
                        ContentControl.ContentTemplateProperty.AddOwner( 
                        		ContentPresenter.Type,
                                /*new FrameworkPropertyMetadata( 
                                        (DataTemplate)null,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(OnContentTemplateChanged))*/
                        		FrameworkPropertyMetadata.Build3PCCB( 
                                        null,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(null, OnContentTemplateChanged)));
        		}
        		
        		return ContentPresenter._ContentTemplateProperty;
        	}
			
        }, 
        
        ///     The DependencyProperty for the ContentTemplateSelector property.
        ///     Flags:              None 
        ///     Default Value:      null
//        public static readonly DependencyProperty 
        ContentTemplateSelectorProperty:
        {
        	get:function(){
        		if(ContentPresenter._ContentTemplateSelectorProperty === undefined){
        			ContentPresenter._ContentTemplateSelectorProperty =
                        ContentControl.ContentTemplateSelectorProperty.AddOwner( 
                        		ContentPresenter.Type,
                                /*new FrameworkPropertyMetadata(
                                        (DataTemplateSelector)null,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(OnContentTemplateSelectorChanged))*/
                        		FrameworkPropertyMetadata.Build3PCCB(
                                        null,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(null, OnContentTemplateSelectorChanged))); 
        		}
        		
        		return ContentPresenter._ContentTemplateSelectorProperty;
        	}
			
        }, 
        
        ///     The DependencyProperty for the ContentStringFormat property. 
        ///     Flags:              None
        ///     Default Value:      null
//        public static readonly DependencyProperty 
        ContentStringFormatProperty:
        {
        	get:function(){
        		if(ContentPresenter._ContentStringFormatProperty === undefined){
        			ContentPresenter._ContentStringFormatProperty =
                        DependencyProperty.Register( 
                                "ContentStringFormat", 
                                String.Type,
                                ContentPresenter.Type, 
                                /*new FrameworkPropertyMetadata(
                                        (String) null,
                                      new PropertyChangedCallback(OnContentStringFormatChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
                                        null,
                                      new PropertyChangedCallback(null, OnContentStringFormatChanged)));
        		}
        		
        		return ContentPresenter._ContentStringFormatProperty;
        	}
			
        }, 
        
        ///     The DependencyProperty for the ContentSource property.
        ///     Flags:              None 
        ///     Default Value:      Content 
//        public static readonly DependencyProperty 
        ContentSourceProperty:
        {
        	get:function(){
        		if(ContentPresenter._ContentSourceProperty === undefined){
        			ContentPresenter._ContentSourceProperty =
                        DependencyProperty.Register(
                                "ContentSource",
                                String.Type, 
                                ContentPresenter.Type,
                                /*new FrameworkPropertyMetadata("Content")*/
                                FrameworkPropertyMetadata.BuildWithDV("Content"));  
        		}
        		
        		return ContentPresenter._ContentSourceProperty;
        	}
			
        }, 
        
        
        /// TemplateProperty
//        internal static readonly DependencyProperty 
        TemplateProperty:
        {
        	get:function(){
        		if(ContentPresenter._TemplateProperty === undefined){
        			ContentPresenter._TemplateProperty =
                        DependencyProperty.Register(
                                "Template",
                                DataTemplate.Type, 
                                ContentPresenter.Type,
                                /*new FrameworkPropertyMetadata( 
                                        (DataTemplate) null,  // default value 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(null, OnTemplateChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB( 
                                        null,  // default value 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure,
                                        new PropertyChangedCallback(null, OnTemplateChanged))); 
        		}
        		
        		return ContentPresenter._TemplateProperty;
        	}
			
        }, 

//        private static readonly UncommonField<DataTemplate> 
        StringFormattingTemplateField:
        {
        	get:function(){
        		if(ContentPresenter._StringFormattingTemplateField === undefined){
        			ContentPresenter._StringFormattingTemplateField = new UncommonField();
        		}
        		
        		return ContentPresenter._StringFormattingTemplateField;
        	}
        }, 
//        private static readonly UncommonField<DataTemplate> 
        AccessTextFormattingTemplateField:
        {
        	get:function(){
        		if(ContentPresenter._AccessTextFormattingTemplateField === undefined){
        			ContentPresenter._AccessTextFormattingTemplateField = new UncommonField();
        		}
        		
        		return ContentPresenter._AccessTextFormattingTemplateField;
        	}
        },
        
//        static DataTemplate 
        XmlNodeContentTemplate: 
        { 
            get:function() { Initialize(); return s_XmlNodeTemplate; }
        },

//        static DataTemplate 
        UIElementContentTemplate:
        {
            get:function() { Initialize(); return s_UIElementTemplate; } 
        },
 
//        static DataTemplate 
        DefaultContentTemplate: 
        {
            get:function() { Initialize(); return s_DefaultTemplate; } 
        },

//        static DefaultSelector 
        DefaultTemplateSelector:
        { 
            get:function() { Initialize(); return s_DefaultTemplateSelector; }
        },
        

//      internal static DataTemplate 
        AccessTextContentTemplate:
        {
        	get:function() { Initialize(); return s_AccessTextTemplate; } 
        },

//      internal static DataTemplate 
        StringContentTemplate: 
        {
        	get:function() { Initialize(); return s_StringTemplate; } 
        },
 
	});
	
    ///     Called when ContentStringFormatProperty is invalidated on "d."
//    private static void 
    function OnContentStringFormatChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        ContentPresenter ctrl = (ContentPresenter)d;
        d.OnContentStringFormatChanged( e.OldValue,  e.NewValue); 
    }
	
    ///     Called when ContentProperty is invalidated on "d." 
//    private static void 
    function OnContentChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        /*ContentPresenter*/var ctrl = /*(ContentPresenter)*/d;

        // if we're already marked to reselect the template, there's nothing more to do 
        if (!ctrl._templateIsCurrent)
            return; 

        var mismatch;

        if (e.NewValue == BindingExpressionBase.DisconnectedItem)
        {
            mismatch = false;       // do not change templates when disconnecting
        } 
        else if (ctrl.ContentTemplate != null)
        { 
            mismatch = false;       // explicit template - matches by fiat 
        }
        else if (ctrl.ContentTemplateSelector != null) 
        {
            mismatch = true;        // template selector - always re-select
        }
        else if (ctrl.Template == ContentPresenter.UIElementContentTemplate) 
        {
            mismatch = true;        // direct template - always re-apply 
            ctrl.Template = null;   // and release the old content so it can be re-used elsewhere 
        }
        else if (ctrl.Template == ContentPresenter.DefaultContentTemplate) 
        {
            mismatch = true;        // default template - always re-apply
        }
        else 
        {
            // implicit template - matches if data types agree 
            /*Type*/var type;  // unused 
            /*object*/var oldDataType = ContentPresenter.DataTypeForItem(e.OldValue, ctrl, {"type" : null}/*out type*/);
            /*object*/var newDataType = ContentPresenter.DataTypeForItem(e.NewValue, ctrl, {"type" : null}/*out type*/); 
            mismatch = (oldDataType != newDataType);

            // but mismatch if we're displaying strings via a default template
            // and the presence of an AccessKey changes 
            if (!mismatch &&
                ctrl.RecognizesAccessKey && 
                Object.ReferenceEquals(String.Type, newDataType) && 
                ctrl.IsUsingDefaultStringTemplate)
            { 
                /*String*/var oldString = e.OldValue;
                /*String*/var newString = e.NewValue;
                /*bool*/var oldHasAccessKey = (oldString.indexOf(AccessText.AccessKeyMarker) > -1);
                /*bool*/var newHasAccessKey = (newString.indexOf(AccessText.AccessKeyMarker) > -1); 

                if (oldHasAccessKey != newHasAccessKey) 
                { 
                    mismatch = true;
                } 
            }
        }

        // if the content and (old) template don't match, reselect the template 
        if (mismatch)
        { 
            ctrl._templateIsCurrent = false; 
        }

        // keep the DataContext in [....] with Content
        if (ctrl._templateIsCurrent && ctrl.Template != ContentPresenter.UIElementContentTemplate)
        {
            ctrl.DataContext = e.NewValue; 
        }
    } 

    
    ///     Called when ContentTemplateProperty is invalidated on "d." 
//    private static void 
    function OnContentTemplateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        /*ContentPresenter*/var ctrl = /*(ContentPresenter)*/d;
        ctrl._templateIsCurrent = false;
        ctrl.OnContentTemplateChanged( e.OldValue,  e.NewValue);
    } 

    ///     Called when ContentTemplateSelectorProperty is invalidated on "d." 
//    private static void 
    function OnContentTemplateSelectorChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        /*ContentPresenter*/var ctrl = /*(ContentPresenter)*/ d;
        ctrl._templateIsCurrent = false; 
        ctrl.OnContentTemplateSelectorChanged( e.OldValue,  e.NewValue);
    }
    
//    internal static object 
    ContentPresenter.DataTypeForItem = function(/*object*/ item, /*DependencyObject*/ target, typeOut/*out Type type*/)
    { 
        if (item == null)
        { 
        	typeOut.type = null; 
            return null;
        } 

        /*object*/var dataType;
//        typeOut.type = ReflectionHelper.GetReflectionType(item);
        typeOut.type = item.GetType();

        if (typeOut.type == Object.Type) 
        { 
            dataType = null;     // don't search for Object - perf
        } 
        else
        {
            dataType = typeOut.type;
        } 

        return dataType; 
    };
    

    // Property invalidation callback invoked when TemplateProperty is invalidated 
//    private static void 
    function OnTemplateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        /*ContentPresenter*/var c = /*(ContentPresenter)*/ d;
        StyleHelper.UpdateTemplateCache(c,  e.OldValue,  e.NewValue, ContentPresenter.TemplateProperty); 
    }
    
    // ContentPresenter often has occasion to display text.  The TextBlock it uses 
    // should get the values for various text-related properties (foreground, fonts,
    // decoration, trimming) from the governing ContentControl.  The following
    // two methods accomplish this - first for the case where the TextBlock appears
    // in a true template, then for the case where the TextBlock is created on 
    // demand via BuildVisualTree.

    // Create a FEF for a AccessText, to be used in a default template 
//    internal static FrameworkElementFactory 
//    ContentPresenter.CreateAccessTextFactory = function()
    function CreateAccessTextFactory()
    { 
        /*FrameworkElementFactory*/var text = new (EnsureFrameworkElementFactory())(AccessText.Type);

        return text;
    }; 

    // Create a FEF for a TextBlock, to be used in a default template 
//    internal static FrameworkElementFactory 
//    ContentPresenter.CreateTextBlockFactory = function() 
    function CreateTextBlockFactory()
    {
        /*FrameworkElementFactory*/var text = new (EnsureFrameworkElementFactory())(TextBlock.Type); 

        return text;
    };

    // Create a TextBlock, to be used in a default "template" (via BuildVisualTree)
//    static TextBlock 
//    ContentPresenter.CreateTextBlock = function(/*ContentPresenter*/ container) 4
    function CreateTextBlock()
    { 
        /*TextBlock*/var text = new TextBlock();

        return text;
    };
    
    var initialized = false;
    
//    static ContentPresenter()
    function Initialize()
    { 
    	if(initialized){
    		return;
    	}
    	initialized = true;
    	
        /*DataTemplate*/var template;
        /*FrameworkElementFactory*/var text; 
        /*Binding*/var binding; 

        // Default template for strings when hosted in ContentPresener with RecognizesAccessKey=true 
        template = new DataTemplate();
        text = CreateAccessTextFactory();
        text.SetValue(AccessText.TextProperty, new TemplateBindingExtension(ContentPresenter.ContentProperty));
        template.VisualTree = text; 
        template.Seal();
        s_AccessTextTemplate = template; 

        // Default template for strings
        template = new DataTemplate(); 
        text = CreateTextBlockFactory();
        text.SetValue(TextBlock.TextProperty, new TemplateBindingExtension(ContentPresenter.ContentProperty));
        template.VisualTree = text;
        template.Seal(); 
        s_StringTemplate = template;

        // Default template for XmlNodes 
        template = new DataTemplate();
        text = CreateTextBlockFactory(); 
        binding = new Binding();
        binding.XPath = ".";
        text.SetBinding(TextBlock.TextProperty, binding);
        template.VisualTree = text; 
        template.Seal();
        s_XmlNodeTemplate = template; 

        // Default template for UIElements
        template = new UseContentTemplate(); 
        template.Seal();
        s_UIElementTemplate = template;

        // Default template for everything else 
        template = new DefaultTemplate();
        template.Seal(); 
        s_DefaultTemplate = template; 

        // Default template selector 
        s_DefaultTemplateSelector = new DefaultSelector();
    }
	
    ContentPresenter.Type = new Type("ContentPresenter", ContentPresenter, [FrameworkElement.Type]);
//    Initialize();
	return ContentPresenter;
});



