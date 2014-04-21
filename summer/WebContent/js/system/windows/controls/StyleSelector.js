/**
 * StyleSelector
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var StyleSelector = declare("StyleSelector", Object,{
		constructor:function(){
		},
		
        /// <summary> 
        /// Override this method to return an app specific <seealso cref="Style"/>.
        /// </summary>
        /// <param name="item">The data content</param>
        /// <param name="container">The element to which the style will be applied</param> 
        /// <returns>an app-specific style to apply, or null.</returns>
//        public virtual Style 
		SelectStyle:function(/*object*/ item, /*DependencyObject*/ container) 
        { 
            return null;
        } 
	});
	
	StyleSelector.Type = new Type("StyleSelector", StyleSelector, [Object.Type]);
	return StyleSelector;
});

