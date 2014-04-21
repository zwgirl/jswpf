package org.summer.view.window;

import org.summer.view.widget.Application;
import org.summer.view.widget.BaseValueSourceInternal;
import org.summer.view.widget.ResourceDictionary;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.ICollection;

/*internal*/ public class DeferredAppResourceReference extends DeferredResourceReference
{ 
//    #region Constructor 

    /*internal*/ public DeferredAppResourceReference(ResourceDictionary dictionary, Object resourceKey)      
    {
    	 super(dictionary, resourceKey);
    }

//    #endregion Constructor

//    #region Methods 

    /*internal*/ public /*override*/ Object GetValue(BaseValueSourceInternal valueSource) 
    {
        /*lock*/ synchronized (((ICollection)Application.Current.Resources).SyncRoot)
        {
            return super.GetValue(valueSource); 
        }
    } 

    // Gets the type of the value it represents
    /*internal*/ public /*override*/ Type GetValueType() 
    {
    	/*lock*/ synchronized (((ICollection)Application.Current.Resources).SyncRoot)
        {
            return super.GetValueType(); 
        }
    } 

//    #endregion Methods
} 