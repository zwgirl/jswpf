package org.summer.view.widget.utils;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.collection.ArrayList;

//	[FriendAccessAllowed]
	/**/public class FrugalMap
	{
	    public Object this[int key]
	    {
	        get
	        {
	            // If no entry, DependencyProperty.UnsetValue is returned
	            if (null != _mapStore)
	            {
	                return _mapStore.Search(key);
	            }
	            return DependencyProperty.UnsetValue;
	        }
	
	        set
	        {
	            if (value != DependencyProperty.UnsetValue)
	            {
	                // If not unset value, ensure write success
	                if (null != _mapStore)
	                {
	                    // This is done because forward branches
	                    // default prediction is not to be taken
	                    // making this a CPU win because set is
	                    // a common operation.
	                }
	                else
	                {
	                    _mapStore = new SingleObjectMap();
	                }
	
	                FrugalMapStoreState myState = _mapStore.InsertEntry(key, value);
	                if (FrugalMapStoreState.Success == myState)
	                {
	                    return;
	                }
	                else
	                {
	                    // Need to move to a more complex storage
	                    FrugalMapBase newStore;
	
	                    if (FrugalMapStoreState.ThreeObjectMap == myState)
	                    {
	                        newStore = new ThreeObjectMap();
	                    }
	                    else if (FrugalMapStoreState.SixObjectMap == myState)
	                    {
	                        newStore = new SixObjectMap();
	                    }
	                    else if (FrugalMapStoreState.Array == myState)
	                    {
	                        newStore = new ArrayObjectMap();
	                    }
	                    else if (FrugalMapStoreState.SortedArray == myState)
	                    {
	                        newStore = new SortedObjectMap();
	                    }
	                    else if (FrugalMapStoreState.Hashtable == myState)
	                    {
	                        newStore = new HashObjectMap();
	                    }
	                    else
	                    {
	                        throw new InvalidOperationException(SR.Get(SRID.FrugalMap_CannotPromoteBeyondHashtable));
	                    }
	
	                    // Extract the values from the old store and insert them into the new store
	                    _mapStore.Promote(newStore);
	
	                    // Insert the new value
	                    _mapStore = newStore;
	                    _mapStore.InsertEntry(key, value);
	                }
	            }
	            else
	            {
	                // DependencyProperty.UnsetValue means remove the value
	                if (null != _mapStore)
	                {
	                    _mapStore.RemoveEntry(key);
	                    if (_mapStore.Count == 0)
	                    {
	                        // Map Store is now empty ... throw it away
	                        _mapStore = null;
	                    }
	                }
	            }
	        }
	    }
	
	    public void Sort()
	    {
	        if (null != _mapStore)
	        {
	            _mapStore.Sort();
	        }
	    }
	
	    public void GetKeyValuePair(int index, /*out*/ int key, /*out*/ Object value)
	    {
	        if (null != _mapStore)
	        {
	            _mapStore.GetKeyValuePair(index, out key, out value);
	        }
	        else
	        {
	            throw new ArgumentOutOfRangeException("index");
	        }
	    }
	
	    public void Iterate(ArrayList list, FrugalMapIterationCallback callback)
	    {
	        if (null != callback)
	        {
	            if (null != list)
	            {
	                if (_mapStore != null)
	                {
	                    _mapStore.Iterate(list, callback);
	                }
	            }
	            else
	            {
	                throw new ArgumentNullException("list");
	            }
	        }
	        else
	        {
	            throw new ArgumentNullException("callback");
	        }
	    }
	
	    public int Count
	    {
	        get
	        {
	            if (null != _mapStore)
	            {
	                return _mapStore.Count;
	            }
	            return 0;
	        }
	    }
	
	     FrugalMapBase _mapStore;
	}


