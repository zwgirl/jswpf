package org.summer.view.widget.data;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.Type;
import org.summer.view.widget.Uri;
import org.summer.view.widget.markup.IUriContext;
import org.summer.view.widget.model.PropertyDescriptor;
import org.summer.view.widget.navigation.BaseUriHelper;

//TypeDescriptor context to provide TypeConverters with the app's BaseUri
/*internal*/ public class ValueConverterContext extends ITypeDescriptorContext implements IUriContext
{ 
    // redirect to IUriContext service
    /*virtual*/ public Object GetService(Type serviceType) 
    { 
        if (serviceType == typeof(IUriContext))
        { 
            return this as IUriContext;
        }
        return null;
    } 

    // call BaseUriHelper.GetBaseUri() if the target element is known. 
    // It does a tree walk trying to find a IUriContext implementer or a root element which has BaseUri explicitly set 
    // This get_BaseUri is only called from a TypeConverter which in turn
    // is called from one of our DefaultConverters in this source file. 
    public Uri BaseUri
    {
        get
            { 
                if (_cachedBaseUri == null)
                { 
                    if (_targetElement != null) 
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
                        _cachedBaseUri = BaseUriHelper.GetBaseUri(_targetElement); 
                    }
                    else
                    {
                        _cachedBaseUri = BaseUriHelper.BaseUri; 
                    }
                } 
                return _cachedBaseUri; 
            }
        set { throw new NotSupportedException(); } 
    }


    /*internal*/ public void SetTargetElement(DependencyObject target) 
    {
        if (target != null) 
            _nestingLevel++; 
        else
        { 
            if (_nestingLevel > 0)
                _nestingLevel--;
        }
        Invariant.Assert((_nestingLevel <= 1), "illegal to recurse/reenter ValueConverterContext.SetTargetElement()"); 
        _targetElement = target;
        _cachedBaseUri = null; 
    } 

    /*internal*/ public boolean IsInUse 
    {
        get { return (_nestingLevel > 0); }
    }

    // empty default implementation of interface ITypeDescriptorContext
    public IContainer Container         { get { return null; } } 
    public Object Instance              { get { return null; } } 
    public PropertyDescriptor PropertyDescriptor    { get { return null;} }
    public void OnComponentChanged()    { } 
    public boolean OnComponentChanging()   { return false; }

    // fields
    private DependencyObject _targetElement; 
    private int _nestingLevel;
    private Uri _cachedBaseUri; 
}