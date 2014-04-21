/**
 * Dictionary
 */

define(["dojo/_base/declare", "system/Type", "collections/IDictionary", "collections/HashHelpers", "generic/KeyValuePair",
        "collections/ICollection", "collections/IEnumerator", "collections/IEqualityComparer"], 
		function(declare, Type, IDictionary, HashHelpers, KeyValuePair,
				ICollection, IEnumerator, IEqualityComparer){
	
    var ValueCollection = declare("ValueCollection", ICollection,{
		constructor:function(/*Dictionary<TKey,TValue>*/ dictionary) { 
            if (dictionary == null) {
                throw new Error('ThrowHelper.ThrowArgumentNullException(ExceptionArgument.dictionary)'); 
            } 
            this.dictionary = dictionary;
        },
        
//        public Enumerator 
        GetEnumerator:function() {
            return new ValueEnumerator(this.dictionary);
        },

//        void ICollection<TValue>.
        Add:function(/*TValue*/ item){ 
        	throw new Error('ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ValueCollectionSet)');
        }, 

//        bool ICollection<TValue>.
        Remove:function(/*TValue*/ item){
        	throw new Error('ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ValueCollectionSet)');
            return false; 
        },

//        void ICollection<TValue>.
        Clear:function(){ 
        	throw new Error('ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ValueCollectionSet)');
        }, 

//        bool ICollection<TValue>.
        Contains:function(/*TValue*/ item){
            return this.dictionary.ContainsValue(item);
        } 
    });
    
    Object.defineProperties(ValueCollection.prototype, {
//        public int 
        Count:
        {
            get:function() { return this.dictionary.Count; } 
        },

//        bool ICollection<TValue>.
        IsReadOnly:
        {
            get:function() { return true; } 
        }

    });

    var ValueEnumerator = declare(IEnumerator, {
    	constructor:function(dictionary) {
            this.dictionary = dictionary;
            this.version = dictionary.version;
            this.index = 0; 
            this.currentValue = null;
    	},
    	
//            public bool 
        MoveNext:function() {
            if (this.version != this.dictionary.version) {
            	throw new Error('ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion)'); 
            }

            while (this.index < this.dictionary.count) { 
                if (this.dictionary.entries[this.index].hashCode >= 0) {
                	this.currentValue = this.dictionary.entries[this.index].value; 
                	this.index++;
                    return true;
                }
                this.index++; 
            }
            this.index = this.dictionary.count + 1; 
            this.currentValue = null; 
            return false;
        },
        
//            void System.Collections.IEnumerator.
        Reset:function() { 
            if (this.version != this.dictionary.version) {
                throw new Error('ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion)');
            }
            this.index = 0; 
            this.currentValue = null;
        } 
    });
    
    Object.defineProperties(ValueEnumerator.prototype, {
        Current:
        {
            get:function() {
                return this.currentValue; 
            }
        } 
    });

    var KeyCollection = declare(ICollection, { 
    	constructor:function(/*Dictionary<TKey,TValue>*/ dictionary) { 
            if (dictionary == null) { 
                throw new Error('ThrowHelper.ThrowArgumentNullException(ExceptionArgument.dictionary)');
            } 
            this.dictionary = dictionary;
        },
        
//        public Enumerator 
        GetEnumerator:function() { 
            return new KeyEnumerator(this.dictionary);
        },
        
//        void ICollection<TKey>.
        Add:function(/*TKey*/ item){ 
        	throw new Error('ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_KeyCollectionSet)');
        },

//        void ICollection<TKey>.
        Clear:function(){ 
        	throw new Error('ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_KeyCollectionSet)');
        }, 

//        bool ICollection<TKey>.
        Contains:function(/*TKey*/ item){
            return this.dictionary.ContainsKey(item); 
        },

//        bool ICollection<TKey>.
        Remove:function(/*TKey*/ item){
        	throw new Error('ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_KeyCollectionSet)'); 
            return false;
        } 

    });
    
    Object.defineProperties(KeyCollection.prototype, {
    	Count:
    	{
    		get:function() { return this.dictionary.Count; } 
    	},

    	IsReadOnly:
    	{
    		get:function() { return true; } 
    	}
    });
    

    var KeyEnumerator  = declare(IEnumerator, {
    	constructor:function(dictionary) { 
            this.dictionary = dictionary;
            this.version = dictionary.version; 
            this.index = 0; 
            this.currentKey = null;
        },
        
        MoveNext:function() {
            if (this.version != this.dictionary.version) { 
                throw new Error('ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion)'); 
            }

            while (this.index < this.dictionary.count) {
                if (this.dictionary.entries[this.index].hashCode >= 0) {
                	this.currentKey = this.dictionary.entries[this.index].key;
                	this.index++; 
                    return true;
                } 
                this.index++; 
            }

            this.index = this.dictionary.count + 1;
            this.currentKey = null;
            return false;
        },
        
        Reset:function() { 
            if (this.version != dictionary.version) {
                throw new Error('ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion)'); 
            } 

            this.index = 0; 
            this.currentKey = null;
        }
    });
    
    Object.defineProperties(KeyEnumerator.prototype, {
//            public TKey 
        Current:
        { 
            get:function() { 
                return this.currentKey;
            } 
        }
    });
        
	
    var Entry = declare(null, function(){ 

    });
    
    Object.defineProperties(Entry.prototype, {
//      public int 
        hashCode:
        {
        	get:function(){
        		return this._hashCode;
        	},
        	set:function(value){
        		this._hashCode = value;
        	}
        },
//        public int 
        next:
        {
        	get:function(){
        		return this._next;
        	},
        	set:function(value){
        		this._next = value;
        	}
        },
        // Index of next entry, -1 if last
//        public TKey 
        key:{
        	get:function(){
        		return this._key;
        	},
        	set:function(value){
        		this._key = value;
        	}
        },          // Key of entry 
//        public TValue 
        value:
        {
        	get:function(){
        		return this._value;
        	},
        	set:function(value){
        		this._value = value;
        	}
        } 
    });
    
    var DictionaryEnumerator = declare(IEnumerator,{
		constructor:function(/*Dictionary<TKey,TValue>*/ dictionary, /*int*/ getEnumeratorRetType) {
	        this.dictionary = dictionary; 
	        version = dictionary.version;
	        index = 0;
	        this.getEnumeratorRetType = getEnumeratorRetType;
	        current = new KeyValuePair(); 
	    },
//	    public bool 
	    MoveNext:function() { 
	        if (version != dictionary.version) {
	            throw new Error('ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion)'); 
	        }

	        // Use unsigned comparison since we set index to dictionary.count+1 when the enumeration ends.
	        // dictionary.count+1 could be negative if dictionary.count is Int32.MaxValue 
	        while (index < dictionary.count) {
	            if (this.dictionary.entries[index].hashCode >= 0) { 
	            	this.current = new KeyValuePair(this.dictionary.entries[index].key, this.dictionary.entries[index].value); 
	            	this.index++;
	                return true; 
	            }
	            this.index++;
	        }

	        this.index = this.dictionary.count + 1;
	        this.current = new KeyValuePair(); 
	        return false; 
	    },
	    
//	    void IEnumerator.
	    Reset:function() { 
	        if (version != dictionary.version) {
	            ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion); 
	        } 

	        this.index = 0; 
	        this.current = new KeyValuePair();
	    }
	});
    
    Object.defineProperties( DictionaryEnumerator, {
//        public KeyValuePair<TKey,TValue> 
        Current: 
        {
            get:function() { return this.current; }
        }
    });
 
	
	var Dictionary = declare(null,{
		constructor:function(capacity, /*IEqualityComparer<TKey>*/ comparer)
		{
			var dictionary = null;
//          private int 
            this.count = 0; 
//            private int 
            this.version = 0; 
//            private int 
            this.freeCount = 0; 
//            private KeyCollection 
            this.keys = null;
//            private ValueCollection 
            this.values = null;
            
			if(arguments.length ==0){
				capacity = 0;
				comparer = null;
			}else if(arguments.length == 1){
				if(capacity instanceof IEqualityComparer){
					comparer = capacity;
					capacity = 0;
				}else if(capacity instanceof IDictionary){
					comparer = null;
					dictionary = capacity;
					capacity = dictionary.Count;
				}
			}else if (arguments.length == 2){
				if(capacity instanceof IDictionary){
					dictionary = capacity;
					capacity = dictionary.Count;
				}
			}
			
			if (capacity > 0) this.Initialize(capacity);
			
			if(dictionary !=null){
	            for(var i=0;i<dictionary.Count; i++){ //foreach (KeyValuePair<TKey,TValue> pair in dictionary) {
	            	pair = dictionary.entries[i];
	                this.Add(pair.Key, pair.Value); 
	            }
			}
		},
		
//        private void 
		Initialize:function(/*int*/ capacity) { 
            var size = HashHelpers.GetPrime(capacity); 
            this.buckets = []; //new int[size];
            for (var i = 0; i < size; i++) this.buckets[i] = -1; 
            this.entries = []; //new Entry[size];
            for(var i=0; i<size; i++){
            	this.entries[i] = new Entry();
            }
            this.freeList = -1;
        },
        
//        public TValue 
        Get:function(key)/*[TKey key]*/ { 
            /*int*/
        	var i = this.FindEntry(key);
            if (i >= 0) 
            	return this.entries[i].value;
            return null;
        },
        Set:function(key, value){
        	this.Insert(key, value, false);
        },
        
//        public void 
        Add:function(/*TKey*/ key, /*TValue*/ value) {
            this.Insert(key, value, true); 
        },

//        bool ICollection<KeyValuePair<TKey, TValue>>.
        Contains:function(/*KeyValuePair<TKey, TValue>*/ keyValuePair) {
            var i = this.FindEntry(keyValuePair.Key);
            if( i >= 0 && Object.Equals(entries[i].value, keyValuePair.Value)) { 
                return true;
            } 
            return false; 
        },
 
//        bool ICollection<KeyValuePair<TKey, TValue>>.
        Remove:function(/*KeyValuePair<TKey, TValue>*/ keyValuePair) {
            var i = this.FindEntry(keyValuePair.Key);
            if( i >= 0 && Object.Equals(this.entries[i].value, keyValuePair.Value)) {
            	this.Remove(keyValuePair.Key); 
                return true;
            } 
            return false; 
        },
 
//        public void 
        Clear:function() {
            if (this.count > 0) {
                for (var i = 0; i < this.buckets.length; i++) 
                	this.buckets[i] = -1;
//                Array.Clear(entries, 0, count); 
                this.entries.length = 0;
                this.freeList = -1;
                this.count = 0; 
                this.freeCount = 0; 
                this.version++;
            } 
        },

//        public bool 
        ContainsKey:function(/*TKey*/ key) {
            return this.FindEntry(key) >= 0; 
        },
 
//        public bool 
        ContainsValue:function(/*TValue*/ value) { 
            if (value == null) {
                for (var i = 0; i < this.count; i++) { 
                    if (this.entries[i].hashCode >= 0 && this.entries[i].value == null) 
                    	return true;
                }
            } else { 
                for (var i = 0; i < this.count; i++) { 
                    if (this.entries[i].hashCode >= 0 && Object.Equals(this.entries[i].value, value)) 
                    	return true; 
                }
            } 
            return false;
        },

//        public Enumerator 
        GetEnumerator:function() {
            return new DictionaryEnumerator(this); 
        },
 
//        private int 
        FindEntry:function(/*TKey*/ key) {
            if( key == null) {
                ThrowHelper.ThrowArgumentNullException(ExceptionArgument.key);
            } 

            if (this.buckets != null) { 
                var hashCode = GetHashCode(key) & 0x7FFFFFFF; 
                for (var i = this.buckets[hashCode % this.buckets.length]; i >= 0; i = this.entries[i].next) {
                    if (this.entries[i].hashCode == hashCode && Object.Equals(this.entries[i].key, key)) 
                    	return i; 
                }
            }
            return -1;
        },

//        private void 
        Insert:function(/*TKey*/ key, /*TValue*/ value, /*bool*/ add) {
 
            if( key == null ) { 
                throw new Error('ThrowHelper.ThrowArgumentNullException(ExceptionArgument.key)');
            } 

            if (this.buckets == null) 
            	this.Initialize(0);
            var hashCode = key.GetHashCode() & 0x7FFFFFFF;
            var targetBucket = hashCode % this.buckets.length; 

 
            for (var i = this.buckets[targetBucket]; i >= 0; i = this.entries[i].next) {
                if (this.entries[i].hashCode == hashCode && Object.Equals(this.entries[i].key, key)) {
                    if (add) {
                        throw new Error('ThrowHelper.ThrowArgumentException(ExceptionResource.Argument_AddingDuplicate)'); 
                    }
                    this.entries[i].value = value; 
                    this.version++; 
                    return;
                } 
            }
            var index; 
            if (this.freeCount > 0) { 
            	index = this.freeList;
            	this.freeList = this.entries[index].next; 
            	this.freeCount--;
            } else {
                if (this.count == this.entries.length) 
                {
                    this.Resize(); 
                    targetBucket = hashCode % this.buckets.length; 
                }
                index = this.count; 
                this.count++;
            }

            this.entries[index].hashCode = hashCode; 
            this.entries[index].next = this.buckets[targetBucket];
            this.entries[index].key = key; 
            this.entries[index].value = value; 
            this.buckets[targetBucket] = index;
            this.version++; 
 
        },
 
//        public bool 
        Remove:function(/*TKey*/ key) {
            if(key == null) {
                throw new Error('ThrowHelper.ThrowArgumentNullException(ExceptionArgument.key)');
            } 

            if (this.buckets != null) { 
                var hashCode = key.GetHashCode() & 0x7FFFFFFF; 
                var bucket = hashCode % this.buckets.length;
                var last = -1; 
                for (var i = this.buckets[bucket]; i >= 0; last = i, i = this.entries[i].next) {
                    if (this.entries[i].hashCode == hashCode && Object.Equals(this.entries[i].key, key)) {
                        if (last < 0) {
                        	this.buckets[bucket] = this.entries[i].next; 
                        } else { 
                        	this.entries[last].next = this.entries[i].next; 
                        }
                        this.entries[i].hashCode = -1; 
                        this.entries[i].next = this.freeList;
                        this.entries[i].key = null;
                        this.entries[i].value = null;
                        this.freeList = i; 
                        this.freeCount++;
                        this.version++; 
                        return true; 
                    }
                } 
            }
            return false;
        },
 
//        public bool 
        TryGetValue:function(/*TKey*/ key, /*out TValue value*/valueOut) {
            /*int*/
        	var i = this.FindEntry(key); 
            if (i >= 0) { 
            	valueOut.value = this.entries[i].value;
                return true; 
            }
            valueOut.value = null;
            return false;
        },
        
//        private void Resize() {
//            Resize(HashHelpers.ExpandPrime(count), false);
//        } 

//        private void 
        Resize:function(/*int*/ newSize, /*boolean*/ forceNewHashCodes) { 
        	if(newSize === undefined){
        		newSize = HashHelpers.ExpandPrime(this.count);
        	}
        	
        	if(forceNewHashCodes === undefined){
        		forceNewHashCodes = false;
        	}
            /*int[]*/var newBuckets = []; //new int[newSize];
            newBuckets.length = newSize;
            for (var i = 0; i < newBuckets.length; i++) 
            	newBuckets[i] = -1; 
            /*Entry[]*/
            var newEntries = []; //new Entry[newSize];
//            Array.Copy(entries, 0, newEntries, 0, count);
//            newEntries = this.entries.slice(0, this.count);
            for(var i =0 ; i<this.count; i++){
            	newEntries[i] = this.entries[i];
            }
            
            for(var i = this.count; i<newSize; i++){
            	newEntries[i] = new Entry();
            }
            
            if(forceNewHashCodes) {
                for (var i = 0; i < this.count; i++) { 
                    if(newEntries[i].hashCode != -1) {
                        newEntries[i].hashCode = (newEntries[i].key.GetHashCode() & 0x7FFFFFFF); 
                    } 
                }
            } 
            for (var i = 0; i < this.count; i++) {
                var bucket = newEntries[i].hashCode % newSize;
                newEntries[i].next = newBuckets[bucket];
                newBuckets[bucket] = i; 
            }
            this.buckets = newBuckets; 
            this.entries = newEntries; 
        }


	});
	
	Object.defineProperties(Dictionary.prototype,{
//        public int 
        Count: 
        { 
            get:function() { return this.count - this.freeCount; } 
        },
 
//        ICollection<TKey> IDictionary<TKey, TValue>.
        Keys: 
        { 
            get:function() {
                if (this.keys == null) 
                	this.keys = new KeyCollection(this);
                return this.keys;
            } 
        },

//        ICollection<TValue> IDictionary<TKey, TValue>.
        Values:
        { 
            get:function() {
                if (this.values == null) 
                	this.values = new ValueCollection(this); 
                return this.values; 
            }
        }, 
        

//        bool ICollection<KeyValuePair<TKey,TValue>>.
        IsReadOnly:
        { 
            get:function() { return false; }
        }

	});
	
//	int IEqualityComparer.
	function GetHashCode(/*object*/ obj)
	{
		if (obj == null)
		{
			return 0;
		}
		return obj.GetHashCode();
	}
	
	Dictionary.Type = new Type("Dictionary", Dictionary, [IDictionary.Type]);
	return Dictionary;
});
