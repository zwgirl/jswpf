/**
 * TemplateBindingExtension
 */

define(["dojo/_base/declare", "system/Type", "markup/MarkupExtension", "windows/TemplateBindingExpression"],
		function(declare, Type, MarkupExtension, TemplateBindingExpression){
	var TemplateBindingExtension = declare("TemplateBindingExtension", MarkupExtension,{
		constructor:function(/*DependencyProperty*/ property)
        {
			if(property === undefined){
				property = null;
			}
			
            if (property != null) {
                this._property = property; 
            } 
        },
        
        ///  Return an object that should be set on the targetObject's targetProperty 
        ///  for this markup extension.  For TemplateBindingExtension, this is the object found in 
        ///  a resource dictionary in the current parent chain that is keyed by ResourceKey
        /// <param name="serviceProvider">ServiceProvider that can be queried for services.</param>
        /// <returns>
        ///  The object to set on this property.
        /// </returns> 
//        public override object 
        ProvideValue:function(/*IServiceProvider*/ serviceProvider)
        { 
            if (this.Property == null){
                throw new Error('InvalidOperationException(SR.Get(SRID.MarkupExtensionProperty)'); 
            }

            return new TemplateBindingExpression(this);
        } 
        
	});
	
	Object.defineProperties(TemplateBindingExtension.prototype,{
        ///     Property we are binding to 
//        public DependencyProperty 
        Property:
        {
            get:function() { return this._property; },
            set:function(value) 
            {
                if (value == null) 
                { 
                    throw new ArgumentNullException("value");
                } 
                this._property = value;
            }
        },
 
        ///     ValueConverter to interpose between the source and target properties 
//        public IValueConverter 
        Converter:
        {
            get:function() { return this._converter; },
            set:function(value)
            { 
                if (value == null)
                { 
                    throw new ArgumentNullException("value"); 
                }
                this._converter = value; 
            }
        },

        ///     ConverterParameter we are binding to
//        public object 
        ConverterParameter:
        { 
            get:function() { return this._parameter; },
            set:function(value) { this._parameter = value; }
        }
	});
	
	TemplateBindingExtension.Type = new Type("TemplateBindingExtension", TemplateBindingExtension, [MarkupExtension.Type]);
	return TemplateBindingExtension;
});
 


 
 
//        private DependencyProperty _property;
//        private IValueConverter _converter; 
//        private object _parameter; 
//    }
//} 

