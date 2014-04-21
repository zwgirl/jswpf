/**
 * ListDictionary
 */

define(["dojo/_base/declare", "system/Type", "collections/IDictionary", "collections/ICollection",
        "collections/IDictionaryEnumerator", "collections/IEnumerator", "collections/DictionaryEntry"], 
		function(declare, Type, IDictionary, ICollection,
				IDictionaryEnumerator, IEnumerator, DictionaryEntry){
	
//	private class 
	var NodeEnumerator = declare(IDictionaryEnumerator, {
		constructor:function(/*ListDictionary*/ list) {
            this.list = list; 
            this.version = this.list.version;
            this.start = true;
            this.current = null;
        }, 

//        public bool 
        MoveNext:function() {
            if (this.version != this.list.version) { 
                throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumFailedVersion));
            } 
            if (this.start) { 
            	this.current = this.list.head;
            	this.start = false; 
            }
            else if (this.current != null) {
            	this.current = this.current.next;
            } 
            return (this.current != null);
        }, 

//        public void 
        Reset:function() {
            if (version != this.list.version) { 
                throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumFailedVersion));
            }
            this.start = true;
            this.current = null; 
        }
	});
	
	Object.defineProperties(NodeEnumerator.prototype, {
		
//		public object 
		Current: { 
            get:function() { 
                return this.Entry;
            } 
        },

//        public DictionaryEntry 
        Entry: {
            get:function() { 
                if (this.current == null) {
                    throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumOpCantHappen)); 
                } 
                return new DictionaryEntry(current.key, current.value);
            } 
        },

//        public object 
        Key: {
            get:function() { 
                if (this.current == null) {
                    throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumOpCantHappen)); 
                } 
                return this.current.key;
            } 
        },

//        public object 
        Value: {
            get:function() { 
                if (this.current == null) {
                    throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumOpCantHappen)); 
                } 
                return this.current.value;
            } 
        }
	});
	
//        ListDictionary list;
//        DictionaryNode current;
//        int version; 
//        bool start;
	 
//    private class 
    var NodeKeyValueCollection =declare(ICollection, {
    	constructor:function(/*ListDictionary*/ list, /*bool*/ isKeys) {
            this.list = list; 
            this.isKeys = isKeys; 
        },

//        void ICollection.
        CopyTo:function(/*Array*/ array, /*int*/ index)  {
            if (array==null)
                throw new ArgumentNullException("array");
            if (index < 0) 
                throw new ArgumentOutOfRangeException("index", SR.GetString(SR.ArgumentOutOfRange_NeedNonNegNum));
            for (var node = list.head; node != null; node = node.next) { 
                array.SetValue(isKeys ? node.key : node.value, index); 
                index++;
            } 
        },
//        IEnumerator IEnumerable.
        GetEnumerator:function() { 
            return new NodeKeyValueEnumerator(this.list, this.isKeys);
        } 
    });
    
    Object.defineProperties(NodeKeyValueCollection.prototype, {

//        int ICollection.
        Count: {
            get:function() { 
                var count = 0;
                for (/*DictionaryNode*/var node = this.list.head; node != null; node = node.next) { 
                    count++; 
                }
                return count; 
            }
        }

    });
//        ListDictionary list;
//        bool isKeys;

        


    var NodeKeyValueEnumerator =declare(IEnumerator, {
    	constructor:function(/*ListDictionary*/ list, /*bool*/ isKeys) {
            this.list = list;
            this.isKeys = isKeys;
            this.version = list.version; 
            this.start = true;
            this.current = null; 
        },

//        public bool 
        MoveNext:function() { 
            if (this.version != list.version) {
                throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumFailedVersion));
            }
            if (this.start) { 
            	this.current = list.head;
            	this.start = false; 
            } 
            else if (current != null) {
            	this.current = this.current.next; 
            }
            return (this.current != null);
        },

//        public void 
        Reset:function() {
            if (version != list.version) { 
                throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumFailedVersion)); 
            }
            this.start = true; 
            this.current = null;
        }
    });        
    
    Object.defineProperties(NodeKeyValueEnumerator.prototype, {
//    	public object 
    	Current: { 
            get:function() {
                if (this.current == null) {
                    throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumOpCantHappen));
                } 
                return isKeys ? this.current.key : this.current.value;
            } 
        } 
    });
//    ListDictionary list; 
//    DictionaryNode current;
//    int version; 
//    bool isKeys; 
//    bool start;

//    private class 
    var DictionaryNode = declare(null, { });
    Object.defineProperties(DictionaryNode.prototype, {
//        public object 
        key:
        {
        	get:function(){
        		return this._key;
        	},
        	set:function(value){
        		this._key = value;
        	}
        },
//        public object 
        value:
        {
        	get:function(){
        		return this._value;
        	},
        	set:function(value){
        		this._value = value;
        	}
        },
//        public DictionaryNode 
        next:
        {
        	get:function(){
        		return this._next;
        	},
        	set:function(value){
        		this._next = value;
        	}
        }
    });
    
	var ListDictionary = declare("ListDictionary", IDictionary,{
		constructor:function(/*IComparer*/ comparer){
			if(comparer === undefined){
				comparer = null;
			}
			
//	        DictionaryNode 
			this.head = null;
//	        int 
			this.version = 0;
//	        int 
			this.count = 0; 
//	        IComparer 
			this.comparer = comparer;
		},
		
		//
//      /// <devdoc> 
//      ///    <para>[To be supplied.]</para>
//      /// </devdoc>
//      public ListDictionary() {
//      } 
//
//      /// <devdoc> 
//      ///    <para>[To be supplied.]</para> 
//      /// </devdoc>
//      public ListDictionary(IComparer comparer) { 
//          this.comparer = comparer;
//      }
		Get:function() {
            if (key == null) { 
                throw new ArgumentNullException("key", SR.GetString(SR.ArgumentNull_Key));
            }
            /*DictionaryNode*/var node = this.head;
            if (this.comparer == null) { 
                while (node != null) {
                    var oldKey = node.key; 
                    if ( oldKey!= null && oldKey.Equals(key)) { 
                        return node.value;
                    } 
                    node = node.next;
                }
            }
            else { 
                while (node != null) {
                    var oldKey = node.key; 
                    if (oldKey != null && this.comparer.Compare(oldKey, key) == 0) { 
                        return node.value;
                    } 
                    node = node.next;
                }
            }
            return null; 
        },
        Set:function(key, value) { 
            if (key == null) { 
                throw new ArgumentNullException("key", SR.GetString(SR.ArgumentNull_Key));
            } 
            this.version++;
            /*DictionaryNode*/var last = null;
            /*DictionaryNode*/var node;
            for (node = this.head; node != null; node = node.next) { 
                var oldKey = node.key;
                if ((this.comparer == null) ? oldKey.Equals(key) : this.comparer.Compare(oldKey, key) == 0) { 
                    break; 
                }
                last = node; 
            }
            if (node != null) {
                // Found it
                node.value = value; 
                return;
            } 
            // Not found, so add a new one 
            /*DictionaryNode*/var newNode = new DictionaryNode();
            newNode.key = key; 
            newNode.value = value;
            if (last != null) {
                last.next = newNode;
            } 
            else {
            	this.head = newNode; 
            } 
            this.count++;
        },
        
        /// <devdoc> 
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
//        public void 
        Add:function(/*object*/ key, /*object*/ value) { 
            if (key == null) {
                throw new ArgumentNullException("key", SR.GetString(SR.ArgumentNull_Key));
            }
            this.version++; 
            /*DictionaryNode*/var last = null;
            /*DictionaryNode*/var node; 
            for (node = this.head; node != null; node = node.next) { 
                var oldKey = node.key;
                if ((this.comparer == null) ? oldKey.Equals(key) : this.comparer.Compare(oldKey, key) == 0) { 
                    throw new ArgumentException(SR.GetString(SR.Argument_AddingDuplicate));
                }
                last = node;
            } 
            // Not found, so add a new one
            /*DictionaryNode*/var newNode = new DictionaryNode(); 
            newNode.key = key; 
            newNode.value = value;
            if (last != null) { 
                last.next = newNode;
            }
            else {
            	this.head = newNode; 
            }
            this.count++; 
        }, 

        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
//        public void 
        Clear:function() {
        	this.count = 0; 
        	this.head = null;
        	this.version++; 
        }, 

        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
//        public bool 
        Contains:function(/*object*/ key) {
            if (key == null) { 
                throw new ArgumentNullException("key", SR.GetString(SR.ArgumentNull_Key));
            } 
            for (/*DictionaryNode*/var node = this.head; node != null; node = node.next) { 
                var oldKey = node.key;
                if ((this.comparer == null) ? oldKey.Equals(key) : this.comparer.Compare(oldKey, key) == 0) { 
                    return true;
                }
            }
            return false; 
        },
 
        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc> 
//        public void 
        CopyTo:function(/*Array*/ array, /*int*/ index)  {
            if (array==null)
                throw new ArgumentNullException("array");
            if (index < 0) 
                throw new ArgumentOutOfRangeException("index", SR.GetString(SR.ArgumentOutOfRange_NeedNonNegNum));
 
            if (array.Length - index < this.count) 
                throw new ArgumentException(SR.GetString(SR.Arg_InsufficientSpace));
 
            for (var node = this.head; node != null; node = node.next) {
                array.SetValue(new DictionaryEntry(node.key, node.value), index);
                index++;
            } 
        },
 
        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc> 
//        public IDictionaryEnumerator 
        GetEnumerator:function() {
            return new NodeEnumerator(this);
        },
        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
//        public void 
        Remove:function(/*object*/ key) {
            if (key == null) { 
                throw new ArgumentNullException("key", SR.GetString(SR.ArgumentNull_Key));
            } 
            this.version++; 
            var last = null;
            var node; 
            for (node = this.head; node != null; node = node.next) {
                var oldKey = node.key;
                if ((this.comparer == null) ? oldKey.Equals(key) : this.comparer.Compare(oldKey, key) == 0) {
                    break; 
                }
                last = node; 
            } 
            if (node == null) {
                return; 
            }
            if (node == this.head) {
            	this.head = node.next;
            } else { 
                last.next = node.next;
            } 
            this.count--; 
        }
		
	});
	
	Object.defineProperties(ListDictionary.prototype,{
		/// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
//        public int 
        Count: { 
            get:function() { 
                return this.count;
            } 
        },

        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
//        public ICollection 
        Keys: { 
            get:function() { 
                return new NodeKeyValueCollection(this, true);
            } 
        },

        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
//        public bool 
        IsReadOnly: { 
            get:function() { 
                return false;
            } 
        },

        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
//        public bool 
        IsFixedSize: { 
            get:function() { 
                return false;
            } 
        },

        /// <devdoc> 
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
//        public ICollection 
        Values: { 
            get:function() {
                return new NodeKeyValueCollection(this, false);
            }
        }, 

	});
	
	ListDictionary.Type = new Type("ListDictionary", ListDictionary, [IDictionary.Type]);
	return ListDictionary;
});
 
        

