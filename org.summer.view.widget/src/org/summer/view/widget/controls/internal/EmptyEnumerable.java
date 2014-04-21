package org.summer.view.widget.controls.internal;

import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IEnumerator;

/// <summary> 
    /// Returns an Enumerable that is empty.
    /// </summary>
    /*internal*/public class EmptyEnumerable implements IEnumerable
    { 
        // singleton class, private ctor
        private EmptyEnumerable() 
        { 
        }
 
        public IEnumerator /*IEnumerable.*/GetEnumerator()
        {
            return EmptyEnumerator.Instance;
        } 

        /// <summary> 
        /// Read-Only instance of an Empty Enumerable. 
        /// </summary>
        public static IEnumerable Instance 
        {
            get
            {
                if (_instance == null) 
                {
                    _instance = new EmptyEnumerable(); 
                } 
                return _instance;
            } 
        }

        private static IEnumerable _instance;
    }