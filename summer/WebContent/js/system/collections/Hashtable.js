/**
 * Hashtable
 */

define(["dojo/_base/declare", "system/Type", "collections/IDictionary", "collections/IDictionaryEnumerator"], 
		function(declare, Type, IDictionary, IDictionaryEnumerator){
    // Deleted entries have their key set to buckets
	 
    // The hash table data. 
    // This cannot be serialised
    var bucket = declare(null, {
    	constructor:function(){
            this._key = null;
            this._val = null;
            this._hash_coll = 0;   // Store hash code; sign bit means there was a collision.
    	}
    });
    
    Object.defineProperties(bucket, {
//        public Object 
        key:{
        	get:function(){
        		return this._key;
        	},
        	set:function(value){
        		this._key = value;
        	}
        },
//        public Object 
        val:{
        	get:function(){
        		return this._val;
        	},
        	set:function(value){
        		this._val = value;
        	}
        },
//        public int 
        hash_coll:   // Store hash code; sign bit means there was a collision.
        {
        	get:function(){
        		return this._hash_coll;
        	},
        	set:function(value){
        		this._hash_coll = value;
        	}
        },
    }); 
    
    // Implements a Collection for the keys of a hashtable. An instance of this 
    // class is created by the GetKeys method of a hashtable. 
//    private class 
    var KeyCollection =declare(ICollection, {

        constructor:function(/*Hashtable*/ hashtable) { 
            this._hashtable = hashtable;
        },

//        public virtual void 
        CopyTo:function(/*Array*/ array, /*int*/ arrayIndex) {
            if (array==null) 
                throw new ArgumentNullException("array");
            if (array.Rank != 1)
                throw new ArgumentException(Environment.GetResourceString("Arg_RankMultiDimNotSupported"));
            if (arrayIndex < 0) 
                throw new ArgumentOutOfRangeException("arrayIndex", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (array.length - arrayIndex < _hashtable.count) 
                throw new ArgumentException(Environment.GetResourceString("Arg_ArrayPlusOffTooSmall"));
            _hashtable.CopyKeys(array, arrayIndex); 
        },

//        public virtual IEnumerator 
        GetEnumerator:function() { 
            return new HashtableEnumerator(this._hashtable, HashtableEnumerator.Keys); 
        }

    });
    
    Object.defineProperties(KeyCollection.prototype, {
//        public virtual int 
    	Count: { 
            get:function() { return this._hashtable.count; }
        }
    });

    // Implements a Collection for the values of a hashtable. An instance of
    // this class is created by the GetValues method of a hashtable. 
//    private class 
    var ValueCollection =declare(ICollection, { 
        constructor:function(/*Hashtable*/ hashtable) {
            this._hashtable = hashtable; 
        },

//        public virtual void 
        CopyTo:function(/*Array*/ array, /*int*/ arrayIndex) { 
            if (array==null)
                throw new ArgumentNullException("array"); 
            if (array.Rank != 1)
                throw new ArgumentException(Environment.GetResourceString("Arg_RankMultiDimNotSupported"));
            if (arrayIndex < 0)
                throw new ArgumentOutOfRangeException("arrayIndex", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum")); 
            if (array.length - arrayIndex < _hashtable.count) 
                throw new ArgumentException(Environment.GetResourceString("Arg_ArrayPlusOffTooSmall")); 
            _hashtable.CopyValues(array, arrayIndex);
        }, 

//        public virtual IEnumerator 
        GetEnumerator:function() {
            return new HashtableEnumerator(this._hashtable, HashtableEnumerator.Values); 
        } 
    });
    
    Object.defineProperties(ValueCollection.prototype, {
//      public virtual int 
    	Count: { 
    		get:function() { return this._hashtable.count; }
    	}
    });

    
//    internal const int 
    var Keys = 1;
//    internal const int 
    var Values = 2;
//    internal const int 
    var DictEntry = 3;
    // Implements an enumerator for a hashtable. The enumerator uses the
    // internal version number of the hashtabke to ensure that no modifications 
    // are made to the hashtable while an enumeration is in progress. 
//    private class 
    var HashtableEnumerator =declare(IDictionaryEnumerator, {
//        private Hashtable hashtable;
//        private int bucket;
//        private int version; 
//        private bool current;
//        private int getObjectRetType;   // What should GetObject return? 
//        private Object currentKey; 
//        private Object currentValue;

        constructor:function(/*Hashtable*/ hashtable, /*int*/ getObjRetType) {
            this.hashtable = hashtable; 
            this.bucket = hashtable.buckets.length; 
            this.version = hashtable.version;
            this.current = false; 
            this.getObjectRetType = getObjRetType;
        },

//        public Object 
        Clone:function() { 
            return MemberwiseClone();
        }, 

//        public virtual bool 
        MoveNext:function() { 
            if (this.version != this.hashtable.version) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumFailedVersion));
            while (this.bucket > 0) {
            	this.bucket--;
                var keyv = this.hashtable.buckets[this.bucket].key; 
                if ((keyv!= null) && (keyv != this.hashtable.buckets)) {
                	this.currentKey = keyv; 
                	this.currentValue = this.hashtable.buckets[this.bucket].val; 
                	this.current = true;
                    return true; 
                }
            }
            this.current = false;
            return false; 
        },

//        public virtual void 
        Reset:function() {
            if (this.version != this.hashtable.version) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumFailedVersion));
            this.current = false; 
            this.bucket = this.hashtable.buckets.length;
            this.currentKey = null; 
            this.currentValue = null; 
        }
    });
    
    Object.defineProperties(HashtableEnumerator.prototype, {
//        public virtual Object 
    	Key: {
            get:function() {
                if (this.current == false) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumNotStarted)); 
                return this.currentKey;
            } 
        }, 
//        public virtual DictionaryEntry 
        Entry: { 
            get:function() {
                if (this.current == false) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumOpCantHappen)); 
                return new DictionaryEntry(this.currentKey, this.currentValue);
            }
        },
        
//        public virtual Object 
        Current: { 
            get:function() { 
                if (this.current == false) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumOpCantHappen));

                if (getObjectRetType==Keys)
                    return this.currentKey;
                else if (getObjectRetType==Values)
                    return this.currentValue; 
                else
                    return new DictionaryEntry(this.currentKey, this.currentValue); 
            } 
        },

//        public virtual Object 
        Value: {
            get:function() {
                if (this.current == false) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumOpCantHappen)); 
                return this.currentValue; 
            }
        } 
    });
    
    
 // This is the maximum prime smaller than Array.MaxArrayLength 
//    public const int 
    var MaxPrimeArrayLength = 0x7FEFFFFD; 
    
 // Table of prime numbers to use as hash table sizes. 
    // A typical resize algorithm would pick the smallest prime number in this array
    // that is larger than twice the previous capacity. 
    // Suppose our Hashtable currently has capacity x and enough elements are added
    // such that a resize needs to occur. Resizing first computes 2x then finds the
    // first prime in the table greater than 2x, i.e. if primes are ordered
    // p_1, p_2, ..., p_i, ..., it finds p_n such that p_n-1 < 2x < p_n. 
    // Doubling is important for preserving the asymptotic complexity of the
    // hashtable operations such as add.  Having a prime guarantees that double 
    // hashing does not lead to infinite loops.  IE, your hash function will be 
    // h1(key) + i*h2(key), 0 <= i < size.  h2 and the size must be relatively prime.
//    public static readonly int[] 
    var primes = [
        3, 7, 11, 17, 23, 29, 37, 47, 59, 71, 89, 107, 131, 163, 197, 239, 293, 353, 431, 521, 631, 761, 919,
        1103, 1327, 1597, 1931, 2333, 2801, 3371, 4049, 4861, 5839, 7013, 8419, 10103, 12143, 14591,
        17519, 21023, 25229, 30293, 36353, 43627, 52361, 62851, 75431, 90523, 108631, 130363, 156437,
        187751, 225307, 270371, 324449, 389357, 467237, 560689, 672827, 807403, 968897, 1162687, 1395263, 
        1674319, 2009191, 2411033, 2893249, 3471899, 4166287, 4999559, 5999471, 7199369];
    
//    internal static class 
    var HashHelpers = declare(null, { 
 
    });
    
//    public static bool 
    HashHelpers.IsPrime= function(/*int*/ candidate) 
    {
        if ((candidate & 1) != 0)
        {
            var limit = Math.floor(Math.sqrt (candidate)); 
            for (var divisor = 3; divisor <= limit; divisor+=2)
            { 
                if ((candidate % divisor) == 0) 
                    return false;
            } 
            return true;
        }
        return (candidate == 2);
    }; 

//    public static int 
    HashHelpers.GetPrime= function(/*int*/ min) 
    {
        if (min < 0) 
            throw new ArgumentException(Environment.GetResourceString("Arg_HTCapacityOverflow"));

        for (var i = 0; i < primes.length; i++) 
        {
        	var prime = primes[i]; 
            if (prime >= min) return prime; 
        }

        //outside of our predefined table.
        //compute the hard way.
        for (var i = (min | 1); i < Number.MAX_INT;i+=2)
        { 
            if (HashHelpers.IsPrime(i) && ((i - 1) % Hashtable.HashPrime != 0))
                return i; 
        } 
        return min;
    }; 

//    public static int 
    HashHelpers.GetMinPrime= function()
    {
        return primes[0]; 
    };

    // Returns size of hashtable to grow to. 
//    public static int 
    HashHelpers.ExpandPrime= function(/*int*/ oldSize)
    { 
        var newSize = 2 * oldSize;

        // Allow the hashtables to grow to maximum possible size (~2G elements) before encoutering capacity overflow.
        // Note that this check works even when _items.length overflowed thanks to the (uint) cast 
        if (newSize > MaxPrimeArrayLength && MaxPrimeArrayLength > oldSize)
        { 
//            Contract.Assert( MaxPrimeArrayLength == GetPrime(MaxPrimeArrayLength), "Invalid MaxPrimeArrayLength"); 
            return MaxPrimeArrayLength;
        } 

        return HashHelpers.GetPrime(newSize);
    };
    
//    internal const Int32 
    var HashPrime = 101;
//    private const Int32 
    var InitialSize = 3; 
    
	var Hashtable = declare("Hashtable", IDictionary,{
		constructor:function(){
//	        private bucket[] buckets; 
		       
	        // The total number of entries in the hash table.
//	        private  int 
			this.count =0; 

	        // The total number of collision bits set in the hashtable
//	        private int 
	        this.occupancy =0;
	 
//	        private  int 
	        this.loadsize = 0;
//	        private  float 
	        this.loadFactor = 1.0; 
	 
//	        private volatile int 
	        this.version =0;

//	        private ICollection 
	        this.keys = null;
//	        private ICollection 
	        this.values= null;
	 
//	        private IEqualityComparer 
	        this._keycomparer = null;
	        
	        if(arguments.length==0){
	        	this.Initialize(0, 1.0);
	        }else if(arguments.length==1){
	        	if(typeof(arguments[0]) == "number"){
	        		this.Initialize(arguments[0], 1.0);
	        	}else{
	        		this.Initialize((arguments[0] != null ? arguments[0].Count : 0), 1.0);
	        		if(arguments[0] != null){
		                /*IDictionaryEnumerator*/var e = arguments[0].GetEnumerator();
		                while (e.MoveNext()) this.Add(e.Key, e.Value); 
	        		}
	        	}
	        }else if(arguments.length==2){
	          	if(typeof(arguments[0]) == "number"){
	        		this.Initialize(arguments[0], arguments[1]);
	        	}else{
	        		this.Initialize((arguments[0] != null ? arguments[0].Count : 0), arguments[1]);
	        		if(arguments[0] != null){
		                /*IDictionaryEnumerator*/var e = arguments[0].GetEnumerator();
		                while (e.MoveNext()) this.Add(e.Key, e.Value); 
	        		}
	        	}
	        }
		},
		
 //		public Hashtable
		Initialize:function(/*int*/ capacity, /*float*/ loadFactor) {
            if (capacity < 0)
                throw new ArgumentOutOfRangeException("capacity", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (!(loadFactor >= 0.1 && loadFactor <= 1.0)) 
                throw new ArgumentOutOfRangeException("loadFactor", Environment.GetResourceString("ArgumentOutOfRange_HashtableLoadFactor", .1, 1.0));
 
            // Based on perf work, .72 is the optimal load factor for this table.
            this.loadFactor = 0.72 * loadFactor; 

            var rawsize = Math.ceil(capacity / this.loadFactor);
            if (rawsize > Number.MAX_INT)
                throw new ArgumentException(Environment.GetResourceString("Arg_HTCapacityOverflow")); 

            // Avoid awfully small sizes 
            var hashsize = (rawsize > InitialSize) ? HashHelpers.GetPrime(rawsize) : InitialSize; 
            this.buckets = []; //new bucket[hashsize];
            for(var i=0; i<hashsize; i++){
            	this.buckets[i] = new bucket();
            }
 
            this.loadsize = Math.ceil(this.loadFactor * hashsize);
            // Based on the current algorithm, loadsize must be less than hashsize.
        },
		
	       // �InitHash?is basically an implementation of classic DoubleHashing (see http://en.wikipedia.org/wiki/Double_hashing)
        // 
        // 1) The only �correctness?requirement is that the �increment?used to probe 
        //    a. Be non-zero
        //    b. Be relatively prime to the table size �hashSize? (This is needed to insure you probe all entries in the table before you �wrap?and visit entries already probed) 
        // 2) Because we choose table sizes to be primes, we just need to insure that the increment is 0 < incr < hashSize
        //
        // Thus this function would work: Incr = 1 + (seed % (hashSize-1))
        // 
        // While this works well for �uniformly distributed?keys, in practice, non-uniformity is common.
        // In particular in practice we can see �mostly sequential?where you get long clusters of keys that �pack? 
        // To avoid bad behavior you want it to be the case that the increment is �large?even for �small?values (because small 
        // values tend to happen more in practice). Thus we multiply �seed?by a number that will make these small values
        // bigger (and not hurt large values). We picked HashPrime (101) because it was prime, and if �hashSize-1?is not a multiple of HashPrime 
        // (enforced in GetPrime), then incr has the potential of being every value from 1 to hashSize-1. The choice was largely arbitrary.
        //
        // Computes the hash function:  H(key, i) = h1(key) + i*h2(key, hashSize).
        // The out parameter seed is h1(key), while the out parameter 
        // incr is h2(key, hashSize).  Callers of this function should
        // add incr each time through a loop. 
//        private uint 
		InitHash:function(/*Object*/ key, /*int*/ hashsize, /*out uint seed*/seedOut, /*out uint incr*/incrOut) { 
            // Hashcode must be positive.  Also, we must not use the sign bit, since
            // that is used for the collision bit. 
            var hashcode = this.GetHash(key) & 0x7FFFFFFF;
            seedOut.seed = hashcode;
            // Restriction: incr MUST be between 1 and hashsize - 1, inclusive for
            // the modular arithmetic to work correctly.  This guarantees you'll 
            // visit every bucket in the table exactly once within hashsize
            // iterations.  Violate this and it'll cause obscure bugs forever. 
            // If you change this calculation for h2(key), update putEntry too! 
            incrOut.incr = (1 + ((seedOut.seed * HashPrime) % (hashsize - 1)));
            return hashcode; 
        },

        // Adds an entry with the given key and value to this hashtable. An
        // ArgumentException is thrown if the key is null or if the key is already 
        // present in the hashtable.
        // 
//        public virtual void 
        Add:function(/*Object*/ key, /*Object*/ value) {
            this.Insert(key, value, true);
        },
 
        // Removes all entries from this hashtable.
//        public virtual void 
        Clear:function() { 
 
            if (this.count == 0 && this.occupancy == 0)
                return;

            for (var i = 0; i < this.buckets.length; i++){
            	this.buckets[i].hash_coll = 0; 
            	this.buckets[i].key = null;
            	this.buckets[i].val = null;
            }
 
            this.count = 0;
            this.occupancy = 0; 
            this.UpdateVersion(); 
        },
 
        // Clone returns a virtually identical copy of this hash table.  This does
        // a shallow copy - the Objects in the table aren't cloned, only the references 
        // to those Objects. 
//        public virtual Object 
        Clone:function()
        { 
            /*bucket[]*/var lbuckets = this.buckets;
            /*Hashtable*/ ht = new Hashtable(count,this._keycomparer);
            ht.version = this.version;
            ht.loadFactor = this.loadFactor; 
            ht.count = 0;
 
            var bucket = lbuckets.length; 
            while (bucket > 0) {
                bucket--; 
                var keyv = lbuckets[bucket].key;
                if ((keyv!= null) && (keyv != lbuckets)) {
                    ht[keyv] = lbuckets[bucket].val;
                } 
            }
 
            return ht; 
        },
 
        // Checks if this hashtable contains the given key.
//        public virtual bool 
        Contains:function(/*Object*/ key) {
            return this.ContainsKey(key); 
        }, 

        // Checks if this hashtable contains an entry with the given key.  This is 
        // an O(1) operation.
        //
//        public virtual bool 
        ContainsKey:function(/*Object*/ key) {
            if (key == null) { 
                throw new ArgumentNullException("key", Environment.GetResourceString("ArgumentNull_Key"));
            } 

            var seed; 
            var incr;
            var seedOut = {
            	"seed": seed
            };
            var incrOut = {
                "incr": incr
            };
            // Take a snapshot of buckets, in case another thread resizes table
            /*bucket[]*/var lbuckets = this.buckets;
            var hashcode = this.InitHash(key, lbuckets.length, /*out seed*/seedOut, /*out incr*/incrOut); 
            seed=seedOut.seed;
            incr=incrOut.incr;
            var  ntry = 0;
 
            /*bucket*/var b; 
            var bucketNumber = (seed % lbuckets.length);
            do { 
                b = lbuckets[bucketNumber];
                if (b.key == null) {
                    return false;
                } 
                if (((b.hash_coll &  0x7FFFFFFF) == hashcode) &&
                    this.KeyEquals (b.key, key)) 
                    return true; 
                bucketNumber = ((bucketNumber + incr)% lbuckets.length);
            } while (b.hash_coll < 0 && ++ntry < lbuckets.length); 
            return false;
        },

 

        // Checks if this hashtable contains an entry with the given value. The 
        // values of the entries of the hashtable are compared to the given value 
        // using the Object.Equals method. This method performs a linear
        // search and is thus be substantially slower than the ContainsKey 
        // method.
        //
//        public virtual bool 
        ContainsValue:function(/*Object*/ value) {
 
            if (value == null) {
                for (var i = this.buckets.length; --i >= 0;) { 
                    if (this.buckets[i].key != null && this.buckets[i].key != this.buckets && this.buckets[i].val == null) 
                        return true;
                } 
            }
            else {
                for (var i = this.buckets.length; --i >= 0;) {
                  var val = this.buckets[i].val; 
                  if (val!=null && val.Equals(value)) return true;
                } 
            } 
            return false;
        }, 

        // Copies the keys of this hashtable to a given array starting at a given
        // index. This method is used by the implementation of the CopyTo method in
        // the KeyCollection class. 
//        private void 
        CopyKeys:function(/*Array*/ array, /*int*/ arrayIndex) {

            /*bucket[]*/var lbuckets = this.buckets; 
            for (var i = lbuckets.length; --i >= 0;) {
                var keyv = lbuckets[i].key;
                if ((keyv != null) && (keyv != buckets)){
                    array.SetValue(keyv, arrayIndex++); 
                }
            } 
        }, 

        // Copies the keys of this hashtable to a given array starting at a given 
        // index. This method is used by the implementation of the CopyTo method in
        // the KeyCollection class.
//        private void 
        CopyEntries:function(/*Array*/ array, /*int*/ arrayIndex) {
 
            /*bucket[]*/var lbuckets = this.buckets; 
            for (var i = lbuckets.length; --i >= 0;) {
                var keyv = lbuckets[i].key; 
                if ((keyv != null) && (keyv != this.buckets)){
                    var entry = new DictionaryEntry(keyv,lbuckets[i].val);
                    array.SetValue(entry, arrayIndex++);
                } 
            }
        }, 
 
        // Copies the values in this hash table to an array at
        // a given index.  Note that this only copies values, and not keys. 
//        public virtual void 
        CopyTo:function(/*Array*/ array, /*int*/ arrayIndex)
        {
            if (array == null)
                throw new ArgumentNullException("array", Environment.GetResourceString("ArgumentNull_Array")); 
            if (array.Rank != 1)
                throw new ArgumentException(Environment.GetResourceString("Arg_RankMultiDimNotSupported")); 
            if (arrayIndex < 0) 
                throw new ArgumentOutOfRangeException("arrayIndex", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            this.CopyEntries(array, arrayIndex);
        }, 

        // Copies the values in this Hashtable to an KeyValuePairs array. 
        // KeyValuePairs is different from Dictionary Entry in that it has special 
        // debugger attributes on its fields.
 
//        internal virtual KeyValuePairs[] 
        ToKeyValuePairsArray:function() {

            /*KeyValuePairs[]*/var array = new KeyValuePairs[count];
            var index = 0; 
            /*bucket[]*/var lbuckets = this.buckets;
            for (var i = lbuckets.length; --i >= 0;) { 
                var keyv = lbuckets[i].key; 
                if ((keyv != null) && (keyv != buckets)){
                    array[index++] = new KeyValuePairs(keyv,lbuckets[i].val); 
                }
            }

            return array; 
        },
 
 
        // Copies the values of this hashtable to a given array starting at a given
        // index. This method is used by the implementation of the CopyTo method in 
        // the ValueCollection class.
//        private void 
        CopyValues:function(/*Array*/ array, /*int*/ arrayIndex) {

            /*bucket[]*/var lbuckets = this.buckets; 
            for (var i = lbuckets.length; --i >= 0;) { 
                var keyv = lbuckets[i].key;
                if ((keyv != null) && (keyv != this.buckets)){ 
                    array.SetValue(lbuckets[i].val, arrayIndex++);
                }
            }
        }, 

        // Returns the value associated with the given key. If an entry with the 
        // given key is not found, the returned value is null. 
        //
        Get:function(key) {
            if (key == null) {
                throw new ArgumentNullException("key", Environment.GetResourceString("ArgumentNull_Key"));
            } 

            var seed; 
            var incr;
            var seedOut = {
            	"seed": seed
            };
            var incrOut = {
                "incr": incr
            };
            // Take a snapshot of buckets, in case another thread resizes table
            /*bucket[]*/var lbuckets = this.buckets;
            var hashcode = this.InitHash(key, lbuckets.length, /*out seed*/seedOut, /*out incr*/incrOut); 
            seed=seedOut.seed;
            incr=incrOut.incr;
            var  ntry = 0;

            /*bucket*/var b; 
            var bucketNumber = (seed % lbuckets.length);
            do 
            {
                var currentversion;

                //     A read operation on hashtable has three steps: 
                //        (1) calculate the hash and find the slot number.
                //        (2) compare the hashcode, if equal, go to step 3. Otherwise end. 
                //        (3) compare the key, if equal, go to step 4. Otherwise end. 
                //        (4) return the value contained in the bucket.
                //     After step 3 and before step 4. A writer can kick in a remove the old item and add a new one 
                //     in the same bukcet. So in the reader we need to check if the hash table is modified during above steps.
                //
                // Writers (Insert, Remove, Clear) will set 'isWriterInProgress' flag before it starts modifying
                // the hashtable and will ckear the flag when it is done.  When the flag is cleared, the 'version' 
                // will be increased.  We will repeat the reading if a writer is in progress or done with the modification
                // during the read. 
                // 
                // Our memory model guarantee if we pick up the change in bucket from another processor,
                // we will see the 'isWriterProgress' flag to be true or 'version' is changed in the reader. 
                //
                var spinCount = 0;
                do {
                    // this is violate read, following memory accesses can not be moved ahead of it. 
                    currentversion = this.version;
                    b = lbuckets[bucketNumber]; 

                } while ( (currentversion != this.version) );

                if (b.key == null) { 
                    return null;
                } 
                if (((b.hash_coll & 0x7FFFFFFF) == hashcode) &&
                    this.KeyEquals (b.key, key))
                    return b.val;
                bucketNumber = ((bucketNumber + incr)% lbuckets.length); 
            } while (b.hash_coll < 0 && ++ntry < lbuckets.length);
            return null; 
        }, 

        Set:function(key, value) {
            this.Insert(key, value, false); 
        },
 
        // Increases the bucket count of this hashtable. This method is called from
        // the Insert method when the actual load factor of the hashtable reaches 
        // the upper limit specified when the hashtable was constructed. The number
        // of buckets in the hashtable is increased to the smallest prime number
        // that is larger than twice the current number of buckets, and the entries
        // in the hashtable are redistributed into the new buckets using the cached 
        // hashcodes.
//        private void 
        expand:function()  { 
            var rawsize = HashHelpers.ExpandPrime(this.buckets.length); 
            this.rehash(rawsize, false);
        }, 

        // We occationally need to rehash the table to clean up the collision bits.
//        private void 
        rehash:function() {
            this.rehash( this.buckets.length, false ); 
        },
 
//        private void 
        UpdateVersion:function() { 
            // Version might become negative when version is Int32.MaxValue, but the oddity will be still be correct.
            // So we don't need to special case this. 
        	this.version++;
        },

//        private void 
        rehash:function( /*int*/ newsize, /*bool*/ forceNewHashCode ) {
 
            // reset occupancy 
        	this.occupancy=0;
 
            // Don't replace any internal state until we've finished adding to the
            // new bucket[].  This serves two purposes:
            //   1) Allow concurrent readers to see valid hashtable contents
            //      at all times 
            //   2) Protect against an OutOfMemoryException while allocating this
            //      new bucket[]. 
            /*bucket[]*/var newBuckets = []; //new bucket[newsize]; 
            for(var i=0; i<newsize; i++){
            	newBuckets[i] = new bucket();
            }

            // rehash table into new buckets 
            var nb;
            for (nb = 0; nb < this.buckets.length; nb++){
                /*bucket*/var oldb = this.buckets[nb];
                if ((oldb.key != null) && (oldb.key != this.buckets)) { 
                    var hashcode = ((forceNewHashCode ? this.GetHash(oldb.key) : oldb.hash_coll) & 0x7FFFFFFF);
                    this.putEntry(newBuckets, oldb.key, oldb.val, hashcode); 
                } 
            }
 
            // New bucket[] is good to go - replace buckets and other internal state.
            this.buckets = newBuckets; 
            this.loadsize = Math.ceil(this.loadFactor * newsize); 
            this.UpdateVersion();
            // minimun size of hashtable is 3 now and maximum loadFactor is 0.72 now. 
//            Contract.Assert(loadsize < newsize, "Our current implementaion means this is not possible.");
            return; 
        },

        // Returns an enumerator for this hashtable. 
        // If modifications made to the hashtable while an enumeration is
        // in progress, the MoveNext and Current methods of the
        // enumerator will throw an exception.
        // 
//        IEnumerator IEnumerable.
        GetEnumerator:function() {
            return new HashtableEnumerator(this, HashtableEnumerator.DictEntry); 
        },

        // Internal method to get the hash code for an Object.  This will call 
        // GetHashCode() on each object if you haven't provided an IHashCodeProvider 
        // instance.  Otherwise, it calls hcp.GetHashCode(obj).
//        protected virtual int 
        GetHash:function(/*Object*/ key)
        { 
//            if (_keycomparer != null)
//                return _keycomparer.GetHashCode(key); 
            return key.GetHashCode(); 
        },
        
        // Internal method to compare two keys.  If you have provided an IComparer 
        // instance in the constructor, this method will call comparer.Compare(item, key). 
        // Otherwise, it will call item.Equals(key).
        // 
//        protected virtual bool 
        KeyEquals:function(/*Object*/ item, /*Object*/ key)
        {
//            Contract.Assert(key != null, "key can't be null here!");
            if( Object.ReferenceEquals(this.buckets, item)) { 
                return false;
            } 
 
            if (Object.ReferenceEquals(item,key))
                return true; 

//            if (_keycomparer != null)
//                return _keycomparer.Equals(item, key);
            return item == null ? false : item.Equals(key); 
        },
 
        // Inserts an entry into this hashtable. This method is called from the Set
        // and Add methods. If the add parameter is true and the given key already
        // exists in the hashtable, an exception is thrown.
//        private void 
        Insert:function(/*Object*/ key, /*Object*/ nvalue, /*bool*/ add) {
            // @ 
            if (key == null) { 
                throw new ArgumentNullException("key", Environment.GetResourceString("ArgumentNull_Key"));
            }
            if (this.count >= this.loadsize) { 
            	this.expand();
            } 
            else if(this.occupancy > this.loadsize && this.count > 100) { 
            	this.rehash();
            } 

            var seed; 
            var incr;
            var seedOut = {
            	"seed": seed
            };
            var incrOut = {
                "incr": incr
            };
            // Assume we only have one thread writing concurrently.  Modify 
            // buckets to contain new data, as long as we insert in the right order.
            var hashcode = this.InitHash(key, this.buckets.length, /*out seed*/seedOut, /*out incr*/incrOut); 
            seed=seedOut.seed;
            incr=incrOut.incr;
            
            var  ntry = 0; 
            var emptySlotNumber = -1; // We use the empty slot number to cache the first empty slot. We chose to reuse slots
            // create by remove that have the collision bit set over using up new slots. 
            var bucketNumber = (seed % this.buckets.length);
            do {

                // Set emptySlot number to current bucket if it is the first available bucket that we have seen 
                // that once contained an entry and also has had a collision.
                // We need to search this entire collision chain because we have to ensure that there are no 
                // duplicate entries in the table. 
                if (emptySlotNumber == -1 && (this.buckets[bucketNumber].key == this.buckets) 
                		&& (this.buckets[bucketNumber].hash_coll < 0))//(((buckets[bucketNumber].hash_coll & unchecked(0x80000000))!=0)))
                    emptySlotNumber = bucketNumber; 

                // Insert the key/value pair into this bucket if this bucket is empty and has never contained an entry
                // OR
                // This bucket once contained an entry but there has never been a collision 
                if ((this.buckets[bucketNumber].key == null) ||
                    (this.buckets[bucketNumber].key == this.buckets 
                    		&& ((this.buckets[bucketNumber].hash_coll & /*unchecked(*/0x80000000)/*)*/==0))) { 
 
                    // If we have found an available bucket that has never had a collision, but we've seen an available
                    // bucket in the past that has the collision bit set, use the previous bucket instead 
                    if (emptySlotNumber != -1) // Reuse slot
                        bucketNumber = emptySlotNumber;

                    // We pretty much have to insert in this order.  Don't set hash 
                    // code until the value & key are set appropriately.
                    this.buckets[bucketNumber].val = nvalue;
                    this.buckets[bucketNumber].key  = key;
                    this.buckets[bucketNumber].hash_coll |= hashcode;
                    this.count++; 
                    this.UpdateVersion();


                    return; 
                } 

                // The current bucket is in use 
                // OR
                // it is available, but has had the collision bit set and we have already found an available bucket
                if (((this.buckets[bucketNumber].hash_coll & 0x7FFFFFFF) == hashcode) &&
                		this.KeyEquals (this.buckets[bucketNumber].key, key)) { 
                    if (add) {
                        throw new ArgumentException(Environment.GetResourceString("Argument_AddingDuplicate__", buckets[bucketNumber].key, key)); 
                    } 
                    this.buckets[bucketNumber].val = nvalue;
                    this.UpdateVersion(); 
                    return; 
                }
 
                // The current bucket is full, and we have therefore collided.  We need to set the collision bit 
                // UNLESS
                // we have remembered an available slot previously. 
                if (emptySlotNumber == -1) {// We don't need to set the collision bit here since we already have an empty slot
                    if( this.buckets[bucketNumber].hash_coll >= 0 ) {
                    	this.buckets[bucketNumber].hash_coll |= 0x80000000;
                    	this.occupancy++; 
                    }
                } 
 
                bucketNumber = ((bucketNumber + incr)% this.buckets.length);
            } while (++ntry < this.buckets.length); 

            // This code is here if and only if there were no buckets without a collision bit set in the entire table
            if (emptySlotNumber != -1)
            { 
                // We pretty much have to insert in this order.  Don't set hash
                // code until the value & key are set appropriately. 
            	this.buckets[emptySlotNumber].val = nvalue;
            	this.buckets[emptySlotNumber].key  = key;
            	this.buckets[emptySlotNumber].hash_coll |= hashcode; 
                this.count++;
                this.UpdateVersion(); 

                return; 
            } 

            // If you see this assert, make sure load factor & count are reasonable. 
            // Then verify that our double hash function (h2, described at top of file)
            // meets the requirements described above. You should never see this assert.
//            Contract.Assert(false, "hash table insert failed!  Load factor too high, or our double hashing function is incorrect.");
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_HashInsertFailed")); 
        },
 
//        private void 
        putEntry:function(/*bucket[]*/ newBuckets, /*Object*/ key, /*Object*/ nvalue, /*int*/ hashcode) 
        {
//            Contract.Assert(hashcode >= 0, "hashcode >= 0");  // make sure collision bit (sign bit) wasn't set. 

            var seed = hashcode;
            var incr = (1 + ((seed * HashPrime) % (newBuckets.length - 1)));
            var bucketNumber = (seed % newBuckets.length); 
            do {
 
                if ((newBuckets[bucketNumber].key == null) || (newBuckets[bucketNumber].key == this.buckets)) { 
                    newBuckets[bucketNumber].val = nvalue;
                    newBuckets[bucketNumber].key = key; 
                    newBuckets[bucketNumber].hash_coll |= hashcode;
                    return;
                }
 
                if( newBuckets[bucketNumber].hash_coll >= 0 ) {
                newBuckets[bucketNumber].hash_coll |= 0x80000000; 
                    this.occupancy++; 
                }
                bucketNumber = ((bucketNumber + incr)% newBuckets.length); 
            } while (true);
        },

        // Removes an entry from this hashtable. If an entry with the specified 
        // key exists in the hashtable, it is removed. An ArgumentException is
        // thrown if the key is null. 
        // 
//        public virtual void 
        Remove:function(/*Object*/ key) { 
            if (key == null) {
                throw new ArgumentNullException("key", Environment.GetResourceString("ArgumentNull_Key"));
            }
//            Contract.Assert(!isWriterInProgress, "Race condition detected in usages of Hashtable - multiple threads appear to be writing to a Hashtable instance simultaneously!  Don't do that - use Hashtable.Synchronized.");
 
            var seed; 
            var incr;
            var seedOut = {
            	"seed": seed
            };
            var incrOut = {
                "incr": incr
            };
            // Assuming only one concurrent writer, write directly into buckets. 
            var hashcode = this.InitHash(key, this.buckets.length, /*out seed*/seedOut, /*out incr*/incrOut); 
            seed=seedOut.seed;
            incr=incrOut.incr;
            var ntry = 0;

            /*bucket*/var b; 
            var bn = (seed % this.buckets.length);  // bucketNumber
            do { 
                b = this.buckets[bn]; 
                if (((b.hash_coll & 0x7FFFFFFF) == hashcode) &&
                		this.KeyEquals (b.key, key)) { 
                    // Clear hash_coll field, then key, then value
                	this.buckets[bn].hash_coll &= 0x80000000; 
                    if (this.buckets[bn].hash_coll != 0) { 
                    	this.buckets[bn].key = this.buckets;
                    } 
                    else {
                    	this.buckets[bn].key = null;
                    }
                    this.buckets[bn].val = null;  // Free object references sooner & simplify ContainsValue. 
                    this.count--;
                    this.UpdateVersion(); 
                    return;
                }
                bn = ((bn + incr)% this.buckets.length); 
            } while (b.hash_coll < 0 && ++ntry < this.buckets.length);
 
            //throw new ArgumentException(Environment.GetResourceString("Arg_RemoveArgNotFound")); 
        }
	});
	
	Object.defineProperties(Hashtable.prototype,{
        // Is this Hashtable read-only?
//        public virtual bool 
		IsReadOnly: {
            get:function() { return false; }
        }, 

//        public virtual bool 
        IsFixedSize: { 
            get:function() { return false; } 
        },
        
        // Returns a collection representing the keys of this hashtable. The order 
        // in which the returned collection represents the keys is unspecified, but
        // it is guaranteed to be          buckets = newBuckets; the same order in which a collection returned by 
        // GetValues represents the values of the hashtable.
        //
        // The returned collection is live in the sense that any changes
        // to the hash table are reflected in this collection.  It is not 
        // a static copy of all the keys in the hash table.
        // 
//        public virtual ICollection 
        Keys: { 
            get:function() {
                if (this.keys == null) this.keys = new KeyCollection(this);
                    return this.keys; 
            }
        } ,
 
        // Returns a collection representing the values of this hashtable. The
        // order in which the returned collection represents the values is 
        // unspecified, but it is guaranteed to be the same order in which a
        // collection returned by GetKeys represents the keys of the
        // hashtable.
        // 
        // The returned collection is live in the sense that any changes
        // to the hash table are reflected in this collection.  It is not 
        // a static copy of all the keys in the hash table. 
        //
//        public virtual ICollection 
        Values: { 
            get:function() { 
                if (this.values == null) this.values = new ValueCollection(this);
                    return this.values; 
            } 
        },
        
        // Returns the number of associations in this hashtable.
        //
//        public virtual int 
        Count: { 
            get:function() { return this.count; }
        },
        
//        protected IEqualityComparer 
        EqualityComparer: 
        { 
            get:function()
            { 
                return this._keycomparer;
            }
        }
		  
	});
	
	Hashtable.Type = new Type("Hashtable", Hashtable, [IDictionary.Type]);
	return Hashtable;
});

 