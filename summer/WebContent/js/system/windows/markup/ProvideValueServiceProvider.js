/**
 * ProvideValueServiceProvider
 */
/// <summary> 
///  Base class for all Xaml markup extensions.
/// </summary>
define(["dojo/_base/declare", "system/Type", "system/IServiceProvider", "markup/IUriContext",
        "markup/IProvideValueTarget"], 
		function(declare, Type, IServiceProvider, IUriContext,
				IProvideValueTarget){
	var ProvideValueServiceProvider = declare("ProvideValueServiceProvider", [IServiceProvider, IProvideValueTarget],{
		constructor:function(/*ParserContext*/ context){
			if(context === undefined){
				context = null;
			}
			
			this._context = context;
		},
		
		 // Set the TargetObject/Property (for use by IProvideValueTarget).
		 
//        internal void 
		SetData:function(/*object*/ targetObject, /*object*/ targetProperty)
        {
            this._targetObject = targetObject;
            this._targetProperty = targetProperty; 
        },
 
        // Clear the TargetObject/Property (after a call to ProvideValue) 
//        internal void 
        ClearData:function() 
        {
            this._targetObject = this._targetProperty = null;
        },

        // IXamlTypeResolver implementation 
//        Type IXamlTypeResolver.
        Resolve:function(/*string*/ qualifiedTypeName) // E.g. foo:Class
        { 
            return this._context.XamlTypeMapper.GetTypeFromBaseString(qualifiedTypeName, _context, true);
        },
        
//        bool IFreezeFreezables.
        TryFreeze:function(/*string*/ value, /*Freezable*/ freezable) 
        {
            return _context.TryCacheFreezable(value, freezable); 
        }, 

//        Freezable IFreezeFreezables.
        TryGetFreezable:function(/*string*/ value) 
        {
            return _context.TryGetFreezable(value);
        },

        // IServiceProvider implementation (this is the way to get to the 
        // above interface implementations). 
//        public object 
        GetService:function(/*Type*/ service) 
        {
            // IProvideValueTarget is the only implementation that
            // doesn't need the ParserContext
 
            if( service == IProvideValueTarget.Type)
            { 
                return this; 
            }
 
            if( _context != null )
            {
                if( service == typeof(IXamlTypeResolver))
                { 
                    return this instanceof IXamlTypeResolver ? this : null;
                } 
 
                else if( service == typeof(IUriContext))
                { 
                    return this instanceof IUriContext ? this : null;
                }

                else if (service == typeof(IFreezeFreezables)) 
                {
                    return this instanceof IFreezeFreezables ? this : null; 
                } 
            }
 

            return null;

        }
		
	});
	
	Object.defineProperties(ProvideValueServiceProvider.prototype,{
	       // IProvideValueTarget implementation 

//        object IProvideValueTarget.
		TargetObject: 
        { 
            get:function() { return this._targetObject; }
        }, 
//        object IProvideValueTarget.
		TargetProperty:
        {
            get:function() { return this._targetProperty; }
        }, 

        // IUriContext implementation 
 
//        Uri IUriContext.
		BaseUri:
        { 
            get:function() { return this._context.BaseUri; },
            set:function(value) { throw new NotSupportedException(SR.Get(SRID.ParserProvideValueCantSetUri)); }
        },
 
//        bool IFreezeFreezables.
		FreezeFreezables:
        { 
            get:function() 
            {
                return this._context.FreezeFreezables; 
            }
        }  
	});
	
	Object.defineProperties(ProvideValueServiceProvider,{
		  
	});
	
	ProvideValueServiceProvider.Type = new Type("ProvideValueServiceProvider", ProvideValueServiceProvider, 
			[IServiceProvider.Type, IProvideValueTarget.Type, /*IXamlTypeResolver.Type,*/ IUriContext.Type/*, IFreezeFreezables.Type*/]);
	return ProvideValueServiceProvider;
});

