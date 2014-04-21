/**
 * Second check 2013-12-14
 * DTypeMap
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var DTypeMap = declare("DTypeMap", null,{
		constructor:function(/*int*/ entryCount) 
        {
            // Constant Time Lookup entries (array size) 
            this._entryCount = entryCount; 
            this._entries = []; //new object[_entryCount];
            this._entries.length = this._entryCount;
            for(var i=0; i<entryCount; i++){
            	this._entries[i] = null;
            }
            
            this._activeDTypes = new ItemStructList/*<DependencyObjectType>*/(128);
            this._overFlow = null;
		},
        
        Get:function(dType)
        { 
            if (dType.Id < this._entryCount) 
            {
                return this._entries[dType.Id]; 
            }
            else
            {
                if (this._overFlow != null) 
                {
                    return this._overFlow.Get(dType); 
                } 

                return null; 
            }
        },

        Set:function(dType, value) 
        {
            if (dType.Id < this._entryCount) 
            { 
            	this._entries[dType.Id] = value;
            } 
            else
            {
                if (this._overFlow == null)
                { 
                	this._overFlow = new Hashtable();
                } 

                this._overFlow.Set(dType, value);
            } 

            this._activeDTypes.Add(dType);
        },
        
        // Clear the data-structures to be able to start over
//        public void 
        Clear:function() 
        {
            for (var i=0; i<this._entryCount; i++) 
            { 
            	this._entries[i] = null;
            } 

            for (var i=0; i<this._activeDTypes.Count; i++)
            {
            	this._activeDTypes.List[i] = null; 
            }
 
            if (this._overFlow != null) 
            {
            	this._overFlow.Clear(); 
            }
        }
	});
	
	Object.defineProperties(DTypeMap.prototype,{
	    // Return list of non-null DType mappings 
	    ActiveDTypes: 
	    {
	        get:function() { return this._activeDTypes; } 
	    }
	});
	
	DTypeMap.Type = new Type("DTypeMap", DTypeMap, [Object.Type]);
	return DTypeMap;
});
