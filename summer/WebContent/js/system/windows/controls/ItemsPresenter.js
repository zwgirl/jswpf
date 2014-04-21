/**
 * ItemsPresenter
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement", "media/VisualTreeHelper", 
        "internal/Helper", "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions",
        "windows/PropertyChangedCallback", "controls/GroupStyle", "controls/ScrollContentPresenter", "controls/ScrollViewer",
        "system/EventHandler", "controls/GroupItem", "controls/VirtualizingPanel", "controls/ItemsPanelTemplate",
        "system/EventArgs", "controls/ScrollViewer", "controls/ScrollContentPresenter"], 
		function(declare, Type, FrameworkElement, VisualTreeHelper,
				Helper, FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions,
				PropertyChangedCallback, GroupStyle, ScrollContentPresenter, ScrollViewer,
				EventHandler, GroupItem, VirtualizingPanel, ItemsPanelTemplate,
				EventArgs, ScrollViewer, ScrollContentPresenter){
	var ItemsPresenter = declare("ItemsPresenter", FrameworkElement,{
		constructor:function(){
			this._dom = window.document.createElement('div');
			this._dom.id = "ItemsPresenter";
		},
		
		/// <summary> 
        /// Called when the Template's tree is about to be generated
        /// </summary> 
//        internal override void 
		OnPreApplyTemplate:function()
        {
			FrameworkElement.prototype.OnPreApplyTemplate.call(this);
            this.AttachToOwner(); 
        },
 
        /// <summary> 
        ///     This is the virtual that sub-classes must override if they wish to get
        ///     notified that the template tree has been created. 
        /// </summary>
//        public override void 
        OnApplyTemplate:function()
        {
            // verify that the template produced a panel with no children 
            var panel = this.GetVisualChild(0);
            panel = panel.isInstanceOf(Panel) ? panel : null;
            if (panel == null || VisualTreeHelper.GetChildrenCount(panel) > 0) 
                throw new InvalidOperationException(SR.Get(SRID.ItemsPanelNotSingleNode)); 

            this.OnPanelChanged(this, EventArgs.Empty); 

            FrameworkElement.prototype.OnApplyTemplate.call(this);
        },
        /// <summary>
        /// Override of <seealso cref="FrameworkElement.MeasureOverride" />.
        /// </summary> 
        /// <param name="constraint">Constraint size is an "upper limit" that the return value should not exceed.</param>
        /// <returns>The ItemsPresenter's desired size.</returns> 
//        protected override Size 
        MeasureOverride:function() 
        {
            return Helper.MeasureElementWithSingleChild(this); 
        },


        /// <summary> 
        /// Override of <seealso cref="FrameworkElement.ArrangeOverride" />.
        /// </summary> 
        /// <param name="arrangeSize">Size the ItemsPresenter will assume.</param> 
//        protected override Size 
        ArrangeOverride:function()
        { 
//        	this._dom = parent;
            return Helper.ArrangeElementWithSingleChild(this);
        },
        
        // Internal helper so FrameworkElement could see call the template changed virtual
//        internal override void 
        OnTemplateChangedInternal:function(/*FrameworkTemplate*/ oldTemplate, /*FrameworkTemplate*/ newTemplate)
        { 
            this.OnTemplateChanged(/*(ItemsPanelTemplate)*/oldTemplate, /*(ItemsPanelTemplate)*/newTemplate);
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
        OnTemplateChanged:function(/*ItemsPanelTemplate*/ oldTemplate, /*ItemsPanelTemplate*/ newTemplate) 
        { 
        },
        
//        internal override void 
        OnAncestorChanged:function() 
        {
            if (this.TemplatedParent == null)
            {
                this.UseGenerator(null); 
                this.ClearPanel();
            } 
 
            FrameworkElement.prototype.OnAncestorChanged.call(this);
        }, 

        // initialize (called during measure, from ApplyTemplate) 
//        void 
        AttachToOwner:function()
        {
            var templatedParent = this.TemplatedParent;
            var owner = templatedParent instanceof ItemsControl ? templatedParent : null; 
            /*ItemContainerGenerator*/var generator;
 
            if (owner != null) 
            {
                // top-level presenter - get information from ItemsControl 
                generator = owner.ItemContainerGenerator;
            }
            else
            { 
                // subgroup presenter - get information from GroupItem
                var parentGI = templatedParent instanceof GroupItem ? templatedParent : null; 
                /*ItemsPresenter*/var parentIP = ItemsPresenter.FromGroupItem(parentGI); 

                if (parentIP != null) 
                    owner = parentIP.Owner;

                generator = (parentGI != null) ? parentGI.Generator : null;
            } 

            this._owner = owner; 
            this.UseGenerator(generator); 

            // create the panel, based either on ItemsControl.ItemsPanel or GroupStyle.Panel 
            /*ItemsPanelTemplate*/var template = null;
            /*GroupStyle*/var groupStyle = (this._generator != null) ? this._generator.GroupStyle : null;
            if (groupStyle != null)
            { 
                // If GroupStyle.Panel is set then we dont honor ItemsControl.IsVirtualizing
                template = groupStyle.Panel; 
                if (template == null) 
                {
                    // create default Panels 
                    if (VirtualizingPanel.GetIsVirtualizingWhenGrouping(owner))
                    {
                        template = GroupStyle.DefaultVirtualizingStackPanel;
                    } 
                    else
                    { 
                        template = GroupStyle.DefaultStackPanel; 
                    }
                } 
            }
            else
            {
                // Its a leaf-level ItemsPresenter, therefore pick ItemsControl.ItemsPanel 
                template = (this._owner != null) ? this._owner.ItemsPanel : null;
            } 
            this.Template = template; 
        },
 
//        void 
        UseGenerator:function(/*ItemContainerGenerator*/ generator)
        {
            if (generator == this._generator)
                return; 

            if (this._generator != null) 
            	this._generator.PanelChanged.Remove(new EventHandler(this, this.OnPanelChanged)); 

            this._generator = generator; 

            if (this._generator != null)
            	this._generator.PanelChanged.Combine(new EventHandler(this, this.OnPanelChanged));
        }, 

//        private void 
        OnPanelChanged:function(/*object*/ sender, /*EventArgs*/ e) 
        { 
            // something has changed that affects the ItemsPresenter.
            // Re-measure.  This will recalculate everything from scratch. 
        	this.InvalidateMeasure();

            //
            // If we're under a ScrollViewer then its ScrollContentPresenter needs to 
            // be updated to work with the new panel.
            // 
 
            /*ScrollViewer*/var parent = this.Parent instanceof ScrollViewer ? this.Parent : null;
            if (parent != null) 
            {
                // If our logical parent is a ScrollViewer then the visual parent is a ScrollContentPresenter.
                /*ScrollContentPresenter*/var scp = VisualTreeHelper.GetParent(this);
                scp = scp instanceof ScrollContentPresenter ? scp : null;
 
                if (scp != null)
                { 
                    scp.HookupScrollingComponents(); 
                }
            } 
        },

        // workaround, pending bug 953483.  The panel is
        // being removed from the tree, so it should release 
        // its resources (chiefly - stop listening for generator's
        // ItemsChanged event).  Until there's a mechanism for 
        // this, just mark the panel as a non-ItemsHost, so 
        // that the next time it gets ItemsChanged it will
        // stop listening.  (See also bug 942265) 
//        private void 
        ClearPanel:function()
        {
            var oldPanel = (this.VisualChildrenCount > 0) ? (this.GetVisualChild(0) instanceof Panel ? this.GetVisualChild(0): null) : null;
            var type = null; 

            if( this.Template != null ) 
            { 
                // Get the type of the template content's root
 
                // Is this a FEF-based template?
                if( this.Template.VisualTree != null )
                {
                    type = this.Template.VisualTree.Type; 
                }
 
//                // Or, is it a (non-empty) Baml-based template? 
//                else if (Template.HasXamlNodeContent)
//                { 
//                    System.Xaml.XamlType xType = (Template.Template as TemplateContent).RootType;
//                    type = xType.UnderlyingType;
//                }
            } 

            if (oldPanel != null && oldPanel.GetType() == type) 
            { 
                oldPanel.IsItemsHost = false;
            } 
        }
	});
	
	Object.defineProperties(ItemsPresenter.prototype,{
//		internal ItemsControl 
		Owner:
        {
            get:function() { return this._owner; }
        }, 

//        internal ItemContainerGenerator 
        Generator: 
        { 
            get:function() { return this._generator; }
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
        /// Template Property
        /// </summary> 
//        private ItemsPanelTemplate 
        Template:
        { 
            get:function() {  return this._templateCache; }, 
            set:function(value) { this.SetValue(ItemsPresenter.TemplateProperty, value); }
        } 
	});
	
	Object.defineProperties(ItemsPresenter,{
        /// <summary> 
        /// TemplateProperty 
        /// </summary>
//        internal static readonly DependencyProperty 
		TemplateProperty:
	    {
	    	get:function(){
	    		if(ItemsPresenter._CornerRadiusProperty == undefined){
	    			ItemsPresenter._CornerRadiusProperty = 
	                    DependencyProperty.Register(
	                            "Template",
	                            ItemsPanelTemplate.Type,
	                            ItemsPresenter.Type, 
	                            /*new FrameworkPropertyMetadata(
	                                    (ItemsPanelTemplate) null,  // default value 
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure, 
	                                    new PropertyChangedCallback(OnTemplateChanged))*/
	                            FrameworkPropertyMetadata.Build3PCCB(
	                                     null,  // default value 
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure, 
	                                    new PropertyChangedCallback(null, OnTemplateChanged)));	
	    		}
	    		
	    		return ItemsPresenter._CornerRadiusProperty;
	    	}
	    }	  
	});
	
	  // Property invalidation callback invoked when TemplateProperty is invalidated
//    private static void 
	function OnTemplateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        StyleHelper.UpdateTemplateCache(d, /*(FrameworkTemplate)*/ e.OldValue, /*(FrameworkTemplate)*/ e.NewValue, ItemsPresenter.TemplateProperty);
    } 
	
//    internal static ItemsPresenter 
	ItemsPresenter.FromPanel = function(/*Panel*/ panel) 
    {
        if (panel == null) 
            return null;

        return panel.TemplatedParent instanceof ItemsPresenter ? panel.TemplatedParent : null;
    }; 

//    internal static ItemsPresenter 
    ItemsPresenter.FromGroupItem = function(/*GroupItem*/ groupItem) 
    { 
        if (groupItem == null)
            return null; 

        var parent = VisualTreeHelper.GetParent(groupItem);
        parent = parent instanceof Visual ? parent : null;
        if (parent == null)
            return null; 

        var r= VisualTreeHelper.GetParent(parent);
        return r = r instanceof ItemsPresenter ? r : null; 
    }; 

    
	ItemsPresenter.Type = new Type("ItemsPresenter", ItemsPresenter, [FrameworkElement.Type]);
	return ItemsPresenter;
});

//        //-----------------------------------------------------
//        // 
//        // Private Fields
//        // 
//        //------------------------------------------------------ 
//
//        ItemsControl _owner; 
//        ItemContainerGenerator _generator;
//        ItemsPanelTemplate _templateCache;

