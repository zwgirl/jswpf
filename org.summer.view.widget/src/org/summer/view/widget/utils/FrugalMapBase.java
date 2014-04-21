package org.summer.view.widget.utils;

import org.summer.view.widget.collection.ArrayList;
 public abstract class FrugalMapBase
    {
        public abstract FrugalMapStoreState InsertEntry(int key, Object value);
 
        public abstract void RemoveEntry(int key);
 
        /// <summary>
        /// Looks for an entry that contains the given key, null is returned if the
        /// key is not found.
        /// </summary>
        public abstract Object Search(int key);
  
 
        /// <summary>
        /// A routine used by enumerators that need a sorted map
        /// </summary>
        public abstract void Sort();
  
        /// <summary>
        /// A routine used by enumerators to iterate through the map
        /// </summary>
        public abstract void GetKeyValuePair(int index, /*out*/ int key, /*out*/ Object value);
  
        /// <summary>
        /// A routine used to iterate through all the entries in the map
        /// </summary>
        public abstract void Iterate(ArrayList list, FrugalMapIterationCallback callback);
 
        /// <summary>
        /// Promotes the key/value pairs in the current collection to the next larger
        /// and more complex storage model.
        /// </summary>
        public abstract void Promote(FrugalMapBase newMap);
 
        /// <summary>
        /// Size of this data store
        /// </summary>
        public abstract int Count
        {
            get;
        }
 
        protected /*const*/static final int INVALIDKEY = 0x7FFFFFFF;
 
        class Entry
        {
            public int Key;
            public Object Value;
        }
    }