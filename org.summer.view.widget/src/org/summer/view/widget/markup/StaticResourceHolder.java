package org.summer.view.widget.markup;

import org.summer.view.window.DeferredResourceReference;
/// <summary> 
/// This class is used in the resolution of a StaticResourceId. It is used to cache the
/// prefetched value during that processing. We have sub-classed StaticResourceExtension
/// so that we do not need to take the cost of increasing the size of a StaticResourceExtension
/// by 4 bytes. 
/// </summary>
public class StaticResourceHolder extends StaticResourceExtension 
{ 
//    #region Constructors

    /*internal*/public StaticResourceHolder(Object resourceKey, DeferredResourceReference prefetchedValue) 
    {
    	super(resourceKey);
    	
        _prefetchedValue = prefetchedValue;
    } 

//    #endregion Constructors 

//    #region Methods

    /*internal*/public /*override*/ DeferredResourceReference PrefetchedValue
    {
        get { return _prefetchedValue; }
    } 

//    #endregion Methods 

//    #region Data

    private DeferredResourceReference _prefetchedValue;

//    #endregion Data
} 

    