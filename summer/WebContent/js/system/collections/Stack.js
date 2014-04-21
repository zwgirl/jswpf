/**
 * Stack
 */
define(["dojo/_base/declare", "system/Type", "collections/ICollection",
        "collections/IEnumerator"], 
        function(declare, Type, ICollection,
        		IEnumerator){
	
    var StackEnumerator = declare(IEnumerator, {
		constructor:function(/*Stack*/ stack) { 
            this._stack = stack;
            this._version = this._stack._version; 
            this._index = -2;
            this.currentElement = null;
        },
//        public virtual bool 
        MoveNext:function() {
            var retval;
            if (this._version != this._stack._version) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumFailedVersion));
            if (this._index == -2) {  // First call to enumerator. 
            	this._index = this._stack.Count-1;
                retval = ( this._index >= 0); 
                if (retval) 
                    this.currentElement = this._stack._array[this._index];
                return retval; 
            }
            if (this._index == -1) {  // End of enumeration.
                return false;
            } 

            retval = (--this._index >= 0); 
            if (retval) 
            	this.currentElement = this._stack._array[this._index];
            else 
            	this.currentElement = null;
            return retval;
        },
        
//        public virtual void 
        Reset:function() { 
            if (this._version != this._stack._version) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumFailedVersion));
            this._index = -2; 
            this.currentElement = null; 
        }
    });
    
    Object.defineProperties(StackEnumerator.prototype, {
//        public virtual Object 
        Current: {
            get:function() { 
                if (this._index == -2) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumNotStarted)); 
                if (this._index == -1) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumEnded));
                return this.currentElement; 
            }
        }
    });
    
//    private const int 
    var _defaultCapacity = 10; 
	var Stack = declare("Stack", ICollection,{
		constructor:function(/*ICollection*/ col)  
        { 
            if(col === undefined){
                this.Initialize(_defaultCapacity);
            }else if(typeof col == "number"){
            	var initialCapacity = col;
                if (initialCapacity < 0)
                    throw new ArgumentOutOfRangeException("initialCapacity", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
                if (initialCapacity < _defaultCapacity)
                    initialCapacity = _defaultCapacity;  // Simplify doubling logic in Push. 
                this.Initialize(initialCapacity);
            }else if(ICollection.Type.IsInstanceof(col)){
            	this.Initialize(col.Count);
                var en = col.GetEnumerator();
                while(en.MoveNext())
                    this.Push(en.Current); 
            }else if(col == null){
            	this.Initialize(32);
            }
        },
        
        Initialize:function(initialCapacity){
            this._array = []; //new Object[initialCapacity]; 
            this._array.length = initialCapacity;
            this._size = 0;
            this._version = 0; 
        },
        
        // Removes all Objects from the Stack. 
//        public virtual void 
        Clear:function() {
//            Array.Clear(_array, 0, _size); // Don't need to doc this but we clear the elements so that the gc can reclaim the references.
            this._array.length = 0;
        	this._size = 0;
            this._version++; 
        },
 
//        public virtual Object 
        Clone:function() { 
            /*Stack*/var s = new Stack(this._size);
            s._size = this._size;
//            Array.Copy(_array, 0, s._array, 0, _size);
            for(var i=0; i<this._size; i++){
            	s._array[i]	= this._array[i];
            }
            s._version = _version; 
            return s;
        }, 
 
//        public virtual bool 
        Contains:function(/*Object*/ obj) {
            var count = this._size; 

            while (count-- > 0) {
                if (obj == null) {
                    if (this._array[count] == null) 
                        return true;
                } 
                else if (this._array[count] != null && this._array[count].Equals(obj)) { 
                    return true;
                } 
            }
            return false;
        },
        
        // Copies the stack into an array.
//        public virtual void 
        CopyTo:function(/*Array*/ array, /*int*/ index) { 
            if (array==null) 
                throw new ArgumentNullException("array");
//            if (array.Rank != 1) 
//                throw new ArgumentException(Environment.GetResourceString("Arg_RankMultiDimNotSupported"));
            if (index < 0)
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
//            if (array.length - index < this._size) 
//                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
 
//            while(i < _size) {
//                array.SetValue(_array[_size-i-1], i+index); 
//                i++;
//            }
            
            var i = 0;
            while(i < this._size) {
                array[i+index] = this._array[this._size-i-1]; 
                i++;
            }
        },
 
        // Returns an IEnumerator for this Stack. 
//        public virtual IEnumerator 
        GetEnumerator:function() { 
            return new StackEnumerator(this); 
        },
        // Returns the top object on the stack without removing it.  If the stack
        // is empty, Peek throws an InvalidOperationException. 
//        public virtual Object 
        Peek:function() {
            if (this._size==0) 
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EmptyStack")); 
            return this._array[this._size-1]; 
        },

        // Pops an item from the top of the stack.  If the stack is empty, Pop
        // throws an InvalidOperationException. 
//        public virtual Object 
        Pop:function() {
            if (this._array.length == 0) 
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EmptyStack")); 
            this._version++;
            /*Object*/var obj = this._array[--this._size];
            this._array[this._size] = null;     // Free memory quicker.
            return obj;
        },
 
        // Pushes an item to the top of the stack. 
        //
//      public virtual void 
        Push:function(/*Object*/ obj) { 
            //Contract.Ensures(Count == Contract.OldValue(Count) + 1);
            if (this._size == this._array.length) {
                /*Object[]*/var newArray = []; //new Object[2*_array.Length];
//                Array.Copy(_array, 0, newArray, 0, _size); 
                for(var i=0; i<this._size; i++){
                	newArray[i] = this._array[i];
                }
                this._array = newArray;
            } 
            this._array[this._size++] = obj; 
            this._version++;
        },
 
        // Copies the Stack to an array, in the same order Pop would return the items.
//        public virtual Object[] 
        ToArray:function() 
        { 
            /*Object[]*/var objArray = []; //new Object[_size];
            var i = 0;
            while(i < this._size/*this._array.length*/) {
                objArray[i] = this._array[i]; 
                i++;
            } 
            return objArray; 
        },
	});
	
	Object.defineProperties(Stack.prototype,{
//	     public virtual int 
	     Count: { 
            get:function() {
                return this._size;
            }
        }
	});
	
	Stack.Type = new Type("Stack", Stack, [ICollection.Type]);
	return Stack;
});



        
 



 
 

