/**
 * ItemsPanelTemplate
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkTemplate", "controls/Panel"], 
		function(declare, Type, FrameworkTemplate, Panel){
	
	var ItemsPresenter = null;
	function EnsureItemsPresenter(){
		if(ItemsPresenter == null){
			ItemsPresenter = using("controls/ItemsPresenter");
		}
		return ItemsPresenter;
	}
	
	
	var ItemsPanelTemplate = declare("ItemsPanelTemplate", FrameworkTemplate,{
		constructor:function(/*FrameworkElementFactory*/ root)
        { 
			if(root!==undefined){
	            this.VisualTree = root;
			}
        },

        // Subclasses must provide a way for the parser to directly set the 
        // target type.  For ItemsPanelTemplate, this is not allowed. 
//        internal override void 
        SetTargetTypeInternal:function(/*Type*/ targetType)
        { 
            throw new InvalidOperationException(SR.Get(SRID.TemplateNotTargetType));
        },

        // ProcessTemplateBeforeSeal
        // 
        // This is used in the case of templates defined with FEFs.  For templates
        // in Baml (the typical case), see the OnApply override. 
        // 
        // 1. Verify that
        //      a. root element is a Panel 
        // 2. Set IsItemsHost = true
        //
//        internal override void 
        ProcessTemplateBeforeSeal:function() 
        {
//            FrameworkElementFactory root; 
 
//            if( this.HasContent )
//            { 
//                // This is a Baml-style template
//
//                // Validate the root type (it must be a Panel)
// 
//                TemplateContent templateHolder = Template as TemplateContent;
//                System.Xaml.XamlType panelType = templateHolder.SchemaContext.GetXamlType(typeof(Panel)); 
//                if (templateHolder.RootType == null || !templateHolder.RootType.CanAssignTo(panelType)) 
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.ItemsPanelNotAPanel, templateHolder.RootType)); 
//                }
//            }
//
//            else if ((root = this.VisualTree) != null) 
//            {
//                // This is a FEF-style template 
//                if (!typeof(Panel).IsAssignableFrom(root.Type)) 
//                    throw new InvalidOperationException(SR.Get(SRID.ItemsPanelNotAPanel, root.Type));
// 
//                root.SetValue(Panel.IsItemsHostProperty, true);
//            }
            
        	var root;
        	if ((root = this.VisualTree) != null) 
        	{
        		// This is a FEF-style template 
        		if (!Panel.Type.IsAssignableFrom(root.Type)) 
        			throw new InvalidOperationException(SR.Get(SRID.ItemsPanelNotAPanel, root.Type));

        		root.SetValue(Panel.IsItemsHostProperty, true);
        	}
        },
        /// <summary> 
        ///     Validate against the following rules
        ///     1. Must have a non-null feTemplatedParent 
        ///     2. A ItemsPanelTemplate must be applied to a ContentPresenter
        /// </summary>
//        protected override void 
        ValidateTemplatedParent:function(/*FrameworkElement*/ templatedParent)
        { 
            // Must have a non-null feTemplatedParent
            if (templatedParent == null) 
            { 
                throw new ArgumentNullException("templatedParent");
            } 

            // A ItemsPanelTemplate must be applied to an ItemsPresenter
            if (!(templatedParent instanceof EnsureItemsPresenter()))
            { 
                throw new ArgumentException(SR.Get(SRID.TemplateTargetTypeMismatch, "ItemsPresenter", templatedParent.GetType().Name));
            } 
        } 

	});
	
	Object.defineProperties(ItemsPanelTemplate.prototype,{
        //  TargetType for ItemsPanelTemplate. This is override is 
        //  so FrameworkTemplate can see this property.
        // 
//        internal override Type 
        TargetTypeInternal:
        {
            get:function() {  return ItemsPanelTemplate.DefaultTargetType; }
        } 

	});
	
	Object.defineProperties(ItemsPanelTemplate, {

        // Target type of ItemsPanelTemplate is ItemsPresenter 
//        static internal Type 
        DefaultTargetType:
        { 
            get:function() { return ItemsPresenter.Type; } 
        }
	});
	
	ItemsPanelTemplate.Type = new Type("ItemsPanelTemplate", ItemsPanelTemplate, [FrameworkTemplate.Type]);
	return ItemsPanelTemplate;
});


 

