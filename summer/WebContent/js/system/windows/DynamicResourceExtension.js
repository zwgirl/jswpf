/**
 * DynamicResourceExtension
 */

define(["dojo/_base/declare", "system/Type", "markup/MarkupExtension", "windows/ResourceReferenceExpression"], 
		function(declare, Type, MarkupExtension, ResourceReferenceExpression){
	var DynamicResourceExtension = declare("DynamicResourceExtension", MarkupExtension,{
		constructor:function(/*bject*/ resourceKey)
		{
			if(resourceKey === undefined){
				this._resourceKey = null;
				return;
			}
			
	        if (resourceKey == null) 
            {
                throw new Error('ArgumentNullException("resourceKey")'); 
            } 
            this._resourceKey = resourceKey;
		},
		
	       /// <summary>
        ///  Return an object that should be set on the targetObject's targetProperty 
        ///  for this markup extension.  For DynamicResourceExtension, this is the object found in
        ///  a resource dictionary in the current parent chain that is keyed by ResourceKey 
        /// </summary> 
        /// <returns>
        ///  The object to set on this property. 
        /// </returns>
//        public override object 
        ProvideValue:function(/*IServiceProvider*/ serviceProvider)
        {
            if (this.ResourceKey == null) 
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.MarkupExtensionResourceKey)'); 
            } 

//            if (serviceProvider != null) 
//            {
//                // DynamicResourceExtensions are not allowed On CLR props except for Setter,Trigger,Condition (bugs 1183373,1572537)
//
//                DependencyObject targetDependencyObject; 
//                DependencyProperty targetDependencyProperty;
//                Helper.CheckCanReceiveMarkupExtension(this, serviceProvider, out targetDependencyObject, out targetDependencyProperty); 
//            } 

            return new ResourceReferenceExpression(ResourceKey); 
        }
	});
	
	Object.defineProperties(DynamicResourceExtension.prototype,{
        /// <summary>
        ///  The key in a Resource Dictionary used to find the object refered to by this 
        ///  Markup Extension. 
        /// </summary>
//        public object 
        ResourceKey:
        {
            get:function() { return this._resourceKey; },
            set:function(value) 
            {
                if (value == null) 
                { 
                    throw new Error('ArgumentNullException("value")');
                } 
                this._resourceKey = value;
            }
        }
	});
	
	DynamicResourceExtension.Type = new Type("DynamicResourceExtension", DynamicResourceExtension, [MarkupExtension.Type]);
	return DynamicResourceExtension;
});
