/**
 * UncommonValueTable
 */
define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty"], 
		function(declare, Type, DependencyProperty){
//	internal struct
	var UncommonValueTable = declare("UncommonValueTable", null,{
		constructor:function(){
//	        private object[] 
	        this._table = null; 
//	        private uint 
			this._bitmask = 0; 
		},
	
	    HasValue:function(/*int*/ id)
	    {
	        return (this._bitmask & (0x1 << id)) != 0; 
	    },
	
	    GetValue:function(/*int*/ id, /*object*/ defaultValue)
	    { 
	    	if(defaultValue === undefined){
	    		defaultValue = DependencyProperty.UnsetValue;
	    	}
	        var index = this.IndexOf(id);
	        return (index < 0) ? defaultValue : this._table[index]; 
	    }, 
	
	    SetValue:function(/*int*/ id, /*object*/ value) 
	    {
	        var index = this.Find(id);
	        if (index < 0)
	        { 
	            // new entry - grow the array
	            if (this._table == null) 
	            { 
	                this._table = [];
	                index = 0; 
	            }
	            else
	            {
	                index = ~index; 
	            }
	
	            // mark the id as present 
	            this._bitmask |= (0x1 << id);
	        } 
	
	        // store the new value
	        this._table.splice(index, 0, value); 
	    },
	    
  	    ClearValue:function(/*int*/ id)
	    { 
	        var index = this.Find(id);
	        if (index >= 0) 
	        { 
	            // remove the value
	            var n = this._table.length - 1; 
	            if (n == 0)
	            {
	            	this._table = null;
	            } 

	            
	            this._table.splice(index,1);
	
	            // mark the id as absent 
	            this._bitmask &= ~(0x1 << id);
	        } 
	    }, 
	    
	    // return the index within the table, -1 if not present 
	    IndexOf:function(/*int*/ id)
	    {
	        return this.HasValue(id) ? this.GetIndex(id) : -1;
	    },
	
	    // return the index within the table, 1's complement if not present 
	    Find:function(/*int*/ id) 
	    {
	        var index = this.GetIndex(id); 
	        if (!this.HasValue(id))
	        {
	            index = ~index;
	        } 
	        return index;
	    },
	
	    // get the index for the given id:  the number of 1-bits in _bitmask
	    // to the right of the bit for the id. 
	    GetIndex:function(/*int*/ id)
	    {
            // we count the bits in parallel, using 32-bit operations.  This
            // is an old technique - Knuth says it was known in the 1950's. 
            // See The Art of Computer Programming 7.1.3-(62). 
            // 1. Discard the bits at or above the given id
            var x = (this._bitmask << (31 - id)) << 1;      // (x<<32) is undefined 
            // 2. Replace each 2-bit chunk with the count of 1's in that chunk
            x = x - ((x>>1) & 0x55555555);
            // 3. Accumulate the counts within each 4-bit chunk
            x = (x & 0x33333333/*u*/) + ((x>>2) & 0x33333333); 
            // 4. Accumulate the counts within each 8-bit chunk (i.e. byte)
            x = (x + (x>>4)) & 0x0F0F0F0F; 
            // 5. Sum the byte counts into the msb, and move the answer back to the lsb 
            return  ((x * 0x01010101) >> 24);
	
	    } 
	});

	UncommonValueTable.Type = new Type("UncommonValueTable", UncommonValueTable, [Object.Type]);
	return UncommonValueTable;
});
