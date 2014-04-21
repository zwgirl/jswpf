/**
 * HeaderedContentControl
 */

define(["dojo/_base/declare", "system/Type", "controls/ContentControl", "internal/Helper", "data/BindingExpressionBase",
        "windows/FrameworkElement", "windows/FrameworkPropertyMetadata", "windows/DependencyObjectType",
        "internal.controls/HeaderedContentModelTreeEnumerator"], 
		function(declare, Type, ContentControl, Helper, BindingExpressionBase,
				FrameworkElement, FrameworkPropertyMetadata, DependencyObjectType,
				HeaderedContentModelTreeEnumerator){
//	private static DependencyObjectType 
	var _dType; 
	var HeaderedContentControl = declare("HeaderedContentControl", ContentControl,{
		constructor:function(){
		},
  
        /// <summary>
        ///     This method is invoked when the Header property changes. 
        /// </summary>
        /// <param name="oldHeader">The old value of the Header property.</param>
        /// <param name="newHeader">The new value of the Header property.</param>
//        protected virtual void 
        OnHeaderChanged:function(/*object*/ oldHeader, /*object*/ newHeader) 
        {
            this.RemoveLogicalChild(oldHeader); 
            this.AddLogicalChild(newHeader); 
        },
 
        /// <summary>
        ///     This method is invoked when the HeaderTemplate property changes.
        /// </summary>
        /// <param name="oldHeaderTemplate">The old value of the HeaderTemplate property.</param> 
        /// <param name="newHeaderTemplate">The new value of the HeaderTemplate property.</param>
//        protected virtual void 
        OnHeaderTemplateChanged:function(/*DataTemplate*/ oldHeaderTemplate, /*DataTemplate*/ newHeaderTemplate) 
        { 
            Helper.CheckTemplateAndTemplateSelector("Header", 
            		HeaderedContentControl.HeaderTemplateProperty, 
            		HeaderedContentControl.HeaderTemplateSelectorProperty, this);
        },

        /// <summary> 
        ///     This method is invoked when the HeaderTemplateSelector property changes. 
        /// </summary>
        /// <param name="oldHeaderTemplateSelector">The old value of the HeaderTemplateSelector property.</param> 
        /// <param name="newHeaderTemplateSelector">The new value of the HeaderTemplateSelector property.</param>
//        protected virtual void 
        OnHeaderTemplateSelectorChanged:function(/*DataTemplateSelector*/ oldHeaderTemplateSelector, /*DataTemplateSelector*/ newHeaderTemplateSelector)
        {
            Helper.CheckTemplateAndTemplateSelector("Header", 
            		HeaderedContentControl.HeaderTemplateProperty, 
            		HeaderedContentControl.HeaderTemplateSelectorProperty, this); 
        },
 
        /// <summary> 
        ///     This method is invoked when the HeaderStringFormat property changes.
        /// </summary> 
        /// <param name="oldHeaderStringFormat">The old value of the HeaderStringFormat property.</param>
        /// <param name="newHeaderStringFormat">The new value of the HeaderStringFormat property.</param>
//        protected virtual void 
        OnHeaderStringFormatChanged:function(/*String*/ oldHeaderStringFormat, /*String*/ newHeaderStringFormat)
        { 
        },

        /// <summary> 
        ///     Gives a string representation of this object. 
        /// </summary>
        /// <returns></returns> 
//        internal override string 
        GetPlainText:function()
        {
            return ContentControl.ContentObjectToString(Header);
        }, 

 
        /// <summary> 
        /// Prepare to display the item.
        /// </summary> 
//        internal void 
        PrepareHeaderedContentControl:function(/*object*/ item,
                                        /*DataTemplate*/ itemTemplate,
                                        /*DataTemplateSelector*/ itemTemplateSelector,
                                        /*string*/ stringFormat) 
        {
            if (item != this) 
            { 
                // don't treat Content as a logical child
                this.ContentIsNotLogical = true; 
                this.HeaderIsNotLogical = true;

                if (this.ContentIsItem || !this.HasNonDefaultValue(ContentControl.ContentProperty))
                { 
                	this.Content = item;
                	this.ContentIsItem = true; 
                } 

                // Visuals can't be placed in both Header and Content, but data can 
                if (!(item instanceof Visual) && (this.HeaderIsItem || !this.HasNonDefaultValue(HeaderedContentControl.HeaderProperty)))
                {
                	this.Header = item;
                	this.HeaderIsItem = true; 
                }
 
                if (itemTemplate != null) 
                	this.SetValue(HeaderedContentControl.HeaderTemplateProperty, itemTemplate);
                if (itemTemplateSelector != null) 
                	this.SetValue(HeaderedContentControl.HeaderTemplateSelectorProperty, itemTemplateSelector);
                if (stringFormat != null)
                	this.SetValue(HeaderedContentControl.HeaderStringFormatProperty, stringFormat);
            } 
            else
            { 
            	this.ContentIsNotLogical = false; 
            }
        },

        /// <summary>
        /// Undo the effect of PrepareHeaderedContentControl.
        /// </summary> 
//        internal void 
        ClearHeaderedContentControl:function(/*object*/ item)
        { 
            if (item != this) 
            {
                if (this.ContentIsItem) 
                {
                	this.Content = BindingExpressionBase.DisconnectedItem;
                }
 
                if (this.HeaderIsItem)
                { 
                	this.Header = BindingExpressionBase.DisconnectedItem; 
                }
            } 
        },
 
        /// <summary>
        ///     Gives a string representation of this object. 
        /// </summary>
//        public override string 
        ToString:function()
        {
            var typeText = this.GetType().ToString(); 
            var headerText = String.Empty;
            var contentText = String.Empty; 
            var valuesDefined = false; 

            // Accessing Header's content may be thread sensitive 
//            if (CheckAccess())
//            {
                headerText = ContentControl.ContentObjectToString(HeaderedContentControl.Header);
                contentText = ContentControl.ContentObjectToString(ContentControl.Content); 
                valuesDefined = true;
//            } 
//            else 
//            {
//                //Not on dispatcher, try posting to the dispatcher with 20ms timeout 
//                Dispatcher.Invoke(DispatcherPriority.Send, new TimeSpan(0, 0, 0, 0, 20), 
//                		new DispatcherOperationCallback(/*delegate*/function(/*object*/ o)
//                {
//                    headerText = ContentControl.ContentObjectToString(Header);
//                    contentText = ContentControl.ContentObjectToString(Content); 
//                    valuesDefined = true;
//                    return null; 
//                }), null); 
//            }
 
            // If header and content text are defined
            if (valuesDefined)
            {
                return SR.Get(SRID.ToStringFormatString_HeaderedContentControl, typeText, headerText, contentText); 
            }
 
            // Not able to access the dispatcher 
            return typeText;
        } 
	});
	
	Object.defineProperties(HeaderedContentControl.prototype,{

        /// <summary> 
        ///     Header is the data used to for the header of each item in the control.
        /// </summary> 
//        public object 
        Header: 
        {
            get:function() { return this.GetValue(HeaderedContentControl.HeaderProperty); },
            set:function(value) { this.SetValue(HeaderedContentControl.HeaderProperty, value); }
        }, 

        /// <summary>
        ///     True if Header is non-null, false otherwise. 
        /// </summary>
//        public bool 
        HasHeader: 
        {
            get:function() { return this.GetValue(HeaderedContentControl.HasHeaderProperty); } 
        },

        /// <summary> 
        ///     HeaderTemplate is the template used to display the <seealso cref="Header"/>.
        /// </summary>
//        public DataTemplate 
        HeaderTemplate: 
        {
            get:function() { return this.GetValue(HeaderedContentControl.HeaderTemplateProperty); },
            set:function(value) { this.SetValue(HeaderedContentControl.HeaderTemplateProperty, value); } 
        },

        /// <summary> 
        ///     HeaderTemplateSelector allows the application writer to provide custom logic
        ///     for choosing the template used to display the <seealso cref="Header"/>.
        /// </summary>
        /// <remarks> 
        ///     This property is ignored if <seealso cref="HeaderTemplate"/> is set.
        /// </remarks> 
//        public DataTemplateSelector 
        HeaderTemplateSelector:
        { 
            get:function() { return this.GetValue(HeaderedContentControl.HeaderTemplateSelectorProperty); },
            set:function(value) { this.SetValue(HeaderedContentControl.HeaderTemplateSelectorProperty, value); }
        },
        /// <summary>
        ///     HeaderStringFormat is the format used to display the header content as a string. 
        ///     This arises only when no template is available. 
        /// </summary>
//        public String 
        HeaderStringFormat:
        {
            get:function() { return this.GetValue(HeaderedContentControl.HeaderStringFormatProperty); },
            set:function(value) { this.SetValue(HeaderedContentControl.HeaderStringFormatProperty, value); } 
        },

        /// <summary>
        ///     Returns enumerator to logical children
        /// </summary> 
//        protected internal override IEnumerator 
        LogicalChildren:
        { 
            get:function() 
            {
                var header = this.Header; 

                if (this.HeaderIsNotLogical || header == null)
                {
                    return ContentControl.prototype.LogicalChildren; 
                }
 
                return new HeaderedContentModelTreeEnumerator(this, this.ContentIsNotLogical ? null : this.Content, header); 
            }
        }, 

        /// <summary> 
        ///    Indicates whether Header should be a logical child or not. 
        /// </summary>
//        internal bool 
        HeaderIsNotLogical: 
        {
            get:function() { return this.ReadControlFlag(ControlBoolFlags.HeaderIsNotLogical); },
            set:function(value) { this.WriteControlFlag(ControlBoolFlags.HeaderIsNotLogical, value); }
        }, 

        /// <summary> 
        ///    Indicates whether Header is a data item 
        /// </summary>
//        internal bool 
        HeaderIsItem: 
        {
            get:function() { return this.ReadControlFlag(ControlBoolFlags.HeaderIsItem); },
            set:function(value) { this.WriteControlFlag(ControlBoolFlags.HeaderIsItem, value); }
        }, 

        // Returns the DependencyObjectType for the registered DefaultStyleKey's default 
        // value. Controls will override this method to return approriate types. 
//        internal override DependencyObjectType 
        DTypeThemeStyleKey:
        { 
            get:function() { return _dType; }
        }
	});
	
	Object.defineProperties(HeaderedContentControl,{

        /// <summary> 
        ///     The DependencyProperty for the Header property. 
        ///     Flags:              None
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        HeaderProperty:
        {
        	get:function(){
        		if(HeaderedContentControl._HeaderProperty === undefined){
        			HeaderedContentControl._HeaderProperty =
                        DependencyProperty.Register( 
                                "Header",
                                Object.Type, 
                                HeaderedContentControl.Type, 
                                /*new FrameworkPropertyMetadata(
                                        (object) null, 
                                        new PropertyChangedCallback(null, OnHeaderChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(null, 
                                        new PropertyChangedCallback(null, OnHeaderChanged)));
        		}
        		
        		return HeaderedContentControl._HeaderProperty;
        	}
        },

        /// <summary>
        ///     The key needed set a read-only property.
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        HasHeaderPropertyKey:
        {
        	get:function(){
        		if(HeaderedContentControl._HasHeaderPropertyKey === undefined){
        			HeaderedContentControl._HasHeaderPropertyKey = 
                        DependencyProperty.RegisterReadOnly(
                                "HasHeader", 
                                Boolean.Type, 
                                HeaderedContentControl.Type,
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false)); 
        		}
        		
        		return HeaderedContentControl._HasHeaderPropertyKey;
        	}
        },

        /// <summary>
        ///     The DependencyProperty for the HasHeader property.
        ///     Flags:              None 
        ///     Other:              Read-Only
        ///     Default Value:      false 
        /// </summary> 
//        public static readonly DependencyProperty 
        HasHeaderProperty:
        {
        	get:function(){
        		if(HeaderedContentControl._HasHeaderProperty === undefined){
        			HeaderedContentControl._HasHeaderProperty = 
        				HeaderedContentControl.HasHeaderPropertyKey.DependencyProperty;
        		}
        		
        		return HeaderedContentControl._HasHeaderProperty;
        	}
        }, 

        /// <summary>
        ///     The DependencyProperty for the HeaderTemplate property. 
        ///     Flags:              Can be used in style rules
        ///     Default Value:      null 
        /// </summary> 
//        public static readonly DependencyProperty 
        HeaderTemplateProperty:
        {
        	get:function(){
        		if(HeaderedContentControl._HeaderTemplateProperty === undefined){
        			HeaderedContentControl._HeaderTemplateProperty = 
                        DependencyProperty.Register(
                                "HeaderTemplate",
                                DataTemplate.Type,
                                HeaderedContentControl.Type, 
                                /*new FrameworkPropertyMetadata(
                                        (DataTemplate) null, 
                                        new PropertyChangedCallback(null, OnHeaderTemplateChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(null, 
                                        new PropertyChangedCallback(null, OnHeaderTemplateChanged))); 
        		}
        		
        		return HeaderedContentControl._HeaderTemplateProperty;
        	}
        }, 

        /// <summary>
        ///     The DependencyProperty for the HeaderTemplateSelector property. 
        ///     Flags:              none
        ///     Default Value:      null 
        /// </summary> 
//        public static readonly DependencyProperty 
        HeaderTemplateSelectorProperty:
        {
        	get:function(){
        		if(HeaderedContentControl._HeaderTemplateSelectorProperty === undefined){
        			HeaderedContentControl._HeaderTemplateSelectorProperty = 
                        DependencyProperty.Register(
                                "HeaderTemplateSelector",
                                DataTemplateSelector.Type,
                                HeaderedContentControl.Type, 
                                /*new FrameworkPropertyMetadata(
                                        (DataTemplateSelector) null, 
                                        new PropertyChangedCallback(null, OnHeaderTemplateSelectorChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB( null, 
                                        new PropertyChangedCallback(null, OnHeaderTemplateSelectorChanged))); 
        		}
        		
        		return HeaderedContentControl._HeaderTemplateSelectorProperty;
        	}
        }, 
        /// <summary> 
        ///     The DependencyProperty for the HeaderStringFormat property.
        ///     Flags:              None 
        ///     Default Value:      null
        /// </summary>
//        public static readonly DependencyProperty 
        HeaderStringFormatProperty:
        {
        	get:function(){
        		if(HeaderedContentControl._HeaderStringFormatProperty === undefined){
        			HeaderedContentControl._HeaderStringFormatProperty = 
                        DependencyProperty.Register(
                                "HeaderStringFormat", 
                                String.Type, 
                                HeaderedContentControl.Type,
                                /*new FrameworkPropertyMetadata( 
                                        (String) null,
                                      new PropertyChangedCallback(OnHeaderStringFormatChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(null,
                                      new PropertyChangedCallback(null, OnHeaderStringFormatChanged)));
        		}
        		
        		return HeaderedContentControl._HeaderStringFormatProperty;
        	}
        }, 

	});
	
//    static HeaderedContentControl() 
	function Initialize()
    {
		FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(HeaderedContentControl.Type, 
				/*new FrameworkPropertyMetadata(HeaderedContentControl.Type)*/
				FrameworkPropertyMetadata.BuildWithDV(HeaderedContentControl.Type)); 
        _dType = DependencyObjectType.FromSystemTypeInternal(HeaderedContentControl.Type);
    };

    /// <summary> 
    ///     Called when HeaderProperty is invalidated on "d." 
    /// </summary>
//    private static void 
    function OnHeaderChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        d.SetValue(HeaderedContentControl.HasHeaderPropertyKey, (e.NewValue != null) ? true : false); 
        d.OnHeaderChanged(e.OldValue, e.NewValue);
    } 

    /// <summary>
    ///     Called when HeaderTemplateProperty is invalidated on "d."
    /// </summary>
//    private static void 
    function OnHeaderTemplateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        HeaderedContentControl ctrl = (HeaderedContentControl)d; 
        d.OnHeaderTemplateChanged(/*(DataTemplate)*/ e.OldValue, /*(DataTemplate)*/ e.NewValue); 
    }

    /// <summary>
    ///     Called when HeaderTemplateSelectorProperty is invalidated on "d." 
    /// </summary> 
//    private static void 
    function OnHeaderTemplateSelectorChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.OnHeaderTemplateSelectorChanged(/*(DataTemplateSelector)*/ e.OldValue, /*(DataTemplateSelector)*/ e.NewValue);
    } 

    /// <summary> 
    ///     Called when HeaderStringFormatProperty is invalidated on "d."
    /// </summary> 
//    private static void 
    function OnHeaderStringFormatChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        d.OnHeaderStringFormatChanged(/*(String)*/ e.OldValue, /*(String)*/ e.NewValue); 
    }
	
	HeaderedContentControl.Type = new Type("HeaderedContentControl", HeaderedContentControl, [ContentControl.Type]);
	Initialize();
	return HeaderedContentControl;
});

 



