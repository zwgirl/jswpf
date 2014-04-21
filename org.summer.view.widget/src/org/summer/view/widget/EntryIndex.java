package org.summer.view.widget;
public class EntryIndex
	    {
	        public EntryIndex(int index)
	        {
	            // Found is true
	            _store = index | 0x80000000;
	        }
	  
	        public EntryIndex(int index, boolean found)
	        {
	            _store = index & 0x7FFFFFFF;
	            if (found)
	            {
	                _store |= 0x80000000;
	            }
	        }
	  
	        public boolean Found
	        {
	            get { return (_store & 0x80000000) != 0; }
	        }
	 
	        public int Index
	        {
	            get { return _store & 0x7FFFFFFF; }
	        }
	  
	        private int _store;
	    }