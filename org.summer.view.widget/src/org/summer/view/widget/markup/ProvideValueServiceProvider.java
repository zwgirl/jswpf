package org.summer.view.widget.markup;

import org.summer.view.widget.Freezable;
import org.summer.view.widget.IServiceProvider;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.Type;
import org.summer.view.widget.Uri;
   /// <summary> 
    ///  Base class for all Xaml markup extensions.
    /// </summary>

/*internal*/public class ProvideValueServiceProvider implements IServiceProvider, IProvideValueTarget, 
				IXamlTypeResolver, IUriContext, IFreezeFreezables 
{
    // Construction 

    /*internal*/ ProvideValueServiceProvider(ParserContext context)
    { 
        _context = context;
    }

    /*internal*/ public ProvideValueServiceProvider() 
    {
    } 

    // Set the TargetObject/Property (for use by IProvideValueTarget).

    /*internal*/ public void SetData(Object targetObject, Object targetProperty)
    {
        _targetObject = targetObject;
        _targetProperty = targetProperty; 
    }

    // Clear the TargetObject/Property (after a call to ProvideValue) 

    /*internal*/ void ClearData() 
    {
        _targetObject = _targetProperty = null;
    }


    // IXamlTypeResolver implementation 

    public Type /*IXamlTypeResolver.*/Resolve(String qualifiedTypeName) // E.g. foo:Class
    { 
        return _context.XamlTypeMapper.GetTypeFromBaseString(qualifiedTypeName, _context, true);
    }

    // IProvideValueTarget implementation 

    public Object /*IProvideValueTarget.*/TargetObject 
    { 
        get { return _targetObject; }
    } 
    public Object /*IProvideValueTarget.*/TargetProperty
    {
        get { return _targetProperty; }
    } 

    // IUriContext implementation 

    public Uri /*IUriContext.*/BaseUri
    { 
        get { return _context.BaseUri; }
        set { throw new NotSupportedException(SR.Get(SRID.ParserProvideValueCantSetUri)); }
    }

    boolean /*IFreezeFreezables.*/FreezeFreezables
    { 
        get 
        {
            return _context.FreezeFreezables; 
        }
    }

    boolean /*IFreezeFreezables.*/TryFreeze(String value, Freezable freezable) 
    {
        return _context.TryCacheFreezable(value, freezable); 
    } 

    Freezable /*IFreezeFreezables.*/TryGetFreezable(String value) 
    {
        return _context.TryGetFreezable(value);
    }


    // IServiceProvider implementation (this is the way to get to the 
    // above interface implementations). 

    public Object GetService(Type service) 
    {
        // IProvideValueTarget is the only implementation that
        // doesn't need the ParserContext

        if( service == typeof(IProvideValueTarget))
        { 
            return this as IProvideValueTarget; 
        }

        if( _context != null )
        {
            if( service == typeof(IXamlTypeResolver))
            { 
                return this as IXamlTypeResolver;
            } 

            else if( service == typeof(IUriContext))
            { 
                return this as IUriContext;
            }

            else if (service == typeof(IFreezeFreezables)) 
            {
                return this as IFreezeFreezables; 
            } 
        }


        return null;

    } 


    // Data 
    private ParserContext _context = null; 
    private Object _targetObject = null;
    private Object _targetProperty = null;


}