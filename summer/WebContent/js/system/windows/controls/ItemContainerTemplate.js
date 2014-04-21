/**
 * ItemContainerTemplate
 */

define(["dojo/_base/declare", "system/Type", "windows/DataTemplate", "controls/ItemContainerTemplateKey"], 
		function(declare, Type, DataTemplate, ItemContainerTemplateKey){
	var ItemContainerTemplate = declare("ItemContainerTemplate", DataTemplate,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(ItemContainerTemplate.prototype,{
        /// <summary>
        ///     The key that will be used if the ItemContainerTemplate is added to a 
        ///     ResourceDictionary in Xaml without a specified Key (x:Key).
        /// </summary>
//        public object 
		ItemContainerTemplateKey:
        { 
            get:function()
            { 
                return (this.DataType != null) ? new ItemContainerTemplateKey(this.DataType) : null; 
            }
        }   
	});
	
	Object.defineProperties(ItemContainerTemplate,{
		  
	});
	
	ItemContainerTemplate.Type = new Type("ItemContainerTemplate", ItemContainerTemplate, [DataTemplate.Type]);
	return ItemContainerTemplate;
});

