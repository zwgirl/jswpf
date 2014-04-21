/**
 * DataTemplateSelector
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var DataTemplateSelector = declare("DataTemplateSelector", null,{
        /// <summary>
        /// Override this method to return an app specific <seealso cref="DataTemplate"/>.
        /// </summary>
        /// <param name="item">The data content</param> 
        /// <param name="container">The element to which the template will be applied</param>
        /// <returns>an app-specific template to apply, or null.</returns> 
//        public virtual DataTemplate 
        SelectTemplate:function(/*object*/ item, /*DependencyObject*/ container) 
        {
            return null; 
        }
	});
	
	DataTemplateSelector.Type = new Type("DataTemplateSelector", DataTemplateSelector, [Object.Type]);
	return DataTemplateSelector;
});
