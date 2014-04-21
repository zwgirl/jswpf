/**
 * ValueConverterContext
 */

define(["dojo/_base/declare", "system/Type", "componentmodel/ITypeDescriptorContext", "markup/IUriContext"], 
		function(declare, Type, ITypeDescriptorContext, IUriContext){
	var ValueConverterContext = declare("ValueConverterContext", ITypeDescriptorContext,{
		constructor:function(){
	        // fields
//	        private DependencyObject 
			this._targetElement = null; 
//	        private int 
			this._nestingLevel = 0;
//	        private Uri 
			this._cachedBaseUri = null; 
		},
		
        // redirect to IUriContext service
//        virtual public object 
		GetService:function(/*Type*/ serviceType) 
        { 
            if (serviceType == typeof(IUriContext))
            { 
                return this instanceof IUriContext ? this : null;
            }
            return null;
        },
//        internal void 
        SetTargetElement:function(/*DependencyObject*/ target) 
        {
            if (target != null) 
                this._nestingLevel++; 
            else
            { 
                if (this._nestingLevel > 0)
                	this._nestingLevel--;
            }
//            Invariant.Assert((_nestingLevel <= 1), "illegal to recurse/reenter ValueConverterContext.SetTargetElement()"); 
            this._targetElement = target;
            this._cachedBaseUri = null; 
        },
        
//        public void 
        OnComponentChanged:function()    { }, 
//        public bool 
        OnComponentChanging:function()   { return false; },
        
	});
	
	Object.defineProperties(ValueConverterContext.prototype,{
		// call BaseUriHelper.GetBaseUri() if the target element is known. 
        // It does a tree walk trying to find a IUriContext implementer or a root element which has BaseUri explicitly set 
        // This get_BaseUri is only called from a TypeConverter which in turn
        // is called from one of our DefaultConverters in this source file. 
//        public Uri 
		BaseUri:
        {
            get:function()
            { 
                if (this._cachedBaseUri == null)
                { 
                    if (this._targetElement != null) 
                    {
                        // GetBaseUri looks for a optional BaseUriProperty attached DP. 
                        // This can cause a re-entrancy if that BaseUri is also data bound.
                        // Ideally the BaseUri DP should be flagged as NotDataBindable but
                        // unfortunately that DP is a core DP and not aware of the framework metadata
                        // 
                        // GetBaseUri can raise SecurityExceptions if e.g. the app doesn't have
                        // the correct FileIO permission. 
                        // Any security exception is initially caught in BindingExpression.ConvertHelper/.ConvertBackHelper 
                        // but then rethrown since it is a critical exception.
                    	this._cachedBaseUri = BaseUriHelper.GetBaseUri(this._targetElement); 
                    }
                    else
                    {
                    	this._cachedBaseUri = BaseUriHelper.BaseUri; 
                    }
                } 
                return this._cachedBaseUri; 
            },
            set:function(value) { throw new NotSupportedException(); } 
        },
        
//        internal bool 
        IsInUse: 
        {
            get:function() { return (this._nestingLevel > 0); }
        },
        
     // empty default implementation of interface ITypeDescriptorContext
//        public IContainer 
        Container:         { get:function() { return null; } }, 
//        public object 
        Instance:              { get:function() { return null; } }, 
//        public PropertyDescriptor 
        PropertyDescriptor:    { get:function() { return null;} }
	});
	
	ValueConverterContext.Type = new Type("ValueConverterContext", ValueConverterContext, 
			[ITypeDescriptorContext.Type, IUriContext.Type]);
	return ValueConverterContext;
});
