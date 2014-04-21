package org.summer.view.window;

import org.summer.view.widget.BaseValueSourceInternal;
import org.summer.view.widget.DeferredReference;
import org.summer.view.widget.ResourceDictionary;
import org.summer.view.widget.StyleHelper;
import org.summer.view.widget.Type;
import org.summer.view.widget.internal.WeakReferenceList;

/*internal*/ public class DeferredResourceReference extends DeferredReference
{
//    #region Constructor 

    /*internal*/ public DeferredResourceReference(ResourceDictionary dictionary, Object key) 
    { 
        _dictionary = dictionary;
        _keyOrValue = key; 
    }

//    #endregion Constructor

//    #region Methods

    /*internal*/ public /*override*/ Object GetValue(BaseValueSourceInternal valueSource) 
    {
        // If the _value cache is invalid fetch the value from 
        // the dictionary else just retun the cached value
        if (_dictionary != null)
        {
            boolean canCache; 
            Object value  = _dictionary.GetValue(_keyOrValue, /*out*/ canCache);
            if (canCache) 
            { 
                // Note that we are replacing the _keyorValue field
                // with the value and nuking the _dictionary field. 
                _keyOrValue = value;
                RemoveFromDictionary();
            }

            // Freeze if this value originated from a style or template
            boolean freezeIfPossible = 
                valueSource == BaseValueSourceInternal.ThemeStyle || 
                valueSource == BaseValueSourceInternal.ThemeStyleTrigger ||
                valueSource == BaseValueSourceInternal.Style || 
                valueSource == BaseValueSourceInternal.TemplateTrigger ||
                valueSource == BaseValueSourceInternal.StyleTrigger ||
                valueSource == BaseValueSourceInternal.ParentTemplate ||
                valueSource == BaseValueSourceInternal.ParentTemplateTrigger; 

            // This is to freeze values produced by deferred 
            // references within styles and templates 
            if (freezeIfPossible)
            { 
                StyleHelper.SealIfSealable(value);
            }

            // tell any listeners (e.g. ResourceReferenceExpressions) 
            // that the value has been inflated
            OnInflated(); 

            return value;
        } 

        return _keyOrValue;
    }

    // Tell the listeners that we're inflated.
    private void OnInflated() 
    { 
        if (_inflatedList != null)
        { 
            for/*each*/ (ResourceReferenceExpression listener : _inflatedList)
            {
                listener.OnDeferredResourceInflated(this);
            } 
        }
    } 

    // Gets the type of the value it represents
    /*internal*/ public /*override*/ Type GetValueType() 
    {
        if (_dictionary != null)
        {
            // Take a peek at the element type of the ElementStartRecord 
            // within the ResourceDictionary's deferred content.
            boolean found; 
            return _dictionary.GetValueType(_keyOrValue, /*out*/ found); 
        }
        else 
        {
            return _keyOrValue != null ? _keyOrValue.GetType() : null;
        }
    } 

    // remove this DeferredResourceReference from its ResourceDictionary 
    /*internal*/ public /*virtual*/ void RemoveFromDictionary() 
    {
        if (_dictionary != null) 
        {
            _dictionary.DeferredResourceReferences.Remove(this);
            _dictionary = null;
        } 
    }

    /*internal*/ public /*virtual*/ void AddInflatedListener(ResourceReferenceExpression listener) 
    {
        if (_inflatedList == null) 
        {
            _inflatedList = new WeakReferenceList(this);
        }
        _inflatedList.Add(listener); 
    }

    /*internal*/ public /*virtual*/ void RemoveInflatedListener(ResourceReferenceExpression listener) 
    {
//        Debug.Assert(_inflatedList != null); 

        if (_inflatedList != null)
        {
            _inflatedList.Remove(listener); 
        }
    } 

//    #endregion Methods

//    #region Properties

    /*internal*/ public /*virtual*/ Object Key
    { 
        get { return _keyOrValue; }
    } 

    /*internal*/ public ResourceDictionary Dictionary
    { 
        get { return _dictionary; }
        set { _dictionary = value; }
    }

    /*internal*/ public /*virtual*/ Object Value
    { 
        get { return _keyOrValue; } 
        set { _keyOrValue = value; }
    } 

    /*internal*/ public /*virtual*/ boolean IsUnset
    {
        get { return false; } 
    }

    /*internal*/ public boolean IsInflated 
    {
        get { return (_dictionary == null); } 
    }

//    #endregion Properties

//    #region Data

    private ResourceDictionary _dictionary; 
    protected Object _keyOrValue;
    private WeakReferenceList _inflatedList; 

//    #endregion Data
}