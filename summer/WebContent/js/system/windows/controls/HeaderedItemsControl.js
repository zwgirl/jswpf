/**
 * HeaderedItemsControl
 */

define(["dojo/_base/declare", "system/Type", "controls/ItemsControl", "internal.controls/HeaderedItemsModelTreeEnumerator",
        "internal/Helper", "windows/FrameworkPropertyMetadata", "windows/PropertyChangedCallback", "controls/ControlBoolFlags",
        "data/BindingOperations"], 
		function(declare, Type, ItemsControl, HeaderedItemsModelTreeEnumerator,
				Helper, FrameworkPropertyMetadata, PropertyChangedCallback, ControlBoolFlags,
				BindingOperations){
	var HeaderedItemsControl = declare("HeaderedItemsControl", ItemsControl,{
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
            // if Header should not be treated as a logical child, there's
            // nothing to do 
            if (!this.IsHeaderLogical()) 
                return;
 
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
            Helper.CheckTemplateAndTemplateSelector("Header", HeaderTemplateProperty, HeaderTemplateSelectorProperty, this);
        }, 
        /// <summary> 
        ///     This method is invoked when the HeaderTemplateSelector property changes.
        /// </summary>
        /// <param name="oldHeaderTemplateSelector">The old value of the HeaderTemplateSelector property.</param>
        /// <param name="newHeaderTemplateSelector">The new value of the HeaderTemplateSelector property.</param> 
//        protected virtual void 
        OnHeaderTemplateSelectorChanged:function(/*DataTemplateSelector*/ oldHeaderTemplateSelector, 
        		/*DataTemplateSelector*/ newHeaderTemplateSelector)
        { 
            Helper.CheckTemplateAndTemplateSelector("Header", HeaderTemplateProperty, HeaderTemplateSelectorProperty, this); 
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
        /// Prepare to display the item. 
        /// </summary> 
//        internal void 
        PrepareHeaderedItemsControl:function(/*object*/ item, /*ItemsControl*/ parentItemsControl)
        { 
            var headerIsNotLogical = item != this;
            // don't treat Header as a logical child
            this.WriteControlFlag(ControlBoolFlags.HeaderIsNotLogical, headerIsNotLogical);
 
            // copy styles from parent ItemsControl
            this.PrepareItemsControl(item, parentItemsControl); 
 
            if (headerIsNotLogical)
            { 
                if (this.HeaderIsItem || !this.HasNonDefaultValue(HeaderedItemsControl.HeaderProperty))
                {
                	this.Header = item;
                	this.HeaderIsItem = true; 
                }
 
                /*DataTemplate*/var itemTemplate = parentItemsControl.ItemTemplate; 
                /*DataTemplateSelector*/var itemTemplateSelector = parentItemsControl.ItemTemplateSelector;
                var itemStringFormat = parentItemsControl.ItemStringFormat; 

                if (itemTemplate != null)
                {
                	this.SetValue(HeaderedItemsControl.HeaderTemplateProperty, itemTemplate); 
                }
                if (itemTemplateSelector != null) 
                { 
                    this.SetValue(HeaderedItemsControl.HeaderTemplateSelectorProperty, itemTemplateSelector);
                } 
                if (itemStringFormat != null &&
                    Helper.HasDefaultValue(this, HeaderedItemsControl.HeaderStringFormatProperty))
                {
                	this.SetValue(HeaderedItemsControl.HeaderStringFormatProperty, itemStringFormat); 
                }
 
                this.PrepareHierarchy(item, parentItemsControl); 
            }
        },

        /// <summary>
        /// Undo the effect of PrepareHeaderedItemsControl.
        /// </summary> 
//        internal void 
        ClearHeaderedItemsControl:function(/*object*/ item)
        { 
            this.ClearItemsControl(item); 

            if (item != this) 
            {
                if (this.HeaderIsItem)
                {
                	this.Header = BindingExpressionBase.DisconnectedItem; 
                }
            } 
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
        ///     Gives a string representation of this object.
        /// </summary> 
//        public override string 
        ToString:function() 
        {
            var typeText = this.GetType().ToString(); 
            var headerText = String.Empty;
            var itemCount = 0;
            var valuesDefined = false;
 
            // Accessing Header's content may be thread sensitive
            if (this.CheckAccess()) 
            { 
                headerText = ContentControl.ContentObjectToString(Header);
                // HasItems may be wrong when underlying collection does not notify, 
                // but this function should try to return what's consistent with ItemsControl state.
                itemCount = this.HasItems ? this.Items.Count : 0;
                valuesDefined = true;
            } 
            else
            { 
                //Not on dispatcher, try posting to the dispatcher with 20ms timeout 
                Dispatcher.Invoke(DispatcherPriority.Send, new TimeSpan(0, 0, 0, 0, 20), 
                		new DispatcherOperationCallback(/*delegate*/function(/*object*/ o)
                { 
                    headerText = ContentControl.ContentObjectToString(Header);
                    // HasItems may be wrong when underlying collection does not notify,
                    // but this function should try to return what's consistent with ItemsControl state.
                    itemCount = HasItems ? Items.Count : 0; 
                    valuesDefined = true;
                    return null; 
                }), null); 
            }
 
            // If header and items count are defined
            if (valuesDefined)
            {
                return SR.Get(SRID.ToStringFormatString_HeaderedItemsControl, typeText, headerText, itemCount); 
            }
 
            // Not able to access the dispatcher 
            return typeText;
        }, 
        
 
        // As a convenience for hierarchical data, get the header template and
        // if it's a HierarchicalDataTemplate, set the ItemsSource, ItemTemplate,
        // ItemTemplateSelector, and ItemStringFormat properties from the template.
//        void 
        PrepareHierarchy:function(/*object*/ item, /*ItemsControl*/ parentItemsControl) 
        {
            // get the effective header template 
            /*DataTemplate*/var headerTemplate = this.HeaderTemplate; 

            if (headerTemplate == null) 
            {
                /*DataTemplateSelector*/var selector = this.HeaderTemplateSelector;
                if (selector != null)
                { 
                    headerTemplate = selector.SelectTemplate(item, this);
                } 
 
                if (headerTemplate == null)
                { 
                    headerTemplate = this.FindTemplateResourceInternal(this, item, DataTemplate.Type);
                }
            }
 
            // if the effective template is a HierarchicalDataTemplate, forward
            // the special properties 
            /*HierarchicalDataTemplate*/
            var hTemplate = headerTemplate instanceof HierarchicalDataTemplate ? headerTemplate : null; 
            if (hTemplate != null)
            { 
                var templateMatches = (this.ItemTemplate == parentItemsControl.ItemTemplate);
                var containerStyleMatches = (this.ItemContainerStyle == parentItemsControl.ItemContainerStyle);

                if (hTemplate.ItemsSource != null && !this.HasNonDefaultValue(ItemsSourceProperty)) 
                {
                	this.SetBinding(ItemsSourceProperty, hTemplate.ItemsSource); 
                } 

                if (hTemplate.IsItemStringFormatSet && this.ItemStringFormat == parentItemsControl.ItemStringFormat) 
                {
                    // if the HDT defines a string format, turn off the
                    // forwarding of ItemTemplate[Selector] (which would get in the way).
                	this.ClearValue(HeaderedItemsControl.ItemTemplateProperty); 
                	this.ClearValue(HeaderedItemsControl.ItemTemplateSelectorProperty);
 
                    // forward the HDT's string format 
                	this.ClearValue(HeaderedItemsControl.ItemStringFormatProperty);
                    var setItemStringFormat = (hTemplate.ItemStringFormat != null); 
                    if (setItemStringFormat)
                    {
                    	this.ItemStringFormat = hTemplate.ItemStringFormat;
                    } 
                }
 
                if (hTemplate.IsItemTemplateSelectorSet && ItemTemplateSelector == parentItemsControl.ItemTemplateSelector) 
                {
                    // if the HDT defines a template selector, turn off the 
                    // forwarding of ItemTemplate (which would get in the way).
                	this.ClearValue(HeaderedItemsControl.ItemTemplateProperty);

                    // forward the HDT's template selector 
                	this.ClearValue(HeaderedItemsControl.ItemTemplateSelectorProperty);
                    var setItemTemplateSelector = (hTemplate.ItemTemplateSelector != null); 
                    if (setItemTemplateSelector) 
                    {
                        Ithis.temTemplateSelector = hTemplate.ItemTemplateSelector; 
                    }
                }

                if (hTemplate.IsItemTemplateSet && templateMatches) 
                {
                    // forward the HDT's template 
                	this.ClearValue(HeaderedItemsControl.ItemTemplateProperty); 
                    var setItemTemplate = (hTemplate.ItemTemplate != null);
                    if (setItemTemplate) 
                    {
                    	this.ItemTemplate = hTemplate.ItemTemplate;
                    }
                } 

                if (hTemplate.IsItemContainerStyleSelectorSet && ItemContainerStyleSelector == parentItemsControl.ItemContainerStyleSelector) 
                { 
                    // if the HDT defines a container-style selector, turn off the
                    // forwarding of ItemContainerStyle (which would get in the way). 
                	this.ClearValue(HeaderedItemsControl.ItemContainerStyleProperty);

                    // forward the HDT's container-style selector
                	this.ClearValue(HeaderedItemsControl.ItemContainerStyleSelectorProperty); 
                    var setItemContainerStyleSelector = (hTemplate.ItemContainerStyleSelector != null);
                    if (setItemContainerStyleSelector) 
                    { 
                    	this.ItemContainerStyleSelector = hTemplate.ItemContainerStyleSelector;
                    } 
                }

                if (hTemplate.IsItemContainerStyleSet && containerStyleMatches)
                { 
                    // forward the HDT's container style
                	this.ClearValue(HeaderedItemsControl.ItemContainerStyleProperty); 
                    var setItemContainerStyle = (hTemplate.ItemContainerStyle != null); 
                    if (setItemContainerStyle)
                    { 
                    	this.ItemContainerStyle = hTemplate.ItemContainerStyle;
                    }
                }
 
                if (hTemplate.IsAlternationCountSet && AlternationCount == parentItemsControl.AlternationCount)
                { 
                    // forward the HDT's alternation count 
                	this.ClearValue(HeaderedItemsControl.AlternationCountProperty);
                    var setAlternationCount = true; 
                    if (setAlternationCount)
                    {
                    	this.AlternationCount = hTemplate.AlternationCount;
                    } 
                }
 
                if (hTemplate.IsItemBindingGroupSet && ItemBindingGroup == parentItemsControl.ItemBindingGroup) 
                {
                    // forward the HDT's ItemBindingGroup 
                	this.ClearValue(HeaderedItemsControl.ItemBindingGroupProperty);
                    var setItemBindingGroup = (hTemplate.ItemBindingGroup != null);
                    if (setItemBindingGroup)
                    { 
                    	this.ItemBindingGroup = hTemplate.ItemBindingGroup;
                    } 
                } 
            }
        },

        // return true if the dp is bound via the given Binding
//        bool 
        IsBound:function(/*DependencyProperty*/ dp, /*Binding*/ binding)
        { 
            /*BindingExpressionBase*/var bindExpr = BindingOperations.GetBindingExpression(this, dp);
            return (bindExpr != null && bindExpr.ParentBindingBase == binding); 
        },

        // return true if the Header should be a logical child 
//        bool 
        IsHeaderLogical:function()
        {
            // use cached result, if available
            if (this.ReadControlFlag(ControlBoolFlags.HeaderIsNotLogical)) 
                return false;
 
            // if Header property is data-bound, it should not be logical 
            if (BindingOperations.IsDataBound(this, HeaderedItemsControl.HeaderProperty))
            { 
            	this.WriteControlFlag(ControlBoolFlags.HeaderIsNotLogical, true);
                return false;
            }
 
            // otherwise, Header is logical
            return true; 
        } 
	});
	
	Object.defineProperties(HeaderedItemsControl.prototype,{
        /// <summary> 
        ///     Header is the data used to for the header of each item in the control.
        /// </summary> 
//        public object 
		Header:
        { 
            get:function() { return this.GetValue(HeaderedItemsControl.HeaderProperty); },
            set:function(value) { this.SetValue(HeaderedItemsControl.HeaderProperty, value); }
        },
        
        /// <summary>
        
        /// <summary>
        ///     True if Header is non-null, false otherwise.
        /// </summary> 
//        public bool 
        HasHeader: 
        { 
            get:function() { return this.GetValue(HeaderedItemsControl.HasHeaderProperty); }
        }, 

        /// <summary> 
        ///     HeaderTemplate is the template used to display the header of each item. 
        /// </summary>
//        public DataTemplate 
        HeaderTemplate:
        {
            get:function() { return this.GetValue(HeaderedItemsControl.HeaderTemplateProperty); },
            set:function(value) { this.SetValue(HeaderedItemsControl.HeaderTemplateProperty, value); } 
        },
        /// <summary> 
        ///     HeaderTemplateSelector allows the application writer to provide custom logic
        ///     for choosing the template used to display the header of each item. 
        /// </summary> 
        /// <remarks>
        ///     This property is ignored if <seealso cref="HeaderTemplate"/> is set. 
        /// </remarks>
//        public DataTemplateSelector 
        HeaderTemplateSelector:
        { 
            get:function() { return this.GetValue(HeaderedItemsControl.HeaderTemplateSelectorProperty); },
            set:function(value) { this.SetValue(HeaderedItemsControl.HeaderTemplateSelectorProperty, value); } 
        }, 
 
        /// <summary>
        ///     HeaderStringFormat is the format used to display the header content as a string. 
        ///     This arises only when no template is available.
        /// </summary>
//        public String 
        HeaderStringFormat: 
        {
            get:function() { return this.GetValue(HeaderedItemsControl.HeaderStringFormatProperty); },
            set:function(value) { this.SetValue(HeaderedItemsControl.HeaderStringFormatProperty, value); } 
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

                if (this.ReadControlFlag(ControlBoolFlags.HeaderIsNotLogical) || header == null) 
                { 
                    return ItemsControl.prototype.LogicalChildren;
                } 

                return new HeaderedItemsModelTreeEnumerator(this, ItemsControl.prototype.LogicalChildren, header);
            }
        },

        // return true if the Header is a data item 
//        bool 
        HeaderIsItem:
        {
            get:function() { return this.ReadControlFlag(ControlBoolFlags.HeaderIsItem); },
            set:function(value) { this.WriteControlFlag(ControlBoolFlags.HeaderIsItem, value); } 
        }
        
	});
	
	Object.defineProperties(HeaderedItemsControl,{
	    /// <summary>
        ///     The DependencyProperty for the Header property. 
        ///     Flags:              None
        ///     Default Value:      null
        /// </summary>
//        public static readonly DependencyProperty 
		HeaderProperty:
        {
        	get:function(){
//        		if(HeaderedItemsControl._HeaderProperty === undefined){
//        			HeaderedItemsControl._HeaderProperty =
//                        HeaderedContentControl.HeaderProperty.AddOwner( 
//                                HeaderedItemsControl.Type, 
//                                /*new FrameworkPropertyMetadata(
//                                        null, 
//                                        new PropertyChangedCallback(null, OnHeaderChanged))*/
//                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
//                                        null, 
//                                        new PropertyChangedCallback(null, OnHeaderChanged)));	
//        		}
        		
        		return HeaderedItemsControl._HeaderProperty;
        	}
        },    
        
        ///     The key needed set a read-only property. 
        /// </summary> 
//        private static readonly DependencyPropertyKey 
		HasHeaderPropertyKey:
        {
        	get:function(){
//        		if(HeaderedItemsControl._HasHeaderPropertyKey === undefined){
//        			HeaderedItemsControl._HasHeaderPropertyKey =
//                        HeaderedContentControl.HasHeaderPropertyKey;	
//        		}
//        		
//        		return HeaderedItemsControl._HasHeaderPropertyKey;
        		return HeaderedContentControl.HasHeaderPropertyKey;	
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
//        		if(HeaderedItemsControl._HasHeaderProperty === undefined){
//        			HeaderedItemsControl._HasHeaderProperty = 
//        				HeaderedContentControl.HasHeaderProperty.AddOwner(HeaderedItemsControl.Type);	
//        		}
        		
        		return HeaderedItemsControl._HasHeaderProperty;
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
//        		if(HeaderedItemsControl._HeaderTemplateProperty === undefined){
//        			HeaderedItemsControl._HeaderTemplateProperty =
//                        HeaderedContentControl.HeaderTemplateProperty.AddOwner( 
//                                HeaderedItemsControl.Type,
//                                /*new FrameworkPropertyMetadata(
//                                        null,
//                                        new PropertyChangedCallback(null, OnHeaderTemplateChanged))*/
//                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
//                                        null,
//                                        new PropertyChangedCallback(null, OnHeaderTemplateChanged))); 	
//        		}
        		
        		return HeaderedItemsControl._HeaderTemplateProperty;
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
//        		if(HeaderedItemsControl._HeaderTemplateSelectorProperty === undefined){
//        			HeaderedItemsControl._HeaderTemplateSelectorProperty = 
//                        HeaderedContentControl.HeaderTemplateSelectorProperty.AddOwner( 
//                                HeaderedItemsControl.Type,
//                                /*new FrameworkPropertyMetadata( 
//                                        null,
//                                        new PropertyChangedCallback(null, OnHeaderTemplateSelectorChanged))*/
//                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
//                                        null,
//                                        new PropertyChangedCallback(null, OnHeaderTemplateSelectorChanged)));
//        		}
        		
        		return HeaderedItemsControl._HeaderTemplateSelectorProperty;
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
//        		if(HeaderedItemsControl._HeaderStringFormatProperty === undefined){
//        			HeaderedItemsControl._HeaderStringFormatProperty = 
//                        DependencyProperty.Register(
//                                "HeaderStringFormat", 
//                                String.Type,
//                                HeaderedItemsControl.Type,
//                                /*new FrameworkPropertyMetadata(
//                                        null, 
//                                      new PropertyChangedCallback(null, OnHeaderStringFormatChanged))*/
//                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
//                                        null, 
//                                      new PropertyChangedCallback(null, OnHeaderStringFormatChanged)));
//        		}
        		
        		return HeaderedItemsControl._HeaderStringFormatProperty;
        	}
        }
        
	});
	
    /// <summary>
    ///     Called when HeaderProperty is invalidated on "d." 
    /// </summary> 
//    private static void 
	function OnHeaderChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.SetValue(HeaderedItemsControl.HasHeaderPropertyKey, (e.NewValue != null) ? true : false);
        d.OnHeaderChanged(e.OldValue, e.NewValue); 
    }
    
    /// <summary> 
    ///     Called when HeaderTemplateProperty is invalidated on "d."
    /// </summary> 
//    private static void 
	function OnHeaderTemplateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        d.OnHeaderTemplateChanged( e.OldValue, e.NewValue); 
    }

    /// <summary> 
    ///     Called when HeaderTemplateSelectorProperty is invalidated on "d."
    /// </summary>
//    private static void 
	function OnHeaderTemplateSelectorChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.OnHeaderTemplateSelectorChanged( e.OldValue, e.NewValue); 
    } 
    /// <summary>
    ///     Called when HeaderStringFormatProperty is invalidated on "d."
    /// </summary>
//    private static void 
	function OnHeaderStringFormatChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        d.OnHeaderStringFormatChanged(e.OldValue, e.NewValue); 
    }
	
	function RegisterDependencyProperties(){
		HeaderedItemsControl._HeaderProperty =
            HeaderedContentControl.HeaderProperty.AddOwner( 
                    HeaderedItemsControl.Type, 
                    /*new FrameworkPropertyMetadata(
                            null, 
                            new PropertyChangedCallback(null, OnHeaderChanged))*/
                    FrameworkPropertyMetadata.BuildWithDVandPCCB(
                            null, 
                            new PropertyChangedCallback(null, OnHeaderChanged)));	
		
		HeaderedItemsControl._HasHeaderProperty = 
			HeaderedContentControl.HasHeaderProperty.AddOwner(HeaderedItemsControl.Type);
		
		HeaderedItemsControl._HeaderStringFormatProperty = 
            DependencyProperty.Register(
                    "HeaderStringFormat", 
                    String.Type,
                    HeaderedItemsControl.Type,
                    /*new FrameworkPropertyMetadata(
                            null, 
                          new PropertyChangedCallback(null, OnHeaderStringFormatChanged))*/
                    FrameworkPropertyMetadata.BuildWithDVandPCCB(
                            null, 
                          new PropertyChangedCallback(null, OnHeaderStringFormatChanged)));
		
		HeaderedItemsControl._HeaderTemplateSelectorProperty = 
            HeaderedContentControl.HeaderTemplateSelectorProperty.AddOwner( 
                    HeaderedItemsControl.Type,
                    /*new FrameworkPropertyMetadata( 
                            null,
                            new PropertyChangedCallback(null, OnHeaderTemplateSelectorChanged))*/
                    FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                            null,
                            new PropertyChangedCallback(null, OnHeaderTemplateSelectorChanged)));
		
		HeaderedItemsControl._HeaderTemplateProperty =
            HeaderedContentControl.HeaderTemplateProperty.AddOwner( 
                    HeaderedItemsControl.Type,
                    /*new FrameworkPropertyMetadata(
                            null,
                            new PropertyChangedCallback(null, OnHeaderTemplateChanged))*/
                    FrameworkPropertyMetadata.BuildWithDVandPCCB(
                            null,
                            new PropertyChangedCallback(null, OnHeaderTemplateChanged)));
	}

	
	HeaderedItemsControl.Type = new Type("HeaderedItemsControl", HeaderedItemsControl, [ItemsControl.Type]);
	RegisterDependencyProperties();
	
	return HeaderedItemsControl;
});
 
      
        
    
