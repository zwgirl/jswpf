package org.summer.view.widget.utils;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.collection.ArrayList;

/// <summary>
    /// A simple class to handle a single key/value pair
    /// </summary>
    /*internal*/public /*sealed*/ class SingleObjectMap extends FrugalMapBase
    {
        public SingleObjectMap()
        {
            _loneEntry.Key = INVALIDKEY;
            _loneEntry.Value = DependencyProperty.UnsetValue;
        }
 
        public /*override*/ FrugalMapStoreState InsertEntry(int key, Object value)
        {
            // If we don't have any entries or the existing entry is being overwritten,
            // then we can use this map.  Otherwise we have to promote.
            if ((INVALIDKEY == _loneEntry.Key) || (key == _loneEntry.Key))
            {
//                Debug.Assert(INVALIDKEY != key);
 
                _loneEntry.Key = key;
                _loneEntry.Value = value;
                return FrugalMapStoreState.Success;
            }
            else
            {
                // Entry already used, move to an ThreeObjectMap
                return FrugalMapStoreState.ThreeObjectMap;
            }
        }
  
        public /*override*/ void RemoveEntry(int key)
        {
            // Wipe out the info in the only entry if it matches the key.
            if (key == _loneEntry.Key)
            {
                _loneEntry.Key = INVALIDKEY;
                _loneEntry.Value = DependencyProperty.UnsetValue;
            }
        }
 
        public /*override*/ Object Search(int key)
        {
            if (key == _loneEntry.Key)
            {
                return _loneEntry.Value;
            }
            return DependencyProperty.UnsetValue;
        }
 
        public /*override*/ void Sort()
        {
            // Single items are already sorted.
        }
 
        public /*override*/ void GetKeyValuePair(int index, /*out*/ int key, /*out*/ Object value)
        {
            if (0 == index)
            {
                value = _loneEntry.Value;
                key = _loneEntry.Key;
            }
            else
            {
                value = DependencyProperty.UnsetValue;
                key = INVALIDKEY;
                throw new ArgumentOutOfRangeException("index");
            }
        }
  
        public /*override*/ void Iterate(ArrayList list, FrugalMapIterationCallback callback)
        {
            if (Count == 1)
            {
                callback(list, _loneEntry.Key, _loneEntry.Value);
            }
        }
  
        public /*override*/ void Promote(FrugalMapBase newMap)
        {
            if (FrugalMapStoreState.Success == newMap.InsertEntry(_loneEntry.Key, _loneEntry.Value))
            {
            }
            else
            {
                // newMap is smaller than previous map
                throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap");
            }
        }
  
        // Size of this data store
        public /*override*/ int Count
        {
            get
            {
                if (INVALIDKEY != _loneEntry.Key)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
        }
  
        private Entry _loneEntry;
    }