/**
 * ItemStructList
 */
define(["dojo/_base/declare"], function(declare){
	var ItemStructList = declare("ItemStructList", null,{
		constructor:function(/*int*/ capacity, /*Type*/ T)
        { 
			if(T === undefined){
				T = null;
			}
//			this.List = //new T[capacity];
			this.List =[];
			this.List.length = capacity;
			
			this.T = T;
			
			for(var i=0; i<capacity; i++){
				if(T){
					this.List[i] = new T();
				}else{
					this.List[i] = null;
				}
			}
            this._count = 0; 
		},
		
//        public void 
		EnsureIndex:function(/*int*/ index) 
        {
            var delta = (index + 1) - this._count;
            if (delta > 0)
            { 
                this.InternalAdd(delta, true);
            } 
        },
        
        // 
        // Lock-required Write operations
        // "Safe" methods for Reader lock-free operation
        //
 
        // Increase size by one, new value is provided
//        public void 
        Add:function(/*T*/ item) 
        { 
            // Add without Count adjustment (incr Count after valid item added)
            var index = this.InternalAdd(1, false); 
            this.List[index] = item;
            this._count++;
        },
        
     // Increase size of array by delta, fill with default values
        // Allow disable of automatic Count increment so that cases where 
        // non-default values are to be added to the list can be done before
        // count is changed. This is important for non-locking scenarios
        // (i.e. count is adjusted after array size changes)
//        private int 
        InternalAdd:function(/*int*/ delta, /*bool*/ incrCount) 
        {
            if (this.List != null) 
            { 
                if ((this._count + delta) > this.List.length)
                { 
                    /*T[]*/var newList = []; //new T[Math.Max(List.Length * 2, Count + delta)];
                    newList.length = Math.max(this.List.length * 2, this._count + delta);
//                    this.List.CopyTo(newList, 0);
                    for(var i=0; i<this.List.length; i++){
                    	newList[i] = this.List[i];
                    }
                    
                    for(var i=this.List.length; i<newList.length; i++){
                    	if(this.T !=null){
                    		newList[i] = new this.T();
                    	}else{
                        	newList[i] = null;
                    	}

                    }
                    this.List = newList;
                } 
            }
            else 
            { 
                this.List = []; //new T[Math.Max(delta, 2)];
                this.List.length = Math.max(delta, 2);
                for(var i=0; i<List.length; i++){
                 	if(this.T !=null){
                 		this.List[i] = new this.T();
                	}else{
                		this.List[i] = null;
                	}
                }
            } 

            // New arrays auto-initialized to default entry values
            // Any resued entried have already been cleared out by Remove or Clear
 
            var index = this._count;
 
            // Optional adjustment of Count 
            if (incrCount)
            { 
                // Adjust count after resize so that array bounds and data
                // are never invalid (good for locking writes without synchronized reads)
            	this._count += delta;
            } 

            return index; 
        },
        
//      public bool 
        IsValidIndex:function(/*int*/ index) 
        {
            return (index >= 0 && index < this._count);
        },
 
//      public int 
        IndexOf:function(/*T*/ value)
        {  
            var index = -1; 

            for (var i = 0; i < this._count; i++) 
            {
                if (this.List[i].Equals(value))
                {
                    index = i; 
                    break;
                } 
            } 

            return index; 
        },

//        public bool 
        Contains:function(/*T*/ value)
        { 
            return (this.List.indexOf(value) != -1);
        },

 
//        // Increase size by one, new value is default value
//        public int Add() 
//        { 
//            return Add(1, true);
//        } 
//
//        // Increase size of array by delta, fill with default values
//        public int Add(int delta)
//        { 
//            return Add(delta, true);
//        } 
         
 
//        public void 
        Sort:function() 
        {
           if (this.List != null)
           {
        	   this.List.sort();
           }
        },
//        public void 
        AppendTo:function(/*ref ItemStructList<T>*/ destinationList)
        { 
            for (var i = 0; i < this._count; i++)
            {
                destinationList.Add(this.List[i]);
            } 
        },
 
//        public T[] 
        ToArray:function() 
        {
            return this.List.slice(0);
        }, 
        // 
        // Lock-required Write operations
        // "UNSafe" methods for Reader lock-free operation 
        //
        // If any of these methods are called, the entire class is considered
        // unsafe for Reader lock-free operation for that point on (meaning
        // Reader locks must be taken) 
        //
 
//        public void 
        Clear:function() 
        {
            // Return now unused entries back to default 
        	this.List.length=0;
        	this._count = 0;
        }, 
//        public void 
        Remove:function(/*T*/ value) 
        { 
            var index = this.IndexOf(value);
            if (index != -1) 
            {
//            	this.List.splice(index,1);
                // Shift entries down
//                Array.Copy(List, index + 1, List, index, (Count - index - 1));
                for(var i=0; i<this._count - index - 1; i++){
                	this.List[i + index] = this.List[i + index + 1];
                }
 
                // Return now unused entries back to default
//                Array.Clear(List, Count - 1, 1); 
                this.List[this._count - 1] = null;
 
                this._count--;
            } 
        }

	});
	
	Object.defineProperties(ItemStructList.prototype, {
		Count:
		{
			get:function(){
				return this._count;
			}
		}
	});
	
	return ItemStructList;
});
 
