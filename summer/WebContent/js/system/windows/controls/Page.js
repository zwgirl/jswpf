/**
 * Page
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement", "documents/TextElement", "windows/FrameworkPropertyMetadata", 
        "windows/FrameworkPropertyMetadataOptions", "windows/PropertyChangedCallback", "windows/IWindowService",
        "windows/DependencyPropertyChangedEventArgs", "windows/SingleChildEnumerator", "controls/Panel",
        "windows/UIElement"], 
		function(declare, Type, FrameworkElement, TextElement, FrameworkPropertyMetadata,
				FrameworkPropertyMetadataOptions, PropertyChangedCallback, IWindowService,
				DependencyPropertyChangedEventArgs, SingleChildEnumerator, Panel,
				UIElement){
	
    var SetPropertyFlags = declare("SetPropertyFlags", null,{});
    SetPropertyFlags.WindowTitle         = 0x01; 
    SetPropertyFlags.WindowHeight        = 0x02; 
    SetPropertyFlags.WindowWidth         = 0x04;
    SetPropertyFlags.Title               = 0x08; 
    SetPropertyFlags.ShowsNavigationUI   = 0x10;

    SetPropertyFlags.None                = 0x00;
    
    
    //
//  private static DependencyObjectType 
  	var _dType;
	var Page = declare("Page", [FrameworkElement,IWindowService, IAddChild], {
		constructor:function(){
            // Initialize the _templateCache to the default value for TemplateProperty.
            // If the default value is non-null then wire it to the current instance. 
            /*PropertyMetadata*/var metadata = Page.TemplateProperty.GetMetadata(this.DependencyObjectType);
            /*ControlTemplate*/var defaultValue = metadata.DefaultValue; 
            if (defaultValue != null) 
            {
                this.OnTemplateChanged(this, 
                		/*new DependencyPropertyChangedEventArgs(Page.TemplateProperty, metadata, null, defaultValue)*/
                		DependencyPropertyChangedEventArgs.BuildPMOO(Page.TemplateProperty, metadata, null, defaultValue)); 
            }
            
            //---------------------------------------------- 
            //
            // Private Fields 
            //
            //----------------------------------------------
//            private IWindowService              
            this._currentIws = null; 
//            private PageHelperObject            
            this._pho = null;
//            private SetPropertyFlags            
            this._setPropertyFlags = SetPropertyFlags.None; 
//            private bool                        
            this._isTopLevel = false; 
//            private ControlTemplate             
            this._templateCache = null;

	        this._dom = window.document.body;
        	this._dom._source = this;
            this._dom.id = "Page";
	        this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
		
        /// <summary> 
        ///     Adds a child. This is called by the parser 
        /// </summary>
        /// <param name="obj"></param> 
//        void IAddChild.
        AddChild:function(/*Object*/ obj)
        {
             // if content is the first child or being cleared, set directly
             if (this.Content == null || obj == null) 
             { 
            	 this.Content = obj;
             } 
             else
             {
                 throw new Error('InvalidOperationException(SR.Get(SRID.PageCannotHaveMultipleContent)');
             } 
        },
 
        ///<summary> 
        ///     This method is called by the parser when text appears under the tag in markup.
        ///     By default Page does not support text; calling this method has no effect. 
        ///</summary>
        ///<param name="str">
        ///     Text to add as a child.
        ///</param> 
//        void IAddChild.
        AddText:function (/*string*/ str)
        { 
            XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(str, this); 
        },
        
     // Internal helper so FrameworkElement could see call the template changed virtual
//        internal override void 
        OnTemplateChangedInternal:function(/*FrameworkTemplate*/ oldTemplate, /*FrameworkTemplate*/ newTemplate) 
        {
            this.OnTemplateChanged(/*(ControlTemplate)*/oldTemplate, /*(ControlTemplate)*/newTemplate);
        },
        /// <summary>
        ///     Template has changed 
        /// </summary>
        /// <remarks> 
        ///     When a Template changes, the VisualTree is removed. The new Template's 
        ///     VisualTree will be created when ApplyTemplate is called
        /// </remarks> 
        /// <param name="oldTemplate">The old Template</param>
        /// <param name="newTemplate">The new Template</param>
//        protected virtual void 
        OnTemplateChanged:function(
            /*ControlTemplate*/ oldTemplate, /*ControlTemplate*/ newTemplate) 
        {
        },
 
        /// <summary>
        ///     Measurement override. 
        /// </summary> 
        /// <param name="constraint">
        ///     Sizing constraint. 
        /// </param>
//        protected override Size 
        MeasureOverride:function()
        {
            var count = this.VisualChildrenCount;
 
            if (count > 0)
            { 
                /*UIElement*/var child = this.GetVisualChild(0);
                child = child instanceof UIElement ? child : null;

                if (child != null)
                { 
                    child.Measure();
                } 
            }
        },

        /// <summary> 
        ///     ArrangeOverride allows for the customization of the positioning of children.
        /// </summary> 
        /// <param name="arrangeBounds"> 
        ///     Measured size.
        /// </param> 
//        protected override Size 
        ArrangeOverride:function()
        {
            var count = this.VisualChildrenCount; 

            if (count > 0) 
            { 
                /*UIElement*/var child = this.GetVisualChild(0);
                child = child instanceof UIElement ? child : null;
 
                if (child != null)
                {
                	child._parentDom = this._dom;
                    child.Arrange(this._dom);
                    this._dom.appendChild(child._dom);
                } 
            }
            this.SetUpStyle();
            
            if(!String.IsNullOrEmpty(this.Title)){
                window.document.title = this.Title;
            }
            
        },
        
        SetUpStyle:function(){
//        	var background = this.Background;
//        	if(background != null){
//        		this._dom.style.setProperty("color", background.Color.ToString(), "");
//        	}
//        	
//        	var foreground = this.Foreground;
//           	if( foreground!= null){
//        		this._dom.style.setProperty("background-color", foreground.Color.ToString(), "");
//        	}
//           	
//           	var fontSize = this.FontSize;
//           	if(fontSize != null){
//        		this._dom.style.setProperty("font-size", fontSize + "pt" , "");
//        	}
//        	
//        	var fontFamily = this.FontFamily;
//        	if(this.FontFamily != null){
//        		this._dom.style.setProperty("font-family", fontFamily.ToString(), "");
//        	}
        	
        },

        /// <summary> 
        /// OnVisualParentChanged is called when the parent of the Visual is changed.
        /// </summary>
        /// <param name="oldParent">Old parent or null if the Visual did not have a parent before.</param>
//        protected internal sealed override void 
        OnVisualParentChanged:function(/*DependencyObject*/ oldParent) 
        {
        	FrameworkElement.prototype.OnVisualParentChanged.call(this, oldParent); 

            // When Page is added to a tree, it can only be the root element of Window's or Frame's Content. 
            // In code, it means you can only add Page to a tree via Window.Content = Page, Frame.Content = Page,
            // or equivalent such as navigation.
            // So we only allow a Page to be parented by a Visual (parent) in the following
            // cases: 
            // 1. The visual parent is null.
            // 2. The logical parent is Window (Frame's Content is not its logical child). 
            // 3. When the logical parent is not Window, it can only be the case of Page inside of a Frame. We can verify that 
            //    by checking the Content of the Page's NavigationService is the Page itself.
            //    The NavigationService dp and its Content property both are set before logical and/or visual Parent change. 
            // 4. Exception should be thrown in any other situations, except for the v1 compatibility case below.

            /*Visual*/var visualParent = VisualTreeHelper.GetParent(this);
            visualParent = visualParent instanceof Visual ? visualParent : null;
 
            // Need to check whether visual parent is null first, because if the app caught the exception as a result of setting illegal parent,
            // and it removes the Page from the wrongly set parent, the visual link is removed first before the logical link. 
            // As a result when OnVisualParentChanged is fired, visualParent is null while the logical Parent is still the old one; Parent getter 
            // here will return the illegal one.
 
            if ((visualParent == null) ||
                (this.Parent instanceof Window) ||
                ((this.NavigationService != null) && (this.NavigationService.Content == this)))
            { 
                return;
            } 
 
            // NOTE ([....] 03/09/2007): The code below walks up the TemplatedParent chain until it finds the first Frame or Window. It does not
            // check whether Window.Content or Frame.Content is Page. So it allows the scenario where Page can be in any element�s template and 
            // be parented by any element as long as the template is nested inside a Window or Frame, as demoed below
            //
            // <Window>
            //    <Window.Template> 
            //         ...
            //         <Button> 
            //            <Button.Template> 
            //               ...
            //              <DockPanel> 
            //               ...
            //               <Page>
            //         ...
            // 
            // This is not what we intend to establish and support. But we discovered this after shipping V1. We need to maintain this behavior until
            // V4.0 when we will have an opportunity to do BC. Will file a bug for V4.0. 
 
            /*bool*/
            var isParentValid = false;
            // Don't worry about FCE since FCE is not a visual 
            /*FrameworkElement*/
            var feParent = visualParent instanceof FrameworkElement ? visualParent : null;
            if (feParent != null)
            {
                /*DependencyObject*/
            	var parent = feParent instanceof DependencyObject ? feParent : null; 

                // walk the StyledParent chain 
                while ((feParent != null) && (feParent.TemplatedParent != null)) 
                {
                    parent = feParent.TemplatedParent; 
                    // don't care if this cast fails to null b/c StyledParent
                    // are supposed to be FE or FCE and FCE is not part of the
                    // visual tree.
                    feParent = parent instanceof FrameworkElement ? parent : null; 

                    // hamidm - 06/03/2005 
                    // WOSB: 1182589 Page throws InvalidOperationException when 
                    // navigated to by a Frame which is part of the style visual
                    // tree of an element 

                    // We need this here for the case when Frame is in the style
                    // of an element
                    if (feParent instanceof Frame) 
                    {
                        break; 
                    } 
                }
 
                if ((parent instanceof Window) || (parent instanceof Frame))
                {
                    isParentValid = true;
                } 
            }
 
            if (isParentValid == false) 
            {
                throw new InvalidOperationException(SR.Get(SRID.ParentOfPageMustBeWindowOrFrame)); 
            }
        },
        
//        internal bool 
        ShouldJournalWindowTitle:function() 
        {
            return this.IsPropertySet(SetPropertyFlags.WindowTitle); 
        },
        
//        private void 
        OnContentChanged:function(/*object*/ oldContent, /*object*/ newContent)
        {
            this.RemoveLogicalChild(oldContent);
            this.AddLogicalChild(newContent); 
        },
        /// <summary> 
        ///     When IWindowService is changed, it means that this control is either placed into 
        ///     a window's visual tree or taken out.  If we are in a new Window's visual tree and this
        ///     was a top level Page in the old Window, want to unhook events from the old window. 
        ///     Additionally, if this Page is a top level Page in the new Window's visual tree, we hook
        ///     the events up to the new window.  Moreover, we also want to propagate the cached properties
        ///     for top level Pages, otherwise, we clear the cache.
        ///     NOTE: the property values are propaged to the first window Page is attached to.  For 
        ///     subsequent windows these properties are not propagated.
        /// </summary> 
//        private void 
        OnWindowServiceChanged:function(/*IWindowService*/ iws) 
        {
            this._currentIws = iws; 
            this.DetermineTopLevel();

            if (this._currentIws != null)
            { 
                if (this._isTopLevel == true)
                { 
                	this.PropagateProperties(); 
                }
            } 
        },

//        private void 
        DetermineTopLevel:function()
        { 
            /*FrameworkElement*/var feParent = this.Parent instanceof FrameworkElement ? this.Parent : null;
 
            if ((feParent != null) && (feParent.InheritanceBehavior == InheritanceBehavior.Default)) 
            {
                this._isTopLevel = true; 
            }
            else
            {
            	this._isTopLevel = false; 
            }
        }, 
 
//        private void 
        PropagateProperties:function()
        { 
//            Debug.Assert(_currentIws != null, "_currentIws cannot be null here. Caller should always verify it");

            if (this._pho == null)
            { 
                return;
            } 
 
            if (this.IsPropertySet(SetPropertyFlags.WindowTitle))
            { 
            	this._currentIws.Title = PageHelperObject._windowTitle;
            }
            if (this.IsPropertySet(SetPropertyFlags.WindowHeight) && (! this._currentIws.UserResized))
            { 
            	this._currentIws.Height = PageHelperObject._windowHeight;
            } 
 
            if (this.IsPropertySet(SetPropertyFlags.WindowWidth) && (! this._currentIws.UserResized))
            { 
            	this._currentIws.Width = PageHelperObject._windowWidth;
            }

            if (this.IsPropertySet(SetPropertyFlags.ShowsNavigationUI)) 
            {
            	this.SetShowsNavigationUI(PageHelperObject._showsNavigationUI); 
            } 
        },
        
        
//        private void 
        SetShowsNavigationUI:function(/*bool*/ showsNavigationUI)
        {
            /*NavigationWindow*/var navWin = this._currentIws instanceof NavigationWindow ? this._currentIws : null;
            if (navWin != null) 
            {
                navWin.ShowsNavigationUI = showsNavigationUI; 
            } 
        },
 
//        private bool 
        IsPropertySet:function(/*SetPropertyFlags*/ property)
        {
            return (this._setPropertyFlags & property) != 0;
        },

//        private void 
        PropertyIsSet:function(/*SetPropertyFlags*/ property) 
        { 
        	this._setPropertyFlags |= property;
        },
        
        /// <summary>
        ///     Notification that a specified property has been changed 
        /// </summary>
        /// <param name="e">EventArgs that contains the property, metadata, old value, and new value for this change</param>
//        protected override void 
        OnPropertyChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
            /*DependencyProperty*/var dp = e.Property;
 
//            base.OnPropertyChanged(e); 
            FrameworkElement.prototype.OnPropertyChanged.call(this, e); 

            if (e.IsAValueChange || e.IsASubPropertyChange) 
            {
            	if(dp === Page.BackgroundProperty){
            		if(e.NewValue){
            			this._dom.style.setProperty("background-color", e.NewValue.ToString()); 
            		}else{
            			this._dom.style.setProperty("background-color", "");
            		}
            	}
            	
            	if(dp === Page.ForegroundProperty){
            		if(e.NewValue){
            			this._dom.style.setProperty("color", e.NewValue.ToString()); 
            		}else{
            			this._dom.style.setProperty("color", "");
            		}
            	}
            	
            	if(dp === Page.FontSizeProperty){
            		if(e.NewValue){
            			this._dom.style.setProperty("font-size", e.NewValue + 'pt'); 
            		}else{
            			this._dom.style.setProperty("font-size", "");
            		}
            	}
            	
            	if(dp === Page.FontFamilyProperty){
            		if(e.NewValue){
            			this._dom.style.setProperty("font-family", e.NewValue.ToString()); 
            		}else{
            			this._dom.style.setProperty("font-family", "");
            		}
            	}
            }
        }
	});
	
	Object.defineProperties(Page.prototype,{
	       /// <summary>
        ///     Returns enumerator to logical children 
        /// </summary>
//        protected internal override IEnumerator 
        LogicalChildren:
        { 
            get:function()
            { 
                return new SingleChildEnumerator(this.Content);
            }
        },
        
        /// <summary>
        ///     Content of the Page
        /// </summary>
        /// <remarks> 
        ///     Page only supports one child
        /// </remarks> 
//        public Object 
        Content:
        {
            get:function() 
            {
                return this.GetValue(Page.ContentProperty);
            },
            set:function(value)
            { 
            	this.SetValue(Page.ContentProperty, value);
            } 
        },

        // All these properties are implemented
        // as "bound" to the window service.  For 
        // example, getting WindowTitle will return Window.Title,
        // setting WindowTitle will set Window.Title. 
        // 

//        string IWindowService.
        Title: 
        {
            get:function()
            {
                if (this.WindowService == null)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.CannotQueryPropertiesWhenPageNotInTreeWithWindow));
                }
                return this.WindowService.Title;
            },
 
            set:function(value)
            { 
                if (WindowService == null)
                { 
                    this.PageHelperObject._windowTitle = value;
                    this.PropertyIsSet(SetPropertyFlags.WindowTitle);
                }
                else if (this._isTopLevel == true) // only top level page can set this property 
                {
                	this.WindowService.Title = value; 
                    this.PropertyIsSet(SetPropertyFlags.WindowTitle); 
                }
            } 
        },

        /// <summary>
        ///    Proxy for Window Title property 
        /// </summary>
//        public string 
        WindowTitle: 
        {
            get:function() 
            {
                return this.Title;
            }, 

            set:function(value) 
            { 
                this.Title = value; 
            }
        },
        /// <summary> 
        /// Bound to IWindowService property
        /// </summary>
//        double IWindowService.
        Height:
        { 
            get:function()
            { 
                if (this.WindowService == null)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.CannotQueryPropertiesWhenPageNotInTreeWithWindow));
                } 
                return WindowService.Height;
            },
 
            set:function(value)
            { 
                if (this.WindowService == null)
                {
                	this.PageHelperObject._windowHeight = value; 
                	this.PropertyIsSet(SetPropertyFlags.WindowHeight);
                } 
                else if (_isTopLevel == true)// only top level page can set this property 
                {
                    if (!this.WindowService.UserResized) 
                    {
                    	this.WindowService.Height = value;
                    }
                    this.PropertyIsSet(SetPropertyFlags.WindowHeight); 
                }
            } 
        }, 

        /// <summary> 
        ///     Proxy to Window.Height property
        /// </summary>
//        public double 
        WindowHeight:
        { 
            get:function()
            { 
                return this.Height;
            },

            set:function(value)
            {
                /*((IWindowService)this)*/this.Height = value;
            } 
        }, 

        /// <summary> 
        ///     Proxy to Window.Width property
        /// </summary>
//        double IWindowService.
        Width:
        { 
            get:function()
            { 
                if (this.WindowService == null)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.CannotQueryPropertiesWhenPageNotInTreeWithWindow));
                } 
                return this.WindowService.Width;
            }, 
 
            set:function(value)
            { 
                if (this.WindowService == null)
                {
                	this.PageHelperObject._windowWidth = value; 
                	this.PropertyIsSet(SetPropertyFlags.WindowWidth);
                } 
                else if (this._isTopLevel == true) // only top level page can set this property 
                {
                    if (!this.WindowService.UserResized) 
                    {
                    	this.WindowService.Width = value;
                    }
                    this.PropertyIsSet(SetPropertyFlags.WindowWidth); 
                }
            } 
        }, 

        /// <summary> 
        /// Bound to IWindowService.Width property
        /// </summary>
//        public double 
        WindowWidth:
        { 
            get:function()
            { 
                return /*((IWindowService)this)*/this.Width;
            }, 

            set:function(value)
            {
                /*((IWindowService)this)*/this.Width = value;
            } 
        },
        
        /// <summary>
        ///     An object that describes the background.
//        /// </summary>
//        public Brush 
        Background:
        { 
            get:function() { return this.GetValue(Page.BackgroundProperty); },
            set:function(value) { this.SetValue(Page.BackgroundProperty, value); }
        }, 
        /// <summary>
        ///     An object that describes the Title.
        /// </summary> 
//        public string 
        Title:
        { 
            get:function() { return this.GetValue(Page.TitleProperty); }, 
            set:function(value) { this.SetValue(Page.TitleProperty, value); }
        }, 
        /// <summary>
        /// Determines whether to show the default navigation UI. 
        /// </summary>
//        public bool 
        ShowsNavigationUI:
        {
            get:function() 
            {
                if (this.WindowService == null) 
                {
                    throw new InvalidOperationException(SR.Get(SRID.CannotQueryPropertiesWhenPageNotInTreeWithWindow));
                }
 
                // Return false if it is not NavigationWindow.
//                NavigationWindow 
                var navWin = this.WindowService instanceof NavigationWindow ? WindowService : null; 
                if (navWin != null) 
                {
                    return navWin.ShowsNavigationUI; 
                }
                else
                {
                    return false; 
                }
            },
 
            set:function(value)
            { 
                if (this.WindowService == null)
                {
                	this.PageHelperObject._showsNavigationUI = value; 
                	this.PropertyIsSet(SetPropertyFlags.ShowsNavigationUI);
                } 
                else if (this._isTopLevel == true) // only top level page can set this property 
                {
                	this.SetShowsNavigationUI(value); 
                    this.PropertyIsSet(SetPropertyFlags.ShowsNavigationUI);
                }
            }
        }, 
        /// <summary>
        ///     An object that describes the KeepAlive status of the Page. 
        /// </summary>
//        public bool 
        KeepAlive: 
        { 
            get:function()
            { 
                return JournalEntry.GetKeepAlive(this);
            },

            set:function(value) 
            {
                JournalEntry.SetKeepAlive(this, value); 
            } 
        },
 
        /// <summary>
        /// NavigationServiceProperty
        /// </summary>
//        public NavigationService 
        NavigationService: 
        {
            get:function() 
            { 
                return NavigationService.GetNavigationService(this);
            } 
        },
        
      /// <summary>
        ///     An brush that describes the foreground color which is used by
        ///     via inheritance. 
        /// </summary>
//        public Brush 
        Foreground: 
        {
            get:function() { return this.GetValue(Page.ForegroundProperty); },
            set:function(value) { this.SetValue(Page.ForegroundProperty, value); }
        },

        /// <summary>
        ///     The font family of the desired font which is used via inheritance 
        /// </summary>
//        public FontFamily 
        FontFamily:
        {
            get:function() { return this.GetValue(Page.FontFamilyProperty); }, 
            set:function(value) { this.SetValue(Page.FontFamilyProperty, value); }
        }, 
        /// <summary> 
        ///     The size of the desired font which will be used via inheritance.
        /// </summary> 
//        public double 
        FontSize: 
        {
            get:function() { return this.GetValue(Page.FontSizeProperty); }, 
            set:function(value) { this.SetValue(Page.FontSizeProperty, value); } 
        },
        /// <summary> 
        /// Template Property
        /// </summary> 
//        public ControlTemplate 
        Template: 
        {
            get:function() { return this._templateCache; }, 
            set:function(value) { this.SetValue(Page.TemplateProperty, value); }
        },

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
        
        /// <summary>
        /// Returns IWindowService for the window page is hosted in. 
        /// </summary>
//        private IWindowService 
        WindowService:
        {
            get:function() 
            {
                return this._currentIws; 
            } 
        },
 
//        private PageHelperObject 
        PageHelperObject:
        {
            get:function()
            { 
                if (this._pho == null)
                { 
                	this._pho = new PageHelperObject(); 
                }
                return /*(ControlTemplate)*/this._pho; 
            }
        },
 
//        bool IWindowService.
        UserResized:
        {
            get:function()
            { 
//                Invariant.Assert(_currentIws != null, "_currentIws cannot be null here.");
                return this._currentIws.UserResized; 
            } 
        },
        
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types.
//      internal override DependencyObjectType 
        DTypeThemeStyleKey: 
        { 
        	get:function() { return _dType; }
        } 
        
	});
	
	Object.defineProperties(Page, {
//        /// <summary> 
//        ///     The DependencyProperty for the Content property.
//        ///     Flags:              None
//        ///     Default Value:      null
//        /// </summary> 
////        public static readonly DependencyProperty 
//        ContentProperty:
//        {
//        	get:function(){
//        		if(Page._ContentProperty === undefined){
//        			Page._ContentProperty =
//                        ContentControl.ContentProperty.AddOwner( 
//                        		Page.Type, 
//                                /*new FrameworkPropertyMetadata(new PropertyChangedCallback(null, OnContentChanged))*/
//                        		FrameworkPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, OnContentChanged))); 
//        		}
//        		
//        		return Page._ContentProperty;
//        	}
//        },
// 
//        /// <summary> 
//        ///     The DependencyProperty for the Background property.
//        /// </summary>
////        public static readonly DependencyProperty 
//        BackgroundProperty:
//        {
//        	get:function(){
//        		if(Page._BackgroundProperty === undefined){
//        			Page._BackgroundProperty =
//                        Panel.BackgroundProperty.AddOwner( 
//                                Page.Type,
//                                /*new FrameworkPropertyMetadata( 
//                                        Panel.BackgroundProperty.GetDefaultValue(Panel.Type), 
//                                        FrameworkPropertyMetadataOptions.None)*/
//                                FrameworkPropertyMetadata.Build2(Panel.BackgroundProperty.GetDefaultValue(Panel.Type), 
//                                        FrameworkPropertyMetadataOptions.None));
//        		}
//        		
//        		return Page._BackgroundProperty;
//        	}
//        },
// 
//        /// <summary>
//        ///     The DependencyProperty for the Title property. 
//        /// </summary>
////        public static readonly DependencyProperty 
//        TitleProperty:
//        {
//        	get:function(){
//        		if(Page._TitleProperty === undefined){
//        			Page._TitleProperty = 
//        	            DependencyProperty.Register( 
//        	                    "Title", typeof(string), Page.Type,
//        	                    /*new FrameworkPropertyMetadata(null, new PropertyChangedCallback(OnTitleChanged))*/
//        	                    FrameworkPropertyMetadata.BuildWithDVandPCCB(null,
//        	                    		new PropertyChangedCallback(null, OnTitleChanged)));  
//        		}
//        		
//        		return Page._TitleProperty;
//        	}
//        },
//
//        /// <summary> 
//        ///     The DependencyProperty for the KeepAlive property. 
//        /// </summary>
////        public static readonly DependencyProperty 
//        KeepAliveProperty:
//        {
//        	get:function(){
//        		if(Page._KeepAliveProperty === undefined){
//        			Page._KeepAliveProperty = 
//                        JournalEntry.KeepAliveProperty.AddOwner(Page.Type);
//        		}
//        		
//        		return Page._KeepAliveProperty;
//        	}
//        },
//
//        /// <summary>
//        ///     The DependencyProperty for the Foreground property. 
//        ///     Flags:              Can be used in style rules
//        ///     Default Value:      System Font Color 
//        /// </summary> 
////        public static readonly DependencyProperty 
//        ForegroundProperty:
//        {
//        	get:function(){
//        		if(Page._ForegroundProperty === undefined){
//        			Page._ForegroundProperty =
//                        TextElement.ForegroundProperty.AddOwner(Page.Type); 
//        		}
//        		
//        		return Page._ForegroundProperty;
//        	}
//        },
//
//
//        /// <summary> 
//        ///     The DependencyProperty for the FontFamily property.
//        ///     Flags:              Can be used in style rules 
//        ///     Default Value:      System Dialog Font 
//        /// </summary>
////        public static readonly DependencyProperty 
//        FontFamilyProperty:
//        {
//        	get:function(){
//        		if(Page._FontFamilyProperty === undefined){
//        			Page._FontFamilyProperty = 
//                        TextElement.FontFamilyProperty.AddOwner(Page.Type);
//        		}
//        		
//        		return Page._FontFamilyProperty;
//        	}
//        },
//       
// 
//        /// <summary>
//        ///     The DependencyProperty for the FontSize property. 
//        ///     Flags:              Can be used in style rules
//        ///     Default Value:      System Dialog Font Size
//        /// </summary>
////        public static readonly DependencyProperty 
//        FontSizeProperty:
//        {
//        	get:function(){
//        		if(Page._FontSizeProperty === undefined){
//        			Page._FontSizeProperty = 
//                        TextElement.FontSizeProperty.AddOwner(Page.Type);
//        		}
//        		
//        		return Page._FontSizeProperty;
//        	}
//        },
//        
// 
//        /// <summary>
//        /// TemplateProperty
//        /// </summary>
////        public static readonly DependencyProperty 
//        TemplateProperty:
//        {
//        	get:function(){
//        		if(Page._TemplateProperty === undefined){
//        			Page._TemplateProperty  = 
//                        Control.TemplateProperty.AddOwner(
//                                Page.Type, 
//                                /*new FrameworkPropertyMetadata( 
//                                        (ControlTemplate) null,  // default value
//                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
//                                        new PropertyChangedCallback(OnTemplateChanged))*/
//                                FrameworkPropertyMetadata.Build3PCCB( 
//                                        null,  // default value
//                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
//                                        new PropertyChangedCallback(null, OnTemplateChanged)));
//        		}
//        		
//        		return Page._TemplateProperty;
//        	}
//        },
        
	});
	
	function RegisterProperties(){
		/// <summary> 
        ///     The DependencyProperty for the Content property.
        ///     Flags:              None
        ///     Default Value:      null
        /// </summary> 
//        public static readonly DependencyProperty 
		Page.ContentProperty =
            ContentControl.ContentProperty.AddOwner( 
            		Page.Type, 
                    /*new FrameworkPropertyMetadata(new PropertyChangedCallback(null, OnContentChanged))*/
            		FrameworkPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, OnContentChanged)));
 
        /// <summary> 
        ///     The DependencyProperty for the Background property.
        /// </summary>
//        public static readonly DependencyProperty 
		Page.BackgroundProperty =
			Panel.BackgroundProperty.AddOwner( 
                    Page.Type,
                    /*new FrameworkPropertyMetadata( 
                            Panel.BackgroundProperty.GetDefaultValue(Panel.Type), 
                            FrameworkPropertyMetadataOptions.None)*/
                    FrameworkPropertyMetadata.Build2(Panel.BackgroundProperty.GetDefaultValue(Panel.Type), 
                            FrameworkPropertyMetadataOptions.None));
 
        /// <summary>
        ///     The DependencyProperty for the Title property. 
        /// </summary>
//        public static readonly DependencyProperty 
		Page.TitleProperty = 
            DependencyProperty.Register( 
                    "Title", String.Type, Page.Type,
                    /*new FrameworkPropertyMetadata(null, new PropertyChangedCallback(OnTitleChanged))*/
                    FrameworkPropertyMetadata.BuildWithDVandPCCB(null,
                    		new PropertyChangedCallback(null, OnTitleChanged))); 

        /// <summary> 
        ///     The DependencyProperty for the KeepAlive property. 
        /// </summary>
////        public static readonly DependencyProperty 
//		Page.KeepAliveProperty = 
//            JournalEntry.KeepAliveProperty.AddOwner(Page.Type);

        /// <summary>
        ///     The DependencyProperty for the Foreground property. 
        ///     Flags:              Can be used in style rules
        ///     Default Value:      System Font Color 
        /// </summary> 
//        public static readonly DependencyProperty 
		Page.ForegroundProperty =
            TextElement.ForegroundProperty.AddOwner(Page.Type);


        /// <summary> 
        ///     The DependencyProperty for the FontFamily property.
        ///     Flags:              Can be used in style rules 
        ///     Default Value:      System Dialog Font 
        /// </summary>
//        public static readonly DependencyProperty 
		Page.FontFamilyProperty = 
            TextElement.FontFamilyProperty.AddOwner(Page.Type);
       
 
        /// <summary>
        ///     The DependencyProperty for the FontSize property. 
        ///     Flags:              Can be used in style rules
        ///     Default Value:      System Dialog Font Size
        /// </summary>
//        public static readonly DependencyProperty 
		Page.FontSizeProperty = 
            TextElement.FontSizeProperty.AddOwner(Page.Type);
        
 
        /// <summary>
        /// TemplateProperty
        /// </summary>
//        public static readonly DependencyProperty 
		Page.TemplateProperty  = 
            Control.TemplateProperty.AddOwner(
                    Page.Type, 
                    /*new FrameworkPropertyMetadata( 
                            (ControlTemplate) null,  // default value
                            FrameworkPropertyMetadataOptions.AffectsMeasure, 
                            new PropertyChangedCallback(OnTemplateChanged))*/
                    FrameworkPropertyMetadata.Build3PCCB( 
                            null,  // default value
                            FrameworkPropertyMetadataOptions.AffectsMeasure, 
                            new PropertyChangedCallback(null, OnTemplateChanged)));
	}
	
		
//	static Page() 
	function Initialize()
	{
	      // We use IWindowService change notifications to propagate the cached values to the Window 
//	      Window.IWindowServiceProperty.OverrideMetadata(
//	              Page.Type,
//	              new FrameworkPropertyMetadata(new PropertyChangedCallback(_OnWindowServiceChanged)));
	
	      // hamidm -- 01/10/2005
	      // WOSB 1066004 Window/NavigationWindow and Page should not be focusable 
	      // This makes Page non-focusable.  If FocusedElement is set on the Page, focus would 
	      // go to that element, otherwise, it will be null.  Page taking focus doesn't make
	      // sense, instead, it should be forwared to some more meaningful element in the tree. 
	      UIElement.FocusableProperty.OverrideMetadata(Page.Type, 
	    		  /*new FrameworkPropertyMetadata(false)*/
	    		  FrameworkPropertyMetadata.BuildWithDV(false));
	
	      FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(Page.Type, 
	    		  /*new FrameworkPropertyMetadata(Page.Type)*/
	    		  FrameworkPropertyMetadata.BuildWithDV(false));
	      _dType = DependencyObjectType.FromSystemTypeInternal(Page.Type); 
	}
	
	 // If the Title has changed we want to set the flag.
//    static private void 
    function OnTitleChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.PropertyIsSet(SetPropertyFlags.Title);
        window.document.title = e.NewValue;
    } 
    // Property invalidation callback invoked when TemplateProperty is changed
//    private static void 
    function OnTemplateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        Page p = (Page) d;
        StyleHelper.UpdateTemplateCache(d, /*(FrameworkTemplate)*/ e.OldValue, /*(FrameworkTemplate)*/ e.NewValue, Page.TemplateProperty); 
    }

//    private static void 
    function OnContentChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        Page page = (Page) d; 
        d.OnContentChanged(e.OldValue, e.NewValue); 
    }
//    private static void 
    function _OnWindowServiceChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        Page p = d as Page; 
//        Debug.Assert( p != null, "DependencyObject must be of type Page." );

        d.OnWindowServiceChanged(e.NewValue instanceof IWindowService ? e.NewValue : null);
    } 
	
	Page.Type = new Type("Page", Page, [FrameworkElement.Type, IWindowService.Type, IAddChild.Type]);
	Initialize();
	RegisterProperties();
	
	return Page;
});


//    class PageHelperObject 
//    {
//
//        //we start to cache these properties because the window is not necessarly available 
//        //when the values are set. Also we need to be able to tell whether a property has been
//        //set per property so that we will know which one is set. We have a bool variable per property
//        //for that purpose.
//        internal String                         _text; 
//        internal String                         _windowTitle;
//        internal double                         _windowHeight; 
//        internal double                         _windowWidth; 
//        internal bool                           _showsNavigationUI;
//    }


 