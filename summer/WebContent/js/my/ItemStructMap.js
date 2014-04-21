/**
 * ItemStructMap
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var Entry = declare("Entry", null, {
    	
    });
    
    Object.defineProperties(Entry.prototype, {
    	Key:
		{
			get:function() { return this._key; },
			set:function(value) {this._key = value;}
		},
		 
		Value:
		{
			get:function() { return this._value; },
			set:function(value) {this._value = value;}
		}
    });
    
    Object.defineProperties(Entry, {
    	EmptyEntry:
    	{
    		get:function(){
    			if(Entry._EmptyEntry === undefined){
    				Entry._EmptyEntry = new Entry();
    			}
    			
    			return Entry._EmptyEntry;
    		}
    	}
    });
    
//    private const int 
    var SearchTypeThreshold = 4;
	var ItemStructMap = declare("ItemStructMap", null,{
		constructor:function(){
			this.Count = -1;
		},
		
//		 public int 
		EnsureEntry:function(/*int*/ key, value) 
        {
			var index = this.Search(key);
            if (index < 0)
            { 
                // Not found, add Entry
 
                // Create initial capacity, if necessary 
                if (this.Entries == null)
                { 
                    this.Entries = []; //new Entry[SearchTypeThreshold];
                }
                
//                // Convert not-found index to insertion point 
                index = ~index;
// 
//                /*Entry[]*/
//                var destEntries = this.Entries; 
//
//                // Increase capacity, if necessary 
//                if ((Count + 1) > this.Entries.length)
//                {
//                    destEntries = new Entry[Entries.Length * 2];
// 
//                    // Initialize start of new array
//                    Array.Copy(Entries, 0, destEntries, 0, index); 
//                } 
//
//                // Shift entries to make room for new key at provided insertion point 
//                Array.Copy(Entries, index, destEntries, index + 1, Count - index);
//
//                // Ensure Source and Destination arrays are the same
//                this.Entries = destEntries; 
//
//                // Clear new entry 
                this.Entries[index] = new Entry(); 

                // Set 
                this.Entries[index].Key = key;
                this.Entries[index].Value = value;

                this.Count++;
            } 

            return index; 
        }, 

//        public int 
        Search:function(/*int*/ key) 
        {
            var keyPv = Number.MAX_INT;
            var iPv = 0;
 
            // Use fastest search based on size
            if (this.Count > SearchTypeThreshold) 
            { 
                // Binary Search
                var iLo = 0; 
                var iHi = this.Count - 1;

                while (iLo <= iHi)
                { 
                    iPv = (iHi + iLo) / 2;
                    keyPv = this.Entries[iPv].Key; 
 
                    if (key == keyPv){ 
                        return iPv;
                    }

                    if (key < keyPv){
                        iHi = iPv - 1; 
                    } else { 
                        iLo = iPv + 1;
                    }
                }
            } 
            else
            { 
                // Linear search 
                for (var i = 0; i < this.Count; i++) 
                {
                    iPv = i;
                    keyPv = this.Entries[iPv].Key;
 
                    if (key == keyPv)
                    { 
                        return iPv; 
                    }
 
                    if (key < keyPv)
                    {
                        break;
                    } 
                }
            } 
 
            // iPv and keyPv will match and have the last pivot check
 
            // Return a negative value whose bitwise compliment
            // is this index of the first Entry that is greater
            // than the key passed in (sorted insertion point)
 
            if (key > keyPv)
            { 
                iPv++; 
            }
 

            return ~iPv;
        }
	});
	
	Object.defineProperties(ItemStructMap.prototype,{
//        public Entry[] 
        Entries:
        {
        	get:function(){
        		return this._Entries;
        	},
        	set:function(value){
        		this._Entries = value;
        	}
        },
//        public int 
        Count:
        {
        	get:function(){
        		return this._Count;
        	},
        	set:function(value){
        		this._Count = value;
        	}
        }

	});
	
	ItemStructMap.Type = new Type("ItemStructMap", ItemStructMap, [Object.Type]);
	return ItemStructMap;
});


using System; 
using System.Collections;
using System.Diagnostics;

namespace MS.Utility 
{
    // 
    // ItemStructMap<T> 
    //
 
    // Disable warnings about fields never being assigned to
    // This struct is designed to function with its fields starting at
    // their default values and without the need of surfacing a constructor
    // other than the deafult 
    #pragma warning disable 649
 
    internal struct ItemStructMap<T> 
    {
        public int EnsureEntry(int key) 
        {
            int index = Search(key);
            if (index < 0)
            { 
                // Not found, add Entry
 
                // Create initial capacity, if necessary 
                if (Entries == null)
                { 
                    Entries = new Entry[SearchTypeThreshold];
                }

                // Convert not-found index to insertion point 
                index = ~index;
 
                Entry[] destEntries = Entries; 

                // Increase capacity, if necessary 
                if ((Count + 1) > Entries.Length)
                {
                    destEntries = new Entry[Entries.Length * 2];
 
                    // Initialize start of new array
                    Array.Copy(Entries, 0, destEntries, 0, index); 
                } 

                // Shift entries to make room for new key at provided insertion point 
                Array.Copy(Entries, index, destEntries, index + 1, Count - index);

                // Ensure Source and Destination arrays are the same
                Entries = destEntries; 

                // Clear new entry 
                Entries[index] = EmptyEntry; 

                // Set 
                Entries[index].Key = key;

                Count++;
            } 

            return index; 
        } 

        public int Search(int key) 
        {
            int keyPv = Int32.MaxValue;
            int iPv = 0;
 
            // Use fastest search based on size
            if (Count > SearchTypeThreshold) 
            { 
                // Binary Search
                int iLo = 0; 
                int iHi = Count - 1;

                while (iLo <= iHi)
                { 
                    iPv = (iHi + iLo) / 2;
                    keyPv = Entries[iPv].Key; 
 
                    if (key == keyPv)
                    { 
                        return iPv;
                    }

                    if (key < keyPv) 
                    {
                        iHi = iPv - 1; 
                    } 
                    else
                    { 
                        iLo = iPv + 1;
                    }
                }
            } 
            else
            { 
                // Linear search 

                for (int i = 0; i < Count; i++) 
                {
                    iPv = i;
                    keyPv = Entries[iPv].Key;
 
                    if (key == keyPv)
                    { 
                        return iPv; 
                    }
 
                    if (key < keyPv)
                    {
                        break;
                    } 
                }
            } 
 
            // iPv and keyPv will match and have the last pivot check
 
            // Return a negative value whose bitwise compliment
            // is this index of the first Entry that is greater
            // than the key passed in (sorted insertion point)
 
            if (key > keyPv)
            { 
                iPv++; 
            }
 

            return ~iPv;
        }
 
        private const int SearchTypeThreshold = 4;
 
        public Entry[] Entries; 
        public int Count;
 
        public struct Entry
        {
            public int Key;
            public T Value; 
        }
 
        private static Entry EmptyEntry; 
    }
 
    #pragma warning restore 649
}


 
       
 

 

 


