/**
 * ContentControl
 */

define(["dojo/_base/declare", "system/Type", "controls/Control", "windows/LogicalTreeHelper",
        "windows/FrameworkPropertyMetadata", "windows/DependencyObject", "windows/FrameworkElement",
        "windows/DependencyProperty", "windows/DataTemplate", "windows/PropertyChangedCallback",
        "controls/ContentModelTreeEnumerator", "controls/DataTemplateSelector"], 
		function(declare, Type, Control, LogicalTreeHelper,
				FrameworkPropertyMetadata, DependencyObject, FrameworkElement,
				DependencyProperty, DataTemplate, PropertyChangedCallback,
				ContentModelTreeEnumerator, DataTemplateSelector){
	
//	private static DependencyObjectType 
	var _dType = null;
	var ContentControl = declare("ContentControl", Control, {
		constructor:function(){
			
			this._dom = document.createElement("div");
		},
 
        /// <summary>
        ///     Gives a string representation of this object.
        /// </summary> 
        /// <returns></returns>
//        internal override string 
        GetPlainText:function() 
        { 
            return this.ContentObjectToString(this.Content);
        }, 

        /// <summary> 
        /// Prepare to display the item.
        /// </summary>
//        internal void 
        PrepareContentControl:function(/*object*/ item,
                                        /*DataTemplate*/ itemTemplate, 
                                        /*DataTemplateSelector*/ itemTemplateSelector,
                                        /*string*/ itemStringFormat) 
        { 
            if (item != this)
            { 
                // don't treat Content as a logical child
            	this.ContentIsNotLogical = true;

                // copy styles from the ItemsControl 
                if (this.ContentIsItem || !this.HasNonDefaultValue(ContentControl.ContentProperty))
                { 
                	this.Content = item; 
                    this.ContentIsItem = true;
                } 
                if (itemTemplate != null)
                	this.SetValue(ContentControl.ContentTemplateProperty, itemTemplate);
                if (itemTemplateSelector != null)
                	this.SetValue(ContentControl.ContentTemplateSelectorProperty, itemTemplateSelector); 
                if (itemStringFormat != null)
                	this.SetValue(ContentControl.ContentStringFormatProperty, itemStringFormat); 
            } 
            else
            { 
                this.ContentIsNotLogical = false;
            }
        },
 
        /// <summary>
        /// Undo the effect of PrepareContentControl. 
        /// </summary> 
//        internal void 
        ClearContentControl:function(/*object*/ item)
        { 
            if (item != this)
            {
                if (this.ContentIsItem)
                { 
                    this.Content = BindingExpressionBase.DisconnectedItem;
                } 
            } 
        },
 
        /// <summary>
        ///  Add an object child to this control 
        /// </summary> 
//        protected virtual void 
        AddChild:function(/*object*/ value)
        { 
            // if conent is the first child or being cleared, set directly
            if (this.Content == null || value == null)
            {
            	this.Content = value; 
            }
            else 
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.ContentControlCannotHaveMultipleContent)');
            } 
        },

        /// <summary>
        ///  Add a text string to this control
        /// </summary> 
//        protected virtual void 
        AddText:function(/*string*/ text)
        { 
            this.AddChild(text); 
        },


        /// <summary> 
        ///     This method is invoked when the Content property changes.
        /// </summary> 
        /// <param name="oldContent">The old value of the Content property.</param> 
        /// <param name="newContent">The new value of the Content property.</param>
//        protected virtual void 
        OnContentChanged:function(/*object*/ oldContent, /*object*/ newContent) 
        {
            // Remove the old content child
        	this.RemoveLogicalChild(oldContent);
 
            // if Content should not be treated as a logical child, there's
            // nothing to do 
            if (this.ContentIsNotLogical) 
                return;
 
            /*DependencyObject*/var d = newContent instanceof DependencyObject ? newContent : null;
            if (d != null)
            {
                /*DependencyObject*/var logicalParent = LogicalTreeHelper.GetParent(d); 
                if (logicalParent != null)
                { 
                    if (this.TemplatedParent != null && FrameworkObject.IsEffectiveAncestor(logicalParent, this)) 
                    {
                        // In the case that this ContentControl belongs in a parent template 
                        // and represents the content of a parent, we do not wish to change
                        // the logical ancestry of the content.
                        return;
                    } 
                    else
                    { 
                        // If the new content was previously hooked up to the logical 
                        // tree then we sever it from the old parent.
                        LogicalTreeHelper.RemoveLogicalChild(logicalParent, newContent); 
                    }
                }
            }
 
            // Add the new content child
            this.AddLogicalChild(newContent); 
        },


        /// <summary>
        ///     This method is invoked when the ContentTemplate property changes. 
        /// </summary>
        /// <param name="oldContentTemplate">The old value of the ContentTemplate property.</param> 
        /// <param name="newContentTemplate">The new value of the ContentTemplate property.</param> 
//        protected virtual void 
        OnContentTemplateChanged:function(/*DataTemplate*/ oldContentTemplate, /*DataTemplate*/ newContentTemplate)
        { 
            Helper.CheckTemplateAndTemplateSelector("Content", 
            		ContentControl.ContentTemplateProperty, ContentControl.ContentTemplateSelectorProperty, this);
        },
 
        /// <summary> 
        ///     This method is invoked when the ContentTemplateSelector property changes.
        /// </summary> 
        /// <param name="oldContentTemplateSelector">The old value of the ContentTemplateSelector property.</param>
        /// <param name="newContentTemplateSelector">The new value of the ContentTemplateSelector property.</param>
//        protected virtual void 
        OnContentTemplateSelectorChanged:function(/*DataTemplateSelector*/ oldContentTemplateSelector, 
        		/*DataTemplateSelector*/ newContentTemplateSelector)
        { 
            Helper.CheckTemplateAndTemplateSelector("Content", ContentControl.ContentTemplateProperty, 
            		ContentControl.ContentTemplateSelectorProperty, this);
        }, 
 

        /// <summary> 
        ///     This method is invoked when the ContentStringFormat property changes.
        /// </summary>
        /// <param name="oldContentStringFormat">The old value of the ContentStringFormat property.</param>
        /// <param name="newContentStringFormat">The new value of the ContentStringFormat property.</param> 
//        protected virtual void 
        OnContentStringFormatChanged:function(/*String*/ oldContentStringFormat, /*String*/ newContentStringFormat)
        { 
        } 

	});
	
	Object.defineProperties(ContentControl.prototype,{
 
        /// <summary>
        ///     Returns enumerator to logical children 
        /// </summary>
//        protected internal override IEnumerator 
        LogicalChildren:
        {
            get:function() 
            {
                /*object*/var content = this.Content; 
 
                if (this.ContentIsNotLogical || content == null)
                { 
                    return EmptyEnumerator.Instance;
                }

                // If the current ContentControl is in a Template.VisualTree and is meant to host 
                // the content for the container then that content shows up as the logical child
                // for the container and not for the current ContentControl. 
                /*DependencyObject*/var templatedParent = this.TemplatedParent; 
                if (templatedParent != null)
                { 
                   /*DependencyObject*/var d = content instanceof DependencyObject ? content : null;
                   if (d != null)
                   {
                       /*DependencyObject*/var logicalParent =  LogicalTreeHelper.GetParent(d); 
                       if (logicalParent != null && logicalParent != this)
                       { 
                           return EmptyEnumerator.Instance; 
                       }
                   } 
                }

                return new ContentModelTreeEnumerator(this, content);
            } 
        },
 
        /// <summary>
        ///     Content is the data used to generate the child elements of this control.
        /// </summary>
//        public object 
        Content:
        { 
            get:function() { return this.GetValue(ContentControl.ContentProperty); }, 
            set:function(value) { this.SetValue(ContentControl.ContentProperty, value); }
        },

        /// <summary> 
        ///     True if Content is non-null, false otherwise.
        /// </summary> 
//        public bool 
        HasContent:
        { 
            get:function() { return  this.GetValue(ContentControl.HasContentProperty); }
        },

        /// <summary>
        ///     ContentTemplate is the template used to display the content of the control.
        /// </summary> 
//        public DataTemplate 
        ContentTemplate: 
        { 
            get:function() { return this.GetValue(ContentControl.ContentTemplateProperty); },
            set:function(value) { this.SetValue(ContentControl.ContentTemplateProperty, value); } 
        },

        /// <summary>
        ///     ContentTemplateSelector allows the application writer to provide custom logic
        ///     for choosing the template used to display the content of the control.
        /// </summary> 
        /// <remarks>
        ///     This property is ignored if <seealso cref="ContentTemplate"/> is set. 
        /// </remarks> 
//        public DataTemplateSelector 
        ContentTemplateSelector:
        {
            get:function() { return this.GetValue(ContentControl.ContentTemplateSelectorProperty); },
            set:function(value) { this.SetValue(ContentControl.ContentTemplateSelectorProperty, value); } 
        },
 

        /// <summary> 
        ///     ContentStringFormat is the format used to display the content of 
        ///     the control as a string.  This arises only when no template is
        ///     available. 
        /// </summary>
//        public String 
        ContentStringFormat:
        { 
            get:function() { return  this.GetValue(ContentControl.ContentStringFormatProperty); },
            set:function(value) { this.SetValue(ContentControl.ContentStringFormatProperty, value); } 
        }, 

        /// <summary>
        ///    Indicates whether Content should be a logical child or not. 
        /// </summary>
//        internal bool 
        ContentIsNotLogical:
        {
            get:function() { return this.ReadControlFlag(ControlBoolFlags.ContentIsNotLogical); }, 
            set:function(value) { this.WriteControlFlag(ControlBoolFlags.ContentIsNotLogical, value); }
        },
 
        /// <summary>
        ///    Indicates whether Content is a data item 
        /// </summary>
//        internal bool 
        ContentIsItem:
        {
            get:function() { return this.ReadControlFlag(ControlBoolFlags.ContentIsItem); },
            set:function(value) { this.WriteControlFlag(ControlBoolFlags.ContentIsItem, value); }
        }, 
 
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types.
//        internal override DependencyObjectType 
        DTypeThemeStyleKey: 
        { 
            get:function() { return _dType; }
        } 

	});

//    internal static string 
    ContentControl.ContentObjectToString = function(/*object*/ content)
    {
        if (content != null) 
        {
            /*FrameworkElement*/
        	var feContent = content instanceof FrameworkElement ? content : null; 
            if (feContent != null) 
            {
                return feContent.GetPlainText(); 
            }

            return content.ToString();
        } 

        return String.Empty; 
    }; 


    /// <summary>
    ///     Called when ContentProperty is invalidated on "d."
    /// </summary> 
//    private static void 
    function OnContentChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        /*ContentControl*/
//    	var ctrl = d; 
        d.SetValue(ContentControl.HasContentPropertyKey, (e.NewValue != null) ? true : false);

        d.OnContentChanged(e.OldValue, e.NewValue);
    }
    

    /// <summary>
    ///     Called when ContentTemplateProperty is invalidated on "d." 
    /// </summary>
//    private static void 
    function OnContentTemplateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        ContentControl ctrl = (ContentControl)d;
        d.OnContentTemplateChanged(/*(DataTemplate)*/ e.OldValue, /*(DataTemplate)*/ e.NewValue); 
    }

    /// <summary> 
    ///     Called when ContentTemplateSelectorProperty is invalidated on "d."
    /// </summary> 
//    private static void 
    function OnContentTemplateSelectorChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        /*ContentControl*/var ctrl = /*(ContentControl)*/ d;
        d.OnContentTemplateSelectorChanged(/*(DataTemplateSelector)*/ e.NewValue, /*(DataTemplateSelector)*/ e.NewValue); 
    }
    
    /// <summary> 
    ///     Called when ContentStringFormatProperty is invalidated on "d."
    /// </summary>
//    private static void 
    function OnContentStringFormatChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        /*ContentControl*/var ctrl = /*(ContentControl)*/d;
        d.OnContentStringFormatChanged(/*(String)*/ e.OldValue, /*(String)*/ e.NewValue); 
    } 

   
    Object.defineProperties(ContentControl, {
    	 /// <summary> 
        ///     The DependencyProperty for the Content property.
        ///     Flags:              None 
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        ContentProperty:
        {
        	get:function()
        	{
//        		if(ContentControl._ContentProperty === undefined){
//        			ContentControl._ContentProperty =
//                        DependencyProperty.Register(
//                                "Content",
//                                Object.Type/*typeof(object)*/, 
//                                ContentControl.Type/*typeof(ContentControl)*/,
//                                /*new FrameworkPropertyMetadata( 
//                                        (object)null, 
//                                        new PropertyChangedCallback(OnContentChanged))*/
//                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
//                                        null, 
//                                        new PropertyChangedCallback(null, OnContentChanged)));
//        		
//        		}
        		return ContentControl._ContentProperty;
        	}
        	
        },

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary>
//        private static readonly DependencyPropertyKey 
        HasContentPropertyKey:
        {
        	get:function()
        	{
//        		if(ContentControl._HasContentPropertyKey === undefined){
//        			ContentControl._HasContentPropertyKey =
//                        DependencyProperty.RegisterReadOnly( 
//                                "HasContent",
//                                Boolean.Type/*typeof(bool)*/, 
//                                ContentControl.Type, 
//                                /*new FrameworkPropertyMetadata(
//                                        false, 
//                                        FrameworkPropertyMetadataOptions.None)*/
//                                FrameworkPropertyMetadata.Build2(
//                                        false, 
//                                        FrameworkPropertyMetadataOptions.None));
//        		
//        		}
        		return ContentControl._HasContentPropertyKey;
        	}
        	
        },

        /// <summary>
        ///     The DependencyProperty for the HasContent property. 
        ///     Flags:              None
        ///     Other:              Read-Only 
        ///     Default Value:      false 
        /// </summary>
//        public static readonly DependencyProperty 
        HasContentProperty:
        {
        	get:function()
        	{
//        		if(ContentControl._HasContentProperty === undefined){
//        			ContentControl._HasContentProperty =
//        				ContentControl.HasContentPropertyKey.DependencyProperty;
//        		
//        		}
        		return ContentControl._HasContentProperty;
        	}
        	
        },

        /// <summary> 
        ///     The DependencyProperty for the ContentTemplate property.
        ///     Flags:              None 
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        ContentTemplateProperty:
        {
        	get:function()
        	{
//        		if(ContentControl._ContentTemplateProperty === undefined){
//        			ContentControl._ContentTemplateProperty =
//                        DependencyProperty.Register(
//                                "ContentTemplate",
//                                DataTemplate.Type/*typeof(DataTemplate)*/, 
//                                ContentControl.Type,
//                                /*new FrameworkPropertyMetadata( 
//                                        (DataTemplate) null, 
//                                      new PropertyChangedCallback(OnContentTemplateChanged))*/
//                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
//                                        null, 
//                                      new PropertyChangedCallback(null, OnContentTemplateChanged)));
//        		
//        		}
        		return ContentControl._ContentTemplateProperty;
        	}
        	
        },
        /// <summary> 
        ///     The DependencyProperty for the ContentTemplateSelector property.
        ///     Flags:              None 
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        ContentTemplateSelectorProperty:
        {
        	get:function()
        	{
//        		if(ContentControl._ContentTemplateSelectorProperty === undefined){
//        			ContentControl._ContentTemplateSelectorProperty =
//                        DependencyProperty.Register(
//                                "ContentTemplateSelector",
//                                DataTemplateSelector.Type/*typeof(DataTemplateSelector)*/, 
//                                ContentControl.Type,
//                                /*new FrameworkPropertyMetadata( 
//                                        (DataTemplateSelector) null, 
//                                        new PropertyChangedCallback(OnContentTemplateSelectorChanged))*/
//                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
//                                        null, 
//                                        new PropertyChangedCallback(null, OnContentTemplateSelectorChanged)));
//        		
//        		}
        		return ContentControl._ContentTemplateSelectorProperty;
        	}
        	
        },

        /// <summary>
        ///     The DependencyProperty for the ContentStringFormat property. 
        ///     Flags:              None
        ///     Default Value:      null
        /// </summary>
//        public static readonly DependencyProperty 
        ContentStringFormatProperty:
        {
        	get:function()
        	{
//        		if(ContentControl._ContentStringFormatProperty === undefined){
//        			ContentControl._ContentStringFormatProperty =
//                        DependencyProperty.Register( 
//                                "ContentStringFormat", 
//                                String.Type/*typeof(String)*/,
//                                ContentControl.Type/*typeof(ContentControl)*/, 
//                                /*new FrameworkPropertyMetadata(
//                                        (String) null,
//                                      new PropertyChangedCallback(OnContentStringFormatChanged))*/
//                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
//                                        null,
//                                      new PropertyChangedCallback(null, OnContentStringFormatChanged)));
//        		
//        		}
        		return ContentControl._ContentStringFormatProperty;
        	}
        	
        }
    });
    
//    static ContentControl() 
    function Initialize()
    {
    	FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(ContentControl.Type,
    			/*new FrameworkPropertyMetadata(ContentControl.Type)*/
    			FrameworkPropertyMetadata.BuildWithDV(ContentControl.Type)); 
        _dType = DependencyObjectType.FromSystemTypeInternal(ContentControl.Type);
    }
    
    function RegisterDependencyProperties(){
    	ContentControl._ContentProperty =
            DependencyProperty.Register(
                    "Content",
                    Object.Type/*typeof(object)*/, 
                    ContentControl.Type/*typeof(ContentControl)*/,
                    /*new FrameworkPropertyMetadata( 
                            (object)null, 
                            new PropertyChangedCallback(OnContentChanged))*/
                    FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                            null, 
                            new PropertyChangedCallback(null, OnContentChanged)));
    	
    	ContentControl._HasContentPropertyKey =
            DependencyProperty.RegisterReadOnly( 
                    "HasContent",
                    Boolean.Type/*typeof(bool)*/, 
                    ContentControl.Type, 
                    /*new FrameworkPropertyMetadata(
                            false, 
                            FrameworkPropertyMetadataOptions.None)*/
                    FrameworkPropertyMetadata.Build2(
                            false, 
                            FrameworkPropertyMetadataOptions.None));
    	
		ContentControl._HasContentProperty =
			ContentControl.HasContentPropertyKey.DependencyProperty;
		
		ContentControl._ContentTemplateProperty =
            DependencyProperty.Register(
                    "ContentTemplate",
                    DataTemplate.Type/*typeof(DataTemplate)*/, 
                    ContentControl.Type,
                    /*new FrameworkPropertyMetadata( 
                            (DataTemplate) null, 
                          new PropertyChangedCallback(OnContentTemplateChanged))*/
                    FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                            null, 
                          new PropertyChangedCallback(null, OnContentTemplateChanged)));
		
		ContentControl._ContentTemplateSelectorProperty =
            DependencyProperty.Register(
                    "ContentTemplateSelector",
                    DataTemplateSelector.Type/*typeof(DataTemplateSelector)*/, 
                    ContentControl.Type,
                    /*new FrameworkPropertyMetadata( 
                            (DataTemplateSelector) null, 
                            new PropertyChangedCallback(OnContentTemplateSelectorChanged))*/
                    FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                            null, 
                            new PropertyChangedCallback(null, OnContentTemplateSelectorChanged)));
		
		ContentControl._ContentStringFormatProperty =
            DependencyProperty.Register( 
                    "ContentStringFormat", 
                    String.Type/*typeof(String)*/,
                    ContentControl.Type/*typeof(ContentControl)*/, 
                    /*new FrameworkPropertyMetadata(
                            (String) null,
                          new PropertyChangedCallback(OnContentStringFormatChanged))*/
                    FrameworkPropertyMetadata.BuildWithDVandPCCB(
                            null,
                          new PropertyChangedCallback(null, OnContentStringFormatChanged)));
    	
    }
	
	ContentControl.Type = new Type("ContentControl", ContentControl, [Control.Type]);
	Initialize();
	
	RegisterDependencyProperties();
	
	return ContentControl;
});



