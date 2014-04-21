/**
 * Queue
 */

define(["dojo/_base/declare", "system/Type", "collections/ICollection", "collections/IEnumerator"], 
		function(declare, Type, ICollection, IEnumerator){
	
    // Implements an enumerator for a Queue.  The enumerator uses the
    // internal version number of the list to ensure that no modifications are
    // made to the list while an enumeration is in progress.
//    private class 
    var QueueEnumerator = declare(IEnumerator, {
    	constructor:function(/*Queue*/ q) {
            this._q = q; 
            this._version = this._q._version;
            this._index = 0; 
            this.currentElement = this._q._array; 
            if (this._q.Count == 0)
            	this._index = -1; 
        },//        public virtual bool 
        MoveNext:function() {
            if (this._version != this._q._version) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumFailedVersion)); 

            if (this._index < 0) {
            	this.currentElement = this._q._array;
                return false; 
            }

            this.currentElement = this._q.GetElement(this._index); 
            this._index++;

            if (this._index == this._q.Count)
            	this._index = -1;
            return true;
        },
        
//        public virtual void 
        Reset:function() {
            if (this._version != this._q._version) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumFailedVersion));
            if (this._q.Count == 0)
            	this._index = -1; 
             else
            	 this._index = 0; 
            this.currentElement = this._q._array; 
        }
        
    });
    
    Object.defineProperties(QueueEnumerator.prototype, {
//        public virtual Object 
        Current: { 
            get:function() { 
                if (this.currentElement == this._q._array)
                { 
                    if (this._index == 0)
                        throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumNotStarted));
                    else
                        throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumEnded)); 
                }
                return this.currentElement; 
            } 
        },

    });
    
	var Queue = declare("Queue", ICollection,{
		constructor:function(/*ICollection*/ col)
        {
//	        private Object[] 
	        this._array = [];
//	        private int 
	        this._version; 
	        
            if (col===undefined && col==null) 
                return;
            
            var en = col.GetEnumerator(); 
            while(en.MoveNext())
                this.Enqueue(en.Current); 

		},
		
        // Removes all Objects from the queue. 
//      public virtual void 
		Clear:function() {
			this._array.length = 0; 
			this._version++;
		}, 

      // CopyTo copies a collection into an Array, starting at a particular 
      // index into the array. 
      //
//      public virtual void 
		CopyTo:function(/*Array*/ array, /*int*/ index) 
		{
			if (array==null)
				throw new ArgumentNullException("array");
			if (index < 0) 
				throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index")); 

			for(var i = 0; i < this._array.length; i++){
				array[index + i] = this._array[i];
			}
		},

      // Adds obj to the tail of the queue.
      // 
//      public virtual void 
		Enqueue:function(/*Object*/ obj) { 
			this._array.push(obj); 
			this._version++;
		},

      // GetEnumerator returns an IEnumerator over this Queue.  This 
      // Enumerator will support removing.
      // 
//      public virtual IEnumerator 
		GetEnumerator:function() 
		{
			return new QueueEnumerator(this); 
		},

      // Removes the object at the head of the queue and returns it. If the queue
      // is empty, this method simply returns null. 
//      public virtual Object 
		Dequeue:function() {
			if (this.Count == 0) 
				throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EmptyQueue")); 

			this._version++;
			return this._array.shift(); 
		}, 

      // Returns the object at the head of the queue. The object remains in the 
      // queue. If the queue is empty, this method throws an
      // InvalidOperationException.
//      public virtual Object 
		Peek:function() {
			if (this.Count == 0) 
				throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EmptyQueue"));

			return this._array[0];
		}, 

      // Returns true if the queue contains at least one object equal to obj. 
      // Equality is determined using obj.Equals(). 
      //
      // Exceptions: ArgumentNullException if obj == null. 
//     	public virtual bool 
		Contains:function(/*Object*/ obj) {
			var index = 0;
			var count = this._array.length;

			while (count-- > 0) {
				if (obj == null) { 
					if (this._array[index] == null) 
						return true;
				} else if (this._array[index] != null && this._array[index].Equals(obj)) { 
					return true;
				}
				index ++;
			} 

			return false; 
		}, 

//      internal Object 
		GetElement:function(/*int*/ i) 
		{
			return this._array[i];
		},

      // Iterates over the objects in the queue, returning an array of the
      // objects in the Queue, or an empty array if the queue is empty. 
      // The order of elements in the array is first in to last in, the same 
      // order produced by successive calls to Dequeue.
//      public virtual Object[] 
		ToArray:function() 
		{
			return this._array.slice(0); 
		},
	});
	
	Object.defineProperties(Queue.prototype,{
		
//	    public virtual int 
	    Count: { 
            get:function() { return this._array.length; }
        },
	});
	
	Object.defineProperties(Queue,{
		  
	});
	
	Queue.Type = new Type("Queue", Queue, [ICollection.Type]);
	return Queue;
});

 




 
 

