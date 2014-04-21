package org.summer.view.widget.internal;

import org.summer.view.widget.DependencyProperty;

	// An economical table for "uncommon values", identified by integers in the range [0,32). 
	    // Unused values incur no memory allocation 
	
	    /*internal*/public class UncommonValueTable 
	    {
	        public boolean HasValue(int id)
	        {
	            return (_bitmask & (0x1 << id)) != 0; 
	        }
	 
	        public Object GetValue(int id) 
	        {
	            return GetValue(id, DependencyProperty.UnsetValue); 
	        }
	
	        public Object GetValue(int id, Object defaultValue)
	        { 
	            int index = IndexOf(id);
	            return (index < 0) ? defaultValue : _table[index]; 
	        } 
	
	        public void SetValue(int id, Object value) 
	        {
	            int index = Find(id);
	            if (index < 0)
	            { 
	                // new entry - grow the array
	                if (_table == null) 
	                { 
	                    _table = new Object[1];
	                    index = 0; 
	                }
	                else
	                {
	                    int n = _table.length; 
	                    Object[] newTable = new Object[n + 1];
	                    index = ~index; 
	 
	                    Array.Copy(_table, 0, newTable, 0, index);
	                    Array.Copy(_table, index, newTable, index+1, n-index); 
	                    _table = newTable;
	                }
	
	                // mark the id as present 
	                _bitmask |= (0x1 << id);
	            } 
	 
	            // store the new value
	            _table[index] = value; 
	        }
	
	        public void ClearValue(int id)
	        { 
	            int index = Find(id);
	            if (index >= 0) 
	            { 
	                // remove the value
	                int n = _table.length - 1; 
	                if (n == 0)
	                {
	                    _table = null;
	                } 
	                else
	                { 
	                    Object[] newTable = new Object[n]; 
	                    Array.Copy(_table, 0, newTable, 0, index);
	                    Array.Copy(_table, index+1, newTable, index, n-index); 
	                    _table = newTable;
	                }
	
	                // mark the id as absent 
	                _bitmask &= ~(0x1 << id);
	            } 
	        } 
	
	        // return the index within the table, -1 if not present 
	        private int IndexOf(int id)
	        {
	            return HasValue(id) ? GetIndex(id) : -1;
	        } 
	
	        // return the index within the table, 1's complement if not present 
	        private int Find(int id) 
	        {
	            int index = GetIndex(id); 
	            if (!HasValue(id))
	            {
	                index = ~index;
	            } 
	            return index;
	        } 
	 
	        // get the index for the given id:  the number of 1-bits in _bitmask
	        // to the right of the bit for the id. 
	        private int GetIndex(int id)
	        {
//	            unchecked   // the multiplication in step 5 will overflow - we don't need the overflowing bits
	            { 
	                // we count the bits in parallel, using 32-bit operations.  This
	                // is an old technique - Knuth says it was known in the 1950's. 
	                // See The Art of Computer Programming 7.1.3-(62). 
	                // 1. Discard the bits at or above the given id
	                int x = (_bitmask << (31 - id)) << 1;      // (x<<32) is undefined 
	                // 2. Replace each 2-bit chunk with the count of 1's in that chunk
	                x = x - ((x>>1) & 0x55555555);
	                // 3. Accumulate the counts within each 4-bit chunk
	                x = (x & 0x33333333) + ((x>>2) & 0x33333333); 
	                // 4. Accumulate the counts within each 8-bit chunk (i.e. byte)
	                x = (x + (x>>4)) & 0x0F0F0F0F; 
	                // 5. Sum the byte counts into the msb, and move the answer back to the lsb 
	                return (int) ((x * 0x01010101) >> 24);
	 
	                // this method is often better than table-lookup methods, as it avoids
	                // cache-misses on the table.   Everything happens in registers.
	            }
	        } 
	
	        private Object[] _table; 
	        private int _bitmask; 
	
	    } 

