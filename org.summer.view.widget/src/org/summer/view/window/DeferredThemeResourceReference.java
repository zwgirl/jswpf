package org.summer.view.window;

import org.summer.view.widget.BaseValueSourceInternal;
import org.summer.view.widget.ResourceDictionary;
import org.summer.view.widget.ResourceKey;
import org.summer.view.widget.Type;
/*internal*/ public class DeferredThemeResourceReference extends DeferredResourceReference
{
//  #region Constructor 

  /*internal*/ public DeferredThemeResourceReference(ResourceDictionary dictionary, Object resourceKey, boolean canCacheAsThemeResource) 
  {
	  super(dictionary, resourceKey);
      _canCacheAsThemeResource = canCacheAsThemeResource; 
  }

//  #endregion Constructor

//  #region Methods

  /*internal*/ public /*override*/ Object GetValue(BaseValueSourceInternal valueSource) 
  {
      /*lock*/synchronized (SystemResources.ThemeDictionaryLock) 
      {
          // If the value cache is invalid fetch the value from
          // the dictionary else just retun the cached value
          if (Dictionary != null) 
          {
              boolean canCache = false; 
              Object key = Key; 
              Object value;

              SystemResources.IsSystemResourcesParsing = true;

              try
              { 
                  value = Dictionary.GetValue(key, /*out*/ canCache);
                  if (canCache) 
                  { 
                      // Note that we are replacing the _keyorValue field
                      // with the value and nuking the _dictionary field. 
                      Value = value;
                      Dictionary = null;
                  }
              } 
              finally
              { 
                  SystemResources.IsSystemResourcesParsing = false; 
              }

              // Only cache keys that would be located by FindResourceInternal
              if ((key instanceof Type || key instanceof ResourceKey) && _canCacheAsThemeResource && canCache)
              {
                  SystemResources.CacheResource(key, value, false /*isTraceEnabled*/); 
              }

              return value; 
          }

          return Value;
      }
  }

  // Gets the type of the value it represents
  /*internal*/ public /*override*/ Type GetValueType() 
  { 
      /*lock*/synchronized (SystemResources.ThemeDictionaryLock)
      { 
          return super.GetValueType();
      }
  }

  // remove this DeferredResourceReference from its ResourceDictionary
  /*internal*/ public /*override*/ void RemoveFromDictionary() 
  { 
      // DeferredThemeResourceReferences are never added to the dictionary's
      // list of deferred references, so they don't need to be removed. 
  }

//  #endregion Methods

  private boolean _canCacheAsThemeResource;
} 