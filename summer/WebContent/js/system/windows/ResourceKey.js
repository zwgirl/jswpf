/**
 * ResourceKey
 */

define(["dojo/_base/declare", "system/Type", "markup/MarkupExtension"], 
		function(declare, Type, MarkupExtension){
	var ResourceKey = declare("ResourceKey", MarkupExtension,{
		constructor:function(){
		},
		
		/// <summary> 
        ///  Return this object.  ResourceKeys are typically used as a key in a dictionary.
        /// </summary> 
//        public override object 
		ProvideValue:function(/*IServiceProvider*/ serviceProvider) 
        {
            return this; 
        }
	});
	
	Object.defineProperties(ResourceKey.prototype,{
        /// <summary>
        ///     Used to determine where to look for the resource dictionary that holds this resource. 
        /// </summary> 
//        public abstract Assembly 
		Assembly:
        { 
            get:function(){}
        }
	});
	
	ResourceKey.Type = new Type("ResourceKey", ResourceKey, [MarkupExtension.Type]);
	return ResourceKey;
});

